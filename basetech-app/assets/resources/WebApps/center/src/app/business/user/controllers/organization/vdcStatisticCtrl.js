/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/exceptionService",
    "app/services/commonService",
    "app/services/httpService",
    "app/services/competitionConfig",
    "tiny-widgets/Window",
    'tiny-widgets/Message',
    "tiny-widgets/Columnchart",
    "tiny-directives/Table",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/Select",
    "tiny-directives/Searchbox",
    "bootstrap/bootstrap.min",
    "fixtures/userFixture"
],
    function ($, angular, ExceptionService, commonService, http,Competition, Window, Message, Columnchart) {
        "use strict";
        var orgCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var $rootScope = $("html").scope();
            var user = $rootScope.user;
            var i18n = $scope.i18n = $rootScope.i18n;
            $scope.isAllRefresh = true;
            //组织操作权限
            var ORG_OPERATE = "108000";

            $scope.openstack = user.cloudType === "OPENSTACK";

            var statisticsTypeValues = [
                {
                    "selectId": "CPU",
                    "label": $scope.i18n.common_term_cpu_label || "CPU",
                    "checked": true
                },
                {
                    "selectId": "MEMORY",
                    "label": $scope.i18n.common_term_memory_label || "内存"
                },
                {
                    "selectId": "STORAGE",
                    "label": $scope.i18n.common_term_storage_label || "存储"
                },
                {
                    "selectId": "VPC",
                    "label": $scope.i18n.vpc_term_vpc_label || "VPC"
                },
                {
                    "selectId": "VM",
                    "label": $scope.i18n.common_term_vm_label || "虚拟机"
                }
            ];

            if (!Competition.isBaseOnVmware){
                statisticsTypeValues.push(
                    {
                        "selectId": "EIP",
                        "label": $scope.i18n.eip_term_eip_label || "EIP"
                    });
                statisticsTypeValues.push(
                    {
                        "selectId": "SEG",
                        "label": $scope.i18n.security_term_SG_label || "安全组"
                    });
            }
            //对象类型下拉框
            $scope.statisticsTypeSelect = {
                "id": "statisticsTypeSelectId",
                "width": "150px",
                "values": statisticsTypeValues,
                "change": function () {
                    $scope.isAllRefresh = false;
                    $scope.statisticsType = $("#statisticsTypeSelectId").widget().getSelectedId();
                    $scope.operator.getVDCStatistics($scope.statisticsType);
                }
            };

            function getCharObject(chartId, series) {
                try {
                    $("#" + chartId).find("div").remove();
                    var obj = {};
                    var cc = new Columnchart({
                        id: chartId,
                        width: "700px",
                        textWidth:"108px",
                        maxNameLength:100,
                        isFill: true,
                        style: "bold",
                        values: series
                    });
                    obj.chart = cc;
                    obj.id = chartId;
                    $scope.charCollection.push(obj);
                } catch (e) {
                }
            }

            $scope.operator = {
                "getVDCStatistics": function (statisticsType) {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/capacity-statistics/top-vdcs?type=" + statisticsType,
                        "params": {},
                        "timeout": 300000,
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            if (!response) {
                                return;
                            }

                            var quotaUtilizationInfo = response.quotaUtilizationInfo;
                            if (quotaUtilizationInfo) {
                                var quotaArr = [];
                                var series = {};
                                for (var i = 0; i < quotaUtilizationInfo.length; i++) {
                                    var quotaInfo = quotaUtilizationInfo[i];
                                    var ar = {
                                        textValue: ($.encoder.encodeForHTML(quotaInfo.utilizationValue || 0)) + "%",
                                        name: $.encoder.encodeForHTML(quotaInfo.vdcName),
                                        value: parseInt(quotaInfo.utilizationValue || 0),
                                        initValue: 0,
                                        maxValue: 100,
                                        color: "#1FBE5C"
                                    };
                                    quotaArr.push(ar);
                                    series = {
                                        series: quotaArr
                                    };
                                }
                                getCharObject("quotaUtilizationInfoChart", series);
                            }

                            if($scope.isAllRefresh)
                            {
                                var resourceUtilizationInfo = response.resourceUtilizationInfo;
                                if (resourceUtilizationInfo) {
                                    var resourceArr = [];
                                    var series = {};
                                    for (var j = 0; j < resourceUtilizationInfo.length; j++) {
                                        var resourceInfo = resourceUtilizationInfo[j];
                                        var arr = {
                                            textValue: ($.encoder.encodeForHTML(resourceInfo.utilizationValue || 0)) + "%",
                                            name: resourceInfo.vdcName,
                                            value: parseInt(resourceInfo.utilizationValue || 0),
                                            initValue: 0,
                                            maxValue: 100,
                                            color: "#1FBE5C"
                                        };
                                        resourceArr.push(arr);
                                        series = {
                                            series: resourceArr
                                        };
                                    }
                                    getCharObject("resourceUtilizationInfoChart", series);
                                }
                            }
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(response);
                        });
                    });
                }
            };
            $scope.operator.getVDCStatistics("CPU");
        }
        ];

        var dependency = ["ng", "wcc"];
        var orgModule = angular.module("vdcMgr.vdc.vdcStatisticList", dependency);
        orgModule.controller("vdcMgr.vdc.vdcStatisticList.ctrl", orgCtrl);
        orgModule.service("camel", http);
        return orgModule;
    });
