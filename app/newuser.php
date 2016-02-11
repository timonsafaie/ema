<?php

// The MathX Chrome Extension
// newuser.php - create user
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconf.php');

$user      = null;    // User profile
$sessionid = null;

// User Profile segments
$userid    = $_POST['userid'];
$email     = $_POST['email'];
$firstname = $_POST['firstname'];
$lastname  = $_POST['lastname'];
$password  = $_POST['password'];


function generateHash($password) {
    if (defined("CRYPT_BLOWFISH") && CRYPT_BLOWFISH) {
        $salt = '$2y$11$' . substr(md5(uniqid(rand(), true)), 0, 22);
        return crypt($password, $salt);
    }
}

if ($userid) {
    // Complete New User Sign up
    // Format Data
    $tf = explode(" ", $firstname);
    $tl = explode(" ", $lastname);
    $rf = $rl = "";
    for ($i= 0; $i < count($tf); $i++) {
        $ff = $tf[$i];
        $rf .= strtoupper($ff[0]) . strtolower(substr($ff, 1));
    }
    for ($i= 0; $i < count($tl); $i++) {
        $ll = $tl[$i];
        $rl .= strtoupper($ll[0]) . substr($ll, 1);
    }
    $firstname = $rf;
    $lastname = $rl;
    
    $dbh->beginTransaction();
    // Filled in the sign up form
    $data = array(
        ':firstname' => $firstname,
        ':lastname'  => $lastname,
        ':password'  => generateHash($password),
        ':userid'    => $userid,
        ':status'    => 'complete'
    );
    $sth = $dbh->prepare('UPDATE user SET firstname=:firstname, lastname=:lastname, password=:password, status=:status WHERE userid=:userid');
    $sth->execute($data);
    
    $sth = $dbh->query('SELECT MAX(sessionid) FROM session WHERE userid='.$userid);
    if($row = $sth->fetch()) {
        $sessionid = $row[0];
    } 
    
    $sth = $dbh->prepare('UPDATE session SET sessionnumber=:sessionnumber WHERE sessionid=:sessionid');
    $data = array(
        ':sessionnumber' => 1,
        ':sessionid'     => $sessionid
    );
    $sth->execute($data);
    $dbh->commit();
}

// Close Connection
$dbh = null;

?>