/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Radio",
    "tiny-widgets/Select",
    "tiny-widgets/Textbox",
    "tiny-widgets/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/mask",
    "tiny-common/UnifyValid",
    "app/services/tipMessageService",
    "app/services/exceptionService",
    "upload/jquery-form"],
    function ($, angular, Checkbox, Radio, Select, Textbox, Button, Window, Message, mask, UnifyValid, tipMessage, Exception, jqueryForm) {
        "use strict";

        var importVmCtrl = ["$scope", "$compile", "$state", "camel", "$stateParams", "validator", "$timeout",
            function ($scope, $compile, $state, camel, $stateParams, validator, $timeout) {
                var exceptionService = new Exception();
                var user = $("html").scope().user;
                $scope.from = $stateParams.from;
                $scope.vmName = $stateParams.vmName;
                $scope.clusterName = $stateParams.clusterName;
                $scope.clusterId = $stateParams.clusterId;
                //以clusterIndex来标识是否是在集群内导入虚拟机
                $scope.clusterIndex = $stateParams.clusterIndex;
                $scope.hypervisorId = $stateParams.hypervisorId;
                var clusterTypes = {
                    0: $scope.i18n.common_term_unknown_value,
                    1: $scope.i18n.common_term_virtualization_label,
                    2: $scope.i18n.virtual_term_bareCluster_label,
                    3: $scope.i18n.common_term_manage_label,
                    4: $scope.i18n.common_term_databaseCluster_label,
                    5: $scope.i18n.resource_term_storageCluster_label
                };
                var hostStatus = {
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
                $scope.title = $scope.i18n.vm_term_importVM_button;
                $scope.stepUrl = {
                    "step1": "../src/app/business/resources/views/hypervisor/vm/importTemplate.html",
                    "step2": "../src/app/business/resources/views/hypervisor/vm/importTarget.html",
                    "step3": "../src/app/business/resources/views/hypervisor/vm/importVmSpec.html",
                    "step4": "../src/app/business/resources/views/hypervisor/vm/createVmNetwork.html",
                    "step5": "../src/app/business/resources/views/hypervisor/vm/importConfirm.html"
                };
                $scope.curStep = "template";
                $scope.importStep = {
                    "id": "createVmStep",
                    "values": [$scope.i18n.common_term_importTemplate_button, $scope.i18n.common_term_basicInfo_label, $scope.i18n.spec_term_vm_label,
                        $scope.i18n.vm_term_chooseNet_label, $scope.i18n.common_term_confirmInfo_label],
                    "width": "800",
                    "jumpable": false
                };
                var allocTypes = {
                    "thick": $scope.i18n.common_term_common_label,
                    "thickformat": $scope.i18n.common_term_lazyZeroed_label,
                    "thin": $scope.i18n.common_term_thinProv_label
                };
                //占位虚拟机导入虚拟机时，会传入占位虚拟机的id和它所在的虚拟化环境的id
                $scope.model = {
                    "occupiedVmId": $stateParams.occupiedVmId,
                    "hypervisorId": $stateParams.hypervisorId,
                    "clusterId": $stateParams.hypervisorId + "$" + $stateParams.clusterId
                };
                if ($scope.model.occupiedVmId) {
                    $scope.importStep.values = [$scope.i18n.common_term_importTemplate_button, $scope.i18n.common_term_confirmInfo_label];
                }

                //导入模板页面
                //协议下拉框
                $scope.protocolSelector = {
                    "id": "protocolSelector",
                    "width": "135",
                    "label": $scope.i18n.common_term_protocolType_label,
                    "require": true,
                    "values": [
                        {
                            "selectId": "cifs",
                            "label": "CIFS",
                            "checked": true
                        },
                        {
                            "selectId": "nfs",
                            "label": "NFS"
                        }
                    ],
                    "change": function () {
                    }
                };

                //模板文件选择框
                $scope.templateFile = {
                    "label": $scope.i18n.common_term_templateFile_label + ":",
                    "require": true,
                    "action": "/goku/rest/v1.5/irm/1/vms/file",
                    "id": "exportFileBox",
                    "enableDetail": false,
                    "enableProgress": true,
                    "fileType": ".ovf",
                    "fileObjName": "fileObjNameId",
                    "maxCount": 1,
                    "beforeSubmit": function (event, file) {
                        mask.show();
                    },
                    "select": function (event, file) {
                        $scope.fileName = file.name;
                    },
                    "selectError": function (event, file, errorMsg) {
                        var content = "INVALID_FILE_TYPE" === errorMsg ? $scope.i18n.common_term_fileFormatXmlOrOvf_valid : $scope.i18n.common_term_unknownError_label;
                        new Message({
                            type: 'error',
                            width: '360px',
                            height: '200px',
                            title: $scope.i18n.log_term_warning_label,
                            content: content
                        }).show();
                        $("#" + $scope.templateFile.id).widget().empty();
                        $scope.fileName = null;
                    },
                    "complete": function (event, responseText) {
                        //为解决IE9中上传不了的问题，用ajaxForm处理complete
                    },
                    options: {
                        "complete": function (response, status) {
                            mask.hide();
                            $("#" + $scope.templateFile.id).widget().empty();
                            if (status == 'success') {
                                $scope.model.templateFile = $scope.fileName;
                                if ($scope.model.occupiedVmId) {
                                    getSpecForOccupyVm();
                                }
                                else {
                                    //用ng-if控制第二步中表格的初始化。刚开始表格就初始化但隐藏的话，会显示不出来
                                    //从集群详情里的虚拟机进来，不用选集群
                                    if ($scope.clusterIndex) {
                                        getCluster($scope.clusterId);
                                    }
                                    else if (!$scope.initTable) {
                                        getClusters();
                                    }
                                    $scope.$apply(function () {
                                        $scope.initTable = true;
                                        $scope.curStep = "target";
                                    });
                                    $("#" + $scope.importStep.id).widget().next();
                                }
                            }
                            else {
                                exceptionService.doException(response);
                            }
                            $scope.fileName = null;
                        }
                    }
                };
                //目录输入框
                $scope.dirTextbox = {
                    "label": $scope.i18n.common_term_sharedPath_label + ":",
                    "require": true,
                    "width": "300",
                    "id": "exportDirTextbox",
                    "value": "",
                    "extendFunction": ["cifsDirCheck", "nfsDirCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(100):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 100}) +
                        ";cifsDirCheck():" + $scope.i18n.common_term_formatpath_valid +
                        ";nfsDirCheck():" + $scope.i18n.common_term_formatpath_valid
                };
                UnifyValid.cifsDirCheck = function () {
                    var protocol = $("#" + $scope.protocolSelector.id).widget().getSelectedId();
                    if (protocol !== "cifs") {
                        return true;
                    }
                    var dir = $("#" + $scope.dirTextbox.id).widget().getValue();
                    return validator.cifsDirReg.test(dir);
                };
                UnifyValid.nfsDirCheck = function () {
                    var protocol = $("#" + $scope.protocolSelector.id).widget().getSelectedId();
                    if (protocol !== "nfs") {
                        return true;
                    }
                    var dir = $("#" + $scope.dirTextbox.id).widget().getValue();
                    return validator.nfsDirReg.test(dir);
                };
                //使用本机账户复选框
                $scope.accountCheckbox = {
                    "label": "",
                    "id": "exportAccountCheckbox",
                    "text": $scope.i18n.vm_vm_import_para_useLocalUser_label,
                    "checked": true,
                    "change": function () {
                        var result = $("#" + $scope.accountCheckbox.id).widget().option("checked");
                        $("#" + $scope.usernameTextbox.id).widget().option("disable", !result);
                        $("#" + $scope.passwordTextbox.id).widget().option("disable", !result);
                    }
                };
                //用户名输入框
                $scope.usernameTextbox = {
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": true,
                    "id": "exportUsernameTextbox",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(63):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 63}) +
                        ";"
                };
                //密码输入框
                $scope.passwordTextbox = {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "require": false,
                    "type": "password",
                    "id": "passwordTextbox",
                    "value": "",
                    "validate": "maxSize(63):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 63})
                };
                //下一步按钮
                $scope.templateNextButton = {
                    "id": "templateNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#importTemplateDiv"));
                        if (!result) {
                            return;
                        }
                        if (!$scope.fileName) {
                            var options = {
                                type: "error",
                                content: $scope.i18n.service_term_chooseTemplate_msg,
                                height: "150px",
                                width: "350px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }
                        //用jquery-form将表单上传改造为ajax上传，只要在上传前执行改造即可
                        $("#" + $scope.templateFile.id + " form").ajaxForm($scope.templateFile.options);
                        $scope.model.protocol = $("#" + $scope.protocolSelector.id).widget().getSelectedId();
                        $scope.model.templateDir = $("#" + $scope.dirTextbox.id).widget().getValue();
                        $scope.model.useAccount = $("#" + $scope.accountCheckbox.id).widget().option("checked");
                        $scope.model.useAccountStr = $scope.model.useAccount ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                        $scope.model.username = $("#" + $scope.usernameTextbox.id).widget().getValue();
                        $scope.model.password = $("#" + $scope.passwordTextbox.id).widget().getValue();
                        $("#" + $scope.templateFile.id).widget().submit();
                    }
                };
                //取消按钮
                $scope.templateCancelButton = {
                    "id": "templateCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };

                //选择目标页面
                //名称输入框
                $scope.nameTextbox = {
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": true,
                    "id": "createVmNameTextbox",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(128):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "128"}) +
                        ";regularCheck(" + validator.vmNameCharReg +
                        "):" + $scope.i18n.common_term_composition7_valid
                };
                //描述输入框
                $scope.basicDescTextbox = {
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "require": false,
                    "id": "basicDescTextbox",
                    "value": "",
                    "type": "multi",
                    "height": "50px",
                    "validate": "maxSize(1024):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 1024}) +
                        ";"
                };

                $scope.targetType = "cluster";
                //集群分页信息
                var clusterInfo = {
                    "start": 0,
                    "limit": 10
                };
                //集群列表
                $scope.clusterTable = {
                    "id": "importVmClusterTable",
                    "data": null,
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
                                return "";
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
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_domain_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.domain);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.hypervisorName);
                            },
                            "bSortable": false
                        }
                    ],
                    "callback": function (evtObj) {
                        clusterInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        getClusters();
                    },
                    "changeSelect": function (pageInfo) {
                        clusterInfo.start = 0;
                        $scope.clusterTable.curPage = {
                            "pageIndex": 1
                        };
                        clusterInfo.limit = pageInfo.displayLength;
                        $scope.clusterTable.displayLength = pageInfo.displayLength;
                        getClusters();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(1)', nRow).addTitle();
                        $('td:eq(3)', nRow).addTitle();
                        $('td:eq(5)', nRow).addTitle();
                        //单选框
                        var options = {
                            "id": "clusterRadio_" + iDataIndex,
                            "checked": false,
                            "change": function () {
                                var index = 0;
                                while ($("#clusterRadio_" + index).widget()) {
                                    if (index != iDataIndex) {
                                        $("#clusterRadio_" + index).widget().option("checked", false);
                                    }
                                    index++;
                                }
                                $scope.curCluster = aData.id;
                                $("#" + $scope.hostCheckbox.id).widget().option("disable", false);
                                if ($scope.targetType === "host") {
                                    getHost();
                                }
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());
                    }
                };
                $scope.hostCheckbox = {
                    "id": "hostCheckbox",
                    "text": $scope.i18n.vm_term_chooseHost_label,
                    "disable": !$scope.clusterIndex,
                    "change": function () {
                        var result = $("#" + $scope.hostCheckbox.id).widget().option("checked");
                        $scope.targetType = result ? "host" : "cluster";
                        if ($scope.targetType === "host") {
                            getHost();
                        }
                    }
                };
                //主机列表
                $scope.hostTable = {
                    "id": "importVmHostTable",
                    "data": null,
                    "enablePagination": false,
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
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_runningStatus_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusStr);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.virtual_host_view_para_mainten_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.mainten);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_hostIP_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.hostIp);
                            },
                            "bSortable": false
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(1)', nRow).addTitle();
                        $('td:eq(4)', nRow).addTitle();
                        $('td:eq(5)', nRow).addTitle();
                        //单选框
                        var options = {
                            "id": "hostRadio_" + iDataIndex,
                            "checked": false,
                            "change": function () {
                                var index = 0;
                                while ($("#hostRadio_" + index).widget()) {
                                    if (index != iDataIndex) {
                                        $("#hostRadio_" + index).widget().option("checked", false);
                                    }
                                    index++;
                                }
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());
                    }
                };
                //上一步按钮
                $scope.targetPreButton = {
                    "id": "targetPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.curStep = "template";
                        $("#" + $scope.importStep.id).widget().pre();
                    }
                };
                //下一步按钮
                $scope.targetNextButton = {
                    "id": "targetNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#importVmTargetDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.model.vmName = $("#" + $scope.nameTextbox.id).widget().getValue();
                        $scope.model.vmName = $.trim($scope.model.vmName);
                        $scope.model.description = $("#" + $scope.basicDescTextbox.id).widget().getValue();
                        if ($scope.clusterIndex) {
                            $scope.model.clusterId = $scope.clusterId;
                            $scope.model.clusterIndex = $scope.clusterIndex;
                            $scope.model.cluster = $scope.clusterName;
                            $scope.model.hypervisorId = $scope.hypervisorId;
                            $scope.model.zoneId = $scope.zoneId;
                        }
                        else {
                            var clusterData = $scope.clusterTable.data;
                            var selectedCluster;
                            var index = 0;
                            while ($("#clusterRadio_" + index).widget()) {
                                var checked = $("#clusterRadio_" + index).widget().option("checked");
                                if (checked) {
                                    selectedCluster = clusterData[index].id;
                                    break;
                                }
                                index++;
                            }
                            if (!selectedCluster) {
                                return;
                            }
                            $scope.model.clusterId = selectedCluster;
                            $scope.model.clusterIndex = clusterData[index].indexId;
                            $scope.model.cluster = clusterData[index].name;
                            $scope.model.hypervisorId = clusterData[index].hypervisorId;
                            $scope.model.zoneId = clusterData[index].zoneId;
                        }
                        $scope.model.selectHost = $("#" + $scope.hostCheckbox.id).widget().option("checked");
                        if ($scope.model.selectHost) {
                            var hostData = $scope.hostTable.data;
                            var selectedHost;
                            var index = 0;
                            while ($("#hostRadio_" + index).widget()) {
                                var checked = $("#hostRadio_" + index).widget().option("checked");
                                if (checked) {
                                    selectedHost = hostData[index].id;
                                    break;
                                }
                                index++;
                            }
                            if (!selectedHost) {
                                return;
                            }
                            $scope.model.hostId = selectedHost;
                            $scope.model.host = hostData[index].name;
                        }
                        getTemplateSpec();
                    }
                };
                //取消按钮
                $scope.targetCancelButton = {
                    "id": "targetCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };

                //虚拟机规格页面
                //CPU内核数输入框
                $scope.coreNumTextbox = {
                    "label": $scope.i18n.common_term_vcpuNum_label + ":",
                    "require": true,
                    "id": "coreNumTextbox",
                    "value": "",
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.common_term_PositiveIntegers_valid,
                    "change": function () {
                    }
                };
                //内存输入框
                $scope.memoryTextbox = {
                    "label": $scope.i18n.common_term_memory_label + ":",
                    "require": true,
                    "id": "memoryTextbox",
                    "value": "",
                    "extendFunction": ["mbCheck", "gbCheck"],
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";mbCheck:" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 128, "2": 1048576}) +
                        ";gbCheck:" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 1024})
                };
                UnifyValid.mbCheck = function () {
                    var unit = $("#" + $scope.unitSelector.id).widget().getSelectedId();
                    var value = $("#" + $scope.memoryTextbox.id).widget().getValue();
                    if (unit === "MB") {
                        if (parseInt(value) < 128 || parseInt(value) > 1048576) {
                            return false;
                        }
                    }
                    return true;
                };
                UnifyValid.gbCheck = function () {
                    var unit = $("#" + $scope.unitSelector.id).widget().getSelectedId();
                    var value = $("#" + $scope.memoryTextbox.id).widget().getValue();
                    if (unit === "GB") {
                        if (parseInt(value) < 1 || parseInt(value) > 1024) {
                            return false;
                        }
                    }
                    return true;
                };
                //内存单位下拉框
                $scope.unitSelector = {
                    "label": $scope.i18n.common_term_host_label + ":",
                    "require": false,
                    "id": "unitSelector",
                    "width": "150",
                    "values": [
                        {
                            "selectId": "MB",
                            "label": "MB",
                            "checked": true
                        },
                        {
                            "selectId": "GB",
                            "label": "GB"
                        }
                    ],
                    "change": function () {
                        UnifyValid.FormValid($("#" + $scope.memoryTextbox.id));
                    }
                };
                function getTemplateSpec() {
                    var params = {
                        parseDescriptionFile: {
                            fileName: $scope.model.templateFile,
                            hypervisorId: $scope.model.hypervisorId
                        }
                    };
                    var deferred = camel.post({
                        url: {
                            s: "/goku/rest/v1.5/irm/1/vms/action"
                        },
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            $scope.curStep = "spec";
                        });
                        $("#" + $scope.importStep.id).widget().next();
                        var vmInfo = data.parseDescriptionFile;
                        var vmConfig = vmInfo.vmConfig;
                        $scope.diskList = vmConfig.disks || [];
                        for (var i = 0; i < $scope.diskList.length; i++) {
                            $scope.diskList[i].mediaType = $scope.diskList[i].mediaType ? $scope.diskList[i].mediaType : "SAN-Any";
                            $scope.diskList[i].allotType = $scope.diskList[i].allotType ? $scope.diskList[i].allotType : "think";
                            $scope.diskList[i].indepDisk = $scope.diskList[i].indepDisk ? $scope.diskList[i].indepDisk : false;
                        }
                        $scope.templateDiskNum = $scope.diskList.length;
                        $scope.$apply(function () {
                            $scope.coreNumTextbox.value = vmConfig.cpu.quantity;
                            $scope.memoryTextbox.value = vmConfig.memory.quantityMB;
                            $scope.diskTable.data = $scope.diskList;
                            $scope.model.osType = vmInfo.osInfo.osType;
                            $scope.model.osVersion = vmInfo.osInfo.osVersion;
                        });
                        setDiskNumSelector();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function getSpecForOccupyVm() {
                    var params = {
                        parseDescriptionFile: {
                            fileName: $scope.model.templateFile,
                            hypervisorId: $scope.model.hypervisorId
                        }
                    };
                    var deferred = camel.post({
                        url: {
                            s: "/goku/rest/v1.5/irm/1/vms/action"
                        },
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var vmInfo = data.parseDescriptionFile;
                        $scope.model.vmConfig = vmInfo.vmConfig;
                        $scope.model.osInfo = vmInfo.osInfo;
                        $scope.model.uuid = vmInfo.uuid;
                        $scope.$apply(function () {
                            $scope.model.coreNum = vmInfo.vmConfig.cpu.quantity;
                            $scope.model.memorySize = vmInfo.vmConfig.memory.quantityMB;
                            $scope.model.osType = vmInfo.osInfo.osType;
                            $scope.model.osVersion = vmInfo.osInfo.osVersion;
                            $scope.curStep = "confirm";
                        });
                        $("#" + $scope.importStep.id).widget().next();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function getDisk(i) {
                    var diskItem = {
                        "diskName": $scope.i18n.common_term_disk_label + i,
                        "quantityGB": "20",
                        "allocType": "thick",
                        "mediaType": "SAN-Any",
                        "indepDisk": false
                    };
                    return diskItem;
                }

                function setDiskNumSelector() {
                    preDiskNum = $scope.templateDiskNum;
                    var values = [];
                    for (var i = $scope.templateDiskNum; i <= 11; i++) {
                        var option = {
                            "selectId": i,
                            "label": i
                        };
                        if (i == $scope.templateDiskNum) {
                            option.checked = true;
                        }
                        values.push(option);
                    }
                    $("#" + $scope.diskNumSelector.id).widget().option("values", values);
                }

                var preDiskNum = 0;
                //磁盘个数下拉框
                $scope.diskNumSelector = {
                    "label": $scope.i18n.common_term_diskNum_label + ":",
                    "require": true,
                    "id": "diskNumSelector",
                    "width": "150",
                    "height": "300",
                    "validate": "",
                    "values": [],
                    "change": function () {
                        var curDiskNum = parseInt($("#" + $scope.diskNumSelector.id).widget().getSelectedId());
                        if (preDiskNum < curDiskNum) {
                            for (var i = preDiskNum; i < curDiskNum; i++) {
                                $scope.diskList.push(getDisk(i + 1));
                            }
                        }
                        else {
                            for (var i = preDiskNum; i > curDiskNum; i--) {
                                $scope.diskList.pop();
                            }
                        }
                        preDiskNum = curDiskNum;
                        $("#" + $scope.diskTable.id).widget().option("data", $scope.diskList);
                    }
                };
                //磁盘列表
                $scope.diskTable = {
                    "id": "createVmDiskTable",
                    "data": null,
                    "enablePagination": false,
                    "columns": [
                        {
                            "sTitle": $scope.i18n.common_term_disk_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.diskName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_capacityGB_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.quantityGB);
                            },
                            "bSortable": false,
                            "sWidth": "360px"
                        },
                        {
                            "sTitle": $scope.i18n.common_term_setMode_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.allocType);
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
                            "sTitle": $scope.i18n.vm_disk_view_para_affectedBySnap_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.indepDisk);
                            },
                            "bSortable": false
                        }
                    ],
                    "callback": function (evtObj) {

                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        if (iDataIndex == 0 && $("#createVmDiskTable th:eq(2)").find(".small-icon-tips").length === 0) {
                            var optColumn = '<span popover="{{i18n.vm_vm_create_para_setMode_mean_tip}}" popover-trigger="mouseenter" ' +
                                'popover-placement="right" class="small-icon small-icon-tips"></span>';
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            var optNode = optLink(optScope);
                            $("#createVmDiskTable th:eq(2)").addClass("allotTypePopover");
                            $("#createVmDiskTable th:eq(2)").append(optNode);

                            var optColumn =
                                '<span popover="{{i18n.vm_vm_create_para_storageMedia_mean_tip}}" popover-trigger="mouseenter" ' +
                                    'popover-placement="right" class="small-icon small-icon-tips"></span>';
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            var optNode = optLink(optScope);
                            $("#createVmDiskTable th:eq(3)").append(optNode);
                        }
                        if (iDataIndex < $scope.templateDiskNum) {
                            $('td:eq(4)', nRow).html(aData.indepDisk ? $scope.i18n.common_term_no_label : $scope.i18n.common_term_yes_button);
                        }
                        else {
                            //容量输入框
                            var options = {
                                "id": "sizeTextbox_" + iDataIndex,
                                "value": aData.quantityGB,
                                "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                                    ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 1048576}) +
                                    ";maxValue(1048576):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 1048576}) +
                                    ";",
                                "change": function () {
                                    $scope.diskTable.data[iDataIndex].quantityGB = $("#" + "sizeTextbox_" + iDataIndex).widget().getValue();
                                }
                            };
                            var select = new Textbox(options);
                            $('td:eq(1)', nRow).html(select.getDom());
                        }

                        //配置模式下拉框
                        var options = {
                            "id": "modeSelect_" + iDataIndex,
                            "width": 150,
                            "values": [
                                {
                                    "selectId": "thick",
                                    "label": $scope.i18n.common_term_common_label,
                                },
                                {
                                    "selectId": "thickformat",
                                    "label": $scope.i18n.common_term_lazyZeroed_label
                                },
                                {
                                    "selectId": "thin",
                                    "label": $scope.i18n.common_term_thinProv_label
                                }
                            ],
                            "default-selectid": aData.allocType,
                            "change": function () {
                                $scope.diskTable.data[iDataIndex].allocType = $("#" + "modeSelect_" + iDataIndex).widget().getSelectedId();
                            }
                        };
                        var select = new Select(options);
                        $('td:eq(2)', nRow).html(select.getDom());

                        //存储介质下拉框
                        var options = {
                            "id": "mediaSelect_" + iDataIndex,
                            "width": 150,
                            "values": [
                                {
                                    "selectId": "SAN-Any",
                                    "label": "Any"
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
                            ],
                            "default-selectid": aData.mediaType ? aData.mediaType : "SAN-Any",
                            "change": function () {
                                $scope.diskTable.data[iDataIndex].mediaType = $("#" + "mediaSelect_" + iDataIndex).widget().getSelectedId();
                            }
                        };
                        var select = new Select(options);
                        $('td:eq(3)', nRow).html(select.getDom());

                        //是否受快照影响下拉框
                        var options = {
                            "id": "influenceSelect_" + iDataIndex,
                            "values": [
                                {
                                    "selectId": "true",
                                    "label": $scope.i18n.common_term_no_label
                                },
                                {
                                    "selectId": "false",
                                    "label": $scope.i18n.common_term_yes_button
                                }
                            ],
                            "default-selectid": aData.indepDisk.toString(),
                            "change": function () {
                                $scope.diskTable.data[iDataIndex].indepDisk = $("#" + "influenceSelect_" + iDataIndex).widget().getSelectedId();
                            }
                        };
                        var select = new Select(options);
                        $('td:eq(4)', nRow).html(select.getDom());
                    }
                };
                //上一步按钮
                $scope.specPreButton = {
                    "id": "specPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.importStep.id).widget().pre();
                        $scope.curStep = "target";
                    }
                };
                //下一步按钮
                $scope.specNextButton = {
                    "id": "specNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#createVmSpecDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.model.coreNum = $("#" + $scope.coreNumTextbox.id).widget().getValue();
                        $scope.model.memorySize = $("#" + $scope.memoryTextbox.id).widget().getValue();
                        $scope.model.memoryUnit = $("#" + $scope.unitSelector.id).widget().getSelectedId();
                        $scope.model.disks = [];
                        for (var i = 0; i < $scope.diskList.length; i++) {
                            var disk = {
                                "quantityGB": $scope.diskList[i].quantityGB,
                                "allocType": $scope.diskList[i].allocType,
                                "mediaType": $scope.diskList[i].mediaType,
                                "indepDisk": $scope.diskList[i].indepDisk
                            };
                            $scope.model.disks.push(disk);
                        }
                        $scope.curStep = "network";
                        $("#" + $scope.nicTable.id).widget().option("columns", columnsWithoutIp);
                        $("#" + $scope.confirmNicTable.id).widget().option("columns", columnsWithoutIp);

                        initNic();
                        $scope.vpcCheckbox.display = false;
                        $scope.model.vpcId = null;
                        $("#" + $scope.vpcCheckbox.id).widget().option("checked", false);
                        $("#" + $scope.importStep.id).widget().next();
                    }
                };
                //取消按钮
                $scope.specCancelButton = {
                    "id": "specCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };

                //选择网络页面
                //选择VPC复选框
                $scope.vpcCheckbox = {
                    id: "vpcCheckbox",
                    text: $scope.i18n.vpc_term_chooseVPC_label,
                    "checked": false,
                    "display": false,
                    "change": function () {
                        var result = $("#" + $scope.vpcCheckbox.id).widget().option("checked");
                        $scope.vpcCheckbox.display = result;
                        if (result) {
                            vpcInfo = {
                                "start": 0,
                                "limit": 10
                            };
                            getVpc();
                        }
                        else {
                            $scope.model.vpcId = null;
                        }
                        initNic();
                    }
                };
                //VPC列表
                var vpcInfo = {
                    "start": 0,
                    "limit": 10
                };
                $scope.vpcTable = {
                    "id": "selectVpcTable",
                    "data": null,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "enablePagination": true,
                    "lengthMenu": [10, 20, 50],
                    "displayLength": 10,
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
                            "sTitle": "VPC ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vpcID);
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
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        }
                    ],
                    "callback": function (evtObj) {
                        vpcInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        getVpc();
                    },
                    "changeSelect": function (pageInfo) {
                        vpcInfo.start = 0;
                        $scope.vpcTable.curPage = {
                            "pageIndex": 1
                        };
                        vpcInfo.limit = pageInfo.displayLength;
                        $scope.vpcTable.displayLength = pageInfo.displayLength;
                        getVpc();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //单选框
                        var options = {
                            "id": "vpcRadio_" + iDataIndex,
                            "checked": aData.checked,
                            "disable": false,
                            "change": function () {
                                var index = 0;
                                while ($("#vpcRadio_" + index).widget()) {
                                    if (index != iDataIndex) {
                                        $("#vpcRadio_" + index).widget().option("checked", false);
                                    }
                                    index++;
                                }
                                var index = 0;
                                var data = $("#" + $scope.vpcTable.id).widget().option("data");
                                while ($("#vpcRadio_" + index).widget()) {
                                    if ($("#vpcRadio_" + index).widget().option("checked")) {
                                        $scope.model.vpcId = data[index].vpcID;
                                        break;
                                    }
                                    index++;
                                }
                                initNic();
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());
                    }
                };
                function getVpc() {
                    var deferred = camel.get({
                        url: {
                            s: "/goku/rest/v1.5/irm/1/vpcs?availablezone={azId}&start={start}&limit={limit}&authenticated={authenticated}",
                            o: {azId: $scope.model.azId, start: vpcInfo.start, limit: vpcInfo.limit, authenticated: "true"}
                        },
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var vpcs = data && data.vpcs || [];
                        for (var i = 0; i < vpcs.length; i++) {
                            vpcs[i].type = vpcs[i].shared ? $scope.i18n.common_term_share_label : $scope.i18n.common_term_common_label;
                        }
                        $scope.$apply(function () {
                            $scope.vpcTable.totalRecords = data.total;
                            $scope.vpcTable.data = vpcs;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function getNic(i) {
                    var num = i >= 10 ? i : "0" + i;
                    var nicItem = {
                        "nic": "Network Adapter " + num,
                        "networkName": ""
                    };
                    return nicItem;
                }

                var nicList = [getNic(1)];
                var preNicNum = 1;
                //网卡个数下拉框
                $scope.nicNumSelector = {
                    "label": $scope.i18n.common_term_NICnum_label + ":",
                    "require": true,
                    "id": "nicNumSelector",
                    "width": "150",
                    "validate": "",
                    "values": [
                        {
                            "selectId": 1,
                            "label": "1",
                            "checked": true
                        },
                        {
                            "selectId": 2,
                            "label": "2"
                        },
                        {
                            "selectId": 3,
                            "label": "3"
                        },
                        {
                            "selectId": 4,
                            "label": "4"
                        },
                        {
                            "selectId": 5,
                            "label": "5"
                        },
                        {
                            "selectId": 6,
                            "label": "6"
                        },
                        {
                            "selectId": 7,
                            "label": "7"
                        },
                        {
                            "selectId": 8,
                            "label": "8"
                        },
                        {
                            "selectId": 9,
                            "label": "9"
                        },
                        {
                            "selectId": 10,
                            "label": "10"
                        },
                        {
                            "selectId": 11,
                            "label": "11"
                        },
                        {
                            "selectId": 12,
                            "label": "12"
                        }
                    ],
                    "change": function () {
                        var curNicNum = parseInt($("#" + $scope.nicNumSelector.id).widget().getSelectedId());
                        if (preNicNum < curNicNum) {
                            for (var i = preNicNum; i < curNicNum; i++) {
                                nicList.push(getNic(i + 1));
                            }
                        }
                        else {
                            for (var i = preNicNum; i > curNicNum; i--) {
                                nicList.pop();
                            }
                        }
                        preNicNum = curNicNum;
                        $("#" + $scope.nicTable.id).widget().option("data", nicList);
                    }
                };
                var columnsWithoutIp = [
                    {
                        "sTitle": $scope.i18n.common_term_NIC_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.nic);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vpc_term_net_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.networkName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false
                    }
                ];
                //网卡列表
                $scope.nicTable = {
                    "id": "createVmNicTable",
                    "data": nicList,
                    "enablePagination": false,
                    "columns": columnsWithoutIp,
                    "callback": function (evtObj) {

                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //绑定网络按钮
                        var options = {
                            "id": "networkButton_" + iDataIndex,
                            "text": $scope.i18n.common_term_config_button,
                            "click": function () {
                                if ($scope.vpcCheckbox.display && !$scope.model.vpcId) {
                                    vpcMessage();
                                    return;
                                }
                                var newWindow = new Window({
                                    "winId": "bindNetworkWindow",
                                    "title": $scope.i18n.vm_term_chooseNet_label,
                                    "cluster": {
                                        clusterId: $scope.model.clusterId,
                                        clusterIndex: $scope.model.clusterIndex,
                                        zoneId: $scope.model.zoneId
                                    },
                                    "nic": $scope.nicTable.data[iDataIndex],
                                    "vpcId": $scope.model.vpcId,
                                    "content-type": "url",
                                    "buttons": null,
                                    "content": "app/business/resources/views/hypervisor/vm/createVmNic.html",
                                    "height": 500,
                                    "width": 680,
                                    "close": function () {
                                        $("#" + $scope.nicTable.id).widget().option("data", $scope.nicTable.data);
                                    }
                                });
                                newWindow.show();
                            }
                        };
                        var button = new Button(options);
                        $('td:eq(2)', nRow).html(button.getDom());
                    }
                };
                //上一步按钮
                $scope.networkPreButton = {
                    "id": "networkPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.importStep.id).widget().pre();
                        $scope.curStep = "spec";
                    }
                };
                //下一步按钮
                $scope.networkNextButton = {
                    "id": "networkNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        $scope.model.nics = [];
                        var data = $("#" + $scope.nicTable.id).widget().option("data");
                        var nicIndex = 0;
                        for (; nicIndex < data.length; nicIndex++) {
                            if (data[nicIndex].exnetworkID) {
                                $scope.model.nics.push({
                                    "networkId": data[nicIndex].exnetworkID
                                });
                            }
                            else {
                                nicMessage();
                                break;
                            }
                        }
                        if (nicIndex >= data.length) {
                            $scope.curStep = "confirm";
                            $("#" + $scope.importStep.id).widget().next();
                            $("#" + $scope.confirmDiskTable.id).widget().option("data", $scope.diskList);
                            $("#" + $scope.confirmNicTable.id).widget().option("data", $scope.nicTable.data);
                        }
                    }
                };
                //取消按钮
                $scope.networkCancelButton = {
                    "id": "networkCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };

                //确认页面
                $scope.label = {
                    "useAccount": $scope.i18n.vm_vm_import_para_useLocalUser_label + ":",
                    "cluster": $scope.i18n.vm_term_targetCluster_label + ":",
                    "host": $scope.i18n.vm_term_targetHost_label + ":",
                    "template": $scope.i18n.template_term_vm_label + ":",
                    "osType": $scope.i18n.common_term_OStype_label + ":",
                    "osVersion": $scope.i18n.common_term_OSversion_label + ":",
                    "importTitle": $scope.i18n.vm_term_importVM_button
                };
                //磁盘列表
                $scope.confirmDiskTable = {
                    "id": "confirmDiskTable",
                    "data": null,
                    "label": $scope.i18n.common_term_disk_label + ":",
                    "enablePagination": false,
                    "columns": [
                        {
                            "sTitle": $scope.i18n.common_term_disk_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.diskName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_capacityGB_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.quantityGB);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_setMode_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.allocType);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_storageMedia_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.mediaType === "SAN-Any" ? "Any" : data.mediaType);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.vm_disk_view_para_affectedBySnap_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.indepDisk);
                            },
                            "bSortable": false
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(2)', nRow).html(allocTypes[aData.allocType]);
                        $('td:eq(4)', nRow).html(aData.indepDisk ? $scope.i18n.common_term_no_label : $scope.i18n.common_term_yes_button);
                    }
                };
                //网卡列表
                $scope.confirmNicTable = {
                    "id": "confirmNicTable",
                    "data": null,
                    "label": $scope.i18n.common_term_NIC_label + ":",
                    "enablePagination": false,
                    "columns": columnsWithoutIp
                };
                //自动启动复选框
                $scope.autoBootCheckbox = {
                    id: "autoBootCheckbox",
                    text: $scope.i18n.vm_vm_importVM_para_autoStart_label,
                    "checked": true
                };
                //上一步按钮
                $scope.confirmPreButton = {
                    "id": "confirmPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.importStep.id).widget().pre();
                        if ($scope.model.occupiedVmId) {
                            $scope.curStep = "template";
                        }
                        else {
                            $scope.curStep = "network";
                        }
                    }
                };
                //确定按钮
                $scope.confirmOkButton = {
                    "id": "confirmOkButton",
                    "text": $scope.i18n.common_term_ok_button,
                    "click": function () {
                        if ($scope.model.occupiedVmId) {
                            createOccupyVm();
                        }
                        else {
                            createTemplateVm();
                        }
                    }
                };
                //取消按钮
                $scope.confirmCancelButton = {
                    "id": "confirmCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };
                function goBack() {
                    $state.go($scope.from, {
                        name: $scope.vmName, vmId: $scope.model.occupiedVmId, clusterId: $scope.clusterId,
                        clusterName: $scope.clusterName, indexId: $scope.clusterIndex, hyperId: $scope.hypervisorId
                    });
                }

                function getClusters() {
                    var params = {
                        "list": {
                            "requestType": "ALL",
                            "start": clusterInfo.start,
                            "limit": clusterInfo.limit,
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
                        var total = data && data.list && data.list.total || 0;
                        for (var i = 0; i < resourceClusters.length; i++) {
                            resourceClusters[i].type = clusterTypes[resourceClusters[i].type] || resourceClusters[i].type;
                        }
                        $scope.$apply(function () {
                            $scope.clusterTable.totalRecords = total;
                            $scope.clusterTable.data = resourceClusters;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function getCluster(clusterId) {
                    var deferred = camel.get({
                        "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}", o: {id: clusterId}},
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        $scope.model.azId = data.resourceCluster.availableZoneId;
                        $scope.zoneId = data.resourceCluster.zoneId;
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function getHost() {
                    $scope.curCluster = $scope.clusterId ? $scope.clusterId : $scope.curCluster;
                    var params = {
                        clusterId: $scope.curCluster
                    };
                    var deferred = camel.post({
                        "url": " /goku/rest/v1.5/irm/1/hosts",
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var hosts = data && data.hosts || [];
                        for (var i = 0; i < hosts.length; i++) {
                            hosts[i].statusStr = hostStatus[hosts[i].status] || hosts[i].status;
                            hosts[i].mainten = hosts[i].maintenanceStatus ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                        }
                        $scope.$apply(function () {
                            $scope.hostTable.data = hosts;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function vpcMessage() {
                    var options = {
                        type: "error",
                        content: $scope.i18n.vm_vm_create_info_noVPC_msg,
                        height: "150px",
                        width: "350px"
                    };
                    var msg = new Message(options);
                    msg.show();
                }
                function nicMessage() {
                    var options = {
                        type: "error",
                        content: $scope.i18n.vm_vm_create_info_NICnoNet_msg,
                        height: "150px",
                        width: "350px"
                    };
                    var msg = new Message(options);
                    msg.show();
                }

                function createTemplateVm() {
                    var memorySize = parseInt($scope.model.memorySize);
                    if ($scope.model.memoryUnit === "GB") {
                        memorySize = memorySize * 1024;
                    }
                    var autoBoot = $("#" + $scope.autoBootCheckbox.id).widget().option("checked");
                    var templateModel = {
                        "importVm": {
                            "name": $scope.model.vmName,
                            "description": $scope.model.description,
                            "fileName": $scope.model.templateFile,
                            "url": $scope.model.templateDir,
                            "protocol": $scope.model.protocol,
                            "userName": $scope.model.username,
                            "passWord": $scope.model.password,
                            "autoBoot": autoBoot,
                            "clusterId": $scope.model.clusterId,
                            "vmConfig": {
                                "cpu": {
                                    "quantity": $scope.model.coreNum
                                },
                                "memory": {
                                    "quantityMB": memorySize
                                },
                                "disks": $scope.model.disks,
                                "nics": $scope.model.nics
                            },
                            "osInfo": {
                                "osType": $scope.model.osType,
                                "osVersion": $scope.model.osVersion
                            }
                        }
                    };
                    if ($scope.model.selectHost) {
                        templateModel.importVm.hostId = $scope.model.hostId;
                    }
                    if ($scope.model.vpcId) {
                        templateModel.importVm.vpcId = $scope.model.vpcId;
                    }
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                        "params": JSON.stringify(templateModel),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        createMessage();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function createOccupyVm() {
                    var disks = $scope.model.vmConfig.disks || [];
                    $scope.model.disks = [];
                    for (var i = 0; i < disks.length; i++) {
                        var disk = {
                            "quantityGB": disks[i].quantityGB,
                            "volumeUuid": disks[i].volumeUuid
                        };
                        $scope.model.disks.push(disk);
                    }

                    var templateModel = {
                        "importVm": {
                            "url": $scope.model.templateDir,
                            "protocol": $scope.model.protocol,
                            "fileName": $scope.model.templateFile,
                            "userName": $scope.model.username,
                            "passWord": $scope.model.password,
                            "clusterId": $scope.model.clusterId,
                            "vmConfig": {
                                "cpu": {
                                    "quantity": $scope.model.coreNum
                                },
                                "memory": {
                                    "quantityMB": $scope.model.memorySize
                                },
                                "disks": $scope.model.disks
                            },
                            "osInfo": {
                                "osType": $scope.model.osType,
                                "osVersion": $scope.model.osVersion
                            },
                            "uuId": $scope.model.uuid,
                            "occupiedVmId": $scope.model.occupiedVmId
                        }
                    };
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                        "params": JSON.stringify(templateModel),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        createMessage();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
                function initNic() {
                    nicList = [getNic(1)];
                    $scope.nicTable.data = nicList;
                    preNicNum = 1;
                    $("#" + $scope.nicNumSelector.id).widget().opChecked(1);
                    $("#" + $scope.nicTable.id).widget().option("data", nicList);
                }
                function createMessage() {
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
                                    $state.go("system.taskCenter");
                                    msg.destroy();
                                }
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                    goBack();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                }
            }];
        return importVmCtrl;
    });