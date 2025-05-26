-- Deletes the flows of a given container node
CREATE TRIGGER delete_node_flows
AFTER DELETE on a01b_container_nodes
FOR EACH ROW
BEGIN 
	DELETE FROM a02_flows a02 WHERE a02.origin = old.node_id 
	and a02.scenario_id = old.scenario_id and a02.region_id = old.region_id;
	
	DELETE FROM a02_flows a02 WHERE a02.destiny = old.node_id 
	and a02.scenario_id = old.scenario_id and a02.region_id = old.region_id;

END;


-- Deletes the flows of a given consumer node
CREATE TRIGGER delete_consumer_flows
AFTER DELETE on a01c_consumer_nodes
FOR EACH ROW
BEGIN 
	DELETE FROM a02_flows a02 WHERE a02.destiny = old.node_id 
	and a02.scenario_id = old.scenario_id and a02.region_id = old.region_id;

END;