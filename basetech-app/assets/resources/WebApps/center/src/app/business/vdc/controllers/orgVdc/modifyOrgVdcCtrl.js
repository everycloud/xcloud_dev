/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/httpService",
        "app/services/exceptionService",
        "tiny-common/UnifyValid",
        "app/services/validatorService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/userFixture"
    ],
    function ($, angular, http, ExceptionService, UnifyValid, ValidatorService) {
        "use strict";
        var modifyQuotaCtrl = ["$scope", "camel", "validator",
            function ($scope, camel, validator) {
                var user = $("html").scope().user;
                $scope.i18n = $("html").scope().i18n;
                $scope.id = $("#modifyOrgVdcWindowId").widget().option("orgVdcId");
                $scope.name = {
                    "id": "createOrgNameId",
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false,
                    "tooltip": validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "20"}),
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(20):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "20"}) +
                        ";regularCheck(" + validator.orgNameRe + "):" + $scope.i18n.common_term_composition2_valid
                };
                $scope.description = {
                    "id": "createOrgDescId",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 400,
                    "height": 60,
                    "readonly": false,
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
                };

                $scope.cpuUpperLimit = {
                    "id": "cpuUpperLimitId",
                    "label":($scope.i18n.vm_term_cpuMaxGHz_label || "CPU上限(GB)") + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 256000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 256000) +
                        ";maxValue(256000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 256000)
                };
                $scope.memoryUpperLimit = {
                    "id": "memoryUpperLimitId",
                    "label": ($scope.i18n.vm_term_memoryMaxGB_label || "内存上限(GB)") + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 192000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 192000) +
                        ";maxValue(192000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 192000)
                };
                $scope.storageUpperLimit = {
                    "id": "storageUpperLimitId",
                    "label": ($scope.i18n.vm_term_storageMaxGB_label || "存储上限(GB)") + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000) +
                        ";maxValue(512000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000)
                };
                $scope.eipNumber = {
                    "id": "eipNumberId",
                    "label": "公网IP上限（个）:",
                    "require": false,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(0):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535) +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535)
                };
                $scope.hardwareFirewallNumber = {
                    "id": "hardwareFirewallId",
                    "label": "硬件虚拟防火墙上限（个）:",
                    "require": false,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(0):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535) +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535)
                };
                $scope.softwareFirewallNumber = {
                    "id": "softwareFirewallId",
                    "label": "软件虚拟防火墙上限（个）:",
                    "require": false,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(0):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535) +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535)
                };

                $scope.modifyBtn = {
                    "id": "modifOrgVdcBtnId",
                    "text": $scope.i18n.common_term_save_label,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#modifyOrgVdc"));
                        if (!result) {
                            return;
                        }
                        $scope.operator.modifyOrgVdc();
                    }
                };
                $scope.cancelBtn = {
                    "id": "modifyOrgVdcCancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyOrgVdcWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "getOrgVdc": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/irm/org-vdc/{id}",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if(!response || !response.orgVdc){
                                    return;
                                }
                                var orgVdc = response.orgVdc;
                                $("#" + $scope.name.id).widget().option("value", orgVdc.name);
                                $("#" + $scope.description.id).widget().option("value", orgVdc.description);
                                $("#" + $scope.cpuUpperLimit.id).widget().option("value", orgVdc.cpuLimit);
                                $("#" + $scope.memoryUpperLimit.id).widget().option("value", orgVdc.memLimit);
                                $("#" + $scope.storageUpperLimit.id).widget().option("value", orgVdc.storageLimit);
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "modifyOrgVdc": function () {
                        $scope.cpuUpperLimit.value = parseInt($("#" + $scope.cpuUpperLimit.id).widget().getValue(), 10);
                        $scope.memoryUpperLimit.value = parseInt($("#" + $scope.memoryUpperLimit.id).widget().getValue(), 10);
                        $scope.storageUpperLimit.value = parseInt($("#" + $scope.storageUpperLimit.id).widget().getValue(), 10);
                        var para = {
                            "name": $("#" + $scope.name.id).widget().getValue(),
                            "description": $("#" + $scope.description.id).widget().getValue(),
                            "cpuLimit": parseInt($scope.cpuUpperLimit.value, 10),
                            "memLimit": parseInt($scope.memoryUpperLimit.value, 10),
                            "storageLimit": parseInt($scope.storageUpperLimit.value, 10)
                        };
                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/irm/org-vdc/{id}",
                                o: {
                                    "id": $scope.id
                                }},
                            "params": JSON.stringify({"orgVdc":para}),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $("#modifyOrgVdcWindowId").widget().destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };
                $scope.operator.getOrgVdc();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.modifyOrgVdc", dependency);
        app.controller("userMgr.org.modifyOrgVdc.ctrl", modifyQuotaCtrl);
        app.service("camel", http);
        app.service("validator", ValidatorService);
        return app;
    });
