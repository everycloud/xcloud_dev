/**
 * Created by  on 14-1-24.
 */
define(["tiny-lib/angular",
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "app/services/messageService",
    "ui-router/angular-ui-router",
    "fixtures/serviceFixture"], function (angular, layout, Window, messageService) {
    "use strict";

    var catalogCtrl = ["$rootScope", "$scope", "$state", "camel", function ($rootScope, $scope, $state, camel) {
        //异常框的服务实例
        var messageServiceIns = new messageService();

        //当前选中的服务目录
        $scope.current = {
            "id": "",
            "name": ""
        };

        //所有服务目录列表
        $scope.catalogs = [];

        //当前目录的所有服务列表
        $scope.services = [];

        //搜索框中的字符串
        $scope.searchString = "";

        //服务管理旁的创建按钮
        $scope.createBtn = {
            id:"catalogCreateBtn",
            text:i18n.common_term_create_button||"创建",
            width:"50",
            "click":function(){
            }
        };
        //申请按钮
        $scope.moreBtn = {
            id:"catalogMoreBtn",
            text:i18n.common_term_apply_button||"申请",
            width:"50",
            "click":function(param){
                if(param == 0){
                    $state.go("service.catalogVm");
                }else{
                    $state.go("service.catalogApp");
                }
            }
        };
        $scope.select = function (id, name) {
            $scope.current.id = id;
            $scope.current.name = name;

            page.currentPage = 1;
            page.displayLength = 6;
            getCatalogServices(id);

            $scope.searchString = "";
            $("#serviceCatalogSearchBox").widget().setValue("");
            $("#serviceCatalogPagination").widget().option("display-length", page.displayLength);
            $("#serviceCatalogPagination").widget().option("cur-page", {"pageIndex": page.currentPage});
        };

        $scope.applyService = function (id, name, html, width, height) {
            var options = {
                "winId": "serviceCatalogApplyServiceWinId",
                "serviceId": id,
                title: i18n.common_term_application_label ||"申请"+"-" + name,
                width: width,
                height: height,
                "content-type": "url",
                "content": html,
                "buttons": null,
                "close": function (event) {
                }
            };
            var win = new Window(options);
            win.show();
        };

        $scope.searchBox = {
            "id": "serviceCatalogSearchBox",
            "placeholder": i18n.service_term_findServiceNameID_prom||"输入名称搜索",
            "width": "250",
            "suggest-size": 10,
            "maxLength": 64,
            "suggest": function (content) {
            },
            "search": function (searchString) {
                page.currentPage = 1;
                $scope.searchString = searchString;
                getCatalogServices($scope.current.id);
                $("#serviceCatalogPagination").widget().option("cur-page", {"pageIndex": page.currentPage});
            }
        };

        $scope.refresh = {
            "id": "serviceCatalogRefresh",
            "click": function () {
                getCatalogServices($scope.current.id);
            }
        };

        //当前页码信息
        var page = {
            "currentPage": 1,
            "displayLength": 6,
            "getStart": function () {
                if (page.currentPage == 0) {
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
            "prevText": i18n.common_term_previous_button||"上一页",
            "nextText": i18n.common_term_nextPage_button||"下一页",
            "lengthOptions": [6, 10, 20, 30, 50],
            "displayLength": 6,
            "curPage": {"pageIndex": 1},
            "totalRecords": 0,
            "callback": function (evtObj) {
                page.currentPage = evtObj.currentPage;
                page.displayLength = evtObj.displayLength;
                getCatalogServices($scope.current.id);
            },
            "changeSelect": function (evtObj) {
                page.currentPage = evtObj.currentPage;
                page.displayLength = evtObj.displayLength;
                getCatalogServices($scope.current.id);
            }
        };

        //获取服务目录列表
        function getCatalogs() {
            var deferred = camel.get({
                "url": {s: "/goku/rest/v1.5/{tenant_id}/service-mgnt/catalogs", o: {"tenant_id": $rootScope.user.orgId}},
                "params": {
                    "activated": true
                }
            });
            deferred.success(function (data) {
                if (!data) {
                    return;
                }
                if (data.code != "0") {
                    messageServiceIns.errorMsgBox(data.code, data.message);
                    return;
                }

                var catalogs = data.catalogs;
                $scope.$apply(function () {
                    $scope.catalogs = catalogs;
                    if (catalogs && catalogs.length > 0) {
                        $scope.select(catalogs[0].id, catalogs[0].name);
                    }
                });

                initLayout();
            });
            deferred.fail(function(data) {
                initLayout();
            });
        }

        //获取指定目录的服务列表（包括分页，搜索、刷新）
        function getCatalogServices(catalogId) {
            var deferred = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/service-mgnt/services",
                    o: {"tenant_id": $rootScope.user.orgId}
                },
                "params": {
                    "name": $scope.searchString,
                    "activated": true,
                    "associated": true,
                    "catalogId": catalogId,
                    "start": page.getStart(),
                    "limit": page.displayLength
                }
            });
            deferred.success(function (data) {
                if (!data) {
                    return;
                }
                if (data.code != "0") {
                    messageServiceIns.errorMsgBox(data.code, data.message);
                    return;
                }

                $scope.$apply(function () {
                    $scope.services = data.services;
                    $scope.pagination.totalRecords = data.total;
                });
            });
        }

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

         }];

    return catalogCtrl;
});
