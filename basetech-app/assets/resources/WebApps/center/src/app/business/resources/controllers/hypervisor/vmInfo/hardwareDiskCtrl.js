/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "bootstrap/bootstrap.min",
    "app/services/exceptionService",
    "app/services/competitionConfig"
], function ($, angular, UnifyValid, Window, Message, bootstrap, Exception, competition) {
    "use strict";

    var diskCtrl = ["$scope", "$stateParams", "$state", "$compile", "camel", function ($scope, $stateParams, $state, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        var maxDiskNum = 60;
        $scope.operable = user.privilege["role_role_add_option_diskHandle_value.610000"] && ($stateParams.isVsa !== "true");
        $scope.vmName = $stateParams.name;
        $scope.vmId = $stateParams.vmId;
        var clusterId = null;
        $scope.help = {
            show: false
        };
        var types = {
            "normal": $scope.i18n.common_term_common_label,
            "share": $scope.i18n.common_term_share_label
        };

        //添加按钮
        $scope.diskAddButton = {
            "id": "diskAddButton",
            "text":  $scope.i18n.common_term_add_button || "添加",
            "click": function () {
                var newWindow = new Window({
                    "winId": "addVmDiskWindow",
                    "title":  $scope.i18n.org_term_addDisk_button || "添加磁盘",
                    "vmId": $scope.vmId,
                    "vmType": $scope.vmType,
                    "ideSlots": $scope.ideSlots,
                    "scsiSlots": $scope.scsiSlots,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vmInfo/addVmDisk.html",
                    "height": 500,
                    "width": $scope.i18n.locale === "zh"?750:900
                });
                newWindow.show();
            }
        };
        $scope.refresh = function () {
            getDiskData();
        };

        //磁盘列表
        $scope.diskTable = {
            "id": "hardwareDiskTable",
            "data": null,
            "showDetails": {
                "colIndex": 0,
                "domPendType": "append"
            },
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": 40
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.diskName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_type_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.typeStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":  $scope.i18n.common_term_capacityGB_label || "容量(GB)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.quantityGB);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":  $scope.i18n.perform_term_usedCapacityGB_label || "用户已用容量(GB)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vmUsedSizeGB);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":  $scope.i18n.common_term_storage_label || "存储",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.storageName);
                    },
                    "bSortable": false
                }
            ],
            "renderRow": function (nRow, aData, iDataIndex) {
                $(nRow).attr("volumnUrn", $.encoder.encodeForHTML("" + aData.volumnId));
                $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                $(nRow).attr("allocType",$.encoder.encodeForHTML("" + aData.allocType));
                $(nRow).attr("indepDisk",$.encoder.encodeForHTML("" + aData.indepDisk));
                $(nRow).attr("persistentDisk",$.encoder.encodeForHTML("" + aData.persistentDisk));
                $(nRow).attr("mediaType",$.encoder.encodeForHTML("" + aData.mediaType));
                $(nRow).attr("storageType",$.encoder.encodeForHTML("" + aData.storageType));
                $(nRow).attr("pciType",$.encoder.encodeForHTML("" + aData.pciType));
                $(nRow).attr("diskId",$.encoder.encodeForHTML("" + aData.diskId));
                $(nRow).attr("storageType",$.encoder.encodeForHTML("" + aData.storageType));
                $(nRow).attr("ioWeight",$.encoder.encodeForHTML("" + aData.ioWeight));
                $(nRow).attr("volumnId",$.encoder.encodeForHTML("" + aData.volumeId));

                $("td:eq(1)", nRow).addTitle();
                $("td:eq(5)", nRow).addTitle();

                $('td:eq(0)', nRow).html("");

                if ($scope.vmType !== "vmware") {
                    //详情链接
                    var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                    var scope = $scope.$new(false);
                    scope.name = aData.storageName;
                    scope.detail = function () {
                        $state.go("resources.storeInfo.summary", {"storeId": aData.dataStoreId, "storeName": scope.name,
                            "from": $state.current.name,"hyperType": $scope.vmType});
                    };
                    var node = link(scope);
                    $("td:eq(5)", nRow).html(node);
                }

                // 操作列
                var subMenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">'+($scope.i18n.common_term_more_button || "更多")+'<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                if ($scope.vmType !== "vmware") {
                    if (isSetIODisable()) {
                        subMenus += '<li class="disabled"><a tabindex="1">'+($scope.i18n.common_term_setIOmax_button || "设置IO上限")+'</a></li>';
                    } else {
                        subMenus += '<li><a tabindex="1" ng-click="setLimit()">'+($scope.i18n.common_term_setIOmax_button || "设置IO上限")+'</a></li>';
                    }
                }
                if (isEditSizeDisable(aData.storageType,aData.type)) {
                    subMenus += '<li class="disabled"><a tabindex="2">'+($scope.i18n.vm_term_AdjustCapacity_button || "调整容量")+'</a></li>' + '<li class="divider-line"></li>';
                } else {
                    subMenus += '<li><a tabindex="2" ng-click="configSize()">'+($scope.i18n.vm_term_AdjustCapacity_button || "调整容量")+'</a></li>' + '<li class="divider-line"></li>';
                }

                if (competition.storageIoControl && aData.type === "normal" && (aData.storageType === 'LOCALPOME' || aData.storageType === 'LUNPOME' || aData.storageType === 'NAS')) {
                    subMenus += '<li><a tabindex="2" ng-click="setIoWeight()">'+($scope.i18n.common_term_setIOqouta_button || "设置IO份额")+'</a></li>';
                }
                if ($scope.vmType !== "vmware") {
                    if (isRetrieveDisable()) {
                        subMenus += '<li class="disabled"><a tabindex="3">'+($scope.i18n.vm_term_recycleDisk_button || "磁盘资源回收")+'</a></li>';
                    } else {
                        subMenus += '<li><a tabindex="3" ng-click="retrieve()">'+($scope.i18n.vm_term_recycleDisk_button || "磁盘资源回收")+'</a></li>';
                    }
                }
                subMenus += '<li><a tabindex="3" ng-click="unmountDisk()">'+($scope.i18n.common_term_unbond_button || "解绑定")+'</a></li>';
                if (isDeleteDisable()) {
                    subMenus += '<li class="disabled"><a tabindex="3">'+$scope.i18n.common_term_delete_button+'</a></li>';
                } else {
                    subMenus += '<li><a tabindex="3" ng-click="delete()">'+$scope.i18n.common_term_delete_button+'</a></li>';
                }
                subMenus = subMenus + '</ul>' + '</span>';
                var optColumn = "<div>";
                if (isEditDisable()) {
                    optColumn += "<a class='disabled' href='javascript:void(0)' ng-click='edit()'>"+$scope.i18n.common_term_modify_button+"</a>";
                } else {
                    optColumn += "<a  href='javascript:void(0)' ng-click='edit()'>"+$scope.i18n.common_term_modify_button+"</a>";
                }
                optColumn += "&nbsp;&nbsp;&nbsp;&nbsp;" + subMenus + "</div>";

                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                var winParams = {
                    "diskName": aData.diskName,
                    "vmId": $scope.vmId,
                    "volumnId": aData.volumeId,
                    "clusterId": clusterId
                };
                optScope.edit = function () {
                    winParams.persistentDisk = aData.persistentDisk;
                    winParams.influence = aData.indepDisk;
                    winParams.allocType = aData.allocType;
                    winParams.vmType = $scope.vmType;
					winParams.storageType = aData.storageType;
                    var newWindow = new Window({
                        "winId": "editDiskWindow",
                        "title": $scope.i18n.common_term_modify_button || "修改",
                        "content-type": "url",
                        "WIN_PARAMS": winParams,
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/disk/editDisk.html",
                        "height": 350,
                        "width": $scope.i18n.locale === "zh"?550:900,
                        "close": function () {
                            getDiskData();
                        }
                    });
                    newWindow.show();
                };
                optScope.setLimit = function () {
                    //TODO 停止，运行，休眠可调整
                    winParams.maxReadBytes = aData.maxReadBytes;
                        winParams.maxWriteBytes = aData.maxWriteBytes;
                        winParams.maxReadRequest = aData.maxReadRequest;
                        winParams.maxWriteRequest = aData.maxWriteRequest;
                    var newWindow = new Window({
                        "winId": "setDiskLimitWindow",
                        "title":  $scope.i18n.common_term_setIOmax_button || "设置IO上限",
                        "content-type": "url",
                        "WIN_PARAMS": winParams,
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/disk/setDiskLimit.html",
                        "height": 350,
                        "width": 720,
                        "close": function () {
                            getDiskData();
                        }
                    });
                    newWindow.show();
                };
                optScope.unmountDisk = function () {
                    var options = {
                        "winId": "hypervisiorVmUnmountDiskWinId",
                        "winParam": winParams,
                        "title": $scope.i18n.common_term_unbond_button,
                        "width": "310px",
                        "height": "140px",
                        "content-type": "url",
                        "content": "app/business/resources/views/hypervisor/vmInfo/unmountDisk.html",
                        "buttons": null,
                        "close": function (event) {
                            getDiskData();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                };
                optScope.configSize = function () {
                    winParams.quantityGB = aData.quantityGB;
                    var newWindow = new Window({
                        "winId": "configDiskSizeWindow",
                        "title":  $scope.i18n.vm_term_AdjustCapacity_button || "调整容量",
                        "content-type": "url",
                        "WIN_PARAMS": winParams,
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/disk/configDiskSize.html",
                        "height": 250,
                        "width": 500,
                        "close": function () {
                            getDiskData();
                        }
                    });
                    newWindow.show();
                };
                optScope.retrieve = function () {
                    var options = {
                        type: "confirm",
                        content:  $scope.i18n.vm_vm_RecycleDisk_info_confirm_msg || "您确认要回收磁盘资源吗？",
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                handler: function (event) {
                                    msg.destroy();
                                    recycleDisk(aData.diskName, aData.volumeId);
                                }
                            },
                            {
                                label:$scope.i18n.common_term_cancle_button,
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
                optScope.delete = function () {
                    var newWindow = new Window({
                        "winId": "deleteVmDiskWindow",
                        "title":  $scope.i18n.vm_term_delVMdisk_button || "删除虚拟机磁盘",
                        "content-type": "url",
                        "vmId": $scope.vmId,
                        "volumnId": aData.volumeId,
                        "volumnName":aData.diskName,
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/vmInfo/deleteDisk.html",
                        "height": 250,
                        "width": 370,
                        "close": function () {
                            getDiskData();
                        }
                    });
                    newWindow.show();
                };
                optScope.setIoWeight = function () {
                    setIoWeightWindow(aData.volumeId, aData.ioWeight);
                };
                var optNode = optLink(optScope);
                $("td:eq(6)", nRow).html(optNode);

                optNode.find('.dropdown').dropdown();
            }
        };

        function isSetIODisable() {
            return ($scope.group === "VRMGroup");
        }

        function isEditSizeDisable(storageType,type) {
            return (type !== "normal" || storageType === "LUN" ||  ($scope.status !== 'stopped' && $scope.status !== 'running'));
        }

        function isDeleteDisable() {
            return $scope.status !== 'stopped';
        }

        function isEditDisable() {
            return false;
        }

        function isRetrieveDisable() {
			if(competition.storageIoControl){
				return false;
			}else{
				return $scope.status != "stopped";
			}
        }

        function recycleDisk(diskName, volumnId) {
            var params = {
                "recycle": {
                    "diskName": diskName,
                    "vmId": $scope.vmId,
                    "vmName": $scope.vmName
                }
            };
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/1/volumes/{id}/action", o: {'id': volumnId}},
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
                content:  $scope.i18n.task_view_task_info_confirm_msg || "任务发放成功，是否前往任务中心查看？",
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
                            getDiskData();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }

        function getDiskData() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var vmInfo = data && data.vmInfo;
                var disks = vmInfo.vmConfig.disks || [];
                if ($("#vmInfoHardwareTable").widget() && $scope.hardwareTable.data) {
                    $scope.hardwareTable.data[2].summary = disks.length + ($scope.i18n.common_term_entry_label ||"个");
                    $("#vmInfoHardwareTable").widget().option("data", $scope.hardwareTable.data);
                }
                clusterId = vmInfo.clusterId;
                $scope.group = vmInfo.group;
                $scope.type = vmInfo.type;
                $scope.isTemplate = vmInfo.isTemplate;

                $scope.status = vmInfo.status;
                $scope.vmType = vmInfo.vmType;
                $scope.ideSlots = [];
                $scope.scsiSlots = [];
                for (var i = 0; i < disks.length; i++) {
                    disks[i].detail = {
                        "contentType": "url",
                        "content": "app/business/resources/views/hypervisor/disk/vmToDisk.html"
                    };
                    if (disks[i].pciType === "IDE" || disks[i].pciType === "") {
                        $scope.ideSlots.push(disks[i].diskId);
                    }
                    if (disks[i].pciType === "SCSI" || disks[i].pciType === "") {
                        $scope.scsiSlots.push(disks[i].diskId);
                    }
                    disks[i].typeStr = types[disks[i].type] || disks[i].type;
                }
                if(disks.length >= maxDiskNum){
                    $("#"+$scope.diskAddButton.id).widget().option("disable",true);
                }
                $scope.$apply(function () {
                    $scope.diskTable.data = disks;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function setIoWeightWindow(volumnId, ioWeight) {
            var newWindow = new Window({
                "winId": "setIoWeightWindow",
                "title":  $scope.i18n.common_term_setIOqouta_button || "设置IO份额",
                "volumnId": volumnId,
                "ioWeight": ioWeight,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/hypervisor/disk/setIoWeight.html",
                "height": 220,
                "width": $scope.i18n.local === "zh"?450:520,
                "close": function () {
                    getDiskData();
                }
            });
            newWindow.show();
        }

        if ($scope.operable) {
            $scope.diskTable.columns.push(
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false
                });
        }
        getDiskData();
    }];
    return diskCtrl;
});
