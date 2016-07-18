/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Progressbar",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, Checkbox, Progressbar, Window, Message, Exception) {
    "use strict";

    var vmCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel", "$rootScope",
        function ($scope, $state, $stateParams, $compile, camel, $rootScope) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            var clusterId = $stateParams.clusterId;
            var clusterName = $stateParams.clusterName;
            var hypervisorName = $stateParams.hyperName;
            var clusterIndex = $stateParams.indexId;
            var hypervisorId = $stateParams.hyperId;
            var storeId = $stateParams.storeId;
            var hostId = $stateParams.hostId;
            $scope.vncRight = user.privilege.vm_term_vnc_button;
            $scope.createAble = user.privilege.common_term_create_button;
            $scope.basicOperable = user.privilege.role_role_add_option_basic_value;
            $scope.advanceOperable = user.privilege.role_role_add_option_advance_value;
            $scope.deleteAble = user.privilege.common_term_delete_button;
            $scope.exportAble = user.privilege.role_role_add_option_reportView_value;
            $scope.importAble = false;
            var selectedVm = [];
            var selectedVmData = [];
            $scope.curState = $state.current.name;

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
            var actions = {
                start: $scope.i18n.common_term_startup_button,
                reboot: $scope.i18n.common_term_restart_button,
                forceReboot: $scope.i18n.common_term_forciblyRestart_button,
                stop: $scope.i18n.common_term_turnOff_button,
                forceStop: $scope.i18n.common_term_forciblyShut_button,
                hibernate: $scope.i18n.common_term_hibernate_button,
                delete: $scope.i18n.common_term_delete_button,
                resumeRecyling: $scope.i18n.common_term_resumDel_button,
                modUpgradeMode: $scope.i18n.vm_term_modifyUpgradeMode_button,
                migrate: $scope.i18n.vm_term_Migrate_button
            };
            var searchTips = {
                "filterName": $scope.i18n.common_term_findName_prom,
                "filterVmId": $scope.i18n.vm_term_findVMID_prom,
                "filterVmtag": $scope.i18n.cloud_term_findTag_prom,
                filterIp: $scope.i18n.vpc_term_findIP_prom,
                filterMac: $scope.i18n.virtual_term_findMACaddr_prom
            };
            $scope.help = {
                show: false
            };
            //查询信息
            var searchInfo = {
                "status": null,
                "condition": "filterName",
                "value": null,
                "start": 0,
                "limit": 10
            };
            //状态过滤框
            $scope.statusSelector = {
                "id": "searchStatusSelector",
                "width": "135",
                "values": [
                    {
                        "selectId": "all",
                        "label": $scope.i18n.common_term_allStatus_value,
                        "checked": true
                    },
                    {
                        "selectId": "running",
                        "label": $scope.i18n.common_term_running_value
                    },
                    {
                        "selectId": "stopped",
                        "label": $scope.i18n.common_term_stoped_value
                    },
                    {
                        "selectId": "hibernated",
                        "label": $scope.i18n.common_term_hibernated_value
                    },
                    {
                        "selectId": "creating",
                        "label": $scope.i18n.common_term_creating_value
                    },
                    {
                        "selectId": "starting",
                        "label": $scope.i18n.common_term_startuping_value
                    },
                    {
                        "selectId": "stopping",
                        "label": $scope.i18n.common_term_stoping_value
                    },
                    {
                        "selectId": "migrating",
                        "label": $scope.i18n.common_term_migrating_value
                    },
                    {
                        "selectId": "hibernating",
                        "label": $scope.i18n.common_term_hibernating_value
                    },
                    {
                        "selectId": "rebooting",
                        "label": $scope.i18n.common_term_restarting_value
                    },
                    {
                        "selectId": "recycling",
                        "label": $scope.i18n.common_term_reclaiming_value
                    },
                    {
                        "selectId": "fault_resuming",
                        "label": $scope.i18n.common_term_trouble_label
                    },
                    {
                        "selectId": "unknown",
                        "label": $scope.i18n.common_term_unknown_value
                    }
                ],
                "change": function () {
                    var status = $("#" + $scope.statusSelector.id).widget().getSelectedId();
                    searchInfo.status = status === "all" ? null : [status];
                    searchInfo.start = 0;
                    $scope.vmTable.curPage = {
                        "pageIndex": 1
                    };
                    getData();
                }
            };

            //搜索字段选择框
            $scope.searchSelector = {
                "id": "searchSelector",
                "width": "100",
                "values": [
                    {
                        "selectId": "filterName",
                        "label": $scope.i18n.common_term_name_label,
                        "checked": true
                    },
                    {
                        "selectId": "filterVmId",
                        "label": $scope.i18n.common_term_vmID_label
                    },
                    {
                        "selectId": "filterVmtag",
                        "label": $scope.i18n.cloud_term_tag_label
                    },
                    {
                        "selectId": "filterIp",
                        "label": $scope.i18n.common_term_IP_label
                    },
                    {
                        "selectId": "filterMac",
                        "label": $scope.i18n.common_term_MAC_label
                    }
                ],
                "change": function () {
                    searchInfo.condition = $("#" + $scope.searchSelector.id).widget().getSelectedId();
                    $("#" + $scope.searchBox.id).widget().option("placeholder", searchTips[searchInfo.condition]);
                    $("#" + $scope.searchBox.id).widget().setValue("");
                }
            };

            //模糊搜索框
            $scope.searchBox = {
                "id": "searchVmBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "search": function (searchString) {
                    searchInfo.start = 0;
                    $scope.vmTable.curPage = {
                        "pageIndex": 1
                    };
                    getData();
                }
            };
            $scope.refresh = function () {
                getData();
            };
            //导出列表按钮
            $scope.exportButton = {
                "id": "vmExportButton",
                "text": $scope.i18n.common_term_exportList_button,
                "click": function () {
                    if ($("#" + $scope.searchBox.id).widget()) {
                        searchInfo.value = $("#" + $scope.searchBox.id).widget().getValue();
                        searchInfo.value = searchInfo.value === "" ? null : searchInfo.value;
                    }
                    var newWindow = new Window({
                        "winId": "exportVmListWindow",
                        "title": $scope.i18n.common_term_exportList_button,
                        "params": {
                            "clusterId": clusterId,
                            "storeId": storeId,
                            "clusterIds": $scope.clusterIds,
                            "hostId": hostId,
                            "hyperId": hypervisorId,
                            "hyperName": hypervisorName,
                            "totalRecords": $scope.vmTable.totalRecords,
                            "limit": searchInfo.limit,
                            "searchInfo": searchInfo
                        },
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/vm/exportVmList.html",
                        "height": 220,
                        "width": 510,
                        "close": function () {
                        }
                    });
                    newWindow.show();
                }
            };
            //创建按钮
            $scope.createButton = {
                "id": "vmCreateButton",
                "text": $scope.i18n.common_term_create_button,
                "click": function () {
                    $state.go("resources.createVm", {
                        "action": "create", "from": $state.current.name, "clusterName": clusterName, "clusterId": clusterId,
                        "clusterIndex": clusterIndex, hyperId: hypervisorId
                    });
                }
            };
            //导入按钮
            $scope.importButton = {
                "id": "vmImportButton",
                "text": $scope.i18n.vm_term_importVM_button,
                "click": function () {
                    $state.go("resources.importVm", {
                        "from": $state.current.name, "clusterName": clusterName, "clusterId": clusterId,
                        "clusterIndex": clusterIndex, hypervisorId: hypervisorId
                    });
                }
            };
            //VNC按钮
            $scope.vncButton = {
                "id": "vmVncButton",
                "text": $scope.i18n.vm_term_vnc_button,
                "disable": true,
                "click": function () {
                    var winParam = {
                        "vmId":selectedVm[0]
                    };
                    var newWindow = new Window({
                        "winId": "ecsVmLoginSelectWinId",
                        "title":$scope.i18n.vm_vm_vncLogin_desc_label || "请选择VNC登录方式",
                        "winParam":winParam,
                        "content-type": "url",
                        "content": "app/business/vnc/vmLoginSelect.html",
                        "resizable": true,
                        "maximizable":false,
                        "minimizable": false,
                        "buttons": null,
                        "height": $rootScope.i18n.locale === "en" ? 300 : 270,
                        "width": 510,
                        "close": function () {
                        }
                    });
                    newWindow.show();
                }
            };

            $scope.reboot = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("reboot")) {
                    return;
                }
                showMessage($scope.i18n.common_term_restartConfirm_msg, function () {
                    lifeCycle("reboot", null);
                });
            };
            $scope.forceReboot = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("forceReboot")) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_forciblyRestart_info_confirm_msg, function () {
                    lifeCycle("reboot", "force");
                });
            };
            $scope.start = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("start")) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_startup_info_confirm_msg, function () {
                    lifeCycle("start", null);
                });
            };
            $scope.stop = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("stop")) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_shut_info_confirm_msg, function () {
                    lifeCycle("stop", null);
                });
            };
            $scope.forceStop = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("forceStop")) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_forciblyShut_info_confirm_msg, function () {
                    lifeCycle("stop", "force");
                });
            };
            $scope.hibernate = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("hibernate")) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_hibernate_info_confirm_msg, function () {
                    lifeCycle("hibernate", null);
                });
            };
            $scope.migrate = function () {
                //某些状态写不能迁移
                //不同集群下不能迁移
                getSelectedVm();
                $rootScope.selectedVmData = selectedVmData;
                if (!$rootScope.selectedVmData || $rootScope.selectedVmData.length < 1) {
                    return;
                }
                if (!checkAction("migrate")) {
                    return;
                }
                var firstClusterId = null;
                var firstClusterUrn = null;
                var vmType = null;
                for (var i = 0; i < $rootScope.selectedVmData.length; i++) {
                    var vms = $rootScope.selectedVmData;
                    if (i === 0) {
                        firstClusterId = vms[i].clusterId;
                        firstClusterUrn = vms[i].clusterUrn;
                        vmType = vms[i].vmType;
                    }
                }
                var vmHypervisorId = $rootScope.selectedVmData[0].hypervisorId;
                $state.go("resources.migrateVm", {"vmType": vmType, 'clusterUrn': firstClusterUrn, 'clusterId': firstClusterId, 'hypervisorId': vmHypervisorId});
            };
            $scope.transfer = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("transfer")) {
                    return;
                }
                var newWindow = new Window({
                    "winId": "transferVmWindow",
                    "title": $scope.i18n.common_term_allocate_button,
                    "selectedVm": selectedVm,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vm/transfer.html",
                    "height": 500,
                    "width": 700,
                    "close": function () {
                        getData();
                    }
                });
                newWindow.show();
            };
            $scope.editTag = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("editTag")) {
                    return;
                }
                var newWindow = new Window({
                    "winId": "editVmTagWindow",
                    "title": $scope.i18n.common_term_setTag_button,
                    "selectedVm": selectedVm,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vm/editTag.html",
                    "height": 180,
                    "width": 670,
                    "close": function () {
                        getData();
                    }
                });
                newWindow.show();
            };
            $scope.modUpgradeMode = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("modUpgradeMode")) {
                    return;
                }
                if (!checkHyperType("modUpgradeMode")) {
                    return;
                }
                var newWindow = new Window({
                    "winId": "setUpdateMethodWindow",
                    "title": $scope.i18n.vm_term_modifyUpgradeMode_button,
                    "selectedVm": selectedVm,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vm/setUpdateMethod.html",
                    "height": 200,
                    "width": 700,
                    "close": function () {
                        getData();
                    }
                });
                newWindow.show();
            };
            $scope.deleteVm = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("delete")) {
                    return;
                }
                var newWindow = new Window({
                    "winId": "deleteVmWindow",
                    "title": $scope.i18n.common_term_confirm_label,
                    "content-type": "url",
                    "selectedVm": selectedVm,
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vm/deleteVm.html",
                    "height": 300,
                    "width": 600,
                    "close": function () {
                        getData();
                    }
                });
                newWindow.show();
            };
            $scope.resumeRecyling = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("resumeRecyling")) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_resumRecycleVM_info_confirm_msg, function () {
                    resumeRecyling(selectedVm);
                });
            };
            $scope.incorporate = function () {
                getSelectedVm();
                if (!selectedVm || selectedVm.length === 0) {
                    return;
                }
                if (!checkAction("incorporate")) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_incorporate_info_confirm_msg, function () {
                    incorporate(selectedVm);
                });
            };

            //vm列表
            $scope.vmTable = {
                "id": "hypervisorVmTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "enablePagination": true,
                "lengthChange": true,
                "totalRecords": 0,
                "displayLength": 10,
                "lengthMenu": [10, 20, 30],
                "showDetails": {
                    "colIndex": 1,
                    "domPendType": "append"
                },
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth": 40
                    },
                    {
                        "sTitle": "",
                        "mData": "",
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
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmVisibleId);
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
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_CPUusageRate_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.cpuUsageRate);
                        },
                        "bSortable": false,
                        "sWidth": "150"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_memUsageRate_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.memUsageRate);
                        },
                        "bSortable": false,
                        "sWidth": "150"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_diskUsageRate_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.diskUsageRate);
                        },
                        "bSortable": false,
                        "sWidth": "150"
                    }
                ],
                "callback": function (pageInfo) {
                    searchInfo.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getData();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.vmTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.vmTable.displayLength = pageInfo.displayLength;
                    getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                    $(nRow).attr("vmId", $.encoder.encodeForHTML("" + aData.id));
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    //复选框
                    var options = {
                        "id": "vmCheckbox_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            getSelectedVm();
                            $scope.$apply(function(){
                                $scope.hasSelectedVm = selectedVm.length > 0;
                            });
                            if ($("#" + $scope.vncButton.id).widget()) {
                                $("#" + $scope.vncButton.id).widget().option("disable", selectedVm.length !== 1 ||
                                    (selectedVmData[0].status !== "running" && selectedVmData[0].status !== "hibernating"));
                            }
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());
                    $('td:eq(1)', nRow).html("");

                    //虚拟机详情链接
                    var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>" + $.encoder.encodeForHTML(aData.name) + "</a>"));
                    var scope = $scope.$new(false);
                    scope.name = aData.name;
                    scope.detail = function () {
                        $state.go("resources.vmInfo.summary", {
                            "name": scope.name, "from": $state.current.name,
                            "vmId": aData.id, "isVsa": (aData.vsaVmType && aData.vsaVmType !== "") || !!aData.vsamVm || aData.group === "VRMGroup", "vmType": aData.vmType});
                    };
                    var node = link(scope);
                    $("td:eq(2)", nRow).html(node);
//                CPU使用率进度条
                    var options = {
                        "width": "70",
                        "height": "9",
                        "label-position": "right",
                        "value": (aData.cpuUsageRate && aData.cpuUsageRate !== "") ? aData.cpuUsageRate : "0.00"
                    };
                    var progressbar = new Progressbar(options);
                    $('td:eq(6)', nRow).html(progressbar.getDom());

//                内存使用率进度条
                    var options = {
                        "width": "70",
                        "height": "9",
                        "label-position": "right",
                        "value": (aData.memUsageRate && aData.memUsageRate !== "") ? aData.memUsageRate : "0.00"
                    };
                    var progressbar = new Progressbar(options);
                    $('td:eq(7)', nRow).html(progressbar.getDom());

//                磁盘使用率进度条
                    var options = {
                        "width": "70",
                        "height": "9",
                        "label-position": "right",
                        "value": (aData.diskUsageRate && aData.diskUsageRate !== "") ? aData.diskUsageRate : "0.00"
                    };
                    var progressbar = new Progressbar(options);
                    $('td:eq(8)', nRow).html(progressbar.getDom());
                }
            };
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
                var content;
                for (var i = 0; i < selectedVm.length; i++) {
                    if (selectedVmData[i].vsaVmType && selectedVmData[i].vsaVmType !== "") {
                        warnVmId = selectedVmData[i].id;
                        content = $scope.i18n.vm_term_handleServiceVM_valid;
                        break;
                    }
                    else if (selectedVmData[i].vsamVm || selectedVmData[i].group === "VRMGroup") {
                        warnVmId = selectedVmData[i].id;
                        content = $scope.i18n.vm_term_handleMgmtVM_valid;
                        break;
                    }
                    else if (action === "start") {
                        if (!(selectedVmData[i].status === "stopped" || selectedVmData[i].status === "hibernated")) {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                    else if (action === "reboot") {
                        if (selectedVmData[i].status !== "running") {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                    else if (action === "forceReboot") {
                        if (!(selectedVmData[i].status === "running" || selectedVmData[i].status === "rebooting")) {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                    else if (action === "stop") {
                        if (selectedVmData[i].status !== "running") {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                    else if (action === "forceStop") {
                        if (!(selectedVmData[i].status === "running" || selectedVmData[i].status === "stopping" ||
                            selectedVmData[i].status === "rebooting" || selectedVmData[i].status === "pause" ||
                            selectedVmData[i].status === "fault_resuming" || selectedVmData[i].status === "hibernated" || selectedVmData[i].status === "unknown")) {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                    else if (action === "hibernate") {
                        if (selectedVmData[i].status !== "running") {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                    else if (action === "delete") {
                        if (!(selectedVmData[i].status === "running" || selectedVmData[i].status === "stopped" ||
                            selectedVmData[i].status === "hibernated" || selectedVmData[i].status === "recycling" || selectedVmData[i].status === "unknown")) {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                    else if (action === "modUpgradeMode") {
                        if (!(selectedVmData[i].status === "running" || selectedVmData[i].status === "stopped")) {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                    else if (action === "resumeRecyling") {
                        if (selectedVmData[i].status !== "recycling") {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    } else if (action === "migrate") {
                        if (!(selectedVmData[i].status === "running" || selectedVmData[i].status === "stopped")) {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }else if (action === "transfer") {
                        if (selectedVmData[i].status === "REPAIRING") {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }else if (action === "incorporate") {
                        if (selectedVmData[i].status === "REPAIRING") {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                }
                if (warnVmId) {
                    var options = {
                        type: "error",
                        content: $scope.i18n.sprintf(content ? content : $scope.i18n.vm_term_notRunOnCurrentStatusVM_valid, warnVmId),
                        height: "150px",
                        width: "550px"
                    };
                    var msg = new Message(options);
                    msg.show();
                    return false;
                }
                return true;
            }

            function checkHyperType(action) {
                var warnVmId;
                for (var i = 0; i < selectedVm.length; i++) {
                    if (action === "modUpgradeMode") {
                        if (selectedVmData[i].vmType === "vmware") {
                            warnVmId = selectedVmData[i].id;
                            break;
                        }
                    }
                }
                if (warnVmId) {
                    var options = {
                        type: "error",
                        content: $scope.i18n.sprintf($scope.i18n.vm_term_notRunOnHyperStatusVM_valid, warnVmId),
                        height: "150px",
                        width: "550px"
                    };
                    var msg = new Message(options);
                    msg.show();
                    return false;
                }
                return true;
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
                                getData();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }

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
                                msg.destroy();
                                action();
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

            function lifeCycle(type, mode) {
                var params = {
                    "operate": {
                        "type": type,
                        "vmIds": selectedVm,
                        "vmOpMode": mode
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    goToTaskCenter();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getData() {
                if ($("#" + $scope.vncButton.id).widget()) {
                    $("#" + $scope.vncButton.id).widget().option("disable", true);
                }
                if ($("#" + $scope.searchBox.id).widget()) {
                    searchInfo.value = $("#" + $scope.searchBox.id).widget().getValue();
                    searchInfo.value = searchInfo.value === "" ? null : searchInfo.value;
                }
                var params = {
                    "detail": 2,
                    "filterStatus": searchInfo.status,
                    "filterIsTemplate": false,
                    "offset": searchInfo.start,
                    "limit": searchInfo.limit
                };
                params[searchInfo.condition] = searchInfo.value;
                if (clusterId) {
                    params.clusterId = clusterId;
                }
                else if (storeId) {
                    params.datastoreID = storeId;
                    params.filterClusterIds = $scope.clusterIds;
                }
                else if (hostId) {
                    params.hostId = hostId;
                }
                else if (hypervisorName) {
                    params.hypervisorId = hypervisorId;
                }
                else {
                    params.queryVmInsystem = true;
                    params.detail = 1;
                }
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/list",
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "timeout": 120000
                });
                deferred.success(function (data) {
                    var vms = data.vmInfoList || [];
                    for (var i = 0; i < vms.length; i++) {
                        vms[i].detail = {
                            contentType: "url",
                            content: "app/business/resources/views/hypervisor/vm/vmDetail.html"
                        };
                        vms[i].status = vms[i].repairStatus === "REPAIRING" ? "REPAIRING":vms[i].status;
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

                    var tableId = "#hypervisorVmTable";
                    if ($("#vmTableHeadCheckbox").widget()) {
                        $("#vmTableHeadCheckbox").widget().option("checked", false);
                    }
                    else {
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
                                getSelectedVm();
                                $scope.$apply(function(){
                                    $scope.hasSelectedVm = selectedVm.length > 0;
                                });
                                if ($("#" + $scope.vncButton.id).widget()) {
                                    $("#" + $scope.vncButton.id).widget().option("disable", selectedVm.length !== 1 ||
                                        (selectedVmData[0].status !== "running" && selectedVmData[0].status !== "hibernating"));
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $(tableId + " th:eq(0)").html(checkbox.getDom());
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getStore() {
                var params = {
                    "detail": "0",
                    "scopeType": "DATASTORE",
                    "scopeObjectId": storeId
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var store = data.datastoreInfos && data.datastoreInfos[0] || {};
                    $scope.clusterIds = [];
                    var clusters = store.attachedClusters || [];
                    for (var i = 0; i < clusters.length; i++) {
                        $scope.clusterIds.push(clusters[i].clusterId);
                    }
                    getData();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function resumeRecyling(vmIds) {
                var params = {
                    resumeRecyling: {
                        vmIds: vmIds
                    }
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    goToTaskCenter();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function incorporate(vmIds) {
                var params = {
                    incorporate: {
                        vmIds: vmIds
                    }
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    getData();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getHypervisor() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id: hypervisorId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {
                        $scope.importAble = data.hypervisor.type === "FusionCompute" && data.hypervisor.version === "1.5.0";
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            if (storeId) {
                getStore();
            }
            else {
                getData();
            }
            if ($scope.curState === "resources.clusterInfo.vm") {
                getHypervisor();
            }
        }];
    return vmCtrl;
});