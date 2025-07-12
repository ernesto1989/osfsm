/**
 * File that handles shared functionality accross different controllers.
 * 
 */
const catalogsService = require("../../Service/catalogsService")

let capacity_units = []
let time_units = []
let flow_types = [];

/**
 * Method that extracts the user from the given request.
 * specifically, it extracts:
 * 
 * 1. username
 * 2. users name
 * 3. role id
 * 4. role name (or profile)
 * 
 * @param {*} req user's request.
 * @returns {Object} session object with the user information.
 */
async function getSessionInfo(req){
    const user = req.session.user;
    let session =  {
        username: user.username,
        name: user.name,
        role_id: user.role.id,
        role: user.role.name
    };

    if(user.role_id == 2 || user.role_id == 3){
        session.region_id = user.region_id;
        session.region_name = user.region_name;
    }

    return session;
}

/**
 * Method that initializes the capacity_units, time_units and types lists.
 */
async function loadLists(){
    let flowTypes = (await catalogsService.getFlowTypes()).getRows();
    let cu = (await catalogsService.getCapacityUnits()).getRows();
    let tu = (await catalogsService.getTimeUnits()).getRows();

    for(let i=0;i<cu.length;i++)
        capacity_units.push(cu[i].unit_value);

    for(let i=0;i<tu.length;i++)
        time_units.push(tu[i].unit_value);
    
    for(let i = 0;i<flowTypes;i++)
        flow_types.push(flowTypes[i].type)
}

loadLists();


module.exports = {
    capacity_units,
    time_units,
    flow_types,
    getSessionInfo
}