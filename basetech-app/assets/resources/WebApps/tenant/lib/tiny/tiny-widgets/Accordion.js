define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/jquery-ui.custom.min", "tiny-lib/Class", "tiny-lib/underscore", 
"tiny-widgets/Widget"], 
function(angular, $, custom, Class, _, Widget) {
    var DEFAULT_CONFIG = {
        "template" : '<div class="tinyAccordion"></div>',
        "parentId" : "",
        "active" : 0,
        "hide-panel" : false,
        "width" : 300,
        "height" : 500
    };

    var tpl_data = _.template(
    //头部折叠板
     '<div class="tinyAccordion_showHideControlPanelElem">'
    +  '<div class="tinyAccordion_showHideArrow tinyAccordion_showHideArrow_hide"></div>' 
    +'</div>' 

    //手风琴标题及内容区域
    +'<div id="idTinyAccordion">' 
    + '<%_.each(headList,function(head,index){%>' 
    + '<h3 class="tinyAccordion_caption ' + '<% if(head.cls) {%> <%-head.cls%> <%}%> "' + 'level="<%-index%> " >' + '<%-head.title%>' + '</h3>' + '<div class="tinyAccordion_content" id="level_' + '<%-index%>' + '"></div>' + '<%})%></div>');

    var accordion = Widget.extend({
        "init" : function(options) {
            var widgetThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            widgetThis._super(options);
            widgetThis._setOptions(options);
            $('#' + options["id"]).append(widgetThis._element);
        },

        "_setOption" : function(key, value) {
            var widgetThis = this;
            widgetThis._super(key, value);
            switch( key ) {
            	case "id" :
            	    widgetThis._updateId(value);
                case "cls":
                    widgetThis._element.addClass(value);
                    break;
                case "height":
                    widgetThis._element.css("height", value);
                    break;
                case "width":
                    widgetThis._element.css("width", value);
                    break;
                case "head":
                    widgetThis._setHead();
                    break;
                case "content" :
                    widgetThis._setContent();
                    break;
                case "active" :
                    widgetThis._setActive();
                    break;
                case "hide-panel" :
                    widgetThis._hideControlPanel();
                    break;
                case "height-style":
                    widgetThis._setHeightStyle();
                    break;
                default:
                    break;
            }
            return;
        },
        
        "_createAccordion" : function() {
            var widgetThis = this;
            //id生成拼装
            $('#idTinyAccordion', widgetThis.getDom()).accordion({
                "collapsible" : true,
                "active" : widgetThis.options["active"],
                "heightStyle" : widgetThis.options["height-style"] || widgetThis.options["heightStyle"] ? widgetThis.options["height-style"] || widgetThis.options["heightStyle"] : "content"
            });
        },
        
        "_destroyAccordion" : function() {
            var widgetThis = this;
            if ($('.ui-accordion', widgetThis.getDom()).length!=0) {
                $('#idTinyAccordion', widgetThis.getDom()).accordion("destroy");
            }
        },

        "_hideControlPanel" : function() {
            var widgetThis = this;
            if ("true" === String(widgetThis.options["hide-panel"])) {
                $(".tinyAccordion_showHideControlPanelElem", widgetThis.getDom()).hide();
            } else {
                $(".tinyAccordion_showHideControlPanelElem", widgetThis.getDom()).show();
            }
        },

       //设置手风琴标题以及内容
        "_setHead" : function() {
            var widgetThis = this;
            var dataHtml = "";
            dataHtml = tpl_data({
                headList : widgetThis.options["head"]
            });
            widgetThis._element.html(dataHtml);
            widgetThis._setContent();
            if (widgetThis.parentId) {
                widgetThis._destroyAccordion();
                widgetThis.rendTo(widgetThis.parentId);
            }
        },

        "_setContent" : function() {
            var widgetThis = this;
            if (!widgetThis.options["content"]) {
                return;
            }
            _.each(widgetThis.options["head"], function(head, index) {
                var html = widgetThis.options["content"](index);
                $("#level_" + index, widgetThis.getDom()).html(html);
            });
            widgetThis._destroyAccordion();
            widgetThis._createAccordion();
            return;
        },

        "_showHideControl" : function(obj) {
        	var widgetThis = this,
        	showHideArrow = this._element.find(".tinyAccordion_showHideArrow");
            if (showHideArrow.hasClass('tinyAccordion_showHideArrow_hide')) {
                widgetThis._element.find("#idTinyAccordion").hide();
                widgetThis._element.css("width", "16px");
            } else if (showHideArrow.hasClass('tinyAccordion_showHideArrow_show')) {
                widgetThis._element.css('width', widgetThis.options["width"]);
                widgetThis._element.find("#idTinyAccordion").show();
            }
            showHideArrow.toggleClass('tinyAccordion_showHideArrow_hide');
            showHideArrow.toggleClass('tinyAccordion_showHideArrow_show');
        },

        "_setActive" : function() {
            var widgetThis = this;
            $('#idTinyAccordion', widgetThis.getDom()).accordion("option", "active", parseInt(widgetThis.options["active"]));
        },

        "_setHeightStyle" : function() {
            var widgetThis = this;
            $('#idTinyAccordion', widgetThis.getDom()).accordion("option", "heightStyle", widgetThis.options["height-style"]);
        },

        "_addBehavior" : function() {
            var widgetThis = this;
            //回调事件
            widgetThis._element.on("click", ".tinyAccordion_showHideControlPanelElem", function(evt) {
            	widgetThis._showHideControl();
            	widgetThis.trigger("click", [evt]);
            });
        }
    });

    return accordion;
});
