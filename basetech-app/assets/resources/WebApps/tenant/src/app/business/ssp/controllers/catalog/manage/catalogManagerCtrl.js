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
    "app/services/tipMessageService",
    'app/services/exceptionService',
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/order/orderService",
    "tiny-lib/encoder",
    "ui-router/angular-ui-router",
    "fixtures/sspFixture"
], function (sprintf,keyIDI18n,$, angular, _, layout, Window, Checkbox, messageService,tipMessageService, exception, catalogService, orderService) {
    "use strict";

    var catalogCtrl = ["$rootScope", "$scope", "$state", "$compile", "$q", "camel", "exception",
        function ($rootScope, $scope, $state, $compile, $q, camel, exception) {

            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            // 公共服务和参数
            var messageIns = new messageService();
            var tipMessage = new tipMessageService();
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var orderServiceIns = new orderService(exception, $q, camel);
            var user = $rootScope.user;
            var CATALOG_OPERATE = "319002";
            $scope.hasCatalogOperateRight = _.contains(user.privilegeList, CATALOG_OPERATE);

            //搜索框中的字符串
            $scope.searchString = "";

            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 6,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.createBtn = {
                "id": "serviceCatalogManagerCreate",
                "text": i18n.service_term_createCatalog_button,
                "click": function () {
                    $scope.operate.createInstance();
                }
            };

            $scope.saveSequenceBtn = {
                id : "serviceCatalogSaveSequence",
                text : i18n.service_term_saveOrder_button,
                click : function(){
                    $scope.operate.saveSequence();
                }
            };

            // 搜索框
            $scope.searchBox = {
                "id": "serviceCatalogManagerSearchBox",
                "placeholder": i18n.common_term_findName_prom,
                "width": "250",
                "maxLength": 64,
                "search": function (content) {
                    page.currentPage = 1;
                    $scope.searchString = content;
                    $scope.operate.queryCatalogs();
                }
            };

            // 刷新
            $scope.refresh = {
                "id": "serviceCatalogManagerRefresh",
                "click": function () {
                    $scope.operate.queryCatalogs();
                }
            };

            $scope.help = {
                "helpKey": "drawer_sc_catalog",
                "show": false,
                "i18n": $scope.urlParams.lang,//"zh",
                "click": function () {
                    $scope.help.show = true;
                }
            };

            // 表格
            $scope.catalogs = {
                "id": "serviceMyServiceTable",
                "page": false,
                "displayLength": 10,
                "columns": [
                    {
                        "sTitle": i18n.service_term_directoryID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    }
                ],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    // tips
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();

                    if ($scope.hasCatalogOperateRight) {
                        // 操作
                        var opt = "<div>" +
                            "<a href='javascript:void 0;' class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a>" +
                            "<a href='javascript:void 0;' class='margin-left-beautifier btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a>" +
                            "<a href='javascript:void 0;' class='reorder' ng-class='{\"reorder-up\":(!!orderIndex),\"reorder-up-disabled\":(!orderIndex)}' ng-click='up(orderIndex)'></a>" +
                            "<a href='javascript:void 0;' class='reorder'  ng-class='{\"reorder-down\":(!isLast),\"reorder-down-disabled\":isLast}' ng-click='down(orderIndex)'></a>" +
                            "</div>";
                        var optLink = $compile(opt);
                        var optScope = $scope.$new();
                        optScope.orderIndex = iDataIndex;
                        optScope.isLast = iDataIndex === $scope.catalogs.data.length - 1;
                        optScope.modify = function () {
                            $scope.operate.modifyInstance(aData.id);
                        };
                        optScope["delete"] = function () {
                            messageIns.confirmMsgBox({
                                "content": i18n.service_catalog_delCatalog_info_confirm_msg,
                                "callback": function () {
                                    $scope.operate.deleteInstance(aData.id);
                                }
                            });
                        };
                        optScope.up = function() {
                            if (iDataIndex === 0) {
                                return;
                            }
                            var catalogs = [];
                            _.each($scope.catalogs.data, function (item, index) {
                                catalogs.push(item);
                            });
                            catalogs[iDataIndex - 1] = $scope.catalogs.data[iDataIndex];
                            catalogs[iDataIndex] = $scope.catalogs.data[iDataIndex - 1];
                            $scope.catalogs.data = catalogs;
                        };
                        optScope.down = function() {
                            if (iDataIndex === $scope.catalogs.data.length - 1) {
                                return;
                            }
                            var catalogs = [];
                            _.each($scope.catalogs.data, function (item, index) {
                                catalogs.push(item);
                            });
                            catalogs[iDataIndex + 1] = $scope.catalogs.data[iDataIndex];
                            catalogs[iDataIndex] = $scope.catalogs.data[iDataIndex + 1];
                            $scope.catalogs.data = catalogs;
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).append(optNode);
                    }
                }
            };

            $scope.operate = {
                "saveSequence" : function() {
                    var catalogSequences = [];
                    _.each($scope.catalogs.data, function (item, index) {
                        catalogSequences.push({"catalogId" : item.id, "sequence" : index});
                    });

                    var options = {
                        "user" : user,
                        "catalogSequences" : catalogSequences
                    };
                    var deferred = catalogServiceIns.saveSequence(options);
                    deferred.then(function (data) {
                        tipMessage.alert("success", i18n.common_term_operationSucceed_msg);
                    });
                },
                // 查询服务目录列表
                "queryCatalogs": function () {
                    var options = {
                        "user": user,
                        "name": $scope.searchString
                    };
                    var deferred = catalogServiceIns.queryCatalogs(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        var catalogInstances = data.catalogs;
                        $scope.catalogs.data = catalogInstances;
                    });
                },

                // 修改目录
                "modifyInstance": function (instanceId) {
                    var winParam = {
                        needRefresh: true,
                        title: i18n.service_term_modifyCatalog_button,
                        catalogId: instanceId
                    };
                    $scope.operate.showWindow(winParam);
                },
                //新增目录
                "createInstance": function () {
                    var winParam = {
                        needRefresh: true,
                        title: i18n.service_term_createCatalog_button
                    };
                    $scope.operate.showWindow(winParam);
                },
                "showWindow": function (winParam) {
                    var options = {
                        "winId": "serviceCatalogModifyWinId",
                        "winParam": winParam,
                        title: winParam.title,
                        width: "560px",
                        height: "250px",
                        "content-type": "url",
                        "content": "app/business/ssp/views/catalog/manage/addCatalog.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                $scope.operate.queryCatalogs();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                },

                // 删除
                "deleteInstance": function (instanceId) {
                    var options = {
                        "user": user,
                        "catalogId": instanceId
                    };
                    var deferred = catalogServiceIns.deleteCatalog(options);
                    deferred.then(function (data) {
                        $scope.operate.queryCatalogs();
                    });
                }
            };

            function initLayout() {
                var lay = new layout({
                    "id": "catalogManagerLayoutId",
                    "subheight": 108
                });
                var first = $("#catalogManagerLayoutId .tiny-layout-west a").eq(0);
                if (first && first.length > 0) {
                    lay.opActive(first);
                }
            }

            function init() {
                $scope.operate.queryCatalogs();
                initLayout();
            }

            //初始化页面
            init();
        }
    ];

    return catalogCtrl;
});
