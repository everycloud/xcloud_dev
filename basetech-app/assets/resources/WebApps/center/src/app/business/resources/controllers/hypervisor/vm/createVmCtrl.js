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
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, Radio, Select, Textbox, Button, Window, Message, UnifyValid, Exception) {
        "use strict";

        var createVmCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "validator",
            function ($scope, $compile, $state, $stateParams, camel, validator) {
                //创建虚拟机的入口有，集群里的虚拟机列表，虚拟机克隆，模板列表
                var exceptionService = new Exception();
                var user = $("html").scope().user;
                $scope.stepUrl = {
                    "step1": "../src/app/business/resources/views/hypervisor/vm/createVmTemplate.html",
                    "step2": "../src/app/business/resources/views/hypervisor/vm/createVmBasic.html",
                    "step3": "../src/app/business/resources/views/hypervisor/vm/createVmSpec.html",
                    "step4": "../src/app/business/resources/views/hypervisor/vm/createVmNetwork.html",
                    "step5": "../src/app/business/resources/views/hypervisor/vm/createVmConfirm.html"
                };
                var stepValues = {
                    template: [$scope.i18n.vm_term_chooseTemplateOrVM_label, $scope.i18n.common_term_basicInfo_label, $scope.i18n.spec_term_vm_label,
                        $scope.i18n.vm_term_chooseNet_label, $scope.i18n.common_term_confirmInfo_label],
                    empty: [$scope.i18n.vm_term_chooseTemplateOrVM_label, $scope.i18n.common_term_basicInfo_label, $scope.i18n.spec_term_vm_label,
                        $scope.i18n.common_term_confirmInfo_label]
                };
                $scope.step = "template";
                $scope.createStep = {
                    "id": "createVmStep",
                    "values": stepValues.template,
                    "width": "800",
                    "jumpable": false
                };
                var allocTypes = {
                    "thick": $scope.i18n.common_term_common_label,
                    "thickformat": $scope.i18n.common_term_lazyZeroed_label,
                    "thin": $scope.i18n.common_term_thinProv_label
                };
                var vmtType = {
                    "vapp_template": $scope.i18n.template_term_appVM_label,
                    "desktop_template": $scope.i18n.template_term_deskVM_label,
                    "vsa_template": $scope.i18n.template_term_VSA_label,
                    "pvm_template": $scope.i18n.template_term_PVM_label
                };

                function getInfluence(indepDisk) {
                    return indepDisk.toString() === "true" ? $scope.i18n.common_term_no_label : $scope.i18n.common_term_yes_button;
                }

                $scope.action = "";
                $scope.action = $stateParams.action;
                $scope.createType = "template";
                $scope.vmId = $stateParams.vmId;
                $scope.cloneVmName = $stateParams.cloneVmName;
                $scope.templateId = $stateParams.tid;
                $scope.templateDiskNum = 1;
                $scope.clusterName = $stateParams.clusterName;
                $scope.clusterIndex = $stateParams.clusterIndex;
                //以clusterId来标识是否是在集群内创建虚拟机
                $scope.clusterId = $stateParams.clusterId;
                $scope.hypervisorId = $stateParams.hyperId;

                $scope.model = { };

                //选择模板或虚拟机页面
                //创建类型单选组
                $scope.createTypeRadioGroup = {
                    "id": "createTypeRadioGroup",
                    "label": $scope.i18n.common_term_createMode_label+":",
                    "values": [
                        {
                            "key": "template",
                            "text": $scope.i18n.vm_term_templateCreateVM_label,
                            "checked": true,
                            "disabled": false
                        },
                        {
                            "key": "empty",
                            "text": $scope.i18n.vm_term_createVM_button,
                            "checked": false,
                            "disabled": false
                        }
                    ],
                    "layout": "horizon",
                    "change": function () {
                        $scope.createType = $("#" + $scope.createTypeRadioGroup.id).widget().opChecked("checked");
                        $("#" + $scope.createStep.id).widget().option("values", stepValues[$scope.createType]);
                        var disable = $scope.createType === "empty";
                        var index = 0;
                        while ($("#templateRadio_" + index).widget()) {
                            $("#templateRadio_" + index).widget().option("disable", disable);
                            index++;
                        }
                    }
                };
                //模板列表
                var templateInfo = {
                    "start": 0,
                    "limit": 10
                };
                $scope.templateTable = {
                    "id": "selectTemplateTable",
                    "data": null,
                    "columnsDraggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "enablePagination": true,
                    "lengthMenu": [10, 20, 50],
                    "displayLength": 10,
                    "columns": [
                        {
                            "sTitle": "",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vmtName);
                            },
                            "bSortable": false,
                            "sWidth": 40
                        },
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vmtName);
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
                            "sTitle": $scope.i18n.common_term_OStype_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.osType);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_OSversion_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.osVersion);
                            },
                            "bSortable": false,
                            "sWidth": 300
                        }
                    ],
                    "callback": function (evtObj) {
                        templateInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        getTemplates();
                    },
                    "changeSelect": function (pageInfo) {
                        templateInfo.start = 0;
                        $scope.templateTable.curPage = {
                            "pageIndex": 1
                        };
                        templateInfo.limit = pageInfo.displayLength;
                        $scope.templateTable.displayLength = pageInfo.displayLength;
                        getTemplates();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(1)', nRow).addTitle();
                        $('td:eq(2)', nRow).html(vmtType[aData.type] || $.encoder.encodeForHTML(aData.type));
                        //单选框
                        var options = {
                            "id": "templateRadio_" + iDataIndex,
                            "checked": aData.checked,
                            "disable": false,
                            "change": function () {
                                var index = 0;
                                while ($("#templateRadio_" + index).widget()) {
                                    if (index != iDataIndex) {
                                        $("#templateRadio_" + index).widget().option("checked", false);
                                    }
                                    index++;
                                }
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());
                    }
                };
                function getTemplates() {
                    var virtualenvid = $scope.hypervisorId ? $scope.hypervisorId : "";
                    var deferred = camel.get({
                        url: {
                            s: "/goku/rest/v1.5/sr/1/vmtemplates?limit={limit}&start={start}&status={status}&virtualenvid={virtualenvid}",
                            o: {
                                limit: templateInfo.limit,
                                start: templateInfo.start,
                                status: "FINISHED",
                                virtualenvid: virtualenvid
                            }
                        },
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var vmtemplates = data.vmtemplates;
                        $scope.$apply(function () {
                            $scope.templateTable.totalRecords = data.totalNum;
                            $scope.templateTable.data = vmtemplates;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function getTemplate(templateId) {
                    var deferred = camel.get({
                        url: {
                            s: "/goku/rest/v1.5/sr/1/vmtemplates/{id}",
                            o: {id: templateId}
                        },
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var templateData = [];
                        var template = {
                            vmtId: templateId,
                            clusterId: data.clusterInfo.clusterId,
                            checked: true,
                            vmtName: data.name,
                            type: data.type,
                            osType: data.osOption.osType,
                            osVersion: data.osOption.osVersion
                        };
                        templateData.push(template);
                        $scope.$apply(function () {
                            $scope.templateTable.totalRecords = 1;
                            $scope.templateTable.data = templateData;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                //下一步按钮
                $scope.templateNextButton = {
                    "id": "templateNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //模板部署虚拟机
                        if ($scope.action === "create" && $scope.createType === "template") {
                            var index = 0;
                            var data = $scope.templateTable.data;
                            while ($("#templateRadio_" + index).widget()) {
                                if ($("#templateRadio_" + index).widget().option("checked")) {
                                    $scope.model.vmTemplateId = data[index].vmtId;
                                    $scope.model.template = data[index].vmtName;
                                    $scope.model.confirmOsType = data[index].osType;
                                    $scope.model.confirmOsVersion = data[index].osVersion;
                                    $scope.templateCluster = data[index].clusterId;
                                    break;
                                }
                                index++;
                            }
                            if (!$scope.model.vmTemplateId) {
                                return;
                            }
                            var ids = $scope.model.vmTemplateId.split(";");
                            $scope.model.hypervisorId = ids[2];
                            getClusters();
                        }
                        //克隆虚拟机
                        else if ($scope.action === "clone") {
                            var ids = $scope.vmId.split("$");
                            $scope.model.hypervisorId = ids[0];
                            getClusters();
                        }
                        //创建裸虚拟机
                        else {
                            $scope.model.hypervisorId = $scope.hypervisorId;
                            getHosts($scope.clusterId);
                        }
                        getHypervisor();
                        $("#" + $scope.createStep.id).widget().next();
                        $scope.step = "basic";
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

                //克隆虚拟机页面
                //虚拟机列表
                $scope.vmTable = {
                    "id": "selectVmTable",
                    "data": null,
                    "enablePagination": false,
                    "columnsDraggable": true,
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
                            "sTitle": $scope.i18n.common_term_OStype_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.osType);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_OSversion_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.osVersion);
                            },
                            "bSortable": false
                        }
                    ],
                    "callback": function (evtObj) {

                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //单选框
                        var options = {
                            "id": "vmRadio_" + iDataIndex,
                            "checked": true,
                            "disable": false,
                            "change": function () {

                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());
                    }
                };
                function getVm() {
                    var deferred = camel.get({
                        url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var vmInfo = data && data.vmInfo;
                        var vmData = [];
                        var vm = {
                            id: vmInfo.id,
                            name: vmInfo.name,
                            hypervisorId: vmInfo.hypervisorId
                        };
                        if (vmInfo.os) {
                            vm.osType = vmInfo.os.osType;
                            vm.osVersion = vmInfo.os.osVersiontype;
                        }
                        vmData.push(vm);
                        $scope.model.template = vm.name;
                        $scope.model.confirmOsType = vm.osType;
                        $scope.model.confirmOsVersion = vm.osVersion;
                        $scope.model.osVersionNum = vmInfo.os.osVersion;
                        $scope.model.bootOption = vmInfo.vmConfig.attribute.bootOption;
                        $scope.model.cpuHotPlug = vmInfo.vmConfig.cpu.cpuHotPlug;
                        $scope.templateDiskNum = vmInfo.vmConfig.disks.length;
                        $scope.templateCluster = vmInfo.clusterId;
                        $scope.diskList = [];
                        for (var i = 0; i < vmInfo.vmConfig.disks.length; i++) {
                            var diskInfo = vmInfo.vmConfig.disks[i];
                            if (diskInfo.mediaType === "SAN_ANY") {
                                diskInfo.mediaType = "SAN-Any";
                            }
                            diskInfo.name = diskInfo.diskName;
                            $scope.diskList.push(diskInfo);
                        }
                        $scope.$apply(function () {
                            $scope.model.hyperType = vmInfo.vmType === "fusioncompute" ? "FusionCompute" : vmInfo.vmType;
                            $scope.model.hyperType = vmInfo.vmType === "vmware" ? "VMware" : vmInfo.vmType;
                            $scope.vmTable.data = vmData;
                            $scope.vmTable.totalRecords = 1;
                            $scope.nameTextbox.value = vmInfo.name;
                            $scope.coreNum = vmInfo.vmConfig.cpu.quantity;
                            $scope.model.cpuQos = vmInfo.vmConfig.cpu;
                            $scope.memoryTextbox.value = vmInfo.vmConfig.memory.quantityMB;
                            $scope.model.memoryQos = vmInfo.vmConfig.memory;
                        });
                        $("#" + $scope.bootOptionSelector.id).widget().opChecked($scope.model.bootOption);
                        $("#" + $scope.antiVirusCheckbox.id).widget().option("checked", !!vmInfo.vmConfig.attribute.secureVmType);
                        $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("SVM", !vmInfo.vmConfig.attribute.secureVmType);
                        $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("GVM", !vmInfo.vmConfig.attribute.secureVmType);
                        $("#" + $scope.secureVmTypeRadio.id).widget().opChecked(vmInfo.vmConfig.attribute.secureVmType, true);
                        setDiskNumSelector(0);
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                //基本信息页面
                //名称输入框
                $scope.nameTextbox = {
                    "label": $scope.i18n.vm_term_vmName_label + ":",
                    "require": true,
                    "id": "createVmNameTextbox",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(56):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "56"}) +
                        ";regularCheck(" + validator.vmNameCharReg +
                        "):" + $scope.i18n.common_term_composition7_valid
                };
                //计算机名称输入框
                $scope.computerNameTextbox = {
                    "label": $scope.i18n.common_term_computerName_label + ":",
                    "require": false,
                    "id": "ComputerNameTextbox",
                    "value": "",
                    "extendFunction": ["computerNameCheck"],
                    "validate": "maxSize(13):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 13}) +
                        ";regularCheck(" + validator.computerNameCharReg +
                        "):" + $scope.i18n.common_term_composition12_valid + ";computerNameCheck():" + $scope.i18n.common_term_notOnlyDigit_valid
                };
                UnifyValid.computerNameCheck = function () {
                    var name = $("#" + $scope.computerNameTextbox.id).widget().getValue();
                    var computerReg = /^[0-9]{1,}$/;
                    var isNum = computerReg.test(name);
                    return !isNum;
                };

                $scope.DisasterGroupsItems = [];
                //一致性容灾存储息复选框
                $scope.toleranceCheckbox = {
                    id: "toleranceCheckbox",
                    text: $scope.i18n.vm_vm_create_para_useDisasterStor_label,
                    "change": function () {
                        if ($scope.toleranceCheckbox.checked == false) {
                            $scope.toleranceCheckbox.checked = true;
                            $scope.toleranceSelector.disable = true;
                            $("#" + $scope.toleranceSelector.id).widget().opChecked("");
                        } else {
                            $scope.toleranceSelector.disable = false;
                            getDisasterGroups(function (groups) {
                                var items = [];
                                if (groups) {
                                    for (var i = 0; i < groups.length; i++) {
                                        items.push({selectId: groups[i].id, label: $.encoder.encodeForHTML(groups[i].name)});
                                    }
                                    $scope.$apply(function () {
                                        $scope.toleranceSelector.values = items;
                                    });
                                    $scope.DisasterGroupsItems = items;
                                }
                            });
                            $scope.toleranceCheckbox.checked = false;
                        }
                    }
                };
                //容灾存储组下拉框
                $scope.toleranceSelector = {
                    "label": $scope.i18n.resource_term_disasterStorGroup_label + ":",
                    "require": true,
                    disable: true,
                    "id": "toleranceSelector",
                    "width": "150",
                    "validate": "",
                    "values": $scope.DisasterGroupsItems
                };
                //集群列表
                var clusterInfo = {
                    "start": 0,
                    "limit": 10
                };
                $scope.clusterTable = {
                    "label": $scope.i18n.virtual_term_clusters_label + ":",
                    "require": true,
                    "id": "selectClusterTable",
                    "data": null,
                    "columnsDraggable": true,
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
                        },
                        {
                            "sTitle": $scope.i18n.cloud_term_tag_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.tags);
                            },
                            "bSortable": false
                        }
                    ],
                    "callback": function (evtObj) {
                        clusterInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        getTemplates();
                    },
                    "changeSelect": function (pageInfo) {
                        clusterInfo.start = 0;
                        $scope.clusterTable.curPage = {
                            "pageIndex": 1
                        };
                        clusterInfo.limit = pageInfo.displayLength;
                        $scope.clusterTable.displayLength = pageInfo.displayLength;
                        getTemplates();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(1)', nRow).addTitle();
                        $('td:eq(2)', nRow).addTitle();
                        $('td:eq(3)', nRow).addTitle();
                        $('td:eq(4)', nRow).addTitle();
                        $('td:eq(5)', nRow).addTitle();
                        //单选框
                        var options = {
                            "id": "clusterRadio_" + iDataIndex,
                            "checked": aData.checked,
                            "disable": false,
                            "change": function () {
                                var index = 0;
                                while ($("#clusterRadio_" + index).widget()) {
                                    if (index == iDataIndex) {
                                        $scope.selectedCluster = $scope.clusterTable.data[index];
                                        getHosts($scope.selectedCluster.id);
                                        if ($("#" + $scope.toleranceCheckbox.id).widget().option("checked")) {
                                            getDisasterGroups(function (groups) {
                                                var items = [];
                                                if (groups) {
                                                    for (var i = 0; i < groups.length; i++) {
                                                        items.push({selectId: groups[i].id, label: $.encoder.encodeForHTML(groups[i].name)});
                                                    }
                                                    $scope.$apply(function () {
                                                        $scope.toleranceSelector.values = items;
                                                    });
                                                    $scope.DisasterGroupsItems = items;
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        $("#clusterRadio_" + index).widget().option("checked", false);
                                    }
                                    index++;
                                }
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());
                    }
                };
                //主机下拉框
                $scope.hostSelector = {
                    "label": $scope.i18n.common_term_host_label + ":",
                    "require": false,
                    "id": "hostSelector",
                    "width": "150",
                    "values": [
                    ]
                };
                function getClusters() {
                    if ($scope.clusterId) {
                        getHosts($scope.clusterId);
                        return;
                    }
                    $scope.selectedCluster = null;
                    if ($("#" + $scope.hostSelector.id).widget()) {
                        $("#" + $scope.hostSelector.id).widget().option("values", []);
                        $("#" + $scope.toleranceSelector.id).widget().option("values", []);
                    }
                    var params = {
                        "list": {
                            "hypervisorId": $scope.model.hypervisorId,
                            "requestType": "ASSOCIATED",
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
                        for (var i = 0; i < resourceClusters.length; i++) {
                            if (resourceClusters[i].indexId == $scope.templateCluster) {
                                resourceClusters[i].checked = true;
                                $scope.selectedCluster = resourceClusters[i];
                                getHosts(resourceClusters[i].id);
                            }
                        }
                        $scope.$apply(function () {
                            var total = data && data.list && data.list.total || 0;
                            $scope.clusterTable.totalRecords = total;
                            $scope.clusterTable.data = resourceClusters;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function getHosts(clusterId) {
                    var params = {
                        clusterId: clusterId
                    };
                    var deferred = camel.post({
                        "url": " /goku/rest/v1.5/irm/1/hosts",
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var hosts = data && data.hosts || [];
                        var values = [];
                        for (var i = 0; i < hosts.length; i++) {
                            var host = {
                                "selectId": hosts[i].id,
                                "label": hosts[i].name
                            };
                            values.push(host);
                        }
                        $("#" + $scope.hostSelector.id).widget().option("values", values);
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                //加入域复选框
                $scope.domainCheckbox = {
                    id: "domainCheckbox",
                    text: $scope.i18n.vm_vm_create_para_joinWindowsDomain_label,
                    "change": function () {
                        var result = $("#" + $scope.domainCheckbox.id).widget().option("checked");
                        $("#" + $scope.domainNameTextbox.id).widget().option("disable", !result);
                        $("#" + $scope.domainUsernameTextbox.id).widget().option("disable", !result);
                        $("#" + $scope.domainPasswordTextbox.id).widget().option("disable", !result);
                        $("#" + $scope.domainConfirmTextbox.id).widget().option("disable", !result);
                    }
                };
                //域名输入框
                $scope.domainNameTextbox = {
                    "label": $scope.i18n.common_term_domainName_label + ":",
                    "require": true,
                    "id": "domainNameTextbox",
                    "disable": true,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";"
                };
                //域用户级名输入框
                $scope.domainUsernameTextbox = {
                    "label": $scope.i18n.common_term_domainUserName_label + ":",
                    "require": true,
                    "id": "domainUsernameTextbox",
                    "disable": true,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";"
                };
                //域密码输入框
                $scope.domainPasswordTextbox = {
                    "label": $scope.i18n.common_term_domainPsw_label + ":",
                    "require": true,
                    "id": "domainPasswordTextbox",
                    "disable": true,
                    "type": "password",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";"
                };
                //确认密码输入框
                $scope.domainConfirmTextbox = {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "require": true,
                    "id": "domainConfirmTextbox",
                    "disable": true,
                    "type": "password",
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                };
                UnifyValid.infoPwdEqual = function () {
                    if ($("#" + $scope.domainPasswordTextbox.id).widget().getValue() === $("#" + $scope.domainConfirmTextbox.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
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
                //上一步按钮
                $scope.basicPreButton = {
                    "id": "basicPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.createStep.id).widget().pre();
                        $scope.step = "template";
                    }
                };
                //下一步按钮
                $scope.basicNextButton = {
                    "id": "basicNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#createVmBasicDiv"));
                        if (!result || (!$scope.selectedCluster && !$scope.clusterId)) {
                            return;
                        }
                        $scope.model.vmName = $("#" + $scope.nameTextbox.id).widget().getValue();
                        $scope.model.vmName = $.trim($scope.model.vmName);
                        $scope.model.clusterId = $scope.clusterId ? $scope.clusterId : $scope.selectedCluster.id;
                        $scope.clusterIndex = $scope.clusterId ? $scope.clusterIndex : $scope.selectedCluster.indexId;
                        $scope.zoneId = $scope.clusterId ? $scope.zoneId : $scope.selectedCluster.zoneId;
                        $scope.model.clusterName = $scope.clusterName ? $scope.clusterName : $scope.selectedCluster.name;
                        $scope.model.hostId = $("#" + $scope.hostSelector.id).widget().getSelectedId();
                        $scope.model.hostName = $("#" + $scope.hostSelector.id).widget().getSelectedLabel();
                        $scope.model.description = $("#" + $scope.basicDescTextbox.id).widget().getValue();
                        if ($scope.createType !== "empty") {
                            $scope.model.isDisasterVm = $("#" + $scope.toleranceCheckbox.id).widget().option("checked");
                            $scope.model.computerName = $("#" + $scope.computerNameTextbox.id).widget().getValue();
                            $scope.model.computerName = $scope.model.computerName === "" ? null : $scope.model.computerName;
                            $scope.model.joinDomain = $("#" + $scope.domainCheckbox.id).widget().option("checked");
                            if ($scope.model.joinDomain) {
                                $scope.model.domainName = $("#" + $scope.domainNameTextbox.id).widget().getValue();
                                $scope.model.domainUsername = $("#" + $scope.domainUsernameTextbox.id).widget().getValue();
                                $scope.model.domainPassword = $("#" + $scope.domainPasswordTextbox.id).widget().getValue();
                                $scope.model.domainPwdConfirm = $("#" + $scope.domainConfirmTextbox.id).widget().getValue();
                            }
                            if ($scope.action === "create") {
                                getTemplateSpec();
                                getCluster($scope.model.clusterId);
                            }
                            else if ($scope.action === "clone") {
                                getDiskMap();
                                getCoreLimit();
                            }
                        }
                        else {
                            getDiskMap();
                        }
                        $("#" + $scope.createStep.id).widget().next();
                        $scope.step = "spec";
                    }
                };
                //取消按钮
                $scope.basicCancelButton = {
                    "id": "basicCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };
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

                function getHypervisor() {
                    var deferred = camel.get({
                        "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id: $scope.model.hypervisorId}},
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            $scope.model.hyperType = data.hypervisor.type;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                //虚拟机规格页面
                $scope.osTypeSelector = {
                    label: $scope.i18n.common_term_OStype_label + ":",
                    require: true,
                    "id": "createVmtSpecOSType",
                    "width": "150px",
                    "values": [
                        {
                            "selectId": "Linux",
                            "label": "Linux",
                            "checked": true
                        },
                        {
                            "selectId": "Windows",
                            "label": "Windows"
                        }
                    ],
                    "change": function () {
                        var osType = $("#" + $scope.osTypeSelector.id).widget().getSelectedId();
                        $scope.osVesionSelector.values = $scope.versionConfig.getVersionInfo(osType);
                    }
                };
                $scope.versionConfig = {
                    "Linux": "Novell SUSE Linux Enterprise Server 10 SP1 32bit_34;Novell SUSE Linux Enterprise Server 10 SP1 64bit_35;Novell SUSE Linux Enterprise Server 10 SP2 32bit_36;Novell SUSE Linux Enterprise Server 10 SP2 64bit_37;Novell SUSE Linux Enterprise Server 10 SP3 32bit_38;Novell SUSE Linux Enterprise Server 10 SP3 64bit_39;Novell SUSE Linux Enterprise Server 11 SP0 32bit_40;Novell SUSE Linux Enterprise Server 11 SP0 64bit_41;Novell SUSE Linux Enterprise Server 11 SP1 32bit_42;Novell SUSE Linux Enterprise Server 11 SP1 64bit_43;Redhat Linux Enterprise 4.5 32bit_44;Redhat Linux Enterprise 4.6 64bit_45;Redhat Linux Enterprise 5.0 32bit_46;Redhat Linux Enterprise 5.0 64bit_47;Redhat Linux Enterprise 5.1 32bit_48;Redhat Linux Enterprise 5.1 64bit_49;Redhat Linux Enterprise 5.2 32bit_50;Redhat Linux Enterprise 5.2 64bit_51;Redhat Linux Enterprise 5.3 32bit_52;Redhat Linux Enterprise 5.3 64bit_53;Redhat Linux Enterprise 5.4 32bit_54;Redhat Linux Enterprise 5.5 64bit_55;CentOS 4.8 32bit_56;CentOS 5.4 64bit_57;CentOS 5.5 32bit_58;Novell SUSE Linux Enterprise Server 10 SP4 32bit_62;Novell SUSE Linux Enterprise Server 10 SP4 64bit_63;Novell SUSE 11 SP1 CUSTOMIZED 64bit_64;Redhat Linux Enterprise 4.4 32bit_65;Redhat Linux Enterprise 4.4 64bit_66;Redhat Linux Enterprise 4.5 64bit_67;Redhat Linux Enterprise 4.6 32bit_68;Redhat Linux Enterprise 4.7 32bit_69;Redhat Linux Enterprise 4.7 64bit_70;Redhat Linux Enterprise 4.8 32bit_71;Redhat Linux Enterprise 4.8 64bit_72;Redhat Linux Enterprise 5.4 64bit_73;Redhat Linux Enterprise 5.5 32bit_74;Redhat Linux Enterprise 5.6 32bit_75;Redhat Linux Enterprise 5.6 64bit_76;Redhat Linux Enterprise 5.7 32bit_77;Redhat Linux Enterprise 5.7 64bit_78;Redhat Linux Enterprise 5.8 32bit_79;Redhat Linux Enterprise 5.8 64bit_80;Redhat Linux Enterprise 6.0 32bit_81;Redhat Linux Enterprise 6.0 64bit_82;Redhat Linux Enterprise 6.1 32bit_83;Redhat Linux Enterprise 6.1 64bit_84;Redhat Linux Enterprise 6.2 32bit_85;Redhat Linux Enterprise 6.2 64bit_86;CentOS 4.4 32bit_87;CentOS 4.4 64bit_88;CentOS 4.5 32bit_89;CentOS 4.5 64bit_90;CentOS 4.6 32bit_91;CentOS 4.6 64bit_92;CentOS 4.7 32bit_93;CentOS 4.7 64bit_94;CentOS 4.8 64bit_95;CentOS 5.0 32bit_96;CentOS 5.0 64bit_97;CentOS 5.1 32bit_98;CentOS 5.1 64bit_99;CentOS 5.2 32bit_100;CentOS 5.2 64bit_101;CentOS 5.3 32bit_102;CentOS 5.3 64bit_103;CentOS 5.4 32bit_104;CentOS 5.5 64bit_105;CentOS 5.6 32bit_106;CentOS 5.6 64bit_107;CentOS 5.7 32bit_108;CentOS 5.7 64bit_109;CentOS 5.8 32bit_110;CentOS 5.8 64bit_111;CentOS 6.0 32bit_112;CentOS 6.0 64bit_113;CentOS 6.1 32bit_114;CentOS 6.1 64bit_115;CentOS 6.2 32bit_116;CentOS 6.2 64bit_117;Ubuntu 8.04.4 desktop 32bit_118;Ubuntu 8.04 desktop 64bit_119;Ubuntu 10.04.1 desktop 32bit_120;Ubuntu 10.04 desktop 64bit_121;Ubuntu 10.10 server 64bit_122;Fedora 9 32bit_123;Fedora 12 32bit_124;Neoshine Linux Server 5.4 64bit_125;Fedora 14 64bit_155;openSUSE 11.3 64bit_156;Oracle Linux Server release 5.7 64bit_127;Redhat Linux Enterprise 3.0 32bit_129;Redhat Linux Enterprise 3.4 32bit_130;Debian GNU/Linux 6.0.4 64bit_131;Ubuntu Server 12.04 64bit_132;Oracle Linux Server release 6.1 32bit_133;Oracle Linux Server release 6.1 64bit_134;Redhat Linux Enterprise 6.3 64bit_135;Redhat Linux Enterprise 6.3 32bit_136;CentOS 6.3 32bit_137;CentOS 6.3 64bit_138;DOPRA ICTOM V002R003 EIMP 64bit_139;DOPRA ICTOM V002R003 IMAOS 64bit_140;Debian GNU/Linux 6.0.5 64bit_141;Ubuntu 10.04 server 64bit_142;Ubuntu 10.04.1 server 64bit_143;Ubuntu 10.04.2 server 64bit_144;Ubuntu 10.04.3 server 64bit_145;Ubuntu 11.10 server 32bit_146;Ubuntu 11.10 server 64bit_147;Ubuntu 12.04 desktop 64bit_148;Ubuntu 12.04.1 desktop 64bit_149;Ubuntu 12.04.1 server 64bit_150;Red Flag Asianux Server 3.3 32bit_151;Red Flag Asianux Server 3.3 64bit_152;Red Flag Asianux Server 4.2 32bit_153;Red Flag Asianux Server 4.2 64bit_154;Other Linux(32 bit)_301;Other Linux(64 bit)_302;Novell SUSE Linux Enterprise Server 11 SP2 32bit_303;Novell SUSE Linux Enterprise Server 11 SP2 64bit_304;Novell SUSE Linux Enterprise 11 64bit_200;Novell SUSE Linux Enterprise 11 32bit_201;Novell SUSE Linux Enterprise 10 64bit_202;Novell SUSE Linux Enterprise 10 32bit_203;Novell SUSE Linux Enterprise 8 64bit_204;Novell SUSE Linux Enterprise 8 32bit_205;Novell SUSE Linux Enterprise 9 64bit_206;Novell SUSE Linux Enterprise 9 32bit_207;Asianux 4 64bit_208;Asianux 4 32bit_209;Asianux 3 64bit_210;Asianux 3 32bit_211;Red Hat Enterprise Linux 6 64bit_212;Red Hat Enterprise Linux 6 32bit_213;Red Hat Enterprise Linux 5 64bit_214;Red Hat Enterprise Linux 5 32bit_215;Red Hat Enterprise Linux 4 64bit_216;Red Hat Enterprise Linux 4 32bit_217;Red Hat Enterprise Linux 3 64bit_218;Red Hat Enterprise Linux 3 32bit_219;Red Hat Enterprise Linux 2.1_220;CentOS 4/5/6 64bit_221;CentOS 4/5/6 32bit_222;Debian GNU/Linux 6 64bit_223;Debian GNU/Linux 6 32bit_224;Debian GNU/Linux 5 64bit_225;Debian GNU/Linux 5 32bit_226;Debian GNU/Linux 4 64bit_227;Debian GNU/Linux 4 32bit_228;Novell Open Enterprise Server_229;Oracle Linux 4/5/6 64bit_230;Oracle Linux 4/5/6 32bit_231;Ubuntu Linux 64bit_232;Ubuntu Linux 32bit_233;Other 2.6.x Linux 64bit_234;Other 2.6.x Linux 32bit_235;Other 2.4.x Linux 64bit_236;Other 2.4.x Linux 32bit_237;Other Linux 64bit_238;Other Linux 32bit_239;CentOS 4.5 (32-bit)_615;CentOS 4.6 (32-bit)_616;CentOS 4.7 (32-bit)_617;CentOS 4.8 (32-bit)_618;CentOS 5 (32-bit)_619;CentOS 5 (64-bit)_620;Debian Lenny 5.0 (32-bit)_621;Debian Squeeze 6.0 (32-bit)_622;Debian Squeeze 6.0 (64-bit) (experimental)_623;Red Hat Enterprise Linux 6 (64-bit)_624;Red Hat Enterprise Linux 4.5 (32-bit)_625;Red Hat Enterprise Linux 4.6 (32-bit)_626;Red Hat Enterprise Linux 4.7 (32-bit)_627;Red Hat Enterprise Linux 5 (32-bit)_628;Red Hat Enterprise Linux 5 (64-bit)_629;Red Hat Enterprise Linux 4.8 (32-bit)_630;Red Hat Enterprise Linux 6 (32-bit)_631;Ubuntu Lucid Lynx 10.04 (32-bit) (experimental)_632;Ubuntu Lucid Lynx 10.04 (64-bit) (experimental)_633;Oracle Enterprise Linux 5 (32-bit)_634;Oracle Enterprise Linux 5 (64-bit)_635;SUSE Linux Enterprise Server 11 (32-bit)_636;SUSE Linux Enterprise Server 11 SP1 (32-bit)_637;SUSE Linux Enterprise Server 10 SP1 (32-bit)_638;SUSE Linux Enterprise Server 9 SP4 (32-bit)_639;SUSE Linux Enterprise Server 10 SP2 (64-bit)_640;SUSE Linux Enterprise Server 10 SP2 (32-bit)_641;SUSE Linux Enterprise Server 10 SP3 (64-bit)_642;SUSE Linux Enterprise Server 11 (64-bit)_643;SUSE Linux Enterprise Server 10 SP1 (64-bit)_644;SUSE Linux Enterprise Server 11 SP1 (64-bit)_645;Redhat Linux Enterprise 6.4 32bit_158;Redhat Linux Enterprise 6.4 64bit_159",
                    "windows": "Windows Server 2008 R2 Datacenter 64bit_1;Windows Server 2008 R2 Enterprise 64bit_2;Windows Server 2008 R2 Standard 64bit_3;Windows Server 2008 Datacenter 32bit_4;Windows Server 2008 Datacenter 64bit_5;Windows Server 2008 Enterprise 32bit_6;Windows Server 2008 Enterprise 64bit_7;Windows Server 2008 Standard 32bit_8;Windows Server 2008 Standard 64bit_9;Windows Server 2003 Datacenter 32bit_10;Windows Server 2003 Datacenter 64bit_11;Windows Server 2003 Enterprise 32bit_12;Windows Server 2003 Standard 32bit_14;Windows Server 2003 Standard 64bit_15;Windows Server 2003 R2 Datacenter 32bit_16;Windows Server 2003 R2 Datacenter 64bit_17;Windows Server 2003 R2 Enterprise 32bit_18;Windows Server 2003 R2 Enterprise 64bit_19;Windows Server 2003 R2 Standard 32bit_20;Windows Server 2003 R2 Standard 64bit_21;Windows 7 Ultimate 32bit_22;Windows 7 Ultimate 64bit_23;Windows 7 Enterprise 32bit_24;Windows 7 Enterprise 64bit_25;Windows 7 Professional 32bit_26;Windows 7 Professional 64bit_27;Windows 7 Home Premium 32bit_28;Windows 7 Home Premium 64bit_29;Windows 7 Home Basic 32bit_30;Windows 7 Home Basic 64bit_31;Windows XP Professional 32bit_32;Windows XP Home Edition_33;Windows Server 2008 WEB R2 64bit_59;Windows 2000 Advanced Server SP4_60;Windows 2000 Server SP4_61;Windows 8 32bit_126;Windows 8 64 bit_128;Windows 8 Server 64bit_200;Windows Server 2008 R2 64bit_201;Windows Server 2008 64bit_202;Windows Server 2008 32bit_203;Windows Server 2003 64bit_204;Windows Server 2003 32bit_205;Windows Server 2003 Web Edition 32bit_206;Small Business Server 2003_207;Windows Millenium Edition_208;Windows 8 64bit_209;Windows 8 32bit_210;Windows 7 64bit_211;Windows 7 32bit_212;Windows Vista 64bit_213;Windows Vista 32bit_214;Windows XP Professional 64bit_215;Windows 2000_216;Windows 2000 Server_217;Windows 2000 Professional_218;Windows NT_219;Windows 98_220;Windows 95_221;Windows 3.1_222;MSDOS_223;Windows 2012 64bit_129;Other Windows(32 bit)_201;Other Windows(64 bit)_202;Citrix XenApp on Windows Server 2003 (32-bit)_600;Citrix XenApp on Windows Server 2003 (64-bit)_601;Citrix XenApp on Windows Server 2008 (32-bit)_602;Citrix XenApp on Windows Server 2008 (64-bit)_603;Citrix XenApp on Windows Server 2008 R2 (64-bit)_604;Windows Vista (32-bit)_605;Windows Server 2008 (32-bit)_606;Windows Server 2008 (64-bit)_607;Windows Server 2008 R2 (64-bit)_608;Windows 7 (32-bit)_609;Windows 7 (64-bit)_610;Windows XP SP3 (32-bit)_611;Windows Server 2003 (64-bit)_612;Windows Server 2003 (32-bit)_613",
                    "getVersionInfo": function (osType) {
                        var versionList = [];
                        if (osType === 'Windows') {
                            versionList = $scope.versionConfig.windows.split(";");
                        } else {
                            versionList = $scope.versionConfig.Linux.split(";");
                        }
                        var versions = [];
                        for (var index in versionList) {
                            var label = versionList[index].substr(0, versionList[index].lastIndexOf("_"));
                            var selectId = versionList[index].substr(versionList[index].lastIndexOf("_") + 1);
                            if (label != "") {
                                var version = {
                                    "selectId": selectId,
                                    "label": label
                                };
                                if (index == 0) {
                                    version.checked = true;
                                }
                                versions.push(version);
                            }
                        }
                        return versions;
                    }
                };
                $scope.osVesionSelector = {
                    label: $scope.i18n.common_term_OSversion_label + ":",
                    require: true,
                    "id": "createVmtSpecOSVersion",
                    "width": "150px",
                    "height": "200",
                    "values": $scope.versionConfig.getVersionInfo("Linux"),
                    "change": function () {
                    }
                };
                //CPU内核数输入框
                $scope.cpuCoreSelector = {
                    "label": $scope.i18n.common_term_vcpuNum_label + ":",
                    "require": true,
                    "id": "cpuCoreSelector",
                    "width": "150px",
                    "height": "200px",
                    "values": [],
                    "change": function () {
                        var coreNum = parseInt($("#" + $scope.cpuCoreSelector.id).widget().getSelectedId(), 10);
                        setSlotSelector(coreNum, coreNum, $scope.socketLimit);
                        //清空CPU的Qos设置
                        $scope.model.cpuQos = null;
                    }
                };
                //插槽下拉框
                $scope.slotSelector = {
                    "label": $scope.i18n.vm_term_vCPUnumPerSlot_label + ":",
                    "require": false,
                    "id": "slotSelector",
                    "width": "150px",
                    "values": [
                    ],
                    "change": function () {
                        var cpuNum = $("#" + $scope.cpuCoreSelector.id).widget().getSelectedId();
                        var result = $("#" + $scope.slotSelector.id).widget().getSelectedId();
                        $scope.slotNum = (cpuNum % result === 0) ? parseInt(cpuNum / result, 10) : parseInt(cpuNum / result + 1, 10);
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
                        ";gbCheck:" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 1024}),
                    "change": function () {
                        //清空内存的Qos设置
                        $scope.model.memoryQos = null;
                    }
                };
                UnifyValid.mbCheck = function () {
                    var unit = $("#" + $scope.unitSelector.id).widget().getSelectedId();
                    var value = $("#" + $scope.memoryTextbox.id).widget().getValue();
                    if (unit === "MB") {
                        if (parseInt(value, 10) < 128 || parseInt(value, 10) > 1048576) {
                            return false;
                        }
                    }
                    return true;
                };
                UnifyValid.gbCheck = function () {
                    var unit = $("#" + $scope.unitSelector.id).widget().getSelectedId();
                    var value = $("#" + $scope.memoryTextbox.id).widget().getValue();
                    if (unit === "GB") {
                        if (parseInt(value, 10) < 1 || parseInt(value, 10) > 1024) {
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
                        //清空内存的Qos设置
                        $scope.model.memoryQos = null;
                    }
                };
                function getCoreLimit() {
                    var params = {
                        "listSupportedOsInfo": {
                            "resourceClusterId": $scope.model.clusterId,
                            "hypervisorId": $scope.model.hypervisorId,
                            "osVersion": $scope.model.osVersionNum,
                            "osType": $scope.model.confirmOsType,
                            "osVersionDesc": $scope.model.confirmOsVersion
                        }
                    };
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var osInfo = data && data.listSupportedOsInfo && data.listSupportedOsInfo.osInfos &&
                            data.listSupportedOsInfo.osInfos[$scope.model.confirmOsType] && data.listSupportedOsInfo.osInfos[ $scope.model.confirmOsType][0];
                        $scope.coreLimit = osInfo.cpuQuantityLimit ? osInfo.cpuQuantityLimit : 64;
                        $scope.socketLimit = osInfo.cpuSocketLimit ? osInfo.cpuSocketLimit : 1;
                        setCoreSelector($scope.coreNum, $scope.coreLimit);
                        $scope.$apply(function () {
                            setSlotSelector($scope.coreNum, $scope.coreNum, $scope.socketLimit);
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                $scope.setQos = function () {
                    var result = UnifyValid.FormValid($("#" + $scope.cpuCoreSelector.id)) && UnifyValid.FormValid($("#" + $scope.memoryTextbox.id));
                    if (!result) {
                        return;
                    }
                    var vCpu = parseInt($("#" + $scope.cpuCoreSelector.id).widget().getSelectedId(), 10);
                    if (!$scope.model.cpuQos || $scope.model.cpuQos.quantity !== vCpu) {
                        $scope.model.cpuQos = {};
                    }
                    $scope.model.cpuQos.quantity = vCpu;

                    var memory = parseInt($("#" + $scope.memoryTextbox.id).widget().getValue(), 10);
                    memory = $("#" + $scope.unitSelector.id).widget().getSelectedId() === "GB" ? memory * 1024 : memory;
                    if (!$scope.model.memoryQos || $scope.model.memoryQos.quantityMB !== memory) {
                        $scope.model.memoryQos = {};
                    }
                    $scope.model.memoryQos.quantityMB = memory;
                    var newWindow = new Window({
                        "winId": "configQosWindow",
                        "title": $scope.i18n.common_term_setQoS_button,
                        "vCpu": vCpu,
                        "memory": memory,
                        "createModel": $scope.model,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/vm/createVmQos.html",
                        "height": 550,
                        "width": 880
                    });
                    newWindow.show();
                };
                function getTemplateSpec() {
                    var deferred = camel.get({
                        url: {
                            s: "/goku/rest/v1.5/sr/1/vmtemplates/{id}",
                            o: {id: $scope.model.vmTemplateId}
                        },
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        $scope.diskList = data.diskdetail || [];
                        $scope.templateDiskNum = $scope.diskList.length;
                        for (var i = 0; i < $scope.diskList.length; i++) {
                            $scope.diskList[i].indepDisk = $scope.diskList[i].indepDisk === "false" ? true : false;
                            $scope.diskList[i].quantityGB = $scope.diskList[i].quantity;
                        }
                        $scope.$apply(function () {
                            $scope.coreNum = data.cpuInfo.quantity;
                            $scope.model.cpuHotPlug = data.cpuInfo.cpuHotPlug;
                            $scope.model.cpuQos = data.cpuInfo;
                            $scope.model.osVersionNum = data.osOption.osVersionNum;
                            $scope.memoryTextbox.value = data.memoryInfo.quantity;
                            $scope.model.memoryQos = data.memoryInfo;
                            $scope.model.memoryQos.quantityMB = data.memoryInfo.quantity;
                        });
                        if (data.bootOption) {
                            $("#" + $scope.bootOptionSelector.id).widget().opChecked(data.bootOption);
                        }
                        $("#" + $scope.antiVirusCheckbox.id).widget().option("checked", !!data.secureVmType);
                        $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("SVM", !data.secureVmType);
                        $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("GVM", !data.secureVmType);
                        $("#" + $scope.secureVmTypeRadio.id).widget().opChecked(data.secureVmType, true);
                        getDiskMap();
                        getCoreLimit();
                        setDiskNumSelector(0);
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function initEmptySpec() {
                    $scope.diskList = [getDisk(1), getDisk(2)];
                    $scope.templateDiskNum = 0;
                    $scope.coreNum = 2;
                    $scope.memoryTextbox.value = 1024;
                    $scope.diskTable.data = $scope.diskList;
                    setCoreSelector($scope.coreNum, 64);
                    setDiskNumSelector(2);
                }

                function setCoreSelector(coreNum, coreLimit) {
                    var values = [];
                    for (var i = 1; i <= coreLimit; i++) {
                        var option = {
                            "selectId": i,
                            "label": i
                        };
                        if (i == coreNum) {
                            option.checked = true;
                        }
                        values.push(option);
                    }
                    $("#" + $scope.cpuCoreSelector.id).widget().option("values", values);
                }

                function setSlotSelector(cpuNum, coresPerSocket, socketLimit) {
                    var values = [];
                    for (var i = 1; i <= cpuNum; i++) {
                        if (cpuNum % i === 0 && cpuNum / i <= socketLimit) {
                            var option = {
                                "selectId": i,
                                "label": i
                            };
                            if (i == coresPerSocket) {
                                option.checked = true;
                            }
                            values.push(option);
                        }
                    }
                    $("#" + $scope.slotSelector.id).widget().option("values", values);
                    $scope.slotNum = (cpuNum % coresPerSocket === 0) ? parseInt(cpuNum / coresPerSocket, 10) : parseInt(cpuNum / coresPerSocket + 1, 10);
                }

                function getDisk(i) {
                    var allocType = "thick";
                    for (var key in $scope.diskMap) {
                        if ($scope.diskMap.hasOwnProperty(key)) {
                            allocType = key;
                            break;
                        }
                    }
                    var medias = $scope.diskMap[allocType] || {};
                    var mediaType = "SAN-Any";
                    for (var key in medias) {
                        if (medias.hasOwnProperty(key)) {
                            mediaType = key;
                            break;
                        }
                    }
                    var indeps = medias[mediaType] || [];
                    var indepDisk = "true";
                    if (indeps.length > 0) {
                        indepDisk = indeps[0].toString();
                    }
                    var diskItem = {
                        "name": $scope.i18n.common_term_disk_label + i,
                        "quantityGB": "20",
                        "allocType": allocType,
                        "mediaType": mediaType,
                        "indepDisk": indepDisk
                    };
                    return diskItem;
                }

                function setDiskNumSelector(userNum) {
                    var userDiskNum = userNum ? userNum : 0;
                    preDiskNum = $scope.templateDiskNum + userDiskNum;
                    var maxDiskNum = $scope.model.hyperType === "FusionCompute" ? 11 : 60;
                    var diskNum = $scope.templateDiskNum ? $scope.templateDiskNum : 1;
                    var values = [];
                    while (diskNum <= maxDiskNum) {
                        var option = {
                            "selectId": diskNum,
                            "label": diskNum
                        };
                        if (diskNum == preDiskNum) {
                            option.checked = true;
                        }
                        values.push(option);
                        diskNum++;
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
                        var curDiskNum = parseInt($("#" + $scope.diskNumSelector.id).widget().getSelectedId(), 10);
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
                var maxDiskSizes = {
                    "FusionCompute": 64 * 1024,
                    "VMware": 62 * 1024,
                    "openstack": 64 * 1024
                };
                $scope.diskTable = {
                    "id": "createVmDiskTable",
                    "data": null,
                    "enablePagination": false,
                    "columns": [
                        {
                            "sTitle": $scope.i18n.common_term_disk_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false,
                            "sWidth": 100
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
                            "bSortable": false,
                            "sWidth": 200
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
                                return $.encoder.encodeForHTML("");
                            },
                            "bSortable": false
                        }
                    ],
                    "renderRow": function (nRow, rowData, iDataIndex) {
                        var aData = $scope.diskTable.data[iDataIndex];
                        $('td:eq(0)', nRow).addTitle();
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
                        var maxDiskSize = maxDiskSizes[$scope.model.hyperType] || 64 * 1024;

                        //配置模式下拉框
                        var options = {
                            "id": "modeSelect_" + iDataIndex,
                            "width": 180,
                            "values": getConfigValues(aData),
                            "validate": "required:" + $scope.i18n.common_term_null_valid,
                            "change": function () {
                                $scope.diskTable.data[iDataIndex].allocType = $("#" + "modeSelect_" + iDataIndex).widget().getSelectedId();
                                var mediaValues = getMediaValues($scope.diskTable.data[iDataIndex]);
                                $("#" + "mediaSelect_" + iDataIndex).widget().option("values", mediaValues);
                                if ($("#" + "influenceSelect_" + iDataIndex).widget()) {
                                    var indepValues = getIndepValues($scope.diskTable.data[iDataIndex]);
                                    $("#" + "influenceSelect_" + iDataIndex).widget().option("values", indepValues);
                                }
                                else {
                                    aData.sIndepDisk = (typeof(aData.sIndepDisk) === "undefined") ? aData.indepDisk : aData.sIndepDisk;
                                    getTemplateIndeps($scope.diskTable.data[iDataIndex]);
                                    $('td:eq(4)', nRow).html(getInfluence(aData.indepDisk));
                                }
                            }
                        };
                        var select = new Select(options);
                        $('td:eq(2)', nRow).html(select.getDom());

                        //存储介质下拉框
                        var options = {
                            "id": "mediaSelect_" + iDataIndex,
                            "width": 120,
                            "values": getMediaValues(aData),
                            "validate": "required:" + $scope.i18n.common_term_null_valid,
                            "change": function () {
                                $scope.diskTable.data[iDataIndex].mediaType = $("#" + "mediaSelect_" + iDataIndex).widget().getSelectedId();
                                if ($("#" + "influenceSelect_" + iDataIndex).widget()) {
                                    var indepValues = getIndepValues($scope.diskTable.data[iDataIndex]);
                                    $("#" + "influenceSelect_" + iDataIndex).widget().option("values", indepValues);
                                }
                                else {
                                    aData.sIndepDisk = (typeof(aData.sIndepDisk) === "undefined") ? aData.indepDisk : aData.sIndepDisk;
                                    getTemplateIndeps($scope.diskTable.data[iDataIndex]);
                                    $('td:eq(4)', nRow).html(getInfluence(aData.indepDisk));
                                }
                            }
                        };
                        var select = new Select(options);
                        $('td:eq(3)', nRow).html(select.getDom());

                        if (iDataIndex < $scope.templateDiskNum) {
                            //记住独立磁盘原始值
                            aData.sIndepDisk = (typeof(aData.sIndepDisk) === "undefined") ? aData.indepDisk : aData.sIndepDisk;
                            getTemplateIndeps(aData);
                            $('td:eq(4)', nRow).html(getInfluence(aData.indepDisk));
                        }
                        else {
                            //容量输入框
                            var options = {
                                "id": "sizeTextbox_" + iDataIndex,
                                "value": aData.quantityGB,
                                "width": 80,
                                "validate": "required:" + $scope.i18n.common_term_null_valid +
                                    ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                                    ";minValue(1);" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxDiskSize}) +
                                    ";maxValue(" + maxDiskSize + "):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxDiskSize}),
                                "change": function () {
                                    $scope.diskTable.data[iDataIndex].quantityGB = $("#" + "sizeTextbox_" + iDataIndex).widget().getValue();
                                }
                            };
                            var select = new Textbox(options);
                            $('td:eq(1)', nRow).html(select.getDom());

                            //是否受快照影响下拉框
                            var options = {
                                "id": "influenceSelect_" + iDataIndex,
                                "values": getIndepValues(aData),
                                "width": 80,
                                "validate": "required:" + $scope.i18n.common_term_null_valid,
                                "change": function () {
                                    $scope.diskTable.data[iDataIndex].indepDisk = $("#" + "influenceSelect_" + iDataIndex).widget().getSelectedId();
                                }
                            };
                            var select = new Select(options);
                            $('td:eq(4)', nRow).html(select.getDom());
                        }
                    }
                };
                function getDiskMap() {
                    var deferred = camel.post({
                        url: {
                            s: "/goku/rest/v1.5/irm/1/volumes/action"
                        },
                        "params": JSON.stringify({"refreshDiskPara": {"clusterId": $scope.model.clusterId, "way": "1"}}),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        $scope.diskMap = data.diskParams && data.diskParams.qosMap || {};
                        //将indepDisk取反，因为后台返回的意义是是否受快照影响，页面处理要的是是否独立磁盘
                        for (var allocType in $scope.diskMap) {
                            if ($scope.diskMap.hasOwnProperty(allocType)) {
                                var mediaTypes = $scope.diskMap[allocType];
                                for (var mediaType in mediaTypes) {
                                    if (mediaTypes.hasOwnProperty(mediaType)) {
                                        var indepDisks = mediaTypes[mediaType];
                                        for (var i = 0; i < indepDisks.length; i++) {
                                            indepDisks[i] = !indepDisks[i];
                                        }
                                    }
                                }
                            }
                        }
                        $scope.$apply(function () {
                            if($scope.createType === "template"){
                                $scope.diskTable.data = $scope.diskList;
                            }
                            else{
                                initEmptySpec();
                            }
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function getConfigValues(aData) {
                    var values = [];
                    var allocType = "";
                    for (var key in $scope.diskMap) {
                        if ($scope.diskMap.hasOwnProperty(key)) {
                            var value = {
                                "selectId": key,
                                "label": allocTypes[key]
                            };
                            if (key === aData.allocType) {
                                value.checked = true;
                                allocType = key;
                            }
                            values.push(value);
                        }
                    }
                    if (values.length > 0 && !allocType) {
                        values[0].checked = true;
                        aData.allocType = values[0].selectId;
                    }
                    return values;
                }

                function getMediaValues(aData) {
                    var values = [];
                    var mediaType = "";
                    var medias = $scope.diskMap[aData.allocType] || {};
                    for (var key in medias) {
                        if (medias.hasOwnProperty(key)) {
                            var value = {
                                "selectId": key,
                                "label": key === "SAN-Any" ? "Any" : key
                            };
                            if (key === aData.mediaType) {
                                value.checked = true;
                                mediaType = key;
                            }
                            values.push(value);
                        }
                    }
                    if (values.length > 0 && !mediaType) {
                        values[0].checked = true;
                        aData.mediaType = values[0].selectId;
                    }
                    return values;
                }

                function getIndepValues(aData) {
                    var values = [];
                    var indepDisk = "";
                    var indeps = $scope.diskMap[aData.allocType] && $scope.diskMap[aData.allocType][aData.mediaType] || [];
                    for (var index in indeps) {
                        var value = {
                            "selectId": indeps[index].toString(),
                            "label": getInfluence(indeps[index])
                        };
                        if (indeps[index] === aData.indepDisk) {
                            value.checked = true;
                            indepDisk = indeps[index].toString();
                        }
                        values.push(value);
                    }
                    if (values.length > 0 && !indepDisk) {
                        values[0].checked = true;
                        aData.indepDisk = values[0].selectId;
                    }
                    return values;
                }

                function getTemplateIndeps(aData) {
                    var indeps = $scope.diskMap[aData.allocType] && $scope.diskMap[aData.allocType][aData.mediaType] || [];
                    var index = 0;
                    while (index < indeps.length) {
                        if (indeps[index].toString() === aData.sIndepDisk.toString()) {
                            break;
                        }
                        index++;
                    }
                    if (index === indeps.length && indeps.length > 0) {
                        aData.indepDisk = indeps[0];
                    }
                    else {
                        aData.indepDisk = aData.sIndepDisk;
                    }
                }

                //虚拟机个数输入框
                $scope.vmNumTextbox = {
                    "label": $scope.i18n.vm_term_vmNum_label + ":",
                    "require": true,
                    "disable": $scope.action === "clone",
                    "id": "vmNumTextbox",
                    "value": "1",
                    "validate": "require:" + $scope.i18n.common_term_null_valid +
                        ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";maxValue(30):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 30})
                };
                $scope.bootOptionSelector = {
                    "id": "bootOptionSelector",
                    "label": $scope.i18n.common_term_startupMode_label + ":",
                    "width": "150",
                    "values": [
                        {
                            "selectId": "disk",
                            "label": $scope.i18n.template_term_startFromHarddisk_label,
                            "checked": true
                        },
                        {
                            "selectId": "cdrom",
                            "label": $scope.i18n.template_term_startFromCD_label
                        },
                        {
                            "selectId": "pxe",
                            "label": $scope.i18n.template_term_startFromNet_label
                        }
                    ]
                };
                //开启虚拟机防病毒复选框
                $scope.antiVirusCheckbox = {
                    id: "antiVirusCheckbox",
                    text: $scope.i18n.common_term_turnOnAntivirus_button,
                    "checked": false,
                    "change": function () {
                        var result = $("#" + $scope.antiVirusCheckbox.id).widget().option("checked");
                        $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("SVM", !result);
                        $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("GVM", !result);
                    }
                };
                //安全虚拟机类型
                $scope.secureVmTypeRadio = {
                    "id": "secureVmTypeRadio",
                    "label": $scope.i18n.vm_term_securityVMtype_label + ":",
                    "values": [
                        {
                            "key": "SVM",
                            "text": $scope.i18n.vm_term_securityServiceVM_label,
                            "checked": true,
                            "disable": true
                        },
                        {
                            "key": "GVM",
                            "text": $scope.i18n.vm_term_securityUserVM_label,
                            "checked": false,
                            "disable": true
                        }
                    ],
                    "layout": "horizon",
                    "change": function () {

                    }
                };
                //高级配置
                $scope.seniorConfig = {
                    display: false
                };
                //HA下拉框
                $scope.haCheckbox = {
                    "id": "haCheckbox",
                    "label": $scope.i18n.vm_term_HA_label + ":",
                    "text": $scope.i18n.common_term_enable_value
                };
                //时钟策略
                $scope.clockSynCheckbox = {
                    "id": "clockSynCheckbox",
                    "label": $scope.i18n.sys_term_timeSync_label,
                    "text": $scope.i18n.template_term_hostCloskSync_label
                };
                //CPU热插拔下拉框
                $scope.cpuHotPlugSelector = {
                    "id": "cpuHotPlugSelector",
                    "width": "200",
                    "label": $scope.i18n.vm_term_CPUliveAdjust_label + ":",
                    "values": [
                        {
                            "selectId": "0",
                            "label": $scope.i18n.common_term_notOn_value,
                            "checked": true
                        },
                        {
                            "selectId": "1",
                            "label": $scope.i18n.vm_term_enableCPUliveAdd_button
                        }
                    ]
                };
                //升级方式单选组
                $scope.updateMethodSelector = {
                    "id": "updateMethodSelector",
                    "width": "200",
                    "label": $scope.i18n.common_term_updateMode_label + ":",
                    "values": [
                        {
                            "selectId": "auto",
                            "label": $scope.i18n.common_term_auto_label,
                            "checked": true
                        },
                        {
                            "selectId": "manual",
                            "label": $scope.i18n.common_term_manual_label
                        }
                    ]
                };
                //热迁移属性单选组
                $scope.hotMigrateRadioGroup = {
                    "id": "hotMigrateRadioGroup",
                    "label": $scope.i18n.vm_term_basicBlockLiveMig_label,
                    "values": [
                        {
                            "key": "unSupport",
                            "text": $scope.i18n.common_term_notSupport_value,
                            "checked": true
                        },
                        {
                            "key": "support",
                            "text": $scope.i18n.common_term_support_value,
                            "checked": false
                        }
                    ],
                    "layout": "vertical"
                };
                //上一步按钮
                $scope.specPreButton = {
                    "id": "specPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.createStep.id).widget().pre();
                        $scope.step = "basic";
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
                        $scope.model.vmNumber = $("#" + $scope.vmNumTextbox.id).widget().getValue();
                        $scope.model.coreNum = $("#" + $scope.cpuCoreSelector.id).widget().getSelectedId();
                        $scope.model.memorySize = $("#" + $scope.memoryTextbox.id).widget().getValue();
                        $scope.model.memoryUnit = $("#" + $scope.unitSelector.id).widget().getSelectedId();
                        $scope.model.disks = [];
                        $scope.model.templateDisks = [];
                        for (var i = 0; i < $scope.diskList.length; i++) {
                            var disk = {
                                "quantityGB": $scope.diskList[i].quantityGB,
                                "allocType": $scope.diskList[i].allocType,
                                "mediaType": $scope.diskList[i].mediaType,
                                "indepDisk": $scope.diskList[i].indepDisk
                            };
                            if (i < $scope.templateDiskNum) {
                                $scope.model.templateDisks.push(disk);
                            }
                            else {
                                $scope.model.disks.push(disk);
                            }
                        }
                        if ($scope.createType === "template") {
                            $scope.model.coresPerSocket = $("#" + $scope.slotSelector.id).widget().getSelectedId();
                            $scope.model.bootOption = $("#" + $scope.bootOptionSelector.id).widget().getSelectedId();
                            $scope.model.bootOptionStr = $("#" + $scope.bootOptionSelector.id).widget().getSelectedLabel();
                            $scope.model.secureVmType = null;
                            var open = $("#" + $scope.antiVirusCheckbox.id).widget().option("checked");
                            if (open) {
                                $scope.model.secureVmType = $("#" + $scope.secureVmTypeRadio.id).widget().opChecked("checked");
                            }
                            if ($scope.model.vmNumber == 1) {
                                $("#" + $scope.nicTable.id).widget().option("columns", columnsWithIp);
                                $("#" + $scope.confirmNicTable.id).widget().option("columns", columnsWithIp);
                            }
                            else {
                                $("#" + $scope.nicTable.id).widget().option("columns", columnsWithoutIp);
                                $("#" + $scope.confirmNicTable.id).widget().option("columns", columnsWithoutIp);
                            }
                            initNic();
                            $scope.vpcCheckbox.display = false;
                            $scope.model.vpcId = null;
                            $("#" + $scope.vpcCheckbox.id).widget().option("checked", false);
                            setNicSelector();
                            $scope.step = "network";
                            $("#" + $scope.createStep.id).widget().next();
                        }
                        else {
                            $scope.model.confirmOsType = $("#" + $scope.osTypeSelector.id).widget().getSelectedId();
                            $scope.model.confirmOsVersion = $("#" + $scope.osVesionSelector.id).widget().getSelectedLabel();
                            $scope.model.osVersion = $("#" + $scope.osVesionSelector.id).widget().getSelectedId();
                            $scope.model.haFlag = $("#" + $scope.haCheckbox.id).widget().option("checked");
                            $scope.model.clockSyn = $("#" + $scope.clockSynCheckbox.id).widget().option("checked");
                            $scope.model.cpuHotPlug = $("#" + $scope.cpuHotPlugSelector.id).widget().getSelectedId();
                            $scope.model.updateMode = $("#" + $scope.updateMethodSelector.id).widget().getSelectedId();
                            $scope.model.hotMigrate = $("#" + $scope.hotMigrateRadioGroup.id).widget().opChecked("checked");
                            $scope.step = "confirm";
                            $("#" + $scope.createStep.id).widget().next();
                            $("#" + $scope.confirmDiskTable.id).widget().option("data", $scope.diskList);
                        }
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
                                    if (index == iDataIndex) {
                                        $scope.model.vpcId = $scope.vpcTable.data[index].vpcID;
                                    }
                                    else {
                                        $("#vpcRadio_" + index).widget().option("checked", false);
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
                //网卡个数下拉框,模板里的虚拟化类型有大写，虚拟机里的都是小写
                var maxNicNums = {
                    "FusionCompute": 12,
                    "fusioncompute": 12,
                    "VMware": 10,
                    "vmware": 10,
                    "openstack": 16
                };
                $scope.nicNumSelector = {
                    "label": $scope.i18n.common_term_NICnum_label + ":",
                    "require": true,
                    "id": "nicNumSelector",
                    "width": "150",
                    "validate": "",
                    "values": [],
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
                        $scope.nicTable.data = nicList;
                        $("#" + $scope.nicTable.id).widget().option("data", nicList);
                    }
                };
                function setNicSelector() {
                    var maxNicNum = maxNicNums[$scope.model.hyperType] || 12;
                    var values = [];
                    for (var i = 1; i <= maxNicNum; i++) {
                        var option = {
                            "selectId": i,
                            "label": i,
                            "checked": i === 1
                        };
                        values.push(option);
                    }
                    $("#" + $scope.nicNumSelector.id).widget().option("values", values);
                }

                var columnsWithIp = [
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
                        "sTitle": $scope.i18n.common_term_IP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ips);
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
                    "columns": columnsWithIp,
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
                                        clusterIndex: $scope.clusterIndex,
                                        zoneId: $scope.zoneId
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
                        var select = new Button(options);

                        if ($scope.model.vmNumber == 1) {
                            $('td:eq(3)', nRow).html(select.getDom());
                            //指定IP按钮
                            var options = {
                                "id": "setIpButton",
                                "text": $scope.i18n.vm_term_designationIP_label,
                                "disable": true,
                                "click": function () {
                                    var newWindow = new Window({
                                        "winId": "createVmIpWindow",
                                        "title": $scope.i18n.vm_term_designationIP_label,
                                        "nicModel": $scope.nicTable.data[iDataIndex],
                                        "content-type": "url",
                                        "buttons": null,
                                        "content": "app/business/resources/views/hypervisor/vm/createVmIp.html",
                                        "height": 480,
                                        "width": 450,
                                        "close": function () {
                                            $("#" + $scope.nicTable.id).widget().option("data", $scope.nicTable.data);
                                        }
                                    });
                                    newWindow.show();
                                }
                            };
                            if (aData.exnetworkID && (aData.ipv4Subnet || aData.ipv6Subnet)) {
                                if (aData.ipv4Subnet && (aData.ipv4Subnet.ipAllocatePolicy == 1 || aData.ipv4Subnet.ipAllocatePolicy == 3)) {
                                    options.disable = false;
                                }
                                if (aData.ipv6Subnet && (aData.ipv6Subnet.ipAllocatePolicy == 1 || aData.ipv6Subnet.ipAllocatePolicy == 3)) {
                                    options.disable = false;
                                }
                            }
                            var select = new Button(options);
                            $('td:eq(3)', nRow).append(select.getDom());
                        }
                        else {
                            $('td:eq(2)', nRow).html(select.getDom());
                        }
                    }
                };
                //上一步按钮
                $scope.networkPreButton = {
                    "id": "networkPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.createStep.id).widget().pre();
                        $scope.step = "spec";
                    }
                };
                //下一步按钮
                $scope.networkNextButton = {
                    "id": "networkNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        $scope.model.nics = [];
                        $scope.model.customNics = [];
                        var data = $("#" + $scope.nicTable.id).widget().option("data");
                        var nicIndex = 0;
                        for (; nicIndex < data.length; nicIndex++) {
                            if (data[nicIndex].exnetworkID) {
                                $scope.model.nics.push({
                                    "networkId": data[nicIndex].exnetworkID
                                });
                                var customNic = {  };
                                if (data[nicIndex].ipv4) {
                                    customNic.ipv4 = data[nicIndex].ipv4;
                                }
                                if (data[nicIndex].ipv6 && data[nicIndex].ipv6.length > 0) {
                                    customNic.ipv6 = data[nicIndex].ipv6;
                                }
                                if (!(customNic.ipv4 || customNic.ipv6)) {
                                    customNic = null;
                                }
                                $scope.model.customNics.push(customNic);
                            }
                            else {
                                nicMessage();
                                break;
                            }
                        }
                        if (nicIndex >= data.length) {
                            $scope.step = "confirm";
                            $("#" + $scope.createStep.id).widget().next();
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
                    "template": $scope.i18n.template_term_vm_label + ":",
                    "osType": $scope.i18n.common_term_OStype_label + ":",
                    "osVersion": $scope.i18n.common_term_OSversion_label + ":",
                    "createTitle": $scope.i18n.vm_term_createVM_button
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
                                return $.encoder.encodeForHTML(data.name);
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
                        $('td:eq(4)', nRow).html(getInfluence(aData.indepDisk));
                    }
                };
                //网卡列表
                $scope.confirmNicTable = {
                    "id": "confirmNicTable",
                    "data": null,
                    "label": $scope.i18n.common_term_NIC_label + ":",
                    "enablePagination": false,
                    "columns": columnsWithIp
                };
                //上一步按钮
                $scope.confirmPreButton = {
                    "id": "confirmPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.createStep.id).widget().pre();
                        if ($scope.createType === "template") {
                            $scope.step = "network";
                        }
                        else {
                            $scope.step = "spec";
                        }
                    }
                };
                //下一步按钮
                $scope.confirmOkButton = {
                    "id": "confirmOkButton",
                    "text": $scope.i18n.common_term_ok_button,
                    "click": function () {
                        if ($scope.action === "create") {
                            if ($scope.createType === "template") {
                                var templateIds = $scope.model.vmTemplateId.split(";");
                                var templateId = templateIds[2] + "$" + templateIds[1];
                                createTemplateVm(templateId);
                            }
                            else {
                                createEmptyVm();
                            }
                        }
                        else {
                            createTemplateVm($scope.vmId);
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
                function createTemplateVm(templateId) {
                    var vmNum = parseInt($scope.model.vmNumber, 10);
                    var memorySize = parseInt($scope.model.memorySize, 10);
                    var netClusters = [$scope.model.clusterId];
                    if ($scope.model.memoryUnit === "GB") {
                        memorySize = memorySize * 1024;
                    }
                    var vmNames = [];
                    for (var i = 0; i < vmNum; i++) {
                        vmNames.push($scope.model.vmName);
                    }
                    var templateModel = {
                        "clone": {
                            "vmTemplateId": templateId,
                            "vmNumber": $scope.model.vmNumber,
                            "vmNamePrefixList": vmNames,
                            "netClusters": netClusters,
                            "isDisasterVm": $scope.model.isDisasterVm,
                            "vmCreateSpec": {
                                "cpu": {
                                    "quantity": $scope.model.coreNum,
                                    "coresPerSocket": $scope.model.coresPerSocket
                                },
                                "memory": {
                                    "quantityMB": memorySize
                                },
                                "addUserDisks": $scope.model.disks,
                                "templateDisks": $scope.model.templateDisks,
                                "nics": $scope.model.nics,
                                "attribute": {
                                    "bootOption": $scope.model.bootOption,
                                    "secureVmType": $scope.model.secureVmType
                                }
                            },
                            "vmCustomizationSpec": {},
                            "description": $scope.model.description
                        }
                    };
                    if ($scope.model.vmNumber == 1 && $scope.model.customNics && $scope.model.customNics.length > 0) {
                        templateModel.clone.vmUniqueInfo = [
                            {
                                customNic: $scope.model.customNics
                            }
                        ];
                    }
                    if ($scope.model.computerName) {
                        templateModel.clone.vmCustomizationSpec.hostName = $scope.model.computerName;
                    }
                    if ($scope.model.hostId && $scope.model.hostId !== "") {
                        templateModel.clone.hostId = $scope.model.hostId;
                    }
                    if ($scope.model.joinDomain) {
                        templateModel.clone.vmCustomizationSpec.domain = $scope.model.domainName;
                        templateModel.clone.vmCustomizationSpec.domainName = $scope.model.domainUsername;
                        templateModel.clone.vmCustomizationSpec.domainPassword = $scope.model.domainPassword;
                    }
                    if ($scope.model.cpuHotPlug) {
                        templateModel.clone.vmCreateSpec.cpu.cpuHotPlug = $scope.model.cpuHotPlug;
                    }
                    //添加容灾
                    if ($scope.model.isDisasterVm) {
                        templateModel.clone.disasterGroupId = $("#" + $scope.toleranceSelector.id).widget().getSelectedId();
                    }
                    //cpuQos
                    if ($scope.model.cpuQos && ($scope.model.cpuQos.reservation || $scope.model.cpuQos.reservation === 0)) {
                        templateModel.clone.vmCreateSpec.cpu.limit = $scope.model.cpuQos.limit;
                        templateModel.clone.vmCreateSpec.cpu.reservation = $scope.model.cpuQos.reservation;
                        templateModel.clone.vmCreateSpec.cpu.weight = $scope.model.cpuQos.weight;
                    }
                    //内存Qos
                    if ($scope.model.memoryQos && ($scope.model.memoryQos.reservation || $scope.model.memoryQos.reservation === 0)) {
                        templateModel.clone.vmCreateSpec.memory.reservation = $scope.model.memoryQos.reservation;
                        templateModel.clone.vmCreateSpec.memory.weight = $scope.model.memoryQos.weight;
                    }
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                        "params": JSON.stringify(templateModel),
                        "userId": user.id,
                        "timeout":120000
                    });
                    deferred.success(function (data) {
                        createMessage();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function createEmptyVm() {
                    var vmNumber = parseInt($scope.model.vmNumber,10);
                    var memorySize = parseInt($scope.model.memorySize, 10);
                    if ($scope.model.memoryUnit === "GB") {
                        memorySize = memorySize * 1024;
                    }
                    var templateModel = {
                        "create": {
                            "vmNumber": vmNumber,
                            "name": $scope.model.vmName,
                            "clusterId": $scope.model.clusterId,
                            "osOption": {
                                "osType": $scope.model.confirmOsType,
                                "osVersion": $scope.model.osVersion,
                                "osVersiontype": $scope.model.confirmOsVersion
                            },
                            "cpu": {
                                "quantity": $scope.model.coreNum,
                                "cpuHotPlug": $scope.model.cpuHotPlug
                            },
                            "memory": {
                                "quantityMB": memorySize
                            },
                            "disks": $scope.model.disks,
                            "haFlag": $scope.model.haFlag,
                            "updateMode": $scope.model.updateMode,
                            "syncTimeWithHost": $scope.model.clockSyn,
                            "blockHeatTranfer": $scope.model.hotMigrate,
                            "description": $scope.model.description,
                            "creatorId": user.id
                        }
                    };
                    if ($scope.model.hostId && $scope.model.hostId !== "") {
                        templateModel.create.targetHostUrn = $scope.model.hostId;
                    }
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                        "params": JSON.stringify(templateModel),
                        "userId": user.id,
                        "timeout":120000
                    });
                    deferred.success(function (data) {
                        createMessage();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function createMessage() {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.task_view_task_info_confirm_msg + "<br>" + $scope.i18n.vm_vm_taskView_info_confirm_msg || "注意：若创建失败，则虚拟机列表中的虚拟机将自动删除。",
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn: true,
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

                function goBack() {
                    $state.go($stateParams.from, {
                        "from": $state.current.name, "vmId": $scope.vmId, "name": $scope.cloneVmName,
                        "clusterName": $scope.clusterName, "clusterId": $scope.clusterId, "indexId": $scope.clusterIndex, "hyperId": $scope.hypervisorId
                    });
                }

                //查询容灾存储组
                function getDisasterGroups(callback) {
                    var disClusterId = null;
                    if ($scope.clusterId) {//判断是否为集群列表进入的VM列表创建
                        disClusterId = $scope.clusterIndex;
                    } else {//VDC进入的VM创建
                        disClusterId = $scope.selectedCluster.indexId;
                    }
                    var params = {
                        list: {
                            scopeType: 'CLUSTER',
                            scopeObjectId: disClusterId
                        }
                    };
                    var defe = camel.post({
                        "url": "/goku/rest/v1.5/irm/1/disastergroups/action",
                        "params": JSON.stringify(params),
                        "userId": $("html").scope().user.id
                    });
                    defe.done(function (response) {
                        callback(response && response.list && response.list.disasterGroups || []);
                    });
                    defe.fail(function (data) {
                    });
                }

                function initNic() {
                    nicList = [getNic(1)];
                    $scope.nicTable.data = nicList;
                    preNicNum = 1;
                    $("#" + $scope.nicNumSelector.id).widget().opChecked(1);
                    $("#" + $scope.nicTable.id).widget().option("data", nicList);
                }

                if ($scope.action === "create") {
                    if ($scope.templateId) {
                        getTemplate($scope.templateId);
                    }
                    else if ($scope.clusterId) {
                        getTemplates();
                        getCluster($scope.clusterId);
                    }
                    else {
                        getTemplates();
                    }
                }
                else if ($scope.action === "clone") {
                    $scope.label.template = $scope.i18n.common_term_vm_label + ":";
                    $scope.label.createTitle = $scope.i18n.vm_term_cloneVM_button;
                    getVm();
                }
            }];
        return createVmCtrl;
    });