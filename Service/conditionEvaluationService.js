const dataSource = require('../Datasource/MySQLMngr');
const axios = require('axios')

let scenarioFlowsQuery = `
    SELECT 
        a02.scenario_id,
        a02.id AS flow_id,
        a02.origin as origin_node,
        a02.origin_type,
        a02.destiny as destiny_node,
        a02.destiny_type,
        a02.flow_desc,
        a02.type_id,
        x05.model_name as type_name,
        a02.fmin,
        a02.current_flow,
        a02.fmax 
    FROM a02_flows a02
    join x05_flow_types x05 on x05.id = a02.type_id 
    where a02.scenario_id = ? and a02.region_id = ?
`;

const insertZ02 = `
    INSERT INTO osfdb.z02_current_condition_summary
    (scenario_id, region_id, nodes, system_input, system_output, state, risk_node, critical_time)
    VALUES ?
`;

const insertZ03 =  `
    INSERT INTO z03_current_state_detail(
        scenario_id,
        region_id, 
        node_id, 
        max_vol, 
        min_vol, 
        current_vol, 
        incoming_flow, 
        outcoming_flow, 
        time_to_reach_limit
    ) 
    VALUES ?
`;

/**
 * Method that selects all the possible nodes to compute either the current state (simulator)
 * or the solution with OSF Model.
 * 
 * generates the list of all nodes including:
 * 1. Generator Nodes
 * 2. Container Nodes
 * 3. Consumer Nodes
 * 
 * NOTE THAT this method is supported under the a01_nodes view, which groups all types of possible
 * nodes that will be supported by the system.
 * 
 * Refer to the backup folder under the Datasource folder for more information.
 * 
 * @param {*} scenarioId 
 * @param {*} regionId 
 * @returns the list of nodes
 */
async function getScenarioNodes(scenarioId,regionId){
    try{
        let query = 'select * from a01_nodes a01 where a01.scenario_id = ? and a01.region_id = ?';
        let params = [scenarioId,regionId]
        let qResult = await dataSource.getDataWithParams(query,params);
        return qResult.rows;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that selects all the possible flows to compute either the current state (simulator)
 * or the solution with OSF Model.
 * 
 * generates the list of all nodes including:
 * 1. Variable flows - Those whom the origin and destination are both container nodes
 * 2. Fixed flows - Those that are inptut to the system or output of the system
 * 
 * @param {*} scenarioId 
 * @param {*} regionId 
 * @returns the list of nodes
 */
async function getScenarioFlows(scenarioId,regionId){
    try{
        let query = scenarioFlowsQuery;
        let params = [scenarioId,regionId]
        let qResult = await dataSource.getDataWithParams(query,params);
        return qResult.rows;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that abstracts the Python Web Service Interaction With the Current State Situation
 * @param {*} scenarioId 
 * @param {*} regionId 
 * @returns 
 */
async function computeCurrentstate(scenarioId,regionId){
    try{
        currentStateCalc = await axios({
            method: 'get',
            url: 'http://localhost:4000/WF/TimeToLimit',
            data:{
                'scenario_id':scenarioId,
                'region_id':regionId
            },
            headers:{'Content-Type':'application/json'}
        });
        return currentStateCalc;
    }catch(err){
        msg = 'OSF Service Unavailable';
    }
}


/**
 * Method that deletes the previous Current Condition situation of a given Scenario.
 * 
 * @param {*} scenarioId The given scenario
 * @param {*} regionId User's region
 * @returns qResult object with the status of the transaction
 */
async function deleteCurrentState(scenarioId,regionId){
    try{
        let query1 = 'DELETE FROM z02_current_condition_summary where scenario_id = ? and region_id = ?';
        let query2 = 'DELETE FROM z03_current_state_detail where scenario_id = ? and region_id = ?';
        let params = [scenarioId,regionId];
        let qResult1 = await dataSource.updateData(query1,params);
        let qResult2;
        if(qResult1.status){
            qResult2 = await dataSource.updateData(query2,params);
            if(!qResult2.status)
                throw new Error("Could not delete z03")
            return new dataSource.QueryResult(true,[],0,qResult1.changes + qResult2.changes,'')
        }else{
            throw new Error("Could not delete z02")
        }
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that inserts the computed current situation of the given scenario
 * @param {*} scenarioId given scenario id
 * @param {*} regionId users region
 * @param {*} data the computed data
 * @returns the qResult object with the status of the situation.
 */
async function insertEvaluationResult(scenarioId,regionId,currentStateCalc){
    try{
        let query1 = insertZ02;
        let query2 = insertZ03;
        let elements = []
        let element = []

        //insert summary
        let json;
        json = JSON.parse(currentStateCalc.data[0]);
        element = [scenarioId,regionId,json.nodes,json.system_input,json.system_output,json.state,json.risk_node, json.critical_time];
        elements.push(element);
        let qResult1 = await dataSource.bulkInsertData(query1,elements);

        if(qResult1.status){
            elements = []; //reset the elements array for detail
            //insert into details
            for(i=1;i<currentStateCalc.data.length;i++){
                json = JSON.parse(currentStateCalc.data[i]);
                element = [scenarioId,regionId,json.node_id,json.max_vol,json.min_vol,json.current_vol,json.inflow, json.outflow,json.time_to_reach_limit];
                elements.push(element);
            }
            let qResult2 = await dataSource.bulkInsertData(query2,elements);
            if(qResult2.status)
                return new dataSource.QueryResult(true,null,qResult1.changes + qResult2.changes,0,'');
        }else{
            throw new Error("Could not insert data!")
        }
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}


module.exports = {
    computeCurrentstate,
    deleteCurrentState,
    insertEvaluationResult
}