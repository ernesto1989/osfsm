-- Nodes view to create nodes list for python

create view a01_nodes as
 select
 	a01.scenario_id,
 	a01.region_id,
 	a01.id,
 	a01.node_id,
 	a01.node_type,
 	0 as min_capacity,
 	0 as current_vol,
 	0 as max_capacity
 from a01a_generator_nodes a01
 union
 select
 	a01.scenario_id,
 	a01.region_id,
 	a01.id,
 	a01.node_id,
 	a01.node_type,
 	a01.min_capacity,
 	a01.current_vol,
 	a01.max_capacity 
 from a01b_container_nodes a01 
 union
 select
 	a01.scenario_id,
 	a01.region_id,
 	a01.id,
 	a01.node_id,
 	a01.node_type,
 	0 as min_capacity,
 	0 as current_vol,
 	0 as max_capacity
 from a01c_consumer_nodes a01 