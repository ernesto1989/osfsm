/**
 * Method that holds every required service for consumer node's management.
 * 
 * Implemented Methods:
 * 
 * * 1. getNodes: Gets the nodes from the database.
 * * 2. insertNode: Inserts a new node into the database.
 * * 3. updateNode: Updates a node in the database.
 * * 4. deleteNode: Deletes a node from the database.
 * 
 * @module Service/nodesService
 * @requires Datasource/MySQLMngr
 * Ernesto Cantú
 */
const dataSource = require('../Datasource/MySQLMngr');

const getConsumersQuery = 
`
    select 
        a01.id as recid, -- just for W2UI
        a01.node_id,
        a01.node_type as node_type_id,
        x02.\`type\` as node_type,
        a01.consumer_type as consumer_type_id,
        x04.\`type\` as consumer_type,
        a01.description,
        a01.supply_requirement,
        a01.supply_policy,
        a01.Lat,
        a01.\`Long\` 
    from a01c_consumer_nodes a01 
    join x02_node_types x02 on x02.id = a01.node_type 
    join x04_consumer_types x04 on x04.id = a01.consumer_type
    where a01.scenario_id = ? and a01.region_id = ?
`;


/**
 * This method gets the consumer nodes list
 * 
 * @param {*} scenarioId the scenario id
 * @returns the list of nodes in the scenario.
 */
async function getConsumers(scenarioId,region_id){
    try{
        let query = getConsumersQuery;
        let params = [scenarioId,region_id]
        let qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * This method inserts a consumer node on the database
 * @param {*} node comming from the UI
 * @param {*} region_id user's region
 * @returns 
 */
async function insertConsumer(node,region_id){
    try{
        let insertA01C = 
        `
            INSERT INTO a01c_consumer_nodes(scenario_id, region_id, node_id, node_type, description,consumer_type, supply_requirement, supply_policy)
            VALUES (?,?,?,?,?,?,?,?)
        `;
        
        let params =[node.scenario_id,region_id,node.node_id,3,node.description,node.consumer_type, node.supply_requirement, node.supply_policy]; // node_type = 2 for consumer or internal nodes
        let qResult = await dataSource.insertData(insertA01C,params);
        return qResult;        
    }catch(err){
        return new dataSource.QueryResult(false,[],null,0,err);
    }
}

/**
 * Method that updates a given consumer node
 * @param {*} node 
 * @param {*} region_id 
 * @returns 
 */
async function updateConsumer(node,region_id){
    try{
        let query = 
        `
            UPDATE a01c_consumer_nodes
            SET description=?, consumer_type=?, supply_requirement=?, supply_policy=?
            WHERE scenario_id = ? and region_id = ? and node_id = ?;
        `;
        let params = [node.description,node.consumer_type, node.supply_requirement,node.supply_policy,node.scenario_id, region_id, node.node_id];
        let qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,[],null,0,err);
    }
}

/**
 * Method that handles consumer node deleting
 * @param {*} node 
 * @param {*} region_id 
 * @returns 
 */
async function deleteConsumer(node,region_id){
    try{
        let query = 'delete from a01c_consumer_nodes where scenario_id = ? and region_id = ? and node_id = ?';
        let params = [node.scenario_id,region_id,node.node_id]
        let qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,[],null,0,err);
    }
}

module.exports = {
    getConsumers,
    insertConsumer,
    updateConsumer,
    deleteConsumer
}