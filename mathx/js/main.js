// Plugin Definintion
$.fn.mathX = function( options ) {
  var settings = $.extend({
      placeholderText : 'Add A Comment',
      placeholderIcon: false,
      mathJax: false,
      mathModeOnly: false,
      edition: "Master Edition",
      userGuide: false
  }, options);

  return this.each( function() {
    var randid = Math.round(Math.random()*100);
    var id = "mx"+randid;
      
    var mX_vars = new mXVars(id,
        $("<span class='"+mX+"' contenteditable='true'>"+space+"</span>"), $(this), $(this));
    
    // Add the var set to the hash table
    mxVarMap[randid] = mX_vars;
      
    $(this).attr("id",id).addClass(id);

    if($(this).hasClass('cke')) {
      console.log("cke");
    }

    //var mXparent = id;
    mXparent = id;
    var $mXparent = $(this);
    $mXparent = $(this);  
    var $tt = this;
    $mX_elem=$(this);
    var $mX_elem=$(this);

    var togglemX=0;
    var errors=0;
    //var space = '\u200B';
    var icon='';
    if(settings.placeholderIcon==true) {
      icon = '<img src="mathx/images/compose-icon.svg">';
    }
    var placeholder = '<span class="placeholder">'+icon+ ' '+settings.placeholderText+'</span>';
    var inc = 'includes';
    var $clipboard=$('<span></span>');

    var enter=0;
    var srchstr='';

    var undo = new Array();

    var elem_it=100;

    $(document.body).append('<div class="mxselectingbox"><span></span></div>');

    if($mX_elem==undefined) {
      $mX_elem = $("div.mm-container:first");
    }
    if($mX_elem.attr("contenteditable")!="true") {
      $mX_elem.attr("contenteditable","true");
    }

    var $mX = $("<span class='"+mX+"' contenteditable='true'>"+space+"</span>");
    
    var $edit = $("<span class='"+mX+" edit' contenteditable='true' data-srch=''></span>");
    mxMssg($("#"+mX),"This is your MathX toolbar. Follow hints provided until you are an expert.");

    /* placeholder - beg */
    function mathSetPlaceholder($el, str) {
      if(trim($el.text())=='' && togglemX==0) {
        $el.html(str);
        $(".touchbuttons").hide();
      }
    }
    function mathUnsetPlaceholder($el, str) {
      if(trim($el.html())==str) {
        $text = $("<p>&#x200b;</p>");
        $el.html($text);
        placeCaretAtEnd($text[0]);
      }
    }

    mathSetPlaceholder($mX_elem,placeholder);

    $mX_elem.on("focusin", function() {
      if($(this).find(".placeholder").length>0) {
        mathUnsetPlaceholder($(this),placeholder);
      }
    })

    $mX_elem.on("focusout",function(e) {
      if(trim($(this).text())=='' && enter==0) { // text box was emptying if you hit enter in an empty text span
        mathSetPlaceholder($(this),placeholder);
      }
    })
    /* placeholder - end */

    /* override mouse click behavior in and around mX  */ 
    $mX_elem.on("mousedown", function(e) {

      if(togglemX==1) {
        if($(e.target).parents(".math-container-rendered").length>0) {
          var $t = $("#"+mX);
          $mXparent.find("."+mX).attr("id","");
          exitmX($t,''); 
        }

        if($(e.target).hasClass(mXparent) || $(e.target).parent().hasClass(mXparent)) {
          if(settings.mathModeOnly==true) {
            placeCaretAtEnd($(e.target).find("."+mX+":last")[0]);
            $("."+mXc+' .mx-selected').removeClass('mx-selected');
            return false;
          } else {
            var $t = $("#"+mX);
            $mXparent.find("."+mX).attr("id","");
            exitmX($t,'');
            relocateClose();
          }
        } else if($(e.target).hasClass(mX)) {
          $("."+mXc+' .mx-selected').removeClass('mx-selected');

          $(".edit").remove();

          var c='';
          if($(e.target).hasClass('exp')) {
            c = c+'exp ';
          }
          if($(e.target).hasClass('und')) {
            c = c+'und ';
          }

          if(e.pageX < ($(e.target).offset().left + $(e.target).width()/2)) {
            var $t = $("<span class='"+mX+" edit "+c+"' contenteditable='true'></span>");
            $t.insertBefore($(e.target)).focus();
            placeCaretAtEnd($t[0]);
          } else {
            var $t = $("<span class='"+mX+" edit "+c+"' contenteditable='true'></span>");
            $t.insertAfter($(e.target)).focus();
            placeCaretAtEnd($t[0]);
          }
          placeCaretAtEnd($t[0]);

          relocateClose();
          return false;
        } else if($(e.target).hasClass("func-box")) {
          $(e.target).find("."+mX).focus();
          placeCaretAtEnd($(e.target).find("."+mX)[0]);
          $("."+mXc+' .mx-selected').removeClass('mx-selected');
          relocateClose();
          return false;
        } else {
          $("."+mXc+' .mx-selected').removeClass('mx-selected');
          return;
        }
      } else if($(this).find(".placeholder").length>0) {
        e.preventDefault();
        mathUnsetPlaceholder($(this),placeholder);
        return false;
      } else {
        return;
      }
    })

    /* remove selected box if clicking outside mX */
    $mX_elem.on("mousedown", "."+mXc, function(e) {
      $(".mxselectionbox").remove();
      $(".mxselectingbox").addClass("mxselectingbox-active");
      $(".mxselectingbox").css({
        'left': e.pageX,
        'top': e.pageY
      });

      initialW = e.pageX;
      initialH = e.pageY;

      $(document).bind("mouseup", selectElements);
      $(document).bind("mousemove", openSelector);

    });

    /* selection tool */
    function openSelector(e) {
      var w = Math.abs(initialW - e.pageX);
      var h = Math.abs(initialH - e.pageY);

      if(w<5) {
        return false;
      }

      $("."+mX).attr("contenteditable","false");
      document.getSelection().removeAllRanges();

      $(".mxselectingbox").css({
        'width': w,
        'height': h
      });
      if (e.pageX <= initialW && e.pageY >= initialH) {
        $(".mxselectingbox").css({
          'left': e.pageX
        });
      } else if (e.pageY <= initialH && e.pageX >= initialW) {
        $(".mxselectingbox").css({
          'top': e.pageY
        });
      } else if (e.pageY < initialH && e.pageX < initialW) {
        $(".mxselectingbox").css({
          'left': e.pageX,
          "top": e.pageY
        });
      }
    }

    /* after finish selecting, loop elements to see if they are included in the selection */
    function selectElements(e) {
      $(document).unbind("mousemove", openSelector);
      $(document).unbind("mouseup", selectElements);
      var maxX = 0;
      var minX = 5000;
      var maxY = 0;
      var minY = 5000;
      var totalElements = 0;
      var elementArr = new Array();

      if($(".mxselectingbox").width()<5) {
        return false;
      }

      $("."+mX+", .division, .func-holder, .brack-holder").each(function () {
        var aElem = $(".mxselectingbox");
        var bElem = $(this);
        var result = doObjectsCollide(aElem, bElem);

        if (result == true) {
          if(!$(this).parents().hasClass("mx-selected")) {
            $(this).addClass('mx-selected');
          }

          $(this).children().removeClass("mx-selected");

          if($(this).attr("subsup")!='' && $(this).attr("subsup")!=undefined && !$(this).next().parents().hasClass('mx-selected')) {
            if($(this).attr("subsup")=='subsup') {
              $(this).next().addClass('mx-selected');
              $(this).next().next().addClass('mx-selected');
            } else {
              $(this).next().addClass('mx-selected');
            }
          }
          var aElemPos = bElem.offset();
          var bElemPos = bElem.offset();
          var aW = bElem.width();
          var aH = bElem.height();
          var bW = bElem.width();
          var bH = bElem.height();

          var coords = checkMaxMinPos(aElemPos, bElemPos, aW, aH, bW, bH, maxX, minX, maxY, minY);
          maxX = coords.maxX;
          minX = coords.minX;
          maxY = coords.maxY;
          minY = coords.minY;
          var parent = bElem.parent();

          //console.log(aElem, bElem,maxX, minX, maxY,minY);
          if (bElem.css("left") === "auto" && bElem.css("top") === "auto") {
            bElem.css({
              'left': parent.css('left'),
              'top': parent.css('top')
            });
          }
        }
      });

      $(".division").not(".mx-selected").each(function() {
        if($(this).find("."+mX+".mx-selected").length>0 && $("."+mXc+">."+mX+".mx-selected").length>0) {
          $(this).addClass("mx-selected");
          $(this).find("."+mX+".mx-selected").removeClass("mx-selected");
        }
      })


      if($("."+mXc+">."+mX+".mx-selected").length>0 && $(".division").length>0 && !$(".division").hasClass("mx-selected") && $(".division")) {
      
      }

      $("body").append("<div id='mxselectionbox' class='mxselectionbox' x='" + Number(minX - 20) + "' y='" + Number(minY - 10) + "'></div>");

      $("#mxselectionbox").css({
        'width': maxX + 2 - minX,
        'height': maxY + 2 - minY,
        'top': minY - 1,
        'left': minX - 2
      });
      
      $(".mxselectingbox").removeClass("mxselectingbox-active");
      $(".mxselectingbox").width(0).height(0);

      $("."+mX).attr("contenteditable","true");

      placeCaretAtEnd($("."+mX+":last")[0]);      
    }

  /* close button - beg */
    // adjust placement of close button based on height of math-container
    function relocateClose() {
        // $closeBtn.css("margin-top","-"+($("#"+mX).parents("."+mXc).height()+10)+"px");
    }

    if(settings.mathModeOnly==true) {
      var $closeBtn = $("");
    } else {
      var $closeBtn = $("<span class='"+mXcl+" close-style' contenteditable='false'>&times;</span>");
    }


    $mX_elem.on("click", "."+mXcl, function() {
      var $mmcont = $(this).prev("."+mXc);

      $mX_elem.attr("contenteditable","true");
      placeCaretAtEnd($mX_elem[0]);

      $mmcont.remove();

      $(this).remove();
      $("#"+aCr).remove();
      togglemX=0;
    });

    $mX_elem.on({
      mouseenter: function(e) {
        $(this).fadeTo("fast",.6);
      },
      mouseleave: function(e) {
        $(this).fadeTo("fast",1);
      }
    },"."+mXcl);
  /* close button - end */

  /* message function - never really implemented - beg */
    function mxMssg($el,mssg) {
      if(settings.userGuide==false) {
        return false;
      }
      if(readCookie("mathXtoolbar")=='fulltool') {
        $mssg = $("<div class='mxmssg'><div class='mssgtext'>"+mssg+"</div><div class='mxmssgtoggle'>hide</div><div class='mssgbutton'>TUTORIAL</div><div class='mssgbutton'>REFERENCE</div></div>");
        $mssg.width($mX_elem.outerWidth()*.97);
      } else {
        $mssg = $("<div class='mxmssg'><div class='mssgtext'></div><div class='mxmssgtoggle'>MATHX USER GUIDE</div></div>");
      }

      if (!$mssg.is(":visible")){
        $mssg.insertAfter($mX_elem);
        $mssg.fadeIn(250);
      }

      elemleft = ($mX_elem.outerWidth()*.015+($mX_elem.position().left/2));
      elemtop = $mX_elem.offset().top+$mX_elem.outerHeight()-$mssg.outerHeight()-3;

      $mssg.css({"left": elemleft, "top": elemtop});
    }
    function mxMssgClose() {
      $(".mxmssg").clearQueue().stop().fadeOut(200, function() {
        $(this).remove();
      })
    }
    if(readCookie("mathXtoolbar")==null) {
      createCookie("mathXtoolbar", "fulltool", 1000);
    }

    $(document.body).on("click", ".mxmssgtoggle", function() {
      var $this = $(this);
      eraseCookie("mathXtoolbar");
      if($(this).text()=='hide') {
        var $e = $(this).parent(".mxmssg").clone().html("<div class='mxmssgtoggle'>MATHX USER GUIDE</div>").css("width","auto").appendTo("body");
        var w = $e.css("width");
        $e.remove();
        $(".mssgbutton").fadeOut(100, function() {
          $(".mssgbutton").remove();
        });
        createCookie("mathXtoolbar", "minitool", 1000);
        $(".mssgtext").text('');
        $(this).parent(".mxmssg").animate({
          width: w
        },250);

        $(this).text("MATHX USER GUIDE");
      } else {
        $(this).parent(".mxmssg").animate({
          width: $mX_elem.outerWidth()*.95
        },250, function() {
          $(".mssgtext").text('This is your MathX toolbar. Follow hints provided until you are an expert.');
          $("<div class='mssgbutton'>TUTORIAL</div><div class='mssgbutton'>REFERENCE</div>").insertAfter($this);
        });
        $(this).text("hide");
        createCookie("mathXtoolbar", "fulltool", 1000);
      }
    })
  /* message function - end */

    /* if mathmode only, execute mX function */
    if(settings.mathModeOnly==true) {
      mXf($mX_elem);
    }

    var pos;
    /* something with the backspace key.. I forget */
    $mX_elem.on("keydown", function(e){
      var code = (e.keyCode ? e.keyCode : e.which);

      if(!$(e.target).hasClass('mX')) {
        if(code==8) {
          if(trim($(this).text())=='') {
            return false;
          }
        }
      }
    });

    /* something with enter key... */
    $mX_elem.on("keypress", function(e){
      var code = (e.keyCode ? e.keyCode : e.which);

      enter=0;
      if (code == 13) {
        enter=1;
        $mX_elem.remove("br");
      }
    });

    /* this is old code to check whether to render inline or display */
    function checkDisplay($elem) {
      var $targ = $(document.activeElement).parents("p:first");
      var dispbad = "inline";
      var dispgood = "display";

      $targ.find(".text").each(function() {
        if(trim($(this).text())!='') {
          dispbad = "display";
          dispgood = "inline";
        }
      })
      
      if($targ.find(".rendered-mX[display="+dispbad+"]").length>0) {
        $targ.find(".rendered-mX[display="+dispbad+"]").each(function() {
          $(this).attr("display",dispgood);
          renderMML($(this),dispgood);
        })
      }
    }

    /* listen for "//" */
    var timer=0;
    $mX_elem.on("keyup", function(e) {
      var code = (e.keyCode ? e.keyCode : e.which);
      var contents = $(this).html();

      if(!$(e.target).hasClass('mX')) {
        if(timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(checkDisplay, 1000); 
      }

      if(code==191 || code==111) {
        if(/[^:]\/\//.test(contents)) {
          if(togglemX==0) {
            mXf($(this));
          }
        }
      }
    });

    var $lastFocused;
    $mX_elem.on("focusout", "#"+mX, function() {
      $lastFocused = $(this);
    });


    /* this is mostly old code to remove some of the highlighting/error reporting we used to do... */
    $mX_elem.on("focus", "."+mX, function() {
      $(this).removeClass("arghighlight");

      if($(this).parents("td.dividend").hasClass("error")) {
        $(this).parents("td.dividend").removeClass("error").fadeTo(0,1);
        errors=0;
      }
      $("td.argument").css("background-color","transparent");
      if($(this).parents("td.argument").length>0 && orangeFunc.indexOf($(this).parents(".arguments-table:first").attr("func"))>-1 && $(this).parents("td.argument").attr("order")==1) {
        $(this).parents("td.argument:first").css("background-color","#f7bc68");
      }
      $("."+mX).attr("id","");

      $(this).attr("id",mX);
    });


    /* the actual "begin mX" function */
    function mXf($elem) {
      togglemX=1;
      $("."+mX).attr("id","");
      var pos = getCaretPosition($elem[0]);
      $elem.find("p");
      var contents = $elem.html();
      var c,p,pp;
      for ( var i = 0; i < contents.length; i++ ) {
        pp=p,p=c,c=contents.charAt(i);
        if(c=='/' && p=='/' && pp!=':') {
          pos = i-1;
          break;
        }
      }

      $elem.attr("contenteditable","false");

      // determine where to place the mathscript container
      var str_1 = contents.substring(0,pos);
      var str_2 = contents.substring(pos).replace("//","<span class='"+mXc+"'><span class='"+mX+"' id='"+mX+"' contenteditable='true'></span></span>");

      if(settings.mathModeOnly==true) {
        var str_1 = "<span class='"+mXc+"'><span class='"+mX+"' id='"+mX+"' contenteditable='true'></span></span>";
        $elem.empty().html(str_1);
      } else {
        $elem.empty().html(str_1+str_2);
      }

      $("#"+mX).html('&#x200b;');
      placeCaretAtEnd($("#"+mX)[0]);

      var hgt = $("#"+mX).parents("."+mXc).height();
      hgt = hgt + 10;
     $closeBtn.insertAfter($("#"+mX).parents("."+mXc));
    }

    $(".error").on("click", function() {
      errors=0;
      $(this).find(".div").focus();
      $(this).removeClass("error").fadeTo(0,1);
    });




    function buildSearchString($t) {
      var cursrch=0;
      srchstr='';

      $t.parent().children().each(function() {
        if($(this).is('.division,.exp-holder,.und-holder,.func-holder,.fontnorm')) {
          if(cursrch==1) {
            return false;
          } 
        }
        if(/[A-Z,a-z\s]$/i.test($(this).attr("data-srch")) && $(this).attr("data-srch")!=undefined && !$(this).hasClass("fontnorm") || $(this).hasClass("edit")) {
          srchstr = srchstr + $(this).attr("data-srch");
          $(this).addClass('cursrch');
        } else {
          if(cursrch==0) {
            srchstr='';
            $t.parent().children().removeClass('cursrch');
          }
        }
        if($(this)[0]==$t[0]) {
          cursrch=1;
        }
        if(srchstr=='' && cursrch==1) {
          $(".cursrch").removeClass('cursrch');
          return false;
        }
        if($(this).is("#"+mX)) {
          return false; 
        }

      });
    }



    /* this is where we handle much of the non-navigation key overrides.  in the second half, most of the keycodes are annotated for what is happening */
    $mX_elem.on("keypress", "."+mX, function(e) {
      var code = (e.CharCode ? e.CharCode : e.which), 
        $this = $(this);
      var caret = getCaretCharacterOffsetWithin($this[0]);
      var contents = String.fromCharCode(code);
      srchstr='';
      $(".cursrch").removeClass('cursrch');

      if($(this).parent().hasClass('mat-box') && contents!='') {
        $(this).parent().addClass('mat-box-clear');
      } else if($(this).parent().hasClass('mat-box') && contents=='') {
        $(this).parent().removeClass('mat-box-clear');
      }

      if(code==94 || code==95 || code==47 || code==0) {

      } else {
        $(this).parents().removeClass("empty");

        /* build search string, if applicable - where your current span has a character in it */
        if(trim($(this).text())!='') {
          e.preventDefault();

          var $t = $("<span class='"+mX+"' contenteditable='true'></span>");
          if((code>64 && code<91) || (code>96 && code<123) || code==60 || code==62 || code==32) {
            if(code==60) {
              $t.attr("data-type","openbrack").addClass("brack");
            }
            $(this).removeClass('edit');
            $t.html(charMap(code)[0]).css("padding",charMap(code)[1]).attr("data-srch",String.fromCharCode(code));
          } else {
            $(this).removeClass('edit');
            $t.text(String.fromCharCode(code));
          }

          if(caret==0) {
            $t.insertBefore($(this));
          } else {
            $t.insertAfter($(this));
          }
          placeCaretAtEnd($t[0]);
          contents = String.fromCharCode(code);
        } else {

        /* build search string, if applicable - where your current span is empty */
          e.preventDefault();
          var $t = $(this);
          if((code>64 && code<91) || (code>96 && code<123) || code==60 || code==62 || code==32) {
            if(code==60) {
              $t.attr("data-type","openbrack").addClass("brack");
            }
            $(this).removeClass('edit');
            $t.html(charMap(code)[0]).css("padding",charMap(code)[1]).attr("data-srch",String.fromCharCode(code));;
          } else {
            $(this).removeClass('edit');
            $t.text(String.fromCharCode(code));
          }
          contents = String.fromCharCode(code);
          placeCaretAtEnd($t[0]);
        }

        /* romanize letters/operators/brackets */
        if (/[0-9,+-=*\(\)\[\]\{\}\|\<\>]$/i.test(contents)) {
          $t.removeClass('edit');
          $t.addClass('fontnorm');
        }
        
        if(/[A-Z,a-z]$/i.test(contents)) {
          buildSearchString($t);
        }

      }

      autocomplete(randid,$t,code,undo,srchstr);


      /* beginning here, checking various keys for override and building the logic/code */
      if(code==94) {                                                                                                                  // caret
        if($(this).parent(".exp-holder").length>0 && $(this).parent(".exp-holder").text()=='') {
          return false;
        }

        if($this.prev().indexOf>-1) {
          if($this.prev().html().length==0) {
            $this.prev().remove();
          }
        }

        if(trim($this.text())=='') {
            var $p = $this.prev();
        } else {
          var $p = $this;
        }

        if($p.hasClass("und-holder")) {
          $p = $p.prev();
        }

        if($p.text()=='|') {
          setTransform($p,200,200,1.5,1);
        }

        var ht = parseFloat($($p.height()).toEm())/2;

        var $exp = $("<sup class='exp-holder empty' contenteditable='false' style='vertical-align:"+ht+"em;'></sup>");
        if(bracketsClosed.indexOf($p.text())>-1) {
          $p.attr("subsup","sup");
          findBracketMatch($p,'back','strict');
        } else {
          $p.attr("subsup","sup");
        }


        if($(this).parents(".exp-holder").length==0) {
          $exp.css("font-size",".72em");
        } else if($(this).parents(".exp-holder").length==1) {
          $exp.css("font-size",".7em");
        } 

        if($this.prev().hasClass("und-holder") && trim($this.text())=='') {
          $exp.css("margin-left","-"+$($this.prev().width()).toEm()+"em");

          var $p = $this.prev().prev();

          if(bracketsClosed.indexOf($p.text())>-1) {
            $p.attr("subsup","subsup")
            findBracketMatch($p,'back','strict');
          } else {
            $p.attr("subsup","subsup");
          }

        }

        if($(this).hasClass("arginput")) {
          $exp.addClass("arginput");
        }

        $exp.insertAfter($this);

        if(trim($this.text())=='') {
          $this.remove();
        }

        if($this.hasClass("arginput")) {
          $exp.append("<span class='"+mX+" exp arginput' id='"+mX+"' contenteditable='true'></span>");
        } else {      
          $exp.append("<span class='"+mX+" exp edit' id='"+mX+"' contenteditable='true'></span>");
        }

        $exp.find("."+mX+":first").html(space);
        placeCaretAtEnd($exp.find("."+mX+":first")[0]);

        elemResize($exp);

        relocateClose();

        return false;      
      } else if(code==95) {                                                                                                                  // underscore
        $(this).html($(this).html().replace(/\_/g,''));

        if($(this).parent(".und-holder").length>0 && $(this).parent(".und-holder").text()=='') {
          return false;
        }

        if($this.prev().indexOf>-1) {
          if($this.prev().text().length==0) {
            $this.prev().remove();
          }
        }

        if(trim($this.text())=='') {
          var $p = $this.prev();
        } else {
          var $p = $this;
        }

        if($p.hasClass("exp-holder")) {
          $p = $p.prev();
        }

        var ht = parseFloat($($p.height()).toEm())/2-.3;

        var $und = $("<sub class='und-holder empty' contenteditable='false' style='vertical-align:-"+ht+"em;'></sub>");
        if(bracketsClosed.indexOf($p.text())>-1) {
          findBracketMatch($p.attr("subsup","sub"),'back','strict');
        } else {
          $p.attr("subsup","sub");
        }


        if($this.prev().hasClass("exp-holder") && trim($this.text())=='') {
          $und.css("margin-left","-"+$($this.prev().width()).toEm()+"em");

          var $p = $this.prev().prev();

          if(bracketsClosed.indexOf($p.text())>-1) {
            findBracketMatch($p.attr("subsup","subsup"),'back','strict');
          } else {
            $p.attr("subsup","subsup");
          }
        }

        if($(this).parents(".und-holder").length==0) {
          $und.css("font-size",".72em");
        } else if($(this).parents(".und-holder").length==1) {
          $und.css("font-size",".7em");
        } 

        if($(this).hasClass("arginput")) {
          $und.addClass("arginput");
          $(this).parents("td:first").css("padding-top",(ht*.8)+"em");
        }

        $und.insertAfter($this);

        if(trim($this.text())=='') {
          $this.remove();
        }

        $und.append("<span class='"+mX+" und' id='"+mX+"' contenteditable='true'></span>");
        $und.find("."+mX+":first").html(space);
        placeCaretAtEnd($und.find("."+mX+":first")[0]);

        relocateClose();

        return false;
      } else if(code==47) {                                                                                                                   // forward slash
        e.preventDefault();
        $placeholder = $("<span class='placeholder'></span>");
        $placeholder.insertAfter($this);

        var rdm=Math.floor(Math.random()*1001);

        var $div = $("<span class='division'><span class='divisor' match='"+rdm+"'></span><span class='dividend' match='"+rdm+"'><span class='"+mX+" div' contenteditable='true'>"+space+"</span></span><span style='display:inline-block;width:0;' contenteditable='false'>&nbsp;</span></span>");

        var $last = $("<span></span>");

        if($(".mx-selected").length>0) {
          $(".mx-selected").each(function() {
            $(this).removeClass("mx-selected").removeClass('last-sel');
            $last.append($(this));
          }).promise().done(function() {
            $last = $last.children();
          })
        } else {
          if(operatorsAry.indexOf($(this).text())>-1 || 
             bracketsOpen.indexOf($(this).text())>-1 || 
             otherExc.indexOf($(this).text())>-1 || 
             trim($(this).text())==$("<div/>").html('&#8214;').text()) {
            $last = $("<span class='"+mX+"' id='"+mX+"' contenteditable='true'></span>");
          } else if(trim($(this).text())!='') {
            $last = $(this);
            $last = orderOperations($(this));
          } else {
            if(bracketsClosed.indexOf(trim($this.prev().text()))>-1) {
              $last = orderOperations($this.prev());
            } else if(operatorsAry.indexOf(trim($(this).text()))>-1) {
              $last = orderOperations($this.prev());
            } else {
              $last = orderOperations($(this));
            }
          }
        }

        if($(this).hasClass("arginput")) {
          $(this).attr("id","");
          $last.addClass('arginput');
        }

        if($(this).parents(".exp-holder").length>0) {
          $div.find(".div").addClass("exp");
          $last.addClass("exp");
        }
        if($(this).parents(".und-holder").length>0) {
          $div.find(".div").addClass("und");
          $last.addClass("und");
        }

        if($placeholder.index()==0) {
          // if this is the first box, add box before division table
          $("<span class='"+mX+"' contenteditable='true'></span>").insertBefore($placeholder);
        }
        $div.insertAfter($placeholder);
        $placeholder.remove();

        if($div.parents(".division").length==1) {
          $div.css("font-size",".7em");
        } else if($div.parents(".division").length>1) {
          $div.css("font-size",".5em");
        }

        if(trim($last.text())!='') {
          undo.push(['div',rdm]);
        }

        $div.find('.divisor').append($last);

        if(trim($div.find(".divisor").text())=='' || trim($div.find(".divisor").text())=='(') {
          $div.find(".divisor ."+mX+":first").html(space);
          placeCaretAtEnd($div.find(".divisor ."+mX+":first")[0]);
        } else {
          placeCaretAtEnd($div.find(".div:last")[0]);
        }

        relocateClose();
//        elemResize($(this));

        if(openBracket.length>0) {
          var h = $($div.height()).toEm();
          for (var i = openBracket.length - 1; i >= 0; i--) {
            var hsym = $($(this).height()).toEm();
            var htarg = (h/hsym);
            setTransform($("."+mX+"[match='"+openBracket[i]+"']"),200,200,htarg,1);
          };
        }
        return false;
      }


      if($(this).parents(".func-sub").length>0) {
        var w = $($(this).parents(".func-sub").width()).toEm();
        var wsym = $($(this).parents(".function").find(".func-sup").height()).toEm();
        var wtarg = (w/wsym)-.3;

        $(this).parents(".function").find(".func-sup").css("margin-left","-"+wtarg+"em");
      }

      if($(this).parents("."+mXc).height() > $("."+mXparent).height()) {
        $("."+mXparent).height($(this).parents("."+mXc).height()+40);
      }

      if($(this).attr("rendername") && $(this).text()=='') {
        $(this).attr("rendername","");
      }


      if (timeout){ clearTimeout(timeout); }

      if(/[\+\-\*\=]$/i.test(contents)) {                                                                                                  // operators
        endSearch();
        if($this.parents().hasClass("exp-holder")) {
          $t.addClass("exp");
        } else if($this.parents().hasClass("und-holder")) {
          $t.addClass("und");
        }

        if($this.parents(".func-box").length>0) {
          $t.addClass("arginput");

          if($this.hasClass("arghighlight")) {
            $this.removeClass("arghighlight");
          }
        }
        $t.css("padding","0 .2em");
        elemResize($(this));
      } else if(code==124) {                                                                                                              // pipes

        $placeholder = $("<span class='placeholder'></span>");
        $placeholder.insertBefore($this);

        if($this.parents(".func-box").length>0) {
          $t.addClass("arginput");

          if($this.hasClass("arghighlight")) {
            $this.removeClass("arghighlight");
          }
        }
        $t.css("padding","0 0 0 .05em").attr("data-type","closebrack").addClass('brack');
          
        $placeholder.remove();

        // open menu to offer enclosure
        makeMenu(randid, $this, dbpipe, '','');

      } else if(/\($/i.test(contents) || /\[$/i.test(contents) || /\{$/i.test(contents) || /\&lt;$/i.test(contents)) {            // open paren/bracket/brace
        endSearch();
        var rdm=Math.floor(Math.random()*1001);
        $t.attr("match",rdm).attr("data-type","openbrack").css("padding","0 0 0 .05em").addClass('brack');
        openBracket.push(rdm);

        if($t.nextAll().not("#aC-container").length>0 && trim($t.nextAll().not("#aC-container").text())!='') {
          var $placeholder = $("<span class='placeholder'></span>");
          $placeholder.insertBefore($t);

          var $nn = findBracketMatch($t,'next','loose');
          var $nnholder = $("<span class='brack-holder'></span>");

          $nnholder.append($nn);
          $nnholder.insertBefore($placeholder);
          $placeholder.remove();
            
          var $tt = $("<span class='"+mX+"' contenteditable='true'></span>");
          $tt.insertAfter($nnholder.find("span[data-type=openbrack]:first")).focus();
          placeCaretAtEnd($tt[0]);
          elemResize($t);

        } else {

        }

        if($this.parents('.exp-holder').length > 0) {
          $t.addClass("exp");
        } else if($this.parents('.und-holder').length > 0) {
          $t.addClass("und");
        }

        if($this.parents(".func-box").length>0) {
          $t.addClass("arginput");
        }

      } else if(/\)$/i.test(contents) || /\]$/i.test(contents) || /\}$/i.test(contents) 
          || /\>$/i.test(contents)) {                                                                                              // closed paran/bracket/brace/line
        $placeholder = $("<span class='placeholder'></span>");
        $placeholder.insertAfter($this);

        if($this.parents(".func-box").length>0) {
          $t.addClass("arginput");

          if($this.hasClass("arghighlight")) {
            $this.removeClass("arghighlight");
          }
        }
        $t.css("padding","0 0 0 .05em").attr("data-type","closebrack").addClass('brack');

        if($mX_elem.find("span[data-type=openbrack]").length==0) { // no open brackets

          return;

        } else {
          var $pp = findBracketMatch($t,'back','loose');

          if($pp.length>0) {
            var $ppholder = $("<span class='brack-holder'></span>");
            $ppholder.append($pp);
            if($ppholder.find("span[data-type=openbrack]:first").css("transform")!='none') {
              setTransform($ppholder.find("span[data-type=closebrack]:last"),200,200,getTransform($ppholder.find("span[data-type=openbrack]:first"),'height'),1);
            }

            if($placeholder.index()==0) {
              // if this is the first box, add box before open bracket
            }
            $ppholder.insertAfter($placeholder);
            var $tt = $("<span class='"+mX+"' contenteditable='true'></span>")
            $tt.insertAfter($ppholder).focus();
            placeCaretAtEnd($tt[0]);
            
            elemResize($ppholder);
          } else {
            $t.insertAfter($this);
            var $tt = $("<span class='"+mX+"' contenteditable='true'></span>");
            $tt.insertAfter($t).focus();
            placeCaretAtEnd($tt[0]);

          }
        }

        openBracket.pop();
        $placeholder.remove();
        endSearch(true);

        return false;
      } else if (e.keyCode != 27) {                                                                                                           // not esc
        /* trigger autocomplete search */
        elemResize($(this));
        timeout = setTimeout(function(){ 
          keyChange($t,srchstr); 
        }, 50);

        if (/[a-z0-9]{2,}$/i.test(srchstr)) {

        } else {
          endSearch(true);
        }
      } else {
        endSearch(true);
      }
    });


    /* override keys when specifying the number of rows/cols in matrix builder */
    $(document.body).on("keydown", ".mat-inp", function(e) {
      var code = (e.keyCode ? e.keyCode : e.which);

      if(code==9 && ($(".mat-inp[name='mat-cols']").is(":focus") || $(".mat-inp[name='mat-cols']").attr("type")=="hidden")) {
        var r = $(".mat-inp[name='mat-rows']").val();
        var c = $(".mat-inp[name='mat-cols']").val();
        if(r>10) {
          r=10;
        }
        if(c>10) {
          c=10;
        }
        var style = $(".mat-inp[name='mat-cols']").attr("func");
        buildMatrix(r,c,style);
        return false;
      } 
      if(code==13) {
        var r = $(".mat-inp[name='mat-rows']").val();
        var c = $(".mat-inp[name='mat-cols']").val();
        if(r>10) {
          r=10;
        }
        if(c>10) {
          c=10;
        }
        var style = $(".mat-inp[name='mat-cols']").attr("func");
        buildMatrix(r,c,style);
        return false;
      }

      // Allow: backspace, delete, tab, escape, enter and .
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
           // Allow: Ctrl+A
          (e.keyCode == 65 && e.ctrlKey === true) || 
           // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
               // let it happen, don't do anything
               return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }

    });

    /* primary key override for navigation keys */
    $mX_elem.on("keydown", "."+mX, function(e) {
      var code = (e.keyCode ? e.keyCode : e.which), $this = $("#"+mX);
      var code = (e.which);

      var caret = getCaretCharacterOffsetWithin($this[0]);
      var $edit = $("<span class='"+mX+" edit' contenteditable='true' data-srch=''></span>");

      if(code != 8) {
        undo.pop();
      }

      if (code == 13) {                       // ret
        if ($("#"+aCc).is(":visible") && $("#"+aCc+" .list-row-hover").index() > -1){
          $("#"+aCr+" .list-row-hover").click();
          return false;
        }
      }

      /* don't affect selected if pressing ctrl/shift/meta/alt/forward slash */
      if(!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && code!=191 && code!=111 && code!=46 && code!=8) {
        $("."+mXc+' .mx-selected').removeClass('mx-selected').removeClass('last-sel');
      }

      if((e.ctrlKey && code==65) || (e.metaKey && code==65)) {     // select all (ctrl-a)
        e.preventDefault();
        $clipboard = $("<span></span>");
        $("."+mX).each(function() {
          if($(this).parents(".func-holder").length>0) {
            $(this).parents(".func-holder").addClass("mx-selected");
          } else if($(this).parents(".exp-holder").length>0) {
            $(this).parents(".exp-holder").addClass("mx-selected");
          } else if($(this).parents(".und-holder").length>0) {
            $(this).parents(".und-holder").addClass("mx-selected");
          } else if($(this).parents(".division").length>0) {
            $(this).parents(".division").addClass("mx-selected");
          } else {
            $(this).addClass("mx-selected");
          }
        });
      } else if((e.ctrlKey && code==67) || (e.metaKey && code==67)) {     // copy (ctrl-c)
        e.preventDefault();
        $clipboard = $("<span></span>");

        $(".mx-selected").each(function() {
          if($(this).parents(".mx-selected").length>0) {
            $(this).removeClass('mx-selected');
          } else {
            $clipboard.append($(this).clone().wrap('<p>').parent().html());
          }
        })
      } else if((e.ctrlKey && code==88) || (e.metaKey && code==88)) {    // cut (ctrl-x)
        e.preventDefault();
        $clipboard = $("<span></span>");
        var $par;
        $(".mx-selected").each(function() {
          if($par == undefined) {
            $par = $(this).parents("."+mXc);
          }
          if($(this).parents(".mx-selected").length>0) {
            $(this).removeClass('mx-selected');
          } else {
            $clipboard.append($(this).clone().wrap('<p>').parent().html());
            $(this).remove();
          }
        }).promise().done( function(){
          if(trim($par.html())=='') {
            $par.append($mX);
            $mX.focus();
            placeCaretAtEnd($mX[0]);
          } else {
            $mX_elem.find("."+mX+":last").focus();
            placeCaretAtEnd($mX_elem.find("."+mX+":last")[0]);
          }

        } );
      } else if((e.ctrlKey && code==86) || (e.metaKey && code==86)) {    // paste (ctrl-v)
        e.preventDefault();
        var $paste = $("<span></span>");
        $paste.append($clipboard.html());
        $paste.find(".mx-selected").each(function() {
          if(!$(this).parents(".func-holder:first").hasClass('mx-selected')) {
            $(this).removeClass('arginput');
          }
        }).promise().done(function() {
          $paste.find("."+mX+":last").addClass('foc');
          var tar = $paste.html();
          $(tar).insertAfter($("#"+mX));
          elemResize($(".foc"));

          var $tt = $("<span class='mX' contenteditable='true'></span>");

          $tt.insertAfter(".mx-selected:last").focus();
          placeCaretAtEnd($tt[0]);
          $mX_elem.find(".mx-selected").removeClass('mx-selected');

          if($("#"+mX).parent().hasClass("mat-box")) {
            $("#"+mX).parent().addClass("mat-box-clear");
          }
          $(".foc").removeClass('foc');
        });
      }

      relocateClose();


      if ($("#"+aCc).is(":visible")) {
        /*override left, right, up, down, tab when search results are visible*/
        if (code == 37 || code == 39 || code == 9 || code == 40 || code == 38) {  /*left, right, down, up, tab*/
          if (timeout){ clearTimeout(timeout); }

          if (code == 40 || code == 39 || code==9) {                             /* down & right & tab*/
            if($("#"+aCc).find(".arrow_sm").length>0) {
              /*code for the arrow matrix*/
              if (code == 40) {                                                     /*down*/
                if($(".resultsingle").hasClass("resulttarget")) {
                  $(".resultsrow").animate({
                    top: "-=37"
                  })
                  $(".matrixsymbol").toggleClass("selector-row-hover");
                  $(".resulttarget").find(".list-row-hover").removeClass("list-row-hover").addClass("list-row-placeholder");
                  $(".resultsrow").removeClass("resulttarget");
                  $(".resultdouble").addClass("resulttarget");
                  $(".resulttarget").find(".list-row-placeholder").removeClass("list-row-placeholder").addClass("list-row-hover");
                  setNamerow($(".search_results"),$(".resultdouble .list-row-hover").attr("title"),$(".search_results").attr("data-str"));

                } else {
                  return false;                  
                }

              } else {                                                            /*right*/
                var i_search = $("#"+aCc+" .resulttarget .list-row-hover").index()+1;
                if(($("#"+aCc+" .resulttarget .symbol").length)==i_search) {
                  i_search=0;
                }

                $("#"+aCc+" .resulttarget .symbol").removeClass("list-row-hover").eq(i_search).addClass("list-row-hover");

                if($(".search_results").hasClass("search-left")) {
                  if($("#"+aCc+" .resulttarget .list-row-hover").index()==0) {
                    $(".search_results").removeClass('search-left_sec');
                  } else {
                    $(".search_results").addClass('search-left_sec');
                  }
                } else {
                  if($("#"+aCc+" .resulttarget .list-row-hover").index()==$(".search_results .resulttarget").find(".symbol").length-1) {
                    $(".search_results").removeClass('search-right_sec');
                  } else {
                    $(".search_results").addClass('search-right_sec');
                  }
                }

                setNamerow($(".search_results"),$(" .resulttarget .list-row-hover").attr("title"),$(".search_results").attr("data-str"));

                var max = ((parseInt($(".search_results").attr("data-num"))*50) + Math.abs(parseInt($(".resultsrow.resulttarget").css("left"))))/50;
                var min = Math.abs(parseInt($(".resultsrow.resulttarget").css("left"))/50);
//console.log("min: "+min+", max: "+(max-1)+", cur: "+i_search+", tot: "+$(".resulttarget .symbol").length);

                if(i_search>max-1) {
                  var n = parseInt($(".resultsrow.resulttarget").css("left"))-(parseInt($(".search_results").attr("data-num"))*50);
                }
                if(i_search==$(".resulttarget .symbol").length-1) {
                  var n = (-($(".resulttarget .symbol").length*50)+(parseInt($(".search_results").attr("data-num"))*50));
                }

//console.log(n);

                if(i_search==0) {
                  var n=0;
                }

                if(n!=undefined) {
                  $(".resultsrow.resulttarget").animate({
                    left: n
                  }, {
                    duration: 250,
                    easing: "swing"
                  });
                }
              }

            } else {
              /*code for generic db driven autocomplete*/
              var i_search = $("#"+aCc+" .list-row-hover").index()+1;
              if(($("#"+aCc+" .symbol").length)==i_search) {
                i_search=0;
              }
              $("#"+aCc+" .symbol").removeClass("list-row-hover").eq(i_search).addClass("list-row-hover");

              if($(".search_results").hasClass("search-left")) {
                if($("#"+aCc+" .list-row-hover").index()==0) {
                  $(".search_results").removeClass('search-left_sec');
                } else {
                  $(".search_results").addClass('search-left_sec');
                }
              } else {
                if($("#"+aCc+" .list-row-hover").index()==$(".search_results").find(".symbol").length-1) {
                  $(".search_results").removeClass('search-right_sec');
                } else {
                  $(".search_results").addClass('search-right_sec');
                }
              }
              if($(".search_results").hasClass("matmenu")) {
                var s = $(".search_results").attr("data-str");
                var it = $(".list-row-hover").attr("title").toLowerCase().indexOf(s)+s.length;
                var name = "<span class='resnamematch'>"+$(".list-row-hover").attr("title")+"</span>";
                setNamerow($(".search_results"),$(".list-row-hover").attr("title"),$(".search_results").attr("data-str"));
              } else {              
                setNamerow($(".search_results"),$(".list-row-hover").attr("title"),$(".search_results").attr("data-str"));
              }

              // only paginate if there are pages...
              if($(".resultsnav").length>0) {
                var max = ((parseInt($(".search_results").attr("data-num"))*50) + Math.abs(parseInt($(".resultsrow").css("left"))))/50;
                var min = Math.abs(parseInt($(".resultsrow").css("left"))/50);

                if(i_search>max-1) {
                  var n = parseInt($(".resultsrow").css("left"))-(parseInt($(".search_results").attr("data-num"))*50);
                }
                if(i_search==$(" .symbol").length-1) {
                  var n = (-($(" .symbol").length*50)+(parseInt($(".search_results").attr("data-num"))*50));
                }

                if(i_search==0) {
                  var n=0;
                }

                if(n!=undefined) {
                  $(".resultsrow").animate({
                    left: n
                  }, {
                    duration: 250,
                    easing: "swing"
                  });
                }
                
              }

            }
          } else if (code == 38 || code == 37) {                                    /*up & left*/
            if($("#"+aCc).find(".arrow_sm").length>0) {
              /*code for the arrow matrix*/

              if (code == 38) {                                                     /*up*/

                if($(".resultdouble").hasClass("resulttarget")) {
                  $(".resultsrow").animate({
                    top: "+=37"
                  })
                  $(".matrixsymbol").toggleClass("selector-row-hover");
                  $(".resulttarget").find(".list-row-hover").removeClass("list-row-hover").addClass("list-row-placeholder");
                  $(".resultsrow").removeClass("resulttarget");
                  $(".resultsingle").addClass("resulttarget");
                  $(".resulttarget").find(".list-row-placeholder").removeClass("list-row-placeholder").addClass("list-row-hover");
                  setNamerow($(".search_results"),$(".resultsingle .list-row-hover").attr("title"),$(".search_results").attr("data-str"));
                } else {
                  return false;                
                }

              } else {                                                                 /*left*/
                var i_search = $("#"+aCc+" .resulttarget .list-row-hover").index()-1;
                $("#"+aCc+" .resulttarget .symbol").removeClass("list-row-hover").eq(i_search).addClass("list-row-hover");
                if($(".search_results").hasClass("search-left")) {
                  if($("#"+aCc+" .resulttarget .list-row-hover").index()==0) {
                    $(".search_results").removeClass('search-left_sec');
                  } else {
                    $(".search_results").addClass('search-left_sec');
                  }
                } else {
                  if($("#"+aCc+" .resulttarget .list-row-hover").index() ==
                     $(".search_results").find(".symbol").length-1) {
                    $(".search_results").removeClass('search-right_sec');
                  } else {
                    $(".search_results").addClass('search-right_sec');
                  }
                }

                setNamerow($(".search_results"),$(" .resulttarget .list-row-hover").attr("title"),$(".search_results").attr("data-str"));

                var max = ((parseInt($(".search_results").attr("data-num"))*50) + Math.abs(parseInt($(".resultsrow.resulttarget").css("left"))))/50;
                var min = Math.abs(parseInt($(".resultsrow.resulttarget").css("left"))/50);

                if(i_search<min) {
                  var n = parseInt($(".resultsrow.resulttarget").css("left"))+(parseInt($(".search_results").attr("data-num"))*50);
                }
                if(i_search<0) {
                  var n = (-($(".resulttarget .symbol").length*50)+(parseInt($(".search_results").attr("data-num"))*50));
                }
                if(n>=0) {
                  var n=0;
                }

                if(n!=undefined) {
                  $(".resultsrow.resulttarget").animate({
                    left: n
                  }, {
                    duration: 250,
                    easing: "swing"
                  });
                }
              }
            } else {
              /*code for generic db driven autocomplete*/
              var i_search = $("#"+aCc+" .list-row-hover").index()-1;
              $("#"+aCc+" .symbol").removeClass("list-row-hover").eq(i_search).addClass("list-row-hover");
              if($(".search_results").hasClass("search-left")) {
                if($("#"+aCc+" .list-row-hover").index()==0) {
                  $(".search_results").removeClass('search-left_sec');
                } else {
                  $(".search_results").addClass('search-left_sec');
                }
              } else {
                if($("#"+aCc+" .list-row-hover").index()==$(".search_results").find(".symbol").length-1) {
                  $(".search_results").removeClass('search-right_sec');
                } else {
                  $(".search_results").addClass('search-right_sec');
                }
              }

              if($(".search_results").hasClass("matmenu")) {
                setNamerow($(".search_results"),$(".list-row-hover").attr("title"),$(".search_results").attr("data-str"));
              } else {              
                setNamerow($(".search_results"),$(".list-row-hover").attr("title"),$(".search_results").attr("data-str"));
              }
              $("#"+aCc).find(".namerow").html(name);

              var max = ((parseInt($(".search_results").attr("data-num"))*50) + Math.abs(parseInt($(".resultsrow").css("left"))))/50;
              var min = Math.abs(parseInt($(".resultsrow").css("left"))/50);

              if(i_search<min) {
                var n = parseInt($(".resultsrow").css("left"))+(parseInt($(".search_results").attr("data-num"))*50);
              }
              if(i_search<0) {
                var n = (-($(".symbol").length*50)+(parseInt($(".search_results").attr("data-num"))*50));
              }
              if(n>=0) {
                var n=0;
              }

              if(n!=undefined) {
                $(".resultsrow").animate({
                  left: n
                }, {
                  duration: 250,
                  easing: "swing"
                });
              }

            }
          }
          return false;
        }
        
      }


  /* Over/Under code */
      if(code==79 && e.shiftKey && e.ctrlKey) {   // over
        if($(this).prev().hasClass("underover")) {

        } else {
          var $placeholder = $("<span class='placeholder'></span>");
          var $over = $("<span class='function underover-holder overunder' func='over'><span class='above target argument argument-exp'></span><span class='below argument'></span></span>");
          $placeholder.insertBefore($this);
          var $last = orderOperations($this,'overunder');

          $last.addClass("arginput");
          var $next = $("<span class='"+mX+" arginput' contenteditable='true'></span>");
          $over.find(".below").append($last);
          $over.find(".above").append($next);
          $over.find("."+mX+":first").html(space);
          $over.insertAfter($placeholder);
          placeCaretAtEnd($over.find("."+mX+":first")[0]);
          $placeholder.remove();
        }
        relocateClose();
        return false;
      } else if(code==85 && e.shiftKey && e.ctrlKey) {    // under
        var $placeholder = $("<span class='placeholder'></span>");
        $placeholder.insertBefore($this);
        var $last = orderOperations($(this),'overunder');
        $last.addClass("arginput");
        var $over = $("<span class='function underover underover-holder' func='under' style='min-width:0px;'><span class='above argument'></span><soan class='below target argument'></span></span>");
        $over.insertAfter($placeholder);
        var $next = $("<span class='"+mX+" arginput' contenteditable='true'></span>");
        $over.find(".above").append($last);
        $over.find(".below").append($next);
        $over.find("."+mX+":last").html(space);
        placeCaretAtEnd($over.find("."+mX+":last")[0]);
        $placeholder.remove();
        relocateClose();
        return false;
      }


      if(code==37 && e.shiftKey) {  // left
        e.preventDefault();
        highlightPrev($this,caret);
        return false;
      }

      if(code==36 && e.shiftKey) { // home
        e.preventDefault();
        highlightPrev($this,caret,'all');
        return false;
      }

      if(code==35 && e.shiftKey) { // end
        e.preventDefault();
        highlightNext($this,caret,'all');
        return false;
      }

      if(code==39 && e.shiftKey) {  // right
        e.preventDefault();
        highlightNext($this,caret);
        return false;
      }


      if(code==40) {                                                // down
        e.preventDefault();
        if($(this).parent(".exp-holder").length>0 || $(this).parent(".above").length>0 || $(this).parent(".func-sup").length>0 || $(this).parent(".func-over").length>0) {
          if($this.index()==0 && $this.text()=='') {
            findPrev($this);
          } else {
            cycleMath($(this));
          }
        } else if($(this).parent(".divisor").length>0) {
          if($(this).index()==0) {
            $edit.insertBefore($(this).parent(".divisor").parent(".division").find(".dividend:first>."+mX+":first")).focus();
            placeCaretAtEnd($edit[0]);
          } else if($(this).parent(".divisor").text().length>1) {
            var div = 0;
            $(this).parent(".divisor").find("span").each(function() {
              if($(this)[0]===$this[0]) {
                div = div + $(this).text().length;
                return false;
              } else {
                div = div + $(this).text().length;
              }
            })
            if($(this).parent(".divisor").parent(".division").find(".dividend").text().length<=div) {
              $edit.insertAfter($(this).parent(".divisor").parent(".division").find(".dividend:first>."+mX+":last")).focus();
              placeCaretAtEnd($edit[0]);
            } else {
              var dvd = 0;
              $(this).parent(".divisor").parent(".division").find(".dividend ."+mX).each(function() {
                dvd = dvd + $(this).text().length;
                if(dvd>=div) {
                  $edit.insertAfter($(this)).focus();
                  placeCaretAtEnd($edit[0]);
                  return false;
                }
              })
            }
          } else {
            $edit.insertBefore($(this).parent(".divisor").parent(".division").find(".dividend:first>."+mX+":first")).focus();
            placeCaretAtEnd($edit[0]);

          }
        } else if($(this).parent().hasClass("mat-box")) {
          var r_eq = $(this).parents(".mat-col:first").index()+1;
          var c_eq = $(this).parents(".mat-box:first").index();
          if($(this).parents(".matcontents:first").find(".mat-col").eq(r_eq).length>0) {
            $(this).parents(".matcontents:first").find(".mat-col").eq(r_eq).find(".mat-box").eq(c_eq).find("."+mX).focus();
            placeCaretAtEnd($(this).parents(".matcontents:first").find(".mat-col").eq(r_eq).find(".mat-box").eq(c_eq).find("."+mX)[0]);

          }
          return false;
        } else if($(this).next().hasClass("und-holder")) {
          findNext($(this));
          return false;
        } else if($(this).next().hasClass("division")) {
          $edit.insertBefore($(this).next().find(".dividend ."+mX+":first")).focus();
          placeCaretAtEnd($edit[0]);
          return false;
        }
      }

      if(code==38) {                                                // up
        e.preventDefault();
        if($(this).parent(".und-holder").length>0 || $(this).parent(".under").length>0 || $(this).parent(".func-sub").length>0 || $(this).parent(".func-under").length>0) {
          if($this.index()==0 && $this.text()=='') {
            findPrev($this);
          } else {
            cycleMath($(this));
          }
        } else if($(this).parent(".dividend").length>0) {
          if($(this).index()==0 && $(this).text()=='') {
            $edit.insertBefore($(this).parent(".dividend").parent(".division").find(".divisor:first>."+mX+":first")).focus();
            placeCaretAtEnd($edit[0]);
          } else if($(this).parent(".dividend").text().length>1) {
            var div = 0;
            $(this).parent(".dividend").find("span").each(function() {
              if($(this)[0]===$this[0]) {
                div = div + $(this).text().length;
                return false;
              } else {
                div = div + $(this).text().length;
              }
            })
            if($(this).parent(".dividend").parent(".division").find(".divisor").text().length<=div) {
              $edit.insertAfter($(this).parent(".dividend").parent(".division").find(".divisor:first>."+mX+":last")).focus();
              placeCaretAtEnd($edit[0]);

            } else {
              var dvd = 0;
              $(this).parent(".dividend").parent(".division").find(".divisor ."+mX).each(function() {
                dvd = dvd + $(this).text().length;
                if(dvd>=div) {
                  $edit.insertAfter($(this)).focus();
                  placeCaretAtEnd($edit[0]);
                  return false;
                }
              })
            }
          } else {

            $edit.insertBefore($(this).parent(".dividend").parent(".division").find(".divisor:first>."+mX+":first")).focus();
            placeCaretAtEnd($edit[0]);
          }
        } else if (caret==0 && ($(this).parent(".und-holder").length>0 || $(this).parent(".argument-exp").length>0 || $(this).parent(".dividend").length>0) || $(this).prev().hasClass('exp-holder')) {
          findPrev($(this));
          return false;
        } else if($(this).prev().hasClass("division")) {
          placeCaretAtEnd($(this).prev().find(".divisor ."+mX+":last")[0]);
          return false;
        } else if($(this).parent().hasClass("mat-box")) {
          var r_eq = $(this).parents(".mat-col:first").index()-1;
          var c_eq = $(this).parents(".mat-box:first").index();
          if($(this).parents(".matcontents:first").find(".mat-col").eq(r_eq).length>0) {
            $(this).parents(".matcontents:first").find(".mat-col").eq(r_eq).find(".mat-box").eq(c_eq).find("."+mX).focus();
            placeCaretAtEnd($(this).parents(".matcontents:first").find(".mat-col").eq(r_eq).find(".mat-box").eq(c_eq).find("."+mX)[0]);
          }
          return false;
        } else if($(this).next().hasClass("exp-holder") || $(this).next().hasClass("division")) {
          findNext($(this));
          return false;
        } 
      }


      if(code == 37 || (e.shiftKey && code==9)) {                      // left or shift-tab
        e.preventDefault();
        findPrev($this);
        return false;
      } else if ((code == 39 || code == 9)) {                          // RIGHT ARROW or Tab
        e.preventDefault();
  /* primary render / maneuvering keys */
        if($(this).hasClass("arghighlight")) {
          $(this).removeClass("arghighlight");
        }

        if(code == 39) {                                                // right arrow
        e.preventDefault();
          if($(this).next().hasClass(mX)) {
            findNext($this,"right arrow");
            return false;
          } else if(caret!=trim($(this).text()).length) {
            if($(this)[0]===$(this).parents("."+mXc).find("."+mX+":last")[0] && $(this).parent().hasClass(mXc)) {
              cycleMath($(this));
              return false;
            } else {
              return;
            }
          } else if($(this)[0]===$(this).parents("."+mXc).find("."+mX+":last")[0] && $(this).parent().hasClass(mXc)) {
              cycleMath($(this));
              return false;
          } else if($(this).parent(".exp-holder").length>0 || $(this).parent(".und-holder").length>0 || $(this).parent(".below").length>0
              || $(this).parent(".above").length>0) {
            if($(this).parent().next().length>0) {
              findNext($this,"right arrow");
              return false;
            } 
          } else if ($(this).parent(".dividend").length>0) {
            if($(this).parent().parent().next().length>0) {
              findNext($this,"right arrow");
              return false;
            } else {
              cycleMath($(this));
              return false;
            }
          } else if($(this).parent(".argument").length>0 && $(this).parent(".argument").attr("order")==1 && $(this).parent(".argument-exp").length==0) {
            $(this).parents(".arguments-table:first").find(".argument-exp ."+mX+":first").focus();
            placeCaretAtEnd($(this).parents(".arguments-table:first").find(".argument-exp ."+mX+":first")[0]);
            return false;
          } else if($(this).parent(".func-max").length>0) {
            cycleMath($(this));
            return false;
          } else {
            findNext($this,"right arrow");
            return false;
          }
        }

        if(code==9 && (trim($(this).next().text())!='' || 
                       trim($(this).next().next().text())!='')) {    // TAB and next boxes aren't empty 
          if(caret!=$(this).html().length) {
            return;
          }
          findNext($this,"tab");
          return false;
        } else if(($(this).parent(".exp-holder").length>0 && $(this).parent(".exp-holder").next().text()!='') || 
            ($(this).parent(".und-holder").length>0 && $(this).parent(".und-holder").next().text()!='')) {
          findNext($this,"tab");
          return false;
        }

        cycleMath($(this));

        return false;
      } else if (code == 13) {                                                // Return
        e.preventDefault();
        return false;
      } else if (code == 8) {                                                 // BACKSPACE
        e.preventDefault();
        if($(".mx-selected").length>0) {
          endSearch();
          var $par = $this.parents("."+mXc);
          $(".mx-selected").remove();
          if($("."+mX).length>0) {
            placeCaretAtEnd($("."+mX+":last")[0]);
          } else {
            $par.append($("<span class='"+mX+"' contenteditable='true'></span>"));
            placeCaretAtEnd($("."+mX+":last")[0]);
            return false;
          }
        } else {
          // 2-step division
          if(undo.length>0 && undo[undo.length-1][0]=='div') {
            var $div = $(".divisor[match="+undo[undo.length-1][1]+"]");
            var $e = $(".divisor[match="+undo[undo.length-1][1]+"]").children();
            $div.html("<span class='"+mX+"' contenteditable=true>"+space+"</span>");
            $e.insertBefore($div.parent(".division"));
            $div.find("."+mX).focus();
            placeCaretAtEnd($div.find("."+mX)[0]);
            undo.pop();
          } else if(undo.length>0 && undo[undo.length-1][0]=='rom') {

            // undo romanize
            var i = undo[0][1].length,j=0;

            $(".cursrch").reverse().each(function() {
              if(j==i) {
                return false;
              }
              if(undo[0][1].indexOf($(this).text())>-1 && trim($(this).text())!='') {
                j++;
                $(this).html($(this).attr("data-code")).removeClass("romanize");
              }
            })

            placeCaretAtEnd($(".cursrch:last")[0]);
            undo.pop();
            return false;
          } else if(undo.length>0 && undo[undo.length-1][0]=='auto') {

            // undo auto insertion
            var ut = $(undo[undo.length-1][1]).attr("undo");

            var $targ = $(undo[undo.length-1][1]).addClass("target");
            for (var i = 0; i < ut.split(",").length; i++) {
              var $new = $("<span class='"+mX+"' contenteditable='true'></span>");

              var ch = ut.split(",")[i];

              if(charMap(ch)==undefined) {
                $new.html(ut.split(",")[i]);

                // WRITE CODE TO HANDLE CHARACTER NOT IN THE charMap()

              } else {
                if(/[A-Z,a-z]$/i.test(ch)) {
                  var ds = ch;
                } else {
                  var ds = String.fromCharCode(ch);
                }
                $new.html(charMap(ut.split(",")[i])[0]).css("padding",charMap(ut.split(",")[i])[1]).attr("data-srch",ds);
              }

              $new.insertAfter($targ);
              $targ = $new;
            };

            placeCaretAtEnd($targ[0]);
            $(".target").remove();
            undo.pop();
            return false;
          } else {
            findPrev($this,"backspace");
            return false;
          }
        }
      } else if(code==46) {                                                   //  DELETE
        e.preventDefault();
        if($this.parents("."+mXc).text().trim().replace(space,'')=='' || 
           $this.parents("."+mXc).text().trim()==space) {
          $this.parents(".mm-container").find("br:last").remove();
          $("."+mXparent).attr("contenteditable","true").find("p").append(space);
          $("."+mXparent).focus();
          placeCaretAtEnd($("."+mXparent)[0]);

          $this.parents("."+mXc).remove();
          $closeBtn.remove();
          togglemX=0;
          
          return false;
        } else if($(".mx-selected").length>0) {
          var $par = $this.parents("."+mXc);
          $(".mx-selected").remove();        
          if($("."+mX).length>0) {
            placeCaretAtEnd($("."+mX+":last")[0]);
          } else {
            $par.append($("<span class='"+mX+"' contenteditable='true'></span>"));
            placeCaretAtEnd($("."+mX+":last")[0]);
            return false;
          }
        } 
      } else if(code==27) {                                               //  ESCAPE
        // if no math text, remove MM
        if($this.parents("."+mXc).text().trim().replace(space,'')=='' || 
           $this.parents("."+mXc).text().trim()==space) {
          if(settings.mathModeOnly==true) {
            return false;
          } else {
            $this.parents("."+mXparent).find("br:last").remove();

            $this.parents("."+mXc).remove();
            $closeBtn.remove();
            togglemX=0;

            $("."+mXparent).attr("contenteditable","true").find("p").append(space);
            $("."+mXparent).focus();
            placeCaretAtEnd($("."+mXparent)[0]);

          }
          
          return false;
        } else if($("#"+aCc).is(":visible")) {
          // if any menu is visible, hide it
          endSearch();
        } else {
          // otherwise just exit math
          $this.attr("id","");
          if(settings.mathModeOnly==true) {
            return false;
          } else {
            exitmX($this,'');
          }
          return false;
        }
      } else if(code==35) {                                                     //  END
        $(".edit").not($this).remove();
        $this.parents("."+mXc).append($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);
      } else if(code==36) {                                                     //  HOME
        $(".edit").not($this).remove();
        $this.parents("."+mXc).prepend($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);
      }

    });



    // check matrix boxes to see if empty
    $(document.body).on("keyup", ".mat-box", function(e) {
      if(trim($(this).text())=='') {
        $(this).removeClass("mat-box-clear");
      }
    });


    $mXparent.on("click", ".resultsnav.rightnav", function(e) {
      var num_sumbols = parseInt($(".search_results").attr("data-num"));
      var l = -parseInt($(".resultsrow.resulttarget").css("left"));
      var maxl = $(".resultsrow.resulttarget").width()-num_sumbols*50;

      if((l+num_sumbols*50)>maxl && l!=maxl) {
        var n = -maxl;
      } else if (l==maxl) {
        var n = 0;
      } else {
        var n = -l-num_sumbols*50;
      }

      if(n!=undefined) {
        var eq = (-n/50).toFixed(0);
        $(".resultsrow.resulttarget").animate({
          left: n
        }, {
          duration: 250,
          easing: "swing"
        });
      }

      $(".resultsrow.resulttarget .symbol").removeClass("list-row-hover");
      $(".resultsrow.resulttarget .symbol").eq(eq).addClass("list-row-hover");

      setNamerow($(".search_results"),$(".list-row-hover").attr("title"),$(".search_results").attr("data-str"));

      $("#"+mX).focus();
      placeCaretAtEnd($("#"+mX)[0]);
    });


    $mXparent.on("click", ".resultsnav.leftnav", function(e) {
      var num_sumbols = $(".search_results").attr("data-num");
      var l = -parseInt($(".resultsrow.resulttarget").css("left"));
      var maxl = $(".resultsrow.resulttarget").width()-num_sumbols*50;

      if((l-num_sumbols*50)<0 && l!=0) {
        var n = 0;
      } else if (l==0) {
        n = -maxl;
      } else {
        var n = -l+num_sumbols*50;
      }

      if(n!=undefined) {
        var eq = (-n/50).toFixed(0);
        $(".resultsrow.resulttarget").animate({
          left: n
        }, {
          duration: 250,
          easing: "swing"
        });
      }

      $(".resultsrow .symbol").removeClass("list-row-hover");
      $(".resultsrow .symbol").eq(eq).addClass("list-row-hover");

      setNamerow($(".search_results"),$(".list-row-hover").attr("title"),$(".search_results").attr("data-str"));

      $("#"+mX).focus();
      placeCaretAtEnd($("#"+mX)[0]);
    });


    /* code for shift-left or ctrl-home */
    function highlightPrev($elem,caret,type) {
      var $sel = $(".last-sel:first");
      $(".last-sel").removeClass('last-sel');

      if(type=='all') {
        if($sel.length==0) {
          $elem.addClass('mx-selected');
        }
        $elem.prevAll().addClass('mx-selected');
        $(".mx-selected:first").addClass("last-sel");
      } else {
        if($sel.length==0) {
          $elem.addClass('mx-selected').addClass("last-sel");
        } else {
          if($sel[0]===$(".mx-selected:first")[0]) {
            if($sel.prev().hasClass(mX)) {
              $sel.prev().addClass('mx-selected').addClass("last-sel");
            } else if($sel.prev().hasClass("division") || $sel.prev().hasClass("func-holder")) {
              $sel.prev().addClass('mx-selected').addClass("last-sel");
            } else if($sel.prev().hasClass("exp-holder")) {
              $sel.prev().addClass('mx-selected');
              $sel.prev().prev().addClass('mx-selected').addClass("last-sel");
            } else if($sel.prev().hasClass("und-holder")) {
              $sel.prev().addClass('mx-selected');
              $sel.prev().prev().addClass('mx-selected').addClass("last-sel");
            }
          } else {
            $sel.removeClass('mx-selected');
            $(".mx-selected:last").addClass('last-sel');
          }
        }
      }
    }

    /* code for shirt-right or ctrl-end */
    function highlightNext($elem,caret,type) {
      var $sel = $(".last-sel:last");
      $(".last-sel").removeClass('last-sel');
      if(type=='all') {
        if($sel.length==0 && caret==0) {
          $elem.addClass('mx-selected');
        }
        $elem.nextAll().addClass('mx-selected');
        $(".mx-selected:last").addClass("last-sel");
      } else {
        if($sel.length==0) {
          if(caret==0) {
            $elem.addClass('mx-selected').addClass("last-sel");
          } else {
            $elem.next().addClass('mx-selected').addClass("last-sel");
          }
        } else {
          if($sel[0]===$(".mx-selected:last")[0]) {
            if($sel.next().hasClass(mX)) {
              $sel.next().addClass('mx-selected').addClass("last-sel");
            } else if($sel.next().hasClass("division") || $sel.next().hasClass("func-holder")) {
              $sel.next().addClass('mx-selected').addClass("last-sel");
            } else if($sel.next().hasClass("exp-holder")) {
              $sel.next().addClass('mx-selected').addClass("last-sel");
            } else if($sel.next().hasClass("und-holder")) {
              $sel.next().addClass('mx-selected').addClass("last-sel");
            }
          } else {
            $sel.removeClass('mx-selected');
            $(".mx-selected:first").addClass('last-sel');
          }
        }
      }
    }

    /* unrender rendered mathjax for editing */
    function unrenderMML($elem) {
      togglemX=1;
      $this = $elem;

      var $math = $($this.attr('ms-unrendered-html'));
      $math.insertAfter($this);

      $this.remove();

      $closeBtn.insertAfter($math.parents("."+mXc));
      $math.parents("."+mXc).find("."+mX).attr("contenteditable","true");
      $math.parents("."+mXc).removeClass("math-container-rendered").find("."+mX+":last").focus();
      placeCaretAtEnd($math.parents("."+mXc).removeClass("math-container-rendered").find("."+mX+":last")[0]);
      relocateClose();
    }

    $mX_elem.on("click", ".rendered-mathscript", function() {
      unrenderMML($(this));
    });


    /* nav function for progressing back through equation */
    function findPrev($elem,$key,$remove) {
      var $this = $elem,noback=0,$t;
      var caret = getCaretCharacterOffsetWithin($this[0]);
      var $edit = $("<span class='"+mX+" edit' contenteditable='true' data-srch=''></span>");
      if($remove!=undefined) {
        if($remove.index()==0) {
          $edit.insertBefore($remove);
          $edit.focus();
          placeCaretAtEnd($edit[0]);
          $remove.remove();
          return false;
        } else {
          $remove.remove();
        }
      }

      if($this.prev().hasClass("brack-holder")) {

        if($key=='backspace') {
          $t = $this.prev();

          $t.addClass("targ");

          if($(".targ span[data-type=openbrack]:first").css("transform")!='none') {
            $(".targ span[data-type=openbrack]:first").css("transform","none");
          }

          $(".targ span[data-type=closebrack]:last").remove();
          $(".targ span.mX:last").addClass("f");
          $(".targ").children().insertAfter($this);
          $edit.insertAfter(".f").focus();
          placeCaretAtEnd($edit[0]);
          $(".f").removeClass('f');

          $(".targ").remove();

        } else {
          if($this.text()=='') {
            $t = $this.prev().find("."+mX+":last");
          } else {
            $t = $this;
          }

          $edit.insertBefore($t).focus();
          placeCaretAtEnd($edit[0]);
        }
        return false;
      }

      if($this.prev().hasClass(mX)) {
        if(trim($this.text())=='' || $this.text().charCodeAt(0)==8) {
          $t = $this.prev();
        } else {
          $t = $this;
        }
        $(".edit").not($t).remove();

        $edit.insertBefore($t);

        if($key=='backspace') {
          $t.remove();
        }
        if($this.hasClass('func-holder') && trim($this.text())=='') {
          $elem.remove();
        }

        buildSearchString($edit);
        keyChange($edit,srchstr);

        elemResize($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);
        return false;
      } else if($this.parent().hasClass("exp-holder")) {
        if($this.index()==0 && $key=='backspace') {
          if($this.text()=='') {
            findPrev($this.parents(".exp-holder:first"),$key);
          } else {
            $this.html('').focus();
            placeCaretAtEnd($this[0]);
            return false;
          }
        } else {
          findPrev($this.parents(".exp-holder:first"),$key);
        }
      } else if($this.parent().hasClass("und-holder")) {
        if($this.index()==0 && $key=='backspace') {
          if($this.text()=='') {
            findPrev($this.parents(".und-holder:first"),$key);
          } else {
            $this.html('').focus();
            placeCaretAtEnd($this[0]);
            return false;
          }
        } else {
          findPrev($this.parents(".und-holder:first"),$key);
        }
      } else if($this.prev().hasClass("exp-holder") || $this.prev().hasClass("und-holder")) {
        $this.prev().append($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);

        if($key=="backspace") {
          if($this.text()!='') {
            $this.remove();
          }
        }
        return false;
      } else if($this.prev().hasClass("division")) {
        if($key=="backspace" && $this.text()!='') {
          $this.html('').attr("data-srch","").css("padding","0").focus();
          placeCaretAtEnd($this[0]);

          noback=1;
        } else {
          var match = $this.prev().find(".divisor:first").attr("match");
          $this.prev().find(".dividend[match="+match+"]").append($edit);
          $edit.focus();
          placeCaretAtEnd($edit[0]);
        }
      } else if($this.prev().hasClass("function") || $this.prev().hasClass("func-holder")) {
        if($key=="backspace" && trim($this.text())!='') {
          $this.html('').attr("data-srch","").css("padding","0").focus();
          placeCaretAtEnd($this[0]);
          noback=1;
        } else {      
          for (var i = 16; i > 0; i--) {
            if($this.prev().find(".func-box[order="+i+"]").length>0) {
              if(caret>0) {
                $edit.insertBefore($this).focus();
                placeCaretAtEnd($edit[0]);
              } else {
                $this.prev().find(".func-box[order="+i+"]").append($edit);
              }
              $edit.focus();
              placeCaretAtEnd($edit[0]);
              break;
            }
          };
        }

      } else if($this.parent().hasClass("brack-holder")) {
        $edit.insertBefore($this.parent()).focus();
        placeCaretAtEnd($edit[0]);
        return false;
      } else if($this.hasClass("argument")) {
        $this.find("."+mX+":first").focus();
        placeCaretAtEnd($this.find("."+mX+":first")[0]);
      } else if($this.hasClass("func-holder")) {

        $edit.insertBefore($this).focus();
        placeCaretAtEnd($edit[0]);
        return false;

        $this.parents(".function").find(".func-box[order="+i+"]").each(function() {
          if($(this).parents(".func-holder:first")[0]!=$this[0]) {
            if($elem.text().trim()=='' && $key=="backspace") {
              noback = 1;
              $elem.remove();
              relocateClose();
            }

            $(this).append($edit);
            $edit.focus();
            placeCaretAtEnd($edit[0]);
            return false;
          }
        })
      } else if($this.parent().hasClass("dividend") && $this.index()==0) {
        if($key=='backspace') {
          if($this.text()=='') {
            noback = 1;
            $this.parents(".division:first").find(".divisor").find('.'+mX+":last").addClass("targ");
            var $div = $($this.parents(".division:first").find(".divisor").html());
            $div.insertBefore($this.parents(".division:first"));
            placeCaretAtEnd($(".targ")[0]);
            $(".targ").removeClass('targ');
            $this.parents(".division:first").remove();
            relocateClose();
            return false;
          } else {
            $this.html('').focus();
            placeCaretAtEnd($this[0]);
            return false;
          }
        } else {
          $this.parents(".division:first").find(".divisor").append($edit);
          $edit.focus();
          placeCaretAtEnd($edit[0]);
        }
      } else if($this.parent().hasClass("func-box") && $this.index()==0) {
        var i = $this.parents(".func-box:first").attr("order");
        i = i - 1;
        if($this.hasClass("func-holder")) {

          $this.parents(".function").find(".func-box[order="+i+"]").each(function() {
            if($(this).parents(".func-holder:first")[0]!=$this[0]) {
              if($elem.text().trim()=='' && $key=="backspace") {
                noback = 1;
                $elem.remove();
                relocateClose();
              }

              $(this).append($edit);
              $edit.focus();
              placeCaretAtEnd($edit[0]);
              return false;
            }
          })
        } else if(i==0) {
          if(($this.parents(".function:first").text().trim()=='' || 
            $this.parents(".function:first").text().trim()==$this.parents(".function:first").find('.func-symbol').text().trim()) && $key=='backspace') {
            noback = 1;
            if($this.parents(".func-holder").length>0) {
              if($this.hasClass("division") && ($this.text().trim()=='/' || $this.text().trim()=='/')) {
                findPrev($this.parents(".func-box:first"),$key,$elem);
              } else {
                findPrev($this.parents(".func-holder:first"),$key,$this.parents(".func-holder:first"));
              }
            } else {
              findPrev($this.parents(".function:first"),$key);
            }
            return false;
          } else if($this.parents(".func-holder:first").length>0 && $key=='backspace') {
            if($this.text()!='') {
              $this.html('');
              return false;
            } 
            findPrev($this.parents(".func-holder:first"),$key);
            elemResize($this);
          } else {

            findPrev($this.parents(".func-holder:first"),$key);
            elemResize($this);
          }
        } else {
          $this.parents(".function").find(".func-box[order="+i+"][data-id="+$this.parents(".function").attr("data-id")+"]").each(function() {
            if($(this).parents(".function:first")[0]==$this.parents(".function:first")[0]) {
              if($key=='backspace') {
                if($this.text()=='') {
                  
                } else {
                  $this.html('');
                  return false;
                }
              }
              $this.parents(".function:first").find(".func-box[order="+i+"]:first").append($edit);
              $edit.focus();
              placeCaretAtEnd($edit[0]);
              return false;
            }
            return false;
          })
          return false;
        }
      } else if($this.parent().hasClass("divisor") && $this.index()==0) {
          findPrev($this.parents(".division:first"),$key);
      } else if($this.prev().length<=0) {

        if(trim($elem.parents("."+mXc).text())=='') {
          if(settings.mathModeOnly==true) {
            endSearch();
            return false;
          } else {
            $("."+mXparent).attr("contenteditable","true").focus();
            placeCaretAtEnd($("."+mXparent)[0]);

            $elem.parents("."+mXc).remove();
            $closeBtn.remove();
            togglemX=0;
          }
          endSearch();
          return false;
        } else {
          if($key!='backspace') {
            var v = $("."+mX+":first").html();
            $("."+mX+":first").html("").focus().html(v);
            placeCaretAtEnd($("."+mX+":first")[0]);
            return false;
          } else {
            endSearch();
            $this.html('');
          }
        }
      } else {
        findPrev($this.prev(),$key);
      }

      if($elem.parents(".function:first").length>0 && (trim($elem.parents(".function:first").text())=='') && $key=='backspace') {
        noback = 1;
        $elem.parents(".function:first").remove();
      }
      if($elem.parents(".division:first").length>0 && (trim($elem.parents(".division:first").text())=='' || $elem.parents(".division:first").text().trim()=='/') && $key=='backspace') {
        noback = 1;
        $elem.parents(".division:first").remove();
      }
      if($elem.parents(".exp-holder:first").length>0 && (trim($elem.parents(".exp-holder:first").text())=='') && $key=='backspace') {
        //noback = 1;
        $elem.parents(".exp-holder:first").prev().removeAttr('subsup');
        $elem.parents(".exp-holder:first").remove();
      }
      if($elem.parents(".und-holder:first").length>0 && (trim($elem.parents(".und-holder:first").text())=='') && $key=='backspace') {
        noback = 1;
        $elem.parents(".und-holder:first").prev().removeAttr('subsup');
        $elem.parents(".und-holder:first").remove();
      }

      relocateClose();
    }   // findPrev()


    /* nav function for figuring out where cursor should go next.  mostly used with tab key */
    function cycleMath($elem,$key) {
      var $next;
//console.log("cycle");

      if($elem.parent(".exp-holder").length>0 && trim($elem.text()=='')) {
        $next = $("<span class='"+mX+" exp' contenteditable='true'></span>");
      } else if($elem.parent(".und-holder").length>0 && trim($elem.text()=='')) {
        $next = $("<span class='"+mX+" und' contenteditable='true'></span>");
      } else {
        $next = $("<span class='"+mX+"' contenteditable='true'></span>");
      }

      $next.html(space);

      if($elem.parent(".func-box").length>0) {
        var ord = parseInt($elem.parents(".func-box:first").attr("order"),10);
        var ordmax = 0;
        $elem.parents(".function:first").find(".func-box[data-id="+$elem.parents(".function:first").attr("data-id")+"]").each(function() {
          if(parseInt($(this).attr("order"),10)>ordmax) {
            ordmax = parseInt($(this).attr("order"),10);
          }
        });

        if($elem.parent(".exp-holder").length>0) {
          $next.insertAfter($elem.parent(".exp-holder"));
          placeCaretAtEnd($next[0]);
          return false;
        } else if($elem.parent(".und-holder").length>0) {
          $next.insertAfter($elem.parent(".und-holder"));
          placeCaretAtEnd($next[0]);
          return false;
        }
        if($elem.parent(".func-exp").length>0 || $elem.parent(".func-holder").parent(".func-exp").length>0 || ord==ordmax) {

          if($elem.parents(".function").parent().hasClass("func-holder")) {
            $next.insertAfter($elem.parents(".function:first").parent(".func-holder"));
            if(trim($elem.text())=='' && $elem.index()>0) {
              $elem.remove();
            }
            placeCaretAtEnd($next[0]);
            return false;
          } else {
            $next.insertAfter($elem.parents(".function"));
            if(trim($elem.text())=='' && $elem.index()>0) {
              $elem.remove();
            }
            placeCaretAtEnd($next[0]);
            return false;
          }
        } else {
          if($elem.parents(".func-holder").parents(".function").length>0) {
            var br = 0;
            for (var ordnext = ord+1; ordnext <= ord+4; ordnext++) {
              $elem.parents(".function:first").find(".func-box[order="+ordnext+"]").find(".arginput").each(function() {
                if($(this).parents(".function:first")[0]==$elem.parents(".function:first")[0] && $(this).attr("contenteditable")=="true") {
                  if(trim($elem.text())=='' && $elem.index()>0) {
                    $elem.remove();
                  }

                  placeCaretAtEnd($(this)[0]);
                  br=1;
                  return false;
                } else {
                }
              })
              if(br==1) {
                break;
              }
            }
            return false;
          } else {
            for (var ordnext = ord+1; ordnext <= ord+4; ordnext++) {
              $elem.parents(".function:first").find(".func-box[order="+ordnext+"]").each(function() {
                if($elem.parents(".function:first")[0]==$(this).parents(".function:first")[0]) {
                  if($(this).find("."+mX).length>0 && $(this).find("."+mX).attr("contenteditable")=="true") {
                    if(trim($elem.text())=='' && $elem.index()>0) {
                      $elem.remove();
                    }
                    placeCaretAtEnd($(this).find("."+mX+":first")[0]);
                    br=1;
                    return false;
                  } else if($(this).find("."+mX).length>0 && $(this).find("."+mX).attr("contenteditable")!="true") {
                    return;
                  } else {
                    var $ms = $("<span class='"+mX+" arginput' contenteditable='true'></span>");
                    $(this).html($ms);
                    $ms.focus();
                    placeCaretAtEnd($ms[0]);
                    br=1;
                    return false;
                  }
                }
              })
              if(br==1) {
                break;
              }
            }
            return false;
          }
        }
      } else if($elem.parent(".divisor").length>0) {
        if($elem.parents(".func-box").length>0) {
          $next.addClass("arginput");
        }
        if($elem.parent(".divisor").parents(".division:first").find(".dividend").find("."+mX).length>0) {
          placeCaretAtEnd($elem.parent(".divisor").parents(".division:first").find(".dividend:last").find("."+mX)[0]);
          if(trim($elem.text())=='' && $elem.index()>0) {
            $elem.remove();
          }
          return false;
        } else {
          $elem.parent(".divisor").parents(".division:first").find(".dividend").append($next);
        }
      } else if($elem.parent(".dividend").length>0) {
        if($elem.parents(".division:first").next().length>0) {
          if($elem.parents(".division:first").next().hasClass('func-holder')) {
            $next.insertAfter($elem.parents(".division:first"));
            if(trim($elem.text())=='' && $elem.index()>0) {
              $elem.remove();
            }
            placeCaretAtEnd($next[0]);
            return false;

          } else {
            findNext($elem);
            return false;
          }
        }
        if($elem.parents(".func-box").length>0) {
          $next.addClass("arginput");
        }
        $next.insertAfter($elem.parent(".dividend").parents(".division:first"));
        if(trim($elem.text())=='' && $elem.index()>0) {
          $elem.remove();
        }
        placeCaretAtEnd($next[0]);
        return false;
      } else if($elem.parent(".above").length>0 || $elem.parent(".below").length>0) {
        $next.insertAfter($elem.parents(".underover-holder"));
      } else if($elem.parent(".exp-holder").length>0) {
        $next.insertAfter($elem.parent(".exp-holder"));
      } else if($elem.parent(".und-holder").length>0) {
        $next.insertAfter($elem.parent(".und-holder"));
      } else {
        $next.insertAfter($elem);
      }

      if($next.parent().hasClass("und-holder")) {
        $next.addClass("und");
      }
      if($next.parent().hasClass("exp-holder")) {
        $next.addClass("exp");
      }

      if($elem.parents(".exp-holder").text().trim()=='' || $elem.parents(".exp-holder").text().trim()==space) {
  // if a sub/sup are empty on tab, remove the parent box altogether to prevent bad rendering
        $elem.parents(".exp-holder").remove();
      }
      if($elem.parents(".und-holder").text().trim()=='' || $elem.parents(".und-holder").text().trim()==space) {
        $elem.parents(".und-holder").remove();
      }

      if($next.parents(".function").length>0) {
        $next.addClass("arginput");
      }
      placeCaretAtEnd($next[0]);

      if(trim($elem.text())=='' && $elem.parents(".division").length==0 && $elem.parents(".exp-holder").length==0 && $elem.parents(".und-holder").length==0 && $elem.parents(".function").length==0) {
        if(trim($elem.parents("."+mXc).text())=='') {
          if(settings.mathModeOnly==true) {
            placeCaretAtEnd($elem[0]);
            $next.remove();
            return false;
          } else {
            $closeBtn.remove();
            $mX_elem.attr("contenteditable","true");
            placeCaretAtEnd($mX_elem[0]);
            $elem.parents("."+mXc).remove();
            togglemX = 0;
          }
          
          return false;
        } else {
          if(settings.mathModeOnly==true) {
            placeCaretAtEnd($elem[0]);
            $next.remove();
            return false;
          } else {
            $next.remove();
            exitmX($elem,'');
            return false;
          }
        }
        return false;
      }
      return false;
    }


    /* nav function for finding where cursor goes next - used mostly with right arrow */
    function findNext($elem,$key) {
      var $this = $elem;
      var $edit = $("<span class='"+mX+" edit' contenteditable='true' data-srch=''></span>");
      var caret = getCaretCharacterOffsetWithin($this[0]);

      $(".edit").not($this).remove();

      if($this.next().hasClass(mX)) {
        if($elem.hasClass('division') || $elem.hasClass('exp-holder') || $elem.hasClass('und-holder') || $elem.hasClass('func-holder')) {
          $edit.insertAfter($this);
          $edit.focus();
          placeCaretAtEnd($edit[0]);
        } else if($this.next().hasClass("brack")) {
          if($this.parents(".brack-holder:first").length>0) {
            $edit.insertAfter($this.parents(".brack-holder:first"));
            $edit.focus();
            placeCaretAtEnd($edit[0]);
          } else {
            $edit.insertAfter($this.next());
            $edit.focus();
            placeCaretAtEnd($edit[0]);
          }
        } else {
          $edit.insertAfter($this.next());
          $edit.focus();
          placeCaretAtEnd($edit[0]);
        }
      } else if($this.next().hasClass("brack-holder")) {
        $edit.insertAfter($this.next().find("."+mX+":first"));
        $edit.focus();
        placeCaretAtEnd($edit[0]);
      } else if($this.next().hasClass("exp-holder")) {
        $this.next().prepend($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);
      } else if($this.next().hasClass("und-holder")) {
        $this.next().prepend($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);
      } else if($this.next().hasClass("division")) {
        $this.next().find(".divisor:first").prepend($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);
      } else if($this.next().hasClass("function") || $this.next().hasClass("func-holder")) {
        $this.next().find(".func-box[order=1]:first").prepend($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);
      } else if($this.parent().hasClass("exp-holder") || $this.parent().hasClass("und-holder")) {
        findNext($this.parent(),$key);
      } else if($this.parent().hasClass("divisor")) {
        $this.parents(".division:first").find(".dividend").prepend($edit);
        $edit.focus();
        placeCaretAtEnd($edit[0]);
      } else if($this.parent().hasClass("func-box")) {
        var i = parseInt($this.parents(".func-box:first").attr("order"),10);
        i++;
        if($this.parents(".function:first").find(".func-box[order="+i+"]").length<=0) {
          if($this.parents(".func-holder").length>0) {
            findNext($this.parents(".func-holder:first"),$key);
          } else {
            findNext($this.parents(".function:first"),$key);
          }
          return false;
        } else {
          $this.parents(".function:first").find(".func-box[order="+i+"]:first").prepend($edit);
          $edit.focus();
          placeCaretAtEnd($edit[0]);
        }
      } else if($this.parent().hasClass("dividend")) {
          findNext($this.parents(".division:first"),$key);
      } else if($this.next().length<=0) {
        return false;
      } else {
        findNext($this.next(),$key);
      }
      if($this.hasClass('edit') && $this.html()=='') {
        $this.remove();
      }
    }


    var timeout = null;
    var s_prev = "";

    /* define transformation functions for growing characters depending on contents - beg */
    function getTransform($elem,type) {
      if($elem.css("transform")=='none' || $elem.css("transform")=='' || $elem.css("transform")==undefined) {
        return "1";
      } else {
        if($elem.css("transform").indexOf("scale")>-1) {
          if(type=='height') {
            return $elem.css("transform").match(/(-?[0-9\.]+)/g)[1];
          } else {
            return $elem.css("transform").match(/(-?[0-9\.]+)/g)[0];
          }

        } else {
          if(type=='height') {
            return $elem.css("transform").match(/(-?[0-9\.]+)/g)[3];
          } else {
            return $elem.css("transform").match(/(-?[0-9\.]+)/g)[0];
          }
        }
      }
    }
    function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    var transform=0;
    var i=0;
    function setTransform($elem,time,rem,h,w,steph,stepw,type) {
      transform=1;

      if(rem<0) {
        transform=0;
        return false;
      }
      var numsteps = time/10;
      var hstep=1;
      var wstep=1;
      var cumh=0,cumw=0;

      if(type=='margin-left') {
        cumw = $elem.css("margin-left");

        if(steph!=undefined) {
          hstep=steph;
          wstep=stepw;
        } else {
          hstep=(h-cumh)/numsteps;
          wstep=(w-cumw)/numsteps;
        }

        cumw = round(cumw,8) + round(wstep,8);

        $elem.css("margin-left","-"+cumw+")");

      } else {
        i++;

        cumh = getTransform($elem,"height");
        cumw = getTransform($elem,"width");

        if(steph!=undefined) {
          hstep=steph;
          wstep=stepw;
        } else {
          hstep=(h-cumh)/numsteps;
          wstep=(w-cumw)/numsteps;
        }
        cumh = round(cumh,8) + round(hstep,8);
        cumw = round(cumw,8) + round(wstep,8);
        if(hstep>.015 || wstep>.01 || hstep<-.015 || wstep<-.01) {
          $elem.css("-webkit-transform","scale("+cumw+","+cumh+")");
          $elem.css("-ms-transform","scale("+cumw+","+cumh+")");
          $elem.css("transform","scale("+cumw+","+cumh+")");
        }
      }

      setTransformTimeout($elem,time,rem,h,w,hstep,wstep,type);
    }

    function setTransformTimeout($elem,time,rem,h,w,inith,initw,type) {
      setTimeout(function() {
        setTransform($elem,time,rem-10,h,w,inith,initw,type);
      }, 10);
    }


    function elemResize($elem) {
      if($elem.parents(".func-sqrt").length>0 && $($elem.parents(".func-sqrt").height()).toEm()>1.2) {
        var h = $($elem.parents(".func-sqrt").height()).toEm();
        var hsym = $($elem.parents(".func-sqrt:first").parents(".function:first").find(".func-symbol-sqrt").height()).toEm();
        var htarg = (h/hsym);
        if(transform==0 && round(getTransform($elem.parents(".func-sqrt:first").parents(".function:first").find(".func-symbol-sqrt"),"height"),2)!=round(htarg,2)) {
          i=0;
          setTransform($elem.parents(".func-sqrt:first").parents(".function:first").find(".func-symbol-sqrt:first"),200,200,htarg,1);
        }
      }

      // elem resize brackets!!
      if($elem.hasClass('brack-holder') || $elem.parents().hasClass('brack-holder')) {
        if(!$elem.hasClass("brack-holder")) {
          $elem = $elem.parents(".brack-holder:first");
        }

        var h = 1;
        $elem.children().each(function() {
          if($(this).hasClass("brack") && $(this).text()=='<') {
            $(this).html('&#10216;');
          } else if($(this).hasClass("brack") && $(this).text()=='>') {
            $(this).html('&#10217;');
          }
          if($($(this).height()).toEm()>h) {
            h = $($(this).height()).toEm();
          }
        })
        h = h -.5;

        h = $($elem.height()).toEm();
        if(h>1.25) {
          h = h-.2;
        }

        w = Math.min(1+.2*(h-1),1.2);
        setTransform($elem.find(".brack"),200,200,h,w);
      }

      if($elem.parents(".matcontents").length>0) {
        $elem.parents(".matcontents").each(function() {
          var wtarg=1;
          var mtch = $(this).parents(".function").attr("data-id");
          var h = $($(this).height()).toEm();
          var hsym = $($(this).parents(".function").find(".mat-symbol[data-id="+mtch+"]").height()).toEm();
          var htarg = (h/hsym);
          if($(this).parents(".function").find(".mat-symbol[data-id="+mtch+"]").text()=="{") {
            wtarg = htarg/4;
          }

          if(transform==0 && round(getTransform($elem.parents(".function").find(".mat-symbol[data-id="+mtch+"]"),"height"),2)!=round(htarg,2)) {
            setTransform($(this).parents(".function").find(".mat-symbol[data-id="+mtch+"]"),200,200,htarg,wtarg);
          }
        })
      }
    }
    /* define transformation functions for growing characters depending on contents - END */


  /* DROP DOWN FUNCTIONS - beg */
    /* what happens when you select something from the smart menu */
    $mXparent.on("click", "#"+aCr+" .list-row-hover", function() {
      var $that = $("#"+aCr+" .list-row-hover");
      var record = $(this).data('data');
      var $this = $("#"+mX);
      var margbot = $this.css("margin-bottom")
      var margtop = $this.css("margin-top")
      var classes = $this.attr("class");

      if ($that.attr("htmlcode")!=undefined && $that.attr("htmlcode") != '') {
  // For functions
        if($that.attr("htmlcode").indexOf("brack-holder")>-1) {
          var $tt = $($that.attr("htmlcode"));
          $tt.insertAfter($this);
          $this.remove();
          renderFunction($tt);
          endSearch(true);
          relocateClose();
          return false;
        }

        var $func = $("<span class='func-holder'></span>");
        $func.append($("#"+aCc+" .list-row-hover").attr("htmlcode"));
        $func.find(".arguments-table").css("min-width",'0px');

        if($func.find(".func-sqrt").length>0 && ($this.parents(".func-box").length>0 || $this.parents(".exp-holder").length>0 || $this.parents(".und-holder").length>0)) {
          $func.find(".func-sqrt").addClass('func-sqrt-func');
          $func.find(".func-symbol-sqrt").addClass('func-symbol-sqrt-func');
        }

        if(record.symbolpadding!=undefined) {
          $func.css("padding",record.symbolpadding);
        }

        if(record.symbolmargin!=undefined) {
          $func.css("margin",record.symbolmargin);
        }

        if($this.hasClass("exp")) {
          $func.css("padding-bottom","10px");
          $this.parent(".exp-holder").css("vertical-align","top");
        } else if ($this.hasClass("und")) {
          $func.css("padding-top","10px");
          $this.parent(".und-holder").css("vertical-align","bottom");
        } else if ($this.parents().hasClass('division')){
          $func.css("margin","3px 0px");
        }

        $func.find(".arginput").each(function() {
          if($that.text()=='') {
            $func.find(".arginput").html(space);  
          }
        })

        endSearch(true);

        if($this.index()<=2) {
          $("<span class='"+mX+"' contenteditable='true'>").insertBefore($this); // add front box if first box in expression
        }
        $func.insertAfter($this);
        logUndo($(".cursrch"),'ac');
        $(".cursrch").not(".srchrem").remove();
        $(".srchrem").removeClass('srchrem');

        renderFunction($func);
        relocateClose();

        if($this.parents(".func-sub").length>0) {
          var w = $($this.parents(".func-sub").width()).toEm();
          var wsym = $($this.parents(".function").find(".func-sup").height()).toEm();
          var wtarg = (w/wsym)-.6;

          $this.parents(".function").find(".func-sup").css("margin-left","-"+wtarg+"em");
        }

      } else if($that.hasClass('matbuilder')) {
  // for matrices
        var tn = $that.find(".ac-matrix").attr("data-render").split(" ");
        var $func = $("<span class='func-holder curr' func='"+record.rendername+"'></span>");

        for (var i = 0; i < tn.length; i++) {
          $func.append("<span class='mat-symbol'>"+tn[i]+"</span>");
        };

        $("<span class='"+mX+"' contenteditable='true'>").insertBefore($this);
        if(record.rendername=='piecewise') {
          $(".search_results").html("ROWS <input type='text' class='mat-inp' name='mat-rows' placeholder='MAX 10' func='"+record.symbolname+"'> COLUMNS <input type='hidden' class='mat-inp' name='mat-cols' placeholder='MAX 10' value='2' func='"+record.symbolname+"'>").addClass('matrixbuilder');
          $func.insertAfter($this);
        } else if(record.rendername=='binomial') {
          $func.insertAfter($this);
          buildMatrix(2,1,'binomial');
        } else {
          $(".search_results").html("ROWS <input type='text' class='mat-inp' name='mat-rows' placeholder='MAX 10' func='"+record.symbolname+"'> COLUMNS <input type='text' class='mat-inp' name='mat-cols' placeholder='MAX 10' func='"+record.symbolname+"'>").addClass('matrixbuilder');
          $func.insertAfter($this);
        }

        logUndo($(".cursrch"),'ac');
        $(".cursrch").not(".srchrem").remove();
        $(".srchrem").removeClass('srchrem');

        relocateClose();
        $(".search_results").find(".mat-inp:first").focus();
        // comment out placecaretatend because stealing focus somehow?
        // placeCaretAtEnd($("input[name=mat-rows]")[0]);
        return false;
      } else {
  // for symbols
        var $next = $("<span class='"+classes+" fontnorm' contenteditable='true' style='margin-bottom:"+margbot+";margin-top:"+margtop+";'></span>");

        if($that.parents(".arrow_sm").length<=0) {
          $next.append(record.symbol);
          $next.attr("rendername",record.symbolname);
          if(record.symbolpadding!=undefined) {
            $next.css("padding",record.symbolpadding);
          }
          if(record.symbolmargin!=undefined) {
            $next.css("margin",record.symbolmargin);
          }
        } else {

          $next.append($(".arrow_sm .list-row-hover").html());
          $next.attr("rendername",$that.attr("title")).css("padding","0 .2em");
        }


        if($next.hasClass("arginput")) {
          $next.removeClass("arghighlight");
        }

        $next.removeClass('cursrch');

        $next.insertAfter($this);

        var $next2 = $("<span class='"+classes+"' contenteditable='true' style='margin-bottom:"+margbot+";margin-top:"+margtop+";'>"+space+"</span>");
        $next2.removeClass('cursrch');

        $next2.insertAfter($next);

        logUndo($(".cursrch"),'ac');
        $(".cursrch").not(".srchrem").remove();

        $(".srchrem").removeClass('srchrem');
        elemResize($next);
        endSearch(true);
        $next2.focus();
        placeCaretAtEnd($next2[0]);

        if($next.parents(".func-sub").length>0) {
          var w = $($next.parents(".func-sub").width()).toEm();
          var wsym = $($next.parents(".function").find(".func-sup").height()).toEm();
          var wtarg = (w/wsym)-.6;

          $next.parents(".function").find(".func-sup").css("margin-left","-"+wtarg+"em");
        }
      }


      if($this.hasClass("arginput")) {
        $this.removeClass("arghighlight");
      }

      if(trim($this.html())=='' && ($this.index()>0 || $this.hasClass('arginput'))) {
        $this.remove();
      }
    });


    /* TBD - beginning of the undo function */
    function logUndo(new_html,old_html,action,keycode,prev_it) {
      var d = new Date().getTime();

//      undo.push(new_html,old_html,action,keycode,prev_it,d);
    }

    /* determines of the string sent in the keypress function matches anything in the db */
    function keyChange($elem,srchstr) {
      var minlen=3;
      string = srchstr;
//console.log(string);

      $(".srchrem").removeClass('srchrem');
      // check for romanization match
      var rom=[];

      for (var i = 0; i < romanize.length; i++) {
        if(romanize[i] == string) {
          var undo_str='';
          for (var j = 0; j < string.length; j++) {
            undo_str = undo_str+string.substr(j,1)+',';
          };
          rom=romanize[i];

          break;
        }
      };

      // if empty, parse string for auto complete match
      if(rom.length==0) {
        for (var j = 1; j < string.length - 1; j++) {
          dbs=[];
          var newstr = string.substr(j,string.length);
          if(newstr[0] === newstr[0].toUpperCase()) {
            var romstr1 = newstr.charAt(0).toUpperCase() + newstr.slice(1);
            var romstr2 = newstr.toLowerCase();
          } else {
            var romstr2 = newstr.charAt(0).toUpperCase() + newstr.slice(1);
            var romstr1 = newstr.toLowerCase();
          }

          $(".cursrch").each(function() {
            if($(this).hasClass('srchrem')) {
              return;
            } else {
              $(this).addClass('srchrem');
              return false;
            }
          })

          if(romstr1.length>=minlen) {
            for (var i = 0; i < romanize.length; i++) {
              if(romanize[i] == romstr1 || romanize[i] == romstr2) {
                var undo_str='';
                for (var j = 0; j < romstr1.length; j++) {
                  undo_str = undo_str+romstr1.substr(j,1)+',';
                };
                rom=romanize[i];
              }
              if(rom.length>0) {
                string = romstr1;
                break;
              }

            };
          }
          if(rom.length>0) {
            break;
          }
        };
      }
      if(rom.length>0) {
        $(".cursrch").not(".srchrem").each(function() {

          if(!$(this).hasClass("romanize")) {
            $(this).attr("data-code",$(this).html()).text($(this).attr("data-srch")).addClass("romanize");
          }
        })
        placeCaretAtEnd($(".cursrch:last")[0]);
        undo.push(['rom',string]);
      }



      $(".srchrem").removeClass('srchrem');
      var ac=[];
      // check for auto complete exact matched first
      for (var i = 0; i < autoComplete.length; i++) {

        if(autoComplete[i][0] == string) {
          var undo_str='';
          for (var j = 0; j < string.length; j++) {
            undo_str = undo_str+string.substr(j,1)+',';
          };
          ac=autoComplete[i];
          break;
        }
      };

      // if empty, parse string for auto complete match
      if(ac.length==0) {
        for (var j = 1; j < string.length - 1; j++) {
          dbs=[];
          var newstr = string.substr(j,string.length);
          if(newstr[0] === newstr[0].toUpperCase()) {
            var acstr1 = newstr.charAt(0).toUpperCase() + newstr.slice(1);
            var acstr2 = newstr.toLowerCase();
          } else {
            var acstr2 = newstr.charAt(0).toUpperCase() + newstr.slice(1);
            var acstr1 = newstr.toLowerCase();
          }

          $(".cursrch").each(function() {
            if($(this).hasClass('srchrem')) {
              return;
            } else {
              $(this).addClass('srchrem');
              return false;
            }
          })

          if(acstr1.length>=minlen) {
            for (var i = 0; i < autoComplete.length; i++) {
              if(autoComplete[i][0] == acstr1 || autoComplete[i][0] == acstr2) {
                var undo_str='';
                for (var j = 0; j < acstr1.length; j++) {
                  undo_str = undo_str+acstr1.substr(j,1)+',';
                };
                ac=autoComplete[i];
              }
              if(ac.length>0) {
                break;
              }

            };
          }
          if(ac.length>0) {
            break;
          }
        };
      }

      // if auto complete match, drop it in
      if(ac.length>0) {
        if(ac[1]=='db') {
          var it=0;
          for (var k = 0; k < db.length; k++) {
            if(db[k].symbolname == ac[0]) {
              undo_str = undo_str+string.substr(j,1)+',';
              it=k;
            }

            if(db[k].alternatename.length>0) {
              var alt = db[k].alternatename.split(",");
              for (var h = 0; h < alt.length; h++) {
                if(alt[h] == ac[0]) {
                  undo_str = undo_str+string.substr(j,1)+',';
                  it=k;
                }
              }
            }
          }

          var $func = $("<span class='func-holder'>"+db[it].arguments_table+"</span>");

          $func.find(".arguments-table").css("min-width",'0px');
          if($func.find(".func-sqrt").length>0 && ($elem.parents(".func-box").length>0 || 
             $elem.parents(".exp-holder").length>0 || $elem.parents(".und-holder").length>0)) {
            $func.find(".func-sqrt").addClass('func-sqrt-func');
            $func.find(".func-symbol-sqrt").addClass('func-symbol-sqrt-func');
          }
          if($elem.hasClass("exp")) {
            $func.css("padding-bottom","10px");
            $elem.parent(".exp-holder").css("vertical-align","top");
          } else if ($elem.hasClass("und")) {
            $func.css("padding-top","10px");
            $elem.parent(".und-holder").css("vertical-align","bottom");
          } else if ($elem.parents().hasClass('division')){
            $func.css("margin","3px 0px");
          }

          $func.find(".arginput").each(function() {
            if($elem.text()=='') {
              $func.find(".arginput").html(space);  
            }
          })

          $func.attr("undo",undo_str.substr(0,undo_str.length-1));
          $func.insertAfter($elem);
          undo.push(['auto',$func]);
          $(".cursrch").not(".srchrem").remove();
          renderFunction($func);
  
        } else {
          $elem.html(ac[1]).attr("rendername",ac[0]).attr("undo",undo_str.substr(0,undo_str.length-1));
          undo.push(['auto',$elem]);
          placeCaretAtEnd($elem[0]);
          $(".cursrch").not($elem).not(".srchrem").remove();

          if($elem.parents(".func-sub").length>0) {
            var w = $($elem.parents(".func-sub").width()).toEm();
            var wsym = $($elem.parents(".function").find(".func-sup").height()).toEm();
            var wtarg = (w/wsym)-.3;

            $elem.parents(".function").find(".func-sup").css("margin-left","-"+wtarg+"em");
          }

        }

        endSearch();
        return false;          
      }

      var db_it = db;

      if (string == s_prev) {
        return;
      }

      s_prev = string;
      if (string == "" || string.length < minlen) {
        endSearch(false);
        return; 
      }
      if(string.toLowerCase()=='help') {
  console.log("help");
      }

      $(".srchrem").removeClass('srchrem');

      /* match on arrows */
      var arrow = 'arrow';
      var newstr=string;
      if(string.indexOf("arr")>-1 || string.indexOf("rro")>-1 || 
         string.indexOf("row")>-1 || string.indexOf("arro")>-1 || 
         string.indexOf("rrow")>-1 || string.indexOf("arrow")>-1) {
        if(arrow.indexOf(string)>-1) {
        } else {
          for (var j = 1; j < string.length - 2; j++) {
            newstr = string.substr(j,string.length);
            $(".cursrch").each(function() {
              if($(this).hasClass('srchrem')) {
              } else {
                $(this).addClass('srchrem');
                return false;
              }
            })
            if(arrow.indexOf(newstr)>-1) {
              break;
            }
          };
        }

        if(arrow.indexOf(newstr)<0) {
          endSearch(true);
        } else {
          makeMenu(randid, $elem, '','arrow',newstr);
        }

      } else {
  /* begin matrix search - match on matrix */
        var dbs = new Array();

        // case sensitive matching
        if(string[0] === string[0].toUpperCase()) {
          var str1 = string.charAt(0).toUpperCase() + string.slice(1);
          var str2 = string.toLowerCase();
        } else {
          var str2 = string.charAt(0).toUpperCase() + string.slice(1);
          var str1 = string.toLowerCase();
        }

        $(".srchrem").removeClass('srchrem');

        for (var i = 0; i < dbmat.length; i++) {
          if(string.length >= minlen) {
            var dbname = dbmat[i].symbolname.split(" ");
            for(j = 0; j < dbname.length; j++){
              if(dbname[j] == str1) {
                dbs.push(dbmat[i]);
              }
            }
          }
        }
        for (var i = 0; i < dbmat.length; i++) {
          if(string.length >= minlen) {
            var dbname = dbmat[i].symbolname.split(" ");
            for(j = 0; j < dbname.length; j++){
              if(dbname[j].indexOf(str1)==0 && dbmat[i].symbolname != str1 && str1!='pi' && str1!='Pi') {
                dbs.push(dbmat[i]);
              }
            }
          }
        }
        for (var i = 0; i < dbmat.length; i++) {
          if(string.length >= minlen) {
            var dbname = dbmat[i].symbolname.split(" ");
            for(j = 0; j < dbname.length; j++){
              if(dbname[j].indexOf(str2)==0 && str1!='Pi') {
                dbs.push(dbmat[i]);
              }
            }
          }
        }

        if(dbs.length==0) {
          if(string.length >= minlen) {
            for (var j = 1; j < string.length - 2; j++) {
              dbs=[];
              var newstr = string.substr(j,string.length);
              var newmatch=0;
              if(newstr[0] === newstr[0].toUpperCase()) {
                var nostr1 = newstr.charAt(0).toUpperCase() + newstr.slice(1);
                var nostr2 = newstr.toLowerCase();
              } else {
                var nostr2 = newstr.charAt(0).toUpperCase() + newstr.slice(1);
                var nostr1 = newstr.toLowerCase();
              }            


              $(".cursrch").each(function() {
                if($(this).hasClass('srchrem')) {
                  return;
                } else {
                  $(this).addClass('srchrem');
                  return false;
                }
              })


              if(nostr1.length>=minlen) {
                for (var i = 0; i < dbmat.length; i++) {
                  var dbname = dbmat[i].symbolname.split(" ");
                  for(k = 0; k < dbname.length; k++){
                    if(dbname[k].indexOf(nostr1)==0) {
                      dbs.push(dbmat[i]);
                      newmatch=1;
                    }
                  }
                }
                for (var i = 0; i < dbmat.length; i++) {
                  var dbname = dbmat[i].symbolname.split(" ");
                  for(k = 0; k < dbname.length; k++){
                    if(dbname[k].indexOf(nostr2)==0) {
                      dbs.push(dbmat[i]);
                      newmatch=1;
                    }
                  }
                }
                if(newmatch==1) {
                  break;
                }
              }
            };
            if(dbs.length>0) {
              makeMenu(randid, $elem, dbmat,'matrix', str1);
              return false;
            }
          }
        } else {
          if(dbs.length>0) {
            makeMenu(randid, $elem, dbmat,'matrix', str1);
            return false;
          }
        }
  /* end matrix search */

  /* begin generic search */
        $(".srchrem").removeClass('srchrem');





        $(".srchrem").removeClass('srchrem');


        // if no auto complete match
        // exact word match
        for (var i = 0; i < db_it.length; i++) {
          if(db_it[i].symbolname == str1) {
            db_it[i].rank=1;
            dbs.push(db_it[i]);
          }
          if(db_it[i].alternatename.length>0) {
            var alt = db_it[i].alternatename.split(",");
            for (var k = 0; k < alt.length; k++) {
              if(alt[k] == str1 && dbs.indexOf(db[i])<=-1) {
                db_it[i].rank=1;
                dbs.push(db_it[i]);
              }

            }
          }
          if(db_it[i].symbolname == str1 && dbs.indexOf(db[i])<=-1) {
            db_it[i].rank=2;
            dbs.push(db_it[i]);
          }
          if(db_it[i].symbolname.indexOf(str1)==0 && dbs.indexOf(db[i])<=-1) {
            db_it[i].rank=3;
            dbs.push(db_it[i]);
          }

          if(db_it[i].alternatename.length>0) {
            var alt = db_it[i].alternatename.split(",");
            for (var k = 0; k < alt.length; k++) {
              if(alt[k].indexOf(str1)==0 && dbs.indexOf(db[i])<=-1) {
                db_it[i].rank=3;
                dbs.push(db_it[i]);
              }
            }
          }


          if(db_it[i].symbolname.toLowerCase().indexOf(str1)==0 && dbs.indexOf(db[i])<=-1) {
            db_it[i].rank=4;
            dbs.push(db_it[i]);
          }
          if(db_it[i].alternatename.length>0) {
            var alt = db_it[i].alternatename.split(",");
            for (var k = 0; k < alt.length; k++) {
              if(alt[k].toLowerCase().indexOf(str1)==0 && dbs.indexOf(db[i])<=-1) {
                db_it[i].rank=4;
                dbs.push(db_it[i]);
              }
            }
          }

          var dbname = db_it[i].symbolname.split(" ");
          for(j = 0; j < dbname.length; j++){
            if(dbname[j] == str1 && dbs.indexOf(db[i])<=-1) {
              db_it[i].rank=5;
              dbs.push(db_it[i]);
            }
            if(dbname[j].indexOf(str1)==0 && dbs.indexOf(db[i])<=-1) {
              db_it[i].rank=6;
              dbs.push(db_it[i]);
            }
            if(dbname[j].toLowerCase().indexOf(str1)==0 && dbs.indexOf(db[i])<=-1) {
              db_it[i].rank=7;
              dbs.push(db_it[i]);
            }
          }
          if(db_it[i].alternatename.length>0) {
            var alt = db_it[i].alternatename.split(",");

            for (var k = 0; k < alt.length; k++) {
              var dbname = alt[k].split(" ");
              for(j = 0; j < dbname.length; j++){
                if(trim(dbname[j]) == str1 && dbs.indexOf(db[i])<=-1) {
                  db_it[i].rank=5;
                  dbs.push(db_it[i]);
                }
                if(trim(dbname[j]).indexOf(str1)==0 && dbs.indexOf(db[i])<=-1) {
                  db_it[i].rank=6;
                  dbs.push(db_it[i]);
                }
                if(trim(dbname[j]).toLowerCase().indexOf(str1)==0 && dbs.indexOf(db[i])<=-1) {
                  db_it[i].rank=7;
                  dbs.push(db_it[i]);
                }
              }

            };
            
          }
        }

        // nothing found in first iteration.  start parsing the string.
        if(dbs.length==0) {
          for (var j = 1; j < string.length - 1; j++) {
            dbs=[];
            var newstr = string.substr(j,string.length);
            var newmatch=0;
            if(newstr[0] === newstr[0].toUpperCase()) {
              var str1 = newstr.charAt(0).toUpperCase() + newstr.slice(1);
              var str2 = newstr.toLowerCase();
            } else {
              var str2 = newstr.charAt(0).toUpperCase() + newstr.slice(1);
              var str1 = newstr.toLowerCase();
            }

            $(".cursrch").each(function() {
              if($(this).hasClass('srchrem')) {
                return;
              } else {
                $(this).addClass('srchrem');
                return false;
              }
            })

            if(str1.length>=minlen) {
              for (var i = 0; i < db.length; i++) {
                var dbname = db[i].symbolname.split(" ");
                for(k = 0; k < dbname.length; k++){
                  if(dbname[k].indexOf(str1)==0) {
                    dbs.push(db[i]);
                    newmatch=1;
                  }
                }
              }
              for (var i = 0; i < db.length; i++) {
                var dbname = db[i].symbolname.split(" ");
                for(k = 0; k < dbname.length; k++){
                  if(dbname[k].indexOf(str2)==0) {
                    dbs.push(db[i]);
                    newmatch=1;
                  }
                }
              }
              if(newmatch==1) {
                break;
              }
            }
          };
          makeMenu(randid, $elem, dbs,'',str1);
        } else {
          makeMenu(randid, $elem, dbs,'',str1);
        }
  /* end generic search */
      }
    }

    $("#"+aCc).focusout(function(){
      endSearch(true);
    });

    $(document).on("mouseover", "#"+aCr+" .symbol, #"+aCr+" .matrixsymbol", function(e) {
      if($(e.target).hasClass("matrixsymbol")) {

        $(".matrixsymbol").toggleClass("selector-row-hover");

        $(".arrow_sm .symbol").each(function() {
          $(this).html($(this).attr("data-"+$(".matrixsymbol.selector-row-hover").attr("data-type"))).attr("title",$(this).attr("data-"+$(".matrixsymbol.selector-row-hover").attr("data-type")+"-title"));
        })
      } else {
        $("#"+aCc+" .symbol").removeClass("list-row-hover");

        if($(this).parents(".search_results").hasClass("search-left")) {
          if($(this).index()==0) {
            $(".search_results").removeClass('search-left_sec');
          } else {
            $(".search_results").addClass('search-left_sec');
          }
        } else {
          if($(this).index()==$(".search_results").find(".symbol").length-1) {
            $(".search_results").removeClass('search-right_sec');
          } else {
            $(".search_results").addClass('search-right_sec');
          }
        }

        $(".symbol").removeClass("list-row-hover");
        $(this).addClass("list-row-hover");
         
        setNamerow($(".search_results"),$(".list-row-hover").attr("title"),$(".search_results").attr("data-str"));


      }
    });


  /* DROP DOWN FUNCTIONS - END */

    /* build the matrix itself */
    function buildMatrix(r,c,style) {
      if(r==undefined || r=='') {
        r = 1;
      }
      if(c==undefined || c=='') {
        c = 1;
      }
      var ran = Math.floor(Math.random()*1001);
      if(style=='matrix (bracket)') {
        var wrapopen = '[';
        var wrapclosed = ']';
      } else if(style=='matrix (parentheses)') {
        var wrapopen = '(';
        var wrapclosed = ')';
      } else if(style=='determinant') {
        var wrapopen = '|';
        var wrapclosed = '|';
      } else if(style=='array') {
        var wrapopen = '';
        var wrapclosed = '';
      } else if(style=='binomial') {
        var wrapopen = '(';
        var wrapclosed = ')';
      } else if(style=='piecewise function') {
        var wrapopen = '{';
        var wrapclosed = '';
      }
      var na = $('.func-holder.curr').attr("func");
      var $matrix = $("<span class='function' data-id='"+ran+"' func='"+na+"'></span>");
      $matrix.append("<span class='mat-symbol' data-id='"+ran+"'>"+wrapopen+"</span>");

      var grid="<span class='matcontents' cellspacing=4>";
      var o = 1;
      for (var i = 0; i < r; i++) {
        grid = grid + "<span class='mat-col'>";
        for (var j = 0; j < c; j++) {
          var end = '';
          if(j==(c-1)) {
            end = 'matend';
          }
          grid = grid + "<span class='func-box mat-box "+end+"' order='"+o+"' data-id='"+ran+"'><span class='arginput "+mX+"' contenteditable='true' func='"+na+"'></span></span>";
          o++;
        };
        grid = grid + "</span>";
      };
      grid = grid + "</span>";
      $matrix.append(grid);

      $matrix.append("<span class='mat-symbol' data-id='"+ran+"'>"+wrapclosed+"</span>");

      $('.func-holder.curr').html($matrix);
      $('.func-holder.curr').removeClass('curr');

      var h = $($matrix.height()).toEm();
      var hsym = $($matrix.find(".mat-symbol").height()).toEm();
      var htarg = (h/hsym);

      setTransform($matrix.find(".mat-symbol"),200,200,htarg,1);

      relocateClose();
      elemResize($(this));

      $matrix.find(".func-box[order=1]").find("."+mX).focus();
      placeCaretAtEnd($matrix.find(".func-box[order=1]").find("."+mX)[0]);

      endSearch(true);
      relocateClose();
    }

    /* attempt to match open/closed brackets */
    function findBracketMatch($elem,dir,type) {
      var $group=$("<div></div>"),ct=0,i=-1,inc=0,j=0,$match;
      var $place = $("<span class='placeholder-match'></span>");
      $place.insertAfter($elem);

      if(dir=='back') {
        if(type=="strict") {          // match bracket type
          $elem.parent().children().not(".placeholder").reverse().each(function() {
            if(bracketsClosed.indexOf(trim($(this).text()))>-1 || (i>-1)) {
              if(i<0) {
                i=bracketsClosed.indexOf(trim($(this).text()));  
              }

              if(trim($(this).text())==bracketsClosed[i]) {
                ct++;
              } else if (trim($(this).text())==bracketsOpen[i]) {
                ct--;
              }

              if(ct==0) {
                i=-1;
                ct=0;
                $group = $(this);
                openBracket.pop();
                return false;
              }
            }
          });

        } else {                   // just find a corresponding open bracket
          $group = $("<div></div>");
          $elem.parent().children().not(".placeholder").reverse().each(function() {
            if($(this).hasClass("brack-holder") && $(this).find(".brack:last").text()=='|' && $elem.text()!='|') {
              // add logic to amend the existing brack-holder to end at $elem instead of the last pipe
              $(this).find(".brack:last").attr("data-type","");
              $group.append($(this).children().reverse());
              $(this).remove();
              ct=0;
              return false;
            }

            if(bracketsClosed.indexOf(trim($(this).text()))>-1 || (i>-1)) {
              if(i<0) {
                i=bracketsClosed.indexOf(trim($(this).text()));  
              }

              if(trim($(this).text())==bracketsClosed[i] && $(this).attr("data-type")!='openbrack') {
                ct++;
              } else if (bracketsOpen.indexOf(trim($(this).text()))>-1) {
                ct--;
              }
              $group.append($(this));

              if(ct==0) {
                i=-1;
                ct=0;
                $match = $(this);
                return false;
              }
            }
          });
        }
        if(ct!=0) {
          // if it doesn't find a match, put everything back where you found it and return empty
          $group.children().reverse().insertBefore($place);
          $match = $();
          $group = $();
        }
        if($match!=undefined && $match.length>0) {
          $elem.attr("match",$match.attr("match"));
        }

        var $fullgroup = $group.children().reverse();

      } else {                  // find close bracket
        $group = $("<div></div>");

        $elem.nextAll().andSelf().not(".placeholder").each(function() {

          if(bracketsOpen.indexOf(trim($(this).text()))>-1 || (i>-1)) {
            if(i<0) {
              i=bracketsOpen.indexOf(trim($(this).text()));
            }

            if(trim($(this).text())==bracketsOpen[i]) {
              ct++;
            } else if (bracketsClosed.indexOf(trim($(this).text()))>-1) {
              ct--;
            }
            $group.append($(this));

            if(ct==0) {
              i=-1;
              ct=0;
              $match = $(this);
              openBracket.pop();
              return false;
            }
          }
        });

        $match.attr("match",$elem.attr("match"));
        var $fullgroup = $group.children();
      }

      $place.remove();
      return $fullgroup;
    }


    /* run order of operations to set divisor contents on division */
    var $divlast;
    function orderOperations($elem,$source) {
      $divlast = $elem;

      var $group=$("<div></div>"),ct=0,i=-1,inc=0,j=0,eq=$elem.index();
      $divlast.parent().children().not(".placeholder").not("#aC-container").reverse().each(function() {

        if($(this).index()>eq+1) {
          return;
        }
        j++;
        if($(this).text()=='' && inc!=1) {
          $group.append($(this));
        } else if((trim($(this).text())=='|' && $(this).attr("data-type")!='closebrack') || (trim($(this).text())==$("<div/>").html('&#8214;').text() && $(this).attr("data-type")!='closebrack')) {
          return false;
        } else if(bracketsClosed.indexOf(trim($(this).text()))>-1 || (i>-1)) {
          inc=0;
          if(i<0) {
            i=bracketsClosed.indexOf(trim($(this).text()));  
          }
          if(trim($(this).text())==bracketsClosed[i]) {
            ct++;
          } else if (trim($(this).text())==bracketsOpen[i]) {
            ct--;
          }

          $group.append($(this));
          if(ct==0) {
            i=-1;
            ct=0;
            return;
          }
        } else if($(this).hasClass('func-holder')) {
          return false;
        } else if(bracketsOpen.indexOf(trim($(this).text()))>-1) {
          return false;
        } else if(operatorsAry.indexOf(trim($(this).text()))>-1) {
          return false;
        } else if(otherExc.indexOf(trim($(this).text()))>-1) {
          return false;
        } else if($(this).hasClass("und-holder") || $(this).hasClass("exp-holder")) {
          $group.append($(this));
          inc=1;
        } else if($(this).attr("rendername")!=undefined) {
          $group.append($(this));
        } else if($(this).text()=='*') {
          $group.append($(this));
          inc=1;
        } else if($(this).prev().hasClass("exp-holder") || $(this).prev().hasClass("und-holder")) {
          $group.append($(this));
          return;
        } else if($(this).text()!='' && j==1) {
            $group.append($(this));
        } else {
          inc=1;
        }
        if(inc==1) {
          $group.append($(this));
          inc=0;
        }
      })

      $divlast = $group.children().reverse();
      return $divlast;
    }

    $mXparent.on("click", ".vst", function() {
      if($(this).find(".vst-options").css("display")=="none") {
        $(this).find(".vst-options").fadeIn("fast");
      } else {
        $(this).find(".vst-options").fadeOut("fast");
      }
    })

  /* RENDERING FUNCTIONS - BEG - these may or may not be necssary 
  in future so I'm not really going to say much about them */

    function passFunction($elem) {
      var $this = $elem;
      var funcid = $this.attr("data-id");
      var funcmax=0;

      if($elem.parents(".func-holder:first").attr("subsup")!=undefined) {
        if($elem.parent(".func-holder:first").attr("subsup")=='subsup') {
          renderstring = renderstring + '((';
        } else {
          renderstring = renderstring + '(';
        }
      }

      $this.find(".func-box[data-id='"+funcid+"']").each(function() {
         if($(this).attr("order")>funcmax) {
          funcmax = $(this).attr("order");
         }
      })
      $this.find(".func-box[data-id='"+funcid+"'][order='"+funcmax+"']").find("."+mX+":last").addClass("endfunc");
      $this.find(".matend[data-id='"+funcid+"']").find("."+mX+":last").addClass("matendmx");

      $this.addClass("cycled");
      if($this.attr("func")=='mat' || $this.attr("func")=='det') {
        $this.find(".mat-col .mat-box[data-id='"+funcid+"']:last").find("."+mX+":last").addClass("matend");
        matdet = $this.attr("func");
      }
      var $run = $("<span class='"+mX+" run'>"+$this.attr("func")+"</span>");

      if($this.parent(".arg-holder").parent("td").hasClass("dividend") || $this.parent(".arg-holder").parent("td").hasClass("divisor")) {
        $run.insertBefore($this);
        if($this.parents("td.divisor").length>0 && $this.parent(".arg-holder").index()==0) {
          $run.addClass("begdivs");
        }
      } else if ($this.parent("td").hasClass("dividend") || $this.parent("td").hasClass("divisor")) {
        $run.insertBefore($this.parents("table.division:last"));
      } else if ($this.parents(".exp-holder").length>0) {
        $this.parents(".exp-holder:first").prepend($run);
      } else if ($this.parents(".und-holder").length>0) {
        $this.parents(".und-holder:first").prepend($run);
      } else {
        $run.insertBefore($this);
      }

      if($prev==undefined) {
        $prev = $this;
      }
      renderstring = renderstring + ' ';
      renderCycle($run);
      renderstring = renderstring + '(';

      cycleFunction($elem);
      $elem.parents(".func-holder:first").addClass("cycled");
    }

    function cycleFunction($elem) {
      var funcclose,empty=0;
      var $this = $elem;

      funcclose='';
      for (var i=1,$item; i<=16; i++) {
        if($this.find(".func-box[order="+i+"]").length<=0) {
          break;
        }
        $this.find(".func-box[order="+i+"]").each(function() {

          if($(this).parents(".function").length>0 && $(this).parents(".function:first")[0] != $this[0]) {
            return;
          }

          $(this).find("."+mX+", .arginput, .func-holder").each(function() {
            var $arg = $(this);

            if(($arg.hasClass("endfunc") && !$arg.hasClass("cycled")) || ($arg.hasClass("matend") && !$arg.hasClass("cycled"))) {
              funcclose=funcclose+')';
            }

            if($(this).hasClass("exp-holder")
                || $(this).hasClass("und-holder")) {
            } else if ($(this).hasClass("func-holder")) {
              if(!$(this).find(".function").hasClass("cycled")) {
                passFunction($(this).find(".function:first"));
              }
              return;
            } else {
              if(!$(this).hasClass("cycled")) {
                $(this).addClass("cycled");
                $item=$(this);
                if($prev==undefined) {
                  $prev = $(this);
                }
                renderCycle($(this));
                $prev = $(this);
                if($(this).html()!='') {
                  empty=1;
                }

                matdet='';
                if($(this).parents(".function:first").attr("func")=='matrix' || 
                   $(this).parents(".function:first").attr("func")=='pmatrix' || 
                   $(this).parents(".function:first").attr("func")=='determinant' || 
                   $(this).parents(".function:first").attr("func")=='binomial' || 
                   $(this).parents(".function:first").attr("func")=='piecewise') {
                  matdet = $(this).attr("func");
                }
                if(matdet!='' && $item.parents(".mat-box:first").hasClass('matend') && 
                   $(this).hasClass('matendmx')) {
                   renderstring = renderstring + ';';
                } else if($(this)[0] == $(this).parents(".func-box:first").find("."+mX+":last")[0] && !$(this).hasClass("endfunc")) {
                  renderstring = renderstring + ',';
                }
              }
            }
          })
        })
      }

      if(funcclose!='') {
        renderstring = renderstring + funcclose;
        matdet='';
      } else {
        return;
      }
      

    }

    var renderstring='',matdet='',html,$prev,randomnumber;
    function preRenderMML($elem, dir, disp) {
    // build appropriate div to hold unrendered and rendered code
      renderstring='';

      var $this = $elem;
      var $parent = $elem.parents("."+mXc);

      html = $elem.parents("."+mXc).html();

      $parent.find("."+mX+", .arginput").each(function() {
        closed='',wrap='';
        if($(this).attr("id")==mX || $(this).hasClass("rendered-mathscript") || $(this).hasClass("cycled"))  {
          return;
        }

        if($(this).hasClass("arginput")) {
          $this = $(this).parents(".function:last");
          var funcclose=')';
          if($this.hasClass("cycled")) {
            return;
          } else {
            passFunction($this);
          }
        } else {
          if($prev == undefined) {
            $prev = $(this);
          }
          renderCycle($(this));
          $prev = $(this);
        }
      });

      var $rendered = $('<span class="rendered-mathscript" contenteditable="false" display="'+disp+'"></span>');
      if((renderstring.split("(").length - 1) > (renderstring.split(")").length - 1)) {
        var diff = (renderstring.split("(").length - 1) - (renderstring.split(")").length - 1);
        for (var i = diff-1; i >= 0; i--) {
          renderstring = renderstring + ')';
        };
  console.log("diff: "+diff);
      }

      // remove space replacement to better accommodate symbols in render
      $rendered.attr('ms-unrendered', renderstring);
      $rendered.attr('ms-unrendered-html', html.replace(/(\r\n|\n|\r)/gm,"").replace(/\"/g,"'"));

      randomnumber=Math.floor(Math.random()*1001);

      $rendered.attr('match', randomnumber);

      $parent.append($rendered);

      $(".cycled").remove();
      $(".arg-holder").remove();

      renderMML($rendered,disp);
    }


    function renderCycle($elem) {
      var closed='',wrap='',paren='';

      if($elem.attr("subsup")!=undefined) {
        if($elem.attr("subsup")=='subsup') {
          renderstring = renderstring + '((';
        } else {
          renderstring = renderstring + '(';
        }
      }

      if($elem.parents(".exp-holder").length>0) {
        $elem.parents(".exp-holder:first").find("."+mX+":last").addClass("endexp");

        if($elem.index()==0 && !$elem.parents(".exp-holder:first").hasClass("cycled")) {

          if(renderstring.substr(renderstring.length-1,1) == '(') {
            renderstring = renderstring.substr(0,renderstring.length-1) + '^((';
          } else {
            renderstring = renderstring + '^(';
          }

          if($elem.parents(".exp-holder:first").next().hasClass("und-holder")) {
            if($prev.attr("rendername")!='' && $prev.attr("rendername")!='undefined' && $prev.attr("rendername")!=undefined) {
              var pos = renderstring.lastIndexOf($prev.attr("rendername"));
            } else {
              var pos = renderstring.lastIndexOf(trim($prev.text()));
            }
          }

        }
        $elem.parents(".exp-holder:first").addClass("cycled");
      }

      if($elem.parents(".und-holder").length>0 && $elem.index()==0) {
        $elem.parents(".und-holder:first").find("."+mX+":last").addClass("endund");

        if($elem.index()==0 && !$elem.parents(".und-holder:first").hasClass("cycled")) {

          if(renderstring.substr(renderstring.length-1,1) == '(') {
            renderstring = renderstring.substr(0,renderstring.length-1) + '_((';
          } else {
            renderstring = renderstring + '_(';
          }

          if($elem.parents(".und-holder:first").prev().hasClass("exp-holder")) {
            if($prev.attr("rendername")!='' && $prev.attr("rendername")!='undefined' && $prev.attr("rendername")!=undefined) {
              var pos = renderstring.lastIndexOf($prev.attr("rendername"));
            } else {
              var pos = renderstring.lastIndexOf($prev.text().trim());
            }
          }
        }

        $elem.parents(".und-holder:first").addClass("cycled");
      }


      if($elem.parents(".division").length>0) {
        $elem.parents(".division:first").addClass("cycled");

        if($elem.parents(".divisor").length>0) {
          $elem.parents(".divisor:first").find("."+mX+":first").addClass("begdivs");
          $elem.parents(".divisor:first").find("."+mX+":last").addClass("enddivs");

          if($elem.hasClass("begdivs")) {
            if($elem.parents(".division:first").parents(".paren:first").length>0 && 
               $elem.hasClass("begparen")) {
              renderstring = renderstring + paren;
              paren='';
            } 
            if($elem.parents(".division").length>1 && 
               $elem[0] == $elem.parents(".division:first").parents(":first").find("."+mX+":first")[0]) {
              for (var i = 0; i < $elem.parents(".division").length; i++) {
                renderstring = renderstring + '(';
              };
            } else {
              renderstring = renderstring + '(';
            }

          }

          if($elem.hasClass("enddivs")) {
            wrap = ')/';
          }
        } 

        if($elem.parents(".dividend").length>0) {
          $elem.parents(".dividend:first").find("."+mX+":last").addClass("enddivd");
          $elem.parents(".dividend:first").find("."+mX+":first").addClass("begdivd");

          if($elem.hasClass("begdivd")) {
            if(!$elem.hasClass("begdivs")) {
              renderstring = renderstring + '(';
            }
          }

          if($elem.hasClass("enddivd")) {
            wrap = ')';
          }
        }
      }


      if($elem.parent(".exp-holder").length>0 && $elem.hasClass("endexp")) {
        if($elem.parents(".exp-holder:first").next().hasClass("und-holder")) {
          closed = closed + '))';
        } else {
          closed = closed + '))';
        }
      } else if($elem.parent(".und-holder").length>0 && $elem.hasClass("endund")) {
        if($elem.parents(".und-holder:first").prev().hasClass("exp-holder")) {
          closed = closed + '))';
        } else {
          closed = closed + '))';
        }
      } 


      if($elem.attr("rendername")!='' && 
         $elem.attr("rendername")!='undefined' && 
         $elem.attr("rendername")!=undefined) {
        renderstring = renderstring + paren + ' ' + $elem.attr("rendername")+' ';
      } else if($elem.attr("data-srch")!='' && 
                $elem.attr("data-srch")!='undefined' && 
                $elem.attr("data-srch")!=undefined) {
        renderstring = renderstring + paren + ' ' + $elem.attr("data-srch")+' ';
      } else {
        var next_str = $elem.text().trim().replace("\\","\\\\");
        next_str = next_str.replace(",","\\,");
        next_str = next_str.replace("&#8203;","");
        next_str = next_str.replace("(","\\(");
        next_str = next_str.replace(")","\\)");
        renderstring = renderstring + paren + next_str;
      }

      if(closed!=undefined && closed!='') {
        renderstring = renderstring + closed;
      }

      if(wrap!=undefined) {
        renderstring = renderstring + wrap;
      }

      $elem.addClass("cycled");

      $prev = $elem;
    }

    function renderMML($elem, disp) {
      var string = $elem.attr("ms-unrendered");
      console.log("render string: "+string);
      // Execute Ajax code to render in MathML
      if(settings.mathJax==true || settings.mathJax=="demo") {
        $.ajax({
          url: "mathx/mathdb.php",
          data: {type: "render", value: string, display: disp},
          dataType: "text",
          type: "POST",
          success: function(data) {
            if(settings.mathJax=='demo') {
              $elem.html($elem.attr("ms-unrendered-html"));
              $(".rendereddemo").html(data);
              $(".rendereddemo").attr("ms-mathml",data);
              UpdateMath($(".rendereddemo")[0]);
            } else {
              $elem.html(data);
              $elem.attr("ms-mathml",data);
              UpdateMath($elem[0]);
            }
            return false;
          }
        });
      } else {
        $elem.html($elem.attr("ms-unrendered-html"));
      }
    }
  /* RENDERING FUNCTIONS - end */

  /* function to exit mX */
  function exitmX($elem,dir) {
//    mxMssgClose();
    $(".mxselectingbox").width(0).height(0);
    $(".mxselectionbox").remove();

    var disp='display';

    $elem.parents(".p").addClass("currentmath");
    $elem.parents("."+mXc).addClass("currentcontainer");
    $elem.parents("."+mXc).find("."+mX).attr("contenteditable","false");

    if(trim($(".currentcontainer").parents(".p:first").find(".text").text())!='') {
      disp = 'inline';
    }

    $("."+mXcl).remove();

    if($(".errormsg").length>0) {
      $(".errormsg").remove();
    }

    preRenderMML($elem,'exit',disp);

    $(".currentcontainer").attr("contenteditable","false");
    $(".currentcontainer").addClass("math-container-rendered");
    timeout = null;
    togglemX=0;
    
    $("."+mXparent).find("br:last").remove();
    $("."+mXparent).attr("contenteditable","true").find("p").append(space);
    placeCaretAtEnd($("."+mXparent).find("p:last")[0]);
//    $("."+mXparent).focus();

    $(".currentmath").removeClass("currentmath");
    $(".currentcontainer").removeClass("currentcontainer");
  }

  /* PLUGINS - various functions referenced above, but not necessarily my code or relevant to math */
      
    $.fn.reverse = [].reverse;
    
    function UpdateMath(elem){
      MathJax.Hub.Config({
        jax: ["output/HTML-CSS"],
        showMathMenu: false
      }),
      MathJax.Hub.Queue(
        ["Typeset",MathJax.Hub,elem]
      );

    };

    function trim (str, charlist) {
      var whitespace, l = 0,
        i = 0;
      str += '';

      if (!charlist) {
        // edit to remove normal spaces to allow them to remain
        whitespace = " \n\r\t\f\x0b\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
      } else {
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
      }

      l = str.length;
      for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
          str = str.substring(i);
          break;
        }
      }

      l = str.length;
      for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
          str = str.substring(0, i + 1);
          break;
        }
      }
      return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
    }

    $.fn.toEm = function(settings){
        settings = jQuery.extend({
            scope: 'body'
        }, settings);
        var that = parseInt(this[0],10),
            scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
            scopeVal = scopeTest.height();
        scopeTest.remove();
        return (that / scopeVal).toFixed(8);
    };

    function createCookie(name, value, days) {
      var expires;

      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      } else {
        expires = "";
      }
      document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
    }

    function readCookie(name) {
      var nameEQ = escape(name) + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
      }
      return null;
    }

    function eraseCookie(name) {
      createCookie(name, "", -1);
    }

    function doObjectsCollide(a, b) { // a and b are your objects
      var aTop = a.offset().top;
      var aLeft = a.offset().left;
      var bTop = b.offset().top;
      var bLeft = b.offset().left;

      return !(
        ((aTop + a.height()) < (bTop)) ||
        (aTop > (bTop + b.height())) ||
        ((aLeft + a.width()) < bLeft) ||
        (aLeft > (bLeft + b.width()))
      );
    }

    function checkMaxMinPos(a, b, aW, aH, bW, bH, maxX, minX, maxY, minY) {
      'use strict';

      if (a.left < b.left) {
        if (a.left < minX) {
          minX = a.left;
        }
      } else {
        if (b.left < minX) {
          minX = b.left;
        }
      }

      if (a.left + aW > b.left + bW) {
        if (a.left > maxX) {
          maxX = a.left + aW;
        }
      } else {
        if (b.left + bW > maxX) {
          maxX = b.left + bW;
        }
      }

      if (a.top < b.top) {
        if (a.top < minY) {
          minY = a.top;
        }
      } else {
        if (b.top < minY) {
          minY = b.top;
        }
      }

      if (a.top + aH > b.top + bH) {
        if (a.top > maxY) {
          maxY = a.top + aH;
        }
      } else {
        if (b.top + bH > maxY) {
          maxY = b.top + bH;
        }
      }

      return {
        'maxX': maxX,
        'minX': minX,
        'maxY': maxY,
        'minY': minY
      };
    }
  }); //this.each
}; // end mathX
