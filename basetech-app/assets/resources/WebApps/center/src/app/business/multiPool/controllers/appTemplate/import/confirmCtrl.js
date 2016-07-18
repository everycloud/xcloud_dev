define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid'],
    function ($, angular, UnifyValid) {
        "use strict";

        var confirmCtrl = ["$scope", "$window","$state",
            function ($scope, $window, $state) {

            $scope.name = {
                label: $scope.i18n.common_term_name_label + ":",
                require: false,
                "id": "confirmName"
            };

            $scope.logo = {
                "label": $scope.i18n.common_term_icon_label + ":",
                "require": false,
                "curLogo": "../theme/default/images/appLogo/buff1.jpg"
            };

            $scope.isoName = {
                label: $scope.i18n.common_term_templateFile_label+":",
                require: false,
                "id": "confirmVersion"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label + ":",
                require: false,
                "id": "confirmDescription"
            };

            $scope.backBtn = {
                id: "confirmBackBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_back_button || "上一步",
                tip: "",
                back: function () {
                    $scope.service.show = "baseInfo";
                    $("#"+$scope.service.step.id).widget().pre();
                }
            };

            $scope.nextBtn = {
                id: "confirmNextBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button || "下一步",
                tip: "",
                next: function () {
                    // 触发事件
                    $scope.$emit($scope.importTemplEvent.confirmed, $scope.service.model);
                }
            };

            $scope.cancelBtn = {
                id: "confirmCancelBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button || "取消",
                tip: "",
                cancel: function () {
                    $state.go("serviceMgr.appTemplate",{});
                }
            };
        }];

        return confirmCtrl;
    });
