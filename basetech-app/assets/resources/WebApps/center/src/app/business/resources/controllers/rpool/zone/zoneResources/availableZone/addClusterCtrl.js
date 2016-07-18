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
            var selectedCluster = window.option("selectedCluster");
            var types = {
                0: $scope.i18n.common_term_unknown_value,
                1: $scope.i18n.common_term_virtualization_label,
                2: $scope.i18n.virtual_term_bareCluster_label,
                3: $scope.i18n.common_term_manage_label,
                4: $scope.i18n.common_term_databaseCluster_label,
                5: $scope.i18n.resource_term_storageCluster_label
            };
            //查询信息
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
                        "sWidth": 40
                    },
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
                    },
                    {
                        "sTitle": $scope.i18n.cloud_term_tag_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.tags);
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
                    $("td:eq(6)", nRow).addTitle();
                    //复选框
                    var options = {
                        "id": "clusterCheckbox_" + iDataIndex,
                        "checked": aData.checked,
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
                        "zoneId": zoneId,
                        "requestType": "DISASSOCIATED_OF_AZ",
                        "start": searchInfo.start,
                        "limit": searchInfo.limit,
                        "ignoreCapacity": true
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
                    var computing = [];
                    for (var i = 0; i < clusters.length; i++) {
                        clusters[i].type = types[clusters[i].type];

                        //tags
                        var tagArr = [];
                        if (clusters[i].tags && clusters[i].tags.length > 0) {
                            for (var k = 0; k < clusters[i].tags.length; k++) {
                                tagArr.push(clusters[i].tags[k].name + ":" + clusters[i].tags[k].value);
                            }
                        }
                        clusters[i].tags = tagArr.join(",");
                        computing.push(clusters[i]);
                        for (var j = 0; j < selectedCluster.length; j++) {
                            if (clusters[i].id === selectedCluster[j].id) {
                                clusters[i].checked = true;
                            }
                        }
                    }
                    $scope.$apply(function () {
                        $scope.clusterTable.totalRecords = total;
                        $scope.clusterTable.data = computing;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            //确定按钮
            $scope.okButton = {
                "id": "addClusterOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.clusterTable.data;
                    var index = 0;
                    while ($("#clusterCheckbox_" + index).widget()) {
                        var checked = $("#clusterCheckbox_" + index).widget().option("checked");
                        var i = 0;
                        for (; i < selectedCluster.length; i++) {
                            if (selectedCluster[i].id === data[index].id) {
                                break;
                            }
                        }
                        //从没选中到选中
                        if (checked && i === selectedCluster.length) {
                            selectedCluster.push(data[index]);
                        }
                        //从选中到没选中
                        if(!checked && i < selectedCluster.length){
                            selectedCluster.splice(i,1);
                        }
                        index++;
                    }
                    window.destroy();
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

            getCluster();
        }];

        var addClusterApp = angular.module("addClusterApp", ['framework']);
        addClusterApp.service("camel", httpService);
        addClusterApp.controller("resources.zone.addCluster.ctrl", addClusterCtrl);
        return addClusterApp;
    }
);