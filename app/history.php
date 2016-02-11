<?php

// The MathX Chrome Extension
// post.php - processes all post data
// Authored by Timon Safaie
// All rights reserved.
include_once ('includes/dbconf.php');

// Grab all incoming data
$userid = $_POST['userid'];
$session = 0;
$sessionid = 0;
$result = array();

// Look Up Email
if (!empty($userid)) {
    
    
    // Get all posts for this user
    $sql = "SELECT * FROM post WHERE userid=".$userid." ORDER BY postid DESC";
    $sth = $dbh->query($sql);
    $sth->setFetchMode(PDO::FETCH_BOTH);
    
    // Save in data structure
    while ($row = $sth->fetch()) {
        
        // Update the session number if it's different
        if ($sessionid != $row['sessionid']) {
            $nsth = $dbh->query("SELECT sessionnumber FROM session WHERE sessionid=".$row['sessionid']." ORDER BY sessionid DESC");
            $nsth->setFetchMode(PDO::FETCH_ASSOC);
            if ($elem = $nsth->fetch()) {
                $session = $elem['sessionnumber'];
            }
        }
        
        // Setup the result item
        $post = array(
                        "userid"        => $row['userid'],
                        "mathxscript"   => $row['mathxscript'],
                        "latex"         => $row['latex'],
                        "html"          => $row['html'],
                        "imagefile"     => $row['imagefile'],
                        "font"          => $row['font'],
                        "width"         => $row['width'],
                        "session"       => $session,
                        "date"          => $row['datetime'],
                        "timeoffset"    => $row['timezoneoffset']
        );
        array_push($result, $post);
    }
    
    
    // Close Connection
    $dbh = null;
}

echo json_encode($result);

?>