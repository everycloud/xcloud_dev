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
        var addVsaMgnNetworkCtrl = ["$scope", "$stateParams", "$rootScope", "camel", function ($scope, $stateParams, $rootScope, camel) {
            $scope.zoneInfo = {
                "id": "",
                "name": ""
            }
            $scope.action = "edit";
            //查询到的连接信息
            $scope.connectInfo = {};
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
                priority: "",
                vsaManageNetworkID: "",
                init: function (id) {
                    var queryConfig = constants.rest.VSA_MANAGER_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url + "/{id}", o: {"zoneid": $scope.zoneInfo.id, "id": id}},
                        "type": "GET",
                        "userId": $rootScope.user.id
                    })
                    deferred.done(function (response) {
                        $scope.connectInfo = response;
                        var dvses = response.dvses;
                        var dvsIds = [];
                        for (var index in dvses) {
                            dvsIds.push(dvses[index].id)
                        }
                        $scope.connectInfo.dvsIds = dvsIds;
                        // 触发事件
                        $scope.$emit($scope.modifyVsaMgnNetworkEvents.initComplete);
                    });
                }
            };
            //创建信息
            $scope.createInfo = {
                "name": "",
                "description": "",
                "availableIPRanges": [],
                "dvsIDs": [],
                "portSetting": {}
            };
            // 事件定义
            $scope.modifyVsaMgnNetworkEvents = {
                "initComplete": "initComplete",
                "setConnectInfo": "setConnectInfo"
            };

            // 事件转发
            $scope.$on($scope.modifyVsaMgnNetworkEvents.initComplete, function (event, msg) {
                $scope.$broadcast($scope.modifyVsaMgnNetworkEvents.setConnectInfo, msg);
            });

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

