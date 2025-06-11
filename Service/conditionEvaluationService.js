const dataSource = require('../Datasource/MySQLMngr');
const axios = require('axios')


const selectZ02 = `
    select 
        z02.state,
        z02.risk_node,
        z02.critical_time,
        z02.system_input,
        z02.system_output,
        (
            select sum(current_vol) from z03_current_state_detail z03
            where z03.scenario_id = z02.scenario_id and z03.region_id = z02.region_id
        ) as current_vol,
        (
            select sum(max_vol) from z03_current_state_detail z03
            where z03.scenario_id = z02.scenario_id and z03.region_id = z02.region_id
        ) as total_cap
    from z02_current_condition_summary z02 
    where z02.scenario_id = ? and z02.region_id = ?
`;

let selectZ03 = `select 
	z03.node_id, z03.min_vol,z03.current_vol,z03.max_vol, z03.incoming_flow, z03.outcoming_flow, 
	(
		case 
			when z03.incoming_flow = z03.outcoming_flow then 'Stable'	
			when z03.incoming_flow > z03.outcoming_flow then 'Draining'
			when z03.incoming_flow < z03.outcoming_flow then 'Filling'
		end
	) as node_state,
	z03.time_to_reach_limit as TRL
    from z03_current_state_detail z03
    where z03.scenario_id = ? and z03.region_id = ?
`;

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

async function getCurrentConditionSummary(scenarioId,regionId){
    try{
        let summary = await dataSource.getDataWithParams(selectZ02,[scenarioId,regionId]);
        if(summary.rows.length > 0){
            return summary.rows[0];
        }else{
            throw new Error('No current condition found for the given scenario and region');
        }
    }catch(err){
        throw new Error('Error fetching current condition: ' + err.message);
    }
}

async function getCurrentConditionDetails(scenarioId,regionId){
    try{
        let details = await dataSource.getDataWithParams(selectZ03,[scenarioId,regionId]);
        if(details.rows.length > 0){
            return details.rows;
        }else{
            throw new Error('No current condition details found for the given scenario and region');
        }
    }catch(err){
        throw new Error('Error fetching current condition details: ' + err.message);
    }
}

module.exports = {
    computeCurrentstate,
    getCurrentConditionSummary,
    getCurrentConditionDetails
}