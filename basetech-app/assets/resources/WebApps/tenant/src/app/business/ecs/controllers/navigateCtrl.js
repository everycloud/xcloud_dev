/* global define */
define([
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "app/services/cloudInfraService",
        "app/business/ecs/services/vm/vmNicService",
        "app/business/ecs/services/vm/queryVmService",
        "app/business/ecs/services/storage/diskService",
        "app/services/exceptionService",
        "app/services/messageService",
        "app/business/ecs/services/monitorService",
        "tiny-widgets/Window",
        "tiny-widgets/Message",
        "tiny-widgets/CirqueChart",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min",
        "tiny-lib/underscore",
        "fixtures/ecsFixture"
    ],
    function ($, angular, _, cloudInfraService, vmNicService, queryVmService, diskService, exceptionService, MessageService, monitorService, Window, Message, CirqueChart) {
        "use strict";
        var navigateCtrl = ["$scope", "$state", "$q", "camel", "exception", "storage","$interval",
            function ($scope, $state, $q, camel, exception, storage, $interval) {
                var user = $("html").scope().user || {};
                var i18n = $scope.i18n;

                $scope.openstack = user.cloudType === "ICT";
                $scope.cloudInfraId = "";
                $scope.vpcId = "-1";

                $scope.checkOpenStack = false;
                if( user.cloudType === "ICT"){
                    $scope.checkOpenStack = true;
                }


                // 权限控制
                $scope.hasVmViewRight = _.contains(user.privilegeList, "619000");
                $scope.hasVmCreateRight = _.contains(user.privilegeList, "617000");
                $scope.hasHostViewRight = _.contains(user.privilegeList, "401000");
                $scope.hasDiskViewRight = _.contains(user.privilegeList, "609000");

                // 公共服务实例
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                var exceptionServiceIns = new exceptionService();
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                var diskServiceIns = new diskService(exception, $q, camel);

                $scope.searchLocation = {
                    "id": "ecsNavigateSearchLocation",
                    "width": "120",
                    "values": [],
                    "change": function () {
                        $scope.cloudInfraId = $("#" + $scope.searchLocation.id).widget().getSelectedId();
                        if ($scope.openstack) {
                            var defer = queryVpc();
                            defer.then(function () {
                                $scope.command.queryVMStatistics();
                                $scope.command.queryVolumeStatistics();
                            });
                        } else {
                            $scope.command.queryVMStatistics();
                            $scope.command.queryVolumeStatistics();
                        }
                        storage.add("cloudInfraId", $scope.cloudInfraId);
                    }
                };
                $scope.searchVPC = {
                    "id": "ecsNavigateSearchVPC",
                    "width": "120",
                    "values": [],
                    "change": function () {
                        $scope.vpcId = $("#" + $scope.searchVPC.id).widget().getSelectedId();
                        storage.add("vpcId", $scope.vpcId);
			$scope.command.queryVMStatistics();
                        $scope.command.queryVolumeStatistics();
                    }
                };

                $scope.lastUpdateCloudTime = "-";
                $scope.lastUpdateTime = {
                    "label": $scope.i18n.common_term_updatTime_label + ":" || "更新时间" + ":",
                    "value": $scope.lastUpdateCloudTime
                };
                $scope.realTimeStatus = "-";
                $scope.lastUpdateStatus = {
                    "label":$scope.i18n.common_term_updatStatus_label + ":" || "更新状态" + ":",
                    "value":$scope.realTimeStatus
                };
                //更新云资源池
                $scope.updateCloudPool={
                    "id":"updateCloudPoolID",
                    "text":$scope.i18n.common_term_update_button || "更新",
                    "disabled":true,
                    "tooltip":$scope.i18n.resource_general_viewUserICT_desc_refresh_tip || "立即更新统计数据，并刷新当前界面。",
                    "click":function(){
                        $scope.command.updateCloudPoolInfo();
                    }
                };
                //刷新用户列表
                $scope.refresh = {
                    "id": "ecsNavigateRefreshBtn",
                    "click": function () {
                        $scope.command.queryVMStatistics();
                        $scope.command.queryVolumeStatistics();
                    }
                };
                // 跳转到各个管理页面
                $scope.goVms = function () {
                    $state.go("ecs.vm");
                };

                $scope.goCreateVm = function () {
                    var param = {
                        "cloudInfra": $scope.cloudInfraId,
                        "vpcId": $scope.vpcId
                    };
                    $state.go("ecsVmCreate.navigate", param);
                };

                $scope.goHosts = function () {
                    $state.go("ecs.host");
                };

                $scope.goDisks = function () {
                    $state.go("ecs.storage.disk");
                };

                $scope.goDiskSnapshots = function () {
                    $state.go("ecs.storage.snapshot");
                };

                //查询当前租户可见的地域列表
                function getLocations() {
                    var retDefer = $q.defer();
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            var curr = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras);
                            $scope.cloudInfraId = curr.id;
                        }
                        $scope.searchLocation.values = data.cloudInfras;
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exceptionServiceIns.doException(rejectedValue);
                        retDefer.reject();
                    });
                    return retDefer.promise;
                }

                // 查询VPC列表，只有ICT才需要
                function queryVpc() {
                    // 资源池ID不存在时，不下发命令
                    if (!$scope.cloudInfraId) {
                        return;
                    }
                    var retDefer = $q.defer();
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.cloudInfraId,
                        "start": 0,
                        "limit": 100
                    };
                    var deferred = vmNicServiceIns.queryVpcs(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject(data);
                            return;
                        }
                        if (data.vpcs && data.vpcs.length > 0) {
                            _.each(data.vpcs, function (item) {
                                _.extend(item, {
                                    "label": item.name,
                                    "selectId": item.vpcID
                                });
                            });

                            var curr = vmNicServiceIns.getUserSelVpc(data.vpcs);
                            curr.checked = true;
                            $scope.vpcId = curr.vpcID;
                        }
                        $scope.searchVPC.values = data.vpcs;
                        retDefer.resolve(data);
                    });
                    return retDefer.promise;
                }

                $scope.startTimer = function () {
                    $scope.clearTimer();
                    $scope.promiseTimer = $interval(function () {
                        var deferredQueryStatus = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenent_id}/cloud-infras/{id}",
                                o: {
                                    "tenent_id":user.vdcId,
                                    "id": $scope.cloudInfraId
                                }
                            },
                            "userId": user.id,
                            "autoRequest":true
                        });
                        deferredQueryStatus.success(function(response){
                            if(response.cloudInfra.syncStatus == "synchronized"){
                                $scope.lastUpdateCloudTime = response.cloudInfra.syncTime;
                                $scope.realTimeStatus = $scope.i18n.common_term_updatComplete_value || "更新完成";
                                $scope.command.queryVMStatistics();
                                $scope.command.queryVolumeStatistics();
                                $scope.clearTimer();

                            } else if (response.cloudInfra.syncStatus == "synchronizing") {
                                $scope.lastUpdateCloudTime = response.cloudInfra.syncTime;
                                $scope.realTimeStatus = $scope.i18n.common_term_updating_value || "更新中";
                            } else if (response.cloudInfra.syncStatus == "none") {
                                $scope.lastUpdateCloudTime = "-";
                                $scope.realTimeStatus = $scope.i18n.common_term_noUpdate_value || "未更新";
                                $scope.clearTimer();

                            } else if (response.cloudInfra.syncStatus == "failed") {
                                $scope.lastUpdateCloudTime = "-";
                                $scope.realTimeStatus = $scope.i18n.common_term_updatFail_value || "更新失败";
                                $scope.clearTimer();
                            } else {
                                //do nothing
                            }
                        });
                    }, 15000);
                };

                $scope.clearTimer = function () {
                    try {
                        $interval.cancel($scope.promiseTimer);
                    }
                    catch (e) {
                        // do nothing
                    }
                };

                var updateCloudPoolInfoFunc = function (cloudInfrasId, action) {
                    var params = {};
                    if (action === "synchronize") {
                        params.synchronize = action;
                    } else {
                        // do nothing
                    }

                    var deferred = camel.post({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras/{id}/action",
                            "o": {
                                "tenant_id": user.vdcId,
                                "id": cloudInfrasId
                            }
                        },
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.startTimer();
                    });

                    deferred.fail(function (response) {
                        exceptionServiceIns.doException(response);

                    });
                };
                //ajax命令
                $scope.command = {

                    //触发更新云资源池
                    "updateCloudPoolInfo":function(){

                        updateCloudPoolInfoFunc($scope.cloudInfraId, "synchronize");

                    },
                    //VM状态统计
                    "queryVMStatistics": function () {
                        // 资源池ID不存在时，不下发命令
                        if (!$scope.cloudInfraId || !$scope.hasVmViewRight || ($scope.openstack && (!$scope.vpcId || $scope.vpcId === "-1"))) {
                            return;
                        }
                        var options = {
                            "cloudInfraId": $scope.cloudInfraId,
                            "vpcId": $scope.vpcId,
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var deferred = queryVmServiceIns.queryVmStatusStatistics(options);
                        deferred.then(function (data) {
                            if (!data || (data.runningVmQuantity + data.stoppedVmQuantity + data.others < 0)) {
                                return;
                            }
                            $("#ecsNavigateVmStatusInfo").empty();
                            var runningVmNum = data.runningVmQuantity;
                            var stopVmNum = data.stoppedVmQuantity;
                            var otherVmNum = data.others;
                            var totalVmNum = runningVmNum + stopVmNum + otherVmNum;
                            var runnningVmRate = 0;
                            var stopVmNumRate = 0;
                            var otherVmNumRate = 0;
                            if (totalVmNum > 0) {
                                runnningVmRate = Math.round(runningVmNum / totalVmNum * 100);
                                stopVmNumRate = Math.round(stopVmNum / totalVmNum * 100);
                                otherVmNumRate = 100 - runnningVmRate - stopVmNumRate;
                            }
                            var options = {
                                "id": "ecsNavigateVmStatusInfo",
                                "rotate": 400,
                                "r": 75,
                                "strokeWidth": 20,
                                "showShadow": false,
                                "showLegend": true,
                                "showClickEvent": true,
                                "centerText": {
                                    text: "",
                                    fontSize: 46,
                                    color: "#5ecc49"
                                },
                                "data": [{
                                    value: 0,
                                    name: i18n.common_term_natural_value + ": ",
                                    color: "#5ecc49",
                                    tooltip: i18n.common_term_natural_value + ": ",
                                    click: function () {
                                        $state.go("ecs.vm");
                                    }
                                }, {
                                    value: 0,
                                    name: i18n.common_term_stoped_value + ": ",
                                    color: "#ffa235",
                                    tooltip: i18n.common_term_stoped_value + ": ",
                                    click: function () {
                                        $state.go("ecs.vm");
                                    }
                                }, {
                                    value: 0,
                                    name: i18n.common_term_other_label + ": ",
                                    color: "#eaeaea",
                                    tooltip: i18n.common_term_other_label + ": ",
                                    click: function () {
                                        $state.go("ecs.vm");
                                    }
                                }]
                            };
                            options.centerText.text = totalVmNum;
                            options.data[0].value = runnningVmRate;
                            options.data[0].name += runningVmNum;
                            options.data[0].tooltip += $.encoder.encodeForHTML(runningVmNum);
                            options.data[1].value = stopVmNumRate;
                            options.data[1].name += stopVmNum;
                            options.data[1].tooltip += $.encoder.encodeForHTML(stopVmNum);
                            options.data[2].value = otherVmNumRate;
                            options.data[2].name += otherVmNum;
                            options.data[2].tooltip += $.encoder.encodeForHTML(otherVmNum);
                            var vmStatisticsChart = new CirqueChart(options);
                        });
                    },
                    //磁盘挂载状态统计
                    "queryVolumeStatistics": function () {
                        // 资源池ID不存在时，不下发命令
                        if (!$scope.cloudInfraId || !$scope.hasDiskViewRight || ($scope.openstack && (!$scope.vpcId || $scope.vpcId === "-1"))) {
                            return;
                        }
                        var options = {
                            "cloudInfraId": $scope.cloudInfraId,
                            "vpcId": $scope.vpcId,
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var deferred = diskServiceIns.queryVolumeStatistics(options);
                        deferred.then(function (data) {
                            if (!data || data.total < 0) {
                                return;
                            }
                            $("#ecsNavigateDiskUseInfo").empty();
                            var attachedDiskNum = data.attached;
                            var unAttachedDiskNum = data.unattached;
                            var totalVmNum = data.total;
                            var attachedDiskNumRate = 0;
                            var unAttachedDiskNumRate = 0;
                            if (totalVmNum > 0) {
                                attachedDiskNumRate = Math.round(attachedDiskNum / totalVmNum * 100);
                                unAttachedDiskNumRate = 100 - attachedDiskNumRate;
                            }

                            var options = {
                                "id": "ecsNavigateDiskUseInfo",
                                "rotate": 400,
                                "r": 75,
                                "strokeWidth": 20,
                                "showShadow": false,
                                "showLegend": true,
                                "showClickEvent": true,
                                "centerText": {
                                    text: "",
                                    fontSize: 46,
                                    color: "#5ecc49"
                                },
                                "data": [{
                                    value: 0,
                                    name: i18n.common_term_bonded_value + ": ",
                                    color: "#5ecc49",
                                    tooltip: i18n.common_term_bonded_value + ": ",
                                    click: function () {
                                        $state.go("ecs.storage.disk");
                                    }
                                }, {
                                    value: 0,
                                    name: i18n.common_term_noBond_value + ": ",
                                    color: "#eaeaea",
                                    tooltip: i18n.common_term_noBond_value + ": ",
                                    click: function () {
                                        $state.go("ecs.storage.disk");
                                    }
                                }]
                            };
                            options.centerText.text = totalVmNum;
                            options.data[0].value = attachedDiskNumRate;
                            options.data[0].name += attachedDiskNum;
                            options.data[0].tooltip += $.encoder.encodeForHTML(attachedDiskNum);
                            options.data[1].value = unAttachedDiskNumRate;
                            options.data[1].name += unAttachedDiskNum;
                            options.data[1].tooltip += $.encoder.encodeForHTML(unAttachedDiskNum);
                            var diskStatisticsChart = new CirqueChart(options);
                        });
                    }
                };

                //获取初始化信息
                $scope.$on("$viewContentLoaded", function () {
                    var promise = getLocations();
                    promise.then(function () {
                        if ($scope.openstack) {
                            var defer = queryVpc();
                            defer.then(function () {
                                $scope.command.queryVMStatistics();
                                $scope.command.queryVolumeStatistics();
                            });
                        } else {
                            $scope.command.queryVMStatistics();
                            $scope.command.queryVolumeStatistics();
                        }
                    });
                });

                $scope.init = function(){
                    if( user.cloudType === "ICT"){
                        $scope.startTimer();
                    }
                };

                $scope.$on('$destroy', function () {
                    $scope.clearTimer();
                });

                $scope.init();
        }
        ]
        ;

        return navigateCtrl;
    });
