define(["tiny-lib/underscore", "tiny-lib/jquery", "tiny-widgets/Tip"], function(underscore, $, Tip) {

    //校验失败提示信息
    var ERROR_INFOMATION = {
        "required" : "The input cannot be empty.",
        "maxSize" : "The length of input cannot exceeds the maximum length.",
        "minSize" : "The length of input cannot less than the minimum length.",
        "maxValue" : "The input value cannot exceeds the maximum value.",
        "minValue" : "The input value cannot is less than the minimum value.",
        "regularCheck" : "The input value is invalid.",
        "notContains" : "The input value cannot contain illegal character.",
        "checkScriptInfo" : "The input value cannot contain <script...>.",
        "equal" : "The input value is invalid.",
        "path" : "The port number is an integer ranging from 0 to 65535.",
        "port" : "The input value does not meet the path format requirement.",
        "email" : "The input value is not a valid email address.",
        "date" : "The input value is not a valid date.",
        "url" : "The input value is not a valid URL",
        "integer" : "The input value is not a valid integer.",
        "number" : "The input value is not a valid number.",
        "float" : "The input value is not a valid float number.",
        "digits" : "The input value is not a valid digits."
    };

    var UnifyValid = {

        //即时校验
        "instantValid" : function(element, eleTipPosition, validate, tooltip, isValidTip, errorMsg, extendFunction, position, width) {
            var isCreatformTip = true;
            var tipObj;
            eleTipPosition[0].elementValue = element;
            element[0].tipposition = position;
            element[0].tipwidth = width;
            element.on("focusEvt", function() {
                
                //输入框获取焦点，删除校验信息
                if (isValidTip && eleTipPosition[0].validTip) {
                    eleTipPosition[0].validTip.remove();
                    
                    //file upload
                    if(element.hasClass("tiny-file-input")) {
                        element.removeClass("valid_error_input");
                    } else {
                        eleTipPosition.removeClass("valid_error_input");
                    }                    
                } else {
                    UnifyValid._defaultClickHandle.call(eleTipPosition);
                }
                if ("true" === eleTipPosition.attr("hasValidTip")) {
                    eleTipPosition.attr("hasValidTip", false);
                }
                if (("" !== tooltip) && (isCreatformTip)) {

                    //是否显示提示信息
                    tipObj = UnifyValid._addTip(eleTipPosition, tooltip, position, width);
                    isCreatformTip = false;
                }
            });

            if (validate) {
                UnifyValid._parseValidateParam(eleTipPosition, extendFunction, validate, errorMsg);
            }

            if (validate &&_.keys(eleTipPosition[0].attrObj).length > 0) {
                //绑定离开焦点，校验事件
                    element.on("blurEvt", function(evt) {
                        if (tipObj) {
                            tipObj.hide();
                        }
                        isCreatformTip = true;
                        UnifyValid._check(element, eleTipPosition, eleTipPosition[0].attrObj, isValidTip, eleTipPosition[0].attrMsgObj, extendFunction,position, width);
                    });
            }
            else {
                element.on("blurEvt", function() {
                    if (tipObj) {
                        tipObj.hide();
                    }
                    isCreatformTip = true;
                });
            }        },
        
        "clearValidate" : function(eleTipPosition) {
            if(eleTipPosition[0].validTip) {
                eleTipPosition[0].validTip.remove();
            }            
            eleTipPosition.removeClass("valid_error_input");
            eleTipPosition.attr("hasValidTip", false);
        },
        
        "_parseValidateParam" : function(element, extendFunction, validate, errorMsg) {
            if(element.hasClass("tiny-file-input")) {
                return;
            }
            element[0].attrObj = {};
            element[0].attrMsgObj = {};

            //add extend function
            if (extendFunction) {
                for (var e = 0, len = extendFunction.length; e < len; e++) {
                    UnifyValid.addFunction(extendFunction[e], null);
                }
            }
            var attrArray = _.keys(ATTRS);
            
            //分割 ;形式
            var validArray = validate.split(";");
            for (var i = 0, len = validArray.length; i < len; i++) {
                
                //参数初始化为空数组[],新的错误信息初始化为undefined
                var attrParam = [];
                var errorMsgNew = void 0;
                
                //1.先提取参数名 ---判断是否有参数 1)若无,则可直接以：分割,并剥离出参数名和错误信息; 
                //2)若有,则分两种情况进行处理---若为正则表达式,需要考虑字符串中有多于一个()或:。  ....以):[有参数的形式]   ...字符串末尾为)[无参数的形式]
                //                   ---非正则表达式,则直接以：分割,并同第一种情况
                
                //无参数形式(通过是否有括号判断)：  1.required:input cannont be empty;形式    2.required形式
                if(-1 === validArray[i].indexOf("(")) {
                    var attr = validArray[i].split(":");
                    var attrName = $.trim(attr[0]);
                    errorMsgNew = attr[1];
                } else { //带参数形式()：  1.maxSize(5):max size excced形式   2.maxSize(5)形式  3.regular({}:{}:{}:())形式
                     var attr = validArray[i].split("(");
                    var attrName = $.trim(attr[0]);
                    if("regularCheck" === attrName) { //只有regular形式才需要做特殊处理,判断.有两种形式 1.regular({}:{}:{}:())形式; 2.regular({}:{}:{}:()) :please input 形式
                        var attrParaAndMsg = validArray[i].split("regularCheck(").pop("");
                        attrParaAndMsg = $.trim(attrParaAndMsg);
                        if(attrParaAndMsg.charAt(attrParaAndMsg.length-1) === ")") {//regularCheck()形式
                            attrParam = [attrParaAndMsg.slice(0,-1)];
                        } else {//regularCheck():形式 ,通过 ): 或 ) ：进行分割
                            var value = attrParaAndMsg.split(/[\)]:|[\)]\s:/);
                            attrParam = [value[0]];
                            errorMsgNew = value[1];
                        }
                    } else {
                        var value = validArray[i].split(":");
                        attrParam = [value[0].slice(value[0].indexOf("(")+1, value[0].lastIndexOf(")"))];
                        errorMsgNew = value[1];
                    }
                }
                
                //如果该方法名属于合法的名字,则记录：1.参数记录;2.校验错误提示信息
                if (_.contains(attrArray, attrName)) {
                    errorMsgNew = errorMsgNew || errorMsg || ERROR_INFOMATION[attrName] || "";
                    _.extend(element[0].attrObj, _.object([attrName+i], [attrParam]));
                    _.extend(element[0].attrMsgObj, _.object([attrName+i], [errorMsgNew]));
                }
            }
        },
        
        "_addTip" : function(element, tooltip, position, width) {
            var tip = new Tip({
                "auto" : false,
                "content" : tooltip,
                "element" : element,
                "position" : position || "right",
                "width" : width
            });
            tip.show();
            return tip;
        },

        "addFunction" : function(name, callback) {
            ATTRS[name] = callback;
        },

        /**
         * 统一校验所有输入框，任何一个输入框非法，返回false，否则返回true
         * @param {Object} 必选参数，父容器（jquery对象）
         * @param {Object} elements
         */
        "FormValid" : function(container, elements) {
            var returnCode = true;
            var tmpReturn = true;
            var els = (elements ===
            void 0) ? container.find("[validator]") : elements;
            var attrArray = _.keys(ATTRS);
            var attrObj = {};
            _.each(els, function(element) {
                //处于display状态
                if($(element).is(":visible") === false) {
                    return;
                }
                //处于disable状态
                if("true" === $(element).attr("tiny-valid-disable")){
                    return;
                }
                
                //清除先前校验信息
                if ("true" === $(element).attr("hasValidTip")) {
                    UnifyValid.clearValidate($(element));
                }
                
                if (_.keys(element.attrObj).length <= 0) {
                    return;
                }
                var isValidTip = ($(element).attr("isValidTip") === "false") ? false : true,

                $elementTip = $(element), $elementValue = $(element.elementValue);
                //文件上传校验
                if($(element).hasClass("tiny-file-select")) {
                    if(element.validTipRecord) {
                        tmpReturn = false;
                   } else {
                       $elementValue = $(element).find(".tiny-file-input");
                       if (!UnifyValid._check($elementValue, $elementTip, element.attrObj, isValidTip, element.attrMsgObj, [$(element).attr("extendFunction")||""],element.tipposition, $elementValue[0].tipwidth)) {
                           tmpReturn = false;
                       }
                   }
                } else {
                    if (!UnifyValid._check($elementValue, $elementTip, element.attrObj, isValidTip, element.attrMsgObj, [$(element).attr("extendFunction")||""],element.tipposition, $elementValue[0].tipwidth)) {
                        tmpReturn = false;
                    }
                }
                
                if(!tmpReturn){
                    returnCode = false;
                }
                attrObj = {};
            });
            if(!tmpReturn){
                returnCode = false;
            }
            return returnCode;
        },

        /**
         * 校验输入信息
         * @param {Object} event
         */
        "_check" : function(element, elementTipPosition, obj, isValidTip, msgObj, extendFunction, position, width) {
            var fn;
            var isValid = true;
            
            _.each(obj, function(value, key, obj) {
                var msg = msgObj[key];
                key = key.slice(0,-1);
                if (!isValid) {
                    return false;
                }
                fn = ATTRS[key];
                if (extendFunction ){
                    //formValid中处理extendFunction 或  即时校验中处理extendFunction
                    var isExtendFun =  _.contains(extendFunction[0].split(","), key) || _.contains(extendFunction, key);
                } else {                
                    if(fn === null){
                        return true;
                    }
                    var isExtendFun = false;
                }
                if(isExtendFun){
                    //自定义函数
                    isValid = UnifyValid[key].call(element, value);
                    if(isValid === "") {
                        isValid = true;
                    }
                } else {
                    isValid = fn.apply(element, value);
                }
                if (false === isValid) {
                    UnifyValid._defaultFailedHandle.call(elementTipPosition, key, msg, isValidTip, position, width);
                }
                else if((isValid !== "")&&(true !== isValid)) {
                    UnifyValid._defaultFailedHandle.call(elementTipPosition, key, isValid, isValidTip, position, width);
                    isValid = false;
                }
            });
            if (isValid) {
                if (isValidTip) {
                    return true;
                }
                UnifyValid._defaultSuccessHandle.call(elementTipPosition);
            }
            return isValid;
        },

        "_defaultClickHandle" : function() {
            if ($(this).next().hasClass("valid_div")) {
                $(this).next().find(".valid_imag").removeClass("valid_error").removeClass("valid_success");
                $(this).next().find(".valid_text").text("");
            }
        },

        /**
         *校验失败，输出错误信息
         * @param {String} msg 错误信息
         * @param {String} selector 错误信息标签选择器
         */
        "_defaultFailedHandle" : function(key, msg, isValidTip, position, width) {
            var errorInfo = "";
            if (msg !== "") {
                errorInfo = msg;
            } else {
                errorInfo = ERROR_INFOMATION[key] || "";
            }
            if (isValidTip) {
                if(this[0].validTip){
                    this[0].validTip.remove();
                }
                this[0].validTip = UnifyValid._addTip(this, "<div class='valid_div'><span class='valid_tip_error'></span><span class='valid_text_error'>" + errorInfo + "</span></div>",position,width);
                $(this).attr("hasValidTip", true);
                
                //file Upload
                if($(this).hasClass("tiny-file-select")){
                    $(this).find(".tiny-file-input").addClass("valid_error_input");
                } else {
                    $(this).addClass("valid_error_input");
                }
            } else {
                if (! $(this).next().hasClass("valid_div")) {
                    $(this).after("<div class='valid_div'><span class='valid_imag'></span><span class='valid_text'></span></div>");
                }
                $(this).next().find(".valid_imag").removeClass("valid_success").addClass("valid_error");
                $(this).next().find(".valid_text").text(errorInfo).addClass("valid_text_error");
            }
        },

        /**
         *校验成功，输出信息
         * @param {Object} selector 必选参数，输出信息标签选择器
         */
        "_defaultSuccessHandle" : function() {
            if (! $(this).next().hasClass("valid_div")) {
                $(this).after("<div class='valid_div'><span class='valid_imag'></span><span class='valid_text'></span></div>");
            }

            $(this).next().find(".valid_imag").removeClass("valid_error").addClass("valid_success");
            $(this).next().find(".valid_text").text("");
        },

        /**
         *校验输入框最大长度
         */
        "checkMaxLength" : function(paras) {

            var value = $(this).val();

            if (value.length > parseInt(paras, 10)) {
                return false;
            }
            return true;
        },

        /**
         *校验输入框最小长度
         */
        "checkMinLength" : function(paras) {

            var value = $(this).val();

            if (value.length < parseInt(paras, 10)) {
                return false;
            }
            return true;
        },

        /**
         *校验输入框最大值
         */
        "checkMaxValue" : function(paras) {

            var value = $(this).val();
            if (parseInt(value, 10) > parseInt(paras, 10)) {
                return false;
            }
            return true;
        },

        /**
         *校验输入框最小值
         */
        "checkMinValue" : function(paras) {

            var value = $(this).val();

            if (parseInt(value, 10) < parseInt(paras, 10)) {
                return false;
            }
            return true;
        },

        /**
         *校验是否为空
         */
        "checkEmpty" : function(paras) {
            if (!$(this).val()) {
                return false;
            }
            return true;
        },

        /**
         *校验正则表达式
         */
        "checkReg" : function(paras) {

            var reg = new RegExp(paras.substring(1, paras.length - 1));
            var value = $(this).val();

            //IE中select返回数组
            if (_.isArray(value) && value.length > 0) {
                value = value[0];
            }

            if (value.match(reg)) {
                return true;
            }

            return false;
        },

        /**
         *校验是否包含指定paras字符串
         */
        "checkNotContains" : function(paras) {
            var value = $(this).val();

            if (value.indexOf(paras) == -1) {
                return true;
            }

            return false;
        },

        /**
         * 校验是否相等
         */
        "checkEqual" : function(paras) {

            var val = $(this).val();

            if (val == paras) {
                return true;
            }

            return false;
        },

        "checkScriptInfo" : function(paras) {
            var content = $(this).val();
            var regExp = new RegExp("<+/?[Ss][Cc][Rr][Ii][Pp][Tt] *\.*>*");

            return !regExp.test(content);
        },

        "pathCheck" : function(paras) {
            var value = $(this).val();
            var checkReg = /^([\/][\w-]+)*$/;

            return checkReg.test(value);
        },

        "portCheck" : function(paras) {
            var value = $(this).val();
            var portValue = parseInt(value, 10);

            //判断对口的范围
            if (0 > portValue || portValue > 65535) {
                return false;
            }

            return true;
        },

        "emailCheck" : function(paras) {
            var value = $(this).val();
            var checkReg = /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;

            return checkReg.test(value);
        },

        "dateCheck" : function(paras) {
            var value = $(this).val();

            var test = new Date(value);

            return !isNaN(test);
        },

        "urlCheck" : function(paras) {
            var value = $(this).val();
            var checkReg = /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i;

            return checkReg.test(value);
        },

        "integerCheck" : function(paras) {
            var value = $(this).val();
            var f = parseFloat(value);

            return (!isNaN(f) && f.toString() == value && Math.round(f) == f);

        },

        "numberCheck" : function(paras) {
            var value = $(this).val();
            var v = parseFloat(value);
            
            return (!isNaN(v) && !/[^\d|^.]/.test(value));
        },

        "floatCheck" : function(paras) {
            var value = $(this).val();
            var v = parseFloat(value);
            
            return (!isNaN(v) && !/[^\d|^.]/.test(value));
        },

        "digitsCheck" : function(paras) {
            var value = $(this).val();

            return !/[^\d]/.test(value);
        },
        
        "atrrKeys" : _.keys(ERROR_INFOMATION)
    };

    var ATTRS = {
        "required" : UnifyValid.checkEmpty,
        "maxSize" : UnifyValid.checkMaxLength,
        "minSize" : UnifyValid.checkMinLength,
        "maxValue" : UnifyValid.checkMaxValue,
        "minValue" : UnifyValid.checkMinValue,
        "regularCheck" : UnifyValid.checkReg,
        "notContains" : UnifyValid.checkNotContains,
        "equal" : UnifyValid.checkEqual,
        "extendFunction" : UnifyValid.extendFunction,
        "checkScriptInfo" : UnifyValid.checkScriptInfo,
        "path" : UnifyValid.pathCheck,
        "port" : UnifyValid.portCheck,
        "email" : UnifyValid.emailCheck,
        "date" : UnifyValid.dateCheck,
        "url" : UnifyValid.urlCheck,
        "integer" : UnifyValid.integerCheck,
        "number" : UnifyValid.numberCheck,
        "float" : UnifyValid.floatCheck,
        "digits" : UnifyValid.digitsCheck
    };

    return UnifyValid;
});
