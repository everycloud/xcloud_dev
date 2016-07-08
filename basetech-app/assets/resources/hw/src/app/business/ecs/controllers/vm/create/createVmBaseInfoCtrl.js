/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：13-12-28
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/services/competitionConfig"
    ],
    function ($, angular, UnifyValid, validatorService, Competition) {
        "use strict";
        // 创建虚拟机第一步-基本信息
        var createVmBaseInfoCtrl = ["$scope", "$window",
            function ($scope, $window) {
                // 本页用到的服务实例
                var validator = new validatorService();
                var i18n = $scope.i18n;


                $scope.showClusterName = false;
                $scope.showClusterName =  Competition.isBaseOnVmware;

                var nameValidTip = i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 56);
                $scope.name = {
                    "label": i18n.vm_term_vmName_label + ":",
                    "require": true,
                    "width": "220",
                    "id": "ecsVmCreateVmName",
                    "validate": "regularCheck(" + validator.vmNameCreateReg + "):" + nameValidTip + ";" +
                        "regularCheck(" + validator.notAllSpaceReg + "):" + nameValidTip
                };

                $scope.computerName = {
                    "label": i18n.common_term_computerName_label + ":",
                    "require": false,
                    "width": "220",
                    "id": "ecsVmCreateComputerName",
                    "extendFunction": ["computerNameValid"],
                    "validate": "computerNameValid():" + i18n.common_term_compositionNoAllDigi_valid + i18n.sprintf(i18n.common_term_maxLength_valid, 13)
                };


                $scope.clusterName = {
                    "label": i18n.virtual_term_cluster_label + ":" || "资源集群" + ":",
                    "require": false,
                    "width": "220",
                    "id": "ecsVmCreateClusterName",
                    "validate": "regularCheck(" + validator.noConstraintMaxLength + "):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024")

                };

                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "require": false,
                    "id": "ecsVmCreateDescription",
                    "value": "",
                    "type": "multi",
                    "width": "220",
                    "height": "100",
                    "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
                };
                $scope.prevBtn = {
                    "id": "ecsVmCreateBaseInfoPrevBtn",
                    "text": i18n.common_term_back_button,
                    "tooltip": "",
                    "click": function () {
                        $scope.service.show = "selNetwork";
                        $("#ecsVmCreateStep").widget().pre();
                    }
                };

                $scope.nextBtn = {
                    "label": "",
                    "require": false,
                    "id": "ecsVmCreateBaseInfoNext",
                    "text": i18n.common_term_next_button,
                    "tooltip": "",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createVmBaseInfo"));
                        if (!valid) {
                            return;
                        }

                        //保存本页信息
                        $scope.service.vmName = $.trim($("#ecsVmCreateVmName").widget().getValue());
                        $scope.service.vmComputeName = $.trim($("#ecsVmCreateComputerName").widget().getValue());
                        $scope.service.description = $("#ecsVmCreateDescription").widget().getValue();
                        $scope.service.location = $("#ecsVmCreateClusterName").widget().getValue();


                        //跳转到下一步
                        $scope.service.show = "confirm";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmCreateBaseInfoCancel",
                    "text": i18n.common_term_cancle_button,
                    "tooltip": "",
                    "click": function () {
                        setTimeout(function () {
                            $window.history.back();
                        }, 0);
                    }
                };

                UnifyValid.computerNameValid = function () {
                    var input = $("#ecsVmCreateComputerName").widget().getValue();
                    if ($.trim(input) === "") {
                        return true;
                    }

                    var computerNameReg = /^[ ]*[A-Za-z0-9-]{1,13}[ ]*$/;
                    var notAllNumReg = /^.*[^0-9].*$/;
                    return computerNameReg.test(input) && notAllNumReg.test(input);
                };
            }
        ];
        return createVmBaseInfoCtrl;
    }
);
