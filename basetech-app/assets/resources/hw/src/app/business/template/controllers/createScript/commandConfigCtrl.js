/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    'tiny-common/UnifyValid'
], function ($, angular, UnifyValid) {
    "use strict";
    var ctrl = ["$scope", "monkey", "$compile", "camel", "$stateParams",
        function ($scope, monkey, $compile, camel, $stateParams) {
            var i18n = $scope.i18n;
            $scope.info = {
                filePath: {
                    label: i18n.common_term_fileTargetPath_label + ":",
                    require: true,
                    "width": "420",
                    "id": "create-script-filePath",
                    "tips": i18n.template_script_add_para_path_mean_tip,
                    "extendFunction": ["checkScriptPath"],
                    "validate": "required:" + i18n.common_term_null_valid + ";maxSize(256):" + i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256) + ";checkScriptPath():" + i18n.common_term_formatpath_valid + ";",
                    "value": ""
                },
                command: {
                    label: i18n.common_term_runCmd_label + ":",
                    require: true,
                    "id": "create-script-command",
                    "value": "",
                    "type": "multi",
                    "width": "420",
                    "height": "60",
                    "extendFunction": ["checkScriptCmd"],
                    "tips": i18n.template_software_add_para_para_valid,
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024") + ";required:" + i18n.common_term_null_valid + ";checkScriptCmd(true):" + i18n.template_software_add_para_para_valid
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

                        //验证文件目标路径是否填写
                        var validFilePath = UnifyValid.FormValid($("#create-script-filePath"));
                        if (!validFilePath) {
                            return;
                        }

                        //验证安装路径是否填写
                        var validInstallCmd = UnifyValid.FormValid($("#create-script-command"));
                        if (!validInstallCmd) {
                            return;
                        }

                        monkey.show = {
                            "basic": false,
                            "commandConfig": false,
                            "confirm": true,
                            "uploadFile": false
                        };
                        $scope.service.filePath = $("#create-script-filePath").widget().getValue();
                        $scope.service.command = $("#create-script-command").widget().getValue();
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

            UnifyValid.checkScriptPath = function () {
                var value = $(this).val();

                var osType = $scope.service.OSType;
                if (osType === "Linux") {
                    //系统是linux,以/开头后边以数字大小写英文及下划线
                    if (/^[\/]{1}([\w\=]|[\w\=][\/])*$/.test(value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                if (osType === "Windows") {
                    //系统是Windows windows文件路径 如 "C:\test\"或者"C:\te=st test\"或者最后不带\
                    if (/^([a-zA-z]:)(\\[\w\=]+(\s[\w\=]+)*)*(\\)?$/.test(value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                return true;
            };

            UnifyValid.checkScriptCmd = function (param) {
                var value = $(this).val();

                // 脚本添加和修改时当软件类型为unknown时，安装命令命令不能为空校验
                if ($scope.service.packageType === "unknown" && $.trim(value) === "" && param) {
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

        }
    ];
    return ctrl;
});
