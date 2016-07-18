define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-lib/jqPlot", "tiny-lib/underscore", "tiny-common/util", "tiny-widgets/Tip"], function(angular, $, Class, Widget, jqPlot, _, util, Tip) {
    var DEFAULT_CONFIG = {

        "template" : '<div class="tiny-gaugechart"></div>',

        //chart参数
        "animate" : false,
        "background" : "white",

        //axis参数
        "type" : "linear",
        "interval-field" : "data"
    };

    var Gaugechart = Widget.extend({

        "init" : function(options) {
            var widgetThis = this;
            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));
            widgetThis._varInit(options);
            widgetThis._setChart();
            widgetThis._setAxis();
            widgetThis._createChart(options.id, widgetThis._element, options.value, options.threshold);
        },
        "_generateElement" : function() {
            var widgetThis = this;
            var widgetElement = $("#" + widgetThis.options.id);
            return widgetElement;
        },

        "_varInit" : function(options) {
            var widgetThis = this;
            widgetThis.chartOptions = {};
            widgetThis.seriesOptions = {};
            widgetThis.oChart = null;
            widgetThis.seriesIdIndexMap = {};
            widgetThis.isSeriesHorizontal = false;
            widgetThis.onUpdateShowSeries = true;
            widgetThis.isEnter = null;
            widgetThis.attrOpts = {};
            widgetThis.MAX_FIXED_DIGITS = 15;
            widgetThis._guageChartProp = {};
        },
        "_setOption" : function(key, value) {

            var widgetThis = this;

            if (widgetThis.oChart.isAnimateOn === true) {
                return;
            }

            widgetThis._super(key, value);

            switch (key) {
                case 'value':
                    value = parseInt(value);
                    if (isNaN(value)) {
                        return;
                    }
                    if (value < widgetThis.seriesOptions.min || value > widgetThis.seriesOptions.max) {
                        return;
                    }
                    widgetThis.curValu = value;
                    break;
                case 'display':
                    widgetThis.display = value;
                    break;
                case 'unit':
                    widgetThis.seriesOptions.tinyunit = value;
                    widgetThis.axis.unit = widgetThis.seriesOptions.tinyunit;
                    break;
                case 'ticks':
                    value = parseInt(value);
                    if (isNaN(value)) {
                        return;
                    }
                    if (value < widgetThis.seriesOptions.min || value > widgetThis.seriesOptions.max) {
                        return;
                    }
                    widgetThis._setAxisMajTicks(widgetThis.axis, value);
                    widgetThis.seriesOptions.ticks = widgetThis.axis.ticks;
                    break;
                case 'min-ticks':
                    value = parseInt(value);
                    if (isNaN(value)) {
                        return;
                    }
                    if (value < 0) {
                        return;
                    }
                    widgetThis.seriesOptions.tinyMinorTicks = value;
                    widgetThis.axis.minorTickCnt = isNaN(value) || !value ? 5 : parseInt(value);
                    ;
                    break;
                case 'label':
                    widgetThis.seriesOptions.label = value;
                    widgetThis.axis.label = widgetThis.seriesOptions.label;
                    break;
                case 'interval-field':
                    widgetThis.seriesOptions.intervals = widgetThis._calcIntervals(value);
                    widgetThis.axis.interval = widgetThis.seriesOptions.intervals;
                    break;
                case 'threshold':
                    value = parseInt(value);
                    if (isNaN(value)) {
                        return;
                    }
                    if (value < widgetThis.seriesOptions.min || value > widgetThis.seriesOptions.max) {
                        return;
                    }
                    widgetThis.seriesOptions.tinyThreshold = value;
                    break;
                case 'color-field':
                    widgetThis.seriesOptions.intervalColors = widgetThis._calcIntervalsColor(value);
                    break;
                case 'tips':
                    widgetThis.seriesOptions.tinytip = value;
                    break;
                case 'text-angle':
                    var angle = parseInt(value);
                    if (!isNaN(angle)) {
                        if (angle >= -360 && angle <= 360) {
                            widgetThis.axis.textAngle = angle;
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                    break;
                case 'hub-color-field':
                    widgetThis.axis.hubColor = value;
                    widgetThis.seriesOptions.hubColors = widgetThis._calcHubColors(value);
                    widgetThis.axis.hubColorArray = widgetThis.seriesOptions.hubColors;
                    break;
                case 'width':
                    widgetThis.width = parseInt(value);
                    widgetThis.chartOptions.width = widgetThis.width;
                    widgetThis._element.css('width', widgetThis.width);
                    break;
                case 'height':
                    widgetThis.height = parseInt(value);
                    widgetThis.chartOptions.height = widgetThis.height;
                    widgetThis._element.css('height', widgetThis.height);
                    break;
            }
            if (key == "display") {
                if (value === true) {
                    widgetThis.elem.show();
                    widgetThis.createChart();
                } else if (value === false) {
                    widgetThis.elem.hide();
                }
            } else {
                widgetThis.createChart();
            }

        },

        "_setChart" : function() {
            var widgetThis = this;
            var options = widgetThis.options;
            widgetThis.chartOptions.grid = {
                "background" : options["background"]
            };
            widgetThis.chartOptions.animate = false;
            widgetThis.width = parseInt(options["width"]);
            widgetThis.height = parseInt(options["height"]);
            widgetThis._parseOptions();
            options["width"] = widgetThis.width;
            options["height"] = widgetThis.height;
            widgetThis.chartOptions.width = widgetThis.width;
            widgetThis.chartOptions.height = widgetThis.height;
            widgetThis._element.css('width', widgetThis.width);
            widgetThis._element.css('height', widgetThis.height);
        },

        "_setAxis" : function() {
            var widgetThis = this, axis = widgetThis.options;
            if (axis) {
                var tmpAxis = {
                    "textAngle" : !isNaN(parseInt(axis["text-angle"])) && axis["text-angle"] >= -360 && axis["text-angle"] <= 360 ? axis["text-angle"] : 0,
                    "unit" : axis.unit ? '' + axis.unit : null,
                    "colorfield" : axis["color-field"],
                    "intervalfield" : axis["interval-field"],
                    "field" : axis["field"],
                    "type" : axis["type"] ? axis["type"] : "linear",
                    "label" : axis["label"],
                    "majTicks" : axis["ticks"],
                    "secColor" : axis["section-color"],
                    "axisData" : axis["axis-data"] || axis.axisData,
                    "hubColor" : axis["hub-color-field"],
                    "labelRenderer" : axis["label-renderer"],
                    "minorTickCnt" : isNaN(axis["min-ticks"]) || !axis["min-ticks"] ? 5 : parseInt(axis["min-ticks"]),
                    "labelDisplayLength" : axis["display-length"] && axis["display-length"] > 0 ? axis["display-length"] : 6
                };

                if (axis["tick-label-renderer"]) {
                    tmpAxis.tickLabelRender = axis["tick-label-renderer"];
                }

                widgetThis._setAxisMinMax(tmpAxis, axis.min, axis.max);

                widgetThis._setAxisMajTicks(tmpAxis, axis["ticks"]);

                widgetThis._setAxisData(tmpAxis, tmpAxis.axisData);

                widgetThis.axis = tmpAxis;
            }
        },

        "_setAxisData" : function(axis, tempSeriesData) {
            var intervals = [], colr = [], borderColr = [], hubColr = [];
            var intervalfield = axis.intervalfield, colFld = axis.colorfield, secColor = axis.secColor, hubColor = axis.hubColor;
            for (var i = 0; i < tempSeriesData.length; i++) {
                if (tempSeriesData[i][intervalfield] !== undefined) {
                    var point = parseInt(tempSeriesData[i][intervalfield]);
                    if (point >= axis.min) {
                        if (tempSeriesData[i][colFld]) {
                            colr.push(tempSeriesData[i][colFld]);
                        }
                        if (secColor && tempSeriesData[i][secColor]) {
                            borderColr.push(tempSeriesData[i][secColor]);
                        } else {
                            borderColr.push('');
                        }
                        if (hubColor && tempSeriesData[i][hubColor]) {
                            hubColr.push(tempSeriesData[i][hubColor]);
                        }
                        if (point > axis.max) {
                            intervals.push(axis.max);
                            break;
                        } else {
                            intervals.push(tempSeriesData[i][intervalfield]);
                        }
                    }
                }
            }
            axis.color = colr;
            axis.hubColorArray = hubColr;
            axis.bordercolor = borderColr;
            axis.interval = intervals;
        },

        "_setAxisMajTicks" : function(axis, majTicks) {
            var widgetThis = this;
            var majTickCnt = parseInt(majTicks);
            if (isNaN(majTickCnt) || majTickCnt <= 1) {
                majTicks = 2;
            } else {
                majTicks = majTickCnt - 1;
            }
            rangeVal = (axis.max - axis.min) / (majTicks);
            var tick = [], tickss = [], prevtt = null, roundDecimals = 1, i;
            for ( i = 0; i <= majTicks; i++) {
                tt = widgetThis._roundValue(rangeVal * i, widgetThis.MAX_FIXED_DIGITS);
                tt = widgetThis._roundValue(tt + axis.min, widgetThis.MAX_FIXED_DIGITS);
                var actualtt = tt;
                if (prevtt !== null) {
                    var ai = 1; {
                        tt = widgetThis._roundValue(actualtt, roundDecimals);
                        while (prevtt !== tt) {
                            tt = widgetThis._roundValue(actualtt, (roundDecimals + ai));
                            ai++;
                            if (ai > 15) {
                                break;
                            }
                            prevtt = tt;
                        }
                    }
                    ai = 1;
                    var prevTickExists = false;
                    for (var aj = 0; aj < tickss.length; aj++) {
                        if (prevtt === tickss[aj]) {
                            prevTickExists = true;
                            break;
                        }
                    }
                    if (prevTickExists) {
                        while (prevtt === tt) {
                            tt = widgetThis._roundValue(actualtt, (roundDecimals + ai));
                            ai++;
                            if (ai > 15) {
                                break;
                            }
                        }
                    }
                }
                prevtt = tt;
                tickss.push(prevtt);
            }
            for ( i = 0; i <= majTicks; i++) {
                tick.push([tickss[i], tickss[i]]);
            }
            axis.ticks = tick;
        },

        "_setAxisMinMax" : function(axis, min, max) {
            if (!isNaN(min)) {
                axis.min = min;
            } else {
                axis.min = 0;
            }
            if (!isNaN(max)) {
                if (min >= max) {
                    axis.min = 0;
                    axis.max = 100;
                } else {
                    axis.max = max;
                }
            } else {
                axis.max = 100;
            }
        },

        "_createChart" : function(id, chartHTMLElem, value, threshold, tip) {
            var widgetThis = this;
            widgetThis.id = id;
            widgetThis.elem = chartHTMLElem;
            widgetThis.seriesOptions = {
                min : this.axis.min,
                max : this.axis.max,
                dataVal : parseFloat(value, 10),
                label : this.axis.label,
                labelRenderer : this.axis.labelRenderer,
                labelDisplayLength : this.axis.labelDisplayLength,
                labelPosition : "bottom",
                tinyType : this.axis.type,
                ticks : this.axis.ticks,
                hubColors : this.axis.hubColorArray,
                tinyThreshold : threshold ? parseInt(threshold) : 0,
                tinytip : tip,
                tinyBorderClr : this.axis.bordercolor,
                intervals : this.axis.interval,
                intervalColors : this.axis.color,
                tinyunit : this.axis.unit,
                tinyMinorTicks : this.axis.minorTickCnt,
                tinyRender : this.axis.tickLabelRender,
                tinyId : id
            };
            value = widgetThis.seriesOptions.dataVal;
            if ( typeof value === 'undefined' || isNaN(value)) {
                value = widgetThis.seriesOptions.min;
            }
            if (value > widgetThis.seriesOptions.max) {
                value = widgetThis.seriesOptions.max;
            }
            if (value < widgetThis.seriesOptions.min) {
                value = widgetThis.seriesOptions.min;
            }

            widgetThis._parseOptions();

            if (widgetThis.seriesOptions.tinyType === 'angular') {
                if (widgetThis.seriesOptions.ticks && widgetThis.seriesOptions.ticks.length > 1) {
                    widgetThis.majorTickCnt = widgetThis.seriesOptions.ticks.length - 1;
                } else {
                    widgetThis.majorTickCnt = 5;
                }
            }

            widgetThis.chartOptions.seriesDefaults = {
                renderer : $.jqplot.MeterGaugeRenderer,
                rendererOptions : widgetThis.seriesOptions
            };
            widgetThis.curValu = value;
            widgetThis.display = $(chartHTMLElem).is(':visible');

            widgetThis.chartOptions.tinyType = widgetThis.seriesOptions.tinyType;

            widgetThis.oChart = $.jqplot(id, [[widgetThis.curValu]], widgetThis.chartOptions);
            if (widgetThis.axis.textAngle) {
                $('#' + widgetThis.id + ' .jqplot-meterGauge-tick').jangle({
                    degrees : widgetThis.axis.textAngle
                });
            }

        },

        "initCustomParams" : function() {
            var widgetThis = this;
            var options = {
                intervalOuterRadius : 150 / 400 * widgetThis.width,
                intervalInnerRadius : 110 / 400 * widgetThis.width,
                hubRadius : 80 / 400 * widgetThis.width,
                height : 300 / 400 * widgetThis.width,
                needleWidth : (widgetThis.width <= 400) ? 10 : 15,
                width : widgetThis.width,
                ringWidth : (widgetThis.width <= 400) ? 1 : 0
            };
            _.extend(widgetThis.seriesOptions, options);
            widgetThis.seriesOptions.needleHeight = Math.abs(widgetThis.seriesOptions.intervalOuterRadius - widgetThis.seriesOptions.hubRadius);
            widgetThis.seriesOptions.needleX = widgetThis.seriesOptions.hubRadius - 2;
        },

        "initUCDParams" : function() {
            var widgetThis = this;
            widgetThis.width = 400;
            var options = {
                intervalOuterRadius : 75,
                intervalInnerRadius : 55,
                hubRadius : 40,
                height : 300,
                needleWidth : 10,
                width : 400,
                ringWidth : 1,
                needleHeight : 35,
                needleX : 38
            };
            _.extend(widgetThis.seriesOptions, options);
        },

        "_parseOptions" : function() {
            var widgetThis = this;
            if (widgetThis.options.type === 'angular') {
                if (widgetThis.width != "undefined" && $.isNumeric(widgetThis.width)) {
                    widgetThis.initCustomParams();
                } else {
                    widgetThis.initUCDParams();
                }
            } else if (widgetThis.options.type === 'cylinder') {
                if ( typeof widgetThis.width == 'undefined' || !$.isNumeric(widgetThis.width)) {
                    widgetThis.width = 115;
                    widgetThis.chartOptions.width = widgetThis.width;
                }
                if ( typeof widgetThis.height == 'undefined' || !$.isNumeric(widgetThis.height)) {
                    widgetThis.height = 220;
                    widgetThis.chartOptions.height = widgetThis.height;
                }
            } else if (widgetThis.options.type === 'thermometer') {
                if ( typeof widgetThis.width == 'undefined' || !$.isNumeric(widgetThis.width)) {
                    widgetThis.width = 200;
                    widgetThis.chartOptions.width = widgetThis.width;
                }
                if ( typeof widgetThis.height == 'undefined' || !$.isNumeric(widgetThis.height)) {
                    widgetThis.height = 300;
                    widgetThis.chartOptions.height = widgetThis.height;
                }
            }
            if ( typeof widgetThis.width != 'undefined' && $.isNumeric(widgetThis.width)) {
                widgetThis.seriesOptions.width = widgetThis.width;
            }
            if ( typeof widgetThis.height != 'undefined' && $.isNumeric(widgetThis.height)) {
                widgetThis.seriesOptions.height = widgetThis.height;
            }
        },

        "createChart" : function() {
            var widgetThis = this;
            if (widgetThis.oChart.isAnimateOn === true) {
                return;
            }
            if (widgetThis.elem.is(':visible')) {
                if (widgetThis._uninstall) {
                    widgetThis._uninstall();
                }

                widgetThis._freeOldGaugeObjects();
                widgetThis.oChart.destroy();
                $("#" + widgetThis.id).empty();
                widgetThis._parseOptions();
                widgetThis.chartOptions.seriesDefaults = {
                    renderer : $.jqplot.MeterGaugeRenderer,
                    rendererOptions : widgetThis.seriesOptions
                };
                widgetThis.chartOptions.animate = false;
                widgetThis.chartOptions.seriesDefaults.rendererOptions.dataVal = widgetThis.curValu;
                widgetThis.chartOptions.seriesDefaults.rendererOptions.update = true;
                widgetThis.oChart = $.jqplot(widgetThis.id, [[widgetThis.curValu]], widgetThis.chartOptions);
                if (widgetThis.axis.textAngle) {
                    $('#' + widgetThis.id + ' .jqplot-meterGauge-tick').jangle({
                        degrees : widgetThis.axis.textAngle
                    });
                }
            }
        },
        "_freeOldGaugeObjects" : function() {
            var widgetThis = this, plot = widgetThis.oChart;
            var args = ['.jqplot-title', '.jqplot-meterGauge-tick'];
            for (var ia = 0; ia < args.length; ia++) {
                plot.target.find(args[ia]).each(function(a, elm) {
                    tiny.garbageCollect(elm);
                });
            }
        },

        "_roundValue" : function(num, fixed) {
            fixed = fixed || 0;
            fixed = Math.pow(10, fixed);
            return Math.floor(num * fixed) / fixed;
        },

        "_calcIntervals" : function(field) {
            var widgetThis = this, tempSeriesData = widgetThis.axis.axisData;
            var range = {
                min : widgetThis.axis.min,
                max : widgetThis.axis.max
            };
            var intervals = [];
            for (var i = 0; i < tempSeriesData.length; i++) {
                if (tempSeriesData[i][field]) {
                    var point = parseInt(tempSeriesData[i][field]);
                    if (point >= range.min && point <= range.max) {
                        intervals.push(tempSeriesData[i][field]);
                    }
                }
            }
            return intervals;
        },
        "_calcIntervalsColor" : function(colorfield) {
            var widgetThis = this, tempSeriesData = widgetThis.axis.axisData;
            var colr = [];
            for (var i = 0; i < tempSeriesData.length; i++) {
                if (tempSeriesData[i][colorfield]) {
                    colr.push(tempSeriesData[i][colorfield]);
                }
            }
            return colr;
        },
        "_calcHubColors" : function(hubColorField) {
            var widgetThis = this, tempSeriesData = widgetThis.axis.axisData;
            var hubColr = [];
            for (var i = 0; i < tempSeriesData.length; i++) {
                if (tempSeriesData[i][hubColorField]) {
                    hubColr.push(tempSeriesData[i][hubColorField]);
                }
            }
            return hubColr;
        },
        "_uninstall" : function() {
            var widgetThis = this;
            if (widgetThis._guageChartProp && widgetThis._guageChartProp.map) {

                widgetThis._guageChartProp.map.innerHTML = "";
                widgetThis._guageChartProp.map = null;
            }
            delete widgetThis._guageChartProp;
        }
    });

    return Gaugechart;

});
