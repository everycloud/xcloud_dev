/**
 * 文件名：deleteVmCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-vm-deleteVm--删除虚拟机的control
 * 修改时间：14-4-2
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        'app/services/exceptionService',
        'app/business/ecs/services/vm/updateVmService',
        'tiny-directives/RadioGroup'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, exceptionService, updateVmService) {
        "use strict";
        var deleteVmCtrl = ["$q", "$scope", "$compile", "exception", "camel",
            function ($q, $scope, $compile, exception, camel) {
                // 父窗口传递的参数
                var winParam = $("#ecsVmDeleteWinId").widget().option("winParam");
                winParam = winParam || {};
                var vpcId = "-1";

                // 用户信息
                var user = $("html").scope().user || {};
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                // 公共服务实例
                var updateVmServiceIns = new updateVmService(exception, $q, camel);

                $scope.deleteType = {
                    "id": "ecsVmDeleteType",
                    "layout": "verizon",
                    "values": [{
                        "key": "normal",
                        "text": i18n.common_term_commonSDel_button,
                        "checked": true
                    }, {
                        "key": "safe",
                        "text": i18n.common_term_safeDel_button
                    }]
                };

                $scope.okBtn = {
                    "id": "ecsVmDeleteOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var options = {
                            "user": user,
                            "cloudInfraId": winParam.cloudInfraId,
                            "vpcId": vpcId,
                            "params": {
                                "delete": {
                                    "vmIds": winParam.vms,
                                    "mode": $("#ecsVmDeleteType").widget().opChecked("checked")
                                }
                            }
                        };

                        var deferred = updateVmServiceIns.operateVm(options);
                        deferred.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsVmDeleteWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmDeleteCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmDeleteWinId").widget().destroy();
                    }
                };
            }
        ];

        var deleteVmModule = angular.module("ecs.vm.delete", ['ng',"wcc", "ngSanitize"]);
        deleteVmModule.controller("ecs.vm.delete.ctrl", deleteVmCtrl);
        deleteVmModule.service("camel", http);
        deleteVmModule.service("exception", exceptionService);

        return deleteVmModule;
    }
);
