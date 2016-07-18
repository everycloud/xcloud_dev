define(['tiny-lib/angular',
    "tiny-directives/DateTime",
    "tiny-widgets/Lineplot",
    "fixtures/performanceFixture",
    "tiny-widgets/Columnchart",
    "tiny-directives/Progressbar",
	"tiny-widgets/Message",
    "app/business/resources/services/monitorService",
    "app/business/resources/services/exceptionService",
    "app/business/resources/controllers/monitorCommon",
    "language/dataanalytics-exception"
],
    function (angular, DateTime, Lineplot, performanceFixture, Columnchart, Progressbar,Message, monitorService, exceptionService,monitorCommon, dataanalyticsException) {
        var monitorCtrl = ['$scope', '$state', '$stateParams', 'camel', function ($scope, $state, $stateParams, camel) {
            $scope.fromState = $stateParams.from;
            var clusterId = $stateParams.clusterId;
			var clusterName = $stateParams.clusterName;
            var user = $("html").scope().user;
			
			var i18n = $scope.i18n || {};
			
            //返回按钮
            $scope.return = {
                "id": "return",
                "text": i18n.common_term_return_button||"返回",
                "disable": false,
                "click": function () {
                    $state.go($scope.fromState);
                }
            };
            //是否自定义
            $scope.isCustomized = false;
            $scope.cycle = {
                "label": i18n.common_term_cycle_label||"周期",
                "id": "cycleSelect",
                "values": [
                    {
                        selectId: 'week',
                        label: i18n.common_term_everyWeek_label||'每星期',
                        checked: true
                    },
                    {
                        selectId: 'month',
                        label: i18n.common_term_everyMonth_label||'每月'
                    },
                    {
                        selectId: 'year',
                        label: i18n.common_term_everyYear_label||'每年'
                    },
                    {
                        selectId: 'custom',
                        label: i18n.common_term_custom_label||'自定义'
                    }
                ],
                "width": "120px",
                "change": function () {
                    if ('custom' === $("#cycleSelect").widget().getSelectedId()) {
                        $scope.isCustomized = true;
                    }
                    else {
                        $scope.isCustomized = false;
                        var params = {};
                        params.timeRange = $("#cycleSelect").widget().getSelectedId()
                        $scope.operator.getHistoryMonitor(params);
                        $scope.operator.getHistoryTOP5Monitor(params);
                    }

                }
            };
            $scope.customizedCycle = {
                startDate: {
                    "id": "startDateId",
                    "type": "datetime",
					"timeFormat": "hh:mm",
					"dateFormat": "yy-mm-dd",
					"minDate": "2000-01-01",
					"maxDate": "2050-12-31",
                    "ampm": false,
                    "firstDay": 1
                },
                endDate: {
                    "id": "endDateId",
                    "type": "datetime",
					"timeFormat": "hh:mm",
					"dateFormat": "yy-mm-dd",
					"minDate": "2000-01-01",
					"maxDate": "2050-12-31",
                    "ampm": false,
                    "first-day": 1
                },
                okBtn: {
                    "id": "okBtn",
                    "text": i18n.common_term_query_button||"查询",
                    "click": function () {
                        //historage
                        var params = {};
						var startDate = $("#startDateId").widget().getDateTime();
						var endDate = $("#endDateId").widget().getDateTime();
						if(startDate == '' || endDate == ''){
							var options = {
								type: "error",
								content: i18n.perform_term_inputCycle_valid||"开始、结束时间不能为空！",
								height: "100px",
								width: "350px"
							}
							var msg = new Message(options);
							msg.show();
							return;
						}
                        //2014-04-03 15:31:15
                        var startTime = monitorService.getTime(startDate);
                        var endTime = monitorService.getTime(endDate);
						//自定义统计时段范围是5分钟-365天  5*60*1000,365*24*60*60*1000
						if((parseFloat(endTime) - parseFloat(startTime)) > 365*24*60*60*1000
							|| (parseFloat(endTime) - parseFloat(startTime)) < 5*60*1000){
							var options = {
								type: "error",
								content: i18n.perform_term_customCycleRange_valid||"自定义统计时段范围是5分钟-365天！",
								height: "100px",
								width: "350px"
							}
							var msg = new Message(options);
							msg.show();
							return;
						}

						params.startTime = startTime;
						params.endTime = endTime;
                        params.timeRange = "custom";
                        $scope.operator.getHistoryMonitor(params);
                        //topn
                        $scope.operator.getHistoryTOP5Monitor(params);
                    }
                }
            };
            $scope.export = {
                "id": "exportBtn",
                "text": i18n.common_term_export_button||"导出",
                "click": function () {
                    var params = {};
                    if ('custom' === $("#cycleSelect").widget().getSelectedId()) {
                        var params = {};
                        //2014-04-03 15:31:15
                        params.startTime = monitorService.getTime($("#startDateId").widget().getDateTime());
                        params.endTime = monitorService.getTime($("#endDateId").widget().getDateTime());
                        params.timeRange = "custom";
                    }else{
                        params.timeRange = $("#cycleSelect").widget().getSelectedId();
                    }
                    $scope.operator.export(params);
                }
            };

            $scope.cpuUsage = monitorCommon.getLinePoltConfig("cpuUsageLinePlot",100);
            //内存占用率
            $scope.memoUsage =monitorCommon.getLinePoltConfig("memoUsageLinePlot",100);

            $scope.netIo = monitorCommon.getLinePoltConfig("netIoLinePlot");

            function getCharObject(type, metrics, series) {
                var chartId = type + "_" + metrics + "_chart";
                $("#" + chartId).find("div").remove();
                try{
                    var obj = {};
                    var cc = new Columnchart({
                        id: chartId,
                        width: "500px",
                        isFill: true,
                        style: "bold",
                        values: series
                    });
                    obj.chart = cc;
                    obj.id = chartId;
                }catch(e){}
            }

            function getLinePoltChartData(metricResps, metrics) {
                var chartDatas = [];
                if (metricResps) {
                    for (var i = 0; i < metricResps.length; i++) {
                        var chartData = {};
                        var timeValue = metricResps[i];
                        var cc = [];
                        for (var inx in timeValue) {
                            var v = [timeValue[inx].time, parseFloat(timeValue[inx].value)];
                            cc.push(v);
                        }
                        chartData.data = cc;
                        chartData.color = monitorCommon.LINE_COLORS[i];
                        chartData.label = monitorCommon.METRIC_DESC[metrics[i]];
                        chartDatas.push(chartData);
                    }
                }
                return chartDatas;
            }

            //查询历史监控数据
            var clusterHistoryMetrics = ["cpu_usage", "mem_usage", "nic_byte_in", "nic_byte_out"];
            var clusterHistoryTOPMetrics = ["top_cpu_usage", "top_mem_usage", "top_nic_byte_in", "top_nic_byte_out", "top_storage"];
            var allClucterHistory = ["cpu_usage", "mem_usage", "nic_byte_in", "nic_byte_out","top_cpu_usage", "top_mem_usage", "top_nic_byte_in", "top_nic_byte_out", "top_storage"];
            $scope.operator = {
                "export" : function(params){
                    params.objectId = clusterId;
                    params.objectType = "cluster";
                    params.metrics = allClucterHistory;
                    params.parentId = null;
					params.objectName = clusterName;
                    monitorService.export(params, function (value) {
                            if (value && value.success) {
                                if(value.historyMonitorPath){
                                    $scope.reportUrl = "/goku/rest/v1.5/file/" +value.historyMonitorPath
                                        + "?type=export";
                                    $("#download").attr("src", $scope.reportUrl);
                                }
                            } else {
                                exceptionService.doException(value.data, dataanalyticsException);
                            }
                    });
                },
                "initHistoryMonitor": function () {
                    var params = {};
                    params.startTime = null;
                    params.endTime = null;
                    params.timeRange = "week";
                    $scope.operator.getHistoryMonitor(params);
                },

                "getHistoryMonitor": function (params) {
                    params.objectId = clusterId;
                    params.objectType = "cluster";
                    params.metrics = clusterHistoryMetrics;
                    params.parentId = null;
                    monitorService.getHistoryMonitor(params, function (value) {
                        if (value.success) {
                            $scope.$apply(function () {
                                //CPU
                                $scope.cpuUsage.data = getLinePoltChartData([value.data.cpu_usage],["cpu_usage"]);
                                //MEM
                                $scope.memoUsage.data = getLinePoltChartData([value.data.mem_usage],["mem_usage"]);
                                //NET IO
                                $scope.netIo.data = getLinePoltChartData([value.data.nic_byte_in,value.data.nic_byte_out],["nic_byte_in","nic_byte_out"]);
                            });
                        } else {
                            exceptionService.doException(value.data, dataanalyticsException);
                        }
                    });

                },
                "initHistoryTOP5Monitor" : function(){
                    var params = {};
                    params.timeRange = "week";
                    params.startTime = null;
                    params.endTime = null;
                    $scope.operator.getHistoryTOP5Monitor(params);
                },
                "getHistoryTOP5Monitor": function (params) {
                    params.objectId = clusterId;
                    params.objectType = "cluster";
                    params.metrics = clusterHistoryTOPMetrics;
                    params.parentId = null;
                    var defe = camel.post({
                        "url": "/goku/rest/v1.5/irm/monitors/topn",
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    defe.done(function (response) {
                        $scope.$apply(function () {
                            var monitorTopnMap = response.monitorTopnMap;
                            //集群的
                            for (var inx in clusterHistoryTOPMetrics) {
                                var aa = clusterHistoryTOPMetrics[inx];
                                var meObj = monitorTopnMap[aa];
                                var arr = [];

								var suffix = '%';
								var maxValue = 100;
								if(aa == "top_nic_byte_in" || aa == "top_nic_byte_out"){
									suffix = 'KB/s'
									maxValue = getMaxValue(meObj);
								}
                                for (var inxx in meObj) {
                                    var ar = {
                                        textValue:$.encoder.encodeForHTML(meObj[inxx].indexValue) + $.encoder.encodeForHTML(suffix),//显示的title文本
                                        name: $.encoder.encodeForHTML(meObj[inxx].objectName),//label
										value: precision2(meObj[inxx].indexValue),//当前值
                                        initValue: 0,
                                        maxValue: maxValue,
                                        color: "#1FBE5C"//进度条颜色
                                    }
                                    arr.push(ar);
                                }
                                var series = {series: arr};
                                getCharObject("cluster", aa, series)
                            }
                        });
                    });
                }

            };//operator end

			function getMaxValue(meObj){
				var max = 0.00;
				for (var inxx in meObj) {
					var vv = precision2(meObj[inxx].indexValue);
					max = Math.max(vv,max);
				}
				return max;
			};
			function precision2(numberStr) {
				var number = 0;
				try {
					number = new Number(numberStr);
				} catch (error) {
				}
				return number.toFixed(2);
			};

            //加载top实时数据
            $scope.operator.initHistoryMonitor();
            $scope.operator.initHistoryTOP5Monitor();
        }];
        "use strict";
        return monitorCtrl;
    });


