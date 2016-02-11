<?php

// The MathX Chrome Extension
// post.php - processes all post data
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconf.php');

// Grab all incoming data
$userid    = $_POST['userid'];
$mxs       = $_POST['mathxscript'];
$latex     = $_POST['latex'];
$html      = $_POST['html'];
$filename  = $_POST['file'];
$font      = $_POST['font'];
$width     = $_POST['width'];
$timezone  = $_POST['timezone'];
$sessionid = $postid = 0;

// Look Up Email
if (!empty($userid)) {
    
    // Start the DB transactions
    $dbh->beginTransaction();
    
    // First find the Session ID
    $sql = "SELECT MAX(sessionid) FROM session WHERE userid='".$userid."'";
    $sth = $dbh->query($sql);
    $sth->setFetchMode(PDO::FETCH_BOTH);
    if ($row = $sth->fetch()) {
        $sessionid = $row[0];
    }
    
    // Insert all post data into the DB
    $sth = $dbh->prepare('INSERT INTO post (userid, mathxscript, latex, html, imagefile, texfile, font, width, sessionid, datetime, timezoneoffset) VALUES (:userid, :mathxscript, :latex, :html, :imagefile, :texfile, :font, :width, :sessionid, :datetime, :timezoneoffset)');
    
    $sth->execute(
                  array(':userid'         => $userid,
                        ':mathxscript'    => $mxs,
                        ':latex'          => $latex,
                        ':html'           => $html,
                        ':imagefile'      => $filename.'.png',
                        ':texfile'        => $filename.'.tex',
                        ':font'           => $font,
                        ':width'          => $width,
                        ':sessionid'      => $sessionid,
                        ':datetime'       => gmdate("Y-m-d H:i:s"),
                        ':timezoneoffset' => $timezone)
    );
    
    $sql = "SELECT postid FROM post WHERE userid='".$userid."' AND imagefile='".$filename.".png'";
    $sth = $dbh->query($sql);
    while ($row = $sth->fetch()) {
        $postid = $row[0];
    }
    
    // Finished
    $dbh->commit();
    
    // Close Connection
    $dbh = null;
}

echo $postid;

?>