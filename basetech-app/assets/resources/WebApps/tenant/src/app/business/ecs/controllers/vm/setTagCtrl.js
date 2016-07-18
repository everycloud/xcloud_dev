/**
 * 文件名：setTagCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-vm-设置标签的control
 * 修改时间：14-4-24
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'tiny-common/UnifyValid',
        'app/services/httpService',
        'app/services/exceptionService',
        'app/services/validatorService',
        'app/business/ecs/services/vm/updateVmService',
        'tiny-directives/RadioGroup'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, UnifyValid, http, exceptionService, validateService, updateVmService) {
        "use strict";
        var setTagCtrl = ["$q", "$scope", "$compile", "camel", "exception",
            function ($q, $scope, $compile, camel, exception) {
                var winParam = $("#ecsVmSetTagWinId").widget().option("winParam");
                winParam = winParam || {};
                var vpcId = "-1";
                var user = $("html").scope().user || {};
                var validator = new validateService();
                var updateVmServiceIns = new updateVmService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.tag = {
                    "label": i18n.cloud_term_tag_label + ":",
                    "id": "ecsVmSetTagName",
                    "width": "200",
                    "value": "",
                    "validate": "regularCheck(" + validator.vmTagReg + "):" + i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 256)
                };

                $scope.okBtn = {
                    "id": "ecsVmSetTagOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($(".ecs_vm_set_tag"))) {
                            return;
                        }

                        var options = {
                            "user": user,
                            "cloudInfraId": winParam.cloudInfraId,
                            "vpcId": vpcId,
                            "tag": {
                                "vmIds": winParam.vms,
                                "tag": $("#" + $scope.tag.id).widget().getValue()
                            }
                        };
                        var defer = updateVmServiceIns.modifyVmBatch(options);
                        defer.then(function () {
                            winParam.needRefresh = true;
                            $("#ecsVmSetTagWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmSetTagCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmSetTagWinId").widget().destroy();
                    }
                };
            }
        ];

        var setTagModule = angular.module("ecs.vm.set.tag", ['ng', 'wcc',"ngSanitize"]);
        setTagModule.controller("ecs.vm.set.tag.ctrl", setTagCtrl);
        setTagModule.service("camel", http);
        setTagModule.service("exception", exceptionService);
        return setTagModule;
    }
);
