/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Message",
    "tiny-widgets/Radio",
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Message, Radio, httpService, validatorService, UnifyValid, Exception) {

        "use strict";
        var addVmDiskCtrl = ["$scope", "$compile", "validator", "camel", function ($scope, $compile, validator, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var $state = $("html").injector().get("$state");
            var window = $("#addVmDiskWindow").widget();
            var vmId = window.option("vmId");
            $scope.vmType = window.option("vmType");
            var ideSlots = window.option("ideSlots");
            var scsiSlots = window.option("scsiSlots");
            $scope.addType = "common";
            var maxDiskSizes = {
                "fusioncompute":64*1024,
                "vmware":62*1024,
                "openstack":64*1024
            };
            var maxDiskSize = maxDiskSizes[$scope.vmType] || 64*1024;
            $scope.tips = {
                influence: $scope.i18n.org_disk_add_para_snap_mean_label || "如果选择该选项，则在创建虚拟机快照时，不对该磁盘做快照。",
                permanence_true:  $scope.i18n.org_disk_add_para_persistent_mean_yes_label || "数据更改会立即永久保存到磁盘。",
                permanence_false:  $scope.i18n.org_disk_add_para_persistent_mean_no_label || "在断电或对磁盘做快照恢复时，对磁盘的数据更改会丢失。"
            };

            var freeIdeSlots = [{
                "selectId": "0",
                "label": ""
            }];
            for (var i = 1; i < 12; i++) {
                var option = getOption(i, i);
                freeIdeSlots.push(option);
                for (var j = 0; j < ideSlots.length; j++) {
                    if (i == ideSlots[j]) {
                        freeIdeSlots.pop();
                        break;
                    }
                }
            }
            if (freeIdeSlots.length > 0) {
                freeIdeSlots[0].checked = true;
            }

            var freeScsiSlots = [{
                "selectId": "0",
                "label": ""
            }];
            for (var i = 1; i < 12; i++) {
                var option = getOption(i, i);
                freeScsiSlots.push(option);
                for (var j = 0; j < scsiSlots.length; j++) {
                    if (i == scsiSlots[j]) {
                        freeScsiSlots.pop();
                        break;
                    }
                }
            }
            if (freeScsiSlots.length > 0) {
                freeScsiSlots[0].checked = true;
            }
            function getOption(index, lable) {
                var option = {
                    "selectId": index,
                    "label": lable
                };
                return option;
            }

            $scope.addTypeRadio = {
                "id": "createDiskTypeRadio",
                "layout": "horizon",
                "values": [
                    [
                        {
                            "key": "common",
                            "text":  $scope.i18n.org_disk_term_add_para_disk_label || "普通磁盘",
                            "checked": true
                        }
                    ],
                    [
                        {
                            "key": "lun",
                            "text":  $scope.i18n.org_disk_term_add_para_bare_label || "裸机映射"
                        }
                    ],
                    [
                        {
                            "key": "exit",
                            "text":  $scope.i18n.vm_term_existingDisk_label || "已有磁盘"
                        }
                    ]
                ],
                "change": function () {
                    $scope.addType = $("#" + $scope.addTypeRadio.id).widget().opChecked("checked");
                    if ($scope.addType === "lun") {
                        getLun();
                    }
                    else if ($scope.addType === "exit") {
                        getDisk();
                    }
                }
            };
            //添加普通磁盘页面
            //名称输入框
            $scope.nameTextbox = {
                "label": $scope.i18n.common_term_name_label+":",
                "id": "addDiskNameTextbox",
                "disable": $scope.vmType === "vmware",
                "value": "",
                "validate": "maxSize(64):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:64}) +
                ";regularCheck(" + validator.ChineseRe + "):" + $scope.i18n.common_term_composition3_valid
            };
            //槽位号下拉框
            $scope.slotSelector = {
                "label":($scope.i18n.device_term_slotID_label || "槽位号") + ":",
                "id": "addDiskSlotSelector",
                "width": "150",
                "display": $scope.vmType !== "vmware",
                "values": freeIdeSlots,
                "change": function () {

                }
            };
            //容量输入框
            $scope.sizeTextbox = {
                "label":($scope.i18n.common_term_capacityGB_label || "容量(GB)") + ":",
                "require": true,
                "id": "addDiskSizeTextbox",
                "value": "",
                "validate":"required:"+$scope.i18n.common_term_null_valid+
                    ";integer:"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":1,"2":maxDiskSize})+
                    ";minValue(1);"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":1,"2":maxDiskSize})+
                    ";maxValue("+maxDiskSize+"):"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":1,"2":maxDiskSize})
            };
            //模式下拉框
            $scope.patternSelector = {
                "label": ($scope.i18n.common_term_setMode_label || "配置模式") + ":",
                "id": "createDiskPatternSelector",
                "width": "150",
                "values": [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.common_term_common_label || "普通",
                        "checked": true
                    },
                    {
                        "selectId": "thin",
                        "label": $scope.i18n.common_term_thinProv_label || "精简"
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_lazyZeroed_label || "普通延迟置零"
                    }
                ]
            };
            $scope.influenceCheckbox = {
                "id": "addDiskInfluenceCheckbox",
                "label": "",
                "text":  $scope.i18n.vm_disk_add_para_snap_option_no_value || "不受快照影响",
                "change": function () {
                    var result = $("#" + $scope.influenceCheckbox.id).widget().option("checked");
                    $("#" + $scope.permanenceRadio.id).widget().opDisabled("true", !result);
                    $("#" + $scope.permanenceRadio.id).widget().opDisabled("false", !result);
                    if(!result){
                        $("#" + $scope.permanenceRadio.id).widget().opChecked("true", true);
                    }
                }
            };
            $scope.permanenceRadio = {
                "id": "createDiskPermanenceRadio",
                "layout": "vertical",
                "values": [
                    [
                        {
                            "key": "true",
                            "text": $scope.i18n.org_term_persistent_label || "持久化",
                            "checked": true,
                            "disable": true
                        }
                    ],
                    [
                        {
                            "key": "false",
                            "text": $scope.i18n.org_term_nonpersistent_label || "非持久化",
                            "disable": true
                        }
                    ]
                ],
                "change": function () {

                }
            };
            $scope.mediaSelector = {
                "label": ($scope.i18n.common_term_storageMedia_label || "存储介质") +":",
                "id": "createDiskmediaSelector",
                "width": "150",
                "require": true,
                "values": [
                    {
                        "selectId": "SAN-Any",
                        "label": "Any",
                        "checked": true
                    },
                    {
                        "selectId": "SAN-SSD",
                        "label": "SAN-SSD"
                    },
                    {
                        "selectId": "SAN-SATA",
                        "label": "SAN-SATA"
                    },
                    {
                        "selectId": "SAN-SAS&FC",
                        "label": "SAN-SAS&FC"
                    }
                ]
            };
            //确定按钮
            $scope.commonOkButton = {
                "id": "addCommonOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#addCommonDiskDiv"));
                    if (!result) {
                        return;
                    }
                    var model = {
                        "quantityGB": $("#" + $scope.sizeTextbox.id).widget().getValue(),
                        "persistentDisk": $("#" + $scope.permanenceRadio.id).widget().opChecked("checked"),
                        "indepDisk": Boolean($("#" + $scope.influenceCheckbox.id).widget().option("checked")),
                        "mediaType": $("#" + $scope.mediaSelector.id).widget().getSelectedId()
                    };
                    if ($scope.vmType !== "vmware") {
                        model.diskSequenceNum = $("#" + $scope.slotSelector.id).widget().getSelectedId();
                        if(model.diskSequenceNum === "0"){
                            model.diskSequenceNum = null;
                        }
                    }
                    var name = $("#" + $scope.nameTextbox.id).widget().getValue();
                    if (name !== "") {
                        model.name = name;
                    }
                    var pattern = $("#" + $scope.patternSelector.id).widget().getSelectedId();
                    if (pattern === "thin") {
                        model.thin = true;
                        model.volType = "0";
                    }
                    else {
                        model.thin = false;
                        model.volType = pattern;
                    }
                    addDisk(model);
                }
            };
            //取消按钮
            $scope.commonCancelButton = {
                "id": "addCommonCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };

            //裸机映射页面
            //名称输入框
            $scope.lunNameTextbox = {
                "label": $scope.i18n.common_term_name_label+":",
                "id": "addLunNameTextbox",
                "require": true,
                "value": "",
                "validate": "maxSize(64):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:64}) +
                    ";regularCheck(" + validator.ChineseRe + "):" + $scope.i18n.common_term_composition3_valid
            };
            //选择存储下拉框
            $scope.lunStoreSelector = {
                "label": ($scope.i18n.vm_term_chooseStor_label || "选择存储") + ":",
                "id": "addLunStoreSelector",
                "width": "150",
                "require": true,
                "values": [],
                "change": function () {
                    var result = $("#" + $scope.lunStoreSelector.id).widget().getSelectedId();
                    var lun = $scope.luns[result];
                    $("#" + $scope.lunSizeTextbox.id).widget().option("value", lun.capacity.totalCapacityGB);
                    $("#" + $scope.lunMediaSelector.id).widget().opChecked(lun.mediaType, true);
                    getLunDisk(lun.id);
                }
            };
            //槽位号下拉框
            $scope.lunSlotSelector = {
                "label": ($scope.i18n.device_term_slotID_label || "槽位号") +":",
                "id": "addLunSlotSelector",
                "width": "150",
                "display": $scope.vmType !== "vmware",
                "values": freeScsiSlots,
                "change": function () {

                }
            };
            //容量输入框
            $scope.lunSizeTextbox = {
                "label": ($scope.i18n.common_term_capacityGB_label || "容量(GB)") + ":",
                "require": true,
                "disable": true,
                "id": "addLunSizeTextbox",
                "value": ""
            };
            //模式下拉框
            $scope.lunPatternSelector = {
                "label":  ($scope.i18n.common_term_setMode_label || "配置模式") +":",
                "id": "createLunPatternSelector",
                "width": "150",
                "disable": true,
                "values": [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.common_term_common_label || "普通",
                        "checked": true
                    },
                    {
                        "selectId": "thin",
                        "label": $scope.i18n.common_term_thinProv_label || "精简"
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_lazyZeroed_label || "普通延迟置零"
                    }
                ]
            };
            $scope.lunInfluenceCheckbox = {
                "id": "addLunInfluenceCheckbox",
                "label": "",
                "disable": true,
                "text":  $scope.i18n.vm_disk_add_para_snap_option_no_value || "不受快照影响",
                "checked": true,
                "change": function () {
                }
            };
            $scope.lunPermanenceRadio = {
                "id": "createLunPermanenceRadio",
                "layout": "vertical",
                "values": [
                    [
                        {
                            "key": "true",
                            "text": $scope.i18n.org_term_persistent_label || "持久化",
                            "checked": true,
                            "disable": true
                        }
                    ],
                    [
                        {
                            "key": "false",
                            "text": $scope.i18n.org_term_nonpersistent_label || "非持久化",
                            "disable": true
                        }
                    ]
                ],
                "change": function () {

                }
            };
            $scope.lunMediaSelector = {
                "label": ($scope.i18n.common_term_storageMedia_label || "存储介质") + ":",
                "id": "createLunMediaSelector",
                "width": "150",
                "disable": true,
                "require": true,
                "values": [
                    {
                        "selectId": "SAN-Any",
                        "label": "Any",
                        "checked": true
                    },
                    {
                        "selectId": "SAN-SSD",
                        "label": "SAN-SSD"
                    },
                    {
                        "selectId": "SAN-SATA",
                        "label": "SAN-SATA"
                    },
                    {
                        "selectId": "SAN-SAS&FC",
                        "label": "SAN-SAS&FC"
                    }
                ]
            };
            //确定按钮
            $scope.lunOkButton = {
                "id": "addLunOkButton",
                "text":$scope.i18n.common_term_ok_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#addLunDiskDiv"));
                    if (!result) {
                        return;
                    }
                    var lunId = $("#" + $scope.lunStoreSelector.id).widget().getSelectedId();
                    var lun = $scope.luns[lunId];
                    var model = {
                        "addVmDiskMode": "ADD_RAW_DEVICE_DISK",
                        "pciType": "SCSI",
                        "thin": false,
                        "indepDisk": true,
                        "type": "share",
                        "datastoreVrmId": lun.rid,
                        "quantityGB": $("#" + $scope.lunSizeTextbox.id).widget().getValue()
                    };
                    if ($scope.vmType !== "vmware") {
                        model.diskSequenceNum = $("#" + $scope.lunSlotSelector.id).widget().getSelectedId();
                    }
                    var name = $("#" + $scope.lunNameTextbox.id).widget().getValue();
                    if (name !== "") {
                        model.name = name;
                    }
                    addDisk(model);
                }
            };
            //取消按钮
            $scope.lunCancelButton = {
                "id": "addLunCancelButton",
                "text":$scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };

            //已有磁盘页面
            var statuses = {
                "CREATING": $scope.i18n.common_term_creating_value || "创建中",
                "USE": $scope.i18n.common_term_available_label || "可用",
                "RESTORING": $scope.i18n.common_term_resuming_value || "恢复中",
                "SNAPSHOTING": $scope.i18n.common_term_snaping_value || "快照中",
                "MIGRATING": $scope.i18n.common_term_migrating_value || "迁移中",
                "RESIZING": $scope.i18n.common_term_expanding_value || "扩容中",
                "SHRINKING": $scope.i18n.common_term_reclaimingStor_value || "回收空间中",
                "DELETING": $scope.i18n.common_term_deleting_value || "删除中",
                "COPYING": $scope.i18n.common_term_copying_value || "复制中"
            };
            var types = {
                "normal": $scope.i18n.common_term_common_label || "普通",
                "share": $scope.i18n.common_term_share_label || "共享"
            };
            var allocTypes = {
                "thick":  $scope.i18n.common_term_common_label || "普通",
                "thin":  $scope.i18n.common_term_thinProv_label || "精简",
                "thickformat":  $scope.i18n.common_term_lazyZeroed_label || "普通延迟置零"
            };
            //查询信息
            var searchInfo = {
                "start": 0,
                "limit": 10,
                "name": "",
                attachstatus: ""
            };
            //虚拟机列表
            $scope.diskTable = {
                "id": "exitDiskTable",
                "data": null,
                "caption": "",
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columnSorting": [],
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.diskName);
                        },
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
                        "sTitle": ($scope.i18n.common_term_capacityGB_label || "容量(GB)"),
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.quantityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_storage_label || "存储",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.storageName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_setMode_label || "配置模式",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.allocType);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getDisk();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.diskTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.diskTable.displayLength = pageInfo.displayLength;
                    getDisk();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(1)', nRow).addTitle();

                    //单选框
                    var options = {
                        "id": "diskRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#diskRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#diskRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };
            //确定按钮
            $scope.exitOkButton = {
                "id": "addExitOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $("#" + $scope.diskTable.id).widget().option("data");
                    var exitDisk = {
                    };
                    var index = 0;
                    while ($("#diskRadio_" + index).widget()) {
                        var checked = $("#diskRadio_" + index).widget().option("checked");
                        if (checked) {
                            exitDisk.name = data[index].diskName;
                            exitDisk.volumeId = data[index].volumeId;
                            exitDisk.volFileName = data[index].volFileName;
                            exitDisk.quantityGB = data[index].quantityGB;
                            exitDisk.type = data[index].type;
                            exitDisk.volType = data[index].volType;
                            exitDisk.thin = data[index].isThin;
                            break;
                        }
                        index++;
                    }
                    if (exitDisk.volumeId) {
                        exitDisk.addVmDiskMode = "ADD_VM_EXIST_DISK";
                        addDisk(exitDisk);
                    }
                }
            };
            //取消按钮
            $scope.exitCancelButton = {
                "id": "addExitCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function addDisk(diskInfo) {
                var deferred = camel.post({
                    url: {s: " /goku/rest/v1.5/irm/1/vms/{id}/volumes", o: {id: vmId}},
                    "params": JSON.stringify(diskInfo),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    taskMessage();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getDisk() {
                var deferred = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/irm/1/vms/{id}/volumes?attachable=true&offset={offset}&limit={limit}",
                        o: {id: vmId, offset: searchInfo.start, limit: searchInfo.limit}
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var disks = data && data.attachableVolumes && data.attachableVolumes.disks || [];
                    for (var i = 0; i < disks.length; i++) {
                        disks[i].allocType = allocTypes[disks[i].allocType] || disks[i].allocType;
                    }
                    $scope.$apply(function () {
                        $scope.diskTable.totalRecords = data.attachableVolumes.total;
                        $scope.diskTable.data = disks;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getLun() {
                var params = {
                    detail: 0,
                    category: "2",
                    scopeType: "VM",
                    scopeObjectId: vmId
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var stores = data && data.datastoreInfos || [];
                    var storeValues = [];
                    for (var i = 0; i < stores.length; i++) {
                        var option = getOption(i, stores[i].name);
                        option.checked = i === 0;
                        storeValues.push(option);
                    }
                    $("#" + $scope.lunStoreSelector.id).widget().option("values", storeValues);
                    if (stores.length > 0) {
                        $("#" + $scope.lunSizeTextbox.id).widget().option("value", stores[0].capacity.totalCapacityGB);
                        $("#" + $scope.lunMediaSelector.id).widget().opChecked(stores[0].mediaType, true);
                        getLunDisk(stores[0].id);
                    }
                    $scope.luns = stores;
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getLunDisk(lunId) {
                var params = {
                    "list": {
                        "source": "MANAGER",
                        "offset": 0,
                        "limit": 10,
                        "datastoreId": lunId
                    }
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/volumes/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var disks = data && data.list && data.list.volumes || [];
                    var diskName = disks.length > 0 ? disks[0].name : "";
                    $("#" + $scope.lunNameTextbox.id).widget().option("value", diskName);
                    $("#" + $scope.lunNameTextbox.id).widget().option("disable", disks.length > 0);
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function taskMessage() {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.task_view_task_info_confirm_msg || "任务发放成功，是否前往任务中心查看？",
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
                                window.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
        }];

        var addVmDiskApp = angular.module("addVmDiskApp", ['framework']);
        addVmDiskApp.service("camel", httpService);
        addVmDiskApp.service("validator", validatorService);
        addVmDiskApp.controller("resources.vmInfo.addVmDisk.ctrl", addVmDiskCtrl);
        return addVmDiskApp;
    }
);