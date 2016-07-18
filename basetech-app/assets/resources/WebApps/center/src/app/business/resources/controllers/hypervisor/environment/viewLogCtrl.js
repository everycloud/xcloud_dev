/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService",
    "language/irm-rpool-exception"
], function ($,angular, httpService, Exception,irmException) {
    "use strict";
    var viewLogCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#viewLogWindow").widget();
            var eid = window.option("eid");
            var objectTypes = {
                0: $scope.i18n.common_term_updatError_value,
                1: $scope.i18n.virtual_term_cluster_label,
                2: $scope.i18n.common_term_host_label,
                3: "dvs",
                4: $scope.i18n.resource_term_storagePool_label,
                5: $scope.i18n.template_term_vm_label
            };

            $scope.logTable = {
                "id": "viewLogTable",
                "data": null,
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_objectType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.objecttype);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_addNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.message.addnum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_updatNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.message.modifynum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_deleteNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.message.removenum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_updatTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTimeStr);
                        },
                        "bSortable": false,
                        "sWidth": 170
                    },
                    {
                        "sTitle": $scope.i18n.common_term_updatResult_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.result);
                        },
                        "bSortable": false,
                        "sWidth": 170
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(5)', nRow).addTitle();
                }
            };
            function getLog() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/updateLogs", o: {id: eid}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var logs = data.logs;
                    for (var i = 0; i < logs.length; i++) {
                        logs[i].createTimeStr = (logs[i].createtime && logs[i].createtime !== "")?
                            new Date(logs[i].createtime).format('yyyy-MM-dd hh:mm:ss'):"";
                        logs[i].objecttype = objectTypes["" + logs[i].objecttype];
                        if (logs[i].result == "0") {
                            logs[i].result = $scope.i18n.common_term_success_value;
                        }
                        else{
                            logs[i].result = irmException && irmException[logs[i].result] && irmException[logs[i].result].desc || "";
                        }
                    }
                    $scope.$apply(function () {
                        $scope.logTable.data = logs;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getLog();
        }];

    var viewLogModule = angular.module("resources.hypervisor.environmentLog", ["ng", 'framework']);
    viewLogModule.service("camel", httpService);
    viewLogModule.controller("resources.hypervisor.viewLog.ctrl", viewLogCtrl);
    return viewLogModule;
});