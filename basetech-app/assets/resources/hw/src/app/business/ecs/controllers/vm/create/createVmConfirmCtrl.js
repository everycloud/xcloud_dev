/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：13-12-28
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/underscore',
        'app/business/ecs/services/vm/updateVmService',
        'app/services/messageService',
        "app/services/competitionConfig"
    ],
    function ($, angular, _, updateVmService, messageService, Competition) {
        "use strict";

        var createVmConfirmCtrl = ["$scope", "$window", "$state", "$q", "exception", "camel",
            function ($scope, $window, $state, $q, exception, camel) {
                var updateVmServiceIns = new updateVmService(exception, $q, camel);
                var messageIns = new messageService();
                var i18n = $scope.i18n;
                //本地存储类型
                var LOCAL_STORAGE_TYPE = "1";

                $scope.isICT = $scope.user.cloudType === "ICT";

                $scope.labelWidth = 85;
                $scope.labelHeight = "height27";

                $scope.name = {
                    "label": i18n.common_term_name_label + ":"
                };
                $scope.computeName = {
                    "label": i18n.common_term_computerName_label + ":"
                };
                $scope.description = {
                    "label": i18n.common_term_desc_label + ":"
                };
                $scope.templateName = {
                    "label":  i18n.common_term_name_label + ":"
                };
                $scope.os = {
                    "label": i18n.common_term_OStype_label + ":"
                };
                $scope.osType = {
                    "label": i18n.common_term_OSversion_label + ":"
                };
                $scope.configTemplate = {
                    "labelSystem": i18n.spec_term_sysSpec_label + ":",
                    "labelUserDefine": i18n.common_term_customSpec_label + ":"
                };
                $scope.sla = {
                    "label": "SLA:"
                };
                $scope.vmNum = {
                    "label": i18n.vm_term_vmNum_label + ":"
                };
                $scope.storageType = {
                    "label": i18n.common_term_storageType_label + ":"
                };
                $scope.az = {
                    "label": i18n.resource_term_AZ_label + ":"
                };
                $scope.vpc = {
                    "label": i18n.vpc_term_vpc_label  + ":"
                };
                $scope.network = {
                    "label": i18n.vpc_term_net_label + ":"
                };
                $scope.ipv4 = {
                    "label": i18n.common_term_IPv4_label + ":"
                };
                $scope.ipv6 = {
                    "label": i18n.common_term_IPv6_label + ":"
                };
                $scope.desc = {
                    "local": i18n.resource_stor_create_para_type_option_local_value,
                    "shared": i18n.resource_stor_create_para_type_option_share_value
                };

                $scope.preBtn = {
                    "id": "ecsVmCreateVmSpecPreBtn",
                    "text": i18n.common_term_back_button,
                    "tooltip": "",
                    "click": function () {
                        $scope.service.show = "baseInfo";
                        $("#ecsVmCreateStep").widget().pre();
                    }
                };
                $scope.nextBtn = {
                    "id": "ecsVmCreateVmConfirmNextBtn",
                    "text": i18n.common_term_complete_label,
                    "tooltip": "",
                    "click": function () {
                        var params = {
                            "templateId": $scope.service.selTemplateId,
                            "count": $scope.service.vmNum,
                            "namePrefix": $scope.service.vmName,
                            "hostNamePrefix": $scope.service.vmComputeName,
                            "description": $scope.service.description,
                            "vpcId": $scope.service.vpcId,
                            "dataType": $scope.service.dataType,
                            "vmSpec": {}
                        };

                        if (Competition.isBaseOnVmware) {
                            params["location"] = $scope.service.location;
                        }

                        if ($scope.service.sla && $scope.service.sla.value) {
                            params.tags = [{
                                "name": $scope.service.sla.name,
                                "value": $scope.service.sla.value
                            }];
                        }
                        //IT磁盘配置模式不是默认时，加上系统盘信息
                        var templateVols = $scope.service.selTemplate.templateDisks || null;
                        if (templateVols && templateVols.length > 0) {
                            _.each(templateVols, function (item, index) {
                                 item.size = item.quantity || item.quantityGB;
                                //AME模板的独立磁盘有误，与IRM的独立磁盘刚好相反，UI进行取反
                                item.indepDisk = item.indepDisk === "false" ? true : false;
                                if($scope.service.diskConfigType && $scope.service.diskConfigType !== "default"){
                                    item.configType = $scope.service.diskConfigType;
                                }
                            });
                            params.vmSpec.templateVols = templateVols;
                        }
                        if ($scope.service.configType === "system") {
                            var detail = $scope.service.configTemplate;
                            params.vmSpec.id = detail.flavorId;
                            if(!$scope.isICT){
                                params.vmSpec.cpu = {
                                    count: detail.cpuCount
                                };
                                params.vmSpec.memory = {
                                    count: detail.memSize
                                };
                                if(detail.qos){
                                    params.vmSpec.cpu.limit = detail.qos.cpuLimit;
                                    params.vmSpec.cpu.reservation = detail.qos.cpuReserve;
                                    params.vmSpec.cpu.weight = detail.qos.cpuShare;
                                    params.vmSpec.memory.reservation = detail.qos.memReserve;
                                    params.vmSpec.memory.weight = detail.qos.memShare;
                                }
                                params.vmSpec.userVols = [];
                                if (detail.disks && detail.disks.length > 0) {
                                    _.each(detail.disks, function (item, index) {
                                        if (index !== 0) {
                                            var vol = {
                                                "size": item.diskSize
                                            };
                                            if($scope.service.diskConfigType && $scope.service.diskConfigType !== "default"){
                                                vol.configType = $scope.service.diskConfigType;
                                            }
                                            params.vmSpec.userVols.push(vol);
                                        }
                                    });
                                }
                            }
                        } else {
                            params.vmSpec.cpu = {
                                count: $scope.service.cpuNum
                            };
                            params.vmSpec.memory = {
                                count: $scope.service.memory
                            };
                        }

                        if ($scope.service.networkType === "basic") {
                            params.vmSpec.nics = [{
                                "networkID": $scope.service.basicNetwork.networkID
                            }];
                        } else {
                            var networks = $scope.service.privateNetwork;
                            var nics = [];
                            var customNic = [];
                            var ipParam;
                            _.each(networks, function (item) {
                                nics.push({
                                    "networkID": item.networkID
                                });

                                ipParam = {};
                                if (item.ipv4) {
                                    ipParam.ip = item.ipv4;
                                }
                                if (item.ipv6) {
                                    ipParam.ips6 = [item.ipv6];
                                }
                                customNic.push(ipParam);
                            });

                            params.vmSpec.nics = nics;
                            params.vmUniqueInfo = [{
                                "customNic": customNic
                            }];
                        }

                        var options = {
                            "user": $scope.user,
                            "cloudInfraId": $scope.service.cloudInfra.id,
                            "vpcId": $scope.service.vpcId,
                            "params": params
                        };
                        var deferred = updateVmServiceIns.createVm(options);
                        deferred.then(function (data) {
                            messageIns.confirmMsgBox({
                                "content": i18n.task_view_task_info_confirm_msg + "<br>" + i18n.vm_vm_taskView_info_confirm_msg || "注意：若创建失败，则虚拟机列表中的虚拟机将自动删除。",
                                "callback": function () {
                                    $state.go("monitor.taskcenter");
                                },
                                "cancel": function() {
                                    $state.go("ecs.vm");
                                }
                            });
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "ecsVmCreateVmConfirmCancelBtn",
                    "text": i18n.common_term_cancle_button,
                    "tooltip": "",
                    "click": function () {
                        setTimeout(function () {
                            $window.history.back();
                        }, 0);
                    }
                };
            }
        ];

        return createVmConfirmCtrl;
    }
);
