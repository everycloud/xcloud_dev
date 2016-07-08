/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/exceptionService",
    "app/business/network/services/vpn/gateway/gatewayService",
    "app/business/network/services/router/routerService",
    "app/services/messageService",
    "tiny-widgets/Window",
    "tiny-lib/underscore",
    "fixtures/network/vpn/gateway/gatewayFixture"
],
    function ($, angular, exception, gatewayService, routerService, MessageService, Window, _) {
        "use strict";
        var ctrl = ["$scope", "$compile", "$q", "camel", "networkCommon", "exception",
            function ($scope, $compile, $q, camel, networkCommon, exception) {
                var $state = $("html").injector().get("$state");
                var i18n = $scope.i18n;
                // 公共服务实例
                var gatewayServiceIns = new gatewayService(exception, $q, camel);
                var HARDWARE_ROUTER = 1;
                var routerServiceIns = new routerService(exception, $q, camel);
                $scope.help = {
                    "helpKey": "drawer_vpn_gw",
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };

                $scope.params = {
                    "cloudInfraId": networkCommon && networkCommon.cloudInfraId,
                    "vpcId": networkCommon && networkCommon.vpcId,
                    "azId": networkCommon && networkCommon.azId,
                    "gid": "",
                    "userId": $scope.user.id,
                    "vdcId": $scope.user.vdcId,
                    "isHardwareRouter": false
                };
                //鉴权
                var VPN_GATEWAY_OPERATE = "561002";
                var privilegeList = $("html").scope().user.privilegeList;
                $scope.hasVpnGatewayOperateRight = _.contains(privilegeList, VPN_GATEWAY_OPERATE);

                $scope.url = {
                    navigate: "../src/app/business/network/views/vpn/gateway/navigate.html",
                    detail: "../src/app/business/network/views/vpn/gateway/detailGateway.html"
                };
                $scope.create = function () {
                    var options = {
                        "winId": "createGatewayWindowId",
                        "params": $scope.params,
                        title: i18n.common_term_create_button,
                        height: "800px",
                        width: "700px",
                        "content-type": "url",
                        "content": "app/business/network/views/vpn/gateway/createGateway.html",
                        "buttons": null
                    };
                    var win = new Window(options);
                    win.show();
                };

                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "value": ""
                };
                $scope.id = {
                    "label": "ID:",
                    "value": ""
                };
                $scope.elasticIp = {
                    "label": i18n.eip_term_eip_label + ":",
                    "value": ""
                };
                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "value": ""
                };
                $scope.info = {
                    "dnAlgorithm": {
                        "label": i18n.vpn_term_DH_label + ":",
                        "value": ""
                    },
                    "authentication": {
                        "label": i18n.common_term_authenticationMode_label + ":",
                        "value": ""
                    },
                    "certifAlgorithm": {
                        "label": i18n.common_term_authenticArithmetic_label + ":",
                        "value": ""
                    },
                    "encryptAlgorithm": {
                        "label": i18n.device_term_encryptArithmetic_label + ":",
                        "value": ""
                    },
                    lifeTime: {
                        "label": i18n.vpn_term_consultationPeriodS_label + ":",
                        "value": ""
                    },
                    "dpdInterval": {
                        "label": i18n.vpn_term_DPDretransmitDistance_label + ":",
                        "value": ""
                    },
                    "dpdTimeOut": {
                        "label": i18n.vpn_term_DPDtimeout_label + ":",
                        "value": ""
                    }
                };
                $scope.modiyBtn = {
                    "id": "vpnModiyGatewayBtnId",
                    "text": i18n.vpn_term_modifyCfg_button,
                    "click": function () {
                        $scope.command.queryVpnConnection("MODIFY");
                    }
                };
                $scope.deleteBtn = {
                    "id": "vpnDeleteGatewayBtnId",
                    "text": i18n.common_term_delete_button,
                    "click": function () {
                        $scope.command.queryVpnConnection("DELETE");
                    }
                };
                //VPN网关修改、删除操作
                function vpnGatewayOperate(operationType) {
                    var options = null;
                    if (operationType === "MODIFY") {
                        if ($scope.hasVPNLink) {
                            new MessageService().failMsgBox(i18n.vpn_gateway_modify_info_existConnect_msg);
                            return;
                        }
                        options = {
                            "winId": "modifyGatewayWindowId",
                            "params": $scope.params,
                            title: i18n.common_term_modify_button,
                            height: "800px",
                            width: "700px",
                            "content-type": "url",
                            "content": "app/business/network/views/vpn/gateway/modifyGateway.html",
                            "buttons": null,
                            "close": function () {
                                $scope.command.queryVpnGatewayDetail();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    } else {
                        if ($scope.hasVPNLink) {
                            new MessageService().failMsgBox(i18n.vpn_gateway_del_info_refuseForConnect_msg);
                            return;
                        }
                        options = {
                            "content": i18n.vpn_gateway_del_info_confirm_msg,
                            "callback": function () {
                                $scope.command.deleteVpnGateway();
                            }
                        };
                        new MessageService().confirmMsgBox(options);
                    }
                }

                //ajax命令
                $scope.command = {
                    //查询VPN网关信息
                    "queryVpnGatewayDetail": function () {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId
                        };
                        var deferred = gatewayServiceIns.queryVpnGateway(options);
                        deferred.then(function (data) {
                            if (!data || !data.vpnGws || !data.vpnGws[0].basicInfo) {
                                $scope.hasGateway = false;
                                return;
                            }
                            var vpnGate = data.vpnGws[0];
                            $scope.hasGateway = true;
                            $scope.name.value = vpnGate.basicInfo.name;
                            $scope.id.value = vpnGate.basicInfo.vpnGwId;
                            $scope.elasticIp.value = vpnGate.basicInfo.ipAddr;
                            $scope.description.value = vpnGate.basicInfo.description;
                            $scope.dpdInfo = vpnGate.dpdInfo;
                            $scope.espPublicInfo = vpnGate.espPublicInfo;
                            $scope.ikePublicInfo = vpnGate.ikePublicInfo;
                            $scope.ikePublicInfo.authMethod = i18n.vpn_term_IKEsharePsw_label;
                            $scope.params.gid = vpnGate.basicInfo.vpnGwId;
                        });
                    },
                    //查询VPN网关下是否有VPN链接
                    "queryVpnConnection": function (operationType) {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId
                        };
                        var deferred = gatewayServiceIns.queryVpnConnection(options);
                        deferred.then(function (data) {
                            $scope.hasVPNLink = false;
                            if (!data || !data.vpnConnections || data.vpnConnections.length === 0) {
                                vpnGatewayOperate(operationType);
                                return;
                            }
                            if (data.vpnConnections.length >= 1) {
                                $scope.hasVPNLink = true;
                                vpnGatewayOperate(operationType);
                                return;
                            }
                        });
                    },
                    //删除VPN网关
                    "deleteVpnGateway": function () {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "gid": $scope.params.gid,
                            "userId": $scope.params.userId
                        };
                        var deferred = gatewayServiceIns.deleteVpnGateway(options);
                        deferred.then(function (data) {
                            $scope.hasGateway = false;
                        });
                    }
                };
                $scope.$on("$viewContentLoaded", function () {
                    $scope.command.queryVpnGatewayDetail();
                    getHardwareRouter();
                });
                $scope.$on("createdGatewaySuccessEvent", function listener(event) {
                    $scope.command.queryVpnGatewayDetail();
                    getHardwareRouter();
                });

                //判断是否有硬件路由器，没有的话将“应用层包过滤”过滤掉
                function getHardwareRouter() {
                    var options = {
                        "cloudInfraId": networkCommon.cloudInfraId,
                        "azId": networkCommon.azId,
                        "vpcId": networkCommon.vpcId,
                        "vdcId": $scope.user.vdcId,
                        "userId": $scope.user.id
                    };
                    var deferred = routerServiceIns.queryRouter(options);
                    deferred.then(function (data) {
                        if (data && data.routers && data.routers.length > 0 && data.routers[0].routerType === HARDWARE_ROUTER) {
                            $scope.params.isHardwareRouter = true;
                            return;
                        }
                        $scope.params.isHardwareRouter = false;
                    });
                }
            }
        ];
        return ctrl;
    });
