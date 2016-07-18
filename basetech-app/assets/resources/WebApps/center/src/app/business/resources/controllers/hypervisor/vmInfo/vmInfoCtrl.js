/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular,Layout) {
    "use strict";

    var vmInfoCtrl = ["$scope","$stateParams","$state", "$compile", "camel", function ($scope,$stateParams, $state, $compile, camel) {
        var user = $("html").scope().user;
        $scope.deployMode = $("html").scope().deployMode;
        $scope.privilege = user.privilege;
        $scope.vmName = $stateParams.name;
        //如果是模板虚拟机，将手风琴隐藏
        $scope.isTemplate = $stateParams.isTemplate;
        var lay = new Layout({
            "id": "vmInfoLayoutDiv",
            "subheight": 140
        });
        $("#vmInfoNameDiv").attr("title",$.encoder.encodeForHTML($stateParams.name));

        $scope.$on("$stateChangeSuccess", function () {
            if($state.includes('resources.vmInfo.hardware')) {
                lay.opActive($(".tiny-layout-west a[ui-sref='resources.vmInfo.hardware.cpu']").last());
            }
            else {
                lay.opActive($(".tiny-layout-west a[ui-sref='" + $state.$current.name + "']").last());
            }
        });
    }];
    return vmInfoCtrl;
});
