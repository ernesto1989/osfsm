/**
 * This file contains the logic to manage internal nodes.
 */
const { __ } = require("i18n");
const constants = require("../../constants");
const scenariosService = require("../../Service/scenarioService")
const utils = require("./utilities")


/**
 * Redirects to the home page of the project.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function scenarioNodes(req,res){
    const sessionData = req.session;
    
    if (!sessionData.isLoggedIn) {
        return res.redirect(constants.contextURL+"/login");
    }

    session = await utils.getSessionInfo(req);
    let template_engine_object;
    let scenarioId = req.params.scenarioId;
    if(user.role_id == 2 || user.role_id == 3){
        template_engine_object = {
            region_id:user.region_id,
            region_name:user.region_name,
            home_url:constants.contextURL,
            scenario_id: scenarioId
        };
    }
        
    res.render('nodes',template_engine_object);
}

module.exports =  {
    scenarioNodes
}