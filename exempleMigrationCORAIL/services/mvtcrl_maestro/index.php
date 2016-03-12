<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// mvtcrl_maestro services
$app->get('/mvtcrl_maestro', 'getMvtcrlsMaestro');
$app->map('/mvtcrl_maestro', 'getMvtcrlMaestroLog')->via('LOG');
$app->map('/mvtcrl_maestro', 'getMvtcrlMaestroImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadMvtcrlMaestroFile');
$app->run();

function uploadMvtcrlMaestroFile() {
	$request = Slim::getInstance()->request();
	file_put_contents('mvtcrls_maestro.dat', $request->getBody());
	loadMvtcrlMaestroFromFile('mvtcrls_maestro.dat');
}

function loadMvtcrlMaestroFromFile($file) {

    clearMvtcrlMaestro();
	clearLogImport();
    
	$lines = file($file);
	
	foreach ($lines as $line_num => $line) {
		file_put_contents('mvtcrls_maestro_tmp.dat', $line);
		$reader = new XMLReader();
		$reader->open('mvtcrls_maestro_tmp.dat');
		while ($reader->read()) {
			if ($reader->nodeType == XMLREADER::ELEMENT){
				if ($reader->name == "str:Parameters"){
					$date_message="";
					$sgr="";
					$cofor_hybride="";
					$date_expedition="";
					$immatriculation_moyen="";
					$numero_oet="";
					$numero_bl="";
				}
				if ($reader->name == "pxd:CustomerSGR"){
					$sgr=$reader->readString ();
				}
				if ($reader->name == "pxd:Ship-fromPartyID"){
					$cofor_hybride=$reader->readString ();
				}
				if ($reader->name == "pxd:DeliveryDate"){
					$date_expedition=$reader->readString ();
				}	
				if ($reader->name == "pxd:TowID"){
					$immatriculation_moyen=$reader->readString ();
				}
				if ($reader->name == "pxd:CarriageOrderID"){
					$numero_oet=$reader->readString ();
				}
				if ($reader->name == "pxd:DeliveryID"){
					$numero_bl=$reader->readString ();
					echo getCu();
					if(strtoupper(substr($sgr,0,2))==strtoupper(getCu())){
						addMvtcrlMaestroByFile($sgr,$cofor_hybride,$date_expedition,$immatriculation_moyen,$numero_oet,$numero_bl);
					}
				}
			}
		}
		$reader->close();
	}
}

function getCu() {
	$sql = "SELECT valeur FROM parametre WHERE nom='cu' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$parametre = $stmt->fetchObject();
		$db = null;
		return (String)$parametre->valeur;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getMvtcrlsMaestro() {
	$sql = "SELECT id,sgr,cofor_hybride,date_expedition,immatriculation_moyen,numero_oet,numero_bl
			FROM mvtcrl_maestro 
			ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$mvtcrls_maestro = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($mvtcrls_maestro);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addMvtcrlMaestroByFile($sgr,$cofor_hybride,$date_expedition,$immatriculation_moyen,$numero_oet,$numero_bl) {
	error_log("\naddMvtcrlMaestroByFile:", 3, 'mvtcrl_maestro_import.log');
	error_log($numero_bl, 3, 'mvtcrl_maestro_import.log');
	$sql = "INSERT INTO mvtcrl_maestro (sgr,cofor_hybride,date_expedition,immatriculation_moyen,numero_oet,numero_bl) VALUES (:sgr,:cofor_hybride,:date_expedition,:immatriculation_moyen,:numero_oet,:numero_bl)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("sgr", $sgr);
		$stmt->bindParam("cofor_hybride", $cofor_hybride);
		$stmt->bindParam("date_expedition", $date_expedition);
		$stmt->bindParam("immatriculation_moyen", $immatriculation_moyen);
		$stmt->bindParam("numero_oet", $numero_oet);
		$stmt->bindParam("numero_bl", $numero_bl);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'mvtcrl_maestro_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearMvtcrlMaestro() {
	error_log("\nclearMvtcrlMaestro:", 3, 'mvtcrl_maestro_import.log');
	$sql = "TRUNCATE TABLE mvtcrl_maestro";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'mvtcrl_maestro_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearLogImport() {
	unlink('mvtcrl_maestro_import.log');
	unlink('mvtcrl_maestro.log');	
	error_log("LOG MVTCRL MAESTRO IMPORT", 3, 'mvtcrl_maestro_import.log');
	error_log("LOG MVTCRL MAESTRO", 3, 'mvtcrl_maestro.log');
}

function getMvtcrlMaestroLog() {
	$log = array('file' => 'mvtcrl_maestro.log', 'text' => file_get_contents('mvtcrl_maestro.log'));
	echo json_encode($log); 

}

function getMvtcrlMaestroImportLog() {
	$log = array('file' => 'mvtcrl_maestro_import.log', 'text' => file_get_contents('mvtcrl_maestro_import.log'));
	echo json_encode($log); 

}

?>