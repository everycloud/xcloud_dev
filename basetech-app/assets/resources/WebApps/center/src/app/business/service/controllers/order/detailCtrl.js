define(['tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/service/services/order/orderService",
    "app/business/service/services/service/createService",
    "app/services/commonService",
    "tiny-directives/FormField",
    "fixtures/serviceFixture"
], function ($, angular, _, OrderService, CreateService, commonService) {
    "use strict";

    var serviceOrder = ["$scope", "$state", "$stateParams", "exception", "$q", "camel", function ($scope, $state, $stateParams, exception, $q, camel) {
        var user = $scope.user;
        var i18n = $scope.i18n;
        var orderId = $stateParams.orderId;
        var orderService = new OrderService(exception, $q, camel);
        var createService = new CreateService(exception, $q, camel);
        var actionTypes = orderService.getActionTypes();

        $scope.backBtn = {
            id: "backBtnId",
            text: i18n.common_term_return_button || "返回",
            click: function () {
                $state.go("service.order.allApply");
            }
        };

        $scope.baseInfo = {
            title: i18n.common_term_basicInfo_label || "基本信息",
            content: {
                userName: {
                    label: (i18n.common_term_applyBy_label || "申请人") + ":"
                },
                approvalName: {
                    label: (i18n.common_term_currentProcessor_label || "当前处理人") + ":"
                },
                orderName: {
                    label: (i18n.common_term_name_label || "名称") + ":"
                },
                region: {
                    label: (i18n.common_term_section_label || "地域") + ":"
                },
                tenancy: {
                    label: (i18n.common_term_overdueTime_label || "到期时间") + ":"
                },
                provide: {
                    label: (i18n.common_term_provideTime_label || "发放时间") + ":"
                },
                comments: {
                    label: (i18n.common_term_remark_label || "备注") + ":"
                }
            }
        };
        $scope.historyInfo = {
            title: i18n.common_term_processRecord_label || "处理记录"
        };

        //vdc
        $scope.quotaInfo = {
            quotaCurrentTitle: (i18n.common_term_currentResourceQuota_label || "当前资源配额") + ":",
            quotaChangeToTitle: (i18n.service_term_changeResourceQuota_label || "变更资源配额") + ":",
            quota: {
                CPU: {
                    label: (i18n.common_term_vcpuNum_label || "vCPU个数") + ":"
                },
                MEMORY: {
                    "label": (i18n.common_term_memoryMB_label || "内存(MB)") + ":"
                },
                STORAGE: {
                    label: (i18n.common_term_storageGB_label || "存储(GB)") + ":"
                },
                VM: {
                    label: (i18n.vm_term_vmNum_label || "虚拟机个数") + ":"
                },
                EIP: {
                    label: (i18n.eip_term_eipNum_label || "弹性IP地址个数") + ":"
                },
                VPC: {
                    "label": (i18n.vpc_term_vpcNum_label || "VPC个数") + ":"
                },
                SEG: {
                    "label": (i18n.org_term_secuGroupNum_label || "安全组个数") + ":"
                }
            }
        };
        $scope.resourcesInfo = {
            resourcesTitle: i18n.common_term_resourceList_label || "资源列表"
        };
        //volume
        $scope.regionInfo = {
            regionTitle: i18n.common_term_section_label || "地域",
            region: {
                label: (i18n.common_term_section_label || "地域") + ":"
            }
        };
        $scope.capacityInfo = {
            capacityTitle: i18n.common_term_capacity_label || "容量",
            capacity: {
                label: (i18n.common_term_capacityGB_label || "容量(GB)") + ":"
            }
        };
        $scope.storageTypeInfo = {
            storageTypeTitle: i18n.common_term_storageType_label || "存储类型",
            storageType: {
                label: (i18n.common_term_storageType_label || "存储类型") + ":"
            }
        };
        $scope.storageMediaInfo = {
            storageMediaTitle: i18n.common_term_storageMedia_label || "存储介质",
            storageMedia: {
                label: (i18n.common_term_storageMedia_label || "存储介质") + ":"
            }
        };
        //vm
        $scope.vmTemplateInfo = {
            vmTemplateTitle: i18n.template_term_vm_label || "虚拟机模板",
            vmTemplate: {
                label: (i18n.template_term_vm_label || "虚拟机模板") + ":"
            }
        };
        $scope.vmTemplateInfo = {
            vmTemplateTitle: i18n.spec_term_vm_label || "虚拟机规格",
            vmTemplate: {
                label: (i18n.spec_term_vm_label || "虚拟机规格") + ":"
            }
        };

        $scope.operator = {
            getOrderDetail: function () {
                var promise = orderService.queryOrder({
                    user: user,
                    orderId: orderId
                });
                promise.then(function (resolvedValue) {
                    $scope.operator.parseData(resolvedValue);
                });
            },
            queryArea: function (areaIds) {
                var deferred = createService.queryCloudInfras(user.orgId, user.id);
                deferred.then(function (data) {
                    var SPER = "@";
                    var selectedAreaFormat = (areaIds && areaIds.length) ? (SPER + areaIds.join(SPER) + SPER) : "";
                    data = data || {cloudInfras: []};
                    var cloudInfras = data.cloudInfras;
                    var selectValues = [];
                    for (var i = 0, len = cloudInfras.length; i < len; i++) {
                        var cloudInfrasId = cloudInfras[i].id;
                        var has = selectedAreaFormat && selectedAreaFormat.indexOf(SPER + cloudInfrasId + SPER) > -1;
                        has && selectValues.push(cloudInfras[i].region || cloudInfras[i].name);
                    }
                    $scope.baseInfo.content.region.value = selectValues.join(";");
                });
            },
            stringToJson: function (string) {
                var json = null;
                if (typeof string === "string" || string instanceof String) {
                    try {
                        json = JSON.parse(string);
                    } catch (e) {
                    }
                    return json;
                }
                return string;
            },
            parseBase: function (order) {
                $scope.baseInfo.content.userName.value = order.userName;
                var tenancy = order.tenancy == "0" ? (i18n.common_term_neverExpires_label || "无限制") : (order.tenancy ? commonService.utc2Local(order.tenancy) : "");
                $scope.baseInfo.content.tenancy.value = tenancy;
                $scope.baseInfo.content.comments.value = order.comments;
                var dataParams = JSON.parse(order.params);
                $scope.baseInfo.content.orderName.value = dataParams.name;
                var orderApprovers = order.orderAproverinfos;
                if (orderApprovers && orderApprovers.length) {
                    var orderApproverNames = [];
                    for (var i = 0, len = orderApprovers.length; i < len; i++) {
                        orderApproverNames.push(orderApprovers[i].serviceApprovalUsrName);
                    }
                    $scope.baseInfo.content.approvalName.value = orderApproverNames.join(";");
                }
            },
            parseHistory: function (history) {
                var historyInfo = [];
                for (var i = 0, len = history && history.length; i < len; i++) {
                    var item = history[i];
                    var info = [];
                    var action = "";
                    info.push(item.time && commonService.utc2Local(item.time));
                    info.push(item.handleUserName);
                    info.push((i18n.common_term_processChain_label || "处理环节") + ":" + (actionTypes[item.action] || item.action));
                    item.comments && info.push((i18n.service_term_suggestion_label || "意见") + ":" + item.comments);
                    if (item.action === "failed") {
                        var exc;
                        if (item.errorCode && (exc = exception.getException(item.errorCode))) {
                            action = exc.cause;
                        } else {
                            action = item[i18n.locale + "Message"];
                        }
                        info.push((i18n.common_term_cause_label || "原因") + ":" + (action || ""));
                    }
                    historyInfo.push({info: info});
                }
                $scope.historyInfo.content = historyInfo;
            },
            parseApplyQuota: function (json) {
                var allQuota = json.allQuota;
                var area = json.area;
                var quota = json.quotaList || [];
                if (allQuota) {
                    for (var p in $scope.quotaInfo.quota) {
                        $scope.quotaInfo.quota[p].value = i18n.common_term_neverExpires_label || "无限制";
                    }
                } else {
                    for (var i = 0, len = quota.length; i < len; i++) {
                        var item = quota[i];
                        $scope.quotaInfo.quota[item.name].value = item.limit;
                    }
                }
                $scope.operator.queryArea(area);
            },
            //获取服务实例名称
            queryServiceInstancesName: function (resourceId) {
                var param = {
                    "user": user,
                    "id": resourceId
                };
                var deferred = orderService.queryServiceInstancesName(param);
                deferred.then(function (data) {
                    if (!data) {
                        return false;
                    }
                    $scope.baseInfo.content.orderName.value = data.vdcInfo.name;
                });
            },
            parseModifyQuota: function (json) {
                var allQuota = json.allQuota;
                var oldAllQuota = json.oldAllQuota;
                var quota = json.quotaList || [];
                if (oldAllQuota) {
                    for (var p in $scope.quotaInfo.quota) {
                        $scope.quotaInfo.quota[p].oldValue = i18n.common_term_neverExpires_label || "无限制";
                    }
                } else {
                    for (var i = 0, len = quota.length; i < len; i++) {
                        var item = quota[i];
                        $scope.quotaInfo.quota[item.name].oldValue = item.oldLimit;
                    }
                }
                if (allQuota) {
                    for (var p in $scope.quotaInfo.quota) {
                        $scope.quotaInfo.quota[p].value = i18n.common_term_neverExpires_label || "无限制";
                    }
                } else {
                    for (var i = 0, len = quota.length; i < len; i++) {
                        var item = quota[i];
                        $scope.quotaInfo.quota[item.name].value = item.limit;
                    }
                }
                $scope.modifyTitle = i18n.service_term_applyResourceQuotaChange_label || "配额变更申请";
            },
            parseExtendQuota: function (json) {
                var allQuota = json.allQuota;
                var quota = json.quotaList || [];
                if (json) {
                    if (allQuota) {
                        for (var p in $scope.quotaInfo.quota) {
                            $scope.quotaInfo.quota[p].value = i18n.common_term_neverExpires_label || "无限制";
                        }
                    } else {
                        for (var i = 0, len = quota.length; i < len; i++) {
                            var item = quota[i];
                            $scope.quotaInfo.quota[item.name].value = item.limit;
                        }
                    }
                }
                $scope.extendTitle = i18n.service_term_applyServiceDelay_label || "延期服务实例申请";
            },
            parseReleaseQuota: function (json) {
                var allQuota = json.allQuota;
                var quota = json.quotaList || [];
                var serviceInstance = json && json.serviceInstance || {};
                $scope.baseInfo.content.provide.value = serviceInstance.createTime && commonService.utc2Local(serviceInstance.createTime);
                var resources = serviceInstance && serviceInstance.resources;
                resources.unshift({
                    "resourceName": (i18n.common_term_resourceName_label || "资源名称") + ":",
                    "resourceId": (i18n.common_term_resourceID_label || "资源ID") + ":",
                    "resourceType": (i18n.common_term_resourceType_label || "资源类型") + ":"
                });
                $scope.resourcesInfo.resources = resources;
                $scope.releaseTitle = i18n.service_term_applyServiceDel_label || "删除服务实例申请";
            },
            parseQuota: function (data) {
                var params = data.params;
                var json = $scope.operator.stringToJson(params);
                if (json) {
                    if ($scope.applyType == "apply") {
                        $scope.operator.parseApplyQuota(json);
                    } else if ($scope.applyType == "modify") {
                        $scope.operator.parseModifyQuota(json);
                        $scope.operator.queryServiceInstancesName(json.vdcId);
                    } else if ($scope.applyType == "extend") {
                        $scope.operator.parseExtendQuota(json);
                        $scope.baseInfo.content.orderName.value = data.orderName;
                    } else if ($scope.applyType == "release") {
                        $scope.operator.parseReleaseQuota(json);
                        $scope.baseInfo.content.orderName.value = data.orderName;
                    }
                }
            },
            parseData: function (resolvedValue) {
                if (resolvedValue) {
                    $scope.applyType = resolvedValue.type;
                    $scope.imageUrl = resolvedValue.imageUrl;
                    $scope.serviceName = resolvedValue.orderName;
                    $scope.serviceDescription = resolvedValue.description;

                    $scope.operator.parseBase(resolvedValue);
                    $scope.operator.parseHistory(resolvedValue.history);
                    $scope.operator.parseQuota(resolvedValue);
                }
            }
        };
        orderId && $scope.operator.getOrderDetail();
    }];

    return serviceOrder;
});
