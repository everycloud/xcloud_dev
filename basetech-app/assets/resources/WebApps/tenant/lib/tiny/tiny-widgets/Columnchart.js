
/**
 * Tiny columnchart widget. 版本日期  2014-05-16,12:20
 * 
 * [DOM组成说明]：
 * 控件整体Dom结构，部分子DOM参考代码中的模板定义
 * <div class="tiny-columnchart">............................................控件整体
 *    <ul class="tiny-columnchart-columnUl"></ul>............................条形图名字，条形图本体，条形图右侧文本
 *    <div class="tiny-columnchart-backgroundTable">.........................刻度表格
 *       <table id="columnBGTable" width="100%"></table>
 *    </div>
 *    <div class="tiny-columnchart-columnLegend"></div>......................图例
 * </div>
 * 
 * [属性]：
 * width:    设置控件宽度，支持输入整数、字符串和百分比三种格式输入，默认值：400，不支持动态修改
 * isfill:   设置控件条形图是否完全填充，默认值：true，不支持动态修改
 *           true时完全填充，并且忽略values中的initValue值
 *           false时根据initValue值绘制一个灰条背景
 * bold:     设置控件的样式，normal表示正常显示; bold表示加粗显示，默认值：normal，不支持动态修改
 * textWidth:设置图形区域右侧的文本宽度。如果设置为"auto"，表示自动进行布局，将会根据图形条的长度和文本长度自行调节，默认值"auto",不支持动态修改
 *           自动布局的情况下，可能出现图形区域的宽度随输入数据或文本的不同而发生变化，不适合频繁刷新的数据展示 
 *           设置为固定值时， 将会无条件为右侧文本区域预留空间，如果设置值过小，将会自动计算最大文本长度，并以计算出来的长度作为文本宽度。
 *           属性支持整数、 "100px"和"auto" 三种形式的输入。 
 * values:   设置控件数据集，包含serises和legend两个部分。series包含了显示彩条的数量、长度和标题等内容。legend包含了图例的数量和显示内容等信息。必选，支持动态修改
 *           series：条形图数据集。 
 *                  textValue:"<span>220</span>/30".......条形图右边显示的文本，<span>将注释文本颜色变成彩条颜色.字符串输入
 *                  name:"所有设备"..........................每条彩条代表的意思，字符串输入
 *                  value:280.............................条形图显示的长度，整形输入，代表当前条形图代表内容的当前数据值
 *                  initValue:320.........................如果要显示一个灰色的背景条,使用此参数,该数字不能小于value.isFill须为false
 *                  maxValue:500..........................条形图显示的最大长度,整形输入，对应到图表的最右端，代表该条形图显示内容的最大数据值
 *                  color:"#F7820D".......................彩条颜色
 *           legend：图例数据集，支持两种方式
 *                  type:0, color:"#F7820D", desc:"正常"...type等于0时，主要用于对条形图不同颜色代表含义进行注释。desc显示文本内容。color要说明的彩条颜色
 *                  type:1, desc: "单位:&nbsp;&nbsp;个".....type等于1时，主要用于注释其他相关信息，比如单位，时间等
 * maxNameLength : 彩条名字最大长度，Number类型，默认值100，不支持动态修改。当实际名字长度超过这个值时，将名字从后边截断，并显示三个点的省略号，当鼠标移到名字上时显示名字全称
 * [方法]：
 * update(values)：用于更新控件显示内容，重绘整个控件。参数values见上边说明
 * updateItem(series)：用于更新单个或者多个条形图的长度和注释文本的信息，不用重绘整个条形图，只是局部改变
 *                    使用注意：宽度设置为自动布局时，不能使用此方法，如果使用，不做任何处理
 *                    参数series是上边values属性中的一个对象。series中name是必选项，color是无效属性，其它属性无定义时用原始值
 * 
 * [事件]：
 * 无
 * 
 * [内部事件]：
 * 无
 * 
 * [内部属性]：
 * columnChartThis.pushArray：记录每条彩条的模板，用于对模板操作时判断有多少个彩条，并记录每次对彩条模板的操作，最后一次性添加到整体dom中
 * 
 **/

define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-lib/encoder"], 
function(angular, $, Class, Widget, encoder) {
    var DEFAULT_CONFIG = {
        "width" : 400,
        "isFill" : true,
        "bold" : "normal",
        "textWidth" :"auto",
        "maxNameLength" : "100px",
        "template" : '<div class="tiny-columnchart" >'
                    +'<ul class="tiny-columnchart-columnUl"></ul>'
                    +'<div class="tiny-columnchart-backgroundTable">'
                    +   '<table id = "columnBGTable" width = "100%"></table>'
                    +'</div>'
                    +'<div class="tiny-columnchart-columnLegend"></div>'
                    +'</div>'
    };
    
    // 一条彩条dom，会置于<ul class="tiny-columnchart-columnUl">内部，彩条名字，注释文本由参数指定
    var liHtml = '<li class="columnLi">'
                +   '<div class="tiny-columnchart-columnLabel" title="<%=title%>"><%=name%></div>'
                +   '<div class="tiny-columnchart-columnCon">'
                +       '<div class="tiny-columnchart-columnBar"></div>'
                +       '<span class="tiny-columnchart-tValue"><%=textValue%></span>'
                +   '</div>'
                +'</li>';
             
    // 与一条彩条对应的背景刻度表格，会置于<table id="columnBGTable">内部
    var gridHtml = '<tr class="bgTableTR">'
                   +    '<td class="startBorder"></td>'
                   +    '<td></td>'
                   +    '<td></td>'
                   +    '<td class="endBorder"></td>'
                   +'</tr>';
    
    // 带有灰背景的一条彩条，会替换<div class="tiny-columnchart-columnCon">下边的<div class="tiny-columnchart-columnBar"></div>，
    // 其灰条长度、彩条长度，彩条颜色，彩条id，灰条id由参数指定
    var barWithGrayBgHtml = '<div class="tiny-columnchart-columnBar"'
                            +      'style="width:<%=initWidth%>px;"'
                            +      'id="columnBar<%=id%><%=i%>">'
                            +      '<div class="tiny-columnchart-columnProc"'
                            +           'style="background-color:<%=color%>;width:<%=columnWidth%>px;"'
                            +           'id="columnProc<%=id%><%=i%>">'
                            +      '</div>';
    
    // 无灰度背景条的一条彩条，会替换<div class="tiny-columnchart-columnCon">下边的<div class="tiny-columnchart-columnBar"></div>，
    // 其彩条长度，彩条颜色，彩条id由参数指定
    var barNoGrayBgHtml = '<div class="tiny-columnchart-columnBar"'
                                 +     'style="background-color:<%=color%>;width:<%=columnWidth%>px;"'
                                 +     'id="columnBar<%=id%><%=i%>">';
    
    // 带有头部的图例，置于<div class=".tiny-columnchart-columnLegend"></div>内部，其头部颜色和文字由参数指定
    var legendHtml0  = '<div class="tiny-columnchart-columnLegendList">'
                      +   '<div class="tiny-columnchart-columnLegendBar" style="background-color:<%=color%>;">'
                      +   '</div>'
                      +   '<span class="columnLegendList0"><%=desc%></span>'
                      +'</div>'; 
    
    //没有头部的图例，会置于<div class=".tiny-columnchart-columnLegend"></div>内部，文字由参数指定
    var legendHtml1 = '<span class="tiny-columnchart-columnLegendList"><%=desc%></span>';
                                                    
    var CONST_VALUES = {
        "LETTER_PX" :         7,     // bold属性设置为normal时，一个字母所占像素大小
        "BOLD_LETTER_PX" :    22,    // bold属性设置为bold时，一个字母所占像素值大小
        "NAME_LEFT_LENGTH" :  10,    // 条形图名字左边预留长度
        "LEN_INTERVAL_BAR_TEXT" : 10,// 彩条和右边文本之间距离
        "LEN_INTERVAL_NAME_BAR" : 5, // 条形图名字和右边图形主体的间隔长度
        "TEXT_LEFT_LENGTH" :  5,     // 注释文本左边与条形图的间距
        "TEXT_RIGHT_LENGTH" : 10     // 注释文本右侧预留宽度
    };
    
    var Columnchart = Widget.extend({
        "init" : function(options) {
            var columnChartThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            columnChartThis._testBuildMethod(options["id"]);
            columnChartThis._super(options);
            columnChartThis._setOptions(columnChartThis.options);
            $("#" + options["id"]).append(columnChartThis._element);
            
            // 产生动态条形图填充效果
            columnChartThis._createPolProcess();
        },
        
        // 根据传入的id，测试出控件的构造方法，标签形式还是构造器方式，记录下来.
        // 当输入width是百分比，width实际值 = 容器宽度  * 百分比，构造器方式 id即为容器， 标签方式的容器还要取id的父容器，因此需要判断。
        "_testBuildMethod" : function(id) {     
            var columnChartThis = this;
            if (typeof(id)=="undefined"){
                columnChartThis.buildMethod="constructor";
            } 
            else if ($("#" + id).length>0){
                columnChartThis.buildMethod="constructor";
            }
            else{
                columnChartThis.buildMethod="directive";
            }
        },
        
        "_setOption" : function(key, value) {
            var columnChartThis = this;
            columnChartThis._super(key, value);
            
            switch (key) {
                case "id":
                    columnChartThis._updateId(value);
                    break;
                case "values": 
                    columnChartThis._creatColumnchart(value);
                    columnChartThis._createPolProcess();
                    break;
                default:
                    break;
            }
        },

        // 创建整个条形图
        "_creatColumnchart" : function(values) {
            var columnChartThis = this;
            var data = values.series;
            var chartWidth;
            
            columnChartThis._clear();                                //清理重绘 
            columnChartThis._createColumnframe(data);                //创建条形图框架
            chartWidth = columnChartThis._calculatechartWidth(data); //计算背景刻度图表的宽度
            columnChartThis._createColumnInterior(data,chartWidth);  //创建条形内部
            columnChartThis._createTableBg(data);                    //创建背景刻度表格
            columnChartThis._createLegend(values);                   //创建图例说明
            columnChartThis._setType();                              //设置条形图样式
            columnChartThis._setPosition(data,chartWidth);           //设置标签名字和背景刻度表格、图例的位置
           
            //整个控件的宽度
            columnChartThis._element.css("width", columnChartThis._calcWidth()+"px");
        },
        
        //切换条形图样式,默认为normal: normal,bold
        "_setType" : function(){
            var columnChartThis = this;
            
            if (columnChartThis.options["bold"] === "bold") {
                 columnChartThis._element.find(".tiny-columnchart-columnCon")
                                         .removeClass("tiny-columnchart-columnCon")
                                         .addClass("tiny-columnchart-columnConBold");
                 columnChartThis._element.find(".tiny-columnchart-backgroundTable")
                                         .removeClass("tiny-columnchart-backgroundTable")
                                         .addClass("tiny-columnchart-backgroundTableBold");
            }
        },
        
        //为显示标签名字和背景刻度表格、图例设置偏移量 
        "_setPosition" : function(data,chartWidth){
            var columnChartThis = this;
            var maxNameLen = columnChartThis._calcNameMaxLen(data);    
            var left;
            
            left = $(".tiny-columnchart-columnLabel:first-child", columnChartThis._element).position().left + 
                   (maxNameLen*CONST_VALUES.LETTER_PX + CONST_VALUES.NAME_LEFT_LENGTH);
            columnChartThis._element.find(".tiny-columnchart-columnLabel")
                                    .css("width", (maxNameLen*CONST_VALUES.LETTER_PX + CONST_VALUES.NAME_LEFT_LENGTH)); 
           
            columnChartThis._element.find(".tiny-columnchart-backgroundTable,.tiny-columnchart-backgroundTableBold,.tiny-columnchart-columnLegend").width(chartWidth).css("left",left);
        },
        
        //重绘前的清理
        "_clear" : function(){
            var columnChartThis = this;
                        $(".columnLi" , columnChartThis._element).remove();
            $(".bgTableTR" , columnChartThis._element).remove();
            $(".tiny-columnchart-columnLegendList" , columnChartThis._element).remove();
        },
        
        //统计出最大条形图名字的长度
        "_calcNameMaxLen" : function(data){ 
            var columnChartThis = this;
            var name;
            var maxNameLen=0;
            for(var i=0, dataLen=data.length; i<dataLen; i++){        
                name = data[i].name + "";
                if (maxNameLen < columnChartThis._strlen(name)) {
                    maxNameLen = columnChartThis._strlen(name);
                }
            }
            
            var NameLenPx = maxNameLen*CONST_VALUES.LETTER_PX;
            var maxNameLength = parseInt(columnChartThis.options["maxNameLength"]);
            if (NameLenPx < maxNameLength){
                return maxNameLen;
            }
            
            return Math.floor(maxNameLength / CONST_VALUES.LETTER_PX);
        },
        
        //统计出最大条形图文本注释的长度
        "_calcMaxtextLen" : function(data){
            var columnChartThis = this;
            var textValue,textLength;
            var maxtextLen=0;
            for(var i=0, dataLen=data.length;i<dataLen;i++){        
                textValue = data[i].textValue + "";
                textLength = columnChartThis._strlen(textValue.replace(/<[^>].*?>/g, "")); //去除html标签
                if (maxtextLen < textLength) {
                    maxtextLen = textLength;
                }
            }
            
            var textWidth = columnChartThis.options["textWidth"];
            if(columnChartThis.options["bold"] === "bold") {
                maxtextLenPx = maxtextLen * CONST_VALUES.BOLD_LETTER_PX;
            } 
            else {
                maxtextLenPx = maxtextLen * CONST_VALUES.LETTER_PX;
            }
            
            if(maxtextLenPx <= columnChartThis.options["textWidth"]) {
                return textWidth;
            }
            
            return maxtextLenPx;
            
        },
        
        //计算背景刻度表格的宽度
        "_calculatechartWidth" : function(data){
            var columnChartThis = this;
            var options = columnChartThis.options;
            var textValue,textLength,chartWidth,chartWidthtemp;
            var textPx = ((options["bold"] === "bold")? CONST_VALUES.BOLD_LETTER_PX:CONST_VALUES.LETTER_PX);    
            var widgetWidth = columnChartThis._calcWidth();
            var maxNameLen = columnChartThis._calcNameMaxLen(data);
            var maxTextLen = columnChartThis._calcMaxtextLen(data);
            
            var interspaceLen1 = CONST_VALUES.NAME_LEFT_LENGTH + CONST_VALUES.LEN_INTERVAL_NAME_BAR + CONST_VALUES.TEXT_RIGHT_LENGTH;
            var interspaceLen2 = CONST_VALUES.TEXT_LEFT_LENGTH + CONST_VALUES.TEXT_RIGHT_LENGTH + 
                                 CONST_VALUES.NAME_LEFT_LENGTH + CONST_VALUES.LEN_INTERVAL_NAME_BAR;
            
            if ("auto" !== options["textWidth"]){
                // 空间安排：  widgetWidth = name左边预留  + name文本长度  + name和图条之间预留宽度  + chartWidth + 图右边预留宽度
                 chartWidth = widgetWidth - CONST_VALUES.NAME_LEFT_LENGTH - CONST_VALUES.LEN_INTERVAL_NAME_BAR - CONST_VALUES.LEN_INTERVAL_BAR_TEXT - 
                              maxNameLen * CONST_VALUES.LETTER_PX - CONST_VALUES.TEXT_RIGHT_LENGTH - parseInt(maxTextLen,10);
               
                return chartWidth;
            }
            
            // 宽度自动布局时，根据输入参数确定背景刻度表格的宽度
            // 默认图形和text不能填满背景表格
            chartWidth = widgetWidth - interspaceLen1 - maxNameLen*CONST_VALUES.LETTER_PX - parseInt(maxTextLen,10);          
            // 寻找表格宽度最小的那一组,以最小的为准. 最小是因为图形过长或文本过长引起.  
            for (var i=0, dataLen=data.length; i<dataLen; i++){
                textValue = data[i].textValue + "";
                textLength = columnChartThis._strlen(textValue.replace(/<[^>].*?>/g, "")); //去除html标签
                
                // columnvale记录图形长度最大值。
                columnvalue = data[i].initValue > data[i].value? data[i].initValue : data[i].value;
                if (options["isFill"]){
                    columnvalue = data[i].value;    
                }
              
                // chartWidth*value百分比 + 文本左边预留 + 文本右边预留 + name左边预留  + name文本长度  + name和图条之间预留宽度 = widgetWidth
                if (columnvalue > 0 && parseInt(data[i].maxValue) > 0) {
                    chartWidthtemp= Math.floor((widgetWidth - interspaceLen2  - maxNameLen * CONST_VALUES.LETTER_PX - textLength * textPx)
                                                * data[i].maxValue / columnvalue);
                    chartWidth = chartWidth < chartWidthtemp ? chartWidth : chartWidthtemp;
                }
            }
            return (chartWidth-10);
        },
        
        //绘制所有彩条框架
        "_createColumnframe" : function(data){
            var columnChartThis = this;
            var li;
            var name;
            var titleText;
            var textValue;
            columnChartThis.pushArray = [];
            
            for(var i=0, dataLen=data.length; i<dataLen; i++){     
                name = data[i].name + "";
                titleText = $("<div>" + name + "</div>").text(); 
                textValue = data[i].textValue + "";
                li = _.template(liHtml)({title:titleText,name:name,textValue:textValue});
                
                columnChartThis.pushArray.push(li);
            }
        },
        
        // 绘制彩条图形内部
        "_createColumnInterior" : function(data,chartWidth){
            var columnChartThis = this;
            var options = columnChartThis.options;
            var id = $.encoder.encodeForHTMLAttribute("id", options["id"] + "", true);
            var columnWidth,initWidth,barHtml, columnHtml,color,maxValue;
            for(var i=0, arrayLen=columnChartThis.pushArray.length; i<arrayLen; i++){
                columnWidth = data[i].value;
                initWidth = data[i].initValue;
                
                color = $.encoder.encodeForCSS("color", data[i].color, true);
                // 如果不是全填充，则使用initWidth画出灰色背景，再使用指定颜色按照value值进行填充
                if (!options["isFill"]){
                    initWidth = Math.floor(data[i].initValue * chartWidth / data[i].maxValue);
                    columnWidth = Math.floor(data[i].value * chartWidth / data[i].maxValue);
                    barHtml = _.template(barWithGrayBgHtml)({initWidth:initWidth,
                                                                     id:id,
                                                                     i:i,
                                                                     color:color,
                                                                     columnWidth:columnWidth});
                }
                else {
                    columnWidth = Math.floor(data[i].value * chartWidth / data[i].maxValue);
                    barHtml = _.template(barNoGrayBgHtml)({color:color,
                                                                   columnWidth:columnWidth,
                                                                   id:id,
                                                                   i:i});
                }
                columnHtml = columnChartThis.pushArray[i].replace('<div class="tiny-columnchart-columnBar">', barHtml);
                // 如果传入的是带有/的样式，则/前面的文字显示为条形的颜色。要求参数textValue中/前面的文本使用<span>包起来
                columnHtml = columnHtml.replace('<span class="tiny-columnchart-tValue"><span>', 
                                                '<span class="tiny-columnchart-tValue"><span style="color:' + color + ';">' ); 
                columnChartThis._element.find(".tiny-columnchart-columnUl").append(columnHtml);
                
                // 如果不是全填充，将背景条设为灰色
                if (!options["isFill"]){
                    columnChartThis._element.find(".tiny-columnchart-columnBar").addClass("tiny-columnchart-columnBar-background-color");
                }
            }
        },
        
        //对宽度的标准化，最终输出一个整型的宽度。 
        "_calcWidth" : function(){        
            var columnChartThis = this;
            var options = columnChartThis.options;
            var width = options["width"];
            var percent = parseInt(width,10); 
            var id=options["id"];
            
            // 宽度是带有单位的字符串
            if ((typeof width == 'string') && (width.indexOf("%") <= 0)){
                return percent;
            }
            
            // 宽度是数字
            if(!isNaN(width)){
                return percent;
            }
            
            // 宽度是百分比形式,取容器元素的宽度，构造器方式 id即为容器， 标签方式的容器还要取id的父容器
            if ("constructor" === columnChartThis.buildMethod ){
                return Math.floor($("#" + id).width()*percent/100);   
            }
            else {
                return Math.floor($("#" + id).parent().width()*percent/100);
            }
        },
        
        "update" : function(values) {
            var columnChartThis = this;
            columnChartThis.options["values"] = values;
            columnChartThis._setOption("values", values);
        },
        
        "updateItem" : function(datas) {
            var columnChartThis = this;
            var options = columnChartThis.options;
            var index;
            var chartWidth = columnChartThis._calculatechartWidth(options["values"].series);
            //自动布局时，此方法不生效
            if ("auto" == options["textWidth"] ){
                return;
            }
            
            for(var i = 0, datasLen = datas.length; i < datasLen; i++){
                index = columnChartThis._getIndexByName(datas[i].name);    //用彩条名字匹配法查找要更改的彩条序号
                
                //没找到匹配值
                if (index < 0){
                    continue;
                }
                
                columnChartThis._updateRecordData(index, datas[i]);         //更新彩条记录数据值
                columnChartThis._updateBarLen(index,chartWidth);            //更新彩条长度
                columnChartThis._updateTextValue(index);                    //更新彩条注释文本
            }
        },
        
        //用彩条名字匹配法查找要更改的彩条序号
        "_getIndexByName" : function(name){
            var columnChartThis = this;
            var options = columnChartThis.options;
            
            for(var i = 0, seriesLen = options["values"].series.length; i < seriesLen; i++){
                if (name == options["values"].series[i].name) {
                    return i;
                }
            }
            return -1;
        },
        
        //更新彩条记录数据值
        "_updateRecordData" : function(index, datas){
            var columnChartThis = this;
            var options = columnChartThis.options;
            
            //不支持彩条颜色更新
            var temp = _.extend({}, datas);
            delete temp.color;
            
            _.extend(options["values"].series[index], temp);
        },
        
        //更新彩条的长度
        "_updateBarLen" : function(index,chartWidth){
            var columnChartThis = this;
            var options = columnChartThis.options;
            var datas = options["values"].series[index];
            var newColumnWidth,newInitWidth;
            var id = options["id"];
            
            if (!options["isFill"]){
                newColumnWidth = Math.floor(datas.value * chartWidth / datas.maxValue);
                newInitWidth = Math.floor(datas.initValue * chartWidth / datas.maxValue);
                $("#columnBar" + id + index, columnChartThis._element).animate({ width : newInitWidth});
                $("#columnProc" + id + index, columnChartThis._element).animate({ width : newColumnWidth});
            }
            else{
                newColumnWidth = Math.floor(datas.value * chartWidth / datas.maxValue);
                $("#columnBar" + id + index, columnChartThis._element).animate({ width : newColumnWidth });    
            }
        },
        
        //更新彩条的注释文本
        "_updateTextValue" : function(index){
            var columnChartThis = this;
            var options = columnChartThis.options;
            var datas = options["values"].series[index];
            var textHtml;
            var id = options["id"];
            $("#columnBar" + id + index, columnChartThis._element).parent().find(".tiny-columnchart-tValue").remove();
            textHtml = '<span class="tiny-columnchart-tValue">' + datas.textValue + '</span>';   
            textHtml = textHtml.replace('<span class="tiny-columnchart-tValue"><span>', 
                       '<span class="tiny-columnchart-tValue"><span style="color:' + $.encoder.encodeForCSS("color", datas.color, true) + ';">' );
            $("#columnBar" + id + index, columnChartThis._element).parent().append(textHtml);
        },
        
        //绘制背景刻度表格
        "_createTableBg" : function(data) {         
            var columnChartThis = this;
            var table = columnChartThis._element.find("#columnBGTable");

            for(var i=0; i<data.length; i++){
                table.append(gridHtml);
            }
        },
        
        //绘制图例
        "_createLegend" : function(values) {        
            var columnChartThis = this;
            var options = columnChartThis.options;
            var legendDiv = columnChartThis._element.find(".tiny-columnchart-columnLegend");
            var legenData = values.legend;     
            var legendHtml = "";
            
            if (typeof(legenData) == "undefined") {
                return;
            }
            
            var color;
            for (var i = 0, dataLen = legenData.length; i < dataLen; i++) {
                if (legenData[i].type == 0) {
                    color = $.encoder.encodeForCSS("color", legenData[i].color, true);
                    legendHtml += _.template(legendHtml0)({color:color,desc:legenData[i].desc});   
                } else {
                    legendHtml += _.template(legendHtml1)({desc:legenData[i].desc});
                }
            }
            
            legendDiv.append(legendHtml);
            
            legendDiv.find(".columnLegendList0").addClass("tiny-columnchart-LegendList0-margin-left");
            legendDiv.find("span.tiny-columnchart-columnLegendList").addClass("tiny-columnchart-LegendList1-margin-left");
        },
        
        //产生动态条形图填充。
        "_createPolProcess" : function(){       
            var columnChartThis = this;
            var options = columnChartThis.options;
            var id = options["id"],columnBarWidth,columnProcWidth;

            $(".tiny-columnchart-columnBar", columnChartThis._element).each(function(n){ 
                columnBarWidth = $("#columnBar" + id + n).css("width"); 
                columnProcWidth =  $("#columnProc" + id + n).css("width"); 
                $("#columnBar" + id + n).width(0).animate({ width:columnBarWidth });     
                $("#columnProc" + id + n).width(0).animate({ width:columnProcWidth });
            });
        },

        // 计算中英文字符长度
        "_strlen" : function (str) {  
            var len = 0, c;  
            for (var i=0, strLen=str.length; i<strLen; i++) {   
                c = str.charCodeAt(i);      //charCodeAt的作用是返回str中i位置处的字符的unicode编码号

                //单字节加1         
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
                    len++;   
                }   
                else {   
                    len+=2;   
                }   
            }   
            return len;  
        }
    });
    
    return Columnchart;
});
