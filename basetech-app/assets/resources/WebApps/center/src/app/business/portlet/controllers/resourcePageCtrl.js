/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Columnchart",
    "app/business/portlet/controllers/zoneCtrl",
    'fixtures/zoneFixture'],
    function ($, angular, Columnchart, zoneCtrl) {
        "use strict";
        var resourcePageCtrl = ["$scope", "$compile", "camel", "$state", "$rootScope", function ($scope, $compile, camel, $state, $rootScope) {
            $scope.deployMode = $("html").scope().deployMode;
            $scope.cloudType = $rootScope.user.cloudType;
            $scope.style = $scope.style ||
            {
                color: {
                    run: "#5ecc49",
                    stop: "#ffa235",
                    alarm: "#fc5043",
                    normal: "#5ecc49",
                    fault: "#f21414",
                    other: "#D5D5D5"
                }
            }

            $scope.txt = $scope.txt ||
            {
                run: $scope.i18n.common_term_running_value,
                stop: $scope.i18n.common_term_stoped_value,
                other: $scope.i18n.common_term_other_label,
                normal: $scope.i18n.common_term_natural_value,
                fault: $scope.i18n.common_term_trouble_label,
                unit: $scope.i18n.common_term_unitTai_label
            }

            //获取系统资源健康度
            function getSystemHealthStatus() {
                var deferred = camel.get({
                    "url": "/goku/rest/v1.5/system-health",
                    "userId": $rootScope.user.id,
                    "timeout": 30000
                });
                deferred.done(function (response) {
                    $scope.$apply(function () {
                        $scope.sysHealthStatus = response;
                        $scope.healthScore = fillSysHealth(response.totalScore);
                    });
                });
            }

            //获取IT场景下虚拟机状态
            function getItVmStatus() {
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/vms/statistics", o: {"tenant_id": "1"}},
                    "userId": $rootScope.user.id,
                    "timeout": 30000,
                    "params": JSON.stringify({})
                });
                deferred.done(function (response) {
                    var data = {};
                    data.run = response.runningQuantity;
                    data.stop = response.stoppedQuantity;
                    data.other = response.others;
                    $scope.$apply(function () {
                        $scope.vmStatus = fillResStat(data);
                    });

                });
            }

            //获取应用状态
            function getAppStatus() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/ame/{tenant_id}/healthy", o: {"tenant_id": "1"}},
                    "userId": $rootScope.user.id,
                    "timeout": 30000
                });
                deferred.done(function (response) {
                    var data = {};
                    data.run = response.normalNum;
                    data.stop = response.alarmNum;
                    data.other = response.unKnownNum + response.noNum;
                    $scope.$apply(function () {
                        $scope.appStatus = fillResStat(data);
                    });
                });
            }

            //获取设备状态
            function getDevStatus() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/device-state"},
                    "userId": $rootScope.user.id,
                    "timeout": 30000
                });
                deferred.done(function (response) {
                    var data = [
                        {name: $scope.i18n.common_term_hostStatus_label, normal: response.hostNormal, fault: response.hostUnNormal},
                        {name: $scope.i18n.device_term_sanStatus_label, normal: response.ipsanNormal, fault: response.ipsanUnNormal},
                        {name: $scope.i18n.device_term_switchStatus_label, normal: response.switchNormal, fault: response.switchUnNormal}
                    ];

                    var param = fillDevStat(data);
                    var options = {
                        id: "deviceStat",
                        width: "600px",
                        height: "120px",
                        isFill: false,
                        bold: "bold",
                        values: param
                    }
                    setTimeout(function () {
                        new Columnchart(options);
                    }, 1000);

                });
            }

            //构造系统资源健康度状态
            function fillSysHealth(totalScore) {
                var color1;
                var color2;
                if (totalScore >= 80) {
                    color1 = "100-#16b44a-#72ce17";
                    color2 = "#1fbe5c";
                }
                else if (totalScore >= 50) {
                    color1 = "100-#f7820d-#ffb700";
                    color2 = "#f7820d";
                }
                else if (totalScore > 0) {
                    color1 = "100-#e92820-#ff4621";
                    color2 = "#f21414";
                }
                else {
                    color1 = "#D5D5D5";
                    color2 = "#ccc";
                }
                var arr = []
                arr.push({
                    value: totalScore,
                    color: color1
                })
                arr.push({
                    value: 100 - totalScore,
                    color: "#D5D5D5"
                })

                var obj = {
                    data: arr,
                    center: {
                        text: '' + totalScore,
                        fontSize: 44,
                        color: color2
                    }};

                return obj;
            }

            //构造虚拟机状态和应用状态数据
            function fillResStat(para) {
                var i18n = $scope.txt;
                var color = $scope.style.color;

                var obj = {};
                var b = ["run", "stop", "other"];
                var arr = [];
                var sum = para.run + para.stop + para.other;
                for (var j in b) {
                    var attr = b[j];
                    arr.push({
                        value: para[attr],
                        name: i18n[attr],
                        color: color[attr],
                        tooltip: i18n[attr] + ":" + para[attr]
                    })
                }
                var p = 0;
                if (sum != 0) {
                    p = Math.floor(para.run * 100 / sum);
                }
                var obj = {
                    data: arr,
                    center: {
                        text: '' + sum,
                        fontSize: 44,
                        color: p >= 85 ? color.run : color.stop
                    }
                }
                return obj;
            }

            // 构造设备状态数据
            function fillDevStat(para) {
                var i18n = $scope.txt;
                var color = $scope.style.color;
                var data = [];
                for (var i in para) {
                    var e = para[i];
                    data.push({
                        name: $.encoder.encodeForHTML(e.name),
                        value: e.normal,
                        textValue: "<span style='color:" + color.normal + "'>" + e.normal
                            + "</span>/<span style='color:" + color.fault + "'>" + e.fault + "</span>",
                        initValue: e.normal + e.fault,
                        maxValue: e.normal + e.fault,
                        color: color.normal
                    });
                }
                var device = {
                    legend: [
                        {type: 0, color: color.normal, desc: i18n.normal},
                        {type: 0, color: color.fault, desc: i18n.fault},
                        {type: 1, desc: i18n.unit}
                    ],
                    series: data
                };

                return device;
            }

            function refresh() {
                if ($scope.deployMode !== 'top' && $scope.cloudType !== "OPENSTACK") {
                    if ($scope.right.vmStatic) {
                        getItVmStatus();
                    }
                    if ($scope.right.device) {
                        getDevStatus();
                    }
                    if ($scope.right.resourceStatistic) {
                        getSystemHealthStatus();
                    }
                }
            }

            refresh();

            $scope.linkToAlarmModel = {
                "click": function (severity) {
                    $state.go("monitor.alarmlist", {severity: severity, alarmtype: 1});
                }
            };

        }];

        var dependency = [];
        var resourcePageModule = angular.module("resourcePage", dependency);
        resourcePageModule.controller("resourcePage.ctrl", resourcePageCtrl);
        resourcePageModule.controller("servicePage.zone.ctrl", zoneCtrl);
        return resourcePageModule;
    });