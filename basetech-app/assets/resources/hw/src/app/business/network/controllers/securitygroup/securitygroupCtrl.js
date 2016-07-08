/*global define*/
define([
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "app/business/network/services/securitygroup/securityGroupService",
        "tiny-widgets/Window",
        "app/services/messageService",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Table",
        "tiny-lib/underscore",
        "fixtures/network/securitygroup/securitygroupFixture"
    ],
    function ($, angular, securityGroupService, Window, MessageService, _) {
        "use strict";
        var ctrl = ["$rootScope", "$scope", "$compile", "camel", "networkCommon", "exception", "$q",
            function ($rootScope, $scope, $compile, camel, networkCommon, exception, $q) {
                $scope.params = {
                    "cloudInfraId": networkCommon && networkCommon.cloudInfraId,
                    "vpcId": networkCommon && networkCommon.vpcId,
                    "azId": networkCommon && networkCommon.azId,
                    "userId": $scope.user.id,
                    "vdcId": $scope.user.vdcId,
                    "secGroupId": "",
                    "openstack": ($scope.user.cloudType === "ICT" ? true : false)
                };
                var i18n = $scope.i18n;
                //鉴权
                var SG_OPERATE = "559002";
                var privilegeList = $("html").scope().user.privilegeList;
                var securityGroupServiceIns = new securityGroupService(exception, $q, camel);
                var user = $rootScope.user;
                var isIT = user.cloudType === "IT";
                $scope.isIT = isIT;
                $scope.hasSGOperateRight = _.contains(privilegeList, SG_OPERATE);
                var DEFAULT_SG_NAME = "default";
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "name":"",
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
                    $scope.operator.query();
                };
                $scope.nextPage = function () {
                    if (!$scope.hasNextPage) {
                        return;
                    }
                    var item = $scope.securitygroupTable.datas[page.displayLength - 1] || {};
                    markers.push(item.sgID);
                    $scope.hasPrePage = true;
                    page.currentPage++;
                    $scope.operator.query();
                };
                $scope.pageSize = {
                    "id": "securitygroup-searchSizeSelector",
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
                        $scope.operator.query();
                    }
                };


                //刷新安全组列表
                $scope.refresh = {
                    "id": "securitygroup-refreshBtn",
                    "tips": i18n.common_term_fresh_button,
                    "click": function () {
                        $scope.operator.query();
                    }
                };
                //模糊搜索框
                $scope.searchBox = {
                    "id": "searchSgBox",
                    "placeholder": $scope.i18n.common_term_findName_prom,
                    "search": function (searchString) {
                        page.currentPage = 1;
                        $scope.operator.query();
                    }
                };
                //帮助
                $scope.help = {
                    "helpKey": "drawer_security",
                    "tips": i18n.common_term_help_label,
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };
                $scope.createBtn = {
                    "id": "securitygroup-createBtn",
                    "text": i18n.common_term_create_button,
                    "click": function () {
                        addSecGroup();
                    }
                };

                var columnsList = [
                    {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sgID);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.virtual_term_ruleNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sgRuleCount);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_memberNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sgMemberCount);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.security_term_GroupSharing_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.intraTrafficAllow);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSortable": false
                    }
                ];
                var columns = columnsList;
                if ($scope.params.openstack) {
                    columns = [];
                    columns.push(columnsList[0]);
                    columns.push(columnsList[1]);
                    columns.push(columnsList[2]);
                    columns.push(columnsList[5]);
                    columns.push(columnsList[6]);
                }
                $scope.securitygroupTable = {
                    "id": "securitygroup-list-table",
                    "paginationStyle": "full_numbers",
                    "enablePagination": isIT ? true : false,
                    "columnsDraggable": true,
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": columns,
                    "datas": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //鉴权
                        if (!$scope.hasSGOperateRight) {
                            return;
                        }
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        //规则数列
                        var ruleColumn = "<a href='javascript:void(0)' ng-click='getRule()'>" +
                            aData.sgRuleCount + "</a>";
                        var ruleLink = $compile($(ruleColumn));
                        var ruleScope = $scope.$new();
                        ruleScope.getRule = function () {
                            manageRule(aData.sgID);
                        };
                        var ruleNode = ruleLink(ruleScope);
                        $("td:eq(2)", nRow).html(ruleNode);
                        //IT下显示成员数列
                        if (!$scope.params.openstack) {
                            var memberColumn = "<a href='javascript:void(0)' ng-click='getMember()'>" +
                                aData.sgMemberCount + "</a>";
                            var memberLink = $compile($(memberColumn));
                            var memberScope = $scope.$new();
                            memberScope.getMember = function () {
                                queryMemberVM(aData.sgID);
                            };
                            var memberNode = memberLink(memberScope);
                            $("td:eq(3)", nRow).html(memberNode);
                        }
                        //操作列
                        var optColumn = "<a href='javascript:void(0)' ng-click='addRule()'> " + i18n.security_term_addRule_button + "</a> " +
                            "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton>";
                        //openstack默认安全组屏蔽"删除"操作
                        if ($scope.params.openstack && (aData.name === DEFAULT_SG_NAME)) {
                            optColumn = "<a href='javascript:void(0)' ng-click='addRule()'> " + i18n.security_term_addRule_button + "</a>";
                        }
                        var optLink = $compile($(optColumn));
                        var optScope = $scope.$new();
                        optScope.id = "securityGroupOptMore" + iDataIndex;
                        optScope.text = "<span class='btn-link'>" + i18n.common_term_more_button + "</span>";
                        optScope.addRule = function () {
                            addRule(aData.sgID);
                        };
                        optScope.content = [
                            {
                                title: i18n.common_term_modify_button,
                                id: "modifySecurityGroupBtn",
                                click: function () {
                                    modifySecGroup(aData.sgID);
                                }
                            },
                            {
                                title: "<div class='msg-info'>" + i18n.common_term_delete_button + "</div>",
                                id: "deleteSecurityGroupId",
                                click: function () {
                                    var options = {
                                        "content": i18n.security_group_del_info_confirm_msg,
                                        "callback": function () {
                                            $scope.operator.deleter(aData.sgID);
                                        }
                                    };
                                    new MessageService().confirmMsgBox(options);
                                }
                            }
                        ];
                        var optNode = optLink(optScope);
                        if ($scope.params.openstack) {
                            $("td:eq(4)", nRow).append(optNode);
                        } else {
                            $("td:eq(6)", nRow).append(optNode);
                        }
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operator.query();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operator.query();
                    }
                };
                //添加安全组规则
                function addRule(sgId) {
                    $scope.params.secGroupId = sgId;
                    var options = {
                        "winId": "addRuleWindowId",
                        title: i18n.security_term_addRule_button,
                        "params": $scope.params,
                        height: "400px",
                        width: "600px",
                        "content-type": "url",
                        "content": "app/business/network/views/securitygroup/addRule.html",
                        "buttons": null,
                        "close": function () {
                            $scope.operator.query();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                //添加安全组
                function addSecGroup() {
                    var height = "280px";
                    if ($scope.params.openstack) {
                        height = "220px";
                    }
                    var options = {
                        "winId": "createSecurityGroupWindowId",
                        title: i18n.security_term_addSG_button,
                        "params": $scope.params,
                        height: height,
                        width: "450px",
                        "content-type": "url",
                        "content": "app/business/network/views/securitygroup/createSecGroup.html",
                        "buttons": null,
                        "close": function () {
                            $scope.operator.query();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                //规则数
                function manageRule(sgID) {
                    $scope.params.secGroupId = sgID;
                    var options = {
                        "winId": "manageSecurityGroupRuleDialogId",
                        title: i18n.common_term_rule_label,
                        "params": $scope.params,
                        height: "600px",
                        width: "900px",
                        "content-type": "url",
                        "content": "app/business/network/views/securitygroup/rule.html",
                        "buttons": null,
                        "close": function () {
                            $scope.operator.query();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                //获取成员虚拟机数
                function queryMemberVM(sgID) {
                    $scope.params.secGroupId = sgID;
                    var options = {
                        "winId": "memberVMDialogId",
                        title: i18n.security_term_memberVM_label,
                        "params": $scope.params,
                        height: "600px",
                        width: "800px",
                        "content-type": "url",
                        "content": "app/business/network/views/securitygroup/memberVM.html",
                        "buttons": null,
                        "close": function () {
                            $scope.operator.query();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                //修改安全组
                function modifySecGroup(secGroupId) {
                    $scope.params.secGroupId = secGroupId;
                    var options = {
                        "winId": "modifySecurityGroupWindowId",
                        "title": i18n.common_term_modify_button,
                        "params": $scope.params,
                        "content-type": "url",
                        "content": "app/business/network/views/securitygroup/modifySecGroup.html",
                        height: "265px",
                        width: "450px",
                        "buttons": null,
                        "close": function () {
                            $scope.operator.query();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                //ajax命令操作
                $scope.operator = {
                    "query": function () {
                        var options = {
                            "user": user,
                            "vpcId": $scope.params.vpcId,
                            "limit": page.displayLength,
                            "cloudInfraId": $scope.params.cloudInfraId
                        };
                        if($("#" + $scope.searchBox.id).widget()){
                            page.name = $("#" + $scope.searchBox.id).widget().getValue();
                        }
                        if(isIT) {
                            options.start = page.getStart();
                            options.name = page.name;
                        }
                        else {
                            var length = markers.length;
                            options.start = markers[length-1] || null;
                        }
                        var deferred = securityGroupServiceIns.querySecurityGroup(options);
                        deferred.then(function (response) {
                            if (!response || !response.sgs) {
                                return;
                            }
                            var secGroupListRes = response.sgs;
                            _.each(secGroupListRes, function (item) {
                                item.operation = "";
                                //ICT场景下没有安全组内互通属性
                                if (!$scope.params.openstack) {
                                    if (item.intraTrafficAllow === 0) {
                                        item.intraTrafficAllow = i18n.common_term_no_label;
                                    } else if (item.intraTrafficAllow === 1) {
                                        item.intraTrafficAllow = i18n.common_term_yes_button;
                                    }
                                }
                            });
                            $scope.securitygroupTable.datas = secGroupListRes;
                            $scope.securitygroupTable.totalRecords = response.total;
                            $scope.securitygroupTable.displayLength = page.displayLength;
                            if (secGroupListRes.length < page.displayLength) {
                                $scope.hasNextPage = false;
                            }
                            else {
                                $scope.hasNextPage = true;
                            }
                            $("#securitygroup-list-table").widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });
                    },

                    "deleter": function (secGroupId) {
                        var options = {
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "secGroupId": secGroupId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "userId": $scope.params.userId
                        };
                        var promise = securityGroupServiceIns.deleteSecurityGroup(options);
                        promise.then(function () {
                            $scope.operator.query();
                        });
                    }
                };
                $scope.$on("$viewContentLoaded", function () {
                    $scope.operator.query();
                });
            }
        ];
        return ctrl;
    });
