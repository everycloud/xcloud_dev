/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'app/business/resources/controllers/constants',
    "app/services/messageService",
    "app/services/exceptionService"],
    function (angular, constants, MessageService, ExceptionService) {
        "use strict";

        var confirmInfoCtrl = ["$scope", "$state", "camel", '$rootScope', function ($scope, $state, camel, $rootScope) {
            $scope.confirmInfo = {
                "connectMode": "",
                "ipv4Ranges": "",
                "ipv6Ranges": ""
            };
            $scope.preBtn = {
                "id": "preBtn",
                "text": $scope.i18n.common_term_back_button || "上一步",
                "click": function () {
                    $scope.service.showPage = "qos";
                    $("#" + $scope.service.addExtNetworkStep.id).widget().pre();
                }
            };
            $scope.createBtn = {
                "id": "createBtn",
                "text": $scope.i18n.common_term_create_button || "创建",
                "click": function () {
                    $scope.operate.create($scope.createInfo);
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("resources.zoneResources.externalNetwork.extNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                }
            };
            $scope.operate = {
                "create": function (params) {
                    var createConfig = constants.rest.EXTERNAL_NETWORK_CREATE;
                    var deferred = camel.post({
                        "url": createConfig.url,
                        "type": "POST",
                        "params": JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $state.go("resources.zoneResources.externalNetwork.extNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            // 事件处理
            $scope.$on($scope.createExtNetworkEvents.initConfirmInfo, function (event, msg) {
                var externalNetworkType = constants.config.EXERNAL_NETWORK_TYPE_STR[$scope.createInfo.externalNetworkType]
                $scope.confirmInfo.connectMode = $scope.i18n[externalNetworkType] || externalNetworkType;
                $scope.confirmInfo.ipv4Ranges = $scope.service.availableIPv4s;
                $scope.confirmInfo.ipv6Ranges = $scope.service.availableIPv6s;

            });
        }];

        return confirmInfoCtrl;
    });

