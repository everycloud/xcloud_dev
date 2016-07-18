/* global define */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/service/services/order/orderService",
    "app/services/commonService"
],
    function ($, angular, _, OrderService, commonService) {
        "use strict";

        var serviceApprovalApplyCtrl = ["$scope", "$compile", "$q", "$state", "camel", "exception",
            function ($scope, $compile, $q, $state, camel, exception) {
                var i18n = $scope.i18n;
                var user = $scope.user;
                var orderService = new OrderService(exception, $q, camel);

                //查询条件
                var condition = {
                    "handle-user-id": user.id,
                    "status": "approving",
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
                var expect = {release:true};
                var type = orderService.getApplyType(expect);
                var status = orderService.getApplyStatus();

                $scope.searchType = {
                    "id": "serviceApprovalApplySearchType",
                    "width": "100",
                    "values": config2Values(type),
                    "change": function () {
                        condition.type = $("#" + $scope.searchType.id).widget().getSelectedId();
                        condition.start = 0;
                        $scope.operate.getMyApprovals();
                    }
                };
                $scope.searchBox = {
                    "id": "serviceApprovalApplySearchBox",
                    "placeholder": i18n.service_term_findApplyNumServiceName_prom || "请输入单号或服务名称",
                    "width": "200",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        condition["search-input"] = $.trim(searchString);
                        condition.start = 0;
                        $scope.operate.getMyApprovals();
                    }
                };

                $scope.refresh = {
                    "id": "serviceApprovalApplyRefresh",
                    "click": function () {
                        $scope.operate.getMyApprovals();
                    }
                };

                $scope.approvals = {
                    "id": "serviceApprovalApplyTable",
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
                            "sWidth": "250px",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.orderId);
                            }
                        },
                        {
                            "sTitle": i18n.service_term_serviceName_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.orderName);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusText);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_type_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.typeText);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_submitBy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.userName);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_submitTime_label,
                            "sWidth": "150px",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.submitTimeText);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opts",
                            "sClass":"operate",
                            "bSortable": false
                        }
                    ],
                    "data": [],
                    "callback": function (evtObj) {
                        condition.start = (evtObj.currentPage - 1) * evtObj.displayLength;
                        condition.limit = evtObj.displayLength;
                        $scope.operate.getMyApprovals();
                    },
                    "changeSelect": function (evtObj) {
                        condition.start = (evtObj.currentPage - 1) * evtObj.displayLength;
                        condition.limit = evtObj.displayLength;
                        $scope.operate.getMyApprovals();
                    },

                    "renderRow": function (nRow, aData, iDataIndex) {
                        //tips提示
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        $("td:eq(6)", nRow).addTitle();

                        if (aData.status === "approving") {
                            // 操作列
                            var optColumn = "<a class='btn-link' ng-click='approval()'>" + i18n.common_term_approve_button + "</a>";
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.approval = function () {
                                $state.go("service.order.approvalVDC", {
                                    "action": aData.type,
                                    "serviceId": aData.serviceOffingId,
                                    "orderId": aData.orderId
                                });
                                $scope.operate.getMyApprovals();
                            };

                            var optNode = optLink(optScope);
                            $("td.operate", nRow).html(optNode);
                        }
                    }
                };

                $scope.operate = {
                    "getMyApprovals": function () {
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
                            $scope.approvals.data = orders;
                            $scope.approvals.totalRecords = data.total;
                            $scope.approvals.displayLength = condition.limit;
                            $scope.approvals.curPage = {
                                pageIndex: condition.start / condition.limit - 1
                            };
                        });
                    }
                };

                function init() {
                    $scope.operate.getMyApprovals();
                }

                //页面初始化方法
                init();
            }
        ];

        return serviceApprovalApplyCtrl;
    }
);
