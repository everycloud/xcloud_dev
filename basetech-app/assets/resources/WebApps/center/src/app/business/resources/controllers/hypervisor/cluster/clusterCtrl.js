/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/services/commonService",
    "fixtures/hypervisorFixture", "fixtures/clusterFixture"
], function ($, angular, Window, Message, Exception, commonService) {
    "use strict";

    var clusterCtrl = ["$scope", "$state", "$compile", "camel", function ($scope, $state, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_clusterHandle_value;
        var i18n = $scope.i18n || {};
        var types = {
            0: $scope.i18n.common_term_unknown_value,
            1: $scope.i18n.common_term_virtualization_label,
            2: $scope.i18n.virtual_term_bareCluster_label,
            3: $scope.i18n.common_term_manage_label,
            4: $scope.i18n.common_term_databaseCluster_label,
            5: $scope.i18n.resource_term_storageCluster_label
        };
        //关联按钮
        $scope.associateButton = {
            "id": "associate_zone_button",
            "text": $scope.i18n.common_term_associate_button,
            "click": function () {
                $state.go("resources.associateZone");
            }
        };
        $scope.refresh = function () {
            getData();
        };
        $scope.help = {
            show: false
        };
        //查询信息
        var searchInfo = {
            "name": "",
            "start": 0,
            "limit": 10
        };
        //模糊搜索框
        $scope.searchBox = {
            "id": "searchClusterBox",
            "placeholder": $scope.i18n.common_term_findName_prom,
            "search": function (searchString) {
                searchInfo.start = 0;
                $scope.clusterTable.curPage = {
                    "pageIndex": 1
                };
                getData();
            }
        };
        //集群列表
        $scope.clusterTable = {
            "id": "cluster_table",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "lengthMenu": [10, 20, 50],
            "columnSorting": [],
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
                    "sTitle": 'ID',
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
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
                    "sTitle": i18n.common_term_domain_label || "域",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.domain);
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
                    "sTitle": i18n.virtual_term_hypervisor_label || "虚拟化环境",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hypervisorName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_discoverTime_label || "发现时间",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.createTimeStr);
                    },
                    "bSortable": false,
                    "sWidth": 150
                }
            ],
            "callback": function (evtObj) {
                searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                getData();
            },
            "changeSelect": function (pageInfo) {
                searchInfo.start = 0;
                $scope.clusterTable.curPage = {
                    "pageIndex": 1
                };
                searchInfo.limit = pageInfo.displayLength;
                $scope.clusterTable.displayLength = pageInfo.displayLength;
                getData();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                $('td:eq(5)', nRow).addTitle();
                $('td:eq(6)', nRow).addTitle();

                //详情链接
                var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                var scope = $scope.$new(false);
                scope.name = aData.name;
                scope.detail = function () {
                    $state.go("resources.clusterInfo.summary", {
                        "clusterName": scope.name, "clusterId": aData.id,
                        "from": $state.current.name, "indexId": aData.indexId,
                        "hyperId": aData.hypervisorId
                    });
                };
                var node = link(scope);
                $("td:eq(0)", nRow).html(node);

                // 操作列
                var optColumn = "<div><a href='javascript:void(0)' ng-click='unassociate()' ng-if='!disable' style='margin-right:10px; width:auto'>" + (i18n.common_term_disassociate_button || "解关联") + "</a>" +
                    "<p class='disabled' ng-if='disable' style='margin-right:10px; width:auto;display: inline'>" + (i18n.common_term_disassociate_button || "解关联") + "</p>";
                optColumn += "<a href='javascript:void(0)'ng-click='manageTag()' style='width:auto'>" + (i18n.cloud_term_tagManage_label || "标签管理") + "</a>" + "</div>";
                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.disable = !Boolean(aData.zoneId);
                optScope.unassociate = function () {
                    unassociateWindow(aData);
                };
                optScope.manageTag = function () {
                    manageTag(aData.id);
                };
                var optNode = optLink(optScope);
                $("td:eq(7)", nRow).html(optNode);
            }
        };

        function unassociateWindow(aData) {
            var options = {
                type: "confirm",
                content: i18n.virtual_cluster_disassociate_info_confirm_msg || "您确认要将集群解关联吗？",
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            unassociated(aData.id, aData.zoneId);
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

        function getData() {
            if ($("#" + $scope.searchBox.id).widget()) {
                searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
            }
            var params = {
                "list": {
                    "requestType": "ALL",
                    "name": searchInfo.name,
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
                var resourceClusters = data && data.list && data.list.resourceClusters || [];
                var total = data && data.list && data.list.total || 0;
                for (var i = 0; i < resourceClusters.length; i++) {
                    resourceClusters[i].createTimeStr = (resourceClusters[i].createTime && resourceClusters[i].createTime !== "") ?
                        new Date(resourceClusters[i].createTime).format('yyyy-MM-dd hh:mm:ss') : "";
                    resourceClusters[i].type = types[resourceClusters[i].type];
                }
                $scope.$apply(function () {
                    $scope.clusterTable.totalRecords = total;
                    $scope.clusterTable.data = resourceClusters;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function unassociated(clusterId, zoneId) {
            var params = {
                "disassociate": {
                    "resources": {
                        "resourceCluster": [clusterId]
                    }
                }
            };
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/1/zones/{id}/resources/action", o: {id: zoneId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function manageTag(clusterId) {
            var newWindow = new Window({
                "winId": "localManageTagWindow",
                "title": i18n.cloud_term_tagManage_label || "标签管理",
                "content-type": "url",
                "buttons": null,
                "clusterId": clusterId,
                "resourceType": 'Cluster',
                "content": "app/business/tag/views/label/localManageTag.html",
                "height": 500,
                "width": 750
            });
            newWindow.show();
        }

        if ($scope.operable) {
            $scope.clusterTable.columns.push(
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false,
                    "sWidth": 150
                });
        }
        getData();
    }];

    return clusterCtrl;
});