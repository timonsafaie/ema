<?php

// The MathX Chrome Extension
// process.php - processes all user data
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconf.php');

// DB Information
// table:    chrome
// username: root
// password: bxbmU8FJnXIbd1TLSpjW

$email = $_POST['email'];
$timezone  = $_POST['timezone'];

$user = null;    // User profile
$result = null;  // Object to return

$userid    = "";
$firstname = "";
$lastname  = "";
$password  = "";
$status    = "";
$session   = 0;

// Look Up Email
if (!empty($email)) {
    $sql = "SELECT * FROM user WHERE email='".$email."'";
    $sth = $dbh->query($sql);
    $sth->setFetchMode(PDO::FETCH_ASSOC);
    if ($row = $sth->fetch()) {
        // Found User. Get Data.
        $userid    = $row['userid'];
        $firstname = $row['firstname'];
        $lastname  = $row['lastname'];
        $password  = $row['password'];
        $status    = $row['status'];
        $user = [
                'userid'    => $userid,
                'firstname' => $firstname,
                'lastname'  => $lastname,
                'email'     => $email,
                'password'  => $password,
                'status'    => $status,
                'session'   => '0'
                ];
        // Update Session Number
        $sql = "SELECT MAX(sessionnumber) FROM session WHERE userid=".$userid;
        $sth = $dbh->query($sql);
        $sth->setFetchMode(PDO:: FETCH_BOTH);
        if ($row = $sth->fetch()) {
            if (!empty($password)) {
                $user['session'] = $row[0]+1;
            } else {
                $user['session'] = 1;
            }
        }
        $result = json_encode($user);
    }
    // New User Signing Up for the first time
    if (empty($userid)) {
        // Add user to the DB
        
        $dbh->beginTransaction();
        $sth = $dbh->prepare('INSERT INTO user (email, status) VALUES (:email, :status)');
        $sth->execute(array(':email'=> $email, ':status' => 'incomplete'));
        
        $sql = "SELECT userid, status FROM user WHERE email='".$email."'";
        $sth = $dbh->query($sql);
        $sth->setFetchMode(PDO::FETCH_ASSOC);
        while($row = $sth->fetch()) {
            $userid = $row['userid'];
            $status = $row['status'];
        } 

        // First Session
        $result = json_encode(['userid' => $userid, 'email' => $email, 'session' => 1, 'status' => $status]);
        
        $dbh->commit();
    }
}
echo $result;
?>