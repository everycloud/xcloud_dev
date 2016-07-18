/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-widgets/Columnchart",
    "tiny-directives/Columnchart",
    "app/services/exceptionService",
    "app/business/resources/services/monitorService",
    "app/services/competitionConfig",
    "tiny-common/UnifyValid",
    "fixtures/hypervisorFixture"
],
    function ($, angular, Window, Message, Columnchart, ColumnchartDirective, exceptionService, monitorService, Competition, UnifyValid) {
        "use strict";

        var summaryCtrl = ["$scope", "$stateParams", "$state", "$compile", "$q", "camel", "validator", function ($scope, $stateParams, $state, $compile, $q, camel, validator) {
            var exceptionSer = new exceptionService();
            $scope.opActive();
            $scope.fromState = $stateParams.from;
            $scope.vmName = $stateParams.vmName;
            $scope.vmId = $stateParams.vmId;
            $scope.regionName = $stateParams.region;
            $scope.competition = Competition;
            $scope.unit = $scope.i18n.common_term_entry_label;
            var novaId = $stateParams.novaId;
            var tokenId;
            var projectId;
            var user = $("html").scope().user;
            $scope.isICT = (user.cloudType === "ICT");

            $scope.operations = {
                forceStop: $scope.i18n.common_term_forciblyShut_button,
                reboot: $scope.i18n.common_term_restart_button,
                forceReboot: $scope.i18n.common_term_forciblyRestart_button,
                suspend: $scope.i18n.common_term_hibernate_button,
                resume: $scope.i18n.common_term_awaken_button,
                pause: $scope.i18n.common_term_pause_button,
                unpause: $scope.i18n.common_term_unpause_button
            };

            $scope.label = {
                "name": $scope.i18n.common_term_name_label + ":",
                "vmId": "ID:",
                "ip": $scope.i18n.common_term_IP_label + ":",
                "mac": "MAC:",
                "desc": $scope.i18n.common_term_desc_label + ":",
                "status": $scope.i18n.common_term_status_label + ":",
                "taskStatus": $scope.i18n.task_term_taskStatus_label + ":",
                "host": $scope.i18n.common_term_host_label + ":",
                "az": $scope.i18n.resource_term_AZ_label + ":",
                "createTime": $scope.i18n.common_term_createAt_label + ":",
                "os": $scope.i18n.common_term_OS_label + ":",
                "image": $scope.i18n.common_term_image_label + ":"
            };

            var statuses = {
                ACTIVE: $scope.i18n.common_term_running_value,
                SHUTOFF: $scope.i18n.common_term_stoped_value,
                SUSPENDED: $scope.i18n.common_term_hibernated_value,
                PAUSED: $scope.i18n.common_term_paused_value,
                REBOOT: $scope.i18n.common_term_restarting_value,
                HARD_REBOOT: $scope.i18n.common_term_forciblyRestarting_value,
                BUILD: $scope.i18n.common_term_creating_value,
                MIGRATING: $scope.i18n.common_term_migrating_value,
                VERIFY_RESIZE: $scope.i18n.vm_term_modifyWaitConfirm_value,
                ERROR: $scope.i18n.common_term_trouble_label,
                RESCUED: $scope.i18n.common_term_resumed_value,
                RESIZED: $scope.i18n.vm_term_modified_value,
                unknown:$scope.i18n.common_term_unknown_value
            };
            var taskStatus = {
                scheduling: $scope.i18n.vm_term_scheduling_value,
                block_device_mapping: $scope.i18n.vm_term_blockDeviceMapping_value,
                networking: $scope.i18n.vm_term_networking_value,
                spawning: $scope.i18n.vm_term_spawning_value,
                resize_prep: $scope.i18n.vm_term_modifyReady_value,
                resize_migrating: $scope.i18n.vm_term_modifyMigrate_value,
                resize_migrated: $scope.i18n.vm_term_modifyMigrateComplete_value,
                resize_finish: $scope.i18n.vm_term_modifyComplete_value,
                resize_confirming: $scope.i18n.vm_term_modifyConfirming_value,
                rebooting: $scope.i18n.common_term_restarting_value,
                rebooting_hard: $scope.i18n.common_term_forciblyRestarting_value,
                pausing: $scope.i18n.common_term_pauseing_value,
                unpausing: $scope.i18n.common_term_unpausing_value,
                suspending: $scope.i18n.common_term_hibernating_value,
                resuming: $scope.i18n.common_term_awaking_value,
                "powering-off": $scope.i18n.common_term_shuting_value,
                "powering-on": $scope.i18n.common_term_startuping_value,
                migrating: $scope.i18n.common_term_migrating_value,
                deleting: $scope.i18n.common_term_deleting_value
            };
            $scope.nameItem = {
                "label": $scope.i18n.common_term_name_label + ":",
                "value": "",
                "id": "serverDetailNameId",
                "modifying": false,
                "validate": "required:" + $scope.i18n.common_term_null_valid +
                    ";maxSize(128):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "128"}) +
                    ";regularCheck(" + validator.vmNameCharReg +
                    "):" + $scope.i18n.common_term_composition7_valid,
                "clickModify": function () {
                    $scope.nameItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#ecsVmDetailNameId input").focus();
                    }, 50);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#serverNameTextboxDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.nameItem.value = $("#" + $scope.nameItem.id).widget().getValue();
                    $scope.nameItem.modifying = false;
                    editBasic();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        var result = UnifyValid.FormValid($("#serverNameTextboxDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.nameItem.value = $("#" + $scope.nameItem.id).widget().getValue();
                            $scope.nameItem.modifying = false;
                            editBasic();
                        });
                    }
                }
            };

            //启动/唤醒按钮
            $scope.startButton = {
                "id": "startVmButton",
                "text": $scope.i18n.common_term_startup_button,
                "click": function () {
                    showMessage($scope.i18n.vm_vm_start_info_confirm_msg, function () {
                        lifeCycle("os-start", null);
                    });
                }
            };

            //VNC登录按钮
            $scope.vncButton = {
                "id": "serverVvncButton",
                "text": $scope.i18n.vm_term_vnc_button,
                "disable": false,
                "click": function () {
                    vncLogin();
                }
            };
            //关闭按钮
            $scope.stopButton = {
                "id": "stopVmButton",
                "text": $scope.i18n.common_term_turnOff_button,
                "click": function () {
                    showMessage($scope.i18n.vm_vm_shut_info_confirm_msg, function () {
                        if (Competition.isBaseOnVmware) {
                            lifeCycle("os-stop", null);
                        }
                        else {
                            lifeCycle("os-soft-stop", null);
                        }
                    });
                }
            };
            //刷新按钮
            $scope.refreshButton = {
                "id": "refreshButton",
                "text": $scope.i18n.common_term_fresh_button,
                "click": function () {
                    getVm();
                    if (!Competition.isBaseOnVmware) {
                        getMonitor();
                    }
                }
            };
            $scope.forceStop = function () {
                if ($scope.status !== 'ACTIVE' && $scope.status !== 'RESCUED' && $scope.status !== 'ERROR' || $scope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_forciblyShut_info_confirm_msg, function () {
                    lifeCycle("os-stop", null);
                });
            };
            $scope.reboot = function () {
                if (!Competition.isBaseOnVmware && $scope.status !== 'ACTIVE' && $scope.status !== 'PAUSED' &&
                    $scope.status !== 'SHUTOFF' && $scope.status !== 'SUSPENDED' || $scope.middleStatuss) {
                    return;
                }
                if (Competition.isBaseOnVmware && $scope.status !== 'ACTIVE' && $scope.status !== 'PAUSED') {
                    return;
                }
                showMessage($scope.i18n.common_term_restartConfirm_msg, function () {
                    lifeCycle("reboot", "SOFT");
                });
            };
            $scope.forceReboot = function () {
                if (!Competition.isBaseOnVmware && $scope.status !== 'ACTIVE' && $scope.status !== 'PAUSED' &&
                    $scope.status !== 'SHUTOFF' && $scope.status !== 'SUSPENDED' || $scope.middleStatuss) {
                    return;
                }
                if (Competition.isBaseOnVmware && $scope.status !== 'ACTIVE' && $scope.status !== 'PAUSED') {
                    return;
                }
                showMessage($scope.i18n.vm_vm_forciblyRestart_info_confirm_msg, function () {
                    lifeCycle("reboot", "HARD");
                });
            };
            $scope.suspend = function () {
                if ($scope.status !== 'ACTIVE' && $scope.status !== 'RESCUED' || $scope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_hibernate_info_confirm_msg, function () {
                    lifeCycle("suspend", null);
                });
            };
            $scope.resume = function () {
                if ($scope.status !== 'SUSPENDED' || $scope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_wakup_info_confirm_msg, function () {
                    lifeCycle("resume", null);
                });
            };
            $scope.pause = function () {
                if ($scope.status !== 'ACTIVE' && $scope.status !== 'RESCUED' || $scope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_pause_info_confirm_msg, function () {
                    lifeCycle("pause", null);
                });
            };
            $scope.unpause = function () {
                if ($scope.status !== 'PAUSED' || $scope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_unpause_info_confirm_msg, function () {
                    lifeCycle("unpause", null);
                });
            };
            $scope.migrate = function () {
                if ($scope.status !== 'SHUTOFF' && $scope.status !== 'ACTIVE' || $scope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_migrate_info_confirm_msg, function () {
                    lifeCycle("migrate", null);
                });
            };
            $scope.liveMigrate = function () {
                if ($scope.status !== 'ACTIVE' || $scope.middleStatus) {
                    return;
                }
                migrateVm();
            };
            $scope.confirmResize = function () {
                if ($scope.status !== 'VERIFY_RESIZE' || $scope.middleStatus) {
                    return;
                }
                lifeCycle("confirmResize", null);
            };

            // 扩展属性
            $scope.metaDataTable = {
                "id": "vmSummaryMetaDataTable",
                "data": null,
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.key);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.value);
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
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
                    url: {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}",
                        o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                    },
                    "params": null,
                    "userId": user.id,
                    "beforeSend": function (request) {
                        request.setRequestHeader("X-Auth-Token", tokenId);
                    }
                });
                deferred.success(function (data) {
                    var server = data.server;
                    var ip = "";
                    var mac = "";
                    var addresses = server.addresses || {};
                    for (var j in addresses) {
                        var base = addresses[j] || [];
                        for (var k = 0; k < base.length; k++) {
                            if (ip === "") {
                                ip = base[k].addr;
                                mac = base[k]["OS-EXT-IPS-MAC:mac_addr"];
                            }
                            else {
                                ip = ip + "; " + base[k].addr;
                                mac = mac + "; " + base[k]["OS-EXT-IPS-MAC:mac_addr"];
                            }
                        }
                    }
                    $scope.$apply(function () {
                        $scope.ip = ip;
                        $scope.mac = mac;
                        $scope.nameItem.value = server.name;
                        $scope.name = server.name;
                        $scope.status = server.status;
                        $scope.image = server.image;
                        $scope.statusStr = statuses[server.status] || server.status;
                        $scope.taskStatus = server["OS-EXT-STS:task_state"];
                        $scope.taskStatusStr = taskStatus[$scope.taskStatus] || $scope.taskStatus;
                        $scope.middleStatus = !!$scope.taskStatus;
                        $scope.createTime = server.created;
                        $scope.hostName = server["OS-EXT-SRV-ATTR:host"];
                        $scope.hostId = server.hostId;
                        $scope.az = server["OS-EXT-AZ:availability_zone"];
                        $scope.startFromImage = !!server.image;
                        $scope.blockMigration = (server.image && server.image !== "") ? true : false;
                        if (server.status !== "SHUTOFF" && server.status !== "STTOPED" || $scope.middleStatus) {
                            $("#" + $scope.startButton.id).widget().option("disable", true);
                        }
                        else {
                            $("#" + $scope.startButton.id).widget().option("disable", false);
                        }
                        if (server.status !== "ACTIVE" || $scope.middleStatus) {
                            $("#" + $scope.stopButton.id).widget().option("disable", true);
                        }
                        else {
                            $("#" + $scope.stopButton.id).widget().option("disable", false);
                        }

                        // 获取metaDataTable
                        getMetaData(server.metadata);
                    });
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            // 获取虚拟机扩展属性
            function getMetaData (metaData) {
                if (!metaData) {
                    $scope.metaDataTable.data = [];
                }

                var metaDataList = [];
                for (var key in metaData) {
                    metaDataList.push({"key":key, "value":metaData[key]});
                }

                $scope.metaDataTable.data = metaDataList;
            }

            function lifeCycle(action, type) {
                var params = {
                };
                params[action] = null;
                if (type) {
                    params[action] = {
                        "type": type
                    };
                }
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/action",
                        o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    getVm();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            function editBasic() {
                var params = {
                    "server": {
                        "name": $scope.nameItem.value
                    }
                };
                var deferred = camel.put({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}",
                        o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    $scope.name = $scope.nameItem.value;
                    $("#serverInfoNameDiv").text($scope.i18n.common_term_vm_label + "：" + $scope.name);
                    $("#serverInfoNameDiv").attr("title", $.encoder.encodeForHTML($scope.name));
                });
                deferred.fail(function (data) {
                    $scope.nameItem.value = $scope.name;
                    exceptionSer.doException(data);
                });
            }

            function vncLogin() {
                var params = {
                    "os-getVNCConsole": {
                        "type": "novnc"
                    }
                };
                var deferred = camel.post({
                    "url": {
                        "s": "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/action",
                        o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    window.open(data.console.url);
                });
                deferred.fail(function (response) {
                    exceptionSer.doException(response);
                });
            }

            function getToken() {
                var deferred = camel.get({
                    "url": {"s": "/goku/rest/v1.5/token"},
                    "params": {"user-id": user.id},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if (data === undefined) {
                        return;
                    }
                    tokenId = data.id;
                    projectId = data.projectId;
                    getVm();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            function convert(vv) {
                if (vv) {
                    vv = parseFloat(vv);
                    return Math.round(vv * 100) / 100.00;
                }
            }

            function getMonitor() {
                //虚拟机指标： CPU占用率(cpu_usage)、内存占用率(mem_usage)、网络流入速率(nic_byte_in)、网络流出速率(nic_byte_out)、
                // 磁盘I/O(disk_io_in、disk_io_out)、磁盘占用率(disk_usage)、 磁盘I/O命令次数（disk_in_ps、disk_out_ps）、CPU等待时间（cpu_ready_time）、
                // 磁盘读写时延（disk_read_delay、disk_write_delay）
                //存储指标： 存储设备读写次数(storage_read_ps、storage_write_ps)、 平均IO服务时间（await_time）、平均存储设备处理IO时间(svctm_time)
                var metrics = ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_in_ps", "disk_out_ps"];
                var chartMetrics = ["cpu_usage", "mem_usage", "disk_usage"];
                monitorService.getMonitor($scope.vmId, null, "vm", metrics, function (value) {
                    if (value.success) {
                        $scope.$apply(function () {
                            var monitorTopnMap = value.data;
                            $scope.net_io_out = convert(monitorTopnMap.nic_byte_out);
                            $scope.net_io_in = convert(monitorTopnMap.nic_byte_in);
                            $scope.disk_io_in = convert(monitorTopnMap.disk_io_in);
                            $scope.disk_io_out = convert(monitorTopnMap.disk_io_out);

                            $scope.disk_in_ps = convert(monitorTopnMap.disk_in_ps);
                            $scope.disk_out_ps = convert(monitorTopnMap.disk_out_ps);

                            var arr = [];
                            for (var inx in chartMetrics) {
                                var aa = chartMetrics[inx];
                                var meObj = monitorTopnMap[aa];
                                var vv = "0.0";
                                if (meObj) {
                                    vv = meObj;
                                    if(vv * 1 > 100){
                                        vv = 100;
                                    }
                                }
                                vv = Math.round(vv * 100) / 100.00;
                                var ar = {
                                    textValue: $.encoder.encodeForHTML(vv) + '%',//显示的title文本
                                    name: '',//label
                                    value: vv,//当前值
                                    initValue: 0,
                                    maxValue: 100,
                                    color: "#1FBE5C"//进度条颜色
                                };
                                if (aa === 'cpu_usage') {
                                    ar.name = $scope.i18n.perform_term_CPUusageRate_label;
                                } else if (aa === 'mem_usage') {
                                    ar.name = $scope.i18n.perform_term_memUsageRate_label;
                                } else {
                                    ar.name = $scope.i18n.perform_term_diskUsageRate_label;
                                }
                                arr.push(ar);
                            }//for

                            var series = {series: arr};
                            $("#vm_chart").find("div").remove();
                            var cc = new Columnchart({
                                id: "vm_chart",
                                width: "350px",
                                isFill: true,
                                style: "bold",
                                values: series
                            });
                        });
                    } else {
                        exceptionSer.doException(value.data);
                    }
                }, $scope.regionName);
            }

            function migrateVm() {
                var newWindow = new Window({
                    "winId": "migrateVmWindow",
                    "title": $scope.i18n.vm_term_Migrate_button,
                    "novaId": novaId,
                    "projectId": projectId,
                    "tokenId": tokenId,
                    "hostId": $scope.hostId,
                    "serverId": $scope.vmId,
                    "blockMigration": $scope.blockMigration,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/openStackResource/server/migrateVm.html",
                    "height": 500,
                    "width": 800,
                    "maximizable":false,
                    "minimizable":false,
                    "close": function () {
                        getVm();
                    }
                });
                newWindow.show();
            }

            getToken();
            if (!Competition.isBaseOnVmware) {
                getMonitor();
            }
        }];
        return summaryCtrl;
    });
