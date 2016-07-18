define(['jquery',
    "tiny-lib/angular",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/business/monitor/services/alarmService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"], function ($, angular, TextBox, Button, Window, Checkbox, Message, ExceptionService, AlarmService) {
    "use strict";

    var shieldConfigCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
        $scope.privilege = $("html").scope().user.privilege;
        $scope.operateRight = $scope.privilege.role_role_add_option_alarmHandle_value;
        var user = $("html").scope().user;
        $scope.checkboxData = [];
        $scope.checkboxDefineAlarmData = [];
        $scope.reqParams = {};
        $scope.reqParams.language = ($scope.i18n.locale == "zh" ?"zh_CN" : "en_US");
        $scope.reqParams.start = 0;
        $scope.reqParams.limit = 10;
        $scope.showWin = false;
        $scope.reqDefineParams = {};
        $scope.reqDefineParams.start = 0;
        $scope.reqDefineParams.limit = 10;
        var exception = new ExceptionService();
        $scope.createAddBtn = {
            "id": "shieldConfig-createBtn",
            "text": $scope.i18n.common_term_add_button,
            "click": function () {
                $scope.checkboxDefineAlarmData = [];
                $scope.alarmDefineListTable.curPage = {"pageIndex": 1};
                defineAlarmPage.currentPage = 1;
                defineAlarmPage.displayLength = 10;
                getDefineAlarmData();
                $scope.showWin = true;

            },
            "tooltip": "",
            "disable": false
        };
        $scope.createAlarmShieldBtn = {
            "id": "createAlarmShieldBtn",
            "text": $scope.i18n.common_term_add_button,
            "click": function () {

                var msg = "";
                if ($scope.checkboxDefineAlarmData.length > 100) {
                    msg = $scope.i18n.alarm_config_mask_info_max100_msg;
                }
                if ($scope.checkboxDefineAlarmData.length == 0) {
                    msg = $scope.i18n.vm_term_chooseAlarm_msg;
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

                AlarmService.addAlarmShieldAlarm(
                    JSON.stringify({"shieldAlarmList": clearDataProperty($scope.checkboxDefineAlarmData)}), user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                $scope.checkboxDefineAlarmData = [];
                                getData();
                                $scope.showWin = false;
                            });
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    });
            },
            "tooltip": "",
            "disable": false
        };

        $scope.queryAlarmShieldBtn = {
            "id": "queryAlarmShieldBtn",
            "text": $scope.i18n.common_term_query_button,
            "click": function () {
                $scope.checkboxDefineAlarmData = [];
                $scope.alarmDefineListTable.curPage = {"pageIndex": 1};
                defineAlarmPage.currentPage = 1;
                defineAlarmPage.displayLength = 10;
                getDefineAlarmData();

            },
            "tooltip": "",
            "disable": false
        };
        $scope.queryAlarmIdCtrl = {
            "id": "queryAlarmIdCtrl",
            "label": $scope.i18n.common_term_alarmID_label + ":",
            "value": "",
            "type": "input",
            "readonly": false
        };
        $scope.queryAlarmNameCtrl = {
            "id": "queryAlarmNameCtrl",
            "label": $scope.i18n.common_term_alarmName_label + ":",
            "value": "",
            "type": "input",
            "readonly": false
        };

        $scope.queryComTypeCtrl = {
            "id": "queryComTypeCtrl",
            "width": "150",
            "values": [
                { "selectId": "0", "label": $scope.i18n.common_term_allType_label, "checked": true },
                { "selectId": "FusionManager", "label": "FusionManager" },
                { "selectId": "FusionAccess", "label": "FusionAccess" },
                { "selectId": "FusionCompute", "label": "FusionCompute" },
                { "selectId": "FusionStorage", "label": "FusionStorage"},
                { "selectId": "DswareMgr", "label": "DswareMgr"},
                { "selectId": "SVN", "label": "SVN"},
                { "selectId": "NetScaler", "label": "NetScaler"},
                { "selectId": "OpenStack", "label": "OpenStack"},
                { "selectId": "VSAM", "label": "VSAM"}
            ]
        };
        $scope.deleteBtn = {
            "id": "shieldConfig-deleteBtn",
            "text": $scope.i18n.alarm_term_batchDel_button,
            "click": function () {

                var msg = "";
                if ($scope.checkboxData.length > 100) {
                    msg = $scope.i18n.alarm_config_delMax_info_confirm_msg;
                }
                if ($scope.checkboxData.length == 0) {
                    msg = $scope.i18n.vm_term_chooseAlarm_msg;
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
                    "title": $scope.i18n.common_term_confirm_label,
                    "content": $scope.i18n.alarm_general_unMaskBatch_info_confirm_msg,
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
                    AlarmService.cancelShieldAlarm(
                        JSON.stringify({"shieldAlarmList": clearDataProperty($scope.checkboxData)}), user,
                        function (result) {
                            if (result.result == true) {
                                $scope.$apply(function () {
                                    $scope.checkboxData = [];
                                    getData();
                                });
                            }
                            if (result.result == false) {
                                exception.doException(result.data, null);
                            }
                        });
                });
                confirmShowDialog.setButton("cancelBtn", function () {
                    confirmShowDialog.destroy();
                });
                confirmShowDialog.show();
            }
        };
        $scope.refresh = {
            "id": "ecsAlarmRefresh",
            "click": function () {
                getData();
            }
        };

        $scope.columnConfig = {
            "id": "ecsAlarmColumnConfig",
            "click": function () {
            }
        };

        $scope.currentItem = undefined;
        $scope.currentAlarmDefineItem = undefined;

        var page = {
            "currentPage": 1,
            "displayLength": 10,
            "getStart": function () {
                return page.currentPage == 0 ? 0 : (page.currentPage - 1) * page.displayLength;
            }
        };
        var defineAlarmPage = {
            "currentPage": 1,
            "displayLength": 10,
            "getStart": function () {
                return page.currentPage == 0 ? 0 : (page.currentPage - 1) * page.displayLength;
            }
        };

        $scope.shieldListTable = {
            "lengthMenu": [10, 20, 50],
            "id": "alarm-shield-table",
            "paginationStyle": "full_numbers",
            "displayLength": 10,
            "totalRecords": 0,
            "curPage": {"pageIndex": 1},
            "showDetails": false,
            "columns": [
                {
                    "sTitle": "<div  id='_columns' style='margin-left: 2px;'></div>",
                    "bSearchable": false,
                    "bSortable": false,
                    "bVisible": $scope.operateRight,
                    "sWidth": "30px"
                },
                {"sTitle": $scope.i18n.common_term_alarmID_label, "mData": function (data) {
                    return $.encoder.encodeForHTML(data.alarmid);
                }, "sWidth": "20%", "bSortable": false},
                {"sTitle": $scope.i18n.common_term_alarmName_label, "mData": function (data) {
                    return $.encoder.encodeForHTML(data.alarmName);
                }, "sWidth": "20%", "bSortable": false},
                {"sTitle": $scope.i18n.common_term_assemblyType_label, "mData": function (data) {
                    return $.encoder.encodeForHTML(data.compType);
                }, "sWidth": "20%", "bSortable": false},
                {"sTitle": $scope.i18n.common_term_createBy_label, "mData": function (data) {
                    return $.encoder.encodeForHTML(data.user);
                }, "sWidth": "20%", "bSortable": false},
                {"sTitle": $scope.i18n.common_term_operation_label, "mData": "opts", "sWidth": "20%", "bSortable": false, "bVisible": $scope.operateRight}
            ],
            "data": null,
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
                getData();
                $scope.shieldListTable.curPage.pageIndex = evtObj.currentPage;
            },
            "changeSelect": function (evtObj) {
                page.currentPage = evtObj.currentPage;
                page.displayLength = evtObj.displayLength;
                getData();
                $scope.shieldListTable.curPage.pageIndex = evtObj.currentPage;
                $scope.shieldListTable.displayLength = evtObj.displayLength;
            },
            "renderRow": function (nRow, aData, iDataIndex) {

                if (!$scope.operateRight) {
                    return;
                }

                var widgetThis = this;
                widgetThis.renderDetailTd.apply(widgetThis, arguments);
                $("td:eq(0)", nRow).bind("click", function () {
                    $scope.currentItem = aData;
                });

                var checked = false;
                for (var j = 0; j < $scope.checkboxData.length; j++) {
                    if (checkExistAlarmShield($scope.checkboxData[j], aData)) {
                        checked = true;
                        break;
                    }
                }

                var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'><tiny-checkbox text='' id='id' checked='" + checked + "' change='change()'></tiny-checkbox></div>";
                var selBoxLink = $compile(selBox);
                var selBoxScope = $scope.$new();
                selBoxScope.data = aData;
                selBoxScope.id = "chkShieldDataGridView" + iDataIndex;
                selBoxScope.change = function () {
                    setDataGrid_Row_CheckBoxData(
                        aData,
                        $("#" + selBoxScope.id).widget().option("checked"),
                        "#tableHeadCheckbox",
                        $scope.checkboxData,
                        $scope.shieldListTable.data,
                        checkExistAlarmShield,
                        getAlarmShield
                    )
                };
                var selBoxNode = selBoxLink(selBoxScope);
                $("td:eq(0)", nRow).append(selBoxNode);
                var optColumn = "<a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a> ";
                var optLink = $compile($(optColumn));

                var optScope = $scope.$new();
                optScope.data = aData;
                optScope["delete"] = function () {

                    var confirmShowDialog = new Message({
                        "type": "confirm",
                        "title": $scope.i18n.common_term_confirm_label,
                        "content": $scope.i18n.alarm_general_unMask_info_confirm_msg,
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
                        var shieldAlarmList = [];
                        shieldAlarmList.push(getAlarmShield(aData));
                        AlarmService.cancelShieldAlarm(
                            JSON.stringify({"shieldAlarmList": clearDataProperty(shieldAlarmList)}), user,
                            function (result) {
                                if (result.result == true) {
                                    $scope.$apply(function () {
                                        var selected = $scope.checkboxData;
                                        for (var i = 0; i < selected.length; i++) {
                                            if (checkExistAlarmShield(selected[i], aData)) {
                                                selected.splice(i, 1);
                                            }
                                        }
                                        getData();
                                    });
                                }
                                if (result.result == false) {
                                    exception.doException(result.data, null);
                                }
                            });
                    });
                    confirmShowDialog.setButton("cancelBtn", function () {
                        confirmShowDialog.destroy();
                    });
                    confirmShowDialog.show();

                };

                var optNode = optLink(optScope);
                $("td:eq(5)", nRow).html(optNode);
            }
        };

        $scope.alarmDefineListTable = {
            "lengthMenu": [10, 20, 50],
            "id": "alarmDefineListTable",
            "paginationStyle": "full_numbers",
            "displayLength": 10,
            "totalRecords": 0,
            "showDetails": false,
            "columns": [
                {
                    "sTitle": "<div id='_alarmDefineColumns' style='margin-left: 1px;'></div>",
                    "bSearchable": false,
                    "bSortable": false,
                    "sWidth": "25px"
                },
                {"sTitle": $scope.i18n.common_term_alarmID_label, "mData": function (data) {
                    return $.encoder.encodeForHTML(data.alarmId);
                }, "sWidth": "20%", "bSortable": false},
                {"sTitle": $scope.i18n.common_term_alarmName_label, "mData": function (data) {
                    return $.encoder.encodeForHTML(data.alarmName);
                }, "sWidth": "40%", "bSortable": false},
                {"sTitle": $scope.i18n.common_term_assemblyType_label, "mData": function (data) {
                    return $.encoder.encodeForHTML(data.compType);
                }, "sWidth": "40%", "bSortable": false}
            ],
            "data": [],
            "columnVisibility": {
                "activate": "click",
                "aiExclude": [0, 3],
                "bRestore": true,
                "fnStateChange": function (index, state) {

                }
            },
            "callback": function (evtObj) {
                defineAlarmPage.currentPage = evtObj.currentPage;
                defineAlarmPage.displayLength = evtObj.displayLength;
                getDefineAlarmData();
            },
            "changeSelect": function (evtObj) {
                defineAlarmPage.currentPage = evtObj.currentPage;
                defineAlarmPage.displayLength = evtObj.displayLength;
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
                selBoxScope.id = "chkDefineDataGridView" + iDataIndex;
                selBoxScope.change = function () {
                    setDataGrid_Row_CheckBoxData(
                        aData,
                        $("#" + selBoxScope.id).widget().option("checked"),
                        "#tblDefineAlarmHeadCheckbox",
                        $scope.checkboxDefineAlarmData,
                        $scope.alarmDefineListTable.data,
                        checkExistAlarmDefine,
                        getDefineAlarm
                    )
                };
                var selBoxNode = selBoxLink(selBoxScope);
                $("td:eq(0)", nRow).append(selBoxNode);

            }
        };

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

        var tblHeadCheckbox = new Checkbox({
            "id": "tableHeadCheckbox",
            "checked": false,
            "change": function () {
                setDataGridCheckBoxStatus("#tableHeadCheckbox", "#chkShieldDataGridView",
                    $scope.shieldListTable.data,
                    $scope.checkboxData,
                    checkExistAlarmShield,
                    getAlarmShield
                );
            }
        });

        var tblDefineAlarmHeadCheckbox = new Checkbox({
            "id": "tblDefineAlarmHeadCheckbox",
            "checked": false,
            "change": function () {

                setDataGridCheckBoxStatus("#tblDefineAlarmHeadCheckbox", "#chkDefineDataGridView",
                    $scope.alarmDefineListTable.data,
                    $scope.checkboxDefineAlarmData,
                    checkExistAlarmDefine,
                    getDefineAlarm
                );
            }
        });

        function setDataGridCheckBoxStatus
            (headCheckBoxId, dataGrid_RowCheckBoxId, dataGrid_dataSource, dataGrid_checkBoxData, checkExistFunctionName, createItemFunctionName) {
            var items = dataGrid_dataSource;
            var isChecked = $(headCheckBoxId).widget().option("checked");
            for (var i = 0; i < items.length; i++) {
                if($(dataGrid_RowCheckBoxId + i).widget())
                {
                    $(dataGrid_RowCheckBoxId + i).widget().option("checked", isChecked);
                }
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
        function getDefineAlarm(iRow) {
            var info = {};
            info.alarmid = iRow.alarmId;
            info.compType = iRow.compType;
            info.alarmName = iRow.alarmName;
            info.user = user.name;
            return info;
        }

        function getAlarmShield(iRow) {
            var info = {};
            info.alarmid = iRow.alarmid;
            info.compType = iRow.compType;
            info.alarmName = iRow.alarmName;
            info.user = iRow.user;
            return info;
        }

        function clearDataProperty(data)
        {
            for(var i = 0; i < data.length; i++)
            {
                delete  data[i].alarmName;
                delete  data[i].user;
            }
            return data;
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

        function checkExistAlarmShield(checkItem, iRow) {
            if (checkItem.alarmid === iRow.alarmid &&
                checkItem.compType === iRow.compType &&
                checkItem.alarmName === iRow.alarmName &&
                checkItem.user === iRow.user
                ) {
                return true;
            }
            return false;
        }

        function getQueryJsonInfo() {
            $scope.reqParams.language = ($scope.i18n.locale == "zh" ?"zh_CN" : "en_US");
            $scope.reqParams.start = page.displayLength * (page.currentPage - 1);
            $scope.reqParams.limit = page.displayLength;
        }

        function getData() {
            getQueryJsonInfo();
            AlarmService.getShieldAlarmInfo(
                $scope.reqParams, user,
                function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            $scope.shieldListTable.data = result.data.shieldAlarmList;
                            $scope.shieldListTable.totalRecords = result.data.total;
                            tblHeadCheckbox.option("checked",
                                getDataGridHeadCheckBoxValue(
                                    $scope.shieldListTable.data,
                                    $scope.checkboxData,
                                    checkExistAlarmShield
                                )
                            );
                        });
                        tblHeadCheckbox.rendTo($('#_columns'));

                    }
                    if (result.result == false) {
                        exception.doException(result.data, null);
                    }
                });
        };

        function getQueryDefineAlarmJsonInfo() {
            $scope.reqDefineParams.start = defineAlarmPage.displayLength * (defineAlarmPage.currentPage - 1);
            $scope.reqDefineParams.limit = defineAlarmPage.displayLength;
            $scope.reqDefineParams.compType = $("#queryComTypeCtrl").widget().getSelectedId();
            $scope.reqDefineParams.alarmId = $("#queryAlarmIdCtrl").widget().getValue();
            $scope.reqDefineParams.alarmName = $("#queryAlarmNameCtrl").widget().getValue();
            $scope.reqDefineParams.locale = ($scope.i18n.locale == "zh" ?"zh_CN" : "en_US");
        }

        function getDefineAlarmData() {
            getQueryDefineAlarmJsonInfo();
            AlarmService.getDefineAlarmInfo(
                $scope.reqDefineParams, user,
                function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            $scope.alarmDefineListTable.data = result.data.alarmList;
                            $scope.alarmDefineListTable.totalRecords = result.data.total;
                            tblDefineAlarmHeadCheckbox.option("checked",
                                getDataGridHeadCheckBoxValue(
                                    $scope.alarmDefineListTable.data,
                                    $scope.checkboxDefineAlarmData,
                                    checkExistAlarmDefine
                                ));
                        });
                        tblDefineAlarmHeadCheckbox.rendTo($('#_alarmDefineColumns'));

                    }
                    if (result.result == false) {
                        exception.doException(result.data, null);
                    }
                });
        }

        function page_load() {
            getData();
        }

        page_load();
    }];
    return shieldConfigCtrl;
});
