/**
 * This file handles all user required controllers 
 */

const { __ } = require("i18n");
const constants = require("../../constants")


/**
 * Method that handles the Get Language UI, for the user to select desired language-
 * @param {*} req 
 * @param {*} res 
 */
async function lang(req,res){
    res.render('lang'); // must include the lang.ejs file in views folder
}


module.exports = {
    lang
}