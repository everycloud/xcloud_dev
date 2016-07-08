/**
 * 文件名：createSnapshotCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--添加磁盘的control
 * 修改时间：14-2-18
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        "app/services/exceptionService",
        'app/services/validatorService',
        "tiny-common/UnifyValid",
        'app/business/ecs/services/vm/vmSnapshotService',
        'tiny-directives/Textbox',
        'tiny-directives/Checkbox'
    ],
    function ($, angular, sprintf, ngSanitize, keyIDI18n, http, exception, validator, UnifyValid, vmSnapshotService) {
        "use strict";

        var createSnapshotCtrl = ["$scope", "$compile", "camel", 'exception', '$q',
            function ($scope, $compile, camel, exception, $q) {
                var createOrModifyShare = $("#ecsVmsDetailCreateSnapshotWinId").widget().option("createOrModifyShare") || {};
                var vmSnapshotServiceIns = new vmSnapshotService(exception, $q, camel);
                var isCreate = createOrModifyShare.isCreate;
                var user = $("html").scope().user;
                var validatorIns = new validator();
                $scope.vmId = createOrModifyShare.vmId;
                $scope.cloudInfraId = createOrModifyShare.cloudInfraId;
                $scope.vpcId = createOrModifyShare.vpcId;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.label = {
                    "memSnapLabel": "",
                    "consistentShotLabel": ""
                };

                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "id": "ecsVmDetailCreateSnapshotName",
                    "value": "",
                    "require": true,
                    "validate": "require:" + i18n.common_term_null_valid + ";maxSize(64):" + i18n.sprintf(i18n.common_term_length_valid, 1, 64) + ";" +
                        "regularCheck(" + validatorIns.snapshotName + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 64)
                };

                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "id": "ecsVmDetailCreateSnapshotDescription",
                    "value": "",
                    "type": "multi",
                    "height": "60",
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
                };

                $scope.memShot = {
                    "id": "ecsVmDetailCreateSnapshotMemShot",
                    "checked": false,
                    "text": i18n.vm_snap_add_para_memSnap_label,
                    "tooltip": i18n.vm_snap_add_para_mem_mean_label
                };

                $scope.consistentShot = {
                    "id": "ecsVmDetailCreateSnapshotConsistentShot",
                    "checked": false,
                    "text": i18n.vm_snap_add_para_sameSnap_label,
                    "tooltip": i18n.vm_snap_add_para_sameSnap_mean_tip
                };

                $scope.okBtn = {
                    "id": "ecsVmDetailCreateSnapshotOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#snapshot_create_id"));
                        if (!valid) {
                            return;
                        }

                        //获取磁盘信息
                        var snapshotName = $("#ecsVmDetailCreateSnapshotName").widget().getValue();
                        snapshotName = $.trim(snapshotName);
                        var snapshot = {
                            "name": snapshotName,
                            "description": $("#ecsVmDetailCreateSnapshotDescription").widget().getValue(),
                            "memorySnapshot": $("#ecsVmDetailCreateSnapshotMemShot").widget().option("checked"),
                            "consistentSnapshot": $("#ecsVmDetailCreateSnapshotConsistentShot").widget().option("checked")
                        };

                        createOrModifySnapshot(snapshot);
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmDetailCreateSnapshotCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmsDetailCreateSnapshotWinId").widget().destroy();
                    }
                };

                function createOrModifySnapshot(configParams) {
                    var params = {
                        "user": user,
                        "vmId": $scope.vmId,
                        "cloudInfraId": $scope.cloudInfraId,
                        "vpcId": $scope.vpcId,
                        "name": configParams.name,
                        "description": configParams.description,
                        "memorySnapshot": configParams.memorySnapshot,
                        "consistentSnapshot": configParams.consistentSnapshot
                    };
                    var deferred;
                    if (isCreate) {
                        deferred = vmSnapshotServiceIns.createSnapshot(params);
                    } else {
                        deferred = vmSnapshotServiceIns.modifySnapshot(params);
                    }
                    deferred.then(function (data) {
                        createOrModifyShare.needRefresh = true;
                        $("#ecsVmsDetailCreateSnapshotWinId").widget().destroy();
                    });
                }
            }
        ];

        var createSnapshotModule = angular.module("ecs.vm.detail.snapshot.create", ['ng', "wcc", "ngSanitize"]);
        createSnapshotModule.controller("ecs.vm.detail.snapshot.create.ctrl", createSnapshotCtrl);
        createSnapshotModule.service("camel", http);
        createSnapshotModule.service("exception", exception);
        createSnapshotModule.service("ecs.vm.detail.snapshot.create.validator", validator);

        return createSnapshotModule;
    }
);
