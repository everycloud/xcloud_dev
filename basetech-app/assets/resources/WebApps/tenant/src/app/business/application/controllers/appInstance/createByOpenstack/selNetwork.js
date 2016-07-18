/*global define*/
define([
    'sprintf',
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "tiny-widgets/Window",
    "tiny-lib/underscore",
    "tiny-common/UnifyValid",
    'app/business/network/services/networkService',
    "tiny-directives/Button",
    "tiny-directives/Select",
    "fixtures/appFixture"
],
    function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, http, Window, _, UnifyValid, networkService) {
        "use strict";
        var configParamCtrl = ["$scope", "$compile", "camel", "exception", "appCommonData", "$q",
            function ($scope, $compile, camel, exception, appCommonData, $q) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var networkServiceIns = new networkService(exception, $q, camel);
                $scope.ictNetworkType = "VPCNET";    // ICT场景需要区分VPC网络和直连网络
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.page = page;
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
                    getNetworkData();
                };
                $scope.nextPage = function () {
                    if (!$scope.hasNextPage) {
                        return;
                    }
                    var item = $scope.networkTable.data[page.displayLength - 1] || {};
                    markers.push(item.networkID);
                    $scope.hasPrePage = true;
                    page.currentPage++;
                    getNetworkData();
                };
                $scope.pageSize = {
                    "id": "addnic-networkList-searchSizeSelector",
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
                        getNetworkData();
                    }
                };
                $scope.resPoolId = $("#createByOpenstack_configParamWin").widget().option("resPoolId");
                $scope.vpcId = $("#createByOpenstack_configParamWin").widget().option("vpcId");
                $scope.vpcName = $("#createByOpenstack_configParamWin").widget().option("vpcName");
                $scope.curParamTableData = $("#createByOpenstack_configParamWin").widget().option("curParamTableData");

                // ict场景 需要根据网络类型过滤网络
                $scope.ictNetType = {
                    "label": i18n.vpc_term_netType_label + ":",
                    "id": "create-app-ictNetType",
                    "require": true,
                    "width": 220,
                    "values": [
                        {
                            "selectId": "VPCNET",
                            "label": "VPC" + ($("html").scope().urlParams.lang === "en" ? " " : "") + $scope.i18n.vpc_term_net_label,
                            "checked": true
                        },
                        {
                            "selectId": "EXTERNAL",
                            "label": i18n.vpc_term_directConnectNet_label
                        }
                    ],
                    "change": function () {
                        $scope.ictNetworkType = $("#" + $scope.ictNetType.id).widget().getSelectedId();
                        page.currentPage = 1;
                        page.displayLength = $("#" + $scope.pageSize.id).widget().getSelectedId();
                        markers = [];
                        $scope.hasPrePage = false;
                        getNetworkData();
                    }
                };

                $scope.subnetSelect = {
                    "label": i18n.common_term_Subnet_label + ":",
                    "id": "create-app-subnetselect",
                    "require": true,
                    "values": []
                };

                $scope.selNetwork = null;
                $scope.networkTable = {
                    "id": "create-app-networkTable",
                    "label": i18n.vpc_term_nets_label,
                    "enablePagination": false,
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": [
                        {
                            "sTitle": "",
                            "sWidth": "30px",
                            "bSortable": false,
                            "bSearchable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.networkID);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_name_label,
                            "sWidth": "20%",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            }
                        },
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.networkID);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": "VLAN",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vlan);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusUI);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }
                    ],
                    "data": null,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' click='radioClick()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "appCreateAppChooseNetworkRadio";
                        selBoxScope.id = "appCreateAppChooseNetworkRadio" + iDataIndex;
                        selBoxScope.value = aData.id;
                        selBoxScope.radioClick = function () {
                            queryNetworkDetail(aData.networkID);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).html(selBoxNode);
                        $('td:eq(1)', nRow).addTitle();
                        $('td:eq(2)', nRow).addTitle();
                        $('td:eq(3)', nRow).addTitle();
                        $('td:eq(4)', nRow).addTitle();
                        $('td:eq(5)', nRow).addTitle();
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getNetworkData();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getNetworkData();
                    }
                };

                $scope.nextBtn = {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        $scope.curParamTableData.value = $("#create-app-subnetselect").widget().getSelectedLabel();
                        $scope.curParamTableData.selectId = $("#create-app-subnetselect").widget().getSelectedId();
                        $("#createByOpenstack_configParamWin").widget().destroy();
                    }
                };

                $scope.cancelBtn = {
                    "id": "createApp-baseInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createByOpenstack_configParamWin").widget().destroy();
                    }
                };

                function getNetworkData() {
                    var length = markers.length;
                    var options = {
                        "vdcId": user.vdcId,
                        "vpcId": $scope.vpcId,
                        "userId": user.id,
                        "cloudInfraId": $scope.resPoolId,
                        "start": markers[length - 1] || null,
                        "limit": page.displayLength
                    };
                    if ($scope.ictNetworkType === "VPCNET") {
                        var deferred = networkServiceIns.queryNetworks(options);
                        deferred.then(function (data) {
                            $scope.subnetSelect.values = [];
                            if (!data || !data.networks) {
                                return;
                            }
                            var subnets = [];
                            var tmpSubnet = null;
                            _.each(data.networks, function (item) {
                                item.statusUI = networkServiceIns.getStatus(item.status);
                            });

                            $scope.networkTable.data = data.networks;
                            $scope.networkTable.totalRecords = data.total;
                            $scope.networkTable.displayLength = page.displayLength;
                            $("#" + $scope.networkTable.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                            if ($scope.networkTable.data.length < page.displayLength) {
                                $scope.hasNextPage = false;
                            }
                            else {
                                $scope.hasNextPage = true;
                            }
                        });
                    }
                    else {
                        var promise = networkServiceIns.queryOutNetworks({
                            "isAssociated": true,
                            "vdcId": user.vdcId,
                            "vpcId": $scope.vpcId,
                            "userId": user.id,
                            "cloudInfraId": $scope.resPoolId,
                            "start": markers[length - 1] || null,
                            "limit": page.displayLength
                        });
                        promise.then(function (data) {
                            $scope.subnetSelect.values = [];
                            if (!data || !data.externalNetworks) {
                                return;
                            }
                            _.each(data.externalNetworks, function (item, index) {
                                item.networkID = item.exnetworkID;
                                item.vlan = item.vlans;
                                item.statusUI = networkServiceIns.getExternalNetworkStatus(item.status);
                            });

                            $scope.networkTable.data = data.externalNetworks;
                            $scope.networkTable.totalRecords = data.total;
                            $scope.networkTable.displayLength = page.displayLength;
                            $("#" + $scope.networkTable.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                            if ($scope.networkTable.data.length < page.displayLength) {
                                $scope.hasNextPage = false;
                            }
                            else {
                                $scope.hasNextPage = true;
                            }
                        });
                    }
                }

                function queryNetworkDetail(networkId) {
                    var promise = networkServiceIns.queryNetworkDetail({
                        "networkID": networkId,
                        "vdcId": user.vdcId,
                        "vpcId": $scope.vpcId,
                        "userId": user.id,
                        "cloudInfraId": $scope.resPoolId
                    });
                    promise.then(function (data) {
                        $scope.subnetSelect.values = [];
                        if (!data) {
                            return;
                        }
                        var networkInfo = data;
                        var subnets = $scope.subnetSelect.values;
                        if (networkInfo.ipv4Subnet) {
                            subnets.push(
                                {
                                    "selectId": networkInfo.ipv4Subnet.subnetID,
                                    "label": networkInfo.ipv4Subnet.subnetAddr + "/" + networkInfo.ipv4Subnet.subnetPrefix
                                }
                            );
                        }
                        if (networkInfo.ipv6Subnet) {
                            subnets.push(
                                {
                                    "selectId": networkInfo.ipv6Subnet.subnetID,
                                    "label": networkInfo.ipv6Subnet.subnetAddr + "/" + networkInfo.ipv6Subnet.subnetPrefix
                                }
                            );
                        }

                        if (subnets.length > 0) {
                            subnets[0].checked = true;
                        }
                    });
                }

                getNetworkData();
            }
        ];
        var selImageModule = angular.module("app.createByOpenstack.selNetwork", ['framework', 'ngSanitize']);
        selImageModule.controller("app.createByOpenstack.selNetwork.ctrl", configParamCtrl);
        selImageModule.service("camel", http);

        return selImageModule;
    });
