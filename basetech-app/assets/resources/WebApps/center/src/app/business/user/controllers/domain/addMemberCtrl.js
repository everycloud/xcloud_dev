define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/domainService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    "language/keyID",
    "tiny-widgets/Checkbox",
    "fixtures/userFixture"],
    function ($, angular, httpService, DomainService, ExceptionService, MessageService, commonService, keyID, Checkbox) {
        "use strict";
        var addMemberCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var $rootScope = $("html").scope();
            var user = $rootScope.user;
            var i18n = $rootScope.i18n;
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
                    if (member.id !== user.id) {
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
                    $scope.operator.initCanSelectMembers();
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
                    $scope.operator.initCanSelectMembers();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operator.initCanSelectMembers();
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
                        "sWidth": 50
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
                    privilegeDomScope.change = function () {
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
                showMembers = response.userOnDomain || [];
                for (var i = 0, len = showMembers.length; i < len; i++) {
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

            var setPrivilege = function (response, member) {
                var privilegeList = response && response.privilegeList;
                if (privilegeList) {
                    var userPrivileges = [];
                    for (var index in privilegeList) {
                        var privilegeName = privilegeList[index].name;
                        var privilege = {
                            "selectId": privilegeList[index].id,
                            "label": keyID[privilegeName] || privilegeName,
                            "checked": true
                        };
                        userPrivileges.push(privilege);
                    }
                    var selectId = privilegePrefix + member.id;
                    var selectWidget = $("#" + selectId).widget();
                    selectWidget && selectWidget.option("values", userPrivileges);
                    member.values = userPrivileges;
                }
            };

            var getSelectedMembers = function () {
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
                    if (!privilegeIds || !privilegeIds.length) {
                        new MessageService().promptErrorMsgBox(i18n.domain_domain_add_para_chooseRight_msg || "请为成员指定权限");
                        return null;
                    }
                    var domainPrivileges = [];
                    for (var i in privilegeIds) {
                        domainPrivileges.push({"id": privilegeIds[i]});
                    }
                    member.domainPrivileges = domainPrivileges;
                    list.push(member);
                }
                return list;
            };

            $scope.operator = {
                "initCanSelectMembers": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/fancy/v1.5/{tenant_id}/domains/{id}/users",
                            o: {
                                "tenant_id": "1",
                                "id": $scope.domainId
                            }
                        },
                        "params": $scope.searchModel,
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        parseTableData(response);
                    });
                },
                "setUserPrivilege": function (member) {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/{tenant_id}/privileges?user-id={user_id}&domain-privilege=true",
                            o: {
                                "tenant_id": "1",
                                "user_id": member.id
                            }
                        },
                        "params": {},
                        "userId": user.id,
                        "monitor": false
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            setPrivilege(response, member);
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            member.values = [];
                            new ExceptionService().doException(response);
                        });
                    });
                },

                "addMember": function () {
                    var list = getSelectedMembers();
                    if (list) {
                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/domains/{id}/users",
                                o: {
                                    "tenant_id": "1",
                                    "id": $scope.domainId
                                }
                            },
                            "params": JSON.stringify({
                                "list": list
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
                }
            };

            // 初始化成员列表
            $scope.operator.initCanSelectMembers();
        }];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.domain.addMember", dependency);
        app.controller("userMgr.domain.addMember.ctrl", addMemberCtrl);
        app.service("camel", httpService);
        return app;
    })
;
