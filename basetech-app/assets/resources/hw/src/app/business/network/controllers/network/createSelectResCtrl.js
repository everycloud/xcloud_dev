/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/network/controllers/network/createBasicCtrl",
    'app/services/messageService',
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    "app/business/network/services/networkService",
    "fixtures/network/network/createNetworkFixture"
], function ($, angular, _, createBasicCtrl, messageService, validatorService, UnifyValid, networkService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$compile", "$q", "exception",
        function ($scope, camel, $compile, $q, exception) {
            var i18n = $scope.i18n;
            var networkServiceIns = new networkService(exception, $q, camel);

            $scope.num = [];
            $scope.outNet = {};
            var ipType = ""; //IP分配方式
            var outNetworkName = ""; //外部网络名称
            var vlanValues = "";

            //外部网络页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            //vlan表格页面对象
            var vlanPage = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return vlanPage.currentPage === 0 ? 0 : (vlanPage.currentPage - 1) * vlanPage.displayLength;
                }
            };
            $scope.typeClick = function (type) {
                //subnet subnetvxlan vlan vxlan
                $scope.service.connectionType = type;
                // 是否选择了子网
                $scope.service.isSubnetSelected = (type.indexOf("subnet") >= 0);
                // vlan、vxlan差异化处理,子网vlan差异化
                getVLANData(type.indexOf("subnet") >= 0, type.indexOf("vxlan") >= 0);
            };
            $scope.info = {
                connectType: {
                    "id": "create-network-connecttype",
                    label: i18n.common_term_linkMode_label + ":",
                    require: true,
                    name: "radiogroup-connecttype",
                    subnet: i18n.vpc_term_SubnetVLAN_label,
                    vlan: "VLAN",
                    subnetvxlan: i18n.vpc_term_SubnetVXLAN_label,
                    vxlan: "VXLAN",
                    subNetRadioId: "subnet-radio-id",
                    subNetVxlanRadioId: "subnetvxlan-radio-id"
                },
                vlanId: {
                    "id": "create-network-vlanId",
                    label: i18n.resource_term_vlanID_label + ":",
                    require: true,
                    value: "",
                    "extendFunction": ["vlanCheck"],
                    validate: "required: " + i18n.common_term_null_valid + ";integer:" + i18n.common_term_PositiveIntegers_valid + "; vlanCheck():" + i18n.resource_term_vlanIDavailable_valid
                },
                preBtn: {
                    "id": "create-network-selectres-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "basicInfo";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-network-selectres-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var vlanIdDom = $("#create-network-vlanId");
                        var vlanIdSelDom = $("#vlanSelect");

                        if (!UnifyValid.FormValid(vlanIdDom, undefined) || !UnifyValid.FormValid(vlanIdSelDom, undefined)) {
                            return;
                        }

                        //保存页面信息
                        if ($scope.service.networkType === "0") {
                            $scope.service.vlan = vlanIdSelDom.widget().getSelectedLabel();
                        } else {
                            $scope.service.vlan = vlanIdDom.widget().getValue();
                        }
                        $scope.service.ipType = ipType;
                        $scope.service.subnetMask = $("#create-network-subnetIp").widget().getValue() + "/" + $("#create-network-subnetMask").widget().getValue();
                        $scope.service.geteway = $("#create-network-gateway").widget().getValue();
                        $scope.service.ouNetworkInfo = outNetworkName;

                        if ($scope.service.networkType === "0") {
                            $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpc_term_setNet_button, i18n.common_term_confirmInfo_label];
                            $scope.service.show = "confirm";
                        } else if ($scope.service.isSubnetSelected) {
                            $scope.service.show = "subnetInfo";
                            $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpc_term_chooseVLAN_label, i18n.vpc_term_setSubnet_label, i18n.common_term_confirmInfo_label];
                        } else {
                            $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpc_term_chooseVLAN_label, i18n.common_term_confirmInfo_label];
                            $scope.service.show = "confirm";
                        }
                        $("#" + $scope.service.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-network-selectres-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

            //vlan列表
            $scope.vlanTable = {
                "id": "network-selectres-listtable",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "displayLength": 10,
                "totalRecords": 0,
                "columns": [{
                    "sTitle": i18n.common_term_initiativeVALN_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.startID);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_endVLAN_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.endID);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.resource_term_belongsToVLANname_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.resource_term_belongsToVLANdesc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "bSortable": false
                }],
                "data": [],
                "callback": function (evtObj) {
                    vlanPage.currentPage = evtObj.currentPage;
                    vlanPage.displayLength = evtObj.displayLength;
                    // vlan、vxlan差异化处理,子网vlan差异化
                    getVLANData($scope.service.connectionType.indexOf("subnet") >= 0, $scope.service.connectionType.indexOf("vxlan") >= 0);
                },
                "changeSelect": function (evtObj) {
                    vlanPage.currentPage = evtObj.currentPage;
                    vlanPage.displayLength = evtObj.displayLength;
                    getVLANData($scope.service.connectionType.indexOf("subnet") >= 0, $scope.service.connectionType.indexOf("vxlan") >= 0);
                },
                "renderRow": function (nRow, aData, iDataIndex) {}
            };

            //外部网络列表
            $scope.directTable = {
                "id": "network-direct-listtable",
                "paginationStyle": "full_numbers",
                "label": i18n.router_term_chooseExterNet_label,
                "displayLength": 10,
                "totalRecords": 0,
                "lengthMenu": [10, 20, 30],
                "require": true,
                "contentTdAttr":{width:"100%"},
                "contentcls":"content-style-width",
                "columns": [{
                    "sTitle": "", //设置第一列的标题
                    "mData": "dId",
                    "bSortable": false,
                    "sWidth": "5%"
                }, {
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                }, {
                    "sTitle": "VLAN",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vlans);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_Subnet_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.subnet);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_IPassignMode_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ipdiscover);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.perform_term_bondedNICnum_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.totalBoundNics);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.resource_exter_add_para_internet_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.InternetFlagUI);
                    },
                    "bSortable": false
                }],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getOutNetworkData();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getOutNetworkData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                    });
                    // 单选按钮
                    var selBox = "<div style='position: relative;top: -7px;margin:auto;width: 16px;height: 16px'><tiny-radio name='name' value='value' id='id' click='radioClick()'></tiny-radio></div>";
                    if (iDataIndex === 0) {
                        selBox = "<div style='position: relative;top: -7px;margin:auto;width: 16px;height: 16px'><tiny-radio name='name' id='id' value='value' checked='true' click='radioClick()'></tiny-radio></div>";
                        outNetworkName = aData.name;
                        $scope.service.extNetworkId = aData.exnetworkID;
                        var newVlanSelect = [];
                        var tmpSel = null;
                        if (aData.vlans && aData.vlans.length) {
                            for (var i = 0; i < aData.vlans.length; i++) {
                                if (aData.vlans[i]) {
                                    tmpSel = {
                                        "selectId": aData.vlans[i],
                                        "label": aData.vlans[i]
                                    };
                                    newVlanSelect.push(tmpSel);
                                }
                            }
                            newVlanSelect[0].checked = true;
                            $scope.directSelect.values = newVlanSelect;
                        }
                    }
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.id = "directListRadioId" + iDataIndex;
                    selBoxScope.name = "directListRadioName";
                    selBoxScope.value = aData.exnetworkID;
                    selBoxScope.radioClick = function () {
                        $scope.service.extNetworkId = aData.exnetworkID;
                        outNetworkName = aData.name;
                        vlanValues = aData.vlans;
                        var newVlanSelect = [];
                        var tmpSel = null;
                        if (aData.vlans && aData.vlans.length) {
                            for (var i = 0; i < aData.vlans.length; i++) {
                                if (aData.vlans[i]) {
                                    tmpSel = {
                                        "selectId": aData.vlans[i],
                                        "label": aData.vlans[i]
                                    };
                                    newVlanSelect.push(tmpSel);
                                }
                            }
                            newVlanSelect[0].checked = true;
                            $scope.directSelect.values = newVlanSelect;
                        }
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).append(selBoxNode);
                    //subnet
                    var subnet = "";
                    if (aData.ipv4Subnet && aData.ipv4Subnet.subnetAddr && aData.ipv4Subnet.subnetPrefix) {
                        subnet = "<div><span>IPv4: " + aData.ipv4Subnet.subnetAddr + "/" + aData.ipv4Subnet.subnetPrefix + "</span></div>";
                    }
                    if (aData.ipv6Subnet && aData.ipv6Subnet.subnetAddr && aData.ipv6Subnet.subnetPrefix) {
                        subnet += "<div><span>IPv6: " + aData.ipv6Subnet.subnetAddr + "/" + aData.ipv6Subnet.subnetPrefix + "</span></div>";
                    }
                    var ipv4SubName = $compile(subnet);
                    var ipv4SubNode = ipv4SubName(selBoxScope);
                    $("td:eq(5)", nRow).html(ipv4SubNode);

                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                }
            };

            //vlan选择按钮
            $scope.directSelect = {
                "id": "vlanSelect",
                "label": "VLAN ID:",
                "width": "100",
                "values": [],
                "require": true,
                validate: "required:" + i18n.common_term_null_valid + ";"
            };

            //IP分配方式单选按钮事件
            $scope.ipTypeclick = function (evt) {
                if ("auto" === evt) {
                    $scope.reserveIP = false;
                    ipType = $scope.info.ipType.auto;
                } else {
                    if ("inject" === evt) {
                        ipType = $scope.info.ipType.inject;
                    } else {
                        ipType = $scope.info.ipType.inner;
                    }
                    $scope.reserveIP = true;
                }
            };

            // 查询外部网络信息
            function getOutNetworkData() {
                var user = $("html").scope().user;
                var promise = networkServiceIns.queryOutNetworks({
                    "cloudInfraId": $scope.service.cloudInfraId,
                    "start": page.getStart(),
                    "limit": page.displayLength,
                    "vpcId": $scope.service.vpcId,
                    "azId": $scope.service.azId,
                    "userId": user.id,
                    "vdcId": user.vdcId,
                    "isAssociated": true
                });

                promise.then(function (data) {
                    if (data && data.externalNetworks.length > 0) {
                        $scope.directTable.data = data.externalNetworks;
                        _.each($scope.directTable.data, function (item) {
                            _.extend(item, {
                                dId: "",
                                "subnet": "",
                                "ipdiscover": getAllocateWay(item.ipv4Subnet, item.ipv6Subnet),
                                "InternetFlagUI": item.connectToInternetFlag ? i18n.common_term_yes_button : i18n.common_term_no_label
                            });
                        });
                        $scope.directTable.totalRecords = data.total;
                        $scope.directTable.displayLength = page.displayLength;
                        $("#network-direct-listtable").widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                    } else {
                        $scope.directTable.data = [];
                        $scope.directTable.totalRecords = 0;
                    }
                });
            }

            // 查询VLAN信息
            function getVLANData(usedBySubnet, vxLanFlag) {
                var user = $("html").scope().user;
                var param = {
                    "vpcID": $scope.service.vpcId,
                    "azID": $scope.service.azId,
                    "usedBySubnet": usedBySubnet,
                    "vxLanFlag": vxLanFlag,
                    "start": vlanPage.getStart(),
                    "limit": vlanPage.displayLength
                };

                var options = {
                    vdcId: user.vdcId,
                    cloudInfraId: $scope.service.cloudInfraId,
                    "userId": user.id,
                    params: param
                };

                var promise = networkServiceIns.queryVlanPools(options);
                promise.then(function (data) {
                    // 清理掉已经缓存的vlan段
                    $scope.num = [];
                    $scope.info.vlanId.value = "";

                    if (data && data.queryVlanPoolResp && data.queryVlanPoolResp.vlanpools) {
                        $scope.vlanTable.data = data.queryVlanPoolResp.vlanpools;
                        $scope.vlanTable.totalRecords = data.queryVlanPoolResp.total;
                        $scope.vlanTable.displayLength = vlanPage.displayLength;
                        $("#network-selectres-listtable").widget().option("cur-page", {
                            "pageIndex": vlanPage.currentPage
                        });

                        _.each(data.queryVlanPoolResp.vlanpools, function (vlan) {
                            $scope.num.push(vlan.startID);
                            $scope.num.push(vlan.endID);
                        });

                        $scope.info.vlanId.value = $scope.num.sort(function (a, b) {
                            return a > b ? 1 : -1;
                        })[0];
                    } else {
                        $scope.vlanTable.data = [];
                        $scope.vlanTable.totalRecords = 0;
                    }
                });
            }

            $scope.$on($scope.events.networkTypeChangeFromParent, function () {
                if ($scope.service.networkType === "0") {
                    //获取外部网络信息
                    getOutNetworkData();
                } else {
                    //获取vlan信息
                    getVLANData($scope.service.connectionType.indexOf("subnet") >= 0, $scope.service.connectionType.indexOf("vxlan") >= 0);
                }
            });

            //校验vlan范围
            UnifyValid.vlanCheck = function () {
                var vlanV = $("#create-network-vlanId").widget().getValue();
                var num = $scope.num.sort(function (a, b) {
                    return a > b ? 1 : -1;
                });
                return vlanV >= parseInt(num[0], 10) && vlanV <= parseInt(num[num.length - 1], 10);
            };

            function getAllocateWay(ipv4Subnet, ipv6Subnet) {
                if (!ipv4Subnet && !ipv6Subnet) {
                    return "--";
                }
                var allocType = "";
                if (ipv4Subnet) {
                    allocType = "IPv4: " + getAllocateWayFromCode(ipv4Subnet.ipAllocatePolicy);
                }
                if (ipv6Subnet) {
                    allocType += !ipv4Subnet ? "" : "|";
                    allocType += ("IPv6: " + getAllocateWayFromCode(ipv6Subnet.ipAllocatePolicy));
                }
                return allocType;
            }

            function getAllocateWayFromCode(code) {
                var allocateWay = "";
                switch (code) {
                case 0:
                    allocateWay = i18n.resource_term_externalDHCP_label;
                    break;
                case 1:
                    allocateWay = i18n.common_term_innerDHCP_label;
                    break;
                case 2:
                    allocateWay = i18n.common_term_manual_label;
                    break;
                case 3:
                    allocateWay = i18n.vpc_term_staticInjection_label;
                    break;
                case 4:
                    allocateWay = i18n.resource_exter_add_para_allocationIP_mean_noStatusAuto_label;
                    break;
                default:
                    break;
                }
                return allocateWay;
            }
        }
    ];
    return ctrl;
});
