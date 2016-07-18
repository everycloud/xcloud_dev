/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-5-5
 */
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/business/system/services/snmpManageService",
    "app/services/messageService"],
    function ($, angular, UnifyValid, ValidatorService, SnmpManageService, MessageService) {
        "use strict";
        var snmManageCtrl = ["$scope", "$q", "camel", "$rootScope", "validator", function ($scope, $q, camel, $rootScope, validator) {
            var user = $rootScope.user;
            $scope.hasSNMPManageOperateRight = user.privilege.role_role_add_option_snmpHandle_value;

            var snmpManageService = new SnmpManageService($q, camel);
            var messageService = new MessageService();
            var validatorService = new ValidatorService();

            var DEFAULT_SNMP_INFO = {
                "snmpVersion": 3,//默认值为SNMPv3
                "authGeneric": "SHA",
                "lan": window.urlParams.lang === "en" ? 1 : 2,//1为英文，2为中文
                "privacyProtocol": "AES128",
                "alarmFlag": 1,//0不上报，1上报
                "monitorFlag": 1,//0不上报，1上报
                "outTime": 3000
            };
            UnifyValid.ipFormatCheck = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                return validatorService.ipFormatCheck(val);
            };
            UnifyValid.ipRangeCheck = function (id) {
                id = id[0] || id;
                var ip = $("#" + id).widget().getValue();
                var value = validatorService.getIpValue(ip);
                var maxIpValue = 255 * (1 + 256 + 256 * 256 + 256 * 256 * 256);
                if (value === 0 || value === maxIpValue) {
                    return validator.i18nReplace(i18n.common_term_IPnotSet1_valid, {"1": "0.0.0.0", "2": "255.255.255.255"});
                }
                else {
                    return "";
                }
            };
            UnifyValid.snmpMgrName = function (id) {
                id = id[0] || id;
                var value = $("#" + id).widget().getValue();
                //由英文、数字以及下划线组成。长度范围为8个～128个字符。
                if (/^[\d|a-z|A-Z|_]{1,128}$/.test(value)) {
                    return true;
                }
                return false;
            };
            UnifyValid.snmpPWD = function (id) {
                id = id[0] || id;
                var value = $("#" + id).widget().getValue();
                //长度范围为8个～128个字符、至少两种字符的组合:小写字母、大写字母、数字、特殊字符。
                if (id == $scope.authPassWord.id || id == $scope.privPassWord.id) {
                    if ($("#checkComplexPasswordControl").widget().option("checked") == false) {
                        return true;
                    }
                }
                if (id == $scope.readName.id || id == $scope.writeName.id) {
                    if ($("#checkComplexControl").widget().option("checked") == false) {
                        return true;
                    }
                }
                var upperReg = /[A-Z]+/g;
                var lowerReg = /[a-z]+/g;
                var numberReg = /\d+/g;
                var specialReg = /[^a-z|A-Z|0-9]+/g;
                var validators = [upperReg, lowerReg, numberReg , specialReg ];
                var len = validators.length;
                //记录字符类型数量
                var total = 0;
                while (total < 2 && len > 0) {
                    len--;
                    if (validators[len].test(value)) {
                        total++;
                    }
                }
                //种类小于两种校验不通过
                if (total < 2) {
                    return false;
                }
                return true;
            };
            UnifyValid.confirmSnmpPassWord = function (id) {
                var confirmId = id[0] || id;
                var confirmValue = $("#" + confirmId).widget().getValue();
                //pre confirm
                var preId = confirmId.substr(7);
                preId = preId.substr(0, 1).toLowerCase() + preId.substr(1);
                var preValue = $("#" + preId).widget().getValue();
                //判断确认秘密跟前面密码是否一致。
                return preValue === confirmValue;
            };
            UnifyValid.snmp20xEmptySleepTime = function (id) {
                id = id[0] || id;
                var emptySleepTimeValue = $("#" + $scope.emptySleepTime.id).widget().getValue();
                var emptySleepTimeNumValue = +emptySleepTimeValue;
                if (!isNaN(emptySleepTimeNumValue)) {
                    var value = $("#" + id).widget().getValue();
                    return value <= 20 * emptySleepTimeNumValue;
                }
                //不符合比较条件
                return true;
            };
            UnifyValid.groupNameCheck = function (id) {
                if ($("#checkComplexControl").widget().option("checked") == false) {
                    return true;
                }
                var value = $("#" + id).widget().getValue();
                //由大写字母，小写字母和数字组成
                var regex = /^[a-zA-Z\d]+$/;
                if (!regex.test(value)) {
                    return false;
                }
                return validator.checkMustContain(value);
            };
            UnifyValid.groupNameMinSizeCheck = function (id) {
                if ($("#checkComplexControl").widget().option("checked") == false) {
                    return true;
                }
                var value = $("#" + id).widget().getValue();

                if (value.length < parseInt(8, 10)) {
                    return false;
                }
                return true;
            };
            UnifyValid.snmpMinSizeCheck = function (id) {
                if ($("#checkComplexPasswordControl").widget().option("checked") == false) {
                    return true;
                }
                var value = $("#" + id).widget().getValue();

                if (value.length < parseInt(8, 10)) {
                    return false;
                }
                return true;
            };
            UnifyValid.notZero = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                return val != "0";
            };
            UnifyValid.ipNotStartWith127 = function (id) {
                id = id[0] || id;
                var value = $("#" + id).widget().getValue();
                return validator.ipNotStartWith127(value);
            };

            var i18n = $scope.i18n;

            $scope.snmpV3 = true;
            $scope.inputWidth = 200;
            $scope.pageTitle = i18n.sys_term_snmp_label;

            var range8to128Desc = i18n.sprintf(i18n.common_term_length_valid, 8, 128);
            var range1to128Desc = i18n.common_term_composition1_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 128);
            $scope.snmpMgrName = {
                "id": "snmpMgrNameId",
                "label": i18n.sys_term_manageSiteName_label + ":",
                "require": true,
                "desc": range1to128Desc,
                "extendFunction": ["snmpMgrName"],
                "validate": "required:" + i18n.common_term_null_valid + ";snmpMgrName(snmpMgrNameId):" + range1to128Desc
            };

            $scope.port = {
                "id": "portId",
                "label": i18n.common_term_maintenancePort_value + ":",
                "require": true,
                "extendFunction": ["notZero"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";integer:" + i18n.common_term_PositiveIntegers_valid +
                    ";port:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535) +
                    ";notZero(portId):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535)
            };
            $scope.checkComplexControl = {
                "id": "checkComplexControl",
                "text": i18n.sys_term_verifyReadWriteCommunityName_label || "是否对读团体名和写团体名做复杂度校验",
                "checked": true
            };
            $scope.checkComplexPasswordControl = {
                "id": "checkComplexPasswordControl",
                "text": $scope.i18n.sys_term_verifyAuthenticationKeyPsw_label || "校验认证密码和密钥密码的复杂度",
                "checked": true
            };
            var pwdDesc = (i18n.common_term_compositionInclude6_valid || "只能由英文大写字母、英文小写字母、数字、特殊字符组成，且必须包含至少两种字符，且不等于用户名。");
            $scope.readName = {
                "id": "readNameId",
                "label": i18n.device_term_readCommunityName_label + ":",
                "value": "",
                "require": true,
                "desc": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 128),
                "extendFunction": ["snmpPWD", "groupNameMinSizeCheck"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";groupNameMinSizeCheck(readNameId):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                    ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                    ";snmpPWD(readNameId):" + pwdDesc
            };

            $scope.writeName = {
                "id": "writeNameId",
                "label": i18n.device_term_writeCommunityName_label + ":",
                "value": "",
                "require": true,
                "desc": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 128),
                "extendFunction": ["snmpPWD", "groupNameMinSizeCheck"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";groupNameMinSizeCheck(writeNameId):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                    ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                    ";snmpPWD(writeNameId):" + pwdDesc
            };

            var outTimeDesc = i18n.sprintf(i18n.common_term_rangeInteger_valid, 1000, 60000);
            $scope.outTime = {
                "id": "outTimeId",
                "label": i18n.device_term_timeoutms_label + ":",
                "require": true,
                "desc": outTimeDesc,
                "validate": "required:" + i18n.common_term_null_valid +
                    ";integer:" + i18n.common_term_PositiveIntegers_valid +
                    ";maxValue(60000):" + outTimeDesc + ";minValue(1000):" + outTimeDesc
            };

            //安全用户名
            $scope.userName = {
                "id": "userNameId",
                "label": i18n.common_term_secuUserName_label + ":",
                "require": true,
                "desc": range1to128Desc,
                "validate": "required:" + i18n.common_term_null_valid + ";maxSize(128):" + range1to128Desc
            };

            //认证密码
            $scope.authPassWord = {
                "id": "authPassWordId",
                "label": i18n.common_term_authenticPsw_label + ":",
                "type": "password",
                "require": true,
                "desc": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 128),
                "extendFunction": ["snmpPWD", "snmpMinSizeCheck"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";snmpMinSizeCheck(authPassWordId):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                    ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                    ";snmpPWD(authPassWordId):" + pwdDesc
            };

            $scope.confirmAuthPassWord = {
                "id": "confirmAuthPassWordId",
                "label": i18n.common_term_authenticPswConfirm_label + ":",
                "type": "password",
                "require": true,
                "extendFunction": ["confirmSnmpPassWord"],
                "validate": "confirmSnmpPassWord(confirmAuthPassWordId):" + i18n.common_term_pswDifferent_valid || "两次输入的密码不一致，请重新输入。"
            };

            //密钥密码
            $scope.privPassWord = {
                "id": "privPassWordId",
                "label": i18n.common_term_secretKeyPsw_label + ":",
                "type": "password",
                "require": true,
                "desc": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 128),
                "extendFunction": ["snmpPWD", "snmpMinSizeCheck"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";snmpMinSizeCheck(privPassWordId):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                    ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                    ";snmpPWD(privPassWordId):" + pwdDesc
            };
            //确认密钥密码
            $scope.confirmPrivPassWord = {
                "id": "confirmPrivPassWordId",
                "label": i18n.common_term_keyPswConfirm_label + ":",
                "type": "password",
                "require": true,
                "extendFunction": ["confirmSnmpPassWord"],
                "validate": "confirmSnmpPassWord(confirmPrivPassWordId):" + i18n.common_term_pswDifferent_valid || "两次输入的密码不一致，请重新输入。"
            };

            //IP地址
            $scope.ip = {
                "id": "ipId",
                "label": i18n.common_term_IP_label + ":",
                "type": "ipv4",
                "require": true,
                "extendFunction": ["ipFormatCheck", "ipRangeCheck", "ipNotStartWith127"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(ipId):" + i18n.common_term_formatIP_valid +
                    ";ipRangeCheck(ipId)" +
                    ";ipNotStartWith127(ipId):" + $scope.i18n.vpc_term_IPcantbe127_valid
            };

            var emptySleepDesc = i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 86400);
            //发送周期(s)
            $scope.emptySleepTime = {
                "id": "emptySleepTimeId",
                "label": i18n.common_term_sendCycles_label + ":",
                "require": true,
                "desc": emptySleepDesc,
                "validate": "required:" + i18n.common_term_null_valid + ";integer:" + emptySleepDesc +
                    ";maxValue(86400):" + emptySleepDesc + ";minValue(1):" + emptySleepDesc
            };

            //发送最大数量
            var maxSizeDesc = i18n.sys_snmp_set_para_sendNum_valid || "取值范围是1到n之间的整数，n为发送周期的20倍。";
            $scope.snmpSendMaxSize = {
                "id": "snmpSendMaxSizeId",
                "label": i18n.common_term_sendMaxNum_label + ":",
                "require": true,
                "desc": i18n.sys_snmp_set_para_maxSend_mean_tip || "如果一个周期内发送告警太多，可能导致告警被SNMP管理站拒绝。",
                "extendFunction": ["snmp20xEmptySleepTime"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";integer:" + maxSizeDesc +
                    ";snmp20xEmptySleepTime(snmpSendMaxSizeId):" + maxSizeDesc
            };

            $scope.snmpMgrDesc = {
                "id": "snmpMgrDescId",
                "label": i18n.sys_term_manageSiteDesc_label + ":",
                "type": "multi",
                "height": "90px",
                "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            };

            $scope.saveBtn = {
                "id": "systemSavebtn",
                "text": i18n.common_term_save_label,
                //是否有snmp配置权限
                "disable": !user.privilege.role_role_add_option_snmpHandle_value,
                "save": function () {
                    if (UnifyValid.FormValid($("#snmpMrgInfo"))) {
                        $scope.snmpMgrInfo.set();
                    }
                }
            };
            var selectConfig = {
                snmpVersion: {
                    snmpVersion2: {
                        "value": 2,
                        "label": "SNMPv2c"
                    },
                    snmpVersion3: {
                        "value": 3,
                        "label": "SNMPv3"
                    }
                },
                authGeneric: {
                    authGeneric_md5: {
                        "value": "MD5",
                        "label": "MD5"
                    },
                    authGeneric_sha: {
                        "value": "SHA",
                        "label": "SHA1"
                    }
                },
                lan: {
                    english: {
                        "value": "1",
                        "label": i18n.common_term_english_label
                    },
                    chinese: {
                        "value": "2",
                        "label": i18n.common_term_chinese_label
                    }
                },
                privacyProtocol: {
                    privacyProtocol_des56: {
                        "value": "DES",
                        "label": "DES56"
                    },
                    privacyProtocol_aes128: {
                        "value": "AES128",
                        "label": "AES128"
                    },
                    privacyProtocol_aes192: {
                        "value": "AES192",
                        "label": "AES192"
                    },
                    privacyProtocol_aes256: {
                        "value": "AES256",
                        "label": "AES256"
                    }
                },
                monitorType: {
                    //告警
                    alarmFlag: {
                        "value": 1,
                        "label": i18n.alarm_term_alarm_label,
                        "disable": !$scope.hasSNMPManageOperateRight
                    },
                    //性能
                    monitorFlag: {
                        "value": 1,
                        "label": i18n.perform_term_perform_label,
                        "disable": !$scope.hasSNMPManageOperateRight
                    }
                }
            };
            var selectValues = {
                snmpVersion: [],
                authGeneric: [],
                lan: [],
                privacyProtocol: [],
                monitorType: []
            };
            for (var configKey in selectConfig) {
                var config = selectConfig[configKey];
                for (var p in config) {
                    selectValues[configKey].push({
                        //兼容select、checkbox id
                        "selectId": p,
                        "key": p,
                        //兼容select、checkbox label
                        "label": config[p].label,
                        "text": config[p].label,
                        "disable": !!config[p].disable
                    });
                }
            }

            $scope.snmpVersion = {
                "id": "snmpVersionId",
                "label": (i18n.common_term_SNMPversion_label || "SNMP版本") + ":",
                "require": true,
                "values": selectValues.snmpVersion,
                "change": function () {
                    var selectId = $("#snmpVersionId").widget().getSelectedId();
                    $scope.snmpV3 = selectId === 'snmpVersion3';
                    $scope.snmpVersion.value = selectConfig.snmpVersion[selectId].value;
                }
            };

            //语言
            $scope.lan = {
                "id": "lanId",
                "require": true,
                "label": (i18n.common_term_language_label || "语言") + ":",
                "values": selectValues.lan,
                "change": function () {
                    var selectId = $("#lanId").widget().getSelectedId();
                    $scope.lan.value = selectConfig.lan[selectId].value;
                }
            };

            //认证类型
            $scope.authGeneric = {
                "id": "authGenericId",
                "label": (i18n.common_term_authenticType_label || "认证类型") + ":",
                "values": selectValues.authGeneric,
                "require": true,
                "change": function () {
                    //如果放到提交的时候在获取，会节省一点
                    var selectId = $("#authGenericId").widget().getSelectedId();
                    $scope.authGeneric.value = selectConfig.authGeneric[selectId].value;
                }
            };

            //密钥类型
            $scope.privacyProtocol = {
                "id": "privacyProtocolId",
                "label": (i18n.common_term_secretKeyType_label || "密钥类型") + ":",
                "require": true,
                "values": selectValues.privacyProtocol,
                "change": function () {
                    //如果放到提交的时候在获取，会节省一点
                    var selectId = $("#privacyProtocolId").widget().getSelectedId();
                    $scope.privacyProtocol.value = selectConfig.privacyProtocol[selectId].value;
                }
            };

            //上报数据类型
            $scope.monitorType = {
                "id": "monitorTypeId",
                "label": i18n.sys_term_deleting_label + ":",
                "spacing": {
                    "width": '50px',
                    "height": '30px'
                },
                "layout": "horizon",
                "values": selectValues.monitorType
            };

            var parseData = function (resolvedValue) {
                //默认值有前端来维护
                resolvedValue = $.extend({}, DEFAULT_SNMP_INFO, resolvedValue);
                //仅input支持双向绑定
                $scope.readName.value = resolvedValue.readName || "";
                $scope.writeName.value = resolvedValue.writeName || "";
                $scope.userName.value = resolvedValue.userName || "";
                $scope.authPassWord.value = resolvedValue.authPassWord || "";
                $scope.confirmAuthPassWord.value = resolvedValue.authPassWord || "";
                $scope.privPassWord.value = resolvedValue.privPassWord || "";
                $scope.confirmPrivPassWord.value = resolvedValue.privPassWord || "";
                $scope.outTime.value = resolvedValue.outTime || "";
                $scope.snmpMgrName.value = resolvedValue.snmpMgrName || "";
                $scope.snmpMgrDesc.value = resolvedValue.snmpMgrDesc || "";
                $scope.ip.value = resolvedValue.ip || "";
                $scope.port.value = resolvedValue.port || "";
                $scope.emptySleepTime.value = resolvedValue.emptySleepTime || "";
                $scope.snmpSendMaxSize.value = resolvedValue.snmpSendMaxSize || "";

                //select
                $scope.snmpVersion.value = resolvedValue.snmpVersion;
                $scope.authGeneric.value = resolvedValue.authGeneric;
                $scope.lan.value = resolvedValue.lan;
                $scope.privacyProtocol.value = resolvedValue.privacyProtocol;

                var selects = ["snmpVersion", "authGeneric", "lan", "privacyProtocol"];
                for (var i = 0, len = selects.length; i < len; i++) {
                    var key = selects[i];
                    var config = selectConfig[key];
                    for (var p in config) {
                        if (config[p].value == resolvedValue[key]) {
                            $("#" + key + "Id").widget().opChecked(p);
                            break;
                        }
                    }
                }
                $scope.snmpV3 = selectConfig.snmpVersion.snmpVersion3.value == resolvedValue.snmpVersion;

                //checkbox
                var checkboxGroup = $("#" + $scope.monitorType.id).widget();
                checkboxGroup.opChecked("monitorFlag", 1 == resolvedValue.monitorFlag);
                checkboxGroup.opChecked("alarmFlag", 1 == resolvedValue.alarmFlag);
            };

            $scope.snmpMgrInfo = {
                get: function () {
                    var promise = snmpManageService.getSnmpMgrInfo({
                        userId: user.id,
                        orgId: 1
                    });
                    promise.then(function (resolvedValue) {
                        parseData(resolvedValue);
                    });
                },
                set: function () {
                    var snmpVersion = $scope.snmpVersion.value;
                    var params = {
                        outTime: $("#" + $scope.outTime.id).widget().getValue(),
                        snmpMgrName: $("#" + $scope.snmpMgrName.id).widget().getValue(),
                        snmpMgrDesc: $("#" + $scope.snmpMgrDesc.id).widget().getValue(),
                        ip: $("#" + $scope.ip.id).widget().getValue(),
                        port: $("#" + $scope.port.id).widget().getValue(),
                        emptySleepTime: $("#" + $scope.emptySleepTime.id).widget().getValue(),
                        snmpSendMaxSize: $("#" + $scope.snmpSendMaxSize.id).widget().getValue(),
                        snmpVersion: snmpVersion,
                        lan: $scope.lan.value
                    };
                    if (snmpVersion == "2") {
                        $.extend(params, {
                            readName: $("#" + $scope.readName.id).widget().getValue(),
                            writeName: $("#" + $scope.writeName.id).widget().getValue(),
                            checkComplex: $("#checkComplexControl").widget().option("checked")
                        });
                    } else {
                        $.extend(params, {
                            userName: $("#" + $scope.userName.id).widget().getValue(),
                            authGeneric: $scope.authGeneric.value,
                            privacyProtocol: $scope.privacyProtocol.value,
                            authPassWord: $("#" + $scope.authPassWord.id).widget().getValue(),
                            privPassWord: $("#" + $scope.privPassWord.id).widget().getValue(),
                            checkComplex: $("#checkComplexPasswordControl").widget().option("checked")
                        });
                    }

                    //checkbox
                    params.monitorFlag = 0;
                    params.alarmFlag = 0;
                    var checkboxGroup = $("#" + $scope.monitorType.id).widget();
                    var checked = checkboxGroup.opChecked("checked");
                    for (var i = 0, len = checked.length; i < len; i++) {
                        params[checked[i]] = 1;
                    }

                    var promise = snmpManageService.setSnmpMgrInfo({
                        userId: user.id,
                        orgId: 1,
                        params: JSON.stringify(params)
                    });
                    promise.then(function (resolvedValue) {
                        messageService.okMsgBox(i18n.common_term_saveSucceed_label);
                    });
                }
            };

            $scope.snmpMgrInfo.get();
        }];
        return snmManageCtrl;
    });