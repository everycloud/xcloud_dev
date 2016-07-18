define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-lib/d3", "tiny-common/util", "tiny-widgets/Select", "tiny-widgets/Slider", "tiny-widgets/Searchbox", "tiny-lib/jquery.tipsy", "language/widgetsLanguage"], 
function(angular, $, Class,  Widget, d3, util, Select, Slider, Searchbox, tipsy, language) {
    var SVG_OFFSET = 60,
        DEFAULT_SIZE = 700;
    
    var DEFAULT_CONFIG = {
        "width" : 700,
        "height" : 700,
        "axisStart" : 100,
        "axisEnd" : 0,
        "axisUnit" : "",
        "values" : {},
        "selectOptions" : {
            "display" : "block",
            "mode" : "single"  //此属性设置下拉选择框是否可以多选(可选值：single,multiple), 默认为单选.
        },
        "sliderOptions" : {
            "from" : 0,
            "to" : 100,
            "value" : 0,
            "step" : 1
        },
        "axisDisplay" : "none",
        "template" : '<div id="tiny-stellar-div"></div>'
    };
    var slider;
    var $toolsDiv;


    var Stellar = Widget.extend({
        "init" : function(options) {
            var stellarThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            stellarThis._super(options);
            stellarThis._setOptions(stellarThis.options);
            $("#" + options["id"]).append(stellarThis._element);
        },
        
        "_setOption" : function(key, value) {
            var stellarThis = this;
            var options = stellarThis.options;
                stellarThis._super(key, value),
                containId = options["id"];
            $toolsDiv = $("<div id='" + containId + "StellarTools' class='stellarTools clearfloat'></div");
            
            switch (key) {
                case "id":
                    stellarThis._updateId(value);
                    break;
                case "selectOptions":
                    $("#" + containId + " .tiny-select-input-field").css("display", value.display);
                    break;
                case "axisDisplay":
                    $("#" + containId + " .tick").css("display", value);
                    break;
                case "values":
                    var starValues = typeof (options["values"].starValues) == "undefined" ? [] : options["values"].starValues,
                        sectorValues = typeof (options["values"].sectorValues) == "undefined" ? [] : options["values"].sectorValues,
                        circleValues = typeof (options["values"].circleValues) == "undefined" ? [] : options["values"].circleValues;

                    stellarThis._creatTools();
                    $("#" + containId).append($toolsDiv);
                    stellarThis._creatStellar(sectorValues, circleValues, starValues);
                    break;
                default:
                    break;
            }
        },
        
        "_creatTools" : function() {
            var stellarThis = this;
            var options = stellarThis.options;
            
            var containId = options["id"],
                width = !isNaN(parseInt(options["width"], 10)) && parseInt(options["width"], 10) > 0 ? options["height"] : DEFAULT_SIZE, 
                height = !isNaN(parseInt(options["height"], 10)) && parseInt(options["height"], 10) > 0 ? options["height"] : DEFAULT_SIZE,
                starValues = typeof (options["values"].starValues) == "undefined" ? [] : options["values"].starValues,
                sectorValues = typeof (options["values"].sectorValues) == "undefined" ? [] : options["values"].sectorValues,
                circleValues = typeof (options["values"].circleValues) == "undefined" ? [] : options["values"].circleValues;
            
            //creat select
            stellarThis._creatSelect(sectorValues, circleValues, starValues);
                   
            // creat slider
            var option = { 
                id : containId,
                width : (width*180)/DEFAULT_SIZE,
                from : options["sliderOptions"].from || 0, 
                to: options["sliderOptions"].to || 100,
                value: options["sliderOptions"].value || 0,
                step: options["sliderOptions"].step || 1, 
                change: function(event, value){
                        // 判断用户是否触发了sliderchange事件
                        if ("function" == ( typeof options["sliderchange"])) {
                            return;
                        }
                        // 判断是否绑定了sliderchange事件
                        if (stellarThis.listeners.sliderchange) {
                            return;
                        }
                        
                        var fromValue = value.split(";")[0],
                            toValue = value.split(";")[1];
                        d3.selectAll('#' + containId + ' circle.stellarStar').style("display",
                                function(d) {
                                    if (fromValue == 0) {
                                    	fromValue = -2147483648;
                                    }
                                    if (d.distance >= fromValue && toValue == undefined) {
                                        return "block";
                                    }
                                    if ( d.distance >= fromValue && d.distance <= toValue ) { 
                                        return "block";
                                    }
                                    return "none";
                                });
                        }
            };
                
            slider = new Slider(option);
            var $sliderDiv = $("<div id='" + containId + "sliderDiv' style='float: left;'></div");
            slider.rendTo($sliderDiv);
            $sliderDiv.appendTo($toolsDiv);
            stellarThis._addBehaviorSlider(slider);
                
            // creat searchbox
            var searchOptions = {
                        "type" : "round",
                        "width" : 150,
                        "search" : function(searchString) {
                            // 判断用户是否触发了change事件
                            if ("function" == ( typeof options["search"])) {
                                options["search"](searchString);
                                return;
                            }
                        
                            var beforeCirleArray = d3.selectAll('#' + containId + ' circle.stellarStar[search=true]'),
                                beforLen = beforeCirleArray[0].length,
                                $beforeCirle;
                            for (var i = 0; i < beforLen; i++)
                            {
                                $beforeCirle = $(beforeCirleArray[0][i]);
                                d3.select(beforeCirleArray[0][i]).style("opacity", .5).attr("r", parseInt($beforeCirle.attr("initr"),10)).attr("search",false);
                            }
                            
                            if (searchString.trim() == "") {
                                return;
                            }
                            searchString = searchString.toLowerCase();
                            
                            var cirleArray = d3.selectAll('#' + containId + ' circle[name*="' + searchString + '"]'),
                                cirleLen = cirleArray[0].length,
                                $cirle,
                                r = 0;
                            for (var j = 0; j < cirleLen; j++) {
                                $cirle = $(cirleArray[0][j]);
                                try { 
                                    r = parseInt($cirle.attr("initr"),10) + 5;
                                } catch(error) {
                                    return;
                                }
                                d3.select(cirleArray[0][j])
                                  .attr("search",true).transition()
                                  .duration(800).style("opacity", 1)
                                  .attr("r", r).ease("elastic");
                            }    
                        }
                   };
              var searchbox = new Searchbox(searchOptions);
              var $searchboxDiv = $("<div id='" + containId + "searchboxDiv' style='float: left;'></div");
              searchbox.rendTo($searchboxDiv);
              $searchboxDiv.appendTo($toolsDiv);
        },
        
        "_creatSelect" : function(sectorValues, circleValues, starValues) {
            var stellarThis = this,
                options = stellarThis.options;
            
            var sectorData = [{
                label : language.selectAll,
                selectId : -1,
                checked : true
                    }],
                obj;
            for (var i = 0, sectorLen = sectorValues.length; i < sectorLen; i++) {
                obj = {};
                obj.label = sectorValues[i].sectorName;
                obj.selectId = sectorValues[i].sectorId;
                sectorData.push(obj);
            }
                    
            var select = new Select({
                width : 150,
                values : sectorData,
                mode : options["selectOptions"].mode,
                change : function() {
                        // 判断用户是否触发了selectchange事件
                        if ("function" == ( typeof options["selectchange"])) {
                            return;
                        }
                        // 判断是否绑定了selectchange事件
                        if (stellarThis.listeners.selectchange) {
                            return;
                        }
                    
                        var tmpSectorValues = [],
                            tmpStarValues = [];
                        slider.option("value", slider.options["from"] + ";" + slider.options["to"]);
                        
                        // 单选模式
                        if (options["selectOptions"].mode == "single") {
                            var selectValue = select.getSelectedId();
                            if ( selectValue == "-1")
                            {
                                return stellarThis._creatStellar(sectorValues, circleValues, starValues);  
                            }
                            for (var i = 0; i < sectorValues.length; i++) {
                                if (selectValue == sectorValues[i].sectorId) {
                                    tmpSectorValues.push(sectorValues[i]);
                                    break;
                                }
                            }
                            for (var k = 0; k < starValues.length; k++) {
                                if (selectValue == starValues[k].sectorId) {
                                    tmpStarValues.push(starValues[k]);
                                }
                            }
                            return stellarThis._creatStellar(tmpSectorValues, circleValues, tmpStarValues);
                        }
                        
                        // 多选模式
                        var selectIdArray = select.getSelectedId();
                        if (selectIdArray[0] == "-1") {
                            return stellarThis._creatStellar(sectorValues, circleValues, starValues);
                        }
                        for (var i = 0, idLen = selectIdArray.length; i < idLen; i++) {
                            for (var j = 0, sectorLen = sectorValues.length; j < sectorLen; j++) {
                                if (selectIdArray[i] == sectorValues[j].sectorId) {
                                    tmpSectorValues.push(sectorValues[j]);
                                    break;
                                }
                            }
                        }
                        for (var m = 0, sectorLen = tmpSectorValues.length; m < sectorLen; m++) {
                            for (var k = 0; k < starValues.length; k++) {
                                if (tmpSectorValues[m].sectorId == starValues[k].sectorId) {
                                    tmpStarValues.push(starValues[k]);
                                }
                            }
                        }

                        return stellarThis._creatStellar(tmpSectorValues, circleValues, tmpStarValues);
               }
            });
            var $selectDiv = $("<div id='" + containId + "selectDiv' style='float: left;'></div");
            select.rendTo($selectDiv);
            $selectDiv.appendTo($toolsDiv);
            stellarThis._addBehaviorSelect(select);
        },
        
        "_addBehaviorSelect" : function(widgetThis) {
            var stellarThis = this;
            var options = stellarThis.options;
            
            widgetThis.on("changeEvt", function(evt) {
                stellarThis.trigger("selectchange", [evt]);
                if ("function" == ( typeof options["selectchange"])) {
                    options["selectchange"](evt);
                }
            });
        },
        
        "_addBehaviorSlider" : function(widgetThis) {
            var stellarThis = this;
            var options = stellarThis.options;
            
            widgetThis.on("changeEvt",function(event,changeVal,a,b) {
                stellarThis.trigger("sliderchange",[event,changeVal]);
                if ("function" == ( typeof options["sliderchange"])){
                    options["sliderchange"](event,changeVal);
                }
            });
        },

        // 根据输入数据计算星际x,y坐标
        //a.    对输入的原始星际数据按所在星空分组;
        //b.    每个星空内数据按阈值进行分组; 
        //c.    不考虑星际大小, 根据分组内的数据量平均计算出各自的角度;
        //d.    根据角度计算出cx, cy值;
        //e.    原始数据中增加cx, cy属性并设置上一步计算出的值.
        "_calculateAxis" : function(sectorValues, circleValues, values) {
            var stellarThis = this;
            var options = stellarThis.options;
            
            var perSectorAngle = (2*Math.PI)/sectorValues.length,
                startSectorAngle = 0,
                countedValues = [],
                start = options["axisStart"],
                end = options["axisEnd"] >= 0 ? options["axisEnd"] : 0,
                limit = (start - end) / 4;

            
            for (var i = 0, sectorLen = sectorValues.length; i < sectorLen; i++) {
                var valueBySector = [];
                startSectorAngle = perSectorAngle*i;
                // 根据星空进行分组
                for (var j = 0, valuesLen = values.length; j < valuesLen; j++) {
                    if (sectorValues[i].sectorId == values[j].sectorId) {
                        valueBySector.push(values[j]);
                    }
                }  // end for j
                
                if (valueBySector.length == 0) {
                    continue;
                }
                
                var valueByCircle1 = [],
                    valueByCircle2 = [],
                    valueByCircle3 = [],
                    valueByCircle4 = [];
                
                // 根据坐标范围平均分成四组
                for (var n = 0, len = valueBySector.length; n < len; n++) {
                    if (valueBySector[n].distance >= limit * 3) {
                        valueByCircle1.push(valueBySector[n]);
                    }
                    else if (valueBySector[n].distance >= limit * 2 && valueBySector[n].distance < limit * 3) {
                        valueByCircle2.push(valueBySector[n]);
                    }
                    else if (valueBySector[n].distance >= limit && valueBySector[n].distance < limit * 2) {
                        valueByCircle3.push(valueBySector[n]);
                    }
                    else {
                        valueByCircle4.push(valueBySector[n]);
                    }
                }  // end for n
                
                // 计算每个阈值范围内的角度: Math.cos参数是弧度, 所以此处均转换为弧度
                this._subCalculateAxis(perSectorAngle, startSectorAngle, valueByCircle1, circleValues, countedValues);
                this._subCalculateAxis(perSectorAngle, startSectorAngle, valueByCircle2, circleValues, countedValues);
                this._subCalculateAxis(perSectorAngle, startSectorAngle, valueByCircle3, circleValues, countedValues);
                this._subCalculateAxis(perSectorAngle, startSectorAngle, valueByCircle4, circleValues, countedValues);
                
            }  // end for i
            
            return countedValues;
        },

        "_subCalculateAxis" : function(perSectorAngle, startSectorAngle, valueByCircle, circleValues, countedValues) {
            if (valueByCircle.length == 0) {
                return;
            }
            
            var stellarThis = this;
            var options = stellarThis.options;
            var width = !isNaN(parseInt(options["width"], 10)) && parseInt(options["width"], 10) > 0 ? options["height"] : DEFAULT_SIZE, 
                height = !isNaN(parseInt(options["height"], 10)) && parseInt(options["height"], 10) > 0 ? options["height"] : DEFAULT_SIZE,
                start = options["axisStart"],
                end = options["axisEnd"],
                perStarAngle = 0,  // 星空内每个星角度
                starAngle = 0,  // 星角度
                cx = 0,
                cy = 0,
                r = 0, 
                faultR = circleValues[0].radius/2,
                radius = d3.scale.linear().domain([start, end]).range([0, d3.min([width, height]) / 2 - SVG_OFFSET]);
            
            // 设置星坐标与填充颜色
            for (var m = 0, len = valueByCircle.length; m < len; m++) {
                perStarAngle = perSectorAngle/(valueByCircle.length + 1);
                starAngle = startSectorAngle + perStarAngle*(m + 1);
                r = valueByCircle[m].distance;
                
                if (valueByCircle[m].distance < 0) {
                    valueByCircle[m].cx = radius(faultR) * Math.cos(starAngle);
                    valueByCircle[m].cy = -radius(faultR) * Math.sin(starAngle);
                    
                    valueByCircle[m].starColor = circleValues[0].starColor;
                } else {
                    valueByCircle[m].cx = radius(r) * Math.cos(starAngle);
                    valueByCircle[m].cy = -radius(r) * Math.sin(starAngle);
                    
                    // 根据同心圆范围设置星填充颜色
                    for (var n = 0, circleLen = circleValues.length; n < circleLen - 1; n++) {
                        if (r >= circleValues[n].radius && r < circleValues[n + 1].radius) {
                            valueByCircle[m].starColor = circleValues[n].starColor;
                        }
                        else if (r >= circleValues[n + 1].radius) {
                            valueByCircle[m].starColor = circleValues[n + 1].starColor;
                        }
                    }
                }
                
                countedValues.push(valueByCircle[m]);
            }
        },
        
        // 创建星空图
        "_creatStellar" : function(sectorValues, circleValues, starValues) {
            var stellarThis = this;
            var options = stellarThis.options;
            
            var containId = options["id"],
                width = !isNaN(parseInt(options["width"], 10)) && parseInt(options["width"], 10) > 0 ? options["width"] : DEFAULT_SIZE, 
                height = !isNaN(parseInt(options["height"], 10)) && parseInt(options["height"], 10) > 0 ? options["height"] : DEFAULT_SIZE,
                num_axes = sectorValues.length, //把圆平分为N个扇形
                tick_axis = 0, 
                start = options["axisStart"],
                end = options["axisEnd"];
                
            // 计算最大圆半径:画布的长宽最小值的一半减去50像素
            var radius = d3.scale.linear().domain([start, end]).range([0, d3.min([width, height]) / 2 - SVG_OFFSET]);

            // 只生成一次svg
            var svg = d3.select("#" + containId + " .stellarGroup");
            if ($("#" + containId + " .tiny-stellar").length == 0) {
                svg = d3.select("#" + containId)
                        .style("width", options["width"] + "px")
                        .append("svg")
                        .attr({ "class" : "tiny-stellar",
                                "width": width,
                                "height": height
                              })
                        .append("g")
                        .attr("class", "stellarGroup")
                        .attr("transform", "translate(" + (width / 2 - 8) + "," + (height / 2) + ")");
            }
            if (sectorValues.length >= 0) {
                $("#" + containId + " .sectorLabel").remove();
                $("#" + containId + " .stellarSector").remove();
            }
            if (circleValues.length > 0) {
                $("#" + containId + " .stellarCircle").remove();
                $("#" + containId + " .stellarLegend").remove();
                $("#" + containId + " .legendText").remove();
            }
            $("#" + containId + " .stellarStar").remove();
            $(".tipsy-s").remove();

            // 生成同心圆
            svg.selectAll("circle.stellarCircle")
               .data(circleValues)
               .enter()
               .append("circle")
               .attr("class", "stellarCircle")
               .style({ "fill" : function(d) { return d.fillColor; },
                        "stroke" : function(d) { return d.strokeColor; },
                        "stroke-dasharray" : function(d) { return d.strokeDasharray; }
                     })
               .attr({ "cx" : 0,
                       "cy" : 0,
                       "r"  : function(d) { return radius(d.radius); }
                       });
        
            // 生成扇形
            var angle = d3.scale.linear().domain([0, num_axes]).range([0, 360]);
            var sector = svg.selectAll(".stellarSector")
                            .data(d3.range(num_axes))
                            .enter()
                            .append("g")
                            .attr("class", "stellarSector")
                            .attr("transform", function(d) { return "rotate(" + -angle(d) + ")"; })
                            .call(radial_tick);
            $("#" + containId + " .tick").css("display", options["axisDisplay"]);

            // 扇形文本    
            var datumX = Math.cos(Math.PI/sectorValues.length),
                datumY = -Math.sin(Math.PI/sectorValues.length),
                datumR1 = d3.min([width, height]) / 2 - 50,
                datumR2 = d3.min([width, height]) / 2 - 10;
            sector.append("g")
                  .data(sectorValues)
                  .attr("transform", function(d, i) {
                              if (((360/sectorValues.length)*i > 90) && ((360/sectorValues.length)*i < 240)
                                  && (sectorValues.length > 2)) {
                                  return "translate(" + (datumX * datumR2 - 2) + "," + datumY * datumR2 + ")"; 
                              } else if(sectorValues.length == 1) {
                                  return "translate(0," + -datumR1 + ")";
                              }
                               return "translate(" + datumX * datumR1 + "," + datumY * datumR1 + ")"; 
                           })
                  .append("text")
                  .attr({"class" : "sectorLabel",
                         "transform" : function(d, i)  { return "rotate(" + (360/sectorValues.length)*i + ")"; },
                         "lengthAdjust" : "spacingAndGlyphs"
                       })
                  .text(function(d) { return d.sectorName; });
                  
            $("#" + containId + " .sectorLabel").tipsy({ 
                gravity: 's',  // nw | n | ne | w | e | sw | s | se
                html: true, 
                delayIn: 500,
                delayOut: 500,
                opacity: 1,
                title: function() {
                  var d = this.__data__;
                  return d.sectorTips; 
                }
            });      

            // 增加图例
            var legendAxis = radius(0) - 57;
            var legend = svg.selectAll("circle.legend")
                            .data(circleValues)
                            .enter()
                            .append("circle")
                            .style("fill", function(d) { return d.starColor; })
                            .attr({ "class" : "stellarLegend",
                                    "cx" : legendAxis + 55,
                                    "cy" : function(d, i) { return -(legendAxis + i*14 + 23); },
                                    "r" : 5
                                 });

            // 图例文字
            svg.selectAll("circle.legendtext")
               .data(circleValues)
               .enter()
               .append("text")
               .attr({ "class" : "legendText",
                          "x" : legendAxis + 65,
                          "y" : function(d, i) { return -(legendAxis + (i * 14) + 18); }
                    })
               .text(function(d) { return d.circleDesc; });
            
            // 坐标单位
            if (options["axisDisplay"] != "none" && options["axisUnit"] != "") {
                svg.append("text")
                   .attr({ "class" : "stellarTickUnit",
                              "x" : d3.min([width, height]) / 2 - 45,
                              "y" : 15
                        })
                   .text(options["axisUnit"]);   
            }
            
            // 绘制星
            var margin = {t : 0, r : 20, b : 20, l : 0};
            var groups = svg.append("g").attr("transform", "translate(" + margin.l + "," + margin.t + ")");
            var starData =  stellarThis._calculateAxis(sectorValues, circleValues, starValues);
            var circles = groups.selectAll("circle")
                                .data(starData)
                                .enter()
                                .append("circle")
                                .attr("class", "stellarStar")
                                .attr({ cx : function(d) { return d.cx; },
                                        cy : function(d) { return d.cy; },
                                        r : function(d) { return d.radius;    },
                                        initr : function(d) { return d.radius;    },
                                        name : function(d) { return d.starName.toLowerCase(); },
                                        sectorname : function(d) {    return d.sectorName; }
                                     })
                                .style("fill", function(d) { return d.starColor; })
                                .style("opacity", .5);
        
            var mouseOn = function() {
                var circle = d3.select(this);

                var r = parseInt(circle.attr("initr"),10) +5;
                // transition to increase size/opacity of bubble
                circle.transition()
                      .duration(800)
                      .style("opacity", 1)
                      .attr("r", r)
                      .ease("elastic");

                // function to move mouseover item to front of SVG stage, in case
                // another bubble overlaps it
                d3.selection.prototype.moveToFront = function() {
                    return this.each(function() {
                        this.parentNode.appendChild(this);
                    });
                };
            };
            // what happens when we leave a bubble?
            var mouseOff = function() {
                var circle = d3.select(this);
                var r = parseInt(circle.attr("initr"),10);

                // go back to original size and opacity
                circle.transition()
                      .duration(800)
                      .style("opacity", .5)
                      .attr("r", r)
                      .ease("elastic");

                // fade out guide lines, then remove them
                d3.selectAll(".guide").transition().duration(100).styleTween("opacity", function() {
                    return d3.interpolate(.5, 0);
                }).remove();
            };

            circles.on("mouseover", mouseOn);
            circles.on("mouseout", mouseOff);

            // tooltips (using jQuery plugin tipsy)
            $("#" + containId + " .stellarStar").tipsy({ 
                gravity: 's',  // nw | n | ne | w | e | sw | s | se
                html: true, 
                delayIn: 500,
                delayOut: 500,
                opacity: 1,
                title: function() {
                  var d = this.__data__;
                  return d.starTips; 
                }
            });
                    
            function radial_tick(selection) {
                selection.each(function(axis_num) {
                    d3.svg.axis()
                    .scale(radius)
                    .ticks(10)
                    .tickValues( axis_num == tick_axis ? null : [] )
                    .orient("bottom")(d3.select(this));
                });
            }
        },
        
        "update" : function(values) {
            var stellarThis = this,
                options = stellarThis.options,
                starValues = typeof (values.starValues) == "undefined" ? [] : values.starValues,
                sectorValues = typeof (values.sectorValues) == "undefined" ? options["values"].sectorValues : values.sectorValues,
                circleValues = typeof (values.circleValues) == "undefined" ? options["values"].circleValues : values.circleValues;
            
            // sector数据变化, 需要重绘select控件
            if (options.selectOptions.display != "none") {
                stellarThis._creatSelect(sectorValues, circleValues, starValues);
            }
            
            stellarThis._creatStellar(sectorValues, circleValues, starValues);
        },
        
        "resetSlider" : function(value) {
            slider.option("value", value);
        }

    });

    return Stellar;
}); 