<?php

// The MathX Chrome Extension
// latexgenerator.php - generates LaTeX for AJAX use
// Authored by Timon Safaie
// All rights reserved.
include_once 'latex.php';
include ('includes/dbconn.php');

$mxscript = $_POST['mathxscript'];

// Create the LaTeX Object
$latexTest = new Latex();
// Convert MxS to LaTeX
$latexTest->setMathXScript($mxscript);
$latexcode = $latexTest->getLatex($mxscript);

// Return the PNG filename
echo $latexcode;

?>
