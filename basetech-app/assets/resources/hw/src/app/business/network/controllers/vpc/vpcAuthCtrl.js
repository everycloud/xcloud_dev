/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    "app/services/cloudInfraService",
    "app/business/network/services/networkService",
    "tiny-directives/Table",
    "fixtures/network/vpcFixture"
], function ($, angular, _, Window, cloudInfraService, networkService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "camel", "$state", "networkCommon", "exception", "message",
        function ($scope, $compile, $q, camel, $state, networkCommon, exception, message) {
            var i18n = $scope.i18n;
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var serviceIns = new networkService(exception, $q, camel);
            var searchVpcName = "";

            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.searchLocation = {
                "id": "vpcAuthSearchLocation",
                "width": "120",
                "values": [],
                "change": function () {
                    $scope.cloudInfraId = $("#vpcAuthSearchLocation").widget().getSelectedId();
                    page.currentPage = 1;
                    getVPCAuthList();
                    $("#vpcAuthListTable").widget().option("cur-page", {
                        "pageIndex": 1
                    });
                }
            };

            $scope.createBtn = {
                "id": "vpcAuthCreate",
                "text": i18n.org_term_addEntitlement_button,
                "click": function () {
                    var options = {
                        "winId": "createVpcAuthWindow",
                        cloudInfraId: $scope.cloudInfraId,
                        title: i18n.org_term_addEntitlement_button,
                        height: "350px",
                        width: "800px",
                        "content-type": "url",
                        "content": "app/business/network/views/vpc/createVpcAuth.html",
                        "buttons": null,
                        "close": function () {
                            getVPCAuthList();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }
            };

            //条件搜索下拉框
            $scope.searchBox = {
                "id": "vpcAuthSearchBox",
                "placeholder": i18n.common_term_findName_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    searchVpcName = searchString;
                    page.currentPage = 1;
                    getVPCAuthList();
                }
            };

            $scope.refresh = {
                "id": "vpcAuthRefresh",
                "click": function () {
                    getVPCAuthList();
                }
            };

            $scope.vpcAuthList = {
                "id": "vpcAuthListTable",
                "paginationStyle": "full_numbers",
                "totalRecords": 0,
                "displayLength": 10,
                "lengthMenu": [10, 20, 30],
                "columns": [
                    {
                        "sTitle": i18n.org_term_entitlementID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "VPC ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpcID);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.vpc_term_vpcName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpcName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "opt",
                        "bSortable": false
                    }
                ],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getVPCAuthList();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getVPCAuthList();
                },
                "renderRow": function (nRow, aData) {
                    var operate = "";
                    operate = "<div><li><a class='btn-link' ng-click='release()'>" + i18n.org_term_delEntitlement_button + "</a></li></div>";
                    var operateLink = $compile(operate);
                    var operateScope = $scope.$new();
                    operateScope.release = function () {
                        message.warnMsgBox({
                            "content": i18n.org_entitle_del_info_confirm_msg,
                            "callback": function () {
                                var deferred = serviceIns.deleteVpcAuth({
                                    "vdcId": $scope.user.vdcId,
                                    "userId": $scope.user.id,
                                    "cloudInfraId": $scope.cloudInfraId,
                                    "id": aData.id
                                });
                                deferred.then(function () {
                                    getVPCAuthList();
                                });
                            }
                        });
                    };
                    var operateNode = operateLink(operateScope);
                    $("td:eq(3)", nRow).html(operateNode);
                }
            };

            //查询当前租户可见的地域列表
            function getLocations() {
                var retDefer = $q.defer();
                var deferred = cloudInfraServiceIns.queryCloudInfras($scope.user.vdcId, $scope.user.id);
                deferred.then(function (data) {
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        var currId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                        $scope.cloudInfraId = currId;
                        $scope.searchLocation.values = data.cloudInfras;
                        retDefer.resolve();
                    }
                    retDefer.reject();
                }, function (rejectedValue) {
                    retDefer.reject(rejectedValue);
                });
                return retDefer.promise;
            }

            //获取公共VPC列表
            function getVPCAuthList() {
                var deferred = serviceIns.queryVpcAuth({
                    "vdcId": $scope.user.vdcId,
                    "userId": $scope.user.id,
                    "params": {
                        "start": page.getStart(),
                        "limit": page.displayLength,
                        "cloud-infras": $scope.cloudInfraId,
                        "vpc-name": searchVpcName
                    }
                });

                deferred.then(function (data) {
                    if (!data || !data.vpcAuthList) {
                        $scope.vpcAuthList.totalRecords = 0;
                        $scope.vpcAuthList.data = [];
                        return;
                    }
                    $scope.vpcAuthList.totalRecords = data.total;
                    $scope.vpcAuthList.data = data.vpcAuthList;
                });
            }

            $scope.$on("$viewContentLoaded", function () {
                //获取初始化信息
                var promise = getLocations();
                promise.then(function () {
                    getVPCAuthList();
                });
            });
        }
    ];
    return ctrl;
});
