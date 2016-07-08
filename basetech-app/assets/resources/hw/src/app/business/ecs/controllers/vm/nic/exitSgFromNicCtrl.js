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
        'tiny-lib/underscore',
        'app/services/httpService',
        'app/services/validatorService',
        'app/services/exceptionService',
        'app/business/ecs/services/vm/vmNicService',
        'app/business/ecs/services/vm/queryVmService',
        'tiny-directives/Select',
        "fixtures/ecsFixture"
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, _, http, validatorService, exception, vmNicService, queryVmService) {
        "use strict";

        var exitSgFromNicCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                var vmId = $("#ecsVmsDetailExitSgFromNicWinId").widget().option("vmId");
                var nicId = $("#ecsVmsDetailExitSgFromNicWinId").widget().option("nicId");
                var vpcId = $("#ecsVmsDetailExitSgFromNicWinId").widget().option("vpcId");
                var cloudInfra = $("#ecsVmsDetailExitSgFromNicWinId").widget().option("cloudInfra");
                var user = $("html").scope().user || {};
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.sgSelect = {
                    label: i18n.security_term_SG_label + ":",
                    "id": "ecsVmDetailExitSgFromNic",
                    tip: "",
                    "values": [],
                    "change": function () {
                        $scope.sgId = $("#" + $scope.sgSelect.id).widget().getSelectedId();
                    },
                    "width": "210"
                };
                $scope.okBtn = {
                    "id": "ecsVmDetailExitSgOK",
                    "text": i18n.common_term_ok_button,
                    "disable": true,
                    "click": function () {
                        var defer = vmNicServiceIns.exitSecurityGroup({
                            "user": user,
                            "vmId": vmId,
                            "nicId": nicId,
                            "sgId": $scope.sgId,
                            "vpcId": vpcId,
                            "cloudInfraId": cloudInfra.id
                        });
                        defer.then(function (data) {
                            $(".ecs_vm_detail_nics").scope().reloadVmNics = true;
                            $("#ecsVmsDetailExitSgFromNicWinId").widget().destroy();
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "ecsVmDetailExitSgCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmsDetailExitSgFromNicWinId").widget().destroy();
                    }
                };
                //查询虚拟机网卡信息
                function querySgList() {
                    var defer = queryVmServiceIns.queryVmDetail({
                        "user": user,
                        "vmId": vmId,
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": vpcId
                    });
                    defer.then(function (data) {
                        if (!data || !data.vm) {
                            return;
                        }
                        var selArray = [];
                        _.each(data.vm.nics, function (item) {
                            if (nicId === item.nicId) {
                                if (item.sgInfo && item.sgInfo.length > 0) {
                                    var sgInfo = item.sgInfo;
                                    _.each(sgInfo, function (item, index) {
                                        selArray.push({
                                            "selectId": item.sgId,
                                            "label": item.sgName,
                                            "checked": index === 0
                                        });
                                    });

                                    $scope.sgId = sgInfo[0].sgId;
                                    $scope.sgSelect.values = selArray;
                                }
                            }
                        });
                        if (selArray.length > 0) {
                            $("#" + $scope.okBtn.id).widget().option("disable", false);
                        }
                    });
                }
                querySgList();
            }
        ];

        var exitSgModule = angular.module("ecs.vm.detail.nic.exitsg", ['ng',"wcc","ngSanitize"]);
        exitSgModule.controller("ecs.vm.detail.nic.exitsg.ctrl", exitSgFromNicCtrl);
        exitSgModule.service("camel", http);
        exitSgModule.service("exception", exception);

        return exitSgModule;
    }
);
