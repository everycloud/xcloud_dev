/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-12

 */
define(['tiny-lib/angular',
    "tiny-common/UnifyValid",
    "app/services/httpService",
    'app/services/validatorService',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService"
],
    function (angular, UnifyValid, httpService, validatorService, constants, ExceptionService) {
        "use strict";
        var modifyVlanPoolCtrl = ['$scope', 'camel', 'validator', function ($scope, camel, validator) {
            var $rootScope = $("html").injector().get("$rootScope");
            var id = $("#modifyVlanPoolWin").widget().option("vlanPoolId");
            var name = $("#modifyVlanPoolWin").widget().option("name");
            var description = $("#modifyVlanPoolWin").widget().option("description");
            $scope.i18n = $("html").scope().i18n;
            $scope.zoneInfo = {
                "label": $scope.i18n.resource_term_currentZone_label + ":",
                "require": false,
                "zoneName": $("#modifyVlanPoolWin").widget().option("zoneName")
            };

            $scope.modifyInfo = {
                "name": "",
                "description": ""
            };

            $scope.name = {
                "id": "vlanPoolName",
                "require": "true",
                label: $scope.i18n.common_term_name_label + ":",
                "value": name,
                "width": "215px",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.name + "):" +
                    $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "tooltip": $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "tipPosition": "right"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label + ":",
                "require": "false",
                "id": "vlanPoolDesc",
                "value": description,
                "type": "multi",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tipPosition": "right",
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "height": "40px",
                "width": "215px"
            };

            $scope.modifyBtn = {
                "id": "modifyBtn",
                "text": $scope.i18n.common_term_modify_button,
                "click": function () {
                    //校验
                    var result = UnifyValid.FormValid($("#modifyVlanPoolDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.modifyInfo.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.modifyInfo.description = $("#" + $scope.description.id).widget().getValue();
                    $scope.operate.update($scope.modifyInfo);
                    $("#modifyVlanPoolWin").widget().destroy();
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#modifyVlanPoolWin").widget().destroy();
                }
            };
            $scope.operate = {
                update: function (params) {
                    var updateConfig = constants.rest.VLAN_POOL_UPDATE;
                    var deferred = camel.put({
                        "url": {s: updateConfig.url, o: {"id": id}},
                        "params": JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#vlanPoolRefresh_id").click();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };

        }];
        var dependency = ['ng', 'wcc'];
        var modifyVlanPoolModule = angular.module("modifyVlanPoolModule", dependency);
        modifyVlanPoolModule.controller("modifyVlanPoolCtrl", modifyVlanPoolCtrl);
        modifyVlanPoolModule.service("camel", httpService);
        modifyVlanPoolModule.service("validator", validatorService);
        return modifyVlanPoolModule;
    });

