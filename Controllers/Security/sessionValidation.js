/**
 * File that holds the session validation middlewares available for the project.
 * 
 * There are 2 middlewares:
 * 1. authUser: Validates the user session and authentication on UI.
 * 2. authAPI: Validates the user session and authentication on API.
 * 
 * I've decided to do it this way to particularly redirect or respond with an error
 * depending on the context (UI or API).
 * 
 * It might change in the future, but for now it works this way.
 */

const constants = require("../../constants");

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


module.exports = {
    authUser,
    authAPI
};