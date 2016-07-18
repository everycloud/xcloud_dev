/**
 * 代办授权
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/services/exceptionService','fixtures/vpcFixture'],
    function ($, angular, Window, Message, ExceptionService) {
        "use strict";

        var authorityCtrl = ["$scope", "$compile", "$rootScope", "camel", function ($scope, $compile, $rootScope, camel) {

            $scope.privilege = $scope.user.privilege;
            //搜索模型
            $scope.searchModel = {
                "vpcId": "",
                "start": 0,
                "limit": 10
            };

            //搜索框
            $scope.searchBox = {
                "id": "authoritySearchBox",
                "placeholder": $scope.i18n.org_term_findVPCID_prom,
                "type": "round",
                "width": "200",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.vpcId = searchString;
                    $scope.operator.query();
                }
            };
            var columns = [
                {
                    "sTitle": $scope.i18n.org_term_entitlementID_label || "授权ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.org_term_VDCid_label || "VDC ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vdcID);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.vpc_term_VPCid_label || "VPC ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vpcID);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.vpc_term_vpcName_label || "VPC名称",

                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vpcName);
                    },
                    "bSortable": false
                }
            ];

            /**
             * 授权列表
             */
            $scope.authorityTable = {
                data: [],
                id: "authorityTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                columns: columns,
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.currentPage;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operator.query();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = evtObj.currentPage;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.authorityTable.displayLength = evtObj.displayLength;
                    $scope.operator.query();
                },
                renderRow: function (row, dataitem, index) {

                }
            };

            /**
             * 刷新按钮
             */
            $scope.refresh = {
                text: $scope.i18n.common_term_fresh_button || "刷新",
                click: function () {
                    $scope.operator.query();
                }
            };

            /**
             * 操作方法定义
             */
            $scope.operator = {
                "query": function () {
                    var deferred = camel.get({
                        "url": {"s": "/goku/rest/v1.5/irm/{vdc_id}/vpc-authentications?start={start}&limit={limit}&vpc-name={vpc_name}&vpc-id={vpc_id}",
                            "o": {"vdc_id": 1, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "vpc_name": "", "vpc_id": $scope.searchModel.vpcId}},
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            $scope.authorityTable.data = response.vpcAuthList;
                            $scope.authorityTable.totalRecords = response.total;
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

        return authorityCtrl;
    });

