/**
 * Created on 14-2-26.
 */
define([
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-widgets/Window",
    "app/business/application/controllers/constants",
    "fixtures/appFixture"
], function ($, angular, Window, constants) {
    "use strict";
    var createAppCtrl = ["$scope", "$window","$compile", "$state", "$stateParams", "camel",
        function ($scope, $window, $compile, $state, $stateParams, camel) {
            var FROM_APP_LIST = 1;
            var FROM_TEMPLATE_LIST = 2;
            var i18n = $scope.i18n;
            $scope.templateId = $stateParams.templateId;
            $scope.appCreateType = {
                "id1": "createAppCreateType1Id",
                "id2": "createAppCreateType2Id",
                "text1": i18n.app_app_create_para_mode_option_template_label,
                "text2": i18n.app_term_customApp_label,
                "name1": "myName1",
                "name2": "myName2",
                "checked1": true,
                "checked2": false,
                "disabled1": false,
                "disabled2": false,
                "width": "60px",
                "height": "20px",
                "iconUrl": "radioNotUrl",
                "createByTemplate": true,
                "change1": function () {
                    $scope.appCreateType.checked1 = true;
                    $scope.appCreateType.checked2 = false;
                },
                "change2": function () {
                    $scope.appCreateType.checked1 = false;
                    $scope.appCreateType.checked2 = true;
                }
            };

            $scope.createBtn = {
                "id": "app_instance_createApp_createId",
                "text": i18n.common_term_startCreate_label,
                "click": function () {
                    if ($scope.appCreateType && $scope.appCreateType.checked1) {
                        $state.go("appCreateByTemplate.navigate", {
                            "templateId": null,
                            "fromFlag": constants.fromFlag.FROM_APP_LIST
                        });
                    } else {
                        $state.go("appCreateByCustom.navigate", {
                            "templateId": null,
                            "fromFlag": constants.fromFlag.FROM_APP_LIST
                        });
                    }
                },
                "tooltip": "",
                "disable": false
            };

            $scope.cancelBtn = {
                "id": "app_instance_createApp_cancelId",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    setTimeout(function () {
                        $window.history.back();
                    }, 0);
                },
                "tooltip": "",
                "disable": false
            };
        }
    ];

    return createAppCtrl;
});
