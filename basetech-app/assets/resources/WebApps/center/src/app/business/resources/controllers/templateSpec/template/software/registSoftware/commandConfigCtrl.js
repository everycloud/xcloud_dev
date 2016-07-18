define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'upload/FileUpload',
    "tiny-widgets/Message"],
    function ($, angular, UnifyValid, FileUpload, Message) {
        "use strict";

        var cmdConfigCtrl = ["$scope", "$state", "$stateParams", "$compile", function ($scope, $state, $stateParams, $compile) {

            var isEmptyObj = function(obj)
            {
                for (var name in obj)
                {
                    return false;
                }
                return true;
            };

            UnifyValid.checkPathIsEmpty = function () {
                var value = $(this).val();

                // 目标路径为空，判断能否为空
                if(value == ""){
                    if($scope.service.model.fileType == "unknown" || $scope.service.initFiles.length != 0 || !isEmptyObj($scope.service.attachmentMap)){
                        return false;
                    }
                    if(($scope.service.model.fileType == "rpm" || $scope.service.model.fileType == "msi") && jQuery.trim($("#" + $scope.installCommand.id).widget().getValue()) != ""){
                        return false;
                    }
                }

                return true;
            };

            UnifyValid.checkPath = function () {
                var value = $(this).val();

                if(value != ""){
                    // 目标路径不为空
                    if ($scope.service.model.osType == "Linux") {
                        //系统是linux,以/开头后边以数字大小写英文及下划线
                        if (/^[\/]{1}([\w\=]|[\w\=][\/])*$/.test(value)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    if ($scope.service.model.osType == "Windows") {
                        //系统是Windows,以盘符(例如: c:)大小写英文开头+:+\ 后边以数字大小写英文及下划线
                        if (/^[A-Za-z]{1}[:]{1}[\\]{1}([\w\=\s]|[\w\=\s][\\])*$/.test(value)) {
                            var paths = value.split('\\');
                            var path = "";
                            for (var i = 1; i < paths.length; i++) {
                                path = paths[i];
                                if (path && (path[0] == " " || path[path.length - 1] == " ")) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }

                return true;
            };

            // 扩展UnifyValid
            UnifyValid.checkSoftwareCmd = function (param) {
                var value = $(this).val();

                // 软件包添加和修改时当软件类型为unknown时，安装命令命令不能为空校验
                if ($scope.service.model.fileType == "unknown" && jQuery.trim(value) == "" && param[0] == "true") {
                    return false;
                }

                // 统计左右大括号个数
                var leftNum = 0; // 左括号个数
                var rightNum = 0; // 右括号个数
                for(var index = 0; index < value.length; index++)
                {
                    if(value[index] == '{')
                    {
                        leftNum++;
                    }
                    else if(value[index] == '}')
                    {
                        rightNum++;
                    }

                    // ‘{’个数或‘}’个数大于10时，不满足条件约束
                    if(leftNum > 10 || rightNum > 10)
                    {
                        return false;
                    }
                }

                // ‘{’和‘}’个数不相等，说明存在不匹配的括号，不满足约束
                if(leftNum != rightNum)
                {
                    return false;
                }
                // ‘{’和‘}’个数为0的时，满足条件约束
                if(leftNum == 0 && rightNum == 0)
                {
                    return true;
                }

                // value中存在“{”，“}“，并且个数相等时，执行下面检测
                // 检测是否满足不嵌套，且成对出现的约束
                if(!/^([^{}]*\{[^{}]+\}[^{}]*)*$|^[^{}]*$/.test(value))
                {
                    return false;
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

            $scope.addAttachment = {
                label: $scope.i18n.common_term_attachment_label+":",
                require: false,
                "id":"addAttachmentBtn",
                "text":$scope.i18n.common_term_add_button,
                "createTemplate":function (id) {
                    var template ='<div id="' + id + '" class="attachment" style="margin-top:10px;">' +
                                    '<div class="file-select" style="width :240px;">'+
                                        '<div class="file-box" style="width :210px">'+
                                            '<input type="text" ng-model="data.name" style="width :200px"' +
                                                'class="file-input" readonly="true"/>'+
                                        '</div>' +
                                        '<div class="file-select-button-container" style="cursor: pointer;" ng-click="add('+ id +')"></div>'+
                                    '</div>' +
                                    '<img src="../theme/default/images/delete.png" alt="../theme/default/images/delete.png" style="cursor: pointer;margin-top: 3px;margin-left: 6px;"' +
                                        'width="16px" height="16px" ng-click="delete('+ id +')"/>' +
                                    '</div>';

                    var scope = $scope.$new(false);
                    scope.data = {
                        "id":id,
                        "name":""
                    };
                    scope.add = function (id) {
                        // 向applet中添加文件
                        var fileName = undefined;
                        try {
                            fileName = FileUpload.openFtpSelectWindow(id);
                        }
                        catch (e) {
                        }

                        scope.data.name = fileName;
                        $scope.service.attachmentMap[id] = fileName;

                        if ($stateParams.action != "create" && !isEmptyObj($scope.service.attachmentMap)) {
                            $scope.attachmentPassword.display = true;
                            $scope.attachmentPasswordConfirm.display = true;
                        } else {
                            $scope.attachmentPassword.display = false;
                            $scope.attachmentPasswordConfirm.display = false;
                        }
                    };
                    scope.delete = function (id) {
                        // 删除applet中的文件
                        FileUpload.deleteFile(id);
                        $("#" + id).remove();
                        delete $scope.service.attachmentMap[id];

                        if ($stateParams.action != "create" && !isEmptyObj($scope.service.attachmentMap)) {
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
                "addAttachment":function () {
                    if ($(".attachment").length + $scope.addAttachment.files.length == 8) {
                        return;
                    }
                    var template = $scope.addAttachment.createTemplate(new Date().getMilliseconds());
                    $("#attachmentSelect").append(template);
                },
                "files":[],
                "delete":function(id) {
                    $scope.service.deletedFiles.push($scope.service.initFiles[id]);
                    $scope.service.initFiles.splice(id, 1);
                    $scope.addAttachment.files.splice(id, 1);
                }
            };

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

            $scope.destinationPath = {
                label: $scope.i18n.common_term_fileTargetPath_label+":",
                require: true,
                "id": "cmdConfigPath",
                "tooltip":$scope.i18n.template_software_add_para_path_mean_tip,
                "extendFunction" : ["checkPathIsEmpty", "checkPath"],
                "validate":"maxSize(256):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256)+";checkPathIsEmpty():"+$scope.i18n.common_term_null_valid+";checkPath():"+$scope.i18n.common_term_formatpath_valid+";",
                "width": "240"
            };

            $scope.installCommand = {
                label: $scope.i18n.common_term_installCmd_label+":",
                require: true,
                "id": "cmdConfigInstall",
                "extendFunction" : ["checkSoftwareCmd"],
                "value": "",
                "width": "240",
                "tooltip": $scope.i18n.template_software_add_para_para_mean_tip,
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)+";checkSoftwareCmd(true):"+$scope.i18n.template_software_add_info_cmd_label
            };
            $scope.unInstallCommand = {
                label: $scope.i18n.common_term_uninstallCmd_label+":",
                require: false,
                "extendFunction" : ["checkSoftwareCmd"],
                "id": "cmdConfigUninstall",
                "value": "",
                "width": "240",
                "tooltip": $scope.i18n.template_software_add_para_para_mean_tip,
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)+";checkSoftwareCmd(false):"+$scope.i18n.template_software_add_info_cmd_label
            };
            $scope.startCommand = {
                label: $scope.i18n.common_term_startupCmd_label+":",
                require: false,
                "extendFunction" : ["checkSoftwareCmd"],
                "id": "cmdConfigStart",
                "value": "",
                "width": "240",
                "tooltip": $scope.i18n.template_software_add_para_para_mean_tip,
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)+";checkSoftwareCmd(false):"+$scope.i18n.template_software_add_info_cmd_label
            };
            $scope.stopCommand = {
                label: $scope.i18n.common_term_StopCmd_label+":",
                require: false,
                "extendFunction" : ["checkSoftwareCmd"],
                "id": "cmdConfigStop",
                "value": "",
                "width": "240",
                "tooltip": $scope.i18n.template_software_add_para_para_mean_tip,
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)+";checkSoftwareCmd(false):"+$scope.i18n.template_software_add_info_cmd_label
            };

            $scope.backBtn = {
                id: "cmdConfigBackBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_back_button,
                tip: "",
                back: function () {
                    $scope.service.show = "baseInfo";
                    $("#"+$scope.service.step.id).widget().pre();
                }
            };

            $scope.nextBtn = {
                id: "cmdConfigNextBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    var valid = UnifyValid.FormValid($("#registSoftwareCmdConfig"));
                    if (!valid) {
                        return;
                    }

                    if ($scope.checkDuplicatedFile()) {
                        return;
                    }

                    for (var index in $scope.service.attachmentMap) {
                        if (FileUpload.getFileSize(index.toString()) > 1024*1024*1) {
                            var options = {
                                "type": "error",
                                "content": $scope.i18n.sprintf($scope.i18n.common_term_fileMaxWithValue_valid, "1M"),
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }
                    }

                    // 构造附加文件路径
                    var attachmentPaths = [];
                    var attachments = [];
                    for (var index in $scope.service.attachmentMap) {
                        var path = "/" + $scope.service.uploadPath + "/" + $scope.service.attachmentMap[index];
                        attachmentPaths.push(path);
                        attachments.push($scope.service.attachmentMap[index]);
                    }

                    $scope.service.attachments = attachments;

                    var action = $stateParams.action;
                    if (action === 'create') {
                        $scope.service.model.attachmentPaths = attachmentPaths;
                    } else {
                        $scope.service.model.addedFilePaths = attachmentPaths;

                        var deletedFiles = [];
                        for (var index in $scope.service.deletedFiles) {
                            deletedFiles.push($scope.service.deletedFiles[index]);
                        }
                        $scope.service.model.removedFilePaths = deletedFiles;

                        for (var index in $scope.addAttachment.files) {
                            $scope.service.attachments.push($scope.addAttachment.files[index]);
                        }

                        if ($scope.service.model.addedFilePaths && $scope.service.model.addedFilePaths.length > 0) {
                            $scope.service.ftpInfo.pwd = $("#" + $scope.attachmentPassword.id).widget().getValue();
                        }
                    }

                    $scope.service.model.destinationPath = $("#" + $scope.destinationPath.id).widget().getValue();
                    $scope.service.model.installCommand = $("#" + $scope.installCommand.id).widget().getValue();
                    $scope.service.model.unInstallCommand = $("#" + $scope.unInstallCommand.id).widget().getValue();
                    $scope.service.model.startCommand = $("#" + $scope.startCommand.id).widget().getValue();
                    $scope.service.model.stopCommand = $("#" + $scope.stopCommand.id).widget().getValue();

                    $scope.$emit($scope.registSoftwareEvents.toConfirm, $scope.model);
                    $scope.service.show = "confirm";
                    $("#"+$scope.service.step.id).widget().next();
                }
            };

            $scope.cancelBtn = {
                id: "cmdConfigCancelBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go($scope.service.from, {});
                }
            };

            $scope.action = $stateParams.action;

            /**
             * 初始化操作
             */
            $scope.init = function () {
                var action = $stateParams.action;
                if (action === 'create') {
                    // do nothing
                    return;
                }

                // 事件处理
                $scope.$on($scope.registSoftwareEvents.softwareInfoInit, function (event, msg) {
                    // 修改时，初始化页面数据
                    $scope.addAttachment.files = $scope.service.initFiles;
                    $scope.service.model.destinationPath = msg.destinationPath;
                    $scope.service.model.installCommand = msg.installCommand;
                    $scope.service.model.unInstallCommand = msg.unInstallCommand;
                    $scope.service.model.startCommand = msg.startCommand;
                    $scope.service.model.stopCommand = msg.stopCommand;

                    $("#" + $scope.destinationPath.id).widget().option("value", $scope.service.model.destinationPath);
                    $("#" + $scope.installCommand.id).widget().option("value", $scope.service.model.installCommand);
                    $("#" + $scope.unInstallCommand.id).widget().option("value", $scope.service.model.unInstallCommand);
                    $("#" + $scope.startCommand.id).widget().option("value", $scope.service.model.startCommand);
                    $("#" + $scope.stopCommand.id).widget().option("value", $scope.service.model.stopCommand);
                });
            };

            $scope.init();

            // 事件处理
            $scope.$on($scope.registSoftwareEvents.baseInfoChangedFromParent, function (event, msg) {
                // 类型是msi或rpm，可以不填安装命令和文件目标路径

                if (msg && msg.fileType == "unknown") {
                    $scope.destinationPath.require = true;
                    $scope.installCommand.require = true;
                } else {
                    $scope.destinationPath.require = false;
                    $scope.installCommand.require = false;
                }

            });
        }];

        return cmdConfigCtrl;
    });

