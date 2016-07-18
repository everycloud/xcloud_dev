/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-widgets/Select",
    "tiny-common/UnifyValid",
    "app/services/exceptionService",
    "app/business/resources/services/cluster/clusterService",
    "fixtures/hypervisorFixture"],
    function ($, angular, Layout, Window, Message, Select, UnifyValid, Exception, clusterService) {
        "use strict";

        var setScheduleCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#setScheduleWindow").widget();
            var clusterId = window.option("clusterId");
            $scope.levelAble = true;
            var enableVmDrs = false;
            var RULE_TYPE = {
                1: $scope.i18n.virtual_cluster_schedul_para_rule_option_gather_value || '聚集虚拟机',
                2: $scope.i18n.virtual_cluster_schedul_para_rule_option_mutex_value || '互斥虚拟机',
                3: $scope.i18n.virtual_cluster_schedul_para_rule_option_VMtoHost_value || '虚拟机到主机'
            };
            //url
            $scope.tabUrl = {
                "tab1": "../src/app/business/resources/views/hypervisor/cluster/setScheduleBasic.html",
                "tab2": "../src/app/business/resources/views/hypervisor/cluster/setScheduleGroup.html",
                "tab3": "../src/app/business/resources/views/hypervisor/cluster/setScheduleRule.html",
                "tab4": "../src/app/business/resources/views/hypervisor/cluster/setScheduleVm.html"
            };
            //内容显示控制
            $scope.curTab = "basic";
            $scope.showTab = function (tab) {
                $scope.curTab = tab;
                if ($scope.curTab == 'resource') {
                    getResourceGroup();
                } else if ($scope.curTab == 'rule') {
                    getRules();
                } else if ($scope.curTab == 'vm') {
                    getManageVMs();
                }
            };
            //手风琴
            var lay = new Layout({
                "id": "setScheduleDiv",
                "subheight": 140
            });
            //是否开启计算资源调度，控制页签显示
            $scope.drsSwitch = false;
            //确定按钮
            $scope.okButton = {
                "id": "setScheduleOkButton",
                "text": $scope.i18n.common_term_ok_button || "确定",
                "click": function () {
                    if ($scope.curTab == "basic" || $scope.curTab == "vm") {
                        var drsLimens = [];
                        var selectedColors = ["select_conservative", "select_medium", "select_radical"];
                        for (var cell = 0; cell < 24; cell++) {
                            var drsLimen = {
                            };
                            for (var row = 0; row < 3; row++) {
                                if ($($(".table_cell")[cell + row * 24]).hasClass(selectedColors[row])) {
                                    drsLimen.limen = row * 4 + 1;
                                    drsLimen.fragmentTime = cell;
                                    drsLimens.push(drsLimen);
                                }
                            }
                            if (!drsLimen.limen) {
                                drsLimen.limen = 0;
                                drsLimen.fragmentTime = cell;
                                drsLimens.push(drsLimen);
                            }
                        }
                        var cycleType = $("#" + $scope.limenRadio.id).widget().opChecked("checked");
                        var cycleSpec = [];
                        if (cycleType == "2") {
                            var index = 1;
                            while ($("#weekCheckbox" + index).widget()) {
                                if ($("#weekCheckbox" + index).widget().option("checked")) {
                                    cycleSpec.push(index)
                                }
                                index++;
                            }
                        }
                        if (cycleType == "3") {
                            var index = 1;
                            while ($("#monthCheckbox" + index).widget()) {
                                if ($("#monthCheckbox" + index).widget().option("checked")) {
                                    cycleSpec.push(index);
                                }
                                index++;
                            }
                        }
                        setSchedule(drsLimens, cycleSpec);
                        saveVMConfig();
                    } else {
                        window.destroy();
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "setScheduleCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };

            //基本信息页面
            //开启计算资源调度复选框
            $scope.openCheckbox = {
                id: "openScheduleCheckbox",
                "label": "",
                text: $scope.i18n.common_term_turnOnComputeSchedul_button || "开启计算资源调度",
                "checked": false,
                "change": function () {
                    $scope.drsSwitch = $("#" + $scope.openCheckbox.id).widget().option("checked");
                    $("#" + $scope.automateRadio.id).widget().opDisabled("1", !$scope.drsSwitch);
                    $("#" + $scope.automateRadio.id).widget().opDisabled("3", !$scope.drsSwitch);
                    $("#" + $scope.factorRadio.id).widget().opDisabled("1", !$scope.drsSwitch);
                    $("#" + $scope.factorRadio.id).widget().opDisabled("2", !$scope.drsSwitch);
                    $("#" + $scope.factorRadio.id).widget().opDisabled("3", !$scope.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("1", !$scope.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("2", !$scope.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("3", !$scope.drsSwitch);
                }
            };
            //自动化级别单选组
            $scope.automateRadio = {
                "id": "automateRadio",
                "label": $scope.i18n.common_term_autoLevel_label + ":" || "自动化级别:",
                "values": [
                    {
                        "key": "1",
                        "text": $scope.i18n.common_term_manual_label || "手动",
                        "checked": true,
                        "disable": true
                    },
                    {
                        "key": "3",
                        "text": $scope.i18n.common_term_auto_label || "自动",
                        "checked": false,
                        "disable": true
                    }
                ],
                "layout": "vertical",
                "spacing": {
                    "height": $scope.i18n.locale === "zh"?"45px":"45px"
                },
                "change": function () {
                }
            };
            //衡量因素单选组
            $scope.factorRadio = {
                "id": "factorRadio",
                "label": $scope.i18n.common_term_weighFactor_label + ":" || "衡量因素:",
                "values": [
                    {
                        "key": "1",
                        "text": "CPU",
                        "disable": true,
                        "checked": true
                    },
                    {
                        "key": "2",
                        "text": $scope.i18n.common_term_memory_label || "内存",
                        "disable": true
                    },
                    {
                        "key": "3",
                        "text": $scope.i18n.common_term_CPUandMemory_label || "CPU和内存",
                        "disable": true
                    }
                ],
                "layout": "horizon",
                "change": function () {

                }
            };
            $scope.limenCycle = "1";
            //阀值周期单选组
            $scope.limenRadio = {
                "id": "LimenCycleRadio",
                "label": $scope.i18n.virtual_cluster_schedul_para_cycle_label + ":" || "阀值周期设置:",
                "values": [
                    {
                        "key": "1",
                        "text": $scope.i18n.virtual_cluster_schedul_para_cycle_option_always_label || "一直开启",
                        "checked": true
                    },
                    {
                        "key": "2",
                        "text": $scope.i18n.app_term_byWeek_label || "按周"
                    },
                    {
                        "key": "3",
                        "text": $scope.i18n.app_term_byMonth_label || "按月"
                    }
                ],
                "layout": "vertical",
                "change": function () {
                    $scope.limenCycle = $("#" + $scope.limenRadio.id).widget().opChecked("checked");
                }
            };
            $scope.weekCheckboxs = [
                {
                    id: "weekCheckbox1",
                    text: $scope.i18n.common_term_Sunday_label || "星期日"
                },
                {
                    id: "weekCheckbox2",
                    text: $scope.i18n.common_term_Monday_label || "星期一"
                },
                {
                    id: "weekCheckbox3",
                    text: $scope.i18n.common_term_Tuesday_label || "星期二"
                },
                {
                    id: "weekCheckbox4",
                    text: $scope.i18n.common_term_Wednesday_label || "星期三"
                },
                {
                    id: "weekCheckbox5",
                    text: $scope.i18n.common_term_Thursday_label || "星期四"
                },
                {
                    id: "weekCheckbox6",
                    text: $scope.i18n.common_term_Friday_label || "星期五"
                },
                {
                    id: "weekCheckbox7",
                    text: $scope.i18n.common_term_Saturday_label || "星期六"
                }
            ];
            function getMonthCheckboxs() {
                var monthCheckboxs = [];
                for (var date = 1; date <= 31; date++) {
                    monthCheckboxs.push({
                        id: "monthCheckbox" + date,
                        text: date + ($scope.i18n.common_term_dateDay_label || "日")
                    });
                }
                return monthCheckboxs;
            }

            $scope.monthCheckboxs = getMonthCheckboxs();

            function getSchedule() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs", o: {id: clusterId}},
                    "params": null,
                    "userId": user.id,
                    "monitor":false
                });
                deferred.success(function (data) {
                    var drsParams = data.drsParams || {};
                    enableVmDrs = drsParams.enableVmDrs;
                    $("#" + $scope.autoCheckbox.id).widget().option("checked", drsParams.enableVmDrs);
                    $scope.levelAble = drsParams.enableVmDrs;
                    $("#" + $scope.openCheckbox.id).widget().option("checked", drsParams.drsSwitch);

                    $("#" + $scope.automateRadio.id).widget().opChecked("" + drsParams.drsLevel, true);
                    $("#" + $scope.automateRadio.id).widget().opDisabled("1", !drsParams.drsSwitch);
                    $("#" + $scope.automateRadio.id).widget().opDisabled("3", !drsParams.drsSwitch);

                    $("#" + $scope.factorRadio.id).widget().opChecked("" + drsParams.factor, true);
                    $("#" + $scope.factorRadio.id).widget().opDisabled("1", !drsParams.drsSwitch);
                    $("#" + $scope.factorRadio.id).widget().opDisabled("2", !drsParams.drsSwitch);
                    $("#" + $scope.factorRadio.id).widget().opDisabled("3", !drsParams.drsSwitch);

                    if (!drsParams.drsCycle) {
                        drsParams.drsCycle={};
                    }
                    if (!drsParams.drsCycle.cycleType) {
                        drsParams.drsCycle.cycleType = 1;
                    }
                    $("#" + $scope.limenRadio.id).widget().opChecked("" + drsParams.drsCycle.cycleType, true);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("1", !drsParams.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("2", !drsParams.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("3", !drsParams.drsSwitch);

                    var drsFragmentLimen = drsParams.drsFragmentLimen || [];
                    //异常保护，长度不够24，补齐
                    var limenLengh = drsFragmentLimen.length;                    
                    for(var i=0;i<24;i++){
                        if(i >= limenLengh){
                            drsFragmentLimen.push("0");
                        }
                    }
                    setLimenTable(drsFragmentLimen);

                    $scope.$apply(function () {
                        $scope.drsSwitch = drsParams.drsSwitch;
                        $scope.limenCycle = "" + drsParams.drsCycle.cycleType;
                    });
                    var cycleSpec = drsParams.drsCycle.cycleSpec || [];
                    if ($scope.limenCycle == 2) {
                        for (var i = 0; i < cycleSpec.length; i++) {
                            $("#weekCheckbox" + cycleSpec[i]).widget().option("checked", true);
                        }
                    }
                    else if ($scope.limenCycle == 3) {
                        for (var i = 0; i < cycleSpec.length; i++) {
                            $("#monthCheckbox" + cycleSpec[i]).widget().option("checked", true);
                        }
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            getSchedule();
            function setSchedule(drsLimens, cycleSpec) {
                var params = {
                    drsSwitch: $("#" + $scope.openCheckbox.id).widget().option("checked"),
                    drsLevel: $("#" + $scope.automateRadio.id).widget().opChecked("checked"),
                    factor: $("#" + $scope.factorRadio.id).widget().opChecked("checked"),
                    drsFragmentLimen: drsLimens,
                    drsCycle: {
                        cycleType: $("#" + $scope.limenRadio.id).widget().opChecked("checked"),
                        cycleSpec: cycleSpec
                    }
                };
                var deferred = camel.put({
                    "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs", o: {id: clusterId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function setLimenTable(limenList) {
                var rowNum = 3;
                var columnNum = 24;
                var cellNum = 72;
                var downCell = -1;
                var upCell;
                var selectedColors = ["select_conservative", "select_medium", "select_radical"];

                //表顶数字
                var numDom = "<div class='table_top_blank'></div>";
                for (var i = 0; i < columnNum; i++) {
                    numDom += "<div class='table_top_num'>" + i + "</div>";
                }
                numDom += "<div class='table_top_num'>" + 0 + "</div>";
                $(".table_top").append(numDom);

                //表
                var thresholdDom = "";
                var table_heads = [
                    $scope.i18n.common_term_conservative_label,
                    $scope.i18n.common_term_medium_label,
                    $scope.i18n.common_term_radical_label
                ];
                for (var row = 0; row < rowNum; row++) {
                    thresholdDom += "<div class='table_row'>";
                    thresholdDom += "<div class='table_head'><span>" + table_heads[row] + "</span></div>";
                    for (var cell = 0; cell < columnNum; cell++) {
                        if (row == 0 && limenList[cell].limen == 1) {
                            thresholdDom += "<div class='table_cell select_conservative'/>";
                        }
                        else if (row == 1 && limenList[cell].limen == 5) {
                            thresholdDom += "<div class='table_cell select_medium'/>";
                        }
                        else if (row == 2 && limenList[cell].limen == 9) {
                            thresholdDom += "<div class='table_cell select_radical'/>";
                        }
                        else {
                            thresholdDom += "<div class='table_cell'/>";
                        }
                    }
                    thresholdDom += "<div class='table_head'><span>" + table_heads[row] + "</span></div>";
                    thresholdDom += "</div>";
                }
                $("#thresholdTable").append(thresholdDom);

                //对每个cell绑定事件
                for (var i = 0; i < cellNum; i++) {
                    //记录按下鼠标时，所在的cell
                    $($(".table_cell")[i]).bind("mousedown", function () {
                        if (!$scope.drsSwitch) {
                            return;
                        }
                        downCell = $(".table_cell").index($(this));
                    });
                    $($(".table_cell")[i]).bind("mouseup", function () {
                        if (!$scope.drsSwitch) {
                            return;
                        }
                        upCell = $(".table_cell").index($(this));
                        var downRow = Math.floor(downCell / columnNum);
                        var upRow = Math.floor(upCell / columnNum);
                        //按下鼠标和释放鼠标不在同一行，不做处理
                        if (downRow != upRow) {
                            downRow = -1;
                            return;
                        }
                        //按下鼠标和释放鼠标在同一个格子
                        if (downCell == upCell) {
                            for (var i = upCell % columnNum; i < cellNum; i += columnNum) {
                                var tempRow = Math.floor(i / columnNum);
                                if (i === upCell) {
                                    $(this).toggleClass(selectedColors[tempRow]);
                                }
                                else {
                                    $($(".table_cell")[i]).removeClass(selectedColors[tempRow]);
                                }
                            }
                            downRow = -1;
                            return;
                        }
                        //按下鼠标和释放鼠标在同一行的不同格子
                        for (var i = downCell; i <= upCell; i++) {
                            //从index所在列的第一个格子开始，遍历index所在的列
                            for (var j = i % columnNum; j < cellNum; j += columnNum) {
                                var tempRow = Math.floor(j / columnNum);
                                if (j === i) {
                                    $($(".table_cell")[j]).addClass(selectedColors[tempRow]);
                                }
                                else {
                                    $($(".table_cell")[j]).removeClass(selectedColors[tempRow]);
                                }
                            }
                        }
                        downRow = -1;
                    });
                }
                $(".table_head span").addTitle();
            }

            //资源组管理页面
            //添加虚拟机组按钮
            $scope.addVgButton = {
                "id": "addVgButton",
                "text": $scope.i18n.common_term_add_button || "添加",
                "click": function () {
                    var newWindow = new Window({
                        "winId": "addVgWindow",
                        "title": $scope.i18n.virtual_term_addVMgroup_button || "添加虚拟机组",
                        "content-type": "url",
                        "buttons": null,
                        "clusterId": clusterId,
                        "content": "app/business/resources/views/hypervisor/cluster/setScheduleAddVg.html",
                        "height": 620,
                        "width": 700,
                        "close": function () {
                            getResourceGroup();
                        }
                    });
                    newWindow.show();
                }
            };
            //虚拟机组列表
            var vgPage = null;
            $scope.vgTable = {
                "id": "cluster_table",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": false,
                "lengthMenu": [10, 20, 50],
                "columnSorting": [],
                "curPage": {
                },
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    vgPage = evtObj;
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    //详情链接
                    var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                    var scope = $scope.$new(false);
                    scope.name = aData.name;
                    scope.detail = function () {
                        var newWindow = new Window({
                            "winId": "vgInfoWindow",
                            "title": $scope.i18n.vm_term_VMgroup_label || "虚拟机组",
                            "name": aData.name,
                            "clusterId": clusterId,
                            "resourceGroupId": aData.urn,
                            "content-type": "url",
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/cluster/setScheduleVgInfo.html",
                            "height": 400,
                            "width": 650
                        });
                        newWindow.show();
                    };
                    var node = link(scope);
                    $("td:eq(0)", nRow).html(node);

                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_modify_button +
                        "</a><a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.delete = function () {
                        var options = {
                            type: "confirm",
                            content: $scope.i18n.common_term_delConfirm_msg || "确定要删除？",
                            height: "150px",
                            width: "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    majorBtn: true,
                                    handler: function (event) {
                                        clusterService.deleteResourceGroup(clusterId, aData.urn, aData.name,
                                            function (data) {
                                                msg.destroy();
                                                getResourceGroup();
                                            }, function (data) {
                                                msg.destroy();
                                                exceptionService.doException(data);
                                            });
                                    }
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    default: false,
                                    handler: function (event) {
                                        msg.destroy();
                                    }
                                }
                            ]
                        }
                        var msg = new Message(options);
                        msg.show();
                    };
                    optScope.edit = function () {
                        var newWindow = new Window({
                            "winId": "addVgWindow",
                            "title": $scope.i18n.virtual_term_modifyVMgroup_button || "修改虚拟机组",
                            "clusterId": clusterId,
                            "resourceGroupId": aData.urn,
                            "content-type": "url",
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/cluster/setScheduleAddVg.html",
                            "height": 620,
                            "width": 700,
                            "close": function () {
                                getResourceGroup();
                            }
                        });
                        newWindow.show();
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(1)", nRow).html(optNode);
                }
            };
            function getResourceGroup() {
                //VM
                clusterService.getResourceGroup(clusterId, {type: 0},
                    function (data) {
                        if (data && data.groups) {
                            $scope.$apply(function () {
                                $scope.vgTable.data = data.groups;
                            });
                        }
                    }, function (data) {
                    });
                //host
                clusterService.getResourceGroup(clusterId, {type: 1},
                    function (data) {
                        if (data && data.groups) {
                            $scope.$apply(function () {
                                $scope.hgTable.data = data.groups;
                            });
                        }
                    }, function (data) {
                    });
            }

            //添加主机组按钮
            $scope.addHgButton = {
                "id": "addHgButton",
                "text": $scope.i18n.common_term_add_button || "添加",
                "click": function () {
                    var newWindow = new Window({
                        "winId": "addHgWindow",
                        "title": $scope.i18n.virtual_term_addHostGroup_button || "添加主机组",
                        "content-type": "url",
                        "buttons": null,
                        "clusterId": clusterId,
                        "content": "app/business/resources/views/hypervisor/cluster/setScheduleAddHg.html",
                        "height": 620,
                        "width": 700,
                        "close": function () {
                            getResourceGroup();
                        }
                    });
                    newWindow.show();
                }
            };
            //主机组列表
            var hgPage = null;
            $scope.hgTable = {
                "id": "cluster_table",
                "data": [],
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": false,
                "lengthMenu": [10, 20, 50],
                "columnSorting": [],
                "curPage": {
                },
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    hgPage = evtObj;
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    //详情链接
                    var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                    var scope = $scope.$new(false);
                    scope.name = aData.name;
                    scope.detail = function () {
                        var newWindow = new Window({
                            "winId": "hgInfoWindow",
                            "title": $scope.i18n.common_term_hostGroup_label || "主机组",
                            "name": aData.name,
                            "clusterId": clusterId,
                            "resourceGroupId": aData.urn,
                            "content-type": "url",
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/cluster/setScheduleHgInfo.html",
                            "height": 400,
                            "width": 650
                        });
                        newWindow.show();
                    };
                    var node = link(scope);
                    $("td:eq(0)", nRow).html(node);

                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_modify_button
                        + "</a><a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();

                    optScope.edit = function () {
                        var newWindow = new Window({
                            "winId": "addHgWindow",
                            "title": $scope.i18n.virtual_term_modifyHostGroup_button || "修改主机组",
                            "clusterId": clusterId,
                            "resourceGroupId": aData.urn,
                            "content-type": "url",
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/cluster/setScheduleAddHg.html",
                            "height": 620,
                            "width": 700,
							"close": function () {
								getResourceGroup();
							}
                        });
                        newWindow.show();
                    }
                    optScope.delete = function () {
                        var options = {
                            type: "confirm",
                            content: $scope.i18n.common_term_delConfirm_msg || "确定要删除？",
                            height: "150px",
                            width: "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    majorBtn: true,
                                    handler: function (event) {
                                        clusterService.deleteResourceGroup(clusterId, aData.urn, aData.name,
                                            function (data) {
                                                msg.destroy();
                                                getResourceGroup();
                                            }, function (data) {
                                                msg.destroy();
                                                exceptionService.doException(data);
                                            });
                                    }
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    default: false,
                                    handler: function (event) {
                                        msg.destroy();
                                    }
                                }
                            ]
                        };
                        var msg = new Message(options);
                        msg.show();
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(1)", nRow).html(optNode);
                }
            };

            //规则管理页面
            //添加规则按钮
            $scope.addRuleButton = {
                "id": "addRuleButton",
                "text": $scope.i18n.common_term_add_button || "添加",
                "click": function () {
                    var newWindow = new Window({
                        "winId": "addRuleWindow",
                        "title": $scope.i18n.security_term_addRule_button || "添加规则",
                        "content-type": "url",
                        "clusterId": clusterId,
                        "drsBaseInfo": getDRSbaseInfo(),
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/cluster/setScheduleAddRule.html",
                        "height": 620,
                        "width": 700,
                        "close": function () {
                            getRules();
                        }
                    });
                    newWindow.show();
                }
            };
            //规则列表
            var rulePage = null;
            $scope.ruleTable = {
                "id": "scheduleRuleTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": false,
                "showDetails": true,
                "lengthMenu": [10, 20, 50],
                "curPage": {
                },
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.detail);
                        },
                        "bSearchable": false,
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ruleName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ruleType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.operator);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    rulePage = evtObj;
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $(nRow).attr("ruleIndex", aData.ruleIndex);
                    $(nRow).attr("lineNum", iDataIndex);
                    $(nRow).attr("clusterId", clusterId);
                    $(nRow).attr("ruleType", aData.ruleType);

                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);

                    $("td:eq(2)", nRow).html(RULE_TYPE[aData.ruleType]);
                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_modify_button
                        + "</a><a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.delete = function () {
                        var options = {
                            type: "confirm",
                            content: $scope.i18n.common_term_delConfirm_msg || "确定要删除？",
                            height: "150px",
                            width: "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    majorBtn: true,
                                    handler: function (event) {
                                        clusterService.deleteRule(clusterId, aData.ruleIndex, aData.ruleName,
                                            function (data) {
                                                msg.destroy();
                                                getRules();
                                            }, function (data) {
                                                msg.destroy();
                                                exceptionService.doException(data);
                                            });
                                    }
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    default: false,
                                    handler: function (event) {
                                        msg.destroy();
                                    }
                                }
                            ]
                        };
                        var msg = new Message(options);
                        msg.show();
                    };
                    optScope.edit = function () {
                        var newWindow = new Window({
                            "winId": "addRuleWindow",
                            "title": $scope.i18n.common_term_modifyRule_button || "修改规则",
                            "content-type": "url",
                            "buttons": null,
                            "clusterId": clusterId,
                            "drsBaseInfo": getDRSbaseInfo(),
                            "ruleIndex": aData.ruleIndex,
                            "ruleType": aData.ruleType,
                            "content": "app/business/resources/views/hypervisor/cluster/setScheduleAddRule.html",
                            "height": 620,
                            "width": 700,
                            "close": function () {
                                getRules();
                            }
                        });
                        newWindow.show();
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(3)", nRow).html(optNode);
                }
            };

            function getRules(pageInfo) {
                clusterService.getClusterDRS(clusterId,
                    function (data) {
                        $scope.$apply(function () {
                            if (data && data.drsParams && data.drsParams.drsRules) {
                                for (var i = 0; i < data.drsParams.drsRules.length; i++) {
                                    data.drsParams.drsRules[i].detail = {
                                        contentType: "url",
                                        content: "app/business/resources/views/hypervisor/cluster/setScheduleRuleInfo.html"
                                    };
                                }
                                $scope.ruleTable.data = data.drsParams.drsRules;
                            }
                        });
                    }, function (data) {
                    });
            }

            //虚拟机管理页面
            //启用个别虚拟机自动化级别复选框
            $scope.autoCheckbox = {
                id: "autoCheckbox",
                "label": "",
                text: $scope.i18n.virtual_term_enableVMautoLevel_button || "启用个别虚拟机自动化级别",
                "checked": false,
                "change": function () {
                    var result = $("#" + $scope.autoCheckbox.id).widget().option("checked");
                    if (result) {
                        var data = $("#setScheduleVmTable").widget().option("data");
                        var index = 0;
                        while ($("#autoSelect_" + index).widget()) {
                            $("#autoSelect_" + index).widget().option("disable", false);
                            index++;
                        }
                        $scope.levelAble = true;
                    } else {
                        var data = $("#setScheduleVmTable").widget().option("data");
                        var index = 0;
                        while ($("#autoSelect_" + index).widget()) {
                            $("#autoSelect_" + index).widget().option("disable", true);
                            index++;
                        }
                        $scope.levelAble = false;
                    }
                }
            };

            $scope.VMSearchModel = {
                "vmName": '',
                "vmId": '',
                "curpage": 1,
                "offset": 0,
                "limit": 10
            };
            $scope.vmManageSerchName = {
                "label": $scope.i18n.common_term_name_label + "：",
                "id": "vmManageSerchNameId",
                "type": "input",
                "value": ""
            };
            $scope.vmManageSerchId = {
                "label": "ID：",
                "id": "vmManageSerchIdId",
                "type": "input",
                "value": ""
            };
            $scope.vmManageSerchLevel = {
                "label": $scope.i18n.common_term_autoLevel_label + ":" || "自动化级别：",
                "id": "vmManageSerchLevelId",
                "values": [
                    {
                        "selectId": "-1",
                        "label": $scope.i18n.common_term_all_label || "全部",
                        "checked": true
                    },
                    {
                        "selectId": "0",
                        "label": $scope.i18n.virtual_cluster_schedul_para_defaultAuto_label || "默认(自动)"
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_manual_label || "手动"
                    },
                    {
                        "selectId": "3",
                        "label": $scope.i18n.common_term_auto_label || "自动"
                    },
                    {
                        "selectId": "4",
                        "label": $scope.i18n.common_term_disable_button || "禁用"
                    }
                ]
            };
            $scope.resetBtn = {
                "id": "resetBtn",
                "text": $scope.i18n.common_term_reset_button || "重置",
                "click": function () {
                    $("#" + $scope.vmManageSerchName.id).widget().option("value", ""),
                        $("#" + $scope.vmManageSerchId.id).widget().option("value", ""),
                        $("#" + $scope.vmManageSerchLevel.id).widget().opChecked("-1");
                }
            };
            $scope.okBtn = {
                "id": "okBtn",
                "text": $scope.i18n.common_term_query_button || "查询",
                "click": function () {
                    var searchInfo = {
                        name: $("#" + $scope.vmManageSerchName.id).widget().getValue(),
                        id: $("#" + $scope.vmManageSerchId.id).widget().getValue()
                    }
                    if ($scope.levelAble) {
                        var be = $("#" + $scope.vmManageSerchLevel.id).widget().getSelectedId();
                        if (be != "-1") {
                            searchInfo.behavior = be;
                        }
                    }
                    getManageVMs(searchInfo);
                }
            };
            //虚拟机列表
            $scope.vmTable = {
                "id": "setScheduleVmTable",
                "data": [],
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 30],
                "curPage": {
                },
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "35%"
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_hyperID_label || "虚拟化标识",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmId);
                        },
                        "bSortable": false,
                        "sWidth": "45%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_autoLevel_label || "自动化级别",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.behavior);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    }
                ],
                "callback": function (pageInfo) {
                    $scope.VMSearchModel.curpage = pageInfo.currentPage;
                    $scope.VMSearchModel.offset = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getManageVMs();
                },
                "changeSelect": function (pageInfo) {
                    $scope.VMSearchModel.offset = 0;
                    $scope.VMSearchModel.curpage = 1;
                    $scope.VMSearchModel.limit = pageInfo.displayLength;
                    getManageVMs();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(1)', nRow).addTitle();
                    //自动化级别下拉框 0代表默认，1代表手动，3代表自动， 4代表禁用
                    var options = {
                        "id": "autoSelect_" + iDataIndex,
                        "values": [
                            {
                                "selectId": "0",
                                "label": $scope.i18n.virtual_cluster_schedul_para_defaultAuto_label || "默认(自动)"
                            },
                            {
                                "selectId": "1",
                                "label": $scope.i18n.common_term_manual_label || "手动"
                            },
                            {
                                "selectId": "3",
                                "label": $scope.i18n.common_term_auto_label || "自动"
                            },
                            {
                                "selectId": "4",
                                "label": $scope.i18n.common_term_disable_button || "禁用"
                            }
                        ],
                        "width": "100px",
                        "disable": !$("#" + $scope.autoCheckbox.id).widget().option("checked"),
                        "change": function () {
                        }
                    };
                    if (enableVmDrs) {
                        options.disable = false;
                        for (var i = 0; i < options.values.length; i++) {
                            if (options.values[i].selectId == aData.behavior) {
                                options.values[i].checked = true;
                            }
                        }
                    } else {
                        options.values[0].checked = true;
                    }
                    var select = new Select(options);
                    $('td:eq(2)', nRow).html(select.getDom());
                }
            };
            function getManageVMs(searchInfo) {
                var pageInfo = {
                    offset: $scope.VMSearchModel.offset,
                    limit: $scope.VMSearchModel.limit,
                    enableVmDrs: (enableVmDrs) ? 1 : 0
                };
                if (searchInfo) {
                    pageInfo.id = searchInfo.id,
                        pageInfo.name = searchInfo.name,
                        pageInfo.behavior = searchInfo.behavior
                }
                clusterService.getManageVms(clusterId, pageInfo,
                    function (data) {
                        var total = (data) ? data.total : 0;
                        $scope.$apply(function () {
                            if (data) {
                                $scope.vmTable.data = data.drsVmConfigList
                                $scope.vmTable.totalRecords = total;
                            }
                            if ($("#" + $scope.vmTable.id).widget()) {
                                $("#" + $scope.vmTable.id).widget().option("total-records", total);
                                $("#" + $scope.vmTable.id).widget().option("cur-page", {"pageIndex": $scope.VMSearchModel.curpage});
                                $("#" + $scope.vmTable.id).widget().option("display-length", $scope.VMSearchModel.limit);
                            }
                        });
                    }, function (data) {
                        exceptionService.doException(data);
                    });
            }

            //保存VM管理的配置
            function saveVMConfig() {
                var drsVmConfigs = [];
                var data = $("#setScheduleVmTable").widget().option("data");
                var index = 0;
                while ($("#autoSelect_" + index).widget()) {
                    drsVmConfigs.push({vmUrn: data[index].vmUrn, behavior: $("#autoSelect_" + index).widget().getSelectedId()});
                    index++;
                }
                var params = {
                    isEnableDrs: true,
                    enableVmDrs: $("#" + $scope.autoCheckbox.id).widget().option("checked"),
                    drsVmConfigs: drsVmConfigs
                };
                clusterService.saveVmDRSConfig(clusterId, params,
                    function (data) {
                        getManageVMs();
                    }, function (data) {
                        exceptionService.doException(data);
                    });
            }

            function getDRSbaseInfo() {
                var drsLimens = [];
                var selectedColors = ["select_conservative", "select_medium", "select_radical"];
                for (var cell = 0; cell < 24; cell++) {
                    var drsLimen = {
                    };
                    for (var row = 0; row < 3; row++) {
                        if ($($(".table_cell")[cell + row * 24]).hasClass(selectedColors[row])) {
                            drsLimen.limen = row * 4 + 1;
                            drsLimen.fragmentTime = cell;
                            drsLimens.push(drsLimen);
                        }
                    }
                    if (!drsLimen.limen) {
                        drsLimen.limen = 0;
                        drsLimen.fragmentTime = cell;
                        drsLimens.push(drsLimen);
                    }
                }
                return {
                    drsLevel: $("#" + $scope.automateRadio.id).widget().opChecked("checked"),
                    factor: $("#" + $scope.factorRadio.id).widget().opChecked("checked"),
                    drsFragmentLimen: drsLimens
                };
            }
        }];

        var setScheduleApp = angular.module("setScheduleApp", ['framework']);
        setScheduleApp.controller("resources.clusterInfo.setSchedule.ctrl", setScheduleCtrl);
        return setScheduleApp;
    }
);
