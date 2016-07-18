/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-18

 */
define(['tiny-lib/angular',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "bootstrap/bootstrap.min",
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "app/services/tipMessageService",
    "fixtures/deviceFixture"
],
    function (angular, Window, Message, bootstrap, constants, deviceConstants, ExceptionService, tipMessageService, deviceFixture) {
        "use strict";
        var hostCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', '$stateParams', function ($scope, $compile, $state, camel, $rootScope, $stateParams) {
                $scope.zoneId = $stateParams.id;
                $scope.cloudType = $rootScope.user.cloudType;
                $scope.zoneModel = {};
                //接入机架式服务器按钮
                $scope.addRackHostModel = {
                    "id": "addRackHost",
                    "text": $scope.i18n.device_term_connectRackServer_button,
                    "focused": false,
                    "click": function () {
                        $state.go("resources.addRackHost");
                    }
                }
                //全部上电，仅IT场景下有
                $scope.powerOnAll = {
                    "id": "powerOnAll",
                    "text": $scope.i18n.device_term_onAll_button,
                    "focused": false,
                    "click": function () {
                        var onAllMsg = new Message({
                            "type": "warn",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.device_rack_onAll_info_confirm_msg,
                            "height": "220px",
                            "width": "400px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    accessKey: '2',
                                    "key": "okBtn",
                                    majorBtn: true,
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
                        onAllMsg.setButton("okBtn", function () {
                            $scope.operate.allHostAction("poweron");
                            onAllMsg.destroy();
                        });
                        onAllMsg.setButton("cancelBtn", function () {
                            onAllMsg.destroy()
                        });
                        onAllMsg.show();
                    }
                }
                //全部下电，仅IT场景下有
                $scope.powerOffAll = {
                    "id": "powerOffAll",
                    "text": $scope.i18n.device_term_offAll_button,
                    "focused": false,
                    "click": function () {
                        var offAllMsg = new Message({
                            "type": "warn",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.device_rack_offAll_info_confirm_msg,
                            "height": "220px",
                            "width": "400px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    accessKey: '2',
                                    "key": "okBtn",
                                    majorBtn: true,
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
                        offAllMsg.setButton("okBtn", function () {
                            $scope.operate.allHostAction("poweroff");
                            offAllMsg.destroy();
                        });
                        offAllMsg.setButton("cancelBtn", function () {
                            offAllMsg.destroy()
                        });
                        offAllMsg.show();
                    }
                }
                //同步主机按钮  ICT场景下有
                $scope.refreshRackHost = {
                    "id": "refreshRackHost",
                    "text": $scope.i18n.resource_term_syncHost_button,
                    "tooltip": $scope.i18n.device_term_syncHostInfoFromOP_label,
                    "focused": false,
                    "click": function () {
                        $scope.operate.refreshHost();
                    }
                }

                //刷新
                $scope.refreshModel = {
                    "id": "hostRefresh",
                    "click": function () {
                        $scope.operate.queryHostsData();
                    }
                }

                //搜索模型
                $scope.searchModel = {
                    "name": "",
                    "type": "",
                    "zoneId": $scope.zoneId || "",
                    "runStatus": "",
                    "resourceStatus": "",
                    "start": 1,
                    "limit": 10
                };

                //资源分区搜索框
                $scope.zoneFilter = {
                    "id": "zoneFilter",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "all",
                            "label": $scope.i18n.resource_term_allZone_value,
                            "checked": true
                        }
                    ],
                    "change": function () {
                        var zoneSelectId = $("#zoneFilter").widget().getSelectedId();
                        if ("all" == zoneSelectId) {
                            $scope.searchModel.zoneId = "";
                        }
                        else {
                            $scope.searchModel.zoneId = zoneSelectId
                        }
                        $scope.operate.queryHostsData();
                    }
                };

                //运行状态1:Normal 2:Shutdown 3:Error(Unknown) 4:Absent。,
                $scope.runningStatusFilter = {
                    "id": "runningStatusFilter",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "all",
                            "label": $scope.i18n.common_term_allRunStatus_label,
                            "checked": true
                        },
                        {
                            "selectId": "5",
                            "label": $scope.i18n.common_term_unknown_value
                        },
                        {
                            "selectId": "6",
                            "label": $scope.i18n.common_term_restarting_value
                        },
                        {
                            "selectId": "7",
                            "label": $scope.i18n.common_term_online_value
                        },
                        {
                            "selectId": "8",
                            "label": $scope.i18n.common_term_offline_label
                        }
                    ],
                    "change": function () {
                        var runStatusSelectId = $("#runningStatusFilter").widget().getSelectedId();
                        if ("all" == runStatusSelectId) {
                            $scope.searchModel.runStatus = "";
                        }
                        else {
                            $scope.searchModel.runStatus = runStatusSelectId
                        }
                        $scope.operate.queryHostsData();
                    }
                };
                //资源状态
                $scope.resourceStatusFilter = {
                    "id": "resourceStatusFilter",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "all",
                            "label": $scope.i18n.resource_term_allResourceStatus_value,
                            "checked": true
                        },
                        {
                            "selectId": "1",
                            "label": $scope.i18n.common_term_initializtion_value
                        },
                        {
                            "selectId": "2",
                            "label": $scope.i18n.common_term_discovering_value
                        },
                        {
                            "selectId": "3",
                            "label": $scope.i18n.common_term_ready_value
                        },
                        {
                            "selectId": "6",
                            "label": $scope.i18n.common_term_discoverFail_value
                        },
                        {
                            "selectId": "10",
                            "label": $scope.i18n.common_term_unknown_value
                        },
                        {
                            "selectId": "15",
                            "label": $scope.i18n.device_term_linkHostFail_value
                        },
                        {
                            "selectId": "16",
                            "label": $scope.i18n.device_term_getSpecFail_value
                        },
                        {
                            "selectId": "100",
                            "label": $scope.i18n.device_term_outOS_value
                        }
                    ],
                    "change": function () {
                        var resourceStatusSelectId = $("#resourceStatusFilter").widget().getSelectedId();
                        if ("all" == resourceStatusSelectId) {
                            $scope.searchModel.resourceStatus = "";
                        }
                        else {
                            $scope.searchModel.resourceStatus = resourceStatusSelectId
                        }
                        $scope.operate.queryHostsData();
                    }
                };

                //搜索框
                $scope.searchBox = {
                    "id": "hostSearchBox",
                    "placeholder": $scope.i18n.device_term_findRack_prom,
                    "type": "round", // round,square,long
                    "width": "200",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.name = searchString;
                        $scope.operate.queryHostsData();
                    }
                };

                //服务器列表
                var hostTableColumns = [
                    {
                        "sTitle": $scope.i18n.device_term_deviceName_label || "设备名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.serverName);
                        },
                        "sWidth": "6%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.common_term_runningStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.runStatus);
                        },
                        "sWidth": "7%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.resource_term_resourceStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resourceStatus);
                        },
                        "sWidth": "7%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.device_term_model_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.product);
                        },
                        "sWidth": "10%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.resource_term_zone_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.zoneName);
                        },
                        "sWidth": "6%",
                        "bSortable": false,
                        "bVisible": $scope.cloudType == 'FUSIONSPHERE'},
                    {
                        "sTitle": $scope.i18n.device_term_room_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.roomName);
                        },
                        "sWidth": "6%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.device_term_cabinet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.rackNo);
                        },
                        "sWidth": "5%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_subrack_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subRackNo);
                        },
                        "sWidth": "5%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_slotID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.slotNo);
                        },
                        "sWidth": "4%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "",
                        "sWidth": "16%",
                        "bSortable": false}
                ];

                $scope.hostTableModel = {
                    "id": "hostTable",
                    "data": [],
                    "columns": hostTableColumns,
                    "enablePagination": true,
                    "paginationStyle": "full-numbers",
                    "lengthChange": true,
                    "lengthMenu": [10, 20, 50],
                    "displayLength": 10,
                    "curPage": {"pageIndex": 1},
                    "requestConfig": {
                        "enableRefresh": false,
                        "refreshInterval": 60000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "columnsDraggable": true,
                    "columnsVisibility": {
                        "activate": "click",
                        "aiExclude": $scope.cloudType == 'FUSIONSPHERE' ? [0, 9] : [0, 4, 9],
                        "bRestore": true,
                        "sRestore": $scope.i18n.common_term_restoreDefaultSet_button,
                        "buttonText": "",
                        "fnStateChange": function (index, checked) {
                        }
                    },
                    "columnSorting": [
                        [1, 'asc'],
                        [2, 'asc'],
                        [3, 'asc'],
                        [5, 'asc'],
                        [6, 'asc']
                    ],
                    "show-details": false,
                    "callback": function (evtObj) {
                        $scope.searchModel.start = evtObj.currentPage;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operate.queryHostsData();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.start = evtObj.currentPage;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.hostTableModel.displayLength = evtObj.displayLength;
                        $scope.operate.queryHostsData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // 服务器名称加上跳转链接
                        var hostName = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                        var hostNameLink = $compile(hostName);
                        var hostNameScope = $scope.$new();
                        hostNameScope.name = $.encoder.encodeForHTML(aData.serverName);
                        hostNameScope.goToDetail = function () {
                            $state.go("resources.hostDetail.summary", { "hostId": aData.hostId, "type": "server", "serverType": aData.serverType, "name": aData.serverName});

                        }
                        var hostNameNode = hostNameLink(hostNameScope);
                        $("td:eq(0)", nRow).html(hostNameNode);

                        if ($scope.right.hasDeviceOperateRight) {
                            var submenus = '<span class="dropdown" style="position: static">' +
                                '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                                '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                                '<li><a tabindex="-1" ng-show="rackServer" ng-click="delete()">' + $scope.i18n.common_term_delete_button + '</a></li>' +
                                '<li class="divider-line"></li>' +
                                '<li><a tabindex="-1" ng-click="powerOn()">' + $scope.i18n.common_term_on_button + '</a></li>' +
                                '<li><a tabindex="-1" ng-click="restart()">' + $scope.i18n.common_term_forciblyRestart_button + '</a></li>' +
                                '<li><a tabindex="-1" ng-click="powerOff()">' + $scope.i18n.common_term_forciblyDown_button + '</a></li>' +
                                '<li><a tabindex="-1"  ng-show="rackServer" ng-click="modifyBasicInfo()">' + $scope.i18n.app_term_modifyBasicInfo_button + '</a></li>' +
                                '</ul>' +
                                '</span>';
                            var operateTemplates = "<div><a class='margin-right-beautifier' href='javascript:void(0)' ng-click='chgAccParam()'>" + $scope.i18n.device_term_modifyConnectPara_button + "</a>&nbsp" +
                                submenus + "</div>";
                            if (!aData.bmcIp) {
                                operateTemplates = "<div><p class='margin-right-beautifier disabled fl' href='javascript:void(0)'>" + $scope.i18n.device_term_modifyConnectPara_button + "</p>&nbsp" +
                                    submenus + "</div>";
                            }
                            var operateTmp = $compile($(operateTemplates));
                            var operateScope = $scope.$new(false);
                            operateScope.rackServer = aData.serverType == 1;

                            operateScope.modifyBasicInfo = function () {
                                var modifyBasicInfo = new Window({
                                    "winId": "modifyBasicInfoWin",
                                    "title": $scope.i18n.app_term_modifyBasicInfo_button,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "../src/app/business/resources/views/device/host/modifyHostBasicInfo.html",
                                    "params": aData,
                                    "height": 300,
                                    "width": 400,
                                    "buttons": null,
                                    "close": function () {
                                        $scope.operate.queryHostsData();
                                    }
                                }).show();
                            };
                            operateScope.chgAccParam = function () {
                                var chgAccParamWindow = new Window({
                                    "winId": "chgAccParamWindow",
                                    "title": $scope.i18n.device_term_modifyConnectPara_button,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "../src/app/business/resources/views/device/host/chgAccParam.html",
                                    "hostName": aData.name,
                                    "params": aData,
                                    "height": 380,
                                    "width": 500,
                                    "buttons": null,
                                    "close": function () {
                                        $scope.operate.queryHostsData();
                                    }
                                }).show();
                            };
                            operateScope.delete = function () {
                                var delHostMsg = new Message({
                                    "type": "warn",
                                    "title": $scope.i18n.common_term_confirm_label,
                                    "content": $scope.i18n.virtual_host_del_info_confirm_msg,
                                    "height": "220px",
                                    "width": "400px",
                                    "buttons": [
                                        {
                                            label: $scope.i18n.common_term_ok_button,
                                            accessKey: '2',
                                            "key": "okBtn",
                                            majorBtn: true,
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
                                delHostMsg.setButton("okBtn", function () {
                                    $scope.operate.deleteHost(aData.uhmServerId);
                                    delHostMsg.destroy();

                                });
                                delHostMsg.setButton("cancelBtn", function () {
                                    delHostMsg.destroy()
                                });
                                delHostMsg.show();
                            };
                            operateScope.powerOn = function () {
                                var params = {
                                    "serverId": aData.uhmServerId,
                                    "action": "poweron",
                                    "powerMode": 1
                                }
                                $scope.operate.hostAction(params);
                            };
                            operateScope.restart = function () {
                                var restartHostMsg = new Message({
                                    "type": "warn",
                                    "title": $scope.i18n.common_term_confirm_label,
                                    "content": $scope.i18n.virtual_host_restart_info_confirm_msg,
                                    "height": "220px",
                                    "width": "400px",
                                    "buttons": [
                                        {
                                            label: $scope.i18n.common_term_ok_button,
                                            accessKey: '2',
                                            "key": "okBtn",
                                            majorBtn: true,
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
                                restartHostMsg.setButton("okBtn", function () {
                                    var params = {
                                        "serverId": aData.uhmServerId,
                                        "action": "reboot",
                                        "powerMode": 0
                                    }
                                    $scope.operate.hostAction(params);
                                    restartHostMsg.destroy();
                                });
                                restartHostMsg.setButton("cancelBtn", function () {
                                    restartHostMsg.destroy()
                                });
                                restartHostMsg.show();
                            };
                            operateScope.powerOff = function () {
                                var offHostMsg = new Message({
                                    "type": "warn",
                                    "title": $scope.i18n.common_term_confirm_label,
                                    "content": $scope.i18n.virtual_host_forciblyDown_info_confirm_msg,
                                    "height": "220px",
                                    "width": "400px",
                                    "buttons": [
                                        {
                                            label: $scope.i18n.common_term_ok_button,
                                            accessKey: '2',
                                            "key": "okBtn",
                                            majorBtn: true,
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
                                offHostMsg.setButton("okBtn", function () {
                                    var params = {
                                        "serverId": aData.uhmServerId,
                                        "action": "poweroff",
                                        "powerMode": 0
                                    }
                                    $scope.operate.hostAction(params);
                                    offHostMsg.destroy();
                                });
                                offHostMsg.setButton("cancelBtn", function () {
                                    offHostMsg.destroy()
                                });
                                offHostMsg.show();
                            };
                            var optNode = operateTmp(operateScope);
                            $("td:last", nRow).html(optNode);
                            optNode.find('.dropdown').dropdown();
                        }
                    }
                };

                //操作
                $scope.operate = {
                    "getZones": function () {
                        var queryConfig = constants.rest.ZONE_QUERY;
                        var deferred = camel.get({
                            url: {s: queryConfig.url, o: {"tenant_id": "1"}},
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            var zones = response.zones;
                            for (var index in zones) {
                                $scope.zoneModel[zones[index].id] = zones[index].name;
                                var availableZone = {
                                    "selectId": zones[index].id,
                                    "label": zones[index].name
                                };
                                $scope.zoneFilter.values.push(availableZone);
                            }
                            $("#" + $scope.zoneFilter.id).widget().option("values", $scope.zoneFilter.values);
                        });
                    },
                    //查询服务器
                    queryHostsData: function () {
                        var queryConfig = deviceConstants.rest.HOST_QUERY
                        var deferred = camel.get({
                                "url": {s: queryConfig.url, o: {"start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "sort_key": "", "sort_dir": "", "zoneId": $scope.searchModel.zoneId, "runStatus": $scope.searchModel.runStatus, "resourceStatus": $scope.searchModel.resourceStatus, "name": $scope.searchModel.name, "type": $scope.searchModel.type}},
                                "type": queryConfig.type,
                                "userId": $rootScope.user.id
                            }
                        )
                        deferred.done(function (response) {
                            for (var index in response.servers) {
                                response.servers[index].runStatus = $scope.i18n[deviceConstants.config.HOST_RUN_STATUS[response.servers[index].runtimeState]];
                                response.servers[index].resourceStatus = $scope.i18n[deviceConstants.config.HOST_RESOURCE_STATUS[response.servers[index].resourceState]];
                            }
                            $scope.$apply(function () {
                                $scope.hostTableModel.data = response.servers;
                                $scope.hostTableModel.totalRecords = response.total;
                            });
                        });
                    },
                    //主机操作，包括上电下电重启
                    hostAction: function (params) {
                        var actionConfig = deviceConstants.rest.HOST_ACTION;
                        var deferred = camel.post({
                            "url": {s: actionConfig.url, o: {"id": params.serverId, "action": params.action}},
                            "type": actionConfig.type,
                            "params": JSON.stringify({"powerMode": params.powerMode}),
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (data) {
                            $scope.operate.queryHostsData();
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    //所有主机的操作
                    allHostAction: function (action) {
                        var actionConfig = deviceConstants.rest.HOST_ACTION;
                        var deferred = camel.post({
                            "url": {s: actionConfig.url, o: {"id": "all", "action": action}},
                            "type": actionConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (data) {
                            $scope.operate.queryHostsData();
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    //删除主机
                    deleteHost: function (id) {
                        var deleteConfig = deviceConstants.rest.HOST_DELETE
                        var deferred = camel.delete({
                            "url": {s: deleteConfig.url, o: {"serverId": id}},
                            "type": deleteConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (data) {
                            $scope.operate.queryHostsData();
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    //更新主机
                    refreshHost: function () {
                        var refreshConfig = deviceConstants.rest.HOST_REFRESH
                        var deferred = camel.post({
                            "url": refreshConfig.url,
                            "type": refreshConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            new tipMessageService().alert("success", $scope.i18n.common_term_SyncSucceed_value);
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                };

                //初始化数据
                $scope.operate.queryHostsData();
                $scope.operate.getZones();

            }]
            ;
        return hostCtrl;
    })
;

