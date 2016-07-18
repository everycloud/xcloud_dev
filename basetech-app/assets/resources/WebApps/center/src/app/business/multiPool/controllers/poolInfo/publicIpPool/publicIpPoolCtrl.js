define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/exceptionService",
    "fixtures/zoneFixture"],
    function ($, angular, ExceptionService, zoneFixture) {
        "use strict";

        var publicIPCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", "$rootScope", function ($scope, $stateParams, $compile, $state, camel, $rootScope) {
            var infraId = $stateParams.infraId;
            $scope.couldName = $stateParams.name;

            $scope.publicIPTable = {
                caption: "",
                data: [],
                id: "publicIPTableId",
                columnsDraggable: true,
                enablePagination: false,
                enableFilter: false,
                hideTotalRecords: true,
                showDetails: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_IPsegment_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipRange);
                        },
                        "bSortable": false,
                        "sWidth": "15%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false,
                        "sWidth": "15%"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_assignIPnum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.allocation);
                        },
                        "bSortable": false,
                        "sWidth": "18%"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_publicIPusage_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.usage);
                        },
                        "bSortable": false,
                        "sWidth": "15%"
                    }
                ],
                renderRow: function (row, dataitem, index) {
                    $('td:eq(1)', row).addTitle();
                }
            };

            $scope.refresh = {
                id: "publicIPRefresh_id",
                refresh: function () {
                    $scope.operator.query();
                }
            };

            $scope.operator = {
                "query": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/{vdc_id}/publicippools",
                            o: {vdc_id: 1}
                        },
                        params: {
                            "cloud-infras": infraId
                        },
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            response = response || {total: 0, publicIPPools: []};
                            var pools = response.publicIPPools;
                            for (var i = 0, len = pools.length; i < len; i++) {
                                var pool = pools[i];

                                var ipRange = [];
                                var ipRangeList = pool.ipRangeList;
                                for (var j = 0, rangeListLength = ipRangeList.length; j < rangeListLength; j++) {
                                    var range = ipRangeList[j];
                                    ipRange.push([range.startIp, range.endIp].join("-"));
                                }

                                var statPublicIPUsages = pool.statPublicIPUsages;
                                var usages = [];
                                for (var k = 0, usLeng = statPublicIPUsages.length; k < usLeng; k++) {
                                    var usage = statPublicIPUsages[k];
                                    usages.push(usage.usage + "(" + usage.total + ")");
                                }

                                pool.ipRange = ipRange.join(";");
                                pool.usage = usages.join(",");
                                pool.allocation = pool.usedNum + "/" + pool.total;
                            }
                            $scope.publicIPTable.data = pools;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };

            // 打开时请求数据
            $scope.operator.query();
        }];

        return publicIPCtrl;
    });