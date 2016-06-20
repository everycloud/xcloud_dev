
window.selectAppAndVersion = function(appname, branch){
	$(function(){
		$("h2").hide();
		$("#app_and_branch").hide();
		var url = "/getAppCaseChangeCount/" + appname + "/";
		if(branch != undefined && branch != "")
			url = url + branch;
		$.getJSON(url,function(ret){
			window.app_name = appname;
			transformChartData(ret);
			createChart();
		});
	});
}

window.showTestResultChart = function(appname, branch){
	window.branch = branch;
	$(function(){
		$("h2").hide();
		$("#app_and_branch").hide();
		//var url = "/getAppCaseChangeCount/" + appname + "/";
		var url = "/getTestCaseCountTrend/" + appname + "/" + branch;
		$.getJSON(url,function(ret){
			window.app_name = appname;
			createTestCountChart(ret);
		});
	});
}

$(function(){
	var hashArray = window.location.hash.split('/');
	if(hashArray.length < 4)
		return;
	
	var mode = hashArray[1];
	var appname = hashArray[2];
	var branch = hashArray[3];
	if(mode == "testchange"){
		window.selectAppAndVersion(appname,branch);
	} else if (mode == "testcount" ){
		window.showTestResultChart(appname,branch);
	} else {
		document.write("Unrecognized param " + mode);
	}
		
	
	$("#runDetect").click(onDetectClicked);
	showDiffDetail();
	//
	$(document).bind("contextmenu", function (event) {
		if (document.all)
			window.event.returnValue = false; // for IE 
		else
			event.preventDefault();
	});
	//
	$("#gridContainer").bind("mouseup",function(oEvent){
		return;
		if (!oEvent) oEvent = window.event;
		if (oEvent.button != 2) 
			return;
		window.oEvent = oEvent;
		var left = oEvent.screenX+window.right_menu.width<window.innerWidth ? oEvent.clientX : oEvent.clientX - window.right_menu.width - 2;
		var top = oEvent.screenY+window.right_menu.height<window.innerHeight ? oEvent.clientY : oEvent.clientY - window.right_menu.height - 2;
		$("#right_menu").css({left:left + "px", top: top, display: "block", "background-color": "#f3f3f4", opacity:0.8, color: "black"});
		$("#backgroud").css("display", "block");
	});
	$("#right_menu #add_to_control").click(function(){
		window.control.branch = window.current_data.points[0].point.branch;
		window.control.time = new Date(window.current_data.x).toJSON().replace("T"," ").replace("Z","")
		$("#right_menu").css({display:"none"});
		$("#backgroud").css("display", "none");
		showDiffDetail();
	});
	$("#right_menu #add_to_test").click(function(){
		window.test.branch = window.current_data.points[0].point.branch;
		window.test.time = new Date(window.current_data.x).toJSON().replace("T"," ").replace("Z","")
		$("#right_menu").css({display:"none"});
		$("#backgroud").css("display", "none");
		showDiffDetail();
	});
	$("#backgroud").click(function(){
		$("#right_menu").css("display","none");
		$("#backgroud").css("display", "none");
	});
	window.right_menu = {
		width: $("#right_menu").width(),
		height: $("#right_menu").height()
	}
});
function changeBranchListByAppname(appname){
	var appname = $("#appname").val();
	var branches = window.appNameVersion[appname];
	var defaultOption = $("#branch").children()[0];
	//var defaultOption = $("#branch option").remove()[0];
	//defaultOption = document.createElement("option");
	//defaultOption.value = "";
	//defaultOption.text = "All";
	$("#branch").append(defaultOption);
	for(var index in branches){
		var branch = branches[index];
		var optionElement = document.createElement("option");
		optionElement.value = branch;
		optionElement.text = branch;
		$("#branch").append(optionElement);
	}
}

function transformChartData(originData){
	window.originData = originData;
	if(null == originData)
		return null;
	window.chartData = {
		data:[
			{name:"delete", data:[],zIndex:3},
			{name:"add", data:[],zIndex:2},
			{name:"guess", data:[],zIndex:1}
		],
		branch:{}
	};
	var index = 0;
	for(; originData.hasOwnProperty(index); index++){
		var strTime = originData[index]['time'];
		var lTime = Date.parse(strTime);
/*		window.chartData.data[0].data.push([lTime + 3600000*8,originData[strTime]['delete']]);
		window.chartData.data[1].data.push([lTime + 3600000*8,originData[strTime]['add']]);
		window.chartData.data[2].data.push([lTime + 3600000*8,originData[strTime]['guess']]);
		window.chartData.branch[lTime] = originData[strTime]['branch'];
*/
		window.chartData.data[0].data.push({
			branch:originData[index]['branch'],
			x:lTime + 3600000*8,
			y:parseInt(originData[index]['delete']),
			index:index
		});
		window.chartData.data[1].data.push({
			branch:originData[index]['branch'],
			x:lTime + 3600000*8,
			y:parseInt(originData[index]['add']),
			index:index
		});
		window.chartData.data[2].data.push({
			branch:originData[index]['branch'],
			x:lTime + 3600000*8,
			y:parseInt(originData[index]['guess']),
			index:index
		});
	}
	if(index < 1){
		window.control = {};
		window.test = {};
	}else{
		var controlIndex = index - 2;
		if (controlIndex < 0) controlIndex = 0;
		window.control = {
			branch:originData[controlIndex]['branch'],
			time:originData[controlIndex]['time']
		};
		window.test = {
			branch:originData[index-1]['branch'],
			time:originData[index-1]['time']
		};
	}
	showDiffDetail();
}

function onDetectClicked(){
	/*var ret = {
		0:{time:"2014-10-1 12:30:00",add:1,delete:0,guess:3,branch:"trunk"},
		1:{time:"2014-10-2 12:30:00",add:2,delete:1,guess:1,branch:"branch1"},
		2:{time:"2014-10-3 12:30:00",add:1,delete:2,guess:4,branch:"branch1"},
		3:{time:"2014-10-4 12:30:00",add:1,delete:1,guess:1,branch:"trunk"}
	}	"2014-10-5 12:30:00":{add:1,delete:0,guess:2,branch:"branch1"},
		"2014-10-6 12:30:00":{add:3,delete:2,guess:1,branch:"trunk"},
		"2014-10-7 12:30:00":{add:1,delete:2,guess:0,branch:"branch1"},
		"2014-10-1 12:30:00":{add:1,delete:0,guess:1,branch:"trunk"}
	}*/
	var url = "/getAppCaseChangeCount.json?appname=" + $("#appname").val();
	if($("#branch").val() != "none")
		url = url + "&branch=" + $("#branch").val();
	$.getJSON(url,function(ret){
		window.app_name = $("#appname").val();
		transformChartData(ret);
		createChart();
	});
}

function onChartPointClicked(event){
	window.event = event;
	window.point = this;
	var clickIndex = this.index;
	var controlIndex = clickIndex - 1;
	if(controlIndex<0) controlIndex = 0;
	window.control.branch = this.series.data[controlIndex].branch;
	window.control.time = new Date(this.series.data[controlIndex].x).toJSON().replace("T"," ").replace("Z","");
	window.test.branch = this.series.data[clickIndex].branch;
	window.test.time = new Date(this.series.data[clickIndex].x).toJSON().replace("T"," ").replace("Z","");
	showDiffDetail();
	//alert("clicked");
}

function getDefaultChartSettings(){
    var defaultChartSettings = {
//		series: window.chartData.data,
		colors: ["red", "green", "#FF9900", "#aaeeee", "#ff0066", "#eeaaee",
			"#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
		chart: {
/*			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
				stops: [
					[0, 'rgb(96,96,96)'],
					[1, 'rgb(16,16,16)']
				]
			},
*/			borderWidth: 0,
			borderRadius: 0,
			plotBackgroundColor: null,
			plotShadow: false,
			plotBorderWidth: 0,
//			height: 300
		},	
		tooltip: {
/*			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0, 'rgba(96, 96, 96, .8)'],
					[1, 'rgba(16, 16, 16, .8)']
				]
			},
*/			xDateFormat: "%Y-%m-%d %H:%M:%S",
			borderWidth: 0,
			style: {
//				color: '#FFF'
			},
			formatter:function(){
				window.current_data = this;
				var names = ["减少用例","增加用例","耗时锐减用例"];
				//var s = "<span style=\"font-size: 10px\">项目id: <b>" + (this.points[0].point.branch) + "</b></span><br/>";
				var s = "<span style=\"font-size: 10px\">测试运行时间: <b>" + Highcharts.dateFormat('%y-%m-%d %H:%M:%S',this.x) + "</b></span><br/>";
				for(var ind in this.points){
					s += "<span style=\"color:" + this.points[ind].series.color + "\">\u25CF</span> " + names[ind] + ": <b>" + this.points[ind].y + "</b><br/>";
				}
				s += "<span style=\"color:#aaa\">本次运行和前一次运行的比较结果</span>";
				this.g
				return s;
			}
			//headerFormat:"<span style=\"font-size: 10px\">Build:{point.key}</span><br/>",
			//pointFormat:"<span style=\"color:{series.color}\">\u25CF</span> {series.name}: <b>{point.y}</b><br/>"
		},
		// scroll charts
		rangeSelector: {
			selected: 0,
			buttons: [{
				type: 'week',
				count: 7,
				text: '1w'
			}, {
				type: 'month',
				count: 1,
				text: '1m'
			}, {
				type: 'month',
				count: 3,
				text: '3m'
			}, {
				type: 'month',
				count: 6,
				text: '6m'
			}, {
				type: 'ytd',
				text: 'YTD'
			}, {
				type: 'year',
				count: 1,
				text: '1y'
			}, {
				type: 'all',
				text: 'All'
			}],

			buttonTheme: {
				fill: {
	/*				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#888'],
						[0.6, '#555']
					]
	*/			},
				stroke: '#000000',
				style: {
					color: '#CCC',
					fontWeight: 'bold'
				},
				states: {
					hover: {
						fill: {
							linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
							stops: [
								[0.4, '#BBB'],
								[0.6, '#888']
							]
						},
						stroke: '#000000',
						style: {
							color: 'white'
						}
					},
					select: {
						fill: {
							linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
							stops: [
								[0.1, '#e3e3e4'],
								[0.3, '#f0f0f1']
							]
						},
						stroke: '#000000',
						style: {
							color: 'white'
						}
					}
				}
			},
			inputStyle: {
				backgroundColor: '#333',
				color: 'silver'
			},
			labelStyle: {
				color: 'silver'
			}
		},
		
	
		navigator: {
			enabled: false,
	/*		handles: {
				backgroundColor: '#666',
				borderColor: '#AAA'
			},
			outlineColor: '#CCC',
			maskFill: 'rgba(16, 16, 16, 0.5)',
	*/		series: {
	//			color: '#7798BF',
				lineColor: '#fbb',
				lineWidth: 1,
			}
		},
	
		scrollbar: {
	/*		barBackgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#888'],
						[0.6, '#555']
					]
				},
			barBorderColor: '#CCC',
			buttonArrowColor: '#CCC',
			buttonBackgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#888'],
						[0.6, '#555']
					]
				},
			buttonBorderColor: '#CCC',
			rifleColor: '#FFF',
			trackBackgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0, '#000'],
					[1, '#333']
				]
			},
			trackBorderColor: '#666'
	*/	},
	
		// special colors for some of the demo examples
		legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
		background2: 'rgb(70, 70, 70)',
		dataLabelsColor: '#444',
		textColor: '#E0E0E0',
		maskColor: 'rgba(255,255,255,0.3)',
		credits:{enabled: false}
	};
	return defaultChartSettings;
}

function createChart(){
	if(!window.chartData || !window.chartData.data)
		return;
	$=jQuery;
	var data = getDefaultChartSettings();
	data.series = [
		{data: window.chartData.data[0].data, name: window.chartData.data[0].name,type: "spline", zIndex:3},
		{data: window.chartData.data[1].data, name: window.chartData.data[1].name,type: "spline", zIndex:1},
		{data: window.chartData.data[2].data, name: window.chartData.data[2].name,type: "spline", zIndex:2},
	];
	window.chart = $("#gridContainer").highcharts('StockChart',data);
}

function createTestCountChart(data){
	var chartSetting = getDefaultChartSettings();
	chartSetting.series = [
		{data: data[0], name: "失败case数", type: "areaspline", zIndex:2, color:"#f25454", events:{click:onDataClicked}},
		{data: data[1], name: "全部case数", type: "areaspline", zIndex:1, color:"#8eb2d9", events:{click:onDataClicked}},
	];
//	chartSetting.series[0].type = "areaspline";
//	chartSetting.series[1].type = "areaspline";
//	chartSetting.series[2].type = "areaspline";
//	chartSetting.pointFormat = "<span style=\"color:{series.color}\">\u25CF</span> {series.name}: <b>{point.y}</b><br/>";
	function onDataClicked(oEvent){
		window.open("/view/index.html#/testdiff/" + window.app_name + "/" + window.branch
			+ "/" + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',oEvent.point.x) + "/default", "_parent");
	};
	chartSetting.tooltip.formatter = function(){
		var names = ["运行用例","失败用例"];
		var colors = ["#8eb2d9","#f25454"];
		//var s = "<span style=\"font-size: 10px\">项目id: <b>" + (this.points[0].point.branch) + "</b></span><br/>";
		var s = "<span style=\"font-size: 10px\"><b>" + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x) + "</b></span><br/>";
		var totalIndex = this.points.length >= 2 ? 1: 0;
		s += "<span style=\"color:" + colors[0] + "\">\u25CF</span> " + names[0] + ": <b>" + this.points[totalIndex].y + "</b><br/>";
		var failCnt = this.points.length >= 2 ? this.points[0].y : 0;
		s += "<span style=\"color:" + colors[1] + "\">\u25CF</span> " + names[1] + ": <b>" + failCnt + "</b><br/>";
		
		return s;
	};
/*	$("#gridContainer path").bind("mouseup",function(oEvent){
		if (!oEvent) oEvent = window.event;
		window.oEvent = oEvent;
		if (oEvent.button != 0) 
			return;
		window.open("/view/index.html#/testdiff/" + window.app_name + "/" + window.branch
			+ "/" + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',window.current_data.x) + "/default", "_parent");
	});
*/	Highcharts.setOptions({ 
    	global: { useUTC: false  } 
	});
	
	window.chart = $("#gridContainer").highcharts('StockChart',chartSetting);
}

function fillDiffDetailTable(detail){
	if(!window.control || !window.test || !window.control.branch || !window.control.time || !window.test.branch || !window.test.time){
		$("#detailTable").hide();
		return;
	}
	$("#build1name").text("[" + window.app_name + "]  " + window.control.branch + " , " + window.control.time + "  ");
	$("#build2name").text("  " + window.test.branch + " , " + window.test.time);
	$("#added_case_content *").remove();
	$("#abandoned_case_content *").remove();
	$("#suspicious_case_content *").remove();
	for(var index in detail["add"]){
		var name = detail["add"][index];
		var elem = document.createElement("div");
		elem.className = "detail_element";
		var span = document.createElement("span");
		span.textContent = "+ " + name;
		$(elem).append(span);
		span = document.createElement("span");
		span.className = "description";
		span.textContent = " ";
		$(span).attr({"casename":name, "type": "add"});
		$(elem).append(span);
		$("#added_case_content").append(elem);
	}
	for(var index in detail["delete"]){
		var name = detail["delete"][index];
		var elem = document.createElement("div");
		elem.className = "detail_element";
		var span = document.createElement("span");
		span.textContent = "- " + name;
		$(elem).append(span);
		span = document.createElement("span");
		span.className = "description";
		span.textContent = " ";
		$(span).attr({"casename":name, "type": "delete"});
		$(elem).append(span);
		$("#abandoned_case_content").append(elem);
	}
	for(var name in detail["guess"]){
		var elem = document.createElement("div");
		elem.className = "detail_element";
		var span = document.createElement("span");
		span.textContent = "* " + name;
		$(elem).append(span);
		span = document.createElement("span");
		span.className = "description";
		span.textContent = " ";
		$(span).attr({"casename":name, "type": "guess"});
		$(elem).append(span);
		$("#suspicious_case_content").append(elem);
		elem = document.createElement("div");
		var times = detail["guess"][name].split(',');
		elem.textContent = "Run time Exception: first run time[" + times[1] + "ms], but second run time[" + times[0] + "ms]";
		elem.className = "time_diff";
		$("#suspicious_case_content").append(elem);
	}
	fillCaseDescription("add", detail["add"]);
	fillCaseDescription("delete",detail["delete"]);
	var guessKeys = [];
	for(var name in detail["guess"])
		guessKeys.push(name);
	fillCaseDescription("guess",guessKeys);
	$("#detailTable").show();
//	$("#detailTable .detail_element").mouseover(onDetailElementMouseOver);
//	$("#detailTable .detail_element").mouseleave(onDetailElementMouseLeave);
//	$("#detailTable .detail_element").click(onDetailElementClick);
	window.parent.iFrameHeight();
}
function fillCaseDescription(type, casenames){
	var appname = window.app_name;
	var branch = type == "delete" ? window.control.branch : window.test.branch;
	window.casenames = casenames;
	var strCaseNames = casenames.join(",");
	$.post("/testShow/getCaseDescriptions.json",{appname:appname,branch:branch,casenames: strCaseNames},function(res){
		for(var name in res){
			var infoString = res[name] == "" ? "" : " ( " + res[name] + ")";
			$("span.description[casename='" + name + "']").text(infoString);
		}
	});
	
}
function onDetailElementMouseOver(oEvent){
	$("#mark_down_detail").html(getRandomMarkDownHtml());
	$("#mark_down_detail").css({left:oEvent.clientX + "px", top: oEvent.clientY, display: "block", "background-color": "#f3f3f4", opacity:0.8, color: "black",border: "1px solid #555"});
}
function onDetailElementMouseLeave(){
	$("#mark_down_detail").css({display: "none"});
}
function onDetailElementClick(){
	window.diffclick = this;
	var url = "/detaildiff.htm?casename=" + this.children[0].innerText + "&controltime=" + window.control.time + "&controlbranch=" + window.control.branch
		+ "&testbranch=" + window.test.branch + "&testtime=" + window.test.branch + "&difftype=" + this.children[0].innerText.substr(0,1);
	window.open(url);
}

function showDiffDetail(){
    return;
	if(!window.app_name)
		window.app_name = $("#appname").val();
	if(!window.control || !window.test || !window.control.branch || !window.control.time || !window.test.branch || !window.test.time){
		$("#detailTable").hide();
		return;
	}
 
	var url = "/getAppCaseChangeCount/" + window.app_name + "/" + window.test.branch + "/" + window.test.time.replace(/\..*/,"") + "/" + window.control.branch + "/" + window.control.time.replace(/\..*/,"");
	//url = url + "&branch1=" + window.test.branch + "&time1=" + window.test.time.replace(/\..*/,"");
	$.getJSON(url, function(res){
		fillDiffDetailTable(res);
	});
}

//$(document).ready(
window.initTestDetective = function(){
	$("#appname").change(changeBranchListByAppname);
	$.getJSON("/getAllAppName.json",function(res){
		if(res == null)
			return;
		window.appNameVersion = res;
		for(var appName in res){
			var optionElement = document.createElement("option");
			optionElement.value = appName;
			optionElement.text = appName;
			$("#appname").append(optionElement);
		}
		//$("#appname").val("xts");
		//$("#appname").change();
		//$("#runDetect").click();
	});
	createChart();
	
}
//);