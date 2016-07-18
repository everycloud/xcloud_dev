/*
 虚拟主机监控
 */
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
    function (angular, DateTime, Lineplot, performanceFixture, Columnchart, Progressbar, Message, monitorService, exceptionService, monitorCommon, dataanalyticsException) {
        var monitorCtrl = ['$scope', '$state', '$stateParams', 'camel', function ($scope, $state, $stateParams, camel) {
                var user = $("html").scope().user;
                var resourceId = $stateParams.hostId;
                var name = $stateParams.name;
                //成立时间 2011-9-26
                var MIN_DATE = new Date(2011, 8, 26);
                var formatDate = function (date) {
                    date = date || new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();

                    month < 10 && (month = "0" + month);
                    day < 10 && (day = "0" + day);
                    hours < 10 && (hours = "0" + hours);
                    minutes < 10 && (minutes = "0" + minutes);
                    seconds < 10 && (seconds = "0" + seconds);
                    return [[year, month, day].join("-"),[hours, minutes, seconds].join("-")].join(" ");
                };

                //是否自定义
                $scope.isCustomized = false;
                $scope.cycle = {
                    "label": $scope.i18n.common_term_cycle_label,
                    "id": "cycleSelect",
                    "values": [
                        {
                            selectId: 'week',
                            label: $scope.i18n.common_term_everyWeek_label,
                            checked: true
                        },
                        {
                            selectId: 'month',
                            label: $scope.i18n.common_term_everyMonth_label
                        },
                        {
                            selectId: 'year',
                            label: $scope.i18n.common_term_everyYear_label
                        },
                        {
                            selectId: 'custom',
                            label: $scope.i18n.common_term_custom_label
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
                            params.timeRange = $("#cycleSelect").widget().getSelectedId();
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
                        "minDate": formatDate(MIN_DATE),
                        "maxDate": formatDate(),
                        "ampm": false,
                        "firstDay": 1,
                        "onClose": function(date){
                            if(date){
                                $("#" + $scope.customizedCycle.endDate.id).widget().option("minDate", date);
                            }
                            else{
                                $("#" + $scope.customizedCycle.endDate.id).widget().option("minDate", formatDate(MIN_DATE));
                            }
                        }
                    },
                    endDate: {
                        "id": "endDateId",
                        "type": "datetime",
						"timeFormat": "hh:mm",
						"dateFormat": "yy-mm-dd",
                        "minDate": formatDate(MIN_DATE),
                        "maxDate": formatDate(),
                        "ampm": false,
                        "first-day": 1,
                        "onClose": function(date){
                            if(date){
                                $("#" + $scope.customizedCycle.startDate.id).widget().option("maxDate", date);
                            }
                            else{
                                $("#" + $scope.customizedCycle.startDate.id).widget().option("maxDate", formatDate());
                            }
                        }
                    },
                    okBtn: {
                        "id": "okBtn",
                        "text": $scope.i18n.common_term_query_button,
                        "click": function () {
                            var params = {};
                            var startDate = $("#startDateId").widget().getDateTime();
                            var endDate = $("#endDateId").widget().getDateTime();
                            if (startDate == '' || endDate == '') {
                                var options = {
                                    type: "error",
                                    content: $scope.i18n.perform_term_inputCycle_valid || "开始、结束时间不能为空！",
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
                            if ((parseFloat(endTime) - parseFloat(startTime)) > 365 * 24 * 60 * 60 * 1000
                                || (parseFloat(endTime) - parseFloat(startTime)) < 5 * 60 * 1000) {
                                var options = {
                                    type: "error",
                                    content: $scope.i18n.perform_term_customCycleRange_valid || "自定义统计时段范围是5分钟-365天！",
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
                }
                ;
                $scope.export = {
                    "id": "exportBtn",
                    "text": $scope.i18n.common_term_export_button,
                    "click": function () {
                        var params = {};
                        if ('custom' === $("#cycleSelect").widget().getSelectedId()) {
                            var params = {};
                            //2014-04-03 15:31:15
                            params.startTime = monitorService.getTime($("#startDateId").widget().getDateTime());
                            params.endTime = monitorService.getTime($("#endDateId").widget().getDateTime());
                            params.timeRange = "custom";
                        } else {
                            params.timeRange = $("#cycleSelect").widget().getSelectedId();
                        }
                        $scope.operator.export(params);
                    }
                };

//内存占用率
                $scope.memoUsage = monitorCommon.getLinePoltConfig("memUsageId", 100);

                $scope.netIo = monitorCommon.getLinePoltConfig("netIoId", null);

                $scope.diskIo = monitorCommon.getLinePoltConfig("diskIoId", null);

                $scope.disk_usage = monitorCommon.getLinePoltConfig("disk_usageId", 100);

                $scope.cpuUsage = monitorCommon.getLinePoltConfig("cpuUsageId", 100);

                function getChartData(metricResps, metrics) {
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
                var clusterHistoryMetrics = ["cpu_usage", "mem_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_usage"];
                $scope.operator = {
                    "export": function (params) {
                        params.objectId = resourceId;
                        params.objectType = "host";
                        params.metrics = clusterHistoryMetrics;
                        params.parentId = null;
                        params.objectName = name;
                        monitorService.export(params, function (value) {
                            if (value && value.success) {
                                if (value.historyMonitorPath) {
                                    $scope.reportUrl = "/goku/rest/v1.5/file/" + value.historyMonitorPath
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
                        params.objectType = "host";
                        params.objectId = resourceId;
                        params.metrics = clusterHistoryMetrics;
                        params.parentId = null;
                        var paramsJson = JSON.stringify(params)
                        monitorService.getHistoryMonitor(params, function (value) {
                            if (value.success) {
                                $scope.$apply(function () {
                                    //CPU
                                    $scope.cpuUsage.data = getChartData([value.data.cpu_usage], ["cpu_usage"]);
                                    //MEM
                                    $scope.memoUsage.data = getChartData([value.data.mem_usage], ["mem_usage"]);

                                    //NET IO
                                    $scope.netIo.data = getChartData([ value.data.nic_byte_in, value.data.nic_byte_out], ["nic_byte_in", "nic_byte_out"]);

                                    //disk IO
                                    $scope.diskIo.data = getChartData([ value.data.disk_io_in, value.data.disk_io_out], ["disk_io_in", "disk_io_out"]);

                                    //disk 占用率
                                    $scope.disk_usage.data = getChartData([value.data.disk_usage], ["disk_usage"]);
                                });
                            } else {
                            }
                        });
                    }
                };//operator end

//加载top实时数据
                $scope.operator.init();
            }]
            ;
        "use strict";
        return monitorCtrl;
    })
;


