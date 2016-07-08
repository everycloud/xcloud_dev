/**
 * Created on 14-3-4.
 */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'app/services/validatorService',
        'tiny-directives/Step',
        'fixtures/appFixture'
    ],
    function ($, angular, validator) {
        "use strict";

        var createByCustomCtrl = ["$scope", "$compile",
            function ($scope, $compile) {
                var i18n = $("html").scope().i18n;
                $scope.service = {
                    "step": {
                        "id": "createByCustom-app-step",
                        "values": [i18n.common_term_basicInfo_label,i18n.vpc_term_checkAssociateVM_button, i18n.common_term_confirmInfo_label],
                        "width": 592,
                        "jumpable": false
                    },
                    "show": {
                        "baseInfo": true,
                        "associateVM": false,
                        "confirm": false
                    },
                    "isModify": false,
                    "label": i18n.app_term_customApp_label,
                    "modifyLabel": i18n.app_term_modifyAppCustom_button,
                    "nextLabelCreate": i18n.common_term_create_button,
                    "nextLabelMod": i18n.common_term_modify_button
                };

                // 事件定义
                $scope.events = {
                    "associateNext": "associateNext",
                    "associateNextFromParent": "associateNextFromParent"
                };

                $scope.params = {
                    "name": null,
                    "appTag": "",
                    "curLogo": "buff01.jpg",
                    "location": null,
                    "locationId": null,
                    "selVpcId": null,
                    "vmTableData": [],
                    "beforeModVmData": {},
                    "description": null,
                    "associateVms": null,
                    "fromFlag": 0,
                    "appId": null,
                    "cloudInfraId": null
                };

                $scope.$on($scope.events.associateNext, function (event, msg) {
                    $scope.$broadcast($scope.events.associateNextFromParent, msg);
                });
            }
        ];

        return createByCustomCtrl;
    }
);
