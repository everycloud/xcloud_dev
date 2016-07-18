/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-widgets/Window",
    "app/services/competitionConfig"
],
    function ($, angular, httpService, Exception, Window,competition) {
        "use strict";

        var vmToDiskCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege["role_role_add_option_diskHandle_value.610000"];
            $scope.i18n = $("html").scope().i18n;
            $scope.storageIoControl = competition.storageIoControl;
            var $state = $("html").injector().get("$state");
            var allocTypes = {
                "thick": $scope.i18n.common_term_common_label,
                "thickformat": $scope.i18n.common_term_lazyZeroed_label,
                "thin": $scope.i18n.common_term_thinProv_label
            };
            var storeTypes = {
                "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
                "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
                "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
                "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
                "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
                "NAS":$scope.i18n.common_term_NAS_label
            };
            $scope.label = {
                allocType: $scope.i18n.common_term_setMode_label + ":",
                indepDisk: $scope.i18n.vm_disk_view_para_affectedBySnap_label + ":",
                persistentDisk: $scope.i18n.org_term_persistent_label + ":",
                mediaType: $scope.i18n.common_term_mediaType_label + ":",
                dataStore: $scope.i18n.common_term_storage_label + ":",
                vm:$scope.i18n.common_term_vm_label+":",
                pciType:$scope.i18n.common_term_busType_label+":",
                diskId:$scope.i18n.device_term_slotID_label+":",
                storageType:$scope.i18n.common_term_storageType_label+":",
                ioWeight:$scope.i18n.common_term_IOqouta_button+":",
                volumnId:$scope.i18n.common_term_diskID_label+":"
            };
            $scope.info = {};
            if ($("#storeDiskDiv").scope()) {
                $scope.isStoreDisk = true;
                $scope.isVdcDisk = false;
                $scope.isHardwareDisk = false;
                $scope.clusterIds = $("#storeDiskDiv").scope().clusterIds;
                $scope.datastoreId = $("#storeDiskDiv").scope().datastoreId;
            }
            else if($("#hardwareDiskDiv").scope()){
                $scope.isStoreDisk = false;
                $scope.isVdcDisk = false;
                $scope.isHardwareDisk = true;
            }
            else {
                $scope.isStoreDisk = false;
                $scope.isVdcDisk = true;
                $scope.isHardwareDisk = false;
            }
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
                unknown: $scope.i18n.common_term_unknown_value
            };
            $scope.refresh = function () {
                $scope.getVm($scope.volumnUrn, $scope.lineNum, $scope.diskType);
            };
            $scope.memberTable = {
                "id": "vmMemberTable_",
                "data": null,
                "enablePagination": false,
                "columns": [
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
                            return $.encoder.encodeForHTML(data.statusStr);
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
                        "sTitle": $scope.i18n.common_term_host_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hostName);
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();

//                    虚拟机详情链接
                    var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                    var vmScope = $scope.$new(false);
                    vmScope.name = aData.name;
                    vmScope.detail = function () {
                        var $state = $("html").injector().get("$state");
                        $state.go("resources.vmInfo.summary", {"name": vmScope.name, "from": $state.current.name, "vmId": aData.id});
                    };
                    var node = link(vmScope);
                    $("td:eq(0)", nRow).html(node);

                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='unbind()'>" + $scope.i18n.common_term_unbond_button + "</a>";

                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.unbind = function () {
                        var newWindow = new Window({
                            "winId": "unbindDiskWindow",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content-type": "url",
                            "vmId": aData.id,
                            "volumnId": $scope.volumnUrn,
                            "diskType": $scope.diskType,
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/disk/unbindDisk.html",
                            "height": 200,
                            "width": 300,
                            "close": function () {
                                $scope.getVm($scope.volumnUrn, $scope.lineNum, $scope.diskType);
                            }
                        });
                        newWindow.show();
                    };

                    var optNode = optLink(optScope);
                    $("td:eq(4)", nRow).html(optNode);
                }
            };
            $scope.getVm = function (volumnUrn, lineNum, diskType) {
                if (!$scope.isStoreDisk) {
                    return;
                }
                $scope.memberTable.id = "vmMemberTable_" + lineNum;
                $scope.volumnUrn = volumnUrn;
                $scope.lineNum = lineNum;
                $scope.diskType = diskType;
                var params = {
                    "detail": 2,
                    "volumnUrn": volumnUrn,
                    "filterClusterIds": $scope.clusterIds,
                    "datastoreID": $scope.datastoreId,
                    "offset": 0,
                    "limit": 100
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/list",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var vms = data.vmInfoList || [];
                    for (var i = 0; i < vms.length; i++) {
                        vms[i].statusStr = statuses[vms[i].status] || vms[i].status;
                    }
                    $scope.$apply(function () {
                        $scope.memberTable.data = vms;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
            $scope.viewDisk = function (diskInfo) {
                $scope.$apply(function () {
                    $scope.info.allocType = allocTypes[diskInfo.allocType] || "--";
                    $scope.info.indepDisk = diskInfo.indepDisk  === "true" ? $scope.i18n.common_term_no_label : $scope.i18n.common_term_yes_button;
                    $scope.info.persistentDisk = diskInfo.persistentDisk === "true" ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                    $scope.info.mediaType = diskInfo.mediaType === "SAN-Any"?"Any":diskInfo.mediaType;
                    $scope.info.dataStore = diskInfo.dataStore;
                    $scope.info.vm = diskInfo.vm;
                    $scope.info.pciType = diskInfo.pciType;
                    $scope.info.diskId = diskInfo.diskId;
                    $scope.info.storageType = storeTypes[diskInfo.storageType] || diskInfo.storageType;
                    $scope.info.ioWeight = diskInfo.ioWeight;
                    $scope.info.volumnId = diskInfo.volumnId;
                });
            };
            if ($scope.operable) {
                $scope.memberTable.columns.push(
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false
                    });
            }
        }];

        var dependency = ["ng", "wcc"];
        var vmToDiskApp = angular.module("resources.hypervisor.disk.vmToDisk", dependency);
        vmToDiskApp.service("camel", httpService);
        vmToDiskApp.controller("resources.hypervisor.disk.vmToDisk.ctrl", vmToDiskCtrl);
        return vmToDiskApp;
    });


