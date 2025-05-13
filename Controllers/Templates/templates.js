/**
 * Templates file handler.
 * 
 * It defines async functions to handle template GET requests.
 * Each function handles a single template in the /Ewiki/views
 * folder.
 * 
 * It uses ejs template engine.
 * 
 * Ernesto Cantú
 * 07/10/2024
 */
const { __ } = require("i18n");
const constants = require("../../constants")

const userServices = require("../../Service/usersService")
const catalogsService = require("../../Service/catalogsService")
const scenariosService = require("../../Service/scenarioService")

//Catalogs lists
let capacity_units = []
let time_units = []
let flowTypes = [];

/**
 * Method that initializes the capacity_units, time_units and types lists.
 */
async function loadLists(){
    flowTypes = await catalogsService.getFlowTypes();
    cu = await catalogsService.getCapacityUnits();
    tu = await catalogsService.getTimeUnits();

    for(i=0;i<cu.length;i++)
        capacity_units.push(cu[i].unit_name);

    for(i=0;i<tu.length;i++)
        time_units.push(tu[i].unit_name);
}

loadLists();

/**
 * Metod that shows the login view.
* @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function getLogin(req,res){
    let template_engine_object = {
        home_url:constants.contextURL
    };
    res.render('login',template_engine_object);
}


/**
 * Method thad handles login post requests.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function postLogin(req,res){
    const { username, password } = req.body;

    user = await userServices.isValidUser(username, password);

    // Authenticate user
    if (user) {
        req.session.isLoggedIn = true;
        user.role = { id: user.role_id, name: user.role_name };
        if(user.role_id == 2 ){
            user.region = { id: user.region_id, name: user.region_name };
        }
        req.session.user = user;

        res.redirect(constants.contextURL);
    } else {
        res.redirect(constants.contextURL+'/login');
    }
}

/**
 * Method that handles the logout request.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function logout(req,res){
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
            res.redirect(constants.contextURL+'/login');
        }
    });
}


/**
 * Index handler. It redirects to the main route of the project.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function index(req,res){
    res.redirect(constants.contextURL);
}

/**
 * Redirects to the home page of the project.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function homePage(req,res){
    const sessionData = req.session;

    if (!sessionData.isLoggedIn) {
        return res.redirect(constants.contextURL+"/login");
    }

    user = req.session.user;
    let session =  {
        username: user.username,
        name: user.name,
        role_id: user.role.id,
        role: user.role.name
    };

    let scenariosList = [];
    if(user.role_id == 2 || user.role_id == 3){
        session.region_id = user.region_id;
        session.region_name = user.region_name;
        scenariosList = await scenariosService.getScenariosList(user.region_id);
    }

    let template_engine_object = {
        home_url:constants.contextURL,
        scenarios: scenariosList.getRows(),
        user_info:session
    };
    res.render('index',template_engine_object);
}

/**
 * Redirects to the home page of the project.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function scenarioNodes(req,res){
    let scenarioId = req.params.scenarioId;
    
    let template_engine_object = {
        region_name:'Demo City',
        home_url:constants.contextURL,
        scenarios: 
        {scenario_id:scenarioId}
    };
    res.render('nodes',template_engine_object);
}

async function lang(req,res){
    res.render('lang');
}


module.exports = {index,homePage, getLogin, postLogin, logout, scenarioNodes, lang};