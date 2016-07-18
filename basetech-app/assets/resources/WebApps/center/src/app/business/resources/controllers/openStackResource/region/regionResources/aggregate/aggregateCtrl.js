define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/services/commonService",
    "bootstrap/bootstrap.min",
    "fixtures/dataCenterFixture"
], function ($, angular, Window, Message, ExceptionService, CommonService, bootstrap) {
    "use strict";

    var hostCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", function ($scope, $compile, $state, $stateParams, camel) {
        var user = $("html").scope().user;
        $scope.region = $stateParams.region;
        $scope.projectId = undefined;
        $scope.token = undefined;
        $scope.serviceID = undefined;
        var exceptionService = new ExceptionService();

        //刷新按钮
        $scope.refreshButton = {
            "id": "refreshHostButton",
            "click": function () {
                $scope.operator.init();
            }
        };

        //分页信息
        var pageInfo = null;

        var createSlaExtraWindow = function (id) {
            var options = {
                "winId": "createSlaExtraWinID",
                "serviceID": $scope.serviceID,
                "aggregateId": id,
                "title":$scope.i18n.cloud_term_manageTag_button || "管理标签",
                "content-type": "url",
                "content": "./app/business/resources/views/openStackResource/region/regionResources/aggregate/createAggregateSla.html",
                "height": 450,
                "width": 550,
                "resizable": true,
                "maximizable": false,
                "minimizable": false,
                "buttons": null,
                "close": function (event) {
                    $scope.operator.action("query",null);
                }
            };

            var win = new Window(options);
            win.show();
        };

        //主机组列表
        $scope.aggregateTable = {
            "id": "aggregateTableId",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": false,
            "lengthMenu": [10, 20, 50],
            "curPage": {
            },
            "columnsVisibility": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_hostGroup_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.resource_term_AZ_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.availability_zone);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_createAt_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.created_at);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_updatTime_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.updated_at);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label || "操作",
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
                pageInfo = evtObj;
                $scope.operator.init();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                //详情链接
                var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                var scope = $scope.$new(false);
                scope.name = aData.name;
                scope.detail = function () {
                    var newWindow = new Window({
                        "winId": "aggregateDetailWindow",
                        "serviceId": $scope.serviceID,
                        "region":$scope.region,
                        "aggregateId":aData.id,
                        "title": $scope.i18n.common_term_hostList_label,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/openStackResource/region/regionResources/aggregate/aggregateDetail.html",
                        "width": "600px",
                        "height": "450px",
                        "maximizable":false,
                        "minimizable":false,
                        "close": function () {
                        }
                    });
                    newWindow.show();
                };
                var node = link(scope);
                $("td:eq(0)", nRow).html(node);

                if (aData.name != "manage-aggr") {
                    var optTemplates = "<a href='javascript:void(0)'ng-click='addSlaExtra()'>"+($scope.i18n.cloud_term_manageTag_button || "管理标签")+"</a>"
                    scope.data = aData;
                    scope.addSlaExtra = function() {
                        createSlaExtraWindow(aData.id);
                    };
                    var optDom = $compile($(optTemplates))(scope);
                    $("td:eq(5)", nRow).html(optDom);
                }
            }
        };

        $scope.operator = {
            "queryAggregates": function () {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-aggregates",
                        o: {"redirect_address_id": $scope.serviceID, "tenant_id": $scope.projectId}},
                    "userId": user.id,
                    "token": $scope.token
                });
                deferred.done(function (data) {
                    $scope.$apply(function () {
                        if (data && data.aggregates) {
                            var aggregates = data.aggregates;
                            for(var index  in aggregates){
                                aggregates[index].created_at = aggregates[index].created_at ? CommonService.utc2Local(aggregates[index].created_at) : "";
                                aggregates[index].updated_at = aggregates[index].created_at ? CommonService.utc2Local(aggregates[index].updated_at) : "";
                            }

                            $scope.aggregateTable.data = aggregates;

                        }
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },

            "action": function (type, id) {
                var deferred = camel.get({
                    "url": {"s": "/goku/rest/v1.5/token"},
                    "params": {"user-id": user.id},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if (data === undefined) {
                        return;
                    }
                    $scope.token = data.id;
                    $scope.projectId = data.projectId;
                    if (type === "query") {
                        $scope.operator.queryAggregates();
                    }
                });

                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },
            "init": function () {
                var deferred = camel.get({
                    "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if (data === undefined || data.endpoint === undefined) {
                        return;
                    }

                    for (var index in data.endpoint) {
                        var regionName = data.endpoint[index].regionName;
                        if (data.endpoint[index].regionName === $stateParams.region &&
                            data.endpoint[index].serviceName === "nova") {
                            $scope.serviceID = data.endpoint[index].id;
                            break;
                        }
                    }

                    // 打开时请求数据
                    if ($scope.serviceID) {
                        $scope.operator.action("query",null);
                    }
                });
            }
        };
        //获取初始虚拟机列表
        $scope.operator.init();
    }];

    return hostCtrl;
});