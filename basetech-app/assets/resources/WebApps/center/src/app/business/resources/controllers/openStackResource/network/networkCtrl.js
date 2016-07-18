define(["tiny-lib/angular",
    "tiny-common/UnifyValid",
    "app/business/resources/services/openstackResources/ajaxNetwork", "fixtures/hypervisorFixture"],
    function (angular,UnifyValid, ajax) {
        "use strict";

        var ctrl = ["$scope", "$stateParams", "fmLib", "validator", function ($scope, $stateParams, fmLib, validator) {
            var demo = false;
            var colon = ":";
            var i18n = $scope.i18n || {};
            $scope.region = $stateParams.region;
            $scope.networkId = "";
            $scope.subnetId = "";
            $scope.show = {
                createNetwork: false,
                modifyNetwork: false,
                deleteNetwork: false,
                createSubnet: false,
                modifySubnet: false
            };

            $scope.valid = {
                networkCheck: false,
                modifyNetworkCheck: false,
                subnetCheck: false,
                modifySubnetCheck: false
            };

            // 创建网络
            $scope.vlanCombobox = {
                "id": "vlanCombobox",
                "validate": "required:" + $scope.i18n.common_term_null_valid +
                    ";maxSize(1024):" + validator.i18nReplace($scope.i18n.common_term_maxLength_valid, {"1": "1024"})
            };
            $scope.vxlanCombobox = {
                "id": "vxlanCombobox",
                "validate": "maxSize(1024):" + validator.i18nReplace($scope.i18n.common_term_maxLength_valid, {"1": "1024"})
            };
            $scope.showNetwork = function () {
                $scope.show.createNetwork = true;
                $scope.para.name = "";
                $scope.para.phyNetwork = "";
                $scope.para.segmentationId = "";
                $scope.$digest();
                if($("#" + $scope.vlanCombobox.id).widget()){
                    $("#" + $scope.vlanCombobox.id).widget().option("value","");
                }
                if($("#" + $scope.vxlanCombobox.id).widget()){
                    $("#" + $scope.vxlanCombobox.id).widget().option("value","");
                }
                $scope.queryVlans();
            };
            $scope.form = {
                label: {
                    name: i18n.common_term_name_label + colon,
                    type: i18n.vpc_term_netType_label + colon,
                    phyNetwork: i18n.resource_term_physiNet_label + colon,
                    segmentationId: "VLAN ID:",
                    create: i18n.common_term_create_button,
                    cancel: i18n.common_term_cancle_button,
                    modify: i18n.common_term_modify_button
                },

                type: [
                    {id: "vlan", name: "vlan", checked: true}
                ]
            };
            $scope.para = {
                name: null,
                type: {id: "vlan", name: "vlan"},
                phyNetwork: null,
                segmentationId: null
            };

            // 子网
            $scope.subnetForm = {
                label: {
                    ipVersion: i18n.common_term_protocolVersion_label + colon,
                    name: i18n.common_term_name_label + colon,
                    ip: i18n.common_term_SubnetIP_label + colon,
                    mask: i18n.common_term_SubnetMask_label + colon,
                    gateWay: i18n.common_term_gateway_label + colon,
                    ipPools: i18n.common_term_enableIPsegment_label + colon,
                    firstDNS: i18n.common_term_activeDNS_label + colon,
                    secondDNS: i18n.common_term_standbyDNS_label + colon,
                    create: i18n.common_term_create_button,
                    cancel: i18n.common_term_cancle_button,
                    modify: i18n.common_term_modify_button
                },
                ipVersion: [
                    {id: "4", name: "IPv4", checked: true},
                    {id: "6", name: "IPv6"}
                ],

                subnetCheck: function (s, e) {
                    if (!s && !e) {
                        return true;
                    }
                    if ((!s && e) || (s && !e)) {
                        return false;
                    }
                    return s <= e ? true : i18n.common_term_endGreaterEqualStartIP_valid || "结束IP地址必须大于等于开始IP地址。";
                },
                subnetCheckFormat : function(ip, mask, gate){
                    if ((ip & mask) != (ip & 0xFFFFFFFF)){
                        return i18n.common_term_formatSubnetIP_valid||"子网IP地址不合法";
                    }
                    return true;
                },
                gateCheck : function(ip, mask, gate){
                    if ((ip & mask) != (gate & mask)){
                        return i18n.vpc_term_gatewayNotInSubnet_valid||"网关地址不在子网内";
                    }

                    if (ip == gate){
                        return i18n.vpc_term_gatewayError_valid||"网关不合法";
                    }

                    if ((gate & (~mask)) == (~mask)){
                        return i18n.vpc_term_gatewayError_valid||"网关不合法";
                    }
                    return true;
                }
            };
            $scope.subnetPara = {
                ipVersion: {id: null, name: null},
                enableDhcp: true,
                name: null,
                ip: "",
                mask: null,
                subnetPrefix: null,
                gateWay: null,
                ipPools: [
                    {start: null, end: null}
                ],
                firstDNS: null,
                secondDNS: null
            };

            // 是否启用DHCP服务
            $scope.enableDhcpCheckbox = {
                "id": "enableDhcpCheckboxId",
                "checked": true,
                "text": i18n.resource_term_enableDHCP_button || "启用DHCP",
                "change": function () {
                    var checked = $("#" + $scope.enableDhcpCheckbox.id).widget().option("checked");
                    $scope.subnetPara.enableDhcp = checked;
                }
            };

            $scope.event = {
                "typeChange": function (id, name) {
                    setTimeout(function () {
                        $scope.$digest();
                    }, 0);
                    $scope.para.segmentationId = null;
                },
                "ipTypeChange": function (id, name) {
                    $scope.subnetPara.ip = "";
                    $scope.subnetPara.subnetPrefix = null;
                    $scope.subnetPara.gateWay = null;
                    $scope.subnetPara.ipPools = [
                        {start: null, end: null}
                    ];
                    $scope.subnetPara.firstDNS = null;
                    $scope.subnetPara.secondDNS = null;
                    $scope.$digest();
                },
                "addIpPool": function () {
                    if ($scope.subnetPara.ipPools && $scope.subnetPara.ipPools.length >= 32) {
                        return;
                    }
                    $scope.subnetPara.ipPools.push({start: null, end: null})
                },
                "deleteIpPool": function (index) {
                    $scope.subnetPara.ipPools.splice(index, 1);
                }
            };

            $scope.table = {
                columns: [
                    {sTitle: i18n.common_term_name_label || "名称", mData: "name", "sWidth": "120px", bSortable: false},
                    {sTitle: "ID", mData: "id", "sWidth": "270px", bSortable: false},
                    {sTitle: i18n.vpc_term_netType_label || "网络类型", mData: "type", "sWidth": "100px", bSortable: false},
                    {sTitle: i18n.resource_term_physiNet_label || "物理网络", mData: "physicalNetwork", "sWidth": "120px", bSortable: false},
                    {sTitle: "VLAN ID", mData: "segmentationId", "sWidth": "100px", bSortable: false},
                    {sTitle: i18n.common_term_status_label || "状态", mData: "status", "sWidth": "80px", bSortable: false}
                ],
                operate: [
                    {name: i18n.common_term_modify_button || "修改", func: "table.modify"},
                    {name: i18n.common_term_delete_button || "删除", func: "table.remove"},
                    {name: '{{row.hasNoSubnet?(i18n.resource_term_createSubnet_button || "创建子网"):""}}', func: "table.createSubnet"}
                ],
                modify: function (arr, idx) {
                    $scope.networkId = arr.id;
                    $scope.para.name = arr.name;
                    $scope.show.modifyNetwork = true;
                },
                remove: function (arr, idx) {
                    ajax.confirm(i18n.common_term_confirm_label || "确认",
                        i18n.resource_exter_delNet_info_confirm_msg || "确定要删除网络吗?",
                        function () {
                            ajax.network.deleteNetwork($scope.service.neutronId, arr.id,
                                $scope.queryNetworks, {});
                        });
                },
                createSubnet: function (arr, idx) {
                    $scope.valid.subnetCheck = false;
                    $scope.show.createSubnet = true;
                    $scope.networkId = arr.id;
                    $scope.subnetPara.name = "";
                    $scope.subnetPara.ip = "";
                    $scope.subnetPara.mask = "255.255.255.0";
                    $scope.subnetPara.subnetPrefix = "";
                    $scope.subnetPara.gateWay = "";
                    $scope.subnetPara.ipPools = [
                        {start: "", end: ""}
                    ];
                    $scope.subnetPara.firstDNS = "";
                    $scope.subnetPara.secondDNS = "";
                },
                getDetail: function (scope, open) {
                    scope.data = [];
                    if (open) {
                        $scope.querySubnets(scope.row.id, scope);
                    }
                },
                data: []
            };

            $scope.subnetTable = {
                columns: [
                    {sTitle: i18n.common_term_name_label || "名称", mData: "name", "sWidth": "120px", bSortable: false},
                    {sTitle: "ID", mData: "id", "sWidth": "120px", bSortable: false},
                    {sTitle: i18n.common_term_protocolVersion_label || "协议版本", mData: "ipVersionStr", "sWidth": "80px", bSortable: false},
                    {sTitle: i18n.common_term_SubnetIP_label || "子网IP", mData: "ip", "sWidth": "120px", bSortable: false},
                    {sTitle: i18n.common_term_SubnetMask_label || "子网掩码", mData: "mask", "sWidth": "120px", bSortable: false},
                    {sTitle: i18n.common_term_gateway_label || "网关", mData: "gateway_ip", "sWidth": "120px", bSortable: false},
                    {sTitle: i18n.common_term_enableIPsegment_label || "可用IP段", mData: "ipPools", "sWidth": "120px", bSortable: false},
                    {sTitle: i18n.resource_term_enableDHCP_button || "启用DHCP", mData: "enableDhcpStr", "sWidth": "60px", bSortable: false}
                ],
                operate: [
                    {name: i18n.common_term_delete_button || "删除", func: "subnetTable.remove"},
                    {name: i18n.common_term_modify_button || "修改", func: "subnetTable.modify"}
                ],
                remove: function (arr, idx) {
                    ajax.confirm(i18n.common_term_confirm_label || "确认",
                        i18n.resource_exter_delSubnet_info_confirm_msg || "确定要删除子网吗?",
                        function () {
                            ajax.network.deleteSubnet($scope.service.neutronId, arr.id,
                                $scope.queryNetworks, {});
                        });
                },
                modify: function (arr, idx) {
                    $scope.subnetId = arr.id;
                    $scope.show.modifySubnet = true;
                    $scope.subnetPara.ip_version = arr.ip_version;
                    $scope.subnetPara.name = arr.name;
                    $scope.subnetPara.gateWay = arr.gateway_ip;
                    $scope.subnetPara.mask = arr.mask;
                    $scope.subnetPara.ip = arr.ip;
                },
                data: []
            };

            //查询信息
            var searchInfo = {
                "markers": [],
                "limit": 10
            };
            $scope.curPage = 1;
            $scope.hasPrePage = false;
            $scope.hasNextPage = false;

            $scope.refresh = function () {
                $scope.init();
            };
            $scope.prePage = function () {
                if (!$scope.hasPrePage) {
                    return;
                }
                searchInfo.markers.pop();
                if (searchInfo.markers.length === 0) {
                    $scope.hasPrePage = false;
                }
                $scope.curPage--;
                $scope.init();
            };
            $scope.nextPage = function () {
                if (!$scope.hasNextPage) {
                    return;
                }
                searchInfo.markers.push($scope.table.data[searchInfo.limit - 1].id);
                $scope.hasPrePage = true;
                $scope.curPage++;
                $scope.init();
            };
            //页尺寸选择框
            $scope.sizeSelector = {
                "id": "searchSizeSelector",
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
                    searchInfo.limit = $("#" + $scope.sizeSelector.id).widget().getSelectedId();
                    searchInfo.markers = [];
                    $scope.hasPrePage = false;
                    $scope.curPage = 1;
                    $scope.init();
                }
            };

            // 查询网络
            $scope.queryNetworks = function () {
                $scope.table.data = [];
                function data2table(data) {
                    if (data && data.networks) {
                        var arr = [];
                        for (var i in data.networks) {
                            var e = data.networks[i];
                            if (e["router:external"] == true) {
                                var o = {
                                    id: e.id,
                                    name: e.name,
                                    type: e["provider:network_type"],
                                    status: e.status,
                                    segmentationId: e["provider:segmentation_id"],
                                    physicalNetwork: e["provider:physical_network"],
                                    hasNoSubnet: !e.subnets || e.subnets.length === 0
                                };
                                arr.push(o);
                            }
                        }

                        $scope.table.data = arr;
                        if (arr.length < searchInfo.limit) {
                            $scope.hasNextPage = false;
                        }
                        else {
                            $scope.hasNextPage = true;
                        }
                    }
                    $scope.$digest();
                }

                var params = {
                    limit: searchInfo.limit
                };
                if (searchInfo.markers.length > 0) {
                    params.marker = searchInfo.markers[searchInfo.markers.length - 1];
                }
                ajax.network.queryNetworks($scope.service.neutronId, params, data2table);
            };

            // 创建网络请求
            $scope.createNetwork = function () {
                if (!$scope.valid.networkCheck) {
                    return;
                }
                if($scope.para.type.id === "vlan"){
                    var result = UnifyValid.FormValid($("#vlanCombobox"));
                    if(!result){
                        return;
                    }
                    $scope.para.phyNetwork =  $("#" + $scope.vlanCombobox.id).widget().getValue();
                }
                if($scope.para.type.id === "vxlan"){
                    var result = UnifyValid.FormValid($("#vxlanCombobox"));
                    if(!result){
                        return;
                    }
                    $scope.para.phyNetwork =  $("#" + $scope.vxlanCombobox.id).widget().getValue();
                }
                var para = {
                    network: {
                        "name": $scope.para.name,
                        "provider:network_type": $scope.para.type.id,
                        "provider:physical_network": $scope.para.phyNetwork,
                        "provider:segmentation_id": $scope.para.segmentationId
                    }
                };
                if ($scope.para.phyNetwork) {
                    para.network["provider:physical_network"] = $scope.para.phyNetwork;
                }
                ajax.network.createNetwork($scope.service.neutronId, para, function () {
                    $scope.show.createNetwork = false;
                    $scope.$digest();
                    $scope.queryNetworks();
                });
            };

            // 修改网络请求
            $scope.modifyNetwork = function () {
                if (!$scope.valid.modifyNetworkCheck) {
                    return;
                }
                var para = {
                    "network": {
                        "name": $scope.para.name
                    }
                };
                ajax.network.modifyNetwork($scope.service.neutronId, $scope.networkId, para, function () {
                    $scope.show.modifyNetwork = false;
                    $scope.$digest();
                    $scope.queryNetworks();
                });
            };
            $scope.cancelNetwork = function () {
                $scope.show.createNetwork = false;
                $scope.show.modifyNetwork = false;
                $scope.$digest();
            };

            // 查询子网
            $scope.querySubnets = function (networkId, scope) {
                function data2table(data) {
                    if (data && data.subnets) {
                        var arr = [];
                        for (var i in data.subnets) {
                            var e = data.subnets[i];
                            var cidr = e.cidr;
                            var ip = "";
                            var mask = "";
                            if (cidr) {
                                var cidrArr = cidr.split("/");
                                ip = cidrArr[0] || "";
                                if (e.ip_version === 4) {
                                    mask = fmLib.ip2string((~((1 << (32 - parseInt(cidrArr[1]))) - 1)) & 0xFFFFFFFF);
                                }
                                else if (e.ip_version === 6) {
                                    mask = cidrArr[1];
                                }
                            }

                            var allocationPools = e["allocation_pools"];
                            var ipPoolsStr = "";
                            if (allocationPools) {
                                for (var i in allocationPools) {
                                    var pool = allocationPools[i];
                                    ipPoolsStr += (pool.start + "-" + pool.end + ";");
                                }
                            }

                            var enableDhcp = e["enable_dhcp"];
                            var o = {
                                id: e.id,
                                name: e.name,
                                ip_version: e.ip_version,
                                ipVersionStr: "IPv" + e.ip_version,
                                ip: ip,
                                mask: mask,
                                gateway_ip: e.gateway_ip,
                                enableDhcpStr: enableDhcp ? (i18n.common_term_yes_button || "是") : (i18n.common_term_no_label || "否"),
                                enable_dhcp: enableDhcp,
                                ipPools: ipPoolsStr
                            };
                            arr.push(o);
                        }
                        scope.data = arr;
                    }
                    scope.$digest();
                }

                ajax.network.querySubnets($scope.service.neutronId, networkId, data2table);
            };

            // 查询物理网络
            $scope.queryVlans = function () {
                function data2table(data) {
                    var networks = data && data.physicalnetworks || [];
                    var vlanValues = [];
                    var vxlanValues = [];
                    for (var i in networks) {
                        var e = networks[i];
                        if (e.type === 'vlan') {
                            vlanValues.push(e.name);
                        }
                        if (e.type === 'vxlan') {
                            vxlanValues.push(e.name);
                        }
                    }
                    $scope.$apply(function () {
                        $("#" + $scope.vlanCombobox.id).widget().option("values", vlanValues);
                        $("#" + $scope.vxlanCombobox.id).widget().option("values", vxlanValues);
                    });
                }

                ajax.network.queryVlans($scope.service.neutronId, data2table);
            };

            // 构造创建子网请求
            $scope.constructSubnetPara = function () {
                var allocationPools = [];
                var dhcpServers = [];
                if ($scope.subnetPara.enableDhcp) {
                    if ($scope.subnetPara.ipPools) {
                        var pools = $scope.subnetPara.ipPools;
                        for (var i in pools) {
                            if (pools[i].start && pools[i].end) {
                                allocationPools.push({"start": pools[i].start, "end": pools[i].end});
                            }
                        }
                    }
                    if ($scope.subnetPara.firstDNS) {
                        dhcpServers.push($scope.subnetPara.firstDNS);
                    }
                    if ($scope.subnetPara.secondDNS) {
                        dhcpServers.push($scope.subnetPara.secondDNS);
                    }
                }

                var cidr = "";
                if ($scope.subnetPara.ipVersion.id === "4") {
                    cidr = $scope.subnetPara.ip + "/" + fmLib.maskBit($scope.subnetPara.mask);
                }
                else if ($scope.subnetPara.ipVersion.id === "6") {
                    cidr = $scope.subnetPara.ip + "/" + $scope.subnetPara.subnetPrefix;
                }

                var subnet = {
                    "name": $scope.subnetPara.name || "",
                    "enable_dhcp": $scope.subnetPara.enableDhcp,
                    "network_id": $scope.networkId,
                    "dns_nameservers": dhcpServers,
                    "ip_version": $scope.subnetPara.ipVersion.id,
                    "gateway_ip": $scope.subnetPara.gateWay,
                    "cidr": cidr
                };

                //IPV6场景不支持DHCP
                if ($scope.subnetPara.ipVersion.id === "6") {
                    subnet.enable_dhcp = false;
                }

                if (allocationPools && allocationPools.length > 0) {
                    subnet["allocation_pools"] = allocationPools;
                }
                var para = {
                    "subnet": subnet
                };

                return para;
            };
            // 创建子网请求
            $scope.createSubnet = function () {
                if (!$scope.valid.subnetCheck) {
                    return;
                }

                var para = $scope.constructSubnetPara();
                ajax.network.createSubnet($scope.service.neutronId, para, function () {
                    $scope.show.createSubnet = false;
                    $scope.$digest();
                    $scope.queryNetworks();
                });
            };

            // 修改子网请求
            $scope.modifySubnet = function () {
                if (!$scope.valid.modifySubnetCheck) {
                    return;
                }
                var para = {
                    "subnet": {
                        "name": $scope.subnetPara.name || "",
                        "gateway_ip": $scope.subnetPara.gateWay
                    }
                };
                ajax.network.modifySubnet($scope.service.neutronId, $scope.subnetId, para, function () {
                    $scope.show.modifySubnet = false;
                    $scope.$digest();
                    $scope.queryNetworks();
                });
            };

            $scope.cancelSubnet = function () {
                $scope.show.createSubnet = false;
                $scope.show.modifySubnet = false;
                $scope.$digest();
            };

            $scope.service = {
                "neutronId": null,
                "hasNetworkService": false
            };

            $scope.init = function () {
                function data2neutronId(data) {
                    if (data === undefined || data.endpoint === undefined) {
                        return;
                    }
                    for (var index in data.endpoint) {
                        var regionName = data.endpoint[index].regionName;
                        if (regionName === $scope.region && data.endpoint[index].serviceName === "neutron") {
                            $scope.service.neutronId = data.endpoint[index].id;
                            $scope.service.hasNetworkService = true;
                            $scope.queryNetworks();
                            break;
                        }
                    }
                }

                if ($scope.service.neutronId) {
                    $scope.queryNetworks();
                }
                else {
                    ajax.network.getServiceId(data2neutronId);
                }
            };

            // 页面初始化，获取neutron服务
            $scope.init();

        }];

        return ctrl;
    })
;