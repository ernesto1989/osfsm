/**
 * This file contains the logic to manage consumer nodes.
 */
const { __ } = require("i18n");
const constants = require("../../constants");
const scenariosService = require("../../Service/scenarioService")
const catalogsService = require("../../Service/catalogsService")
const utils = require("./utilities")


/**
 * Redirects to the home page of the project.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function scenarioConsumers(req,res){
    const sessionData = req.session;
    
    if (!sessionData.isLoggedIn) {
        return res.redirect(constants.contextURL+"/login");
    }
    let session = await utils.getSessionInfo(req);
    let scenarioId = req.params.scenarioId;
    let capacityUnits = (await scenariosService.getScenarioCapacityUnits(session.region_id,scenarioId)).getRows()[0]
    let consumerTypes = (await catalogsService.getConsumerTypes()).getRows();
    let template_engine_object = {
        region_id:session.region_id,
        region_name:session.region_name,
        home_url:constants.contextURL,
        scenario_id: scenarioId,
        capacity_units:capacityUnits.unit_value,
        consumer_types: consumerTypes
    };
        
    res.render('consumers',template_engine_object);
}

module.exports =  {
    scenarioConsumers
}