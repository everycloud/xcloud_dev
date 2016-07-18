/*global define*/
define([], function () {
    "use strict";
    var ctrl = ["$scope",
        function ($scope) {
            $scope.vpcNetwork = "VPC" + ($scope.urlParams.lang === "en" ? " " : "") + $scope.i18n.vpc_term_net_label;
        }
    ];
    return ctrl;
});
