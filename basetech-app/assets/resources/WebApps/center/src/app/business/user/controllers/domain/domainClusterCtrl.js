/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-26
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    'tiny-widgets/Message',
    "app/business/user/service/domainService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    "fixtures/userFixture",
    "tiny-directives/Searchbox",
    "bootstrap/bootstrap.min"],
    function ($, angular, Window, Message, DomainService, ExceptionService, MessageService, commonService) {
        "use strict";
        var domainClusterCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
            var user = $("html").scope().user;
            var i18n = $scope.i18n;
            //todo 有坑中英文对照相反
            var hasDomainOperateRight = $scope.hasDomainOperateRight = user.privilege.role_role_add_option_domainHandle_value;
            $scope.domainService = new DomainService();
            var types = {
                0: i18n.common_term_unknown_value || "未知",
                1: i18n.common_term_virtualization_label || "虚拟化",
                2: i18n.virtual_term_bareCluster_label || "裸金属集群",
                3: i18n.virtual_term_manageCluster_label ||"管理集群",
                4: i18n.common_term_databaseCluster_label || "数据库集群",
                5: i18n.resource_term_storageCluster_label || "存储集群"
            };

            $scope.searchBox = {
                "id": "clusterClusterBox",
                "placeholder": i18n.domain_term_findClusterName_prom || "输入资源集群名称",
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.searchModel.name = $.trim(searchString);
                    $scope.operator.getCluster();
                }
            };
            $scope.createClusterModel = {
                "id": "createClusterBtnId",
                "text": i18n.resource_term_addCluster_button || "添加资源集群",
                "disabled": false,
                "create": function () {
                    var createWindow = new Window({
                        "winId": "addClusterWindowId",
                        "domainId": $scope.domainId,
                        "title": i18n.resource_term_addCluster_button || "添加资源集群",
                        "content-type": "url",
                        "content": "app/business/user/views/domain/addCluster.html",
                        "height": 600,
                        "width": 800,
                        "minimizable": false,
                        "maximizable": false,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operator.getCluster();
                        }
                    }).show();
                }
            };

            $scope.refresh = {
                id: "clusterRefreshId",
                text: i18n.common_term_fresh_button || "刷新",
                click: function () {
                    $scope.searchModel.name = $("#" + $scope.searchBox.id).widget().getValue();
                    $scope.operator.getCluster();
                }
            };

            $scope.searchModel = {
                start: 0,
                limit: commonService.DEFAULT_TABLE_PAGE_LENGTH,
                domain: $scope.domainId,
                name: ""
            };
            $scope.clusterTable = {
                caption: "",
                data: [],
                id: "clusterTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: commonService.TABLE_PAGE_LENGTH_OPTIONS,
                displayLength: commonService.DEFAULT_TABLE_PAGE_LENGTH,
                enableFilter: false,
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: false,
                columns: [
                    {
                        "sTitle": i18n.common_term_name_label || "名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_type_label || "类型",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_createAt_label || "创建时间",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTimeStr);
                        },
                        "bSortable": false,
                        "sWidth": 170
                    },
                    {
                        "sTitle": i18n.common_term_operation_label || "操作",
                        "mData": "",
                        "bSortable": false,
                        "sWidth": 100,
                        "sClass": "operate"
                    }
                ],
                callback: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operator.getCluster();
                },
                changeSelect: function (evtObj) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operator.getCluster();
                },
                renderRow: function (row, dataitem, index) {
                    // 操作栏
                    var optTemplates = "<a href='javascript:void(0)' ng-if='hasDomainOperateRight' ng-click='removeUser()'>" + (i18n.common_term_move_button || "移除") + "</a>";
                    var opts = $compile($(optTemplates));
                    var optscope = $scope.$new(false);
                    optscope.hasDomainOperateRight = hasDomainOperateRight;
                    optscope.removeUser = function () {
                        new MessageService().confirmMsgBox({
                            "content": i18n.domain_cluster_move_info_confirm_msg || "确实要移除该资源集群吗？",
                            "callback": function () {
                                $scope.operator.removeCluster(dataitem.id);
                            }
                        });
                    };
                    var optNode = opts(optscope);
                    $("td.operate", row).html(optNode);
                }
            };
            $scope.operator = {
                "getCluster": function getCluster() {
                    var domainId = $scope.domainId;
                    var domainName = $scope.domainName;
                    if (!domainId || "domainParentId" === $scope.domainId || !domainName) {
                        var dom = document.getElementById($scope.clusterTable.id);
                        dom && $(dom).widget().option("data", []);
                        return;
                    }
                    if(!$scope.inThisDomain){
                        return;
                    }

                    $scope.searchModel.domain = domainId;
                    var deferred = camel.post({
                        "url": "/goku/rest/v1.5/irm/1/resourceclusters/action",
                        "params": JSON.stringify({list: $scope.searchModel}),
                        "userId": user.id
                    });
                    deferred.done(function (data) {
                        var resourceClusters = (data.list && data.list.resourceClusters) || [];
                        var computing = [];
                        for (var i = 0, len = resourceClusters.length; i < len; i++) {
                            var cluster = resourceClusters[i];
                            cluster.createTimeStr = (cluster.createTime && commonService.utcMilliseconds2Local(cluster.createTime)) || "";
                            cluster.type = types[cluster.type];
                            computing.push(cluster);
                        }
                        $scope.$apply(function () {
                            $scope.clusterTable.data = computing;
                            if (data.list) {
                                $scope.clusterTable.totalRecords = data.list.total;
                            }
                        });
                    });

                    deferred.fail(function (data) {
                        $scope.$apply(function () {
                            $scope.clusterTable.totalRecords = 0;
                            $scope.clusterTable.data = [];
                            new ExceptionService().doException(data);
                        });
                    });
                },
                "removeCluster": function (id) {
                    var deferred = camel.put({
                        "url": {
                            s: "/goku/rest/v1.5/irm/{tenant_id}/resourceclusters",
                            o: {"tenant_id": "1"}
                        },
                        "params": JSON.stringify({
                            "modifyDomain": {
                                "clusterIds": [id],
                                "outDomainId": $scope.domainId
                            }
                        }),
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        $scope.operator.getCluster();
                    });
                    deferred.complete(function (response) {
                        $scope.operator.getCluster();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };
            $scope.operator.getCluster();

        }];

        return domainClusterCtrl;
    });
