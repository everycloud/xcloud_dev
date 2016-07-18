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
            $scope.zoneInfo.id = $stateParams.zoneId;
            $scope.zoneInfo.name = $stateParams.zoneName;
            $scope.createInfo.zoneID = $stateParams.zoneId;
            $scope.name = {
                "id": "nameText",
                "label": $scope.i18n.common_term_name_label + ":" || "名称:",
                "require": "true",
                "width": "215px",
                "value": "",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.name + "):" +
                    $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}) + " " + $scope.i18n.common_term_composition2_valid
            };
            $scope.description = {
                "id": "descriptionText",
                "label": $scope.i18n.common_term_desc_label || "描述:",
                "type": "multi",
                "width": "215px",
                "height": "40px",
                "require": "false",
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
            };
            $scope.nextBtn = {
                "id": "nextBtn",
                "text": $scope.i18n.common_term_next_button || "下一步",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#baseInfoDiv"));
                    if (!valid) {
                        return;
                    }
                    $scope.createInfo.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.createInfo.description = $("#" + $scope.description.id).widget().getValue();
                    $scope.service.showPage = "resourceChoice";
                    $("#" + $scope.service.addVsaMgnNetworkStep.id).widget().next();
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("resources.zoneResources.vsaNetwork.vsaManagerNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                }
            }

        }];

        return baseInfoCtrl;
    })
;


