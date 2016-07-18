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
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"
], function ($, angular, TextBox, Button, Window, Checkbox, Message, ExceptionService, AlarmService, CommonService) {
    "use strict";

    var alarmListCtrl = ["$scope", "$compile", "$state", "camel", "$q", '$stateParams', "$interval",
        function ($scope, $compile, $state, camel, $q, $stateParams, $interval) {
            $scope.privilege = $("html").scope().user.privilege;
            $scope.operateRight = $scope.privilege.role_role_add_option_alarmHandle_value;
            $scope.queryRight = $scope.privilege.role_role_add_option_alarmView_value;
            var exception = new ExceptionService();
            var user = $("html").scope().user;
            //成立时间 2011-9-26
            var MIN_DATE = new Date(2011, 8, 26);
            var formatDate = function (date) {
                date = date || new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();

                month < 10 && (month = "0" + month);
                day < 10 && (day = "0" + day);
                hours < 10 && (hours = "0" + hours);
                minutes < 10 && (minutes = "0" + minutes);
                seconds < 10 && (seconds = "0" + seconds);
                return [[year, month, day].join("-"),[hours, minutes, seconds].join("-")].join(" ");
            };

            $scope.checkboxData = [];
            $scope.currentItem = undefined;
            $scope.querySeverity = ($stateParams.severity == undefined ? "0" : $stateParams.severity);
            $scope.queryAlarmType = ($stateParams.alarmtype == undefined ? "0" : $stateParams.alarmtype);
            $scope.queryStartTime = "";
            $scope.queryEndTime = "";
            $scope.queryAlarmName = "";
            $scope.queryResourceid = ($stateParams.resourceid == undefined ? "" : $stateParams.resourceid);
            $scope.queryMoc = ($stateParams.moc == undefined ? "" : $stateParams.moc);
            $scope.isLocal = $scope.deployMode === "local";

            $scope.searchLevel = {
                "id": "ecsAlarmSearchLevel",
                "width": "100",
                "values": [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.common_term_allLevel_label,
                        "checked": true
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.alarm_term_critical_label
                    },
                    {
                        "selectId": "2",
                        "label": $scope.i18n.alarm_term_major_label
                    },
                    {
                        "selectId": "3",
                        "label": $scope.i18n.alarm_term_minor_label
                    },
                    {
                        "selectId": "4",
                        "label": $scope.i18n.alarm_term_warning_label
                    }
                ],
                "change": function () {
                    $scope.querySeverity = $("#ecsAlarmSearchLevel").widget().getSelectedId();
                    $scope.alarmListTable.curPage = {
                        "pageIndex": 1
                    };
                    page.currentPage = 1;
                    $scope.checkboxData = [];
                    getData();
                }
            };
            $scope.searchAlarmType = {
                "id": "ecsAlarmType",
                "width": "120",
                "values": [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.alarm_term_allAlarmType_label,
                        "checked": true
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_noResume_value,
                        "checked": true
                    },
                    {
                        "selectId": "2",
                        "label": $scope.i18n.common_term_resumed_value,
                        "checked": true
                    }
                ],
                "change": function () {
                    $scope.queryAlarmType = $("#ecsAlarmType").widget().getSelectedId();
                    $scope.alarmListTable.curPage = {
                        "pageIndex": 1
                    };
                    page.currentPage = 1;
                    $scope.checkboxData = [];
                    getData();
                }
            };

            $scope.timeIds = {
                "searchStartTime": "ecsStartTime",
                "searchEndTime": "ecsEndTime"
            };

            $scope.time = {
                id: "periodPicker",
                width: 154,
                type: "datetime",
                timeFormat: 'hh:mm:ss',
                dateFormat: 'yy-mm-dd',
                ampm: false,
                firstDay: 1,
                start: {
                    minDate: formatDate(MIN_DATE),
                    maxDate: formatDate(),
                    onClose: function (date) {
                        if(date){
                            $("#" + $scope.timeIds.searchEndTime).widget().option("minDate", date);
                        }
                        else
                        {
                            $("#" + $scope.timeIds.searchEndTime).widget().option("minDate", formatDate(MIN_DATE));
                        }
                        $scope.queryStartTime = $("#" + $scope.timeIds.searchStartTime).widget().getDateTime();
                        $scope.queryEndTime = $("#" + $scope.timeIds.searchEndTime).widget().getDateTime();
                        $scope.alarmListTable.curPage = {
                            "pageIndex": 1
                        };
                        page.currentPage = 1;
                        $scope.checkboxData = [];
                        getData();
                    }
                },
                end: {
                    minDate: formatDate(MIN_DATE),
                    maxDate: formatDate(),
                    onClose: function (date) {
                        if(date){
                            $("#" + $scope.timeIds.searchStartTime).widget().option("maxDate", date);
                        }
                        else{
                            $("#" + $scope.timeIds.searchStartTime).widget().option("maxDate", formatDate());
                        }
                        $scope.queryStartTime = $("#" + $scope.timeIds.searchStartTime).widget().getDateTime();
                        $scope.queryEndTime = $("#" + $scope.timeIds.searchEndTime).widget().getDateTime();
                        $scope.alarmListTable.curPage = {
                            "pageIndex": 1
                        };
                        page.currentPage = 1;
                        $scope.checkboxData = [];
                        getData();
                    }
                }
            };
            $scope.searchBox = {
                "id": "ecsAlarmSearchBox",
                "placeholder": $scope.i18n.common_term_findAlarmObjName_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.queryAlarmName = searchString;
                    $scope.alarmListTable.curPage = {
                        "pageIndex": 1
                    };
                    page.currentPage = 1;
                    $scope.checkboxData = [];
                    getData();
                }
            };
            $scope.clearBtn = {
                "id": "alarm-list-clear",
                "text": $scope.i18n.common_term_clear_button,
                "click": function () {

                    var msg = "";
                    if ($scope.checkboxData.length > 100) {
                        msg = $scope.i18n.alarm_term_clearMax100_label;
                    }
                    if ($scope.checkboxData.length == 0) {
                        msg = $scope.i18n.vm_term_chooseClearAlarm_msg;
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
                        return;
                    }

                    var confirmShowDialog = new Message({
                        "type": "prompt",
                        "title": $scope.i18n.common_term_clear_button,
                        "content": $scope.i18n.alarm_general_clearBatch_info_confirm_msg,
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn: true,
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
                        AlarmService.clearAlarms(
                            JSON.stringify({
                                "alarmMessage": clearAlarmsProperty($scope.checkboxData)
                            }), user,
                            function (result) {
                                if (result.result == true) {
                                    $scope.$apply(function () {
                                        $scope.checkboxData = [];
                                        $scope.alarmListTable.curPage = {
                                            "pageIndex": 1
                                        };
                                        page.currentPage = 1;
                                        getData();
                                    });
                                }
                                if (result.result == false) {
                                    exception.doException(result.data, null);
                                }
                            }, $scope.isLocal);
                    });
                    confirmShowDialog.setButton("cancelBtn", function () {
                        confirmShowDialog.destroy();
                    });
                    confirmShowDialog.show();
                }
            };
            $scope.createExportBtn = {
                "id": "alarm-list-export",
                "text": $scope.i18n.common_term_export_button,
                "click": function () {
                    var options = {
                        "winId": "exportAlarmWinID",
                        "title": $scope.i18n.common_term_export_button || "导出",
                        "params": getQueryJsonInfo(),
                        "totalRecords": $scope.alarmListTable.totalRecords,
                        "content-type": "url",
                        "content": "./app/business/monitor/views/exportAlarm.html",
                        "height": 300,
                        "width": 500,
                        "resizable": true,
                        "maximizable": false,
                        "minimizable": false,
                        "buttons": null,
                        "open": function (event) {
                            $scope.clearTimer();
                        },
                        "close": function (event) {
                            intervalGet();
                        }
                    };
                    var win = new Window(options);
                    win.show();

                }
            };
            $scope.refresh = {
                "id": "ecsAlarmRefresh",
                "click": function () {
                    $scope.alarmListTable.curPage = {
                        "pageIndex": 1
                    };
                    page.currentPage = 1;
                    getData();
                }
            };
            $scope.columnConfig = {
                "id": "ecsAlarmColumnConfig",
                "click": function () {

                }
            };
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage == 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            $scope.alarmListTable = {
                "lengthMenu": [10, 20, 50],
                "id": "alarm-list-table",
                "captain": "vmCaptain",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "showDetails": {
                    "colIndex": 0,
                    "domPendType": "append"
                },
                "draggable": true,
                "columns": [
                    {
                        "sTitle": "<div id='_columns'></div>",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_level_label,
                        "mData": "severityValue",
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_alarmName_label,
                        "mData": "alarmName",
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_alarmObj_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resourceName);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_objectType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.moc);
                        },
                        "sWidth": "8%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_assemblyType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.compType);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_generantTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.occurTime);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_clearTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clearTime);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_clearType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clearType);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "bVisible": $scope.i18n.operateRight
                    }
                ],
                "data": null,
                "columnVisibility": {
                    "activate": "click",
                    "aiExclude": [0, 9],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {
                    }
                },

                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getData();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.alarmListTable.displayLength = evtObj.displayLength;
                    getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                    });

                    var alarmSeverityHtml = "<span class='alarm-picture-" + (aData.severity - 1) + " alarm-picture' style='line-height:16px;display:inline-block;'>" + $.encoder.encodeForHTML(aData.severityValue) + "</span>";
                    var alarmSeverityLink = $compile(alarmSeverityHtml);
                    var alarmSeverityScope = $scope.$new();
                    var alarmSeverityNode = alarmSeverityLink(alarmSeverityScope);
                    $("td:eq(1)", nRow).html(alarmSeverityNode);

                    if ($scope.operateRight) {
                        var checked = false;
                        for (var j = 0; j < $scope.checkboxData.length; j++) {
                            if (checkExistAlarm($scope.checkboxData[j], aData)) {
                                checked = true;
                                break;
                            }
                        }
                        var clearflag = (aData.category == "1" ? true : false);
                        var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'><tiny-checkbox text='' " +
                            "disable='" + (!clearflag) + "' id='id' checked='" + checked + "' change='change()'></tiny-checkbox></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.id = "monitorVmsCheckboxId" + iDataIndex;
                        var flag = false;
                        for (var i = 0; i < $scope.checkboxData.length; i++) {
                            if (checkExistAlarm($scope.checkboxData[i], aData)) {
                                flag = true;
                                break;
                            }
                        }
                        selBoxScope.checked = flag;
                        selBoxScope.change = function () {
                            selectAlarm(aData, $("#" + selBoxScope.id).widget().option("checked"));
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);
                    }

                    if (aData.urlHelp != "") {

                        if (!(aData.urlHelp.indexOf("http") == 0)) {
                            if (aData.urlHelp[0] != "/") {
                                aData.urlHelp = "/" + aData.urlHelp;
                            }
                        }
                        var alarmLinkHtml = "<a href='" + aData.urlHelp + "' target='_blank' title='" + $.encoder.encodeForHTML(aData.alarmName) + "'>" + $.encoder.encodeForHTML(aData.alarmName) + "</a> ";
                        var alarmLink = $compile(alarmLinkHtml);
                        var alarmLinkScope = $scope.$new();
                        var alarmLinkNode = alarmLink(alarmLinkScope);
                        $("td:eq(2)", nRow).html(alarmLinkNode);
                    }
                    if ($scope.operateRight) {
                        var optColumn = "";
                        if (clearflag) {
                            optColumn = optColumn + "<a href='javascript:void(0)' ng-click='clear()'>" + $scope.i18n.common_term_clear_button + "</a>&nbsp;&nbsp;";
                        } else {
                            optColumn = optColumn + "<span>" + $scope.i18n.common_term_clear_button + "</span>&nbsp;&nbsp;";
                        }
                        optColumn = optColumn + " <a href='javascript:void(0)' ng-click='shield()'>" + $scope.i18n.alarm_term_mask_button + "</a>";

                        var optLink = $compile($(optColumn));
                        var optScope = $scope.$new();
                        optScope.data = aData;
                        optScope.clear = function () {
                            $scope.clearTimer();
                            var confirmShowDialog = new Message({
                                "type": "confirm",
                                "title": $scope.i18n.common_term_clear_button,
                                "content": $scope.i18n.alarm_general_clear_info_confirm_msg,
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: $scope.i18n.common_term_ok_button,
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn: true,
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
                                var alarmMessage = [];
                                alarmMessage.push(getClearAlarm(aData));
                                AlarmService.clearAlarms(
                                    JSON.stringify({
                                        "alarmMessage": clearAlarmsProperty(alarmMessage)
                                    }), user,
                                    function (result) {
                                        if (result.result == true) {
                                            $scope.$apply(function () {
                                                for (var i = 0; i < $scope.checkboxData.length; i++) {
                                                    if (checkExistAlarm($scope.checkboxData[i], aData)) {
                                                        $scope.checkboxData.splice(i, 1);
                                                        break;
                                                    }
                                                }
                                                getData();
                                            });
                                        }
                                        if (result.result == false) {
                                            exception.doException(result.data, null);
                                        }
                                        intervalGet()
                                    }, $scope.isLocal);
                            });
                            confirmShowDialog.setButton("cancelBtn", function () {
                                confirmShowDialog.destroy();
                                intervalGet()
                            });
                            confirmShowDialog.show();

                        };
                        optScope.shield = function () {
                            $scope.clearTimer();
                            var confirmShowDialog = new Message({
                                "type": "confirm",
                                "title": $scope.i18n.alarm_term_mask_button,
                                "content": $scope.i18n.alarm_general_mask_info_confirm_msg,
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: $scope.i18n.common_term_ok_button,
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn: true,
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
                                var shieldAlarmList = [];
                                var info = {};
                                info.alarmid = aData.alarmId;
                                info.compType = aData.compType;
                                shieldAlarmList.push(info);
                                AlarmService.addShieldAlarms(
                                    JSON.stringify({
                                        "shieldAlarmList": shieldAlarmList
                                    }), user,
                                    function (result) {
                                        if (result.result == true) {
                                            $scope.$apply(function () {
                                                getData();
                                            });
                                        }
                                        if (result.result == false) {
                                            exception.doException(result.data, null);
                                        }
                                        intervalGet()
                                    });
                            });
                            confirmShowDialog.setButton("cancelBtn", function () {
                                confirmShowDialog.destroy();
                                intervalGet()
                            });
                            confirmShowDialog.show();
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(9)", nRow).html(optNode);
                    }

                }
            };

            function selectAlarm(iRow, checked) {
                var selected = $scope.checkboxData;
                if (checked) {
                    selected.push(getClearAlarm(iRow));
                } else {
                    for (var i = 0; i < selected.length; i++) {
                        if (checkExistAlarm(selected[i], iRow)) {
                            selected.splice(i, 1);
                        }
                    }
                }

                var headCheck = $("#monitorTableHeadCheckbox").widget();
                if (!!headCheck) {
                    headCheck.option("checked", getHeadCheckBoxValue());
                }
            }

            var tblHeadCheckbox = new Checkbox({
                "id": "monitorTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    var alarms = $scope.alarmListTable.data;
                    var isChecked = $("#monitorTableHeadCheckbox").widget().option("checked");
                    for (var i = 0; i < alarms.length; i++) {

                        //当数据是活动告警才可以勾选
                        if (alarms[i].category == "1") {
                            $("#monitorVmsCheckboxId" + i).widget().option("checked", isChecked);
                        }

                    }
                    if (isChecked && alarms) {
                        _.each(alarms, function (iRow) {
                            var flag = true;
                            for (var i = 0; i < $scope.checkboxData.length; i++) {
                                if (checkExistAlarm($scope.checkboxData[i], iRow)) {
                                    flag = false;
                                    break;
                                }
                            }
                            if (iRow.category != "1") {
                                flag = false;
                            }
                            if (flag) {
                                $scope.checkboxData.push(getClearAlarm(iRow));
                            }
                        })
                    }
                    if (isChecked == false && alarms) {
                        _.each(alarms, function (iRow) {
                            for (var i = 0; i < $scope.checkboxData.length; i++) {
                                if (checkExistAlarm($scope.checkboxData[i], iRow)) {
                                    $scope.checkboxData.splice(i, 1);
                                    break;
                                }
                            }
                        })
                    }
                }
            });

            function getClearAlarm(iRow) {
                var info = {};
                info.resourceID = iRow.resourceID;
                info.alarmID = iRow.alarmId;
                info.sn = iRow.sn;
                info.user = user.name;
                return info;
            }

            function clearAlarmsProperty(data) {
                for (var i = 0; i < data.length; i++) {
                    delete  data[i].user;
                }
                return data;
            }

            function checkExistAlarm(checkItem, iRow) {
                if (checkItem.resourceID == iRow.resourceID &&
                    checkItem.alarmID == iRow.alarmId &&
                    checkItem.sn == iRow.sn
                    ) {
                    return true;
                }
                return false;
            }

            function getQueryJsonInfo() {
                var inquiryCond = {};
                inquiryCond.severity = $scope.querySeverity;
                inquiryCond.alarmtype = $scope.queryAlarmType;
                inquiryCond.startTime = $scope.queryStartTime;
                inquiryCond.endTime = $scope.queryEndTime;
                inquiryCond.name = $scope.queryAlarmName;
                inquiryCond.resourceid = $scope.queryResourceid;
                inquiryCond.moc = $scope.queryMoc;

                if (inquiryCond.startTime != "") {
                    inquiryCond.startTime = CommonService.local2Utc(inquiryCond.startTime);
                }
                if (inquiryCond.endTime != "") {
                    inquiryCond.endTime = CommonService.local2Utc(inquiryCond.endTime);
                }
                $scope.querySeverity != "0" || delete inquiryCond.severity;
                $scope.queryAlarmType != "0" || delete inquiryCond.alarmtype;
                $scope.queryStartTime != "" || delete inquiryCond.startTime;
                $scope.queryEndTime != "" || delete inquiryCond.endTime;
                $scope.queryAlarmName != "" || delete inquiryCond.name;
                $scope.queryResourceid != "" || delete inquiryCond.resourceid;
                $scope.queryMoc != "" || delete inquiryCond.moc;

                return JSON.stringify({
                    "language": ($scope.i18n.locale == "zh" ? "zh_CN" : "en_US"),
                    "start": page.displayLength * (page.currentPage - 1),
                    "limit": page.displayLength,
                    "inquiryCond": inquiryCond
                });
            }

            function getHeadCheckBoxValue() {
                var selected = $scope.checkboxData;
                if (selected.length == 0) {
                    return false;
                }
                var flag = true;
                for (var j = 0; j < $scope.alarmListTable.data.length; j++) {
                    var exist = false;
                    for (var i = 0; i < selected.length; i++) {
                        if (checkExistAlarm(selected[i], $scope.alarmListTable.data[j])) {
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

            function getData(monitor) {
                AlarmService.getAlarmListInfos(
                    getQueryJsonInfo(), user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                $scope.alarmListTable.totalRecords = result.data.total;
                                $scope.alarmListTable.data = result.data.alarmlist;
                                tblHeadCheckbox.option("checked", getHeadCheckBoxValue());
                            });
                            if ($scope.operateRight) {
                                tblHeadCheckbox.rendTo($('#_columns'));
                            }

                            $("#" + $scope.searchLevel.id).widget().opChecked($scope.querySeverity);
                            $("#" + $scope.searchAlarmType.id).widget().opChecked($scope.queryAlarmType);
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    }, monitor, $scope.isLocal);
            };
            function intervalGet() {
                //每隔10s刷新一次
                $scope.promiseTime = $interval(function () {
                    if (0 == $(".alarm-detail").length) {
                        getData(false);
                    }
                }, 10000);
            };

            getData();
            intervalGet();
            /**
             * 清除定时器
             */
            $scope.clearTimer = function () {
                try {
                    $interval.cancel($scope.promiseTime);
                } catch (e) {
                }
            };
            $scope.$on('$destroy', function () {
                $scope.clearTimer();
            });
        }
    ];
    return alarmListCtrl;
});
