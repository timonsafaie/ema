// Global Static Variable Declarations

// Hast table for keeping sets
// of variables across multiple
// instances of MathX
var mxVarMap = new Object();
var space = '\u200B';
var aCc = "aC-container"; //ac-container
var aCr = "aC-results"; //ac-results
var msMath = "ms_math";   // ???
var mXc = "mX-container"; //math-container
var mX = "mX"; //mathscript
var mXcl = "mX-close"; //close-btn

// build various arrays for reference later
var bracketsClosed = new Array(")","]","}",">","|",'||');
var bracketsOpen = new Array("(","[","{","<","|");
var operatorsAry = new Array("+","-","*","=","≤","≥","≠");
var otherExc = new Array(",");
var orangeFunc = new Array('hat','bar','sqrt','root','vector');
var romanize = new Array('sin','cos','tan','sec','csc','cot','sinh','cosh','tanh','sech','csch','coth','log','ln','mod','gcd','lcm','min','max','inf','sup','det','Tr','tr','arcsin', 'arccos', 'arctan', 'arcsec', 'arccsc', 'arccot', 'arcsinh', 'arccosh', 'arctanh', 'arcsech', 'arccsch', 'arccoth');
var openBracket = new Array();
var autoComplete = new Array(
	['alpha','&#x1d6fc;'],
	['beta','&#x1d6fd;'],
	['gamma','&#x1d6fe;'],
	['delta','&#x1d6ff;'],
	['epsilon','&#x1d700;'],
	['zeta','&#x1d701;'],
	['eta','&#x1d702;'],
	['theta','&#x1d703;'],
	['iota','&#x1d704;'],
	['kappa','&#x1d705;'],
	['lambda','&#x1d706;'],
	['mu','&#x1d707;'],
	['nu','&#x1d708;'],
	['xi','&#x1d709;'],
	['omicron','&#x1d70a;'],
	['pi','&#x1d70b;'],
	['rho','&#x1d70c;'],
	['sigma','&#x1d70e;'],
	['tau','&#x1d70f;'],
	['upsilon','&#x1d710;'],
	['phi','&#x1d711;'],
	['chi','&#x1d712;'],
	['psi','&#x1d713;'],
	['omega','&#x1d714;'],
	['Alpha','&#x391;'],
	['Beta','&#x392;'],
	['Gamma','&#x393;'],
	['Delta','&#x394;'],
	['Epsilon','&#x395;'],
	['Zeta','&#x396;'],
	['Eta','&#x397;'],
	['Theta','&#x398;'],
	['Iota','&#x399;'],
	['Kappa','&#x39a;'],
	['Lambda','&#x39b;'],
	['Mu','&#x39c;'],
	['Nu','&#x39d;'],
	['Xi','&#x39e;'],
	['Omicron','&#x39f;'],
	['Pi','&#x3a0;'],
	['Rho','&#x3a1;'],
	['Sigma','&#x3a3;'],
	['Tau','&#x3a4;'],
	['Upsilon','&#x3a5;'],
	['Phi','&#x3a6;'],
	['Chi','&#x3a7;'],
	['Psi','&#x3a8;'],
	['Omega','&#x3a9;'],

	['del','&part;'],
	['partial','&part;'],
	['infinity','&infin;'],
	['infty','&infin;'],
	['grad','&nabla;'],

	['only if','&Longrightarrow;'],
	['and','&and;'],
	['or','&#8744;'],
	['if','&Longleftarrow;'],
	['iff','&Longleftrightarrow;'],

	['root','db'],
	['lim','db'],
	['sqrt','db']
)

/* build matrix array */
var dbmat = [
  {symbolname:"matrix (parentheses)",
    symbol_rep:"<span class='ac-render ac-matrix' data-render='( )'><span class='ac-symbol'>(</span><span class='ac-argwrapper'><span class='ac-inp ac-top'></span><span class='ac-inp ac-bot'></span></span><span class='ac-argwrapper'><span class='ac-inp ac-top'></span><span class='ac-inp ac-bot'></span></span> <span class='ac-symbol'>)</span>",
    rendername: "pmatrix",},
  {symbolname:"matrix (bracket)",
    symbol_rep:"<span class='ac-render ac-matrix' data-render='[ ]'><span class='ac-symbol'>[</span><span class='ac-argwrapper'><span class='ac-inp ac-top'></span><span class='ac-inp ac-bot'></span></span><span class='ac-argwrapper'><span class='ac-inp ac-top'></span><span class='ac-inp ac-bot'></span></span> <span class='ac-symbol'>]</span>",
    rendername: "matrix (bracket)"},
  {symbolname:"determinant",
    symbol_rep:"<span class='ac-render ac-matrix' data-render='| |'><span class='ac-symbol'>|</span><span class='ac-argwrapper'><span class='ac-inp ac-top'></span><span class='ac-inp ac-bot'></span></span><span class='ac-argwrapper'><span class='ac-inp ac-top'></span><span class='ac-inp ac-bot'></span></span> <span class='ac-symbol'>|</span>",
    rendername: "determinant"},
  {symbolname:"piecewise function",
    symbol_rep:"<span class='ac-render ac-matrix' data-render='{'><span class='ac-symbol'>{</span><span class='ac-argwrapper'><span class='ac-inp ac-top'></span><span class='ac-inp ac-bot'></span></span></span>",
    rendername:"piecewise"},
  {symbolname:"binomial",
    symbol_rep:"<span class='ac-render ac-matrix' data-render='( )'><span class='ac-symbol'>(</span><span class='ac-argwrapper'><span class='ac-inp ac-top'></span><span class='ac-inp ac-bot'></span></span> <span class='ac-symbol'>)</span></span>",
    rendername:"binomial"}
];

/* build pipes array */
var dbpipe = [
  {symbolname:"pipe",
    symbol_rep:"|",
    arguments_table:"",
    rendername: "pipe"},
  {symbolname:"pipe exp",
    symbol_rep:"|&#9633;|",
    arguments_table:"<span class='brack-holder'><span class='mX fontnorm brack' contenteditable='true' data-type='openbrack' style='padding: 0px 0px 0px 0.05em;'>|</span><span class='mX' contenteditable='true' id='mX'></span><span class='mX fontnorm brack' contenteditable='true' data-type='closebrack' style='padding: 0px 0px 0px 0.05em;'>|</span></span>",
    rendername: "pipebox"}
];

var dbpipes = [
  {symbolname:"double pipe",
    symbol_rep:"||",
    arguments_table:"",
    rendername: "double pipe"},
  {symbolname:"double pipe exp",
    symbol_rep:"&#8741;&#9633;&#8741;",
    arguments_table:"<span class='brack-holder'><span class='mX fontnorm brack' contenteditable='true' data-type='openbrack' style='padding: 0px 0px 0px 0.05em;'>&#8214;</span><span class='mX' contenteditable='true' id='mX'></span><span class='mX fontnorm brack' contenteditable='true' data-type='closebrack' style='padding: 0px 0px 0px 0.05em;'>&#8214;</span></span>",
    rendername: "double pipebox"}
];

var arrowArray = [];
arrowArray = [['&nwarr;','&nwArr;','Northwest Arrow','Northwest Double Arrow'],['&uarr;','&uArr;','Up Arrow','Up Double Arrow'],['&nearr;','&neArr;','Northeast Arrow','Northeast Double Arrow'],
  ['&larr;','&lArr;','Left Arrow','Left Double Arrow'],['&harr;','&hArr;','Left Right Arrow','Left Right Double Arrow'],['&rarr;','&rArr;','Right Arrow','Right Double Arrow'],
  ['&swarr;','&swArr;','Southwest Arrow','Southwest Double Arrow'],['&darr;','&dArr;','Down Arrow','Down Double Arrow'],['&searr;','&seArr;','Southeast Arrow','Southeast Double Arrow']];

var singleArrowArray = [['&larr;','left arrow'],
	['&harr;','left right arrow'],
	['&rarr;','right arrow'],
	['&map;','map'],
	['&hookrightarrow;','inclusion map'],
	['&leftharpoonup;','left up harpoon'],
	['&leftharpoondown;','left down harpoon'],
	['&rightharpoonup;','right up harpoon'],
	['&rightharpoondown;','right down harpoon'],
	['&leftrightharpoons;','left right harpoons'],
	['&rightleftharpoons;','right left harpoons'],
	['&longleftarrow;','left long arrow'],
	['&longleftrightarrow;','left right long arrow'],
	['&longrightarrow;','right long arrow'],
	['&longmapsto;','long map'],
	['&nwarr;','northwest arrow'],
	['&nearr;','northeast arrow'],
	['&searr;','southeast arrow'],
	['&swarr;','southwest arrow'],
	['&uarr;','up arrow'],
	['&darr;','down arrow']];

var doubleArrowArray = [
	['&lArr;','left double arrow'],
	['&hArr;','left right double arrow'],
	['&rArr;','right double arrow'],
	['&uArr;','up double arrow'],
	['&dArr;','down double arrow'],
	['&Longleftarrow;','long left double arrow'],
	['&Longleftrightarrow;','long left right double arrow'],
	['&Longrightarrow;','long right double arrow'],
	['&nwArr;','northwest double arrow'],
	['&neArr;','northeast double arrow'],
	['&seArr;','southeast double arrow'],
	['&swArr;','southwest double arrow']];


// Contains a set of variables per MathX instant
function mXVars(id, $mX, $mXparent, $mX_elem) {
  this.id = id;
  this.$mX = $mX;
  this.$mXparent = $mXparent;
  this.$mX_elem = $mX_elem;
}