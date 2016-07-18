define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/exceptionService",
    "bootstrapui/ui-bootstrap-tpls",
    "tiny-directives/IP",
    "tiny-directives/Textbox"
],
    function ($, angular, http, UnifyValid, ValidatorService, ExceptionService, uibootstrap, IP) {
        "use strict";
        var modifyCloudInfraCtrl = ["$scope", "$compile", "camel", "validator", function ($scope, $compile, camel, validator) {
            var user = $("html").scope().user;
            var hasOperateRight = user.privilege.role_role_add_option_cloudPoolHandle_value;
            $scope.infraId = $("#modifyInfraWindowId").widget().option("infraId");
            $scope.infraType = $("#modifyInfraWindowId").widget().option("infraType");
            var exceptionService = new ExceptionService();
            var colon = ":";
            $scope.name = {
                "id": "accessConfigNameId",
                "label": $scope.i18n.common_term_name_label + colon,
                "require": true,
                "value": "",
                "type": "input",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid,{1:1, 2:256}),
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(256):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:256}),
                "readonly": false
            };

            $scope.region = {
                "id": "regionId",
                "label": $scope.i18n.common_term_section_label + colon,
                "require": true,
                "type": "input",
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid,{1:1, 2:256}),
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(256):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:256}),
                "readonly": false
            };

            var versionValue = [
                {"selectId": "1.5.0", "label": "V100R005C00", "checked": true}
            ];

            $scope.version = {
                "id": "versionId",
                "label": $scope.i18n.common_term_version_label + colon,
                "require": true,
                "type": "input",
                "values": versionValue,
                "width": 150,
                "readonly": false
            };

            $scope.provider = {
                "id": "providerId",
                "label": $scope.i18n.common_term_provider_label + colon,
                "require": false,
                "type": "input",
                "value": "",
                "readonly": false,
                "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
            };
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                return validator.ipFormatCheck(ip);
            };
            $scope.ipAddress = {
                "id": "ipAddressId",
                "width": 150,
                "require": true,
                "type": "ipv4",
                "value": "",
                "label": "IP:",
                "extendFunction": ["ipCheck"],
                "validate": "ipCheck(ipAddressId):" + $scope.i18n.common_term_formatIP_valid + ";"
            };

            $scope.port = {
                "id": "portId",
                "require": true,
                "label": $scope.i18n.common_term_port_label + colon,
                "value": "",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" +
                    $scope.i18n.common_term_invalidNumber_valid + ";maxValue(65535):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid,{1:1, 2:65535})
            };

            $scope.userName = {
                "id": "userNameId",
                "label": $scope.i18n.virtual_term_interconnectUser_label + colon,
                "require": true,
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid,{1:1, 2:128}),
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(128):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
            };

            $scope.notModifyPwd = true;
            $scope.modifyPwdCheckbox = {
                "id": "modifyPwdCheckboxId",
                "checked": false,
                "text": $scope.i18n.common_term_modifyPsw_button,
                "change": function () {
                    var checked = $("#" + $scope.modifyPwdCheckbox.id).widget().option("checked");
                    $scope.notModifyPwd = !checked;
                }
            };

            $scope.password = {
                "id": "passwordId",
                "label": $scope.i18n.common_term_psw_label + colon,
                "type": "password",
                "value": "",
                "require": true,
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(128):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
            };

            $scope.repassword = {
                "id": "repasswordId",
                "label": $scope.i18n.common_term_PswConfirm_label + colon,
                "type": "password",
                "value": "",
                "require": true,
                "extendFunction": ["infoPwdEqual"],
                "validate": "infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid + ";"
            };
            UnifyValid.infoPwdEqual = function () {
                if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.repassword.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.description = {
                "id": "descriptionId",
                "label": $scope.i18n.common_term_desc_label + colon,
                "value": "",
                "width": 300,
                "height": 60,
                "type":"multi",
                "require": false,
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:1024})
            };

            //下一步按钮
            $scope.accessConfigNextBtn = {
                "id": "accessConfigNextBtn",
                "text": $scope.i18n.common_term_modify_button,
                "display":hasOperateRight,
                "click": function () {
                    var result = UnifyValid.FormValid($("#modifyCloudInfraDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.name.value = $("#" + $scope.name.id).widget().getValue();
                    $scope.region.value = $("#" + $scope.region.id).widget().getValue();
                    $scope.port.value = $("#" + $scope.port.id).widget().getValue();
                    $scope.version.value = $("#" + $scope.version.id).widget().getSelectedId();
                    $scope.provider.value = $("#" + $scope.provider.id).widget().getValue();
                    $scope.ipAddress.value = $("#" + $scope.ipAddress.id).widget().getValue();
                    $scope.userName.value = $("#" + $scope.userName.id).widget().getValue();
                    $scope.password.value = $("#" + $scope.password.id).widget().getValue();
                    $scope.repassword.value = $("#" + $scope.repassword.id).widget().getValue();
                    $scope.description.value = $("#" + $scope.description.id).widget().getValue();

                    // 修改资源池
                    $scope.operator.modifyCloudInfra();
                }
            };
            //取消按钮
            $scope.accessConfigNextCancelBtn = {
                "id": "accessConfigNextCancelBtnId",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#modifyInfraWindowId").widget().destroy();
                }
            };

            $scope.operator = {
                "queryCloudInfra": function () {
                    var deferred = camel.get({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras/{id}",
                            "o": {
                                "tenant_id": "1",
                                "id": $scope.infraId
                            }
                        },
                        "params": {},
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            if (response) {
                                $scope.cloudInfra = response.cloudInfra;
                                $scope.name.value = $scope.cloudInfra.name;
                                $scope.region.value = $scope.cloudInfra.region;
                                $scope.port.value = $scope.cloudInfra.port;
                                $scope.version.value = $scope.cloudInfra.version;
                                $scope.provider.value = $scope.cloudInfra.provider;
                                $scope.ipAddress.value = $scope.cloudInfra.ip;
                                $scope.userName.value = $scope.cloudInfra.userName;
                                $scope.description.value = $scope.cloudInfra.description;
                            }
                        });
                    });
                },
                "modifyCloudInfra": function () {
                    var cloudInfras = {
                        "name": $("#" + $scope.name.id).widget().getValue(),
                        "region": $("#" + $scope.region.id).widget().getValue(),
                        "version": $("#" + $scope.version.id).widget().getSelectedId(),
                        "ip": $("#" + $scope.ipAddress.id).widget().getValue(),
                        "port": parseInt($("#" + $scope.port.id).widget().getValue()),
                        "userName": $("#" + $scope.userName.id).widget().getValue(),
                        "description": $("#" + $scope.description.id).widget().getValue(),
                        "provider": $("#" + $scope.provider.id).widget().getValue()
                    };
                    if(!$scope.notModifyPwd){
                        cloudInfras.password = $("#" + $scope.password.id).widget().getValue();
                    }

                    var deferred = camel.put({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras/{id}",
                            "o": {
                                "tenant_id": "1",
                                "id": $scope.infraId
                            }
                        },
                        "params": JSON.stringify(cloudInfras),
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            $("#modifyInfraWindowId").widget().destroy();
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            exceptionService.doException(response);
                        });

                    });
                }
            };

            // 页面初始化
            $scope.operator.queryCloudInfra();

        }];

        var dependency = ['ng', 'wcc','ui.bootstrap'];
        var modifyCloudInfraModule = angular.module("modifyCloudInfraModule", dependency);
        modifyCloudInfraModule.controller("modifyCloudInfraCtrl", modifyCloudInfraCtrl);
        modifyCloudInfraModule.service("camel", http);
        modifyCloudInfraModule.service("validator", ValidatorService);
        return modifyCloudInfraModule;
    });