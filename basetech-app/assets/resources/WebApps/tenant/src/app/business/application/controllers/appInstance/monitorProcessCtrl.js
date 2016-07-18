/*global define*/
define([
        'tiny-lib/jquery',
        'tiny-lib/encoder',
        'tiny-lib/angular',
        "app/services/httpService",
        "tiny-lib/underscore",
        "app/business/application/services/appCommonService",
        "app/business/ecs/services/vm/vmMonitorService",
        "tiny-widgets/Window",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/Lineplot",
        "fixtures/userFixture"
    ],
    function ($, encoder, angular, http, _, appCommonService, vmMonitorService, Window) {
        "use strict";

        var createUserCtrl = ['$scope', "$compile", 'camel', "appCommonData", "exception", "$q",
            function ($scope, $compile, camel, appCommonData, exception, $q) {
                var vpcId = appCommonData.vpcId;
                var appId = appCommonData.appId;
                var cloudInfraId = appCommonData.cloudInfraId;

                var user = $scope.user;
                var i18n = $scope.i18n;
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                var vmMonitorServiceIns = new vmMonitorService(exception, $q, camel);
                $scope.vmData = false;   //是否有虚拟机数据
                $scope.processData = false;  //是否有进程数据

                $scope.hqServerIp = "";
                $scope.selectVm = "vm001";
                $scope.vmList = [];
                $scope.selectVmChange = function (id) {
                    $scope.selectVm = findItemById($scope.vmList, id);
                    queryVmProcessList();
                };

                $scope.selectProcess = null;
                $scope.processList = [];
                $scope.selectProcessChange = function (id) {
                    $scope.selectProcess = findItemById($scope.processList, id);
                    queryVmProcessMonitor();
                };

                $scope.linePlotArray = [];
                var LINE_PLOT_ID_PREFIX = "vmProcessMonitorPlot";

                //最大允许的plot数,与view中是对应的 indexs中存的是plot的序列号
                var MAX_PLOT_NUM = 4;
                $scope.indexs = [];
                for (var i = 0; i < MAX_PLOT_NUM; i++) {
                    $scope.indexs.push(i);
                    $scope.linePlotArray.push(null);
                }

                var shareConfigParam = null;
                $scope.configAlarm = function (linePlot) {
                    if (!linePlot) {
                        return;
                    }
                    var param = {
                        "vmId": $scope.selectVm.id,
                        "processId": $scope.selectProcess.id,
                        "pvmIp": $scope.hqServerIp,
                        "resourceId": linePlot.resourceId,
                        "metricName": linePlot.metricName,
                        "metricId": linePlot.metricId,
                        "cloudInfraId": cloudInfraId
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
                    if (!$scope.selectProcess) {
                        return;
                    }
                    var params = {
                        "user": user,
                        "vmId": $scope.selectVm.id,
                        "processId": $scope.selectProcess.id,
                        "pvmip": $scope.hqServerIp,
                        "cloudInfraId": cloudInfraId
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
                                "width": "750px",
                                "height": "160px",
                                "data": [],
                                "caption": {},
                                "tips": {
                                    "tipType": "track",
                                    "xDateFormat": "%Y/%m/%d",
                                    "content": i18n.common_term_time_label+": %x0<br>%s0: %y0"
                                },
                                "grid": {
                                    show: true,
                                    margin: {
                                        "left": 100,
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

                function findItemById(list, id) {
                    if (!id || !list) {
                        return null;
                    }
                    var found = null;
                    _.each(list, function (item, index) {
                        if (id === item.id) {
                            found = item;
                        }
                    });

                    return found;
                }

                function queryAppVmList() {
                    var params = {
                        "user": user,
                        "appId": appId,
                        "cloudInfraId": cloudInfraId
                    };
                    var deferred = appCommonServiceIns.queryAppVmList(params);
                    deferred.then(function (data) {
                        if (!data || !data.vmResources || (data.vmResources.length <= 0)) {
                            $scope.vmData = false;
                            return;
                        }

                        var newVmList = [];
                        var tmpVm = null;
                        _.each(data.vmResources, function (item, index) {
                            tmpVm = {
                                "id": item.vmId,
                                "name": item.vmName
                            };
                            tmpVm.name4Ui = genSerialName(tmpVm.name, 16);
                            tmpVm.name4Ui = $.encoder.encodeForHTML(tmpVm.name4Ui);
                            newVmList.push(tmpVm);
                        });
                        $scope.vmList = newVmList;
                        if ($scope.vmList.length > 0) {
                            $scope.selectVm = $scope.vmList[0];
                            queryVmProcessList();
                            $scope.vmData = true;
                        }else{
                            $scope.vmData = false;
                        }
                    });
                }

                function genSerialName(name, length) {
                    if (!length) {
                        length = 16;
                    }
                    if (!name || (name === "")) {
                        return "";
                    }
                    if (name.length < length) {
                        return name;
                    }

                    var newName = null;
                    newName = name.substring(0, length - 3) + "...";
                    return newName;
                }

                function queryVmProcessList() {
                    var params = {
                        "user": user,
                        "vmId": $scope.selectVm.id,
                        "cloudInfraId": cloudInfraId
                    };
                    var deferred = vmMonitorServiceIns.queryVmProcessList(params);
                    deferred.then(function (data) {
                        $scope.hqServerIp = data.hqServerIp;
                        if (!data || !data.softwareResources || (data.softwareResources.length <= 0)) {
                            $scope.processData = false;
                            $scope.processList = [];
                            return;
                        }
                        var newProcessList = [];
                        var tmpProcess = null;
                        _.each(data.softwareResources, function (item, index) {
                            tmpProcess = {
                                "id": item.softwareId,
                                "name": item.softwareName
                            };
                            tmpProcess.name4Ui = genSerialName(tmpProcess.name, 18);
                            tmpProcess.name4Ui = $.encoder.encodeForHTML(tmpProcess.name4Ui);
                            newProcessList.push(tmpProcess);
                        });
                        $scope.processList = newProcessList;
                        if ($scope.processList.length > 0) {
                            $scope.selectProcess = $scope.processList[0];
                            queryVmProcessMonitor();
                            $scope.processData = true;
                        }else{
                            $scope.processData = false;
                        }
                    });
                }

                $scope.$on("$viewContentLoaded", function () {
                    queryAppVmList();
                });
            }
        ];
        return createUserCtrl;
    });
