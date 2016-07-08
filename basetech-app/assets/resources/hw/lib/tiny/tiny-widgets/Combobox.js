define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-widgets/Widget", "tiny-common/util", "tiny-common/UnifyValid","language/widgetsLanguage","tiny-lib/encoder"], 
function(angular, $, Widget, util, UnifyValid, widgetsLanguage,encoder) {
    var domTemplate = '<div class="tiny-combobox">' 
                    + '  <div class="tiny-combobox-container">'
                    + '    <div class="tiny-combobox-editor">'
                    + '      <input type="text" class="tiny-combobox-input"/>'
                    + '    </div>'
                    + '    <div class="tiny-combobox-popbutton"> </div>'
                    + '  </div>' 
                    + '</div>';

    var popTemplate = '<div class="tiny-combobox-popup-container"></div>';

    var DEFAULT_CONFIG = {
        "template" : domTemplate,
        "width" : 200,
        "display" : true,
        "disable" : false,
        "value" : "",
        "placeholder": "",
        "valuesFrom" : "local",  // interact
        "values" : [],
        "matchMethod" :"head",   // head,any,head-nocap,any-nocap
        "trigger" : "delay",
        "delay" : "200ms",

        //validator param
        "isvalidtip" : true
    };

    var CONST_VALUES = {
        "DECIMAL" : 10,
        "CALC_POP_OFFSET" : 26,
    };

    var Combobox = Widget.extend({
        "init" : function(options) {
            var comboboxThis = this;
            options = _.extend({}, DEFAULT_CONFIG, options);
            comboboxThis._super(options);
            comboboxThis._setOptions(comboboxThis.options);

            //add validator
            if (options.validate || options.tooltip) {
                comboboxThis.$container.attr("validator", options.validate);
                comboboxThis.$container.attr("isValidTip", options.isvalidtip);
                comboboxThis.$container.attr("errorMsg", options["errorMsg"] || "");
                comboboxThis.$container.attr("extendFunction", options["extendFunction"]);
                UnifyValid.instantValid(comboboxThis.$inputText, comboboxThis.$container, options["validate"], 
                                        options["tooltip"]||"", options["isvalidtip"], options["errorMsg"]||undefined, 
                                        options["extendFunction"]||undefined);
            }
            $("#" + options["id"]).append(comboboxThis._element); 
        },

        // 重载的原因是要生成弹出菜单，并放到 body中
        "_generateElement" : function() {
            var comboboxThis = this;

            comboboxThis.$popup=$(popTemplate);

            var html = _.template(comboboxThis.options.template)(this);
            return $(html);
        },

        "_setOption" : function(key, value) {
            var comboboxThis = this;
            var options = comboboxThis.options;
            comboboxThis._super(key, value);

            switch (key) {
                case "id" :
                    comboboxThis._updateId(value);
                    break;
                case "display" :
                    comboboxThis._updateDisplay();
                    break;
                case "disable" :
                    comboboxThis._updateDisable();
                    break;
                case "width" :
                    comboboxThis._updateWidth();
                    break;
                case "height" :
                    comboboxThis._updateHeight();
                    break;
                case "value" :
                    comboboxThis._updateValue();
                    break;
                case "values" :
                    comboboxThis._updateValues();
                    break;
                case "placeholder" :
                    comboboxThis._updatePlaceholder();
                case "valuesFrom" :
                    comboboxThis._updateValuesFrom();
                    break;
                default :
                    break;
            }
        },

        "_updateDisable" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;  

            if (util.isTrue(options["disable"])) {
                comboboxThis.$inputText.attr("disabled", "true");
                comboboxThis.$container.addClass("tiny-combobox-disable");
            }
            else{
                comboboxThis.$inputText.removeAttr("disabled");
                comboboxThis.$container.removeClass("tiny-combobox-disable");
            }
        },
        "_updateDisplay" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;

            if (util.isTrue(options["display"])) {
                comboboxThis.$element.css("display","inline-block");
            }
            else {
                comboboxThis.$element.hide();
            }
        },

        "_updateWidth" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;

            // 只设置input的宽度。各种边距和边线总宽度为 35px，要求设置值最小 40
            var elementWidth = parseInt(options["width"], CONST_VALUES.DECIMAL);
            elementWidth = Math.max(elementWidth, 40);
            comboboxThis.$inputText.css("width", (elementWidth-35) + "px");
            comboboxThis.$popup.css({"width":elementWidth-2});
        },

        "_updateHeight" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;
            var height = parseInt(options["height"], CONST_VALUES.DECIMAL);
            if(!isNaN(height)){
                this.$popup.css("max-height",height);
            }
        },

        "_updatePlaceholder" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;

            if ((options["placeholder"] ==="" )||(comboboxThis.$inputText.val() !="")){
                return;
            }
            comboboxThis.$inputText.val(options["placeholder"]);
            comboboxThis.$inputText.addClass("tiny-combobox-input-placeholder");
        },

        "_updateValue" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;
            comboboxThis.$inputText.val(options["value"]);
            if(options["value"]!=""){
                comboboxThis.$inputText.removeClass("tiny-combobox-input-placeholder");
            }
        },

        "_updateValues" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;
            // 本地匹配时，可先生成dom备用. 初始化时valuesFrom属性总是先于Values被赋值.
            if(options["valuesFrom"] != "local"){
                return;
            }
            comboboxThis._creatOptions();
        },

        // 根据values的值生成下拉框的内容，记录下来备用
        "_creatOptions" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;

            comboboxThis.optionHtml="";
            _.each(options["values"], function(op) {
                comboboxThis.optionHtml += '<div class="tiny-combobox-option">';
                op = $.encoder.encodeForHTML(op);
                comboboxThis.optionHtml += "<span>"+op+"</span>";
                comboboxThis.optionHtml += "</div>";
            });
        },

        // 根据关键字检索并显示结果
        "_updateOptions" : function(inputTxt) {
            var comboboxThis = this;
            var options = comboboxThis.options;
            var vaildnum = 0;
            var optionHtml="";

            _.each(options["values"], function(op) {
                // 是否搜索命中
                if (comboboxThis._ismatched(inputTxt, op)) {
                    optionHtml += '<div class="tiny-combobox-option">';
                    op = $.encoder.encodeForHTML(op);
                    optionHtml += "<span>"+op+"</span>";
                    optionHtml +="</div>";
                    vaildnum ++;
                }
            });
            // 如果有命中的就显示，否则收起
            if (vaildnum == 0) {
                comboboxThis._unpop();
            }
            // 不能使用_pop(),这里的只是临时结果，_pop()是点击后显示所有
            else{
                comboboxThis.$popup.empty();
                comboboxThis.$popup.append(optionHtml);
                // 计算位置
                var position = comboboxThis.$container.offset();
                comboboxThis.$popup.css({"left":position.left,"top" : position.top + 26,"display": "block"});
                comboboxThis.$container.addClass("tiny-combobox-container-pop");
            }
        },

        // 判断是否符合匹配条件
        "_ismatched" : function(keyword, op) {
            var comboboxThis = this;
            var options = comboboxThis.options;

            // 从头部匹配
            if ((options["matchMethod"] === "head") && (op.indexOf(keyword) == 0)){
                return true;
            }
            // 任意位置匹配
            else if ((options["matchMethod"] === "any") && (op.indexOf(keyword) >= 0)){
                return true;
            }
            // 从头部匹配，忽略大小写
            else if ((options["matchMethod"] === "head-nocap") && 
                     (op.toLowerCase().indexOf(keyword.toLowerCase()) == 0)){
                return true;
            }
            // 任意位置匹配，忽略大小写
            else if ((options["matchMethod"] === "any-nocap") && 
                     (op.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)){
                return true;
            }
            return false;
        },

        "_updateValuesFrom" : function(key, value) {
            var comboboxThis = this;
            var options = comboboxThis.options;

            // 交互式获取时，先不设定values，先生成一个默认的提示语
            if(options["valuesFrom"] != "local"){
                comboboxThis.optionHtml="";
                comboboxThis.optionHtml += '<div class="tiny-combobox-option-tips">';
                comboboxThis.optionHtml += "<span>"+widgetsLanguage.comboboxTip+"</span>";
                comboboxThis.ptionHtml += "</div>";
            }
        },

        "getValue" : function(key, value) {
            var comboboxThis = this;
            // 占位符状态返回空
            if(comboboxThis.$inputText.hasClass("tiny-combobox-input-placeholder")){
                return "";
            } 
            return comboboxThis.$inputText.val();
        },

        "setSearch" : function(values) {
            var comboboxThis = this;

            // 如果等待过程中输入框失去焦点,则放弃搜索结果
            if(!comboboxThis.waitingSearch){
                return;
            }
            comboboxThis.optionHtml="";
            // 后台无搜索结果
            if(null == values || 0 == values.length){
                comboboxThis.optionHtml += '<div class="tiny-combobox-option-tips">';
                comboboxThis.optionHtml += "<span>"+widgetsLanguage.comboboxNoSearch+"</span>";
                comboboxThis.ptionHtml += "</div>";
            }
            else{
                _.each(values, function(op) {
                    comboboxThis.optionHtml += '<div class="tiny-combobox-option">';
                    op = $.encoder.encodeForHTML(op);
                    comboboxThis.optionHtml += "<span>"+op+"</span>";
                    comboboxThis.optionHtml +="</div>";
                });
            }
            comboboxThis._pop();
        },
        // 弹出下拉框，下拉框的内容在comboboxThis.optionHtml中填好
        "_pop" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;

            $('body').append(comboboxThis.$popup);

            comboboxThis.$popup.empty();
            comboboxThis.$popup.append(comboboxThis.optionHtml);

            // 计算位置、弹出框高度及视口的可用高度
            var position = comboboxThis.$container.offset();
            var actualHeight = comboboxThis.$popup.height();
            var availableHeight = document.documentElement.clientHeight + $(document).scrollTop();

            //若输入框下方高度不够，则向上弹出下拉框
            if (position.top + CONST_VALUES.CALC_POP_OFFSET + actualHeight > availableHeight) {
                comboboxThis.$popup.css({
                    "left": position.left,
                    "top" : position.top - actualHeight - 1,
                    "display": "block",
                });
                comboboxThis.$container.addClass("tiny-combobox-container-pop-up");
                comboboxThis.$popup.addClass('tiny-combobox-popup-container-up');
            }
            //若输入框下方高度足够，则向下弹出下拉框
            else{
                comboboxThis.$popup.css({
                    "left":position.left,
                    "top" : position.top + CONST_VALUES.CALC_POP_OFFSET,
                    "display": "block",
                });
                comboboxThis.$container.addClass("tiny-combobox-container-pop-down");
            }

            comboboxThis._addPopupBehavior();
        },
        // 收起下拉框
        "_unpop" : function() {
            var comboboxThis = this;
            comboboxThis.$popup.css("display", "none");
            comboboxThis.$container.removeClass("tiny-combobox-container-pop-down  tiny-combobox-container-pop-up");
            comboboxThis.$popup.removeClass('tiny-combobox-popup-container-up');
            comboboxThis.$popup.remove();
        },

        "_locateElement" : function() {
            var comboboxThis = this;
            comboboxThis.$element = comboboxThis._element;
            comboboxThis.$container = comboboxThis._element.find(".tiny-combobox-container");
            comboboxThis.$editor = comboboxThis._element.find(".tiny-combobox-editor");
            comboboxThis.$inputText = comboboxThis._element.find(".tiny-combobox-input");
            comboboxThis.$popbutton = comboboxThis._element.find(".tiny-combobox-popbutton");
        },
        // 整个控件获得焦点. 文本框获得焦点或点击该控件下拉钮
        "_getfocus" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;
            comboboxThis.$container.addClass("tiny-combobox-container-focus");
            //validator
            if (!comboboxThis.hasfocus) {
                comboboxThis.$inputText.trigger("focusEvt",[]);
            }
            comboboxThis.hasfocus = true; //记录当前焦点状态，避免多余的校验操作
        },
        // 整个控件失去焦点. 文本框失去焦点（排除点击下拉钮，下拉框）或点击该控件之外
        "_lostfocus" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;
            comboboxThis.$container.removeClass("tiny-combobox-container-focus");
            //validator
            if (comboboxThis.hasfocus) {
                comboboxThis.$inputText.trigger("blurEvt",[]);
            }
            comboboxThis.hasfocus = false;
        },

        "destroy" : function() {
            var comboboxThis = this;
            $(document).unbind("keydown",comboboxThis.keydownHandler);
            $(document).unbind("mousedown", comboboxThis.mousedownHandler);
            $(document).unbind("mousewheel DOMMouseScroll", comboboxThis.mousewheelHandler);
            $(window).unbind("resize",comboboxThis.resizeHandler);
        },

        "_addPopupBehavior" : function () {
            var comboboxThis = this;
            var options = comboboxThis.options;

            // 下拉选项的显示样式与点选
            comboboxThis.$popup.on("mousedown", ".tiny-combobox-option", function(e) {
                newValues = e.currentTarget.textContent || e.currentTarget.innerText;
                comboboxThis.$inputText.val(newValues);
                comboboxThis._unpop();
                comboboxThis.$inputText.removeClass("tiny-combobox-input-placeholder");
                e.stopPropagation();
                e.preventDefault();

                //触发选择事件
                comboboxThis.trigger("select");
                if ("function" == ( typeof options["select"])){
                    options["select"]();
                }
                //点选后立即进行一次校验
                comboboxThis.$inputText.trigger("blurEvt",[]);

            }).on("mouseenter", ".tiny-combobox-option", function(e) {
                $(this).addClass("tiny-combobox-option-selected");
            }).on("mouseleave", ".tiny-combobox-option", function(e) {
                $(this).removeClass("tiny-combobox-option-selected");
            });
            // 下拉提示信息点击无效
            comboboxThis.$popup.on("mousedown", ".tiny-combobox-option-tips", function(e) {
                e.stopPropagation();
                e.preventDefault();
            });
            // 阻止滚动鼠标，下拉框消失
            comboboxThis.$popup.on("mousewheel DOMMouseScroll", ".tiny-combobox-option", function(e) {
                e = e || window.event;
                if (!$.browser.mozilla) {
                    comboboxThis.$popup[0].scrollTop += e.originalEvent.wheelDelta > 0 ? -120 : 120;
                    e.stopPropagation();
                } else {
                    comboboxThis.$popup[0].scrollTop += e.originalEvent.detail > 0 ? 60 : -60;
                    e.cancelBubble = true;
                }
                return false;
            });
        },


        "_addBehavior" : function() {
            var comboboxThis = this;
            var options = comboboxThis.options;
            var popFlag = false;  // 识别点击事件的来源，控件内还是外
            var hasTab = false;   // tab键导致的焦点变换
            var inputTxt = options["value"];
            var timer=null;
            comboboxThis.waitingSearch = false;
            comboboxThis.hasfocus = false;

            comboboxThis._locateElement();

            // 选中时显示边框，外围点击事件中取消边框。但不能处理tab键引起的焦点切换
            comboboxThis.$container.on("mousedown", function(e) {
                comboboxThis._getfocus();
            });

            // 点击时弹出所有选项
            comboboxThis.$popbutton.on("mousedown", function(e) {
                if (util.isTrue(options["disable"])) {
                    return;
                }
                //代表是点击弹出钮导致的  document.mousedown,不进行关闭下拉框操作
                popFlag = true;

                if ("block" != comboboxThis.$popup.css("display")) {
                    comboboxThis._pop();
                }
                else {
                    comboboxThis._unpop();
                }
            });

            // 点击文本框不会收起选项
            comboboxThis.$inputText.on("mousedown", function(e) {
                popFlag = true;
            });

            // placeholder的显示与取消,以及获得焦点后的边框
            comboboxThis.$inputText.on("focus", function(e) {
                if(comboboxThis.$inputText.hasClass("tiny-combobox-input-placeholder")){
                    comboboxThis.$inputText.val("");
                    comboboxThis.$inputText.removeClass("tiny-combobox-input-placeholder");
                }
                // 这里主要考虑tab键获得焦点
                comboboxThis._getfocus();
                hasTab = false;

            }).on("blur", function(e) {
                // 失去焦点，不再进行延时搜索,也不再顾及返回结果
                if(!timer){
                    clearInterval(timer);
                }
                comboboxThis.waitingSearch = false;

                // 失去焦点后的边框：如果是tab键导致的失去，则去掉边框。其余情况由document.mousedown处理
                  if (hasTab){
                    comboboxThis._lostfocus();
                    hasTab = false;
                }
                // placeholder
                if ((options["placeholder"] ==="" )||(comboboxThis.$inputText.val() !="")){
                    return;
                }
                comboboxThis.$inputText.val(options["placeholder"]);
                comboboxThis.$inputText.addClass("tiny-combobox-input-placeholder");
            });

            comboboxThis.resizeHandler = function(){
                if ("block" == comboboxThis.$popup.css("display")) {
                    comboboxThis._unpop();
                }
            };
            // 拖动大小，按ESC，点击外围，滚动滚轮，取消弹出框
            $(window).on("resize",comboboxThis.resizeHandler);
            comboboxThis.keydownHandler = function(e){
                //ESC
                if ((27 == e.keyCode) && ("block" == comboboxThis.$popup.css("display"))) {
                    comboboxThis._unpop();
                }
            };
            comboboxThis.mousedownHandler = function(e){
                // 阻止拖动滚动条的时候关闭弹出框
                if($(e.target).hasClass("tiny-combobox-popup-container")){
                    return;
                }
                if (!popFlag){
                    comboboxThis._lostfocus();
                }
                // 点击弹出钮导致的 mousedown不处理. 非按钮点击一律收回弹出框
                if (!popFlag && "block" == comboboxThis.$popup.css("display")) {
                    comboboxThis._unpop();
                }
                popFlag = false;
            };
            comboboxThis.mousewheelHandler = function(){
                if ("block" == comboboxThis.$popup.css("display")) {
                    comboboxThis._unpop();
                }
            };
            $(document).on("keydown",comboboxThis.keydownHandler)
                       .on("mousedown", comboboxThis.mousedownHandler)
                       .on("mousewheel DOMMouseScroll", comboboxThis.mousewheelHandler);

            // 文本输入时的匹配与搜索的触发
            comboboxThis.$inputText.on("keyup", function(e) {
                // 记录Tab键切换了焦点，用于取消选中状态。输入内容不接受tab
                if (9 == e.keyCode) {
                    hasTab = true;
                    return;
                }

                var newTxt=comboboxThis.$inputText.val();
                // 本地匹配，当文本变化时，进行搜索过滤
                if (options["valuesFrom"] === "local"){
                    if(inputTxt===newTxt){
                        return;
                    }
                    inputTxt = newTxt;
                    comboboxThis._updateOptions(inputTxt);
                    return;
                }
                // 等待后台结果,如果等待过程中输入框失去焦点,则放弃搜索结果.放在前面是考虑可能用同步的方法获取后台数据
                comboboxThis.waitingSearch = true;

                // 后台匹配，回车键(含小键盘)触发搜索事件。搜索结果由setSearch()方法注入控件.搜索关键字可以为空(后台控制合法性)
                if ((options["trigger"] == "enter") && (108 == e.keyCode || 13 == e.keyCode)){
                    comboboxThis.trigger("search");
                    if ("function" == ( typeof options["search"])){
                        options["search"]();
                    }
                }
                // 后台匹配，延时触发搜索事件。
                else if(options["trigger"] == "delay"){
                    var delay = parseInt(options["delay"], CONST_VALUES.DECIMAL);
                    // 停掉原有定时器，开启新的定时器
                    if(timer){
                        clearTimeout(timer);
                    }
                    timer = setTimeout(handler, delay);
                }
            });
            // 超时函数：超时后触发搜索事件
            var handler = function(){
                comboboxThis.trigger("search");
                if ("function" == ( typeof options["search"])){
                    options["search"]();
                }
            };
        }
    });
    return Combobox;
});
