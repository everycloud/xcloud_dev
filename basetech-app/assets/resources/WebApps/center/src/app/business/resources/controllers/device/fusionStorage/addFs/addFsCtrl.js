/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-26
 */
define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    'tiny-widgets/Message',
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "bootstrapui/ui-bootstrap-tpls",
    "fixtures/deviceFixture"],
    function ($, angular, http, Message, UnifyValid, ValidatorService, constants, ExceptionService, ui, deviceFixture) {
        "use strict";
        var addFsCtrl = ["$scope", "$compile", 'camel', "validator", function ($scope, $compile, camel, validator) {
            var user = $("html").scope().user;
            $scope.openstack = user.cloudType === "OPENSTACK";
            var colon = ":";
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                return validator.ipValidator(ip);
            };
            $scope.name = {
                "id": "name",
                "label": $scope.i18n.common_term_name_label + colon,
                "require": "true",
                "width": "215px",
                "value": "",
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(256):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"256"})+
                    ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition2_valid
            };

            // 标记是否为IP接入方式
            $scope.isIpAccessType = true;

            $scope.portTips = $scope.i18n.device_fs_add_para_portIP_mean_tip;
            //类型下拉框
            $scope.typeSelector = {
                "label": $scope.i18n.common_term_type_label + ":",
                "require": true,
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";",
                "id": "add_environment_type_selector",
                "width": "215",
                "values": [
                    {
                        "selectId": "ip",
                        "label": $scope.i18n.common_term_floatIP_label
                    },
                    {
                        "selectId": "domainName",
                        "label": $scope.i18n.common_term_domainName_label
                    }
                ],
                "defaultSelectid": "ip",
                "change": function () {
                    $scope.typeSelector.selectedId = $("#" + $scope.typeSelector.id).widget().getSelectedId();
                    if($scope.typeSelector.selectedId ==  "ip"){
                        $scope.portTips = $scope.i18n.device_fs_add_para_portIP_mean_tip;
                    }else{
                        $scope.portTips = $scope.i18n.device_fs_add_para_portDomain_mean_tip;
                    }
                    $scope.isIpAccessType = $scope.typeSelector.selectedId === "ip";
                }
            };

            //域名输入框
            $scope.domainNameTextbox = {
                "label": $scope.i18n.common_term_domainName_label + ":",
                "require": true,
                "id": "domainNameTextbox",
                "disable": true,
                "width": "215px",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";"
            };

            $scope.floatingIp = {
                "label": $scope.i18n.common_term_floatIP_label + colon,
                "require": "true",
                "id": "floatingIp",
                "type": "ipv4",
                "value": "",
                "width": "215px",
                "extendFunction": ["ipCheck"],
                "validate": "ipCheck(floatingIp):" + $scope.i18n.common_term_formatIP_valid + ";"
            };
            $scope.port = {
                "label":  $scope.i18n.common_term_port_label + colon,
                "require": "true",
                "id": "port",
                "width": "215px",
                "value": "",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" +
                    $scope.i18n.common_term_invalidNumber_valid + ";maxValue(65535):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid,{1:1, 2:65535})
            };
            $scope.username = {
                "id": "username",
                "label": $scope.i18n.common_term_userName_label + colon,
                "require": "true",
                "value": "",
                "width": "215px",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:32})
            };
            UnifyValid.infoPwdEqual = function () {
                if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            $scope.password = {
                "label": $scope.i18n.common_term_psw_label + colon,
                "require": "true",
                "id": "password",
                "type": "password",
                "width": "215px",
                "value": "",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(128):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
            };
            $scope.passwordConfirm = {
                "label": $scope.i18n.common_term_PswConfirm_label + colon,
                "require": "true",
                "id": "pwdConfirm",
                "type": "password",
                "width": "215px",
                "value": "",
                "extendFunction": ["infoPwdEqual"],
                "validate": "infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid + ";"
            };
            $scope.description = {
                "id": "description",
                "label": $scope.i18n.common_term_desc_label + colon,
                "type": "multi",
                "width": "215px",
                "height": "40px",
                "require": "false",
                "value": "",
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:1024})
            };
            $scope.okBtn = {
                "id": "okBtn",
                "text": $scope.i18n.common_term_connect_button,
                "click": function () {
                    //校验
                    var result = UnifyValid.FormValid($("#addFusionStorageDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.operate.addFusionStorage();
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#addFusionStorageWindow").widget().destroy();
                }
            };

            $scope.operate = {
                addFusionStorage: function () {
                    var para = {
                        "name": $("#" + $scope.name.id).widget().getValue(),
                        "port": $("#" + $scope.port.id).widget().getValue(),
                        "userName": $("#" + $scope.username.id).widget().getValue(),
                        "password": $("#" + $scope.password.id).widget().getValue()
                    };
                    if($scope.isIpAccessType){
                        para.ip = $("#" + $scope.floatingIp.id).widget().getValue();
                    }
                    else{
                        para.domainName = $("#" + $scope.domainNameTextbox.id).widget().getValue();
                    }
                    var queryConfig = constants.rest.FUSIONSTORAGE_ADD;
                    var deferred = camel.put({
                        "url": queryConfig.url,
                        "type": queryConfig.type,
                        "params": JSON.stringify({"fsConnectorInfo": para}),
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $("#addFusionStorageWindow").widget().destroy();
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };
        }];

        var dependency = ['ng', 'wcc','ui.bootstrap'];
        var addFsModule = angular.module("addFsModule", dependency);
        addFsModule.controller("addFsCtrl", addFsCtrl);
        addFsModule.service("camel", http);
        addFsModule.service("validator", ValidatorService);
        return addFsModule;
    }
);

