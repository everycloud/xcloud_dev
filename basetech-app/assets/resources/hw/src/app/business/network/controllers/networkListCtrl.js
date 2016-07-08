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

            $scope.createBtn = {
                "id": "network-vpcmanager-networklist-create",
                "text": i18n.common_term_create_button,
                "click": function () {
                    $state.go("network.createNetwork.navigate", {
                        "opt": "create",
                        "cloudInfraId": $scope.cloudInfraId,
                        "vpcId": $scope.vpcId,
                        "azId": $scope.azId,
                        "exception": exception
                    });
                }
            };

            // 网络表格列数据显示，IT场景多一个SNAT
            var networkTableColumns = $scope.openstack ? [
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
                    "sWidth": "10%",
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.networkID);
                    },
                    "sWidth": "10%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusUI);
                    },
                    "sWidth": "10%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.vpc_term_netType_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.networkTypeUI);
                    },
                    "sWidth": "10%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_Subnet_label,
                    "mData": "subnets",
                    "sWidth": "14%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_IPassignMode_label,
                    "mData": "ipdiscover",
                    "sWidth": "10%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.perform_term_IPstatistic_label,
                    "mData": "IPtotal",
                    "sWidth": "16%",
                    "bSortable": false
                }
            ] : [
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
                    "sWidth": "10%",
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.networkID);
                    },
                    "sWidth": "10%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusUI);
                    },
                    "sWidth": "8%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.vpc_term_netType_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.networkTypeUI);
                    },
                    "sWidth": "8%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_Subnet_label,
                    "mData": "subnets",
                    "sWidth": "14%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_IPassignMode_label,
                    "mData": "ipdiscover",
                    "sWidth": "10%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.perform_term_IPstatistic_label,
                    "mData": "IPtotal",
                    "sWidth": "16%",
                    "bSortable": false
                },
                {
                    "sTitle": "SNAT",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.snatStatus);
                    },
                    "sWidth": "5%",
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
                "enablePagination": true,
                 columnsDraggable: true,
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

                    var submenus = '<span class="dropdown margin-horizon-beautifier" style="position: static">';
                    submenus += '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + i18n.common_term_more_button + '<b class="caret"></b></a>';
                    submenus += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';

                    // ICT:修改，关联、接关联路由器、删除
                    if ($scope.openstack) {
                        if (aData.networkTypeUI !== i18n.vpc_term_routerNet_label) {
                            submenus += '<li><a class="btn-link" ng-click="modify()">' + i18n.common_term_modify_button + '</a></li>';
                            submenus += '<li><a class="btn-link" ng-click="associateRouter()">' + i18n.vpc_term_associateRouter_button + '</a></li>';
                        } else {
                            submenus += '<li><a class="btn-link" ng-click="unassociateRouter()">' + i18n.vpc_term_disassociateRouter_button + '</a></li>';
                        }
                        submenus += '<li><a class="btn-link" ng-click="deleter()">' + i18n.common_term_delete_button + '</a></li>' + '</ul></span>';
                    }
                    // IT:申请私有IP、修改子网、关联、解关联路由器、开启SNAT、关闭SNAT、删除
                    else {
                        var itStatus = aData.status === "READY" || aData.status === "FAIL" || aData.status === "UPDATEFAIL";
                        if (aData.networkTypeUI === i18n.vpc_term_routerNet_label) {
                            submenus += itStatus ? '<li><a class="btn-link" ng-click="applyITPrivateIP()">' + i18n.vpc_term_applyPrivateIP_button + '</a></li>' : '<li class="disabled"><a>' + i18n.vpc_term_applyPrivateIP_button + '</a></li>';
                        }
                        if (aData.networkTypeUI !== i18n.vpc_term_directConnectNet_label && aData.ipv4Subnet) {
                            submenus += itStatus ? '<li><a class="btn-link" ng-click="modfiySubnet()">' + i18n.vpc_term_modifySubnet_button + '</a></li>' : '<li class="disabled"><a>' + i18n.vpc_term_modifySubnet_button + '</a></li>';
                        }
                        if (aData.networkTypeUI === i18n.vpc_term_innerNet_label && aData.ipv4Subnet) {
                            submenus += itStatus ? '<li><a class="btn-link" ng-click="associateRouter()">' + i18n.vpc_term_associateRouter_button + '</a></li>' : '<li class="disabled"><a>' + i18n.vpc_term_associateRouter_button + '</a></li>';
                        }
                        if (aData.networkTypeUI === i18n.vpc_term_routerNet_label) {
                            submenus += itStatus ? '<li><a class="btn-link" ng-click="unassociateRouter()">' + i18n.vpc_term_disassociateRouter_button + '</a></li>' : '<li class="disabled"><a>' + i18n.vpc_term_disassociateRouter_button + '</a></li>';
                        }
                        if (aData.networkTypeUI === i18n.vpc_term_routerNet_label) {
                            // 只有状态为0的路由网络，并且SNAT对象为null，才能开启SNAT。
                            if (!aData.snat) {
                                submenus += aData.status === "READY" ? '<li><a class="btn-link" ng-click="openSnat()">' + i18n.common_term_turnOnSNAT_button + '</a></li>' : '<li class="disabled"><a>' + i18n.common_term_turnOnSNAT_button + '</a></li>';
                            }
                            // 只有SNAT对象不为null，并且SNAT状态为0或3时，才能关闭SNAT。
                            else {
                                submenus += aData.snat && (aData.snat.status === "READY" || aData.snat.status === "FAIL") ? '<li><a class="btn-link" ng-click="closeSnat()">' + i18n.vpc_term_shutSNAT_button + '</a></li>' : '<li class="disabled"><a>' + i18n.vpc_term_shutSNAT_button + '</a></li>';
                            }
                        }
                        submenus += itStatus || aData.status === "FAIL" ? '<li><a class="btn-link" ng-click="deleter()">' + i18n.common_term_delete_button + '</a></li>' + '</ul></span>' : '<li class="disabled"><a>' + i18n.common_term_delete_button + '</a></li>';
                    }

                    // ICT下的默认直连网络不允许更多操作
                    if ($scope.openstack && aData.networkTypeUI === i18n.vpc_term_directConnectNet_label) {
                        submenus = "";
                    }
                    // 操作
                    var opt = "<div><a class='btn-link' ng-click='showVmDetail()'>" + i18n.vpc_term_checkAssociateVM_button + "</a>" + submenus + "</div>";

                    var optLink = $compile(opt);
                    var optScope = $scope.$new();
                    optScope.id = "networkListOptMore" + iDataIndex;

                    optScope.showVmDetail = function () {
                        var param = {
                            "cloudInfraId": $scope.cloudInfraId,
                            "vdcId": user.vdcId,
                            "userId": user.id,
                            "vpcId": $scope.vpcId,
                            "networkID": aData.networkID
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

                    optScope.unassociateRouter = function () {
                        operateRouter(aData.networkID, "REMOVE_INTERFACE");
                    };

                    optScope.modify = function () {
                        $state.go("network.createNetworkICTModule", {
                            "opt": "modify",
                            "cloudInfraId": $scope.cloudInfraId,
                            "networkID": aData.networkID,
                            "vpcId": $scope.vpcId,
                            "azId": $scope.azId,
                            "exception": exception
                        });
                    };
                    // 非路由网络支持关联路由
                    optScope.associateRouter = function () {
                        operateRouter(aData.networkID, "ADD_INTERFACE");
                    };

                    optScope.openSnat = function () {
                        var param = {
                            "cloudInfraId": $scope.cloudInfraId,
                            "vdcId": user.vdcId,
                            "userId": user.id,
                            "vpcId": $scope.vpcId,
                            "networkID": aData.networkID
                        };
                        var options = {
                            "winId": "openSnatWindow",
                            title: i18n.vpc_term_publicIP_label,
                            param: param,
                            height: "260px",
                            width: "600px",
                            "content-type": "url",
                            "content": "app/business/network/views/openSnatWindow.html",
                            "buttons": null,
                            "close": function () {
                                    getNetworkData();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    };

                    optScope.closeSnat = function () {
                        var promise = $scope.serviceInstance.closeSnat({
                            "cloudInfraId": $scope.cloudInfraId,
                            "vdcId": user.vdcId,
                            "userId": user.id,
                            "id": aData.snat.snatID,
                            "vpcId": $scope.vpcId
                        });
                        promise.then(function () {
                            getNetworkData();
                        });
                    };

                    optScope.applyITPrivateIP = function () {
                        var param = {
                            "mode": "add",
                            "privateIP": "",
                            "cloudInfraId": $scope.cloudInfraId,
                            "vdcId": user.vdcId,
                            "userId": user.id,
                            "vpcId": $scope.vpcId,
                            "networkID": aData.networkID,
                            "description": "",
                            "isOKBttnClick": false
                        };
                        var options = {
                            "winId": "operatePrivateIpWindow",
                            title: i18n.vpc_term_applyPrivateIP_button,
                            param: param,
                            height: "260px",
                            width: "600px",
                            "content-type": "url",
                            "content": "app/business/network/views/operatePrivateIp.html",
                            "buttons": null,
                            "close": function () {
                                if (param.isOKBttnClick) {
                                    getNetworkData();
                                }
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    };

                    optScope.modfiySubnet = function () {
                        // 修改子网传递的参数
                        var param = {
                            "cloudInfraId": $scope.cloudInfraId,
                            "vdcId": user.vdcId,
                            "userId": user.id,
                            "vpcId": $scope.vpcId,
                            "networkID": aData.networkID,
                            "networkInfo": {}
                        };
                        // 重新查询网络信息
                        var promise = $scope.serviceInstance.queryNetworkDetail({
                            "cloudInfraId": $scope.cloudInfraId,
                            "vdcId": user.vdcId,
                            "userId": user.id,
                            "vpcId": $scope.vpcId,
                            "networkID": aData.networkID
                        });
                        promise.then(function (resolvedValue) {
                            if (!resolvedValue) {
                                return;
                            }
                            param.networkInfo = resolvedValue;
                            param.vpcId = $scope.vpcId;
                            param.isOKBttnClick = false;
                            var options = {
                                "winId": "modifySubnetWindow",
                                title: i18n.vpc_term_modifySubnet_button,
                                "param": param,
                                height: "700px",
                                width: "700px",
                                "content-type": "url",
                                "content": "app/business/network/views/modifyNetworkSubnetInfo.html",
                                "buttons": null,
                                "close": function () {
                                    if (param.isOKBttnClick) {
                                        getNetworkData();
                                    }
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        });
                    };

                    optScope.deleter = function () {
                        deleteNetwork(user.vdcId, aData.networkID, $scope.cloudInfraId, $scope.vpcId);
                    };

                    var optNode = optLink(optScope);

                    if ($scope.hasNetworkOperateRight) {
                        // IT场景多现实一列SNAT
                        if ($scope.openstack) {
                            $("td:eq(8)", nRow).append(optNode);
                        } else {
                            $("td:eq(9)", nRow).append(optNode);
                        }
                    }

                    //IP使用情况
                    var iPtotal = "";
                    // IT场景
                    if (!$scope.openstack) {
                        if (!aData.ipv4Subnet && !aData.ipv6Subnet) {
                            iPtotal = "<span>-</span>";
                        } else {
                            iPtotal += "<span>";
                            if (aData.ipv4Subnet) {
                                //  内部网络是手动分配方式 或者 直连网络使用的外部网络是外部DHCP或者手动分配方式时 IP统计这列的数据不显示
                                if((aData.networkType===2 && aData.ipv4Subnet.ipAllocatePolicy===2) ||
                                    (aData.networkType===1 && (aData.ipv4Subnet.ipAllocatePolicy===0 || aData.ipv4Subnet.ipAllocatePolicy===2))){
                                    iPtotal += "-";
                                }
                                else{
                                    iPtotal += "<a class='btn-link' ng-click='getIpUsage()'>IPv4:" + $.encoder.encodeForHTML(aData.ipv4Subnet.usedAddrNum) + "/" + $.encoder.encodeForHTML(aData.ipv4Subnet.totalAddrNum) + "</a>";
                                }
                            }
                            if (aData.ipv6Subnet) {
                                if((aData.networkType===2 && aData.ipv6Subnet.ipAllocatePolicy===2) ||
                                    (aData.networkType===1 && (aData.ipv6Subnet.ipAllocatePolicy===0 || aData.ipv6Subnet.ipAllocatePolicy===2))){
                                    iPtotal += (aData.ipv4Subnet ? "|" : "") + "-";
                                }
                                else{
                                    iPtotal += ((aData.ipv4Subnet ? "|" : "") + "IPv6:" + $.encoder.encodeForHTML(aData.ipv6Subnet.usedAddrNum) + "/" + $.encoder.encodeForHTML(aData.ipv6Subnet.totalAddrNum));
                                }
                            }
                            iPtotal += "</span>";
                        }
                    }
                    // ICT场景
                    else {
                        if (!aData.ipv4Subnet && !aData.ipv6Subnet) {
                            iPtotal = "<span>-</span>";
                        } else {
                            iPtotal += "<span>";
                            if (aData.ipv4Subnet) {
                                iPtotal += "IPv4:" + $.encoder.encodeForHTML(aData.ipv4Subnet.usedAddrNum) + "/" + $.encoder.encodeForHTML(aData.ipv4Subnet.totalAddrNum);
                            }
                            if (aData.ipv6Subnet) {
                                iPtotal += ((aData.ipv4Subnet ? "|" : "") + "IPv6:" + $.encoder.encodeForHTML(aData.ipv6Subnet.usedAddrNum) + "/" + $.encoder.encodeForHTML(aData.ipv6Subnet.totalAddrNum));
                            }
                            iPtotal += "</span>";
                        }
                    }
                    // IP使用情况
                    optScope.getIpUsage = function () {
                        // 路由网络需要显示手动分配IP情况
                        var param = {
                            "showIpByHand": aData.networkTypeUI === i18n.vpc_term_routerNet_label,
                            "cloudInfraId": $scope.cloudInfraId,
                            "vdcId": user.vdcId,
                            "userId": user.id,
                            "vpcId": $scope.vpcId,
                            "networkID": aData.networkID
                        };
                        var options = {
                            "winId": "ipUsageWindowId",
                            "param": param,
                            title: i18n.perform_term_usageIPnum_label,
                            height: "480px",
                            width: "800px",
                            "content-type": "url",
                            "content": "app/business/network/views/ipUsage.html",
                            "buttons": null,
                            "close": function () {
                                getNetworkData();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    };

                    var iPtotalName = $compile(iPtotal);
                    var iPtotalNode = iPtotalName(optScope);
                    $("td:eq(7)", nRow).html(iPtotalNode);
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                    $("td:eq(7)", nRow).addTitle();
                    $("td:eq(8)", nRow).addTitle();
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



            function getNetTypeByCode(code) {
                var netTypeStr = "";
                switch (code) {
                    case 1:
                        netTypeStr = i18n.vpc_term_directConnectNet_label;
                        break;
                    case 2:
                        netTypeStr = i18n.vpc_term_innerNet_label;
                        break;
                    case 3:
                        netTypeStr = i18n.vpc_term_routerNet_label;
                        break;
                    default:
                        break;
                }
                return netTypeStr;
            }

            function getAllocateWayFromCode(code) {
                var allocateWay = "";
                switch (code) {
                    case 0:
                        allocateWay = i18n.resource_term_externalDHCP_label;
                        break;
                    case 1:
                        allocateWay = i18n.common_term_innerDHCP_label;
                        break;
                    case 2:
                        allocateWay = i18n.common_term_manual_label;
                        break;
                    case 3:
                        allocateWay = i18n.vpc_term_staticInjection_label;
                        break;
                    case 4:
                        allocateWay = i18n.resource_exter_add_para_allocationIP_mean_noStatusAuto_label;
                        break;
                    default:
                        break;
                }
                return allocateWay;
            }

            function getAllocateWay(ipv4Subnet, ipv6Subnet) {
                if (null === ipv4Subnet && null === ipv6Subnet) {
                    return "-";
                }
                var allocType = "";
                if (ipv4Subnet !== null) {
                    allocType = "IPv4: " + getAllocateWayFromCode(ipv4Subnet.ipAllocatePolicy);
                }
                if (ipv6Subnet !== null) {
                    allocType += ipv4Subnet === null ? "" : "|";
                    allocType += ("IPv6: " + getAllocateWayFromCode(ipv6Subnet.ipAllocatePolicy));
                }
                return allocType;
            }

            function genUiSubnets(ipv4Subnet, ipv6Subnet) {
                if (!ipv4Subnet && !ipv6Subnet) {
                    return "-";
                }
                var ipStr = "";
                if (ipv4Subnet) {
                    ipStr = "IPv4: " + $.encoder.encodeForHTML(ipv4Subnet.subnetAddr) + "/" + $.encoder.encodeForHTML(ipv4Subnet.subnetPrefix);
                }
                if (ipv6Subnet) {
                    ipStr += !ipv4Subnet ? "" : "|";
                    ipStr += ("IPv6: " + $.encoder.encodeForHTML(ipv6Subnet.subnetAddr) + "/" + $.encoder.encodeForHTML(ipv6Subnet.subnetPrefix));
                }
                return ipStr;
            }

            function getSnatStatus(snat) {
                var ret = "";
                if (!snat) {
                    return ret;
                }
                var statusMaps = {
                    "READY": i18n.common_term_ready_value,
                    "ENABLING": i18n.common_term_startuping_value,
                    "DISABLING": i18n.common_term_stoping_value,
                    "FAIL": i18n.common_term_fail_label,
                    "FORCED_TO_DISABLING": i18n.common_term_forceShuting_value
                };
                return statusMaps[snat.status + ""];
            }

            // 查询网络列表信息
            function getNetworkData() {
                var options = {
                    "vdcId": user.vdcId,
                    "vpcId": $scope.vpcId,
                    "userId": user.id,
                    "cloudInfraId": $scope.cloudInfraId,
                    "start": page.getStart(),
                    "limit": page.displayLength
                };

                var promise = $scope.serviceInstance.queryNetworks(options);
                promise.then(function (data) {
                    _.each(data.networks, function (item) {
                        _.extend(item, {
                            "detail": {
                                contentType: "url", // simple & url
                                content: "app/business/network/views/networkDetail.html"
                            },
                            "showDetail": true,
                            "opt": "",
                            "netId": "",
                            "subnets": "",
                            "IPtotal": ""
                        });
                        item.statusUI = $scope.serviceInstance.getStatus(item.status);
                        if (!$scope.openstack) {
                            item.snatStatus = getSnatStatus(item.snat);
                        }
                        item.networkTypeUI = getNetTypeByCode(item.networkType);
                        item.subnets = genUiSubnets(item.ipv4Subnet, item.ipv6Subnet);
                        item.ipdiscover = getAllocateWay(item.ipv4Subnet, item.ipv6Subnet);
                    });
                    $scope.networkTable.totalRecords = data.total;
                    $scope.networkTable.displayLength = page.displayLength;
                    $("#vpcmanager-network-listtable").widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });
                    $scope.networkTable.data = data.networks;
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

            function isShowTablePage() {
                $scope.networkTable.enablePagination = !$scope.openstack;
            }

            $scope.$on("$viewContentLoaded", function () {
                //获取网络列表信息
                getNetworkData();
                //是否显示分页，ICT场景下不显示分页
                isShowTablePage();
            });
        }
    ];
    return networkListCtrl;
});
