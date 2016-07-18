/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：操作日志查询
 * 修改人：
 * 修改时间：2014-04-17
 */

define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/business/system/services/vdiManageService",
    "app/services/commonService",
    "app/services/messageService",
    "app/services/mainService",
    "app/services/exceptionService",
    "tiny-widgets/Window",
    "tiny-directives/Table",
    "tiny-directives/Button",
    "tiny-directives/FilterSelect"],
    function ($, angular, VdiManageService, commonService, MessageService, MainService, ExceptionService, Window) {

        "use strict";
        var operatorLogCtrl = ["$scope", "$q", "camel", "$compile", function ($scope, $q, camel, $compile) {
            var $rootScope = $("html").scope();

            var i18n = $scope.i18n || {};

            var userId = $rootScope.user.id;
            var vdiManageService = new VdiManageService($q, camel);
            var exception = new ExceptionService();
            var mainService = new MainService(exception, $q, camel);
            var vdiWindowOptions = {
                "winId": "vdiWindowId",
                "minimizable": false,
                "maximizable": false,
                "content-type": "url",
                "content": "app/business/system/views/systemConfig/editVdi.html",
                "height": 480,
                "width": 640,
                "buttons": null,
                "close": function (event) {
                    $scope.search();
                }
            };
            var connectStatusConfig = vdiManageService.getConnectStatusConfig();

            $scope.centerTitle = i18n.sys_term_desktopAddr_label || "桌面云地址";
            $scope.notifies = i18n.split(i18n.sys_desk_add_desc_label);

            $scope.searchModel = {
                start: 0,
                limit: commonService.DEFAULT_TABLE_PAGE_LENGTH,
                search: ""
            };
            //搜索框
            $scope.searchBox = {
                "id": "vdiSearchBoxId",
                "placeholder": i18n.sys_term_findDeskIP_prom || "请输入名称/主用IP/备用IP",
                "type": "round", // round,square,long
                "width": "200",
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.search = $.trim(searchString);
                    $scope.search();
                }
            };

            $scope.btns = {
                add: {
                    id: "addBtn",
                    text: i18n.common_term_add_button || "添加",
                    handler: function () {
                        new Window($.extend({
                            title: i18n.sys_term_addDeskIP_button || "添加桌面云"
                        }, vdiWindowOptions)).show();
                    }
                },
                refresh: {
                    id: "refreshBtn",
                    text: i18n.common_term_fresh_button || "刷新",
                    handler: function () {
                        $scope.search();
                    }
                }
            };

            $scope.vdiTable = {
                "id": "vdiTableId",
                "columns": [
                    {
                        "sTitle": i18n.common_term_name_label || "名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "150px",
                        "sClass": "vdi-name",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_masterIP_label || "主用IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.primaryIP);
                        },
                        "sWidth": "125px",
                        "sClass": "vdi-primaryIP",
                        "bSortable": false
                    },
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_standbyIP_label || "备用IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.extraIP);
                        },
                        "sWidth": "125px",
                        "sClass": "vdi-extraIP",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_port_label || "端口",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.port);
                        },
                        "bSortable": false,
                        "sWidth": "50px"
                    },
                    {
                        "sTitle": i18n.common_term_userName_label || "用户名",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userName);
                        },
                        "sWidth": "150px",
                        "sClass": "vdi-userName",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_linkStatus_value || "连接状态",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusText);
                        },
                        "sWidth": "80px",
                        "sClass": "vdi-status",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_domain_label || "域",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.domainText);
                        },
                        "sWidth": "150px",
                        "sClass": "vdi-domain",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_operation_label || "操作",
                        "mData": "",
                        "sClass": "vdi-operate",
                        "bSortable": false
                    }
                ],
                "pagination": "true",
                "paginationStyle": "full_members",
                "hideTotalRecords": false,
                "lengthChange": "true",
                "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                "draggable": true,
                "enableFilter": false,
                "renderRow": function (row, dataitem, index) {
                    var optTemplates = "<a href='javascript:void(0)' ng-click='edit()'>" + (i18n.common_term_modify_button || "修改") + "</a> <a class= 'left10' href = 'javascript:void(0)' ng-click='remove()'>" + (i18n.common_term_delete_button || "删除") + "</a >";
                    var opts = $compile($(optTemplates));
                    var optscope = $scope.$new(false);
                    optscope.edit = function () {
                        new Window($.extend({
                            params: dataitem,
                            title: i18n.sys_term_modifyDeskIP_button || "修改桌面云"
                        }, vdiWindowOptions)).show();
                    };
                    optscope.remove = function () {
                        new MessageService().confirmMsgBox({
                            content: i18n.sys_desk_del_info_confirm_msg || "确实要删除桌面云吗？",
                            callback: function () {
                                $scope.remove(dataitem.id);
                            }
                        });
                    };
                    var optNode = opts(optscope);
                    $("td.vdi-operate", row).html(optNode);

                    if (dataitem.connectStatus == "connected_failed" && dataitem.connectorErrorCode) {
                        var reason = exception.getException(dataitem.connectorErrorCode);
                        var reasonText = reason && reason.desc;
                        if (reasonText) {
                            var statusTemplates = "<a href='javascript:void(0)' ng-click='reason()' ng-bind='statusText'></a>";
                            var statusLink = $compile($(statusTemplates));
                            var statusScope = $scope.$new(false);
                            statusScope.statusText = dataitem.statusText;
                            statusScope.reason = function () {
                                var reason = exception.getException(dataitem.connectorErrorCode);
                                new Window({
                                    "winId": "failReasonWindow",
                                    "title": i18n.common_term_failCause_label || "失败原因",
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content": reasonText,
                                    "width": 360,
                                    "height": 200,
                                    "buttons": null
                                }).show();
                            };
                            var statusNode = statusLink(statusScope);
                            $("td.vdi-status", row).html(statusNode);
                        }
                    }
                    $("td.vdi-name", row).addTitle();
                    $("td.vdi-primaryIP", row).addTitle();
                    $("td.vdi-extraIP", row).addTitle();
                    $("td.vdi-userName", row).addTitle();
                    $("td.vdi-domain", row).addTitle();
                },
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.search();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.search();
                }
            };

            var parseVdis = function (response) {
                var list = response.vdis;
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    var name = item.domainName || "";
                    item.domainText = "domain/" + name;
                    item.statusText = (item.connectStatus && connectStatusConfig[item.connectStatus]) || item.connectStatus || "";
                }

                $scope.vdiTable.data = list;
                $scope.vdiTable.totalRecords = response.total;

                //新增是total变为1，全删是total变为0
                if (response.total < 2) {
                    mainService.vdiMenuAction({
                        userId: userId,
                        scope: $rootScope
                    });
                }
            };

            $scope.search = function () {
                var promise = vdiManageService.vdiList(userId, $scope.searchModel);
                promise.then(function (resolvedValue) {
                    parseVdis(resolvedValue);
                });
            };
            $scope.remove = function (vdiId) {
                var promise = vdiManageService.delVdi({
                    userId: userId,
                    id: vdiId
                });
                promise.then(function (resolvedValue) {
                    //当前页面仅有一条数据的时候，删除需要回滚到前一页
                    var listLength = $scope.vdiTable.data.length;
                    var total = $scope.vdiTable.totalRecords;
                    var displayLength = $scope.searchModel.limit;
                    if (listLength === 1 && total > displayLength) {
                        $scope.searchModel.start -= displayLength;
                    }
                    $scope.search();
                });
            };

            $scope.search();

            $scope.$on('$destroy', function () {
            });

        }];
        return operatorLogCtrl;
    });