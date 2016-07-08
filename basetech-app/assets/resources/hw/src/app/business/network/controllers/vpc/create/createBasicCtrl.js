/*global define*/
define(["jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/cloudInfraService"
], function ($, angular, _, UnifyValid, validatorService, cloudInfraService) {
    "use strict";

    var ctrl = ["$q", "$scope", "camel",
        function ($q, $scope, camel) {
            var validator = new validatorService();
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var i18n = $scope.i18n;
            var user = $scope.user;
            $scope.isICT = user.cloudType === "ICT";
            $scope.baseInfo = {
                name: {
                    "id": "create-vpc-name",
                    label: i18n.common_term_name_label + ":",
                    "width": "224",
                    require: true,
                    validate: "required: " + i18n.common_term_null_valid + ";regularCheck(" + validator.vpcName + "): " + i18n.common_term_format_valid + "; regularCheck(" + validator.notAllSpaceReg + "): " + i18n.common_term_format_valid,
                    "tooltip": i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "16"),
                    "tipPosition": "right"
                },
                description: {
                    label: i18n.common_term_desc_label + ":",
                    "id": "create-vpc-description",
                    "type": "multi",
                    "width": "224",
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                    "tooltip": i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                    "tipPosition": "right"
                },
                resourcepool: {
                    label: i18n.common_term_section_label + ":",
                    "id": "create-vpc-resourcepool",
                    "require": true,
                    "change": function () {
                        $scope.service.cloudInfraId = $("#create-vpc-resourcepool").widget().getSelectedId();
                        if (!$scope.service.isICT) {
                            queryAz();
                        }
                    },
                    "width": "224",
                    validate: "required: " + i18n.common_term_null_valid
                },
                az: {
                    label: i18n.resource_term_AZ_label + ":",
                    "id": "create-vpc-az",
                    "dftSelectId": "",
                    "require": true,
                    "change": function () {
                        $scope.service.azIDs = $("#create-vpc-az").widget().getSelectedId();
                    },
                    "width": "224",
                    "height": "200",
                    validate: "required: " + i18n.common_term_null_valid
                },
                nextBtn: {
                    "id": "create-vpc-step1-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        //校验是否输入
                        var valid = UnifyValid.FormValid($("#createVPCBasicDiv"), undefined);
                        if (!valid) {
                            return;
                        }

                        //ict跳转配额页面
                        if($scope.isICT){
                            $scope.service.show = "vpcQuota";
                            $scope.service.step.values = [
                                i18n.common_term_basicInfo_label,
                                i18n.org_term_quotaMgt_button,
                                i18n.vpc_vpc_add_para_cfg_label,
                                i18n.common_term_confirmInfo_label];
                        }else{
                            $scope.service.show = "vpcType";
                        }
                        $("#" + $scope.service.step.id).widget().next();

                        //获取用户输入的参数值
                        $scope.service.name = $("#create-vpc-name").widget().getValue();
                        $scope.service.description = $("#create-vpc-description").widget().getValue();
                        $scope.service.azIDs = $("#create-vpc-az").widget().getSelectedId();
                        $scope.service.cloudInfraId = $("#create-vpc-resourcepool").widget().getSelectedId();
                    }
                },
                cancelBtn: {
                    "id": "create-vpc-step1-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

            // 查询地域
            function getAllClouds() {
                $scope.service.resourcepools = null;
                $scope.service.azValues = null;
                var deferred = cloudInfraServiceIns.queryCloudInfras($scope.service.user.vdcId, $scope.service.user.id);
                deferred.then(function (data) {
                    if (!data || data.cloudInfras.length <= 0) {
                        $scope.service.cloudInfraId = null;
                        $scope.service.azIDs = null;
                        return;
                    }
                    var cloudInfraId = $scope.service.cloudInfraId;
                    var exist = null;
                    var cloudInfras = data.cloudInfras;
                    _.each(cloudInfras, function (item) {
                        item.checked = false;
                        if (item.selectId === cloudInfraId) {
                            exist = item;
                            item.checked = true;
                        }
                    });
                    if (!exist) {
                        $scope.service.cloudInfraId = cloudInfras[0].selectId;
                        cloudInfras[0].checked = true;
                    }
                    $scope.service.resourcepools = cloudInfras;
                    // ICT场景不感知AZ
                    if (!$scope.service.isICT) {
                        queryAz();
                    }
                });
            }

            function queryAz() {
                var promise = cloudInfraServiceIns.queryAzs($scope.service.user.vdcId, $scope.service.user.id, $scope.service.cloudInfraId);
                promise.then(function (data) {
                    if (!data || data.availableZones.length <= 0) {
                        $("#create-vpc-az").widget().opChecked();
                        return;
                    }
                    var azIDs = $scope.service.azIDs;
                    var exist = null;
                    var availableZones = data.availableZones;
                    _.each(availableZones, function (item) {
                        item.checked = false;
                        if (item.selectId === azIDs) {
                            exist = item;
                            item.checked = true;
                        }
                    });
                    if (!exist) {
                        $scope.service.azIDs = availableZones[0].selectId;
                        availableZones[0].checked = true;
                    }
                    $scope.service.azValues = availableZones;
                });
            }

            getAllClouds();
        }
    ];
    return ctrl;
});
