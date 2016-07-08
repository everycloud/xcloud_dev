/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-lib/encoder",
    "tiny-lib/underscore",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/business/network/services/router/routerService",
    "app/services/messageService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "fixtures/network/router/routerFixture"
], function ($, $encoder, _, angular, Window, Message, RouterService, messageService, UnifyValid, ValidatorService) {
    "use strict";

    var detailCtrl = ["$scope", "camel", "$q", "$compile", "networkCommon", "exception", "message",
        function ($scope, camel, $q, $compile, networkCommon, exception, message) {
            var validator = new ValidatorService();
            var i18n = $scope.i18n;
            //鉴权
            var ROUTER_OPERATE = "558002";
            var privilegeList = $("html").scope().user.privilegeList;
            $scope.hasRouterOperateRight = _.contains(privilegeList, ROUTER_OPERATE);
            $scope.serviceSrv = new RouterService(exception, $q, camel);
            $scope.params = {
                "cloudInfraId": networkCommon.cloudInfraId,
                "vpcId": networkCommon.vpcId,
                "azId": networkCommon.azId,
                "userId": $scope.user.id,
                "vdcId": $scope.user.vdcId
            };
            $scope.isICT = $scope.user.cloudType === "ICT";
            $scope.hasDetail = undefined; //true, false
            $scope.sessionID = undefined; // router PING保存的sessionID
            $scope.showExternalNetworkInfo = false; //是否显示网络详情
            $scope.externalNetworkInfo = undefined;

            //router对象
            $scope.router = null;
            $scope.url = {
                navigate: "../src/app/business/network/views/router/navigate.html",
                detail: "../src/app/business/network/views/router/detail.html"
            };
            $scope.checkPingImage = "../theme/default/images/colspand.png";
            $scope.showPackageSummary = true;
            $scope.showPackageDetail = false;
            $scope.isSoftRouter = false;   //是否是软件路由

            //PING信息的伸展
            $scope.triggerPackageDetail = function () {
                var validParams = UnifyValid.FormValid($("#router-ping-package-param-div"), undefined);
                if (!validParams) {
                    return;
                }
                $scope.showPackageSummary = !$scope.showPackageSummary;
                $scope.showPackageDetail = !$scope.showPackageDetail;
                if ($scope.showPackageSummary) {
                    $scope.checkPingImage = "../theme/default/images/colspand.png";
                    $scope.info.pingNum.value = $("#vpc-router-info-pingNum").widget().getValue();
                    $scope.info.pingSize.value = $("#vpc-router-info-pingSize").widget().getValue();
                } else {
                    $scope.checkPingImage = "../theme/default/images/expand.png";
                }
            };

            $scope.help = {
                "helpKey": "drawer_router",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.create = function () {
                var content = null;
                if ($scope.isICT) {
                    content = "app/business/network/views/router/createRouterICT.html";
                } else {
                    content = "app/business/network/views/router/createRouter.html";
                }
                var options = {
                    "winId": "createRouterWindow",
                    title: i18n.router_term_applyRouter_button,
                    height: "400px",
                    width: "800px",
                    "params": $scope.params,
                    "content-type": "url",
                    "content": content,
                    "buttons": null
                };
                var win = new Window(options);
                win.show();
            };

            $scope.info = {
                name: i18n.common_term_name_label + ":",
                ID: "ID:",
                status: i18n.common_term_status_label + ":",
                type: i18n.common_term_type_label + ":",
                "pingResult": "",
                "supportVXLAN": i18n.router_router_view_para_supporVXLAN_label + ":",
                "externalNetworkID": i18n.resource_term_externalNets_label + ":",
                "ipAddressForSnat": i18n.nat_term_SNATuseIP_label + ":",
                "externalNetworkName": i18n.vpc_term_netName_label + ":",
                "extSubnetAddrAndSubnetPrefixIPV4": "IPV4 " + i18n.common_term_SubnetAndMask_label + ":",
                "externalNetworkGatewayIPV4": "IPV4 " + i18n.common_term_gateway_label + ":",
                "extSubnetAddrAndSubnetPrefixIPV6": "IPV6 " + i18n.common_term_SubnetAndMask_label + ":",
                "externalNetworkGatewayIPV6": "IPV6 " + i18n.common_term_gateway_label + ":",
                "vpcCommunicationIP": i18n.router_term_vpcCommunicationIP_label + ":",
                "resultDiv": {
                    "type": "multi",
                    "height": "165",
                    "width": "480",
                    "disable": true
                },
                openBtn: {
                    "id": "vpc-router-open",
                    "text": i18n.common_term_turnOnSNAT_button,
                    "click": function () {
                        var content = $scope.router.enableSnat ? i18n.router_router_disableSNAT_info_confirm_msg : i18n.router_router_enableSNAT_info_confirm_msg;
                        message.warnMsgBox({
                            "content": content,
                            "callback": function () {
                                $scope.updateRouter("snat", {
                                    "enableSnat": !$scope.router.enableSnat
                                });
                            }
                        });
                    }
                },
                releaseBtn: {
                    "id": "vpc-router-release",
                    "text": i18n.common_term_release_button,
                    "disable": false,
                    "click": function () {
                        message.warnMsgBox({
                            "content": i18n.router_router_release_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceSrv.deleteRouter({
                                    "vdcId": $scope.params.vdcId,
                                    "vpcId": $scope.params.vpcId,
                                    "routerId": $scope.router.routerID,
                                    "userId": $scope.params.userId,
                                    "cloudInfraId": $scope.params.cloudInfraId
                                });
                                deferred.then(function () {
                                    $scope.queryRouter();
                                });
                            }
                        });
                    }
                },
                checkBtn: {
                    "id": "vpc-router-pingCheck",
                    "text": i18n.common_term_detecting_button,
                    "disable": !$scope.hasRouterOperateRight,
                    "click": function () {
                        var validIP = UnifyValid.FormValid($("#router-ping-div"), undefined);
                        if (!validIP) {
                            return;
                        }

                        var validParams = UnifyValid.FormValid($("#router-ping-package-param-div"), undefined);
                        if (!validParams) {
                            return;
                        }

                        var data = {
                            "createReq": {
                                "destinationIp": $("#vpc-router-info-pingIp").widget().getValue(),
                                "packageNum": $("#vpc-router-info-pingNum").widget().getValue(),
                                "paskageSize": $("#vpc-router-info-pingSize").widget().getValue(),
                                "routerID": $scope.router.routerID
                            }
                        };
                        var options = {
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "userId": $scope.params.userId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "data": data
                        };
                        var promise = $scope.serviceSrv.routerPing(options);
                        promise.then(function (resolvedValue) {
                            if (!resolvedValue) {
                                $scope.sessionID = null;
                                return;
                            }
                            $scope.sessionID = resolvedValue.createResp.sessionID;
                            options.data = {
                                "queryReq": {
                                    "sessionID": $scope.sessionID
                                }
                            };
                            var checkPromise = $scope.serviceSrv.routerPing(options);
                            checkPromise.then(function (resolvedValue) {
                                if (!resolvedValue) {
                                    $scope.sessionID = null;
                                    return;
                                }
                                $scope.info.pingResult = resolvedValue.queryResp.pingResult;
                            });
                        });
                    }
                },
                refreshResultBtn: {
                    "id": "vpc-router-pingRefresh",
                    "text": i18n.common_term_freshResult_button,
                    "click": function () {
                        var options = {
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "userId": $scope.params.userId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "data": {
                                "queryReq": {
                                    "sessionID": $scope.sessionID
                                }
                            }
                        };

                        var checkPromise = $scope.serviceSrv.routerPing(options);
                        checkPromise.then(function (resolvedValue) {
                            if (!resolvedValue) {
                                return;
                            }
                            $scope.info.pingResult = resolvedValue.queryResp.pingResult;
                        });
                    }
                },
                routerAddBtn: {
                    "id": "vpc-router-addroute",
                    "text": i18n.common_term_add_button,
                    "disable": false,
                    "click": function () {
                        $scope.params.router = $scope.router;
                        var options = {
                            "winId": "addRouteWindow",
                            "title": i18n.vpc_term_addRouter_button,
                            "height": "250px",
                            "width": "500px",
                            "params": $scope.params,
                            "content-type": "url",
                            "content": "app/business/network/views/router/addRouteWindow.html",
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    }
                },
                targetAddr: {
                    "id": "vpc-router-info-pingIp",
                    "require": true,
                    "type": "ipv4",
                    "extendFunction": ["IPv4Check"],
                    "validate": "required:" + i18n.common_term_null_valid + ";IPv4Check():" + i18n.common_term_formatIP_valid
                },
                pingNum: {
                    "id": "vpc-router-info-pingNum",
                    "label": i18n.router_term_checkPingPacketNum_label + ":",
                    "require": true,
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10) + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10) + ";maxValue(10):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10),
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10),
                    "value": "4"
                },
                pingSize: {
                    "id": "vpc-router-info-pingSize",
                    "label": i18n.router_term_checkPingPacketSize_label + ":",
                    "require": true,
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 4, 1472) + ";minValue(4):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 4, 1472) + ";maxValue(1472):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 4, 1472),
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 4, 1472),
                    "value": "64"
                },

                checkResult: {
                    "id": "vpc-router-info-checkResult",
                    label: i18n.common_term_detectingResult_label + ":",
                    require: false,
                    value: ""
                },

                routerInfoTable: {
                    "id": "create-deployservice-networkInfo-listtable",
                    "columns": [
                        {
                            "sTitle": i18n.common_term_Subnet_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.subnetIp);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_SubnetMask_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.mask);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.vpc_term_routeNextHop_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.nexthop);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "sWidth": "10%",
                            "bSortable": false
                        }
                    ],
                    "data": [],
                    "renderRow": function (nRow, aData) {
                        if (!$scope.hasRouterOperateRight) {
                            return;
                        }
                        // 操作
                        var opt = "<div><a class='btn-link' ng-click='deleter()'>" + i18n.common_term_delete_button + "</a></div>";
                        var optLink = $compile(opt);
                        var optScope = $scope.$new();
                        optScope.deleter = function () {
                            message.warnMsgBox({
                                "content": i18n.router_router_del_info_confirm_msg,
                                "callback": function () {
                                    var routes = _.reject($scope.router.routes, function (item) {
                                        return (item.subnetIp === aData.subnetIp && item.mask === aData.mask && item.nexthop === aData.nexthop);
                                    });
                                    $scope.updateRouter("routes", {
                                        "routes": routes
                                    });
                                }
                            });
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).html(optNode);
                    }
                }
            };

            $scope.refresh = {
                "click": function () {
                    $scope.queryRouter();
                }
            };

            //点击网络ID的时候查看网络详情
            $scope.externalNetworkInfoView = function (externalNetworkInId) {
                if ($scope.showExternalNetworkInfo === true) {
                    $scope.showExternalNetworkInfo = false;
                } else {
                    $scope.showExternalNetworkInfo = true;
                    $scope.queryNetworkById(externalNetworkInId);
                }
            };

            $scope.queryRouter = function () {
                var promise = $scope.serviceSrv.queryRouter({
                    "vdcId": $scope.params.vdcId,
                    "vpcId": $scope.params.vpcId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "azId": $scope.params.azId
                });
                promise.then(function (data) {
                    if (!data || !data.routers || data.routers.length <= 0) {
                        $scope.hasRouter = false;
                        $scope.router = null;
                        $scope.hasDetail = false;
                        return;
                    }
                    $scope.hasRouter = true;
                    $scope.hasDetail = true;
                    $scope.router = data.routers[0];
                    if ($scope.router.routerType === 2) {
                        $scope.isSoftRouter = true;
                    } else {
                        $scope.isSoftRouter = false;
                    }
                    $scope.info.routerInfoTable.data = $scope.router.routes;
                    $scope.router.statusUI = $scope.serviceSrv.transStatus($scope.router.status);
                    //router类型 1:硬件; 2:软件
                    $scope.router.routerTypeUI = $scope.router.routerType === 1 ? i18n.router_term_hardRouter_label : i18n.router_term_softRouter_label;
                    // 创建中，删除中释放按钮置灰
                    if ($scope.router.status === "PENDING" || $scope.router.status === "DELETING") {
                        $scope.info.releaseBtn.disable = true;
                    }else{
                        $scope.info.releaseBtn.disable = false;
                    }
                    $scope.info.openBtn.text = ($scope.router.enableSnat === true ? i18n.vpc_term_shutSNAT_button : i18n.common_term_turnOnSNAT_button);
                    $scope.router.maxTxThroughput = 50;
                });
            };

            $scope.updateRouter = function (type, options) {
                var data = {
                    "externalNetworkID": $scope.router.externalNetworkID
                };
                if ($scope.isICT) {
                    if (type === "snat") {
                        data.enableSnat = options.enableSnat;
                    } else {
                        data.enableSnat = $scope.router.enableSnat;
                        data.routes = options.routes;
                    }
                } else {
                    data.enableSnat = options.enableSnat;
                }
                var promise = $scope.serviceSrv.updateRouter({
                    "vdcId": $scope.params.vdcId,
                    "vpcId": $scope.params.vpcId,
                    "routerId": $scope.router.routerID,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "data": data
                });
                promise.then(function () {
                    $scope.queryRouter();
                });
            };

            //根据外部网络ID查询网络信息
            $scope.queryNetworkById = function (networkId) {
                var promise = $scope.serviceSrv.queryOutNetworkById({
                    "id": networkId,
                    "vdcId": $scope.params.vdcId, //暂时保留
                    "vpcId": $scope.params.vpcId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "start": 0,
                    "limit": 100,
                    "usedbyvxlanrouter": false
                });
                promise.then(function (data) {
                    if (!data) {
                        return;
                    }
                    $scope.externalNetworkInfo = data;
                });
            };
            //校验IPv4是否合法
            UnifyValid.IPv4Check = function () {
                var ip = $(this).val();
                try {
                    var data = ip.split(".");
                    if (data.length === 4) {
                        if (data[0] === "" || data[1] === "" || data[2] === "" || data[3] === "") {
                            return false;
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                catch (e) {
                    return false;
                }
            };

            $scope.$on("createdRouterSuccessEvent", function listener() {
                $scope.queryRouter();
            });
            //当ui-view视图加载成功后的事件
            $scope.$on("$viewContentLoaded", function () {
                $scope.queryRouter();
            });
        }
    ];
    return detailCtrl;
});
