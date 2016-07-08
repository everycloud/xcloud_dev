/**
 * 文件名：addNicCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--添加网卡的control
 * 修改时间：14-2-18
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'app/services/httpService',
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/business/ecs/services/vm/vmNicService',
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function ($, angular,sprintf, ngSanitize, keyIDI18n, http, UnifyValid, validatorService, exception, vmNicService) {
    "use strict";

    var configFloatIp = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {

            var nicId = $("#ecsVmsDetailconfigNicFloatIpWinId").widget().option("nicId");
            var vmId = $("#ecsVmsDetailconfigNicFloatIpWinId").widget().option("vmId");
            var cloudInfra = $("#ecsVmsDetailconfigNicFloatIpWinId").widget().option("cloudInfra");
            var user = $("html").scope().user || {};
            var vmNicServiceIns = new vmNicService(exception, $q, camel);
            var validator = new validatorService();
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            var oldIp = "";
            $scope.floatIp = {
                "label": i18n.common_term_floatIP_label + ":",
                "id": "configNicFloatIp",
                "type": "ipv4",
                "width": "160",
                "value": "",
                "extendFunction": ["isIPv4Check"],
                "validate": "isIPv4Check(configNicFloatIp):" + i18n.common_term_formatIP_valid
            };

            $scope.okBtn = {
                "id": "ecsVmDetailAddNicOK",
                "text": i18n.common_term_ok_button,
                "disable": false,
                "click": function () {
                    if (!UnifyValid.FormValid($("#configNicFloatIp"))) {
                        return;
                    }
                    var newIp = $("#configNicFloatIp").widget().getValue();
                    if (oldIp === newIp) {
                        $(".ecs_vm_detail_nics").scope().reloadVmNics = true;
                        $("#ecsVmsDetailconfigNicFloatIpWinId").widget().destroy();
                        return;
                    }
                    var options = {
                        "newIp": $.trim($("#configNicFloatIp").widget().getValue()),
                        "cloudInfraId": cloudInfra.id,
                        "user": user,
                        "vmId": vmId,
                        "nicId": nicId,
                        "addIps": [newIp],
                        "delIps": [oldIp]

                    };
                    var deferred = vmNicServiceIns.configNicFloatIp(options);
                    deferred.then(function (data) {
                        $(".ecs_vm_detail_nics").scope().reloadVmNics = true;
                        $("#ecsVmsDetailconfigNicFloatIpWinId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "ecsVmDetailAddNicCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecsVmsDetailconfigNicFloatIpWinId").widget().destroy();
                }
            };

            //校验IPv4是否合法
            UnifyValid.isIPv4Check = function (domId) {
                var ipValue = $("#" + domId).widget().getValue();
                if ($.trim(ipValue) === "") {
                    return true;
                }
                return validator.ipValidator(ipValue);
            };

            // 查询网络列表
            function queryNicFloatIps() {
                var deferred = vmNicServiceIns.queryNicFloatIps({
                    "cloudInfraId": cloudInfra.id,
                    "nicId": nicId,
                    "vmId": vmId,
                    "user": user
                });
                deferred.then(function (data) {
                    if (data && data.ips && data.ips.length > 0) {
                        $scope.floatIp.value = data.ips[0].ip;
                        oldIp = data.ips[0].ip;
                    }
                });
            }

            //获取初始数据
            queryNicFloatIps();
        }
    ];

    var configFloatIpModule = angular.module("ecs.vm.detail.nic.configfloatip", ['ng',"wcc","ngSanitize"]);
    configFloatIpModule.controller("ecs.vm.detail.nic.configfloatip.ctrl", configFloatIp);
    configFloatIpModule.service("camel", http);
    configFloatIpModule.service("exception", exception);

    return configFloatIpModule;
});
