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
const constants = require("../constants");
const nodesApi = require("./API/internalNodesRest");

const router = express.Router();

/*TEMPLATES routes */
router.get(constants.contextURL+'/login', loginControllers.getLogin);
router.post(constants.contextURL+'/login', loginControllers.postLogin);
router.get(constants.contextURL+'/logout', loginControllers.logout);
router.get(constants.indexURL, homeControllers.index);
router.get(constants.contextURL, homeControllers.homePage);
router.get(constants.contextURL + '/:scenarioId/nodes', nodesControllers.scenarioNodes);
router.get(constants.contextURL+'/lang', userControllers.lang);



/*Container nodes API routes */
router.get(constants.contextURL + constants.apiURL + "/getNodes/:scenarioId",nodesApi.getScenarioInternalNodes);
router.post(constants.contextURL + constants.apiURL + "/saveNode",nodesApi.saveNode);
router.post(constants.contextURL + constants.apiURL + "/deleteNode",nodesApi.deleteNode);

module.exports = router;