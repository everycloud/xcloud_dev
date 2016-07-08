/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    'bootstrapui/ui-bootstrap-tpls',
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    'upload/FileUpload',
    'tiny-widgets/Message'
], function ($, angular, uibootstrap, UnifyValid, validatorService, FileUpload, Message) {
    "use strict";

    var ctrl = ["$scope", "monkey", "camel", "$stateParams",
        function ($scope, monkey, camel, $stateParams) {
            var i18n = $scope.i18n;
            $scope.info = {
                name: {
                    "id": "create-package-name",
                    label: i18n.common_term_name_label + ":",
                    "width": "240",
                    require: true,
                    "extendFunction": ["checkSoftwareName"],
                    value: "",
                    tips: i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256"),
                    validate: "required: " + i18n.common_term_null_valid + ";checkSoftwareName(true):" + i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256")
                },
                OSType: {
                    label: i18n.template_term_suitOS_label + ":",
                    require: true,
                    "id": "create-package-OSType",
                    "width": "240",
                    "height": "200",
                    "change": function () {
                        var osType = $("#"+$scope.info.OSType.id).widget().getSelectedId();
                        $scope.service.softwareTypes = $scope.getSoftwareTypes(osType, "unknown");
                    }
                },
                softwareType: {
                    label: i18n.common_term_softwareType_label + ":",
                    require: true,
                    "id": "create-package-softwareType",
                    "width": "240",
                    "height": "200",
                    "change": function () {
                        $scope.service.softwareType = $("#create-package-softwareType").widget().getSelectedId();
                        //根据软件类型判断配置命令页面目标路径，安装命令是否为必填项
                        $scope.changeVal();
                    }
                },
                desc: {
                    label: i18n.common_term_desc_label + ":",
                    require: false,
                    "id": "create-package-desc",
                    "value": "",
                    "type": "multi",
                    "tips": i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                    "width": "450",
                    "height": "80"
                },
                packageFile: {
                    label: i18n.template_term_softwareFile_label + ":",
                    require: true,
                    "width": "240",
                    "id": "create-package-file",
                    "value": "",
                    "readonly": true,
                    "display": true,
                    "validate": "maxSize(256):" + i18n.sprintf(i18n.common_term_length_valid, "1", "256") + ";required:" + i18n.common_term_null_valid,
                    inputRequired: false,
                    select: function () {
                        var fileName = "";
                        try {
                            fileName = FileUpload.openFtpSelectWindow("main");
                        } catch (e) {}
                        $scope.service.packageFile = fileName;
                    }
                },
                version: {
                    label: i18n.common_term_version_label + ":",
                    require: true,
                    "width": "240",
                    "id": "create-package-version",
                    "value": "",
                    tips: i18n.sprintf(i18n.common_term_length_valid, "1", "64") + i18n.common_term_composition4_valid + i18n.common_term_startWithEnOrNum_valid,
                    "extendFunction": ["checkSoftwareVersion"],
                    validate: "required:" + i18n.common_term_null_valid + ";checkSoftwareVersion(true):" + i18n.sprintf(i18n.common_term_length_valid, "1", "64") + i18n.common_term_composition4_valid + i18n.common_term_startWithEnOrNum_valid
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
                    "id": "create-package-step1-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        $scope.info.packageFile.inputRequired = true;
                        var validInfo = UnifyValid.FormValid($("#add-package-basic-info"));
                        if(!validInfo) {
                            return;
                        }
                        //验证是否选择软件包文件
                        if ($("#addPackageBaseInfo .ng-invalid").length > 0 || $scope.service.packageFile === "" ||
                            $scope.service.packageFile === null) {
                            return;
                        }
                        monkey.show = {
                            "basic": false,
                            "commandConfig": true,
                            "confirm": false,
                            "uploadFile": false
                        };
                        $scope.service.name = $("#create-package-name").widget().getValue();
                        $scope.service.OSType = $("#create-package-OSType").widget().getSelectedId();
                        $scope.service.softwareType = $("#create-package-softwareType").widget().getSelectedId();
                        $scope.service.desc = $("#create-package-desc").widget().getValue();
                        $scope.service.version = $("#create-package-version").widget().getValue();
                        var action = $stateParams.action;
                        if (action === 'create') {
                            $scope.service.ftpInfo = {"pwd": $("#" + $scope.password.id).widget().getValue()};
                        }

                        $("#" + $scope.step.id).widget().next();

                        $scope.changeVal();
                    }
                },
                cancelBtn: {
                    "id": "create-package-step1-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            $scope.password = {
                label: $scope.i18n.common_term_psw_label+":",
                require: true,
                "display": $stateParams.action === "create",
                "id": "ftsAuthenticPwd",
                "validate":"required:"+$scope.i18n.common_term_null_valid,
                "width": "240",
                "type":"password",
                "value":""
            };

            $scope.passwordConfirm = {
                label: $scope.i18n.common_term_PswConfirm_label+":",
                require: true,
                "display": $stateParams.action === "create",
                "id": "ftsAuthenticPwdConfirm",
                "extendFunction": ["pwdConfirm"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";pwdConfirm:"+$scope.i18n.common_term_pswDifferent_valid+";",
                "width": "240",
                "type":"password",
                "value":""
            };

            /**
             * 初始化操作
             */
            $scope.init = function () {
                $scope.info.picture.init();
                var action = $stateParams.action;
                if (action === 'create') {
                    // do nothing
                    return;
                }
                //修改时软件包名称  软件包文件不可修改
                $scope.info.name.disabled = true;
                $scope.info.name.require = false;
                $scope.info.name.validate = "";

                $scope.info.packageFile.disabled = true;
                $scope.info.packageFile.require = false;
                $scope.info.packageFile.validate = "";
                $scope.info.packageFile.display = false;
            };

            // 扩展UnifyValid
            //验证软件包名称
            UnifyValid.checkSoftwareName = function (param) {
                var value = $(this).val();
                var softNameReg = /^[0-9a-zA-Z \u4e00-\u9fa5\.\_\-\[\]\(\)\#]{0,256}$/;
                var notAllSpaceReg = /^.*[^ ].*$/;
                return softNameReg.test(value) && notAllSpaceReg.test(value);
            };
            //验证软件包版本
            UnifyValid.checkSoftwareVersion = function (param) {
                var value = $(this).val();
                var softVersionReg = /^[a-zA-Z0-9]{1}([a-zA-Z0-9\.\-\_]){0,63}$/;
                return softVersionReg.test(value);
            };

            UnifyValid.pwdConfirm = function () {
                if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.init();
        }
    ];
    return ctrl;
});
