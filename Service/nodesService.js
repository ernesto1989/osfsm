/**
 * Method that holds every required service for node's management. Container Nodes.
 */
const dataSource = require('../Datasource/MySQLMngr');

const getNodesQuery = 
`
    select 
        a01.id as recid, -- just for W2UI
        a01.node_id,
        a01.node_type as node_type_id,
        x02.\`type\` as node_type,
        a01.container_type as container_type_id,
        x03.\`type\` as container_type,
        a01.description,
        a01.max_capacity,
        a01.current_vol,
        a01.min_capacity,
        a01.Lat,
        a01.\`Long\` 
    from a01b_container_nodes a01 
    join x02_node_types x02 on x02.id = a01.node_type 
    join x03_container_types x03 on x03.id = a01.container_type 
    where a01.scenario_id = ? and a01.region_id = ?
    and a01.node_type = 2 
`;


/**
 * This method gets the nodes list
 * 
 * @param {*} scenarioId the scenario id
 * @returns the list of nodes in the scenario.
 */
async function getNodes(scenarioId,region_id){
    try{
        let query = getNodesQuery;
        let params = [scenarioId,region_id]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * This method inserts an internal node on the database
 * @param {*} node comming from the UI
 * @param {*} region_id user's region
 * @returns 
 */
async function insertNode(node,region_id){
    try{
        let insertA01 = 
        `
            INSERT INTO a01b_container_nodes(scenario_id, region_id, node_id, node_type, description,container_type, max_capacity, current_vol, min_capacity)
            VALUES (?,?,?,?,?,?,?,?,?)
        `;
        
        let params =[node.scenario_id,region_id,node.node_id,2,node.description,node.container_type, node.max_capacity, node.current_vol, node.min_capacity]; // node_type = 2 for consumer or internal nodes
        let qResult = await dataSource.insertData(insertA01,params);
        return qResult;        
    }catch(err){
        return new dataSource.QueryResult(false,[],null,0,err);
    }
}

/**
 * Method that updates a given internal node
 * @param {*} node 
 * @param {*} region_id 
 * @returns 
 */
async function updateNode(node,region_id){
    try{
        let query = 
        `
            UPDATE a01b_container_nodes
            SET description=?, container_type=?, max_capacity=?, current_vol=?, min_capacity=?
            WHERE scenario_id = ? and region_id = ? and node_id = ?;
        `;
        let params = [node.description,node.container_type, node.max_capacity,node.current_vol,node.min_capacity,node.scenario_id, region_id, node.node_id];
        qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,[],null,0,err);
    }
}

/**
 * Method that handles node deleting
 * @param {*} node 
 * @param {*} region_id 
 * @returns 
 */
async function deleteNode(node,region_id){
    try{
        let query = 'delete from a01b_container_nodes where scenario_id = ? and region_id = ? and node_id = ?';
        let params = [node.scenario_id,region_id,node.node_id]
        qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,[],null,0,err);
    }
}

module.exports = {
    getNodes,
    insertNode,
    updateNode,
    deleteNode
}