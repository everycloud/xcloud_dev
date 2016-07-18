/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Select",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"],
    function ($,angular, Select, validatorService, UnifyValid, httpService,Exception) {
        "use strict";

        var hostDetailCtrl = ["$scope", "$compile", "camel", "validator", function ($scope, $compile, camel, validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#migrateVmWindow").widget();
            var novaId = window.option("novaId");
            var projectId = window.option("projectId");
            var tokenId = window.option("tokenId");
            $scope.info = {
                cpu:{},
                memory:{},
                disk:{}
            };
            $scope.label = {
                "cpu":$scope.i18n.common_term_cpu_label,
                "disk":$scope.i18n.common_term_disk_label,
                "memory":$scope.i18n.common_term_memory_label,
                "total":$scope.i18n.common_term_total_label+":",
                "used":$scope.i18n.perform_term_allocated_label+":",
                "free":$scope.i18n.common_term_noAssign_value+":"
            };

            $scope.getHostInfo = function (hostId, detailId) {
                $scope.hostId = hostId;
                $scope.detailId = detailId;
                var deferred = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-hosts/{hostId}",
                        o: {novaId: novaId, projectId: projectId, hostId: $scope.hostId}
                    },
                    "params": null,
                    "userId": user.id,
                    "beforeSend": function (request) {
                        request.setRequestHeader("X-Auth-Token", tokenId);
                    }
                });
                deferred.success(function (data) {
                    var host = data.host || [];
                    $scope.$apply(function(){
                        for(var i=0;i<host.length;i++){
                            if(host[i].resource.project === "(total)"){
                                $scope.info.cpu.total = host[i].resource.cpu;
                                $scope.info.memory.total = host[i].resource.memory_mb;
                                $scope.info.disk.total = host[i].resource.disk_gb;
                            }
                            if(host[i].resource.project === "(used_now)"){
                                $scope.info.cpu.used = host[i].resource.cpu;
                                $scope.info.memory.used = host[i].resource.memory_mb;
                                $scope.info.disk.used = host[i].resource.disk_gb;
                            }
                        }
                        $scope.info.cpu.free =  $scope.info.cpu.total - $scope.info.cpu.used;
                        $scope.info.memory.free = $scope.info.memory.total - $scope.info.memory.used;
                        $scope.info.disk.free = $scope.info.disk.total - $scope.info.disk.used;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
        }];

        var dependency = ["ng", "wcc"];
        var hostDetailModule = angular.module("vdcMgr.migrateServer.hostDetail", dependency);
        hostDetailModule.service("camel", httpService);
        hostDetailModule.service("validator", validatorService);
        hostDetailModule.controller("vdcMgr.migrateServer.hostDetail.ctrl", hostDetailCtrl);
        return hostDetailModule;
    });


