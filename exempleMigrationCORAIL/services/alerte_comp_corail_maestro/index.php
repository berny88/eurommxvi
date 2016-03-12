<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// alerte_comp_corail_maestro services
$app->get('/alerte_comp_corail_maestro', 'getAlertesCompCorailMaestro');
$app->put('/alerte_comp_corail_maestro/:id', 'updateAlerteCompCorailMaestro');
$app->map('/alerte_comp_corail_maestro', 'initAlerteCompCorailMaestro')->via('INITIAL');
$app->map('/alerte_comp_corail_maestro', 'getAlerteCompCorailMaestroLog')->via('LOG');
$app->run();

function getAlertesCompCorailMaestro() {
	error_log("\ninitAlerteCompCorailMaestro:", 3, 'alerte_comp_corail_maestro.log');
	$sql = "SELECT id,reference,designation,
			IF(date_rupture_maestro='0000-00-00 00:00:00', '', date_rupture_maestro) AS date_rupture_maestro,
			IF(date_rupture_corail='0000-00-00 00:00:00', '', date_rupture_corail) AS date_rupture_corail, 
			IF(TIMESTAMPDIFF(HOUR, date_rupture_corail, date_rupture_maestro) IS NULL, '', TIMESTAMPDIFF(HOUR, date_rupture_corail, date_rupture_maestro)) AS ecart_date_rupture,
			IF(date_rupture_dotation_atelier_maestro='0000-00-00 00:00:00', '', date_rupture_dotation_atelier_maestro) AS date_rupture_dotation_atelier_maestro,
			IF(date_rupture_minimale_corail='0000-00-00 00:00:00', '', date_rupture_minimale_corail) AS date_rupture_minimale_corail,
			IF(TIMESTAMPDIFF(HOUR, date_rupture_minimale_corail, date_rupture_dotation_atelier_maestro) IS NULL, '', TIMESTAMPDIFF(HOUR, date_rupture_minimale_corail, date_rupture_dotation_atelier_maestro)) AS ecart_date_rupture_minimale,
			commentaire
			FROM alerte_comp_corail_maestro 
			ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$alertes_comp_corail_maestro = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($alertes_comp_corail_maestro, JSON_NUMERIC_CHECK);
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_comp_corail_maestro.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateAlerteCompCorailMaestro($id) {
	error_log("\nupdateAlerteCompCorailMaestro:", 3, 'alerte_comp_corail_maestro.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$alerte_comp_corail_maestro = json_decode($body);
	error_log($id, 3, 'alerte_comp_corail_maestro.log');
	$sql = "UPDATE alerte_comp_corail_maestro SET commentaire=:commentaire WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->bindParam("commentaire", $alerte_comp_corail_maestro->commentaire);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($alerte_comp_corail_maestro, JSON_NUMERIC_CHECK); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_comp_corail_maestro.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function initAlerteCompCorailMaestro() {
	error_log("\ninitAlerteCompCorailMaestro:", 3, 'alerte_comp_corail_maestro.log');
	clearLog();
	clearAlerteCompCorailMaestro();
	$sql = "INSERT INTO alerte_comp_corail_maestro (reference, designation, date_rupture_maestro, date_rupture_corail, date_rupture_dotation_atelier_maestro, date_rupture_minimale_corail) 
			SELECT produit.reference, produit.designation, alerte_maestro.date_rupture, alerte_corail.date_rupture_usine, alerte_maestro.date_rupture_dotation_atelier, alerte_corail.date_rupture_minimale
			FROM produit 
			INNER JOIN alerte_corail ON produit.reference=alerte_corail.reference
			LEFT JOIN alerte_maestro ON alerte_corail.reference=alerte_maestro.reference
			ORDER BY produit.reference";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_comp_corail_maestro.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearAlerteCompCorailMaestro() {
	error_log("\nclearAlerteCompCorailMaestro:", 3, 'alerte_comp_corail_maestro.log');
	$sql = "TRUNCATE TABLE alerte_comp_corail_maestro";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_comp_corail_maestro.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getAlerteCompCorailMaestroLog() {
	$log = array('file' => 'alerte_comp_corail_maestro.log', 'text' => file_get_contents('alerte_comp_corail_maestro.log'));
	echo json_encode($log); 

}

function clearLog() {
	unlink('alerte_comp_corail_maestro.log');
	error_log("LOG COMP MAESTRO CORAIL", 3, 'alerte_comp_corail_maestro.log');
}

?>