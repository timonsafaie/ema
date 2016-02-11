<html>
<head>
<title>MathX to LaTeX</title>
<script type="text/javascript"
  src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
</head>
<body>
<style>
#math {
	color: blue;
	font-size: 36px;
}
</style>
<?php

// The MathX Chrome Extension
// testlatex.php - tests LaTeX object
// Authored by Timon Safaie
// All rights reserved.

include_once 'latex.php';

// Create the LaTeX Object
$latexTest = new Latex();

// Insert MathX Script here
//$mxscript = 'integral(1,symbol(pi)symbol(right arrow)sup(var(x),2))frac(1,2)+sum(n,infinity)0 - limit(var(n) symbol(right arrow) symbol(infinity))symbol(Alpha)root(43,5+1)bar(var(abx)) - cap product(symbol(Beta), 3.0)';
//$mxscript = 'piecewise(-2,3; subsup(2,0,frac(1,3)), -6) + matrix(-2,3; 4, -6) - binomial(n;k) + pmatrix(0, -2,3; 1, 4, -6) - determinant(1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16;)';
$mxscript = '\\[frac(1,2)\\] + \\(frac(1,2)\\)';
$latexTest->setMathXScript($mxscript);
$latexcode = $latexTest->getLatex($mxscript);

// Print the test results
echo "<div>MathX: ".$latexTest->getMathXScript()."</div><div>LaTeX: ".$latexcode."</div><div id='math'>Math: \\(".$latexcode."\\)</div>";

?>
</body>
</html>