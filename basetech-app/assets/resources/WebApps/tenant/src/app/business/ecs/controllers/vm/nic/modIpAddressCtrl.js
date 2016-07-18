/**
 * 文件名：modIpCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-vm-nic--修改ip的control
 * 修改时间：14-6-30
 */
/* global define */
define([ "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'app/services/httpService',
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/exceptionService",
    "app/business/ecs/services/vm/vmNicService",
    'tiny-directives/Select'
], function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, http, UnifyValid, validator, exception, nicService) {
    "use strict";

    var modIpCtrl = ["$scope", "$compile", "$q", "camel", "exception", "validator",
        function ($scope, $compile, $q, camel, exception, validator) {
            // 父窗口传递的参数
            var winParam = $("#ecsVmsDetailModNicIpWinId").widget().option("winParam") || {};
            var user = $("html").scope().user;
            var nicServiceIns = new nicService(exception, $q, camel);
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            $scope.ip = {
                "label": i18n.common_term_IP_label + ":",
                "id": "ecsVmsDetailModNicIp",
                "width": "200",
                "value": "",
                "require": true,
                "extendFunction": ["isIPv4Check"],
                "validate": "isIPv4Check():" + i18n.common_term_formatIP_valid
            };

            $scope.okBtn = {
                "id": "ecsVmsDetailModNicIpOK",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    if (!UnifyValid.FormValid($(".ecs_vm_detail_nic_mod_ip"))) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "vmId": winParam.vmId,
                        "ip":  $("#" + $scope.ip.id).widget().getValue(),
                        "nicId": winParam.nicId,
                        "cloudInfraId": winParam.cloudInfraId,
                        "vpcId": winParam.vpcId
                    };
                    var deferred = nicServiceIns.modifyVmNic(options);
                    deferred.then(function (data) {
                        winParam.needRefresh = true;
                        $("#ecsVmsDetailModNicIpWinId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "ecsVmsDetailModNicIpCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecsVmsDetailModNicIpWinId").widget().destroy();
                }
            };

            // 校验IPv4是否合法
            UnifyValid.isIPv4Check = function (domId) {
                return validator.ipValidator($(this).val());
            };
        }
    ];

    var modIpModule = angular.module("ecs.vm.nic.mod.ip", ['ng', 'wcc', "ngSanitize"]);
    modIpModule.controller("ecs.vm.nic.mod.ip.ctrl", modIpCtrl);
    modIpModule.service("camel", http);
    modIpModule.service("validator", validator);
    modIpModule.service("exception", exception);

    return modIpModule;
});
