/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Select",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/competitionConfig",
    "app/services/exceptionService"],
    function ($, angular, Select, validatorService, UnifyValid, httpService, competition, Exception) {
        "use strict";

        var storageDetailCtrl = ["$scope", "$compile", "camel", "validator", function ($scope, $compile, camel, validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.competition = competition;

            $scope.info = {};
            $scope.label = {
                "mediaType": $scope.i18n.common_term_storageMedia_label + ":",
                "thin": $scope.i18n.common_term_thinProvCfg_label + ":",
                "maintenance": $scope.i18n.device_term_MaintenanceMode_value + ":",
                "device": $scope.i18n.common_term_storageDevice_label + ":",
                "hypervisor": $scope.i18n.virtual_term_hypervisor_label + ":",
                "cluster": $scope.i18n.virtual_term_clusters_label + ":",
                "threshold": $scope.i18n.resource_term_allocationThreshold_label + ":",
                "ioSwitch": $scope.i18n.resource_term_IOcontorl_label + ":",
                "disasterGroup": $scope.i18n.resource_term_disasterStorGroup_label + ":"
            };

            $scope.getStorage = function (storageId, detailId) {
                $scope.storageId = storageId;
                $scope.detailId = detailId;
                var params = {
                    "detail": "0",
                    "scopeType": "DATASTORE",
                    "scopeObjectId": $scope.storageId
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var store = data.datastoreInfos[0];
                    $scope.$apply(function () {
                        $scope.info.supportThreshold = store.ability.supportThreshold;
                        $scope.info.threshold = (store.threshold && store.threshold > 0) ? $.encoder.encodeForHTML(store.threshold) : "";
                        $scope.info.config = store.ability.isThin ? $scope.i18n.common_term_support_value : $scope.i18n.common_term_notSupport_value;
                        $scope.info.maintenanceMode = store.maintenancemode ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                        $scope.info.mediaType = store.mediaType === "SAN-Any" ? "Any" : store.mediaType;
                        $scope.info.hypervisor = store.hypervisorName;
                        $scope.info.cluster = store.resClusterName;
                        $scope.info.ioSwitchStr = store.ioSwitch == 0 ? $scope.i18n.common_term_close_button : $scope.i18n.common_term_enable_value;
                        $scope.info.storageunitname = store.storageunitname;
                        $scope.info.disasterGroupName = store.disasterGroupName;
                        $scope.info.id = store.id;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
        }];

        var dependency = ["ng", "wcc"];
        var storageDetailModule = angular.module("rpool.zone.zoneResources.storageDetail", dependency);
        storageDetailModule.service("camel", httpService);
        storageDetailModule.service("validator", validatorService);
        storageDetailModule.controller("rpool.zone.zoneResources.storageDetail.ctrl", storageDetailCtrl);
        return storageDetailModule;
    });


