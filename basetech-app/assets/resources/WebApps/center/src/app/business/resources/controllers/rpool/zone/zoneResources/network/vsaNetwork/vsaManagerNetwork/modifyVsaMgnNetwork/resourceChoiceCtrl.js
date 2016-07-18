/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'tiny-widgets/Checkbox',
    'tiny-common/UnifyValid',
    'app/business/resources/controllers/constants'],
    function (angular, Checkbox, UnifyValid, constants, zoneFixtures) {
        "use strict";

        var resourceChoiceCtrl = ["$scope", "$state", "$stateParams", "camel", '$rootScope', "validator", function ($scope, $state, $stateParams, camel, $rootScope, validator) {
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                if (!ip) {
                    return true;
                }
                return validator.ipValidator(ip);
            };
            UnifyValid.maskCheck = function (maskId) {
                var mask = $("#" + maskId).widget().getValue();
                return validator.maskValidator(mask);
            };
            UnifyValid.maskAndSubnetCheck = function (maskId) {
                var mask = $("#" + maskId).widget().getValue();
                var ip = $("#" + $scope.subnetIp.id).widget().getValue();
                return validator.maskAndSubnetValidator(mask, ip);
            };
            UnifyValid.subnetCheck = function (ipId) {
                var ip = $("#" + ipId).widget().getValue();
                if (!ip) {
                    return true
                }
                var mask = $("#" + $scope.subnetMask.id).widget().getValue();
                var subnet = $("#" + $scope.subnetIp.id).widget().getValue();
                return validator.subnetValidator(ip, mask, subnet);
            };
            UnifyValid.gatewayCheck = function () {
                var ip = $("#" + $scope.gateway.id).widget().getValue();
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
            UnifyValid.equalGateway = function (ipId) {
                var ip = $("#" + ipId).widget().getValue();
                var gateway = $("#" + $scope.gateway.id).widget().getValue();

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
            $scope.dvsSearchModel = {
                "name": "",
                "hypervisorid": "",
                "start": 0,
                "limit": 10
            };
            var dvsTableColumns = [
                {
                    "sTitle": "",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "sWidth": "10%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.virtual_term_cluster_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.zone);
                    },
                    "sWidth": "15%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hypervisorName);
                    },
                    "sWidth": "20%",
                    "bSortable": false}
            ];
            $scope.dvsTable = {
                "id": "dvsTable",
                "data": [],
                "columns": dvsTableColumns,
                "enablePagination": true,
                "paginationStyle": "full-numbers",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
                "curPage": {"pageIndex": 1},
                "requestConfig": {
                    "enableRefresh": false,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "totalRecords": 0,
                "hideTotalRecords": false,
                "callback": function (evtObj) {
                    $scope.dvsSearchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.dvsSearchModel.limit = evtObj.displayLength;
                    $scope.operate.queryDvs($scope.dvsSearchModel);
                },
                "changeSelect": function (evtObj) {
                    $scope.dvsSearchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.dvsSearchModel.limit = evtObj.displayLength;
                    $scope.operate.queryDvs($scope.dvsSearchModel);
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    //复选框checkbox
                    var options = {
                        "id": "checkbox" + iDataIndex,
                        "checked": $.inArray(aData.id, $scope.connectInfo.dvsIds) >= 0,
                        "disable": $.inArray(aData.id, $scope.connectInfo.dvsIds) >= 0,
                        "change": function () {
                            if ($("#" + options.id).widget().option("checked")) {
                                $("#" + $scope.nextBtn.id).widget().option("disable", false);
                                if ($scope.operate.isCheckboxAllChecked()) {
                                    $("#tableCheckbox").widget().option("checked", true);
                                }
                            }
                            else {
                                $("#tableCheckbox").widget().option("checked", false);
                                $("#" + $scope.nextBtn.id).widget().option("disable", $scope.operate.isCheckboxCheckedNone());
                            }
                            ;
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());

                }
            };
            $scope.model = {
                "label": "DVS:",
                "require": true
            };
            $scope.subnetIp = {
                "label": $scope.i18n.common_term_SubnetIP_label + ":" || "子网IP:",
                "require": "true",
                "id": "subnetIp",
                "type": "ipv4",
                "value": "",
                "disable": true,
                "width": "215px",
                "extendFunction": ["ipCheck"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(subnetIp):" + $scope.i18n.common_term_formatIP_valid
            };
            $scope.subnetMask = {
                "label": $scope.i18n.common_term_SubnetMask_label + ":" || "子网掩码:",
                "require": "true",
                "id": "subnetMask",
                "type": "ipv4",
                "value": "",
                "disable": true,
                "width": "215px",
                "extendFunction": ["maskCheck", "maskAndSubnetCheck"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maskCheck(subnetMask):" + $scope.i18n.common_term_formatSubnetMask_valid + ";maskAndSubnetCheck(subnetMask):" + $scope.i18n.common_term_formatSubnetIPandMask_valid
            };
            $scope.gateway = {
                "label": $scope.i18n.common_term_gateway_label + ":" || "网关:",
                "require": "true",
                "id": "gateway",
                "type": "ipv4",
                "value": "",
                "disable": true,
                "width": "215px",
                "extendFunction": ["subnetCheck", "gatewayCheck"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + "subnetCheck(gateway):" + $scope.i18n.resource_term_outSubnet_valid + ";gatewayCheck:" + $scope.i18n.vpc_term_gatewayError_valid
            };
            $scope.availableIpSegment = {
                "width": "215px",
                "disable": "false"
            };
            $scope.availableIpSegment1 = {
                "label": $scope.i18n.common_term_enableIPsegment_label + ":" || "可用IP地址段:",
                "require": "true",
                "display": true,
                "width": "215px",
                startIp: {
                    "id": "startIp1",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";subnetCheck(startIp1):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp1):可用IP不能包含网关"
                },
                endIp: {
                    "id": "endIp1",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";subnetCheck(endIp1):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp1):可用IP不能包含网关"
                },
                "validate": "required:" + $scope.i18n.common_term_null_valid
            };
            $scope.availableIpSegment2 = {
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
            };
            $scope.availableIpSegment3 = {
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
            };
            $scope.availableIpSegment4 = {
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
            };
            $scope.availableIpSegment5 = {
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
            };
            $scope.availableIpSegment6 = {
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
            };

            $scope.availableIpSegment7 = {
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
            };
            $scope.availableIpSegment8 = {
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
            };
            $scope.availableIpSegment9 = {
                "display": false,
                startIp: {
                    "id": "startIp9",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(startIp9):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp9):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                },
                endIp: {
                    "id": "endIp9",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(endIp9):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp9):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                }
            };
            $scope.availableIpSegment10 = {
                display: false,
                startIp: {
                    "id": "startIp10",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(startIp10):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp10):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                },
                endIp: {
                    "id": "endIp10",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(endIp10):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp10):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                }
            };
            $scope.availableIpSegment11 = {
                display: false,
                startIp: {
                    "id": "startIp11",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(startIp11):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp11):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                },
                endIp: {
                    "id": "endIp11",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(endIp11):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp11):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                }
            };
            $scope.availableIpSegment12 = {
                display: false,
                startIp: {
                    "id": "startIp12",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(startIp12):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp12):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                },
                endIp: {
                    "id": "endIp12",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(endIp12):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp12):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                }
            };
            $scope.availableIpSegment13 = {
                display: false,
                startIp: {
                    "id": "startIp13",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(startIp13):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp13):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                },
                endIp: {
                    "id": "endIp13",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(endIp13):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp13):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                }
            };
            $scope.availableIpSegment14 = {
                display: false,
                startIp: {
                    "id": "startIp14",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(startIp14):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp14):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                },
                endIp: {
                    "id": "endIp14",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(endIp14):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp14):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                }
            };
            $scope.availableIpSegment15 = {
                display: false,
                startIp: {
                    "id": "startIp15",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(startIp15):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp15):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                },
                endIp: {
                    "id": "endIp15",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(endIp15):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp15):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                }
            };
            $scope.availableIpSegment16 = {
                display: false,
                startIp: {
                    "id": "startIp16",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(startIp14):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp16):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                },
                endIp: {
                    "id": "endIp16",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["subnetCheck", "equalGateway"],
                    "validate": "subnetCheck(endIp16):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp16):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                }
            };
            $scope.vlan = {
                "label": "VLAN ID:",
                "require": true,
                "disable": true,
                "id": "vlanTextbox",
                "width": "215px",
                "type": "input",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 4094}) + ";maxValue(4094):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 4094}),
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 4094}),
                "tips": $scope.i18n.resource_vsa_addVSA_para_VLAN_mean_tip
            };
            $scope.preBtn = {
                "id": "resourceChoicePreBtn",
                "text": $scope.i18n.common_term_back_button || "上一步",
                "click": function () {
                    $scope.service.showPage = "baseInfo";
                    $("#" + $scope.service.addVsaMgnNetworkStep.id).widget().pre();
                }
            };
            $scope.nextBtn = {
                "id": "resourceChoiceNextBtn",
                "text": $scope.i18n.common_term_next_button || "下一步",
                "disable": false,
                "click": function () {
                    var valid = UnifyValid.FormValid($("#resourceChoiceDiv"));
                    if (!valid) {
                        return;
                    }
                    var dvsIdList = [];
                    var dvsNameList = [];
                    for (var index in $scope.dvsTable.data) {
                        var id = "checkbox" + index;
                        if ($("#" + id).widget().option("checked")) {
                            dvsIdList.push($scope.dvsTable.data[index].id);
                            dvsNameList.push($scope.dvsTable.data[index].name);
                        }
                    }
                    var availableIPRanges = [];
                    var ips = [];
                    for (var i = 1; i <= 16; i++) {
                        var id = "availableIpSegment" + i;
                        if ($scope[id].display) {
                            var startIP = $("#" + $scope[id].startIp.id).widget().getValue();
                            var endIP = $("#" + $scope[id].endIp.id).widget().getValue();
                            if (startIP && endIP) {
                                availableIPRanges.push({"startIP": startIP, "endIP": endIP});
                                ips.push({"startIP": startIP, "endIP": endIP});
                            }
                        }
                    }
                    $scope.createInfo.dvsIDs = dvsIdList;
                    $scope.service.availableIPs = ips;
                    $scope.service.dvsNames = dvsNameList;
                    $scope.createInfo.availableIPRanges = availableIPRanges;
                    $scope.service.showPage = "netExportLimit";
                    $("#" + $scope.service.addVsaMgnNetworkStep.id).widget().next();
                }
            };
            $scope.cancelBtn = {
                "id": "resourceChoiceCancelBtn",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("resources.zoneResources.vsaNetwork.vsaManagerNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                }
            };
            $scope.operate = {
                //设置复选框选中状态
                setCheckbox: function (param) {
                    for (var index in $scope.dvsTable.data) {
                        var id = "checkbox" + index;
                        if (!$("#" + id).widget().option("disable")) {
                            $("#" + id).widget().option("checked", param);
                        }
                    }
                },

                //复选框是否全部选中
                isCheckboxAllChecked: function () {
                    for (var index in $scope.dvsTable.data) {
                        var id = "checkbox" + index;
                        if (!$("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                },

                "addIpv4Ip": function () {
                    for (var i = 2; i <= 16; i++) {
                        var id = "availableIpSegment" + i;
                        if (!$scope[id].display) {
                            $scope[id].display = true;
                            return;
                        }
                    }

                },
                "deleteIpv4Ip": function (id) {
                    $scope[id].display = false;
                },

                //复选框是否没有一个选中
                isCheckboxCheckedNone: function () {
                    for (var index in $scope.dvsTable.data) {
                        var id = "checkbox" + index;
                        if ($("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                },

                //查询DVS
                queryDvs: function (params) {
                    var queryConfig = constants.rest.DVS_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $stateParams.zoneId, "start": params.start, "limit": params.limit, "name": "", "hypervisorid": ""}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            for (var index in response.dvses) {
                                    var clusterName = [];
                                for (var key in response.dvses[index].clusterIDsMapNames) {
                                        clusterName.push(response.dvses[index].clusterIDsMapNames[key]);
                                }
                                    response.dvses[index].zone = clusterName.join(";");
                            }
                            $scope.dvsTable.data = response.dvses;
                            $scope.dvsTable.totalRecords = response.total;
                        });
                        //初始化表头的复选框
                        var options = {
                            "id": "tableCheckbox",
                            "checked": $scope.operate.isCheckboxAllChecked(),
                            "change": function () {
                                var isChecked = $("#" + options.id).widget().options.checked;
                                $scope.operate.setCheckbox(isChecked);
                                $("#" + $scope.nextBtn.id).widget().option("disable", $scope.operate.isCheckboxCheckedNone());
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('#dvsTable th:eq(0)').html(checkbox.getDom());

                    });
                }
            }
            $scope.$on($scope.modifyVsaMgnNetworkEvents.setConnectInfo, function (event, msg) {
                setTimeout(function () {
                    $("#" + $scope.subnetIp.id).widget().option("value", $scope.connectInfo.subnetIP);
                    $("#" + $scope.subnetMask.id).widget().option("value", $scope.connectInfo.subnetMask);
                    $("#" + $scope.gateway.id).widget().option("value", $scope.connectInfo.subnetGateway);
                    $("#" + $scope.vlan.id).widget().option("value", $scope.connectInfo.vlan);
                    for (var index in $scope.connectInfo.availableIPRanges) {
                        var id = "availableIpSegment" + (parseInt(index) + 1);
                        $scope[id].display = true;
                        $("#" + $scope[id].startIp.id).widget().setDisable(true);
                        $("#" + $scope[id].endIp.id).widget().setDisable(true);
                        $("#" + $scope[id].startIp.id).widget().option("value", $scope.connectInfo.availableIPRanges[index].startIP);
                        $("#" + $scope[id].endIp.id).widget().option("value", $scope.connectInfo.availableIPRanges[index].endIP);
                    }
                    $scope.operate.queryDvs($scope.dvsSearchModel);
                }, 100);
            });

        }];

        return resourceChoiceCtrl;
    })
;
