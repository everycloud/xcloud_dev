/*global define*/
define(['jquery'], function ($) {
    "use strict";

    var confirmCtrl = ["$scope", "$window", "$state","$stateParams",
        function ($scope, $window, $state, $stateParams) {
            var i18n = $scope.i18n;
            $scope.name = {
                label: i18n.common_term_name_label + ":",
                require: false,
                "id": "confirmName"
            };

            $scope.logo = {
                "label": i18n.common_term_icon_label + ":",
                "require": false,
                "curLogo": "../theme/default/images/appLogo/buff1.jpg"
            };

            $scope.isoName = {
                label: i18n.common_term_templateFile_label + ":",
                require: false,
                "id": "confirmVersion"
            };

            $scope.description = {
                label: i18n.common_term_desc_label + ":",
                require: false,
                "id": "confirmDescription"
            };

            $scope.backBtn = {
                id: "confirmBackBtnID",
                disabled: false,
                iconsClass: "",
                text: i18n.common_term_back_button,
                tip: "",
                back: function () {
                    $scope.service.show = "baseInfo";
                    $("#" + $scope.service.step.id).widget().pre();
                }
            };

            $scope.nextBtn = {
                id: "confirmNextBtnID",
                disabled: false,
                iconsClass: "",
                text: i18n.common_term_confirm_label,
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
                text: i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go($stateParams.from || "application.manager.template");
                }
            };
        }
    ];

    return confirmCtrl;
});
