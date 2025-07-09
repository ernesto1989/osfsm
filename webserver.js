/**
 * General Web server configuration file.
 * 
 * 1. Imports the express library.
 * 2. Configures ejs as template engine
 * 3. Configures cors and body parser for the server
 * 4. Defines static files folder as /public
 * 5. Imports the web specific project router and configure the server with the router
 * 6. Starts the server in the given port.
 * 
 * Ernesto Cantú
 * 07/10/2024
 */
const constants = require("./constants")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const i18n = require('i18n');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const router = require("./Controllers/router");

const SECRET = process.env.SECRET;


/**
 * Session configuration function. First if sets the session configuration object.
 * After it, it creates a middleware that will catch all requests and check the Request url.
 * 
 * If request url is one of the given public paths, it will skip the session middleware (provided in the router file).
 * If the request url is not one of the public paths, it will use the session middleware to handle the session.
 * 
 * @param {Object} app
 */
function configureSecurity(app){
    app.use (session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
    }));

    const contextURL = constants.contextURL;
    app.use((req, res, next) => {
        if(req.path.startsWith(contextURL + '/login') || req.path.startsWith(contextURL + '/logout') 
            || req.path.startsWith(contextURL + '/lang/') || req.path.startsWith('/public/')) {    
            next();
        } else{
            session()(req,res,next); // Use session middleware for other routes
        }
    });
}

/**
 * Method that creates a middleware that will detect anny request that contains a language
 * @param {*} app 
 */
function configureInternationalization(app){
    i18n.configure({
        locales: ["es","en"],                   // Languages you support
        directory: path.join(__dirname, 'locales'), // Where translation files live
        defaultLocale: 'es',     
        retryInDefaultLocale: true,          // Default language
        queryParameter: 'lang',                  // So you can switch with ?lang=es
        autoReload: true,
        syncFiles: true,
        cookie: 'locale'
    });

    app.use(i18n.init);

    app.use((req, res, next) => {
        /*
            This middleware is executed before every URL.
            Searches for a language cookie. 
            Sets the language before responding the request.

            Whenever receives a request on /OSF/{lang}/* will set a new languaje.
            Redirect to a specific URL to manage languages and let the rest of the request
            be handled by cookie.
        */
        let lang;
        const langFromUrl  = req.url.match(/^\/OSF\/(en|es)(\/|$)/);

        if (langFromUrl) {
            lang = langFromUrl[1];
            req.url = req.url.replace(`/OSF/${lang}`, '/OSF'); // Strip the lang from the URL
            res.cookie('locale', lang, { maxAge: 900000, httpOnly: false }); // set the cookie 
        } else if(req.cookies.locale && ['en', 'es'].includes(req.cookies.locale)) {
            lang = req.cookies.locale;
        }else{
            lang = 'en';
        }
        res.setLocale(lang);
        res.locals.lang = lang;
        res.locals.__ = res.__;
        next();
    });
}

/**
 * Method that configures EJS as template engine and sets the static files folder to "/public".
 * It also sets the router to handle the requests.
 * 
 * @param {*} app 
 */
function configStaticFilesAndVies(app){
    app.set('view engine', 'ejs');
    app.use(express.static('./public'));
    app.use(router);
}

/**
 * Server configuration function.
 * It configures the server with cors and body parser.
 * @param {*} app 
 */
function configureServer(app){
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
}

/**
 * Function that creates the server and configures it with the needed middleware.
 * @returns Server object
 */
function createServer(){
    const app = express();
    configureServer(app); //body parser, corse and cookie parser
    configureSecurity(app); //session handling and security middleware
    configureInternationalization(app); //language support
    configStaticFilesAndVies(app); // template engine, static files and router
    const server = require('http').createServer(app); // runs server with express app
    return server;
}


/**
 * Web project initialization function.
 * 
 * 1. Creates and configures the server.
 * 2. Starts the web socket server.
 * 3. Starts the server in the given port.
 * 
 * @param {Object} app 
 */
function initWebProject(){
    const server = createServer();    
    server.listen(constants.port, () => {
        console.log(`OSF Scenario Manager service running on port ${constants.port}`);
    });
}

module.exports = {initWebProject};