define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'app/services/httpService',
    'app/services/validatorService',
    'tiny-widgets/Window',
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    "./designer/framework/DesignerValid"
],
    function($, angular, http, validator, Window, validatorService, UnifyValid, DesignerValid){
        "use strict";
        var copyTemplateCtrl = ["$scope", "$compile", "camel", "exception", function($scope, $compile, camel, exception){
            var user = $("html").scope().user;
            var validator = new validatorService();
            $scope.id = $("#app-templateList-copyTemplate-winId").widget().option("templateId");

            $scope.name = {
                "id": "app-templates-copy-nameId",
                "label": $scope.i18n.common_term_templateNmae_label + ":",
                "width": "214",
                "require": true,
                "value": "",
                "tooltip": DesignerValid.validateInfo.name,
                "extendFunction": ["name"],
                "validate": DesignerValid.validateInfo.getRequiredName()
            };

            $scope.templateLogo = {
                "label": $scope.i18n.common_term_icon_label + ":",
                "require": true,
                "curLogo": "buff01.jpg",
                "options":["buff01.jpg", "buff02.jpg", "buff03.jpg", "buff04.jpg", "buff05.jpg", "buff06.jpg", "buff07.jpg", "buff08.jpg", "buff09.jpg"],
                "showOptions": false,
                "change":function(){
                    $("#customCopyTemplateLogoOptionId").toggle();
                },
                "changeLogo":function(logo){
                    if (logo){
                        $scope.templateLogo.curLogo = logo;
                        $("#customCopyTemplateLogoOptionId").hide();
                    }
                }
            };
            $scope.description = {
                "id": "app-templates-copy-descriptionId",
                "label": $scope.i18n.common_term_desc_label+":",
                "require": false,
                "value": "",
                "type": "multi",
                "width": "206",
                "height": "100",
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.nextBtn = {
                "id": "app-templates-copy-confirmId",
                "text": $scope.i18n.common_term_copy_button || "复制",
                "click": function(){
                    var valid = UnifyValid.FormValid($("#app_templates_copyTemplate_popId"));
                    if (!valid){
                        return;
                    }

                    copyTemplate($scope.id);
                }
            };

            $scope.cancelBtn = {
                "id": "app-templates-copy-cancelId",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function(){
                    $("#app-templateList-copyTemplate-winId").widget().destroy();
                }
            };

            function copyTemplate(id){
                if (!id){
                    return false;
                }
                var params = {
                    "copy":{
                        "name": $("#app-templates-copy-nameId").widget().getValue(),
                        "picture": $scope.templateLogo.curLogo,
                        "vdcId": "all",
                        "desc": $("#app-templates-copy-descriptionId").widget().getValue()
                    }
                };

                var defered = camel.post({
                    "url": {
                        "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}/actions",
                        "o": {"tenant_id": "all", "id": id}
                    },
                    "userId": user.id,
                    "params":JSON.stringify(params)
                });

                defered.success(function(data){
                    $("#app-templateList-copyTemplate-winId").widget().destroy();
                });
                defered.fail(function(data){
                    if (!exception.isException(data)){
                        exception.doFaultPopUp();
                        return;
                    }
                    exception.doException(data);
                });
            }

            $("#app_templates_copyTemplate_popId").click(function(e){
                var target = e.target;
                if (!target){
                    return false;
                }
                if (!$(target).hasClass("customHide")){
                    $("#customCopyTemplateLogoOptionId").hide();
                }
            });
        }];

        var copyTemplateModule = angular.module("app.templates.copyTemplate", ['framework']);
        copyTemplateModule.controller("app.templates.copyTemplate.ctrl", copyTemplateCtrl);
        copyTemplateModule.service("camel", http);
        copyTemplateModule.service("ecs.vm.detail.disks.validator", validator);

        return copyTemplateModule;
    }
);