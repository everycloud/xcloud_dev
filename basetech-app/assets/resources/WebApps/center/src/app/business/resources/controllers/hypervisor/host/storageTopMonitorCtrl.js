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
    function (angular, DateTime, Lineplot, performanceFixture, Columnchart, Progressbar,Message, monitorService, exceptionService, monitorCommon,dataanalyticsException) {
        var monitorCtrl = ['$scope', '$state', '$stateParams', 'camel', function ($scope, $state, $stateParams, camel) {
            $scope.fromState = $stateParams.from;
            var resourceId = $stateParams.hostId;
            var user = $("html").scope().user;
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

            //返回按钮
            $scope.return = {
                "id": "return",
                "text": "返回",
                "disable": false,
                "click": function () {
                    $state.go($scope.fromState);
                }
            };

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
                        params.startTime = monitorService.getTime($("#startDateId").widget().getDateTime());
                        params.endTime = monitorService.getTime($("#endDateId").widget().getDateTime());
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
                        //historage
                        var params = {};
						var startDate = $("#startDateId").widget().getDateTime();
						var endDate = $("#endDateId").widget().getDateTime();
						if(startDate == '' || endDate == ''){
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
						if((parseFloat(endTime) - parseFloat(startTime)) > 365*24*60*60*1000
							|| (parseFloat(endTime) - parseFloat(startTime)) < 5*60*1000){
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
                        params.topn = $("#topnModelId").widget().getSelectedId();
                        $scope.operator.getHistoryMonitor(params);
                    }
                }
            };

            function getChartConfig(id) {
                var chartConfig = {
                    "id": id,
                    "width": "500px",
                    "height": "240px",
                    "data": [],
                    "caption": {},
                    "tips": {
                        "tipType": "hover",
                        "content": "%s %y.2"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }},
                    "series": {
                        "points": {
                            "show": true,
                            "symbol": "ring"
                        },
                        "lines": {
                            "show": true
                        }
                    },
                    "xaxis": {
                        "show": true,
                        "position": "bottom",
                        "mode": "time",
                        "timeformat": "%Y/%m/%d",
                        "min": null,//坐标轴最小值
                        "max": null,//坐标轴最大值
                        "font": {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0,//坐标轴最小值
                        "max": null,//坐标轴最大值
                        "font": {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "legend": {
                        "show": true,
                        "noColumns": 1,
                        "labelBoxBorderColor": "red"
                    }
                }
                return chartConfig;
            };

            $scope.svctm_time =  monitorCommon.getLinePoltConfig("svctm_timePlot",null);
            $scope.await_time =  monitorCommon.getLinePoltConfig("await_timePlot",null);
            $scope.storage_read_ps =  monitorCommon.getLinePoltConfig("storage_read_psPlot",null);
            $scope.storage_write_ps =  monitorCommon.getLinePoltConfig("storage_write_psPlot",null);

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
                        chartData.label = metricValue.objectName;
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
                    params.objectId = resourceId;
                    params.objectType = "host";
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
                        }
                    });
                }
            };//operator end

            $scope.operator.initHistoryMonitor();
        }];
        "use strict";
        return monitorCtrl;
    });


