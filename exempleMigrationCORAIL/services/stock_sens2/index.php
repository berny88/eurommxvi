<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// stock_sens2 services
$app->get('/stock_sens2', 'getStocksSens2');
$app->get('/stock_sens2/:id', 'getStockSens2');
$app->post('/stock_sens2', 'addStockSens2');
$app->put('/stock_sens2/:id', 'updateStockSens2');
$app->delete('/stock_sens2/:id', 'deleteStockSens2');
$app->map('/stock_sens2', 'getStockSens2Log')->via('LOG');
$app->map('/stock_sens2', 'getStockSens2ImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadStockSens2File');
$app->run();

function uploadStockSens2File() {
	$request = Slim::getInstance()->request();
	file_put_contents('stocks_sens2.xml', $request->getBody());
	loadStockSens2FromFile('stocks_sens2.xml');
}

function loadStockSens2FromFile($file) {

    clearStockSens2();
	clearLogImport();
	
	$xml = simplexml_load_file($file);
	foreach($xml as $message){
        addStockSens2ByFile($message->type, $message->produit, $message->sgr, $message->line, $message->qte, $message->dh);
    }    

}

function getStocksSens2() {
	$sql = "SELECT id,type,produit,sgr,ligne,quantite,dateheure
			FROM stock_sens2 
			ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$stocks_sens2 = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($stocks_sens2);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getStockSens2($id) {
	$sql = "SELECT id,type,produit,sgr,ligne,quantite,dateheure FROM stock_sens2 WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$stock_sens2 = $stmt->fetchObject();
		$db = null;
		echo json_encode($stock_sens2);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addStockSens2() {
	error_log("\naddStockSens2:", 3, 'stock_sens2.log');
	$request = Slim::getInstance()->request();
	$stock_sens2 = json_decode($request->getBody());
	error_log($stock_sens2->produit, 3, 'stock_sens2.log');
	$sql = "INSERT INTO stock_sens2 (type,produit,sgr,ligne,quantite,dateheure) VALUES (:type,:produit,:sgr,:ligne,:quantite,:dateheure)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("type", $stock_sens2->type);
		$stmt->bindParam("produit", $stock_sens2->produit);
		$stmt->bindParam("sgr", $stock_sens2->sgr);
		$stmt->bindParam("ligne", $stock_sens2->ligne);
		$stmt->bindParam("quantite", $stock_sens2->quantite);
		$stmt->bindParam("dateheure", $stock_sens2->dateheure);
		$stmt->execute();
		$stock_sens2->id = $db->lastInsertId();
		$db = null;
		echo json_encode($stock_sens2); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_sens2.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addStockSens2ByFile($type, $produit, $sgr, $ligne, $quantite, $dateheure) {
	error_log("\naddStockSens2ByFile:", 3, 'stock_sens2_import.log');
	error_log($produit, 3, 'stock_sens2_import.log');
	$sql = "INSERT INTO stock_sens2 (type,produit,sgr,ligne,quantite,dateheure) VALUES (:type,:produit,:sgr,:ligne,:quantite,:dateheure)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("type", $type);
		$stmt->bindParam("produit", $produit);
		$stmt->bindParam("sgr", $sgr);
		$stmt->bindParam("ligne", $ligne);
		$stmt->bindParam("quantite", $quantite);
		$stmt->bindParam("dateheure", $dateheure);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_sens2_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateStockSens2($id) {
	error_log("\nupdateStockSens2:", 3, 'stock_sens2.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$stock_sens2 = json_decode($body);
	error_log($id, 3, 'stock_sens2.log');
	$sql = "UPDATE stock_sens2 SET type=:type, produit=:produit, sgr=:sgr, ligne=:ligne, quantite=:quantite, dateheure=:dateheure WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("type", $stock_sens2->type);
		$stmt->bindParam("produit", $stock_sens2->produit);
		$stmt->bindParam("sgr", $stock_sens2->sgr);
		$stmt->bindParam("ligne", $stock_sens2->ligne);
		$stmt->bindParam("quantite", $stock_sens2->quantite);
		$stmt->bindParam("dateheure", $stock_sens2->dateheure);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($stock_sens2); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_sens2.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteStockSens2($id) {
	error_log("\ndeleteStockSens2:", 3, 'stock_sens2.log');
	error_log($id, 3, 'stock_sens2.log');
	$sql = "DELETE FROM stock_sens2 WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_sens2.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearStockSens2() {
	error_log("\nclearStockSens2:", 3, 'stock_sens2_import.log');
	$sql = "TRUNCATE TABLE stock_sens2";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_sens2_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearLogImport() {
	unlink('stock_sens2_import.log');
	unlink('stock_sens2.log');	
	error_log("LOG STOCK SENS2 IMPORT", 3, 'stock_sens2_import.log');
	error_log("LOG STOCK SENS2", 3, 'stock_sens2.log');
}

function getStockSens2Log() {
	$log = array('file' => 'stock_sens2.log', 'text' => file_get_contents('stock_sens2.log'));
	echo json_encode($log); 

}

function getStockSens2ImportLog() {
	$log = array('file' => 'stock_sens2_import.log', 'text' => file_get_contents('stock_sens2_import.log'));
	echo json_encode($log); 

}

?>