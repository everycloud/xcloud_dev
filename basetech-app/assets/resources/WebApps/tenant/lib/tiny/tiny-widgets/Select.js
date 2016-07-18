/**
 * Tiny Select widget. 版本日期  2014-4-10,10:30
 * 
 * [DOM组成说明]：
 * <div class="tiny-select">....................控件整体
 *    <div class="tiny-select-input-field">.....输入域，该域响应点击展开事件，右侧放下拉图标。目前该域同控件整体大小相同
 *       <input class="tiny-select-text">.......只读的文本输入框，显示选择结果
 *       </div>
 * </div>
 * 
 * </div class="tiny-select-popup-container">...弹出菜单，会置于<body>下
 * </div>
 * 
 * 
 * [属性]：
 * mode:  "single", "multiple",不支持动态更新
 * values: 下拉项目对象数组 
 *         selectId:下拉选项id值，必须唯一，字符串。也可以用整数输入, 不输入则按照 tinydefaultid1，tinydefaultid2...自动生成
 *         label: 下拉选项文本，必选项目
 *         image: 下拉选项图标,可选
 *         checked: 是否选中,只要指定的不是false布尔值,都会认为选中.单选时以第一个选择的为准
 * width: 整个控件的宽度
 * height: 下拉框最大高度,缺省时自动匹配选项数目 
 * disable: 是否禁用
 * display: 是否显示
 * default-selectid: 默认选中文本的selectId值.多选模式下使用逗号分开。初始化时同 values.checked 指定的默认选择项目合并.
 *                   单选如果指定多个，以values中靠前的为准
 *                   动态更新了values后，如果不希望原来的 default-selectid起作用，请在更新values前更新一下该属性。仅更新该属性时不会有任何作用
 * showTip: 设置是否显示当前选中内容在输入框中的的完整提示，默认值为false，即不显示；该属性为可选属性，且不支持动态更新；1.10.0新增
 * validate/tooltip: 校验，请参考校验相关资料
 *
 * [方法]：
 * getSelectedId(): 获取已选中文本对应的"selectId"值.多选时返回数组,单选时返回字符串。返回值中的id均为字符串（尽管Id也可以用整数输入）
 * getSelectedLabel(): 返回选择结果，字符串，对应文本框中的内容
 * opLabel(selectId, label): 设置、获取对应"selectId"值的文本。如果涉及当前已选择选项，则会更新显示. 该方法的使用,不会改变values中的值
 * opChecked(selectId): 将"selectId"值的选项选中，selectId支持多个输入，逗号隔开，例如"1,3,5"，也支持一个整数输入.
 *                      之前的默认选择和用户点选，会全都丢弃。输入空字符串或不输入任何参数,会放弃所有选择
 * 
 * [事件]：
 * change: 选择一个选项，内容发生变化时触发
 * 
 * [内部事件]：
 * $popup.tiny-select-option. mousedown/mousemove/mouseleave：下拉菜单的点选，鼠标划过
 * window.resize/keydown/mousedown/mousewheel(DOMMouseScroll)：外围点击，收起菜单
 * changeEvt：选项选择且内容改变
 * focusEvt：校验及tooltip，该事件触发tooltip的显示和校验error的消失，UnifyValid实现事件处理.下拉框展开时触发
 * blurEvt：  校验及tooltip，该事件触发tooltip的消失和输入校验，UnifyValid实现事件处理,.下拉框收起时触发(需在更新文本框内容之后)
 * 
 * [内部属性]：
 * selectThis.selected: 记录已选择项目的id,数组形式。初始化、用户点选、通过接口设置Checked或Label，均先修改该变量，再通过_setInput修改显示文本
 * 
 **/

define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-widgets/Widget", "tiny-common/util", "tiny-common/UnifyValid", "tiny-lib/encoder"], 
function(angular, $, Widget, util, UnifyValid,encoder) {
    var domTemplate = '<div class="tiny-select">' 
                    + '  <div class="tiny-select-input-field">' 
                    + '    <input type="text" readonly="readonly" class="tiny-select-text">' 
                    + '  </div>' 
                    + '</div>';
    var popTemplate = '<div class="tiny-select-popup-container"></div>';

    var DEFAULT_CONFIG = {
        "template" : domTemplate,
        "mode" : "single",
        "default-selectid": "",
        "values" : [],
        "width" : 100,
        "display" : true,
        "disable" :false,
        "showTip" : false, //设置是否显示当前选中内容在输入框中的完整提示，版本1.10.0新增

        //validator param
        "isvalidtip" : true
    };

    var CONST_VALUES = {
        "DECIMAL" : 10, 
        "MIN_WIDTH" : 50,        // 最小设置宽度，调整css时，可能需要修改
        "CALC_INPUT_WIDTH" : 45, // 计算内部input宽度时，减去的各种边框宽度，调整css时，可能需要修改
        "CALC_POP_WIDTH" : 2,    // 计算下拉框宽度时，减去边框宽度，调整css时，可能需要修改
        "CALC_POP_OFFSET" : 26,  // 计算下拉框位置时，相对于选择框的垂直偏移量，调整css时，可能需要修改
        "OPTION_BORDER" : 8      // 下拉选项相对于下拉框的宽度差值，调整css时，可能需要修改，5改为8，版本1.10.0变更
    };

    var Select = Widget.extend({
        "init" : function(options) {
            var selectThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            selectThis._super(options);
            selectThis._setOptions(options);

            //增加校验及tooltip
            selectThis._addValidate();

            $("#" + options["id"]).append(selectThis._element); 
        },

        "_addValidate" : function() {
            var selectThis = this;
            var options = selectThis.options;

            if (options.validate || options.tooltip) {
                selectThis.$inputField.attr("validator", options.validate);
                selectThis.$inputField.attr("isValidTip", options.isvalidtip);
                selectThis.$inputField.attr("errorMsg", options["errorMsg"] || "");
                selectThis.$inputField.attr("extendFunction", options["extendFunction"]);
                selectThis.$inputField.attr("tipWidth", options["tipWidth"]);
                UnifyValid.instantValid(selectThis.$inputText, selectThis.$inputField, 
                        options["validate"], options["tooltip"]||"", options["isvalidtip"], 
                        options["errorMsg"]||undefined, options["extendFunction"]||undefined, undefined, options["tipWidth"]||undefined);
            }
        },

        // 重载的原因是要生成弹出菜单，并放到 body中
        "_generateElement" : function() {
            var selectThis = this;

            selectThis.$popup=$(popTemplate);

            var html = _.template(selectThis.options.template)(this);
            return $(html);
        },

        "_setOption" : function(key, value) {
            var selectThis = this;
            var options = selectThis.options;

            selectThis._super(key, value);
            switch (key) {
                case "id" :
                    selectThis._updateId(value);
                    break;
                case "display" :
                    selectThis._updateDisplay();
                    break;
                case "disable" :
                    selectThis._updateDisable();
                    break;
                case "width" :
                    selectThis._updateWidth();
                    break;
                case "height" :
                    selectThis._updateHeight();
                    break;
                case "values" :
                    selectThis._updateValues();
                    break;
                default :
                    break;
            }
        },

        "_updateDisplay" : function() {
            var selectThis = this;
            var options = selectThis.options;

            if (util.isTrue(options["display"])) {
                selectThis.$element.css("display","inline-block");
            }
            else {
                selectThis.$element.css("display","none");
            }
        },

        "_updateDisable" : function() {
            var selectThis = this;
            var options = selectThis.options;

            if (util.isTrue(options["disable"])) {
                selectThis.$inputField.addClass("tiny-select-input-field-disable");
                selectThis.$inputText.attr("disabled", "true");
                if (options.validate) {
                    selectThis.$inputField.attr( "tiny-valid-disable", true);
                    UnifyValid.clearValidate(selectThis.$inputField);
                }
            }
            else{
                selectThis.$inputField.removeClass("tiny-select-input-field-disable");
                selectThis.$inputText.removeAttr("disabled");
                if (options.validate) {
                    selectThis.$inputField.removeAttr("tiny-valid-disable");
                }
            }
        },

        // 只设置最里边的input的宽度，同时设置弹出框的宽度，需要减掉的宽度见 CONST_VALUES
        "_updateWidth" : function() {
            var selectThis = this;
            var options = selectThis.options;
            var elementWidth = parseInt(options["width"], CONST_VALUES.DECIMAL);

            elementWidth = Math.max(elementWidth, CONST_VALUES.MIN_WIDTH);
            selectThis.$inputText.css("width", (elementWidth - CONST_VALUES.CALC_INPUT_WIDTH) + "px");
            selectThis.$popup.css("width", (elementWidth - CONST_VALUES.CALC_POP_WIDTH) + "px");    
        },

        "_updateHeight" : function() {
            var selectThis = this;
            var options = selectThis.options;
            var height = parseInt(options["height"], CONST_VALUES.DECIMAL);

            selectThis.$popup.css("max-height",height);
        },

        "_updateValues" : function() {
            var selectThis = this;
            var options = selectThis.options;
            var optionHtml = "";
            var selectId,img,labelText,checked;
            var checkedArray = [];
            var idIndex = 1;

            // 更新下拉菜单内容
            selectThis.$popup.empty();
            _.each(options["values"], function(val) {
                if (val["selectId"] || val["selectId"] == "") {
                    selectId = val["selectId"];
                }
                else {
                    selectId = "tinydefaultid" + idIndex;
                    val["selectId"] = selectId;
                }
                img = val["image"] || "";
                labelText = val["label"] || "";
                checked = val["checked"] || selectThis._isDefaultSelected(selectId);
                optionHtml += selectThis._optionHtmlFactory(selectId,img,labelText,checked);

                if (checked) {
                    checkedArray.push(selectId + "");
                }
                idIndex++;
            });
            selectThis.$popup.append(optionHtml);

            // 记录并规范化已选择内容
            selectThis._recordToSelected(checkedArray);
            // 根据selectThis.selected更新文本框
            selectThis._setInput(); 
        },

        // 将参数中的项目记录到selectThis.selected, 并进行单选判定和多选冗余删除
        "_recordToSelected" :function(checkedArray) {
            var selectThis = this;
            var options = selectThis.options;

            selectThis.selected = [];
            // 记录所有已经选择的,单选以第一个为准，多选需删除重复元素
            if ("single" === options["mode"] && checkedArray.length > 0) {
                selectThis.selected = [checkedArray[0]];
            }
            else {
                selectThis.selected = _.uniq(checkedArray);
            }
        },

        // 判断是否在default-selectid属性中指定选择，id可能是整数输入，判断是只用两个等号
        "_isDefaultSelected" : function(selectId) {
            var selectThis = this;
            var options = selectThis.options;
            var selectidArray=options["default-selectid"].split(",");

            for(var i = 0; i < selectidArray.length; i++) {
                if (selectId == selectidArray[i]) {
                    return true;
                }
            }
            return false;
        },

        // 根据selectThis.selected数组更新文本框.多选需要按照values顺序排列已选项目
        "_setInput" : function() {
            var selectThis = this;
            var options = selectThis.options;
            var checkedtext = [];

            _.each(options["values"], function(val) {
                if(selectThis._isIdSelected(val.selectId)) {
                    checkedtext.push(val.label || "");
                }
            });
            selectThis.$inputText.val(checkedtext.join(','));

            //实现对当前选中内容的提示效果，1.10.0版本新增功能
            if (util.isTrue(options["showTip"])) {
                selectThis.$inputText.attr('title', checkedtext);
            }
        },

        // 判断一个id是否已经被选择，id可能使用整数输入，所以判断时只用两个等号
        "_isIdSelected" : function(selectId) {
            var selectThis = this;

            for(var i = 0; i < selectThis.selected.length; i++) {
                if (selectId == selectThis.selected[i]) {
                    return true;
                }
            }
            return false;
        },

        // 生成一个下拉选项的dom
        "_optionHtmlFactory" : function(selectId, image, label, checked) {
            var selectThis = this, options = this.options;
            var html = '<div class="tiny-select-option">';

            // 多选时生成复选框
            if ("multiple" === options["mode"]) {
                html += '<span class="tiny-select-checkbox';
                if (checked) {
                    html += ' tiny-select-checkbox-checked';
                }
                html += '"></span>';
            }
            // 图标是可选项目
            if (image) {
                image = $.trim(image);
                image = $.encoder.encodeForURL(image);
                html += '<img src="' + image + '" />';
            }

            selectId = $.encoder.encodeForHTMLAttribute("selectId", selectId + "", true); 
            label = $.encoder.encodeForHTML(label);
            html += '<span selectId="'+selectId+'">' + label + '</span>';
            html += '</div>';
            return html;
        },

        "getSelectedId" : function() {
            var selectThis = this;
            var options = selectThis.options;

            // 多选返回id数组--可能为空，单选返回第一个id--可能为undefined
            if ("multiple" === options["mode"]) {
                return selectThis.selected;
            }
            else {
                return selectThis.selected[0];
            }
        },

        "getSelectedLabel" : function() {
            var selectThis = this;

            return selectThis.$inputText.val();
        },

        "opChecked" : function(selectedId) {
            var selectThis = this;
            var options = selectThis.options;
            var checkedArray = [];

            selectedId += "";
            var selctedIdArray = selectedId.split(",");
            // 记录所选，需检查id合法性.
            _.each(selctedIdArray, function(id) {
                index = selectThis._getOptionIndex(id);
                if (index >= 0) {
                    checkedArray.push(id);
                }
            });

            // 记录并规范化已选择内容
            selectThis._recordToSelected(checkedArray);
            // 根据 selectThis.selected更新文本框
            selectThis._setInput(); 
            // 多选时根据 selectThis.selected刷新下拉菜单选择状态
            if ("multiple" === options["mode"]) {
                selectThis._refreshCheckState();
            }
        },

        // 根据已选择内容，刷新下拉框的选择状态. last/first 对dom结构有依赖,如果修改dom，请注意这里
        "_refreshCheckState" : function() {
            var selectThis = this;
            var id;

            selectThis.$option = selectThis.$popup.find(".tiny-select-option");
            selectThis.$option.each(function() {
            	id = $(this).children("span").last().attr("selectid");
            	if (selectThis._isIdSelected(id)) {
            		$(this).children("span").first().addClass("tiny-select-checkbox-checked");
            	}
            	else {
            		$(this).children("span").first().removeClass("tiny-select-checkbox-checked");
            	}
            });
        },

        "opLabel" : function(selectId,value) {
            if (0  === arguments.length) {
                return;
            }

            var selectThis = this;
            var opindex = selectThis._getOptionIndex(selectId); // selectId检查
            if (opindex < 0) {
                return;
            }

            var options = selectThis.options;
            var values = options["values"];
            if (_.isUndefined(value)) {
                return values[opindex].label;
            }
            // 设置，同时改变了 values中的内容
            selectThis.$popup.find('[selectId ="'+selectId+'"]').text(value);
            values[opindex].label = value;

            //若该选项已选，则将input框中内容进行重置
            if (selectThis._isIdSelected(selectId)) {
                selectThis._setInput();
            }
        },

        // 根据selectId搜寻选项下标，id可能是整数输入，所以只用两个等号
        "_getOptionIndex" : function(selectId) {
            var selectThis = this;
            var options = selectThis.options;
            var values = options["values"];

            for(var i = 0; i < values.length; i++) {
                if (selectId == values[i].selectId) {
                    return i;
                }
            }
            return -1;
        },

        // 多选时刷新已选项目，记录到  selectThis.selected
        "_getSelectedLabels" : function() {
            var selectThis = this;
            selectThis.selected = [];

            selectThis.$option = selectThis.$popup.find(".tiny-select-option");
            selectThis.$option.each(function() {
                if ($(this).children("span").first().hasClass("tiny-select-checkbox-checked")) {
                    selectThis.selected.push($(this).children("span").last().attr("selectid"));
                }
            });
        },

        "_locateElement" : function() {
            var selectThis = this;

            selectThis.$element = selectThis._element;
            selectThis.$inputField = selectThis._element.find(".tiny-select-input-field");
            selectThis.$inputText = selectThis._element.find(".tiny-select-text");
        },

        // 目前校验类事件的触发同菜单收起下拉在逻辑上一致。但要注意，由于blurEvt需要放在更新文本框之后，要求_unpop必须在更新文本框之后
        "_pop" : function() {
            var selectThis = this;
            var position = selectThis.$inputField.offset();

            //先将下拉框显示出来，通过设置最小宽度使每一个option只显示一条选项，获取正确的高度
            $('body').append(selectThis.$popup);
            selectThis.$popup.css('display', 'block');
            selectThis._setOptionWidth();
            var actualHeight = selectThis.$popup.height();

            //输入框下方可用的视口高度
            var availableHeight = document.documentElement.clientHeight + $(document).scrollTop();

            //若输入框下方高度不够，则向上弹出下拉框
            if (position.top + CONST_VALUES.CALC_POP_OFFSET + actualHeight > availableHeight) {
                selectThis.$popup.css({
                    "left": position.left,
                    "top" : position.top - actualHeight - 1,
                });
                selectThis.$inputField.addClass('tiny-select-input-field-selected-up');
                selectThis.$popup.addClass('tiny-select-popup-container-up');
            }
            //若输入框下方高度足够，则向下弹出下拉框
            else{
                selectThis.$popup.css({
                    "left": position.left,
                    "top" : position.top + CONST_VALUES.CALC_POP_OFFSET,
                });
                selectThis.$inputField.addClass("tiny-select-input-field-selected-down");
            }

            selectThis._addPopUpBehavior();
            selectThis.hasPoped = true;

            selectThis.$inputText.trigger("focusEvt",[]);

        },

        "_unpop" : function() {
            var selectThis = this;

            selectThis.$inputField.removeClass("tiny-select-input-field-selected-down  tiny-select-input-field-selected-up");
            selectThis.$popup.removeClass('tiny-select-popup-container-up');
            selectThis.$popup.find(".tiny-select-option").removeClass('tiny-select-option-selected');
            selectThis.$popup.remove();
            selectThis.hasPoped = false;

            selectThis.$inputText.trigger("blurEvt",[]);
        },

        //以内容最长的选项设置最小宽度，出横向滚动条后，选中状态的背景色能完全填充选项
        "_setOptionWidth" : function() {
        	var selectThis = this;

        	var allOption=selectThis.$popup.find(".tiny-select-option");
			 allOption.css("min-width", selectThis.$popup[0].scrollWidth-CONST_VALUES.OPTION_BORDER);
        },
        
        "destroy" : function() {
            var selectThis = this;
            
            $(document).unbind("keydown", selectThis.keydownHandler);
            $(document).unbind("mousedown mousewheel DOMMouseScroll", selectThis.mouseHandler);  
            $(window).unbind("resize",selectThis.resizeHandler);
            
        },
        
        "_addPopUpBehavior" : function() {
            var selectThis = this;
            var options = selectThis.options;
            selectThis._locateElement();
            // 下拉选择框选项点击与划过事件
            selectThis.$popup.on("mousedown", ".tiny-select-option", function (evt) {
                var oldValues = selectThis.$inputText.val();
                var newValues = evt.currentTarget.textContent || evt.currentTarget.innerText;

                if ("single" === options["mode"]) {
                    // 选择相同选项,不进行处理,仅收起下拉框
                    if (oldValues === newValues) {
                        selectThis._unpop();
                        return;
                    }
                    // 记录选中的id,更新文本框
                    selectThis.selected = [$(this).children("span").last().attr("selectid")];
                    selectThis._setInput();
                    // 收起下拉框
                    selectThis._unpop();
                    // 触发change事件
                    selectThis.$inputText.trigger("changeEvt", [evt]);
                    return;
                }
                // 变换复选框选中状态
                var checkboxElement = $(this).children("span").first();
                if (checkboxElement.hasClass("tiny-select-checkbox-checked")) {
                    checkboxElement.removeClass("tiny-select-checkbox-checked");
                }
                else {
                    checkboxElement.addClass("tiny-select-checkbox-checked");
                }
                // 更新选中的id列表,并更新文本框
                selectThis._getSelectedLabels();
                selectThis._setInput();

                // 多选框点击选项，内容必然改变，触发change事件
                selectThis.$inputText.trigger("changeEvt", [evt]);
                evt.stopPropagation();

            }).on("mouseenter", ".tiny-select-option", function (evt) {
                $(this).addClass("tiny-select-option-selected");
                $(this).children().first().addClass("tiny-select-checkbox-focus");

            }).on("mouseleave", ".tiny-select-option", function (evt) {
                $(this).removeClass("tiny-select-option-selected");
                $(this).children().first().removeClass("tiny-select-checkbox-focus");

            }).on("mousewheel DOMMouseScroll", function (e) {
                // 阻止滚动鼠标，下拉框消失
                if (!$.browser.mozilla) {
                    selectThis.$popup[0].scrollTop += e.originalEvent.wheelDelta > 0 ? -60 : 60;
                } else {
                    selectThis.$popup[0].scrollTop += e.originalEvent.detail > 0 ? 60 : -60;
                }
                e.stopPropagation();
                e.preventDefault();
            });

        },

        "_addBehavior" : function() {
            var selectThis = this;
            var options = selectThis.options;
            selectThis._locateElement();
            var popFlag = false; // 标明鼠标点击是来源于点击控件自己的下拉
            selectThis.hasPoped = false; //表明下拉框是否显示

            // 点击鼠标的下拉与收起，收起时会触发校验
            selectThis.$inputField.on("mousedown", function(evt) {
                popFlag = true;
                if (util.isTrue(options["disable"])) {
                    return;
                }
                if (!selectThis.hasPoped) {
                    selectThis._pop();
                }
                else {
                    selectThis._unpop();
                }
            });

            // 内容改变触发外部事件
            selectThis.$inputText.on("changeEvt", function(evt) {
                selectThis.trigger("change", [evt]);
                if ("function" == ( typeof options["change"])) {
                    options["change"](evt);
                }
            });

            // 外围事件引起的下拉框收起
            selectThis.resizeHandler = function() {
                if (selectThis.hasPoped) {
                    selectThis._unpop();
                }
            };
            $(window).on("resize",selectThis.resizeHandler);

            selectThis.keydownHandler = function(evt) {
                //ESC
                if ((27 == evt.keyCode) && (selectThis.hasPoped)) {
                    selectThis._unpop();
                }
            };

            selectThis.mouseHandler = function(evt) {
                // 点击输入框区域引起的全局 mousedown
                if (popFlag) {
                    popFlag = false;
                    return;
                }

                // 阻止拖动滚动条和在滚动条上滚鼠标的时候关闭弹出框
                if ($(evt.target).hasClass("tiny-select-popup-container")) {
                    return;
                }
                if (selectThis.hasPoped) {
                    selectThis._unpop();
                }
            };
            $(document).on("keydown", selectThis.keydownHandler).on("mousedown mousewheel DOMMouseScroll", selectThis.mouseHandler);
        }
    });

    return Select;
});
