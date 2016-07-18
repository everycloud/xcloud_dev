/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-2-13

 */
define(['tiny-lib/angular',
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/business/resources/services/device/host/hostService",
    "app/services/httpService",
    "tiny-directives/FormField",
    "tiny-directives/Checkbox",
    "tiny-directives/Button",
    "tiny-directives/IP"
],
    function (angular, UnifyValid, ValidatorService, HostService, http) {
        "use strict";
        var chgAccParamCtrl = ['$scope', '$q', 'camel', function ($scope, $q, camel) {
                var hostService = new HostService($q, camel);
                var validatorService = new ValidatorService();

                var $chgAccParamWindow = $("#chgAccParamWindow");
                var chgAccParamWindowWidget = $chgAccParamWindow.widget();
                var params = chgAccParamWindowWidget.option("params");
                $scope.writeManageInfo = false;

                var user = $("html").scope().user;
                $scope.i18n = $("html").scope().i18n;

                UnifyValid.checkConfirmPwd = function (ids) {
                    var ids = ids[0] || ids;
                    var idsArr = ids.split(",")
                    var id = idsArr[0];
                    var confirmId = idsArr[1];
                    var pwd = $("#" + id).widget().getValue();
                    var confirmPwd = $("#" + confirmId).widget().getValue();
                    return pwd === confirmPwd;
                };
                UnifyValid.checkIpFormat = function (id) {
                    var id = id[0] || id;
                    var ip = $("#" + id).widget().getValue();
                    return validatorService.ipFormatCheck(ip);
                };
                //不能包含不能包含特殊字符：| ; $ & > <
                UnifyValid.bmcStr = function (id) {
                    var str = $("#" + id).widget().getValue();
                    if (str.match(/^((?![;|\||\&|\$|\>|\<]).)*$/)) {
                        return true;
                    }
                    else {
                        return $scope.i18n.common_term_noSpecialCharacter2_valid;
                    }
                };

                $scope.name = {
                    "id": "hostName",
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": false,
                    "value": params.serverName
                };

                $scope.bmcInfo = {
                    bmcInfoCheckbox: {
                        "id": "bmcInfoCheckbox",
                        "checked": "true",
                        "text": $scope.i18n.device_term_IPMIpara_label,
                        "height": "27px",
                        "change": function () {
                            var changeWidgetDisabled = function (disabled) {
                                $("#bmcIp").widget().setDisable(disabled);
                                $("#bmcUserName").widget().option("disable", disabled);
                                $("#bmcPwd").widget().option("disable", disabled);
                                $("#cfmBmcPwd").widget().option("disable", disabled);
                            };
                            changeWidgetDisabled(!$("#bmcInfoCheckbox").widget().option("checked"));
                        }
                    },

                    bmcIp: {
                        "label": "BMC IP:",
                        "require": "true",
                        "id": "bmcIp",
                        "type": "ipv4",
                        "value": params.bmcIp,
                        "width": "150px",
                        "extendFunction": ["checkIpFormat"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";checkIpFormat(bmcIp):" + $scope.i18n.common_term_formatIP_valid
                    },
                    bmcUser: {
                        "label": $scope.i18n.common_term_userName_label + ":",
                        "require": "true",
                        "id": "bmcUserName",
                        "value": params.bmcUserName,
                        "extendFunction": ["bmcStr"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                            + ";bmcStr(bmcUserName)"

                    },
                    bmcPwd: {
                        "label": $scope.i18n.common_term_psw_label + ":",
                        "require": "true",
                        "id": "bmcPwd",
                        "type": "password",
                        "value": "",
                        "extendFunction": ["bmcStr"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                            + ";bmcStr(bmcPwd)"
                    },
                    cfmBmcPwd: {
                        "label": $scope.i18n.common_term_PswConfirm_label + ":",
                        "require": "true",
                        "id": "cfmBmcPwd",
                        "type": "password",
                        "value": "",
                        "extendFunction": ["checkConfirmPwd"],
                        "validate": "checkConfirmPwd(bmcPwd,cfmBmcPwd):" + $scope.i18n.common_term_pswDifferent_valid
                    }
                };

                $scope.buttonGroup = {
                    okBtn: {
                        "id": "okBtn",
                        "text": $scope.i18n.common_term_ok_button,
                        "click": function () {
                            if (UnifyValid.FormValid($("#chgAccParamWindow"))) {
                                var data = {
                                    bmcIp: $("#bmcIp").widget().getValue(),
                                    bmcUserName: $("#bmcUserName").widget().getValue(),
                                    bmcPassword: $("#bmcPwd").widget().getValue()
                                };
                                var promise = hostService.modifyHostParams({
                                    userId: $("html").scope().user.id,
                                    id: params.uhmServerId,
                                    params: JSON.stringify(data)
                                });
                                promise.then(function (resolvedValue) {
                                    chgAccParamWindowWidget.destroy();
                                });
                            }
                        }
                    },
                    cancelBtn: {
                        "id": "cancelBtn",
                        "text": $scope.i18n.common_term_cancle_button,
                        "click": function () {
                            chgAccParamWindowWidget.destroy();
                        }
                    }
                };
            }
            ]
            ;
        var dependency = ['ng', 'wcc'];
        var chgAccParamModule = angular.module("chgAccParamModule", dependency);
        chgAccParamModule.controller("chgAccParamCtrl", chgAccParamCtrl);
        chgAccParamModule.service("camel", http);
        return chgAccParamModule;
    });
