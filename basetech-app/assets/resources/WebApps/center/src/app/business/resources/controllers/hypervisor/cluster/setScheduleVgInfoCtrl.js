define(['jquery',
    "app/services/httpService",
    "app/business/resources/services/cluster/clusterService"
    ], function ($,httpService,clusterService) {
    var vgInfoCtrl = ["$scope", "camel" , function ($scope,camel) {
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var window = $("#vgInfoWindow").widget();
        $scope.name = window.option("name");
        var clusterId = window.option("clusterId");
        var resourceGroupId = window.option("resourceGroupId");
        //已选虚拟机列表
        $scope.selectedVmTable = {
            "id": "selectedVmTable",
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
                    "sTitle":$scope.i18n.common_term_name_label,
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.name);
					},
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
					"mData": function (data) {
						var newId = clusterService.getVMVisibleId(data.id);
						return $.encoder.encodeForHTML(newId);
					},
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
				$('td:eq(1)', nRow).attr("title",aData.id);
            }
        };
        function getVm(pageInfo) {
            clusterService.getResourceGroupDetail(clusterId,resourceGroupId,0,
                function (data) {
                    if (data && data.resourceGroup) {
                        $scope.$apply(function () {
                            $scope.selectedVmTable.data = data.resourceGroup.groupMembers;
                        });
                    }
                }, function (data) {
                });
        };
        getVm(null);
    }];

    var vgInfoModule = angular.module("resources.cluster.vgInfo", ["ng"]);
    vgInfoModule.service("camel", httpService);
    vgInfoModule.controller("resources.cluster.vgInfo.ctrl", vgInfoCtrl);
    return vgInfoModule;
});