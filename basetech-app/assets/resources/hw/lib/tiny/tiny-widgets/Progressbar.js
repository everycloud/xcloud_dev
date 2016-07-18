/****************************************************************************************************************
 * Tiny ProgressBar Widget. 版本日期：2014-07-26，17:00.
 *
 * [DOM组成说明]：
 * <div class="tiny-progressBar-package">----------------------控件整体
 *    <div class="tiny-progressBar-graphArea">-----------------进度条背景区域
 *        <div class="tiny-progressBar-graphFilled"></div>-----进度条填充区域
 *    </div><div class="tiny-progressBar-annotation"></div>----进度条当前值批注文本区域
 * </div>
 *
 * [属性]：
 * value        : 填充区域所占宽度百分比---【可选属性】----【默认值为80】-----【支持动态修改】
 * display      : 控制整个控件是否可见-----【可选属性】----【默认值为true】---【支持动态修改】
 * color        : 填充区域的颜色-----------【可选属性】----【默认值为"#1FBE5C"】----【支持动态修改】
 * width        : 进度条的宽度-------------【可选属性】----【默认值为240】----【支持动态修改】
 * height       : 进度条的高度-------------【可选属性】----【默认值为18】-----【支持动态修改】
 * label-position : 文本的位置与是否显示-【可选属性】----【默认值为right】-----【支持动态修改】
 * labelColor   : 批注文本的的颜色------【可选属性】----【默认值为"#666666"】---【支持动态修改】
 *
 * [方法]：
 * opProgress() :设置(传入一个参数时)或获取(无传入参数时)当前进度条的值
 *
 * [事件]：
 *
 * 外部事件：
 * change() : 当进度条的百分比发生变化时触发
 * complete() : 当进度条的百分比为100%时触发
 *
 * 内部事件：
 *
 ***************************************************************************************************************/

define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget"],
    function(angular, $, Class, Widget) {
        var progressBarTemplate = '<div class="tiny-progressBar-package">' +
                                      '<div class="tiny-progressBar-graphArea">' +
                                          '<div class="tiny-progressBar-graphFilled"></div>' +
                                      '</div><div class="tiny-progressBar-annotation"></div>' +
                                  '</div>';

        var DEFAULT_CONFIG = {
            "template" : progressBarTemplate,
            "display"  : true,
            "width"    : 240,
            "color"    : "#5ecc49",
            "height"   : 18,
            "value"    : 0,
            "labelColor" : "#5ecc49",
            "label-position" : "right"
        };

        var Progressbar = Widget.extend({

            "init" : function(options) {
                var progressBarThis = this;
                var options = _.extend({}, DEFAULT_CONFIG, options);

                progressBarThis._super(options);
                progressBarThis._setOptions(options);
                $("#" + options["id"]).append(progressBarThis._element);
            },

            "_locateElement": function () {
                var progressBarThis = this;

                progressBarThis.$graphArea = progressBarThis._element.find('.tiny-progressBar-graphArea');
                progressBarThis.$graphFilled = progressBarThis._element.find('.tiny-progressBar-graphFilled');
                progressBarThis.$annotation = progressBarThis._element.find('.tiny-progressBar-annotation');
            },

            "_setOption": function(key, value) {
                var progressBarThis = this;

                progressBarThis._super(key, value);
                switch (key) {
                    case "id" :
                        progressBarThis._updateId(value);
                        break;
                    case "display" :
                        progressBarThis._updateDisplay(value);
                        break;
                    case "width" :
                        progressBarThis._updateWidth(value);
                        break;
                    case "color" :
                        progressBarThis._updateColor(value);
                        break;
                    case "label-position" :
                        progressBarThis._updateAnnotation(value);
                        break;
                    case "height" :
                        progressBarThis._updateHeight(value);
                        break;
                    case "value" :
                        progressBarThis._updatePercentage(value);
                        break;
                    case "labelColor" :
                        progressBarThis._updateLabelColor(value);
                    default :
                        break;
                }
            },

            "_updateDisplay" : function (display) {
                var progressBarThis = this;

                if ("true" == String(display)) {
                    progressBarThis._element.css('display', 'inline-block');
                }
                else {
                    progressBarThis._element.css('display', 'none');
                }
            },

            "_updateWidth" : function (progressWidth) {
                var progressBarThis = this;
                var options = progressBarThis.options;
                var progressBarWidth = parseInt(progressWidth, 10);

                // 输入宽度的合法性判断
                if (isNaN(progressBarWidth)) {
                    return;
                }

                // 更新进度条的总长度
                progressBarThis.$graphArea.css('width', progressBarWidth + "px");

                // 更新进度条填充区域的总长度
                var graphFilledWidth = (options["value"] / 100) * progressBarWidth;
                progressBarThis.$graphFilled.css('width', graphFilledWidth + 'px');

                progressBarThis._calcPosition();
            },

            "_updateColor" : function (filledColor) {
                var progressBarThis = this;

                progressBarThis.$graphFilled.css('background-color', filledColor);
            },

            "_updateLabelColor" : function (annotationColor) {
                var progressBarThis = this;

                progressBarThis.$annotation.css('color', annotationColor);
            },

            "_updateAnnotation" : function (value) {
                var progressBarThis = this;
                var options = progressBarThis.options;

                if ("none" == String(value)) {
                    progressBarThis.$annotation.css('display', 'none');
                    return;
                }
                progressBarThis.$annotation.css('position', 'absolute');
                progressBarThis._calcPosition();
            },

            "_updateHeight" : function (progressHeight) {
                var progressBarThis = this;
                var progressHeight = parseInt(progressHeight, 10);

                // 输入高度的合法性判断
                if (isNaN(progressHeight)) {
                    return;
                }

                progressBarThis.$graphArea.css('border-radius', progressHeight/2 + "px");
                progressBarThis.$graphFilled.css('height', progressHeight + "px");
                progressBarThis.$graphFilled.css({'border-radius-left-top': progressHeight/2 + "px",'border-radius-left-bottom': progressHeight/2 + "px"});

                progressBarThis._calcPosition();// 宽度改变后，百分比显示位置也要重新计算
            },

            "_updatePercentage" : function (percentage) {
                var progressBarThis = this;
                var options = progressBarThis.options;

                var oldPercentage = progressBarThis.$annotation.text();
                var newPercentage = percentage;
                if (oldPercentage !== "" && oldPercentage !== newPercentage) {
                    progressBarThis.trigger("changeEvt");
                    if (100 === percentage) {
                        progressBarThis.trigger("completeEvt");
                    }
                }

                progressBarThis.opProgress(percentage);
            },

            "_calcPosition" : function () {
                var progressBarThis = this;
                var options = progressBarThis.options;

                // 当百分值未显示时，取得的annotation的宽度和高度均为0，此处用一个临时的labelBox来获取宽度和高度，然后销毁。解决进度条label在其他控件中错位的问题。
                var tmpLabelBox = $("<div>").addClass('tiny-progressBar-annotation').text(options['value'] + '%').appendTo("body");
                var labelWidth = tmpLabelBox.width();
                var labelHeight = tmpLabelBox.height();
                tmpLabelBox.remove();

                //更新进度条的总宽度，包含百分比的宽度
                var progressBarWidth = parseInt(options['width'], 10);

                switch (options['label-position']) {
                    case 'center' :
                        progressBarThis.$annotation.css({
                            'left': parseInt(options['width'], 10)/2 - labelWidth/2,
                            'top': parseInt(options['height'], 10)/2 - labelHeight/2,
                        });
                        progressBarThis.$graphArea.css('margin-right', '0px');
                        progressBarThis._element.css('width', progressBarWidth + 'px');
                        break;
                    case 'right' :
                        progressBarThis.$annotation.css({
                            'left': parseInt(options['width'], 10) + 10,
                            'top': parseInt(options['height'], 10)/2 - labelHeight/2,
                        });
                        progressBarThis.$graphArea.css('margin-right', '10px');
                        progressBarThis._element.css('width', (progressBarWidth + 10 + labelWidth) + 'px');
                        break;
                    case 'down' :
                        progressBarThis.$annotation.css({
                            'left': parseInt(options['width'], 10)/2 - labelWidth/2,
                            'top': parseInt(options['height'], 10)
                        });
                        progressBarThis.$graphArea.css('margin-right', '0px');
                        progressBarThis._element.css('width', progressBarWidth + 'px');
                        break;
                    default :
                        break;
                }
            },

            "opProgress" : function(percentage) {
                var progressBarThis = this;
                var options = progressBarThis.options;

                // 获取当前进度条的值
                if(0 === arguments.length){
                    return options["value"];
                }

                // 设置进度条当前的值
                options["value"] = percentage;

                // 如果输入非法，则直接强制为0
                if (isNaN(percentage) || percentage > 100 || percentage < 0) {
                    percentage = 0;
                    options["value"] = percentage;
                }

                // 修改显示的数值
                progressBarThis.$annotation.text((percentage + "%"));
                // 更新进度条的值，需要重新计算位置
                progressBarThis._calcPosition();

                // 修改进度条填充区域的宽度
                var wholeWidth = options["width"];
                var progressBarWidth = parseInt(wholeWidth, 10);
                var graphFilledWidth = (percentage / 100) * progressBarWidth;
                progressBarThis.$graphFilled.css('width', graphFilledWidth + 'px');
            },

            "_addBehavior" : function() {
                var progressBarThis = this;
                var options = progressBarThis.options;

                progressBarThis._locateElement();

                // 处理change事件
                progressBarThis.on("changeEvt", function() {
                    progressBarThis.trigger("change");
                    if ("function" == ( typeof options["change"])){
                        options["change"]();
                    }
                });
                // 处理complete事件
                progressBarThis.on("completeEvt", function() {
                    progressBarThis.trigger("complete");
                    if ("function" == ( typeof options["complete"])){
                        options["complete"]();
                    }
                });
            }

        });
        return Progressbar;

    });