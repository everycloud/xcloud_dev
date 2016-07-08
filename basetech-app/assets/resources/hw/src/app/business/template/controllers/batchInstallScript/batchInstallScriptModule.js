/* global define */
define([
        'sprintf',
        'tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        "ui-router/angular-ui-router",
        "app/framework/directive/directiveFM",
        'app/business/template/controllers/batchInstallScript/batchInstall/basicCtrl',
        'app/business/template/controllers/batchInstallScript/batchInstall/addVMCtrl',
        'app/business/template/controllers/batchInstallScript/batchInstall/confirmCtrl',
        "app/services/httpService",
        "app/business/template/services/batchInstallScriptService",
        "tiny-directives/Textbox",
        "tiny-directives/Step",
        "tiny-directives/Button",
        "tiny-widgets/Window",
        "tiny-directives/Step",
        "tiny-directives/Table",
        "tiny-directives/RadioGroup",
        "tiny-directives/Select"
    ],
    function (sprintf, $, angular,ngSanitize, keyIDI18n, router,fm, basicCtrl, addVMCtrl, confirmCtrl, http, monkey) {
        "use strict";

        var ctrl = ["$rootScope", "monkey", "$scope", "$compile", '$stateParams', "camel", "$interval", "$timeout",
            function ($rootScope, monkey, $scope, $compile, $stateParams, camel, $interval, $timeout) {

                $rootScope.monkey = monkey;
                var $state = $("html").injector().get("$state");
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $rootScope.cloudInfraId = $stateParams.cloudInfraId;
                $rootScope.id = $stateParams.id;
                $rootScope.param = {
                    "vmIds": "",
                    "name": $stateParams.name,
                    "osType": $stateParams.osType,
                    "description": $stateParams.description,
                    "version": $stateParams.version,
                    "installCommand": $stateParams.installCommand
                };

                $rootScope.installParameters = $stateParams.installCommand,
                $rootScope.installCommand = $stateParams.installCommand;
                $rootScope.vms = [];
                $rootScope.close = function () {
                    $state.go("ecs.commonScriptList");
                };
                $rootScope.step = {
                    "id": "create-package-step",
                    "values": [i18n.common_term_basicInfo_label, i18n.template_term_addVM_button, i18n.common_term_confirmInfo_label],
                    "width": 592,
                    "jumpable": false
                };
            }
        ];

        var summary = function () {
            return {
                templateUrl: 'app/business/template/views/batchInstallScript/batchInstall/batchInstallScriptContainer.html',
                restrict: "EA",
                scope: false,
                controller: ctrl
            };
        };

        var dependency = [
            "ng",
            "wcc",
            "ngSanitize",
            "ui.router",
            fm.name
        ];
        var batchInstallPackage = angular.module("batchInstallPackage", dependency);
        batchInstallPackage.controller("basicCtrl", basicCtrl);
        batchInstallPackage.controller("addVMCtrl", addVMCtrl);
        batchInstallPackage.controller("confirmCtrl", confirmCtrl);
        batchInstallPackage.directive("myContainer", summary);
        batchInstallPackage.service("camel", http);
        batchInstallPackage.service("monkey", monkey);
        batchInstallPackage.service("fm", fm);
        return batchInstallPackage;
    });
