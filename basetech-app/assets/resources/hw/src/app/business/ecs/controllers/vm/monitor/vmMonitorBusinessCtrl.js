/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-3-3
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        "app/business/ecs/services/vm/vmMonitorService",
        "tiny-lib/underscore",
        "language/keyID",
        "tiny-widgets/Window",
        "fixtures/ecsFixture"
    ],
    function ($, angular, vmMonitorService, _, i18n, Window) {
        "use strict";

        var vmMonitorBusinessCtrl = ['$scope', 'camel', "exception", "$q",
            function ($scope, camel, exception, $q) {
                var vmMonitorServiceIns = new vmMonitorService(exception, $q, camel);
                var user = $("html").scope().user;
                $scope.vmId = $("#ecsVmsDetailMonitorWinId").widget().option("vmId");
                $scope.cloudInfra = $("#ecsVmsDetailMonitorWinId").widget().option("cloudInfra");
                $scope.vpcId = $("#ecsVmsDetailMonitorWinId").widget().option("vpcId");
                $scope.selectProcess = null;
                $scope.hqServerIp = null;
                $scope.businesses = [];
                $scope.select = function (id) {
                    if (!id) {
                        return;
                    }
                    _.each($scope.businesses, function (item, index) {
                        if (id === item.id) {
                            $scope.selectProcess = item;
                        }
                    });
                    if ($scope.selectProcess) {
                        queryVmProcessMonitor();
                    }
                };

                $scope.linePlotArray = [];
                var LINE_PLOT_ID_PREFIX = "vmProcessMonitorPlot";

                //最大允许的plot数,与view中是对应的 indexs中存的是plot的序列号
                var MAX_PLOT_NUM = 4;
                $scope.indexs = [];
                for (var i = 0; i < 4; i++) {
                    $scope.indexs.push(i);
                    $scope.linePlotArray.push(null);
                }

                var shareConfigParam = null;
                $scope.configAlarm = function (linePlot) {
                    if (!linePlot) {
                        return;
                    }
                    var param = {
                        "vmId": $scope.vmId,
                        "processId": $scope.selectProcess.id,
                        "pvmIp": $scope.hqServerIp,
                        "resourceId": linePlot.resourceId,
                        "metricName": linePlot.metricName,
                        "metricId": linePlot.metricId,
                        "cloudInfraId": $scope.cloudInfra.id
                    };
                    var options = {
                        "shareConfigParam": param,
                        "winId": "vmProcessMonitorConfig",
                        "title": linePlot.metricName + i18n.common_term_monitorPolicy_label,
                        "width": "600px",
                        "height": "480px",
                        "modal": true,
                        "content-type": "url",
                        "content": "app/business/ecs/views/vm/monitor/processMonitorConfig.html",
                        "buttons": null,
                        "close": function (event) {}
                    };
                    var win = new Window(options);
                    win.show();
                };

                function queryVmProcessMonitor() {
                    var params = {
                        "user": user,
                        "vmId": $scope.vmId,
                        "processId": $scope.selectProcess.id,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "pvmip": $scope.hqServerIp
                    };
                    clearAllPlot();
                    var deferred = vmMonitorServiceIns.queryVmProcessMonitor(params);
                    deferred.then(function (data) {
                        if (!data || !data.metrics || (data.metrics.length <= 0)) {
                            return;
                        }

                        var metricArray = [];
                        var newItem = null;
                        var relatedIdArray = [];
                        var i = 0;
                        var newId;
                        _.each(data.metrics, function (item, index) {
                            newItem = generateMonitorItem(item.metricData);
                            if (!newItem) {
                                return;
                            }
                            newId = LINE_PLOT_ID_PREFIX + i;
                            i = i + 1;
                            newItem.plotId = newId;
                            relatedIdArray.push(newId);
                            metricArray.push(newItem);
                        });

                        var tmpOption;
                        var tmpData;
                        var initedPlot = [];
                        for (var plotIndex = 0; plotIndex < metricArray.length; plotIndex++) {
                            tmpOption = {
                                "id": null,
                                "relatedId": null,
                                "width": "800px",
                                "height": "160px",
                                "data": [],
                                "caption": {},
                                "tips": {
                                    "tipType": "track",
                                    "xDateFormat": "%Y/%m/%d",
                                    "content": i18n.common_term_time_label + ": %x0<br>%s0: %y0"
                                },
                                "grid": {
                                    show: true,
                                    margin: {
                                        "left": 150,
                                        "right": 50
                                    },
                                    borderWidth: {
                                        top: 1,
                                        right: 0,
                                        bottom: 1,
                                        left: 1
                                    }
                                },
                                "series": {
                                    "points": {
                                        "show": false,
                                        "symbol": "ring"
                                    },
                                    "lines": {
                                        "show": true
                                    }
                                },
                                "xaxis": {
                                    "show": false,
                                    "position": "bottom",
                                    "mode": "time",
                                    "ticks": 7,
                                    "timeformat": "%Y/%m/%d",
                                    "min": null, //坐标轴最小值
                                    "max": null, //坐标轴最大值
                                    "font": {
                                        size: 11,
                                        lineHeight: 13,
                                        family: "Microsoft YaHei",
                                        color: "#666666"
                                    }
                                },
                                "yaxis": {
                                    "show": true,
                                    "min": 0, //坐标轴最小值
                                    "max": null, //坐标轴最大值
                                    "font": {
                                        size: 11,
                                        lineHeight: 13,
                                        family: "Microsoft YaHei",
                                        color: "#666666"
                                    }
                                },
                                "legend": {
                                    "show": true,
                                    "noColumns": 2,
                                    "labelBoxBorderColor": "red"
                                }
                            };
                            if (plotIndex === (metricArray.length - 1)) {
                                tmpOption.xaxis.show = true;
                            }
                            tmpOption.id = metricArray[plotIndex].plotId;
                            tmpOption.relatedId = relatedIdArray;
                            tmpData = [{
                                "data": metricArray[plotIndex].metricValue,
                                "color": "#ED9121",
                                "label": metricArray[plotIndex].metricName
                            }];
                            tmpOption.data = tmpData;
                            tmpOption.refreshId = tmpOption.id + "Refresh";
                            tmpOption.plotTitle = generateTitle(metricArray[plotIndex]);
                            tmpOption.metricName = metricArray[plotIndex].metricName;
                            tmpOption.metricId = metricArray[plotIndex].metricId;
                            tmpOption.metricUnit = metricArray[plotIndex].metricUnit;
                            tmpOption.resourceId = metricArray[plotIndex].resourceId;
                            initedPlot.push(tmpOption);
                        }

                        $scope.linePlotArray = initedPlot;
                    });
                }

                function generateMonitorItem(metricData) {
                    if (!metricData) {
                        return null;
                    }

                    var newItem = {};
                    newItem.metricName = metricData.metricName;
                    newItem.plotId = null;
                    newItem.metricId = metricData.metricId;
                    newItem.resourceId = metricData.resourceId;
                    newItem.unit = metricData.metricUnit;
                    if (!metricData.dataPoints || (metricData.dataPoints.length <= 0)) {
                        newItem.metricValue = [];
                    } else {
                        var newMetricArray = [];
                        var tmpMetric = null;
                        for (var i = 0; i < metricData.dataPoints.length; i++) {
                            tmpMetric = [];
                            tmpMetric.push(metricData.dataPoints[i].timestamp);
                            tmpMetric.push(metricData.dataPoints[i].value);
                            newMetricArray.push(tmpMetric);
                        }
                        newItem.metricValue = newMetricArray;
                    }

                    return newItem;
                }

                function generateTitle(plotInfo) {
                    if (!plotInfo) {
                        return "";
                    }

                    return plotInfo.metricName + "(" + plotInfo.unit + ")";
                }

                function clearAllPlot() {
                    for (var plotId = 0; plotId < $scope.linePlotArray.length; plotId++) {
                        $scope.linePlotArray[plotId] = null;
                    }
                }

                function queryVmProcessList() {
                    var params = {
                        "user": user,
                        "vmId": $scope.vmId,
                        "cloudInfraId": $scope.cloudInfra.id
                    };
                    var deferred = vmMonitorServiceIns.queryVmProcessList(params);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        if (!data.softwareResources || (data.softwareResources.length <= 0)) {
                            $scope.businesses = [];
                            return;
                        }

                        $scope.hqServerIp = data.hqServerIp;
                        var newProcessList = [];
                        var tmpProcess = null;
                        _.each(data.softwareResources, function (item, index) {
                            tmpProcess = {};
                            tmpProcess.id = item.softwareId;
                            tmpProcess.name = item.softwareName;
                            newProcessList.push(tmpProcess);
                        });
                        $scope.businesses = newProcessList;
                        if ($scope.businesses.length > 0) {
                            $scope.selectProcess = $scope.businesses[0];
                            queryVmProcessMonitor();
                        }
                    });
                }

                queryVmProcessList();
            }
        ];

        var vmMonitorBusinessModule = angular.module("ecs.vm.detail.monitor.business", ['framework']);
        vmMonitorBusinessModule.controller("ecs.vm.detail.monitor.business.ctrl", vmMonitorBusinessCtrl);

        return vmMonitorBusinessModule;
    });
