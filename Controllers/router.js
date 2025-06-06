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

/*TEMPLATES routes */
router.get(constants.contextURL+'/login', loginControllers.getLogin);
router.post(constants.contextURL+'/login', loginControllers.postLogin);
router.get(constants.contextURL+'/logout', loginControllers.logout);
router.get(constants.indexURL, homeControllers.index);
router.get(constants.contextURL, homeControllers.homePage);
router.get(constants.contextURL + '/:scenarioId/nodes', nodesControllers.scenarioNodes);
router.get(constants.contextURL + '/:scenarioId/consumers', consumersControllers.scenarioConsumers);
router.get(constants.contextURL + '/:scenarioId/flows', flowsControllers.scenarioFlows);
router.get(constants.contextURL + '/:scenarioId/ccondition', cconditionControllers.scenarioCurrentCondition);
router.get(constants.contextURL+'/lang', userControllers.lang);


/* Scenarios API routes */
router.get(constants.contextURL + constants.apiURL + "/getSummary/:scenarioId",scenariosApi.getScenarioSumary);
router.post(constants.contextURL + constants.apiURL + "/createScenario",scenariosApi.createScenario);
router.post(constants.contextURL + constants.apiURL + "/deleteScenario",scenariosApi.deleteScenario);

/* Container nodes API routes */
router.get(constants.contextURL + constants.apiURL + "/getNodes/:scenarioId",nodesApi.getScenarioNodes);
router.post(constants.contextURL + constants.apiURL + "/saveNode",nodesApi.saveNode);
router.post(constants.contextURL + constants.apiURL + "/deleteNode",nodesApi.deleteNode);

/* Consumer nodes API routes */
router.get(constants.contextURL + constants.apiURL + "/getConsumers/:scenarioId",consumersRest.getScenarioNodes);
router.post(constants.contextURL + constants.apiURL + "/saveConsumer",consumersRest.saveNode);
router.post(constants.contextURL + constants.apiURL + "/deleteConsumer",consumersRest.deleteNode);

/* Consumer nodes API routes */
router.get(constants.contextURL + constants.apiURL + "/getFlows/:scenarioId",flowsRest.getScenarioFlows);
router.post(constants.contextURL + constants.apiURL + "/saveFlow",flowsRest.saveFlow);
router.post(constants.contextURL + constants.apiURL + "/deleteFlow",flowsRest.deleteFlow);

/* Condition Evaluation API routes */
router.get(constants.contextURL + constants.apiURL + "/evaluate/:scenarioId",conditionEvalRest.computeCurrentState);

module.exports = router;