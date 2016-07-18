/*global define*/
define(["tiny-lib/angular",
    "tiny-lib/jquery",
    "app/business/network/services/networkService"
], function (angular, $, networkService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            var i18n = $scope.i18n;
            var $state = $("html").injector().get("$state");

            // 公共服务实例
            var networkServiceIns = new networkService(exception, $q, camel);

            $scope.info = {
                "name": {
                    "label": i18n.common_term_name_label + ":"
                },
                "type": {
                    "label": i18n.common_term_type_label + ":"
                },
                "desc": {
                    "label": i18n.common_term_desc_label + ":"
                },
                "dnAlgorithm": {
                    "label": i18n.vpn_term_DH_label + ":"
                },
                "lifeTime": {
                    "label": i18n.vpn_term_consultationPeriodS_label + ":"
                },
                "gateway": {
                    "label": i18n.vpn_term_remoteGatewayIP_label + ":"
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
                    "id": "create-vpn-link-local-confirmlisttable",
                    "columns": [{
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.vpc_term_netType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.typeUI);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusUI);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": "VLAN ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlan);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_Subnet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipv4Subnet.subnetAddr);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_SubnetMask_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipv4Subnet.subnetPrefix);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_gateway_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipv4Subnet.gateway);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.perform_term_sendBandAvgMbps_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.averageSendBand);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_priority_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.priority);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }]
                },
                preBtn: {
                    "id": "create-link-info-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        if ("1" === $scope.service.vpnType + "") {
                            $scope.service.show = "addUser";
                        } else {
                            $scope.service.show = "ike";
                        }
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                createBtn: {
                    "id": "create-link-info-create",
                    "text": $scope.service.isModifyMode ? i18n.common_term_modify_button : i18n.common_term_create_button,
                    "click": function () {

                        var params = {
                            "vpnType": $scope.service.vpnType,
                            "name": $scope.service.name,
                            "description": $scope.service.description,
                            "ikeSharedKey": $scope.service.ikeSharedKey
                        };

                        // l2TP类型
                        if ($scope.service.vpnType + "" === '0') {
                            params.pfsGroup = $scope.service.pfsGroup;
                            params.lifeTime = $scope.service.lifeTime;
                            params.networkIDs = $scope.service.networkIDs;
                            params.customerGw = $scope.service.customerGw;
                        }
                        if ($scope.service.vpnType + "" === '1') {
                            params.l2tpInfo = $scope.service.l2tpInfo;
                        }

                        var options = {
                            "vdcId": $scope.user.vdcId,
                            "cloudInfraId": $scope.service.cloudInfraId,
                            "vpcId": $scope.service.vpcId,
                            "userId": $scope.user.id,
                            "params": params
                        };

                        if ($scope.service.isModifyMode) {
                            options.id = $scope.service.id;
                            var deffered = networkServiceIns.updateVpnConnection(options);
                            deffered.then(function () {
                                $state.go("network.vpcmanager.vpnlink");
                            });
                        } else {
                            var deffered1 = networkServiceIns.createVpnConnection(options);
                            deffered1.then(function () {
                                $state.go("network.vpcmanager.vpnlink");
                            });
                        }
                    }
                },
                cancelBtn: {
                    "id": "create-link-info-cancel",
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
