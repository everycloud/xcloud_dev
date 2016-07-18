define([
        "sprintf",
        'tiny-lib/jquery',
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/business/network/services/securitygroup/securityGroupService",
        "app/services/capacityService",
        "app/services/cloudInfraService",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Button",
        "tiny-directives/Textbox",
        "tiny-directives/FormField",
        "tiny-directives/Select",
        "tiny-directives/IP"
    ],
    function (sprintf,$, angular, ngSanitize, keyIDI18n, http, UnifyValid, validatorService, securityGroupService, capacityService, cloudInfraService, _) {
        "use strict";
        var ctrl = ["$scope", "camel", "$q", "$compile",
            function ($scope, camel, $q, $compile) {
                keyIDI18n.sprintf = sprintf.sprintf;
                var i18n = keyIDI18n;
                var validatorServiceIns = new validatorService();
                var cloudInfrasCapacity = new capacityService($q, camel);
                var exception = $("html").injector().get("exception");
                var securityGroupServiceIns = new securityGroupService(exception, $q, camel);
                var user = $("html").scope().user;
                $scope.vmShow = false;
                // 搜索字符串
                var searchString = "";
                $scope.vmNics = []; //保存选择的虚拟机对象
                $scope.vm = {};
                $scope.ipRange = "";
                $scope.allowedNicId = null;
                $scope.allowedMac = null;

                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                $scope.cloudInfra = {};
                //获取参数
                $scope.params = $("#addRuleWindowId").widget().option("params");

                //IP和子网掩码是否匹配
                UnifyValid.isIpMaskMatchValid = function (ipType) {
                    var ip = "";
                    var mask = "";
                    if (ipType[0] === "IPV4") {
                        ip = $("#" + $scope.subnetIpIPV4.id).widget().getValue();
                        mask = $("#" + $scope.subnetMaskIPV4.id).widget().getValue();
                    }
                    return ipMaskMatchCheck(ip, mask);
                };

                function ipMaskMatchCheck(ip, mask) {
                    try {
                        var ipData = ip.split(".");
                        var maskData = mask.split(".");
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

                //IP段是否合法
                UnifyValid.isIpRangeVaild = function (ipType) {
                    var startIp = "";
                    var endIp = "";
                    if (ipType[0] === "IPV4") {
                        startIp = $("#" + $scope.startIpIPV4.id).widget().getValue();
                        endIp = $("#" + $scope.endIpIPV4.id).widget().getValue();
                    }
                    return ipRangeCheck(startIp, endIp);
                };

                function ipRangeCheck(startIp, endIp) {
                    try {
                        var startIpValue = 0,
                            endIpValue = 0;
                        var startIps = startIp.split(".");
                        if (startIps.length === 4) {
                            for (var i = 0; i < 4; i++) {
                                startIpValue = startIpValue * 256 + parseInt(startIps[i], 10);
                            }
                        } else {
                            return false;
                        }
                        var endIps = endIp.split(".");
                        if (endIps.length === 4) {
                            for (var j = 0; j < 4; j++) {
                                endIpValue = endIpValue * 256 + parseInt(endIps[j], 10);
                            }
                        } else {
                            return false;
                        }
                        if (startIpValue > endIpValue) {
                            return false;
                        }
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
                //端口是否合法
                UnifyValid.isPortRangeCheck = function (ipType) {
                    var fromPort = 0;
                    var endPort = 0;
                    if (ipType[0] === "IPV4") {
                        fromPort = parseInt($("#" + $scope.portRangeIPV4.fromPort.id).widget().getValue(), 10);
                        endPort = parseInt($("#" + $scope.portRangeIPV4.toPort.id).widget().getValue(), 10);
                    } else if (ipType[0] === "IPV6") {
                        fromPort = parseInt($("#" + $scope.portRangeIPV6.fromPort.id).widget().getValue(), 10);
                        endPort = parseInt($("#" + $scope.portRangeIPV6.toPort.id).widget().getValue(), 10);
                    }
                    if (fromPort > endPort) {
                        return false;
                    }
                    return true;
                };
                //子网掩码是否合法
                UnifyValid.isMaskValid = function (domId) {
                    var maskValue = $("#" + domId[0]).widget().getValue();
                    if ($.trim(maskValue) === "") {
                        return true;
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
                        return true;
                    }
                    return validatorServiceIns.ipValidator(ipValue);
                };
                //校验IPv6是否合法
                UnifyValid.isIPv6Check = function (domId) {
                    var ipValue = $("#" + domId[0]).widget().getValue();
                    if ($.trim(ipValue) === "") {
                        return true;
                    }
                    return validatorServiceIns.ipv6Check(ipValue);
                };
                $scope.isInitIpv4 = true;
                $scope.isInitIpv6 = true;
                $scope.protocolIPV4 = {
                    "id": "add-Rule-ProtocolIPV4",
                    "require": true,
                    label: i18n.common_term_protocol_label + ":",
                    "dftLabel": "TCP",
                    "width": "300",
                    "values": [{
                        "selectId": "TCP",
                        "label": "TCP",
                        "checked": true
                    }, {
                        "selectId": "UDP",
                        "label": "UDP"
                    }, {
                        "selectId": "ICMP",
                        "label": "ICMP"
                    }, {
                        "selectId": "Any",
                        "label": "Any"
                    }],
                    "change": function () {
                        $scope.changeSelectedItem(false);
                    }
                };
                $scope.protocolIPV6 = {
                    "id": "add-Rule-ProtocolIPV6",
                    "require": true,
                    label: i18n.common_term_protocol_label + ":",
                    "dftLabel": "TCP",
                    "width": "315",
                    "values": [{
                        "selectId": "TCP",
                        "label": "TCP",
                        "checked": true
                    }, {
                        "selectId": "UDP",
                        "label": "UDP"
                    }, {
                        "selectId": "ICMP",
                        "label": "ICMP"
                    }, {
                        "selectId": "Any",
                        "label": "Any"
                    }],
                    "change": function () {
                        $scope.changeSelectedItem(false);
                    }
                };
                $scope.directionIPV4_ICT = {
                    "id": "add-rule-directionIPV4_ICT",
                    "require": true,
                    label: i18n.common_term_direction_label + ":",
                    display: false,
                    "dftLabel": i18n.security_term_inDirection_label,
                    "width": "300",
                    "values": [{
                        "selectId": "0",
                        "label": i18n.security_term_inDirection_label,
                        "checked": true
                    }, {
                        "selectId": "1",
                        "label": i18n.security_term_outWay_label
                    }]
                };
                $scope.directionIPV6_ICT = {
                    "id": "add-rule-directionIPV6_ICT",
                    "require": true,
                    label: i18n.common_term_direction_label + ":",
                    display: false,
                    "dftLabel": i18n.security_term_inDirection_label,
                    "width": "315",
                    "values": [{
                        "selectId": "0",
                        "label": i18n.security_term_inDirection_label,
                        "checked": true
                    }, {
                        "selectId": "1",
                        "label": i18n.security_term_outWay_label
                    }]
                };
                $scope.directionIPV4 = {
                    "id": "add-rule-directionIPV4",
                    "require": true,
                    label: i18n.common_term_direction_label + ":",
                    display: false,
                    "dftLabel": i18n.security_term_inDirection_label,
                    "width": "300",
                    "values": [{
                        "selectId": "0",
                        "label": i18n.security_term_inDirection_label,
                        "checked": true
                    }, {
                        "selectId": "1",
                        "label": i18n.security_term_outWay_label
                    }]
                };
                var sourceIPv4Value = [{
                    "selectId": "0",
                    "label": i18n.common_term_Subnet_label,
                    "checked": true
                }, {
                    "selectId": "1",
                    "label": i18n.common_term_IPsegment_label
                }, {
                    "selectId": "2",
                    "label": i18n.security_rule_add_para_source_option_otherSG_label
                }];
                //opensatck场景下没有IP段
                if ($scope.params.openstack) {
                    sourceIPv4Value = [{
                        "selectId": "0",
                        "label": i18n.common_term_Subnet_label,
                        "checked": true
                    }, {
                        "selectId": "2",
                        "label": i18n.security_rule_add_para_source_option_otherSG_label
                    }];
                }
                $scope.sourceIPV4 = {
                    "id": "add-rule-sourceIPV4",
                    "require": true,
                    label: i18n.common_term_source_label + ":",
                    "dftLabel": i18n.common_term_Subnet_label,
                    "width": "300",
                    "values": sourceIPv4Value,
                    "change": function () {
                        $scope.changeSelectedItem(false);
                        //如果选择虚拟机，就查询虚拟机列表
                        var vm = $("#add-rule-sourceIPV4").widget().getSelectedId();
                        if (vm === "3") {
                            getVmData();
                            $scope.vmShow = true;
                        } else {
                            $scope.allowedNicId = null;
                            $scope.allowedMac = null;
                            $scope.vmShow = false;
                        }
                    }
                };
                $scope.searchBox = {
                    "id": "vmsSearchBox",
                    "placeholder": i18n.common_term_findCondition_prom,
                    "width": "150",
                    "maxLength": 64,
                    "search": function (content) {
                        searchString = content;
                        page.currentPage = 1;
                        getVmData();
                    }
                };
                $scope.vmIPV4 = {
                    "id": "add-rule-vmIPV4",
                    "paginationStyle": "full_numbers",
                    "label": i18n.common_term_vm_label + ":",
                    "displayLength": 10,
                    "totalRecords": 0,
                    "lengthMenu": [10, 20, 30],
                    "require": true,
                    "columns": [{
                        "sTitle": "",
                        "mData": "dId",
                        "bSortable": false,
                        "sWidth": "15%"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.IP);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": "MAC",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.MAC);
                        },
                        "bSortable": false
                    }],
                    "data": [],
                    "callback": function (evtObj) {
                        var displayLength = $("#networkVpcListTable").widget().option("display-length");
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getVmData();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getVmData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var widgetThis = this;
                        $("td:eq(0)", nRow).bind("click", function () {
                            $scope.currentItem = aData;
                        });
                        // 单选按钮
                        var selBox = "<div style='position: relative;top: 0px;margin:auto;width: 16px;height: 16px'><tiny-radio name='name' value='value' id='id' click='radioClick()'></tiny-radio></div>";
                        if (iDataIndex === 0) {
                            selBox = "<div style='position: relative;top: 0px;margin:auto;width: 16px;height: 16px'><tiny-radio name='name' id='id' value='value' checked='true' click='radioClick()'></tiny-radio></div>";
                            var newVmSelect = [];
                            if (aData) {
                                queryVmDetail(aData.id);
                            }
                        }
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.id = "vmId" + iDataIndex;
                        selBoxScope.name = "vmName";
                        selBoxScope.value = aData.id;
                        selBoxScope.radioClick = function () {
                            //查询虚拟机详情，填充到网卡下拉框
                            if (aData) {
                                queryVmDetail(aData.id);
                            }
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);

                    }
                };

                $scope.setVmSelectByVm = function () {
                    var newVmSelect = [];
                    if ($scope.vm && $scope.vm.nics) {
                        _.each($scope.vm.nics, function (item) {
                            if (item.ip && item.ip !== "0.0.0.0") {
                                $scope.ipRange = item.ip + "-" + item.ip;
                                $scope.allowedNicId = item.nicId;
                                $scope.allowedMac = item.mac;
                                var tmpSel = {
                                    "selectId": item.id,
                                    "label": item.name + "(" + item.mac + ")"
                                };
                                newVmSelect.push(tmpSel);
                            }
                        });
                        $scope.vmSelect.values = newVmSelect;
                        $scope.vmSelect.dftLabel = newVmSelect[0].label;
                        $scope.vmSelect.dftSelectId = newVmSelect[0].selectId;
                    }
                };
                $scope.vmSelect = {
                    "id": "add-rule-vmSelect",
                    "require": true,
                    label: i18n.common_term_NICandMAC_label + ":",
                    "dftLabel": "",
                    "width": "300",
                    "height": "200",
                    "values": [],
                    "change": function () {
                        var mac = $("#add-rule-vmSelect").widget().getSelectedId();
                    },
                    validate: "required: " + i18n.common_term_null_valid
                };
                var sourceIPv6Value = [{
                    "selectId": "0",
                    "label": i18n.common_term_Subnet_label,
                    "checked": true
                }, {
                    "selectId": "1",
                    "label": i18n.common_term_IPsegment_label
                }, {
                    "selectId": "2",
                    "label": i18n.security_rule_add_para_source_option_otherSG_label
                }];
                //opensatck场景下没有IP段
                if ($scope.params.openstack) {
                    sourceIPv6Value = [{
                        "selectId": "0",
                        "label": i18n.common_term_Subnet_label,
                        "checked": true
                    }, {
                        "selectId": "2",
                        "label": i18n.security_rule_add_para_source_option_otherSG_label
                    }];
                }
                $scope.sourceIPV6 = {
                    "id": "add-rule-sourceIPV6",
                    "require": true,
                    label: i18n.common_term_source_label + ":",
                    "dftLabel": i18n.common_term_Subnet_label,
                    "width": "315",
                    "values": sourceIPv6Value,
                    "change": function () {
                        $scope.changeSelectedItem(false);
                    }
                };
                $scope.otherSecGroupIPV4 = {
                    "id": "add-rule-otherSecGroupIPV4",
                    "require": true,
                    "label": i18n.security_term_SG_label + "：",
                    "dftLabel": i18n.common_term_Subnet_label,
                    "width": "300",
                    "height": "200",
                    values: []
                };
                $scope.otherSecGroupIPV6 = {
                    "id": "add-rule-otherSecGroupIPV6",
                    "require": true,
                    "label": i18n.security_term_SG_label + "：",
                    "dftLabel": i18n.common_term_Subnet_label,
                    "width": "315",
                    "height": "200",
                    values: []
                };
                //ICMP类型配置
                function getICMPTypeCfg() {
                    var icmpStr = "Any;Echo;Echo reply;Fragment need DF set;Host redirect;Host TOS redirect;Host unreachable;Information reply;Information request;Net redirect;" +
                        "Net TOS redirect;Net unreachable;Parameter problem;Port unreachable;Protocol unreachable;Reassembly timeout;Source quench;Source route failed;Timestamp reply;" +
                        "Timestamp request;TTL exceeded";
                    var icmpArray = icmpStr.split(";");
                    var values = [];
                    _.each(icmpArray, function (item, index) {
                        var tmp = {
                            "selectId": item,
                            "label": item,
                            "checked": (index === 0)
                        };
                        values.push(tmp);
                    });
                    return values;
                }
                //获取fromPort toPort
                function getPort(str) {
                    var arr = [{
                        "name": "Any",
                        "fromPort": -1,
                        "toPort": -1
                    }, {
                        "name": "Echo",
                        "fromPort": 8,
                        "toPort": 0
                    }, {
                        "name": "Echo reply",
                        "fromPort": 0,
                        "toPort": 0
                    }, {
                        "name": "Fragment need DF set",
                        "fromPort": 3,
                        "toPort": 4
                    }, {
                        "name": "Host redirect",
                        "fromPort": 5,
                        "toPort": 1
                    }, {
                        "name": "Host TOS redirect",
                        "fromPort": 5,
                        "toPort": 3
                    }, {
                        "name": "Host unreachable",
                        "fromPort": 3,
                        "toPort": 1
                    }, {
                        "name": "Information reply",
                        "fromPort": 16,
                        "toPort": 0
                    }, {
                        "name": "Information request",
                        "fromPort": 15,
                        "toPort": 0
                    }, {
                        "name": "Net redirect",
                        "fromPort": 5,
                        "toPort": 0
                    }, {
                        "name": "Net TOS redirect",
                        "fromPort": 5,
                        "toPort": 2
                    }, {
                        "name": "Net unreachable",
                        "fromPort": 3,
                        "toPort": 0
                    }, {
                        "name": "Parameter problem",
                        "fromPort": 12,
                        "toPort": 0
                    }, {
                        "name": "Port unreachable",
                        "fromPort": 3,
                        "toPort": 3
                    }, {
                        "name": "Protocol unreachable",
                        "fromPort": 3,
                        "toPort": 2
                    }, {
                        "name": "Reassembly timeout",
                        "fromPort": 11,
                        "toPort": 1
                    }, {
                        "name": "Source quench",
                        "fromPort": 4,
                        "toPort": 0
                    }, {
                        "name": "Source route failed",
                        "fromPort": 3,
                        "toPort": 5
                    }, {
                        "name": "Timestamp reply",
                        "fromPort": 14,
                        "toPort": 0
                    }, {
                        "name": "Timestamp request",
                        "fromPort": 13,
                        "toPort": 0
                    }, {
                        "name": "TTL exceeded",
                        "fromPort": 11,
                        "toPort": 0
                    }];
                    var port = null;
                    for (var index in arr) {
                        if (arr[index].name === str) {
                            port = arr[index];
                            break;
                        }
                    }
                    return port;
                }

                $scope.ICMPTypeIPV4 = {
                    "id": "add-rule-icmptypeIPV4",
                    "require": true,
                    label: i18n.acl_term_ICMPtype_label + ":",
                    "dftLabel": "Any",
                    "width": "300",
                    "values": getICMPTypeCfg()
                };
                $scope.ICMPTypeIPV6 = {
                    id: "add-rule-ICMPTypeIPV6",
                    "require": true,
                    label:  i18n.acl_term_ICMPtype_label + ":",
                    value: "",
                    type: "input",
                    width: "315px",
                    "validate": "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "-1", "255") + ";minValue(-1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "-1", "255") + ";maxValue(255):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "-1", "255")
                };
                $scope.ICMPCodeIPV6 = {
                    id: "add-rule-ICMPCodeIPV6",
                    "require": true,
                    label: i18n.acl_term_ICMPcode_label + ":",
                    value: "",
                    type: "input",
                    width: "315px",
                    "validate": "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "-1", "255") + ";minValue(-1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "-1", "255") + ";maxValue(255):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "-1", "255")
                };

                $scope.portRangeIPV4 = {
                    "label": i18n.common_term_portRange_label + "：",
                    "require": true,
                    "fromPort": {
                        "id": "add-rule-fromportIPV4",
                        "value": "",
                        "width": "143",
                        "validate": "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";minValue(0):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535")
                    },
                    "toPort": {
                        "id": "add-rule-toportIPV4",
                        "value": "",
                        "width": "143",
                        "extendFunction": ["isPortRangeCheck"],
                        "validate": "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";minValue(0):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";isPortRangeCheck(IPV4):" + i18n.common_term_endGreaterStart_valid
                    }
                };
                $scope.portRangeIPV6 = {
                    "label": i18n.common_term_portRange_label + "：",
                    "require": true,
                    "fromPort": {
                        "id": "add-rule-fromportIPV6",
                        "value": "",
                        "width": "151",
                        "validate": "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";minValue(0):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535")
                    },
                    "toPort": {
                        "id": "add-rule-toportIPV6",
                        "value": "",
                        "width": "151",
                        "extendFunction": ["isPortRangeCheck"],
                        "validate": "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";minValue(0):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "65535") + ";isPortRangeCheck(IPV6):" + i18n.common_term_endGreaterStart_valid
                    }
                };
                $scope.subnetIpIPV4 = {
                    "id": "add-rule-subnetIpIPV4",
                    "require": true,
                    label: i18n.common_term_IP_label + ":",
                    value: "",
                    type: "ipv4",
                    width: "300px",
                    "extendFunction": ["isIPv4Check"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(add-rule-subnetIpIPV4):" + i18n.common_term_formatIP_valid
                };
                $scope.subnetIpIPV6 = {
                    "id": "add-rule-subnetIpIPV6",
                    "require": true,
                    label: i18n.common_term_IPv6Addr_label + ":",
                    value: "",
                    type: "input",
                    width: "315px",
                    "extendFunction": ["isIPv6Check"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv6Check(add-rule-subnetIpIPV6):" + i18n.common_term_formatIP_valid
                };
                $scope.subnetMaskIPV4 = {
                    id: "add-rule-subnetMaskIPV4",
                    "require": true,
                    label: i18n.common_term_SubnetMask_label + ":",
                    value: "",
                    type: "ipv4",
                    width: "300px",
                    "extendFunction": ["isIPv4Check", "isMaskValid", "isIpMaskMatchValid"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isMaskValid(add-rule-subnetMaskIPV4):"+i18n.common_term_formatSubnetMask_valid + ";isIpMaskMatchValid(IPV4):" + i18n.common_term_IPnotMatchMask_valid
                };
                $scope.subnetIpIPV6Prefix = {
                    id: "add-rule-subnetIpIPV6Prefix",
                    "require": true,
                    label: i18n.common_term_Ipprefix_label + ":",
                    value: "",
                    type: "input",
                    width: "315px",
                    "validate": "required:" + i18n.common_term_null_valid + ";integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "128") + ";minValue(0):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "128") + ";maxValue(128):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "128")
                };
                $scope.startIpIPV4 = {
                    id: "add-rule-startIpIPV4",
                    "require": true,
                    label: i18n.common_term_initiativeIP_label + ":",
                    value: "",
                    type: "ipv4",
                    width: "300px",
                    "extendFunction": ["isIPv4Check"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(add-rule-startIpIPV4):" + i18n.common_term_formatIP_valid
                };
                $scope.startIpIPV6 = {
                    id: "add-rule-startIpIPV6",
                    "require": true,
                    label: i18n.common_term_initiativeIPv6_label + ":",
                    value: "",
                    type: "input",
                    width: "315px",
                    "extendFunction": ["isIPv6Check"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv6Check(add-rule-startIpIPV6):" + i18n.common_term_formatIP_valid
                };
                $scope.endIpIPV4 = {
                    id: "add-rule-endIPIPV4",
                    "require": true,
                    label: i18n.common_term_endIP_label + ":",
                    value: "",
                    type: "ipv4",
                    width: "300px",
                    "extendFunction": ["isIPv4Check", "isIpRangeVaild"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(add-rule-endIPIPV4):" + i18n.common_term_formatIP_valid + ";isIpRangeVaild(IPV4):" + i18n.common_term_endGreaterStartIP_valid
                };
                $scope.endIpIPV6 = {
                    id: "add-rule-endIPIPV6",
                    "require": true,
                    label: i18n.common_term_endIPv6_label + ":",
                    value: "",
                    type: "input",
                    width: "315px",
                    "extendFunction": ["isIPv6Check"],
                    "validate": "required:" + i18n.common_term_null_valid + ";isIPv6Check(add-rule-endIPIPV6):" + i18n.common_term_formatIP_valid
                };
                $scope.okBtn = {
                    "id": "add-rule-ok",
                    "text": i18n.common_term_create_button,
                    "click": function () {
                        var valid = false;
                        var vmsValid = UnifyValid.FormValid($("#add-rule-vmSelect"));
                        if ($scope.isIpv4Checked) {
                            valid = UnifyValid.FormValid($("#ruleCheDiv1"));
                        } else {
                            valid = UnifyValid.FormValid($("#ruleCheDiv2"));
                        }
                        if (!valid || !vmsValid) {
                            return;
                        }

                        var options = {
                            "user": user,
                            "vpcId": $scope.params.vpcId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "params": getParameter()
                        };
                        var deferred = securityGroupServiceIns.addSecurityGroupRule(options);
                        deferred.then(function (data) {
                            // to do
                            $("#addRuleWindowId").widget().destroy();
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "add-rule-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#addRuleWindowId").widget().destroy();
                    }
                };
                $scope.checkRadio = {
                    "id1": "addRuleIPV4RadioId",
                    "id2": "addRuleIPV6RadioId",
                    "text1": "IPV4",
                    "text2": "IPV6",
                    "name": "",
                    "checked1": true,
                    "checked2": false,
                    "change1": function () {
                        var checked = $("#" + $scope.checkRadio.id1).widget().option("checked");
                        if (checked) {
                            $scope.changeImg("IPimg1");
                        }
                    },
                    "change2": function () {
                        var checked = $("#" + $scope.checkRadio.id2).widget().option("checked");
                        if (checked) {
                            $scope.changeImg("IPimg2");
                        }
                    }
                };
                $scope.changeImg = function (imgFlag) {
                    if (imgFlag === "IPimg1") {
                        $scope.isIpv4Checked = true;
                        if ("none" === $("#ruleCheDiv1").css("display")) {
                            $("#ruleCheDiv1").css("display", "block");
                            $("#IPimg1").attr("src", "../theme/default/images/open_close2.png");
                            $("#" + $scope.checkRadio.id1).widget().option("checked", true);

                            $("#ruleCheDiv2").css("display", "none");
                            $("#IPimg2").attr("src", "../theme/default/images/open_close1.png");
                        }
                        $scope.isInitIpv4 = false;
                    }
                    if (imgFlag === "IPimg2") {
                        $scope.isIpv4Checked = false;
                        if ("none" === $("#ruleCheDiv2").css("display")) {
                            $("#ruleCheDiv2").css("display", "block");
                            $("#IPimg2").attr("src", "../theme/default/images/open_close2.png");
                            $("#" + $scope.checkRadio.id2).widget().option("checked", true);

                            $("#ruleCheDiv1").css("display", "none");
                            $("#IPimg1").attr("src", "../theme/default/images/open_close1.png");
                        }
                        if ($scope.isInitIpv6) {
                            $scope.changeSelectedItem(false);
                            $scope.isInitIpv6 = false;
                        }
                    }
                };
                //初始化哪些控件显示
                $scope.changeSelectedItem = function (isInit) {
                    $scope.isIpv4Checked = true;
                    if (!isInit) {
                        $scope.isIpv4Checked = $("#" + $scope.checkRadio.id1).widget().option("checked");
                    }
                    var protocol = "";
                    var source = "";
                    if ($scope.isIpv4Checked) {
                        protocol = "TCP";
                        source = "0";
                        if (!$scope.isInitIpv4) {
                            protocol = $("#" + $scope.protocolIPV4.id).widget().getSelectedId();
                            source = $("#" + $scope.sourceIPV4.id).widget().getSelectedId();
                        }
                        $scope.isInitIpv4 = false;
                        //子网控件
                        $scope.isSubnetShowIPV4 = false;
                        if (source === "0") {
                            $scope.isSubnetShowIPV4 = true;
                        }
                        //ip段控件
                        $scope.isIpRangeShowIPV4 = false;
                        if (source === "1" && !$scope.params.openstack) {
                            $scope.isIpRangeShowIPV4 = true;
                        }
                        //其他安全组控件
                        $scope.isOtherSecGroupShowIPV4 = false;
                        if (source === "2") {
                            $scope.isOtherSecGroupShowIPV4 = true;
                        }
                        //端口范围
                        $scope.isPortRangeShowIPV4 = false;
                        if (protocol === "TCP" || protocol === "UDP") {
                            $scope.isPortRangeShowIPV4 = true;
                        }
                        //ICMP类型
                        $scope.isICMPTypeShowIPV4 = false;
                        if (protocol === "ICMP") {
                            $scope.isICMPTypeShowIPV4 = true;
                        }
                    } else {
                        protocol = "TCP";
                        source = "0";
                        if (!$scope.isInitIpv6) {
                            protocol = $("#" + $scope.protocolIPV6.id).widget().getSelectedId();
                            source = $("#" + $scope.sourceIPV6.id).widget().getSelectedId();
                        }
                        $scope.isInitIpv6 = false;
                        //子网控件
                        $scope.isSubnetShowIPV6 = false;
                        if (source === "0") {
                            $scope.isSubnetShowIPV6 = true;
                        }
                        //ip段控件
                        $scope.isIpRangeShowIPV6 = false;
                        if (source === "1" && !$scope.params.openstack) {
                            $scope.isIpRangeShowIPV6 = true;
                        }
                        //其他安全组控件
                        $scope.isOtherSecGroupShowIPV6 = false;
                        if (source === "2") {
                            $scope.isOtherSecGroupShowIPV6 = true;
                        }
                        //端口范围
                        $scope.isPortRangeShowIPV6 = false;
                        if (protocol === "TCP" || protocol === "UDP") {
                            $scope.isPortRangeShowIPV6 = true;
                        }
                        //ICMP类型
                        $scope.isICMPTypeShowIPV6 = false;
                        if (protocol === "ICMP") {
                            $scope.isICMPTypeShowIPV6 = true;
                        }
                    }
                };
                $scope.changeSelectedItem(true);

                //分场景获取添加规则参数值
                function getParameter() {
                    var protocol = "";
                    var direction = "";
                    var source = "";
                    var ipRange = "";
                    var allowedSGID = "";
                    var fromPort = "";
                    var toPort = "";
                    var allowedMac = "";
                    var ipVersion = "";

                    //临时变量
                    var subnetIPTmp = "";
                    var subnetMaskTmp = "";
                    var startIPTmp = "";
                    var endIPTmp = "";
                    var icmpItemIdTmp = "";
                    if ($scope.isIpv4Checked) {
                        //4表示IPV4
                        ipVersion = "4";
                        protocol = $("#" + $scope.protocolIPV4.id).widget().getSelectedId();
                        direction = $("#" + $scope.directionIPV4.id).widget().getSelectedId();
                        if ($scope.params.openstack) {
                            direction = $("#" + $scope.directionIPV4_ICT.id).widget().getSelectedId();
                        }
                        source = $("#" + $scope.sourceIPV4.id).widget().getSelectedId();

                        if ((protocol === "TCP" || protocol === "UDP") && source === "0") {
                            subnetIPTmp = $("#" + $scope.subnetIpIPV4.id).widget().getValue();
                            subnetMaskTmp = $("#" + $scope.subnetMaskIPV4.id).widget().getValue();
                            ipRange = subnetIPTmp + "/" + subnetMaskTmp;
                            fromPort = $("#" + $scope.portRangeIPV4.fromPort.id).widget().getValue();
                            toPort = $("#" + $scope.portRangeIPV4.toPort.id).widget().getValue();
                        } else if ((protocol === "TCP" || protocol === "UDP") && source === "1") {
                            startIPTmp = $("#" + $scope.startIpIPV4.id).widget().getValue();
                            endIPTmp = $("#" + $scope.endIpIPV4.id).widget().getValue();
                            ipRange = startIPTmp + "-" + endIPTmp;
                            fromPort = $("#" + $scope.portRangeIPV4.fromPort.id).widget().getValue();
                            toPort = $("#" + $scope.portRangeIPV4.toPort.id).widget().getValue();
                        } else if ((protocol === "TCP" || protocol === "UDP") && source === "2") {
                            allowedSGID = $("#" + $scope.otherSecGroupIPV4.id).widget().getSelectedId();
                            fromPort = $("#" + $scope.portRangeIPV4.fromPort.id).widget().getValue();
                            toPort = $("#" + $scope.portRangeIPV4.toPort.id).widget().getValue();
                        } else if ((protocol === "TCP" || protocol === "UDP") && source === "3") {
                            ipRange = $scope.ipRange;
                            fromPort = $("#" + $scope.portRangeIPV4.fromPort.id).widget().getValue();
                            toPort = $("#" + $scope.portRangeIPV4.toPort.id).widget().getValue();
                            allowedMac = $scope.allowedMac;
                        } else if (protocol === "ICMP" && source === "0") {
                            subnetIPTmp = $("#" + $scope.subnetIpIPV4.id).widget().getValue();
                            subnetMaskTmp = $("#" + $scope.subnetMaskIPV4.id).widget().getValue();
                            ipRange = subnetIPTmp + "/" + subnetMaskTmp;
                            icmpItemIdTmp = $("#" + $scope.ICMPTypeIPV4.id).widget().getSelectedId();
                            fromPort = getPort(icmpItemIdTmp).fromPort;
                            toPort = getPort(icmpItemIdTmp).toPort;
                        } else if (protocol === "ICMP" && source === "1") {
                            startIPTmp = $("#" + $scope.startIpIPV4.id).widget().getValue();
                            endIPTmp = $("#" + $scope.endIpIPV4.id).widget().getValue();
                            ipRange = startIPTmp + "-" + endIPTmp;
                            icmpItemIdTmp = $("#" + $scope.ICMPTypeIPV4.id).widget().getSelectedId();
                            fromPort = getPort(icmpItemIdTmp).fromPort;
                            toPort = getPort(icmpItemIdTmp).toPort;
                        } else if (protocol === "ICMP" && source === "2") {
                            allowedSGID = $("#" + $scope.otherSecGroupIPV4.id).widget().getSelectedId();
                            icmpItemIdTmp = $("#" + $scope.ICMPTypeIPV4.id).widget().getSelectedId();
                            fromPort = getPort(icmpItemIdTmp).fromPort;
                            toPort = getPort(icmpItemIdTmp).toPort;
                        } else if (protocol === "ICMP" && source === "3") {
                            ipRange = $scope.ipRange;
                            icmpItemIdTmp = $("#" + $scope.ICMPTypeIPV4.id).widget().getSelectedId();
                            fromPort = getPort(icmpItemIdTmp).fromPort;
                            toPort = getPort(icmpItemIdTmp).toPort;
                            allowedMac = $scope.allowedMac;
                        } else if (protocol === "Any" && source === "0") {
                            subnetIPTmp = $("#" + $scope.subnetIpIPV4.id).widget().getValue();
                            subnetMaskTmp = $("#" + $scope.subnetMaskIPV4.id).widget().getValue();
                            ipRange = subnetIPTmp + "/" + subnetMaskTmp;
                            fromPort = -1;
                            toPort = -1;
                        } else if (protocol === "Any" && source === "1") {
                            startIPTmp = $("#" + $scope.startIpIPV4.id).widget().getValue();
                            endIPTmp = $("#" + $scope.endIpIPV4.id).widget().getValue();
                            ipRange = startIPTmp + "-" + endIPTmp;
                            fromPort = -1;
                            toPort = -1;
                        } else if (protocol === "Any" && source === "2") {
                            allowedSGID = $("#" + $scope.otherSecGroupIPV4.id).widget().getSelectedId();
                            fromPort = -1;
                            toPort = -1;
                        } else if (protocol === "Any" && source === "3") {
                            ipRange = $scope.ipRange;
                            fromPort = -1;
                            toPort = -1;
                            allowedMac = $scope.allowedMac;
                        }
                    } else {
                        //6表示IPV6
                        ipVersion = "6";
                        protocol = $("#" + $scope.protocolIPV6.id).widget().getSelectedId();
                        if ($scope.params.openstack) {
                            direction = $("#" + $scope.directionIPV6_ICT.id).widget().getSelectedId();
                        }
                        source = $("#" + $scope.sourceIPV6.id).widget().getSelectedId();
                        if ((protocol === "TCP" || protocol === "UDP") && source === "0") {
                            subnetIPTmp = $("#" + $scope.subnetIpIPV6.id).widget().getValue();
                            subnetMaskTmp = $("#" + $scope.subnetIpIPV6Prefix.id).widget().getValue();
                            ipRange = subnetIPTmp + "/" + subnetMaskTmp;
                            fromPort = $("#" + $scope.portRangeIPV6.fromPort.id).widget().getValue();
                            toPort = $("#" + $scope.portRangeIPV6.toPort.id).widget().getValue();
                        } else if ((protocol === "TCP" || protocol === "UDP") && source === "1") {
                            startIPTmp = $("#" + $scope.startIpIPV6.id).widget().getValue();
                            endIPTmp = $("#" + $scope.endIpIPV6.id).widget().getValue();
                            ipRange = startIPTmp + "-" + endIPTmp;
                            fromPort = $("#" + $scope.portRangeIPV6.fromPort.id).widget().getValue();
                            toPort = $("#" + $scope.portRangeIPV6.toPort.id).widget().getValue();
                        } else if ((protocol === "TCP" || protocol === "UDP") && source === "2") {
                            allowedSGID = $("#" + $scope.otherSecGroupIPV6.id).widget().getSelectedId();
                            fromPort = $("#" + $scope.portRangeIPV6.fromPort.id).widget().getValue();
                            toPort = $("#" + $scope.portRangeIPV6.toPort.id).widget().getValue();
                        } else if (protocol === "ICMP" && source === "0") {
                            subnetIPTmp = $("#" + $scope.subnetIpIPV6.id).widget().getValue();
                            subnetMaskTmp = $("#" + $scope.subnetIpIPV6Prefix.id).widget().getValue();
                            ipRange = subnetIPTmp + "/" + subnetMaskTmp;
                            fromPort = $("#" + $scope.ICMPTypeIPV6.id).widget().getValue();
                            toPort = $("#" + $scope.ICMPCodeIPV6.id).widget().getValue();
                        } else if (protocol === "ICMP" && source === "1") {
                            startIPTmp = $("#" + $scope.startIpIPV6.id).widget().getValue();
                            endIPTmp = $("#" + $scope.endIpIPV6.id).widget().getValue();
                            ipRange = startIPTmp + "-" + endIPTmp;
                            fromPort = $("#" + $scope.ICMPTypeIPV6.id).widget().getValue();
                            toPort = $("#" + $scope.ICMPCodeIPV6.id).widget().getValue();
                        } else if (protocol === "ICMP" && source === "2") {
                            allowedSGID = $("#" + $scope.otherSecGroupIPV6.id).widget().getSelectedId();
                            fromPort = $("#" + $scope.ICMPTypeIPV6.id).widget().getValue();
                            toPort = $("#" + $scope.ICMPCodeIPV6.id).widget().getValue();
                        } else if (protocol === "Any" && source === "0") {
                            subnetIPTmp = $("#" + $scope.subnetIpIPV6.id).widget().getValue();
                            subnetMaskTmp = $("#" + $scope.subnetIpIPV6Prefix.id).widget().getValue();
                            ipRange = subnetIPTmp + "/" + subnetMaskTmp;
                            fromPort = -1;
                            toPort = -1;
                        } else if (protocol === "Any" && source === "1") {
                            startIPTmp = $("#" + $scope.startIpIPV6.id).widget().getValue();
                            endIPTmp = $("#" + $scope.endIpIPV6.id).widget().getValue();
                            fromPort = -1;
                            toPort = -1;
                            ipRange = startIPTmp + "-" + endIPTmp;
                        } else if (protocol === "Any" && source === "2") {
                            fromPort = -1;
                            toPort = -1;
                            allowedSGID = $("#" + $scope.otherSecGroupIPV6.id).widget().getSelectedId();
                        }
                    }
                    return {
                        "sgID": $scope.params.secGroupId,
                        "ipVersion": ipVersion,
                        "ipProtocol": protocol,
                        "ipRange": ipRange,
                        "allowedSGID": allowedSGID,
                        "fromPort": fromPort,
                        "toPort": toPort,
                        "allowedMac": allowedMac,
                        "direction": direction
                    };
                }

                //获取安全组
                function querySG() {
                    var options = {
                        "user": user,
                        "vpcId": $scope.params.vpcId,
                        "cloudInfraId": $scope.params.cloudInfraId
                    };
                    var deferred = securityGroupServiceIns.querySecurityGroup(options);
                    deferred.then(function (response) {
                        if (!response || !response.sgs) {
                            return;
                        }
                        var secGroupListRes = response.sgs;
                        if (!secGroupListRes || secGroupListRes.length === 0) {
                            return;
                        }
                        var values = [];
                        _.each(secGroupListRes, function (item, index) {
                            var tmp = {
                                "selectId": item.sgID,
                                "label": item.name,
                                "checked": (index === 0)
                            };
                            values.push(tmp);
                        });
                        $scope.otherSecGroupIPV4.values = values;
                        $scope.otherSecGroupIPV6.values = values;
                    });
                }

                //进入到添加规则页面，先要查询能力开关，sg_support_YD_fancy_features 为ture时，显示方向
                function queryCapacity() {
                    var promise = new cloudInfraService($q, camel).queryCloudInfra($scope.params.vdcId, $scope.params.userId, $scope.params.cloudInfraId);
                    promise.then(function (data) {
                        if (data && data.cloudInfra) {
                            $scope.cloudInfra = data.cloudInfra;
                            var capacity = cloudInfrasCapacity.querySpecificCapacity($("html").scope().capacities, $scope.cloudInfra.type, $scope.cloudInfra.version);
                            if (capacity) {
                                var temp = capacity.sg_support_YD_fancy_features;
                                if (temp === "true") {
                                    $scope.directionIPV4.display = true;
                                    var tempItem = {
                                        "selectId": "3",
                                        "label": i18n.common_term_vm_label
                                    };
                                    $scope.sourceIPV4.values.push(tempItem);
                                    $("#add-rule-sourceIPV4").widget().option("values", $scope.sourceIPV4.values);
                                } else {
                                    $scope.directionIPV4.display = false;
                                }
                            }
                        }
                    });
                }

                //查询虚拟机列表
                function getVmData() {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "condition": searchString,
                        "start": page.getStart(),
                        "limit": page.displayLength,
                        "status": null,
                        "vpcId": null
                    };
                    var deferred = securityGroupServiceIns.queryVm4SG(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        if (data.list.vms) {
                            _.each(data.list.vms, function (item) {
                                _.extend(item, {
                                    "showDetail": "",
                                    "IP": getIp(item),
                                    "MAC": getMac(item)
                                });
                            });
                            $("#" + $scope.vmIPV4.id).widget().option("display-length", page.displayLength);
                            $("#" + $scope.vmIPV4.id).widget().option("total-records", data.list.total);
                            $("#" + $scope.vmIPV4.id).widget().option("data", data.list.vms);
                            $("#" + $scope.vmIPV4.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        }
                    });
                }
                // 查询Detail，包括基本信息，硬件信息
                function queryVmDetail(vmId) {
                    var options = {
                        "user": user,
                        "id": vmId,
                        "vpcId": $scope.params.vpcId,
                        "cloudInfraId": $scope.params.cloudInfraId
                    };
                    var deferred = securityGroupServiceIns.queryVmDetails(options);
                    deferred.then(function (data) {
                        if (!data || !data.vm) {
                            return;
                        }
                        if (data.vm) {
                            $scope.vm = data.vm;
                        }
                        $scope.setVmSelectByVm();
                    });
                }

                //从查询得到的VM信息中获取IP
                function getIp(vm) {
                    var ip = "";
                    if (vm && vm.vmSpecInfo) {
                        var nics = vm.vmSpecInfo.nics;
                        if (nics && nics.length) {
                            _.each(nics, function (item) {
                                ip += item.ip;
                                ip += ";";
                            });
                            var index = ip.lastIndexOf(";");
                            if (index > 0 && index === ip.length - 1) {
                                ip = ip.slice(0, index);
                            }
                        }
                    }
                    return ip;
                }

                function getMac(vm) {
                    var mac = "";
                    if (vm && vm.vmSpecInfo) {
                        var nics = vm.vmSpecInfo.nics;
                        if (nics && nics.length) {
                            _.each(nics, function (item) {
                                mac += item.mac;
                                mac += ";";
                            });
                            var index = mac.lastIndexOf(";");
                            if (index > 0 && index === mac.length - 1) {
                                mac = mac.slice(0, index);
                            }
                        }
                    }
                    return mac;
                }
                //初始化页面
                queryCapacity();
                querySG();
            }
        ];

        var module = angular.module("addRuleModule", ["ng", "ngSanitize", "wcc"]);
        module.controller("addRuleCtrl", ctrl);
        module.service("camel", http);
        return module;
    });
