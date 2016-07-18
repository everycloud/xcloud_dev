define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/business/resources/services/openstackResources/regionService","fixtures/hypervisorFixture"
], function ($, angular, RegionService) {
    "use strict";

    var availableZoneCtrl = ["$scope", "$compile", "$state", "$stateParams", "$q", "camel", function ($scope, $compile, $state, $stateParams, $q, camel) {
        $scope.regionName = $stateParams.region;
        $scope.novaID = undefined;
        var regionService = new RegionService($q, camel);

        //刷新按钮
        $scope.refreshButton = {
            "click": function () {
                $scope.operator.getAvailableZone();
            }
        };

        //主机列表
        $scope.availableZoneTable = {
            "id": "availableZoneTableId",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": false,
            "lengthMenu": [10, 20, 50],
            "curPage": {
            },
            "columnsVisibility": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth":"300"
                },
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.status);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
                $scope.operator.getAvailableZone();
            },

            "renderRow": function (nRow, aData, iDataIndex) {

            }
        };

        $scope.operator = {
            "getAvailableZone":function(){
                var deferred = $q.defer();
                var tmpPromise = deferred.promise;

                // 设置服务id
                var promise = regionService.getEndpoint();
                promise.then(function (data) {
                    if (!data || !data.endpoint) {
                        deferred.reject();
                    }

                    for (var index in data.endpoint) {
                        var endpoint = data.endpoint[index];
                        var regionName = endpoint.regionName;
                        if (regionName === $scope.regionName) {

                            // 初始化nova服务id
                            if(endpoint.serviceName === "nova"){
                                $scope.novaID = endpoint.id;
                            }
                        }
                    }

                    return deferred.resolve();
                });

                // 查询AZ列表
                tmpPromise.then(function(){
                    if(!$scope.novaID){
                        return;
                    }
                    var azPromise = regionService.getAvailableZone($scope.novaID);
                    azPromise.then(function(data){
                        if(!data || !data.availabilityZoneInfo){
                            return;
                        }
                        var availabilityZoneInfo = data.availabilityZoneInfo;
                        var azList = [];
                        for(var index in availabilityZoneInfo){
                            var availabilityZone = availabilityZoneInfo[index];
                            if(availabilityZone && availabilityZone.zoneName != "internal"){
                                var zone = {};
                                zone.name = availabilityZone.zoneName;
                                zone.status = availabilityZone.zoneState.available == true  ? $scope.i18n.common_term_available_label : $scope.i18n.common_term_unavailable_value;
                                azList.push(zone);
                            }
                        }
                        $scope.availableZoneTable.data = azList;
                    });
                });
            }
        };

        $scope.operator.getAvailableZone();

    }];

    return availableZoneCtrl;
});