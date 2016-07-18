/**
 * Created on 14-2-21.
 */
define([
        'tiny-lib/jquery',
        'tiny-lib/encoder',
        'tiny-lib/angular',
        "app/services/httpService",
        "tiny-lib/underscore",
        "app/business/application/services/appMonitorService",
        "app/business/ecs/services/monitorService",
        "app/services/commonService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/Lineplot",
        "fixtures/userFixture",
        "fixtures/appFixture"
    ],
    function ($, encoder, angular, http, _, appMonitorService, monitorService, commonService) {
        "use strict";

        var createUserCtrl = ['$scope', "$compile", 'camel', "exception", "appCommonData", "$q",
            function ($scope, $compile, camel, exception, appCommonData, $q) {
                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n;
                var vpcId = appCommonData.vpcId;
                var appId = appCommonData.appId;
                var cloudInfraId = appCommonData.cloudInfraId;
                var appMonitorServiceIns = new appMonitorService(exception, $q, camel);
                var topSelValues = "0";
                var COLOR_ARRAY = ["#5ecc49", "#f7820d", "#009ae7", "#D5D5D5"];
                var TOP_N = 3; //显示top 3

                $scope.noDataTips = i18n.app_term_currentNullData_valid;
                //CPU占用率
                $scope.current = {
                    "id": "currentCPUOccupanyId",
                    "label": i18n.common_term_current_label
                };
                $scope.maximum = {
                    "id": "maximumCPUOccupanyId",
                    "label": i18n.common_term_max_label
                };
                $scope.average = {
                    "id": "averageCPUOccupanyId",
                    "label": i18n.common_term_Avg_label
                };
                //内存占用率
                $scope.currentMemory = {
                    "id": "currentMemoryOccupanyId",
                    "label":i18n.common_term_current_label
                };
                $scope.maximumMemory = {
                    "id": "maximumMemoryOccupanyId",
                    "label": i18n.common_term_max_label
                };
                $scope.averageMemory = {
                    "id": "averageMemoryOccupanyId",
                    "label": i18n.common_term_Avg_label
                };
                //磁盘I/O
                $scope.currentDiskIO = {
                    "id": "currentMemoryOccupanyId",
                    "label": i18n.common_term_current_label
                };
                $scope.maximumDiskIO = {
                    "id": "maximumMemoryOccupanyId",
                    "label": i18n.common_term_max_label
                };
                $scope.averageDiskIO = {
                    "id": "averageMemoryOccupanyId",
                    "label":i18n.common_term_Avg_label
                };

                $scope.statistics = {
                    "id": "statisticsId",
                    "width": "120",
                    "values": [{
                        "selectId": "0",
                        "label": "TOP3",
                        "checked": true
                    }, {
                        "selectId": "1",
                        "label": "TOP5"
                    }, {
                        "selectId": "2",
                        "label": "TOP10"
                    }],
                    "change": function () {
                        topSelValues = $("#" + $scope.statistics.id).widget().getSelectedId();
                        queryMonitor();
                    }
                };
                var threshold = [{
                    below: 5,
                    belowColor: "rgb(200, 20, 30)",
                    lineColor: "rgb(200, 20, 30)"
                }];

                $scope.cpuRate4Chart = {
                    "id": "appCpuRate4ChartId",
                    "width": "360px",
                    "height": "200px",
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
                        "ticks": 7,
                        "timeformat": "%m/%d",
                        "tickLength": 6,
                        "min": null, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0,
                        "max": null,
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "userTips": {
                        "tipType": "hover",
                        "content": "%x<br>%s %y.2",
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "legend": {
                        "show": true,
                        "position": "ne",
                        "noColumns": 1,
                        "labelBoxBorderColor": "red",
                        "container": $("#appHistoryCpuLegend")
                    },
                    "data": [{
                        data: [],
                        color: "#1fbe5c",
                        "label": i18n.perform_term_CPUusageRate_label
                    }]
                };

                $scope.cpuRate = {
                    "current": "",
                    "max": "",
                    "average": ""
                };

                $scope.dataValid = {
                    "cpuHistory": true,
                    "memHistory": true,
                    "diskHistory": true
                };

                $scope.memRate4Chart = {
                    "id": "appMemRate4ChartId",
                    "width": "360px",
                    "height": "200px",
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
                        "ticks": 7,
                        "timeformat": "%m/%d",
                        "tickLength": 6,
                        "min": null, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0,
                        "max": null,
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },

                    "userTips": {
                        "tipType": "hover",
                        "content": "%x<br>%s %y.2",
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "legend": {
                        "show": true,
                        "position": "ne",
                        "noColumns": 1,
                        "labelBoxBorderColor": "red",
                        "container": $("#appHistoryMemLegend")
                    },
                    "data": [{
                        data: [],
                        color: "#1fbe5c",
                        "label": i18n.perform_term_memUsageRate_label
                    }]
                };

                $scope.memoryRate = {
                    "current": "",
                    "max": "",
                    "average": ""
                };

                $scope.diskRate = {
                    "current": "",
                    "max": "",
                    "average": ""
                };

                $scope.diskIORate4Chart = {
                    "id": "appDiskIORate4ChartId",
                    "width": "360px",
                    "height": "200px",
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
                        "timeformat": "%m/%d",
                        "tickLength": 6,
                        "min": null, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0,
                        "max": null,
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "userTips": {
                        "tipType": "hover",
                        "content": "%x<br>%s %y.2",
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "legend": {
                        "show": true,
                        "position": "ne",
                        "noColumns": 1,
                        "labelBoxBorderColor": "red",
                        "container": $("#appHistoryDiskLegend")
                    },
                    "data": [{
                        data: [],
                        color: "#1fbe5c",
                        "label": i18n.common_term_diskIOusageRate_label
                    }]
                };

                var legendData = [{
                    type: 0,
                    color: "#1FBE5C",
                    desc: i18n.common_term_online_value
                }, {
                    type: 0,
                    color: "#999999",
                    desc: i18n.common_term_offline_label
                }, {
                    type: 1,
                    desc: i18n.common_term_unitNum_label
                }, {
                    type: 1,
                    desc: "2013-5-16 17:36:56 UTC"
                }];
                var values = {
                    series: [{
                        textValue: "<span>36%</span>", //显示的title文本
                        name: "Airtel", //label
                        value: 0.36, //当前值
                        maxValue: 1,
                        isFill: true,
                        color: "#1FBE5C" //进度条颜色
                    }, {
                        textValue: "<span>21%</span>",
                        name: "Telefonica",
                        value: 0.21,
                        maxValue: 1,
                        isFill: true,
                        color: "#1FBE5C"
                    }, {
                        textValue: "<span>17%</span>",
                        name: "Orange",
                        value: 0.17,
                        maxValue: 1,
                        isFill: true,
                        color: "#1FBE5C"
                    }],
                    legend: {}
                };
                $scope.CPUChartModel = {
                    "id": "CPUChartModelId",
                    "isFill": false,
                    "bold": "bold",
                    "values": {
                        series: [],
                        legend: {}
                    },
                    "width": "100%"
                };
                $scope.memoryChartModel = {
                    "id": "memoryChartModelId",
                    "isFill": false,
                    "bold": "bold",
                    "values": {
                        series: [],
                        legend: {}
                    },
                    "width": "100%"
                };
                $scope.diskInChartModel = {
                    "id": "diskInChartModelId",
                    "isFill": false,
                    "bold": "bold",
                    "values": {
                        series: [],
                        legend: {}
                    },
                    "width": "100%"
                };
                $scope.diskOutChartModel = {
                    "id": "diskOutChartModelId",
                    "isFill": false,
                    "bold": "bold",
                    "values": {
                        series: [],
                        legend: {}
                    },
                    "width": "100%"
                };

                function queryMonitor() {
                    var params = {
                        "user": user,
                        "cloudInfraId": cloudInfraId,
                        "appId": appId,
                        "vpcId": vpcId
                    };

                    var deferred = appMonitorServiceIns.queryAppResMonitor(params);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        if (data.historyInspectData && (data.historyInspectData.length > 0)) {
                            var cpuHistoryRate = null;
                            var memHistoryRate = null;
                            var diskInHistoryRate = null;
                            var diskOutHistoryRate = null;
                            _.each(data.historyInspectData, function (item, index) {
                                if (!item) {
                                    return;
                                }
                                if (item.metricName === "cpu_usage") {
                                    cpuHistoryRate = item.metricValue;
                                    return;
                                }
                                if (item.metricName === "mem_usage") {
                                    memHistoryRate = item.metricValue;
                                    return;
                                }
                                if (item.metricName === "disk_io_in") {
                                    diskInHistoryRate = item.metricValue;
                                    return;
                                }
                                if (item.metricName === "disk_io_out") {
                                    diskOutHistoryRate = item.metricValue;
                                    return;
                                }
                            });

                            var tmpArray;
                            //资源统计-CPU占用率
                            if (appMonitorServiceIns.checkHistoryValid(cpuHistoryRate)) {
                                tmpArray = appMonitorServiceIns.calculateMax(cpuHistoryRate);
                                $scope.dataValid.cpuHistory = true;
                                $scope.cpuRate = {
                                    "current": appMonitorServiceIns.getVisibleValue(tmpArray.current),
                                    "max": appMonitorServiceIns.getVisibleValue(tmpArray.max),
                                    "average": appMonitorServiceIns.getVisibleValue(tmpArray.ave)
                                };
                                $scope.cpuRate4Chart.data = [{
                                    data: tmpArray.history,
                                    color: "#1fbe5c",
                                    "label": i18n.perform_term_CPUusageRate_label
                                }];
                            } else {
                                $scope.dataValid.cpuHistory = false;
                            }

                            //资源统计-内存占用率
                            if (appMonitorServiceIns.checkHistoryValid(memHistoryRate)) {
                                tmpArray = appMonitorServiceIns.calculateMax(memHistoryRate);
                                $scope.dataValid.memHistory = true;
                                $scope.memoryRate = {
                                    "current": appMonitorServiceIns.getVisibleValue(tmpArray.current),
                                    "max": appMonitorServiceIns.getVisibleValue(tmpArray.max),
                                    "average": appMonitorServiceIns.getVisibleValue(tmpArray.ave)
                                };
                                $scope.memRate4Chart.data = [{
                                    data: tmpArray.history,
                                    color: "#1fbe5c",
                                    "label": i18n.perform_term_memUsageRate_label
                                }];
                            } else {
                                $scope.dataValid.memHistory = false;
                            }

                            //资源统计-磁盘I/O
                            if (appMonitorServiceIns.checkHistoryValid(diskInHistoryRate) || appMonitorServiceIns.checkHistoryValid(diskOutHistoryRate)) {
                                var tmpInArray = appMonitorServiceIns.calculateMax(diskInHistoryRate);
                                var tmpOutArray = appMonitorServiceIns.calculateMax(diskOutHistoryRate);
                                $scope.dataValid.diskHistory = true;
                                $scope.diskRate = {
                                    "current": "",
                                    "max": "",
                                    "average": ""
                                };
                                if (!appMonitorServiceIns.isValidMonitorNumber(tmpInArray.current) && !appMonitorServiceIns.isValidMonitorNumber(tmpOutArray.current)) {
                                    $scope.diskRate.current = "";
                                } else {
                                    $scope.diskRate.current = appMonitorServiceIns.getVisibleValue(tmpInArray.current) + "/" + appMonitorServiceIns.getVisibleValue(tmpOutArray.current);
                                }
                                if (!appMonitorServiceIns.isValidMonitorNumber(tmpInArray.max) && !appMonitorServiceIns.isValidMonitorNumber(tmpOutArray.max)) {
                                    $scope.diskRate.max = "";
                                } else {
                                    $scope.diskRate.max = appMonitorServiceIns.getVisibleValue(tmpInArray.max) + "/" + appMonitorServiceIns.getVisibleValue(tmpOutArray.max);
                                }
                                if (!appMonitorServiceIns.isValidMonitorNumber(tmpInArray.ave) && !appMonitorServiceIns.isValidMonitorNumber(tmpOutArray.ave)) {
                                    $scope.diskRate.average = "";
                                } else {
                                    $scope.diskRate.average = appMonitorServiceIns.getVisibleValue(tmpInArray.ave) + "/" + appMonitorServiceIns.getVisibleValue(tmpOutArray.ave);
                                }
                                $scope.diskIORate4Chart.data = [{
                                    data: tmpInArray.history,
                                    color: "#5ecc49",
                                    "label": i18n.common_term_diskWriteSpeedKBs_label
                                }, {
                                    data: tmpOutArray.history,
                                    color: "#f7820d",
                                    "label": i18n.common_term_diskReadSpeedKBs_label
                                }];
                            } else {
                                $scope.dataValid.diskHistory = false;
                            }
                        }

                        if (!data.instantInspectData) {
                            return;
                        }
                        var cpuRealtimeSpecArray = null;
                        var memRealtimeSpecArray = null;
                        var diskInSpecArray = null;
                        var diskOutSpecArray = null;
                        cpuRealtimeSpecArray = data.instantInspectData.cpu_usage || [];
                        memRealtimeSpecArray = data.instantInspectData.mem_usage || [];
                        diskInSpecArray = data.instantInspectData.disk_io_in || [];
                        diskOutSpecArray = data.instantInspectData.disk_io_out || [];
                        var cpuIndex = Math.min(cpuRealtimeSpecArray.length, TOP_N);
                        var memIndex = Math.min(memRealtimeSpecArray.length, TOP_N);
                        var diskInIndex = Math.min(diskInSpecArray.length, TOP_N);
                        var diskOutIndex = Math.min(diskOutSpecArray.length, TOP_N);
                        var cpuRealValues = {
                            "series": [],
                            "legend": {}
                        };
                        var i;
                        for (i = 0; i < cpuIndex; i++) {
                            cpuRealValues.series.push(generatePercentValue(i, cpuRealtimeSpecArray[i], "cpu_usage", 1, true));
                        }
                        $scope.CPUChartModel.values = cpuRealValues;

                        var memRealvalues = {
                            "series": [],
                            "legend": {}
                        };
                        for (i = 0; i < memIndex; i++) {
                            memRealvalues.series.push(generatePercentValue(i, memRealtimeSpecArray[i], "mem_usage", 1, true));
                        }
                        $scope.memoryChartModel.values = memRealvalues;

                        var diskInValues = {
                            "series": [],
                            "legend": {}
                        };
                        var diskInMax = 2 * getMaxDiskData(diskInSpecArray, diskInIndex, true);
                        for (i = 0; i < diskInIndex; i++) {
                            diskInValues.series.push(generatePercentValue(i, diskInSpecArray[i], "disk_io_in", diskInMax, false));
                        }
                        $scope.diskInChartModel.values = diskInValues;

                        var diskOutValues = {
                            "series": [],
                            "legend": {}
                        };
                        var diskOutMax = 2 * getMaxDiskData(diskOutSpecArray, diskOutIndex, false);
                        for (i = 0; i < diskOutIndex; i++) {
                            diskOutValues.series.push(generatePercentValue(i, diskOutSpecArray[i], "disk_io_out", diskOutMax, false));
                        }
                        $scope.diskOutChartModel.values = diskOutValues;
                    });
                }

                //在diskSpecArray中搜索最大值,直至序号为searchEndIndex的元素  isDiskIn磁盘读入标志为true 磁盘读出为false
                function getMaxDiskData(diskSpecArray, searchEndIndex, isDiskIn) {
                    var max = 1;
                    var searchIndex;
                    var tmpValue;
                    for (searchIndex = 0; searchIndex < searchEndIndex; searchIndex++) {
                        if (!diskSpecArray[searchIndex].inspectInfo) {
                            continue;
                        }
                        if (isDiskIn && (null !== diskSpecArray[searchIndex].inspectInfo.disk_io_in)) {
                            tmpValue = parseFloat(diskSpecArray[searchIndex].inspectInfo.disk_io_in);
                            if (!isNaN(tmpValue)) {
                                max = Math.max(max, tmpValue);
                            }
                        }
                        if (!isDiskIn && (null !== diskSpecArray[searchIndex].inspectInfo.disk_io_out)) {
                            tmpValue = parseFloat(diskSpecArray[searchIndex].inspectInfo.disk_io_out);
                            if (!isNaN(tmpValue)) {
                                max = Math.max(max, tmpValue);
                            }
                        }
                    }
                    return max;
                }

                function transUtc2Local(array){
                    if (!array || (array.length <= 0)){
                        return;
                    }
                    var tmpTimeStamp;
                    _.each(array, function(item, index){
                        if (item && (item.constructor === Array)){
                            if (item.length < 2){
                                return;
                            }
                            tmpTimeStamp = commonService.utcMilliseconds2LocalMilli(item[0]);
                            item[0] = tmpTimeStamp;
                        }
                    });
                    return array;
                }

                function generatePercentValue(index, realtimeSpecValue, metricKey, maxValue, isPercent) {
                    var sery = {
                        textValue: null,
                        name: null,
                        value: null,
                        maxValue: maxValue,
                        isFill: true,
                        color: COLOR_ARRAY[index]
                    };

                    var metricValue = "";
                    if (realtimeSpecValue && realtimeSpecValue.inspectInfo) {
                        metricValue = realtimeSpecValue.inspectInfo[metricKey];
                    }

                    var metricFloat = parseFloat(metricValue);
                    if (isNaN(metricFloat)) {
                        sery.textValue = "<span></span>";
                        sery.name = $.encoder.encodeForHTML(realtimeSpecValue.name);
                        sery.value = metricFloat;
                        return sery;
                    }

                    if (!isPercent) {
                        sery.textValue = "<span>" + metricFloat + "</span>";
                        sery.name = $.encoder.encodeForHTML(realtimeSpecValue.name);
                        if (metricFloat === 0) {
                            //如果是0%,为了用户友好显示一点进度条
                            sery.value = 0.008 * maxValue;
                        } else {
                            sery.value = metricFloat;
                        }
                        return sery;
                    }

                    sery.textValue = "<span>" + metricFloat + "%</span>";
                    sery.name = $.encoder.encodeForHTML(realtimeSpecValue.name);

                    if (metricFloat === 0) {
                        //如果是0%,为了用户友好显示一点进度条
                        sery.value = 0.008 * maxValue;
                    } else {
                        //传上来的是带百分子
                        sery.value = metricFloat / 100;
                    }
                    return sery;
                }

                $scope.$on("$viewContentLoaded", function () {
                    queryMonitor();
                });
            }
        ];
        return createUserCtrl;
    });
