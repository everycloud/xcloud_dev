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
    "app/services/messageService",
    "app/services/exceptionService",
    "app/services/commonService",
    "fixtures/deviceFixture"],
    function (angular, Window, Message, bootstrap, constants, deviceConstants, MessageService, ExceptionService, CommonService, deviceFixture) {
        "use strict";
        var subrackCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', function ($scope, $compile, $state, camel, $rootScope) {
            $scope.cloudType = $rootScope.user.cloudType;
            //接入机架式服务器按钮
            $scope.addRackModel = {
                "id": "addBladeHost",
                "text": $scope.i18n.device_term_connectSubrack_button,
                "focused": false,
                "click": function () {
                    $state.go("resources.addRack");
                }
            }

            //刷新按钮
            $scope.refreshModel = {
                "id": "rackRefresh",
                "click": function () {
                    $scope.operate.queryChassis();
                }
            }

            //搜索模型
            $scope.searchModel = {
                "name": "",
                "type": "",
                "zoneId": "",
                "resourceStatus": "",
                "start": 1,
                "limit": 10
            };

            $scope.zoneModel = {};
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
                        $scope.searchModel.zoneId = selectZoneId;
                    }
                    $scope.operate.queryChassis();
                }
            };

            //搜索框
            $scope.searchBox = {
                "id": "hostSearchBox",
                "placeholder": $scope.i18n.device_term_findCabinet_prom,
                "type": "round", // round,square,long
                "width": "200",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.name = searchString;
                    $scope.operate.queryChassis();
                }
            };

            //机框列表
            var subrackTableColumns = [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.chassisName);
                    },
                    "sWidth": "8%",
                    "bSortable": true},
                {
                    "sTitle": $scope.i18n.device_term_model_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.productModel);
                    },
                    "sWidth": "10%",
                    "bSortable": true},
                {
                    "sTitle": $scope.i18n.device_term_MMAip_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.smmAIP);
                    },
                    "sWidth": "10%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.device_term_MMBip_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.smmBIP);
                    },
                    "sWidth": "10%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.resource_term_zone_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.zoneName);
                    },
                    "sWidth": "8%",
                    "bSortable": false,
                    "bVisible": $scope.cloudType == 'FUSIONSPHERE'},
                {
                    "sTitle": $scope.i18n.device_term_room_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.roomName);
                    },
                    "sWidth": "10%",
                    "bSortable": true},
                {
                    "sTitle": $scope.i18n.device_term_cabinet_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.rackNo);
                    },
                    "sWidth": "10%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.device_term_subrack_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.subRackNo);
                    },
                    "sWidth": "8%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "sWidth": "8%",
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "sWidth": "11%",
                    "bSortable": false}
            ];

            $scope.subrackTableModel = {
                "id": "subrackTable",
                "data": [],
                "columns": subrackTableColumns,
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
                    [0, 'asc'],
                    [1, 'asc'],
                    [7, 'asc']
                ],
                "show-details": false,
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operate.queryChassis();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.subrackTableModel.displayLength = evtObj.displayLength;
                    $scope.operate.queryChassis();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    // 机框名称加上跳转链接
                    var rackName = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                    var rackNameLink = $compile(rackName);
                    var rackNameScope = $scope.$new();
                    rackNameScope.name = aData.chassisName;
                    rackNameScope.chassisId = aData.chassisId;
                    rackNameScope.goToDetail = function () {
                        $state.go("resources.rackDetail", {"chassisId": rackNameScope.chassisId});
                    }
                    var rackNameNode = rackNameLink(rackNameScope);
                    $("td:eq(0)", nRow).html(rackNameNode);
                    if ($scope.right.hasDeviceOperateRight) {
                        var submenus = '<span class="dropdown" style="position: static">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                            '<li><a tabindex="-1" ng-click="modify()">' + $scope.i18n.device_term_modifySMMpsw_button + '</a></li>' +
                            '<li><a tabindex="-1" ng-click="setting()">' + $scope.i18n.device_term_setBladeConnectPara_button + '</a></li>' +
                            '<li><a tabindex="-1" ng-click="modifyRackBasicInfo()">' + $scope.i18n.app_term_modifyBasicInfo_button + '</a></li>' +
                            '</ul>' +
                            '</span>';

                        //操作列
                        var operateTemplates = "<div><a class='margin-right-beautifier' href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>" +
                            submenus + "</div>";
                        var operateTmp = $compile($(operateTemplates));
                        var operateScope = $scope.$new(false);

                        operateScope.delete = function () {
                            var deleteMsg = new Message({
                                "type": "warn",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.device_blade_del_info_confirm_msg,
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
                                $scope.operate.deleteChassis(aData.chassisId);
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy()
                            });
                            deleteMsg.show();
                        };
                        operateScope.modify = function () {
                            var modifySmmPsswd = new Window({
                                "winId": "modifySmmPsswdWindow",
                                "title": $scope.i18n.device_term_modifySMMpsw_button,
                                "minimizable": false,
                                "maximizable": false,
                                "rackName": aData.chassisName,
                                "username": aData.mUserName,
                                "rackId": aData.chassisId,
                                "content-type": "url",
                                "content": "../src/app/business/resources/views/device/rack/modifySmmPsswd.html",
                                "height": 300,
                                "width": 520,
                                "buttons": null
                            }).show();
                        };
                        operateScope.modifyRackBasicInfo = function () {
                            var modifyBasicInfoWin = new Window({
                                "winId": "modifyRackBasicInfoWin",
                                "title": $scope.i18n.app_term_modifyBasicInfo_button,
                                "minimizable": false,
                                "maximizable": false,
                                "params":aData,
                                "content-type": "url",
                                "content": "../src/app/business/resources/views/device/rack/modifyRackBasicInfo.html",
                                "height": 300,
                                "width": 400,
                                "buttons": null,
                                "close": function () {
                                    $scope.operate.queryChassis();
                                }
                            }).show();

                        };
                        operateScope.setting = function () {
                            $state.go("resources.paramSetting", {"chassisId": aData.chassisId});
                        };
                        var optNode = operateTmp(operateScope);
                        $("td:last", nRow).html(optNode);
                        optNode.find('.dropdown').dropdown();
                    }
                }
            };
            //操作：

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
                queryChassis: function () {
                    var queryConfig = deviceConstants.rest.CHASSIS_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "sort_key": "", "sort_dir": "", "zoneId": $scope.searchModel.zoneId, "resourceStatus": $scope.searchModel.resourceStatus, "name": $scope.searchModel.name, "type": $scope.searchModel.type, "chassisId": ""}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            for (var index in  response.chassis) {
                                response.chassis[index].zoneName = $scope.zoneModel[response.chassis[index].zoneId];
                            }
                            $scope.subrackTableModel.data = response.chassis;
                            $scope.subrackTableModel.totalRecords = response.total;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                deleteChassis: function (chassisId) {
                    var delConfig = deviceConstants.rest.CHASSIS_DELETE;
                    var deferred = camel.delete({
                        "url": {s: delConfig.url, o: {"chassisId": chassisId}},
                        "type": delConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (data) {
                        $scope.$apply(function () {
                            $scope.operate.queryChassis();
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };
            //初始化机框数据
            $scope.operate.getZones();
            $scope.operate.queryChassis();
        }];
        return subrackCtrl;
    });


