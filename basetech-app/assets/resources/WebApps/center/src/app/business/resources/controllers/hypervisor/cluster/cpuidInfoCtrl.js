/*global define*/
define(['jquery',
    'tiny-lib/angular'
], function ($, angular) {
        "use strict";

        var cpuidInfoCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#cpuidInfoWindow").widget();
            $scope.imcSetting = window.option("imcSetting");
			var i18n = $scope.i18n || {};

            $scope.label = {
                "imc": (i18n.virtual_cluster_advanSet_para_currentIMC_label||"当前IMC模式")+":",
                "tags": (i18n.virtual_cluster_advanSet_para_currentCPUIDtag_label||"该集群的当前 CPUID 特征标志显示如下")+":",
                "register": i18n.device_term_register_label||"寄存器",
                "value": i18n.common_term_value_label||"值",
                "leaf1": i18n.virtual_cluster_advanSet_info_CPUID_content_leaf1_label||"叶 1",
                "leaf80000001": i18n.virtual_cluster_advanSet_info_CPUID_content_leaf80000001_label||"叶 80000001",
                "leafd": i18n.virtual_cluster_advanSet_info_CPUID_content_leafd_label||"叶 d",
                "eax": "eax",
                "ebx": "ebx",
                "ecx": "ecx",
                "edx": "edx"
            };
            var leaf1Eax = {
                "Merom": "0000:0000:0000:0010:0000:0110:1101:0111",
                "Penryn": "0000:0000:0000:0010:0000:0110:1101:0111",
                "Nehalem": "0000:0000:0000:0010:0000:0110:1101:0111",
                "Westmere": "0000:0000:0000:0010:0000:0110:1101:0111",
                "Sandy Bridge": "0000:0000:0000:0010:0000:0110:1101:0111",
                "Ivy Bridge": "0000:0000:0000:0010:0000:0110:1101:0111"
            };
            var leaf1Ecx = {
                "Merom": "1000:0001:0010:0000:0010:0010:0000:0001",
                "Penryn": "1000:0001:0010:1000:0010:0010:0000:0001",
                "Nehalem": "1000:0001:1011:1000:0010:0010:0000:0001",
                "Westmere": "1000:0011:1011:1010:0010:0010:0000:0011",
                "Sandy Bridge": "1001:1111:1011:1010:0010:0010:0000:0011",
                "Ivy Bridge": "1111:1111:1011:1010:0010:0010:0000:0011"
            };
            var leaf1Edx = {
                "Merom": "0001:0111:1000:1011:1111:1011:1111:1111",
                "Penryn": "0001:0111:1000:1011:1111:1011:1111:1111",
                "Nehalem": "0001:0111:1000:1011:1111:1011:1111:1111",
                "Westmere": "0001:0111:1000:1011:1111:1011:1111:1111",
                "Sandy Bridge": "0001:0111:1000:1011:1111:1011:1111:1111",
                "Ivy Bridge": "0001:0111:1000:1011:1111:1011:1111:1111"
            };
            var leaf80000001Edx = {
                "Merom": "0010:0000:0001:0000:0000:1000:0000:0000",
                "Penryn": "0010:0000:0001:0000:0000:1000:0000:0000",
                "Nehalem": "0010:1000:0001:0000:0000:1000:0000:0000",
                "Westmere": "0010:1000:0001:0000:0000:1000:0000:0000",
                "Sandy Bridge": "0010:1000:0001:0000:0000:1000:0000:0000",
                "Ivy Bridge": "0010:1000:0001:0000:0000:1000:0000:0000"
            };
            var leafdEax = {
                "Merom": "0000:0000:0000:0000:0000:0000:0000:0000",
                "Penryn": "0000:0000:0000:0000:0000:0000:0000:0000",
                "Nehalem": "0000:0000:0000:0000:0000:0000:0000:0000",
                "Westmere": "0000:0000:0000:0000:0000:0000:0000:0000",
                "Sandy Bridge": "0000:0000:0000:0000:0000:0000:0000:0001",
                "Ivy Bridge": "0000:0000:0000:0000:0000:0000:0000:0001"
            };
            $scope.leaf1Eax = leaf1Eax[$scope.imcSetting];
            $scope.leaf1Ecx = leaf1Ecx[$scope.imcSetting];
            $scope.leaf1Edx = leaf1Edx[$scope.imcSetting];
            $scope.leaf80000001Edx = leaf80000001Edx[$scope.imcSetting];
            $scope.leafdEax = leafdEax[$scope.imcSetting];
            $scope.leaf80000001Ecx = "0000:0000:0000:0000:0000:0000:0000:0001";
            $scope.leafdEcx = "0000:0000:0000:0000:0000:0000:0000:0000";
            $scope.leafdEdx = "0000:0000:0000:0000:0000:0000:0000:0000";
        }];

        var cpuidInfoApp = angular.module("cpuidInfoApp", ['framework']);
        cpuidInfoApp.controller("resources.clusterInfo.cpuidInfo.ctrl", cpuidInfoCtrl);
        return cpuidInfoApp;
    }
);
