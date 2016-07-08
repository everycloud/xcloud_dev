define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util"], function(angular, $, Class, Widget, util) {

    var DEFAULT_CONFIG = {
        "template" : '<div class="tiny-tips tiny-tips-box"></div>',
        "type" : "input"
    };

    Tip = Widget.extend({

        "init" : function(options) {

            var widgetThis = this;

            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));

            widgetThis._varInit(widgetThis.options);

            if (options) {
                widgetThis._setOptions(widgetThis.options);
            }

        },
        "_addBehavior" : function() {

            var widgetThis = this;

            var options = widgetThis.options;

            if (options.element) {
                $(options.element).on("mouseover", widgetThis, widgetThis._mouseoverElHandler);
                $(options.element).on("mouseout", widgetThis, widgetThis._mouseoutElHandler);
            }

            return;

        },

        "_mouseoverElHandler" : function(event) {
            var widgetThis = event.data;
            if (widgetThis.auto) {
                widgetThis.show();
            }
        },
        "_mouseoutElHandler" : function(event) {
            var widgetThis = event.data;
            if (widgetThis.auto) {
                widgetThis.hide();
            }
        },

        "_generateElement" : function() {

            var widgetThis = this;

            var widgetElement = widgetThis._super();

            var tipElement = null;
            
            var tipWidth = "";
            var tipWidthValue = widgetThis.options.width;
            var tipContClass = "tiny-tips-inner-cont";
            if (tipWidthValue) {
                tipWidth = "width:" + tipWidthValue.replace(/px/gi, "") + "px;";
                tipContClass = "tiny-tips-inner-cont-wrap";
            } 
            
            //默认elementContent！！
            var elementContent = '<div class="tiny-tips-box-t">' + '<div class="tiny-tips-box-t_l"></div>' + '<div class="tiny-tips-box-t_c" style=" left:6px;">' + '<div class="tiny-tips-box-t_cin"></div>' + '</div><div class="tiny-tips-box-t_r"></div>' + '</div>' + '<div class="tiny-tips-box-c clearfix">' + '<div class="tiny-tips-ico-gy c7 ">' + '<div class="' + tipContClass + '" style="clear:both;' + tipWidth + '">' + widgetThis.options.content + '</div>' + '</div>' + '</div>' + '<div class="tiny-tips-box-b">' + '<div class="tiny-tips-box-b_l"></div>' + '<div class="tiny-tips-box-b_c" style=" left:22px;">' + '<div class="tiny-tips-box-b_cin"></div>' + '</div><div class="tiny-tips-box-b_r"></div>' + '</div>';
            //默认值？？！！简化？？！！101行
            switch(widgetThis.options.position) {
                case "top":
                    elementContent = '<div class="tiny-tips-box-t">' + '<div class="tiny-tips-box-t_l"></div>' + '<div class="tiny-tips-box-t_c" style=" left:6px;">' + '<div class="tiny-tips-box-t_cin"></div>' + '</div><div class="tiny-tips-box-t_r"></div>' + '</div>' + '<div class="tiny-tips-box-c clearfix">' + '<div class="tiny-tips-ico-gy c7 ">' + '<div class="' + tipContClass + ' tiny-tip-bottom" style="clear:both;' + tipWidth + '">' + widgetThis.options.content + '</div>' + '</div>' + '</div>' + '<div class="tiny-tips-box-b">' + '<div class="tiny-tips-box-b_l"></div>' + '<div class="tiny-tips-box-b_c" style=" left:22px;">' + '<div class="tiny-tips-box-b_cin"></div>' + '</div><div class="tiny-tips-box-b_r"></div>' + '</div>';
                    break;
                case "bottom":
                    elementContent = '<div class="tiny-tips-box-b_top"><div class="tiny-tips-box-b_l_top"></div>' + '<div class="tiny-tips-box-b_c_top" style="left:22px;"><div class="tiny-tips-box-b_cin_top"></div></div>' + '<div class="tiny-tips-box-b_r_top"></div></div><div class="tiny-tips-box-c_top clearfix">' + '<div class="tiny-tips-ico-gy c7"><div class="' + tipContClass + '" style="clear:both;' + tipWidth + '">' + widgetThis.options.content + '</div></div></div><div class="tiny-tips-box-t_top">' + '<div class="tiny-tips-box-t_l_top"></div><div class="tiny-tips-box-t_c_top" style="left:6px;">' + '<div class="tiny-tips-box-t_cin_top"></div></div><div class="tiny-tips-box-t_r_top"></div></div>';
                    break;
                case "left":
                    elementContent = '<div class="tiny-tips-box-t_right"><div class="tiny-tips-box-t_l_right"></div>' + '<div class="tiny-tips-box-t_c_right"><div class="tiny-tips-box-t_cin_right"></div></div>' + '<div class="tiny-tips-box-t_r_right"></div></div><div class="tiny-tips-box-c_right clearfix">' + '<div class="tiny-tips-ico-gy_right c7"><div class="' + tipContClass + '" style="clear:both;' + tipWidth + '">' + widgetThis.options.content + '</div></div></div><div class="tiny-tips-box-b">' + '<div class="tiny-tips-box-t_l_top_right"></div><div class="tiny-tips-box-b_c_right">' + '<div class="tiny-tips-box-b_cin_right"></div></div><div class="tiny-tips-box-b_r_right"></div></div>';
                    widgetElement.addClass('tiny-right-margin');
                    break;
                case "right":
                    elementContent = '<div class="tiny-tips-box-t_left"><div class="tiny-tips-box-t_l"></div>' + '<div class="tiny-tips-box-t_c_left"><div class="tiny-tips-box-t_cin_left"></div></div>' + '<div class="tiny-tips-box-t_r_left"></div></div><div class="tiny-tips-box-c_left clearfix">' + '<div class="tiny-tips-ico-gy_left c7"><div class="' + tipContClass + '" style="clear:both;' + tipWidth + '">' + widgetThis.options.content + '</div></div></div><div class="tiny-tips-box-b_left">' + '<div class="tiny-tips-box-t_l_left"></div><div class="tiny-tips-box-b_c_left">' + '<div class="tiny-tips-box-b_cin"></div></div><div class="tiny-tips-box-b_r_left"></div></div>';
                    break;
                default :
                    break;
            }
            

            widgetElement.html(elementContent);
            
            widgetElement.attr({
                id : widgetThis.options.id
            });
            
            widgetThis.oTips = widgetElement;

            return widgetElement;
        },
        "_varInit" : function(options) {
            var widgetThis = this;
            widgetThis.oTips = null;
            widgetThis.posX = 0;
            widgetThis.posY = 0;
            widgetThis.selector = {};
            widgetThis.hideTip = true;
            widgetThis.element = null;
            widgetThis.content = options && options.content ? options.content : "tooltip";
            widgetThis.position = widgetThis._getPosition(options);
            widgetThis.id = options ? options.id : "";
            widgetThis.auto = options && util.isFalse(options.auto) ? false : true;
        },

        "_setElement" : function(element, xOffset) {
            var widgetThis = this;
            widgetThis.posX = parseInt($(element).offset().left, 10);
            widgetThis.posY = parseInt($(element).offset().top, 10);
            widgetThis.posHeight = parseInt($(element)[0].offsetHeight, 10);
            widgetThis.posWidth = parseInt($(element)[0].offsetWidth, 10);
            widgetThis.selector.height = $(element).outerHeight();
            widgetThis.selector.offset = isNaN(xOffset) ? 0 : xOffset;
            if (element != widgetThis.element) {
                widgetThis._addElementBehavior(element);
                if (widgetThis.element) {
                    widgetThis.element.off("mouseover", widgetThis._mouseoverElHandler);
                    widgetThis.element.off("mouseout", widgetThis._mouseoutElHandler);
                }

             }
            widgetThis.element = element;
        },
        "_addElementBehavior" : function(element) {
            var widgetThis = this;
            $(element).on("mouseover", widgetThis, widgetThis._mouseoverElHandler);
            $(element).on("mouseout", widgetThis, widgetThis._mouseoutElHandler);
        },
        "_setOption" : function(key, value) {

            var widgetThis = this;

            widgetThis._super(key, value);

            switch( key ) {
                case 'position':
                    widgetThis.position = widgetThis._getPosition(widgetThis.options);
                    break;
                case 'content':
                    widgetThis.content = value;
                    break;
                case 'auto':
                    widgetThis.auto = util.isFalse(value) ? false : true;
                    break;
                default:
                    break;
            }

        },
        "_SetAllAttributes" : function() {
            var widgetThis = this;
            
            widgetThis.oTips.attr({
                id : widgetThis.id
            });
            $(widgetThis.oTips[0]).css({
                'display' : 'inline'
            });

        },
        "_getPosition" : function(options) {
            var widgetThis = this;
            //定义了position，并且合法
            if (options.position && (options.position === "top" || options.position === "left" || options.position === "bottom" || options.position === "right")) {
                return options.position;
            }
            
            //定义了position，设置不合法，默认为right
            if (options.position) {
                widgetThis.options.position = "right";
                return widgetThis.options.position;
            }
            
            return null;
        },
        
        "show" : function(time) {

            var widgetThis = this;

            if (widgetThis.options.element) {
                widgetThis._setElement(widgetThis.options.element);
            }
            
            widgetThis._show();

            if (!isNaN(time)) {
                setTimeout(function() {
                    widgetThis.hide();
                }, time);
            }

        },
        "_show" : function() {

            var widgetThis = this;

            widgetThis.display = true;

            if (widgetThis.oTips) {

                if (widgetThis.timeout) {
                    window.clearTimeout(widgetThis.timeout);
                }

                widgetThis._tipgarbageCollect(widgetThis.oTips, true);

                widgetThis.oTips = null;

            }
            widgetThis._element = widgetThis._generateElement();

            widgetThis._element.widget(widgetThis);

            widgetThis.oTips = widgetThis._element;

            if (widgetThis.options.element.parent()[0].className.indexOf("tinyDivContain") < 0) {
                widgetThis.options.element.parent().addClass("tinyDivContain");
            }
            widgetThis.options.element.parent().append(widgetThis.oTips); 
            
            
            var tipDivHeight = widgetThis.oTips.height();

            var tipDivWidth = widgetThis.oTips.width();

            var rightDiff = 0;

            var topDiff, parentHeight, parentWidth;
            var documentWidth = widgetThis.options.parent?widgetThis.options.parent[0].clientWidth:document.body.clientWidth;

            rightDiff = documentWidth - widgetThis.posX - tipDivWidth;

            topDiff = widgetThis.posY - tipDivHeight;

            widgetThis._SetAllAttributes();

            var showPosY = 0, showPosX = 0;
            var actualWidth = widgetThis.oTips[0].offsetWidth;
            var actualHeight = widgetThis.oTips[0].offsetHeight;
                
            //没有指定tooltip显示的位置，则自动调整tooltip的位置
            if (!widgetThis.position) {
                var tipChanged = false;
                var elementContent = "";
                var tipWidthValue = widgetThis.options.width;
                var tipContClass = "tiny-tips-inner-cont";
                if (tipWidthValue) {
                    tipWidth = "width:" + tipWidthValue.replace(/px/gi, "") + "px;";
                    tipContClass = "tiny-tips-inner-cont-wrap";
                }

                if (topDiff < 0 && rightDiff > 0) {

                    var changeFlag = true;

                    if (changeFlag) {
                        elementContent = '<div class="tiny-tips-box-b_top"><div class="tiny-tips-box-b_l_top"></div>' + '<div class="tiny-tips-box-b_c_top" style="left:22px;"><div class="tiny-tips-box-b_cin_top"></div></div>' + '<div class="tiny-tips-box-b_r_top"></div></div><div class="tiny-tips-box-c_top clearfix">' + '<div class="tiny-tips-ico-gy c7"><div class="' + tipContClass + '" style="clear:both;' + tipWidth + '">' + widgetThis.content + '</div></div></div><div class="tiny-tips-box-t_top">' + '<div class="tiny-tips-box-t_l_top"></div><div class="tiny-tips-box-t_c_top" style="left:6px;">' + '<div class="tiny-tips-box-t_cin_top"></div></div><div class="tiny-tips-box-t_r_top"></div></div>';
                        tipChanged = true;
                    }

                }

                if (topDiff < 0 && rightDiff < 0) {

                    var changeFlag = true;

                    if (changeFlag) {
                        elementContent = '<div class="tiny-tips-box-b_top"><div class="tiny-tips-box-b_r_top_less"></div>' + '<div class="tiny-tips-box-b_c_top" style="left:22px;"><div class="tiny-tips-box-b_cin_top"></div></div>' + '<div class="tiny-tips-box-b_l_less_right"></div></div><div class="tiny-tips-box-c_top clearfix">' + '<div class="tiny-tips-ico-gy c7"><div class="' + tipContClass + '" style="clear:both;' + tipWidth + '">' + widgetThis.content + '</div></div></div><div class="tiny-tips-box-t_top">' + '<div class="tiny-tips-box-t_l_top"></div><div class="tiny-tips-box-t_c_top" style="left:6px;">' + '<div class="tiny-tips-box-t_cin_top"></div></div><div class="tiny-tips-box-t_r_top"></div></div>';
                        tipChanged = true;
                    }
                }

                if (topDiff > 0 && rightDiff < 0) {

                    var changeFlag = true;

                    if (changeFlag) {
                        elementContent = '<div class="tiny-tips-box-t"><div class="tiny-tips-box-t_l"></div>' + '<div class="tiny-tips-box-t_c" style="left:6px;"><div class="tiny-tips-box-t_cin"></div></div>' + '<div class="tiny-tips-box-t_r"></div></div><div class="tiny-tips-box-c clearfix">' + '<div class="tiny-tips-ico-gy c7"><div class="' + tipContClass + '" style="clear:both;' + tipWidth + '">' + widgetThis.content + '</div></div></div><div class="tiny-tips-box-b">' + '<div class="tiny-tips-box-b_r_less"></div><div class="tiny-tips-box-b_c" style="left:22px;">' + '<div class="tiny-tips-box-b_cin_right"></div></div><div class="tiny-tips-box-b_l_top_less"></div></div>';
                        tipChanged = true;
                    }
                }

                if (tipChanged === true) {
                
                    widgetThis._tipgarbageCollect(widgetThis.oTips, true);

                    widgetThis.oTips = null;

                    widgetThis.oTips = document.createElement('div');

                    if (!widgetThis.target) {
                        widgetThis.options.element.after(widgetThis.oTips);
                    }

                    widgetThis.oTips.className = 'tiny-tips tiny-tips-box';
                    widgetThis.oTips.innerHTML = elementContent;
                    widgetThis.oTips = $(widgetThis.oTips);
                    elementContent = null;
                }
                if (topDiff >= 0) {
                    showPosY = - actualHeight;
                } else {
                    showPosY = widgetThis.selector.height;
                }

                if (rightDiff < 0) {
                    showPosX = documentWidth - widgetThis.oTips.offset().left - tipDivWidth;
                }
            }

            //通过options指定了tooltip的显示位置
            else {
                switch (widgetThis.position) {
                    case 'bottom':
                        showPosY = widgetThis.posHeight;
                        break;
                    case 'top':
                        showPosY = - actualHeight;
                        break;
                    case 'left':
                        showPosY = - widgetThis.posHeight / 2;
                        showPosX = - actualWidth;
                        break;
                    case 'right':
                        showPosY = - widgetThis.posHeight / 2;
                        showPosX = widgetThis.element.outerWidth();
                        break;
                }
            }

            widgetThis.oTips[0].style.top = showPosY + 'px';
            widgetThis.oTips[0].style.left = showPosX + 'px';

            // 修正y坐标
            if ((widgetThis.position == "right" || widgetThis.position == "left")
                     && (widgetThis.oTips.children()[0].offsetHeight > 0)) {
                showPosY = widgetThis.posHeight - tipDivHeight + 3; 
                widgetThis.oTips[0].style.top = showPosY + 'px';
            }
            //去掉？？！！和162行关系
            widgetThis.oTips[0].style.visibility = 'visible';
        },
        "hide" : function(time) {
            var widgetThis = this;
            if (!isNaN(time)) {
                if (widgetThis.timeout) {
                    widgetThis.timeout = clearTimeout(widgetThis.timeout);
                    widgetThis.timeout = null;
                }
                widgetThis.timeout = setTimeout(function() {
                    if (widgetThis.hideTip && widgetThis.oTips && widgetThis.oTips[0]) {
                        widgetThis._tipgarbageCollect($("#" + widgetThis.oTips.id), true);
                        widgetThis._tipgarbageCollect(widgetThis.oTips, true);
                        
                        // #34 对应在Firefox浏览器下window控件中滚动条不消失问题
                        widgetThis.options.element.parent().removeClass("tinyDivContain");
                        widgetThis.oTips = null;
                    }
                }, time);
            } else {
                if (widgetThis.hideTip && widgetThis.oTips && widgetThis.oTips[0]) {
                    widgetThis._tipgarbageCollect($("#" + widgetThis.oTips.id), true);
                    widgetThis._tipgarbageCollect(widgetThis.oTips, true);
                    
                    // #34 对应在Firefox浏览器下window控件中滚动条不消失问题
                    widgetThis.options.element.parent().removeClass("tinyDivContain");
                    widgetThis.oTips = null;
                }
            }

        },
        
        "remove" : function() {

            var widgetThis = this;
            widgetThis.hide();
            widgetThis.element.off("mouseover", widgetThis._mouseoverElHandler);
            widgetThis.element.off("mouseout", widgetThis._mouseoutElHandler);
        },

        "_removeObjectProperties" : function(objectPropertiesToBeRemoved) {
            if (objectPropertiesToBeRemoved) {
                for (var property in objectPropertiesToBeRemoved) {
                    try {
                        delete objectPropertiesToBeRemoved[property];
                    }
                    catch(ex) {
                    }
                }
            }
        },
        "_tipdisposeObject" : function(obj) {
            var widgetThis = this;
            var objectPropertiesToBeRemoved = obj;
            widgetThis._removeObjectProperties(objectPropertiesToBeRemoved);
        },
        "_tipgarbageCollect" : function(node, isJqueryObj) {
            var widgetThis = this;
            if (isJqueryObj) {
                node.children().each(function(a, elem) {
                    widgetThis._tipgarbageCollect($(elem), true);
                });
                widgetThis._tipgarbageCollect(node.get(0));
                widgetThis._tipdisposeObject(node);
            }
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
            if (node != null) {
                try {
                    var garbageBin = document.getElementById('tinyLeakGarbageBin');
                    if (!garbageBin) {
                        garbageBin = document.createElement('DIV');
                        garbageBin.id = 'tinyLeakGarbageBin';
                        garbageBin.style.display = 'none';
                        document.body.appendChild(garbageBin);
                    }

                    if ($(node).get(0)) {
                        garbageBin.appendChild(node);
                        while (node.firstChild) {
                            node.removeChild(node.firstChild);
                        }
                    }
                    garbageBin.innerHTML = "";
                    if ($.browser.msie) {
                        garbageBin.outerHTML = "";
                    }
                    node = null;
                }
                catch (ex) {
                }
            }
        }

    });

    return Tip;

});
