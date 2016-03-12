<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// aviexp_comedi services
$app->get('/aviexp_comedi', 'getAviexpsComedi');
$app->get('/aviexp_comedi/:id', 'getAviexpComedi');
$app->post('/aviexp_comedi', 'addAviexpComedi');
$app->put('/aviexp_comedi/:id', 'updateAviexpComedi');
$app->delete('/aviexp_comedi/:id', 'deleteAviexpComedi');
$app->map('/aviexp_comedi', 'getAviexpComediLog')->via('LOG');
$app->map('/aviexp_comedi', 'getAviexpComediImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadAviexpComediFile');
$app->run();

function uploadAviexpComediFile() {
	$request = Slim::getInstance()->request();
	file_put_contents('aviexps_comedi.dat', $request->getBody());
	loadAviexpComediFromFile('aviexps_comedi.dat');
}

function loadAviexpComediFromFile($file) {

    clearAviexpComedi();
	clearLogImport();

    $lines = file($file);
    
    $numero_bl;
    $date_constitution;
    $date_jalon;
    $iso_vendeur;
    $agence_vendeur;
    $iso_destinataire;
    $agence_destinataire;
    $point_dechargement;
    $iso_expediteur;
    $agence_expediteur;
    $code_equipement;
    $type_equipement;
    $qte_expediee;
    $unite_expediee;
    $nb_uc;
    $qte_uc;
    $qte_ordre;
    $unite_uc;
    $type_uc;
    $codif_uc;
    $numero_um;    
    $numero_uc;
    $numero_ordre;
    $produit;
    $ordres=array();
    $ordres_to_product=array();
    
    foreach ($lines as $line_num => $line) {
    	switch (substr($line,0,6)){
    		case "SERV  ":
    			$numero_bl="";
			    $date_constitution="";
			    $date_jalon="";
			    $iso_vendeur="";
			    $agence_vendeur="";
			    $iso_destinataire="";
			    $agence_destinataire="";
			    $point_dechargement="";
			    $iso_expediteur="";
			    $agence_expediteur="";
			    $code_equipement="";
			    $type_equipement="";
			    $qte_expediee="";
			    $unite_expediee="";
			    $nb_uc="";
			    $qte_uc="";
			    $qte_ordre="";
			    $unite_uc="";
			    $type_uc="";
			    $codif_uc="";
			    $numero_um="";    
			    $numero_uc="";
			    $numero_ordre="";
			    $produit="";
			    $ordres_to_product=array();
    			break;
    		case "AT0100":
    			$numero_bl=substr($line,6,17);
    			$date_constitution=trim(substr($line,23,14))."00";
    			break;
    		case "AD0300":
    			$date_jalon=trim(substr($line,60,14))."00";
    			break;
    		case "AC1800":
    			$iso_vendeur=substr($line,6,20);
    			$agence_vendeur=substr($line,26,3);
    			break;
    		case "AC0500":
    			$iso_destinataire=substr($line,6,20);
    			$agence_destinataire=substr($line,26,3);
    			break;
    		case "AH0200":
    			$point_dechargement=substr($line,6,17);
    			break;
    		case "AC0600":
    			$iso_expediteur=substr($line,6,20);
    			$agence_expediteur=substr($line,26,3);
    			break;
    		case "AD0400":
    			$code_equipement=substr($line,6,17);
    			$type_equipement=substr($line,23,3);
    			break;
    		case "AA0200":
    			$qte_expediee=substr($line,12,14);
    			$unite_expediee=substr($line,26,3);
    			break;
    		case "AB0200":
    			$nb_uc=substr($line,6,6);
    			$qte_uc=substr($line,12,14);
    			$unite_uc=substr($line,26,3);
    			break;
    		case "AB0300":
    			$type_uc=substr($line,6,17);
    			$codif_uc=substr($line,23,3);
    			break;
    		case "AB0400":
    			$numero_um=substr($line,6,17);
    			break;
    		case "AB0500":
    			$numero_uc=substr($line,6,17);
    			$numero_ordre=substr($line,23,9);

    			if(array_key_exists($numero_ordre, $ordres)){
    				$ordre = $ordres[$numero_ordre];
    				$ordre->qte_ordre+=$qte_uc;
    			}else{
	    			$ordre = new Ordre;
	    			$ordre->numero_bl=$numero_bl;
	    			$ordre->date_constitution=$date_constitution;
	    			$ordre->date_jalon=$date_jalon;
	    			$ordre->iso_vendeur=$iso_vendeur;
	    			$ordre->agence_vendeur=$agence_vendeur;
	    			$ordre->iso_destinataire=$iso_destinataire;
	    			$ordre->agence_destinataire=$agence_destinataire;
	    			$ordre->point_dechargement=$point_dechargement;
	    			$ordre->iso_expediteur=$iso_expediteur;
	    			$ordre->agence_expediteur=$agence_expediteur;
	    			$ordre->code_equipement=$code_equipement;
	    			$ordre->type_equipement=$type_equipement;
	    			$ordre->qte_expediee=$qte_expediee;    			
	    			$ordre->unite_expediee=$unite_expediee;    			
	    			$ordre->nb_uc=$nb_uc;    			
	    			$ordre->qte_uc=$qte_uc;
	    			$ordre->qte_ordre=$qte_uc;
	    			$ordre->unite_uc=$unite_uc;    			
	    			$ordre->type_uc=$type_uc;    			
	    			$ordre->codif_uc=$codif_uc;    			
	    			$ordre->numero_um=$numero_um;   			
	    			$ordre->numero_uc=$numero_uc;  			
	    			$ordre->numero_ordre=$numero_ordre;
	    			
	    			$ordres[$numero_ordre]=$ordre;
	    			
	    			array_push($ordres_to_product, $numero_ordre);
    			}
    			break;
			case "AA0400":
    			$produit=substr($line,6,35);    			
    			foreach ($ordres_to_product as $numero_ordre_to_product){
    				$ordre = $ordres[$numero_ordre_to_product];
    				$ordre->produit=$produit;
    			}
    			$qte_expediee="";
    			$unite_expediee="";
    			$nb_uc="";
    			$qte_uc="";
    			$qte_ordre="";
    			$unite_uc="";
    			$type_uc="";
    			$codif_uc="";
    			$numero_um="";
    			$numero_uc="";
    			$numero_ordre="";
    			$produit="";
    			$ordres_to_product=array();
    			break;  
			default:
				break;  		
    	}
    }	
    foreach ($ordres as $ordre_to_insert){
    	addAviexpComediByFile($ordre_to_insert);
    }

}

function getAviexpsComedi() {
	$sql = "SELECT id,numero_bl,date_constitution,date_jalon,iso_vendeur,agence_vendeur,iso_destinataire,agence_destinataire,
	point_dechargement,iso_expediteur,agence_expediteur,code_equipement,type_equipement,qte_expediee,unite_expediee,nb_uc,qte_uc,qte_ordre,unite_uc,type_uc,
	codif_uc,numero_um,numero_uc,numero_ordre,produit
			FROM aviexp_comedi 
			ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$aviexps_comedi = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($aviexps_comedi);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addAviexpComediByFile(Ordre $aviexp_comedi) {
	error_log("\naddAviexpComediByFile:", 3, 'aviexp_comedi_import.log');
	error_log($aviexp_comedi->numero_ordre, 3, 'aviexp_comedi_import.log');
	$sql = "INSERT INTO aviexp_comedi (numero_bl,date_constitution,date_jalon,iso_vendeur,agence_vendeur,iso_destinataire,agence_destinataire,
			point_dechargement,iso_expediteur,agence_expediteur,code_equipement,type_equipement,qte_expediee,unite_expediee,nb_uc,qte_uc,qte_ordre,
			unite_uc,type_uc,codif_uc,numero_um,numero_uc,numero_ordre,produit) VALUES (:numero_bl,:date_constitution,:date_jalon,:iso_vendeur,:agence_vendeur,:iso_destinataire,:agence_destinataire,:point_dechargement,:iso_expediteur,:agence_expediteur,:code_equipement,:type_equipement,:qte_expediee,:unite_expediee,:nb_uc,:qte_uc,:qte_ordre,:unite_uc,:type_uc,:codif_uc,:numero_um,:numero_uc,:numero_ordre,:produit)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("numero_bl", $aviexp_comedi->numero_bl);
		$stmt->bindParam("date_constitution", $aviexp_comedi->date_constitution);
		$stmt->bindParam("date_jalon", $aviexp_comedi->date_jalon);
		$stmt->bindParam("iso_vendeur", $aviexp_comedi->iso_vendeur);
		$stmt->bindParam("agence_vendeur", $aviexp_comedi->agence_vendeur);
		$stmt->bindParam("iso_destinataire", $aviexp_comedi->iso_destinataire);
		$stmt->bindParam("agence_destinataire", $aviexp_comedi->agence_destinataire);
		$stmt->bindParam("point_dechargement", $aviexp_comedi->point_dechargement);
		$stmt->bindParam("iso_expediteur", $aviexp_comedi->iso_expediteur);
		$stmt->bindParam("agence_expediteur", $aviexp_comedi->agence_expediteur);
		$stmt->bindParam("code_equipement", $aviexp_comedi->code_equipement);
		$stmt->bindParam("type_equipement", $aviexp_comedi->type_equipement);
		$stmt->bindParam("qte_expediee", $aviexp_comedi->qte_expediee);
		$stmt->bindParam("unite_expediee", $aviexp_comedi->unite_expediee);
		$stmt->bindParam("nb_uc", $aviexp_comedi->nb_uc);
		$stmt->bindParam("qte_uc", $aviexp_comedi->qte_uc);
		$stmt->bindParam("qte_ordre", $aviexp_comedi->qte_ordre);
		$stmt->bindParam("unite_uc", $aviexp_comedi->unite_uc);
		$stmt->bindParam("type_uc", $aviexp_comedi->type_uc);
		$stmt->bindParam("codif_uc", $aviexp_comedi->codif_uc);
		$stmt->bindParam("numero_um", $aviexp_comedi->numero_um);
		$stmt->bindParam("numero_uc", $aviexp_comedi->numero_uc);
		$stmt->bindParam("numero_ordre", $aviexp_comedi->numero_ordre);
		$stmt->bindParam("produit", $aviexp_comedi->produit);
		$stmt->execute();
		$id = $db->lastInsertId();
		$db = null;
		echo json_encode($id); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'aviexp_comedi_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearAviexpComedi() {
	error_log("\nclearAviexpComedi:", 3, 'aviexp_comedi_import.log');
	$sql = "TRUNCATE TABLE aviexp_comedi";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'aviexp_comedi_import.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clearLogImport() {
	unlink('aviexp_comedi_import.log');
	unlink('aviexp_comedi.log');	
	error_log("LOG AVIEXP COMEDI IMPORT", 3, 'aviexp_comedi_import.log');
	error_log("LOG AVIEXP COMEDI", 3, 'aviexp_comedi.log');
}

function getAviexpComediLog() {
	$log = array('file' => 'aviexp_comedi.log', 'text' => file_get_contents('aviexp_comedi.log'));
	echo json_encode($log); 

}

function getAviexpComediImportLog() {
	$log = array('file' => 'aviexp_comedi_import.log', 'text' => file_get_contents('aviexp_comedi_import.log'));
	echo json_encode($log); 

}

class Ordre
{
	public $numero_bl;
	public $date_constitution;
	public $date_jalon;
	public $iso_vendeur;
	public $agence_vendeur;
	public $iso_destinataire;
	public $agence_destinataire;
	public $point_dechargement;
	public $iso_expediteur;
	public $agence_expediteur;
	public $code_equipement;
	public $type_equipement;
	public $qte_expediee;
	public $unite_expediee;
	public $nb_uc;
	public $qte_uc;
	public $qte_ordre;
	public $unite_uc;
	public $type_uc;
	public $codif_uc;
	public $numero_um;
	public $numero_uc;
	public $numero_ordre;
	public $produit;
}
?>