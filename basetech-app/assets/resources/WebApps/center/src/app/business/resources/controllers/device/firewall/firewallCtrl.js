/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-1-18

 */
define(['tiny-lib/angular',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'bootstrap/bootstrap.min',
    "app/business/resources/controllers/device/constants",
    "app/business/resources/controllers/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function (angular, Window, Message, bootstrap, deviceConstants, constants, ExceptionService) {
        "use strict";
        var firewallCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', function ($scope, $compile, $state, camel, $rootScope) {
            $scope.tableData = [];
            $scope.zoneModel = {};
            $scope.deviceMap = {};
            $scope.addFirewall = {
                "id": "addFirewall",
                "text": $scope.i18n.device_term_connectFW_button,
                "focused": false,
                "click": function () {
                    $state.go("resources.addFirewall");
                }
            };
            $scope.importConfig = {
                "id": "importConfig",
                "text": $scope.i18n.device_term_importFWresourceCfg_button,
                "disabled": false,
                "focused": false,
                "click": function () {
                    var importConfigWindow = new Window({
                        "winId": "importConfigWindow",
                        "title": $scope.i18n.device_term_importFWresourceCfg_button,
                        "minimizable": false,
                        "maximizable": false,
                        "content-type": "url",
                        "content": "../src/app/business/resources/views/device/firewall/importConfig.html",
                        "height": 300,
                        "width": 530,
                        "buttons": null
                    }).show();
                }
            }
            //搜索模型
            $scope.searchModel = {
                name: "",
                zoneId: "",
                start: 0,
                limit: 10
            };
            //资源分区过滤
            $scope.zoneFilter = {
                "id": "zoneFilter",
                "width": "120",
                "values": [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.resource_term_allZone_value,
                        "checked": true
                    }
                ],
                "change": function () {

                    if ("0" == $("#zoneFilter").widget().getSelectedId()) {
                        $scope.searchModel.zoneId = "";
                    }
                    else {
                        $scope.searchModel.zoneId = $("#zoneFilter").widget().getSelectedId();
                    }
                    $scope.operate.queryFirewalls();
                }
            };
            //搜索框
            $scope.searchBox = {
                "id": "hostSearchBox",
                "placeholder": $scope.i18n.device_term_findFW_prom,
                "type": "round", // round,square,long
                "width": "200",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.name = searchString;
                    $scope.operate.queryFirewalls($scope.searchModel);
                }
            };

            //防火墙列表
            var firewallTableColumns = [
                {
                    "sTitle": "",
                    "mData": "",
                    "sWidth": "3%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.deviceName);
                    },
                    "sWidth": "8%",
                    "bSortable": true},
		{
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.deviceId);
                    },
                    "sWidth": "8%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_managerIP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.mgntIpv4Addr);
                    },
                    "sWidth": "8%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_runningStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.runningStatus);
                    },
                    "sWidth": "8%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_linkStatus_value,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.connectStatus);
                    },
                    "sWidth": "6%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.resource_term_zone_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.zone);
                    },
                    "sWidth": "6%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_version_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.deviceVersion);
                    },
                    "sWidth": "8%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_pairIP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.pairDeviceId);
                    },
                    "sWidth": "7%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.device_term_room_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.roomId);
                    },
                    "sWidth": "5%",
                    "bSortable": true},
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "sWidth": "8%",
                    "bSortable": false}
            ];
            $scope.firewallTable = {
                "id": "firewallTable",
                "data": [],
                "columns": firewallTableColumns,
                "enablePagination": true,
                "paginationStyle": "full-numbers",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
                "curPage": {"pageIndex": 1},
                "requestConfig": {
                    "enableRefresh": true,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "showDetails": true,
                "totalRecords": 0,
                "hideTotalRecords": false,
                "columnsDraggable": true,
                "columnsVisibility": {
                    "activate": "click",
                    "aiExclude": [0, 1],
                    "sRestore": $scope.i18n.common_term_restoreDefaultSet_button,
                    "bRestore": true,
                    "buttonText": "",
                    "fnStateChange": function (index, checked) {
                    }
                },
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                    $scope.$apply(function () {
                        $scope.firewallTable.data = $scope.tableData.slice($scope.searchModel.start, $scope.searchModel.limit);
                    });
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                    $scope.firewallTable.displayLength = evtObj.displayLength;
                    $scope.$apply(function () {
                        $scope.firewallTable.data = $scope.tableData.slice($scope.searchModel.start, $scope.searchModel.limit);
                    });
                },
                "columnSorting": [
                    [0, 'asc'],
                    [6, 'asc'],
                    [9, 'asc']
                ],
                "show-details": false,
                "renderRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr("index", iDataIndex);
                    $(nRow).attr("type", $.encoder.encodeForHTML(aData.deviceType));
                    $(nRow).attr("rid", $.encoder.encodeForHTML(aData.deviceRid));
                    $(nRow).attr("cabinet", $.encoder.encodeForHTML(aData.rackId));
                    $(nRow).attr("subrack", $.encoder.encodeForHTML(aData.subrackId));
                    $(nRow).attr("description", $.encoder.encodeForHTML(aData.description));
                    if (aData.pairDeviceId) {
                        var ip = $.encoder.encodeForHTML($scope.deviceMap[aData.pairDeviceId] || "");
                        $("td[tdtitle='" + $scope.i18n.common_term_pairIP_label + "']", nRow).html(ip);
                    }
                    if ($scope.right.hasDeviceOperateRight) {
                        var delStatus = !(aData.deviceStatus == 1 || aData.deviceStatus == 2 || aData.deviceStatus == 6);
                        if (aData.deviceStatus == 0 || aData.deviceStatus == 7) {
                            var submenus = '<span class="dropdown" style="position: static">' +
                                '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                                '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                                '<li><a tabindex="-1" ng-click="redicscovery()">' + $scope.i18n.device_term_rediscover_button + '</a></li>' +
                                '<li><a tabindex="-1" ng-click="chgConnectParam()">' + $scope.i18n.device_term_modifyConnectPara_button + '</a></li>' +
                                '<li><a tabindex="-1" ng-show="!canRediscover" ng-click="showFirewallConfig()">' + $scope.i18n.resource_term_checkResourceCfg_button + '</a></li>' +
                                '<li><a style="color:#999;" tabindex="-1" ng-show="canRediscover">' + $scope.i18n.resource_term_checkResourceCfg_button + '</a></li>' +
                                '</ul>' +
                                '</span>';

                        }
                        else {
                            var submenus = '<span class="dropdown" style="position: static">' + '<a class="dropdown-toggle disabled">' +
                                $scope.i18n.common_term_more_button + '<b class="caret"></b></a></span> ';
                        }
                        if (delStatus) {
                            var del = "<a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>&nbsp&nbsp&nbsp&nbsp"
                        }
                        else {
                            var del = "<span class='disabled' href='javascript:void(0)'>" + $scope.i18n.common_term_delete_button + "</span>&nbsp&nbsp&nbsp&nbsp"
                        }
                        var operateTemplates = "<div>" + del + submenus + "</div>";
                        var operateTmp = $compile($(operateTemplates));
                        var operateScope = $scope.$new(false);
                        operateScope.canRediscover = aData.deviceStatus == 7;
                        operateScope.delete = function () {
                            var content = $scope.i18n.common_term_delConfirm_msg;
                            if (aData.pairDeviceId) {
                                content = $scope.i18n.device_fire_del_info_autoDelOther_msg + $scope.i18n.common_term_delConfirm_msg;
                            }
                            var deleteMsg = new Message({
                                "type": "warn",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": content,
                                "height": "150px",
                                "width": "350px",
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
                            deleteMsg.setButton("okBtn", function () {
                                $scope.operate.deleteFirewall(aData.deviceId);
                                deleteMsg.destroy();
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy()
                            });
                            deleteMsg.show();
                        };
                        operateScope.redicscovery = function () {
                            var msg = new Message({
                                "type": "warn",
                                "title": $scope.i18n.device_term_rediscover_button,
                                "content": $scope.i18n.device_fire_rediscovery_info_confirm_msg,
                                "height": "150px",
                                "width": "350px",
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
                            msg.setButton("okBtn", function () {
                                $scope.operate.reDiscoveryVFW(aData.deviceId);
                                msg.destroy();
                            });
                            msg.setButton("cancelBtn", function () {
                                msg.destroy()
                            });
                            msg.show();
                        };
                        operateScope.chgConnectParam = function () {
                            var chgConnectParam = new Window({
                                    "winId": "chgConnectParamWin",
                                    "title": $scope.i18n.device_term_modifyConnectPara_button,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "../src/app/business/resources/views/device/firewall/chgConnectParam.html",
                                    "zoneInfo": $scope.zoneModel,
                                    "deviceId": aData.deviceId,
                                    "height": 450,
                                    "width": 600,
                                    "buttons": null
                                }
                            ).show();

                        };
                        operateScope.showFirewallConfig = function () {
                            var viewCfgParam = new Window({
                                    "winId": "viewCfgParamWin",
                                    "title": $scope.i18n.resource_term_checkResourceCfg_button,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "../src/app/business/resources/views/device/firewall/viewCfgParam.html",
                                    "deviceId": aData.deviceId,
                                    "height": 450,
                                    "width": 600,
                                    "buttons": null
                                }
                            ).show();
                        };
                        var optNode = operateTmp(operateScope);
                        $("td:last", nRow).html(optNode);
                        optNode.find('.dropdown').dropdown();
                    }
                }
            };

            $scope.operate = {
                "init": function () {
                    var queryConfig = constants.rest.ZONE_QUERY;
                    var deferred = camel.get({
                        url: {s: queryConfig.url, o: {"tenant_id": "1"}},
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
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
                queryFirewalls: function () {
                    var queryConfig = deviceConstants.rest.FIREWALL_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zone_id": $scope.searchModel.zoneId, "firewall_name": $scope.searchModel.name}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            for (var index in response.firewallVOs) {
                                $scope.deviceMap[response.firewallVOs[index].deviceId] = response.firewallVOs[index].mgntIpv4Addr;
                                response.firewallVOs[index].detail = {contentType: "url", content: "../src/app/business/resources/views/device/firewall/firewallDetail.html"};
                                response.firewallVOs[index].zone = $scope.zoneModel[response.firewallVOs[index].zoneId] || response.firewallVOs[index].zoneId;
                                response.firewallVOs[index].runningStatus = $scope.i18n[deviceConstants.config.FIREWALL_DEVICE_STATUS[ response.firewallVOs[index].deviceStatus] || response.firewallVOs[index].deviceStatus];
                                response.firewallVOs[index].connectStatus = $scope.i18n[deviceConstants.config.FIREWALL_CONNECT_STATUS[ response.firewallVOs[index].connStatus] || response.firewallVOs[index].connStatus];
                            }
                            $scope.tableData = response.firewallVOs;
                            $scope.firewallTable.data = $scope.tableData.slice($scope.searchModel.start, $scope.searchModel.limit);
                            $scope.firewallTable.totalRecords = response.total;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                deleteFirewall: function (id) {
                    var deleteConfig = deviceConstants.rest.FIREWALL_DELETE;
                    var deferred = camel.delete({
                        "url": {s: deleteConfig.url, o: {"id": id}},
                        "type": deleteConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.operate.queryFirewalls();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                reDiscoveryVFW: function (id) {
                    var config = deviceConstants.rest.VFW_REDISCOVERY;
                    var deferred = camel.post({
                        "url": {s: config.url, o: {"id": id}},
                        "type": config.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }

            //初始化
            $scope.operate.init();
            //查询数据
            $scope.operate.queryFirewalls();
        }];
        return firewallCtrl;
    })
;


