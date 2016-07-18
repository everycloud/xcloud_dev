/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-4-10

 */
define(["tiny-lib/angular",
    'tiny-widgets/Radio',
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/services/validatorService',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService"],
    function (angular, Radio, UnifyValid, httpService, validatorService, constants, ExceptionService) {
        "use strict";

        var modifyDhcpServerCtrl = ["$scope", "camel", "validator", function ($scope, camel, validator) {
            $scope.i18n = $("html").scope().i18n;
            var $rootScope = $("html").injector().get("$rootScope");
            var id = $("#modifyDhcpServerWin").widget().option("dhcpServerID");
            var dhcpServerIP = $("#modifyDhcpServerWin").widget().option("dhcpServerIP");
            var prefix = $("#modifyDhcpServerWin").widget().option("prefix");
            var gateway = $("#modifyDhcpServerWin").widget().option("gateway");
            $scope.modifyInfo = {
                "protocolType": "IPv4",
                "dhcpServerIPv4Config": {}
            };
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                if (!ip) {
                    return true;
                }
                return validator.ipValidator(ip);
            };
            UnifyValid.maskCheck = function (maskId) {
                var mask = $("#" + maskId).widget().getValue();
                return validator.maskValidator(mask);
            };
            UnifyValid.gatewayCheck = function (ipId) {
                var ip = $("#" + ipId).widget().getValue();
                var data = ip.split(".");
                try {
                    if (data[3] == 255) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                catch (e) {
                    return false;
                }
            };

            $scope.dhcpIp = {
                "label": $scope.i18n.common_term_DHCPservice_label + " IP:",
                "require": "true",
                "id": "dhcpIp01",
                "type": "ipv4",
                "value": dhcpServerIP,
                "disable": false,
                "width": "215px",
                "extendFunction": ["ipCheck"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(dhcpIp01):" + $scope.i18n.common_term_formatIP_valid

            };
            $scope.subnetMask = {
                "label": $scope.i18n.common_term_SubnetMask_label + ":",
                "require": "true",
                "id": "subnetMask",
                "type": "ipv4",
                "value": prefix,
                "disable": false,
                "width": "215px",
                "extendFunction": ["maskCheck"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maskCheck(subnetMask):" + $scope.i18n.common_term_formatSubnetMask_valid
            };
            $scope.gateway = {
                "label": $scope.i18n.common_term_gateway_label + ":",
                "require": "true",
                "id": "gateway",
                "type": "ipv4",
                "value": gateway,
                "disable": false,
                "width": "215px",
                "extendFunction": ["ipCheck", "gatewayCheck"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(gateway):" + $scope.i18n.common_term_formatIP_valid + ";gatewayCheck(gateway):" + $scope.i18n.vpc_term_gatewayError_valid
            };

            $scope.okBtn = {
                "id": "okBtn",
                "text": $scope.i18n.common_term_confirm_label,
                "disable": false,
                "click": function () {
                    var valid = UnifyValid.FormValid($("#modifyDhcpServerDiv"));
                    if (!valid) {
                        return;
                    }
                    $scope.modifyInfo.dhcpServerIPv4Config.dhcpServerIP = $("#" + $scope.dhcpIp.id).widget().getValue();
                    $scope.modifyInfo.dhcpServerIPv4Config.prefix = $("#" + $scope.subnetMask.id).widget().getValue();
                    $scope.modifyInfo.dhcpServerIPv4Config.gateway = $("#" + $scope.gateway.id).widget().getValue();
                    $scope.operator.modifyDhcpServer($scope.modifyInfo);
                }
            };
            $scope.cancelBtn = {
                "id": "resourceChoiceCancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#modifyDhcpServerWin").widget().destroy();
                }
            };
            $scope.operator = {
                //修改dhcp服务器
                modifyDhcpServer: function (params) {
                    var modifyConfig = constants.rest.DHCP_SERVER_MODIFY
                    var deferred = camel.put({
                        "url": {s: modifyConfig.url, o: {"id": id}},
                        "type": modifyConfig.type,
                        "userId": $rootScope.user.id,
                        "params": JSON.stringify(params)
                    });
                    deferred.done(function (response) {
                        $("#modifyDhcpServerWin").widget().destroy();
                    });

                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
        }];
        var deps = [];
        var modifyDhcpServerApp = angular.module("modifyDhcpServerApp", deps);
        modifyDhcpServerApp.controller("modifyDhcpServerCtrl", modifyDhcpServerCtrl);
        modifyDhcpServerApp.service("camel", httpService);
        modifyDhcpServerApp.service("validator", validatorService);
        return modifyDhcpServerApp;
    })


