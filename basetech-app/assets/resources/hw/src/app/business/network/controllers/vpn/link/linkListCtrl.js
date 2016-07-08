/*global define*/
define(["tiny-lib/jquery",
    "app/business/network/services/networkService",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-lib/underscore"
], function ($, networkService, Window, Message, _) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "camel", "networkCommon", "$state", "exception", "message",
        function ($scope, $compile, $q, camel, networkCommon, $state, exception, message) {
            var user = $scope.user;
            var isIT = user.cloudType === "IT";
            var i18n = $scope.i18n;
            var LINKVPN_OPERATE = "561002";
            var privilegeList = $scope.user.privilegeList;
            $scope.hasLinkOperateRight = _.contains(privilegeList, LINKVPN_OPERATE);

            // 公共服务实例
            var networkServiceIns = new networkService(exception, $q, camel);

            // 链接VPN类型 IPSec:0  L2TP:1, type=-1表示一个链接VPN都还未创建
            $scope.type = "-1";

            $scope.params = {
                "cloudInfraId": networkCommon && networkCommon.cloudInfraId,
                "vpcId": networkCommon && networkCommon.vpcId,
                "azId": networkCommon && networkCommon.azId,
                "vpnConnectionID": "",
                "userId": $scope.user.id,
                "vdcId": $scope.user.vdcId
            };

            $scope.createBtn = {
                "id": "network-vpcmanager-vpnlink-create",
                "text": i18n.common_term_create_button,
                "icon": {
                    left: "opt-add"
                },
                "disable": false,
                "click": function () {
                    if (isIT) {
                        $state.go("network.createLinkVpn.navigate", {
                            "opt": "create",
                            "vpcId": networkCommon.vpcId,
                            "cloudInfra": networkCommon.cloudInfraId,
                            "azId": networkCommon.azId,
                            "type": $scope.type + ""
                        });
                    } else {
                        $state.go("network.createLinkVpnICT.navigate", {
                            "opt": "create",
                            "vpcId": networkCommon.vpcId,
                            "cloudInfra": networkCommon.cloudInfraId,
                            "azId": networkCommon.azId,
                            "type": $scope.type + ""
                        });
                    }
                }
            };

            $scope.refresh = {
                click: function () {
                    $scope.operate.queryVpnConnection();
                }
            };

            $scope.help = {
                "helpKey": "drawer_vpn_con",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.linkTable = {
                "id": "network-vpcmanager-vpnlink-listtable",
                "showDetails": true,
                "columns": [
                    {
                        "sTitle": "", //设置第一列的标题
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
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
                            return $.encoder.encodeForHTML(data.vpnConnectionID);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.vpn_term_vpnType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpnTypeUI);
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
                        "sTitle": i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "sWidth": "15%",
                        "bSortable": false,
                        "bVisible": isIT
                    },
                    {
                        "sTitle": i18n.common_term_lastModifiedTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lastModifiedTime);
                        },
                        "sWidth": "15%",
                        "bSortable": false,
                        "bVisible": isIT
                    },
                    {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "opt",
                        "sWidth": "10%",
                        "bSortable": false
                    }
                ],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    if (!$scope.hasLinkOperateRight) {
                        return;
                    }

                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.params.vpnConnectionID = aData.vpnConnectionID;
                    });
                    // 操作 就绪才能修改，就绪和失败才能删除
                    var opt = canModify(aData.status) ? "<div><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a>" : "<div><a class='disabled'>" + i18n.common_term_modify_button + "</a>";
                    opt += canDelete(aData.status) ? "<a class='btn-link margin-horizon-beautifier' ng-click='delete()'>" + i18n.common_term_delete_button + "</a></div>" : "<a class='disabled'> " + i18n.common_term_delete_button + "</a></div>";
                    var optLink = $compile(opt);
                    var optScope = $scope.$new();
                    optScope.modify = function () {
                        if (isIT) {
                            $state.go("network.createLinkVpn.navigate", {
                                "opt": "modify",
                                "vpcId": networkCommon.vpcId,
                                "cloudInfra": networkCommon.cloudInfraId,
                                "id": aData.vpnConnectionID,
                                "type": $scope.type + ""
                            });
                        } else {
                            $state.go("network.createLinkVpnICT.navigate", {
                                "opt": "modify",
                                "vpcId": networkCommon.vpcId,
                                "cloudInfra": networkCommon.cloudInfraId,
                                "id": aData.vpnConnectionID,
                                "type": $scope.type + ""
                            });
                        }
                    };
                    optScope["delete"] = function () {
                        message.warnMsgBox({
                            "content": i18n.vpn_connect_del_info_confirm_msg,
                            "callback": function () {
                                $scope.params.vpnConnectionID = aData.vpnConnectionID;
                                $scope.operate.deleteVpnConnection();
                            }
                        });
                    };
                    var optNode = optLink(optScope);
                    if (isIT) {
                        $("td:eq(8)", nRow).append(optNode);
                    } else {
                        $("td:eq(6)", nRow).append(optNode);
                    }
                }
            };
            function canModify(status) {
                if (isIT) {
                    return status === "READY";
                }
                return status === "READY" || status === "DOWN" || status === "BUILD";
            }

            function canDelete(status) {
                if (isIT) {
                    return status === "READY" || status === "FAIL";
                }
                return status === "READY" || status === "PENDING" || status === "FAIL" || status === "DOWN" || status === "BUILD";
            }

            $scope.operate = {
                "queryVpnConnection": function () {
                    var options = {
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "vpcId": $scope.params.vpcId,
                        "vdcId": $scope.params.vdcId,
                        "userId": $scope.params.userId
                    };
                    var deferred = networkServiceIns.queryVpnConnection(options);
                    deferred.then(function (data) {
                        if (!data || !data.vpnConnections || data.vpnConnections.length === 0) {
                            $scope.linkTable.data = [];
                            $scope.createBtn.disable = false;
                            $scope.type = "-1";
                            return;
                        }
                        if (data.vpnConnections.length >= 1) {
                            $scope.type = data.vpnConnections[0].vpnType;
                            if (data.vpnConnections[0].vpnType === 1) {
                                $scope.createBtn.disable = true; // l2TP类型的一个VPC下只能创建一个
                            }
                            _.each(data.vpnConnections, function (item) {
                                _.extend(item, {
                                    "showDetail": "",
                                    "vpnTypeUI": item.vpnType === 1 ? "L2TP" : "IPSec",
                                    "statusUI": transStatusToUI(item.status),
                                    "opt": "",
                                    "detail": {
                                        contentType: "url",
                                        content: "app/business/network/views/vpn/link/linkDetail.html"
                                    }
                                });
                            });
                            $scope.linkTable.data = data.vpnConnections;
                            for(var index in $scope.linkTable.data){
                                var item = $scope.linkTable.data[index];
                                try{
                                    item.createTime = new Date(item.createTime).format('yyyy-MM-dd hh:mm:ss');
                                    item.lastModifiedTime = new Date(item.lastModifiedTime).format('yyyy-MM-dd hh:mm:ss');
                                }catch(e){};
                            }

                        }
                    });
                },
                "deleteVpnConnection": function () {
                    var options = {
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "vpcId": $scope.params.vpcId,
                        "vdcId": $scope.params.vdcId,
                        "userId": $scope.params.userId,
                        "vpnConnectionID": $scope.params.vpnConnectionID
                    };
                    var deferred = networkServiceIns.deleteVpnConnection(options);
                    deferred.then(function () {
                        $scope.operate.queryVpnConnection();
                    });
                }
            };

            function transStatusToUI(status) {
                var statusUI = "";
                if (status === "READY") {
                    statusUI = i18n.common_term_ready_value;
                } else if (status === "PENDING") {
                    statusUI = i18n.common_term_creating_value;
                } else if (status === "DELETING") {
                    statusUI = i18n.common_term_deleting_value;
                } else if (status === "FAIL") {
                    statusUI = i18n.common_term_fail_label;
                } else if (status === "UPDATING") {
                    statusUI = i18n.common_term_updating_value;
                } else if (status === "DOWN") {
                    statusUI = i18n.common_term_stop_button;
                }
                else {
                    statusUI = i18n.common_term_unknown_value;
                }
                return statusUI;
            }

            $scope.$on("$viewContentLoaded", function () {
                $scope.operate.queryVpnConnection();
            });
        }
    ];
    return ctrl;
});
