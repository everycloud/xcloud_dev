/* global define */
define(["sprintf",
        "language/keyID",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        "app/business/ssp/services/order/orderService",
        "app/services/messageService",
        "app/services/commonService",
        "tiny-lib/encoder",
        "tiny-directives/Textbox",
        "tiny-directives/Table",
        "fixtures/sspFixture"
    ],
    function (sprintf,keyIDI18n,$, angular, _, Window, orderService, messageService, timeCommonService) {
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
                    "user-id": user.id,
                    "order-id": "",
                    "search-input": "",
                    "status": "",
                    "type": "",
                    "start": "0",
                    "limit": "10"
                };

                $scope.searchStatus = {
                    "id": "serviceOrderApplySearchStatus",
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
                        condition.status = $("#serviceOrderApplySearchStatus").widget().getSelectedId();
                        $scope.operate.getMyApply();
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
                        $scope.operate.getMyApply();
                    }
                };

                $scope.searchBox = {
                    "id": "serviceOrderApplySearchBox",
                    "placeholder": i18n.service_term_findApplyNumServiceName_prom,
                    "width": "300",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        condition["search-input"] = searchString;
                        $scope.operate.getMyApply();
                    }
                };

                $scope.refresh = {
                    "id": "serviceOrderApplyRefresh",
                    "click": function () {
                        $scope.operate.getMyApply();
                    }
                };

                $scope.help = {
                    "helpKey": "drawer_sc_my_app",
                    "show": false,
                    "i18n": $scope.urlParams.lang,
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
                    "id": "serviceOrderApplyTable",
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
                        $scope.operate.getMyApply();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operate.getMyApply();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //tips提示
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();

                        // 操作列
                        var optColumn = "";

                        if (aData.status === "initialize") {
                            optColumn += "<a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a> ";
                            optColumn += "<a class='btn-link' ng-click='close()'>" + i18n.common_term_undo_button + "</a> ";
                        }

                        var optLink = $compile($(optColumn));
                        var optScope = $scope.$new();

                        optScope.modify = function () {
                            $state.go(aData.applyUrl, {
                                "action": "edit",
                                "orderId": aData.orderId,
                                "serviceId": aData.serviceOffingId
                            });
                        };
                        optScope.close = function () {
                            order_id = aData.orderId;
                            messageServiceImpl.confirmMsgBox({
                                "content": i18n.service_service_drawBack_info_confirm_msg,
                                "callback": function () {
                                    $scope.operate.actionOrder({
                                        "action": "cancel"
                                    });
                                }
                            });
                        };

                        var optNode = optLink(optScope);
                        $("td:eq(6)", nRow).html(optNode);

                        //需要显示详情
                        var orderIdColumn = "<a class='btn-link' ng-click='detail()'>" + $.encoder.encodeForHTML(aData.orderId) + "</a> ";
                        var orderIdLink = $compile($(orderIdColumn));
                        var orderIdScope = $scope.$new();
                        orderIdScope.detail = function () {
                            $state.go(aData.approveUrl, {
                                "action": "view",
                                "from" : "myApply",
                                "serviceId": aData.serviceOffingId,
                                "orderId": aData.orderId
                            });
                        };
                        var orderIdNode = orderIdLink(orderIdScope);
                        $("td:eq(1)", nRow).html(orderIdNode);
                    }
                };

                $scope.operate = {
                    "getMyApply": function () {
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
                            $("#serviceOrderApplyTable").widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });
                    },
                    "actionOrder": function (param) {
                        var options = {
                            "id": order_id,
                            "user": user,
                            "params": param
                        };
                        var deferred = orderServiceImpl.userActionOrder(options);
                        deferred.then(function (data) {
                            $scope.operate.getMyApply();
                        });
                    }
                };

                function init() {
                    $scope.operate.getMyApply();
                }

                //初始化页面
                init();
            }
        ];

        return serviceOrderApplyCtrl;
    }
);
