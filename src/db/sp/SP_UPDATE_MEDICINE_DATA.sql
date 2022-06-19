CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_UPDATE_MEDICINE_DATA`(
p_medicine_id varchar(255), 
p_medicine_name varchar(255), 
p_available_pharmacies varchar(255), 
p_medicine_mrp float(15,2), 
p_medicine_manufacturer varchar(255), 
p_medicine_composition varchar(255), 
p_medicine_packing_type varchar(255), 
p_medicine_packaging varchar(255)
)
BEGIN 
	START TRANSACTION;
		INSERT INTO medicine_entity (`medicine_id`, `medicine_name`, `available_pharmacies`) 
			VALUES (p_medicine_id, p_medicine_name, p_available_pharmacies) 
		ON DUPLICATE KEY 
			UPDATE medicine_entity.available_pharmacies = 
				CASE 
					WHEN medicine_entity.available_pharmacies IS NOT NULL AND medicine_entity.available_pharmacies <> "" 
						THEN CONCAT_WS(",", medicine_entity.available_pharmacies, VALUES(available_pharmacies)) 
					WHEN medicine_entity.available_pharmacies IS NULL OR medicine_entity.available_pharmacies <> "" 
						THEN VALUES(available_pharmacies) 
				END;
		INSERT INTO medicine_details_entity (`medicine_id`, `medicine_name`, `medicine_mrp`, `medicine_manufacturer`, `medicine_composition`, `medicine_packing_type`, `medicine_packaging`)
			VALUES (p_medicine_id, p_medicine_name, p_medicine_mrp, p_medicine_manufacturer, p_medicine_composition, p_medicine_packing_type, p_medicine_packaging)
		ON DUPLICATE KEY
			UPDATE `medicine_mrp` = p_medicine_mrp, `medicine_manufacturer` = p_medicine_manufacturer, `medicine_composition` = p_medicine_composition, `medicine_packing_type` = p_medicine_packing_type, `medicine_packaging` = p_medicine_packaging;
    COMMIT;
END