/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'tiny-common/UnifyValid',
    'tiny-widgets/Message',
    "bootstrap/bootstrap.min",
    'app/business/resources/controllers/constants'],
    function (angular, UnifyValid, Message, bootstrap, constants) {
        "use strict";

        var subnetCtrl = ["$scope", "$state", "validator", "camel", "$rootScope", function ($scope, $state, validator, camel, $rootScope) {
                UnifyValid.ipCheck = function (id) {
                    var ip = $("#" + id).widget().getValue();
                    if (!ip) {
                        return true;
                    }
                    return validator.ipValidator(ip);
                };
                UnifyValid.ipv6Check = function (id) {
                    var ip = $("#" + id).widget().getValue();
                    if (!ip) {
                        return true;
                    }
                    return validator.ipv6Check(ip);
                };
                UnifyValid.prefixCheck = function () {
                    if ($("#" + $scope.ipv6.ipDistMode.id).widget().opChecked("4")) {
                        if ($("#" + $scope.ipv6.subnetPrefix.id).widget().getValue() == '64') {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return true;
                    }
                };

                UnifyValid.maskCheck = function (maskId) {
                    var mask = $("#" + maskId).widget().getValue();
                    return validator.maskValidator(mask);
                };
                UnifyValid.maskAndSubnetCheck = function (maskId) {
                    var mask = $("#" + maskId).widget().getValue();
                    var ip = $("#" + $scope.ipv4.subnetIp.id).widget().getValue();
                    return validator.maskAndSubnetValidator(mask, ip);
                };
                UnifyValid.subnetCheck = function (ipId) {
                    var ip = $("#" + ipId).widget().getValue();
                    if (!ip) {
                        return true
                    }
                    var mask = $("#" + $scope.ipv4.subnetMask.id).widget().getValue();
                    var subnet = $("#" + $scope.ipv4.subnetIp.id).widget().getValue();
                    return validator.subnetValidator(ip, mask, subnet);
                };
                UnifyValid.gatewayCheck = function () {
                    var ip = $("#" + $scope.ipv4.gateway.id).widget().getValue();
                    var data = ip.split(".");
                    try {
                        if (data[3] == 255) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    catch (e) {
                        return false;
                    }
                };
                UnifyValid.domainCheck = function (domainId) {
                    var domain = $("#" + domainId).widget().getValue();
                    if (!domain) {
                        return true
                    }
                    if (domain.match(new RegExp(validator.domainName))) {
                        return true
                    }
                    else {
                        return false;
                    }
                };
                UnifyValid.equalGateway = function (ipId) {
                    var ip = $("#" + ipId).widget().getValue();
                    var gateway = $("#" + $scope.ipv4.gateway.id).widget().getValue();

                    try {
                        if (ip == gateway) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    catch (e) {
                        return false;
                    }
                };
                var isIpv4Checked = true;
                var isIpv6Checked = false;
                $scope.ipv4 = {
                    ipv4Checkbox: {
                        "text": "IPv4",
                        "id": "ipv4Checkbox",
                        "checked": "true",
                        "height": "30px",
                        "change": function () {
                            isIpv4Checked = $("#" + $scope.ipv4.ipv4Checkbox.id).widget().option("checked")
                            $scope.operate.setIpv4DivStatus(isIpv4Checked);
                            if (isIpv4Checked) {
                                $("#" + $scope.nextBtn.id).widget().option("disable", false);
                            }
                            else {
                                $("#" + $scope.nextBtn.id).widget().option("disable", $scope.operate.isNoneChecked());
                            }
                        }

                    },
                    ipDist: "ext",
                    labelwidth: "110",
                    ipDistMode: {
                        "label": $scope.i18n.common_term_IPassignMode_label + ":",
                        "require": "true",
                        "id": "ipv4DistModeRadio",
                        "spacing": {
                            "width": "50px", "height": "30px"
                        },
                        "values": [
                            [
                                {
                                    "key": "0",
                                    "text": $scope.i18n.resource_term_externalDHCP_label + "&nbsp;&nbsp;&nbsp;&nbsp;" + $scope.i18n.resource_exter_add_para_allocationIP_mean_exterDHCP_label,
                                    "checked": true
                                }
                            ],
                            [
                                {
                                    "key": "1",
                                    "text": $scope.i18n.common_term_innerDHCP_label + "&nbsp;&nbsp;&nbsp;&nbsp;" + $scope.i18n.resource_exter_add_para_allocationIP_mean_innerDHCP_label,
                                    "checked": false
                                }
                            ],
                            [
                                {
                                    "key": "3",
                                    "text": $scope.i18n.vpc_term_staticInjection_label + "&nbsp;&nbsp;" + $scope.i18n.resource_exter_add_para_allocationIP_mean_static_label,
                                    "checked": false
                                }
                            ],
                            [
                                {
                                    "key": "2",
                                    "text": $scope.i18n.common_term_manual_label + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + $scope.i18n.resource_exter_add_para_allocationIP_mean_manual_label,
                                    "checked": false
                                }
                            ]
                        ],
                        "layout": "vertical",
                        "change": function () {
                            var checkedKey = $("#" + $scope.ipv4.ipDistMode.id).widget().opChecked("checked");
                            if (constants.config.IP_ALLOCATE_POLICY.external == checkedKey) {
                                $scope.ipv4.ipDist = "ext";
                                $scope.ipv4.labelwidth = "110";
                            }
                            else if (constants.config.IP_ALLOCATE_POLICY.internal == checkedKey) {
                                $scope.ipv4.ipDist = "in";
                                $scope.ipv4.labelwidth = "115";
                                $scope.operate.queryDhcp();
                            }
                            else if (constants.config.IP_ALLOCATE_POLICY.staticInjection == checkedKey) {
                                $scope.ipv4.ipDist = "static";
                                $scope.ipv4.labelwidth = "115";
                            }
                            else {
                                $scope.ipv4.ipDist = "manual";
                                $scope.ipv4.labelwidth = "60";
                            }
                        }

                    },
                    subnetIp: {
                        "label": $scope.i18n.common_term_SubnetIP_label + ":" || "子网IP:",
                        "require": "true",
                        "id": "subnetIp",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipCheck"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(subnetIp):" + $scope.i18n.common_term_formatIP_valid
                    },
                    subnetMask: {
                        "label": $scope.i18n.common_term_SubnetMask_label + ":" || "子网掩码:",
                        "require": "true",
                        "id": "subnetMask",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["maskCheck", "maskAndSubnetCheck"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";maskCheck(subnetMask):" + $scope.i18n.common_term_formatSubnetMask_valid + ";maskAndSubnetCheck(subnetMask):子网IP或子网掩码不合法。"
                    },
                    gateway: {
                        "label": $scope.i18n.common_term_gateway_label + ":" || "网关:",
                        "require": "true",
                        "id": "gateway",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["subnetCheck", "gatewayCheck"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";subnetCheck(gateway):" + $scope.i18n.resource_term_outSubnet_valid + ";gatewayCheck:" + $scope.i18n.vpc_term_gatewayError_valid
                    },
                    dhcpIp01: {
                        "label": $scope.i18n.common_term_DHCPservice_label + " IP01:",
                        "require": "true",
                        "id": "dhcpIp01",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipCheck"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(dhcpIp01):" + $scope.i18n.common_term_formatIP_valid

                    },
                    dhcpIp02: {
                        "label": $scope.i18n.common_term_DHCPservice_label + " IP02:",
                        "require": "false",
                        "id": "dhcpIp02",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipCheck"],
                        "validate": "ipCheck(dhcpIp02):" + $scope.i18n.common_term_formatIP_valid

                    },
                    availableIpSegment: {
                        "width": "215px",
                        "disable": "false"
                    },
                    availableIpSegment1: {
                        "label": $scope.i18n.common_term_enableIPsegment_label + ":" || "可用IP地址段:",
                        "require": "false",
                        "display": true,
                        "width": "215px",
                        startIp: {
                            "id": "startIp1",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(startIp1):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp1):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        },
                        endIp: {
                            "id": "endIp1",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(endIp1):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp1):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        }
                    },
                    availableIpSegment2: {
                        display: false,
                        startIp: {
                            "id": "startIp2",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(startIp2):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp2):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        },
                        endIp: {
                            "id": "endIp2",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(endIp2):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp2):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        }
                    },
                    availableIpSegment3: {
                        display: false,
                        startIp: {
                            "id": "startIp3",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(startIp3):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp3):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        },
                        endIp: {
                            "id": "endIp3",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(endIp3):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp3):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        }
                    },
                    availableIpSegment4: {
                        display: false,
                        startIp: {
                            "id": "startIp4",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(startIp4):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp4):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        },
                        endIp: {
                            "id": "endIp4",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(endIp4):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp4):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        }
                    },
                    availableIpSegment5: {
                        display: false,
                        startIp: {
                            "id": "startIp5",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(startIp5):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp5):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        },
                        endIp: {
                            "id": "endIp5",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(endIp5):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp5):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        }
                    },
                    availableIpSegment6: {
                        display: false,
                        startIp: {
                            "id": "startIp6",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(startIp6):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp6):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        },
                        endIp: {
                            "id": "endIp6",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(endIp6):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp6):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        }
                    },
                    availableIpSegment7: {
                        display: false,
                        startIp: {
                            "id": "startIp7",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(startIp7):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp7):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        },
                        endIp: {
                            "id": "endIp7",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(endIp7):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp7):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        }
                    },
                    availableIpSegment8: {
                        display: false,
                        startIp: {
                            "id": "startIp8",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(startIp8):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp8):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        },
                        endIp: {
                            "id": "endIp8",
                            "type": "ipv4",
                            "value": "",
                            "disable": false,
                            "extendFunction": ["subnetCheck", "equalGateway"],
                            "validate": "subnetCheck(endIp8):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp8):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                        }
                    },
                    domain: {
                        "label": $scope.i18n.common_term_domainName_label + ":",
                        "id": "domain",
                        "require": "false",
                        "disable": !isIpv4Checked,
                        "tooltip": $scope.i18n.resource_exter_add_para_domain_mean_label,
                        "extendFunction": ["domainCheck"],
                        "validate": "maxSize(255):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 255}) + ";domainCheck(domain):" + $scope.i18n.common_term_domainNameFormatError_valid
                    },
                    firstDns: {
                        "label": $scope.i18n.common_term_activeDNS_label + ":",
                        "require": "false",
                        "id": "firstDns",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipCheck"],
                        "validate": "ipCheck(firstDns):" + $scope.i18n.common_term_formatIP_valid
                    },
                    alternativeDns: {
                        "label": $scope.i18n.common_term_standbyDNS_label + ":",
                        "require": "false",
                        "id": "alternativeDns",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipCheck"],
                        "validate": "ipCheck(alternativeDns):" + $scope.i18n.common_term_formatIP_valid
                    },
                    firstWins: {
                        "label": $scope.i18n.common_term_activeWINS_label + ":",
                        "require": "false",
                        "id": "firstWins",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipCheck"],
                        "validate": "ipCheck(firstWins):" + $scope.i18n.common_term_formatIP_valid
                    },
                    alternativeWins: {
                        "label": $scope.i18n.common_term_standbyWINS_label + ":",
                        "require": "false",
                        "id": "alternativeWins",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipCheck"],
                        "validate": "ipCheck(alternativeWins):" + $scope.i18n.common_term_formatIP_valid
                    }
                }

                $scope.ipv6 = {
                    ipv6Checkbox: {
                        "text": "IPv6",
                        "id": "ipv6Checkbox",
                        "checked": "false",
                        "height": "25px",
                        "disable": false,
                        "change": function () {
                            isIpv6Checked = $("#" + $scope.ipv6.ipv6Checkbox.id).widget().option("checked")
                            $scope.operate.setIpv6DivStatus(isIpv6Checked);
                            if (isIpv6Checked) {
                                $("#" + $scope.nextBtn.id).widget().option("disable", false);
                            }
                            else {
                                $("#" + $scope.nextBtn.id).widget().option("disable", $scope.operate.isNoneChecked());
                            }
                        }
                    },
                    isIpv6Checked: false,
                    ipDist: "ext",
                    labelwidth: "110",
                    ipDistMode: {
                        "label": $scope.i18n.common_term_IPassignMode_label + ":",
                        "require": "false",
                        "id": "ipv6DistModeRadio",
                        "spacing": {"width": "50px", "height": "25px"},
                        "values": [
                            [
                                {
                                    "key": "0",
                                    "text": $scope.i18n.resource_term_externalDHCP_label + "&nbsp;&nbsp;&nbsp;&nbsp;" + $scope.i18n.resource_exter_add_para_allocationIP_mean_exterDHCP_label,
                                    "checked": true,
                                    "disable": true
                                }
                            ],
                            [
                                {
                                    "key": "3",
                                    "text": $scope.i18n.vpc_term_staticInjection_label + "&nbsp;&nbsp;" + $scope.i18n.resource_exter_add_para_allocationIP_mean_static_label,
                                    "checked": false,
                                    "disable": true
                                }
                            ],
                            [
                                {
                                    "key": "4",
                                    "text": $scope.i18n.resource_exter_add_para_allocationIP_mean_noStatusAuto_label,
                                    "checked": false,
                                    "disable": true
                                }
                            ]
                        ],
                        "layout": "vertical",
                        "change": function () {
                            var checkedKey = $("#" + $scope.ipv6.ipDistMode.id).widget().opChecked("checked");
                            if (constants.config.IP_ALLOCATE_POLICY.external == checkedKey) {
                                $scope.ipv6.ipDist = "ext";
                                $scope.ipv6.labelwidth = "110";
                            }
                            else if (constants.config.IP_ALLOCATE_POLICY.staticInjection == checkedKey) {
                                $scope.ipv6.ipDist = "static";
                                $scope.ipv6.labelwidth = "115";
                            }
                            else {
                                $scope.ipv6.ipDist = "auto";
                                $scope.ipv6.labelwidth = "60";
                            }
                        }

                    },
                    subnetIp: {
                        "label": "IPv6" + $scope.i18n.common_term_SubnetIP_label + ":",
                        "require": "true",
                        "id": "ipv6SubnetIp",
                        "value": "",
                        "extendFunction": ["ipv6Check"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipv6Check(ipv6SubnetIp):" + $scope.i18n.common_term_formatIP_valid,
                        "disable": true,
                        "width": "215px"

                    },
                    subnetPrefix: {
                        "label": $scope.i18n.vpc_term_IPv6subnetPrefix_label + ":",
                        "require": "true",
                        "id": "ipv6SubnetPrefix",
                        "extendFunction": ["prefixCheck"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid + ";maxValue(126):" + $scope.i18n.common_term_formatSubnetPrefix_valid + ";minValue(1):" + $scope.i18n.common_term_formatSubnetPrefix_valid +
                            ";prefixCheck:" + $scope.i18n.resource_exter_add_para_subnetPrefix_valid,
                        "value": "",
                        "disable": true,
                        "width": "215px"
                    },
                    gateway: {
                        "label": "IPv6" + $scope.i18n.common_term_gateway_label + ":",
                        "require": "true",
                        "id": "ipv6Gateway",
                        "extendFunction": ["ipv6Check"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipv6Check(ipv6Gateway):" + $scope.i18n.common_term_formatIP_valid,
                        "value": "",
                        "disable": true,
                        "width": "215px"

                    },
                    dhcpIp01: {
                        "label": $scope.i18n.common_term_DHCPservice_label + " IP01:",
                        "require": "true",
                        "id": "ipv6DhcpIp01",
                        "extendFunction": ["ipv6Check"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipv6Check(ipv6DhcpIp01):" + $scope.i18n.common_term_formatIP_valid,
                        "value": "",
                        "disable": true,
                        "width": "215px"

                    },
                    dhcpIp02: {
                        "label": $scope.i18n.common_term_DHCPservice_label + " IP02:",
                        "require": "false",
                        "id": "ipv6DhcpIp02",
                        "extendFunction": ["ipv6Check"],
                        "validate": "ipv6Check(ipv6DhcpIp02):" + $scope.i18n.common_term_formatIP_valid,
                        "value": "",
                        "disable": true,
                        "width": "215px"

                    },
                    availableIpSegment: {
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipv6Check"]
                    },
                    availableIpSegment1: {
                        "label": $scope.i18n.common_term_enableIPsegment_label + ":",
                        "require": "false",
                        "display": true,
                        startIp: {
                            "id": "ipv6StartIp1",
                            "value": "",
                            "validate": "ipv6Check(ipv6StartIp1):" + $scope.i18n.common_term_formatIP_valid
                        },
                        endIp: {
                            "id": "ipv6EndIp1",
                            "value": "",
                            "validate": "ipv6Check(ipv6EndIp1):" + $scope.i18n.common_term_formatIP_valid
                        }
                    },
                    availableIpSegment2: {
                        display: false,
                        startIp: {
                            "id": "ipv6StartIp2",
                            "value": "",
                            "validate": "ipv6Check(ipv6StartIp2):" + $scope.i18n.common_term_formatIP_valid
                        },
                        endIp: {
                            "id": "ipv6EndIp2",
                            "value": "",
                            "validate": "ipv6Check(ipv6EndIp2):" + $scope.i18n.common_term_formatIP_valid
                        }
                    },
                    availableIpSegment3: {
                        display: false,
                        startIp: {
                            "id": "ipv6StartIp3",
                            "value": "",
                            "validate": "ipv6Check(ipv6StartIp3):" + $scope.i18n.common_term_formatIP_valid
                        },
                        endIp: {
                            "id": "ipv6EndIp3",
                            "value": "",
                            "validate": "ipv6Check(ipv6EndIp3):" + $scope.i18n.common_term_formatIP_valid
                        }
                    },
                    availableIpSegment4: {
                        display: false,
                        startIp: {
                            "id": "ipv6StartIp4",
                            "value": "",
                            "validate": "ipv6Check(ipv6StartIp4):" + $scope.i18n.common_term_formatIP_valid
                        },
                        endIp: {
                            "id": "ipv6EndIp4",
                            "value": "",
                            "validate": "ipv6Check(ipv6EndIp4):" + $scope.i18n.common_term_formatIP_valid
                        }
                    },
                    availableIpSegment5: {
                        display: false,
                        startIp: {
                            "id": "ipv6StartIp5",
                            "value": "",
                            "validate": "ipv6Check(ipv6StartIp5):" + $scope.i18n.common_term_formatIP_valid
                        },
                        endIp: {
                            "id": "ipv6EndIp5",
                            "value": "",
                            "validate": "ipv6Check(ipv6EndIp5):" + $scope.i18n.common_term_formatIP_valid
                        }
                    },
                    availableIpSegment6: {
                        display: false,
                        startIp: {
                            "id": "ipv6StartIp6",
                            "value": "",
                            "validate": "ipv6Check(ipv6StartIp6):" + $scope.i18n.common_term_formatIP_valid
                        },
                        endIp: {
                            "id": "ipv6EndIp6",
                            "value": "",
                            "validate": "ipv6Check(ipv6EndIp6):" + $scope.i18n.common_term_formatIP_valid
                        }
                    },
                    availableIpSegment7: {
                        display: false,
                        startIp: {
                            "id": "ipv6StartIp7",
                            "value": "",
                            "validate": "ipv6Check(ipv6StartIp7):" + $scope.i18n.common_term_formatIP_valid
                        },
                        endIp: {
                            "id": "ipv6EndIp7",
                            "value": "",
                            "validate": "ipv6Check(ipv6EndIp7):" + $scope.i18n.common_term_formatIP_valid
                        }
                    },
                    availableIpSegment8: {
                        display: false,
                        startIp: {
                            "id": "ipv6StartIp8",
                            "value": "",
                            "validate": "ipv6Check(ipv6StartIp8):" + $scope.i18n.common_term_formatIP_valid
                        },
                        endIp: {
                            "id": "ipv6EndIp8",
                            "value": "",
                            "validate": "ipv6Check(ipv6EndIp8):" + $scope.i18n.common_term_formatIP_valid
                        }
                    },
                    domain: {
                        "label": $scope.i18n.common_term_domainName_label + ":",
                        "id": "ipv6Domain",
                        "require": "false",
                        "width": "215px",
                        "disable": false,
                        "tooltip": $scope.i18n.resource_exter_add_para_domain_mean_label,
                        "extendFunction": ["domainCheck"],
                        "validate": "maxSize(255):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 255}) + ";domainCheck(domain):" + $scope.i18n.common_term_domainNameFormatError_valid
                    },
                    firstDns: {
                        "label": $scope.i18n.common_term_activeDNS_label + ":",
                        "require": "false",
                        "id": "ipv6FirstDns",
                        "type": "ipv6",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipv6Check"],
                        "validate": "ipv6Check(ipv6FirstDns):" + $scope.i18n.common_term_formatIP_valid
                    },
                    alternativeDns: {
                        "label": $scope.i18n.common_term_standbyDNS_label + ":",
                        "require": "false",
                        "id": "ipv6AlternativeDns",
                        "type": "ipv6",
                        "value": "",
                        "disable": false,
                        "width": "215px",
                        "extendFunction": ["ipv6Check"],
                        "validate": "ipv6Check(ipv6AlternativeDns):" + $scope.i18n.common_term_formatIP_valid
                    }
                };
                $scope.preBtn = {
                    "id": "subnetPreBtn",
                    "text": $scope.i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $scope.service.showPage = "vlan";
                        $("#" + $scope.service.addExtNetworkStep.id).widget().pre();
                    }
                };
                $scope.nextBtn = {
                    "id": "subnetNextBtn",
                    "text": $scope.i18n.common_term_next_button || "下一步",
                    "disable": false,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#subnetDiv"));
                        if (!valid) {
                            return;
                        }
                        $scope.service.isIpv4 = isIpv4Checked;
                        if (isIpv4Checked) {
                            $scope.createInfo.ipv4Subnet.ipAllocatePolicy = $("#" + $scope.ipv4.ipDistMode.id).widget().opChecked("checked");
                            $scope.createInfo.ipv4Subnet.subnetAddr = $("#" + $scope.ipv4.subnetIp.id).widget().getValue();
                            $scope.createInfo.ipv4Subnet.subnetPrefix = $("#" + $scope.ipv4.subnetMask.id).widget().getValue();
                            $scope.createInfo.ipv4Subnet.gateway = $("#" + $scope.ipv4.gateway.id).widget().getValue();
                            $scope.service.ipv4DistMode = $scope.ipv4.ipDist;
                            var dhcpOption = {};
                            var availableIPRanges = [];
                            switch ($("#" + $scope.ipv4.ipDistMode.id).widget().opChecked("checked")) {
                                case constants.config.IP_ALLOCATE_POLICY.external:
                                    dhcpOption.dhcpServerIP1 = $("#" + $scope.ipv4.dhcpIp01.id).widget().getValue();
                                    dhcpOption.dhcpServerIP2 = $("#" + $scope.ipv4.dhcpIp02.id).widget().getValue();
                                    $scope.createInfo.ipv4Subnet.dhcpOption = dhcpOption;
                                    break;
                                case constants.config.IP_ALLOCATE_POLICY.internal:
                                case constants.config.IP_ALLOCATE_POLICY.staticInjection:
                                    var ips = [];
                                    for (var i = 1; i <= 8; i++) {
                                        var id = "availableIpSegment" + i;
                                        if ($scope.ipv4[id].display) {
                                            var startIP = $("#" + $scope.ipv4[id].startIp.id).widget().getValue()
                                            var endIP = $("#" + $scope.ipv4[id].endIp.id).widget().getValue();
                                            if (startIP && endIP) {
                                                availableIPRanges.push({"startIP": startIP, "endIP": endIP});
                                                ips.push({"startIP": startIP, "endIP": endIP});
                                            }
                                        }
                                    }
                                    $scope.service.availableIPv4s = ips;
                                    $scope.createInfo.ipv4Subnet.availableIPRanges = availableIPRanges;
                                    dhcpOption.domainName = $("#" + $scope.ipv4.domain.id).widget().getValue();
                                    dhcpOption.primaryDNS = $("#" + $scope.ipv4.firstDns.id).widget().getValue();
                                    dhcpOption.secondaryDNS = $("#" + $scope.ipv4.alternativeDns.id).widget().getValue();
                                    dhcpOption.primaryWINS = $("#" + $scope.ipv4.firstWins.id).widget().getValue();
                                    dhcpOption.secondaryWINS = $("#" + $scope.ipv4.alternativeWins.id).widget().getValue();
                                    $scope.createInfo.ipv4Subnet.dhcpOption = dhcpOption;
                                    break;
                                case constants.config.IP_ALLOCATE_POLICY.manual:
                                    break;
                                default:
                                    break;
                            }
                            $scope.createInfo.protocolType = constants.config.PROTOCOL_TYPE.ipv4;
                        }
                        $scope.service.isIpv6 = isIpv6Checked;
                        if (isIpv6Checked) {
                            $scope.createInfo.ipv6Subnet.ipAllocatePolicy = $("#" + $scope.ipv6.ipDistMode.id).widget().opChecked("checked");
                            $scope.createInfo.ipv6Subnet.subnetAddr = $("#" + $scope.ipv6.subnetIp.id).widget().getValue();
                            $scope.createInfo.ipv6Subnet.subnetPrefix = $("#" + $scope.ipv6.subnetPrefix.id).widget().getValue();
                            $scope.createInfo.ipv6Subnet.gateway = $("#" + $scope.ipv6.gateway.id).widget().getValue();
                            $scope.service.ipv6DistMode = $scope.ipv6.ipDist;
                            var dhcpOption = {};
                            var availableIPRanges = [];
                            switch ($("#" + $scope.ipv6.ipDistMode.id).widget().opChecked("checked")) {
                                case constants.config.IP_ALLOCATE_POLICY.external:
                                    dhcpOption.dhcpServerIP1 = $("#" + $scope.ipv6.dhcpIp01.id).widget().getValue();
                                    dhcpOption.dhcpServerIP2 = $("#" + $scope.ipv6.dhcpIp02.id).widget().getValue();
                                    $scope.createInfo.ipv6Subnet.dhcpOption = dhcpOption;
                                    break;
                                case constants.config.IP_ALLOCATE_POLICY.staticInjection:
                                    var ips = [];
                                    for (var i = 1; i <= 8; i++) {
                                        var id = "availableIpSegment" + i;
                                        if ($scope.ipv6[id].display) {
                                            var startIP = $("#" + $scope.ipv6[id].startIp.id).widget().getValue()
                                            var endIP = $("#" + $scope.ipv6[id].endIp.id).widget().getValue();
                                            if (startIP && endIP) {
                                                availableIPRanges.push({"startIP": startIP, "endIP": endIP});
                                                ips.push({"startIP": startIP, "endIP": endIP});
                                            }
                                        }
                                    }
                                    $scope.service.availableIPv6s = ips;
                                    $scope.createInfo.ipv6Subnet.availableIPRanges = availableIPRanges;
                                    dhcpOption.domainName = $("#" + $scope.ipv6.domain.id).widget().getValue();
                                    dhcpOption.primaryDNS = $("#" + $scope.ipv6.firstDns.id).widget().getValue();
                                    dhcpOption.secondaryDNS = $("#" + $scope.ipv6.alternativeDns.id).widget().getValue();
                                    $scope.createInfo.ipv6Subnet.dhcpOption = dhcpOption;
                                    break;
                                case constants.config.IP_ALLOCATE_POLICY.manual:
                                    break;
                            }
                            $scope.createInfo.protocolType = constants.config.PROTOCOL_TYPE.ipv6;
                        }
                        if (isIpv6Checked && isIpv4Checked) {
                            $scope.createInfo.protocolType = constants.config.PROTOCOL_TYPE.dual;
                        }
                        $scope.service.showPage = "qos";
                        $("#" + $scope.service.addExtNetworkStep.id).widget().next();
                    }

                };
                $scope.cancelBtn = {
                    "id": "subnetCancelBtn",
                    "text": $scope.i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("resources.zoneResources.externalNetwork.extNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                    }
                };

                $scope.operate = {
                    "initIpv4": function () {
                        if ($scope.createInfo.externalNetworkType == constants.config.EXERNAL_NETWORK_TYPE.superSubnet) {
                            $("#" + $scope.ipv4.ipDistMode.id).widget().opDisabled("1", true);
                        }
                    },
                    "initIpv6": function () {
                        if ($scope.createInfo.externalNetworkType == constants.config.EXERNAL_NETWORK_TYPE.superSubnet) {
                            $("#" + $scope.ipv6.ipDistMode.id).widget().opDisabled("1", true)
                        }
                    },
                    "addIpv4Ip": function () {
                        for (var i = 2; i <= 8; i++) {
                            var id = "availableIpSegment" + i;
                            if (!$scope.ipv4[id].display) {
                                $scope.ipv4[id].display = true;
                                return;
                            }
                        }

                    },
                    "addIpv6Ip": function () {
                        for (var i = 2; i <= 8; i++) {
                            var id = "availableIpSegment" + i;
                            if (!$scope.ipv6[id].display) {
                                $scope.ipv6[id].display = true;
                                return;
                            }
                        }

                    },
                    "deleteIpv4Ip": function (id) {
                        $scope.ipv4[id].display = false;
                    },
                    "deleteIpv6Ip": function (id) {
                        $scope.ipv6[id].display = false;
                    },
                    "isNoneChecked": function () {
                        if (isIpv4Checked || isIpv6Checked) {
                            return false;
                        }
                        else {
                            return true;
                        }

                    },
                    "queryDhcp": function () {
                        var queryConfig = constants.rest.DHCP_SERVER_QUERY
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.id}},
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            if (!response) {
                                var warnMsg = new Message({
                                    "type": "prompt",
                                    "title": $scope.i18n.common_term_tip_label,
                                    "content": $scope.i18n.resource_exter_add_info_notExistDHCP_msg,
                                    "height": "150px",
                                    "width": "350px",
                                    "buttons": [
                                        {
                                            label: 'OK',
                                            accessKey: '2',
                                            "key": "okBtn",
                                            majorBtn : true,
                                            default: true
                                        }
                                    ]
                                });
                                warnMsg.setButton("okBtn", function () {
                                    warnMsg.destroy();
                                });
                                warnMsg.show();
                            }
                        });
                    },
                    "setIpv4DivStatus": function (result) {
                        $("#ipv4Div .tiny_input_ip_container").each(function () {
                            $(this).widget().setDisable(!result);
                        });
                        $("#ipv4Div .tiny-textbox").each(function () {
                            $(this).widget().option("disable", !result);
                        });
                        $("#" + $scope.ipv4.ipDistMode.id).widget().opDisabled("0", !result);
                        $("#" + $scope.ipv4.ipDistMode.id).widget().opDisabled("1", !result);
                        $("#" + $scope.ipv4.ipDistMode.id).widget().opDisabled("2", !result);
                        $("#" + $scope.ipv4.ipDistMode.id).widget().opDisabled("3", !result);
                        $scope.operate.initIpv4();
                    },
                    "setIpv6DivStatus": function (result) {
                        $("#ipv6Div .tiny_input_ip_container").each(function () {
                            $(this).widget().setDisable(!result);
                        });
                        $("#ipv6Div .tiny-textbox").each(function () {
                            $(this).widget().option("disable", !result);
                        });
                        $("#" + $scope.ipv6.ipDistMode.id).widget().opDisabled("0", !result);
                        $("#" + $scope.ipv6.ipDistMode.id).widget().opDisabled("3", !result);
                        $("#" + $scope.ipv6.ipDistMode.id).widget().opDisabled("4", !result);
                        $scope.operate.initIpv6();
                    }
                }

                // 事件处理
                $scope.$on($scope.createExtNetworkEvents.initSubnet, function (event, msg) {
                    $scope.operate.initIpv4();
                    $scope.operate.initIpv6();
                });
            }]
            ;

        return subnetCtrl;
    }
)
;
