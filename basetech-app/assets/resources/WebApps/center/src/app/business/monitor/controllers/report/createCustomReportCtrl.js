define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/httpService",
        "tiny-common/UnifyValid",
        "app/services/validatorService",
        "app/services/exceptionService",
        "app/services/messageService",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/Checkbox",
        "tiny-directives/Select",
        "tiny-directives/DateTime",
        "fixtures/userFixture"
    ],
    function ($, angular, http, UnifyValid, ValidatorService, ExceptionService, MessageService) {
        "use strict";
        var createCustomReportCtrl = ["$scope", "$compile", "camel",'validator',
            function ($scope, $compile, camel, validator) {
                var user = $("html").scope().user;
                $scope.openstack = user.cloudType === "OPENSTACK";
                var reportId = $("#createCustomReportWindowId").widget().option("reportId");
                var createType = $("#createCustomReportWindowId").widget().option("createType");
                var objType = $("#createCustomReportWindowId").widget().option("objType");
                var reportConfig = $("#createCustomReportWindowId").widget().option("reportConfig");
                var hasOperateRight = user.privilege.role_role_add_option_reportHandle_value;
                var i18n = $scope.i18n || {};
                var zoneMetrics = [
                    [{
                        "key": "cpu",
                        "text": i18n.perform_term_CPUstatistic_label || "CPU统计",
                        "checked": false
                    }, {
                        "key": "memory",
                        "text": i18n.perform_term_memStatistic_label || "内存统计",
                        "checked": false
                    }, {
                        "key": "storage",
                        "text": i18n.common_term_storageStatistic_label || "存储统计",
                        "checked": false
                    }],
                    [{
                        "key": "vlan",
                        "text": i18n.perform_term_vlanStatus_label || "VLAN使用情况",
                        "checked": false
                    }, {
                        "key": "public_ip",
                        "text": i18n.perform_term_publicIPusage_label || "公网IP使用情况",
                        "checked": false
                    }, {
                        "key": "firewall",
                        "text": i18n.perform_term_vFWusageStatus_label || "虚拟防火墙使用情况",
                        "checked": false
                    }, {
                        "key": "vsa_ip",
                        "text": i18n.perform_term_vsaNetIPusage_label || "VSA管理网络IP使用情况",
                        "checked": false
                    }]
                ];
                var clusterMetrics = [
                    [{
                        "key": "cpu",
                        "text": i18n.perform_term_CPUstatistic_label || "CPU统计",
                        "checked": false
                    }, {
                        "key": "memory",
                        "text": i18n.perform_term_memStatistic_label || "内存统计",
                        "checked": false
                    }, {
                        "key": "storage",
                        "text": i18n.common_term_storageStatistic_label || "存储统计",
                        "checked": false
                    }]
                ];

                var objTypeValues = [{
                    "selectId": "zone",
                    "label": i18n.resource_term_zone_label || "资源分区",
                    "checked": true
                }, {
                    "selectId": "cluster",
                    "label": i18n.virtual_term_cluster_label || "资源集群",
                    "checked": false
                }];

                if(createType === "modify" && objType === "cluster"){
                    objTypeValues = [{
                        "selectId": "zone",
                        "label": i18n.resource_term_zone_label || "资源分区",
                        "checked": false
                    }, {
                        "selectId": "cluster",
                        "label": i18n.virtual_term_cluster_label || "资源集群",
                        "checked": true
                    }];
                }

                $scope.name = {
                    "id": "createCustomReportNameId",
                    "label": (i18n.common_term_name_label || "名称") + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.common_term_composition1_valid + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:20}),
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(20):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:20}) + ";regularCheck(" + validator.userNameRe + "):" +
                        $scope.i18n.common_term_composition1_valid
                };
                $scope.objType = {
                    "id": "createCustomReportObjTypeId",
                    "label": (i18n.common_term_object_label || "对象类型") + ":",
                    "require": true,
                    "width": "150px",
                    "values": objTypeValues,
                    "change": function () {
                        var type = $("#" + $scope.objType.id).widget().getSelectedId();
                        if (type === "zone") {
                            $scope.metrics.values = zoneMetrics;
                        } else {
                            $scope.metrics.values = clusterMetrics;
                        }
                    }
                };

                $scope.metrics = {
                    "id": "createCustomReportMetricsId",
                    "label": (i18n.common_term_statisticItem_label || "统计指标") + ":",
                    "require": true,
                    "layout": "vertical",
                    "allSelect": {
                        "key": "selectAll",
                        "text": i18n.common_term_allChoose_button || "全选",
                        "checked": false
                    },
                    "values": objType === "cluster" ? clusterMetrics : zoneMetrics,
                    "change": function () {

                    }
                };

                $scope.saveBtn = {
                    "id": "createCustomReportSaveBtnId",
                    "text": createType === "modify" ? (i18n.common_term_modify_button || "修改") : (i18n.common_term_save_label || "保存"),
                    "disable": false,
                    "display": hasOperateRight,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#createCustomReport"));
                        if (!result) {
                            return;
                        }

                        $scope.operator.createCustomReport();
                    }
                };

                $scope.cancelBtn = {
                    "id": "createCustomReportCancelBtnId",
                    "text": i18n.common_term_cancle_button || "取消",
                    "disable": false,
                    "click": function () {
                        $("#createCustomReportWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "createCustomReport": function () {
                        var config = {};
                        config.reportName = $("#" + $scope.name.id).widget().getValue();
                        config.reportType = "resource";
                        config.objType = $("#" + $scope.objType.id).widget().getSelectedId();
                        config.metrics = $("#" + $scope.metrics.id).widget().opChecked("checked");

                        if (!config.metrics || config.metrics.length === 0) {
                            new MessageService().promptErrorMsgBox(i18n.report_report_add_info_chooseItem_msg || "请至少选择一个指标");
                            return;
                        }

                        var deferred;
                        if(createType === "modify"){
                            deferred = camel.put({
                                "url": {
                                    "s": "/goku/rest/v1.5/irm/reports/custom-reports/{id}",
                                    "o": {
                                        "id": reportId
                                    }
                                },
                                "params": JSON.stringify({
                                    "customReportConfig": config
                                }),
                                "userId": user.id
                            });
                        }
                        else{
                            deferred = camel.post({
                                "url": "/goku/rest/v1.5/irm/reports/custom-reports",
                                "params": JSON.stringify({
                                    "customReportConfig": config
                                }),
                                "userId": user.id
                            });
                        }

                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $("#createCustomReportWindowId").widget().destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response, $("#createCustomReportWindowId").widget());
                            });
                        });
                    },
                    "initReportConfig": function () {
                        if (reportConfig) {
                            $("#" + $scope.name.id).widget().option("value", reportConfig.reportName);
                            $("#" + $scope.objType.id).widget().opChecked(reportConfig.objType);

                            var metrics = reportConfig.metrics;
                            if (!metrics) {
                                return;
                            }
                            for (var index in metrics) {
                                $("#" + $scope.metrics.id).widget().opChecked(metrics[index],true);
                            }
                        }
                    },
                    "init": function(){
                        if(createType === "modify"){
                            $scope.operator.initReportConfig();
                        }
                    }
                };

                setTimeout(function () {
                    $scope.operator.init();
                }, 100);
            }
        ];

        var dependency = ['ng', "wcc"];
        var module = angular.module("report.createCustomReport", dependency);
        module.controller("report.createCustomReport.ctrl", createCustomReportCtrl);
        module.service("camel", http);
        module.service("validator", ValidatorService);
        return module;
    });
