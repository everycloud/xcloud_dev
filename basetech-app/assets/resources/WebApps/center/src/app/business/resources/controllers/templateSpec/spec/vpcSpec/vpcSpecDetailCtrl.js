/**
 * vpc规格详情
 */
define(["tiny-lib/angular",
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    'app/services/exceptionService',
    'app/services/competitionConfig'],
    function (angular, httpService, constants, Exception, competitionConfig) {
        "use strict";

        var vpcSpecDetailCtrl = ["$scope","camel", function($scope, camel){

            var exceptionService = new Exception();
            //SFR场景
            $scope.vmwareICT = competitionConfig.isBaseOnVmware;

            $scope.openstack = $scope.user.cloudType === "OPENSTACK";

            $scope.model = undefined;

            $scope.defaultBand = {
                label: ($scope.i18n.vpc_term_defaultBandMbps_label ||  "默认带宽(Mbps)") + ":",
                require: false,
                "id": "defaultBand",
                "value": ""
            };
            $scope.priority = {
                label: ($scope.i18n.common_term_priority_label ||  "优先级") + ":",
                require: false,
                "value":""
            };
            $scope.receiveBand = {
                label:($scope.i18n.vpc_term_routerReceiveBandMbps_label ||  "路由器接收带宽(Mbps)") + ":",
                require: false,
                "id": "receiveBand",
                "value": ""
            };
            $scope.sendBand = {
                label: ($scope.i18n.vpc_term_routerSendBandMbps_label ||  "路由器发送带宽(Mbps)") + ":",
                require: false,
                "id": "sendBand",
                "value": ""
            };

            $scope.maxSecurityGroupNum = {
                label: ($scope.i18n.template_term_securityGroupMaxNum_label ||  "最大安全组个数") + ":",
                require: false,
                "id": "maxSecurityGroupNum",
                "value": ""
            };
            $scope.maxVCPUNum = {
                label: ($scope.i18n.template_term_vCPUMaxNum_label ||  "最大虚拟CPU核数") + ":",
                require: false,
                "id": "maxVCPUNum",
                "value": ""
            };
            $scope.maxMemoryCapacity = {
                label: ($scope.i18n.template_term_memCapacityMax_label ||  "最大内存容量") +"(MB)"+ ":",
                require: false,
                "id": "maxMemoryCapacity",
                "value": ""
            };
            $scope.maxVMNum = {
                label: ($scope.i18n.app_term_vmMaxNum_label ||  "最大虚拟机个数") + ":",
                require: false,
                "id": "maxVMNum",
                "value": ""
            };
            $scope.maxStorageCapacity = {
                label: ($scope.i18n.template_term_storCapacityMax_label ||  "最大存储容量") +"(GB)"+ ":",
                require: false,
                "id": "maxStorageCapacity",
                "value": ""
            };

            $scope.queryDetail = function (data) {
                var id = data && data.vpcSpecTemplateID;

                var deferred = camel.get({
                    "url": {"s": constants.rest.VPC_SPEC_DETAIL.url, "o": {"tenant_id": 1, "id": id}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.done(function (data) {
                    if (!data) {
                        return;
                    }
                    $scope.$apply(function () {
                        // 获取数据 
                        $scope.model = data;

                        if ($scope.model.priority == "1") {
                            $scope.model.priority = $scope.i18n.common_term_high_label || "高";
                        } else if ($scope.model.priority == "2") {
                            $scope.model.priority = $scope.i18n.common_term_middling_label || "中";
                        } else {
                            $scope.model.priority = $scope.i18n.common_term_low_label || "低";
                        }
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
        }];

        var dependency = [];

        var vpcSpecDetailApp = angular.module("template.vpcSpec.detail", []);

        vpcSpecDetailApp.controller("template.vpcSpec.detail.ctrl", vpcSpecDetailCtrl);
        vpcSpecDetailApp.service("camel", httpService);

        return vpcSpecDetailApp;
    });

