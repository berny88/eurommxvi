<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// aviexp_maestro services
$app->get('/aviexp_maestro', 'getAviexpsMaestro');
$app->get('/aviexp_maestro/:id', 'getAviexpMaestro');
$app->post('/aviexp_maestro', 'addAviexpMaestro');
$app->put('/aviexp_maestro/:id', 'updateAviexpMaestro');
$app->delete('/aviexp_maestro/:id', 'deleteAviexpMaestro');
$app->map('/aviexp_maestro', 'getAviexpMaestroLog')->via('LOG');
$app->map('/aviexp_maestro', 'getAviexpMaestroImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadAviexpMaestroFile');
$app->run();

function uploadAviexpMaestroFile() {
	$request = Slim::getInstance()->request();
	file_put_contents('aviexps_maestro.dat', $request->getBody());
	loadAviexpMaestroFromFile('aviexps_maestro.dat');
}

function loadAviexpMaestroFromFile($file) {
    $row = 1;
    $fp = fopen ($file,"r");
    clearAviexpMaestro();
	clearLogImport();
    while ($data = fgetcsv ($fp, 1000, ";")) {
        if($row>2){
        	addAviexpMaestroByFile($data[0],$data[1], $data[3], $data[7], $data[8], $data[9]);
        }
		$row++;        
	}
	fclose ($fp);
}

function getAviexpsMaestro() {
	$sql = "SELECT id,cu,numero_bl,dhef_aviexp,produit,numero_ordre,qte_annoncee
			FROM aviexp_maestro 
			ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$aviexps_maestro = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($aviexps_maestro);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAviexpMaestroByFile($cu,$numero_bl,$dhef_aviexp,$produit,$numero_ordre,$qte_annoncee) {
	error_log("\naddAviexpMaestroByFile:", 3, 'aviexp_maestro_import.log');
	error_log($numero_ordre, 3, 'aviexp_maestro_import.log');
	$sql = "INSERT INTO aviexp_maestro (cu,numero_bl,dhef_aviexp,produit,numero_ordre,qte_annoncee) VALUES (:cu,:numero_bl,:dhef_aviexp,:produit,:numero_ordre,:qte_annoncee)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("cu", $cu);
		$stmt->bindParam("numero_bl", $numero_bl);
		$stmt->bindParam("dhef_aviexp", $dhef_aviexp);
		$stmt->bindParam("produit", $produit);
		$stmt->bindParam("numero_ordre", $numero_ordre);
		$stmt->bindParam("qte_annoncee", $qte_annoncee);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'aviexp_maestro_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearAviexpMaestro() {
	error_log("\nclearAviexpMaestro:", 3, 'aviexp_maestro_import.log');
	$sql = "TRUNCATE TABLE aviexp_maestro";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'aviexp_maestro_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearLogImport() {
	unlink('aviexp_maestro_import.log');
	unlink('aviexp_maestro.log');	
	error_log("LOG AVIEXP MAESTRO IMPORT", 3, 'aviexp_maestro_import.log');
	error_log("LOG AVIEXP MAESTRO", 3, 'aviexp_maestro.log');
}

function getAviexpMaestroLog() {
	$log = array('file' => 'aviexp_maestro.log', 'text' => file_get_contents('aviexp_maestro.log'));
	echo json_encode($log); 

}

function getAviexpMaestroImportLog() {
	$log = array('file' => 'aviexp_maestro_import.log', 'text' => file_get_contents('aviexp_maestro_import.log'));
	echo json_encode($log); 

}

?>