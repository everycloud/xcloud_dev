/* global define */
define(['jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-lib/encoder",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "app/services/commonService",
    "app/services/exceptionService",
    "app/business/monitor/services/performanceService",
    "app/services/cloudInfraService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"
], function ($, angular, _, $encoder, TextBox, Button, Window, Checkbox, commonService, exceptionService, performanceService, cloudInfraService) {
    "use strict";

    var alarmListCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$q", "exception", "message", "storage", "$interval",
        function ($scope, $compile, $state, $stateParams, camel, $q, exception, message, storage, $interval) {

            //公共服务实例
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var exceptionServiceIns = new exceptionService();
            var performanceServiceIns = new performanceService(exception, $q, camel);
            var user = $scope.user;
            var cloudInfraId = "";
            var i18n = $scope.i18n || {};
            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            // 权限控制
            //告警
            $scope.hasAlarmRight = _.contains(user.privilegeList, "106000");
            //告警查看
            $scope.hasAlarmViewRight = _.contains(user.privilegeList, "106001");
            //告警操作
            $scope.hasAlarmOperateRight = _.contains(user.privilegeList, "106002");
            //存储当前已选择的告警
            $scope.checkboxData = [];
            // 存储当前点击展开的详情
            $scope.currentItem = undefined;
            //查询条件
            var severity = !$stateParams.severity ? "0" : $stateParams.severity;
            var alarmType = !$stateParams.alarmtype ? "0" : $stateParams.alarmtype;
            var startTime = "";
            var endTime = "";
            var name = "";
            var resourceId = !$stateParams.resourceid ? "" : $stateParams.resourceid;
            var moc = !$stateParams.moc ? "" : $stateParams.moc;
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

            $scope.$watch("checkboxData", function (newV) {
                var widget = $("#" + $scope.clearBtn.id).widget();
                if (!widget) {
                    return;
                }
                if (newV.length > 0) {
                    $("#" + $scope.clearBtn.id).widget().option("disable", false);
                }
                else {
                    $("#" + $scope.clearBtn.id).widget().option("disable", true);
                }
            });
            //地址下拉框
            $scope.address = {
                "id": "alarmAddress",
                "width": "150",
                "height": "200",
                "values": [],
                "change": function () {
                    cloudInfraId = $("#alarmAddress").widget().getSelectedId();
                    storage.add("cloudInfraId", cloudInfraId);
                    page.currentPage = 1;
                    //更新列表数据
                    $scope.getData(true);
                }
            };
            //所有级别下拉框
            $scope.searchLevel = {
                "id": "monitorAlarmSearchLevel",
                "width": "120",
                "values": [
                    {
                        "selectId": "0",
                        "label": i18n.common_term_allLevel_label,
                        "checked": !$stateParams.severity || $stateParams.severity === "0"
                    },
                    {
                        "selectId": "1",
                        "label": i18n.alarm_term_critical_label,
                        "checked": $stateParams.severity === "1"
                    },
                    {
                        "selectId": "2",
                        "label": i18n.alarm_term_major_label,
                        "checked": $stateParams.severity === "2"
                    },
                    {
                        "selectId": "3",
                        "label": i18n.alarm_term_minor_label,
                        "checked": $stateParams.severity === "3"
                    },
                    {
                        "selectId": "4",
                        "label": i18n.alarm_term_warning_label,
                        "checked": $stateParams.severity === "4"
                    }
                ],
                "change": function () {
                    severity = $("#monitorAlarmSearchLevel").widget().getSelectedId();
                    page.currentPage = 1;
                    $scope.getData(true);
                }
            };

            //所有对象下拉框
            $scope.searchAlarmType = {
                "id": "monitorAlarmType",
                "width": "120",
                "values": [
                    {
                        "selectId": "0",
                        "label": i18n.alarm_term_allAlarmType_label,
                        "checked": !$stateParams.alarmtype || $stateParams.alarmtype === "0"
                    },
                    {
                        "selectId": "1",
                        "label": i18n.common_term_noResume_value,
                        "checked": $stateParams.alarmtype === "1"
                    },
                    {
                        "selectId": "2",
                        "label": i18n.common_term_resumed_value,
                        "checked": $stateParams.alarmtype === "2"
                    }
                ],
                "change": function () {
                    alarmType = $("#" + $scope.searchAlarmType.id).widget().getSelectedId();
                    page.currentPage = 1;
                    $scope.getData(true);
                }
            };
            $scope.time = {
                "startTimeId": "monitorStartTime",
                "endTimeId": "monitorEndTime",
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
                            $("#" + $scope.time.endTimeId).widget().option("minDate", date);
                        }
                        else{
                            $("#" + $scope.time.endTimeId).widget().option("minDate", formatDate(MIN_DATE));
                        }
                        page.currentPage = 1;
                        getSelectTime();
                        $scope.getData(true);
                    }
                },
                end: {
                    minDate: formatDate(MIN_DATE),
                    maxDate: formatDate(),
                    onClose: function (date) {
                        if(date){
                            $("#" + $scope.time.startTimeId).widget().option("maxDate", date);
                        }
                        else{
                            $("#" + $scope.time.startTimeId).widget().option("maxDate", formatDate());
                        }
                        page.currentPage = 1;
                        getSelectTime();
                        $scope.getData(true);
                    }
                }
            };
            //条件搜索下拉框
            $scope.searchBox = {
                "id": "monitorAlarmSearchBox",
                "placeholder": i18n.common_term_findAlarmObjName_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    name = searchString;
                    page.currentPage = 1;
                    $scope.getData(true);
                }
            };

            //创建清除按钮
            $scope.clearBtn = {
                "id": "alarm-list-clear",
                "text": i18n.common_term_clear_button,
                "disable": true,
                "click": function () {
                    var params = $scope.checkboxData;
                    var alarmMessage = [];
                    var item = null;

                    _.each(params, function (param) {
                        item = {
                            "resourceID": param.resourceID,
                            "alarmID": param.alarmId,
                            "sn": param.sn
                        };
                        alarmMessage.push(item);
                    });
                    $scope.clearAlarm(alarmMessage, "batch");
                }
            };

            //创建导出按钮
            $scope.createExportBtn = {
                "id": "alarm-list-export",
                "text": i18n.common_term_export_button,
                "click": function () {
                    var options = {
                        "winId": "exportAlarmWinID",
                        "title": $scope.i18n.common_term_export_button || "导出",
                        "queryCondition": getQueryCondition(),
                        "totalRecords": $scope.alarmListTable.totalRecords,
                        "cloudInfraId":cloudInfraId,
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

            //刷新
            $scope.refresh = {
                "id": "ecsAlarmRefresh",
                "click": function () {
                    $scope.getData(true);
                }
            };

            //帮助
            $scope.help = {
                "id": "monitorAlarmHelp",
                "helpKey": "drawer_alarm",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.alarmListTable = {
                "id": "alarm-list-table",
                "captain": "vmCaptain",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "lengthMenu": [10, 20, 30],
                "totalRecords": 0,
                "showDetails": {
                    "colIndex": 0,
                    "domPendType": "append"
                },
                "draggable": true,
                "columns": [
                    {
                        "sTitle": "", //设置第一列的标题
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": i18n.alarm_term_level_label,
                        "mData": "severity",
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_name_label,
                        "mData": "alarmName",
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_alarmObj_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resourceName);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_objectType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.moc);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_assemblyType_label,
                        "mData": "compType",
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_generantTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.occurTime);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.alarm_term_clearTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clearTime);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.alarm_term_clearType_label,
                        "mData": "clearType",
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "operation",
                        "sWidth": "10%",
                        "bSortable": false
                    }
                ],
                "data": [],
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
                    $scope.getData(true);
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.alarmListTable.displayLength = evtObj.displayLength;
                    $scope.getData(true);
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                        $scope.currentItem.cloudInfraId = cloudInfraId;
                    });

                    //tips提示
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                    $("td:eq(7)", nRow).addTitle();

                    if (aData.severity + "" === "1") {
                        $("td:eq(1)", nRow).text(i18n.alarm_term_critical_label);
                    } else if (aData.severity + "" === "2") {
                        $("td:eq(1)", nRow).text(i18n.alarm_term_major_label);
                    } else if (aData.severity + "" === "3") {
                        $("td:eq(1)", nRow).text(i18n.alarm_term_minor_label);
                    } else if (aData.severity + "" === "4") {
                        $("td:eq(1)", nRow).text(i18n.alarm_term_warning_label);
                    } else {
                        $("td:eq(1)", nRow).text(i18n.common_term_unknown_value);
                    }

                    //清除类型
                    if (aData.clearType + "" === "2") {
                        $("td:eq(8)", nRow).text(i18n.common_term_manualClear_label);
                    } else if (aData.clearType + "" === "0") {
                        $("td:eq(8)", nRow).text(i18n.common_term_autoClear_label);
                    }

                    if (aData.urlHelp !== "") {

                        if ((aData.urlHelp.indexOf("http") !== 0)) {
                            if (aData.urlHelp[0] !== "/") {
                                aData.urlHelp = "/" + aData.urlHelp;
                            }
                        }
                        var alarmLinkHtml = "<a href='" + aData.urlHelp + "' target='_blank' >" + $.encoder.encodeForHTML(aData.alarmName) + "</a> ";
                        var alarmLink = $compile(alarmLinkHtml);
                        var alarmLinkScope = $scope.$new();
                        var alarmLinkNode = alarmLink(alarmLinkScope);
                        $("td:eq(2)", nRow).html(alarmLinkNode);
                    }

                    // 复选框
                    var selBox = "";
                    if (aData.clearType + "" === "0" || aData.clearType + "" === "2") {
                        selBox = "<div style='position: relative;top: 0px;margin:auto;width: 16px;height: 16px'><tiny-checkbox text='' id='id' disable= 'true' checked='' change='change()'></tiny-checkbox></div>";
                    }
                    else {
                        selBox = "<div style='position: relative;top: 0px;margin:auto;width: 16px;height: 16px'><tiny-checkbox text='' id='id' checked='' change='change()'></tiny-checkbox></div>";
                    }
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.id = "monitorVmsCheckboxId" + iDataIndex;
                    selBoxScope.checked = aData.checked;
                    selBoxScope.change = function () {
                        selectAlarm(aData, $("#" + selBoxScope.id).widget().option("checked"));
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).append(selBoxNode);

                    if (!$scope.hasAlarmOperateRight) {
                        return;
                    }
                    // 操作列
                    var optColumn = "";
                    if (aData.clearType + "" === "0" || aData.clearType + "" === "2") {
                        optColumn = "<span>" + i18n.common_term_clear_button + "</span> ";
                    }
                    else {
                        optColumn = "<a class='btn-link' ng-click='clear()'>" + i18n.common_term_clear_button + "</a> ";
                    }
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.data = aData;
                    optScope.clear = function () {
                        var params = [
                            {
                                "resourceID": aData.resourceID,
                                "alarmID": aData.alarmId,
                                "sn": aData.sn
                            }
                        ];
                        //清除告警
                        $scope.clearAlarm(params);
                    };
                    optScope.shield = function () {
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(9)", nRow).html(optNode);
                }
            };

            // 勾选、去勾告警
            function selectAlarm(alarm, checked) {
                var selected = $scope.checkboxData;
                var datas = [];
                if (checked) {
                    selected.push(alarm);
                } else {
                    for (var i = 0; i < selected.length; i++) {
                        if (selected[i].alarmId === alarm.alarmId) {
                            selected.splice(i, 1);
                        }
                    }
                }
                _.each(selected, function (item) {
                    datas.push(item);
                });
                var headCheck = $("#monitorTableHeadCheckbox").widget();
                if (headCheck) {
                    if (selected.length < $("#alarm-list-table").widget().options.data.length) {
                        headCheck.option("checked", false);
                    } else {
                        headCheck.option("checked", true);
                    }
                }
                $scope.checkboxData = datas;
            }

            //生成一个checkbox放在表头处
            var tblHeadCheckbox = new Checkbox({
                "id": "monitorTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    var checkboxData = [];
                    var alarms = $scope.alarmListTable.data;
                    if (!alarms) {
                        return;
                    }
                    var isChecked = $("#monitorTableHeadCheckbox").widget().option("checked");
                    var item = null;
                    var clearType = null;
                    for (var i = 0, len = alarms.length; i < len; i++) {
                        item = alarms[i];
                        clearType = "" + item.clearType;
                        if (clearType === "0" || clearType === "2") {
                            $("#monitorVmsCheckboxId" + i).widget().option("checked", false);
                        }
                        else {
                            $("#monitorVmsCheckboxId" + i).widget().option("checked", isChecked);
                            if (isChecked) {
                                checkboxData.push(item);
                            }
                        }
                    }
                    // 将已勾选的虚拟机id保存到checkboxData
                    $scope.$apply(function () {
                        $scope.checkboxData = checkboxData;
                    });
                }
            });

            // 获取当前选中的时间
            function getSelectTime() {
                var start = $("#" + $scope.time.startTimeId).widget().getDateTime();
                var end = $("#" + $scope.time.endTimeId).widget().getDateTime();
                if (start) {
                    start = commonService.local2Utc(start);
                }
                if (end) {
                    end = commonService.local2Utc(end);
                }

                startTime = start;
                endTime = end;
            }

            // 查询告警列表信息
            $scope.getData = function (monitor) {
                var deferred = camel.post({
                    "url": {
                        "s": "/goku/rest/v1.5/{vdc_id}/alarms?cloud-infra={cloud_infra_id}",
                        "o": {
                            "vdc_id": user.vdcId,
                            "cloud_infra_id": cloudInfraId
                        }
                    },
                    "params": JSON.stringify({
                        "language": $scope.urlParams.lang === "zh" ? "zh_CN" : "en_US",
                        "start": page.getStart(),
                        "limit": page.displayLength,
                        "inquiryCond": getQueryCondition()
                    }),
                    "monitor" : monitor,
                    "userId": user.id
                });
                deferred.success(function (data, textStatus, jqXHR) {
                    if (!data) {
                        return;
                    }
                    var alarmInfos = data.alarmlist;
                    _.each(alarmInfos, function (item) {
                        if (item.occurTime !== "-") {
                            item.occurTime = commonService.utc2Local(item.occurTime);
                        }

                        if (item.clearTime !== "-") {
                            item.clearTime = commonService.utc2Local(item.clearTime);
                        }
                        _.extend(item, {
                            "showDetail": "",
                            "operation": "",
                            "detail": {
                                contentType: "url",
                                content: "app/business/monitor/views/alarmDetail.html"
                            }
                        });
                    });
                    $scope.$apply(function () {
                        $scope.alarmListTable.data = alarmInfos || [];
                        $scope.alarmListTable.totalRecords = data.total;
                        $("#" + $scope.alarmListTable.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });

                        //清空所有的告警选择项
                        $scope.checkboxData = [];
                    });

                    tblHeadCheckbox.option("checked", false);
                    $('#alarm-list-table th:eq(0)').html(tblHeadCheckbox.getDom());
                });
                deferred.fail(function (response) {
                    exceptionServiceIns.doException(response);
                });
            };

            //清除告警
            $scope.clearAlarm = function (param, type) {
                message.warnMsgBox({
                    "content": type === "batch" ? i18n.alarm_general_clearBatch_info_confirm_msg : i18n.alarm_general_clear_info_confirm_msg,
                    "callback": function () {
                        var params = {
                            "user": user,
                            "alarmMessage": param,
                            "cloudInfraId": cloudInfraId
                        };
                        var promise = performanceServiceIns.clearAlarm(params);
                        promise.then(function (response) {
                            $scope.getData(true);
                        });
                    }
                });
            };

            //查询当前租户可见的地域列表
            $scope.getLocations = function () {
                var retDefer = $q.defer();
                var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        cloudInfraId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                        $scope.address.values = data.cloudInfras;
                        retDefer.resolve();
                    }
                }, function (rejectedValue) {
                    retDefer.reject();
                });
                return retDefer.promise;
            };

            $scope.$on("$viewContentLoaded", function () {
                //获取初始化信息
                var promise = $scope.getLocations();
                promise.then(function () {
                    //获取告警列表
                    $scope.getData(false);
                    intervalGet();
                });
            });
            function intervalGet() {
                //每隔十秒钟刷新一次
                $scope.promiseTime = $interval(function () {
                    //获取告警列表
                    if (0 == $(".alarm-detail").length) {
                        $scope.getData(false);
                    }
                }, 10000);
            };

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

            function getQueryCondition() {
                var inquiryCond = {};
                if (severity && severity !== "0") {
                    inquiryCond.severity = severity;
                }
                if (alarmType && alarmType !== "0") {
                    inquiryCond.alarmtype = alarmType;
                }
                if (startTime && startTime !== "") {
                    inquiryCond.startTime = startTime;
                }
                if (endTime && endTime !== "") {
                    inquiryCond.endTime = endTime;
                }
                if (name && name !== "") {
                    inquiryCond.name = name;
                }
                if (resourceId && resourceId !== "") {
                    inquiryCond.resourceid = resourceId;
                }
                if (moc && moc !== "") {
                    inquiryCond.moc = moc;
                }
                return inquiryCond;
            }
        }
    ];
    return alarmListCtrl;
});
