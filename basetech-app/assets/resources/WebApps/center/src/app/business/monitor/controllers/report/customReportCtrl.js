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
        var customReportCtrl = ["$scope", "$compile", "$state", "camel",
            function ($scope, $compile, $state, camel) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n || {};
                $scope.openstack = user.cloudType === "OPENSTACK";
                var hasOperateRight = user.privilege.role_role_add_option_reportHandle_value;
                var hasQueryRight = user.privilege.role_role_add_option_reportView_value;
                var lang = {zh: "zh_CN", en: "en_US"};
                var locale = lang[window.urlParams.lang];

                $scope.createCustomReport = {
                    "id": "createCustomReportId",
                    "text": i18n.common_term_create_button || "创建",
                    "disable": false,
                    "display": hasOperateRight,
                    "click": function () {
                        var createWindow = new Window({
                            "winId": "createCustomReportWindowId",
                            "title": i18n.report_term_createReport_button || "创建报表",
                            "content-type": "url",
                            "content": "app/business/monitor/views/report/createCustomReport.html",
                            "height": 310,
                            "width": 680,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": [
                                null,
                                null
                            ],
                            "close": function (event) {
                                $scope.operator.queryReportConfig();
                            }
                        }).show();
                    }
                };

                $scope.refresh = {
                    click: function () {
                        $scope.operator.queryReportConfig();
                    }
                };

                var objTypeMap = {
                    "zone": i18n.resource_term_zone_label || "资源分区",
                    "cluster": i18n.virtual_term_cluster_label || "资源集群"
                };
                $scope.model = {
                    "id": "systemReportConfigListTblId",
                    "datas": [],
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.reportName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_object_label || "对象类型",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.objTypeStr);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_buildTime_label || "生成时间",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.occurTime);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_createBy_label || "创建用户",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.userName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label || "操作",
                            "mData": "operation",
                            "sWidth": "200px",
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
                        var nameOpt = "<div><a href='javascript:void(0)' ng-click='showDetail()'>{{reportName}}</a>" + "</div>";
                        var nameOptLink = $compile($(nameOpt));
                        var nameOptScope = $scope.$new(false);
                        nameOptScope.reportName = dataitem.reportName;
                        nameOptScope.showDetail = function () {
                            var historyReportWindow = new Window({
                                "winId": "customReportConfigWindowId",
                                "reportConfig": dataitem,
                                "title": i18n.common_term_statisticItem_label || "统计指标",
                                "content-type": "url",
                                "content": "app/business/monitor/views/report/customReportConfig.html",
                                "height": 300,
                                "width": 400,
                                "maximizable":false,
                                "minimizable":false,
                                "buttons": [
                                    null,
                                    null
                                ],
                                "close": function (event) {
                                }
                            }).show();
                        };
                        $("td:eq(0)", row).html(nameOptLink(nameOptScope));

                        var submenus = '<span class="dropdown" style="position: absolute"  ng-if="hasOperateRight">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+ (i18n.common_term_more_button || "更多")+ '<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                            '<li><a href="javascript:void(0)" ng-if="hasOperateRight" ng-click="modifyConfig()">'+ (i18n.common_term_modify_button || "修改") + '</a></li>' +
                            '<li><a href="javascript:void(0)" ng-if="hasOperateRight" ng-click="deleteConfig()">'+ (i18n.common_term_delete_button || "删除") + '</a></li>' +
                            '</ul>' +
                            '</span>';

                        var opt = "<div ng-if='hasOperateRight'><a href='javascript:void(0)' ng-click='download()'>" +
                            (i18n.common_term_downloadReportForm_button || "下载报表") +"</a><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
                            submenus + "</div>";
                        var optLink = $compile($(opt));
                        var optScope = $scope.$new(false);
                        optScope.hasQueryRight = hasQueryRight;
                        optScope.hasOperateRight = hasOperateRight;
                        optScope.download = function () {
                            $scope.operator.downloadReport(dataitem.id);
                        };

                        optScope.modifyConfig = function () {
                            var createWindow = new Window({
                                "winId": "createCustomReportWindowId",
                                "title": i18n.common_term_modify_button || "修改报表",
                                "createType": "modify",
                                "objType": dataitem.objType,
                                "reportId":dataitem.id,
                                "reportConfig": dataitem,
                                "content-type": "url",
                                "content": "app/business/monitor/views/report/createCustomReport.html",
                                "height": 300,
                                "width": 650,
                                "maximizable":false,
                                "minimizable":false,
                                "buttons": [
                                    null,
                                    null
                                ],
                                "close": function (event) {
                                    $scope.operator.queryReportConfig();
                                }
                            }).show();
                        };

                        optScope.deleteConfig = function () {
                            var content = i18n.report_config_del_info_confirm_msg || "您确认要删除报表配置吗？";
                            var msg = new Message({
                                "type": "confirm",
                                "content": content,
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: i18n.common_term_ok_button || '确定',
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn : true,
                                        default: true
                                    },
                                    {
                                        label: i18n.common_term_cancle_button || '取消',
                                        accessKey: '3',
                                        "key": "cancelBtn",
                                        default: false
                                    }
                                ]
                            });
                            msg.setButton("okBtn", function () {
                                msg.destroy();
                                $scope.operator.deleteReportConfig(dataitem.id);
                            });
                            msg.setButton("cancelBtn", function () {
                                msg.destroy();
                            });
                            msg.show();
                        };
                        $("td:eq(4)", row).html(optLink(optScope));
                    },

                    "callback": function (evtObj) {
                        $scope.model.curPage.pageIndex = evtObj.currentPage;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.queryReportConfig();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.model.curPage.pageIndex = evtObj.currentPage;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.queryReportConfig();
                    }
                };

                $scope.operator = {
                    "deleteReportConfig": function (configId) {
                        var deferred = camel["delete"]({
                            "url": {
                                s: "/goku/rest/v1.5/irm/reports/custom-reports/{id}",
                                o: {
                                    "id": configId
                                }
                            },
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $scope.operator.queryReportConfig();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },

                    // 查询报表配置
                    "queryReportConfig": function () {
                        var deferred = camel.get({
                            "url": " /goku/rest/v1.5/irm/reports/custom-reports",
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (response && response.reportConfigList) {
                                    var configList = response.reportConfigList;
                                    for (var index in configList) {
                                        configList[index].objTypeStr = objTypeMap[configList[index].objType] || configList[index].objType;
                                    }
                                    $scope.model.datas = configList;
                                } else {
                                    $scope.model.datas = [];
                                }
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },

                    "downloadReport": function (id) {
                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/irm/reports/custom-reports/{id}/file?locale={locale}",
                                o: {
                                    "id": id,
                                    "locale": locale
                                }
                            },
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (response && response.exportReportPath) {
                                    $scope.reportUrl = "/goku/rest/v1.5/file/" + $.encoder.encodeForURL(response.exportReportPath) + "?type=export";
                                    $("#downloadCustomReport").attr("src", $scope.reportUrl);
                                }
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                }
                $scope.operator.queryReportConfig();

            }
        ];

        var dependency = [];
        return customReportCtrl;
    });
