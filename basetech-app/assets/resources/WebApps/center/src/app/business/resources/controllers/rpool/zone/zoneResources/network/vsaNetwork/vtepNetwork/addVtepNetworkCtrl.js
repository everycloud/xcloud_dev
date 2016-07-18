/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-5-14

 */
define(["tiny-lib/angular",
    'tiny-widgets/Checkbox',
    'tiny-common/UnifyValid',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService"],
    function (angular, Checkbox, UnifyValid, constants, ExceptionService) {
        "use strict";
        var addVtepNetworkCtrl = ["$scope", "$state", "$stateParams", "$rootScope", "validator", "camel", function ($scope, $state, $stateParams, $rootScope, validator, camel) {
            $scope.action = "add";
            $scope.zoneInfo = {
                "id": $stateParams.zoneId,
                "name": $stateParams.zoneName
            }
            $scope.showBasicInfoPage = true;
            $scope.showResourcePage = false;
            $scope.showConfirmInfoPage = false;
            $scope.addVtepNetworkStep1 = {
                "url": "../src/app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/addVtepNetwork/baseInfo.html"
            };
            $scope.addVtepNetworkStep2 = {
                "url": "../src/app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/addVtepNetwork/resourceChoice.html"
            };
            $scope.addVtepNetworkStep3 = {
                "url": "../src/app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/addVtepNetwork/confirmInfo.html"
            };
            $scope.addVtepNetworkStep = {
                "id": "addVtepNetworkStepId",
                "jumpable": "false",
                "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.resource_term_chooseResource_label, $scope.i18n.common_term_confirmInfo_label],
                "width": "800"
            };
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
            UnifyValid.subnetCheck = function (ipId) {
                var ip = $("#" + ipId).widget().getValue();
                if (!ip) {
                    return true
                }
                var mask = $("#" + $scope.resource.subnetMask.id).widget().getValue();
                var subnet = $("#" + $scope.resource.subnetIp.id).widget().getValue();
                return validator.subnetValidator(ip, mask, subnet);
            };
            UnifyValid.gatewayCheck = function () {
                var ip = $("#" + $scope.resource.gateway.id).widget().getValue();
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
                var gateway = $("#" + $scope.resource.gateway.id).widget().getValue();

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
            UnifyValid.endIp = function (id) {
                var startIp = $("#" + id.toString().replace("end", "start")).widget().getValue();
                var endIp = $("#" + id).widget().getValue();
                if (startIp && endIp) {
                    return validator.ipCompare(startIp, endIp);
                }
                else {
                    return true;
                }

            };
            //确认页面信息
            $scope.service = {
                "availableIPs": [],
                "dvsNames": ""
            }
            //创建信息
            $scope.createInfo = {
                "zoneID": $stateParams.zoneId,
                "name": "",
                "description": "",
                "subnetIP": "",
                "subnetMask": "",
                "subnetGateWay": "",
                "vlan": 0,
                "availableIPRanges": [],
                "dvsIDs": []
            };
            $scope.basicInfo = {
                name: {
                    "id": "nameText",
                    "label": $scope.i18n.common_term_name_label + ":" || "名称:",
                    "require": "true",
                    "width": "215px",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.name + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}) + " " + $scope.i18n.common_term_composition2_valid
                },
                description: {
                    "id": "descriptionText",
                    "label": $scope.i18n.common_term_desc_label || "描述:",
                    "type": "multi",
                    "width": "215px",
                    "height": "40px",
                    "require": "false",
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                    "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                },
                nextBtn: {
                    "id": "baseNextBtn",
                    "text": $scope.i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#baseInfoDiv"));
                        if (!valid) {
                            return;
                        }
                        $scope.createInfo.name = $("#" + $scope.basicInfo.name.id).widget().getValue();
                        $scope.createInfo.description = $("#" + $scope.basicInfo.description.id).widget().getValue();
                        $scope.showBasicInfoPage = false;
                        $scope.showResourcePage = true;
                        $scope.showConfirmInfoPage = false;
                        $("#" + $scope.addVtepNetworkStep.id).widget().next();
                        $scope.operate.queryDvs($scope.dvsSearchModel);
                    }
                },
                cancelBtn: {
                    "id": "baseCancelBtn",
                    "text": $scope.i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("resources.zoneResources.vsaNetwork.vtepNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                    }
                }
            }
            $scope.dvsSearchModel = {
                "dvstype": "VSWITCH",
                "hypervisortype": "fusioncompute",
                "start": 0,
                "limit": 10
            };
            var dvsTableColumns = [
                {
                    "sTitle": "",
                    "mData": "",
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
            $scope.resource = {
                dvsTable: {
                    "id": "dvsTable",
                    "data": [],
                    "columns": dvsTableColumns,
                    "enablePagination": true,
                    "columnsDraggable": true,
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
                        //复选框checkbox
                        var options = {
                            "id": "checkbox" + iDataIndex,
                            "checked": false,
                            "change": function () {
                                if ($("#" + options.id).widget().option("checked")) {
                                    $("#" + $scope.resource.nextBtn.id).widget().option("disable", false);
                                    if ($scope.operate.isCheckboxAllChecked()) {
                                        $("#tableCheckbox").widget().option("checked", true);
                                    }
                                }
                                else {
                                    $("#tableCheckbox").widget().option("checked", false);
                                    $("#" + $scope.resource.nextBtn.id).widget().option("disable", $scope.operate.isCheckboxCheckedNone());
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', nRow).html(checkbox.getDom());

                    }
                },
                model: {
                    "label": "DVS：",
                    "require": true
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
                    "extendFunction": ["maskCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maskCheck(subnetMask):" + $scope.i18n.common_term_formatSubnetMask_valid
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
                    "validate": "required:" + $scope.i18n.common_term_null_valid + "subnetCheck(gateway):" + $scope.i18n.resource_term_outSubnet_valid + ";gatewayCheck:不合法的网关"
                },
                availableIpSegment: {
                    "width": "215px",
                    "disable": "false"
                },
                availableIpSegment1: {
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
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";subnetCheck(startIp1):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(startIp1):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid
                    },
                    endIp: {
                        "id": "endIp1",
                        "type": "ipv4",
                        "value": "",
                        "disable": false,
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";subnetCheck(endIp1):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp1):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp1):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    },
                    "validate": "required:" + $scope.i18n.common_term_null_valid
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp2):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp2):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp2):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp3):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp3):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp3):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp4):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp4):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp4):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp5):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp5):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp5):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp6):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp6):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp6):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp7):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp7):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp7):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp8):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp8):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp8):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                availableIpSegment9: {
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp9):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp9):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp9):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                availableIpSegment10: {
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp10):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp10):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp10):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                availableIpSegment11: {
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp11):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp11):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp11):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                availableIpSegment12: {
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp12):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp12):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp12):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                availableIpSegment13: {
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp13):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp13):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp13):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                availableIpSegment14: {
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp14):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp14):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp14):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                availableIpSegment15: {
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp15):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp15):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp15):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                availableIpSegment16: {
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
                        "extendFunction": ["subnetCheck", "equalGateway", "endIp"],
                        "validate": "subnetCheck(endIp16):" + $scope.i18n.resource_term_outSubnet_valid + ";equalGateway(endIp16):" + $scope.i18n.common_term_enableIPsegmentExcludeGate_valid + ";endIp(endIp16):" + $scope.i18n.common_term_endGreaterEqualStartIP_valid
                    }
                },
                vlan: {
                    "label": "VLAN ID:",
                    "require": "true",
                    "id": "vlanTextbox",
                    "width": "215px",
                    "type": "input",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 4094}) + ";maxValue(4094):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 4094}),
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 4094}),
                    "tips": $scope.i18n.resource_vsa_addVTEP_para_VLAN_mean_tip
                },
                preBtn: {
                    "id": "resourcePreBtn",
                    "text": $scope.i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $scope.showBasicInfoPage = true;
                        $scope.showResourcePage = false;
                        $scope.showConfirmInfoPage = false;
                        $("#" + $scope.addVtepNetworkStep.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "resourceNextBtn",
                    "text": $scope.i18n.common_term_next_button || "下一步",
                    "disable": true,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#resourceChoiceDiv"));
                        if (!valid) {
                            return;
                        }
                        var dvsIdList = [];
                        var dvsNameList = [];
                        for (var index in $scope.resource.dvsTable.data) {
                            var id = "checkbox" + index;
                            if ($("#" + id).widget().option("checked")) {
                                dvsIdList.push($scope.resource.dvsTable.data[index].id);
                                dvsNameList.push($scope.resource.dvsTable.data[index].name);
                            }
                        }
                        var availableIPRanges = [];
                        $scope.service.availableIPs = [];
                        var ips = "";
                        for (var i = 1; i <= 16; i++) {
                            var id = "availableIpSegment" + i;
                            if ($scope.resource[id].display) {
                                var startIP = $("#" + $scope.resource[id].startIp.id).widget().getValue();
                                var endIP = $("#" + $scope.resource[id].endIp.id).widget().getValue();
                                if (startIP && endIP) {
                                    availableIPRanges.push({
                                        "startIP": startIP,
                                        "endIP": endIP
                                    });
                                    $scope.service.availableIPs.push({
                                        "startIP": startIP,
                                        "endIP": endIP
                                    });
                                }
                            }
                        }
                        $scope.createInfo.dvsIDs = dvsIdList;
                        $scope.service.dvsNames = dvsNameList;
                        $scope.createInfo.availableIPRanges = availableIPRanges;
                        $scope.createInfo.subnetIP = $("#" + $scope.resource.subnetIp.id).widget().getValue();
                        $scope.createInfo.subnetMask = $("#" + $scope.resource.subnetMask.id).widget().getValue();
                        $scope.createInfo.subnetGateWay = $("#" + $scope.resource.gateway.id).widget().getValue();
                        $scope.createInfo.vlan = $("#" + $scope.resource.vlan.id).widget().getValue();
                        $scope.showBasicInfoPage = false;
                        $scope.showResourcePage = false;
                        $scope.showConfirmInfoPage = true;
                        $("#" + $scope.addVtepNetworkStep.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "resourceCancelBtn",
                    "text": $scope.i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("resources.zoneResources.vsaNetwork.vtepNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                    }
                }
            }
            $scope.confirm = {
                preBtn: {
                    "id": "confirmPreBtn",
                    "text": $scope.i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $scope.showBasicInfoPage = false;
                        $scope.showResourcePage = true;
                        $scope.showConfirmInfoPage = false;
                        $("#" + $scope.addVtepNetworkStep.id).widget().pre();
                    }
                },
                createBtn: {
                    "id": "confirmCreateBtn",
                    "text": $scope.i18n.common_term_create_button || "创建",
                    "click": function () {
                        $scope.operate.create($scope.createInfo);
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("resources.zoneResources.vsaNetwork.vtepNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                    }
                }
            }
            $scope.operate = {
                //设置复选框选中状态
                setCheckbox: function (param) {
                    for (var index in $scope.resource.dvsTable.data) {
                        var id = "checkbox" + index;
                        $("#" + id).widget().option("checked", param);
                    }
                },

                //复选框是否全部选中
                isCheckboxAllChecked: function () {
                    for (var index in $scope.resource.dvsTable.data) {
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
                        if (!$scope.resource[id].display) {
                            $scope.resource[id].display = true;
                            return;
                        }
                    }

                },
                "deleteIpv4Ip": function (id) {
                    $scope.resource[id].display = false;
                },

                //复选框是否没有一个选中
                isCheckboxCheckedNone: function () {
                    for (var index in $scope.resource.dvsTable.data) {
                        var id = "checkbox" + index;
                        if ($("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                },

                //查询DVS
                queryDvs: function (params) {
                    var queryConfig = constants.rest.VTEP_DVS_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $stateParams.zoneId, "start": params.start, "limit": params.limit, "dvstype": params.dvstype, "hypervisortype": params.hypervisortype}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        for (var index1 in response.dvses) {
                            var clusterName = [];
                            for (var key in response.dvses[index1].clusterIDsMapNames) {
                                clusterName.push(response.dvses[index1].clusterIDsMapNames[key]);
                            }
                            response.dvses[index1].zone = clusterName.join(";");
                        }
                        $scope.$apply(function () {
                            $scope.resource.dvsTable.data = response.dvses;
                            $scope.resource.dvsTable.totalRecords = response.total;
                        });
                        //初始化表头的复选框
                        var options = {
                            "id": "tableCheckbox",
                            "checked": false,
                            "change": function () {
                                var isChecked = $("#" + options.id).widget().options.checked;
                                $scope.operate.setCheckbox(isChecked);
                                $("#" + $scope.resource.nextBtn.id).widget().option("disable", $scope.operate.isCheckboxCheckedNone());
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('#dvsTable th:eq(0)').html(checkbox.getDom());

                    });
                },
                "create": function (params) {
                    var createConfig = constants.rest.VTEP_CREATE;
                    var deferred = camel.post({
                        "url": createConfig.url,
                        "type": "POST",
                        "params": JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $state.go("resources.zoneResources.vsaNetwork.vtepNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
        }];

        return addVtepNetworkCtrl;
    })
;


