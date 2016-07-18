define(["tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/resources/controllers/constants"],
    function (angular, httpService, exceptionService, constants) {
        "use strict";

        var vmTemplateDetailCtrl = ["$scope", "camel", function($scope, camel){

            var exception = new exceptionService();

            $scope.detail = {
                'name':"",
                'id':"",
                "logicVmtName":""
            };

            $scope.model = {};

            $scope.logicVmt = {
                label: $scope.i18n.template_term_vmLogic_label+":",
                require: false
            };
            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false
            };
            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false
            };
            $scope.osVersion = {
                label: $scope.i18n.common_term_OSversion_label+":",
                require: false
            };
            $scope.hypervisor = {
                label: $scope.i18n.virtual_term_hypervisor_label+":",
                require: false
            };
            $scope.cluster = {
                label: $scope.i18n.virtual_term_clusters_label+":",
                require: false
            };
            $scope.host = {
                label: $scope.i18n.common_term_host_label+":",
                require: false
            };


            $scope.updateMode = {
                label: $scope.i18n.common_term_updateMode_label+":",
                require: false
            };
            $scope.syncTimeWithHost = {
                label: $scope.i18n.template_term_hostCloskSync_label+":",
                require: false
            };
            $scope.blockHeatTranfer = {
                label: $scope.i18n.vm_term_basicBlockLiveMig_label+":",
                require: false
            };
            $scope.haFlag = {
                label: "HA:",
                require: false
            };
            $scope.cpuHotPlugin = {
                label: $scope.i18n.vm_term_CPUliveAdjust_label+":",
                require: false
            };
            $scope.secStorage = {
                label: $scope.i18n.common_term_storage_label+":",
                require: false
            };
            $scope.attachISO = {
                label: $scope.i18n.vm_term_mountCD_button+":",
                require: false
            };

            $scope.type = {
                label: $scope.i18n.common_term_type_label+":",
                require: false,
                "id": "modifyVmtType",
                "value":""
            };

            $scope.cpu = {
                label: $scope.i18n.common_term_cpuNum_label+":",
                require: false,
                "value":""
            };

            $scope.memory = {
                label: $scope.i18n.common_term_memory_label+":",
                require: false,
                "value":""
            };

            $scope.cpuConfig = {
                label: $scope.i18n.vm_term_CPUcontrol_label+":",
                require: false,
                "share":"",
                "quota":""
            };

            $scope.memoryConfig = {
                label: $scope.i18n.vm_term_memControl_label+":",
                require: false,
                "share":"",
                "quota":""
            };

            $scope.diskTable = {
                label: $scope.i18n.common_term_diskInfo_label+":",
                require: false,
                caption: "",
                data: [],
                id: "vmtDetailDiskTableId",
                columnsDraggable: false,
                enablePagination: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_disk_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "80"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacityGB_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.quantity);
                        },
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "80"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_setMode_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.allocType);
                        },
                        "bSortable":false,
                        "sWidth": "80"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storageMedia_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.mediaType == "SAN-Any" ? "Any": data.mediaType);
                        },
                        "bSortable":false,
                        "sWidth": "80"
                    },
                    {
                        "sTitle": $scope.i18n.vm_disk_view_para_affectedBySnap_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.indepDisk);
                        },
                        "bSortable":false,
                        "sWidth": "100"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storage_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.storageName);
                        },
                        "bSortable":false,
                        "sWidth": "100"
                    }
                ],
                "renderRow":function(row, dataitem, index) {
                    $("td:eq(0)", row).addTitle();
                    $("td:eq(2)", row).html($scope.allocType[dataitem.allocType]);
                    $("td:eq(4)", row).html($scope.indepDisk[dataitem.indepDisk]);
                }
            };

            /**
             * 配置模式列表
             * @type {Array}
             */
            $scope.allocTypeList = [{
                "key":"thickformat",
                "value":$scope.i18n.common_term_lazyZeroed_label
            },{
                "key":"thick",
                "value":$scope.i18n.common_term_common_label
            },{
                "key":"thin",
                "value":$scope.i18n.common_term_thinProv_label
            }];

            $scope.allocType = {
                "thickformat":$scope.i18n.common_term_lazyZeroed_label,
                "thick":$scope.i18n.common_term_common_label,
                "thin":$scope.i18n.common_term_thinProv_label
            };

            $scope.indepDisk = {
                "true":$scope.i18n.common_term_yes_button,
                "false":$scope.i18n.common_term_no_label
            };

            $scope.cpuHotPlug = {
                "0":$scope.i18n.vm_term_disableCPUliveAdjust_button,
                "1":$scope.i18n.vm_term_enableCPUliveAdd_button,
                "2":$scope.i18n.vm_term_enableCPUliveAdjust_button
            };

            $scope.vmtType = {
                "vapp_template":$scope.i18n.template_term_appVM_label,
                "desktop_template":$scope.i18n.template_term_deskVM_label,
                "vsa_template":$scope.i18n.template_term_VSA_label,
                "pvm_template":$scope.i18n.template_term_PVM_label
            };

            $scope.modify = function(type) {

                var deferred = camel.put({
                    "url": {"s": constants.rest.VM_TEMPLATE_MODIFY.url, "o": {"tenant_id": 1, "id": $scope.detail.id}},
                    "params":JSON.stringify({"type":type}),
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.complete(function (xmlHttpRequest, ts) {
                    if (xmlHttpRequest.status == "200" || xmlHttpRequest.status == "204") {
                        $scope.queryDetail($scope.detail.id);
                    }
                });
            };

            $scope.queryDetail = function(id) {
                var deferred = camel.get({
                    "url": {"s": constants.rest.VM_TEMPLATE_DETAIL.url, "o": {"tenant_id": 1, "id": id}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (response) {
                        $scope.$apply(function(){
                            if (!response) {
                                return;
                            }
                            $scope.detail.name = response.name;
                            $scope.detail.id = id;
                            $scope.detail.logicVmtName = response.vmLogicTemplateName;
                            $scope.type.value =  $scope.vmtType[response.type];
                            $scope.cpu.value = response.cpuInfo && response.cpuInfo.quantity;
                            $scope.cpuConfig.reservation = response.cpuInfo && response.cpuInfo.reservation;
                            $scope.cpuConfig.limit = response.cpuInfo && response.cpuInfo.limit;
                            $scope.cpuConfig.weight = response.cpuInfo && response.cpuInfo.weight;

                            $scope.memory.value = response.memoryInfo && response.memoryInfo.quantity;
                            $scope.memoryConfig.reservation = response.memoryInfo && response.memoryInfo.reservation;
                            $scope.memoryConfig.weight = response.memoryInfo && response.memoryInfo.weight;

                            $scope.diskTable.data = response.diskdetail;

                            if (!response.picture) {
                                $scope.model.picture = "../theme/default/images/vmTemplate/icon_vmtemplate_1.png";
                            } else {
                                $scope.model.picture = response.picture;
                            }


                            $scope.model.description = response.description;
                            $scope.model.osVersion = response.osOption && response.osOption.osVersion;
                            $scope.model.hypervisor = response.hypervisor;
                            $scope.model.cluster = response.clusterInfo.name;
                            $scope.model.host = response.host;
                            $scope.model.updateMode = $scope.updateModeString[response.updateMode];
                            $scope.model.syncTimeWithHost = $scope.booleanString[response.syncTimeWithHost];
                            $scope.model.blockHeatTranfer = $scope.blockHeatTranferString[response.blockHeatTranfer];
                            $scope.model.haFlag = $scope.booleanString[response.haFlag];
                            $scope.model.cpuHotPlugin = $scope.cpuHotPlug[response.cpuInfo.cpuHotPlug];
                            $scope.model.secStorage = response.secStorage;
                            $scope.model.attachISO = response.attachISO;

                            $scope.model.secStorage = response.storeName;
                            $scope.model.host = response.hostName;
                            $scope.model.hypervisor = response.virtualEnvName;
                            $scope.model.attachISO = response.attachedFilePath;
                        });
                    });

                deferred.fail(function (response) {
                    exception.doException(response);
                });
            };

            $scope.updateModeString = {
                "auto":$scope.i18n.common_term_auto_label,
                "manual":$scope.i18n.common_term_manual_label
            };
            $scope.booleanString = {
                "true":$scope.i18n.common_term_yes_button,
                "false":$scope.i18n.common_term_no_label
            };
            $scope.blockHeatTranferString = {
                "unSupport":$scope.i18n.common_term_notSupport_value,
                "support":$scope.i18n.common_term_support_value
            };
        }];

        var dependency = [];

        var vmtDetailModule = angular.module("template.vmTemplate.detail", []);

        vmtDetailModule.controller("template.vmTemplate.detail.ctrl", vmTemplateDetailCtrl);
        vmtDetailModule.service("camel", httpService);

        return vmtDetailModule;
    });

