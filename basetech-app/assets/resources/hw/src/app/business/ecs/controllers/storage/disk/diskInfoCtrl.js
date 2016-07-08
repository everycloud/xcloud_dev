/* global define */
define([
    'sprintf',
    'tiny-lib/jquery',
    'tiny-lib/angular',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'tiny-lib/underscore',
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-widgets/Message",
    "app/business/ecs/services/vm/vmCommonService",
    "app/business/ecs/services/storage/diskService",
    "app/business/ecs/services/vm/queryVmService",
    "tiny-directives/Table"
],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, _, http, exception, Message, vmCommonService, diskService, queryVmService) {
        "use strict";

        var diskInfoCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var vmCommonServiceIns = new vmCommonService();
                var diskServiceIns = new diskService(exception, $q, camel);
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                var i18n = $scope.i18n;
                $scope.isIT = user.cloudType === "IT";
                var $state = $("html").injector().get("$state");
                // 权限控制
                var DISK_OPERATE = "610000";
                var hasDiskOperateRight = _.contains(user.privilegeList, DISK_OPERATE);
                $scope.isServiceCenter = $("html").scope().deployMode === "serviceCenter";
                $scope.vpcId = "-1";
                $scope.volumeId = "";
                $scope.createTime = "";

                $scope.label = {
                    createTime: i18n.common_term_createAt_label + ":",
                    volumeId: i18n.common_term_diskID_label + ":",
                    configType: i18n.common_term_formatDiskMode_label + ":"
                };

                var configTypes = {
                    "thick": $scope.i18n.common_term_formatFull_label,
                    "thickformat": $scope.i18n.common_term_formatDelay_label,
                    "thin": $scope.i18n.common_term_formatQuick_label
                };
                $scope.bindVms = {
                    "id": "ecsStorageDiskDetailTable",
                    "enablePagination": false,
                    "draggable": true,
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vmName);
                            }
                        },
                        {
                            "sTitle": $scope.isIT?i18n.common_term_globeID_label:i18n.common_term_ID_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vmId);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_status_label,
                            "mData": "statusView",
                            "sWidth": "150px"
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "",
                            "sWidth": "150px",
                            "bSortable": false
                        }
                    ],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //tips提示
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();

                        // 操作列
                        if (hasDiskOperateRight) {
                            var optColumn = "";
                            if(!$scope.isIT && aData.status !== "stopped"){
                                optColumn = "<a class='btn-link disabled'>" + i18n.common_term_unbond_button + "</a> ";
                            }
                            else{
                                optColumn = "<a class='btn-link' ng-click='unMount()'>" + i18n.common_term_unbond_button + "</a> ";
                            }
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.id = "ecsStorageDiskDetailOptUnMount" + iDataIndex;
                            optScope.unMount = function () {
                                unMountDiskConfirm(aData.vmId);
                            };
                            var optNode = optLink(optScope);
                            $("td:eq(3)", nRow).html(optNode);
                        }
                    }
                };

                $scope.getBindVms = function () {
                    if (!$scope.disksDetail) {
                        return;
                    }
                    $scope.configType = configTypes[$scope.disksDetail.configType] || "--";
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.cloudInfraId,
                        "volumeId": $scope.volumeId,
                        "vpcId": $scope.vpcId
                    };
                    var deferred = queryVmServiceIns.queryVmList(options);
                    deferred.then(function (data) {
                        if (data && data.list && data.list.vms) {
                            _.each(data.list.vms, function (item) {
                                _.extend(item, {
                                    "statusView": vmCommonServiceIns.getStatusStr(item.status),
                                    "vmName": item.name,
                                    "vmId": item.id,
                                    "vmStatus": item.status
                                });
                            });
                            $scope.bindVms.data = data.list.vms;
                        }
                        else {
                            _.each($scope.disksDetail.volVmInfos, function (item) {
                                _.extend(item, {
                                    "statusView": vmCommonServiceIns.getStatusStr(item.vmStatus)
                                });
                            });
                            $scope.bindVms.data = $scope.disksDetail.volVmInfos;
                        }
                        $scope.volumeId = $scope.disksDetail.id;
                        $scope.createTime = $scope.disksDetail.createTime;
                    });
                };
                $scope.serviceInstanceName = {
                    "id": "serviceInstanceName",
                    "label": (i18n.service_term_serviceInstance_label || "服务实例：") + ":",
                    "value": ""
                };
                // 权限控制
                var SERVER_OPERATE = "320005";
                var hasApprovalOrderRight = _.contains(user.privilegeList, SERVER_OPERATE);
                var urlInstance = "ssp.instance.myInstance";
                if (hasApprovalOrderRight) {
                    urlInstance = "ssp.instance.allInstance";
                }

                $scope.jumpServiceInstancePage = function () {
                    $state.go(urlInstance, {
                        "instanceId": $scope.instanceId
                    });
                };
                //根据资源ID查询
                function queryServiceInstanceId() {
                    var deferred = camel.get({
                        url: {s: "/goku/rest/v1.5/{vdc_id}/service-resources/{id}",
                            o: {vdc_id: user.vdcId, id: $scope.volumeId}},
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var hosts = data || [];
                        $scope.hosts = hosts;
                        $scope.$apply(function () {
                            $scope.instanceId = hosts.instanceId;
                            $scope.instanceName = hosts.instanceName;
                            $scope.serviceInstanceName.value = hosts.instanceName;
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data);
                    });
                }

                //删除磁盘的确认框
                function unMountDiskConfirm(vmId) {
                    var options = {
                        "type": "confirm",
                        "content": i18n.vm_vm_unbondVMdisk_info_confirm_msg,
                        "height": "120px",
                        "width": "330px",
                        "buttons": [
                            {
                                label: i18n.common_term_ok_button,
                                "default": true,
                                majorBtn: true,
                                "handler": function (event) {
                                    msg.destroy();
                                    unMountDisk(vmId);
                                }
                            },
                            {
                                label: i18n.common_term_cancle_button,
                                "default": false,
                                "handler": function (event) {
                                    msg.destroy();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                }

                // 执行解绑定动作
                function unMountDisk(vmId) {
                    var options = {
                        "user": user,
                        "volumeId": $scope.volumeId,
                        "cloudInfraId": $scope.cloudInfraId,
                        "vpcId": $scope.vpcId,
                        "params": {
                            "unmount": {
                                "vmId": vmId
                            }
                        }
                    };
                    var deferred = diskServiceIns.operateDisk(options);
                    deferred.then(function (data) {
                        $("#ecsStorageDisks").scope().$broadcast("refreshEcsStorageDiskTable", "");
                    });
                }

                $scope.init = function () {
                    if ($scope.isServiceCenter) {
                        queryServiceInstanceId($scope.hosytId);
                    }
                };
            }
        ];

        var ecsStorageDiskInfoModule = angular.module("ecs.storage.disk.info", ["ng", "wcc", "ngSanitize"]);
        ecsStorageDiskInfoModule.controller("ecs.storage.disk.info.ctrl", diskInfoCtrl);
        ecsStorageDiskInfoModule.service("camel", http);
        ecsStorageDiskInfoModule.service("exception", exception);
        return ecsStorageDiskInfoModule;
    }
);
