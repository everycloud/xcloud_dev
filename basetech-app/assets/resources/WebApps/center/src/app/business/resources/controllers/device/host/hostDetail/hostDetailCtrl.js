define(['tiny-lib/angular',
    "tiny-widgets/Layout",
    "app/business/resources/controllers/device/constants"
],
    function (angular, Layout, constants) {
        "use strict";
        var hostDetailCtrl = ['$scope', '$state', '$stateParams', '$rootScope', 'camel', function ($scope, $state, $stateParams, $rootScope, camel) {
            $scope.cloudType = $rootScope.user.cloudType;
            $scope.deployMode = $("html").scope().deployMode;
            var user = $("html").scope().user;
            $scope.privilege = user.privilege;

            $scope.hostInfo = {};
            $scope.params = {
                hostId: $stateParams.hostId,
                //server,host,判断是否为server还是集群主机
                type: $stateParams.type,
                serverType: $stateParams.serverType
            };
            var detailLayout = new Layout({
                "id": "hostDetailLayout"
            });
            $scope.$on("$stateChangeSuccess", function () {
                detailLayout.opActive($("a[ui-sref='" + $state.$current.name + "']"));
            })
            var SERVER_RUN_STATUS = constants.config.HOST_RUN_STATUS;
            var RESOURCE_STATUS = constants.config.HOST_RESOURCE_STATUS;

            function getServerDetail() {
                var jax = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/servers/{serverId}", o: {serverId: $scope.params.hostId}},
                    "userId": $("html").scope().user.id
                });
                jax.done(function (response) {
                    $scope.$apply(function () {
                        if (response && response.servers && response.servers[0]) {
                            var hh = response.servers[0];


                            if (isEmpty(hh.product)) {
                                hh.product = "-";
                            }
                            if (isEmpty(hh.runtimeState) || hh.runtimeState == 0) {
                                hh.status = "-";
                            } else {
                                hh.status = $scope.i18n[SERVER_RUN_STATUS[hh.runtimeState]];
                            }
                            if (isEmpty(hh.resourceState) || hh.resourceState == 0) {
                                hh.resourceStatus = "-";
                            } else {
                                hh.resourceStatus = $scope.i18n[RESOURCE_STATUS[hh.resourceState]];
                            }
                            if (isEmpty(hh.osIp)) {
                                hh.osIp = "-";
                            }
                            if (isEmpty(hh.bmcIp)) {
                                hh.bmcIp = "-";
                            }
                            if(isEmpty(hh.description)){
                                hh.description = "-";
                            }


                            $scope.hostInfo = hh;

                            $scope.showSingleOSname = false;
                            $scope.showSingleServername = false;
                            $scope.showBothName = false;
                            if($scope.hostInfo.serverName && $scope.hostInfo.serverName != "" &&  $scope.hostInfo.serverName != null
                                && $scope.hostInfo.osName && $scope.hostInfo.osName != "" && $scope.hostInfo.osName != null){
                                $scope.showBothName = true;
                            }else if($scope.hostInfo.serverName && $scope.hostInfo.serverName != "" &&  $scope.hostInfo.serverName != null){
                                $scope.showSingleServername = true;
                            }else if($scope.hostInfo.osName && $scope.hostInfo.osName != "" && $scope.hostInfo.osName != null){
                                $scope.showSingleOSname = true;
                            }
                        }
                    });
                });
                jax.fail(function (data) {
                });
            };
            function isEmpty(value) {
                return isUndefined(value) || value === '' || value === null || value !== value;
            };
            function isUndefined(value) {
                return typeof value === 'undefined';
            }

            /*初始化服务器详情*/
            getServerDetail()
        }];
        return hostDetailCtrl;
    })
;

