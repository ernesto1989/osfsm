/**
 * Current State Evaluation Rest API
 * 
 * Contains all the HTTP methods that are used to manage the Current State of a given Scenario
 * 
 * Implemented methods:
 * 
 * 1. getCurrentStateSummary: Gets a scenario's full current stat summary by its ID.
 * 2. computeCurrentState: Calls the Python Web Service to compute the Scenario's current state (simulator)
 * 
 * @module Controllers/API/conditionEvaluationRest
 * @requires Service/scenarioService
 * @requires Controllers/Templates/utilities
 * 
 * Ernesto Cantú
 */
const conditionEvaluationService = require("../../Service/conditionEvaluationService")
const utilities = require("../Templates/utilities")



/**
 * Method that searches the current state summary on the database
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Scenarios computed current state
 */
async function getCurrentStateSummary(req,res){
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

        //call the service to obtain current state

        res.status(200);
        res.json({
            "status"  : "success",
            "summary" : []//scenarioSumary.getRows()[0]
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
 * Method that executes the Scenario's Current State Computing by
 * obtaining the scenarios nodes and flows.
 * 
 * After obtaining them:
 * 
 * 1. Computes the currents state calling the python service
 * 2. Deletes the current information on the Database
 * 3. Inserts the new information.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function computeCurrentState(req,res){
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
        
        try{
            //call the python service to compute current state
            let currentStateCalc = await conditionEvaluationService.computeCurrentstate(scenarioId,regionId);
            if(currentStateCalc.status == 200){
                res.status(200);
                res.json({
                    "status"  : "success",
                    "summary" : []//scenarioSumary.getRows()[0]
                });
            }else{
                throw new Error("Python Web Service unavailable"); // this must force the catch and respond with 500
            }
        }catch(err){
            throw new Error("Python Web Service unavailable");
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


module.exports = {
    getCurrentStateSummary,
    computeCurrentState
}