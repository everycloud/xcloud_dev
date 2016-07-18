define(['jquery',
    "tiny-lib/angular",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/business/monitor/services/alarmService",
    "app/services/commonService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"
], function ($, angular, TextBox, Button, Window, Checkbox, Message, ExceptionService, AlarmService, CommonService, UnifyValid, ValidatorService) {
    "use strict";

    var alarmMailConfigCtrl = ["$scope", "$compile", "$state", "camel", "$q", '$stateParams',
        function ($scope, $compile, $state, camel, $q, $stateParams) {
            $scope.privilege = $("html").scope().user.privilege;
            $scope.operateRight = $scope.privilege.role_role_add_option_alarmHandle_value;
            var exception = new ExceptionService();
            var user = $("html").scope().user;
            $scope.currentItem = undefined;
            $scope.showWin = false;
            $scope.showWinTitle = $scope.i18n.alarm_term_addAlarmEmail_button;
            $scope.mode = "insert";
            $scope.isLocal = $scope.deployMode === "local";

            $scope.showMailViewWin = false;
            $scope.showMailViewWinTitle = $scope.i18n.alarm_term_chooseAlarm_label;
            $scope.showUserViewWin = false;
            $scope.showUserViewWinTitle = $scope.i18n.alarm_term_chooseUserInfo_label;

            $scope.mailAddressType = "other";
            $scope.mailAddressTypeValue = $scope.i18n.alarm_term_externalEmail_label;
            $scope.type = "level";
            $scope.typeValue = $scope.i18n.alarm_config_email_para_type_option_level_value;

            $scope.reqDefineParams = {};
            $scope.reqDefineParams.start = 0;
            $scope.reqDefineParams.limit = 10;
            $scope.checkboxDefineAlarmData = [];
            $scope.currentAlarmDefineItem = undefined;

            $scope.checkboxUserData = [];
            $scope.currentUserItem = undefined;
            $scope.reqUserParams = {};
            $scope.reqUserParams.start = 0;
            $scope.reqUserParams.limit = 10;

            $scope.recipientAlarmInfo = {};
            $scope.queryAlarmName = "";
            $scope.queryUserName = "";
            $scope.searchMailAlarmBox = {
                "id": "searchMailAlarmBox",
                "placeholder":  $scope.i18n.common_term_findAlarmName_prom || "请输入告警名称",
                "width": "200",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.queryAlarmName = searchString;
                    $scope.alarmGridViewTable.curPage = {
                        "pageIndex": 1
                    };
                    pageAlarmGridViewTable.currentPage = 1;
                    getDefineAlarmData();
                }
            };
            $scope.searchUserBox = {
                "id": "searchUserBox",
                "placeholder":  $scope.i18n.user_term_findUserName_prom || "请输入用户名",
                "width": "200",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.queryUserName = searchString;
                    $scope.userGridViewTable.curPage = {
                        "pageIndex": 1
                    };
                    pageUserGridViewTable.currentPage = 1;
                    getUserData();
                }
            };
            $scope.createBtn = {
                "id": "createBtn",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    resetRecipientAlarmInfo();
                    $scope.mode = "insert";
                    $scope.showWin = true;
                    $scope.showWinTitle = $scope.i18n.alarm_term_addAlarmEmail_button;
                    $scope.$digest();
                }
            };

            $scope.refreshBtn = {
                "id": "refreshBtn",
                "click": function () {
                    getData();
                }
            };

            $scope.saveBtn = {
                "id": "saveBtn",
                "text": $scope.i18n.common_term_save_label,
                "click": function () {

                    if ($scope.mode == "insert") {
                        insert();
                    } else {
                        update();
                    }
                }
            };

            function remove(id) {
                AlarmService.removeRecipientAlarmInfo(
                    id, user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                getData();
                                $scope.showWin = false;
                                $scope.showMailViewWin = false;
                            });
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    }, $scope.isLocal);
            }

            function checkData() {
                var msg = "";
                var forwardType = $scope.mailFormView.id.type;
                var levelList = [];
                var receiveAlarms = [];
                if (forwardType == "1") {
                    levelList = getLevelList();
                    if (levelList.length == 0) {
                        msg = ($scope.i18n.alarm_config_add_para_level_valid || "告警级别数据不能为空。");
                    }
                } else {
                    receiveAlarms = getReceiveAlarms();
                    if (receiveAlarms.length == 0) {
                        msg = ($scope.i18n.alarm_config_add_para_alarm_valid || "转发告警数据不能为空。");
                    }
                }

                if (msg != "") {
                    var options = {
                        type: "error",
                        content: msg,
                        height: "150px",
                        width: "300px"
                    }
                    var msg = new Message(options);
                    msg.show();
                    return false;
                }

                return true;
            }

            function insert() {

                if (!UnifyValid.FormValid($("#" + $scope.mailFormView.mailAddressControl.id))) {
                    return false;
                }

                if (!checkData()) {
                    return false;
                }

                var list = createRecipientAlarmListInfo();
                AlarmService.addRecipientAlarmInfo(
                    JSON.stringify({
                        "recipients": list
                    }), user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                getData();
                                $scope.showWin = false;
                                $scope.showMailViewWin = false;
                            });
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    }, $scope.isLocal);
            }

            function createRecipientAlarmListInfo() {
                var info = {};

                var forwardType = $scope.mailFormView.id.type;
                var levelList = [];
                var receiveAlarms = [];
                var startTime = $("#" + $scope.mailFormView.timeIds.searchStartTime).widget().getDateTime();
                if (startTime != "") {
                    startTime = CommonService.local2Utc(startTime);
                }
                var endTime = $("#" + $scope.mailFormView.timeIds.searchEndTime).widget().getDateTime();
                if (endTime != "") {
                    endTime = CommonService.local2Utc(endTime);
                }
                if (forwardType == "1") {
                    levelList = getLevelList();
                } else {
                    receiveAlarms = getReceiveAlarms();
                }
                var isSystemUser = $scope.mailFormView.id.mailAddress;

                var recipientAlarmList = [];

                if (isSystemUser == "0") {
                    var mailString = $("#" + $scope.mailFormView.mailAddressControl.id).widget().getValue();
                    var mailList = mailString.split(";");
                    for (var i = 0; i < mailList.length; i++) {
                        if (mailList[i] == "") {
                            continue;
                        }
                        var item = {};
                        item.recipientId = "";
                        item.userName = "";
                        item.userId = "";
                        item.recipient = mailList[i];
                        item.isSystemUser = isSystemUser;
                        item.startTime = startTime;
                        item.endTime = endTime;
                        item.forwardType = forwardType;
                        item.levelList = levelList;
                        item.receiveAlarms = receiveAlarms;
                        recipientAlarmList.push(item);
                    }
                } else {
                    for (var i = 0; i < $scope.selectUserGridViewTable.data.length; i++) {
                        var item = {};
                        item.recipientId = "";
                        item.userName = $scope.selectUserGridViewTable.data[i].name;
                        item.userId = $scope.selectUserGridViewTable.data[i].id;
                        item.recipient = $scope.selectUserGridViewTable.data[i].email;
                        item.isSystemUser = isSystemUser;
                        item.startTime = startTime;
                        item.endTime = endTime;
                        item.forwardType = forwardType;
                        item.levelList = levelList;
                        item.receiveAlarms = receiveAlarms;
                        recipientAlarmList.push(item);
                    }
                }

                return recipientAlarmList;

            }

            function getLevelList() {
                var levelList = [];
                if ($scope.mailFormView.checkBoxLevelValue["critical"] != false && $scope.mailFormView.checkBoxLevelValue["critical"] != undefined) {
                    levelList.push("critical");
                }
                if ($scope.mailFormView.checkBoxLevelValue["major"] != false && $scope.mailFormView.checkBoxLevelValue["major"] != undefined) {
                    levelList.push("major");
                }
                if ($scope.mailFormView.checkBoxLevelValue["minor"] != false && $scope.mailFormView.checkBoxLevelValue["minor"] != undefined) {
                    levelList.push("minor");
                }
                if ($scope.mailFormView.checkBoxLevelValue["warning"] != false && $scope.mailFormView.checkBoxLevelValue["warning"] != undefined) {
                    levelList.push("warning");
                }

                return levelList;
            }

            function getReceiveAlarms() {
                var list = [];
                for (var i = 0; i < $scope.selectAlarmGridViewTable.data.length; i++) {
                    var item = {};
                    item.alarmId = $scope.selectAlarmGridViewTable.data[i].alarmid;
                    item.alarmName = $scope.selectAlarmGridViewTable.data[i].alarmName;
                    item.componentType = $scope.selectAlarmGridViewTable.data[i].compType;
                    list.push(item);
                }

                return list;
            }

            function createRecipientAlarmInfo() {
                var info = $scope.recipientAlarmInfo;
                info.forwardType = $scope.mailFormView.id.type;

                info.startTime = $("#" + $scope.mailFormView.timeIds.searchStartTime).widget().getDateTime();
                if (info.startTime != "") {
                    info.startTime = CommonService.local2Utc(info.startTime);
                }
                info.endTime = $("#" + $scope.mailFormView.timeIds.searchEndTime).widget().getDateTime();
                if (info.endTime != "") {
                    info.endTime = CommonService.local2Utc(info.endTime);
                }
                if (info.forwardType == "1") {
                    info.levelList = [];
                    info.levelList = getLevelList();
                    info.receiveAlarms = [];
                } else {
                    info.levelList = [];
                    info.receiveAlarms = [];
                    info.receiveAlarms = getReceiveAlarms();
                }

                return info;

            }

            function update() {

                if (!checkData()) {
                    return false;
                }

                var inf = createRecipientAlarmInfo();
                var info = {};
                info.endTime = inf.endTime;
                info.startTime = inf.startTime;
                info.forwardType = inf.forwardType;
                info.levelList = inf.levelList;
                info.receiveAlarms = inf.receiveAlarms;
                AlarmService.modifyRecipientAlarmInfo(
                    JSON.stringify(info), inf.recipientId, user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                getData();
                                $scope.showWin = false;
                                $scope.showMailViewWin = false;
                            });
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    }, $scope.isLocal);
            }

            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $scope.showWin = false;
                    $scope.showMailViewWin = false;
                    $scope.$digest();
                }
            };
            $scope.cancelShowBtn = {
                "id": "cancelShowBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $scope.showWin = false;
                    $scope.showMailViewWin = false;
                    $scope.$digest();
                }
            };
            $scope.selectBtn = {
                "id": "selectBtn",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    getDefineAlarmData();
                    $scope.showMailViewWin = true;
                    $scope.showMailViewWinTitle = $scope.i18n.alarm_term_chooseAlarm_label;
                }
            };
            $scope.selectUserBtn = {
                "id": "selectUserBtn",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    getUserData();
                    $scope.showUserViewWin = true;
                }
            };

            $scope.saveUserBtn = {
                "id": "saveUserBtn",
                "text": $scope.i18n.common_term_save_label,
                "click": function () {
                    $scope.selectUserGridViewTable.data = $scope.checkboxUserData;
                    $("#selectUserGridViewTable").widget().option("data", $scope.checkboxUserData);

                    $scope.selectUserGridViewTable.totalRecords = $scope.checkboxUserData.length;
                    $("#selectUserGridViewTable").widget().option("totalRecords", $scope.checkboxUserData.length);

                    $scope.showUserViewWin = false;
                    $scope.$digest();
                }
            };
            $scope.cancelUserBtn = {
                "id": "cancelUserBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {

                    $scope.showUserViewWin = false;
                    $scope.$digest();
                }
            };

            $scope.saveAlarmBtn = {
                "id": "saveAlarmBtn",
                "text": $scope.i18n.common_term_save_label,
                "click": function () {
                    $scope.selectAlarmGridViewTable.data = $scope.checkboxDefineAlarmData;
                    $("#selectAlarmGridViewTable").widget().option("data", $scope.checkboxDefineAlarmData);

                    $scope.selectAlarmGridViewTable.totalRecords = $scope.checkboxDefineAlarmData.length;
                    $("#selectAlarmGridViewTable").widget().option("totalRecords", $scope.checkboxDefineAlarmData.length);

                    $scope.showMailViewWin = false;
                    $scope.$digest();
                }
            };
            $scope.cancelAlarmBtn = {
                "id": "cancelAlarmBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {

                    $scope.showMailViewWin = false;
                    $scope.$digest();
                }
            };

            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage == 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            $scope.dataGridViewTable = {
                "id": "dataGridViewTable",
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.recipientId);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_userName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userName);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_sysUser_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.isSystemUserValue);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_email_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.recipient);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_sendType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.forwardTypeValue);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_sendTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sendTimeSection);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "bSortable": false,
                        "sWidth": "20%"
                    }
                ],
                "data": [],
                "columnVisibility": {
                    "activate": "click",
                    "aiExclude": [0, 6],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {

                    }
                },
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                },
                "renderRow": function (nRow, aData, iDataIndex) {

                    var optColumn = "<a href='javascript:void(0)' ng-click='show()'>" + $scope.i18n.common_term_detail_label + "</a> &nbsp;&nbsp;";
                    if ($scope.operateRight) {
                        optColumn = optColumn + " <a href='javascript:void(0)' ng-click='modify()'>" + $scope.i18n.common_term_modify_button + "</a>&nbsp;&nbsp;" + " <a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>";
                    }

                    var optLink = $compile($(optColumn));

                    var optScope = $scope.$new();
                    optScope.data = aData;
                    if ($scope.operateRight) {
                        optScope.modify = function () {
                            initRecipientAlarmInfo(aData.recipientId, "update");

                        };
                        optScope.delete = function () {

                            var confirmShowDialog = new Message({
                                "type": "confirm",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.alarm_config_delData_info_confirm_msg,
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: $scope.i18n.common_term_ok_button,
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn : true,
                                        default: true
                                    },
                                    {
                                        label: $scope.i18n.common_term_cancle_button,
                                        accessKey: '3',
                                        "key": "cancelBtn",
                                        default: false
                                    }
                                ]
                            });
                            confirmShowDialog.setButton("okBtn", function () {
                                confirmShowDialog.destroy();
                                remove(aData.recipientId);
                            });
                            confirmShowDialog.setButton("cancelBtn", function () {
                                confirmShowDialog.destroy();
                            });
                            confirmShowDialog.show();
                        };
                    }

                    optScope.show = function () {

                        initRecipientAlarmInfo(aData.recipientId, "show");
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(6)", nRow).html(optNode);
                }
            };

            function resetRecipientAlarmInfo() {
                UnifyValid.clearValidate($("#" + $scope.mailFormView.mailAddressControl.id).find("textarea"));
                $scope.mailFormView.checkBoxLevelValue = {};
                $scope.mailFormView.id.type = "1";
                $scope.mailFormView.id.mailAddress = "0";
                $("#" + $scope.mailFormView.mailAddressControl.id).widget().option("value", "");
                $("#" + $scope.mailFormView.timeIds.searchStartTime).widget().empty();
                $("#" + $scope.mailFormView.timeIds.searchEndTime).widget().empty();

                $scope.mailAddressType = "other";
                $scope.type = "level";
                $scope.mailAddressTypeValue = $scope.i18n.alarm_term_externalEmail_label;
                $scope.typeValue = $scope.i18n.alarm_config_email_para_type_option_level_value;

                $scope.checkboxUserData = [];
                $scope.selectUserGridViewTable.data = $scope.checkboxUserData;
                $("#selectUserGridViewTable").widget().option("data", $scope.checkboxUserData);

                $scope.checkboxDefineAlarmData = [];
                $scope.selectAlarmGridViewTable.data = $scope.checkboxDefineAlarmData;
                $("#selectAlarmGridViewTable").widget().option("data", $scope.checkboxDefineAlarmData);

                $scope.queryAlarmName = "";
                $("#"+ $scope.searchMailAlarmBox.id).widget().setValue("");

                $scope.queryUserName = "";
                $("#"+ $scope.searchUserBox.id).widget().setValue("");

                var alarmLevel = [
                    {
                        id: "critical",
                        name: $scope.i18n.alarm_term_critical_label,
                        disable: false
                    },
                    {
                        id: "major",
                        name: $scope.i18n.alarm_term_major_label,
                        disable: false
                    },
                    {
                        id: "minor",
                        name: $scope.i18n.alarm_term_minor_label,
                        disable: false
                    },
                    {
                        id: "warning",
                        name: $scope.i18n.alarm_term_warning_label,
                        disable: false
                    }
                ];

                $scope.mailFormView.level = alarmLevel;

            }

            function initRecipientAlarmInfo(id, mode) {
                resetRecipientAlarmInfo();
                AlarmService.getRecipientAlarmInfo(
                    id, ($scope.i18n.locale == "zh" ?"zh_CN" : "en_US"),user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {

                                $scope.mode = mode;
                                $scope.showWinTitle = ($scope.mode == "update" ? $scope.i18n.alarm_term_modifyAlarmEmail_button : $scope.i18n.alarm_term_checkAlarmEmail_button);
                                $scope.showWin = true;
                                $scope.recipientAlarmInfo = result.data;
                                $scope.mailFormView.id.type = "1";
                                if ($scope.recipientAlarmInfo.startTime != null) {
                                    $scope.recipientAlarmInfo.startTime = CommonService.utc2Local($scope.recipientAlarmInfo.startTime);

                                    var strDate = $scope.recipientAlarmInfo.startTime.split(" ")[0];
                                    var strTime = $scope.recipientAlarmInfo.startTime.split(" ")[1];

                                    $("#" + $scope.mailFormView.timeIds.searchStartTime).widget().option("defaultDate", strDate);
                                    $("#" + $scope.mailFormView.timeIds.searchStartTime).widget().option("defaultTime", strTime);
                                }
                                if ($scope.recipientAlarmInfo.endTime != null) {
                                    $scope.recipientAlarmInfo.endTime = CommonService.utc2Local($scope.recipientAlarmInfo.endTime);
                                    var strDate = $scope.recipientAlarmInfo.endTime.split(" ")[0];
                                    var strTime = $scope.recipientAlarmInfo.endTime.split(" ")[1];
                                    $("#" + $scope.mailFormView.timeIds.searchEndTime).widget().option("defaultDate",strDate);
                                    $("#" + $scope.mailFormView.timeIds.searchEndTime).widget().option("defaultTime",strTime);
                                }

                                $scope.type = ($scope.recipientAlarmInfo.forwardType == "1" ? "level" : "object");
                                var fwType = [
                                    {
                                        id: "1",
                                        name: $scope.i18n.alarm_config_email_para_type_option_level_value,
                                        checked: true
                                    },
                                    {
                                        id: "2",
                                        name: $scope.i18n.alarm_config_email_para_type_option_ID_value
                                    }
                                ];
                                $scope.mailFormView.id.type = "1";
                                $scope.typeValue = $scope.i18n.alarm_config_email_para_type_option_level_value;

                                $scope.mailAddressTypeValue = ($scope.recipientAlarmInfo.isSystemUser == "0" ? $scope.i18n.alarm_term_externalEmail_label : $scope.i18n.common_term_sysEmail_label);

                                if ($scope.recipientAlarmInfo.forwardType == 1) {

                                    var key = {
                                        "critical": null,
                                        "major": null,
                                        "minor": null,
                                        "warning": null
                                    };
                                    if ($scope.recipientAlarmInfo.levelList != null) {
                                        for (var i = 0; i < $scope.recipientAlarmInfo.levelList.length; i++) {
                                            key[$scope.recipientAlarmInfo.levelList[i]] = true;
                                        }
                                    }

                                    $scope.mailFormView.checkBoxLevelValue = key;

                                    if ($scope.mode != "update") {
                                        var alarmLevel = [
                                            {
                                                id: "critical",
                                                name: $scope.i18n.alarm_term_critical_label,
                                                disable: true,
                                                checked: false
                                            },
                                            {
                                                id: "major",
                                                name: $scope.i18n.alarm_term_major_label,
                                                disable: true,
                                                checked: false
                                            },
                                            {
                                                id: "minor",
                                                name: $scope.i18n.alarm_term_minor_label,
                                                disable: true,
                                                checked: false
                                            },
                                            {
                                                id: "warning",
                                                name: $scope.i18n.alarm_term_warning_label,
                                                disable: true,
                                                checked: false
                                            }
                                        ];
                                        if ($scope.recipientAlarmInfo.levelList != null) {
                                            for (var i = 0; i < $scope.recipientAlarmInfo.levelList.length; i++) {
                                                if ($scope.recipientAlarmInfo.levelList[i] == "critical") {
                                                    alarmLevel[0].checked = true;
                                                } else if ($scope.recipientAlarmInfo.levelList[i] == "major") {
                                                    alarmLevel[1].checked = true;
                                                } else if ($scope.recipientAlarmInfo.levelList[i] == "minor") {
                                                    alarmLevel[2].checked = true;
                                                } else if ($scope.recipientAlarmInfo.levelList[i] == "warning") {
                                                    alarmLevel[3].checked = true;
                                                }
                                            }
                                        }

                                        $scope.mailFormView.level = alarmLevel;
                                    }

                                    $scope.showWin = true;
                                } else {
                                    $scope.typeValue = $scope.i18n.alarm_config_email_para_type_option_ID_value;
                                    $scope.mailFormView.id.type = "2";
                                    fwType = [
                                        {
                                            id: "1",
                                            name: $scope.i18n.alarm_config_email_para_type_option_level_value
                                        },
                                        {
                                            id: "2",
                                            name: $scope.i18n.alarm_config_email_para_type_option_ID_value,
                                            checked: true
                                        }
                                    ];

                                    if ($scope.recipientAlarmInfo.receiveAlarms != null) {
                                        for (var i = 0; i < $scope.recipientAlarmInfo.receiveAlarms.length; i++) {
                                            $scope.checkboxDefineAlarmData.push(getQueryDefineAlarm($scope.recipientAlarmInfo.receiveAlarms[i]));
                                        }
                                    }

                                    $scope.showSelectAlarmGridViewTable.data = $scope.checkboxDefineAlarmData;
                                    $("#showSelectAlarmGridViewTable").widget().option("data", $scope.checkboxDefineAlarmData);

                                    $scope.showSelectAlarmGridViewTable.totalRecords = $scope.checkboxDefineAlarmData.length;
                                    $("#showSelectAlarmGridViewTable").widget().option("totalRecords", $scope.checkboxDefineAlarmData.length);

                                    $scope.selectAlarmGridViewTable.data = $scope.checkboxDefineAlarmData;
                                    $("#selectAlarmGridViewTable").widget().option("data", $scope.checkboxDefineAlarmData);

                                    $scope.selectAlarmGridViewTable.totalRecords = $scope.checkboxDefineAlarmData.length;
                                    $("#selectAlarmGridViewTable").widget().option("totalRecords", $scope.checkboxDefineAlarmData.length);
                                }
                                $scope.mailFormView.type = fwType;
                            });
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    },$scope.isLocal);

            }

            function getData() {
                AlarmService.getRecipients(
                    user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                $scope.dataGridViewTable.totalRecords = result.data.total;
                                $scope.dataGridViewTable.data = result.data.recipients;

                            });
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    }, $scope.isLocal);
            };

            $scope.mailFormView = {
                label: {
                    mailAddress: $scope.i18n.common_term_receiveAddr_label + ":",
                    type: $scope.i18n.alarm_term_sendType_label + ":",
                    level: $scope.i18n.common_term_alarmLevel_label + ":",
                    alarmMsg: $scope.i18n.alarm_term_sendAlarm_label + ":",
                    sendTimeSection: $scope.i18n.alarm_term_sendTime_label + ":",
                    userName: $scope.i18n.common_term_userName_label + ":",
                    mail: $scope.i18n.common_term_email_label + ":"
                },
                id: {
                    "mailAddress": "0",
                    "type": "0"
                },
                "checkBoxLevelValue": {},
                mailAddressControl: {
                    "id": "mailAddressControl",
                    "value": "",
                    "type": "multi",
                    "readonly": false,
                    "width": 400,
                    "height": 60,
                    "tooltip": $scope.i18n.alarm_config_email_para_addr_mean_tip,
                    "extendFunction": ["mailAddressCheck"],
                    "require": true,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";mailAddressCheck():" + $scope.i18n.common_term_format_valid
                },
                timeIds: {
                    "searchStartTime": "startTime",
                    "searchEndTime": "endTime"
                },
                time: {
                    id: "periodPicker",
                    width: 154,
                    type: "datetime",
                    timeFormat: 'hh:mm:ss',
                    dateFormat: 'yy-mm-dd',
                    ampm: false,
                    firstDay: 1,
                    start: {
                        value: "",
                        onClose: function (date) {
                            $("#" + $scope.mailFormView.timeIds.searchEndTime).widget().option("minDate", date);
                        }
                    },
                    end: {
                        value: "",
                        onClose: function (date) {
                            $("#" + $scope.mailFormView.timeIds.searchStartTime).widget().option("maxDate", date);
                        }
                    }
                },
                mailAddress: [
                    {
                        id: "0",
                        name: $scope.i18n.alarm_term_externalEmail_label,
                        checked: true
                    },
                    {
                        id: "1",
                        name: $scope.i18n.common_term_sysEmail_label
                    }
                ],
                type: [
                    {
                        id: "1",
                        name: $scope.i18n.alarm_config_email_para_type_option_level_value,
                        checked: true
                    },
                    {
                        id: "2",
                        name: $scope.i18n.alarm_config_email_para_type_option_ID_value
                    }
                ],
                level: [
                    {
                        id: "critical",
                        name: $scope.i18n.alarm_term_critical_label,
                        disable: false
                    },
                    {
                        id: "major",
                        name: $scope.i18n.alarm_term_major_label,
                        disable: false
                    },
                    {
                        id: "minor",
                        name: $scope.i18n.alarm_term_minor_label,
                        disable: false
                    },
                    {
                        id: "warning",
                        name: $scope.i18n.alarm_term_warning_label,
                        disable: false
                    }
                ],

                changeMailAddress: function () {

                    $scope.mailAddressType = ($scope.mailFormView.id.mailAddress == "0" ? "other" : "system");
                    $scope.$digest();

                },
                changeType: function () {
                    $scope.type = ($scope.mailFormView.id.type == "1" ? "level" : "object");
                    $scope.$digest();
                }
            };

            UnifyValid.mailAddressCheck = function () {
                var mailString = $("#" + $scope.mailFormView.mailAddressControl.id).widget().getValue();
                var mailList = mailString.split(";");
                var checkReg = /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;
                for (var i = 0; i < mailList.length; i++) {

                    if (mailList[i] == "") {
                        continue;
                    }

                    if (!checkReg.test(mailList[i])) {
                        return false;
                    }
                }

                return true
            }

            var pageUserGridViewTable = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return pageUserGridViewTable.currentPage == 0 ? 0 : (pageUserGridViewTable.currentPage - 1) * pageUserGridViewTable.displayLength;
                }
            };
            var userGridViewTableHeadCheckbox = new Checkbox({
                "id": "userGridViewTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    setDataGridCheckBoxStatus("#userGridViewTableHeadCheckbox", "#chkUserGridViewTable",
                        $scope.userGridViewTable.data,
                        $scope.checkboxUserData,
                        checkExistUser,
                        getUser
                    );
                }
            });
            $scope.userGridViewTable = {
                "lengthMenu": [10, 20, 50],
                "id": "userGridViewTable",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "showDetails": false,
                "columns": [
                    {
                        "sTitle": "<div id='_userGridViewTableColumns'style='margin:0px 0px 0px 1px;'></div>",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "25px"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_userName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "30%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_email_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.email);
                        },
                        "bSortable": false,
                        "sWidth": "70%"
                    }

                ],
                "data": [],
                "callback": function (evtObj) {
                    pageUserGridViewTable.currentPage = evtObj.currentPage;
                    pageUserGridViewTable.displayLength = evtObj.displayLength;
                    getUserData();
                },
                "changeSelect": function (evtObj) {
                    pageUserGridViewTable.currentPage = evtObj.currentPage;
                    pageUserGridViewTable.displayLength = evtObj.displayLength;
                    getUserData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {

                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentUserItem = aData;
                    });
                    var checked = false;
                    for (var j = 0; j < $scope.checkboxUserData.length; j++) {
                        if (checkExistUser($scope.checkboxUserData[j], aData)) {
                            checked = true;
                            break;
                        }
                    }
                    var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'><tiny-checkbox text='' id='id' checked='" + checked + "' change='change()'></tiny-checkbox></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;

                    selBoxScope.checked = checked;
                    selBoxScope.id = "chkUserGridViewTable" + iDataIndex;
                    selBoxScope.change = function () {
                        setDataGrid_Row_CheckBoxData(
                            aData,
                            $("#" + selBoxScope.id).widget().option("checked"),
                            "#userGridViewTableHeadCheckbox",
                            $scope.checkboxUserData,
                            $scope.userGridViewTable.data,
                            checkExistUser,
                            getUser
                        )
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).append(selBoxNode);

                }
            };

            function getUser(iRow) {
                var info = {};
                info.id = iRow.id;
                info.name = iRow.name;
                info.email = iRow.email;
                return info;
            }

            function checkExistUser(checkItem, iRow) {
                if (checkItem.id === iRow.id &&
                    checkItem.name === iRow.name &&
                    checkItem.email === iRow.email
                    ) {
                    return true;
                }
                return false;
            }

            function getQueryUserJsonInfo() {
                $scope.reqUserParams.start = pageUserGridViewTable.displayLength * (pageUserGridViewTable.currentPage - 1);
                $scope.reqUserParams.limit = pageUserGridViewTable.displayLength;
                $scope.reqUserParams.email = "not-null";
                $scope.reqUserParams.userName = $scope.queryUserName;
            }

            function getUserData() {
                getQueryUserJsonInfo();
                AlarmService.getUsersInfo(
                    JSON.stringify($scope.reqUserParams), user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                $scope.userGridViewTable.data = result.data.userList;
                                $scope.userGridViewTable.totalRecords = result.data.total;
                                userGridViewTableHeadCheckbox.option("checked",
                                    getDataGridHeadCheckBoxValue(
                                        $scope.userGridViewTable.data,
                                        $scope.checkboxUserData,
                                        checkExistUser
                                    ));
                            });
                            userGridViewTableHeadCheckbox.rendTo($('#_userGridViewTableColumns'));

                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    });
            }

            var pageSelectUserGridViewTable = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return pageSelectUserGridViewTable.currentPage == 0 ? 0 : (pageSelectUserGridViewTable.currentPage - 1) * pageSelectUserGridViewTable.displayLength;
                }
            };
            $scope.selectUserGridViewTable = {
                "lengthMenu": [10, 20, 50],
                "id": "selectUserGridViewTable",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "showDetails": false,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_userName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_email_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.email);
                        },
                        "bSortable": false,
                        "sWidth": "60%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "bSortable": false,
                        "sWidth": "20%"
                    }
                ],
                "data": [],
                "columnVisibility": {
                    "activate": "click",
                    "aiExclude": [0, 5],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {

                    }
                },
                "callback": function (evtObj) {
                    pageSelectUserGridViewTable.currentPage = evtObj.currentPage;
                    pageSelectUserGridViewTable.displayLength = evtObj.displayLength;
                },
                "changeSelect": function (evtObj) {
                    pageSelectUserGridViewTable.currentPage = evtObj.currentPage;
                    pageSelectUserGridViewTable.displayLength = evtObj.displayLength;
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    var optColumn = "<a href='javascript:void(0)' ng-click='deleteUser()'></a>";
                    var d = $(optColumn);
                    d.text($scope.i18n.common_term_delete_button)
                    var optLink = $compile(d);

                    var optScope = $scope.$new();
                    optScope.data = aData;

                    optScope.deleteUser = function () {
                        for (var i = 0; i < $scope.checkboxUserData.length; i++) {

                            if ($scope.checkboxUserData[i].id === aData.id &&
                                $scope.checkboxUserData[i].name === aData.name &&
                                $scope.checkboxUserData[i].email === aData.email
                                ) {
                                $scope.checkboxUserData.splice(i, 1);
                                break;
                            }
                        }
                        $scope.selectUserGridViewTable.data = $scope.checkboxUserData;
                        $("#selectUserGridViewTable").widget().option("data", $scope.checkboxUserData);

                        $scope.selectUserGridViewTable.totalRecords = $scope.checkboxUserData.length;
                        $("#selectUserGridViewTable").widget().option("totalRecords", $scope.checkboxUserData.length);

                    };

                    var optNode = optLink(optScope);
                    $("td:eq(2)", nRow).html(optNode);

                }
            };

            var pageShowSelectAlarmGridViewTable = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return pageShowSelectAlarmGridViewTable.currentPage == 0 ? 0 : (pageShowSelectAlarmGridViewTable.currentPage - 1) * pageShowSelectAlarmGridViewTable.displayLength;
                }
            };
            $scope.showSelectAlarmGridViewTable = {
                "lengthMenu": [10, 20, 50],
                "id": "showSelectAlarmGridViewTable",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "showDetails": false,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_alarmID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.alarmid);
                        },
                        "bSortable": false,
                        "sWidth": "30%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_alarmName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.alarmName);
                        },
                        "bSortable": false,
                        "sWidth": "35%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_assemblyType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.compType);
                        },
                        "bSortable": false,
                        "sWidth": "35%"
                    }
                ],
                "data": [],
                "columnVisibility": {
                    "activate": "click",
                    "aiExclude": [0, 5],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {

                    }
                },
                "callback": function (evtObj) {
                    pageShowSelectAlarmGridViewTable.currentPage = evtObj.currentPage;
                    pageShowSelectAlarmGridViewTable.displayLength = evtObj.displayLength;
                },
                "changeSelect": function (evtObj) {
                    pageShowSelectAlarmGridViewTable.currentPage = evtObj.currentPage;
                    pageShowSelectAlarmGridViewTable.displayLength = evtObj.displayLength;
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                }
            };

            var pageSelectAlarmGridViewTable = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return pageSelectAlarmGridViewTable.currentPage == 0 ? 0 : (pageSelectAlarmGridViewTable.currentPage - 1) * pageSelectAlarmGridViewTable.displayLength;
                }
            };
            $scope.selectAlarmGridViewTable = {
                "lengthMenu": [10, 20, 50],
                "id": "selectAlarmGridViewTable",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "showDetails": false,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_alarmID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.alarmid);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_alarmName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.alarmName);
                        },
                        "bSortable": false,
                        "sWidth": "35%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_assemblyType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.compType);
                        },
                        "bSortable": false,
                        "sWidth": "35%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "bSortable": false,
                        "sWidth": "10%"
                    }
                ],
                "data": [],
                "columnVisibility": {
                    "activate": "click",
                    "aiExclude": [0, 5],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {

                    }
                },
                "callback": function (evtObj) {
                    pageSelectAlarmGridViewTable.currentPage = evtObj.currentPage;
                    pageSelectAlarmGridViewTable.displayLength = evtObj.displayLength;
                },
                "changeSelect": function (evtObj) {
                    pageSelectAlarmGridViewTable.currentPage = evtObj.currentPage;
                    pageSelectAlarmGridViewTable.displayLength = evtObj.displayLength;
                },
                "renderRow": function (nRow, aData, iDataIndex) {

                    var optColumn = "<a href='javascript:void(0)' ng-click='deleteAlarm()'></a>";
                    var d = $(optColumn);
                    d.text($scope.i18n.common_term_delete_button)
                    var optLink = $compile(d);

                    var optScope = $scope.$new();
                    optScope.data = aData;

                    optScope.deleteAlarm = function () {
                        for (var i = 0; i < $scope.checkboxDefineAlarmData.length; i++) {

                            if ($scope.checkboxDefineAlarmData[i].alarmid === aData.alarmid &&
                                $scope.checkboxDefineAlarmData[i].compType === aData.compType &&
                                $scope.checkboxDefineAlarmData[i].alarmName === aData.alarmName
                                ) {
                                $scope.checkboxDefineAlarmData.splice(i, 1);
                                break;
                            }
                        }
                        $scope.selectAlarmGridViewTable.data = $scope.checkboxDefineAlarmData;
                        $("#selectAlarmGridViewTable").widget().option("data", $scope.checkboxDefineAlarmData);

                        $scope.selectAlarmGridViewTable.totalRecords = $scope.checkboxDefineAlarmData.length;
                        $("#selectAlarmGridViewTable").widget().option("totalRecords", $scope.checkboxDefineAlarmData.length);
                    };

                    var optNode = optLink(optScope);
                    $("td:eq(3)", nRow).html(optNode);

                }
            };

            var pageAlarmGridViewTable = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return pageAlarmGridViewTable.currentPage == 0 ? 0 : (pageAlarmGridViewTable.currentPage - 1) * pageAlarmGridViewTable.displayLength;
                }
            };
            var alarmGridViewTableHeadCheckbox = new Checkbox({
                "id": "alarmGridViewTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    setDataGridCheckBoxStatus("#alarmGridViewTableHeadCheckbox", "#chkAlarmGridViewTable",
                        $scope.alarmGridViewTable.data,
                        $scope.checkboxDefineAlarmData,
                        checkExistAlarmDefine,
                        getDefineAlarm
                    );
                }
            });

            function setDataGridCheckBoxStatus(headCheckBoxId, dataGrid_RowCheckBoxId, dataGrid_dataSource, dataGrid_checkBoxData, checkExistFunctionName, createItemFunctionName) {
                var items = dataGrid_dataSource;
                var isChecked = $(headCheckBoxId).widget().option("checked");
                for (var i = 0; i < items.length; i++) {
                    $(dataGrid_RowCheckBoxId + i).widget().option("checked", isChecked);
                }
                if (isChecked && items) {
                    _.each(items, function (iRow) {
                        var flag = true;
                        for (var i = 0; i < dataGrid_checkBoxData.length; i++) {
                            if (checkExistFunctionName(dataGrid_checkBoxData[i], iRow)) {
                                flag = false;
                                break;
                            }
                        }

                        if (flag) {
                            dataGrid_checkBoxData.push(createItemFunctionName(iRow));
                        }
                    })
                }
                if (isChecked == false && items) {
                    _.each(items, function (iRow) {
                        for (var i = 0; i < dataGrid_checkBoxData.length; i++) {
                            if (checkExistFunctionName(dataGrid_checkBoxData[i], iRow)) {
                                dataGrid_checkBoxData.splice(i, 1);
                                break;
                            }
                        }
                    })
                }
            };
            $scope.alarmGridViewTable = {
                "lengthMenu": [10, 20, 50],
                "id": "alarmGridViewTable",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "showDetails": false,
                "columns": [
                    {
                        "sTitle": "<div id='_alarmGridViewTableColumns'style='margin:0px 0px 0px 1px;'></div>",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "25px"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_alarmID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.alarmId);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_alarmName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.alarmName);
                        },
                        "bSortable": false,
                        "sWidth": "40%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_assemblyType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.compType);
                        },
                        "bSortable": false,
                        "sWidth": "40%"
                    }
                ],
                "data": [],
                "columnVisibility": {
                    "activate": "click",
                    "aiExclude": [0, 5],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {

                    }
                },
                "callback": function (evtObj) {
                    pageAlarmGridViewTable.currentPage = evtObj.currentPage;
                    pageAlarmGridViewTable.displayLength = evtObj.displayLength;
                    getDefineAlarmData();
                },
                "changeSelect": function (evtObj) {
                    pageAlarmGridViewTable.currentPage = evtObj.currentPage;
                    pageAlarmGridViewTable.displayLength = evtObj.displayLength;
                    getDefineAlarmData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {

                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentAlarmDefineItem = aData;
                    });
                    var checked = false;
                    for (var j = 0; j < $scope.checkboxDefineAlarmData.length; j++) {
                        if (checkExistAlarmDefine($scope.checkboxDefineAlarmData[j], aData)) {
                            checked = true;
                            break;
                        }
                    }
                    var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'><tiny-checkbox text='' id='id' checked='" + checked + "' change='change()'></tiny-checkbox></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;

                    selBoxScope.checked = checked;
                    selBoxScope.id = "chkAlarmGridViewTable" + iDataIndex;
                    selBoxScope.change = function () {
                        setDataGrid_Row_CheckBoxData(
                            aData,
                            $("#" + selBoxScope.id).widget().option("checked"),
                            "#alarmGridViewTableHeadCheckbox",
                            $scope.checkboxDefineAlarmData,
                            $scope.alarmGridViewTable.data,
                            checkExistAlarmDefine,
                            getDefineAlarm
                        )
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).append(selBoxNode);
                }
            };

            function getDefineAlarm(iRow) {
                var info = {};
                info.alarmid = iRow.alarmId;
                info.compType = iRow.compType;
                info.alarmName = iRow.alarmName;
                info.user = user.name;
                return info;
            }

            function getQueryDefineAlarm(iRow) {
                var info = {};
                info.alarmid = iRow.alarmId;
                info.compType = iRow.componentType;
                info.alarmName = iRow.alarmName;
                info.user = user.name;
                return info;
            }

            function checkExistAlarmDefine(checkItem, iRow) {
                if (checkItem.alarmid === iRow.alarmId &&
                    checkItem.compType === iRow.compType &&
                    checkItem.alarmName === iRow.alarmName
                    ) {
                    return true;
                }
                return false;
            }

            function setDataGrid_Row_CheckBoxData(iRow, checked, headCheckBoxId, dataGrid_checkBoxData, dataGrid_dataSource, checkExistFunctionName, createItemFunctionName) {
                var selected = dataGrid_checkBoxData;
                if (checked) {
                    var flag = true;
                    for (var i = 0; i < selected.length; i++) {
                        if (checkExistFunctionName(selected[i], iRow)) {
                            flag = false;
                            break;
                        }
                    }

                    if (flag) {
                        selected.push(createItemFunctionName(iRow));
                    }

                } else {
                    for (var i = 0; i < selected.length; i++) {
                        if (checkExistFunctionName(selected[i], iRow)) {
                            selected.splice(i, 1);
                        }
                    }
                }

                var headCheck = $(headCheckBoxId).widget();
                if (!!headCheck) {
                    headCheck.option("checked", getDataGridHeadCheckBoxValue(
                        dataGrid_dataSource,
                        dataGrid_checkBoxData,
                        checkExistFunctionName
                    ));
                }
            }

            function getDataGridHeadCheckBoxValue(dataGrid_dataSource, dataGrid_checkBoxData, checkExistFunctionName) {
                var selected = dataGrid_checkBoxData;
                if (dataGrid_dataSource.length == 0) {
                    return false;
                }
                var flag = true;
                for (var j = 0; j < dataGrid_dataSource.length; j++) {
                    var exist = false;
                    for (var i = 0; i < selected.length; i++) {
                        if (checkExistFunctionName(selected[i], dataGrid_dataSource[j])) {
                            exist = true;
                            break;
                        }
                    }
                    if (exist == false) {
                        flag = false;
                        break;
                    }
                }

                return flag;
            };

            function getQueryDefineAlarmJsonInfo() {
                $scope.reqDefineParams.start = pageAlarmGridViewTable.displayLength * (pageAlarmGridViewTable.currentPage - 1);
                $scope.reqDefineParams.limit = pageAlarmGridViewTable.displayLength;
                $scope.reqDefineParams.compType = "0";
                $scope.reqDefineParams.alarmId = "";
                $scope.reqDefineParams.alarmName =  $scope.queryAlarmName;
                $scope.reqDefineParams.locale = ($scope.i18n.locale == "zh" ?"zh_CN" : "en_US");
            }

            function getDefineAlarmData() {
                getQueryDefineAlarmJsonInfo();
                AlarmService.getDefineAlarmInfo(
                    $scope.reqDefineParams, user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                $scope.alarmGridViewTable.data = result.data.alarmList;
                                $scope.alarmGridViewTable.totalRecords = result.data.total;
                                alarmGridViewTableHeadCheckbox.option("checked",
                                    getDataGridHeadCheckBoxValue(
                                        $scope.alarmGridViewTable.data,
                                        $scope.checkboxDefineAlarmData,
                                        checkExistAlarmDefine
                                    ));
                            });
                            alarmGridViewTableHeadCheckbox.rendTo($('#_alarmGridViewTableColumns'));

                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    });
            }

            getData();
        }
    ];
    return alarmMailConfigCtrl;
});
