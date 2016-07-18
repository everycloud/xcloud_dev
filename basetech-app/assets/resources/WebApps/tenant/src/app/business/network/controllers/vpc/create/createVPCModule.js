/*global define*/
define(['tiny-lib/jquery',
    'tiny-common/UnifyValid',
    "app/business/network/services/networkService",
    "app/services/httpService",
    'app/services/exceptionService',
    'app/services/competitionConfig',
    'tiny-directives/Step',
    "fixtures/network/network/networkListFixture"
], function ($,UnifyValid, networkService, http, exception, competitionConfig) {
    "use strict";

    var createVPCCtrl = ["$scope","$q", "camel", function ($scope, $q, camel) {
        var i18n = $scope.i18n;
        var user = $scope.user;
        $scope.isICT = user.cloudType === "ICT";
        $scope.vmwareICT = competitionConfig.isBaseOnVmware;
        var networkInstance = new networkService(exception, $q, camel);

        // default vdcQuota
        var vdcQuota = {"CPU": -1, "MEMORY": -1, "STORAGE": -1, "EIP": -1, "SEG": -1, "VM": -1, "VPC":-1};
        // -1表示不限制
        var UNLIMITED = -1;
        var MAXQUATO = 2147483648;
        //VDC是否限额
        var IsLimitVDC = true;
        //cpv规格模板
        var vpcSpec={};
        // 0 直连网络,1直连+路由,2直连+路由+VPN,3直连+路由+内部+VPN,4自定义
        $scope.VPC_TYPE = {
            "DIRECT": "0",
            "DIRECT_ROUTER": "1",
            "DIRECT_ROUTER_VPN": "2",
            "DIRECT_ROUTER_EXTEND_VPN": "3",
            "CUSTOM": "4",
            "INNERNET": "5" //ICT
        };

        // 事件定义 选择了直连网络
        $scope.events = {
            "selectDirectNet": "selectDirectNet",
            "selectDirectNetFromParent": "selectDirectNetFromParent"
        };

        // 事件转发
        $scope.$on($scope.events.selectDirectNet, function (event, msg) {
            $scope.$broadcast($scope.events.selectDirectNetFromParent, msg);
        });

        $scope.quotaService={
            //模板规格
            value: {
                maxValue:{
                    vMNum: "",
                    vCPUNum: "",
                    memoryCapacity: "",
                    storageCapacity: "",
                    routedNetworkNum: "",
                    publicIpNum: "",
                    securityGroupNum: ""
                },
                minValue:{
                    vMNum: "",
                    vCPUNum: "",
                    memoryCapacity: "",
                    storageCapacity: "",
                    routedNetworkNum: "",
                    publicIpNum: "",
                    securityGroupNum: ""
                },
                defaultValue:{
                    vMNum: "",
                    vCPUNum: "",
                    memoryCapacity: "",
                    storageCapacity: "",
                    routedNetworkNum: "",
                    publicIpNum: "",
                    securityGroupNum: ""
                }

            },
            tip:{
                vMNum: "",
                vCPUNum: "",
                memoryCapacity: "",
                storageCapacity: "",
                routedNetworkNum: "",
                publicIpNum: "",
                securityGroupNum: ""
            },
            vpcNum:true

        }

        $scope.service = {
            "step": {
                "id": "create-vpc-step",
                "values": [i18n.common_term_basicInfo_label, i18n.vpc_vpc_add_para_cfg_label, i18n.common_term_confirmInfo_label],
                "width": 592,
                "jumpable": false
            },
            "show": "basicInfo",

            "user": user,
            "isICT": user.cloudType === "ICT",
            "name": "",
            "description": "",

            // 直连网络信息
            direct: {
                "name": "",
                "description": "",
                "extNetworkId": "",
                "vlanId": ""
            },
            // 路由网络信息
            router: {
                "name": "",
                "description": "",
                "routerType": "1", // 默认路由类型是硬件路由器
                "routerTypeUI": i18n.common_term_hardware_label, // 默认路由类型是硬件路由器
                "supportVxlan": false, // 路由器是否支持Vxlan IT场景下需要显示是否支持VXLAN
                "gateway": "",
                "ipAllocatePolicy": 1, // 内部DHCP
                "ipType":"",
                "subnetAddr": "",
                "subnetPrefix": "255.255.255.0",
                "subnetAndMark": ""
            },
            // 内部网络信息
            internal: {
                "name": "",
                "description": "",
                "gateway": "",
                "ipAllocatePolicy": 1,
                "ipType":"",
                "subnetAddr": "",
                "subnetPrefix": "255.255.255.0",
                "subnetAndMark": ""
            },
            "type": $scope.VPC_TYPE.CUSTOM, //初始化默认自定义
            "azIDs": "",
            "azValues": [],
            "cloudInfraId": "",
            "resourcepools": [],
            "progressInfo": "",
            "progressStepInfo": [],
            "showConfirmInfo": true,
            "showProgressbar": false, // 是否显示进度条
            "progress": 0,
            "forceInterrupt": false,
            vpcSpec:{}
        };

        if($scope.isICT){
            $scope.service.step.values = [
                i18n.common_term_basicInfo_label,
                i18n.org_term_quotaMgt_button,
                i18n.vpc_vpc_add_para_cfg_label,
                i18n.common_term_confirmInfo_label];
        }

        function getDate(){
            var params = {
                "cloudInfraId": $scope.cloudInfraId,
                "vdcId": user.vdcId,
                "userId": user.id
            };
            var vpcPromise = $scope.getVpcSpec(params);
            var vdcQuotaPromise = $scope.getVdcQuota(params);
            $.when(vpcPromise,vdcQuotaPromise).done(function () {
//                判断vpc个数是否超过最大值
                $scope.quotaService.vpcNum=(-1===vdcQuota.VPC||vdcQuota.VPC>0)?true:false;
                /**上下限配置规格：
                 * 下限 = 后台传入参数的下限
                 * 上限 = 当前VPC所属VDC的剩余配额与VPC模板规格的最小值
                 */
                $scope.quotaService.value.minValue.vMNum =1;
                $scope.quotaService.value.maxValue.vMNum = getLimit(vdcQuota.VM);

                // CPU核数
                $scope.quotaService.value.minValue.vCPUNum =1;
                $scope.quotaService.value.maxValue.vCPUNum = getLimit(vdcQuota.CPU);

                // 内存
                $scope.quotaService.value.minValue.memoryCapacity =1;
                $scope.quotaService.value.maxValue.memoryCapacity = getLimit(vdcQuota.MEMORY);

                // 存储
                $scope.quotaService.value.minValue.storageCapacity =1;
                $scope.quotaService.value.maxValue.storageCapacity = getLimit(vdcQuota.STORAGE);

                // 网络使用(VDC没有对网络的限制，直接取VPC模板值)
                $scope.quotaService.value.minValue.routedNetworkNum =0;
                $scope.quotaService.value.maxValue.routedNetworkNum = 200;

                // 弹性IP
                $scope.quotaService.value.minValue.publicIpNum =1;
                $scope.quotaService.value.maxValue.publicIpNum = UNLIMITED === vdcQuota.EIP? 200 : vdcQuota.EIP;

                // 安全组个数
                $scope.quotaService.value.minValue.securityGroupNum =0;
                $scope.quotaService.value.maxValue.securityGroupNum = UNLIMITED === vdcQuota.SEG ? 500 : vdcQuota.SEG;

                //默认值
                if(!IsLimitVDC){
                    $scope.quotaService.value.defaultValue.vMNum=vpcSpec.maxVMNum;
                    $scope.quotaService.value.defaultValue.vCPUNum=vpcSpec.maxVCPUNum;
                    $scope.quotaService.value.defaultValue.memoryCapacity=vpcSpec.maxMemoryCapacity;
                    $scope.quotaService.value.defaultValue.storageCapacity=vpcSpec.maxStorageCapacity;
                    $scope.quotaService.value.defaultValue.routedNetworkNum=vpcSpec.maxRoutedNetworkNum;
                    $scope.quotaService.value.defaultValue.publicIpNum=vpcSpec.maxPublicIpNum;
                    $scope.quotaService.value.defaultValue.securityGroupNum=vpcSpec.maxSecurityGroupNum;
                }else{
                    ;
                }


                //提示信息
                tipsFunctory($scope.quotaService.tip,$scope.quotaService.value);

            });
        }

        $scope.getVpcSpec = function (options) {
            var retDefer = $.Deferred();
            var deferred = networkInstance.queryVpcspectemplates(options);
            deferred.then(function (data) {
                if (!data) {
                    retDefer.reject(data);
                    return;
                }
                vpcSpec = data;
                retDefer.resolve();
            });
            return retDefer.promise();
        };
        $scope.getVdcQuota = function (options) {
            var retDefer = $.Deferred();
            var deferred = networkInstance.queryVdcQuota(options);
            deferred.then(function (data) {
                if (!data || !data.quotaDistribution) {
                    retDefer.reject(data);
                    return;
                }
                // allQuota为true，表示所有都不限制；此时后台quotaInfo字段为null
                if (data.allQuota) {
                    IsLimitVDC = false;
                    retDefer.resolve();
                    return;
                }
                //vdcQuota 剩余量
                _.each(data.quotaInfo, function (total) {
                    _.each(data.quotaDistribution, function (left) {
                        if (total.quotaName === left.quotaName) {
                            vdcQuota[total.quotaName] = total.limit - left.limit;
                        }
                    });
                });
                retDefer.resolve();
            });
            return retDefer.promise();
        };
        // 生成tips
        function tipsFunctory(obj1,obj2) {
            if (!obj1) {
                return "";
            }
            for(var index in obj1)
            {
                if(-1 ===obj2.maxValue[index] ){
                    obj1[index] = i18n.sprintf(i18n.common_term_greaterOrNagitive1_valid, $.encoder.encodeForHTML(obj2.minValue[index]-1),MAXQUATO)
                }else if(obj2.maxValue[index]<obj2.minValue[index]){
                    obj1[index] = i18n.sprintf(i18n.vpc_vpc_add_info_insufficient_valid);

                }else{
                    obj1[index]=i18n.sprintf(i18n.common_term_rangeInteger_valid, $.encoder.encodeForHTML(obj2.minValue[index]), $.encoder.encodeForHTML(obj2.maxValue[index]));
                }

            }
        }
        function getLimit(vdcQuota){
            if(UNLIMITED===vdcQuota){
                return UNLIMITED;
            }
            return vdcQuota;

        }
        if($scope.isICT){
            getDate();
        }

    }];
    return createVPCCtrl;
});
