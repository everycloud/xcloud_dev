/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'app/business/resources/controllers/constants',
    "app/services/exceptionService"],
    function (angular, constants, ExceptionService) {
        "use strict";

        var confirmInfoCtrl = ["$scope", "$state", "camel", '$rootScope', function ($scope, $state, camel, $rootScope) {
                $scope.confirmInfo = {
                    "connectMode": ""
                }
                $scope.preBtn = {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $scope.service.showPage = "netExportLimit";
                        $("#" + $scope.service.addVsaMgnNetworkStep.id).widget().pre();
                    }
                };
                $scope.createBtn = {
                    "id": "createBtn",
                    "text": $scope.i18n.common_term_modify_button || "修改",
                    "click": function () {
                        $scope.operate.modify($scope.createInfo);
                    }
                };
                $scope.cancelBtn = {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("resources.zoneResources.vsaNetwork.vsaManagerNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                    }
                };
                $scope.operate = {
                    "modify": function (params) {
                        var modifyConfig = constants.rest.VSA_MANAGER_MODIFY;
                        var deferred = camel.put({
                            "url": {s: modifyConfig.url, o: {"id": $scope.service.vsaManageNetworkID}},
                            "type": "PUT",
                            "params": JSON.stringify(params),
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            $state.go("resources.zoneResources.vsaNetwork.vsaManagerNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                }
            }]
            ;

        return confirmInfoCtrl;
    })
;

