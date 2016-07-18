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
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/messageService",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function (angular, Window, Message, constants, deviceConstants, MessageService, ExceptionService, deviceFixture) {
        "use strict";
        var switchCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', '$stateParams', function ($scope, $compile, $state, camel, $rootScope, $stateParams) {
                $scope.zoneId = $stateParams.id;
                $scope.cloudType = $rootScope.user.cloudType;
                $scope.connectModel = {
                    "id": "connectSwitch",
                    "text": $scope.i18n.device_term_connectSwitch_button,
                    "focused": false,
                    "connectSwitch": function () {
                        $state.go("resources.addSwitch");
                    }
                };

                //搜索模型
                $scope.searchModel = {
                    "nameOrRackNo": "",
                    "zoneId": $scope.zoneId || "",
                    "roomName": "",
                    "curPage": 1,
                    "status": "65535",
                    "recordPerPage": 10
                };

                //资源分区过滤
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
                        var selectZoneId = $("#zoneFilter").widget().getSelectedId();
                        if ("all" == selectZoneId) {
                            $scope.searchModel.zoneId = "";
                        }
                        else {
                            $scope.searchModel.zoneId = selectZoneId;
                        }
                        $scope.operate.querySwitches();
                    }
                }
//状态
                $scope.statusFilter = {
                    "id": "statusFilter",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "all",
                            "label": $scope.i18n.common_term_allStatus_value,
                            "checked": true
                        },
                        {
                            "selectId": "0",
                            "label": $scope.i18n.common_term_online_value
                        },
                        {
                            "selectId": "1",
                            "label": $scope.i18n.common_term_offline_label
                        }
                    ],
                    "change": function () {
                        var statusSelectId = $("#statusFilter").widget().getSelectedId();
                        if ("all" == statusSelectId) {
                            $scope.searchModel.status = "65535";
                        }
                        else {
                            $scope.searchModel.status = statusSelectId;
                        }
                        $scope.operate.querySwitches();
                    }
                };

//机房
                $scope.roomFilter = {
                    "id": "roomFilter",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "all",
                            "label": $scope.i18n.common_term_allRoom_label,
                            "checked": true
                        }
                    ],
                    "change": function () {
                        var id = $("#roomFilter").widget().getSelectedId();
                        if ("all" == id) {
                            $scope.searchModel.roomName = "";
                        }
                        else {
                            $scope.searchModel.roomName = id;
                        }
                        $scope.operate.querySwitches();
                    }
                };

//搜索框
                $scope.searchBox = {
                    "id": "hostSearchBox",
                    "placeholder": $scope.i18n.device_term_findSwitchOrCabinet_prom,
                    "type": "round", // round,square,long
                    "width": "270",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.nameOrRackNo = searchString;
                        $scope.operate.querySwitches();
                    }
                };
//交换机列表
                var switchTableColumns = [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "9%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.typeStr);
                        },
                        "sWidth": "8%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_model_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.product);
                        },
                        "sWidth": "10%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.common_term_managerIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "sWidth": "10%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusStr);
                        },
                        "sWidth": "6%",
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
                        "sWidth": "6%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_subrack_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subRackNo);
                        },
                        "sWidth": "6%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "",
                        "sWidth": "14%",
                        "bSortable": false}
                ];
                $scope.tableModel = {
                    "id": "switchTable",
                    "data": [],
                    "columns": switchTableColumns,
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
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "columnsDraggable": true,
                    "columnsVisibility": {
                        "activate": "click",
                        "aiExclude": $scope.cloudType == 'FUSIONSPHERE' ? [0, 9] : [0, 5, 9],
                        "bRestore": true,
                        "sRestore": $scope.i18n.common_term_restoreDefaultSet_button,
                        "buttonText": "",
                        "fnStateChange": function (index, checked) {
                        }
                    },
                    "columnSorting": [
                        [0, 'asc'],
                        [3, 'asc'],
                        [5, 'asc'],
                        [7, 'asc']
                    ],
                    "show-details": true,
                    "callback": function (evtObj) {
                        $scope.searchModel.curPage = evtObj.currentPage;
                        $scope.searchModel.recordPerPage = evtObj.displayLength;
                        $scope.operate.querySwitches();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.curPage = evtObj.currentPage;
                        $scope.searchModel.recordPerPage = evtObj.displayLength;
                        $scope.tableModel.displayLength = evtObj.displayLength;
                        $scope.operate.querySwitches();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(2)', nRow).addTitle();
                        // 名称加上跳转链接
                        var switchName = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                        var switchNameLink = $compile(switchName);
                        var switchNameScope = $scope.$new();
                        switchNameScope.name = aData.name;
                        switchNameScope.goToDetail = function () {
                            $state.go("resources.switchDetail", {"id": aData.rid, "name": aData.name});
                        }
                        var switchNameNode = switchNameLink(switchNameScope);
                        $("td:eq(0)", nRow).html(switchNameNode);

                        $scope.canChgUpLinkPorts = false;
                        $scope.canChgConnectPara = true;
                        if ($scope.right.hasDeviceOperateRight) {
                            if (0 == aData.type && aData.product != "CE12800") {
                                $scope.canChgUpLinkPorts = true;
                            }
                            if ("Mellanox SX6036" == aData.product || "Huawei E9000 XCUD" == aData.product) {
                                $scope.canChgConnectPara = false;
                            }

                            var submenus = '<span class="dropdown" style="position: static">' +
                                '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                                '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                                '<li><a tabindex="-1" ng-show = "canChgUpLinkPortsTemp" ng-click="chgUpLinkPorts()">' +$scope.i18n.device_term_modifyUplinkPort_button + '</a></li>' +
                                '<li><a tabindex="-1" ng-show = "canChgConnectParaTemp" ng-click="chgConnectParam()">' + $scope.i18n.device_term_modifyConnectPara_button + '</a></li>' +
                                '<li><a tabindex="-1"  ng-click="modifySwitchBasicInfo()">' + $scope.i18n.app_term_modifyBasicInfo_button + '</a></li>' +
                                '</ul>' +
                                '</span>';

                            var del = "<a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>&nbsp&nbsp&nbsp&nbsp";

                            var operateTemplates = "<div>" + del + submenus + "</div>";

                            var operateTmp = $compile($(operateTemplates));
                            var operateScope = $scope.$new(false);

                            operateScope.canChgUpLinkPortsTemp = $scope.canChgUpLinkPorts;
                            operateScope.canChgConnectParaTemp = $scope.canChgConnectPara;

                            operateScope.delete = function () {
                                var deleteMsg = new Message({
                                    "type": "warn",
                                    "title": $scope.i18n.common_term_confirm_label,
                                    "content": $scope.i18n.device_switch_del_info_confirm_msg,
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
                                    $scope.operate.deleteSwitch(aData.rid);
                                    deleteMsg.destroy();
                                });
                                deleteMsg.setButton("cancelBtn", function () {
                                    deleteMsg.destroy()
                                });
                                deleteMsg.show();
                            };

                            operateScope.chgConnectParam = function () {
                                var chgUpLinkPorts = new Window({
                                    "winId": "chgConnectParamWin",
                                    "title": $scope.i18n.device_term_modifyConnectPara_button,
                                    "name": aData.name,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "../src/app/business/resources/views/device/switch/chgSwitchConnectParam.html",
                                    "height": 450,
                                    "width": 600,
                                    "buttons": null
                                }).show();
                            };
                            operateScope.modifySwitchBasicInfo = function () {
                                var chgUpLinkPorts = new Window({
                                    "winId": "modifySwitchBasicInfoWin",
                                    "title": $scope.i18n.app_term_modifyBasicInfo_button,
                                    "params":aData,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "../src/app/business/resources/views/device/switch/modifySwitchBasicInfo.html",
                                    "height": 300,
                                    "width": 400,
                                    "buttons": null,
                                    "close": function () {
                                        $scope.operate.querySwitches();
                                    }

                                }).show();
                            };

                            operateScope.chgUpLinkPorts = function () {
                                var chgUpLinkPorts = new Window({
                                    "winId": "chgUpLinkPortsWin",
                                    "title": $scope.i18n.device_term_modifyUplinkPort_button,
                                    "name": aData.name,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "../src/app/business/resources/views/device/switch/chgUpLinkPorts.html",
                                    "height": 450,
                                    "width": 600,
                                    "buttons": null
                                }).show();
                            };

                            var optNode = operateTmp(operateScope);
                            $("td:last", nRow).html(optNode);
                            optNode.find('.dropdown').dropdown();

                        }
                    }
                };

                $scope.operate = {
                    //查询资源分区
                    "getZones": function () {
                        var queryConfig = constants.rest.ZONE_QUERY;
                        var deferred = camel.get({
                            url: {s: queryConfig.url, o: {"tenant_id": "1"}},
                            "userId": $rootScope.user.id
                        });
                        deferred.success(function (response) {
                            var zones = response.zones;
                            var index;
                            for (index in zones) {
                                var availableZone = {
                                    "selectId": zones[index].id,
                                    "label": zones[index].name
                                };
                                $scope.zoneFilter.values.push(availableZone);
                            }
                            setTimeout(function () {
                                $("#" + $scope.zoneFilter.id).widget().option("values", $scope.zoneFilter.values);
                            }, 1000);
                        });
                    },
                    //查询机房信息
                    "getRooms": function () {
                        //查询构造机房信息
                        var config = deviceConstants.rest.ROOM_QUERY;
                        var deferred = camel.get({
                            url: {s: config.url, o: {"start": "", "limit": "", "room_name": ""}},
                            userId: $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            var rooms = response.roomList;
                            var index;
                            for (index in rooms) {
                                var room = {
                                    "selectId": rooms[index].roomName,
                                    "label": rooms[index].roomName
                                };
                                $scope.roomFilter.values.push(room);
                            }
                            //延时一会，防止控件还没有生产
                            setTimeout(function () {
                                $("#" + $scope.roomFilter.id).widget().option("values", $scope.roomFilter.values);
                            }, 1000);
                        });
                    },

                    //查询交换机信息
                    querySwitches: function () {
                        var queryConfig = deviceConstants.rest.SWITCH_QUERY
                        var deferred = camel.post({
                                "url": queryConfig.url,
                                "type": queryConfig.type,
                                "userId": $rootScope.user.id,
                                "params": JSON.stringify($scope.searchModel)
                            }
                        )
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                for (var index in response.value) {
                                    response.value[index].roomName = response.value[index].locations[0].roomName;
                                    response.value[index].rackNo = response.value[index].locations[0].rackId;
                                    response.value[index].subRackNo = response.value[index].locations[0].subrackId;
                                    response.value[index].zoneName = response.value[index].locations[0].zoneName;
                                    response.value[index].statusStr = $scope.i18n[deviceConstants.config.SWITCH_STATUS[response.value[index].status] || response.value[index].status];
                                    response.value[index].typeStr = $scope.i18n[deviceConstants.config.SWITCH_TYPE[response.value[index].type] || response.value[index].type];
                                }
                                $scope.tableModel.data = response.value;
                                $scope.tableModel.totalRecords = response.total;
                            });
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    //删除交换机信息
                    deleteSwitch: function (id) {
                        var delConfig = deviceConstants.rest.SWITCH_DELETE;
                        var deferred = camel.delete({
                                "url": {s: delConfig.url, o: {"id": id}},
                                "type": delConfig.type,
                                "userId": $rootScope.user.id
                            }
                        )
                        deferred.done(function (response) {
                            $scope.operate.querySwitches();
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                }
//初始化资源分区和机房信息
                $scope.operate.getZones();
                $scope.operate.getRooms();
//初始化数据
                $scope.operate.querySwitches();
            }
            ]
            ;
        return switchCtrl;
    })
;


