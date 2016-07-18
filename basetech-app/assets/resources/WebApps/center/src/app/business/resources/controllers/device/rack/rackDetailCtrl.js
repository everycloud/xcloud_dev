/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-2-21

 */
define(['tiny-lib/angular',
    'tiny-widgets/Message',
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function (angular, Message, deviceConstants, ExceptionService, deviceFixture) {
        "use strict";
        var rackDetailCtrl = ['$scope', '$compile', '$state', '$stateParams', '$rootScope', 'camel', function ($scope, $compile, $state, $stateParams, $rootScope, camel) {
            $scope.chassisId = $stateParams.chassisId;
            $scope.chassisInfo = {};
            $scope.alarmInfo = {"critical": 0, "major": 0, "minor": 0, "warning": 0};
            $scope.hasDeviceOperateRight = $rootScope.user.privilege.role_role_add_option_deviceHandle_value;
            $scope.isLocal = $scope.deployMode === "local";
            //返回按钮
            $scope.return = {
                "id": "return",
                "text": $scope.i18n.common_term_return_button,
                "click": function () {
                    $state.go("resources.device.rack");
                }
            };

            //基本信息
            $scope.basicInfo = {
                name: {
                    "label": $scope.i18n.common_term_name_label + ":",
                    "value": $scope.name
                },
                mmAIp: {
                    "label": $scope.i18n.device_term_MMAip_label + ":",
                    "value": ""
                },
                mmBIp: {
                    "label": $scope.i18n.device_term_MMBip_label + ":",
                    "value": ""
                },
                description: {
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "value": ""
                }
            };

            //服务器列表
            var hostTableColumns = [
                {
                    "sTitle": $scope.i18n.device_term_slotID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.slotNo);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.serverName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_runningStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.runStatus);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.resource_term_resourceStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.resourceStatus);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.device_term_model_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.product);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "bSortable": false
                }
            ];

            //服务器列表
            $scope.hostTable = {
                "id": "hostTable",
                "data": [],
                "columns": hostTableColumns,
                "enablePagination": false,
                "requestConfig": {
                    "enableRefresh": false,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "columnsDraggable": true,
                "show-details": false,
                "renderRow": function (nRow, aData, iDataIndex) {
                    var canDetail = (aData.resourceState == 3);
                    if (canDetail) {
                        // 服务器名称加上跳转链接
                        var hostName = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                        var hostNameLink = $compile(hostName);
                        var hostNameScope = $scope.$new();
                        hostNameScope.name = aData.serverName;
                        hostNameScope.type = aData.serverNameType;
                        hostNameScope.goToDetail = function () {
                            $state.go("resources.hostDetail.summary", {"type": hostNameScope.type, "serverType": aData.serverType, "hostId": aData.hostId});
                        }
                        var hostNameNode = hostNameLink(hostNameScope);
                        $("td:eq(1)", nRow).html(hostNameNode);
                    }
                    var canClear = ($scope.hasDeviceOperateRight && (aData.resourceState == 3 || aData.resourceState == 6));
                    if (canClear) {
                        var operateTemplates = "<div><a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_clearConnectPara_button + "</a></div>";
                        var operateTmp = $compile($(operateTemplates));
                        var operateScope = $scope.$new(false);

                        operateScope.delete = function () {
                            var deleteMsg = new Message({
                                "type": "warn",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.common_term_clearConnectPara_button,
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: $scope.i18n.common_term_ok_button,
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn : true,
                                        default: true
                                    },
                                    {
                                        label: $scope.i18n.common_term_cancle_button,
                                        accessKey: '3',
                                        "key": "cancelBtn",
                                        default: false
                                    }
                                ]
                            });
                            deleteMsg.setButton("okBtn", function () {
                                deleteMsg.destroy();
                                $scope.operate.clearServerParam(aData.uhmServerId);
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy()
                            });
                            deleteMsg.show();
                        };
                        var optNode = operateTmp(operateScope);
                        $("td:eq(5)", nRow).html(optNode);
                    }
                }
            };

            //风扇监控列表
            var fanMonitorColumns = [
                {
                    "sTitle": $scope.i18n.device_term_slotID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.slotNo);
                    },
                    "sWidth": "25%",
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "sWidth": "25%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_speed_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.speed);
                    },
                    "sWidth": "25%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "sWidth": "25%",
                    "bSortable": false}
            ];

            //风扇监控列表
            $scope.fanMonitorTable = {
                "id": "fanMonitorTable",
                "data": [],
                "columns": fanMonitorColumns,
                "enablePagination": false,
                "requestConfig": {
                    "enableRefresh": false,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "columnsDraggable": true,
                "show-details": false,
                "renderRow": function (nRow, aData, iDataIndex) {
                }
            };

            //电源监控列
            var powerMonitorColumns = [
                {
                    "sTitle": $scope.i18n.device_term_slotID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.slotNo);
                    },
                    "sWidth": "25%",
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "sWidth": "25%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_power_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.power);
                    },
                    "sWidth": "25%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "sWidth": "25%",
                    "bSortable": false}
            ];

            //电源监控列表
            $scope.powerMonitorTable = {
                "id": "powerMonitorTable",
                "data": [],
                "columns": powerMonitorColumns,
                "enablePagination": false,
                "requestConfig": {
                    "enableRefresh": false,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "columnsDraggable": true,
                "show-details": false,
                "renderRow": function (nRow, aData, iDataIndex) {
                }
            };

            $scope.operate = {
                "init": function () {
                    var queryConfig = deviceConstants.rest.CHASSIS_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"start": "", "limit": "", "sort_key": "", "sort_dir": "", "zoneId": "", "resourceStatus": "", "name": "", "type": "", "chassisId": $scope.chassisId}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.chassisInfo = response.chassis[0];
                            for (var index in $scope.chassisInfo.hostFanInfo.hostFans) {
                                var speed = $scope.chassisInfo.hostFanInfo.hostFans[index].speed;
                                $scope.chassisInfo.hostFanInfo.hostFans[index].speed = (speed < 0 ? "-" : speed);
                                $scope.chassisInfo.hostFanInfo.hostFans[index].statusStr = $scope.i18n[deviceConstants.config.FAN_STATUS[$scope.chassisInfo.hostFanInfo.hostFans[index].status]];
                            }
                            $scope.fanMonitorTable.data = $scope.chassisInfo.hostFanInfo.hostFans;
                            for (var index in  $scope.chassisInfo.phyPowerInfo.powers) {
                                $scope.chassisInfo.phyPowerInfo.powers[index].statusStr = $scope.i18n[deviceConstants.config.POWER_STATUS[$scope.chassisInfo.phyPowerInfo.powers[index].status]];
                            }
                            $scope.powerMonitorTable.data = $scope.chassisInfo.phyPowerInfo.powers;
                        });
                        $scope.operate.getAlarm();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "getServers": function () {
                    var initConfig = deviceConstants.rest.CHASSIS_SLOTS_QUERY
                    var deferred = camel.get({
                        "url": {s: initConfig.url, o: {"chassisId": $scope.chassisId}},
                        "type": initConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        for (var index in response.servers) {
                            response.servers[index].runStatus = $scope.i18n[deviceConstants.config.HOST_RUN_STATUS[response.servers[index].runtimeState]];
                            response.servers[index].resourceStatus = $scope.i18n[deviceConstants.config.HOST_RESOURCE_STATUS[response.servers[index].resourceState]];
                        }
                        $scope.$apply(function () {
                            $scope.hostTable.data = response.servers;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "clearServerParam": function (id) {
                    var delConfig = deviceConstants.rest.BLADE_HOST_CLEAR;
                    var deferred = camel.delete({
                        "url": {s: delConfig.url, o: {"id": id}},
                        "type": delConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (data) {
                        $scope.$apply(function () {
                            $scope.operate.getServers();
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "goToAlarm": function (level) {
                    $state.go("monitor.alarmlist", {"severity": level, "resourceid": $scope.chassisInfo.urn, moc: "chassis", "alarmtype": 1});
                },
                "getAlarm": function () {
                    var params = {"conditionList": [
                        {"staticType": ["critical", "major", "minor", "warning"],
                            "staticCond": {"moc": "chassis", "objectId": $scope.chassisInfo.urn}}
                    ]};
                    var queryConfig = deviceConstants.rest.ALARM_QUERY;
                    if($scope.isLocal)
                    {
                        queryConfig.url = "/goku/rest/v1.5/fault/{tenant_id}/alarms/statistic"
                    }
                    var deferred = camel.post({
                        "url": {s: queryConfig.url, o: {"tenant_id": "1"}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id,
                        "params": JSON.stringify(params)
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.alarmInfo.critical = response.value[0].staticType['critical'];
                            $scope.alarmInfo.major = response.value[0].staticType['major'];
                            $scope.alarmInfo.minor = response.value[0].staticType['minor'];
                            $scope.alarmInfo.warning = response.value[0].staticType['warning'];
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            //初始化数据
            $scope.operate.init();
            $scope.operate.getServers();
        }];
        return rackDetailCtrl;
    }
)
;

