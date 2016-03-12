<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// avrtd_pegase services
$app->get('/avrtd_pegase', 'getAvrtdsPegase');
$app->get('/avrtd_pegase/:id', 'getAvrtdPegase');
$app->post('/avrtd_pegase', 'addAvrtdPegase');
$app->put('/avrtd_pegase/:id', 'updateAvrtdPegase');
$app->delete('/avrtd_pegase/:id', 'deleteAvrtdPegase');
$app->map('/avrtd_pegase', 'getAvrtdPegaseLog')->via('LOG');
$app->map('/avrtd_pegase', 'getAvrtdPegaseImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadAvrtdPegaseFile');
$app->run();

function uploadAvrtdPegaseFile() {
	$request = Slim::getInstance()->request();
	file_put_contents('avrtds_pegase.dat', $request->getBody());
	loadAvrtdPegaseFromFile('avrtds_pegase.dat');
}

function loadAvrtdPegaseFromFile($file) {

    clearAvrtdPegase();
	clearLogImport();

    $lines = file($file);
    foreach ($lines as $line_num => $line) {
    	addAvrtdPegaseByFile(substr($line,4,12)."00", substr($line,16,3), substr($line,19,10), substr($line,29,10), substr($line,39,2), substr($line,41,3), substr($line,44,3), substr($line,47,13), substr($line,60,1).trim(substr($line,61,9)));
    }

}

function getAvrtdsPegase() {
	$sql = "SELECT id,dateheure,cu,produit,cofor_hybride,ligne,sgr,magasin,point_conso,quantite
			FROM avrtd_pegase 
			ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$avrtds_pegase = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($avrtds_pegase);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getAvrtdPegase($id) {
	$sql = "SELECT id,dateheure,cu,produit,cofor_hybride,ligne,sgr,magasin,point_conso,quantite FROM avrtd_pegase WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$avrtd_pegase = $stmt->fetchObject();
		$db = null;
		echo json_encode($avrtd_pegase);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAvrtdPegase() {
	error_log("\naddAvrtdPegase:", 3, 'avrtd_pegase.log');
	$request = Slim::getInstance()->request();
	$avrtd_pegase = json_decode($request->getBody());
	error_log($avrtd_pegase->produit, 3, 'avrtd_pegase.log');
	$sql = "INSERT INTO avrtd_pegase (dateheure,cu,produit,cofor_hybride,ligne,sgr,magasin,point_conso,quantite) VALUES (:dateheure,:cu,:produit,:cofor_hybride,:ligne,:sgr,:point_conso,:quantite)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("dateheure", $avrtd_pegase->dateheure);
		$stmt->bindParam("cu", $avrtd_pegase->cu);
		$stmt->bindParam("produit", $avrtd_pegase->produit);
		$stmt->bindParam("cofor_hybride", $avrtd_pegase->cofor_hybride);
		$stmt->bindParam("ligne", $avrtd_pegase->ligne);
		$stmt->bindParam("sgr", $avrtd_pegase->sgr);
		$stmt->bindParam("magasin", $avrtd_pegase->magasin);
		$stmt->bindParam("point_conso", $avrtd_pegase->point_conso);
		$stmt->bindParam("quantite", $avrtd_pegase->quantite);		
		$stmt->execute();
		$avrtd_pegase->id = $db->lastInsertId();
		$db = null;
		echo json_encode($avrtd_pegase); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_pegase.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAvrtdPegaseByFile($dateheure, $cu, $produit, $cofor_hybride, $ligne, $sgr, $magasin, $point_conso, $quantite) {
	error_log("\naddAvrtdPegaseByFile:", 3, 'avrtd_pegase_import.log');
	error_log($produit, 3, 'avrtd_pegase_import.log');
	$sql = "INSERT INTO avrtd_pegase (dateheure,cu,produit,cofor_hybride,ligne,sgr,magasin,point_conso,quantite) VALUES (:dateheure,:cu,:produit,:cofor_hybride,:ligne,:sgr,:magasin,:point_conso,:quantite)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("dateheure", $dateheure);
		$stmt->bindParam("cu", $cu);
		$stmt->bindParam("produit", $produit);
		$stmt->bindParam("cofor_hybride", $cofor_hybride);
		$stmt->bindParam("ligne", $ligne);
		$stmt->bindParam("sgr", $sgr);
		$stmt->bindParam("magasin", $magasin);
		$stmt->bindParam("point_conso", $point_conso);
		$stmt->bindParam("quantite", $quantite);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_pegase_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateAvrtdPegase($id) {
	error_log("\nupdateAvrtdPegase:", 3, 'avrtd_pegase.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$avrtd_pegase = json_decode($body);
	error_log($id, 3, 'avrtd_pegase.log');
	$sql = "UPDATE avrtd_pegase SET type=:type, produit=:produit, sgr=:sgr, ligne=:ligne, quantite=:quantite, dateheure=:dateheure WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("dateheure", $avrtd_pegase->dateheure);
		$stmt->bindParam("cu", $avrtd_pegase->cu);
		$stmt->bindParam("produit", $avrtd_pegase->produit);
		$stmt->bindParam("cofor_hybride", $avrtd_pegase->cofor_hybride);
		$stmt->bindParam("ligne", $avrtd_pegase->ligne);
		$stmt->bindParam("sgr", $avrtd_pegase->sgr);
		$stmt->bindParam("magasin", $avrtd_pegase->magasin);
		$stmt->bindParam("point_conso", $avrtd_pegase->point_conso);
		$stmt->bindParam("quantite", $avrtd_pegase->quantite);	
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($avrtd_pegase); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_pegase.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteAvrtdPegase($id) {
	error_log("\ndeleteAvrtdPegase:", 3, 'avrtd_pegase.log');
	error_log($id, 3, 'avrtd_pegase.log');
	$sql = "DELETE FROM avrtd_pegase WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_pegase.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearAvrtdPegase() {
	error_log("\nclearAvrtdPegase:", 3, 'avrtd_pegase_import.log');
	$sql = "TRUNCATE TABLE avrtd_pegase";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_pegase_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearLogImport() {
	unlink('avrtd_pegase_import.log');
	unlink('avrtd_pegase.log');	
	error_log("LOG AVRTD PEGASE IMPORT", 3, 'avrtd_pegase_import.log');
	error_log("LOG AVRTD PEGASE", 3, 'avrtd_pegase.log');
}

function getAvrtdPegaseLog() {
	$log = array('file' => 'avrtd_pegase.log', 'text' => file_get_contents('avrtd_pegase.log'));
	echo json_encode($log); 

}

function getAvrtdPegaseImportLog() {
	$log = array('file' => 'avrtd_pegase_import.log', 'text' => file_get_contents('avrtd_pegase_import.log'));
	echo json_encode($log); 

}

?>