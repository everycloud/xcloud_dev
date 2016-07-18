/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'app/business/resources/controllers/constants'],
    function (angular, constants) {
        "use strict";

        var addExtNetworkCtrl = ["$scope", "$stateParams", "$rootScope", function ($scope, $stateParams, $rootScope) {
            $scope.zoneInfo = {
                "id": "",
                "name": ""
            }
            $scope.action = "add";
            $scope.service =
            {
                showPage: "connection",
                addExtNetworkStep: {
                    "id": "addExtNetworkStepId",
                    "jumpable": "false",
                    "values": [$scope.i18n.common_term_linkMode_label, $scope.i18n.common_term_basicInfo_label, "DVS", "VLAN", $scope.i18n.common_term_SubnetInfo_label, "QoS", $scope.i18n.common_term_confirmInfo_label],
                    "width": "800"
                },
                isVlanConnection: false,
                dvsNames: "",
                vlans: "",
                isIpv4: true,
                ipv4DistMode: "ext",
                isIpv6: false,
                ipv6DistMode: "ext",
                availableIPv4s: "",
                availableIPv6s: "",
                priority: ""

            };
            //创建信息
            $scope.createInfo = {
                "zoneID": "",
                "name": "",
                "description": "",
                "externalNetworkType": 3,
                "dvsIDs": [],
                "vlans": [],
                "protocolType": "",
                "ipv4Subnet": {},
                "ipv6Subnet": {},
                "portSetting": {}
            };
            $scope.string2Boolean = function (str) {
                if ("true" == str) {
                    return true;
                }
                else if ("false" == str) {
                    return false;
                }
                else {
                    return Boolean(str);
                }
            };
            // 事件定义
            $scope.createExtNetworkEvents = {
                "baseInfoComplete": "baseInfoComplete",
                "dvsInit": "dvsInit",
                "dvsComplete": "dvsComplete",
                "initExNetworkVlanPool": "initExNetworkVlanPool",
                "vlanComplete": "vlanComplete",
                "initSubnet": "initSubnet",
                "qosComplete": "qosComplete",
                "initConfirmInfo": "initConfirmInfo"
            };

            // 事件转发
            $scope.$on($scope.createExtNetworkEvents.baseInfoComplete, function (event, msg) {
                $scope.$broadcast($scope.createExtNetworkEvents.dvsInit, msg);
            });

            $scope.$on($scope.createExtNetworkEvents.dvsComplete, function (event, msg) {
                $scope.$broadcast($scope.createExtNetworkEvents.initExNetworkVlanPool, msg);
            });

            $scope.$on($scope.createExtNetworkEvents.vlanComplete, function (event, msg) {
                $scope.$broadcast($scope.createExtNetworkEvents.initSubnet, msg);
            });

            $scope.$on($scope.createExtNetworkEvents.qosComplete, function (event, msg) {
                $scope.$broadcast($scope.createExtNetworkEvents.initConfirmInfo, msg);
            });
        }];

        return addExtNetworkCtrl;
    });
