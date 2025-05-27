/**
 * Module that handles the Nodes REST API.
 * 
 * Basic CRUD operations for Nodes in a scenario.
 * For all nodes, it uses the sent scenario ID to filter the nodes.
 * Takes the region ID from the session to ensure that the operations are scoped to the correct region.
 * 
 * This module provides endpoints to:
 * 
 * * 1. Get nodes for a scenario
 * * 2. Save a node (insert or update)
 * * 3. Delete a node
 * 
 * @module Controllers/API/nodesRest
 * @requires Service/nodesService
 * @requires Controllers/Templates/utilities
 * Ernesto Cantú
 */
const nodesService = require("../../Service/nodesService")
const utilities = require("../Templates/utilities")

/**
 * Method that returns the list of nodes from a specific scenario.
 * 
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
async function getScenarioNodes(req,res){
    try{    
        if (!req.session.isLoggedIn) {
            let jsonError = {
                "status"  : "Unauthorized",
                "message" : "Need to login"
            };
            res.status(401);
            res.send(jsonError);
            return;
        }
        let session = await utilities.getSessionInfo(req);
        let scenarioId = req.params.scenarioId;
        let regionId = session.region_id;
        let result = await nodesService.getNodes(scenarioId,regionId);
        let scenarioNodes = result.getRows();
        res.status(200);
        res.json({
            "status"  : "success",
            "total"   : result.getRows().length,
            "records" : scenarioNodes
        });
    }catch(error){
        let jsonError = {
            "status"  : "error",
            "message" : error.message
        };
        console.log(error);
        res.status(500);
        res.send(jsonError);
    }
}


/**
 * Endpoint that handles Nodes table modifications.
 * 
 * Changes can be:
 * a) New records -> New Records must be identified and sotred
 * b) Updates
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function saveNode(req,res){
    try{
        if (!req.session.isLoggedIn) {
            let jsonError = {
                "status"  : "Unauthorized",
                "message" : "Need to login"
            };
            res.status(401);
            res.send(jsonError);
            return;
        }
        let session = await utilities.getSessionInfo(req);

        let node = req.body;
        const region_id = session.region_id;
        let result;
        if(!node.new_record){
            //update
            result = await nodesService.updateNode(node,region_id);  
            res.status(200);
            res.json({
                "status"  : "success",
                "total"   : result.length,
                "records" : []
            });          
        }else{
            //insert
            result = await nodesService.insertNode(node,region_id);
            res.status(200);
            res.json({
                "status"  : "success",
                "total"   : result.changes,
                "records" : []
            });
        }
        //let message = {action:'update_scenario',scenario_id:node.scenario_id};
        //socketServer.sendMessageToUser(sessionData.user.username,JSON.stringify(message));
    }catch(error){
        let jsonError = {
            "status"  : "error",
            "message" : error.message
        };
        console.log(error);
        res.status(500);
        res.send(jsonError);
    }
}

/**
 * Method that handles nodes delete
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function deleteNode(req,res){
    try{
        if (!req.session.isLoggedIn) {
            let jsonError = {
                "status"  : "Unauthorized",
                "message" : "Need to login"
            };
            res.status(401);
            res.send(jsonError);
            return;
        }
        let session = await utilities.getSessionInfo(req);
        
        let node = req.body;
        const region_id = session.region_id;
        let result = await nodesService.deleteNode(node,region_id);
        //await flowsService.deleteFlowsByNodeIn(node,region_id);
        //await flowsService.deleteFlowsByNodeOut(node,region_id);
       
        res.status(200);
        res.json({
            "status"  : "success",
            "total"   : result.changes,
            "records" : []
        });
        //let message = {action:'update_scenario',scenario_id:node.scenario_id};
        //socketServer.sendMessageToUser(sessionData.user.username,JSON.stringify(message));
    }catch(error){
        let jsonError = {
            "status"  : "error",
            "message" : error.message
        };
        console.log(error);
        res.status(500);
        res.send(jsonError);
    }
}

module.exports = {
    getScenarioNodes,saveNode,deleteNode
};