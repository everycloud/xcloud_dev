/**
 * 文件名：deleteVmDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-vm-deleteVm--删除虚拟机磁盘的control
 * 修改时间：14-4-20
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        'app/services/exceptionService',
        'app/business/ecs/services/vm/vmDiskService',
        'tiny-directives/Checkbox'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, exception, vmDiskService) {
        "use strict";
        var deleteVmDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                // 公共参数和服务实例
                var winParam = $("#ecsVmsDetailDelDiskWinId").widget().option("winParam");
                winParam = winParam || {};
                var user = $("html").scope().user || {};
                var vmDiskServiceIns = new vmDiskService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.safeDelete = {
                    "id": "ecsVmDetailDiskDeleteType",
                    "text": i18n.common_term_safeDel_button
                };

                $scope.okBtn = {
                    "id": "ecsVmDetailDiskDeleteOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var defer = vmDiskServiceIns.deleteVmDisk({
                            "user": user,
                            "vmId": winParam.vmId,
                            "volumeId": winParam.volumeId,
                            "cloudInfraId": winParam.cloudInfraId,
                            "vpcId": winParam.vpcId,
                            "mode": $("#" + $scope.safeDelete.id).widget().option("checked") ? "safe" : "normal"
                        });
                        defer.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsVmsDetailDelDiskWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmDetailDiskDeleteCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmsDetailDelDiskWinId").widget().destroy();
                    }
                };
            }
        ];

        var deleteVmDiskModule = angular.module("ecs.vm.detail.disk.delete", ['ng',"wcc","ngSanitize"]);
        deleteVmDiskModule.controller("ecs.vm.detail.disk.delete.ctrl", deleteVmDiskCtrl);
        deleteVmDiskModule.service("camel", http);
        deleteVmDiskModule.service("exception", exception);

        return deleteVmDiskModule;
    }
);
