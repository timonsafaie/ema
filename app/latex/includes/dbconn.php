<?php
// Live Server
$host = "demonstranda-db-instance.c4tfv2raiv2x.us-west-1.rds.amazonaws.com";
$db = "mathx";
$user = "demonstrandauser";
$passwd = "demon1mx";

// Localhost
if(strstr($_SERVER['SERVER_NAME'], 'localhost')) {	
	$host = "localhost";
    $db = "chrome_extension";
    $user = "demonstrandauser";
    $passwd = "demon1mx";

$dbconn = mysql_connect($host, $user, $passwd)
	or die ('Error connecting to mysql');
	
mysql_select_db($db);

?>
