define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'tiny-widgets/Message',
    'upload/FileUpload',
    "app/business/resources/controllers/constants"],
    function ($, angular, UnifyValid, Message, FileUpload, constants) {
        "use strict";

        var repairBaseInfoCtrl = ["$scope", "$state", function ($scope, $state) {

            UnifyValid.pwdConfirm = function () {
                if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: false,
                "id": "repairBaseInfoName"
            };

            $scope.file = {
                label: $scope.i18n.template_term_scriptFile_label+":",
                require: false,
                "id": "repairBaseInfoFile"
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "id": "repairBaseInfoPicture"
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: false,
                "id": "repairBaseInfoOSType"
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: false,
                "id": "repairBaseInfoVersion"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "repairBaseInfoDescription"
            };

            $scope.path = {
                label: $scope.i18n.common_term_fileTargetPath_label+":",
                require: false,
                "id": "repairBaseInfoPath"
            };

            $scope.installCmd = {
                label: $scope.i18n.common_term_runCmd_label+":",
                require: false,
                "id": "repairBaseInfoInstall"
            };

            $scope.password = {
                label: $scope.i18n.common_term_psw_label+":",
                require: true,
                "id": "ftsAuthenticPwd",
                "validate":"required:"+$scope.i18n.common_term_null_valid,
                "width": "260",
                "type":"password",
                "value":""
            };

            $scope.passwordConfirm = {
                label: $scope.i18n.common_term_PswConfirm_label+":",
                require: true,
                "id": "ftsAuthenticPwdConfirm",
                "extendFunction": ["pwdConfirm"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";pwdConfirm:"+$scope.i18n.common_term_pswDifferent_valid+";",
                "width": "260",
                "type":"password",
                "value":""
            };

            $scope.repairFile = {
                label: $scope.i18n.template_term_restoreFile_button+":",
                require: true,
                "id": "repairBaseInfoFileList",
                "select":function () {

                    // 向applet中添加文件
                    var fileName = undefined;
                    try {
                        fileName = FileUpload.openFtpSelectWindow("main");
                    }
                    catch (e) {
                    }

                    if (fileName != null && fileName != "" && fileName != $scope.service.model.mainFilePath) {
                        var options = {
                            "type": "error",
                            "content": $scope.i18n.common_term_fileChooseError_valid,
                            "width": "360px",
                            "height": "200px"
                        };
                        var msg = new Message(options);
                        msg.show();

                        $scope.service.model.repairFileName = "";
                        return;
                    }

                    if (fileName != undefined && fileName != "") {
                        $scope.service.model.repairFileName = fileName;
                    }
                }
            };

            $scope.nextBtn = {
                id: "repairBaseInfoNextBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    if (!UnifyValid.FormValid($("#repairScriptConfirm"))) {
                        return;
                    }

                    // 校验待修复文件是否选择正确
                    if ($scope.service.model.repairFileName != $scope.service.model.mainFilePath) {
                        var options = {
                            "type": "error",
                            "content": $scope.i18n.sprintf($scope.i18n.template_term_chooseRestorFile_msg, $scope.service.model.mainFilePath),
                            "width": "360px",
                            "height": "200px"
                        };
                        var msg = new Message(options);
                        msg.show();
                        return;
                    }

                    // 文件大小
                    var fileSize = FileUpload.getTotalFileSize();
                    if (fileSize > 1024*1024*1 || fileSize <= 0) {
                        var options = {
                            "type": "error",
                            "content": $scope.i18n.sprintf($scope.i18n.common_term_fileMaxWithName_valid, $scope.service.model.mainFilePath),
                            "width": "360px",
                            "height": "200px"
                        };
                        var msg = new Message(options);
                        msg.show();
                        return;
                    }

                    $scope.service.ftpInfo.pwd = $("#" + $scope.password.id).widget().getValue();

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
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go("resources.templateSpec.script", {});
                }
            };

            // 事件处理
            $scope.$on($scope.repairScriptEvents.scriptInfoInit, function (event, msg) {
                $scope.service.model = msg;
            });
        }];

        return repairBaseInfoCtrl;
    });

