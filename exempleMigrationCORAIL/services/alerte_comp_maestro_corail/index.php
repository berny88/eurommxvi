<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// alerte_comp_maestro_corail services
$app->get('/alerte_comp_maestro_corail', 'getAlertesCompMaestroCorail');
$app->put('/alerte_comp_maestro_corail/:id', 'updateAlerteCompMaestroCorail');
$app->map('/alerte_comp_maestro_corail', 'initAlerteCompMaestroCorail')->via('INITIAL');
$app->map('/alerte_comp_maestro_corail', 'getAlerteCompMaestroCorailLog')->via('LOG');
$app->run();

function getAlertesCompMaestroCorail() {
	error_log("\ninitAlerteCompMaestroCorail:", 3, 'alerte_comp_maestro_corail.log');
	$sql = "SELECT id,reference,designation,
			IF(date_rupture_maestro='0000-00-00 00:00:00', '', date_rupture_maestro) AS date_rupture_maestro,
			IF(date_rupture_corail='0000-00-00 00:00:00', '', date_rupture_corail) AS date_rupture_corail, 
			IF(TIMESTAMPDIFF(HOUR, date_rupture_maestro, date_rupture_corail) IS NULL, '', TIMESTAMPDIFF(HOUR, date_rupture_maestro, date_rupture_corail)) AS ecart_date_rupture,
			IF(date_rupture_dotation_atelier_maestro='0000-00-00 00:00:00', '', date_rupture_dotation_atelier_maestro) AS date_rupture_dotation_atelier_maestro,
			IF(date_rupture_minimale_corail='0000-00-00 00:00:00', '', date_rupture_minimale_corail) AS date_rupture_minimale_corail,
			IF(TIMESTAMPDIFF(HOUR, date_rupture_dotation_atelier_maestro, date_rupture_minimale_corail) IS NULL, '', TIMESTAMPDIFF(HOUR, date_rupture_dotation_atelier_maestro, date_rupture_minimale_corail)) AS ecart_date_rupture_minimale,
			commentaire
			FROM alerte_comp_maestro_corail 
			ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$alertes_comp_maestro_corail = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($alertes_comp_maestro_corail, JSON_NUMERIC_CHECK);
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_comp_maestro_corail.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateAlerteCompMaestroCorail($id) {
	error_log("\nupdateAlerteCompMaestroCorail:", 3, 'alerte_comp_maestro_corail.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$alerte_comp_maestro_corail = json_decode($body);
	error_log($id, 3, 'alerte_comp_maestro_corail.log');
	$sql = "UPDATE alerte_comp_maestro_corail SET commentaire=:commentaire WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->bindParam("commentaire", $alerte_comp_maestro_corail->commentaire);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($alerte_comp_maestro_corail, JSON_NUMERIC_CHECK); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_comp_maestro_corail.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function initAlerteCompMaestroCorail() {
	error_log("\ninitAlerteCompMaestroCorail:", 3, 'alerte_comp_maestro_corail.log');
	clearLog();
	clearAlerteCompMaestroCorail();
	$sql = "INSERT INTO alerte_comp_maestro_corail (reference, designation, date_rupture_maestro, date_rupture_corail, date_rupture_dotation_atelier_maestro, date_rupture_minimale_corail) 
			SELECT produit.reference, produit.designation, alerte_maestro.date_rupture, alerte_corail.date_rupture_usine, alerte_maestro.date_rupture_dotation_atelier, alerte_corail.date_rupture_minimale
			FROM produit 
			INNER JOIN alerte_maestro ON produit.reference=alerte_maestro.reference
			LEFT JOIN alerte_corail ON alerte_maestro.reference=alerte_corail.reference
			ORDER BY produit.reference";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_comp_maestro_corail.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearAlerteCompMaestroCorail() {
	error_log("\nclearAlerteCompMaestroCorail:", 3, 'alerte_comp_maestro_corail.log');
	$sql = "TRUNCATE TABLE alerte_comp_maestro_corail";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'alerte_comp_maestro_corail.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getAlerteCompMaestroCorailLog() {
	$log = array('file' => 'alerte_comp_maestro_corail.log', 'text' => file_get_contents('alerte_comp_maestro_corail.log'));
	echo json_encode($log); 

}

function clearLog() {
	unlink('alerte_comp_maestro_corail.log');
	error_log("LOG COMP MAESTRO CORAIL", 3, 'alerte_comp_maestro_corail.log');
}

?>