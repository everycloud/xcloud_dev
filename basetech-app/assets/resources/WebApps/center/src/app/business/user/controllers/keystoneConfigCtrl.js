/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-3-20
 */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/exceptionService",
        "tiny-common/UnifyValid",
        'tiny-widgets/Message',
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "fixtures/userFixture"
    ],
    function ($, angular, ExceptionService, UnifyValid, Message) {
        "use strict";
        var keystoneCtrl = ["$scope", "$stateParams", "$state", "camel", "validator", "$window",
            function ($scope, $stateParams, $state, camel, validator, $window) {
                // 标识是否已经配置keystone
                var user = $("html").scope().user;
                $scope.hasKeystoneOperateRight = user.privilege.role_role_add_option_keystoneHandle_value;
                var colon = ":";
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.noConfig = true;
                $scope.url = {
                    "id": "urlId",
                    "label": "Keystone URL:",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                };
                $scope.defaultProject = {
                    "id": "defaultProjectId",
                    "label": "Default Project:",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                };
                $scope.name = {
                    "id": "keystoneNameId",
                    "label": $scope.i18n.common_term_userName_label + colon,
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                };
                $scope.password = {
                    "id": "pwdId",
                    "label": $scope.i18n.common_term_psw_label + colon,
                    "require": true,
                    "value": "",
                    "type": "password",
                    "disabled": false,
                    "readonly": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                };
                $scope.confirmPassword = {
                    "id": "confirmPwdId",
                    "label": $scope.i18n.common_term_PswConfirm_label + colon,
                    "require": true,
                    "value": "",
                    "type": "password",
                    "readonly": false,
                    "disable": true,
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid + ";"
                };
                UnifyValid.infoPwdEqual = function () {
                    if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.confirmPassword.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.saveBtn = {
                    "id": "saveBtn_id",
                    "text": $scope.i18n.common_term_save_label,
                    "save": function () {
                        var result = UnifyValid.FormValid($("#keystoneConfig"));
                        if (!result) {
                            return;
                        }
                        var params = {
                            "configInfo": {
                                "url": $("#" + $scope.url.id).widget().getValue(),
                                "userName": $("#" + $scope.name.id).widget().getValue(),
                                "password": $("#" + $scope.password.id).widget().getValue(),
                                "projectName": $("#" + $scope.defaultProject.id).widget().getValue()
                            }
                        };
                        var deferred;
                        // 根据是否已经配置过，决定请求类型
                        if ($scope.noConfig) {
                            deferred = camel.post({
                                url: "/goku/rest/v1.5/system/cloud-config",
                                "params": JSON.stringify(params),
                                "userId": user.id
                            });
                        } else {
                            deferred = camel.put({
                                url: "/goku/rest/v1.5/system/cloud-config",
                                "params": JSON.stringify({
                                    "url": $("#" + $scope.url.id).widget().getValue(),
                                    "userName": $("#" + $scope.name.id).widget().getValue(),
                                    "password": $("#" + $scope.password.id).widget().getValue(),
                                    "projectName": $("#" + $scope.defaultProject.id).widget().getValue()
                                }),
                                "userId": user.id
                            });
                        }
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var content = "";
                                if($scope.noConfig){
                                    content = $scope.i18n.user_keystone_set_info_msg || "操作成功。请退出，使用cloud_admin重新登陆。";
                                    var successMsg = new Message({
                                        "type": "prompt",
                                        "content": content,
                                        "height": 100,
                                        "width": 300,
                                        "buttons":[{
                                            label: $scope.i18n.common_term_ok_button,
                                            accessKey: '2',
                                            "key": "okBtn",
                                            handler : function(event) {
                                                var host = $window.location.hostname;
                                                $window.location = "https://" + host + "/SSOSvr/logout";
                                            },
                                            default: true
                                        }]
                                    });
                                    successMsg.show();
                                }
                                else{
                                    content = $scope.i18n.common_term_operationSucceed_msg || "操作成功。";
                                    var successMsg = new Message({
                                        "type": "prompt",
                                        "content": content,
                                        "height": 100,
                                        "width": 300
                                    });
                                    successMsg.show();
                                }
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };

                $scope.operator = {
                    "getKeystoneConfig": function () {
                        var deferred = camel.get({
                            url: "/goku/rest/v1.5/system/cloud-config",
                            "params": {}
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    $scope.noConfig = true;
                                    return;
                                }
                                var configInfo = response.configInfo;
                                if (!configInfo) {
                                    $scope.noConfig = true;
                                    return;
                                }

                                $scope.noConfig = false;
                                $scope.url.value = configInfo.url;
                                $scope.name.value = configInfo.userName;
                                $scope.defaultProject.value = configInfo.projectName;
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };
                $scope.operator.getKeystoneConfig();
            }
        ];

        return keystoneCtrl;
    });
