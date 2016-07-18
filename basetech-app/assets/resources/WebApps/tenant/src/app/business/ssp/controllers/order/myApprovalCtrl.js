/* global define */
define(["sprintf",
        "language/keyID",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-directives/Textbox",
        "tiny-widgets/Window",
        "app/business/ssp/services/order/orderService",
        "app/services/messageService",
        "app/services/commonService",
        "tiny-lib/encoder",
        "tiny-directives/Table",
        "fixtures/sspFixture"
    ],
    function (sprintf,keyIDI18n,$, angular, _, TextBox, Window, orderService, messageService, timeCommonService) {
        "use strict";

        var serviceApprovalApplyCtrl = ["$scope", "$compile", "$q", "$state", "camel", "exception",
            function ($scope, $compile, $q, $state, camel, exception) {
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n  = $scope.i18n;

                var user = $("html").scope().user;
                var orderServiceImpl = new orderService(exception, $q, camel);
                var messageServiceImpl = new messageService();
                var order_id = "";

                //查询条件
                var condition = {
                    "handle-user-id": user.id,
                    "order-id": "",
                    "status": "approving",
                    "search-input": "",
                    "type": "",
                    "start": "0",
                    "limit": "10"
                };

                $scope.searchType = {
                    "id": "serviceApprovalApplySearchType",
                    "width": "100",
                    "values": [{
                        "selectId": "",
                        "label": i18n.common_term_allType_label,
                        "checked": true
                    }, {
                        "selectId": "apply",
                        "label": i18n.common_term_apply_button
                    }, {
                        "selectId": "extend",
                        "label": i18n.service_term_delay_label
                    }, {
                        "selectId": "change",
                        "label": i18n.common_term_change_label
                    }],
                    "change": function () {
                        condition.type = $("#serviceApprovalApplySearchType").widget().getSelectedId();
                        $scope.operate.getMyApprovals();
                    }
                };

                $scope.searchBox = {
                    "id": "serviceApprovalApplySearchBox",
                    "placeholder": i18n.service_term_findApplyNumServiceName_prom,
                    "width": "300",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (content) {
                        condition["search-input"] = content;
                        $scope.operate.getMyApprovals();
                    }
                };

                $scope.refresh = {
                    "id": "serviceApprovalApplyRefresh",
                    "click": function () {
                        $scope.operate.getMyApprovals();
                    }
                };

                $scope.help = {
                    "helpKey": "drawer_sc_to_do_list",
                    "show": false,
                    "i18n": $scope.urlParams.lang,//"zh",
                    "click": function () {
                        $scope.help.show = true;
                    }
                };

                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.approvals = {
                    "id": "serviceApprovalApplyTable",
                    "paginationStyle": "full_numbers",
                    "displayLength": 10,
                    "lengthMenu": [10, 20, 30],
                    "totalRecords": 0,
                    "columns": [{
                        "sTitle": "",
                        "sWidth": "60px",
                        "mData": function (data) {
                            return "<img src='" + $.encoder.encodeForHTML(data.imageUrl) + "' style='margin:3px 0;'/>";
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_applySN_label,
                        "sWidth": "250px",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.orderId);
                        }
                    }, {
                        "sTitle": i18n.service_term_serviceName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.orderName);
                        }
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "statusView"
                    }, {
                        "sTitle": i18n.common_term_type_label,
                        "mData": "typeView"
                    }, {
                        "sTitle": i18n.common_term_submitBy_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userName);
                        }
                    }, {
                        "sTitle": i18n.common_term_submitTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.submitTime);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "opts",
                        "bSortable": false
                    }],
                    "data": null,
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operate.getMyApprovals();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operate.getMyApprovals();
                    },

                    "renderRow": function (nRow, aData, iDataIndex) {
                        //tips提示
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        $("td:eq(6)", nRow).addTitle();

                        if (aData.status === "approving") {
                            // 操作列
                            var optColumn = "<a class='btn-link' ng-click='approval()'>" + i18n.common_term_approve_button + "</a>";
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.approval = function () {
                                $state.go(aData.approveUrl, {
                                    "action": "approval",
                                    "serviceId": aData.serviceOffingId,
                                    "orderId": aData.orderId
                                });
                            };

                            var optNode = optLink(optScope);
                            $("td:eq(7)", nRow).html(optNode);
                        }
                    }
                };

                //转换类型字符串
                $scope.typeViewStr = {
                    "apply": i18n.common_term_apply_button,
                    "extend": i18n.service_term_delay_label,
                    "modify": i18n.common_term_change_label,
                    "release": i18n.common_term_delete_button
                };

                $scope.operate = {
                    "getMyApprovals": function () {
                        condition.start = page.getStart();
                        condition.limit = page.displayLength;
                        var param = {
                            "user": user,
                            "params": condition
                        };
                        var deferred = orderServiceImpl.queryOrders(param);
                        deferred.then(function (data) {
                            if (!data || !data.orders) {
                                return;
                            }
                            //替换状态和类型为中文
                            var orders = data.orders;
                            if (orders && orders.length > 0) {
                                _.each(orders, function (item) {
                                    _.extend(item, {
                                        "statusView": orderServiceImpl.statusViewStr[item.status],
                                        "typeView": $scope.typeViewStr[item.type],
                                        "submitTime": timeCommonService.utc2Local(item.submitTime)
                                    });
                                });
                            }

                            $scope.approvals.data = data.orders;

                            $scope.approvals.totalRecords = data.total;
                            $scope.approvals.displayLength = page.displayLength;
                            $("#serviceApprovalApplyTable").widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });
                    },
                    "actionOrder": function (approve) {
                        var param = {
                            "id": order_id,
                            "user": user,
                            "approve": approve
                        };
                        var deferred = orderServiceImpl.actionOrder(param);
                        deferred.then(function (data) {
                            $scope.operate.getMyApprovals();
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
