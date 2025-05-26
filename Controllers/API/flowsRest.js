const flowsService = require("../../Service/flowsService")
const utilities = require("../Templates/utilities")

/**
 * Method that returns the list of flows from a specific scenario.
 * 
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
async function getScenarioFlows(req,res){
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
        let result = await flowsService.getFlows(scenarioId,regionId);
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
 * Endpoint that handles Flow table modifications.
 * 
 * Changes can be:
 * a) New records -> New Records must be identified and sotred
 * b) Updates
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function saveFlow(req,res){
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

        let flow = req.body;
        const region_id = session.region_id;
        let result;
        if(!flow.new_record){
            //update
            result = await flowsService.updateFlow(flow,region_id);
            res.status(200);
            res.json({
                "status"  : "success",
                "total"   : result.length,
                "records" : []
            });          
        }else{
            //insert
            result = await flowsService.insertFlow(flow,region_id);
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
async function deleteFlow(req,res){
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
        
        let flow = req.body;
        let result = await flowsService.deleteFlow(flow);
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
    getScenarioFlows, saveFlow,deleteFlow
};