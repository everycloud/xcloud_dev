define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        'app/services/validatorService',
        'tiny-widgets/Window',
        'app/services/validatorService',
        'tiny-common/UnifyValid',
        'app/business/application/services/appCommonService'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, validator, Window, validatorService, UnifyValid, appCommonService) {
        "use strict";
        var copyTemplateCtrl = ["$scope", "$compile", "camel", "exception", "$q",
            function ($scope, $compile, camel, exception, $q) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var validator = new validatorService();
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                $scope.templateId = $("#app-templateList-copyTemplate-winId").widget().option("templateId");

                $scope.name = {
                    "id": "app-templates-copy-nameId",
                    "label": i18n.common_term_name_label+":",
                    "width": "214",
                    "require": true,
                    "value": "",
                    "extendFunction": ["checkTemplateName"],
                    "tooltip": i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256"),
                    "validate": "required:"+i18n.common_term_null_valid+";maxSize(256):" + i18n.sprintf(i18n.common_term_length_valid, "1", "256") + ";checkTemplateName(true):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256")
                };

                $scope.templateLogo = {
                    "label": i18n.common_term_icon_label+":",
                    "require": true,
                    "curLogo": "buff01.jpg",
                    "options": ["buff01.jpg", "buff02.jpg", "buff03.jpg", "buff04.jpg", "buff05.jpg", "buff06.jpg", "buff07.jpg", "buff08.jpg", "buff09.jpg"],
                    "showOptions": false,
                    "change": function () {
                        $("#customCopyTemplateLogoOptionId").toggle();
                    },
                    "changeLogo": function (logo) {
                        if (logo) {
                            $scope.templateLogo.curLogo = logo;
                            $("#customCopyTemplateLogoOptionId").hide();
                        }
                    }
                };
                $scope.description = {
                    "id": "app-templates-copy-descriptionId",
                    "label": i18n.common_term_desc_label+":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": "206",
                    "height": "100",
                    "tooltip": i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                    "validate": "maxSize(1024):"+i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                };

                $scope.nextBtn = {
                    "id": "app-templates-copy-confirmId",
                    "text": i18n.common_term_copy_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#app_templates_copyTemplate_popId"));
                        if (!valid) {
                            return;
                        }

                        copyTemplate($scope.templateId);
                    }
                };

                $scope.cancelBtn = {
                    "id": "app-templates-copy-cancelId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#app-templateList-copyTemplate-winId").widget().destroy();
                    }
                };

                function copyTemplate(templateId) {
                    if (!templateId) {
                        return false;
                    }
                    var options = {
                        "user": user,
                        "id": templateId,
                        "params": {
                            "copy": {
                                "name": $("#app-templates-copy-nameId").widget().getValue(),
                                "picture": $scope.templateLogo.curLogo,
                                "vdcId": user.vdcId,
                                "desc": $("#app-templates-copy-descriptionId").widget().getValue()
                            }
                        }
                    };
                    var deferred = appCommonServiceIns.operateAppTemplate(options);
                    deferred.then(function (data) {
                        $("#app-templateList-copyTemplate-winId").widget().destroy();
                    });
                }

                $("#app_templates_copyTemplate_popId").click(function (e) {
                    var target = e.target;
                    if (!target) {
                        return false;
                    }
                    if (!$(target).hasClass("customHide")) {
                        $("#customCopyTemplateLogoOptionId").hide();
                    }
                });

                //验证模板名称
                UnifyValid.checkTemplateName = function (param) {
                    var value = $(this).val();
                    var templateNameReg = /^[\u4E00-\u9FA5 \w-]{1,256}$/;
                    return templateNameReg.test(value);
                };
            }
        ];

        var copyTemplateModule = angular.module("app.templates.copyTemplate", ['framework',"ngSanitize"]);
        copyTemplateModule.controller("app.templates.copyTemplate.ctrl", copyTemplateCtrl);
        copyTemplateModule.service("camel", http);
        copyTemplateModule.service("ecs.vm.detail.disks.validator", validator);

        return copyTemplateModule;
    }
);
