/* global define*/
define([
    'tiny-lib/angular',
    'tiny-lib/jquery',
    'tiny-lib/underscore',
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    'app/services/exceptionService',
    "app/business/network/services/vlb/vlbService",
    "language/keyID",
    "tiny-directives/Textbox",
    "tiny-directives/Button"
],
    function (angular, $, _, http, UnifyValid, validatorService, exception, vlbService, i18n) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {

                var winDom = $("#configCertificateWindow");
                // 父窗口传递的添加对象
                var monitor = winDom.widget().option("param").parmMonitor;

                // 是否需要调用更新证书接口
                var needBindCer = !!winDom.widget().option("param").needBindCer;

                $scope.close = function () {
                    winDom.widget().destroy();
                };
                $scope.info = {
                    name: {
                        label: i18n.common_term_certificateName_value + ":",
                        "id": "create-vlb-configCertificate-window-name",
                        "width": "214",
                        require: true,
                        "tooltip":i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") ,
                        value: monitor.certificateName,
                        "extendFunction": ["checkName"],
                        "validate": "required: "+i18n.common_term_null_valid+";checkName(create-vlb-configCertificate-window-name):" +
                            i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") + ";"

                    },
                    privateKey: {
                        label: i18n.common_term_privateKey_label + ":",
                        "id": "create-vlb-configCertificate-window-privateKey",
                        "width": "214",
                        require: true,
                        value: monitor.privateKey,
                        "type": "multi",
                        "height": 80,
                        "focus": function () {
                            //安全处理 针对私钥只允许拷入不允许拷出
                            $("#create-vlb-configCertificate-window-privateKey .tiny-input-text").unbind("paste");
                        },
                        "validate": "minSize(1):" + i18n.sprintf(i18n.common_term_length_valid, "1", "4384") + ";maxSize(4384):" + i18n.sprintf(i18n.common_term_length_valid, "1", "4384")
                    },
                    publicKey: {
                        label: i18n.common_term_publicKey_label + ":",
                        "id": "create-vlb-configCertificate-window-publicKey",
                        "width": "214",
                        require: true,
                        value: monitor.publicKey,
                        "type": "multi",
                        "height": 80,
                        "validate": "minSize(1):" + i18n.sprintf(i18n.common_term_length_valid, "1", "4384") + ";maxSize(4384):" + i18n.sprintf(i18n.common_term_length_valid, "1", "4384")
                    },
                    password: {
                        label: i18n.common_term_psw_label + ":",
                        "id": "create-vlb-configCertificate-window-password",
                        "width": "214",
                        "type": "password",
                        value: "",
                        require:false,
                        "tooltip":i18n.sprintf(i18n.common_term_length_valid, 6, 32) || "长度范围是6个～32个字符。",
                        "extendFunction": ["passwordCheck"],
                        "validate": "passwordCheck(create-vlb-configCertificate-window-password):" + i18n.sprintf(i18n.common_term_length_valid, 6, 32)
                    },
                    okBtn: {
                        "id": "create-vlb-configCertificate-window-ok",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#config-certificate-window"), undefined);
                            if (!valid) {
                                return;
                            }

                            // 修改监听器时需要单独调用跟心证书接口
                            if (needBindCer) {
                                var vlbServiceInst = new vlbService(exception, $q, camel);
                                var htmlDom = $("html");
                                var user = htmlDom.scope().user || {};
                                var networkCommon = htmlDom.injector().get("networkCommon") || {};
                                var deferred = vlbServiceInst.certificateBindListener({
                                    "vdcId": user.vdcId,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    "userId": user.id,
                                    "lbID": winDom.widget().option("param").lbID,
                                    "id": monitor.id,
                                    "params": {
                                        certificateName: $("#create-vlb-configCertificate-window-name").widget().getValue(),
                                        privateKey: $("#create-vlb-configCertificate-window-privateKey").widget().getValue(),
                                        publicKeyCertificate: $("#create-vlb-configCertificate-window-publicKey").widget().getValue(),
                                        passWord: $("#create-vlb-configCertificate-window-password").widget().getValue()
                                    }
                                });
                                deferred.then(function () {
                                    $scope.close();
                                    $scope.$destroy();
                                });
                            } else {
                                monitor.certificateName = $("#create-vlb-configCertificate-window-name").widget().getValue();
                                monitor.privateKey = $("#create-vlb-configCertificate-window-privateKey").widget().getValue();
                                monitor.publicKey = $("#create-vlb-configCertificate-window-publicKey").widget().getValue();
                                monitor.password = $("#create-vlb-configCertificate-window-password").widget().getValue();
                                monitor.opt = "";
                                $scope.close();
                                $scope.$destroy();
                            }
                        }
                    },
                    cancelBtn: {
                        "id": "create-vlb-configCertificate-window-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };
                //校验密码长度
                UnifyValid.passwordCheck = function (psw) {
                    var psw = $("#" + psw).widget().getValue();
                    if(!psw){
                        return true;
                    }
                    if (typeof psw != 'string'){
                        return false;
                    }
                    if ((psw.length < 6) || (psw.length > 32)){
                        return false;
                    };
                    return true;
                };

                //校验名称
                UnifyValid.checkName = function (name) {
                    var nameValue = $("#" + name).widget().getValue();
                    var planNameReg = /^[\u4E00-\u9FA50-9a-zA-Z \.\_\-\[\]\(\)\#]{0,64}$/;
                    return planNameReg.test(nameValue);
                };
            }
        ];

        var dependency = [
            "ng", "wcc"
        ];
        var configCertificateWindow = angular.module("configCertificateWindow", dependency);
        configCertificateWindow.controller("configCertificateCtrl", ctrl);
        configCertificateWindow.service("camel", http);
        configCertificateWindow.service("exception", exception);

        return configCertificateWindow;
    });
