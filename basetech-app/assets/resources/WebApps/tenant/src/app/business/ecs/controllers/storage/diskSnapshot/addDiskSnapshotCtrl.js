/**
 * 文件名：addDiskSnapshotCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-disk--添加磁盘Snapshot的control
 * 修改时间：14-25-19
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        'app/services/validatorService',
        'tiny-common/UnifyValid',
        'app/services/cloudInfraService',
        'app/services/exceptionService',
        'app/business/ecs/services/storage/diskSnapshotService'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, validator, UnifyValid, cloudInfraService, exception, diskSnapshotService) {
        "use strict";

        var addDiskSnapshotCtrl = ["$scope", "$compile", "$q", "camel", "exception", "validator",
            function ($scope, $compile, $q, camel, exception, validator) {
                // 公共参数
                var winParam = $("#ecsStorageDisksCreateSnapshotWinId").widget().option("winParam");
                winParam = winParam || {};
                var disk = winParam.disk || {};
                var user = $("html").scope().user || {};
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var diskSnapshotServiceIns = new diskSnapshotService(exception, $q, camel);

                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "width": "220",
                    "id": "ecsStorageDiskAddSnapshotName",
                    "value": "",
                    "extendFunction": ["diskNameValid"],
                    "validate": "diskNameValid():" + i18n.common_term_composition3_valid + "<br>" + i18n.sprintf(i18n.common_term_length_valid, 1, 64)
                };

                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "id": "ecsStorageDiskAddSnapshotDescription",
                    "value": "",
                    "type": "multi",
                    "width": "220",
                    "height": "100",
                    "validate": "regularCheck(" + validator.diskSnapshotDescReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 64)
                };

                $scope.okBtn = {
                    "id": "ecsStorageDiskAddSnapshotOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($(".ecs_storage_disk_add_snapshot"))) {
                            return;
                        }

                        //获取磁盘信息
                        var options = {
                            "user": user,
                            "cloudInfraId": winParam.cloudInfraId,
                            "name": $.trim($("#" + $scope.name.id).widget().getValue()),
                            "description": $.trim($("#" + $scope.description.id).widget().getValue()),
                            "volumeId": winParam.disk.id,
                            "vpcId": winParam.vpcId
                        };

                        var deferred = diskSnapshotServiceIns.createDiskSnapshot(options);
                        deferred.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsStorageDisksCreateSnapshotWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsStorageDiskAddDiskCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsStorageDisksCreateSnapshotWinId").widget().destroy();
                    }
                };

                UnifyValid.diskNameValid = function () {
                    var input = $("#" + $scope.name.id).widget().getValue();
                    if ($.trim(input) === "") {
                        return true;
                    }
                    var nameReg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,64}[ ]*$/;
                    return nameReg.test(input);
                };
            }
        ];

        var addDiskSnapshotModule = angular.module("ecs.storage.disk.addSnapshot", ['ng',"wcc","ngSanitize"]);
        addDiskSnapshotModule.controller("ecs.storage.disk.addSnapshot.ctrl", addDiskSnapshotCtrl);
        addDiskSnapshotModule.service("camel", http);
        addDiskSnapshotModule.service("validator", validator);
        addDiskSnapshotModule.service("exception", exception);

        return addDiskSnapshotModule;
    }
);
