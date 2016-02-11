<?php

// The MathX Chrome Extension
// latex.php - converts MathX Script into LaTeX
// Authored by Timon Safaie
// All rights reserved.

error_reporting(0);
require_once 'linkedlist.php';
include '../includes/dbconn.php';

// The LaTeX class
// Interprets MathX Script
// into LaTeX code.
class Latex {
  private $latex;  	    // LaTeX Code
  private $mathXScript; // Incoming MathX Script
  private $hotKeys;     // MathX Symbol Hot Keys

  // Empty Argument Constructor
  function __construct() {
	 $this->latex = "";
	 $this->mathXScript = "";
     $this->hotKeys = [
         "less than or equal to"    => "\\leq",
         "greater than or equal to" => "\\geq"
     ];
  }

  // A method for inputing MathX Script
  public function setMathXScript($text) {
	  $this->mathXScript = $text;
  }
  
  // Inject the MathX Script to the Latex obj
  public function getMathXScript() {
	  return $this->mathXScript;
  }
  
  // Main LaTeX generator
  public function getLatex($mxs) {
	  //$mxs = $this->getMathXScript();
	  $latex = "";
	  $mxslen = strlen($mxs);
	  $enclosurecount = 0;
	  $openenclosure = array("(","{","[");
	  $closeenclosure = array(")","}","]");
	  $foundopenenclosure = false;
	  for($i = 0; $i < $mxslen; $i++) {
		  // Go character by character...
		  // The logic naturally eats 
		  // leading whitespaces.
		  
		  // Define a single unit of latex
		  $element = "";
		  
		  
		  // Process Numbers
		  if (is_numeric($mxs[$i]) || ($mxs[$i] == '.') || ($mxs[$i] == '0')) {
			  // Extract the number
			  $number = $this->getNumber(substr($mxs, $i));
			  // Assign as element
			  $element = $number;
			  // Advance pointer
			  $i += strlen($number)-1;
		  }
		  
		  
		  // Process Alphas
		  elseif (ctype_alpha($mxs[$i])) {
			  // First of all, get the word.
			  $element = $this->getAlpha(substr($mxs, $i));
			  $i += strlen($element);
			  // Get Arguments
			  $argset = $this->getArgs(substr($mxs, $i));
			  if (empty($argset)) {
				  $i--;
			  } else {
				  $i += strlen($argset) - 1;
			  }
			  // Alpha is a Variable
			  if ($element == "var") {
				  $element = substr($argset, 1, strlen($argset) - 2);
			  } elseif ($element == "symbol") {
			  	  // Alpha is a Symbol
			  	  $element = substr($argset, 1, strlen($argset) - 2);
			  	  $symbol = $this->getDBSymbol($element, "");
				  if (!empty($symbol)) {
					  $element = $symbol;
				  } elseif ($this->hotKeys[$element]) {
                      // Alpha is a Hot Key
                      // get code from hot key array
                      $element = $this->hotKeys[$element];
                  }
			  } else {
			  	  // Alpha is a function
			  	  $symbol = $this->getDBSymbol($element, $argset);
				  if (!empty($symbol)) {
					  $element = $symbol;
				  }
			  }
		  }
		  
		  // Symbols 
		  else {
			  if ($mxs[$i] == "\\") {
				  if (in_array($mxs[$i+1], $openenclosure)) {
					  $completeenclosure = $this->getEnclosure(substr($mxs, $i));
					  if (!empty($completeenclosure)) {
						  $i += strlen($completeenclosure) - 1;
						  $left = "\\left";
						  $right = "\\right";
						  if ($completeenclosure[1] == "{") 
						  	$left = $left."\\";
						  if ($completeenclosure[strlen($completeenclosure)-1] == "}")
						  	$right = $right."\\";
						  $element = $left.$completeenclosure[1]." ".$this->getLatex(substr($completeenclosure, 2, strlen($completeenclosure) - 4))." ".$right.$completeenclosure[strlen($completeenclosure)-1];
					  }
				  } else {
					  // Add the symbol as is
					  // Escape only braces
					  if (($mxs[$i+1] == "{") || ($mxs[$i+1] == "}")) {
						  $element = $mxs[$i];
					  }
					  $element .= $mxs[++$i];
				  }
			  } else {
		  	  	// Regular Symbol
				$element = $this->escapeCharacter($mxs[$i]);
			  }
		  }
		  
		  // Once an element is retrieved
		  // and converted to latex code
		  // add it to the latex expression.
		  $latex .= $element." ";
	  }
	  // Fixes issues with prime
	  $latex = str_replace(" '","'",$latex);
	  
	  return trim($latex);
  }
  
  // Private Functions
  // The following functions help support 
  // the main LaTeX function: getLatex()
  
  // Returns the entire number sitting
  // at the head of the given text.
  private function getNumber($text) {
	  $i = 0;
	  $eos = strlen($text);
	  $foundDot = false;
	  $done = false;
	  $number = "";
	  while (!$done && ($i < $eos)) {
	  	// Build the number
		if (is_numeric($text[$i])) {
			// Append numeric to the number
			$number .= $text[$i];
		} elseif ( ($text[$i] == '.') && (!$foundDot) ) {
			// Append the dot
			$number .= $text[$i];
			$foundDot = !$foundDot;
		} else {
			// We're done, this is something else.
			$done = !$done;
		}
		// Advance pointer
		$i++;
	  }
	  return $number;
  }
  
  // Get consecutive alphas at the head of  
  // the text blob.  
  private function getAlpha($text) {
	  $len = strlen($text);
	  $i = 0;
	  $alpha = "";
	  while ($i < $len) {
		  $char = $text[$i];
		  if (ctype_alpha($char) || ($char == " ")) {
			  $alpha .= $char;
		  } else {
			  // Break out of the loop
			  // we're done.
			  $i = $len + 1;
		  }
		  // Advance the pointer.
		  $i++;
	  }
	  return $alpha;
  }
 
  // These special characters need 
  // to be escaped for latex.
  private function escapeCharacter($char) {
	  // LaTeX reserved characters
	  $specialChars = array("#","$","%","/","&","~","_","^","\\","{","}");
	  $escaped = $char;
	  if (in_array($char, $specialChars)) {
		  $escaped = "\\".$char;
	  }
	  return $escaped;
  }
  
  // Gets everything between the parenthesis
  private function getArgs($text) {
	  $result = "";
	  $i = 0;
	  if ($text[i] == "(") {
		  $result .= $text[$i++];
		  $parencount = 1;  // For already opened paren
		  $textlen = strlen($text);
		  while(($parencount > 0) && ($i < $textlen)) {
	  	  	  if ( $text[$i] === ")" ) {
	  		  	  $parencount--;
	  		  } elseif($text[$i] == "(") {
				  $parencount++;
		  	  } elseif($text[$i] == "\\") {
				  $result .= $text[$i++];
			  }
			  $result .= $text[$i];
			  // Move to the next character
			  $i++;
		  }
	  }
	  return $result;
  }
  
  // Check to see if the word is a reserved word.
  private function getDBSymbol($symbolname, $args) {
	  $sql = "SELECT symbolname, symbolfamily, latexcode FROM symbol WHERE symbolname='".strtolower($symbolname)."'";
	  //$retval = mysqli_query($dbconn, $sql);
	  $retval = mysql_query($sql);
	  $result = "";
	  $name = "";
	  $family = "";
	  $found = false;
	  
	  // Get the Latex of the function name
	  // First, check if it's a division
	  if ($symbolname == "frac") {
		  // It's a division
		  $result = "\\".$symbolname;
	  } else { // It's anything but a division
		// Check for case sensitivity
		while ($row = mysql_fetch_assoc($retval)) {
		  $name = $row['symbolname'];
		  $family = $row['symbolfamily'];
		  if (str_word_count($name) > 1) {  // More than one word in symbol name
			  $result = $row['latexcode'];
		  } elseif ($name[0] === $symbolname[0]) { // Same case
			  $result = $row['latexcode'];
		  }
		  if (!empty($result) && ($family == 'symbol') && empty($args)) {
			  break;
		  }
		}
        // Check Alternate names for symbol
        if (empty($name)) {
            $sql = "SELECT * FROM symbol WHERE alternatename != ''";
            $retval = mysql_query($sql);
            while ($row = mysql_fetch_assoc($retval)) {
                $an = $row['alternatename'];
                $anames = explode(', ', $an);
                for ($i=0; $i < count($anames); $i++) {
                    if (strtolower($symbolname) == strtolower($anames[$i])) {
                        $name = $row['symbolname'];
                        $family = $row['symbolfamily'];
                        $result = $row['latexcode'];
                    }
                }
            }
        }
  	  }
	  // Check for args 
	  if (!empty($args)) {
		// Break up args
		$argset = trim(substr($args, 1, strlen($args) - 2));
		$argslist = new LinkList();
		$matrixlist = array("pmatrix", "matrix", "determinant", "piecewise", "binomial");
		$matrixlatexlist = array("pmatrix","bmatrix","vmatrix","array","array");
		if (in_array($symbolname, $matrixlist)) {
			// Get Rows and Columns
			$matrixindex = array_search($symbolname, $matrixlist);
			$matrixtype = $matrixlist[$matrixindex];
			$alignment = ""; // Should be [r]
			$asterik = "*";
			$before = "";
			$after = "";
			if ($matrixtype == "binomial") {
				$arg = "";
				$parencount = 0;
				for ($j = 0; $j < strlen($argset); $j++) {
					if ($argset[$j] == "(") {
						$parencount++;
						$arg .= $argset[$j];
					} elseif ($argset[$j] == ")") {
						$parencount--;
						$arg .= $argset[$j];
					} elseif ($argset[$j] == ";") {
						if ($parencount == 0) {
							$result .= $this->getLatex($arg);
							$arg = "";
							if ($j < strlen($argset)) {
								$result .= " \\choose ";
							}
						} else {
							$arg .= $argset[$j];
						}
					} elseif ($argset[$j] == "\\") {
						$arg .= $argset[$j].$argset[++$j];
					} else {
						$arg .= $argset[$j];
					}
				}
				if (!empty($arg)) {
					$result .= $this->getLatex($arg);
				}
				$result = "{".$result."}";
			} else {
				if ($matrixtype == "piecewise") {
					$asterik = "";
					$alignment = "{l l}";
					$before = "\\left\\{";
					$after = "\\right.";
				}
				$arg = "";
				$parencount = 0;
				// Handle Rows and Columns
				for ($j = 0; $j < strlen($argset); $j++) {
					if ($argset[$j] == "(") {
						$parencount++;
						$arg .= $argset[$j];
				    } elseif($argset[$j] == ")") {
						$parencount--;
						$arg .= $argset[$j];
					}elseif ($argset[$j] == ",") {
						if ($parencount == 0) {
						  $result .= $this->getLatex($arg);
						  $arg = "";
						  if ($j+1 < strlen($argset)) {
							  $result .= " & ";
						  }
						} else {
							$arg .= $argset[$j];
						}
					} elseif ($argset[$j] == ";") {
						if ($parencount == 0) {
						  $result .= $this->getLatex($arg);
						  $arg = "";
						  if ($j+1 < strlen($argset)) {
							  $result .= " \\\\ ";
						  }
						} else {
							$arg .= $argset[$j];
						}
					} elseif ($argset[$j] == "\\") {
						$arg .= $argset[$j].$argset[++$j];
					} else {
						$arg .= $argset[$j];
					}
				}
				if (!empty($arg)) {
					$result .= $this->getLatex($arg);
				}
				$result = $before." \\begin{".$matrixlatexlist[$matrixindex]."}".$alignment." ".$result." \\end{".$matrixlatexlist[$matrixindex]."} ".$after;
			}
		} else { // Regular Function args
			// Split them up based on comma
			$parencount = 0;
			$arg = "";
			for ($j = 0; $j < strlen($argset); $j++) {
				if (($argset[$j] == ",") && ($parencount == 0)) {
					// Replace this with actual 
					// latex construction
					$argslist->insertLast($arg);
					// Reset Arg
					$arg = "";
				} elseif ($argset[$j] == "\\") {
					// Advance if next is a comma
					if ($argset[$j+1] == ",") {
						$arg .= $argset[$j++];
					}
					$arg .= $argset[$j];
				} else {  // Add the character to the arg
					if ($argset[$j] == ")") {
						$parencount++;
					} elseif ($argset[$j] == "(") {
						$parencount--;
					} 
					$arg .= $argset[$j];
				}
			}
			if (!empty($arg)) {
				// Also replace here with latex
				$argslist->insertLast($arg);
			} elseif ($arg == "0") {
				$argslist->insertLast("0");
			}
			// Build the latex with the correct arg formatting
			// Go throught he family types.  Division is checked
			// first since it's not listed under the db family field
			// neither is the sub, sup, over, under types
			if ($symbolname == 'frac') {
				$result .= '{'.$this->getLatex($argslist->readNode(1)).'}';
				$result .= '{'.$this->getLatex($argslist->readNode(2)).'}';
			} elseif(($symbolname == 'sub') || ($symbolname == 'under')) {
				//$result .= '{'.$this->getLatex($argslist->readNode(1)).'}';
				//$result .= '_{'.$this->getLatex($argslist->readNode(2)).'}';
				$result .= '_{'.$this->getLatex($argslist->readNode(1)).'}';
			} elseif(($symbolname == 'sup') || ($symbolname == 'over')) {
				//$result .= '{'.$this->getLatex($argslist->readNode(1)).'}';
				//$result .= '^{'.$this->getLatex($argslist->readNode(2)).'}';
				$result .= '^{'.$this->getLatex($argslist->readNode(1)).'}';
			} elseif(($symbolname == 'subsup') || ($symbolname == 'underover')) {
				//$result .= '{'.$this->getLatex($argslist->readNode(1)).'}';
				//$result .= '_{'.$this->getLatex($argslist->readNode(2)).'}';
				//$result .= '^{'.$this->getLatex($argslist->readNode(3)).'}';
				$result .= '_{'.$this->getLatex($argslist->readNode(1)).'}';
				$result .= '^{'.$this->getLatex($argslist->readNode(2)).'}';
			} else { // Rest of the Families
				switch($family) {
					case 'overreverse': 
						$result .= '{'.$this->getLatex($argslist->readNode(1)).'}';
						break;
					case 'root':
						$k = 1;
						// Root
						if ($argslist->totalNodes() == 2) {
							$result .= '['.$this->getLatex($argslist->readNode($k)).']';
							$k++;
						} // If not, Sqrt
						$result .= '{'.$this->getLatex($argslist->readNode($k)).'}';
						break;
					case 'underover': 
						$result .= '_{'.$this->getLatex($argslist->readNode(1)).'}';
						$result .= '^{'.$this->getLatex($argslist->readNode(2)).'}';
						break;
					case 'subsup': 
						$result .= '_{'.$this->getLatex($argslist->readNode(1)).'}';
						$result .= '^{'.$this->getLatex($argslist->readNode(2)).'}';
						break;
					case 'sub' || 'under': 
						$result .= '_{'.$this->getLatex($argslist->readNode(1)).'}';
						break;
					case 'sup' || 'over': 
						$result .= '^{'.$this->getLatex($argslist->readNode(1)).'}';
						break;
				}
			}
		}
	  }
	  return $result;
  }
  
  private function getEnclosure($text) {
	  $result = "";
	  $enclosurecount = 0;
	  $openenclosure = array("(","{","[");
	  $closeenclosure = array(")","}","]");
	  $foundenclosure = false;
	  // Check for open enclosure, don't forget
	  // the first character is a back slash
	  if (in_array($text[1], $openenclosure)) {
		$enclosurecount++;
		$i = 2;
	  	while ((!$foundenclosure) && ($i < strlen($text)) ) {
			// Look for matching close enclosure
			if ($text[$i] == "\\") {
				// Close Enclosure
				if (in_array($text[$i+1], $closeenclosure)) {
					if (--$enclosurecount == 0) {
						$foundenclosure = true;
						$result .= $text[$i++];
					}
				} elseif (in_array($text[$i+1], $openenclosure)) {
				// Open Enclosure
					++$enclosurecount;
					$result .= $text[$i++];
					
				} else {
					$result .= $text[$i++];
				}
			} 
			$result .= $text[$i++];
		}
		if (!$foundenclosure) {
			$result = "";
		} else {
			$result = substr($text, 0, 2).$result;
		}
	  } 
	  return $result;
  }
  
  // Closes our DB connection when done
  public function closeDBConnection() {
	  mysql_close($dbconn);
  }

}
// End of LaTeX class
?>