define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util", "tiny-widgets/Tip"], function(angular, $, Class, Widget, util, Tip) {
    var DEFAULT_CONFIG = {
        "template" : '<a href="javascript:void(0)"></a>',
        "display" : true,
        "disable" : false,
        "icons-class" : "",
        "text" : "",
        "tooltip" : "",
        "focused":false,
        "accessKey" : null
        
    };

    var Button = Widget.extend({

        "init" : function(options) {

            var widgetThis = this;

            widgetThis._varInit(options);

            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));

            widgetThis._setOptions(widgetThis.options);
            $("#" + widgetThis.options.id).append(widgetThis._element);
        },
        "_generateElement" : function() {

            var widgetThis = this;

            var widgetElement = widgetThis._super();

            var elementContent = '<div class="tiny-button tiny-button-buttonInnerClass"><div class="tiny-right"><div class="tiny-center"><div class="tiny-leftImg"></div><span class="tiny-button-buttonCenterText">' + widgetThis.options.text + '</span><div class="tiny-rightImg"></div></div></div></div>';

            widgetElement.html(elementContent);

            widgetThis.oButton = widgetElement;

            widgetThis.oButton.addClass(widgetThis.defaultButtonBackgroundClass);

            return widgetElement;
        },
        "_varInit" : function(options) {
            var widgetThis = this;
            widgetThis.oButton = null;
            widgetThis.defaultButtonClass = 'tiny-button-buttonClass';
            widgetThis.defaultButtonBackgroundClass = 'tiny-button-buttonDefault';
            widgetThis.defaultDisableButtonClass = 'tiny-button-buttonDefaultDisabled';
            widgetThis.ICON_DEFAULTS = {
                width : '16px',
                height : '16px'
            };
        },
        "_setOption" : function(key, value) {

            var widgetThis = this;

            widgetThis._super(key, value);

            switch (key) {
                case 'id':
                    widgetThis._updateId(value);
                case 'display':
                    widgetThis._setDisplay();
                    break;
                case 'disable':
                    widgetThis._setDisable();
                    break;
                case 'icons-class':
                    widgetThis._setIcons();
                    break;
                case 'text':
                    widgetThis._setText();
                    break;
                case 'tooltip':
                    widgetThis._setTooltip(value);
                    break;
                case 'focused':
                    widgetThis._setFocus(value);
                    break;
                default:
                    break;
            }
        },
        
        "_setFocus":function(value){
            var widgetThis = this;
            var element = widgetThis._element;
            
            if(true == value){
                element.addClass("tiny-button-focus").focus();
            } else {
                element.removeClass("tiny-button-focus");
            }
        },
        
        "destroy" : function() {
        	var widgetThis = this;
            var element = widgetThis._element;
        	$(document).unbind("keydown.tinybtn", widgetThis.btnkeydownEvt);
        	element.unbind();
        },
        
        "_addBehavior" : function() {

            var widgetThis = this;

            var element = widgetThis._element;
            var options = widgetThis.options;
            widgetThis.btnkeydownEvt = function (event){
                if(widgetThis.options.focused == true && event.which == 13){  
                      event.preventDefault();
                      element.trigger("click").removeClass("tiny-button-focus");
                      widgetThis.options.focused = false;
                }
            };
            $(document).on("keydown.tinybtn", widgetThis.btnkeydownEvt);
            element.on("click", function(evt) {
                if (util.isFalse(widgetThis.disable)) {
                    widgetThis.options.focused = false;
                    widgetThis.trigger("click", [evt]);
                    if ("function" == ( typeof options["click"])) {
                        options["click"](evt);
                    } 
                }
            });

            element.on("mouseover", function(evt) {
                if (util.isFalse(widgetThis.disable)) {
                    element.removeClass("tiny-button-focus").addClass("tiny-button-hover");
                    widgetThis.trigger("mouseover", [evt]);
                    if ("function" == ( typeof options["mouseover"])) {
                        options["mouseover"](evt);
                    }
                }
            });

            element.on("mouseout", function(evt) {
                if (util.isFalse(widgetThis.disable)) {
                    element.removeClass("tiny-button-hover");
                    element.removeClass("tiny-button-active");
                    //是否仍然具有默认焦点
                    if(widgetThis.options.focused == true){
                        element.addClass("tiny-button-focus");
                    }
                    widgetThis.trigger("mouseout", [evt]);
                    if ("function" == ( typeof options["mouseout"])) {
                        options["mouseout"](evt);
                    }
                }
            });

            element.on("mousedown", function(evt) {
                if (util.isFalse(widgetThis.disable)) {
                    element.removeClass("tiny-button-hover").addClass("tiny-button-active");
                    widgetThis.trigger("mousedown", [evt]);
                    if ("function" == ( typeof options["mousedown"])) {
                        options["mousedown"](evt);
                    }
                }
            });

            element.on("mouseup", function(evt) {
                if (util.isFalse(widgetThis.disable)) {
                    element.removeClass("tiny-button-active");
                    widgetThis.trigger("mouseup", [evt]);
                    if ("function" == ( typeof options["mouseup"])) {
                        options["mouseup"](evt);
                    }
                }
            });
        },
        "_setDisplay" : function() {
            var widgetThis = this;
            if (util.isFalse(widgetThis.options["display"])) {
                widgetThis.oButton.hide();
            } else {
                widgetThis.oButton.css({
                    'display' : 'inline-block'
                });
            }
        },
        "_setDisable" : function() {
            var widgetThis = this;
            widgetThis.disable = widgetThis.options["disable"];
            if (util.isTrue(widgetThis.disable)) {
                widgetThis.oButton.removeClass(widgetThis.defaultButtonBackgroundClass);
                widgetThis.oButton.removeClass(widgetThis.defaultButtonClass);
                widgetThis.oButton.addClass(widgetThis.defaultDisableButtonClass);
            } else {
                widgetThis.oButton.removeClass(widgetThis.defaultDisableButtonClass);
                widgetThis.oButton.addClass(widgetThis.defaultButtonClass);
                widgetThis.oButton.addClass(widgetThis.defaultButtonBackgroundClass);
            }
            widgetThis._setIcons();
        },
        "_setTooltip" : function(value) {
            var widgetThis = this;
            if (value) {
                if (widgetThis.tip) {
                    widgetThis.tip.option("content", value);
                    widgetThis.tip.option("width", widgetThis.options.tipWidth);
                } else {
                    widgetThis.tip = new Tip({
                        "content" : value,
                        "element" : widgetThis.oButton,
                        "width" : widgetThis.options.tipWidth
                    });
                }
            }
        },
        "_setText" : function() {
            var widgetThis = this;
            var centerTextDiv = widgetThis.oButton.find(".tiny-button-buttonCenterText");
            var leftIcon = widgetThis.options["icon-class"]; 
            var rightIcon = widgetThis.options["icon-right-class"];
            if (widgetThis.options["text"]) {
                centerTextDiv.html(widgetThis.options["text"]);
            } else {
                if (!rightIcon && !leftIcon) {
                    centerTextDiv.html($('<span>&nbsp;</span>'));
                } else {
                    centerTextDiv.html($('<span></span>'));
                }
            }
        },
        

        "_setIcons" : function() {
            var widgetThis = this,iconClass = widgetThis.options["icons-class"], 
            iconLeftClass = iconClass["left"],
            iconRightClass = iconClass["right"],
            leftImgDiv = widgetThis.oButton.find(".tiny-leftImg"), 
            rightImgDiv = widgetThis.oButton.find(".tiny-rightImg");
             
            //当左侧图片的class存在时
            if (iconLeftClass) {
                //默认样式设置
                leftImgDiv[0].style.display = "inline-block";
                leftImgDiv.addClass("tiny-button-buttonLeftImg");
                leftImgDiv.addClass(iconLeftClass);                    
                //若button被设置为disable，则改变图片的透明度背景图片的透明度，达到灰化的效果
                if (util.isTrue(widgetThis.disable) && !(leftImgDiv.hasClass("tiny-button-imgDisable"))) {
                    leftImgDiv.addClass("tiny-button-imgDisable");
                }
                else if (util.isFalse(widgetThis.disable) && (leftImgDiv.hasClass("tiny-button-imgDisable"))){
                    leftImgDiv.removeClass("tiny-button-imgDisable");
                }
                
            } else {
                leftImgDiv[0].style.display = "none";
            }
            
            //当右侧图片的class存在时
            if (iconRightClass) {
                //默认样式设置
                rightImgDiv[0].style.display = "inline-block";
                rightImgDiv.addClass("tiny-button-buttonRightImg");
                rightImgDiv.addClass(iconRightClass);
                
                //若button被设置为disable，则改变图片的透明度背景图片的透明度，达到灰化的效果
                if (util.isTrue(widgetThis.disable)&& !(rightImgDiv.hasClass("tiny-button-imgDisable"))) {
                    rightImgDiv.addClass("tiny-button-imgDisable");
                }
                else if (util.isFalse(widgetThis.disable) && (rightImgDiv.hasClass("tiny-button-imgDisable"))){
                    rightImgDiv.removeClass("tiny-button-imgDisable");
                }

            } else {
                rightImgDiv[0].style.display = "none";
            }
        }
    });

    return Button;

});
