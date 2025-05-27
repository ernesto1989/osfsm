/**
 * Scenarios Rest API.
 * 
 * Contains all the HTTP methods that are used to manage scenarios.
 * 
 * Implemented methods:
 * 
 * 1. getScenarioSumary: Gets a scenario's full summary by its ID.
 * 2. createScenario: Creates a new scenario by cloning an existing one. Not supporting yect other types of creation.
 * 3. deleteScenario: Deletes a scenario by its ID.
 * 
 * Pending methods:
 * 1. Create Scenario Current Condition (simulator state).
 * 2. Create Scenario Solution.
 * 3. Create other types of scenarios. Considering upload from files.
 * 
 * @module Controllers/API/scenariosRest
 * @requires Service/scenarioService
 * @requires Controllers/Templates/utilities
 * 
 * Ernesto Cantú
 */
const scenarioService = require("../../Service/scenarioService")
const utilities = require("../Templates/utilities")

// const nodesService = require("../../Service/nodesService")
// const flowsService = require("../../Service/flowsService")
// const socketServer = require("../../socketserver");
// const axios = require('axios')

/**
 * Method that gets a scenario by its ID
 * @param {Object} req Request Object
 * @param {Object} res Response to the client.
 */
async function getScenarioSumary(req,res){
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
        const scenarioSumary = await scenarioService.getScenarioSumary(scenarioId,regionId);
        const scenarioMap = await scenarioService.getScenarioMap(scenarioId,regionId);

        res.status(200);
        res.json({
            "status"  : "success",
            "summary" : scenarioSumary.getRows()[0],
            "map": scenarioMap.getRows()
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
 * Method that handles Scenario Creation
 * @param {Object} req Request Object
 * @param {Object} res Response to the client.
 */
async function createScenario(req,res){
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
        let scenario = req.body;
        let type = scenario.type;
        let scenarioId = scenario.scenario_id;
        let desc = scenario.description;
        let originId = scenario.base_scenario_id;
        let regionId = session.region_id;
        
        if(type == 1){
            //clone
            const cloning = await scenarioService.cloneScenario(scenarioId,desc,originId,regionId);
            if(cloning.getStatus()){
                res.status(200);
                res.json({
                    "status"  : "success",
                    "total"   : cloning.getChanges()
                });
                return;
            }else{
                res.status(500);
                res.json({
                    "status"  : "error",
                    "total"   : cloning.getErr()
                });
                return;
            }
        }else{
            //not supported yet
            console.log("not supported yet")
        }
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
 * Method that handles Scenario Elimination
 * @param {Object} req Request Object
 * @param {Object} res Response to the client.
 */
async function deleteScenario(req,res){
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
        let scenario = req.body;
        let scenarioId = scenario.scenario_id;
        let regionId = session.region_id;
        
        const deleteScenario = await scenarioService.deleteScenario(scenarioId,regionId);
        if(deleteScenario.getStatus()){
            res.status(200);
            res.json({
                "status"  : "success",
                "total"   : 1
            });
            return;
        }else{
            res.status(500);
            res.json({
                "status"  : "error",
                "total"   : deleteScenario.getErr()
            });
            return;
        }
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

module.exports = {getScenarioSumary,createScenario,deleteScenario};