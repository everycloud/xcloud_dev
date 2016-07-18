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

            $scope.packageType = {
                label: $scope.i18n.common_term_softwareType_label+":",
                require: false,
                "id": "repairBaseInfoPackageType"
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
                label: $scope.i18n.common_term_installCmd_label+":",
                require: false,
                "id": "repairBaseInfoInstall"
            };
            $scope.uninstallCmd = {
                label: $scope.i18n.common_term_uninstallCmd_label+":",
                require: false,
                "id":"repairBaseInfoUninstall"
            };
            $scope.startCmd = {
                label: $scope.i18n.common_term_startupCmd_label+":",
                require: false,
                "id": "repairBaseInfoStart"
            };
            $scope.stopCmd = {
                label: $scope.i18n.common_term_StopCmd_label+":",
                require: false,
                "id": "repairBaseInfoStop"
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

            $scope.fileList = {
                label: $scope.i18n.common_term_fileList_label+":",
                require: true,
                "id": "repairBaseInfoFileList",
                "select":function (index) {
                    var repairFile = $scope.service.model.repairList[index];

                    // 向applet中添加文件
                    var fileName = undefined;
                    try {
                        fileName = FileUpload.openFtpSelectWindow(index);
                    }
                    catch (e) {
                    }

                    if (fileName != null && fileName != "" && fileName != repairFile.name) {
                        var options = {
                            "type": "error",
                            "content": $scope.i18n.common_term_fileChooseError_valid,
                            "width": "360px",
                            "height": "200px"
                        };
                        var msg = new Message(options);
                        msg.show();

                        repairFile.repairFileName = "";
                        return;
                    }

                    if (fileName != undefined && fileName != "") {
                        repairFile.repairFileName = fileName;
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
                    if (!UnifyValid.FormValid($("#repairSoftwareConfirm"))) {
                        return;
                    }

                    // 校验待修复文件是否选择正确
                    for (var index in $scope.service.model.repairList) {
                        var file = $scope.service.model.repairList[index];
                        if (!file) {
                            continue;
                        }

                        if (file.status != "Abnormal") {
                            continue;
                        }

                        if (file.name != file.repairFileName) {
                            var options = {
                                "type": "error",
                                "content": $scope.i18n.sprintf($scope.i18n.template_term_chooseRestorFile_msg, file.name),
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }

                        var maxSize = 0;
                        if (file.type == "main") {
                            maxSize = 1024*1024*1024*4;
                        } else {
                            maxSize = 1024*1024*1;
                        }

                        var fileSize = FileUpload.getFileSize(index);

                        if (fileSize > maxSize || fileSize <= 0) {
                            var options = {
                                "type": "error",
                                "content": $scope.i18n.sprintf($scope.i18n.common_term_fileMaxWithName_valid, file.name),
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }
                    }

                    $scope.service.ftpInfo.pwd = $("#" + $scope.password.id).widget().getValue();

                    // 触发事件
                    $scope.$emit($scope.repairSoftwareEvents.confirmed, $scope.model);
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
                    $state.go("resources.templateSpec.software", {});
                }
            };

            // 事件处理
            $scope.$on($scope.repairSoftwareEvents.softwareInfoInit, function (event, msg) {
                $scope.service.model = msg;

                var repairList = [];

                repairList.push({
                    "name":msg.mainFilePath,
                    "type":"main",
                    "status":msg.status
                });

                for (var index in msg.attachmentPaths) {
                    var attachment = msg.attachmentPaths[index];
                    repairList.push({
                        "name":attachment.fileName,
                        "type":"attachment",
                        "status":attachment.status
                    });
                }

                $scope.service.model.repairList = repairList;
            });
        }];

        return repairBaseInfoCtrl;
    });

