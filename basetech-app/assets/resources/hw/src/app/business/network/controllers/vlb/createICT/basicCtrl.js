/* global define*/
define(["tiny-lib/jquery",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    "app/business/network/services/vlb/vlbService",
    'app/business/network/services/networkService',
    "fixtures/network/vlb/vlbFixture"
], function ($, _, UnifyValid, VlbService, networkService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$q", "$stateParams", "exception",
        function ($scope, camel, $q, $stateParams, exception) {
            var user = $scope.user;
            var isIT = user.cloudType === "IT";
            var i18n = $scope.i18n;
            $scope.isIT = isIT;
            $scope.isICT = !isIT;
            var vlbServiceInst = new VlbService(exception, $q, camel);
            var networkServiceIns = new networkService(exception, $q, camel);

            //vpc网络与直连网络
            var vpcNetworks = [];
            var directNetworks = [];

            //校验器
            var vlbNameCheck = "/^[A-Za-z0-9-_ \\u4e00-\\u9fa5]{1,64}$/";
            $scope.info = {
                name: {
                    "id": "create-vlb-name",
                    label: i18n.common_term_name_label + ":",
                    "width": "214",
                    "require": true,
                    "validate": "regularCheck(" + vlbNameCheck + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                },
                maxSession: {
                    label: i18n.lb_term_sessionMaxNum_label + ":",
                    "id": "create-vlb-maxSession",
                    "width": "214",
                    require: true,
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000") + ";maxValue(10000):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000")
                },
                maxPut: {
                    label: i18n.lb_term_throughputMaxKbps_label + ":",
                    "id": "create-vlb-maxPut",
                    "width": "214",
                    require: true,
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "8", "10000000") + ";minValue(8):" + i18n.sprintf(i18n.common_term_range_valid, "8", "10000000") + ";maxValue(10000000):" + i18n.sprintf(i18n.common_term_range_valid, "8", "10000000")
                },
                lbType: {
                    label: i18n.common_term_lbType_label + ":",
                    "id": "create-vlb-lbType",
                    "width": "220",
                    require: true,
                    value: [
                        {
                            "selectId": "low",
                            "label": i18n.lb_term_softLB_label,
                            "checked": true
                        }
                    ]
                },
                subnetSelect: {
                    "label": i18n.common_term_Subnet_label + ":",
                    "id": "create-ictVlb-subnetselect",
                    "validate": "required:" +i18n.common_term_null_valid,
                    "require": true,
                    "values": []
                },
                frontNet: {
                    label: i18n.vpc_term_nets_label + ":",
                    "id": "create-vlb-frontNet",
                    "width": "220",
                    require: true,
                    "validate": "required:" +i18n.common_term_null_valid,
                    value: [],
                    "change": function () {
                        var networkId = $("#" + $scope.info.frontNet.id).widget().getSelectedId();
                        queryNetworkDetail(networkId);
                    }
                },
                backendNet: {
                    label: i18n.lb_term_backendNet_label + ":",
                    "id": "create-vlb-backendNet",
                    "width": "220",
                    require: true,
                    value: []
                },
                policyType: {
                    "label": i18n.common_term_assignPolicyType_label + ":",
                    "id": "create-vlb-policyType",
                    "width": "220",
                    "require": true,
                    "value": [
                        {
                            "selectId": "0",
                            "label": i18n.lb_term_poolingMode_label,
                            "checked": true
                        },
                        {
                            "selectId": "1",
                            "label": i18n.lb_term_minConnectMode_label
                        }
                    ]
                },
                nextBtn: {
                    "id": "create-vlb-step1-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#vlb_create_basic"), undefined);
                        if (!valid) {
                            return;
                        }
                        //保存本页信息
                        $scope.service.vlbName = $("#create-vlb-name").widget().getValue();
                        $scope.service.maxSession = $("#create-vlb-maxSession").widget().getValue();
                        var frontNetDom = $("#create-ictVlb-subnetselect");
                        $scope.service.selectedFrontNetwork = {
                            "networkId": frontNetDom.widget().getSelectedId(),
                            "name": frontNetDom.widget().getSelectedLabel()
                        };
                        var lbTypeDom = $("#create-vlb-lbType");
                        $scope.service.workingMode = {
                            "value": lbTypeDom.widget().getSelectedId(),
                            "label": lbTypeDom.widget().getSelectedLabel()
                        };
                        $scope.service.frontNetType = {
                            "type": "ROUTED",
                            "name": i18n.vpc_term_routerNet_label
                        };

                        var policyTypeDom = $("#create-vlb-policyType");
                        $scope.service.policyType = {
                            "lb_method": policyTypeDom.widget().getSelectedId(),
                            "name": policyTypeDom.widget().getSelectedLabel()
                        };
                        $scope.service.show = "addMonitor";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-vlb-step1-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

            //ICT场景下，需要根据路由网络或者直连网络查询 所有子网列表
            function queryNetworksByType() {
                var vpcNetworksPromise = queryVpcNetwork();
                var directNetworksPromise = queryDirectNetwork();
                $.when(vpcNetworksPromise, directNetworksPromise).done(function () {
                    var networks = [];
                    if (vpcNetworks && vpcNetworks.networks && vpcNetworks.networks.length > 0) {
                        // 处理json对象到页面展示
                        _.each(vpcNetworks.networks, function (network) {
                            networks.push({
                                "selectId": network.networkID,
                                "label": network.name + "(" + network.networkID + ")"
                            });
                        });
                    }
                    if (directNetworks && directNetworks.externalNetworks && directNetworks.externalNetworks.length > 0) {
                        // 处理json对象到页面展示
                        _.each(directNetworks.externalNetworks, function (network) {
                            networks.push({
                                "selectId": network.exnetworkID,
                                "label": network.name + "(" + network.exnetworkID + ")"
                            });
                        });
                    }
                    $scope.info.frontNet.value = networks;
                    if ($scope.info.frontNet.value[0]) {
                        $scope.info.frontNet.value[0].checked = true;
                        queryNetworkDetail($scope.info.frontNet.value[0].selectId);
                    }
                })
            }
            function queryDirectNetwork(){
                var retDefer = $.Deferred();
                var promise = vlbServiceInst.queryOutNetworks({
                    "isAssociated": true,
                    "vdcId": $scope.user.vdcId,
                    "vpcId": $scope.service.vpcId,
                    "userId": $scope.user.id,
                    "cloudInfraId": $scope.service.cloudInfraId
                });
                promise.then(function (data) {
                    if (!data) {
                        retDefer.reject(data);
                        return;
                    }
                    directNetworks = data;
                    retDefer.resolve();
                });
                return retDefer.promise();
            }
            function queryVpcNetwork(){
                var retDefer = $.Deferred();
                var promise = vlbServiceInst.queryVpcNetsByType({
                    "vdcId": $scope.user.vdcId,
                    "cloudInfraId": $scope.service.cloudInfraId,
                    "vpcId": $scope.service.vpcId,
                    "userId": $scope.user.id
                });
                promise.then(function (data) {
                    if (!data) {
                        retDefer.reject(data);
                        return;
                    }
                    vpcNetworks = data;
                    retDefer.resolve();
                });
                return retDefer.promise();
            }

            function queryNetworkDetail(networkId) {
                var promise = networkServiceIns.queryNetworkDetail({
                    "networkID": networkId,
                    "vdcId": $scope.user.vdcId,
                    "vpcId": $scope.service.vpcId,
                    "userId": $scope.user.id,
                    "cloudInfraId": $scope.service.cloudInfraId
                });
                promise.then(function (data) {
                    $scope.info.subnetSelect.values = [];
                    if (!data) {
                        return;
                    }
                    var networkInfo = data;
                    var subnets = $scope.info.subnetSelect.values;
                    if (networkInfo.ipv4Subnet) {
                        subnets.push(
                            {
                                "selectId": networkInfo.ipv4Subnet.subnetID,
                                "label": networkInfo.name + (networkInfo.ipv4Subnet.subnetAddr ? "(" + networkInfo.ipv4Subnet.subnetAddr + ")" : "")
                            }
                        );
                    }

                    if (subnets.length > 0) {
                        subnets[0].checked = true;
                    }
                });
            }

            queryNetworksByType();
        }
    ];
    return ctrl;
});
