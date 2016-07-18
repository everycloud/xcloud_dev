define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Streamingchart", "tiny-lib/jqPlot", "tiny-lib/underscore", "tiny-common/util"], function(angular, $, Class, Streamingchart, jqPlot, _, util) {
    var DEFAULT_CONFIG = {

        "template" : '<div class="tiny-barchart"></div>'

    };

    var Barchart = Streamingchart.extend({

        "init" : function(options) {
            var widgetThis = this;
            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        "_setChartType" : function(series, type) {
            var widgetThis = this;
            series.type = type === widgetThis.barchart || type === widgetThis.horizontalchart ? type : widgetThis.barchart;
            series.options.renderer = $.jqplot.BarRenderer;
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
            series.options.shadow = false;
        },
        "_setAxesOptions" : function() {
            var widgetThis = this;
            if (widgetThis.axes) {
                if (widgetThis.isSeriesHorizontal) {
                    widgetThis._setHorizontalAxesOptions();
                } else {
                    widgetThis._setVerticalAxesOptions();
                }
                widgetThis.xAxisTicks = widgetThis._getXTickCount(widgetThis.axes.axesList);
            } else if (widgetThis.isSeriesHorizontal) {
                if (!widgetThis.chartOptions.axes) {
                    widgetThis.chartOptions.axes = {
                        yaxis : {}
                    };
                }
                widgetThis.chartOptions.axes['yaxis'].renderer = $.jqplot.CategoryAxisRenderer;
                widgetThis.chartOptions.axes['yaxis'].renderer.prototype.createTicks = widgetThis._categoryCreatedTicks;
                widgetThis.chartOptions.axes['yaxis'].renderer.prototype.pack = widgetThis._categoryAxisPack;
                var axistickrenerer = new tiny.charts.axistickrenderer(widgetThis, widgetThis.seriesIdIndexMap, widgetThis.seriesList, widgetThis.axes.axesList);
                widgetThis.chartOptions.axes['yaxis'].tickRenderer = $.jqplot.AxisTickRenderer;
                widgetThis.chartOptions.axes['yaxis'].tickRenderer.prototype.draw = axistickrenerer.AxisTickRendererDrawCallBack;
            }
        },
        "_setHorizontalAxesOptions" : function() {
            var widgetThis = this;
            var tickLabels = widgetThis._parseTickLabels();
            var axesList = widgetThis.axes.axesList;
            if (!axesList || axesList.length === 0) {
                if (!widgetThis.chartOptions.axes) {
                    widgetThis.chartOptions.axes = {
                        yaxis : {}
                    };
                }
                widgetThis.chartOptions.axes['yaxis'].renderer = $.jqplot.CategoryAxisRenderer;
                widgetThis.chartOptions.axes['yaxis'].renderer.prototype.createTicks = widgetThis._categoryCreatedTicks;
                widgetThis.chartOptions.axes['yaxis'].renderer.prototype.pack = widgetThis._categoryAxisPack;
                var axistickrenerer = new tiny.charts.axistickrenderer(widgetThis, widgetThis.seriesIdIndexMap, widgetThis.seriesList, widgetThis.axes.axesList);
                widgetThis.chartOptions.axes['yaxis'].tickRenderer = $.jqplot.AxisTickRenderer;
                widgetThis.chartOptions.axes['yaxis'].tickRenderer.prototype.draw = axistickrenerer.AxisTickRendererDrawCallBack;
                return;
            }
            var isxaxisFound = false;
            var isyaxisFound = false;
            var axesElToRemove = [];
            var axesElToRetain = [];
            var xAxisCount = 0;
            var isXPositioned = false;
            var i;
            var x;
            for ( i = 0; i < axesList.length; i++) {
                var axisEl = axesList[i];
                if (axisEl.type === 'yaxis') {
                    if (!isyaxisFound) {
                        isyaxisFound = true;
                        axesElToRetain.push(axisEl);
                    } else {
                        axesElToRemove.push(i);
                    }
                } else if (axisEl.type === 'xaxis' && xAxisCount < 2) {
                    if (xAxisCount >= 2 || isXPositioned) {
                        axesElToRemove.push(i);
                        continue;
                    }
                    if (axesList[i].position === 'top' && !isxaxisFound) {
                        isXPositioned = true;
                    }
                    if (isXPositioned) {
                        var xaxisName = 'x' + (xAxisCount + 2) + 'axis';
                        axisEl.setType(xaxisName);
                    } else if (isxaxisFound) {
                        axisEl.setType('x' + (xAxisCount + 1) + 'axis');
                    }
                    axesElToRetain.push(axisEl);
                    isxaxisFound = true;
                    xAxisCount++;
                } else {
                    axesElToRemove.push(i);
                }
            }

            axesList.splice(0, axesList.length);
            for (var k = 0; k < axesElToRetain.length; k++) {
                axesList.push(axesElToRetain[k]);
            }

            if (isXPositioned) {
                var seriesLength = widgetThis.chartOptions.series.length;
                for ( x = 0; x < seriesLength; x++) {
                    widgetThis.chartOptions.series[x].xaxis = 'x2axis';
                }
            }
            widgetThis.chartOptions.axes = {};
            var axisTickLabels;
            for ( i = 0; i < axesList.length; i++) {
                axisTickLabels = tickLabels[axesList[i].type];
                widgetThis.chartOptions.axes[axesList[i].type] = {
                    tickOptions : {}
                };
                if (axesList[i].type === 'yaxis') {
                    var length;
                    if (axesList[i].position === 'right') {
                        axesList[i].type = 'y2axis';
                        length = widgetThis.chartOptions.series.length;
                        for ( x = 0; x < length; x++) {
                            widgetThis.chartOptions.series[x].yaxis = 'y2axis';
                        }
                    } else {
                        length = widgetThis.chartOptions.series.length;
                        for ( x = 0; x < length; x++) {
                            widgetThis.chartOptions.series[x].yaxis = 'yaxis';
                        }
                    }
                    widgetThis.chartOptions.axes[axesList[i].type] = {
                        tickOptions : {}
                    };

                    widgetThis.chartOptions.axes[axesList[i].type].renderer = $.jqplot.CategoryAxisRenderer;
                    widgetThis.chartOptions.axes[axesList[i].type].renderer.prototype.createTicks = widgetThis._categoryCreatedTicks;
                    widgetThis.chartOptions.axes[axesList[i].type].renderer.prototype.pack = widgetThis._categoryAxisPack;
                }
                var axistickrenerer = new tiny.charts.axistickrenderer(widgetThis, widgetThis.seriesIdIndexMap, widgetThis.seriesList, widgetThis.axes.axesList);
                widgetThis.chartOptions.axes[axesList[i].type].tickRenderer = $.jqplot.AxisTickRenderer;
                widgetThis.chartOptions.axes[axesList[i].type].tickRenderer.prototype.draw = axistickrenerer.AxisTickRendererDrawCallBack;
                widgetThis.chartOptions.axes[axesList[i].type].label = axesList[i].label;
                widgetThis.chartOptions.axes[axesList[i].type].drawBaseline = true;
                widgetThis.chartOptions.axes[axesList[i].type].baselineWidth = 2.2;
                widgetThis.chartOptions.axes[axesList[i].type].baselineColor = 'red';

                if (axesList[i].min !== null && axesList[i].min !== 'undefined' && axesList[i].min !== undefined) {
                    widgetThis.chartOptions.axes[axesList[i].type].min = axesList[i].min;
                    widgetThis.chartOptions.axes[axesList[i].type].userMin = axesList[i].min;
                }
                if (axesList[i].max !== null && axesList[i].max !== 'undefined' && axesList[i].max !== undefined) {
                    widgetThis.chartOptions.axes[axesList[i].type].max = axesList[i].max;
                    widgetThis.chartOptions.axes[axesList[i].type].userMax = axesList[i].max;
                }
                if (axesList[i].tickInterval !== null && axesList[i].tickInterval !== 'undefined' && axesList[i].tickInterval !== undefined) {
                    widgetThis.chartOptions.axes[axesList[i].type].tickInterval = axesList[i].tickInterval;
                }
                if (axesList[i].unitData !== null && axesList[i].unitData !== 'undefined' && axesList[i].unitData !== undefined) {
                    widgetThis.chartOptions.axes[axesList[i].type].unitData = axesList[i].unitData;
                }
                if (axesList[i].type.charAt(0) === 'y') {
                    if (axesList[i].decimalPlace !== null && axesList[i].decimalPlace !== 'undefined' && axesList[i].decimalPlace !== undefined) {
                        var defaultDecimalPlaces = parseInt(axesList[i].decimalPlace);
                        widgetThis.chartOptions.axes[axesList[i].type].tickOptions.formatString = '%.' + defaultDecimalPlaces + 'f';
                        widgetThis.chartOptions.axes[axesList[i].type].tickOptions.userFormatString = '%.' + defaultDecimalPlaces + 'f';
                    }
                }
                if (axesList[i].displayLength !== null && axesList[i].displayLength !== 'undefined' && axesList[i].displayLength !== undefined) {
                    var displayLength = parseInt(axesList[i].displayLength);
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.displayLength = displayLength;
                }

                if (axesList[i].textAngle >= -360 && axesList[i].textAngle <= 360) {
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.angle = axesList[i].textAngle;
                }
                if (axisTickLabels && axesList[i].renderType !== 'date') {
                    widgetThis.chartOptions.axes[axesList[i].type].ticks = axisTickLabels;
                }
                var unit = axesList[i].unit;
                if (unit && unit.length > 0) {
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.prefix = unit;
                }
                if (unit && unit.length > 0) {
                    //This line is added , even if tick renderer is present, unit
                    // value will be sent to client code
                    widgetThis.chartOptions.axes[axesList[i].type].tickOptions.prefixValue = unit;
                }
                var ticks = axesList[i].numberTicks;
                if (ticks > 0) {
                    widgetThis.chartOptions.axes[axesList[i].type].orgNumberTicks = ticks;
                    if (axesList[i].type.charAt(0) === 'y') {
                        ticks = 2 * ticks + 1;
                    }
                    widgetThis.chartOptions.axes[axesList[i].type].numberTicks = ticks;
                }
            }
        },
        "_createChart" : function(id, chartHTMLElem) {
            var widgetThis = this;
            widgetThis._super(id, chartHTMLElem);
            var oldGridVal = widgetThis.chartOptions.grid.drawGridlines;
            if (widgetThis.isBarchart) {
                widgetThis.chartOptions.grid.drawGridlines = false;
                widgetThis.chartOptions.isBarchart = true;
                 if (oldGridVal) {
                    widgetThis.chartOptions.drawGridAfterAnimate = true;
                    widgetThis.chartOptions.grid.drawGridlines = true;
                }
            }
            widgetThis.oChart = $.jqplot(id, widgetThis._parseData(), widgetThis.chartOptions);

            widgetThis.oChart.pieGarbageLeak = [];
            widgetThis.height = widgetThis.element[0].offsetHeight;
            widgetThis.width = widgetThis.element[0].offsetWidth;

            widgetThis._tickAngler();
            if (widgetThis.isBarchart && oldGridVal) {
                widgetThis.chartOptions.grid.drawGridlines = true;
            }
            var isAllHilighterEnable = false;
            var i = 0;
            for ( i = 0; i < widgetThis.oChart.series.length; i++) {
                if (widgetThis.oChart.series[i].showHighlight === true) {
                    isAllHilighterEnable = true;
                    break;
                }
            }
            $('#' + widgetThis.id).bind('click', function(e) {
                return false;
            });

            $('#' + widgetThis.id).bind('jqplotMouseLeave', function(evt, gridpos, datapos, neighbor, plot) {
                plot.plugins.highlighter._tooltipElem.empty();
                var tips = plot.plugins.highlighter.tips;
                if (tips) {
                    tips.hide();
                    plot.plugins.highlighter.currentNeighbor = null;
                }
            });
            
            $('#' + widgetThis.id).bind('jqplotClick', function(arg, gridPos, dataPos, neighbor, p){
	            var widgetThis = p.target.widget();
	            if (neighbor) {
	               var tmpData = widgetThis.seriesList.seriesList[neighbor.seriesIndex].tempData[neighbor.pointIndex];
	               tmpData.seriesId = widgetThis.seriesList.seriesList[neighbor.seriesIndex].id;
	               widgetThis.trigger("click", [tmpData]); 
	            }
	            arg = gridPos = dataPos = neighbor = p = null;
            });

            widgetThis._legendAdjuster();
        }
    });

    return Barchart;

});
