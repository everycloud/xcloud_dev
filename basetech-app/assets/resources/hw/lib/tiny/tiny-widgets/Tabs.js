define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-widgets/Widget", "language/widgetsLanguage"], 
function(angular, jQuery, Widget, widgetsLanguage) {
    var Tabs = Widget.extend({
        "init" : function(options) {
            var TabsThis = this;
            TabsThis._super(options);
            TabsThis._setContainer();
            TabsThis._addBehavior();
        },
        
        "_setContainer" : function() {
            var TabsThis = this;
            var $Container = $('#' + TabsThis.options["id"]);
            TabsThis._element = $Container;
            //find dom container && headDom
            if($Container.hasClass("tiny-tabs-container")){
                TabsThis.domWrapper = $Container;
            } else {
                TabsThis.domWrapper = $Container.find(".tiny-tabs-container");
            }
            TabsThis.headDom = $Container.find(".tiny-tabs-titles");
            
            //set position wrapper
            TabsThis.options.position = "top";
            TabsThis.style = "horizon";
            if(TabsThis.domWrapper.hasClass("tiny-tabs-bottom")){
                TabsThis.options.position = "bottom";
            }
            if(TabsThis.domWrapper.hasClass("tiny-tabs-left")){
                TabsThis.options.position = "left";
                TabsThis.style = "vertical";
            }
            if(TabsThis.domWrapper.hasClass("tiny-tabs-right")){
                TabsThis.options.position = "right";
                TabsThis.style = "vertical";
            }
            
            //change && set tab title/content 
            if(TabsThis.headDom){
                TabsThis.contentDom = $Container.find(".tiny-tabs-content");
                TabsThis._setHead(TabsThis.headDom);
            }
        },
        
        "_setHead" : function(headDom) {
            var TabsThis = this;
            var options = TabsThis.options;
            var $ul = headDom.find("ul");
            $ul.attr("id", "tab_head");
            $ul.addClass("ui-state-tabs-ul");
            var liDom = [], indexI =0; TabsThis.disabled = [];
            TabsThis.activeId = "";
            TabsThis.elementId = [];
            TabsThis.singleId = [];
            TabsThis.tooltip = [];
            TabsThis.tabsOption = [];
            TabsThis.closeId = [];
            liDom = $ul.eq(0).children();
            if("true" === String(options["more"])) {
                TabsThis.moreId=[];
                $ul.append('<li liindex=limore id="limore" class="tabs-more"><span class="tinyTab-tab-left"></span><div id="centermore " class="tinyTab-tab-center"><a id="licentermore" class="tinyTab-a" title="">'+
                 widgetsLanguage.moreTitle+'</a><span class="tinyTab-arrow-hover"></span></div><span class="tinyTab-tab-right"></span><div id = "tiny-moreli-div" class="tabs-arrow-div" style="display:none;"><ul></ul></div></li>');
            }
            var delay = false, closable = false;
            for(var i = 0, len = liDom.length; i < len; i++) {
                if (liDom[i].tagName == "LI") {
                    var $liDomI = $(liDom[i]), isActive = false;
                    var $liDomA = $liDomI.find("a");
                    var $liDomClone = $liDomA.clone();
                    //add Class&&set Content
                    indexI++;
                    index = indexI +"";
                    $liDomI.attr("liIndex", "li"+index);
                    TabsThis.elementId.push(index);
                    if(($liDomA.attr("active") === "true") && TabsThis.activeId === "" && String(TabsThis.options.setActiveClass) !== "true"){
                        $liDomI.addClass("tinyTabActive");
                        isActive = true;
                        TabsThis.activeId = index;
                    }
                    
                    if(String($liDomA.attr("disable")) == "true"){
                        $liDomI.addClass("ui-state-disabled");
                        TabsThis.disabled.push(index);
                    }
                    
                    //generate left && right span
                    $liDomI.prepend($('<span class="tinyTab-tab-left"></span>'));
                    $liDomI.append($('<span class = "tinyTab-tab-right"></span>'));
                    
                    //set center a
                    $liDomA.attr("aIndex", "licenter"+index);
                    $liDomA.addClass("tinyTab-a");
                    if(String(TabsThis.options["closable"]) === "true"){
                        
                        //set DIV wrapper close
                        $liDomA.wrap('<div id="center'+index+'" class="tinyTab-tab-center"></div>');
                        $liDomA.after('<span class="ui-icon-close" closeid='+index+'></span>');
                        closable = true;
                        TabsThis.closeId.push(index);
                    } else {
                        $liDomA.addClass("tinyTab-tab-center");
                    }
                    var liAUrl = $liDomA.attr("url");
                    if(liAUrl){
                        TabsThis._setContent(liAUrl, index, isActive, delay);
                    }
                    TabsThis.tabsOption.push({"tabId" : index, "title": $liDomA.text(), "contentUrl" : liAUrl});
                }
            }
            if(("true" === String(options["more"])) && ("horizon" == TabsThis.style)) {
                //calculate && set  horizon/vertical tab
                TabsThis._horizonUpdate();
            }
            if("vertical" == TabsThis.style) {
                TabsThis.headDom.css("width", "114px");
                TabsThis._verticalUpdate();
            }
            //set Active 
            if((TabsThis.activeId === "") && (String(TabsThis.options.setActiveClass) !== "true")){
                TabsThis.activeId = _.difference(TabsThis.elementId,TabsThis.disabled)[0];
                TabsThis._element.find("[liindex='li"+TabsThis.activeId+"']").addClass("tinyTabActive");
            }
            TabsThis._setActiveContent(TabsThis.activeId);
            
            //add tooltips
            TabsThis._tipUpdate(false);
            
            if("true" == String(options.more)) {//set moreli position
                if(("vertical" == TabsThis.style) && (0 != TabsThis.moreId.length)) {
                    TabsThis._setVerticalMore(); 
                }
                if(("bottom" == TabsThis.options["position"]) && (0 != TabsThis.moreId.length)) {
                    TabsThis._setBottomMore();
                }
            }
        },
        
        "_setContent" : function(anchor, index, isActive, delay) {
            var TabsThis = this, $outerDiv = $("<div id='" + index + "'></div>");
            TabsThis.contentDom.append($outerDiv);
            
            // inline tab content
            if (anchor[0] === "#") {
                
                //for those such as CirqueChart please use url path not #...
                content = TabsThis.contentDom.find(anchor);
                $outerDiv.append(content);
                var anchorObj = _.where(TabsThis.tabsOption, {"tabId" : index});
                anchorObj.contentUrl = true;
            }
            if (!isActive) {
                $outerDiv.css("display", "none");
            }
        },
        
        "_setActiveContent" : function(activeId){
            if(activeId == "") {
                return;
            }
            var TabsThis = this;
            var anchorObj = _.where(TabsThis.tabsOption, {"tabId" : activeId}),
            $contentDiv = TabsThis._element.find("#"+activeId);
            $contentDiv.css("display","block");
            var anchor = anchorObj[0].contentUrl;
            if((true === anchor) || (typeof anchor === "undefined")){
                return;
            }
            if(0 !== anchorObj.length){
                
                // inline tab content
                if (anchor[0] === "#") {
                    content = TabsThis.contentDom.find(anchor);
                    $contentDiv.append(content);
                    return;

                // remote tab content
                } else {
                   $contentDiv.load(anchor);
                }
            }
            anchorObj.contentUrl = true;
        },
        
       //为过长页签添加tooltip
       "_tipUpdate" : function(tinytip) {
              var TabsThis = this, tooltipObj = TabsThis.tooltip;
              if(0 !== tooltipObj.length){
                   for(var i =0; i < tooltipObj.length; i++) {
                 var $selectortootip = TabsThis._element.find("[aindex='licenter"+tooltipObj[i].tipId+"']"),
                   title = tooltipObj[i].tipValue;
                   $selectortootip.attr("title", title);
             }    
           }
       },
              
       "_horizonUpdate" : function() {
            var TabsThis = this, options = TabsThis.options, totalWidth = TabsThis._element.find("#tab_head").parent().width(),
            moreFlag = false, addWidth = 0, addWidthNext = 0;
            TabsThis.moreTitleWidth = TabsThis._element.find("#limore").width();
            TabsThis.moreliWidth = TabsThis._element.find("#tiny-moreli-div").width();
            TabsThis._element.find("#limore").hide();
            TabsThis.hcenterMaxWidth = 1200;
            if(options.maxwidth){
                var width = parseInt(options.maxwidth,10);
                if((!isNaN(width)) && width > 20){
                    TabsThis.hcenterMaxWidth = width-20;
                }
            }
            var headHeight = TabsThis._element.find("#tab_head").height();
            TabsThis.maxWidth = 0;
            if(headHeight > 35) {
                TabsThis._element.find("#limore").css("display", "block");
                //set more & single DOM
                for (var i = 0; i < TabsThis.elementId.length; i++) {
                    var id = TabsThis.elementId[i],
                    width = TabsThis._element.find("[liindex='li"+id+"']").width(),
                    $aDom = TabsThis._element.find("[aindex='licenter"+id+"']");
                    var centerWidth = $aDom.width(),
                    obj = _.where(TabsThis.tabsOption, {"tabId" : id});
                    obj[0].width = width;
                    addWidth += width;
                    if(width > TabsThis.maxWidth) {
                        TabsThis.maxWidth = width;
                    }
                    if(centerWidth > TabsThis.hcenterMaxWidth) {
                        TabsThis.tooltip.push({"tipId" : id, "tipValue" : obj[0].title});
                    }
                    
                    //set more
                    if ((TabsThis.moreliWidth + addWidth + 10 > totalWidth)) {
                        TabsThis.moreId.push(id);
                        TabsThis._element.find("[liindex='li"+id+"']").hide();
                        TabsThis._element.find("#limore"+id).show();
                        moreFlag = true;
                    } else {


                        //set single
                        TabsThis.singleId.push(id);
                        TabsThis._element.find("#limore"+id).hide();
                   }
                   $aDom.css({"max-width": "84px","white-space": "nowrap","text-overflow": "ellipsis","-o-text-overflow": "ellipsis","overflow": "hidden"});    


               }
            } else {
                for (var i = 0; i < TabsThis.elementId.length; i++) {
                    var id = TabsThis.elementId[i],
                    centerWidth = TabsThis._element.find("[aindex='licenter"+id+"']").width(),
                    $aDom = TabsThis._element.find("[aindex='licenter"+id+"']");
                    var centerWidth = $aDom.width(),
                    obj = _.where(TabsThis.tabsOption, {"tabId" : id});
                    if(width > TabsThis.maxWidth) {
                        TabsThis.maxWidth = width;
                    }
                    if(centerWidth > TabsThis.hcenterMaxWidth) {
                        TabsThis.tooltip.push({"tipId" : id, "tipValue" : obj[0].title});
                    }
                    $aDom.css({"max-width": TabsThis.hcenterMaxWidth,"white-space": "nowrap","text-overflow": "ellipsis","-o-text-overflow": "ellipsis","overflow": "hidden"});
                }
                TabsThis.moreId = [];
                TabsThis.singleId = TabsThis.elementId;
                for(var i = 0; i < TabsThis.singleId.length; i++) {
                    var id = TabsThis.singleId[i];
                    TabsThis._element.find("#limore"+id).css("display" , "none");
                }
             
            }
            TabsThis.totWidth = TabsThis._element.find("#tab_head").width() - TabsThis.moreTitleWidth + TabsThis.moreliWidth + 2;
            TabsThis._element.css("min-width", (TabsThis.moreliWidth+110)+"px");
       },
       
       "_setBottomMore" : function() {
            var TabsThis = this;
            var moreliWidth = TabsThis._element.find("#tiny-moreli-div").height() + 35;
            TabsThis._element.find("#tiny-moreli-div").css("margin-top", -moreliWidth + "px");
       },
       
       "_verticalUpdate" : function() {
           var TabsThis = this, maxId, verticalId = [], options = TabsThis.options,
           totalNum = TabsThis.elementId.length, maxWidth = 0, maxCenterWidth = 0,
           totalHeight = TabsThis._element.height(),
           putNum = Math.floor(totalHeight/33);
           TabsThis.singleId = TabsThis.elementId;
           TabsThis.leftContentSub = 13;
           TabsThis.rightContentSub = 16;
           
           //set Max Width
           for(var i = 0; i < totalNum; i++) {
               var id = TabsThis.elementId[i],
               width = TabsThis._element.find("[liindex='li"+id+"']").width(),
               centerWidth = TabsThis._element.find("[aindex='licenter"+id+"']").width(),
               obj = _.where(TabsThis.tabsOption, {"tabId" : id});
               obj[0].width=width;
               TabsThis.vcenterMaxWidth = 79;
               if(maxCenterWidth < centerWidth) {
                   maxCenterWidth = centerWidth;
                   maxId = id;
               }
               if("right" == options["position"]) {
                     TabsThis.vcenterMaxWidth = 74; 
               }
               if(centerWidth > TabsThis.vcenterMaxWidth) {
                   TabsThis.tooltip.push({"tipId" : id, "tipValue" : obj[0].title});
               }
           }
           var maxWidth = TabsThis._element.find("[liindex='li"+maxId+"']").width(),
           singleCenterWidth = TabsThis._element.find("[aindex='licenter"+maxId+"']").width(); 
           
           // set height 
           var paddingHeight = 4;
           TabsThis.headDom.css("height", totalHeight-paddingHeight);
           TabsThis._element.find(".tiny-tabs-content").css("height", totalHeight-paddingHeight);
           if("true" == String(options.more)) {
               TabsThis.moreId = [];
               if(putNum >= totalNum) {
                   TabsThis._element.find("#limore").hide();
               } else {//处理more下拉列表中内容
                  var moreNum = totalNum - putNum + 1;
                  verticalId = _.without(TabsThis.elementId,TabsThis.activeId);
                  verticalIndex = verticalId.length - 1;
                  for(var i = 0; i < moreNum; i++) {
                      var id = verticalId[verticalIndex-i];
                      TabsThis._element.find("[liindex='li"+id+"']").hide();
                      TabsThis._element.find("#limore"+id).show();
                      TabsThis.singleId = _.without(TabsThis.singleId, id);
                      TabsThis.moreId.push(id);
                  }
             }
           
              //有"more"时的宽度, 处理"关闭"
             if( 0 != TabsThis.moreId.length) {//有more时
                  if(0 !== TabsThis.closeId.length) {//可关闭
                   TabsThis._element.find("#licentermore").css("width", singleCenterWidth + "px");
                  } else {//不可关闭  
                         TabsThis._element.find("#licentermore").css("min-width", singleCenterWidth - 13 + "px");
                  }
                  
                  //add padding 10px--verticalMore
                  TabsThis.vertMaxWidth = maxWidth + 10;
               }
           }
           
           
           if("left" == options["position"]) {
               
              //IE 将左边标题的总宽度进行设置
              if(!+[1,]) { 
                  maxWidth -= 2;
              }  
                 maxWidth += 27;
           }
           if("right" == options["position"]) {
                 maxWidth += 2;
           }
           
           //IE下，不可关闭的  maxWidth-12，按规律计算
           var liMinWidth = 94;
           TabsThis.headDom.css("width", maxWidth);
           for(var i = 0; i < totalNum; i++) {
              var id = TabsThis.elementId[i];
              TabsThis._element.find("[aindex='licenter"+id+"']").css("width", singleCenterWidth+"px");
           }
       },
       
       "_setVerticalMore" : function() {
              var TabsThis = this, options = TabsThis.options,
              $moreDiv = TabsThis._element.find("#tiny-moreli-div");
              
              //set more position
              if("right" == options["position"]) {
               var moreliWidth = $moreDiv.width(), moreliHeight = $moreDiv.height();  
                     $moreDiv.css("margin-top", -moreliHeight-11 + "px");
                     $moreDiv.css("margin-left", -moreliWidth + "px");
              }
              if("left" == options["position"]) {
                    $moreDiv.css("margin-left", TabsThis.vertMaxWidth - 2 + "px");
                    $moreDiv.css("margin-right", -TabsThis.vertMaxWidth-35 + "px");
                    var moreliHeight = $moreDiv.height() + 10;
                    $moreDiv.css("margin-top", -moreliHeight + "px");
              }
       },
       
        //method——change active state
        "opActive" : function($activeDom) {
            var TabsThis = this;
            
            //如果没有传参，取出处于active状态的jquery对象(a标签)
            if( 0 === arguments.length ) {
                var objActive = TabsThis._element.find("[liindex='li"+TabsThis.activeId+"']");
                    return objActive;
                } else { 
               
                //对处于disabled状态的不进行处理
                if($activeDom.attr("disabled") === "true") {
                    return;
                }
                var $activeDomli = $activeDom.closest("li");
                if($activeDomli.hasClass("tinyTabActive")){
                    return;
                }
               
                //关闭现在处于激活状态的内容
                TabsThis._element.find("#" +TabsThis.activeId).hide(); 
                TabsThis._element.find("[liindex='li"+TabsThis.activeId+"']").removeClass("tinyTabActive"); 
                var tabId = $activeDom.attr("aindex").substring(8);
                TabsThis.activeId = tabId;
               
                //处理active属性,如果是MORE下拉列表中的页签
                if(_.contains( TabsThis.moreId, tabId )) {
                    TabsThis._changeMore();
                } else {
                    TabsThis._element.find("[liindex='li"+tabId+"']").addClass("tinyTabActive");
                }
                TabsThis._element.find("#"+tabId).show(); 
                TabsThis._setActiveContent(tabId);
           }
       },   
       
       //change more title
       "_changeMore" : function() {
           var TabsThis = this,
           //将more中的内容生成为headTab
           hideId = TabsThis.singleId[TabsThis.singleId.length-1];
           TabsThis._element.find("[liindex='li"+hideId+"']").hide();
           TabsThis._element.find("#limore"+hideId).show();
           TabsThis._element.find("[liindex='li"+TabsThis.activeId+"']").css("display", "block").addClass("tinyTabActive");
           
           TabsThis._element.find("#limore"+TabsThis.activeId).hide();
           TabsThis._element.find("#" +TabsThis.activeId).show();
           TabsThis._setActiveContent(TabsThis.activeId);
           
           //set singleId
           TabsThis.singleId = _.without(TabsThis.singleId, hideId);
           TabsThis.singleId.push(TabsThis.activeId);
           
           //set moreId
           TabsThis.moreId = _.without(TabsThis.moreId, TabsThis.activeId);
           TabsThis.moreId.push(hideId);
       },
      
       "_tabChange" : function(event, ethis, isMouse) {
           var moreFlag = false,
           TabsThis = this;
           eTarget = $(ethis);
           TabsThis.dropDiv = TabsThis._element.find(".tabs-arrow-div");
           
           //is more li more
           if("true" == String(TabsThis.options.more) && ("tab_head" != $(eTarget[0].parentNode).attr("id"))) {
               moreFlag = true;
               clickId = eTarget.attr("liindex").substring(6);
           } else {
               clickId = eTarget.attr("liindex").substring(2);
           }
           if( _.contains(TabsThis.disabled, clickId )) {
               return;
           }
          
          //如果点击的条目已关闭
          if( 0 == TabsThis._element.find("[liindex='li"+clickId+"']").length ) {
             return;
          }
         
         //is more    !!more
         if("true" == String(TabsThis.options.more) && ("more" == clickId)) {
            
             //event stop
             TabsThis._stopEvent(event);
             if(isMouse) {
                eTarget.addClass("tinyTabActive");
                TabsThis.dropDiv.css("display","block");
                return;
            }
            if( "none" == TabsThis.dropDiv.css("display") ) {
                eTarget.addClass("tinyTabActive");
                TabsThis.dropDiv.css("display","block");
            } else {
                eTarget.removeClass("tinyTabActive");
                TabsThis.dropDiv.css("display","none");
            }
          } else {
              
            //mouse && on more li
            if(isMouse && moreFlag) {
                return;
            }
            TabsThis._element.find("[liindex='li"+TabsThis.activeId+"']").removeClass("tinyTabActive");
            if(TabsThis.activeId !== ""){
                TabsThis._element.find("#" +TabsThis.activeId).css("display","none");
            }
            
            //is more li
            if(moreFlag) {
                TabsThis.activeId = clickId;
                TabsThis._changeMore();
            } else {
                //is single li
                TabsThis.activeId = clickId;
                eTarget.addClass("tinyTabActive");
                TabsThis._setActiveContent(TabsThis.activeId);
                if(isMouse && ( "block" == TabsThis.dropDiv.css("display") )) {
                    TabsThis._element.find("#limore").removeClass("tinyTabActive");
                    TabsThis.dropDiv.css("display","none");
                }
            }
            
            //change事件触发
            TabsThis.trigger("changeEvt",event);
         }
       },
    
       "_clickMoreli" : function(clickId) {
           var TabsThis = this;
           TabsThis._element.find("#li" +TabsThis.activeId).removeClass("tinyTabActive");
           TabsThis._element.find("#" +TabsThis.activeId).css("display","none");
           TabsThis.activeId = clickId;
           TabsThis._changeMore();
           
           //change事件触发
           TabsThis.trigger("changeEvt");
       },
       
       "_stopEvent" : function(event) {
           if (event.stopPropagation) {
               event.stopPropagation();
           } else {
               event.cancelBubble = true;
           }
       },
       
       //change more state
       "_hideMore" : function() {
           var TabsThis = this;
           if("block" == TabsThis._element.find("#limore").css("display")) {
               TabsThis._element.find("#tiny-moreli-div").css("display", "none");
               TabsThis._element.find("#limore").removeClass("tinyTabActive");
           }
       },
       
       "_addBehavior" : function() {
            var TabsThis = this,options = TabsThis.options;
            if("true" === String(options["more"])){
            //window resize
            $(window).resize( function() {
                TabsThis._hideMore();
                if("vertical" == TabsThis.style) {
                    return;
                }
                var resizeWidth = TabsThis.headDom.width(),
                changeWidth = resizeWidth - TabsThis.totWidth, changeNum = 0;
                // zoomIn && zoomOut
                if(changeWidth > 0 ) {
                    
                    //放大
                    //放大的尺寸不足以再放一个Tabs / 无下拉列表
                    if((changeWidth < 60) || (0 == TabsThis.moreId.length)) {
                        return;
                    } else {
                        
                        //change more to single 
                        //TabsThis.maxWidth -> single li max width
                        changeNum = Math.floor(changeWidth/(TabsThis.maxWidth));
                        if(changeNum > TabsThis.moreId.length) {
                            changeNum = TabsThis.moreId.length;
                        }
                        if(TabsThis.moreId.length == (changeNum+1)) {
                            changeNum = changeNum+1;
                        }
                        var moreIdArray = TabsThis.moreId;
                        for (var i = 0; i < changeNum; i++) {
                            var changeId = moreIdArray[i];
                            
                            //set singleId
                            TabsThis._element.find("#li"+changeId).show();
                            TabsThis._element.find("#limore"+changeId).hide();
                            TabsThis.singleId.push(changeId);
                            
                            //set moreId 
                            TabsThis.moreId = _.without(TabsThis.moreId, changeId);
                        }
                        
                        //set Tabs head width    
                        if(0 == TabsThis.moreId.length) {
                            TabsThis._element.find("#limore").hide();
                            TabsThis.totWidth = TabsThis._element.find("#tab_head").width();
                        } else {
                            var moreliDivWidth = TabsThis._element.find("#tiny-moreli-div").width();
                            TabsThis.totWidth = TabsThis._element.find("#tab_head").width() - TabsThis.moreTitleWidth + moreliDivWidth + 2;
                        }
                    }
                } else {
                    
                    //缩小
                    changeNum = Math.ceil(Math.abs(changeWidth)/60);
                    
                    //if has no more head
                    if("none" == TabsThis._element.find("#limore").css("display")) {
                        changeNum = Math.ceil((Math.abs(changeWidth) + TabsThis.moreliWidth)/60);
                        TabsThis._element.find("#limore").show();
                    }
                    var tabsSingleId = _.without(TabsThis.singleId, TabsThis.activeId),
                    singleIndex = tabsSingleId.length-1;
                    for (var i = 0; i < changeNum; i++) {
                        var changeId = tabsSingleId[singleIndex-i]; 
                        
                        //set singleId
                        TabsThis._element.find("#li"+changeId).hide();
                        TabsThis._element.find("#limore"+changeId).show();
                        TabsThis.moreId.push(changeId);
                        
                        //set moreId
                        TabsThis.singleId = _.without(TabsThis.singleId, changeId);
                    }
                    
                    //set Tabs head width
                    if(0 == TabsThis.moreId.length) {
                        TabsThis.totWidth = TabsThis._element.find("#tab_head").width();
                    } else {
                        TabsThis._hideMore();
                        var moreliDivWidth = TabsThis._element.find("#tiny-moreli-div").width();
                        TabsThis.totWidth = TabsThis._element.find("#tab_head").width() - TabsThis.moreTitleWidth + moreliDivWidth + 2;
                    }
                }
                if(("bottom" == options["position"]) && (0 != TabsThis.moreId.length)) {
                    TabsThis._setBottomMore();
                }
            });
            }
            if(String(TabsThis.options["closable"]) === "true"){
                //click close
                TabsThis._element.on("click", ".ui-icon-close", function() {
                    var closeId = $(this).attr("closeId"),
                    moreNum = TabsThis.moreId.length;
                    if( _.contains(TabsThis.disabled, closeId)) {
                        return;
                    }
                    
                    //remove DIV & Tab
                    TabsThis._element.find("#"+closeId).remove();
                    TabsThis._element.find("#limore"+closeId).remove();
                    TabsThis.elementId = _.without(TabsThis.elementId, closeId);
                    //close single more
                    TabsThis._element.find("[liindex='li"+closeId+"']").remove();
                    TabsThis.singleId = _.without(TabsThis.singleId, closeId);
                    //change more to single
                    if(0 != moreNum) {
                        var changId = TabsThis.moreId[0];
                        TabsThis._element.find("#li"+changId).css("display", "block");
                        TabsThis._element.find("#limore"+changId).css("display", "none");
                        TabsThis.moreId = _.without(TabsThis.moreId, changId);
                        TabsThis.singleId.push(changId);
                    }
                    moreNum = TabsThis.moreId.length;
                    //set more to single
                    if(1 == moreNum) {
                        var changeMoreId = TabsThis.moreId[0];
                        TabsThis._element.find("#li"+changeMoreId).css("display", "block");
                        TabsThis._element.find("#limore"+changeMoreId).css("display", "none");
                        TabsThis.moreId = _.without(TabsThis.moreId, changeMoreId);
                        TabsThis.singleId.push(changeMoreId);
                        TabsThis._element.find("#limore").css("display","none");
                    }
                    if(closeId == TabsThis.activeId) {
                        TabsThis.activeId = _.difference(TabsThis.singleId, TabsThis.disabled)[0];
                        TabsThis._element.find("[liindex='li"+TabsThis.activeId+"']").addClass("tinyTabActive");
                        TabsThis._element.find("#"+TabsThis.activeId).css("display", "block");
                    }
                });
                
                //click more close
                TabsThis._element.on("click", ".ui-icon-arrowdiv-close", function(event) {
                    TabsThis._stopEvent(event);
                    var closeId = $(this).attr("closeId");
                    if( _.contains(TabsThis.disabled, closeId)) {
                        return;
                    }
                    //remove DIV & Tab
                    TabsThis._element.find("#"+closeId).remove();
                    TabsThis.elementId = _.without(TabsThis.elementId, closeId);
                    //close more li
                    TabsThis._element.find("#limore"+closeId).remove();
                    TabsThis._element.find("#li"+closeId).remove();
                    TabsThis.moreId = _.without(TabsThis.moreId, closeId);
                    moreNum = TabsThis.moreId.length;
                    //set more to single
                    if(1 == moreNum) {
                        var changeMoreId = TabsThis.moreId[0];
                        TabsThis._element.find("#li"+changeMoreId).css("display", "block");
                        TabsThis._element.find("#limore"+changeMoreId).css("display", "none");
                        TabsThis.moreId = _.without(TabsThis.moreId, changeMoreId);
                        TabsThis.singleId.push(changeMoreId);
                        TabsThis._element.find("#limore").css("display","none");
                        return;
                    } 
                    if("bottom" == options["position"]) {
                        TabsThis._setBottomMore();
                    }
                    if("vertical" == TabsThis.style) {
                        TabsThis._setVerticalMore(); 
                    }
                });

            }

            //表头的mouse事件
            if(options["mouse"]) {
                TabsThis._element.on("mouseover", ".ui-state-tabs-ul li", function(event) {
                    if( "tab_head" != $($(this)[0].parentNode).attr("id")) {
                        return;
                    }
                    TabsThis._tabChange(event, this, true);
                });
            }
            
            //表头的点击事件
            TabsThis._element.on("click", ".ui-state-tabs-ul li", function(event) {
                
                //ignore disabled 
                var clickId = $(this).attr("liindex").substring(2);
                if( _.contains(TabsThis.disabled, clickId )) {
                    return;
                }
                if( !options["mouse"] ) {
                    TabsThis._tabChange(event, this, false);
                } else {
                    if( "tab_head" != $($(this)[0].parentNode).attr("id")) {
                        moreFlag = true;
                        clickId = $(this).attr("id").substring(6);
                        TabsThis._clickMoreli(clickId);
                    }
                }
            });
            
            //表头的双击事件
            TabsThis._element.on("dblclick", ".ui-state-tabs-ul li", function() {
                var clickId = $(this).attr("liindex").substring(2);
                if( _.contains(TabsThis.disabled, clickId )) {
                    return;
                }
                if( _.contains(TabsThis.collapsible, clickId) ) {
                    TabsThis._element.find("#" +clickId).css("display","none");
                }
            });
            //绑定change事件
            TabsThis.on("changeEvt", function(event) {
                TabsThis.trigger("change", [event]);
                if ("function" == ( typeof options["change"])) {
                    options["change"](event);
                }
            });
            
            if("true" === String(options["more"])) {//点击其它区域，more下拉列表关闭
                $(document).on("click", function() {
                    if(0 == TabsThis.moreId.length) {
                        return;
                    }
                    if(!TabsThis.dropDiv) {
                        return;
                    }
                    if("block" == TabsThis.dropDiv.css("display")) {
                        TabsThis._element.find("#limore").removeClass("tinyTabActive");
                        return TabsThis.dropDiv.css("display","none");
                    }
                    TabsThis.dropDiv = null;
                });
            }
       }
    });
    return Tabs;
 });