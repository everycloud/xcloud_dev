/* global define */
define(["sprintf",
        "language/keyID",
        "tiny-lib/jquery",
        'tiny-lib/angular',
        'app/business/ssp/controllers/plugin/common/create/choiseCatalogCtrl',
        'app/business/ssp/controllers/plugin/common/create/createCatalogBasicCtrl',
        "app/services/httpService",
        'app/services/exceptionService',
        "app/business/ssp/controllers/plugin/common/create/createCatalogService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-widgets/Window",
        "tiny-directives/Step",
        "tiny-directives/Table",
        "tiny-directives/RadioGroup",
        "tiny-directives/Select",
        "tiny-directives/Radio",
        "tiny-directives/IP"
    ],
    function (sprintf, keyIDI18n, $, angular, choiseCtrl, basicCtrl, http, exception, monkey) {
        "use strict";
        var createCatalogNewCtrl = ["$rootScope", "monkey", "$scope", "exception",
            function ($rootScope, monkey, $scope, exception) {
                var $state = $("html").injector().get("$state");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                $rootScope.monkey = monkey;

                //公共数据
                $scope.params = {
                    "selectedTemplate": null
                };
            }
        ];
        var summary = function () {
            return {
                templateUrl: 'app/business/ssp/views/plugin/common/create/createCatalogNew.html',
                restrict: "EA",
                scope: false,
                controller: createCatalogNewCtrl
            };
        };

        var createCatalog = angular.module("createCatalogNew", ["ng", "wcc"]);
        createCatalog.controller("choiseCtrl", choiseCtrl);
        createCatalog.controller("basicCtrl", basicCtrl);
        createCatalog.directive("myContainer", summary);
        createCatalog.service("camel", http);
        createCatalog.service("monkey", monkey);
        createCatalog.service("exception", exception);
        return createCatalog;
    });
