define(['jquery',
    "tiny-lib/angular",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/business/monitor/services/alarmService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"
], function ($, angular, TextBox, Button, Window, Checkbox, Message, ExceptionService, AlarmService, UnifyValid, ValidatorService) {
    "use strict";

    var threholdConfigCtrl = ["$scope", "$compile", "camel",
        function ($scope, $compile, camel) {
            $scope.privilege = $("html").scope().user.privilege;
            $scope.operateRight = $scope.privilege.role_role_add_option_alarmHandle_value;
            var exception = new ExceptionService();
            var user = $("html").scope().user;
            $scope.showWin = false;
            $scope.currentItem = null;
            $scope.showData = [];

            $scope.ds_awaitValid = false;

            UnifyValid.specialTypeValidator = function(level){
                var valueInput = $("#" + $scope[level[0]].id).widget().getValue();
                var emptInput = $scope.i18n.common_term_null_valid || "不能为空";
                var rangeDs_await = ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 1000) || "范围为1-1000" );
                var rangeOther = ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 100) || "范围为1-100" );
                var transInt = parseInt(valueInput, 10);
                if($scope.ds_awaitValid)
                {
                    if(0 == valueInput.length)
                    {
                        return emptInput;
                    }
                    else
                    {
                        return (transInt >= 1 && transInt <= 1000)?true:rangeDs_await;
                    }
                }
                else
                {
                    if(0 == valueInput.length)
                    {
                        return emptInput;
                    }
                    return (transInt >= 1 && transInt <= 100)?true:rangeOther;
                }
            };

            $scope.refreshBtn = {
                "id": "refreshBtn",
                "click": function () {
                    getData(false);
                }
            };
            $scope.saveBtn = {
                "id": "saveBtn",
                "text": $scope.i18n.common_term_save_label,
                "click": function () {
                    if (!validateData()) {
                        return;
                    }
                    update();
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $scope.showWin = false;
                    $scope.$digest();
                }
            };

            $scope.criticalChkCtrl = {
                "id": "criticalChkCtrl",
                "text": $scope.i18n.alarm_term_AlarmCritical_label + ":",
                "checked": false,
                "change": function () {
                    UnifyValid.clearValidate($("#" + $scope.criticalValueTxtCtrl.id).find("input"));
                    $("#" + $scope.criticalTxtCtrl.id).widget().option("value", ($("#" + $scope.criticalChkCtrl.id).widget().option("checked") == true ? ($scope.currentItem.compType == "OpenStack" ? ">" : ">=") : ""));
                    $("#" + $scope.criticalValueTxtCtrl.id).widget().option("value", "");
                    $("#" + $scope.criticalValueTxtCtrl.id).widget().option("disable", !$("#" + $scope.criticalChkCtrl.id).widget().option("checked"));
                }
            };
            $scope.criticalTxtCtrl = {
                "id": "criticalTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": true
            };
            $scope.criticalValueTxtCtrl = {
                "id": "criticalValueTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": true,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 100) || "1 ～ 100（含1和100）之间的整数。"),
                "extendFunction":["specialTypeValidator"],
                "validate": "specialTypeValidator(criticalValueTxtCtrl):"
            };

            $scope.majorChkCtrl = {
                "id": "majorChkCtrl",
                "text": $scope.i18n.alarm_term_alarmMajor_label + ":",
                "checked": false,
                "change": function () {
                    UnifyValid.clearValidate($("#" + $scope.majorValueTxtCtrl.id).find("input"));
                    $("#" + $scope.majorTxtCtrl.id).widget().option("value", ($("#" + $scope.majorChkCtrl.id).widget().option("checked") == true ? ($scope.currentItem.compType == "OpenStack" ? ">" : ">=") : ""));
                    $("#" + $scope.majorValueTxtCtrl.id).widget().option("value", "");
                    $("#" + $scope.majorValueTxtCtrl.id).widget().option("disable", !$("#" + $scope.majorChkCtrl.id).widget().option("checked"));
                }
            };
            $scope.majorTxtCtrl = {
                "id": "majorTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": true
            };
            $scope.majorValueTxtCtrl = {
                "id": "majorValueTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": true,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 100) || "1 ～ 100（含1和100）之间的整数。"),
                "extendFunction":["specialTypeValidator"],
                "validate": "specialTypeValidator(majorValueTxtCtrl):"
            };

            $scope.minorChkCtrl = {
                "id": "minorChkCtrl",
                "text": $scope.i18n.alarm_term_alarmMinor_label + ":",
                "checked": false,
                "change": function () {
                    UnifyValid.clearValidate($("#" + $scope.minorValueTxtCtrl.id).find("input"));
                    $("#" + $scope.minorTxtCtrl.id).widget().option("value", ($("#" + $scope.minorChkCtrl.id).widget().option("checked") == true ? ($scope.currentItem.compType == "OpenStack" ? ">" : ">=") : ""));
                    $("#" + $scope.minorValueTxtCtrl.id).widget().option("value", "");
                    $("#" + $scope.minorValueTxtCtrl.id).widget().option("disable", !$("#" + $scope.minorChkCtrl.id).widget().option("checked"));
                }
            };
            $scope.minorTxtCtrl = {
                "id": "minorTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": true
            };
            $scope.minorValueTxtCtrl = {
                "id": "minorValueTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": true,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 100) || "1 ～ 100（含1和100）之间的整数。"),
                "extendFunction":["specialTypeValidator"],
                "validate": "specialTypeValidator(minorValueTxtCtrl):"
            };

            $scope.warningChkCtrl = {
                "id": "warningChkCtrl",
                "text": $scope.i18n.alarm_term_alarmWarning_label + ":",
                "checked": false,
                "change": function () {
                    UnifyValid.clearValidate($("#" + $scope.warningValueTxtCtrl.id).find("input"));
                    $("#" + $scope.warningTxtCtrl.id).widget().option("value", ($("#" + $scope.warningChkCtrl.id).widget().option("checked") == true ? ($scope.currentItem.compType == "OpenStack" ? ">" : ">=") : ""));
                    $("#" + $scope.warningValueTxtCtrl.id).widget().option("value", "");
                    $("#" + $scope.warningValueTxtCtrl.id).widget().option("disable", !$("#" + $scope.warningChkCtrl.id).widget().option("checked"));
                }
            };
            $scope.warningTxtCtrl = {
                "id": "warningTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": true
            };
            $scope.warningValueTxtCtrl = {
                "id": "warningValueTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": true,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 100) || "1 ～ 100（含1和100）之间的整数。"),
                "extendFunction":["specialTypeValidator"],
                "validate": "specialTypeValidator(warningValueTxtCtrl):"
            };

            $scope.eviValueTxtCtrl = {
                "id": "eviValueTxtCtrl",
                "label": "",
                "value": ">=",
                "type": "input",
                "disable": true
            };
            $scope.eviValueValueTxtCtrl = {
                "id": "eviValueValueTxtCtrl",
                "label": "",
                "value": "",
                "type": "input",
                "disable": false,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 10) || "1 ～ 10（含1和10）之间的整数。"),
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 10) || "范围为1-10" ) +
                    ";maxValue(10):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 10) || "范围为1-10" )
            };

            function attr2id(attr) {
                return attr.replace(/[\.\/\\]/g, "_");
            }

            $scope.threholdListTable = {
                "lengthMenu": [10, 20, 50],
                "id": "threholdListTable",
                "paginationStyle": "full_numbers",
                "hideTotalRecords": true,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_indexEntries_label,
                        "mData": "metricDesc",
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_assemblyName_label || "部件名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.compName);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },

                    {
                        "sTitle": $scope.i18n.common_term_alarmObjSort_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.objectType);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_alarmID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.alarmidListView);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_AlarmCritical_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.criticalDesc);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_alarmMajor_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.majorDesc);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_alarmMinor_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.minorDesc);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_alarmWarning_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.warningDesc);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_offset_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.eviValueDesc);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "offset",
                        "sWidth": "10%",
                        "bSortable": false,
                        "bVisible": $scope.operateRight
                    }
                ],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(3)", nRow).addTitle();
                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);

                    nRow.id = attr2id(aData.pid) + "_" + iDataIndex;
                    if (aData.show == false) {
                        $(nRow).hide();
                    }

                        if (!!$scope.operateRight) {
                            var optColumn = "<a href='javascript:void(0)' ng-click='shield()'>" +
                                (aData.sheild == false ? $scope.i18n.alarm_term_mask_button : $scope.i18n.common_term_unMask_button) +
                                "</a> ";
                            if(aData.level == 1)
                            {
                                optColumn = "<a href='javascript:void(0)' ng-click='modify()'>" + $scope.i18n.common_term_modify_button + "</a>"
                            }
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.data = aData;
                            optScope.modify = function () {
                                $scope.currentItem = aData;
                                $scope.ds_awaitValid = aData.id == "ds_await";
                                initModifyView();
                                $scope.showWin = true;
                            };
                            optScope.shield = function () {

                                var msg = (aData.sheild == false ? $scope.i18n.alarm_general_maskIndicator_info_confirm_msg : $scope.i18n.alarm_general_unMask_info_confirm_msg);
                                var titleMsg = (aData.sheild == false ? $scope.i18n.common_term_confirm_label : $scope.i18n.common_term_confirm_label);
                                var confirmShowDialog = new Message({
                                    "type": "prompt",
                                    "title": titleMsg,
                                    "content": msg,
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
                                    updateShiled(aData);
                                });
                                confirmShowDialog.setButton("cancelBtn", function () {
                                    confirmShowDialog.destroy();
                                });
                                confirmShowDialog.show();
                            };
                            var optNode = optLink(optScope);
                            $("td:eq(9)", nRow).html(optNode);
                        }
                    if(aData.level == 0)
                    {

                        var optColumn = "<span>" + aData.metricDesc + "</span>";
                        optColumn = "<div ng-click='show()' id='div_" + attr2id(aData.metricId) + "' class='btn_detail_switch " + getShowDesc(aData.metricId) + " ng-scope' style='position: relative;top: 10px; margin: 0px 8px 0px 0px;'></div>" + optColumn;
                        var optLink = $compile($(optColumn));
                        var optScope = $scope.$new();
                        optScope.data = aData;
                        optScope.show = function () {
                            var show = $("#div_" + attr2id(aData.metricId)).attr('class') == "btn_detail_switch default_show_style ng-scope" ? true : false;
                            if ($("#div_" + attr2id(aData.metricId)).attr('class') == "btn_detail_switch default_show_style ng-scope") {
                                $("#div_" + attr2id(aData.metricId)).removeClass('btn_detail_switch default_show_style ng-scope');
                                $("#div_" + attr2id(aData.metricId)).addClass('btn_detail_switch default_hide_style ng-scope');
                            } else {
                                $("#div_" + attr2id(aData.metricId)).removeClass('btn_detail_switch default_hide_style ng-scope');
                                $("#div_" + attr2id(aData.metricId)).addClass('btn_detail_switch default_show_style ng-scope');
                            }

                            for (var i = 0; i < $scope.threholdListTable.data.length; i++) {

                                if ($scope.threholdListTable.data[i].pid == aData.metricId) {
                                    $scope.threholdListTable.data[i].show = show;
                                    if (show) {
                                        $("#" + attr2id(aData.metricId) + "_" + i).show();
                                        addShowData($scope.threholdListTable.data[i].id + "_" + $scope.threholdListTable.data[i].objectType);
                                    } else {
                                        $("#" + attr2id(aData.metricId) + "_" + i).hide();
                                        removeShowData($scope.threholdListTable.data[i].id + "_" + $scope.threholdListTable.data[i].objectType);
                                    }

                                }
                            }
                        };

                        var optNode = optLink(optScope);
                        $("td:eq(0)", nRow).html(optNode);
                    }

                }
            };

            function initModifyView() {
                UnifyValid.clearValidate($("#" + $scope.criticalValueTxtCtrl.id).find("input"));
                UnifyValid.clearValidate($("#" + $scope.majorValueTxtCtrl.id).find("input"));
                UnifyValid.clearValidate($("#" + $scope.minorValueTxtCtrl.id).find("input"));
                UnifyValid.clearValidate($("#" + $scope.warningValueTxtCtrl.id).find("input"));
                UnifyValid.clearValidate($("#" + $scope.eviValueValueTxtCtrl.id).find("input"));
                var unSetValue = 65535;

                $("#" + $scope.criticalChkCtrl.id).widget().option("checked", ($scope.currentItem.critical == unSetValue ? false : true));
                $("#" + $scope.criticalTxtCtrl.id).widget().option("value", ($("#" + $scope.criticalChkCtrl.id).widget().option("checked") == true ? ($scope.currentItem.compType == "OpenStack" ? ">" : ">=") : ""));
                $("#" + $scope.criticalValueTxtCtrl.id).widget().option("value", ($scope.currentItem.critical == unSetValue ? "" : $scope.currentItem.critical));
                $("#" + $scope.criticalValueTxtCtrl.id).widget().option("disable", !$("#" + $scope.criticalChkCtrl.id).widget().option("checked"));

                $("#" + $scope.majorChkCtrl.id).widget().option("checked", ($scope.currentItem.major == unSetValue ? false : true));
                $("#" + $scope.majorTxtCtrl.id).widget().option("value", ($("#" + $scope.majorChkCtrl.id).widget().option("checked") == true ? ($scope.currentItem.compType == "OpenStack" ? ">" : ">=") : ""));
                $("#" + $scope.majorValueTxtCtrl.id).widget().option("value", ($scope.currentItem.major == unSetValue ? "" : $scope.currentItem.major));
                $("#" + $scope.majorValueTxtCtrl.id).widget().option("disable", !$("#" + $scope.majorChkCtrl.id).widget().option("checked"));

                $("#" + $scope.minorChkCtrl.id).widget().option("checked", ($scope.currentItem.minor == unSetValue ? false : true));
                $("#" + $scope.minorTxtCtrl.id).widget().option("value", ($("#" + $scope.minorChkCtrl.id).widget().option("checked") == true ? ($scope.currentItem.compType == "OpenStack" ? ">" : ">=") : ""));
                $("#" + $scope.minorValueTxtCtrl.id).widget().option("value", ($scope.currentItem.minor == unSetValue ? "" : $scope.currentItem.minor));
                $("#" + $scope.minorValueTxtCtrl.id).widget().option("disable", !$("#" + $scope.minorChkCtrl.id).widget().option("checked"));

                $("#" + $scope.warningChkCtrl.id).widget().option("checked", ($scope.currentItem.warning == unSetValue ? false : true));
                $("#" + $scope.warningTxtCtrl.id).widget().option("value", ($("#" + $scope.warningChkCtrl.id).widget().option("checked") == true ? ($scope.currentItem.compType == "OpenStack" ? ">" : ">=") : ""));
                $("#" + $scope.warningValueTxtCtrl.id).widget().option("value", ($scope.currentItem.warning == unSetValue ? "" : $scope.currentItem.warning));
                $("#" + $scope.warningValueTxtCtrl.id).widget().option("disable", !$("#" + $scope.warningChkCtrl.id).widget().option("checked"));

                $("#" + $scope.eviValueValueTxtCtrl.id).widget().option("value", $scope.currentItem.eviValue);

            }

            function createObject() {
                var info = {};
                var unSetValue = 65535;
                info.thresholdId = $scope.currentItem.thresholdId;
                info.alarmidList = $scope.currentItem.alarmidList;
                info.id = $scope.currentItem.id;
                info.metricDesc = $scope.currentItem.metricDesc;
                info.objectType = $scope.currentItem.objectType;
                info.objectTypeDesc = $scope.currentItem.objectTypeDesc;
                info.unit = $scope.currentItem.unit;
                info.critical = ($("#" + $scope.criticalChkCtrl.id).widget().option("checked") == true ? $("#" + $scope.criticalValueTxtCtrl.id).widget().getValue() : unSetValue);
                info.major = ($("#" + $scope.majorChkCtrl.id).widget().option("checked") == true ? $("#" + $scope.majorValueTxtCtrl.id).widget().getValue() : unSetValue);
                info.minor = ($("#" + $scope.minorChkCtrl.id).widget().option("checked") == true ? $("#" + $scope.minorValueTxtCtrl.id).widget().getValue() : unSetValue);
                info.warning = ($("#" + $scope.warningChkCtrl.id).widget().option("checked") == true ? $("#" + $scope.warningValueTxtCtrl.id).widget().getValue() : unSetValue);
                info.eviValue = ($scope.currentItem.compType == "OpenStack" ? "0" : $("#" + $scope.eviValueValueTxtCtrl.id).widget().getValue());
                info.compType = $scope.currentItem.compType;
                return info;
            }

            function addShowData(id) {
                var flag = true;
                for (var i = 0; i < $scope.showData.length; i++) {
                    if ($scope.showData[i] == id) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    $scope.showData.push(id);
                }
            }

            function removeShowData(id) {
                for (var i = 0; i < $scope.showData.length; i++) {
                    if ($scope.showData[i] == id) {
                        $scope.showData.splice(i, 1);
                    }
                }
            }

            function getShowDesc(metricId) {
                for (var i = 0; i < $scope.threholdListTable.data.length; i++) {

                    if ($scope.threholdListTable.data[i].level == 1 && $scope.threholdListTable.data[i].pid == metricId) {
                        if ($scope.threholdListTable.data[i].show == true) {
                            return "default_hide_style";
                        }
                    }
                }

                return "default_show_style"
            }

            function updateTable(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].level == 0) {
                        continue;
                    }
                    var show = false;
                    for (var j = 0; j < $scope.showData.length; j++) {
                        if ($scope.showData[j] == (data[i].id + "_" + data[i].objectType)) {
                            show = true;
                            break;
                        }
                    }

                    data[i].show = show;

                }

                return data;
            }

            function update() {
                var info = createObject();
                AlarmService.modifyThreshold(
                    JSON.stringify(info), user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                getData(false);
                                $scope.showWin = false;
                            });
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    });
            }

            function getAlarmShields(iRow) {
                var infoList = [];

                for (var i = 0; i < iRow.alarmidList.length; i++) {
                    var info = {};
                    info.alarmid = iRow.alarmidList[i];
                    info.compType = iRow.compType;
                    infoList.push(info);
                }

                return infoList;
            }

            function updateShiled(iRow) {
                var infoList = getAlarmShields(iRow);
                if (iRow.sheild == true) {
                    AlarmService.cancelShieldAlarm(
                        JSON.stringify({
                            "shieldAlarmList": infoList
                        }), user,
                        function (result) {
                            if (result.result == true) {
                                $scope.$apply(function () {
                                    getData(false);
                                });
                            }
                            if (result.result == false) {
                                exception.doException(result.data, null);
                            }
                        });
                } else {
                    AlarmService.addAlarmShieldAlarm(
                        JSON.stringify({
                            "shieldAlarmList": infoList
                        }), user,
                        function (result) {
                            if (result.result == true) {
                                $scope.$apply(function () {
                                    getData(false);
                                });
                            }
                            if (result.result == false) {
                                exception.doException(result.data, null);
                            }
                        });
                }
            }

            function validateData() {
                if (!UnifyValid.FormValid($("#modifyView"))) {
                    return false;
                }
                return true;
            }

            function getData(isPageLoad) {
                AlarmService.getThresholdData(
                    ($scope.i18n.locale == "zh" ?"zh_CN" : "en_US") , user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {

                                if(isPageLoad)
                                {
                                    for (var i = 0; i < result.data.length; i++) {
                                        addShowData(result.data[i].id + "_" + result.data[i].objectType);
                                    }
                                }

                                $scope.threholdListTable.data = updateTable(result.data);

                            });

                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    });
            };

            function page_load() {

                getData(true);
            }

            page_load();
        }
    ];
    return threholdConfigCtrl;
});
