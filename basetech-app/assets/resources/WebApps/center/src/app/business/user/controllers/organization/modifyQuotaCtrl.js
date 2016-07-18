/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/validatorService",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/services/competitionConfig",
        "tiny-common/UnifyValid",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/userFixture"
    ],
    function ($, angular, validatorService,http, ExceptionService,Competition, UnifyValid) {
        "use strict";
        var modifyQuotaCtrl = ["$scope", "camel",
            function ($scope, camel) {
                var validator = new validatorService();
                var user = $("html").scope().user;
                $scope.i18n = $("html").scope().i18n;
                $scope.Competition = Competition;
                $scope.id = $("#modifyQuotaWindowId").widget().option("orgId");
                $scope.orgQuotaInfo ={
                    labelwidth: window.urlParams.lang === "zh" ? "90px" : "122px"
                };
                $scope.quotaNotLimit = true;
                $scope.checkRange = {
                    "cpuMax":80000,
                    "cpuMin":1,
                    "memoryMax":196608000,
                    "memoryMin":1024,
                    "storageMax":512000,
                    "storageMin":1,
                    "eipMax":4000,
                    "eipMin":1,
                    "vpcMax":20,
                    "vpcMin":1,
                    "segMax":10000,
                    "segMin":1,
                    "vmMax":10000,
                    "vmMin":1
                };

                $scope.itemsTips = {
                    "cpuTips": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.cpuMin,$scope.checkRange.cpuMax),
                    "memoryTips": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.memoryMin,$scope.checkRange.memoryMax),
                    "storageTips": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.storageMin,$scope.checkRange.storageMax),
                    "eipTips": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.eipMin,$scope.checkRange.eipMax),
                    "vpcTips": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.vpcMin,$scope.checkRange.vpcMax),
                    "segTips": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.segMin,$scope.checkRange.segMax),
                    "vmTips": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.vmMin,$scope.checkRange.vmMax)
                }
                UnifyValid.itemsCheck = function (which) {
                    var number,max,min;
                    var flag = true;
                    var isInteger = /^[0-9]*$/;
                    switch(which[0])
                    {
                        case "cpuNumberId":
                            number = $("#" + $scope.cpuNumber.id).widget().getValue();
                            max = $scope.checkRange.cpuMax;
                            min = $scope.checkRange.cpuMin;
                        break;
                        case "memoryUpperLimitId":
                            number = $("#" + $scope.memoryUpperLimit.id).widget().getValue();
                            max = $scope.checkRange.memoryMax;
                            min = $scope.checkRange.memoryMin;
                        break;
                        case "storageId":
                            number = $("#" + $scope.storage.id).widget().getValue();
                            max = $scope.checkRange.storageMax;
                            min = $scope.checkRange.storageMin;
                        break;
                        case "eipNumberId":
                            number = $("#" + $scope.eipNumber.id).widget().getValue();
                            max = $scope.checkRange.eipMax;
                            min = $scope.checkRange.eipMin;
                        break;
                        case "vpcNumberId":
                            number = $("#" + $scope.vpcNumber.id).widget().getValue();
                            max = $scope.checkRange.vpcMax;
                            min = $scope.checkRange.vpcMin;
                        break;
                        case "sgNumberId":
                            number = $("#" + $scope.sgNumber.id).widget().getValue();
                            max = $scope.checkRange.segMax;
                            min = $scope.checkRange.segMin;
                        break;
                        case "vmNumberId":
                            number = $("#" + $scope.vmNumber.id).widget().getValue();
                            max = $scope.checkRange.vmMax;
                            min = $scope.checkRange.vmMin;
                        break;
                        default :break;
                    }
                    if(!isInteger.test(number))
                    {
                        flag = false;
                        return $scope.i18n.common_term_PositiveIntegers_valid;
                    }
                    number = parseInt(number);
                    if(number<min)
                    {
                        flag = false;
                        return $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,min,max);
                    }
                    if(number>max)
                    {
                        flag = false;
                        return $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,min,max);
                    }
                    if(flag)
                    {
                        return true;
                    }
                };

                $scope.quotaLimit = {
                    "id": "quotaLimitId",
                    "label": $scope.i18n.common_term_quotaLimit_label+":",
                    "values": [{
                        "key": "notLimit",
                        "text": $scope.i18n.common_term_notLimit_value,
                        "checked": true
                    }, {
                        "key": "limit",
                        "text": $scope.i18n.common_term_limit_label,
                        "checked": false
                    }],
                    "change": function () {
                        var checked = $("#" + $scope.quotaLimit.id).widget().opChecked("checked");
                        if ("notLimit" == checked) {
                            $scope.quotaNotLimit = true;
                        } else if ("limit" == checked) {
                            $scope.quotaNotLimit = false;
                        } else {}
                    }
                };
                $scope.cpuNumber = {
                    "id": "cpuNumberId",
                    "label": $scope.i18n.common_term_vcpuNum_label+":",
                    "require": true,
                    "value": "100",
                    "extendFunction": ["itemsCheck"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+";itemsCheck(cpuNumberId)"
                };
                $scope.memoryUpperLimit = {
                    "id": "memoryUpperLimitId",
                    "label": $scope.i18n.common_term_memoryMB_label+":",
                    "require": true,
                    "value": "81920",
                    "extendFunction": ["itemsCheck"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+";itemsCheck(memoryUpperLimitId)"
                };
                $scope.storage = {
                    "id": "storageId",
                    "label": $scope.i18n.common_term_storageGB_label+":",
                    "require": true,
                    "value": "500",
                    "extendFunction": ["itemsCheck"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+";itemsCheck(storageId)"
                };
                $scope.eipNumber = {
                    "id": "eipNumberId",
                    "label": $scope.i18n.eip_term_eipNum_label+":",
                    "require": true,
                    "value": Competition.isBaseOnVmware?"50":"5",
                    "extendFunction": ["itemsCheck"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+";itemsCheck(eipNumberId)"
                };
                $scope.vpcNumber = {
                    "id": "vpcNumberId",
                    "label": $scope.i18n.vpc_term_vpcNum_label+":",
                    "require": true,
                    "value": "2",
                    "extendFunction": ["itemsCheck"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+";itemsCheck(vpcNumberId)"
                };
                $scope.sgNumber = {
                    "id": "sgNumberId",
                    "label": $scope.i18n.org_term_secuGroupNum_label+":",
                    "require": true,
                    "value": "10",
                    "extendFunction": ["itemsCheck"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+";itemsCheck(sgNumberId)"
                };
                $scope.vmNumber = {
                    "id": "vmNumberId",
                    "label": $scope.i18n.vm_term_vmNum_label+":",
                    "require": true,
                    "value": "10",
                    "extendFunction": ["itemsCheck"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+";itemsCheck(vmNumberId)"
                };

                $scope.modifyBtn = {
                    "id": "modifyQuotaBtnId",
                    "text": $scope.i18n.common_term_save_label,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#modifyQuota"));
                        if (!result) {
                            return;
                        }
                        $scope.operator.modifyQuota();
                    }
                };
                $scope.cancelBtn = {
                    "id": "modifyQuotaCancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyQuotaWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "getQuotaUsage": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}/quotas/usage",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": {},
                            "timeout": 60000,
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (!response.allQuota)
                                {
                                    $scope.quotaNotLimit = false;
                                    $("#" + $scope.quotaLimit.id).widget().opChecked("limit", true);
                                    if(response && response.quotaInfo)
                                    {
                                        var usage = response.quotaInfo || {};

                                        for (var index in usage) {
                                            var quotaName = usage[index].quotaName;
                                            switch (quotaName) {
                                                case "CPU":
                                                    $scope.cpuNumber.value = usage[index].limit;
                                                    break;
                                                case "MEMORY":
                                                    $scope.memoryUpperLimit.value = usage[index].limit;
                                                    break;
                                                case "STORAGE":
                                                    $scope.storage.value = usage[index].limit;
                                                    break;
                                                case "VPC":
                                                    $scope.vpcNumber.value = usage[index].limit;
                                                    break;
                                                case "EIP":
                                                    $scope.eipNumber.value = usage[index].limit;
                                                    break;
                                                case "SEG":
                                                    $scope.sgNumber.value = usage[index].limit;
                                                    break;
                                                case "VM":
                                                    $scope.vmNumber.value = usage[index].limit;
                                                    break;
                                                default:
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    $scope.quotaNotLimit = true;
                                    $("#" + $scope.quotaLimit.id).widget().opChecked("notLimit", true);
                                }
                                    if(response && response.quotaDistribution)
                                    {
                                        var usage = response.quotaDistribution || {};
                                        for(var index in usage)
                                        {
                                            var quotaName = usage[index].quotaName;
                                            switch (quotaName)
                                            {
                                                case "CPU":
                                                    $scope.checkRange.cpuMin = usage[index].limit>$scope.checkRange.cpuMin?usage[index].limit:$scope.checkRange.cpuMin;
                                                    $scope.itemsTips.cpuTips =  $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.cpuMin,$scope.checkRange.cpuMax);
                                                    break;
                                                case "MEMORY":
                                                    $scope.checkRange.memoryMin = usage[index].limit>$scope.checkRange.memoryMin?usage[index].limit:$scope.checkRange.memoryMin;
                                                    $scope.itemsTips.memoryTips = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.memoryMin,$scope.checkRange.memoryMax);
                                                    break;
                                                case "STORAGE":
                                                    $scope.checkRange.storageMin = usage[index].limit>$scope.checkRange.storageMin?usage[index].limit:$scope.checkRange.storageMin;
                                                    $scope.itemsTips.storageTips = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.storageMin,$scope.checkRange.storageMax);
                                                    break;
                                                case "VPC":
                                                    $scope.checkRange.vpcMin = usage[index].limit>$scope.checkRange.vpcMin?usage[index].limit:$scope.checkRange.vpcMin;
                                                    $scope.itemsTips.vpcTips = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.vpcMin,$scope.checkRange.vpcMax);
                                                    break;
                                                case "EIP":
                                                    $scope.checkRange.eipMin = usage[index].limit>$scope.checkRange.eipMin?usage[index].limit:$scope.checkRange.eipMin;
                                                    $scope.itemsTips.eipTips = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.eipMin,$scope.checkRange.eipMax);
                                                    break;
                                                case "SEG":
                                                    $scope.checkRange.segMin = usage[index].limit>$scope.checkRange.segMin?usage[index].limit:$scope.checkRange.segMin;
                                                    $scope.itemsTips.segTips = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.segMin,$scope.checkRange.segMax);
                                                    break;
                                                case "VM":
                                                    $scope.checkRange.vmMin = usage[index].limit>$scope.checkRange.vmMin?usage[index].limit:$scope.checkRange.vmMin;
                                                    $scope.itemsTips.vmTips = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,$scope.checkRange.vmMin,$scope.checkRange.vmMax);
                                                    break;
                                                default:
                                            }
                                        }
                                    }
                            });
                        });
                    },
                    "modifyQuota": function () {
                        var params = {};
                        params.allQuota = $scope.quotaNotLimit;
                        if (!$scope.quotaNotLimit) {
                            params.quotaList = $scope.operator.constructQuotaInfo();
                        }
                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": JSON.stringify(params),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $("#modifyQuotaWindowId").widget().destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "constructQuotaInfo": function () {
                        $scope.cpuNumber.value = parseInt($("#" + $scope.cpuNumber.id).widget().getValue());
                        $scope.memoryUpperLimit.value = parseInt($("#" + $scope.memoryUpperLimit.id).widget().getValue());
                        $scope.storage.value = parseInt($("#" + $scope.storage.id).widget().getValue());
                        $scope.eipNumber.value = parseInt($("#" + $scope.eipNumber.id).widget().getValue());
                        $scope.vpcNumber.value = parseInt($("#" + $scope.vpcNumber.id).widget().getValue());
                        $scope.sgNumber.value = parseInt($("#" + $scope.sgNumber.id).widget().getValue());
                        $scope.vmNumber.value = parseInt($("#" + $scope.vmNumber.id).widget().getValue());

                        var quotaInfo = [];
                        quotaInfo.push({
                            "quotaName": "CPU",
                            "limit": $scope.cpuNumber.value
                        });
                        quotaInfo.push({
                            "quotaName": "MEMORY",
                            "limit": $scope.memoryUpperLimit.value
                        });
                        quotaInfo.push({
                            "quotaName": "STORAGE",
                            "limit": $scope.storage.value
                        });
                        quotaInfo.push({
                            "quotaName": "VPC",
                            "limit": $scope.vpcNumber.value
                        });
                        quotaInfo.push({
                            "quotaName": "EIP",
                            "limit": $scope.eipNumber.value
                        });
                        quotaInfo.push({
                            "quotaName": "SEG",
                            "limit": $scope.sgNumber.value
                        });
                        quotaInfo.push({
                            "quotaName": "VM",
                            "limit": $scope.vmNumber.value
                        });
                        return quotaInfo;
                    }
                }
                $scope.operator.getQuotaUsage();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.modifyQuota", dependency);
        app.controller("userMgr.org.modifyQuota.ctrl", modifyQuotaCtrl);
        app.service("camel", http);
        return app;
    });
