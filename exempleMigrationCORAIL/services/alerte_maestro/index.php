<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// alerte_maestro services
$app->get('/alerte_maestro', 'getAlertesMaestro');
$app->get('/alerte_maestro/:id', 'getAlerteMaestro');
$app->post('/alerte_maestro', 'addAlerteMaestro');
$app->put('/alerte_maestro/:id', 'updateAlerteMaestro');
$app->delete('/alerte_maestro/:id', 'deleteAlerteMaestro');
$app->map('/alerte_maestro', 'getAlerteMaestroLog')->via('LOG');
$app->map('/alerte_maestro', 'getAlerteMaestroImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadAlerteMaestroFile');
$app->run();

function uploadAlerteMaestroFile() {
	$request = Slim::getInstance()->request();
	file_put_contents('alertes_maestro.csv', $request->getBody());
	loadAlerteMaestroFromFile('alertes_maestro.csv');
}

function loadAlerteMaestroFromFile($file) {
    $row = 1;
    $fp = fopen ($file,"r");
    clearAlerteMaestro();
	clearLogImport();
    while ($data = fgetcsv ($fp, 1000, ";")) {
        if($row!=1){
        	addAlerteMaestroByFile($data[0],$data[1],$data[2],$data[3],$data[5]);
        }        
		$row++;
	}
	fclose ($fp);
}

function getAlertesMaestro() {
	$sql = "SELECT * FROM alerte_maestro ORDER BY id";
	$sql = "SELECT id,reference,designation,
		IF(date_rupture='0000-00-00 00:00:00', '', date_rupture) AS date_rupture,
		IF(date_rupture_dotation_atelier='0000-00-00 00:00:00', '', date_rupture_dotation_atelier) AS date_rupture_dotation_atelier,
		commentaire		
		FROM alerte_maestro 
		ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$alertes_maestro = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($alertes_maestro);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getAlerteMaestro($id) {
	$sql = "SELECT * FROM alerte_maestro WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$alerte_maestro = $stmt->fetchObject();
		$db = null;
		echo json_encode($alerte_maestro);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAlerteMaestro() {
	error_log("\naddAlerteMaestro:", 3, 'alerte_maestro.log');
	$request = Slim::getInstance()->request();
	$alerte_maestro = json_decode($request->getBody());
	error_log($alerte_maestro->reference, 3, 'alerte_maestro.log');
	$sql = "INSERT INTO alerte_maestro (reference, designation) VALUES (:reference, :designation)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $alerte_maestro->reference);
		$stmt->bindParam("designation", $alerte_maestro->designation);
		$stmt->execute();
		$alerte_maestro->id = $db->lastInsertId();
		$db = null;
		echo json_encode($alerte_maestro); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_maestro.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAlerteMaestroByFile($reference, $designation, $date_rupture, $date_rupture_dotation_atelier, $commentaire ) {
	error_log("\naddAlerteMaestroByFile:", 3, 'alerte_maestro_import.log');
	error_log($reference, 3, 'alerte_maestro_import.log');
	$sql = "INSERT INTO alerte_maestro (reference, designation, date_rupture, date_rupture_dotation_atelier, commentaire) VALUES (:reference, :designation, STR_TO_DATE(:date_rupture,'%d/%m/%Y %T'), STR_TO_DATE(:date_rupture_dotation_atelier,'%d/%m/%Y %T'), :commentaire)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $reference);
		$stmt->bindParam("designation", $designation);
		$stmt->bindParam("date_rupture", $date_rupture);
		$stmt->bindParam("date_rupture_dotation_atelier", $date_rupture_dotation_atelier);
		$stmt->bindParam("commentaire", $commentaire);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_maestro_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateAlerteMaestro($id) {
	error_log("\nupdateAlerteMaestro:", 3, 'alerte_maestro.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$alerte_maestro = json_decode($body);
	error_log($id, 3, 'alerte_maestro.log');
	$sql = "UPDATE alerte_maestro SET reference=:reference, designation=:designation, date_rupture=:date_rupture, date_rupture_dotation_atelier=:date_rupture_dotation_atelier, commentaire=:commentaire WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $alerte_maestro->reference);
		$stmt->bindParam("designation", $alerte_maestro->designation);
		$stmt->bindParam("date_rupture", $alerte_maestro->date_rupture);
		$stmt->bindParam("date_rupture_dotation_atelier", $alerte_maestro->date_rupture_dotation_atelier);
		$stmt->bindParam("commentaire", $alerte_maestro->commentaire);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($alerte_maestro); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_maestro.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteAlerteMaestro($id) {
	error_log("\ndeleteAlerteMaestro:", 3, 'alerte_maestro.log');
	error_log($id, 3, 'alerte_maestro.log');
	$sql = "DELETE FROM alerte_maestro WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_maestro.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearAlerteMaestro() {
	error_log("\nclearAlerteMaestro:", 3, 'alerte_maestro_import.log');
	$sql = "TRUNCATE TABLE alerte_maestro";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_maestro_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearLogImport() {
	unlink('alerte_maestro_import.log');
	unlink('alerte_maestro.log');
	error_log("LOG ALERTE MAESTRO IMPORT", 3, 'alerte_maestro_import.log');
	error_log("LOG ALERTE MAESTRO", 3, 'alerte_maestro.log');
}

function getAlerteMaestroLog() {
	$log = array('file' => 'alerte_maestro.log', 'text' => file_get_contents('alerte_maestro.log'));
	echo json_encode($log); 

}

function getAlerteMaestroImportLog() {
	$log = array('file' => 'alerte_maestro_import.log', 'text' => file_get_contents('alerte_maestro_import.log'));
	echo json_encode($log); 

}

?>