/**
 * Method that holds every required service for consumer node's management.
 * 
 * Implemented Methods:
 * 
 * 1. getFlows: Get Scenario Flows
 * 2. getGeneratorNodes: Generator nodes List for flows view.
 * 3. getContainerNodes: Container nodes list for flows view.
 * 4. getConsumerNodes: Consumer nodes list for flows view.
 * 5. insertFlow: Inserts a flow
 * 6. updateFlow: Updates a flow
 * 7. deleteFlow: Deletes a flow
 * 
 * @requires Datasource/MySQLMngr
 * Ernesto Cantú
 */
const dataSource = require('../Datasource/MySQLMngr');


const getFlowsQuery = 
`    SELECT 
        a02.id as recid,
        a02.origin,
        a02.origin_type,
        CASE 
            when origin_type = 1 then (select id from a01a_generator_nodes a01a where a01a.region_id = a02.region_id and a01a.scenario_id = a02.scenario_id and a01a.node_id = a02.origin)
            when origin_type = 2 then (select id from a01b_container_nodes a01b where a01b.region_id = a02.region_id and a01b.scenario_id = a02.scenario_id and a01b.node_id = a02.origin)
            when origin_type = 2 then (select id from a01c_consumer_nodes a01c where a01c.region_id = a02.region_id and a01c.scenario_id = a02.scenario_id and a01c.node_id = a02.origin)
        END as origin_recid,
        a02.destiny,
        a02.destiny_type,
        CASE 
            when destiny_type = 1 then (select id from a01a_generator_nodes a01a where a01a.region_id = a02.region_id and a01a.scenario_id = a02.scenario_id and a01a.node_id = a02.destiny)
            when destiny_type = 2 then (select id from a01b_container_nodes a01b where a01b.region_id = a02.region_id and a01b.scenario_id = a02.scenario_id and a01b.node_id = a02.destiny)
            when destiny_type = 3 then (select id from a01c_consumer_nodes a01c where a01c.region_id = a02.region_id and a01c.scenario_id = a02.scenario_id and a01c.node_id = a02.destiny)
        END as destiny_recid,
        a02.flow_desc,
        a02.type_id,
        x05.name,
        a02.current_flow,
        a02.fmin, a02.fmax 
    FROM a02_flows a02
    JOIN x05_flow_types x05 on x05.id = a02.type_id 
    WHERE a02.scenario_id = ? and a02.region_id = ?
`;

const selectGeneratorNodes = `
    SELECT 
        a01a.id as recid,
        a01a.node_id,
        a01a.node_type
    FROM a01a_generator_nodes a01a
    WHERE region_id = ? and scenario_id = ?
`;

const selectContainerNodes = `
    SELECT 
        a01b.id as recid,
        a01b.node_id,
        a01b.node_type
    FROM a01b_container_nodes a01b
    WHERE region_id = ? and scenario_id = ?
`;

const selectConsumerNodes = `
    select 
        a01c.id as recid,
        a01c.node_id,
        a01c.node_type
    from a01c_consumer_nodes a01c
    WHERE region_id = ? and scenario_id = ?
`


const selectInsertA02 = `
    INSERT INTO a02_flows(scenario_id,region_id, id, origin, destiny, current_flow, type_id, fmax, fmin) 
    SELECT ?, region_id, id,origin, destiny, COALESCE(current_flow,0), type_id, COALESCE(fmax,0), COALESCE(fmin,0) 
    FROM a02_flows a02 WHERE a02.scenario_id = ? and a02.region_id = ?
`;
const insertFlowQuery = "INSERT INTO a02_flows(scenario_id, region_id, origin, origin_type, destiny, destiny_type, type_id, flow_desc, current_flow, fmax, fmin) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const updateFlowQuery = "UPDATE a02_flows set flow_desc = ?, current_flow = ?, fmax = ?, fmin = ? where id = ?";
const deleteFlowQuery = "Delete from a02_flows where id = ?";
const deleteFlowsByNodeInQuery = "Delete from a02_flows where scenario_id = ? and region_id = ? and destiny = ? and destiny_type = ?"
const deleteFlowsByNodeOutQuery = "Delete from a02_flows where scenario_id = ? and region_id = ? and and origin = ? and origin_type = ?"


/**
 * This method gets the nodes list
 * 
 * @param {*} scenarioId the scenario id
 * @returns the list of nodes in the scenario.
 */
async function getFlows(scenarioId,region_id){
    try{
        let query = getFlowsQuery;
        let params = [scenarioId,region_id]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that constructs a list of possible generator nodes for the Flows View
 * @param {*} scenarioId 
 * @param {*} region_id 
 * @returns list of origin nodes
 */
async function getGeneratorNodes(scenarioId,region_id){
    try{
        let query = selectGeneratorNodes;
        let params = [region_id,scenarioId]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that constructs a list of possible container nodes for the Flows View
 * @param {*} scenarioId 
 * @param {*} region_id 
 * @returns list of origin nodes
 */
async function getContainerNodes(scenarioId,region_id){
    try{
        let query = selectContainerNodes;
        let params = [region_id,scenarioId]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that constructs a list of possible consumer nodes for the Flows View
 * @param {*} scenarioId 
 * @param {*} region_id 
 * @returns list of origin nodes
 */
async function getConsumerNodes(scenarioId,region_id){
    try{
        let query = selectConsumerNodes;
        let params = [region_id,scenarioId]
        qResult = await dataSource.getDataWithParams(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that inserts a new flow into the database
 * 
 * @param {*} flow the given flow 
 * @param {*} region_id 
 * @returns 
 */
async function insertFlow(flow,region_id){
    try{
        let query = insertFlowQuery;

        if(flow.origin_type == 1 && flow.destiny_type == 3){
            return new dataSource.QueryResult(false,null,0,0,'Invalid origin and destiny type');
        }

        let flow_type;
        if(flow.origin_type == 1 || flow.destiny_type == 3)
            flow_type = 1; //if input or output, then fixed
        else
            flow_type = 2; //variable
        let params =[flow.scenario_id, region_id,flow.origin, flow.origin_type, flow.destiny, flow.destiny_type, flow_type, flow.flow_desc,flow.current_flow, flow.fmax,flow.fmin];
        qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
       return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that updates a given flow into the database
 * @param {*} flow the given flow 
 * @param {*} region_id 
 * @returns 
 */
async function updateFlow(flow){
    try{
        let query = updateFlowQuery;
        // flow_desc = ?, current_flow = ?, fmax = ?, fmin = ? where id = ? 
        let params = [flow.flow_desc,flow.current_flow,flow.fmax,flow.fmin, flow.id];
        
        qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that deletes a given flow from the database
 * 
 * @param {*} flow the given flow 
 * @param {*} region_id 
 * @returns 
 */
async function deleteFlow(flow){
    try{
        let query = deleteFlowQuery;
        let params = [flow.id]
        
        qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return err;
    }
}


module.exports = {getFlows,getGeneratorNodes, getContainerNodes, getConsumerNodes,insertFlow,updateFlow,deleteFlow}