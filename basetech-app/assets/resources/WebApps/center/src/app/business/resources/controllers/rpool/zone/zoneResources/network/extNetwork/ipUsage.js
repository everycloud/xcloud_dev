define(['tiny-lib/angular',
    'tiny-widgets/Window',
    "app/services/httpService",
    "app/services/exceptionService"
],
    function (angular, Window, httpService, ExceptionService) {
        "use strict";
        var ipUsageCtrl = ['$scope', '$compile', 'camel', function ($scope, $compile, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            var status = {'PENDING': "common_term_assigning_value", 'READY': "common_term_assignSucceed_value", 'FAIL': "common_term_assignFail_value", 'DELETING': "common_term_reclaiming_value",
                'RELEASE_FAIL': "common_term_reclaimFail_value", 'REALLOCATING': "common_term_reassigning_value"
            }
            $scope.i18n = $("html").scope().i18n;
            $scope.searchModel = {
                "networkid": $("#ipUsageInfoWin").widget().option("networkid"),
                "start": 0,
                "limit": 10
            };
            var columns = [
                {
                    "sTitle": "IP",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ip);
                    },
                    "sWidth": "30%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_usedBy_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.obj);
                    },
                    "sWidth": "40%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_assignStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "sWidth": "30%",
                    "bSortable": false}
            ];
            $scope.ipUsageTable = {
                "id": "ipUsageTable",
                "data": [],
                "columns": columns,
                "enablePagination": true,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
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
                callback: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operator.query();
                },
                changeSelect: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.ipUsageTable.displayLength = evtObj.displayLength;
                    $scope.operator.query();
                },
                "renderRow": function (nRow, aData, iDataIndex) {

                }
            }
            $scope.operator = {
                query: function () {
                    var deferred = camel.get({
                        "url": {s: "/goku/rest/v1.5/irm/{vdc_id}/vpcs/{vpcid}/privateips?networkid={networkid}&start={start}&limit={limit}",
                            o: {"vdc_id": "1", "vpcid": "-1", "start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "networkid": $scope.searchModel.networkid}},
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        var privateIPs = response.privateIPs;
                        for (var index in privateIPs) {
                            var privateIP = privateIPs[index]
                            if (privateIP.usedType == "VM") {
                                privateIP.obj = privateIP.vmName + ":" + privateIP.nicName;
                            }
                            else {
                                privateIP.obj = privateIP.usedType;
                            }
                            privateIP.statusStr = $scope.i18n[status[privateIP.status]];
                            privateIPs[index] = privateIP;
                        }
                        $scope.$apply(function () {
                            $scope.ipUsageTable.data = privateIPs;
                            $scope.ipUsageTable.total = response.total;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operator.query();
        }
        ]
        var dependency = ['ng', 'wcc'];
        var ipUsageModule = angular.module("ipUsageModule", dependency);
        ipUsageModule.controller("ipUsageCtrl", ipUsageCtrl);
        ipUsageModule.service("camel", httpService);
        return ipUsageModule;
    })
;

