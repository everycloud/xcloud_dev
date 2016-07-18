/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-6-26
 */
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/business/resources/services/openstackResources/regionService",
    "fixtures/dataCenterFixture"
],
    function ($, angular, RegionService) {
        "use strict";
        var summaryCtrl = ['$scope', '$state', '$stateParams',"$q", "camel", function ($scope, $state, $stateParams, $q, camel) {
            $scope.regionName = $stateParams.region;

            $scope.token = undefined;
            $scope.novaID = undefined;
            var regionService = new RegionService($q, camel);
            var colon = ":";
            $scope.basicInfo = {
                name: {
                    "label": $scope.i18n.common_term_name_label + colon,
                    "value": $scope.regionName
                },
                service: {
                    "label": $scope.i18n.service_term_service_label + colon,
                    "values": ["cinder","nova"]
                }
            };

            $scope.label = {
                "resourceUseInfo": $scope.i18n.perform_term_resourceUsageStatus_label,
                "memory": $scope.i18n.common_term_memory_label,
                "localStorage": $scope.i18n.resource_stor_create_para_type_option_local_value || "本地存储",
                "rate": $scope.i18n.perform_term_UsageRate_label + colon,
                "total": $scope.i18n.common_term_capacityTotal_label + colon,
                "useInfo": $scope.i18n.common_term_used_value + "/" + $scope.i18n.common_term_available_label,
                "allotInfo": "已分配/率:"
            };

            $scope.operator = {
                "getSummaryInfo":function(){
                    var deferred = $q.defer();
                    var tmpPromise = deferred.promise;

                    // 设置基本信息
                    var promise = regionService.getEndpoint();
                    promise.then(function (data) {
                        if (!data || !data.endpoint) {
                            deferred.reject();
                        }

                        var serviceNameList = [];
                        for (var index in data.endpoint) {
                            var endpoint = data.endpoint[index];
                            var regionName = endpoint.regionName;
                            if (regionName === $scope.regionName) {
                                serviceNameList.push(endpoint.serviceName);

                                // 初始化nova服务id
                                if(endpoint.serviceName === "nova"){
                                    $scope.novaID = endpoint.id;
                                }
                            }
                        }

                        $scope.basicInfo.service.values = serviceNameList;
                        return deferred.resolve();
                    });

                    // 设置资源使用情况
                    tmpPromise.then(function(){
                        var statisticsPromise = regionService.getStatistics($scope.novaID);
                        statisticsPromise.then(function(data){
                            if(!data || !data.hypervisor_statistics){
                                return;
                            }

                            var statistics = data.hypervisor_statistics;
                            $scope.cpu = {};
                            $scope.cpu.rate = (statistics.vcpus_used * 100 /statistics.vcpus).toFixed(2) + "%";
                            $scope.cpu.total = statistics.vcpus + $scope.i18n.common_term_entry_label;
                            $scope.cpu.useInfo = statistics.vcpus_used + $scope.i18n.common_term_entry_label + "/" +
                                (statistics.vcpus - statistics.vcpus_used) + $scope.i18n.common_term_entry_label;
                            $scope.memory = {};
                            $scope.memory.rate = (statistics.memory_mb_used * 100 /statistics.memory_mb).toFixed(2) + "%";
                            $scope.memory.total = statistics.memory_mb + "MB";
                            $scope.memory.useInfo = statistics.memory_mb_used + "MB/" + (statistics.memory_mb - statistics.memory_mb_used) + "MB";
                            $scope.storage = {};
                            $scope.storage.rate = (statistics.local_gb_used * 100 /statistics.local_gb).toFixed(2) + "%";
                            $scope.storage.total = statistics.local_gb + "GB";
                            $scope.storage.useInfo = statistics.local_gb_used + "GB/" + (statistics.local_gb - statistics.local_gb_used) + "GB";
                        });
                    });
                }
            };

            $scope.operator.getSummaryInfo();
        }];
        return summaryCtrl;
    });

