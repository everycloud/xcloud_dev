/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "bootstrap/bootstrap.min",
    "app/services/competitionConfig",
    "app/services/exceptionService"
], function ($, angular, UnifyValid, Window, Message, bootstrap,Competition, exceptionService) {
    "use strict";

    var nicCtrl = ["$scope", "$stateParams", "$compile", "camel", function ($scope, $stateParams, $compile, camel) {
        var exceptionSer = new exceptionService();
        var user = $("html").scope().user;
        $scope.vmName = $stateParams.name;
        $scope.vmId = $stateParams.vmId;
        $scope.competition = Competition;
        var region = $stateParams.region;
        var tokenId;
        var projectId;
        var neutronId;
        var novaId;

        $scope.refresh = function () {
            if(Competition.isBaseOnVmware){
                getNovaNic();
            }
            else{
                getNic();
            }
        };

        //网卡列表
        $scope.nicTable = {
            "id": "hardwareNicTable",
            "data": null,
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.vpc_term_net_label+"ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.network_id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "MAC",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.mac_address);
                    },
                    "bSortable": false,
                    "sWidth": 120
                },
                {
                    "sTitle": $scope.i18n.common_term_IP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ip);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.security_term_SG_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.sg);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
            }
        };

        //nova网卡列表
        $scope.novaNicTable = {
            "id": "hardwareNovaNicTable",
            "data": null,
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_NIC_label+"ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false,
                    "sWidth":250
                },
                {
                    "sTitle": $scope.i18n.vpc_term_net_label+"ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data["OS-EXT-VIF-NET:net_id"]);
                    },
                    "bSortable": false,
                    "sWidth":250
                },
                {
                    "sTitle": "MAC",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.mac_address);
                    },
                    "bSortable": false,
                    "sWidth": 120
                },
                {
                    "sTitle":  $scope.i18n.common_term_IP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.addr);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
            }
        };

        function getNic() {
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{neutronId}/v2.0/ports?device_id={serverId}",
                    o: {neutronId: neutronId, projectId: projectId, serverId: $scope.vmId}
                },
                "params": null,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                var ports = data && data.ports || [];
                for(var i=0;i<ports.length;i++){
                    var sgs = ports[i].security_groups || [];
                    for(var j=0;j<sgs.length;j++){
                        ports[i].sg = ports[i].sg?(ports[i].sg + ";" + sgs[j]) : sgs[j];
                    }
                    var ips = ports[i].fixed_ips || [];
                    for(var k=0;k<ips.length;k++){
                        ports[i].ip = ports[i].ip?(ports[i].ip + ";"+ips[k].ip_address):ips[k].ip_address;
                    }
                }
                $scope.$apply(function () {
                    $scope.nicTable.data = ports;
                });
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function getNovaNic() {
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/os-virtual-interfaces",
                    o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                },
                "params": null,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                var ports = data && data.virtual_interfaces || [];
                for(var i=0;i<ports.length;i++){
                    for (var j in $scope.addresses) {
                        var network = $scope.addresses[j] || [];
                        for (var k = 0; k < network.length; k++) {
                            if(ports[i].mac_address === network[k]["OS-EXT-IPS-MAC:mac_addr"]){
                                ports[i].addr =  network[k].addr;
                                break;
                            }
                        }
                    }
                }
                $scope.$apply(function () {
                    $scope.novaNicTable.data = ports;
                });
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function getVm() {
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}",
                    o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                },
                "params": null,
                "userId": user.id,
                "beforeSend": function (request) {
                    request.setRequestHeader("X-Auth-Token", tokenId);
                }
            });
            deferred.success(function (data) {
                var server = data.server;
                var ip = "";
                var mac = "";
                $scope.addresses = server.addresses || {};
                getNovaNic();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function getToken() {
            var deferred = camel.get({
                "url": {"s": "/goku/rest/v1.5/token"},
                "params": {"user-id": user.id},
                "userId": user.id
            });
            deferred.success(function (data) {
                if (data === undefined) {
                    return;
                }
                tokenId = data.id;
                projectId = data.projectId;
                //openstack接入vmware,则查询nova network的网卡
                if(Competition.isBaseOnVmware){
                    getVm();
                }
                else{
                    getNic();
                }
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function getRegion() {
            var deferred = camel.get({
                "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                "userId": user.id
            });
            deferred.success(function (data) {
                var endPoint = data && data.endpoint || [];
                var regions = [];
                for (var i = 0; i < endPoint.length; i++) {
                    if (endPoint[i].regionName === region && endPoint[i].serviceName === "neutron") {
                        neutronId = endPoint[i].id;
                    }
                    if (endPoint[i].regionName === region && endPoint[i].serviceName === "nova") {
                        novaId = endPoint[i].id;
                    }
                }
                getToken();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        getRegion();
    }];
    return nicCtrl;
});
