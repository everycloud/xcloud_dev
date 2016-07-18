/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-20
 */
/* global define */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    "language/keyID",
    "app/services/httpService",
    "app/business/tenantUser/service/domainService",
    "app/services/messageService",
    "app/services/commonService",
    "app/business/tenantUser/service/userDomainService",
    "tiny-widgets/Checkbox",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "fixtures/userFixture"
],
    function ($, angular, sprintf, ngSanitize, keyIDI18n, httpService, DomainService, MessageService, commonService, userDomainService, Checkbox) {
        "use strict";

        var addMemberCtrl = ["$scope", "$compile", "camel", "$q",
            function ($scope, $compile, camel, $q) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var exception = $("#addMemberWindowId").widget().option("exception");
                $scope.domainId = $("#addMemberWindowId").widget().option("domainId") || "";
                $scope.serviceInstance = new userDomainService(exception, $q, camel);

                var addMemberWindowWidget = $("#addMemberWindowId").widget();
                var DEFAULT_PAGE_NUM = commonService.DEFAULT_TABLE_PAGE_LENGTH;

                var canSelectedMembers = [];
                var showMembers = [];
                var selectedMembers = [];

                var privilegePrefix = "privilegeSelect_";
                var idPrefix = "canSelectedMemberID_";
                var tblHeaderCheckbox = new Checkbox({
                    "checked": false,
                    "change": function () {
                        var list = showMembers;
                        var checkedAll = tblHeaderCheckbox.option("checked");
                        for (var i = 0, len = list.length; i < len; i++) {
                            var id = idPrefix + list[i].id;
                            //防止id有特殊字符串，不能做jq的选择器
                            var dom = document.getElementById(id);
                            if (dom) {
                                var checked = $(dom).widget().option("checked");
                                if (checked !== checkedAll && list[i].id !== user.id) {
                                    $(dom).widget().option("checked", checkedAll);
                                    selectMember(list[i], checkedAll, true);
                                }
                            }
                        }
                        $scope.$apply(function () {
                            $scope.rightTable.data = $.extend([], selectedMembers);
                        });
                    }
                });
                var ifChecked = function (id) {
                    var SPER = ";";
                    var selectedIds = [];
                    for (var j = 0, selectedLen = selectedMembers.length; j < selectedLen; j++) {
                        selectedIds.push(selectedMembers[j].id);
                    }
                    var selectedIdsStr = SPER + selectedIds.join(SPER) + SPER;
                    if (-1 === selectedIdsStr.indexOf(SPER + id + SPER)) {
                        return false;
                    }
                    return true;
                };
                var ifAllChecked = function (list) {
                    var len = list && list.length;
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            if (list[i].id !== user.id && !ifChecked(list[i].id)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
                };
                var renderTbHeaderCheckbox = function (list) {
                    var allChecked = ifAllChecked(list);
                    tblHeaderCheckbox.option("checked", allChecked);
                    tblHeaderCheckbox.rendTo($("#tableHeaderCheckbox"));
                };
                var selectMember = function (member, checked, disableChange) {
                    if (checked) {
                        if(member.id !== user.id){
                            !member.values && $scope.operator.setUserPrivilege(member);
                            selectedMembers.push(member);
                        }
                    } else {
                        for (var i = 0, len = selectedMembers.length; i < len; i++) {
                            if (selectedMembers[i].id === member.id) {
                                selectedMembers.splice(i, 1);
                                var dom = document.getElementById(idPrefix + member.id);
                                dom && $(dom).widget().option("checked", false);
                                break;
                            }
                        }
                    }
                    var allChecked = ifAllChecked(showMembers);
                    tblHeaderCheckbox.option("checked", allChecked);
                    $scope.addMemberSaveBtn.disable = !selectedMembers.length;
                    if (!disableChange) {
                        $scope.rightTable.data = $.extend([], selectedMembers);
                    }
                };

                $scope.domainId = addMemberWindowWidget.option("domainId") || "";
                $scope.domainService = new DomainService();
                $scope.memberSelectModel = {
                    "canSelectMemberLabel": i18n.common_term_waitChoose_value || "待选择",
                    "memberSelectedLabel": i18n.common_term_choosed_value || "已选择"
                };
                $scope.leftMemberSearchBox = {
                    "id": "leftMemberSearchBoxId",
                    "placeholder": i18n.user_term_findUserName_prom || "请输入用户名",
                    "width": "160px",
                    "suggestSize": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        var trimUserName = $.trim(searchString);
                        $scope.searchModel["user-name"] = trimUserName;
                        $scope.searchModel.start = 0;
                        $scope.operator.initCanSelectMember();
                    }
                };
                $scope.leftTable = {
                    "id": "addMemberLeftTableId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": "<div id='tableHeaderCheckbox'></div>",
                            "bSortable": false,
                            "bSearchable": false,
                            "mData": "check",
                            "sClass": "check",
                            "sWidth": 26
                        },
                        {
                            "sTitle": i18n.common_term_userName_label || "用户名",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_desc_label || "描述",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        }
                    ],
                    "pagination": true,
                    "paginationStyle": "simple",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": DEFAULT_PAGE_NUM,
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "showDetails": false,
                    "renderRow": function (row, dataitem, index) {
                        var memberId = dataitem.id;

                        var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                            "<tiny-checkbox text='' id='id' checked='checked' change='change()' disable='disable'></tiny-checkbox>" +
                            "</div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = dataitem;
                        selBoxScope.id = idPrefix + memberId;
                        //不能操作自己
                        var userSelf = memberId === user.id;
                        selBoxScope.disable = userSelf;
                        selBoxScope.checked = userSelf ? false : ifChecked(memberId);
                        selBoxScope.change = function () {
                            var checked = $("#" + idPrefix + memberId).widget().option("checked");
                            selectMember(showMembers[index], checked);

                            var allChecked = ifAllChecked(showMembers);
                            tblHeaderCheckbox.option("checked", allChecked);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td.check", row).append(selBoxNode);
                    },

                    "callback": function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.initCanSelectMember();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.start = 0;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.initCanSelectMember();
                    }
                };
                $scope.rightTable = {
                    "id": "addMemberRightTableId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": i18n.common_term_userName_label || "用户名",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_authorizationSet_button || "权限设置",
                            "mData": "",
                            "sClass": "privilege",
                            "bSortable": false,
                            "sWidth": 160
                        },
                        {
                            "sTitle": i18n.common_term_operation_label || "操作",
                            "mData": "",
                            "bSortable": false,
                            "sClass": "del",
                            "sWidth": 90
                        }
                    ],
                    "pagination": false,
                    "renderRow": function (row, dataitem, index) {
                        var memberId = dataitem.id;

                        dataitem.checked = !!selectedMembers[memberId];
                        var deleteText = i18n.common_term_delete_button || "删除";
                        var delTemplate = "<a href='javascript:void 0;' ng-click='remove()'>" + deleteText + "</a>";
                        var compiledDelTemplate = $compile(delTemplate);
                        var delDomScope = $scope.$new();
                        delDomScope.remove = function () {
                            selectMember(dataitem, false);
                        };
                        var delDom = compiledDelTemplate(delDomScope);
                        $("td.del", row).append(delDom);

                        var privilegeTemplate = '<tiny-select id="selectId" values="values" mode="selectMode" width="selectWidth" change="change()"></tiny-select>';
                        var compiledPrivilegeTemplate = $compile(privilegeTemplate);
                        var privilegeDomScope = $scope.$new();
                        privilegeDomScope.selectId = privilegePrefix + dataitem.id;
                        privilegeDomScope.values = selectedMembers[index].values;
                        privilegeDomScope.selectWidth = "160px";
                        privilegeDomScope.selectMode = "multiple";
                        privilegeDomScope.change = function(){
                            var SPER = ";";
                            var select = $("#" + privilegeDomScope.selectId).widget();
                            var privilegeIds = select.getSelectedId();
                            var privilegeIdsString = SPER + privilegeIds.join(SPER) + SPER;
                            var values = selectedMembers[index].values;
                            for (var i = 0, len = values.length; i < len; i++) {
                                values[i].checked = privilegeIdsString.indexOf(SPER + values[i].selectId + SPER) > -1;
                            }
                        };
                        var privilegeDom = compiledPrivilegeTemplate(privilegeDomScope);
                        $("td.privilege", row).append(privilegeDom);
                    }
                };
                $scope.addMemberSaveBtn = {
                    "id": "addMemberSaveBtnId",
                    "text": i18n.common_term_save_label || "保存",
                    "disable": true,
                    "click": function () {
                        $scope.operator.addMember();
                    }
                };
                //取消按钮
                $scope.addMemberCancelBtn = {
                    "id": "addMemberCancelBtnId",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        addMemberWindowWidget.destroy();
                    }
                };
                $scope.searchModel = {
                    "start": 0,
                    "limit": DEFAULT_PAGE_NUM,
                    "user-name": ""
                };
                var parseTableData = function (response) {
                    response = response || {userOnDomain: [], total: 0};
                    showMembers = response.userOnDomain;
                    //fuck
                    for(var i= 0,len=showMembers.length;i<len;i++){
                        showMembers[i].id = showMembers[i].userId;
                        showMembers[i].name = showMembers[i].userName;
                        showMembers[i].description = showMembers[i].userDesc;
                    }

                    $scope.$apply(function () {
                        $scope.leftTable.data = showMembers;
                        $scope.leftTable.totalRecords = response.total;
                    });
                    renderTbHeaderCheckbox(showMembers);
                };
                $scope.operator = {
                    "initCanSelectMember": function () {
                        var promise = $scope.serviceInstance.queryCanAddDomianUser({
                            "user": user,
                            "id": $scope.domainId,
                            "params":$scope.searchModel
                        });
                        promise.then(function (response) {
                            parseTableData(response);
                        });
                    },
                    "setUserPrivilege": function (memberObject) {
                        var promise = $scope.serviceInstance.setUserPrivilege({
                            "user": user,
                            "id": memberObject.id
                        });
                        promise.then(function (response) {
                            $scope.$apply(function () {
                                var privilegeList = response && response.privilegeList;
                                if (privilegeList) {
                                    var userPrivileges = [];
                                    for (var index in privilegeList) {
                                        var privilegeName = privilegeList[index].name;
                                        var privilege = {
                                            "selectId": privilegeList[index].id,
                                            "label": i18n[privilegeName] || privilegeName,
                                            "checked": true
                                        };
                                        userPrivileges.push(privilege);
                                    }
                                    var selectId = privilegePrefix + memberObject.id;
                                    var selectWidget = $("#" + selectId).widget();
                                    selectWidget && selectWidget.option("values", userPrivileges);
                                    memberObject.values = userPrivileges;
                                }
                            });
                        });
                    },
                    "addMember": function () {
                        var list = [];
                        // 构造成员列表
                        for (var index = 0, len = selectedMembers.length; index < len; index++) {
                            var memberId = selectedMembers[index].id;
                            var member = {
                                userId: memberId
                            };
                            // 选择框的id
                            var selectWidgetId = privilegePrefix + memberId;
                            var privilegeIds = $("#" + selectWidgetId).widget().getSelectedId();
                            if (!privilegeIds || privilegeIds.length === 0) {
                                new MessageService().promptErrorMsgBox(i18n.domain_domain_add_para_chooseRight_msg || "请为成员指定权限");
                                return;
                            }
                            var domainPrivileges = [];
                            for (var i in privilegeIds) {
                                domainPrivileges.push({"id": privilegeIds[i]});
                            }
                            member.domainPrivileges = domainPrivileges;
                            list.push(member);
                        }
                        var promise = $scope.serviceInstance.addMember({
                            "user": user,
                            "params": {"list": list},
                            "domainId": $scope.domainId
                        });
                        promise.then(function (response) {
                            addMemberWindowWidget.destroy();
                        });
                    }
                };
                // 初始化成员列表
                $scope.operator.initCanSelectMember();
            }
        ];

        var dependency = ["ng", "wcc", "ngSanitize"];
        var app = angular.module("userMgr.domain.addMember", dependency);
        app.controller("userMgr.domain.addMember.ctrl", addMemberCtrl);
        app.service("camel", httpService);
        return app;
    });
