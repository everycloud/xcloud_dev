/* global define */
define(['jquery',
        'tiny-lib/angular',
        'tiny-common/UnifyValid',
        'tiny-widgets/Message',
        'upload/FileUpload',
        "app/business/template/controllers/constants"
    ],
    function ($, angular, UnifyValid, Message, FileUpload, constants) {
        "use strict";

        var repairBaseInfoCtrl = ["$scope", "$state",
            function ($scope, $state) {
                var i18n = $scope.i18n;
                $scope.name = {
                    label: i18n.common_term_name_label + ":",
                    require: false,
                    "id": "repairBaseInfoName"
                };

                $scope.file = {
                    label: i18n.template_term_scriptFile_label + ":",
                    require: false,
                    "id": "repairBaseInfoFile"
                };

                $scope.picture = {
                    label: i18n.common_term_icon_label + ":",
                    require: false,
                    "id": "repairBaseInfoPicture"
                };

                $scope.osType = {
                    label: i18n.template_term_suitOS_label + ":",
                    require: false,
                    "id": "repairBaseInfoOSType"
                };

                $scope.version = {
                    label: i18n.common_term_version_label + ":",
                    require: false,
                    "id": "repairBaseInfoVersion"
                };

                $scope.description = {
                    label: i18n.common_term_desc_label + ":",
                    require: false,
                    "id": "repairBaseInfoDescription"
                };

                $scope.path = {
                    label: i18n.common_term_fileTargetPath_label + ":",
                    require: false,
                    "id": "repairBaseInfoPath"
                };

                $scope.installCmd = {
                    label: i18n.common_term_installCmd_label + ":",
                    require: false,
                    "id": "repairBaseInfoInstall"
                };
                $scope.uninstallCmd = {
                    label: i18n.common_term_uninstallCmd_label + ":",
                    require: false,
                    "id": "repairBaseInfoUninstall"
                };
                $scope.startCmd = {
                    label: i18n.common_term_startupCmd_label + ":",
                    require: false,
                    "id": "repairBaseInfoStart"
                };
                $scope.stopCmd = {
                    label: i18n.common_term_StopCmd_label + ":",
                    require: false,
                    "id": "repairBaseInfoStop"
                };
                $scope.repairFile = {
                    label: i18n.template_term_restoreFile_button + ":",
                    require: false,
                    "id": "repairBaseInfoFileList",
                    "select": function () {

                        // 向applet中添加文件
                        var fileName = "";
                        try {
                            fileName = FileUpload.openFtpSelectWindow("main");
                        } catch (e) {}

                        if (fileName !== null && fileName !== "" && fileName !== $scope.service.model.mainFilePath) {
                            var options = {
                                "type": "error",
                                "content": i18n.common_term_fileChooseError_valid,
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();

                            $scope.service.model.repairFileName = "";
                            return;
                        }

                        $scope.service.model.repairFileName = fileName;
                    }
                };

                $scope.password = {
                    label: $scope.i18n.common_term_psw_label+":",
                    require: true,
                    "id": "ftsAuthenticPwd",
                    "validate":"required:"+$scope.i18n.common_term_null_valid,
                    "width": "240",
                    "type":"password",
                    "value":""
                };

                $scope.passwordConfirm = {
                    label: $scope.i18n.common_term_PswConfirm_label+":",
                    require: true,
                    "id": "ftsAuthenticPwdConfirm",
                    "extendFunction": ["pwdConfirm"],
                    "validate":"required:"+$scope.i18n.common_term_null_valid+";pwdConfirm:"+$scope.i18n.common_term_pswDifferent_valid+";",
                    "width": "240",
                    "type":"password",
                    "value":""
                };

                $scope.nextBtn = {
                    id: "repairBaseInfoNextBtnID",
                    disabled: false,
                    iconsClass: "",
                    text: i18n.common_term_next_button,
                    tip: "",
                    next: function () {
                        // 校验待修复文件是否选择正确
                        if ($scope.service.model.repairFileName !== $scope.service.model.mainFilePath) {
                            var options = {
                                "type": "error",
                                "content": "请选择待修复文件" + $scope.service.model.repairFileName + "。",
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }

                        // 文件大小
                        if (FileUpload.getTotalFileSize() > 1024 * 1024 * 1) {
                            var sOptions = {
                                "type": "error",
                                "content": "文件大小超过最大限制1M。",
                                "width": "360px",
                                "height": "200px"
                            };
                            var sMsg = new Message(sOptions);
                            sMsg.show();
                            return;
                        }
                        $scope.service.ftpInfo = {"pwd": $("#" + $scope.password.id).widget().getValue()};
                        // 触发事件
                        $scope.$emit($scope.repairScriptEvents.confirmed, $scope.model);
                        $scope.service.show = "upload";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                };

                $scope.cancelBtn = {
                    id: "repairBaseInfoCancelBtnID",
                    disabled: false,
                    iconsClass: "",
                    text: i18n.common_term_cancle_button,
                    tip: "",
                    cancel: function () {
                        $state.go("ecs.commonScriptList", {});
                    }
                };

                // 事件处理
                $scope.$on($scope.repairScriptEvents.scriptInfoInit, function (event, msg) {
                    $scope.service.model = msg;
                });
            }
        ];

        return repairBaseInfoCtrl;
    });
