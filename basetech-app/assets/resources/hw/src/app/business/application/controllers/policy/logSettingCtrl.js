/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-directives/Button",
    "tiny-directives/Table",
    'app/services/commonService',
    'app/business/application/services/appCommonService',
    'app/business/application/services/appCommonData',
    "tiny-lib/underscore",
    "fixtures/policyConfigFixture"
], function ($, $encoder, angular, Button, Table, commonService, appCommonService, appCommonData, _) {
    "use strict";

    var logSettingCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var appCommonDataIns = new appCommonData();
            var user = $scope.user;
            var encoder = $.encoder;
            var i18n = $scope.i18n;
            $scope.search = {
                result: "",
                name: ""
            };

            //所有执行结果
            $scope.searchResult = {
                "id": "logResult",
                "width": "120",
                "values": [
                    {
                        "selectId": "",
                        "label":i18n.common_term_allRunResult_label,
                        "checked": true
                    },
                    {
                        "selectId": "SUCCESS",
                        "label": i18n.common_term_executeSucceed_value
                    },
                    {
                        "selectId": "FAILURE",
                        "label":i18n.common_term_executeFail_value
                    }
                ],
                "change": function () {
                    $scope.search.result = $("#logResult").widget().getSelectedId();
                    $scope.queryPolicyLogs($scope.currentCloudInfraId);
                }
            };

            //条件搜索下拉框
            $scope.searchBox = {
                "id": "logSearchBox",
                "placeholder":i18n.common_term_findCondition_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.search.name = searchString;
                    $scope.queryPolicyLogs($scope.currentCloudInfraId);
                }
            };
            //刷新
            $scope.refresh = {
                "id": "logRefresh",
                "click": function () {
                    $scope.queryPolicyLogs($scope.currentCloudInfraId);
                }
            };

            //帮助
            $scope.columnConfig = {
                "id": "logColumnConfig",
                "click": function () {
                }
            };

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.logListTable = {
                "id": "log-list-table",
                "paginationStyle": "full_numbers",
                "enablePagination": true,
                "showDetails": false,
                "displayLength": 10,
                "totalRecords": 0,
                "lengthMenu": [10, 20, 30],
                "draggable": true,
                "columns": [
                    {
                        "sTitle": i18n.app_term_policyName_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.policyName);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_ID_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.logId);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_createAt_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.createTime);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_updatTime_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.updateTime);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_executeResult_value,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.executionResultUI);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_desc_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.descriptionUI);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_failCause_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.faultReasonUI);
                        }
                    }

                ],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.queryPolicyLogs($scope.currentCloudInfraId);
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.queryPolicyLogs($scope.currentCloudInfraId);
                },
                "renderRow": function (nRow, aData) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                }
            };

            // 查询策略日志列表信息policyname
            $scope.queryPolicyLogs = function (cloudInfraId) {
                if (!cloudInfraId) {
                    return;
                }
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId,
                    "cloudInfraId": cloudInfraId,
                    "result": $scope.search.result,
                    "name": $scope.search.name,
                    "start": page.getStart(),
                    "limit": page.displayLength,
                    "sort": $scope.result,
                    "order": $scope.policyType
                };
                var promise = appCommonServiceIns.queryPolicyLogs(options);
                promise.then(function (data) {
                    $scope.logListTable.totalRecords = data.total;
                    $scope.logListTable.displayLength = page.displayLength;
                    $("#log-list-table").widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });

                    var policyLogs = data.policyLogs;
                    _.each(policyLogs, function (item, index) {
                        item.executionResultUI = appCommonDataIns.getPolicyExecutionResult(item.executionResult);
                        item.descriptionUI = item.description.zh_CN;
                        item.faultReasonUI = item.faultReason.zh_CN;
                        item.createTime = commonService.utc2Local(item.createTime);
                        item.updateTime = commonService.utc2Local(item.updateTime);
                    });
                    $scope.logListTable.data = policyLogs;
                });
            };
            $scope.$on("changeCloudInfraEvent", function (evt, cloudInfraId) {
                $scope.queryPolicyLogs(cloudInfraId);
            });

            $scope.$on("$viewContentLoaded", function () {
                $scope.queryPolicyLogs($scope.currentCloudInfraId);
            });
        }
    ];
    return logSettingCtrl;
});
