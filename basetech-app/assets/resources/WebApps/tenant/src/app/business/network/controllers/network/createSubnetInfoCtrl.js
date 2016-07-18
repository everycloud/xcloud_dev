/*global define*/
/*jslint bitwise: true */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/network/controllers/network/createBasicCtrl",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    "fixtures/network/network/createNetworkFixture"
], function ($, angular, _, createBasicCtrl, validatorService, UnifyValid) {
    "use strict";

    var ctrl = ["$scope", "camel", "$compile", "fmLib",
        function ($scope, camel, $compile, fmLib) {
            var i18n = $scope.i18n;
            var validator = new validatorService();
            var ipType = ""; //IP分配方式

            //是否显示dhcp配置，IP分配方式为手动时，显示DHCP配置
            $scope.showDhcpSettings = true;

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
                    inject: i18n.vpc_term_staticInjection_label,
                    auto: i18n.common_term_manual_label,
                    "innerId": "create-network-ipTypeInner",
                    innerValue: "1",
                    injectValue: "3",
                    autoValue: "2"
                },
                subnetIp: {
                    "id": "create-network-subnetIp",
                    label: i18n.common_term_SubnetIP_label + ":",
                    require: true,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"],
                    validate: "required:" + i18n.common_term_null_valid + ";isIpCheck(create-network-subnetIp):" + i18n.common_term_formatIP_valid
                },
                subnetMask: {
                    "id": "create-network-subnetMask",
                    label: i18n.common_term_SubnetMask_label + ":",
                    require: true,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["maskCheck"],
                    validate: "required:" + i18n.common_term_null_valid + ";maskCheck(create-network-subnetMask):" + i18n.common_term_formatSubnetIPandMask_valid + "; "
                },
                gateway: {
                    "id": "create-network-gateway",
                    label: i18n.common_term_gateway_label + ":",
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isGateway"],
                    validate: "required:" + i18n.common_term_null_valid + "; isGateway(create-network-gateway):" + i18n.resource_term_outSubnetOrConflict_valid,
                    validate4innerNet: "isGateway(create-network-gateway):" + i18n.resource_term_outSubnetOrConflict_valid
                },
                dns: {
                    "id": "create-network-domain",
                    label: i18n.common_term_domainName_label + ":",
                    require: false,
                    value: "",
                    width: "295px",
                    "extendFunction": ["domainCheck"],
                    validate: "domainCheck(create-network-domain):" + i18n.common_term_format_valid + "; "
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
                preBtn: {
                    "id": "create-network-selectres-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "selectRes";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-network-selectres-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var validIP = UnifyValid.FormValid($("#createnetworksubnetIp"), undefined);
                        var validMark = UnifyValid.FormValid($("#createnetworksubnetMask"), undefined);
                        var validGateway = UnifyValid.FormValid($("#createnetworkgateway"), undefined);
                        var validIpSegment = UnifyValid.FormValid($("#create-network-subinfo-ipsegments"), undefined);
                        if (!validIP || !validMark || !validGateway || !validIpSegment) {
                            return;
                        }
                        $scope.service.show = "confirm";
                        $("#" + $scope.service.step.id).widget().next();

                        var availableIPRanges = [];
                        for (var i = 1; i <= 16; i++) {
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
                        var subnetMaskDom = $("#create-network-subnetMask");
                        var subnetIpDom = $("#create-network-subnetIp");

                        $scope.service.ipType = ipType; //ip分配方式UI显示
                        $scope.service.iPTypeValue = $("#create-network-ipTypeInner").widget().opChecked();
                        $scope.service.subnetMask = subnetIpDom.widget().getValue() + "/" + subnetMaskDom.widget().getValue();
                        $scope.service.geteway = $("#create-network-gateway").widget().getValue();
                        $scope.service.subnetAddr = subnetIpDom.widget().getValue();
                        $scope.service.subnetPrefix = subnetMaskDom.widget().getValue();
                        $scope.service.availableIPRanges = availableIPRanges;
                        $scope.service.domainName = $("#create-network-domain").widget().getValue();
                        $scope.service.primaryDNS = $("#create-network-priorDns").widget().getValue();
                        $scope.service.secondaryDNS = $("#create-network-optionDns").widget().getValue();
                        $scope.service.primaryWINS = $("#create-network-priorWins").widget().getValue();
                        $scope.service.secondaryWINS = $("#create-network-optionWins").widget().getValue();

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

            //IP分配方式单选按钮事件
            ipType = $scope.info.ipType.inner;
            $scope.ipTypeclick = function (evt) {
                if ("auto" === evt) {
                    $scope.showDhcpSettings = false;
                    ipType = $scope.info.ipType.auto;
                } else {
                    if ("inject" === evt) {
                        ipType = $scope.info.ipType.inject;
                    } else {
                        ipType = $scope.info.ipType.inner;
                    }
                    $scope.showDhcpSettings = true;
                }
            };

            function che(strIP) {
                var str = strIP.split(".");
                var remainder = "";
                var count = 0;
                for (var i = 0; i < str.length; i++) {
                    for (var num = str[i]; num > 0; num = parseInt(num / 2, 10)) {
                        remainder = parseInt(num % 2, 10);
                        if (remainder === 1 && num > 0) {
                            count = count + 1;
                        }
                    }
                }
                return count;
            }

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
                    if (validator.subnetValidator(ipValue, mask, subnet)){
                        return subCheck(fmLib.string2ip(subnet), fmLib.string2ip(mask), fmLib.string2ip(ipValue));
                    }
                }
                return false;
            };
            
            //校验网关和可用IP与预留IP不冲突
            function subCheck(gate, mask, beg, end){
                var sub = gate;
                
                if (beg){
                    if ((beg & mask) != (gate & mask)){
                        return i18n.vpc_term_gatewayNotInSubnet_valid||"网关地址不在子网内";
                    }
                }
                    
                if (end){
                    if ((end & mask) != (gate & mask)){
                        return i18n.vpc_term_gatewayNotInSubnet_valid||"网关地址不在子网内";
                    }
                    
                    if (end <= beg){
                        return i18n.common_term_endGreaterStartIP_valid||"结束IP地址必须大于起始IP地址。";
                    }
                }
                
                function inRange(b1, e1, b2, e2){
                    if (b2){
                        if (e2){
                            return !((e1 < b2) || (b1 > e2));
                        }else{
                            return (b2 <= e1) && (b2 >= b1);
                        }
                    }else{
                        if (e2){
                            return (e2 <= e1) && (e2 >= b1);
                        }
                    }
                    return false;
                }
                
                if (inRange(sub+2, sub+4, beg, end)){
                    return (i18n.resource_term_conflictWithReservedIP_valid||"与预留IP地址冲突")
                        +"("+fmLib.ip2string(sub+2)+"-"+fmLib.ip2string(sub+4)+")";
                }
                
                return true;
            }

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
        }
    ];
    return ctrl;
});
