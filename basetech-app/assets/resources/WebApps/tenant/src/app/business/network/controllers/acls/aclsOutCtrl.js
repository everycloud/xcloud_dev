define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/business/network/services/acls/aclsService",
        "app/services/messageService",
        "tiny-widgets/Window",
        "tiny-widgets/Message",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min",
        "tiny-lib/underscore",
        "fixtures/network/acls/aclsFixture"
    ],
    function ($, angular, aclsService, MessageService, Window, Message, _) {
        "use strict";
        var ctrl = ["$scope", "$compile", "$q", "camel", "networkCommon", "exception",
            function ($scope, $compile, $q, camel, networkCommon, exception) {
                var params = {
                    "cloudInfraId": networkCommon && networkCommon.cloudInfraId,
                    "vpcId": networkCommon && networkCommon.vpcId,
                    "azId": networkCommon && networkCommon.azId,
                    "userId": $scope.user.id,
                    "vdcId": $scope.user.vdcId,
                    "direction": 2,
                    "innerZone": ""
                };
                var i18n = $scope.i18n;
                var selectRuleType = "1";
                var selectProtocolType = "";
                var locale = $scope.urlParams.lang;
                //鉴权
                var ACLS_OPERATE = "554002";
                var privilegeList = $("html").scope().user.privilegeList;
                $scope.hasACLSOperateRight = _.contains(privilegeList, ACLS_OPERATE);
                // 公共服务实例
                var aclsServiceIns = new aclsService(exception, $q, camel);
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                //刷新按钮
                $scope.refresh = {
                    "id": "networkACLsAclsoutFreshBtn",
                    "tips": i18n.common_term_fresh_button,
                    "click": function () {
                        $scope.command.queryFirewallRule();
                    }
                };
                $scope.searchRuleType = {
                    "id": "networkACLsAclsoutSelectRuleType",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "1",
                            "label": i18n.common_term_InDomain_label,
                            "checked": true
                        },
                        {
                            "selectId": "2",
                            "label": i18n.common_term_InterDomain_label
                        }
                    ],
                    "change": function () {
                        selectRuleType = $("#" + $scope.searchRuleType.id).widget().getSelectedId();
                        $scope.aclsOutTable.columns = getColumns();
                        //页码置1
                        page.currentPage = 1;
                        $scope.command.queryFirewallRule();
                    }
                };
                $scope.searchProtocolType = {
                    "id": "networkACLsAclsOutSearchProtocolType",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "",
                            "label": i18n.common_term_allProtocol_label,
                            "checked": true
                        },
                        {
                            "selectId": "TCP",
                            "label": "TCP"
                        },
                        {
                            "selectId": "UDP",
                            "label": "UDP"
                        },
                        {
                            "selectId": "ICMP",
                            "label": "ICMP"
                        },
                        {
                            "selectId": "ANY",
                            "label": "ANY"
                        }
                    ],
                    "change": function () {
                        selectProtocolType = $("#" + $scope.searchProtocolType.id).widget().getSelectedId();
                        //页码置1
                        page.currentPage = 1;
                        $scope.command.queryFirewallRule();
                    }
                };
                $scope.createBtn = {
                    "id": "networkACLsAclsoutCreateBtn",
                    "text": i18n.security_term_addRule_button,
                    "icon": {
                        left: "opt-add"
                    },
                    "click": function () {
                        var options = {
                            "winId": "networkACLsCreateAclRuleWin",
                            "params": params,
                            title: i18n.security_term_addRule_button,
                            height: "450px",
                            width: locale === "zh" ? "520px" : "700px",
                            "content-type": "url",
                            "content": "app/business/network/views/acls/aclsCreateRule.html",
                            "buttons": null,
                            "close": function () {
                                $scope.command.queryFirewallRule();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };

                function getColumns() {
                    //域内显示列
                    var columns = [
                        {
                            "sTitle": i18n.common_term_priority_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ruleID);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.firewallRuleID);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusDisplay);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_protocol_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.protocol);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.vpc_term_net_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.networkName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_IPandMask_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ipvAddrDis);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.vpc_term_targetPortRange_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.portRangeDis);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.acl_term_ICMPtype_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.icmpTypeDis);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_policy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.action);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "bSortable": false
                        }
                    ];
                    //域间显示列
                    if (selectRuleType === "2") {
                        columns = [
                            {
                                "sTitle": i18n.common_term_status_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.statusDisplay);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.common_term_Number_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.ruleID);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": "ID",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.firewallRuleID);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.common_term_protocol_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.protocol);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.eip_term_eip_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.eipAddr);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.common_term_IPandMask_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.ipvAddrDis);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.vpc_term_targetPortRange_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.portRangeDis);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.acl_term_ICMPtype_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.icmpTypeDis);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.common_term_policy_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.action);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.acl_term_externalDomain_label,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.outerZone);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": i18n.common_term_operation_label,
                                "mData": "opt",
                                "bSortable": false
                            }
                        ];
                    }
                    return columns;
                }

                $scope.aclsOutTable = {
                    "id": "networkACLsAclsoutTable",
                    "paginationStyle": "full_numbers",
                    "columnsDraggable": true,
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": getColumns(),
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        if (!$scope.hasACLSOperateRight) {
                            return;
                        }

                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        $("td:eq(6)", nRow).addTitle();

                        //操作列
                        var optColumn = "";
                        if("PENDING" === aData.status || "DELETING" === aData.status){
                            optColumn = "<div><li class='disabled'>" + i18n.common_term_delete_button + "</li></div>";
                        }else{
                            optColumn = "<a href='javascript:void(0)' ng-click='delACLsRule()'>" + i18n.common_term_delete_button + "</a>";
                        }
                        var optLink = $compile($(optColumn));
                        var optScope = $scope.$new();
                        optScope.delACLsRule = function () {
                            delACLsRule(aData.firewallRuleID);
                        };
                        var optNode = optLink(optScope);
                        if (selectRuleType === "1") {
                            $("td:eq(9)", nRow).append(optNode);
                        } else if (selectRuleType === "2") {
                            $("td:eq(10)", nRow).append(optNode);
                        }
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.queryFirewallRule();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.queryFirewallRule();
                    }
                };

                //删除ACL规则
                function delACLsRule(aclsRuleId) {
                    new MessageService().confirmMsgBox({
                        "content": i18n.common_term_delConfirm_msg,
                        "callback": function () {
                            $scope.command.deleteFirewallRule(aclsRuleId);
                        }
                    });
                }

                //ICMP协议类型、编码封装
                $scope.ICMP = {
                    "icmpArray": [
                        {
                            "name": "Any",
                            "icmpType": -1,
                            "icmpCode": -1
                        },
                        {
                            "name": "Echo",
                            "icmpType": 8,
                            "icmpCode": 0
                        },
                        {
                            "name": "Echo reply",
                            "icmpType": 0,
                            "icmpCode": 0
                        },
                        {
                            "name": "Fragment need DF set",
                            "icmpType": 3,
                            "icmpCode": 4
                        },
                        {
                            "name": "Host redirect",
                            "icmpType": 5,
                            "icmpCode": 1
                        },
                        {
                            "name": "Host TOS redirect",
                            "icmpType": 5,
                            "icmpCode": 3
                        },
                        {
                            "name": "Host unreachable",
                            "icmpType": 3,
                            "icmpCode": 1
                        },
                        {
                            "name": "Information reply",
                            "icmpType": 16,
                            "icmpCode": 0
                        },
                        {
                            "name": "Information request",
                            "icmpType": 15,
                            "icmpCode": 0
                        },
                        {
                            "name": "Net redirect",
                            "icmpType": 5,
                            "icmpCode": 0
                        },
                        {
                            "name": "Net TOS redirect",
                            "icmpType": 5,
                            "icmpCode": 2
                        },
                        {
                            "name": "Net unreachable",
                            "icmpType": 3,
                            "icmpCode": 0
                        },
                        {
                            "name": "Parameter problem",
                            "icmpType": 12,
                            "icmpCode": 0
                        },
                        {
                            "name": "Port unreachable",
                            "icmpType": 3,
                            "icmpCode": 3
                        },
                        {
                            "name": "Protocol unreachable",
                            "icmpType": 3,
                            "icmpCode": 2
                        },
                        {
                            "name": "Reassembly timeout",
                            "icmpType": 11,
                            "icmpCode": 1
                        },
                        {
                            "name": "Source quench",
                            "icmpType": 4,
                            "icmpCode": 0
                        },
                        {
                            "name": "Source route failed",
                            "icmpType": 3,
                            "icmpCode": 5
                        },
                        {
                            "name": "Timestamp reply",
                            "icmpType": 14,
                            "icmpCode": 0
                        },
                        {
                            "name": "Timestamp request",
                            "icmpType": 13,
                            "icmpCode": 0
                        },
                        {
                            "name": "TTL exceeded",
                            "icmpType": 11,
                            "icmpCode": 0
                        }
                    ],
                    "getIcmpName": function (icmpType, icmpCode) {
                        var icmpName = null;
                        var arr = $scope.ICMP.icmpArray;
                        _.each(arr, function (item) {
                            if ((item.icmpType === icmpType) && (item.icmpCode === icmpCode)) {
                                icmpName = item.name;
                                return;
                            }
                        });
                        return icmpName;
                    }
                };
                //显示状态
                function getStatus(status) {
                    var statusStr = "";
                    switch (status) {
                        case "READY":
                            statusStr = i18n.common_term_ready_value;
                            break;
                        case "PENDING":
                            statusStr = i18n.common_term_creating_value;
                            break;
                        case "DELETING":
                            statusStr = i18n.common_term_deleting_value;
                            break;
                        case "FAIL":
                            statusStr = i18n.common_term_fail_label;
                            break;
                        default:
                            statusStr = "";
                            break;
                    }
                    return statusStr;
                }

                //表格数据处理
                function dealTableData(item) {
                    item.statusDisplay = getStatus(item.status);
                    item.ipvAddrDis = item.ipAddr + "/" + item.ipPrefix;
                    //协议
                    if (item.protocol === "ICMP") {
                        item.portRangeDis = "-";
                        item.icmpTypeDis = $scope.ICMP.getIcmpName(item.icmpType, item.icmpCode);
                    } else if (item.protocol === "ANY") {
                        item.portRangeDis = "-";
                        item.icmpTypeDis = "-";
                    } else {
                        item.portRangeDis = item.startPort + "-" + item.endPort;
                        item.icmpTypeDis = "-";
                    }
                    //策略
                    if (item.action && (item.action.toLowerCase() === "permit")) {
                        item.action = i18n.common_term_allow_value;
                    } else if (item.action && ( item.action.toLowerCase() === "deny")) {
                        item.action = i18n.common_term_refuse_value;
                    }
                    item.opt = "";
                }

                //Ajax命令
                $scope.command = {
                    //查询规则列表
                    "queryFirewallRule": function () {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "ruleType": selectRuleType,
                            "protocol": selectProtocolType,
                            "direction": 2,
                            "vdcId": params.vdcId,
                            "userId": params.userId,
                            "start": page.getStart(),
                            "limit": page.displayLength
                        };
                        var deferred = aclsServiceIns.queryFirewallRule(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            var firewallRulesRes = data.firewallRules;
                            _.each(firewallRulesRes, dealTableData);
                            $scope.aclsOutTable.data = firewallRulesRes;
                            $scope.aclsOutTable.totalRecords = data.total;
                            $scope.aclsOutTable.displayLength = page.displayLength;
                            $("#" + $scope.aclsOutTable.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });
                    },
                    //删除规则
                    "deleteFirewallRule": function (aclRuleId) {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vdcId": params.vdcId,
                            "vpcId": params.vpcId,
                            "userId": params.userId,
                            "id": aclRuleId
                        };
                        var deferred = aclsServiceIns.deleteFirewallRule(options);
                        deferred.then(function (data) {
                            $scope.command.queryFirewallRule();
                        });
                    }
                };
                $scope.$on("$viewContentLoaded", function () {
                    $scope.command.queryFirewallRule();
                });
            }
        ];
        return ctrl;
    });
