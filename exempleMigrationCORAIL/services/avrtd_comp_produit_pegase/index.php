<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// avrtd_comp_produit_pegase services
$app->get('/avrtd_comp_produit_pegase', 'getAvrtdsCompProduitPegase');
$app->put('/avrtd_comp_produit_pegase/:id', 'updateAvrtdCompProduitPegase');
$app->map('/avrtd_comp_produit_pegase', 'initAvrtdCompProduitPegase')->via('INITIAL');
$app->map('/avrtd_comp_produit_pegase', 'getAvrtdCompProduitPegaseLog')->via('LOG');
$app->run();

function getAvrtdsCompProduitPegase() {
	error_log("\ninitAvrtdCompProduitPegase:", 3, 'avrtd_comp_produit_pegase.log');
	$sql = "SELECT * FROM avrtd_comp_produit_pegase ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$avrtd_comp_produit_pegase = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($avrtd_comp_produit_pegase, JSON_NUMERIC_CHECK);
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_comp_produit_pegase.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateAvrtdCompProduitPegase($id) {
	error_log("\nupdateAvrtdCompProduitPegase:", 3, 'avrtd_comp_produit_pegase.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$avrtd_comp_produit_pegase = json_decode($body);
	error_log($id, 3, 'avrtd_comp_produit_pegase.log');
	$sql = "UPDATE avrtd_comp_produit_pegase SET commentaire=:commentaire WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->bindParam("commentaire", $avrtd_comp_produit_pegase->commentaire);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($avrtd_comp_produit_pegase, JSON_NUMERIC_CHECK); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_comp_produit_pegase.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function initAvrtdCompProduitPegase() {
	error_log("\ninitAvrtdCompProduitPegase:", 3, 'avrtd_comp_produit_pegase.log');
	clearLog();
	clearAvrtdCompProduitPegase();
	$sql = "INSERT INTO avrtd_comp_produit_pegase (reference, cu, quai, designation) 
			SELECT reference, cu, quai, designation FROM produit WHERE reference NOT IN (SELECT produit FROM avrtd_pegase)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_comp_produit_pegase.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearAvrtdCompProduitPegase() {
	error_log("\nclearAvrtdCompProduitPegase:", 3, 'avrtd_comp_produit_pegase.log');
	$sql = "TRUNCATE TABLE avrtd_comp_produit_pegase";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'avrtd_comp_produit_pegase.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getAvrtdCompProduitPegaseLog() {
	$log = array('file' => 'avrtd_comp_produit_pegase.log', 'text' => file_get_contents('avrtd_comp_produit_pegase.log'));
	echo json_encode($log); 

}

function clearLog() {
	unlink('avrtd_comp_produit_pegase.log');
	error_log("LOG COMP PRODUIT PEGASE", 3, 'avrtd_comp_produit_pegase.log');
}

?>