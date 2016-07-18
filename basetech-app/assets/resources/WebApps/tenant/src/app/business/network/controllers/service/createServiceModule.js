define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/encoder",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/network/services/service/service",
    "app/business/network/services/networkService",
    "tiny-lib/underscore",
    "tiny-directives/Table",
    "tiny-directives/FormField",
    "tiny-directives/Searchbox",
    "tiny-directives/Button",
    "fixtures/network/network/networkListFixture"
], function (sprintf, $, $encoder, angular, ngSanitize, keyIDI18n, http, exceptionService, Service, NetworkService, _) {
    "use strict";
    var createCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;
            // 查询网络时只查询READY状态的网络
            var READY_STATUS = 0;
            var createNetworkWindow = $("#createNetworkWindow");
            $scope.serviceSrv = new Service(exception, $q, camel);
            $scope.networkSrv = new NetworkService();
            $scope.page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return $scope.page.currentPage == 0 ? 0 : ($scope.page.currentPage - 1) * $scope.page.displayLength;
                }
            };
            $scope.selectedNetworks = []; //t已经选中的网络
            $scope.$watch("selectedNetworks", function (newValue, oldValue) {
                if ($scope.selectedNetworks.length > 0) {
                    $scope.info.okBtn.disable = false;
                } else {
                    $scope.info.okBtn.disable = true;
                }
            });
            $scope.close = function () {
                createNetworkWindow.widget().destroy();
            };
            $scope.queryNetworksInVPC = function () {
                $scope.params = createNetworkWindow.widget().option("params");
                var deferred = $scope.serviceSrv.queryNetworksInVPC({
                    "vdcId": $scope.params.vdcId,
                    "vpcId": $scope.params.vpcId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "status": READY_STATUS,
                    "name": $scope.params.searchName || "",
                    "start": $scope.page.getStart(),
                    "limit": $scope.page.displayLength
                });
                deferred.then(function (data) {
                    _.each(data.networks, function (item, index) {
                        _.extend(item, {
                            "showDetail": false
                        });
                        item.status = $scope.networkSrv.getStatus(item.status);
                        item.networkType = $scope.networkSrv.getNetTypeByCode(item.networkType);
                        item.ipdiscover = $scope.networkSrv.getAllocateWay((item.ipv4Subnet && item.ipv4Subnet.ipAllocatePolicy) || "");
                    });
                    $scope.info.networkTable.totalRecords = data.total;
                    $scope.info.networkTable.displayLength = $scope.page.displayLength;
                    $("#create-deployservice-network-listtable").widget().option("cur-page", {
                        "pageIndex": $scope.page.currentPage
                    });
                    $scope.info.networkTable.data = data.networks;
                    $scope.selectedNetworks = [];
                });
            };
            $scope.info = {
                searchBox: {
                    "require": false,
                    "id": "create-deployservice-searchBox",
                    "placeholder": i18n.common_term_findName_prom,
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        $scope.params.searchName = searchString;
                        $scope.queryNetworksInVPC(searchString);
                    }
                },
                networkTable: {
                    "id": "create-deployservice-network-listtable",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": [{
                        "sTitle": "", //设置第一列的标题
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.vpc_term_netType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.networkType);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.resource_term_vlanID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlan);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_Subnet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subnets);
                        },
                        "sWidth": "140px",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.perform_term_bondedNICnum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.totalBoundNics);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_IPassignMode_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipdiscover);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    }],
                    "data": [],
                    "callback": function (evtObj) {
                        $scope.page.currentPage = evtObj.currentPage;
                        $scope.page.displayLength = evtObj.displayLength;
                        $scope.queryNetworksInVPC();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.page.currentPage = evtObj.currentPage;
                        $scope.page.displayLength = evtObj.displayLength;
                        $scope.queryNetworksInVPC();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var selBoxScope = $scope.$new();
                        // 单选框
                        var selBox = "<div><tiny-checkbox text=''id='id' checked='checked' change='change()'></tiny-checkbox></div>";
                        var selBoxLink = $compile(selBox);
                        selBoxScope.data = aData;
                        selBoxScope.id = "network-checkbox" + aData.networkID;
                        selBoxScope.checked = false;
                        selBoxScope.change = function () {
                            //2、部署服务中外部网络只有有一个，而内部网络和直连网络可以选择多个,最多11个
                            var checked = $("#" + selBoxScope.id).widget().option("checked");
                            var selectedNetworks = [];
                            _.each($scope.selectedNetworks, function (item) {
                                selectedNetworks.push(item);
                            });
                            if (checked) {
                                selectedNetworks.push(aData);
                            } else {
                                selectedNetworks = _.reject(selectedNetworks, function (item) {
                                    return item.networkID === aData.networkID;
                                });
                            }
                            $scope.selectedNetworks = selectedNetworks;
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).html(selBoxNode);

                        //subnet
                        var subnet = "";
                        if (aData.ipv4Subnet && aData.ipv4Subnet.subnetAddr && aData.ipv4Subnet.subnetPrefix) {
                            subnet = "<div class='textOverflow'><span>IPv4: " + $.encoder.encodeForHTML(aData.ipv4Subnet.subnetAddr) + "/" + $.encoder.encodeForHTML(aData.ipv4Subnet.subnetPrefix) + "</span></div>";
                        }
                        if (aData.ipv6Subnet && aData.ipv6Subnet.subnetAddr && aData.ipv6Subnet.subnetPrefix) {
                            subnet += "<div class='textOverflow'><span>IPv6: " + $.encoder.encodeForHTML(aData.ipv6Subnet.subnetAddr) + "/" + $.encoder.encodeForHTML(aData.ipv6Subnet.subnetPrefix) + "</span></div>";
                        }
                        var subnetNodeC = $compile(subnet);
                        var subnetNode = subnetNodeC(selBoxScope);
                        $("td:eq(4)", nRow).html(subnetNode);
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                    }
                },
                okBtn: {
                    "id": "create-deployservice-info-ok",
                    "text": i18n.common_term_apply_button,
                    "disable": true,
                    "click": function () {
                        var nicModList = [];
                        _.each($scope.selectedNetworks, function (item) {
                            nicModList.push({
                                "networkId": item.networkID,
                                "operationType": "NIC_ADD"
                            });
                        });
                        var deferred = $scope.serviceSrv.createPVM({
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "data": {
                                "vpcId": $scope.params.vpcId,
                                "availableZoneId": $scope.params.azId,
                                "nicModList": nicModList
                            }
                        });
                        deferred.then(function (data) {
                            $scope.close();
                            $("#vpcmanager-service").scope().$emit("createdPVMSuccessEvent");
                        });
                    }
                },
                cancelBtn: {
                    "id": "create-deployservice-info-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            $scope.queryNetworksInVPC();
        }
    ];
    var createService = angular.module("createService", ["ng", "wcc", "ngSanitize"]);
    createService.controller("createCtrl", createCtrl);

    createService.service("camel", http);
    createService.service("exception", exceptionService);
    return createService;
});
