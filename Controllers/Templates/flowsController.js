/**
 * This file contains the logic to manage internal nodes.
 */
const { __ } = require("i18n");
const constants = require("../../constants");
const scenariosService = require("../../Service/scenarioService")
const catalogsService = require("../../Service/catalogsService")
const flowsService = require ('../../Service/flowsService')
const utils = require("./utilities")


/**
 * Redirects to the home page of the project.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function scenarioFlows(req,res){
    const sessionData = req.session;
    
    if (!sessionData.isLoggedIn) {
        return res.redirect(constants.contextURL+"/login");
    }
    let session = await utils.getSessionInfo(req);
    let scenarioId = req.params.scenarioId;
    let flowTypes = (await catalogsService.getFlowTypes()).getRows();
    let capacityUnits = (await scenariosService.getScenarioCapacityUnits(session.region_id,scenarioId)).getRows()[0];
    let timeUnits = (await scenariosService.getScenarioTimeUnits(session.region_id,scenarioId)).getRows()[0];
    let containerTypes = (await catalogsService.getContainerTypes()).getRows();
    let generatorNodes = (await flowsService.getGeneratorNodes(scenarioId,session.region_id)).getRows();
    let containerNodes = (await flowsService.getContainerNodes(scenarioId,session.region_id)).getRows();
    let consumerNodes = (await flowsService.getConsumerNodes(scenarioId,session.region_id)).getRows();

    //get input and output nodes
    let template_engine_object = {
        region_id:session.region_id,
        region_name:session.region_name,
        home_url:constants.contextURL,
        scenario_id: scenarioId,
        flow_types:flowTypes,
        capacity_units:capacityUnits.unit_value,
        time_units: timeUnits.unit_value,
        container_types: containerTypes,
        generator_nodes:generatorNodes,
        container_nodes: containerNodes,
        consumer_nodes: consumerNodes
    };
        
    res.render('flows',template_engine_object);
}

module.exports =  {
    scenarioFlows
}