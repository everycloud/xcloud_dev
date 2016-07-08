/**
 * Created by on 14-3-3.
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        "app/services/httpService",
        "app/business/ssp/controllers/plugin/app/constants",
        "tiny-widgets/Window",
        "tiny-common/UnifyValid",
        "app/services/messageService",
        "tiny-lib/underscore",
        "tiny-directives/Button",
        "tiny-directives/Select",
        "fixtures/appFixture"
    ],
    function ($, angular, sprintf, ngSanitize, keyIDI18n, http, constants, Window, UnifyValid, messageService, _) {
        "use strict";
        var configShellCtrl = ["$scope", "$compile", "camel", "appUtilService",
            function ($scope, $compile, camel, appUtilService) {
                $scope.allInputIds = [];
                var timeStamp4Id = new Date().getMilliseconds();
                var messageServiceIns = new messageService();
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.shareShellId = $("#approvalApp").scope().shareShellId;
                $scope.selShellData = $("#approvalApp_configApp_configShellWin").widget().option("selShellData");
                $scope.vmTemplateAmeId = $scope.selShellData.vmTemplateAmeId;
                var vmNameMap = $scope.selShellData.vmNameMap || {};
                var curVmTemplateName = vmNameMap[$scope.vmTemplateAmeId];

                $scope.install = {
                    "open": true,
                    "click": function () {
                        $scope.install.open = !$scope.install.open;
                    },
                    "options": []
                };

                $scope.ok = {
                    "id": "app_approval_configApp_configShell_ok",
                    "text": i18n.common_term_confirm_label,
                    "click": function () {
                        clearAllValidate();
                        var valid = UnifyValid.FormValid($("#app_approval_configSoftware_configShellId"));
                        if (!valid) {
                            return;
                        }

                        //校验循环依赖,校验失败则不予保存  先将当前选中的逐一校验,校验通过一个则添加一个;循环校验直至失败/都通过,保存
                        appUtilService.recover();
                        var tmpDependenceId = null;
                        if ($scope.install.options && ($scope.install.options.length > 0)) {
                            for (var i = 0; i < $scope.install.options.length; i++) {
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

                        saveShellData();
                        $("#approvalApp_configApp_configShellWin").widget().destroy();
                    }
                };

                $scope.cancel = {
                    "id": "app_approval_configApp_configShell_cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#approvalApp_configApp_configShellWin").widget().destroy();
                    }
                };

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
                    if ("shellInstall" === type) {
                        options = $scope.install.options;
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

                function popupConfig(type, name) {
                    var configSoftOrShell = {
                        "type": type,
                        "name": name
                    };
                    configSoftOrShell.vmTemplateAmeId = $scope.selShellData.vmTemplateAmeId;
                    var options = {
                        "winId": "approvalApp_configApp_configSoftware_associate",
                        "configSoftOrShell": configSoftOrShell,
                        "title": i18n.common_term_associate_button,
                        "width": "400px",
                        "height": "250px",
                        "content-type": "url",
                        "content": "app/business/ssp/views/plugin/app/approval/configParamAssociate.html",
                        "buttons": null
                    };
                    var win = new Window(options);
                    win.show();
                }

                //queryShellDetails();
                //解析命令,"sh install ${python_ljbP}"
                function matchParams2Array(str) {
                    if (!str) {
                        return null;
                    }
                    var patt = /\$\{[^{}]+\}/g;
                    var resultSet = str.match(patt);
                    if (resultSet.length <= 0) {
                        return null;
                    }
                    var result = [];
                    var tmpParam = null;
                    _.each(resultSet, function (item, index) {
                        tmpParam = getParams($.trim(item));
                        if (tmpParam) {
                            result.push(tmpParam);
                        }
                    });
                    return result;
                }

                //解析字符串,返回变量名和初始值  匹配:"${a=123}"  输出:["a", "23"]
                function getParams(matchParam) {
                    if (!matchParam) {
                        return null;
                    }
                    var start = matchParam.indexOf("{");
                    var stop = matchParam.indexOf("}");
                    if ((start < 0) || (stop < 0)) {
                        return null;
                    }
                    var matchedParam = matchParam.substring(start + 1, stop);
                    if ("" === matchedParam) {
                        return null;
                    }
                    var result = {
                        "original": matchedParam
                    };
                    var splitParam = matchedParam.split("=");
                    result.label = splitParam[0];
                    result.value = (splitParam.length > 1 ? splitParam[1] : null);
                    return result;
                }

                function initConfigShell() {
                    var tmpArray = null;
                    var options = null;
                    var tmpOption = null;
                    tmpArray = $scope.selShellData.installParams;
                    if (tmpArray && (tmpArray.length > 0)) {
                        options = [];
                        for (var i = 0; i < tmpArray.length; i++) {
                            tmpOption = {};
                            tmpOption.name = $.trim(tmpArray[i].label);
                            tmpOption.id = tmpOption.name;
                            tmpOption.label = $.trim(tmpArray[i].label) + ":";
                            tmpOption.require = true;
                            tmpOption.value = tmpArray[i].value;
                            tmpOption.id = "sInstall-" + $.trim(tmpArray[i].label) + timeStamp4Id;
                            $scope.allInputIds.push(tmpOption.id);
                            tmpOption.validate = "required:" + i18n.common_term_null_valid;
                            tmpOption.associate = {
                                "id": "sInstallAsso-" + $.trim(tmpArray[i].label) + timeStamp4Id,
                                "text": i18n.common_term_associate_button,
                                "click": popupConfig
                            };
                            tmpOption.configWay = tmpArray[i].configWay;
                            if (tmpArray[i].associateVmId) {
                                tmpOption.associate.associateVmId = tmpArray[i].associateVmId;
                                tmpOption.associate.associateVmLabel = tmpArray[i].associateVmLabel;
                                tmpOption.associate.associateNicId = tmpArray[i].associateNicId;
                                tmpOption.associate.associateNicLabel = tmpArray[i].associateNicLabel;
                            }
                            options.push(tmpOption);
                        }
                        $scope.install.options = options;
                    }
                }

                function saveShellData() {
                    var options;
                    var params;
                    options = $scope.install.options;
                    params = $scope.selShellData.installParams;
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

                function clearAllValidate() {
                    if ($scope.allInputIds.length > 0) {
                        _.each($scope.allInputIds, function (item, index) {
                            UnifyValid.clearValidate($("#" + item).find("input"));
                        });
                    }
                }

                initConfigShell();
            }
        ];

        var configParam = angular.module("app.approval.configShell", ["framework", "ngSanitize"]);
        configParam.controller("app.approval.configShell.ctrl", configShellCtrl);
        configParam.service("camel", http);

        return configParam;
    }
);
