define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-lib/jqPlot", "tiny-lib/underscore", "tiny-common/util", "tiny-widgets/Tip", "tiny-lib/encoder"], function(angular, $, Class, Widget, jqPlot, _, util, Tip, encoder) {
    var DEFAULT_CONFIG = {

        "template" : '<div class="tiny-steamingchart"></div>',

        //chart参数
        "chart-title" : "",
        "grid" : true,
        "animate" : false,
        "hide-points" : false,
        "width" : "500px",
        "height" : "300px",
        "background" : "white",

        //axis参数
        "axis" : [{
            "type" : "yaxis"
        }, {
            "type" : "xaxis"
        }],

        //"series-list参数"
        "series-list" : {
            "stack" : false,
            "threshold" : null,
            "thresholdColor" : 'red',
            "thresholdAlways" : true,
            "series" : []
        }

    };

    var Streamingchart = Widget.extend({

        "init" : function(options) {
            var widgetThis = this;
            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));
            widgetThis._varInit(options);
            widgetThis._setChart();
            widgetThis._setAxis();
            widgetThis._setSeries();
            widgetThis._setLengend();
            widgetThis._createChart(options.id, widgetThis._element);
        },
        "_generateElement" : function() {
            var widgetThis = this;
            var widgetElement = $("#" + widgetThis.options.id);
            return widgetElement;
        },

        "_varInit" : function(options) {
            var widgetThis = this;
            widgetThis.linechart = 'line';
            widgetThis.piechart = 'pie';
            widgetThis.barchart = 'bar';
            widgetThis.areachart = 'area';
            widgetThis.horizontalchart = 'horizontal';
            widgetThis.streamChartOptions = {
                disableDestroy : false
            };
            widgetThis.islinechart = false;
            widgetThis.isareachart = false;
            widgetThis.isBarchart = false;
            widgetThis.isPieChart = false;
            widgetThis.chartOptions = {};
            widgetThis.oChart = null;
            widgetThis.seriesIdIndexMap = {};
            widgetThis.isSeriesHorizontal = false;
            widgetThis.onUpdateShowSeries = true;
            widgetThis.isEnter = null;
            widgetThis.attrOpts = {};
        },
        "_setOption" : function(key, value) {

            var widgetThis = this;

            widgetThis._super(key, value);

            var widgetThis = this;

            switch (key) {
                case 'chart-title':
                    widgetThis.oChart.title.text = value;
                    widgetThis.oChart.title.show = true;
                    break;
                case 'grid':
                    widgetThis.oChart.grid.drawGridlines = value;
                    break;
                case 'display':
                    if (!widgetThis.attrOpts) {
                        widgetThis.attrOpts = {};
                    }
                    widgetThis.attrOpts.display = util.isFalse(value) ? false : true;
                    break;
                case 'height':
                    if (!widgetThis.attrOpts) {
                        widgetThis.attrOpts = {};
                    }
                    widgetThis.attrOpts.height = parseInt(value, 10);
                    widgetThis.height = parseInt(value, 10);
                    break;
                case 'width':
                    if (!widgetThis.attrOpts) {
                        widgetThis.attrOpts = {};
                    }
                    widgetThis.attrOpts.width = parseInt(value, 10);
                    widgetThis.width = parseInt(value, 10);
                    break;
            }
            widgetThis._reRender();
        },

        "_setChart" : function() {
            var widgetThis = this;
            var options = widgetThis.options;
            widgetThis.chartOptions.title = {
                text : options["chart-title"]
            };
            widgetThis.chartOptions.grid = {
                "drawGridlines" : options["grid"] === false ? false : true,
                "gridLineColor" : "#F6F6F6",
                "background" : options["background"] ? options["background"] : "white"
            };
            widgetThis.chartOptions.animate = util.isTrue(options["animate"]) ? true : false;
            widgetThis.chartOptions.hidePoints = util.isTrue(options["hide-points"]) ? true : false;
            widgetThis.chartOptions.pietype = options["pie-type"] || options["pieType"];
            widgetThis._element.css('width', options["width"]);
            widgetThis._element.css('height', options["height"]);
            if(typeof(widgetThis.options.click)==='function'){
	               	  widgetThis.on("click",function(tmpData){
	               	   widgetThis.options.click(tmpData); 
	               	  })
	           }     
        },

        "_setChartType" : function(series, type) {
            var widgetThis = this;
            series.type = type === widgetThis.linechart || type === widgetThis.piechart || type === widgetThis.barchart || type === widgetThis.areachart || type === widgetThis.horizontalchart ? type : widgetThis.linechart;
            series.options.renderer = (series.type === widgetThis.barchart || series.type === widgetThis.horizontalchart) ? $.jqplot.BarRenderer : (series.type === widgetThis.piechart ? $.jqplot.PieRenderer : undefined);
            var barwid = null;
            if (type === widgetThis.horizontalchart) {
                barwid = series.barWidthSet;
                if (barwid === null) {
                    barwid = 10;
                }
                series.options.rendererOptions = {
                    barDirection : 'horizontal',
                    barWidth : barwid
                };
            } else if (type === widgetThis.barchart) {
                series.options.rendererOptions = {};
                barwid = series.barWidthSet;
                if (barwid !== null) {
                    series.options.rendererOptions.barWidth = barwid;
                }
            }

            if (series.type === widgetThis.areachart) {
                series.options.fill = true;
                series.options.fillAndStroke = true;
                series.options.fillAlpha = '.25';
                series.options.shadow = false;
                if (!series.options.rendererOptions) {
                    series.options.rendererOptions = {};
                }
                series.options.rendererOptions.smooth = series.smooth;
            }

            if (series.type === widgetThis.linechart) {
                if (!series.options.rendererOptions) {
                    series.options.rendererOptions = {};
                }
                series.options.rendererOptions.smooth = series.smooth;
            }
        },

        "_setSeriesMarker" : function(tmpSeries, marker) {
            if ( typeof marker === 'string') {
                marker = undefined;
            }
            if (marker) {
                tmpSeries.options.showMarker = util.isFalse(marker.show) ? false : true;
                tmpSeries.options.markerRenderer = $.jqplot.MarkerRenderer;
                tmpSeries.options.markerOptions = marker;
                tmpSeries.options.markerOptions.show = tmpSeries.options.showMarker;
                tmpSeries.markerOptions = marker;
            }
        },

        "_setSeriesSection" : function(tmpSeries, section) {
            var widgetThis = this;
            if (section) {
                tmpSeries.section = section;
                if (tmpSeries.type !== widgetThis.piechart) {
                    if ($.isArray(section) && section.length > 0) {
                        if (section[0].borderStyle) {
                            tmpSeries.options.color = section[0].borderStyle;
                            tmpSeries.options.borderColor = section[0].borderStyle;
                        }
                    } else{
                    		_.extend(tmpSeries.options,section);
	                    	if (section.borderStyle) {
	                        tmpSeries.options.color = section.borderStyle;
	                        tmpSeries.options.borderColor = section.borderStyle;
	                        tmpSeries.section = [section];
	                    }
                    } 
                } else {
                	_.extend(tmpSeries.options,section);
                    if (section.gradient) {
                        tmpSeries.options.color = section.gradient;
                    }
                    if (section.borderStyle) {
                        tmpSeries.options.borderColor = section.borderStyle;
                    }
                    if (section.borderColors) {
                        tmpSeries.options.borderColors = section.borderColors;
                    }
                }
            }
        },

        "_setSeriesHighlight" : function(tmpSeries, highlight) {
            if (util.isFalse(highlight)) {
                tmpSeries.isHighLight = false;
                if (!tmpSeries.options.rendererOptions) {
                    tmpSeries.options.rendererOptions = {};
                }
                tmpSeries.options.rendererOptions.highlightMouseOver = false;
                tmpSeries.options.showHighlight = false;
            } else {
                tmpSeries.isHighLight = true;
                if (!tmpSeries.options.rendererOptions) {
                    tmpSeries.options.rendererOptions = {};
                }
                tmpSeries.options.rendererOptions.highlightMouseOver = true;
                tmpSeries.options.showHighlight = true;
            }
        },

        "_setSeriesTips" : function(tmpSeries, tips) {
            if (tips) {
	            tmpSeries.tips = tips;
                var field = tips['field'];
                if (field) {
                    var tipValues = [];
                    var data = tmpSeries.tempData;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][field]) {
                            tipValues[i] = data[i][field];
                        }
                    }
                    tmpSeries.tipData = tipValues;
                }
            }
        },

        "_setSeriesPointLabels" : function(tmpSeries, pointLabels) {
            var widgetThis = this;
            if (pointLabels) {
                tmpSeries.pointLabelSet = true;
                tmpSeries.pointLabels = pointLabels;
                var location = typeof pointLabels.location === 'undefined' ? 'n' : pointLabels.location, ypadding = typeof pointLabels.ypadding === 'undefined' ? 6 : pointLabels.ypadding, xpadding = typeof pointLabels.xpadding === 'undefined' ? 6 : pointLabels.xpadding, show = util.isFalse(pointLabels.show) ? false : true;
                if (tmpSeries.type !== widgetThis.piechart) {
                    tmpSeries.options.pointLabels = {
                        escapeHTML : false,
                        show : show,
                        location : location,
                        ypadding : ypadding,
                        xpadding : xpadding
                    };
               }
                var field = pointLabels.field;
                if (field) {
                    var pointValues = [];
                    var data = tmpSeries.tempData;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][field] != undefined) {
                            pointValues[i] = data[i][field];
                        }
                    }
                    tmpSeries.pointData = pointValues;
                }
            }
        },

        "_setSeriesData" : function(tmpSeries, data) {
            var xfield = tmpSeries.xfield;
            var yfield = tmpSeries.yfield;
            for (var i = 0; i < data.length; i++) {
                var xFieldFlag = true;
                if ( typeof data[i][xfield] === 'undefined') {
                    xFieldFlag = false;
                }

                if ($.isNumeric(data[i][yfield])) {
                    if (yfield) {
                        var ydata = data[i][yfield];
                        var yconverted = parseFloat(ydata);
                        if (!isNaN(yconverted)) {
                            tmpSeries.data.push(yconverted);
                        }
                    }
                    if (xFieldFlag) {
                        var xdata = data[i][xfield];
                        xdata = (( typeof xdata) === 'undefined') ? '' : xdata;
                        tmpSeries.labels.push(xdata);
                        tmpSeries.templabels.push(i);
                    } else {
                        tmpSeries.labels.push(i);
                        tmpSeries.templabels.push(i);
                    }
                }
            }
        },

        "_setSeries" : function() {
            var widgetThis = this;
            var tmpSeriesList = widgetThis.options["seriesList"] || widgetThis.options["series-list"];

            //设置seriesList
            widgetThis.seriesList = {
                "stack" : util.isTrue(tmpSeriesList.stack) ? true : false,
                "threshold" : !isNaN(tmpSeriesList.threshold) ? tmpSeriesList.threshold : null,
                "thresholdColor" : tmpSeriesList["threshold-color"]||'red',
                "thresholdAlways" : util.isFalse(tmpSeriesList.thresholdAlways) ? false : true,
                "seriesList" : []
            };

            //设置series
            if (tmpSeriesList.series && tmpSeriesList.series.length != 0) {
                _.each(tmpSeriesList.series, function(series) {
                    if (!$.isArray(series.data)) {
                        return;
                    }

                    var tmpSeries = {
                        "tempData" : series.data,
                        "xfield" : series.xfield ? series.xfield : "x",
                        "yfield" : series.yfield ? series.yfield : "y",
                        "xaxis" : "xaxis",
                        "yaxis" : "yaxis",
                        "barWidthSet" : !isNaN(parseFloat(series.barWidth)) && parseFloat(series.barWidth) > 0 ? parseFloat(series.barWidth) : null,
                        "smooth" : util.isTrue(series.smooth) ? true : false,
                        "options" : {
                            "shadowOffset" : 5,
                            "shadowDepth" : 1,
                            "seriesid" : series.id,
                            "xaxis" : "xaxis",
                            "yaxis" : "yaxis",
                            "label" : series.label
                        },
                        "data" : [],
                        "labels" : [],
                        "templabels" : [],
                        "id" : series.id,
                        "backupTempData" : []
                    };

                    widgetThis._setChartType(tmpSeries, series.type);

                    widgetThis._setSeriesMarker(tmpSeries, series.marker);

                    widgetThis._setSeriesHighlight(tmpSeries, series.highlight);

                    widgetThis._setSeriesPointLabels(tmpSeries, series["point-label"]);

                    widgetThis._setSeriesTips(tmpSeries, series.tips);

                    widgetThis._setSeriesSection(tmpSeries, series.section);

                    widgetThis._setSeriesData(tmpSeries, series.data);

                    if (tmpSeries.yfield) {
                        widgetThis.seriesList.seriesList.push(tmpSeries);
                    }
                });
            }
        },

        "_setAxisFontData" : function(tmpAxis, fontData) {
            if (fontData) {
                tmpAxis.fontData = fontData;
            }
        },

        "_setAxisUnitLength" : function(tmpAxis, unitLength) {
            if (unitLength) {
                unitLength = parseInt(unitLength, 10);
                if (unitLength > 0) {
                    tmpAxis.unitLength = unitLength;
                }
            }
        },

        "_setAxisDisplayLength" : function(tmpAxis, displayLength) {
            if (displayLength && !isNaN(displayLength) && displayLength >= 0) {
                tmpAxis.displayLength = displayLength;
            }
        },

        "_setAxisData" : function(tmpAxis, dataArray) {
            //设置坐标轴颜色参数
            var colr = [];
            var borderColorArray = [];
            var colorSectionDataArray = [];
            var intervalfield = tmpAxis.intervalfield;
            var borderColorField = tmpAxis.sectionColor;
            if (dataArray) {
                for (var i = 0; i < dataArray.length; i++) {
                    if (dataArray[i][intervalfield]) {
                        var point = parseInt(dataArray[i][intervalfield]);
                        if (dataArray[i][colorField]) {
                            colr.push(dataArray[i][colorField]);
                            if (dataArray[i][intervalfield]) {
                                colorSectionDataArray.push(dataArray[i][intervalfield]);
                            }
                        }
                        if (borderColorField && dataArray[i][borderColorField]) {
                            borderColorArray.push(dataArray[i][borderColorField]);
                        }
                    }
                }
                tmpAxis.color = colr;
                tmpAxis.colorSectionDataArray = colorSectionDataArray;
                tmpAxis.bordercolor = borderColorArray;
            }
        },

        "_setAxisMinMax" : function(tmpAxis, min, max) {
            if (tmpAxis.renderType && tmpAxis.renderType === 'date') {
                if (min) {
                    tmpAxis.min = min;
                    tmpAxis.isMinMax = true;
                }
                if (max) {
                    tmpAxis.max = max;
                    tmpAxis.isMinMax = true;
                }
            } else {
                if (!isNaN(min)) {
                    tmpAxis.min = min;
                    tmpAxis.isMinMax = true;
                }
                if (!isNaN(max)) {
                    tmpAxis.max = max;
                    if (tmpAxis.isMinMax) {
                        if (!isNaN(parseInt(min)) && max >= min) {
                            tmpAxis.isMinMax = true;
                        } else {
                            tmpAxis.isMinMax = false;
                            tmpAxis.min = null;
                            tmpAxis.max = null;
                        }
                    } else {
                        tmpAxis.isMinMax = true;
                    }
                }
            }
        },

        "_setAxisPosition" : function(tmpAxis, position) {
            if (tmpAxis.type == "xaxis") {
                position = ($.inArray(position, ["top", "bottom"]) < 0) ? "bottom" : position;
            } else if (tmpAxis.type == "yaxis") {
                position = ($.inArray(position, ["left", "right"]) < 0) ? "left" : position;
            }
            tmpAxis.position = position;
        },

        "_setAxis" : function() {
            var widgetThis = this;
            var options = widgetThis.options;

            widgetThis.axes = {
                "axesList" : []
            };

            if (options.axis && options.axis.length != 0) {
                _.each(options.axis, function(axis) {
                    var tmpAxis = {
                        "textAngle" : axis["text-angle"],
                        "label" : axis.label,
                        "type" : axis.type ? axis.type : "xaxis",
                        "unit" : axis.unit ? '' + axis.unit : null,
                        "unitData" : axis.unitData,
                        "unitLength" : 15,
                        "numberTicks" : axis.ticks,
                        "auto" : util.isFalse(axis.auto) ? false : true,
                        "renderType" : axis["render-type"] && axis["render-type"] === 'date' ? axis["render-type"] : null,
                        "renderFormat" : axis["render-type"] && axis["render-type"] === 'date' && axis["render-format"] ? axis["render-format"] : null,
                        "field" : axis.field,
                        "axisData" : axis.data,
                        "colorfield" : axis.colorfield,
                        "intervalfield" : axis.intervalfield,
                        "decimalPlace" : axis.decimalPlace,
                        "unitDisplay" : util.isFalse(axis["unit-display"]) ? false : true,
                        "labelField" : axis.labelField,
                        "tickRenderer" : axis.tickLabelRenderer,
                        "sectionColor" : axis.sectionColor,
                        "numberTicks" : axis.ticks,
                        "ticksFontSize":axis["ticks-font-size"],
                        "labelFontSize":axis["label-font-size"]
                    };

                    widgetThis._setAxisFontData(tmpAxis, axis.fontData);

                    widgetThis._setAxisUnitLength(tmpAxis, axis.unitLength);

                    widgetThis._setAxisDisplayLength(tmpAxis, axis.displayLength);

                    widgetThis._setAxisData(tmpAxis, axis.data);

                    widgetThis._setAxisMinMax(tmpAxis, axis.min, axis.max);

                    widgetThis._setAxisPosition(tmpAxis, axis.position);

                    widgetThis.axes.axesList.push(tmpAxis);
                });
            }
        },

        "_setLengend" : function() {
            var widgetThis = this;

            var legend = widgetThis.options.legend;

            if (legend) {
                widgetThis.legend = {
                    "isVisiblity" : util.isFalse(legend.visible) ? false : true,
                    "placement" : legend.placement === "outside" || legend.placement === "outsideGrid" ? "outsideGrid" : "inside",
                    "location" : legend.location !== undefined && $.inArray(legend.location, ["n", "s", "e", "w", "ne", "nw", "se", "sw", "c"]) >= 0 ? legend.location : null,
                    "auto" : util.isFalse(legend.auto) ? false : true,
                    "columns" : legend.columns > 0 ? legend.columns : -1,
                    "rowSpacing" : parseInt(legend.rowSpacing, 10),
                    "onupdateShowSeries" : util.isFalse(legend.onupdateShowSeries) ? false : true,
                    "seriesToggle" : util.isTrue(legend.seriesToggle) ? true : false,
                    "itemSpacing" : !isNaN(legend["item-spacing"]) ? parseInt(legend["item-spacing"], 10) : 0
                };
            }
        },

        "_setLegendOptionsOnChart" : function(legend, chartOptions) {
            var widgetThis = this;
            if (legend) {
                chartOptions.legend = {
                    show : legend.isVisiblity,
                    renderer : $.jqplot.EnhancedLegendRenderer,
                    rendererOptions : {
                        seriesToggle : false
                    }
                };
                if (legend.placement) {
                    chartOptions.legend.placement = legend.placement;
                }
                if (legend.location) {
                    chartOptions.legend.location = legend.location;
                }
                if (legend.columns) {
                    chartOptions.legend.rendererOptions = {
                        numberColumns : legend.columns
                    };
                }

                chartOptions.legendOptions = {};
                chartOptions.legendOptions.legendObject = legend;
                chartOptions.legendOptions.seriesIdIndexMap = widgetThis.seriesIdIndexMap;
                chartOptions.legendOptions.seriesList = widgetThis.seriesList.seriesList;

                var legendRender = new tiny.charts.legendrenderer(widgetThis);
                chartOptions.legend.renderer.prototype.draw = legendRender.LegendRendererDrawCallBack;
            }
        },

        "_setAxesOptions" : function() {
            var widgetThis = this;
            if (widgetThis.axes) {
                widgetThis._setVerticalAxesOptions();
                widgetThis.xAxisTicks = widgetThis._getXTickCount(widgetThis.axes.axesList);
            }
        },
        "_setVerticalAxesOptions" : function() {
            var widgetThis = this;
            var axesList = widgetThis.axes.axesList;
            var x;
            if (!axesList || axesList.length === 0) {
                return;
            }
            var isxaxisFound = false;
            var isyaxisFound = false;
            var axesElToRemove = [];
            var axesElToRetain = [];

            var yAxisCount = 0;
            var isYPositioned = false;
            for (var i = 0; i < axesList.length; i++) {
                var axisEl = axesList[i];
                if (axisEl.type === 'xaxis') {
                    if (!isxaxisFound) {
                        isxaxisFound = true;
                        axesElToRetain.push(axisEl);
                    } else {
                        axesElToRemove.push(i);
                    }
                    widgetThis.isDateAxis = (axisEl.renderType === 'date');
                } else if (axisEl.type === 'yaxis' && yAxisCount < 4) {
                    if (yAxisCount >= 4) {
                        axesElToRemove.push(i);
                        continue;
                    }
                    if (axesList[i].position === 'right' && !isyaxisFound) {
                        isYPositioned = true;
                    }
                    if (isYPositioned) {
                        var yaxisName = 'y' + (yAxisCount + 2) + 'axis';
                        axisEl.type = yaxisName;
                    } else if (isyaxisFound) {
                        axisEl.type = 'y' + (yAxisCount + 1) + 'axis';
                    }
                    axesElToRetain.push(axisEl);
                    isyaxisFound = true;
                    yAxisCount++;
                } else {
                    axesElToRemove.push(i);
                }
            }

            var axisNameMap = {};
            axesList.splice(0, axesList.length);
            for (var k = 0; k < axesElToRetain.length; k++) {
                axesList.push(axesElToRetain[k]);
                axisNameMap[axesElToRetain[k].type] = true;
            }

            var defAxisName = null;
            if (isYPositioned) {
                defAxisName = 'y2axis';
            } else {
                defAxisName = 'yaxis';
            }
            var tickLabels = widgetThis._parseTickLabels();
            var seriesLength = widgetThis.chartOptions.series.length;
            var thresoldvalue;
            var throAlways = false;
            if (seriesLength === 1) {
                throAlways = widgetThis.seriesList.thresholdAlways;
                widgetThis.chartOptions.series[0].showThresholdAlways = throAlways;

                if (widgetThis.seriesList.threshold && !isNaN(widgetThis.seriesList.threshold)) {
                    thresoldvalue = widgetThis.seriesList.threshold;
                    widgetThis.chartOptions.series[0].thresold = thresoldvalue;
                }
            }
            for ( x = 0; x < seriesLength; x++) {
                if (!widgetThis.chartOptions.series[x].yaxis || !axisNameMap[widgetThis.chartOptions.series[x].yaxis]) {
                    widgetThis.chartOptions.series[x].yaxis = defAxisName;
                }
            }

            widgetThis.chartOptions.axes = {};
            var axisTickLabels, xaxisDataWithLabel = false;
            widgetThis._checkXfieldOptions();
            for ( i = 0; i < axesList.length; i++) {
                axisTickLabels = tickLabels[axesList[i].type];
                widgetThis.chartOptions.axes[axesList[i].type] = {
                    tickOptions : {fontSize: axesList[i].ticksFontSize?axesList[i].ticksFontSize:'10px'},
                    labelOptions: {fontSize: axesList[i].labelFontSize?axesList[i].labelFontSize:'10px'}
                };
                

                if (axesList[i].type === 'xaxis') {
                    var length;
                    if (axisTickLabels) {
                        if (axisTickLabels.ticks && axisTickLabels.labels) {
                            xaxisDataWithLabel = true;
                        }
                    }
                    if (axesList[i].position === 'top') {
                        axesList[i].type = 'x2axis';
                        length = widgetThis.chartOptions.series.length;
                        for ( x = 0; x < length; x++) {
                            widgetThis.chartOptions.series[x].xaxis = 'x2axis';
                        }
                    } else {
                        length = widgetThis.chartOptions.series.length;
                        for ( x = 0; x < length; x++) {
                            widgetThis.chartOptions.series[x].xaxis = 'xaxis';
                        }

                    }
                    widgetThis.chartOptions.axes[axesList[i].type] = {
                        tickOptions : {fontSize: axesList[i].ticksFontSize?axesList[i].ticksFontSize:'10px'},
                        labelOptions: {fontSize: axesList[i].labelFontSize?axesList[i].labelFontSize:'10px'}
                    };

                    if (axesList[i].renderType === 'date') {
                        widgetThis.chartOptions.axes[axesList[i].type].renderer = $.jqplot.DateAxisRenderer;
                        widgetThis.chartOptions.axes[axesList[i].type].rendererType = 'date';
                        widgetThis.chartOptions.axes[axesList[i].type].rendererOptions = {
                            tickRenderer : $.jqplot.CanvasAxisTickRenderer
                        };
                        var axistickrenerer1 = new tiny.charts.axistickrenderer(widgetThis, widgetThis.seriesIdIndexMap, widgetThis.seriesList, widgetThis.axes.axesList);
                        widgetThis.chartOptions.axes[axesList[i].type].rendererOptions.tickRenderer.prototype.draw = axistickrenerer1.CanvasAxisTickRendererDrawCallBack;
                        widgetThis.chartOptions.axes[axesList[i].type].tickOptions.formatString = axesList[i].renderFormat;
                    } else {
                        if (!xaxisDataWithLabel && (!axesList[i].auto || widgetThis.isBarchart)) {
                            widgetThis.chartOptions.axes[axesList[i].type].renderer = $.jqplot.CategoryAxisRenderer;
                            if (widgetThis.isBarchart !== true) {
                                widgetThis.chartOptions.axes[axesList[i].type].renderer.prototype.createTicks = widgetThis._categoryCreatedTicks;
                            }
                            widgetThis.chartOptions.axes[axesList[i].type].renderer.prototype.pack = widgetThis._categoryAxisPack;
                        }
                    }
                }
                //add auto option
                widgetThis.chartOptions.axes[axesList[i].type].autoOption = axesList[i].auto;
                var axistickrenerer = new tiny.charts.axistickrenderer(widgetThis, widgetThis.seriesIdIndexMap, widgetThis.seriesList, widgetThis.axes.axesList);
                if (widgetThis.isDateAxis === true && axesList[i].type.charAt(0) === 'y') {
                    //To make canvas axis renderer for both xaxis and yaxis for
                    // Date Chart, this change is done.
                    widgetThis.chartOptions.axes[axesList[i].type].tickRenderer = $.jqplot.CanvasAxisTickRenderer;
                    widgetThis.chartOptions.axes[axesList[i].type].tickRenderer.prototype.draw = axistickrenerer.CanvasAxisTickRendererDrawCallBack;
                } else {
                    widgetThis.chartOptions.axes[axesList[i].type].tickRenderer = $.jqplot.AxisTickRenderer;
                    widgetThis.chartOptions.axes[axesList[i].type].tickRenderer.prototype.draw = axistickrenerer.AxisTickRendererDrawCallBack;
                }
                widgetThis.chartOptions.axes[axesList[i].type].label = axesList[i].label;
                widgetThis.chartOptions.axes[axesList[i].type].drawBaseline = true;
                widgetThis.chartOptions.axes[axesList[i].type].baselineWidth = 2.2;
                widgetThis.chartOptions.axes[axesList[i].type].baselineColor = 'red';

                if (axesList[i].min !== null && axesList[i].min !== 'undefined' && axesList[i].min !== undefined) {
                    if (throAlways === true && !isNaN(thresoldvalue) && axesList[i].type.charAt(0) === 'y') {
                        if (thresoldvalue <= axesList[i].min) {
                            widgetThis.chartOptions.axes[axesList[i].type].min = thresoldvalue - 1;
                            widgetThis.chartOptions.axes[axesList[i].type].userMin = thresoldvalue - 1;
                        } else {
                            widgetThis.chartOptions.axes[axesList[i].type].min = axesList[i].min;
                            widgetThis.chartOptions.axes[axesList[i].type].userMin = axesList[i].min;
                        }
                    } else {
                        widgetThis.chartOptions.axes[axesList[i].type].min = axesList[i].min;
                        widgetThis.chartOptions.axes[axesList[i].type].userMin = axesList[i].min;
                    }
                }
                if (axesList[i].max !== null && axesList[i].max !== 'undefined' && axesList[i].max !== undefined) {
                    if (throAlways === true && !isNaN(thresoldvalue) && axesList[i].type.charAt(0) === 'y') {
                        if (thresoldvalue > axesList[i].max) {
                            widgetThis.chartOptions.axes[axesList[i].type].max = thresoldvalue;
                            widgetThis.chartOptions.axes[axesList[i].type].userMax = thresoldvalue;
                        } else {
                            widgetThis.chartOptions.axes[axesList[i].type].max = axesList[i].max;
                            widgetThis.chartOptions.axes[axesList[i].type].userMax = axesList[i].max;
                        }
                    } else {
                        widgetThis.chartOptions.axes[axesList[i].type].max = axesList[i].max;
                        widgetThis.chartOptions.axes[axesList[i].type].userMax = axesList[i].max;
                    }
                }
                if (axesList[i].tickInterval !== null && axesList[i].tickInterval !== 'undefined' && axesList[i].tickInterval !== undefined) {
                    widgetThis.chartOptions.axes[axesList[i].type].tickInterval = axesList[i].tickInterval;
                }
                if (axesList[i].unitData !== null && axesList[i].unitData !== 'undefined' && axesList[i].unitData !== undefined) {
                    widgetThis.chartOptions.axes[axesList[i].type].unitData = axesList[i].unitData;
                }
                if (axesList[i].displayLength !== null && axesList[i].displayLength !== 'undefined' && axesList[i].displayLength !== undefined) {
                    var displayLength = parseInt(axesList[i].displayLength);
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.displayLength = displayLength;
                }
                if (axesList[i].fontData !== null && axesList[i].fontData !== 'undefined' && axesList[i].fontData !== undefined) {
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.fontData = axesList[i].fontData;
                }
                if (axesList[i].type.charAt(0) === 'y') {
                    if (axesList[i].decimalPlace !== null && axesList[i].decimalPlace !== 'undefined' && axesList[i].decimalPlace !== undefined) {
                        var defaultDecimalPlaces = parseInt(axesList[i].decimalPlace);
                        widgetThis.chartOptions.axes[axesList[i].type].tickOptions.formatString = '%.' + defaultDecimalPlaces + 'f';
                        widgetThis.chartOptions.axes[axesList[i].type].tickOptions.userFormatString = '%.' + defaultDecimalPlaces + 'f';
                    }
                }
                if (axesList[i].textAngle >= -360 && axesList[i].textAngle <= 360) {
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.angle = axesList[i].textAngle;
                }

                if (!axesList[i].auto)//Dont remove this condition , labels
                // from user will be considered only when auto=false
                {
                    if (axesList[i].type.charAt(0) === 'y' || xaxisDataWithLabel) {
                        if (axisTickLabels) {
                            if (axisTickLabels.ticks) {
                                widgetThis.chartOptions.axes[axesList[i].type].ticks = axisTickLabels.ticks;
                            }
                            if (axisTickLabels.labels) {
                                widgetThis.chartOptions.axes[axesList[i].type].tickOptions.ylabels = axisTickLabels.labels;
                            }
                        }

                    } else {
                        widgetThis.chartOptions.axes[axesList[i].type].ticks = axisTickLabels;
                    }
                }

                var unit = axesList[i].unit;
                if (unit && unit.length > 0) {
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.prefix = unit;
                }
                if (unit && unit.length > 0) {
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.prefixValue = unit;
                }
                widgetThis.chartOptions.axes[axesList[i].type].unitDisplay = axesList[i].unitDisplay;
                widgetThis.chartOptions.axes[axesList[i].type].unitLength = axesList[i].unitLength;
                var ticks = axesList[i].numberTicks;
                if (ticks > 0) {
                    widgetThis.chartOptions.axes[axesList[i].type].orgNumberTicks = ticks;
                    if (!axesList[i].auto || widgetThis.isBarchart) {
                        if (axesList[i].renderType !== 'date' && axesList[i].type.charAt(0) === 'x') {
                            ticks = 2 * ticks + 1;
                        }
                    }
                    widgetThis.chartOptions.axes[axesList[i].type].numberTicks = ticks;
                }
            }
        },

        "_setTipOptions" : function() {
            var widgetThis = this;
            var serList = widgetThis.seriesList.seriesList;

            for (var i = 0; i < serList.length; i++) {
                var tip = serList[i].tips;
                if (tip) {
                    if (!widgetThis.seriesTipMap) {
                        widgetThis.seriesTipMap = {};
                    }
                    widgetThis.seriesTipMap[serList[i].id] = {
                        'tip' : tip,
                        'data' : serList[i].tipData
                    };
                }
            }
            if (widgetThis.seriesTipMap) {
                widgetThis.chartOptions.highlighter = {
                    show : true,
                    tooltipContentEditor : widgetThis._toolTipHandler
                };
            }
        },

        "_toolTipHandler" : function(dataString, seriesIndex, dataIndex, plot) {
            var widgetThis = $(plot.target).widget();
            for (var id in widgetThis.seriesIdIndexMap) {
                var tmpColor = widgetThis.seriesTipMap[id] && widgetThis.seriesTipMap[id].tip && widgetThis.seriesTipMap[id].tip.color ? widgetThis.seriesTipMap[id].tip.color : "#666666";
                var color = $.encoder.encodeForCSS("color", tmpColor, true);
                if (widgetThis.seriesIdIndexMap[id] === seriesIndex && widgetThis.seriesTipMap[id]) {
                    if (widgetThis.seriesTipMap[id].data) {
                        var tipArr = widgetThis.seriesTipMap[id].data;
                        if (tipArr[dataIndex]) {
                            return '<div style="color:' + color + '">' + tipArr[dataIndex] + '</div>';
                        }
                    } else {
                        var seriesListArray = widgetThis.seriesList.seriesList;
                        var tinySeries = seriesListArray[seriesIndex];
                        var orgData = {};
                        if (tinySeries) {
                            orgData = tinySeries.tempData[dataIndex];
                            if (tinySeries.backupTempData[dataIndex]) {
                                //This data is used for realtime charts
                                orgData = tinySeries.backupTempData[dataIndex];
                            }
                        }
                        orgData = $.extend({}, orgData);
                        var dataStrArr = dataString.split("@");
                        orgData['displayX'] = dataStrArr[0];
                        orgData['displayY'] = dataStrArr[1];
                        if ( typeof orgData['x'] === 'undefined') {
                            orgData['x'] = orgData['displayX'];
                        }

                        if ( typeof orgData['y'] === 'undefined') {
                            orgData['y'] = orgData['displayY'];
                        }
                        orgData.seriesId = id;
                        orgData.seriesIndex = seriesIndex;
                        orgData.dataIndex = dataIndex;
                        var tipTemp = "";
                        if (widgetThis.seriesTipMap[id] && widgetThis.seriesTipMap[id].tip && widgetThis.seriesTipMap[id].tip.renderer) {
                            tipTemp = widgetThis.seriesTipMap[id].tip.renderer(orgData);
                        } else {
                            tipTemp = widgetThis.seriesList.seriesList[seriesIndex].xfield + ":" + orgData.x + ", " + widgetThis.seriesList.seriesList[seriesIndex].yfield + ":" + orgData.y;
                        }
                        tipTemp = '<div style="color:' + color + '">' + tipTemp + '</div>';
                        return tipTemp;

                    }
                }
            }
            return '';
        },

        "_parseSeriesRenderers" : function(seriesList) {
            var widgetThis = this;
            if (!seriesList) {
                return;
            }
            var len = seriesList.seriesList.length;
            for (var i = 0; i < len; i++) {
                var series = seriesList.seriesList[i];
                if (series.type === widgetThis.horizontalchart || series.type === widgetThis.barchart) {
                    var BarRenderer = new tiny.charts.barrenderer(widgetThis, widgetThis.seriesIdIndexMap, seriesList);
                    series.options.renderer.prototype.draw = BarRenderer.BarRendererDrawCallBack;
                    if (!series.options.pointLabels) {
                        series.options.pointLabels = {};
                    }
                    var barpointlabel = new tiny.charts.pointlabels(widgetThis, widgetThis.seriesIdIndexMap, seriesList);
                    series.options.pointLabels.setLabels = barpointlabel.BarRendererLabelCallBack;
                }
            }
        },

        "_parseTickLabels" : function() {
            var widgetThis = this;
            var axesListObj = [];
            if (widgetThis.axes != null) {
                axesListObj = widgetThis.axes.axesList;
            }
            var axisLabelMap = {};
            var invalidxfield = widgetThis._checkInValidXField();
            for (var i = 0; i < axesListObj.length; i++) {
                var axisEle = axesListObj[i];
                if (!axisEle.auto && axisEle.axisData && axisEle.field && (axisEle.type.charAt(0) === 'x' || axisEle.type.charAt(0) === 'y' || (widgetThis.isSeriesHorizontal && axisEle.type.charAt(0) === 'y'))) {
                    var axisTicks = [], labels = [];

                    for (var k = 0; k < axisEle.axisData.length; k++) {
                        axisTicks[k] = axisEle.axisData[k][axisEle.field];
                        if (axisEle.labelField !== undefined) {
                            labels[k] = axisEle.axisData[k][axisEle.labelField];
                        }
                    }

                    if (axisEle.type.charAt(0) === 'y') {
                        axisLabelMap[axisEle.type] = {
                            ticks : axisTicks,
                            labels : labels
                        };
                    } else {
                        if (axisTicks.length > 0 && axisTicks.length === labels.length) {
                            axisLabelMap[axisEle.type] = {
                                ticks : axisTicks,
                                labels : labels
                            };
                        } else {
                            axisLabelMap[axisEle.type] = axisTicks;
                        }
                    }

                }
            }
            var list = widgetThis.seriesList.seriesList;

            for (var j = 0; j < list.length; j++) {
                if (axisLabelMap[list[j].xaxis]) {
                    //axis data defined so no need to update
                    continue;
                }
                if (axisLabelMap[list[j].yaxis]) {
                    //axis data defined so no need to update
                    continue;
                }
                var labelArr = list[j].labels;
                //for defect no 9
                if (j > 0) {
                    var lastLabelArr = list[j - 1].labels;
                }
                widgetThis.seriesIdIndexMap[list[j].id] = j;
                var listAxis;
                if (widgetThis.isSeriesHorizontal) {
                    listAxis = list[j].yaxis;
                } else {
                    listAxis = list[j].xaxis;
                }
                if (axisLabelMap[listAxis] && axisLabelMap[listAxis].length > 0) {
                    //for defect no 9
                    if (lastLabelArr.length >= labelArr.length) {
                        continue;
                    }
                }
                if (listAxis && labelArr && labelArr.length > 0) {
                    axisLabelMap[listAxis] = labelArr;
                }
            }
            return axisLabelMap;
        },

        "_parseSeriesData" : function(series) {
            var tempSeriesData = series.tempData;
            //reset all values
            series.data = [];
            //reset all labels
            series.labels = [];
            for (var i = 0; i < tempSeriesData.length; i++) {
                if ((jQuery).isNumeric(tempSeriesData[i][series.yfield])) {
                    {
                        var ydata = tempSeriesData[i][series.yfield];
                        var yconverted = parseFloat(ydata);
                        if (!isNaN(yconverted)) {
                            series.data.push(yconverted);
                        }
                    }
                    {
                        var xdata = tempSeriesData[i][series.xfield];
                        xdata = (( typeof xdata) === 'undefined') ? '' : xdata;
                        series.labels.push(xdata);
                    }
                }
            }
        },

        "_parseData" : function(isMergeData) {
            var widgetThis = this;
            var list = widgetThis.seriesList.seriesList;
            var dataArr = [];
            var autoxaxis = widgetThis._checkAutoXAxis();
            var i, j;
            if (widgetThis.isSeriesHorizontal) {
                for ( i = 0; i < list.length; i++) {
                    var serDataAr = [];
                    var d = list[i].data;
                    for ( j = 0; j < d.length; j++) {
                        serDataAr.push([d[j], j + 1]);
                    }
                    dataArr.push(serDataAr);
                    widgetThis.seriesIdIndexMap[list[i].id] = i;
                }
                return dataArr;
            }
            for ( i = 0; i < list.length; i++) {
                if (list[i].type === widgetThis.piechart) {
                    var serDataArr = [];
                    if (list[i].labels.length > 0) {
                        var dd = list[i].data;
                        for ( j = 0; j < dd.length; j++) {
                            if (list[i].xfield) {
                                if (( typeof list[i].labels[j]) !== 'undefined') {
                                    serDataArr.push([list[i].labels[j], dd[j]]);
                                } else {
                                    serDataArr.push([j + 1, dd[j]]);
                                }
                            } else {
                                serDataArr.push([j + 1, dd[j]]);
                            }
                        }
                    } else {
                        serDataArr = list[i].data;
                    }
                    dataArr.push(serDataArr);
                    widgetThis.seriesIdIndexMap[list[i].id] = i;
                    break;
                }

                if (widgetThis.isDateAxis === true || autoxaxis === true || isMergeData) {
                    dataArr.push(widgetThis._mergeData(list[i].labels, list[i].data));
                } else {
                    dataArr.push(list[i].data);
                }
                widgetThis.seriesIdIndexMap[list[i].id] = i;
            }
            return dataArr;
        },

        "_parseSeriesOptions" : function() {
            var widgetThis = this;
            var list = widgetThis.seriesList.seriesList;
            var lineSeriesList = [];
            var otherSeriesList = [];
            var i;
            var barChartCnt = 0;
            for ( i = 0; i < list.length; i++) {
                if (list[i].type === widgetThis.barchart) {
                    barChartCnt++;
                }
                if (list[i].type === widgetThis.horizontalchart && !widgetThis.isSeriesHorizontal) {
                    widgetThis.isSeriesHorizontal = true;
                }
                if (list[i].type === widgetThis.linechart || list[i].type === widgetThis.areachart) {
                    widgetThis.isareachart = (list[i].type === widgetThis.areachart);
                    lineSeriesList.push(list[i]);
                } else {
                    otherSeriesList.push(list[i]);
                }
            }
            if (lineSeriesList.length > 0 && otherSeriesList.length === 0) {
                widgetThis.islinechart = true;
            } else if (list.length == barChartCnt) {
                widgetThis.isBarchart = true;
            }
            if (lineSeriesList.length > 0 && otherSeriesList.length > 0) {
                list.splice(0, list.length);

                for ( i = 0; i < otherSeriesList.length; i++) {
                    list.push(otherSeriesList[i]);
                }
                for ( i = 0; i < lineSeriesList.length; i++) {
                    list.push(lineSeriesList[i]);
                }
            }

            var seriesOptionsArr = [];
            for ( i = 0; i < list.length; i++) {
                seriesOptionsArr.push(list[i].options);
            }
            return seriesOptionsArr;
        },

        "_createChart" : function(id, chartHTMLElem) {
            var widgetThis = this;
            var options = widgetThis.options;
            widgetThis.id = id;

            //设置数据集
            widgetThis.chartOptions.series = widgetThis._parseSeriesOptions();
            widgetThis.chartOptions.stackSeries = widgetThis.seriesList.stack;
            widgetThis.chartOptions.highlighter = {
                show : true
            };

            //设置图例选项
            widgetThis._setLegendOptionsOnChart(widgetThis.legend, widgetThis.chartOptions);
            if (widgetThis.legend) {
                widgetThis.onUpdateShowSeries = widgetThis.legend.onupdateShowSerie;
            }
            var firstSeriesElement = widgetThis.seriesList.seriesList[0];

            if (!(firstSeriesElement && firstSeriesElement.type === widgetThis.piechart)) {
                widgetThis._parseSeriesRenderers(widgetThis.seriesList);
                widgetThis.chartOptions.seriesOptions = {};
                widgetThis.chartOptions.seriesOptions.seriesList = widgetThis.seriesList;
                if (widgetThis.axes && widgetThis.axes.axesList.length !== 0) {

                    //设置坐标轴选项
                    widgetThis._setAxesOptions();
                }
            }

            widgetThis._setTipOptions();

            widgetThis.element = chartHTMLElem;
            $(widgetThis.element).bind('jqplotAnimateFinish', widgetThis._animationFinish);

            $(widgetThis.element).bind('jqplotRedraw', widgetThis._onReDraw);
            //No data indicator to draw empty chart
            widgetThis.chartOptions.noDataIndicator = {
                show : true,
                indicator : ''
            };

            //No data update for axis
            if (widgetThis._checkSeriesEmpty()) {
                widgetThis._updateAxisEmptySeries();
            }

            if ( typeof widgetThis.width === 'string') {
                widgetThis.width = widgetThis.element.width();
            }
            if ( typeof widgetThis.height === 'string') {
                widgetThis.height = widgetThis.element.height();
            }

            widgetThis.chartOptions.width = widgetThis.width;
            widgetThis.chartOptions.height = widgetThis.height;
            widgetThis.chartOptions.islinechart = widgetThis.islinechart;
            widgetThis.chartOptions.isareachart = widgetThis.isareachart;
            widgetThis.chartOptions.ispiechart = (firstSeriesElement && firstSeriesElement.type === widgetThis.piechart);
            widgetThis.chartOptions.isbar = (widgetThis.isBarchart || widgetThis.isSeriesHorizontal);
            widgetThis.chartOptions.ishorizontalbar = (widgetThis.isSeriesHorizontal);
        },

        "updateSeries" : function(id, data) {
            var widgetThis = this;

            if (widgetThis.oChart == null) {
                return;
            }
            if (!data || (Object.prototype.toString.call(data) != "[object Array]")) {
                return;
            }
            var seriesIndex = widgetThis.seriesIdIndexMap[id];
            var series = widgetThis.seriesList.seriesList[seriesIndex];
            var seriesLength = widgetThis.oChart.series[seriesIndex].data.length;

            var firstSeriesElement = widgetThis.seriesList.seriesList[0];
            var ispiechart = true;
            if (firstSeriesElement && firstSeriesElement.type !== widgetThis.piechart) {
                ispiechart = false;
            }
            var j = 0, resetAx = {};
            if (ispiechart === false && data.length >= 0) {
                /**
                 This condition is added data.length > 0 , because if data is
                 zero then no need to make empty ticks
                 */
                if (seriesLength === data.length) {
                    var xaxisName = 'xaxis';
                    if (!widgetThis.isSeriesHorizontal) {
                        if (series.options && series.options.xaxis) {
                            xaxisName = series.options.xaxis;
                        }
                        widgetThis.oChart.axes[xaxisName].ticks = [];
                    } else {
                        widgetThis.oChart.axes['yaxis'].ticks = [];
                    }
                    for ( j = 0; j < seriesLength; j++) {
                        if (data[j]) {
                            if (widgetThis.isSeriesHorizontal) {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = data[j][series.yfield];
                                if (data[j][series.xfield] || data[j][series.xfield] === 0) {
                                    widgetThis.oChart.axes['yaxis'].ticks.push(data[j][series.xfield]);
                                }

                            } else {
                                var xTemp;
                                if ((data[j][series.xfield] || data[j][series.xfield] === 0)) {
                                    xTemp = data[j][series.xfield];
                                    if (widgetThis.oChart.axes[xaxisName].rendererType === 'date') {
                                        xTemp = new $.jsDate(xTemp).getTime();
                                    } else if (widgetThis.oChart.series[seriesIndex]._type == 'bar' && isNaN(xTemp)) {
                                        xTemp = j + 1;
                                    }
                                } else {
                                    xTemp = j;
                                }
                                if (widgetThis.oChart.axes[xaxisName].autoOption || widgetThis.oChart.axes[xaxisName].rendererType === 'date') {
                                    widgetThis.oChart.series[seriesIndex].data[j][0] = xTemp;
                                }
                                widgetThis.oChart.series[seriesIndex].data[j][1] = data[j][series.yfield];
                                if (!widgetThis.oChart.axes[xaxisName].autoOption && (data[j][series.xfield] || data[j][series.xfield] === 0)) {
                                    widgetThis.oChart.axes[xaxisName].ticks.push(data[j][series.xfield]);
                                }
                            }
                        }

                    }
                } else if (seriesLength > data.length) {
                    var xaxisName = 'xaxis';
                    if (!widgetThis.isSeriesHorizontal) {
                        if (series.options && series.options.xaxis) {
                            xaxisName = series.options.xaxis;
                        }
                        widgetThis.oChart.axes[xaxisName].ticks = [];
                    } else {
                        widgetThis.oChart.axes['yaxis'].ticks = [];
                    }
                    for ( j = 0; j < data.length; j++) {
                        if (data[j]) {
                            if (widgetThis.isSeriesHorizontal) {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = data[j][series.yfield];
                                if (data[j][series.xfield] || data[j][series.xfield] === 0) {
                                    widgetThis.oChart.axes['yaxis'].ticks.push(data[j][series.xfield]);
                                }
                            } else {
                                var xTemp;
                                if ((data[j][series.xfield] || data[j][series.xfield] === 0)) {
                                    xTemp = data[j][series.xfield];
                                    if (widgetThis.oChart.axes[xaxisName].rendererType === 'date') {
                                        xTemp = new $.jsDate(xTemp).getTime();
                                    } else if (widgetThis.oChart.series[seriesIndex]._type == 'bar' && isNaN(xTemp)) {
                                        xTemp = j + 1;
                                    }
                                } else {
                                    xTemp = j;
                                }
                                if (widgetThis.oChart.axes[xaxisName].autoOption || widgetThis.oChart.axes[xaxisName].rendererType === 'date') {
                                    widgetThis.oChart.series[seriesIndex].data[j][0] = xTemp;
                                }
                                widgetThis.oChart.series[seriesIndex].data[j][1] = data[j][series.yfield];
                                if (!widgetThis.oChart.axes[xaxisName].autoOption && (data[j][series.xfield] || data[j][series.xfield] === 0)) {
                                    widgetThis.oChart.axes[xaxisName].ticks.push(data[j][series.xfield]);
                                }
                            }
                        }
                    }
                    widgetThis.oChart.series[seriesIndex].data.splice(data.length, seriesLength);
                } else if (seriesLength < data.length) {
                    var xaxisName = 'xaxis';
                    if (!widgetThis.isSeriesHorizontal) {
                        if (series.options && series.options.xaxis) {
                            xaxisName = series.options.xaxis;
                        }
                        widgetThis.oChart.axes[xaxisName].ticks = [];
                    } else {
                        widgetThis.oChart.axes['yaxis'].ticks = [];
                    }
                    for ( j = 0; j < data.length; j++) {
                        if (data[j]) {
                            if (!widgetThis.oChart.series[seriesIndex].data[j]) {
                                widgetThis.oChart.series[seriesIndex].data[j] = [];
                            }
                            if (widgetThis.isSeriesHorizontal) {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = data[j][series.yfield];
                                widgetThis.oChart.series[seriesIndex].data[j][1] = j + 1;
                                if (data[j][series.xfield] || data[j][series.xfield] === 0) {
                                    widgetThis.oChart.axes['yaxis'].ticks.push(data[j][series.xfield]);
                                }
                            } else {
                                var xTemp;
                                if ((data[j][series.xfield] || data[j][series.xfield] === 0)) {
                                    xTemp = data[j][series.xfield];
                                    if (widgetThis.oChart.axes[xaxisName].rendererType === 'date') {
                                        xTemp = new $.jsDate(xTemp).getTime();
                                    } else if (widgetThis.oChart.series[seriesIndex]._type == 'bar' && isNaN(xTemp)) {
                                        xTemp = j + 1;
                                    }
                                } else {
                                    xTemp = j;
                                }
                                widgetThis.oChart.series[seriesIndex].data[j][0] = xTemp;
                                widgetThis.oChart.series[seriesIndex].data[j][1] = data[j][series.yfield];
                                if (!widgetThis.oChart.axes[xaxisName].autoOption && (data[j][series.xfield] || data[j][series.xfield] === 0)) {
                                    widgetThis.oChart.axes[xaxisName].ticks.push(data[j][series.xfield]);
                                }
                            }
                        }
                    }
                }
                //for bar chart point labels update
                series.tempData = data;
                widgetThis._setSeriesPointLabels(series, series.pointLabels);
            } else {
                //For pie chart data
                series.tempData = data;
                widgetThis._setSeriesPointLabels(series, series.pointLabels);
                widgetThis.oChart.options.seriesPointData = series.pointData;
                if (seriesLength === data.length) {
                    for ( j = 0; j < seriesLength; j++) {
                        if (data[j]) {
                            if (data[j][series.xfield] || data[j][series.xfield] === 0) {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = data[j][series.xfield];
                            } else {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = j + 1;
                            }
                            widgetThis.oChart.series[seriesIndex].data[j][1] = data[j][series.yfield];
                        }
                    }
                } else if (seriesLength > data.length) {
                    for ( j = 0; j < data.length; j++) {
                        if (data[j]) {
                            if (data[j][series.xfield] || data[j][series.xfield] === 0) {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = data[j][series.xfield];
                            } else {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = j + 1;
                            }
                            widgetThis.oChart.series[seriesIndex].data[j][1] = data[j][series.yfield];
                        }
                    }
                    widgetThis.oChart.series[seriesIndex].data.splice(data.length, seriesLength);
                } else if (seriesLength < data.length) {
                    for ( j = 0; j < data.length; j++) {
                        if (data[j]) {
                            if (!widgetThis.oChart.series[seriesIndex].data[j]) {
                                widgetThis.oChart.series[seriesIndex].data[j] = [];
                            }
                            if (data[j][series.xfield] || data[j][series.xfield] === 0) {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = data[j][series.xfield];
                            } else {
                                widgetThis.oChart.series[seriesIndex].data[j][0] = j + 1;
                            }
                            widgetThis.oChart.series[seriesIndex].data[j][1] = data[j][series.yfield];
                        }
                    }
                }
            }

            if (ispiechart === false) {
                var updateflag = true;
                if (updateflag === true && widgetThis.axes !== null) {
                    var axesList = widgetThis.axes.axesList;
                    if (axesList && axesList.length > 0) {
                        for (var i = 0; i < axesList.length; i++) {
                            var type = axesList[i].type;
                            if (widgetThis.chartOptions.axes[type]) {
                                if (axesList[i].isMinMax === false) {
                                    resetAx[type] = widgetThis.oChart.axes[type];
                                }
                            }
                        }
                    }
                }
            } else {
                //pie chart rerender memory optimization
                if (widgetThis.isPieChart && widgetThis.pieRender) {
                    widgetThis.oChart.options.pieOptions.pieExplodeoptions = {
                        index : -1,
                        size : -1
                    };
                }
                widgetThis._reRender();
                series = data = null;
                return;
            }
            widgetThis.rerenderAllSeries(resetAx, series.id, series);
            widgetThis.oChart.grid.draw();
            series = data = null;
        },

        "_legendAdjuster" : function() {
            var widgetThis = this;
            if (widgetThis.legend && widgetThis.legend.isVisiblity) {
                if (!widgetThis.oChart.isLegendEvtsAdded) {
                    widgetThis.oChart.isLegendEvtsAdded = true;
                }

                var spacing = 18;
                if (widgetThis.legend.itemSpacing > 0) {
                    spacing = widgetThis.legend.itemSpacing;
                }
                var tempCols = widgetThis.legend.columns > -1 ? widgetThis.legend.columns : this.oChart.legend.numberColumns;
                var cols = parseInt(tempCols, 10);
                var itemCount = $('#' + widgetThis.id + ' .jqplot-table-legend.jqplot-table-legend-label').length;
                for (var i = 0; i < itemCount; i++) {
                    if ((i + 1) % cols !== 0) {
                        $($(
                        '#' + widgetThis.id +
                        ' .jqplot-table-legend.jqplot-table-legend-label')[i]).css('padding-right', spacing + 'px');
                    }
                }
            }
        },

        "_getXTickCount" : function(axes) {
            for (var i = 0; i < axes.length; i++) {
                if (axes[i].type.charAt(0) === 'x') {
                    return axes[i].numberTicks;
                }
            }
            return 20;
        },

        "_checkSeriesEmpty" : function() {
            var widgetThis = this;
            var len = widgetThis.seriesList.seriesList.length;
            var flag = true;
            //to check all series data is empty
            //For horizontal and vertical bar charts, no need to update min,max
            // and ticks if empty data provided
            for (var i = 0; i < len; i++) {
                var series = widgetThis.seriesList.seriesList[i];
                flag = flag && series.tempData.length === 0;
                if (series.type === widgetThis.barchart || series.type === widgetThis.horizontalchart) {
                    flag = false;
                }
            }
            return flag;
        },

        "_updateAxisEmptySeries" : function() {
            var widgetThis = this;
            var axesList = widgetThis.axes ? widgetThis.axes.axesList : undefined;
            if (!axesList || axesList.length === 0) {
                return;
            }
            for (var i = 0; i < axesList.length; i++) {
                var type = axesList[i].type;
                if (widgetThis.chartOptions.axes[type]) {
                    if (axesList[i].dateaxis === true) {
                        if ((widgetThis.chartOptions.axes[type].min === null) || (widgetThis.chartOptions.axes[type].min === 'undefined')) {
                            widgetThis.chartOptions.axes[type].min = '2012-08-01';
                        }
                        if ((widgetThis.chartOptions.axes[type].max === null) || (widgetThis.chartOptions.axes[type].max === 'undefined')) {
                            widgetThis.chartOptions.axes[type].max = '2012-08-31';
                        }
                        if ((widgetThis.chartOptions.axes[type].numberTicks === null) || (widgetThis.chartOptions.axes[type].numberTicks === 'undefined')) {
                            widgetThis.chartOptions.axes[type].numberTicks = 31;
                            widgetThis.chartOptions.axes[type].orgNumberTicks = 31;
                        }
                        if ((widgetThis.chartOptions.axes[type].tickInterval === null) || (widgetThis.chartOptions.axes[type].tickInterval === 'undefined')) {
                            widgetThis.chartOptions.axes[type].tickInterval = '1 day';
                        } else {
                            widgetThis.chartOptions.axes[type].tickInterval = axesList[i].tickInterval;
                        }
                    } else {
                        if ((widgetThis.chartOptions.axes[type].min === null) || (widgetThis.chartOptions.axes[type].min === 'undefined') || (widgetThis.chartOptions.axes[type].min === undefined)) {
                            widgetThis.chartOptions.axes[type].min = 0;
                        }
                        if ((widgetThis.chartOptions.axes[type].max === null) || (widgetThis.chartOptions.axes[type].max === 'undefined') || (widgetThis.chartOptions.axes[type].max === undefined)) {
                            widgetThis.chartOptions.axes[type].max = 100;
                        }
                        if ((widgetThis.chartOptions.axes[type].numberTicks === null) || (widgetThis.chartOptions.axes[type].numberTicks === 'undefined') || (widgetThis.chartOptions.axes[type].numberTicks === undefined)) {
                            widgetThis.chartOptions.axes[type].numberTicks = 5;
                            widgetThis.chartOptions.axes[type].orgNumberTicks = 5;
                        }
                        if ((widgetThis.chartOptions.axes[type].tickInterval === null) || (widgetThis.chartOptions.axes[type].tickInterval === 'undefined') || (widgetThis.chartOptions.axes[type].tickInterval === undefined)) {
                        } else {
                            widgetThis.chartOptions.axes[type].tickInterval = axesList[i].tickInterval;
                        }
                    }
                    widgetThis.chartOptions.axes[axesList[i].type].show = true;
                }
            }
        },
        "_checkAutoXAxis" : function() {
            var widgetThis = this;
            var check = false;
            if (widgetThis.axes) {
                if (widgetThis.axes.axesList) {
                    var axes = widgetThis.axes.axesList;
                    var axeslen = axes.length;
                    for (var i = 0; i < axeslen; i++) {
                        if (axes[i].auto === true && ((axes[i].type === 'xaxis') || (axes[i].type === 'x2axis'))) {
                            return true;
                        }
                    }
                }
            }
            return check;
        },

        "_mergeData" : function(arr1, arr2) {
            var retData = [];
            var len1 = arr1.length, len2 = arr2.length;
            for (var j = 0, len = Math.max(len1, len2); j < len; j++) {
                retData.push([arr1[j], arr2[j]]);
            }
            return retData;
        },

        "_animationFinish" : function() {
            var widgetThis = this;
            widgetThis.setAttribute('grid', true, true);
        },

        "_onReDraw" : function(evt, chart, width) {
            var widgetThis = this;
            widgetThis.oChart = chart;
        },
        "_tickAngler" : function() {
            var widgetThis = this;
            if (!widgetThis.axes) {
                return;
            }
            var axesList = widgetThis.axes.axesList;
            if (!axesList || axesList.length === 0) {
                return;
            }
            for (var i = 0; i < axesList.length; i++) {
                if (axesList[i].textAngle >= -360 && axesList[i].textAngle <= 360) {
                    var tick = $('#' + widgetThis.id + ' .jqplot-' + axesList[i].type + '-tick');
                    var anGle = axesList[i].textAngle;
                    if (anGle) {
                        if (tick[0] && tick[0].nodeName.toLowerCase() !== 'canvas') {
                            /**
                             For Canvas Tick elements already angle is set. so
                             calling jangle for CanvasElement is not required
                             */
                            tick.each(function(index, elm) {
                                if ($(elm).hasClass('UNIT_CLASS')) {
                                    return;
                                } else {
                                    $(elm).jangle({
                                        degrees : anGle
                                    });
                                }
                            });
                        }
                    }
                    tick = null;
                }
            }
        },
        "_getGridData" : function(data, series) {
            if ( typeof data == 'undefined' || data == null) {
                return;
            }
            var xp = series._xaxis.series_u2p;
            var yp = series._yaxis.series_u2p;
            var gd = [];
            series.renderer._smoothedData = [];
            series.renderer._smoothedPlotData = [];
            series.renderer._hiBandGridData = [];
            series.renderer._lowBandGridData = [];
            series.renderer._hiBandSmoothedData = [];
            series.renderer._lowBandSmoothedData = [];
            var hasNull = false;
            var i = 0;
            for (var i = 0; i < data.length; i++) {
                // if not a line series or if no nulls in data, push the
                // converted point onto the array.
                if (data[i] != null && data[i] != null) {
                    gd.push([xp.call(this._xaxis, data[i]), yp.call(series._yaxis, data[i])]);
                }
            }

            return gd;
        },

        "_createCanvas" : function(thresholdCanvasName) {
            var widgetThis = this;
            var plot = widgetThis.oChart;
            if (plot.plugins.barRenderer) {
                var canvas = plot.plugins.barRenderer.highlightCanvas.createElement(plot._gridPadding, 'line_canvas' + ( thresholdCanvasName ? thresholdCanvasName : '') + widgetThis.id, plot._plotDimensions, plot);
            } else {
                var canvas = plot.plugins.lineRenderer.highlightCanvas.createElement(plot._gridPadding, 'line_canvas' + ( thresholdCanvasName ? '_' + thresholdCanvasName + '_' : '') + widgetThis.id, plot._plotDimensions, plot);
            }
            plot.eventCanvas._elem.before(canvas);
            return canvas[0];
        },

        "_enableHiddenLegends" : function(td) {
            var div = td.find('.jqplot-table-legend-swatch');
            td.removeClass('jqplot-series-hidden');
            td.next('.jqplot-table-legend-label').removeClass('jqplot-series-hidden');
            td.prev('.jqplot-table-legend-swatch').removeClass('jqplot-series-hidden');
            if ($.browser.msie) {
                div.css('filter', td.data('backgrounddata'));
                div.css('background', td.data('backgrounddata'));
            } else {
                div.css('background', td.data('backgrounddata'));
            }
        },
        "_enableAllHiddenSeries" : function() {
            var widgetThis = this;
            if (widgetThis.oChart == null) {
                return;
            }
            var seriesListArray = widgetThis.seriesList.seriesList;
            for (var i = 0; i < seriesListArray.length; i++) {
                if (widgetThis.oChart.series[i]) {
                    var s = widgetThis.oChart.series[i];
                    var td1 = $('#' + widgetThis.id + ' > .jqplot-table-legend.tiny-table-legend tbody tr td#legend__swatch__' + s.seriesid);
                    if (td1.length > 0) {
                        widgetThis._enableHiddenLegends(td1);
                    }
                    s.show = true;
                    if (s.canvas && s.canvas._elem && s.canvas._elem.is(':hidden')) {
                        s.canvas._elem.removeClass('jqplot-series-hidden');
                        if (!widgetThis.oChart.isBigData && s.shadowCanvas && s.shadowCanvas._elem) {
                            s.shadowCanvas._elem.show();
                        }
                        s.canvas._elem.show();
                        s.canvas._elem.nextAll('.jqplot-point-label.jqplot-series-' + s.index).show();
                    }
                    s = null;
                }
            }
        },
        "_reRender" : function(seriesId, onlyDrawSeries) {
            var widgetThis = this;
            if (widgetThis.oChart == null) {
                return;
            }
            if (widgetThis.attrOpts) {
                if ( typeof widgetThis.attrOpts.display !== 'undefined') {
                    if (widgetThis.attrOpts.display) {
                        widgetThis.element.show();
                    } else {
                        widgetThis.element.hide();
                    }
                }
            }
            //if chart is not visible no need to rerender the chart
            if (!widgetThis.oChart.target.is(':visible')) {
                return;
            }

            var seriesListArray = widgetThis.seriesList.seriesList;

            //enable hidden series only in case of linechart.
            if (widgetThis.islinechart === true) {
                widgetThis._enableAllHiddenSeries();
            }
            if (widgetThis.attrOpts) {
                if (widgetThis.attrOpts.height) {
                    widgetThis.element.css('height', widgetThis.attrOpts.height);
                    widgetThis.chartOptions.height = widgetThis.attrOpts.height;
                    widgetThis.oChart.options.height = widgetThis.attrOpts.height;
                }
                if (widgetThis.attrOpts.width) {
                    widgetThis.element.css('width', widgetThis.attrOpts.width);
                    widgetThis.chartOptions.width = widgetThis.attrOpts.width;
                    widgetThis.oChart.options.width = widgetThis.attrOpts.width;
                }
                if ( typeof widgetThis.attrOpts.display !== 'undefined') {
                    if (widgetThis.attrOpts.display) {
                        widgetThis.element.show();
                    } else {
                        widgetThis.element.hide();
                    }
                }
                widgetThis.attrOpts = null;
            }
            var axes = widgetThis.oChart.axes;

            //change if ticks data are changed
            if (widgetThis.oChart.redrawGrid) {
                widgetThis.oChart.redrawGrid = false;
                var tickLabels = widgetThis._parseTickLabels();

                widgetThis._changeTicksData(tickLabels, axes);
            }
            widgetThis.oChart._gridPadding = {
                top : null,
                right : null,
                bottom : null,
                left : null
            };
            if (onlyDrawSeries === true) {
                widgetThis.oChart.drawSeries();
            } else {
                //assign tick last tick data
                widgetThis._setLastTickData(axes);
                widgetThis.oChart.replot();
            }
            widgetThis._legendAdjuster();
            widgetThis._tickAngler();
        },
        "_setLastTickData" : function(axes) {
            var widgetThis = this;
            var oldticks = null, newticks = null, sametick = true;
            if (widgetThis.axes == null || widgetThis.axes.axesList.length <= 0) {
                return sametick;
            }
            //change if ticks data are changed
            //do not change this lines without test with attr('data') for line
            // and date line charts
            for (var name in axes) {
                // Fixed for handling error in case the axes with this name is
                // not defined.
                if (!axes[name].show || typeof widgetThis.chartOptions.axes === 'undefined' || !widgetThis.chartOptions.axes[name]) {
                    continue;
                }
                if (!widgetThis.chartOptions.axes[name].autoOption || widgetThis.isSeriesHorizontal) {
                    if (axes[name]._prevData && axes[name]._prevData.ticks.length) {
                        if (axes[name]._prevData.ticks) {
                            widgetThis.chartOptions.axes[name].ticks = axes[name]._prevData.ticks;
                            widgetThis.oChart.options.axes[name].ticks = axes[name]._prevData.ticks;
                            widgetThis.oChart.axes[name].ticks = axes[name]._prevData.ticks;
                        }
                        if (axes[name]._prevData.ylabels) {
                            widgetThis.chartOptions.axes[name].tickOptions.ylabels = axes[name]._prevData.ylabels;
                            widgetThis.oChart.options.axes[name].tickOptions.ylabels = axes[name]._prevData.ylabels;
                            widgetThis.oChart.axes[name].tickOptions.ylabels = axes[name]._prevData.ylabels;
                        }
                    }
                }
            }
            axes = null;
        },
        "_changeTicksData" : function(tickLabels, axes) {
            var widgetThis = this;
            var oldticks = null, newticks = null, sametick = true;
            if (widgetThis.axes == null || widgetThis.axes.axesList.length <= 0) {
                return sametick;
            }
            //change if ticks data are changed
            //do not change this lines without test with attr('data') for line
            // and date line charts
            for (var name in axes) {
                // Fixed for handling error in case the axes with this name is
                // not defined.
                if (!axes[name].show || typeof widgetThis.chartOptions.axes === 'undefined' || !widgetThis.chartOptions.axes[name]) {
                    continue;
                }
                if (!widgetThis.chartOptions.axes[name].autoOption || widgetThis.isSeriesHorizontal) {
                    var axisTickLabels = tickLabels[name];
                    if (axisTickLabels && axes[name].rendererType !== 'date') {
                        var temptinyAxis;
                        for (var i = 0; i < widgetThis.axes.axesList.length; i++) {
                            if (widgetThis.axes.axesList[i].type === name) {
                                temptinyAxis = widgetThis.axes.axesList[i];
                                break;
                            }
                        }
                        if (!temptinyAxis.auto && temptinyAxis.axisData && $.isArray(temptinyAxis.axisData) && temptinyAxis.getAxisDataField()) {
                            if (axes[name].ticks && axes[name].ticks.length) {
                                oldticks = axes[name].ticks.length;
                                newticks = axisTickLabels.ticks.length;
                                sametick = sametick && (oldticks === newticks);
                            }
                            axes[name]._prevData = {
                                ticks : axes[name].ticks,
                                ylabels : axes[name].tickOptions.ylabels
                            };
                            axes[name].ticks = axisTickLabels.ticks;
                            axes[name].tickOptions.ylabels = axisTickLabels.labels;
                        } else {
                            axes[name].ticks = axisTickLabels;
                        }
                        temptinyAxis = null;
                    }
                    // In case date axis and the data field is used, then use the
                    // same ticks in case of updateData.
                    else {
                        var temptinyAxis;
                        for (var i = 0; i < widgetThis.axes.axesList.length; i++) {
                            if (widgetThis.axes.axesList[i].type === name) {
                                temptinyAxis = widgetThis.axes.axesList[i];
                                break;
                            }
                        }
                        if (!temptinyAxis.auto && temptinyAxis.axisData && $.isArray(temptinyAxis.axisData) && temptinyAxis.getAxisDataField()) {
                            if (axes[name].ticks && axes[name].ticks.length) {
                                oldticks = axes[name].ticks.length;
                                newticks = axisTickLabels.ticks.length;
                                sametick = sametick && (oldticks === newticks);
                            }
                            axes[name]._prevData = {
                                ticks : axes[name].ticks,
                                ylabels : axes[name].tickOptions.ylabels
                            };
                            axes[name].ticks = axisTickLabels.ticks;
                            axes[name].tickOptions.ylabels = axisTickLabels.labels;
                        }
                        temptinyAxis = null;
                    }
                }
            }
            axes = null;
            tickLabels = null;
            return false;
        },

        "getSeries" : function(id) {
            var widgetThis = this;
            var seriesIndex = widgetThis.seriesIdIndexMap[id];
            return widgetThis.seriesList.seriesList[seriesIndex];
        },

        "_checkInValidXField" : function() {
            var widgetThis = this;
            var slist = widgetThis.seriesList.seriesList;
            var xfieldInvalidCount = 0;
            var xfieldValue = null;
            for ( a = 0; a < slist.length; a++) {
                var sser = slist[a];
                if (sser.xfield === null) {
                    xfieldInvalidCount++;
                } else {
                    if (xfieldValue != null) {
                        if (xfieldValue != sser.xfield) {
                            xfieldInvalidCount++;
                            break;
                        }
                    } else {
                        xfieldValue = sser.xfield;
                    }
                }
            }
            return xfieldInvalidCount;
        },

        "_checkXfieldOptions" : function() {
            var widgetThis = this;
            var axesList = widgetThis.axes.axesList;
            var x;
            if (!axesList || axesList.length === 0) {
                return;
            }
            var a, i;
            for ( i = 0; i < axesList.length; i++) {
                var slist = widgetThis.seriesList.seriesList;
                a = 0;
                if (axesList[i].renderType === 'date') {
                    continue;
                }
                var xfieldInvalidCount = widgetThis._checkInValidXField();
                if (axesList[i].auto === false && axesList[i].type.charAt(0) === 'x') {
                    if (xfieldInvalidCount > 0) {
                        if (!axesList[i].axisData || !axesList[i].field) {
                            axesList[i].auto = true;
                        } else {
                            for ( a = 0; a < slist.length; a++) {
                                var sser1 = slist[a];
                                sser1.xfield = null;
                            }
                        }
                    }
                }
                if (xfieldInvalidCount > 0) {
                    if (axesList[i].auto === true && axesList[i].type.charAt(0) === 'x') {
                        for ( a = 0; a < slist.length; a++) {
                            var sser1 = slist[a];
                            sser1.xfield = null;
                            //reset all labels
                            sser1.labels = sser1.templabels;
                        }
                    }
                }
            }
        },
        "_categoryCreatedTicks" : function() {
            var widgetThis = this;
            // we're are operating on an axis here
            var ticks = this._ticks;
            var userTicks = this.ticks;
            var name = this.name;
            // databounds were set on axis initialization.
            var db = this._dataBounds;
            var dim, interval;
            var min, max;
            var pos1, pos2;
            var tt, i, j, skip, l, range, s, count, t, tc, numcats = 0, val, isMerged = false, idx = 0, track = 0, maxVisibleTicks = 0;
            var labels = [];

            if (widgetThis.islinechart) {
                // if we already have ticks, use them.
                if (userTicks.length) {
                    // adjust with blanks if we have groups
                    if (this.groups > 1 && !this._grouped) {
                        l = userTicks.length;
                        skip = parseInt(l / this.groups, 10);
                        count = 0;
                        for ( i = skip; i < l; i += skip) {
                            userTicks.splice(i + count, 0, ' ');
                            count++;
                        }
                        this._grouped = true;
                    }
                    this.min = db.min;
                    this.max = (db.max - 1) + 1.0;
                    if (db.min == db.max) {
                        this.min = 1.0;
                    }
                    range = this.max - this.min;
                    this.numberTicks = 2 * (userTicks.length - 1) + 1;
                    for ( i = 0; i < userTicks.length; i++) {
                        tt = this.min + 2 * i * range / (this.numberTicks - 1);
                        // need a marker before and after the tick
                        t = new this.tickRenderer(this.tickOptions);
                        t.showLabel = false;
                        t.setTick(tt, this.name);
                        this._ticks.push(t);
                        t = null;
                        t = new this.tickRenderer(this.tickOptions);
                        t.label = userTicks[i];
                        t.showMark = false;
                        t.showGridline = false;
                        t.setTick(tt, this.name);
                        this._ticks.push(t);
                    }
                    // now add the last tick at the end
                    tc = new this.tickRenderer(this.tickOptions);
                    tc.showLabel = false;
                    tc.setTick(tt + 1, this.name);
                    tc.showGridline = false;
                    this._ticks.push(tc);
                }

                // we don't have any ticks yet, let's make some!
                else {
                    if (name === 'xaxis' || name === 'x2axis') {
                        dim = this._plotDimensions.width;
                    } else {
                        dim = this._plotDimensions.height;
                    }

                    // if min, max and number of ticks specified, user can't
                    // specify
                    // interval.
                    if (this.min !== null && this.max !== null && this.numberTicks !== null) {
                        this.tickInterval = null;
                    }

                    // if max, min, and interval specified and interval won't
                    // fit,
                    // ignore interval.
                    if (this.min !== null && this.max !== null && this.tickInterval !== null) {
                        if (parseInt((this.max - this.min) / this.tickInterval, 10) !== (this.max - this.min) / this.tickInterval) {
                            this.tickInterval = null;
                        }
                    }

                    min = 0;
                    max = 100;
                    range = max - min;
                    if (this.orgNumberTicks !== undefined) {
                        this.numberTicks = this.orgNumberTicks;
                    } else {
                        this.numberTicks = (this.numberTicks - 1) / 2;
                    }
                    this.tickInterval = range / (this.numberTicks - 1);
                    var sf = $.jqplot.getSignificantFigures(this.tickInterval);
                    // if we have only a whole number, use integer formatting
                    if (sf.digitsLeft >= sf.significantDigits) {
                        this._autoFormatString = '%d';
                    }

                    this.min = min;
                    this.max = max;
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        this.tickOptions = this.tickOptions || {};
                        this.tickOptions.formatString = this._autoFormatString;
                    }

                    for (var i = 0; i < this.numberTicks; i++) {
                        tt = this.min + i * this.tickInterval;
                        t = new this.tickRenderer(this.tickOptions);
                        t.setTick(tt, this.name);
                        this._ticks.push(t);
                        if (i < this.numberTicks - 1) {
                            for (var j = 0; j < this.minorTicks; j++) {
                                tt += this.tickInterval / (this.minorTicks + 1);
                                to = $.extend(true, {}, this.tickOptions, {
                                    name : this.name,
                                    value : tt,
                                    label : '',
                                    isMinorTick : true
                                });
                                t = new this.tickRenderer(to);
                                this._ticks.push(t);
                            }
                        }
                        t = null;
                    }
                }
            } else {
                // if we already have ticks, use them.
                if (userTicks.length) {
                    // adjust with blanks if we have groups
                    if (this.groups > 1 && !this._grouped) {
                        l = userTicks.length;
                        skip = parseInt(l / this.groups, 10);
                        count = 0;
                        for ( i = skip; i < l; i += skip) {
                            userTicks.splice(i + count, 0, ' ');
                            count++;
                        }
                        this._grouped = true;
                    }
                    this.min = 0.5;
                    this.max = userTicks.length + 0.5;
                    range = this.max - this.min;
                    this.numberTicks = 2 * userTicks.length + 1;
                    for ( i = 0; i < userTicks.length; i++) {
                        tt = this.min + 2 * i * range / (this.numberTicks - 1);
                        // need a marker before and after the tick
                        t = new this.tickRenderer(this.tickOptions);
                        t.showLabel = false;
                        t.setTick(tt, this.name);
                        this._ticks.push(t);
                        t = new this.tickRenderer(this.tickOptions);
                        t.label = userTicks[i];
                        t.showMark = false;
                        t.showGridline = false;
                        t.setTick(tt + 0.5, this.name);
                        this._ticks.push(t);
                    }
                    // now add the last tick at the end
                    tc = new this.tickRenderer(this.tickOptions);
                    tc.showLabel = false;
                    tc.setTick(tt + 1, this.name);
                    this._ticks.push(tc);
                } else if (userTicks.length === 0) {
                    //empty chart ticks creation for barchart
                    this.min = 1.0;
                    this.max = 2.0;
                    range = this.max - this.min;
                    this.numberTicks = 2;
                    for ( i = 0; i < 1; i++) {
                        tt = this.min;
                        // need a marker before and after the tick
                        t = new this.tickRenderer(this.tickOptions);
                        t.showLabel = false;
                        t.setTick(tt, this.name);
                        this._ticks.push(t);
                        t = null;
                        t = new this.tickRenderer(this.tickOptions);
                        t.showLabel = false;
                        t.showMark = false;
                        t.showGridline = false;
                        t.setTick(tt, this.name);
                        this._ticks.push(t);
                    }
                    // now add the last tick at the end
                    tc = new this.tickRenderer(this.tickOptions);
                    tc.showLabel = false;
                    tc.setTick(tt + 1, this.name);
                    this._ticks.push(tc);
                }

                // we don't have any ticks yet, let's make some!
                else {
                    if (name === 'xaxis' || name === 'x2axis') {
                        dim = this._plotDimensions.width;
                    } else {
                        dim = this._plotDimensions.height;
                    }

                    // if min, max and number of ticks specified, user can't
                    // specify
                    // interval.
                    if (this.min !== null && this.max !== null && this.numberTicks !== null) {
                        this.tickInterval = null;
                    }

                    // if max, min, and interval specified and interval won't
                    // fit,
                    // ignore interval.
                    if (this.min !== null && this.max !== null && this.tickInterval !== null) {
                        if (parseInt((this.max - this.min) / this.tickInterval, 10) !== (this.max - this.min) / this.tickInterval) {
                            this.tickInterval = null;
                        }
                    }

                    // find out how many categories are in the lines and
                    // collect
                    // labels
                    labels = [];
                    numcats = 0;
                    min = 0.5;
                    isMerged = false;
                    for ( i = 0; i < this._series.length; i++) {
                        s = this._series[i];
                        for ( j = 0; j < s.data.length; j++) {
                            if (this.name === 'xaxis' || this.name === 'x2axis') {
                                val = s.data[j][0];
                            } else {
                                val = s.data[j][1];
                            }
                            if ($.inArray(val, labels) === -1) {
                                isMerged = true;
                                numcats += 1;
                                labels.push(val);
                            }
                        }
                    }

                    if (isMerged && this.sortMergedLabels) {
                        labels.sort(function(a, b) {
                            return a - b;
                        });
                    }

                    // keep a reference to these tick labels to use for
                    // redrawing
                    // plot (see bug #57)
                    this.ticks = labels;

                    // now bin the data values to the right lables.
                    for ( i = 0; i < this._series.length; i++) {
                        s = this._series[i];
                        for ( j = 0; j < s.data.length; j++) {
                            if (this.name === 'xaxis' || this.name === 'x2axis') {
                                val = s.data[j][0];
                            } else {
                                val = s.data[j][1];
                            }
                            // for category axis, force the values into
                            // category
                            // bins.
                            // we should have the value in the label array
                            // now.
                            idx = $.inArray(val, labels) + 1;
                            if (this.name === 'xaxis' || this.name === 'x2axis') {
                                s.data[j][0] = idx;
                            } else {
                                s.data[j][1] = idx;
                            }
                        }
                    }

                    // adjust with blanks if we have groups
                    if (this.groups > 1 && !this._grouped) {
                        l = labels.length;
                        skip = parseInt(l / this.groups, 10);
                        count = 0;
                        for ( i = skip; i < l; i += skip + 1) {
                            labels[i] = ' ';
                        }
                        this._grouped = true;
                    }

                    max = numcats + 0.5;
                    if (this.numberTicks === null) {
                        this.numberTicks = 2 * numcats + 1;
                    }

                    range = max - min;
                    this.min = min;
                    this.max = max;
                    track = 0;

                    // todo: adjust this so more ticks displayed.
                    maxVisibleTicks = parseInt(3 + dim / 10, 10);
                    skip = parseInt(numcats / maxVisibleTicks, 10);

                    if (this.tickInterval === null) {

                        this.tickInterval = range / (this.numberTicks - 1);

                    }
                    // if tickInterval is specified, we will ignore any
                    // computed
                    // maximum.
                    for ( i = 0; i < this.numberTicks; i++) {
                        tt = this.min + i * this.tickInterval;
                        t = new this.tickRenderer(this.tickOptions);
                        // if even tick, it isn't a category, it's a divider
                        if (i / 2 === parseInt(i / 2, 10)) {
                            t.showLabel = false;
                            t.showMark = true;
                        } else {
                            if (skip > 0 && track < skip) {
                                t.showLabel = false;
                                track += 1;
                            } else {
                                t.showLabel = true;
                                track = 0;
                            }
                            t.label = t.formatter(t.formatString, labels[(i - 1) / 2]);
                            t.showMark = false;
                            t.showGridline = false;
                        }
                        t.setTick(tt, this.name);
                        this._ticks.push(t);
                    }
                }
            }

        },

        // called with scope of axis
        "_categoryAxisPack" : function(pos, offsets) {
            var widgetThis = this;
            var ticks = this._ticks;
            var max = this.max;
            var min = this.min;
            var offmax = offsets.max;
            var offmin = offsets.min;
            var lshow = (this._label === null) ? false : this._label.show;
            var i, j, step, val, tm, mid = 0, count = 0, poss, shim, temp, labeledge = [];
            for (var p in pos) {
                this._elem.css(p, pos[p]);
            }
            this._offsets = offsets;
            // pixellength will be + for x axes and - for y axes becasue pixels
            // always measured from top left.
            var pixellength = offmax - offmin;
            var unitlength = max - min;

            // point to unit and unit to point conversions references to Plot DOM
            // element top left corner.
            this.p2u = function(p) {
                return (p - offmin) * unitlength / pixellength + min;
            };

            this.u2p = function(u) {
                return (u - min) * pixellength / unitlength + offmin;
            };

            if (this.name === 'xaxis' || this.name === 'x2axis') {
                this.series_u2p = function(u) {
                    return (u - min) * pixellength / unitlength;
                };
                this.series_p2u = function(p) {
                    return p * unitlength / pixellength + min;
                };
            } else {
                this.series_u2p = function(u) {
                    return (u - max) * pixellength / unitlength;
                };
                this.series_p2u = function(p) {
                    return p * unitlength / pixellength + max;
                };
            }

            if (this.show) {
                if (this.name === 'xaxis' || this.name === 'x2axis') {
                    for ( i = 0; i < ticks.length; i++) {
                        t = ticks[i];
                        if (t.show && t.showLabel) {
                            if (t.constructor === $.jqplot.CanvasAxisTickRenderer && t.angle) {
                                // will need to adjust auto positioning based on
                                // which axis this is.
                                temp = (this.name === 'xaxis') ? 1 : -1;
                                switch (t.labelPosition) {
                                    case 'auto':
                                        // position at end
                                        if (temp * t.angle < 0) {
                                            shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                        }
                                        // position at start
                                        else {
                                            shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                        }
                                        break;
                                    case 'end':
                                        shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                        break;
                                    case 'start':
                                        shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                        break;
                                    case 'middle':
                                        shim = -t.getWidth() / 2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                        break;
                                    default:
                                        shim = -t.getWidth() / 2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                        break;
                                }
                            } else {
                                shim = -t.getWidth() / 2;
                            }
                            if (widgetThis.islinechart) {
                                var isXFieldDefined = true;
                                if (isXFieldDefined) {
                                    val = this.u2p(t.value) + shim + 'px';
                                    t._elem.css('left', val);
                                    t.pack();
                                } else {
                                    val = this.u2p(t.value - 0.5) + shim + 'px';
                                    t._elem.css('left', val);
                                    t.pack();
                                }

                            } else {
                                val = this.u2p(t.value) + shim + 'px';
                                t._elem.css('left', val);
                                t.pack();
                            }
                        }
                    }

                    labeledge = ['bottom', 0];
                    if (lshow) {
                        var w = this._label._elem.outerWidth(true);
                        this._label._elem.css('left', offmin + pixellength / 2 - w / 2 + 'px');
                        if (this.name === 'xaxis') {
                            this._label._elem.css('bottom', '0px');
                            labeledge = ['bottom', this._label._elem.outerHeight(true)];
                        } else {
                            this._label._elem.css('top', '0px');
                            labeledge = ['top', this._label._elem.outerHeight(true)];
                        }
                        this._label.pack();
                    }

                    // draw the group labels
                    step = parseInt(this._ticks.length / this.groups, 10);
                    for ( i = 0; i < this._groupLabels.length; i++) {
                        mid = 0;
                        count = 0;
                        for ( j = i * step; j <= (i + 1) * step; j++) {
                            if (this._ticks[j]._elem && this._ticks[j].label !== " ") {
                                t = this._ticks[j]._elem;
                                poss = t.position();
                                mid += poss.left + t.outerWidth(true) / 2;
                                count++;
                            }
                        }
                        mid = mid / count;
                        this._groupLabels[i].css({
                            'left' : (mid - this._groupLabels[i].outerWidth(true) / 2)
                        });
                        this._groupLabels[i].css(labeledge[0], labeledge[1]);
                    }
                } else {
                    for ( i = 0; i < ticks.length; i++) {
                        t = ticks[i];
                        if (t.show && t.showLabel) {
                            if (t.constructor === $.jqplot.CanvasAxisTickRenderer && t.angle) {
                                // will need to adjust auto positioning based on
                                // which axis this is.
                                temp = (this.name === 'yaxis') ? 1 : -1;
                                switch (t.labelPosition) {
                                    case 'auto':
                                    // position at end
                                    case 'end':
                                        if (temp * t.angle < 0) {
                                            shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                        } else {
                                            shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                        }
                                        break;
                                    case 'start':
                                        if (t.angle > 0) {
                                            shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                        } else {
                                            shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                        }
                                        break;
                                    case 'middle':
                                        shim = -t.getHeight() / 2;
                                        break;
                                    default:
                                        shim = -t.getHeight() / 2;
                                        break;
                                }
                            } else {
                                shim = -t.getHeight() / 2;
                            }

                            val = this.u2p(t.value) + shim + 'px';
                            t._elem.css('top', val);
                            t.pack();

                            var topvalue = this.u2p(t.value) + shim;
                            var widvalue = t._elem.width();
                            var hgtvalue = t._elem.height();

                            //Unit element top and left fix
                            if (this.name === 'y2axis') {
                                var tempt = this._unitelm;
                                if (tempt) {
                                    tempt._elem.css('top', val);
                                    tempt._elem.css('left', (widvalue + 5) + 'px');
                                    tempt.pack();
                                    if (this.unitDisplay === false) {
                                        tempt._elem.hide();
                                    }
                                }
                            } else if (this.name === 'yaxis') {
                                var tempt = this._unitelm;
                                if (tempt) {
                                    tempt._elem.css('top', val);
                                    tempt._elem.css('left', (-((tempt._elem.width()) - 10)) + 'px');
                                    tempt.pack();
                                    if (this.unitDisplay === false) {
                                        tempt._elem.hide();
                                    }
                                }
                            }
                        }
                    }

                    labeledge = ['left', 0];
                    if (lshow) {
                        var h = this._label._elem.outerHeight(true);
                        this._label._elem.css('top', offmax - pixellength / 2 - h / 2 + 'px');
                        if (this.name === 'yaxis') {
                            this._label._elem.css('left', '0px');
                            labeledge = ['left', this._label._elem.outerWidth(true)];
                        } else {
                            this._label._elem.css('right', '0px');
                            labeledge = ['right', this._label._elem.outerWidth(true)];
                        }
                        this._label.pack();
                    }

                    // draw the group labels, position top here, do left after
                    // label position.
                    step = parseInt(this._ticks.length / this.groups, 10);
                    for ( i = 0; i < this._groupLabels.length; i++) {
                        mid = 0;
                        count = 0;
                        for ( j = i * step; j <= (i + 1) * step; j++) {
                            if (this._ticks[j]._elem && this._ticks[j].label !== " ") {
                                t = this._ticks[j]._elem;
                                poss = t.position();
                                mid += poss.top + t.outerHeight() / 2;
                                count++;
                            }
                        }
                        mid = mid / count;
                        this._groupLabels[i].css({
                            'top' : mid - this._groupLabels[i].outerHeight() / 2
                        });
                        this._groupLabels[i].css(labeledge[0], labeledge[1]);
                    }
                }
            }
        },

        "rerenderAllSeries" : function(resetAxes, seriesId, seriesRef) {
            var widgetThis = this;
            // rerender All series without rendering entire chart.
            if (widgetThis.oChart == null) {
                return;
            }
            //if chart is not visible no need to rerender the chart
            if (!widgetThis.oChart.target.is(':visible')) {
                return;
            }

            //enable hidden series only in case of linechart.
            if (widgetThis.islinechart === true && widgetThis.onUpdateShowSeries) {
                widgetThis._enableAllHiddenSeries();
            }
            var seriesListArray = widgetThis.seriesList.seriesList;
            if (seriesListArray.length === 0) {
                return;
            }
            var plot = widgetThis.oChart;
            if (plot === null) {
                return;
            }
            //clear dotted line and highlighting canvas
            if (widgetThis.canvasElement && widgetThis.canvasElement.getContext) {
                var ctx = widgetThis.canvasElement.getContext('2d');
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx = null;
            }
            var hl = plot.plugins.highlighter;
            if (hl) {
                if (hl.highlightCanvas) {
                    var ctx = hl.highlightCanvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx = null;
                }
            }

            var seriesList = plot.series;
            var firstSeriesElement = seriesListArray[0];
            var ispiechart = true;
            if (firstSeriesElement && firstSeriesElement.type !== widgetThis.piechart) {
                ispiechart = false;
            }

            var len = seriesList.length;
            if (len > 0) {
                plot.options.isBigData = len * seriesList[0].data.length > plot.LARGE_DATA_SIZE && $.jqplot.use_excanvas;
            }
            if (seriesRef) {
                widgetThis._parseSeriesData(seriesRef);
            }
            var allseriesdataLength = 0, twopoints = true;
            for (var i = 0; i < len; i++) {
                plot.populatePlotData(seriesList[i], i);
                allseriesdataLength = allseriesdataLength + (seriesList[i].data.length);
                twopoints = twopoints && seriesList[i].data.length > 1;
            }

            // reset axes and their ticks. Must be done for all of the axes.
            if (ispiechart === false) {
                var tickLabels = widgetThis._parseTickLabels();
                var axes = plot.axes;
                var elem = null;
                var axisfound = 0;
                for (var axisKey in resetAxes) {
                    axisfound++;
                }
                var sametick = widgetThis._changeTicksData(tickLabels, axes);
                for (var name in axes) {
                    // Fixed for handling error in case the axes with this name
                    // is not defined.
                    if (!axes[name].show || typeof widgetThis.chartOptions.axes === 'undefined' || !widgetThis.chartOptions.axes[name]) {
                        continue;
                    }
                    if (widgetThis.islinechart && allseriesdataLength === 0 && (axes[name]._min == axes[name].min) && (axes[name]._max == axes[name].max)) {
                        // if all series data length is zero, then no need to
                        // reset the axes
                        // This line need to be executed only in case of line
                        // chart; not needed for others
                        // because all bar chart has empty sereis data, then no
                        // need to retain all grids and ticks
                        continue;
                    }

                    axes[name].isBigData = plot.options.isBigData;

                    if (resetAxes && resetAxes[name] && axisfound > 0) {
                        var dataAxisChar0 = 'y';
                        // CHeck if the data is plotted in x axis or y axis.
                        if (widgetThis.isSeriesHorizontal !== undefined && widgetThis.isSeriesHorizontal === true) {
                            dataAxisChar0 = 'x';
                        }
                        if (widgetThis.chartOptions.axes[name].autoOption === true && widgetThis.chartOptions.axes[name].rendererType !== 'date' && name.charAt(0) !== dataAxisChar0) {
                            if (widgetThis.chartOptions.axes[name].max !== undefined) {
                                axes[name].max = widgetThis.chartOptions.axes[name].max;
                            }
                            if (widgetThis.chartOptions.axes[name].min !== undefined) {
                                axes[name].min = widgetThis.chartOptions.axes[name].min;
                            }
                            var resetObject = {
                                numberTicks : widgetThis.chartOptions.axes[name].numberTicks
                            };
                            if (widgetThis.chartOptions.axes[name].userMin !== undefined) {
                                resetObject.min = widgetThis.chartOptions.axes[name].userMin;
                                axes[name].tickInterval = null;
                            }
                            if (widgetThis.chartOptions.axes[name].userMax !== undefined) {
                                resetObject.max = widgetThis.chartOptions.axes[name].userMax;
                                axes[name].tickInterval = null;
                            }

                            axes[name].resetScale(resetObject);
                            resetObject = null;
                            plot.createAxisTicks(axes[name], true);
                        } else {
                            axes[name]._min = axes[name].min;
                            axes[name]._max = axes[name].max;
                            var resetObject = {
                                numberTicks : widgetThis.chartOptions.axes[name].numberTicks
                            };
                            if (widgetThis.chartOptions.axes[name].userMin !== undefined) {
                                resetObject.min = widgetThis.chartOptions.axes[name].userMin;
                                axes[name].tickInterval = null;
                            }
                            if (widgetThis.chartOptions.axes[name].userMax !== undefined) {
                                resetObject.max = widgetThis.chartOptions.axes[name].userMax;
                                axes[name].tickInterval = null;
                            }

                            axes[name].resetScale(resetObject);
                            resetObject = null;
                            plot.createAxisTicks(axes[name], true);
                        }
                    } else {
                        if (axisfound === 0 || widgetThis.isSeriesHorizontal) {
                            var dataAxisChar0 = 'y';
                            if (widgetThis.isSeriesHorizontal !== undefined && widgetThis.isSeriesHorizontal === true) {
                                dataAxisChar0 = 'x';
                            }
                            if (widgetThis.chartOptions.axes[name].autoOption === true && widgetThis.chartOptions.axes[name].rendererType !== 'date' && name.charAt(0) !== dataAxisChar0) {
                                if (widgetThis.chartOptions.axes[name].max !== undefined) {
                                    axes[name].max = widgetThis.chartOptions.axes[name].max;
                                }
                                if (widgetThis.chartOptions.axes[name].min !== undefined) {
                                    axes[name].min = widgetThis.chartOptions.axes[name].min;
                                }
                                var resetObject = {
                                    numberTicks : widgetThis.chartOptions.axes[name].numberTicks
                                };
                                if (widgetThis.chartOptions.axes[name].userMin !== undefined) {
                                    resetObject.min = widgetThis.chartOptions.axes[name].userMin;
                                    axes[name].tickInterval = null;
                                }
                                if (widgetThis.chartOptions.axes[name].userMax !== undefined) {
                                    resetObject.max = widgetThis.chartOptions.axes[name].userMax;
                                    axes[name].tickInterval = null;
                                }
                                axes[name].resetScale(resetObject);
                                resetObject = null;
                                plot.createAxisTicks(axes[name], true);
                            } else {
                                var modifyTick = true, allvaluesame = true, axistickdata = true;
                                if (axes[name]._prevData) {
                                    for (var k = 0; k < axes[name]._prevData.ticks.length; k++) {
                                        allvaluesame = allvaluesame && axes[name]._prevData.ticks[k] === axes[name].ticks[k];
                                    }
                                    for (var k = 0; k < axes[name]._prevData.ylabels.length; k++) {
                                        allvaluesame = allvaluesame && axes[name]._prevData.ylabels[k] === axes[name].tickOptions.ylabels[k];
                                    }
                                    if (allvaluesame) {
                                        if (axes[name]._prevData.ticks.length !== axes[name].ticks.length || axes[name]._prevData.ylabels.length !== axes[name].tickOptions.ylabels.length) {
                                            allvaluesame = false;
                                        }
                                    }
                                    axistickdata = allvaluesame;
                                } else {
                                    allvaluesame = false;
                                }

                                if (modifyTick) {
                                    if (allvaluesame) {
                                        continue;
                                    }
                                    var resetObject = {
                                        numberTicks : widgetThis.chartOptions.axes[name].numberTicks
                                    };
                                    if (widgetThis.chartOptions.axes[name].userMin !== undefined) {
                                        resetObject.min = widgetThis.chartOptions.axes[name].userMin;
                                        axes[name].tickInterval = null;
                                    }
                                    if (widgetThis.chartOptions.axes[name].userMax !== undefined) {
                                        resetObject.max = widgetThis.chartOptions.axes[name].userMax;
                                        axes[name].tickInterval = null;
                                    }

                                    axes[name].resetScale(resetObject);
                                    resetObject = null;

                                    axes[name]._min = axes[name].min;
                                    axes[name]._max = axes[name].max;
                                    plot.createAxisTicks(axes[name], true);
                                }
                            }
                        }
                    }
                    //common part moved from above code
                    if (axes[name].showLabel === true && axes[name].label) {
                        axes[name]._label.label = widgetThis.oChart.axes[name].label;
                        elem = axes[name]._label.draw();
                        elem.appendTo(axes[name]._elem);
                        elem = null;

                    }
                }
                // redraw the series
                plot.packAllAxes(this);
            }

            if (widgetThis.islinechart === true && plot.redrawGrid) {
                plot.redrawGrid = false;
                //check old length and new length of axis data. if it differ then
                // call grid.draw API
                if (!sametick) {
                    widgetThis.oChart.grid.draw();
                }
            }
            //Data removal should happen after change of axis ticks
            //remove data for all series if data is less than xmin
            var serlen = seriesListArray.length;
            for (var i = 0; i < serlen; i++) {
                var eser = seriesListArray[i], ser = widgetThis.oChart.series[i];
                widgetThis._removeOldDataFromSource(ser, widgetThis.oChart.axes[ser.xaxis], eser);
                eser = ser = null;
            }
            //Sort data is added
            plot.sortAllSeriesData();
            plot.drawSeries();
            widgetThis._tickAngler();

            if (widgetThis.islinechart === true && plot.autoTooltip && plot.lastNeighbour && hl) {
                var lastNeighbour = plot.lastNeighbour;
                var lastGridpos = plot.lastGridpos, autotooltip = true;
                var nearestpoint = $.jqplot.Highlighter.nearestDataPoint(lastGridpos, plot, autotooltip, lastNeighbour.seriesIndex);
                if (nearestpoint && nearestpoint.gridData) {
                    hl.draw(plot, nearestpoint);
                    $.jqplot.Highlighter.drawDashLine(plot, nearestpoint.gridData[0], nearestpoint, nearestpoint, lastGridpos, autotooltip);
                    hl.fnShowTooltip(plot, plot.series[nearestpoint.seriesIndex], nearestpoint);
                }
                nearestpoint = null;
                lastGridpos = null;
                lastNeighbour = null;
                plot.autoTooltip = false;
            }
            hl = null;
        },

        "_removeOldDataFromSource" : function(series, xAxis, tinySer) {
            if (series.data.length > 0) {
                var tempSerData = [], tempSerBackupData = [];
                var min = xAxis.min || xAxis._dataBounds.min;
                for (var op = 0; op < series.data.length; op++) {
                    if (series.data[op][0] >= min) {
                        tempSerData.push(series.data[op]);
                        tempSerBackupData.push(tinySer.backupTempData[op]);
                    }
                }
                tinySer.backupTempData = [];
                for (var j = 0; j < tempSerBackupData.length; j++) {
                    tinySer.backupTempData.push(tempSerBackupData[j]);
                }
                series.data = tempSerData;
                tempSerData = null;
                tempSerBackupData = null;
            }
        },
        "_seriesOption" : function(series, key, value) {
            var option = {};
            if (_.isString(key)) {

                if (_.isUndefined(value)) {
                    return series[key] === undefined ? null : this.options[key];
                }
                options[key] = value;

            } else if (_.isObject(key)) {
                options = key;
            } else {
                return;
            }
        }
    });

    return Streamingchart;

});
