<?php

// The MathX Chrome Extension
// post.php - processes all post data
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconf.php');

// Grab all incoming data
$userid    = $_POST['userid'];
$session   = $_POST['session'];
$tosize    = $_POST['tosize'];
$tofile    = $_POST['tofile'];
$fromfile  = $_POST['fromfile'];
$timezone  = $_POST['timezone'];
$postid = "";
$fromsize  = $sessionid = 0;

// Look Up Email
if (!empty($tofile)) {
    
    // Start the DB transactions
    $dbh->beginTransaction();
    
    // First find the Session ID
    $sql = "SELECT sessionid FROM session WHERE userid='".$userid."' AND sessionnumber='".$session."'";
    $sth = $dbh->query($sql);
    $sth->setFetchMode(PDO::FETCH_BOTH);
    if ($row = $sth->fetch()) {
        $sessionid = $row[0];
    }
    
     // Get the fromsize and fromfile
    $sql = "SELECT postid, imagefile, font FROM post WHERE imagefile='".$fromfile."'";
    $sth = $dbh->query($sql);
    if ($row = $sth->fetch()) {
        $postid   = $row['postid'];
        $fromsize = $row['font'];
    }
    
    // Insert all size updates into the DB
    $sth = $dbh->prepare('INSERT INTO size (postid, sessionid, fromsize, tosize, fromfile, tofile, datetime, timezoneoffset) VALUES (:postid, :sessionid, :fromsize, :tosize, :fromfile, :tofile, :datetime, :timezoneoffset)');
    
    $sth->execute(
                  array(':postid'         => $postid,
                        ':sessionid'      => $sessionid,
                        ':fromsize'       => $fromsize,
                        ':tosize'         => $tosize,
                        ':fromfile'       => $fromfile,
                        ':tofile'         => $tofile,
                        ':datetime'       => gmdate("Y-m-d H:i:s"),
                        ':timezoneoffset' => $timezone)
    );
    
    
    $sth = $dbh->prepare('UPDATE post SET imagefile=:imagefile, font=:size WHERE postid=:postid');
    $sth->execute( array(':postid' => $postid, ':size' => $tosize, ':imagefile' => $tofile) );
    
    // Finished
    $dbh->commit();
    
    // Close Connection
    $dbh = null;
}

// Return handle to Imagefile
echo $tofile;

?>