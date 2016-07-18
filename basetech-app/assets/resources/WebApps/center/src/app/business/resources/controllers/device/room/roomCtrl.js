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
    function (angular, Window, constants, ExceptionService, deviceFixture) {
        "use strict";
        var roomCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', function ($scope, $compile, $state, camel, $rootScope) {

            //搜索模型
            $scope.searchModel = {
                name: "",
                start: 1,
                limit: 10
            };

            //搜索框
            $scope.searchBox = {
                "id": "hostSearchBox",
                "placeholder": $scope.i18n.device_term_findRoom_prom,
                "type": "round", // round,square,long
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.name = searchString;
                    $scope.operate.queryRooms();
                }
            };
            //Room列表
            var roomTableColumns = [
                {
                    "sTitle": "",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.roomId);
                    },
                    "sWidth": "3%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.roomName);
                    },
                    "sWidth": "16%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_location_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.location);
                    },
                    "sWidth": "18%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "sWidth": "18%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_createAt_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.createTime);
                    },
                    "sWidth": "18%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "sWidth": "18%",
                    "bSortable": false}
            ];
            $scope.roomTable = {
                "id": "roomTable",
                "data": [],
                "columns": roomTableColumns,
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
                "showDetails": true,
                "totalRecords": 0,
                "hideTotalRecords": false,
                "columnsDraggable": true,
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operate.queryRooms();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1) + 1;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.roomTable.displayLength = evtObj.displayLength;
                    $scope.operate.queryRooms();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr("roomName", $.encoder.encodeForHTML(aData.roomName));
                    $(nRow).attr("index", iDataIndex);
                    if ($scope.right.hasDeviceOperateRight) {
                        //操作列
                        var operateTemplates = "<div><a href='javascript:void(0)' ng-click='modify()'>" + $scope.i18n.device_term_modifyRoomInfo_button + "</a></div>";
                        var operateTmp = $compile($(operateTemplates));
                        var operateScope = $scope.$new(false);
                        operateScope.modify = function () {
                            var modifyRoomParam = new Window({
                                "winId": "modifyRoomParamWin",
                                "title": $scope.i18n.device_term_modifyRoomInfo_button || "修改机房信息",
                                "minimizable": false,
                                "maximizable": false,
                                "content-type": "url",
                                "content": "../src/app/business/resources/views/device/room/modifyRoomParam.html",
                                "data": aData,
                                "height": 300,
                                "width": 400,
                                "buttons": null,
                                "close": function () {
                                    $scope.operate.queryRooms();
                                }
                            }).show();
                        }
                        $("td:eq(5)", nRow).html(operateTmp(operateScope));
                    }
                }
            };

            $scope.operate = {
                queryRooms: function () {
                    var queryConfig = constants.rest.ROOM_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "room_name": $scope.searchModel.name}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            var newData = [];
                            for (var index in response.roomList) {
                                response.roomList[index].detail = {contentType: "url", content: "../src/app/business/resources/views/device/room/roomDetail.html"};
                                newData.push(response.roomList[index]);
                            }
                            $scope.roomTable.data = response.roomList;
                            $scope.roomTable.totalRecords = response.total;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operate.queryRooms();
        }];

        return roomCtrl;
    });


