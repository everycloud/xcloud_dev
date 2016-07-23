/* global define */
define([
    'tiny-lib/angular',
        'app/business/host/factory/hostpool'
],
    function (angular,hostpool) {
        "use strict";
        var hostsCtrl = ["$scope","$http","$modal",
            function ($scope,$http,$modal){
                var hostpoolIns = new hostpool(angular);
                console.log(hostpoolIns);

            $scope.getAll = function(hosts) {
                console.log("22222---");
                $scope.hosts = hosts;
            };
            $scope.addHost = function(){
                hostpoolIns.create($modal);
            }
            $scope.delHost = function(hostid){
                hostpoolIns.doDelete(hostid);
            }

            //获取初始化信息
            $scope.$on("$viewContentLoaded", function () {
                    console.log("hahahaha");
                    var host = hostpoolIns.getAll(function(hosts) {
                        $scope.hosts = hosts;
                    },$http);
                });

        }];
        return hostsCtrl;
    }
);
