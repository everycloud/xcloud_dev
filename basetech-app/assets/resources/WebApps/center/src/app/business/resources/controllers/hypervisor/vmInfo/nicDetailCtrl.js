/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-widgets/Window",
    "app/services/competitionConfig"
], function ($, angular, httpService, Exception, Window, competition) {
    "use strict";

    var nicDetailCtrl = ["$scope", "$compile", "camel","$sce", function ($scope, $compile, camel,$sce) {
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var ipResults = {
            "0": $scope.i18n.vm_nic_IPstatus_para_sys_value,
            "1": $scope.i18n.vm_nic_IPstatus_para_diffWithSys_value,
            "null":$scope.i18n.vm_nic_IPstatus_para_withoutSys_value
        };
        $scope.label = {
            ip: $scope.i18n.common_term_IP_label + ":",
            mac: $scope.i18n.common_term_MAC_label + ":",
            ipStatus: $scope.i18n.vm_term_IPstatus_label + ":",
            sg: $scope.i18n.org_term_secuGroupName_label + ":"
        };
        $scope.vmType = $("#hardwareNicDiv").scope().vmType;
        $scope.viewNic = function (nicInfo) {
            $scope.$apply(function () {
                $scope.nicId = nicInfo.nicId;
                $scope.ip =  nicInfo.ip?nicInfo.ip.replace(";","<br/>"):"";
                $scope.ip = $sce.trustAsHtml($scope.ip);
                $scope.mac = nicInfo.mac;
                $scope.ipStatus = ipResults[nicInfo.ipStatus] || $scope.i18n.vm_nic_IPstatus_para_withoutSys_value;
                $scope.sg = nicInfo.sg;
            });
        };
    }];

    var dependency = ["ng", "wcc"];
    var nicDetailApp = angular.module("resources.hypervisor.nicDetail", dependency);
    nicDetailApp.service("camel", httpService);
    nicDetailApp.controller("resources.hypervisor.nicDetail.ctrl", nicDetailCtrl);
    return nicDetailApp;
});