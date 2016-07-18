/**
 * Created on 14-2-28.
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        "app/services/httpService",
        "tiny-widgets/Window",
        "tiny-lib/underscore",
        "tiny-common/UnifyValid",
        "app/business/ssp/controllers/plugin/app/constants",
        "tiny-directives/Button",
        "tiny-directives/Select",
        "fixtures/appFixture"
    ],
    function ($, angular, sprintf, ngSanitize, keyIDI18n, http, Window, _, UnifyValid, constants) {
        "use strict";
        var configParamCtrl = ["$scope", "$compile", "camel",
            function ($scope, $compile, camel) {
                $scope.vmNameMap = null;
                $scope.vmNicsMap = null;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.shareAssociate = $("#approvalApp_configApp_configSoftware_associate").widget().option("configSoftOrShell") || {};
                $scope.vm = {
                    "id": "approval_config_softAssociate_vm",
                    "label": i18n.common_term_vm_label + ":",
                    "require": true,
                    "width": "150",
                    "validate": "required:" + i18n.common_term_null_valid,
                    "values": [],
                    "change": function () {
                        var selVmId = $("#approval_config_softAssociate_vm").widget().getSelectedId();
                        var nics = $scope.vmNicsMap[selVmId];
                        var nicSelValues = [];
                        $("#approval_config_softAssociate_nic").widget().opChecked();
                        if (nics) {
                            var tmpNicSel;
                            _.each(nics, function (item, index) {
                                tmpNicSel = {
                                    "selectId": index + "",
                                    "label": item,
                                    "checked": false
                                };
                                nicSelValues.push(tmpNicSel);
                            });
                        }
                        $scope.nic.values = nicSelValues;
                    }
                };

                $scope.nic = {
                    "id": "approval_config_softAssociate_nic",
                    "label": i18n.common_term_NIC_label + ":",
                    "require": true,
                    "width": "150",
                    "validate": "required:" + i18n.common_term_null_valid,
                    "values": [],
                    "change": function () {
                        var selNicId = $("#approval_config_softAssociate_nic").widget().getSelectedId();
                        _.each($scope.nic.values, function (item, index) {
                            if (selNicId && (selNicId === item.selectId)) {
                                item.checked = true;
                            } else {
                                item.checked = false;
                            }
                        });
                    }
                };

                $scope.nextBtn = {
                    "id": "approvalApp-baseInfo-nextBtn",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#app_approval_configSoftware_associatePop"));
                        if (!valid) {
                            return;
                        }
                        if (!$scope.shareAssociate) {
                            return false;
                        }
                        var associateVmId = $("#approval_config_softAssociate_vm").widget().getSelectedId();
                        var associateVmLabel = $("#approval_config_softAssociate_vm").widget().getSelectedLabel();
                        var associateNicId = $("#approval_config_softAssociate_nic").widget().getSelectedId();
                        var associateNicLabel = $("#approval_config_softAssociate_nic").widget().getSelectedLabel();
                        var type = $scope.shareAssociate.type;
                        var name = $scope.shareAssociate.name;
                        var configScope = $("#app_approval_configSoftware_popwin").scope();
                        var option = getOptionByNameAndType(type, name);
                        if (!option) {
                            return;
                        }

                        if ("shellInstall" !== type) {
                            configScope.$apply(function () {
                                option.value = "$#vmName#.Nics.#nicName#.IP".replace("#vmName#", associateVmLabel).replace("#nicName#", associateNicLabel);
                                _.extend(option.associate, {
                                    "associateVmId": associateVmId,
                                    "associateVmLabel": associateVmLabel,
                                    "associateNicId": associateNicId,
                                    "associateNicLabel": associateNicLabel
                                });
                            });
                        } else {
                            var shellConfigScope = $("#app_approval_configSoftware_configShellId").scope();
                            shellConfigScope.$apply(function () {
                                option.value = "$#vmName#.Nics.#nicName#.IP".replace("#vmName#", associateVmLabel).replace("#nicName#", associateNicLabel);
                                _.extend(option.associate, {
                                    "associateVmId": associateVmId,
                                    "associateVmLabel": associateVmLabel,
                                    "associateNicId": associateNicId,
                                    "associateNicLabel": associateNicLabel
                                });
                            });
                        }

                        option.configWay = constants.paramConfigWay.BY_CHOOSE;
                        $("#approvalApp_configApp_configSoftware_associate").widget().destroy();
                    }
                };

                $scope.cancelBtn = {
                    "id": "approvalApp-baseInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#approvalApp_configApp_configSoftware_associate").widget().destroy();
                    }
                };

                function getOptionByNameAndType(type, optionName) {
                    if (!optionName) {
                        return null;
                    }

                    var scope;
                    var options;
                    if ("shellInstall" === type) {
                        scope = $("#app_approval_configSoftware_configShellId").scope();
                        options = scope.install.options;
                    } else {
                        scope = $("#app_approval_configSoftware_popwin").scope();
                        if ("install" === type) {
                            options = scope.install.options;
                        } else if ("uninstall" === type) {
                            options = scope.uninstall.options;
                        } else if ("start" === type) {
                            options = scope.start.options;
                        } else if ("stop" === type) {
                            options = scope.stop.options;
                        } else {
                            options = [];
                        }
                    }

                    //匹配配置弹出页面的源数据
                    var option;
                    for (var i = 0; i < options.length; i++) {
                        if (optionName === options[i].name) {
                            return options[i];
                        }
                    }
                    return null;
                }

                function init() {
                    $scope.vmNameMap = {};
                    var allVmNameMap = $("#approvalApp").scope().tmp.vmNameMap;
                    _.each(allVmNameMap, function (item, index) {
                        if ($scope.shareAssociate.vmTemplateAmeId && (index === $scope.shareAssociate.vmTemplateAmeId)) {
                            return;
                        }
                        $scope.vmNameMap[index] = allVmNameMap[index];
                    });
                    $scope.vmNicsMap = $("#approvalApp").scope().tmp.vmNicsMap;
                    var vmSelValues = [];
                    var tmpVmSel = null;
                    _.each($scope.vmNameMap, function (item, index) {
                        if ( $("#approvalApp").scope().tmp.vmTempInstanceMap[index]) {
                            tmpVmSel = {
                                "selectId": index,
                                "label": item
                            };
                            vmSelValues.push(tmpVmSel);
                        }
                    });

                    $scope.vm.values = vmSelValues;
                }

                init();
            }
        ];
        var configParamModule = angular.module("app.approval.configSoftware.associate", ["framework", "ngSanitize"]);
        configParamModule.controller("app.approval.configSoftware.associate.ctrl", configParamCtrl);
        configParamModule.service("camel", http);

        return configParamModule;
    });
