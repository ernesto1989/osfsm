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
const security = require('./Security/sessionValidation');
const constants = require("../constants");
const scenariosApi = require("./API/scenariosRest");

const router = express.Router();


/*Public tempate routes */
router.get(constants.contextURL+'/login', loginControllers.getLogin); //doesn't need authUser middleware
router.post(constants.contextURL+'/login', loginControllers.postLogin);//doesn't need authUser middleware
router.get(constants.contextURL+'/logout', loginControllers.logout);//doesn't need authUser middleware
router.get(constants.contextURL+'/lang', userControllers.lang);//doesn't need authUser middleware

/* Session template routes  */
router.get(constants.indexURL,security.authUser, homeControllers.index);
router.get(constants.contextURL,security.authUser, homeControllers.homePage);


/* Scenarios API routes */
router.get(constants.contextURL + constants.apiURL + "/getSummary/:scenarioId",security.authAPI,scenariosApi.getScenarioSumary);
router.post(constants.contextURL + constants.apiURL + "/createScenario",security.authAPI,scenariosApi.createScenario);
router.post(constants.contextURL + constants.apiURL + "/deleteScenario",security.authAPI,scenariosApi.deleteScenario);


module.exports = router;