/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/commonService",
    "tiny-widgets/Window",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField"
],
    function ($, angular, http, commonService, Window) {
        "use strict";
        var azListCtrl = ["$scope", "camel",
            function ($scope, camel) {
                var $rootScope = $("html").scope();
                var user = $rootScope.user;
                var i18n = $scope.i18n.user = $rootScope.user;
                $scope.id = $("#azListWindowId").widget().option("orgId");
                $scope.azNumber = {
                    label: "资源池范围:",
                    value: 0
                };
                $scope.azManageLink = {
                    label: i18n.resource_term_resourcePoolMgr_label || "资源池管理",
                    click: function () {
                        $scope.cloudInfrasManage();
                    }
                };
                $scope.azListModel = {
                    "id": "azListModel",
                    "caption": null,
                    "datas": [],
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.cloudInfraName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_section_label || "地域",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.cloudInfraRegion);
                            },
                            "bSortable": false
                        }
                    ],
                    "pagination": false,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": false,
                    "curPage": {
                        "pageIndex": 1
                    },
                    "requestConfig": {
                        "enableRefresh": true,
                        "refreshInterval": 6000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false
                };
                $scope.cloudInfrasManage = function () {
                    var azManageWindow = new Window({
                        "winId": "azManageWindowId",
                        "orgId": $scope.id,
                        "title": i18n.resource_term_resourcePoolMgr_label || "资源池管理",
                        "content-type": "url",
                        "content": "app/business/user/views/organization/cloudInfrasManage.html",
                        "height": 600,
                        "width": 800,
                        "maximizable": false,
                        "minimizable": false,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operator.getCloudInfrasList();
                        }
                    }).show();
                };

                $scope.operator = {
                    "getCloudInfrasList": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}/cloud-infras",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                response = response || {azInfos: []};
                                var azListRes = response.azInfos || [];
                                $scope.azListModel.datas = azListRes;
                                $scope.azNumber.value = azList.length;
                            });
                        });
                    }
                };
                $scope.operator.getCloudInfrasList();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.cloudInfrasList", dependency);
        app.controller("userMgr.org.cloudInfrasList.ctrl", azListCtrl);
        app.service("camel", http);
        return app;
    });
