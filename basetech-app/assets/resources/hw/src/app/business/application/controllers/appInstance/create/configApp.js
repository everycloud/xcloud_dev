/*global define*/
define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    'tiny-common/UnifyValid',
    "app/services/messageService",
    "app/business/application/controllers/constants",
    "app/business/application/services/appCommonService",
    "fixtures/appFixture"
],
    function ($, encoder, angular, _, Window, UnifyValid, MessageService, constants, appCommonService) {
        "use strict";

        var ctrl = ["$scope", "camel", "$compile", "$state", "exception", "appUtilService", "$q",
            function ($scope, camel, $compile, $state, exception, appUtilService, $q) {
                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n;
                var messageService = new MessageService();
                var appCommonServiceIns = new appCommonService(exception, $q, camel);

                $scope.info = {
                    "vmTable": {
                        "id": "createApp-configApp-vmTable",
                        "enablePagination": true,
                        "draggable": true,
                        "paginationStyle": "full_numbers",
                        "lengthMenu": [10, 20, 30],
                        "columns": [
                            {
                                "sTitle": "VM",
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.name);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_availableSelect_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.templateId);
                                }
                            },
                            {
                                "sTitle": i18n.spec_term_vm_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.spec);
                                }
                            },
                            {
                                "sTitle": i18n.spec_term_vmDetail_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.specDetail);
                                }
                            }
                        ],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var templateIdSel = "<div><tiny-select id='id' values='values' width='220' change='change(rowIndex)' default-selectid='defaultTemplateId' validate='validate'></tiny-select></div>";
                            var templateIdLink = $compile(templateIdSel);
                            var templateIdScope = $scope.$new();
                            templateIdScope.id = "createApp-configApp-selectTemplate" + iDataIndex;
                            templateIdScope.rowIndex = iDataIndex;
                            if ((null === aData.templateId) || (undefined === aData.templateId)) {
                                templateIdScope.defaultTemplateId = "";
                            } else {
                                templateIdScope.defaultTemplateId = aData.templateId;
                            }
                            templateIdScope.validate = "required:" + i18n.common_term_null_valid + ";";
                            templateIdScope.values = aData.templateValues;
                            templateIdScope.change = function (rowIndex) {
                                var selectTemplateId = $("#createApp-configApp-selectTemplate" + rowIndex).widget().getSelectedId();
                                var selectTemplateName = $("#createApp-configApp-selectTemplate" + rowIndex).widget().getSelectedLabel();
                                if (!$scope.confAppVmTemplates.data[rowIndex]) {
                                    return;
                                }
                                $scope.confAppVmTemplates.data[rowIndex].templateId = selectTemplateId;
                                $scope.confAppVmTemplates.data[rowIndex].templateName = selectTemplateName;
                                _.each($scope.confAppVmTemplates.data[rowIndex].templateValues, function (item, index) {
                                    if (selectTemplateId && (selectTemplateId === item.selectId)) {
                                        item.checked = true;
                                    } else {
                                        item.checked = false;
                                    }
                                });
                            };
                            var templateIdSelNode = templateIdLink(templateIdScope);
                            $("td:eq(1)", nRow).html(templateIdSelNode);

                            var specsSel = "<div><tiny-select id='id' values='values' width='220' change='change(rowIndex)' default-selectid='defaultSpecId' validate='validate'></tiny-select></div>";
                            var specsSelLink = $compile(specsSel);
                            var specsSelScope = $scope.$new();
                            specsSelScope.id = "createApp-configApp-selectSpecs" + iDataIndex;
                            specsSelScope.rowIndex = iDataIndex;
                            if ((null === aData.spec) || (undefined === aData.spec)) {
                                specsSelScope.defaultSpecId = "";
                            } else {
                                specsSelScope.defaultSpecId = aData.spec;
                            }
                            specsSelScope.validate = "required:" + i18n.common_term_null_valid + ";";
                            specsSelScope.values = aData.specValues;
                            specsSelScope.change = function (rowIndex) {
                                var selectId = $("#createApp-configApp-selectSpecs" + iDataIndex).widget().getSelectedId();
                                if (!$scope.confAppVmTemplates.data[rowIndex]) {
                                    return;
                                }
                                $scope.confAppVmTemplates.data[rowIndex].spec = selectId;
                                var changedSpecDetail = null;
                                _.each($scope.confAppVmTemplates.data[rowIndex].specValues, function (item, index) {
                                    if (selectId && (selectId === item.selectId)) {
                                        item.checked = true;
                                        $scope.confAppVmTemplates.data[rowIndex].selSpecCpu = item.cpuCount;
                                        $scope.confAppVmTemplates.data[rowIndex].selSpecRam = item.memSize;
                                        $scope.confAppVmTemplates.data[rowIndex].selSpecDisk = item.disks;
                                        changedSpecDetail = item.detailSpec;
                                    } else {
                                        item.checked = false;
                                    }
                                });

                                //如果无选中的规格,则详情为空
                                if ((null === changedSpecDetail) || ("" === changedSpecDetail)) {
                                    changedSpecDetail = " ";
                                }
                                $scope.confAppVmTemplates.data[rowIndex].specDetail = changedSpecDetail;
                                //刷新表格
                                var newVmTemplatesData = [];
                                _.each($scope.confAppVmTemplates.data, function (item, index) {
                                    newVmTemplatesData.push(angular.copy(item));
                                });
                                $scope.confAppVmTemplates.data = newVmTemplatesData;
                            };
                            var specsSelNode = specsSelLink(specsSelScope);
                            $("td:eq(2)", nRow).html(specsSelNode);

                            var specDetailTd = "<div class='customTableDetailMargin'><a href='javascript:void(0)' ng-click='showSpecDetail()'>" + i18n.common_term_detail_label + "</a><div ng-show='showDetail' class='customTableDetailContent'>{{specDetail}}</div></div>";
                            var specDetailLink = $compile(specDetailTd);
                            specsSelScope.showDetail = aData.showDetail;
                            specsSelScope.specDetail = aData.specDetail;
                            specsSelScope.showSpecDetail = function () {
                                specsSelScope.showDetail = !specsSelScope.showDetail;
                                $scope.confAppVmTemplates.data[iDataIndex].showDetail = specsSelScope.showDetail;
                            };
                            var specDetailNode = specDetailLink(specsSelScope);
                            $("td:eq(3)", nRow).html(specDetailNode);
                        }
                    },

                    "softwarePacks": {
                        "id": "createApp-configApp-softwareTable",
                        "enablePagination": true,
                        "draggable": true,
                        "paginationStyle": "full_numbers",
                        "lengthMenu": [10, 20, 30],
                        "columns": [
                            {
                                "sTitle": i18n.common_term_vm_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.name);
                                }
                            },
                            {
                                "sTitle": i18n.template_term_software_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.softwareName);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_availableSelect_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.softwareId);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_setPara_label,
                                "bSortable": false,
                                "sWidth": "10%",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.opts);
                                }
                            }
                        ],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var softPackSel = "<div><tiny-select id='id' values='values' width='200' change='change(rowIndex)' default-selectid='defaultSoftId' validate='validate'></tiny-select></div>";
                            var softPackLink = $compile(softPackSel);
                            var softPackScope = $scope.$new();
                            softPackScope.id = "createApp-configApp-selectSoftPack" + iDataIndex;
                            if ((null === aData.softwareId) || (undefined === aData.softwareId)) {
                                softPackScope.defaultSoftId = "";
                            } else {
                                softPackScope.defaultSoftId = aData.softwareId;
                            }
                            softPackScope.rowIndex = iDataIndex;
                            softPackScope.validate = "required:" + i18n.common_term_null_valid + ";";
                            softPackScope.values = aData.softwareValues;
                            softPackScope.change = function (rowIndex) {
                                var selectId = $("#createApp-configApp-selectSoftPack" + iDataIndex).widget().getSelectedId();
                                if (!$scope.confAppSoftPacks.data[rowIndex]) {
                                    return;
                                }
                                $scope.confAppSoftPacks.data[rowIndex].softwareId = selectId;
                                $scope.confAppSoftPacks.data[rowIndex].softwareName = $("#createApp-configApp-selectSoftPack" + iDataIndex).widget().getSelectedLabel();
                                var selSoftData = getSelectSoftwareById(selectId, aData.softwareValues);
                                $scope.confAppSoftPacks.data[rowIndex].selVersion = selSoftData.version;
                                $scope.confAppSoftPacks.data[rowIndex].selFileType = selSoftData.fileType;
                                $scope.confAppSoftPacks.data[rowIndex].selDestinationPath = selSoftData.destinationPath;
                                resolveSoftwareParams(selSoftData);
                                $scope.confAppSoftPacks.data[rowIndex].softwareData = selSoftData;
                                var softPackTable = [];
                                _.each($scope.confAppSoftPacks.data, function (item, index) {
                                    softPackTable.push(item);
                                });
                                $scope.confAppSoftPacks.data = softPackTable;
                            };

                            var softPackNode = softPackLink(softPackScope);
                            $("td:eq(2)", nRow).html(softPackNode);

                            var optColumn = "<div><a href='javascript:void(0)' ng-click='popupConfig()' ng-show='softwareSelected'>" + i18n.common_term_setPara_label + "</a><div ng-show='!softwareSelected'>" + i18n.common_term_setPara_label + "</div></div>";
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.id = "createApp_configApp_configSoftware";
                            optScope.softwareSelected = ($scope.confAppSoftPacks.data[iDataIndex].softwareId !== null) && ($scope.confAppSoftPacks.data[iDataIndex].softwareId !== "");
                            optScope.popupConfig = function () {
                                //弹出前将除本列软件包外所有的依赖关系初始化,用于弹出交互页面的"依赖校验"
                                var softDependenceTable = [];
                                _.each($scope.confAppSoftPacks.data, function (item, index) {
                                    if (index !== iDataIndex) {
                                        softDependenceTable.push(item);
                                    }
                                });
                                appUtilService.init(softDependenceTable, $scope.confAppShells.data);
                                appUtilService.backup();
                                var showS = appUtilService.showDependence();

                                var selectId = $("#createApp-configApp-selectSoftPack" + iDataIndex).widget().getSelectedId();
                                var selSoftData = $scope.confAppSoftPacks.data[iDataIndex].softwareData;
                                selSoftData.vmTemplateAmeId = $scope.confAppSoftPacks.data[iDataIndex].vmTemplateAmeId;
                                selSoftData.vmNameMap = $scope.tmp.vmNameMap;
                                $scope.shareSoftId = selectId;
                                var options = {
                                    "winId": "createApp_configApp_configSoftwareWin",
                                    "selSoftData": selSoftData,
                                    "title": i18n.template_term_softwareCfg_label,
                                    "width": "900px",
                                    "height": "600px",
                                    "content-type": "url",
                                    "content": "app/business/application/views/appInstance/create/createAppConfigParam.html",
                                    "buttons": null
                                };
                                var win = new Window(options);
                                win.show();
                            };
                            var optNode = optLink(optScope);
                            $("td:eq(3)", nRow).html(optNode);
                        },
                        "callback": function (evtObj) {
                        }
                    },

                    "shells": {
                        "id": "createApp-configApp-shellTable",
                        "enablePagination": true,
                        "draggable": true,
                        "paginationStyle": "full_numbers",
                        "lengthMenu": [10, 20, 30],
                        "columns": [
                            {
                                "sTitle": i18n.common_term_vm_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.name);
                                }
                            },
                            {
                                "sTitle": i18n.template_term_script_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.shellName);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_availableSelect_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.shellId);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_setPara_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.config);
                                }
                            }
                        ],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var softPackSel = "<div><tiny-select id='id' values='values' width='200' change='change()' default-selectid='defaultShellId' validate='validate'></tiny-select></div>";
                            var softPackLink = $compile(softPackSel);
                            var softPackScope = $scope.$new();
                            softPackScope.id = "createApp-configApp-selectShell" + iDataIndex;
                            if ((null === aData.shellId) || (undefined === aData.shellId)) {
                                softPackScope.defaultShellId = "";
                            } else {
                                softPackScope.defaultShellId = aData.shellId;
                            }
                            softPackScope.validate = "required:" + i18n.common_term_null_valid + ";";
                            softPackScope.values = aData.shellValues;
                            softPackScope.change = function () {
                                var selectedId = $("#createApp-configApp-selectShell" + iDataIndex).widget().getSelectedId();
                                var shellName = $("#createApp-configApp-selectShell" + iDataIndex).widget().getSelectedLabel();
                                if (!$scope.confAppShells.data[iDataIndex]) {
                                    return;
                                }
                                $scope.confAppShells.data[iDataIndex].shellId = selectedId;
                                $scope.confAppShells.data[iDataIndex].shellName = shellName;
                                var selShellData = getSelectSoftwareById(selectedId, $scope.confAppShells.data[iDataIndex].shellValues);
                                $scope.confAppShells.data[iDataIndex].selVersion = selShellData.version;
                                $scope.confAppShells.data[iDataIndex].selFileType = "unknown";
                                $scope.confAppShells.data[iDataIndex].selDestinationPath = selShellData.destinationPath;
                                resolveShellParams(selShellData);
                                $scope.confAppShells.data[iDataIndex].shellData = selShellData;
                                var newSoftPacks = [];
                                _.each($scope.confAppShells.data, function (item, index) {
                                    newSoftPacks.push(item);
                                });
                                $scope.confAppShells.data = newSoftPacks;
                            };
                            var softPackNode = softPackLink(softPackScope);
                            $("td:eq(2)", nRow).html(softPackNode);

                            var operationConfig = "<div><a href='javascript:void(0)' ng-click='popupConfig()' ng-show='shellSelected'>" + i18n.common_term_setPara_label + "</a><div ng-show='!shellSelected'>" + i18n.common_term_setPara_label + "</div></div>";
                            var configLink = $compile($(operationConfig));
                            var configScope = $scope.$new();
                            configScope.id = "createApp_configApp_configShell";
                            configScope.shellSelected = ($scope.confAppShells.data[iDataIndex].shellId !== null) && ($scope.confAppShells.data[iDataIndex].shellId !== "");
                            configScope.popupConfig = function () {
                                //弹出前将除本列shell外所有的依赖关系初始化,用于弹出交互页面的"依赖校验"
                                var shellDependenceTable = [];
                                _.each($scope.confAppShells.data, function (item, index) {
                                    if (index !== iDataIndex) {
                                        shellDependenceTable.push(item);
                                    }
                                });
                                appUtilService.init($scope.confAppSoftPacks.data, shellDependenceTable);
                                appUtilService.backup();
                                var showSS = appUtilService.showDependence();

                                var selectId = $("#createApp-configApp-selectShell" + iDataIndex).widget().getSelectedId();
                                $scope.shareShellId = selectId;
                                var selShellData = $scope.confAppShells.data[iDataIndex].shellData;
                                selShellData.vmTemplateAmeId = $scope.confAppShells.data[iDataIndex].vmTemplateAmeId;
                                selShellData.vmNameMap = $scope.tmp.vmNameMap;
                                var options = {
                                    "winId": "createApp_configApp_configShellWin",
                                    "selShellData": selShellData,
                                    "title": i18n.template_term_scriptCfg_label,
                                    "width": "900px",
                                    "height": "600px",
                                    "content-type": "url",
                                    "content": "app/business/application/views/appInstance/create/createAppConfigShell.html",
                                    "buttons": null
                                };

                                var win = new Window(options);
                                win.show();
                            };
                            var configNode = configLink(configScope);
                            $("td:eq(3)", nRow).html(configNode);
                        }
                    },

                    "preBtn": {
                        "id": "createApp-configApp-preBtn",
                        "text": i18n.common_term_back_button,
                        "click": function () {
                            $scope.service.show = {
                                "chooseTemplate": false,
                                "basicInfo": false,
                                "chooseNetwork": true,
                                "configApp": false,
                                "confirmByTemplate": false
                            };
                            $("#createByTemplate-app-step").widget().pre();
                        }
                    },
                    "nextBtn": {
                        "id": "createApp-configApp-nextBtn",
                        "text": i18n.common_term_next_button,
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#createAppConfigApp"));
                            if (!valid) {
                                return;
                            }

                            if (!validateParamConfig(true)) {
                                return;
                            }
                            if (!validateParamConfig(false)) {
                                return;
                            }

                            //区分是FM还是OPENSTACK场景
                            if ($scope.params.resPoolFm) {
                                $scope.service.show = {
                                    "chooseTemplate": false,
                                    "basicInfo": false,
                                    "chooseNetwork": false,
                                    "configApp": false,
                                    "configVlb": true,
                                    "confirmByTemplate": false
                                };
                            } else {
                                $scope.service.show = {
                                    "chooseTemplate": false,
                                    "basicInfo": false,
                                    "chooseNetwork": false,
                                    "configApp": false,
                                    "configVlb": false,
                                    "confirmByTemplate": true
                                };
                            }

                            refreshAppConfigData();

                            $("#createByTemplate-app-step").widget().next();
                        }
                    },
                    "cancelBtn": {
                        "id": "createApp-configApp-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.commonCancel();
                        }
                    }
                };

                //刷新$scope.tmp.ameIdResourceMap中的confAppVmTemplates.data/confAppSoftPacks.data/confAppShells.data(注:解析时放进去,但表格更改的只是拷贝,需要把更改后的刷过去)
                function refreshAppConfigData() {
                    var tmpAmeId;
                    if ($scope.confAppVmTemplates.data.length > 0) {
                        _.each($scope.confAppVmTemplates.data, function (item, index) {
                            tmpAmeId = item.ameId;
                            $scope.tmp.ameIdResourceMap[tmpAmeId] = item;
                        });
                    }
                    if ($scope.confAppSoftPacks.data.length > 0) {
                        _.each($scope.confAppSoftPacks.data, function (item, index) {
                            tmpAmeId = item.ameId;
                            $scope.tmp.ameIdResourceMap[tmpAmeId] = item;
                        });
                    }
                    if ($scope.confAppShells.data.length > 0) {
                        _.each($scope.confAppShells.data, function (item, index) {
                            tmpAmeId = item.ameId;
                            $scope.tmp.ameIdResourceMap[tmpAmeId] = item;
                        });
                    }
                }

                //查询可用模板,默认选中的模板对应的规格  备注:切记要进行深拷贝
                function queryAvailableVmTemplate() {
                    var vmTable = $scope.confAppVmTemplates.data;
                    if (vmTable.length <= 0) {
                        return false;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "azid": $scope.params.azid,
                        "status": "FINISHED",
                        "start": 0
                    };
                    var deferred = appCommonServiceIns.queryAvailableVmTemplate(options);
                    deferred.then(function (data) {
                        if (!data || (data.vmtemplates.length <= 0)) {
                            return false;
                        }

                        var newVmTemplates = [];
                        _.each($scope.confAppVmTemplates.data, function (item, index) {
                            item.templateValues = filterVmTemplatesByCondition(data.vmtemplates, item);
                            if (!item.templateId) {
                                item.templateId = (item.templateValues.length > 0 ? item.templateValues[0].selectId : null);
                                item.templateName = (item.templateValues.length > 0 ? item.templateValues[0].label : null);
                            }
                            newVmTemplates.push(angular.copy(item));
                        });
                        $scope.confAppVmTemplates.data = newVmTemplates;
                    });
                }

                function filterVmTemplatesByCondition(allVmTemplates, confAppVmTemplates) {
                    var filterVmTemplates = [];
                    var vmTemplateName = confAppVmTemplates.vmTemplateName;
                    var vmOsType = confAppVmTemplates.vmOsType;
                    var vmOsVersion = confAppVmTemplates.vmOsVersion;
                    var tmpVmTemplates = null;
                    _.each(allVmTemplates, function (item, index) {
                        if (compareByOsAndName(item.vmtName, item.osType, item.osVersion, vmTemplateName, vmOsType, vmOsVersion)) {
                            tmpVmTemplates = {};
                            tmpVmTemplates.selectId = item.vmtId;
                            tmpVmTemplates.label = item.vmtName;
                            filterVmTemplates.push(tmpVmTemplates);
                        }
                    });
                    return filterVmTemplates;
                }

                //根据osType过滤查询模板  名称等暂不实现
                function compareByOsAndName(name, osType, osVersion, otherName, otherOsType, otherOsVersion) {
                    if (!osType || !otherOsType || !$scope.tmp.osTypeMap[otherOsType]) {
                        return false;
                    }

                    var lowerOsType = osType.toLowerCase();
                    var lowerOtherOsType = $scope.tmp.osTypeMap[otherOsType].toLowerCase();
                    if (lowerOsType !== lowerOtherOsType) {
                        return false;
                    }

                    return true;
                }

                function queryAvailableSpecs() {
                    var vmTable = $scope.confAppVmTemplates.data;
                    if (!vmTable || (vmTable.length <= 0)) {
                        return false;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "start": 0
                    };
                    var deferred = appCommonServiceIns.queryVmFlavors(options);
                    deferred.then(function (data) {
                        if (!data || (data.vmFlavors.length <= 0)) {
                            return false;
                        }
                        var availableFlavors = [];
                        var tmpFlavor = null;
                        var tmpSpecArray = null;
                        _.each(data.vmFlavors, function (item, index) {
                            tmpFlavor = {};
                            tmpFlavor.selectId = item.flavorId;
                            tmpSpecArray = appCommonServiceIns.generateSpec(item);
                            tmpFlavor.label = item.name + "(" + tmpSpecArray.overviewSpec +")";
                            tmpFlavor.detailSpec = tmpSpecArray.detailSpec;
                            tmpFlavor.cpuCount = item.cpuCount;
                            tmpFlavor.memSize = item.memSize;
                            tmpFlavor.disks = item.disks;
                            availableFlavors.push(tmpFlavor);
                        });

                        var newTemplateTable = [];
                        var tmpAvailableSpecs = null;
                        var tmpSpecDetail = null;
                        _.each(vmTable, function (item, index) {
                            tmpAvailableSpecs = angular.copy(availableFlavors);
                            item.specValues = tmpAvailableSpecs;
                            //初始时默认选中第一个,并且详情对应第一个
                            if (!item.spec && (tmpAvailableSpecs.length > 0)) {
                                item.spec = tmpAvailableSpecs[0].selectId;
                                item.specDetail = tmpAvailableSpecs[0].detailSpec;
                                item.selSpecCpu = tmpAvailableSpecs[0].cpuCount;
                                item.selSpecRam = tmpAvailableSpecs[0].memSize;
                                item.selSpecDisk = tmpAvailableSpecs[0].disks;
                            }
                            newTemplateTable.push(angular.copy(item));
                        });
                        $scope.confAppVmTemplates.data = newTemplateTable;
                    });
                }

                function resolveSoftwareParams(selSoftData) {
                    if (!selSoftData) {
                        return;
                    }
                    var tmpArray;
                    tmpArray = matchParams2Array(selSoftData.installCommand);
                    if (!tmpArray || (tmpArray.length <= 0)) {
                        selSoftData.installParams = null;
                    } else {
                        selSoftData.installParams = tmpArray;
                    }
                    tmpArray = matchParams2Array(selSoftData.unInstallCommand);
                    if (!tmpArray || (tmpArray.length <= 0)) {
                        selSoftData.unInstallParams = null;
                    } else {
                        selSoftData.unInstallParams = tmpArray;
                    }
                    tmpArray = matchParams2Array(selSoftData.startCommand);
                    if (!tmpArray || (tmpArray.length <= 0)) {
                        selSoftData.startParams = null;
                    } else {
                        selSoftData.startParams = tmpArray;
                    }
                    tmpArray = matchParams2Array(selSoftData.stopCommand);
                    if (!tmpArray || (tmpArray.length <= 0)) {
                        selSoftData.stopParams = null;
                    } else {
                        selSoftData.stopParams = tmpArray;
                    }
                }

                function resolveShellParams(selShellData) {
                    if (!selShellData) {
                        return;
                    }
                    var tmpArray;
                    tmpArray = matchParams2Array(selShellData.installCommand);
                    if (!tmpArray || (tmpArray.length <= 0)) {
                        selShellData.installParams = null;
                    } else {
                        selShellData.installParams = tmpArray;
                    }
                }

                function getSelectSoftwareById(selectId, softwareValues) {
                    if (!selectId || (softwareValues.length <= 0)) {
                        return null;
                    }
                    for (var i = 0; i < softwareValues.length; i++) {
                        if (selectId === softwareValues[i].selectId) {
                            return softwareValues[i];
                        }
                    }
                    return null;
                }

                function queryAvailableSoftPacks() {
                    var softPacks = $scope.confAppSoftPacks.data;
                    if (!softPacks || (softPacks.length <= 0)) {
                        return false;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "start": 0
                    };
                    var deferred = appCommonServiceIns.queryAvailableSoftPacks(options);
                    deferred.then(function (data) {
                        if (!data || (data.softwareInfos.length <= 0)) {
                            return false;
                        }
                        var tmpAvailableSofts = null;
                        var softpackTable = [];
                        _.each(softPacks, function (item, index) {
                            item.softwareValues = filterSoftwaresByCondition(data.softwareInfos, item, true);
                            softpackTable.push(angular.copy(item));
                        });
                        $scope.confAppSoftPacks.data = softpackTable;
                    });
                }

                //根据条件过滤软件/脚本 isSoftware表示过滤软件包
                function filterSoftwaresByCondition(allSoftwares, curSoftPack, isSoftware) {
                    var name;
                    if (isSoftware) {
                        name = curSoftPack.oriSoftwareName;
                    } else {
                        name = curSoftPack.oriShellName;
                    }
                    var osType = curSoftPack.osType;
                    var version = curSoftPack.version;
                    var filterSoftwares = [];
                    var tmpAvailabeSoft = null;
                    _.each(allSoftwares, function (item, index) {
                        if (compareByOsAndName(item.name, item.osType, item.version, name, osType, version)) {
                            tmpAvailabeSoft = {};
                            tmpAvailabeSoft.selectId = item.id;
                            tmpAvailabeSoft.label = item.name;
                            tmpAvailabeSoft.installCommand = $.base64.decode(item.installCommand || "", true);
                            tmpAvailabeSoft.unInstallCommand = isSoftware ? $.base64.decode(item.unInstallCommand || "", true) : item.unInstallCommand;
                            tmpAvailabeSoft.startCommand = isSoftware ? $.base64.decode(item.startCommand || "", true) : item.startCommand;
                            tmpAvailabeSoft.stopCommand = isSoftware ? $.base64.decode(item.stopCommand || "", true) : item.stopCommand;
                            tmpAvailabeSoft.version = item.version;
                            tmpAvailabeSoft.fileType = item.fileType;
                            tmpAvailabeSoft.destinationPath = item.destinationPath;
                            tmpAvailabeSoft.osType = item.osType;
                            filterSoftwares.push(tmpAvailabeSoft);
                        }
                    });
                    return filterSoftwares;
                }

                //解析命令,"sh install ${python_ljbP}"
                function matchParams2Array(str) {
                    if (!str) {
                        return null;
                    }
                    var patt = /\{[^{}]+\}/g;
                    var resultSet = str.match(patt);
                    if (!resultSet || (resultSet.length <= 0)) {
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

                function validateParamConfig(isSoftware) {
                    if (isSoftware) {
                        var tmpSoftData = null;
                        for (var i = 0; i < $scope.confAppSoftPacks.data.length; i++) {
                            tmpSoftData = $scope.confAppSoftPacks.data[i].softwareData;
                            if (!tmpSoftData) {
                                messageService.errorMsgBox(i18n.app_app_create_info_softNoCfg_msg, i18n.app_app_create_info_softNoCfg_msg);
                                return false;
                            }
                            if (!isParamSet(tmpSoftData.installParams)) {
                                messageService.errorMsgBox(i18n.app_app_create_info_softNoCfg_msg, i18n.app_app_create_info_softNoCfg_msg);
                                return false;
                            }
                            if (!isParamSet(tmpSoftData.unInstallParams)) {
                                messageService.errorMsgBox(i18n.app_app_create_info_softNoCfg_msg, i18n.app_app_create_info_softNoCfg_msg);
                                return false;
                            }
                            if (!isParamSet(tmpSoftData.startParams)) {
                                messageService.errorMsgBox(i18n.app_app_create_info_softNoCfg_msg, i18n.app_app_create_info_softNoCfg_msg);
                                return false;
                            }
                            if (!isParamSet(tmpSoftData.stopParams)) {
                                messageService.errorMsgBox(i18n.app_app_create_info_softNoCfg_msg, i18n.app_app_create_info_softNoCfg_msg);
                                return false;
                            }
                        }
                        return true;
                    }

                    var tmpShellData = null;
                    for (var k = 0; k < $scope.confAppShells.data.length; k++) {
                        tmpShellData = $scope.confAppShells.data[k].shellData;
                        if (!tmpShellData) {
                            messageService.errorMsgBox(i18n.app_app_create_info_ScriptNoCfg_msg, i18n.app_app_create_info_ScriptNoCfg_msg);
                            return false;
                        }
                        if (!isParamSet(tmpShellData.installParams)) {
                            messageService.errorMsgBox(i18n.app_app_create_info_ScriptNoCfg_msg, i18n.app_app_create_info_ScriptNoCfg_msg);
                            return false;
                        }
                    }
                    return true;
                }

                function isParamSet(params) {
                    if (!params) {
                        return true;
                    }
                    for (var i = 0; i < params.length; i++) {
                        if (!params[i]) {
                            return false;
                        }
                        if (!params[i].value || ("" === params[i].value)) {
                            return false;
                        }
                    }
                    return true;
                }

                function queryAvailableShell(pageInfo) {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "start": 0
                    };
                    var deferred = appCommonServiceIns.queryAvailableShell(options);
                    deferred.then(function (data) {
                        if (!data || (data.scriptInfos.length <= 0)) {
                            return;
                        }
                        var newShellTable = [];
                        var shells = $scope.confAppShells.data;
                        var copyShellSelects = null;
                        _.each(shells, function (item, index) {
                            copyShellSelects = filterSoftwaresByCondition(data.scriptInfos, item, false);
                            item.shellValues = copyShellSelects;
                            newShellTable.push(angular.copy(item));
                        });
                        $scope.confAppShells.data = newShellTable;
                    });
                }

                function queryOsTypeMapping() {
                    var params = {
                        "user": user
                    };
                    var deferred = appCommonServiceIns.queryOsTypeMappings(params);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.tmp.osTypeMap = data.mapping || {};
                        queryAvailableVmTemplate();
                        queryAvailableSpecs();
                        queryAvailableSoftPacks();
                        queryAvailableShell();
                    });
                }

                queryOsTypeMapping();
            }
        ];
        return ctrl;
    });
