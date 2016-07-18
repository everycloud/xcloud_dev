/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService"],
    function ($,angular,Window, Message, Exception) {
        "use strict";

        var computingCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", function ($scope, $stateParams, $compile, $state, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege.role_role_add_option_clusterHandle_value;
            var types = {
                0:$scope.i18n.common_term_unknown_value,
                1:$scope.i18n.common_term_virtualization_label,
                2:$scope.i18n.virtual_term_bareCluster_label,
                3:$scope.i18n.common_term_manage_label,
                4:$scope.i18n.common_term_databaseCluster_label,
                5:$scope.i18n.resource_term_storageCluster_label
            };
            $scope.zoneInfo = {
                "zoneId": $stateParams.id,
                "zoneName": $stateParams.name
            };
            $scope.help = {
                show : false
            };
            var searchInfo = {
                "name":"",
                "start": 0,
                "limit": 10
            };

            /**
             * 初始化表格操作列
             */
            var addOperatorDom = function (dataItem, row) {

                var optTemplates = "<div><a href='javascript:void(0)' ng-click='unassociate()' ng-if='!disable' style='margin-right:10px; width:auto'>"+
                    $scope.i18n.resource_term_disassociate_button+"</a>"+
                    "<p class='disabled' ng-if='disable' style='margin-right:10px; width:auto;display: inline'>"+$scope.i18n.resource_term_disassociate_button+"</p>";
                optTemplates += "<a href='javascript:void(0)'ng-click='manageTag()' style='width:auto'>"+$scope.i18n.cloud_term_tagManage_label+"</a>" + "</div>";

                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.disable = !Boolean(dataItem.zoneId);

                scope.unassociate = function () {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.virtual_cluster_disassociate_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn : true,
                                handler: function (event) {
                                    unassociated(dataItem.id);
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
                };
                scope.manageTag = function () {
                    var newWindow = new Window({
                        "winId": "localManageTagWindow",
                        "title": $scope.i18n.cloud_term_manageTag_button,
                        "content-type": "url",
                        "buttons": null,
                        "clusterId":dataItem.id,
                        "resourceType":'Cluster',
                        "content": "app/business/tag/views/label/localManageTag.html",
                        "height": 500,
                        "width": 750
                    });
                    newWindow.show();
                };

                var optDom = $compile($(optTemplates))(scope);
                $("td:eq(7)", row).html(optDom);

                // 初始化详情
                var nameDom = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                var nameLink = $compile(nameDom);
                var nameScope = $scope.$new();
                nameScope.name = dataItem.name;
                nameScope.id = dataItem.id;
                nameScope.goToDetail = function () {
                    $state.go("resources.clusterInfo.summary", {
                        "clusterName": nameScope.name,"clusterId":nameScope.id,"indexId":dataItem.indexId,
                        "from": $state.current.name,"hyperId":dataItem.hypervisorId});
                };
                var zoneNameNode = nameLink(nameScope);
                $("td:eq(0)", row).html(zoneNameNode);
            };

            $scope.clusterTable = {
                data: [],
                id: "clusterTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: false,
                columns: [
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
                        "sTitle": $scope.i18n.common_term_domain_label,
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
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hypervisorName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_discoverTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTimeStr);
                        },
                        "bSortable": false,
                        "sWidth":150
                    }
                ],
                callback: function (evtObj) {
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
                renderRow: function (row, dataitem, index) {
                    $('td:eq(0)', row).addTitle();
                    $('td:eq(1)', row).addTitle();
                    $('td:eq(2)', row).addTitle();
                    $('td:eq(3)', row).addTitle();
                    $('td:eq(4)', row).addTitle();
                    $('td:eq(5)', row).addTitle();
                    $('td:eq(6)', row).addTitle();
                    // 添加操作
                    addOperatorDom(dataitem, row);
                }
            };

            $scope.associate = {
                id: "associateClusterID",
                disable: false,
                text: $scope.i18n.resource_term_associateCluster_button,
                associate: function () {
                    $state.go("resources.associateCluster",{zoneId:$scope.zoneInfo.zoneId,zoneName:$scope.zoneInfo.zoneName});
                }
            };

            //模糊搜索框
            $scope.searchBox = {
                "id": "searchComputingBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "search": function (searchString) {
                    searchInfo.start = 0;
                    $scope.clusterTable.curPage = {
                        "pageIndex": 1
                    };
                    getCluster();
                }
            };
            $scope.refresh = function () {
                getCluster();
            };
            function getCluster() {
                if ($("#" + $scope.searchBox.id).widget()) {
                    searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
                }
                var params = {
                    "list":{
                        "zoneId":$scope.zoneInfo.zoneId,
                        "name":searchInfo.name,
                        "requestType":"ASSOCIATED",
                        "start":searchInfo.start,
                        "limit":searchInfo.limit,
                        "ignoreCapacity":true
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/resourceclusters/action",
                    "params": JSON.stringify(params),
                    "userId":user.id
                });
                deferred.success(function (data) {
                    var resourceClusters = data && data.list && data.list.resourceClusters || [];
                    var total = data && data.list && data.list.total || 0;
                    for (var i = 0; i < resourceClusters.length; i++) {
                        resourceClusters[i].createTimeStr = (resourceClusters[i].createTime && resourceClusters[i].createTime !== "")?
                            new Date(resourceClusters[i].createTime).format('yyyy-MM-dd hh:mm:ss'):"";
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
            function unassociated(clusterId) {
                var params = {
                    "disassociate": {
                        "resources": {
                            "resourceCluster": [clusterId]
                        }
                    }
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/zones/{id}/resources/action", o: {id: $scope.zoneInfo.zoneId}},
                    "params": JSON.stringify(params),
                    "userId":user.id
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
                        "bSortable": false,
                        "sWidth":150
                    });
            }
            getCluster();
        }];

        return computingCtrl;
    });