
/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-11-22

 */
define(['tiny-lib/angular',
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService"
],
    function (angular, httpService, UnifyValid, validatorService, constants, ExceptionService) {
        "use strict";
        var modifySwitchBasicInfoCtrl = ['$scope', 'validator', 'camel', function ($scope, validator, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            var roomInfo = $("#modifySwitchBasicInfoWin").widget().option("params");
            $scope.i18n = $("html").scope().i18n;
            $scope.name = {
                "id": "roomName",
                "label": $scope.i18n.common_term_name_label + ":",
                "require": "true",
                "value": roomInfo.name,
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                    $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
            };

            $scope.description = {
                "id": "roomDescription",
                "label": $scope.i18n.common_term_desc_label + ":",
                "value": roomInfo.description,
                "type": "multi",
                "height": "40px",
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
            };

            $scope.modifyBtn = {
                "id": "modifyBtn",
                "text": $scope.i18n.common_term_modify_button,
                "click": function () {
                    var params = {};
                    params.switchName = $("#" + $scope.name.id).widget().getValue();
                    params.description = $("#" + $scope.description.id).widget().getValue();

                    var result = UnifyValid.FormValid($("#midifySwitchBasicInfoDiv"));
                    if (!result) {
                        return;
                    }


                    $scope.modify(params);
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#modifySwitchBasicInfoWin").widget().destroy();
                }
            }
            $scope.modify = function (params) {
                var modifyConfig = constants.rest.SWITCH_UPDATE;
                var deferred = camel.put({
                    "url": {s: modifyConfig.url, o: {"id": roomInfo.rid}},
                    "type": modifyConfig.type,
                    "userId": $rootScope.user.id,
                    "params": JSON.stringify(params)
                });
                deferred.done(function (response) {
                    $("#modifySwitchBasicInfoWin").widget().destroy();
                });
                deferred.fail(function (response) {
                    new ExceptionService().doException(response);
                });

            }
        }];
        var dependency = ['ng', 'wcc'];
        var modifySwitchBasicInfoModule = angular.module("modifySwitchBasicInfoModule", dependency);
        modifySwitchBasicInfoModule.controller("modifySwitchBasicInfoCtrl", modifySwitchBasicInfoCtrl);
        modifySwitchBasicInfoModule.service("camel", httpService);
        modifySwitchBasicInfoModule.service("validator", validatorService);
        return modifySwitchBasicInfoModule;
    })
;
