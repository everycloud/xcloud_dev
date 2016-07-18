/**
 * 文件名：deleteDiskSnapshotCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-disk--删除磁盘的control
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
        'app/business/ecs/services/storage/diskSnapshotService',
        'tiny-directives/Checkbox'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, exception, diskSnapshotService) {
        "use strict";
        var deleteDiskSnapshotCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                // 公共参数和服务实例
                var winParam = $("#ecsStorageDiskSnapshotsDelSnapshotWinId").widget().option("winParam");
                winParam = winParam || {};
                var user = $("html").scope().user || {};
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var diskSnapshotServiceIns = new diskSnapshotService(exception, $q, camel);

                $scope.forceDelete = {
                    "id": "ecsStorageDisksDeleteType",
                    "text": i18n.common_term_forciblyDel_button
                };

                $scope.okBtn = {
                    "id": "ecsStorageDisksDeleteOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var options = {
                            "user": user,
                            "cloudInfraId": winParam.cloudInfraId,
                            "vpcId": winParam.vpcId,
                            "param": {
                                "delete": {
                                    "volumeSnapshotId": winParam.snapshotId,
                                    "forceDelete": $("#" + $scope.forceDelete.id).widget().option("checked")
                                }
                            }
                        };

                        var defer = diskSnapshotServiceIns.operateDiskSnapshots(options);
                        defer.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsStorageDiskSnapshotsDelSnapshotWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsStorageDisksDeleteCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsStorageDiskSnapshotsDelSnapshotWinId").widget().destroy();
                    }
                };
            }
        ];

        var deleteDiskSnapshotModule = angular.module("ecs.storage.diskSnapshot.del", ['ng',"wcc","ngSanitize"]);
        deleteDiskSnapshotModule.controller("ecs.storage.diskSnapshot.del.ctrl", deleteDiskSnapshotCtrl);
        deleteDiskSnapshotModule.service("camel", http);
        deleteDiskSnapshotModule.service("exception", exception);

        return deleteDiskSnapshotModule;
    }
);
