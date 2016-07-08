/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    'upload/FileUpload',
    'tiny-widgets/Message'
], function ($, angular, _, UnifyValid, FileUpload, Message) {
    "use strict";
    var ctrl = ["$rootScope", "$scope", "monkey", "$compile", "camel", "$stateParams",
        function ($rootScope, $scope, monkey, $compile, camel, $stateParams) {
            $scope.action = $stateParams.action;
            var i18n = $scope.i18n;

            $scope.attachmentPassword = {
                label: $scope.i18n.common_term_psw_label+":",
                require: true,
                "display": false,
                "id": "attachmentFtsAuthenticPwd",
                "validate":"required:"+$scope.i18n.common_term_null_valid,
                "width": "240",
                "type":"password",
                "value":""
            };

            $scope.attachmentPasswordConfirm = {
                label: $scope.i18n.common_term_PswConfirm_label+":",
                require: true,
                "display": false,
                "id": "attachmentFtsAuthenticPwdConfirm",
                "extendFunction": ["attachmentPwdConfirm"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";attachmentPwdConfirm:"+$scope.i18n.common_term_pswDifferent_valid+";",
                "width": "240",
                "type":"password",
                "value":""
            };

            $scope.info = {
                filePath: {
                    label: i18n.common_term_fileTargetPath_label + ":",
                    require: true,
                    "width": "420",
                    "id": "create-package-filePath",
                    "tips": i18n.template_software_add_para_path_mean_tip,
                    "extendFunction": ["checkPathIsEmpty", "checkPath"],
                    "validate": "maxSize(256):" + i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256) + ";checkPathIsEmpty():" + i18n.common_term_null_valid + ";checkPath():" + i18n.common_term_formatpath_valid + ";",
                    "value": ""
                },
                installCmd: {
                    label: i18n.common_term_installCmd_label + ":",
                    require: true,
                    "id": "create-package-installCmd",
                    "extendFunction": ["checkSoftwareCmd"],
                    "value": "",
                    "width": "420",
                    "height": "60",
                    "tips": i18n.template_software_add_para_para_mean_tip,
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024") + ";checkSoftwareCmd(true):" + i18n.template_software_add_para_para_valid
                },
                unInstallCmd: {
                    label: i18n.common_term_uninstallCmd_label + ":",
                    require: false,
                    "id": "create-package-unInstallCmd",
                    "extendFunction": ["checkSoftwareCmd"],
                    "value": "",
                    "width": "420",
                    "height": "60",
                    "tips": i18n.template_software_add_para_para_mean_tip,
                    "validate": "maxSize(1024);" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024") + ";checkSoftwareCmd(false):" + i18n.template_software_add_para_para_valid
                },
                startCmd: {
                    label: i18n.common_term_startupCmd_label + ":",
                    require: false,
                    "id": "create-package-startCmd",
                    "extendFunction": ["checkSoftwareCmd"],
                    "value": "",
                    "width": "420",
                    "height": "60",
                    "tips": i18n.template_software_add_para_para_mean_tip,
                    "validate": "maxSize(1024);" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024") + ";checkSoftwareCmd(false):" + i18n.template_software_add_para_para_valid
                },
                stopCmd: {
                    label: i18n.common_term_StopCmd_label + ":",
                    require: false,
                    "id": "create-package-stopCmd",
                    "extendFunction": ["checkSoftwareCmd"],
                    "value": "",
                    "width": "420",
                    "height": "60",
                    "tips": i18n.template_software_add_para_para_mean_tip,
                    "validate": "maxSize(1024);" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024") + ";checkSoftwareCmd(false):" + i18n.template_software_add_para_para_valid
                },
                attachmentFile: {
                    label: i18n.common_term_attachment_label + "：",
                    "id": "addAttachmentBtn",
                    "text": i18n.common_term_add_button,
                    "createTemplate": function (id) {
                        var template = '<div id="' + id + '" class="attachment" style="margin-top:10px;">' +
                            '<div class="file-select" style="width :240px;">' +
                            '<div class="file-box" style="width :210px">' +
                            '<input type="text" ng-model="data.name" style="width :200px"' +
                            'class="file-input" readonly="true"/>' +
                            '</div>' +
                            '<div class="file-select-button-container" style="cursor: pointer;" ng-click="add(' + id + ')"></div>' +
                            '</div>' +
                            '<img src="../theme/default/images/delete.png" alt="../theme/default/images/delete.png" style="cursor: pointer;margin-top: 3px;margin-left: 6px;"' +
                            'width="16px" height="16px" ng-click="delete(' + id + ')"/>' +
                            '</div>';

                        var scope = $scope.$new(false);
                        scope.data = {
                            "id": id,
                            "name": ""
                        };
                        scope.add = function (id) {
                            // 向applet中添加文件
                            var fileName = "";
                            try {
                                fileName = FileUpload.openFtpSelectWindow(id);
                            } catch (e) {
                            }
                            scope.data.name = fileName;
                            $scope.service.attachmentMap[id] = fileName;

                            if ($stateParams.action !== "create" && !isEmptyObj($scope.service.attachmentMap)) {
                                $scope.attachmentPassword.display = true;
                                $scope.attachmentPasswordConfirm.display = true;
                            } else {
                                $scope.attachmentPassword.display = false;
                                $scope.attachmentPasswordConfirm.display = false;
                            }
                        };
                        scope["delete"] = function (id) {
                            // 删除applet中的文件
                            FileUpload.deleteFile(id);
                            $("#" + id).remove();
                            delete $scope.service.attachmentMap[id];

                            if ($stateParams.action !== "create" && !isEmptyObj($scope.service.attachmentMap)) {
                                $scope.attachmentPassword.display = true;
                                $scope.attachmentPasswordConfirm.display = true;
                            } else {
                                $scope.attachmentPassword.display = false;
                                $scope.attachmentPasswordConfirm.display = false;
                            }
                        };

                        var optDom = $compile($(template))(scope);
                        return optDom;
                    },
                    "addAttachment": function () {
                        if ($(".attachment").length === 10) {
                            return;
                        }
                        var template = $scope.info.attachmentFile.createTemplate(new Date().getMilliseconds());
                        $("#attachmentSelect").append(template);
                    },
                    "delete": function (id) {
                        $scope.service.deletedFiles.push($scope.service.initFiles[id]);
                        $scope.service.initFiles.splice(id, 1);
                    }
                },
                preBtn: {
                    "id": "create-script-step2-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        monkey.show = {
                            "basic": true,
                            "commandConfig": false,
                            "confirm": false,
                            "uploadFile": false
                        };
                        $("#" + $scope.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-script-step2-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var validFilePath = UnifyValid.FormValid($("#create-script-commandConfig"));
                        if (!validFilePath) {
                            return;
                        }

                        monkey.show = {
                            "basic": false,
                            "commandConfig": false,
                            "confirm": true,
                            "uploadFile": false
                        };
                        // 构造附加文件路径
                        var attachmentPaths = [];
                        var attachments = [];

                        _.each($scope.service.attachmentMap, function (item) {
                            var path = "/" + $scope.service.uploadPath + "/" + item;
                            attachmentPaths.push(path);
                            attachments.push(item);
                        });

                        $scope.service.attachments = attachments;

                        var action = $stateParams.action;
                        if (action === 'create') {
                            $scope.service.attachmentPaths = attachmentPaths;
                            $scope.service.addedFilePaths = attachmentPaths;

                        } else {
                            $scope.service.attachmentPaths = $scope.service.initFiles;
                            $scope.service.addedFilePaths = attachmentPaths;
                            var deletedFiles = [];
                            _.each($scope.service.deletedFiles, function (item) {
                                deletedFiles.push(item.fileName);
                            });
                            $scope.service.removedFilePaths = deletedFiles;
                        }

                        $scope.service.filePath = $("#create-package-filePath").widget().getValue();
                        $scope.service.installCmd = $("#create-package-installCmd").widget().getValue();
                        $scope.service.unInstallCmd = $("#create-package-unInstallCmd").widget().getValue();
                        $scope.service.startCmd = $("#create-package-startCmd").widget().getValue();
                        $scope.service.stopCmd = $("#create-package-stopCmd").widget().getValue();

                        if ($scope.service.addedFilePaths && $scope.service.addedFilePaths.length > 0 && action !== 'create') {
                            $scope.service.ftpInfo = {"pwd": $("#" + $scope.attachmentPassword.id).widget().getValue()};
                        }

                        $("#" + $scope.step.id).widget().next();
                    }
                },

                cancelBtn: {
                    "id": "create-script-step2-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            $scope.isShowTip = function () {
                if (document.getElementById("tipDiv").style.display === "none") {
                    $("#tipDiv").show();
                } else {
                    $("#tipDiv").hide();
                }
            };
            $scope.add = {
                id: "add",
                "click": function () {

                }
            };
            $scope.help = {
                id: "help",
                "click": function () {

                }
            };

            var isEmptyObj = function (obj) {
                for (var name in obj) {
                    return false;
                }
                return true;
            };

            UnifyValid.checkPathIsEmpty = function () {
                var value = $(this).val();

                // 目标路径为空，判断能否为空
                if (value === "") {
                    if ($scope.service.softwareType === "unknown" || $scope.service.initFiles.length !== 0 || !isEmptyObj($scope.service.attachmentMap)) {
                        return false;
                    }
                    if (($scope.service.softwareType === "rpm" || $scope.service.softwareType === "msi") && $.trim($("#create-package-installCmd").widget().getValue()) !== "") {
                        return false;
                    }
                }

                return true;
            };

            //验证文件目标路径是否为必填项
            UnifyValid.checkPath = function (param) {
                var value = $(this).val();

                if (value !== "") {
                    // 目标路径不为空
                    if ($scope.service.OSType === "Linux") {
                        //系统是linux,以/开头后边以数字大小写英文及下划线
                        if (/^[\/]{1}([\w\=]|[\w\=][\/])*$/.test(value)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    if ($scope.service.OSType === "Windows") {
                        //系统是Windows windows文件路径 如 "C:\test\"或者"C:\te=st test\"或者最后不带\
                        if (/^([a-zA-z]:)(\\[\w\=]+(\s[\w\=]+)*)*(\\)?$/.test(value)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }

                return true;
            };

            UnifyValid.attachmentPwdConfirm = function () {
                if ($("#" + $scope.attachmentPassword.id).widget().getValue() === $("#" + $scope.attachmentPasswordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            UnifyValid.checkSoftwareCmd = function (param) {
                var value = $(this).val();

                // 软件包添加和修改时当软件类型为unknown时，安装命令命令不能为空校验
                if ($scope.service.softwareType === "unknown" && $.trim(value) === "" && param[0] === "true") {
                    return false;
                }

                // 统计左右大括号个数
                var leftNum = 0; // 左括号个数
                var rightNum = 0; // 右括号个数
                for (var index = 0; index < value.length; index++) {
                    if (value[index] === '{') {
                        leftNum++;
                    } else if (value[index] === '}') {
                        rightNum++;
                    }

                    // ‘{’个数或‘}’个数大于10时，不满足条件约束
                    if (leftNum > 10 || rightNum > 10) {
                        return false;
                    }
                }

                // ‘{’和‘}’个数不相等，说明存在不匹配的括号，不满足约束
                if (leftNum !== rightNum) {
                    return false;
                }
                // ‘{’和‘}’个数为0的时，满足条件约束
                if (leftNum === 0 && rightNum === 0) {
                    return true;
                }

                // value中存在“{”，“}“，并且个数相等时，执行下面检测
                // 检测是否满足不嵌套，且成对出现的约束
                if (!/^([^{}]*\{[^{}]+\}[^{}]*)*$|^[^{}]*$/.test(value)) {
                    return false;
                }

                return true;
            };

            $rootScope.changeVal = function () {
                if ($scope.service.softwareType === "msi" || $scope.service.softwareType === "rpm") {
                    $scope.info.filePath.require = false;
                    $scope.info.installCmd.require = false;
                } else {
                    $scope.info.filePath.require = true;
                    $scope.info.installCmd.require = true;
                }
            };
        }
    ];
    return ctrl;
});
