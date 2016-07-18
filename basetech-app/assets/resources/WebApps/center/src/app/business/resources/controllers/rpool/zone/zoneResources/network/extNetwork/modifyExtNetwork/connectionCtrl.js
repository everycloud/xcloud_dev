/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'tiny-directives/RadioGroup',
    'app/business/resources/controllers/constants',
    'fixtures/zoneFixture'],
    function (angular, RadioGroup, constants, zoneFixture) {
        "use strict";

        var connectionInfoCtrl = ["$scope", "$state", "$stateParams", function ($scope, $state, $stateParams) {
            $scope.zoneInfo.id = $stateParams.zoneId;
            $scope.zoneInfo.name = $stateParams.zoneName;
            $scope.service.extnetworkId = $stateParams.id;
            $scope.service.init($scope.service.extnetworkId);
            $scope.connection = {
                "label": $scope.i18n.common_term_linkMode_label + ":" || "连接方式：",
                "require": "false",
                "id": "connectionRadio",
                "spacing": {"width": "50px", "height": "60px"},
                "values": [
                    [
                        {
                            "key": "2",
                            "text": $scope.i18n.resource_term_SubnetCommonVLAN_label + "<br>" + $scope.i18n.resource_exter_add_para_link_mean_commonVLAN_label,
                            "checked": true,
                            "disable": true
                        }
                    ],
                    [
                        {
                            "key": "3",
                            "text": $scope.i18n.resource_term_SubnetSuperVLAN_label + "<br>" + $scope.i18n.resource_exter_add_para_link_mean_superVLAN_label,
                            "checked": false,
                            "disable": true
                        }
                    ],
                    [
                        {
                            "key": "1",
                            "text": "VLAN <br>" + $scope.i18n.resource_exter_add_para_link_mean_VLAN_label,
                            "checked": false,
                            "disable": true
                        }
                    ]
                ],
                "layout": "vertical",
                "change": function () {
                    if ($("#" + $scope.connection.id).widget().opChecked("1")) {
                        $("#" + $scope.service.addExtNetworkStep.id).widget().option("values", [$scope.i18n.common_term_linkMode_label, $scope.i18n.common_term_basicInfo_label, "DVS", "VLAN", "QoS", $scope.i18n.common_term_confirmInfo_label]);
                        $scope.service.isVlanConnection = true;
                    }
                    else if ($("#" + $scope.connection.id).widget().opChecked("3")) {
                        $("#" + $scope.service.addExtNetworkStep.id).widget().option("values", [$scope.i18n.common_term_linkMode_label, $scope.i18n.common_term_basicInfo_label, "DVS", "VLAN", $scope.i18n.common_term_SubnetInfo_label, "QoS", $scope.i18n.common_term_confirmInfo_label]);
                        $scope.service.isVlanConnection = false;
                        $("#ipv4DistModeRadio").widget().opDisabled("1", true);
                    }
                    else {
                        $("#" + $scope.service.addExtNetworkStep.id).widget().option("values", [$scope.i18n.common_term_linkMode_label, $scope.i18n.common_term_basicInfo_label, "DVS", "VLAN", $scope.i18n.common_term_SubnetInfo_label, "QoS", $scope.i18n.common_term_confirmInfo_label]);
                        $scope.service.isVlanConnection = false;
                        $("#ipv4DistModeRadio").widget().opDisabled("1", false);
                    }
                }
            };

            $scope.internet = {
                "label": $scope.i18n.resource_exter_add_para_internet_label + ":" || "连接Internet:",
                "require": "false",
                "id": "internetRadio",
                "spacing": {"width": "50px", "height": "30px"},
                "values": [
                    [
                        {
                            "key": "0",
                            "text": $scope.i18n.common_term_yes_button + "&nbsp;&nbsp;&nbsp;" + $scope.i18n.resource_exter_add_para_internet_mean_label,
                            "checked": false
                        }
                    ],
                    [
                        {
                            "key": "1",
                            "text": $scope.i18n.common_term_no_label,
                            "checked": true
                        }
                    ]
                ],
                "layout": "vertical"

            };
            $scope.$on($scope.createExtNetworkEvents.setConnectInfo, function (event, msg) {
                $("#" + $scope.connection.id).widget().opChecked($scope.connectInfo.externalNetworkType.toString(), true)
                if ($("#" + $scope.connection.id).widget().opChecked("1")) {
                    $("#" + $scope.service.addExtNetworkStep.id).widget().option("values", [$scope.i18n.common_term_linkMode_label, $scope.i18n.common_term_basicInfo_label, "DVS", "VLAN", "QoS", $scope.i18n.common_term_confirmInfo_label]);
                    $scope.service.isVlanConnection = true;
                }
                else if ($("#" + $scope.connection.id).widget().opChecked("3")) {
                    $("#" + $scope.service.addExtNetworkStep.id).widget().option("values", [$scope.i18n.common_term_linkMode_label, $scope.i18n.common_term_basicInfo_label, "DVS", "VLAN", $scope.i18n.common_term_SubnetInfo_label, "QoS", $scope.i18n.common_term_confirmInfo_labe]);
                    $scope.service.isVlanConnection = false;
                    $("#ipv4DistModeRadio").widget().opDisabled("1", true);
                }
                else {
                    $("#" + $scope.service.addExtNetworkStep.id).widget().option("values", [$scope.i18n.common_term_linkMode_label, $scope.i18n.common_term_basicInfo_label, "DVS", "VLAN", $scope.i18n.common_term_SubnetInfo_label, "QoS", $scope.i18n.common_term_confirmInfo_label]);
                    $scope.service.isVlanConnection = false;
                    $("#ipv4DistModeRadio").widget().opDisabled("1", false);
                }
                if ($scope.connectInfo.connectToInternetFlag) {
                    $("#" + $scope.internet.id).widget().opChecked("0", true);
                }
                else {
                    $("#" + $scope.internet.id).widget().opChecked("1", true);
                }
                var dvsStr = [];
                for (var index in $scope.connectInfo.dvses) {
                    dvsStr.push($scope.connectInfo.dvses[index].dvsID)
                }
                $scope.connectInfo.dvsStr = dvsStr;
            });
            $scope.nextBtn = {
                "id": "nextBtn",
                "text": $scope.i18n.common_term_next_button || "下一步",
                "click": function () {
                    $scope.createInfo.externalNetworkType = $("#" + $scope.connection.id).widget().opChecked("checked");
                    if ("0" == $("#" + $scope.internet.id).widget().opChecked("checked")) {
                        $scope.createInfo.connectToInternetFlag = true;
                    }
                    else {
                        $scope.createInfo.connectToInternetFlag = false;
                    }
                    $scope.createInfo.zoneID = $stateParams.zoneId;
                    $("#" + $scope.service.addExtNetworkStep.id).widget().next();
                    $scope.service.showPage = "baseInfo";
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("resources.zoneResources.externalNetwork.extNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                }
            };
        }];

        return connectionInfoCtrl;
    })
;

