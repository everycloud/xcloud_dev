/* global define */
define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/services/exceptionService",
        'app/business/ecs/services/vm/vmNicService'
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exception, vmNicService) {
        "use strict";
        var networkDetailCtrl = ["$scope", "$q", "camel", "exception",
            function ($scope, $q, camel, exception) {
                var user = $("html").scope().user;
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                var options = $("#netDetailWindow").widget().option("options");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.detail = {};
                $scope.supportWin = options.supportWin || "false";
                var networkTypeStr = {
                    "1": i18n.vpc_term_directConnectNet_label,
                    "2": i18n.vpc_term_innerNet_label,
                    "3": i18n.vpc_term_routerNet_label
                };

                $scope.queryDetail = function () {
                    var deferred = vmNicServiceIns.queryNetworkDetail({
                        "user": user,
                        "networkId": options.networkId,
                        "vpcId": options.vpcId,
                        "cloudInfraId": options.cloudInfraId
                    });
                    deferred.then(function (data) {
                        if (data) {
                            $scope.$apply(function(){
                                $scope.detail = data;
                                $scope.detail.networkTypeView = networkTypeStr[$scope.detail.networkType] || i18n.common_term_unknown_value;
                                if ($scope.detail.ipv4Subnet) {
                                    $scope.detail.ipv4ViewName = $scope.detail.ipv4Subnet.subnetAddr + "/" + $scope.detail.ipv4Subnet.subnetPrefix;
                                }
                                if ($scope.detail.ipv6Subnet) {
                                    $scope.detail.ipv6ViewName = $scope.detail.ipv6Subnet.subnetAddr + "/" + $scope.detail.ipv6Subnet.subnetPrefix;
                                }
                            });
                        }
                    });
                };
                $scope.queryDetail();
            }
        ];

        var networkDetailModel = angular.module("ecs.vm.nic.networkDetail", ["ng", "wcc", "ngSanitize"]);
        networkDetailModel.controller("ecs.vm.nic.networkDetail.ctrl", networkDetailCtrl);
        networkDetailModel.service("camel", http);
        networkDetailModel.service("exception", exception);
        return networkDetailModel;
    });
