define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/httpService",
        "tiny-common/UnifyValid",
        "app/services/exceptionService",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/Checkbox",
        "tiny-directives/Select",
        "tiny-directives/DateTime",
        "fixtures/userFixture"
    ],
    function ($, angular, http, UnifyValid, ExceptionService) {
        "use strict";
        var reportConfigCtrl = ["$scope", "$compile", "camel",
            function ($scope, $compile, camel) {
                var user = $("html").scope().user;
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.reportConfig = $("#customReportConfigWindowId").widget().option("reportConfig");

                var i18n = $scope.i18n || {};
                var metricsMap = {
                    "cpu": i18n.perform_term_CPUstatistic_label || "CPU统计",
                    "memory": i18n.perform_term_memStatistic_label || "内存统计",
                    "storage": i18n.common_term_storageStatistic_label || "存储统计",
                    "vlan": i18n.perform_term_vlanStatus_label || "VLAN使用情况",
                    "public_ip": i18n.perform_term_publicIPusage_label || "公网IP使用情况",
                    "firewall": i18n.perform_term_vFWusageStatus_label || "虚拟防火墙使用情况",
                    "vsa_ip": i18n.perform_term_vsaNetIPusage_label || "VSA管理网络IP使用情况"
                };
                $scope.metrics = {
                    "label": i18n.common_term_statisticItem_label || "统计指标:",
                    "values": ""
                };

                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": i18n.common_term_shut_button || "关闭",
                    "disable": false,
                    "click": function () {
                        $("#customReportConfigWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "initReportConfig": function () {
                        if ($scope.reportConfig) {
                            var metrics = $scope.reportConfig.metrics;
                            if (!metrics) {
                                return;
                            }

                            var metricsList = [];
                            for (var index in metrics) {
                                metricsList.push(metricsMap[metrics[index]] || metrics[index]);
                            }
                            $scope.metrics.values = metricsList;
                        }
                    }
                };
                $scope.operator.initReportConfig();
            }
        ];

        var dependency = ['ng', "wcc"];
        var reportConfigModule = angular.module("report.customReportConfig", dependency);
        reportConfigModule.controller("report.customReportConfig.ctrl", reportConfigCtrl);
        reportConfigModule.service("camel", http);
        return reportConfigModule;
    });
