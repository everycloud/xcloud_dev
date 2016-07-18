define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Select",
    "tiny-widgets/Radio",
    'tiny-widgets/Message',
    "tiny-common/UnifyValid",
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    "app/business/resources/controllers/migrateCommon",
    "language/irm-rpool-exception",
    "fixtures/datastoreFixture"],
    function ($, angular, Checkbox, Select, Radio, Message, UnifyValid, constants, Exception, migrateCommon, irmException) {
        "use strict";

        var migrateDiskCtrl = ["$scope", "$compile", "$state", "camel", "$stateParams", function ($scope, $compile, $state, camel, $stateParams) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            //存储类型
            var category = $stateParams.category;
            var hypervisorId = $stateParams.hypervisorId;
            var resourceDataStoreId = $stateParams.datastoreId;
            var zoneId = $stateParams.zoneId;

            var VM_STATUS = {
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
                unknown: $scope.i18n.common_term_unknown_value
            };

            //1.数据存储状态（NORMAL, ABNORMAL(预留),CREATING,DELETING）(NORMAL:表示存储设备已经添加为数据存储,不反映数据存储的真实物理状态)。
            // 2.主机和数据存储的关联状态(关联中CONNECTING，已关联CONNECTED，解关联DISCONNECTING，异常ABNORMAL)
            var DATASTORE_STATUS = {
                NORMAL: $scope.i18n.common_term_natural_value,
                CREATING: $scope.i18n.common_term_creating_value,
                DELETING: $scope.i18n.common_term_deleting_value,
                ABNORMAL: $scope.i18n.common_term_abnormal_value,
                CONNECTING: $scope.i18n.common_term_linking_value,
                CONNECTED: $scope.i18n.common_term_linked_value,
                DISCONNECTING: $scope.i18n.common_term_noLink_value
            };

            $scope.stepUrl = {
                "step1": "../src/app/business/resources/views/hypervisor/disk/migrateSelectDisk.html",
                "step2": "../src/app/business/resources/views/hypervisor/disk/migrateConfig.html"
            };
            $scope.stepShow = {
                "step1": true,
                "step2": false
            };
            $scope.migrateStep = {
                "id": "migrateDiskStep",
                "values": [$scope.i18n.resource_term_chooseDisk_label, $scope.i18n.resource_term_MigrateSet_label],
                "width": "300",
                "jumpable": false
            };

            $scope.diskSearchModel = {
                "curpage": 1,
                "pageSize": 10,
                "offset": 0,
                "limit": 10
            };

            $scope.datastoreSearchModel = {
                "offset": 0,
                "limit": 10
            };

            $scope.vmSelectWidget = {
                id: 'vmSelectWidgetId',
                values: [
                    {
                        selectId: 'CANCEL',
                        label: $scope.i18n.common_term_cancle_button
                    },
                    {
                        selectId: 'stopped',
                        label: $scope.i18n.resource_stor_migrate_para_chooseDiskStop_label
                    },
                    {
                        selectId: 'running',
                        label: $scope.i18n.resource_stor_migrate_para_chooseDiskRun_label
                    },
                    {
                        selectId: 'unAttach',
                        label: $scope.i18n.resource_stor_migrate_para_chooseDiskUnbond_label
                    }
                ],
                width: '200px',
                change: function () {
                    selectSearch();
                }
            };

            $scope.clusterSelectWidget = {
                id: 'clusterSelectWidgetId',
                values: null,
                width: '200px',
                change: function () {
                    selectSearch();
                }
            };
            function cleanDiskTableChecked() {
                var index = 0;
                while ($("#diskCheckbox_" + index).widget()) {
                    $("#diskCheckbox_" + index).widget().option("checked", false);
                    index++;
                }
            }

            /*下拉选择,选中*/
            function selectSearch() {
                cleanDiskTableChecked();
                var vmStatus = $("#vmSelectWidgetId").widget().getSelectedId();
                var clusterId = $("#clusterSelectWidgetId").widget().getSelectedId();
                vmStatus = (!vmStatus) ? "CANCEL" : vmStatus;
                clusterId = (!clusterId) ? "CANCEL" : clusterId;
                if (vmStatus === 'CANCEL' && clusterId === 'CANCEL') {
                    return;
                }

                var data = $("#selectDiskTable").widget().option("data");
                var index = 0;
                while ($("#diskCheckbox_" + index).widget()) {
                    if (clusterId === 'CANCEL' && vmStatus != 'CANCEL') {
                        if (vmStatus === 'unAttach') {
                            if (!data[index].vmId) {
                                $("#diskCheckbox_" + index).widget().option("checked", true);
                            }
                        } else {
                            if (data[index].vmId && data[index].vmStatus == vmStatus) {
                                $("#diskCheckbox_" + index).widget().option("checked", true);
                            }
                        }
                    }
                    if (clusterId != 'CANCEL' && vmStatus == 'CANCEL') {
                        if (data[index].clusterId && data[index].clusterId == clusterId) {
                            $("#diskCheckbox_" + index).widget().option("checked", true);
                        }
                    }

                    if (vmStatus === 'unAttach') {
                        if (!data[index].vmId && data[index].clusterId == clusterId) {
                            $("#diskCheckbox_" + index).widget().option("checked", true);
                        }
                    } else {
                        if (data[index].vmId && data[index].vmStatus == vmStatus && data[index].clusterId == clusterId) {
                            $("#diskCheckbox_" + index).widget().option("checked", true);
                        }
                    }

                    index++;
                }
            }

            function getTableRowSelectStatus(aData) {
                var vmStatus = $("#vmSelectWidgetId").widget().getSelectedId();
                var clusterId = $("#clusterSelectWidgetId").widget().getSelectedId();
                vmStatus = (!vmStatus) ? "CANCEL" : vmStatus;
                clusterId = (!clusterId) ? "CANCEL" : clusterId;
                if (vmStatus === 'CANCEL' && clusterId === 'CANCEL') {
                    return false;
                }

                if (clusterId === 'CANCEL' && vmStatus !== 'CANCEL') {
                    if (vmStatus === 'unAttach') {
                        if (!aData.vmId) {
                            return true;
                        }
                    } else {
                        if (aData.vmId && aData.vmStatus == vmStatus) {
                            return true;
                        }
                    }
                }
                if (clusterId !== 'CANCEL' && vmStatus === 'CANCEL') {
                    if (aData.clusterId && aData.clusterId == clusterId) {
                        return true;
                    }
                }

                if (vmStatus === 'unAttach') {
                    if (!aData.vmId && aData.clusterId == clusterId) {
                        return true;
                    }
                } else {
                    if (aData.vmId && aData.vmStatus == vmStatus && aData.clusterId == clusterId) {
                        return true;
                    }
                }
                return false;
            }

            //选择磁盘页面
            //磁盘列表
            $scope.diskTable = {
                "id": "selectDiskTable",
                "data": [],
                "caption": "",
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "curPage": {
                },
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.checkId);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_belongsToVM_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_vmStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmStatus);
                        },
                        "sWidth": '80px',
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_vmID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmId);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_cluster_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clusterName);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (pageInfo) {
                    $scope.diskSearchModel.curpage = pageInfo.currentPage;
                    $scope.diskSearchModel.offset = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getDisks();
                },
                "changeSelect": function (pageInfo) {
                    $scope.diskSearchModel.offset = 0;
                    $scope.diskSearchModel.curpage = 1;
                    $scope.diskSearchModel.limit = pageInfo.displayLength;
                    getDisks();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //复选框
                    var options = {
                        "id": "diskCheckbox_" + iDataIndex,
                        "checked": getTableRowSelectStatus(aData),
                        "change": function () {
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());

                    var vStatus = aData.vmStatus;
                    if (vStatus) {
                        $('td:eq(3)', nRow).html(VM_STATUS[vStatus] || vStatus);
                    }
                }
            };

            //下一步按钮
            $scope.diskNextButton = {
                "id": "migrateDiskNextButton",
                "text": $scope.i18n.common_term_next_button,
                "click": function () {
                    if (getDiskDS().length === 0) {
                        return;
                    }
                    $("#" + $scope.migrateStep.id).widget().next();
                    getStores();
                    initModes();
                    $scope.stepShow.step1 = false;
                    $scope.stepShow.step2 = true;
                }
            };
            //取消按钮
            $scope.diskCancelButton = {
                "id": "associate_cluster_cancel_button",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    history.back();
                }
            };

            //迁移配置页面
            //目标存储列表
            $scope.storeTable = {
                "id": "targetStoreTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": 40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storageUnit_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.storageunitname);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storageMedia_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.mediaType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.accessible);
                        },
                        "sWidth": '80px',
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacityTotalGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.totalCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_factAvailableCapacityGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.freeCapacityGB);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (pageInfo) {
                    $scope.datastoreSearchModel.offset = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getStores();
                },
                "changeSelect": function (pageInfo) {
                    $scope.datastoreSearchModel.offset = 0;
                    $scope.storeTable.curPage = {
                        "pageIndex": 1
                    };
                    $scope.datastoreSearchModel.limit = pageInfo.displayLength;
                    $scope.storeTable.displayLength = pageInfo.displayLength;
                    getStores();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    if (aData.type) {
                        var type = aData.type.toUpperCase();
                        $('td:eq(2)', nRow).html(migrateCommon.DATASTORE_TYPE[type] || type);
                    }
                    var dsStatus = (aData.accessible) ? $scope.i18n.common_term_available_label : $scope.i18n.common_term_unavailable_value;
                    $('td:eq(5)', nRow).html(dsStatus);
                    //单选框
                    var options = {
                        "id": "storeRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#storeRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#storeRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                            canMigrate(aData.rid, iDataIndex);
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };
            //迁移速率单选组
            $scope.speedRadio = {
                "id": "migrateSpeedRadio",
                "layout": "vertical",
                "label": $scope.i18n.vm_term_migrateRate_label + ":",
                "values": [
                    {
                        "key": "1",
                        "text": $scope.i18n.common_term_fastSpeed_label
                    },
                    {
                        "key": "0",
                        "text": $scope.i18n.common_term_suitably_label,
                        "checked": true
                    },
                    {
                        "key": "2",
                        "text": $scope.i18n.common_term_notLimit_value
                    }
                ],
                "change": function () {
                }
            };
            //目的配置模式列表
            $scope.modeTable = {
                "id": "selectModeTable",
                "data": [],
                "caption": "",
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": $scope.i18n.resource_term_belongsToVM_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vm);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_diskName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.diskName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_vm_migrate_para_support_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.supportMigrate);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_vm_migrate_para_notSupportCause_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.errMessage);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_setMode_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sourceMode);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_vm_migrate_para_targetCfgMode_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.targetMode);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    var support = aData.supportMigrate === true ? $scope.i18n.common_term_support_value : "";
                    support = aData.supportMigrate === false ? $scope.i18n.common_term_notSupport_value : support;
                    $('td:eq(2)', nRow).html(support);
                    $('td:eq(4)', nRow).html(migrateCommon.allocTypes[aData.sourceMode]);
                    var options = {
                        "id": "modeSelect_" + iDataIndex,
                        "disable": true,
                        "width": "100",
                        "values": []
                    };
                    var targetDS = getTargetDS();
                    if (targetDS != null) {
                        var params = {
                            vmStatus: aData.vmStatus,
                            sourceMode: aData.sourceMode,
                            sourceType: category,
                            targetType: targetDS.type
                        };
                        var modes = [];
                        for (var i = 0; i < aData.targetMode.length; i++) {
                            var mm = {
                                selectId: aData.targetMode[i],
                                label: migrateCommon.allocTypes[aData.targetMode[i]]
                            };
                            if (i === 0) {
                                mm.checked = true;
                            }
                            modes.push(mm);
                        }
                        options.values = modes;
                        options.disable = aData.supportMigrate !== true;
                    }

                    var select = new Select(options);
                    $('td:eq(5)', nRow).html(select.getDom());
                }
            };
            //上一步按钮
            $scope.configPreButton = {
                "id": "migrateConfigPreButton",
                "text": $scope.i18n.common_term_back_button,
                "click": function () {
                    $("#" + $scope.migrateStep.id).widget().pre();
                    $scope.stepShow.step2 = false;
                    $scope.stepShow.step1 = true;
                }
            };
            //确定按钮
            $scope.configOkButton = {
                "id": "migrateConfigOkButton",
                "text": $scope.i18n.vm_term_Migrate_button,
                "disable": true,
                "click": function () {
                    var vmDisk = $scope.modeTable.data || [];
                    var i = 0;
                    for (; i < vmDisk.length; i++) {
                        if (vmDisk[i].supportMigrate) {
                            break;
                        }
                    }
                    if (i == vmDisk.length) {
                        return;
                    }
                    var winDesc = $scope.i18n.resource_stor_migrate_info_confirm_msg;
                    var options = {
                        type: "confirm",
                        content: winDesc,
                        height: "auto",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                handler: function (event) {
                                    migrateDisk();
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
            };
            //取消按钮
            $scope.configCancelButton = {
                "id": "migrateConfigCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    history.back();
                }
            };
            //查询VM列表，获取其中的磁盘列表
            function getDisks() {
                var params = {
                    list: {
                        "source": "MANAGER",
                        "migrateOption": true,
                        "offset": $scope.diskSearchModel.offset,
                        "limit": $scope.diskSearchModel.limit,
                        "datastoreId": resourceDataStoreId
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/volumes/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.done(function (data) {
                    $scope.$apply(function () {
                        if (data && data.list && data.list.volumes) {
                            var volList = data.list.volumes;
                            var results = [];
                            for (var i = 0; i < volList.length; i++) {
                                var result = {};
                                result.name = volList[i].name;
                                result.volumnId = volList[i].volumnId;
                                result.azId = volList[i].azId;
                                result.capacityGB = volList[i].capacityGB;
                                result.usedGB = volList[i].usedGB;
                                result.dataStoreName = volList[i].dataStoreName;
                                result.type = volList[i].type;
                                result.allocType = volList[i].allocType;
                                if (volList[i].volVmInfos && volList[i].volVmInfos[0]) {
                                    result.vmName = volList[i].volVmInfos[0].vmName;
                                    result.vmStatus = volList[i].volVmInfos[0].vmStatus;
                                    result.vmId = volList[i].volVmInfos[0].vmID;
                                    result.clusterName = volList[i].volVmInfos[0].clusterName;
                                    result.clusterId = volList[i].volVmInfos[0].clusterId;
                                }
                                results.push(result);
                            }
                            $scope.diskTable.data = results;

                            if ($("#" + $scope.diskTable.id).widget()) {
                                $("#" + $scope.diskTable.id).widget().option("total-records", data.list.total);
                                $("#" + $scope.diskTable.id).widget().option("cur-page", {"pageIndex": $scope.diskSearchModel.curpage});
                                $("#" + $scope.diskTable.id).widget().option("display-length", $scope.diskSearchModel.limit);
                            }
                        }
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getStores() {
                var params = {
                    "detail": 0,
                    "migrateOption": true,
                    "scopeType": "DATASTORE",
                    "scopeObjectId": resourceDataStoreId,
                    "limit": $scope.datastoreSearchModel.limit,
                    "offset": $scope.datastoreSearchModel.offset
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/datastores",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var volList = data && data.datastoreInfos || [];
                    for (var i = 0; i < volList.length; i++) {
                        volList[i].mediaType = volList[i].mediaType === "SAN-Any" ? "Any" : volList[i].mediaType;
                        if (volList[i].capacity) {
                            volList[i].totalCapacityGB = volList[i].capacity.totalCapacityGB;
                            volList[i].freeCapacityGB = volList[i].capacity.freeCapacityGB;
                        }
                    }
                    $scope.$apply(function () {
                        $scope.storeTable.totalRecords = data.total;
                        $scope.storeTable.data = volList;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function canMigrate(storageId, iDataIndex) {
                var disks = getDiskDS();
                var volumes = [];
                for (var i = 0; i < disks.length; i++) {
                    volumes.push({
                        volumeId: disks[i].volumnId,
                        dstDs: storageId
                    });
                }
                var params = {
                    "canMigrate": {
                        "migrateType": "0",
                        "migrationModel": $("#migrateSpeedRadio").widget().opChecked("checked"),
                        "volumes": volumes
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/volumes/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var volumes = data && data.canMigrate && data.canMigrate.volumes || [];
                    $scope.$apply(function () {
                        initModes(volumes);
                    });
                    refreshMigrateBtnStatus();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function initModes(volumes) {
                var canMigrateDisk = volumes || [];
                var disks = getDiskDS();
                var modes = [];
                for (var i = 0; i < disks.length; i++) {
                    var mode = {
                        vm: disks[i].vmName,
                        diskName: disks[i].name,
                        sourceMode: disks[i].allocType,
                        vmStatus: disks[i].vmStatus,
                        volumnId: disks[i].volumnId,
                        targetMode:[]
                    };
                    for (var j = 0; j < canMigrateDisk.length; j++) {
                        if (disks[i].volumnId === canMigrateDisk[j].volumeId) {
                            mode.supportMigrate = canMigrateDisk[j].result;
                            mode.errMessage = irmException[canMigrateDisk[j].errCode] && irmException[canMigrateDisk[j].errCode].cause || canMigrateDisk[j].errMessage;
                            if(canMigrateDisk[j].normalVolume){
                                mode.targetMode.push("thick");
                            }
                            if(canMigrateDisk[j].thinVolume){
                                mode.targetMode.push("thin");
                            }
                            if(canMigrateDisk[j].delayVolue){
                                mode.targetMode.push("thickformat");
                            }
                            break;
                        }
                    }
                    modes.push(mode);
                }
                $scope.modeTable.data = modes;
            }

            function migrateDisk() {
                var params = {
                    migrate: {
                        migrateSpeed: $("#migrateSpeedRadio").widget().opChecked("checked"),
                        hypervisorId: hypervisorId,
                        migrateVolumes: contractParams()
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/volumes/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.task_view_task_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn: true,
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
                                    history.back();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function contractParams() {
                var disks = getDiskDS();
                var target = getTargetDS();
                var migrateVolumes = [];
                if (disks) {
                    for (var i = 0; i < disks.length; i++) {
                        var mv = {
                            volId: disks[i].volumnId,
                            volCapacity: disks[i].capacityGB,
                            volProvisionSize: disks[i].usedGB,
                            dataStoreId: (target) ? target.id : null,
                            vmId: disks[i].vmId,
                            vmName: disks[i].vmName,
                            volName: disks[i].name,
                            sourceDataStoreName: disks[i].dataStoreName,
                            type: disks[i].targetMode,
                            migrateType: 1
                        };
                        migrateVolumes.push(mv);
                    }
                }
                return migrateVolumes;
            }

            //获取待迁移磁盘
            function getDiskDS() {
                var selectedResourceDS = [];
                var resourceDSTable = $("#" + $scope.diskTable.id).widget();
                var data = resourceDSTable.option("data");
                var index = 0;
                while ($("#diskCheckbox_" + index).widget()) {
                    var checked = $("#diskCheckbox_" + index).widget().option("checked");
                    if (checked) {
                        var mode = getTargetdsModeType(data[index].volumnId);
                        data[index].targetMode = mode;
                        selectedResourceDS.push(data[index]);
                    }
                    index++;
                }
                return selectedResourceDS;
            }

            function getTargetdsModeType(volumnId) {
                var modeTableTable = $("#" + $scope.modeTable.id).widget();
                if (modeTableTable) {
                    var modeTableData = modeTableTable.option("data");
                    if (modeTableData) {
                        for (var i = 0; i < modeTableData.length; i++) {
                            if (modeTableData[i].volumnId == volumnId) {
                                var mode = $("#modeSelect_" + i).widget().getSelectedId();
                                return mode;
                            }
                        }
                    }
                }
                return null;
            }

            //获取目标存储
            function getTargetDS() {
                var targetDSTable = $("#" + $scope.storeTable.id).widget();
                var data = targetDSTable.option("data");
                var index = 0;
                while ($("#storeRadio_" + index).widget()) {
                    var checked = $("#storeRadio_" + index).widget().option("checked");
                    if (checked) {
                        return data[index];
                    }
                    index++;
                }
                return null;
            }

            function initCluster() {
                var params = {
                    "list": {
                        "requestType": "ALL",
                        "start": 0,
                        "limit": 100,
                        "ignoreCapacity": true
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/resourceclusters/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var resourceClusters = data && data.list && data.list.resourceClusters || [];
                    var arr = [];
                    arr.push({selectId: 'CANCEL', label: $scope.i18n.common_term_cancle_button});
                    for (var i = 0; i < resourceClusters.length; i++) {
                        var mm = {
                            selectId: resourceClusters[i].indexId,
                            label: resourceClusters[i].name
                        };
                        arr.push(mm);
                    }
                    $scope.$apply(function () {
                        $scope.clusterSelectWidget.values = arr;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            //刷新迁移按钮状态
            function refreshMigrateBtnStatus() {
                $("#" + $scope.configOkButton.id).widget().option("disable", true);
                var vmDisk = $scope.modeTable.data || [];
                var canMigrateNum = 0;
                for (var i = 0; i < vmDisk.length; i++) {
                    if (vmDisk[i].supportMigrate) {
                        canMigrateNum++;
                    }
                }
                if (canMigrateNum) {
                    $("#" + $scope.configOkButton.id).widget().option("disable", false);
                }
                else {
                    var options = {
                        type: "confirm",
                        "title": $scope.i18n.alarm_term_warning_label,
                        content: $scope.i18n.vm_vm_migrate_para_targetDataStor_valid,
                        height: "150px",
                        width: "300px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                handler: function (event) {
                                    msg.destroy();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                }
            }

            getDisks();
            initCluster();
        }];
        return migrateDiskCtrl;
    }
);
