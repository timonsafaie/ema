// The MathX Chrome Extension
// mxlscript.js - extracts MXL from the typed math
// Authored by Timon Safaie
// All rights reserved under Demonstranda, Inc.


// Returns the value of the given span
function getSymbol(element) {
	// For numbers and regular symbols
	var val = $(element).html();
	// If it's an alphabetic char
	if ($(element).attr('data-srch')) {
		val = 'var('+$(element).attr('data-srch')+')';
		// Might have a rendername like inequalities
		if($(element).attr('rendername')) {
			var rel = $(element).attr('rendername');
			if (rel == ">=") {
				rel = "greater than or equal to";
			} else if(rel == "<=") {
				rel = "less than or equal to";
			}
			// If it's an auto completed symbol
			val = 'symbol('+rel+')';
		}
	} else if($(element).attr('rendername')) {
		// If it's an auto completed symbol
		val = 'symbol('+$(element).attr('rendername')+')';
	}
	// Add escape char if necessary
	return escapeSymbol(val);
}

// Adds an escape character to the 
// symbol when it has meaning in MXL
function escapeSymbol(symbol) {
	// Parens, commas, semicommas
	// are part of functions and matrices
	var arr = ["(", ")", "}", "{", ",", ";"];
	if ($.inArray(symbol, arr) > -1) 
		symbol = '\\'+symbol;
	// Give the symbol a space at the
	// end because it's all text
	return symbol;
}

// Create the MathX Script from what was typed
function getMathX(mathXContainer) {
	var spans = $(mathXContainer).children();
    if ($(spans[spans.length-1]).attr("id") == "aC-container") {
        spans.splice(spans.length-1, 1);
    }
    return getMathXHelper(spans);
}
function getMathXHelper(spans) {
    var mathxscript = "";
	var spanslength = spans.length;
	var uservar = ""; // To recognize user variables
	for (var i= 0; i<spanslength;i++) {
		var span = spans[i];
		// Check for baseless subs/sups
		
		// Baseless Superscript
		if ($(span).hasClass('exp-holder')) {
			// Process base and sup
			//mathxscript += 'sup( , '+getMathX(span)+')';
			mathxscript += 'sup('+getMathX(span)+')';
		}
		// Baseless Subscript
		else if ($(span).hasClass('und-holder')) {
			// Process base and sub
			//mathxscript += 'sub( , '+getMathX(span)+')';
			mathxscript += 'sub('+getMathX(span)+')';
		} // Division
		else if ($(span).hasClass('division')) {
			// Process numerator and denominator
			var division = $(span).children();
			var numerator = division[0];
			var denominator = division[1];
			mathxscript += 'frac('+getMathX(numerator)+', '+getMathX(denominator)+')';
		} // Functions
		else if ($(span).hasClass('func-holder')) {
			var func = $(span).children()[0];  // Grab the function package
			var funcval = $(func).attr('func');
			var funcargs = $(func).children();
			var funcargslength = funcargs.length;
			var argcount = 0;
			var args = "";
			var matrixarr = ["pmatrix", "matrix", "determinant", "piecewise", "binomial"];
			  // Inside Matrix Structure
			if ($.inArray(funcval, matrixarr) > -1) {
				var matcontents = funcargs[1];
				var matcols = $(matcontents).children();
				for (var k=0; k < matcols.length; k++) {
					var matargs = $(matcols[k]).children();
					for (var l = 0; l < matargs.length; l++) {
						if ($(matargs[l]).hasClass('func-box')) {
							if (argcount > 0) 
								args += ", ";
							args += getMathX(matargs[l]).trim();
							argcount++;
						}
					}
					argcount = 0;
					if (k < matcols.length-1)
						// Remove the extra comma and 
						// add the semicolon
						args = args.trim()+'; ';
				}
			} else {
			  // Normal functions
			  for (var j=0; j< funcargslength; j++) {
				if ($(funcargs[j]).hasClass('func-box')) {
					if (argcount > 0) {
						args += ", ";
					}
					args += getMathX(funcargs[j]);
					argcount++;
				}
			  }
			}
			mathxscript += funcval+"("+args+")";
		} else if ($(span).hasClass('brack-holder')) { // Delimiters/Enclosures
            var delims = $(span).children();
            var olim = $(delims[0]).html();
            var clim = $(delims[delims.length-1]).html();
            delims.splice(delims.length-1, 1);
            delims.splice(0, 1);
            mathxscript += "\\"+olim+getMathXHelper(delims)+"\\"+clim;
        } else if (($(span).html() == "<br>") || 
                   ($(span).attr("id")=="aC-container")) { // IE inserts <br>
            continue;
        } else {  // User defined variables, greeks, or symbols
			var val = getSymbol(span);
			/*
			if (i+1 < spanslength) {
				// Begin Logic of checking various
				// family types.
				
				// Superscript
				if ($(spans[i+1]).hasClass('exp-holder')) {
					var baseval = val
					var subval = "";
					var supval = getMathX(spans[++i]);
					var funcval = "sup";
					// Loop again to see if it's a subsup.
					if (i+1 < spanslength) {
						if ($(spans[i+1]).hasClass('und-holder')) {
							// We are in a subsup situation
							subval = getMathX(spans[++i])+', ';
							funcval = "subsup";
						}
					}
					val = funcval+"("+baseval+", "+subval+supval+")";
				} 
				// Subscript
				else if ($(spans[i+1]).hasClass('und-holder')) {
					var baseval = val
					var subval = getMathX(spans[++i]);
					var supval = "";
					var funcval = "sub";
					// Loop again to see if it's a subsup.
					if (i+1 < spanslength) {
						if ($(spans[i+1]).hasClass('exp-holder')) {
							// We are in a subsup situation
							supval = ', '+getMathX(spans[++i]);
							funcval += "sup";
						}
					}
					val = funcval+"("+baseval+", "+subval+supval+")";
				}
			}*/
			mathxscript += val;
		}
	}
	return mathxscript; 
}