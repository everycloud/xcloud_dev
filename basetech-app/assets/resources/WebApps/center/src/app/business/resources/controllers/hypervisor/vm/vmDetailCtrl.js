/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Select",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/competitionConfig",
    "app/services/exceptionService",
    "app/services/commonService"],
    function ($, angular, Select, validatorService, UnifyValid, httpService, competition, Exception, commonService) {
        "use strict";

        var vmDetailCtrl = ["$scope", "$compile", "camel", "validator",'$sce', function ($scope, $compile, camel, validator,$sce) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.competition = competition;
            var pvStatus = {
                "starting": $scope.i18n.common_term_startuping_value,
                "notRunning": $scope.i18n.common_term_noRun_value,
                "running": $scope.i18n.common_term_running_value
            };
            $scope.info = {};
            $scope.label = {
                "ip":$scope.i18n.common_term_IP_label+":",
                "mac": "MAC:",
                "longId":$scope.i18n.common_term_globeID_label+":",
                "desc": $scope.i18n.common_term_desc_label + ":",
                "host": $scope.i18n.common_term_host_label + ":",
                "app": $scope.i18n.app_term_app_label + ":",
                "tag": $scope.i18n.cloud_term_tag_label + ":",
                "createTime": $scope.i18n.common_term_createAt_label + ":",
                "vncPw":$scope.i18n.common_term_initializtionPsw_label+":",
                "os": $scope.i18n.common_term_OStype_label + ":",
                "osVersion": $scope.i18n.common_term_OSversion_label + ":",
                "vmType": $scope.i18n.vm_term_vmType_label + ":",
                "imc": $scope.i18n.virtual_term_IMCmode_label + ":",
                "tools": "Tools:",
                "cluster": $scope.i18n.virtual_term_cluster_label + ":",
                "vdcId": "VDC ID" + ":",
                "disasterGroup": $scope.i18n.resource_term_disasterStorGroup_label + ":",
                "hypervisor": $scope.i18n.virtual_term_hypervisor_label + ":",
                "updateMethod": $scope.i18n.common_term_updateMode_label + ":",
                "storage": $scope.i18n.common_term_storage_label + ":",
                "useDisaster": $scope.i18n.vm_vm_create_para_useDisasterStor_label + ":",
                "az":$scope.i18n.resource_term_AZ_label+":"
            };

            $scope.getVm = function (vmId, detailId) {
                $scope.vmId = vmId;
                $scope.detailId = detailId;
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var vmInfo = data && data.vmInfo;
                    $scope.$apply(function () {
                        $scope.description = vmInfo.description;
                        $scope.vmId = vmInfo.id;
                        var nics = vmInfo.vmConfig && vmInfo.vmConfig.nics || [];
                        for (var j = 0; j < nics.length; j++) {
                            $scope.ip = $scope.ip ? $scope.ip + nics[j].ip : nics[j].ip;
                            $scope.mac = $scope.mac ? $scope.mac + "<br/>" + nics[j].mac : nics[j].mac;
                            var ips6 = nics[j].ips6 || [];
                            for (var k = 0; k < ips6.length; k++) {
                                $scope.ip = $scope.ip + "&nbsp;&nbsp&nbsp&nbsp&nbsp" + ips6[k];
                            }
                            $scope.ip = $scope.ip ? $scope.ip + "<br/>":$scope.ip;
                        }
                        $scope.ip = $scope.ip?$sce.trustAsHtml($scope.ip):$scope.ip;
                        $scope.mac = $scope.mac?$sce.trustAsHtml($scope.mac):$scope.mac;
                        $scope.hostName = vmInfo.hostName;
                        $scope.clusterName = vmInfo.clusterName;
                        $scope.vdcId = vmInfo.vdcId;
                        $scope.disasterGroup = vmInfo.disasterGroupName;
                        $scope.hypervisor = vmInfo.hypervisorName;
                        $scope.updateMethod = vmInfo.vmConfig.attribute.isAutoUpgrade ? $scope.i18n.common_term_auto_label : $scope.i18n.common_term_manual_label;
                        $scope.az = vmInfo.availableZoneName;
                        $scope.useDisaster = vmInfo.useDisasterGroup ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                        $scope.tools = pvStatus[vmInfo.pvDriverStatus];
                        if (vmInfo.pvDriverStatus === "running") {
                            $scope.tools = $scope.tools + "(" + $scope.i18n.common_term_version_label + "：" + vmInfo.toolVersion + ")";
                        }
                        var disks = vmInfo.vmConfig.disks || [];
                        for (var j = 0; j < disks.length; j++) {
                            $scope.dataStore = $scope.dataStore ? $scope.dataStore + ";" + disks[j].storageName : disks[j].storageName;
                        }
                        $scope.app = vmInfo.vappName;
                        $scope.tag = vmInfo.tag;
                        $scope.createTime = vmInfo.createTime ? commonService.utc2Local(vmInfo.createTime) : "";
                        $scope.vncPw = vmInfo.os && vmInfo.os.password;
                        if (vmInfo.os) {
                            $scope.os = vmInfo.os.osType;
                            $scope.osVersion = vmInfo.os.osVersiontype;
                        }
                        if (vmInfo.isTemplate && vmInfo.isTemplate === 'true') {
                            $scope.type = $scope.i18n.vm_term_templateVM_value;
                        } else if (vmInfo.isLinkClone === 'true') {
                            $scope.type = $scope.i18n.vm_term_linkedCloneVM_value;
                        } else if (vmInfo.category && vmInfo.category != 0) {
                            if (vmInfo.category == 1) {
                                $scope.type = $scope.i18n.vm_term_disasterVM_value;
                            } else if (vmInfo.category == 2) {
                                $scope.type = $scope.i18n.vm_term_placeholderVM_value;
                            }
                        } else {
                            $scope.type = $scope.i18n.vm_term_commonVM_value;
                        }
                        $scope.category = vmInfo.category ? vmInfo.category : 0;
                        $scope.imc = vmInfo.imcSetting || $scope.i18n.common_term_noTurnOn_value;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
        }];

        var dependency = ["ng", "wcc"];
        var vmDetailModule = angular.module("resources.hypervisor.vmDetail", dependency);
        vmDetailModule.service("camel", httpService);
        vmDetailModule.service("validator", validatorService);
        vmDetailModule.controller("resources.hypervisor.vmDetail.ctrl", vmDetailCtrl);
        return vmDetailModule;
    });


