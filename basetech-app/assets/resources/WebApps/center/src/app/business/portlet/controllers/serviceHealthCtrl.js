/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：服务健康度
 * 修改时间：2014-1-28
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-directives/CirqueChart"
], function ($, angular) {
    "use strict";

    var serviceHealthCtrl = ["$scope", "$timeout", function ($scope, $timeout)
	{
		// 合并地图数据，保持当前客户端坐标不变。位置名name必须唯一。
		function merge(para)
		{
			var index = {};
			if ($scope.para)
			{
				for (var i in $scope.para)
				{
					var e = $scope.para[i];
					index[e.name] = e;
				}
			}
			
			for (var i in para)
			{
				var e = para[i];
				var d = index[e.name];
				if (d)
				{
					e.axes.x = d.axes.x;
					e.axes.y = d.axes.y;
				}
			}
			
			$scope.para = para;
		}
		
		// 地图健康度信息
		function fillMap(scope, para)
		{
			var area = [];
			
			for (var i in para)
			{
				var e = para[i];
				var p = Math.floor(e.value[0] * 100 / (e.value[0] + e.value[1]));
				var s = e.value[0] + e.value[1] + e.value[2];
				var d = {
					id: 'area' + i,
					name: e.name,
					axes: {x: e.axes.x, y: e.axes.y},
					data: [
						{
							value: e.value[0] * 100 / s,
							name: "正常",
							color: "#2ab371"
						},
						{
							value: e.value[1] * 100 / s,
							name: "异常",
							color: "#ed2e2e"
						},
						{
							value: e.value[2] * 100 / s,
							name: "未启用",
							color: "#D5D5D5"
						}
					],
					text: {
						text: "" + p,
						fontSize: 14,
						color: p >= 85 ? "#2ab371" : "#ed2e2e"
					}
				};
				area.push(d);
			}
			scope.area = area;
		}
		
		// 地图区域列表信息
		function fillList(scope, para)
		{
			scope.table = scope.table || {
				order : [[1,'asc']],
				columns : [
					{sTitle:"地域", mData:"area", bSortable:true}, 
					{sTitle:"健康度", mData:"rate", bSortable:true},
					{sTitle:"正常", mData:"normal", bSortable:true}, 
					{sTitle:"异常", mData:"abnormal", bSortable:true}, 
					{sTitle:"未启用", mData:"rest", bSortable:true}
				],
				paging : true,
				callback : function(e)
				{
				},
				data : []
			}
			
			var data = []
			for (var i in para)
			{
				var e = para[i];
				data.push({"area": e.name, 
					"rate":(e.value[0] * 100 / (e.value[0] + e.value[1])).toFixed(2) + '%', 
					"normal":e.value[0], "abnormal":e.value[1], "rest":e.value[2]});
			}
			
			scope.table.data = data;
		}
		
		function getData()
		{
			// 发请求获取数据
			return [
				{
					name: "西安",
					axes: {x: 600, y: 200},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "北京",
					axes: {x: 700, y: 120},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "深圳",
					axes: {x: 700, y: 280},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "广州",
					axes: {x: 0, y: 0},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "杭州",
					axes: {x: 0, y: 70},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "武汉",
					axes: {x: 0, y: 140},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "南京",
					axes: {x: 0, y: 210},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "天津",
					axes: {x: 0, y: 280},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "重庆",
					axes: {x: 50, y: 0},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "成都",
					axes: {x: 50, y: 70},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "乌鲁木齐",
					axes: {x: 50, y: 140},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "兰州",
					axes: {x: 50, y: 210},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "拉萨",
					axes: {x: 50, y: 280},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				},
				{
					name: "郑州",
					axes: {x: 100, y: 0},
					value: [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
				}
			];
		}

		function timer()
		{
			var para = getData();
			merge(para);
			fillMap($scope, $scope.para);
			fillList($scope, $scope.para);
		}
		
		timer();
    }];
	
	var mod = angular.module("serviceHeadlth", []);
	mod.controller("servicePage.health.ctrl", serviceHealthCtrl);
	// 拖放事件处理
	mod.directive('mapdrag', function()
	{
		return {
			link : function(scope, iElement, iAttr)
			{
				iElement.mousedown(function(e)
				{	
					var my = $(this);
					my.css({
						'border-style': 'solid',
						'border-width': '2px',
						'border-color': '#1eade2',
						cursor: 'move'
					});
							
					var o = my.position();
					var p = {top: e.pageY, left: e.pageX};
					
					my.parent().mousemove(function(e){
						window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
						my.css({
							top: o.top + e.pageY - p.top,
							left: o.left + e.pageX - p.left,
							cursor: 'move'
						});
					})
					
					function unbind(e)
					{					
						my.parent().unbind("mousemove");
						my.css({
							border: 'none',
							cursor: 'auto'
						});
						
						var o = my.position();
						
						for (var i in scope.para)
						{
							var e = scope.para[i];
							if (e.name == iAttr.name)
							{
								e.axes.x = o.left;
								e.axes.y = o.top;
								break;
							}
						}
					}
					
					my.mouseup(unbind);
				})
			}
		}
	})

    return mod;
});
