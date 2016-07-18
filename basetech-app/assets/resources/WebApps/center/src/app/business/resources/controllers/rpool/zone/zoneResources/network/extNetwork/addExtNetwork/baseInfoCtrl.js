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

        var baseInfoCtrl = ["$scope", "$state", "$stateParams", "validator", function ($scope, $state, $stateParams, validator) {
            $scope.check = false;
            $scope.name = {
                "label": $scope.i18n.common_term_name_label + ":" || "名称:",
                "require": "true",
                "width": "225px",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}) + " " + $scope.i18n.common_term_composition2_valid
            };
            $scope.description = {
                "label": $scope.i18n.common_term_desc_label || "描述:",
                "width": "300px",
                "require": "false",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
            };
            $scope.preBtn = {
                "id": "preBtn",
                "text": $scope.i18n.common_term_back_button || "上一步",
                "click": function () {
                    $scope.$apply(function () {
                        $scope.service.showPage = "connection";
                    });
                    $("#" + $scope.service.addExtNetworkStep.id).widget().pre();
                }
            };
            $scope.nextBtn = {
                "id": "nextBtn",
                "text": $scope.i18n.common_term_next_button || "下一步",
                "click": function () {
                    if (!$scope.check) {
                        return;
                    }
                    $scope.service.showPage = "dvs";
                    $("#" + $scope.service.addExtNetworkStep.id).widget().next();
                    // 触发事件
                    $scope.$emit($scope.createExtNetworkEvents.baseInfoComplete);
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("resources.zoneResources.externalNetwork.extNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                }
            }

        }];

        return baseInfoCtrl;
    });


