/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    'upload/FileUpload'
], function ($, angular, UnifyValid, validatorService, FileUpload) {
    "use strict";

    var ctrl = ["$scope", "monkey", "camel", "$stateParams",
        function ($scope, monkey, camel, $stateParams) {
            var i18n = $scope.i18n;

            $scope.password = {
                label: $scope.i18n.common_term_psw_label + ":",
                require: true,
                "id": "ftsAuthenticPwd",
                "validate": "required:" + $scope.i18n.common_term_null_valid,
                "width": "260",
                "type": "password",
                "display": $stateParams.action === "create",
                "value": ""
            };

            $scope.passwordConfirm = {
                label: $scope.i18n.common_term_PswConfirm_label + ":",
                require: true,
                "id": "ftsAuthenticPwdConfirm",
                "extendFunction": ["pwdConfirm"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";pwdConfirm:" + $scope.i18n.common_term_pswDifferent_valid + ";",
                "width": "260",
                "type": "password",
                "value": ""
            };

            $scope.info = {
                name: {
                    "id": "create-script-name",
                    label: i18n.common_term_name_label + ":",
                    "width": "240",
                    require: true,
                    value: "",
                    "extendFunction": ["checkScriptName"],
                    tips: i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256"),
                    validate: "required:" + i18n.common_term_null_valid + ";checkScriptName(true): " + i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256")
                },
                OSType: {
                    label: i18n.template_term_suitOS_label + ":",
                    require: true,
                    "id": "create-script-OSType",
                    "width": "240",
                    "height": "200",
                    "change": function () {
                    }
                },
                desc: {
                    label: i18n.common_term_desc_label + ":",
                    require: false,
                    "id": "create-script-desc",
                    "value": "",
                    "type": "multi",
                    "tips": i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                    "width": "450",
                    "height": "80"
                },
                scriptFile: {
                    label: i18n.template_term_scriptFile_label + ":",
                    require: true,
                    "width": "240",
                    "id": "create-script-file",
                    "value": "",
                    "readonly": true,
                    "display": true,
                    "validate": "maxSize(256):" + i18n.sprintf(i18n.common_term_length_valid, "1", "256") + ":required:" + i18n.common_term_null_valid,
                    inputRequired: false,
                    select: function () {
                        var fileName = "";
                        try {
                            fileName = FileUpload.openFtpSelectWindow("main");
                        } catch (e) {
                        }
                        $scope.service.scriptFile = fileName;
                    }
                },
                version: {
                    label: i18n.common_term_version_label + ":",
                    require: true,
                    "width": "240",
                    "id": "create-script-version",
                    "value": "",
                    "extendFunction": ["checkScriptVersion"],
                    tips: i18n.sprintf(i18n.common_term_length_valid, "1", "64") + i18n.common_term_composition4_valid + i18n.common_term_startWithEnOrNum_valid,
                    validate: "required:" + i18n.common_term_null_valid + ";checkScriptVersion(true):" + i18n.sprintf(i18n.common_term_length_valid, "1", "64") + i18n.common_term_composition4_valid + i18n.common_term_startWithEnOrNum_valid
                },
                picture: {
                    label: i18n.common_term_icon_label + ":",
                    require: false,
                    "id": "scriptPicture",
                    "width": "240",
                    "show": false,
                    "imgs": [],
                    "click": function () {
                        $scope.info.picture.show = !$scope.info.picture.show;
                    },
                    "init": function () {
                        var img = function (index) {
                            var src = "../theme/default/images/softwarePackage/icon_software_" + index + ".png";
                            return {
                                "src": src,
                                "click": function () {
                                    $scope.service.icon = src;
                                }
                            };
                        };
                        var imgs = [];
                        for (var index = 1; index <= 10; index++) {
                            imgs.push(img(index));
                        }
                        $scope.info.picture.imgs = imgs;
                    }
                },
                nextBtn: {
                    "id": "create-script-step1-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        $scope.info.scriptFile.inputRequired = true;
                        var validInfo = UnifyValid.FormValid($("#add-script-basic-info"));
                        if (!validInfo) {
                            return;
                        }

                        //验证是否选择脚本文件
                        if ($("#addScriptBaseInfo .ng-invalid").length > 0 ||
                            $scope.service.scriptFile === "" || $scope.service.scriptFile === null) {
                            return;
                        }
                        monkey.show = {
                            "basic": false,
                            "commandConfig": true,
                            "confirm": false,
                            "uploadFile": false
                        };
                        $scope.service.name = $("#create-script-name").widget().getValue();
                        $scope.service.OSType = $("#create-script-OSType").widget().getSelectedId();
                        $scope.service.desc = $("#create-script-desc").widget().getValue();
                        $scope.service.version = $("#create-script-version").widget().getValue();
                        var action = $stateParams.action;
                        if (action === 'create') {
                            $scope.service.ftpInfo = {"pwd": $("#" + $scope.password.id).widget().getValue()};
                        }
                        $("#" + $scope.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-script-step1-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            /**
             * 初始化操作
             */
            $scope.init = function () {
                $scope.info.picture.init();

                var action = $stateParams.action;
                if (action === 'create') {
                    return;
                }
                //修改时脚本名称  脚本文件不可修改
                $scope.info.name.disabled = true;
                $scope.info.name.require = false;
                $scope.info.name.validate = "";
                $scope.info.scriptFile.disabled = true;
                $scope.info.scriptFile.require = false;
                $scope.info.scriptFile.validate = "";
                $scope.info.scriptFile.display = false;
            };

            UnifyValid.pwdConfirm = function () {
                if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            //验证脚本名称
            UnifyValid.checkScriptName = function (param) {
                var value = $(this).val();
                var softNameReg = /^[0-9a-zA-Z \u4e00-\u9fa5\.\_\-\[\]\(\)\#]{0,256}$/;
                var notAllSpaceReg = /^.*[^ ].*$/;
                return softNameReg.test(value) && notAllSpaceReg.test(value);
            };

            //验证脚本版本
            UnifyValid.checkScriptVersion = function (param) {
                var value = $(this).val();
                var softVersionReg = /^[a-zA-Z0-9]{1}([a-zA-Z0-9\.\-\_]){0,63}$/;
                return softVersionReg.test(value);
            };

            $scope.init();
        }
    ];
    return ctrl;
});
