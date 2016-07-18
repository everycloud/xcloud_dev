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
                var i18n = $scope.i18n = $rootScope.i18n;
                $scope.id = $("#azListWindowId").widget().option("orgId");
                $scope.azNumber = {
                    label: (i18n.resource_term_AZrange_label || "可用分区范围") + ":",
                    value: 0
                };
                $scope.azManageLink = {
                    label: i18n.org_term_AZmanage_button || "可用分区管理",
                    click: function () {
                        $scope.azManage();
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
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_desc_label || "描述",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
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
                $scope.azManage = function () {
                    var azManageWindow = new Window({
                        "winId": "azManageWindowId",
                        "orgId": $scope.id,
                        "title": i18n.org_term_AZmanage_button || "可用分区管理",
                        "content-type": "url",
                        "content": "app/business/user/views/organization/azManage.html",
                        "height": 600,
                        "width": 800,
                        "maximizable":false,
                        "minimizable":false,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operator.getAzList();
                        }
                    }).show();
                };

                $scope.operator = {
                    "getAzList": function () {
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
                                $scope.azListModel.datas = [];
                                $scope.azNumber.value = 0;
                                if (response && response.azInfos) {
                                    var azList = [];
                                    var azListRes = response.azInfos;
                                    for (var item in azListRes) {
                                        azList.push({
                                            "id": azListRes[item].azId,
                                            "name": azListRes[item].azName,
                                            "description": azListRes[item].azDesc || ""
                                        });
                                    }
                                    $scope.azListModel.datas = azList;
                                    $scope.azNumber.value = azList.length;
                                }
                            });
                        });
                    }
                };
                $scope.operator.getAzList();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.azList", dependency);
        app.controller("userMgr.org.azList.ctrl", azListCtrl);
        app.service("camel", http);
        return app;
    });
