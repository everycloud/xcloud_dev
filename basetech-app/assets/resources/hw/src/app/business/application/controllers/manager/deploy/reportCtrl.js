/**
 * 文件名：vmMonitorResourceCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-3-3
 */
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "tiny-lib/underscore",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/commonService",
    'app/business/application/services/appCommonService',
    'tiny-directives/Lineplot',
    'fixtures/appFixture'
], function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, _, http, exception, commonService, appCommonService) {
    "use strict";

    var reportCtrl = ['$scope', 'camel', "exception", "$q",
        function ($scope, camel, exception, $q) {
            var htmlScope = $("html").scope();
            var user = htmlScope.user;
            var lang = htmlScope.urlParams.lang;
            var appCommonServiceIns = new appCommonService(exception, $q, camel);

            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            var winDom = $("#viewApp_Detail_winId");
            var winWidget = winDom.widget();
            $scope.curCloudInfraId = winWidget.option("curCloudInfraId");
            $scope.curAppId = winWidget.option("curAppId");
            $scope.curVpcId = winWidget.option("curVpcId");

            $scope.cloudType = user.cloudType;

            // 当前页码信息
            $scope.page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return $scope.page.currentPage === 0 ? 0 : ($scope.page.currentPage - 1) * $scope.page.displayLength;
                }
            };

            var RESOURCE_STATUS_MAP = {
                "CREATE_IN_PROGRESS": i18n.common_term_creating_value,
                "CREATE_FAILED": i18n.common_term_createFail_value,
                "CREATE_COMPLETE": i18n.common_term_createSucceed_value,
                "RESUME_IN_PROGRESS": i18n.common_term_startuping_value,
                "RESUME_COMPLETE": i18n.common_term_startSucceed_value,
                "RESUME_FAILED": i18n.common_term_startupFail_value,
                "SUSPEND_IN_PROGRESS": i18n.common_term_stoping_value,
                "SUSPEND_COMPLETE": i18n.common_term_stopSucceed_value,
                "SUSPEND_FAILED": i18n.common_term_stopFail_value,
                "DELETE_IN_PROGRESS": i18n.common_term_deleting_value,
                "DELETE_FAILED": i18n.common_term_deleteFail_value,
                "DELETE_COMPLETE": i18n.common_term_deleteSucceed_value,
                "UPDATE_IN_PROGRESS": i18n.common_term_updating_value,
                "UPDATE_FAILED": i18n.common_term_updatFail_value,
                "UPDATE_COMPLETE": i18n.common_term_updatSucceed_value,
                "ROLLBACK_IN_PROGRESS": i18n.common_term_rollbacking_value,
                "ROLLBACK_COMPLETE": i18n.common_term_rollbackSucceed_value,
                "ROLLBACK_FAILED": i18n.common_term_rollbackFail_value,
                "signal_COMPLETE": i18n.common_term_flexSucceed_value
            };

            var RESOURCE_TYPE_MAP = {
                "VmTemplate": i18n.template_term_template_label,
                "Network": i18n.vpc_term_net_label,
                "PortGroup": i18n.common_term_portGroup_label,
                "Instance": i18n.common_term_vm_label,
                "ScalingGroup": i18n.app_term_flexGroup_label,
                "Vlb": i18n.common_term_lb_label
            };
            $scope.reportTable = {
                "id": "app-deploy-outputs",
                "enablePagination": true,
                "draggable": true,
                "displayLength": 10,
                "totalRecords": 0,
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "columnsVisibility": {
                    "activate": "click", //"mouseover"/"click"
                    "aiExclude": [0],
                    "bRestore": false,
                    "fnStateChange": function (index, state) {
                    }
                },

                "columns": [
                    {
                        "sTitle": i18n.common_term_resourceName_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_resourceType_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_status_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.state);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_createStartTime_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.beginTime);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_createEndTime_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.endTime);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_desc_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_failCause_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.reason);
                        }
                    }
                ],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                },
                "callback": function (evtObj) {
                    $scope.page.currentPage = evtObj.currentPage;
                    $scope.page.displayLength = evtObj.displayLength;
                    queryReport();
                },
                "changeSelect": function (evtObj) {
                    $scope.page.currentPage = evtObj.currentPage;
                    $scope.page.displayLength = evtObj.displayLength;
                    queryReport();
                }
            };

            $scope.reportTableICT = {
                "id": "app-deploy-outputs-ict",
                "enablePagination": true,
                "draggable": true,
                "displayLength": 10,
                "totalRecords": 0,
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "columnsVisibility": {
                    "activate": "click", //"mouseover"/"click"
                    "aiExclude": [0],
                    "bRestore": false,
                    "fnStateChange": function (index, state) {
                    }
                },

                "columns": [
                    {
                        "sTitle": i18n.common_term_resourceName_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_resourceType_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_status_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.state);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_time_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.beginTime);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_eventCause_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.reason);
                        }
                    }
                ],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                },
                "callback": function (evtObj) {
                    $scope.page.currentPage = evtObj.currentPage;
                    $scope.page.displayLength = evtObj.displayLength;
                    queryReport();
                },
                "changeSelect": function (evtObj) {
                    $scope.page.currentPage = evtObj.currentPage;
                    $scope.page.displayLength = evtObj.displayLength;
                    queryReport();
                }
            };

            function queryReport() {
                var options = {
                    "user": user,
                    "vpcId": $scope.curVpcId,
                    "id": $scope.curAppId,
                    "cloudInfraId": $scope.curCloudInfraId,
                    "start": $scope.page.getStart(),
                    "limit": $scope.page.displayLength
                };
                var deferred = appCommonServiceIns.queryReport(options);
                deferred.then(function (data) {
                    if (!data || !data.resourceDeployReports || (data.resourceDeployReports.length <= 0)) {
                        return;
                    }
                    var reports = [];
                    var tmpReport = null;
                    var tmpResourceType = null;
                    _.each(data.resourceDeployReports, function (item, index) {
                        tmpReport = {
                            "name": item.resourceName,
                            "type": null,
                            "state": RESOURCE_STATUS_MAP[item.status] || "",
                            "beginTime": commonService.utc2Local(item.createBeginTime),
                            "endTime": commonService.utc2Local(item.createEndTime),
                            "description": item.desc,
                            "resourceId": item.resourceId,
                            "reason": getFailDescription(lang, item.failedReason)
                        };
                        if (user.cloudType === "IT") {
                            tmpReport.type = RESOURCE_TYPE_MAP[item.resourceType] || "";
                        } else {
                            tmpReport.type = item.resourceType;
                        }
                        reports.push(tmpReport);
                    });

                    if ($scope.cloudType === "IT") {
                        $scope.reportTable.data = reports;
                        $scope.reportTable.displayLength = $scope.page.displayLength;
                        $scope.reportTable.totalRecords = data.total;
                    } else {
                        $scope.reportTableICT.data = reports;
                        $scope.reportTableICT.displayLength = $scope.page.displayLength;
                        $scope.reportTableICT.totalRecords = data.total;
                    }
                });
            }

            function getFailDescription(lang, failObj) {
                if (!failObj) {
                    return "";
                }
                if (lang === 'en') {
                    return failObj.en_US || "";
                } else {
                    return failObj.zh_CN || "";
                }
            }

            queryReport();
        }
    ];

    var resourcesModule = angular.module("app.list.deployReport", ['ng', 'wcc', "ngSanitize"]);
    resourcesModule.controller("app.list.deployReport.ctrl", reportCtrl);
    resourcesModule.service("camel", http);
    resourcesModule.service("exception", exception);
    return resourcesModule;
});
