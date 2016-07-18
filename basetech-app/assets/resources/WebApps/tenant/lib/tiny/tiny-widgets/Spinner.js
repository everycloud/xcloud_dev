define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util", "tiny-widgets/Tip"], 
function(angular, $, Class, Widget, util, Tip) {
    var DEFAULT_CONFIG = {
        "step" : "1",
        "placeholder" : "",
        "disable" : false,
        "width" : 200,
        "template" : 
        '<div class="tiny-spinner" id="">' 
        +'<div class="tiny-spinner-container">'
        +'<div class="tiny-spinner-editor">'
        +'<input type="text" class="tiny-spinner-input" placeholder = ""/>'
        +'</div>'
        +'<div class="tiny-spinner-upbtn tiny-spinner-updownbutt-style"></div>'
        +'<div class="tiny-spinner-downbtn tiny-spinner-updownbutt-style"></div>'
        +'</div>' 
        + '</div>'
    };
    
    var Spinner = Widget.extend({
        "init" : function(options) {
            var spinnerThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            spinnerThis._super(options);        
            spinnerThis.$selectInput = spinnerThis._element.find(".tiny-spinner-input");
            spinnerThis._setOptions(options);
            $("#" + options["id"]).append(spinnerThis._element);
        },

        "_setOption" : function(key, value) {
            var spinnerThis = this;
            options = spinnerThis.options;
            spinnerThis._super(key, value);
            switch (key) {
                case "id":
                    spinnerThis._updateId(value);   
                    break;
                case "value":
                    value = isNaN(value) || ("" === value) ? "" :parseFloat(value);
                    spinnerThis._updateValue(value);    
                    break;
                case "step":                    
                    spinnerThis.step = parseFloat(value);      
                    break;    
                case "placeholder":
                    spinnerThis._updatePlaceholder(value);    
                    break;
                case "width":                      
                    value = parseInt(value,10);
                    spinnerThis._element.find(".tiny-spinner-container").css("width",value-2); 
                    spinnerThis.$selectInput.css("width",value-25);
                    spinnerThis.$selectInput.parent().css("width",value-25);
                    break;
                case "max":                               
                    spinnerThis._checkCurrentValue("max", value);
                    break;
                case "min":                                
                    spinnerThis._checkCurrentValue("min", value);
                    break;
                case "disable": 
                    spinnerThis._setDisable(value);
                default:
                    break;
           }
        },
        
        //设置最大最小值后，1.修改用来标识最大最小值的全局变量；2.根据限定范围修正当前值
        //重设max和min值后， 检查 当前输入框中的值，如果在范围之外，则需要重置。
        "_checkCurrentValue": function(minMax, value){
            var spinnerThis = this;
            var options = spinnerThis.options;
            
            //设置非法直接返回
            if("min" == minMax) {
            	
            	//非数字或为空时返回
            	if(isNaN(value) || ("" === value)) {
            		return;
            	} 
            	spinnerThis.minNum = parseFloat(value);
            } else {
            	if(isNaN(value) || ("" === value)) {
            		return;
            	} 
            	spinnerThis.maxNum = parseFloat(value);
            }
            
            var inputValue = spinnerThis.$selectInput.val();
            if ("" == inputValue){
                return;
            } 
            options["value"] = spinnerThis._restrictInputVal(inputValue);            
        },
        
        
        "_setDisable": function(value) {
            var spinnerThis = this;
            if(String(value) === "true"){
                spinnerThis._element.find(".tiny-spinner-container").addClass("tiny-spinner-container-disabled");
                spinnerThis._element.find(".tiny-spinner-input").attr("disabled","disabled");
                spinnerThis._element.find(".tiny-spinner-input").addClass("tiny-spinner-input-disabled");
            }
            else{
                spinnerThis._element.find(".tiny-spinner-container").removeClass("tiny-spinner-container-disabled");
                spinnerThis._element.find(".tiny-spinner-input").removeAttr("disabled");
                spinnerThis._element.find(".tiny-spinner-input").removeClass("tiny-spinner-input-disabled");
            }
        },
         
        "_updatePlaceholder": function(value) {
            var spinnerThis = this;
            var options = spinnerThis.options;
            var placeholder = options["placeholder"];
            if("" != options["placeholder"]){                
                spinnerThis.$selectInput.attr("placeholder",placeholder);
            }
        },
        
        "_updateValue":function(value){
            var spinnerThis = this,
            options = spinnerThis.options;
            
            //判断最大值是否非数字（注：1.未定义，非数字：isNaN(undefined)→true； 2.数字字符串形式，为数字：isNaN("3.12")→false）
            if (!isNaN(options["max"])) {
                spinnerThis.maxNum = parseFloat(options["max"]);
                
                //数字和最大值比较（均已将其转化为数字）
                if(spinnerThis.maxNum < value){        
                    value = spinnerThis.maxNum;
                }
            }
            if (!isNaN(options["min"])) {
                spinnerThis.minNum = parseFloat(options["min"]);
                if(spinnerThis.minNum > value){          
                    value = spinnerThis.minNum;
                }
            }
            options["value"] = value;
            spinnerThis.$selectInput.val(value);     
        },
        
        //calculate Num
        "_accOperate" :  function(arg1, arg2, method) {        
            var r1, r2, m, c;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 };  
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 };  
            c = Math.abs(r1 - r2);     
            m = Math.pow(10, Math.max(r1, r2));  
            if (c > 0) {            
                var cm = Math.pow(10, c);
                if (r1 > r2) {       
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            if("add" == method) {
               return (arg1 + arg2) / m;
            }
            if("sub" == method) {
               return (arg1 - arg2) / m;
            }
        },
        
        "_stepNaNInput" : function() {
        	var spinnerThis = this, inputValue;
            //1.若定义了最大值，则设置value为maxNum；2.若定义了最小值，则设置value为minNum
            //3.若无最大最小值定义，则设置为0  注：spinnerThis.maxNum有三种特殊取值需要注意：0，undefined，NaN
            if(void 0 !== spinnerThis.maxNum) {
                inputValue = spinnerThis.maxNum;
            } else if(void 0 !== spinnerThis.minNum) {
                inputValue = spinnerThis.minNum;
            } else {
                inputValue = 0; 
            }          	
            spinnerThis.$selectInput.val(inputValue); 
        },
        
        "_restrictInputVal" : function(inputValue) {
            var spinnerThis = this;
            if(parseFloat(inputValue) > spinnerThis.maxNum){     
                inputValue = spinnerThis.maxNum;
            } else if(parseFloat(inputValue) < spinnerThis.minNum){
                inputValue = spinnerThis.minNum;
            }  
            spinnerThis.$selectInput.val(inputValue);
            return inputValue;
        },
        
        "_stepUp" : function(step) {
            var spinnerThis = this,
            options = spinnerThis.options,
            inputValue = spinnerThis.$selectInput.val(); 
             
            //1.输入框中内容为空或不合法时的处理，  注：isNaN("") isNaN(".12") → false
            if(("" == inputValue) || (isNaN(inputValue))){
                spinnerThis._stepNaNInput();            	 
            	return;
            }
            
            //2.对合法数字微调处理
            //inputValue不需转为数字类型，因为在_accOperate有做特殊处理           
            inputValue = spinnerThis._accOperate(inputValue, step, "add");
            
            //3.微调后数字不在限制范围内的处理，注：需要对最小值做限制，因为开始并没有判断合法数字的合理性（该合法数字可能本身是小于最小值的）  
            //这里不对spinnerThis.maxNum做是否是undefined和是否是NaN校验是因为：undefined和NaN与一个数字比较时，结果为false，正好符合不设置最大值的情况
            spinnerThis._restrictInputVal(inputValue);    
        },
        "_stepDown" : function(step) {
            var spinnerThis = this,
            options = spinnerThis.options,
            inputValue = spinnerThis.$selectInput.val(); 
            
            //1.输入框中内容为空或不合法时的处理，  注：isNaN("") isNaN(".12") → false
            if(("" == inputValue) || (isNaN(inputValue))){
                spinnerThis._stepNaNInput();            	 
            	return;
            }
            
            //2.对合法数字微调处理
            //inputValue不需转为数字类型，因为在_accOperate有做特殊处理
            inputValue = spinnerThis._accOperate(inputValue,step,"sub");
            
            //3.微调后数字不在限制范围内的处理，注：需要对最小值做限制，因为开始并没有判断合法数字的合理性（该合法数字可能本身是大于最大值的）  
            //这里不对spinnerThis.minNum做是否是undefined和是否是NaN校验是因为：undefined和NaN与一个数字比较时，结果为false，正好符合不设置最小值的情况
            spinnerThis._restrictInputVal(inputValue);
        },
        "_isValidKey" : function(e) {
            var valid = [
                8,        // backspace
                9,        //tab
                13,       // enter
                27,       // escape
                35,       // end
                36,       // home
                37,       // left arrow
                39,       // right arrow
                46,       // delete
                38,       // up Arrow
                40,       // down Arrow
                48, 96,   // 0
                49, 97,   // 1
                50, 98,   // 2
                51, 99,   // 3
                52, 100,  // 4
                53, 101,  // 5
                54, 102,  // 6
                55, 103,  // 7
                56, 104,  // 8
                57, 105,  // 9
                110, 190, // period
                189,      //-
            ];
            for (var i = 0, c; c = valid[i]; i++) {
                if (e.keyCode == c) return true;
            }
            return false;
        },    
        "_addBehavior" : function() {
            var spinnerThis = this;
            var options = spinnerThis.options;
            var isnoblur = false; // 标志，如果是点击上下按钮导致的input blur，则不会去掉边框样式
            
            //点击上下按钮微调数字
            spinnerThis._element.on("click", ".tiny-spinner-upbtn", function(event) {   
                if(String(options["disable"]) === "true"){
                    return;
                }
                spinnerThis._stepUp(spinnerThis.step);
                spinnerThis.$selectInput.focus();    
            });
            spinnerThis._element.on("click", ".tiny-spinner-downbtn", function(event) {    
                if(String(options["disable"]) === "true"){
                    return;
                }
                spinnerThis._stepDown(spinnerThis.step);
                spinnerThis.$selectInput.focus();
            });
            
            spinnerThis._element.on("mousedown", ".tiny-spinner-downbtn", function(event) {   
                spinnerThis.cancelBlur = true;    
                setTimeout(function(){       
                    spinnerThis.cancelBlur = false;
                },10);
            });
            spinnerThis._element.on("mousedown", ".tiny-spinner-upbtn", function(event) {     
                spinnerThis.cancelBlur = true;    
                setTimeout(function(){
                    spinnerThis.cancelBlur = false;
                },10);        
            });
            
            //键盘上下键↑↓微调数字
            spinnerThis._element.on("keydown", ".tiny-spinner-container", function(event) {   
                if(38 == event.keyCode){//向上键
                    spinnerThis._stepUp(spinnerThis.step);
                }
                if(40 == event.keyCode){//向下键
                    spinnerThis._stepDown(spinnerThis.step);
                }
            }); 
            
            //input输入框的事件绑定   
            //1.keydown事件---输入合法性检查   can only input num . - 0~9
            spinnerThis._element.on("keydown", ".tiny-spinner-input", function(event) {        
                if (!spinnerThis._isValidKey(event)) {   
                    event.preventDefault();
                }
            });  
            
            //2.blur事件---1）对输入内容的合法性检验和处理；2）输入框中值改变时，触发change event
            spinnerThis._element.on("blur", ".tiny-spinner-input", function(event) { 
                if(spinnerThis.cancelBlur){
                    return;
                }
                var inputValue = spinnerThis.$selectInput.val(); 
                
                //1.输入内容非法情况下，将其清空；2.输入合法情况下，限制最大最小值
                if(isNaN(inputValue)) {
                	spinnerThis.$selectInput.val("");
                	inputValue = "";
                } else {
                	inputValue = spinnerThis._restrictInputVal(inputValue);
                }
                
                //输入框中值如果改变，触发change事件，并赋值
                //注：输入框中value赋值时机：1.初始设置；2.blur事件
                if(options["value"] != inputValue) {
                    options["value"] = inputValue;
                    $(this).trigger("changeEvt", [event]);
                }
            });    
            spinnerThis._element.on("changeEvt", function(event) {
                spinnerThis.trigger("change", [event]);  
                if ("function" == ( typeof options["change"])){
                    options["change"](event);
                }
            });
            
            spinnerThis._element.on("focus", ".tiny-spinner-input", function(event) {      
                spinnerThis._element.find(".tiny-spinner-container").addClass("tiny-spinner-container-forcus");
                isnoblur = false;
            });
            spinnerThis._element.on("blur", ".tiny-spinner-input", function(event) {     
                if (isnoblur) {
                    isnoblur = false;
                    return;
                }
                spinnerThis._element.find(".tiny-spinner-container").removeClass("tiny-spinner-container-forcus");
                isnoblur = false;
            });
            spinnerThis._element.on("mousedown", ".tiny-spinner-upbtn", function(event) {   
                isnoblur = true;
                spinnerThis._element.find(".tiny-spinner-container").addClass("tiny-spinner-container-forcus");    
            });
            spinnerThis._element.on("mousedown", ".tiny-spinner-downbtn", function(event) {  
                isnoblur = true;
                spinnerThis._element.find(".tiny-spinner-container").addClass("tiny-spinner-container-forcus");    
            });
        }
    });
    return Spinner;

});
