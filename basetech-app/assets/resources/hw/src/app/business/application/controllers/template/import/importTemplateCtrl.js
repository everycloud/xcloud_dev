/*global define*/
define(["jquery",
    "tiny-lib/angular",
    "app/business/application/controllers/constants",
    'app/business/application/services/appCommonService',
    'app/services/userService',
    'upload/FileUpload',
    'tiny-widgets/Message'
],
    function ($, angular, constants, appCommonService, UserService, FileUpload, Message) {
        "use strict";

        var importAppTemplateCtrl = ["$scope", "$compile", "$state", "camel", "$interval", "$timeout", "exception", "$q",
            function ($scope, $compile, $state, camel, $interval, $timeout, exception, $q) {
                var i18n = $scope.i18n;
                $scope.service = {
                    step: {
                        "id": "importAppTemplateStep",
                        "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_confirmInfo_label],
                        "width": 450,
                        "jumpable": false
                    },

                    show: "baseInfo",

                    model: {
                        "name": "",
                        "templateName": "",
                        "curLogo": "buff01.jpg",
                        "description": ""
                    }
                };

                $scope.buttonGroup = {
                    label: "",
                    require: false
                };

                /**
                 * 事件定义
                 * @type {{confirmedFromParent: string, confirmed: string}}
                 */
                $scope.importTemplEvent = {
                    "confirmedFromParent": "confirmedFromParent",
                    "confirmed": "confirmed"
                };

                // 事件转发
                $scope.$on($scope.importTemplEvent.confirmed, function (event, msg) {
                    $scope.$broadcast($scope.importTemplEvent.confirmedFromParent, msg);
                });
            }
        ];

        return importAppTemplateCtrl;
    });
