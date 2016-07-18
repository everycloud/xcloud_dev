/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-5-16

 */
define(['tiny-lib/angular',
    'tiny-widgets/Checkbox',
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/messageService",
    'app/business/resources/controllers/constants',
    "language/irm-rpool-exception"
],
    function (angular, Checkbox, UnifyValid, httpService, MessageService, constants, Exception) {
        "use strict";
        var allocationInfoCtrl = ['$scope', 'camel', function ($scope, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.searchModel = {
                "multicastippoolid": $("#allocationInfoWin").widget().option("multicastippoolid"),
                "start": 0,
                "limit": 10
            };
            $scope.allocationTable = {
                data: [],
                id: "allocationTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                columns: [
                    {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "VXLAN ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vxlan);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "分配时间",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.allocateTime);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operate.query();
                },
                changeSelect: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operate.query();
                },
                renderRow: function (row, dataitem, index) {
                }
            };

            $scope.operate = {
                //查询分配使用情况
                query: function () {
                    var queryConfig = constants.rest.MULTICAST_IPPOOLS_ALLOCATION
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"multicastippoolid": $scope.searchModel.multicastippoolid, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        //查询数据
                        $scope.$apply(function () {
                            $scope.allocationTable.data = response.multicastIPs;
                            $scope.allocationTable.totalRecords = response.total;
                        });

                    })
                }
            };
            $scope.operate.query();

        }];
        var dependency = ['ng', 'wcc'];
        var allocationInfoModule = angular.module("allocationInfoModule", dependency);
        allocationInfoModule.controller("allocationInfoCtrl", allocationInfoCtrl);
        allocationInfoModule.service("camel", httpService);
        return allocationInfoModule;
    });



