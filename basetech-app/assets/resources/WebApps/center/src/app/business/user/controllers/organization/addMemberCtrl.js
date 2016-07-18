/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/orgService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    "tiny-widgets/Checkbox",
    "fixtures/userFixture"
],
    function ($, angular, httpService, OrgService, ExceptionService, MessageService, commonService, Checkbox) {
        "use strict";
        var addMemberCtrl = ["$scope", "$compile", "camel",
                function ($scope, $compile, camel) {
                    var $rootScope = $("html").scope();
                    var user = $rootScope.user;
                    var i18n = $rootScope.i18n;
                    var addMemberWindowWidget = $("#addMemberWindowId").widget();
                    var orgId = addMemberWindowWidget.option("orgId");
                    var roleValues = [];
                    var DEFAULT_PAGE_NUM = commonService.DEFAULT_TABLE_PAGE_LENGTH;

                    var showMembers = [];
                    var selectedMembers = [];

                    var rolePrefix = "roleSelect_";
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
                                if (list[i].id !== user.id &&!ifChecked(list[i].id)) {
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
                            //不能操作自己
                            member.id !== user.id && selectedMembers.push(member);
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
                    $scope.memberSelectModel = {
                        "memberSelectLabel": (i18n.org_term_chooseVDCmember_label || "VDC成员选择") + ":",
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
                        "hideTotalRecords": false,
                        "showDetails": false,
                        "renderRow": function (row, dataitem, index) {
                            var memberId = dataitem.id;

                            var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                                "<tiny-checkbox text='' id='id' disable='disable' checked='checked' change='change()'></tiny-checkbox>" +
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
                                selectMember(dataitem, checked);

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
                                "sTitle": i18n.common_term_role_label || "角色",
                                "mData": "",
                                "sClass": "role",
                                "bSortable": false,
                                "sWidth": 160
                            },
                            {
                                "sTitle": i18n.common_term_operation_label || "操作",
                                "mData": "",
                                "bSortable": false,
                                "sClass": "del",
                                "sWidth": 50
                            }
                        ],
                        "pagination": false,
                        "renderRow": function (row, dataitem, index) {
                            var deleteText = i18n.common_term_delete_button || "删除";
                            var delTemplate = "<a href='javascript:void 0;' ng-click='remove()'>" + deleteText + "</a>";
                            var compiledDelTemplate = $compile(delTemplate);
                            var delDomScope = $scope.$new();
                            delDomScope.remove = function () {
                                selectMember(dataitem, false);
                            };
                            var delDom = compiledDelTemplate(delDomScope);
                            $("td.del", row).append(delDom);

                            var roleTemplate = '<tiny-select id="selectId" values="values" mode="selectMode" width="selectWidth" change="change()"></tiny-select>';
                            var compiledRoleTemplate = $compile(roleTemplate);
                            var roleDomScope = $scope.$new();
                            selectedMembers[index].values = $.extend(true, [], selectedMembers[index].values || roleValues);
                            roleDomScope.selectId = rolePrefix + dataitem.id;
                            roleDomScope.values = selectedMembers[index].values;
                            roleDomScope.selectWidth = "160px";
                            roleDomScope.selectMode = "multiple";
                            roleDomScope.change = function () {
                                var SPER = ";";
                                var select = $("#" + roleDomScope.selectId).widget();
                                var roleIds = select.getSelectedId();
                                var roleIdsString = SPER + roleIds.join(SPER) + SPER;
                                var values = selectedMembers[index].values;
                                for (var i = 0, len = values.length; i < len; i++) {
                                    values[i].checked = roleIdsString.indexOf(SPER + values[i].selectId + SPER) > -1;
                                }
                            };
                            var privilegeDom = compiledRoleTemplate(roleDomScope);
                            $("td.role", row).append(privilegeDom);
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
                        "vdcId": orgId,
                        "user-name": ""
                    };
                    var parseTableData = function (response) {
                        response = response || {userList: [], total: 0};
                        showMembers = response.userList;
                        $scope.$apply(function () {
                            $scope.leftTable.data = showMembers;
                            $scope.leftTable.totalRecords = response.total;
                        });
                        renderTbHeaderCheckbox(showMembers);
                    };

                    $scope.operator = {
                        "initCanSelectMember": function () {
                            var deferred = camel.get({
                                "url": {
                                    s: "/goku/rest/fancy/v1.5/{tenant_id}/users/list",
                                    o: {
                                        "tenant_id": "1"
                                    }
                                },
                                "params": $scope.searchModel,
                                "userId": user.id
                            });
                            deferred.success(function (response) {
                                parseTableData(response);
                            });
                        },
                        //获取所有业务类角色
                        "getAllServiceRole": function () {
                            var deferred = camel.get({
                                "url": {
                                    s: "/goku/rest/v1.5/{tenant_id}/roles?type={roleType}",
                                    o: {
                                        "tenant_id": 1,
                                        "roleType": "SERVICE_ROLE"
                                    }
                                },
                                "params": {},
                                "userId": user.id
                            });
                            deferred.success(function (response) {
                                var roleList = response && response.roleList;
                                if (roleList) {
                                    for (var i = 0, len = roleList.length; i < len; i++) {
                                        roleValues.push({
                                            selectId: roleList[i].id,
                                            label: roleList[i].name,
                                            checked: true
                                        });
                                    }
                                }
                            });
                        },
                        "addMember": function () {
                            var list = [];
                            // 构造成员列表
                            for (var index = 0, len = selectedMembers.length; index < len; index++) {
                                var memberId = selectedMembers[index].id;
                                var member = {
                                    id: memberId
                                };
                                // 选择框的id
                                var selectWidgetId = rolePrefix + memberId;
                                var roleIds = $("#" + selectWidgetId).widget().getSelectedId();
                                if (!roleIds || roleIds.length === 0) {
                                    new MessageService().promptErrorMsgBox(i18n.org_vdc_add_para_chooseRole_msg || "请为已选择的VDC成员指定角色。");
                                    return;
                                }
                                member.roleIds = roleIds;
                                list.push(member);
                            }
                            var deferred = camel.post({
                                "url": {
                                    s: "/goku/rest/v1.5/vdcs/{vdcId}/users/action",
                                    o: {
                                        "vdcId": orgId
                                    }
                                },
                                "params": JSON.stringify({
                                    "addMember": {
                                        "userInfos": list
                                    }
                                }),
                                "userId": user.id
                            });
                            deferred.done(function (response) {
                                $scope.$apply(function () {
                                    addMemberWindowWidget.destroy();
                                });
                            });
                            deferred.fail(function (response) {
                                $scope.$apply(function () {
                                    new ExceptionService().doException(response);
                                });
                            });
                        }
                    };

                    // 获取可选角色
                    $scope.operator.getAllServiceRole();
                    // 初始化成员列表
                    $scope.operator.initCanSelectMember();
                }
            ]
            ;

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.memberManage.addMember", dependency);
        app.controller("userMgr.org.memberManage.addMember.ctrl", addMemberCtrl);
        app.service("camel", httpService);
        return app;
    })
;
