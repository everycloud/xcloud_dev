define(['tiny-lib/angular',
    "tiny-widgets/Message",
    "tiny-directives/DateTime",
    "tiny-widgets/Lineplot",
    "fixtures/performanceFixture",
    "tiny-widgets/Columnchart",
    "tiny-directives/Progressbar",
    "app/business/resources/services/monitorService",
    "app/business/resources/services/exceptionService",
    "app/business/resources/controllers/monitorCommon",
    "language/dataanalytics-exception"
],
    function (angular, Message, DateTime, Lineplot, performanceFixture, Columnchart, Progressbar, monitorService, exceptionService,monitorCommon, dataanalyticsException) {
        var monitorCtrl = ['$scope', '$state', '$stateParams', 'camel', function ($scope, $state, $stateParams, camel) {
            $scope.fromState = $stateParams.from;
            var resourceId = $stateParams.storeId;
            var user = $("html").scope().user;

            var topValue = function () {
                var topValueSelect = [];
                for (var i = 1; i < 11; i++) {
                    var s = {
                        "selectId": i, "label": i
                    };
                    if (i == 3) {
                        s.checked = true;
                    }
                    topValueSelect.push(s);
                }
                return topValueSelect;
            };
            $scope.topnModel = {
                "id": "topnModelId",
                "values": topValue(),
                'disable': true,
                "height": 30,
                "width": "60px",
                "change": function () {
                    var params = {};
                    if($scope.isCustomized){
                        params.timeRange = "custom";
                    }else{
                        params.timeRange = $("#cycleSelect").widget().getSelectedId();
                    }
                    params.topn = $("#topnModelId").widget().getSelectedId();
                    $scope.operator.getHistoryMonitor(params);
                }
            };


            //是否自定义
            $scope.isCustomized = false;
            $scope.cycle = {
                "label": $scope.i18n.common_term_cycle_label,
                "id": "cycleSelect",
                "values": [
                    {
                        selectId: 'tenminutes',
                        label: $scope.i18n.common_term_10min_label
                    },
                    {
                        selectId: 'onehour',
                        label: $scope.i18n.common_term_oneHour_label
                    },
                    {
                        selectId: 'oneday',
                        label: $scope.i18n.common_term_oneDay_label,
                        checked: true
                    },
                    {
                        selectId: 'week',
                        label: $scope.i18n.common_term_everyWeek_label
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
                "width": "80px",
                "change": function () {
                    if ('custom' === $("#cycleSelect").widget().getSelectedId()) {
                        $scope.isCustomized = true;
                    }
                    else {
                        $scope.isCustomized = false;
                        var params = {};
                        params.timeRange = $("#cycleSelect").widget().getSelectedId();
                        params.topn = $("#topnModelId").widget().getSelectedId();
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
                    "text": $scope.i18n.common_term_query_button,
                    "click": function () {
                        var params = {};
                        $scope.operator.getHistoryMonitor(params);
                    }
                }
            };

            $scope.svctm_time = monitorCommon.getLinePoltConfig("svctm_timePlot");
            $scope.await_time = monitorCommon.getLinePoltConfig("await_timePlot");
            $scope.storage_read_ps = monitorCommon.getLinePoltConfig("storage_read_psPlot");
            $scope.storage_write_ps = monitorCommon.getLinePoltConfig("storage_write_psPlot");

            function getChartData(metricResp, metric) {
                var chartDatas = [];
                if (metricResp && metricResp[metric]) {
                    for (var i = 0; i < metricResp[metric].length; i++) {
                        var chartData = {};
                        var metricValue = metricResp[metric][i];
                        var timeValue =  metricValue.hostoryMonitorMap[metric];
                        var cc = [];
                        for (var inx in timeValue) {
                            var v = [timeValue[inx].time, parseFloat(timeValue[inx].value)];
                            cc.push(v);
                        }
                        chartData.data = cc;
                        chartData.color = monitorCommon.LINE_COLORS[i];
                        chartData.label =   $.encoder.encodeForHTML(metricValue.objectName);
                        chartDatas.push(chartData);
                    }
                }
                return chartDatas;
            }

            //查询历史监控数据
            var clusterHistoryMetrics = ["storage_read_ps", "storage_write_ps", "await_time", "svctm_time"];
            $scope.operator = {
                "initHistoryMonitor": function () {
                    var params = {};
                    params.startTime = null;
                    params.endTime = null;
                    params.timeRange = "oneday";
                    params.topn = 3;
                    $scope.operator.getHistoryMonitor(params);
                },
                "getHistoryMonitor": function (params) {
                    if($scope.isCustomized){
                        var startDate = $("#startDateId").widget().getDateTime();
                        var endDate = $("#endDateId").widget().getDateTime();
                        var topn = $("#topnModelId").widget().getSelectedId();
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
                        params.startTime = startTime;
                        params.endTime = endTime;
                        params.timeRange = "custom";
                        params.topn = topn;
                    }

                    params.objectId = resourceId;
                    params.objectType = "storage";
                    params.metrics = clusterHistoryMetrics;
                    params.parentId = null;
                    monitorService.getTopnDatastore(params, function (value) {
                        if (value.success) {
                            $scope.$apply(function () {
                                $scope.await_time.data = getChartData(value.data,"await_time");
                                $scope.svctm_time.data = getChartData(value.data,"svctm_time");
                                $scope.storage_read_ps.data = getChartData(value.data,"storage_read_ps");
                                $scope.storage_write_ps.data = getChartData(value.data,"storage_write_ps");
                            });
                        } else {
                            exceptionService.doException(value.data, dataanalyticsException);
                        }
                    });
                }
            };//operator end

            $scope.operator.initHistoryMonitor();
        }];
        "use strict";
        return monitorCtrl;
    });


