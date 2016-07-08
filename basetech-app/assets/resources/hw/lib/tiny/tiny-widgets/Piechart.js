define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Streamingchart", "tiny-lib/jqPlot", "tiny-lib/underscore", "tiny-common/util"], function(angular, $, Class, Streamingchart, jqPlot, _, util) {
    var DEFAULT_CONFIG = {
        "template" : '<div class="tiny-piechart"></div>'
    };

    var Piechart = Streamingchart.extend({

        "init" : function(options) {
            var widgetThis = this;
            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        "_createChart" : function(id, chartHTMLElem) {
            var widgetThis = this;

            widgetThis._super(id, chartHTMLElem);

            var firstSeriesElement = widgetThis.seriesList.seriesList[0];

            //饼图
            if (firstSeriesElement && firstSeriesElement.type === widgetThis.piechart) {
                widgetThis.chartOptions.seriesColors = firstSeriesElement.options.color;
                widgetThis.chartOptions.seriesBorderColors = firstSeriesElement.options.borderColors;
                widgetThis.chartOptions.seriesPointData = firstSeriesElement.pointData;
                var tempIsPieInit = false;
                widgetThis.chartOptions.pieOptions = {
                    isAnimate : widgetThis.chartOptions.animate,
                    sliceListener : {},
                    pieExplodeoptions : {
                        index : -1,
                        size : -1
                    },
                    tempIsPieInit : tempIsPieInit
                };

                widgetThis.chartOptions.seriesID = firstSeriesElement.id;
                widgetThis.chartOptions.seriesEvtList = widgetThis.seriesEvtList;
                if (firstSeriesElement.pointLabelSet) {
                    widgetThis.chartOptions.pieOptions.pointLabels = firstSeriesElement.pointLabels;
                }
                widgetThis.isPieChart = true;

                //pie rendered moved to different file
                if (widgetThis.chartOptions.pietype == "2d") {
                    widgetThis.pieRender = new tiny.PieRender2d();
                    firstSeriesElement.options.renderer.prototype.draw = widgetThis.pieRender.pieDrawCallback;
                } else {
                    widgetThis.pieRender = new tiny.PieRender(this, widgetThis._callSeriesEvtListeners, id, false);
                    firstSeriesElement.options.renderer.prototype.draw = widgetThis.pieRender.pieDrawCallback;
                }
                
                widgetThis.pieLegendRender = new tiny.PieLegendRender(this);
                if ( typeof widgetThis.chartOptions.legend !== 'undefined') {
                    widgetThis.chartOptions.legend.renderer = $.jqplot.PieLegendRenderer;
                    widgetThis.chartOptions.legend.renderer.prototype.draw = widgetThis.pieLegendRender.pieLegendDrawCallback;
                }
            }

            if (widgetThis.isPieChart) {
                widgetThis.chartOptions.pieOptions.seriesTipMap = widgetThis.seriesTipMap;
            }

            widgetThis.oChart = $.jqplot(id, widgetThis._parseData(), widgetThis.chartOptions);

            if (widgetThis.isPieChart) {
                widgetThis.oChart.pieTip = new Tip({
                });
            }
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
            $('#' + widgetThis.id).bind('click', function(e) {
                return false;
            });

            $('#' + widgetThis.id).bind('jqplotClick', function(arg, gridPos, dataPos, neighbor, p) {
                var widgetThis = p.target.widget();
                if (neighbor) {
                    var tmpData = widgetThis.seriesList.seriesList[neighbor.seriesIndex].tempData[neighbor.pointIndex];
                    tmpData.seriesId = widgetThis.seriesList.seriesList[neighbor.seriesIndex].id;
                    widgetThis.trigger("click", [tmpData]);
                }
                arg = gridPos = dataPos = neighbor = p = null;
            });

            $('#' + widgetThis.id).bind('jqplotDataHighlight', function(ev, seriesIndex, pointIndex, data) {
                widgetThis._showTip(ev, seriesIndex, pointIndex, data);
                ev = seriesIndex = pointIndex = data = null;
            });

            $('#' + widgetThis.id).bind('jqplotMouseLeave', function(arg, gridPos, dataPos, neighbor, p) {
                var plot = p.target.widget().oChart;
                if (plot.pieTip) {
                    plot.pieTip.hide();
                }
                arg = gridPos = dataPos = neighbor = p = null;
            });

            widgetThis._legendAdjuster();
        },
        "_showTip" : function(ev, seriesIndex, pointIndex, data) {
            var plot = $(ev.target).widget().oChart;
            if (plot.series[0].showHighlight === true) {
                var index = pointIndex;
                var seriesTipMap = plot.options.pieOptions.seriesTipMap;
                var serID = plot.options.seriesID;
                if (seriesTipMap && seriesTipMap[serID]) {
                    var str = null;

                    if (seriesTipMap[serID].tip.renderer) {
                        str = seriesTipMap[serID].tip.renderer(parseInt(index), plot.series[0]._plotData[parseInt(
                        index)][0], plot.series[0]._plotData[parseInt(
                        index)][1]);
                    } else if (seriesTipMap[serID].data) {
                        var tipArr = seriesTipMap[serID].data;
                        if (tipArr[parseInt(index)]) {
                            str = '<div style="color:' + seriesTipMap[serID].tip.color + '">' + tipArr[parseInt(index)] + '</div>';
                        }
                    } else {
                        var html = '';
                        var colCount = plot.target.find('.jqplot-table-legend tr:nth-child(1) td', $("#piechartdiv")).clone().length;
                        var temp = (parseInt(parseInt(index)) * 2 + 1);
                        var rowValue = (parseInt(temp / colCount) + 1);
                        var colValue = (parseInt(temp % colCount));
                        var actLegend = plot.target.find(".jqplot-table-legend tr:nth-child(" + rowValue + ") td:nth-child(" + colValue + ")").clone();
                        html = actLegend.html();
                        var divs = actLegend.find('div');
                        if (divs.length == 2) {
                            var attributesChange = {
                                width : '8px',
                                height : '8px'
                            };
                            $(divs[0]).css(attributesChange);
                            $(divs[1]).css(attributesChange);
                            html = actLegend.html();
                        }
                        var ret = "<table style='padding: 0 10px;margin-right: -6px;'><tr><td valign='middle'>";
                        ret += '<div style="" class="jqplot-table-legend jqplot-table-legend-swatch">' + html + '</div></td>';
                        ret += '<td><div style="padding-left:2px;"><div style="color:#000000;font-size:14px;font-weight:bold;">' + plot.series[0]._plotData[parseInt(index)][1] + '%</div>';
                        ret += '<div style="color:#3c3c3c;font-size:10px;">' + plot.series[0]._plotData[parseInt(index)][0] + '</div></div></td></tr></table>';
                        ret += '';
                        str = ret;
                    }

                    // Check if the tooltip string is null/undefined/empty
                    if (str === undefined || str === null) {
                        return;
                    }
                    var tipLocation = plot.tipLocation;
                    if (index >= 0) {
                        if (tipLocation[index]) {
                            var element = plot.target;
                            if (element.length != 0) {
                                plot.pieTip.setPosition(tipLocation[index].left - 10 + element.offset().left, tipLocation[index].top + element.offset().top);
                            }
                        } else {
                            plot.pieTip.setPosition(ev.pageX - 20, ev.pageY + 13);
                        }
                    }
                    if (plot.pieTip) {
                        plot.pieTip.option("content", str);
                        plot.pieTip.show();
                    }
                }

            }
        },
        "_setChartType" : function(series, type) {
            var widgetThis = this;
            series.type = widgetThis.piechart;
            series.options.renderer = $.jqplot.PieRenderer;
        }
    });

    return Piechart;

});
