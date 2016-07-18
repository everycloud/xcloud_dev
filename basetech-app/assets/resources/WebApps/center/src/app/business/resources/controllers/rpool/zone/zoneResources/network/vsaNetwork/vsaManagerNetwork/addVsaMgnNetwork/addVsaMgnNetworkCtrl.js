/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-18

 */
define(["tiny-lib/angular",
    'app/business/resources/controllers/constants'],
    function (angular, constants) {
        "use strict";
        var addVsaMgnNetworkCtrl = ["$scope", "$stateParams", "$rootScope", function ($scope, $stateParams, $rootScope) {
            $scope.zoneInfo = {
                "id": "",
                "name": ""
            }
            $scope.action = "add";
            $scope.service =
            {
                showPage: "baseInfo",
                addVsaMgnNetworkStep: {
                    "id": "addVsaMgnNetworkStepId",
                    "jumpable": "false",
                    "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.resource_term_chooseResource_label, $scope.i18n.common_term_NICspeedLimit_label, $scope.i18n.common_term_confirmInfo_label],
                    "width": "800"
                },
                dvsNames: "",
                availableIPs: [],
                priority: ""
            };
            //创建信息
            $scope.createInfo = {
                "zoneID": "",
                "name": "",
                "description": "",
                "subnetIP": "",
                "subnetMask": "",
                "subnetGateWay": "",
                "vlan": 0,
                "availableIPRanges": [],
                "dvsIDs": [],
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

        }];

        return addVsaMgnNetworkCtrl;
    });

