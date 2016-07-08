
/* global define */
define(["sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        "tiny-widgets/Message",
        "tiny-common/UnifyValid",
        "app/services/httpService",
        "app/services/competitionConfig",
        'app/services/capacityService',
        'app/services/validatorService',
        'app/services/exceptionService',
        'app/services/commonService',
        'app/business/ecs/services/vm/vmCommonService',
        'app/business/ecs/services/vm/queryVmService',
        'app/business/ecs/services/vm/updateVmService',
        'app/business/ecs/services/monitorService',
        'app/business/ecs/services/vm/vmSnapshotService'
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, _, Window, Message, UnifyValid, http,Competition, capacityService, validator, exception, timeService, vmCommonService, queryVmService, updateVmService, monitorService, vmSnapshotService) {
        "use strict";
        var vmDetailCtrl = ["$scope", "$q", "camel", "validator", "exception", "$interval",
            function ($scope, $q, camel, validator, exception, $interval) {
                // 公共参数和服务
                var user = $("html").scope().user || {};
                $scope.isICT = (user.cloudType === "ICT");
                $scope.showMonitor = !$scope.isICT && user.privilege.role_role_add_option_alarmView_value;
                var $state = $("html").injector().get("$state");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.Competition = Competition;
                $scope.isServiceCenter = $("html").scope().deployMode === "serviceCenter";

                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                var updateVmServiceIns = new updateVmService(exception, $q, camel);
                var capacityServiceIns = new capacityService($q, camel);
                var vmCommonServiceIns = new vmCommonService();
                var vmSnapshotServiceIns = new vmSnapshotService(exception, $q, camel);

                $scope.langEn = window.urlParams.lang === "en";

                // 权限控制
                $scope.hasVmAdvanceOperateRight = _.contains(user.privilegeList, "615000"); // 休眠、修复、转为模板、加入域、快照管理
                $scope.hasVmBasicOperateRight = _.contains(user.privilegeList, "616000"); // 启动、重启、关闭、强制重启、强制关闭、修改

                // 部署场景 allInOne,top, serviceCenter
                $scope.deployMode = $("html").scope().deployMode;

                $scope.vmId = "";
                $scope.vpcId = "";
                $scope.vmDetail = {};
                $scope.snapshotCount = "";
                $scope.monitor = {};
                $scope.cloudInfra = {};
                $scope.supportAddToDomain = "false";

                var nameValidTip = i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 64);
                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "textBoxId": "ecsVmDetailNameId",
                    "validate": "regularCheck(" + validator.vmNameReg + "):" + nameValidTip + ";" +
                        "regularCheck(" + validator.notAllSpaceReg + "):" + nameValidTip,
                    "modifying": false,
                    "clickModify": function () {
                        $scope.name.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#ecsVmDetailNameId input").focus().val($scope.vmDetail.name);
                        }, 50);
                    },
                    "blur": function () {
                        $scope.name.modify();
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.name.modify();
                        }
                    },
                    "modify": function () {
                        if (!UnifyValid.FormValid($("#" + $scope.name.textBoxId))) {
                            return;
                        }
                        var newName = $.trim($("#" + $scope.name.textBoxId).widget().getValue());
                        if(newName === $scope.vmDetail.name){
                            $scope.name.modifying = false;
                            return;
                        }
                        var defer = modifyVm({
                            "name": newName
                        }, null);
                        defer.then(function () {
                            $scope.vmDetail.name = newName;
                            $scope.name.modifying = false;
                        });
                    }
                };

                $scope.os = {
                    "label": i18n.common_term_OS_label + ":"
                };
                $scope.id = {
                    "label": $scope.isICT?i18n.common_term_ID_label + ":":i18n.common_term_globeID_label + ":"
                };
                $scope.bootType = {
                    "label": i18n.common_term_startupSource_label + ":"
                };
                $scope.image = {
                    "label": i18n.common_term_image_label + ":"
                };
                $scope.serviceInstanceName = {
                    "id": "serviceInstanceName",
                    "label": (i18n.service_term_serviceInstance_label || "服务实例：") + ":",
                    "value": ""
                };

                // 权限控制
                var SERVER_OPERATE = "320005";
                var hasApprovalOrderRight = _.contains(user.privilegeList, SERVER_OPERATE);
                var urlInstance = "ssp.instance.myInstance";
                if(hasApprovalOrderRight){
                    urlInstance = "ssp.instance.allInstance";
                }

                $scope.jumpServiceInstancePage = function(){
                    $state.go(urlInstance, {
                        "instanceId": $scope.instanceId
                    });
                };

                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "textBoxId": "ecsVmDetailDescriptionId",
                    "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024),
                    "modifying": false,
                    "clickModify": function () {
                        $scope.description.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#ecsVmDetailDescriptionId input").focus().val($scope.vmDetail.description);
                        }, 50);
                    },
                    "blur": function () {
                        $scope.description.modify();
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.description.modify();
                        }
                    },
                    "modify": function () {
                        if (!UnifyValid.FormValid($("#" + $scope.description.textBoxId))) {
                            return;
                        }
                        var newDesc = $.trim($("#" + $scope.description.textBoxId).widget().getValue());
                        var defer = modifyVm({
                            "description": newDesc
                        }, null);
                        defer.then(function () {
                            $scope.vmDetail.description = newDesc;
                            $scope.description.modifying = false;
                        });
                    }
                };

                $scope.domain = {
                    "label": i18n.common_term_belongsToDomain_label + ":",
                    "modify": function () {
                        if (!$scope.vmDetail.id) {
                            return;
                        }
                        var options = {
                            "winParam": {
                                "vmId": $scope.vmDetail.id,
                                "cloudInfraId": $scope.cloudInfra.id,
                                "vpcId": $scope.vmDetail.vpcId,
                                "domainId": $scope.vmDetail.domainId,
                                "refreshType": ""
                            },
                            "winId": "ecsVmsDetailDomainWinId",
                            "title": "<b>" + i18n.common_term_domainMgr_label + "</b> - " + vmCommonServiceIns.trimToLength($scope.vmDetail.name, 10),
                            "width": "400px",
                            "height": "300px",
                            "modal": true,
                            "content-type": "url",
                            "content": "app/business/ecs/views/vm/editDomain.html",
                            "buttons": null,
                            "close": function (event) {
                                if (options.winParam.refreshType === "refreshSelf") {
                                    queryVmDetail();
                                } else if (options.winParam.refreshType === "refreshParent") {
                                    $(".ecsVmsCls").scope().$emit("refreshVmTableEvent");
                                }
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };

                $scope.createTime = {
                    "label": i18n.common_term_createAt_label + ":"
                };
                $scope.initPw = {
                    "label": i18n.common_term_initializtionPsw_label + ":"
                };
                $scope.cpu = {
                    "label": i18n.common_term_cpu_label + ":",
                    "enable": false,
                    "unEffective": i18n.vm_vm_modifySpecs_info_restart_label,
                    "modify": function () {
                        if (!$scope.vmDetail.id) {
                            return;
                        }
                        var options = {
                            "winParam": {
                                "vmId": $scope.vmDetail.id,
                                "cloudInfra": $scope.cloudInfra,
                                "vpcId": $scope.vmDetail.vpcId,
                                "cpu": $scope.vmDetail.vmSpecInfo.cpuRebootCount,
                                "memory": $scope.vmDetail.vmSpecInfo.memoryRebootCount,
                                "configId": $scope.vmDetail.vmSpecInfo.id,
                                "needRefresh": false
                            },
                            "winId": "ecsVmsDetailSpecWinId",
                            "title": "<b>" + i18n.common_term_modifySpec_button + "</b> - " + vmCommonServiceIns.trimToLength($scope.vmDetail.name, 32),
                            "width": "700px",
                            "height": "450px",
                            "modal": true,
                            "content-type": "url",
                            "content": "app/business/ecs/views/vm/hardware/modifyVmSpec.html",
                            "buttons": null,
                            "close": function (event) {
                                if (options.winParam.needRefresh) {
                                    queryVmDetail();
                                }
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };
                $scope.memory = {
                    "label": i18n.common_term_memory_label + ":",
                    "enable": false
                };

                $scope.disk = {
                    "label": i18n.common_term_disk_label + ":",
                    "diskCount": 0,
                    "totalSize": 0,
                    "view": function () {
                        if (!$scope.vmDetail.id) {
                            return;
                        }
                        var options = {
                            "winId": "ecsVmsDiskDetailWinId",
                            "vmId": $scope.vmDetail.id,
                            "cloudInfra": $scope.cloudInfra,
                            "vpcId": $scope.vmDetail.vpcId,
                            "status": $scope.vmDetail.status,
                            "azId": $scope.vmDetail.availableZoneId,
                            "title": "<b>" + i18n.common_term_disk_label + "</b> - " + vmCommonServiceIns.trimToLength($scope.vmDetail.name, 48),
                            "width": "900px",
                            "height": "600px",
                            "modal": true,
                            "content-type": "url",
                            "content": "app/business/ecs/views/vm/disk/vmDisks.html",
                            "buttons": null,
                            "close": function (event) {
                                queryVmDetail();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };

                $scope.nic = {
                    "label": i18n.common_term_NIC_label + ":",
                    "nicCount": 0,
                    "view": function () {
                        if (!$scope.vmDetail.id) {
                            return;
                        }
                        var options = {
                            "winId": "ecsVmsNicDetailWinId",
                            "vmId": $scope.vmDetail.id,
                            "cloudInfra": $scope.cloudInfra,
                            "vpcId": $scope.vmDetail.vpcId,
                            "status": $scope.vmDetail.status,
                            "title": "<b>" + i18n.common_term_NIC_label + "</b> - " + vmCommonServiceIns.trimToLength($scope.vmDetail.name, 48),
                            "width": "900px",
                            "height": "600px",
                            "modal": true,
                            "content-type": "url",
                            "content": "app/business/ecs/views/vm/nic/nics.html",
                            "buttons": null,
                            "close": function (event) {
                                queryVmDetail();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };

                var snapshotShareData = {
                    "timerHandler": null,
                    "vmId": null
                };
                $scope.snapshot = {
                    "label": i18n.vm_term_snap_label + ":",
                    "view": function () {
                        if (!$scope.vmDetail.id) {
                            return;
                        }
                        snapshotShareData.vmId = $scope.vmDetail.id;
                        snapshotShareData.cloudInfraId = $scope.cloudInfra.id;
                        snapshotShareData.vpcId = $scope.vmDetail.vpcId;
                        var options = {
                            "winId": "ecsVmsSnapshotDetailWinId",
                            "snapshotShareData": snapshotShareData,
                            "status": $scope.vmDetail.status,
                            "title": "<b>" + i18n.vm_term_snap_label + "</b> - " + vmCommonServiceIns.trimToLength($scope.vmDetail.name, 32),
                            "width": "900px",
                            "height": "550px",
                            "modal": true,
                            "content-type": "url",
                            "content": "app/business/ecs/views/vm/snapshot/snapshots.html",
                            "buttons": null,
                            "beforeClose": function (event) {
                                //异常场景的定时退出
                                var popScope = $(".ecs_vm_detail_snapshots").scope();
                                if (popScope) {
                                    try {
                                        popScope.stop();
                                    } catch (e) {}
                                }
                            },
                            "close": function (event) {
                                queryVmDetail();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };

                $scope.alarm = {
                    "label": i18n.alarm_term_alarm_label,
                    "value": {},
                    "click": function (para) {
                        var key = {
                            "critical": 1,
                            "major": 2,
                            "minor": 3,
                            "warning": 4
                        };

                        $state.go("monitor.alarmlist", {
                            severity: key[para] || 0,
                            resourceid:$scope.vmDetail.id,
                            moc:'vm',
                            alarmtype: 1
                        });
                    }
                };

                $scope.cpuUsage = {
                    "label": i18n.perform_term_CPUusageRate_label + ":",
                    "id": "ecsVmDetailCpuUsage",
                    "width": 200,
                    "height": 15,
                    "position": "right",
                    "color": "#5ECC49",
                    "exception": false
                };

                $scope.memUsage = {
                    "label": i18n.perform_term_memUsageRate_label + ":",
                    "id": "ecsVmDetailMemUsage",
                    "width": 200,
                    "height": 15,
                    "position": "right",
                    "color": "#5ECC49",
                    "exception": false
                };

                $scope.diskUsage = {
                    "label": i18n.perform_term_diskUsageRate_label + ":",
                    "id": "ecsVmDetailDiskUsage",
                    "width": 200,
                    "height": 15,
                    "position": "right",
                    "color": "#5ECC49",
                    "exception": false
                };

                $scope.netFlowOut = {
                    "label": i18n.common_term_netOutRate_label + ":"
                };

                $scope.netFlowIn = {
                    "label": i18n.common_term_netInRate_label + ":"
                };

                $scope.diskWrite = {
                    "label": i18n.common_term_diskIOwrite_label + ":"
                };

                $scope.diskRead = {
                    "label": i18n.common_term_diskIOread_label + ":"
                };

                $scope.diskIoTick = {
                    "labelRead": i18n.common_term_diskIOreadCmd_label + ":",
                    "labelWrite": i18n.common_term_diskIOwriteCmd_label + ":"
                };

                $scope.historyMonitor = {
                    "view": function () {
                        var options = {
                            "winId": "ecsVmsDetailMonitorWinId",
                            "vmId": $scope.vmId,
                            "cloudInfra": $scope.cloudInfra,
                            "vpcId": $scope.vmDetail.vpcId,
                            "title": "<b>" + i18n.common_term_monitor_label + "</b> - " + vmCommonServiceIns.trimToLength($scope.vmDetail.name, 48),
                            "width": "1280px",
                            "height": "800px",
                            "modal": true,
                            "content-type": "url",
                            "content": "app/business/ecs/views/vm/monitor/vmMonitor.html",
                            "buttons": null,
                            "close": function (event) {}
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };

                var snapshotNumTick = 0;

                function getVmSnapshots() {
                    var params = {
                        "vmId": $scope.vmId,
                        "user": user,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "vpcId": $scope.vpcId
                    };
                    var defered = vmSnapshotServiceIns.getVmSnapshots(params);
                    defered.then(function (data) {
                        snapshotNumTick = 0;
                        calculateSnapshotNum(data.snapshots);
                        $scope.snapshotCount = snapshotNumTick;
                    });
                }

                function calculateSnapshotNum(snapshots) {
                    if (!snapshots || (snapshots.length <= 0)) {
                        return;
                    }
                    for (var i = 0; i < snapshots.length; i++) {
                        if (!snapshots[i]) {
                            continue;
                        }

                        snapshotNumTick++;
                        if (snapshots[i].childSnapshots) {
                            calculateSnapshotNum(snapshots[i].childSnapshots);
                        }
                    }
                }

                // 查询Detail，包括基本信息，硬件信息
                function queryVmDetail(init) {
                    var defer = queryVmServiceIns.queryVmDetail({
                        "user": user,
                        "vmId": $scope.vmId,
                        "vpcId": $scope.vpcId,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "detailLevel": 7
                    });
                    defer.then(function (data) {
                        if (!data || !data.vm) {
                            return;
                        }
                        if(init){
                            if(!Competition.isBaseOnVmware){
                                queryCapacity();
                                queryVmMonitor();
                            }
                            if(!$scope.isICT){
                                getVmSnapshots();
                                if($scope.showMonitor)
                                {
                                    queryVmAlarm();
                                }
                            }
                        }
                        var vm = data.vm;
                        var diskCount = 0,
                            diskTotalSize = 0,
                            nicCount = 0;
                        if (vm.volumes) {
                            diskCount = vm.volumes.length;
                            _.each(vm.volumes, function (item) {
                                diskTotalSize += item.size;
                            });
                        }
                        if (vm.nics) {
                            nicCount = vm.nics.length;
                        }

                        if($scope.isICT)
                        {
                            vm.createTime =vm.createTime;
                            vm.bootType = vm.startType === "Image"?i18n.template_term_startFromImage_label:"";
                            vm.bootType = vm.startType === "CloudDisk"?i18n.template_term_startFromCloudHarddisk_label:vm.bootType;
                        }
                        else{
                            vm.createTime = timeService.utc2Local(vm.createTime);
                        }
                        $scope.vmDetail = data.vm;
                        $scope.disk.diskCount = diskCount;
                        $scope.disk.totalSize = diskTotalSize;
                        $scope.nic.nicCount = nicCount;

                        $scope.cpu.enable = (data.vm.status === "running" || data.vm.status === "stopped");
                        $scope.memory.enable = (data.vm.status === "running" || data.vm.status === "stopped");
                    });
                }

                //根据资源ID查询
                function queryServiceInstanceId(){
                    var deferred = camel.get({
                        url: {s: "/goku/rest/v1.5/{vdc_id}/service-resources/{id}",
                            o:{vdc_id:user.vdcId,id: $scope.vmId}},
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var hosts =data || [];
                        $scope.hosts = hosts;
                        $scope.$apply(function () {
                            $scope.instanceId = hosts.instanceId;
                            $scope.instanceName = hosts.instanceName;
                            $scope.serviceInstanceName.value = hosts.instanceName;
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data);
                    });
                }
                // 查询虚拟机告警信息
                function queryVmAlarm() {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "params": {
                            "conditionList": [{
                                "staticType": ["critical", "major", "minor", "warning"],
                                "staticCond": {
                                    "moc": "vm",
                                    "objectId": $scope.vmId
                                }
                            }]
                        }
                    };
                    var defer = queryVmServiceIns.queryVmAlarm(options);
                    defer.then(function (data) {
                        if (data && data.value && data.value[0] && data.value[0].staticType) {
                            $scope.alarm.value = {
                                "critical": data.value[0].staticType.critical,
                                "major": data.value[0].staticType.major,
                                "minor": data.value[0].staticType.minor,
                                "warning": data.value[0].staticType.warning
                            };
                        }
                    });
                }

                // 查询虚拟机监控信息
                function queryVmMonitor() {
                    var defer = queryVmServiceIns.queryVmMonitor({
                        "user": user,
                        "vmId": $scope.vmId,
                        "vpc_id":$scope.vpcId || '-1',
                        "cloudInfraId": $scope.cloudInfra.id
                    });
                    defer.then(function (data) {
                        if (!data || !data.realTimeMonitorMap) {
                            return;
                        }

                        var realTimeMonitorMap = data.realTimeMonitorMap;

                        if (!realTimeMonitorMap.cpu_usage || (realTimeMonitorMap.cpu_usage === "-1")) {
                            $scope.cpuUsage.exception = true;
                        } else {
                            var cpuUsageRate = monitorService.progressPercent(realTimeMonitorMap.cpu_usage);
                            if (cpuUsageRate > 100) {
                                cpuUsageRate = 100;
                            }
                            $scope.monitor.cpuUsageRate = cpuUsageRate;
                        }

                        if (!realTimeMonitorMap.mem_usage || (realTimeMonitorMap.mem_usage === "-1")) {
                            $scope.memUsage.exception = true;
                        } else {
                            var memUsageRate = monitorService.progressPercent(realTimeMonitorMap.mem_usage);
                            if (memUsageRate > 100) {
                                memUsageRate = 100;
                            }
                            $scope.monitor.memUsageRate = memUsageRate;
                        }

                        if (!realTimeMonitorMap.disk_usage || (realTimeMonitorMap.disk_usage === "-1")) {
                            $scope.diskUsage.exception = true;
                        } else {
                            $scope.monitor.diskUsageRate = monitorService.progressPercent(realTimeMonitorMap.disk_usage);
                        }

                        if (!realTimeMonitorMap.nic_byte_out || (realTimeMonitorMap.nic_byte_out === "-1")) {
                            $scope.monitor.nicKByteOut = " - ";
                        } else {
                            $scope.monitor.nicKByteOut = monitorService.precise2(realTimeMonitorMap.nic_byte_out) + "KB/S";
                        }

                        if (!realTimeMonitorMap.nic_byte_in || (realTimeMonitorMap.nic_byte_in === "-1")) {
                            $scope.monitor.nicKByteIn = " - ";
                        } else {
                            $scope.monitor.nicKByteIn = monitorService.precise2(realTimeMonitorMap.nic_byte_in) + "KB/S";
                        }

                        if (!realTimeMonitorMap.disk_io_in || (realTimeMonitorMap.disk_io_in === "-1")) {
                            $scope.monitor.ioKByteIn = " - ";
                        } else {
                            $scope.monitor.ioKByteIn = monitorService.precise2(realTimeMonitorMap.disk_io_in) + "KB/S";
                        }

                        if (!realTimeMonitorMap.disk_io_out || (realTimeMonitorMap.disk_io_out === "-1")) {
                            $scope.monitor.ioKByteOut = " - ";
                        } else {
                            $scope.monitor.ioKByteOut = monitorService.precise2(realTimeMonitorMap.disk_io_out) + "KB/S";
                        }

                        if (!realTimeMonitorMap.disk_in_ps || (realTimeMonitorMap.disk_in_ps === "-1")) {
                            $scope.monitor.diskIoWrite = " - ";
                        } else {
                            $scope.monitor.diskIoWrite = monitorService.precise2(realTimeMonitorMap.disk_in_ps) + i18n.common_term_entry_label + "/S";
                        }

                        if (!realTimeMonitorMap.disk_out_ps || (realTimeMonitorMap.disk_out_ps === "-1")) {
                            $scope.monitor.diskIoRead = " - ";
                        } else {
                            $scope.monitor.diskIoRead = monitorService.precise2(realTimeMonitorMap.disk_out_ps) + i18n.common_term_entry_label + "/S";
                        }
                    });
                }
                function modifyVm(info, spec) {
                    var retDefer = $q.defer();
                    var options = {
                        "user": user,
                        "vmId": $scope.vmId,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "vpcId": $scope.vmDetail.vpcId,
                        "info": info,
                        "spec": spec
                    };
                    var deferred = updateVmServiceIns.modifyVm(options);
                    deferred.then(function (data) {
                        retDefer.resolve(data);
                    });
                    return retDefer.promise;
                }

                //查询支持的能力字段
                function queryCapacity() {
                    var capacity = capacityServiceIns.querySpecificCapacity($("html").scope().capacities, $scope.cloudInfra.type, $scope.cloudInfra.version);
                    if (capacity) {
                        $scope.supportAddToDomain = capacity.vm_support_add_to_domain;
                    }
                }

                $scope.init = function () {
                    queryVmDetail(true);
                    if($scope.isServiceCenter){
                        queryServiceInstanceId($scope.hosytId);
                    }
                };
            }
        ];

        var vmDetailModel = angular.module("ecs.vm.detail", ["ng", "wcc", "ngSanitize"]);
        vmDetailModel.controller("ecs.vm.detail.ctrl", vmDetailCtrl);
        vmDetailModel.service("camel", http);
        vmDetailModel.service("exception", exception);
        vmDetailModel.service("validator", validator);

        return vmDetailModel;
    });
