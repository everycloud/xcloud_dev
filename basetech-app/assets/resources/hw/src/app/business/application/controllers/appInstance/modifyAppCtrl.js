define([
    "sprintf",
    'jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'app/services/httpService',
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    'app/business/application/services/appCommonService',
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, validatorService, UnifyValid, appCommonService) {
    "use strict";
    var validator = new validatorService();
    var user = $("html").scope().user;

    var modifyAppCtrl = ["$scope", "$compile", "camel", "$state", "exception", "$q",
        function ($scope, $compile, camel, $state, exception, $q) {
            $scope.curApplicationId = $("#appListModifyAppWindId").widget().option("curApplicationId");
            $scope.curCloudInfraId = $("#appListModifyAppWindId").widget().option("curCloudInfraId");
            $scope.curVpcId = $("#appListModifyAppWindId").widget().option("curVpcId");
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            $scope.name = {
                "id": "appList-modifyApp-name",
                "label": i18n.app_term_appName_label+":",
                "width": "214",
                "require": true,
                "value": "",
                "validate": "regularCheck(" + validator.appNameReg + "):"+i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256")+";"
            };

            $scope.tag = {
                "id": "appList-modifyApp-tag",
                "label": i18n.cloud_term_tag_label + ":",
                "width": "214",
                "require": false,
                "value": "",
                "validate": "maxSize(64):" + i18n.sprintf(i18n.common_term_length_valid, "0", "64") + ";"
            };

            $scope.description = {
                "id": "appList-modifyApp-description",
                "label": i18n.common_term_desc_label+":",
                "require": false,
                "value": "",
                "type": "multi",
                "width": "206",
                "height": "100",
                "validate": "maxSize(1024):"+i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
            };

            $scope.nextBtn = {
                "id": "appList-modifyApp-nextBtn",
                "text": i18n.common_term_confirm_label,
                "click": function () {
                    var valid = UnifyValid.FormValid($("#app_list_modifyApp_winId"));
                    if (!valid) {
                        return;
                    }
                    var newName = $("#appList-modifyApp-name").widget().getValue();
                    var newTag = $("#appList-modifyApp-tag").widget().getValue();
                    var newDescription = $("#appList-modifyApp-description").widget().getValue();
                    updateAppBasicInfo(newName, newTag, newDescription);
                }
            };

            $scope.cancelBtn = {
                "id": "appList-modifyApp-cancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#appListModifyAppWindId").widget().destroy();
                }
            };

            function queryAppBasicInfo(appId, cloudInfraId) {
                if (!appId) {
                    return;
                }

                var options = {
                    "user": user,
                    "id": appId,
                    "cloudInfraId": cloudInfraId,
                    "vpcId": $scope.curVpcId
                };
                var deferred = appCommonServiceIns.queryAppBasicInfoResource(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    $scope.name.value = data.appName;
                    $scope.tag.value = data.appTag;
                    $scope.description.value = data.desc;
                });
            }

            function updateAppBasicInfo(newName, newTag, newDescription) {
                var options = {
                    "vdcId": user.vdcId,
                    "id": $scope.curApplicationId,
                    "vpcId": $scope.curVpcId,
                    "cloudInfraId": $scope.curCloudInfraId,
                    "userId": user.id,
                    "data": {
                        "appName": newName,
                        "appTag": newTag,
                        "desc": newDescription
                    }
                };
                var deferred = appCommonServiceIns.updateAppInstance(options);
                deferred.then(function (data) {
                    $("#appListModifyAppWindId").widget().destroy();
                });
            }

            queryAppBasicInfo($scope.curApplicationId, $scope.curCloudInfraId);
        }
    ];

    var modifyAppModule = angular.module("app.list.modifyApp", ['framework','ngSanitize']);
    modifyAppModule.controller("app.list.modifyApp.ctrl", modifyAppCtrl);
    modifyAppModule.service("camel", http);
    modifyAppModule.service("ecs.vm.detail.disk.add.validator", validator);

    return modifyAppModule;
});
