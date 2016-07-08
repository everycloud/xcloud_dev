/**
 * Created on 14-3-5.
 */
/*global define*/
define([
        "sprintf",
        "tiny-lib/angular",
        "tiny-lib/jquery",
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        "app/services/httpService",
        "app/business/network/services/networkService",
        'app/services/exceptionService',
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "fixtures/network/network/networkListFixture"
    ],
    function (sprintf, angular, $, _, Window, http, networkService, exception, UnifyValid, validatorService, ngSanitize, i18n) {
        "use strict";
        var networkDetailCtrl = ["$scope", "$q", "camel", "exception",
            function ($scope, $q, camel, exception) {
                var validator = new validatorService();
                var networkIns = new networkService(exception, $q, camel);
                i18n.sprintf = sprintf.sprintf;
                $scope.i18n = i18n;
                var $state = $("html").injector().get("$state");
                var user = $("html").scope().user;
                $scope.openstack = user.cloudType === "ICT";
                var tips = i18n.common_term_composition2_valid + i18n .sprintf(i18n.common_term_length_valid, 1, 64);

                var NETWORK_OPERATE = "555002";
                var privilegeList = user.privilegeList;
                $scope.hasNetworkOperateRight = _.contains(privilegeList, NETWORK_OPERATE);

                $scope.isICTVXLAN = false;

                $scope.canModifyNetName = true;

                $scope.networkDetail = {};
                var cloudInfraId = null;

                $scope.info = {
                    name: {
                        label: i18n.common_term_name_label + ":"
                    },
                    description: {
                        label: i18n.common_term_desc_label + ":"
                    },
                    type: {
                        label: i18n.common_term_type_label + ":"
                    },
                    status: {
                        label: i18n.common_term_status_label + ":"
                    },
                    outNetwork: {
                        label: i18n.resource_term_externalNet_label + ":"
                    },
                    ipType: {
                        label: i18n.common_term_IPassignMode_label + ":"
                    },
                    ipTotal: {
                        label: i18n.perform_term_IPstatistic_label + ":"
                    },
                    subnetMask: {
                        label: i18n.common_term_SubnetAndMask_label + ":"
                    },
                    gateway: {
                        label: i18n.common_term_gateway_label + ":"
                    },
                    vlan: {
                        label: "VLAN ID:"
                    },
                    vxlan: {
                        label: "VXLAN ID:"
                    },
                    availableIPRanges: {
                        label: i18n.common_term_enableIPsegment_label
                    },
                    dhcpOption: {
                        label: i18n.vpc_term_DHCPoption_label
                    },
                    phyNetwork: {
                        label: i18n.resource_term_physiNet_label + ":"
                    }
                };

                //名称
                $scope.name = {
                    "textBoxId": "networkDetailNameId",
                    "modifying": false,
                    "validate": "required:" + tips + ";regularCheck(" + validator.name + "):" + tips + ";",
                    "tooltip": tips,
                    "clickModify": function () {
                        $scope.name.modifying = true;
                        setTimeout(function () {
                            $("#networkDetailNameId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.networkDetail.name = $("#networkDetailNameId").widget().getValue();
                        $scope.name.modifying = false;
                        if (UnifyValid.FormValid($("#networkDetailNameId"))) {
                            updateNetwork($scope.networkDetail, cloudInfraId);
                        } else {
                            $scope.name.modifying = true;
                        }
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.networkDetail.name = $("#networkDetailNameId").widget().getValue();
                                if (UnifyValid.FormValid($("#networkDetailNameId"))) {
                                    updateNetwork($scope.networkDetail, cloudInfraId);
                                    $scope.name.modifying = false;
                                } else {
                                    $scope.name.modifying = true;
                                }
                            });
                        }
                        var validName = UnifyValid.FormValid($("#networkDetailNameId"));
                        if (!validName) {
                            return;
                        }
                    }
                };
                //描述
                $scope.description = {
                    "textBoxId": "networkDetailDescriptionId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.description.modifying = true;
                        setTimeout(function () {
                            $("#networkDetailDescriptionId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.networkDetail.description = $("#networkDetailDescriptionId").widget().getValue();
                        $scope.description.modifying = false;
                        //鼠标离开，就把修改的信息更新
                        updateNetwork($scope.networkDetail, cloudInfraId);
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.networkDetail.description = $("#networkDetailDescriptionId").widget().getValue();
                                $scope.description.modifying = false;
                                //鼠标离开，就把修改的信息更新
                                updateNetwork($scope.networkDetail, cloudInfraId);
                            });
                        }
                    }
                };

                $scope.queryDetail = function (networkId, cloudId, vpcId) {
                    cloudInfraId = cloudId;

                    var promise = networkIns.queryNetworkDetail({
                        "cloudInfraId": cloudId,
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "vpcId": vpcId,
                        "networkID": networkId
                    });

                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.networkDetail = data;
                        $scope.networkDetail.statusUI = networkIns.getStatus($scope.networkDetail.status);
                        $scope.networkDetail.netTypeUI = networkIns.getNetTypeByCode($scope.networkDetail.networkType);

                        if ($scope.networkDetail.ipv4Subnet) {
                            $scope.networkDetail.ipv4Subnet.allocTypeUI = networkIns.getAllocateWay($scope.networkDetail.ipv4Subnet.ipAllocatePolicy);
                        }
                        if ($scope.networkDetail.ipv6Subnet) {
                            $scope.networkDetail.ipv6Subnet.allocTypeUI = networkIns.getAllocateWay($scope.networkDetail.ipv6Subnet.ipAllocatePolicy);
                        }
                        if ($scope.openstack) {
                            var ipv4subnet = $scope.networkDetail.ipv4Subnet;
                            var ipv6subnet = $scope.networkDetail.ipv6Subnet;
                            if(ipv4subnet){
                                ipv4subnet.ipTotal = $.encoder.encodeForHTML(ipv4subnet.usedAddrNum) + "/" + $.encoder.encodeForHTML(ipv4subnet.totalAddrNum);
                            }
                            if(ipv6subnet){
                                ipv6subnet.ipTotal = $.encoder.encodeForHTML(ipv6subnet.usedAddrNum) + "/" + $.encoder.encodeForHTML(ipv6subnet.totalAddrNum);
                            }

                            // ICT下的直连网络 不能修改名称
                            $scope.canModifyNetName = ($scope.networkDetail.networkType !== 1);

                            // ICT场景下需要根据id的大小动态的显示VLAN/VXLAN;规则大于等于4096是VXLAN
                            if ($scope.networkDetail.vlan >= 4096) {
                                $scope.isICTVXLAN = true;
                            }
                        }
                    });
                };

                function updateNetwork(networkDetail, cloudInfraId) {
                    var options = {
                        "cloudInfraId": cloudInfraId,
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "vpcId": networkDetail.vpcID,
                        "networkID": networkDetail.networkID,
                        "name": networkDetail.name,
                        "description": networkDetail.description,
                        "subnet": networkDetail.ipv4Subnet,
                        "ipv6subnet": networkDetail.ipv6Subnet
                    };
                    var promise = networkIns.updateNetwork(options);
                    promise.then(function () {
                        if($scope.openstack){
                            $state.go("network.vpcmanager.ictnetwork");
                        }
                        else{
                            $state.go("network.vpcmanager.network");
                        }
                    });
                }
            }
        ];

        var networkDetailModel = angular.module("network.detail", ["ng", "wcc"]);
        networkDetailModel.controller("network.detail.ctrl", networkDetailCtrl);
        networkDetailModel.service("camel", http);
        networkDetailModel.service("exception", exception);

        return networkDetailModel;
    });
