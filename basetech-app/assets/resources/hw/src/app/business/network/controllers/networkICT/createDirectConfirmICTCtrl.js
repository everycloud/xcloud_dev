/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/underscore",
    'app/services/messageService',
    "app/business/network/services/networkService",
    "language/keyID",
    "fixtures/network/network/networkListFixture"
], function ($, _, messageService, networkService, i18n) {
    "use strict";

    var ctrl = ["$rootScope", "$scope", "$q", "camel", "exception",
        function ($rootScope, $scope, $q, camel, exception) {
            var htmlDom = $("html");
            var $state = htmlDom.injector().get("$state");
            var user = htmlDom.scope().user;
            $scope.i18n = i18n;
            $scope.name = "";
            $scope.description = "";
            $scope.outNetwork = "";

            var vlan = "";
            var networkIns = new networkService(exception, $q, camel);

            $scope.confirmInfo = {
                name: {
                    label: i18n.common_term_name_label + ":",
                    require: true
                },
                type: {
                    label: i18n.common_term_type_label + ":"
                },
                ipType: {
                    label: i18n.common_term_IPassignMode_label + ":"
                },
                subnetMask: {
                    label: i18n.common_term_SubnetAndMask_label + ":"
                },
                gateway: {
                    label: i18n.common_term_gateway_label + ":"
                },
                vlan: {
                    label: "VLAN/VXLAN" + ":"
                },
                availableIPRanges: {
                    label: i18n.common_term_enableIPsegment_label + ":"
                },
                dhcpOption: {
                    label: i18n.vpc_term_DHCPoption_label + ":"
                },
                physicalNetwork: {
                    label: i18n.resource_term_physiNet_label + ":"
                },

                preBtn: {
                    "id": "create-network-confirm-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        if ($rootScope.isSubChecked) {
                            $scope.step.show = "subnetInfoICT";
                        } else {
                            $scope.step.show = "selectResICT";
                        }
                        $("#" + $scope.step.id).widget().pre();
                    }
                },
                createBtn: {
                    "id": "create-network-confirm-create",
                    "text": $rootScope.isModifyMode ? i18n.common_term_ok_button : i18n.common_term_create_button,
                    "click": function () {

                        var param = {
                            "vpcID": $rootScope.service.vpcId,
                            "azID": $rootScope.service.azId,
                            "name": $("#create-network-basicInfo-name").widget().getValue(),
                            "vlan": $rootScope.service.vlan,
                            "physicalNetwork": $rootScope.service.paraSetting.phyNetwork,
                            "routed": $rootScope.isRouted,
                            "ipv6subnet": null,
                            "subnet": null,
                            "portSetting": null,
                            "extNetworkId": $scope.extNetworkId //直连网络(必填)
                        };

                        //非VLAN创建模式
                        if ($rootScope.selConnectType && ($rootScope.selConnectType !== 'vlan')) {
                            // 勾选了IPV4
                            if ($rootScope.isIpv4Checked && $rootScope.service.subnetAddr && $rootScope.service.subnetAddr !== "") {
                                var subnet = {
                                    "ipAllocatePolicy": $rootScope.service.iPTypeValue, //ip分配方式
                                    "subnetAddr": $rootScope.service.subnetAddr,
                                    "subnetPrefix": $rootScope.service.subnetPrefix,
                                    "availableIPRanges": [],
                                    "dhcpOption": {
                                        "domainName": $rootScope.service.domainName,
                                        "primaryDNS": $rootScope.service.primaryDNS,
                                        "secondaryDNS": $rootScope.service.secondaryDNS,
                                        "primaryWINS": $rootScope.service.primaryWINS,
                                        "secondaryWINS": $rootScope.service.secondaryWINS
                                    }
                                };

                                if($rootScope.service.geteway && $rootScope.service.geteway !== ""){
                                    _.extend(subnet,{
                                        "gateway": $rootScope.service.geteway
                                    });
                                }

                                if ($rootScope.service.availableIPRanges && $rootScope.service.availableIPRanges) {
                                    subnet.availableIPRanges = $rootScope.service.availableIPRanges;
                                }

                                param.subnet = subnet;
                            }
                            // 勾选了IPV6
                            if ($rootScope.isIpv6Checked && $rootScope.service.ipv6subnet.subnetAddr && $rootScope.service.ipv6subnet.subnetAddr !== "") {
                                var ipv6subnet = {
                                    "ipAllocatePolicy": $rootScope.service.ipv6subnet.ipAllocatePolicy, //ip分配方式
                                    "subnetAddr": $rootScope.service.ipv6subnet.subnetAddr,
                                    "subnetPrefix": $rootScope.service.ipv6subnet.subnetPrefix,
                                    "availableIPRanges": [],
                                    "dhcpOption": {
                                        "domainName": $rootScope.service.ipv6subnet.dhcpOption.domainName,
                                        "primaryDNS": $rootScope.service.ipv6subnet.dhcpOption.primaryDNS,
                                        "secondaryDNS": $rootScope.service.ipv6subnet.dhcpOption.secondaryDNS,
                                        "primaryWINS": $rootScope.service.ipv6subnet.dhcpOption.primaryWINS,
                                        "secondaryWINS": $rootScope.service.ipv6subnet.dhcpOption.secondaryWINS
                                    }
                                };
                                if($rootScope.service.ipv6subnet.gateway && $rootScope.service.ipv6subnet.gateway !== ""){
                                    _.extend(ipv6subnet,{
                                        "gateway": $rootScope.service.ipv6subnet.gateway
                                    });
                                }
                                if ($rootScope.service.ipv6subnet.availableIPRanges && $rootScope.service.ipv6subnet.availableIPRanges) {
                                    ipv6subnet.availableIPRanges = $rootScope.service.ipv6subnet.availableIPRanges;
                                }
                                param.ipv6subnet = ipv6subnet;
                            }
                        }

                        // 修改调用修改接口
                        if ($rootScope.isModifyMode) {
                            var options = {
                                "cloudInfraId": $rootScope.service.cloudInfraId,
                                "vdcId": user.vdcId,
                                "userId": user.id,
                                "vpcId": $rootScope.service.vpcId,
                                "networkID": $rootScope.service.networkID,
                                "name": param.name,
                                "subnet": param.subnet,
                                "ipv6subnet": param.ipv6subnet
                            };
                            var promise = networkIns.updateNetwork(options);
                            promise.then(function () {
                                $state.go("network.vpcmanager.ictnetwork");
                            });
                        }
                        // 创建接口
                        else {
                            var options2 = {
                                "cloudInfraId": $rootScope.service.cloudInfraId,
                                "vdcId": user.vdcId,
                                "userId": user.id,
                                "vpcId": $rootScope.service.vpcId,
                                "params": param
                            };

                            var promise2 = networkIns.createNetwork(options2);
                            promise2.then(function () {
                                $state.go("network.vpcmanager.ictnetwork");
                            });
                        }
                    }
                },
                cancelBtn: {
                    "id": "create-network-confirm-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }

            };

            $rootScope.showIPV6 = function () {
                if ($rootScope.isRouted) {
                    $("#divIPv6").hide();
                } else {
                    $("#divIPv6").show();
                }
            };
        }
    ];
    return ctrl;
});
