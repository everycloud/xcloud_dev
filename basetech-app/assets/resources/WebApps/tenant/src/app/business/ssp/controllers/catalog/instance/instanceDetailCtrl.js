/* global define */
define(["sprintf",
        "language/keyID",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        "tiny-common/UnifyValid",
        'app/services/exceptionService',
        'app/services/messageService',
        'app/services/validatorService',
        'app/services/commonService',
        "app/business/ssp/services/catalog/catalogService",
        "app/business/ssp/services/order/orderService",
        "app/business/ssp/services/plugin/commonService",
        "app/services/httpService",
        "app/business/network/services/vpc/vpcService"
    ],
    function (sprintf,keyIDI18n, $, angular, _, Window, UnifyValid, exception, messageService, validatorService, timeCommonService, catalogService, orderService, commonService, http, vpcService) {
        "use strict";
        var instanceDetailCtrl = ["$scope", "$q", "camel", "exception", "validator",
            function ($scope, $q, camel, exception, validator) {
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n  = $scope.i18n;

                var catalogServiceIns = new catalogService(exception, $q, camel);
                var orderServiceIns = new orderService(exception, $q, camel);
                var commonServiceIns = new commonService(exception);
                var messageServiceIns = new messageService();
                var vpcServiceIns = new vpcService(exception, $q, camel);
                var user = $("html").scope().user;
                var state = $("html").injector().get("$state");
                var instanceId = null;
                $scope.changeOrderBoxId = "sspInstanceMoreChangeOrder";
                $scope.extendOrderBoxId = "sspInstanceMoreExtendOrder";

                $scope.isICT = user.cloudType === "ICT";
                $scope.instanceDetail = {};

                $scope.label = {
                    summary: i18n.common_term_summary_label + ":",
                    name: i18n.common_term_name_label + ":",
                    createTime: i18n.common_term_provideTime_label + ":",
                    resource: i18n.common_term_resource_label + ":",
                    apply: i18n.service_term_referApply_label + ":",
                    applyOrder: i18n.service_term_serviceApplicationWorkOrder_label + ":",
                    changeOrder: i18n.service_term_serviceChangeWorkOrder_label + ":",
                    extendOrder: i18n.service_term_serviceDelayWorkOrder_label + ":"
                };

                var nameValidTip = i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64");
                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "textBoxId": "sspInstanceDetailNameId",
                    "validate": "regularCheck(" + validator.name + "):" + nameValidTip + ";" + "regularCheck(" + validator.notAllSpaceReg + "):" + nameValidTip,
                    "modifying": false,
                    "clickModify": function () {
                        $scope.name.modifying = true;
                        setTimeout(function () {
                            $("#" + $scope.name.textBoxId + " input").focus().val($scope.instanceDetail.data.name);
                        }, 50);
                    },
                    "blur": function () {
                        $scope.name.modify();
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.name.modify();
                        }
                    },
                    "modify": function () {
                        if (!UnifyValid.FormValid($("#" + $scope.name.textBoxId))) {
                            return;
                        }
                        var newName = $.trim($("#" + $scope.name.textBoxId).widget().getValue());
                        var defer = $scope.operate.modifyInstance(newName);
                        defer.then(function () {
                            $scope.instanceDetail.data.name = newName;
                            $scope.name.modifying = false;
                        });
                    }
                };

                $scope.refreshResources = function(){
                    messageServiceIns.confirmMsgBox({
                        "content": i18n.service_service_refreshResource_info_confirm_msg || "资源更新耗时最长约2分钟，过程中不能进行其他操作。确实要更新资源？",
                        "callback": function () {
                            $scope.operate.refreshInstance();
                        }
                    });
                };

                $scope.operate = {
                    "queryServiceInstanceDetail": function () {
                        var param = {
                            "user": user,
                            "id": instanceId
                        };
                        var deferred = catalogServiceIns.queryServiceInstanceDetail(param);
                        deferred.then(function (data) {
                            if (!data || !data.id) {
                                return;
                            }

                            _.each(data.resources, function(item){
                                item.resourceTypeView = commonServiceIns.resourceTypeView[item.resourceType];
                                if(item.metadata.vpcId != "-1" && item.metadata.vpcId != null){
                                    var defer = getVpcNameById(item.metadata.cloudInfraId,item.metadata.vpcId);
                                    $.when(defer).done(function(){
                                        item.vpcName = $scope.vpcName;
                                    });
                                }
                            });

                            data.createTime = timeCommonService.utc2Local(data.createTime);
                            $scope.instanceDetail.data = data;
                        });
                    },
                    "queryInstanceOrders": function () {
                        var param = {
                            "user": user,
                            "params": {
                                "service-instance-id": instanceId
                            }
                        };

                        var deferred = orderServiceIns.queryOrders(param);
                        deferred.then(function (data) {
                            var orders = data.orders;
                            var applyOrders = [],
                                extendOrders = [],
                                changeOrders = [];

                            _.each(data.orders, function (item) {
                                if (item.type === "apply") {
                                    applyOrders.push(item);
                                } else if (item.type === "extend") {
                                    extendOrders.push(item);
                                } else if (item.type === "modify") {
                                    changeOrders.push(item);
                                }
                            });

                            applyOrders.sort(function (a, b) {
                                return a.submitTime > b.submitTime ? -1 : 1;
                            });
                            extendOrders.sort(function (a, b) {
                                return a.submitTime > b.submitTime ? -1 : 1;
                            });
                            changeOrders.sort(function (a, b) {
                                return a.submitTime > b.submitTime ? -1 : 1;
                            });

                            $scope.instanceDetail.applyOrder = applyOrders[0] ? applyOrders[0] : null;
                            $scope.instanceDetail.changeOrder = changeOrders[0] ? changeOrders[0] : null;
                            $scope.instanceDetail.allChangeOrder = changeOrders;
                            $scope.instanceDetail.extendOrder = extendOrders[0] ? extendOrders[0] : null;
                            $scope.instanceDetail.allExtendOrder = extendOrders;
                        });
                    },
                    "modifyInstance": function(name){
                        var retDefer = $q.defer();
                        var options = {
                            "user": user,
                            "name": name,
                            "instanceId": instanceId
                        };
                        var deferred = catalogServiceIns.modifyServiceInstance(options);
                        deferred.then(function (data) {
                            retDefer.resolve(data);
                        });
                        return retDefer.promise;
                    },
                    "refreshInstance": function () {
                        var options = {
                            "user": user,
                            "catalogId": instanceId
                        };
                        var deferred = catalogServiceIns.refreshCatalog(options);
                        deferred.then(function (data) {
                            $scope.init(instanceId);
                        });
                    }
                };

                // 跳转到资源页面
                $scope.jump2ResourcePage = function (resourceUrl, resourceId, resourceName, cloudInfraId, vpcId) {
                    if (resourceUrl) {
                        state.go(resourceUrl, {
                            "id": resourceId,
                            "condition": resourceName,
                            "cloudInfraId": cloudInfraId,
                            "vpcId": vpcId
                        });
                    }
                };

                // 变更资源(id是ssp数据库id，resourceId是IRM的id)
                $scope.changeResource = function (changeUrl, id, resourceId, cloudInfraId, vpcId) {
                    state.go(changeUrl, {
                        "action": "apply",
                        "id": id,
                        "instanceId": $scope.instanceDetail.id,
                        "resourceId": resourceId,
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId
                    });
                };

                // 删除资源
                $scope.deleteResource = function (id, resouceType) {
                    var msg = i18n.lb_lb_delResource_info_confirm_msg;
                    if(resouceType && resouceType === "vdc"){
                        msg = i18n.org_vdc_delSC_info_confirm_msg || "删除VDC将导致该VDC内的用户和应用模板被删除，所有申请单不可用。确实要删除该VDC？";
                    }
                    messageServiceIns.confirmMsgBox({
                        "content": msg,
                        "callback": function () {
                            var options = {
                                "user": user,
                                "params": {
                                    "release": {
                                        "resourceIds": [id],
                                        "serviceInstanceId": instanceId
                                    }
                                }
                            };
                            var defer = orderServiceIns.createOrder(options);
                            defer.then(function (item) {
                                state.go("ssp.order.apply");
                            });
                        }
                    });
                };

                //查看订单详情
                $scope.viewOrder = function (order) {
                    state.go(order.approveUrl, {
                        "action": "view",
                        "serviceId": order.serviceOffingId,
                        "orderId": order.orderId
                    });
                };

                //查看订单详情
                $scope.showMoreOrder = function (id, event) {
                    $(".pop-box").css("display", "none");

                    var dom = $("#" + id);
                    if (dom.length > 0) {
                        dom.css("display", "block");
                    }
                    stopBubble(event);
                };

                // 初始化更多订单弹出层
                function initMoreOrder(){
                    var popDom = $(".pop-box");
                    popDom.bind("mouseover", function(evt){
                        $(evt.currentTarget).css("display", "block");
                    });
                    popDom.bind("mouseout", function(evt){
                        $(evt.currentTarget).css("display", "none");
                    });
                    popDom.bind("click", function (evt) {
                        stopBubble(evt);
                    });
                    document.onclick = function(){
                        popDom.css("display", "none");
                    };
                }

                // 阻止事件冒泡
                function stopBubble(event) {
                    var e = event || window.event;
                    if (e) {
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        } else {
                            e.cancelBubble = true;
                        }
                    }
                }

                //根据VpcId查询vpcName
                function getVpcNameById(cloudInfraId,vpcId){
                    var params = {
                        "cloudInfraId": cloudInfraId,
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "vpcId": vpcId
                    };
                    var retDefer = $.Deferred();
                    var deferred = vpcServiceIns.getVpc(params);
                    deferred.then(function (data) {
                        if (!data || !data.vpcID) {
                            return;
                        }
                        $scope.vpcName = data.name;
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                }

                $scope.init = function (id) {
                    instanceId = id;
                    $scope.changeOrderBoxId += id;
                    $scope.extendOrderBoxId += id;
                    $scope.name.textBoxId += id;
                    $scope.operate.queryServiceInstanceDetail();
                    $scope.operate.queryInstanceOrders();
                    initMoreOrder();
                };
            }
        ];

        var instanceDetailModel = angular.module("ssp.catalog.instance.detail", ["ng", "wcc"]);
        instanceDetailModel.controller("ssp.catalog.instance.detail.ctrl", instanceDetailCtrl);
        instanceDetailModel.service("camel", http);
        instanceDetailModel.service("exception", exception);
        instanceDetailModel.service("validator", validatorService);
        return instanceDetailModel;
    });
