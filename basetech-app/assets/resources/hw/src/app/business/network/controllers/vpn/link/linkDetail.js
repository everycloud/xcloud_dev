/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "language/keyID",
    "app/business/network/services/networkService",
    'app/services/exceptionService',
    "app/services/httpService"
],
    function ($, angular, _, i18n, networkService, exception, http) {
        "use strict";
        var vpnLinkDetailCtrl = ["$scope", "camel", "$q", "exception", function ($scope, camel, $q, exception) {
            var user = $("html").scope().user;
            var isIT = user.cloudType === "IT";
            $scope.isIT = isIT;
            // 公共服务实例
            var networkServiceIns = new networkService(exception, $q, camel);
            $scope.i18n = i18n;
            $scope.info = {
                "dfdAction": i18n.common_term_DPDaction_label + ":",
                "name": {
                    "label": i18n.common_term_name_label + ":"
                },
                "type": {
                    "label": i18n.common_term_type_label + ":"
                },
                "localIPAddr": {
                    "label": i18n.vpn_term_localGatewayIP_label + ":"
                },
                "desc": {
                    "label": i18n.common_term_desc_label + ":"
                },
                "dnAlgorithm": {
                    "label": i18n.vpn_term_DH_label + ":"
                },
                "authentication": {
                    "label": i18n.common_term_authenticationMode_label + ":"
                },
                "certifAlgorithm": {
                    "label": i18n.common_term_authenticArithmetic_label + ":"
                },
                "encryptAlgorithm": {
                    "label": i18n.device_term_encryptArithmetic_label + ":"
                },
                "lifeTime": {
                    "label": i18n.vpn_term_consultationPeriodS_label + ":"
                },
                "gateway": {
                    "label": i18n.vpn_term_remoteGatewayIP_label + ":"
                },
                "dpdInterval": {
                    "label": i18n.vpn_term_DPDretransmitDistance_label + ":"
                },
                "dpdTimeOut": {
                    "label": i18n.vpn_term_DPDtimeout_label + ":"
                },
                "network": {
                    "label": i18n.vpn_term_remoteNetSubnetMask_label + ":"
                },
                "subnetAddr": {
                    "label": i18n.common_term_Subnet_label + ":"
                },
                "subnetMask": {
                    "label": i18n.common_term_SubnetMask_label + ":"
                },
                localTable: {
                    "label": i18n.vpn_term_localUserNet_label + ":",
                    "id": "create-vpn-link-local-listtable",
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false,
                            "bVisible": true
                        },
                        {
                            "sTitle": i18n.vpc_term_netType_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.typeUI);
                            },
                            "bSortable": false,
                            "bVisible": isIT
                        },
                        {
                            "sTitle": i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusUI);
                            },
                            "bSortable": false,
                            "bVisible": true
                        },
                        {
                            "sTitle": "VLAN ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vlan);
                            },
                            "bSortable": false,
                            "bVisible": true
                        },
                        {
                            "sTitle": i18n.common_term_Subnet_label,
                            "mData": function (data) {
                                if (isIT) {
                                    return $.encoder.encodeForHTML(data.ipv4Subnet.subnetAddr);
                                } else {
                                    return "";
                                }
                            },
                            "bSortable": false,
                            "bVisible": isIT
                        },
                        {
                            "sTitle": i18n.common_term_SubnetMask_label,
                            "mData": function (data) {
                                if (isIT) {
                                    return $.encoder.encodeForHTML(data.ipv4Subnet.subnetPrefix);
                                } else {
                                    return "";
                                }
                            },
                            "bSortable": false,
                            "bVisible": isIT
                        },
                        {
                            "sTitle": i18n.common_term_gateway_label,
                            "mData": function (data) {
                                if (isIT) {
                                    return $.encoder.encodeForHTML(data.ipv4Subnet.gateway);
                                } else {
                                    return "";
                                }
                            },
                            "bSortable": false,
                            "bVisible": isIT
                        }
                    ],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        if (isIT) {
                            $("td:eq(3)", nRow).addTitle();
                            $("td:eq(4)", nRow).addTitle();
                            $("td:eq(5)", nRow).addTitle();
                            $("td:eq(6)", nRow).addTitle();
                        }
                    }
                }
            };
            $scope.ipsecpolicy = {
                "transform_protocol": {
                    label: i18n.common_term_transmissionProtocol_label + ":"
                },
                "auth_algorithm": {
                    label: i18n.common_term_authenticArithmetic_label + ":"
                },
                "encryption_algorithm": {
                    label: i18n.device_term_encryptArithmetic_label + ":"
                },
                "pfs": {
                    label: i18n.common_term_perfectForwardSecrecy_label + ":"
                },
                "lifetime": {
                    label: i18n.common_term_lifecycleS_label + ":"
                }
            };
            $scope.ikepolicy = {
                "auth_algorithm": {
                    label: i18n.common_term_authenticArithmetic_label + ":"
                },
                "encryption_algorithm": {
                    label: i18n.device_term_encryptArithmetic_label + ":"
                },
                "pfs": {
                    label: i18n.common_term_perfectForwardSecrecy_label + ":"
                },
                "ike_version": {
                    label: i18n.common_term_version_label + ":"
                },
                "lifetime": {
                    label: i18n.common_term_lifecycleS_label + ":"
                }
            };
            $scope.queryDetail = function (params) {
                var options = {
                    "cloudInfraId": params.cloudInfraId,
                    "vpcId": params.vpcId,
                    "vdcId": params.vdcId,
                    "id": params.vpnConnectionID,
                    "userId": params.userId
                };
                var deferred = networkServiceIns.querySingleVpnConnection(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }

                    $scope.vpnLinkDetail = data;

                    if ($scope.vpnLinkDetail.vpnType + "" !== "0") {
                        return;
                    }
                    // IPSec类型需要显示路由信息
                    var promise = networkServiceIns.queryNetworks({
                        "vdcId": options.vdcId,
                        "cloudInfraId": options.cloudInfraId,
                        "vpcId": options.vpcId,
                        "userId": options.userId,
                        "start": 0,
                        "limit": 100
                    });
                    promise.then(function (resolvedValue) {
                        if (resolvedValue && resolvedValue.networks && resolvedValue.networks.length > 0) {
                            var routeNets = [];
                            _.each(resolvedValue.networks, function (item) {
                                if ((item.networkType === 3 && isIT) || !isIT) {
                                    if (_.find($scope.vpnLinkDetail.networkIDs, function (networkId) {
                                        return networkId === item.networkID;
                                    })) {
                                        _.extend(item, {
                                            "typeUI": i18n.vpc_term_routerNet_label,
                                            "statusUI": networkServiceIns.getStatus(item.status)
                                        });
                                        routeNets.push(item);
                                    }
                                }
                            });
                            $scope.info.localTable.data = routeNets;
                        }
                    });
                });
            };
        }
        ];

        var vpnLinkDetailModel = angular.module("vpnLink.detail", ["ng", "wcc"]);
        vpnLinkDetailModel.controller("vpnLink.detail.ctrl", vpnLinkDetailCtrl);
        vpnLinkDetailModel.service("camel", http);
        vpnLinkDetailModel.service("exception", exception);

        return vpnLinkDetailModel;
    });
