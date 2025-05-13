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
const templates = require('./Templates/templates');
const constants = require("../constants");
const nodesApi = require("./API/nodesRest");

const router = express.Router();

/*TEMPLATES routes */
router.get(constants.indexURL, templates.index);
router.get(constants.contextURL+'/login', templates.getLogin);
router.post(constants.contextURL+'/login', templates.postLogin);
router.get(constants.contextURL+'/logout', templates.logout);
router.get(constants.contextURL, templates.homePage);
router.get(constants.contextURL + '/:scenarioId/nodes', templates.scenarioNodes);
router.get(constants.contextURL+'/lang', templates.lang);



/*API routes */
router.get(constants.contextURL + constants.apiURL + "/getNodes/:scenarioId",nodesApi.getScenarioInternalNodes);

module.exports = router;