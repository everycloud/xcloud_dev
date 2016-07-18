define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    'app/services/exceptionService',
    "fixtures/templateFixture"],
    function ($, angular, Window, Message, httpService, constants, exceptionService, templateFixture) {
        "use strict";

        var softwareUsageCtrl = ["$scope", "$compile", "camel","exception", function ($scope, $compile, camel, exception) {

            $scope.searchModel = {
                "softwareid": $("#showUsageWinID").widget().option("softwareID"),
                start: "0",
                limit: "10"
            };

            $scope.appStatusMap = {
                "ToBeProcessed":$scope.i18n.common_term_waitDeal_value,
                "Creating":$scope.i18n.common_term_creating_value,
                "CreationFailed":$scope.i18n.common_term_createFail_value,
                "Started":$scope.i18n.common_term_enable_value,
                "Starting":$scope.i18n.common_term_startuping_value,
                "StartFailed":$scope.i18n.common_term_startupFail_value,
                "Stopped":$scope.i18n.common_term_stoped_value,
                "StopFailed":$scope.i18n.common_term_stopFail_value,
                "Deleting":$scope.i18n.common_term_deleting_value,
                "DeleteFailed":$scope.i18n.common_term_deleteFail_value,
                "Repairing":$scope.i18n.common_term_restoring_value,
                "RepaireFailed":$scope.i18n.common_term_restorFail_value,
                "Exception":$scope.i18n.common_term_abnormal_value
            };

            $scope.appHealthStatusMap = {
                "alarm":$scope.i18n.alarm_term_alarm_label,
                "normal":$scope.i18n.common_term_healthStatus_label,
                "--":$scope.i18n.common_term_nullStatus_label,
                "unknown":$scope.i18n.common_term_unknownStatus_label
            };

            var addOperatorDom = function (dataItem, row) {
                //
            };

            $scope.applicationTable = {
                caption: "",
                data: [],
                id: "applicationTableId",
                columnsDraggable: true,
                enablePagination: true, //此属性设置表格是否分页
                paginationStyle: "full_numbers", //此属性设置表格分页的类型，可选值"simple","full_numbers"。
                lengthChange: true, // 此属性设置是否显示每页数据条数按钮。
                lengthMenu: [10, 20, 50], // 此属性设置每页显示数据长度选项，仅当length-change属性设置为true时有效。
                displayLength: 10,
                enableFilter: false, // 此属性设置表格是否具有过滤功能.
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.appName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML($scope.appStatusMap[data.status]);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.desc);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_createAt_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.createEndTime);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.user_term_createUser_button,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.userId);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.applicationTable.curPage.pageIndex = eveObj.currentPage;
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.applicationTable.curPage.pageIndex = eveObj.currentPage;
                    $scope.applicationTable.displayLength = eveObj.displayLength;
                },
                renderRow: function (row, dataitem, index) {

                    // 添加操作
                    addOperatorDom(dataitem, row);

                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                }
            };

            $scope.operator = {
                "query": function () {
                    // 统一转换start
                    var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                    $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                    var deferred = camel.get({
                        "url": {"s": constants.rest.APP_RESOURCE_QUERY.url, "o": {"tenant_id": 1}},
                        "params": $scope.searchModel,
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function(){
                            $scope.applicationTable.data = data.appInstances;
                            $scope.applicationTable.totalRecords = data.total;
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });

                    $scope.searchModel.start = start;
                }
            };

            // 打开时请求数据
            $scope.operator.query();
        }];

        var dependency = [];

        var usageModule = angular.module("template.software.usage", []);

        usageModule.controller("template.software.usage.ctrl", softwareUsageCtrl);
        usageModule.service("camel", httpService);
        usageModule.service("exception", exceptionService);

        return usageModule;
    });