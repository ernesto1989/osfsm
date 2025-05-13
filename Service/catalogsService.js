const dataSource = require('../Datasource/MySQLMngr');

const getTypesQuery = "SELECT id as type_id,name as type FROM x05_flow_types"
const getUnitsQuery = "SELECT unit_value FROM x01_units WHERE unit_type = ?";

/**
 * Method that extracts from the database the possible flow types
 * @returns 
 */
async function getFlowTypes(){
    try{
        let query = getTypesQuery;
        qResult = await dataSource.getData(query);
        return qResult.rows;
    }catch(err){
        return [];
    }
}

/**
 * Method that extracts from the database the possible capacity units the the system manages.
 * @returns list of capacity units
 */
async function getCapacityUnits(){
    try{
        let query = getUnitsQuery;
        let params = ['capacity'];
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that extracts from the database the possible time units the the system manages.
 * @returns list of time units
 */
async function getTimeUnits(){
    try{
        let query = getUnitsQuery;
        let params = ['time'];
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

module.exports = {
    getFlowTypes,getCapacityUnits,getTimeUnits
}