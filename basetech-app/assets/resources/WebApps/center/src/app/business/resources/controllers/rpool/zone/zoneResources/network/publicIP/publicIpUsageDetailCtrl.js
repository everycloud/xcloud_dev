/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-5-19

 */
define(['jquery',
    'tiny-lib/angular',
    'tiny-directives/Lineplot'],
    function ($, angular, Piechart) {
        "use strict";
        var publicIpUsageDetailCtrl = ["$scope", function ($scope) {
            $scope.i18n = $("html").scope().i18n;
            $scope.data = $("#detailWin").widget().option("data");
            $scope.ipUsageData = $scope.data.usedPublicIPs
            $scope.searchModel = {
                "start": 0,
                "limit": 10
            };
            var getData = function () {
                var dataList = [];
                for (var index in $scope.data.statPublicIPUsages) {
                    var data = {
                        "label": $scope.data.statPublicIPUsages[index].usage,
                        "data": $scope.data.statPublicIPUsages[index].total / $scope.data.total * 100
                    }
                    dataList.push(data);
                }
                var data = {
                    "label": $scope.i18n.common_term_noUse_value,
                    "data": ($scope.data.total - $scope.data.usedNum) / $scope.data.total * 100
                }
                dataList.push(data);
                return dataList;
            }
            $scope.ipUsagePiechart = {
                "id": "ipUsagePiechartId",
                "width": "500px",
                "height": "300px",
                "colors": ["#2700eb", "#f2d414", "#54ccc8", "#cccccc"],
                "pieSeries": {
                    pie: {
                        show: true,
                        label: {show: true}
                    }
                },
                "data": getData(),
                "legend": {
                    show: true,
                    noColumns: 4,
                    position: 'se'
                }
            }
            /**
             *  表格Scope
             */
            $scope.ipUsageTable = {
                data: $scope.ipUsageData.slice($scope.searchModel.start, $scope.searchModel.limit),
                id: "ipUsageTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                curPage: {"pageIndex": 1},
                totalRecords: $scope.ipUsageData.length,
                showDetails: false,
                columns: [
                    {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_used_value,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.usage);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                    $scope.$apply(function () {
                        $scope.ipUsageTable.data = $scope.ipUsageData.slice($scope.searchModel.start, $scope.searchModel.limit);
                    });
                },
                changeSelect: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                    $scope.$apply(function () {
                        $scope.ipUsageTable.data = $scope.ipUsageData.slice($scope.searchModel.start, $scope.searchModel.limit);
                    });
                },
                renderRow: function (row, dataitem, index) {

                }
            };
        }]

        var deps = ['ng', 'wcc'];
        var publicIpUsageDetailApp = angular.module("publicIpUsageDetailApp", deps);
        publicIpUsageDetailApp.controller("publicIpUsageDetailCtrl", publicIpUsageDetailCtrl);
        return publicIpUsageDetailApp;
    }
)
;



