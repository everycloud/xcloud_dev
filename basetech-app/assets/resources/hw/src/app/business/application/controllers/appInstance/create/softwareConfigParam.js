/**
 * Created on 14-2-28.
 */
define([
        "sprintf",
        'tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "tiny-widgets/Window",
        "tiny-lib/underscore",
        "tiny-common/UnifyValid",
        "app/business/application/controllers/constants",
        "app/services/messageService",
        "tiny-directives/Button",
        "tiny-directives/Select",
        "fixtures/appFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, Window, _, UnifyValid, constants, messageService) {
        "use strict";
        var configParamCtrl = ["$scope", "$compile", "camel", "appUtilService",
            function ($scope, $compile, camel, appUtilService) {
                $scope.allInputIds = [];
                $scope.shareSoftId = $("#createAppConfigApp").scope().shareSoftId;
                $scope.selSoftData = $("#createApp_configApp_configSoftwareWin").widget().option("selSoftData") || {};
                $scope.vmTemplateAmeId = $scope.selSoftData.vmTemplateAmeId;
                var vmNameMap = $scope.selSoftData.vmNameMap || {};
                var timeStamp4Id = new Date().getMilliseconds();
                var messageServiceIns = new messageService();
                var curVmTemplateName = vmNameMap[$scope.vmTemplateAmeId];
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.install = {
                    "open": true,
                    "click": function () {
                        $scope.install.open = !$scope.install.open;
                    },
                    "options": []
                };

                $scope.uninstall = {
                    "open": true,
                    "click": function () {
                        $scope.uninstall.open = !$scope.uninstall.open;
                    },
                    "options": []
                };

                $scope.start = {
                    "open": true,
                    "click": function () {
                        $scope.start.open = !$scope.start.open;
                    },
                    "options": []
                };

                $scope.stop = {
                    "open": true,
                    "click": function () {
                        $scope.stop.open = !$scope.stop.open;
                    },
                    "options": []
                };

                $scope.ok = {
                    "id": "app_create_configSoftware_configSoft_ok",
                    "text": i18n.common_term_confirm_label,
                    "click": function () {
                        clearAllValidate();
                        var valid = UnifyValid.FormValid($("#app_create_configSoftware_popwin"));
                        if (!valid) {
                            return;
                        }

                        //校验循环依赖,校验失败则不予保存  先将当前选中的逐一校验,校验通过一个则添加一个;循环校验直至失败/都通过,保存
                        appUtilService.recover();
                        var tmpDependenceId = null;
                        var i;
                        if ($scope.install.options && ($scope.install.options.length > 0)) {
                            for (i = 0; i < $scope.install.options.length; i++) {
                                if (!appUtilService.isValidDependence($scope.install.options[i])) {
                                    continue;
                                }

                                tmpDependenceId = $scope.install.options[i].associate.associateVmId;
                                //反向检测,如果存在则该配置项不成立
                                if (appUtilService.validateDepends(tmpDependenceId, $scope.vmTemplateAmeId)) {
                                    messageServiceIns.errorMsgBox(i18n.common_term_setError_value, appUtilService.generateErrorTips(curVmTemplateName, vmNameMap[tmpDependenceId]));
                                    return;
                                }
                                appUtilService.add($scope.vmTemplateAmeId, tmpDependenceId);
                            }
                        }
                        if ($scope.uninstall.options && ($scope.uninstall.options.length > 0)) {
                            for (i = 0; i < $scope.uninstall.options.length; i++) {
                                if (!appUtilService.isValidDependence($scope.uninstall.options[i])) {
                                    continue;
                                }

                                tmpDependenceId = $scope.uninstall.options[i].associate.associateVmId;
                                if (appUtilService.validateDepends(tmpDependenceId, $scope.vmTemplateAmeId)) {
                                    messageServiceIns.errorMsgBox(i18n.common_term_setError_value, appUtilService.generateErrorTips(curVmTemplateName, vmNameMap[tmpDependenceId]));
                                    return;
                                }
                                appUtilService.add($scope.vmTemplateAmeId, tmpDependenceId);
                            }
                        }
                        if ($scope.start.options && ($scope.start.options.length > 0)) {
                            for (i = 0; i < $scope.start.options.length; i++) {
                                if (!appUtilService.isValidDependence($scope.start.options[i])) {
                                    continue;
                                }

                                tmpDependenceId = $scope.start.options[i].associate.associateVmId;
                                if (appUtilService.validateDepends(tmpDependenceId, $scope.vmTemplateAmeId)) {
                                    messageServiceIns.errorMsgBox(i18n.common_term_setError_value, appUtilService.generateErrorTips(curVmTemplateName, vmNameMap[tmpDependenceId]));
                                    return;
                                }
                                appUtilService.add($scope.vmTemplateAmeId, tmpDependenceId);
                            }
                        }
                        if ($scope.stop.options && ($scope.stop.options.length > 0)) {
                            for (i = 0; i < $scope.stop.options.length; i++) {
                                if (!appUtilService.isValidDependence($scope.stop.options[i])) {
                                    continue;
                                }

                                tmpDependenceId = $scope.stop.options[i].associate.associateVmId;
                                if (appUtilService.validateDepends(tmpDependenceId, $scope.vmTemplateAmeId)) {
                                    messageServiceIns.errorMsgBox(i18n.common_term_setError_value, appUtilService.generateErrorTips(curVmTemplateName, vmNameMap[tmpDependenceId]));
                                    return;
                                }
                                appUtilService.add($scope.vmTemplateAmeId, tmpDependenceId);
                            }
                        }

                        saveSoftData();
                        $("#createApp_configApp_configSoftwareWin").widget().destroy();
                    }
                };

                $scope.cancel = {
                    "id": "app_create_configSoftware_configSoft_cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createApp_configApp_configSoftwareWin").widget().destroy();
                    }
                };

                function popupConfig(type, name, optionId) {
                    var configSoftOrShell = {
                        "type": type,
                        "name": name
                    };
                    configSoftOrShell.vmTemplateAmeId = $scope.selSoftData.vmTemplateAmeId;
                    var options = {
                        "winId": "createApp_configApp_configSoftware_associate",
                        "configSoftOrShell": configSoftOrShell,
                        "title":i18n.common_term_associate_button,
                        "width": "400px",
                        "height": "250px",
                        "content-type": "url",
                        "content": "app/business/application/views/appInstance/create/configParamAssociate.html",
                        "buttons": null
                    };
                    var win = new Window(options);
                    win.show();
                }

                $scope.configInputChange = function (type, name) {
                    var option = getOptionByNameAndType(type, name);
                    if (!option) {
                        return;
                    }

                    if (option.associate) {
                        option.associate.associateVmId = null;
                        option.associate.associateNicId = null;
                    }
                    option.configWay = constants.paramConfigWay.BY_INPUT;
                };

                function getOptionByNameAndType(type, name) {
                    if (!name) {
                        return null;
                    }
                    var options;
                    if ("install" === type) {
                        options = $scope.install.options;
                    } else if ("uninstall" === type) {
                        options = $scope.uninstall.options;
                    } else if ("start" === type) {
                        options = $scope.start.options;
                    } else if ("stop" === type) {
                        options = $scope.stop.options;
                    }
                    // shell分支
                    else if ("shellInstall" === type) {
                        options = $("#app_create_configSoftware_configShellId").scope().install.options;
                    } else {
                        options = [];
                    }

                    //匹配配置弹出页面的源数据
                    var option;
                    for (var i = 0; i < options.length; i++) {
                        if (name === options[i].name) {
                            return options[i];
                        }
                    }
                    return null;
                }

                //逐个保存install uninstall start stop数据
                function saveSoftData() {
                    var options;
                    var params;
                    var tmpOption;
                    options = $scope.install.options;
                    params = $scope.selSoftData.installParams;
                    save2Params(params, options);

                    options = $scope.uninstall.options;
                    params = $scope.selSoftData.unInstallParams;
                    save2Params(params, options);

                    options = $scope.start.options;
                    params = $scope.selSoftData.startParams;
                    save2Params(params, options);

                    options = $scope.stop.options;
                    params = $scope.selSoftData.stopParams;
                    save2Params(params, options);
                }

                function save2Params(params, options) {
                    if (!options || (options.length <= 0)) {
                        return;
                    }
                    for (var i = 0; i < options.length; i++) {
                        params[i].configWay = options[i].configWay;
                        if (params[i].configWay === constants.paramConfigWay.BY_INPUT) {
                            params[i].value = $("#" + options[i].id).widget().getValue();
                        } else {
                            params[i].value = options[i].value;
                            params[i].associateVmId = options[i].associate.associateVmId;
                            params[i].associateVmLabel = options[i].associate.associateVmLabel;
                            params[i].associateNicId = options[i].associate.associateNicId;
                            params[i].associateNicLabel = options[i].associate.associateNicLabel;
                        }
                    }
                }

                function initConfigSoft() {
                    var tmpArray = null;
                    var options = null;
                    var tmpOption = null;
                    var i;
                    tmpArray = $scope.selSoftData.installParams;
                    if (tmpArray && (tmpArray.length > 0)) {
                        options = [];
                        //此处为保证存取参数对应,避免无休止的遍历匹配
                        for (i = 0; i < tmpArray.length; i++) {
                            tmpOption = {};
                            tmpOption.name = tmpArray[i].label;
                            tmpOption.id = tmpOption.name;
                            tmpOption.label = $.trim(tmpArray[i].label) + ":";
                            tmpOption.require = true;
                            tmpOption.value = tmpArray[i].value;
                            tmpOption.id = "install-" + $.trim(tmpArray[i].label) + timeStamp4Id;
                            $scope.allInputIds.push(tmpOption.id);
                            tmpOption.validate = "required:"+i18n.common_term_null_valid+";";
                            tmpOption.associate = {
                                "id": "installAsso-" + $.trim(tmpArray[i].label) + timeStamp4Id,
                                "text": i18n.common_term_associate_button,
                                "click": popupConfig
                            };
                            tmpOption.configWay = constants.paramConfigWay.BY_CHOOSE;
                            options.push(tmpOption);
                        }
                        $scope.install.options = options;
                    }

                    tmpArray = $scope.selSoftData.unInstallParams;
                    if (tmpArray && (tmpArray.length > 0)) {
                        options = [];
                        for (i = 0; i < tmpArray.length; i++) {
                            tmpOption = {};
                            tmpOption.name = $.trim(tmpArray[i].label);
                            tmpOption.label = $.trim(tmpArray[i].label) + ":";
                            tmpOption.require = true;
                            tmpOption.value = tmpArray[i].value;
                            tmpOption.id = "unInstall-" + $.trim(tmpArray[i].label) + timeStamp4Id;
                            $scope.allInputIds.push(tmpOption.id);
                            tmpOption.validate = "required:"+i18n.common_term_null_valid+";";
                            tmpOption.associate = {
                                "id": "unInstallAsso-" + $.trim(tmpArray[i].label) + timeStamp4Id,
                                "text": i18n.common_term_associate_button,
                                "click": popupConfig
                            };
                            tmpOption.configWay = constants.paramConfigWay.BY_CHOOSE;
                            options.push(tmpOption);
                        }
                        $scope.uninstall.options = options;
                    }

                    tmpArray = $scope.selSoftData.startParams;
                    if (tmpArray && (tmpArray.length > 0)) {
                        options = [];
                        for (i = 0; i < tmpArray.length; i++) {
                            tmpOption = {};
                            tmpOption.name = $.trim(tmpArray[i].label);
                            tmpOption.label = $.trim(tmpArray[i].label) + ":";
                            tmpOption.require = true;
                            tmpOption.value = tmpArray[i].value;
                            tmpOption.id = "start-" + $.trim(tmpArray[i].label) + timeStamp4Id;
                            $scope.allInputIds.push(tmpOption.id);
                            tmpOption.validate = "required:"+i18n.common_term_null_valid+";";
                            tmpOption.associate = {
                                "id": "startAsso-" + $.trim(tmpArray[i].label) + timeStamp4Id,
                                "text": i18n.common_term_associate_button,
                                "click": popupConfig
                            };
                            tmpOption.configWay = constants.paramConfigWay.BY_CHOOSE;
                            options.push(tmpOption);
                        }
                        $scope.start.options = options;
                    }

                    tmpArray = $scope.selSoftData.stopParams;
                    if (tmpArray && (tmpArray.length > 0)) {
                        options = [];
                        for (i = 0; i < tmpArray.length; i++) {
                            tmpOption = {};
                            tmpOption.name = $.trim(tmpArray[i].label);
                            tmpOption.label = $.trim(tmpArray[i].label) + ":";
                            tmpOption.require = true;
                            tmpOption.value = tmpArray[i].value;
                            tmpOption.id = "stop-" + $.trim(tmpArray[i].label) + timeStamp4Id;
                            $scope.allInputIds.push(tmpOption.id);
                            tmpOption.validate = "required:"+i18n.common_term_null_valid+";";
                            tmpOption.associate = {
                                "id": "stopAsso-" + $.trim(tmpArray[i].label) + timeStamp4Id,
                                "text": i18n.common_term_associate_button,
                                "click": popupConfig
                            };
                            tmpOption.configWay = constants.paramConfigWay.BY_CHOOSE;
                            options.push(tmpOption);
                        }
                        $scope.stop.options = options;
                    }
                }

                function clearAllValidate() {
                    if ($scope.allInputIds.length > 0) {
                        _.each($scope.allInputIds, function (item, index) {
                            UnifyValid.clearValidate($("#" + item).find("input"));
                        });
                    }
                }

                initConfigSoft();
            }
        ];
        var configParamModule = angular.module("app.create.configSoftware", ['framework',"ngSanitize"]);
        configParamModule.controller("app.create.configSoftware.ctrl", configParamCtrl);
        configParamModule.service("camel", http);

        return configParamModule;
    });
