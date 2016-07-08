/*global define*/
define(["tiny-lib/angular",
    "tiny-lib/jquery",
    "tiny-lib/encoder",
    "tiny-lib/underscore",
    "app/business/network/services/networkService",
    "app/business/network/services/eip/eipService",
    "app/business/network/services/vpc/vpcService",
    "tiny-widgets/Window",
    "./vpc/topo/vpcTopo",
    "tiny-widgets/CirqueChart",
    "tiny-widgets/Columnchart",
    "tiny-directives/CirqueChart",
    "tiny-directives/Columnchart",
    "fixtures/network/vpcFixture",
    "fixtures/network/eip/elasticipFixture",
    "fixtures/network/network/networkListFixture"
], function (angular, $, $encoder, _, networkService, eipService, vpcService, Window, topo, cirqueChart, Columnchart) {
    "use strict";

    var summaryCtrl = ["$scope", "$state", "$compile", "$q", "exception", "camel", "networkCommon",
        function ($scope, $state, $compile, $q, exception, camel, networkCommon) {
            var i18n = $scope.i18n;
            var user = $scope.user;
            var encoder = $.encoder;
            $scope.ict = (user.cloudType === "ICT");
            $scope.cloudInfraId = networkCommon && networkCommon.cloudInfraId;
            $scope.vpcId = networkCommon && networkCommon.vpcId;
            $scope.azId = networkCommon && networkCommon.azId;
            $scope.vpcName = networkCommon && networkCommon.vpcName;
            $scope.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;

            $scope.networkInstance = new networkService(exception, $q, camel);
            $scope.eipServiceIns = new eipService(exception, $q, camel);
            $scope.vpcServiceIns = new vpcService(exception, $q, camel);

            var networksData = [
                {
                    value: "",
                    name: i18n.vpc_term_innerNet_label + ":",
                    color: "#5ecc49",
                    tooltip: i18n.vpc_term_innerNet_label,
                    click: function () {
                        $state.go("network.vpcmanager.network");
                    }
                },
                {
                    value: "",
                    name: i18n.vpc_term_routerNet_label + ":",
                    color: "#f7820d",
                    tooltip: i18n.vpc_term_routerNet_label,
                    click: function () {
                        $state.go("network.vpcmanager.network");
                    }
                },
                {
                    value: "",
                    name: i18n.vpc_term_directConnectNet_label + ":",
                    color: "#D5D5D5",
                    tooltip: i18n.vpc_term_directConnectNet_label,
                    click: function () {
                        $state.go("network.vpcmanager.network");
                    }
                }
            ];

            var networksDataICT = [
                {
                    value: "",
                    name: i18n.perform_term_routerOrInnerNetNum_label + ":",
                    color: "#f7820d",
                    tooltip: i18n.perform_term_routerOrInnerNetNum_label,
                    click: function () {
                        $state.go("network.vpcmanager.ictnetwork");
                    }
                },
                {
                    value: "",
                    name: i18n.vpc_term_directConnectNet_label + ":",
                    color: "#5ecc49",
                    tooltip: i18n.vpc_term_directConnectNet_label,
                    click: function () {
                        $state.go("network.vpcmanager.ictnetwork.directnetwork");
                    }
                }
            ];

            var eipdata = [
                {
                    value: "",
                    name: i18n.perform_term_usedByVM_label + ":",
                    color: "#1fbe5c",
                    tooltip: i18n.perform_term_usedByVM_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                },
                {
                    value: "",
                    name: i18n.perform_term_usedByVPN_label + ":",
                    color: "#70CE17",
                    tooltip: i18n.perform_term_usedByVPN_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                },
                {
                    value: "",
                    name: i18n.perform_term_usedByVLB_label + ":",
                    color: "#97db10",
                    tooltip: i18n.perform_term_usedByVLB_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                },
                {
                    value: "",
                    name: i18n.perform_term_usaedByF5_label + ":",
                    color: "#1dcfef",
                    tooltip: i18n.perform_term_usaedByF5_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                },
                {
                    value: "",
                    name: i18n.common_term_manualAssign_label + ":",
                    color: "#f7820d",
                    tooltip: i18n.common_term_manualAssign_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                },
                {
                    value: "",
                    name: i18n.common_term_available_label + ":",
                    color: "#d5d5d5",
                    tooltip: i18n.common_term_available_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                }
            ];

            // ICT场景弹性IP只有VM和可用
            var ictEipdata = [
                {
                    value: "",
                    name: i18n.perform_term_usedByVM_label + ":",
                    color: "#1fbe5c",
                    tooltip: i18n.perform_term_usedByVM_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                },
                {
                    value: "",
                    name: i18n.common_term_available_label + ":",
                    color: "#d5d5d5",
                    tooltip: i18n.common_term_available_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                }
            ];

            // 公共VPC只有虚拟机使用
            var sharedVpcEipdata = [
                {
                    value: "",
                    name: i18n.perform_term_usedByVM_label + ":",
                    color: "#1fbe5c",
                    tooltip: i18n.perform_term_usedByVM_label,
                    click: function () {
                        $state.go("network.vpcmanager.eip");
                    }
                }
            ];

            var networkCirqueOption = {
                "id": "network-vpcmanager-networks-cirque",
                "r": "75",
                "showLegend": true,
                "centerText": {
                    text: "",
                    fontSize: 46,
                    color: "#5ecc49"
                },
                "data": $scope.ict ? networksDataICT : networksData
            };

            var eipCirqueOption = {
                "id": "network-vpcmanager-eip-cirque",
                "r": "75",
                "showLegend": true,
                "centerText": {
                    text: "",
                    fontSize: 46,
                    color: "#5ecc49"
                },
                "data": $scope.ict ? ictEipdata : ($scope.vpcTypeShared ? sharedVpcEipdata : eipdata)
            };

            $scope.help = {
                "helpKey": "drawer_vpc_topo",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.queryVPCTopo = function () {
                var promise = $scope.networkInstance.queryVPCTopo({
                    "cloudInfraId": $scope.cloudInfraId,
                    "vdcId": user.vdcId,
                    "userId": user.id,
                    "vpcId": $scope.vpcId
                });
                var options = {
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId,
                    "isICT": $scope.ict
                };
                promise.then(function (resolvedValue) {
                    var topoIns = new topo("vpc-topo-cavers", resolvedValue, options);
                });
            };

            // 根据网络类型统计网络
            $scope.queryNetworks = function () {
                var promise = $scope.networkInstance.queryNetworks({
                    "cloudInfraId": $scope.cloudInfraId,
                    "vdcId": user.vdcId,
                    "userId": user.id,
                    "vpcId": $scope.vpcId
                });
                promise.then(function (resolvedValue) {
                    if (!resolvedValue) {
                        return;
                    }

                    var directNet = _.filter(resolvedValue.networks, function (item) {
                        return item.networkType === 1;
                    });

                    var innerNet = _.filter(resolvedValue.networks, function (item) {
                        return item.networkType === 2;
                    });
                    var routerNet = _.filter(resolvedValue.networks, function (item) {
                        return item.networkType === 3;
                    });

                    var total = directNet.length + innerNet.length + routerNet.length;
                    networkCirqueOption.centerText.text = $.encoder.encodeForHTML(total);

                    // 内部  路由 直连
                    networksData[0].value = total === 0 ? 0 : Math.round(innerNet.length * 100 / total);
                    networksData[0].name += innerNet.length;
                    networksData[0].tooltip = encoder.encodeForHTML(networksData[0].name);

                    networksData[1].value = total === 0 ? 0 : Math.round(routerNet.length * 100 / total);
                    networksData[1].name += routerNet.length;
                    networksData[1].tooltip = encoder.encodeForHTML(networksData[1].name);

                    networksData[2].value = total === 0 ? 0 : (100 - (networksData[0].value + networksData[1].value));
                    networksData[2].name += directNet.length;
                    networksData[2].tooltip = encoder.encodeForHTML(networksData[2].name);

                    var networkUsageCirque = new cirqueChart(networkCirqueOption);
                });
            };

            // 根据弹性IP
            $scope.queryEIP = function () {
                var option = {
                    "cloudInfraId": $scope.cloudInfraId,
                    "vdcId": user.vdcId,
                    "userId": user.id,
                    "vpcId": $scope.vpcId
                };
                var promise = $scope.eipServiceIns.queryElasticIPAll(option);
                promise.then(function (resolvedValue) {
                    //VM、VPN、SLB、F5、MANUAL_IP,NO_USE
                    var vmEip = 0,
                        vpnEip = 0,
                        slbEip = 0,
                        f5Eip = 0,
                        manualEip = 0,
                        unusedEip = 0,
                        ictVmEip= 0,
                        ictUnusedEip=0;
                    if (resolvedValue && resolvedValue.elasticIPs) {
                        _.each(resolvedValue.elasticIPs, function (item) {
                            //ict场景返回列表usedType字段无效
                            if($scope.ict){
                                if ("BIND" === item.resourceStatus) {
                                    ictVmEip++;
                                }else{
                                    ictUnusedEip++
                                }

                            }else{
                                if (item.usedType === "VM") {
                                    vmEip++;
                                }
                                if (item.usedType === "VPN") {
                                    vpnEip++;
                                }
                                if (item.usedType === "SLB") {
                                    slbEip++;
                                }
                                if (item.usedType === "F5") {
                                    f5Eip++;
                                }
                                if (item.usedType === "MANUAL_IP") {
                                    manualEip++;
                                }
                                if (item.usedType === "NO_USE") {
                                    unusedEip++;
                                }
                            }
                        });
                    }
                    var total = vmEip + vpnEip + slbEip + f5Eip + manualEip + unusedEip;
                    var ictTotol= ictVmEip + ictUnusedEip;
                    if ($scope.ict){
                        eipCirqueOption.centerText.text = ictTotol;
                    }else{
                        eipCirqueOption.centerText.text = total;
                    }
                    if ($scope.ict) {
                        //VM、VPN、SLB、F5、MANUAL_IP,NO_USE
                        ictEipdata[0].value = ictTotol === 0 ? "0" : Math.round(ictVmEip * 100 / ictTotol);
                        ictEipdata[0].name += ictVmEip;
                        ictEipdata[0].tooltip = encoder.encodeForHTML(ictEipdata[0].name);

                        ictEipdata[1].value = ictTotol === 0 ? "0" : (100 - ictEipdata[0].value);
                        ictEipdata[1].name += ictUnusedEip;
                        ictEipdata[1].tooltip = encoder.encodeForHTML(ictEipdata[1].name);
                    }
                    else if (!$scope.vpcTypeShared) {
                        //VM、VPN、SLB、F5、MANUAL_IP,NO_USE
                        eipdata[0].value = total === 0 ? "0" : Math.round(vmEip * 100 / total);
                        eipdata[0].name += vmEip;
                        eipdata[0].tooltip = encoder.encodeForHTML(eipdata[0].name);
                        eipdata[1].value = total === 0 ? "0" : Math.round(vpnEip * 100 / total);
                        eipdata[1].name += vpnEip;
                        eipdata[1].tooltip = encoder.encodeForHTML(eipdata[1].name);
                        eipdata[2].value = total === 0 ? "0" : Math.round(slbEip * 100 / total);
                        eipdata[2].name += slbEip;
                        eipdata[2].tooltip = encoder.encodeForHTML(eipdata[2].name);
                        eipdata[3].value = total === 0 ? "0" : Math.round(f5Eip * 100 / total);
                        eipdata[3].name += f5Eip;
                        eipdata[3].tooltip = encoder.encodeForHTML(eipdata[3].name);
                        eipdata[4].value = total === 0 ? "0" : Math.round(manualEip * 100 / total);
                        eipdata[4].name += manualEip;
                        eipdata[4].tooltip = encoder.encodeForHTML(eipdata[4].name);
                        eipdata[5].value = total === 0 ? "0" : (100 - (eipdata[0].value + eipdata[1].value + eipdata[2].value + eipdata[3].value + eipdata[4].value));
                        eipdata[5].name += unusedEip;
                        eipdata[5].tooltip = encoder.encodeForHTML(eipdata[5].name);
                    }
                    else{
                        eipCirqueOption.centerText.text = vmEip;
                        sharedVpcEipdata[0].value = vmEip === 0 ? "0" : "100";
                        sharedVpcEipdata[0].name += vmEip;
                        sharedVpcEipdata[0].tooltip = encoder.encodeForHTML(sharedVpcEipdata[0].name);
                    }
                    var eipUsageCirque = new cirqueChart(eipCirqueOption);
                });
            };

            // ICT场景需要显示VPC配额
            if ($scope.ict) {

                // -1表示不限制
                var UNLIMITED = -1;

                // defualt color
                var DEFAULT_COLOR = "#1FBE5C";

                var vpcQuotaLeftData = [
                    { name: i18n.vm_term_vmNum_label, color: DEFAULT_COLOR },
                    { name: i18n.common_term_vcpuNum_label, color: DEFAULT_COLOR },
                    { name: i18n.common_term_memory_label, color: DEFAULT_COLOR },
                    { name: i18n.common_term_storage_label, color: DEFAULT_COLOR }
                ];
                var vpcQuotaRightData = [
                    { name: i18n.perform_term_routerOrInnerNetNum_label, color: DEFAULT_COLOR },
                    { name: i18n.eip_term_eip_label, color: DEFAULT_COLOR },
                    { name: i18n.org_term_secuGroupNum_label, color: DEFAULT_COLOR }
                ];
                var vpcQuotaLegend = [
                    { type: 0, color: DEFAULT_COLOR, desc: i18n.common_term_used_value },
                    { type: 0, color: "#CCCCCC", desc: i18n.common_term_available_label }
                ];
                var vpcQuotaLeftSeries = {
                    series: vpcQuotaLeftData
                };
                var vpcQuotaRightSeries = {
                    series: vpcQuotaRightData,
                    legend: vpcQuotaLegend
                };

                var genUIData = function (data) {

                    var UI_UNLIMITED = i18n.common_term_notLimit_value;
                    var GB_UNIT = "GB";
                    var MB_UNIT = "MB";
                    var SLASH_DELIMITER = "/";

                    // 虚拟机
                    var vmData = data.vm;
                    if (vmData) {
                        vpcQuotaLeftData[0].textValue = encoder.encodeForHTML(vmData.inUse + SLASH_DELIMITER + (vmData.reserved === UNLIMITED ? UI_UNLIMITED : vmData.reserved));
                        vpcQuotaLeftData[0].value = vmData.inUse;
                        vpcQuotaLeftData[0].initValue = vmData.limit === UNLIMITED ? vmData.inUse + 50 : vmData.limit;
                        vpcQuotaLeftData[0].maxValue = vmData.limit === UNLIMITED ? vmData.inUse + 100 : vmData.limit + 50;
                    }

                    // CPU核数
                    var cpuData = data.vCPU;
                    if (cpuData) {
                        vpcQuotaLeftData[1].textValue = encoder.encodeForHTML(cpuData.inUse + SLASH_DELIMITER + (cpuData.reserved === UNLIMITED ? UI_UNLIMITED : cpuData.reserved));
                        vpcQuotaLeftData[1].value = cpuData.inUse;
                        vpcQuotaLeftData[1].initValue = cpuData.limit === UNLIMITED ? cpuData.inUse + 50 : cpuData.limit;
                        vpcQuotaLeftData[1].maxValue = cpuData.limit === UNLIMITED ? cpuData.inUse + 100 : cpuData.limit + 50;
                    }
                    // 内存
                    var memData = data.memoryCapacity;
                    if (memData) {
                        vpcQuotaLeftData[2].textValue = encoder.encodeForHTML(memData.inUse + MB_UNIT + SLASH_DELIMITER + (memData.reserved === UNLIMITED ? UI_UNLIMITED : memData.reserved + MB_UNIT));
                        vpcQuotaLeftData[2].value = memData.inUse;
                        vpcQuotaLeftData[2].initValue = memData.limit === UNLIMITED ? memData.inUse + 51200 : memData.limit;
                        vpcQuotaLeftData[2].maxValue = memData.limit === UNLIMITED ? memData.inUse + 102400 : memData.limit + 51200;
                    }
                    // 存储
                    var storageData = data.storageCapacity;
                    if (storageData) {
                        vpcQuotaLeftData[3].textValue = encoder.encodeForHTML(storageData.inUse + GB_UNIT + SLASH_DELIMITER + (storageData.reserved === UNLIMITED ? UI_UNLIMITED : storageData.reserved + GB_UNIT));
                        vpcQuotaLeftData[3].value = storageData.inUse;
                        vpcQuotaLeftData[3].initValue = storageData.limit === UNLIMITED ? storageData.inUse + 250 : storageData.limit;
                        vpcQuotaLeftData[3].maxValue = storageData.limit === UNLIMITED ? storageData.inUse + 500 : storageData.limit + 250;
                    }
                    // 网络使用
                    var netData = data.routedNetwork;
                    if (netData) {
                        vpcQuotaRightData[0].textValue = encoder.encodeForHTML(netData.inUse + SLASH_DELIMITER + (netData.reserved === UNLIMITED ? UI_UNLIMITED : netData.reserved));
                        vpcQuotaRightData[0].value = netData.inUse;
                        vpcQuotaRightData[0].initValue = netData.limit === UNLIMITED ? netData.inUse + 50 : netData.limit;
                        vpcQuotaRightData[0].maxValue = netData.limit === UNLIMITED ? netData.inUse + 100 : netData.limit + 50;
                    }
                    // 弹性IP
                    var eipData = data.publicIp;
                    if (eipData) {
                        vpcQuotaRightData[1].textValue = encoder.encodeForHTML(eipData.inUse + SLASH_DELIMITER + (eipData.reserved === UNLIMITED ? UI_UNLIMITED : eipData.reserved));
                        vpcQuotaRightData[1].value = eipData.inUse;
                        vpcQuotaRightData[1].initValue = eipData.limit === UNLIMITED ? eipData.inUse + 50 : eipData.limit;
                        vpcQuotaRightData[1].maxValue = eipData.limit === UNLIMITED ? eipData.inUse + 100 : eipData.limit + 50;
                    }
                    // 安全组个数
                    var sgData = data.securityGroup;
                    if (sgData) {
                        vpcQuotaRightData[2].textValue = encoder.encodeForHTML(sgData.inUse + SLASH_DELIMITER + (sgData.reserved === UNLIMITED ? UI_UNLIMITED : sgData.reserved));
                        vpcQuotaRightData[2].value = sgData.inUse;
                        vpcQuotaRightData[2].initValue = sgData.limit === UNLIMITED ? sgData.inUse + 50 : sgData.limit;
                        vpcQuotaRightData[2].maxValue = sgData.limit === UNLIMITED ? sgData.inUse + 100 : sgData.limit + 50;
                    }
                };

                $scope.refresh = function () {
                    $scope.queryQuota();
                };
                $scope.queryQuota = function () {
                    var options = {
                        "cloudInfraId": $scope.cloudInfraId,
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "vpcId": $scope.vpcId
                    };
                    var promise = $scope.networkInstance.queryVpcQuota(options);
                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        genUIData(data);
                        $("#vpc-quota-left").find("div").remove();
                        var leftColChart = new Columnchart({
                            "id": "vpc-quota-left",
                            "width": "600",
                            "textWidth": "100px",
                            "isFill": false, //是否填满
                            "bold": "normal", //normal,bold
                            "values": vpcQuotaLeftSeries
                        });
                        // vpc配额右侧图
                        $("#vpc-quota-right").find("div").remove();
                        var rightColChart = new Columnchart({
                            "id": "vpc-quota-right",
                            "width": "600",
                            "textWidth": "100px",
                            "isFill": false, //是否填满
                            "bold": "normal", //normal,bold
                            "values": vpcQuotaRightSeries
                        });
                    });
                };

                $scope.queryDirectNetworks = function(){
                    var promise = $scope.serviceInstance.queryOutNetworks({
                        "isAssociated": true,
                        "vdcId": user.vdcId,
                        "vpcId": $scope.vpcId,
                        "userId": user.id,
                        "cloudInfraId": $scope.cloudInfraId
                    });
                    promise.then(function (data) {
                        var directNets = data.total;
                    });
                };
            }

            //当ui-view视图加载成功后的事件
            $scope.$on("$viewContentLoaded", function () {
                if(!$scope.ict && !$scope.vpcTypeShared){
                    $scope.queryNetworks();
                }
                $scope.queryEIP();
                $scope.queryVPCTopo();
                if ($scope.ict) {
                    $scope.queryQuota();
                }
            });
        }
    ];
    return summaryCtrl;
});
