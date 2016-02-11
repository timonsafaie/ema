// The MathX Chrome Extension
// preload.js - collect (new) user data 
// Authored by Timon Safaie
// All rights reserved under Demonstranda, Inc.

// Predefine Functions to be used in contentscript as well
function isGoogleDocs(siteURL) {
	var isDocs = false;
	// Length calculations based on https
	if (siteURL.length >= 35) {
		var domain = siteURL.substr(8,15);
		if (domain == 'docs.google.com') {
			var patt = siteURL.substr(23);
			var res = patt.match(/\/document\/d\//gi);
			if(res) {
				isDocs = true;
			}
		}
	}
	return isDocs;
}

// Return User Name From Google Docs
function getUserName() {
	return $('.gb_ua').eq(0).html();
}
// Return User Email from Google Docs
function getUserEmail() {
	return $('.gb_va').eq(0).html();
}

// Check if you're in Google Docs first...
var currsite = window.location.href;
var sessionid = -1;
var userid = -1;
if (isGoogleDocs(currsite)) {
	var username = getUserName();
	var useremail = getUserEmail();
	
	// Send to DB
	$.ajax({
		type: "POST",
		url: "https://mathx.co/chrome/process/user.php",
		data: { 
			    username  : username,
				useremail : useremail
			  },
		success: function(data) {
				var datapair = data.split(",");
				userid = datapair[0];
				sessionid = datapair[1];
			  } 
	  });
}