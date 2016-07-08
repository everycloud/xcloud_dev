define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "language/keyID",
    "tiny-widgets/Window",
    "app/business/network/services/networkService",
    "app/business/network/services/publicIP/publicIPService",
    "tiny-lib/underscore",
    "tiny-common/UnifyValid",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/Table",
    "tiny-directives/RadioGroup",
    "tiny-directives/Select"
], function (sprintf, $, encoder, angular, keyIDI18n, Window, networkService, publicIPService, _, UnifyValid) {
    "use strict";
    var createDnatCtrl = ["$scope", "$compile", "$q",
        function ($scope, $compile, $q) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            var camel = $("html").injector().get("camel");
            var exception = $("html").injector().get("exception");
            var networkCommon = $("html").injector().get("networkCommon");
            var user = $("html").scope().user;
            var networkServiceIns = new networkService(exception, $q, camel);

            var createDnatShareParam = $("#dnat_create_winId").widget().option("createDnatShareParam") || {};
            var searchString = "";
            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            // 当前页码信息
            var page4Ip = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            $scope.selDnatType = "byVm";
            $scope.dnat = {
                type: {
                    label: i18n.common_term_apply_button + ":",
                    require: false,
                    "id": "dnatType",
                    "values": [
                        {
                            "key": "byVm",
                            "text": i18n.common_term_vms_label,
                            "checked": true
                        },
                        {
                            "key": "byIp",
                            "text": i18n.common_term_privateIP_label,
                            "checked": false
                        }
                    ]
                },
                network: {
                    label: i18n.common_term_NIC_label + ":",
                    require: false,
                    "id": "dnatNetwork",
                    "dftLabel": "",
                    "width": "135",
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "values": [],
                    "change": function () {
                    }
                },
                protocol: {
                    label: i18n.common_term_protocol_label + ":",
                    require: true,
                    "id": "dnatProtocol",
                    "width": "135",
                    "values": [
                        {
                            "checked": true,
                            "selectId": "TCP",
                            "label": "TCP"
                        },
                        {
                            "selectId": "UDP",
                            "label": "UDP"
                        }
                    ],
                    "change": function () {
                    }
                },
                publicIP: {
                    label: i18n.vpc_term_publicIP_label + ":",
                    require: false,
                    "id": "pulbicIPId",
                    "width": "135",
                    "height": "150",
                    "values": [],
                    "change": function () {
                    }
                },
                port: {
                    label: i18n.common_term_privatePort_label + ":",
                    require: true,
                    "id": "createDnatPrivatePort",
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535) +";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535) +";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535) +";"
                },
                publicPort: {
                    label: i18n.nat_term_publicNetPort_label + ":",
                    require: true,
                    "id": "createDnatPublicPort",
                    "validate": createDnatShareParam.dnatValidate
                },
                vmName: {
                    label: i18n.common_term_vms_label + ":",
                    require: false,
                    "id": "dnatVm"
                },
                ip: {
                    label: i18n.common_term_privateIP_label + ":",
                    require: false,
                    "id": "dnatIp"
                }
            };

            //创建确定按钮
            $scope.createOkBtn = {
                "id": "OK",
                "text": i18n.common_term_apply_button,
                "click": function () {
                    var valid = UnifyValid.FormValid($(".network_create_dnat"));
                    if (!valid) {
                        return;
                    }
                    createDnat();
                }
            };

            //创建取消按钮
            $scope.createCancelBtn = {
                "id": "OK",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#dnat_create_winId").widget().destroy();
                }
            };

            $scope.selVmData = null;
            $scope.selPrivateIpData = null;

            $scope.setValue = function () {
                $scope.selDnatType = $("#" + $scope.dnat.type.id).widget().opChecked("checked");
                if ($scope.selDnatType === "byVm") {
                    queryVms();
                } else {
                    queryPrivateIps();
                }
            };
            $scope.checkboxData = [];

            // 存储当前点击展开的详情
            $scope.currentItem = undefined;

            $scope.searchBox = {
                "id": "networkDnatVmsSearchBox",
                "placeholder": i18n.nat_term_findNameOrIP_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (content) {
                    searchString = content;
                    page.currentPage = 1;
                    queryVms();
                }
            };

            $scope.vmRefresh = {
                "id": "ecsVmsRefresh",
                "click": function () {
                    queryVms();
                }
            };

            $scope.vmDnatListTable = {
                "id": "vmDnat-list-table",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "enablePagination": true,
                "displayLength": 10,
                "totalRecords": 0,
                "showDetails": false,
                "draggable": true,
                "columns": [
                    {
                        "sTitle": "", //设置第一列的标题
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "5%"
                    },
                    {
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_ID_label,
                        "sWidth": "8%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.visibleId);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "IP",
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "MAC",
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.mac);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_status_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusValue);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.vm_term_vmType_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    }
                ],
                "data": null,
                "columnVisibility": {
                    "activate": "click", 
                    "aiExclude": [0, 4],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {
                    }
                },
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryVms();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryVms();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();

                    var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.id = "vmLstCheckboxId" + iDataIndex;
                    selBoxScope.name = "vmLst4DnatCheckName";
                    selBoxScope.checked = aData.checked;
                    selBoxScope.value = aData.id;
                    selBoxScope.change = function () {
                        $scope.selVmData = aData;
                        //清空已选中,去残留数据
                        $("#" + $scope.dnat.network.id).widget().opChecked();
                        updateAvailableNics($scope.selVmData.id);
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).append(selBoxNode);
                }
            };

            //按对象列表
            $scope.ipDnatListTable = {
                "id": "ipdnat-alarmList-table",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "showDetails": false,
                "draggable": true,
                "columns": [
                    {
                        "sTitle": "", //设置第一列的标题
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "5%"
                    },
                    {
                        "sTitle": "IP",
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_desc_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.desc);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.vpc_term_routerNet_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.net);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_assignTime_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.time);
                        },
                        "bSortable": false
                    }
                ],
                "data": null,
                "columnVisibility": {
                    "activate": "click", 
                    "aiExclude": [0, 4],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {
                    }
                },

                "callback": function (evtObj) {
                },

                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();

                    var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.id = "ipListCheckboxId" + iDataIndex;
                    selBoxScope.name = "ipList4DnatCheckName";
                    selBoxScope.value = aData.id;
                    selBoxScope.checked = aData.checked;
                    selBoxScope.change = function () {
                        $scope.selPrivateIpData = aData;
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).append(selBoxNode);
                }
            };

            function updateAvailableNics(vmId) {
                $scope.dnat.network.values = [];
                var defer = networkServiceIns.queryVmDetail({
                    "user": user,
                    "vmId": vmId,
                    "vpcId": createDnatShareParam.vpcId,
                    "cloudInfraId": createDnatShareParam.cloudInfraId
                });
                defer.then(function (data) {
                    if (!data || !data.vm) {
                        return;
                    }

                    if (!data.vm.nics || (data.vm.nics.length <= 0)) {
                        $scope.dnat.network.values = [];
                    } else {
                        var availableNics = [];
                        _.each(data.vm.nics, function (item, index) {
                            availableNics.push({
                                "selectId": item.nicId,
                                "label": item.name
                            });
                        });
                        $scope.dnat.network.values = availableNics;
                    }
                });
            }

            function queryVms() {
                var params = {
                    "user": user,
                    "start": page.getStart(),
                    "displayLength": page.displayLength,
                    "cloudInfraId": createDnatShareParam.cloudInfraId,
                    "vpcId": createDnatShareParam.vpcId,
                    "searchString": searchString,
                    "networkType": "ROUTED_NETWORK"
                };
                var defered = networkServiceIns.queryVmByVpc(params);
                defered.then(function (data) {
                    if (!data) {
                        return;
                    }

                    if (!data.list || !data.list.vms || (data.list.vms.length === 0)) {
                        $scope.vmDnatListTable.data = [];
                        $scope.vmDnatListTable.displayLength = page.displayLength;
                        $scope.vmDnatListTable.totalRecords = 0;
                        return;
                    }

                    var vmsNicData = [];
                    var tmp;
                    var tmpIps = null;
                    _.each(data.list.vms, function (item, index) {
                        tmp = {};
                        tmp.id = item.id;
                        tmp.showDetail = "";
                        tmp.name = item.name;
                        tmp.visibleId = item.visiableId;
                        tmp.nics = item.vmSpecInfo && item.vmSpecInfo.nics;
                        tmpIps = getCombinedIpAndMac(tmp.nics);
                        tmp.ip = tmpIps.ip;
                        tmp.mac = tmpIps.mac;
                        tmp.description = "";
                        tmp.status = item.status;
                        tmp.statusValue = networkCommon.getStatusStr(item.status);
                        tmp.type = item.type;
                        vmsNicData.push(tmp);
                    });

                    $scope.vmDnatListTable.displayLength = page.displayLength;
                    $scope.vmDnatListTable.totalRecords = data.list.total;
                    $scope.vmDnatListTable.data = vmsNicData;
                });
            }

            function getCombinedIpAndMac(nics) {
                if (!nics || (nics.length === 0)) {
                    return {
                        "ip": "",
                        "mac": ""
                    };
                }
                var ips = "";
                var macs = "";
                _.each(nics, function (item, index) {
                    ips += (item.ip ? item.ip : "");
                    ips += ";";
                    macs += (item.mac ? item.mac : "");
                    macs += ";";
                });
                var lastIpSeperator = ips.lastIndexOf(";");
                if (lastIpSeperator >= 0) {
                    ips = ips.substring(0, lastIpSeperator);
                }
                lastIpSeperator = macs.lastIndexOf(";");
                if (lastIpSeperator >= 0) {
                    macs = macs.substring(0, lastIpSeperator);
                }
                return {
                    "ip": ips,
                    "mac": macs
                };
            }

            function createDnat() {
                var params;
                if ($scope.selDnatType === "byVm") {
                    params = {
                        "vmID": $scope.selVmData.id,
                        "nicID": $("#" + $scope.dnat.network.id).widget().getSelectedId(),
                        "privateIP": "",
                        "networkID": "",
                        "privatePort": $("#" + $scope.dnat.port.id).widget().getValue(),
                        "publicPort": $("#" + $scope.dnat.publicPort.id).widget().getValue(),
                        "protocol": $("#" + $scope.dnat.protocol.id).widget().getSelectedId(),
                        "publicIP" : $("#" + $scope.dnat.publicIP.id).widget().getSelectedId(),
                        "user": user,
                        "cloudInfraId": createDnatShareParam.cloudInfraId,
                        "vpcId": createDnatShareParam.vpcId
                    };
                } else {
                    params = {
                        "vmID": "",
                        "nicID": "",
                        "privateIP": $scope.selPrivateIpData.ip,
                        "networkID": $scope.selPrivateIpData.networkID,
                        "privatePort": $("#" + $scope.dnat.port.id).widget().getValue(),
                        "publicPort": $("#" + $scope.dnat.publicPort.id).widget().getValue(),
                        "protocol": $("#" + $scope.dnat.protocol.id).widget().getSelectedId(),
                        "publicIP" : $("#" + $scope.dnat.publicIP.id).widget().getSelectedId(),
                        "user": user,
                        "cloudInfraId": createDnatShareParam.cloudInfraId,
                        "vpcId": createDnatShareParam.vpcId
                    };
                }

                var defered = networkServiceIns.createDnat(params);
                defered.then(function (data) {
                    createDnatShareParam.needRefresh = true;
                    $("#dnat_create_winId").widget().destroy();
                });
            }

            function queryPrivateIps() {
                var params = {
                    "vdcId": user.vdcId,
                    "userId": user.id,
                    "vpcId": createDnatShareParam.vpcId,
                    "start": page4Ip.getStart(),
                    "limit": page4Ip.displayLength,
                    "cloudInfraId": createDnatShareParam.cloudInfraId,
                    "routable": true,
                    "networkID": "",
                    "privateIP": "",
                    "allocateType": "MANUAL"
                };
                var defered = networkServiceIns.queryPrivateIP(params);
                defered.then(function (data) {
                    if (!data) {
                        return;
                    }
                    if (!data.privateIPs || (data.privateIPs.length <= 0)) {
                        $scope.ipDnatListTable.data = [];
                        return;
                    }
                    var availabelIps = [];
                    var tmp;
                    _.each(data.privateIPs, function (item, index) {
                        tmp = {};
                        tmp.showDetail = "";
                        tmp.ip = item.ip;
                        tmp.desc = item.description;
                        tmp.net = item.networkName;
                        tmp.time = item.allocateTime;
                        tmp.networkID = item.networkID;
                        availabelIps.push(tmp);
                    });
                    $scope.ipDnatListTable.data = availabelIps;
                });
            }
            function queryPublicIPs () {
                var options = {
                    "cloudInfraId": createDnatShareParam.cloudInfraId,
                    "vpcId": createDnatShareParam.vpcId,
                    "vdcId": user.vdcId,
                    "usedType": "DNAT"
                };
                var deferred = publicIPService.publicIP.queryList(options,
                    function (data) {
                        if (!data) {
                            return;
                        }
                        var publicIPRes = data.publicIPs;
                        var selArray = [];
                        _.each(publicIPRes, function (item, index) {
                            selArray.push({
                                "selectId": item.ip,
                                "label": item.ip
                            });
                        });
                        if (selArray.length > 0) {
                            selArray[0].checked = true;
                        }
                        $scope.dnat.publicIP.values = selArray;
                        $scope.$digest();
                    }
                );
            }

            queryVms();
            queryPublicIPs();
        }
    ];

    var createDnatApp = angular.module("network.dnat.create", ["ng", "wcc"]);
    createDnatApp.controller("network.dnat.create.ctrl", createDnatCtrl);
    return createDnatApp;
});
