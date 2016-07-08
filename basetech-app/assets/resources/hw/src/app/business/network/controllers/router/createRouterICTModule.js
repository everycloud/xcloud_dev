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
    "tiny-lib/underscore",
    "tiny-common/UnifyValid",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/Radio",
    "fixtures/network/router/routerFixture",
    "fixtures/network/network/createNetworkFixture"
], function (sprintf, $, $encoder, angular, ngSanitize, keyIDI18n, http, exceptionService, routerService, _, UnifyValid) {
    "use strict";
    var createCtrl = ["$scope", "serviceSrv", "$compile",
        function ($scope, serviceSrv, $compile) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;
            $scope.params = $("#createRouterWindow").widget().option("params");
            $scope.page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return $scope.page.currentPage === 0 ? 0 : ($scope.page.currentPage - 1) * $scope.page.displayLength;
                }
            };
            var page = $scope.page;
            //ICT 场景下的分页
            $scope.hasPrePage = false;
            $scope.hasNextPage = false;
            var markers = [];
            $scope.prePage = function () {
                if (!$scope.hasPrePage) {
                    return;
                }
                markers.pop();
                if (markers.length === 0) {
                    $scope.hasPrePage = false;
                }
                page.currentPage--;
                $scope.queryOutNetworks();
            };
            $scope.nextPage = function () {
                if (!$scope.hasNextPage) {
                    return;
                }
                var item = $scope.networkTable.data[page.displayLength - 1] || {};
                markers.push(item.exnetworkID);
                $scope.hasPrePage = true;
                page.currentPage++;
                $scope.queryOutNetworks();
            };
            $scope.pageSize = {
                "id": "createRouterNetworkList-searchSizeSelector",
                "width": "80",
                "values": [
                    {
                        "selectId": "10",
                        "label": "10",
                        "checked": true
                    },
                    {
                        "selectId": "20",
                        "label": "20"
                    },
                    {
                        "selectId": "50",
                        "label": "50"
                    }
                ],
                "change": function () {
                    page.currentPage = 1;
                    page.displayLength = $("#" + $scope.pageSize.id).widget().getSelectedId();
                    markers = [];
                    $scope.hasPrePage = false;
                    $scope.queryOutNetworks();
                }
            };
            $scope.selectedNetwork = null;
            $scope.$watch("selectedNetwork", function (newValue, oldValue) {
                if (newValue) {
                    $scope.info.okBtn.disable = false;
                } else {
                    $scope.info.okBtn.disable = true;
                }
            });

            // 查询外部网络信息
            $scope.queryOutNetworks = function () {
                var length = markers.length;
                var promise = serviceSrv.queryOutNetworks({
                    "vdcId": $scope.params.vdcId, //暂时保留
                    "vpcId": $scope.params.vpcId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "start": markers[length-1] || null,
                    "limit": $scope.page.displayLength
                });
                promise.then(function (data) {
                    $scope.networkTable.totalRecords = data.total;
                    $scope.networkTable.displayLength = $scope.page.displayLength;
                    $("#network-direct-listtable").widget().option("cur-page", {
                        "pageIndex": $scope.page.currentPage
                    });
                    $scope.networkTable.data = data.externalNetworks;
                    $scope.selectedNetwork = null;
                    if (data.externalNetworks.length < page.displayLength) {
                        $scope.hasNextPage = false;
                    }
                    else {
                        $scope.hasNextPage = true;
                    }
                });
            };

            //外部网络列表
            $scope.networkTable = {
                "id": "network-direct-listtable",
                "paginationStyle": "full_numbers",
                "enablePagination": false,
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
                okBtn: {
                    "id": "create-router-info-ok",
                    "text": i18n.common_term_apply_button,
                    "disable": true,
                    "click": function () {
                        var promise = serviceSrv.createRouter({
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "data": {
                                "vpcID": $scope.params.vpcId,
                                "azID": $scope.params.azId,
                                "externalNetworkID": $scope.selectedNetwork.exnetworkID
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

            //查询外部网络列表
            $scope.queryOutNetworks();
        }
    ];
    var createRouter = angular.module("createRouterICT", ["ng", "ngSanitize", "wcc"]);
    createRouter.controller("createICTCtrl", createCtrl);

    createRouter.service("camel", http);
    createRouter.service("exception", exceptionService);
    createRouter.service("serviceSrv", routerService);
    return createRouter;
});
