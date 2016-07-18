/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService"], function ($,angular,httpService,Exception) {
    "use strict";
    var detailCtrl = ["$scope","camel",
        function ($scope,camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#disasterDetailWindow").widget();
            var disasterId = window.option("disasterId");
            var storeTypes = {
                "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
                "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
                "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
                "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
                "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
                "NAS":$scope.i18n.common_term_NAS_label
            };
            $scope.label = {
                "name": $scope.i18n.common_term_name_label+":",
                "desc":$scope.i18n.common_term_desc_label+":",
                "member":$scope.i18n.resource_term_disasterStor_label+":"
            };
            $scope.disasterTable = {
                "id": "viewLogTable",
                "data": null,
                "columnsDraggable": true,
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_capacityTotalGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.totalCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_allocatedCapacity_label+"(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.usedSizeGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_factAvailableCapacityGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.freeCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storageDevice_label,
                        "mData":function (data) {
                            return $.encoder.encodeForHTML(data.storageunitname);
                        } ,
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(5)', nRow).addTitle();
                }
            };
            function getData() {
                var params = {
                    list:{
                        scopeType:"DISASTERGROUP",
                        scopeObjectId:disasterId
                    }
                };
                var deferred = camel.post({
                    "url": {s:"/goku/rest/v1.5/irm/1/disastergroups/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var disaster = data && data.list && data.list.disasterGroups && data.list.disasterGroups[0] || {};
                    var stores = disaster.dsInfos || [];
                    for (var i = 0; i < stores.length; i++) {
                        stores[i].type = storeTypes[stores[i].type] || stores[i].type;
                    }
                    $scope.$apply(function () {
                        $scope.name = disaster.name;
                        $scope.desc = disaster.description;
                        $scope.id = disaster.id;
                        $scope.disasterTable.data = disaster.dsInfos;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getData();
        }];

    var detailModule = angular.module("resources.zone.disasterDetail", ["ng"]);
    detailModule.service("camel", httpService);
    detailModule.controller("resources.zone.disasterDetail.ctrl", detailCtrl);
    return detailModule;
});