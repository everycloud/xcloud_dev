define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'app/services/httpService',
        'app/services/validatorService',
        'tiny-widgets/Window',
    "app/services/downloadService"
    ],
    function ($, angular, http, validator, Window, DownloadService) {
        "use strict";

        var copyTemplateCtrl = ["$scope", "$compile", "camel", "exception",
            function ($scope, $compile, camel, exception) {

                var downloadService = new DownloadService();

                var user = $("html").scope().user;
                var $state = $("html").injector().get("$state");
                var exportResultData = $("#app-templateList-export-winId").widget().option("exportResultData") || {};
                $scope.progress = "10%";
                $scope.style = {};

            $scope.id = $("#app-templateList-export-winId").widget().option("id");
            $scope.tips = {
                "notCompleteTip": $scope.i18n.app_app_exportTemplate_info_downing_msg || "导出中，大约需要3-5分钟，请稍候...",
                "completeTip": $scope.i18n.app_app_exportTemplate_info_down_msg || "导出完成，请下载文件。",
                "basicInfoTip": $scope.i18n.common_term_basicInfo_label || "基本信息"
            };

            $scope.name = {
                "label": $scope.i18n.common_term_name_label + ":",
                "value": ""
            };

            $scope.type = {
                "label": $scope.i18n.common_term_type_label+":",
                "value": $scope.i18n.template_term_app_label || "应用模板"
            };

            $scope.link = {
                "label": $scope.i18n.common_term_downloadLink_label + ":",
                "value": "",
                "click":function() {
                    downloadService.download({
                        name: $scope.link.value,
                        type: "export"
                    });
                }
            };

            $scope.closeBtn = {
                "id": "app-templates-templateContent-close",
                "text": $scope.i18n.common_term_close_button || "关闭",
                "tooltip": "",
                "click": function () {
                    $("#app-templateList-export-winId").widget().destroy();
                    $state.go("serviceMgr.appTemplate");
                }
            };

                function init() {
                    $scope.$apply(function () {
                        $scope.progress = exportResultData.progress;
                        $scope.link.value = exportResultData.path;
                        $scope.name.value = exportResultData.name;
                        $scope.style = exportResultData.style;
                    });
                }

                init();
            }
        ];

        var copyTemplateModule = angular.module("app.templates.export", ['framework']);
        copyTemplateModule.controller("app.templates.export.ctrl", copyTemplateCtrl);
        copyTemplateModule.service("camel", http);
        copyTemplateModule.service("ecs.vm.detail.disks.validator", validator);

        return copyTemplateModule;
    }
);