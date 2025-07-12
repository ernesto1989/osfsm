-- This stored procedure creates a new scenario on the database.
-- Receives the scenario id, the description and the base scenario.
-- Currently only supports TYPE 1 Scenarios -> scenarios that descend from another scenario.
-- 
CREATE DEFINER=`ecv`@`%` PROCEDURE `osfdb`.`create_scenario`(
	in scenarioName varchar(30),in descrp varchar(100),in baseScenarioId varchar(30),in regionId int, out scenarioId varchar(30))
BEGIN
	
	DECLARE v_date_part VARCHAR(6);
    DECLARE v_region_part VARCHAR(3);
    DECLARE v_sequence INT;
    DECLARE v_sequence_part VARCHAR(2);
   
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
		SELECT 'NOT OK' AS STATUS,'ERROR OCCOURED!' as ERROR;
	END;
	START TRANSACTION;

   
   SET v_date_part = DATE_FORMAT(CURDATE(), '%y%m%d');
   SET v_region_part = CONCAT('r', LPAD(regionId, 2, '0'));
  
  SELECT
        COUNT(*) + 1
    INTO
        v_sequence
    FROM
        z01_scenarios
    WHERE
        scenario_id LIKE CONCAT('esc_', v_date_part, '_', v_region_part, '_%') and region_id = regionId and
        scenario_id not in ('BASE_CONDITION');
       
    SET v_sequence_part = LPAD(v_sequence, 2, '0');
   
   set scenarioId = CONCAT('esc_', v_date_part, '_', v_region_part, '_', v_sequence_part);
	
	-- type = 1 means that is cloning scenario. currently not supporting other types of scenarios.
	INSERT INTO z01_scenarios(scenario_id,scenario_name ,region_id, cdate, description, `type`, capacity_units, time_units, origin_id, recalc_trl, recalc_solution, update_date)
	SELECT 
		scenarioId, scenarioName,regionId, cdate, descrp, 1, capacity_units, time_units, baseScenarioId, 1, 1, update_date
	FROM z01_scenarios WHERE scenario_id = baseScenarioId AND region_id = regionId;

	INSERT INTO a01a_generator_nodes(region_id, scenario_id, node_id, node_type, description)
	SELECT regionId, scenarioId, node_id, node_type, description
	FROM a01a_generator_nodes WHERE scenario_id = baseScenarioId AND region_id = regionId;

	INSERT INTO a01b_container_nodes(region_id, scenario_id, node_id, node_type, description, container_type, max_capacity, current_vol, min_capacity, Lat, `Long`)
	SELECT
		regionId, scenarioId, node_id, node_type, description, container_type, max_capacity, current_vol, min_capacity, Lat, `Long`
	FROM a01b_container_nodes WHERE scenario_id = baseScenarioId AND region_id = regionId;

	INSERT INTO a01c_consumer_nodes(region_id, scenario_id, node_id, node_type, description, consumer_type, supply_requirement, supply_policy, Lat, `Long`)
	SELECT 
		regionId, scenarioId, node_id, node_type, description, consumer_type, supply_requirement, supply_policy, Lat, `Long`
	FROM a01c_consumer_nodes WHERE scenario_id = baseScenarioId AND region_id = regionId;

	INSERT INTO a02_flows(scenario_id, region_id, origin, origin_type, destiny, destiny_type, type_id, flow_desc, current_flow, fmax, fmin)
	SELECT
		scenarioId, regionId, origin, origin_type, destiny, destiny_type, type_id, flow_desc, current_flow, fmax, fmin
	FROM a02_flows WHERE scenario_id = baseScenarioId AND region_id = regionId;
	
	COMMIT;
	SELECT 'OK' AS STATUS,scenarioId AS scenario_id,'' as ERROR;
END