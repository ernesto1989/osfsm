/**
 * Router configuration file for the specific web application.
 * 
 * 1. Imports the corresponding express library and router.
 * 2. Reads the templates handler file
 * 3. Reads the api handler file
 * 4. Defines a Generic Upload File Rest Service that redirects to a specific 
 *    Upload handler
 * 
 * Ernesto Cantú
 * 07/10/2024
 */
const express = require('express');
const loginControllers = require('./Templates/loginController');
const userControllers = require('./Templates/userController');
const homeControllers = require('./Templates/homeController');
const nodesControllers = require('./Templates/nodesController');
const consumersControllers = require('./Templates/consumersController');
const flowsControllers = require('./Templates/flowsController');
const cconditionControllers = require('./Templates/cconditionController');
const constants = require("../constants");
const scenariosApi = require("./API/scenariosRest");
const nodesApi = require("./API/nodesRest");
const consumersRest = require("./API/consumersRest");
const flowsRest = require("./API/flowsRest");
const conditionEvalRest = require("./API/conditionEvaluationRest")

const router = express.Router();

/**
 * Middleware to validate user session and authentication on UI
 * @param {*} req
 * @param {*} res 
 * @param {*} next 
 */
function authUser(req,res,next){
    const sessionData = req.session;
    if (!sessionData.isLoggedIn) {
        return res.redirect(constants.contextURL+"/login");
    }
    next();
}

/**
 * Middleware to validate user session and authentication on API.
 * Decided to do two middlewares, one for UI and one for API to particularly redirect or respond with an error
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function authAPI(req,res,next){
    const sessionData = req.session;
    if (!sessionData.isLoggedIn) {
        let jsonError = {
            "status"  : "Unauthorized",
            "message" : "Need to login"
        };
        res.status(401);
        res.send(jsonError);
        return;
    }
    next();
}


/*TEMPLATES routes */
router.get(constants.contextURL+'/login', loginControllers.getLogin);
router.post(constants.contextURL+'/login', loginControllers.postLogin);
router.get(constants.contextURL+'/logout', loginControllers.logout);
router.get(constants.indexURL, homeControllers.index);
router.get(constants.contextURL,authUser, homeControllers.homePage);
router.get(constants.contextURL + '/:scenarioId/nodes', authUser,nodesControllers.scenarioNodes);
router.get(constants.contextURL + '/:scenarioId/consumers', authUser,consumersControllers.scenarioConsumers);
router.get(constants.contextURL + '/:scenarioId/flows', authUser,flowsControllers.scenarioFlows);
router.get(constants.contextURL + '/:scenarioId/ccondition', authUser,cconditionControllers.scenarioCurrentCondition);
router.get(constants.contextURL+'/lang', userControllers.lang);


/* Scenarios API routes */
router.get(constants.contextURL + constants.apiURL + "/getSummary/:scenarioId",authAPI,scenariosApi.getScenarioSumary);
router.post(constants.contextURL + constants.apiURL + "/createScenario",authAPI,scenariosApi.createScenario);
router.post(constants.contextURL + constants.apiURL + "/deleteScenario",authAPI,scenariosApi.deleteScenario);

/* Container nodes API routes */
router.get(constants.contextURL + constants.apiURL + "/getNodes/:scenarioId",authAPI,nodesApi.getScenarioNodes);
router.post(constants.contextURL + constants.apiURL + "/saveNode",authAPI,nodesApi.saveNode);
router.post(constants.contextURL + constants.apiURL + "/deleteNode",authAPI,nodesApi.deleteNode);

/* Consumer nodes API routes */
router.get(constants.contextURL + constants.apiURL + "/getConsumers/:scenarioId",authAPI,consumersRest.getScenarioNodes);
router.post(constants.contextURL + constants.apiURL + "/saveConsumer",authAPI,consumersRest.saveNode);
router.post(constants.contextURL + constants.apiURL + "/deleteConsumer",authAPI,consumersRest.deleteNode);

/* Consumer nodes API routes */
router.get(constants.contextURL + constants.apiURL + "/getFlows/:scenarioId",authAPI,flowsRest.getScenarioFlows);
router.post(constants.contextURL + constants.apiURL + "/saveFlow",authAPI,flowsRest.saveFlow);
router.post(constants.contextURL + constants.apiURL + "/deleteFlow",authAPI,flowsRest.deleteFlow);

/* Condition Evaluation API routes */
router.get(constants.contextURL + constants.apiURL + "/evaluate/:scenarioId",authAPI,conditionEvalRest.computeCurrentState);

module.exports = router;