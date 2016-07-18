/**
 * Created on 14-1-26.
 */
/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-widgets/Window",
    "bootstrap/bootstrap.min",
    "tiny-lib/underscore",
    "app/business/network/services/networkService",
    "fixtures/network/network/networkListFixture"
], function ($, Window, bootstrap, _, networkService) {
    "use strict";

    var networkListCtrl = ["$scope", "$compile", "camel", "$state", "$q", "networkCommon", "exception",
        function ($scope, $compile, camel, $state, $q, networkCommon, exception) {
            var user = $scope.user;
            var i18n = $scope.i18n;

            var NETWORK_OPERATE = "555002";
            var privilegeList = user.privilegeList;
            $scope.hasNetworkOperateRight = _.contains(privilegeList, NETWORK_OPERATE);

            $scope.cloudInfraId = networkCommon && networkCommon.cloudInfraId;
            $scope.vpcId = networkCommon && networkCommon.vpcId;
            $scope.azId = networkCommon && networkCommon.azId;

            //公共VPC需要屏蔽掉网络的相关操作
            $scope.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;

            $scope.serviceInstance = new networkService(exception, $q, camel);
            $scope.openstack = user.cloudType === "ICT";

            $scope.help = {
                "helpKey": "drawer_vpc_net",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };
            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.page = page;
            //ICT 场景下的分页
            $scope.hasPrePage = false;
            $scope.hasNextPage = false;
            var markers = [];
            $scope.prePage = function () {
                if (!$scope.hasPrePage) {
                    return;
                }
                markers.pop();
                if (markers.length === 0) {
                    $scope.hasPrePage = false;
                }
                page.currentPage--;
                getNetworkData();
            };
            $scope.nextPage = function () {
                if (!$scope.hasNextPage) {
                    return;
                }
                var item = $scope.networkTable.data[page.displayLength - 1] || {};
                markers.push(item.exnetworkID);
                $scope.hasPrePage = true;
                page.currentPage++;
                getNetworkData();
            };
            $scope.pageSize = {
                "id": "directNetworkList-searchSizeSelector",
                "width": "80",
                "values": [
                    {
                        "selectId": "10",
                        "label": "10",
                        "checked": true
                    },
                    {
                        "selectId": "20",
                        "label": "20"
                    },
                    {
                        "selectId": "50",
                        "label": "50"
                    }
                ],
                "change": function () {
                    page.currentPage = 1;
                    page.displayLength = $("#" + $scope.pageSize.id).widget().getSelectedId();
                    markers = [];
                    $scope.hasPrePage = false;
                    getNetworkData();
                }
            };

            var networkTableColumns = [
                {
                    "sTitle": "",
                    "mData": "netId",
                    "bSearchable": false,
                    "bSortable": false,
                    "sWidth": "5%"
                },
                {
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "15%",
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.exnetworkID);
                    },
                    "sWidth": "15%",
                    "bSortable": false
                },
                {
                    "sTitle": "VLAN/VXLAN",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vlans);
                    },
                    "sWidth": "15%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusUI);
                    },
                    "sWidth": "15%",
                    "bSortable": false
                }
            ];
            // 公共vpc下需要屏蔽操作列
            if (!$scope.vpcTypeShared) {
                networkTableColumns.push({
                    "sTitle": i18n.common_term_operation_label,
                    "mData": "opt",
                    "sWidth": "20%",
                    "bSortable": false
                });
            }

            $scope.networkTable = {
                "id": "vpcmanager-network-listtable",
                "enablePagination": false,
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "showDetails": true,
                "displayLength": 10,
                "totalRecords": 0,
                "columns": networkTableColumns,
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getNetworkData();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getNetworkData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                        $scope.currentItem.cloudInfraId = $scope.cloudInfraId;
                        $scope.currentItem.vpcId = $scope.vpcId;
                    });

                    // 操作
                    var opt = "<div><a class='btn-link' ng-click='showVmDetail()'>" + i18n.vpc_term_checkAssociateVM_button + "</a></div>";

                    var optLink = $compile(opt);
                    var optScope = $scope.$new();
                    optScope.id = "networkListOptMore" + iDataIndex;

                    optScope.showVmDetail = function () {
                        var param = {
                            "cloudInfraId": $scope.cloudInfraId,
                            "vdcId": user.vdcId,
                            "userId": user.id,
                            "vpcId": $scope.vpcId,
                            "networkID": aData.exnetworkID
                        };
                        var options = {
                            "winId": "networkVmInfosWindow",
                            title: i18n.vpc_term_checkAssociateVM_button,
                            param: param,
                            height: "260px",
                            width: "600px",
                            "content-type": "url",
                            "content": "app/business/network/views/networkVmDetail.html",
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    };
                    var optNode = optLink(optScope);

                    if ($scope.hasNetworkOperateRight) {
                        $("td:eq(5)", nRow).append(optNode);
                    }
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    optNode.find('.dropdown').dropdown();
                }
            };

            //关联，去关联Router
            function operateRouter(id, action) {
                var promise = $scope.serviceInstance.operateRouter({
                    "vdc_id": user.vdcId,
                    "vpcid": $scope.vpcId,
                    "id": id,
                    "cloud_infras_id": $scope.cloudInfraId,
                    "params": {
                        "interfaceAction": action
                    },
                    "userId": user.id
                });
                promise.then(function () {
                    getNetworkData();
                });
            }

            // 查询网络列表信息
            function getNetworkData() {
                var length = markers.length;
                var promise = $scope.serviceInstance.queryOutNetworks({
                    "isAssociated": true,
                    "vdcId": user.vdcId,
                    "vpcId": $scope.vpcId,
                    "userId": user.id,
                    "cloudInfraId": $scope.cloudInfraId,
                    "start": markers[length-1] || null,
                    "limit": page.displayLength,
                    "azId": $scope.azId
                });
                promise.then(function (data) {
                    _.each(data.externalNetworks, function (item) {
                        _.extend(item, {
                            "detail": {
                                contentType: "url", // simple & url
                                content: "app/business/network/views/networkDetail.html"
                            },
                            "showDetail": true,
                            "networkID": item.exnetworkID,
                            "opt": "",
                            "netId": "",
                            "subnets": "",
                            "IPtotal": ""
                        });
                        item.statusUI = $scope.serviceInstance.getExternalNetworkStatus(item.status);
                    });
                    $scope.networkTable.totalRecords = data.total;
                    $scope.networkTable.displayLength = page.displayLength;
                    $("#vpcmanager-network-listtable").widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });
                    $scope.networkTable.data = data.externalNetworks;
                    if (data.externalNetworks.length < page.displayLength) {
                        $scope.hasNextPage = false;
                    }
                    else {
                        $scope.hasNextPage = true;
                    }
                });
            }

            //删除网络信息
            function deleteNetwork(vdcId, networkId, cloudId, vpcId) {
                var options = {
                    "vdcId": vdcId,
                    "vpcId": vpcId,
                    "networkId": networkId,
                    "cloudInfraId": cloudId,
                    "userId": user.id
                };
                var promise = $scope.serviceInstance.deleteNetwork(options);
                promise.then(function () {
                    getNetworkData();
                });
            }

            //刷新安全组列表
            $scope.refresh = {
                "id": "network-refreshBtn",
                "click": function () {
                    getNetworkData();
                }
            };

            getNetworkData();
        }
    ];
    return networkListCtrl;
});
