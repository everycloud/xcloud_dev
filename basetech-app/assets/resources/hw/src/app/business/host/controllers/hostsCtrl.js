/* global define */
define([
    'tiny-lib/angular',
],
    function (angular) {
        "use strict";

        var hostsCtrl = ["$scope","hostpool",
            function ($scope, hostpool){
            hostpool.getAll(function(hosts) {
                $scope.hosts = hosts;
            });
            $scope.addHost = function(){
                hostpool.create();
            }
            $scope.delHost = function(hostid){
                hostpool.doDelete(hostid);
            }

        }
        ];
        return hostsCtrl;
    }
);
