define(['jquery',
    "app/services/httpService",
    "app/business/resources/services/cluster/clusterService"
    ], function ($,httpService,clusterService) {
    var hgInfoCtrl = ["$scope", "camel" , function ($scope,camel) {
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var window = $("#hgInfoWindow").widget();
        $scope.name = window.option("name");
        var clusterId = window.option("clusterId");
        var resourceGroupId = window.option("resourceGroupId");

        //已选虚拟机列表
        $scope.selectedHostTable = {
            "id": "selectedHostTable",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": false,
            "lengthMenu": [10, 20, 50],
            "columnSorting": [],
            "curPage": {
            },
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.name);
					},
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.id);
					},
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
            }
        };
        function getHost() {
            //host
            clusterService.getResourceGroupDetail(clusterId,resourceGroupId,1,
                function (data) {
                    if (data && data.resourceGroup) {
                        $scope.$apply(function () {
                            $scope.selectedHostTable.data = data.resourceGroup.groupMembers;
                        });
                    }
                }, function (data) {
                });
        };
        getHost(null);
    }];

    var hgInfoModule = angular.module("resources.cluster.hgInfo", ["ng"]);
    hgInfoModule.service("camel", httpService);
    hgInfoModule.controller("resources.cluster.hgInfo.ctrl", hgInfoCtrl);
    return hgInfoModule;
});