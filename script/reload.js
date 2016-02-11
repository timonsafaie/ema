// The MathX Chrome Extension
// reload.js - checks to see if page needs to be reloaded
// Authored by Timon Safaie
// All rights reserved under Demonstranda, Inc.

// If Failed to load, alert user to refresh the page
var mxs = "ok";
if (!document.getElementsByClassName('mathx-loading')[0]) {	
	mxs = "reload";
	chrome.runtime.sendMessage({ message: mxs});
	console.log('MathX Extension: '+mxs+' required');
	alert('Thanks for installing MathX!  Upon installs, please reload the page before starting MathX.');
}