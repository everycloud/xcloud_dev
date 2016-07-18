/*global define*/
define(["jquery",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/business/network/services/networkService"
], function ($, _, UnifyValid, validatorService, networkService) {
    "use strict";

    var netInfoCtrl = ["$scope", "camel", "$compile", "$q", "exception",
        function ($scope, camel, $compile, $q, exception) {
            var i18n = $scope.i18n;
            var validator = new validatorService();
            var networkServiceIns = new networkService(exception, $q, camel);
            var routerIpType = $scope.service.router.ipType; //路由网络 IP分配方式
            var internalIpType = $scope.service.internal.ipType;  //内部网络 IP分配方式

            //外部网络页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.netInfo = {
                require: true,
                direct: {
                    name: {
                        "id": "create-vpc-direct-name",
                        label: i18n.common_term_name_label + ":",
                        "width": "240",
                        require: true,
                        validate: "required:" + i18n.common_term_null_valid + ";regularCheck(" + validator.name + "): " + i18n.common_term_format_valid + "; regularCheck(" + validator.notAllSpaceReg + "): " + i18n.common_term_format_valid + ";",
                        "tooltip": i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                    },
                    description: {
                        label: i18n.common_term_desc_label + ":",
                        "id": "create-vpc-direct-description",
                        "type": "multi",
                        "height": "60",
                        "width": "400",
                        "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                        "tooltip": i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                    }
                },
                router: {
                    ipType: {
                        "id": "create-vpc-routerNetwork-ipType",
                        label: i18n.common_term_IPassignMode_label + ":",
                        require: true,
                        name: "radiogroup-ipType",
                        inner: i18n.common_term_innerDHCP_label,
                        inject: i18n.vpc_term_staticInjection_label,
                        auto: i18n.common_term_manual_label,
                        "innerId": "create-vpc-ipTypeInner",
                        innerValue: "1",
                        injectValue: "3",
                        autoValue: "2"
                    },
                    name: {
                        "id": "create-vpc-router-name",
                        label: i18n.common_term_name_label + ":",
                        "width": "240",
                        require: true,
                        validate: "required:" + i18n.common_term_null_valid + ";regularCheck(" + validator.name + "): " + i18n.common_term_format_valid + "; regularCheck(" + validator.notAllSpaceReg + "): " + i18n.common_term_format_valid + ";",
                        "tooltip": i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                    },
                    "routerType": {
                        "label": i18n.common_term_type_label,
                        "require": true,
                        "name": "routerType-radiogroup",
                        "hardware": i18n.router_term_hardRouter_label,
                        "hardwareValue": "1",
                        "software": i18n.router_term_softRouter_label,
                        "softwareValue": "2"
                    },
                    "setRouterType": function (type) {
                        $scope.service.router.routerType = type;
                        $scope.service.router.supportVxlan = false;  // 默认VXLAN为false
                        $scope.service.router.routerTypeUI = (type === "1" ? i18n.router_term_hardRouter_label : i18n.router_term_softRouter_label);
                    },
                    "supportVxlan": {
                        "id": "create-vpc-router-supportVxlan",
                        "label": i18n.router_router_view_para_supporVXLAN_label + ":",
                        "require": true,
                        "width": "216px",
                        "values": [
                            {
                                "selectId": "true",
                                "label": i18n.common_term_yes_button
                            },
                            {
                                "selectId": "false",
                                "label": i18n.common_term_no_label,
                                "checked": true
                            }
                        ],
                        "change": function () {
                            var supportVxlan = $("#create-vpc-router-supportVxlan").widget().getSelectedId();
                            $scope.service.router.supportVxlan = supportVxlan + "" === "true";
                        }
                    },
                    subnetIp: {
                        "id": "create-vpc-router-subnetIp",
                        "width": "240",
                        label: i18n.common_term_SubnetIP_label + ":",
                        require: true,
                        type: "ipv4",
                        "extendFunction": ["IPv4Check"],
                        validate: "required:" + i18n.common_term_null_valid + ";IPv4Check():" + i18n.common_term_formatIP_valid
                    },
                    subnetMask: {
                        "id": "create-vpc-router-subnetMask",
                        label: i18n.common_term_SubnetMask_label + ":",
                        require: true,
                        type: "ipv4",
                        "extendFunction": ["maskCheck"],
                        validate: "required:" + i18n.common_term_null_valid + ";maskCheck(create-vpc-router-subnetIp):" + i18n.common_term_subnetIPnotMatchMask_valid + "; "
                    },
                    gateway: {
                        "id": "create-vpc-router-gateway",
                        label: i18n.common_term_gateway_label + ":",
                        require: true,
                        type: "ipv4",
                        "extendFunction": ["gatewayCheck"],
                        validate: "required:" + i18n.common_term_null_valid + ";gatewayCheck(create-vpc-router-subnetIp,create-vpc-router-subnetMask):" + i18n.resource_term_outSubnetOrConflict_valid + ";"
                    },
                    description: {
                        label: i18n.common_term_desc_label + ":",
                        "id": "create-vpc-router-description",
                        "type": "multi",
                        "width": "400",
                        "height": "60",
                        "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                        "tooltip": i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                    }
                },
                internal: {
                    ipType: {
                        "id": "create-vpc-innerNetwork-ipType",
                        label: i18n.common_term_IPassignMode_label + ":",
                        require: true,
                        name: "radiogroup-internalIpType",
                        inner: i18n.common_term_innerDHCP_label,
                        inject: i18n.vpc_term_staticInjection_label,
                        auto: i18n.common_term_manual_label,
                        "innerId": "create-vpc-innerNetwork-ipTypeInner",
                        innerValue: "1",
                        injectValue: "3",
                        autoValue: "2"
                    },
                    name: {
                        "id": "create-vpc-internal-name",
                        label: i18n.common_term_name_label + ":",
                        "width": "240",
                        require: true,
                        validate: "required:" + i18n.common_term_null_valid + ";regularCheck(" + validator.name + "): " + i18n.common_term_format_valid + "; regularCheck(" + validator.notAllSpaceReg + "): " + i18n.common_term_format_valid + ";",
                        "tooltip": i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                    },
                    subnetIp: {
                        "id": "create-vpc-internal-subnetIp",
                        "width": "240",
                        label: i18n.common_term_SubnetIP_label + ":",
                        require: true,
                        type: "ipv4",
                        "extendFunction": ["IPv4Check"],
                        validate: "required:" + i18n.common_term_null_valid + ";IPv4Check():" + i18n.common_term_formatIP_valid
                    },
                    subnetMask: {
                        "id": "create-vpc-internal-subnetMask",
                        label: i18n.common_term_SubnetMask_label + ":",
                        require: true,
                        type: "ipv4",
                        "extendFunction": ["maskCheck"],
                        validate: "required:" + i18n.common_term_null_valid + ";maskCheck(create-vpc-internal-subnetIp):" + i18n.common_term_subnetIPnotMatchMask_valid + ";"
                    },
                    gateway: {
                        "id": "create-vpc-internal-gateway",
                        label: i18n.common_term_gateway_label + ":",
                        require: false,
                        type: "ipv4",
                        "extendFunction": ["gatewayCheck"],
                        validate: "gatewayCheck(create-vpc-internal-subnetIp,create-vpc-internal-subnetMask):" + i18n.resource_term_outSubnetOrConflict_valid + ";"
                    },
                    description: {
                        label: i18n.common_term_desc_label + ":",
                        "id": "create-vpc-internal-description",
                        "type": "multi",
                        "width": "400",
                        "height": "60",
                        "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                        "tooltip": i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                    }
                },
                preBtn: {
                    "id": "create-vpc-network-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "vpcType";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-vpc-network-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        //校验是否输入
                        var valid = UnifyValid.FormValid($("#createVPCNetInfoDiv"), undefined);
                        if (!valid) {
                            return;
                        }

                        $scope.service.show = "confirm";
                        $("#" + $scope.service.step.id).widget().next();

                        //获取用户输入的参数值
                        $scope.service.direct.name = $("#create-vpc-direct-name").widget().getValue();
                        $scope.service.direct.description = $("#create-vpc-direct-description").widget().getValue();
                        if ($scope.service.type === $scope.VPC_TYPE.DIRECT || $scope.service.type === $scope.VPC_TYPE.DIRECT_ROUTER || $scope.service.type === $scope.VPC_TYPE.DIRECT_ROUTER_EXTEND_VPN) {
                            $scope.service.direct.vlanId = $("#directnetVlanSelect").widget().getSelectedLabel();
                        }

                        $scope.service.router.name = $("#create-vpc-router-name").widget().getValue();
                        $scope.service.router.description = $("#create-vpc-router-description").widget().getValue();
                        $scope.service.router.gateway = $("#create-vpc-router-gateway").widget().getValue();
                        $scope.service.router.subnetAddr = $("#create-vpc-router-subnetIp").widget().getValue();
                        $scope.service.router.subnetPrefix = $("#create-vpc-router-subnetMask").widget().getValue();
                        $scope.service.router.subnetAndMark = $scope.service.router.subnetAddr + "/" + $scope.service.router.subnetPrefix;
                        $scope.service.router.ipAllocatePolicy = $("#create-vpc-ipTypeInner").widget().opChecked();
                        $scope.service.router.ipType = routerIpType;

                        $scope.service.internal.name = $("#create-vpc-internal-name").widget().getValue();
                        $scope.service.internal.description = $("#create-vpc-internal-description").widget().getValue();
                        $scope.service.internal.gateway = $("#create-vpc-internal-gateway").widget().getValue();
                        $scope.service.internal.subnetAddr = $("#create-vpc-internal-subnetIp").widget().getValue();
                        $scope.service.internal.subnetPrefix = $("#create-vpc-internal-subnetMask").widget().getValue();
                        $scope.service.internal.subnetAndMark = $scope.service.internal.subnetAddr + "/" + $scope.service.internal.subnetPrefix;
                        $scope.service.internal.ipAllocatePolicy = $("#create-vpc-innerNetwork-ipTypeInner").widget().opChecked();
                        $scope.service.internal.ipType = internalIpType;
                    }
                },
                cancelBtn: {
                    "id": "create-vpc-network-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
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
                "columns": [
                    {
                        "sTitle": "", //设置第一列的标题
                        "mData": "dId",
                        "bSortable": false,
                        "sWidth": "5%"
                    },
                    {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "VLAN",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlans);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_Subnet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subnet);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_IPassignMode_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipdiscover);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.perform_term_bondedNICnum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.totalBoundNics);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.resource_exter_add_para_internet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.InternetFlagUI);
                        },
                        "bSortable": false
                    }
                ],
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
                        $scope.service.direct.extNetworkId = aData.exnetworkID;

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
                        $scope.service.direct.extNetworkId = aData.exnetworkID;

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
                "id": "directnetVlanSelect",
                "label": "VLAN ID:",
                "width": "100",
                "values": [],
                "require": true,
                validate: "required:" + i18n.common_term_null_valid + ";"
            };

            // 查询外部网络信息
            function getOutNetworkData() {
                var promise = networkServiceIns.queryOutNetworks({
                    "cloudInfraId": $scope.service.cloudInfraId,
                    "start": page.getStart(),
                    "limit": page.displayLength,
                    "vpcId": "0",
                    "azId": $scope.service.azIDs,
                    "userId": $scope.service.user.id,
                    "vdcId": $scope.service.user.vdcId,
                    "isAssociated": true
                });

                promise.then(function (data) {
                    if (data && data.externalNetworks.length > 0) {
                        $scope.directTable.data = [];
                        _.each(data.externalNetworks, function (item) {
                            $scope.directTable.data.push(item);
                        });
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

            //IP分配方式单选按钮事件
            routerIpType = $scope.netInfo.router.ipType.inner;
            internalIpType = $scope.netInfo.internal.ipType.inner;
            $scope.ipTypeclick = function (evt) {
                if ("auto" === evt) {
                    internalIpType = $scope.netInfo.internal.ipType.auto;
                } else if ("inject" === evt) {
                    internalIpType = $scope.netInfo.internal.ipType.inject;
                } else {
                    internalIpType = $scope.netInfo.internal.ipType.inner;
                }
            };
            $scope.routerIpTypeclick = function(evt){
                if ("inject" === evt) {
                    routerIpType = $scope.netInfo.router.ipType.inject;
                } else if("auto" === evt){
                    routerIpType = $scope.netInfo.router.ipType.auto;
                }else{
                    routerIpType = $scope.netInfo.router.ipType.inner;
                }
            };
            //校验IPv4是否合法
            UnifyValid.IPv4Check = function () {
                return validator.ipValidator($(this).val());
            };

            //校验掩码
            UnifyValid.maskCheck = function (subnetId) {
                if (!subnetId) {
                    return false;
                }
                var mask = $(this).val(); //子网掩码
                var subnet = $("#" + subnetId).widget().getValue(); //子网IP
                if (!mask || !subnet) {
                    return false;
                }
                if (validator.ipValidator(mask)) {
                    if (validator.maskValidator(mask)) {
                        return validator.maskAndSubnetValidator(mask, subnet);
                    }
                    return false;
                }
                return false;
            };

            //校验网关IP在子网内并不与子网、掩码冲突
            UnifyValid.gatewayCheck = function (param) {
                if (!param) {
                    return false;
                }
                var subnetIdAndMask = param[0].split(",");
                var ipValue = $(this).val();
                // 为空校验通过
                if(!ipValue || "" === ipValue){
                    return true;
                }
                var subnet = $("#" + subnetIdAndMask[0]).widget().getValue(); //子网IP
                var mask = $("#" + subnetIdAndMask[1]).widget().getValue(); //子网掩码
                if (validator.ipValidator(ipValue)) {
                    return validator.subnetValidator(ipValue, mask, subnet);
                }
                return false;
            };

            // 事件处理，查询初始化信息
            $scope.$on($scope.events.selectDirectNetFromParent, function (event, msg) {
                getOutNetworkData();
            });
        }
    ];
    return netInfoCtrl;
});
