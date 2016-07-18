/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "bootstrapui/ui-bootstrap-tpls",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "tiny-common/UnifyValid"], function ($, angular, uibootstrap, validatorService, UnifyValid) {
    "use strict";
    var configQosCtrl = ["$scope", "validator", function ($scope, validator) {
        var window = $("#configQosWindow").widget();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var vCpu = window.option("vCpu");
        var memory = window.option("memory");
        var model = window.option("createModel");
        var cpuQos = model.cpuQos;
        var memoryQos = model.memoryQos;
        $scope.hyperType = model.hyperType;

        //CPU限制微调框
        var minLimit = model.hyperType === "VMware" ? -1 : 0;
        var cpuLimit = (cpuQos.limit || cpuQos.limit == 0) ? cpuQos.limit : minLimit;
        $scope.cpuLimitSpinner = {
            id: "cpuLimitSpinner",
            label: ($scope.i18n.common_term_limitMHz_label || "限制(MHz)") + ":",
            value: cpuLimit,
            "max": vCpu * 2500,
            "min": minLimit,
            "change": function () {
                var cpuLimit = $("#" + $scope.cpuLimitSpinner.id).widget().option("value");
                var maxReserve = (model.hyperType === "FusionCompute" && cpuLimit == 0) || (model.hyperType === "VMware" && cpuLimit == -1) ? vCpu * 2500 : cpuLimit;
                $("#" + $scope.cpuReserveSpinner.id).widget().option("max", maxReserve);
            }
        };
        //CPU预留微调框
        var maxReserve = ((model.hyperType === "FusionCompute" && cpuLimit == 0) || (model.hyperType === "VMware" && cpuLimit == -1)) ? vCpu * 2500 : cpuLimit;
        $scope.cpuReserveSpinner = {
            id: "cpuReserveSpinner",
            label: ($scope.i18n.perform_term_reservedCapacityMHz_label || "预留(MHz)") + ":",
            value: cpuQos.reservation ? cpuQos.reservation : 0,
            "max": maxReserve,
            "min": "0",
            "extendFunction": ["limitCheck"],
            "validate": "limitCheck:" + ($scope.i18n.common_term_greaterLimit_valid || "必须小于等于限制值"),
            "change": function () {
            }
        };
        //cpu份额下拉框
        $scope.cpuWeightSelector = {
            "id": "cpuWeightSelector",
            label: ($scope.i18n.common_term_qouta_label || "份额") + ":",
            "width": "135",
            "values": [
                {
                    "selectId": "2000",
                    "label": $scope.i18n.common_term_high_label || "高"
                },
                {
                    "selectId": "1000",
                    "label": $scope.i18n.common_term_middling_label || "中"
                },
                {
                    "selectId": "500",
                    "label": $scope.i18n.common_term_low_label || "低"
                },
                {
                    "selectId": "-1",
                    "label": $scope.i18n.common_term_custom_label || "自定义"
                }
            ],
            "defaultSelectedId": getCpuLevel(),
            "change": function () {
                changeCpuWeight();
            }
        };
        //cpu份额输入框
        $scope.cpuWeightTextbox = {
            "id": "cpuWeightTextbox",
            "value": cpuQos.weight ? cpuQos.weight : vCpu * 1000,
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";integer:" + $scope.i18n.common_term_integer_valid +
                ";maxValue(128000):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 128000}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 128000}),
            "change": function () {
                var value = $("#" + $scope.cpuWeightTextbox.id).widget().getValue();
                if (value == vCpu * 2000) {
                    $("#" + $scope.cpuWeightSelector.id).widget().opChecked("2000");
                }
                else if (value == vCpu * 1000) {
                    $("#" + $scope.cpuWeightSelector.id).widget().opChecked("1000");
                }
                else if (value == vCpu * 500) {
                    $("#" + $scope.cpuWeightSelector.id).widget().opChecked("500");
                }
                else {
                    $("#" + $scope.cpuWeightSelector.id).widget().opChecked("-1");
                }
            }
        };

        function changeCpuWeight() {
            var result = $("#" + $scope.cpuWeightSelector.id).widget().getSelectedId();
            if (result === "2000") {
                $("#" + $scope.cpuWeightTextbox.id).widget().option("value", vCpu * 2000);
            }
            else if (result === "1000") {
                $("#" + $scope.cpuWeightTextbox.id).widget().option("value", vCpu * 1000);
            }
            else if (result === "500") {
                $("#" + $scope.cpuWeightTextbox.id).widget().option("value", vCpu * 500);
            }
        }

        function getCpuLevel() {
            if (!cpuQos.weight || cpuQos.weight === vCpu * 1000) {
                return "1000";
            }
            if (cpuQos.weight === vCpu * 2000) {
                return "2000";
            }
            else if (cpuQos.weight === vCpu * 500) {
                return "500";
            }
            return "-1";
        }

        //内存预留微调框
        $scope.memoryReserveSpinner = {
            id: "memoryReserveSpinner",
            value: memoryQos.reservation ? memoryQos.reservation : 0,
            "max": memory,
            "min": "0",
            label: ($scope.i18n.perform_term_reservedCapacityMB_label || "预留(MB)") + " :"
        };
        //内存份额下拉框
        $scope.memoryWeightSelector = {
            "id": "memoryWeightSelector",
            "width": "135",
            label: ($scope.i18n.common_term_qouta_label || "份额") + ":",
            "values": [
                {
                    "selectId": "20",
                    "label": $scope.i18n.common_term_high_label || "高"
                },
                {
                    "selectId": "10",
                    "label": $scope.i18n.common_term_middling_label || "中"
                },
                {
                    "selectId": "5",
                    "label": $scope.i18n.common_term_low_label || "低"
                },
                {
                    "selectId": "-1",
                    "label": $scope.i18n.common_term_custom_label || "自定义"
                }
            ],
            "defaultSelectedId": getMemoryLevel(),
            "change": function () {
                changeMemoryWeight();
            }
        };
        //内存份额输入框
        $scope.memoryWeightTextbox = {
            "id": "memoryWeightTextbox",
            "value": memoryQos.weight ? memoryQos.weight : memory * 10,
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";integer:" + $scope.i18n.common_term_integer_valid +
                ";maxValue(20971520):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 20971520}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 20971520}),
            "change": function () {
                var value = $("#" + $scope.memoryWeightTextbox.id).widget().getValue();
                if (value == memory * 20) {
                    $("#" + $scope.memoryWeightSelector.id).widget().opChecked("20");
                }
                else if (value == memory * 10) {
                    $("#" + $scope.memoryWeightSelector.id).widget().opChecked("10");
                }
                else if (value == memory * 5) {
                    $("#" + $scope.memoryWeightSelector.id).widget().opChecked("5");
                }
                else {
                    $("#" + $scope.memoryWeightSelector.id).widget().opChecked("-1");
                }
            }
        };

        function changeMemoryWeight() {
            var result = $("#" + $scope.memoryWeightSelector.id).widget().getSelectedId();
            if (result === "20") {
                $("#" + $scope.memoryWeightTextbox.id).widget().option("value", memory * 20);
            }
            else if (result === "10") {
                $("#" + $scope.memoryWeightTextbox.id).widget().option("value", memory * 10);
            }
            else if (result === "5") {
                $("#" + $scope.memoryWeightTextbox.id).widget().option("value", memory * 5);
            }
        }
        function getMemoryLevel() {
            if (!memoryQos.weight || memoryQos.weight === memory * 10) {
                return "10";
            }
            if (memoryQos.weight === memory * 20) {
                return "20";
            }
            else if (memoryQos.weight === memory * 5) {
                return "5";
            }
            return "-1";
        }
        //确定按钮
        $scope.okButton = {
            "id": "configQosOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#configQosDiv"));
                if (!result) {
                    return;
                }
                cpuQos.reservation = parseInt($("#" + $scope.cpuReserveSpinner.id).widget().option("value"),10);
                cpuQos.weight = parseInt($("#" + $scope.cpuWeightTextbox.id).widget().getValue(),10);
                cpuQos.limit = parseInt($("#" + $scope.cpuLimitSpinner.id).widget().option("value"),10);

                memoryQos.reservation = parseInt($("#" + $scope.memoryReserveSpinner.id).widget().option("value"),10);
                memoryQos.weight = parseInt($("#" + $scope.memoryWeightTextbox.id).widget().getValue(),10);
                memoryQos.limit = memory;
                window.destroy();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "configQosCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
    }];

    var configQosModule = angular.module("resources.vm.configQos", ["ng", "ui.bootstrap"]);
    configQosModule.service("validator", validatorService);
    configQosModule.controller("resources.vm.configQos.ctrl", configQosCtrl);
    return configQosModule;
});