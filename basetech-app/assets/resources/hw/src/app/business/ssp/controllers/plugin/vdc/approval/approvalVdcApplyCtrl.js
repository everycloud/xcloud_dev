define(["sprintf",
    "language/keyID",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/services/messageService",
    "app/services/httpService",
    "app/services/validatorService",
    "app/services/commonService",
    "tiny-common/UnifyValid",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/plugin/commonService",
    "app/services/cloudInfraService",
    "app/business/tenantUser/service/orgService"
], function (sprintf,keyIDI18n,$, angular, _, messageService, http, validatorService, timeCommonService, UnifyValid, orderService, catalogService, commonService, cloudInfraService, orgService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "$state", "camel", "exception", "$stateParams",
        function ($scope, $compile, $q, $state, camel, exception, $stateParams) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            var user = $("html").scope().user;
            //获取上个页面传来的参数，以此判定是修改，是创建还是查看详情
            var serviceId = $stateParams.serviceId;
            var orderId = $stateParams.orderId;
            $scope.from = $stateParams.from;
            var messageServiceIns = new messageService();
            var validator = new validatorService();
            var orderServiceImpl = new orderService(exception, $q, camel);
            var catalogServiceImpl = new catalogService(exception, $q, camel);
            var cloudInfraServiceImpl = new cloudInfraService($q, camel);
            var orgServiceImpl = new orgService();
            var commonServiceIns = new commonService(exception);

            // 服务详情
            $scope.detail = {};
            $scope.orderDetail = {};
            $scope.orderDetailParams = {};
            $scope.operateHistory = {};

            $scope.action = $stateParams.action;

            $scope.formsLabelWidth = 100;

            $scope.locak = 1;
            $scope.serviceDetail = {};


            $scope.areaIds = [];
            $scope.areaNames = [];

            $scope.confirmOptValue = "approve";

            $scope.applyUser = {
                "label": i18n.common_term_applyBy_label + ":",
                "width": 200,
                "id": "approvalVDCUser",
                "value": ""
            };

            $scope.currApprover = {
                "label": i18n.common_term_currentProcessor_label + ":"
            };

            $scope.submitTime = {
                "label": i18n.common_term_submitTime_label + ":",
                "width": 200,
                "id": "approvalVDCTime",
                "value": ""
            };

            $scope.name = {
                "label": i18n.common_term_name_label + ":",
                "require": true,
                "width": 200,
                "id": "approvalVDCName",
                value: ""
            };

            $scope.area = {
                "label": i18n.common_term_section_label + ":",
                "mode": "multiple",
                "require": true,
                "width": 300,
                "id": "approvalVDCArea",
                "validate": "regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_choose_label + " ;",
                values: []
            };

            $scope.cpu = {
                "label": i18n.common_term_vcpuNum_label + ":",
                "require": true,
                "id": "approvalVDCCpu",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + " ;" +
                    "maxValue(80000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + ";",
                "value": ""
            };
            $scope.memory = {
                "label": i18n.common_term_memoryMB_label + ":",
                "require": true,
                "id": "approvalVDCMemory",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + " ;" +
                    "maxValue(196608000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + " ;" +
                    "minValue(1024):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + ";",
                "value": ""
            };
            $scope.storage = {
                "label": i18n.common_term_storageGB_label + ":",
                "require": true,
                "id": "approvalVDCStorage",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + " ;" +
                    "maxValue(512000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + ";",
                "value": ""
            };
            $scope.ip = {
                "label": i18n.eip_term_eipNum_label + ":",
                "require": true,
                "id": "approvalVDCIP",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + " ;" +
                    "maxValue(200):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + ";",
                "value": ""
            };
            $scope.vpc = {
                "label": i18n.vpc_term_vpcNum_label + ":",
                "require": true,
                "id": "approvalVDCVPC",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + " ;" +
                    "maxValue(20):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + ";",
                "value": ""
            };
            $scope.group = {
                "label": i18n.org_term_secuGroupNum_label + ":",
                "require": true,
                "id": "approvalVDCGroup",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + " ;" +
                    "maxValue(1000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + ";",
                "value": ""
            };
            $scope.vm = {
                "label": i18n.vm_term_vmNum_label + ":",
                "require": true,
                "id": "approvalVDCVM",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + " ;" +
                    "maxValue(10000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + ";",
                "value": ""
            };
            $scope.time = {
                "label": i18n.common_term_overdueTime_label + ":",
                "require": true,
                "id": "approvalVDCTime",
                "type": "datetime",
                "time-format": "hh:mm:ss",
                "date-formate": "yy-mm-dd",
                "min-date": "1990-03-04",
                "max-date": "2020-05-06",
                "ampm": true,
                "first-day": 1,
                "value": ""
            };

            $scope.confirmInfo = {
                sureBtn: {
                    "id": "approval-network-selectres-sure",
                    "text": i18n.common_term_submit_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($(".approvalVDC"));
                        if (!valid) {
                            return;
                        }
                        $scope.operate.approvalOrder();
                    },
                    "disable": true
                },
                cancelBtn: {
                    "id": "approval-network-selectres-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                },
                backBtn: {
                    "id": "approval-network-selectres-back",
                    "text": i18n.common_term_return_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

            $scope.modifyBtn = {
                "id": "serviceApprovalEcsModifyBtn",
                "text": i18n.common_term_modify_button,
                "click": function () {
                    $state.go($scope.orderDetail.applyUrl, {
                        "action": "edit",
                        "orderId": $scope.orderDetail.orderId,
                        "serviceId": $scope.orderDetail.serviceOffingId
                    });
                }
            };

            $scope.doCancelBtn = {
                "id": "serviceApprovalEcsDoCancelBtn",
                "text": i18n.common_term_undo_button,
                "click": function () {
                    messageServiceIns.confirmMsgBox({
                        "content": i18n.service_service_drawBack_info_confirm_msg,
                        "callback": function () {
                            $scope.operate.actionOrder({
                                "action": "cancel"
                            });
                        }
                    });
                }
            };

            $scope.description = {
                label: i18n.common_term_remark_label + ":",
                "value": ""
            };

            $scope.confirmOpt = {
                "label": i18n.common_term_approveResult_label + "：",
                "require": "true",
                "id": "confirmOptSelect",
                "spacing": {
                    "width": "50px",
                    "height": "30px"
                },
                "values": orderServiceImpl.approvalOptions,
                "layout": "horizon",
                "change": function () {
                    $scope.confirmOptValue = $("#" + $scope.confirmOpt.id).widget().opChecked("checked");
                    if ($scope.confirmOptValue === "approve" && $scope.selectedAz.azList.length === 0) {
                        $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", true);
                    } else {
                        $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                    }
                }
            };

            $scope.confirmDesc = {
                "label": i18n.common_term_approveAdvice_label + ":",
                "id": "confirmDesc",
                "type": "multi",
                "width": "644",
                "height": "60",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024),
                "value": ""
            };

            // AZ页面
            $scope.selectAllAZ = true;
            $scope.azSelectModel = {
                "azSelectLabel": i18n.org_term_chooseAZ_label + ":",
                "canSelectAzLabel": i18n.common_term_waitChoose_value,
                "azSelectedLabel": i18n.common_term_choosed_value,
                "noAzTips": i18n.org_vdc_add_info_noAZ_label
            };
            $scope.leftAzSearchBox = {
                "id": "leftAzSearchBoxId",
                "placeholder": "",
                "width": "150px",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {},
                "search": function (searchString) {
                    $scope.operate.initCanSelectAZ(searchString);
                }
            };

            $scope.canSelectAz = {
                "height": "28px",
                azList: []
            };
            $scope.selectedAz = {
                "height": "28px",
                width: "100px",
                azList: []
            };

            $scope.selectAzLeftBtn = {
                "click": function () {
                    var azList = $scope.canSelectAz.azList;
                    var len = azList.length;
                    for (var index = len - 1; index >= 0; index--) {
                        if ($("#" + azList[index].id).widget().option("checked")) {
                            if (!orgServiceImpl.isExist(azList[index], $scope.selectedAz.azList)) {
                                $scope.selectedAz.azList.push(azList[index]);
                            }
                            azList.splice(index, 1);
                        }
                    }
                    if ($scope.selectedAz.azList.length > 0) {
                        $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                    }
                }
            };
            $scope.selectAzRightBtn = {
                "click": function () {
                    var azList = $scope.selectedAz.azList;
                    var len = azList.length;
                    for (var index = len - 1; index >= 0; index--) {
                        if ($("#" + azList[index].id).widget().option("checked")) {
                            if (!orgServiceImpl.isExist(azList[index], $scope.canSelectAz.azList)) {
                                $scope.canSelectAz.azList.push(azList[index]);
                            }
                            azList.splice(index, 1);
                        }
                    }
                    if ($scope.selectedAz.azList.length === 0) {
                        $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", true);
                    }
                }
            };


            $scope.clickAreaHeading = function (id) {
                var head = $("#" + id + " .s-heading");
                var content = $("#" + id + " .s-content");

                if (head.hasClass("collapse")) {
                    var valid = UnifyValid.FormValid($("#" + id));
                    if (!valid) {
                        return;
                    }

                    head.removeClass("collapse");
                    head.addClass("expand");
                    content.css("display", "none");
                } else {
                    head.removeClass("expand");
                    head.addClass("collapse");
                    content.css("display", "block");
                }
            };

            $scope.initParam = function () {
                var params = {};
                if ($scope.lock === "2") {
                    var cpuNum = $("#approvalVDCCpu").widget().getValue();
                    var memoryNum = $("#approvalVDCMemory").widget().getValue();
                    var storageNum = $("#approvalVDCStorage").widget().getValue();
                    var ipNum = $("#approvalVDCIP").widget().getValue();
                    var vpcNum = $("#approvalVDCVPC").widget().getValue();
                    var groupNum = $("#approvalVDCGroup").widget().getValue();
                    var vmNum = $("#approvalVDCVM").widget().getValue();

                    var area = $scope.orderDetailParams.area;
                    var name = $scope.orderDetailParams.name;
                    params = {
                        "name": name,
                        "allQuota": false,
                        "area": area,
                        "quotaList": [{
                            "name": "CPU",
                            "limit": cpuNum
                        }, {
                            "name": "MEMORY",
                            "limit": memoryNum
                        }, {
                            "name": "STORAGE",
                            "limit": storageNum
                        }, {
                            "name": "VPC",
                            "limit": vpcNum
                        }, {
                            "name": "EIP",
                            "limit": ipNum
                        }, {
                            "name": "SEG",
                            "limit": groupNum
                        }, {
                            "name": "VM",
                            "limit": vmNum
                        }],
                        "azBaseInfos": []
                    };
                } else {
                    params = $scope.orderDetailParams;
                }

                _.each($scope.selectedAz.azList, function (item) {
                    params.azBaseInfos.push({
                        "azId": item.id,
                        "cloudInfraId": item.cloudInfraId
                    });
                });

                var comments = $("#" + $scope.confirmDesc.id).widget().getValue();

                var options = {
                    "user": user,
                    "id": orderId,
                    "params": {
                        "action": $scope.confirmOptValue,
                        "params": JSON.stringify(params),
                        "comments": comments
                    }
                };

                return options;
            };

            $scope.dealQueryOrderResponse = function (data) {
                $scope.serviceDetail = JSON.parse(data.definationParams);
                $scope.lock = $scope.serviceDetail.CPU.lock;

                var params = JSON.parse(data.params);
                $scope.orderDetail = data;
                $scope.orderDetailParams = params;
                var quotas = params.quotaList;
                $scope.cpu.value = quotas[0].limit;
                $scope.memory.value = quotas[1].limit;
                $scope.storage.value = quotas[2].limit;
                $scope.vpc.value = quotas[3].limit;
                $scope.ip.value = quotas[4].limit;
                $scope.group.value = quotas[5].limit;
                $scope.vm.value = quotas[6].limit;
                $scope.time.value = data.tenancy === "0" ? i18n.common_term_neverExpires_label : timeCommonService.utc2Local(data.tenancy);
                $scope.description.value = data.comments;
                $scope.name.value = params.name;
                $scope.applyUser.value = data.userName;
                $scope.submitTime.value = timeCommonService.utc2Local(data.submitTime);

                var area = params.area;
                _.each(area, function (item) {
                    $scope.areaIds.push(item);
                    $scope.operate.queryLocation(item);
                });

                // 处理订单信息
                commonServiceIns.processOrderDetail(data);
                $scope.operateHistory = data.history;

                if ($scope.action === "approval") {
                    $scope.operate.initCanSelectAZ();
                }
            };

            $scope.operate = {
                //审批订单
                "approvalOrder": function () {
                    var param = $scope.initParam();
                    var deferred = orderServiceImpl.adminActionOrder(param);
                    deferred.then(function (data) {
                        //创建成功跳转至服务页面
                        $state.go("ssp.order.approval");
                    });
                },
                "queryOrder": function () {
                    var param = {
                        "user": user,
                        "orderId": orderId
                    };
                    var deferred = orderServiceImpl.queryOrder(param);
                    deferred.then(function (data) {
                        if (!data || !data.orderId) {
                            return false;
                        }
                        $scope.dealQueryOrderResponse(data);
                    });
                },
                "initCanSelectAZ": function (azName) {
                    var azList = [];
                    _.each($scope.areaIds, function (areaId) {
                        var deferred = cloudInfraServiceImpl.queryAzs(user.vdcId, user.id, areaId, azName);
                        deferred.then(function (data) {
                            if (!data || !data.availableZones) {
                                return;
                            }
                            var azListRes = data.availableZones;

                            _.each(azListRes, function (item) {
                                if (!orgServiceImpl.isExist(item, $scope.selectedAz.azList)) {
                                    azList.push({
                                        "id": item.id,
                                        "name": item.name,
                                        "desc": item.description || "",
                                        "cloudInfraId": areaId
                                    });
                                }
                            });
                            $scope.canSelectAz.azList = orgServiceImpl.constructAZList(azList, "left");
                        });
                    });
                },
                "queryLocation": function (id) {
                    var retDefer = $.Deferred();
                    var deferred = cloudInfraServiceImpl.queryCloudInfra(user.vdcId, user.id, id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfra) {
                            $scope.areaNames.push(data.cloudInfra.region);
                            $scope.area.value = $scope.areaNames.join(",");
                        }
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },
                "actionOrder": function (param) {
                    var options = {
                        "id": orderId,
                        "user": user,
                        "params": param
                    };
                    var deferred = orderServiceImpl.userActionOrder(options);
                    deferred.then(function (data) {
                        $state.go("ssp.order.apply");
                    });
                }
            };

            //初始化页面信息
            function init() {
                $scope.operate.queryOrder();
            }
            init();
        }
    ];
    return ctrl;
});
