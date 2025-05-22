const dataSource = require('../Datasource/MySQLMngr');



const scenarioSumaryQuery = 
`   SELECT 
        z01.scenario_id,
        z01.cdate,
        z01.description,
        z01.\`type\`,
        z01.capacity_units,
        (select unit_value from x01_units x01 where x01.id = z01.capacity_units) as capacity_in,
        z01.time_units,
        (select unit_value from x01_units x01 where x01.id = z01.time_units) as time_in,
        z01a.scenario_id as origin_id,
        (select count(*) from a01b_container_nodes a01 where a01.scenario_id = z01.scenario_id and a01.region_id = z01.region_id) as container_nodes,
        (select count(*) from a01c_consumer_nodes a01 where a01.scenario_id = z01.scenario_id and a01.region_id = z01.region_id) as consumer_nodes,
        (select count(*) from a02_flows a02 where a02.scenario_id = z01.scenario_id and a02.region_id = z01.region_id) as flows, 
        (select sum(current_flow) from a02_flows a02 where a02.scenario_id = z01.scenario_id and a02.region_id = z01.region_id and origin_type = 1 ) as system_inputs,
        (select sum(current_flow) from a02_flows a02 where a02.scenario_id = z01.scenario_id and a02.region_id = z01.region_id and origin_type = 3 ) as system_outpus,
        z01.recalc_trl, 
        z01.recalc_solution
    FROM z01_scenarios z01 
    left join z01_scenarios z01a on z01a.scenario_id = z01.origin_id and z01a.region_id = z01.region_id
    where z01.scenario_id = ? and z01.region_id = ?
    order by z01.cdate asc
`;


let scenarioMapQuery = `
    select 
        a01b.node_id,
        a01b.description,
        a01b.Lat,
        a01b.\`Long\` 
    from a01b_container_nodes a01b 
    where a01b.scenario_id = ? and a01b.region_id = ?
`


/**
 * Service that obtains the whole Scenario's list. This is for Main UI purposes.
 * 
 * For more specific (and with wider information) scenario search, use these methods:
 * 
 * 1. ...
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
 * This method obtains a scenario object by its id.
 * 
 * @param {String} scenarioId The scenario Id
 * @returns the scenario object
 */
async function getScenarioSumary(scenarioId,region_id){
    try{
        let query = scenarioSumaryQuery;
        let params = [scenarioId,region_id]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * This method obtains a scenario nodes for map rendering
 * 
 * @param {String} scenarioId The scenario Id
 * @param {String} region_id The users region
 * @returns the scenario object
 */
async function getScenarioMap(scenarioId,region_id){
    try{
        let query = scenarioMapQuery;
        let params = [scenarioId,region_id]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that clones an existing scenario
 * @param {*} scenarioId new ID
 * @param {*} baseId origin id
 * @param {*} region_id user's region
 * @returns 
 */
async function cloneScenario(scenarioId,description,baseId,region_id){
    try{
        let query = 'call create_scenario(?,?,?,?)';
        let params = [scenarioId,description,baseId,region_id]
        qResult = await dataSource.getDataWithParams(query,params);
        let status = qResult.rows[0][0].STATUS;
        if(status == 'OK'){
            return new dataSource.QueryResult(true,1,0,0,'');
        }else{
            return new dataSource.QueryResult(false,null,0,0,err);
        }
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

 /**
  * Service that deletes a scenario by its ID
  * @param {Sting} scenarioId The scenario ID
  * @returns The confirmation of deleted scenario
  */
 async function deleteScenario(scenarioId,region_id){
    try{
        let query = 'call delete_scenario(?,?)';;
        let params = [scenarioId,region_id];
        qResult = await dataSource.getDataWithParams(query,params);
        let status = qResult.rows[0][0].STATUS;
        if(status == 'OK'){
            return new dataSource.QueryResult(true,1,0,0,'');
        }else{
            return new dataSource.QueryResult(false,null,0,0,err);
        }
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

module.exports = {getScenariosList, getScenarioSumary, getScenarioMap,cloneScenario, deleteScenario,getScenarioCapacityUnits,getScenarioTimeUnits};