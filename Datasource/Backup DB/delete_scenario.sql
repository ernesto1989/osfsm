CREATE DEFINER=`ecv`@`%` PROCEDURE `delete_scenario`(in scenarioId varchar(30), in regionId int)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
		SELECT 'NOT OK' AS STATUS,'ERROR OCCOURED!' as ERROR;
	END;
	
	START TRANSACTION;

	delete from a01a_generator_nodes where scenario_id = scenarioId and region_id = regionId;
	delete from a01b_container_nodes where scenario_id = scenarioId and region_id = regionId;
	delete from a01c_consumer_nodes where scenario_id = scenarioId and region_id = regionId;
	delete from a02_flows where scenario_id = scenarioId and region_id = regionId;
	-- delete from a03_time_to_reach_limit  where scenario_id = scenarioId and region_id = regionId;
	-- delete from s01_solution_detail where scenario_id = scenarioId and region_id = regionId;
	-- delete from s02_proposed_flows where scenario_id = scenarioId and region_id = regionId;
	delete from z01_scenarios where scenario_id = scenarioId and region_id = regionId;

	COMMIT;
	SELECT 'OK' AS STATUS,'' as ERROR;
END