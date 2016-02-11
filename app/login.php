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

$email  = $_POST['email'];
$input  = $_POST['password'];

$user = null;    // User profile
$result = null;  // Object to return

$userid    = "";
$firstname = "";
$lastname  = "";
$password  = "";
$status    = "";

function verify($password, $hashedPassword) {
    return crypt($password, $hashedPassword) == $hashedPassword;
}

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
                'status'    => $status
        ];
        
        if (verify($input, $password)) {
            $user['password'] = 'verified';
        } else {
            $user['password'] = 'wrong password';
        }
        
        $result = json_encode($user);
    }
}
echo $result;
?>