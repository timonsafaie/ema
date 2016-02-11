// The MathX Chrome Extension
// load.js - runs loading icon while ext. loads
// Authored by Timon Safaie
// All rights reserved under Demonstranda, Inc.

// Main Loading Section
if (!document.getElementsByClassName('mathx-loading')[0]) {
	var mxLoad = $('<div class="mathx-loading" data-load="reload"></div>');
	$('body').prepend(mxLoad);
	$(mxLoad).css('background', 'rgba( 255, 255, 255, 0.9 ) '+'url("'+chrome.extension.getURL('images/utility/load/loading.gif')+'") 50% 50% no-repeat');
}
