<?php

set_time_limit ( 1200 );

require_once '../Slim/Slim.php';
require_once '../Db/db.php';

$app = new Slim();
$app->post('/files', 'uploadFile');
$app->get('/read_order/:start/:pagination', 'readOrdre');

$app->run();

function uploadFile() {

	$request = Slim::getInstance()->request();
	// on lit directement le file fichier dans le body de la requete
	$handle = fopen('data://text/plain,' .  $request->getBody(), "r");
	if ($handle) {
		
		$bdd = getConnection();
		$bdd->exec("delete from ordres_alto");

		$bdd->beginTransaction();
		$stmt = $bdd->prepare("INSERT INTO ordres_alto (identifiant, dh_fju, site, product, coforHybrid, numOrder, sgr, mag, line, pt_conso, quantity_comm, quantity_recu, etalonnage_ua, nb_uc_ua, etalonnage_fnr, condi_fnr, condi_ua, quai, depart, reception, dhef, dhrc, dheo, dhlv, dhxc, dhrq, sys_order, oetCode) VALUES (:alto, :fju, :site, :produit, :cofor, :numOrder, :sgr, :mag, :ligne, :ptConso, :qty_comm, :qty_recu, :etalonnageUa, :nbrUCParUA, :etalonnageFournisseur, :conditionnFournisseur, :conditionnUA, :quaiALTO, :indicePrixDepart, :indiceReception, :dhef, :dhrc, :dheo, :dhlv, :dhxc,:dhrq, :sysOrder, :oetCode)");

		while (($line = fgets($handle)) !== false) {
			$time_start = microtime(true);
			$alto = substr($line,0,4);
			$fju = substr($line,4,4) . "-" .  substr($line,8,2). "-" . substr($line,10,2) . " " . substr($line,12,2) . ":" . substr($line,14,2) . ':00';
			$site = substr($line,16,3);
			$produit = substr($line,19,10);
			$cofor = substr($line,29,10);
			$numOrder = substr($line,39,10);
			$sgr = substr($line,49,3);
			$mag = substr($line,52,3);
			$ligne = substr($line,55,2);
			$ptConso = substr($line,57,13);
			$qty_comm = substr($line,70,9);
			$qty_recu = substr($line,79,9);
			$etalonnageUa = substr($line,88,9);
			$nbrUCParUA = substr($line,97,9);
			$etalonnageFournisseur = substr($line,106,9);
			$conditionnFournisseur = substr($line,115,5);
			$conditionnUA = substr($line,120,5);
			$quaiALTO = substr($line,125,9);
			$indicePrixDepart = substr($line,134,1);
			$indiceReception = substr($line,135,1);
			
			$dhef = substr($line,136,4) . '-' .  substr($line,140,2). '-' . substr($line,142,2) . ' ' . substr($line,144,2) . ':' . substr($line,146,2) . ':00';
			$dhrc = substr($line,148,4) . '-' .  substr($line,152,2). '-' . substr($line,154,2) . ' ' . substr($line,156,2) . ':' . substr($line,158,2) . ':00';
			$dheo = substr($line,160,4) . '-' .  substr($line,164,2). '-' . substr($line,166,2) . ' ' . substr($line,168,2) . ':' . substr($line,170,2) . ':00';
			$dhlv = substr($line,172,4) . '-' .  substr($line,176,2). '-' . substr($line,178,2) . ' ' . substr($line,180,2) . ':' . substr($line,182,2) . ':00';
			$dhxc = substr($line,184,4) . '-' .  substr($line,188,2). '-' . substr($line,190,2) . ' ' . substr($line,192,2) . ':' . substr($line,194,2) . ':00';
			$dhrq = substr($line,196,4) . '-' .  substr($line,200,2). '-' . substr($line,202,2) . ' ' . substr($line,204,2) . ':' . substr($line,206,2) . ':00';
			$sysOrder = substr($line,208,1);
			$oetCode = substr($line,209,9);
			
			echo $alto . ',' . $fju . ',' . $site . ',' . $produit . ',' . $cofor . ',' . $numOrder . ',' . $sgr . ',' . $mag . ',' . $ligne . ',' . $ptConso . ',' . $qty_comm . ',' . $qty_recu . ',' .
			$etalonnageUa . ',' . $nbrUCParUA . ',' . $etalonnageFournisseur . ',' . $conditionnFournisseur . ',' . $conditionnUA . ',' . $quaiALTO . ',' . $indicePrixDepart . ',' . $indiceReception . ',' .
			$dhef . ',' . $dhrc . ',' . $dheo . ',' . $dhlv . ',' . $dhxc . ',' . $dhrq . ',' . $sysOrder . ',' . $oetCode . '<br />' ;
			$time_end_un  = microtime(true);
		
			$stmt->bindValue('alto', $alto, PDO::PARAM_STR);
			$stmt->bindValue('fju', $fju, PDO::PARAM_STR);
			$stmt->bindValue('site', $site, PDO::PARAM_STR);
			$stmt->bindValue('produit', $produit, PDO::PARAM_STR);
			$stmt->bindValue('cofor', $cofor, PDO::PARAM_STR);
			$stmt->bindValue('numOrder', $numOrder, PDO::PARAM_STR);
			$stmt->bindValue('sgr', $sgr, PDO::PARAM_STR);
			$stmt->bindValue('mag', $mag, PDO::PARAM_STR);
			$stmt->bindValue('ligne', $ligne, PDO::PARAM_STR);
			$stmt->bindValue('ptConso', $ptConso, PDO::PARAM_STR);
			$stmt->bindValue('qty_comm', $qty_comm, PDO::PARAM_STR);
			$stmt->bindValue('qty_recu', $qty_recu, PDO::PARAM_STR);
			$stmt->bindValue('etalonnageUa', $etalonnageUa, PDO::PARAM_STR);
			$stmt->bindValue('nbrUCParUA', $nbrUCParUA, PDO::PARAM_STR);
			$stmt->bindValue('etalonnageFournisseur', $etalonnageFournisseur, PDO::PARAM_STR);
			$stmt->bindValue('conditionnFournisseur', $conditionnFournisseur, PDO::PARAM_STR);
			$stmt->bindValue('conditionnUA', $conditionnUA, PDO::PARAM_STR);
			$stmt->bindValue('quaiALTO', $quaiALTO, PDO::PARAM_STR);
			$stmt->bindValue('indicePrixDepart', $indicePrixDepart, PDO::PARAM_STR);
			$stmt->bindValue('indiceReception', $indiceReception, PDO::PARAM_STR);

			$stmt->bindValue('dhef', $dhef, PDO::PARAM_STR);
			$stmt->bindValue('dhrc', $dhrc, PDO::PARAM_STR);
			$stmt->bindValue('dheo', $dheo, PDO::PARAM_STR);
			$stmt->bindValue('dhlv', $dhlv, PDO::PARAM_STR);
			$stmt->bindValue('dhxc', $dhxc, PDO::PARAM_STR);
			$stmt->bindValue('dhrq', $dhrq, PDO::PARAM_STR);
			$stmt->bindValue('sysOrder', $sysOrder, PDO::PARAM_STR);
			$stmt->bindValue('oetCode', $oetCode, PDO::PARAM_STR);
			
			$stmt->execute();
		
			$time_end_deux  = microtime(true);
			//echo ($time_end_un - $time_start) . " " . ($time_end_deux - $time_end_un) . " <br/>"; 
		}

		fclose($handle);
		
		$bdd->commit();
	} else {
		// error opening the file.
	} 
}

function readOrdre($start, $pagination) {

	$request = Slim::getInstance()->request();

	$start = (int) $start;
	$pagination = (int) $pagination;

	$bdd = getConnection();

	$stmt = $bdd->prepare('SELECT * FROM ordres_alto LIMIT :start, :end');

	$stmt->bindValue('start', $start , PDO::PARAM_INT);
	$stmt->bindValue('end', $pagination, PDO::PARAM_INT);

	$stmt->execute();

	$myData = $stmt->fetchAll();

	header('Content-Type: application/json');
	echo json_encode($myData);

	$stmt->closeCursor();

}

?>