define(['jquery',
    "app/services/httpService"
], function ($, httpService, clusterService) {
    var hgInfoCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#azListWin").widget();
            var tagName = window.option("tagName");
            var tagValues = window.option("tagValues");

            //已选虚拟机列表
            $scope.azListTable = {
                "id": "azListTableId",
                "data": [],
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": false,
                "lengthMenu": [10, 20, 50],
                "columnSorting": [],
                "curPage": {},
                "columns": [{
                        "sTitle": $scope.i18n.common_term_name_label,
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.name);
						},
                        "bSortable": false
                    }, {
                        "sTitle": $scope.i18n.resource_term_bondVDCnum_label,
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.associatedOrgNum);
						},
                        "bSortable": false
                    }, {
                        "sTitle": $scope.i18n.common_term_desc_label,
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.description);
						},
                        "bSortable": false
                    }

                ],
                "callback": function (evtObj) {},
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                }
            };

            function getAZ() {

                var tag = [];
                if (tagValues) {
                    var arr = tagValues.split(";");
                    for (var i = 0; i < arr.length; i++) {
                        tag.push({
                            "name": tagName,
                            "value": arr[i]
                        });
                    }
                }
                var params = {
                    "tags": tag
                };
                var defe = camel.post({
                    "url": "/goku/rest/v1.5/1/available-zones/list",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                defe.done(function (data) {
                    $scope.$apply(function () {
                        if (data && data.availableZones) {
                            $scope.azListTable.data = data.availableZones;
                        }
                    });
                });
                defe.fail(function (data) {});
            };
            getAZ();
        }
    ];

    var hgInfoModule = angular.module("tag.azList", ["ng"]);
    hgInfoModule.service("camel", httpService);
    hgInfoModule.controller("tag.azList.ctrl", hgInfoCtrl);
    return hgInfoModule;
});
