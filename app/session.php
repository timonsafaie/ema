<?php

// The MathX Chrome Extension
// process.php - processes all user data
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconf.php');

// User Profile segments
$userid    = $_POST['userid'];
$timezone  = $_POST['timezone'];
$version   = $_POST['appversion'];
$user = array('session' => 0);
$result = null;
$session = 0;

// Look Up Email
if (!empty($userid)) {
        $sql = "SELECT MAX(sessionnumber) FROM session WHERE userid='".$userid."'";
        $sth = $dbh->query($sql);
        $sth->setFetchMode(PDO::FETCH_BOTH);
        if ($row = $sth->fetch()) {
            if ($row[0]) {
                $session = $row[0];
            }
            $sql = "SELECT status FROM user WHERE userid='".$userid."'";
            $sth = $dbh->query($sql);
            if($row = $sth->fetch()) {
                if ($row['status'] == 'incomplete') {
                    $session = -1;
                }
            }
            $user['session'] = $session+1;
            $sth = $dbh->prepare('INSERT INTO session (userid, sessionnumber, appversion, datetime, timezoneoffset) VALUES (:userid, :sessionnumber, :appversion, :datetime, :timezoneoffset)');
            $sth->execute(array(
                ':userid'         => $userid, 
                ':sessionnumber'  => $session+1,
                ':appversion'     => $version,
                ':datetime'       => gmdate("Y-m-d H:i:s"),
                ':timezoneoffset' => $timezone)
            );
        }
    $result = $session + 1;
}
echo $result;

?>