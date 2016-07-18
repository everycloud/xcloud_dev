/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "app/services/exceptionService"
], function ($, angular, Window, Exception) {
    "use strict";

    var storeCtrl = ["$scope", "$state", "$compile", "$stateParams", "camel", function ($scope, $state, $compile, $stateParams, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.exportAble = user.privilege.role_role_add_option_reportView_value;
        $scope.clusterName = $stateParams.clusterName;
        var clusterId = $stateParams.clusterId;
        var hyperId = $stateParams.hyperId;
        $scope.help = {
            show: false
        };
        var storeTypes = {
            "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
            "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
            "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
            "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
            "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
            "NAS":$scope.i18n.common_term_NAS_label
        };
        //导出按钮
        $scope.exportButton = {
            "id": "storeExportButton",
            "text": $scope.i18n.common_term_export_button,
            "click": function () {
                exportStoreList();
            }
        };
        $scope.refresh = function () {
            getStores();
        };

        //查询信息
        var searchInfo = {
            "start": 0,
            "limit": 10
        };
        //集群列表
        $scope.storeTable = {
            "id": "store_table",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "lengthMenu": [10, 20, 50],
            "columnsDraggable": true,
            showDetails: true,
            "columns": [
                {
                    "sTitle": "",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": "5%"
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth": "13%"
                },
                {
                    "sTitle":  $scope.i18n.common_term_type_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.type);
                    },
                    "bSortable": false,
                    "sWidth": "13%"
                },
                {
                    "sTitle":  $scope.i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.status);
                    },
                    "bSortable": false,
                    "sWidth": "13%"
                },
                {
                    "sTitle":  $scope.i18n.common_term_capacityTotalGB_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.capacity.totalCapacityGB);
                    },
                    "bSortable": false,
                    "sWidth": "13%"
                },
                {
                    "sTitle": $scope.i18n.perform_term_allocatedCapacity_label+"(GB)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.capacity.usedSizeGB);
                    },
                    "bSortable": false,
                    "sWidth": "13%"
                },
                {
                    "sTitle": $scope.i18n.perform_term_factAvailableCapacityGB_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.capacity.freeCapacityGB);
                    },
                    "bSortable": false,
                    "sWidth": "15%"
                }
            ],
            "callback": function (evtObj) {
                searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                getStores();
            },
            "changeSelect": function (pageInfo) {
                searchInfo.start = 0;
                $scope.storeTable.curPage = {
                    "pageIndex": 1
                };
                searchInfo.limit = pageInfo.displayLength;
                $scope.storeTable.displayLength = pageInfo.displayLength;
                getStores();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                $(nRow).attr("storageId", $.encoder.encodeForHTML("" + aData.id));

                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                $('td:eq(5)', nRow).addTitle();
                $('td:eq(6)', nRow).addTitle();
                if ($scope.hyperType !== "VMware") {
                    //详情链接
                    var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                    var scope = $scope.$new(false);
                    scope.name = aData.name;
                    scope.detail = function () {
                        $state.go("resources.storeInfo.summary", {"storeId": aData.id, "storeName": scope.name,
                            "from": $state.current.name,"hyperId": hyperId});
                    };
                    var node = link(scope);
                    $("td:eq(1)", nRow).html(node);
                }
            }
        };
        function exportStoreList() {
            var locale = $scope.i18n.locale === "zh"?"zh_CN":"en_US";
            var params = {
                "exportDataStore": {
                    "scopeType": "CLUSTER",
                    "scopeObjectId": clusterId
                }
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/reports/resource-reports/action?locale={locale}", o: {locale: locale}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                if (data.exportFilePath) {
                    var reportUrl = "/goku/rest/v1.5/file/" + encodeURIComponent(data.exportFilePath) + "?type=export" + "&t=" + Math.random();
                    $("#downloadStoreIframe").attr("src", $.encoder.encodeForHTML(reportUrl));
                }
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function getStores() {
            var params = {
                "detail": "0",
                "scopeType": "CLUSTER",
                "scopeObjectId": clusterId,
                "offset": searchInfo.start,
                "limit": searchInfo.limit
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var stores = data && data.datastoreInfos || [];
                var total = data && data.total || 0;
                for (var i = 0; i < stores.length; i++) {
                    stores[i].detail = {
                        contentType: "url",
                        content: "app/business/resources/views/rpool/zone/zoneResources/storage/secondaryStorage/storageDetail.html"
                    };
                    stores[i].status = stores[i].accessible ? $scope.i18n.common_term_available_label : $scope.i18n.common_term_unavailable_value;
                    stores[i].isThin = stores[i].ability.isThin ? $scope.i18n.common_term_support_value :  $scope.i18n.common_term_notSupport_value;
                    stores[i].maintenancemode = stores[i].maintenancemode ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                    stores[i].type = storeTypes[stores[i].type] || stores[i].type;
                }
                $scope.$apply(function () {
                    $scope.storeTable.totalRecords = total;
                    $scope.storeTable.data = stores;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function getHypervisor() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id: hyperId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                $scope.hyperType = data.hypervisor.type;
                getStores();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        getHypervisor();
    }];

    return storeCtrl;
});
