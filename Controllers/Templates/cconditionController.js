/**
 * This file contains the logic to manage internal nodes.
 */
const { __ } = require("i18n");
const constants = require("../../constants");
const utils = require("./utilities")
const ccService = require("../../Service/conditionEvaluationService");


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

    let summary = await ccService.getCurrentConditionSummary(scenarioId,session.region_id);
    summary.system_current_vol_perc = (summary.current_vol / summary.total_cap) * 100;
    summary.system_empty_perc = 100 - summary.system_current_vol_perc;
    details = await ccService.getCurrentConditionDetails(scenarioId,session.region_id);
    summary.details = details;

    let template_engine_object = {
        region_id:session.region_id,
        region_name:session.region_name,
        home_url:constants.contextURL,
        scenario_id: scenarioId,
        summary: summary
    };
        
    res.render('ccondition',template_engine_object);
}

module.exports =  {
    scenarioCurrentCondition
}