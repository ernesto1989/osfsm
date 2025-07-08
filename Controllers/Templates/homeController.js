/**
 * File that contains the methods that handle main window access.
 * Usefull when have multiple entry points based on user's role.
 */
const { __ } = require("i18n");
const constants = require("../../constants");
const scenariosService = require("../../Service/scenarioService")
//const catalogsService = require("../../Service/catalogsService")
const utils = require("./utilities")


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
    let session = await utils.getSessionInfo(req);

    let scenariosList = [];
    if(session.role_id == 2 || session.role_id == 3){
        scenariosList = await scenariosService.getScenariosList(session.region_id);
    }

    let template_engine_object = {
        home_url:constants.contextURL,
        base_scenario: constants.BASE_SCENARIO_ID,
        region_id:session.region_id,
        region_name:session.region_name,
        scenarios: scenariosList.getRows(),
        user_info:session,
        capacity_units: utils.capacity_units,
        time_units: utils.time_units
    };

    res.render('index',template_engine_object);
}


module.exports = {
    index,
    homePage
}