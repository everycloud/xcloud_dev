/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-1-27

 */
define(['tiny-lib/angular',
    "app/business/resources/controllers/device/constants",
    "app/services/httpService",
    "app/services/exceptionService"
],
    function (angular, deviceConstants, httpService, ExceptionService) {
        "use strict";
        var cabinetDetailCtrl = ['$scope', '$compile', 'camel', function ($scope, $compile, camel) {
                var $state = $("html").injector().get("$state");
                var $rootScope = $("html").injector().get("$rootScope");
                var rackId = $("#cabinetDetailWin").widget().option("rackId");
                $scope.i18n = $("html").scope().i18n;
                $scope.searchModel = {
                    "start": 1,
                    "limit": 10
                }
                var tableColumns = [
                    {
                        "sTitle": $scope.i18n.common_term_name_label || "名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.devName);
                        },
                        "sWidth": "25%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.device_term_model_label || "型号",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.devModel);
                        },
                        "sWidth": "25%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.i18n.common_term_type_label || "类型",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.devTypeStr);
                        },
                        "sWidth": "25%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_subrack_label || "机框",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.frameId);
                        },
                        "sWidth": "25%",
                        "bSortable": false}
                ];
                $scope.deviceTable = {
                    "id": "deviceTableId",
                    "data": [],
                    "columns": tableColumns,
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
                        $scope.operate.queryDevice();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // 设备详情
                        if (aData.devType == 1 || aData.devType == 2 || aData.devType == 3) {
                            var deviceName = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                            var deviceNameLink = $compile(deviceName);
                            var deviceNameScope = $scope.$new();
                            deviceNameScope.name = $.encoder.encodeForHTML(aData.devName);
                            deviceNameScope.goToDetail = function () {
                                switch (aData.devType) {
                                    case '1':
                                        $state.go("resources.rackDetail", {"chassisId": aData.devId});
                                        break;
                                    case '2':
                                        $state.go("resources.hostDetail.summary", {"hostId": aData.devId, "type": "server", "serverType": aData.serverType});
                                        break;
                                    case '3':
                                        $state.go("resources.switchDetail", {"id": aData.uhmId, "name": aData.devName});
                                        break;
                                    default:
                                        break;
                                }
                                $("#cabinetDetailWin").widget().destroy();
                            }
                            var deviceNameNode = deviceNameLink(deviceNameScope);
                            $("td:eq(0)", nRow).html(deviceNameNode);
                        }
                    }
                };
                $scope.operate = {
                    "queryDevice": function (cabinetName) {
                        var queryConfig = deviceConstants.rest.DEVICE_QUERY;
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"id": rackId, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "sort": "", "order": ""}},
                            "userId": $rootScope.user.id
                        });
                        deferred.success(function (response) {
                            var data = response.deviceList;
                            for (var index in data) {
                                data[index].devTypeStr = $scope.i18n[deviceConstants.config.RACK_DEVICE_TYPE[data[index].devType] || data[index].devType];
                            }
                            $scope.$apply(function () {
                                $scope.deviceTable.data = data;
                            });
                        });
                    }
                };
                $scope.operate.queryDevice($scope.cabinetName);
            }
            ]
            ;
        var dependency = ['ng', 'wcc'];
        var cabinetDetailModule = angular.module("cabinetDetailModule", dependency);
        cabinetDetailModule.controller("cabinetDetailCtrl", cabinetDetailCtrl);
        cabinetDetailModule.service("camel", httpService);
        return cabinetDetailModule;
    })
;

