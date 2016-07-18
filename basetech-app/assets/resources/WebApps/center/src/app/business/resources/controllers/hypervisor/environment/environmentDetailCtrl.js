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

        var enDetailCtrl = ["$scope", "$compile", "camel", "validator", function ($scope, $compile, camel, validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;

            $scope.info = {};
            $scope.label = {
                "port":$scope.i18n.common_term_port_label+":",
                "protocol":$scope.i18n.common_term_protocolType_label+":",
                "userName":$scope.i18n.common_term_userName_label+":",
                "refreshCycle":$scope.i18n.common_term_updatCycleHour_label+":",
                "refreshTime":$scope.i18n.common_term_updatTime_label+":",
                "vendor":$scope.i18n.common_term_provider_label+":",
                "version":$scope.i18n.common_term_version_label+":"
            };

            $scope.getEnvironment = function (eid, detailId) {
                $scope.eid = eid;
                $scope.detailId = detailId;
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}",o:{id:eid}},
                    "params": null,
                    "userId":user.id
                });
                deferred.success(function (data) {
                    var hypervisor = data && data.hypervisor;
                    $scope.$apply(function () {
                        $scope.info.port = hypervisor.connector.port;
                        $scope.info.protocol = hypervisor.connector.protocol;
                        $scope.info.userName = hypervisor.connector.userName;
                        $scope.info.refreshCycle = hypervisor.refreshCycle;
                        $scope.info.refreshTime = hypervisor.refreshTime;
                        $scope.info.vendor = hypervisor.vendor;
                        $scope.info.version = hypervisor.version;
                        $scope.info.id = hypervisor.id;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
        }];

        var dependency = ["ng", "wcc"];
        var enDetailModule = angular.module("hypervisor.environment.environmentDetail", dependency);
        enDetailModule.service("camel", httpService);
        enDetailModule.service("validator", validatorService);
        enDetailModule.controller("hypervisor.environment.environmentDetail.ctrl", enDetailCtrl);
        return enDetailModule;
    });


