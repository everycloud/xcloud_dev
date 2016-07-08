/**
 * 各服务模块中的controller必须定义成一个module形式，以方便在各自的routerConfig中集成
 */
/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    "app/business/network/services/vpc/vpcService",
    "app/services/cloudInfraService",
    "tiny-directives/Table"
], function ($, angular, _, Window, vpcService, cloudInfraService) {
    "use strict";

    // 设置AZ名称
    var transVPCList = function (vpcList) {
        _.each(vpcList, function (vpc) {
            if (vpc && vpc.availableZone && vpc.availableZone[0] && vpc.availableZone[0].name && vpc.availableZone[0].id) {
                vpc.azIDsMapNames = vpc.availableZone[0].name;
                vpc.azId = vpc.availableZone[0].id;
            }
            vpc.opt = "";
        });
        return vpcList;
    };

    var ctrl = ["$scope", "$compile", "$q", "camel", "$state", "networkCommon", "exception", "storage",
        function ($scope, $compile, $q, camel, $state, networkCommon, exception, storage) {
            var i18n = $scope.i18n;
            $scope.vpcService = new vpcService(exception, $q, camel);

            var cloudInfraServiceIns = new cloudInfraService($q, camel);

            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.searchLocation = {
                "id": "networkVPCSearchLocation",
                "width": "120",
                "values": [],
                "change": function () {
                    $scope.cloudInfraId = $("#networkVPCSearchLocation").widget().getSelectedId();
                    networkCommon.cloudInfraId = $scope.cloudInfraId;
                    page.currentPage = 1;
                    getVPCList();
                    $("#networkVpcListTable").widget().option("cur-page", {
                        "pageIndex": 1
                    });
                    storage.add("cloudInfraId", $scope.cloudInfraId);
                }
            };

            $scope.refresh = {
                "id": "pubVpclistRefresh",
                "click": function () {
                    getVPCList();
                }
            };

            $scope.help = {
                "helpKey": "drawer_vpc_public",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.vpcModel = {
                "id": "networkVpcListTable",
                "paginationStyle": "full_numbers",
                "totalRecords": 0,
                "displayLength": 10,
                "lengthMenu": [10, 20, 30],
                "columns": [{
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },{
                        "sTitle": "VPC ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpcID);
                        },
                        "bSortable": false
                 },{
                    "sTitle": i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.resource_term_AZ_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.azIDsMapNames);
                    },
                    "bSortable": false
                }],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getVPCList();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getVPCList();
                },
                "renderRow": function (nRow, aData) {
                    var optScope = $scope.$new();
                    optScope.goDetail = function () {
                        if (networkCommon) {
                            networkCommon.vpcId = aData.vpcID;
                            networkCommon.vpcName = aData.name;
                            networkCommon.vpcTypeShared = true;
                        }
                        //创VPC的接口支持选多个AZ，网络也需要支持选AZ 目前：创VPC单选，网络默认第一个AZ
                        if (aData.azId && aData.azId.length && (aData.azId.length > 0)) {
                            if (networkCommon) {
                                networkCommon.azId = aData.azId;
                            }
                        }
                        $state.go("network.vpcmanager.summary", {
                            "vpcName": aData.name,
                            "cloud_infras": $scope.cloudInfraId,
                            "vpcId": aData.vpcID,
                            "azId": aData.azId
                        });
                    };
                    optScope.curCloudId = aData.azId;

                    //链接
                    var link = "<a class='btn-link' ng-click='goDetail()'>" + $.encoder.encodeForHTML(aData.name) + "</a> ";
                    var nameLink = $compile(link);
                    var linkNode = nameLink(optScope);
                    $("td:eq(0)", nRow).html(linkNode);
                }
            };

            //查询当前租户可见的地域列表
            function getLocations() {
                var retDefer = $q.defer();
                var deferred = cloudInfraServiceIns.queryCloudInfras($scope.user.vdcId, $scope.user.id);
                deferred.then(function (data) {
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        var currId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                        networkCommon.cloudInfraId = currId;
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
            function getVPCList() {
                if (!$scope.cloudInfraId) {
                    return;
                }
                var deferred = $scope.vpcService.getVpcList({
                    "vdc_id": $scope.user.vdcId,
                    "cloudInfraId": $scope.cloudInfraId,
                    "start": page.getStart(),
                    "limit": page.displayLength,
                    "userId": $scope.user.id,
                    "shared": true
                });

                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    $scope.vpcModel.data = transVPCList(data.vpcs);
                    $scope.vpcModel.totalRecords = data.total;
                });
            }

            $scope.$on("$viewContentLoaded", function () {
                //获取初始化信息
                var promise = getLocations();
                promise.then(function () {
                    getVPCList();
                });
            });
        }
    ];
    return ctrl;
});
