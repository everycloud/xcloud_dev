/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService"],
    function ($, angular, httpService, Exception) {
        "use strict";
        var hostDetailsCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.info = {};
            $scope.label = {
                "id": $scope.i18n.common_term_ID_label + ":",
                "logicalCpuQuantity": $scope.i18n.common_term_vcpuNum_label + ":",
                "imcSetting": $scope.i18n.virtual_term_IMCmode_label + ":",
                "maxImcSetting": $scope.i18n.virtual_term_IMCmodeHighest_label + ":",
                "maintenance": $scope.i18n.virtual_host_view_para_mainten_label + ":",
                "antiVirusVmNum":$scope.i18n.vm_term_securityUserVMnum_label+":"
            };

            $scope.getHosts = function (hostId,hyperType) {
                $scope.hostId = hostId;
                $scope.hyperType = hyperType;
                if($scope.hyperType !== "VMware"){
                    getAntiVirus();
                }
                var deferred = camel.get({
                    url: "/goku/rest/v1.5/irm/1/hosts/" + hostId
                });
                deferred.success(function (data) {
                    if (data && data.host) {
                        var host = data.host;
                        $scope.$apply(function () {
                            $scope.info.hostId = host.id;
                            $scope.info.logicalCpuQuantity = host.logicalCpuQuantity;
                            $scope.info.hostImcSetting = host.imcSetting;
                            $scope.info.hostMaxImcSetting = host.maxImcSetting || $scope.i18n.common_term_noTurnOn_value;
                            $scope.info.maintenance = host.maintenanceStatus ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                        });
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
            function getAntiVirus() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/1/hosts/{id}/securityswitch",o:{id:$scope.hostId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function(){
                        $scope.info.antiVirusVmNum = data.antivirus?data.antivirus:"";
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        }];

        var dependency = ["ng", "wcc"];
        var hostDetailsModule = angular.module("hypersior.host.hostDetails.hostDetails", dependency);
        hostDetailsModule.service("camel", httpService);
        hostDetailsModule.controller("hypersior.host.hostDetails.hostDetailsCtrl.ctrl", hostDetailsCtrl);
        return hostDetailsModule;
    });


