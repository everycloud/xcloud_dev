/**
 * 文件名：modDiskSnapshotCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-diskSnapshot--修改磁盘快照的control
 * 修改时间：14-5-19
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
        "app/business/ecs/services/storage/diskSnapshotService"
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, UnifyValid, validator, exception, diskSnapshotService) {
        "use strict";

        var modDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception", "validator",
            function ($scope, $compile, $q, camel, exception, validator) {
                // 父窗口传递的参数
                var winParam = $("#ecsStorageDiskSnapshotsModSnapshotWinId").widget().option("winParam");
                winParam = winParam || {};
                var user = $("html").scope().user;
                var diskSnapshotServiceIns = new diskSnapshotService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                var nameValidTips = i18n.common_term_composition3_valid + "<br>" + i18n.sprintf(i18n.common_term_length_valid, 1, 64);
                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "id": "ecsStorageDiskModDiskName",
                    "width": "220",
                    "value": winParam.name,
                    "require": true,
                    "validate": "regularCheck(" + validator.vmNameReg + "):" + nameValidTips + ";" +
                        "regularCheck(" + validator.notAllSpaceReg + "):" + nameValidTips
                };

                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "require": false,
                    "id": "ecsStorageDiskModDiskDescription",
                    "value": winParam.description,
                    "type": "multi",
                    "width": "220",
                    "height": "100",
                    "validate": "regularCheck(" + validator.diskSnapshotDescReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 64)
                };

                $scope.okBtn = {
                    "id": "ecsStorageDiskModDiskOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($(".ecs_storage_disk_snapshot_mod"))) {
                            return;
                        }
                        var options = {
                            "user": user,
                            "snapshotId": winParam.snapshotId,
                            "name": $.trim($("#" + $scope.name.id).widget().getValue()),
                            "description": $.trim($("#" + $scope.description.id).widget().getValue()),
                            "cloudInfraId": winParam.cloudInfraId,
                            "vpcId": winParam.vpcId
                        };
                        var deferred = diskSnapshotServiceIns.modifyDiskSnapshot(options);
                        deferred.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsStorageDiskSnapshotsModSnapshotWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsStorageDiskModDiskCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsStorageDiskSnapshotsModSnapshotWinId").widget().destroy();
                    }
                };
            }
        ];

        var modDiskModule = angular.module("ecs.storage.diskSnapshot.mod", ['ng',"wcc","ngSanitize"]);
        modDiskModule.controller("ecs.storage.diskSnapshot.mod.ctrl", modDiskCtrl);
        modDiskModule.service("camel", http);
        modDiskModule.service("validator", validator);
        modDiskModule.service("exception", exception);

        return modDiskModule;
    }
);
