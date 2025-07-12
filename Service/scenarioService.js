const dataSource = require('../Datasource/MySQLMngr');



const scenarioSumaryQuery = 
`   SELECT 
        z01.scenario_id,
        z01.description,
        (
        	(select count(*) from a01a_generator_nodes a01 where a01.scenario_id = z01.scenario_id and a01.region_id = z01.region_id) +
        	(select count(*) from a01b_container_nodes a01 where a01.scenario_id = z01.scenario_id and a01.region_id = z01.region_id)
        )as container_nodes,
        (select count(*) from a01c_consumer_nodes a01 where a01.scenario_id = z01.scenario_id and a01.region_id = z01.region_id) as consumer_nodes,
        (select count(*) from a02_flows a02 where a02.scenario_id = z01.scenario_id and a02.region_id = z01.region_id) as flows,
        2 AS warnings, -- hardcoded for now,
        (
        	select (sum(a01.current_vol)/sum(max_capacity))*100 from a01b_container_nodes a01 where a01.scenario_id = z01.scenario_id and a01.region_id = z01.region_id
        ) as current_vol,
        x01_c.unit_value as capacity_units,
        x01_t.unit_value as time_units,
        z02.state as system_state,
        z02.risk_node,
        z02.critical_time 
    FROM z01_scenarios z01 
    left join z01_scenarios z01a on z01a.scenario_id = z01.origin_id and z01a.region_id = z01.region_id
    join z02_current_condition_summary z02 on z02.scenario_id = z01.scenario_id and z02.region_id = z01.region_id
    join x01_units x01_c on x01_c.id = z01.capacity_units
    join x01_units x01_t on x01_t.id = z01.time_units
    where z01.scenario_id = ? and z01.region_id = ?
    order by z01.cdate asc
`;

const nodesSummaryQuery = `
    select 
      z03.node_id,
      z03.min_vol,
      z03.current_vol,
      z03.max_vol,
      CASE 
      	when z03.incoming_flow = z03.outcoming_flow then 'Stable'
      	when z03.incoming_flow > z03.outcoming_flow then 'Filling'
      	when z03.incoming_flow < z03.outcoming_flow then 'Draining'
      END as node_state,      
      z03.time_to_reach_limit
    from z03_current_state_detail z03
    where z03.scenario_id = ? and z03.region_id = ?
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
        let query = "SELECT scenario_id,scenario_name,description from z01_scenarios where region_id = ?";
        let params = [region_id]
        let qResult = await dataSource.getDataWithParams(query,params);
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
        let qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that obtains the nodes summary for a specific scenario.
 * @param {*} scenarioId 
 * @param {*} region_id 
 * @returns 
 */
async function getScenarioNodesSummary(scenarioId,region_id){
    try{
        let query = nodesSummaryQuery
        let params = [scenarioId,region_id]
        let qResult = await dataSource.getDataWithParams(query,params);
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
async function cloneScenario(scenarioName,description,baseId,region_id){
    try{
        let query = 'call create_scenario(?,?,?,?,@scenarioId)';
        let params = [scenarioName,description,baseId,region_id];

        let qResult = await dataSource.callProcedure(query,params); //is this correct? how do I get the error
        let resultSet = qResult.rows[0][0];
        
        if(resultSet.STATUS == 'OK'){
            const newScenarioId = resultSet.scenario_id;
            return new dataSource.QueryResult(true,1,newScenarioId,0,'');
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
        let qResult = await dataSource.getDataWithParams(query,params);
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

module.exports = {getScenariosList, getScenarioSumary,cloneScenario, deleteScenario,getScenarioNodesSummary};