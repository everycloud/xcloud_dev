define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/services/messageService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/CheckboxGroup",
        "fixtures/userFixture"
    ],
    function ($, angular, http, ExceptionService, MessageService) {
        "use strict";
        var reportDownloadCtrl = ["$scope", "camel",
            function ($scope, camel) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n || {};
                var lang = {zh: "zh_CN", en: "en_US"};
                var locale = lang[window.urlParams.lang];
                var hasOperateRight = user.privilege.role_role_add_option_reportHandle_value;
                $scope.reportName = $("#historyReportWindowId").widget().option("reportName");
                $scope.selectTip = {
                    "label": i18n.report_term_chooseReport_msg || "请选择需要下载的报表"
                };

                $scope.exportReportPath;
                $scope.reportCheckBoxGroup = {
                    "id": "reportCheckBoxGroupId",
                    "layout": "vertical",
                    "allSelect": {
                        "key": "reportAllSelectId",
                        "text": i18n.common_term_all_label || "全部",
                        "checked": false,
                        "position": "top"
                    },
                    "values": [],
                    "change": function (event) {
                        var reportNameList = $("#" + $scope.reportCheckBoxGroup.id).widget().opChecked("checked");
                        if (reportNameList && reportNameList.length > 0) {
                            $("#" + $scope.downloadBtn.id).widget().option("disable", false);
                        } else {
                            $("#" + $scope.downloadBtn.id).widget().option("disable", true);
                        }
                    }
                };

                $scope.downloadBtn = {
                    "id": "downloadBtnId",
                    "disable": true,
                    "display": hasOperateRight,
                    "text": i18n.common_term_download_button || "下载",
                    "click": function () {
                        $scope.operator.exportHistoryReport();
                    }
                };


                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": i18n.common_term_shut_button || "关闭",
                    "click": function () {
                        $("#historyReportWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "getReportList": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/irm/reports/asset-reports/{id}/files?locale={locale}",
                                o: {
                                    "id": $scope.reportName,
                                    "locale": locale
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (response && response.reportNameList) {
                                    var checkboxList = [];
                                    var reportList = response.reportNameList;
                                    for (var index in reportList) {
                                        if (reportList[index]) {
                                            var reports = (reportList[index]).split("--");
                                            var length = reports.length;
                                            if (length > 0) {
                                                var checkbox = {
                                                    "key": reportList[index],
                                                    "text": reports[length - 1],
                                                    "checked": false
                                                };
                                                checkboxList.push(checkbox);
                                            }
                                        }
                                    }
                                    $scope.reportCheckBoxGroup.values = checkboxList;
                                } else {
                                    $scope.reportCheckBoxGroup.values = [];
                                }
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    // 下载历史报表
                    "exportHistoryReport": function () {
                        var reportNameList = $("#" + $scope.reportCheckBoxGroup.id).widget().opChecked("checked");
                        if (!reportNameList || reportNameList.length === 0) {
                            new MessageService().promptErrorMsgBox(i18n.report_report_down_info_chooseReport_msg ||  "请至少选择一份报表；如果无报表，请确认是否已经启用定时报表。");
                            return;
                        }
                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/irm/reports/asset-reports/{id}/history/file",
                                o: {
                                    "id": $scope.reportName
                                }
                            },
                            "params": JSON.stringify({
                                "reportNameList": reportNameList
                            }),
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (response && response.exportReportPath) {
                                    $scope.reportUrl = "/goku/rest/v1.5/file/" + $.encoder.encodeForURL(response.exportReportPath) + "?type=export";
                                    $("#mydown").attr("src", $scope.reportUrl);
                                }
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };

                $scope.operator.getReportList();
            }
        ];

        var dependency = ["ng", "wcc"];
        var reportDownloadModule = angular.module("report.reportDownload.historyReport", dependency);
        reportDownloadModule.controller("report.reportDownload.historyReport.ctrl", reportDownloadCtrl);
        reportDownloadModule.service("camel", http);
        return reportDownloadModule;
    });
