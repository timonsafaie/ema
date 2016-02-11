/* auto replace some symbols */
function autocomplete(randid,$t,code,undo,srchstr) {

  /* auto insertion of symbols from hotkeys - OSX only? */
  if(code==8721 || code==8730 || code==8747 || code==8719 || code==175 || code==710) {
    var it=0;
    if(code==8721) {
      for (var i = 0; i < db.length; i++) {
        if(db[i].symbolname == 'sum') {
          it=i;
        }
      }
    }
    if(code==8730) {
      for (var i = 0; i < db.length; i++) {
        if(db[i].symbolname == 'sqrt') {
          it=i;
        }
      }
    }
    if(code==8747) {
      for (var i = 0; i < db.length; i++) {
        if(db[i].symbolname == 'integral') {
          it=i;
        }
      }
    }
    if(code==8719) {
      for (var i = 0; i < db.length; i++) {
        if(db[i].symbolname == 'product') {
          it=i;
        }
      }
    }
    if(code==175) {
      for (var i = 0; i < db.length; i++) {
        if(db[i].symbolname == 'bar') {
          it=i;
        }
      }
    }
    if(code==710) {
      for (var i = 0; i < db.length; i++) {
        if(db[i].symbolname == 'hat') {
          it=i;
        }
      }
    }

    /* if does't work, move back to main.js and replace all $t -> $this */
    var $func = $("<span class='func-holder'>"+db[it].arguments_table+"</span>");
    $func.append($("#"+aCc+" td.list-row-hover").attr("htmlcode"));
    $func.find(".arguments-table").css("min-width",'0px');
    if($func.find(".func-sqrt").length>0 && ($t.parents(".func-box").length>0 || $t.parents(".exp-holder").length>0 || $t.parents(".und-holder").length>0)) {
      $func.find(".func-sqrt").addClass('func-sqrt-func');
      $func.find(".func-symbol-sqrt").addClass('func-symbol-sqrt-func');
    }
    if($t.hasClass("exp")) {
      $func.css("padding-bottom","10px");
      $t.parent(".exp-holder").css("vertical-align","top");
    } else if ($t.hasClass("und")) {
      $func.css("padding-top","10px");
      $t.parent(".und-holder").css("vertical-align","bottom");
    } else if ($t.parents().hasClass('division')){
      $func.css("margin","3px 0px");
    }

    $func.find(".arginput").each(function() {
      if($(t).text()=='') {
        $func.find(".arginput").html(space);  
      }
    })

    $func.insertAfter($t);
    $t.remove();
    endSearch(true);
    renderFunction($func);
    relocateClose();
  }


  if(code==61) {                                                                                                                  // equals (<=,>=)
    if($t.prev().text()=='<') {
      $t.prev().html("&#8804;").attr("rendername","<=").attr("undo","<,=").css("padding","0px 0.2em");
      openBracket.pop();
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='-' && $t.prev().prev().text()=='!') {
      $t.prev().html("&#8802;").attr("rendername","not equivalent").attr("undo","!,-,=").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    } else if($t.prev().text()=='~') {
      $t.prev().html("&cong;").attr("rendername","approximately equal").attr("undo","~,=").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='?') {
      $t.prev().html("&#8799;").attr("rendername","question equal").attr("undo","?,=").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='-') {
      $t.prev().html("&equiv;").attr("rendername","identical").attr("undo","-,=").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='!') {
      $t.prev().html("&ne;").attr("rendername","not equals").attr("undo","!,=").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='>') {
      $t.prev().html("&#8805;").attr("rendername",">=").attr("undo",">,=").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } 
  }
  if(code==60) {                                                                                                                // open bracket (less than)
    if($t.prev().text()=='<') {
      $t.prev().html("&#8810;").attr("rendername","much less than").attr("undo","<,<").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==99) {                                                                                                                // c
    if($t.prev().attr("data-srch")=='c') {
      $t.prev().html("&#8728;").attr("rendername","ring operator").attr("undo","c,c").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==100) {                                                                                                                // d
    if($t.prev().attr("data-srch")=='d') {
      $t.prev().html("&part;").attr("rendername","partial derivative").attr("undo","d,d").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==65) {                                                                                                                // A
    if($t.prev().attr("data-srch")=='A') {
      $t.prev().html("&forall;").attr("rendername","for all").attr("undo","A,A").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==68) {                                                                                                                // D
    if($t.prev().attr("data-srch")=='D') {
      $t.prev().html("&nabla;").attr("rendername","nabla").attr("undo","D,D").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==69) {                                                                                                                // E
    if($t.prev().attr("data-srch")=='E') {
      $t.prev().html("&exist;").attr("rendername","there exists").attr("undo","E,E").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==67) {                                                                                                                // C
    if($t.prev().attr("data-srch")=='C') {
      $t.prev().html("&#8450;").attr("rendername","complex numbers").attr("undo","C,C").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==78) {                                                                                                                // N
    if($t.prev().attr("data-srch")=='N') {
      $t.prev().html("&#8469;").attr("rendername","natural numbers").attr("undo","N,N").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }

  if(code==90) {                                                                                                                // Z
    if($t.prev().attr("data-srch")=='Z') {
      $t.prev().html("&#8484;").attr("rendername","integers").attr("undo","Z,Z").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==81) {                                                                                                                // Q
    if($t.prev().attr("data-srch")=='Q') {
      $t.prev().html("&#8474;").attr("rendername","rational numbers").attr("undo","Q,Q").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==82) {                                                                                                                // R
    if($t.prev().attr("data-srch")=='R') {
      $t.prev().html("&#8477;").attr("rendername","double-struck real number").attr("undo","R,R").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==87) {                                                                                                                // W
    if($t.prev().attr("data-srch")=='W') {
      $t.prev().html("&#120142;").attr("rendername","double-struck W").attr("undo","W,W").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==72) {                                                                                                                // H
    if($t.prev().attr("data-srch")=='H') {
      $t.prev().html("&#8461;").attr("rendername","double-struck H").attr("undo","H,H").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==76) {                                                                                                                // L
    if($t.prev().attr("data-srch")=='L') {
      $t.prev().html("&#8466;").attr("rendername","laplacian").attr("undo","L,L").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==80) {                                                                                                                // P
    if($t.prev().attr("data-srch")=='P') {
      $t.prev().html("&#8472;").attr("rendername","power set").attr("undo","P,P").attr("data-srch","");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==111) {                                                                                                                // o
    if($t.prev().attr("data-srch")=='o') {
        // Special case to avoid during 'root'
        if ($t.prev().prev().attr('data-srch') != "r"){
            $t.prev().html("&infin;")
                    .attr("rendername","infinity")
                    .attr("undo","o,o")
                    .attr("data-srch","");
          undo.push(['auto',$t.prev()]);
          placeCaretAtEnd($t.prev()[0]);
          $t.remove();
        }
      return false;
    }
  }

  if(code==42) {                                                                                                                // asterisk
    if($t.prev().attr("rendername")=='times') {
      $t.prev().html("&centerdot;").attr("rendername","dot operator").attr("undo","*,*").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }	else {
      $t.html("&times;").attr("rendername","times").attr("undo","*");
      undo.push(['auto',$t]);
      placeCaretAtEnd($t[0]);
      return false;
    }
  }

  if(code==62) {                                                                                                                // closed bracket (greater than)
    if($t.prev().text()=='=' && $t.prev().prev().text()=='<') {
      $t.prev().html("&#x21D4;").attr("rendername","two point double arrow").attr("undo","<,=,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    } else if($t.prev().text()=='-' && $t.prev().prev().text()=='<') {
      $t.prev().html("&#8596;").attr("rendername","two point arrow").attr("undo","<,-,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    } else if($t.prev().text()=='=' && $t.prev().prev().text()=='=') {
      $t.prev().html("&#10233;").attr("rendername","long right double arrow").attr("undo","=,=,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    } else if($t.prev().text()=='-' && $t.prev().prev().text()=='-') {
      $t.prev().html("&#10230;").attr("rendername","long right arrow").attr("undo","-,-,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    } else if($t.prev().text()=='-' && $t.prev().prev().text()=='|') {
      $t.prev().html("&#x21A6;").attr("rendername","?? arrow").attr("undo","|,-,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    } else if($t.prev().text()=='=') {
      $t.prev().html("&#8658;").attr("rendername","right double arrow").attr("undo","=,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='-') {
      $t.prev().html("&rarr;").attr("rendername","right arrow").attr("undo","-,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='>') {
      $t.prev().html("&#8811;").attr("rendername","much greater than").attr("undo",">,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } 
  }
  if(code==124) {                                                                                                                // pipe
    if($t.prev().text()=='|') {
      $t.prev().html("&#8214;").attr("rendername","double pipe").attr("undo","|,|");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
//          return false;
    } 
  }
  if(code==45) {                                                                                                                // minus

    if($t.prev().text()=='<') {
      $t.prev().html("&larr;").attr("rendername","left arrow").attr("undo","<,-").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      openBracket.pop();
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='+') {
      $t.prev().html("&#177;").attr("rendername","plus minus").attr("undo","+,-").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='~' && $t.prev().prev().text()=='!') {
      $t.prev().html("&#8772;").attr("rendername","not similar").attr("undo","!,~,-").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    } else if($t.prev().text()=='~') {
      $t.prev().html("&#8771;").attr("rendername","similar").attr("undo","~,-").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if(($t.prev().html()=='-') && ($t.prev().prev().attr("data-srch")=='h')) {
      $t.prev().prev().html("&#x210f;").attr({"rendername":"h bar", "undo": "h,-,-"}).css("padding","0px 0.2em");
      undo.push(['auto',$t.prev().prev()]);
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev().prev()[0]);
      $t.prev().remove();
      $t.remove();
      return false;
    } 
  }
  if(code==126) {                                                                                                                // tilde
    if($t.prev().text()=='<') {
      $t.prev().html("&#8818;").attr("rendername","less than or equivalent").attr("undo","~,<").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='>') {
      $t.prev().html("&#8819;").attr("rendername","more than or equivalent").attr("undo","~,>").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='~' && $t.prev().prev().text()=='!') {
      $t.prev().html("&#8777;").attr("rendername","not almost equal").attr("undo","!,~,~").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    } else if($t.prev().text()=='~') {
      $t.prev().html("&#8776;").attr("rendername","almost equal").attr("undo","~,~").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } 
  }
  if(code==43) {                                                                                                                  // plus
    if($t.prev().text()=='-') {
      $t.prev().html("&#8723;").attr("rendername","minus plus").attr("undo","-,+").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==58) {                                                                                                                  // colon
    if($t.prev().text()=='-') {
      $t.prev().html("&divide;").attr("rendername","divided by").attr("undo","-,:").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    } else if($t.prev().text()=='.') {
      $t.prev().html("&#8757;").attr("rendername","because").attr("undo",".,:").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }
  }
  if(code==46) {                                                                                                                  // period
    if($t.prev().text()==':') {
      $t.prev().html("&#8756;").attr("rendername","therefore").attr("undo",":,.").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.remove();
      return false;
    }	else if($t.prev().text()=='.' && $t.prev().prev().text()=='.') {
      $t.prev().html("&#8943;").attr("rendername","midline horizontal ellipsis").attr("undo",".,.,.").css("padding","0px 0.2em");
      undo.push(['auto',$t.prev()]);
      placeCaretAtEnd($t.prev()[0]);
      $t.prev().prev().remove();
      $t.remove();
      return false;
    }
  }
}


/* character map used to set unicode symbol for letters and also set padding for typesetting */
function charMap(code) {
  if(code==32) { return ["&nbsp;",'0 0 0 0']; } // space

  if(code==65 || code=='A') { return ["&#x1d434;",'0 0 0 0']; } // A
  if(code==66 || code=='B') { return ["&#x1d435;",'0 .17em 0 0']; }
  if(code==67 || code=='C') { return ["&#x1d436;",'0 .1em 0 0']; }// C
  if(code==68 || code=='D') { return ["&#x1d437;",'0 .1em 0 0']; }
  if(code==69 || code=='E') { return ["&#x1d438;",'0 .12em 0 0']; }// E
  if(code==70 || code=='F') { return ["&#x1d439;",'0 .14em 0 0']; }
  if(code==71 || code=='G') { return ["&#x1d43a;",'0 .12em 0 0']; }// G
  if(code==72 || code=='H') { return ["&#x1d43b;",'0 .13em 0 0']; }
  if(code==73 || code=='I') { return ["&#x1d43c;",'0 .13em 0 0']; }// I
  if(code==74 || code=='J') { return ["&#x1d43d;",'0 .15em 0 0']; } // J
  if(code==75 || code=='K') { return ["&#x1d43e;",'0 .15em 0 0']; }
  if(code==76 || code=='L') { return ["&#x1d43f;",'0 .08em 0 0']; }// L
  if(code==77 || code=='M') { return ["&#x1d440;",'0 .13em 0 0']; }
  if(code==78 || code=='N') { return ["&#x1d441;",'0 .13em 0 0']; }// N
  if(code==79 || code=='O') { return ["&#x1d442;",'0 .11em 0 0']; }
  if(code==80 || code=='P') { return ["&#x1d443;",'0 .1em 0 0']; }// P
  if(code==81 || code=='Q') { return ["&#x1d444;",'0 .09em 0 0']; }
  if(code==82 || code=='R') { return ["&#x1d445;",'0 .03em 0 0']; }// R
  if(code==83 || code=='S') { return ["&#x1d446;",'0 .11em 0 0']; }
  if(code==84 || code=='T') { return ["&#x1d447;",'0 .14em 0 0']; } // T
  if(code==85 || code=='U') { return ["&#x1d448;",'0 .16em 0 0']; }
  if(code==86 || code=='V') { return ["&#x1d449;",'0 .16em 0 0']; }// V
  if(code==87 || code=='W') { return ["&#x1d44a;",'0 .16em 0 0']; }
  if(code==88 || code=='X') { return ["&#x1d44b;",'0 .16em 0 0']; }// X
  if(code==89 || code=='Y') { return ["&#x1d44c;",'0 .17em 0 0']; }
  if(code==90 || code=='Z') { return ["&#x1d44d;",'0 .17em 0 0']; }// Z

  if(code==97 || code=='a') { return ["&#x1D44E;",'0 .08em 0 0']; } // a
  if(code==98 || code=='b') { return ["&#x1d44f;",'0 .1em 0 0']; }
  if(code==99 || code=='c') { return ["&#x1d450;",'0 .12em 0 0']; }
  if(code==100 || code=='d') { return ["&#x1d451;",'0 .1em 0 0']; }
  if(code==101 || code=='e') { return ["&#x1d452;",'0 .1em 0 0']; }
  if(code==102 || code=='f') { return ["&#x1d453;",'0 .15em 0 .13em']; }
  if(code==103 || code=='g') { return ["&#x1d454;",'0 .1em 0 .03em']; } 
  if(code==104 || code=='h') { return ["&#8462;",'0 .05em 0 0']; }
  if(code==105 || code=='i') { return ["&#x1d456;",'0 .1em 0 0']; }
  if(code==106 || code=='j') { return ["&#x1d457;",'0 .09em 0 .07em']; } // j
  if(code==107 || code=='k') { return ["&#x1d458;",'0 .1em 0 0']; }
  if(code==108 || code=='l') { return ["&#x1d459;",'0 .15em 0 0']; }
  if(code==109 || code=='m') { return ["&#x1d45a;",'0 .05em 0 0']; } // m
  if(code==110 || code=='n') { return ["&#x1d45b;",'0 .05em 0 0']; }
  if(code==111 || code=='o') { return ["&#x1d45c;",'0 .08em 0 0']; }
  if(code==112 || code=='p') { return ["&#x1d45d;",'0 .1em 0 .07em']; }
  if(code==113 || code=='q') { return ["&#x1d45e;",'0 .12em 0 0']; }
  if(code==114 || code=='r') { return ["&#x1d45f;",'0 .11em 0 0']; }
  if(code==115 || code=='s') { return ["&#x1d460;",'0 .11em 0 0']; }
  if(code==116 || code=='t') { return ["&#x1d461;",'0 .15em 0 0']; }  // t
  if(code==117 || code=='u') { return ["&#x1d462;",'0 .08em 0 0']; }
  if(code==118 || code=='v') { return ["&#x1d463;",'0 .12em 0 0']; }
  if(code==119 || code=='w') { return ["&#x1d464;",'0 .1em 0 0']; }
  if(code==120 || code=='x') { return ["&#x1d465;",'0 .05em 0 0']; }
  if(code==121 || code=='y') { return ["&#x1d466;",'0 .06em 0 0']; }
  if(code==122 || code=='z') { return ["&#x1d467;",'0 .07em 0 0']; }

  if(code==60 || code=='<') { return ["<",'0 .2em']; } // <
  if(code==62 || code=='>') { return [">",'0 .2em']; } // >

  if(code==42 || code=='*') { return ["&#8727",'0 .2em']; } // *
}

function renderFunction($elem) {
  if($elem.hasClass("brack-holder")) {
    $elem.find("#"+mX).focus();
    return false;
  }
  var funccall = $elem.find(".arginput").attr("func");

  $elem.find(".function").attr("func",funccall);
  placeCaretAtEnd($elem.find(".func-box[order=1]").find(".arginput")[0]);
}
