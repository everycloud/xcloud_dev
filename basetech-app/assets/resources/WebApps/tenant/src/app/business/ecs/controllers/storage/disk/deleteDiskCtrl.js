/**
 * 文件名：deleteDiskCtrl.js
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
        'app/business/ecs/services/storage/diskService',
        'tiny-directives/Checkbox'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, exception, diskService) {
        "use strict";
        var deleteDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                // 公共参数和服务实例
                var winParam = $("#ecsStorageDisksDelDiskWinId").widget().option("winParam") || {};
                var cloudInfra = winParam.cloudInfra || {};
                var disk = winParam.disk || {};
                var user = $("html").scope().user || {};
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var diskServiceIns = new diskService(exception, $q, camel);
                var isICT = user.cloudType === "ICT";

                $scope.safeDelete = {
                    "id": "ecsStorageDisksDeleteType",
                    "text": isICT ? i18n.common_term_forciblyDel_button : i18n.common_term_safeDel_button,
                    "checked":false,
                    "change":function () {
                        if(isICT){
                            var sDelete = $("#" + $scope.safeDelete.id).widget().option("checked");
                            if(sDelete){
                                $("#isSafeDelete").css("display","block");
                            }
                            else{
                                $("#isSafeDelete").css("display","none");
                            }
                        }
                    }
                };
                $("#isSafeDelete").css("display","none");
                $scope.okBtn = {
                    "id": "ecsStorageDisksDeleteOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var options = {
                            "user": user,
                            "cloudInfraId": winParam.cloudInfra.id,
                            "vpcId": winParam.vpcId,
                            "deleteParam": {
                                "volumnIds": [disk.id]
                            }
                        };

                        if (isICT) {
                            options.deleteParam.forceDelete = $("#" + $scope.safeDelete.id).widget().option("checked");
                        } else {
                            options.deleteParam.safeDelete = $("#" + $scope.safeDelete.id).widget().option("checked");
                        }

                        var defer = diskServiceIns.deleteDisk(options);
                        defer.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsStorageDisksDelDiskWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsStorageDisksDeleteCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsStorageDisksDelDiskWinId").widget().destroy();
                    }
                };
            }
        ];

        var deleteDiskModule = angular.module("ecs.storage.disk.del", ['ng', 'wcc', 'ngSanitize']);
        deleteDiskModule.controller("ecs.storage.disk.del.ctrl", deleteDiskCtrl);
        deleteDiskModule.service("camel", http);
        deleteDiskModule.service("exception", exception);

        return deleteDiskModule;
    }
);
