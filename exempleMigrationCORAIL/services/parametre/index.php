<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// parametre services
$app->get('/parametre', 'getParametres');
$app->get('/parametre/:id', 'getParametre');
$app->map('/parametre/:nom', 'getParametreByNom')->via('GETBYNOM');
//$app->get('/parametre/:name', 'getParametreByName');
$app->post('/parametre', 'addParametre');
$app->post('/parametre/:nom', 'addParametre');
$app->put('/parametre/:id', 'updateParametre');
$app->delete('/parametre/:id', 'deleteParametre');
$app->map('/parametre', 'getParametreLog')->via('LOG');
$app->run();

function getParametres() {
	$sql = "SELECT * FROM parametre ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$parametres = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($parametres);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getParametre($id) {
	$sql = "SELECT * FROM parametre WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$parametre = $stmt->fetchObject();
		$db = null;
		echo json_encode($parametre);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getParametreByNom($nom) {
	$sql = "SELECT * FROM parametre WHERE nom=:nom LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("nom", $nom);
		$stmt->execute();
		$parametre = $stmt->fetchObject();
		$db = null;
		echo json_encode($parametre);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function addParametre() {
	error_log("\naddParametre:", 3, 'parametre.log');
	$request = Slim::getInstance()->request();
	$parametre = json_decode($request->getBody());
	error_log($parametre->nom, 3, 'parametre.log');
	$sql = "INSERT INTO parametre (nom, valeur) VALUES (:nom, :valeur)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("nom", $parametre->nom);
		$stmt->bindParam("valeur", $parametre->valeur);
		$stmt->execute();
		$parametre->id = $db->lastInsertId();
		$db = null;
		echo json_encode($parametre); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'parametre.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addParametreByFile($nom, $valeur) {
	error_log("\naddParametreByFile:", 3, 'parametre_import.log');
	error_log($nom, 3, 'parametre_import.log');
	$sql = "INSERT INTO parametre (nom, valeur) VALUES (:nom, :valeur)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("nom", $nom);
		$stmt->bindParam("valeur", $valeur);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'parametre_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateParametre($id) {
	error_log("\nupdateParametre:", 3, 'parametre.log');
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$parametre = json_decode($body);
	error_log($id, 3, 'parametre.log');
	$sql = "UPDATE parametre SET nom=:nom, valeur=:valeur WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("nom", $parametre->nom);
		$stmt->bindParam("valeur", $parametre->valeur);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($parametre); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'parametre.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteParametre($id) {
	error_log("\ndeleteParametre:", 3, 'parametre.log');
	error_log($id, 3, 'parametre.log');
	$sql = "DELETE FROM parametre WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'parametre.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getParametreLog() {
	$log = array('file' => 'parametre.log', 'text' => file_get_contents('parametre.log'));
	echo json_encode($log); 

}

?>