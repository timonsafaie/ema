// Constructs and place the smart menu based on type 
function makeMenu(randid,$elem,dbs,type,str) {
  var mXv = mxVarMap[randid];
  if(mXv.$mXparent.find("#"+aCc).length>0) {
    var $menu = $("#"+aCc);
  } else {
    var $menu = $('<div id="'+aCc+'"><div id="'+aCr+'"></div></div>');
  }

  if(type=='matrix') {
    var num_sumbols = 5;
    if(dbs.length>num_sumbols) {
      var results = "<div class='search_results search-left matmenu' style='width:"+(num_sumbols*50+80+2)+"px;' data-str='"+str+"' data-num="+num_sumbols+"><span class='resultsnav leftnav'>&#12296;</span><span class='resultsholder' style='width:"+num_sumbols*50+"px;'><span class='namerow'></span><span class='resultsrow' style='width:"+dbs.length*50+"px;'></span></span></div>";
    } else {
      var results = "<div class='search_results search-left matmenu' style='width:"+50*dbs.length+"px;' data-str='"+str+"' data-num="+num_sumbols+"><span class='resultsholder' style='width:100%;'><span class='namerow'></span><span class='resultsrow' style='width:"+dbs.length*50+"px;'></span></span></div>";      
    }

    $menu.find("#"+aCr).html(results);
    var mat=0;

    for (var i=0; i<dbs.length; i++){
      if(i==0) {
        var record = dbs[i], $result = $("<span class='symbol symbolfirst matbuilder' title='" + record.symbolname + "'" + '>' + record.symbol_rep + "</span>");
      } else {
        var record = dbs[i], $result = $("<span class='symbol matbuilder' title='" + record.symbolname + "'"+ '>' + record.symbol_rep + "</span>");
      }

      if(record.symbolname.indexOf(str)>-1 && mat==0) {
        $result.addClass('list-row-hover');

        setNamerow($menu,record.symbolname,str);

        mat=1;
      }
      $result.data('data', record);

      if($elem.offset().left <= ($(document.body).width()/2)) {
        $menu.find("#"+aCr+" .search_results .resultsrow").append($result);
      } else {
        $menu.find("#"+aCr+" .search_results .resultsrow").prepend($result);
        $menu.find("#"+aCr+" .search_results").removeClass("search-left").addClass("search-right");
      }
    }

    var elemleft, elemtop, postsleft=0, poststop=0;

    if (!$menu.is(":visible")){
      $menu.clearQueue().stop().show();
      if(dbs!=''){
        $elem.parents("."+mXc+":first").append($menu);
        $menu.fadeIn(100);
      }
      if(dbs==''){
        $menu.hide();
      }
    } else {
      if(dbs==''){
        $menu.hide();
      }
    }

    elemleft = $elem.offset().left;
    elemparleft = $elem.position().left;
    elemtop = $elem.offset().top;
    //parleft = $mXparent.offset().left;
    parleft = mXv.$mXparent.offset().left;
    partop = $elem.parents("."+mXc).offset().top;
    parwid = $elem.parents("."+mXc).width();
    menuh = $menu.find("#"+aCr).height();

    if($elem.offset().left <= ($(document.body).width()/2)) {
      $menu.css({"left": elemparleft+2, "top": elemtop-partop-menuh});
    } else {
      $menu.find("table.search_results").removeClass("search-left").addClass("search-right");
      $menu.css({"left": parwid-$("table.search_results").width()+$elem.width()+5, "top": partop-elemtop-50});
    }
  } else if(type=='arrow') {  

    var num_sumbols = 4;
    var results = "<span class='search_results search-left arrow_sm' style='width:"+(num_sumbols*50+80+2+40)+"px;' data-str='"+str+"' data-num="+num_sumbols+"><span class='resultsnav leftnav'>&#12296;</span><span class='resultsholder' style='width:"+num_sumbols*50+"px;'><span class='namerow'></span><span class='resultsrow resultsingle resulttarget' style='width:"+singleArrowArray.length*50+"px;'></span><span class='resultsrow resultdouble' style='width:"+doubleArrowArray.length*50+"px;'></span></span></span>";
    $menu.find("#"+aCr).html(results);

    $("<span class='arrowselector'><span class='matrixsymbol selector-row-hover ' data-type='single'>&rarr;</span><span class='matrixsymbol matrixsymbolright' data-type='double'>&rArr;</span></span>").insertAfter($menu.find(".leftnav"));

    for (var i=0; i<singleArrowArray.length; i++){
      if(i==0) {
        var record = singleArrowArray[i], $result = $("<span class='symbol symbolfirst list-row-hover' data-argumentorder='' title='"+singleArrowArray[i][1]+"'>" + singleArrowArray[i][0] + "</span>");
        setNamerow($menu,singleArrowArray[i][1],str);
      } else {
        var record = arrowArray[i], $result = $("<span class='symbol' data-argumentorder='' title='"+singleArrowArray[i][1]+"'>" + singleArrowArray[i][0] + "</span>");
      }
      $result.data('data', record);

      if($elem.offset().left <= ($(document.body).width()/2)) {
        $menu.find("#"+aCr+" .search_results .resultsrow.resultsingle").append($result);
      } else {
        $menu.find("#"+aCr+" .search_results .resultsrow.resultsingle").prepend($result);
        $menu.find("#"+aCr+" .search_results").removeClass("search-left").addClass("search-right");
      }
    }

    for (var i=0; i<doubleArrowArray.length; i++){
      if(i==0) {doubleArrowArray
        var record = doubleArrowArray[i], $result = $("<span class='symbol symbolfirst list-row-placeholder' data-argumentorder='' title='"+doubleArrowArray[i][1]+"'>" + doubleArrowArray[i][0] + "</span>");
      } else {
        var record = arrowArray[i], $result = $("<span class='symbol' data-argumentorder='' title='"+doubleArrowArray[i][1]+"'>" + doubleArrowArray[i][0] + "</span>");
      }
      $result.data('data', record);

      if($elem.offset().left <= ($(document.body).width()/2)) {
        $menu.find("#"+aCr+" .search_results .resultsrow.resultdouble").append($result);
      } else {
        $menu.find("#"+aCr+" .search_results .resultsrow.resultdouble").prepend($result);
        $menu.find("#"+aCr+" .search_results").removeClass("search-left").addClass("search-right");
      }
    }


    $menu.find(".search_results").append($("<span class='resultsnav rightnav'>&#12297;</span>"));

    var elemleft, elemtop, postsleft=0, poststop=0;

    if (!$menu.is(":visible")){
      $menu.clearQueue().stop().show();
      $elem.parents("."+mXc+":first").append($menu);
      $menu.fadeIn(100);
    }

    elemleft = $elem.offset().left;
    elemparleft = $elem.position().left;
    elemtop = $elem.offset().top;
    parleft = mXv.$mXparent.offset().left;
    partop = $elem.parents("."+mXc).offset().top;
    parwid = $elem.parents("."+mXc).width();
    menuh = $menu.find("#"+aCr).height();
    if($elem.offset().left <= ($(document.body).width()/2)) {
      $menu.css({"left": elemparleft, "top": elemtop-partop-menuh+10});
    } else {
      $menu.find(".search_results").removeClass("search-left").addClass("search-right");
      $menu.css({"left": parwid-$(".search_results").width()+$elem.width()+5, "top": elemtop-partop-menuh});
      $menu.find(".resultsingle").css("left",-parseInt($(".resultsingle").width())+(parseInt($(".search_results").attr("data-num"))*50));
      $menu.find(".resultdouble").css("left",-parseInt($(".resultdouble").width())+(parseInt($(".search_results").attr("data-num"))*50));
    }

  } else if(type=='pipes') {
    // offer pipe or double pipe here    

    
  } else {
    // generic menu
    menuSort(dbs);

    var num_sumbols = 5;
    var paginate=0;
    if(dbs.length>num_sumbols) {
      paginate=1;
      var results = "<span class='search_results search-left' style='width:"+(num_sumbols*50+80+2)+"px;' data-str='"+str+"' data-num="+num_sumbols+"><span class='resultsnav leftnav'>&#12296;</span><span class='resultsholder' style='width:"+num_sumbols*50+"px;'><span class='namerow'></span><span class='resultsrow resulttarget' style='width:"+dbs.length*50+"px;'></span></span></span>";
    } else {
      var results = "<span class='search_results search-left' style='width:"+50*dbs.length+"px;' data-str='"+str+"' data-num="+num_sumbols+"><span class='resultsholder' style='width:100%;'><span class='namerow'></span><span class='resultsrow' style='width:"+dbs.length*50+"px;'></span></span></span>";      
    }
    $menu.find("#"+aCr).html(results);

    for (var i=0; i<dbs.length; i++) {
      if(i==0) {
        var record = dbs[i], $result = $("<span class='symbol symbolfirst list-row-hover' title='" + record.symbolname + "'" + ' htmlcode="'+ record.arguments_table +'">' + record.symbol_rep + "</span>");
        setNamerow($menu,record.symbolname,str);
      } else {
        var record = dbs[i], $result = $("<span class='symbol' title='" + record.symbolname + "'"+ ' htmlcode="'+ record.arguments_table +'">' + record.symbol_rep + "</span>");
      }
      $result.data('data', record);

      if($elem.offset().left <= ($(document.body).width()/2)) {
        $menu.find("#"+aCr+" .search_results .resultsrow").append($result);
      } else {
        $menu.find("#"+aCr+" .search_results .resultsrow").prepend($result);
        $menu.find("#"+aCr+" .search_results").removeClass("search-left").addClass("search-right");
      }
    }

    if(dbs.length==1 && $menu.find("#"+aCr).find(".namerow").text().length>5) {
      if($menu.find("#"+aCr).find(".namerow span .resnamematch").text().length>4) {
        $menu.find("#"+aCr).find(".namerow span").html("<span class='resnamematch'>"+$menu.find("#"+aCr).find(".namerow span").text().substr(0,4)+"</span>...");
      } else {
        $menu.find("#"+aCr).find(".namerow span").html("<span class='resnamematch'>"+$menu.find("#"+aCr).find(".namerow span .resnamematch").text()+"</span>"+$menu.find("#"+aCr).find(".namerow span").text().substr($menu.find("#"+aCr).find(".namerow span .resnamematch").text().length,4-$menu.find("#"+aCr).find(".namerow span .resnamematch").text().length)+"...");
      }
    } else if($(".namerow span").width()>$(".resultsrow").width()) {
      var l = Math.floor(($(".resultsrow").width() / $(".namerow span").width()) * $(".namerow").text().length)-2;
      $menu.find("#"+aCr).find(".namerow span").html("<span class='resnamematch'>"+$menu.find("#"+aCr).find(".namerow span").text().substr(0,l)+"</span>...");
    }

    if(dbs.length>num_sumbols) {
      $menu.find(".search_results").append($("<span class='resultsnav rightnav'>&#12297;</span>"));
    }
    var elemleft, elemtop, postsleft=0, poststop=0;

    if (!$menu.is(":visible")) {
      $menu.clearQueue().stop().show();
      if(dbs!=''){
        $elem.parents("."+mXc+":first").append($menu);
        $menu.fadeIn(100);

      }
      if(dbs==''){
        $menu.hide();
      }
    } else {
      if(dbs==''){
        $menu.hide();
      }
    }

    elemleft = $elem.offset().left;
    elemparleft = $elem.position().left;
    elemtop = $elem.offset().top;
    //parleft = $mXparent.offset().left;
    parleft = mXv.$mXparent.offset().left;
    partop=0;
    if($elem.parents("."+mXc).offset()!=undefined) {
      partop = $elem.parents("."+mXc).offset().top;
    }
    parwid = $elem.parents("."+mXc).width();
    menuh = $menu.find("#"+aCr).height();
    if($elem.offset().left <= ($(document.body).width()/2)) {
      $menu.css({"left": elemparleft, "top": elemtop-partop-menuh+10});
    } else {
      $menu.find(".search_results").removeClass("search-left").addClass("search-right");
      $menu.css({"left": parwid-$(".search_results").width()+$elem.width()+5, "top": elemtop-partop-menuh});
      if(paginate>0) {
        $menu.find(".resultsrow").css("left",-parseInt($(".resultsrow").width())+(parseInt($(".search_results").attr("data-num"))*50));
      }
    }
  }

  if(type=='matrix') {
    $menu.find("input.mat-inp:first").focus();
  }

  $(mXv.$mXparent).on("mouseover mouseout", ".resultsnav", function(e) {
    if(e.type=="mouseover") {
      $(this).clearQueue().fadeTo("fast",.8);
    } else if(e.type=="mouseout") {
      $(this).clearQueue().fadeTo("fast",1);
    }
  })



}



function setNamerow($elem,name,str) {
  $elem.find(".namerow").html("<span nowrap>"+name.toLowerCase().replace(str.toLowerCase(),"<span class='resnamematch'>"+str.toLowerCase()+"</span>")+"</span>");
}

function endSearch(blur){
  s_prev = "";
  if ($("#"+aCc).delay(100).css("display")=='block'){
    $("#"+aCc).fadeOut(20, function() {
      $("#"+aCc).remove();
    });
  }
}

function menuSort(dbs) {
  // timon - take the db here and build an arroy sort.  then return sorted array.

  return dbs;
}

