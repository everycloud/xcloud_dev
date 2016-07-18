/* global define */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/service/services/order/orderService",
    "app/services/commonService"
],
    function ($, angular, _, OrderService, commonService) {
        "use strict";

        var serviceOrderApplyCtrl = ["$scope", "$compile", "$q", "$state", "camel", "exception",
            function ($scope, $compile, $q, $state, camel, exception) {
                var i18n = $scope.i18n;
                var user = $scope.user;
                var orderService = new OrderService(exception, $q, camel);

                //查询条件
                var condition = {
                    "status": "",
                    "search-input": "",
                    "type": "",
                    "start": 0,
                    "limit": commonService.DEFAULT_TABLE_PAGE_LENGTH
                };
                var config2Values = function (config) {
                    var values = [];
                    for (var key in config) {
                        var item = config[key];
                        values.push({
                            selectId: item.key,
                            label: item.text,
                            checked: item.checked
                        });
                    }
                    return values;
                };
                var expect = {};
                var status = orderService.getApplyStatus();
                var type = orderService.getApplyType(expect);

                $scope.searchStatus = {
                    "id": "serviceOrderAllApplySearchStatus",
                    "width": "100",
                    "values": config2Values(status),
                    "change": function () {
                        condition.status = $("#" + $scope.searchStatus.id).widget().getSelectedId();
                        condition.start = 0;
                        $scope.operate.getAllApply();
                    }
                };

                $scope.searchType = {
                    "id": "serviceOrderApplySearchType",
                    "width": "100",
                    "values": config2Values(type),
                    "change": function () {
                        condition.type = $("#" + $scope.searchType.id).widget().getSelectedId();
                        condition.start = 0;
                        $scope.operate.getAllApply();
                    }
                };

                $scope.searchBox = {
                    "id": "serviceOrderApplySearchBox",
                    "placeholder": i18n.service_term_findApplyNumServiceName_prom || "请输入单号或服务名称",
                    "width": "200",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        condition["search-input"] = $.trim(searchString);
                        condition.start = 0;
                        $scope.operate.getAllApply();
                    }
                };

                $scope.refresh = {
                    "id": "serviceOrderApplyRefresh",
                    "click": function () {
                        $scope.operate.getAllApply();
                    }
                };

                $scope.applys = {
                    "id": "serviceOrderAllApplyTable",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "totalRecords": 0,
                    "columns": [
                        {
                            "sTitle": "",
                            "sWidth": "60px",
                            "mData": function (data) {
                                return "<img src='" + $.encoder.encodeForHTML(data.imageUrl) + "' style='margin:3px 0;'/>";
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_applySN_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.orderId);
                            },
                            "sClass": "detail",
                            "sWidth": "250px"
                        },
                        {
                            "sTitle": i18n.service_term_serviceName_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.orderName);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_applyBy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.userName);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_status_label,
                            "mData": "statusText"
                        },
                        {
                            "sTitle": i18n.common_term_type_label,
                            "mData": "typeText"
                        },
                        {
                            "sTitle": i18n.common_term_submitTime_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.submitTimeText);
                            }
                        }
                    ],
                    "data": [],
                    "callback": function (evtObj) {
                        condition.start = (evtObj.currentPage - 1) * evtObj.displayLength;
                        condition.limit = evtObj.displayLength;
                        $scope.operate.getAllApply();
                    },
                    "changeSelect": function (evtObj) {
                        condition.start = (evtObj.currentPage - 1) * evtObj.displayLength;
                        condition.limit = evtObj.displayLength;
                        $scope.operate.getAllApply();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //tips提示
                        $("td:eq(6)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();

                        //订单号列
                        var orderIdColumn = "<a class='btn-link' ng-click='detail()'>" + $.encoder.encodeForHTML(aData.orderId) + "</a> ";

                        var orderIdLink = $compile($(orderIdColumn));
                        var orderIdScope = $scope.$new();
                        orderIdScope.detail = function () {

                            $state.go("service.orderDetail", {
                                "orderId": aData.orderId
                            });
                        };
                        var orderIdNode = orderIdLink(orderIdScope);
                        $("td.detail", nRow).html(orderIdNode);
                    }
                };

                $scope.operate = {
                    "getAllApply": function () {
                        var deferred = orderService.queryOrders({
                            "user": user,
                            "params": condition
                        });
                        deferred.then(function (data) {
                            data = data || {total: 0, orders: []};
                            //替换状态和类型为中文
                            var orders = data.orders;
                            for (var i = 0, len = orders.length; i < len; i++) {
                                var item = orders[i];
                                item.statusText = (status[item.status] && status[item.status].text) || item.status;
                                item.typeText = (type[item.type] && type[item.type].text) || item.type;
                                item.submitTimeText = item.submitTime && commonService.utc2Local(item.submitTime);
                            }
                            $scope.applys.data = orders;
                            $scope.applys.totalRecords = data.total;
                            $scope.applys.displayLength = condition.limit;
                            $scope.applys.curPage = {
                                pageIndex: condition.start / condition.limit - 1
                            };
                        });
                    }
                };

                function init() {
                    $scope.operate.getAllApply();
                }

                init();
            }
        ];

        return serviceOrderApplyCtrl;
    }
);
