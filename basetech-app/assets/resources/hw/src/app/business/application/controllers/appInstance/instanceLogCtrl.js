/**
 * Created on 14-2-24.
 */
define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "app/services/commonService",
    "app/business/application/services/appCommonService",
    "tiny-lib/underscore",
    "bootstrap/bootstrap.min",
    "fixtures/appFixture"
], function ($, encoder, angular, Window, commonService, appCommonService, _, bootstrap) {
    "use strict";

    var ctrl = ["$scope", "$compile", "camel", "$q", "exception", "appCommonData",
        function ($scope, $compile, camel, $q, exception, appCommonData) {
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var user = $("html").scope().user;
            var cloudInfraId = appCommonData.cloudInfraId;
            var vpcId = appCommonData.vpcId;
            var appId = appCommonData.appId;
            $scope.appName = appCommonData.appName;

            if (!$("html").scope().urlParams) {
                $("html").scope().urlParams = {};
            }
            var lang = $("html").scope().urlParams.lang;
            var i18n = $scope.i18n;

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            var searchString = "";
            var status = "";

            var OPERATE_NAME_MAP = {
                "CREATE_APP": i18n.app_term_createApp_button,
                "START_APP": i18n.common_term_turnOnApp_button,
                "STOP_APP": i18n.app_term_stopApp_button,
                "DELETE_APP": i18n.app_term_del_button,
                "MODIFY_APP": i18n.app_term_modifyApp_button,
                "SCALLING_APP": i18n.app_term_elasticApp_label,
                "SCALEOUT": i18n.common_term_expanding_button,
                "SCALEIN": i18n.common_term_capacityReduction_button,
                "REPAIR_APP": i18n.app_term_restoreApp_button,
                "MODIFY_SCALINGGROUP": i18n.app_term_modifyFlexGroup_button,
                "MODIFY_VM_APP": i18n.app_term_modifyVM_button,
                "MODIFY_SCALINGPOLICY": i18n.app_term_modifyIntraPolicy_button,
                "START_SCALINGPOLICY": i18n.app_term_enableIntraPolicy_button,
                "STOP_SCALINGPOLICY": i18n.app_term_disableIntraPolicy_button,
                "ADD_SCALINGPOLICY": i18n.app_term_addIntraPolicy_button,
                "DELETE_SCALINGPOLICY": i18n.app_term_delIntraPolicy_button
            };

            var STATUS_MAP = {
                "SUCCESS": i18n.common_term_success_value,
                "FAILED": i18n.common_term_fail_label,
                "PROCESSING": i18n.common_term_processing_value
            };

            $scope.refresh = {
                "id": "app_apps_refreshId",
                "tips": i18n.common_term_fresh_button,
                "click": function () {
                    queryAppLog();
                }
            };

            //所有级别下拉框
            $scope.searchLevel = {
                "id": "appLogStatusSelect",
                "dftLabel": i18n.common_term_allStatus_value,
                "width": "100",
                "values": [{
                    "checked": true,
                    "selectId": "",
                    "label": i18n.common_term_allStatus_value
                }, {
                    "selectId": "SUCCESS",
                    "label": i18n.common_term_success_value
                }, {
                    "selectId": "FAILED",
                    "label": i18n.common_term_fail_label
                }, {
                    "selectId": "PROCESSING",
                    "label": i18n.common_term_processing_value
                }],
                "change": function () {
                    status = $("#appLogStatusSelect").widget().getSelectedId();
                    queryAppLog();
                }
            };

            $scope.logTable = {
                "id": "logTable-listtable",
                "paginationStyle": "full_numbers",
                "showDetails": true,
                "displayLength": 10,
                "enablePagination": true,
                "lengthMenu": [10, 20, 30],
                "totalRecords": 0,
                "columns": [{
                    "sTitle": i18n.common_term_operationDesc_label,
                    "sWidth": "11%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    }
                }, {
                    "sTitle": i18n.common_term_status_label,
                    "sWidth": "11%",
                    "bSortable": true,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.state);
                    }
                }, {
                    "sTitle": i18n.common_term_operationBy_label,
                    "sWidth": "11%",
                    "bSortable": true,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.operator);
                    }
                }, {
                    "sTitle": i18n.common_term_startTime_label,
                    "sWidth": "11%",
                    "bSortable": true,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.startTime);
                    }
                }, {
                    "sTitle": i18n.common_term_updatTime_label,
                    "sWidth": "11%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.updateTime);
                    }
                }, {
                    "sTitle": i18n.common_term_detailInfo_label,
                    "sWidth": "11%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.detailInfo);
                    }
                }, {
                    "sTitle": i18n.common_term_failCause_label,
                    "sWidth": "11%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.reason);
                    }
                }],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                },
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryAppLog();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryAppLog();
                }
            };

            function queryAppLog() {
                var options = {
                    "user": user,
                    "appId": appId,
                    "cloudInfraId": cloudInfraId,
                    "status": status,
                    "limit": page.displayLength,
                    "start": page.getStart(),
                    "vpcId": vpcId
                };
                var deferred = appCommonServiceIns.queryAppLog(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }

                    var newAppLogData = [];
                    if (!data.appLogs || (data.appLogs.length <= 0)) {
                        $scope.logTable.data = newAppLogData;
                        $scope.logTable.displayLength = page.displayLength;
                        $scope.logTable.totalRecords = 0;
                        return;
                    }

                    var tmpLog = null;
                    _.each(data.appLogs, function (item, index) {
                        tmpLog = {};
                        tmpLog.description = OPERATE_NAME_MAP[item.operationType] || "";
                        tmpLog.state = STATUS_MAP[item.status] || "";
                        tmpLog.operator = item.userId;
                        tmpLog.startTime = commonService.utc2Local(item.operationTime);
                        tmpLog.updateTime = commonService.utc2Local(item.operationUpdateTime);
                        tmpLog.reason = getFailDetail(item.failReason);
                        tmpLog.detailInfo = getDetail(item.detail);
                        newAppLogData.push(tmpLog);
                    });
                    $scope.logTable.data = newAppLogData;
                    $scope.logTable.displayLength = page.displayLength;
                    $scope.logTable.totalRecords = data.total;
                });
            }

            function getDetail(detail) {
                if (!detail) {
                    return "";
                }
                if (lang === "en") {
                    return detail.EN || "";
                } else {
                    return detail.CH || "";
                }
            }

            function getFailDetail(fail) {
                if (!fail) {
                    return "";
                }
                if (lang === "en") {
                    return fail.EN || "";
                } else {
                    return fail.CH || "";
                }
            }

            $scope.$on("$viewContentLoaded", function () {
                queryAppLog();
            });
        }
    ];
    return ctrl;
});
