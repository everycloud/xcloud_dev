define([
        'tiny-lib/jquery',
        'tiny-lib/angular',
        "app/services/httpService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/Lineplot",
        "fixtures/userFixture"
    ],
    function ($, angular, http) {
        "use strict";

        var createUserCtrl = ['$scope', "$compile", 'camel','appCommonData',
            function ($scope, $compile, camel,appCommonData) {
                var user = $("html").scope().user || {};
                var i18n =  $("html").scope().i18n;
                $scope.appName = appCommonData.appName;
                $scope.isIT = (user.cloudType === "IT");

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
                    "label": i18n.common_term_current_label
                };
                $scope.maximumMemory = {
                    "id": "maximumMemoryOccupanyId",
                    "label":  i18n.common_term_max_label
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
                    "label":  i18n.common_term_max_label
                };
                $scope.averageDiskIO = {
                    "id": "averageMemoryOccupanyId",
                    "label": i18n.common_term_Avg_label
                };

                $scope.statistics = {
                    "id": "statisticsId",
                    "dftLabel": "TOP3",
                    "width": "120",
                    "values": [{
                        "selectId": "0",
                        "label": "TOP3"
                    }, {
                        "selectId": "1",
                        "label": "TOP5"
                    }, {
                        "selectId": "2",
                        "label": "TOP10"
                    }, {
                        "selectId": "3",
                        "label": i18n.common_term_custom_label
                    }],
                    "change": function () {}
                };
                var vmData = [
                    [0, 2],
                    [2, 3],
                    [4, 5],
                    [6, 4],
                    [8, 7],
                    [10, 10],
                    [12, 9],
                    [14, 7],
                    [16, 4],
                    [18, 3],
                    [20, 2],
                    [22, 5],
                    [24, 7],
                    [26, 8],
                    [28, 9],
                    [30, 7],
                    [32, 10],
                    [34, 5]
                ];
                var datas = [{
                    data: vmData,
                    color: "#1fbe5c"
                }];
                var threshold = [{
                    below: 5,
                    belowColor: "rgb(200, 20, 30)",
                    lineColor: "rgb(200, 20, 30)"
                }];

                var series = {
                    "points": {
                        "show": true,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true,
                        "steps": false,
                        "fill": true
                    }
                };

                var xaxis = {
                    "show": true,
                    "position": "bottom",
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
                };
                var yaxis = {
                    tickLength: 6,
                    font: {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                };

                var legend = {
                    "show": true,
                    "position": "ne",
                    "noColumns": 1,
                    "labelBoxBorderColor": "red"
                };
                //CPU占用率
                $scope.cupOccupancyModel = {
                    "id": "CPU_Occupancy_Model_id",
                    "data": datas,
                    "width": "360px",
                    "height": "200px",
                    "tips": {
                        "tooltip": true, //是否显示tooltip
                        "hoverTipContent": i18n.common_term_created_value+":%x" //鼠标移到某一点时的tooltip
                    },
                    "series": series,
                    "xaxis": xaxis,
                    "yaxis": yaxis,
                    "legend": legend
                };
                //内存占用率
                $scope.memoryOccupancyModel = {
                    "id": "Memory_Occupancy_Model_id",
                    "data": datas,
                    "width": "360px",
                    "height": "200px",
                    "tips": {
                        "tooltip": true, //是否显示tooltip
                        "hoverTipContent": i18n.common_term_created_value+":%x" //鼠标移到某一点时的tooltip
                    },
                    "series": series,
                    "xaxis": xaxis,
                    "yaxis": yaxis,
                    "legend": legend
                };
                //磁盘I/O
                $scope.diskIOOccupancyModel = {
                    "id": "diskIO_Occupancy_Model_id",
                    "data": datas,
                    "width": "360px",
                    "height": "200px",
                    "tips": {
                        "tooltip": true, //是否显示tooltip
                        "hoverTipContent": i18n.common_term_created_value+":%x" //鼠标移到某一点时的tooltip
                    },
                    "series": series,
                    "xaxis": xaxis,
                    "yaxis": yaxis,
                    "legend": legend
                };

                var data = [{
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
                }];
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
                    series: data,
                    legend: {}
                };
                $scope.CPUChartModel = {
                    "id": "CPUChartModelId",
                    "isFill": false,
                    "bold": "bold",
                    "values": values,
                    "width": "100%"
                };
                $scope.memoryChartModel = {
                    "id": "memoryChartModelId",
                    "isFill": false,
                    "bold": "bold",
                    "values": values,
                    "width": "100%"
                };
                $scope.diskIOChartModel = {
                    "id": "diskIOChartModelId",
                    "isFill": false,
                    "bold": "bold",
                    "values": values,
                    "width": "100%"
                };
            }
        ];
        return createUserCtrl;
    });
