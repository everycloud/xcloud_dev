/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-27
 */

define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/httpService",
    "app/business/system/services/vdiManageService",
    "tiny-directives/IP",
    "tiny-directives/Checkbox",
    "fixtures/systemFixture"],

    function ($, angular, UnifyValid, ValidatorService, http, VdiManageService) {
        "use strict";
        var dependency = ['ng', 'wcc'];

        var editVdiCtrl = ["$scope", "$q", "camel", function ($scope, $q, camel) {
            var VDI_VERSION = "1.3.10";
            var INPUT_WIDTH = 200;
            var vdiWinWidget = $("#vdiWindowId").widget();
            var vdi = vdiWinWidget.option("params");
            var selectDomainId = vdi && vdi.domainId;

            var vdiManageService = new VdiManageService($q, camel);
            var validatorService = new ValidatorService();
            var $rootScope = $("html").scope();
            var userId = $rootScope.user.id;

            var i18n = $rootScope.i18n || {};

            var saveBtnText = i18n.common_term_add_button || "添加";
            var saveFunction = function (data) {
                var promise = vdiManageService.addVdi(userId, data);
                return promise;
            };
            if (vdi) {
                saveBtnText = i18n.common_term_save_label || "保存";
                saveFunction = function (data) {
                    var promise = vdiManageService.editVdi({
                        userId: userId,
                        id: vdi.id,
                        params: data
                    });
                    return promise;
                }
            }
            UnifyValid.notZero = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                return val != "0";
            };
            UnifyValid.ipFormatCheck = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                if(!val){
                    return true;
                }
                return validatorService.ipFormatCheck(val);
            };
            UnifyValid.confirmPWD = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                var reVal = $("#re" + id).widget().getValue();
                return val === reVal;
            };
            $scope.vdi = vdi;

            $scope.name = {
                "id": "nameId",
                "label": (i18n.common_term_name_label || "名称") + ":",
                "width": INPUT_WIDTH,
                "require": true,
                "focused": true,
                "validate": "required:" + (i18n.common_term_null_valid || "不能为空")
                    + ";maxSize(128):" + i18n.sprintf(i18n.common_term_maxLength_valid, 128)
                    + ";regularCheck(" + validatorService.ChineseRe + "):" + i18n.common_term_composition3_valid
            };

            $scope.domain = {
                "id": "domainId",
                "label": (i18n.common_term_domain_label || "域") + ":",
                "value": selectDomainId,
                "require": true,
                "width": INPUT_WIDTH,
                "values": [],
                "validate": "required:" + (i18n.common_term_null_valid || "不能为空") + ";",
                "change": function () {

                }
            };

            $scope.primaryIP = {
                "id": "primaryIPId",
                "label": (i18n.common_term_masterIP_label || "主用IP") + ":",
                "require": true,
                "width": INPUT_WIDTH,
                "type": "ipv4",
                "extendFunction": ["ipFormatCheck"],
                "validate": "required:" + (i18n.common_term_null_valid || "不能为空") + ";"
                    + "ipFormatCheck(primaryIPId):" + (i18n.common_term_formatIP_valid || "IP地址格式不正确")
            };

            $scope.extraIP = {
                "id": "extraIPId",
                "label": (i18n.common_term_standbyIP_label || "备用IP") + ":",
                "require": false,
                "width": INPUT_WIDTH,
                "type": "ipv4",
                "extendFunction": ["ipFormatCheck"],
                "validate": "ipFormatCheck(extraIPId):" + (i18n.common_term_formatIP_valid || "IP地址格式不正确")
            };

            $scope.port = {
                "id": "portId",
                "label": (i18n.common_term_port_label || "端口号") + ":",
                "width": INPUT_WIDTH,
                "require": true,
                "extendFunction": ["notZero"],
                "validate": "required:" + (i18n.common_term_null_valid || "不能为空")
                    + ";integer:" + (i18n.common_term_integer_valid || "请输入整数")
                    + ";port:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535)
                    + ";notZero(portId):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535)
            };

            $scope.version = {
                "id": "version",
                "label": (i18n.common_term_version_label || "版本") + ":",
                "require": true,
                "width": INPUT_WIDTH,
                "values": [
                    {
                        label: VDI_VERSION,
                        selectId: VDI_VERSION,
                        checked: true
                    }
                ]
            };

            $scope.userName = {
                "id": "userNameId",
                "label": (i18n.common_term_userName_label || "用户名") + ":",
                "width": INPUT_WIDTH,
                "require": true,
                "validate": "required:" + (i18n.common_term_null_valid || "不能为空")
                    + ";maxSize(128):" + i18n.sprintf(i18n.common_term_maxLength_valid, 128)
            };

            $scope.changePWD = {
                "id": "changePWDId",
                "text": i18n.common_term_modifyPsw_button || "修改密码",
                "disable": false,
                "checked": !vdi,
                "display": !!vdi,
                "change": function () {
                    var result = $scope.changePWD.checked;
                    $scope.password.disable = result;
                    $scope.repassword.disable = result;

                    $scope.changePWD.checked = !result;
                }
            };

            var getPWDValidate = function (require, same) {
                var validate = [];
                var requireValidate = "required:" + i18n.common_term_null_valid;
                var sameValidate = "confirmPWD(passwordId):" + i18n.common_term_pswDifferent_valid;
                require && (validate.push(requireValidate));
                same && (validate.push(sameValidate));
                validate.push("maxSize(128):" + i18n.sprintf(i18n.common_term_maxLength_valid, 128));
                return validate.join(";");
            };

            $scope.password = {
                "id": "passwordId",
                "label": (i18n.common_term_psw_label || "密码") + ":",
                "width": INPUT_WIDTH,
                "type": "password",
                'disable': !!vdi,
                "require": true,
                "validate": getPWDValidate(true, false)
            };

            $scope.repassword = {
                "id": "repasswordId",
                "label": (i18n.common_term_PswConfirm_label || "密码") + ":",
                "width": INPUT_WIDTH,
                "type": "password",
                'disable': !!vdi,
                "require": true,
                "extendFunction": ["confirmPWD"],
                "validate": getPWDValidate(true, true)
            };

            var formDataToServer = function () {
                if (UnifyValid.FormValid($("#editVdiDiv"))) {
                    var params = {
                        name: $("#" + $scope.name.id).widget().getValue(),
                        primaryIP: $("#" + $scope.primaryIP.id).widget().getValue(),
                        extraIP: $("#" + $scope.extraIP.id).widget().getValue(),
                        port: $("#" + $scope.port.id).widget().getValue(),
                        userName: $("#" + $scope.userName.id).widget().getValue(),
                        domainId: $("#" + $scope.domain.id).widget().getSelectedId(),
                        version: VDI_VERSION
                    };

                    if (!vdi || $scope.changePWD.checked) {
                        params.password = $("#" + $scope.password.id).widget().getValue();
                    }
                    return params;
                }
                return null;
            };

            $scope.saveBtn = {
                "id": "saveBtnId",
                "text": saveBtnText,
                "save": function () {
                    var formData = formDataToServer();
                    if (formData) {
                        var promise = saveFunction(JSON.stringify(formData));
                        promise.then(function () {
                            vdiWinWidget.destroy();
                        });
                    }
                }
            };

            $scope.closeBtn = {
                "id": "closeBtn",
                "text": i18n.common_term_cancle_button || "取消",
                "close": function () {
                    vdiWinWidget.destroy();
                }
            };

            var getDomains = function () {
                var promise = vdiManageService.getDomains({
                    orgId: 1,
                    userId: userId
                });
                promise.then(function (resolvedValue) {
                    var domainSelectValues = [];
                    var domainList = resolvedValue && resolvedValue.domainList || [];
                    for (var i = 0, len = domainList.length; i < len; i++) {
                        var domain = domainList[i];
                        domainSelectValues.push({
                            selectId: domain.domainId,
                            label: "domain/" + domain.domainName,
                            checked: domain.domainId == selectDomainId
                        });
                    }
                    $scope.domain.values = domainSelectValues;
                });
            };

            getDomains();
        }];
        var editVdiModule = angular.module("editVdiModule", dependency);
        editVdiModule.controller("editVdiCtrl", editVdiCtrl);
        editVdiModule.service("camel", http);
        return editVdiModule;
    });