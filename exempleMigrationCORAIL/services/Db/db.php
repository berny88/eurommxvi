<?php

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="root";
	$dbname="migration";
	$bdd = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $dbpass);
	$bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
	return $bdd;
}

function getCorailConnection() {
	$tns = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=yvks3220)(PORT=1521)))(CONNECT_DATA=(SID=korbd)))";
	$bddCorail = new PDO("oci:dbname=$tns", 'ETUDES', 'ETUDES01');
	$bddCorail->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
	$bddCorail->exec("alter session set edition = V1_6");
	return $bddCorail;
}

?>