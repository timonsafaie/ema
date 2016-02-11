<?php

// The MathX Chrome Extension
// process.php - processes all user data
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconn.php');

// Setup DB
mysql_select_db('chrome_extension');

$email = strtolower(trim($_POST['email']));
$user = null;    // User profile
$result = null;  // Object to return
// User Profile segments
$userid = "";
$firstname = $_POST['firstname'];
$lastname  = $_POST['lastname'];
$password  = $_POST['password'];

// Look Up Email
if (!empty($email)) {
    $sql = "SELECT * FROM user WHERE email='".trim($email)."'";
    $retval = mysql_query($sql);
    while($row = mysql_fetch_assoc($retval)) {
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
                'password'  => $password
                ];
        $result = json_encode($user);
    }
    // New User Signing Up for the first time
    if (empty($userid)) {
        
        mysql_query("INSERT INTO user (email) VALUES (".$email.")");
        $retval = mysql_query('SELECT userid FROM user WHERE email='.$email);
        while($row = mysql_fetch_assoc($retval)) {
            $userid = $row['userid'];
        }
        $result = json_encode(['userid' => $userid]);
    }
} elseif ($userid) {
    // Filled in the sign up form
    mysql_query("UPDATE user SET firstname=".$firstname.", lastname=".$lastname.", password=".$password." WHERE userid=".$userid);
    $result = "Account Complete.";
}


// Close Connection
mysql_close($dbconn);

// Return the result from any
// of the above activies
echo $result;

?>