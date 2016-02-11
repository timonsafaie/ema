<?php

// The MathX Chrome Extension
// latexgenerator.php - generates LaTeX for AJAX use
// Authored by Timon Safaie
// All rights reserved.
include_once 'latex.php';

// DB Information
// table:    chrome
// username: root
// password: bxbmU8FJnXIbd1TLSpjW

// Random Filename Generator
// Random File Name generator
function generateRandomString($length) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
	  $randomString .= $characters[rand(0, $charactersLength - 1)];
  }
  return $randomString;
}

$mxscript = $_POST['mathxscript'];
$gdfont   = $_POST['font'];
$userid   = $_POST['userid'];
$session  = $_POST['session'];

// Font to DPI
$gdfont = ($gdfont+1)*10;

// Create the LaTeX Object
$latexTest = new Latex();
// Convert MxS to LaTeX
$latexTest->setMathXScript($mxscript);
$latexcode = $latexTest->getLatex($mxscript);

// Specify input/output filename
$filename = generateRandomString(30);

// REINSTATE
/* $packages = "\\usepackage{amsmath,amsthm,txfonts,amssymb,latexsym,fancyhdr,gensymb,amsfonts,esint}\n"; */

$packages = "\\usepackage{amsmath,amsthm,txfonts,amssymb,latexsym,fancyhdr,amsfonts}\n";

//$packages = "\\usepackage{amsmath,amsthm,txfonts,amssymb,latexsym,gensymb,minitoc,multicol,subfigure}\n";

//$packages = "\\usepackage{amsmath,amsthm,txfonts,amssymb,latexsym,amsfonts}\n";

// Pipe LaTeX code to input file
$inputfilename = $filename.".tex";
$infile = fopen($inputfilename, "w") or die("Unable to open file!");
fwrite($infile, "\\documentclass{article}\n");
fwrite($infile, "\\pagestyle{empty}\n");
fwrite($infile, $packages);
//fwrite($infile, "\\usepackage{xspace,amssymb,amsfonts,amsmath}\n");

// REINSTATE
//fwrite($infile, "\\usepackage[all]{xy}\n");

//fwrite("\\usepackage{bbold,algorithme,algorithmic,slashbox}");
//fwrite("\\usepackage{xcolor,rotating,epic,eepic}\n");

//fwrite($infile, "\\usepackage{esint,fourier,wasysym}\n");

fwrite($infile, "\\usepackage{mathptmx}\n");
fwrite($infile, "\\usepackage{color}\n");

// Custom Declares for MathX
fwrite($infile, "\\DeclareMathOperator{\sech}{sech}\n");
fwrite($infile, "\\DeclareMathOperator{\csch}{csch}\n");
fwrite($infile, "\\DeclareMathOperator{\arcsec}{arcsec}\n");
fwrite($infile, "\\DeclareMathOperator{\arccot}{arccot}\n");
fwrite($infile, "\\DeclareMathOperator{\arccsc}{arccsc}\n");
fwrite($infile, "\\DeclareMathOperator{\arccosh}{arccosh}\n");
fwrite($infile, "\\DeclareMathOperator{\arcsinh}{arcsinh}\n");
fwrite($infile, "\\DeclareMathOperator{\arctanh}{arctanh}\n");
fwrite($infile, "\\DeclareMathOperator{\arcsech}{arcsech}\n");
fwrite($infile, "\\DeclareMathOperator{\arccsch}{arccsch}\n");
fwrite($infile, "\\DeclareMathOperator{\arccoth}{arccoth}\n");

//fwrite($infile, "\\usepackage{graphicx}\n");
//fwrite($infile, "\\newcommand{\\invamalg}{\\mathbin{\\rotatebox[origin=c]{180}{$\\amalg$}}}\n");
fwrite($infile, "\\begin{document}\n");

fwrite($infile, "\\begin{displaymath}\n");
//fwrite($infile, "\\begin{math}\n");
//$latexcode = str_replace(' ','',$latexcode);

fwrite($infile, $latexcode."\n");

fwrite($infile, "\\end{displaymath}\n");
//fwrite($infile, "\\end{math}\n");
fwrite($infile, "\\end{document}\n");
fclose($infile);

// Generate the PNG from LaTeX
//shell_exec("perl tex2png.pl --package amsmath --package amssymb --package latexsym -file ".$inputfilename." -output ".$filename);
/* shell_exec("perl tex2png.pl -dpi ".$gdfont." -package amsmath -package amssymb -package latexsym -file ".$inputfilename." -output ".$filename);
*/

shell_exec("bash convert.sh ".$gdfont." ".$filename);


//shell_exec("mv ".$filename.".tex ../output/tex/.");

//shell_exec("mv ".$filename.".png ../output/images/.");

//shell_exec("perl tex2png.pl -file complete.tex -output complete");


// Return the PNG filename
echo $filename.".png";
?>
