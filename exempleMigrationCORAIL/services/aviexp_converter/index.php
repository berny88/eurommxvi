<?php

require '../Slim/Slim.php';
require '../Db/db.php';

$app = new Slim();

// aviexp_comedi services
$app->map('/aviexp_converter', 'getAviexpConverterImportLog')->via('LOG_IMPORT');
$app->post('/files', 'uploadAviexpConverterFile');
$app->run();

function uploadAviexpConverterFile() {
	$request = Slim::getInstance()->request();
	file_put_contents('aviexp_converter.dat', $request->getBody());
	loadAviexpConverterFromFile('aviexp_converter.dat');
}

function loadAviexpConverterFromFile($file) {

	clearLogImport();
	
	$file_resultat = fopen("aviexp_converter_resultat.dat", "w");
	error_log("\nChargement du fichier", 3, 'aviexp_converter_import.log');
	
	$lines = file($file);

    foreach ($lines as $line_num => $line) {
    	switch (substr($line,0,6)){
    		case "AA0200":
    			$line_modified = substr($line,0,13)."000".substr($line,13,10).substr($line,26);
    			fwrite($file_resultat, $line_modified);
    			break;
    		case "AB0200":
    			$line_modified = substr($line,0,13)."000".substr($line,13,10).substr($line,26);
    			fwrite($file_resultat, $line_modified);
    			break;
    		default:
    			fwrite($file_resultat, $line);
    			break;
    	}
    }
    fclose($file_resultat);
    error_log("\nModification du fichier", 3, 'aviexp_converter_import.log');
    
    $retour = array('file' => 'aviexp_converter_resultat.log', 'text' => file_get_contents('aviexp_converter_resultat.dat'));
	echo json_encode($retour);
	error_log("\nTransmission du fichier", 3, 'aviexp_converter_import.log');
}

function clearLogImport() {
	unlink('aviexp_converter_import.log');
	error_log("LOG AVIEXP CONVERTER IMPORT", 3, 'aviexp_converter_import.log');
}

function getAviexpConverterImportLog() {
	$log = array('file' => 'aviexp_converter_import.log', 'text' => file_get_contents('aviexp_converter_import.log'));
	echo json_encode($log); 
}

?>