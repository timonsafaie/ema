// The MathX Chrome Extension
// contentscript.js - inserts the MathX Tool
// Authored by Timon Safaie
// All rights reserved under Demonstranda, Inc.


// Initializes MathX tools
function init() {
        // Call upon helper functions

        // Load Fonts
        loadFonts();
    
        // MathX Box
        $('body').prepend('<div id="mathx-chrome-box" class="mathx-chrome-box-shadow" data-step="1" data-intro="<p>You\'ll start here.</p><p>You can type your equations on the line.  Here\'s the equation for the volume of a sphere.</p><p>When you\'re ready, type <code>ENTER</code></p>" data-count="0"></div>');
    
        setUpTextbox();
        loadMathX('.mathx-chrome-textbox');
    
        // History Box
        $('body').prepend('<div id="mathx-chrome-history" class="mathx-chrome-box-shadow" data-step="2" data-intro="<p>Your equation is saved here.</p><p>You can change the size of the font by changing the number by the size label.</p><p>When done, drag and drop the equation into your document.</p><p class=mathx-chrome-center-paragraph>Enjoy.</p>"></div>');

        // Apply Draggability to MathX box
        $('#mathx-chrome-box').draggable({
            containment: [0, 0, ( $('body').width() - 300 ), $('body').height()],//'parent',
            cursor: 'pointer',
            drag: function(){
                var offset = $(this).offset();
                var xPos = offset.left + (offset.left/$('body').width());
                var yPos = offset.top + + (offset.top/$('body').height());
                $('#mathx-chrome-box-x-coord-value').text(xPos.toFixed(3));
                $('#mathx-chrome-box-y-coord-value').text(yPos.toFixed(3));
                $('#mathx-chrome-box-header').css('opacity','0.6');
                $('#mathx-chrome-box-body').css('opacity', '0.6');
                $('#mathx-chrome-box').css('background-color', 'rgba(245, 245, 245, 0.6)');
                //$('#mathx-chrome-box-coords').css('display','block');
                $('#mathx-chrome-box-coords').fadeIn(200, 'linear');
            },
            stop: function(){
                $('#mathx-chrome-box-header').css('opacity','1');
                $('#mathx-chrome-box-body').css('opacity', '1');
                $('#mathx-chrome-box').css('background-color', 'rgba(245, 245, 245, 1)');
                $('#mathx-chrome-box-coords').fadeOut(200, 'easeOutCirc');
            }
        });
        
        // Start UI
        pages();
}


// Helper Functions

// Load Fonts
function loadFonts() {
    
    // Loads Roboto (from Google Fonts)
     WebFontConfig = {
        google: { families: [ 'Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic:latin'
                            ] }
    };    
    (function() {
      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();
    
    // Load Symbola Font
    var symbola           = document.createElement ("style");
    symbola.type          = "text/css";
    symbola.textContent   = "@font-face { font-family: Symbola; src: url('"
                          + chrome.extension.getURL ("mathx/css/Symbola.otf")
                          + "'); }";
    document.head.appendChild (symbola);

    // Load Arkitech Font
    var arkitech           = document.createElement ("style");
    arkitech.type          = "text/css";
    arkitech.textContent   = "@font-face { font-family: Arkitech; src: url('"
                          + chrome.extension.getURL ("css/fonts/Arkitech/Arkitech Light.ttf")
                          + "'); }";
    document.head.appendChild (arkitech);
    
    var sourcecode           = document.createElement ("style");
    sourcecode.type          = "text/css";
    sourcecode.textContent   = "@font-face { font-family: Source Code Pro Light; src: url('"
                          + chrome.extension.getURL ("css/fonts/SourceCodePro/SourceCodePro-Light.otf")
                          + "'); }";
    document.head.appendChild (sourcecode);
    
}

function loadMathX(box) {
    // Setup the MathX tech
    // Enable MathX	
    $(box).mathX({ 
        placeholderText: '', 
        placeholderIcon: false,
        mathModeOnly: true,
        mathJax: false,
        edition: "Master Edition",
        userGuide: false 
    });
}

// Pages creates the elements in the panel
function pages() {
    // Signin
     var initsn = $('<div id="mathx-chrome-particles-js"></div><div id="mathx-chrome-history-container"><div id="mathx-chrome-history-logo-container"><div id="mathx-chrome-history-logo"><span id="mathx-chrome-history-logo-text">ema</span></div></div></div><div id="mathx-chrome-history-poweredby"><span>Powered by MathX</span></div></div>');
    
    var emailsection = $('<div id="mathx-chrome-email-container"><div id="mathx-chrome-email-subcontainer"><div id="mathx-chrome-email-input-container" class="mathx-chrome-input-container mathx-chrome-input-position-1"><input type="text" id="mathx-chrome-email" class="mathx-chrome-input pulse" placeholder="Enter Your Email" data-position="1" /></div><div class="mathx-chrome-underline  mathx-chrome-underline-stretch-1"><span class="mathx-chrome-endpoint mathx-chrome-endpoint-left"></span><div id="mathx-chrome-email-line" class="mathx-chrome-line"></div><span class="mathx-chrome-endpoint mathx-chrome-endpoint-right"></span></div></div>');
    
    var lastname = $('<div class="mathx-chrome-input-container mathx-chrome-input-position-2"><input type="text" id="mathx-chrome-lastname" class="mathx-chrome-input" placeholder="Enter Your Last Name" data-position="2" /></div><div class="mathx-chrome-underline-stretch mathx-chrome-underline-stretch-2"><div class="mathx-chrome-line mathx-chrome-line-stretch-2"></div><span class="mathx-chrome-endpoint mathx-chrome-endpoint-right"></span></div>');

    var password = $('<div class="mathx-chrome-input-container mathx-chrome-input-position-3"><input type="password" id="mathx-chrome-password" class="mathx-chrome-input" placeholder="Enter a Password" data-position="3" /></div><div class="mathx-chrome-underline-stretch mathx-chrome-underline-stretch-3"><div class="mathx-chrome-line mathx-chrome-line-stretch-3"></div><span class="mathx-chrome-endpoint mathx-chrome-endpoint-right"></span></div>');
    
    var welcome = $('<div id="mathx-chrome-welcome-container"><div id="mathx-chrome-welcome"></div></div>');
    
    // Add the Init page
    $('#mathx-chrome-history').append(initsn);
    $('#mathx-chrome-history').append(emailsection);
    $('#mathx-chrome-email-subcontainer').append(lastname);
    $('#mathx-chrome-email-subcontainer').append(password);
    $('#mathx-chrome-email-container').append(welcome);
    
    // Animations
    $('#mathx-chrome-history-logo').animate({ width: '210px' }, 600, 'linear', function() {
        $('#mathx-chrome-history-logo-text').fadeIn('slow', function() {
            $('#mathx-chrome-history-poweredby').fadeIn('slow', 'easeOutCirc', function() {
                // Determine how to route app (sign up or sign in)
                getUserPrefs('email');
            });
        });
    });
    
    bindToInput('bind');
    initInputHandler();
    
}

function launchEmailInput() {
    var linewidth = 60;
    $('.mathx-chrome-input-position-2, .mathx-chrome-input-position-3, .mathx-chrome-underline-stretch-2, .mathx-chrome-underline-stretch-3').fadeOut('fast');
    $('input').val('');
    $('#mathx-chrome-email-container').css('margin-top', '0px');

    $('#mathx-chrome-email').attr({type:'text',placeHolder:'Enter Your Email'}).val('');
    $('#mathx-chrome-email').fadeIn('slow', function() {
        $('.mathx-chrome-endpoint').fadeIn('slow', function() {
            $('.mathx-chrome-underline').animate({ width: (linewidth+10) + 'px'}, 500, 'easeOutCirc');
            $('.mathx-chrome-line').animate({ width: linewidth + 'px'}, 500, 'easeOutCirc');
        });
    });
    logoBind('unbind');
    bindToInput('bind');
}

// On bind
function bindToInput(status) {
    var linewidth = 60;
    if (status == 'bind') {
        $('#mathx-chrome-email').click(function() {
            $('.mathx-chrome-underline').animate({ width: ((4*linewidth)-10) + 'px'}, 300, 'easeOutCirc');
            $('.mathx-chrome-line').animate({ width: ((4*linewidth)-20) + 'px'}, 300, 'easeOutCirc');
        });
        $('#mathx-chrome-email').blur(function() {
            $('.mathx-chrome-underline').animate({ width: (linewidth+10) + 'px'}, 300, 'easeOutCirc');
            $('.mathx-chrome-line').animate({ width: linewidth + 'px'}, 300, 'easeOutCirc');
        });
        $('#mathx-chrome-email').mouseover(function() {
            if ($('.mathx-chrome-line').width() == linewidth) {
                $('.mathx-chrome-underline').animate({ width: ((2*linewidth)-10) + 'px'}, 300, 'easeOutCirc');
                $('.mathx-chrome-line').animate({ width: ((2*linewidth)-20) + 'px'}, 300, 'easeOutCirc');
            }
        });
        $('#mathx-chrome-email').mouseleave(function() {
            if ($('.mathx-chrome-line').width() == (2*linewidth)-20) {
                $('.mathx-chrome-underline').animate({ width: (linewidth+10) + 'px'}, 300, 'easeOutCirc');
                $('.mathx-chrome-line').animate({ width: linewidth + 'px'}, 300, 'easeOutCirc');
            }
        });
    } else if (status == 'register') {
        $('.mathx-chrome-input').focus(function() {
            var position = $(this).attr('data-position');
            var adjustment = $(this).parent().height();
            var margininc = $('.mathx-chrome-input-container').css('margin-top').split("px");
            var inc = (-1 * (position-1))*(adjustment+parseInt(margininc[0])+10);
            $('#mathx-chrome-email-container').animate({marginTop: inc+'px'}, 200, 'easeOutCirc');
            $(this).parent().parent().find('.mathx-chrome-underline-stretch-'+position).animate({opacity : '0.6'}, 200, 'easeOutCirc');
            
        })
        $('.mathx-chrome-input').blur(function() {
            var position = $(this).attr('data-position');
            $(this).parent().parent().find('.mathx-chrome-underline-stretch-'+position).animate({opacity : '1'}, 200, 'easeOutCirc');
        });
    } else {
        $('#mathx-chrome-email').unbind('click').unbind('blur').unbind('mouseover').unbind('mouseleave');
    }
    
}

// Handles Initial Entry from User
function initInputHandler() {
    $('#mathx-chrome-email').keyup(function(e) {
        // Check to see if user hit Enter
         var code = e.keyCode || e.which;
         var emailval = $('#mathx-chrome-email').val();
         if(code == 13) { //Enter keycode
           //Do something
           if (emailval != "") {
               var ph = $(this).attr('placeholder');
               // Process when an email is entered
               if (ph == "Enter Your Email") {
                   user['email'] = emailval;
                   $.when(getUser(emailval)).done(function(data) {
                       var rdata = JSON.parse(data);
                       setSession(rdata.userid);
                       if (rdata['email'] == emailval && rdata['status'] == 'complete') {
                            emailProcessingAnimation();
                       } else {
                          // Signing up
                          registerProcessingAnimation();
                          registerInputHandler(rdata['userid']);
                       }
                   });
               } else if (ph == 'Enter Your First Name') {
                   $('#mathx-chrome-lastname').focus();
               } else if (ph == 'Enter Your Password') {
                   //$.when(getUser(user.email)).done(function(data) {
                   $.when(authenticateUser( user.email, $('#mathx-chrome-email').val() )).done(function(data) {
                       rdata = JSON.parse(data);
                       if (rdata['password'] == 'verified') {
                           // Logging in a member
                           user['userid']    = rdata.userid;
                           user['firstname'] = rdata.firstname;
                           user['lastname']  = rdata.lastname;
                           // Exit Like Normal
                           var linewidth = 0; 
                           $('#mathx-chrome-email').animate({opacity: '0'}, 'slow');
                           $('.mathx-chrome-underline').animate({ width: (linewidth+10) + 'px'}, 500, 'linear');
                           $('.mathx-chrome-line').animate({ width: linewidth + 'px'}, 500, 'linear', function() {
                               $('#mathx-chrome-email').val('');
                               $('#mathx-chrome-email').attr('placeholder','Enter Your Email');
                               $('#mathx-chrome-email').attr('type', 'text');
                               welcomeFlash(rdata['firstname']);
                               storeUserPrefs('email', user.email);
                           });
                       } else {
                           // Wrong Password
                           $('.mathx-chrome-underline').effect( "shake", {times: 3, distance: 10}, 600 );
                           $('#mathx-chrome-email').val('');
                       }    
                   });
               }
           } else {
               if ($(this).attr('placeholder') == 'Enter Your First Name') {
                   $('#mathx-chrome-lastname').focus();
               }
           }
         }
    });
}

function registerInputHandler(userid) {
    $('#mathx-chrome-lastname').keyup(function(e) {
        var code = e.keyCode || e.which;
         var lnval = $(this).val();
        if(code == 13) { //Enter keycode
           //Do something
           if (lnval != "") {
               $('#mathx-chrome-password').focus();
           } else {
               $('#mathx-chrome-password').focus();
           }
        }
    });
    $('#mathx-chrome-password').keyup(function(e) {
        var code = e.keyCode || e.which;
         var pval = $(this).val();
        if(code == 13) { // Enter keycode
           // See if you can process form
           if (pval == "") {
               $('#mathx-chrome-email').focus();
           } else {
               if (($('#mathx-chrome-lastname').val() == "") || 
                   ($('#mathx-chrome-email').val() == "")) {
                   // Keep Cycling 
                   $('#mathx-chrome-email').focus();
               } else {
                   // Process Form and insert data into the DB
                   $.when(setUser(userid, 
                                  $('#mathx-chrome-email').val(), 
                                  $('#mathx-chrome-lastname').val(), 
                                  $('#mathx-chrome-password').val())
                   ).done(function(data) {
                       user['userid']    = userid;
                       user['firstname'] = $('#mathx-chrome-email').val(); 
                       user['lastname']  = $('#mathx-chrome-lastname').val();
                       user['password']  = $('#mathx-chrome-password').val();
                       // Let's start the action!
                       welcomeFlash(user.firstname);
                       // Cache user on signup
                       storeUserPrefs('email', user.email);
                       // First Official session
                       $('#mathx-chrome-session-data').html(1);
                   });
               }
           }
        }
    });
}

// Performs Intermediary Email Animation
function emailProcessingAnimation() {
    
    // Set Cookie
    var emailval = $('#mathx-chrome-email').val();
    
    // Fade out Input
    
    // if it's a valid email...
    linewidth = 0;
    bindToInput('unbind');
    $('#mathx-chrome-email').fadeOut('slow');
        
    // Shrink Edge to Node
    $('.mathx-chrome-underline').animate({ width: (linewidth+10) + 'px'}, 500, 'linear');
    $('.mathx-chrome-line').animate({ width: linewidth + 'px'}, 500, 'linear', function() {
        $('#mathx-chrome-email').val('');
        $('#mathx-chrome-email').attr('placeholder','Enter Your Password');
        $('#mathx-chrome-email').attr('type', 'password');
    });
    $('#mathx-chrome-email').delay(500).fadeIn('slow', function() {
        linewidth = 220;
        // Shrink Edge to Node
        $('.mathx-chrome-underline').animate({ width: (linewidth+10) + 'px'}, 500, 'linear');
        $('.mathx-chrome-line').animate({ width: linewidth + 'px'}, 500, 'linear');
        bindToInput('bind');
        $(this).focus();
    });
}

// Performs Intermediary Email Animation
function registerProcessingAnimation() {
    // Fade out Input
    linewidth = 270;
    bindToInput('unbind');
    $('#mathx-chrome-email').animate({opacity: '0'}, 'slow', function() {
        $('#mathx-chrome-history-poweredby').fadeOut('fast');
        $('#mathx-chrome-history-container').animate({top: '10%'}, 600, 'linear');
        $('#mathx-chrome-history-logo').animate({width: '170px', height: '26px', fontSize: '20px'}, 600, 'linear');
        $('.mathx-chrome-underline').animate({width: '100%'}, 500, 'linear');
        $('.mathx-chrome-line').animate({ width: linewidth + 'px'}, 500, 'linear');
        $('#mathx-chrome-email').val('');
        $('#mathx-chrome-email').attr('placeholder','Enter Your First Name');
        $('.mathx-chrome-endpoint-left').css('display', 'none');
    }).delay(500).animate({opacity: '1'},'slow', function() {
        bindToInput('register');
        $(this).focus();
        $('.mathx-chrome-input-position-2').slideDown('fast');
        $('.mathx-chrome-underline-stretch-2').slideDown('fast', function() {
            $('.mathx-chrome-input-position-3').slideDown('fast');
            $('.mathx-chrome-underline-stretch-3').slideDown('fast');
        });
        $(this).attr('type','text');
        logoBind('bind');
    });
}

function logoBind(status) {
    if (status == 'bind') {
        $('#mathx-chrome-history-logo').click(function() {
            logoSize('normal');
            launchEmailInput();
            $(this).unbind('click');
        });
    } else {
        $('#mathx-chrome-history-logo').unbind('click');
    }
}
function logoSize(status) {
    // Init small
    var top = '10%';
    var width = '170px';
    var height = '26px';
    var size = '20px';
    if (status=='normal') {
        // Large/normal size
        top = '30%';
        width = '210px';
        height = '40px';
        size = '30px';
    }
    $('#mathx-chrome-history-container').animate({top: top}, 600, 'linear');
    $('#mathx-chrome-history-logo').animate({width: width, height: height, fontSize: size}, 600, 'linear');
    (status == 'normal')? $('#mathx-chrome-history-poweredby').fadeIn('slow') : $('#mathx-chrome-history-poweredby').fadeOut('fast');
}
function welcomeFlash(name) {
    // Populate Textbox User Data
    $('#mathx-chrome-member-data').html(user['firstname']);
    // Display Welcome Sign
    name = name.charAt(0).toUpperCase()+name.slice(1);
    $('#mathx-chrome-email-subcontainer').fadeOut(300, function(){
        $('#mathx-chrome-email-container').css('margin-top', '0px');
    });
    $('#mathx-chrome-welcome').html('Welcome '+name);
    logoSize('normal');
    $('#mathx-chrome-welcome').delay(600).fadeIn(600, function() {
        logoBind('unbind');
        setTimeout(function() {
            setUpHistory();
        }, 800);
    });
    
}

// Sets Up the History panel
function setUpHistory() {
    $('#mathx-chrome-particle-js').css('display', 'none');
    $('#mathx-chrome-history').html('<div id="mathx-chrome-history-header"><div id="mathx-chrome-history-header-label">Images</div><div id="mathx-chrome-history-minimize" class="mathx-chrome-header-button" title="Minimize">_</div></div><div id="mathx-chrome-history-images-container"><div class="mathx-chrome-history-post-spacer"></div><div id="mathx-chrome-history-latex" data-latex=""></div></div>'/*'<div id="mathx-chrome-particle-js"></div>'*/).css('background-color','rgba(245,245,245,1)');

    $.ajax({
        type: "POST",
        url: "https://"+domain+"/process/history.php",
        data: { 
                userid: user['userid']
              }
    }).done(function(data) {
        var posts = JSON.parse(data);
        imagecount = 0;
        if (posts.length > 0) {
            for (i=posts.length - 1;i >= 0; i--) {
                var post = posts[i];
                var date = getCorrectDate(post.date, post.timeoffset);
                var imagedate = formatDate(date);
                var imagetime = formatTime(date);
                imagecount++;
                var imageid = 'mathx-chrome-history-image-'+post.session+'-'+imagecount+'-'+imagedate.join('');
                var imgsrc = 'https://'+domain+'/process/output/images/'+post.imagefile;
                $('#mathx-chrome-history-images-container').prepend('<div class="mathx-chrome-history-equation"><div class="mathx-chrome-history-entry-time-container"><div class="mathx-chrome-history-entry-time"><ul class="mathx-chrome-history-entry-keys"><li class="mathx-chrome-history-entry-key">Time:</li><li class="mathx-chrome-history-entry-key">Date:</li></ul><ul class="mathx-chrome-history-entry-values"><li class="mathx-chrome-history-entry-value">'+imagetime+'</li><li class="mathx-chrome-history-entry-value">'+imagedate.join('.')+'</li></ul></div><div class="mathx-chrome-history-size-container"><ul class="mathx-chrome-history-entry-keys"><li class="mathx-chrome-history-entry-key">Image:</li><li id="mathx-chrome-history-entry-key-label-'+imagecount+'" class="mathx-chrome-history-entry-key">Size:</li></ul><ul class="mathx-chrome-history-entry-values"><li class="mathx-chrome-history-entry-value">'+imagecount.toLocaleString('en')+'</li><li class="mathx-chrome-history-entry-value"><input type="text" id="mathx-chrome-history-size-'+imagecount+'" class="mathx-chrome-history-font-input" maxlength="2" value="'+post.font+'" /></li></ul></div></div><div class="mathx-chrome-clear"></div><div class="mathx-chrome-history-image-row"><div id="'+imageid+'-container" class="mathx-chrome-history-image-container"><textarea id="mathx-chrome-latex-data-'+post.session+'-'+imagecount+'-'+imagedate.join('')+'" class="mathx-chrome-latex-data" data-mxs="'+post.mathxscript+'" data-mxhtml="">'+post.latex+'</textarea><img id="'+imageid+'" data-width="'+post.width+'" class="mathx-chrome-history-image" src="'+imgsrc+'" ></div></div><div class="mathx-chrome-history-tools-row"><div class="mathx-chrome-latex-button-container"><div id="mathx-chrome-latex-button-'+post.session+'-'+imagecount+'-'+imagedate.join('')+'" class="mathx-chrome-latex-button" data-idsuffix="'+post.session+'-'+imagecount+'-'+imagedate.join('')+'"><div class="mathx-chrome-latex-button-open mathx-chrome-latex-button-element">[</div><div class="mathx-chrome-latex-button-val mathx-chrome-latex-button-element">Copy Latex</div><div class="mathx-chrome-latex-button-close mathx-chrome-latex-button-element">]</div></div></div><div class="mathx-chrome-clear"></div></div></div>');
                
                // Process Fonts when Changed by user
                fontFormat('#mathx-chrome-history-size-'+imagecount, "#mathx-chrome-history-entry-key-label-"+imagecount, '#'+imageid, post.mathxscript);
                
                // Format each image as they come in
                $('#'+imageid).load(function() {
                    var imgwidth = $(this).width();
                    var id = $(this).attr('id');
                    var datawidth = $(this).attr('data-width');
                    if ((datawidth > 0) && (datawidth < imgwidth)) {
                        imgwidth = datawidth;
                        $('#'+id).css({'width' : imgwidth+'px', 'height':'auto'});
                    }
                    $('#'+id+'-container').css('width', imgwidth+'px');
                });
            }

            // Copy Latex Hover Effect
            $('.mathx-chrome-latex-button').hover(function() {
                $(this).children('.mathx-chrome-latex-button-open').animate({marginLeft : '-15px'}, 200, 'linear');
                $(this).children('.mathx-chrome-latex-button-close').animate({marginLeft : '110px'}, 200, 'linear');
            }, function() {
                $(this).children('.mathx-chrome-latex-button-open').animate({marginLeft : '0px'}, 200, 'linear');
                $(this).children('.mathx-chrome-latex-button-close').animate({marginLeft : '95px'}, 200, 'linear');
            });
            // Copy Latex Click Event
            $('.mathx-chrome-latex-button').click(function() {
                var suffix = $(this).attr('data-idsuffix');
                clipboardholder= document.getElementById("mathx-chrome-latex-data-"+suffix); 
                clipboardholder.style.display = "block"; 
                clipboardholder.select(); 
                document.execCommand("Copy"); 
                clipboardholder.style.display = "none";  
                $(this).children('.mathx-chrome-latex-button-val').text('Copied!').css('margin-left', '25px');
                setTimeout(function() {
                    $("#mathx-chrome-latex-button-"+suffix).children('.mathx-chrome-latex-button-val').text('Copy Latex').css('margin-left','10px');
                }, 300);
            });
            // Create the total count in the header
            $('#mathx-chrome-history-header-label').html('Images <span id="mathx-chrome-history-total-images">'+imagecount.toLocaleString('en')+'</span>');
        }
        // Once everything loads, show minimize
        $('#mathx-chrome-history-minimize').css('display','block');
        
        // Launch the EMA TextBox
        launchTextBox();
    });
    
    // Minimize the History Menu (and restore)
    $('#mathx-chrome-history-minimize').click(function() {
        // Minimized
        if ($('#mathx-chrome-history-images-container').css('display') == 'none') {
            $('#mathx-chrome-history').removeClass('mathx-chrome-history-minimized');
            $('#mathx-chrome-history-images-container').css('display','block');
            $('#mathx-chrome-history-header-label').css('font-size', '16px');
            $(this).html('_').attr('title','Minimize');
            var mil = minImages.length;
            if (mil > 0) {
                for (var i = 0; i < mil; i++) {
                    var mid = minImages.pop();
                    var midwidth = $("#"+mid).width();
                    $('#'+mid+'-container').css('width', midwidth+'px');
                }
            }
        } else {  // Opened
            $('#mathx-chrome-history-images-container').css('display','none');
            $('#mathx-chrome-history').addClass('mathx-chrome-history-minimized');
            $('#mathx-chrome-history-header-label').css('font-size', '14px');
            $(this).html('-').attr('title','Restore');
        }
    });
}



function launchTextBox() {
    // Move in box from right
    $('#mathx-chrome-box').fadeIn('fast',function(){
        $(this).animate({right: '310px'}, 'fast');
    });
    // Start Duration Clock
    startDuration();
    // Animate intro of MathX tools
    setTimeout(function() {
        // Cursor inplace animation
        $('#mathx-chrome-box-textbox-caret-container').fadeIn(400);
        $('#mathx-chrome-box-textbox-caret').animate({marginTop: '-25px'}, 200, 'linear');
        // MathX line + focus animation
        setTimeout(function() { $('.mathx-chrome-textbox').animate({width: '280px'}, 600, 'linear');
        }, 500);
        setTimeout(function() { $('#mX').focus() }, 1200);
    }, 1500);
    // If session is 1, then onboarding
    if ($('#mathx-chrome-session-data').html()=="1") {
        setTimeout(function() {
            emaIntro();
        }, 4000);
    }
}

// MathX textbox setup
function setUpTextbox() {
    // Setup the textbox and box structure
    // Replaced horizontal line menu with vertical dots
    $('#mathx-chrome-box').append('<div id="mathx-chrome-box-header"><div id="mathx-chrome-box-header-left"><h2 id="mathx-chrome-box-version"><span class="mathx-chrome-uppercase">ema</span> v'+getVersion()+'</h2></div><div id="mathx-chrome-box-header-right"><div id="mathx-chrome-box-minimize" class="mathx-chrome-header-button" title="Minimize">_</div><div id="mathx-chrome-box-menu" class="mathx-chrome-header-button" title="Options">&vellip;</div><div id="mathx-chrome-box-menu-container" class="mathx-chrome-box-shadow"><div class="mathx-chrome-box-menu-option"><a href="http://mathx.co/help" target="_blank" style="color:rgba(211, 51, 47, 0.8)">Help</a></div></div></div></div><div id="mathx-chrome-box-body"><div id="mathx-chrome-box-data"></div><div id="mathx-chrome-box-textbox-container"></div></div>');
    // Add User Data
    $('#mathx-chrome-box-data').append('<ul class="mathx-chrome-box-keys"><li>Member:</li><li>Session:</li><li>Duration:</li></ul>');
    $('#mathx-chrome-box-data').append('<ul class="mathx-chrome-box-values"><li id="mathx-chrome-member-data"></li><li id="mathx-chrome-session-data"></li><li id="mathx-chrome-duration-clock">00:00:00:00</li></ul>');
    $('#mathx-chrome-box-data').append('<div class="mathx-chrome-clear"></div>');
    // Add MathX Textbox
    $('#mathx-chrome-box-textbox-container').append('<div class="mathx-chrome-textbox-frame-top"><div class="mathx-chrome-textbox-frame mathx-chrome-textbox-frame-left">&ulcorner;</div><div class="mathx-chrome-textbox-frame mathx-chrome-textbox-frame-right">&urcorner;</div></div>');
    $('#mathx-chrome-box-textbox-container').append('<div class="mathx-chrome-clear"></div>');
    $('#mathx-chrome-box-textbox-container').append('<div class="mathx-chrome-textbox mm-container"></div>');
    $('#mathx-chrome-box-textbox-container').append('<div class="mathx-chrome-clear"></div>');
    // Add the input caret
    $('#mathx-chrome-box-textbox-container').append('<div id="mathx-chrome-box-textbox-caret-container"><div id="mathx-chrome-box-textbox-caret" class="mathx-chrome-caret">></div></div>');
    $('#mathx-chrome-box-textbox-container').append('<div class="mathx-chrome-textbox-frame-bottom mathx-chrome-textbox-frame-bottom-left"><div class="mathx-chrome-textbox-frame mathx-chrome-textbox-frame-left">&llcorner;</div></div>');
    $('#mathx-chrome-box-textbox-container').append('<div class="mathx-chrome-textbox-frame-bottom mathx-chrome-textbox-frame-bottom-right"><div class="mathx-chrome-textbox-frame mathx-chrome-textbox-frame-right">&lrcorner;</div></div>');
    // Add the clear button
    $('#mathx-chrome-box-textbox-container').append('<div id="mathx-chrome-box-textbox-clear"><div id="mathx-chrome-clear-button" class="mathx-chrome-button" data-diff="5"><div class="mathx-chrome-button-open">[</div><div class="mathx-chrome-button-val">&times;</div><div class="mathx-chrome-button-close">]</div></div></div>');
    // Add Footer
    $('#mathx-chrome-box').append('<div id="mathx-chrome-box-footer"></div>');
    $('#mathx-chrome-box-footer').append('<div id="mathx-chrome-box-coords"><ul id="mathx-chrome-box-x-coord" class="mathx-chrome-box-coord"><li id="mathx-chrome-box-x-coord-label">x:</li><li id="mathx-chrome-box-x-coord-value">0.000</li></ul><ul class="mathx-chrome-box-coord"><li id="mathx-chrome-box-y-coord-label">y:</li><li id="mathx-chrome-box-y-coord-value">0.000</li></ul></div>');
    
    // For now, automatically apply focus to textbox
    $('.mathx-chrome-textbox').click(function() {
        $('#mX').focus();
    }); 
    // Animate clear button appearing
    $('.symbol').click(function() {
        mxcesm = false;
    });
    $('.mathx-chrome-textbox').keydown(function() {
        if ($('#mathx-chrome-clear-button').find('.mathx-chrome-button-val').css('display') == 'none') {
            // Show Clear Button
            clearButton('mathx-chrome-clear-button', 'open');
        }
    });
    $('.mathx-chrome-textbox').keyup(function(e) {
        var keycode =  e.keyCode ? e.keyCode : e.which;
        if((keycode == 8)|| (keycode == 46)){ // delete
            // Hide Clear Button
            if ($('.mathx-chrome-textbox').text() == '') {
                clearButton('mathx-chrome-clear-button', 'close');
            }
        }
        // ENTER to create image
        if ($('#aC-container').is(':visible')) {
            mxcesm = true;
            mxdata = $('.mathx-chrome-textbox').text();
        }
        if (keycode == 13) {
            e.preventDefault();
            var reWhiteSpace = new RegExp(/^\s+$/);
            if ((!mxcesm) && 
                ($('.mathx-chrome-textbox').text().length > 1) &&
                (!reWhiteSpace.test($('.mathx-chrome-textbox').text()))) {
                
                createImage();
                
                mxcesm = false;
                mxdata = '';
        } else {  // Forgone Smartmenu...enable image creation on ENTER
            if ($('#aC-container').is(':hidden')) {
                mxcesm = false;
            }
            // See if you can register spacebar
            if (keycode == 32) {
                mxcesm = false;
            }
        }
    });
    // Clear when button is clicked on
    $('#mathx-chrome-box-textbox-clear').click(function(){
        if ($(this).find('.mathx-chrome-button-val').css('display') != 'none') {
            clearButton('mathx-chrome-clear-button', 'close');
            clearTextBox();
        }
    });
    
    // Apply hover over for buttons
    $('.mathx-chrome-button').mouseover(function() {
        $(this).find('.mathx-chrome-button-open').animate({marginLeft:'0px'},200,'easeOutCirc');
        $(this).find('.mathx-chrome-button-close').animate({marginLeft:'40px'},200,'easeOutCirc');
    }).mouseleave(function() {
        $(this).find('.mathx-chrome-button-open').animate({marginLeft:'10px'},200,'easeOutCirc');
        $(this).find('.mathx-chrome-button-close').animate({marginLeft:'30px'},200,'easeOutCirc');
    });
    
    // minimized box
    minimizeTextbox();
    
    // Menu functionality
    boxMenu();
}

// Dictates to open or close the Clear Button
function clearButton(buttonid, action) {
    var elem = '#'+buttonid;
    if (action == 'open') {
        var diff = parseInt($(elem).attr('data-diff'));
        var valwidth = $(elem).find('.mathx-chrome-button-val').width();
        var valoffset = $(elem).find('.mathx-chrome-button-val').css('margin-left');
        // Show Clear Button
        $(elem).find('.mathx-chrome-button-open').fadeIn(200);
        $(elem).find('.mathx-chrome-button-close').fadeIn(200);
        setTimeout(function() {
            $(elem).find('.mathx-chrome-button-open').animate({marginLeft: (15-diff)+'px'}, 200, 'linear');
            $(elem).find('.mathx-chrome-button-close').animate({marginLeft: (25+diff)+'px'}, 200, 'linear');
            setTimeout(function() {
                $(elem).find('.mathx-chrome-button-val').fadeIn(300);
            }, 300, 'linear');
        }, 50, 'linear');
    } else if (action == 'close') {
        $(elem).find('.mathx-chrome-button-val').fadeOut(200);
        $(elem).find('.mathx-chrome-button-open').animate({marginLeft: '15px'}, 200, 'linear');
        $(elem).find('.mathx-chrome-button-close').animate({marginLeft: '25px'}, 200, 'linear');
        setTimeout(function() {
            $(elem).find('.mathx-chrome-button-open').fadeOut(200);
            $(elem).find('.mathx-chrome-button-close').fadeOut(200);
        }, 300, 'linear');
    }
}
// Clears Textbox
function clearTextBox() {
    $('.mathx-chrome-textbox').attr('contenteditable','false').html('<span class="mX-container"><span class="mX" id="mX" contenteditable="true">&#8203;</span></span>');
    $('#mX').focus();
}

// Create Image of Math in Textbox
function createImage() {
    // Turn on Image Frame
    $('.mathx-chrome-textbox-frame').css('display','block');
    $('.mathx-chrome-button-val').css('display','none');
    $('.mathx-chrome-button-open').css({display : 'none', marginLeft: '15px'});
    $('.mathx-chrome-button-close').css({display : 'none', marginLeft: '25px'});
    setTimeout(function() {
        $('.mathx-chrome-textbox-frame').css('display','none');
        clearButton('mathx-chrome-clear-button', 'open');
    }, 400);
    
    // Create an Image to History
    var mxs = getMathX('.mX-container');
    // Run the Latex
    var latex;
    $.when(getLatex(mxs)).done(function(data) { latex = data; });
    var linkroot = 'https://'+domain+'/process/output/images/';
    var imgsrc = '';
    var session = $('#mathx-chrome-session-data').html();
    // Image name info
    // Format: session-imagenumber-date
    var date   = new Date();
    var month  = date.getMonth()+1;
    month      = (month < 10)? "0"+month.toString() : month;
    var day    = (date.getDate() < 10)? "0"+date.getDate().toString() : date.getDate();
    var year   = date.getFullYear();
    var offset = date.getTimezoneOffset()/60;
    var hour   = (date.getHours() < 13)? date.getHours() : date.getHours() - 12;
    hour       = (hour == 0)? 12 : hour;
    hour       = (hour < 10)? "0"+hour.toString() : hour;
    var min    = (date.getMinutes() < 10)? "0"+date.getMinutes().toString() : date.getMinutes();
    var sec    = (date.getSeconds() < 10)? "0"+date.getSeconds().toString() : date.getSeconds();
    var timeofday = (date.getHours() < 12)? "AM" : "PM";
    var imagedate = [month, day, year];
    var imagetime = [hour, min, sec].join(":")+' '+timeofday;
    var imageid;
    var filename = "";
    var font = 12;
    if (mxs != '') {
        $.ajax({
            type: "POST",
            url: "https://"+domain+"/process/latex/latexgenerator.php",
            data: { 
                    mathxscript: mxs,
                    font: font,
                    userid: user['userid'],
                    session: session
                  },
            success: function(data) {
                    imgsrc = linkroot+data;
                    filename = data.substr(0, data.length-4);
                    ++imagecount;
                    imageid = 'mathx-chrome-history-image-'+session+'-'+imagecount+'-'+imagedate.join('');
                    $('#mathx-chrome-history-images-container')
                        .prepend('<div class="mathx-chrome-history-equation"><div class="mathx-chrome-history-entry-time-container"><div class="mathx-chrome-history-entry-time"><ul class="mathx-chrome-history-entry-keys"><li class="mathx-chrome-history-entry-key">Time:</li><li class="mathx-chrome-history-entry-key">Date:</li></ul><ul class="mathx-chrome-history-entry-values"><li class="mathx-chrome-history-entry-value">'+imagetime+'</li><li class="mathx-chrome-history-entry-value">'+imagedate.join('.')+'</li></ul></div><div class="mathx-chrome-history-size-container"><ul class="mathx-chrome-history-entry-keys"><li class="mathx-chrome-history-entry-key">Image:</li><li id="mathx-chrome-history-entry-key-label-'+imagecount+'" class="mathx-chrome-history-entry-key">Size:</li></ul><ul class="mathx-chrome-history-entry-values"><li class="mathx-chrome-history-entry-value">'+imagecount+'</li><li class="mathx-chrome-history-entry-value"><input type="text" id="mathx-chrome-history-size-'+imagecount+'" class="mathx-chrome-history-font-input" maxlength="2" value="'+font+'" /></li></ul></div></div><div class="mathx-chrome-clear"></div><div class="mathx-chrome-history-image-row"><div id="'+imageid+'-container" class="mathx-chrome-history-image-container"><textarea id="mathx-chrome-latex-data-'+session+'-'+imagecount+'-'+imagedate.join('')+'" class="mathx-chrome-latex-data" data-mxs="'+mxs+'" data-mxhtml="">'+latex+'</textarea><img id="'+imageid+'" class="mathx-chrome-history-image" data-width="auto" src="'+imgsrc+'" ></div></div><div class="mathx-chrome-history-tools-row"><div class="mathx-chrome-latex-button-container"><div id="mathx-chrome-latex-button-'+session+'-'+imagecount+'-'+imagedate.join('')+'" class="mathx-chrome-latex-button" data-idsuffix="'+session+'-'+imagecount+'-'+imagedate.join('')+'"><div class="mathx-chrome-latex-button-open mathx-chrome-latex-button-element">[</div><div class="mathx-chrome-latex-button-val mathx-chrome-latex-button-element">Copy Latex</div><div class="mathx-chrome-latex-button-close mathx-chrome-latex-button-element">]</div></div></div><div class="mathx-chrome-clear"></div></div></div>');
                  } 
        }).done(function() {
            var postid = 0;
            var imgwidth = 0;
            
            // Store the Data in the DB
            $.when(postEquation(user['userid'], mxs, latex, $('.mathx-chrome-textbox').html(), filename, font, $('#'+imageid).width(), offset)).done(function(data) {
                
                postid = data;
                
                // Process Fonts when Changed by user
                fontFormat('#mathx-chrome-history-size-'+imagecount, "#mathx-chrome-history-entry-key-label-"+imagecount, '#'+imageid, mxs);
            });
            
            // Center the Image in History Column
            $('#'+imageid).load(function() {
                var update = true;
                if (imgwidth > 0) {
                    update = false;
                }
                imgwidth = $(this).width();
                //console.log('POSTID: '+postid+' IMGWIDTH: '+imgwidth);
                $('#'+imageid+'-container').css('width', imgwidth+'px');
                if (update) {
                    $('#'+imageid).attr('data-width', imgwidth);
                    $.ajax({
                        type: "POST",
                        url: "https://"+domain+"/process/width.php",
                        data: { 
                                postid: postid,
                                width:  imgwidth
                              }
                    });
                }
            });
            
            // Copy Latex Hover Effect
            $('.mathx-chrome-latex-button').hover(function() {
                $(this).children('.mathx-chrome-latex-button-open').animate({marginLeft : '-15px'}, 200, 'linear');
                $(this).children('.mathx-chrome-latex-button-close').animate({marginLeft : '110px'}, 200, 'linear');
            }, function() {
                $(this).children('.mathx-chrome-latex-button-open').animate({marginLeft : '0px'}, 200, 'linear');
                $(this).children('.mathx-chrome-latex-button-close').animate({marginLeft : '95px'}, 200, 'linear');
            });
            // Copy Latex Click Event
            $('.mathx-chrome-latex-button').click(function() {
                var suffix = $(this).attr('data-idsuffix');
                clipboardholder= document.getElementById("mathx-chrome-latex-data-"+suffix); 
                clipboardholder.style.display = "block"; 
                //clipboardholder.value = text; 
                clipboardholder.select(); 
                document.execCommand("Copy"); 
                clipboardholder.style.display = "none"; 
                $(this).children('.mathx-chrome-latex-button-val').text('Copied!').css('margin-left', '25px');
                setTimeout(function() {
                    $("#mathx-chrome-latex-button-"+suffix).children('.mathx-chrome-latex-button-val').text('Copy Latex').css('margin-left','10px');
                }, 300);
            });
            
            // Store newly created images in array to handle differently on restore
            if ($('#mathx-chrome-history-images-container').css('display') == 'none') {
                // Add to array of images created under minimized conditions
                minImages.push(imageid);
            }
            
            // Insert the total count in the history header
            if (imagecount == 1) {
                // Create the total count in the header
            $('#mathx-chrome-history-header-label').html('Images <span id="mathx-chrome-history-total-images">'+imagecount.toLocaleString('en')+'</span>');
            } else { // Update the count
                $('#mathx-chrome-history-total-images').html(imagecount.toLocaleString('en'));
            }
        });
    }
}

// You'll have to fake box minimization for the input tool
function minimizeTextbox() {
    $('body').append('<div id="mathx-chrome-box-minimized" class="mathx-chrome-box-shadow"><div id="mathx-chrome-box-minimized-header"><span>EMA v2.2.4</span></div><div id="mathx-chrome-box-minimized-minimize" class="mathx-chrome-header-button" title="Restore">-</div></div>');
    $('#mathx-chrome-box-minimize').click(function(){
        if ($('#mathx-chrome-box-minimized').css('display') == 'none') {
            $('#mathx-chrome-box').css('display','none');
            $('#mathx-chrome-box-minimized').css('display', 'block');
        } 
    });
    $('#mathx-chrome-box-minimized-minimize').click(function() {
        $('#mathx-chrome-box-minimized').css('display','none');
        $('#mathx-chrome-box').css('display', 'block');
    });
}

// Make sure fonts entered are numbers
function fontFormat(elem, label, img, mxs) {
    var val = $(elem).attr('value');
    var eid = $(elem).attr('id');
    $(elem).keydown(function(e) { 
        var e = event || e;
        var keyCode = e.keyCode || e.which; 
        if ((keyCode == 9) || (keyCode == 13) || (keyCode == 27)) { 
            e.preventDefault(); 
            // Analyze the typed value. Make sure it's a number
            // Font Range 08 - 99
            var n = $(this).val();
            var accept = false;
            if (n.length == 1) {
                accept = parseInt(n) || n == "0";
            } else {
                accept = ( (n.charAt(0) == '0' || parseInt(n.charAt(0))) && 
                           (n.charAt(1) == '0' || parseInt(n.charAt(1))) );
            }
            if (accept) {
                var formatnumber = n.toString();
                // Add stylistic leading zero to text
                if (n.length == 1) {
                    formatnumber = '0'+n;
                }
                if (parseInt(formatnumber) < 8) // Minimum Font Size
                    formatnumber = '08';
                $(this).val(formatnumber);
                $(this).attr('value', formatnumber);
                val = formatnumber;
                updateSize(img, mxs, parseInt(formatnumber));
                $(label).html('Done:').css({'font-weight': '700', 'color': 'rgba(211, 51, 47, 0.8)'});
                setTimeout(function() {
                    $(label).html('Size:').css({'font-weight': 'normal', 'color': 'rgba(0,0,0,0.8)'});
                }, 900);
            } else {
                $(this).val(val);
                console.log('Failed to accept:'+n);
            }
            if (keyCode == 13) {
                $(elem).trigger('blur');
            }
        } 
    });
    // Do the samething for off focus too
    $(elem).focusout(function(){
        if (parseInt($(this).attr('value')) != parseInt($(this).val())) {
            var n = $(this).val();
            var accept = false;
            if (n.length == 1) {
                accept = parseInt(n) || n == "0";
            } else {
                accept = ( (n.charAt(0) == '0' || parseInt(n.charAt(0))) && 
                           (n.charAt(1) == '0' || parseInt(n.charAt(1))) );
            }
            if (accept) {
                var formatnumber = n.toString();
                // Add stylistic leading zero to text
                if (n.length == 1) {
                    formatnumber = '0'+n;
                }
                if (parseInt(formatnumber) < 8) // Minimum Font Size
                    formatnumber = '08';
                $(this).val(formatnumber);
                $(this).attr('value', formatnumber);
                val = formatnumber;
                //console.log('Accepted Value: '+formatnumber);
                updateSize(img, mxs, parseInt(formatnumber));
                $(label).html('Done:');
                setTimeout(function() {
                    $(label).html('Size:');
                }, 300);
            } else {
                $(this).val(val);
                console.log('Failed to accept:'+n);
            }
        }
    });
}

// Create Notification for Onboarding
function emaIntro() {
    // Make initial onboarding lightbox
    $('body').prepend('<div id="mathx-chrome-onboarding-bg"></div><div id="mathx-chrome-onboarding" class="mathx-chrome-box-shadow"><ul class="mathx-chrome-ema-message"><li class="mathx-chrome-ema-caret">></li><li class="mathx-chrome-ema-text"><span class="mathx-chrome-ema-h3">Hello '+user.firstname+', I\'m Ema.</span><p>I\'m here to help.  Want me to show you around?</p></li></ul><div class="mathx-chrome-clear"></div><div id="mathx-chrome-onboarding-buttons"></div></div>');
    // Test makebutton
    var $no = makebutton('mathx-chrome-onboarding-no', 'no');
    var $yes = makebutton('mathx-chrome-onboarding-yes', 'yes');
    $('#mathx-chrome-onboarding-buttons').append($no);
    $('#mathx-chrome-onboarding-buttons').append($yes);
    // Position the buttons
    $no.css('margin-left', ($no.parent().width()/2) - $no.find('.mathx-chrome-button-open').width()
                                                    - $no.find('.mathx-chrome-button-val').width()
                                                    - $no.find('.mathx-chrome-button-close').width() -38);
    $yes.css('margin-left', $yes.parent().width()/2);
    // Slide in EMA message
    setTimeout(function() {
        $('#mathx-chrome-onboarding').find('.mathx-chrome-ema-message').fadeIn(300);
        $('#mathx-chrome-onboarding').find('.mathx-chrome-ema-message').animate({marginTop: '40px'}, 500, 'easeOutCubic');
    }, 400);
    // Turn the buttons on
    setTimeout(function() {
        displaybutton($no);
        setTimeout(function() {
            displaybutton($yes);
        }, 800);
    }, 2000);
    // Onboarding start options functionality
    $yes.click(function() {
        $('#mathx-chrome-onboarding').remove();
        $('#mathx-chrome-onboarding-bg').remove();
        // Setup tour
        var tour = introJs()
        tour.setOption('tooltipPosition', 'auto');
        tour.setOption('positionPrecedence', ['left', 'right', 'bottom', 'top'])
        tour.start()	
        // Add the volume sphere equation in MathX
        $('.mathx-chrome-textbox').html('<span class="mX-container"><span class="mX" id="" contenteditable="true" data-srch="V" style="padding: 0px 0.16em 0px 0px;">𝑉</span><span class="mX fontnorm" contenteditable="true" id="" style="padding: 0px 0.2em;">=</span><span class="division"><span class="divisor" match="563"><span class="mX fontnorm" contenteditable="true" id="">4</span></span><span class="dividend" match="563"><span class="mX div fontnorm" contenteditable="true" id="">3</span></span><span style="display:inline-block;width:0;" contenteditable="false">&nbsp;</span></span><span class="mX" contenteditable="true" data-srch="i" style="padding: 0px 0.1em 0px 0px;" id="" rendername="pi" undo="p,i">𝜋</span><span class="mX" contenteditable="true" data-srch="r" style="padding: 0px 0.11em 0px 0px;" id="" subsup="sup">𝑟</span><sup class="exp-holder" contenteditable="false" style="vertical-align: 0.692308em; font-size: 0.72em;"><span class="mX exp fontnorm" id="" contenteditable="true">3</span></sup><span class="mX exp" contenteditable="true" id="mX">&#8203;</span></span>');
        $('#mX').focus();
        // If next button or bullet is clicked, 
        // create the volume sphere equation
        $('.introjs-nextbutton').click(function() {
            var ic = parseInt($('#mathx-chrome-box').attr('data-count'));
            if (ic == 0) {
                createImage();
            }
            $('#mathx-chrome-box').attr('data-count', ++ic);
        });
        $('.introjs-bullets li:nth-child(2) > a').click(function() {
            var ic = parseInt($('#mathx-chrome-box').attr('data-count'));
            if (ic == 0) {
                createImage();
            }
            $('#mathx-chrome-box').attr('data-count', ++ic);
        });
    });
    $no.click(function() {
        $('#mathx-chrome-onboarding').remove();
        $('#mathx-chrome-onboarding-bg').remove();
        $('#mX').focus()
    });
}

// Template for creating EMA style buttons
function makebutton(name, val) {
    var $button = $('<div>');
    $button.attr({'id' : name, 'class' : 'mathx-chrome-button'});
    var open = '<div class="mathx-chrome-button-open">[</div>';
    var close = '<div class="mathx-chrome-button-close">]</div>';
    var label = '<div class="mathx-chrome-button-val">'+val+'</div>';
    $button.append(open+label+close);
    return $button;
}
// Animate on the button
function displaybutton($button) {
    var openwidth = $button.find('.mathx-chrome-button-open').width();
    var valwidth = $button.find('.mathx-chrome-button-val').width();
    var closewidth = $button.find('.mathx-chrome-button-close').width();
    // Initialize margins
    $button.find('.mathx-chrome-button-open').css('margin-left', 25+((valwidth/2)-(openwidth+1)));
    $button.find('.mathx-chrome-button-val').css('margin-left', 25);
    $button.find('.mathx-chrome-button-close').css('margin-left', 25+(valwidth/2)+1);
    // Animate
    $button.find('.mathx-chrome-button-open').fadeIn(200);
    $button.find('.mathx-chrome-button-close').fadeIn(200);
    setTimeout(function() {
        $button.find('.mathx-chrome-button-open').animate({marginLeft: '8px'}, 200, 'linear');
        $button.find('.mathx-chrome-button-close').animate({marginLeft: (30+valwidth)+'px'}, 200, 'linear');
        setTimeout(function() {
            $button.find('.mathx-chrome-button-val').fadeIn(300);
        }, 300, 'linear');
    }, 50, 'linear');
    // Add hover over effect
    $button.hover(function() {
        $(this).children('.mathx-chrome-button-open').animate({marginLeft : '0px'}, 200, 'linear');
        $(this).children('.mathx-chrome-button-close').animate({marginLeft : 38+valwidth}, 200, 'linear');
    }, function() {
        $(this).children('.mathx-chrome-button-open').animate({marginLeft : '8px'}, 200, 'linear');
        $(this).children('.mathx-chrome-button-close').animate({marginLeft : 30+valwidth}, 200, 'linear');
    });
}

// Open and close the box menu
function boxMenu() {
    $('#mathx-chrome-box-menu').click(function() {
        if ($('#mathx-chrome-box-menu-container').css('display') == 'none') {
            $('#mathx-chrome-box-menu-container').css('display', 'block');
        } else {
            $('#mathx-chrome-box-menu-container').css('display', 'none');
        }
    });
}

// Get Latex Code
function getLatex(mxscript) {
    return $.ajax({
        type: "POST",
        url: "https://"+domain+"/process/latex/getlatex.php",
        data: { mathxscript: mxscript.trim() }
    });
}

// Get User Profile
function getUser(email) {
    var d = new Date();
    return $.ajax({
        type: "POST",
        url: "https://"+domain+"/process/account.php",
        data: { 
            email: email.trim(),
            timezone: d.getTimezoneOffset()/60 // In hours        
        },
        error: function() {
            console.log('Failed to retrieve user info');
        }
    });
}

// Insert User data to DB
function setUser(userid, firstname, lastname, password) {
    return $.ajax({
        type: "POST",
        url: "https://"+domain+"/process/newuser.php",
        data: { 
                userid    : userid,
                firstname : firstname.trim(),
                lastname  : lastname.trim(),
                password  : password.trim()
              }
    });
}

// Set Session Variable
function setSession(userid) {
    var d = new Date();
    $.ajax({
        type: "POST",
        url: "https://"+domain+"/process/session.php",
        data: { 
                userid     : userid,
                appversion : getVersion(), 
                timezone   : d.getTimezoneOffset()/60 // In hours
              },
        success: function(data) {
            $('#mathx-chrome-session-data').html(data);
        }
    });
}

// Check if user typed password correctly
function authenticateUser(email, password) {
    return $.ajax({
        type: "POST",
        url: "https://"+domain+"/process/login.php",
        data: { 
                email:    email,
                password: password
              }
    });
}

// Insert post into db
function postEquation(userid, mxs, latex, html, file, font, imgwidth, offset) {
    return $.ajax({
        type: "POST",
        url: "https://"+domain+"/process/post.php",
        data: { 
                userid: userid,
                mathxscript: mxs,
                latex: latex,
                html: html,
                file: file,
                font: font,
                width:  imgwidth,
                timezone: offset
              }
    });
}

// Update the font size when a user changes
function updateSize(elem, mxs, tosize) {
    // Genereate the New Image file from given inputs
    var userid   = user['userid'];
    var session  = $('#mathx-chrome-session-data').html();
    var tofile = "";
    var originalwidth = $(elem).attr('data-width');
    // Args for size call
    var fl       = $(elem).attr('src');
    var ff       = fl.split('/');
    var fromfile = ff[ff.length-1];
    var urlroot  = fl.substr(0, fl.length - fromfile.length);
    var d        = new Date();
    var timezone = d.getTimezoneOffset()/60 // In hours
    $.ajax({
        type: "POST",
        url: "https://"+domain+"/process/latex/latexgenerator.php",
        data: { 
                mathxscript: mxs,
                font: tosize,
                userid: userid,
                session: session
              },
        success: function(data) {
                tofile = data;
                $(elem).attr('src', urlroot+tofile);
                if (tosize < 12) {
                    $(elem).css({'width': 'auto', 'height':'auto'});
                } else {
                    $(elem).css({'width': originalwidth+'px', 'height':'auto'});
                }
                // Size Update in DB
                $.ajax({
                    type: "POST",
                    url: "https://"+domain+"/process/size.php",
                    data: { 
                            userid     : userid,
                            session    : session,
                            tosize     : tosize,
                            tofile     : tofile,
                            fromfile   : fromfile,
                            timezone   : timezone
                          },
                    success: function(data) {
                          console.log('Successfully Uploaded: '+data);    
                    }
                });
        }
    });
}

// Global Variables

// Time Variable
var currentTime;

// Smartmenu Global Variable
var mxcesm = false;
var mxdata = '';

// Time Variables
var imagecount = 0;

// GPS Location Variables
var lat;
var lon;

// Session Variables
//var session = 0;

// User Variables
var user = {};

// New Images created during minimized window
var minImages = [];

// Domain for AJAX processing
var domain = "mathx.co"; // "ec2-54-153-24-63.us-west-1.compute.amazonaws.com";

// Duration Clock Global Variables
var timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null;

// App on/off status
var status = true;

function startDuration() {
    if (timeBegan === null) {
        timeBegan = new Date();
    }

    if (timeStopped !== null) {
        stoppedDuration += (new Date() - timeStopped);
    }
    //console.log(stoppedDuration);

    started = setInterval(clockRunning, 120/* 160 */);	
}

function stop() {
    timeStopped = new Date();
    clearInterval(started);
}
 
function reset() {
    clearInterval(started);
    stoppedDuration = 0;
    timeBegan = null;
    timeStopped = null;
    document.getElementById("mathx-chrome-duration-clock").innerHTML = "00:00:00.00";
}

function clockRunning(){
    var currentTime = new Date()
        , timeElapsed = new Date(currentTime - timeBegan - stoppedDuration)
        , hour = timeElapsed.getUTCHours()
        , min = timeElapsed.getUTCMinutes()
        , sec = timeElapsed.getUTCSeconds()
        , ms = timeElapsed.getUTCMilliseconds().toString().substr(0,2);

    document.getElementById("mathx-chrome-duration-clock").innerHTML = 
        (hour > 9 ? hour : "0" + hour) + ":" + 
        (min > 9 ? min : "0" + min) + ":" + 
        (sec > 9 ? sec : "0" + sec) + ":" + 
        (ms > 9 ? ms : "0" + ms);
};

// Timestamp Code
// Return a timestamp with the format "m/d/yy h:MM:ss TT"
function timeStamp() {
// Create a date object with the current time
  var now = new Date();
 
// Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
 
// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
 
// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";
 
// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
 
// If hour is 0, set it to 12
  time[0] = time[0] || 12;
 
// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }
 
// Return the formatted string
  return date.join(".") + " " + time.join(":") + " " + suffix;
}

function getCorrectDate(givenDate, timeoffset) {
    var date = null;
    var tdate = null;
    if (givenDate && timeoffset) {
        tdate = new Date(givenDate); 
        date = new Date(tdate - timeoffset*60*60*1000);
    } else {
        date = new Date();
    }
    return date;
}

function formatDate(date) {
    var month  = date.getMonth()+1;
    month      = (month < 10)? "0"+month.toString() : month;
    var day    = (date.getDate() < 10)? "0"+date.getDate().toString() : date.getDate();
    var year   = date.getFullYear();
    return [month,day,year];
}

function formatTime(date) {
    var hour   = (date.getHours() < 13)? date.getHours() : date.getHours() - 12;
    hour       = (hour == 0)? 12 : hour;
    hour       = (hour < 10)? "0"+hour.toString() : hour;
    var min    = (date.getMinutes() < 10)? "0"+date.getMinutes().toString() : date.getMinutes();
    var sec    = (date.getSeconds() < 10)? "0"+date.getSeconds().toString() : date.getSeconds();
    var timeofday = (date.getHours() < 12)? "AM" : "PM";
    return hour+":"+min+":"+sec+" "+timeofday;
}

// Get User's Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
}

function showPosition(position) {
    console.log('Lat: '+position.coords.latitude+' Lon:'+position.coords.longitude);
}

// Read and return the Ext. version from
// the manifest file.  Version all posts
function getVersion() {
    return chrome.runtime.getManifest().version;
}

// Store user data
function storeUserPrefs(key, value) {
    // Store user's email into localStorage
    chrome.runtime.sendMessage({setemail: value}, function(response) {
        console.log('Stored Session['+key+']: '+value);
    });
    // Store into sync for good messure
    chrome.storage.sync.set({key : value}, function () {
        localStorage.setItem('email', value);
        console.log('Sync Saved: ['+key+'] = '+value);
    });
}

function getUserPrefs(key) {
    // Ask localStorage for the user's email if saved.
    // This works with message passing to a 
    // persistent background page.
    chrome.runtime.sendMessage({localstorage: "email"}, function(response) {
        console.log('Session: '+response.email);
        if (response.email) {
            $.when(getUser(response.email)).done(function(data) {
                rdata = JSON.parse(data);
                setSession(rdata.userid);
                user = rdata;
                if (data) {
                    if (rdata['firstname']) {
                        // Complete profile
                        welcomeFlash(rdata['firstname']);
                        console.log('Current Session (by '+key+'): '+rdata['email']);
                    } else {
                        // Incomplete profile
                        launchEmailInput();
                    }
                } else {
                    // Email Input Entry
                    launchEmailInput();
                }
            });
        } else {  // Haven't set User's Email yet
            launchEmailInput();
        }
    });
}

// Execute Functionality
$(document).ready(function () {
    init();
});