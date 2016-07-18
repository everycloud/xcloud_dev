/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-5-12

 */
define(['jquery',
    'tiny-lib/angular',
    "bootstrapui/ui-bootstrap-tpls",
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/business/resources/controllers/constants',
    "app/services/exceptionService"],
    function ($, angular, bootstrap, UnifyValid, httpService, constants, ExceptionService) {
        "use strict";
        var configCtrl = ["$scope", 'camel', function ($scope, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.i18n = $("html").scope().i18n;
            $scope.zoneInfo = {
                "label": $scope.i18n.resource_term_currentZone_label + ":",
                "require": false,
                "zoneID": $("#operateDnatWinId").widget().option("zoneID"),
                "zoneName": $("#operateDnatWinId").widget().option("zoneName")
            };
            $scope.configRequest = {
                "zoneID": $("#operateDnatWinId").widget().option("zoneID"),
                "beginPort": "",
                "endPort": "",
                "lifeTime": ""
            };
            $scope.queryRequest = {
                "zoneID": $("#operateDnatWinId").widget().option("zoneID")
            };
            $scope.startPort = {
                label: $scope.i18n.common_term_initiativePort_label + ":",
                require: true,
                "id": "startPort",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid +
                    ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 65535}) + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 65535}),
                "width": "215",
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 65535})
            };

            $scope.endPort = {
                label: $scope.i18n.common_term_endPort_label + ":",
                require: true,
                "id": "endPort",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid +
                    ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 65535}) + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 65535}),
                "width": "215",
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 65535})
            };

            $scope.timeLimitCheckbox = {
                "text": $scope.i18n.common_term_timeLimit_label,
                "id": "timeLimit",
                "require": true,
                "checked": "false",
                "height": "28px",
                "change": function () {
                    $("#" + $scope.time.id).widget().option("disable", !$("#" + $scope.timeLimitCheckbox.id).widget().option("checked"));
                }
            };
            $scope.time = {
                label: $scope.i18n.resource_term_publicNetAccessVMdurationMin_label + ":",
                require: true,
                "disable": true,
                "id": "dnat",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid +
                    ";maxValue(2147483647):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 2147483647}) + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 2147483647}),
                "width": "215",
                "value": ""
            };

            $scope.createBtn = {
                "label": "",
                "id": "configBtn",
                "text": $scope.i18n.common_term_ok_button,
                "tooltip": "",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#operateDnatDiv"));
                    if (!valid) {
                        return;
                    }
                    // 配置公网访问虚拟机
                    $scope.configRequest.zoneID = $scope.zoneInfo.zoneID;
                    $scope.configRequest.beginPort = $("#" + $scope.startPort.id).widget().getValue();
                    $scope.configRequest.endPort = $("#" + $scope.endPort.id).widget().getValue();
                    if ($("#" + $scope.timeLimitCheckbox.id).widget().option("checked")) {
                        $scope.configRequest.lifeTime = $("#" + $scope.time.id).widget().getValue();
                    }
                    else {
                        $scope.configRequest.lifeTime = "-1";
                    }
                    $scope.config({"configRequest": $scope.configRequest});
                }
            };

            $scope.cancelBtn = {
                "id": "configCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $("#operateDnatWinId").widget().destroy();
                }
            };

            /**
             * 创建VLAN池
             */
            $scope.config = function (params) {
                var createConfig = constants.rest.DNAT_OPERATE;
                var deferred = camel.post({
                    url: {s: createConfig.url, o: {"tenant_id": "1"}},
                    type: createConfig.type,
                    params: JSON.stringify(params),
                    "userId": $rootScope.user.id
                });
                deferred.done(function (response) {
                    if (!response) {
                        $("#operateDnatWinId").widget().destroy();
                    }
                    else {
                        setTimeout(function () {
                            if (response.queryResp.beginPort > 0) {
                                $("#" + $scope.startPort.id).widget().option("value", response.queryResp.beginPort);
                            }
                            if (response.queryResp.endPort > 0) {
                                $("#" + $scope.endPort.id).widget().option("value", response.queryResp.endPort);
                            }
                            if (response.queryResp.lifeTime > 0) {
                                $("#" + $scope.timeLimitCheckbox.id).widget().option("checked", true);
                                $("#" + $scope.time.id).widget().option('value', response.queryResp.lifeTime);
                                $("#" + $scope.time.id).widget().option('disable', false);
                            }
                            else {
                                $("#" + $scope.timeLimitCheckbox.id).widget().option("checked", false);
                            }
                        }, 100);

                    }
                });
                deferred.fail(function (response) {
                    new ExceptionService().doException(response);
                });
            };
            $scope.config({"queryRequest": $scope.queryRequest});
        }];

        // 创建App
        var deps = ["ui.bootstrap"];
        var configApp = angular.module("resources.zoneResources.config", deps);
        configApp.controller("resources.zoneResources.configCtrl", configCtrl);
        configApp.service("camel", httpService);
        return configApp;
    });

