/* global define */
define(["sprintf",
    "language/keyID",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "app/services/messageService",
    'app/services/exceptionService',
    "app/business/ssp/services/catalog/catalogService",
    "ui-router/angular-ui-router",
    "fixtures/sspFixture"
], function (sprintf,keyIDI18n,$, angular, _, layout, Window, message, exception, catalogService) {
    "use strict";

    var catalogCtrl = ["$rootScope", "$scope", "$state", "$q", "camel", "exception",
        function ($rootScope, $scope, $state, $q, camel, exception) {

            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            var user = $("html").scope().user;
            // 权限控制
            var SERVER_OPERATE = "307000";
            $scope.hasServerOperateRight = _.contains(user.privilegeList, SERVER_OPERATE);
            //异常框的服务实例
            var messageIns = new message();
            var catalogServiceIns = new catalogService(exception, $q, camel);
            $scope.user = $rootScope.user;

            //当前选中的服务目录
            $scope.current = {};

            //所有服务目录列表
            $scope.catalogs = [];

            //当前目录的所有服务列表
            $scope.services = [];

            //搜索框中的字符串
            $scope.searchString = "";

            //服务管理旁的创建按钮
            $scope.createBtn = {
                id: "catalogCreateBtn",
                text: i18n.common_term_create_button,
                "click": function () {
//                    $state.go("ssp.appCreateByTemplate.navigate");
                    $state.go("createCatalogModule");
                }
            };
            //申请按钮
            $scope.applyBtn = {
                id: "catalogApplyBtn",
                text: i18n.common_term_apply_button,
                "click": function (url, serviceId) {
                    $state.go(url, {
                        "serviceId": serviceId,
                        "action": "apply"
                    });
                }
            };
            //发布按钮
            $scope.publishBtn = {
                id: "catalogReleaseBtn",
                text: i18n.common_term_publish_button,
                "click": function (serviceId) {
                    messageIns.confirmMsgBox({
                        "content": i18n.service_service_publish_info_confirm_msg,
                        "callback": function () {
                            $scope.operate.publishService(serviceId);
                        }
                    });
                }
            };
            //编辑按钮
            $scope.modifyBtn = {
                id: "catalogModifyBtn",
                text: i18n.common_term_edit_label,
                "click": function (url, serviceId) {
                    $state.go("ssp.modifyApp", {
                        "action": "modify",
                        "id": serviceId
                    });
                }
            };
            //删除按钮
            $scope.deleteBtn = {
                id: "catalogDeleteBtn",
                text: i18n.common_term_delete_button,
                "click": function (serviceId) {
                    messageIns.confirmMsgBox({
                        "content": i18n.service_service_delService_info_confirm_msg,
                        "callback": function () {
                            $scope.operate.deleteService(serviceId);
                        }
                    });
                }
            };

            // 取消发布
            $scope.cancelPublishBtn = {
                id: "catalogCancelPublishBtn",
                text: i18n.common_term_canclePublish_button,
                "click": function (serviceId) {
                    messageIns.confirmMsgBox({
                        "content": i18n.service_service_dispublish_info_confirm_msg,
                        "callback": function () {
                            $scope.operate.cancelPublishService(serviceId);
                        }
                    });
                }
            };

            $scope.help = {
                "helpKey": "drawer_sc_service",
                "show": false,
                "i18n": $scope.urlParams.lang,//"zh",
                "click": function () {
                    $scope.help.show = true;
                }
            };

            // 选择一个服务目录
            $scope.select = function (id) {
                $scope.current = _.find($scope.catalogs, function (item) {
                    return item.id === id;
                });

                page.currentPage = 1;
                page.displayLength = 10;
                $scope.searchString = "";

                $("#serviceCatalogSearchBox").widget().setValue("");
                $("#serviceCatalogPagination").widget().option("display-length", page.displayLength);
                $("#serviceCatalogPagination").widget().option("cur-page", {
                    "pageIndex": page.currentPage
                });
            };

            $scope.searchBox = {
                "id": "serviceCatalogSearchBox",
                "placeholder": i18n.service_term_findServiceNameID_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {},
                "search": function (content) {
                    page.currentPage = 1;
                    $scope.searchString = content;
                    $scope.operate.queryCatalogServices();
                    $("#serviceCatalogPagination").widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });
                }
            };

            $scope.refresh = {
                "id": "serviceCatalogRefresh",
                "click": function () {
                    $scope.operate.queryCatalogServices();
                }
            };

            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    if (page.currentPage === 0) {
                        return 0;
                    } else {
                        return (page.currentPage - 1) * page.displayLength;
                    }
                }
            };

            //翻页条
            $scope.pagination = {
                "id": "serviceCatalogPagination",
                "type": "full_numbers",
                "prevText": i18n.common_term_previous_button,
                "nextText": i18n.common_term_next_button,
                "lengthOptions": [10, 20, 30],
                "lengthMenu": [10, 20, 30],
                "displayLength": 10,
                "curPage": {
                    "pageIndex": 1
                },
                "totalRecords": 0,
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.operate.queryCatalogServices();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.operate.queryCatalogServices();
                }
            };

            $scope.operate = {
                //获取服务目录列表
                "queryCatalogs": function () {
                    var retDefer = $q.defer();
                    var options = {
                        "user": $scope.user
                    };
                    var deferred = catalogServiceIns.queryCatalogs(options);
                    deferred.then(function (data) {
                        var all = [{
                            "id": null,
                            "name": i18n.common_term_allService_label,
                            "description": i18n.service_service_view_explan_eCommerce_label
                        }];
                        if (data && data.catalogs && data.catalogs.length > 0) {
                            all = all.concat(data.catalogs);
                        }
                        $scope.catalogs = all;
                        $scope.select(all[0].id);
                        retDefer.resolve(data);
                    }, function (data) {
                        retDefer.resolve(null);
                    });
                    return retDefer.promise;
                },

                //获取指定目录的服务列表（包括分页，搜索、刷新）
                "queryCatalogServices": function () {
                    var options = {
                        "user": $scope.user,
                        "searchString": $scope.searchString,
                        "start": page.getStart(),
                        "limit": page.displayLength
                    };
                    if ($scope.current.id) {
                        options.catalogId = $scope.current.id;
                    }
                    var deferred = catalogServiceIns.queryCatalogServices(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.services = data.services;
                        $scope.pagination.totalRecords = data.total;
                    });
                },

                // 激活(发布)服务
                "publishService": function (serviceId) {
                    var options = {
                        "user": $scope.user,
                        "serviceId": serviceId,
                        "modify": {
                            "status": "published"
                        }
                    };
                    var deferred = catalogServiceIns.operateServices(options);
                    deferred.then(function (data) {
                        $scope.operate.queryCatalogServices();
                    });
                },

                // 删除服务
                "deleteService": function (serviceId) {
                    var options = {
                        "user": $scope.user,
                        "serviceId": serviceId
                    };
                    var deferred = catalogServiceIns.deleteServices(options);
                    deferred.then(function (data) {
                        $scope.operate.queryCatalogServices();
                    });
                },

                // 取消发布服务
                "cancelPublishService": function (serviceId) {
                    var options = {
                        "user": $scope.user,
                        "serviceId": serviceId,
                        "modify": {
                            "status": "unpublished"
                        }
                    };
                    var deferred = catalogServiceIns.operateServices(options);
                    deferred.then(function (data) {
                        $scope.operate.queryCatalogServices();
                    });
                }
            };

            function initLayout() {
                var lay = new layout({
                    "id": "serviceCatalogLayoutId",
                    "subheight": 108
                });

                var first = $("#serviceCatalogLayoutId .tiny-layout-west li a").eq(0);
                if (first && first.length > 0) {
                    lay.opActive(first);
                }

                // button和layout样式冲突，需要去掉此样式
                $("#" + $scope.createBtn.id).removeClass("tiny-layout-a-current");
            }

            function init() {
                var deferred = $scope.operate.queryCatalogs();
                deferred.then(function (data) {
                    setTimeout(function () {
                        initLayout();
                    }, 10);
                });
            }

            //初始化页面
            init();
        }
    ];

    return catalogCtrl;
});
