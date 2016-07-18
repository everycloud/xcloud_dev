/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-24

 */
define(['tiny-lib/angular',
    'tiny-widgets/Window',
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    'fixtures/deviceFixture'
],
    function (angulart, Window, constants, ExceptionService, deviceFixture) {
        "use strict";
        var cabinetCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', function ($scope, $compile, $state, camel, $rootScope) {

            //搜索模型
            $scope.searchModel = {
                roomName: "",
                rackName: "",
                start: 1,
                limit: 10
            };

            //搜索框
            $scope.searchBox = {
                "id": "hostSearchBox",
                "placeholder": $scope.i18n.device_term_findRoomOrCabinet_prom,
                "type": "round", // round,square,long
                "width": "300",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.roomName = searchString;
                    $scope.searchModel.rackName = searchString;
                    $scope.operate.queryCabinets();
                }
            };

            //cabinet
            var cabinetTableColumns = [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.rackName);
                    },
                    "sWidth": "14%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.device_term_room_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.roomName);
                    },
                    "sWidth": "14%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_location_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.location);
                    },
                    "sWidth": "15%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_createAt_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.createTime);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "sWidth": "15%",
                    "bSortable": false}
            ];
            $scope.cabinetTable = {
                "id": "cabinetTable",
                "data": [],
                "columns": cabinetTableColumns,
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
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operate.queryCabinets();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.cabinetTable.displayLength = evtObj.displayLength;
                    $scope.operate.queryCabinets();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    // 机柜详情
                    var cabinetName = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                    var cabinetNameLink = $compile(cabinetName);
                    var cabinetNameScope = $scope.$new();
                    cabinetNameScope.name = $.encoder.encodeForHTML(aData.rackName);
                    cabinetNameScope.goToDetail = function () {
                        var cabinetDetail = new Window({
                            "winId": "cabinetDetailWin",
                            "title": $scope.i18n.device_term_subrack_label + "-" + cabinetNameScope.name,
                            "minimizable": false,
                            "maximizable": false,
                            "content-type": "url",
                            "content": "../src/app/business/resources/views/device/cabinet/cabinetDetail.html",
                            "rackId": aData.rackId,
                            "height": 450,
                            "width": 800,
                            "buttons": null
                        }).show();

                    }
                    var cabinetNameNode = cabinetNameLink(cabinetNameScope);
                    $("td:eq(0)", nRow).html(cabinetNameNode);

                    //操作列
                    if ($scope.right.hasDeviceOperateRight) {
                        var operateTemplates = "<div><a href='javascript:void(0)' ng-click='modify()'>" + $scope.i18n.device_term_modifyCabinetInfo_button + "</a></div>";
                        var operateTmp = $compile($(operateTemplates));
                        var operateScope = $scope.$new(false);
                        operateScope.modify = function () {
                            var modifyCabinetParam = new Window({
                                "winId": "modifyCabinetParamWin",
                                "title": $scope.i18n.device_term_modifyCabinetInfo_button || "修改机柜信息",
                                "minimizable": false,
                                "maximizable": false,
                                "content-type": "url",
                                "content": "../src/app/business/resources/views/device/cabinet/modifyCabinetParam.html",
                                "data": aData,
                                "height": 300,
                                "width": 400,
                                "buttons": null,
                                "close": function () {
                                    $scope.operate.queryCabinets();
                                }
                            }).show();
                        }
                        $("td:eq(5)", nRow).html(operateTmp(operateScope));
                    }
                }
            };
            $scope.operate = {
                queryCabinets: function (params) {
                    var queryConfig = constants.rest.CABINET_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "room_name": $scope.searchModel.roomName, "rack_name": $scope.searchModel.rackName}},
                        "type": queryConfig.type,
                        "params": params,
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            $scope.cabinetTable.data = response.racks;
                            $scope.cabinetTable.totalRecords = response.total;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            //初始化
            $scope.operate.queryCabinets();
        }];

        return cabinetCtrl;
    });


