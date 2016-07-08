/* global define */
/*jslint bitwise: true */
define(["jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/services/httpService",
    'app/services/exceptionService',
    "app/business/network/services/networkService",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    "language/keyID",
    "tiny-directives/IP"
], function ($, angular, _, http, exception, networkService, validatorService, UnifyValid, i18n) {
    "use strict";

    var ctrl = ["$scope", "$q", "camel", "$compile", "exception",
        function ($scope, $q, camel, $compile, exception) {
            var validator = new validatorService();
            var ipType = ""; //IP分配方式
            $scope.i18n = i18n;
            $scope.serviceInstance = new networkService(exception, $q, camel);

            // 父窗口传递的添加对象
            var param = $("#modifySubnetWindow").widget().option("param");
            var networkDetail = param && param.networkInfo;
            $scope.isRouted = networkDetail.routed;

            var ipv4SubnetInfo = networkDetail && networkDetail.ipv4Subnet;

            /**
         * ipv4Subnet中的usedAddrNum>0或 Network中的totalBoundNics>0
         （1）静态注入
         不能修改：IP分配方式、子网IP、子网掩码、网关、dhcp选项（域名、DNS、wins）。
         可以修改：可用IP段。
         （2）内部dhcp
         不能修改：IP分配方式。
         可以修改：子网IP、子网掩码、网关、dhcp选项（域名、DNS、wins）、可用IP段。
         （3）手动
         不能修改：IP分配方式、子网IP、子网掩码、网关。
         */
            $scope.canModify = !(ipv4SubnetInfo.usedAddrNum > 0 || networkDetail.totalBoundNics > 0);

            $scope.close = function () {
                $("#modifySubnetWindow").widget().destroy();
            };

            var IP_SEGMENT_MAX = 16;
            // 初始化可用IP段
            for (var i = 1; i <= IP_SEGMENT_MAX; i++) {
                $scope["availableIpSegment" + i] = {
                    "label": i18n.common_term_enableIPsegment_label + ":",
                    "display": i === 1,
                    "width": "215px",
                    startIp: {
                        "id": "startIp" + i,
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "extendFunction": ["isGateway"],
                        "validate": "isGateway(startIp" + i + "):" + i18n.resource_term_outSubnetOrConflict_valid + "; "
                    },
                    endIp: {
                        "id": "endIp" + i,
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "extendFunction": ["isGateway"],
                        "validate": "isGateway(endIp" + i + "):" + i18n.resource_term_outSubnetOrConflict_valid + ";"
                    }
                };
            }

            $scope.info = {
                ipType: {
                    "id": "create-network-ipType",
                    label: i18n.common_term_IPassignMode_label + ":",
                    require: true,
                    name: "radiogroup-ipType",
                    inner: i18n.common_term_innerDHCP_label,
                    auto: i18n.common_term_manual_label,
                    "innerId": "create-network-ipTypeInner",
                    innerValue: "1",
                    inject: i18n.vpc_term_staticInjection_label,
                    injectValue: "3",
                    autoValue: "2"
                },
                subnetIp: {
                    "id": "create-network-subnetIp",
                    label: i18n.common_term_SubnetIP_label + ":",
                    require: true,
                    value: ipv4SubnetInfo.subnetAddr,
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"],
                    validate: "required:" + i18n.common_term_null_valid + ";isIpCheck(create-network-subnetIp):" + i18n.common_term_formatIP_valid
                },
                subnetMask: {
                    "id": "create-network-subnetMask",
                    label: i18n.common_term_SubnetMask_label + ":",
                    require: true,
                    value: ipv4SubnetInfo.subnetPrefix,
                    type: "ipv4",
                    "extendFunction": ["maskCheck"],
                    validate: "required:" + i18n.common_term_null_valid + ";maskCheck(create-network-subnetMask):" + i18n.common_term_formatSubnetIPandMask_valid
                },
                gateway: {
                    "id": "create-network-gateway",
                    label: i18n.common_term_gateway_label + ":",
                    require: true,
                    value: ipv4SubnetInfo.gateway,
                    type: "ipv4",
                    "extendFunction": ["isGateway"],
                    validate4innerNet: "isGateway(create-network-gateway):" + i18n.resource_term_outSubnetOrConflict_valid + "",
                    validate: "required:" + i18n.common_term_null_valid + ";isGateway(create-network-gateway):" + i18n.resource_term_outSubnetOrConflict_valid + ""
                },
                dns: {
                    "id": "create-network-domain",
                    label: i18n.common_term_domainName_label + ":",
                    require: false,
                    value: "",
                    width: "141px",
                    "extendFunction": ["domainCheck"],
                    validate: "domainCheck(create-network-domain):" + i18n.common_term_domainNameFormatError_valid
                },
                priorDns: {
                    "id": "create-network-priorDns",
                    label: i18n.common_term_activeDNS_label + ":",
                    require: false,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"],
                    validate: "isIpCheck(create-network-priorDns):" + i18n.common_term_formatIP_valid
                },
                optionDns: {
                    "id": "create-network-optionDns",
                    label: i18n.common_term_standbyDNS_label + ":",
                    require: false,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"],
                    validate: "isIpCheck(create-network-optionDns):" + i18n.common_term_formatIP_valid
                },
                priorWins: {
                    "id": "create-network-priorWins",
                    label: i18n.common_term_activeWINS_label + ":",
                    require: false,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"],
                    validate: "isIpCheck(create-network-priorWins):" + i18n.common_term_formatIP_valid
                },
                optionWins: {
                    "id": "create-network-optionWins",
                    label: i18n.common_term_standbyWINS_label + ":",
                    require: false,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"],
                    validate: "isIpCheck(create-network-optionWins):" + i18n.common_term_formatIP_valid
                },
                nextBtn: {
                    "id": "create-network-selectres-next",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var validIP = UnifyValid.FormValid($("#createnetworksubnetIp"), undefined);
                        var validMark = UnifyValid.FormValid($("#createnetworksubnetMask"), undefined);
                        var validGateway = UnifyValid.FormValid($("#createnetworkgateway"), undefined);
                        if (!validIP || !validMark || !validGateway) {
                            return;
                        }

                        param.isOKBttnClick = true;
                        var availableIPRanges = [];
                        for (var i = 1; i <= IP_SEGMENT_MAX; i++) {
                            var id = "availableIpSegment" + i;
                            if ($scope[id].display) {
                                var startIP = $("#" + $scope[id].startIp.id).widget().getValue();
                                var endIP = $("#" + $scope[id].endIp.id).widget().getValue();
                                if (startIP && endIP) {
                                    var IPRange = {
                                        "startIp": startIP,
                                        "endIp": endIP
                                    };
                                    availableIPRanges.push(IPRange);
                                }
                            }
                        }
                        ipv4SubnetInfo.availableIPRanges = availableIPRanges;
                        ipv4SubnetInfo.ipAllocatePolicy = $scope.ipAllocatePolicy;
                        ipv4SubnetInfo.gateway = $("#create-network-gateway").widget().getValue();
                        ipv4SubnetInfo.subnetAddr = $("#create-network-subnetIp").widget().getValue();
                        ipv4SubnetInfo.subnetPrefix = $("#create-network-subnetMask").widget().getValue();
                        if ($scope.ipAllocatePolicy + '' === '2') {
                            ipv4SubnetInfo.dhcpOption = {};
                        } else {
                            ipv4SubnetInfo.dhcpOption = {
                                domainName: $("#create-network-domain").widget().getValue(),
                                primaryDNS: $("#create-network-priorDns").widget().getValue(),
                                secondaryDNS: $("#create-network-optionDns").widget().getValue(),
                                primaryWINS: $("#create-network-priorWins").widget().getValue(),
                                secondaryWINS: $("#create-network-optionWins").widget().getValue()
                            };
                        }
                        var promise = $scope.serviceInstance.updateNetwork({
                            "cloudInfraId": param.cloudInfraId,
                            "vdcId": param.vdcId,
                            "userId": param.userId,
                            "vpcId": param.vpcId,
                            "networkID": param.networkID,
                            "name": networkDetail.name,
                            "subnet": ipv4SubnetInfo,
                            "ipv6subnet": null
                        });
                        promise.then(function () {
                            $scope.close();
                            $scope.$destroy();
                        });
                    }
                },
                cancelBtn: {
                    "id": "create-network-selectres-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                        $scope.$destroy();
                    }
                }
            };

            $scope.ipTypeclick = function (evt) {
                if ("auto" === evt) {
                    $scope.reserveIP = false;
                    $scope.ipAllocatePolicy = $scope.info.ipType.autoValue;
                } else {
                    if ("inject" === evt) {
                        $scope.ipAllocatePolicy = $scope.info.ipType.injectValue;
                    } else {
                        $scope.ipAllocatePolicy = $scope.info.ipType.innerValue;
                    }
                    $scope.reserveIP = true;
                }
            };

            //预留IP 添加与删除事件
            $scope.operate = {
                "addIpv4Ip": function (id) {
                    var addIpName = "availableIpSegment";
                    var addIpId = addIpName + id;
                    var addIpNext = addIpName + (id + 1);
                    if (!$scope[addIpId].display) {
                        $scope[addIpId].display = true;
                    } else {
                        $scope[addIpNext].display = true;
                    }
                },
                "deleteIpv4Ip": function (id) {
                    $scope[id].display = false;
                }
            };

            UnifyValid.isIpCheck = function (ip) {
                if(!ip){
                    return false;
                }
                var ipValue = $("#" + ip).widget().getValue();
                // 为""或者null校验通过
                if(!ipValue){
                    return true;
                }
                return validator.ipValidator(ipValue);
            };

            //校验掩码
            UnifyValid.maskCheck = function () {
                var subnet = $("#create-network-subnetIp").widget().getValue(); //子网IP
                var mask = $("#create-network-subnetMask").widget().getValue(); //子网掩码
                if (validator.ipValidator(mask)) {
                    if (validator.maskValidator(mask)) {
                        return validator.maskAndSubnetValidator(mask, subnet);
                    }
                    return false;
                }
                return false;
            };

            //校验IP在子网内并不与子网、掩码冲突
            UnifyValid.isGateway = function (inputIp) {
                if(!inputIp){
                    return false;
                }
                var ipValue = $("#" + inputIp).widget().getValue();
                // 非必须，""或者null校验通过
                if(!ipValue){
                    return true;
                }
                var subnet = $("#create-network-subnetIp").widget().getValue(); //子网IP
                var mask = $("#create-network-subnetMask").widget().getValue(); //子网掩码
                if (validator.ipValidator(ipValue)) {
                    return validator.subnetValidator(ipValue, mask, subnet);
                }
                return false;

            };

            //域名
            UnifyValid.domainCheck = function (domainId) {
                var domain = $("#" + domainId).widget().getValue();
                if (!domain) {
                    return true;
                }
                if (domain.match(new RegExp(validator.domainName))) {
                    return true;
                }
                else {
                    return false;
                }
            };

            $scope.initDefaultNet = function () {
                $scope.ipAllocatePolicy = ipv4SubnetInfo.ipAllocatePolicy;
                $scope.reserveIP = ($scope.ipAllocatePolicy + '' !== '2');
                $scope.info.subnetIp.value = ipv4SubnetInfo.subnetAddr;
                $scope.info.subnetMask.value = ipv4SubnetInfo.subnetPrefix;
                $scope.info.gateway.value = ipv4SubnetInfo.gateway;

                if (ipv4SubnetInfo.dhcpOption) {
                    $scope.info.dns.value = ipv4SubnetInfo.dhcpOption.domainName;
                    $scope.info.priorDns.value = ipv4SubnetInfo.dhcpOption.primaryDNS;
                    $scope.info.optionDns.value = ipv4SubnetInfo.dhcpOption.secondaryDNS;
                    $scope.info.priorWins.value = ipv4SubnetInfo.dhcpOption.primaryWINS;
                    $scope.info.optionWins.value = ipv4SubnetInfo.dhcpOption.secondaryWINS;
                }

                if (ipv4SubnetInfo.availableIPRanges) {
                    var total = ipv4SubnetInfo.availableIPRanges.length;
                    for (var index = 1; index <= total; index++) {
                        var id = "availableIpSegment" + index;
                        $scope[id].display = true;
                        $scope[id].startIp.value = ipv4SubnetInfo.availableIPRanges[index - 1].startIp;
                        $scope[id].endIp.value = ipv4SubnetInfo.availableIPRanges[index - 1].endIp;
                    }
                }
            };
            $scope.initDefaultNet();
        }
    ];

    var dependency = [
        "ng", "wcc"
    ];
    var modifySubnetWindowModule = angular.module("modifySubnetWindowModule", dependency);
    modifySubnetWindowModule.controller("modifysubnetInfoCtrl", ctrl);
    modifySubnetWindowModule.service("camel", http);
    modifySubnetWindowModule.service("exception", exception);

    return modifySubnetWindowModule;
});
