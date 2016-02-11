<?php
// The MathX Chrome Extension
// dbconf.php - setup pdo
// Authored by Timon Safaie
// All rights reserved.

// Live Server
$host = "demonstranda-db-instance.c4tfv2raiv2x.us-west-1.rds.amazonaws.com";
$db = "mathx";
$user = "demonstrandauser";
$passwd = "demon1mx";
    
// Localhost
if(strstr($_SERVER['SERVER_NAME'], 'localhost')) {	
	$host = "localhost";
	$user = "mathx";
	$passwd = "umshootFontOor";
	$db = "chrome_extension";
}

// Configuration statement for PDO
$conf = "mysql:host=".$host.";dbname=".$db;

// PDO initialization
# connect to the database
try {
  $dbh = new PDO($conf, $user, $passwd);
  $dbh->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
} catch(PDOException $e) {
    echo "Failed to connect to db. Error: ".$e;
}

?>
