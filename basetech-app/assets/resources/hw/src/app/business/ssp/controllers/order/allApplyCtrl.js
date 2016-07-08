/* global define */
define(["sprintf",
        "language/keyID",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        "tiny-lib/encoder",
        "app/business/ssp/services/order/orderService",
        "app/services/messageService",
        "app/services/commonService",
        "tiny-directives/Textbox",
        "tiny-directives/Table",
        "fixtures/sspFixture"
    ],
    function (sprintf,keyIDI18n,$, angular, _, Window, encoder, orderService, messageService, timeCommonService) {
        "use strict";

        var serviceOrderApplyCtrl = ["$rootScope", "$scope", "$compile", "$q", "$state", "camel", "exception",
            function ($rootScope, $scope, $compile, $q, $state, camel, exception) {

                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n  = $scope.i18n;

                // 当前用户
                var user = $rootScope.user;
                var orderServiceImpl = new orderService(exception, $q, camel);
                var messageServiceImpl = new messageService();
                var order_id = "";

                //查询条件
                var condition = {
                    "order-id": "",
                    "status": "",
                    "search-input": "",
                    "type": "",
                    "start": "0",
                    "limit": "10"
                };

                $scope.searchStatus = {
                    "id": "serviceOrderAllApplySearchStatus",
                    "width": "100",
                    "values": [{
                        "selectId": "",
                        "label": i18n.common_term_allStatus_value,
                        "checked": true
                    }, {
                        "selectId": "handling",
                        "label": i18n.common_term_processing_value
                    }, {
                        "selectId": "initialize",
                        "label": i18n.service_term_waitSubmit_label
                    }, {
                        "selectId": "approving",
                        "label": i18n.service_term_waitApproval_label
                    }, {
                        "selectId": "processing",
                        "label": i18n.common_term_implementing_value
                    }, {
                        "selectId": "succeed",
                        "label": i18n.common_term_success_value
                    }, {
                        "selectId": "partial-succeed",
                        "label": i18n.common_term_partSucceed_value
                    }, {
                        "selectId": "failed",
                        "label": i18n.common_term_fail_label
                    }, {
                        "selectId": "rejected",
                        "label": i18n.service_term_refuseClose_button
                    }, {
                        "selectId": "canceled",
                        "label": i18n.common_term_undo_button
                    }],
                    "change": function () {
                        condition.status = $("#serviceOrderAllApplySearchStatus").widget().getSelectedId();
                        $scope.operate.getAllApply();
                    }
                };

                $scope.searchType = {
                    "id": "serviceOrderApplySearchType",
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
                        "selectId": "modify",
                        "label": i18n.common_term_change_label
                    }, {
                        "selectId": "release",
                        "label": i18n.common_term_delete_button
                    }],
                    "change": function () {
                        condition.type = $("#serviceOrderApplySearchType").widget().getSelectedId();
                        $scope.operate.getAllApply();
                    }
                };

                $scope.searchBox = {
                    "id": "serviceOrderApplySearchBox",
                    "placeholder": i18n.service_term_findApplyNumServiceName_prom,
                    "width": "300",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchString) {
                        condition["search-input"] = searchString;
                        $scope.operate.getAllApply();
                    }
                };

                $scope.refresh = {
                    "id": "serviceOrderApplyRefresh",
                    "click": function () {
                        $scope.operate.getAllApply();
                    }
                };

                $scope.help = {
                    "helpKey": "drawer_sc_all_app",
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

                $scope.applys = {
                    "id": "serviceOrderAllApplyTable",
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
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.orderId);
                        },
                        "sWidth": "250px"
                    }, {
                        "sTitle": i18n.service_term_serviceName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.orderName);
                        }
                    }, {
                        "sTitle": i18n.common_term_applyBy_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userName);
                        }
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "statusView"
                    }, {
                        "sTitle": i18n.common_term_type_label,
                        "mData": "typeView"
                    }, {
                        "sTitle": i18n.common_term_submitTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.submitTime);
                        }
                    }],
                    "data": null,
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operate.getAllApply();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
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
                            $state.go(aData.approveUrl, {
                                "action": "view",
                                "serviceId": aData.serviceOffingId,
                                "orderId": aData.orderId
                            });
                        };
                        var orderIdNode = orderIdLink(orderIdScope);
                        $("td:eq(1)", nRow).html(orderIdNode);
                    }
                };

                $scope.operate = {
                    "getAllApply": function () {
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
                                        "typeView": orderServiceImpl.typeViewStr[item.type],
                                        "submitTime": timeCommonService.utc2Local(item.submitTime)
                                    });
                                });
                            }
                            $scope.applys.data = orders;
                            $scope.applys.totalRecords = data.total;
                            $scope.applys.displayLength = page.displayLength;
                            $("#serviceOrderAllApplyTable").widget().option("cur-page", {
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
                            $scope.operate.getMyApply();
                        });
                    }
                };

                function init() {
                    $scope.operate.getAllApply();
                }

                //初始化页面
                init();

            }
        ];

        return serviceOrderApplyCtrl;
    }
);
