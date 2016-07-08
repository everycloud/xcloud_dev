define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        'app/services/validatorService',
        'tiny-widgets/Window',
        'app/services/downloadService'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, validator, Window, downloadService) {
        "use strict";

        var copyTemplateCtrl = ["$scope", "$compile", "camel", "exception",
            function ($scope, $compile, camel, exception) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n =  $scope.i18n;
                var downloadServiceIns = new downloadService();
                var $state = $("html").injector().get("$state");
                var exportResultData = $("#app-templateList-export-winId").widget().option("exportResultData") || {};
                $scope.progress = "10%";
                $scope.style = {};

                $scope.id = $("#app-templateList-export-winId").widget().option("templateId");
                $scope.tips = {
                    "notCompleteTip": i18n.app_app_exportTemplate_info_downing_msg,
                    "completeTip": i18n.app_app_exportTemplate_info_down_msg,
                    "basicInfoTip": i18n.common_term_setBasicInfo_label
                };

                $scope.name = {
                    "label": i18n.common_term_name_label+":",
                    "value": ""
                };

                $scope.type = {
                    "label": i18n.common_term_type_label+":",
                    "value": i18n.template_term_app_label
                };

                $scope.link = {
                    "label": i18n.common_term_download_button+":",
                    "value": ""
                };

                $scope.closeBtn = {
                    "id": "app-templates-templateContent-close",
                    "text": i18n.common_term_shut_button,
                    "tooltip": "",
                    "click": function () {
                        $("#app-templateList-export-winId").widget().destroy();
                        $state.go("application.manager.template");
                    }
                };

                $scope.download = function(){
                    downloadServiceIns.download({
                        "name": $scope.link.value,
                        "type": "export"
                    });
                };

                function init() {
                    $scope.$apply(function () {
                        $scope.progress = exportResultData.progress;
                        $scope.link.value = exportResultData.path;
                        $scope.name.value = exportResultData.templateName;
                        $scope.style = exportResultData.style;
                    });
                }

                init();
            }
        ];

        var copyTemplateModule = angular.module("app.templates.export", ['framework',"ngSanitize"]);
        copyTemplateModule.controller("app.templates.export.ctrl", copyTemplateCtrl);
        copyTemplateModule.service("camel", http);
        copyTemplateModule.service("ecs.vm.detail.disks.validator", validator);

        return copyTemplateModule;
    }
);
