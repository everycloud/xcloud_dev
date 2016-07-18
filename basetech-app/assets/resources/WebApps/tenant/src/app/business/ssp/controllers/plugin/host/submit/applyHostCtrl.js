/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        'tiny-common/UnifyValid',
        "app/services/httpService",
        'app/services/messageService',
        "app/services/tipMessageService",
        'app/services/validatorService',
        'app/services/exceptionService',
        'app/services/capacityService',
        "app/services/cloudInfraService",
        "app/business/ssp/services/catalog/catalogService",
        "app/business/ssp/services/order/orderService",
        "app/business/ssp/services/plugin/host/hostService",
        "app/business/ssp/services/plugin/commonService",
        'app/services/commonService'
], function ($, angular, _, UnifyValid, http, messageService, tipMessageService, validatorService, exceptionService, capacityService, cloudInfraService, catalogService, orderService, hostService, commonService, timeCommonService) {
    "use strict";

    var ctrl = ["$scope", "$state", "$stateParams", "$q", "camel", "exception", function ($scope, $state, $stateParams, $q, camel, exception) {
        var i18n = $scope.i18n;
        var user = $scope.user;
        var serviceId = $stateParams.serviceId;
        var orderId = $stateParams.orderId;
        var action = $stateParams.action;

        var validator = new validatorService();
        var cloudInfraServiceIns = new cloudInfraService($q, camel);
        var capacityServiceIns = new capacityService($q, camel);
        var catalogServiceIns = new catalogService(exception, $q, camel);
        var orderServiceIns = new orderService(exception, $q, camel);
        var hostServiceIns = new hostService(exception, $q, camel);
        var commonServiceIns = new commonService(exception);
        var messageServiceIns = new messageService();
        var tipMessage = new tipMessageService();

        // 服务详情
        $scope.detail = {};
        // 订单详情
        $scope.orderDetail = {};
        $scope.cloudInfra = {};

        // 地域信息
        $scope.location = {
            "id": "serviceApplyHostRegion",
            "label": i18n.common_term_section_label + ":",
            "width": "180",
            "values": [],
            "require": true,
            "validate": "required:" + i18n.common_term_null_valid + ";",
            "change": function () {
                $scope.cloudInfra = cloudInfraServiceIns.getCloudInfra($scope.location.values, $("#" + $scope.location.id).widget().getSelectedId());
                $scope.operate.queryAzs();
            }
        };

        // az
        $scope.az = {
            "label": i18n.resource_term_AZ_label + ":",
            "id": "serviceApplyHostAz",
            "width": "180",
            "values": [],
            "curr": {},
            "require": true,
            "validate": "required:" + i18n.common_term_null_valid + ";",
            "change": function () {
                var azId = $("#" + $scope.az.id).widget().getSelectedId();
                $scope.az.curr = cloudInfraServiceIns.getSpecAz($scope.az.values, azId);
                onSelectAz();
            }
        };

        // 基本信息
        $scope.base = {
            hostNum: {
                "label": i18n.server_term_serverNum_label + ":",
                "require": true,
                "id": "serviceApplyHostVmNum",
                "width": "180",
                "value": "1",
                "min": "1",
                "max": "10",
                "step": "1"
            },

            // 到期时间
            expireTime: {
                "label": i18n.common_term_overdueTime_label + ":",
                "id": "serviceApplyHostExpireTime",
                "width": "178",
                "require": true,
                "disable": false,
                "type": "datetime",
                "minDate": commonServiceIns.getCurrentTime(),
                "defaultDate": commonServiceIns.get30DaysDate(),
                "dateFormat": "yy-mm-dd",
                "timeFormat": "hh:mm:ss"
            },

            neverExpire: {
                "id": "serviceApplyHostNeverExpire",
                "checked": false,
                "text": i18n.common_term_neverExpires_label,
                "change": function () {
                    $scope.base.expireTime.disable = $("#" + $scope.base.neverExpire.id).widget().option("checked");
                }
            },

            // 备注
            remark: {
                "label": i18n.common_term_remark_label + ":",
                "id": "sspApplyHostRemark",
                "value": "",
                "type": "multi",
                "width": "220",
                "height": "57",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            }
        };

        // 规格信息
        $scope.config = {
            model: {
                "label": i18n.device_term_model_label + ":",
                "id": "sspApplyHostModel",
                "width": "200",
                "require": true,
                "values": [],
                "curr": "",
                "change": function() {
                    $scope.config.model.curr = $("#" + $scope.config.model.id).widget().getSelectedId();
                }
            },

            os: {
                "label": i18n.common_term_OS_label + ":",
                "id": "sspApplyHostOs",
                "width": "200",
                "values": [],
                "curr": "",
                "change": function() {
                    $scope.config.os.curr = $("#" + $scope.config.os.id).widget().getSelectedId();
                }
            }
        };

        $scope.okBtn = {
            "id": "serviceApplyHostOkBtn",
            "text": i18n.common_term_submit_button,
            "tooltip": "",
            "click": function () {
                // 校验
                if (!$scope.okBtn.valid()) {
                    return;
                }
                $scope.operate.applyHost();
            },
            "valid": function () {
                var param = $scope.detail.param;

                if (!UnifyValid.FormValid($("#sspApplyHostLocationArea"))) {
                    return false;
                }

                if (!$scope.config.model.curr) {
                    tipMessage.alert("error", i18n.service_term_chooseModel_msg);
                    return false;
                }

                if (!UnifyValid.FormValid($("#sspApplyHostBasicArea"))) {
                    return false;
                }

                var hostNum = $("#" + $scope.base.hostNum.id).widget().option("value");
                if (!hostNum || hostNum < 1) {
                    tipMessage.alert("error", i18n.service_term_chooseServerNum_msg);
                    return false;
                }
                return true;
            }
        };
        $scope.cancelBtn = {
            "id": "serviceApplyHostCancelBtn",
            "text": i18n.common_term_cancle_button,
            "tooltip": "",
            "click": function () {
                setTimeout(function () {
                    window.history.back();
                }, 0);
            }
        };

        $scope.clickAreaHeading = function (id) {
            var head = $("#" + id + " .s-heading");
            var content = $("#" + id + " .s-content");

            if (head.hasClass("collapse")) {
                // 收起来前，校验一下
                if (id === "sspApplyHostLocationArea") {
                    if (!UnifyValid.FormValid($("#sspApplyHostLocationArea"))) {
                        return false;
                    }
                } else if (id === "sspApplyHostConfigArea") {
                    if (!UnifyValid.FormValid($("#sspApplyHostConfigArea"))) {
                        return false;
                    }
                } else if (id === "sspApplyHostBasicArea") {
                    if (!UnifyValid.FormValid($("#sspApplyHostBasicArea"))) {
                        return false;
                    }
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

        $scope.operate = {
            // 查询服务详情
            "queryServiceDetail": function () {
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "id": serviceId
                };
                var deferred = catalogServiceIns.queryServiceOffering(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    $scope.detail = data;
                    var param = JSON.parse(data.params);
                    $scope.detail.param = param;

                    retDefer.resolve();
                });
                return retDefer.promise();
            },

            // 查询订单详情
            "queryOrderDetail": function () {
                if (action !== "edit") {
                    return {};
                }
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "orderId": orderId
                };
                var deferred = orderServiceIns.queryOrder(options);
                deferred.then(function (data) {
                    if (data) {
                        $scope.orderDetail = data;
                        $scope.orderDetail.param = JSON.parse(data.params);
                        retDefer.resolve();
                    }
                });
                return retDefer.promise();
            },

            // 查询地域列表
            "queryLocations": function () {
                var retDefer = $.Deferred();
                var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        var selectedCloudInfra;
                        if (action === "edit") {
                            data.cloudInfras[0].checked = false;
                            selectedCloudInfra = cloudInfraServiceIns.getCloudInfra(data.cloudInfras, $scope.orderDetail.param.cloudInfraId);
                        }
                        if (!selectedCloudInfra) {
                            selectedCloudInfra = data.cloudInfras[0];
                        }

                        selectedCloudInfra.checked = true;
                        $scope.cloudInfra = selectedCloudInfra;
                        $scope.location.values = data.cloudInfras;
                        retDefer.resolve();
                    }
                });
                return retDefer.promise();
            },

            //查询AZ列表
            "queryAzs": function () {
                var promise = cloudInfraServiceIns.queryAzs(user.vdcId, user.id, $scope.cloudInfra.id);
                promise.then(function (data) {
                    if (!data) {
                        return;
                    }
                    if (data.availableZones && data.availableZones.length > 0) {
                        var selectAz;
                        if (action === "edit") {
                            data.availableZones[0].checked = false;
                            selectAz = cloudInfraServiceIns.getSpecAz(data.availableZones, $scope.orderDetail.param.availableZoneId);
                        }

                        if (!selectAz) {
                            selectAz = data.availableZones[0];
                        }

                        selectAz.checked = true;
                        $scope.az.curr = selectAz;
                        $scope.az.values = data.availableZones;
                        onSelectAz(action === "edit");
                    }
                });
            },

            // 查询物理机列表
            "queryHosts": function(flag){
                var options = {
                    "user": user,
                    "cloudInfraId": $scope.cloudInfra.id,
                    "azId": $scope.az.curr.id,
                    "param":{
                        "state":"unassigned"
                    }
                };
                var promise = hostServiceIns.queryHosts(options);
                promise.then(function (data) {
                    if (!data) {
                        return;
                    }

                    var allModel = [];
                    var allOs = [
                        {
                            "label": " ",
                            "selectId": " ",
                            "checked": !flag
                        }
                    ];
                    if(data.servers && data.servers.length > 0){
                        _.each(data.servers, function(item, index){
                            if(!getSpecItem(allModel, item.model)){
                                allModel.push({
                                    "label": item.model,
                                    "selectId": item.model
                                });
                            }
                            if(item.osType != null){
                                if(!getSpecItem(allOs, item.osType)){
                                    allOs.push({
                                        "label": item.osType,
                                        "selectId": item.osType
                                    });
                                }
                            }
                        });

                        var currModel;
                        var currOs;
                        if (flag){
                            var param = $scope.orderDetail.param || {};
                            currModel = getSpecItem(allModel, param.model);
                            currOs =  getSpecItem(allOs, param.osType);
                        }

                        if (!currModel) {
                            currModel = allModel[0];
                        }
                        currModel.checked = true;
                        $scope.config.model.curr = currModel.selectId;

                        if (!currOs) {
                            currOs = allOs[0];
                        }
                        currOs.checked = true;
                        $scope.config.os.curr = currOs.selectId;
                    }

                    $scope.config.model.values = allModel;
                    $scope.config.os.values = allOs;
                });
            },

            // 提交申请
            "applyHost": function () {
                var hostParam = {
                    "cloudInfraId": getCloudInfraId(),
                    "cloudInfraName": $scope.cloudInfra.region,
                    "availableZoneId": getAzId(),
                    "availableZoneName": $scope.az.curr.name,
                    "vpcId":"",
                    "count": $("#" + $scope.base.hostNum.id).widget().option("value"),
                    "model": getModel(),
                    "osType": getOs()
                };

                var options;
                var deferred;
                var tenancy = $("#" + $scope.base.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc($("#" + $scope.base.expireTime.id).widget().getDateTime());
                var comments = $("#" + $scope.base.remark.id).widget().getValue();
                if (action === "edit") { // 修改订单
                    options = {
                        "user": user,
                        "id": orderId,
                        "params": {
                            "params": JSON.stringify(hostParam),
                            "tenancy": tenancy,
                            "comments": comments
                        }
                    };
                    deferred = orderServiceIns.modifyOrder(options);
                } else { // 申请订单
                    options = {
                        "user": user,
                        "params": {
                            "apply": {
                                "serviceOfferingId": serviceId,
                                "params": JSON.stringify(hostParam),
                                "tenancy": tenancy
                            },
                            "comments": comments
                        }
                    };
                    deferred = orderServiceIns.createOrder(options);
                }

                deferred.then(function (data) {
                    if (data && data.orderId) {
                        tipMessage.sspAlert(data.orderId, function(){
                            $state.go("ssp.approvalHostApply", {
                                "orderId" : data.orderId,
                                "action" : "view",
                                "serviceId" : serviceId
                            });
                        });
                    }
                    $state.go("ssp.order.apply");
                });
            }
        };

        // 提交时获取资源池id
        function getCloudInfraId() {
            return $scope.cloudInfra.id;
        }

        // 提交时获取azID
        function getAzId() {
            return $scope.az.curr.id;
        }

        // 提交时获取磁盘大小
        function getModel() {
            return $scope.config.model.curr;
        }

        // 提交时获取磁盘类型
        function getOs() {
            return $scope.config.os.curr;
        }

        // 选择AZ, flag为true表示当前是修改订单，需要选中之前的选中值
        function onSelectAz(flag) {
            $scope.operate.queryHosts(flag);
        }

        // 从列表中找到指定的元素
        function getSpecItem(all, specId){
            return _.find(all, function(item){
                return item.selectId === specId;
            });
        }

        //根据订单详情，初始化页面信息
        function initBaseByOrderDetail() {
            if (action !== "edit") {
                return;
            }

            var param = $scope.orderDetail.param || {};

            // 个数
            $scope.base.hostNum.value = param.count || "1";

            // 到期时间
            var tenancy = $scope.orderDetail.tenancy;
            if (tenancy) {
                if (tenancy === "0") {
                    $scope.base.expireTime.disable = true;
                    $scope.base.neverExpire.checked = true;
                } else {
                    var dateWidget = $("#" + $scope.base.expireTime.id).widget();
                    if (dateWidget) {
                        var localTime = timeCommonService.utc2Local(tenancy);
                        var dateTime = localTime.split(" ");
                        dateWidget.option("defaultTime", dateTime[1]);
                        dateWidget.option("defaultDate", dateTime[0]);
                    }
                }
            }

            // 备注
            $scope.base.remark.value = $scope.orderDetail.comments;
        }

        // 查询需要的其他信息
        function queryRelatedInfo() {
            var deferred = $scope.operate.queryLocations();
            $.when(deferred).done(function () {
                $scope.operate.queryAzs();
            });
        }

        // 初始化页面信息
        function init() {
            var deferred = $scope.operate.queryServiceDetail();
            var deferred2 = $scope.operate.queryOrderDetail();
            $.when(deferred, deferred2).done(function () {
                //根据订单详情，初始化基本信息部分
                initBaseByOrderDetail();
                queryRelatedInfo();
            });
        }

        init();
    }];

    return ctrl;
});
