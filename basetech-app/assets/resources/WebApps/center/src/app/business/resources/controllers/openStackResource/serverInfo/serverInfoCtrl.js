/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/competitionConfig",
    "tiny-widgets/Layout"
], function ($, angular,Competition,Layout) {
    "use strict";

    var serverInfoCtrl = ["$scope","$stateParams","$state", "$compile", "camel", function ($scope,$stateParams, $state, $compile, camel) {
        var user = $("html").scope().user;
        $scope.vmName = $stateParams.vmName;
        $scope.Competition = Competition;
        var lay = new Layout({
            "id": "serverInfoLayoutDiv",
            "subheight": 140
        });
        $("#serverInfoNameDiv").attr("title",$.encoder.encodeForHTML($stateParams.vmName));
        $scope.opActive = function(){
            if($state.includes('vdcMgr.serverInfo.hardware')) {
                lay.opActive($(".tiny-layout-west a[ui-sref='vdcMgr.serverInfo.hardware.flavor']").last());
            }
            else {
                lay.opActive($(".tiny-layout-west a[ui-sref='" + $state.$current.name + "']").last());
            }
        };
    }];
    return serverInfoCtrl;
});
