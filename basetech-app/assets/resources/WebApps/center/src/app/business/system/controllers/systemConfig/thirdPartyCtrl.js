/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/services/mask",
    "app/services/exceptionService"
], function ($, angular, Window, Message, UnifyValid, mask, Exception) {
    "use strict";

    var thirdPartyCtrl = ["$scope", "$compile", "$state", "camel", "validator", function ($scope, $compile, $state, camel, validator) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;

        $scope.adRadioGroup = {
            "id": "adStatusRadioGroup",
            "label": "AD服务启用状态:",
            "values": [
                {
                    "key": "open",
                    "text": "启用",
                    "checked": true
                },
                {
                    "key": "close",
                    "text": "禁用",
                    "checked": false
                }
            ],
            "layout": "horizon",
            "change": function () {
                setDisable();
            }
        };
        $scope.domainTextbox = {
            "label": "AD域名:",
            "require": true,
            "id": "domainTextbox",
            "value": "",
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";maxSize(1024):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "1024"})
        };
        //IP1输入框
        $scope.ip1Box = {
            "label": $scope.i18n.common_term_IP_label + ":",
            "require": true,
            "width": "150",
            "value": "",
            "extendFunction": ["ipValidator"],
            "id": "adIp1Box",
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";ipValidator(adIp1Box):" + $scope.i18n.common_term_formatIP_valid
        };
        UnifyValid.ipValidator = function (id) {
            var ip = $("#" + id).widget().getValue();
            return validator.ipFormatCheck(ip);
        };
        $scope.port1Textbox = {
            "label": "普通连接端口:",
            "require": true,
            "id": "port1Textbox",
            "value": "",
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(65535):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535}) +
                ";minValue(0):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535})
        };
        //SSL复选框
        $scope.ssl1Checkbox = {
            "label": "",
            "id": "ssl1Checkbox",
            "text": "配置SSL连接",
            "change": function () {
                setDisable();
            }
        };
        $scope.ssl1Textbox = {
            "label": "SSL连接端口:",
            "require": true,
            "disable": true,
            "id": "ssl1Textbox",
            "value": "",
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(65535):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535}) +
                ";minValue(0):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535})
        };
        //证书文件1选择框
        $scope.file1 = {
            "label": "证书文件路径:",
            "require": false,
            "disable": true,
            "action": "/goku/rest/v1.5/irm/1/vms/file",
            "id": "certificateFile1Box",
            "enableDetail": false,
            "enableProgress": true,
            "fileType": ".cer;.crt;.key;.pem",
            "fileObjName": "fileObjNameId1",
            "maxCount": 1,
            "beforeSubmit": function (event, file) {
                mask.show();
            },
            "select": function (event, file) {
                $scope.file1 = file.name;
            },
            "selectError": function (event, file, errorMsg) {
                var content = "INVALID_FILE_TYPE" === errorMsg ? "文件类型不合法，请选择后缀类型为cer，crt，key或pem的文件。" : $scope.i18n.common_term_unknownError_label;
                new Message({
                    type: 'error',
                    width: '360px',
                    height: '200px',
                    title: $scope.i18n.log_term_warning_label,
                    content: content
                }).show();
                $("#" + $scope.file1.id).find(".tiny-file-input").val("");
            },
            "complete": function (event, responseText) {
                mask.hide();
                $("#" + $scope.file1.id).find(".tiny-file-input").val("");
            }
        };

        //IP2输入框
        $scope.standbyCheckbox = {
            "label": "备用AD服务器",
            "id": "standbyCheckbox",
            "text": "启用",
            "change": function () {
                setDisable();
            }
        };
        $scope.ip2Box = {
            "label": $scope.i18n.common_term_IP_label + ":",
            "require": true,
            "disable": true,
            "width": "150",
            "value": "",
            "extendFunction": ["ipValidator", "ipRepeatCheck"],
            "id": "adIp2Box",
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";ipValidator(adIp2Box):" + $scope.i18n.common_term_formatIP_valid +
                ";ipRepeatCheck:主备IP地址不能重复，请重新输入。"
        };
        UnifyValid.ipRepeatCheck = function () {
            var mainIp = $("#" + $scope.ip1Box.id).widget().getValue();
            var standbyIp = $("#" + $scope.ip2Box.id).widget().getValue();
            if (mainIp === standbyIp) {
                return false;
            }
            return true;
        };
        $scope.port2Textbox = {
            "label": "普通连接端口:",
            "require": true,
            "disable": true,
            "id": "port2Textbox",
            "value": "",
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(65535):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535}) +
                ";minValue(0):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535})
        };
        //SSL复选框
        $scope.ssl2Checkbox = {
            "label": "",
            "id": "ssl2Checkbox",
            "text": "配置SSL连接",
            "change": function () {
                setDisable();
            }
        };
        $scope.ssl2Textbox = {
            "label": "SSL连接端口:",
            "require": true,
            "disable": true,
            "id": "ssl2Textbox",
            "value": "",
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(65535):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535}) +
                ";minValue(0):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535})
        };
        //证书文件2选择框
        $scope.file2 = {
            "label": "证书文件路径:",
            "require": false,
            "disable": true,
            "action": "/goku/rest/v1.5/irm/1/vms/file",
            "id": "certificateFile2Box",
            "enableDetail": false,
            "enableProgress": true,
            "fileType": ".ovf",
            "fileObjName": "fileObjNameId2",
            "maxCount": 1,
            "beforeSubmit": function (event, file) {
                mask.show();
            },
            "select": function (event, file) {
                $scope.file2 = file.name;
            },
            "selectError": function (event, file, errorMsg) {
                var content = "INVALID_FILE_TYPE" === errorMsg ? "文件类型不合法，请选择后缀类型为cer，crt，key或pem的文件。" : $scope.i18n.common_term_unknownError_label;
                new Message({
                    type: 'error',
                    width: '360px',
                    height: '200px',
                    title: $scope.i18n.log_term_warning_label,
                    content: content
                }).show();
                $("#" + $scope.file2.id).find(".tiny-file-input").val("");
            },
            "complete": function (event, responseText) {
                mask.hide();
                $("#" + $scope.file2.id).find(".tiny-file-input").val("");
            }
        };
        //保存按钮
        $scope.saveButton = {
            "id": "thirdPartySaveButton",
            "text": $scope.i18n.common_term_save_label,
            "click": function () {
                var result = UnifyValid.FormValid($("#thirdPartyConfigDiv"));
                if (!result) {
                    return;
                }
                var params = { };
                if ($("#" + $scope.adRadioGroup.id).widget().opChecked("close")) {
                    params.ldapConfig = null;
                    setAdConfig(params);
                    return;
                }
                params.ldapConfig = {
                    domainName: $("#" + $scope.domainTextbox.id).widget().getValue(),
                    ip: $("#" + $scope.ip1Box.id).widget().getValue()
                };
                if ($("#" + $scope.ssl1Checkbox.id).widget().option("checked")) {
                    params.ldapConfig.configSsl = true;
                    params.ldapConfig.sslPort = $("#" + $scope.ssl1Textbox.id).widget().getValue();
                }
                else {
                    params.ldapConfig.configSsl = false;
                    params.ldapConfig.commonPort = $("#" + $scope.port1Textbox.id).widget().getValue();
                }
                if ($("#" + $scope.standbyCheckbox.id).widget().option("checked")) {
                    params.ldapConfig.startStandby = true;
                    params.ldapConfig.standbyIp = $("#" + $scope.ip2Box.id).widget().getValue();
                    if ($("#" + $scope.ssl2Checkbox.id).widget().option("checked")) {
                        params.ldapConfig.configStandbySsl = true;
                        params.ldapConfig.standbySslPort = $("#" + $scope.ssl2Textbox.id).widget().getValue();
                    }
                    else {
                        params.ldapConfig.configStandbySsl = false;
                        params.ldapConfig.standbyPort = $("#" + $scope.port2Textbox.id).widget().getValue();
                    }
                }
                else {
                    params.ldapConfig.startStandby = false;
                }
                setAdConfig(params);
            }
        };

        function setDisable() {
            var open = $("#" + $scope.adRadioGroup.id).widget().opChecked("open");
            $("#" + $scope.domainTextbox.id).widget().option("disable", !open);
            $("#" + $scope.ip1Box.id).widget().option("disable", !open);
            $("#" + $scope.ssl1Checkbox.id).widget().option("disable", !open);
            $("#" + $scope.standbyCheckbox.id).widget().option("disable", !open);

            var ssl1 = $("#" + $scope.ssl1Checkbox.id).widget().option("checked");
            $("#" + $scope.port1Textbox.id).widget().option("disable", !open || ssl1);
            $("#" + $scope.ssl1Textbox.id).widget().option("disable", !open || !ssl1);
            $("#" + $scope.file1.id).widget().setDisable(!open || !ssl1);

            var standby = $("#" + $scope.standbyCheckbox.id).widget().option("checked");
            $("#" + $scope.ip2Box.id).widget().option("disable", !open || !standby);
            $("#" + $scope.ssl2Checkbox.id).widget().option("disable", !open || !standby);

            var ssl2 = $("#" + $scope.ssl2Checkbox.id).widget().option("checked");
            $("#" + $scope.port2Textbox.id).widget().option("disable", !open || !standby || ssl2);
            $("#" + $scope.ssl2Textbox.id).widget().option("disable", !open || !standby || !ssl2);
            $("#" + $scope.file2.id).widget().setDisable(!open || !standby || !ssl2);
        }

        function getAdConfig() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/system/adconfig"},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var configInfo = data && data.configInfo;
                if (!configInfo) {
                    $("#" + $scope.adRadioGroup.id).widget().opChecked("close", true);
                    setDisable();
                    return;
                }
                $("#" + $scope.domainTextbox.id).widget().option("value", configInfo.domainName);
                $("#" + $scope.ip1Box.id).widget().option("value", configInfo.ip);
                if (configInfo.configSsl) {
                    $("#" + $scope.ssl1Checkbox.id).widget().option("checked", true);
                    $("#" + $scope.ssl1Textbox.id).widget().option("value", configInfo.sslPort);
                }
                else {
                    $("#" + $scope.port1Textbox.id).widget().option("value", configInfo.commonPort);
                }
                if (configInfo.startStandby) {
                    $("#" + $scope.standbyCheckbox.id).widget().option("checked", true);
                    $("#" + $scope.ip2Box.id).widget().option("value", configInfo.standbyIp);
                    if (configInfo.configStandbySsl) {
                        $("#" + $scope.ssl2Checkbox.id).widget().option("checked", true);
                        $("#" + $scope.ssl2Textbox.id).widget().option("value", configInfo.standbySslPort);
                    }
                    else {
                        $("#" + $scope.port2Textbox.id).widget().option("value", configInfo.standbyPort);
                    }
                }
                setDisable();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function setAdConfig(params) {
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/system/adconfig"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var options = {
                    type: "prompt",
                    content: "操作成功。",
                    height: "150px",
                    width: "350px",
                    modal: true
                };
                var msg = new Message(options);
                msg.show();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        getAdConfig();
    }];
    return thirdPartyCtrl;
});