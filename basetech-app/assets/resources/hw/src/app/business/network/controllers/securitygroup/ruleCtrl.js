define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "app/business/network/services/securitygroup/securityGroupService",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-widgets/Checkbox",
    "tiny-lib/underscore",
    "tiny-lib/encoder",
    "tiny-directives/Table",
    "tiny-lib/underscore",
    "fixtures/network/securitygroup/securitygroupFixture"
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, securityGroupService, Window, Message, Checkbox, _) {
    "use strict";
    var ctrl = ["$scope", "$compile", "camel", "$q",
        function ($scope, $compile, camel, $q) {
            //获取参数
            $scope.params = $("#manageSecurityGroupRuleDialogId").widget().option("params");
            //鉴权
            var SG_OPERATE = "559002";
            var privilegeList = $("html").scope().user.privilegeList;
            var exception = $("html").injector().get("exception");
            var securityGroupServiceIns = new securityGroupService(exception, $q, camel);
            var user = $("html").scope().user;
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            $scope.hasSGOperateRight = _.contains(privilegeList, SG_OPERATE);
            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            //刷新安全组列表
            $scope.refresh = {
                "id": "manageRule-refresh-Btn",
                "tips": i18n.common_term_fresh_button,
                "click": function () {
                    $scope.operator.queryRule();
                }
            };
            //添加安全组规则
            $scope.addBtn = {
                "id": "manageRule-addrule-Btn",
                "text": i18n.security_term_addRule_button,
                "click": function () {
                    addRule();
                }
            };
            var columnsList = [ {
                "sTitle": "ID",
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.ruleID);
                },
                "sWidth": "50px",
                "bSortable": false
            },  {
                "sTitle": i18n.common_term_protocol_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.ipProtocol);
                },
                "sWidth": "50px",
                "bSortable": false
            }, {
                "sTitle": i18n.common_term_source_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.source);
                },
                "sWidth": "180px",
                "bSortable": false
            }, {
                "sTitle": i18n.common_term_initiativePort_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.fromPortDisplay);
                },
                "bSortable": false
            }, {
                "sTitle": i18n.common_term_endPort_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.toPortDisplay);
                },
                "bSortable": false
            }, {
                "sTitle": "ICMP",
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.ICMPType);
                },
                "sWidth": "100px",
                "bSortable": false
            }, {
                "sTitle": i18n.common_term_direction_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.direction);
                },
                "sWidth": "50px",
                "bSortable": false
            }, {
                "sTitle": i18n.common_term_IPtype_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.ipVersion);
                },
                "sWidth": "50px",
                "bSortable": false
            }, {
                "sTitle": i18n.common_term_status_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.statusStr);
                },
                "sWidth": "50px",
                "bSortable": false
            }, {
                "sTitle": i18n.common_term_operation_label,
                "mData": "operation",
                "sWidth": "50px",
                "bSortable": false
            }];
            var columns = columnsList;
            if ($scope.params.openstack) {
                columns = [];
                columns.push(columnsList[0]);
                columns.push(columnsList[1]);
                columns.push(columnsList[2]);
                columns.push(columnsList[3]);
                columns.push(columnsList[4]);
                columns.push(columnsList[5]);
                columns.push(columnsList[6]);
                columns.push(columnsList[9]);
            }

            $scope.ruleModel = {
                "id": "manageRule-list-model",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "displayLength": 10,
                "totalRecords": 0,
                "columns": columns,
                "datas": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.operator.queryRule();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.operator.queryRule();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //鉴权
                    if (!$scope.hasSGOperateRight) {
                        return;
                    }
                    //tips提示
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(8)", nRow).addTitle();

                    //操作列
                    var optColumn = "";
                    if("PENDING" === aData.status || "DELETING" === aData.status){
                        optColumn = "<div><li class='disabled'>" + i18n.common_term_delete_button + "</li></div>";
                    }else{
                        optColumn = "<a href='javascript:void(0)' ng-click='deleteSingleRule()'>" + i18n.common_term_delete_button + "</a>";
                    }
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.deleteSingleRule = function () {
                        deleteSingleRule(aData.ruleID);
                    };
                    var optNode = optLink(optScope);
                    if ($scope.params.openstack) {
                        $("td:eq(7)", nRow).append(optNode);
                    } else {
                        $("td:eq(9)", nRow).append(optNode);
                    }
                }
            };
            //根据fromport、toPort获取ICMP类型
            function getICMPType(fromPort, toPort, ipVersion) {
                var icmpType = "";
                //IPv6的场景
                if (ipVersion === 6) {
                    if (fromPort === -1 && toPort === -1) {
                        icmpType = "Any";
                    } else {
                        icmpType = i18n.common_term_type_label + ":" + fromPort;
                        icmpType += ", " + i18n.common_term_code_label + ":" + toPort;
                    }
                } else {
                    var arr = [{
                        "name": "Any",
                        "fromPort": -1,
                        "toPort": -1
                    }, {
                        "name": "Echo",
                        "fromPort": 8,
                        "toPort": 0
                    }, {
                        "name": "Echo reply",
                        "fromPort": 0,
                        "toPort": 0
                    }, {
                        "name": "Fragment need DF set",
                        "fromPort": 3,
                        "toPort": 4
                    }, {
                        "name": "Host redirect",
                        "fromPort": 5,
                        "toPort": 1
                    }, {
                        "name": "Host TOS redirect",
                        "fromPort": 5,
                        "toPort": 3
                    }, {
                        "name": "Host unreachable",
                        "fromPort": 3,
                        "toPort": 1
                    }, {
                        "name": "Information reply",
                        "fromPort": 16,
                        "toPort": 0
                    }, {
                        "name": "Information request",
                        "fromPort": 15,
                        "toPort": 0
                    }, {
                        "name": "Net redirect",
                        "fromPort": 5,
                        "toPort": 0
                    }, {
                        "name": "Net TOS redirect",
                        "fromPort": 5,
                        "toPort": 2
                    }, {
                        "name": "Net unreachable",
                        "fromPort": 3,
                        "toPort": 0
                    }, {
                        "name": "Parameter problem",
                        "fromPort": 12,
                        "toPort": 0
                    }, {
                        "name": "Port unreachable",
                        "fromPort": 3,
                        "toPort": 3
                    }, {
                        "name": "Protocol unreachable",
                        "fromPort": 3,
                        "toPort": 2
                    }, {
                        "name": "Reassembly timeout",
                        "fromPort": 11,
                        "toPort": 1
                    }, {
                        "name": "Source quench",
                        "fromPort": 4,
                        "toPort": 0
                    }, {
                        "name": "Source route failed",
                        "fromPort": 3,
                        "toPort": 5
                    }, {
                        "name": "Timestamp reply",
                        "fromPort": 14,
                        "toPort": 0
                    }, {
                        "name": "Timestamp request",
                        "fromPort": 13,
                        "toPort": 0
                    }, {
                        "name": "TTL exceeded",
                        "fromPort": 11,
                        "toPort": 0
                    }];
                    for (var index in arr) {
                        if ((arr[index].fromPort === fromPort) && (arr[index].toPort === toPort)) {
                            icmpType = arr[index].name;
                            break;
                        }
                    }
                }
                return icmpType;
            }

            // 当前勾选的规则
            $scope.selectedRules = [];
            //勾选、去勾选规则
            function selectRules(ruleId, checked) {
                var selected = $scope.selectedRules;
                if (checked) {
                    selected.push(ruleId);
                } else {
                    for (var i = 0; i < selected.length; i++) {
                        if (selected[i] === ruleId) {
                            selected.splice(i, 1);
                        }
                    }
                }
                //表头复选框
                var headCheck = $("#ruleTableHeadCheckbox").widget();
                if (selected.length < $("#manageRule-list-model").widget().options.data.length) {
                    headCheck.option("checked", false);
                } else {
                    headCheck.option("checked", true);
                }
            }

            //生成一个checkbox放在表头处
            var tblHeadCheckbox = new Checkbox({
                "id": "ruleTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    var rules = $scope.ruleModel.datas;
                    var isChecked = $("#ruleTableHeadCheckbox").widget().option("checked");
                    for (var i = 0; i < rules.length; i++) {
                        $("#secGroupRuleListCheckboxId" + i).widget().option("checked", isChecked);
                    }

                    // 将已勾选的规则id保存到selectedRules
                    $scope.selectedRules = [];
                    if (isChecked && rules) {
                        _.each(rules, function (item) {
                            $scope.selectedRules.push(item.id);
                        });
                    }
                }
            });
            //删除单条规则
            function deleteSingleRule(ruleID) {
                var deleteMsg = new Message({
                    "type": "prompt",
                    "title": i18n.common_term_confirm_label,
                    "content": i18n.security_rule_del_info_confirm_msg,
                    "height": "120px",
                    "width": "350px",
                    "buttons": [{
                        "label": i18n.common_term_ok_button,
                        "accessKey": '2',
                        "key": "okBtn",
                        majorBtn : true,
                        "default": true
                    }, {
                        "label": i18n.common_term_cancle_button,
                        "accessKey": '3',
                        "key": "cancelBtn",
                        "default": false
                    }]
                });
                deleteMsg.setButton("okBtn", function () {
                    $scope.operator.deleteSingleRule(ruleID);
                    deleteMsg.destroy();
                });
                deleteMsg.setButton("cancelBtn", function () {
                    deleteMsg.destroy();
                });
                deleteMsg.show();
            }

            //添加安全组规则
            function addRule() {
                var options = {
                    "winId": "addRuleWindowId",
                    "title": i18n.security_term_addRule_button,
                    "params": $scope.params,
                    "height": "400px",
                    "width": "600px",
                    "content-type": "url",
                    "content": "app/business/network/views/securitygroup/addRule.html",
                    "buttons": null,
                    "close": function () {
                        $scope.operator.queryRule();
                    }
                };
                var win = new Window(options);
                win.show();
            }

            //ajax命令操作
            $scope.operator = {
                "queryRule": function () {
                    var options = {
                        "user": user,
                        "vpcId": $scope.params.vpcId,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "secGroupId": $scope.params.secGroupId,
                        "start": page.getStart(),
                        "limit": page.displayLength
                    };
                    var deferred = securityGroupServiceIns.querySecurityGroupRules(options);
                    deferred.then(function (response) {
                        if (!response || !response.rules) {
                            return;
                        }
                        var ruleListRes = response.rules;
                        _.each(ruleListRes, function (item) {
                            item.operation = "";
                            item.statusStr = $scope.getStatus(item.status && item.status.toUpperCase());
                            //源 接口字段中 allowedSGID与ipRange 二选一
                            item.source = item.ipRange;
                            if (!item.ipRange || item.ipRange === "") {
                                item.source = item.allowedSGID;
                            }
                            //TCP/UDP协议的源端口，ICMP协议的type类型
                            if (item.ipProtocol.toUpperCase() === "TCP" || item.ipProtocol.toUpperCase() === "UDP") {
                                item.fromPortDisplay = item.fromPort;
                                item.toPortDisplay = item.toPort;
                                item.ICMPType = "-";
                            } else if (item.ipProtocol.toUpperCase() === "ICMP") {
                                item.ICMPType = getICMPType(item.fromPort, item.toPort, item.ipVersion);
                                item.fromPortDisplay = "-";
                                item.toPortDisplay = "-";
                            } else {
                                item.ICMPType = "-";
                                item.fromPortDisplay = "-";
                                item.toPortDisplay = "-";
                            }
                            //规则方向，ICT用到
                            if (item.direction === 0) {
                                item.direction = i18n.security_term_inDirection_label;
                            } else if (item.direction === 1) {
                                item.direction = i18n.security_term_outWay_label;
                            }
                            //IP类型，4表示IPv4,6表示IPv6
                            if (item.ipVersion === 4) {
                                item.ipVersion = "IPv4";
                            } else if (item.ipVersion === 6) {
                                item.ipVersion = "IPv6";
                            }
                        });
                        $scope.ruleModel.datas = ruleListRes;
                        $scope.ruleModel.totalRecords = response.total;
                        $scope.ruleModel.displayLength = page.displayLength;
                        $("#" + $scope.ruleModel.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });

                        //清空已勾选规则
                        $scope.selectedRules = [];
                    });
                },

                "deleteSingleRule": function (ruleId) {
                    var options = {
                        "user": user,
                        "vpcId": $scope.params.vpcId,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "secGroupId": $scope.params.secGroupId,
                        "ruleId": ruleId
                    };
                    var deferred = securityGroupServiceIns.deleteSecurityGroupRules(options);
                    deferred.then(function (data) {
                        $scope.operator.queryRule();
                    });
                }
            };

            $scope.getStatus = function (status) {
                var str = "";
                switch (status) {
                case "READY":
                    str = i18n.common_term_natural_value;
                    break;
                case "PENDING":
                    str = i18n.common_term_creating_value;
                    break;
                case "CREATEFAIL":
                    str = i18n.common_term_createFail_value;
                    break;
                case "DELETING":
                    str = i18n.common_term_deleting_value;
                    break;
                case "DELETEFAIL":
                    str = i18n.common_term_deleteFail_value;
                    break;
                default:
                    str = i18n.common_term_unknown_value;
                    break;
                }
                return str;
            };

            $scope.operator.queryRule();
        }
    ];
    var module = angular.module("manageRuleModule", ["ng", "wcc", "ngSanitize"]);
    module.controller("manageRuleCtrl", ctrl);
    module.service("camel", http);
    return module;
});
