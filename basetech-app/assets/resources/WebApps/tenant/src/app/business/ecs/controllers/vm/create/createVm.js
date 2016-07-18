/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/underscore',
        'app/services/validatorService',
        'app/services/cloudInfraService',
        'app/services/capacityService',
        'app/services/exceptionService',
        'tiny-directives/Step'
    ],
    function ($, angular, _, validator, cloudInfraService, capacityService, exceptionService) {
        "use strict";

        var createVmCtrl = ["$rootScope", "$scope", "$compile", "$stateParams", "$q", "camel",
            function ($rootScope, $scope, $compile, $stateParams, $q, camel) {
                //共享存储类型
                var SHARED_STORAGE_TYPE = "2";
                var i18n = $scope.i18n;
                $scope.service = {

                    "step": {
                        "id": "ecsVmCreateStep",
                        "values": [i18n.vm_term_chooseTemplate_label, i18n.spec_term_vm_label, i18n.vm_term_chooseNet_label, i18n.common_term_basicInfo_label, i18n.common_term_confirmInfo_label],
                        "width": 592,
                        "jumpable": false
                    },
                    "show": "selTemp",
                    "from": "vms",

                    // 保存公共数据
                    "cloudInfra": {},
                    "cloudInfraId": $stateParams.cloudInfra,
                    "vmName": "VM001",
                    "vmComputeName": "",
                    "description": "",

                    "selTemplateId": $stateParams.vmtId,
                    "selMinRam": "",
                    "selMinDisk": "",
                    "selTemplate": {},

                    "sla": {},
                    "configType": "system",
                    "configTemplate": "",
                    "cpuNum": 1,
                    "memory": 1024,
                    "vmNum": 1,
                    "dataType": SHARED_STORAGE_TYPE,

                    "networkType": "private",
                    "vpcId": $stateParams.vpcId,
                    "vpcName": "",
                    "basicNetwork": {},
                    "privateNetwork": [],

                    // 差异化参数
                    "vm_support_user_define_config": false,

                    // 计算磁盘的总大小,skipFirstDisk跳过第一块硬盘
                    "getDiskTotalSize": function (disks, sizeName, skipFirstDisk) {
                        var total = 0;
                        if (disks && disks.length > 0) {
                            _.each(disks, function (item, index) {
                                if (!(skipFirstDisk && index === 0)) {
                                    total += parseInt(item[sizeName], 10);
                                }
                            });
                        }
                        return total;
                    }
                };

                // 通过cloudInfraId查询资源池详情，获得类型版本，再取差异化参数
                function queryCloudInfraCapacity() {
                    if (!$stateParams.cloudInfra) {
                        return;
                    }
                    var defer = new cloudInfraService($q, camel).queryCloudInfra($scope.user.vdcId, $scope.user.id, $stateParams.cloudInfra);
                    defer.then(function (data) {
                        if (data && data.cloudInfra) {
                            $scope.service.cloudInfra = data.cloudInfra;
                            var cap = new capacityService($q, camel).querySpecificCapacity($rootScope.capacities, data.cloudInfra.type, data.cloudInfra.version);
                            if (cap) {
                                $scope.service.vm_support_user_define_config = cap.vm_support_user_define_config;
                            }
                        }
                    });
                    return defer;
                }

                // 事件定义
                $scope.events = {
                    "selTemplateNext": "selTemplateNext",
                    "selTemplateNextFromParent": "selTemplateNextFromParent",
                    "specInfoNext": "specInfoNext",
                    "specInfoNextFromParent": "specInfoNextFromParent",
                    "selNetworkNext": "selNetworkNext",
                    "selNetworkNextFromParent": "selNetworkNextFromParent"
                };

                // 事件转发
                $scope.$on($scope.events.selTemplateNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selTemplateNextFromParent, msg);
                });
                $scope.$on($scope.events.specInfoNext, function (event, msg) {
                    $scope.$broadcast($scope.events.specInfoNextFromParent, msg);
                });
                $scope.$on($scope.events.selNetworkNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selNetworkNextFromParent, msg);
                });

                $scope.init = function () {
                    var defer = queryCloudInfraCapacity();
                    if ($stateParams.vmtId) {
                        $scope.service.from = "template";
                        $scope.service.step.values = [i18n.spec_term_vm_label, i18n.vm_term_chooseNet_label, i18n.common_term_basicInfo_label, i18n.common_term_confirmInfo_label];
                        $scope.service.show = "specInfo";
                        defer.then(function () {
                            $scope.$broadcast($scope.events.selTemplateNextFromParent, "");
                        });
                    }
                };

                // 初始化
                $scope.init();
            }
        ];
        return createVmCtrl;
    }
);
