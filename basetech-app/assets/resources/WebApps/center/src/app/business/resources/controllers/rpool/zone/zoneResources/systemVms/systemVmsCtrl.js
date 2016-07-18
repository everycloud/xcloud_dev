/**
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Progressbar",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, Checkbox, Progressbar, Window, Message, ExceptionService) {
    "use strict";

    var systemVmsCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel", function ($scope, $state, $stateParams, $compile, camel) {
        var user = $("html").scope().user;
        $scope.zoneInfo = {
            "zoneID": $stateParams.id,
            "zoneName": $stateParams.name
        };
        var selectedVm = [];
        var selectedVmData = [];
        var statuses = {
            running: $scope.i18n.common_term_running_value,
            stopped: $scope.i18n.common_term_stoped_value,
            hibernated: $scope.i18n.common_term_hibernated_value,
            creating: $scope.i18n.common_term_creating_value,
            create_failed: $scope.i18n.common_term_createFail_value,
            create_success: $scope.i18n.common_term_createSucceed_value,
            starting: $scope.i18n.common_term_startuping_value,
            stopping: $scope.i18n.common_term_stoping_value,
            migrating: $scope.i18n.common_term_migrating_value,
            shutting_down: $scope.i18n.common_term_deleting_value,
            fault_resuming: $scope.i18n.common_term_trouble_label,
            hibernating: $scope.i18n.common_term_hibernating_value,
            rebooting: $scope.i18n.common_term_restarting_value,
            pause: $scope.i18n.common_term_pauseUse_value,
            recycling: $scope.i18n.common_term_reclaiming_value,
            unknown: $scope.i18n.common_term_unknown_value
        }
        var actions = {
            start: $scope.i18n.common_term_startup_button + "/" + $scope.i18n.common_term_awaken_button,
            reboot: $scope.i18n.common_term_restart_button
        }

        //查询信息
        var searchInfo = {
            "zoneId": $stateParams.id,
            "detail": 2,
            "filterName": "",
            "filterVsaVm": true,
            "filterVsaVmType": "",
            "queryVmInsystem": true,
            "offset": 0,
            "limit": 10
        };
        $scope.refresh = function () {
            getData();
        }
        //启动/唤醒按钮
        $scope.startButton = {
            "id": "vmStartButton",
            "text": $scope.i18n.common_term_startup_button,
            "click": function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length == 0) {
                    var options = {
                        type: "error",
                        content: $scope.i18n.vm_term_chooseVMbeforeOpt_msg,
                        height: "150px",
                        width: "350px"
                    }
                    var msg = new Message(options);
                    msg.show();
                    return;
                }
                if (!checkAction("start")) {
                    return
                }
                var options = {
                    type: "confirm",
                    content: $scope.i18n.vm_vm_startup_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            handler: function (event) {
                                lifeCycle("start", null);
                                msg.destroy();
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
            }
        };
        //重启按钮
        $scope.restartButton = {
            "id": "vmRestartButton",
            "text": $scope.i18n.common_term_restart_button,
            "click": function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length == 0) {
                    var options = {
                        type: "error",
                        content: $scope.i18n.vm_term_chooseVMbeforeOpt_msg,
                        height: "150px",
                        width: "350px"
                    }
                    var msg = new Message(options);
                    msg.show();
                    return;
                }
                if (!checkAction("reboot")) {
                    return
                }
                var options = {
                    type: "confirm",
                    content: $scope.i18n.common_term_restartConfirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            handler: function (event) {
                                lifeCycle("reboot", null);
                                msg.destroy();
                            }
                        },
                        {
                            label: '$scope.i18n.common_term_cancle_button',
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                            }
                        }
                    ]
                }
                var msg = new Message(options);
                msg.show();
            }
        };

        $scope.typeFilter = {
            "id": "systemVmTypeFilter",
            "dftLabel": $scope.i18n.common_term_allType_label,
            "width": "150",
            "values": [
                {
                    "selectId": "all",
                    "label": $scope.i18n.common_term_allType_label,
                    "checked": true
                },
                {
                    "selectId": "DHCP",
                    "label": "DHCP"
                },
                {
                    "selectId": "VFW",
                    "label": "VFW"
                },
                {
                    "selectId": "SLB",
                    "label": "SLB"
                },
                {
                    "selectId": "PVM",
                    "label": "PVM"
                }
            ],
            "change": function () {
                var type = $("#" + $scope.typeFilter.id).widget().getSelectedId();
                if ("all" == type) {
                    searchInfo.filterVsaVmType = "";
                }
                else {
                    searchInfo.filterVsaVmType = type;
                }
                getData();
            }

        };

        $scope.searchBox = {
            "id": "systemVmSearchBox",
            "placeholder": $scope.i18n.template_term_findVMname_prom,
            "type": "round",
            "width": "250",
            "suggest-size": 10,
            "maxLength": 64,
            "suggest": function (content) {
            },
            "search": function (searchString) {
                searchInfo.filterName = searchString;
                getData();
            }
        };
        //vm列表
        $scope.vmTable = {
            "id": "systemVmTable",
            "data": [],
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "lengthMenu": [10, 20, 50],
            "displayLength": 10,
            "curPage": {"pageIndex": 1},
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": "30"
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_IP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ip);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.resource_term_VSAtype_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vsaVmType);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "VPC",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vpcName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.virtual_term_cluster_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.clusterName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "bSortable": false,
                    "sWidth": "10%"
                }
            ],
            "callback": function (evtObj) {
                searchInfo.limit = evtObj.displayLength;
                searchInfo.offset = evtObj.displayLength * (evtObj.currentPage - 1);
                getData();
            },
            "changeSelect": function (evtObj) {
                searchInfo.limit = evtObj.displayLength;
                searchInfo.offset = evtObj.displayLength * (evtObj.currentPage - 1);
                $scope.vmTable.displayLength = evtObj.displayLength;
                getData();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                //复选框
                var options = {
                    "id": "vmCheckbox_" + iDataIndex,
                    "checked": false,
                    "change": function () {
                        var isAllChecked = true;
                        var index = 0;
                        while ($("#vmCheckbox_" + index).widget()) {
                            if (!$("#vmCheckbox_" + index).widget().option("checked")) {
                                isAllChecked = false;
                                break;
                            }
                            index++;
                        }
                        $("#vmTableHeadCheckbox").widget().option("checked", isAllChecked);
                    }
                };
                var checkbox = new Checkbox(options);
                $('td:eq(0)', nRow).html(checkbox.getDom());

                //虚拟机详情链接
                var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>" + $.encoder.encodeForHTML(aData.name) + "</a>"));
                var scope = $scope.$new(false);
                scope.detail = function () {
                    $state.go("resources.vmInfo.summary", {"name": aData.name, "vmId": aData.id, "isVsa": true});
                };
                var node = link(scope);
                $("td:eq(1)", nRow).html(node);
                if ($scope.right.hasServiceVMOperateRight) {
                    var scope = $scope.$new(false);
                    var restoreTemplates = "<div><a class='pointer margin-right-beautifier' href='javascript:void(0)' ng-click='restore()'>" + $scope.i18n.common_term_restore_button + "</a>"
                    if (aData.vsaVmType != "PVM") {
                        var vncTemplates = "";
                    }
                    else if (aData.status !== "running" && aData.status !== "hibernating") {
                        var vncTemplates = "<span class='disabled'>" + $scope.i18n.vm_term_vnc_button + "</span></div>";
                    }
                    else {
                        var vncTemplates = "<a class='pointer' href='javascript:void(0)' ng-click='loadVnc()'>" + $scope.i18n.vm_term_vnc_button + "</a></div>";
                    }
                    var optTemplates = restoreTemplates + vncTemplates;
                    scope.restore = function () {
                        var msgOptions = {
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.vm_vm_restore_info_confirm_msg,
                            "width": "300",
                            "height": "200"
                        };
                        var msgBox = new Message(msgOptions);
                        var buttons = [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: 'Y',
                                majorBtn: true,
                                default: true,
                                handler: function (event) {
                                    restoreVm(aData);
                                    msgBox.destroy();
                                }
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: 'N',
                                default: false,
                                handler: function (event) {
                                    msgBox.destroy();
                                }
                            }
                        ];
                        msgBox.option("buttons", buttons);
                        msgBox.show();
                    };
                    scope.loadVnc = function () {
                        //window.open第二个参数是打开窗口句柄，传入唯一标识实现每个虚拟机只能打开一个窗口；但参数不能带:-; 字符
                        var id = aData.id;
                        var vmId = id.replace(/[^a-zA-Z0-9]/g, '0');
                        var iHeight = 600;
                        var iWidth = 800;
                        var iTop = (window.screen.height - 100 - iHeight) / 2;
                        var iLeft = (window.screen.width - 10 - iWidth) / 2;
                        var userId = $("html").scope().user && $("html").scope().user.id;
                        var deployMode = $("html").scope().deployMode;
                        var basePath = "center";
                        if (deployMode === "top") {
                            basePath = "/cloudmanager";
                        } else if (deployMode === "local") {
                            basePath = "/fusionmanager";
                        } else {
                            basePath = "/center";
                        }
                        window.open("https://" + window.location.host + basePath + "/src/app/business/vnc/vncLogin.html?vmId=" +
                            encodeURIComponent(id) + "&userId=" + encodeURIComponent(userId), 'VNC' + vmId, 'left=' + iLeft + ',top=' + iTop + ',width=' + iWidth + ',height=' +
                            iHeight + ',toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=no');
                    }
                    var optDom = $compile($(optTemplates))(scope);
                    $("td:eq(7)", nRow).html(optDom);
                }
            }
        }

        function getSelectedVm() {
            selectedVm = [];
            selectedVmData = [];
            var vmTable = $("#" + $scope.vmTable.id).widget();
            var data = vmTable.option("data");
            var index = 0;
            while ($("#vmCheckbox_" + index).widget()) {
                var checked = $("#vmCheckbox_" + index).widget().option("checked");
                if (checked) {
                    selectedVm.push(data[index].id);
                    selectedVmData.push(data[index]);
                }
                index++;
            }
        }

        function checkAction(action) {
            var warnVmId;
            for (var i = 0; i < selectedVm.length; i++) {
                if (action == "start") {
                    if (!(selectedVmData[i].status == "stopped" || selectedVmData[i].status == "hibernated")) {
                        warnVmId = selectedVmData[i].vmVisibleId;
                        break;
                    }
                }
                else if (action == "reboot") {
                    if (!(selectedVmData[i].status == "running")) {
                        warnVmId = selectedVmData[i].vmVisibleId;
                        break;
                    }
                }
            }
            if (warnVmId) {
                var options = {
                    type: "error",
                    content: $scope.i18n.vm_term_notRunOnCurrentStatus_valid + "[" + warnVmId + "]",
                    height: "150px",
                    width: "350px"
                }
                var msg = new Message(options);
                msg.show();
                return false;
            }
            return true;
        }

        function goToTaskCenter() {
            var options = {
                type: "confirm",
                content: $scope.i18n.task_view_task_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            msg.destroy();
                            $state.go("system.taskCenter");
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        default: false,
                        handler: function (event) {
                            msg.destroy();
                            getData();
                        }
                    }
                ]
            }
            var msg = new Message(options);
            msg.show();
        }

        function lifeCycle(type, mode) {
            var params = {
                "operate": {
                    "type": type,
                    "vmIds": selectedVm,
                    "vmOpMode": mode
                }
            }
            var deferred = camel.post({
                "url": "/goku/rest/v1.5/irm/1/vms/action",
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.done(function (response) {
                goToTaskCenter();
            });
            deferred.fail(function (response) {
                new ExceptionService().doException(response);
            });
        };
        function getData() {
            var deferred = camel.post({
                "url": "/goku/rest/v1.5/irm/1/vms/list",
                "params": JSON.stringify(searchInfo),
                "userId": user.id
            });
            deferred.success(function (data) {
                var vms = data.vmInfoList || [];
                for (var i = 0; i < vms.length; i++) {
                    vms[i].statusStr = statuses[vms[i].status] || vms[i].status;
                    var nics = vms[i].vmConfig && vms[i].vmConfig.nics || [];
                    for (var j = 0; j < nics.length; j++) {
                        vms[i].ip = vms[i].ip ? (vms[i].ip + ";" + nics[j].ip) : nics[j].ip;
                        var ips6 = nics[j].ips6 || [];
                        for (var k = 0; k < ips6.length; k++) {
                            vms[i].ip = vms[i].ip ? (vms[i].ip + ";" + ips6[k]) : ips6[k];
                        }
                    }
                }
                $scope.$apply(function () {
                    $scope.vmTable.data = vms;
                    $scope.vmTable.totalRecords = data.total;
                });

                var tableId = "#systemVmTable";
                //表头全选复选框
                var options = {
                    "id": "vmTableHeadCheckbox",
                    "checked": false,
                    "change": function () {
                        var isChecked = $("#" + options.id).widget().options.checked;
                        var index = 0;
                        while ($("#vmCheckbox_" + index).widget()) {
                            $("#vmCheckbox_" + index).widget().option("checked", isChecked);
                            index++;
                        }
                    }
                };
                var checkbox = new Checkbox(options);
                $(tableId + " th:eq(0)").html(checkbox.getDom());
            });
            deferred.fail(function (response) {
                new ExceptionService().doException(response);
            });
        };

        function restoreVm(aData) {
            if (aData.vsaVmType == 'PVM') {
                restorePvm(aData.vpcId)
            }
            else if (aData.vsaVmType == 'SLB') {
                restoreSlb(aData.id);
            }
            else {
                restoreVsa(aData.id);
            }
        };
        function restorePvm(vpcId) {
            var params = {
                "action": "Repair"
            }
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpc_id}/pvms/actions", o: {"tenant_id": "1", "vpc_id": vpcId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.done(function (response) {
                goToTaskCenter();
            });
            deferred.fail(function (response) {
                new ExceptionService().doException(response);
            });
        };
        function restoreSlb(vmId) {
            var params = {"repairELB": {"slbVMId": vmId}};
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/elbs/action", o: {"tenant_id": "1"}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.done(function (response) {
                goToTaskCenter();
            });
            deferred.fail(function (response) {
                new ExceptionService().doException(response);
            });
        };
        function restoreVsa(vmId) {
            var params = {"repairVsaVm": {"vmID": vmId}};
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/vms/{id}/action", o: {"tenant_id": "1", "id": vmId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.done(function (response) {
                goToTaskCenter();
            });
            deferred.fail(function (response) {
                new ExceptionService().doException(response);
            });
        };
        getData();
    }];

    return systemVmsCtrl;
})
;