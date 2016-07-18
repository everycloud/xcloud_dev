define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/downloadService",
    "app/business/system/services/operatorLogService"],
    function ($, angular, http, ExceptionService, MessageService, DownloadService, OperatorLogService) {
        "use strict";
        var exportCtrl = ["$scope", "$q", "camel", function ($scope, $q, camel) {
            var downloadService = new DownloadService();
            var operatorLogService = new OperatorLogService($q, camel);

            var user = $("html").scope().user;
            var lang = {zh: "zh_CN", en: "en_US"};
            var locale = lang[window.urlParams.lang];

            var exportWindow = $("#downLoadOplogWindowId").widget();
            var progressWidget;
            var colon = ":";
            var i18n = $scope.i18n || {};
            $scope.exportParams = exportWindow.option("params");
            $scope.progress = {
                "id": "progressId",
                "label": (i18n.common_term_guage_label || "进度") + colon,
                "width": "200px",
                "value": 1
            };

            $scope.exportPath = "";
            $scope.timeoutId = "";
            $scope.operator = {
                "getReport": function () {
                    var deferred = camel.post({
                        url: {
                            s: "/goku/rest/v1.5/{vdc_id}/operation-log/export",
                            o: {
                                vdc_id: $scope.exportParams.vdcId
                            }
                        },
                        userId: $scope.exportParams.userId,
                        params: JSON.stringify($scope.exportParams.params)
                    });
                    deferred.done(function (response) {
                        $scope.exportPath = response && response.exportLogPath;
                        $scope.timeoutId = window.setInterval(function () {
                            $scope.operator.getProgress();
                        }, 1000);
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response, exportWindow);
                    });
                },
                "getProgress": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/{tenant_id}/operation-log/export/status?file={file}",
                            o: {
                                "tenant_id": 1,
                                "file":$scope.exportPath
                            }
                        },
                        "monitor":false,
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
                                        name: $scope.exportPath,
                                        type: "export"
                                    });
                                    exportWindow.destroy();
                                } else if (response.exportStatus === "error") {
                                    $scope.operator.clearTimer();
                                    new MessageService().promptErrorMsgBox(i18n.common_term_downloadFail_msg || "下载失败。");
                                }
                            }
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.operator.clearTimer();
                        new ExceptionService().doException(response, exportWindow);
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
        var exportModule = angular.module("operatorLog.export", dependency);
        exportModule.controller("operatorLog.export.ctrl", exportCtrl);
        exportModule.service("camel", http);
        return exportModule;
    });
