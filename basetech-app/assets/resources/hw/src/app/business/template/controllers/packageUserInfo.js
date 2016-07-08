/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        'app/services/httpService',
        'app/services/validatorService',
        'tiny-widgets/Window',
        'tiny-widgets/Message',
        'tiny-common/UnifyValid',
        "tiny-widgets/Checkbox",
        "app/business/template/services/templateService",
        "app/business/application/services/appCommonData",
        "bootstrap/bootstrap.min"
    ],
    function ($, angular, _, $encoder, http, validator, Window, Message, UnifyValid, Checkbox, templateService, appCommonData) {
        // 注:此处为了兼容C10模板属性重复之类的bug,不使用strict模式
        "use strict";
        var packageUseInfoCtrl = ["$rootScope", "$scope", "$compile", "camel", "$q", "appCommonData",
            function ($rootScope, $scope, $compile, camel, $q) {

                var $state = $("html").injector().get("$state");
                //获取参数
                var cloudInfraId = $("#template-packageList-packageUseInfo-winId").widget().option("cloudInfraId");
                var softwareId = $("#template-packageList-packageUseInfo-winId").widget().option("softwareid");
                var exception = $("#template-packageList-packageUseInfo-winId").widget().option("exception");
                var templateServiceIns = new templateService(exception, $q, camel);
                var appCommonDataIns = new appCommonData();
                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n || {};
                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.packageTableList = {
                    "id": "package-userInfo-table",
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
                        var displayLength = $("#package-userInfo-table").widget().option("display-length");
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getPackageUseInfoData();
                    },
                    "changeSelect": function (evtObj) {
                        var displayLength = $("#package-userInfo-table").widget().option("display-length");
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getPackageUseInfoData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                    }
                };


                // 查询软件包使用信息信息
                function getPackageUseInfoData() {
                    var options = {
                        "user": user,
                        "softwareId": softwareId,
                        "cloudInfraId": cloudInfraId,
                        "start": page.getStart(),
                        "limit": page.displayLength
                    };
                    var promise = templateServiceIns.getPackageUseInfo(options);
                    promise.then(function (data) {
                        _.each(data.appInstances, function (item) {
                            _.extend(item, {
                                "appName": item.appName,
                                "status":appCommonDataIns.getAppStatusByKey(item.status),
                                "desc": item.desc,
                                "createEndTime": item.createEndTime,
                                "userName": item.userName
                            });
                        });
                        $scope.packageTableList.totalRecords = data.total;
                        $scope.packageTableList.data = data.appInstances;
                        $scope.packageTableList.displayLength = page.displayLength;
                        $("#package-userInfo-table").widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });

                    });
                }

                //关闭当前窗口
                $scope.destroy = function () {
                    $scope.close();
                };


                getPackageUseInfoData();
            }
        ];

        var packageUseInfoModule = angular.module("template.packageList.packageUseInfo", ['framework']);
        packageUseInfoModule.controller("template.packageList.packageUseInfo.ctrl", packageUseInfoCtrl);
        packageUseInfoModule.service("camel", http);
        packageUseInfoModule.service("ecs.vm.detail.disks.validator", validator);

        return packageUseInfoModule;
    }
);
