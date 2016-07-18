/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-1-18

 */
define(['tiny-lib/angular',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "app/services/messageService",
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    'fixtures/deviceFixture'
],
    function (angular, Window, Message, MessageService, constants, deviceConstants, ExceptionService, deviceFixture) {
        "use strict";
        var balanceCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', function ($scope, $compile, $state, camel, $rootScope) {
            $scope.connectModel = {
                "id": "connectSwitch",
                "text": $scope.i18n.device_term_connectLB_button,
                "focused": false,
                "connectSwitch": function () {
                    $state.go("resources.addLoadBalancer");
                }
            };

            $scope.zoneModel = {};

            //刷新
            $scope.refreshModel = {
                "id": "hostRefresh",
                "click": function () {
                    $scope.operate.query();
                }
            }

            //搜索模型
            $scope.searchModel = {
                "deviceName": "",
                "zoneId": "",
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
                    var selectZoneId = $("#zoneFilter").widget().getSelectedId();
                    if ("all" == selectZoneId) {
                        $scope.searchModel.zoneId = "";
                    }
                    else {
                        $scope.searchModel.zoneId = $("#zoneFilter").widget().opLabel(selectZoneId);
                    }
                    $scope.operate.query();
                }
            };

            //搜索框
            $scope.searchBox = {
                "id": "hostSearchBox",
                "placeholder": $scope.i18n.device_term_findLB_prom,
                "type": "round", // round,square,long
                "width": "220",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.deviceName = searchString;
                    $scope.operate.query();
                }
            };

            //负载均衡列表
            var balanceTableColumns = [
                {
                    "sTitle": "",
                    "sWidth": "3%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.deviceName);
                    },
                    "bSortable": false,
                    "sWidth": "6%"},
                {
                    "sTitle": $scope.i18n.common_term_managerIP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.deviceIp);
                    },
                    "bSortable": false,
                    "sWidth": "8%"},
                {
                    "sTitle": $scope.i18n.common_term_runningStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "bSortable": false,
                    "sWidth": "8%"},
                {
                    "sTitle": $scope.i18n.common_term_linkStatus_value,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.linkStatusStr);
                    },
                    "bSortable": false,
                    "sWidth": "8%"},
                {
                    "sTitle": $scope.i18n.resource_term_zone_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.zoneName);
                    },
                    "bSortable": false,
                    "sWidth": "8%"},
                {
                    "sTitle": $scope.i18n.common_term_version_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.software);
                    },
                    "bSortable": false,
                    "sWidth": "8%"},
                {
                    "sTitle": $scope.i18n.common_term_pairIP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.peerIp);
                    },
                    "bSortable": false,
                    "sWidth": "8%"},
                {
                    "sTitle": $scope.i18n.device_term_room_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.roomName);
                    },
                    "bSortable": false,
                    "sWidth": "6%"},
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "bSortable": false,
                    "sWidth": "10%"}
            ];
            $scope.tableModel = {
                "id": "loadBalanceTable",
                "data": [],
                "columns": balanceTableColumns,
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
                    "aiExclude": [0, 11],
                    "bRestore": true,
                    "sRestore": $scope.i18n.common_term_restoreDefaultSet_button,
                    "buttonText": "",
                    "fnStateChange": function (index, checked) {
                    }
                },
                "showDetails": {
                    "colIndex": 0,
                    "domPendType": "append"
                },
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operate.query();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.tableModel.displayLength = evtObj.displayLength;
                    $scope.operate.query();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr("index", iDataIndex);
                    $(nRow).attr("hardware", $.encoder.encodeForHTML(aData.hardware));
                    $(nRow).attr("rack", $.encoder.encodeForHTML(aData.rackName));
                    $(nRow).attr("subrack", $.encoder.encodeForHTML(aData.subRackName));
                    $(nRow).attr("description", $.encoder.encodeForHTML(aData.description));



                    if ($scope.right.hasDeviceOperateRight) {
                        var operateTemplates = "<div><a href='javascript:void(0)' style='margin-right:10px; width:auto' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>" +
                            "<a href='javascript:void(0)' ng-click='chgConnectParam()'>" + $scope.i18n.device_term_modifyConnectPara_button + "</a></div>";
                        var operateTmp = $compile($(operateTemplates));
                        var operateScope = $scope.$new(false);

                        operateScope.delete = function () {
                            var deleteMsg = new Message({
                                "type": "warn",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.common_term_delConfirm_msg,
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
                                $scope.operate.delete(aData.deviceId);
                                deleteMsg.destroy();
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy()
                            });
                            deleteMsg.show();
                        };
                        operateScope.chgConnectParam = function () {
                            var chgConnectParam = new Window({
                                    "winId": "chgConnectParamWin",
                                    "title": $scope.i18n.device_term_modifyConnectPara_button,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "../src/app/business/resources/views/device/balance/chgLbConnectParam.html",
                                    "data": aData,
                                    "height": 450,
                                    "width": 600,
                                    "buttons": null,
                                    "close": function () {
                                        $scope.operate.query();
                                    }
                                }
                            ).show();

                        };
                        var optNode = operateTmp(operateScope);
                        $("td:last", nRow).html(optNode);
                    }
                }
            }

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
                query: function () {
                    var queryConfig = deviceConstants.rest.LOAD_BALANCER_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zone_id": $scope.searchModel.zoneId, "device_name": $scope.searchModel.deviceName, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            var data = response.lbList;
                            for (var index in data) {
                                data[index].statusStr = $scope.i18n[deviceConstants.config.LOAD_BALANCER_STATUS[data[index].status]] || data[index].status;
                                data[index].linkStatusStr = $scope.i18n[deviceConstants.config.LOAD_BALANCER_LINK_STATUS[data[index].linkStatus]] || data[index].linkStatus;
                                data[index].detail = {
                                    contentType: "url",
                                    content: "../src/app/business/resources/views/device/balance/balanceDetail.html"
                                };
                            }
                            $scope.tableModel.data = data;
                            $scope.tableModel.totalRecords = response.total;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                delete: function (id) {
                    var delConfig = deviceConstants.rest.LOAD_BALANCER_DELETE;
                    var deferred = camel.delete({
                        "url": {s: delConfig.url, o: {"id": id}},
                        "type": delConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (data) {
                        $scope.$apply(function () {
                            $scope.operate.query();
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };
            //初始化机框数据
            $scope.operate.getZones();
            $scope.operate.query();

        }];
        return balanceCtrl;
    })
;


