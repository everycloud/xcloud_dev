define(["tiny-lib/angular",
    'tiny-widgets/Window',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    'fixtures/zoneFixture'],
    function (angular, Window, constants, ExceptionService) {
        "use strict";

        var hardwareCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", "$rootScope", function ($scope, $stateParams, $compile, $state, camel, $rootScope) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };
            $scope.searchModel = {
                "start": 0,
                "limit": 10
            };

            /**
             *  表格Scope
             */
            $scope.hardwareFirewallTable = {
                caption: "",
                data: [],
                id: "hardwareFirewallTableId",
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
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vfwName);
                        },
                        "bSortable": false,
                        "sWidth": "30%"
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_belongsToSwitch_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.firewall);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_belongsToVPC_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpcName);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operator.query();
                },
                changeSelect: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.hardwareFirewallTable.displayLength = evtObj.displayLength;
                    $scope.operator.query();
                },
                renderRow: function (row, dataitem, index) {
                }
            };

            $scope.refresh = {
                id: "hardwareFirewallRefresh_id",
                refresh: function () {
                    "use strict";
                    $scope.operator.query();
                }
            };

            $scope.operator = {
                "query": function () {
                    var queryConfig = constants.rest.VIRTUAL_FIREWALL_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID, "type": 1, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var data = response.vfwList;
                        for (var index in data) {
                            if (data[index].pairFwName) {
                                data[index].firewall = data[index].fwName + ";" + data[index].pairFwName;
                            }
                            else {
                                data[index].firewall = data[index].fwName;
                            }
                        }
                        $scope.$apply(function () {
                            $scope.hardwareFirewallTable.data = data;
                            $scope.hardwareFirewallTable.totalRecords = response.total;
                        })

                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };

            // 打开时请求数据
            $scope.operator.query();
        }];

        return hardwareCtrl;
    });
