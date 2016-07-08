define(['tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/ssp/controllers/plugin/app/constants",
    "app/business/ssp/services/catalog/catalogService"
], function ($, angular, _, constants, catalogService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$state", "$compile", "exception", "$q",
        function ($scope, camel, $state, $compile, exception, $q) {
            var user = $("html").scope().user;
            var i18n = $("html").scope().i18n;
            var catalogServiceIns = new catalogService(exception, $q, camel);
            $scope.info = {
                "preBtn": {
                    "id": "createApp-baseInfo-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = {
                            "chooseTemplate": false,
                            "basicInfo": false,
                            "chooseNetwork": false,
                            "configApp": false,
                            "configVlb": false,
                            "baseInfo" : true,
                            "confirmByTemplate": false
                        };
                        $("#createByTemplate-app-step").widget().pre();
                    }
                },
                "nextBtn": {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": $scope.params.action === "modify" ? i18n.common_term_modify_button : i18n.common_term_create_button,
                    "click": function () {
                        if ($scope.params.action === "modify"){
                            updateApp();
                        } else {
                            createApp();
                        }
                    }
                },
                "cancelBtn": {
                    "id": "createApp-baseInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.commonCancel();
                    }
                },
                "logo": {
                    "label": i18n.common_term_icon_label + ":",
                    "require": false,
                    "curLogo": "buff01.jpg"
                },
                "confirmInfo": {
                    "labelWidth": "85",
                    "serviceTemplateLabel": i18n.template_term_app_label + ":",
                    "needApproval" : i18n.service_term_approveType_label,
                    "location" : i18n.common_term_section_label,
                    "vpc" : i18n.vpc_term_vpc_label,
                    "nameLabel": i18n.common_term_name_label + ":",
                    "descriptionLabel": i18n.common_term_desc_label + ":",
                    "directory" : i18n.service_term_catalog_label + ":"
                },
                "locationLock": {
                    "label": "",
                    "require": "true",
                    "disable" : true,
                    "id": "locationConfirm",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [{
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label
                    }, {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label
                    }, {
                        "key": "0",
                        "text": i18n.user_term_lock_value,
                        "checked": true
                    }],
                    "layout": "horizon"
                },
                "vpcLock": {
                    "label": "",
                    "require": "true",
                    "disable" : true,
                    "id": "vpcConfirm",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [{
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label
                    }, {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label
                    }, {
                        "key": "0",
                        "text": i18n.user_term_lock_value,
                        "checked": true
                    }],
                    "layout": "horizon"
                },
                "networkLock": {
                    "label": "",
                    "require": "true",
                    "disable" : true,
                    "id": "networkSelectConfirm",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [{
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label
                    }, {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label
                    }, {
                        "key": "0",
                        "text": i18n.user_term_lock_value
                    }],
                    "layout": "horizon"
                },
                "vmLock": {
                    "label": "",
                    "require": "true",
                    "disable" : true,
                    "id": "vmSelectConfirm",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [{
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label
                    }, {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label
                    }, {
                        "key": "0",
                        "text": i18n.user_term_lock_value,
                        "checked": true
                    }],
                    "layout": "horizon"
                },
                "appLock": {
                    "label": "",
                    "require": "true",
                    "disable" : true,
                    "id": "appSelectConfirm",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [{
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label
                    }, {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label
                    }, {
                        "key": "0",
                        "text": i18n.user_term_lock_value,
                        "checked": true
                    }],
                    "layout": "horizon"
                },
                "vlbLock": {
                    "label": "",
                    "require": "true",
                    "disable" : true,
                    "id": "vlbSelectConfirm",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [{
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label
                    }, {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label
                    }, {
                        "key": "0",
                        "text": i18n.user_term_lock_value,
                        "checked": true
                    }],
                    "layout": "horizon"
                },
                "confirmNetworks": {
                    "id": "create-app-confirm-NetworkTable",
                    "enablePagination": true,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": i18n.vpc_term_net_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.vpc_term_vpc_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpcName);
                        }
                    }, {
                        "sTitle": i18n.common_term_availableSelect_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.networkId);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var networkSel = "<div><tiny-select id='id' values='values' width='150' change='change(rowIndex)' default-selectid='defaultNetworkId' validate='validate' disable='true'></tiny-select></div>";
                        var networkLink = $compile(networkSel);
                        var networkScope = $scope.$new();
                        networkScope.id = "createAppChooseNetworkNet" + iDataIndex;
                        networkScope.rowIndex = iDataIndex;
                        networkScope.defaultNetworkId = aData.networkId;
                        networkScope.values = aData.networkValues;
                        networkScope.validate = "required:" + i18n.common_term_null_valid;
                        networkScope.change = function (rowIndex) {
                            var selectNetworkId = $("#createAppChooseNetworkNet" + iDataIndex).widget().getSelectedId();
                            if (!$scope.templateNet.data[rowIndex]) {
                                return;
                            }
                            $scope.templateNet.data[rowIndex].networkId = selectNetworkId;
                            $scope.templateNet.data[rowIndex].networkName = $("#createAppChooseNetworkNet" + iDataIndex).widget().getSelectedLabel();
                            _.each($scope.templateNet.data[rowIndex].networkValues, function (item, index) {
                                if (selectNetworkId && (selectNetworkId === item.selectId)) {
                                    item.checked = true;
                                } else {
                                    item.checked = false;
                                }
                            });
                        };
                        var networkNode = networkLink(networkScope);
                        $("td:eq(2)", nRow).html(networkNode);
                    }
                },
                "confirmVmTable": {
                    "id": "createApp-configApp-confirmVmTable",
                    "enablePagination": true,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": "VM",
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_availableSelect_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.templateName);
                        }
                    }, {
                        "sTitle": i18n.spec_term_vm_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.specName);
                        }
                    }, {
                        "sTitle": i18n.spec_term_vmDetail_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.specDetail);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var templateIdSel = "<div><tiny-select id='id' values='values' width='150' change='change(rowIndex)' default-selectid='defaultTemplateId' validate='validate' disable='true'></tiny-select></div>";
                        var templateIdLink = $compile(templateIdSel);
                        var templateIdScope = $scope.$new();
                        templateIdScope.id = "createApp-configApp-selectTemplateConfirm" + iDataIndex;
                        templateIdScope.rowIndex = iDataIndex;
                        templateIdScope.defaultTemplateId = aData.templateId;
                        templateIdScope.validate = "required:" + i18n.common_term_null_valid;
                        templateIdScope.values = aData.templateValues;
                        templateIdScope.change = function (rowIndex) {};
                        var templateIdSelNode = templateIdLink(templateIdScope);
                        $("td:eq(1)", nRow).html(templateIdSelNode);

                        var specsSel = "<div><tiny-select id='id' values='values' width='150' change='change(rowIndex)' default-selectid='defaultSpecId' validate='validate' disable='true'></tiny-select></div>";
                        var specsSelLink = $compile(specsSel);
                        var specsSelScope = $scope.$new();
                        specsSelScope.id = "createApp-configApp-selectSpecsConfirm" + iDataIndex;
                        specsSelScope.rowIndex = iDataIndex;
                        specsSelScope.defaultSpecId = aData.spec;
                        specsSelScope.validate = "required:" + i18n.common_term_null_valid;
                        specsSelScope.values = aData.specValues;
                        specsSelScope.change = function (rowIndex) {};
                        var specsSelNode = specsSelLink(specsSelScope);
                        $("td:eq(2)", nRow).html(specsSelNode);

                        var specDetailTd = "<div class='customTableDetailMargin'><div title='{{specDetail}}' class='customTableDetailContent'>{{specDetail}}</div></div>";
                        var specDetailLink = $compile(specDetailTd);
                        specsSelScope.showDetail = true;
                        specsSelScope.specDetail = aData.specDetail;
                        specsSelScope.showSpecDetail = function () {};
                        var specDetailNode = specDetailLink(specsSelScope);
                        $("td:eq(3)", nRow).html(specDetailNode);
                    }
                },
                "confirmSoftwarePacks": {
                    "id": "createApp-configApp-confirmSoftwareTable",
                    "enablePagination": true,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": "VM",
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.template_term_software_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.softwareName);
                        }
                    }, {
                        "sTitle": i18n.common_term_availableSelect_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.softwareId);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var softPackSel = "<div><tiny-select id='id' values='values' width='200' change='change(rowIndex)' default-selectid='defaultSoftId' validate='validate' disable='true'></tiny-select></div>";
                        var softPackLink = $compile(softPackSel);
                        var softPackScope = $scope.$new();
                        softPackScope.id = "createApp-configApp-selectSoftPackConfirm" + iDataIndex;
                        softPackScope.defaultSoftId = aData.softwareId;
                        softPackScope.rowIndex = iDataIndex;
                        softPackScope.validate = "required:" + i18n.common_term_null_valid;
                        softPackScope.values = aData.softwareValues;
                        softPackScope.change = function (rowIndex) {};

                        var softPackNode = softPackLink(softPackScope);
                        $("td:eq(2)", nRow).html(softPackNode);

                        var optColumn = "<a href='javascript:void(0)' ng-click='popupConfig()'>" + i18n.common_term_setPara_label + "</a> ";
                        var optLink = $compile($(optColumn));
                        var optScope = $scope.$new();
                        optScope.id = "createApp_configApp_configSoftware";
                        optScope.popupConfig = function () {};
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).html(optNode);
                    }
                },
                "confirmShells": {
                    "id": "createApp-configApp-confirmShellTable",
                    "enablePagination": true,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": "VM",
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.template_term_script_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.shellName);
                        }
                    }, {
                        "sTitle": i18n.common_term_availableSelect_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.shellId);
                        }
                    }],
                    "data": null,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var softPackSel = "<div><tiny-select id='id' values='values' width='200' change='change()' default-selectid='defaultShellId' validate='validate' disable='true'></tiny-select></div>";
                        var softPackLink = $compile(softPackSel);
                        var softPackScope = $scope.$new();
                        softPackScope.id = "createApp-configApp-selectShellConfirm" + iDataIndex;
                        softPackScope.defaultShellId = aData.shellId;
                        softPackScope.validate = "required:" + i18n.common_term_null_valid;
                        softPackScope.values = aData.shellValues;
                        softPackScope.change = function () {};
                        var softPackNode = softPackLink(softPackScope);
                        $("td:eq(2)", nRow).html(softPackNode);

                        var operationConfig = "<a href='javascript:void(0)' ng-click='popupConfig()'>" + i18n.common_term_setPara_label + "</a> ";
                        var configLink = $compile($(operationConfig));
                        var configScope = $scope.$new();
                        configScope.id = "createApp_configApp_configShell";
                        configScope.popupConfig = function () {};
                        var configNode = configLink(configScope);
                        $("td:eq(3)", nRow).html(configNode);
                    }
                },
                "confirmAvailVlbs": {
                    "id": "create-app-templateTable4VlbConfirm",
                    "enablePagination": true,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": i18n.template_term_vm_label,
                        "sWidth": "30px",
                        "bSortable": false,
                        "bSearchable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.templateName);
                        }
                    }, {
                        "sTitle": i18n.common_term_NICname_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.nicName);
                        }
                    }, {
                        "sTitle": i18n.org_term_VDCnet_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.orgNetName);
                        }
                    }, {
                        "sTitle": i18n.app_term_associateVLB_button,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.associateVlb);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {}
                }
            };

            //回退操作后,确认页面需要感知并刷新
            $scope.$on($scope.events.selVlbParamNextFromParent, function (event, msg) {
                var confirmTemplateNet = [];
                _.each($scope.templateNet.data, function (item, index) {
                    confirmTemplateNet.push(item);
                });
                var confirmConfAppVmTemplates = [];
                _.each($scope.confAppVmTemplates.data, function (item, index) {
                    confirmConfAppVmTemplates.push(item);
                });
                $scope.templateNet.data = confirmTemplateNet;
                $scope.confAppVmTemplates.data = confirmConfAppVmTemplates;
            });

            //根据创建用户流程中选择的配置,更新服务模板体
            function updateTemplateBody() {
                //更新resources部分,包括vmTemplate,Network
                var resources = $scope.params.appTempBody.Resources;
                var tmpResource = null;
                var tmpNic = null;
                _.each(resources, function (item, index) {
                    tmpResource = resources[index];
                    if (!tmpResource) {
                        return;
                    }
                    if (tmpResource.Type === "GM::Network" && $scope.lock.networkLock === '0') {
                        updateNetwork(index, tmpResource);
                        return;
                    }
                    if (tmpResource.Type === "GM::VmTemplate") {
                        if ($scope.lock.vmLock === '0') {
                            updateVmTemplate(index, tmpResource);
                        }

                        if (tmpResource.Properties && tmpResource.Properties.Softwares && tmpResource.Properties.Softwares.length && (tmpResource.Properties.Softwares.length > 0) && $scope.lock.appLock === '0') {
                            _.each(tmpResource.Properties.Softwares, function (item, index) {
                                if (item && (item.Type === "Software")) {
                                    updateSoft(item.Id, item);
                                } else {
                                    updateShell(item.Id, item);
                                }
                            });
                        }
                        //以下是更新vlb信息
                        if (!$scope.tmp.ameIdVlbNetMap[index]) {
                            return;
                        }
                        if ($scope.lock.vlbLock === '0') {
                            updateVlbNic(tmpResource.Properties.Nics, $scope.tmp.ameIdVlbNetMap[index].nicIndex, $scope.tmp.ameIdVlbNetMap[index].associateVlbId);
                        }
                    }
                });
                return $scope.params.appTempBody;
            }

            function updateVlbNic(nics, vlbIndex, vlbId) {
                if (!nics || (nics.length <= 0) || !vlbId) {
                    return;
                }

                var vlbNic = nics[vlbIndex];
                if (!vlbNic) {
                    return;
                }
                vlbNic.Vlb = true;
                vlbNic.VlbId = vlbId;
            }

            //更新JSON体中的软件包或者脚本
            function updateSoft(ameId, softwarel) {
                if (!$scope.tmp.ameIdResourceMap[ameId]) {
                    exception.doFaultPopUp();
                    return;
                }
                var tableSoftwareRowData = $scope.tmp.ameIdResourceMap[ameId];
                if (!tableSoftwareRowData.softwareData) {
                    return;
                }
                softwarel.PackageID = tableSoftwareRowData.softwareId;
                softwarel.Version = tableSoftwareRowData.selVersion;
                softwarel.Provider = tableSoftwareRowData.selFileType;
                softwarel.DestinationPath = tableSoftwareRowData.selDestinationPath;
                softwarel.InstallCommands = tableSoftwareRowData.softwareData.installCommand || "";
                if (tableSoftwareRowData.softwareData.installParams && (tableSoftwareRowData.softwareData.installParams.length > 0)) {
                    var installParams = [];
                    _.each(tableSoftwareRowData.softwareData.installParams, function (item, index) {
                        installParams.push(formCommonParams(item));
                    });
                    softwarel.InstallParams = installParams;
                } else {
                    softwarel.InstallParams = [];
                }

                softwarel.UninstallCommands = tableSoftwareRowData.softwareData.unInstallCommand || "";
                if (tableSoftwareRowData.softwareData.unInstallParams && (tableSoftwareRowData.softwareData.unInstallParams.length > 0)) {
                    var uninstallParams = [];
                    _.each(tableSoftwareRowData.softwareData.unInstallParams, function (item, index) {
                        uninstallParams.push(formCommonParams(item));
                    });
                    softwarel.UninstallParams = uninstallParams;
                } else {
                    softwarel.UninstallParams = [];
                }

                softwarel.StartCommands = tableSoftwareRowData.softwareData.startCommand || "";
                if (tableSoftwareRowData.softwareData.startParams && (tableSoftwareRowData.softwareData.startParams.length > 0)) {
                    var startParams = [];
                    _.each(tableSoftwareRowData.softwareData.startParams, function (item, index) {
                        startParams.push(formCommonParams(item));
                    });
                    softwarel.StartParams = startParams;
                } else {
                    softwarel.StartParams = [];
                }

                softwarel.StopCommands = tableSoftwareRowData.softwareData.stopCommand || "";
                if (tableSoftwareRowData.softwareData.stopParams && (tableSoftwareRowData.softwareData.stopParams.length > 0)) {
                    var stopParams = [];
                    _.each(tableSoftwareRowData.softwareData.stopParams, function (item, index) {
                        stopParams.push(formCommonParams(item));
                    });
                    softwarel.StopParams = stopParams;
                } else {
                    softwarel.StopParams = [];
                }
            }

            function formCommonParams(param) {
                var paramName = param.label;
                var result;
                if (constants.paramConfigWay.BY_CHOOSE === param.configWay) {
                    var refId = $scope.tmp.vmTempInstanceMap[param.associateVmId];
                    var refNicIp = "Nics." + param.associateNicLabel + ".IP";
                    result = {};
                    result[paramName] = {
                        "Ref": [refId, refNicIp]
                    };
                    return result;
                }

                //引用公共参数
                var commonParamName = matchCommonParam(param.value);
                if (commonParamName && (commonParamName !== "")) {
                    var ref = {
                        "Ref": ["Parameters", commonParamName]
                    };
                    result = {};
                    result[paramName] = ref;
                    return result;
                }
                //直接输入参数
                else {
                    result = {};
                    var value = $.trim(param.value);
                    result[paramName] = value;
                    return result;
                }
            }

            //引用公共参数形式:"#Parameters.ip#"
            function matchCommonParam(str) {
                if (!str) {
                    return null;
                }
                str = $.trim(str);
                var patt = /^#Parameters\.[a-zA-Z0-9_]+#$/g;
                var resultSet = str.match(patt);
                if (!resultSet || (resultSet.length <= 0)) {
                    return null;
                }

                var endIndex = str.lastIndexOf("#");
                var startIndex = "#Parameters.".length;
                return str.substring(startIndex, endIndex);
            }

            function updateShell(ameId, shell) {
                if (!$scope.tmp.ameIdResourceMap[ameId]) {
                    exception.doFaultPopUp();
                    return;
                }
                var tableShellRowData = $scope.tmp.ameIdResourceMap[ameId];
                shell.PackageID = tableShellRowData.shellId;
                shell.Version = tableShellRowData.selVersion;
                shell.Provider = tableShellRowData.selFileType;
                shell.DestinationPath = tableShellRowData.selDestinationPath;
                if (!tableShellRowData.shellData) {
                    return;
                }
                shell.InstallCommands = tableShellRowData.shellData.installCommand || "";
                if (tableShellRowData.shellData.installParams && (tableShellRowData.shellData.installParams.length > 0)) {
                    var installParams = [];
                    _.each(tableShellRowData.shellData.installParams, function (item, index) {
                        installParams.push(formCommonParams(item));
                    });
                    shell.InstallParams = installParams;
                } else {
                    shell.InstallParams = [];
                }

                //归避应用模板结构与后台不一致问题
                shell.UninstallParams = [];
                shell.StartParams = [];
                shell.StopParams = [];
            }

            function updateNetwork(ameId, network) {
                if (!$scope.tmp.ameIdResourceMap[ameId]) {
                    exception.doFaultPopUp();
                    return;
                }
                network.Properties.NetworkID = $scope.tmp.ameIdResourceMap[ameId].networkId;
                network.Properties.Name = $scope.tmp.ameIdResourceMap[ameId].networkName;
            }

            function updateVmTemplate(ameId, vmTemplate) {
                if (!$scope.tmp.ameIdResourceMap[ameId]) {
                    exception.doFaultPopUp();
                    return;
                }
                var selectVmTemplate = $scope.tmp.ameIdResourceMap[ameId];
                vmTemplate.Properties.VmTemplateID = selectVmTemplate.templateId;
                vmTemplate.Properties.VmTempateName = selectVmTemplate.templateName;
                vmTemplate.Properties.CPU = selectVmTemplate.selSpecCpu;
                vmTemplate.Properties.Memory = selectVmTemplate.selSpecRam;
                var volumes = [];
                var tmpVolume = null;
                if (selectVmTemplate.selSpecDisk && (selectVmTemplate.selSpecDisk.length > 0)) {
                    for (var i = 0; i < selectVmTemplate.selSpecDisk.length; i++) {
                        tmpVolume = {};
                        tmpVolume.Name = selectVmTemplate.selSpecDisk[i].index;
                        tmpVolume.AllocType = "thick";
                        tmpVolume.AffectBySnapshot = "false";
                        tmpVolume.MediaType = "SAN-Any";
                        tmpVolume.SystemDefault = (i === 0 ? "true" : "false");
                        tmpVolume.Size = selectVmTemplate.selSpecDisk[i].diskSize;
                        volumes.push(tmpVolume);
                    }
                }
                vmTemplate.Properties.Volumes = volumes;
            }

            function generateParameters() {
                var parameters = [];
                if (!$scope.commonParams.data || ($scope.commonParams.data.length <= 0)) {
                    return parameters;
                }
                _.each($scope.commonParams.data, function (item, index) {
                    var newItem = {};
                    newItem.name = item.name;
                    newItem.value = item.value;
                    newItem.desc = item.description;
                    newItem.type = item.type;
                    parameters.push(newItem);
                });
                return parameters;
            }

            function updateApp() {
                var templateBodyStr = updateTemplateBody();
                var appData = {
                    "templateNet" : $scope.templateNet,
                    "confAppVmTemplates" : $scope.confAppVmTemplates,
                    "confAppSoftPacks" : $scope.confAppSoftPacks,
                    "confAppShells" : $scope.confAppShells,
                    "confVlbVmTemplates" : $scope.confVlbVmTemplates,
                    "commonParams" : $scope.commonParams
                };
                var paramsJson = {
                    "cloudInfraId": $scope.lock.locationLock === "0" ? $scope.params.cloudInfraId : "",
                    "vpcId": $scope.lock.vpcLock === "0" ? $scope.params.selVpcId : "",
                    "picture": $scope.params.curLogo,
                    "templateId": $scope.detail.param.templateId,
                    "lock" : $scope.lock,
                    "appData" : $.base64.encode(JSON.stringify(appData), true),
                    "appType" : "it",
                    "templateBody": $.base64.encode(JSON.stringify(templateBodyStr),true),
                    "parameters" : generateParameters()
                };

                var options = {
                    "user": user,
                    "serviceId" : $scope.params.serviceId,
                    "params" : {
                        "name": $scope.params.appName,
                        "iconId" : $scope.params.iconId,
                        "description": $scope.params.description,
                        "approveType" : $scope.params.approvalType,
                        "catalogs" : $("#createDirectory").widget().getSelectedId(),
                        "params" : JSON.stringify(paramsJson)
                    }
                };

                var deferred = catalogServiceIns.modifyService(options);
                deferred.then(function (data) {
                    $state.go("ssp.catalog");
                });
            }

            function createApp() {
                var templateBodyStr = updateTemplateBody();
                var appData = {
                    "templateNet" : $scope.templateNet,
                    "confAppVmTemplates" : $scope.confAppVmTemplates,
                    "confAppSoftPacks" : $scope.confAppSoftPacks,
                    "confAppShells" : $scope.confAppShells,
                    "confVlbVmTemplates" : $scope.confVlbVmTemplates,
                    "commonParams" : $scope.commonParams
                };
                var paramsJson = {
                    "cloudInfraId": $scope.lock.locationLock === "0" ? $scope.params.cloudInfraId : "",
                    "vpcId": $scope.lock.vpcLock === "0" ? $scope.params.selVpcId : "",
                    "picture": $scope.params.curLogo,
                    "templateId": $scope.params.appTemplateId,
                    "lock" : $scope.lock,
                    "appData" : $.base64.encode(JSON.stringify(appData), true),
                    "appType" : "it",
                    "templateBody": $.base64.encode(JSON.stringify(templateBodyStr),true),
                    "parameters" : generateParameters()
                };
                var options = {
                    "user": user,
                    "params" : {
                        "serviceTemplateId"  : $scope.params.templateId,
                        "name": $scope.params.appName,
                        "iconId" : $scope.params.iconId,
                        "description": $scope.params.description,
                        "approveType" : $scope.params.approvalType,
                        "catalogs" : $("#createDirectory").widget().getSelectedId(),
                        "params" : JSON.stringify(paramsJson)
                    }
                };

                var deferred = catalogServiceIns.createService(options);
                deferred.then(function (data) {
                    $state.go("ssp.catalog");
                });
            }

            function init(){
                var locationLock = $("#" + $scope.info.locationLock.id).widget();
                var vpcLock = $("#" + $scope.info.vpcLock.id).widget();

                locationLock.opChecked($scope.lock.locationLock, true);
                vpcLock.opChecked($scope.lock.vpcLock, true);

                locationLock.opDisabled("0", true);
                locationLock.opDisabled("1", true);
                locationLock.opDisabled("2", true);
                vpcLock.opDisabled("0", true);
                vpcLock.opDisabled("1", true);
                vpcLock.opDisabled("2", true);

                var nLock = $("#" + $scope.info.networkLock.id).widget();
                nLock.opChecked($scope.lock.networkLock, true);
                nLock.opDisabled("0", true);
                nLock.opDisabled("1", true);
                nLock.opDisabled("2", true);

                var vLock = $("#" + $scope.info.vmLock.id).widget();
                var aLock = $("#" + $scope.info.appLock.id).widget();
                vLock.opChecked($scope.lock.vmLock, true);
                vLock.opDisabled("0", true);
                vLock.opDisabled("1", true);
                vLock.opDisabled("2", true);
                if (aLock) {
                    aLock.opChecked($scope.lock.appLock, true);
                    aLock.opDisabled("0", true);
                    aLock.opDisabled("1", true);
                    aLock.opDisabled("2", true);
                }

                vLock = $("#" + $scope.info.vlbLock.id).widget();
                if (vLock) {
                    vLock.opChecked($scope.lock.vlbLock, true);
                    vLock.opDisabled("0", true);
                    vLock.opDisabled("1", true);
                    vLock.opDisabled("2", true);
                }
            }

            $scope.$on($scope.events.selConfirmFormParent, function (event, msg) {
                init();
            });
        }
    ];
    return ctrl;
});
