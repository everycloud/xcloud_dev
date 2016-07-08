/* global define */
define(['jquery',
        'tiny-lib/angular',
        "tiny-lib/underscore",
        'tiny-common/UnifyValid',
        'tiny-widgets/Message',
        'upload/FileUpload',
        "app/business/template/controllers/constants"
    ],
    function ($, angular, _, UnifyValid, Message, FileUpload, constants) {
        "use strict";

        var repairBaseInfoCtrl = ["$scope", "$state",
            function ($scope, $state) {
                var i18n = $scope.i18n;
                $scope.name = {
                    label: i18n.common_term_name_label + ":",
                    require: false,
                    "id": "repairBaseInfoName"
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

                $scope.packageType = {
                    label: i18n.common_term_softwareType_label + ":",
                    require: false,
                    "id": "repairBaseInfoPackageType"
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
                $scope.fileList = {
                    label: i18n.common_term_fileList_label + ":",
                    require: false,
                    "id": "repairBaseInfoFileList",
                    "select": function (index) {
                        var repairFile = $scope.service.model.repairList[index];

                        // 向applet中添加文件
                        var fileName = "";
                        try {
                            fileName = FileUpload.openFtpSelectWindow(index);
                        } catch (e) {}

                        if (fileName !== null && fileName !== "" && fileName !== repairFile.name) {
                            var options = {
                                "type": "error",
                                "content": i18n.common_term_fileChooseError_valid,
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();

                            repairFile.repairFileName = "";
                            return;
                        }

                        repairFile.repairFileName = fileName;
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
                        var pOptions = null;
                        var pMsg = null;
                        _.each($scope.service.model.repairList, function (item) {
                            var file = item;
                            if (!file) {
                                return;
                            }

                            if (file.status === "Abnormal" && file.name !== file.repairFileName) {
                                var options = {
                                    "type": "error",
                                    "content": "请选择待修复文件" + file.name + "。",
                                    "width": "360px",
                                    "height": "200px"
                                };
                                var msg = new Message(options);
                                msg.show();
                                return;
                            }

                            var maxSize = 0;
                            if (file.type === "main") {
                                maxSize = 1024 * 1024 * 1024 * 4;
                            } else {
                                maxSize = 1024 * 1024 * 1;
                            }

                            if (FileUpload.getFileSize(item.key) > maxSize) {
                                pOptions = {
                                    "type": "error",
                                    "content": i18n.template_term_softwareFile_label + file.name + "大小超过最大限制。",
                                    "width": "360px",
                                    "height": "200px"
                                };
                                pMsg = new Message(pOptions);
                                pMsg.show();
                                return;
                            }
                        });

                        $scope.service.ftpInfo = {"pwd": $("#" + $scope.password.id).widget().getValue()};
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
                    text: i18n.common_term_cancle_button,
                    tip: "",
                    cancel: function () {
                        $state.go("ecs.commonPackageList", {});
                    }
                };

                // 事件处理
                $scope.$on($scope.repairSoftwareEvents.softwareInfoInit, function (event, msg) {
                    $scope.service.model = msg;

                    var repairList = [];

                    repairList.push({
                        "name": msg.mainFilePath,
                        "type": "main",
                        "status": msg.status
                    });

                    var attachment = null;
                    _.each(msg.attachmentPaths, function (item) {
                        var attachment = item;
                        repairList.push({
                            "name": attachment.fileName,
                            "type": "attachment",
                            "status": attachment.status
                        });
                    });

                    $scope.service.model.repairList = repairList;
                });
            }
        ];

        return repairBaseInfoCtrl;
    });
