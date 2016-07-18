/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-27

 */
define(['tiny-lib/angular',
    'tiny-widgets/Window',
    "app/services/httpService",
    "app/services/exceptionService",
    'app/business/resources/controllers/device/constants'
],
    function (angular, Window, httpService, ExceptionService, constants) {
        "use strict";
        var roomDetailCtrl = ['$scope', '$compile', 'camel', function ($scope, $compile, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.i18n = $("html").scope().i18n;
            var cabinetTableColumns = [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.rackName);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_location_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.location);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "sWidth": "30%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_createAt_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.createTime);
                    },
                    "sWidth": "30%",
                    "bSortable": false}
            ];
            $scope.cabinetTable = {
                "id": "cabinetTable",
                "data": [],
                "columns": cabinetTableColumns,
                "enablePagination": false,
                "requestConfig": {
                    "enableRefresh": false,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "hideTotalRecords": true,
                "columnsDraggable": true,
                "renderRow": function (nRow, aData, iDataIndex) {
                    // 机框名称加上跳转链接
                    var cabinetName = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                    var cabinetNameLink = $compile(cabinetName);
                    var cabinetNameScope = $scope.$new();
                    cabinetNameScope.name = aData.rackName;
                    cabinetNameScope.goToDetail = function () {
                        var cabinetDetail = new Window({
                            "winId": "cabinetDetailWin",
                            "title": cabinetNameScope.name,
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
                }
            }
            $scope.operate = {
                queryData: function (roomName) {
                    var config = constants.rest.CABINET_QUERY_BY_ROOM;
                    var deferred = camel.get({
                        "url": {s: config.url, o: {"room_name": roomName, "start": "", "limit": "", "sort": "", "order": ""}},
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            $scope.cabinetTable.data = response.rackList;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
        }]
        var dependency = ['ng', 'wcc'];
        var roomDetailModule = angular.module("roomDetailModule", dependency);
        roomDetailModule.controller("roomDetailCtrl", roomDetailCtrl);
        roomDetailModule.service("camel", httpService);
        return roomDetailModule;
    })
;


