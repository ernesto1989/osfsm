/**
 * File that handles login requests.
 * 
 * Implemented Methods:
 * 1. Get Login - Access login template
 * 2. Post Login - Manages login information and creates sessions
 * 3. Logout - Signs out the current user.
 */
const { __ } = require("i18n");
const constants = require("../../constants")
const userServices = require("../../Service/usersService");

/**
 * Metod that shows the login view.
* @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function getLogin(req,res){
    let template_engine_object = {
        home_url:constants.contextURL
    };
    res.render('login',template_engine_object);
}


/**
 * Method thad handles login post requests.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function postLogin(req,res){
    const { username, password } = req.body;
    const user = await userServices.isValidUser(username, password);
    // Authenticate user
    if (user) {
        req.session.isLoggedIn = true;
        user.role = { id: user.role_id, name: user.role_name };
        if(user.role_id == 2 ){
            user.region = { id: user.region_id, name: user.region_name };
        }
        req.session.user = user;
        res.redirect(constants.contextURL);
    } else {
        res.redirect(constants.contextURL+'/login'); //how do I notify that the user is not valid?
    }
}

/**
 * Method that handles the logout request.
 * 
 * It just destroys the session and redirects to the login page.
 * Nothing so fancy here.
 * 
 * @param {Object} req Client Request
 * @param {Object} res Server Response
 */
async function logout(req,res){
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
            res.redirect(constants.contextURL+'/login');
        }
    });
}

module.exports = {
    getLogin,
    postLogin,
    logout
}