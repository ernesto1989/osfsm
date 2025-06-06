/**
 * This file contains the logic to manage internal nodes.
 */
const { __ } = require("i18n");
const constants = require("../../constants");
const utils = require("./utilities")


/**
 * Redirects to the home page of the project.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function scenarioCurrentCondition(req,res){
    const sessionData = req.session;
    
    if (!sessionData.isLoggedIn) {
        return res.redirect(constants.contextURL+"/login");
    }
    let session = await utils.getSessionInfo(req);
    let scenarioId = req.params.scenarioId;
    
    let template_engine_object = {
        region_id:session.region_id,
        region_name:session.region_name,
        home_url:constants.contextURL,
        scenario_id: scenarioId
    };
        
    res.render('ccondition',template_engine_object);
}

module.exports =  {
    scenarioCurrentCondition
}