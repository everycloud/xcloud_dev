define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-lib/jquery.flot", "tiny-lib/jquery.flot.dashes", "tiny-lib/jquery.flot.symbol", "tiny-lib/jquery.flot.threshold.multiple", "tiny-lib/underscore", "tiny-common/util", "tiny-widgets/Widget", "tiny-lib/jquery.flot.time", "tiny-lib/jquery.flot.spline", "tiny-lib/jquery.flot.stack", "tiny-lib/encoder","tiny-lib/jquery.flot.pie"], function(angular, $, Class, flot,dashes, symbol, threshold, _, util, Widget, time, spline, stack, encoder,pie) {

    var DEFAULT_CONFIG = {
        "width" : "500px",
        "height" : "300px",
        "template" : '<div class="tiny-Lineplot"></div>',
        "tips" : {
            xDateFormat: null,
            yDateFormat: null,
            monthNames: null,
            dayNames: null,
        },
        "series" : {
            'points' : {
                "show" : false,
                "symbol" : "ring"
            },
            "lines" : {
                "show" : true
            }
        },
        "trackingLine" : {
            mode : "x",
            color : "#d9d9d9",
            lineWidth : 1
        },
        "grid" : {
            borderWidth : {
                top : 1,
                right : 0,
                bottom : 1,
                left : 1
            },
            borderColor : {
                left : "#ddd",
                bottom : "#ddd",
                top : "#ddd"
            },
            ticksStyle : "dashed",
            hoverable : true,
            clickable : true
        },
        "xaxis" : {
            show : true,
            position : 'bottom',
            tickLength : 6,
            font : {
                size : 11,
                lineHeight : 13,
                family : "Microsoft YaHei",
                color : "#666666"
            },
            timezone:"browser"
        },
        yaxis : {
            font : {
                size : 11,
                lineHeight : 13,
                family : "Microsoft YaHei",
                color : "#666666"
            }
        },
        colors : ["#1fbe5c", "#6d73e1", "#ff7200", "#d74aff", 
                    "#99d61e", "#ff2c2c", "#999999", "#2700eb", 
                    "#f2d414", "#54ccc8"]
    };

    var Lineplot = Widget.extend({

        "init" : function(options) {
            
            var plotThis = this;
            plotThis.chartId = options.id;
            //若chartId对应的lineplot已经存在，则先销毁
            var widgetObj = plotThis._isPlotExist(plotThis.chartId);
            if(widgetObj){
                widgetObj.destroy();
            }
            
            plotThis._element = plotThis._generateElement(options.id);
            //将plotThis对象缓存在_element中，后续可通过plotThis._element.widget()来获取控件对象
            plotThis._element.widget(plotThis);
            
            plotThis._setChart(options);
            plotThis._createChart(options.id, plotThis.dataSet, plotThis.optionsSet);
            plotThis._setLabelStyle(options.id);
            plotThis._addBehavior(options);
            !_.isUndefined(options.caption) ? plotThis._setCaption(options.caption) : "";
            !_.isUndefined(options.yaxis) && !_.isUndefined(options.yaxis.unit) ? 
            plotThis._setYaxisUnit(plotThis.optionsSet.yaxis) : "";
        },
        "_setLabelStyle" : function(id) {
            var plotThis = this;
            if (plotThis.xaxisLabelStyle) {
                $(".xaxisLabel", plotThis._element).css(plotThis.xaxisLabelStyle);
            }
            if (plotThis.yaxisLabelStyle) {
                $(".yaxisLabel", plotThis._element).css(plotThis.yaxisLabelStyle);
            }
        },
        "_generateElement" : function(id) {
            var plotThis = this;
            var widgetElement = $("#" + id);
            return widgetElement;
        },

        "_isPlotExist":function(chartId) {
             var plotThis = this;
        var placeholder = $("#"+chartId);
        var widgetObj = placeholder
                        && placeholder.widget()
                        && placeholder.widget().lineObj;
           return  widgetObj;
        },
        
        
        "destroy":function(chartId){
        var plotThis = this;
            plotThis.lineObj.destroy();
        },
        
        "updateOverlay" : function(pos) {
            var plotThis = this;
            
            //获取flot对象，可以调用flot的API
            var oPlot = plotThis.lineObj;
            //调用flot API，获取坐标轴的对象
            var axes = oPlot.getAxes();
            //用来存放本次update获取的最近数据点
            oPlot.dataPoint = [];
            
            oPlot.dataset = oPlot.getData();
            oPlot.labelList = [];
            var hasRelatedChart = plotThis.hasRelatedChart(plotThis.relatedId);
            var isRelatedChart = arguments[1] == "relatedChart" ? true : false;
            if (!isRelatedChart) {
                var isValidPos = plotThis.checkValidPos(pos, axes);
                if (!isValidPos) {
                    plotThis.handleInValidPos(oPlot, hasRelatedChart);
                    return;
                }
            }
            var pointIndex = plotThis.findNearestData(pos, oPlot, axes.xaxis);

            if (pointIndex !== null && oPlot.pointIndex !== pointIndex) {
                plotThis.reDrawOverlay(oPlot, pointIndex, axes);
                if (!isRelatedChart && hasRelatedChart) {
                    plotThis.handleRelatedChart(plotThis.relatedId, pos);
                }
            }
        },

        
        "handleRelatedChart":function(relatedId,pos){
            var plotThis = this;
            var SiblingId = plotThis.getSiblingId(plotThis.chartId,relatedId);
            $.each(SiblingId, function(index, elemt) {
                    var plotWidget = $("#" + elemt).widget();
                    plotWidget.updateOverlay(pos,"relatedChart");
                });
        },
        
        "getSiblingId": function(plotId,relatedId){
            var plotThis = this;
        var plotIdIndex = $.inArray(plotId,relatedId);
        if(-1 != plotIdIndex){
            var SiblingId = relatedId.slice();
            SiblingId.splice(plotIdIndex,1);
            return SiblingId;
        }
        return relatedId;
       },
        
        
        "hasRelatedChart":function(relatedId){
        var plotThis = this;
        return relatedId && relatedId.length > 0;
        },
        
        "reDrawOverlay":function(oPlot,pointIndex,axes){
        var plotThis = this;
        oPlot.pointIndex = pointIndex;
            oPlot.triggerRedrawOverlay(0);
            plotThis.highLightData(oPlot, pointIndex);    
            oPlot.plotCtx = plotThis.drawDashedLine(oPlot,axes.xaxis);
            plotThis.showTrackTip(oPlot,axes);
        },
       
        "handleInValidPos":function(oPlot,hasRelatedChart) {
            var plotThis = this;
            if (hasRelatedChart) {
                $.each(plotThis.relatedId, function(index, elemt) {
                    var plotWidget = $("#" + elemt).widget();
                    plotWidget.clearOverlay(plotWidget.lineObj);
                });
                return;
            }
            plotThis.clearOverlay(oPlot);
            return;
        },

        
        "clearOverlay":function(oPlot){
         var plotThis = this;
         plotThis.$tooltip.html("").hide();
             oPlot.triggerRedrawOverlay(0);
        },
        
       "checkValidPos":function(pos,axes){
            var plotThis = this;
            var isInValidPos = pos.x < axes.xaxis.min || pos.x > axes.xaxis.max 
                               || pos.y < axes.yaxis.min || pos.y > axes.yaxis.max;
            return !isInValidPos;
       },
       
          "drawDashedLine":function(oPlot, xaxis) {
               var plotThis = this;
               var plotCanvas =  $(".flot-overlay","#"+plotThis.chartId)[0];
               var context = plotCanvas.getContext("2d");
               var plotOffset = oPlot.getPlotOffset();
               var drawX = xaxis.p2c(oPlot.xData)+plotOffset.left;
               context.strokeStyle = "#33a6ff";
               context.lineWidth = 1;
               context.lineJoin = "round";
               context.beginPath();
               context.dashedLineTo(drawX,plotOffset.top, drawX, oPlot.height()+plotOffset.top, [2, 2]);
               context.stroke();
               context.restore();
               return context;
          },

        
      "showTrackTip":function(oPlot,axes){
        var plotThis = this;
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        var tipContent = plotThis._getTrackTipContent(oPlot.dataPoint);
            var isFrontHalf = oPlot.xData < (xaxis.min + xaxis.max) / 2; //判断数据点是否在横轴的前半部分，将根据此处理tooltip的位置
            plotThis.updateTrackTip(oPlot, tipContent, isFrontHalf);
        },
       
        "findNearestData":function(pos, oPlot, xaxis) {
            var plotThis = this;
            var dataset = oPlot.dataset;
            var plotOffset = oPlot.offset();//获取绘图区域（ploting area）相对于document的偏移；
            var existingLabel = [];
            var mouseX = pos.pageX - plotOffset.left;//获得光标相对于画图区域(ploting area)的偏移
            var existingLabel = [];
            var pointIndex = null;
            if (dataset.length < 1) {
                return pointIndex;
            }
            var serie = dataset[0];
            var serieData = serie.data;
            var isMeetCondtions = serieData.length > 0 && $.inArray(serie.label, existingLabel) == -1;
            if (!isMeetCondtions) {
                return pointIndex;
            }
            if (!_.isUndefined(serie.label)) {
                existingLabel.push(serie.label);
            }
            pointIndex = 0;
            var minDistance = Math.abs(xaxis.p2c(serieData[pointIndex][0]) - mouseX);

            //寻找最近的数据点
            for (var j = 1; j < serieData.length; ++j) {
                if (serieData[j] == null || serieData[j][0] == null) {
                    continue;
                }
                var x = serie.data[j][0];
                var dist = Math.abs(xaxis.p2c(x) - mouseX);

                if (dist < minDistance) {
                    minDistance = dist;
                    pointIndex = j;
                }
            }
            oPlot.xData = serie.data[pointIndex][0];
            oPlot.yData = serie.data[pointIndex][1];
            return pointIndex;
        },


       "highLightData":function(oPlot, pointIndex) {
            var plotThis = this;
            var dataset = oPlot.dataset;
            for (var i = 0; i < dataset.length; ++i) {
                var serie = dataset[i];
                var serieData = serie.data;
                var xdata = serieData[pointIndex][0];
                var ydata = serieData[pointIndex][1];
                if(xdata == null || ydata==null){
                    continue;
                }
                oPlot.dataOffset = oPlot.pointOffset({
                    x : xdata,
                    y : ydata
                });
                //若数据点未显示,则重新画点
            var isPointShow = oPlot.getOptions().series.points.show;
            if(!isPointShow){
               plotThis.plotPoint(oPlot, 2.5, serie.color, "circle");
            }
               oPlot.dataPoint.push({
                         point: [xdata, ydata],
                         label: serie.label,
                         color: serie.color
                  });
            }
        },

        
        "plotPoint" : function(oPlot, radius, fillStyle, symbol) {
            var plotThis = this;
            var x = oPlot.dataOffset.left;
            var y = oPlot.dataOffset.top;
            var canvas = $(".flot-overlay","#"+plotThis.chartId)[0];
            var ctx = canvas.getContext("2d");
            
            //画内圆
            ctx.beginPath();
            ctx.strokeStyle = fillStyle;
            ctx.lineWidth = 1;
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = fillStyle;
            ctx.fill();
            
            //画外圆环
            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = fillStyle;
            ctx.arc(x, y, radius + 3, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.stroke();
        },

        
    
        "_addBehavior" : function(options) {
            var plotThis = this;
            if (!options.tips) {
                return;
            }
            var tipId = plotThis.chartId + "_tooltip";
            var element = plotThis._element;
            var options = plotThis.options;
            plotThis.$tooltip = $("<div id=" + tipId + "></div>").css({
                display : "none"
            }).appendTo("body");
            plotThis.tipId = tipId;
            $("#" + plotThis.chartId).bind("plothover", function(event, pos, item) {
                if(plotThis.lineObj.getData().length === 0){
                    return;
                }
                if (plotThis.tips.tipType == "hover") {
                    if (item) {
                        plotThis.showHoverTip(item);
                    } else {
                        plotThis.$tooltip.hide();
                    }
                } else {
                    plotThis.updateOverlay(pos);
                }
            });
            window.onunload = function() {
                if ($("#" + tipId)) {
                    $("#" + tipId).hide();
                }
            };
        },

     "showHoverTip":function(item) {
          var plotThis = this;
          var x = item.datapoint[0], y = item.datapoint[1];
          var datapoint = {
               point: [x, y],
               label: item.series.label,
               color: item.series.color
          };
          var tipContent = plotThis._getHoverTipContent(datapoint);
          plotThis.updateHoverTip(item.pageX, item.pageY, tipContent);
          plotThis.$tooltip.bind("mouseenter",function(){
               plotThis.clearOverlay(plotThis.lineObj);
          });
     },
    
     "_getHoverTipContent": function(datapoint){
         var plotThis = this;
         
         var tipFormatter = plotThis.tips.tipFormatter;
         if(!_.isUndefined(tipFormatter) && typeof tipFormatter === 'function'){
              return tipFormatter([datapoint]);
         }
         
         return plotThis._formatHoverTip(datapoint);
    },
     
    /**        
      * 获取hover类型的tips内容
      */
   "_formatHoverTip": function(datapoint) {
      var plotThis = this;
       var tips = plotThis.tips;
      var content = _.isUndefined(tips.content) ? "%x.1 : %y.1" : tips.content;
      var xRegExp = new RegExp("%x" + "\\.{0,1}(\\d{0,})", "g");
      var yRegExp = new RegExp("%y" + "\\.{0,1}(\\d{0,})", "g");
      var isXDateMode = plotThis._isTimeMode('xaxis') && plotThis._isXDateFormat(tips);
      var isYDateMode = plotThis._isTimeMode('yaxis') && plotThis._isYDateFormat(tips);
      
      if(isXDateMode) {
        content = content.replace(xRegExp, plotThis._timestampToDate(datapoint.point[0], tips.xDateFormat));
      }
      else{
      content = plotThis._adjustValPrecision(xRegExp, content, datapoint.point[0]);
      }
      
      if(isYDateMode) {
        content = content.replace(yRegExp, plotThis._timestampToDate(datapoint.point[1], tips.yDateFormat));
      }
      else{
      content = plotThis._adjustValPrecision(yRegExp, content, datapoint.point[1]);
      } 
      
      content = content.replace(/%s/g, datapoint.label);
      
      return content;
   },

   "_getTrackTipContent": function(datapoint){
         var plotThis = this;
         
         var tipFormatter = plotThis.tips.tipFormatter;
         if(!_.isUndefined(tipFormatter) && typeof tipFormatter === 'function'){
              return tipFormatter(datapoint);
         }
         
         return plotThis._formatTrackTip(datapoint);
    },
   
    "_formatTrackTip": function(datapoint) {
            var plotThis = this;
               var tips = plotThis.tips;
            var dataLength = datapoint.length;
            var content = _.isUndefined(tips.content) ? plotThis._setDefaultTipContent(dataLength) : tips.content;
            var isXDateMode = plotThis._isTimeMode('xaxis') && plotThis._isXDateFormat(tips);
            var isYDateMode = plotThis._isTimeMode('yaxis') && plotThis._isYDateFormat(tips);
            var labelRegExp = null;
            var xRegExp = null;
            var yRegExp = null;

            for (var index = 0; index < dataLength; index++) {
                xRegExp = new RegExp("%x" + index + "\\.{0,1}(\\d{0,})", "g");
                yRegExp = new RegExp("%y" + index + "\\.{0,1}(\\d{0,})", "g");
                labelRegExp = new RegExp("%s" + index, "g");
                if (isXDateMode) {
                    content = content.replace(xRegExp, plotThis._timestampToDate(datapoint[index].point[0], tips.xDateFormat));
                } else {
                    content = plotThis._adjustValPrecision(xRegExp, content, datapoint[index].point[0]);
                }
                if (isYDateMode) {
                    content = content.replace(yRegExp, plotThis._timestampToDate(datapoint[index].point[1], tips.yDateFormat));
                } else {
                    content = plotThis._adjustValPrecision(yRegExp, content, datapoint[index].point[1]);
                }
                content = content.replace(labelRegExp, datapoint[index].label);
            }

            return content;
        },

   
  
        "_setDefaultTipContent": function(dataLength) {
            var plotThis = this;
            var fragments = [];
            for (var index = 0; index < dataLength; index++) {
                fragments.push("%x" + index + " : %y" + index);
                if (index < dataLength - 1) {
                    fragments.push("</br>");
                }
            }
            return fragments.join("");
        },


  
  
        "_isTimeMode": function(axisName) {
            var plotThis = this;
            return ( typeof plotThis.optionsSet[axisName].mode !== 'undefined' && plotThis.optionsSet[axisName].mode === 'time');
        },
        "_isYDateFormat":  function(tips) {
            var plotThis = this;
            return ( typeof tips.yDateFormat !== 'undefined' && tips.yDateFormat !== null);
        },
        "_isXDateFormat":  function(tips) {
            var plotThis = this;
            return ( typeof tips.xDateFormat !== 'undefined' && tips.xDateFormat !== null);
        },

        "_timestampToDate": function(tmst, dateFormat) {
            var plotThis = this;
            var theDate = new Date(tmst * 1);
            return $.plot.formatDate(theDate, dateFormat, plotThis.tips.monthNames, plotThis.tips.dayNames);
        },

   
        
    "_adjustValPrecision" : function(pattern, content, value) {
        var plotThis = this;
        var matchResult = content.match(pattern);
        if (matchResult !== null) {
            if (RegExp.$1 !== '') {
                value = value.toFixed(RegExp.$1);
            }
            content = content.replace(pattern, value);
        }
        return content;
    },


        "_setChart" : function(options) {
            var plotThis = this;
            plotThis.optionsSet = {};
            plotThis.dataSet = plotThis._getData(options); 
            plotThis.relatedId = plotThis._getRelatedId(options); 
            plotThis._setColors(options.colors);
            plotThis._setGrid(options.grid);
            plotThis._setTips(options.tips);
            plotThis._setSeries(options.series);
            plotThis._setThreshold(options.threshold , plotThis.optionsSet.series);
            plotThis._setXaxis(options.xaxis);
            plotThis._setYaxis(options.yaxis);
            plotThis._setLegend(options.legend);
            plotThis._setChartType(options.type);
            plotThis._setSmooth(options);
            plotThis._initSize(options.width , options.height);
        },
       
       "_initSize":function(width,height){
        var plotThis = this;
        plotThis.width = !_.isUndefined(width) ? width : DEFAULT_CONFIG.width;
         plotThis.height = !_.isUndefined(height) ? height : DEFAULT_CONFIG.height;
        plotThis._element.css('width', plotThis.width);
         plotThis._element.css('height', plotThis.height);
       },
       
       "_setLegend":function(legend) {
            var plotThis = this;
            
            //为图表的图例生成一个唯一的Id，避免多个图表时图例的点击事件绑定有误
            plotThis.optionsSet.flotLegendId = _.uniqueId("lineplot_legend_");
            
            plotThis.optionsSet.legend = $.extend(true,{},legend);
        },
       
       "_setColors":function(colors) {
            var plotThis = this;
            plotThis.optionsSet.colors = !_.isUndefined(colors) ? colors 
                                         : $.extend(true, [], DEFAULT_CONFIG.colors);
        },
 
        "_getData":function(options) {
            var plotThis = this;
            var data = options.data;
            var destData = [];
            if($.isArray(data) && data.length>0){
               var dataLen = data.length;
               var dColor = "";
                  for(var index = 0; index<dataLen; index++){
                      dColor = data[index].color;
                      if(!_.isUndefined(dColor)){
                            data[index].color = $.encoder.encodeForHTMLAttribute("entryColor", dColor, true) ;
                      }
                  }
                 destData = $.extend(true, [], data);
            }
            return destData;
        },
        
        "_getRelatedId":function(options) {
            var plotThis = this;
            var relatedId = options.relatedId;
            var isrelatedIdValid = !_.isUndefined(relatedId) && $.isArray(relatedId);
            return isrelatedIdValid ? $.extend(true, [], relatedId) : [];
        },

        "_setGrid":function(grid) {
            var plotThis = this;
            var defaultGrid =  DEFAULT_CONFIG.grid;
            plotThis.optionsSet.grid = $.extend(true, {}, defaultGrid,grid);
        },
        
         
        "_setTips" : function(tips) {
            var plotThis = this;
             plotThis.tips = $.extend(true, {}, DEFAULT_CONFIG.tips,tips);
        },
        
        '_setSeries' : function(seriesOpts) {
            var plotThis = this;
            var dataLength = plotThis.dataSet.length;
            plotThis.optionsSet.series = $.extend(true,{},DEFAULT_CONFIG.series,seriesOpts);
        },

        '_setThreshold' : function(threshold,series) {
            var plotThis = this;

            //检验用户是否设置threshold及是否为数组
            var isThresholdValid = threshold && threshold.length > 0;
            if (!isThresholdValid) {
                return;
            }

            var thresholdOpts = [];
            var gridMarkings = [];

            $.each(threshold, function(index, item) {

                //用户必须指定阈值
                if (!_.isUndefined(item.value)) {
                    return true;
                }
                
                var thresholdItem = {};
                var markingItem = {};

                //设置thresholdItem，由于利用了threshold plugin，因此thresholdItem相当于设置plugin的constraint.
                thresholdItem.threshold = item.value;
                if (!_.isUndefined(item.aboveColor)) {
                    thresholdItem.color = item.aboveColor;
                    thresholdItem.evaluate = function(y, threshold) {
                        return y > threshold;
                    };
                } else if (!_.isUndefined(item.belowColor)) {
                    thresholdItem.color = item.belowColor;
                    thresholdItem.evaluate = function(y, threshold) {
                        return y < threshold;
                    };
                }

                //设置grid中的markings，可用来画横向阈值线
                markingItem = {
                    yaxis : {
                        from : item.value,
                        to : item.value
                    },
                    'dashes' : {
                        "show" : true
                    }
                };
                !_.isUndefined(item.lineColor) ? markingItem.color = item.lineColor : "";

                thresholdOpts.push(thresholdItem);
                gridMarkings.push(markingItem);
            });

            //根据AgileUI规范，曲线个数大于1，只显示阈值线，不改变颜色
            if (dataLength > 1) {
                series.constraints = [];
            } else {
                series.constraints = thresholdOpts;
            }
            plotThis.optionsSet.grid.markings = gridMarkings;
        },

        "_setSmooth" : function(options) {
            var plotThis = this;
            if (!options.smooth) {
                return;
            }
            var seriesSet = plotThis.optionsSet.series;
            var lineSet = seriesSet.lines;
            lineSet.show = false;
            seriesSet.splines = {
                show : true,
                tension : 0.5,
                lineWidth : 2
            };
            if (options.type === "area") {
                seriesSet.splines.fill = lineSet.fill;
            }
        },

        "_setChartType" : function(type) {
            var plotThis = this;
            if (type == "area") {
                var fill = plotThis.optionsSet.series.lines.fill;
                if(_.isUndefined(fill) || typeof fill !== "number"){
                plotThis.optionsSet.series.lines.fill = 0.4;
                }
            }
        },
        
        "_setCaption" : function(caption) {
            var plotThis = this;
            if (!_.isUndefined(caption.content)) {
                var $caption = $("<span id='chartCaption'></span>").text(caption.content);
                $("#" + plotThis.chartId).before($caption);
                if (!_.isUndefined(caption.style)) {
                    $caption.css(caption.style);
                }
                if (caption.position !== "left") {
                    var moveDistance = (parseInt(plotThis.width, 10) - $caption.width()) / 2;
                    $caption.css({
                        position : "relative",
                        left : moveDistance
                    });
                }
            }
        },

        '_setTrackingLine' : function(trackOpts) {
            var plotThis = this;
            if (trackOpts && trackOpts.mode) {
                plotThis.optionsSet.crosshair = {
                    mode : "x",
                    color : "#d9d9d9",
                    lineWidth : 1
                
                }
            }
        },

        "_setDataThreshold" : function(data) {
            var plotThis = this;
            var gridMarkings = [];
            if (data && data.length > 0) {
                _.each(data, function(mData) {
                    if (!_.isUndefined(mData.threshold)) {
                        var markingItem = {};
                        if (!_.isUndefined(mData.threshold.below)) {
                            markingItem = {
                                yaxis : {
                                    from : mData.threshold.below,
                                    to : mData.threshold.below
                                },
                                'dashes' : {
                                    "show" : true
                                }
                            };
                        }
                        !_.isUndefined(mData.threshold.belowColor) ? mData.threshold.color = mData.threshold.belowColor : "";
                        !_.isUndefined(mData.threshold.lineColor) ? markingItem.color = mData.threshold.lineColor : "";

                    }
                    gridMarkings.push(markingItem);
                });
                plotThis.optionsSet.grid.markings = gridMarkings;
            }

        },

        "disableTip" : function() {
            var plotThis = this;
            plotThis.tips = {};
        },

        "updateTrackTip" : function(oPlot, contents, isFrontHalf) {
            var plotThis = this;
            var x = oPlot.dataOffset.left;
            var y = oPlot.dataOffset.top;
            var tipId = plotThis.chartId + "_tooltip";
            var placeholderOffet = $("#" + plotThis.chartId).offset();
            var leftToView = x + placeholderOffet.left;
            var topToView = y + placeholderOffet.top;
            var tipsPosition = {};
            if( isFrontHalf){
                tipsPosition = {'top':topToView + 5,
                                'left': leftToView + 5,
                                'position' : "absolute",
                                'display':"block",
                                'padding' : "5px",
                                'color' : "#666",
                                'border' : "1px solid #dfdfdf",
                                'background-color' : "#ffffff",
                                'z-index':20000,
                                'pointer-events':"none"};
            }
            else{
                var rightToView = $(window).width() - leftToView;
                var bottomToView = $(window).height() - topToView;
                tipsPosition = {'bottom': bottomToView + 5,
                                'right':  rightToView + 5,
                                'position' : "absolute",
                                'display':"block",
                                'padding' : "5px",
                                'color' : "#666",
                                'border' : "1px solid #dfdfdf",
                                'background-color' : "#ffffff",
                                'z-index':20000,
                                'pointer-events':"none"};
            }
            plotThis.$tooltip.html(contents).removeAttr("style").css(tipsPosition);
        },
        
        "updateHoverTip" : function(x, y, contents) {
            var plotThis = this;
            plotThis.$tooltip.html(contents).css({
                'top': y - 7,
                'left' : x + 7,
                'position' : "absolute",
                'display':"block",
                'padding' : "5px",
                'color' : "#666",
                'border' : "1px solid #dfdfdf",
                'background-color' : "#ffffff",
                'z-index':20000,
                'pointer-events':"none"
            });
        },

        'resetThreshold' : function(threshold) {
            var plotThis = this;
            var thresholdOpts = [];
            var gridMarkings = [];
            var options = plotThis.getOptions();
            var flotLegendId = plotThis.optionsSet.flotLegendId;
            if (threshold && threshold.length > 0) {
                _.each(threshold, function(item) {
                    var thresholdItem = {};
                    var markingItem = {};
                    if (!_.isUndefined(item.below)) {
                        thresholdItem.below = item.below;
                        markingItem = {
                            yaxis : {
                                from : item.below,
                                to : item.below
                            },
                            'dashes' : {
                                "show" : true
                            }
                        };
                    }
                    !_.isUndefined(item.belowColor) ? thresholdItem.color = item.belowColor : "";
                    !_.isUndefined(item.lineColor) ? markingItem.color = item.lineColor : "";
                    thresholdOpts.push(thresholdItem);
                    gridMarkings.push(markingItem);
                });
                options.threshold = thresholdOpts;
                options.grid.markings = gridMarkings;
                plotThis.setupGrid();
                plotThis.draw();
            }
        },

        "resetGrid" : function(grid) {
            var plotThis = this;
            var options = plotThis.getOptions();
            var newGrid = _.extend({}, options.grid, grid);
            options.grid = newGrid;
            plotThis.setupGrid();
            plotThis.draw();
        },

        "resetLegend" : function(legend) {
            var plotThis = this;
            var options = plotThis.getOptions();
            var newLegend = _.extend({}, options.legend, legend);
            options.legend = newLegend;
            plotThis.setupGrid();
        },

"resetXaxis" : function(xaxis) {
            var plotThis = this;
            var options = plotThis.getOptions();
            var newXaxis = _.extend({}, options.xaxis, xaxis);
            options.xaxes = [];
            options.xaxis = newXaxis;
            options.xaxes.push(newXaxis);
            if (!_.isUndefined(options.xaxis.axisLabel) && !_.isUndefined(options.xaxis.axisLabelStyle)) {
                plotThis.xaxisLabelStyle = options.xaxis.axisLabelStyle;
            }
            var options = plotThis.getOptions();
            plotThis.setupGrid();
            plotThis.draw();
        },
        
        "resetYaxis" : function(yaxis) {
            var plotThis = this;
            var options = plotThis.getOptions();
            var newYaxis = _.extend({}, options.yaxis, yaxis);
            options.yaxis = newYaxis;
            plotThis.setupGrid();
            plotThis.draw();
        },


        '_setXaxis' : function(xaxisOpts) {
            var plotThis = this;
            plotThis.optionsSet.xaxis = $.extend(true,{}, DEFAULT_CONFIG.xaxis,xaxisOpts);
            var isaxisLabelValid = !_.isUndefined(xaxisOpts) 
                                   && !_.isUndefined(xaxisOpts.axisLabel) 
                                   && !_.isUndefined(xaxisOpts.axisLabelStyle)
            if (isaxisLabelValid) {
                plotThis.xaxisLabelStyle = xaxisOpts.axisLabelStyle;
            }
        },

        '_setYaxis' : function(yaxisOpts) {
            var plotThis = this;
            plotThis.optionsSet.yaxis = $.extend(true,{}, DEFAULT_CONFIG.yaxis,yaxisOpts);
        },

        "_setYaxisUnit" : function(yaxisOpts) {
               var plotThis = this;
               plotThis._element.prev("span#yaxisUnit").remove();
               var $yaxisUnit = $("<span id='yaxisUnit'></span>");
               $yaxisUnit.text(yaxisOpts.unit);
               $("#" + plotThis.chartId).before($yaxisUnit);
               var plotOffset = plotThis.lineObj.offset();
               var plotWidth = plotThis.lineObj.width();
               var unitWidth = $yaxisUnit.width();
               var unitHeight = $yaxisUnit.height();
               if (yaxisOpts.position == "right") {
                    var leftMove = plotOffset.left + plotWidth - unitWidth;
                    $yaxisUnit.css({
                         position : "absolute",
                         left : leftMove,
                         top : plotOffset.top - unitHeight - 23,
                         font : yaxisOpts.font
                    });
               } else {
                    $yaxisUnit.css({
                         position : "absolute",
                         left : plotOffset.left,
                         top : plotOffset.top - unitHeight - 23,
                         font : yaxisOpts.font
                    });
               }
          },

        "resizeChart" : function(width, height) {
            var plotThis = this;
            var widthNum = parseInt(width, 10);
            var heightNum = parseInt(height, 10);

            if (widthNum != NaN && widthNum > 0) {
                $("#" + plotThis.chartId).width(widthNum);
            }
            if (heightNum != NaN && heightNum > 0) {
                $("#" + plotThis.chartId).height(heightNum);
            }
            plotThis.resize();
            plotThis.setupGrid();
            plotThis.draw();
        },

        "reDrawLines" : function(newdata) {
            var plotThis = this;
            plotThis.setData(newdata);
            plotThis.setupGrid();
            plotThis.draw();
        },

        "_createChart" : function(placeholder, data, options) {
            var plotThis = this;
            plotThis.lineObj = $.plot($("#" + placeholder), data, options);
        },

        "setData" : function(newData) {
            var plotThis = this;
            plotThis.lineObj.setData(newData);
        },
        "setupGrid" : function() {
               var plotThis = this;
               var flotLegendId = plotThis.optionsSet.flotLegendId;
               plotThis.lineObj.setupGrid(flotLegendId);
               plotThis._updateUnit();
          },
          
          "_updateUnit":function(){
               var plotThis = this;
               var optThis = plotThis.lineObj.getOptions();
               var yUnit = optThis.yaxes[0].unit;
               if(!_.isUndefined(yUnit)){
                    plotThis._setYaxisUnit(optThis.yaxes[0]);
               }
          },
        "draw" : function() {
            var plotThis = this;
            plotThis.lineObj.draw();
        },
        "highlight" : function(series, datapoint) {
            var plotThis = this;
            plotThis.lineObj.highlight(series, datapoint);
        },
        "unhighlight" : function() {
            var plotThis = this;
            plotThis.lineObj.unhighlight(arguments);
        },
        "resize" : function() {
            var plotThis = this;
            plotThis.lineObj.resize();
        },
        "getData" : function() {
            var plotThis = this;
            plotThis.lineObj.getData();
        },
        "getOptions" : function() {
            var plotThis = this;
            return plotThis.lineObj.getOptions();
        }
    });
    return Lineplot;

});
