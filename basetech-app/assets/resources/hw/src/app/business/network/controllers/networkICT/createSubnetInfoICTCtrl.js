/*global define*/
/*jslint bitwise: true */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    "app/business/network/services/networkService",
    "language/keyID",
    "fixtures/network/network/createNetworkFixture"
], function ($, angular, _, validatorService, UnifyValid, networkService, i18n) {
    "use strict";

    var ctrl = ["$rootScope", "$scope", "camel", "$compile", "$q", "exception",
        function ($rootScope, $scope, camel, $compile, $q, exception) {
            var networkServiceIns = new networkService(exception, $q, camel);
            var ipTypeMap = {"1": i18n.common_term_innerDHCP_label,
                "2": i18n.common_term_manual_label,
                "3": i18n.vpc_term_staticInjection_label
            };
            var ipType = ""; //IP分配方式

            // ICT场景修改网络时，对已有的子网信息不能修改
            $scope.ipv4InfoDisable = false;
            $scope.ipv6InfoDisable = false;
            $scope.i18n = i18n;

            $scope.info = {
                ipv4: {
                    "label": "",
                    "id": "createIPv4Id",
                    "text": "IPv4",
                    "checked": true,
                    "change": function () {
                        $rootScope.isIpv4Checked = $('#createIPv4Id').widget().option("checked");

                        var ipv4TotalDisable = $scope.ipv4InfoDisable || !$rootScope.isIpv4Checked;
                        // 子网、掩码、网关等的disable（规避ip控件无法disable问题）
                        $("#create-networkICT-subnetIp").widget().setDisable(ipv4TotalDisable);
                        $("#create-networkICT-subnetMask").widget().setDisable(ipv4TotalDisable);
                        $("#create-networkICT-gateway").widget().setDisable(ipv4TotalDisable);
                        $("#create-network-priorDns").widget().setDisable(ipv4TotalDisable);
                        $("#create-network-optionDns").widget().setDisable(ipv4TotalDisable);

                        for (var i = 1; i <= 16; i++) {
                            var id = "availableIpSegment" + i;
                            if ($scope[id].display) {
                                $("#" + $scope[id].startIp.id).widget().setDisable(ipv4TotalDisable);
                                $("#" + $scope[id].endIp.id).widget().setDisable(ipv4TotalDisable);
                            }
                        }
                    }
                },
                ipv6: {
                    "id": "createIPv6Id",
                    "text": "IPv6",
                    "checked": false,
                    "change": function () {
                        $rootScope.isIpv6Checked = $('#createIPv6Id').widget().option("checked");
                    }
                },
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
                    "id": "create-networkICT-subnetIp",
                    label: i18n.common_term_SubnetIP_label + ":",
                    require: true,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"],
                    /*"validate: "required:必填项; isIpCheck(create-networkICT-subnetIp):IP不能以127开头"*/
                    validate: "required:" + i18n.common_term_null_valid
                },
                subnetMask: {
                    "id": "create-networkICT-subnetMask",
                    label: i18n.common_term_SubnetMask_label + ":",
                    require: true,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["maskCheck"],
                    /*validate: "required:必填项;  maskCheck(create-networkICT-subnetMask):输入不合规范; "*/
                    validate: "required:" + i18n.common_term_null_valid
                },
                gateway: {
                    "id": "create-networkICT-gateway",
                    label: i18n.common_term_gateway_label + ":",
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isGateway"],
                    /*validate: "required:必填项; isGateway(create-networkICT-gateway):不在子网范围或与预留IP冲突"*/
                    validate: "required:" + i18n.common_term_null_valid
                },
                priorDns: {
                    "id": "create-network-priorDns",
                    label: i18n.common_term_activeDNS_label + ":",
                    require: false,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"]
                    /*,
                 validate: "isIpCheck(create-network-priorDns):IP不能以127开头"*/
                },
                optionDns: {
                    "id": "create-network-optionDns",
                    label: i18n.common_term_standbyDNS_label + ":",
                    require: false,
                    value: "",
                    type: "ipv4",
                    "extendFunction": ["isIpCheck"]
                    /*,
                 validate: "isIpCheck(create-network-optionDns):IP不能以127开头"*/
                },
                preBtn: {
                    "id": "create-network-selectres-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.step.show = "selectResICT";
                        $("#" + $scope.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-network-selectres-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        if ($('#createIPv4Id').widget().option("checked")) {
                            var validIP = UnifyValid.FormValid($("#createnetworkICTsubnetIp"), undefined);
                            var validMark = UnifyValid.FormValid($("#createnetworkICTsubnetMask"), undefined);
                            var validGateway = UnifyValid.FormValid($("#createnetworkICTgateway"), undefined);
                            if (!validIP || !validMark || !validGateway) {
                                return;
                            }

                            var availableIPRanges = [];
                            // IP分配方式非手动时
                            if ($scope.reserveIP) {
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
                            }

                            var subnetIpDom = $("#create-networkICT-subnetIp");
                            var subnetMaskDom = $("#create-networkICT-subnetMask");
                            //保存页面信息
                            var ipTypeSelectVal = $("#create-network-ipTypeInner").widget().opChecked();
                            $rootScope.service.ipType = ipTypeMap[ipTypeSelectVal]; //ip分配方式
                            $rootScope.service.iPTypeValue = ipTypeSelectVal;
                            $rootScope.service.subnetMask = subnetIpDom.widget().getValue() + "/" + subnetMaskDom.widget().getValue();
                            if($("#create-networkICT-gateway").widget().getValue() !== ""){
                                $rootScope.service.geteway = $("#create-networkICT-gateway").widget().getValue();
                            }
                            $rootScope.service.subnetAddr = subnetIpDom.widget().getValue();
                            $rootScope.service.subnetPrefix = subnetMaskDom.widget().getValue();
                            $rootScope.service.availableIPRanges = availableIPRanges;
                            $rootScope.service.primaryDNS = $("#create-network-priorDns").widget().getValue();
                            $rootScope.service.secondaryDNS = $("#create-network-optionDns").widget().getValue();
                        }
                        if ($('#createIPv6Id').widget().option("checked")) {
                            $rootScope.service.ipv6Flag = true;

                            var validIPv6 = UnifyValid.FormValid($("#createnetworkICTsubnetIPv6Ip"), undefined);
                            var validMarkv6 = UnifyValid.FormValid($("#createnetworkICTsubnetIPv6Mask"), undefined);
                            var validGatewayv6 = UnifyValid.FormValid($("#createnetworkICTgatewayIPv6"), undefined);
                            if (!validIPv6 || !validMarkv6 || !validGatewayv6) {
                                return;
                            }

                            var availableIPRangesv6 = [];
                            if ($scope.reservev6IP) {
                                for (var k = 1; k <= 16; k++) {
                                    var idv6 = "ipv6IpSegment" + k;
                                    if ($scope[idv6].display) {
                                        var startIPv6 = $("#" + $scope[idv6].startIp.id).widget().getValue();
                                        var endIPv6 = $("#" + $scope[idv6].endIp.id).widget().getValue();
                                        if (startIPv6 && endIPv6) {
                                            var IPRangev6 = {
                                                "startIp": startIPv6,
                                                "endIp": endIPv6
                                            };
                                            availableIPRangesv6.push(IPRangev6);
                                        }
                                    }
                                }
                            }

                            var subnetIpipv6Dom = $("#create-networkICT-subnetIpipv6");
                            var subnetMaskIPv6Dom = $("#create-networkICT-subnetMaskIPv6");
                            $rootScope.service.ipv6subnet.ipType = ipv6Type;
                            $rootScope.service.ipv6subnet.ipAllocatePolicy = "2";
                            $rootScope.service.ipv6subnet.subnetMask = subnetIpipv6Dom.widget().getValue() + "/" + subnetMaskIPv6Dom.widget().getValue();
                            $rootScope.service.ipv6subnet.gateway = $("#create-networkICT-gatewayipv6").widget().getValue();
                            $rootScope.service.ipv6subnet.subnetAddr = subnetIpipv6Dom.widget().getValue();
                            $rootScope.service.ipv6subnet.subnetPrefix = subnetMaskIPv6Dom.widget().getValue();
                            $rootScope.service.ipv6subnet.availableIPRanges = availableIPRangesv6;
                            $rootScope.service.ipv6subnet.dhcpOption.primaryDNS = $("#create-network-priorDnsipv6").widget().getValue();
                            $rootScope.service.ipv6subnet.dhcpOption.secondaryDNS = $("#create-network-optionDnsipv6").widget().getValue();

                        }
                        $scope.step.show = "directConfirmICT";

                        $("#" + $scope.step.id).widget().next();
                        $("#showConfirmInfo").css('display', 'block');
                        $("#isShow").css("display", "block");

                    }
                },
                cancelBtn: {
                    "id": "create-network-selectres-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            // 初始化IPV4 IP段
            for (var i = 1; i <= 16; i++) {
                $scope["availableIpSegment" + i] = {
                    "label": i18n.common_term_enableIPsegment_label + ":",
                    "display": i === 1,
                    "width": "215px",
                    startIp: {
                        "id": "startIp" + i,
                        "type": "ipv4",
                        "value": "",
                        "disable": false
                    },
                    endIp: {
                        "id": "endIp" + i,
                        "type": "ipv4",
                        "value": "",
                        "disable": false
                    }
                };
            }

            //预留IP 添加与删除事件
            $scope.operate = {
                "addIpv4Ip": function (id) {
                    if ($scope.ipv4InfoDisable || !$rootScope.isIpv4Checked) {
                        return;
                    }
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
                    if ($scope.ipv4InfoDisable || !$rootScope.isIpv4Checked) {
                        return;
                    }
                    $scope[id].display = false;
                },
                "addIpv6Ip": function (id) {
                    if ($scope.ipv6InfoDisable || !$rootScope.isIpv6Checked) {
                        return;
                    }
                    var addIpName = "ipv6IpSegment";
                    var addIpId = addIpName + id;
                    var addIpNext = addIpName + (id + 1);
                    if (!$scope[addIpId].display) {
                        $scope[addIpId].display = true;
                    } else {
                        $scope[addIpNext].display = true;
                    }
                },
                "deleteIpv6Ip": function (id) {
                    if ($scope.ipv6InfoDisable || !$rootScope.isIpv6Checked) {
                        return;
                    }
                    $scope[id].display = false;
                }
            };

            $scope.reserveIP = ($rootScope.service.iPTypeValue + "" === "1");
            //IP分配方式单选按钮事件
            ipType = $scope.info.ipType.inner;
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

            $scope.ipv6 = {
                ipType: {
                    "id": "create-network-ipType",
                    label: i18n.common_term_IPassignMode_label + ":",
                    require: true,
                    name: "radiogroup-ipv6Type",
                    inner: i18n.common_term_innerDHCP_label,
                    inject: i18n.vpc_term_staticInjection_label,
                    auto: i18n.common_term_manual_label,
                    "innerId": "create-network-ipv6TypeInner",
                    innerValue: "1",
                    injectValue: "3",
                    autoValue: "2"
                },
                subnetIp: {
                    "id": "create-networkICT-subnetIpipv6",
                    label: i18n.common_term_SubnetIP_label + ":",
                    require: true,
                    value: "",
                    type: "input",
                    validate: "required:" + i18n.common_term_null_valid
                },
                subnetMask: {
                    "id": "create-networkICT-subnetMaskIPv6",
                    label: i18n.common_term_SubnetMask_label + ":",
                    require: true,
                    value: "",
                    type: "input",
                    validate: "required:" + i18n.common_term_null_valid
                },
                gateway: {
                    "id": "create-networkICT-gatewayipv6",
                    label: i18n.common_term_gateway_label + ":",
                    value: "",
                    type: "input",
                    validate: "required:" + i18n.common_term_null_valid
                },
                priorDns: {
                    "id": "create-network-priorDnsipv6",
                    label: i18n.common_term_activeDNS_label + ":",
                    require: false,
                    value: "",
                    type: "input"
                },
                optionDns: {
                    "id": "create-network-optionDnsipv6",
                    label: i18n.common_term_standbyDNS_label + ":",
                    require: false,
                    value: "",
                    type: "input"
                }
            };

            //ipv6
            $scope.reservev6IP = ($rootScope.service.ipv6subnet.ipAllocatePolicy + "" === "1");
            var ipv6Type = $scope.ipv6.ipType.auto;
            //IP分配方式单选按钮事件
            $scope.ipv6Typeclick = function (evt) {
                if ("auto" === evt) {
                    $scope.reservev6IP = false;
                    ipv6Type = $scope.ipv6.ipType.auto;
                } else {
                    if ("inject" === evt) {
                        ipv6Type = $scope.ipv6.ipType.inject;
                    } else {
                        ipv6Type = $scope.ipv6.ipType.inner;
                    }
                    $scope.reservev6IP = true;
                }
            };

            // 初始化IPV6 IP段
            for (var k = 1; k <= 16; k++) {
                $scope["ipv6IpSegment" + k] = {
                    "label": i18n.common_term_enableIPsegment_label + ":",
                    "display": k === 1,
                    "width": "215px",
                    startIp: {
                        "id": "ipv6StartIp" + k,
                        "type": "input",
                        "value": "",
                        "disable": false
                    },
                    endIp: {
                        "id": "ipv6EndIp" + k,
                        "type": "input",
                        "value": "",
                        "disable": false
                    }
                };
            }

            //校验IP是否合法
            function isIpCheck(ip) {
                var ipValue = $("#" + ip).widget().getValue();
                var data = ipValue.split(".");
                if (data.length === 4) {
                    return parseInt(data[0], 10) !== 127;
                } else {
                    return false;
                }
            }

            UnifyValid.isIpCheck = function (ip) {
                return isIpCheck(ip);
            };

            /**
             * 校验子网和掩码的合法性
             * @returns {boolean}
             * @constructor
             */
            function IpAndMarkCheck() {
                var subIp = $("#create-network-subnetIp").widget().getValue();
                var subMark = $("#create-network-subnetMask").widget().getValue();
                var subnetIP = _ip2int(subIp.split("."));
                var mask = _ip2int(subMark.split("."));
                var calculatedSubnetIP = (mask & subnetIP) >>> 0;
                return calculatedSubnetIP === subnetIP;
            }

            function _ip2int(ip) {
                var num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 +
                    Number(ip[2]) * 256 + Number(ip[3]);
                num = num >>> 0;
                return num;
            }

            //校验子网掩码是否可用
            function isUsedMark() {
                var mark = $("#create-network-subnetMask").widget().getValue();
                var str = parseInt(mark.split(".")[3], 10);
                return 248 >= str;
            }

            //校验ip是否在子网内
            function isIpInSubnet(ip) {
                var subnet = $("#create-network-subnetIp").widget().getValue(); //子网IP
                var mask = $("#create-network-subnetMask").widget().getValue(); //子网掩码
                var inputIp = $("#" + ip).widget().getValue(); //子网掩码
                try {
                    var ipData = inputIp.split(".");
                    var maskData = mask.split(".");
                    var subnetData = subnet.split(".");
                    return ((parseInt(ipData[0], 10) & parseInt(maskData[0], 10)) === parseInt(subnetData[0], 10) &&
                        (parseInt(ipData[1], 10) & parseInt(maskData[1], 10)) === parseInt(subnetData[1], 10) &&
                        (parseInt(ipData[2], 10) & parseInt(maskData[2], 10)) === parseInt(subnetData[2], 10) &&
                        (parseInt(ipData[3], 10) & parseInt(maskData[3], 10)) === parseInt(subnetData[3], 10));
                } catch (e) {
                    return false;
                }
            }

            //校验掩码
            UnifyValid.maskCheck = function () {
                var maskV = "create-network-subnetMask";
                if (isIpCheck(maskV)) {
                    if (IpAndMarkCheck()) {
                        if (isUsedMark()) {
                            return true;
                        }
                    }
                }
                return false;
            };

            //校验IP在子网内并不与子网、掩码冲突
            UnifyValid.isGateway = function (inputIp) {
                if (isIpCheck(inputIp)) {
                    if (isIpInSubnet(inputIp)) {
                        if (isClash(inputIp)) {
                            return true;
                        }
                    }
                }
                return false;
            };
            //校验网关和可用IP与预留IP不冲突
            function isClash(inputIp) {
                var subnet = $("#create-network-subnetIp").widget().getValue(); //子网IP
                var mask = $("#create-network-subnetMask").widget().getValue(); //掩码
                var input = $("#" + inputIp).widget().getValue();
                var inputIpV = _ip2int(input.split("."));
                var subnetIP = _ip2int(subnet.split("."));
                var maskV = _ip2int(mask.split("."));
                if (maskV !== inputIpV && subnetIP !== inputIpV) {
                    if ((subnetIP + 2) !== inputIpV && (subnetIP + 3) !== inputIpV && (subnetIP + 4) !== inputIpV) {
                        if ("create-network-gateway" !== inputIp) {
                            var gateway = $("#create-network-gateway").widget().getValue();
                            var gatewayValue = _ip2int(gateway.split("."));
                            return inputIpV !== gatewayValue;
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }

            // 修改时初始化ip段
            if ($rootScope.isModifyMode) {
                queryDetail($rootScope.service.networkID, $rootScope.service.cloudInfraId, $rootScope.service.vpcId);
            }

            function queryDetail(networkId, cloudId, vpcId) {
                var user = $("html").scope().user;
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
                    var networkInfo = data;

                    // 修改网络场景，对于已有的网络信息不允许修改
                    if (networkInfo.ipv4Subnet) {
                        $scope.ipv4InfoDisable = true;
                    }
                    if (networkInfo.ipv6Subnet) {
                        $scope.ipv6InfoDisable = true;
                    }

                    if (networkInfo.ipv4Subnet && networkInfo.ipv4Subnet.availableIPRanges) {
                        var totalV4 = networkInfo.ipv4Subnet.availableIPRanges.length;
                        for (var inIndex = 1; inIndex <= totalV4; inIndex++) {
                            var segId = "availableIpSegment" + inIndex;
                            $scope[segId].display = true;
                            $scope[segId].startIp.value = networkInfo.ipv4Subnet.availableIPRanges[inIndex - 1].startIp;
                            $scope[segId].endIp.value = networkInfo.ipv4Subnet.availableIPRanges[inIndex - 1].endIp;
                        }
                    }
                    if (networkInfo.ipv6Subnet && networkInfo.ipv6Subnet.availableIPRanges) {
                        var total = networkInfo.ipv6Subnet.availableIPRanges.length;
                        for (var index = 1; index <= total; index++) {
                            var id = "ipv6IpSegment" + index;
                            $scope[id].display = true;
                            $scope[id].startIp.value = networkInfo.ipv6Subnet.availableIPRanges[index - 1].startIp;
                            $scope[id].endIp.value = networkInfo.ipv6Subnet.availableIPRanges[index - 1].endIp;
                        }
                    }
                    initInputDisable();
                });
            }

            function initInputDisable() {
                var ipv4TotalDisable = $scope.ipv4InfoDisable || !$rootScope.isIpv4Checked;
                // 子网、掩码、网关等的disable(IPV4) 规避ip控件无法disable的问题
                $("#create-networkICT-subnetIp").widget().setDisable(ipv4TotalDisable);
                $("#create-networkICT-subnetMask").widget().setDisable(ipv4TotalDisable);
                $("#create-networkICT-gateway").widget().setDisable(ipv4TotalDisable);
                $("#create-network-priorDns").widget().setDisable(ipv4TotalDisable);
                $("#create-network-optionDns").widget().setDisable(ipv4TotalDisable);
                for (var i = 1; i <= 16; i++) {
                    var id = "availableIpSegment" + i;
                    if ($scope[id].display) {
                        $("#" + $scope[id].startIp.id).widget().setDisable(ipv4TotalDisable);
                        $("#" + $scope[id].endIp.id).widget().setDisable(ipv4TotalDisable);
                    }
                }
            }
        }
    ];

    return ctrl;
});
