/*global define*/
define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "tiny-common/UnifyValid",
        "app/services/validatorService",
        "app/services/exceptionService",
        "app/business/network/services/acls/aclsService",
        "app/business/network/services/eip/eipService",
        "app/business/network/services/router/routerService",
        "tiny-lib/underscore",
        "tiny-directives/RadioGroup",
        "tiny-directives/Button",
        "tiny-directives/Textbox",
        "tiny-directives/FormField",
        "tiny-directives/Select",
        "tiny-directives/IP",
        "fixtures/network/eip/elasticipFixture",
        "fixtures/network/acls/aclsFixture"
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, UnifyValid, validatorService, exception, aclsService, eipService, RouterService,_) {
        "use strict";
        var aclsCtrl = ["$rootScope", "$scope", "camel", "$q", "exception",
            function ($rootScope, $scope, camel, $q, exception) {
                keyIDI18n.sprintf = sprintf.sprintf;
                var i18n = keyIDI18n;
                var isIT = $("html").scope().user.cloudType === "IT";
                $scope.isIT = isIT;
                var aclsServiceIns = new aclsService(exception, $q, camel);
                var eipServiceIns = new eipService(exception, $q, camel);
                var routerServiceIns = new RouterService(exception, $q, camel);

                //获取参数
                var params = $("#networkACLsCreateAclRuleWin").widget().option("params");
                //端口是否合法
                UnifyValid.isPortRangeCheck = function (fromToArr) {
                    if(!fromToArr || !fromToArr[0]) {
                        return false;
                    }
                    fromToArr = fromToArr[0].split(",");
                    var fromPort = parseInt($("#" + $.trim(fromToArr[0])).widget().getValue(), 10);
                    var endPort = parseInt($("#" + $.trim(fromToArr[1])).widget().getValue(), 10);
                    if (fromPort > endPort) {
                        return false;
                    }
                    return true;
                };
                //子网掩码是否合法
                UnifyValid.isMaskValid = function (domId) {
                    var maskValue = $("#" + domId[0]).widget().getValue();
                    if ($.trim(maskValue) === "") {
                        return false;
                    }
                    try {
                        var data = maskValue.split(".");
                        if (data[0] === "" || data[1] === "" || data[2] === "" || data[3] === "") {
                            return false;
                        }
                        data[0] = parseInt(data[0], 10);
                        data[1] = parseInt(data[1], 10);
                        data[2] = parseInt(data[2], 10);
                        data[3] = parseInt(data[3], 10);
                        var ip_binary = (data[0] + 256).toString(2).substring(1) +
                            (data[1] + 256).toString(2).substring(1) +
                            (data[2] + 256).toString(2).substring(1) +
                            (data[3] + 256).toString(2).substring(1);

                        if (-1 !== ip_binary.indexOf("01")) {
                            return false;
                        } else {
                            return true;
                        }
                    } catch (e) {
                        return false;
                    }
                };

                //校验IPv4是否合法
                UnifyValid.isIPv4Check = function (domId) {
                    var ipValue = $("#" + domId[0]).widget().getValue();
                    if ($.trim(ipValue) === "") {
                        return false;
                    }
                    try {
                        var data = ipValue.split(".");
                        if (data.length === 4) {
                            if (data[0] === "" || data[1] === "" || data[2] === "" || data[3] === "") {
                                return false;
                            }
                            return true;
                        } else {
                            return false;
                        }
                    } catch (e) {
                        return false;
                    }
                };
                //IP和子网掩码是否匹配
            UnifyValid.isIpMaskMatchValid = function (ipMaskArr) {
                if(!ipMaskArr || !ipMaskArr[0]) {
                    return false;
                }
                ipMaskArr = ipMaskArr[0].split(",");
                var ip = $("#" + $.trim(ipMaskArr[0])).widget().getValue();
                var mask = $("#" + $.trim(ipMaskArr[1])).widget().getValue();
                return ipMaskMatchCheck(ip, mask);
            };
                function ipMaskMatchCheck(ip, mask) {
                    try {
                        var ipData = ip.split(".");
                        var maskData = mask.split(".");
                        /* jshint bitwise: false */
                        if ((parseInt(ipData[0], 10) & parseInt(maskData[0], 10)) === parseInt(ipData[0], 10) &&
                            (parseInt(ipData[1], 10) & parseInt(maskData[1], 10)) === parseInt(ipData[1], 10) &&
                            (parseInt(ipData[2], 10) & parseInt(maskData[2], 10)) === parseInt(ipData[2], 10) &&
                            (parseInt(ipData[3], 10) & parseInt(maskData[3], 10)) === parseInt(ipData[3], 10)) {
                            return true;
                        } else {
                            return false;
                        }
                    } catch (e) {
                        return false;
                    }
                }
                //协议封装
                var protocol = {
                    "protocolArray": [{
                        "appProtocol": "TCP",
                        "transportprotocol": "TCP",
                        "startport": "",
                        "endport": ""
                    }, {
                        "appProtocol": "UDP",
                        "transportprotocol": "UDP",
                        "startport": "",
                        "endport": ""
                    }, {
                        "appProtocol": "ICMP",
                        "transportprotocol": "ICMP",
                        "startport": "",
                        "endport": ""
                    }, {
                        "appProtocol": "ANY",
                        "transportprotocol": "ANY",
                        "startport": "",
                        "endport": ""
                    }, {
                        "appProtocol": "SSH",
                        "transportprotocol": "TCP",
                        "startport": "22",
                        "endport": "22"
                    }, {
                        "appProtocol": "SMTP",
                        "transportprotocol": "TCP",
                        "startport": "25",
                        "endport": "25"
                    }, {
                        "appProtocol": "DNS",
                        "transportprotocol": "UDP",
                        "startport": "53",
                        "endport": "53"
                    }, {
                        "appProtocol": "HTTP",
                        "transportprotocol": "TCP",
                        "startport": "80",
                        "endport": "80"
                    }, {
                        "appProtocol": "POP3",
                        "transportprotocol": "TCP",
                        "startport": "110",
                        "endport": "110"
                    }, {
                        "appProtocol": "IMAP",
                        "transportprotocol": "TCP",
                        "startport": "143",
                        "endport": "143"
                    }, {
                        "appProtocol": "LDAP",
                        "transportprotocol": "TCP",
                        "startport": "389",
                        "endport": "389"
                    }, {
                        "appProtocol": "HTTPS",
                        "transportprotocol": "TCP",
                        "startport": "443",
                        "endport": "443"
                    }, {
                        "appProtocol": "SMTPS",
                        "transportprotocol": "TCP",
                        "startport": "465",
                        "endport": "465"
                    }, {
                        "appProtocol": "IMAPS",
                        "transportprotocol": "TCP",
                        "startport": "993",
                        "endport": "993"
                    }, {
                        "appProtocol": "POP3S",
                        "transportprotocol": "TCP",
                        "startport": "995",
                        "endport": "995"
                    }, {
                        "appProtocol": "MS SQL",
                        "transportprotocol": "TCP",
                        "startport": "1433",
                        "endport": "1433"
                    }, {
                        "appProtocol": "MYSQL",
                        "transportprotocol": "TCP",
                        "startport": "3306",
                        "endport": "3306"
                    }, {
                        "appProtocol": "RDP",
                        "transportprotocol": "TCP",
                        "startport": "3389",
                        "endport": "3389"
                    }],
                    "getProtocolSelValues": function () {
                        var selValues = [];
                    var arr = [];
                    if (isIT) {
                        arr = protocol.protocolArray;
                    }
                    else {
                        arr = ictProtocol.protocolArray;
                    }
                        _.each(arr, function (item, index) {
                            selValues.push({
                                "selectId": item.appProtocol,
                                "label": item.appProtocol,
                                "checked": (index === 0)
                            });
                        });
                        return selValues;
                    },
                    "getTransportProtocol": function (appProtocol) {
                        var transportProtocol = "";
                        var arr = protocol.protocolArray;
                        _.each(arr, function (item) {
                            if (appProtocol === item.appProtocol) {
                                transportProtocol = item.transportprotocol;
                                return;
                            }
                        });
                        return transportProtocol;
                    },
                    "getStartport": function (appProtocol) {
                        var startport = "";
                        var arr = protocol.protocolArray;
                        _.each(arr, function (item) {
                            if (appProtocol === item.appProtocol) {
                                startport = item.startport;
                                return;
                            }
                        });
                        return startport;
                    },
                    "getEndport": function (appProtocol) {
                        var endport = "";
                        var arr = protocol.protocolArray;
                        _.each(arr, function (item) {
                            if (appProtocol === item.appProtocol) {
                                endport = item.endport;
                                return;
                            }
                        });
                        return endport;
                }
            };
            var ictProtocol = {
                "protocolArray": [
                    {
                        "appProtocol": "TCP",
                        "transportprotocol": "TCP",
                        "startport": "",
                        "endport": ""
                    },
                    {
                        "appProtocol": "UDP",
                        "transportprotocol": "UDP",
                        "startport": "",
                        "endport": ""
                    },
                    {
                        "appProtocol": "ICMP",
                        "transportprotocol": "ICMP",
                        "startport": "",
                        "endport": ""
                    },
                    {
                        "appProtocol": "ANY",
                        "transportprotocol": "ANY",
                        "startport": "",
                        "endport": ""
                    }
                ]
            };
                //ICMP协议类型、编码封装
                var ICMP = {
                    "icmpArray": [{
                        "name": "Any",
                        "icmpType": "-1",
                        "icmpCode": "-1"
                    }, {
                        "name": "Echo",
                        "icmpType": "8",
                        "icmpCode": "0"
                    }, {
                        "name": "Echo reply",
                        "icmpType": "0",
                        "icmpCode": "0"
                    }, {
                        "name": "Fragment need DF set",
                        "icmpType": "3",
                        "icmpCode": "4"
                    }, {
                        "name": "Host redirect",
                        "icmpType": "5",
                        "icmpCode": "1"
                    }, {
                        "name": "Host TOS redirect",
                        "icmpType": "5",
                        "icmpCode": "3"
                    }, {
                        "name": "Host unreachable",
                        "icmpType": "3",
                        "icmpCode": "1"
                    }, {
                        "name": "Information reply",
                        "icmpType": "16",
                        "icmpCode": "0"
                    }, {
                        "name": "Information request",
                        "icmpType": "15",
                        "icmpCode": "0"
                    }, {
                        "name": "Net redirect",
                        "icmpType": "5",
                        "icmpCode": "0"
                    }, {
                        "name": "Net TOS redirect",
                        "icmpType": "5",
                        "icmpCode": "2"
                    }, {
                        "name": "Net unreachable",
                        "icmpType": "3",
                        "icmpCode": "0"
                    }, {
                        "name": "Parameter problem",
                        "icmpType": "12",
                        "icmpCode": "0"
                    }, {
                        "name": "Port unreachable",
                        "icmpType": "3",
                        "icmpCode": "3"
                    }, {
                        "name": "Protocol unreachable",
                        "icmpType": "3",
                        "icmpCode": "2"
                    }, {
                        "name": "Reassembly timeout",
                        "icmpType": "11",
                        "icmpCode": "1"
                    }, {
                        "name": "Source quench",
                        "icmpType": "4",
                        "icmpCode": "0"
                    }, {
                        "name": "Source route failed",
                        "icmpType": "3",
                        "icmpCode": "5"
                    }, {
                        "name": "Timestamp reply",
                        "icmpType": "14",
                        "icmpCode": "0"
                    }, {
                        "name": "Timestamp request",
                        "icmpType": "13",
                        "icmpCode": "0"
                    }, {
                        "name": "TTL exceeded",
                        "icmpType": "11",
                        "icmpCode": "0"
                    }],
                    "getIcmp": function (str) {
                        var icmp = null;
                        var arr = ICMP.icmpArray;
                        _.each(arr, function(item){
                            if(str === item.name){
                                icmp = item;
                                return;
                            }
                        });
                        return icmp;
                    },
                    "getIcmpSelValues": function () {
                        var selValues = [];
                        var arr = ICMP.icmpArray;
                        _.each(arr, function (item, index) {
                            selValues.push({
                                "selectId": item.name,
                                "label": item.name,
                                "checked": (index === 0)
                            });
                        });
                        return selValues;
                    }
                };
            //界面控件
            $scope.rule = {
                    ruleNo: {
                        id: "networkAclsAclscreateRuleNo",
                        "require": true,
                        "tooltip": i18n.acl_general_add_para_Number_mean_tip,
                        label: i18n.common_term_priority_label + ":",
                        value: "",
                        type: "input",
                        width: "300px",
                        "validate": "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "999") + ";minValue(0):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "999") + ";maxValue(999):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "999")
                    },
                    ruleType: {
                        "label": i18n.acl_term_scope_label + "：",
                        "require": true,
                        "layout": "vertical",
                        "id": "networkAclsAclscreateRuleType",
                        "value": [{
                            "key": "1",
                            "text": i18n.common_term_InDomainRule_label + "&nbsp;&nbsp;&nbsp;&nbsp;" + i18n.vpc_term_setVPCintraAccessRule_button,
                            "checked": true
                        }, {
                            "key": "2",
                            "text": i18n.common_term_InterDomainRule_label+ "&nbsp;&nbsp;&nbsp;&nbsp;" + i18n.vpc_term_setVPCinterAccessRule_button,
                            "checked": false
                        }],
                        "change": function () {
                            $scope.controlWidgetdisplay(false);
                            var ruleType = $("#" + $scope.rule.ruleType.id).widget().opChecked("checked");
                            if (ruleType === "1") {
                                $scope.command.queryRouteNetwork();
                            } else if (ruleType === "2") {
                                $scope.command.queryElasticIP();
                            }
                        }
                    },
                innerZoneICT: {
                    label: i18n.acl_term_internalDomain_label||"内部域" + ":",
                    id: "networkAclsAclscreateInnerZoneICT",
                    require: true,
                    width: "300px",
                    value: [{
                        selectId: 'trust',
                        label: 'trust',
                        checked: true
                    }],
                    "change": function () {}
                },
                outZoneICT: {
                    label: i18n.acl_term_externalDomain_label + ":",
                    id: "networkAclsAclscreateOuterZoneICT",
                    require: true,
                    width: "300px",
                    value: [{
                        selectId: 'untrust',
                        label: 'untrust',
                        checked: true
                    },
                        {
                            selectId: 'dmz',
                            label: 'dmz',
                            checked: false
                        }
                    ],
                    "change": function () {}
                },
                directionICT: {
                    "id": "add-rule-directionICT",
                    "require": true,
                    label: i18n.common_term_direction_label + ":",
                    "width": "300",
                    "value": [{
                        "selectId": "1",
                        "label": i18n.security_term_inDirection_label,
                        "checked": true
                    }, {
                        "selectId": "2",
                        "label": i18n.security_term_outWay_label
                    }],
                    "change": function(){

                    }
                },
                    protocol: {
                        label: i18n.common_term_protocol_label + ":",
                        id: "networkAclsAclscreatePotocol",
                        require: true,
                        width: "300px",
                        value: protocol.getProtocolSelValues(),
                        "change": function () {
                        var protocolSelect = $("#" + $scope.rule.protocol.id).widget().getSelectedId();
                        if(isIT) {
                            $scope.controlWidgetdisplay(false);
                            UnifyValid.clearValidate($("#" + $scope.rule.portRange.fromPort.id).find("input"));
                            UnifyValid.clearValidate($("#" + $scope.rule.portRange.toPort.id).find("input"));
                            $("#" + $scope.rule.portRange.fromPort.id).widget().option("value", protocol.getStartport(protocolSelect));
                            $("#" + $scope.rule.portRange.toPort.id).widget().option("value", protocol.getEndport(protocolSelect));
                        }
                        else {
                            $scope.controlICTWidgetdisplay(protocolSelect);
                        }
                    }
                },
                    outerZone: {
                        label: i18n.acl_term_externalDomain_label + ":",
                        id: "networkAclsAclscreateOuterZone",
                        require: true,
                        width: "300px",
                        value: [{
                            selectId: 'untrust',
                            label: 'untrust',
                            checked: true
                        }],
                        "change": function () {}
                    },
                    routeNet: {
                        "label": i18n.vpc_term_routerNet_label + ":",
                        "id": "networkAclsAclscreateRouteNet",
                        "require": true,
                        "width": "300",
                        "height": "300",
                        "value": []
                    },
                    eip: {
                        "label": i18n.eip_term_eip_label+":",
                        "id": "networkAclsAclscreateEip",
                        "require": true,
                        "width": "300",
                        "height": "200",
                        "value": []
                    },
                    subnetIp: {
                        "id": "networkAclsAclscreateSourceSubnetIp",
                        "require": true,
                        label: i18n.common_term_sourceIP_label + ":",
                        value: "",
                        type: "ipv4",
                        width: "300px",
                        "extendFunction": ["isIPv4Check"],
                        "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(networkAclsAclscreateSourceSubnetIp):" +i18n.common_term_formatIP_valid
                    },
                    subnetMask: {
                        "id": "networkAclsAclscreateSourceSubnetMask",
                        "require": true,
                        label: i18n.common_term_sourceMask_label + ":",
                        value: "",
                        type: "ipv4",
                        width: "300px",
                        "extendFunction": ["isIPv4Check", "isMaskValid", "isIpMaskMatchValid"],
                        "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(networkAclsAclscreateSourceSubnetMask):" + i18n.common_term_formatIP_valid + ";isMaskValid(networkAclsAclscreateSourceSubnetMask):" + i18n.common_term_formatSubnetMask_valid + ";isIpMaskMatchValid(networkAclsAclscreateSourceSubnetIp, networkAclsAclscreateSourceSubnetMask):" + i18n.common_term_IPnotMatchMask_valid
                    },
                    portRange: {
                        label: i18n.vpc_term_targetPortRange_label+"：",
                        require: true,
                        fromPort: {
                            id: "networkAclsAclscreateSourceFromport",
                            value: "",
                            width: "144px",
                            validate: "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";minValue(0):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535")
                        },
                        toPort: {
                            id: "networkAclsAclscreateSourceToport",
                            value: "",
                            width: "144px",
                            extendFunction: ["isPortRangeCheck"],
                            validate: "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";minValue(0):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";isPortRangeCheck(networkAclsAclscreateSourceFromport, networkAclsAclscreateSourceToport):"+ i18n.common_term_endGreaterStart_valid
                        }
                    },
                sSubnetIp: {
                    "id": "sIp",
                    "require": true,
                    "label": i18n.common_term_sourceIP_label + ":",
                    "value": "192.168.1.0",
                    "type": "ipv4",
                    "width": "300px",
                    "extendFunction": ["isIPv4Check"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(sIp):" +i18n.common_term_formatIP_valid
                },
                sSubnetMask: {
                    "id": "sIpMask",
                    "require": true,
                    "label": i18n.common_term_sourceMask_label + ":",
                    "value": "255.255.255.0",
                    "type": "ipv4",
                    "width": "300px",
                    "extendFunction": ["isIPv4Check", "isMaskValid", "isIpMaskMatchValid"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(sIpMask):"+i18n.common_term_formatIP_valid+";isMaskValid(sIpMask):"+i18n.common_term_formatSubnetMask_valid+";isIpMaskMatchValid(sIp,sIpMask):" + i18n.common_term_IPnotMatchMask_valid
                },
                sPortRange: {
                    label: i18n.vpc_term_sourcePortRange_label + ":",
                    require: true,
                    fromPort: {
                        id: "sIpFromPort",
                        value: "",
                        width: "144px",
                        validate: "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535")
                    },
                    toPort: {
                        id: "sIpToPort",
                        value: "",
                        width: "144px",
                        extendFunction: ["isPortRangeCheck"],
                        validate: "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";isPortRangeCheck(sIpFromPort, sIpToPort):" + i18n.common_term_endGreaterStart_valid
                    }
                },
                dSubnetIp: {
                    "id": "dIp",
                    "require": true,
                    label: i18n.acl_term_targetIP_label + ":",
                    value: "192.168.2.0",
                    type: "ipv4",
                    width: "300px",
                    "extendFunction": ["isIPv4Check"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(dIp):" +i18n.common_term_formatIP_valid
                },
                dSubnetMask: {
                    "id": "dIpMask",
                    "require": true,
                    label: i18n.acl_term_targetIPmask_label + ":",
                    value: "255.255.255.0",
                    type: "ipv4",
                    width: "300px",
                    "extendFunction": ["isIPv4Check", "isMaskValid", "isIpMaskMatchValid"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(dIpMask):"+i18n.common_term_formatIP_valid+";isMaskValid(dIpMask):"+i18n.common_term_formatSubnetMask_valid+";isIpMaskMatchValid(dIp, dIpMask):" + i18n.common_term_IPnotMatchMask_valid
                },
                dPortRange: {
                    label: i18n.vpc_term_targetPortRange_label + "：",
                    require: true,
                    fromPort: {
                        id: "dIpFromPort",
                        value: "",
                        width: "144px",
                        validate: "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535")
                    },
                    toPort: {
                        id: "dIpToPort",
                        value: "",
                        width: "144px",
                        extendFunction: ["isPortRangeCheck"],
                        validate: "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";isPortRangeCheck(dIpFromPort, dIpToPort):" + i18n.common_term_endGreaterStart_valid
                    }
                },
                    ICMPType: {
                        label: i18n.acl_term_ICMPtype_label +":",
                        id: "networkAclsAclscreateICMPType",
                        require: true,
                        width: "300px",
                        value: ICMP.getIcmpSelValues(),
                        "change": function () {}
                    },
                    tactics: {
                        "label": i18n.common_term_policy_label+":",
                        "id": "networkAclsAclscreateTactics",
                        "require": true,
                        "width": "300px",
                        "value": [{
                            selectId: 'permit',
                            label: i18n.common_term_allow_value,
                            checked: true
                        }, {
                            selectId: 'deny',
                            label: i18n.common_term_refuse_value,
                            checked: false
                        }],
                        "change": function () {}
                    },
                    createBtn: {
                        "id": "networkAclsAclscreateCreateBtn",
                        "text": i18n.common_term_add_button,
                        "click": function () {
                            if(!$scope.isIT && (params.insertType === "before" || params.insertType === "after")){
                                $scope.command.insertFirewallRule();
                                return;
                            }
                            $scope.command.createFirewallRule();
                        }
                    },
                    cancelBtn: {
                        "id": "networkAclsAclscreateCancelBtn",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $("#networkACLsCreateAclRuleWin").widget().destroy();
                        }
                    }
                };
                //控制界面控件显示情况
                $scope.controlWidgetdisplay = function (isInit) {
                    var direction = params.direction;
                    var ruleType = "1";
                    var potocol = "TCP";
                    if (!isInit) {
                        ruleType = $("#" + $scope.rule.ruleType.id).widget().opChecked("checked");
                        potocol = $("#" + $scope.rule.protocol.id).widget().getSelectedId();
                    }
                    //subnetIp、subnetMask控件
                    if (direction === 1) {
                        $scope.rule.subnetIp.label = i18n.common_term_sourceIP_label + ":";
                        $scope.rule.subnetMask.label = i18n.common_term_sourceMask_label + ":";
                    } else {
                        $scope.rule.subnetIp.label = i18n.acl_term_targetIP_label+":";
                        $scope.rule.subnetMask.label = i18n.acl_term_targetIPmask_label+":";
                    }
                    //outerZone、routeNet、eip控件
                    $scope.isOuterZoneShow = false;
                    $scope.isRouteNetShow = true;
                    $scope.isEipShow = false;
                    if (ruleType === "2") {
                        $scope.isOuterZoneShow = true;
                        $scope.isRouteNetShow = false;
                        $scope.isEipShow = true;
                    }
                    //ICMPType控件
                    $scope.isICMPTypeShow = false;
                    if (potocol === "ICMP") {
                        $scope.isICMPTypeShow = true;
                    }
                    //portRange控件
                    $scope.isPortRangeShow = true;
                    if ((potocol === "ICMP") || (potocol === "ANY")) {
                        $scope.isPortRangeShow = false;
                    }
                    //控制端口的灰化与否
                    if (!isInit) {
                        if ((potocol === "TCP") || (potocol === "UDP")) {
                            $("#" + $scope.rule.portRange.fromPort.id).widget().option("disable", false);
                            $("#" + $scope.rule.portRange.toPort.id).widget().option("disable", false);
                        } else {
                            $("#" + $scope.rule.portRange.fromPort.id).widget().option("disable", true);
                            $("#" + $scope.rule.portRange.toPort.id).widget().option("disable", true);
                        }
                    }
                };
            $scope.controlICTWidgetdisplay = function(protocol) {
                if(protocol === "ICMP") {
                    $scope.sPortRangeShow = false;
                    $scope.dPortRangeShow = false;
                }
                else {
                    $scope.sPortRangeShow = true;
                    $scope.dPortRangeShow = true;
                }
            };
            if (isIT) {
                $scope.controlWidgetdisplay(true);
            }
            else {
                $scope.controlICTWidgetdisplay();
            }

                //创建ACL规则获取参数
            function getITParameter() {
                    var ruleType = $("#" + $scope.rule.ruleType.id).widget().opChecked("checked");
                    var innerZone = "";
                    if (ruleType === "1") {
                        innerZone = "trust";
                    }
                    var outerZone = "";
                    if ($scope.isOuterZoneShow) {
                        outerZone = $("#" + $scope.rule.outerZone.id).widget().getSelectedId();
                    }
                    var ruleID = $("#" + $scope.rule.ruleNo.id).widget().getValue();
                    var protocolSelect = protocol.getTransportProtocol($("#" + $scope.rule.protocol.id).widget().getSelectedId());
                    var direction = params.direction;
                    var ipv4Addr = $("#" + $scope.rule.subnetIp.id).widget().getValue();
                    var ipv4Prefix = $("#" + $scope.rule.subnetMask.id).widget().getValue();
                    var startPort = "";
                    var endPort = "";
                    if ($scope.isPortRangeShow) {
                        startPort = $("#" + $scope.rule.portRange.fromPort.id).widget().getValue();
                        endPort = $("#" + $scope.rule.portRange.toPort.id).widget().getValue();
                    }
                    var icmpType = "";
                    var icmpCode = "";
                    if ($scope.isICMPTypeShow) {
                        var icmpName = $("#" + $scope.rule.ICMPType.id).widget().getSelectedId();
                        icmpType = ICMP.getIcmp(icmpName).icmpType;
                        icmpCode = ICMP.getIcmp(icmpName).icmpCode;
                    }
                    var action = $("#" + $scope.rule.tactics.id).widget().getSelectedId();
                    var eipAddr = "";
                    if ($scope.isEipShow) {
                        eipAddr = $("#" + $scope.rule.eip.id).widget().getSelectedLabel();
                    }
                    var networkID = "";
                    if ($scope.isRouteNetShow) {
                        networkID = $("#" + $scope.rule.routeNet.id).widget().getSelectedId();
                    }
                var parameter = {
                    "ruleType": ruleType,
                    "innerZone": innerZone,
                    "outerZone": outerZone,
                    "ruleID": ruleID,
                    "protocol": protocolSelect,
                    "direction": direction,
                    "ipAddr": ipv4Addr,
                    "ipPrefix": ipv4Prefix,
                    "startPort": startPort,
                    "endPort": endPort,
                    "icmpType": icmpType,
                    "icmpCode": icmpCode,
                    "action": action,
                    "eipAddr": eipAddr,
                    "networkID": networkID
                };
                return {
                    "cloudInfraId": params.cloudInfraId,
                    "vdcId": params.vdcId,
                    "vpcId": params.vpcId,
                    "userId": params.userId,
                    "datas": parameter
                };
            }

            function getICTParameter() {
                var outerZone = $("#" + $scope.rule.outZoneICT.id).widget().getSelectedId();
                var innerZone = $("#" + $scope.rule.innerZoneICT.id).widget().getSelectedId();
                var direction = $("#" + $scope.rule.directionICT.id).widget().getSelectedId();
                var protocol = $("#" + $scope.rule.protocol.id).widget().getSelectedId();
                var sIp = $("#" + $scope.rule.sSubnetIp.id).widget().getValue();
                var sMask = $("#" + $scope.rule.sSubnetMask.id).widget().getValue();
                var dIp = $("#" + $scope.rule.dSubnetIp.id).widget().getValue();
                var dMask = $("#" + $scope.rule.dSubnetMask.id).widget().getValue();
                var action = $("#" + $scope.rule.tactics.id).widget().getSelectedId();

                var parameters = {
                    "innerZone" : innerZone,
                    "outerZone" : outerZone,
                    "direction" : direction,
                    "protocol": protocol,
                    "srcIpAddr":sIp,
                    "srcIpAddrMask":sMask,
                    "desIpAddr":dIp,
                    "desIpAddrMask":dMask,
                    "action":action
                };
                if (protocol !== "ICMP") {
                    var sFromPort = "";
                    var sToPort = "";
                    sFromPort = $("#" + $scope.rule.sPortRange.fromPort.id).widget().getValue();
                    sToPort = $("#" + $scope.rule.sPortRange.toPort.id).widget().getValue();

                    var dFromPort = "";
                    var dToPort = "";

                    dFromPort = $("#" + $scope.rule.dPortRange.fromPort.id).widget().getValue();
                    dToPort = $("#" + $scope.rule.dPortRange.toPort.id).widget().getValue();
                    _.extend(parameters,{
                        "srcPort" : sFromPort + ":" + sToPort,
                        "desPort" : dFromPort + ":" + dToPort
                    });
                }
                return {
                    "cloudInfraId": params.cloudInfraId,
                    "vdcId": params.vdcId,
                    "vpcId": params.vpcId,
                    "userId": params.userId,
                    "datas":parameters
                };
            }

            //Ajax命令
            $scope.command = {
                    //查询弹性IP
                    "queryElasticIP": function () {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId
                        };
                        var deferred = eipServiceIns.queryElasticIPAll(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            var elasticIPRes = data.elasticIPs;
                            var elasticIPArray = [];
                            _.each(elasticIPRes, function (item, index) {
                                elasticIPArray.push({
                                    "selectId": item.id,
                                    "label": item.ip,
                                    "checked": (index === 0)
                                });
                            });
                            $scope.rule.eip.value = elasticIPArray;
                        });
                    },
                    //查询网络信息
                    "queryRouteNetwork": function () {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "networktype": "ROUTED",
                            "status": "READY",
                            "vdcId": params.vdcId,
                            "userId": params.userId
                        };
                        var deferred = eipServiceIns.queryNetwork(options);
                        deferred.then(function (data) {
                            var networkRes = data.networks;
                            var selArray = [];
                            _.each(networkRes, function (item, index) {
                                selArray.push({
                                    "selectId": item.networkID,
                                    "label": item.name,
                                    "checked": (index === 0)
                                });
                            });
                            $scope.rule.routeNet.value = selArray;
                        });
                    },
                    "createFirewallRule": function () {
                        var valid = UnifyValid.FormValid($("#network_ACLs_create_ACLsRule"));
                        if (!valid) {
                            return;
                        }
                        var options = {};
                        if (isIT) {
                            options = getITParameter();
                        }
                        else {
                            options = getICTParameter();
                        }
                        var deferred = aclsServiceIns.createFirewallRule(options);
                        deferred.then(function (data) {
                            $("#networkACLsCreateAclRuleWin").widget().destroy();
                        });
                    },
                    "insertFirewallRule": function () {
                        var valid = UnifyValid.FormValid($("#network_ACLs_create_ACLsRule"));
                        if (!valid) {
                            return;
                        }
                        var options = getICTParameter();
                        //ruleId
                        _.extend(options,{
                            "ruleId" : params.ruleId
                        });
                        //insertType
                        _.extend(options.datas,{
                            "insertType" : params.insertType
                        });
                        var deferred = aclsServiceIns.insertFirewallRule(options);
                        deferred.then(function (data) {
                            $("#networkACLsCreateAclRuleWin").widget().destroy();
                        });
                    }
                };
                if (isIT) {
                    $scope.command.queryRouteNetwork();
                }
        }
    ];
        var module = angular.module("network.acls.createAclsModule", ["ng", "ngSanitize", "wcc"]);
        module.controller("network.acls.createAclsCtrl", aclsCtrl);
        module.service("camel", http);
        module.service("exception", exception);
        return module;
    });
