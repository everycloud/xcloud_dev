/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-5-19

 */
define(['jquery',
    'tiny-lib/angular'],
    function ($, angular) {
        "use strict";
        var publicIpPoolDetailCtrl = ["$scope", function ($scope) {
            $scope.i18n = $("html").scope().i18n;
            $scope.data = $("#detailWin").widget().option("data").ipRangeList;
            $scope.searchModel = {
                "start": 0,
                "limit": 10
            };
            /**
             *  表格Scope
             */
            $scope.ipPoolTable = {
                data: $scope.data.slice($scope.searchModel.start, $scope.searchModel.limit),
                id: "publicIPPoolTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                curPage: {"pageIndex": 1},
                totalRecords: $scope.data.length,
                showDetails: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_initiativeIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.startIp);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_endIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.endIp);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                    $scope.$apply(function () {
                        $scope.ipPoolTable.data = $scope.data.slice($scope.searchModel.start, $scope.searchModel.limit);
                    });
                },
                changeSelect: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                    $scope.$apply(function () {
                        $scope.ipPoolTable.data = $scope.data.slice($scope.searchModel.start, $scope.searchModel.limit);
                    });
                },
                renderRow: function (row, dataitem, index) {

                }
            };
        }]

        var deps = ['ng', 'wcc'];
        var publicIpPoolDetailApp = angular.module("publicIpPoolDetailApp", deps);
        publicIpPoolDetailApp.controller("publicIpPoolDetailCtrl", publicIpPoolDetailCtrl);
        return publicIpPoolDetailApp;
    }
);



