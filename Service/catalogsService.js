/**
 * File that holds all the possible catalog interactions required by the system.
 * 
 * Implemented Methods:
 * 
 * * 1. getFlowTypes: Gets the flow types from the database.
 * * 2. getCapacityUnits: Gets the capacity units from the database.
 * * 3. getTimeUnits: Gets the time units from the database.
 * * 4. getContainerTypes: Gets the container types from the database.
 * * 5. getConsumerTypes: Gets the consumer types from the database.
 * 
 * @module Service/catalogsService
 * @requires Datasource/MySQLMngr
 *  
 * Ernesto Cantú
 */
const dataSource = require('../Datasource/MySQLMngr');

const getTypesQuery = "SELECT id as type_id,name as type FROM x05_flow_types"
const getUnitsQuery = "SELECT unit_value FROM x01_units WHERE unit_type = ?";
const getContainerTypesQuery = "SELECT id,type FROM x03_container_types";
const getConsumerTypesQuery = "SELECT id,type FROM x04_consumer_types";

/**
 * Method that extracts from the database the possible flow types
 * @returns 
 */
async function getFlowTypes(){
    try{
        let query = getTypesQuery;
        let qResult = await dataSource.getData(query);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
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
        let qResult = await dataSource.getDataWithParams(query,params);
        return  qResult;
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
        let qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that extracts from the database the possible container nodes the the system manages.
 * @returns list of container types
 */
async function getContainerTypes(){
    try{
        let query = getContainerTypesQuery;
        let qResult = await dataSource.getData(query);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that extracts from the database the possible consumer nodes the the system manages.
 * @returns list of consumer types
 */
async function getConsumerTypes(){
    try{
        let query = getConsumerTypesQuery;
        let qResult = await dataSource.getData(query);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}


module.exports = {
    getFlowTypes,getCapacityUnits,getTimeUnits,getContainerTypes,getConsumerTypes
}