/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'tiny-common/UnifyValid',
    'app/business/resources/controllers/constants'],
    function (angular, UnifyValid, constants) {
        "use strict";

        var qosCtrl = ["$scope", "$state", function ($scope, $state) {
            $scope.sendSpeedLimit = {
                "label": $scope.i18n.common_term_sendSpeedLimitSet_label + ":" || "发送限速设置:",
                "id": "sendSpeedLimit",
                "require": "true",
                "spacing": {"width": "50px", "height": "20px"},
                "values": [
                    {
                        "key": "0",
                        "text": $scope.i18n.common_term_notLimit_value || "不限",
                        "checked": true
                    },
                    {
                        "key": "1",
                        "text": $scope.i18n.common_term_speedLimit_label || "限速",
                        "checked": false
                    }
                ],
                "change": function () {
                    if ("1" == $("#" + $scope.sendSpeedLimit.id).widget().opChecked("checked")) {
                        $("#" + $scope.priority.id).widget().opDisabled("2", false);
                        $("#" + $scope.priority.id).widget().opDisabled("4", false);
                        $("#" + $scope.priority.id).widget().opDisabled("7", false);
                        $scope.sendAvgBandwidth.disable = false;
                        $scope.sendPeakBandwidth.disable = false;
                        $scope.sendBurstSize.disable = false;
                    }
                    else {
                        $scope.sendAvgBandwidth.disable = true;
                        $scope.sendPeakBandwidth.disable = true;
                        $scope.sendBurstSize.disable = true;
                        $("#" + $scope.priority.id).widget().opDisabled("2", true);
                        $("#" + $scope.priority.id).widget().opDisabled("4", true);
                        $("#" + $scope.priority.id).widget().opDisabled("7", true);
                    }
                }
            };
            $scope.sendAvgBandwidth = {
                "label": $scope.i18n.perform_term_sendBandAvg_label + "(Mbit/s):" || "发送平均带宽(Mbit/s):",
                "id": "sendAvgBandwidth",
                "require": true,
                "disable": true,
                "width": "215px",
                "type": "input",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10000}) + ";maxValue(10000):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10000}),
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 10000})
            };
            UnifyValid.minSendValue = function () {
                var minValue = $('#' + $scope.sendAvgBandwidth.id).widget().getValue();
                var inputValue = $('#' + $scope.sendPeakBandwidth.id).widget().getValue();
                if (parseInt(minValue, 10) > parseInt(inputValue, 10)) {
                    return false;
                } else {
                    return true;
                }
            };
            $scope.sendPeakBandwidth = {
                "label": $scope.i18n.perform_term_sendBandPeak_label + "(Mbit/s):" || "发送峰值带宽(Mbit/s):",
                "id": "sendPeakBandwidth",
                "require": true,
                "disable": true,
                "width": "215px",
                "type": "input",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: $scope.i18n.perform_term_sendBandAvg_label, 2: 10000}),
                "tipPosition": "right",
                "extendFunction": ["minSendValue"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                    ";maxValue(10000):" + $scope.i18n.sprintf($scope.i18n.common_term_smaller_valid, {1: 10000}) +
                    ";minSendValue:" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: $scope.i18n.perform_term_sendBandAvg_label, 2: 10000})
            };
            $scope.sendBurstSize = {
                "label": $scope.i18n.common_term_sendGusty_label + "(Mbit/s):" || "发送突发大小(Mbit/s):",
                "id": "sendBurstSize",
                "require": true,
                "disable": true,
                "width": "215px",
                "type": "input",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 10000}),
                "tipPosition": "right",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10000}) + ";maxValue(10000):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10000})
            };
            $scope.priority = {
                "label": $scope.i18n.common_term_priority_label + ":" || "优先级:",
                "id": "priority",
                "disable": true,
                "require": true,
                "spacing": {"width": "50px", "height": "20px"},
                "values": [
                    {
                        "key": "7",
                        "text": $scope.i18n.common_term_low_label || "低",
                        "checked": true,
                        "disable": true},
                    {
                        "key": "4",
                        "text": $scope.i18n.common_term_middling_label || "中",
                        "checked": false,
                        "disable": true
                    },
                    {
                        "key": "2",
                        "text": $scope.i18n.common_term_high_label || "高",
                        "checked": false,
                        "disable": true
                    }
                ]
            };
            $scope.receiveSpeedLimit = {
                "label": $scope.i18n.common_term_receiveSpeedLimitSet_button + ":" || "接收限速设置:",
                "id": "receiveSpeedLimit",
                "require": "true",
                "spacing": {"width": "50px", "height": "20px"},
                "values": [
                    {
                        "key": "0",
                        "text": $scope.i18n.common_term_notLimit_value || "不限",
                        "checked": true
                    },
                    {
                        "key": "1",
                        "text": $scope.i18n.common_term_speedLimit_label || "限速",
                        "checked": false
                    }
                ],
                "change": function () {
                    if ("1" == $("#" + $scope.receiveSpeedLimit.id).widget().opChecked("checked")) {
                        $scope.receiveAvgBandwidth.disable = false;
                        $scope.receivePeakBandwidth.disable = false;
                        $scope.receiveBurstSize.disable = false;
                    }
                    else {
                        $scope.receiveAvgBandwidth.disable = true;
                        $scope.receivePeakBandwidth.disable = true;
                        $scope.receiveBurstSize.disable = true;
                    }
                }
            };
            $scope.receiveAvgBandwidth = {
                "label": $scope.i18n.perform_term_receiveBandAvg_label + "(Mbit/s)" || "接收平均带宽(Mbit/s):",
                "id": "receiveAvgBandwidth",
                "require": true,
                "disable": true,
                "width": "215px",
                "type": "input",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 10000}),
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10000}) + ";maxValue(10000):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10000})
            };
            UnifyValid.minReceiveValue = function () {
                var minValue = $('#' + $scope.receiveAvgBandwidth.id).widget().getValue();
                var inputValue = $('#' + $scope.receivePeakBandwidth.id).widget().getValue();
                if (parseInt(minValue, 10) > parseInt(inputValue, 10)) {
                    return false;
                } else {
                    return true;
                }
            };
            $scope.receivePeakBandwidth = {
                "label": $scope.i18n.perform_term_receiveBandPeak_label + "(Mbit/s):" || "接收峰值带宽(Mbit/s):",
                "id": "receivePeakBandwidth",
                "require": true,
                "disable": true,
                "width": "215px",
                "type": "input",
                "extendFunction": ["minReceiveValue"],
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: $scope.i18n.perform_term_receiveBandAvg_label, 2: 10000}),
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                    ";maxValue(10000):" + $scope.i18n.sprintf($scope.i18n.common_term_smaller_valid, {1: 10000}) +
                    ";minReceiveValue:" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: $scope.i18n.perform_term_receiveBandAvg_label, 2: 10000})
            };
            $scope.receiveBurstSize = {
                "label": $scope.i18n.common_term_receiveGusty_label + "(Mbit/s):" || "接收突发大小(Mbit/s):",
                "id": "receiveBurstSize",
                "require": true,
                "disable": true,
                "width": "215px",
                "type": "input",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 10000}),
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10000}) + ";maxValue(10000):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10000})
            };

            $scope.arpMsgSuppressionCheckbox = {
                "text": $scope.i18n.common_term_ARPsuppression_label || "ARP报文抑制",
                "id": "arpMsgCheckbox",
                "require": true,
                "checked": "false",
                "height": "28px",
                "change": function () {
                    if ($("#" + $scope.arpMsgSuppressionCheckbox.id).widget().option("checked")) {
                        $scope.arpMsgSuppressionTextbox.disable = false;
                    }
                    else {
                        $scope.arpMsgSuppressionTextbox.disable = true;
                    }

                }
            };
            $scope.arpMsgSuppressionTextbox = {
                "label": $scope.i18n.common_term_ARPsuppression_label + "(Kbit/s):" || "ARP报文抑制(Kbit/s):",
                "id": "arpMsgTextbox",
                "require": true,
                "disable": true,
                "width": "215px",
                "type": "input",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 1024}),
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 1024}) + ";maxValue(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 1024})
            };

            $scope.ipMsgSuppressionCheckbox = {
                "text": $scope.i18n.common_term_IPsuppression_label || "IP报文抑制",
                "id": "ipMsgCheckbox",
                "require": true,
                "checked": "false",
                "height": "28px",
                "change": function () {
                    if ($("#" + $scope.ipMsgSuppressionCheckbox.id).widget().option("checked")) {
                        $scope.ipMsgSuppressionTextbox.disable = false;
                    }
                    else {
                        $scope.ipMsgSuppressionTextbox.disable = true;
                    }

                }
            };
            $scope.ipMsgSuppressionTextbox = {
                "label": $scope.i18n.common_term_IPsuppression_label + "(Kbit/s):" || "IP报文抑制(Kbit/s):",
                "id": "ipMsgTextbox",
                "require": true,
                "disable": true,
                "width": "215px",
                "type": "input",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 5, 2: 1024}),
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(5):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 5, 2: 1024}) + ";maxValue(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 5, 2: 1024})
            }

            $scope.dhcpIsolationCheckbox = {
                "text": $scope.i18n.vpc_term_DHCPisolation_label || "DHCP隔离",
                "id": "dhcpIsolationCheckbox",
                "require": true,
                "checked": "false",
                "height": "0px"
            };

            $scope.ipMacBindingCheckbox = {
                "text": $scope.i18n.common_term_IPbondMAC_label || "IP和MAC绑定",
                "id": "ipMacBindingCheckbox",
                "require": true,
                "checked": "false",
                "height": "0px"
            }

            $scope.preBtn = {
                "id": "qosPreBtn",
                "text": $scope.i18n.common_term_back_button || "上一步",
                "click": function () {
                    if ($scope.service.isVlanConnection) {
                        $scope.service.showPage = "vlan";
                    }
                    else {
                        $scope.service.showPage = "subnet";
                    }

                    $("#" + $scope.service.addExtNetworkStep.id).widget().pre();
                }
            };

            $scope.nextBtn = {
                "id": "qosNextBtn",
                "text": $scope.i18n.common_term_next_button || "下一步",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#qosDiv"));
                    if (!valid) {
                        return;
                    }
                    if ("1" == $("#" + $scope.sendSpeedLimit.id).widget().opChecked("checked")) {
                        $scope.createInfo.portSetting.outTrafficShapingPolicyFlag = true;
                        var TxTrafficShapingPolicy = {};
                        TxTrafficShapingPolicy.averageBandwidth = $("#" + $scope.sendAvgBandwidth.id).widget().getValue();
                        TxTrafficShapingPolicy.peakBandwidth = $("#" + $scope.sendPeakBandwidth.id).widget().getValue();
                        TxTrafficShapingPolicy.burstSize = $("#" + $scope.sendBurstSize.id).widget().getValue();
                        TxTrafficShapingPolicy.priority = $("#" + $scope.priority.id).widget().opChecked("checked");
                        $scope.createInfo.portSetting.outTrafficShapingPolicy = TxTrafficShapingPolicy;
                        $scope.service.priority = $("#" + $scope.priority.id).widget().opValue(TxTrafficShapingPolicy.priority);
                    }
                    else {
                        $scope.createInfo.portSetting.outTrafficShapingPolicyFlag = false;
                    }
                    if ("1" == $("#" + $scope.receiveSpeedLimit.id).widget().opChecked("checked")) {
                        $scope.createInfo.portSetting.inTrafficShapingPolicyFlag = true;
                        var TrafficShapingPolicy = {};
                        TrafficShapingPolicy.averageBandwidth = $("#" + $scope.receiveAvgBandwidth.id).widget().getValue();
                        TrafficShapingPolicy.peakBandwidth = $("#" + $scope.receivePeakBandwidth.id).widget().getValue();
                        TrafficShapingPolicy.burstSize = $("#" + $scope.receiveBurstSize.id).widget().getValue();
                        $scope.createInfo.portSetting.inTrafficShapingPolicy = TrafficShapingPolicy;
                    }
                    else {
                        $scope.createInfo.portSetting.inTrafficShapingPolicyFlag = false;
                    }
                    var isArpPacketSuppression = $scope.string2Boolean($("#" + $scope.arpMsgSuppressionCheckbox.id).widget().option("checked"));
                    if (isArpPacketSuppression) {
                        $scope.createInfo.portSetting.arpPacketSuppression = $("#" + $scope.arpMsgSuppressionTextbox.id).widget().getValue();
                    }
                    else {
                        $scope.createInfo.portSetting.arpPacketSuppression = 0;
                    }
                    var isIpPacketSuppression = $scope.string2Boolean($("#" + $scope.ipMsgSuppressionCheckbox.id).widget().option("checked"));
                    if (isIpPacketSuppression) {
                        $scope.createInfo.portSetting.ipPacketSuppression = $("#" + $scope.ipMsgSuppressionTextbox.id).widget().getValue();
                    }
                    else {
                        $scope.createInfo.portSetting.ipPacketSuppression = 0;
                    }
                    $scope.createInfo.portSetting.dhcpIsolationFlag = $scope.string2Boolean($("#" + $scope.dhcpIsolationCheckbox.id).widget().option("checked"));
                    $scope.createInfo.portSetting.ipMacBindFlag = $scope.string2Boolean($("#" + $scope.ipMacBindingCheckbox.id).widget().option("checked"));
                    $scope.service.showPage = "confirmInfo";
                    $("#" + $scope.service.addExtNetworkStep.id).widget().next();
                    // 触发事件
                    $scope.$emit($scope.createExtNetworkEvents.qosComplete);
                }
            };
            $scope.cancelBtn = {
                "id": "qosCancelBtn",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("resources.zoneResources.externalNetwork.extNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                }
            };
        }];

        return qosCtrl;
    });
