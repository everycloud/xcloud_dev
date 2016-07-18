/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Radio",
    "tiny-widgets/Select",
    "tiny-widgets/Window",
    "tiny-widgets/Progressbar",
    "tiny-common/UnifyValid",
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    "app/business/resources/controllers/migrateCommon",
    "language/irm-rpool-exception",
    "fixtures/hypervisorFixture"],
    function ($, angular, Radio, Select, Window, Progressbar, UnifyValid, Message, constants, Exception, migrateCommon, irmException) {
        "use strict";

        var migrateCtrl = ["$scope", "$compile", "$state", "$stateParams", "validator", "camel", '$rootScope',
            function ($scope, $compile, $state, $stateParams, validator, camel, $rootScope) {
                var exceptionService = new Exception();
                var user = $("html").scope().user;
                $scope.DISKS_DATA = [];
                $scope.SELECTED_VMS = $rootScope.selectedVmData;
                var hypervisorId = $stateParams.hypervisorId;
                var clusterId = $stateParams.clusterId;
                var clusterUrn = $stateParams.clusterUrn;
                var vmType = $stateParams.vmType;
                var HOST_RUN_STATUS = {
                    "rebooting": $scope.i18n.common_term_restarting_value,
                    "normal": $scope.i18n.common_term_natural_value,
                    "fault": $scope.i18n.common_term_trouble_label,
                    "initial": $scope.i18n.common_term_initializtion_value,
                    "unknow": $scope.i18n.common_term_unknown_value,
                    "unknown": $scope.i18n.common_term_unknown_value,
                    "poweroff": $scope.i18n.common_term_offline_label,
                    "booting": $scope.i18n.common_term_oning_value,
                    "shutdowning": $scope.i18n.common_term_downing_value
                };

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
                    "step1": "../src/app/business/resources/views/hypervisor/vm/migrateMethod.html",
                    "step2": "../src/app/business/resources/views/hypervisor/vm/migrateTarget.html"
                };
                $scope.stepShow = {
                    "step1": true,
                    "step2": false
                };
                $scope.migrateStep = {
                    "id": "migrateVmStep",
                    "values": [$scope.i18n.vm_term_migrateMode_label, $scope.i18n.vm_term_chooseTarget_label],
                    "width": "300",
                    "jumpable": false
                };

                function isHasStoppedVM() {
                    if ($scope.SELECTED_VMS) {
                        for (var i = 0; i < $scope.SELECTED_VMS.length; i++) {
                            if ($scope.SELECTED_VMS[i].status === "stopped") {
                                return true;
                            }
                        }
                    }
                    return false;
                }

                //选择迁移方式页面
                //迁移方式单选组
                $scope.methodRadioGroup = {
                    "id": "migrateMethodRadioGroup",
                    "values": [
                        {
                            "key": "host",
                            "text": $scope.i18n.vm_vm_migrate_para_mode_option_changeHost_value,
                            "checked": !isHasStoppedVM(),
                            "disable": isHasStoppedVM()
                        },
                        {
                            "key": "store",
                            "text": $scope.i18n.vm_vm_migrate_para_mode_option_changeStorage_value,
                            "checked": isHasStoppedVM(),
                            "disable": false
                        }
                    ],
                    "layout": "horizon",
                    "change": function () {
                        $scope.methodShow.host = $("#" + $scope.methodRadioGroup.id).widget().opChecked("host");
                        $scope.methodShow.store = $("#" + $scope.methodRadioGroup.id).widget().opChecked("store");
                    }
                };
                $scope.methodShow = {
                    "host": !isHasStoppedVM(),
                    "store": isHasStoppedVM()
                };
                //下一步按钮
                $scope.methodNextButton = {
                    "id": "methodNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        $("#" + $scope.migrateStep.id).widget().next();
                        $scope.stepShow.step1 = false;
                        $scope.stepShow.step2 = true;
                        if ($scope.methodShow.host) {
                            getHostData();
                        }
                        if ($scope.methodShow.store) {
                            getStores();
                        }
                    }
                };
                //取消按钮
                $scope.methodCancelButton = {
                    "id": "methodCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        history.back();
                    }
                };

                //更改主机页面
                //主机迁移单选组
                $scope.targetRadioGroup = {
                    "id": "migrateTargetRadioGroup",
                    "values": [
                        {
                            "key": "destination",
                            "text": $scope.i18n.vm_vm_migrate_para_policy_option_target_value,
                            "checked": true,
                            "disabled": false
                        },
                        {
                            "key": "condition",
                            "text": $scope.i18n.vm_vm_migrate_para_policy_option_term_value,
                            "checked": false,
                            "disabled": false
                        }
                    ],
                    "layout": "vertical",
                    "change": function () {
                        $scope.targetHostShow.destination = $("#" + $scope.targetRadioGroup.id).widget().opChecked("destination");
                        $scope.targetHostShow.condition = $("#" + $scope.targetRadioGroup.id).widget().opChecked("condition");
                        getHostData();
                    }
                };
                $scope.targetHostShow = {
                    "destination": true,
                    "condition": false
                };

                //按目的主机迁移页面
                $scope.clusterSelector = {
                    "id": "searchClusterSelector",
                    "label": $scope.i18n.virtual_term_cluster_label + ":",
                    "width": "200",
                    "values": null,
                    "change": function () {
                    }
                };
                function getClusters() {
                    var params = {
                        "list": {
                            start: 0,
                            limit: 256,
                            "requestType": "ALL",
                            "hypervisorId": hypervisorId,
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
                        var values = [];
                        for (var i = 0; i < resourceClusters.length; i++) {
                            var value = {
                                "selectId": resourceClusters[i].id,
                                "label": resourceClusters[i].name,
                                "checked": resourceClusters[i].indexId == clusterId
                            };
                            values.push(value);
                        }
                        $scope.$apply(function () {
                            $scope.clusterSelector.values = values;
                            $scope.condCluster.values = values;
                        });
                        getHostData();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                $scope.searchHostBox = {
                    "id": "searchHostBox",
                    "label": $scope.i18n.common_term_host_label + ":"
                };
                $scope.destSearchButton = {
                    "id": "destSearchButton",
                    "text": $scope.i18n.common_term_search_button,
                    "click": function () {
                        getHostData();
                    }
                };
                //按目的迁移主机列表
                var destPage = {
                    "start": 0,
                    "limit": 10
                };
                $scope.destHostTable = {
                    "id": "destHostTableId",
                    "data": null,
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
                            "sTitle": $scope.i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.runtimeState);
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
                        destPage.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                        getHostData();
                    },
                    "changeSelect": function (pageInfo) {
                        destPage.start = 0;
                        $scope.destHostTable.curPage = {
                            "pageIndex": 1
                        };
                        destPage.limit = pageInfo.displayLength;
                        $scope.destHostTable.displayLength = pageInfo.displayLength;
                        getHostData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(2)', nRow).html(HOST_RUN_STATUS[aData.runtimeState]);
                        //单选框
                        var options = {
                            "id": "destHostRadio_" + iDataIndex,
                            "checked": false,
                            "disable": aData.maintenanceStatus,
                            "change": function () {
                                var index = 0;
                                while ($("#destHostRadio_" + index).widget()) {
                                    if (index != iDataIndex) {
                                        $("#destHostRadio_" + index).widget().option("checked", false);
                                    }
                                    index++;
                                }
                                refreshMigrateBtnStatus();
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());

                    }
                };
                function getHostData() {
                    var result = UnifyValid.FormValid($("#condHostDiv"));
                    if (!result) {
                        return;
                    }
                    var vmIds = [];
                    if ($scope.SELECTED_VMS) {
                        for (var i = 0; i < $scope.SELECTED_VMS.length; i++) {
                            vmIds.push($scope.SELECTED_VMS[i].id);
                        }
                    }
                    var params = {
                        "canMigrateHosts": {
                            "vmIds": vmIds
                        }
                    };
                    if ($scope.targetHostShow.condition) {
                        params.canMigrateHosts.limit = condPage.limit;
                        params.canMigrateHosts.start = condPage.start;
                        var listByCondition = {
                            clusterId: $("#" + $scope.condCluster.id).widget().getSelectedId(),
                            cpuRateMin: $("#" + $scope.cpuRateFrom.id).widget().getValue() || 0,
                            cpuRateMax: $("#" + $scope.cpuRateTo.id).widget().getValue() || 100,
                            memRateMin: $("#" + $scope.memoryRateFrom.id).widget().getValue() || 0,
                            memRateMax: $("#" + $scope.memoryRateTo.id).widget().getValue() || 100
                        };
                        var cpuFree = $("#" + $scope.cpuFreeTextbox.id).widget().getValue();
                        var memoryFree = $("#" + $scope.memoryFreeTextbox.id).widget().getValue();
                        if (cpuFree) {
                            listByCondition["cpu" + $("#" + $scope.cpuFreeSelector.id).widget().getSelectedId()] = cpuFree;
                        }
                        if (memoryFree) {
                            listByCondition["mem" + $("#" + $scope.memoryFreeSelector.id).widget().getSelectedId()] = memoryFree;
                        }
                        params.canMigrateHosts.listByCondition = listByCondition;
                    }
                    else {
                        params.canMigrateHosts.limit = destPage.limit;
                        params.canMigrateHosts.start = destPage.start;
                        //如果未初始化过
                        if (!$scope.clusterSelector.values) {
                            getClusters();
                            return;
                        }
                        else {
                            var listByTarget = {
                                clusterId: $("#" + $scope.clusterSelector.id).widget().getSelectedId(),
                                "hostName": $("#" + $scope.searchHostBox.id).widget().getValue()
                            };
                            params.canMigrateHosts.listByTarget = listByTarget;
                        }
                    }
                    getHostData4FC(params);
                }

                function getHostData4FC(params) {
                    var deferred = camel.post({
                        "url": "/goku/rest/v1.5/irm/1/hosts/action",
                        "params": JSON.stringify(params),
                        "userId": user.id,
                        "timeout": 120000
                    });
                    deferred.success(function (data) {
                        var hosts = data && data.canMigrateHosts && data.canMigrateHosts.hosts || [];
                        var total = data && data.canMigrateHosts && data.canMigrateHosts.total || hosts.length;
                        for (var i = 0; i < hosts.length; i++) {
                            hosts[i].runtimeState = hosts[i].runtimeStatus;
                        }
                        $scope.$apply(function () {
                            if ($scope.targetHostShow.condition) {
                                $scope.condHostTable.totalRecords = total;
                                $scope.condHostTable.data = hosts;
                            }
                            else {
                                $scope.destHostTable.totalRecords = total;
                                $scope.destHostTable.data = hosts;
                            }
                        });
                        refreshMigrateBtnStatus();
                    });
                }

                //按条件主机迁移页面
                var symbols = [
                    {
                        "selectId": "BiggerThan",
                        "label": ">",
                        "checked": true
                    },
                    {
                        "selectId": "EqualsTo",
                        "label": "="
                    },
                    {
                        "selectId": "LessThan",
                        "label": "<"
                    },
                    {
                        "selectId": "NoLessThan",
                        "label": ">="
                    },
                    {
                        "selectId": "NoBiggerThan",
                        "label": "<="
                    }
                ];
                $scope.condCluster = {
                    "id": "condClusterSelector",
                    "label": $scope.i18n.virtual_term_cluster_label + ":",
                    "width": "155",
                    "values": null,
                    "change": function () {
                    }
                };
                $scope.cpuRateFrom = {
                    "label": $scope.i18n.perform_term_CPUusageRate_label + "(%):",
                    "id": "cpuRateFrom",
                    "extendFunction": ["rateCheck"],
                    "validate": "rateCheck(cpuRateFrom):" + validator.i18nReplace($scope.i18n.common_term_rangeInteger_valid, {"1": 0, "2": 100})
                };
                $scope.cpuRateTo = {
                    "id": "cpuRateTo",
                    "extendFunction": ["rateCheck", "cpuRateCompare"],
                    "validate": "rateCheck(cpuRateTo):" + validator.i18nReplace($scope.i18n.common_term_rangeInteger_valid, {"1": 0, "2": 100}) +
                        ";cpuRateCompare:" + $scope.i18n.common_term_endGreaterStart_valid
                };
                $scope.memoryRateFrom = {
                    "label": $scope.i18n.perform_term_memUsageRate_label + "(%):",
                    "id": "memoryRateFrom",
                    "extendFunction": ["rateCheck"],
                    "validate": "rateCheck(memoryRateFrom):" + validator.i18nReplace($scope.i18n.common_term_rangeInteger_valid, {"1": 0, "2": 100})
                };
                $scope.memoryRateTo = {
                    "id": "memoryRateTo",
                    "extendFunction": ["rateCheck", "memoryRateCompare"],
                    "validate": "rateCheck(memoryRateTo):" + validator.i18nReplace($scope.i18n.common_term_rangeInteger_valid, {"1": 0, "2": 100}) +
                        ";memoryRateCompare:" + $scope.i18n.common_term_endGreaterStart_valid
                };
                $scope.cpuFreeSelector = {
                    "label": $scope.i18n.vm_term_VMavailableCPUMHz_label + ":",
                    "id": "cpuFreeSelector",
                    "values": symbols
                };
                $scope.cpuFreeTextbox = {
                    "id": "cpuFreeTextbox",
                    "extendFunction": ["freeCheck"],
                    "validate": "freeCheck(cpuFreeTextbox):" + $scope.i18n.common_term_PositiveIntegers_valid
                };
                $scope.memoryFreeSelector = {
                    "label": $scope.i18n.vm_term_VMavailableMemMB_label + ":",
                    "id": "memoryFreeSelector",
                    "values": symbols
                };
                $scope.memoryFreeTextbox = {
                    "id": "memoryFreeTextbox",
                    "extendFunction": ["freeCheck"],
                    "validate": "freeCheck(memoryFreeTextbox):" + $scope.i18n.common_term_PositiveIntegers_valid
                };
                $scope.condSearchButton = {
                    "id": "condSearchButton",
                    "text": $scope.i18n.common_term_search_button,
                    "click": function () {
                        getHostData();
                    }
                };
                UnifyValid.rateCheck = function (id) {
                    var value = $("#" + id).widget().getValue();
                    if (!value) {
                        return true;
                    }
                    var f = parseFloat(value);
                    if (!(!isNaN(f) && f.toString() == value && Math.round(f) == f)) {
                        return false;
                    }
                    return f >= 0 && f <= 100;
                };
                UnifyValid.cpuRateCompare = function () {
                    var cpuRateFrom = $("#" + $scope.cpuRateFrom.id).widget().getValue() || 0;
                    var cpuRateTo = $("#" + $scope.cpuRateTo.id).widget().getValue() || 100;
                    if (cpuRateFrom <= cpuRateTo) {
                        return true;
                    }
                    return false;
                };
                UnifyValid.memoryRateCompare = function () {
                    var memoryRateFrom = $("#" + $scope.memoryRateFrom.id).widget().getValue() || 0;
                    var memoryRateTo = $("#" + $scope.cpuRateTo.id).widget().getValue() || 100;
                    if (memoryRateFrom <= memoryRateTo) {
                        return true;
                    }
                    return false;
                };
                UnifyValid.freeCheck = function (id) {
                    var value = $("#" + id).widget().getValue();
                    if (!value) {
                        return true;
                    }
                    var f = parseFloat(value);
                    if (!(!isNaN(f) && f.toString() == value && Math.round(f) == f)) {
                        return false;
                    }
                    return f >= 0;
                };
                //按条件迁移主机列表
                var condPage = {
                    "start": 0,
                    "limit": 10
                };
                $scope.condHostTable = {
                    "id": "condHostTableId",
                    "data": null,
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
                            "sTitle": $scope.i18n.perform_term_CPUusageRate_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.cpuUsageRate);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.vm_term_VMavailableCPUMHz_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.cpuSpeed);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.perform_term_memUsageRate_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.memUsageRate);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.vm_term_VMavailableMemMB_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.memorySizeGB);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.runtimeState);
                            },
                            "bSortable": false
                        }
                    ],
                    "callback": function (pageInfo) {
                        condPage.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                        getHostData();
                    },
                    "changeSelect": function (pageInfo) {
                        condPage.start = 0;
                        $scope.condHostTable.curPage = {
                            "pageIndex": 1
                        };
                        condPage.limit = pageInfo.displayLength;
                        $scope.condHostTable.displayLength = pageInfo.displayLength;
                        getHostData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(6)', nRow).html(HOST_RUN_STATUS[aData.runtimeState]);

                        // CPU使用率进度条
                        var options = {
                            "width": "70",
                            "height": "18",
                            "label-position": "right"
                        };
                        var progressbar = new Progressbar(options);
                        $('td:eq(2)', nRow).html(progressbar.getDom());
                        progressbar.opProgress(aData.cpuUsageRate);

                        //内存使用率进度条
                        var options = {
                            "width": "70",
                            "height": "18",
                            "label-position": "right"
                        };
                        var progressbar = new Progressbar(options);
                        $('td:eq(4)', nRow).html(progressbar.getDom());
                        progressbar.opProgress(aData.memUsageRate);

                        //单选框
                        var options = {
                            "id": "condHostRadio_" + iDataIndex,
                            "checked": false,
                            "disable": aData.maintenanceStatus,
                            "change": function () {
                                var index = 0;
                                while ($("#condHostRadio_" + index).widget()) {
                                    if (index != iDataIndex) {
                                        $("#condHostRadio_" + index).widget().option("checked", false);
                                    }
                                    index++;
                                }
                                refreshMigrateBtnStatus();
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());
                    }
                };

                /*
                 存储
                 */
                //存储迁移单选组
                $scope.storeRadioGroup = {
                    "id": "migrateStoreRadioGroup",
                    "values": [
                        {
                            "key": "store",
                            "text": $scope.i18n.vm_vm_migrate_para_type_option_allStor_value,
                            "checked": true,
                            "disabled": false
                        },
                        {
                            "key": "disk",
                            "text": $scope.i18n.vm_vm_migrate_para_type_option_disk_value,
                            "checked": false,
                            "disabled": false
                        }
                    ],
                    "layout": "horizon",
                    "change": function () {
                        $scope.storeBaseShow.store = $("#" + $scope.storeRadioGroup.id).widget().opChecked("store");
                        $scope.storeBaseShow.disk = $("#" + $scope.storeRadioGroup.id).widget().opChecked("disk");
                        refreshMigrateBtnStatus();
                    }
                };
                $scope.storeBaseShow = {
                    "store": true,
                    "disk": false
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

                //迁移存储页面
                //目标存储列表
                $scope.storeTable = {
                    "id": "targetStoreTable",
                    "data": [],
                    "caption": "",
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
                        $('td:eq(1)', nRow).addTitle();
                        $('td:eq(2)', nRow).addTitle();
                        $('td:eq(3)', nRow).addTitle();
                        $('td:eq(4)', nRow).addTitle();

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
                $scope.storeSpeedRadio = {
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
                    "data": getDisks(),
                    "caption": "",
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "enablePagination": false,
                    "lengthMenu": [10, 20, 50],
                    "curPage": {
                    },
                    "columns": [
                        {
                            "sTitle": $scope.i18n.common_term_vm_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vmName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_diskName_label,
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
                        $('td:eq(0)', nRow).addTitle();
                        $('td:eq(1)', nRow).addTitle();

                        $('td:eq(2)', nRow).html(migrateCommon.diskType[aData.type]);
                        var support = aData.supportMigrate === true ? $scope.i18n.common_term_support_value : "";
                        support = aData.supportMigrate === false ? $scope.i18n.common_term_notSupport_value : support;
                        $('td:eq(3)', nRow).html(support);
                        $('td:eq(5)', nRow).html(migrateCommon.allocTypes[aData.sourceMode]);

                        //目的模式下拉框
                        var options = {
                            "id": "modeSelect_" + iDataIndex,
                            "width": "100",
                            "disable":true,
                            "values": []
                        };
                        var targetDS = getTargetDS();
                        if (targetDS != null) {
                            var params = {
                                vmStatus: aData.vmStatus,
                                sourceMode: aData.sourceMode,
                                sourceType: aData.storageType,
                                targetType: targetDS.type
                            };
                            var modes = [];
                            for (var i = 0; i < aData.targetMode.length; i++) {
                                var mm = {
                                    selectId: aData.targetMode[i],
                                    label: migrateCommon.allocTypes[aData.targetMode[i]]
                                };
                                if (i == 0) {
                                    mm.checked = true;
                                }
                                modes.push(mm);
                            }
                            options.values = modes;
                            options.disable = aData.supportMigrate !== true;
                        }

                        var select = new Select(options);
                        $('td:eq(6)', nRow).html(select.getDom());
                    }
                };
                //按磁盘迁移页面
                //待迁移磁盘列表
                $scope.diskTable = {
                    "id": "selectDiskTable",
                    "data": getDisks(),
                    "caption": "",
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "enablePagination": false,
                    "lengthMenu": [10, 20, 50],
                    "curPage": {
                    },
                    "columns": [
                        {
                            "sTitle": $scope.i18n.common_term_vm_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vmName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_disk_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_capacityGB_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.capacityGB);
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
                            "sTitle": $scope.i18n.vm_term_sourceStor_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.dataStoreName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.vm_term_targetStor_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.targetDataStore);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.vm_term_chooseTargetStor_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.selectDataStore);
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
                    "callback": function (pageInfo) {
                    },
                    "changeSelect": function (pageInfo) {
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(0)', nRow).addTitle();
                        $('td:eq(1)', nRow).addTitle();

                        $('td:eq(3)', nRow).html(migrateCommon.allocTypes[aData.sourceMode]);

                        //选择存储链接
                        var link = $compile($("<a href='javascript:void(0)' ng-click='selectStore()'>" + $scope.i18n.common_term_choose_label + "</a>"));
                        var scope = $scope.$new(false);
                        scope.selectStore = function () {
                            if (aData.storageType === 'LUN') {
                                var options = {
                                    type: "error",
                                    content: $scope.i18n.org_disk_migrate_info_notSupport_msg,
                                    height: "100px",
                                    width: "250px"
                                };
                                var msg = new Message(options);
                                msg.show();
                                return;
                            }
                            var winData = {};
                            var newWindow = new Window({
                                "winId": "selectStoreWindow",
                                "title": $scope.i18n.vm_term_chooseStor_label,
                                "content-type": "url",
                                "data": winData,
                                "name": aData.name,
                                "clusterId": clusterId,
                                "diskId": aData.volumeId,
                                "migrationModel": $("#migrateSpeedRadio").widget().opChecked("checked"),
                                "buttons": null,
                                "content": "app/business/resources/views/hypervisor/vm/migrateSelectStore.html",
                                "height": 500,
                                "width": 680,
                                "close": function () {
                                    try {
                                        $("td:eq(5)", nRow).html(winData.datastoreName);
                                        pushTargetDsId(aData.volumeId, winData.datastoreId);
                                        if (winData.type) {
                                            //目的模式下拉框
                                            var options = {
                                                "id": "modeSelect2_" + iDataIndex,
                                                "width": "100",
                                                "values": []
                                            };
                                            var params = {
                                                vmStatus: aData.vmStatus,
                                                sourceMode: aData.sourceMode,
                                                sourceType: aData.storageType,
                                                targetType: winData.type
                                            };
                                            var modes = [];
                                            for (var i = 0; i < winData.targetMode.length; i++) {
                                                var mm = {
                                                    selectId: winData.targetMode[i],
                                                    label: migrateCommon.allocTypes[winData.targetMode[i]]
                                                };
                                                if (i === 0) {
                                                    mm.checked = true;
                                                }
                                                modes.push(mm);
                                            }
                                            options.values = modes;
                                            var select = new Select(options);
                                            $('td:eq(7)', nRow).html(select.getDom());
                                            refreshMigrateBtnStatus();
                                        }
                                    } catch (e) {
                                    }

                                }
                            });
                            newWindow.show();
                        };
                        var node = link(scope);
                        $("td:eq(6)", nRow).html(node);
                    }
                };

                function pushTargetDsId(volumeId, datastoreId) {
                    for (var i = 0; i < $scope.DISKS_DATA.length; i++) {
                        var obj = $scope.DISKS_DATA[i];
                        if (obj.volumeId === volumeId) {
                            obj.targetDataStoreId = datastoreId;
                            break;
                        }
                    }
                }

                //上一步按钮
                $scope.targetPreButton = {
                    "id": "migrateTargetPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.migrateStep.id).widget().pre();
                        $scope.stepShow.step2 = false;
                        $scope.stepShow.step1 = true;
                    }
                };
                //迁移按钮
                $scope.targetOkButton = {
                    "id": "migrateTargetOkButton",
                    "text": $scope.i18n.vm_term_Migrate_button,
                    "disable": true,
                    "click": function () {
                        var winDesc = $scope.i18n.resource_stor_migrate_info_confirm_msg;
                        if ($scope.methodShow.host) {
                            winDesc = $scope.i18n.vm_vm_migrate_info_confirm_msg;
                        }
                        var options = {
                            type: "confirm",
                            content: winDesc,
                            height: "auto",
                            width: "350px",
                            resizable: true,
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    handler: function (event) {
                                        if ($scope.methodShow.host) {
                                            migrateHost();
                                        } else {
                                            migrateDisk();
                                        }
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
                $scope.targetCancelButton = {
                    "id": "migrateTargetCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        history.back();
                    }
                };

                /************存儲***************/
                    //获取待迁移的磁盘
                function getDisks() {
                    var vms = $scope.SELECTED_VMS;
                    if (vms && vms.length > 0) {
                        var results = [];
                        for (var i = 0; i < vms.length; i++) {
                            if (vms[i].vmConfig && vms[i].vmConfig.disks) {
                                for (var k = 0; k < vms[i].vmConfig.disks.length; k++) {
                                    var disk = vms[i].vmConfig.disks[k];
                                    var result = {};
                                    result.volumeId = disk.volumeId;
                                    result.name = disk.diskName;
                                    result.capacityGB = disk.quantityGB;
                                    result.usedGB = null;
                                    result.vmId = vms[i].id;
                                    result.sourceMode = disk.allocType;
                                    result.type = disk.type;
                                    result.dataStoreName = disk.storageName;
                                    result.storageType = disk.storageType;
                                    result.targetDataStoreId = null;
                                    result.vmName = vms[i].name;
                                    result.vmStatus = vms[i].status;
                                    results.push(result);
                                }
                            }
                        }
                        $scope.DISKS_DATA = results;
                        return results;
                    }
                }

                //获取目的存储
                function getStores() {
                    var params = {
                        "detail": 0,
                        "migrateOption": true,
                        "scopeType": "CLUSTER",
                        "scopeObjectId": hypervisorId + '$' + clusterUrn,
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
                        refreshMigrateBtnStatus();
                    });
                    deferred.fail(function (data) {
                    });
                }

                function canMigrate(storageId, iDataIndex) {
                    var disks = getDisks();
                    var volumes = [];
                    for (var i = 0; i < disks.length; i++) {
                        volumes.push({
                            volumeId: disks[i].volumeId,
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
                        var canMigrate = data && data.canMigrate || {};
                        var volumes = canMigrate.volumes || [];
                        var vmDisks = getDisks();
                        var canMigrateNum = 0;
                        for (var i = 0; i < vmDisks.length; i++) {
                            for (var j = 0; j < volumes.length; j++) {
                                if (vmDisks[i].volumeId === volumes[j].volumeId) {
                                    vmDisks[i].supportMigrate = volumes[j].result;
                                    vmDisks[i].errMessage = irmException[volumes[j].errCode] && irmException[volumes[j].errCode].cause || volumes[j].errMessage;
                                    vmDisks[i].targetMode = [];
                                    if(volumes[j].normalVolume){
                                        vmDisks[i].targetMode.push("thick");
                                    }
                                    if(volumes[j].thinVolume){
                                        vmDisks[i].targetMode.push("thin");
                                    }
                                    if(volumes[j].delayVolue){
                                        vmDisks[i].targetMode.push("thickformat");
                                    }
                                    if(volumes[j].result){
                                        canMigrateNum ++;
                                    }
                                    break;
                                }
                            }
                        }
                        $scope.$apply(function () {
                            $scope.modeTable.data = vmDisks;
                        });
                        if (!canMigrateNum) {
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
                        refreshMigrateBtnStatus();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function migrateHost() {
                    var params = {
                        migrate: {
                            vmIds: getVMIds(),
                            hostId: getTargetHostId(),
                            isBindHost: false
                        }
                    };
                    var deferred = camel.post({
                        "url": "/goku/rest/v1.5/irm/1/vms/action",
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        taskMessage();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
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
                        taskMessage();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function taskMessage() {
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
                }

                function contractParams() {
                    var disks = [];
                    var target = {};
                    var migrateVolumes = [];
                    //存储整体迁移
                    if ($scope.storeBaseShow.store) {
                        var resourceDSTable = $("#" + $scope.diskTable.id).widget();
                        var disks = resourceDSTable.option("data");
                        target = getTargetDS();
                        if (disks) {
                            for (var i = 0; i < disks.length; i++) {
                                var targetMode = getTargetModeType(disks[i].volumeId);
                                var mv = {
                                    volId: disks[i].volumeId,
                                    volCapacity: disks[i].capacityGB,
                                    volProvisionSize: disks[i].usedGB,
                                    dataStoreId: (target) ? target.id : null,
                                    vmId: disks[i].vmId,
                                    vmName: disks[i].vmName,
                                    volName: disks[i].name,
                                    sourceDataStoreName: disks[i].dataStoreName,
                                    type: targetMode,
                                    migrateType: 1
                                };
                                migrateVolumes.push(mv);
                            }
                        }
                    }
                    //磁盘迁移
                    else {
                        disks = $scope.DISKS_DATA;
                        if (disks) {
                            for (var i = 0; i < disks.length; i++) {
                                if (disks[i].targetDataStoreId == null) {
                                    continue;
                                }
                                var targetMode = getTargetModeType2(disks[i].volumeId);
                                var mv = {
                                    volId: disks[i].volumeId,
                                    volCapacity: disks[i].capacityGB,
                                    volProvisionSize: disks[i].usedGB,
                                    dataStoreId: disks[i].targetDataStoreId,
                                    vmId: disks[i].vmId,
                                    vmName: disks[i].vmName,
                                    volName: disks[i].name,
                                    sourceDataStoreName: disks[i].dataStoreName,
                                    type: targetMode,
                                    migrateType: 1
                                };
                                migrateVolumes.push(mv);
                            }
                        }
                    }
                    return migrateVolumes;
                }

                //整体迁移的目前模式
                function getTargetModeType(volumeId) {
                    var modeTableTable = $("#" + $scope.modeTable.id).widget();
                    if (modeTableTable) {
                        var modeTableData = modeTableTable.option("data");
                        if (modeTableData) {
                            for (var i = 0; i < modeTableData.length; i++) {
                                if (modeTableData[i].volumeId == volumeId) {
                                    var mode = $("#modeSelect_" + i).widget().getSelectedId();
                                    return mode;
                                }
                            }
                        }
                    }
                    return null;
                }

                function getTargetModeType2(volumeId) {
                    var modeTableTable = $("#" + $scope.diskTable.id).widget();
                    if (modeTableTable) {
                        var modeTableData = modeTableTable.option("data");
                        if (modeTableData) {
                            for (var i = 0; i < modeTableData.length; i++) {
                                if (modeTableData[i].volumeId == volumeId) {
                                    var mode = $("#modeSelect2_" + i).widget().getSelectedId();
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
                    if (targetDSTable) {
                        var data = targetDSTable.option("data");
                        var index = 0;
                        while ($("#storeRadio_" + index).widget()) {
                            var checked = $("#storeRadio_" + index).widget().option("checked");
                            if (checked) {
                                return data[index];
                            }
                            index++;
                        }
                    }
                    return null;
                }

                function getVMIds() {
                    if ($scope.SELECTED_VMS) {
                        var ids = [];
                        for (var i = 0; i < $scope.SELECTED_VMS.length; i++) {
                            ids.push($scope.SELECTED_VMS[i].id);
                        }
                        return ids;
                    }
                }

                function getTargetHostId() {
                    var tableData = null;
                    var radioStr = '';
                    if ($scope.targetHostShow.destination) {
                        var targetDSTable = $("#" + $scope.destHostTable.id).widget();
                        tableData = targetDSTable.option("data");
                        radioStr = 'destHostRadio_';
                    } else {
                        var targetDSTable = $("#" + $scope.condHostTable.id).widget();
                        tableData = targetDSTable.option("data");
                        radioStr = 'condHostRadio_';
                    }
                    var index = 0;
                    while ($("#" + radioStr + index).widget()) {
                        var checked = $("#" + radioStr + index).widget().option("checked");
                        if (checked) {
                            return tableData[index].id;
                        }
                        index++;
                    }
                    return null;
                }

                //刷新迁移按钮状态
                function refreshMigrateBtnStatus() {
                    $("#" + $scope.targetOkButton.id).widget().option("disable", true);
                    if ($scope.methodShow.host) {
                        if (getTargetHostId() != null) {
                            $("#" + $scope.targetOkButton.id).widget().option("disable", false);
                        }
                    } else {
                        if ($scope.storeBaseShow.store) {
                            var vmDisk = $scope.modeTable.data || [];
                            var i = 0;
                            for (; i < vmDisk.length; i++) {
                                if (vmDisk[i].supportMigrate) {
                                    break;
                                }
                            }
                            if (i < vmDisk.length) {
                                $("#" + $scope.targetOkButton.id).widget().option("disable", false);
                            }
                        } else {
                            var disks = $scope.DISKS_DATA;
                            if (disks) {
                                for (var i = 0; i < disks.length; i++) {
                                    if (disks[i].targetDataStoreId != null) {
                                        $("#" + $scope.targetOkButton.id).widget().option("disable", false);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

            }];

        return migrateCtrl;
    }
);