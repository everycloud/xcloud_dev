/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    "app/services/cloudInfraService",
    "app/business/ecs/services/host/hostService",
    "tiny-lib/underscore",
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-directives/Button",
    "tiny-directives/Select",
    "fixtures/ecsFixture"
], function ($, angular,sprintf, ngSanitize, keyIDI18n, cloudInfraService, hostService, _, http, exception) {
    "use strict";

    var applyHostCtrl = ["$scope", "$compile", "camel", "$q", "exception",
        function ($scope, $compile, camel, $q, exception) {
            var shareData4Apply = $("#ecs_hosts_apply_winId").widget().option("shareData4Apply") || {};
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var hostServiceIns = new hostService(exception, $q, camel);
            var user = $("html").scope().user;
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            $scope.az = {
                "label": i18n.common_term_section_label + ":",
                "id": "ecsHostApplyAz",
                "values": [],
                "width": 220
            };

            $scope.model = {
                "label": i18n.device_term_model_label + ":",
                "id": "ecsHostApplyModel",
                "values": [{
                    "selectId": "Huawei Tecal RH2285 V2",
                    "label": "Huawei Tecal RH2285 V2",
                    "checked": true
                }, {
                    "selectId": "Huawei Tecal RH2288 V2",
                    "label": "Huawei Tecal RH2288 V2"
                }],
                "width": 220
            };

            $scope.cpuNum = {
                "label": i18n.common_term_cpuNum_label + ":",
                "id": "ecsHostApplyCpuNum",
                "values": [{
                    "selectId": "2",
                    "label": "2",
                    "checked": true
                }, {
                    "selectId": "4",
                    "label": "4"
                }],
                "width": 220
            };

            $scope.memory = {
                "label": i18n.common_term_memoryGB_label + ":",
                "id": "ecsHostApplyMemory",
                "values": [{
                    "selectId": "16",
                    "label": "16",
                    "checked": true
                }, {
                    "selectId": "32",
                    "label": "32"
                }],
                "width": 220
            };

            $scope.os = {
                "label": i18n.common_term_OS_label + ":",
                "id": "ecsHostApplyOs",
                "values": [{
                    "selectId": "RedHat Linux Enterprise 6.2",
                    "label": "RedHat Linux Enterprise 6.2",
                    "checked": true
                }, {
                    "selectId": "SUSE Linux 6.1",
                    "label": "SUSE Linux 6.1"
                }],
                "width": 220
            };

            $scope.applyBtn = {
                "id": "ecsHostApplyOk",
                "text": i18n.common_term_apply_button,
                "click": function () {
                    //获取host信息
                    var host = {
                        "az": $("#ecsHostApplyAz").widget().getSelectedId(),
                        "model": $("#ecsHostApplyModel").widget().getSelectedId(),
                        "cpuNum": $("#ecsHostApplyCpuNum").widget().getSelectedId(),
                        "memory": $("#ecsHostApplyMemory").widget().getSelectedId(),
                        "os": $("#ecsHostApplyOs").widget().getSelectedId()
                    };

                    var params = {
                        "user": user,
                        "cloudInfraId": $("#" + $scope.az.id).widget().getSelectedId(),
                        "vpcId": shareData4Apply.vpcId,
                        "hostInfo": host
                    };
                    var deferred = hostServiceIns.applyHost(params);
                    deferred.then(function (data) {
                        shareData4Apply.needRefresh = true;
                        $("#ecs_hosts_apply_winId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "ecsHostApplyOkCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecs_hosts_apply_winId").widget().destroy();
                }
            };

            //查询当前租户可见的地域列表
            function getLocations() {
                var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        _.each(data.cloudInfras, function (item, index) {
                            if (shareData4Apply.cloudInfraId && (shareData4Apply.cloudInfraId === item.selectId)) {
                                item.checked = true;
                            } else {
                                item.checked = false;
                            }
                        });
                        $scope.az.values = data.cloudInfras;
                    }
                });
            }

            getLocations();
        }
    ];

    var applyHostModule = angular.module("ecs.host.apply", ['ng', "wcc", 'ngSanitize']);
    applyHostModule.controller("ecs.host.apply.ctrl", applyHostCtrl);
    applyHostModule.service("camel", http);
    applyHostModule.service("exception", exception);
    return applyHostModule;
});
