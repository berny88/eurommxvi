<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// alerte_corail services
$app->get('/alerte_corail', 'getAlertesCorail');
$app->get('/alerte_corail/:id', 'getAlerteCorail');
$app->post('/alerte_corail', 'addAlerteCorail');
$app->put('/alerte_corail/:id', 'updateAlerteCorail');
$app->delete('/alerte_corail/:id', 'deleteAlerteCorail');
$app->map('/alerte_corail', 'getAlerteCorailLog')->via('LOG');
$app->map('/alerte_corail', 'getAlerteCorailImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadAlerteCorailFile');
$app->run();

function uploadAlerteCorailFile() {
	$request = Slim::getInstance()->request();
	file_put_contents('alertes_corail.csv', $request->getBody());
	loadAlerteCorailFromFile('alertes_corail.csv');
}

function loadAlerteCorailFromFile($file) {
    $row = 1;
    $fp = fopen ($file,"r");
    clearAlerteCorail();
	clearLogImport();
    while ($data = fgetcsv ($fp, 1000, ";")) {
        if($row!=1){
        	addAlerteCorailByFile($data[0],$data[1],$data[11],$data[13]);
        }    
		$row++;		
	}
	fclose ($fp);
}

function getAlertesCorail() {
	$sql = "SELECT id,reference,designation,
			IF(date_rupture_minimale='0000-00-00 00:00:00', '', date_rupture_minimale) AS date_rupture_minimale,
			IF(date_rupture_usine='0000-00-00 00:00:00', '', date_rupture_usine) AS date_rupture_usine 
			FROM alerte_corail 
			ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$alertes_corail = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($alertes_corail);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getAlerteCorail($id) {
	$sql = "SELECT * FROM alerte_corail WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$alerte_corail = $stmt->fetchObject();
		$db = null;
		echo json_encode($alerte_corail);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAlerteCorail() {
	error_log("\naddAlerteCorail:", 3, 'alerte_corail.log');
	$request = Slim::getInstance()->request();
	$alerte_corail = json_decode($request->getBody());
	error_log($alerte_corail->reference, 3, 'alerte_corail.log');
	$sql = "INSERT INTO alerte_corail (reference, designation) VALUES (:reference, :designation)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $alerte_corail->reference);
		$stmt->bindParam("designation", $alerte_corail->designation);
		$stmt->execute();
		$alerte_corail->id = $db->lastInsertId();
		$db = null;
		echo json_encode($alerte_corail); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_corail.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAlerteCorailByFile($reference, $designation, $date_rupture_minimale, $date_rupture_usine) {
	error_log("\naddAlerteCorailByFile:", 3, 'alerte_corail_import.log');
	error_log($reference, 3, 'alerte_corail_import.log');
	$sql = "INSERT INTO alerte_corail (reference, designation, date_rupture_minimale, date_rupture_usine) VALUES (:reference, :designation, STR_TO_DATE(:date_rupture_minimale,'%d/%m/%Y %T'), STR_TO_DATE(:date_rupture_usine,'%d/%m/%Y %T'))";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $reference);
		$stmt->bindParam("designation", $designation);
		$stmt->bindParam("date_rupture_minimale", $date_rupture_minimale);
		$stmt->bindParam("date_rupture_usine", $date_rupture_usine);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_corail_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateAlerteCorail($id) {
	error_log("\nupdateAlerteCorail:", 3, 'alerte_corail.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$alerte_corail = json_decode($body);
	error_log($id, 3, 'alerte_corail.log');
	$sql = "UPDATE alerte_corail SET reference=:reference, designation=:designation, date_rupture_minimale=:date_rupture_minimale, date_rupture_usine=:date_rupture_usine WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $alerte_corail->reference);
		$stmt->bindParam("designation", $alerte_corail->designation);
		$stmt->bindParam("date_rupture_minimale", $alerte_corail->date_rupture_minimale);
		$stmt->bindParam("date_rupture_usine", $alerte_corail->date_rupture_usine);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($alerte_corail); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_corail.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteAlerteCorail($id) {
	error_log("\ndeleteAlerteCorail:", 3, 'alerte_corail.log');
	error_log($id, 3, 'alerte_corail.log');
	$sql = "DELETE FROM alerte_corail WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_corail.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearAlerteCorail() {
	error_log("\nclearAlerteCorail:", 3, 'alerte_corail_import.log');
	$sql = "TRUNCATE TABLE alerte_corail";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_corail_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearLogImport() {
	unlink('alerte_corail_import.log');
	unlink('alerte_corail.log');	
	error_log("LOG ALERTE CORAIL IMPORT", 3, 'alerte_corail_import.log');
	error_log("LOG ALERTE CORAIL", 3, 'alerte_corail.log');
}

function getAlerteCorailLog() {
	$log = array('file' => 'alerte_corail.log', 'text' => file_get_contents('alerte_corail.log'));
	echo json_encode($log); 

}

function getAlerteCorailImportLog() {
	$log = array('file' => 'alerte_corail_import.log', 'text' => file_get_contents('alerte_corail_import.log'));
	echo json_encode($log); 

}

?>