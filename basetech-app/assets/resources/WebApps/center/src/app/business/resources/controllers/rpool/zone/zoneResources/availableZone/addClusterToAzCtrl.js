/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, httpService, UnifyValid, Exception) {
        "use strict";

        var addClusterCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#addClusterWindow").widget();
            var zoneId = window.option("zoneId");
            var azId = window.option("azId");
            var types = {
                0:$scope.i18n.common_term_unknown_value,
                1:$scope.i18n.common_term_virtualization_label,
                2:$scope.i18n.virtual_term_bareCluster_label,
                3:$scope.i18n.common_term_manage_label,
                4:$scope.i18n.common_term_databaseCluster_label,
                5:$scope.i18n.resource_term_storageCluster_label
            };
            var selectedCluster = [];
            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            //集群列表
            $scope.clusterTable = {
                "id": "addClusterTable",
                "data": null,
                "columnsDraggable": true,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth":40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":$scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_domain_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.domain);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hypervisorName);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getCluster();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.clusterTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.clusterTable.displayLength = pageInfo.displayLength;
                    getCluster();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    //复选框
                    var options = {
                        "id": "clusterCheckbox_" + iDataIndex,
                        "checked": false,
                        "change": function () {

                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());
                }
            };
            function getCluster() {
                var params = {
                    "list": {
                        "availableZoneId": azId,
                        "requestType": "DISASSOCIATED",
                        "start": searchInfo.start,
                        "limit": searchInfo.limit,
                        "ignoreCapacity":true
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/resourceclusters/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var clusters = data && data.list && data.list.resourceClusters || [];
                    var total = data && data.list && data.list.total || 0;
                    for (var i = 0; i < clusters.length; i++) {
                        clusters[i].type = types[clusters[i].type];
                    }
                    $scope.$apply(function () {
                        $scope.clusterTable.totalRecords = total;
                        $scope.clusterTable.data = clusters;
                    });
                    //表头全选复选框
                    var tableId = "#addClusterTable";
                    var options = {
                        "id": "clusterHeadCheckbox",
                        "checked": false,
                        "change": function () {
                            var isChecked = $("#" + options.id).widget().option("checked");
                            var index = 0;
                            while ($("#clusterCheckbox_" + index).widget()) {
                                $("#clusterCheckbox_" + index).widget().option("checked", isChecked);
                                index++;
                            }
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $(tableId + ' th:eq(0)').html(checkbox.getDom());
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getCluster();

            //确定按钮
            $scope.okButton = {
                "id": "addClusterOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.clusterTable.data;
                    selectedCluster = [];
                    var index = 0;
                    while ($("#clusterCheckbox_" + index).widget()) {
                        var checked = $("#clusterCheckbox_" + index).widget().option("checked");
                        if (checked) {
                            selectedCluster.push(data[index].id);
                        }
                        index++;
                    }
                    associate();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "addClusterCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function associate() {
                var params = {
                    "associate": {
                        "resources": {
                            "resourceCluster": selectedCluster
                        }
                    }
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/availablezones/{id}/resources/action", o: {id: azId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        }];

        var addClusterApp = angular.module("addClusterToAzApp", ['framework']);
        addClusterApp.service("camel", httpService);
        addClusterApp.controller("resources.zone.addClusterToAz.ctrl", addClusterCtrl);
        return addClusterApp;
    }
);