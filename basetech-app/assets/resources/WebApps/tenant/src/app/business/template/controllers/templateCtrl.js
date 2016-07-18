/* global define */
define([
        'tiny-lib/jquery',
        "tiny-lib/angular",
        "tiny-widgets/Layout"
    ],
    function ($, angular, layout) {
        "use strict";

        var templateCtrl = ["$scope", "$state",
            function ($scope, $state) {
                var user = $("html").scope().user;
                $scope.openstack = (user.cloudType === "ICT" ? true : false);
                var i18n = $scope.i18n;
                var lay = new layout({
                    "id": "templateLayout",
                    "subheight": 108
                });
                $scope.$on("$stateChangeSuccess", function () {
                    lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
                });
            }
        ];

        var dependency = [];
        /**
         * 定义user moddule， 这里需要设置命令空间，防止重复
         * @type {module}
         */
        var templateModule = angular.module("template", dependency);

        templateModule.controller("template.ctrl", templateCtrl);
        return templateModule;
    });
