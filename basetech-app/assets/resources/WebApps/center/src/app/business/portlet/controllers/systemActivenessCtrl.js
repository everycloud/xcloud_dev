/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-2-7
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "app/business/portlet/services/homeService",
    "tiny-widgets/Columnchart",
    "tiny-widgets/CirqueChart"
], function ($, angular, UnifyValid, HomeService, Columnchart, CirqueChart) {
    "use strict";

    var systemActivenessCtrl = ["$scope", "$compile", "$state", "$q", "camel", "$rootScope", function ($scope, $compile, $state, $q, camel, $rootScope) {
        $scope.deployMode = $("html").scope().deployMode;
        $scope.cloudType = $rootScope.user.cloudType;

        var user = $("html").scope().user;
        var homeService = new HomeService($q, camel);
        var regionName;
        var cloudInfraId;

        $scope.style = $scope.style ||
        {
            color: {
                online: "#5ecc49",
                offline: "#D5D5D5",
                created: "#5ecc49",
                available: "#D5D5D5"
            }
        };

        $scope.txt = $scope.txt ||
        {
            online: $scope.i18n.common_term_online_value,
            offline: $scope.i18n.common_term_offline_label,
            created: $scope.i18n.common_term_created_value,
            available: $scope.i18n.perform_term_creatable_label,
            unit: $scope.i18n.common_term_unitNum_label
        };

        //获取用户在线状态
        function getUserStatics() {
            var deferred = camel.get({
                "url": {s: "/goku/rest/v1.5/capacity-statistics/users-state"},
                "userId": $rootScope.user.id
            });
            deferred.done(function (response) {
                $scope.userStatics = {
                    online: response.onlineUsers + response.onlineAdministrators || 0,
                    total: (response.offlineUsers + response.onlineUsers + response.onlineAdministrators + response.offlineAdministrators) || 0
                }
                adjustFontSize();
            });
        }

        function getVMStatics() {
            var deferred = camel.get({
                "url": {s: "/goku/rest/v1.5/capacity-statistics/vms"},
                "userId": $rootScope.user.id
            });
            deferred.done(function (response) {
                var data = {created: response.created, available: response.available};
                var param = fillVmStatic(data);
            });
        }

        //构造虚拟机状态
        function fillVmStatic(para) {
            var i18n = $scope.txt;
            var color = $scope.style.color;

            var obj = {};
            var b = ["created", "available"];
            var arr = [];
            for (var j in b) {
                var attr = b[j];
                arr.push({
                    value: para[attr],
                    name: i18n[attr],
                    color: color[attr],
                    tooltip: i18n[attr] + ":" + para[attr]
                });
            }
            var options = {
                "id": "vmStatics",
                "centerText": "",
                "percent": false,
                "show-legend": true,
                "data": arr,
                "rotate": 0,
                "r": 60,
                "stroke-width": 28,
                "width": 450,
                "height": 200
            };
            var c = new CirqueChart(options);
        }

        $scope.regionSelector = {
            id: "",
            name: "",
            cloudInfras: [],
            change: function () {
                cloudInfraId = $scope.regionSelector.id;
                regionName = $scope.regionSelector.name;
                refreshVmCreated();
            }
        };

        $scope.configSpec = {
            "selCpuCount": 4,
            "selMemorySize": 8,
            "specDetailStr": "4*CPU, 8G" + $scope.i18n.common_term_memory_label,
            "unUsedVm": 0,
            "usedVm": 0,
            "show": false,
            "toggleShowSpec": function () {
                $scope.configSpec.show = !$scope.configSpec.show;
            },
            "okBtn": {
                "id": "homeChooseCpuMemoryOk",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    if (!UnifyValid.FormValid($(".homeConfigCpuMemoryDiv"))) {
                        return;
                    }
                    var cpuInput = $("#" + $scope.cpuCount.id).widget().getValue();
                    $scope.configSpec.selCpuCount = parseInt(cpuInput, 10);
                    var memInput = $("#" + $scope.memorySize.id).widget().getValue();
                    $scope.configSpec.selMemorySize = parseInt(memInput, 10);
                    $scope.configSpec.specDetailStr = $scope.configSpec.selCpuCount + "*CPU, " + $scope.configSpec.selMemorySize + "G" + $scope.i18n.common_term_memory_label;
                    refreshVmCreated();
                    $scope.configSpec.toggleShowSpec();
                }
            }
        };

        $scope.cpuCount = {
            "label": $scope.i18n.common_term_vcpuNum_label + ":",
            "id": "homeChooseCpuCount",
            "width": "100",
            "value": "4",
            "require": true,
            "tips": "1~64",
            "validate": "integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 64}) + ";maxValue(64):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 64})
        };

        $scope.memorySize = {
            "label": $scope.i18n.common_term_memoryGB_label + ":",
            "id": "homeChooseMemorySize",
            "width": "100",
            "value": "8",
            "require": true,
            "tips": "1~65536GB",
            "validate": "integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 65536}) + ";maxValue(65536):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 65536})
        };

        function calculateAvailableVmBySpec(cpuUnused, memUnused, selCpuCount, selMemorySize) {
            var cpuMax = cpuUnused / selCpuCount;
            var memMax = memUnused / selMemorySize;
            var max = 0;
            if ((cpuMax < 0) || (memMax < 0)) {
                return 0;
            }
            else {
                var allMax = Math.min(cpuMax, memMax);
                allMax = Math.floor(allMax);
                return allMax;
            }
        }

        // 刷新虚拟机可创建个数圆环图
        function refreshVmCreated() {
            if ($scope.cloudType === "OPENSTACK") {
                queryICTVmQuota();
            } else {
                queryITVmQuota();
            }
        }

        // 查询ICT场景虚拟机配额相关信息
        function queryICTVmQuota() {
            var deferred = $q.defer();
            var tmpPromise = deferred.promise;

            // 获取虚拟机列表
            if (!cloudInfraId) {
                return;
            }
            var promise = homeService.getICTVmStatistics([cloudInfraId]);
            promise.then(function (data) {
                if (!data || !data.cloudVmStatistics) {
                    deferred.reject();
                }

                var statistics = data.cloudVmStatistics[0] || {runningVmQuantity: 0, stoppedVmQuantity: 0, others: 0};
                $scope.vmCreatedNum = statistics.runningVmQuantity + statistics.stoppedVmQuantity + statistics.others;
                $scope.configSpec.usedVm = $scope.vmCreatedNum;
                return deferred.resolve();
            });

            // 查询资源池容量信息
            tmpPromise.then(function () {
                var azPromise = homeService.getCloudInfraStatistics([cloudInfraId]);
                azPromise.then(function (data) {
                    if (!data || !data.cloudInfraCapacity) {
                        return;
                    }

                    var statistics = data.cloudInfraCapacity[0];
                    $scope.cpu = {};
                    $scope.cpu.unUsed = (statistics.cpuTotalSize || 0) - (statistics.cpuUsedSize || 0);
                    $scope.memory = {};
                    $scope.memory.unUsed = (statistics.memTotalSize || 0) - (statistics.memUsedSize || 0);

                    var tmpUnUsedVm = calculateAvailableVmBySpec($scope.cpu.unUsed, $scope.memory.unUsed, $scope.configSpec.selCpuCount, $scope.configSpec.selMemorySize);
                    $scope.configSpec.unUsedVm = tmpUnUsedVm;
                    adjustFontSize();
                });
            });
        }

        // 查询IT场景虚拟机配额相关信息
        function queryITVmQuota() {
            var deferred = $q.defer();
            var tmpPromise = deferred.promise;

            // 获取虚拟机统计信息
            if (!cloudInfraId) {
                return;
            }
            var promise = homeService.getITVmStatistics(cloudInfraId);
            promise.then(function (data) {
                if (!data) {
                    deferred.reject();
                }
                $scope.vmCreatedNum = data.runningVmQuantity + data.stoppedVmQuantity + data.others;
                $scope.configSpec.usedVm = $scope.vmCreatedNum;
                adjustFontSize();
                return deferred.resolve();
            });

            // 查询资源池容量信息
            tmpPromise.then(function () {
                if (!cloudInfraId) {
                    return;
                }
                var azPromise = homeService.getItAzStatistics(cloudInfraId);
                azPromise.then(function (data) {
                    if (!data || !data.availableZones) {
                        $scope.configSpec.unUsedVm = 0;
                        return;
                    }

                    var totalFreeCpu = 0, totalFreeMemory = 0;
                    var azs = data.availableZones;
                    for (var index in azs) {
                        var az = azs[index];
                        if (!az.statistics) {
                            continue;
                        }
                        totalFreeCpu += az.statistics.vcpuFreeSize;
                        totalFreeMemory += az.statistics.memFreeSize;
                    }

                    var tmpUnUsedVm = calculateAvailableVmBySpec(totalFreeCpu, totalFreeMemory, $scope.configSpec.selCpuCount, $scope.configSpec.selMemorySize);
                    $scope.configSpec.unUsedVm = tmpUnUsedVm;
                    adjustFontSize();
                });
            });
        }

        // 查询资源池
        function getCloudInfras() {
            var promise = homeService.queryCloudInfras();
            promise.then(function (data) {
                if (!data || !data.cloudInfras) {
                    return;
                }

                var cloudInfras = [];
                var poolResourceRes = data.cloudInfras;
                for (var item in poolResourceRes) {
                    cloudInfras.push({
                        "id": poolResourceRes[item].id,
                        "name": poolResourceRes[item].name
                    });
                }
                if (cloudInfras.length > 0) {
                    cloudInfras[0].checked = true;
                    $scope.regionSelector.cloudInfras = cloudInfras;
                    cloudInfraId = cloudInfras[0].id;
                }
            });
        }

        // vdc总数
        function getVdc() {
            var url = "/goku/rest/v1.5/vdcs";
            var deferred = camel.get({
                "url": url,
                "params": {
                    start: 0,
                    limit: 1
                },
                "userId": user.id
            });
            deferred.success(function (response) {
                $scope.$apply(function () {
                    $scope.vdcNum = response.total;
                    adjustFontSize();
                });
            });
            deferred.fail(function () {
                $scope.vdcNum = 0;
            });
        }

        function adjustFontSize(time) {
            time = time || 0;
            setTimeout(function () {
                var $containers = $(".adjust-font-size");
                $containers.each(function (index, el) {
                    var outWidth = $(el).width();
                    var inWidth = $(el).find("span").width();
                    if (outWidth < inWidth) {
                        var fontSize = parseInt($(el).css("fontSize")) * outWidth / inWidth;
                        var $parents = $(el).parents(".adjust-all");
                        if($parents && $parents.length){
                            $parents.find(".adjust-font-size").css("fontSize",fontSize);
                        }else{
                            $(el).css("fontSize",fontSize);
                        }
                    }
                });

            }, time);
        }

        // vdc总数
        function getOpenStack() {
            $scope.openstackNum = 0;
            var deferred = camel.get({
                "url": "/goku/rest/v1.5/openstack/endpoint",
                "userId": user.id
            });
            deferred.success(function (data) {
                data = data || {total: 0, endpoint: []};

                // 更新表格数据
                $scope.$apply(function () {
                    var endpoint = data.endpoint || [];
                    var regions = {};
                    for (var i = 0, len = endpoint.length; i < len; i++) {
                        var regionName = endpoint[i].regionName;
                        !regions[regionName] && (regions[regionName] = true);
                    }
                    for (var p in regions) {
                        regions[p] === true && ($scope.openstackNum++ );
                    }
                    adjustFontSize();
                });
            });
            deferred.fail(function () {
                $scope.openstackNum = 0;
            });
        }

        function init() {
            if ($scope.deployMode !== 'local') {
                if ($scope.right.resourceStatistic) {
                    getUserStatics();
                }
                if ($scope.right.cloudInfras) {
                    getCloudInfras();
                }
                if ($scope.right.vdc) {
                    getVdc();
                }
                if ($scope.cloudType === "OPENSTACK" && !$scope.isServiceCenter) {
                    getOpenStack();
                }
            }
        }

        init();
    }];

    return systemActivenessCtrl;
})
;