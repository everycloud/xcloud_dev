define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/downloadService",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/CheckboxGroup",
    "fixtures/userFixture"
],
    function ($, angular, http, ExceptionService, MessageService, DownloadService) {
        "use strict";
        var reportDownloadCtrl = ["$scope", "camel", function ($scope, camel) {
            var user = $("html").scope().user;
            var lang = {zh: "zh_CN", en: "en_US"};
            var locale = lang[window.urlParams.lang];
            var downloadService = new DownloadService();
            var realTimeReportWindowWidget = $("#realTimeReportWindowId").widget();
            var progressWidget;
            var colon = ":";
            var i18n = $scope.i18n || {};
            $scope.reportName = realTimeReportWindowWidget.option("reportName");
            $scope.progress = {
                "id": "progressId",
                "label": (i18n.common_term_guage_label || "进度") + colon,
                "width": "200px",
                "value": 1
            };
            $scope.downloadReport = {
                "id": "downloadBtnId",
                "text": i18n.common_term_download_button || "下载",
                "url": "",
                "display": false,
                "exportReportPath": "",
                "click": function () {
                }
            };

            $scope.timeoutId = "";
            $scope.operator = {
                "getReport": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/irm/reports/asset-reports/{id}/realtime/file?locale={locale}",
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
                            $scope.downloadReport.exportReportPath = response.exportReportPath;
                            $scope.timeoutId = window.setInterval(function () {
                                $scope.operator.getProgress();
                            }, 1000);
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(response, realTimeReportWindowWidget);
                        });
                    });
                },
                "getProgress": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/irm/reports/asset-reports/{id}/realtime/file/status",
                            o: {
                                "id": $scope.reportName
                            }
                        },
                        "monitor": false,
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        progressWidget =  progressWidget || $("#" + $scope.progress.id).widget();
                        $scope.$apply(function () {
                            if (response && response.exportStatus) {
                                if (response.exportStatus === "exporting") {
                                    $scope.progress.value = response.exportProgress;
                                    progressWidget.opProgress(response.exportProgress);
                                } else if (response.exportStatus === "exported") {
                                    $scope.progress.value = response.exportProgress || 100;
                                    progressWidget.opProgress(response.exportProgress  || 100);
                                    $scope.operator.clearTimer();
                                    downloadService.download({
                                        name: $scope.downloadReport.exportReportPath,
                                        type: "export"
                                    });
                                    realTimeReportWindowWidget.destroy();
                                } else if (response.exportStatus === "error") {
                                    $scope.operator.clearTimer();
                                    new MessageService().promptErrorMsgBox(i18n.common_term_downloadFail_msg || "下载报表失败");
                                }
                            }
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            $scope.operator.clearTimer();
                            new ExceptionService().doException(response, realTimeReportWindowWidget);
                        });
                    });
                },
                "clearTimer": function () {
                    try {
                        window.clearTimeout($scope.timeoutId);
                    } catch (e) {
                    }
                }
            };

            // 初始化下载报表
            $scope.operator.getReport();

        }
        ];

        var dependency = ["ng", "wcc"];
        var reportDownloadModule = angular.module("report.reportDownload.realTimeReport", dependency);
        reportDownloadModule.controller("report.reportDownload.realTimeReport.ctrl", reportDownloadCtrl);
        reportDownloadModule.service("camel", http);
        return reportDownloadModule;
    });
