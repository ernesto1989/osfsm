const dataSource = require('../Datasource/MySQLMngr');


/**
 * Service that obtains the whole Scenario's list
 * 
 * @returns a list of available scenarios in the Database.
 */
async function getScenariosList(region_id){
    try{
        let query = "SELECT scenario_id,description from z01_scenarios where region_id = ?";
        let params = [region_id]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Service that obtains the scenario's capacity unit
 * 
 * @returns a list of available scenarios in the Database.
 */
async function getScenarioCapacityUnits(region_id,scenario_id){
    try{
        let query = "SELECT unit_value from x01_units where id = (select capacity_units from z01_scenarios where region_id = ? and scenario_id = ?)";
        let params = [region_id,scenario_id]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Service that obtains the scenario's time unit
 * 
 * @returns a list of available scenarios in the Database.
 */
async function getScenarioTimeUnits(region_id,scenario_id){
    try{
        let query = "SELECT unit_value from x01_units where id = (select time_units from z01_scenarios where region_id = ? and scenario_id = ?)";
        let params = [region_id,scenario_id]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

module.exports = {getScenariosList,getScenarioCapacityUnits,getScenarioTimeUnits};