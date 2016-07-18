
/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-11-18

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
        var modifyRackBasicInfoCtrl = ['$scope', 'validator', 'camel', function ($scope, validator, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            var roomInfo = $("#modifyRackBasicInfoWin").widget().option("params");
            $scope.i18n = $("html").scope().i18n;
            $scope.name = {
                "id": "roomName",
                "label": $scope.i18n.common_term_name_label + ":",
                "require": "true",
                "value": roomInfo.chassisName,
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName4Host + "):" +
                    $scope.i18n.common_term_composition3_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})


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
                    params.chassisName = $("#" + $scope.name.id).widget().getValue();
                    params.description = $("#" + $scope.description.id).widget().getValue();
                    params.chassisId = roomInfo.chassisId;

                    var result = UnifyValid.FormValid($("#chgRackBasicInfoDiv"));
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
                    $("#modifyRackBasicInfoWin").widget().destroy();
                }
            }
            $scope.modify = function (params) {
                var modifyConfig = constants.rest.CHASSIS_UPDATE;
                var deferred = camel.put({
                    "url": modifyConfig.url,
                    "type": modifyConfig.type,
                    "userId": $rootScope.user.id,
                    "params": JSON.stringify(params)
                });
                deferred.done(function (response) {
                    $("#modifyRackBasicInfoWin").widget().destroy();
                });
                deferred.fail(function (response) {
                    new ExceptionService().doException(response);
                });

            }
        }];
        var dependency = ['ng', 'wcc'];
        var modifyRackBasicInfoModule = angular.module("modifyRackBasicInfoModule", dependency);
        modifyRackBasicInfoModule.controller("modifyRackBasicInfoCtrl", modifyRackBasicInfoCtrl);
        modifyRackBasicInfoModule.service("camel", httpService);
        modifyRackBasicInfoModule.service("validator", validatorService);
        return modifyRackBasicInfoModule;
    })
;
