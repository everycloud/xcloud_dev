/**
 * 文件名：modVmDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-disk--修改磁盘的control
 * 修改时间：14-2-27
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
        "app/services/exceptionService",
        "app/business/ecs/services/storage/diskService"
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, UnifyValid, validator, exception, diskService) {
        "use strict";

        var modVmDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception", "validator",
            function ($scope, $compile, $q, camel, exception, validator) {
                // 父窗口传递的参数
                var winParam = $("#ecsVmsDetailModDiskWinId").widget().option("winParam") || {};
                var user = $("html").scope().user;
                var diskServiceIns = new diskService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                var nameValidTip = i18n.common_term_composition3_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64");
                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "id": "ecsVmsDetailModDiskName",
                    "width": "200",
                    "value": winParam.volumeName,
                    "require": true,
                    "validate": "regularCheck(" + validator.diskNameReg + "):" + nameValidTip + "; " +
                        "regularCheck(" + validator.notAllSpaceReg + "):" + nameValidTip
                };

                $scope.okBtn = {
                    "id": "ecsVmsDetailModDiskOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($(".ecs_vm_detail_disk_mod"))) {
                            return;
                        }
                        var options = {
                            "user": user,
                            "diskId": winParam.volumeId,
                            "name": $.trim($("#" + $scope.name.id).widget().getValue()),
                            "cloudInfraId": winParam.cloudInfraId,
                            "vpcId": winParam.vpcId
                        };
                        var deferred = diskServiceIns.modifyDisk(options);
                        deferred.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsVmsDetailModDiskWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmsDetailModDiskCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmsDetailModDiskWinId").widget().destroy();
                    }
                };
            }
        ];

        var modVmDiskModule = angular.module("ecs.vm.detail.disk.mod", ['ng',"wcc","ngSanitize"]);
        modVmDiskModule.controller("ecs.vm.detail.disk.mod.ctrl", modVmDiskCtrl);
        modVmDiskModule.service("camel", http);
        modVmDiskModule.service("validator", validator);
        modVmDiskModule.service("exception", exception);

        return modVmDiskModule;
    }
);
