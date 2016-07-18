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
        "tiny-widgets/Radio",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/Select",
        "fixtures/userFixture"
    ],
    function ($, angular, http, commonService, Radio) {
        "use strict";
        var transferUserCtrl = ["$scope", "camel",
            function ($scope, camel) {
                var user = $("html").scope().user;
                $scope.userId = $("#transferUserWindowId").widget().option("userId");
                $scope.tips = {
                    "content": "提示：删除用户将会导致该用户具有的资源被过户。不选择过户用户时，用户资源会默认过户给用户所在VDC中创建时间最早的VDC管理员。"
                };
                $scope.searchBox = {
                    "id": "userSearchBox",
                    "placeholder": "请输入用户名",
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchString) {}
                };
                $scope.model = {
                    "id": "userListId",
                    "caption": null,
                    "datas": [],
                    "columns": [{
                        "sTitle": "",
                        "sWidth": "40px",
                        "mData": "radio",
                        "bSearchable": false,
                        "bSortable": false
                    }, {
                        "sTitle": "用户名",
                        "mData": function(data){
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }],
                    "pagination": true,
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
                    "hideTotalRecords": false,

                    "renderRow": function (row, dataitem, index) {
                        var options = {
                            "id": "userListRadio_" + index,
                            "checked": false,
                            "change": function () {

                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', row).html(radio.getDom());
                    },

                    "callback": function (evtObj) {
                        $scope.model.curPage.pageIndex = evtObj.currentPage;
                        $scope.model.displayLength = evtObj.displayLength;
                        loadData();
                    }
                };
                $scope.deleteBtn = {
                    "id": "deleteBtnId",
                    "text": "删除",
                    "click": function () {
                        $("#transferUserWindowId").widget().destroy();
                    }
                };
                $scope.cancelBtn = {
                    "id": "transferUserCancelBtn",
                    "text": "取消",
                    "click": function () {
                        $("#transferUserWindowId").widget().destroy();
                    }
                };
                var loadData = function () {
                    var deferred = camel.get({
                        "url": "",
                        "params": {
                            curPage: $scope.model.curPage.pageIndex,
                            displayLength: $scope.model.displayLength
                        },
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            var data = [];
                            var userListRes = response.userListRes;
                            for (var item in userListRes) {
                                userListRes[item].radio = "";
                                data.push(userListRes[item]);
                            }
                            $scope.model.datas = data;
                            $scope.model.curPage.pageIndex = response.curPage;
                            $scope.model.displayLength = response.displayLength;
                            $scope.model.totalRecords = response.totalRecords;
                        });
                    });
                }
                loadData();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.memberManage.transferUser", dependency);
        app.controller("userMgr.org.memberManage.transferUser.ctrl", transferUserCtrl);
        app.service("camel", http);
        return app;
    });
