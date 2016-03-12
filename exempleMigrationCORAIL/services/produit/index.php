<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// produit services
$app->get('/produit', 'getProduits');
$app->get('/produit/:id', 'getProduit');
$app->post('/produit', 'addProduit');
$app->put('/produit/:id', 'updateProduit');
$app->delete('/produit/:id', 'deleteProduit');
$app->map('/produit', 'getProduitLog')->via('LOG');
$app->map('/produit', 'getProduitImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadProduitFile');
$app->run();

function uploadProduitFile() {
	$request = Slim::getInstance()->request();
	file_put_contents('produits.csv', $request->getBody());
	loadProduitFromFile('produits.csv');
}

function loadProduitFromFile($file) {
    $row = 1;
    $fp = fopen ($file,"r");
    clearProduit();
	clearLogImport();
    while ($data = fgetcsv ($fp, 1000, ";")) {
        if($row!=1){
        	addProduitByFile($data[0],$data[8], $data[1], $data[3]);
        }
		$row++;
        
	}
	fclose ($fp);
}

function getProduits() {
	$sql = "SELECT * FROM produit ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$produits = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($produits);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getProduit($id) {
	$sql = "SELECT * FROM produit WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$produit = $stmt->fetchObject();
		$db = null;
		echo json_encode($produit);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addProduit() {
	error_log("\naddProduit:", 3, 'produit.log');
	$request = Slim::getInstance()->request();
	$produit = json_decode($request->getBody());
	error_log($produit->reference, 3, 'produit.log');
	$sql = "INSERT INTO produit (reference, cu, quai, designation) VALUES (:reference, :cu, :quai, :designation)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $produit->reference);
		$stmt->bindParam("cu", $produit->cu);
		$stmt->bindParam("quai", $produit->quai);
		$stmt->bindParam("designation", $produit->designation);
		$stmt->execute();
		$produit->id = $db->lastInsertId();
		$db = null;
		echo json_encode($produit); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'produit.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addProduitByFile($reference, $cu, $quai, $designation) {
	error_log("\naddProduitByFile:", 3, 'produit_import.log');
	error_log($reference, 3, 'produit_import.log');
	$sql = "INSERT INTO produit (reference, cu, quai, designation) VALUES (:reference, :cu, :quai, :designation)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $reference);
		$stmt->bindParam("cu", $cu);
		$stmt->bindParam("quai", $quai);
		$stmt->bindParam("designation", $designation);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'produit_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateProduit($id) {
	error_log("\nupdateProduit:", 3, 'produit.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$produit = json_decode($body);
	error_log($id, 3, 'produit.log');
	$sql = "UPDATE produit SET reference=:reference, cu=:cu, quai=:quai, designation=:designation WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("reference", $produit->reference);
		$stmt->bindParam("cu", $produit->cu);
		$stmt->bindParam("quai", $produit->quai);
		$stmt->bindParam("designation", $produit->designation);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($produit); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'produit.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteProduit($id) {
	error_log("\ndeleteProduit:", 3, 'produit.log');
	error_log($id, 3, 'produit.log');
	$sql = "DELETE FROM produit WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'produit.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearProduit() {
	error_log("\nclearProduit:", 3, 'produit_import.log');
	$sql = "TRUNCATE TABLE produit";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'produit_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearLogImport() {
	unlink('produit_import.log');
	unlink('produit.log');
	error_log("LOG PRODUIT IMPORT", 3, 'produit_import.log');
	error_log("LOG PRODUIT", 3, 'produit.log');
}

function getProduitLog() {
	$log = array('file' => 'produit.log', 'text' => file_get_contents('produit.log'));
	echo json_encode($log); 

}

function getProduitImportLog() {
	$log = array('file' => 'produit_import.log', 'text' => file_get_contents('produit_import.log'));
	echo json_encode($log); 

}

?>