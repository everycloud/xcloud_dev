/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($, angular, Radio, httpService, Exception) {
    "use strict";
    var createVmNicCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#bindNetworkWindow").widget();
            var nic = window.option("nic");
            $scope.vpcId = window.option("vpcId");
            var clusterId = window.option("cluster").clusterIndex;
            var zoneId = window.option("cluster").zoneId;
            var ipv4AllotType = {
                "0": $scope.i18n.resource_term_externalDHCP_label,
                "1": $scope.i18n.common_term_innerDHCP_label,
                "2": $scope.i18n.common_term_manual_label,
                "3": $scope.i18n.vpc_term_staticInjection_label
            };
            var ipv6AllotType = {
                "0": $scope.i18n.resource_term_externalDHCP_label,
                "1": $scope.i18n.common_term_innerDHCP_label,
                "2": $scope.i18n.common_term_manual_label,
                "3": $scope.i18n.vpc_term_staticInjection_label,
                "4":$scope.i18n.resource_exter_add_para_allocationIP_mean_noStatusAuto_label
            };
            //查询信息
            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            //外部网络列表
            $scope.externalTable = {
                "id": "externalNetworkTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "columnsDraggable": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columnSorting": [],
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": 40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "DVS",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.dvsStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_Subnet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subnetStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "VLAN ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlanStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_IPassignMode_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.assignmentMode);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_IPstatistic_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipUsage);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getExternal();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.externalTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.externalTable.displayLength = pageInfo.displayLength;
                    getExternal();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    $('td:eq(5)', nRow).addTitle();
                    $('td:eq(6)', nRow).addTitle();
                    $('td:eq(7)', nRow).addTitle();
                    //单选框
                    var options = {
                        "id": "externalRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#externalRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#externalRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };
            //组织网络列表
            $scope.internalTable = {
                "id": "internalNetworkTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columnSorting": [],
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": 40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_Subnet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subnetStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "VLAN ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlan);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_IPassignMode_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.assignmentMode);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_IPstatistic_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipUsage);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getInternal();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.internalTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.internalTable.displayLength = pageInfo.displayLength;
                    getInternal();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    $('td:eq(5)', nRow).addTitle();
                    $('td:eq(6)', nRow).addTitle();
                    //单选框
                    var options = {
                        "id": "internalRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#internalRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#internalRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };

            //确定按钮
            $scope.okButton = {
                "id": "bindNetworkOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var index = 0;
                    if ($scope.vpcId) {
                        var data = $("#" + $scope.internalTable.id).widget().option("data");
                        while ($("#internalRadio_" + index).widget()) {
                            if ($("#internalRadio_" + index).widget().option("checked")) {
                                if (nic.exnetworkID != data[index].networkID) {
                                    nic.ips = "";
                                    nic.ipv4 = null;
                                    nic.ipv6 = [];
                                    nic.exnetworkID = data[index].networkID;
                                }
                                nic.networkName = data[index].name;
                                nic.ipv4Subnet = data[index].ipv4Subnet;
                                nic.ipv6Subnet = data[index].ipv6Subnet;
                                break;
                            }
                            index++;
                        }
                    }
                    else {
                        var data = $("#" + $scope.externalTable.id).widget().option("data");
                        while ($("#externalRadio_" + index).widget()) {
                            if ($("#externalRadio_" + index).widget().option("checked")) {
                                if (nic.exnetworkID != data[index].exnetworkID) {
                                    nic.ips = "";
                                    nic.ipv4 = null;
                                    nic.ipv6 = [];
                                    nic.exnetworkID = data[index].exnetworkID;
                                }
                                nic.networkName = data[index].name;
                                nic.ipv4Subnet = data[index].ipv4Subnet;
                                nic.ipv6Subnet = data[index].ipv6Subnet;
                                break;
                            }
                            index++;
                        }
                    }
                    window.destroy();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "bindNetworkCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getExternal() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/irm/zone/{zoneid}/external-networks?" +
                            "start={start}&limit={limit}&clusterid={clusterid}&issupervlan={superVlan}&status=READY",
                        o: { zoneid: zoneId, start: searchInfo.start, limit: searchInfo.limit, superVlan: false, clusterid: clusterId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var nets = data && data.externalNetworks || [];
                    for (var i = 0; i < nets.length; i++) {
                        nets[i].type = $scope.i18n.resource_term_externalNet_label;
                        var dvses = nets[i].dvses || [];
                        for (var j = 0; j < dvses.length; j++) {
                            nets[i].dvsStr = nets[i].dvsStr ? nets[i].dvsStr + ";" + dvses[j].name : dvses[j].name;
                        }
                        var vlans = nets[i].vlans || [];
                        for (var j = 0; j < vlans.length; j++) {
                            nets[i].vlanStr = nets[i].vlanStr ? nets[i].vlanStr + ";" + vlans[j] : vlans[j];
                        }
                        if (nets[i].ipv4Subnet) {
                            nets[i].subnetStr = nets[i].ipv4Subnet.subnetAddr;
                            nets[i].assignmentMode = ipv4AllotType[nets[i].ipv4Subnet.ipAllocatePolicy];
                            nets[i].ipUsage = nets[i].ipv4Subnet.usedAddrNum + "/" + nets[i].ipv4Subnet.totalAddrNum;
                        }
                        if (nets[i].ipv6Subnet) {
                            nets[i].subnetStr = nets[i].subnetStr ? nets[i].subnetStr + ";" + nets[i].ipv6Subnet.subnetAddr : nets[i].ipv6Subnet.subnetAddr;
                            nets[i].assignmentMode = nets[i].assignmentMode ? nets[i].assignmentMode + ";" + ipv6AllotType[nets[i].ipv6Subnet.ipAllocatePolicy] : ipv6AllotType[nets[i].ipv6Subnet.ipAllocatePolicy];
                            nets[i].ipUsage = nets[i].ipUsage ? nets[i].ipUsage + ";" + nets[i].ipv6Subnet.usedAddrNum + "/" + nets[i].ipv6Subnet.totalAddrNum : nets[i].ipv6Subnet.usedAddrNum + "/" + nets[i].ipv6Subnet.totalAddrNum;
                        }
                    }
                    $scope.$apply(function () {
                        $scope.externalTable.totalRecords = data.total;
                        $scope.externalTable.data = nets;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getInternal() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/irm/1/vpcs/{vpcId}/networks?start={start}&limit={limit}&clusterid={clusterid}&status=0",
                        o: { vpcId: $scope.vpcId, clusterid: clusterId, start: searchInfo.start, limit: searchInfo.limit}
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var nets = data && data.networks || [];
                    for (var i = 0; i < nets.length; i++) {
                        nets[i].type = nets[i].directNetwork ? $scope.i18n.vpc_term_directConnectNet_label : $scope.i18n.vpc_term_innerNet_label;
                        nets[i].type = nets[i].routed ? $scope.i18n.vpc_term_routerNet_label : nets[i].type;
                        if (nets[i].ipv4Subnet) {
                            nets[i].subnetStr = nets[i].ipv4Subnet.subnetAddr;
                            nets[i].assignmentMode = ipv4AllotType[nets[i].ipv4Subnet.ipAllocatePolicy];
                            nets[i].ipUsage = nets[i].ipv4Subnet.usedAddrNum + "/" + nets[i].ipv4Subnet.totalAddrNum;
                        }
                        if (nets[i].ipv6Subnet) {
                            nets[i].subnetStr = nets[i].subnetStr ? nets[i].subnetStr + ";" + nets[i].ipv6Subnet.subnetAddr : nets[i].ipv6Subnet.subnetAddr;
                            nets[i].assignmentMode = nets[i].assignmentMode ? nets[i].assignmentMode + ";" + ipv6AllotType[nets[i].ipv6Subnet.ipAllocatePolicy] : ipv6AllotType[nets[i].ipv6Subnet.ipAllocatePolicy];
                            nets[i].ipUsage = nets[i].ipUsage ? nets[i].ipUsage + ";" + nets[i].ipv6Subnet.usedAddrNum + "/" + nets[i].ipv6Subnet.totalAddrNum : nets[i].ipv6Subnet.usedAddrNum + "/" + nets[i].ipv6Subnet.totalAddrNum;
                        }
                    }
                    $scope.$apply(function () {
                        $scope.internalTable.totalRecords = data.total;
                        $scope.internalTable.data = nets;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            if ($scope.vpcId) {
                getInternal();
            }
            else {
                getExternal();
            }
        }];

    var createVmNicModule = angular.module("resources.vm.createVmNic", ["ng"]);
    createVmNicModule.service("camel", httpService);
    createVmNicModule.controller("resources.vm.createVmNic.ctrl", createVmNicCtrl);
    return createVmNicModule;
});