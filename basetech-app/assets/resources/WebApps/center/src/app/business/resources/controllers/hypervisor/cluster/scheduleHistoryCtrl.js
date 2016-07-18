/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"],
    function ($, angular, Exception) {
        "use strict";

        var scheduleHistoryCtrl = ["$scope", "$compile", "camel", "$stateParams", function ($scope, $compile, camel, $stateParams) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            var clusterId = $stateParams.clusterId;

            var reasons = {
                LB_CPU:  $scope.i18n.virtual_term_schedulCauseCPU_value || "均衡CPU",
                LB_MEMORY: $scope.i18n.virtual_term_schedulCauseMem_value || "均衡内存",
                RULES: $scope.i18n.virtual_term_schedulCauseAdjustRule_value || "调整规则",
                OVERLOAD: $scope.i18n.virtual_term_schedulCauseHostOverload_value || "主机过载",
                UNDERLOAD: $scope.i18n.virtual_term_schedulCauseHostVacancy_value || "主机轻载"
            };

            $scope.refresh = function () {
                getData();
            };
            //查询信息
            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            //调度建议列表
            $scope.historyTable = {
                "id": "scheduleHistoryTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columnSorting": [],
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.operation);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_adviceStartTime_label || "建议生成时间",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_adviceRunTime_label || "建议执行时间",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.applyTime);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_adviceCompleteTime_label || "建议完成时间",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.finishedTime);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_cause_label || "原因",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.reasonStr);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getData();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.historyTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.historyTable.displayLength = pageInfo.displayLength;
                    getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                }
            };
            function getData() {
                var params = {
                    start: searchInfo.start,
                    limit: searchInfo.limit
                };
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drsmigrations", o: {id: clusterId}},
                    "params": params,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var history = data.drsMigrations || [];
                    for (var i = 0; i < history.length; i++) {
                        var vmName = history[i].vmRecommendation.vmName ? history[i].vmRecommendation.vmName : " ";
						history[i].operation = $scope.i18n.sprintf($scope.i18n.vm_vm_migrate_info_path_label,
							{1:vmName, 2:history[i].vmRecommendation.sourceHostName,3:history[i].vmRecommendation.destinationHostName});
                        history[i].reasonStr = reasons[history[i].reason] || history[i].reason;
                    }
                    $scope.$apply(function () {
                        $scope.historyTable.totalRecords = data.total || history.length;
                        $scope.historyTable.data = history;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getData();
        }];
        return scheduleHistoryCtrl;
    }
);
