define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util"], function(angular, $, Class, Widget, util) {

    var DEFAULT_CONFIG = {
        "template" : '<div></div>',
        "axis" : "y",
        "step" : 40,
        "scroll" : true,
        "position" : 0
    };
    Scrollbar = Widget.extend({
        "init" : function(options) {
            var widgetThis = this;
            widgetThis.sliderTop = 0;
            widgetThis.sliderLeft = 0;
            widgetThis.overviewTop = 0;
            widgetThis.overviewLeft = 0;
            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));
            widgetThis._reRender();
            $("#" + options["id"]).append(widgetThis.element);
        },
        "_generateElement" : function() {
            var widgetThis = this;
            widgetThis.oScrollbar = $('<div></div>');
            //滑块
            var sliderElement = widgetThis.oScrollbar.sliderElement = $('<div></div>');
            //轨道
            var skewerElement = widgetThis.oScrollbar.skewerElement = $('<div></div>');
            widgetThis.oScrollbar.append(skewerElement);
            skewerElement.append(sliderElement);
            return widgetThis.oScrollbar;
        },
        "_setOption" : function(key, value) {
            var widgetThis = this;
            widgetThis._super(key, value);
            switch(key) {
            	case "id":
				    widgetThis._updateId(value);
					break;
                case "axis":
                    widgetThis._reRender();
                    break;
                case "position":
                    widgetThis._setPosition(value);
                    break;
            }
            if (widgetThis.element) {
                widgetThis._setTo(widgetThis.element);
            }
        },
        "_setTo" : function(element) {
            var widgetThis = this;
            var overview = widgetThis.overview = element.find(".overview");
            var viewport = widgetThis.viewport = element.find(".viewport");
            overview.addClass("tiny-scrollbar-overview");
            viewport.addClass("tiny-scrollbar-viewport");
            var left = viewport.position().left;
            var top = viewport.position().top;
            if (widgetThis.options.axis == "x" || widgetThis.options.axis == "X") {
                widgetThis.oScrollbar.css({
                    "left" : left,
                    "top" : top + viewport.height(),
                    "height" : 20,
                    "border-top" : "1px solid #B5B5B5",
                    "border-left" : "none"
                });
                widgetThis.oScrollbar.width(viewport.width());
                widgetThis.oScrollbar.skewerElement.css({
                    "width" : viewport.width() - 10,
                    "height" : 14
                });
                if (overview.width() > viewport.width()) {
                    widgetThis.oScrollbar.show();
                    widgetThis.oScrollbar.visible = true;
                }
                else {
                    widgetThis.oScrollbar.hide();
                    widgetThis.oScrollbar.visible = false;
                }
            }
            else {
                widgetThis.oScrollbar.css({
                    "left" : left + viewport.width(),
                    "top" : top,
                    "width" : 20,
                    "border-left" : "1px solid #B5B5B5",
                    "border-top" : "none"
                });
                widgetThis.oScrollbar.height(viewport.height());
                widgetThis.oScrollbar.skewerElement.css({
                    "height" : viewport.height() - 10,
                    "width" : 14
                });
                if (overview.height() > viewport.height()) {
                    widgetThis.oScrollbar.show();
                    widgetThis.oScrollbar.visible = true;
                }
                else {
                    widgetThis.oScrollbar.hide();
                    widgetThis.oScrollbar.visible = false;
                }
            }

            widgetThis._setPosition(widgetThis.options.position);
            element.find(".overview").show();
            widgetThis._addBehaviorAfterRendTo();
        },
        "rendTo" : function(id) {
            var widgetThis = this;
            widgetThis._super(id);
            widgetThis.element = $("#" + id).parent();
            widgetThis._setTo(widgetThis.element);
        },
        "_addBehaviorAfterRendTo" : function() {

            var widgetThis = this;
            var sliderElement = widgetThis.oScrollbar.sliderElement;
            var skewerElement = widgetThis.oScrollbar.skewerElement;
            var $doc = $(document);
            var _start = function(event) {
                event = event || window.event;
                event.preventDefault();
                if (widgetThis.options.axis == "x" || widgetThis.options.axis == "X") {

                    widgetThis.mouseStartX = event.pageX;
                    widgetThis.sliderStartX = sliderElement.position().left;
                }
                else {
                    widgetThis.mouseStartY = event.pageY;
                    widgetThis.sliderStartY = sliderElement.position().top;
                }
                $doc.bind('mousemove', _drag);
                $doc.bind('mouseup', _end);
                $(top.document).bind('mouseup', _end);
            };
            var _drag = function(event) {
                event = event || window.event;
                event.preventDefault();
                //viewport
                var viewport = widgetThis.element.find(".viewport");
                //overview全内容元素
                var overview = widgetThis.element.find(".overview");
                //滑块元素
                var sliderElement = widgetThis.oScrollbar.sliderElement;
                if (widgetThis.options.axis == "x" || widgetThis.options.axis == "X") {
                    //全内容的宽
                    var overviewWidth = overview.width();
                    //展示块的宽
                    var viewportWidth = viewport.width();
                    //滑块的宽
                    var sliderWidth = 60;
                    //滑块当前位置=鼠标当前位置-鼠标开始位置+滑块开始位置  或 0 或
                    var sliderLeft = Math.min(Math.max(0, (event.pageX - widgetThis.mouseStartX) + widgetThis.sliderStartX), widgetThis._getMaxSize("x"));
                    var overviewLeft = -sliderLeft * widgetThis._caculateRatio("x");
                    sliderElement.css("left", sliderLeft + "px");
                    overview.css("left", overviewLeft);
                    widgetThis.sliderLeft = sliderLeft;
                    widgetThis.overviewLeft = overviewLeft;
                }
                else {
                    //全内容的高
                    var overviewHeight = overview.height();
                    //展示块的高
                    var viewportHeight = viewport.height();
                    //滑块的高
                    var sliderHeight = 60;
                    //滑块当前位置=鼠标当前位置-鼠标开始位置+滑块开始位置  或 0
                    // 或viewportHeight-sliderHeight;
                    var sliderTop = Math.min(Math.max(0, (event.pageY - widgetThis.mouseStartY) + widgetThis.sliderStartY), widgetThis._getMaxSize("y"));
                    var overviewTop = -sliderTop * widgetThis._caculateRatio("y");
                    sliderElement.css("top", sliderTop + "px");
                    overview.css("top", overviewTop);
                    widgetThis.sliderTop = sliderTop;
                    widgetThis.overviewTop = overviewTop;
                }
            };
            var _end = function(event) {
                $doc.unbind('mousemove', _drag);
                $doc.unbind('mouseup', _end);
                $(top.document).unbind('mouseup', _end);
            };
            var wheel = function(event) {
                var viewport = widgetThis.element.find(".viewport");
                //overview全内容元素
                var overview = widgetThis.element.find(".overview");
                if (widgetThis.oScrollbar.visible == true && util.isTrue(widgetThis.options.scroll) && widgetThis._isVertical()) {
                    event = event || window.event, iDelta = event.wheelDelta ? event.wheelDelta / 120 : -event.detail / 3;
                    widgetThis.overviewTop += iDelta * widgetThis.options.step;
                    widgetThis.overviewTop = Math.max(viewport.height() - overview.height(), Math.min(0, widgetThis.overviewTop));
                    widgetThis.sliderTop = -widgetThis.overviewTop / widgetThis._caculateRatio("y");
                    sliderElement.css("top", widgetThis.sliderTop);
                    overview.css("top", widgetThis.overviewTop);
                    event.preventDefault();
                }
            };
            var _click = function(event) {
                event = event || window.event;
                event.stopPropagation();
                var overview = widgetThis.element.find(".overview");
                if (widgetThis.options.axis == "x" || widgetThis.options.axis == "X") {
                    var newLeft = event.pageX - skewerElement.offset().left + skewerElement.position().left - 30;
                    newLeft = Math.max(Math.min(newLeft, widgetThis._getMaxSize("x")), 0);
                    sliderElement.css("left", newLeft);
                    var overviewLeft = -newLeft * widgetThis._caculateRatio("x");
                    //overview全内容元素
                    overview.css("left", overviewLeft);
                    widgetThis.sliderLeft = newLeft;
                    widgetThis.overviewLeft = overviewLeft;
                }
                else {
                    var newTop = event.pageY - skewerElement.offset().top + skewerElement.position().top - 30;
                    newTop = Math.max(Math.min(newTop, widgetThis._getMaxSize("y")), 0);
                    sliderElement.css("top", newTop);
                    var overviewTop = -newTop * widgetThis._caculateRatio("y");
                    //overview全内容元素
                    overview.css("top", overviewTop);
                    widgetThis.sliderTop = newTop;
                    widgetThis.overviewTop = overviewTop;
                }
            };
            sliderElement.mousedown(_start);
            sliderElement.click(function(event) {
                event = event || window.event;
                event.stopPropagation();
            });
            skewerElement.click(_click);
            if (widgetThis.element && widgetThis._isVertical()) {

                if (window.addEventListener) {
                    widgetThis.element[0].addEventListener('DOMMouseScroll', wheel, false);
                    widgetThis.element[0].addEventListener('mousewheel', wheel, false);
                    widgetThis.element[0].addEventListener('MozMousePixelScroll', function(event) {
                        event.preventDefault();
                    }, false);
                }
                else {
                    widgetThis.element[0].onmousewheel = wheel;
                }
            }
        },
        "_reRender" : function() {
            var widgetThis = this;
            //axis
            var axis = (widgetThis.options.axis == "x" || widgetThis.options.axis == "X") ? "x" : "y";
            widgetThis.oScrollbar.addClass("tiny-scrollbar");
            //轨道和滑块方向确定
            widgetThis.oScrollbar.sliderElement.removeClass().addClass("tiny-scrollbar-slider-" + axis);
            widgetThis.oScrollbar.skewerElement.removeClass().addClass("tiny-scrollbar-skewer-" + axis);
        },
        "_caculateRatio" : function(direction) {
            var widgetThis = this, ratio = 1;
            var viewport = widgetThis.element.find(".viewport");
            //overview全内容元素
            var overview = widgetThis.element.find(".overview");
            if (direction == "x") {
                //全内容的宽
                var overviewWidth = overview.width();
                //展示块的宽
                var viewportWidth = viewport.width();
                //滑块的宽
                var sliderWidth = 60;
                ratio = (overviewWidth - viewportWidth) / widgetThis._getMaxSize("x");
            }
            else {
                //全内容的高
                var overviewHeight = overview.height();
                //展示块的高
                var viewportHeight = viewport.height();
                //滑块的高
                var sliderHeight = 60;
                ratio = (overviewHeight - viewportHeight) / widgetThis._getMaxSize("y");
            }
            return ratio;
        },
        "_getMaxSize" : function(direction) {
            var widgetThis = this, size = 0;
            var viewport = widgetThis.element.find(".viewport");
            var sliderSize = 60;
            if (direction == "x") {
                size = viewport.width() - sliderSize - 5;
            }
            else {
                size = viewport.height() - sliderSize - 5;
            }
            return size;
        },
        "_isVertical" : function() {
            var widgetThis = this;
            return !(widgetThis.options.axis == "x" || widgetThis.options.axis == "X");
        },
        "_setPosition" : function(position) {
            var widgetThis = this;
            position = parseInt(position);
            if (isNaN(position) || position <= 0 || !widgetThis.oScrollbar.visible) {
                return;
            }
            var widgetThis = this;
            var overview = widgetThis.element.find(".overview");
            var viewport = widgetThis.element.find(".viewport");
            if (widgetThis._isVertical()) {
                widgetThis.overviewTop = -position;

                widgetThis.overviewTop = Math.max(viewport.height() - overview.height(), Math.min(0, widgetThis.overviewTop));
                widgetThis.sliderTop = -widgetThis.overviewTop / widgetThis._caculateRatio("y");
                overview.css("top", widgetThis.overviewTop);
                widgetThis.oScrollbar.sliderElement.css("top", widgetThis.sliderTop);

                widgetThis.options.position = -widgetThis.overviewTop;
            }
            else {
                widgetThis.overviewLeft = -position;
                widgetThis.overviewLeft = Math.max(viewport.width() - overview.width(), Math.min(0, widgetThis.overviewLeft));
                widgetThis.sliderLeft = -widgetThis.overviewLeft / widgetThis._caculateRatio("x");
                overview.css("left", widgetThis.overviewLeft);
                widgetThis.oScrollbar.sliderElement.css("left", widgetThis.sliderLeft);
                widgetThis.options.position = -widgetThis.overviewLeft;
            }
        },

        "reDraw" : function() {
            var widgetThis = this;
            element = widgetThis.element;
            var overview = widgetThis.overview = element.find(".overview");
            var viewport = widgetThis.viewport = element.find(".viewport");
            overview.addClass("tiny-scrollbar-overview");
            viewport.addClass("tiny-scrollbar-viewport");
            var left = viewport.position().left;
            var top = viewport.position().top;
            if (widgetThis.options.axis == "x" || widgetThis.options.axis == "X") {
                widgetThis.oScrollbar.css({
                    "left" : left,
                    "top" : top + viewport.height(),
                    "height" : 20,
                    "border-top" : "1px solid #B5B5B5",
                    "border-left" : "none"
                });
                widgetThis.oScrollbar.width(viewport.width());
                widgetThis.oScrollbar.skewerElement.css({
                    "width" : viewport.width() - 10,
                    "height" : 14
                });
                if (overview.width() > viewport.width()) {
                    widgetThis.oScrollbar.show();
                    widgetThis.oScrollbar.visible = true;
                }
                else {
                    widgetThis.oScrollbar.hide();
                    widgetThis.oScrollbar.visible = false;
                }
            }
            else {
                widgetThis.oScrollbar.css({
                    "left" : left + viewport.width(),
                    "top" : top,
                    "width" : 20,
                    "border-left" : "1px solid #B5B5B5",
                    "border-top" : "none"
                });
                widgetThis.oScrollbar.height(viewport.height());
                widgetThis.oScrollbar.skewerElement.css({
                    "height" : viewport.height() - 10,
                    "width" : 14
                });
                if (overview.height() > viewport.height()) {
                    widgetThis.oScrollbar.show();
                    widgetThis.oScrollbar.visible = true;
                }
                else {
                    widgetThis.oScrollbar.hide();
                    widgetThis.oScrollbar.visible = false;
                }
            }
            widgetThis._setPosition(widgetThis.options.position);
            element.find(".overview").show();
        }
    })
    return Scrollbar;

});
