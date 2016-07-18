/*global define*/
define(['tiny-lib/jquery',
    "app/business/network/services/vpc/vpcService",
    "app/business/network/services/networkService",
    "app/business/network/services/router/routerService",
    'tiny-widgets/Message',
    "fixtures/network/vpcFixture",
    "fixtures/network/network/createNetworkFixture"], function ($, vpcService, networkService, routerService, Message) {
    "use strict";

    var confirmCtrl = ["$scope", "$q", "$state", "$interval", "$timeout", "camel", "exception", function ($scope, $q, $state, $interval, $timeout, camel, exception) {
        var i18n = $scope.i18n;

        var vpcServiceIns = new vpcService(exception, $q, camel);
        var networkIns = new networkService(exception, $q, camel);
        var routerIns = new routerService(exception, $q, camel);

        var extNetworkId = ""; // 创建直连网络时需要的外部网络id
        var newVpcId = "";     // 新创建的vpc id
        //定时器句柄
        $scope.createTimer = null;

        $scope.baseInfo = {
            "name": i18n.common_term_name_label + ":",
            "description": i18n.common_term_desc_label + ":",
            "routerType": i18n.router_term_routerType_label + ":",
            "supporVXLAN": i18n.router_router_view_para_supporVXLAN_label + ":",
            "subnetMask": i18n.common_term_SubnetAndMask_label + ":",
            "gateway": i18n.common_term_gateway_label + ":",
            "outTime": i18n.device_term_timeouts_label + ":",
            vlan: {
                label: i18n.resource_term_vlanID_label + ":"
            },
            "IPassignMode":i18n.common_term_IPassignMode_label + ":",
            preBtn: {
                "id": "create-vpc-step3-pre",
                "text": i18n.common_term_back_button,
                "click": function () {
                    if ($scope.service.type === $scope.VPC_TYPE.CUSTOM) {
                        $scope.service.show = "vpcType";
                    }
                    else {
                        $scope.service.show = "networkInfo";
                    }
                    $("#" + $scope.service.step.id).widget().pre();
                }
            },
            createBtn: {
                "id": "create-vpc-step3-create",
                "text": i18n.common_term_create_button,
                "click": function () {
                    $scope.service.progressStepInfo = [];
                    // 创建VPC
                    var promise = $scope.operator.createVPC();
                    if ($scope.service.type === $scope.VPC_TYPE.CUSTOM) {
                        promise.then(function () {
                            $state.go("network.manager.myVPClist");
                        });
                    }
                    // 直连
                    else if ($scope.service.type === $scope.VPC_TYPE.DIRECT) {
                        promise.then(function () {
                            var params = {
                                "vpcID": newVpcId,
                                "azID": $scope.service.azIDs,
                                "name": $scope.service.direct.name,
                                "vlan": $scope.service.direct.vlanId,
                                "dirctNetwork": true,
                                "routed": false,
                                "description": $scope.service.direct.description,
                                "subnet": null,
                                "portSetting": null,
                                "extNetworkId": $scope.service.direct.extNetworkId  //直连网络(必填)
                            };
                            var promise3 = $scope.operator.createNetwork(params);
                            promise3.then(function () {
                                $state.go("network.manager.myVPClist");
                            });
                        });
                    }
                    // 直连+路由
                    else if ($scope.service.type === $scope.VPC_TYPE.DIRECT_ROUTER) {
                        //显示进度条
                        $scope.service.showConfirmInfo = false;
                        $scope.service.showProgressbar = true;
                        $scope.service.progressInfo = i18n.vpc_vpc_add_info_succeed_msg;
                        $scope.service.progressStepInfo.push(i18n.vpc_vpc_add_info_succeed_msg);
                        $scope.service.progress = 10;
                        //流程 创建直连网络->申请路由->创建路由网络
                        promise.then(function () {
                            $scope.service.progressInfo = i18n.vpc_net_add_info_directProcess_msg;
                            var params = {
                                "vpcID": newVpcId,
                                "azID": $scope.service.azIDs,
                                "name": $scope.service.direct.name,
                                "vlan": $scope.service.direct.vlanId,
                                "dirctNetwork": true,
                                "routed": false,
                                "description": $scope.service.direct.description,
                                "subnet": null,
                                "portSetting": null,
                                "extNetworkId": $scope.service.direct.extNetworkId  //直连网络(必填)
                            };
                            var promise3 = $scope.operator.createNetwork(params);
                            promise3.then(function () {
                                $scope.service.progressInfo = i18n.vpc_net_add_info_directSucceed_msg;
                                $scope.service.progressStepInfo.push(i18n.vpc_net_add_info_directSucceed_msg);
                                $scope.service.progress = 20;
                                var routerOfVxlan = ($scope.service.router.routerType === "2" && $scope.service.router.supportVxlan);
                                $scope.service.progressInfo = i18n.router_term_applyingRouter_value;
                                var queryOutnetPromise = $scope.operator.getFirstOutNetworkId($scope.service.router.routerType, !routerOfVxlan, routerOfVxlan);
                                queryOutnetPromise.then(function () {
                                    // 申请路由，下一步创建路由网络
                                    var data = {
                                        "vpcID": newVpcId,
                                        "azID": $scope.service.azIDs,
                                        "routerType": $scope.service.router.routerType,
                                        "externalNetworkID": extNetworkId
                                    };
                                    if($scope.service.router.routerType === "2") {
                                        data.supportVxlanFlag = $scope.service.router.supportVxlan;
                                    }
                                    var createRouterPromise = routerIns.createRouter({
                                        "vdcId": $scope.service.user.vdcId,
                                        "userId": $scope.service.user.id,
                                        "cloudInfraId": $scope.service.cloudInfraId,
                                        "data": data
                                    });
                                    createRouterPromise.then(function () {
                                        $scope.createTimer = $interval(function () {
                                            var queryRouterPromise = routerIns.queryRouter({
                                                "vdcId": $scope.service.user.vdcId,
                                                "vpcId": newVpcId,
                                                "userId": $scope.service.user.id,
                                                "cloudInfraId": $scope.service.cloudInfraId,
                                                "azId": $scope.service.azIDs
                                            });
                                            queryRouterPromise.then(function (data) {
                                                if (!data || !data.routers || data.routers.length <= 0) {
                                                    $scope.service.progressInfo = i18n.router_term_applyRouterFail_value;
                                                    $scope.service.progressStepInfo.push(i18n.router_term_applyRouterFail_value);
                                                    $scope.service.progress = 60;
                                                    $scope.clearTimer();
                                                }
                                                if (data.routers[0].status === "READY") {
                                                    $scope.service.progressInfo = i18n.router_term_applyRouterSucceed_value;
                                                    $scope.service.progressStepInfo.push(i18n.router_term_applyRouterSucceed_value);
                                                    $scope.service.progress = 60;
                                                    $scope.clearTimer();

                                                    var queryVlanOptions = {
                                                        vdcId: $scope.service.user.vdcId,
                                                        cloudInfraId: $scope.service.cloudInfraId,
                                                        "userId": $scope.service.user.id,
                                                        params: {
                                                            "vpcID": newVpcId,
                                                            "azID": $scope.service.azIDs,
                                                            "usedBySubnet": true,
                                                            "vxLanFlag": false,
                                                            "start": 0,
                                                            "limit": 10
                                                        }
                                                    };
                                                    var queryVlanPromise = networkIns.queryVlanPools(queryVlanOptions);
                                                    queryVlanPromise.then(function (data) {
                                                        if (!data || !data.queryVlanPoolResp || !data.queryVlanPoolResp.vlanpools || data.queryVlanPoolResp.vlanpools.length <= 0) {
                                                            // 没有可用的VLAN网络异常提示
                                                            showErrorMessage("1130000");
                                                            return;
                                                        }
                                                        // 创建路由网络
                                                        var routerParams = {
                                                            "vpcID": newVpcId,
                                                            "azID": $scope.service.azIDs,
                                                            "name": $scope.service.router.name,
                                                            "vlan": data.queryVlanPoolResp.vlanpools[0].startID || "",
                                                            "dirctNetwork": false,
                                                            "routed": true,
                                                            "description": $scope.service.router.description,
                                                            "subnet": {
                                                                gateway: $scope.service.router.gateway,
                                                                ipAllocatePolicy: $scope.service.router.ipAllocatePolicy,
                                                                subnetAddr: $scope.service.router.subnetAddr,
                                                                subnetPrefix: $scope.service.router.subnetPrefix
                                                            }
                                                        };

                                                        var createRouterNetPromise = $scope.operator.createNetwork(routerParams);
                                                        createRouterNetPromise.then(function () {
                                                            $scope.service.progressInfo = i18n.vpc_net_add_info_routerSucceed_msg;
                                                            $scope.service.progressStepInfo.push(i18n.vpc_net_add_info_routerSucceed_msg);
                                                            $scope.baseInfo.confirmBtn.text = i18n.common_term_complete_label;
                                                            $scope.service.progress = 100;
                                                        });
                                                    });
                                                }
                                                if (data.routers[0].status === "FAIL") {
                                                    $scope.service.progressInfo = i18n.router_term_applyRouterFail_value;
                                                    $scope.service.progressStepInfo.push(i18n.router_term_applyRouterFail_value);
                                                    $scope.service.progress = 60;
                                                    $scope.clearTimer();
                                                }
                                            });
                                        }, 3000);
                                    });
                                });
                            });
                        });
                    }
                    // 直连+路由+内部网络
                    else if ($scope.service.type === $scope.VPC_TYPE.DIRECT_ROUTER_EXTEND_VPN) {
                        //显示进度条
                        $scope.service.showConfirmInfo = false;
                        $scope.service.showProgressbar = true;
                        $scope.service.progressInfo = i18n.vpc_vpc_add_info_succeed_msg;
                        $scope.service.progressStepInfo.push(i18n.vpc_vpc_add_info_succeed_msg);
                        $scope.service.progress = 10;
                        //流程 创建直连网络->申请路由->创建路由网络
                        promise.then(function () {
                            $scope.service.progressInfo = i18n.vpc_net_add_info_directProcess_msg;
                            var params = {
                                "vpcID": newVpcId,
                                "azID": $scope.service.azIDs,
                                "name": $scope.service.direct.name,
                                "vlan": $scope.service.direct.vlanId,
                                "dirctNetwork": true,
                                "routed": false,
                                "description": $scope.service.direct.description,
                                "subnet": null,
                                "portSetting": null,
                                "extNetworkId": $scope.service.direct.extNetworkId  //直连网络(必填)
                            };
                            var promise3 = $scope.operator.createNetwork(params);
                            promise3.then(function () {
                                $scope.service.progressInfo = i18n.vpc_net_add_info_directSucceed_msg;
                                $scope.service.progressStepInfo.push(i18n.vpc_net_add_info_directSucceed_msg);
                                $scope.service.progress = 20;

                                // 创建内部网络
                                var queryVlanOptions = {
                                    vdcId: $scope.service.user.vdcId,
                                    cloudInfraId: $scope.service.cloudInfraId,
                                    "userId": $scope.service.user.id,
                                    params: {
                                        "vpcID": newVpcId,
                                        "azID": $scope.service.azIDs,
                                        "usedBySubnet": true,
                                        "vxLanFlag": false,
                                        "start": 0,
                                        "limit": 10
                                    }
                                };
                                var queryVlanPromise1 = networkIns.queryVlanPools(queryVlanOptions);
                                queryVlanPromise1.then(function (data) {
                                    if (!data || !data.queryVlanPoolResp || !data.queryVlanPoolResp.vlanpools || data.queryVlanPoolResp.vlanpools.length <= 0) {
                                        // 没有可用的VLAN网络异常提示
                                        showErrorMessage("1130000");
                                        return;
                                    }
                                    // 创建路由网络
                                    var innerParams = {
                                        "vpcID": newVpcId,
                                        "azID": $scope.service.azIDs,
                                        "name": $scope.service.internal.name,
                                        "vlan": data.queryVlanPoolResp.vlanpools[0].startID || "",
                                        "dirctNetwork": false,
                                        "routed": false,
                                        "description": $scope.service.internal.description,
                                        "subnet": {
                                            ipAllocatePolicy: $scope.service.router.ipAllocatePolicy,
                                            subnetAddr: $scope.service.internal.subnetAddr,
                                            subnetPrefix: $scope.service.internal.subnetPrefix
                                        }
                                    };
                                    if($scope.service.internal.gateway && $scope.service.internal.gateway !== ""){
                                        innerParams.subnet.gateway = $scope.service.internal.gateway;
                                    }

                                    var createRouterNetPromise = $scope.operator.createNetwork(innerParams);
                                    createRouterNetPromise.then(function () {
                                        $scope.service.progressInfo = i18n.vpc_net_add_info_innerSucceed_msg;
                                        $scope.service.progressStepInfo.push(i18n.vpc_net_add_info_innerSucceed_msg);
                                        $scope.service.progress = 50;

                                        // 申请路由
                                        var routerOfVxlan = ($scope.service.router.routerType === "2" && $scope.service.router.supportVxlan);
                                        $scope.service.progressInfo = i18n.router_term_applyingRouter_value;
                                        var queryOutnetPromise = $scope.operator.getFirstOutNetworkId($scope.service.router.routerType,!routerOfVxlan, routerOfVxlan);
                                        queryOutnetPromise.then(function () {
                                            // 申请路由，下一步创建路由网络
                                            var data = {
                                                "vpcID": newVpcId,
                                                "azID": $scope.service.azIDs,
                                                "routerType": $scope.service.router.routerType,
                                                "externalNetworkID": extNetworkId
                                            };
                                            if($scope.service.router.routerType === "2") {
                                                data.supportVxlanFlag = $scope.service.router.supportVxlan;
                                            }
                                            var createRouterPromise = routerIns.createRouter({
                                                "vdcId": $scope.service.user.vdcId,
                                                "userId": $scope.service.user.id,
                                                "cloudInfraId": $scope.service.cloudInfraId,
                                                "data": data
                                            });
                                            createRouterPromise.then(function () {
                                                $scope.createTimer = $interval(function () {
                                                    var queryRouterPromise = routerIns.queryRouter({
                                                        "vdcId": $scope.service.user.vdcId,
                                                        "vpcId": newVpcId,
                                                        "userId": $scope.service.user.id,
                                                        "cloudInfraId": $scope.service.cloudInfraId,
                                                        "azId": $scope.service.azIDs
                                                    });
                                                    queryRouterPromise.then(function (data) {
                                                        if (!data || !data.routers || data.routers.length <= 0) {
                                                            $scope.service.progressInfo = i18n.router_term_applyRouterFail_value;
                                                            $scope.service.progressStepInfo.push(i18n.router_term_applyRouterFail_value);
                                                            $scope.service.progress = 70;
                                                            $scope.clearTimer();
                                                        }
                                                        if (data.routers[0].status === "READY") {
                                                            $scope.service.progressInfo = i18n.router_term_applyRouterSucceed_value;
                                                            $scope.service.progressStepInfo.push(i18n.router_term_applyRouterSucceed_value);
                                                            $scope.service.progress = 70;
                                                            $scope.clearTimer();

                                                            var queryVlanOptions = {
                                                                vdcId: $scope.service.user.vdcId,
                                                                cloudInfraId: $scope.service.cloudInfraId,
                                                                "userId": $scope.service.user.id,
                                                                params: {
                                                                    "vpcID": newVpcId,
                                                                    "azID": $scope.service.azIDs,
                                                                    "usedBySubnet": true,
                                                                    "vxLanFlag": false,
                                                                    "start": 0,
                                                                    "limit": 10
                                                                }
                                                            };
                                                            var queryVlanPromise = networkIns.queryVlanPools(queryVlanOptions);
                                                            queryVlanPromise.then(function (data) {
                                                                if (!data || !data.queryVlanPoolResp || !data.queryVlanPoolResp.vlanpools || data.queryVlanPoolResp.vlanpools.length <= 0) {
                                                                    // 没有可用的VLAN网络异常提示
                                                                    showErrorMessage("1130000");
                                                                    return;
                                                                }
                                                                // 创建路由网络
                                                                var routerParams = {
                                                                    "vpcID": newVpcId,
                                                                    "azID": $scope.service.azIDs,
                                                                    "name": $scope.service.router.name,
                                                                    "vlan": data.queryVlanPoolResp.vlanpools[0].startID || "",
                                                                    "dirctNetwork": false,
                                                                    "routed": true,
                                                                    "description": $scope.service.router.description,
                                                                    "subnet": {
                                                                        gateway: $scope.service.router.gateway,
                                                                        ipAllocatePolicy: $scope.service.router.ipAllocatePolicy,
                                                                        subnetAddr: $scope.service.router.subnetAddr,
                                                                        subnetPrefix: $scope.service.router.subnetPrefix
                                                                    }
                                                                };

                                                                var createRouterNetPromise = $scope.operator.createNetwork(routerParams);
                                                                createRouterNetPromise.then(function () {
                                                                    $scope.service.progressInfo = i18n.vpc_vpc_add_info_end_msg;
                                                                    $scope.service.progressStepInfo.push(i18n.vpc_net_add_info_routerSucceed_msg);
                                                                    $scope.service.progress = 100;
                                                                    $scope.baseInfo.confirmBtn.text = i18n.common_term_complete_label;
                                                                });
                                                            });
                                                        }
                                                        if (data.routers[0].status === "FAIL") {
                                                            $scope.service.progressInfo = i18n.router_term_applyRouterFail_value;
                                                            $scope.service.progressStepInfo.push(i18n.router_term_applyRouterFail_value);
                                                            $scope.service.progress = 70;
                                                            $scope.clearTimer();
                                                        }
                                                    });
                                                }, 3000);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }

                    // ICT 内部网络
                    else if ($scope.service.type === $scope.VPC_TYPE.INNERNET) {
                        promise.then(function () {
                            var innernetParams = {
                                "vpcID": newVpcId,
                                "azID": $scope.service.azIDs,
                                "name": $scope.service.internal.name,
                                "vlan": null,
                                "dirctNetwork": false,
                                "routed": false,
                                "description": $scope.service.internal.description,
                                "subnet": {
                                    ipAllocatePolicy: $scope.service.internal.ipAllocatePolicy,
                                    subnetAddr: $scope.service.internal.subnetAddr,
                                    subnetPrefix: $scope.service.internal.subnetPrefix
                                }
                            };
                            if($scope.service.internal.gateway && $scope.service.internal.gateway !== ""){
                                innernetParams.subnet.gateway = $scope.service.internal.gateway;
                            }
                            var promise2 = $scope.operator.createNetwork(innernetParams);
                            $.when(promise2).done(function () {
                                $state.go("network.manager.myVPClist");
                            });
                        });
                    }
                }
            },
            cancelBtn: {
                "id": "create-vpc-step3-cancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $state.go("network.manager.myVPClist");
                }
            },
            confirmBtn: {
                "text": i18n.common_term_cancle_button
            }
        };

        $scope.operator = {
            "createVPC": function () {
                var retDefer = $q.defer();
                var param = {
                    "name": $scope.service.name,
                    "description": $scope.service.description,
                    "azIDs": [$scope.service.azIDs]
                };
                if($scope.service.isICT){
                    param.vpcSpec=$scope.service.vpcSpec;
                }
                var option = {
                    "vdcId": $scope.service.user.vdcId,
                    "cloudInfraId": $scope.service.cloudInfraId,
                    "userId": $scope.service.user.id,
                    "param": param
                };
                var promise = vpcServiceIns.createVpc(option);
                promise.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.vpcID) {
                        newVpcId = data.vpcID;
                        retDefer.resolve();
                    }
                }, function () {
                    retDefer.reject();
                });
                return retDefer.promise;
            },
            "getFirstOutNetworkId": function (routerType,usedbyrouter, usedbyvxlanrouter) {
                var retDefer = $q.defer();
                //硬件路由器不查询网络
                if("1" === routerType){
                    retDefer.resolve();
                }else{
                    var option = {
                        "cloudInfraId": $scope.service.cloudInfraId,
                        "vpcId": newVpcId,
                        "azId": $scope.service.azIDs,
                        "start": 0,
                        "limit": 100,
                        "userId": $scope.service.user.id,
                        "vdcId": $scope.service.user.vdcId,
                        "usedbyrouter": usedbyrouter,
                        "usedbyvxlanrouter": usedbyvxlanrouter,
                        "isAssociated": true
                    };
                    var promise = networkIns.queryOutNetworks(option);
                    promise.then(function (data) {
                        if (!data || !data.externalNetworks || data.externalNetworks.length <= 0) {
                            retDefer.reject();
                            // 没有可用的外部网络异常提示
                            showErrorMessage("1162512");
                            $scope.service.progressInfo = i18n.router_term_applyRouterFail_value;
                            $scope.service.progressStepInfo.push(i18n.router_term_applyRouterFail_value);
                            return;
                        }
                        if (data.externalNetworks && data.externalNetworks.length > 0) {
                            // 默认选中第一个
                            extNetworkId = data.externalNetworks[0].exnetworkID;
                        }
                        retDefer.resolve();
                    }, function () {
                        retDefer.reject();
                    });
                }
                return retDefer.promise;
            },
            "createNetwork": function (params) {
                var retDefer = $q.defer();
                var promise = networkIns.createNetwork({
                    "cloudInfraId": $scope.service.cloudInfraId,
                    "vdcId": $scope.service.user.vdcId,
                    "userId": $scope.service.user.id,
                    "vpcId": params.vpcID,
                    "params": params
                });
                promise.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    retDefer.resolve(data);
                }, function () {
                    retDefer.reject();
                });
                return retDefer.promise;
            }
        };

        /**
         * 清除定时器
         */
        $scope.clearTimer = function () {
            if (!$scope.createTimer) {
                return;
            }
            try {
                $interval.cancel($scope.createTimer);
                $scope.createTimer = null;
            }
            catch (e) {
            }
        };

        // state change 事件
        $scope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                var scope = event.currentScope;
                if (!scope.service.forceInterrupt && $scope.createTimer) {
                    event.preventDefault();
                    var msgOptions = {
                        "type": "confirm", //prompt,confirm,warn,error
                        "title": i18n.common_term_confirm_label,
                        "content": i18n.vpc_vpc_exitAddPage_info_confirm_msg,
                        "width": "300",
                        "height": "200"
                    };

                    var msgBox = new Message(msgOptions);

                    var buttons = [
                        {
                            label: i18n.common_term_ok_button,
                            accessKey: 'Y',
                            default: true,
                            handler: function (event) {
                                $scope.service.forceInterrupt = true;
                                $scope.clearTimer();
                                $state.go(toState.name, toParams);
                                msgBox.destroy();
                            }
                        },
                        {
                            label: i18n.common_term_cancle_button,
                            accessKey: 'N',
                            default: false,
                            handler: function (event) {
                                msgBox.destroy();
                            }
                        }
                    ];

                    msgBox.option("buttons", buttons);
                    msgBox.show();
                }
            }
        );

        function showErrorMessage(errorCode) {
            exception.doException({
                "status": "400",
                "responseText": '{"code":' + errorCode + '}'
            }, "");
        }
    }];
    return confirmCtrl;
});