/**
 * 文件名：addDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-diskSnapshot--添加磁盘的control
 * 修改时间：14-25-19
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'app/services/httpService',
    'tiny-common/UnifyValid',
    'app/services/cloudInfraService',
    'app/services/exceptionService',
    'app/business/ecs/services/storage/diskService',
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
],
    function ($, angular, sprintf, ngSanitize, keyIDI18n, http, UnifyValid, cloudInfraService, exception, diskService) {
        "use strict";

        var addDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                // 公共参数
                var winParam = $("#ecsStorageDiskSnapshotsAddDiskWinId").widget().option("winParam");
                winParam = winParam || {};
                var user = $("html").scope().user || {};
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var diskServiceIns = new diskService(exception, $q, camel);

                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "width": "200",
                    "id": "ecsStorageDiskAddDiskName",
                    "value": "",
                    "extendFunction": ["diskNameValid"],
                    "validate": "diskNameValid():" + i18n.common_term_composition3_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 64)
                };

                $scope.az = {
                    "label": i18n.resource_term_AZ_label + ":",
                    "id": "ecsStorageDiskAddDiskAz",
                    "width": "200",
                    "values": [],
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";"
                };

                $scope.diskType = {
                    "label": i18n.common_term_type_label + ":",
                    "id": "ecsStorageDiskAddDiskType",
                    "layout": "horizon",
                    "values": [
                        {
                            "key": "normal",
                            "text": i18n.common_term_common_label,
                            "checked": true
                        },
                        {
                            "key": "share",
                            "text": i18n.common_term_share_label
                        }
                    ]
                };

                $scope.okBtn = {
                    "id": "ecsStorageDiskAddDiskOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($(".ecs_storage_disk_snapshot_add"))) {
                            return;
                        }

                        //获取磁盘信息
                        var options = {
                            "user": user,
                            "cloudInfraId": winParam.cloudInfraId,
                            "name": $.trim($("#" + $scope.name.id).widget().getValue()),
                            "azId": $("#" + $scope.az.id).widget().getSelectedId(),
                            "type": $("#ecsStorageDiskAddDiskType").widget().opChecked("checked"),
                            "size": winParam.size,
                            "snapshotId": winParam.snapshotId,
                            "vpcId": winParam.vpcId
                        };

                        var deferred = diskServiceIns.createDisk(options);
                        deferred.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsStorageDiskSnapshotsAddDiskWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsStorageDiskAddDiskCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsStorageDiskSnapshotsAddDiskWinId").widget().destroy();
                    }
                };

                //查询AZ列表
                function queryAz() {
                    var promise = cloudInfraServiceIns.queryAzs(user.vdcId, user.id, winParam.cloudInfraId);
                    promise.then(function (data) {
                        var azs = data && data.availableZones || [];
                        var values = [];
                        for (var i = 0; i < azs.length; i++) {
                            if (azs[i].name !== "manage-az") {
                                values.push(azs[i]);
                            }
                        }
                        if(values.length > 0){
                            values[0].checked = true;
                        }
                        $scope.az.values = values;
                    }, function (response) {
                        exception.doException(response);
                    });
                }

                UnifyValid.diskNameValid = function () {
                    var input = $("#" + $scope.name.id).widget().getValue();
                    if ($.trim(input) === "") {
                        return true;
                    }
                    var nameReg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,64}[ ]*$/;
                    return nameReg.test(input);
                };

                // 查询初始化信息
                queryAz();
            }
        ];

        var addDiskModule = angular.module("ecs.storage.diskSnapshot.add", ['ng', 'wcc', 'ngSanitize']);
        addDiskModule.controller("ecs.storage.diskSnapshot.add.ctrl", addDiskCtrl);
        addDiskModule.service("camel", http);
        addDiskModule.service("exception", exception);

        return addDiskModule;
    }
);
