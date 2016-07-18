/*global define*/
define([
        'tiny-lib/angular',
        'tiny-lib/jquery',
        "app/services/httpService",
        "app/business/network/services/networkService",
        'app/services/exceptionService',
        "language/keyID",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-widgets/Window",
        "tiny-directives/Step",
        "tiny-directives/Table",
        "tiny-directives/RadioGroup",
        "tiny-directives/Select",
        "tiny-directives/Radio",
        "tiny-directives/IP"
    ],
    function (angular, $, http, networkService, exception, i18n) {
        "use strict";
        var createNetworkICTCtrl = ["$rootScope", "camel", "$q", "exception",
            function ($rootScope, camel, $q, exception) {
                var htmlDom = $("html");
                var user = htmlDom.scope().user;
                var stateParams = htmlDom.injector().get("$stateParams");
                var opt = stateParams.opt;
                var networkID = stateParams.networkID;
                var $state = htmlDom.injector().get("$state");

                var networkServiceIns = new networkService(exception, $q, camel);

                $rootScope.close = function () {
                    $state.go("network.vpcmanager.ictnetwork");
                };

                $rootScope.step = {
                    "id": "create-network-step",
                    "values1": [i18n.common_term_basicInfo_label, i18n.vpc_term_setNet_button, i18n.common_term_confirmInfo_label],
                    "width": 592,
                    show : "basicInfoICT"
                };

                //公共数据
                $rootScope.service = {
                    "cloudInfraId": (stateParams && stateParams.cloud_infras),
                    "vpcId": (stateParams && stateParams.vpcId),
                    "networkID": (stateParams && stateParams.networkID),
                    "azId": (stateParams && stateParams.azId),
                    "name": "",
                    "description": "",
                    "type": "", //ip分配方式
                    "iPTypeValue": 0, //枚举值
                    "vlan": "",//vlan/vxlan号
                    "directId": "",
                    "ouNetworkInfo": "",
                    "subnetAddr": "", //子网
                    "subnetPrefix": "", //掩码
                    "gateway": "", //网关
                    "availableIPRanges": "", //预留IP
                    "startIP": "", //开始IP
                    "endIP": "", //结束IP
                    "primaryDNS": "", //首选DNS
                    "secondaryDNS": "", //备选DNS
                    "ipv6subnet": {
                        "ipAllocatePolicy": "2", //ip分配方式 默认手动
                        "subnetAddr": "",
                        "subnetPrefix": "",
                        "gateway": "",
                        "availableIPRanges": [],
                        "dhcpOption": {
                            "domainName": "",
                            "primaryDNS": "",
                            "secondaryDNS": "",
                            "primaryWINS": "",
                            "secondaryWINS": ""
                        }
                    },
                    "ipv6Flag": false,
                    paraSetting: {
                        show:false,
                        typeName:"vlan",
                        phyNetwork:"",
                        selectVlanValues: [],
                        phyNetworkValues:[]
                    }
                };

                $rootScope.isIpv4Checked = true;
                $rootScope.isIpv6Checked = false;
                $rootScope.service.iPTypeValue = "1"; // ipv4子网创建方式 默认内部
                $rootScope.service.ipv6subnet.ipAllocatePolicy = "1"; // ipv6子网创建方式 默认内部

                $rootScope.isSubChecked = true;
                $rootScope.isModifyMode = (stateParams && stateParams.opt && stateParams.opt === 'modify') ? true : false;

                //定义变量保存当前查询的网络信息
                $rootScope.data = "";
                if (opt === "modify") {
                    queryDetail(networkID, stateParams.cloud_infras, stateParams.vpcId);
                }else{
                    //查询vlanpools
                    queryVlanpools();
                }

                function queryDetail(networkId, cloudId, vpcId) {
                    var options = {
                        "vdcId": user.vdcId,
                        "vpcId": vpcId,
                        "networkID": networkId,
                        "cloudInfraId": cloudId,
                        "userId": user.id
                    };
                    var promise = networkServiceIns.queryNetworkDetail(options);
                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $rootScope.data = data;
                        initDefaultNet();
                    });
                }

                function initDefaultNet() {
                    // 选择的网络类型
                    $rootScope.isSubChecked = ($rootScope.data.ipv4Subnet || $rootScope.data.ipv6Subnet) ? true : false;

                    $rootScope.service.vlan = $rootScope.data.vlan;
                    if($rootScope.data.routed){
                        $rootScope.service.type = i18n.vpc_term_routerNet_label;
                    }
                    //显示物理网络
                    var phyNetworkValues=[];
                    $rootScope.service.paraSetting.show=true;
                    //物理网络selectValue
                    if($rootScope.data && $rootScope.data.physicalNetworkName){
                        $rootScope.service.paraSetting.typeName = 'vlan';
                        $rootScope.service.paraSetting.phyNetwork = $rootScope.data.physicalNetworkName;
                        phyNetworkValues.push({"selectId":$rootScope.data.physicalNetwork,"label":$rootScope.data.physicalNetworkName,checked:true})
                        $rootScope.service.paraSetting.phyNetworkValues=phyNetworkValues;
                    }else{
                        $rootScope.service.paraSetting.typeName = 'vxlan';
                    }
                    var vlanSelects=[
                        {selectId: "vlan", label: "vlan", checked: $rootScope.service.paraSetting.typeName === 'vlan'},
                        {selectId: "vxlan", label: "vxlan", checked: $rootScope.service.paraSetting.typeName === 'vxlan'}
                    ]
                    $rootScope.service.paraSetting.selectVlanValues=vlanSelects;

                    $rootScope.isIpv4Checked = false;
                    $rootScope.isIpv6Checked = false;
                    // 配置了IPV4
                    if ($rootScope.data.ipv4Subnet) {
                        $rootScope.isIpv4Checked = true;
                        $rootScope.service.iPTypeValue = $rootScope.data.ipv4Subnet.ipAllocatePolicy;

                        $rootScope.service.subnetAddr = $rootScope.data.ipv4Subnet.subnetAddr;
                        $rootScope.service.subnetPrefix = $rootScope.data.ipv4Subnet.subnetPrefix;
                        $rootScope.service.gateway = $rootScope.data.ipv4Subnet.gateway;

                        if ($rootScope.data.ipv4Subnet.availableIPRanges) {
                            $rootScope.service.availableIPRanges = $rootScope.data.ipv4Subnet.availableIPRanges;
                        }

                        if ($rootScope.data.ipv4Subnet.dhcpOption) {
                            $rootScope.service.domainName = $rootScope.data.ipv4Subnet.dhcpOption.domainName;
                            $rootScope.service.primaryDNS = $rootScope.data.ipv4Subnet.dhcpOption.primaryDNS;
                            $rootScope.service.secondaryDNS = $rootScope.data.ipv4Subnet.dhcpOption.secondaryDNS;
                            $rootScope.service.primaryWINS = $rootScope.data.ipv4Subnet.dhcpOption.primaryWINS;
                            $rootScope.service.secondaryWINS = $rootScope.data.ipv4Subnet.dhcpOption.secondaryWINS;
                        }
                    }
                    // 配置了IPV6
                    if ($rootScope.data.ipv6Subnet) {
                        $rootScope.isIpv6Checked = true;
                        $rootScope.service.ipv6subnet.ipAllocatePolicy = $rootScope.data.ipv6Subnet.ipAllocatePolicy;

                        $rootScope.service.ipv6subnet.subnetAddr = $rootScope.data.ipv6Subnet.subnetAddr;
                        $rootScope.service.ipv6subnet.subnetPrefix = $rootScope.data.ipv6Subnet.subnetPrefix;
                        $rootScope.service.ipv6subnet.gateway = $rootScope.data.ipv6Subnet.gateway;

                        if ($rootScope.data.ipv6Subnet.availableIPRanges) {
                            $rootScope.service.ipv6subnet.availableIPRanges = $rootScope.data.ipv6Subnet.availableIPRanges;
                        }

                        if ($rootScope.data.ipv6Subnet.dhcpOption) {
                            $rootScope.service.ipv6subnet.domainName = $rootScope.data.ipv6Subnet.dhcpOption.domainName;
                            $rootScope.service.ipv6subnet.primaryDNS = $rootScope.data.ipv6Subnet.dhcpOption.primaryDNS;
                            $rootScope.service.ipv6subnet.secondaryDNS = $rootScope.data.ipv6Subnet.dhcpOption.secondaryDNS;
                            $rootScope.service.ipv6subnet.primaryWINS = $rootScope.data.ipv6Subnet.dhcpOption.primaryWINS;
                            $rootScope.service.ipv6subnet.secondaryWINS = $rootScope.data.ipv6Subnet.dhcpOption.secondaryWINS;
                        }
                    }
                }
                function queryVlanpools() {
                    var options = {
                        "vdcId": user.vdcId,
                        "cloudInfraId": stateParams.cloud_infras,
                        "userId": user.id,
                        "params" : {
                            "vpcID": stateParams.vpcId
                        }
                    };
                    var promise = networkServiceIns.queryVlanPools(options);
                    promise.then(function (data) {
                        var vlanpools={};
                        var vlanSelects=[
                            {selectId: "vlan", label: "vlan", checked: true},
                            {selectId: "vxlan", label: "vxlan"}
                        ];
                        if (!data) {
                            return;
                        }
                        $rootScope.service.paraSetting.phyNetworkValues=null;
                        var phyNetworkValues=[]
                        vlanpools = data.queryVlanPoolResp.vlanpools;
                        for( var index in vlanpools){
                            phyNetworkValues.push({"selectId":vlanpools[index].name,"label":vlanpools[index].name,checked:false});
                        }
                        if(phyNetworkValues&&phyNetworkValues.length>0){
                            phyNetworkValues[0].checked=true;
                        }
                        $rootScope.service.paraSetting.phyNetworkValues=phyNetworkValues;
                        $rootScope.service.paraSetting.selectVlanValues=vlanSelects;

                    });
                }
            }
        ];
        return createNetworkICTCtrl;
    });
