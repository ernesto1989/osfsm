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
//const socketServer = require("./socketserver");
const session = require('express-session');
const router = require("./Controllers/router");

const SECRET = process.env.SECRET;

/**
 * WebSocket configuration function.
 * @param {Object} server 
 */
function configureWebSocket(server){
    //socketServer.initWebSocket(server);   
    console.log("Nothing here yet");
}

/**
 * Session configuration function.
 * @param {Object} app
 */
function configureSecurity(app){
    app.use (session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
    }));

    //this middleware checks the url path and applies session only to specific routes
    //This is to avoid session creation for public routes like login, logout, lang and public
    app.use((req, res, next) => {
        if(req.path.startsWith('/OSF/login') || req.path.startsWith('/OSF/logout') 
            || req.path.startsWith('/OSF/lang/') || req.path.startsWith('/public/')) {    
            // Allow access to these paths without session
            next();
        } else{
            // if the path is not one of the public ones, use session middleware, which will be applied to all other routes
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
 * Static files and views configuration function.
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
    configureServer(app);
    configureSecurity(app);
    configureInternationalization(app);
    configStaticFilesAndVies(app);
    const server = require('http').createServer(app);
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
    configureWebSocket(server);
    
    server.listen(constants.port, () => {
        console.log(`OSF Scenario Manager service running on port ${constants.port}`);
    });
}

module.exports = {initWebProject};