<?php

// The MathX Chrome Extension
// width.php - updates the image width in db
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconf.php');

// Grab all incoming data
$postid    = $_POST['postid'];
$width     = $_POST['width'];

// Look Up Email
if (!empty($postid)) {
    
    // Start the DB transactions
    $dbh->beginTransaction();
    
    $sth = $dbh->prepare('UPDATE post SET width=:width WHERE postid=:postid');
    $sth->execute( array(':width' => $width, ':postid' => $postid) );
    
    // Finished
    $dbh->commit();
    
    // Close Connection
    $dbh = null;
}

?>