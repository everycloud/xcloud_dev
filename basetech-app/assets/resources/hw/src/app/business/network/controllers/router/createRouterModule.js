/*global define*/
define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/encoder",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/network/services/router/routerService",
    "tiny-common/UnifyValid",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/Radio",
    "fixtures/network/router/routerFixture"
], function (sprintf, $, $encoder, angular, ngSanitize, keyIDI18n, http, exceptionService, routerService, UnifyValid) {
    "use strict";
    var createCtrl = ["$scope", "$compile", "serviceSrv",
        function ($scope, $compile, serviceSrv) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;
            $scope.params = $("#createRouterWindow").widget().option("params");
            $scope.disaplayVXLanFlag = false;
            //外部网络分页列表
            $scope.page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return $scope.page.currentPage === 0 ? 0 : ($scope.page.currentPage - 1) * $scope.page.displayLength;
                }
            };
            $scope.selectedNetwork = null;
            $scope.$watch("selectedNetwork", function (newValue, oldValue) {
                if ($scope.values.routerType === 1) {
                    return;
                }
                if (newValue) {
                    $scope.info.okBtn.disable = false;
                } else {
                    $scope.info.okBtn.disable = true;
                }
            });

            $scope.values = {
                "routerType": 1,
                "supportVxlan": false
            };
            $scope.$watch("values.routerType", function (newV, oldV) {
                if (newV === 1) {
                    $scope.disaplayVXLanFlag = false;
                    $scope.selectedNetwork = null;
                    $scope.values.supportVxlan = false;
                } else {
                    $scope.disaplayVXLanFlag = true;
                }
            });
            $scope.setHardwareValue = function () {
                $scope.values.routerType = 1;
                $scope.info.okBtn.disable = false;
            };
            $scope.setSoftwareValue = function () {
                $scope.values.routerType = 2;
                $scope.info.okBtn.disable = true;
                //查询外部网络列表
                $scope.queryOutNetworks();
            };

            // 查询外部网络信息
            $scope.queryOutNetworks = function () {
                var promise = serviceSrv.queryOutNetworks({
                    "vdcId": $scope.params.vdcId, //暂时保留
                    "vpcId": $scope.params.vpcId,
                    "azId": $scope.params.azId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "start": $scope.page.getStart(),
                    "limit": $scope.page.displayLength,
                    "usedbyvxlanrouter": $scope.values.supportVxlan,
                    "isAssociated": true
                });
                promise.then(function (data) {
                    $scope.networkTable.totalRecords = data.total;
                    $scope.networkTable.displayLength = $scope.page.displayLength;
                    $("#network-direct-listtable").widget().option("cur-page", {
                        "pageIndex": $scope.page.currentPage
                    });
                    $scope.networkTable.data = data.externalNetworks;
                    $scope.selectedNetwork = null;
                });
            };

            //外部网络列表
            $scope.networkTable = {
                "id": "network-direct-listtable",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "displayLength": 10,
                "totalRecords": 0,
                "label": i18n.router_term_chooseExterNet_label + ":",
                "require": true,
                "columns": [{
                    "sTitle": "",
                    "mData": "showDetail",
                    "bSortable": false,
                    "sWidth": "40px"
                }, {
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth": "20%"
                }, {
                    "sTitle": i18n.resource_term_vlanID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vlans);
                    },
                    "bSortable": false,
                    "sWidth": "20%"
                }, {
                    "sTitle": i18n.common_term_Subnet_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.subnet);
                    },
                    "bSortable": false,
                    "sWidth": "50%"
                }],
                "data": [],
                "callback": function (evtObj) {
                    $scope.page.currentPage = evtObj.currentPage;
                    $scope.page.displayLength = evtObj.displayLength;
                    $scope.queryOutNetworks();
                },
                "changeSelect": function (evtObj) {
                    $scope.page.currentPage = evtObj.currentPage;
                    $scope.page.displayLength = evtObj.displayLength;
                    $scope.queryOutNetworks();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();

                    var newScope = $scope.$new();
                    //vlan
                    var vlans = "<span>" + $.encoder.encodeForHTML(aData.vlans) + "</span>";
                    var vlansLink = $compile(vlans);
                    var vlansNode = vlansLink(newScope);
                    $("td:eq(2)", nRow).html(vlansNode);

                    //subnet
                    var subnet = "";
                    if (aData.ipv4Subnet && aData.ipv4Subnet.subnetAddr && aData.ipv4Subnet.subnetPrefix) {
                        subnet = "<div><span>IPv4: " + $.encoder.encodeForHTML(aData.ipv4Subnet.subnetAddr) + "/" + $.encoder.encodeForHTML(aData.ipv4Subnet.subnetPrefix) + "</span></div>";
                    }
                    if (aData.ipv6Subnet && aData.ipv6Subnet.subnetAddr && aData.ipv6Subnet.subnetPrefix) {
                        subnet += "<div><span>IPv6: " + $.encoder.encodeForHTML(aData.ipv6Subnet.subnetAddr) + "/" + $.encoder.encodeForHTML(aData.ipv6Subnet.subnetPrefix) + "</span></div>";
                    }
                    var subnetNodeC = $compile(subnet);
                    var subnetNode = subnetNodeC(newScope);
                    $("td:eq(3)", nRow).html(subnetNode);
                    $("td:eq(3)", nRow).addTitle();

                    // 单选按钮
                    var selBox = "<div style='height: 28px'><tiny-radio name='name' click='click()'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    newScope.name = "directListRadioName";
                    newScope.click = function () {
                        $scope.selectedNetwork = aData;
                    };
                    var selBoxNode = selBoxLink(newScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                }
            };

            $scope.info = {
                "routerType": {
                    "label": i18n.common_term_type_label + ":",
                    "require": true,
                    "name": "routerType-radiogroup",
                    "hardware": i18n.router_term_hardRouter_label,
                    "hardwareValue": "1",
                    "software": i18n.router_term_softRouter_label,
                    "softwareValue": "2"
                },
                "supportVxlan": {
                    "id": "create-router-info-supportVxlan",
                    "label": i18n.router_router_view_para_supporVXLAN_label + ":",
                    "require": true,
                    "width": "216px",
                    "values": [{
                        "selectId": "true",
                        "label": i18n.common_term_yes_button
                    }, {
                        "selectId": "false",
                        "label": i18n.common_term_no_label,
                        "checked": true
                    }],
                    "change": function () {
                        var supportVxlan = $("#create-router-info-supportVxlan").widget().getSelectedId();
                        // 获取出来的是String类型 !("false")为false
                        $scope.values.supportVxlan = String(supportVxlan) === "true";
                        $scope.queryOutNetworks();
                    }
                },
                okBtn: {
                    "id": "create-router-info-ok",
                    "text": i18n.common_term_apply_button,
                    "disable": false,
                    "click": function () {
                        var promise = serviceSrv.createRouter({
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "data": {
                                "vpcID": $scope.params.vpcId,
                                "azID": $scope.params.azId,
                                "routerType": $scope.values.routerType,
                                "supportVxlanFlag": $scope.values.supportVxlan,
                                "externalNetworkID": ($scope.selectedNetwork && $scope.selectedNetwork.exnetworkID) || null
                            }
                        });
                        promise.then(function (data) {
                            $scope.close();
                            $("#vpcmanager-router").scope().$emit("createdRouterSuccessEvent");
                        });
                    }
                },
                cancelBtn: {
                    "id": "create-router-info-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };
            $scope.close = function () {
                $("#createRouterWindow").widget().destroy();
            };
        }
    ];
    var createRouter = angular.module("createRouter", ["ng", "ngSanitize", "wcc"]);
    createRouter.controller("createCtrl", createCtrl);

    createRouter.service("camel", http);
    createRouter.service("exception", exceptionService);
    createRouter.service("serviceSrv", routerService);
    return createRouter;
});
