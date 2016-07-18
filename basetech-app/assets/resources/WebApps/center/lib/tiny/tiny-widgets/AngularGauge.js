/**
 * Tiny AngularGauge widget. 利用D3.js技术完成的角度仪表盘.
 * 版本日期  2014-4-29,10:30
 * 
 * [DOM组成说明]：
 * <svg class='tinyGaugeSvg'>......................控件整体
 *       <path class="tinyArcClass"></path>........各个圆环色段
 *       <line> </line>............................主刻度和小刻度线
 *       <text class="tinyTicksTexts"></text>......主刻度文本
 *       <circle> </circle>........................指针原点实心圆
 *       <path></path>.............................指针路径
 *       <text class="tinyUnitText"></text>........单位文本
 *       <text class="tinyCurValueText"></text>....当前值文本
 * </svg>
 * 
 * [属性]：
 * width：                 Number/String         设置画布的宽度
 * height：               Number/String         设置画布的高度
 * transitionDuration：     Number         设置动画过渡时间(ms)
 * needleColor :         Number         设置指针颜色
 * clazz：                 Object                设置矩形外框的样式
 *                {
 * 	                "fill": 'gray',     设置背景 色
                    "stroke": 'gray',   设置边框色
                    "stroke-width": 1,  设置边框宽度
                    "opacity":0.1       设置透明度
 *                }
 * ranges:        [Object](必须),       用来设置仪表盘数值范围及对应的色段
 *                [{
 * 	               from: Number,        起始数据值
 *                 to:Number,           结束数据值
 *                 color:"XXX"          该字段对应的颜色
 *                },...] 
 * curValue:      Number, 指针应指向的当前值,默认情况下为用户设置的数据范围的最小值
 * startAngle:    Number, 色段圆环的的起始角度
 * endAngle:      Number, 色段圆环的的终止角度
 * majorTicks:    Object, 设置主刻度范围及样式
 *                {
 * 	                values：[Number,Number,...]   设置主刻度线的位置（相对于仪表盘的取值范围）
 *                  style：{
 * 	                        length：Number,       设置主刻度线长度
 *                          fill：color,          设置主刻度线颜色  
 *                          stroke-width: Number, 设置主刻度线宽度
 *                          }
 *                 }
 * minorTicks:    {
 * 	                interval: Number,             设置两条主刻度线之间的小刻度线之间的数值间隔
 *                  style：{
 * 	                length：Number,               设置小刻度线长度
 *                  fill：color,                  设置小刻度线颜色  
 *                  stroke-width: Number,         设置小刻度线宽度
 *                  }
 *                 }
 * title:         Object,                         设置指针下方文本显示。
 *                {
 * 	               text: String,                   默认为指针指向的当前值curValue,可以通过关键字"%x"表示当前值，"%x.n"表示对当前值取n位小数
 *                 textStyle: {                    设置文本样式
 * 	               "fill": "#2DABC1",              文本颜色
 *       	 	   "font": "12px Courier",         文本字体大小
 *                 } 
 *                 rectStyle: {                    设置文本外围矩形框的样式
 * 	               "fill": "#ccc",                 背景色
        		   "stroke": "#666",               边框色
        		   "stroke-width": "1px",          边框宽度
        		   "opacity": 0.5                                   不透明度
 *                 }      
 *                }
 * ticksLabel:   Object,                           用来设置刻度文本
 *               {
 * 	              step: 1,                         文本相对于主刻度的步长
 *                unit:"",                         单位文本，显示于指针原点上方
 *                labelStyle:{                     刻度文本样式
 *      	 	  "fill": "gray",
 *       	 	  "font": "11px Courier "
 *       	      },
 * 	              unitStyle:{                      单位文本样式
 *      	 	  "fill": "#2DABC1",
 *      	 	  "font": "12px Courier"
 *      	      }
 *                }                         
 *
 * [方法]：
 * 对各属性值的设置和获取可以采用option方法：gaugeThis.option(key[,value])
 * [事件]：
 * 暂无
 **/

define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-lib/d3", "tiny-widgets/Widget"], function(angular, $, Class, d3, Widget) {
 var domTemplate = "<svg class='<%=tinyGaugeSvg%>'></svg>";
 var DEFAULT_CONFIG = {
        "template" : domTemplate,
        "width": 300, 
        "height": 300,
        "clazz": {
           "fill": 'gray',  
           "stroke": 'gray', 
           "stroke-width": 1,
           "opacity":0.1    
        },
        "ranges": [],
        "curValue": 60,
        "startAngle": -120,
        "endAngle": 120,
        "majorTicks": {
        	"style":{
        		"length": 16,
        		"stroke":"gray",
        		"stroke-width": 1
        	}
        },
        "minorTicks": {
        	"style":{
        		"length": 10,
        		"stroke":"gray",
        		"stroke-width": 1
        	}
        },
        "needleColor": "red",
        "title":{
        	"text": "",
        	"textStyle":{
        		"fill": "#2DABC1",
        	 	"font": "11px Courier",
        	 	"text-anchor": "middle"
        	},
        	"rectStyle":{
        		"fill": "#ccc",
        		"stroke": "#666",
        		"stroke-width": "1px",
        		"opacity": 0.5
        	}
        },
        "ticksLabel": {
        	 "step":1,
        	 "unit":"%",
        	 "labelStyle":{
        	 	"fill": "gray",
        	 	"font": "11px Courier "
        	 },
        	 "unitStyle":{
        	 	"fill": "#2DABC1",
        	 	"font": "12px Courier",
        	 	"text-anchor": "middle"
        	 }
        },
        "transitionDuration":1000
    };
    
    var CONSTANT_CONFIG = {
    	MAJOR_TICKS_NUM: 5,         //主刻度线数
        MINOR_TICKS_NUM: 9,         //两条主刻度之间的小刻度线数
        OUTER_RADIUS_RADIO: 0.96,   //外圆所占的比率
        INNER_RADIUS_RADIO: 0.86,   //内圆所占的比率
        MARGIN_TOP: 0.05,           //主刻度与色带之间间隔（相对于内圆半径的比率）
        TEXT_PADDING: 0.05,         //刻度文本与主刻度之间间隔（相对于内圆半径的比率）
        CENTER_INNER_RADIUS: 0.025, //指针原点小圆半径（相对于内圆半径的比率）
        CENTER_OUTER_RADIUS: 0.05,  //指针原点实心圆半径（相对于内圆半径的比率）
        UNIT_TEXT_RADIO: 0.6,       //单位文本与色带之间间隔（相对于内圆半径的比率）
        CUR_VALUE_TEXT_RADIO: 0.3,  //当前值文本与指针原点之间的间隔（相对于内圆半径的比率）
        TEXT_HEIGHT_PADDING : 0.2   //设置当前值文本元素与外围矩形之间的间隔（相对于文本text元素高度的比率）
    };
    
    var AngularGauge = Widget.extend({
    	"init": function(options){
    		var gaugeThis = this;
            var options = $.extend(true, {}, DEFAULT_CONFIG, options);
            gaugeThis._super(options);
            gaugeThis.createChart(options); 
    	},
    	
    	/**		
	     * 绘制仪表盘的各个部分
	     */
    	"createChart": function(options){            //目前作为内部函数，后续可能会开放出去，故次数函数名前未加下划线
    		var gaugeThis = this;
    		gaugeThis._element.children().remove();  //清除已经存在的元素
    		if (0 == options.ranges.length){         //若未设置数据，则不绘制图表
    			return;
    		}
    		gaugeThis._parseRanges();                //解析数据
    		gaugeThis._calcCenterAndRadius();        //确定仪表盘圆心和半径
    		gaugeThis._setSvgContainer();            //给svg容器加style
    		gaugeThis._setAngleScale();              //根据设置的角度范围设置线性比例尺，并将输出角度转换为弧度
    		gaugeThis._renderRectFrame();            //绘制矩形边框
    		gaugeThis._renderArc();                  //绘制圆环色段
            gaugeThis._renderTicks();                //绘制主刻度(同时也实现绘制主刻度之间的小刻度)
            gaugeThis._renderMajorTicksTexts();      //绘制主刻度线对应的文本
            gaugeThis._renderNeedle();               //绘制指针
            gaugeThis._renderUnitText();             //绘制单位文本 
            gaugeThis._renderCurValueText();         //绘制当前值文本
    	},
    	
    	/**		
	     * 渲染矩形外框
	     */
    	"_renderRectFrame": function(){
    		var gaugeThis = this;
    		var rectFrameClass = "tinyRectFrame";
    		var rectData = [gaugeThis.options.style];
    	    var rectFrameElement = gaugeThis.svgContainer.selectAll("rect." + rectFrameClass).data(rectData);
          
           // 新增rect元素
           rectFrameElement.enter()
              .append("rect")
              .attr("class", rectFrameClass)
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", gaugeThis.options.width)
              .attr("height", gaugeThis.options.height)
              .style(gaugeThis.options.clazz);
              
          // 根据新的文本内容更新矩形外框并设置动画
	   	  rectFrameElement.transition()
              .duration(100)
              .style(gaugeThis.options.clazz);
    	},
    	
    	/**		
	     * 根据设置的角度范围设置线性比例尺，并将输出角度转换为弧度
	     */
    	"_setAngleScale": function(){
    		var gaugeThis = this;
    		var options = gaugeThis.options;
    		gaugeThis.angleScale = d3.scale.linear()
    		    .domain([gaugeThis.minLimit, gaugeThis.maxLimit])
                .range([options.startAngle * (Math.PI / 180), options.endAngle * (Math.PI / 180)]);
    	},
    	
    	/**		
	     * 绘制圆环色段
	     */
    	"_renderArc": function(){
    		var gaugeThis = this;
    		 // 将原点转换到仪表盘圆心
    		var translate = "translate(" + gaugeThis.cx + "," + gaugeThis.cy + ")";  
    		
    		// 获得圆环色带的路径
            var arc = d3.svg.arc()
                .innerRadius(gaugeThis.innerRadius)
                .outerRadius(gaugeThis.outterRadius)
                .startAngle(function (d) { return gaugeThis.angleScale(d[0]); })
                .endAngle(function (d) { return gaugeThis.angleScale(d[1]); });
                
            // 根据数据绘制色带    
            gaugeThis.svgContainer.selectAll("path")
                .data(gaugeThis.dataSource)
                .enter()
                .append("path")
                .attr("class", "tinyArcClass")
                .attr("d", arc)
                .style("fill", function (d) { return d[2]; })
                .attr("transform", translate);
    	},
    	
    	/**		
	     * 创建用来容纳仪表盘的svg元素(作为画布)
	     */
    	"_setSvgContainer": function(){ 
    		var gaugeThis = this;
    		var options = gaugeThis.options;
    		gaugeThis.svgContainer = d3.select("." + gaugeThis.svgContainerClass)
			    .attr("width", options.width)
			    .attr("height", options.height);
    	},
    	
    	/**		
	     * 创建控件外层元素
	     */
    	 "_generateElement" : function() {
            var gaugeThis = this;
            gaugeThis.svgContainerClass = _.uniqueId('svgContainer_');
            var html = _.template(gaugeThis.options.template)({tinyGaugeSvg: gaugeThis.svgContainerClass});
            //svg元素必须先放置在页面中才能绘制,故此处先appendTo
            return $(html).appendTo($("#"+ gaugeThis.options.id));     
        },
    	
    	/**		
	     * 确定仪表盘圆心和半径
	     * 1.使得仪表盘最大程度利用用户所给的空间
	     * 2.使得仪表盘尽可能处于用户所给空间的中央
	     */
    	"_calcCenterAndRadius": function(){
    		var gaugeThis = this;
    		var options = gaugeThis.options;
    		// 将起始和结束角度转换为四象限中的角度
    		var startAngle = 90 - options.startAngle;
    		var endAngle = 90 - options.endAngle;
    		
    		 // 设定参考圆的圆心为(0,0),半径为100;
    		var referRadius = 100, cx = 0, cy = 0;
    		var xMin = xMax = yMax = 0; 
    		//预留指针下面文字空间 
    		var yMin = (referRadius * CONSTANT_CONFIG.INNER_RADIUS_RADIO / CONSTANT_CONFIG.OUTER_RADIUS_RADIO * CONSTANT_CONFIG.CUR_VALUE_TEXT_RADIO + 5) * (-1);  
    		var tempX, tempY; 
    		
    		 // 遍历起始-终止角度范围内圆上各点x,y坐标的最小值和最大值,由此确定参考圆的外接矩形
    		for (var angle = endAngle; angle <= startAngle; angle++ ){
    			tempX = cx + Math.cos(angle * Math.PI / 180) * referRadius;
    			tempY = cy + Math.sin(angle * Math.PI / 180) * referRadius;
    			if (tempX > xMax) xMax = tempX; 
    			if (tempX < xMin) xMin = tempX;
    			if (tempY > yMax) yMax = tempY; 
    			if (tempY < yMin) yMin = tempY; 
    		}
    		
    		 // 计算外接矩形的宽度和高度
    		var referWidth = xMax - xMin;
    		var referHeight = yMax - yMin;
    		
    		 // 根据画布宽度和高度,参照外接矩形尺寸进行缩放
    		var svgWidth = parseInt(options.width, 10);
    		var svgHeight = parseInt(options.height, 10);
    		var factorW = referWidth / svgWidth;
    		var factorH = referHeight / svgHeight;
    		
    		 // 选择合适的缩放因子，计算仪表盘所在圆的圆心在画布中的坐标（+padding/2将圆心移近画布的中间）
    		var factor, padding;    		
    		if (factorW > factorH){
    			 factor = factorW;
    			 padding = svgHeight - referHeight / factor;
    			 gaugeThis.cx = Math.round(-xMin / factor);
    			 gaugeThis.cy = Math.round(yMax / factor +  padding/2);
    		}
    		else {
    			factor = factorH;
    			padding = svgWidth - referWidth / factor;
    			gaugeThis.cx = Math.round(-xMin / factor + padding/2);
    			gaugeThis.cy = Math.round(yMax / factor);
    		}
    		
    		gaugeThis.outterRadius = Math.round(referRadius / factor * CONSTANT_CONFIG.OUTER_RADIUS_RADIO);
            gaugeThis.innerRadius  = Math.round(referRadius / factor * CONSTANT_CONFIG.INNER_RADIUS_RADIO);
    	},
    	 
    	 /**		
	      *  绘制主刻度线，并在每两条主刻度线之间绘制小刻度线
	      */
    	 "_renderTicks": function () {
    	 	var gaugeThis = this;
            var centerX = gaugeThis.cx;
            var centerY = gaugeThis.cy;
            var majorTicksStyle = gaugeThis.options.majorTicks.style;
            var majorTicksLengh = majorTicksStyle.length;
            var marginTopRadio = CONSTANT_CONFIG.MARGIN_TOP; //主刻度与色带之间间隔（相对于内圆半径的比率）
            
            gaugeThis.majorTicksAngles = gaugeThis._getMajorTicksAngles();   
            gaugeThis.majorTicksValues = gaugeThis._getMajorTicksValues();
            
            // 绘制主刻度线和小刻度
            var offsetX1, offsetY1, offsetX2, offsetY2;
            $.each(gaugeThis.majorTicksAngles, function (index, value) {
                offsetX1 = Math.round(Math.cos(Math.PI / 2 - value) * (gaugeThis.innerRadius * (1 - marginTopRadio) - majorTicksLengh));
                offsetY1 = Math.round(Math.sin(Math.PI / 2 - value) * (gaugeThis.innerRadius * (1 - marginTopRadio) - majorTicksLengh));
                offsetX2 = Math.round(Math.cos(Math.PI / 2 - value) * (gaugeThis.innerRadius * (1 - marginTopRadio)));
                offsetY2 = Math.round(Math.sin(Math.PI / 2 - value) * (gaugeThis.innerRadius * (1 - marginTopRadio)));
                // (x1,y1)和(x2,y2)分别为刻度线的两端点坐标
                var x1 = centerX + offsetX1;       
                var y1 = centerY + offsetY1 * -1;
                var x2 = centerX + offsetX2;
                var y2 = centerY + offsetY2 * -1;
                gaugeThis.svgContainer.append("svg:line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)
                .style(majorTicksStyle);
                
                // 绘制两条主刻度线之间的小刻度线
                gaugeThis._renderMinorTicks(gaugeThis.majorTicksAngles, gaugeThis.majorTicksValues, index);
            });
       },
       
       /**		
	    *  绘制每两个主刻度线之间的小刻度
	    */
       "_renderMinorTicks": function (majorTicksAngles, majorTicksValues, majorIndex) {
       	    var gaugeThis = this;
       	    //若绘制的是第一条主刻度线，则返回（当绘制第二条主刻度线时，开始绘制第一条和第二条主刻度线之间的小刻度）
       	    if(0 === majorIndex){
       	    	return;
       	    }
       	    
            var minorTicksAngles = gaugeThis._getMinorTicksAngles(majorTicksAngles, majorTicksValues, majorIndex);
            var centerX = gaugeThis.cx;
            var centerY = gaugeThis.cy;
            var minorTicksStyle = gaugeThis.options.minorTicks.style;
            var minorTicksLengh = minorTicksStyle.length;
            var marginTopRadio = CONSTANT_CONFIG.MARGIN_TOP;
             // 绘制小刻度线
            var offsetX1, offsetY1, offsetX2, offsetY2;
            $.each(minorTicksAngles, function (minorIndex, value) {
                var offsetX1 = Math.round(Math.cos(Math.PI / 2 - value) * (gaugeThis.innerRadius * (1 - marginTopRadio) - minorTicksLengh));
                var offsetY1 = Math.round(Math.sin(Math.PI / 2 - value) * (gaugeThis.innerRadius * (1 - marginTopRadio) - minorTicksLengh));
                var offsetX2 = Math.round(Math.cos(Math.PI / 2 - value) * (gaugeThis.innerRadius * (1 - marginTopRadio)));
                var offsetY2 = Math.round(Math.sin(Math.PI / 2 - value) * (gaugeThis.innerRadius * (1 - marginTopRadio)));
                 // (x1,y1)和(x2,y2)分别为刻度线的两端点坐标
                var x1 = centerX + offsetX1;
                var y1 = centerY + offsetY1 * -1;
                var x2 = centerX + offsetX2;
                var y2 = centerY + offsetY2 * -1;
                gaugeThis.svgContainer.append("svg:line")
                                      .attr("x1", x1)
                                      .attr("y1", y1)
                                      .attr("x2", x2)
                                      .attr("y2", y2)
                                      .style(minorTicksStyle);
            });
        },
       
        /**		
	     * 获得每个两个主刻度线之间的各小刻度对应的弧度
	     */
		"_getMinorTicksAngles": function(majorTicksAngles, majorTicksValues, majorIndex) {
			var gaugeThis = this;
			var minorTicksAngles = [];
			var minorTicksInterval = gaugeThis.options.minorTicks.interval;

			// 若用户设置了小刻度线之间的间隔，则按照设置的间隔获取各刻度线的弧度
			if (minorTicksInterval) {
				var minValue = majorTicksValues[majorIndex - 1];
				var maxValue = majorTicksValues[majorIndex];
				var valueRange = maxValue - minValue;
				var valueAccount = minValue;
				valueAccount += (+minorTicksInterval);
				while (valueAccount < maxValue) {
					minorTicksAngles.push(gaugeThis.angleScale(valueAccount));
					valueAccount += (+minorTicksInterval);
				}
				return minorTicksAngles;
			}
           
            // 否则按照默认设置的小刻度数CONSTANT_CONFIG.MINOR_TICKS_NUM来计算
			var minAngle = majorTicksAngles[majorIndex - 1];
			var maxAngle = majorTicksAngles[majorIndex];
			var angleRange = maxAngle - minAngle;
			var minorTicksNum = CONSTANT_CONFIG.MINOR_TICKS_NUM;
			for (var i = 1; i <= minorTicksNum; i++) {
				var angleValue = minAngle + i * angleRange / (minorTicksNum + 1);
				minorTicksAngles.push(angleValue);
			}
			return minorTicksAngles;
		},

       
		/**		
	     * 获得每条主刻度线对应的弧度
	     */
		"_getMajorTicksAngles": function() {
			var gaugeThis = this;
			var majorTicksAngles = [];

			// 若用户设置的刻度值合法，按照用户的设置计算角度
			if (gaugeThis._isValid()) {
				var majorTicksValue = gaugeThis.options.majorTicks.values;
				$.each(majorTicksValue, function(index, value) {
					majorTicksAngles.push(gaugeThis.angleScale(value));
				});
				return majorTicksAngles;
			}
            
            // 否则按照默认设置的主刻度数CONSTANT_CONFIG.MAJOR_TICKS_NUM来计算
			var majorTicksNum = CONSTANT_CONFIG.MAJOR_TICKS_NUM;
			var angleRange = gaugeThis.options.endAngle - gaugeThis.options.startAngle;
			var minAngle = gaugeThis.options.startAngle;
			var angleValue;
			for (var i = 0; i < majorTicksNum; i++) {
				angleValue = (minAngle + i * angleRange / (majorTicksNum - 1)) * Math.PI / 180;
				majorTicksAngles.push(angleValue);
			}

			return majorTicksAngles;
		},

       
        /**		
	     * 获得每条主刻度线对应的值
	     */
        "_getMajorTicksValues": function (minLimit, maxLimit) {
        	var gaugeThis = this;
        	
        	// 若用户设置的刻度值合法，直接返回用户的设置
        	if (gaugeThis._isValid()) {
        		return gaugeThis.options.majorTicks.values;
        	}
            
            //否则按照默认设置的主刻度线数CONSTANT_CONFIG.MAJOR_TICKS_NUM来计算
    		var majorTicksNum = CONSTANT_CONFIG.MAJOR_TICKS_NUM;
    		var scaleRange = gaugeThis.maxLimit - gaugeThis.minLimit;
            var majorTicksValues = [];
            for (var i = 0; i < majorTicksNum; i++) {
                majorTicksValues.push(gaugeThis.minLimit + i * scaleRange / (majorTicksNum - 1));
            }
           
            return majorTicksValues;
        },
        
        /**		
	     * 判断用户设置的主刻度值是否合法
	     */
        "_isValid": function(){
        	var gaugeThis = this;
        	var ticksValue = gaugeThis.options.majorTicks.values;
        	return $.isArray(ticksValue) && ticksValue.length > 0;
        },
    	
    	/**		
	     * 解析用户设置的数据,将每个数据段的起、止值和颜色数据放在数组中
	     * 并获取最大值和最小值，方便后续对值域范围的控制 
	     */
    	"_parseRanges": function(){
    	    var gaugeThis = this;
            gaugeThis.dataSource = [];
	        gaugeThis.maxLimit = gaugeThis.options.ranges[0].To;
	    	gaugeThis.minLimit = gaugeThis.options.ranges[0].From;
	    	
            $.each(gaugeThis.options.ranges, function (index, value) {
                gaugeThis.dataSource.push([value.From, value.To, value.Color]);
                
                if (value.To > gaugeThis.maxLimit)  {
                	gaugeThis.maxLimit = value.To;    
                }  
                if (value.From < gaugeThis.minLimit) {
                	gaugeThis.minLimit = value.From;  
                }  
            });
    	},
    	
    	 /**		
	      * 绘制主刻度文本
	      */
    	"_renderMajorTicksTexts": function () {
    		var gaugeThis = this;
    		var ticksTextClass = "tinyTicksTexts";
            var textStyle = gaugeThis.options.ticksLabel.labelStyle; 
            //若已经存在对应元素，则先删除          
            gaugeThis.svgContainer.selectAll("text." + ticksTextClass).remove();
            
            // 获取文本数据
            var step = gaugeThis.options.ticksLabel.step;                    
            var TicksTextsData = [];
            for (var i = 0; i < gaugeThis.majorTicksAngles.length; i += step){
            	TicksTextsData.push([gaugeThis.majorTicksAngles[i], gaugeThis.majorTicksValues[i]]);
            }
            
            var majorText =  gaugeThis.svgContainer.selectAll("text." + ticksTextClass).data(TicksTextsData);
            // 插入新增数据对应的元素，并设置其初始位置 
            majorText.enter()
                .append("text")
                .attr("class", ticksTextClass)
                .attr("x", function(d, i){return gaugeThis._getTicksTextPos(d, i, "x");})
                .attr("y", function(d, i){return gaugeThis._getTicksTextPos(d, i, "y");})
                .style(textStyle)
                .attr("text-anchor", function(d){return gaugeThis._setTextAnchor(d);})
                .text(function(d){return d[1];});
       },
      
        /**		
	     * 设置文本相对于坐标的定位
	     */
		"_setTextAnchor": function(data) {
			var gaugeThis = this;
			var cosPositive10 = Math.cos(Math.PI * (90 + 10) / 180);
			var cosNegative10 = Math.cos(Math.PI * (90 - 10) / 180);
			var cosAngle = Math.cos(Math.PI / 2 - data[0]);
			
			var textAnchor = "middle";         //90度加/减10度的角度范围(刻度线接近垂直)内,设置文本相对于坐标点居中
			if (cosAngle > cosNegative10) {    //右半圆角度范围内,设置文本结束于坐标点
				textAnchor = "end";
			}
			if (cosAngle < cosPositive10) {    //左半圆角度范围内,设置文本开始于坐标点
				textAnchor = "start";
			}
			return textAnchor;
		},

      
        /**		
	     * 获取主刻度文本坐标
	     */	
		"_getTicksTextPos": function(data, index, posFlag) {
			var gaugeThis = this;
			//主刻度线的长度
			var majorTicksLengh = gaugeThis.options.majorTicks.style.length;
			var len = gaugeThis.innerRadius * (1 - CONSTANT_CONFIG.MARGIN_TOP - CONSTANT_CONFIG.TEXT_PADDING) - majorTicksLengh;
            
            //返回文本的x轴坐标
			if ("x" == posFlag) {
				var cosAngle = Math.cos(Math.PI / 2 - data[0]);
				var x1 = gaugeThis.cx + Math.round(cosAngle * len);
				return x1;
			}
			
			//返回文本的y轴坐标
			var sinAngle = Math.sin(Math.PI / 2 - data[0]);
			var sinFactor = 1;
			if (sinAngle < 0){
				sinFactor = 1.1;   //下半圆y的坐标，尽量靠上一些
			}
			if (sinAngle > 0){
				sinFactor = 0.9;   //上半圆y的坐标，尽量靠下一些
			}
			var y1 = gaugeThis.cy - Math.round(sinAngle * len * sinFactor);
			return y1;
		},

      /**		
	   * 获取当前值
	   */	
      "_getCurValue": function(){
      	 var gaugeThis = this;
      	 var maxLimit = gaugeThis.maxLimit;     
         var minLimit = gaugeThis.minLimit; 
         var curValue = gaugeThis.options.curValue;
         
         if (!_.isNumber(curValue)) {
            	curValue =  minLimit;
            }
            
         if (_.isNumber(curValue) && curValue < minLimit) {
            	curValue =  minLimit;
            }
            
         if (_.isNumber(curValue) && curValue > maxLimit) {
            	curValue =  maxLimit;
            }
            
        return curValue;   
      },
      
       /**		
	    * 根据当前值获取指针角度
	    */
      "_getNeedleAngle": function(){
      	  var gaugeThis = this;
      	  var curValue = gaugeThis._getCurValue();
		  return gaugeThis.angleScale(curValue);
      },
      
      /**		
	   * 获取指针长度
	   */
      "_getNeedleLen": function(){
      	var gaugeThis = this;
        var marginTopRadio = CONSTANT_CONFIG.MARGIN_TOP;
        var majorTicksLengh = gaugeThis.options.majorTicks.style.length;
        var needleLen = gaugeThis.innerRadius * (1 - marginTopRadio) - majorTicksLengh;
        return needleLen;
      },
      
      /**		
	   * 渲染指针
	   */	 
      "_renderNeedle": function () {
      	    var gaugeThis = this;
            var centerX = gaugeThis.cx;
            var centerY = gaugeThis.cy;
            var radius  = Math.round(gaugeThis.innerRadius * (CONSTANT_CONFIG.CENTER_OUTER_RADIUS));
            var needleColor = gaugeThis.options.needleColor;
           
            // 绘制指针脚部实心圆
            gaugeThis.svgContainer.append("circle")
                .attr("r", radius)
                .attr("cy", centerY)
                .attr("cx", centerX)
                .attr("fill", needleColor);
            
            //  获取指针的角度、长度
            gaugeThis.needleAngle = gaugeThis._getNeedleAngle();
            var needleLen = gaugeThis._getNeedleLen();
            
            // 生成分组标签g来放置指针，并将其坐标转换为仪表盘圆心
            var translate = "translate(" + gaugeThis.cx + "," + gaugeThis.cy + ")";  
		    var needleContainer = gaugeThis.svgContainer
		        .append('g')
				.attr('transform', translate);
				
		    //  根据指针的角度和长度获取指针路径，并根据路径绘制指针
            var needlePath = gaugeThis._getNeedlePath(gaugeThis.needleAngle, needleLen);	
		    gaugeThis.needle = needleContainer.append('path')
			    .attr('d', needlePath)
			    .style("stroke-width", 1)
                .style("stroke", needleColor)
                .style("fill", needleColor);
       },
	   
	    /**		
	     * 获取指针的顶端、左、右三个顶点的坐标，并返回三个点坐标构成的指针路径
	     */
		"_getNeedlePath": function(needleAngle, needleLen) {
			var gaugeThis = this;
			
			// (topX, topY) 为指针顶点坐标
			var topX = needleLen * Math.cos(Math.PI / 2 - needleAngle);
			var topY = needleLen * Math.sin(Math.PI / 2 - needleAngle) * (-1);
            
            // 指针左、右脚线的内切圆半径
			var needleRadius = Math.round(gaugeThis.innerRadius * CONSTANT_CONFIG.CENTER_INNER_RADIUS);

			// (topX, topY) 为指针左脚坐标
			var leftX = needleRadius * Math.cos(Math.PI / 2 - needleAngle + Math.PI / 2);
			var leftY = needleRadius * Math.sin(Math.PI / 2 - needleAngle + Math.PI / 2) * (-1);

			// (topX, topY) 为指针右脚坐标
			var rightX = needleRadius * Math.cos(Math.PI / 2 - needleAngle - Math.PI / 2);
			var rightY = needleRadius * Math.sin(Math.PI / 2 - needleAngle - Math.PI / 2) * (-1);

			// 指针的顶端、左、右三个顶点的坐标构成的指针路径
			var path = "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
			
			return path;
		},

	   
	   /**		
	    * 绘制主刻度文本的单位
	    */
	   "_renderUnitText": function(){
	   	  var gaugeThis = this;
	   	  var unitTextClass = "tinyUnitText";
	   	  
	   	  //若已经存在对应元素，则先删除
	   	  gaugeThis.svgContainer.selectAll("text." + unitTextClass).remove();
	   	  
	   	  var unitText = gaugeThis.options.ticksLabel.unit;
	   	  if (!unitText){
	   	  	return;
	   	  }
	   	  var centerX = gaugeThis.cx;
          var centerY = gaugeThis.cy;
	   	  var unitTextRadio = CONSTANT_CONFIG.UNIT_TEXT_RADIO;
	   	  var posX = centerX;
	   	  var posY = centerY - gaugeThis.innerRadius * (1 - unitTextRadio);
	   	  var unitStyle = gaugeThis.options.ticksLabel.unitStyle;    
	   	  
	   	  gaugeThis.svgContainer.append("text")
	   	       .attr("class", unitTextClass)
               .attr("x", posX)
               .attr("y", posY)
               .style(unitStyle)
			   .text(unitText);
	   },
	   
	   /**		
	    * 格式化文本，关键字"%x"表示当前值，"%x.2"表示对当前值取两位小数后的结果
	    */
	   "_formatText": function(){
	   	  var gaugeThis = this;	 
	   	    	  
	   	  var title = gaugeThis.options.title.text;
	   	  var curValue = gaugeThis._getCurValue();
	   	  // 若用户未设置，则默认显示当前值
	   	  if(title == ""){
	   	  	title = curValue.toString();
	   	  }
	   	  title = title.toString();
	   	  
	      // 通过正则表达式来匹配用户是否对当前值设置了自定义格式
	      var valueRegExp = new RegExp("%x" + "\\.{0,1}(\\d{0,})", "g");
	      // 将title与正则表达式匹配
	      var matchResult = title.match(valueRegExp);
	      // 若存在对应的匹配项，则进行匹配替换
	      if (matchResult !== null) {
	      	    // 若对小数点位数进行了设置，则对当前值进行精度处理
				if (RegExp.$1 !== '') {
					precision = RegExp.$1;
				    curValue = curValue.toFixed(precision);
				}
				title = title.replace(valueRegExp, curValue);
			}
		   return title;
	   },
	   
	   /**		
	    * 绘制文字的外框矩形
	    */
	   "_renderRect":function(title, x, y){
	   	  var gaugeThis = this;
	   	  var rectClass = "tinyCurValueRect"
	   	  var rectStyle = gaugeThis.options.title.rectStyle;
	   	  var titleStyle = gaugeThis.options.title.textStyle;
	   	  var transitionDuration = parseInt(gaugeThis.options.transitionDuration);
	   	  
	   	  // 通过一个临时的text元素获取bbox对象(由bbox对象可获取text元素的宽、高和坐标)
	   	  var tempText =  gaugeThis.svgContainer
	   	      .append("text")
              .attr("x", x)
              .attr("y", y)
              .style(titleStyle)
              .style("fill", "transparent")
              .text(title);
          var bbox = tempText.node().getBBox();
          tempText.remove(); 
          
          // 根据text元素的宽、高和坐标来绘制外围矩形
          var heightPadding = bbox.height * CONSTANT_CONFIG.TEXT_HEIGHT_PADDING; // 设置text元素与rect之间的留白
          var posX = bbox.x - heightPadding;                                     // rect的x坐标                                 
          var posY = bbox.y - heightPadding;                                     // rect的y坐标
          var width = bbox.width + heightPadding * 2;                            // rect的宽度
          var height = bbox.height + heightPadding * 2;                          // rect的高度
          var rectData = [[posX, posY, width, height]];                          
          var rectElement = gaugeThis.svgContainer.selectAll("rect." + rectClass).data(rectData);
          
          // 新增rect元素
          rectElement.enter()
              .append("rect")
              .attr("class", rectClass)
              .attr("x", function(d){return d[0];})
              .attr("y", function(d){return d[1];})
              .attr("rx",2)
              .attr("ry",2)
              .attr("width", function(d){return d[2];})
              .attr("height", function(d){return d[3];})
              .style(rectStyle);
              
          // 根据新的文本内容更新矩形外框并设置动画
	   	  rectElement.transition()
              .duration(100)
	   	      .attr("x", function(d){return d[0];})
              .attr("y", function(d){return d[1];})
              .attr("width", function(d){return d[2];})
              .attr("height", function(d){return d[3];})
              .style(rectStyle);
	   },
	   
	   /**		
	    * 绘制指针下面的文本
	    */
	   "_renderCurValueText": function(){
	   	  var gaugeThis = this;
	   	  var textClass = "tinyCurValueText";
	   	  var transitionDuration = parseInt(gaugeThis.options.transitionDuration);
          var posX = gaugeThis.cx;
	   	  var posY = gaugeThis.cy + gaugeThis.innerRadius * CONSTANT_CONFIG.CUR_VALUE_TEXT_RADIO;
	   	  var titleStyle = gaugeThis.options.title.textStyle;
	   	  var title = gaugeThis._formatText();
	   	  var titleElement = gaugeThis.svgContainer.selectAll("text." + textClass).data([title]);
	   	  
	   	  //先绘制文字的外框矩形
	   	  gaugeThis._renderRect(title, posX, posY);
	   	  
          // 新增text元素
	   	  titleElement.enter()
	   	      .append("text")
	   	      .attr("class", textClass)
	   	      .attr("x", posX)
              .attr("y", posY)
              .style(titleStyle)
		      .text(function(d){return d;});
	   	  // 更新text文本内容并设置动画
	   	  titleElement.transition()
              .duration(500)
	   	      .attr("x", posX)
              .attr("y", posY)
	   	      .style(titleStyle)
		      .text(function(d){return d;});
	   },
	   
	  "_setOption": function(key, value) {
            var gaugeThis = this;
            gaugeThis._updateOptions(key, value);
            switch (key) {
            	case "id" :
                    gaugeThis._updateId(value);
                    break;
                case "title":
                    gaugeThis._renderCurValueText();
                    break;
                case "curValue":
                    gaugeThis._updateNeedle();
                    break;
                case "ticksLabel":
                    gaugeThis._renderMajorTicksTexts();
                    gaugeThis._renderUnitText();
                    break;
                case "clazz":
                    gaugeThis._renderRectFrame();
                    break;
                //以下属性都需重新绘制图表，故均调用createChart方法
                case "ranges":
                case "majorTicks":
                case "minorTicks":
                case "width":
                case "height":
                case "startAngle":
                case "endAngle":
                    gaugeThis.createChart(gaugeThis.options);
                    break;
                default :
                    break;
            }
        },
        
        "_updateOptions":function(key, value){
        	var gaugeThis = this;
        	//对于数组和对象采用深复制，避免因为数据引用而使后续操作产生隐患
            if (_.isArray(value)) {
            	gaugeThis.options[key] = $.extend(true, [], value); 
            }
            else if (_.isObject(value)) {
            	gaugeThis.options[key] = $.extend(true, this.options[key], value);//若用户只设置对象中的一个属性，则该对象的其他属性仍可以继承下来
            }
            else {
            	gaugeThis.options[key] = value;
            } 
        },
        
        /**		
	     * 根据当前值旋转指针
	     */ 
       "_updateNeedle": function(){
           var gaugeThis = this;
       	   var transitionDuration = parseInt(gaugeThis.options.transitionDuration);
       	 
       	   //  计算当前值对应的角度与原值对应的角度范围差
           var newAngle = gaugeThis._getNeedleAngle();
           var changeRange = (newAngle - gaugeThis.needleAngle) * 180 / Math.PI;
           
           // 根据角度改变幅度旋转指针
           gaugeThis.needle.transition()
               .duration(transitionDuration)
               .attr('transform', 'rotate(' + changeRange + ')');
       }
      
    });
    return AngularGauge;          
});