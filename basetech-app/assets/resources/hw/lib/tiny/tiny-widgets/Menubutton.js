define(["tiny-lib/jquery","tiny-lib/angular","tiny-lib/underscore", "tiny-widgets/Widget", "tiny-widgets/Button"], 
function($, angular, _, Widget, Button) {
    var DEFAULT_CONFIG = {
        "template" : '<span class="tinyMenuButton"></span>',
        "text": "",
        "contentFrom": "local",
        "recur" : false,
        "dropbtn" : true
    };

    var menubutton = Widget.extend({
        "init" : function(options) {
            var widgetThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            widgetThis._super(options);
            widgetThis._setOptions(options);
            widgetThis._addMenuButtonBehavior();
        },

        "_setOption" : function(key, value) {
            var widgetThis = this;
            widgetThis._super(key, value);
            switch( key ) {
                case "id" :
                    widgetThis._updateId(value);
                    break;
                case "text" :
                    widgetThis._setText();
                    break;
                case "content" :
                    widgetThis._updateContent();
                    break;
                default:
                    break;
            }
            return;
        },

        //生成主 dom.text属性暂不支持动态更新
        "_setText" : function() {
            var widgetThis = this, dataHtml = "", options = widgetThis.options;
            //菜单按钮主体部分: 文本,下拉标志,按钮
            dataHtml += '<span class="tiny-menubutton-main-a">';
            var isbtn = (options.type === "button");
            var showdropbtn = options["dropbtn"];
            var menuText = options["text"];   //可为DOM片段，所以不用编码转换
            if(showdropbtn){
                menuText += '<span class="tiny-menubutton-caret"></span>';
            }
            if(isbtn) {
                options["position"] = "left";
                widgetThis.btn = new Button({
                    "text" : menuText
                });
            } else {
                dataHtml += menuText;
            }
            dataHtml += '</span>';

            widgetThis._element.html(dataHtml);
            if(isbtn){
                widgetThis._element.find(".tiny-menubutton-main-a").prepend(widgetThis.btn.getDom());
            }
            $("#" + options["id"]).append(widgetThis._element);
        },

        "_updateContent" : function() {
            var widgetThis = this,options = widgetThis.options,content = options.content;
            //下拉部分
            if(options.type === "button") {
                var dropHtml = '<ul class="tiny-menubutton-dropdown tiny-menubutton-buttondropdown';
            }else {
                var dropHtml = '<ul class="tiny-menubutton-dropdown tiny-menubutton-normaldropdown';
            }
            if (typeof(options.cls) != "undefined") {
                dropHtml += ' ' + options.cls; 
            }
            dropHtml += '" style="display:none;">';

            for(var i = 0, len = content.length; i < len; i++) {
                  title = content[i].title;
                  if("true" === String(content[i].border)) {
                      dropHtml += '<li class="tiny-menubutton-dropdown-li">' 
                         + '<a href="javascript:void(0)" class="tiny-menubutton-dropdown-a" index = '+i+' style="border-bottom: 1px solid #DCDCDC;">' 
                         + title + '</a>' + '</li>';
                  } else {
                      dropHtml += '<li class="tiny-menubutton-dropdown-li">' 
                             + '<a href="javascript:void(0)" class="tiny-menubutton-dropdown-a" index = '+i+' >' 
                             + title + '</a>' + '</li>';
                  }
            }
            dropHtml += '</ul>';
            // 更新菜单
            if (widgetThis.$menuDrop) {
                widgetThis.$menuDrop.html($(dropHtml).html());
                return;
            }
            // 初次创建
            widgetThis.$menuDrop = $(dropHtml);
        },

        "_popMenu" : function() {
            var widgetThis = this, options = widgetThis.options;
            var menubutton = widgetThis._element.find(".tiny-menubutton-main-a");

            $('body').append(widgetThis.$menuDrop);
            //计算位置
            var position = menubutton.offset();
            if(options["position"] !== "left"){
                var left = position.left + menubutton.width() - widgetThis.$menuDrop.width();
            } else {
                var left = position.left;
            }
            widgetThis.$menuDrop.css({"left":left,"top" : position.top + menubutton.height(),"display": "block", "overflow" : "visible"});

            // 触发展开事件
            widgetThis.trigger("expand");
            if ("function" == ( typeof options["expand"])){
                options["expand"]();
            }
            widgetThis._addMenuDropBehavior();
            widgetThis.flag = true;
        },
        "_unpopMenu" : function() {
            var widgetThis = this;
            widgetThis.$menuDrop.off();
            widgetThis.$menuDrop.remove();

            widgetThis.flag = false;
        },

        "expandMenu" : function(content) {
            var widgetThis = this, options = widgetThis.options;
            // 更新，包括更新下拉的dom
            widgetThis._setOption("content", content);
            widgetThis.expanded = true;
            // 是否立即展开菜单，如果焦点已经转移就不展开
            if(!widgetThis.waitflag){
                return;
            }
            widgetThis._popMenu();
             widgetThis.waitflag = false;
        },
        
        "destroy" : function() {
            var widgetThis = this;
            widgetThis._element.unbind();
            $(document).unbind("mousedown", widgetThis.menubtnMousedown);
            $(document).unbind("mousewheel DOMMouseScroll", widgetThis.menubtnMousewheel);
            $(window).unbind("resize",widgetThis.resizeHandler);
            if(widgetThis.btn) {
                widgetThis.btn.destroy();
            }
        },
        
        "_addMenuButtonBehavior" : function() {
            var widgetThis = this, $menuDrop = widgetThis.$menuDrop, options = widgetThis.options;
            widgetThis.flag = false;   // 当前下拉menu是否展开
            widgetThis.waitflag = false; // 是否等待后台结果，是的话会自动展开
            widgetThis.expanded = false; // 已经获得过后台的内容，recur为false时使用该标记
            widgetThis.popFlag = false; // 是否点击了下拉菜单。标识下拉菜单点击后的全局点击事件

            //弹出或收起
            widgetThis._element.on("mousedown", ".tiny-menubutton-main-a", function(event) {

                widgetThis.popFlag = true;
                var popstate = widgetThis.flag;
                // 内容本地获取，直接弹出或收起
                if (options["contentFrom"] === "local") {
                    if ("false" == String(popstate)) {
                        widgetThis._popMenu();
                    }
                    else {
                        widgetThis._unpopMenu();
                    }
                }
                // 内容后台获取，触发事件。回调中使用expandMenu()方法弹出菜单
                else{
                    // 如果菜单已经展开则收起
                    if ("false" != String(popstate)) {
                        widgetThis._unpopMenu();
                    }
                    // 如果每次都要从后台获取内容或尚未获取
                    else if (options["recur"] || !widgetThis.expanded){
                        widgetThis.waitflag = true;
                        widgetThis.trigger("loadMenu");
                        if ("function" == ( typeof options["loadMenu"])){
                            options["loadMenu"]();
                        }
                    }
                    // 不是每次都获取且已经获取，直接显示即可
                    else {
                        widgetThis._popMenu();
                    }
                }
            });
            
            widgetThis.menubtnMousedown = function(event) { 
                // 如果是点击下拉引起的本事件，则这里不处理
                if (widgetThis.popFlag) {
                    widgetThis.popFlag = false;
                    return;
                }

                if (widgetThis.flag){
                    widgetThis._unpopMenu();
                }
                widgetThis.waitflag = false; // 不再等待结果
            };
            
            $(document).on("mousedown", widgetThis.menubtnMousedown);
            // Firefox浏览器不支持mousewheel事件, 要使用DOMMouseScroll
            // http://www.javascriptkit.com/javatutors/onmousewheel.shtml
            widgetThis.menubtnMousewheel = function(event) { 
                if(widgetThis.flag){
                    widgetThis._unpopMenu();
                }
                widgetThis.waitflag = false; // 不再等待结果
            }
            
            $(document).on("mousewheel DOMMouseScroll", widgetThis.menubtnMousewheel);
            
            // 外围事件引起的下拉框收起
            widgetThis.resizeHandler = function() {
                if(widgetThis.flag){
                    widgetThis._unpopMenu();
                }
            };
            
            $(window).on("resize",widgetThis.resizeHandler);
        },

        //添加下拉框的点击事件
        "_addMenuDropBehavior" : function () {
            var widgetThis = this;

            widgetThis.$menuDrop.on("mousedown", ".tiny-menubutton-dropdown-a", function(event) {
                var item = $(this);
                var index = parseInt(item.attr("index"), 10),
                clickFun = widgetThis.options["content"][index].click;
                if("function" === typeof clickFun){
                    clickFun(event, item, widgetThis);
                }
                if("function" === typeof widgetThis.options["clickCallback"]){
                    widgetThis.options["clickCallback"](event, item, widgetThis, widgetThis.options["params"]);
                }
                widgetThis._unpopMenu();
                event.stopPropagation();
            });
        }
    });
    return menubutton;
});
