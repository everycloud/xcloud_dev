/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Window",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($, angular, Window, httpService, Exception) {
        "use strict";
        var seniorConfigCtrl = ["$scope", "$compile", "camel", '$sce', function ($scope, $compile, camel, $sce) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
			var i18n = $scope.i18n || {};
            var descType = $scope.i18n.locale === "zh"?"zhDes":"enDes";
			
            var window = $("#seniorConfigWindow").widget();
            var clusterId = window.option("clusterId");
			
            $scope.label = {
                ha: i18n.vm_vm_create_para_HA_mean_tip||"HA：系统持续监控所有物理主机，当主机故障时能自动迁移故障主机上开启HA的虚拟机。集群下所有开启HA的虚拟机生效；未开启HA的虚拟机不生效。",
                reserve: $sce.trustAsHtml(i18n.virtual_cluster_advanSet_para_HAreserved_mean_label),
                reuse: i18n.split(i18n.virtual_cluster_advanSet_para_memOvercommit_mean_label)[0]||"",
                openReuse: i18n.split(i18n.virtual_cluster_advanSet_para_memOvercommit_mean_label)[1]||"",
                closeReuse: i18n.split(i18n.virtual_cluster_advanSet_para_memOvercommit_mean_label)[2]||"",
                policy: i18n.split(i18n.virtual_cluster_advanSet_para_VMpolicy_mean_label)[0]||"",
                loadBalance: i18n.split(i18n.virtual_cluster_advanSet_para_VMpolicy_mean_label)[1]||"",
                random: i18n.split(i18n.virtual_cluster_advanSet_para_VMpolicy_mean_label)[2]||"",
                numa: $sce.trustAsHtml(i18n.virtual_cluster_advanSet_para_NUMA_mean_label),
                cpuid: i18n.virtual_cluster_advanSet_para_currentCPUID_label||"当前CPUID详细信息"
            };
            //HA复选框
            $scope.haCheckbox = {
                id: "haCheckBox",
                text: i18n.common_term_turnOnHA_button||"开启HA",
                "checked": false,
                "change": function () {
                    var ha = $("#" + $scope.haCheckbox.id).widget().option("checked");
                    $("#" + $scope.haReserveCheckbox.id).widget().option("disable", !ha);
                    var haResrve = $("#" + $scope.haReserveCheckbox.id).widget().option("checked");
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("disable", !(ha && haResrve));
                    $("#" + $scope.memoryReserveSpinner.id).widget().option("disable", !(ha && haResrve));
                }
            };
            //HA资源预留复选框
            $scope.haReserveCheckbox = {
                id: "haReserveCheckBox",
                text: i18n.vm_term_HAreserved_label||"HA资源预留",
                disable: true,
                change: function () {
                    var haResrve = $("#" + $scope.haReserveCheckbox.id).widget().option("checked");
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("disable", !haResrve);
                    $("#" + $scope.memoryReserveSpinner.id).widget().option("disable", !haResrve);
                }
            };
            //CPU预留微调框
            $scope.cpuReserveSpinner = {
                label: (i18n.perform_term_CPUreserved_label||"CPU预留(%)")+":",
                id: "cpuReserveSpinner",
                disable: true,
                value: "0",
                "max": "50",
                "min": "0",
                "width": "60px"
            };
            //内存预留微调框
            $scope.memoryReserveSpinner = {
                label: (i18n.perform_term_memReserved_label||"内存预留(%)")+":",
                id: "memoryReserveSpinner",
                disable: true,
                value: "0",
                "max": "50",
                "min": "0",
                "width": "60px"
            };
            //主机内存复用复选框
            $scope.reuseCheckbox = {
                id: "memoryReuseCheckBox",
                text: i18n.common_term_hostMemOvercommit_label||"主机内存复用"
            };
            //虚拟机启动策略下拉框
            $scope.policySelector = {
                "label": (i18n.vm_term_vmStartMode_label||"虚拟机启动策略")+":",
                "id": "hostPolicySelector",
                "width": "135",
                "disable": true,
                "values": [
                    {
                        "selectId": "loadBalance",
                        "label": i18n.common_term_lbFunction_label||"负载均衡",
                        "checked": true
                    },
                    {
                        "selectId": "random",
                        "label": i18n.common_term_autoAllocation_label||"自动分配"
                    }
                ]
            };
            //GuestNUMA复选框
            $scope.numaCheckbox = {
                id: "guestNumaCheckBox",
                text: "GuestNUMA"
            };
            $scope.isImc = false;
            $scope.imcSetting = "Merom";
            //启动IMC模式复选框
            $scope.imcCheckbox = {
                id: "startImcCheckBox",
                text: i18n.virtual_term_startupIMC_button||"启动IMC模式",
                checked: $scope.isImc,
                change: function () {
                    var result = $("#" + $scope.imcCheckbox.id).widget().option("checked");
                    $("#" + $scope.imcSelector.id).widget().option("disable", !result);
                    $scope.isImc = result;
                }
            };
            //IMC模式下拉框
            $scope.imcSelector = {
                "label": (i18n.virtual_term_IMCmode_label||"IMC模式")+":",
                "id": "imcSelector",
                "width": "135",
                "disable": !$scope.isImc,
                "values": [
                    {
                        "selectId": "Merom",
                        "label": "Merom",
                        "checked": true
                    },
                    {
                        "selectId": "Penryn",
                        "label": "Penryn"
                    },
                    {
                        "selectId": "Nehalem",
                        "label": "Nehalem"
                    },
                    {
                        "selectId": "Westmere",
                        "label": "Westmere"
                    },
                    {
                        "selectId": "Sandy Bridge",
                        "label": "Sandy Bridge"
                    },
                    {
                        "selectId": "Ivy Bridge",
                        "label": "Ivy Bridge"
                    }
                ],
                change: function () {
                    $scope.imcSetting = $("#" + $scope.imcSelector.id).widget().getSelectedId();
                    $("#" + $scope.descTextbox.id).widget().option("value", $scope.imcMap[$scope.imcSetting][descType]);
                }
            };
            //描述输入框
            $scope.descTextbox = {
                "label":  $scope.i18n.common_term_desc_label+":",
                "height": "180px",
                "width": "650px",
                "id": "configDescTextbox",
                "type": "multi",
                "disable": true
            };
            $scope.cpuidInfo = function () {
                var newWindow = new Window({
                    "winId": "cpuidInfoWindow",
                    "title": i18n.virtual_cluster_advanSet_para_currentCPUID_label||"当前CPUID详细信息",
                    "imcSetting": $scope.imcSetting,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/cluster/cpuidInfo.html",
                    "height": 600,
                    "width": 430,
                    "close": function () {

                    }
                });
                newWindow.show();
            };
            //确定按钮
            $scope.okButton = {
                "id": "configOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    setConfig();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "configCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
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
                    $scope.controlPolicy = params.controlPolicy;
                    $scope.controlPolicySwitch = params.controlPolicySwitch;
                    $("#" + $scope.haCheckbox.id).widget().option("checked", params.haSwitch);
                    $("#" + $scope.haReserveCheckbox.id).widget().option("checked", params.accessSwitch || params.controlPolicySwitch);
                    $("#" + $scope.haReserveCheckbox.id).widget().option("disable", !params.haSwitch);
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("value", params.cpuReservation);
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("disable", !params.accessSwitch && !params.controlPolicySwitch);
                    $("#" + $scope.memoryReserveSpinner.id).widget().option("value", params.memoryReservation);
                    $("#" + $scope.memoryReserveSpinner.id).widget().option("disable",  !params.accessSwitch && !params.controlPolicySwitch);

                    $("#" + $scope.reuseCheckbox.id).widget().option("checked", params.overCommit);
                    $("#" + $scope.policySelector.id).widget().opChecked(params.resStrategy);
                    $("#" + $scope.numaCheckbox.id).widget().option("checked", params.isEnableGuestNuma);
                    $("#" + $scope.imcCheckbox.id).widget().option("checked", params.isEnableImc);
                    $("#" + $scope.imcSelector.id).widget().option("disable", !params.isEnableImc);
                    $scope.imcMap = params.imcConfigMap;
                    if (params.imcSetting) {
                        $scope.imcSetting = params.imcSetting;
                    }
                    $("#" + $scope.imcSelector.id).widget().opChecked($scope.imcSetting);
                    $("#" + $scope.descTextbox.id).widget().option("value", $scope.imcMap[$scope.imcSetting][descType]);
                    $scope.$apply(function () {
                        $scope.isImc = params.isEnableImc;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getSchedule() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs", o: {id: clusterId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var drsParams = data.drsParams || {};
                    $("#" + $scope.policySelector.id).widget().option("disable", drsParams.drsSwitch);
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function setConfig() {
                var params = {
                    controlPolicy:$scope.controlPolicy,
                    haSwitch: $("#" + $scope.haCheckbox.id).widget().option("checked"),
                    controlPolicySwitch:$("#" + $scope.haReserveCheckbox.id).widget().option("checked"),
                    accessSwitch: $("#" + $scope.haReserveCheckbox.id).widget().option("checked"),
                    cpuReservation: $("#" + $scope.cpuReserveSpinner.id).widget().option("value"),
                    memoryReservation: $("#" + $scope.memoryReserveSpinner.id).widget().option("value"),
                    overCommit: $("#" + $scope.reuseCheckbox.id).widget().option("checked"),
                    isEnableGuestNuma: $("#" + $scope.numaCheckbox.id).widget().option("checked"),
                    isEnableImc: $("#" + $scope.imcCheckbox.id).widget().option("checked"),
                    imcSetting: $("#" + $scope.imcSelector.id).widget().getSelectedId()
                };
                if (!$("#" + $scope.policySelector.id).widget().option("disable")) {
                    params.resStrategy = $("#" + $scope.policySelector.id).widget().getSelectedId();
                }
                var deferred = camel.put({
                    url: {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/params", o: {id: clusterId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getConfig();
            getSchedule();
        }];

        var seniorConfigApp = angular.module("seniorConfigApp", ['framework']);
        seniorConfigApp.service("camel", httpService);
        seniorConfigApp.controller("resources.clusterInfo.seniorConfig.ctrl", seniorConfigCtrl);
        return seniorConfigApp;
    }
);
