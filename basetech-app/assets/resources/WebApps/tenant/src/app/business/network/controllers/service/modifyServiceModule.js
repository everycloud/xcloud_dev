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
    "tiny-directives/Searchbox",
    "tiny-directives/FormField",
    "tiny-directives/Button",
    "fixtures/network/network/networkListFixture"
], function (sprintf, $, $encoder, angular, ngSanitize, keyIDI18n, http, exceptionService, Service, NetworkService, _) {
    "use strict";
    var modifyCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;
            // 查询网络时只查询READY状态的网络
            var READY_STATUS = 0;
            var rebuildNetworkWindow = $("#rebuildNetworkWindow");
            $scope.serviceSrv = new Service(exception, $q, camel);
            $scope.networkSrv = new NetworkService();
            $scope.selectedNetworks = []; //t已经选中的网络
            $scope.params = rebuildNetworkWindow.widget().option("params");
            $scope.bindedNetworks = rebuildNetworkWindow.widget().option("bindedNetworks");
            $scope.modifyNetwork = rebuildNetworkWindow.widget().option("modifyNetwork");
            $scope.mode = rebuildNetworkWindow.widget().option("mode");
            $scope.$watch("selectedNetworks", function (newValue, oldValue) {
                if ($scope.selectedNetworks.length > 0) {
                    $scope.info.okBtn.disable = false;
                } else {
                    $scope.info.okBtn.disable = true;
                }
            });
            $scope.close = function () {
                rebuildNetworkWindow.widget().destroy();
            };
            $scope.queryNetworksInVPC = function () {
                var deferred = $scope.serviceSrv.queryNetworksInVPC({
                    "vdcId": $scope.params.vdcId,
                    "vpcId": $scope.params.vpcId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "status": READY_STATUS,
                    "name": $scope.params.searchName || "",
                    "start": 0,
                    "limit": 10000 //系统最大支持600个
                });
                deferred.then(function (data) {
                    //过滤掉已经绑定的网络
                    var filterNetworks = _.filter(data.networks, function (item, index) {
                        var exist = _.find($scope.bindedNetworks, function (bindedItem) {
                            return String(bindedItem.networkId) === String(item.networkID);
                        });
                        if (exist) {
                            return false;
                        }
                        _.extend(item, {
                            "showDetail": false
                        });
                        item.status = $scope.networkSrv.getStatus(item.status);
                        item.networkType = $scope.networkSrv.getNetTypeByCode(item.networkType);
                        item.subnets = $scope.networkSrv.genUiSubnet(item.ipv4Subnet, item.ipv6Subnet);
                        item.ipdiscover = $scope.networkSrv.getAllocateWay((item.ipv4Subnet && item.ipv4Subnet.ipAllocatePolicy) || "");

                        return true;
                    });
                    $scope.info.networkTable.totalRecords = filterNetworks.length;
                    $scope.info.networkTable.data = filterNetworks;
                    $scope.selectedNetworks = [];
                });
            };
            $scope.info = {
                searchBox: {
                    "require": false,
                    "id": "rebuild-deployservice-searchBox",
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
                    "id": "rebuild-deployservice-network-listtable",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
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
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        var selBox = "";
                        if ($scope.mode === "modify") {
                            // 单选框
                            selBox = "<div><tiny-radio name='name' id='id' click='click()'></tiny-radio></div>";
                        } else {
                            selBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox></div>";
                        }
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.name = "nic-name";
                        selBoxScope.data = aData;
                        selBoxScope.id = "network-checkbox" + aData.networkID;
                        selBoxScope.checked = false;
                        selBoxScope.click = function () {
                            $scope.selectedNetworks = [aData];
                        };
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
                    }
                },
                okBtn: {
                    "id": "rebuild-deployservice-info-ok",
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
                        if ($scope.mode === "modify") {
                            if (nicModList.length <= 0) {
                                return;
                            }
                            var modifyNic = nicModList[0];
                            modifyNic.nicId = $scope.modifyNetwork.nicId;
                            modifyNic.operationType = "NIC_MODIFY";
                        }
                        var deferred = $scope.serviceSrv.modifyPVM({
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "userId": $scope.params.userId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "data": {
                                pvmNetworks: nicModList
                            }
                        });
                        deferred.then(function (data) {
                            $scope.close();
                            $("#vpcmanager-service").scope().$emit("createdPVMSuccessEvent");
                        });
                    }
                },
                cancelBtn: {
                    "id": "rebuild-deployservice-info-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            $scope.queryNetworksInVPC();
        }
    ];
    var module = angular.module("serviceModule", ["ng", "wcc"]);
    module.controller("modifyCtrl", modifyCtrl);

    module.service("camel", http);
    module.service("exception", exceptionService);
    return module;
});
