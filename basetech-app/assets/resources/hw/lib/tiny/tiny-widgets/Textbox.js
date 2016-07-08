define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-widgets/Widget", "tiny-widgets/Tip", "tiny-common/UnifyValid"],
    function(angular, $, Widget, Tip, UnifyValid){    
    var DEFAULT_CONFIG  = {        
        "template": "<span class='tiny-textbox'> </span>",
        "type": "input",
        "isvalidtip" : true,
        "focused" : false
    };    
    var Textbox = Widget.extend({
        "init":function(options){            
            var widgetThis = this; 
            options = _.extend({}, DEFAULT_CONFIG, options);
            widgetThis._super(options);
            widgetThis._setOptions( options );
            
            //及时校验
            if(options["validate"] || options.tooltip){
                UnifyValid.instantValid(widgetThis.$inputSel,widgetThis.$inputSel, options["validate"], options["tooltip"]||"", options["isvalidtip"], 
                widgetThis.options["errorMsg"]||undefined, options["extendFunction"]||undefined, options["tipPosition"], options["tipWidth"] || undefined);
            }
            $("#" + options["id"]).append(widgetThis._element);
            widgetThis._element.find(':input[focused="true"]').focus();
        },
        
        "_generateElement": function(){
            var widgetThis = this;
            var widgetElement = widgetThis._super();
            var textboxElement = null, focused = widgetThis.options["focused"];
            
            //根据类型创建输入类型
            if( widgetThis.options.type === "multi"){
                var textArea = document.createElement('textarea');
                if(widgetThis.options.validate){
                    $(textArea).attr("validator",widgetThis.options.validate);
                    $(textArea).attr("isValidTip",widgetThis.options.isvalidtip);
                    $(textArea).attr("errorMsg",widgetThis.options["error-msg"]||widgetThis.options["errorMsg"]||"");
                    $(textArea).attr("extendFunction",widgetThis.options["extendFunction"]);
                }
                if (focused) {
                    $(textArea).attr("focused", "true");
                }
                $(textArea).attr("ng-model",widgetThis.options["value"]);
                //设置高度、宽度，属性（换行等）
                if(widgetThis.options.rows && !(isNaN(parseInt(widgetThis.options.rows)))){
                    textArea.rows = parseInt(widgetThis.options.rows);
                }
                textboxElement = $(textArea);
                widgetElement.append(textArea);
            }
            else{
                var text = document.createElement('input');
                if(widgetThis.options.validate){
                    $(text).attr("validator",widgetThis.options.validate);
                    $(text).attr("isValidTip",widgetThis.options.isvalidtip);
                    $(text).attr("errorMsg",widgetThis.options["error-msg"]||widgetThis.options["errorMsg"]||"");
                    $(text).attr("extendFunction",widgetThis.options["extendFunction"]);
                }
                if (focused) {
                    $(text).attr("focused", "true");
                }
                $(text).attr("ng-model",widgetThis.options["value"]);
                text.type = (widgetThis.options.type === "password" )? "password" : "text";
                if(text.type === "password"){
                    $(text).bind('cut copy paste', function(event) {
                        event.preventDefault();
                       });
                }
                textboxElement = $(text);
                widgetElement.append(text);
            }
            textboxElement.addClass('tiny-input-text');
            return widgetElement;
        },
        
        "_setOption": function(key, value){
            var widgetThis = this,
                options = widgetThis.options;
            widgetThis.$inputSel= widgetThis._element.find(":input");
            widgetThis._super( key, value );
            switch( key ){
                case "id" :
                    widgetThis._updateId(value);
                    break;
                case "value":
                    widgetThis.$inputSel.val( value );
                    break;
                    //保持与原生一致
                case "readonly":
                    widgetThis.$inputSel.prop( "readonly", !!value );
                    break;
                case "disable":
                    var tinyDisable = ("true" === String(value)) ? true : false;
                    widgetThis.$inputSel.prop( "disabled", tinyDisable);
                    if(options.validate){
                        widgetThis.$inputSel.attr( "tiny-valid-disable", tinyDisable);
                    }
                    if(tinyDisable){
                        widgetThis.$inputSel.addClass("tiny-input-text-disabled");
                        UnifyValid.clearValidate(widgetThis.$inputSel);
                    }
                    else{
                        widgetThis.$inputSel.removeClass("tiny-input-text-disabled");
                    }
                    
                    break;
                case "width" :
                    var width = parseInt(value);
                    // 总宽度中扣除18px即为input的宽度，18px为边缘和外边距的和
                    if(!isNaN(width) && width > 18){
                        widgetThis.$inputSel.css("width",width-18);
                    }
                    break;
                case "height" :
                    var height = parseInt(value);
                    if(!isNaN(height) && height !== 0){
                        widgetThis.$inputSel.css("height",height);
                    }
                    break;
                default:
                    break;
            }
        },
        
        "getValue" : function() {
            var widgetThis = this;
            return widgetThis.$inputSel.val();
        },
        
        //命名规范 动宾
        "_addTip" : function(){
            var widgetThis = this;
            var position = widgetThis.options["tip-position"];
            if(!position) {
                position = "right";
            }
            //这里处理tooltip事件
            widgetThis.tip = new Tip({
                "auto" : false,
                "content" : widgetThis.options.tooltip,
                "element" : widgetThis.$inputSel,
                "position" : position,
                "width" : widgetThis.options.tipWidth
            });
            widgetThis.tip.show();
        },
        
        "_addBehavior": function(){
            var widgetThis = this,
            options = widgetThis.options,
            textboxElement = widgetThis._element.find(":input");
            textboxElement.on( "change", function(event){
                widgetThis.trigger( "change", [event] );
                 if ("function" == ( typeof options["change"])){
                    options["change"](event);
                }
            });
            
            //focus、blur
            textboxElement.on( "focus", function(event){
                textboxElement.trigger( "focusEvt", [event] ); 
                widgetThis.trigger( "focus", [event] ); 
                if ("function" == ( typeof options["focus"])){
                    options["focus"](event);
                }
            });
            textboxElement.on( "blur", function(event){
                textboxElement.trigger( "blurEvt", [event] ); 
                widgetThis.trigger( "blur", [event] );
                if ("function" == ( typeof options["blur"])){
                    options["blur"](event);
                }
            });
            
            //keypress
            textboxElement.on( "keypress", function(event){
                widgetThis.trigger( "keypress", [event] );
                if ("function" == ( typeof options["keypressfn"])){
                    options["keypressfn"](event);
                }
            });
            
             //keydown
            textboxElement.on( "keydown", function(event){
                widgetThis.trigger( "keydown", [event] );
                if ("function" == ( typeof options["keydownfn"])){
                    options["keydownfn"](event);
                }
            });
            
            //keyup
            textboxElement.on( "keyup", function(event){
                widgetThis.trigger( "keyup", [event] );
                if ("function" == ( typeof options["keyupfn"])){
                    options["keyupfn"](event);
                }
            });
        }
    });
    return Textbox;
});
