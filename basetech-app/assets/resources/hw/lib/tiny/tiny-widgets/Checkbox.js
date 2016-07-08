define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util", "tiny-widgets/Tip"], 
function(angular, $, Class, Widget, util, Tip) {
    var DEFAULT_CONFIG = {
        "width" : "50px",
        "disable" : false,
        "checked" : false,
        "template" : 
        '<div class="tiny-checkbox">' 
        + '<div class="tiny-checkbox-mark">' 
        +   '<div class="tiny-checkboxIcon tiny-checkbox-unchecked">' 
        +   '</div>' 
        +   '<label class="tiny-checkbox-content">'
        +      '<label class="tiny-text"></label>' 
        +   '</label>' 
        +   '</div>' 
        + '</div>'
    };
    var Checkbox = Widget.extend({
        "init" : function(options) {
            var checkboxThis = this;
            var option = _.extend({}, DEFAULT_CONFIG, options);
            checkboxThis._super(option);
            checkboxThis._setOptions(option);
            $("#" + options["id"]).append(checkboxThis._element);
        },
        "_setOption" : function(key, value) {
            var checkboxThis = this;
            checkboxThis._super(key, value);
            switch (key) {
                case "id":
                    checkboxThis._updateId(value);
                    break;
                case "value":
                    checkboxThis._updateValue(value);
                    break;
                case "icon-class":
                    checkboxThis._updateIcon(value);
                    break;
                case "text":
                    checkboxThis._updateText(value);
                    break;
                case "checked":
                    checkboxThis._updateChecked(value);
                    break;
                case "width":
                    checkboxThis._element.css("min-width", value);
                    break;
                case "height":
                    checkboxThis._element.css("height", value);
                    break;
                case "disable" :
                    checkboxThis._updateDisable();
                    break;
                case "tooltip":
                    checkboxThis._updateTooltip(value);
                    break;
                default:
                    break;
            }
        },
        "_updateValue" : function(value) {
            var checkboxThis = this;
            checkboxThis._element.attr("tiny-checkbox-value", value);
        },

        "_updateText" : function(text) {
            var checkboxThis = this;
            checkboxThis._element.find(".tiny-text").html(text);
        },
        "_updateIcon" : function(iconClass) {
            var checkboxThis = this;
            //remove Class！！
            if(checkboxThis.$checkIcon){
                checkboxThis.$checkIcon.remove();
            }
            checkboxThis.$checkIcon = $('<span class = "tiny-checkbox-icon"></span>'),
            $checkboxContent = checkboxThis._element.find(".tiny-checkbox-content");
            checkboxThis.$checkIcon.addClass(iconClass);        
            $checkboxContent.prepend(checkboxThis.$checkIcon);
        },
        "_updateChecked" : function(checked) {
            var checkboxThis = this;
            var options = checkboxThis.options;
            var isChecked = (util.isTrue(checked)) || (checked == "checked");
            var $checkedThis = checkboxThis._element.find(".tiny-checkboxIcon");
            if (isChecked) {
                if("disabled"==$checkedThis.attr("disabled")){
                    $checkedThis.removeClass("tiny-checkbox-unchecked-disabled").addClass("tiny-checkbox-checked-disabled");
                }    
                else{
                    $checkedThis.removeClass("tiny-checkbox-unchecked").addClass("tiny-checkbox-checked");
                }
                $checkedThis.attr("checked", true);
                return;
            };
                if("disabled"==$checkedThis.attr("disabled")){
                    $checkedThis.removeClass("tiny-checkbox-checked-disabled").addClass("tiny-checkbox-unchecked-disabled");
                }    
                else{
                    $checkedThis.removeClass("tiny-checkbox-checked").removeClass("tiny-checkbox-checked-disabled").addClass("tiny-checkbox-unchecked");
                }
            $checkedThis.attr("checked", false);
        },
        "_updateDisable" : function() {
            var checkboxThis = this;
            var options = checkboxThis.options;
            var $selector = checkboxThis._element.find(".tiny-checkbox-mark");
            var $selectorRadio = $selector.find(".tiny-checkboxIcon");
            if (util.isTrue(options["disable"])) {
                if ("checked" == $selectorRadio.attr("checked")) {
                    $selectorRadio.removeClass("tiny-checkbox-checked").addClass("tiny-checkbox-checked-disabled");
                } else {
                    $selectorRadio.removeClass("tiny-checkbox-unchecked").addClass("tiny-checkbox-unchecked-disabled");
                }
                $selectorRadio.attr("disabled", "true");
                $selector.find(".tiny-text").addClass("tiny-checkbox-content-disabled");
                if(checkboxThis.$checkIcon){
                    checkboxThis.$checkIcon.addClass("tiny-img-disabled");
                }
                return;
            };
                if ("checked" == $selectorRadio.attr("checked")) {
                    $selectorRadio.removeClass("tiny-checkbox-checked-disabled").addClass("tiny-checkbox-checked");
                } else {
                    $selectorRadio.removeClass("tiny-checkbox-unchecked-disabled").addClass("tiny-checkbox-unchecked");
                }
                $selectorRadio.removeAttr("disabled");
                $selector.find(".tiny-text").removeClass("tiny-checkbox-content-disabled");
                if(checkboxThis.$checkIcon){                    
                    checkboxThis.$checkIcon.removeClass("tiny-img-disabled");    
                }    
        },
        "_updateTooltip" : function(value) {
            var checkboxThis = this;
            if(typeof(checkboxThis.tip)== 'undefined')
            {
                checkboxThis.tip = new Tip({
                    "content" : value,
                    "element" : checkboxThis._element.find(".tiny-checkbox-mark"),
                    "width" : checkboxThis.options.tipWidth
                });
            }
            else
            {
                checkboxThis.tip.option("content",value);
                checkboxThis.tip.option("width", checkboxThis.options.tipWidth);
            }
        },
        "_addBehavior" : function() {
            var checkboxThis = this;
            var options = checkboxThis.options;
            var $selectorEvent = checkboxThis._element.find(".tiny-checkbox-mark");
            checkboxThis._element.on("click", ".tiny-checkbox-mark", function(event) {                
                var $clickElement = $(this).find(".tiny-checkboxIcon");
                if ($clickElement.attr("disabled")) {
                    return;
                };
                $selectorEvent.trigger("clickEvt");
                if (!($clickElement.attr("checked"))) {
                    //勾选当前项
                    $clickElement.removeClass("tiny-checkbox-unchecked").addClass("tiny-checkbox-checked");
                    $clickElement.attr("checked", true);
                    options["checked"] = true;
                }
                else{
                    $clickElement.removeClass("tiny-checkbox-checked").addClass("tiny-checkbox-unchecked");
                    $clickElement.attr("checked", false);
                    options["checked"] = false;
                }
                $selectorEvent.trigger("changeEvt");    
            });
            //处理change事件
            checkboxThis._element.on("changeEvt", function(event) {
                checkboxThis.trigger("change", [event]);  
                if ("function" == ( typeof options["change"])){
                    options["change"](event);
                }
            });
            //处理click事件
            checkboxThis._element.on("clickEvt", function(event) {
                checkboxThis.trigger("click", [event]);  
                if ("function" == ( typeof options["click"])){
                    options["click"](event);
                }
            });
        }
    });

    return Checkbox;

});
