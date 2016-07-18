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

        var modifyExtNetworkCtrl = ["$scope", "$stateParams", "$rootScope", "camel", function ($scope, $stateParams, $rootScope, camel) {
                $scope.zoneInfo = {
                    "id": "",
                    "name": ""
                }
                $scope.action = "edit";

                //查询到的连接信息
                $scope.connectInfo = {};
                //创建信息
                $scope.createInfo = {
                    "zoneID": "",
                    "name": "",
                    "description": "",
                    "dvsIDs": [],
                    "vlans": [],
                    "protocolType": "",
                    "ipv4Subnet": {},
                    "ipv6Subnet": {},
                    "portSetting": {},
                    "connectToInternetFlag": false
                };
                $scope.service =
                {
                    extnetworkId: "",
                    showPage: "connection",
                    addExtNetworkStep: {
                        "id": "addExtNetworkStepId",
                        "jumpable": "false",
                        "values": [$scope.i18n.common_term_linkMode_label, $scope.i18n.common_term_basicInfo_label, "DVS", "VLAN", $scope.i18n.common_term_SubnetInfo_label, "QoS", $scope.i18n.common_term_confirmInfo_label],
                        "width": "800"
                    },
                    isVlanConnection: false,
                    dvsNames: "",
                    isIpv4: true,
                    ipv4DistMode: "ext",
                    isIpv6: false,
                    ipv6DistMode: "ext",
                    availableIPv4s: [],
                    availableIPv6s: [],
                    priority: "",
                    init: function (id) {
                        var queryConfig = constants.rest.EXTERNAL_NETWORK_DETAIL;
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.id, "id": id}},
                            "type": "GET",
                            "userId": $rootScope.user.id
                        })
                        deferred.done(function (response) {
                            $scope.connectInfo = response;
                            $scope.createInfo.name = $scope.connectInfo.name;
                            $scope.createInfo.description = $scope.connectInfo.description;
                            $scope.$digest();
                            // 触发事件
                            $scope.$emit($scope.createExtNetworkEvents.initComplete);
                        });
                    }

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
                    "initComplete": "initComplete",
                    "setConnectInfo": "setConnectInfo",
                    "baseInfoComplete": "baseInfoComplete",
                    "dvsInit": "dvsInit",
                    "dvsComplete": "dvsComplete",
                    "initExNetworkVlanPool": "initExNetworkVlanPool",
                    "vlanComplete": "vlanComplete",
                    "initSubnet": "initSubnet",
                    "subnetComplete": "",
                    "initQos": "initQos",
                    "qosComplete": "qosComplete",
                    "initConfirmInfo": "initConfirmInfo"
                };

                // 事件转发
                $scope.$on($scope.createExtNetworkEvents.initComplete, function (event, msg) {
                    $scope.$broadcast($scope.createExtNetworkEvents.setConnectInfo, msg);
                });

                $scope.$on($scope.createExtNetworkEvents.baseInfoComplete, function (event, msg) {
                    $scope.$broadcast($scope.createExtNetworkEvents.dvsInit, msg);
                });

                $scope.$on($scope.createExtNetworkEvents.dvsComplete, function (event, msg) {
                    $scope.$broadcast($scope.createExtNetworkEvents.initExNetworkVlanPool, msg);
                });

                $scope.$on($scope.createExtNetworkEvents.vlanComplete, function (event, msg) {
                    $scope.$broadcast($scope.createExtNetworkEvents.initSubnet, msg);
                });
                $scope.$on($scope.createExtNetworkEvents.subnetComplete, function (event, msg) {
                    $scope.$broadcast($scope.createExtNetworkEvents.initQos, msg);
                });
                $scope.$on($scope.createExtNetworkEvents.qosComplete, function (event, msg) {
                    $scope.$broadcast($scope.createExtNetworkEvents.initConfirmInfo, msg);
                });
            }
            ]
            ;

        return modifyExtNetworkCtrl;
    })
;
