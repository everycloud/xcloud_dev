/**
 * 文件名：extendVmDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-disk--扩容磁盘的control
 * 修改时间：14-5-29
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

        var extendVmDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception", "validator",
            function ($scope, $compile, $q, camel, exception, validator) {
                // 父窗口传递的参数
                var winParam = $("#ecsVmsDetailExpendDiskWinId").widget().option("winParam") || {};
                var user = $("html").scope().user;
                var diskServiceIns = new diskService(exception, $q, camel);
                var size = winParam.size;

                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var validMsg =  i18n.sprintf(i18n.common_term_rangeInteger_valid, size, 65536);

                $scope.size = {
                    "label": i18n.common_term_capacityGB_label + ":",
                    "id": "ecsVmsDetailExtendDiskSize",
                    "width": "135",
                    "value": size,
                    "require": true,
                    "tips": size + "~65536GB",
                    "validate": "integer:" + validMsg + ";maxValue(65536):" + validMsg + ";minValue(" + size + "):" + validMsg
                };

                $scope.okBtn = {
                    "id": "ecsVmsDetailExtendDiskOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($(".ecs_vm_detail_disk_expend"))) {
                            return;
                        }
                        var options = {
                            "user": user,
                            "volumeId": winParam.volumeId,
                            "cloudInfraId": winParam.cloudInfraId,
                            "vpcId": winParam.vpcId,
                            "params": {
                                "expand": {
                                    "vmId": winParam.vmId,
                                    "size": $("#" + $scope.size.id).widget().getValue()
                                }
                            }
                        };
                        var deferred = diskServiceIns.operateDisk(options);
                        deferred.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsVmsDetailExpendDiskWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmsDetailExtendDiskCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmsDetailExpendDiskWinId").widget().destroy();
                    }
                };
            }
        ];

        var extendVmDiskModule = angular.module("ecs.vm.detail.disk.extend", ['ng',"wcc","ngSanitize"]);
        extendVmDiskModule.controller("ecs.vm.detail.disk.extend.ctrl", extendVmDiskCtrl);
        extendVmDiskModule.service("camel", http);
        extendVmDiskModule.service("validator", validator);
        extendVmDiskModule.service("exception", exception);

        return extendVmDiskModule;
    }
);
