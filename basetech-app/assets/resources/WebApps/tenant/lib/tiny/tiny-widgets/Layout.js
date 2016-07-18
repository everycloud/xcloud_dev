define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-widgets/Widget"], function(angular, $, Widget) {
    var layout = Widget.extend({
        "init" : function(options) {
            var widgetThis = this;
            widgetThis._setContainer(options);
            widgetThis._addLayoutBehavior();
        },

        "_setContainer" : function(options) {
            var widgetThis = this;
            var $Container = $('#' + options["id"]);
            widgetThis.headDom = $Container.find(".tiny-layout-west");
            widgetThis.contentDom = $Container.find(".tiny-layout-center");

            //set subheight&&contentminheight
            widgetThis.height = 0;
            widgetThis.contheight = 0;
            if("undefined" !== typeof options["subheight"]){
                var height = parseInt(options["subheight"], 10);
                if(isNaN(height)){
                    height = 0;
                }
                widgetThis.height = height;
            }
            if("undefined" !== typeof options["contentminheight"]){
                var contheight = parseInt(options["contentminheight"], 10);
                if(isNaN(contheight)){
                    contheight = 0;
                }
                widgetThis.contheight = contheight;
            }

            if (widgetThis.headDom) {
                widgetThis._setHead(widgetThis.headDom);
            }
            widgetThis._element = $Container;
        },

        "opActive" : function($selector) {
            var widgetThis = this;
            if(typeof $selector === "object") {
                $selector = $($selector);
            }
            if("A" != $selector[0].tagName){
                return;
            }
            var $currentActive = widgetThis.headDom.find("a[index='"+widgetThis.activeIndex+"']");
            $currentActive.removeClass("tiny-layout-a-current");

            //second level style
            if($currentActive.parent().hasClass("tiny-layout-sideli2")){
                var $currentHead = $currentActive.closest("ul");
                $currentHead.hide();
                $currentHead.siblings(".tiny-layout-head").removeClass("tiny-layout-current");
            }
            $selector.addClass("tiny-layout-a-current");
            widgetThis.activeIndex = $selector.attr("index");
            widgetThis.contentDom.find("#" + widgetThis.activeIndex).show();
            //one level style
            if($selector.hasClass("tiny-layout-a-top")){
                return;
            }
            if($selector.parent().hasClass("tiny-layout-sideli2")){
                var $selectHead = $selector.closest("ul");
                $selectHead.show();
                $selectHead.siblings(".tiny-layout-head").addClass("tiny-layout-current");
            }
        },

        //设置手风琴标题以及内容
        "_setHead" : function(headDom) {
            var widgetThis = this;
            widgetThis.indexArray = [];
            headDom.addClass("sideList sideMenu");
            headDom.width("215px");
            var firstLevel = [], j = 0;
            firstLevel = headDom.find("ul").eq(0).children();
            for (var i = 0, len = firstLevel.length; i < len; i++) {
                if (firstLevel[i].tagName == "LI") {
                    $(firstLevel[i]).addClass("tiny-layout-sideli");
                    widgetThis._parseSecLevel($(firstLevel[i]), j);
                    j++;
                }
            }
        },

        "_parseSecLevel" : function($firstLevel, fl) {
            var widgetThis = this;
            var $headDom = $firstLevel.find(".tiny-layout-head");
            $headDom.prepend($('<span class="ui-icon"></span>'));
            var secondLevel = [], secondLI = $firstLevel.find("ul"), len = 0, $secondA, secondAUrl, index, isTop;
            if ((0 == secondLI.length) && ($firstLevel.has("a"))) {
                secondLevel = $firstLevel;
                len = 1;
                isTop = true;// 处于top层
            } else {
                secondLevel = secondLI.find("li:has(a)");
                len = secondLevel.length;
                secondLI.css("display", "none");
                isTop = false;// 处于子菜单层
            }
            for (var i = 0; i < len; i++) {
                $secondA = $(secondLevel[i]).find("a");
                index = "" + fl + i;
                ($secondA.addClass("tiny-layout-a")).attr("index", index);
                widgetThis.indexArray.push(index);
                isActive = String($secondA.attr("active")) === "true";
                if (isActive && !widgetThis.activeIndex) {
                    $secondA.addClass("tiny-layout-a-current");
                    widgetThis.activeIndex = index;
                }

                //distinguish li->ul->li && li->a
                if (!isTop) {
                    $(secondLevel[i]).addClass("tiny-layout-sideli2");
                    if (isActive) {
                        $(secondLevel[i]).parent().css("display", "block");
                        $headDom.addClass("tiny-layout-current");
                    }
                } else {
                    $secondA.addClass("tiny-layout-a-top");
                }
                secondAUrl = $secondA.attr("url");
                if (secondAUrl) {
                    widgetThis._setContent(secondAUrl, index, isActive);
                };
            }
        },

        //设置主页面内容
        "_setContent" : function(anchor, index, isActive) {
            var widgetThis = this, $outerDiv = $("<div id='" + index + "' class='tiny-layout-maincontent'></div>");
            widgetThis.contentDom.append($outerDiv);
            if (!isActive) {
                $outerDiv.css("display", "none");
            }

            // inline layout content
            if (anchor[0] === "#") {
                content = widgetThis.contentDom.find(anchor);
                $outerDiv.append(content);

                // remote layout content
            } else {
                $outerDiv.load(anchor);
            }
        },

        "_selectItem" : function(item) {
            var widgetThis = this;

            //hide old item&&content
            widgetThis.contentDom.find("#" + widgetThis.activeIndex).hide();
            widgetThis.headDom.find("[index=" + widgetThis.activeIndex + "]").removeClass("tiny-layout-a-current");

            //show new item&&conten
            item.addClass("tiny-layout-a-current");
            widgetThis.activeIndex = item.attr("index");
            widgetThis.contentDom.find("#" + widgetThis.activeIndex).show();
        },

        "_addLayoutBehavior" : function() {
            var widgetThis = this;
            //回调事件
            widgetThis._element.on("click", ".tiny-layout-head", function(obj) {
                var $headDiv = $(obj.target);
                if ($headDiv.hasClass('ui-icon')) {
                    $headDiv = $headDiv.closest(".tiny-layout-head");
                }
                if ($headDiv.hasClass('tiny-layout-current')) {
                    $(this).siblings("ul").slideUp();
                    $headDiv.removeClass('tiny-layout-current');
                } else {
                    var $currentHead = widgetThis.headDom.find(".tiny-layout-current");
                    $currentHead.siblings("ul").slideUp();
                    $currentHead.removeClass("tiny-layout-current");
                    $(this).addClass("tiny-layout-current");
                    $(this).siblings("ul").slideDown();
                    var $activeA = $(this).siblings("ul").find("li:first a");
                    widgetThis._selectItem($activeA);
                    widgetThis.activeIndex = $activeA.attr("index");
                }
            });

            //手风琴链接绑定回调函数
            widgetThis._element.on("click", ".tiny-layout-a", function(evt) {
                var item = $(evt.target);
                widgetThis._selectItem(item);
                if (item.hasClass("tiny-layout-a-top")) {
                    $("ul", $(evt.target).parents("ul:first")).slideUp();
                    $(".tiny-layout-current", $(evt.target).parents("ul:first")).removeClass('tiny-layout-current');
                }
            });
            $(document).ready(function() {
                var height = document.documentElement.clientHeight;
                widgetThis.contentDom.css("min-height", height-widgetThis.height);
            });
            $(window).resize( function() {
                var height = document.documentElement.clientHeight;
                //minheight!!
                var contentHeight = height-widgetThis.height;
                if(widgetThis.contheight > contentHeight){
                    contentHeight = widgetThis.contheight;
                }
                widgetThis.contentDom.css("min-height", contentHeight);
            });
        }
    });
    return layout;
});