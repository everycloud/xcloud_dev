/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Select",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Select, Window,Message,httpService,UnifyValid, Exception) {
        "use strict";

        var clusterOfAzCtrl = ["$scope", "$compile", "$state", "camel", "validator", function ($scope, $compile, $state, camel, validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.operable = user.privilege["role_role_add_option_AZHandle_value.601002"];
            var window = $("#clusterOfAzWindow").widget();
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
            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            //添加集群按钮
            $scope.addClusterButton = {
                "id": "addClusterButton",
                "text": $scope.i18n.resource_term_addCluster_button,
                "click": function () {
                    var newWindow = new Window({
                        "winId": "addClusterWindow",
                        "zoneId":zoneId,
                        "azId":azId,
                        "title": $scope.i18n.resource_term_addCluster_button,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/rpool/zone/zoneResources/availableZone/addClusterToAz.html",
                        "height": 500,
                        "width": 750,
                        "close":function(){
                            getCluster();
                        }
                    });
                    newWindow.show();
                }
            };
            //集群列表
            $scope.clusterTable = {
                "id": "clusterTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
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
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.delete = function () {
                        unAssociateWindow(aData.id);
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(5)", nRow).html(optNode);
                }
            };
            function getCluster() {
                var params = {
                    "list": {
                        "availableZoneId": azId,
                        "requestType": "ASSOCIATED",
                        "start":searchInfo.start,
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
                    for(var i = 0;i<clusters.length;i++){
                        clusters[i].type = types[clusters[i].type];
                    }
                    $scope.$apply(function () {
                        $scope.clusterTable.totalRecords = total;
                        $scope.clusterTable.data = clusters;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function unAssociateWindow(clusterId) {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.resource_az_moveCluster_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                unAssociate(clusterId);
                                msg.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
            function unAssociate(clusterId) {
                var params = {
                    "disassociate": {
                        "resources":{
                            "resourceCluster": [clusterId]
                        }
                    }
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/availablezones/{id}/resources/action", o: {id: azId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    getCluster();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            if($scope.operable){
                $scope.clusterTable.columns.push(
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    });
            }
            getCluster();
        }];

        var clusterOfAzApp = angular.module("clusterOfAzApp", ['framework']);
        clusterOfAzApp.service("camel",httpService);
        clusterOfAzApp.controller("resources.zone.clusterOfAz.ctrl", clusterOfAzCtrl);
        return clusterOfAzApp;
    }
);