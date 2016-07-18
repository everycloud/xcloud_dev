/* global define */
define(["sprintf",
    "language/keyID",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'app/services/messageService',
    "app/services/tipMessageService",
    "app/services/httpService",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/plugin/vdc/vdcService",
    "app/business/ssp/services/catalog/catalogService",
    "app/services/cloudInfraService"
], function (sprintf,keyIDI18n,$, angular, _, messageService,tipMessageService, http, validatorService, UnifyValid, orderService, vdcService, catalogService, cloudInfraService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "$state", "camel", "exception", "$stateParams",
        function ($scope, $compile, $q, $state, camel, exception, $stateParams) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            var user = $("html").scope().user;

            //获取上个页面传来的参数，以此判定是修改，是创建还是查看详情
            var resourceId = $stateParams.resourceId;
            var instanceId = $stateParams.instanceId;
            var orderId = $stateParams.orderId;
            var messageServiceIns = new messageService();
            var validator = new validatorService();
            var orderServiceImpl = new orderService(exception, $q, camel);
            var vdcServiceImpl = new vdcService(exception, $q, camel);
            var catalogServiceImpl = new catalogService(exception, $q, camel);
            var cloudInfraServiceImpl = new cloudInfraService($q, camel);
            var tipMessage = new tipMessageService();

            // 服务详情
            $scope.action = $stateParams.action;

            $scope.formsLabelWidth = 100;

            $scope.old = {
                cpu : "",
                memory : "",
                storage : "",
                vpc : "",
                ip : "",
                group : "",
                vm : ""
            };

            $scope.vdcName = {
                "label": i18n.common_term_name_label + ":",
                "value": "23"
            };

            $scope.vdcId = {
                "label": i18n.org_term_VDCid_label + ":",
                "value": "123"
            };

            $scope.cpu = {
                "label": i18n.common_term_vcpuNum_label + ":",
                "require": true,
                "width": 200,
                "id": "changeVDCCpu",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + " ;" +
                    "maxValue(80000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + ";",
                "value": ""
            };
            $scope.memory = {
                "label": i18n.common_term_memoryMB_label + ":",
                "require": true,
                "width": 200,
                "id": "changeVDCMemory",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + " ;" +
                    "maxValue(196608000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + " ;" +
                    "minValue(1024):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + ";",
                "value": ""
            };
            $scope.storage = {
                "label": i18n.common_term_storageGB_label + ":",
                "require": true,
                "width": 200,
                "id": "changeVDCStorage",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + " ;" +
                    "maxValue(512000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + ";",
                "value": ""
            };
            $scope.ip = {
                "label": i18n.eip_term_eipNum_label + ":",
                "require": true,
                "width": 200,
                "id": "changeVDCIP",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + " ;" +
                    "maxValue(200):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + ";",
                "value": ""
            };
            $scope.vpc = {
                "label": i18n.vpc_term_vpcNum_label + ":",
                "require": true,
                "width": 200,
                "id": "changeVDCVPC",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + " ;" +
                    "maxValue(20):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + ";",
                "value": ""
            };
            $scope.group = {
                "label": i18n.org_term_secuGroupNum_label + ":",
                "require": true,
                "width": 200,
                "id": "changeVDCGroup",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + " ;" +
                    "maxValue(1000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + ";",
                "value": ""
            };
            $scope.vm = {
                "label": i18n.vm_term_vmNum_label + ":",
                "require": true,
                "width": 200,
                "id": "changeVDCVM",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + " ;" +
                    "maxValue(10000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + ";",
                "value": ""
            };

            $scope.confirmInfo = {
                sureBtn: {
                    "id": "change-vdc-sure",
                    "text": i18n.common_term_submit_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($(".applyVDC"));
                        if (!valid) {
                            return;
                        }
                        if ($scope.action === "edit") {
                            $scope.operate.editOrder();
                        } else {
                            $scope.operate.createOrder();
                        }
                    }
                },
                cancelBtn: {
                    "id": "change-vdc-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

            $scope.description = {
                label: i18n.common_term_remark_label + ":",
                "id": "change-vdc-description",
                "type": "multi",
                "width": "644",
                "height": "60",
                "value": ""
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
                var cpuNum = $("#changeVDCCpu").widget().getValue();
                var memoryNum = $("#changeVDCMemory").widget().getValue();
                var storageNum = $("#changeVDCStorage").widget().getValue();
                var ipNum = $("#changeVDCIP").widget().getValue();
                var vpcNum = $("#changeVDCVPC").widget().getValue();
                var groupNum = $("#changeVDCGroup").widget().getValue();
                var vmNum = $("#changeVDCVM").widget().getValue();
                var comments = $("#" + $scope.description.id).widget().getValue();
                var paramsJson = {
                    "vdcId": resourceId,
                    "allQuota": false,
                    "quotaList": [{
                        "name": "CPU",
                        "limit": cpuNum,
                        "oldLimit" : $scope.old.cpu
                    }, {
                        "name": "MEMORY",
                        "limit": memoryNum,
                        "oldLimit" : $scope.old.memory
                    }, {
                        "name": "STORAGE",
                        "limit": storageNum,
                        "oldLimit" : $scope.old.storage
                    }, {
                        "name": "VPC",
                        "limit": vpcNum,
                        "oldLimit" : $scope.old.vpc
                    }, {
                        "name": "EIP",
                        "limit": ipNum,
                        "oldLimit" : $scope.old.ip
                    }, {
                        "name": "SEG",
                        "limit": groupNum,
                        "oldLimit" : $scope.old.group
                    }, {
                        "name": "VM",
                        "limit": vmNum,
                        "oldLimit" : $scope.old.vm
                    }]
                };
                var param = {};

                if ($scope.action === "edit") {
                    param = {
                        "user": user,
                        "id": orderId,
                        "params": {
                            "params": JSON.stringify(paramsJson),
                            "comments": comments
                        }
                    };
                } else {
                    param = {
                        "user": user,
                        "params": {
                            "modify": {
                                "resourceId": $stateParams.id,
                                "params": JSON.stringify(paramsJson)
                            },
                            "comments": comments
                        }
                    };
                }
                return param;
            };

            $scope.dealQuerySpecResponse = function (data) {
                var quotaInfo = data.vdcInfo.quotaInfo;
                $scope.vdcName.value = data.vdcInfo.name;
                $scope.vdcId.value = data.vdcInfo.id;
                if ($scope.action === "apply") {
                    $scope.cpu.value = getSpecQuota(quotaInfo, "CPU", "limit", 0);
                    $scope.memory.value = Math.floor(getSpecQuota(quotaInfo, "MEMORY", "limit", 0));
                    $scope.storage.value = getSpecQuota(quotaInfo, "STORAGE", "limit", 0);
                    $scope.vpc.value = getSpecQuota(quotaInfo, "VPC", "limit", 0);
                    $scope.ip.value = getSpecQuota(quotaInfo, "EIP", "limit", 0);
                    $scope.group.value = getSpecQuota(quotaInfo, "SEG", "limit", 0);
                    $scope.vm.value = getSpecQuota(quotaInfo, "VM", "limit", 0);
                }

                $scope.old.cpu = getSpecQuota(quotaInfo, "CPU", "limit", 0);
                $scope.old.memory = Math.floor(getSpecQuota(quotaInfo, "MEMORY", "limit", 0));
                $scope.old.storage = getSpecQuota(quotaInfo, "STORAGE", "limit", 0);
                $scope.old.vpc = getSpecQuota(quotaInfo, "VPC", "limit", 0);
                $scope.old.ip = getSpecQuota(quotaInfo, "EIP", "limit", 0);
                $scope.old.group = getSpecQuota(quotaInfo, "SEG", "limit", 0);
                $scope.old.vm = getSpecQuota(quotaInfo, "VM", "limit", 0);
            };

            $scope.dealQueryOrderResponse = function (data) {
                var params = JSON.parse(data.params);
                var quotas = params.quotaList;
                $scope.cpu.value = quotas[0].limit;
                $scope.memory.value = quotas[1].limit;
                $scope.storage.value = quotas[2].limit;
                $scope.vpc.value = quotas[3].limit;
                $scope.ip.value = quotas[4].limit;
                $scope.group.value = quotas[5].limit;
                $scope.vm.value = quotas[6].limit;
                $scope.description.value = data.comments;

                resourceId = params.vdcId;
                $scope.operate.queryVdcResourceSpec();
            };

            $scope.operate = {
                //创建订单
                "createOrder": function () {
                    var param = $scope.initParam();
                    var deferred = orderServiceImpl.createOrder(param);
                    deferred.then(function (data) {
                        if (!data || !data.orderId) {
                            return false;
                        }
                        tipMessage.sspAlert(data.orderId, function(){
                            $state.go("ssp.approvalVdcChange", {
                                "orderId" : data.orderId,
                                "action" : "view"
                            });
                        });
                        //创建成功跳转至我的申请页面
                        $state.go("ssp.order.apply");
                    });
                },
                "editOrder": function () {
                    var param = $scope.initParam();
                    var deferred = orderServiceImpl.modifyOrder(param);
                    deferred.then(function (data) {
                        $state.go("ssp.order.apply");
                    });
                },
                "queryVdcResourceSpec": function () {
                    var param = {
                        "user": user,
                        "id": resourceId
                    };
                    var deferred = vdcServiceImpl.queryVdcResourceSpec(param);
                    deferred.then(function (data) {
                        $scope.dealQuerySpecResponse(data);
                    });
                },
                "queryOrder": function () {
                    var param = {
                        "user": user,
                        "orderId": orderId
                    };
                    var retDefer = $.Deferred();
                    var deferred = orderServiceImpl.queryOrder(param);
                    deferred.then(function (data) {
                        if (!data || !data.orderId) {
                            retDefer.reject();
                            return;
                        }
                        $scope.dealQueryOrderResponse(data);
                    });
                    return retDefer.promise();
                }
            };

            // 在quotas列表中，查找名称为name的配额值， 值存在字段key中，取不到返回defaultValue
            function getSpecQuota(quotas, name, key, defaultValue) {
                var value = defaultValue;
                var quota = {};
                if (quotas && quotas.length > 0 && name) {
                    quota = _.find(quotas, function (item) {
                        return item.quotaName === name;
                    });
                    value = quota[key];
                }
                return value;
            }

            //初始化页面信息
            function init() {
                if ($scope.action === "apply") {
                    $scope.operate.queryVdcResourceSpec();
                } else if ($scope.action === "edit") {
                    $scope.operate.queryOrder();
                }
            }
            init();
        }
    ];
    return ctrl;
});
