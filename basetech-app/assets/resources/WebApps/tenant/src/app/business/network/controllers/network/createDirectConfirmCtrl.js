/*global define*/
define(["tiny-lib/jquery",
    'app/services/messageService',
    "app/business/network/services/networkService",
    "fixtures/network/network/networkListFixture",
    "app/business/network/controllers/network/createBasicCtrl"
], function ($, messageService, networkService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$q", "exception",
        function ($scope, camel, $q, exception) {
            var htmlDom = $("html");
            var $state = htmlDom.injector().get("$state");
            var user = htmlDom.scope().user;
            var i18n = $scope.i18n;
            var networkServiceIns = new networkService(exception, $q, camel);

            $scope.name = "";
            $scope.description = "";
            $scope.type = "direct";
            $scope.outNetwork = "";

            var vlan = "";
            $scope.confirmInfo = {
                name: {
                    label: i18n.common_term_name_label + ":",
                    require: true
                },
                description: {
                    label: i18n.common_term_desc_label + ":",
                    "type": "multi"
                },
                type: {
                    label: i18n.common_term_type_label + ":"
                },
                outNetwork: {
                    label: i18n.resource_term_externalNet_label + ":"
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
                    label: i18n.resource_term_vlanID_label + ":"
                },
                availableIPRanges: {
                    label: i18n.common_term_enableIPsegment_label
                },
                dhcpOption: {
                    label: i18n.vpc_term_DHCPoption_label
                },
                preBtn: {
                    "id": "create-network-confirm-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        if ($scope.service.networkType === "0") {
                            $scope.service.show = "selectRes";
                            $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpc_term_setNet_button, i18n.common_term_confirmInfo_label];
                        } else {
                            if ($scope.service.isSubnetSelected) {
                                $scope.service.show = "subnetInfo";
                                $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpc_term_chooseVLAN_label, i18n.vpc_term_setSubnet_label, i18n.common_term_confirmInfo_label];
                            } else {
                                $scope.service.show = "selectRes";
                                $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpc_term_chooseVLAN_label, i18n.common_term_confirmInfo_label];
                            }
                        }

                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                createBtn: {
                    "id": "create-network-confirm-create",
                    "text": i18n.common_term_create_button,
                    "click": function () {
                        var subnet = null;
                        if ($scope.service.networkType !== "0" && $scope.service.isSubnetSelected) {
                            subnet = {
                                "ipAllocatePolicy": $scope.service.iPTypeValue, //ip分配方式
                                "subnetAddr": $scope.service.subnetAddr,
                                "subnetPrefix": $scope.service.subnetPrefix,
                                "gateway": $scope.service.geteway,
                                "availableIPRanges": [],
                                "dhcpOption": {
                                    "domainName": $scope.service.domainName,
                                    "primaryDNS": $scope.service.primaryDNS,
                                    "secondaryDNS": $scope.service.secondaryDNS,
                                    "primaryWINS": $scope.service.primaryWINS,
                                    "secondaryWINS": $scope.service.secondaryWINS
                                }
                            };
                            if ($scope.service.availableIPRanges && ("" !== $scope.service.availableIPRanges)) {
                                subnet.availableIPRanges = $scope.service.availableIPRanges;
                            }
                        }
                        var param = {
                            "vpcID": $scope.service.vpcId,
                            "azID": $scope.service.azId,
                            "name": $scope.service.name,
                            "vlan": $scope.service.vlan,
                            "dirctNetwork": $scope.service.networkType === "0",
                            "routed": $scope.service.networkType === "2",
                            "description": $scope.service.description,
                            "subnet": subnet,
                            "portSetting": null,
                            "extNetworkId": $scope.service.extNetworkId //直连网络(必填)
                        };
                        var options = {
                            vdcId: user.vdcId,
                            cloudInfraId: $scope.service.cloudInfraId,
                            userId: user.id,
                            vpcId: $scope.service.vpcId,
                            params: param
                        };
                        var promise = networkServiceIns.createNetwork(options);
                        promise.then(function () {
                            $state.go("network.vpcmanager.network");
                        });
                    }
                },
                cancelBtn: {
                    "id": "create-network-confirm-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };
        }
    ];
    return ctrl;
});
