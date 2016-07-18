/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-24

 */
define(['tiny-lib/angular',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function (angular, Window, Message, constants, deviceConstants, ExceptionService, deviceFixture) {
        "use strict";
        var sanCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', '$stateParams', function ($scope, $compile, $state, camel, $rootScope, $stateParams) {
            $scope.zoneId = $stateParams.id;
            $scope.cloudType = $rootScope.user.cloudType;
            $scope.isLocal = $scope.deployMode === "local";
            //表格数据
            $scope.sanData = {};
            //接入SAN设备按钮
            $scope.addSanDeviceModel = {
                "id": "addSan",
                "text": $scope.i18n.device_term_connectSAN_button,
                "focused": false,
                "click": function () {
                    $state.go("resources.addSan");
                }
            };

            //搜索模型
            $scope.searchModel = {
                "name": "",
                "zoneId": $scope.zoneId || "",
                "devStatus": "65535",
                "limit": 10,
                "offset": 1
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
                    var selectZoneId = $("#" + $scope.zoneFilter.id).widget().getSelectedId();
                    if ("all" == selectZoneId) {
                        $scope.searchModel.zoneId = ""
                    }
                    else {
                        $scope.searchModel.zoneId = selectZoneId
                    }
                    $scope.operate.querySans();
                }
            };

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
                        "selectId": "-1",
                        "label": $scope.i18n.common_term_offline_label
                    },
                    {
                        "selectId": "2",
                        "label": $scope.i18n.common_term_trouble_label
                    }
                ],
                "change": function () {
                    var selectStatusId = $("#" + $scope.statusFilter.id).widget().getSelectedId();
                    if ("all" == selectStatusId) {
                        $scope.searchModel.devStatus = "65535"
                    }
                    else {
                        $scope.searchModel.devStatus = selectStatusId
                    }
                    $scope.operate.querySans();
                }
            };
            //搜索框
            $scope.searchBox = {
                "id": "sanSearchBox",
                "placeholder": $scope.i18n.device_term_findSAN_prom,
                "type": "round", // round,square,long
                "width": "220",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.name = searchString;
                    $scope.operate.querySans();
                }
            };
            //SAN列表
            var sanTableColumns = [
                {
                    "sTitle": $scope.i18n.alarm_term_alarm_label,
                    "mData": "",
                    "sWidth": "5%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "6%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_managerIP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ip);
                    },
                    "sWidth": "14%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.device_term_model_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.product);
                    },
                    "sWidth": "16%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.devStatusStr);
                    },
                    "sWidth": "8%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.resource_term_zone_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.zoneName);
                    },
                    "sWidth": "10%",
                    "bSortable": false,
                    "bVisible": $scope.cloudType == 'FUSIONSPHERE'},
                {
                    "sTitle": $scope.i18n.device_term_room_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.roomName);
                    },
                    "sWidth": "8%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.device_term_cabinet_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.rackName);
                    },
                    "sWidth": "8%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.device_term_subrack_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.subRackName);
                    },
                    "sWidth": "8%",
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "sWidth": "8%",
                    "bSortable": false}
            ];

            $scope.sanTableModel = {
                "id": "sanTable",
                "data": [],
                "columns": sanTableColumns,
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
                    "aiExclude": $scope.cloudType == 'FUSIONSPHERE' ? [1, 9] : [1, 5, 9],
                    "bRestore": true,
                    "sRestore": $scope.i18n.common_term_restoreDefaultSet_button,
                    "buttonText": "",
                    "fnStateChange": function (index, checked) {
                    }
                },
                "columnSorting": [],
                "callback": function (evtObj) {
                    $scope.searchModel.offset = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.sanTableModel.curPage = evtObj.currentPage;
                    $scope.operate.querySans();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.offset = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.sanTableModel.curPage = evtObj.currentPage;
                    $scope.sanTableModel.displayLength = evtObj.displayLength;
                    $scope.operate.querySans();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(2)', nRow).addTitle();
                    if (aData.alarmInfo) {
                        if (aData.alarmInfo.staticType.critical > 0) {
                            var alarmStr = "<div class='alarm-icon alarm-0 pointer' ng-click='goToAlarm()'></div>";
                            var alarmTmp = $compile($(alarmStr));
                            var alarmScope = $scope.$new(false);
                        }
                        else if (aData.alarmInfo.staticType.major > 0) {
                            var alarmStr = "<div class='alarm-icon alarm-1 pointer' ng-click='goToAlarm()'></div>";
                            var alarmTmp = $compile($(alarmStr));
                            var alarmScope = $scope.$new(false);
                        }
                        else if (aData.alarmInfo.staticType.minor > 0) {
                            var alarmStr = "<div class='alarm-icon alarm-2 pointer' ng-click='goToAlarm()'></div>";
                            var alarmTmp = $compile($(alarmStr));
                            var alarmScope = $scope.$new(false);
                        }
                        else if (aData.alarmInfo.staticType.warning > 0) {
                            var alarmStr = "<div class='alarm-icon alarm-3 pointer' ng-click='goToAlarm()'></div>";
                        }
                        else {
                            var alarmStr = "";
                        }
                        var alarmTmp = $compile($(alarmStr));
                        var alarmScope = $scope.$new(false);
                        alarmScope.goToAlarm = function () {
                            $state.go("monitor.alarmlist", {"resourceid": aData.urn, moc: "", "alarmtype": 1});
                        }
                        $("td:eq(0)", nRow).html(alarmTmp(alarmScope));
                    }
                    if ($scope.right.hasDeviceOperateRight) {
                        var operateTemplates = "<div><a class='margin-right-beautifier' href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button +
                            "</a></div>";
                        var operateTmp = $compile($(operateTemplates));
                        var operateScope = $scope.$new(false);
                        operateScope.delete = function () {
                            var deleteMsg = new Message({
                                "type": "warn",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.device_san_del_info_confirm_msg,
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
                                $scope.operate.deleteSan(aData.sn);
                                deleteMsg.destroy();
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy()
                            });
                            deleteMsg.show();
                        };
                        $("td:last", nRow).html(operateTmp(operateScope));
                    }
                }
            }

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
                            var availableZone = {
                                "selectId": zones[index].id,
                                "label": zones[index].name
                            };
                            $scope.zoneFilter.values.push(availableZone);
                        }
                        $("#" + $scope.zoneFilter.id).widget().option("values", $scope.zoneFilter.values);
                    });
                },
                querySans: function () {
                    var queryConfig = deviceConstants.rest.SAN_QUERY;
                    var deferred = camel.post({
                        "url": queryConfig.url,
                        "type": queryConfig.type,
                        "params": JSON.stringify($scope.searchModel),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var sans = response.storages;
                        var alarmParams = [];
                        for (var index in sans) {
                            sans[index].devStatusStr = $scope.i18n[deviceConstants.config.SAN_STATUS[sans[index].devStatus.toString()]];
                            var alarmParam = {"staticType": ["critical", "major", "minor", "warning"],
                                "staticCond": {"moc": "ipsan", "objectId": sans[index].urn}};
                            alarmParams.push(alarmParam);
                        }
                        $scope.sanData.sans = sans;
                        $scope.sanData.total = response.total;
                        $scope.$apply(function () {
                            $scope.sanTableModel.data = $scope.sanData.sans;
                            $scope.sanTableModel.totalRecords = $scope.sanData.total;
                        })
                        if ($scope.sanTableModel.data.length > 0) {
                            $scope.operate.getAlarm({"conditionList": alarmParams});
                        }
                    });
                },
                //删除SAN设备
                deleteSan: function (id) {
                    var deleteConfig = deviceConstants.rest.SAN_DELETE
                    var deferred = camel.delete({
                        "url": {s: deleteConfig.url, o: {"id": id}},
                        "type": deleteConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (data) {
                        $scope.operate.querySans();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "getAlarm": function (params) {
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
                        var alarms = response.value;
                        for (var index in alarms) {
                            $scope.sanData.sans[index].alarmInfo = alarms[index];
                        }
                        $("#" + $scope.sanTableModel.id).widget().option("data", $scope.sanData.sans);
                    })
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };
            //初始化表格数据
            $scope.operate.querySans();
            //资源分区
            $scope.operate.getZones();
        }];
        return sanCtrl;
    }
);

