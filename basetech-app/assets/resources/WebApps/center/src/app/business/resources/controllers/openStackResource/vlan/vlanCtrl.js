define(["tiny-lib/angular",
    "app/business/resources/services/openstackResources/ajaxNetwork",
    'jquery',"fixtures/hypervisorFixture"],
    function (angular, ajax, $) {
        "use strict";

        var ctrl = ["$scope", "$stateParams", "fmLib", function ($scope, $stateParams, fmLib) {
            var demo = false;
            $scope.region = $stateParams.region;

            $scope.vlanTable = {
                columns: [
                    {
                        sTitle: $scope.i18n.resource_term_physiNetName_label || "物理网络名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        bSortable: false
                    },
                    {
                        sTitle: "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        bSortable: false
                    },
                    {
                        sTitle: $scope.i18n.resource_term_vlanPool_label || "VLAN范围",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlan_seg);
                        },
                        bSortable: false
                    }
                ],
                data: []
            };

            // 查询vlans
            $scope.queryVlans = function () {
                $scope.vlanTable.data = [];
                function data2table(data) {
                    if (data && data.physicalnetworks) {
                        var arr = [];
                        for (var i in data.physicalnetworks) {
                            var e = data.physicalnetworks[i];
                            if (e.type === 'vlan') {
                                var o = {
                                    id: e.id,
                                    name: e.name,
                                    vlan_seg: e.start_seg_id + '-' + e.end_seg_id
                                };
                                arr.push(o);
                            }
                        }
                        $scope.$apply(function () {
                            $scope.vlanTable.data = arr;
                        });

                    }
                    $scope.$digest();
                }

                ajax.network.queryVlans($scope.service.neutronId, data2table);
            }

            $scope.service = {
                "neutronId": null
            }

            $scope.init = function () {
                function data2neutronId(data) {
                    if (data === undefined || data.endpoint === undefined) {
                        return;
                    }
                    for (var index in data.endpoint) {
                        var regionName = data.endpoint[index].regionName;
                        if (regionName == $scope.region
                            && data.endpoint[index].serviceName == "neutron") {
                            $scope.service.neutronId = data.endpoint[index].id;
                            if ($scope.service.neutronId != undefined) {
                                $scope.queryVlans();
                            }
                            break;
                        }
                    }
                }

                ajax.network.getServiceId(data2neutronId);
            }

            // 页面初始化，获取neutron服务
            $scope.init();

        }]

        return ctrl;
    });