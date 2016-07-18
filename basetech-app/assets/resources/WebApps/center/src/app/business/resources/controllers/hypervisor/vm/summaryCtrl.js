define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Columnchart",
    "tiny-directives/Columnchart",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "app/services/exceptionService",
    "app/business/resources/services/monitorService",
    "app/services/commonService",
    "fixtures/clusterFixture"
], function ($, angular, Window, Columnchart, _ColumnchartDirective, Message, UnifyValid, constants, Exception, monitorService, commonService) {
    "use strict";

    var summaryCtrl = ["$scope", "$stateParams", "$state", "$compile", "$q", "camel", "validator", "$rootScope",
        function ($scope, $stateParams, $state, $compile, $q, camel, validator, $rootScope) {
            var exceptionService = new Exception();
            $scope.fromState = $stateParams.from;
            $scope.vmName = $stateParams.name;
            $scope.vmId = $stateParams.vmId;
            var user = $("html").scope().user;
            $scope.vncRight = user.privilege.vm_term_vnc_button;
            $scope.isVsa = ($stateParams.isVsa === "true");
            $scope.basicRight = user.privilege.role_role_add_option_basic_value;
            $scope.basicOperable = $scope.basicRight && !$scope.isVsa;
            $scope.createAble = user.privilege.common_term_create_button && !$scope.isVsa;
            $scope.advanceOperable = user.privilege.role_role_add_option_advance_value && !$scope.isVsa;
            $scope.exportAble = false;
            $scope.alarmInfo = {"critical": 0, "major": 0, "minor": 0, "warning": 0};
            $scope.isLocal = $scope.deployMode === "local";

            $scope.help = {
                show: false
            };
            $scope.label = {
                "name": $scope.i18n.common_term_name_label + ":",
                "vmId": "ID:",
                "longId":$scope.i18n.common_term_globeID_label+":",
                "ip": $scope.i18n.common_term_IP_label + ":",
                "mac": "MAC:",
                "desc": $scope.i18n.common_term_desc_label + ":",
                "status": $scope.i18n.common_term_status_label + ":",
                "host": $scope.i18n.common_term_host_label + ":",
                "app": $scope.i18n.app_term_app_label + ":",
                "tag": $scope.i18n.cloud_term_tag_label + ":",
                "createTime": $scope.i18n.common_term_createAt_label + ":",
                "os": $scope.i18n.common_term_OS_label + ":",
                "vmType": $scope.i18n.vm_term_vmType_label + ":",
                "imc": $scope.i18n.virtual_term_IMCmode_label + ":",
                "tools": "Tools:"
            };
            var pvStatus = {
                "starting": $scope.i18n.common_term_startuping_value,
                "notRunning": $scope.i18n.common_term_noRun_value,
                "running": $scope.i18n.common_term_running_value
            };

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
                pause: $scope.i18n.common_term_pause_value,
                recycling: $scope.i18n.common_term_reclaiming_value,
                unknown: $scope.i18n.common_term_unknown_value,
                REPAIRING:$scope.i18n.common_term_stoped_value + "("+$scope.i18n.common_term_restoring_value+")"
            };
            $scope.nameItem = {
                "label": $scope.i18n.common_term_name_label + ":",
                "value": "",
                "id": "ecsVmDetailNameId",
                "modifying": false,
                "validate": "required:" + $scope.i18n.common_term_null_valid +
                    ";maxSize(64):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "64"}) +
                    ";regularCheck(" + validator.vmNameCharReg +
                    "):" + $scope.i18n.common_term_composition3_valid,
                "clickModify": function () {
                    $scope.nameItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#ecsVmDetailNameId input").focus();
                    }, 50);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#vmInfoSummaryDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.nameItem.value = $("#ecsVmDetailNameId").widget().getValue();
                    $scope.nameItem.modifying = false;
                    editBasic();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        var result = UnifyValid.FormValid($("#vmInfoSummaryDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.nameItem.value = $("#ecsVmDetailNameId").widget().getValue();
                            $scope.nameItem.modifying = false;
                            editBasic();
                        });
                    }
                }
            };
            $scope.descItem = {
                "label": $scope.i18n.common_term_desc_label + ":",
                "id": "ecsVmDetailDescId",
                "modifying": false,
                "type": "multi",
                "height": "50px",
                "validate": "maxSize(1024):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "0", "2": "1024"}),
                "clickModify": function () {
                    $scope.descItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#ecsVmDetailDescId input").focus();
                    }, 50);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#vmInfoSummaryDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.descItem.value = $("#ecsVmDetailDescId").widget().getValue();
                    $scope.descItem.modifying = false;
                    editBasic();
                },
                "keypressfn": function (event) {
                    var result = UnifyValid.FormValid($("#vmInfoSummaryDiv"));
                    if (!result) {
                        return;
                    }
                    if (event.keyCode === 13) {
                        $scope.$apply(function () {
                            $scope.descItem.value = $("#ecsVmDetailDescId").widget().getValue();
                            $scope.descItem.modifying = false;
                            editBasic();
                        });
                    }
                }
            };
            $scope.tagItem = {
                "label": $scope.i18n.cloud_term_tag_label + ":",
                "id": "ecsVmDetailTagId",
                "modifying": false,
                "validate": "maxSize(256):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "0", "2": "256"}) + ";regularCheck(" + validator.vmTagReg +
                    "):" + $scope.i18n.common_term_composition11_valid,
                "clickModify": function () {
                    $scope.tagItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#ecsVmDetailTagId input").focus();
                    }, 50);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#vmInfoSummaryDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.tagItem.value = $("#ecsVmDetailTagId").widget().getValue();
                    $scope.tagItem.modifying = false;
                    editTag();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        var result = UnifyValid.FormValid($("#vmInfoSummaryDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.tagItem.value = $("#ecsVmDetailTagId").widget().getValue();
                            $scope.tagItem.modifying = false;
                            editTag();
                        });
                    }
                }
            };

            //VNC登陆按钮
            $scope.vncButton = {
                "id": "vncButton",
                "text": $scope.i18n.vm_term_vnc_button,
                "click": function () {
                    //window.open第二个参数是打开窗口句柄，传入唯一标识实现每个虚拟机只能打开一个窗口；但参数不能带:-; 字符
                    var vmId = $scope.vmId.replace(/[^a-zA-Z0-9]/g, '0');

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
                        encodeURIComponent($scope.vmId) + "&userId=" + encodeURIComponent(userId), 'VNC' + vmId, 'left=' + iLeft + ',top=' + iTop + ',width=' + iWidth + ',height=' +
                        iHeight + ',toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=no');
                }
            };

            //启动/唤醒按钮
            $scope.startButton = {
                "id": "startVmButton",
                "text": $scope.i18n.common_term_startup_button,
                "disable": false,
                "click": function () {
                    showMessage($scope.i18n.vm_vm_startup_info_confirm_msg, function () {
                        lifeCycle("start", null);
                    });
                }
            };

            //关闭按钮
            $scope.stopButton = {
                "id": "stopVmButton",
                "text": $scope.i18n.common_term_turnOff_button,
                "click": function () {
                    showMessage($scope.i18n.vm_vm_shut_info_confirm_msg, function () {
                        lifeCycle("stop", null);
                    });
                }
            };
            //刷新按钮
            $scope.refreshButton = {
                "id": "refreshButton",
                "text": $scope.i18n.common_term_fresh_button,
                "click": function () {
                    getVm();
                    getAlarm();
                }
            };
            $scope.reboot = function () {
                if ($scope.status !== "running") {
                    return;
                }
                showMessage($scope.i18n.common_term_restartConfirm_msg, function () {
                    lifeCycle("reboot", null);
                });
            };
            $scope.forceReboot = function () {
                if ($scope.status !== "running" && $scope.status !== "rebooting") {
                    return;
                }
                showMessage($scope.i18n.vm_vm_forciblyRestart_info_confirm_msg, function () {
                    lifeCycle("reboot", "force");
                });
            };
            $scope.forceStop = function () {
                if ($scope.status !== "running" && $scope.status !== "stopping" && $scope.status !== "rebooting" &&
                    $scope.status !== "pause" && $scope.status !== "fault_resuming" && $scope.status !== "hibernated" && $scope.status !== "unknown") {
                    return;
                }
                showMessage($scope.i18n.vm_vm_forciblyShut_info_confirm_msg, function () {
                    lifeCycle("stop", "force");
                });
            };
            $scope.sleep = function () {
                if ($scope.status !== "running") {
                    return;
                }
                showMessage($scope.i18n.vm_vm_hibernate_info_confirm_msg, function () {
                    lifeCycle("hibernate", null);
                });
            };
            $scope.viewPwd = function () {
                if(!$scope.vncpassword){
                    return;
                }
                var options = {
                    type: "prompt",
                    content: validator.i18nReplace($scope.i18n.vm_term_OSinitializtionPsw_label, {"1": $scope.vncpassword}),
                    height: "150px",
                    width: "350px"
                };
                var msg = new Message(options);
                msg.show();
            };
            $scope.cloneVm = function () {
                if ($scope.status !== "stopped" && $scope.status !== "running") {
                    return;
                }
                $state.go("resources.createVm", {"action": "clone", "from": $state.current.name, "vmId": $scope.vmId, "cloneVmName": $scope.nameItem.value});
            };
            $scope.transferVm = function () {
                if ($scope.status === "REPAIRING") {
                    return;
                }
                var newWindow = new Window({
                    "winId": "transferVmWindow",
                    "title": $scope.i18n.common_term_allocate_button,
                    "selectedVm": [$scope.vmId],
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vm/transfer.html",
                    "height": 500,
                    "width": 700,
                    "close": function () {
                        getVm();
                    }
                });
                newWindow.show();
            };
            $scope.repairVm = function () {
                if ($scope.status !== "stopped" && $scope.status !== "running") {
                    return;
                }
                if (!$scope.templateId || $scope.templateId <= 0) {
                    repairWindow();
                }
                else {
                    getTemplate();
                }
            };
            $scope.incorporate = function () {
                if ($scope.status === "REPAIRING") {
                    return;
                }
                showMessage($scope.i18n.vm_vm_incorporate_info_confirm_msg, function () {
                    incorporate();
                });
            };
            function getTemplate() {
                var deferred = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/sr/1/vmtemplates/{id}",
                        o: {id: $scope.templateId}
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    showMessage($scope.i18n.vm_vm_restore_info_confirm_msg, function () {
                        repairVm();
                    });
                });
                deferred.fail(function (data) {
                    try {
                        var responseObj = JSON.parse(data.responseText);
                        if (responseObj && responseObj.code === "4823011") {
                            repairWindow();
                            return;
                        }
                    } catch (e) {
                    }
                    exceptionService.doException(data);
                });
            }

            function repairWindow() {
                var newWindow = new Window({
                    "winId": "repairVmWindow",
                    "title": $scope.i18n.vm_term_chooseTemplate_label,
                    "hypervisorId": $scope.hypervisorId,
                    "vmId": $scope.vmId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vm/repairVm.html",
                    "height": 500,
                    "width": 750
                });
                newWindow.show();
            }

            $scope.exportVm = function () {
                if ($scope.status !== "stopped" && $scope.status !== "running") {
                    return;
                }
                var newWindow = new Window({
                    "winId": "exportVmWindow",
                    "title": $scope.i18n.vm_term_exportVM_button,
                    "hypervisorId": $scope.hypervisorId,
                    "vmId": $scope.vmId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vm/exportVm.html",
                    "height": 450,
                    "width": 650
                });
                newWindow.show();
            };
            $scope.importVm = function () {
                $state.go("resources.importVm", {
                    form: $state.current.name, occupiedVmId: $scope.vmId, hypervisorId: $scope.hypervisorId,
                    clusterId: $scope.clusterUrn, vmName: $scope.vmName
                });
            };
            $scope.convertToTemplate = function () {
                if ($scope.status !== "stopped") {
                    return;
                }
                showMessage($scope.i18n.vm_vm_convertToTemplate_info_confirm_msg, function () {
                    convertToTemplate();
                });
            };
            $scope.migrate = function () {
                if ($scope.status !== "stopped" && $scope.status !== "running") {
                    return;
                }
                $state.go("resources.migrateVm", {'clusterUrn': $scope.clusterUrn, 'clusterId': $scope.clusterId, 'hypervisorId': $scope.hypervisorId});
            };

            //网卡列表
            $scope.nicTable = {
                "id": "vmSummaryNicTable",
                "data": null,
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_NIC_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_receivePacketNum_label + "(Packet)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.receive?data.receive:"0");
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_receiveBytes_label + "(KB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.rx?data.rx:"0");
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_sendPacketNum_label + "(Packet)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.send?data.send:"0");
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_sendBytes_label + "(KB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.tx?data.tx:"0");
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                }
            };
            //磁盘列表
            $scope.diskTable = {
                "id": "vmSummaryDiskTable",
                "data": null,
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_disk_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.diskName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.device_term_ioRead_label + "(KB/s)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.byte_out?data.byte_out:"0.00");
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.device_term_ioWrite_label + "(KB/s)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.byte_in?data.byte_in:"0.00");
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_diskIOreadNumS_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.rd_ticks?data.rd_ticks:"0.00");
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_diskIOwriteNumS_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.wr_ticks?data.wr_ticks:"0.00");
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                }
            };

            function showMessage(content, action) {
                var options = {
                    type: "confirm",
                    content: content,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                action();
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
                };
                var msg = new Message(options);
                msg.show();
            }

            function getVm() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var vmInfo = data && data.vmInfo;
                    $scope.$apply(function () {
                        $scope.nameItem.value = vmInfo.name;
                        $scope.name = vmInfo.name;
                        $("#vmInfoNameSpan").attr("title", $.encoder.encodeForHTML(vmInfo.name));
                        $scope.descItem.value = vmInfo.description;
                        $scope.description = vmInfo.description;
                        $("#vmInfoDescSpan").attr("title", $.encoder.encodeForHTML(vmInfo.description));
                        var vmIds = vmInfo.id.split(":");
                        $scope.vmIdStr = vmIds[vmIds.length - 1];
                        $scope.vmId = vmInfo.id;
                        $scope.vmVisibleId = vmInfo.vmVisibleId;
                        $scope.hyperType = vmInfo.vmType;
                        var nics = vmInfo.vmConfig && vmInfo.vmConfig.nics || [];
                        $scope.ip = null;
                        $scope.mac = null;
                        for (var j = 0; j < nics.length; j++) {
                            $scope.ip = $scope.ip ? $scope.ip + nics[j].ip : nics[j].ip;
                            $scope.mac = $scope.mac ? $scope.mac + "<br/>" + nics[j].mac : nics[j].mac;
                            var ips6 = nics[j].ips6 || [];
                            for (var k = 0; k < ips6.length; k++) {
                                $scope.ip = $scope.ip + "&nbsp;&nbsp&nbsp&nbsp&nbsp" + ips6[k];
                            }
                            $scope.ip = $scope.ip ? $scope.ip + "<br/>" : $scope.ip;
                        }
                        $scope.status = vmInfo.repairStatus === "REPAIRING" ? "REPAIRING":vmInfo.status;
                        $scope.statusStr = statuses[$scope.status] || $scope.status;
                        $scope.vncpassword = vmInfo.os && vmInfo.os.password;
                        //没有权限时，按钮会不不存在
                        if ($("#" + $scope.stopButton.id).widget()) {
                            $("#" + $scope.stopButton.id).widget().option("disable", $scope.status !== "running");
                        }
                        if ($("#" + $scope.vncButton.id).widget()) {
                            $("#" + $scope.vncButton.id).widget().option("disable", ($scope.status !== "running" && $scope.status !== "hibernating"));
                        }
                        if ($("#" + $scope.startButton.id).widget()) {
                            $("#" + $scope.startButton.id).widget().option("disable", ($scope.status !== "stopped" && $scope.status !== "hibernated"));
                        }
                        $scope.templateId = vmInfo.templateID;
                        $scope.hypervisorId = vmInfo.hypervisorId;
                        $scope.hostName = vmInfo.hostName;
                        $scope.tools = pvStatus[vmInfo.pvDriverStatus];
                        if (vmInfo.pvDriverStatus === "running") {
                            $scope.tools = $scope.tools + "(" + $scope.i18n.common_term_version_label + "：" + vmInfo.toolVersion + ")";
                        }
                        $scope.app = vmInfo.vappName;
                        $scope.tagItem.value = vmInfo.tag;
                        $scope.tag = vmInfo.tag;
                        $scope.createTime = vmInfo.createTime ? commonService.utc2Local(vmInfo.createTime) : "";
                        if (vmInfo.os) {
                            $scope.os = vmInfo.os.osType;
                        }
                        var zhanweiVM = false;
                        if (vmInfo.isTemplate && vmInfo.isTemplate === 'true') {
                            $scope.type = $scope.i18n.vm_term_templateVM_value;
                        } else if (vmInfo.isLinkClone === 'true') {
                            $scope.type = $scope.i18n.vm_term_linkedCloneVM_value;
                        } else if (vmInfo.category && vmInfo.category != 0) {
                            if (vmInfo.category == 1) {
                                $scope.type = $scope.i18n.vm_term_disasterVM_value;
                            } else if (vmInfo.category == 2) {
                                $scope.type = $scope.i18n.vm_term_placeholderVM_value;
                                zhanweiVM = true;
                            }
                        } else {
                            $scope.type = $scope.i18n.vm_term_commonVM_value;
                        }

                        if (zhanweiVM) {
                            $scope.startButton.disable = true;
                        }
                        $scope.category = vmInfo.category ? vmInfo.category : 0;
                        $scope.imc = vmInfo.imcSetting || $scope.i18n.common_term_noTurnOn_value;

						//clone vmInfo，预防之后数据被篡改
						var targetObj = {};
						$.extend(true,targetObj,vmInfo);
                        $rootScope.selectedVmData = [targetObj];
                        $scope.clusterId = vmInfo.clusterId;
                        $scope.clusterUrn = vmInfo.clusterUrn;
                    });
                    $scope.nicTable.data = vmInfo.vmConfig.nics || [];
                    $scope.diskTable.data = vmInfo.vmConfig.disks || [];
                    $("#" + $scope.diskTable.id).widget().option("data", $scope.diskTable.data);
                    $("#" + $scope.nicTable.id).widget().option("data", $scope.nicTable.data);
                    $scope.privilege['perform_term_monitor_label.107001'] && getMonitor();
                    getHypervisor();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function lifeCycle(type, mode) {
                var params = {
                    "operate": {
                        "type": type,
                        "vmIds": [$scope.vmId],
                        "vmOpMode": mode
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    goToTaskCenter(function () {
                        getVm();
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function editBasic() {
                var params = {
                    "info": {
                        "name": $scope.nameItem.value,
                        "description": $scope.descItem.value
                    }
                };
                var deferred = camel.put({
                    "url": {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.name = $scope.nameItem.value;
                    $scope.description = $scope.descItem.value;
                    $("#vmInfoNameDiv").text($scope.i18n.common_term_vm_label + "：" + $scope.name);
                    $("#vmInfoNameDiv").attr("title", $.encoder.encodeForHTML($scope.name));
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                    $scope.nameItem.value = $scope.name;
                    $scope.descItem.value = $scope.description;
                });
            }

            function editTag() {
                var params = {
                    "tag": {
                        "vmIds": [$scope.vmId],
                        "tag": $scope.tagItem.value
                    }
                };
                var deferred = camel.put({
                    "url": {s: "/goku/rest/v1.5/irm/1/vms"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.tag = $scope.tagItem.value;
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                    $scope.tagItem.value = $scope.tag;
                });
            }

            function repairVm() {
                var params = {
                    repairOs: {
                    }
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/vms/{id}/action", o: {id: $scope.vmId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    goToTaskCenter(function () {
                        getVm();
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function incorporate() {
                var params = {
                    "incorporate":{
                        "vmIds":[$scope.vmId]
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                        getVm();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function convertToTemplate() {
                var params = {
                    "isTemplate": true
                };
                var deferred = camel.put({
                    "url": {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    goToTaskCenter(function () {
                        getVm();
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function goToTaskCenter(action) {
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
                                action();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }

            $scope.gotoAlarm = function (level) {
                $state.go("monitor.alarmlist", {"severity": level, "resourceid": $scope.vmId, moc: "vm", "alarmtype": 1});
            };
            //获取告警信息
            function getAlarm() {
                var params = {
                    "conditionList": [
                        {
                            "staticType": ["critical", "major", "minor", "warning"],
                            "staticCond": {"moc": "vm", "objectId": $scope.vmId}
                        }
                    ]
                };
                var urlChoose = "/goku/rest/v1.5/1/alarms/statistic";
                if($scope.isLocal){
                    urlChoose = "/goku/rest/v1.5/fault/1/alarms/statistic";
                }
                var deferred = camel.post({
                    "url": {s: urlChoose},
                    "userId": user.id,
                    "params": JSON.stringify(params)
                });
                deferred.done(function (response) {
                    $scope.$apply(function () {
                        if (response && response.value[0] && response.value[0].staticType) {
                            $scope.alarmInfo.critical = response.value[0].staticType.critical;
                            $scope.alarmInfo.major = response.value[0].staticType.major;
                            $scope.alarmInfo.minor = response.value[0].staticType.minor;
                            $scope.alarmInfo.warning = response.value[0].staticType.warning;
                        }
                    });
                });
                deferred.fail(function (response) {
                });
            }

            function getMonitor() {
                //虚拟机指标： CPU占用率(cpu_usage)、内存占用率(mem_usage)、网络流入速率(nic_byte_in)、网络流出速率(nic_byte_out)、
                // 磁盘I/O(disk_io_in、disk_io_out)、磁盘占用率(disk_usage)、 磁盘I/O命令次数（disk_in_ps、disk_out_ps）、CPU等待时间（cpu_ready_time）、
                // 磁盘读写时延（disk_read_delay、disk_write_delay）
                //存储指标： 存储设备读写次数(storage_read_ps、storage_write_ps)、 平均IO服务时间（await_time）、平均存储设备处理IO时间(svctm_time)
                var metrics = ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_in_ps", "disk_out_ps", "cpu_ready_time", "disk_read_delay", "disk_write_delay", "nic_original_info", "disk_io_info"];
                var chartMetrics = ["cpu_usage", "mem_usage", "disk_usage"];
                monitorService.getMonitor($scope.vmId, null, "vm", metrics, function (value) {
                    if (value.success) {
                        var monitorTopnMap = value.data;
                        $scope.$apply(function () {
                            if (monitorTopnMap) {
                                $scope.net_io_out = precision2(monitorTopnMap.nic_byte_out);
                                $scope.net_io_in = precision2(monitorTopnMap.nic_byte_in);
                                $scope.disk_io_in = precision2(monitorTopnMap.disk_io_in);
                                $scope.disk_io_out = precision2(monitorTopnMap.disk_io_out);

                                $scope.disk_in_ps = precision2(monitorTopnMap.disk_in_ps);
                                $scope.disk_out_ps = precision2(monitorTopnMap.disk_out_ps);
                                $scope.cpu_ready_time = precision2(monitorTopnMap.cpu_ready_time);
                                $scope.disk_read_delay = precision2(monitorTopnMap.disk_read_delay);
                                $scope.disk_write_delay = precision2(monitorTopnMap.disk_write_delay);

                                $scope.cpu_usage = precision2(monitorTopnMap.cpu_usage);
                                $scope.mem_usage = precision2(monitorTopnMap.mem_usage);
                                $scope.disk_usage = precision2(monitorTopnMap.disk_usage);
                            }
                        });
                        try {
                            $scope.diskInfo = JSON.parse(monitorTopnMap.disk_io_info) || [];
                            for (var i = 0; i < $scope.diskInfo.length; i++) {
                                for (var j = 0; j < $scope.diskTable.data.length; j++) {
                                    if ($scope.diskInfo[i].volumeid === $scope.diskTable.data[j].volumeId || $scope.diskInfo[i].volumeid === $scope.diskTable.data[j].volNameOnDev) {
                                        $scope.diskInfo[i].diskName = $scope.diskTable.data[j].diskName;
                                        $scope.diskTable.data[j] = $scope.diskInfo[i];
                                        break;
                                    }
                                }
                            }
                            $("#" + $scope.diskTable.id).widget().option("data", $scope.diskTable.data);
                        }
                        catch (e) {
                        }
                        try {
                            $scope.nicInfo = JSON.parse(monitorTopnMap.nic_original_info) || [];
                            for (var i = 0; i < $scope.nicInfo.length; i++) {
                                for (var j = 0; j < $scope.nicTable.data.length; j++) {
                                    if ($scope.nicInfo[i].mac === $scope.nicTable.data[j].mac) {
                                        $scope.nicInfo[i].name = $scope.nicTable.data[j].name;
                                        $scope.nicTable.data[j] = $scope.nicInfo[i];
                                        break;
                                    }
                                }
                            }
                            $("#" + $scope.nicTable.id).widget().option("data", $scope.nicTable.data);
                        }
                        catch (e) {
                        }
                    } else {
                        exceptionService.doException(value.data);
                    }
                });
            }

            function precision2(numberStr) {
                var number = 0;
                try {
                    if (numberStr) {
                        number = new Number(numberStr);
                    }
                } catch (error) {
                }
                return number.toFixed(2);
            }
            function getHypervisor() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id:  $scope.hypervisorId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function(){
                        $scope.exportAble = data.hypervisor.type === "FusionCompute" && data.hypervisor.version === "1.5.0";
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getVm();
            getAlarm();
        }];
    return summaryCtrl;
});
