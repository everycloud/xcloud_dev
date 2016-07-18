/* global define */
define(["sprintf",
    "language/keyID",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "app/services/messageService",
    "app/services/exceptionService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/order/orderService",
    "app/services/commonService",
    "tiny-lib/encoder",
    "ui-router/angular-ui-router",
    "fixtures/sspFixture"
], function (sprintf,keyIDI18n, $, angular, _, layout, Window, Checkbox, messageService, exception, catalogService, orderService, commonService) {
    "use strict";

    var catalogCtrl = ["$rootScope", "$scope", "$state", "$stateParams", "$compile", "$q", "camel", "exception",
        function ($rootScope, $scope, $state, $stateParams, $compile, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;
            var instanceId = $stateParams.instanceId;
            // 公共服务和参数
            var status = $stateParams.status;
            var messageIns = new messageService();
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var orderServiceIns = new orderService(exception, $q, camel);
            var user = $rootScope.user;

            //搜索框中的字符串
            $scope.searchString = "";
            $scope.status = (status!=="normal" && status!=="expired" && status!=="providing") ? "" : status;

            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            // 按状态过滤
            $scope.searchStatus = {
                id: "serviceMyServiceSearchStatus",
                width: "200",
                "values": [{
                    selectId: " ",
                    label: i18n.common_term_allStatus_value,
                    checked: status!=="normal" && status!=="expired" && status!=="providing"
                }, {
                    selectId: "normal",
                    label: i18n.common_term_natural_value,
                    checked: status==="normal"
                }, {
                    selectId: "expired",
                    label: i18n.common_term_overdue_label,
                    checked: status==="expired"
                }, {
                    selectId: "providing",
                    label: i18n.common_term_providing_value,
                    checked: status==="providing"
                }],
                "change": function () {
                    page.currentPage = 1;
                    $scope.status = $.trim($("#" + $scope.searchStatus.id).widget().getSelectedId());
                    $scope.operate.queryInstances();
                }
            };

            // 搜索框
            $scope.searchBox = {
                "id": "serviceMyServiceSearchBox",
                "placeholder": i18n.service_term_findServiceNameID_prom,
                "width": "250",
                "maxLength": 64,
                "search": function (content) {
                    page.currentPage = 1;
                    $scope.searchString = content;
                    $scope.operate.queryInstances();
                }
            };

            // 刷新
            $scope.refresh = {
                "id": "serviceMyServiceRefresh",
                "click": function () {
                    $scope.operate.queryInstances();
                }
            };

            $scope.help = {
                "helpKey": "drawer_sc_my_instance",
                "show": false,
                "i18n": $scope.urlParams.lang,//"zh",
                "click": function () {
                    $scope.help.show = true;
                }
            };

            // 表格
            $scope.myServices = {
                "id": "serviceMyServiceTable",
                "showDetails": true,
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "totalRecords": 0,
                "displayLength": 10,
                "visibility": {
                    "activate": "click",
                    "aiExclude": [0, 6],
                    "bRestore": false,
                    "fnStateChange": function (index, state) {
                        var value = $scope.myServices.data;
                        $scope.$apply(function(){
                            $scope.myServices.data = value.concat();
                        });
                    }
                },
                "columns": [{
                        "sTitle": "",
                        "mData": "",
                        "bSortable": false,
                        "sWidth": "60px"
                    },{
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bVisible": false,
                        "bSortable": false
                    },{
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },{
                        "sTitle": i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusView);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_provideTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                         },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_overdueTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.expireTime);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    }
                ],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.operate.queryInstances();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.operate.queryInstances();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //下钻时传递参数
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                    });

                    // 操作
                    if (aData.status === "normal" || aData.status === "expired") {
                        var opt = "<div>";
                        if (aData.expireTime === i18n.common_term_neverExpires_label) {
                            opt += "<span>" + i18n.service_term_delay_label + "</span>";
                        } else {
                            opt += "<a class='btn-link' ng-click='extend()'>" + i18n.service_term_delay_label + "</a>";
                        }
                        opt += "<a class='margin-left-beautifier btn-link' ng-click='release()'>" + i18n.common_term_delete_button + "</a></div>";

                        var optLink = $compile(opt);
                        var optScope = $scope.$new();
                        optScope.extend = function () {
                            $scope.operate.extendInstance(aData.id, aData.expireTime);
                        };
                        optScope.release = function () {
                            var msg = i18n.service_service_delServiceInstance_info_confirm_msg;
                            // 删除VDC时要 给出对应的详细提示
                            if(aData.instanceUrls && aData.instanceUrls.modifyApplyUrl && aData.instanceUrls.modifyApplyUrl.indexOf("changeVdc") >= 0){
                                msg = i18n.org_vdc_delSC_info_confirm_msg || "删除VDC将导致该VDC内的用户和应用模板被删除，所有申请单不可用。确实要删除该VDC？";
                            }
                            messageIns.confirmMsgBox({
                                "content": msg,
                                "callback": function () {
                                    $scope.operate.releaseInstance(aData.id);
                                }
                            });
                        };
                        var optNode = optLink(optScope);
                        $("td[tdname='6']", nRow).append(optNode);
                    }
                }
            };

            // 状态字符串转换
            var statusStrMap = {
                "normal": i18n.common_term_natural_value,
                "expired": i18n.common_term_overdue_label,
                "providing": i18n.common_term_providing_value
            };

            $scope.operate = {
                // 查询我的服务列表
                "queryInstances": function () {
                    var options = {
                        "user": user,
                        "searchString": $scope.searchString,
                        "userId" : user.id,
                        "status": $scope.status,
                        "start": page.getStart(),
                        "limit": page.displayLength
                    };
                    var deferred = catalogServiceIns.queryServiceInstances(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        var serviceInstances = data.serviceInstances;
                        if (serviceInstances && serviceInstances.length > 0) {
                            _.each(serviceInstances, function (item, index) {
                                _.extend(item, {
                                    "detail": {
                                        contentType: "url",
                                        content: "app/business/ssp/views/catalog/instance/instanceDetail.html"
                                    },
                                    "statusView": statusStrMap[item.status] || i18n.common_term_other_label,
                                    "createTime": commonService.utc2Local(item.createTime),
                                    "expireTime": item.expireTime === "0" ? i18n.common_term_neverExpires_label : commonService.utc2Local(item.expireTime)
                                });
                            });
                        }
                        $scope.myServices.data = serviceInstances;
                        $scope.myServices.totalRecords = data.total;
                        $scope.myServices.displayLength = page.displayLength;
                    });
                },

                // 延期
                "extendInstance": function (id, expireTime) {
                    var winParam = {
                        needRefresh: false,
                        instanceId: id,
                        expireTime: expireTime
                    };

                    var options = {
                        "winId": "sspExtendInstanceWinId",
                        "winParam": winParam,
                        "title": i18n.service_term_delay_label,
                        "width": "400px",
                        "height": "280px",
                        "content-type": "url",
                        "content": "app/business/ssp/views/catalog/instance/extendInstance.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                $state.go("ssp.order.apply");
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                },

                // 释放
                "releaseInstance": function (instanceId) {
                    var options = {
                        "user": user,
                        "params": {
                            "release": {
                                "serviceInstanceId": instanceId
                            }
                        }
                    };
                    var deferred = orderServiceIns.createOrder(options);
                    deferred.then(function (data) {
                        $state.go("ssp.order.apply");
                    });
                }
            };

            function initLayout() {
                var lay = new layout({
                    "id": "serviceCatalogLayoutId",
                    "subheight": 108
                });
                var first = $("#serviceCatalogLayoutId .tiny-layout-west a").eq(0);
                if (first && first.length > 0) {
                    lay.opActive(first);
                }
            }
            function init() {
                if(instanceId){
                    setTimeout(function(){
                        $("#" + $scope.searchBox.id).widget().setValue(instanceId);
                    });
                }
            }
            //初始化页面
            $scope.$on("$viewContentLoaded", function () {
                init();
                $scope.searchString = instanceId;
                $scope.operate.queryInstances();
                initLayout();
            });
        }
    ];

    return catalogCtrl;
});
