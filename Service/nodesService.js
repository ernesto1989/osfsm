const dataSource = require('../Datasource/MySQLMngr');

const getInternalNodesQuery = 
`
    select 
        a01.scenario_id as scenario_id,
        a01.region_id as region_id,
        a01.id as id,
        a01.id as recid,
        a01.node_id,
        a01.node_type,
        x02.\`type\`,
        a01.description,
        a01a.container_type,
        x03.\`type\` as container_type,
        a01a.min_capacity,
        a01a.current_vol,
        a01a.max_capacity 
    from a01_nodes a01
    join x02_node_types x02 on x02.id = a01.node_type 
    join a01a_container_nodes a01a on a01a.region_id = a01.region_id  and a01a.scenario_id = a01.scenario_id and a01a.node_id = a01.id 
    join x03_container_types x03 on x03.id = a01a.container_type
    where a01.scenario_id = ? and a01.region_id = ?
`


/**
 * This method gets the nodes list
 * 
 * @param {*} scenarioId the scenario id
 * @returns the list of nodes in the scenario.
 */
async function getInternalNodes(scenarioId,region_id){
    try{
        let query = getInternalNodesQuery;
        let params = [scenarioId,region_id]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

module.exports = {getInternalNodes}