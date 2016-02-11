// EMA for Google Chrome
// status.js - turn EMA on or off
// Authored by Timon Safaie
// All rights reserved under Demonstranda, Inc.

// Turn on/off
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (!$.contains(document.body, document.getElementById('mathx-chrome-box'))) {
            sendResponse({confirmation: "init"});
        } else if (request.state == "on") {
            sendResponse({confirmation: "switch on"});
            $('#mathx-chrome-box-minimized').css('display','none');
            $('#mathx-chrome-box').css('display', 'block');
            $('#mathx-chrome-history').css('display', 'block');
            $('#mathx-chrome-history').removeClass('mathx-chrome-history-minimized');
            $('#mathx-chrome-history-images-container').css('display','block');
            $('#mathx-chrome-history-header-label').css('font-size', '16px');
            $('#mathx-chrome-history-minimize').html('_').attr('title','Minimize');
            var mil = minImages.length;
            if (mil > 0) {
                for (var i = 0; i < mil; i++) {
                    var mid = minImages.pop();
                    var midwidth = $("#"+mid).width();
                    $('#'+mid+'-container').css('width', midwidth+'px');
                }
            }
            console.log('EMA ON');
        } else {
            $('#mathx-chrome-box').css('display', 'none');
            $('#mathx-chrome-history').css('display', 'none');
            $('#mathx-chrome-box-minimized').css('display','none');
            console.log('EMA OFF');
        }
});