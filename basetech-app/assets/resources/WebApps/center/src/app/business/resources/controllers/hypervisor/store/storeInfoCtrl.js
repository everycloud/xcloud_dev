/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    "app/services/exceptionService"
], function ($, angular,Layout,Exception) {
    "use strict";

    var storeInfoCtrl = ["$scope","$stateParams","$state", "$compile", "camel", function ($scope,$stateParams,$state, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.storeName = $stateParams.storeName;
        var storeId = $stateParams.storeId;
        $scope.breadCrumbs = {};
        $scope.privilege = user.privilege;
        $("#storeInfoNameDiv").attr("title",$.encoder.encodeForHTML($stateParams.storeName));
        var lay = new Layout({
            "id": "storeInfoLayoutDiv",
            "subheight": 140
        });
        $scope.$on("$stateChangeSuccess", function () {
            lay.opActive($("a[ui-sref='" + $state.$current.name + "']"));
        });

        $scope.goToCluster = function(){
            $state.go("resources.clusterInfo.summary", $scope.breadCrumbs);
        };
        $scope.goToStorage = function(){
            $state.go("resources.clusterInfo.store", $scope.breadCrumbs);
        };
        function getStore() {
            var params = {
                "detail": "0",
                "scopeType": "DATASTORE",
                "scopeObjectId": storeId
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                "params": JSON.stringify(params),
                "userId":user.id
            });
            deferred.success(function (data) {
                var store = data.datastoreInfos[0];
                $scope.$apply(function () {
                    $scope.breadCrumbs.clusterId = store.attachedClusters[0].clusterId;
                    $scope.breadCrumbs.clusterName = store.attachedClusters[0].clusterName;
                    $scope.breadCrumbs.hyperId = store.hypervisorId;
                    $scope.breadCrumbs.from = "resource.storeInfo.summary";
                });
                getCluster();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function getCluster() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}", o: {id: $scope.breadCrumbs.clusterId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var cluster = data.resourceCluster;
                $scope.$apply(function () {
                    $scope.breadCrumbs.indexId = cluster.indexId;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        getStore();
    }];
    return storeInfoCtrl;
});
