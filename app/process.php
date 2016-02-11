<?php

// The MathX Chrome Extension
// process.php - processes all user data
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconf.php');

$email = $_POST['email'];
$user = null;    // User profile
$result = null;  // Object to return
// User Profile segments
$userid    = $_POST['userid'];
$firstname = $_POST['firstname'];
$lastname  = $_POST['lastname'];
$password  = $_POST['password'];
$timezone  = $_POST['timezone'];
// Look Up Email
if (!empty($email)) {
    $sql = "SELECT * FROM user WHERE email='".$email."'";
    $sth = $dbh->query($sql);
    $sth->setFetchMode(PDO::FETCH_ASSOC);
    if ($row = $sth->fetch()) {
        // Retrieve data
        $userid    = $row['userid'];
        $firstname = $row['firstname'];
        $lastname  = $row['lastname'];
        $password  = $row['password'];
        $user = [
                'userid'    => $userid,
                'firstname' => $firstname,
                'lastname'  => $lastname,
                'email'     => $email,
                'password'  => $password,
                'session'   => '0'
                ];
        $sql = "SELECT MAX(sessionnumber) FROM session WHERE userid='".$userid."'";
        $sth = $dbh->query($sql);
        $sth->setFetchMode(PDO:: FETCH_ASSOC);
        if ($row = $sth->fetch()) {
            $user['session'] = $row['sessionnumber']+1;
            $sth = $dbh->prepare('INSERT INTO session (userid, sessionnumber, timezoneoffset) VALUES (:userid, :sessionnumber, :timezoneoffset)');
            $sth->execute(array(':userid' => $userid, ':sessionnumber' => $row['sessionnumber']+1, ':timezoneoffset' => $timezone));
        }
        $result = json_encode($user);
    }
    // New User Signing Up for the first time
    if (empty($userid)) {
        // Add user to the DB
        
        $dbh->beginTransaction();
        $sth = $dbh->prepare('INSERT INTO user (email) VALUES (:email)');
        $sth->execute(array(':email'=> $email));
        
        $sql = "SELECT userid FROM user WHERE email='".$email."'";
        $sth = $dbh->query($sql);
        $sth->setFetchMode(PDO::FETCH_ASSOC);
        while($row = $sth->fetch()) {
            $userid = $row['userid'];
        } 
        
        $result = json_encode(['userid' => $userid]);
        $dbh->commit();
    }
} elseif ($userid) {
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
    // Filled in the sign up form
    $data = array(
        ':firstname' => $firstname,
        ':lastname'  => $lastname,
        ':password'  => $password,
        ':userid'    => $userid
    );
    $sth = $dbh->prepare('UPDATE user SET firstname=:firstname, lastname=:lastname, password=:password WHERE userid=:userid');
    $sth->execute($data);
    $result = "Account Complete.";
}


// Close Connection
$dbh = null;

// Return the result from any
// of the above activies
echo $result;

?>