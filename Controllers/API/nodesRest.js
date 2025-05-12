const nodesService = require("../../Service/nodesService")

/**
 * Method that returns the list of nodes from a specific scenario.
 * 
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
async function getScenarioInternalNodes(req,res){
    try{
        let scenarioId = req.params.scenarioId;
        let regionId = 1; //must be changed
        let result = await nodesService.getInternalNodes(scenarioId,regionId);
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

module.exports = {
    getScenarioInternalNodes
};