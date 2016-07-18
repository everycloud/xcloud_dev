/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, UnifyValid,Window,Message,Exception) {
    "use strict";

    var cdCtrl = ["$scope", "$stateParams", "$compile", "camel", function ($scope, $stateParams, $compile, camel) {
        var user = $("html").scope().user;
        var exceptionService = new Exception();
        $scope.vmId = $stateParams.vmId;

        function getCd() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}/iso", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var devicePath = data && data.devicePath;
                if ($("#vmInfoHardwareTable").widget() && $scope.hardwareTable.data) {
                    $scope.hardwareTable.data[6].summary = devicePath? ($scope.i18n.common_term_Exist_value || "存在"):($scope.i18n.common_term_none_label || "无");
                    $("#vmInfoHardwareTable").widget().option("data", $scope.hardwareTable.data);
                }
                $scope.$apply(function () {
                    $scope.devicePath = devicePath?devicePath:($scope.i18n.common_term_none_label || "无");
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        getCd();
    }];
    return cdCtrl;
});
