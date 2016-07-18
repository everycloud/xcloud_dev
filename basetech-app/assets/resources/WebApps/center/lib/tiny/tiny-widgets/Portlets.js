define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/underscore", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-lib/encoder"],
function(angular, $, _, Class, Widget, encoder) {
    var DEFAULT_CONFIG = {
        "template" : '<div class = "portlets"></div>'
    };
    var Porlet = Widget.extend({
        "init" : function(options) {
            var portletThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            portletThis._super(options);
            portletThis._setOptions(options);
            $("#" + options["id"]).append(portletThis._element);
        },
        "_setOption" : function(key, value) {
            var portletThis = this, options = portletThis.options;
            portletThis._super(key, value);
            switch (key) {
                case "id" :
                    portletThis._updateId(value);
                    break;
                case "columns" :
                    portletThis._updateColumns(value);
                    break;
                default :
                    break;
            }
        },        "_updateColumns" : function(columns) {
            var portletThis = this, columnLen = columns.length, 
            portletContentObj = {};
            portletThis._element.append(portletThis._createHtml(columns, columnLen));
            // 如果是url的页面，记录到portletContent，在这里进行加载
            for(var i = 0, len = portletThis.portletContent.length; i < len; i++){
                portletContentObj = portletThis.portletContent[i];
                portletThis._element.find("#"+portletContentObj.id).load(portletContentObj.contentUrl);
            }            
        },

        //生成html
        "_createHtml" : function(columns, cols) {
            //portlets框架，使用一个1行n列的表格。一个column的多个portlet，放到一个格子中。column宽度已经指定。
            var portletThis = this, htmlTable = '', column = {}; portletThis.elementId=[];
            portletThis.portletItem = []; portletThis.portletContent = [];
            htmlTable += '<table class="portlets-table"><tr>';
            for (var i = 0; i < cols; i++) {
                column = columns[i];
                var width = parseInt(column.width)+"px";
                htmlTable += '<td class="portlets-column" style="float:left;width:' + width + ';">';
                
                // 没有预先放置portlets的列
                if(typeof(column.portlets)=="undefined"){
                	htmlTable += '</td>';
                	continue;
                }
                var portlets = column.portlets, portletsLen = portlets.length;
                for (var j = 0; j < portletsLen; j++) {
                    var portlet = portlets[j];
                    htmlTable += portletThis._creatPortlet(portlet);
                }
                htmlTable += '</td>';
            }
            htmlTable += '</tr></table>';
            return htmlTable;
        },
        
        // 生成内部悬浮框
        "_creatPortlet" : function(portlet){
        	
            var portletThis = this;
            var closable = (String(portlet.closable) === "false") ? "none" : "block",
            maxMize = (String(portlet.maxMize) === "false") ? "none" : "block",
            miniMize = (String(portlet.miniMize) === "false") ? "none" : "block",
            refreshable = (String(portlet.refreshable) === "false") ? "none" : "block",
            setable = (String(portlet.setable) === "false") ? "none" : "block", cursor = "move", 
            id = portlet.id, contentType = (portlet.contentType === "url") ? "url" : "", content = portlet.content||"";
            
            if(contentType === "url") {
                portletThis.portletContent.push({
                    id : "tiny_portlet_content_"+id,
                    contentUrl : content
                });
                content = "";
            } else {
                content = content;
            }
            portletThis.elementId.push(id);
            portletThis.portletItem.push({
                id : id,
                min : portlet.min || null,
                max : portlet.max || null,
                beforeClose : portlet.beforeClose || null,
                afterClose : portlet.afterClose || null,
                refresh : portlet.refresh || null,
                set : portlet.set || null
            });
            
            // portlet高度处理。49为标题和底部的总高度，要求设置值不能小于70px.70px只可以显示一行文本。不设置时为自动
            var contentstyle = "";
            if(portlet.height){
            	var height = parseInt(portlet.height,10);
            	height = (height>70)? height:70; // 不能小于70px
            	contentstyle = 'style="height:' + (height-49) +'px"';
            }
            
            //portlet模板
            id = $.encoder.encodeForHTMLAttribute("id", id, true); 
            var htmlTablePortlet = '<div class="portlet" id="' + id + '" status="normal" drag="##canDrag##"' 
                                                + 'index ="'+(portletThis.portletItem.length-1)+'">' 
                    + '<div class="p-title-wrap" style="cursor:' + cursor + '">' 
                    + '<div class = "tiny_portitem_foot">' 
                    + '<div class = "tiny_port_shadow_left"></div>' 
                    + '<div class = "tiny_port_shadow_middle"></div>' 
                    + '<div class = "tiny_port_shadow_right"></div>'+ '</div>' 
                    + '<div class="p-title">' + portlet.title + '</div>' 
                    + '<div class="p-oprate-wrap">' 
                    + '<a style="display:' + closable + '" class="p-oprate-close" href="javascript:;"></a>' 
                    + '<a style="display:' + refreshable + '" class="p-oprate-refresh" href="javascript:;"></a>' 
                    + '<a style="display:' + setable + '" class="p-oprate-set" href="javascript:;"></a>' 
                    + '<a style="display:' + maxMize + '" class="p-oprate-max" href="javascript:;"></a>' 
                    + '<a style="display:' + miniMize + '" class="p-oprate-min" href="javascript:;"></a>' 
                    + '</div>' + '</div>' 
                    + '<div class="p-content"><div id = "tiny_portlet_content_'+id+'"'+contentstyle+'>'+content+'</div></div>' 
                    + '<div class = "tiny_portitem_foot">' 
                    + '<div class = "tiny_port_shadow_left"></div>' 
                    + '<div class = "tiny_port_shadow_middle"></div>' 
                    + '<div class = "tiny_port_shadow_right"></div>' 
                    + '</div></div>';
          return htmlTablePortlet;
        },
        // 增加Portlet：x-列中的位置，y-第几列。目前只能在后面增加，不能在列首插入
        "addPortlet" : function(x,y,portletNew){
            if("object" !== typeof portletNew || (isNaN(x)&&(x!=="last")) || isNaN(y)){
                return;
            }
            var portletThis = this,portletTable = portletThis._element.find(".portlets-table"),
            $portletHtmlNew = $(portletThis._creatPortlet(portletNew));
            if("last" == x){
                var $portlet = portletTable.find("td").eq(y).children().last();
            }else{
                var $portlet = portletTable.find("td").eq(y).children().eq(x); 
            }
            if(!$portlet){
                return;
            }
            $portletHtmlNew.insertAfter($portlet);
        },
        "removePortlet" : function(id){
            var portletThis = this,
            $portletRemove = portletThis._element.find("#"+id);
            if(!$portletRemove){
                return;
            }
            $portletRemove.remove();
        },
        "opContent" : function(portId,content,contentType){
            var portletThis = this;
            if ( 0 === arguments.length ) {
               return;    
            }          
            if (_.contains(portletThis.elementId, portId)) {                         
                  var $content = portletThis._element.find("#tiny_portlet_content_"+portId);    
                  
               //attr content 
               if(1 === arguments.length) {
                   return $content;    
               } else {
                   
                   if("url" != contentType) {
                       
                       //添加新元素
                       $content.html(content);
                   } else {
                          $content.load(content);
                   }
               }
           }
        },
        //注册各portlet坐标：按照index枚举所有列的portlet，记录其id，偏移位置和大小
        "_regPortletsPos" : function(dragDiv) {
            var arrDragDivs = [], dragTbl = dragDiv.closest(".portlets-table"), tmpDiv, tmpPos, l = dragTbl.find(".portlet").size();
            for (var i = 0; i < l; i++) {
                tmpDiv = dragTbl.find(".portlet").eq(i);
                tmpPos = tmpDiv.offset();
                arrDragDivs.push({
                    DragId : tmpDiv.attr("id"),
                    PosLeft : tmpPos.left,
                    PosTop : tmpPos.top,
                    PosWidth : tmpDiv.outerWidth(),
                    PosHeight : tmpDiv.outerHeight()
                });
            }
            return arrDragDivs;
        },
        "_dragStart" : function(event, dragDiv) {
            //鼠标的点击titleBar的位置，downPos按下鼠标时指针是相对于文档的位置
            var portletThis = this, downPos = {
                x : event.pageX,
                y : event.pageY
            }, dashedElement = null;
            portletThis.moving = true;
            
            tmpX = downPos.x - dragDiv.offset().left; // offset也是相对于文档的偏移
            tmpY = downPos.y - dragDiv.offset().top;  // tmp就是鼠标相对于portlet的位置
            //防止全选等非拖拽的鼠标事件
            event.preventDefault();
            event.stopPropagation();

            //创建一个虚线框，这个判断解决iframe中拖出document范围后出现多个虚线框问题
            if ($(".portlet-dashed").size() > 0) {
                dashedElement = $(".portlet-dashed");
            } else {
                dashedElement = $('<div class="portlet-dashed"></div>');
            }
            dashedElement.height(dragDiv.outerHeight() - 4);
            // 定位方式改为绝对定位，脱离文档流
            dragDiv.css({
                "width" : dragDiv.width(),
                "position" : "absolute"
            });
            // 插入离开虚线框
            dashedElement.insertAfter(dragDiv);
            
            // 按照index枚举每个portlet，记录其id，偏移位置和大小
            var dragArray = portletThis._regPortletsPos(dragDiv);
            
            //记录起始拖拽portlet的列的一些信息，后面处理虚线框定位时要用到
            var tmpCol = dragDiv.closest(".portlets-column");
            var tmpPosFirstChild = tmpCol.find(".portlet:first").offset();
            var tmpPosLastChild = tmpCol.find(".portlet:last").offset();
            var tmpObj = {
                colId : tmpCol.index(),               //返回相对于同胞的位置，从0开始
                firstChildUp : tmpPosFirstChild.top,  // 最上元素的边缘位置，下面的lastChildDown是去掉被拖动元素后，最下的边缘位置
                lastChildDown : tmpPosLastChild.top + tmpCol.find(".portlet:last").outerHeight(true) - dragDiv.outerHeight(true)
            };
            
            $(document).off("mousemove").on("mousemove", function(e) {
                if (portletThis.moving) {
                    portletThis._drag(e, dragDiv, dragArray, dashedElement, tmpObj);
                    //防止全选等非拖拽的鼠标事件
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            
            $(document).off("mouseup").on("mouseup", function(e) {
                if (portletThis.moving) {
                    //在目标位置插入被拖拽的portlet，但之前未见到设置透明度的地方    
                    dragDiv.css("opacity", 1);
                    portletThis.moving = false;
                    tmpX = 0;
                    tmpY = 0;
                    dragDiv.removeAttr("style");
                    dragDiv.find(".p-title-wrap").css("cursor", "move");
                    dragDiv.insertBefore(dashedElement);                     
                    dashedElement.remove();
                    dashedElement = null;
                    //重要，因为remove不能删除掉$的对象实例
                    $("html").css("overflow", "");
                }
            });
        },
        
        // 实际拖动的处理
        "_drag" : function(e, dragDiv, dragArray, dashedElement, tmpObj) {
            //mouse position
            var portletThis = this, movePos = {
                x : e.pageX,
                y : e.pageY
            };
            //重新定位被拖拽portlet位置。tmpX就是按下鼠标时，鼠标相对于portlet的位置。
            dragDiv.css({
                "left" : movePos.x - tmpX,
                "top" : movePos.y - tmpY
            });
            
            //判断虚线框出现位置：搜索其余所有的portlet，如果在某个portlet内，记录到 targetDiv
            var targetDiv = null, tmpOtherDrag = null;
            for (var i = 0; i < dragArray.length; i++) {
                tmpOtherDrag = dragArray[i];
                if (dragDiv.attr("id") !== tmpOtherDrag.DragId) {
                    //当鼠标在某portlet内时，表示存在目标portlet
                    if (movePos.x > tmpOtherDrag.PosLeft && movePos.x < tmpOtherDrag.PosLeft + tmpOtherDrag.PosWidth 
                    	&& movePos.y > tmpOtherDrag.PosTop && movePos.y < tmpOtherDrag.PosTop + tmpOtherDrag.PosHeight) {
                        targetDiv = portletThis._element.find("#" + tmpOtherDrag.DragId);
                        break;
                    }
                }
            }
            
            //插入目标虚线框
            if (targetDiv) {
                //存在目标portlet时
                dashedElement.width(targetDiv.outerWidth() - 4);
                //鼠标在目标portlet内一半高度以上的位置，则在目前之前插入方框
                if (movePos.y <= targetDiv.offset().top + targetDiv.height() / 2) {
                    dashedElement.insertBefore(targetDiv);
                } else {
                    //鼠标在目标portlet内一半高度以下的位置
                    dashedElement.insertAfter(targetDiv);
                }
                //虚线框会影响portlet的位置，需要重新保存当前各portlet的位置
                dragArray = portletThis._regPortletsPos(dragDiv);
                
            } else {
                //不存在目标portlet时，找所有的列，
                var columns = dragDiv.closest("tr").children(), l = columns.size();
                for (var i = 0; i < l; i++) {
                    var startLeft = columns.eq(i).offset().left; // 记录本列左边距
                    
                    // 如果鼠标位于该列中
                    if (movePos.x > startLeft && movePos.x < startLeft + columns.eq(i).outerWidth()) {
                        //列中无portlet，则将虚线框放到该列
                        if (columns.eq(i).find(".portlet").size() === 0) {
                            dashedElement.width(columns.eq(i).outerWidth() - 4);
                            dashedElement.appendTo(columns.eq(i));
                        } else {
                            //处理特殊情况：在最上/下面，没碰到portlet时，移动到该列最上/下面
                            var posFirstChild = columns.eq(i).find(".portlet:first");
                            var posLastChild = columns.eq(i).find(".portlet:last");
                            var tmpUp, tmpDown;
                            
                            // tmpObj 记录了portlet原先所属列的上下边沿。原先所属列中存在虚线框，不能使用上面两行代码获得边沿位置
                            if (tmpObj.colId === i) {
                                tmpUp = tmpObj.firstChildUp;
                                tmpDown = tmpObj.lastChildDown;
                            } else {
                                tmpUp = posFirstChild.offset().top;
                                tmpDown = posLastChild.offset().top + posLastChild.outerHeight(true);
                            }
                            
                            // 使用该列第一个元素作为目标框的宽度。如果该列没有元素...
                            dashedElement.width(columns.eq(i).find(".portlet:first").outerWidth() - 4);
                            
                            if (movePos.y <= tmpUp) { ///从最上面插入虚线框
                                dashedElement.prependTo(columns.eq(i));
                            } else if (movePos.y >= tmpDown) {///从最下面插入虚线框
                                dashedElement.appendTo(columns.eq(i));
                            }
                        }
                        //虚线框会影响portlet的位置，需要重新保存当前各portlet的位置
                        dragArray = portletThis._regPortletsPos(dragDiv);
                    }
                }
            }
        },
        // 最小化:将最小化按钮换成还原，记录最大化按钮是否存在，并隐藏之
        "_minOperate" : function(dragDiv) {
            dragDiv.find(".p-content").hide();
            
            // 如果最大化按钮存在，隐藏，记录之待恢复
            if(dragDiv.find(".p-oprate-max").css("display")!=="none") {
            	dragDiv.find(".p-oprate-max").attr("recover","true");
            	dragDiv.find(".p-oprate-max").hide();
            }
            
            dragDiv.find(".p-oprate-min").attr({
                "class" : "p-oprate-normal"
            });
            dragDiv.attr("status", "min");
            dragDiv.trigger("minEvt", [dragDiv, dragDiv.attr("index")]);
        },
        // 最大化处理：将最大化按钮换成还原，备份最小化按钮的状态并隐藏
        "_maxOperate" : function(dragDiv) {
            var portletThis = this, portletsHeight = portletThis._element.parent().height(), 
            portletsWidth = portletThis._element.parent().width(); 
  
            // 页面不产生滚动条，多余的不显示
            $("html").css({
                "overflow" : "hidden"
            });
            // 设置不可拖动，标题鼠标样式默认
            dragDiv.attr("drag", "disabled");
            dragDiv.find(".p-title-wrap").css("cursor", "default");
            // 其它portlets通过页边距放下边不显示
            dragDiv.closest(".portlets").css("margin-top", portletsHeight).find(".portlet").not(dragDiv).css({
                "opacity" : "0",
                "visibility" : "hidden"
            });

            // 如果最小化按钮存在，隐藏，记录之待恢复
            if(dragDiv.find(".p-oprate-min").css("display")!=="none") {
            	dragDiv.find(".p-oprate-min").attr("recover","true");
            	dragDiv.find(".p-oprate-min").hide();
            }
            dragDiv.find(".p-oprate-max").attr({
                "class" : "p-oprate-normal"
            });
            
            // 固定定位，宽度为控件父元素宽度，高度...
            dragDiv.css({
                "width" : portletsWidth - 6 + "px",
                "position" : "fixed",
                "top" : "2px",
                "left" : "2px"
            });
            var contentArea = dragDiv.find(".p-content");
            var minusHeight = dragDiv.find(".p-title-wrap").outerHeight() + parseInt(contentArea.css("padding-top")) + parseInt(contentArea.css("padding-bottom")) + parseInt(contentArea.css("margin-top")) + parseInt(contentArea.css("margin-bottom"));
            contentArea.height(portletsHeight - minusHeight - 6);
            dragDiv.attr("status", "max");
            dragDiv.trigger("maxEvt", [dragDiv, dragDiv.attr("index")]);
        },
        // 恢复处理
        "_normalOperate" : function(dragDiv) {
        	// 最大化的恢复：去除页面overflow设置，可拖动，恢复鼠标样式，去除高度设置，去除style设置
            if (dragDiv.attr("status") === "max") {
                $("html").css({
                    "overflow" : ""
                });
                dragDiv.attr("drag", "enable");
                dragDiv.find(".p-title-wrap").css("cursor", "move");
                dragDiv.find(".p-content").css("height", "");
                dragDiv.closest(".portlets").removeAttr("style").find(".portlet").removeAttr("style");
                dragDiv.find(".p-oprate-normal").attr({
                "class" : "p-oprate-max"
                });
                
                // 如果最小化按钮存在，恢复之
                if(dragDiv.find(".p-oprate-min").attr("recover")==="true") {
            	    dragDiv.find(".p-oprate-min").removeAttr("recover");
            	    dragDiv.find(".p-oprate-min").show();
                } 
            } else { // 最小化的恢复
                dragDiv.find(".p-content").show(); 
                dragDiv.find(".p-oprate-normal").attr({
                "class" : "p-oprate-min"
                });
                // 如果最大化按钮待恢复
                if(dragDiv.find(".p-oprate-max").attr("recover")==="true") {
            	    dragDiv.find(".p-oprate-max").removeAttr("recover");
            	    dragDiv.find(".p-oprate-max").show();
                }
            }
            dragDiv.attr("status", "normal");
            dragDiv.trigger("normalEvt", [dragDiv, dragDiv.attr("index")]);
        },
        "_closeOperate" : function(dragDiv) {
            dragDiv.trigger("beforeCloseEvt", [dragDiv, dragDiv.attr("index")]);
            // 考虑在最大化时的关闭
            if (dragDiv.attr("status") === "max") {
                $("html").css({
                    "overflow" : ""
                });
                dragDiv.attr("drag", "enable");
                dragDiv.find(".p-title-wrap").css("cursor", "");
                dragDiv.find(".p-content").css("height", "");
                dragDiv.closest(".portlets").removeAttr("style").find(".portlet").removeAttr("style");
            }
            dragDiv.empty();
            dragDiv.remove();
            dragDiv.trigger("afterCloseEvt", [dragDiv, dragDiv.attr("index")]);
        },
        "_addBehavior" : function() {
            var portletThis = this, options = portletThis.options;
            
            portletThis._element.on("mousedown", ".p-title-wrap", function(event) {
                var dragDiv = $(this).closest(".portlet");
                //当按下鼠标左键，并且不是在A标签上按下的，就开始拖拽 mousemove
                
                if (event.target.tagName == "A" ) {
                    return false;
                } else {
                    portletThis._dragStart(event, dragDiv);
                }
            });
            
            portletThis._element.on("click", "a", function(event) {
                var dragDiv = $(this).closest(".portlet"); // 向上遍历，找到按钮所属的portlet
                switch ($(event.target).attr("class")) {
                    case "p-oprate-min" :
                        portletThis._minOperate(dragDiv);
                        break;
                    case "p-oprate-max" :
                        portletThis._maxOperate(dragDiv);
                        break;
                    case "p-oprate-normal" :
                        portletThis._normalOperate(dragDiv);
                        break;
                    case "p-oprate-close" :
                        portletThis._closeOperate(dragDiv);
                        break;
                    case "p-oprate-set" : 
                        dragDiv.trigger("setEvt", [dragDiv, dragDiv.attr("index")]);
                        break;
                    case "p-oprate-refresh" : 
                        dragDiv.trigger("refreshEvt", [dragDiv, dragDiv.attr("index")]);
                        break;
                    default :
                        break;
                }
            });
            portletThis._element.on("minEvt", function(event, dragDiv, index) {
                $(dragDiv[0]).trigger("min");
                if ("function" == ( typeof portletThis.portletItem[index].min)) {
                    portletThis.portletItem[index].min();
                }
            });
            portletThis._element.on("maxEvt", function(event, dragDiv, index) {
                $(dragDiv[0]).trigger("max");
                if ("function" == ( typeof portletThis.portletItem[index].max)) {
                    portletThis.portletItem[index].max();
                }
            });
            portletThis._element.on("normalEvt", function(event, dragDiv, index) {
                $(dragDiv[0]).trigger("normal");
                if ("function" == ( typeof portletThis.portletItem[index].normal)) {
                    portletThis.portletItem[index].normal();
                }
            });
            portletThis._element.on("beforeCloseEvt", function(event, dragDiv, index) {
                $(dragDiv[0]).trigger("beforeClose");
                if ("function" == ( typeof portletThis.portletItem[index].beforeClose)) {
                    portletThis.portletItem[index].beforeClose();
                }
            });
            portletThis._element.on("afterCloseEvt", function(event, dragDiv, index) {
                $(dragDiv[0]).trigger("afterClose");
                if ("function" == ( typeof portletThis.portletItem[index].afterClose)) {
                    portletThis.portletItem[index].afterClose();
                }
            });
            portletThis._element.on("setEvt", function(event, dragDiv, index) {
                $(dragDiv[0]).trigger("set");
                if ("function" == ( typeof portletThis.portletItem[index].set)) {
                    portletThis.portletItem[index].set();
                }
            });
            portletThis._element.on("refreshEvt", function(event, dragDiv, index) {
                $(dragDiv[0]).trigger("refresh");
                if ("function" == ( typeof portletThis.portletItem[index].refresh)) {
                    portletThis.portletItem[index].refresh();
                }
            });
        }
    });
    return Porlet;
}); 