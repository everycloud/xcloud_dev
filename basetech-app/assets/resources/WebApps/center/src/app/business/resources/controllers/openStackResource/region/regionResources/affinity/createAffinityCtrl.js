/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/services/validatorService",
    'tiny-common/UnifyValid',
    "app/services/exceptionService"],
    function ($, angular, httpService, validatorService, UnifyValid, exceptionService) {
        "use strict";
        var createAffinityCtrl = ["$scope", "camel", "validator", function ($scope, camel, validator) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var exceptionSer = new exceptionService();
            var window = $("#createAffinityWindow").widget();
            var affinityId = window.option("affinityId");
            var tokenId = window.option("tokenId");
            var projectId = window.option("projectId");
            var novaId = window.option("novaId");

            //名称输入框
            $scope.nameTextbox = {
                "label": $scope.i18n.common_term_name_label+":",
                "require": true,
                "id": "createNameTextbox",
                "value": "",
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(128):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"})+
                    ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition2_valid
            };
            //类型单选组
            $scope.typeRadioGroup = {
                "id": "createTypeRadioGroup",
                "values": [
                    {
                        "key": "affinity",
                        "text": $scope.i18n.common_term_affinity_value,
                        "checked": true,
                        "disable":!!affinityId
                    },
                    {
                        "key": "inffinity",
                        "text": $scope.i18n.common_term_unAffinity_value,
                        "checked": false,
                        "disable":!!affinityId
                    }
                ],
                "layout": "horizon"
            };

            //描述输入框
            $scope.descTextbox = {
                "label": $scope.i18n.common_term_desc_label+":",
                "require": false,
                "id": "createDescTextbox",
                "value": "",
                "height": "50px",
                "type": "multi",
                "validate": "maxSize(1024):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"0":"0","2":"1024"})+";"
            };
            //下一步按钮
            $scope.okButton = {
                "id": "createOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#createAffinityDiv"));
                    if (!result) {
                        return;
                    }
                    if(affinityId){
                        editAffinity();
                    }
                    else{
                        createAffinity();
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "createCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };

            function getAffinity(affinityId) {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group/{affinityId}",
                        o: {novaId: novaId, projectId: projectId,affinityId:affinityId}
                    },
                    "params": null,
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {
                        var affinity = data && data.affinity_group;
                        $("#" + $scope.nameTextbox.id).widget().option("value", affinity.name);
                        $("#" + $scope.typeRadioGroup.id).widget().opChecked(affinity.type,true);
                        $("#" + $scope.descTextbox.id).widget().option("value", affinity.description);
                        $scope.isDescEmpty = !affinity.description || affinity.description === "";
                    });
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }
            function createAffinity() {
                var params = {
                    "os-affinity-group": {
                        "name": $("#" + $scope.nameTextbox.id).widget().getValue(),
                        "description": $("#" + $scope.descTextbox.id).widget().getValue(),
                        "type": $("#" + $scope.typeRadioGroup.id).widget().opChecked("checked")
                    }
                };
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group",
                        o: {novaId: novaId, projectId: projectId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }
            function editAffinity() {
                var description = $("#" + $scope.descTextbox.id).widget().getValue();
                var params = {
                    "os-affinity-group": {
                        "name": $("#" + $scope.nameTextbox.id).widget().getValue()
                    }
                };
                if(!$scope.isDescEmpty || (description && description !== "")){
                    params["os-affinity-group"].description = description;
                }
                var deferred = camel.put({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group/{affinityId}",
                        o: {novaId: novaId, projectId: projectId,affinityId:affinityId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }
            if(affinityId){
                getAffinity(affinityId);
            }
        }];

        var createAffinityApp = angular.module("resources.regionResources.createAffinity", []);
        createAffinityApp.service("camel", httpService);
        createAffinityApp.service("validator", validatorService);
        createAffinityApp.controller("resources.regionResources.createAffinity.ctrl", createAffinityCtrl);
        return createAffinityApp;
    });