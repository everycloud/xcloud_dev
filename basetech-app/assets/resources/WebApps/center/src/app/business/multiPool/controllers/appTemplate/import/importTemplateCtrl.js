define(["jquery",
    "tiny-lib/angular",
    "app/business/resources/controllers/constants",
    'upload/FileUpload',
    'tiny-widgets/Message'],
    function ($, angular, constants, FileUpload, Message) {
        "use strict";

        var importAppTemplateCtrl = ["$scope", "$compile", "$state", "camel", "$interval", "$timeout", "exception", function ($scope, $compile, $state, camel, $interval, $timeout, exception) {
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
                "confirmedFromParent":"confirmedFromParent",
                "confirmed":"confirmed"
            };

            // 事件转发
            $scope.$on($scope.importTemplEvent.confirmed, function (event, msg) {
                $scope.$broadcast($scope.importTemplEvent.confirmedFromParent, msg);
            });
        }];

        return importAppTemplateCtrl;
    });
