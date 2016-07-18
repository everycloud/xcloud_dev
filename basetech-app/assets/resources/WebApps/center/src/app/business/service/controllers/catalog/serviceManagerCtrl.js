/**
 * Created by  on 14-1-24.
 */
define(["tiny-lib/angular",
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "app/services/messageService",
    "app/services/commonService",
    "app/business/service/services/catalog/catalogService",
    "tiny-directives/Pagination",
    "fixtures/serviceFixture"], function (angular, layout, Window, messageService, commonService, catalogService) {
    "use strict";

    var catalogCtrl = ["$scope", "$state", "$compile", "$q", "camel", "exception", "$stateParams", function ($scope, $state, $compile, $q, camel, exception, $stateParams) {
        //异常框的服务实例
        var messageServiceIns = new messageService();
        var catalogServiceIns = new catalogService(exception, $q, camel);
        var catalogId = $stateParams.catalogId || "";
        var user = $scope.user;
        var i18n = $scope.i18n;
        $scope.cloudType = $scope.user.cloudType == "OPENSTACK"?"ICT":"IT"
        var types = {
            "ssp.applyDisk": "Storage",
            "ssp.applyVdc": "VDC",
            "ssp.applyVm": "VM",
            "ssp.applyHost": "Host",
            "ssp.applyEip": "ElasticIP"
        };
        var hasCataLogViewRight = $scope.hasCataLogViewRight = user.privilege.role_role_add_option_catalogView_value;
        //todo
        var hasServiceOperateRight = $scope.hasServiceOperateRight = user.privilege.role_role_add_option_serviceHandle_value;

        $scope.stateGo = function (catalogId) {
            $state.go("service.serviceManager", {"catalogId": catalogId});
        }

        //服务管理旁的创建按钮
        $scope.createBtn = {
            id: "catalogCreateBtn",
            text: i18n.common_term_create_button || "创建",
            width: "50",
            "click": function () {
                $state.go("service.create");
            }
        };
        //按钮
        $scope.cancelBtn = {
            id: "catalogCancelBtn",
            text: i18n.common_term_canclePublish_button || "取消发布",
            width: "50",
            "click": function (serviceId) {
                var options = {
                    type: "confirm",
                    content: i18n.service_service_dispublish_info_confirm_msg || "确定取消发布此服务信息？",
                    callback: function (a) {
                        updateStatus(serviceId, "unpublished");
                    }
                };
                messageServiceIns.confirmMsgBox(options);
            }
        };
        $scope.releaseBtn = {
            id: "catalogReleaseBtn",
            text: i18n.common_term_publish_button || "发布",
            "click": function (serviceId) {
                var options = {
                    type: "confirm",
                    content: i18n.service_service_publish_info_confirm_msg || "确定发布此服务信息？",
                    callback: function (a) {
                        updateStatus(serviceId, "published");
                    }
                };
                messageServiceIns.confirmMsgBox(options);
            }
        };
        $scope.modifyBtn = {
            id: "catalogModifyBtn",
            text: i18n.common_term_edit_label || "编辑",
            "click": function (serviceId, serviceType, modifyUrl) {
                var stateUrl = types[serviceType];
                var state = "service.createService" + stateUrl;
                if(!stateUrl){
                    state = modifyUrl;
                }
                $state.go(state, {"serviceId": serviceId});
            }
        };
        $scope.copyBtn = {
            id: "catalogCopyBtn",
            display: false,
            text: i18n.common_term_copy_button || "复制",
            "click": function (serviceId) {
            }
        };
        $scope.modifyVdcBtn = {
            id: "catalogModifyVdcBtn",
            text: i18n.service_term_setRight_button || "设置权限",
            "click": function (serviceId) {
                queryService(serviceId,function(serviceInstance){
                    var options = {
                        "winId": "setVdcWindowId",
                        "serviceId": serviceId,
                        "title": i18n.service_term_setRight_button || "设置权限",
                        "content-type": "url",
                        "content": "app/business/service/views/catalog/setVdcs.html",
                        "height": 600,
                        "width": 800,
                        "serviceInstance":serviceInstance,
                        "minimizable": false,
                        "maximizable": false,
                        "buttons": null
                    };
                    new Window(options).show();
                });
            }
        };
        $scope.deleteBtn = {
            id: "catalogDeleteBtn",
            text: i18n.common_term_delete_button || "删除",
            "click": function (serviceId) {
                var options = {
                    type: "confirm",
                    content: i18n.service_service_delService_info_confirm_msg || "确实要删除该服务？",
                    callback: function (a) {
                        delCatalogServices(serviceId);
                    }
                };
                messageServiceIns.confirmMsgBox(options);
            }
        };

        $scope.searchBox = {
            "id": "serviceCatalogSearchBox",
            "placeholder": i18n.service_term_findServiceNameID_prom || "请输入服务名称或ID",
            "width": "250",
            "suggest-size": 10,
            "maxLength": 64,
            "search": function (searchString) {
                $scope.searchModel.start = 0;
                $scope.searchModel.inputSearch = $.trim(searchString);
                getCatalogServices(catalogId);
            }
        };

        $scope.refresh = {
            "id": "serviceCatalogRefresh",
            "click": function () {
                getCatalogServices(catalogId);
            }
        };

        //翻页条
        $scope.pagination = {
            "id": "serviceCatalogPagination",
            "type": "full_numbers",
            "lengthOptions": commonService.TABLE_PAGE_LENGTH_OPTIONS,
            "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
            "curPage": {"pageIndex": 1},
            "totalRecords": 0,
            "callback": function (evtObj) {
                var start = evtObj.displayLength * (evtObj.currentPage - 1);
                if (start != $scope.searchModel.start) {
                    $scope.searchModel.start = start;
                    $scope.searchModel.limit = evtObj.displayLength;

                    $scope.pagination.curPage = {
                        pageIndex: evtObj.currentPage
                    };
                    $scope.pagination.displayLength = evtObj.displayLength;
                    getCatalogServices(catalogId);
                }
            },
            "changeSelect": function (evtObj) {
                var limit = evtObj.displayLength;
                if (limit != $scope.searchModel.limit) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = limit;

                    $scope.pagination.curPage = {
                        pageIndex: evtObj.currentPage
                    };
                    $scope.pagination.displayLength = evtObj.displayLength;
                    getCatalogServices(catalogId);
                }
            }
        };

        $scope.searchModel = {
            "user": user,
            "inputSearch": "",
            "start": 0,
            "limit": commonService.DEFAULT_TABLE_PAGE_LENGTH
        };

        function initPage(response) {
            response = response || {total: 0, catalogs: []};
            var catalogs = $.extend([], response.catalogs);
            catalogs.unshift({id: "", name: i18n.common_term_allService_label || "所有服务"});
            $scope.catalogs = catalogs;
            if (catalogId) {
                $scope.searchModel.catalogId = catalogId;
            }
            getCatalogServices(catalogId);
            initLayout();
        }

        //获取服务目录列表
        function getCatalogs() {
            var deferred = catalogServiceIns.queryCatalogs({user: user, name: ""});
            deferred.then(function (response) {
                initPage(response);
            }, function () {
                initPage();
            });
        }

        //获取指定目录的服务列表（包括分页，搜索、刷新）
        function getCatalogServices(catalogId) {
            var deferred = catalogServiceIns.queryCatalogServices($scope.searchModel);
            deferred.then(function (data) {
                data = data || {total: 0, services: []};
                $scope.services = data.services;
                $scope.pagination.totalRecords = data.total;
            });
        }

        //删除指定服务操作
        function delCatalogServices(servicesId) {
            var options = {
                "user": user,
                "serviceId": servicesId
            };
            var deferred = catalogServiceIns.deleteServices(options);

            deferred.then(function (data) {
                getCatalogServices(catalogId);
            });
        }

        function queryService(serviceId,callback) {
            var options = {
                "user": user,
                "id": serviceId
            };
            var deferred = catalogServiceIns.queryServiceOffering(options);

            deferred.then(function (data) {
                callback && callback(data);
            });
        }

        //指定服务发布 与 取消发布操作
        function updateStatus(servicesId, status) {
            var options = {
                "user": user,
                "serviceId": servicesId,
                "modify": {
                    "status": status
                }
            };
            var deferred = catalogServiceIns.operateServices(options);
            deferred.then(function (data) {
                getCatalogServices(catalogId);
            });
        }

        function initLayout() {
            var $layDom = $(".tiny-layout-west");
            setTimeout(function () {
                var lay = new layout({
                    "id": "serviceCatalogLayoutId",
                    "subheight": 108
                });

                lay.opActive($layDom.find("a[data-catalogid=" + catalogId + "]"));
            }, 1);
        }

        //初始化页面
        if(hasCataLogViewRight){
            getCatalogs();
        }else{
            initPage();
        }
    }];

    return catalogCtrl;
});
