/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-2-22

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
        var modifyCabinetParamCtrl = ['$scope', 'validator', 'camel', function ($scope, validator, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            var cabinetInfo = $("#modifyCabinetParamWin").widget().option("data");
            $scope.i18n = $("html").scope().i18n;
            $scope.name = {
                "id": "cabinetName",
                "label": $scope.i18n.common_term_name_label + ":",
                "require": "true",
                "value": cabinetInfo.rackName,
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                    $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
            };

            $scope.location = {
                "id": "cabinetLocation",
                "label": $scope.i18n.common_term_location_label + ":",
                "value": cabinetInfo.location,
                "validate": "maxSize(256):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 256})
            };

            $scope.description = {
                "id": "cabinetDescription",
                "label": $scope.i18n.common_term_desc_label + ":",
                "value": cabinetInfo.description,
                "type": "multi",
                "height": "40px",
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
            };

            $scope.creationTime = {
                "id": "creationTime",
                "label": $scope.i18n.common_term_createAt_label + ":",
                "value": cabinetInfo.createTime
            };

            $scope.modifyBtn = {
                "id": "modifyBtn",
                "text": $scope.i18n.common_term_modify_button,
                "click": function () {
                    var params = {};
                    params.rackName = $("#" + $scope.name.id).widget().getValue();
                    params.location = $("#" + $scope.location.id).widget().getValue();
                    params.description = $("#" + $scope.description.id).widget().getValue();
                    $scope.modify(params);
                }
            },
                $scope.cancelBtn = {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyCabinetParamWin").widget().destroy();
                    }
                }
            $scope.modify = function (params) {
                var modifyConfig = constants.rest.CABINET_UPDATE;
                var deferred = camel.put({
                    "url": {s: modifyConfig.url, o: {"id": cabinetInfo.rackId}},
                    "type": modifyConfig.type,
                    "userId": $rootScope.user.id,
                    "params": JSON.stringify(params)
                });
                deferred.done(function (response) {
                    $("#modifyCabinetParamWin").widget().destroy();
                });
                deferred.fail(function (response) {
                    new ExceptionService().doException(response);
                });

            }
        }];
        var dependency = ['ng', 'wcc'];
        var modifyCabinetParamModule = angular.module("modifyCabinetParamModule", dependency);
        modifyCabinetParamModule.controller("modifyCabinetParamCtrl", modifyCabinetParamCtrl);
        modifyCabinetParamModule.service("camel", httpService);
        modifyCabinetParamModule.service("validator", validatorService);
        return modifyCabinetParamModule;
    });
