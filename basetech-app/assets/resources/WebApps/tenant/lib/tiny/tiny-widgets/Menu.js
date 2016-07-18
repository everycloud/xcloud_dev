define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget"], 
function(angular, $, Class, Widget) {
    var Menu = Widget.extend({
        "init" : function(options) {
            var widgetThis = this;

            widgetThis._super(options);
            widgetThis._setContainer(options);
        },

        "_setContainer" : function(options) {
            var widgetThis = this; 
            var $Container = $('#' + options["id"]);

            widgetThis.container = $Container; 
            widgetThis.headDom = $Container.find("#tiny-menu");
            if(widgetThis.headDom ){
                widgetThis._setHead(widgetThis.headDom );
            }
            widgetThis._element = $Container;
        },

        //设置菜单内容
        "_setHead" : function(headDom) {
            var widgetThis = this; 
            var firstLevel = [], j = 0, mSubObj;

            firstLevel = headDom.find("ul").eq(0).children();
            for(var i = 0,len = firstLevel.length;i < len;i++){
                if(firstLevel[i].tagName == "LI"){
                    widgetThis._parseSecLevel($(firstLevel[i]),j);
                    j++;
                }

                $(firstLevel[i]).bind("mouseover", function(){
                    mSubObj = $(".tiny-menu-panel", this);
                    
                    if (mSubObj.length > 0) {
                        mSubObj.css("display", "block");
                        if (this.getElementsByTagName("h1")[0].className.indexOf("menu_active") >= 0) {
                            this.getElementsByTagName("h1")[0].className = "menu-selected menu_active";
                        } else {
                            this.getElementsByTagName("h1")[0].className = "menu-selected";
                        }
                    }
                });
                $(firstLevel[i]).bind("mouseout", function(){
                    mSubObj = $(".tiny-menu-panel", this);
                    
                    if (mSubObj.length > 0) {
                        mSubObj.css("display", "none");
                        if (this.getElementsByTagName("h1")[0].className.indexOf("menu_active") >= 0) {
                            this.getElementsByTagName("h1")[0].className = "menu_active";
                        } else {
                            this.getElementsByTagName("h1")[0].className = null;
                        }
                    }
                });
                
                $(".tiny-menu-panel>ul>li>a", firstLevel[i]).bind("click", function(){
                    $(".tiny-menu-panel:visible").css("display", "none");
                });
                
            }
        },

        "_parseSecLevel" : function($firstLevel,fl){
            var widgetThis = this;
            var secondDom = $firstLevel.find("ul");

            $firstLevel.find("ul").wrapAll("<div class='tiny-menu-panel' style='display:none;'></div>");
            for (var i=0, domLen=secondDom.length; i<domLen; i++) {
                if (i == 0) {
                    $(secondDom[i]).addClass("firstUl");
                } else {
                    $(secondDom[i]).addClass("commonUl");
                }
            }
        }
        
    });

    return Menu;
});