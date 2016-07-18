/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Window",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($, angular, Window, httpService, Exception) {
        "use strict";
        var seniorConfigCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#seniorConfigWindow").widget();
            var clusterId = window.option("clusterId");
            var i18n = $scope.i18n || {};

            //HA复选框
            $scope.haCheckbox = {
                id: "haCheckBox",
                text: i18n.common_term_turnOnHA_button || "开启HA",
                "checked": true,
                disable: true,
                "change": function () {

                }
            };
            //故障主机数单选框
            $scope.faultHostRadio = {
                id: "faultHostRadio",
                "value": "1",
                "name": "haRadioGroup",
                text: (i18n.virtual_term_allowFaultHostNum_label || "资源集群允许的故障主机数目") + ":",
                "checked": false,
                "disable": true,
                "change": function () {

                }
            };
            //故障主机数微调框
            $scope.faultHostTextbox = {
                label: "",
                id: "faultHostTextbox",
                disable: true,
                value: "",
                width: 50
            };
            //保留资源百分比单选框
            $scope.percentRadio = {
                id: "percentRadio",
                "value": "2",
                "name": "haRadioGroup",
                "disable": true,
                text: i18n.virtual_term_faultSwitchSpacePercent_label || "作为故障切换空间容量保留的资源集群资源的百分比",
                "checked": false,
                "change": function () {

                }
            };
            //CPU预留微调框
            $scope.cpuReserveSpinner = {
                label: (i18n.perform_term_CPUreserved_label || "CPU预留(%)") + ":",
                id: "cpuReserveSpinner",
                disable: true,
                value: "0",
                "max": "50",
                "min": "0",
                "width": "60px"
            };
            //内存预留微调框
            $scope.memoryReserveSpinner = {
                label: (i18n.perform_term_memReserved_label || "内存预留(%)") + ":",
                id: "memoryReserveSpinner",
                disable: true,
                value: "0",
                "max": "50",
                "min": "0",
                "width": "60px"
            };
            //指定主机单选框
            $scope.translateRadio = {
                id: "translateRadio",
                "value": "3",
                "name": "haRadioGroup",
                "disable": true,
                text: (i18n.virtual_term_designationFaultSwitchHost_label || "指定故障切换主机") + ":",
                "checked": false,
                "change": function () {

                }
            };
            //确定按钮
            $scope.closeButton = {
                "id": "configCloseButton",
                "text": i18n.common_term_close_button || "关闭",
                "click": function () {
                    window.destroy();
                }
            };
            function getConfig() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/params", o: {id: clusterId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var params = data.params;
                    $("#" + $scope.haCheckbox.id).widget().option("checked", params.haSwitch);
                    $("#" + $scope.faultHostTextbox.id).widget().option("value", params.hostsFaultQuantity);
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("value", params.cpuReservation);
                    $("#" + $scope.memoryReserveSpinner.id).widget().option("value", params.memoryReservation);
                    var failoverHosts = params.failoverHosts || [];
                    $scope.$apply(function () {
                        $scope.hostNum = i18n.sprintf(i18n.resource_term_assignedHostValue_label, ""+failoverHosts.length);
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            getConfig();
        }];

        var seniorConfigApp = angular.module("vmwareSeniorConfigApp", ['framework']);
        seniorConfigApp.service("camel", httpService);
        seniorConfigApp.controller("resources.clusterInfo.vmwareSeniorConfig.ctrl", seniorConfigCtrl);
        return seniorConfigApp;
    }
);
