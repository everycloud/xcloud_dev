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
    "app/business/system/services/ipManageService",
    "app/services/messageService"],
    function ($, angular, UnifyValid, ValidatorService, IpManageService, MessageService) {
        "use strict";
        var ipManageCtrl = ["$scope", "$q", "camel", "$state", function ($scope, $q, camel, $state) {
            var user = $scope.user;
            var i18n = $scope.i18n;
            var INPUT_WIDTH = 200;

            var ipManageService = new IpManageService($q, camel);
            var messageService = new MessageService();
            var validatorService = new ValidatorService();

            var deployMode = $scope.deployMode === "top" ? "" : "irm/";
            var hasIPManageOperateRight = $scope.hasIPManageOperateRight = true;

            $scope.edithaMode = false;
            $scope.trapSupport = $scope.deployMode !== "top";
            //当前tiny版本不支持contentChange，暂不检查是否变化
            $scope.ipsChanged = true;

            UnifyValid.ipFormatCheck = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                return validatorService.ipFormatCheck(val);
            };
            UnifyValid.notEndWith0or255 = function (id) {
                id = id[0] || id;
                var ip = $("#" + id).widget().getValue();
                var value = validatorService.getIpValue(ip);
                var mod = value % 256;
                if (mod === 0 || mod === 255) {
                    return i18n.common_term_IPendWithout_valid || "IP地址最后一段数字不能为0或255。";
                }
                else {
                    return "";
                }
            };
            UnifyValid.subNetMask = function (id) {
                id = id[0] || id;
                var ip = $("#" + id).widget().getValue();
                return validatorService.maskValidator(ip);
            };
            UnifyValid.confirmPWD = function (id) {
                id = id[0] || id;
                var pwd = $("#" + id).widget().getValue();
                var confirmPwd = $("#re" + id).widget().getValue();
                return pwd === confirmPwd;
            };
            $scope.pageTitle = i18n.common_term_managerIP_label || "管理IP地址";


            $scope.fmFloatIP = {
                "id": "fmFloatIP",
                "label": (i18n.common_term_floatIP_label || "浮动IP地址") + ":",
                "singleLabel": (i18n.common_term_IP_label || "IP地址") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "value": "",
                "extendFunction": ["ipFormatCheck", "notEndWith0or255"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(fmFloatIP):" + i18n.common_term_formatIP_valid +
                    ";notEndWith0or255(fmFloatIP)",
                "contentChange": function () {
                    isChange();
                }
            };

            $scope.fmActiveIP = {
                "id": "fmActiveIP",
                "label": (i18n.common_term_masterIP_label || "主用IP地址") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "value": "",
                "extendFunction": ["ipFormatCheck", "notEndWith0or255"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(fmActiveIP):" + i18n.common_term_formatIP_valid +
                    ";notEndWith0or255(fmActiveIP)",
                "contentChange": function () {
                    isChange();
                }
            };

            $scope.fmStandbyIP = {
                "id": "fmStandbyIP",
                "label": (i18n.common_term_standbyIP_label || "备用IP地址") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "value": "",
                "extendFunction": ["ipFormatCheck", "notEndWith0or255"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(fmStandbyIP):" + i18n.common_term_formatIP_valid +
                    ";notEndWith0or255(fmStandbyIP)",
                "contentChange": function () {
                    isChange();
                }
            };

            $scope.standbyPassword = {
                "id": "standbyPassword",
                "label": (i18n.common_term_psw_label || "密码") + ":",
                "type": "password",
                "width": INPUT_WIDTH,
                "toolTip": i18n.sys_IPmgr_modify_para_psw_mean_msg || "备节点虚拟机操作系统的“galaxmanager”帐户密码",
                "require": true,
                "value": "",
                "validate": "required:" + i18n.common_term_null_valid,
                "contentChange": function () {
                    isChange();
                }
            };

            $scope.restandbyPassword = {
                "id": "restandbyPassword",
                "label": (i18n.common_term_PswConfirm_label || "确认密码") + ":",
                "type": "password",
                "width": INPUT_WIDTH,
                "toolTip": i18n.sys_IPmgr_modify_para_psw_mean_msg || "备节点虚拟机操作系统的“galaxmanager”帐户密码",
                "require": true,
                "value": "",
                "extendFunction": ["confirmPWD"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";confirmPWD(standbyPassword)",
                "contentChange": function () {
                    isChange();
                }
            };

            $scope.mask = {
                "id": "mask",
                "label": (i18n.common_term_SubnetMask_label || "子网掩码") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "value": "",
                "extendFunction": ["ipFormatCheck", "subNetMask"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(mask):" + i18n.common_term_formatIP_valid +
                    ";subNetMask(mask):" + i18n.common_term_formatSubnetMask_valid,
                "contentChange": function () {
                    isChange();
                }
            };

            $scope.gateway = {
                "id": "gateway",
                "label": (i18n.common_term_gateway_label || "网关") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "value": "",
                "extendFunction": ["ipFormatCheck", "notEndWith0or255"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(gateway):" + i18n.common_term_formatIP_valid +
                    ";notEndWith0or255(gateway)",
                "contentChange": function () {
                    isChange();
                }
            };

            var hasEqualIps = function (ips) {
                if (ips && ips.length > 1) {
                    var collection = {};
                    var num = 0;
                    for (var i = 0, len = ips.length; i < len; i++) {
                        var ip = ips[i];
                        collection[ip] = true;
                    }
                    for (var p in collection) {
                        num++;
                    }
                    return num !== ips.length;
                }
                return false;
            };

            var validIPs = function () {
                var data = getFormData();
                var manageIPInfo = data.manageIPInfo;
                var mask = validatorService.getIpValue(manageIPInfo.mask);
                var subNet = validatorService.getIpValue(manageIPInfo.gateway) & mask;
                var msg = "";

                var valid = (subNet === (validatorService.getIpValue(manageIPInfo.fmFloatIP) & mask)) &&
                    (!manageIPInfo.haMode ||
                        ((subNet === (validatorService.getIpValue(manageIPInfo.fmActiveIP) & mask)) &&
                            (subNet === (validatorService.getIpValue(manageIPInfo.fmStandbyIP) & mask))
                            )
                        );

                if (valid) {
                    var ips = [manageIPInfo.gateway, manageIPInfo.fmFloatIP];
                    manageIPInfo.haMode && (ips = ips.concat([manageIPInfo.fmActiveIP, manageIPInfo.fmStandbyIP]));
                    valid = !hasEqualIps(ips);
                    !valid && (msg = i18n.common_term_conflictIP_valid || "IP不能相同。");
                } else {
                    msg = i18n.common_term_IPmaskGateNotMatch_valid || "IP地址、子网掩码和网关三者不匹配。";
                }
                return msg;
            };

            $scope.editBtn = {
                "id": "editBtn",
                "text": i18n.common_term_modify_button || "修改",
                "display": hasIPManageOperateRight,
                "click": function () {
                    $scope.$apply(function () {
                        $scope.edithaMode = true;
                    });
                }
            };

            $scope.saveBtn = {
                "id": "saveBtn",
                "text": i18n.common_term_save_label || "保存",
                "display": hasIPManageOperateRight,
                "click": function () {
                    if (UnifyValid.FormValid($("#ipMrgInfo"))) {
                        var msg = validIPs();
                        if (msg) {
                            messageService.failMsgBox(msg);
                        } else {
                            messageService.confirmMsgBox({
                                content: i18n.sys_IPmgr_modify_info_confirm_msg,
                                callback: $scope.ipMgrInfo.set
                            });
                        }
                    }
                }
            };

            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": i18n.common_term_cancle_button || "取消",
                "display": hasIPManageOperateRight,
                "click": function () {
                    $scope.$apply(function () {
                        $scope.edithaMode = false;
                    });
                }
            };

            $scope.updateBtn = {
                "id": "updateBtn",
                "text": i18n.common_term_update_button || "更新",
                "display": hasIPManageOperateRight,
                "click": function () {
                    $scope.trapInfo.update();
                }
            };

            var haModeConfig = {
                float: {
                    "value": "float",
                    "label": i18n.common_term_activeStandbyMode_label || "主备模式"
                },
                single: {
                    "value": "single",
                    "label": i18n.common_term_singleMode_label || "单节点模式"
                }
            };
            var gethaModeValues = function (val) {
                var values = [];
                for (var p in haModeConfig) {
                    values.push({
                        "key": p,
                        "text": haModeConfig[p].label,
                        "disable": true,//永远不可编辑
                        "checked": val && val === p
                    });
                }
                return values;
            };
            var sethaModeData = function (haMode) {
                var key = haMode;
                !haModeConfig[key] && ( key = haMode ? "float" : "single");
                $scope.haMode.value = key;
                $scope.haMode.text = haModeConfig[key].label;
                $scope.haMode.valueBoolean = key !== 'single';
                $scope.fmActiveIP.label = haModeConfig[key].ipLabel;
                $scope.haMode.values = gethaModeValues(key);
            };

            $scope.haMode = {
                "id": "haMode",
                "label": (i18n.common_term_activeStandbyMode_label || "运行模式") + ":",
                "require": true,
                "width": INPUT_WIDTH,
                "values": gethaModeValues(),
                "valueBoolean": false,
                "change": function () {
                    var checkedKey = $("#" + $scope.haMode.id).widget().opChecked("checked");
                    sethaModeData(checkedKey);
                    isChange();
                }
            };

            var parseData = function (resolvedValue) {
                var info = resolvedValue || {};
                if (info) {
                    $scope.fmFloatIP.value = info.fmFloatIP;
                    $scope.fmActiveIP.value = info.fmActiveIP;
                    $scope.fmStandbyIP.value = info.fmStandbyIP;
                    $scope.mask.value = info.mask;
                    $scope.gateway.value = info.gateway;
                    $scope.haMode.serverValue = info.haMode;
                    sethaModeData(info.haMode);
                }
            };

            var isChange = function () {
                var data = getFormData();
                if ($scope.haMode.valueBoolean !== $scope.haMode.serverValue ||
                    $scope.fmFloatIP.value !== data.manageIPInfo.fmFloatIP ||
                    $scope.fmActiveIP.value !== data.manageIPInfo.fmActiveIP ||
                    $scope.fmStandbyIP.value !== data.manageIPInfo.fmStandbyIP ||
                    $scope.mask.value !== data.manageIPInfo.mask ||
                    $scope.gateway.value !== data.manageIPInfo.gateway) {
                    $scope.ipsChanged = true;
                } else {
                    $scope.ipsChanged = false;
                }
            };

            var getFormData = function () {
                var data = {
                    manageIPInfo: {
                        fmFloatIP: $("#" + $scope.fmFloatIP.id).widget().getValue(),
                        mask: $("#" + $scope.mask.id).widget().getValue(),
                        gateway: $("#" + $scope.gateway.id).widget().getValue(),
                        haMode: $scope.haMode.valueBoolean
                    }
                };
                if ($scope.haMode.valueBoolean) {
                    data.manageIPInfo.fmActiveIP = $("#" + $scope.fmActiveIP.id).widget().getValue();
                    data.manageIPInfo.fmStandbyIP = $("#" + $scope.fmStandbyIP.id).widget().getValue();
                    data.standbyPassword = $("#" + $scope.standbyPassword.id).widget().getValue();
                }
                return data;
            };

            $scope.ipMgrInfo = {
                get: function () {
                    var promise = ipManageService.getIPs({
                        userId: user.id,
                        deployMode: deployMode
                    });
                    promise.then(function (resolvedValue) {
                        parseData(resolvedValue);
                    });
                },
                set: function () {
                    var params = getFormData();

                    var promise = ipManageService.setIPs({
                        userId: user.id,
                        deployMode: deployMode,
                        params: JSON.stringify(params)
                    });
                    promise.then(function (resolvedValue) {
                        $scope.edithaMode = false;
                        var ip = params.manageIPInfo.fmFloatIP;
                        var link = "<a href='https://" + params.manageIPInfo.fmFloatIP + "'>" + params.manageIPInfo.fmFloatIP + "</a>";
                        messageService.okMsgBox(i18n.sprintf(i18n.sys_IPmgr_modify_info_process_msg, link));
                    });
                }
            };

            $scope.trapInfo = {
                update: function () {
                    var promise = ipManageService.updateTrapIP({
                        userId: user.id
                    });
                    promise.then(function (resolvedValue) {
                        messageService.confirmMsgBox({
                            content: i18n.task_view_task_info_confirm_msg,
                            callback: function () {
                                $state.go("system.taskCenter");
                            }
                        });
                    });
                }
            };

            $scope.ipMgrInfo.get();
        }];
        return ipManageCtrl;
    });