define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-widgets/Widget", "tiny-lib/raphael"], 
function(angular, $, Widget, Raphael) {
	var DEFAULT_CONFIG = {
		"id" : document.body, //容器对象，可以为id，html元素
		"percent" : true,
		"legendHeight" : 20, //图例高度
		"legendWidth" : 190, //图例预留宽度
		"legendFontSize" : 12, //图例文本字体大小
		"legendFontColor" : "#666666", //图例文本颜色
		"height" : 180, //高度
		"width" : 500, //宽度
		"shadowImgUrl" : "../themes/default/images/circle_bottom_back.png", //底部阴影图片
		"centerText" : {
			text : "",
			fontSize : 46,
			color : "#ff9f21"
		}, //圆环中心内容
		"showShadow" : true, //是否显示底部阴影
		"showLegend" : true, //是否显示图例,默认为true
		"showClickEvent" : true, //是否启用点击事件
		"data" : null, //数据源
		"rotate" : 0, //起始角度，不能等于0，大于180度，
		"r" : 50, //圆半径
		"hasAnimate" : true,
		"animateTime" : 1000, //动画执行时间
		"strokeWidth" : 20//圆环大小
	};
	var Cirquechart = Widget.extend({
		"init" : function(options) {
			var widgetThis = this;
			widgetThis.options = {};
			_.extend(widgetThis.options, DEFAULT_CONFIG, options);
			widgetThis._super(widgetThis.options);
			widgetThis.width = parseInt(widgetThis.options.width, 10);
			widgetThis.height = parseInt(widgetThis.options.height, 10);
			var cirqueId = "tiny-cirqueChart-container" + new Date().getTime();
			var $cirqueContainer = $('<div id=' + cirqueId + ' style="position:relative;"></div>');
			$("#" + widgetThis.options.id).append($cirqueContainer);
			widgetThis.paper = Raphael(cirqueId, widgetThis.width, widgetThis.height);
			widgetThis.pi = Math.PI;
			widgetThis.r = parseInt(widgetThis.options.r, 10);
			widgetThis.strokeWidth = widgetThis.options.strokeWidth;
			widgetThis._savePath(widgetThis.options.data);

			//add shadow
			if (widgetThis.options.showShadow) {
				var $imageDiv = $("<div class='tiny-cirque-shadow'></div>");
				$cirqueContainer.append($imageDiv);
				$imageDiv.css({

					//image width/2 --74;
					left : widgetThis.center[0] - 74,
					top : widgetThis.center[1] + widgetThis.r - 6
				});
			}
		},

		"_savePath" : function(data) {
			var widgetThis = this, options = widgetThis.options, rotate = widgetThis.pi * 2 * (parseInt(options.rotate, 10) / 360);
			widgetThis.paper.clear();
			widgetThis.center = [];
			widgetThis.view = [];
			widgetThis.angles = [];
			if (!options.showLegend) {
				options.legendWidth = 0;
			}
			widgetThis.center[0] = (widgetThis.width - options.legendWidth) / 2;
			widgetThis.center[1] = widgetThis.height / 2;
			widgetThis.angles.push(rotate);
			var tempAngel, align = 0;
			var totalNum = 100;
			if ("true" !== String(options.percent)) {
				totalNum = 0;
				var maxNum = data[0].value;
				for (var i = 0, len = data.length; i < len; i++) {
					var value = data[i].value;
					totalNum += value;
					if (value > maxNum) {
						maxNum = value;
					}
				}
				widgetThis.maxNum = maxNum;
			}
			if (0 == this._getTotalNumber(data)) {
				widgetThis._createCirTotalNum0();
			} else {
				for (var i = 0, len = data.length; i < len; i++) {
					align = data[i].value / totalNum;
					tempAngel = widgetThis.angles[i] + widgetThis.pi * 2 * (align);
					if (align == 1 || align == 0) {
						tempAngel -= 0.0001
					}
					widgetThis.angles.push(tempAngel);
					var color = data[i].color;
					var linearGradient = data[i].linearGradient;
					if (linearGradient) {
						var linerColor = "";
						linerColor += (linearGradient.angle || 100) + "-" + linearGradient.startColor + "-" + linearGradient.endColor;
						color = linerColor;
						data[i].color = linearGradient.startColor;
					}
					var path = widgetThis.paper.path().attr({
						"fill" : color
					});
					widgetThis.view.push(path);
				}
				widgetThis._createCir(data, 0);
			}

			var centerText = options.centerText;
			if (centerText && centerText.text !== "") {
				widgetThis.paper.text((widgetThis.center[0]), (widgetThis.center[1]), centerText.text).attr({
					"font-size" : centerText.fontSize,
					"fill" : centerText.color
				});
			}

			widgetThis._createLegend(data);
			if (options.showClickEvent) {
				$.each(widgetThis.view, function(i, pathi) {
					pathi.click(function() {
						if ("function" === typeof data[i].click) {
							data[i].click();
						}
					});

					pathi.hover(function() {
						if ("function" === typeof data[i].click) {
							pathi.attr({
								"cursor" : "pointer"
							});
						}
					});
					//addTip
					if (data[i].tooltip) {
						pathi.tp = $('<div class = "tiny-cirque-tip">' + data[i].tooltip + '</div>');
						pathi.mouseover(function(event) {
							pathi.tp.css({
								"left" : event.pageX,
								"top" : event.pageY
							});
							$("body").append(pathi.tp);
						});
						pathi.mouseout(function(event) {
							pathi.tp.remove();
						});
					}
				});
			}
		},

		"_createCirTotalNum0" : function() {
			var widgetThis = this, options = widgetThis.options;
			var circleR = widgetThis.r - options.strokeWidth / 2, x = widgetThis.center[0], y = widgetThis.center[1];
			widgetThis.paper.circle(x, y, circleR).attr({
				"fill" : "none",
				"stroke" : options.defaultColor||"#ccc",
				"stroke-width" : options.strokeWidth
			});
		},

		"_createCir" : function(data, index) {
			var widgetThis = this, options = widgetThis.options;
			var tempSAngle, tempEAngle, path, flag, newAngle = 0, outR = widgetThis.r, innerR = outR - options.strokeWidth, tempIndex = 0;
			var addAngle = 0, animateTime = options.animateTime / 36, delAngle = 1 / innerR;

			tempSAngle = widgetThis.angles[index];
			newAngle = tempSAngle;
			tempEAngle = widgetThis.angles[index + 1] - delAngle;
			if (options.hasAnimate) {
				var time = window.setInterval(function() {
					if (tempIndex != 0) {
						addAngle = Math.PI * 2 * 1 / 36;
					}
					newAngle = newAngle + addAngle;
					if (newAngle > tempEAngle) {
						newAngle = tempEAngle;
					}
					flag = ((newAngle - tempSAngle) > widgetThis.pi) ? 1 : 0;
					/*大小弧度*/
					path = widgetThis._getDoubleCilclePath(tempSAngle, newAngle, innerR, outR, flag, widgetThis.center);
					var paper = widgetThis.view[index];
					paper.attr({
						"path" : path,
						"stroke" : 0
					});
					tempIndex++;
					if (newAngle == tempEAngle) {
						if (index + 1 <= data.length - 1) {
							widgetThis._createCir(data, index + 1);
						}
						clearInterval(time);
					}
				}, animateTime);
			} else {
				flag = ((tempEAngle - tempSAngle) > widgetThis.pi) ? 1 : 0;
				/*大小弧度*/
				path = widgetThis._getDoubleCilclePath(tempSAngle, tempEAngle, innerR, outR, flag, widgetThis.center);
				var paper = widgetThis.view[index];
				paper.attr({
					"path" : path,
					"stroke" : 0
				});
				if (index + 1 <= data.length - 1) {
					widgetThis._createCir(data, index + 1);
				}
			}
		},

		"_createLegend" : function(data) {
			var widgetThis = this, options = widgetThis.options;
			if (options.showLegend) {
				var datalen = data.length;
				if (0 !== datalen % 2) {
					var y = widgetThis.center[1] - parseInt(datalen / 2) * 24;
				} else {
					var y = widgetThis.center[1] - (datalen / 2) * 24 + 12;
				}
				var x = widgetThis.center[0] + widgetThis.r + 60 + 6;
				var circleY;
				for (var i = 0; i < datalen; i++) {
					circleY = y + 24 * i;
					var maxLen = data[i].name.length;
					var legendcolor = "";
					if (data[i].linearGradient) {
						var linerColor = "";
						linerColor += (data[i].linearGradient.angle || 100) + "-" + data[i].linearGradient.startColor + "-" + data[i].linearGradient.endColor;
						legendcolor = linerColor;
					}
					widgetThis.paper.circle(x, circleY, 6).attr({
						"fill" : "none",
						"stroke" : data[i].color,
						"stroke-width" : 2
					});
					if ("true" !== String(options.percent)) {

						//circle-right:14/2, margin-left:6
						textvalueX = x + 7 + 6;
						textY = circleY;

						//margin-left:10, single num width---7
						textX = textvalueX + 10 + (widgetThis.maxNum.toString().length) * 7;
						var value = data[i].value, textAnchor = "start";
					} else {

						//circle-right:14/2, margin-left:6,percentR-width:25						textvalueX = x + 7 + 6 + 25;
						textY = circleY;

						//margin-left:10;
						textX = textvalueX + 10;

						//value
						var value = data[i].value + "%", textAnchor = "end";

					}
					widgetThis.paper.text(textvalueX, textY, value).attr({
						"font-family" : "Helvetica",
						"font-size" : options.legendFontSize,
						"fill" : "#222222",
						"text-anchor" : textAnchor
					});
					widgetThis.paper.text(textX, textY, data[i].name).attr({
						"font-family" : "Microsoft YaHei",
						"font-size" : options.legendFontSize,
						"fill" : options.legendFontColor,
						"text-anchor" : "start"
					});
				}
			}
		},
		"_getDoubleCilclePath" : function(sdeg, edeg, rInner, rOuter, flag, center) {
			//获取圆环路径
			/*外弧起点坐标*/
			startX = center[0] + Math.cos(sdeg) * rOuter;
			startY = center[1] + Math.sin(sdeg) * rOuter;
			/*内弧起点坐标*/
			startInnerX = center[0] + Math.cos(sdeg) * rInner;
			startInnerY = center[1] + Math.sin(sdeg) * rInner;

			/*外弧结束坐标*/
			endX = center[0] + Math.cos(edeg) * rOuter;
			endY = center[1] + Math.sin(edeg) * rOuter;
			/*内弧结束坐标*/
			endInnerX = center[0] + Math.cos(edeg) * rInner;
			endInnerY = center[1] + Math.sin(edeg) * rInner;

			var path = "M" + startX + "," + startY + "A" + rOuter + "," + rOuter + " 0 " + flag + " 1 " + endX + "," + endY + "L" + endInnerX + "," + endInnerY + "A" + rInner + "," + rInner + " 0 " + flag + " 0 " + startInnerX + "," + startInnerY + "Z";
			return path;
		},
	        "_getTotalNumber": function(data) {
	            if(!data) {
	                return 0;
	            }
	            var number = 0;
	            for(var i= 0, len = data.length; i < len; i++) {
	                number += data[i].value;
	            }
	            return number;
	        }
	});

	return Cirquechart;

});
