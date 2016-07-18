/**
 * Tiny IP widget. 版本日期  
 * 
 * [DOM组成说明]：
 * <div class="tiny_input_ip_container">------------最外层DIV
 *     <input class = "tiny-ip-value-input"/>-------用来记录ip值的输入框(该input框不显示)
 *     
 *   ip各子input框的组成(根据类型生成)：
 *     <input type="text" class="tiny_input_ip_anchor tiny_input_ip_octet"/>---IPV4的各段IP输入框
 *     *****各class的作用：1.tiny_input_ip_octet用来标识ipv4,tiny_input_ip_octet_v6用来标识ipv6--在绑定键盘事件时,由此区分;
 *                        2.tiny_input_ip_anchor---用来标识ipv4/ipv6各段输入框,方便focus/blur事件的绑定
 *     <span class="tiny_input_ip_division">.</span>-----各输入框之间的隔断
 *     ...
 * 
 * </div>
 * 
 * [属性]：
 * type: "ipv4"(默认值), "ipv6"         不支持动态更新
 * value: ipv4/ipv6值,若非法,则设置无效    支持动态更新
 * disable:是否 灰化(默认false)          支持动态更新
 * width: 整个控件的宽度                                 支持动态更新
 * focused：是否设置默认焦点                         不支持动态更新
 * validate/tooltip: 校验，请参考校验相关资料
 *
 * [方法]：
 * getValue(): 获取ip输入框的值(各子input框拼接得到的值,同option("value"))
 * setDisable(): 设置disable状态 (重复方法,同option("disable", value),为确保接口不变更,保留)
 * 
 * [事件]：
 * 无
 * 
 * [内部事件]：
 * keydown：对各键盘码进行处理 1.非法字符过滤;2.'>'或'.'跳至下一子输入框中; 
 *          3.向右键→/输入框输入值跳至下一输入框时的处理; 4.向左键←/backspace键跳至前一输入框时的处理
 * keyup：1.子input框中内容检验(ipv4有检验,ipv6无需检验);2.整合各子input框中的值,拼装得到新的值
 * focusEvt：校验及tooltip，该事件触发tooltip的显示和校验error的消失，UnifyValid实现事件处理.
 * blurEvt：  校验及tooltip，该事件触发tooltip的消失和输入校验，UnifyValid实现事件处理,.
 * 
 * [内部属性]： 
 * 
 **/
define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/jquery.caret", "tiny-widgets/Widget", "tiny-common/UnifyValid"], 
function(angular, $, caret, Widget, UnifyValid) {
    var DEFAULT_CONFIG = {
        "type" : "ipv4",
        
        //validator param
        "isValidTip" : true,
        "template" : '<div class="tiny_input_ip_container">' 
                   +     '<input class = "tiny-ip-value-input"/>' 
                   + '</div>' 
    };
    
    var CONST_VALUES = {
        "IPV4_DEFAULT_WIDTH"       : 141,     //IPV4输入框默认宽度,同时也是IPV4的最小宽度,设置宽度需要超过该值
        "IPV4_INPUT_DEFAULT_WIDTH" : 30,      //IPV4每个input框默认宽度
        "IPV6_DEFAULT_WIDTH"       : 313,     //IPV6输入框默认宽度,同时也是IPV4的最小宽度,设置宽度需要超过该值
        "IPV6_INPUT_DEFAULT_WIDTH" : 35       //IPV6每个input框默认宽度
    };
    
    var IPS = Widget.extend({
        "init" : function(options) {
            var ipThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            ipThis._super(options); 
            
            //根据type属性拼装IP控件的各个子input的DOM
            ipThis._createDom(options.type);
            ipThis._setOptions(options);
            
            //增加校验
            ipThis._addValidator();
            
            $("#" + options.id).append(ipThis._element);
            
            //设置focus状态
            if("true" === String(options.focused)) {
            	ipThis._setFocuse();
            }
        },
        
        "_addValidator" : function() {
        	var ipThis = this, options = ipThis.options;
        	
        	//add validator 
            if (options.tooltip || options.validate) {
                ipThis._element.attr("validator", options.validate);
                ipThis._element.attr("isValidTip", options.isvalidtip);
                ipThis._element.attr("errorMsg", options.errorMsg || "");
                ipThis._element.attr("extendFunction", options.extendFunction); 
                UnifyValid.instantValid(ipThis.$ipInput, ipThis._element, options.validate, options.tooltip||"", true, 
                options.errorMsg||undefined, options.extendFunction||undefined, undefined, options.tipWidth||undefined);
            }
        },
        
        "_setOption" : function(key, value) {
            var ipThis = this;
            ipThis._super(key, value);

            switch (key) {
            	case "id" :
                    ipThis._updateId(value);
                    break;
                case "value" :
                    ipThis._updateValue(value);
                    break;
                case "disable" :
                    ipThis.setDisable(value);
                    break; 
                case "width" :
                    ipThis._updateWidth(value);
                    break; 
                default :
                    break;
            }
        },
        
        "_createDom" : function(type) {
            var ipThis = this, cells = [], $cell_html; 
            
            if ('ipv6' !== type) {
                for (var i = 0; i < 4; i++) {
                    cells.push('<input type="text" class="tiny_input_ip_anchor tiny_input_ip_octet" maxlength = "3"/>');
                }
                $cell_html = $(cells.join('<span class="tiny_input_ip_division">.</span>'));
            } 
            else {
                for (var i = 0; i < 8; i++) {
                    cells.push('<input type="text" class="tiny_input_ip_anchor tiny_input_ip_octet_v6" maxlength = "4"/>');
                }
                $cell_html = $(cells.join('<span class="tiny_input_ip_division">:</span>'));
            }            
            ipThis._element.append($cell_html);
            
            //记录ip中input框数组,方便后续代码中复用
            ipThis.$cellArray = ipThis._element.find(".tiny_input_ip_anchor"); 
        },
        
        "_updateValue" :function(value) {        	
        	var ipThis = this, options = ipThis.options, type = options.type;
        	
            if ('ipv6' !== type) { 
                if(!ipThis._isIpv4(value)) {
                	ipThis._clearIpv4Value();
                	return;
                } 
                
                //设置IPV4值(非法时设置为"")
                ipThis._setIpv4Value(options.value);                
            } 
            else {
                if(!ipThis._isIpv6(value)) {
                	options.value = "";
                	ipThis._clearIpv6Value();
                	return;
                } 
                
                //设置IPV6值(非法时设置为"")
                ipThis._setIpv6Value(options.value);
            }
        },
        
        "_clearIpv4Value" : function() {
        	var ipThis = this;
        	var $cellArray = ipThis.$cellArray; 
        	
        	for (var i = 0; i < 4; i++) {
        		$($cellArray[i]).val("");
        	}
        	ipThis.options.value = "";
            ipThis.$ipInput.val(ipThis.options.value);  
        },
        
        "_clearIpv6Value" : function() {
        	var ipThis = this;
        	var $cellArray = ipThis.$cellArray; 
        	
        	for (var i = 0; i < 8; i++) {
        		$($cellArray[i]).val("");
        	}
        	ipThis.options.value = "";
            ipThis.$ipInput.val(ipThis.options.value);  
        },
        
        "_setIpv4Value" : function(value) {
            var ipThis = this;            
        	var ip_valueNew = [];//声明新的数组,用于记录格式化后的value数组        	
            var ip_value = value.split('.');//声明数组,用于记录源数据value值数组(将ipv4的value分解) 
            var $cellArray = ipThis.$cellArray; 
            
            //将处理的value值平均分配在每个输入框中
            for (var i = 0; i < 4; i++) {
            	//将ip值中类似于 000 方式的字段更改为 0 
                ip_value[i] = parseInt(ip_value[i], 10);
                ip_valueNew.push(ip_value[i]);
                $($cellArray[i]).val(ip_value[i]+"");
            }
            
            //将标准化之后的值拼装,并更新value值,要记录两个值：
            //  1.options.value(用于用户获取值);
            //  2.将值放入隐藏的input中(用于校验取值)
            ipThis.options.value = ip_valueNew.join('.');
            ipThis.$ipInput.val(ipThis.options.value);
        },
        
        
        "_setIpv6Value" : function(value) {
            var ipThis = this, ip_value = value.split(':'), $cellArray = ipThis.$cellArray;
            
            for (var i = 0; i < 8; i++) {
                $($cellArray[i]).val(ip_value[i]+"");
            }
            
            //将标准化之后的值拼装,并更新value值,要记录两个值：
            //  1.options.value(用于用户获取值);
            //  2.将值放入隐藏的input中(用于校验取值)
            ipThis.$ipInput.val(value);
            ipThis.options.value = value;
        },
      
        "_setFocuse" : function(value) {
        	var ipThis = this, firstcell = ipThis.$cellArray[0];
        	//设置focused标志,用于rendTo和指令方式中默认焦点的设置
        	$(firstcell).attr("focused", true);
        	firstcell.focus();
        },
        
        "setDisable" : function(disable) {
            var ipThis = this,
            $element = ipThis._element;
            
            if ("true" === String(disable)) {
            	//将ip中每一个input框/分割符设置为disable状态,并设置disable背景色(由class控制)
                ipThis.$cellArray.attr("disabled", "disabled");
                $element.find("span.tiny_input_ip_division").attr("disabled", "disabled");
                $element.addClass("tiny_ip_container_disable");
                
                //加校验器中的disable标志
                if(ipThis.options.validate){
                    $element.attr( "tiny-valid-disable", true);
                    UnifyValid.clearValidate($element);
                }  
            }
            else {
                ipThis.$cellArray.removeAttr("disabled");
                $element.find("span.tiny_input_ip_division").removeAttr("disabled");
                $element.removeClass("tiny_ip_container_disable");
                
                if(ipThis.options.validate){
                    $element.attr( "tiny-valid-disable", false);
                }  
            }
        },
        
        "_updateWidth" :function(value) {
        	var ipThis = this, widthset = parseInt(value,10);
        	var $cellArray = ipThis.$cellArray;
        	
        	if("ipv6" !== ipThis.options.type) {
        		// 不能小于默认宽度，ipv4默认宽度141.每个input为30,在css中指定.如有修改,请同步修改常量数字
        		if(widthset <= CONST_VALUES.IPV4_DEFAULT_WIDTH){
        			return;
        		} 
        		  
        		// 将加大的宽度分摊到4个input中，取整，最后一个拿到剩余的宽度
        		var add= Math.floor((widthset-CONST_VALUES.IPV4_DEFAULT_WIDTH)/4);
        		for(var i = 0; i < 3; i++) {
        			$($cellArray[i]).css("width",add + CONST_VALUES.IPV4_INPUT_DEFAULT_WIDTH);
        		}
        		$($cellArray[3]).css("width",widthset-(CONST_VALUES.IPV4_DEFAULT_WIDTH - CONST_VALUES.IPV4_INPUT_DEFAULT_WIDTH)-add*3);
        	}
        	else {
        		// 不能小于默认宽度，ipv6默认宽度313.每个input为35,在css中指定.如有修改,请同步修改常量数字
        		if(widthset <= CONST_VALUES.IPV6_DEFAULT_WIDTH){
        			return;
        		} 
        		
        		// 将加大的宽度分摊到8个input中，取整，最后一个拿到剩余的宽度
        		var add= Math.floor((widthset-CONST_VALUES.IPV6_DEFAULT_WIDTH)/8);
        		for(var i = 0; i < 7; i++) {
        			$($cellArray[i]).css("width",add+CONST_VALUES.IPV6_INPUT_DEFAULT_WIDTH);
        		}
        		$($cellArray[7]).css("width",widthset-(CONST_VALUES.IPV6_DEFAULT_WIDTH - CONST_VALUES.IPV6_INPUT_DEFAULT_WIDTH)-add*7); //(widthset-313)-add*7+35
        	}
        },
        
        "getValue" : function() {
            var ipThis = this;
            return (ipThis.options.value || "");
        },  
        
        "_isIpv4" : function(value) {
            var rgx = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
            return rgx.test(value);
        },

        "_isIpv6" : function(value) {
            var rgx = /\b([A-F0-9]{1,4}:){7}([A-F0-9]{1,4})\b/i;
            return rgx.test(value);
        },
        
        "_isValidKeyIPV4" : function(e) {        	         
            var valid = [8,       // backspace
                         9,       // tab
                         37,      // left arrow
                         39,      // right arrow
                         46,      // delete
                         48, 96,  // 0
                         49, 97,  // 1
                         50, 98,  // 2
                         51, 99,  // 3
                         52, 100, // 4
                         53, 101, // 5
                         54, 102, // 6
                         55, 103, // 7
                         56, 104, // 8
                         57, 105, // 9
                         110, 190 // .
                       ];
            var keyCode = e.keyCode;          
            //只有shift+tab键(焦点向上转移)有效
            if (e.shiftKey && keyCode != 9) {
                return false;
            }
            if (_.contains(valid, keyCode)) {
                return true;
            }
            return false;
        },
        
        "_isValidKeyIPV6" : function(e) {
            var valid = [8,       // backspace
                         9,       // tab
                         37,      // left arrow
                         39,      // right arrow
                         46,      // delete
                         48, 96,  // 0
                         49, 97,  // 1
                         50, 98,  // 2
                         51, 99,  // 3
                         52, 100, // 4
                         53, 101, // 5
                         54, 102, // 6
                         55, 103, // 7
                         56, 104, // 8
                         57, 105, // 9
                         110, 190,// .
                         65,      // a
                         66,      // b
                         67,      // c
                         68,      // d
                         69,      // e
                         70       // f
                       ];       
                         
            var keyCode = e.keyCode;
            //1.先判断是否为shift+ 允许的键盘值;2.再判断是否为合法的键盘值
            if (e.shiftKey) {
            	//shift+tab / shift+ a~f
            	if((9 == keyCode) || (keyCode >= 65 && keyCode <= 70)) {
            		return true;
            	}
            	return false;
            }           
            if(_.contains(valid, keyCode)) {
            	return true;
            }
            return false;
        },

        "_isNumeric" : function(e) {
            if (e.shiftKey) {
            	return false;
            }                
            return (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
        },

        "_isHexaDecimal" : function(e) {
            var keyCode = e.keyCode;
            if (!e.shiftKey) {
                if ((keyCode >= 48 && keyCode <= 57) 
                    || (keyCode >= 96 && keyCode <= 105) 
                    || (keyCode >= 65 && keyCode <= 70))
                    return true;
            } 
            else {
                if (keyCode >= 65 && keyCode <= 70)
                    return true;
                else {
                    return false;
                }
            }
        },
        
        "_isIPV4MoveToNext" : function(thisInput, next_cell, e) {
        	return (thisInput.value.length == 3) && (this._isNumeric(e) 
        	        && ($(thisInput).caret()[0] == 3) && next_cell.length);
        },
        
        "_isIPV6MoveToNext" : function(thisInput, next_cell, e) {
        	return (thisInput.value.length == 4) && (this._isHexaDecimal(e)
        	        && ($(thisInput).caret()[0] == 4) && next_cell.length);
        },

        "_isPrevous" : function(keyCode, thisInput, prevcellLength) {
        	return ((keyCode == 37 && $(thisInput).caret()[0] == 0) 
                || (keyCode == 8 && $(thisInput).caret()[0] == 0)) && prevcellLength;
        },
        
        "_keydownHandle" : function(e, thisInput, type) {
        	var ipThis = this,
        	next_cell = $(thisInput).next('span.tiny_input_ip_division').next('input.tiny_input_ip_anchor'),
        	prev_cell = $(thisInput).prev('span.tiny_input_ip_division').prev('input.tiny_input_ip_anchor'),
        	keyCode = e.keyCode;
        	
            //键盘码110代表. 190代表 >.---当键盘码为这两种时,跳至下一输入框中,并选中该输入框中的值
            if (110 == keyCode || 190 == keyCode) {
            	if(next_cell.length) {//非最后一个输入框时，跳至下一输入框
            	    next_cell.focus();
                    next_cell.select();
            	}                
                e.preventDefault();//不论是否为最后一个输入框,防止默认事件发生,否则输入框中会出现 ...
                return;
            }
                
            //如果输入为合法数字,输入框中已有3个值,光标位于输入框末尾,并且存在下一输入框, 则跳至下一输入框
            if("ipv6" !== type) {
            	var isMoveToNext = ipThis._isIPV4MoveToNext(thisInput, next_cell, e);
            } 
            else {
            	var isMoveToNext = ipThis._isIPV6MoveToNext(thisInput, next_cell, e);
            }   
            
            if(isMoveToNext) {
            	next_cell.focus().caret(0);          
            }
            
            //当为向右键时→,且光标位置在该输入框末尾。则直接跳到下一输入框中
            if((keyCode == 39 && $(thisInput).caret()[0] == thisInput.value.length)) {
            	if(next_cell.length) {
            	    next_cell.focus().caret(0);  //存在下一个输入框,则跳至下一输入框    
            	    return;       
            	} 
            }
            
            //1.当为向左键(37),且光标位置位于输入框起始位置时,则跳至前一输入框中;
            //2.当为backspace键,且已回删至输入框起始位置 跳至前已输入框中
            if (ipThis._isPrevous(keyCode, thisInput, prev_cell.length)) {
                prev_cell.caret(prev_cell.val().length);
                e.preventDefault();//防止默认事件发生,否则输入框中的回退光标位置会有问题
            }
        },
        
        /**
         * 对IPV4输入框中的值做合法性处理（1.对于00X/0X类型的输入做去0处理；2.对超出范围的值做强转）
         */
        "_setIPV4Val" : function(ipThis) {
        	//获取input框中内容
        	var value = this.value;
        	
        	//1.如果值为空，不做处理（注：输入框中的值只可能是空/数字，keydown和keyup事件中已完成输入字符合法性检查）
        	if(value == "") {
        		return;
        	}
		
        	//2.将字符串数字转化为数字形式：1）对于00X/0X类型的输入做去0处理；2）与255数字比较大小
        	var newValue = parseInt(value, 10);
        	
        	//3.对输入框中的值范围进行限定 字符串与数字比较,会强转（与keyup事件中强转不同的是，针对按键不放进输入的情况可进行的处理）
        	if(newValue > 255) {
        		newValue = 255;
        	}
        	
        	//4.修改输入框中的值 
        	this.value = newValue;
        	
        	//5.设置IP值
        	var ip_value = [];
            var inInputArray = ipThis.$cellArray;
        	for (var i = 0; i < 4; i++) {
                ip_value.push(inInputArray[i].value);
            }
            var ipValue = ip_value.join('.');
            //如果各输入框中均无内容,将值设为""
            if("..." === ipValue) {
                ipValue = "";
            }
                
            //将获取的该ip值记录到---1.记录ip值的input框中(方便校验);2.ip的options属性中,方便用户获取
            ipThis.$ipInput.val(ipValue);
            ipThis.options.value = ipValue;
        },
        
        "_addBehavior" : function() {
            var ipThis = this, options = ipThis.options;            
            ipThis.$ipInput = ipThis._element.find(".tiny-ip-value-input");
            
            ipThis._element.on("keydown", "input.tiny_input_ip_octet", function(e) {
            	//非法字符过滤
                if (!ipThis._isValidKeyIPV4(e)) {
                	e.preventDefault();
                	return;
                }
                ipThis._keydownHandle(e, this, "ipv4");   
            });

            ipThis._element.on("keyup", "input.tiny_input_ip_octet", function(e) {
            	if(9 == e.keyCode) {
            		return;
            	}
            	//中文输入情况下，非法字符过滤,使用正则表达式后再修改值之前
            	//否则，光标位置会随赋值而改变
            	var ipv4CheckReg = /[\D]/g;
            	var value = this.value;
            	if(ipv4CheckReg.test(value)) {
                    this.value = value.replace(ipv4CheckReg,'');
            	}            	
            	
            	//对输入框中的值范围进行限定 字符串与数字比较,会强转
                if (this.value > 255) {
                	this.value = 255;
                }

                //将ip输入框中的各个值进行拼装处理,得到ip值
                var ip_value = [];
                var inInputArray = ipThis.$cellArray;
                for (var i = 0; i < 4; i++) {
                    ip_value.push(inInputArray[i].value);
                }
                var ipValue = ip_value.join('.');
                //如果各输入框中均无内容,将值设为""
                if("..." === ipValue) {
                    ipValue = "";
                }
                
                //将获取的该ip值记录到---1.记录ip值的input框中(方便校验);2.ip的options属性中,方便用户获取
                ipThis.$ipInput.val(ipValue);
                ipThis.options.value = ipValue;
            });            

            ipThis._element.on("keydown", "input.tiny_input_ip_octet_v6", function(e) {
            	//非法字符过滤
                if (!ipThis._isValidKeyIPV6(e)) {
                    e.preventDefault();
                    return;
                }                    
                ipThis._keydownHandle(e, this, "ipv6");
            });

            ipThis._element.on("keyup", "input.tiny_input_ip_octet_v6", function(e) {
            	if(9 == e.keyCode) {
            		return;
            	}
            	//中文输入情况下，非法字符过滤,使用正则表达式后再修改值之前
            	//否则，光标位置会随赋值而改变
            	var ipv6CheckReg = /[^a-f\d]/ig;
            	var value = this.value;
            	if(ipv6CheckReg.test(value)) {
            	    this.value = value.replace(ipv6CheckReg,'');
            	}
                var ip_value = [];
                var inInputArray = ipThis.$cellArray;
                for (var i = 0; i < 8; i++) {
                    ip_value.push(inInputArray[i].value);
                }
                var ipValue = ip_value.join(':');
                //如果各输入框中均无内容,将值设为""
                if(":::::::" === ipValue) {
                    ipValue = "";
                }
                ipThis.$ipInput.val(ipValue);
                ipThis.options.value = ipValue;                
            });

            var haveFocus = false, isOtherInput = false;
            ipThis._element.on("blur", "input.tiny_input_ip_anchor", function(e) {
            	//如果是IPV4，做输入内容合法性处理，blur事件的this指的是当前失去焦点的输入框
            	if($(this).hasClass("tiny_input_ip_octet")) {
            		ipThis._setIPV4Val.call(this, ipThis);
            	}
                setTimeout(function() {

                    // 如果不是控件内转移焦点，则整个控件失去焦点
                    if(!isOtherInput) {
                    	haveFocus = false;
            	        ipThis._element.removeClass("tiny_input_ip_container_focus");  
                        ipThis.$ipInput.trigger("blurEvt", []);             
                    }
                    else {
                        isOtherInput = false;
                    } 
                }, 10);
            });
            
            ipThis._element.on("focus", "input.tiny_input_ip_anchor", function(e) {

                // 如果控件之前就已经获得了焦点，记录isOtherInput以判断焦点控件内转移的情况,否则是控件获得焦点
                if (haveFocus) {
                	isOtherInput = true;
                }
                else {
                    haveFocus = true;
                    ipThis._element.addClass("tiny_input_ip_container_focus");
                    ipThis.$ipInput.trigger("focusEvt", []);
                } 
            });
        }
    });
    return IPS;
});