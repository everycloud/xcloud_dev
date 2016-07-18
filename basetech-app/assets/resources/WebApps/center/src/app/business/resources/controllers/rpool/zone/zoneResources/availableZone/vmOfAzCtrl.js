/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Select",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Select, Window, Message, httpService, UnifyValid, Exception) {
        "use strict";

        var vmOfAzCtrl = ["$scope", "$compile", "$state", "camel", "validator", function ($scope, $compile, $state, camel, validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#vmOfAzWindow").widget();
            var azId = window.option("azId");
            var statuses = {
                running:$scope.i18n.common_term_running_value,
                stopped:$scope.i18n.common_term_stoped_value,
                hibernated:$scope.i18n.common_term_hibernated_value,
                creating:$scope.i18n.common_term_creating_value,
                create_failed:$scope.i18n.common_term_createFail_value,
                create_success:$scope.i18n.common_term_createSucceed_value,
                starting:$scope.i18n.common_term_startuping_value,
                stopping:$scope.i18n.common_term_stoping_value,
                migrating:$scope.i18n.common_term_migrating_value,
                shutting_down:$scope.i18n.common_term_deleting_value,
                fault_resuming:$scope.i18n.common_term_trouble_label,
                hibernating:$scope.i18n.common_term_hibernating_value,
                rebooting:$scope.i18n.common_term_restarting_value,
                pause:$scope.i18n.common_term_pause_value,
                recycling:$scope.i18n.common_term_reclaiming_value,
                unknown:$scope.i18n.common_term_unknown_value
            };
            var searchInfo = {
                "start": 0,
                "limit": 10
            };

            $scope.vmTable = {
                "id": "vmOfAzTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 30],
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmVisibleId);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_IP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_host_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hostName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_cluster_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clusterName);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (pageInfo) {
                    searchInfo.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getData();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.vmTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.vmTable.displayLength = pageInfo.displayLength;
                    getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).attr("title",aData.id);
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                }
            };
            function getData() {
                var params = {
                    "detail": 2,
                    "offset": searchInfo.start,
                    "limit": searchInfo.limit,
                    "availableZoneId": azId,
                    "queryVmInsystem":true,
                    "needAllVm":true
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/list",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var vms = data.vmInfoList || [];
                    for (var i = 0; i < vms.length; i++) {
                        vms[i].statusStr = statuses[vms[i].status] || vms[i].status;
                        vms[i].ip = "";
                        if (vms[i].vmConfig && vms[i].vmConfig.nics) {
                            for (var j = 0; j < vms[i].vmConfig.nics.length; j++) {
                                if (j === 0) {
                                    vms[i].ip = vms[i].ip + vms[i].vmConfig.nics[j].ip;
                                }
                                else {
                                    vms[i].ip = vms[i].ip + ";" + vms[i].vmConfig.nics[j].ip;
                                }
                            }
                        }
                    }
                    $scope.$apply(function () {
                        $scope.vmTable.totalRecords = data.total;
                        $scope.vmTable.data = vms;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getData();
        }];

        var vmOfAzApp = angular.module("vmOfAzApp", ['framework']);
        vmOfAzApp.service("camel", httpService);
        vmOfAzApp.controller("resources.zone.vmOfAz.ctrl", vmOfAzCtrl);
        return vmOfAzApp;
    }
);