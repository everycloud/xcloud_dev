define(["tiny-lib/angular",
    'tiny-widgets/Window',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    'fixtures/zoneFixture'],
    function (angular, Window, constants, ExceptionService) {
        "use strict";

        var softwareCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", "$rootScope", function ($scope, $stateParams, $compile, $state, camel, $rootScope) {

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
            $scope.softwareFirewallTable = {
                caption: "",
                data: [],
                id: "softwareFirewallTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
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
                        "sTitle": $scope.i18n.resource_term_ServiceVMID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmID);
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
                    $scope.softwareFirewallTable.displayLength = evtObj.displayLength;
                    $scope.operator.query();
                },
                renderRow: function (row, dataitem, index) {
                }
            };

            $scope.refresh = {
                id: "softwareFirewallRefresh_id",
                refresh: function () {
                    "use strict";
                    $scope.operator.query();
                }
            };

            $scope.operator = {
                "query": function () {
                    var queryConfig = constants.rest.VIRTUAL_FIREWALL_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID, "type": 2, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.softwareFirewallTable.data = response.vfwList;
                            $scope.softwareFirewallTable.totalRecords = response.total;
                        })
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }

            // 打开时请求数据
            $scope.operator.query();
        }];

        return softwareCtrl;
    });
