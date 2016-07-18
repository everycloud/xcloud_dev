define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/exceptionService",
    "app/services/messageService",
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/Checkbox",
    "tiny-directives/Select",
    "tiny-directives/DateTime",
    "fixtures/userFixture"
],
    function ($, angular, ExceptionService, MessageService, Message, Window) {
        "use strict";
        var systemReportCtrl = ["$scope", "$compile", "$state", "camel",
            function ($scope, $compile, $state, camel) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n || {};
                var hasOperateRight = user.privilege.role_role_add_option_reportHandle_value;
                var hasQueryRight = user.privilege.role_role_add_option_reportView_value;
                $scope.openstack = user.cloudType === "OPENSTACK";

                var i18nMap = {
                    "reportName": {
                        "server": i18n.report_term_server_label || "服务器报表",
                        "physical_host": i18n.report_term_physi_label || "物理机报表",
                        "virtual_host": i18n.report_term_host_label || "主机报表",
                        "vm": i18n.report_term_vm_label || "虚拟机报表",
                        "cluster": i18n.report_term_cluster_label || "集群报表",
                        "network": i18n.report_term_network_label || "网络报表",
                        "storage": i18n.report_term_storage_label || "存储报表"
                    },
                    "reportPeriodType": {
                        "daily": i18n.common_term_everyDay_label || "每天",
                        "weekly": i18n.common_term_everyWeek_label || "每周",
                        "monthly": i18n.common_term_everyMonth_label || "每月"
                    },
                    "reportType": {
                        "device": i18n.report_term_device_label || "设备报表",
                        "virtual": i18n.report_term_virtual_label || "虚拟化报表",
                        "network": i18n.report_term_network_label || "网络报表"
                    }
                };

                $scope.enableAllBtn = {
                    "id": "enableAllBtnId",
                    "text": i18n.common_term_enableAll_button || "启用全部",
                    "disable": false,
                    "display": hasOperateRight,
                    "click": function () {
                        $scope.operator.operateAllConfig("enable");
                    }
                };
                $scope.disableAllBtn = {
                    "id": "disableAllBtnId",
                    "text": i18n.common_term_disableAll_button || "禁用全部",
                    "disable": false,
                    "display": hasOperateRight,
                    "click": function () {
                        $scope.operator.operateAllConfig("disable");
                    }
                };

                $scope.refresh = {
                    click: function () {
                        $scope.operator.getSystemReportConfig();
                    }
                };

                $scope.model = {
                    "id": "systemReportConfigListTblId",
                    "datas": [],
                    "columnsDraggable":true,
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.reportNameStr);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.report_term_reportType_label || "报表类型",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.reportTypeStr);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.report_term_reportNum_label || "报表份数",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.maxReportNum);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_cycle_label || "周期",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.reportPeriodTypeStr);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_buildTime_label || "生成时间",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.time);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_status_label || "状态",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.status);
                            },
                            "sWidth": "150px",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label || "操作",
                            "mData": "operation",
                            "sWidth": "370px",
                            "bSortable": false
                        }
                    ],
                    "pagination": false,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": [10, 20, 50],
                    "displayLength": 10,
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
                    "showDetails": false,

                    "renderRow": function (row, dataitem, index) {
                        $("td:eq(0)", row).addTitle();
                        $("td:eq(1)", row).addTitle();
                        // 操作栏
                        var statusOpt = "<div><span class='btn-link' ng-if='enable && hasOperateRight' ng-click='operateConfig(enable)'><img src='../theme/default/images/gm/enable.png'></span>" +
                            "<span ng-if='enable && !hasOperateRight'><img src='../theme/default/images/gm/enable.png'></span>" +
                            "<span class='btn-link' ng-if='!enable && hasOperateRight' ng-click='operateConfig(enable)'><img src='../theme/default/images/gm/disable.png'></span>" +
                            "<span ng-if='!enable && !hasOperateRight'><img src='../theme/default/images/gm/disable.png'></span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
                            "<a href='javascript:void(0)' ng-if='enable && hasOperateRight' ng-click='modifyConfig()'>"+ i18n.vpn_term_modifyCfg_button+"</a>" +
                            "<span ng-if='!enable && hasOperateRight'>"+ i18n.vpn_term_modifyCfg_button+"</span></div>";

                        var statusLink = $compile($(statusOpt));
                        var statusScope = $scope.$new(false);
                        statusScope.enable = (dataitem.status === "enable" ? true : false);
                        statusScope.hasOperateRight = hasOperateRight;
                        statusScope.operateConfig = function (currentStatus) {
                            $scope.operator.operateConfig(dataitem.id, !currentStatus);
                        };
                        statusScope.modifyConfig = function () {
                            var modifyConfigWindow = new Window({
                                "winId": "modifyConfigWindowId",
                                "reportConfig": dataitem,
                                "title": i18n.common_term_modify_button || "修改",
                                "content-type": "url",
                                "content": "app/business/monitor/views/report/modifyReportConfig.html",
                                "height": 300,
                                "width": 512,
                                "maximizable":false,
                                "minimizable":false,
                                "buttons": null,
                                "close": function (event) {
                                    $scope.operator.getSystemReportConfig();
                                }
                            }).show();
                        };
                        $("td:eq(5)", row).html(statusLink(statusScope));

                        var opt = "<div ng-if='hasOperateRight'><a href='javascript:void(0)' ng-click='downloadRTReport()'>" + i18n.common_term_downloadRealTimeReportForm_button +"</a><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
                            "<a href='javascript:void(0)' ng-click='downloadHistoryReport()'>" + i18n.common_term_downloadHistoryReportForm_button +"</a>" + "</div>";

                        var optLink = $compile($(opt));
                        var optScope = $scope.$new(false);
                        optScope.id = dataitem.id;
                        optScope.name = dataitem.name;
                        optScope.hasOperateRight = hasOperateRight;
                        optScope.downloadRTReport = function () {
                            var realTimeReportWindow = new Window({
                                "winId": "realTimeReportWindowId",
                                "reportName": dataitem.id,
                                "title": i18n.common_term_downloadRealTimeReportForm_button || "下载实时报表",
                                "content-type": "url",
                                "content": "app/business/monitor/views/report/downloadRealTimeReport.html",
                                "height": 150,
                                "width": 400,
                                "maximizable":false,
                                "minimizable":false,
                                "buttons": [
                                    null,
                                    null
                                ],
                                "beforeClose": function () {
                                    try {
                                        var scope = $("#downloadRealTimeReport").scope();
                                        scope.operator.clearTimer();
                                    } catch (e) {

                                    }

                                },
                                "close": function (event) {
                                    $scope.operator.getSystemReportConfig();
                                }
                            }).show();
                        };
                        optScope.downloadHistoryReport = function () {
                            var historyReportWindow = new Window({
                                "winId": "historyReportWindowId",
                                "reportName": dataitem.id,
                                "title": i18n.common_term_downloadHistoryReportForm_button || "下载历史报表",
                                "content-type": "url",
                                "content": "app/business/monitor/views/report/downloadHistoryReport.html",
                                "height": 450,
                                "width": 600,
                                "maximizable":false,
                                "minimizable":false,
                                "buttons": [
                                    null,
                                    null
                                ],
                                "close": function (event) {
                                    $scope.operator.getSystemReportConfig();
                                }
                            }).show();
                        };
                        $("td:eq(6)", row).html(optLink(optScope));
                    },

                    "callback": function (evtObj) {
                        $scope.model.curPage.pageIndex = evtObj.currentPage;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.getSystemReportConfig();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.model.curPage.pageIndex = evtObj.currentPage;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.getSystemReportConfig();
                    }
                };

                $scope.operator = {
                    "getSystemReportConfig": function () {
                        var deferred = camel.get({
                            "url": "/goku/rest/v1.5/irm/reports/asset-configs",
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (!response || !response.reportConfigList) {
                                    $scope.model.datas = [];
                                    return;
                                }
                                var data = [];
                                var configList = response.reportConfigList;
                                for (var item in configList) {
                                    configList[item].id = configList[item].reportName;
                                    configList[item].reportNameStr = i18nMap.reportName[configList[item].reportName];
                                    configList[item].reportTypeStr = i18nMap.reportType[configList[item].reportType];
                                    configList[item].reportPeriodTypeStr = i18nMap.reportPeriodType[configList[item].reportPeriodType];
                                    data.push(configList[item]);
                                }
                                $scope.model.datas = data;
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },

                    // 启停单个定时报表
                    "operateConfig": function (configId, enable, msg) {
                        var action = "enable";
                        if (!enable) {
                            action = "disable";
                        }
                        var deferred = camel.post({
                            "url": {
                                "s": "/goku/rest/v1.5/irm/reports/asset-configs/{id}?action={action}",
                                "o": {
                                    "id": configId,
                                    "action": action
                                }
                            },
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $scope.operator.getSystemReportConfig();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "operateAllConfig": function (action) {
                        if (action !== "enable" && action !== "disable") {
                            return;
                        }
                        var content = (i18n.report_report_enableAll_info_succeed_msg ||"启用全部系统报表成功。");
                        if (action === "disable") {
                            content = (i18n.report_report_disableAll_info_succeed_msg || "禁用全部系统报表成功。");
                        }
                        var deferred = camel.post({
                            "url": {
                                "s": "/goku/rest/v1.5/irm/reports/asset-configs?action={action}",
                                "o": {
                                    "action": action
                                }
                            },
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                new MessageService().okMsgBox(content);
                                $scope.operator.getSystemReportConfig();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                                $scope.operator.getSystemReportConfig();
                            });
                        });

                    }
                };
                $scope.operator.getSystemReportConfig();

            }
        ];

        var dependency = [];
        return systemReportCtrl;
    });
