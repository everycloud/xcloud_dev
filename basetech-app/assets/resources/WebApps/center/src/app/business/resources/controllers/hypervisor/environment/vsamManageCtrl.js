/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/messageService",
    "app/business/resources/services/hypervisor/environment/vsamManageService"],
    function ($, angular, Message, Exception, httpService, UnifyValid, ValidatorService, MessageService, VSAMManageService) {
        "use strict";
        var vsamManageCtrl = ["$scope", "camel", "$q", function ($scope, camel, $q) {
            var user = $("html").scope().user;
            var i18n = $scope.i18n = $("html").scope().i18n;
            var windowWidget = $("#vsamManageWindow").widget();
            var vsamInfo = windowWidget.option("vsamInfo");

            var INPUT_WIDTH = 200;
            var validatorService = new ValidatorService();
            var messageService = new MessageService();
            var vsamManageService = new VSAMManageService($q, camel);

            var vsamNormal = $scope.vsamNormal = vsamInfo.status === "normal";

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

            $scope.haMode = vsamInfo.haMode;

            $scope.floatIp = {
                "id": "floatIp",
                "label": (i18n.common_term_floatIP_label || "浮动IP地址") + ":",
                "singleLabel": (i18n.common_term_IP_label || "IP地址") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "disable": !vsamNormal,
                "value": vsamInfo && vsamInfo.floatIp,
                "extendFunction": ["ipFormatCheck", "notEndWith0or255"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(floatIp):" + i18n.common_term_formatIP_valid +
                    ";notEndWith0or255(floatIp)"
            };

            $scope.activeIp = {
                "id": "activeIp",
                "label": (i18n.common_term_masterIP_label || "主用IP地址") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "disable": !vsamNormal,
                "value": vsamInfo && vsamInfo.activeIp,
                "extendFunction": ["ipFormatCheck", "notEndWith0or255"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(activeIp):" + i18n.common_term_formatIP_valid +
                    ";notEndWith0or255(activeIp)"
            };

            $scope.standbyIp = {
                "id": "standbyIp",
                "label": (i18n.common_term_standbyIP_label || "备用IP地址") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "disable": !vsamNormal,
                "value": vsamInfo && vsamInfo.standbyIp,
                "extendFunction": ["ipFormatCheck", "notEndWith0or255"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(standbyIp):" + i18n.common_term_formatIP_valid +
                    ";notEndWith0or255(standbyIp)"
            };

            $scope.netmask = {
                "id": "netmask",
                "label": (i18n.common_term_SubnetMask_label || "子网掩码") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "disable": !vsamNormal,
                "value": vsamInfo && vsamInfo.netmask,
                "extendFunction": ["ipFormatCheck", "subNetMask"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(netmask):" + i18n.common_term_formatIP_valid +
                    ";subNetMask(netmask):" + i18n.common_term_formatSubnetMask_valid
            };

            $scope.gateway = {
                "id": "gateway",
                "label": (i18n.common_term_gateway_label || "网关") + ":",
                "type": "ipv4",
                "width": INPUT_WIDTH,
                "require": true,
                "disable": !vsamNormal,
                "value": vsamInfo && vsamInfo.gateway,
                "extendFunction": ["ipFormatCheck", "notEndWith0or255"],
                "validate": "required:" + i18n.common_term_null_valid +
                    ";ipFormatCheck(gateway):" + i18n.common_term_formatIP_valid +
                    ";notEndWith0or255(gateway)"
            };

            $scope.saveBtn = {
                "id": "saveBtn",
                "disable": !vsamNormal,
                "text": i18n.common_term_save_label || "保存",
                "click": function () {
                    if (UnifyValid.FormValid($("#vsamManageDiv"))) {
                        var msg = validIPs();
                        if (msg) {
                            messageService.failMsgBox(msg);
                        } else {
                            messageService.confirmMsgBox({
                                content: i18n.virtual_hyper_modifyVSAM_info_confirm_msg,
                                callback: saveVSAM
                            });
                        }
                    }
                }
            };

            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": i18n.common_term_cancle_button || "取消",
                "click": function () {
                    windowWidget.destroy();
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

            function validIPs() {
                var data = getFormData();
                var netmask = validatorService.getIpValue(data.netmask);
                var subNet = validatorService.getIpValue(data.gateway) & netmask;
                var msg = "";
                var valid = (subNet === (validatorService.getIpValue(data.floatIp) & netmask)) &&
                    (!vsamInfo.haMode ||
                        ((subNet === (validatorService.getIpValue(data.activeIp) & netmask)) &&
                            (subNet === (validatorService.getIpValue(data.standbyIp) & netmask))
                            )
                        );

                if (valid) {
                    var ips = [data.gateway, data.floatIp];
                    vsamInfo.haMode && (ips = ips.concat([data.activeIp, data.standbyIp]));
                    valid = !hasEqualIps(ips);
                    !valid && (msg = i18n.common_term_conflictIP_valid || "IP不能相同。");
                } else {
                    msg = i18n.common_term_IPmaskGateNotMatch_valid || "IP地址、子网掩码和网关三者不匹配。";
                }
                return msg;
            }

            function getFormData() {
                var data = {
                    floatIp: $("#" + $scope.floatIp.id).widget().getValue(),
                    netmask: $("#" + $scope.netmask.id).widget().getValue(),
                    gateway: $("#" + $scope.gateway.id).widget().getValue()
                };
                if (vsamInfo.haMode) {
                    data.activeIp = $("#" + $scope.activeIp.id).widget().getValue();
                    data.standbyIp = $("#" + $scope.standbyIp.id).widget().getValue();
                }
                return data;
            }

            function saveVSAM() {
                var data = getFormData();
                var promise = vsamManageService.editVSAM({
                    userId: user.id,
                    vsamId: vsamInfo.id,
                    params: JSON.stringify(data)
                });
                promise.then(function () {
                    windowWidget.destroy();
                    messageService.okMsgBox(i18n.virtual_hyper_modifyVSAM_info_process_msg || "任务下发成功，请在新的IP地址生效并连接正常后，再进行其他操作。");
                });
            }

        }];
        var vsamManageModule = angular.module("resources.hypervisor.vsamManage", ['framework']);
        vsamManageModule.service("camel", httpService);
        vsamManageModule.controller("resources.hypervisor.vsamManage.ctrl", vsamManageCtrl);
        return vsamManageModule;
    });