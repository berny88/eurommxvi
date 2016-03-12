<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// stock_comp_produit_sens2 services
$app->get('/stock_comp_produit_sens2', 'getStocksCompProduitSens2');
$app->put('/stock_comp_produit_sens2/:id', 'updateStockCompProduitSens2');
$app->map('/stock_comp_produit_sens2', 'initStockCompProduitSens2')->via('INITIAL');
$app->map('/stock_comp_produit_sens2', 'getStockCompProduitSens2Log')->via('LOG');
$app->run();

function getStocksCompProduitSens2() {
	error_log("\ninitStockCompProduitSens2:", 3, 'stock_comp_produit_sens2.log');
	$sql = "SELECT * FROM stock_comp_produit_sens2 ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$stock_comp_produit_sens2 = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($stock_comp_produit_sens2, JSON_NUMERIC_CHECK);
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_comp_produit_sens2.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateStockCompProduitSens2($id) {
	error_log("\nupdateStockCompProduitSens2:", 3, 'stock_comp_produit_sens2.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$stock_comp_produit_sens2 = json_decode($body);
	error_log($id, 3, 'stock_comp_produit_sens2.log');
	$sql = "UPDATE stock_comp_produit_sens2 SET commentaire=:commentaire WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->bindParam("commentaire", $stock_comp_produit_sens2->commentaire);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($stock_comp_produit_sens2, JSON_NUMERIC_CHECK); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_comp_produit_sens2.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function initStockCompProduitSens2() {
	error_log("\ninitStockCompProduitSens2:", 3, 'stock_comp_produit_sens2.log');
	clearLog();
	clearStockCompProduitSens2();
	$sql = "INSERT INTO stock_comp_produit_sens2 (reference, cu, quai, designation) 
			SELECT reference, cu, quai, designation FROM produit WHERE reference NOT IN (SELECT produit FROM stock_sens2)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_comp_produit_sens2.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearStockCompProduitSens2() {
	error_log("\nclearStockCompProduitSens2:", 3, 'stock_comp_produit_sens2.log');
	$sql = "TRUNCATE TABLE stock_comp_produit_sens2";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'stock_comp_produit_sens2.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getStockCompProduitSens2Log() {
	$log = array('file' => 'stock_comp_produit_sens2.log', 'text' => file_get_contents('stock_comp_produit_sens2.log'));
	echo json_encode($log); 

}

function clearLog() {
	unlink('stock_comp_produit_sens2.log');
	error_log("LOG COMP PRODUIT SENS2", 3, 'stock_comp_produit_sens2.log');
}

?>