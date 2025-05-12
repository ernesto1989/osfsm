/**
 * OSF Scenario Manager - Version 3.0 
 * 
 * UI Web Project Main File.
 * 
 * This is the new version of the OSF Scenario Manager web project, holding a new structure for the
 * web server.
 * 
 * New features:
 * 1. Language support with i18n
 * 2. New server configuration, based on functions that handle specific tasks.
 * 3. New UI.
 * 
 * First file version: 07/15/2024
 * Current date: 05/01/2025
 * 
 * Ernesto Cantú
 */

const server = require("./webserver");
server.initWebProject();

