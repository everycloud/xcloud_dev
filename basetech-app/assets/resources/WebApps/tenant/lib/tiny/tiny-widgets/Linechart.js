define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Streamingchart", "tiny-lib/jqPlot", "tiny-lib/underscore", "tiny-common/util"], function(angular, $, Class, Streamingchart, jqPlot, _, util) {
    var DEFAULT_CONFIG = {

        "template" : '<div class="tiny-linechart"></div>'

    };

    var Linechart = Streamingchart.extend({

        "init" : function(options) {
            var widgetThis = this;
            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));
            widgetThis._setOptions(widgetThis.options);
            return widgetThis;
        },
        "_createChart" : function(id, chartHTMLElem) {
            var widgetThis = this;
            widgetThis._super(id, chartHTMLElem);

            widgetThis.oChart = $.jqplot(id, widgetThis._parseData(), widgetThis.chartOptions);

            widgetThis.oChart.pieGarbageLeak = [];
            widgetThis.height = widgetThis.element[0].offsetHeight;
            widgetThis.width = widgetThis.element[0].offsetWidth;

            widgetThis._tickAngler();

            var isAllHilighterEnable = false;
            var i = 0;
            for ( i = 0; i < widgetThis.oChart.series.length; i++) {
                if (widgetThis.oChart.series[i].showHighlight === true) {
                    isAllHilighterEnable = true;
                    break;
                }
            }
            if (widgetThis.islinechart) {
                widgetThis._drawHorizontalThreshold();
            }
            $('#' + widgetThis.id).bind('click', function(e) {
                return false;
            });

            if (widgetThis.islinechart === true && isAllHilighterEnable === true) {
                if (widgetThis.oChart.plugins.lineRenderer && widgetThis.oChart.plugins.lineRenderer.highlightCanvas) {
                    widgetThis.canvasElement = widgetThis._createCanvas();
                }
                $('#' + widgetThis.id).bind('jqplotMouseMove', function(evt, gridpos, datapos, neighbor, plot) {
                    var nearestpoint = $.jqplot.Highlighter.nearestDataPoint(gridpos, plot);
                    if (!nearestpoint || !nearestpoint.gridData) {
                        return;
                    }
                    var hl = plot.plugins.highlighter;

                    if (neighbor !== null) {
                        return;
                    }
                    if (!plot.series[nearestpoint.seriesIndex].show) {
                        return;
                    }

                    if (hl.latestPoint && nearestpoint.data === hl.latestPoint.data) {

                    } else {
                        var ctx = hl.highlightCanvas._ctx;
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        hl.latestPoint = nearestpoint;

                    }
                    $.jqplot.Highlighter.drawDashLine(plot, nearestpoint.gridData[0], neighbor, nearestpoint);

                    for ( i = 0; i < plot.series.length; i++) {
                        series = plot.series[i];
                        y = null;
                        for ( j = 0; j < series.gridData.length; j++) {
                            if (series.gridData[j][0] == nearestpoint.gridData[0]) {
                                y = series.gridData[j][1];
                                if (plot.series[i].showHighlight === true) {
                                    break;
                                }
                            }
                        }
                    }
                    if (plot.stackSeries) {
                        nearestpoint.data = plot.series[nearestpoint.seriesIndex]._stackData[nearestpoint.pointIndex];
                    }
                    plot.islinechart = true;
                    if (plot.series[nearestpoint.seriesIndex].show && plot.series[nearestpoint.seriesIndex].showHighlight === true) {
                    	widgetThis = plot.target.widget();
                        if (widgetThis.canvasElement.nearestPointIndex == nearestpoint.pointIndex && widgetThis.canvasElement.nearestSeriesIndex == nearestpoint.seriesIndex) {
                            var changeInXPos = Math.abs(widgetThis.canvasElement.gridpos.x - gridpos.x);
                            var changeInYPos = Math.abs(widgetThis.canvasElement.gridpos.y - gridpos.y);
                            if (changeInXPos >= 4 || changeInYPos >= 4) {
                                widgetThis.canvasElement.gridpos = gridpos;
                            } else {
                                return;
                            }
                        } else {
                            widgetThis.canvasElement.nearestPointIndex = nearestpoint.pointIndex;
                            widgetThis.canvasElement.nearestSeriesIndex = nearestpoint.seriesIndex;
                            widgetThis.canvasElement.gridpos = gridpos;
                        }
                        plot.plugins.highlighter.draw(plot, nearestpoint);
                        plot.plugins.highlighter.fnShowTooltip(plot, plot.series[nearestpoint.seriesIndex], nearestpoint, gridpos);
                    }
                    nearestpoint = evt = gridpos = datapos = neighbor = plot = series = null;
                });

                $('#' + widgetThis.id).bind('jqplotMouseLeave', function(evt, gridpos, datapos, neighbor, plot) {
                    plot.plugins.highlighter._tooltipElem.empty();
                    var tips = plot.plugins.highlighter.tips;
                    if (tips) {
                        tips.hide();
                        plot.plugins.highlighter.currentNeighbor = null;
                    }
                    var ctx = plot.target.widget().canvasElement.getContext('2d');
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    plot.lastNeighbour = null;
                    ctx = evt = gridpos = datapos = neighbor = plot = null;
                });
            }
            
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
        },

        "_reRender" : function(seriesId, onlyDrawSeries) {
            var widgetThis = this;
            widgetThis._super(seriesId, onlyDrawSeries);

            if (widgetThis.islinechart === true) {
                if (widgetThis.canvasElement) {
                    tiny.garbageCollect(widgetThis.canvasElement, false);
                    $(widgetThis.canvasElement).remove();
                    widgetThis.canvasElement = null;
                }
                if (widgetThis.canvasThresoldElement) {
                    tiny.garbageCollect(widgetThis.canvasThresoldElement, false);
                    $(widgetThis.canvasThresoldElement).remove();
                    widgetThis.canvasThresoldElement = null;
                }
                if (widgetThis.oChart.plugins.lineRenderer && widgetThis.oChart.plugins.lineRenderer.highlightCanvas) {
                    widgetThis.canvasElement = widgetThis._createCanvas();
                }
                widgetThis._drawHorizontalThreshold();

                if (widgetThis.onUpdateShowSeries === false) {
                    //after draw call hidden legends
                    var map = widgetThis.oChart.hiddenSeriesMap;
                    for (var key in map) {
                        if (map[key] === false) {
                            hideSeries(widgetThis.oChart.series[parseInt(key)]);
                        }
                    }
                    map = null;
                }
            }
        },
        "_drawHorizontalThreshold" : function() {
            var widgetThis = this;
            if (!widgetThis.seriesList) {
                return;
            }
            var thro = widgetThis.seriesList.threshold;
            var color = widgetThis.seriesList.thresholdColor;
            if (widgetThis.seriesList.thresholdAlways && thro !== null && thro !== undefined && !isNaN(thro)) {
                    var seriesIndex = 0;
                    var firstseries = widgetThis.seriesList.seriesList[seriesIndex];
                    var yaxisRef = widgetThis.oChart.series[seriesIndex].yaxis;
                    widgetThis.canvasThresoldElement = widgetThis._createCanvas('threshold');
                    var axis = widgetThis.oChart.axes[yaxisRef];

                    var pos = Math.round(widgetThis._ThresholdU2P(thro, axis));
                    widgetThis._drawThersoldLine(widgetThis.canvasThresoldElement.getContext('2d'), pos, color, true);
            }
        },
        "_ThresholdU2P" : function(u, axis) {
            var offsets = axis._offsets;
            var offmax = offsets.max;
            var offmin = offsets.min;
            var max = axis.max;
            var min = axis.min;
            var pixellength = offmax - offmin;
            var unitlength = max - min;
            return (u - max) * pixellength / unitlength;
        },
        "_drawThersoldLine" : function(ctx, x, strokeStyle, isHorizontal) {
            ctx.save();
            canvasWidth = ctx.canvas.clientWidth
            if (isHorizontal) {
                y = x;
                x = 0;
            } else {
                y = 0;
            }

            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 1;
            ctx.beginPath();
            if (isHorizontal) {
                ctx.moveTo(0, y);
            } else {
                ctx.moveTo(x, 0);
            }
            ctx.strokeStyle = strokeStyle;
            draw = true;

            for ( i = 0; i <= canvasWidth; ) {
                if (draw === true) {
                    if (isHorizontal) {
                        x = x + 5;
                    } else {
                        y = y + 3;
                    }
                    ctx.lineTo(x, y);
                    draw = false
                } else {
                    ctx.moveTo(x, y);
                    if (isHorizontal) {
                        x = x + 3;
                    } else {
                        y = y + 3;
                    }
                    ctx.lineTo(x, y);
                }
                if (isHorizontal) {
                    x = x + 7;
                    i = x;
                } else {
                    y = y + 3;
                    i = y;
                }
            }
            ctx.stroke();
            ctx.restore();
        }
    });

    return Linechart;

});
