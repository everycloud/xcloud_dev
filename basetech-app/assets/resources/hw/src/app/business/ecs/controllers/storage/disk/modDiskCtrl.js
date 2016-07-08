/**
 * 文件名：modDiskCtrl.js
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
    "app/business/ecs/services/storage/diskService",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function ($, angular,sprintf, ngSanitize, keyIDI18n, http, UnifyValid, validator, exception, diskService) {
    "use strict";

    var modDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception", "validator",
        function ($scope, $compile, $q, camel, exception, validator) {
            // 父窗口传递的参数
            var winParam = $("#ecsStorageDisksModDiskWinId").widget().option("winParam");
            winParam = winParam || {};
            var cloudInfra = winParam.cloudInfra || {};
            var disk = winParam.disk || {};
            var user = $("html").scope().user;
            var diskServiceIns = new diskService(exception, $q, camel);
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            $scope.name = {
                "label": i18n.common_term_name_label + ":",
                "id": "ecsStorageDiskModDiskName",
                "width": "200",
                "value": disk.name,
                "require": true,
                "validate": "regularCheck(" + validator.diskNameReg + "):" + i18n.common_term_composition3_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") +
                    ";regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_composition3_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
            };

            $scope.okBtn = {
                "id": "ecsStorageDiskModDiskOK",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    if (!UnifyValid.FormValid($(".ecs_vm_detail_disk_mod"))) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "diskId": disk.id,
                        "name": $.trim($("#" + $scope.name.id).widget().getValue()),
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": winParam.vpcId
                    };
                    var deferred = diskServiceIns.modifyDisk(options);
                    deferred.then(function (data) {
                        winParam.needRefresh = true;
                        $("#ecsStorageDisksModDiskWinId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "ecsStorageDiskModDiskCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecsStorageDisksModDiskWinId").widget().destroy();
                }
            };
        }
    ];

    var modDiskModule = angular.module("ecs.storage.disk.mod", ['ng',"wcc","ngSanitize"]);
    modDiskModule.controller("ecs.storage.disk.mod.ctrl", modDiskCtrl);
    modDiskModule.service("camel", http);
    modDiskModule.service("validator", validator);
    modDiskModule.service("exception", exception);

    return modDiskModule;
});
