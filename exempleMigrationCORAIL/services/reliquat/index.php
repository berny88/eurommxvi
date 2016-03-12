<?php

set_time_limit ( 1200 );

require_once '../Slim/Slim.php';
require_once '../Db/db.php';

$app = new Slim();
$app->put('/calcul_reliquat', 'calculReliquat');
$app->get('/read_reliquat', 'readReliquat');


$app->run();

function calculReliquat() {
	// On se connecte a la db MySQL
	$bddLocal = getConnection();

	// On se connecte a la db CORAIL (oracle)
	$bddCorail = getCorailConnection();
	
	// purge de la table
	$bddLocal->exec("delete from reliquat");

	// Recupere le couple produit/sgr dans CORAIL
	$stmt = $bddCorail->prepare("select distinct myFbb.id_product, myFbb.id_sgr from (SELECT faf.id as id_film, decompo.id as id_decompo, faf.client_type as client_type, faf.cu_code as cu_code, 
					decompo.qty * faf.quantity as quantity, faf.refresh_date as refresh_date, decompo.product as id_product, 
					decompo.user_sgr as id_sgr, SUBSTR(faf.extend_title, 0, 24) as title, faf.count_date as count_date, faf.needed_type as initial_needed_type,
					faf.id_line as line_montage, faf.id_of as id_of, faf.source as source, faf.sequence_corail as sequence_corail, faf.sequence_corail_end as sequence_corail_end,
					faf.time_range as time_range, faf.quantity as title_quantity, faf.needed_type as needed_type, faf.product_bc as product_bc_code,
					decompo.manufacturer_sgr as id_sgr_fab, decompo.id_combination as id_combination, decompo.unit as unit, faf.computing_date as computing_date, decompo.nature as nature,
					null as CREATION_USER, null as CREATION_DATE, null as LAST_UPDATE_USER, null as LAST_UPDATE_DATE
				FROM ko6.KO6QTO00 faf, ko3.KO3QTP01 decompo
				WHERE faf.prefixe_id = decompo.prefixe_id and faf.cu_code=decompo.cu and faf.needed_type in ('JL','JT') and faf.client_type=decompo.client_type
				AND not exists (select 1 from ko6.ko6qto01 where (decompo.product= id_product and decompo.cu=cu_code))
				UNION ALL
				SELECT fbb.id as id_film, fbb.id as id_decompo, fbb.client_type, fbb.cu_code, fbb.quantity, fbb.refresh_date, fbb.id_product, fbb.id_sgr, fbb.title, fbb.count_date,fbb.initial_needed_type,
					fbb.line_montage, fbb.id_of, fbb.source, fbb.sequence_corail, fbb.sequence_corail_end, fbb.time_range, fbb.title_quantity, fbb.needed_type, fbb.product_bc_code, 
					fbb.id_sgr_fab, fbb.id_combination, fbb.unit, fbb.computing_date as computing_date, fbb.nature as nature, fbb.CREATION_USER, fbb.CREATION_DATE, fbb.LAST_UPDATE_USER, 
					fbb.LAST_UPDATE_DATE
				FROM ko6.KO6QTO01 fbb) myFbb where myFbb.needed_type = 'JL' 

				group by myFbb.id_product, myFbb.id_sgr, myFbb.line_montage, myFbb.client_type");
	$stmt->execute();

	while ($donnees = $stmt->fetch()){

		$produit = $donnees['id_product'];
		$sgr = $donnees['id_sgr'];
		
		$minSequenceFbbFv = NULL;
		$minSequenceFbbBc = NULL;
		$minSequenceFbdtFv = NULL;
		$minSequenceFbdtBc = NULL;
		$minSeqAccess = NULL;

		try {
			

			// je recupere la premiere sequence du FBB
			$reponse = $bddCorail->query("select min(myFbb.sequence_corail) as sequenceFbb, myFbb.id_product, myFbb.id_sgr, myFbb.client_type from (SELECT faf.id as id_film, decompo.id as id_decompo, faf.client_type as client_type, faf.cu_code as cu_code, 
				decompo.qty * faf.quantity as quantity, faf.refresh_date as refresh_date, decompo.product as id_product, 
				decompo.user_sgr as id_sgr, SUBSTR(faf.extend_title, 0, 24) as title, faf.count_date as count_date, faf.needed_type as initial_needed_type,
				faf.id_line as line_montage, faf.id_of as id_of, faf.source as source, faf.sequence_corail as sequence_corail, faf.sequence_corail_end as sequence_corail_end,
				faf.time_range as time_range, faf.quantity as title_quantity, faf.needed_type as needed_type, faf.product_bc as product_bc_code,
				decompo.manufacturer_sgr as id_sgr_fab, decompo.id_combination as id_combination, decompo.unit as unit, faf.computing_date as computing_date, decompo.nature as nature,
				null as CREATION_USER, null as CREATION_DATE, null as LAST_UPDATE_USER, null as LAST_UPDATE_DATE
			FROM ko6.KO6QTO00 faf, ko3.KO3QTP01 decompo
			WHERE faf.prefixe_id = decompo.prefixe_id and faf.cu_code=decompo.cu and faf.needed_type in ('JL','JT') and faf.client_type=decompo.client_type
			AND not exists (select 1 from ko6.ko6qto01 where (decompo.product= id_product and decompo.cu=cu_code))
			UNION ALL
			SELECT fbb.id as id_film, fbb.id as id_decompo, fbb.client_type, fbb.cu_code, fbb.quantity, fbb.refresh_date, fbb.id_product, fbb.id_sgr, fbb.title, fbb.count_date,fbb.initial_needed_type,
				fbb.line_montage, fbb.id_of, fbb.source, fbb.sequence_corail, fbb.sequence_corail_end, fbb.time_range, fbb.title_quantity, fbb.needed_type, fbb.product_bc_code, 
				fbb.id_sgr_fab, fbb.id_combination, fbb.unit, fbb.computing_date as computing_date, fbb.nature as nature, fbb.CREATION_USER, fbb.CREATION_DATE, fbb.LAST_UPDATE_USER, 
				fbb.LAST_UPDATE_DATE
			FROM ko6.KO6QTO01 fbb) myFbb where myFbb.id_product = '$produit' and myFbb.id_sgr = '$sgr' and myFbb.needed_type = 'JL' group by myFbb.id_product, myFbb.id_sgr, myFbb.client_type");

			while ($fbb = $reponse->fetch()){
				if($fbb['CLIENT_TYPE'] == 'FV'){
					$minSequenceFbbFv = $fbb['SEQUENCEFBB'];
				}else if($fbb['CLIENT_TYPE'] == 'BC'){
					$minSequenceFbbBc = $fbb['SEQUENCEFBB'];
				}
			}

			$reponse->closeCursor();
			
			// je recupere la premiere sequence du FBDT
			$reponse = $bddCorail->query("select min(start_sliced_sequence) as sliced_sequence, min(start_sliced_sequence_BC) as sliced_sequence_BC from ko6qto03 
			where id_product = '$produit' and id_sgr = '$sgr'");
			
			$fbdt = $reponse->fetch();
			$minSequenceFbdtFv = $fbdt['SLICED_SEQUENCE'];
			$minSequenceFbdtBc = $fbdt['SLICED_SEQUENCE_BC'];
			
			$reponse->closeCursor();
			
			$quantity = NULL;
			$besoinsAccess = NULL;
			
			// besoins FV
			if($minSequenceFbdtFv != NULL){
				if($minSequenceFbdtFv > $minSequenceFbbFv){
					$reponse = $bddCorail->query("select sum(quantity) as qty from ko6qto02 where id_product = '$produit' and id_sgr = '$sgr' and film_type = 'JL' and client_type = 'FV' and sequence_corail >= ". $minSequenceFbbFv ."  and sequence_corail < ". $minSequenceFbdtFv ." ");
					$quantity['FV'] = $reponse->fetch()['QTY'];
					$reponse->closeCursor();
				}
				
				//access
				$reponse = $bddCorail->query("select sum(quantity) as qty from ko6qto02 where id_product = '$produit' and id_sgr = '$sgr' and film_type = 'JL' and sequence_corail < $minSequenceFbdtFv");
				$besoinsAccess = $reponse->fetch()['QTY'];
				$reponse->closeCursor();
			}
			
			// besoins BC
			if($minSequenceFbdtBc != NULL){
				if($minSequenceFbdtBc > $minSequenceFbbBc){
					$reponse = $bddCorail->query("select sum(quantity) as qty from ko6qto02 where id_product = '$produit' and id_sgr = '$sgr' and film_type = 'JL' and client_type = 'BC' and sequence_corail >= ". $minSequenceFbbBc ."  and sequence_corail < ". $minSequenceFbdtBc ." ");
					$quantity['BC'] = $reponse->fetch()['QTY'];
					$reponse->closeCursor();
				}
			}
			
			// Get start sequence de l'access
			$reponse = $bddCorail->query("select min(sequence_corail) as min_seq from ko6qto02 where id_product = '$produit' and id_sgr = '$sgr' and film_type = 'JL'");
			$minSeqAccess = $reponse->fetch()['MIN_SEQ'];
			$reponse->closeCursor();
			
			// recherche des diff quantity non prise en compte dans CORAIL.
			$reponse = $bddLocal->prepare("SELECT sum(quantity_recu - quantity_comm) as diffQty FROM ordres_alto WHERE quantity_comm <> quantity_recu and reception = 'Y' and product = '$produit' and sgr = '$sgr'");
			$reponse->execute();
			$diff = $reponse->fetch()['diffQty'];
			$reponse->closeCursor();
			
			if($diff == NULL){
				$diff = 0;
			}
			
			// ARE
			$reponse = $bddCorail->prepare("select sum(l00.quantity) as quantity from ko6qtl00 l00 inner join ko6qtl06 l06 on l00.id = l06.id inner join ko2qtf40 f40 on f40.partflow_id = l06.fk_part_flow where l00.nature =  'REA_CD' and l00.type_lo = 'REALIZED' and l06.is_are = 1 and l00.calculated_lo is null and f40.product = '$produit' and status in ('EO', 'EF', 'XC', 'RP', 'XP', 'DT', 'AT', 'EP', 'AS', 'RQ', 'IN_CD', 'ST')");
			$reponse->execute();
			$areQty = $reponse->fetch()['QUANTITY'];
			$reponse->closeCursor();
			
			if($areQty == NULL){
				$areQty = 0;
			}
			
			// reliquat CORAIL
			$reponse = $bddCorail->query("select sum(value) as besoins, to_char(computing_date, 'YYYY-MM-DD') as COMPUTING_DATE from ko3qtpp0 where product_code = '$produit' and PRODUCT_PARAM_TYPE = 'NEEDNESS' group by computing_date");
			$res = $reponse->fetch();
			$besoinsCORAIL = $res['BESOINS'];
			$dateBesoinsCORAIL = $res['COMPUTING_DATE'];
			$reponse->closeCursor();
			
			// INSERT
			$intstr = "";
			$stmtInsert = $bddLocal->prepare("INSERT INTO reliquat (produit, sgr, besoinsFv, besoinsBc, access, besoinsCorail, dateBesoins, are, diffQuantityNp, minSeqFv, maxSeqFv, minSeqBc, maxSeqBc, minSeqAccess, maxSeqAccess) VALUES (:produitc, :sgrc, :besoinsFvc, :besoinsBcc, :besoinsAccess, :besoinsCorail, :dateBesoins, :arec, :diffQuantityNpc, :minSeqFv, :maxSeqFv, :minSeqBc, :maxSeqBc, :minSeqAccess, :maxSeqAccess)");
			$stmtInsert->bindValue('produitc', $produit, PDO::PARAM_STR);
			$stmtInsert->bindValue('sgrc', $sgr, PDO::PARAM_STR);

			$intstr .= "$produit $sgr ";
			
			$stmtInsert->bindValue('besoinsFvc', '0', PDO::PARAM_STR);
			$stmtInsert->bindValue('besoinsBcc', '0', PDO::PARAM_STR);
			$stmtInsert->bindValue('besoinsAccess', '0', PDO::PARAM_STR);
			$stmtInsert->bindValue('besoinsCorail', '0', PDO::PARAM_STR);
			$stmtInsert->bindValue('dateBesoins', '0000-00-00', PDO::PARAM_STR);
			
			if($besoinsCORAIL != NULL){
				$stmtInsert->bindValue('besoinsCorail', $besoinsCORAIL, PDO::PARAM_STR);
				$stmtInsert->bindValue('dateBesoins', $dateBesoinsCORAIL, PDO::PARAM_STR);
				$intstr .= "corail:  $besoinsCORAIL ";
			}
			
			if($besoinsAccess != NULL){
				$stmtInsert->bindValue('besoinsAccess', $besoinsAccess, PDO::PARAM_STR);
				$intstr .= "access:  $besoinsAccess ";
			}
			
			if($quantity != NULL){
				foreach($quantity as $k => $v){
					if($k == 'FV'){
						$stmtInsert->bindValue('besoinsFvc', $quantity[$k], PDO::PARAM_STR);
						$intstr .= "fv:  $quantity[$k] ";
					}else{
						$stmtInsert->bindValue('besoinsBcc', $quantity[$k], PDO::PARAM_STR);
						$intstr .= "bc:  $quantity[$k] ";
					}
				}
			}
			
			$stmtInsert->bindValue('arec', $areQty, PDO::PARAM_STR);
			$stmtInsert->bindValue('diffQuantityNpc', $diff, PDO::PARAM_STR);
			$stmtInsert->bindValue('minSeqFv', 0, PDO::PARAM_INT);
			$stmtInsert->bindValue('maxSeqFv', 0, PDO::PARAM_INT);
			$stmtInsert->bindValue('minSeqBc', 0, PDO::PARAM_INT);
			$stmtInsert->bindValue('maxSeqBc', 0, PDO::PARAM_INT);
			$stmtInsert->bindValue('minSeqAccess', 0, PDO::PARAM_INT);
			$stmtInsert->bindValue('maxSeqAccess', 0, PDO::PARAM_INT);
			
			if($minSequenceFbbFv != NULL){
				$stmtInsert->bindValue('minSeqFv', $minSequenceFbbFv, PDO::PARAM_INT);
			}
			if($minSequenceFbbBc != NULL){
				$stmtInsert->bindValue('minSeqBc', $minSequenceFbbBc, PDO::PARAM_INT);
			}
			if($minSequenceFbdtFv != NULL){
				$stmtInsert->bindValue('maxSeqFv', $minSequenceFbdtFv, PDO::PARAM_INT);
				$stmtInsert->bindValue('maxSeqAccess', $minSequenceFbdtFv, PDO::PARAM_INT);
			}
			if($minSequenceFbdtBc != NULL){
				$stmtInsert->bindValue('maxSeqBc', $minSequenceFbdtBc, PDO::PARAM_INT);
			}
			if($minSeqAccess != NULL){
				$stmtInsert->bindValue('minSeqAccess', $minSeqAccess, PDO::PARAM_INT);
			}
			
			$intstr .= " A:$areQty D:$diff MinFbbFv $minSequenceFbbFv MinFbbBc $minSequenceFbbBc MinFbdtFv $minSequenceFbdtFv MinFbdtBc $minSequenceFbdtBc<br/>";
			echo $intstr;
			$stmtInsert->execute();
			//$stmtInsert->debugDumpParams();
			$stmtInsert->closeCursor();

			
		} catch(Exception $e) {
			// En cas d'erreur, on affiche un message et on arrête tout
			die('Erreur : '.$e->getMessage());
		}
	}

	$stmt->closeCursor();
}


function readReliquat() {

	$bdd = getConnection();

	$stmt = $bdd->prepare('SELECT * FROM reliquat');
	$stmt->execute();

	$myMetaData = $stmt->fetchAll();

	//analyse
	foreach($myMetaData as &$myData){
		$cause = "OK";
		if($myData['besoinsFv'] + $myData['besoinsBc'] != $myData['access']){
			
			$cri = "[WARN]";
			$cause = "Besoin CORAIL <> Access";
			
			if($myData['besoinsFv'] == 0 && $myData['besoinsBc'] != 0){
				$cause .= " Produit uniquement avec des besoins complementaires";
			}
			
			if($myData['minSeqFv'] != $myData['minSeqAccess'] && $myData['minSeqBc'] != $myData['minSeqAccess'] ){		
				$cri = "[ERROR]";
				$cause .= " Sequence de début differente";
			}
			
			if($myData['minSeqFv'] == $myData['minSeqAccess'] && $myData['besoinsFv'] + $myData['besoinsBc'] == $myData['besoinsCorail']){
				$cause .= " Faux positif";
			}
			
			if($myData['access'] == $myData['besoinsCorail']){
				$cri = "[ERROR]";
			}
			
			$cause = $cri . ' ' . $cause;
		
		}else if ($myData['besoinsFv'] + $myData['besoinsBc'] != $myData['besoinsCorail']){
			$cause = "[ERROR] Besoin CORAIL <> PHP";
			
			if($myData['besoinsFv'] == 0 && $myData['besoinsBc'] == 0 && $myData['access'] == 0){
				$cause .= " Produit sans besoins";
			}
			
			
		}else if ($myData['are'] != 0){
			$cause = "[ERROR] ARE non pris en compte dans l'access";
		}else if ($myData['diffQuantityNp'] != 0){
			$cause = "[ERROR] Diff quantity non genere dans CORAIL";
		}
		
		$myData['statut'] = $cause;
		
	}

	header('Content-Type: application/json');
	echo json_encode($myMetaData);

	$stmt->closeCursor();

}

?>