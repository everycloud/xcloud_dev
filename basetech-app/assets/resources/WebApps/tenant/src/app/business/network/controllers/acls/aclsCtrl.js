/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    "app/business/network/services/acls/aclsService",
    "app/business/network/services/router/routerService",
    "app/services/messageService",
    "fixtures/network/acls/aclsFixture",
    "fixtures/network/router/routerFixture"
], function ($, _, Window, aclsService, routerService, messageService) {
    "use strict";
    var ctrl = ["$scope", "$compile", "$q", "camel", "networkCommon", "exception", "message",
        function ($scope, $compile, $q, camel, networkCommon, exception, message) {
            var user = $scope.user;
            var isIT = user.cloudType === "IT";
            $scope.isIT = isIT;
            var i18n = $scope.i18n;
            var locale = $scope.urlParams.lang;
            //帮助
            $scope.help = {
                "helpKey": "drawer_acl",
                "tips": i18n.common_term_help_label,
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };
            if (isIT) {
                return;
            }
            //以下是ICT场景下的操作
            //不区分域内或者域间规则
            var params = {
                "cloudInfraId": networkCommon && networkCommon.cloudInfraId,
                "vpcId": networkCommon && networkCommon.vpcId,
                "azId": networkCommon && networkCommon.azId,
                "userId": $scope.user.id,
                "vdcId": $scope.user.vdcId,
                "ruleId": "",
                "insertType": ""
            };

            //鉴权
            var ACLS_OPERATE = "554002";
            var privilegeList = user.privilegeList;
            $scope.hasACLSOperateRight = _.contains(privilegeList, ACLS_OPERATE);
            var selectProtocolType = "";
            // 公共服务实例
            var aclsServiceIns = new aclsService(exception, $q, camel);
            var routerServiceIns = new routerService(exception, $q, camel);
            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            $scope.hasOpenACL = false;
            $scope.info = {
                ID: "ID:",
                status: i18n.common_term_status_label + ":",
                firewall: {
                    firewallID: "",
                    status: ""
                },
                "closeFirewallBtn": {
                    "id": "vpc-acl-close-firewall",
                    "text": i18n.acl_term_disableACL_button,
                    "disable": true,
                    "click": function () {
                        var content = i18n.acl_general_disableACL_info_confirm_msg;
                        message.warnMsgBox({
                            "content": content,
                            "callback": function () {
                                $scope.command.deleteFirewall();
                            }
                        });
                    }
                },
                "refreshBtn": {
                    "id": "vpc-acl-refresh-firewall",
                    "text": i18n.common_term_fresh_button,
                    "click": function () {
                        $scope.command.queryFirewall();
                    }
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
                $scope.command.queryFirewallRule();
            };
            $scope.nextPage = function () {
                if (!$scope.hasNextPage) {
                    return;
                }
                var item = $scope.rulesTable.data[page.displayLength - 1] || {};
                markers.push(item.firewallRuleID);
                $scope.hasPrePage = true;
                page.currentPage++;
                $scope.command.queryFirewallRule();
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
                    $scope.command.queryFirewallRule();
                }
            };

            //刷新按钮
            $scope.refresh = {
                "id": "networkACLsRulesinFreshBtn",
                "tips": i18n.common_term_fresh_button,
                "click": function () {
                    $scope.command.queryFirewallRule();
                }
            };
            $scope.searchProtocolType = {
                "id": "networkACLsAclsSearchProtocolType",
                "width": "120",
                "values": [{
                    "selectId": "",
                    "label": i18n.common_term_allProtocol_label,
                    "checked": true
                }, {
                    "selectId": "TCP",
                    "label": "TCP"
                }, {
                    "selectId": "UDP",
                    "label": "UDP"
                }, {
                    "selectId": "ICMP",
                    "label": "ICMP"
                }],
                "change": function () {
                    selectProtocolType = $("#" + $scope.searchProtocolType.id).widget().getSelectedId();
                    $scope.command.queryFirewallRule();
                }
            };

            $scope.createBtn = {
                "id": "networkACLsRulesinCreateBtn",
                "text": i18n.security_term_addRule_button,
                "icon": {
                    left: "opt-add"
                },
                "click": function () {
                    params.ruleId = "";
                    params.insertType = "";
                    var options = {
                        "winId": "networkACLsCreateAclRuleWin",
                        "params": params,
                        title: i18n.security_term_addRule_button,
                        height: "550px",
                        width: locale === "zh" ? "520px" : "650px",
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
            $scope.rulesTable = {
                "id": "networkACLsRulesinTable",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
                "enablePagination": false,
                "totalRecords": 0,
                "columns": getColumns(),
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    if (!$scope.hasACLSOperateRight) {
                        return;
                    }
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                    $("td:eq(7)", nRow).addTitle();
                    //操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='delACLsRule()'>" + i18n.common_term_delete_button + "</a><span>&nbsp&nbsp</span>" +
                        "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.id = "aclsOptMore" + iDataIndex;
                    optScope.text = "<span class='btn-link'>" + i18n.common_term_more_button + "</span>"
                    optScope.delACLsRule = function () {
                        message.confirmMsgBox({
                            "content": i18n.common_term_delConfirm_msg,
                            "callback": function () {
                                $scope.command.deleteFirewallRule(aData.firewallRuleID);
                            }
                        });
                    };
                    optScope.content = [{
                        title: i18n.acl_term_addRuleForward_button,
                        id: "beforeInsertRuleBtn" + iDataIndex,
                        click: function () {
                            params.ruleId = aData.firewallRuleID;
                            params.insertType = "before";
                            var options = {
                                "winId": "networkACLsCreateAclRuleWin",
                                "params": params,
                                title: i18n.acl_term_addRuleForward_button,
                                height: "420px",
                                width: locale === "zh" ? "520px" : "650px",
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
                    }, {
                        title: "<div class='msg-info'>"+i18n.acl_term_addRuleBackward_button+"</div>",
                        id: "afterInsertRuleBtn" + iDataIndex,
                        click: function () {
                            params.ruleId = aData.firewallRuleID;
                            params.insertType = "after";
                            var options = {
                                "winId": "networkACLsCreateAclRuleWin",
                                "params": params,
                                title: i18n.acl_term_addRuleBackward_button,
                                height: "420px",
                                width: locale === "zh" ? "520px" : "650px",
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
                    }];
                    var optNode = optLink(optScope);
                    $("td:eq(9)", nRow).append(optNode);
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
            function getColumns() {
                return [{
                    "sTitle": i18n.common_term_priority_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ruleID);
                    },
                    "bSortable": false
                }, {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.firewallRuleID);
                    },
                    "bSortable": false
                },{
                    "sTitle": i18n.common_term_direction_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.direction);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_protocol_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.protocol);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_sourceIPandMask_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.srcIpAddr);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.vpc_term_sourcePortRange_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.srcPort);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_targetIPandMask_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.desIpAddr);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.vpc_term_targetPortRange_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.desPort);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_policy_label,
                    "mData": function (data) {
                        var action = getActionUI(data.action);
                        return $.encoder.encodeForHTML(action);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_operation_label,
                    "mData": "opt",
                    "bSortable": false
                }];
            }

            function getActionUI(action) {
                if(action === "permit" || action === "allow") {
                    return i18n.common_term_allow_value;
                }
                if(action === "deny") {
                    return i18n.common_term_refuse_value;
                }
                return "";
            }
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
                } else if (status === "DOWN"){
                    statusUI = i18n.common_term_stop_button;
                }
                else {
                    statusUI = i18n.common_term_unknown_value;
                }
                return statusUI;
            }
            //Ajax命令
            $scope.command = {
                ///查询规则列表
                "queryFirewallRule": function () {
                    var length = markers.length;
                    var options = {
                        "cloudInfraId": params.cloudInfraId,
                        "vpcId": params.vpcId,
                        "vdcId": params.vdcId,
                        "protocol": selectProtocolType,
                        "userId": params.userId,
                        "start": markers[length-1] || null,
                        "limit": page.displayLength
                    };
                    var deferred = aclsServiceIns.queryFirewallRule(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var firewallRulesRes = data.firewallRules;
                        for(var index in firewallRulesRes){
                            var item = firewallRulesRes[index];
                            item.direction = (1 == item.direction)?i18n.security_term_inDirection_label:i18n.security_term_outWay_label;
                        }
                        $scope.rulesTable.data = firewallRulesRes;
                        $scope.rulesTable.totalRecords = data.total;
                        $scope.rulesTable.displayLength = page.displayLength;
                        $("#" + $scope.rulesTable.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                        if (firewallRulesRes.length < page.displayLength) {
                            $scope.hasNextPage = false;
                        }
                        else {
                            $scope.hasNextPage = true;
                        }
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
                },
                //查询firewall
                "queryFirewall": function () {
                    var options = {
                        "vdcId": params.vdcId,
                        "vpcId": params.vpcId,
                        "userId": params.userId,
                        "cloudInfraId": params.cloudInfraId
                    };
                    var deferred = routerServiceIns.queryFirewall(options);
                    deferred.then(function (data) {
                        if (!data || !data.firewalls || data.firewalls.length <= 0) {
                            $scope.hasOpenACL = false;
                            return;
                        }
                        $scope.hasOpenACL = true;
                        var firewallStatus = data.firewalls[0].status;
                        if(firewallStatus === "PENDING" || firewallStatus === "DELETING" || firewallStatus === "UPDATING"){
                            $scope.info.closeFirewallBtn.disable = true;
                        }else{
                            $scope.info.closeFirewallBtn.disable = false;
                        }
                        $scope.info.firewall.firewallID = data.firewalls[0].id;
                        $scope.info.firewall.status = transStatusToUI(firewallStatus);
                    });
                },
                //关闭firewall
                "deleteFirewall": function () {
                    var options = {
                        "vdcId": params.vdcId,
                        "vpcId": params.vpcId,
                        "userId": params.userId,
                        "cloudInfraId": params.cloudInfraId,
                        "firewallID": $scope.info.firewall.firewallID
                    };
                    var deferred = routerServiceIns.deleteFirewall(options);
                    deferred.then(function () {
                        $scope.command.queryFirewall();
                    });
                },
                //打开firewall
                "openFirewall": function () {
                    var parameter = {
                        "name": "Firewall_" + params.vpcId
                    };
                    var options = {
                        "vdcId": params.vdcId,
                        "vpcId": params.vpcId,
                        "userId": params.userId,
                        "cloudInfraId": params.cloudInfraId,
                        "params": parameter
                    };
                    var deferred = routerServiceIns.createFirewall(options);
                    deferred.then(function (resp) {
                        $scope.command.queryFirewall();
                    });
                },
                //查询路由器
                "queryRouter": function () {
                    var promise = routerServiceIns.queryRouter({
                        "vdcId": params.vdcId,
                        "vpcId": params.vpcId,
                        "userId": params.userId,
                        "cloudInfraId": params.cloudInfraId,
                        "azId": params.azId
                    });
                    promise.then(function (data) {
                        if (!data || !data.routers || data.routers.length <= 0) {
                            new messageService().okMsgBox(i18n.nat_dnat_add_info_noRouter_msg);
                            return;
                        }
                        $scope.command.openFirewall();
                    });
                }
            };

            //当ui-view视图加载成功后的事件
            $scope.$on("$viewContentLoaded", function () {
                $scope.command.queryFirewall();
                $scope.command.queryFirewallRule();
            });
        }];
    return ctrl;
});
