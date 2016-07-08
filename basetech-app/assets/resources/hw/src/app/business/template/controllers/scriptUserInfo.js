/* global define */
define([
        'sprintf',
        'tiny-lib/jquery',
        'tiny-lib/angular',
       'tiny-lib/angular-sanitize.min',
        "language/keyID",
        'tiny-lib/underscore',
        "tiny-lib/encoder",
        'app/services/httpService',
        'app/services/validatorService',
        'tiny-widgets/Window',
        'tiny-widgets/Message',
        'tiny-common/UnifyValid',
        "tiny-widgets/Checkbox",
        "app/business/template/services/templateService",
        "app/business/application/services/appCommonData",
        "fixtures/tenantTemplateFixture",
        "bootstrap/bootstrap.min"
    ],
    function (sprintf,$, angular, ngSanitize,  keyIDI18n, _, $encoder, http, validator, Window, Message, UnifyValid, Checkbox, templateService, appCommonData) {
        // 注:此处为了兼容C10模板属性重复之类的bug,不使用strict模式
        "use strict";
        var scriptUseInfoCtrl = ["$rootScope", "$scope", "$compile", "$q", "camel",
            function ($rootScope, $scope, $compile, $q, camel) {
                var $state = $("html").injector().get("$state");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var appCommonDataIns = new appCommonData();
                //获取参数
                var cloudInfraId = $("#template-scriptList-scriptUseInfo-winId").widget().option("cloudInfraId");
                var scriptId = $("#template-scriptList-scriptUseInfo-winId").widget().option("scriptId");
                var exception = $("#template-scriptList-scriptUseInfo-winId").widget().option("exception");
                var user = $("html").scope().user;
                var templateServiceIns = new templateService(exception, $q, camel);
                //存储当前已选择的告警
                $scope.checkboxData = [];

                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.scriptTableList = {
                    "id": "script-useInfo-table",
                    "captain": "vmCaptain",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "showDetails": {
                        "colIndex": 0,
                        "domPendType": "append"
                    },
                    "draggable": true,
                    "columns": [{
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.appName);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "status",
                        "sWidth": "10%",
                        "bSortable": true
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.desc);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createEndTime);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.user_term_createUser_button,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userName);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }],
                    "data": null,
                    "columnVisibility": {
                        "activate": "click", //"mouseover"/"click"
                        "aiExclude": [0, 5],
                        "bRestore": true,
                        "fnStateChange": function (index, state) {}
                    },

                    "callback": function (evtObj) {
                        var displayLength = $("#script-useInfo-table").widget().option("display-length");
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getScriptUseInfoData();
                    },
                    "changeSelect": function (evtObj) {
                        var displayLength = $("#script-useInfo-table").widget().option("display-length");
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getScriptUseInfoData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                    }
                };

                // 查询脚本使用信息
                function getScriptUseInfoData() {
                    var options = {
                        "user": user,
                        "scriptId": scriptId,
                        "cloudInfraId": cloudInfraId,
                        "start": page.getStart(),
                        "limit": page.displayLength
                    };
                    var promise = templateServiceIns.getScriptUseInfo(options);
                    promise.then(function (data) {
                        _.each(data.appInstances, function (item) {
                            _.extend(item, {
                                "appName": item.appName,
                                "status": appCommonDataIns.getAppStatusByKey(item.status),
                                "desc": item.desc,
                                "createEndTime": item.createEndTime,
                                "userName": item.userName
                            });
                        });
                        $scope.scriptTableList.totalRecords = data.total;
                        $scope.scriptTableList.data = data.appInstances;
                        $scope.scriptTableList.displayLength = page.displayLength;
                        $("#script-useInfo-table").widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });

                    });
                }
                //关闭当前窗口
                $scope.destroy = function () {
                    $scope.close();
                };
                getScriptUseInfoData();

            }
        ];

        var scriptUseInfoModule = angular.module("template.scriptList.scriptUseInfo", ['framework',"ngSanitize"]);
        scriptUseInfoModule.controller("template.scriptList.scriptUseInfo.ctrl", scriptUseInfoCtrl);
        scriptUseInfoModule.service("camel", http);
        scriptUseInfoModule.service("ecs.vm.detail.disks.validator", validator);

        return scriptUseInfoModule;
    }
);
