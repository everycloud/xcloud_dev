define(['tiny-lib/angular',
    "tiny-directives/DateTime",
    "tiny-directives/Lineplot",
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
            var user = $("html").scope().user;
               //主机、虚拟机公用此页面
               var resourceId = $stateParams.vmId;
			var vmName = $stateParams.name;
			$scope.vmType = $stateParams.vmType;
            //返回按钮
            $scope.return = {
                "id": "return",
                "text":  $scope.i18n.common_term_return_button || "返回",
                "disable": false,
                "click": function () {
                    $state.go($scope.fromState);
                }
            };
            //是否自定义
            $scope.isCustomized = false;
            $scope.cycle = {
                "label":  $scope.i18n.common_term_cycle_label || "周期",
                "id": "cycleSelect",
                "values": [
                    {
                        selectId: 'week',
                        label:  $scope.i18n.common_term_everyWeek_label || '每星期',
                        checked: true
                    },
                    {
                        selectId: 'month',
                        label:  $scope.i18n.common_term_everyMonth_label || '每月'
                    },
                    {
                        selectId: 'year',
                        label:  $scope.i18n.common_term_everyYear_label || '每年'
                    },
                    {
                        selectId: 'custom',
                        label: $scope.i18n.common_term_custom_label ||  '自定义'
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
                    "text":  $scope.i18n.common_term_query_button || "查询",
                    "click": function () {
                        var params = {};
						var startDate = $("#startDateId").widget().getDateTime();
						var endDate = $("#endDateId").widget().getDateTime();
						if(startDate == '' || endDate == ''){
							var options = {
								type: "error",
								content:  $scope.i18n.perform_term_inputCycle_valid || "开始、结束时间不能为空！",
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
								content:  $scope.i18n.perform_term_customCycleRange_valid || "自定义统计时段范围是5分钟-365天！",
								height: "100px",
								width: "350px"
							}
							var msg = new Message(options);
							msg.show();
							return;
						}
                        //2014-04-03 15:31:15
                        params.startTime = startTime;
                        params.endTime = endTime;
                        params.timeRange = "custom";
                        $scope.operator.getHistoryMonitor(params);
                    }
                }
            };
            $scope.export = {
                "id": "exportBtn",
                "text":  $scope.i18n.common_term_export_button || "导出",
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
            $scope.memoUsage = monitorCommon.getLinePoltConfig("memoUsageLinePlot",100);

            $scope.netIo = monitorCommon.getLinePoltConfig("netIoLinePlot",null);

            $scope.diskIo = monitorCommon.getLinePoltConfig("diskIoLinePlot",null);

            //diskUsageLinePlot 100
            $scope.disk_usage =monitorCommon.getLinePoltConfig("diskUsageLinePlot",100);

            //CPU等待时间
            $scope.cpu_ready_time = monitorCommon.getLinePoltConfig("cpu_ready_time_id",null);

            //磁盘I/O命令次数
            $scope.disk_ps = monitorCommon.getLinePoltConfig("disk_ps_id",null);

            //磁盘读写时延
            $scope.disk_delay =monitorCommon.getLinePoltConfig("disk_delay_id",null);

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
            var clusterHistoryMetrics = ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out", "disk_io_in",
                "disk_io_out","disk_usage","disk_in_ps","disk_out_ps","cpu_ready_time","disk_read_delay","disk_write_delay"];
            $scope.operator = {
                "export" : function(params){
                    params.objectId = resourceId;
                    params.objectType = "vm";
                    params.metrics = clusterHistoryMetrics;
                    params.parentId = null;
					params.objectName = vmName;
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
                "init": function () {
                    var params = {};
                    params.startTime = null;
                    params.endTime = null;
                    params.timeRange = "week";
                    $scope.operator.getHistoryMonitor(params);
                },
                "getHistoryMonitor": function (params) {
                    params.objectType = "vm";
                    params.objectId = resourceId;
                    params.metrics = clusterHistoryMetrics;
                    params.parentId = null;
                    var paramsJson = JSON.stringify(params)
                    monitorService.getHistoryMonitor(params, function (value) {
                        if (value.success) {
                            $scope.$apply(function () {
                                //CPU
                                $scope.cpuUsage.data = getLinePoltChartData([value.data.cpu_usage],["cpu_usage"]);
                                //MEM
                                $scope.memoUsage.data = getLinePoltChartData([value.data.mem_usage],["mem_usage"]);

                                //NET IO
                                $scope.netIo.data = getLinePoltChartData([value.data.nic_byte_in,value.data.nic_byte_out],["nic_byte_in","nic_byte_out"]);

                                //disk IO
                                $scope.diskIo.data = getLinePoltChartData([value.data.disk_io_in,value.data.disk_io_out],["disk_io_in","disk_io_out"]);

                                //disk 占用率
                                $scope.disk_usage.data = getLinePoltChartData([value.data.disk_usage],["disk_usage"]);

                                //CPU等待时间（cpu_ready_time）
                                $scope.cpu_ready_time.data = getLinePoltChartData([value.data.cpu_ready_time],["cpu_ready_time"]);

                                //磁盘I/O命令次数（disk_in_ps、disk_out_ps）
                                $scope.disk_ps.data = getLinePoltChartData([value.data.disk_in_ps,value.data.disk_out_ps],["disk_in_ps","disk_out_ps"]);

                                //磁盘读写时延（disk_read_delay、disk_write_delay）
                                $scope.disk_delay.data = getLinePoltChartData([value.data.disk_read_delay,value.data.disk_write_delay],["disk_read_delay","disk_write_delay"]);
                            });
                        } else {
                            exceptionService.doException(value.data, dataanalyticsException);
                        }
                    });
                }
            };//operator end

            //加载top实时数据
            $scope.operator.init();
        }];
        "use strict";
        return monitorCtrl;
    });


