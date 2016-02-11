// The MathX Chrome Extension
// Authored by Timon Safaie
// background.js - controls for launching the extension
// All rights reserved under Demonstranda, Inc.

var mxstatus = {ready: true};  // ON/OFF status check

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    var onoff = "on";
    if (mxstatus.ready) {
        chrome.browserAction.setIcon({path: "images/tab/on.png", tabId:tab.id});
    } else {
        chrome.browserAction.setIcon({path: "images/tab/off.png", tabId: tab.id});
        onoff = "off";
    }
    // Checks to see if we need to init, hide, or show.
    // Makes the show and hide calls.
    chrome.tabs.executeScript(tab.id, {file: "script/toggle.js"});
    // Makes the Init call if need be.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {state: onoff}, function(response) {
            console.log(response.confirmation);
            if (response.confirmation == "init") {
                chrome.browserAction.setIcon({path: "images/tab/on.png", tabId:tab.id});
                // Launch Scripts
                chrome.tabs.executeScript(tab.id, {file: "script/contentscript.js"});
                chrome.tabs.executeScript(tab.id, {file: "js/particles/particles.min.js"});
                chrome.tabs.executeScript(tab.id, {file: "js/particles/nodes.js"}); 
            }
        });
    });
    // Toggles state from on to off and vis versa
    mxstatus.ready = !mxstatus.ready;
    
    // Cache user's login session
    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        if (sender.tab) {
            if (request.localstorage) {
                console.log('request: '+request.localstorage+' sender: '+sender.tab.url);
                sendResponse({email: localStorage.getItem(request.localstorage)});
            } else {
                console.log('request: '+request.setemail+' sender: '+sender.tab.url);
                localStorage.setItem('email', request.setemail);
            }
        }
    });
  
});
