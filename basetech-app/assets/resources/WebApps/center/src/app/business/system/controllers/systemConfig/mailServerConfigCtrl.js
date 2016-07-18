define(['jquery',
    "tiny-lib/angular",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/business/monitor/services/alarmService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"], function ($, angular, TextBox, Button, Window, Checkbox, Message, ExceptionService, AlarmService, UnifyValid, ValidatorService) {
    "use strict";

    var mailServerConfig = ["$scope", "$compile", "camel", 'validator', function ($scope, $compile, camel, validator) {
        $scope.privilege = $("html").scope().user.privilege;
        $scope.operateRight = $scope.privilege.role_role_add_option_alarmHandle_value;
        var exception = new ExceptionService();
        var user = $("html").scope().user;
        $scope.isZh = $scope.i18n.locale == "zh";

        $scope.isShow = false;

        UnifyValid.ipCheck = function (id) {
            var ip = $("#" + id).widget().getValue();
            return validator.ipValidator(ip);
        };
        $scope.mailServer = {
            mailServerAddress: {
                "label": ($scope.i18n.common_term_emailServerAddr_label || "邮件服务器地址") + ":",
                "value": "",
                "width":"150px",
                "disable": !$scope.operateRight,
                "id": "mailServerAddress",
                "extendFunction": ["ipCheck"],
                "validate": "ipCheck(mailServerAddress):" + $scope.i18n.common_term_formatIP_valid + ";"
            },
            mailServerPort: {
                "label": ($scope.i18n.common_term_port_label || "端口") + ":",
                "require": true,
                "value": "",
                "disable": !$scope.operateRight,
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 65535) || "范围为1-65535",
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 65535) || "范围为1-65535" ) +
                    ";maxValue(65535):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 65535) || "范围为1-65535"),
                "id": "mailServerPort"
            },
            sendMailAddress: {
                "label": ($scope.i18n.common_term_sendAddr_label || "发送地址") + ":",
                "require": true,
                "value": "",
                "disable": !$scope.operateRight,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符。"),
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";email():" + ($scope.i18n.common_term_format_valid || "不符合格式要求") +
                    ";maxSize(64):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符。"),
                "id": "sendMailAddress"
            },
            mailUserName: {
                "label": ($scope.i18n.common_term_userName_label || "用户名") + ":",
                "require": true,
                "value": "",
                "disable": !$scope.operateRight,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符。"),
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";maxSize(64):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符。"),
                "id": "mailUserName"
            },
            mailPassword: {
                "label": ($scope.i18n.common_term_psw_label || "密码") + ":",
                "require": true,
                "value": "",
                "disable": !$scope.operateRight,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 128) || "长度范围是1个～128个字符。"),
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 128) || "长度范围是1个～128个字符。"),
                "id": "mailPassword",
                "type": "password"
            },
            confirmMailPassword: {
                "label": ($scope.i18n.common_term_PswConfirm_label || "确认密码") + ":",
                "require": true,
                "value": "",
                "disable": !$scope.operateRight,
                "id": "confirmMailPassword",
                "tooltip": "",
                "extendFunction": ["equalPassWord"],
                "validate": "equalPassWord():" + ($scope.i18n.common_term_pswDifferent_valid || "两次输入的密码不一致，请重新输入。"),
                "type": "password"
            },
            useSSLProtocol: {
                "label": "",
                "checked": false,
                "require": false,
                "disable": !$scope.operateRight,
                "id": "useSSLProtocol",
                "text": ($scope.i18n.device_term_serverSSLlink_label || "服务器要求安全连接(SSL)")
            },
            testEmail: {
                "label": ($scope.i18n.alarm_term_testEmail_label || "测试邮箱") + ":",
                "require": false,
                "value": "",
                "disable": !$scope.operateRight,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符。"),
                "extendFunction":["testEmailValidate"],
                "validate": "testEmailValidate():",
                "id": "testEmail"
            },
            sendPeriod: {
                "label": ($scope.i18n.common_term_sendCycleM_label || "发送周期(分钟)") + ":",
                "require": true,
                "value": "",
                "disable": !$scope.operateRight,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 10, 1440) || "10 ～ 1440（含10和1440）之间的整数。"),
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer():" + ($scope.i18n.common_term_integer_valid || "取值是整数") +
                    ";minValue(10):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 10, 1440) || "范围为10-1440" ) +
                    ";maxValue(1440):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 10, 1440) || "范围为10-1440" ),
                "id": "sendPeriod"
            },
            sendMaxSize: {
                "label": ($scope.i18n.common_term_emailMaxCapacityMB_label || "邮件最大容量(MB)") + ":",
                "require": true,
                "value": "",
                "disable": !$scope.operateRight,
                "tooltip": ($scope.i18n.alarm_config_email_para_maxCap_mean_valid || "1～50（含1和50）之间的整数。该值需同时满足收发件箱对单邮件大小的要求。如实际附件大小大于该值，系统将自动分多封邮件发送。"),
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer():" + ($scope.i18n.common_term_integer_valid || "取值是整数") +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 50) || "范围为1-50" ) +
                    ";maxValue(50):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 50) || "范围为1-50" ),
                "id": "sendMaxSize"
            },
            language: [
                {"id": "language_zh_CN", "text": ($scope.i18n.common_term_chinese_label || "中文"), "checked": false, "disable": !$scope.operateRight},
                {"id": "language_en_US", "text": ($scope.i18n.common_term_english_label || "英文"), "checked": false, "disable": !$scope.operateRight}
            ],
            sendLanguage: {
                "label": ($scope.i18n.common_term_emailLanguage_label || "邮件内容语言") + ":",
                "require": true
            }
        };

        UnifyValid.equalPassWord = function () {
            if ($("#" + $scope.mailServer.mailPassword.id).widget().getValue() === $("#" + $scope.mailServer.confirmMailPassword.id).widget().getValue()) {
                return true;
            } else {
                return false;
            }
        };
        UnifyValid.testEmailValidate = function () {
            if(!$scope.isShow)
            {
                return true;
            }
            else
            {
                var testEmailContent = $("#" + $scope.mailServer.testEmail.id).widget().getValue();
                var checkReg = /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;

                if(testEmailContent.length == 0)
                {
                    $scope.isShow = false;
                    return $scope.i18n.common_term_null_valid || "不能为空";
                }
                else if(testEmailContent.length>64 || testEmailContent.length<1)
                {
                    $scope.isShow = false;
                    return $scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64);
                }
                else if(!checkReg.test(testEmailContent))
                {
                    $scope.isShow = false;
                    return $scope.i18n.common_term_format_valid || "不符合格式要求";
                }
                else
                {
                    $scope.isShow = false;
                    return true;
                }
            }
        };

        function validateData(mode) {

            var result = UnifyValid.FormValid($("#" + $scope.mailServer.mailServerAddress.id)) &
                UnifyValid.FormValid($("#" + $scope.mailServer.mailServerPort.id)) &
                UnifyValid.FormValid($("#" + $scope.mailServer.mailUserName.id)) &
                UnifyValid.FormValid($("#" + $scope.mailServer.mailPassword.id)) &
                UnifyValid.FormValid($("#" + $scope.mailServer.confirmMailPassword.id)) &
                UnifyValid.FormValid($("#" + $scope.mailServer.sendMailAddress.id)) &
                UnifyValid.FormValid($("#" + $scope.mailServer.testEmail.id)) &
                (mode == "update" ? UnifyValid.FormValid($("#" + $scope.mailServer.sendPeriod.id)) : true) &
                (mode == "update" ? UnifyValid.FormValid($("#" + $scope.mailServer.sendMaxSize.id)) : true);

            return result;
        }

        function getInfo(mode) {
            var info = {};
            info.mailServerAddress = $("#" + $scope.mailServer.mailServerAddress.id).widget().getValue();
            info.mailServerPort = $("#" + $scope.mailServer.mailServerPort.id).widget().getValue();
            info.mailUserName = $("#" + $scope.mailServer.mailUserName.id).widget().getValue();
            info.mailPassword = $("#" + $scope.mailServer.mailPassword.id).widget().getValue();
            info.sendMailAddress = $("#" + $scope.mailServer.sendMailAddress.id).widget().getValue();
            info.sendPeriod = $("#" + $scope.mailServer.sendPeriod.id).widget().getValue();
            info.sendMaxSize = $("#" + $scope.mailServer.sendMaxSize.id).widget().getValue();
            info.useSSLProtocol = $("#" + $scope.mailServer.useSSLProtocol.id).widget().option("checked");
            info.mailServerAddress = $("#" + $scope.mailServer.mailServerAddress.id).widget().getValue();

            if (mode != "update") {
                info.testMailAddress = $("#" + $scope.mailServer.testEmail.id).widget().getValue();
            }

            info.language = [];
            if ($("#" + $scope.mailServer.language[0].id).widget().option("checked")) {
                info.language.push("zh_CN");
            }
            if ($("#" + $scope.mailServer.language[1].id).widget().option("checked")) {
                info.language.push("en_US");
            }
            return info;
        }

        $scope.testBtn = {
            "id": "testBtn",
            "text": $scope.i18n.common_term_test_label || "测试",
            "click": function () {
                $scope.isShow = true;
                var result = UnifyValid.FormValid($("#" + $scope.mailServer.testEmail.id))
                $scope.isShow = false;
                if(result)
                {
                    test();
                }
            }
        };

        $scope.saveBtn = {
            "id": "saveBtn",
            "text": $scope.i18n.common_term_save_label || "保存",
            "click": function () {
                update();
            }
        };

        function test() {

            if (!validateData("test")) {
                return;
            }

            var info = getInfo("test");
            AlarmService.testMailServerConfigInfo(
                JSON.stringify(info), user,
                function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            var confirmShowDialog = new Message({
                                "type": "prompt",
                                "title": $scope.i18n.alarm_term_warning_label || "提示",
                                "content": $scope.i18n.alarm_config_email_info_testOK_msg || "告警邮件配置测试成功。",
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: $scope.i18n.common_term_ok_button || "确定",
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn : true,
                                        default: true
                                    }
                                ]
                            });
                            confirmShowDialog.setButton("okBtn", function () {
                                confirmShowDialog.destroy();
                            });
                            ;
                            confirmShowDialog.show();
                        });
                    }
                    if (result.result == false) {
                        exception.doException(result.data, null);
                    }
                });
        }

        function update() {
            if (!validateData("update")) {
                return;
            }
            var info = getInfo("update");
            AlarmService.modifyMailServerConfigInfo(
                JSON.stringify(info), user,
                function (result) {
                    if (result.result == false) {
                        exception.doException(result.data, null);
                    }
                    else{
                        var successMsg = new Message({
                            "type": "prompt",
                            "content": $scope.i18n.common_term_operationSucceed_msg,
                            "height": 100,
                            "width": 300
                        });
                        successMsg.show();
                    }
                });
        }

        function getData() {
            AlarmService.getMailServerConfigInfo(
                user,
                function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {

                            var info = result.data;

                            if (info == null) {
                                $("#" + $scope.mailServer.mailServerPort.id).widget().option("value", "25");
                                $("#" + $scope.mailServer.sendPeriod.id).widget().option("value", "10");
                                $("#" + $scope.mailServer.sendMaxSize.id).widget().option("value", "1");
                                if ($scope.isZh) {
                                    $scope.mailServer.language[0].checked = true;
                                }
                                else {
                                    $scope.mailServer.language[1].checked = true;
                                }
                                return;
                            }

                            $("#" + $scope.mailServer.mailServerAddress.id).widget().option("value", info.mailServerAddress);
                            $("#" + $scope.mailServer.mailServerPort.id).widget().option("value", info.mailServerPort);
                            $("#" + $scope.mailServer.mailUserName.id).widget().option("value", info.mailUserName);
                            $("#" + $scope.mailServer.sendMailAddress.id).widget().option("value", info.sendMailAddress);
                            $("#" + $scope.mailServer.sendPeriod.id).widget().option("value", info.sendPeriod);
                            $("#" + $scope.mailServer.sendMaxSize.id).widget().option("value", info.sendMaxSize);
                            $scope.mailServer.useSSLProtocol.checked = info.useSSLProtocol;
                            if(info.language && info.language.length)
                            {
                                for (var i = 0; i < info.language.length; i++) {

                                    if (info.language[i] == "zh_CN") {
                                        $scope.mailServer.language[0].checked = true;
                                    }
                                    else if (info.language[i] == "en_US") {
                                        $scope.mailServer.language[1].checked = true;
                                    }
                                }
                            }
                            else
                            {
                                if ($scope.isZh) {
                                    $scope.mailServer.language[0].checked = true;
                                }
                                else {
                                    $scope.mailServer.language[1].checked = true;
                                }
                            }
                        });

                    }
                    if (result.result == false) {
                        exception.doException(result.data, null);
                    }
                });
        }

        getData();

    }];
    return mailServerConfig;
});