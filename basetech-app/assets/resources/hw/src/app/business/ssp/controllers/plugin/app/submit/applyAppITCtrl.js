/* global define */
define(["sprintf",
    "language/keyID",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/services/messageService',
    "app/services/tipMessageService",
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/capacityService',
    "app/services/cloudInfraService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/plugin/commonService",
    "app/business/ssp/services/plugin/app/appCommonService",
    'app/services/commonService',
    'app/business/network/services/networkService',
    "app/business/ssp/services/plugin/app/desigerService",
    "app/business/ssp/controllers/plugin/app/constants",
    'bootstrap/bootstrap.min',
    'tiny-directives/RadioGroup',
    "fixtures/appFixture"
], function (sprintf,keyIDI18n, $, angular, _,Window, UnifyValid, http, messageService, tipMessageService,validatorService, exceptionService, capacityService, cloudInfraService, catalogService, orderService, commonService,appCommonService, timeCommonService,networkService,desigerService,constants) {
    "use strict";

    var ctrl = ["$scope","$compile", "$state", "$stateParams","appUtilService", "$q", "camel", "exception",
        function ($scope,$compile, $state, $stateParams,appUtilService, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            var user = $scope.user;
            var serviceId = $stateParams.serviceId;
            var orderId = $stateParams.orderId;
            var action = $stateParams.action;

            var validator = new validatorService();
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var orderServiceIns = new orderService(exception, $q, camel);
            var commonServiceIns = new commonService(exception);
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var networkServiceIns = new networkService(exception, $q, camel);
            var messageServiceIns = new messageService();
            var desigerServiceIns = new desigerService(exception, $q, camel);
            var tipMessage = new tipMessageService();

            var networkFlag = false;
            var appFlag = false;
            var vlbFlag = false;

            var networkClose = true;
            var appClose = true;
            var vlbClose = true;

            //应用名称+后缀
            $scope.appTempName = "_" + user.name;

            // 服务详情
            $scope.detail = {};
            // 订单详情
            $scope.orderDetail = {};
            $scope.cloudInfra = {};
            $scope.vpcId = "";
            $scope.supportUserDefineConfig = false;
            $scope.azId = "";

                //选择模板
            $scope.serviceTemplateTable = {
                "data": []
            };

            //选择模板网络 网络列表数据
            $scope.templateNet = {
                "data": []
            };

            $scope.commonParams = {
                "data": []
            };

            //配置应用参数 网络列表数据
            $scope.confAppVmTemplates = {
                "data": []
            };

            //配置应用参数 网络列表数据
            $scope.confAppSoftPacks = {
                "data": []
            };

            //配置应用参数 shell数据
            $scope.confAppShells = {
                "data": []
            };

            //配置VLB  网络的ameId与网络实例的对应关系
            $scope.configVlbNetworkMap = {};
            $scope.confVlbVmTemplates = {
                "data": []
            };

            //配置软件等需要用到的临时数据,从模板中解析而来
            $scope.tmp = {
                "vmNameMap": {},
                "vmNicsMap": {},
                "vmTempInstanceMap": {}, //虚拟机模板的ameId与伸缩组里/外的虚拟机的映射
                "ameIdResourceMap": {}, //模板体中,ameId与所有资源的映射
                "ameIdVlbNetMap": {}, //vmTemplateId与vlbNet的映射
                "osTypeMap": {}
            };

            $scope.params = {
                "fromFlag": 0,
                "appTempBody": null,
                "selServiceTemplate": null,
                "serviceTemplate": {},
                "cloudInfraId": null,
                "selVpcId": null,
                "selVpcName": null,
                "resPoolFm": true,
                "appName": null,
                "curLogo": "buff01.jpg",
                "description": "",
                "logo": "",
                "networks": [],
                "commonParams": [],
                "templates": [],
                "softwares": [],
                "shells": [],
                "appData" : null
            };

            // 基本信息
            $scope.base = {
                name: {
                    "label": i18n.common_term_name_label + ":",
                    "require": true,
                    "width": "220",
                    "value": "",
                    "id": "serviceApplyAppName",
                    "validate": "regularCheck(" + validator.vmNameReg + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                },

                "location": {
                    label: i18n.common_term_section_label + ":",
                    require: true,
                    "id": "applyApp-chooseLocation",
                    "width": 180,
                    'validate': 'required:' + i18n.common_term_null_valid,
                    "change": function () {
                        $("#" + $scope.base.vpc.id).widget().opChecked();
                        var resPoolId = $("#" + $scope.base.location.id).widget().getSelectedId();
                        if (!resPoolId) {
                            return;
                        }
                        if (appClose === true) {
                            appFlag = false;
                        } else {
                            $scope.operate.queryOsTypeMapping();
                        }
                        getVPCList(resPoolId, true);
                    },
                    "values": [],
                    "disable": "false"
                },

                "vpc": {
                    label: "VPC:",
                    require: true,
                    "id": "applyApp-chooseVpc",
                    "width": 180,
                    'validate': 'required:' + i18n.common_term_null_valid,
                    "values": [],
                    "disable": false,
                    "change" : function() {
                        var vpcId = $("#" + $scope.base.vpc.id).widget().getSelectedId();
                        if (!vpcId) {
                            return;
                        }
                        if (networkClose === true) {
                            networkFlag = false;
                        } else{
                            $scope.operate.queryAvailableNetworkByVpcId(vpcId);
                        }
                        //根据vpcId查询vpc,得到azId
                        var deferred = getAzIdByVpcId(vpcId);
                        $.when(deferred).done(function () {
                            $scope.operate.queryAvailableVmTemplate();
                        });
                        _.each($scope.confVlbVmTemplates.data, function(item, index){
                            $scope.confVlbVmTemplates.data[index].associateVlbId = "";
                            $scope.confVlbVmTemplates.data[index].associateVlb = "";
                        });
                        rebuildVlbTable(false);
                    }
                },

                // 到期时间
                expireTime: {
                    "label": i18n.common_term_overdueTime_label + ":",
                    "id": "serviceApplyAppExpireTime",
                    "width": "178",
                    "require": true,
                    "disable": false,
                    "type": "datetime",
                    "minDate": commonServiceIns.getCurrentTime(),
                    "defaultDate": commonServiceIns.get30DaysDate(),
                    "dateFormat": "yy-mm-dd",
                    "timeFormat": "hh:mm:ss"
                },

                neverExpire: {
                    "id": "serviceApplyAppNeverExpire",
                    "checked": false,
                    "text": i18n.common_term_neverExpires_label,
                    "change": function () {
                        $scope.base.expireTime.disable = $("#" + $scope.base.neverExpire.id).widget().option("checked");
                    }
                }
            };

            $scope.network = {
                "vpcs": null,
                "networkTable": {
                    "id": "apply-app-NetworkTable",
                    "enablePagination": false,
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
                        "sTitle": i18n.vpc_term_netName_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.networkId);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var networkSel = "<div><tiny-select id='id' values='values' width='150' change='change(rowIndex)' default-selectid='defaultNetworkId' validate='validate'></tiny-select></div>";
                        var networkLink = $compile(networkSel);
                        var networkScope = $scope.$new();
                        networkScope.id = "applyAppChooseNetworkNet" + iDataIndex;
                        networkScope.rowIndex = iDataIndex;
                        networkScope.defaultNetworkId = aData.networkId;
                        networkScope.values = aData.networkValues;
                        networkScope.validate = "required:" + i18n.common_term_null_valid;
                        networkScope.change = function (rowIndex) {
                            var selectNetworkId = $("#applyAppChooseNetworkNet" + iDataIndex).widget().getSelectedId();
                            if (!$scope.templateNet.data[rowIndex]) {
                                return;
                            }
                            $scope.templateNet.data[rowIndex].networkId = selectNetworkId;
                            $scope.templateNet.data[rowIndex].networkName = $("#applyAppChooseNetworkNet" + iDataIndex).widget().getSelectedLabel();
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
                "commonParams": {
                    "id": "apply-app-commonParams",
                    "enablePagination": false,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": i18n.common_term_paraName_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_paraValue_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.value);
                        }
                    }, {
                        "sTitle": i18n.common_term_paraDesc_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var paramInputBox = "<div><tiny-textbox id='id' value='value' validate='validate' change='change()'></tiny-textbox></div>";
                        var paramInputLink = $compile(paramInputBox);
                        var paramInputScope = $scope.$new();
                        paramInputScope.id = "applyAppInputCommonParams" + iDataIndex;
                        paramInputScope.value = aData.value;
                        paramInputScope.validate = "required:" + i18n.common_term_null_valid;
                        paramInputScope.change = function () {
                            if ($scope.commonParams.data[iDataIndex]) {
                                $scope.commonParams.data[iDataIndex].value = $("#applyAppInputCommonParams" + iDataIndex).widget().getValue();
                            }
                        };
                        var paramInputNode = paramInputLink(paramInputScope);
                        $("td:eq(1)", nRow).html(paramInputNode);
                    }
                },
                "saveBtn": {
                    "id": "applyApp-chooseNetwork-nextBtn",
                    "text": i18n.common_term_save_label,
                    "click": saveNetwork
                }
            };

            $scope.configApp = {
                "vmTable": {
                    "id": "applyApp-configApp-vmTable",
                    "enablePagination": false,
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
                        "sTitle": i18n.template_term_vmName_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.templateId);
                        }
                    }, {
                        "sTitle": i18n.spec_term_vm_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.spec);
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
                        var templateIdSel = "<div><tiny-select id='id' values='values' width='150' change='change(rowIndex)' default-selectid='defaultTemplateId' validate='validate'></tiny-select></div>";
                        var templateIdLink = $compile(templateIdSel);
                        var templateIdScope = $scope.$new();
                        templateIdScope.id = "applyApp-configApp-selectTemplate" + iDataIndex;
                        templateIdScope.rowIndex = iDataIndex;
                        templateIdScope.defaultTemplateId = aData.templateId;
                        templateIdScope.validate = "required:" + i18n.common_term_null_valid;
                        templateIdScope.values = aData.templateValues;
                        templateIdScope.change = function (rowIndex) {
                            var selectTemplateId = $("#applyApp-configApp-selectTemplate" + rowIndex).widget().getSelectedId();
                            var selectTemplateName = $("#applyApp-configApp-selectTemplate" + rowIndex).widget().getSelectedLabel();
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

                        var specsSel = "<div><tiny-select id='id' values='values' width='150' change='change(rowIndex)' default-selectid='defaultSpecId' validate='validate'></tiny-select></div>";
                        var specsSelLink = $compile(specsSel);
                        var specsSelScope = $scope.$new();
                        specsSelScope.id = "applyApp-configApp-selectSpecs" + iDataIndex;
                        specsSelScope.rowIndex = iDataIndex;
                        specsSelScope.defaultSpecId = aData.spec;
                        specsSelScope.validate = "required:" + i18n.common_term_null_valid;
                        specsSelScope.values = aData.specValues;
                        specsSelScope.change = function (rowIndex) {
                            var selectId = $("#applyApp-configApp-selectSpecs" + iDataIndex).widget().getSelectedId();
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
                            var newVmTemplatesData = [];
                            _.each($scope.confAppVmTemplates.data, function (item, index) {
                                newVmTemplatesData.push(item);
                            });
                            $scope.confAppVmTemplates.data = newVmTemplatesData;
                        };
                        var specsSelNode = specsSelLink(specsSelScope);
                        $("td:eq(2)", nRow).html(specsSelNode);

                        var specDetailTd = "<div class='customTableDetailMargin'><a href='javascript:void(0)' ng-click='showSpecDetail()'>" + i18n.common_term_detail_label + "</a><div ng-show='showDetail' title='{{specDetail}}' class='customTableDetailContent'>{{specDetail}}</div></div>";
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
                    "id": "applyApp-configApp-softwareTable",
                    "enablePagination": false,
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
                    }, {
                        "sTitle": i18n.common_term_setPara_label,
                        "bSortable": false,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.opts);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var softPackSel = "<div><tiny-select id='id' values='values' width='200' change='change(rowIndex)' default-selectid='defaultSoftId' validate='validate'></tiny-select></div>";
                        var softPackLink = $compile(softPackSel);
                        var softPackScope = $scope.$new();
                        softPackScope.id = "applyApp-configApp-selectSoftPack" + iDataIndex;
                        softPackScope.defaultSoftId = aData.softwareId;
                        softPackScope.rowIndex = iDataIndex;
                        softPackScope.validate = "required:" + i18n.common_term_null_valid;
                        softPackScope.values = aData.softwareValues;
                        softPackScope.change = function (rowIndex) {
                            var selectId = $("#applyApp-configApp-selectSoftPack" + iDataIndex).widget().getSelectedId();
                            if (!$scope.confAppSoftPacks.data[rowIndex]) {
                                return;
                            }
                            $scope.confAppSoftPacks.data[rowIndex].softwareId = selectId;
                            $scope.confAppSoftPacks.data[rowIndex].softwareName = $("#applyApp-configApp-selectSoftPack" + iDataIndex).widget().getSelectedLabel();
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
                        optScope.id = "applyApp_configApp_configSoftware";
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

                            var selectId = $("#applyApp-configApp-selectSoftPack" + iDataIndex).widget().getSelectedId();
                            var selSoftData = $scope.confAppSoftPacks.data[iDataIndex].softwareData;
                            selSoftData.vmTemplateAmeId = $scope.confAppSoftPacks.data[iDataIndex].vmTemplateAmeId;
                            selSoftData.vmNameMap = $scope.tmp.vmNameMap;
                            $scope.shareSoftId = selectId;
                            var options = {
                                "winId": "applyApp_configApp_configSoftwareWin",
                                "selSoftData": selSoftData,
                                "title": i18n.template_term_softwareCfg_label,
                                "width": "900px",
                                "height": "600px",
                                "content-type": "url",
                                "content": "app/business/ssp/views/plugin/app/submit/applyAppConfigParam.html",
                                "buttons": null
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).html(optNode);
                    },
                    "callback": function (evtObj) {}
                },

                "shells": {
                    "id": "applyApp-configApp-shellTable",
                    "enablePagination": false,
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
                    }, {
                        "sTitle": i18n.common_term_setPara_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.config);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var softPackSel = "<div><tiny-select id='id' values='values' width='200' change='change()' default-selectid='defaultShellId' validate='validate'></tiny-select></div>";
                        var softPackLink = $compile(softPackSel);
                        var softPackScope = $scope.$new();
                        softPackScope.id = "applyApp-configApp-selectShell" + iDataIndex;
                        if ((null === aData.shellId) || (undefined === aData.shellId)) {
                            softPackScope.defaultShellId = "";
                        } else {
                            softPackScope.defaultShellId = aData.shellId;
                        }
                        softPackScope.validate = "required:" + i18n.common_term_null_valid;
                        softPackScope.values = aData.shellValues;
                        softPackScope.change = function () {
                            var selectedId = $("#applyApp-configApp-selectShell" + iDataIndex).widget().getSelectedId();
                            var shellName = $("#applyApp-configApp-selectShell" + iDataIndex).widget().getSelectedLabel();
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
                        configScope.id = "applyApp_configApp_configShell";
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

                            var selectId = $("#applyApp-configApp-selectShell" + iDataIndex).widget().getSelectedId();
                            $scope.shareShellId = selectId;
                            var selShellData = $scope.confAppShells.data[iDataIndex].shellData;
                            selShellData.vmTemplateAmeId = $scope.confAppShells.data[iDataIndex].vmTemplateAmeId;
                            selShellData.vmNameMap = $scope.tmp.vmNameMap;
                            var options = {
                                "winId": "applyApp_configApp_configShellWin",
                                "selShellData": selShellData,
                                "title": i18n.template_term_scriptCfg_label,
                                "width": "900px",
                                "height": "600px",
                                "content-type": "url",
                                "content": "app/business/ssp/views/plugin/app/submit/applyAppConfigShell.html",
                                "buttons": null
                            };

                            var win = new Window(options);
                            win.show();
                        };
                        var configNode = configLink(configScope);
                        $("td:eq(3)", nRow).html(configNode);
                    }
                },
                "saveBtn": {
                    "id": "applyApp-configApp-nextBtn",
                    "text": i18n.common_term_save_label,
                    "click": saveConfigApp
                }
            };

            $scope.templateTable4Vlb = {
                "id": "apply-app-templateTable4Vlb",
                "enablePagination": false,
                "draggable": true,
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "columns": [{
                    "sTitle": i18n.template_term_vm_label,
                    "sWidth": "20px",
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
                    "sWidth": "20%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.associateVlb);
                    }
                }, {
                    "sTitle": i18n.common_term_operation_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": "opt"
                }],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    var associateVlbBox = "<div><tiny-textbox id='id' value='value' validate='validate' readonly='true'></tiny-textbox></div>";
                    var associateLink = $compile(associateVlbBox);
                    var associateScope = $scope.$new();
                    associateScope.id = "applyAppChooseVlbBox" + iDataIndex;
                    associateScope.value = aData.associateVlb;
                    associateScope.validate = "required:" + i18n.common_term_null_valid;
                    var associateNode = associateLink(associateScope);
                    $("td:eq(3)", nRow).html(associateNode);

                    var vlbBtn = "<div><tiny-button id='id' text='text' click='click(vmTemplateId)' disabled=''></tiny-button></div>";
                    var vlbLink = $compile(vlbBtn);
                    var vlbScope = $scope.$new();
                    vlbScope.id = "applyAppChooseVlbBtn" + iDataIndex;
                    vlbScope.text = i18n.common_term_choose_label;
                    vlbScope.vmTemplateId = aData.templateId;
                    vlbScope.click = function (vmTemplateId) {
                        var cloudInfraId = $scope.detail.param.lock.locationLock === '1' ? $("#" + $scope.base.location.id).widget().getSelectedId()  : $scope.params.cloudInfraId;
                        if (cloudInfraId === null || cloudInfraId === "" || cloudInfraId === undefined) {
                            return;
                        }
                        var vpcId = $scope.detail.param.lock.vpcLock === '1' ? $("#applyApp-chooseVpc").widget().getSelectedId() : $scope.params.selVpcId;
                        var options = {
                            "winId": "applyAppChooseVlbSel1",
                            "selVlbData": $scope.confVlbVmTemplates.data[iDataIndex],
                            "vpcId": vpcId,
                            "cloudInfraId": cloudInfraId,
                            "title": i18n.app_term_chooseVLB_label,
                            "width": "520px",
                            "height": "400px",
                            "modal": true,
                            "content-type": "url",
                            "content": "app/business/ssp/views/plugin/app/submit/chooseVlb.html",
                            "buttons": null,
                            "close": function (event) {
                                rebuildVlbTable(true);
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    };
                    var vlbNode = vlbLink(vlbScope);
                    $("td:eq(4)", nRow).html(vlbNode);
                },
                "saveBtn" : {
                    "id": "applyApp-vlbConfig-nextBtn",
                    "text": i18n.common_term_save_label,
                    "click": saveVlbConfig
                }
            };

            // 备注
            $scope.remark = {
                "label": i18n.common_term_remark_label + ":",
                "id": "sspApplyAppRemark",
                "value": "",
                "type": "multi",
                "width": "220",
                "height": "57",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            };

            $scope.okBtn = {
                "id": "serviceApplyAppOkBtn",
                "text": i18n.common_term_submit_button,
                "tooltip": "",
                "click": function () {
                    // 校验
                    if (!$scope.okBtn.valid()) {
                        return;
                    }
                    if (action === "apply") {
                        $scope.operate.applyApp();
                    } else {
                        $scope.operate.editApp();
                    }

                },
                "valid": function () {
                    var valid = UnifyValid.FormValid($("#applyApp"));
                    if (!valid) {
                        return false;
                    }
                    if (!networkFlag && ($scope.detail.param.lock.networkLock === "1" || $scope.detail.param.lock.commonParamsLock === "1") && ($scope.commonParams.data.length > 0 || $scope.templateNet.data.length > 0)) {
                        tipMessage.alert("error", i18n.service_term_chooseNet_msg);
                        return false;
                    }

                    if (!appFlag && ($scope.detail.param.lock.appLock === "1" || $scope.detail.param.lock.vmLock === "1") && ($scope.confAppVmTemplates.data.length > 0 || $scope.confAppSoftPacks.data.length > 0 || $scope.confAppShells.data.length > 0)) {
                        tipMessage.alert("error", i18n.service_service_addApp_para_app_valid);
                        return false;
                    }

                    if (!vlbFlag && $scope.detail.param.lock.vlbLock === "1" && $scope.confVlbVmTemplates.data.length > 0) {
                        tipMessage.alert("error", i18n.service_service_addApp_para_vlb_valid);
                        return false;
                    }

                    if (!saveNetwork()) {
                        return false;
                    }
                    if (!saveConfigApp()) {
                        return false;
                    }
                    if (!saveVlbConfig()) {
                        return false;
                    }
                    return true;
                }
            };
            $scope.cancelBtn = {
                "id": "serviceApplyEcsCancelBtn",
                "text": i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    setTimeout(function () {
                        window.history.go(-2);
                    }, 0);
                }
            };

            $scope.clickAreaHeading = function (id) {
                var head = $("#" + id + " .s-heading");
                var content = $("#" + id + " .s-content");

                if (head.hasClass("collapse")) {
                    if (id === 'sspApplyAppNetworkArea'){
                        if(!saveNetwork()) {
                            return;
                        }
                        networkClose = true;
                    } else if (id === 'sspApplyAppConfigApp') {
                        if(!saveConfigApp()) {
                            return;
                        }
                        appClose = true;
                    } else if (id === 'sspApplyAppConfigVlb') {
                        if (!saveVlbConfig()) {
                            return;
                        }
                        vlbClose = true;
                    }

                    head.removeClass("collapse");
                    head.addClass("expand");
                    content.css("display", "none");
                } else {
                    if (id === 'sspApplyAppNetworkArea') {
                        $scope.operate.queryAvailableNetworkByVpcId();
                        networkFlag = true;
                        networkClose = false;
                    }
                    else if (id === 'sspApplyAppConfigApp') {
                        $scope.operate.queryOsTypeMapping();
                        appFlag = true;
                        appClose = false;
                    }
                    else if (id === 'sspApplyAppConfigVlb') {
                        $scope.operate.initVlbNetworks();
                        vlbFlag = true;
                        vlbClose = false;
                    }

                    head.removeClass("expand");
                    head.addClass("collapse");
                    content.css("display", "block");
                }
            };

            $scope.operate = {
                // 查询服务详情
                "queryServiceDetail": function () {
                    var retDefer = $.Deferred();
                    var options = {
                        "user": user,
                        "id": serviceId
                    };
                    var deferred = catalogServiceIns.queryServiceOffering(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        $scope.detail = data;
                        $scope.detail.param = JSON.parse(data.params);
                        $scope.params.appData = JSON.parse($.base64.decode($scope.detail.param.appData, true));
                        $scope.params.cloudInfraId = $scope.detail.param.cloudInfraId;
                        $scope.params.selVpcId = $scope.detail.param.vpcId;
                        $scope.params.selServiceTemplate = {"id" : $scope.detail.param.templateId,"type" : "FusionManager"};
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },

                // 查询订单详情
                "queryOrderDetail": function () {
                    if (action !== "edit") {
                        return {};
                    }
                    var retDefer = $.Deferred();
                    var options = {
                        "user": user,
                        "orderId": orderId
                    };
                    var deferred = orderServiceIns.queryOrder(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        $scope.orderDetail = data;
                        $scope.orderDetail.param = JSON.parse(data.params);

                        $scope.params.appData = JSON.parse($.base64.decode($scope.orderDetail.param.appData, true));
                        //保证修改订单未修改规格的情况下，可以直接提交
                        networkFlag = true;
                        appFlag = true;
                        vlbFlag = true;
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },

                // 查询地域列表
                "queryLocations": function () {
                    var retDefer = $.Deferred();
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            var selectedCloudInfra = "";
                            data.cloudInfras[0].checked = false;
                            if (action === "edit") {
                                selectedCloudInfra = cloudInfraServiceIns.getCloudInfra(data.cloudInfras, $scope.orderDetail.param.cloudInfraId);
                            } else {
                                selectedCloudInfra = cloudInfraServiceIns.getCloudInfra(data.cloudInfras, $scope.detail.param.cloudInfraId);
                            }
                            if (selectedCloudInfra.selectId) {
                                selectedCloudInfra.checked = true;
                                $scope.cloudInfra = selectedCloudInfra;
                            } else {
                                data.cloudInfras[0].checked = true;
                                $scope.cloudInfra = data.cloudInfras[0];
                            }


                            $scope.base.location.values = data.cloudInfras;
                            getVPCList($scope.cloudInfra.selectId, false);
                        }
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exception.doException(rejectedValue);
                        retDefer.reject();
                    });
                    return retDefer.promise();
                },

                //根据vpcid查询可用网络
                "queryAvailableNetworkByVpcId" : function(vpcId) {
                    if (!vpcId) {
                        vpcId = $scope.detail.param.lock.vpcLock === '1' ? $("#applyApp-chooseVpc").widget().getSelectedId() || vpcId : $scope.params.selVpcId;
                        if (vpcId === null || vpcId === "" || vpcId === undefined) {
                            return;
                        }
                    }

                    var cloudInfraId = $scope.detail.param.lock.locationLock === '1' ?  $("#" + $scope.base.location.id).widget().getSelectedId() : $scope.params.cloudInfraId;
                    if (cloudInfraId === null || cloudInfraId === "" || cloudInfraId === undefined) {
                        return;
                    }
                    var templateTable = $scope.templateNet.data;
                    var options = {
                        "vdcId": user.vdcId,
                        "vpcId": vpcId,
                        "userId": user.id,
                        "cloudInfraId": cloudInfraId
                    };
                    var deferred = networkServiceIns.queryNetworks(options);
                    deferred.then(function (data) {
                        if (!data || !data.networks || (data.networks.length <= 0)) {
                            //更新vpc
                            var updateVpcNetData = [];
                            _.each(templateTable, function (item, index) {
                                item.vpcName = $("#applyApp-chooseVpc").widget() ? $("#applyApp-chooseVpc").widget().getSelectedLabel() : $scope.vpc.label;
                                item.networkId = null;
                                item.networkName = null;
                                item.networkValues = [];
                                updateVpcNetData.push(item);
                            });
                            $scope.templateNet.data = updateVpcNetData;
                            return;
                        }
                        var formatAvailableNets = [];
                        var tmpAvailableNet = null;
                        _.each(data.networks, function (item, index) {
                            tmpAvailableNet = {};
                            tmpAvailableNet.selectId = item.networkID;
                            tmpAvailableNet.label = item.name;
                            formatAvailableNets.push(tmpAvailableNet);
                        });

                        var newTemplateTable = [];
                        _.each(templateTable, function (item, index) {
                            //初始化场景
                            tmpAvailableNet = angular.copy(formatAvailableNets);
                            item.networkValues = tmpAvailableNet;
                            if (!item.networkId) {
                                item.networkId = "";
                                item.networkName = "";
                            }
                            item.vpcName = $("#applyApp-chooseVpc").widget() ? $("#applyApp-chooseVpc").widget().getSelectedLabel() : $scope.vpc.label;
                            newTemplateTable.push(item);
                        });
                        $scope.templateNet.data = newTemplateTable;
                    });
                },


                "queryServiceTemplateContent" : function () {
                    var options = {
                        "vdcId": user.vdcId,
                        "id": $scope.params.selServiceTemplate.id,
                        "userId": user.id
                    };
                    var deferred = desigerServiceIns.queryAppTemplate(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        var jsonBody = data.body;
                        if (!jsonBody || "" === jsonBody) {
                            tipMessage.alert("error", i18n.common_term_innerError_label);
                            return;
                        }
                        var jsonObj = null;
                        try {
                            jsonObj = JSON.parse($.base64.decode(jsonBody, true));
                        } catch (e) {
                            tipMessage.alert("error", i18n.common_term_innerError_label);
                            return;
                        }

                        if ($scope.params.selServiceTemplate.type === 'FusionManager') {
                            parseAppTemplateFm(jsonObj);
                        }

                        $scope.params.appTempBody = jsonObj;
                    });
                },
                "queryOsTypeMapping" : function() {
                    var params = {
                        "user": user
                    };
                    var deferred = appCommonServiceIns.queryOsTypeMappings(params);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.tmp.osTypeMap = data.mapping || {};
                        $scope.operate.queryAvailableVmTemplate();
                        $scope.operate.queryAvailableSpecs();
                        $scope.operate.queryAvailableSoftPacks();
                        $scope.operate.queryAvailableShell();
                    });
                },
                //查询可用模板,默认选中的模板对应的规格  备注:切记要进行深拷贝
                "queryAvailableVmTemplate" : function() {
                    var vmTable = $scope.confAppVmTemplates.data;
                    if (vmTable.length <= 0) {
                        return false;
                    }
                    var cloudInfraId = $scope.detail.param.lock.locationLock === '1' ? $("#" + $scope.base.location.id).widget().getSelectedId()  : $scope.params.cloudInfraId;
                    if (cloudInfraId === null || cloudInfraId === "" || cloudInfraId === undefined) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfraId,
                        "azid":$scope.azId,
                        "status": "FINISHED"
                    };
                    var deferred = appCommonServiceIns.queryAvailableVmTemplate(options);
                    deferred.then(function (data) {
                        if (!data || (data.vmtemplates.length <= 0)) {
                            var newVmTemplate = [];
                            _.each($scope.confAppVmTemplates.data, function (item, index) {
                                item.templateValues = [];
                                item.templateId = "";
                                item.templateName = "";
                                newVmTemplate.push(item);
                            });
                            $scope.confAppVmTemplates.data = newVmTemplate;
                            return false;
                        }

                        var newVmTemplates = [];
                        _.each($scope.confAppVmTemplates.data, function (item, index) {
                            item.templateValues = filterVmTemplatesByCondition(data.vmtemplates, item);
                            if (!item.templateId) {
                                item.templateId = "";
                                item.templateName = "";
                            }
                            newVmTemplates.push(item);
                        });
                        $scope.confAppVmTemplates.data = newVmTemplates;
                    });
                },
                "queryAvailableSpecs" : function() {
                    var vmTable = $scope.confAppVmTemplates.data;
                    if (!vmTable || (vmTable.length <= 0)) {
                        return false;
                    }
                    var cloudInfraId = $scope.detail.param.lock.locationLock === '1' ? $("#" + $scope.base.location.id).widget().getSelectedId()  : $scope.params.cloudInfraId;
                    if (cloudInfraId === null || cloudInfraId === "" || cloudInfraId === undefined) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfraId
                    };
                    var deferred = appCommonServiceIns.queryVmFlavors(options);
                    deferred.then(function (data) {
                        if (!data || (data.vmFlavors.length <= 0)) {
                            var newTemplateTables = [];
                            _.each(vmTable, function (item, index) {
                                item.specValues = [];
                                //初始时默认选中第一个,并且详情对应第一个
                                item.spec = "";
                                item.specDetail = "";
                                item.selSpecCpu = "";
                                item.selSpecRam = "";
                                item.selSpecDisk = "";
                                newTemplateTables.push(item);
                            });
                            $scope.confAppVmTemplates.data = newTemplateTables;
                            return false;
                        }
                        var availableFlavors = [];
                        var tmpFlavor = null;
                        var tmpSpecArray = null;
                        _.each(data.vmFlavors, function (item, index) {
                            tmpFlavor = {};
                            tmpFlavor.selectId = item.flavorId;
                            tmpSpecArray = appCommonServiceIns.generateSpec(item);
                            tmpFlavor.label = tmpSpecArray.overviewSpec;
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
                                item.spec = "";
                                item.specDetail = "";
                                item.selSpecCpu = "";
                                item.selSpecRam = "";
                                item.selSpecDisk = "";
                            }
                            newTemplateTable.push(item);
                        });
                        $scope.confAppVmTemplates.data = newTemplateTable;
                    });
                },
                "queryAvailableSoftPacks" : function () {
                    var softPacks = $scope.confAppSoftPacks.data;
                    if (!softPacks || (softPacks.length <= 0)) {
                        return false;
                    }
                    var cloudInfraId = $scope.detail.param.lock.locationLock === '1' ? $("#" + $scope.base.location.id).widget().getSelectedId()  : $scope.params.cloudInfraId;
                    if (cloudInfraId === null || cloudInfraId === "" || cloudInfraId === undefined) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfraId
                    };
                    var deferred = appCommonServiceIns.queryAvailableSoftPacks(options);
                    deferred.then(function (data) {
                        if (!data || (data.softwareInfos.length <= 0)) {
                            var softpackTables = [];
                            _.each(softPacks, function (item, index) {
                                item.softwareValues = [];
                                softpackTables.push(item);
                            });
                            $scope.confAppSoftPacks.data = softpackTables;
                            return false;
                        }
                        var tmpAvailableSofts = null;
                        var softpackTable = [];
                        _.each(softPacks, function (item, index) {
                            item.softwareValues = filterSoftwaresByCondition(data.softwareInfos, item, true);
                            softpackTable.push(item);
                        });
                        $scope.confAppSoftPacks.data = softpackTable;
                    });
                },
                "queryAvailableShell" : function (pageInfo) {
                    var cloudInfraId = $scope.detail.param.lock.locationLock === '1' ? $("#" + $scope.base.location.id).widget().getSelectedId()  : $scope.params.cloudInfraId;
                    if (cloudInfraId === null || cloudInfraId === "" || cloudInfraId === undefined) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfraId
                    };
                    var deferred = appCommonServiceIns.queryAvailableShell(options);
                    deferred.then(function (data) {
                        var shells = $scope.confAppShells.data;
                        if (!data || (data.scriptInfos.length <= 0)) {
                            var newShellTables = [];
                            _.each(shells, function (item, index) {
                                item.shellValues = [];
                                newShellTables.push(item);
                            });
                            $scope.confAppShells.data = newShellTables;
                            return;
                        }
                        var newShellTable = [];
                        var copyShellSelects = null;
                        _.each(shells, function (item, index) {
                            copyShellSelects = filterSoftwaresByCondition(data.scriptInfos, item, false);
                            item.shellValues = copyShellSelects;
                            newShellTable.push(item);
                        });
                        $scope.confAppShells.data = newShellTable;
                    });
                },
                "initVlbNetworks":function () {
                    if ($scope.confVlbVmTemplates.data.length <= 0) {
                        return;
                    }
                    var tmpConfVlb = null;
                    var newConfVlbVmTemplates = [];
                    for (var i = 0; i < $scope.confVlbVmTemplates.data.length; i++) {
                        tmpConfVlb = $scope.confVlbVmTemplates.data[i];
                        if ($scope.configVlbNetworkMap[tmpConfVlb.orgNetId]) {
                            tmpConfVlb.orgNetName = $scope.configVlbNetworkMap[tmpConfVlb.orgNetId].networkName;
                        }
                        newConfVlbVmTemplates.push(tmpConfVlb);
                    }
                    $scope.confVlbVmTemplates.data = newConfVlbVmTemplates;
                },
                "applyApp" : function() {
                    var comments = $("#" + $scope.remark.id).widget().getValue();
                    var time = $("#" + $scope.base.expireTime.id).widget().getDateTime();

                    var templateBodyStr = updateTemplateBody();
                    var cloudInfraId = null;
                    if ($scope.detail.param.lock.locationLock === '1') {
                        cloudInfraId = $("#" + $scope.base.location.id).widget().getSelectedId();
                    } else if ($scope.detail.param.lock.locationLock === '0') {
                        cloudInfraId = $scope.detail.param.cloudInfraId;
                    } else {
                        cloudInfraId = "";
                    }

                    var vpcId = "";
                    if ($scope.detail.param.lock.vpcLock === '1') {
                        vpcId = $("#" + $scope.base.vpc.id).widget().getSelectedId();
                    } else if ($scope.detail.param.lock.vpcLock === '0') {
                        vpcId = $scope.detail.param.vpcId;
                    } else {
                        vpcId = "";
                    }
                    var lock = $scope.detail.param.lock;
                    if (lock.networkLock === '1') {
                        $scope.params.appData.templateNet = $scope.templateNet;
                    }
                    if (lock.commonParamsLock === '1') {
                        $scope.params.appData.commonParams = $scope.commonParams;
                    }
                    if (lock.vmLock === '1') {
                        $scope.params.appData.confAppVmTemplates = $scope.confAppVmTemplates;
                    }
                    if (lock.appLock === '1') {
                        $scope.params.appData.confAppSoftPacks = $scope.confAppSoftPacks;
                        $scope.params.appData.confAppShells = $scope.confAppShells;
                    }
                    if (lock.vlbLock === '1') {
                        $scope.params.appData.confVlbVmTemplates = $scope.confVlbVmTemplates;
                    }

                    var paramsJson = {
                        "appData" : $.base64.encode(JSON.stringify($scope.params.appData), true),
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId,
                        "appName" :  $("#" + $scope.base.name.id).widget().getValue() + $scope.appTempName,
                        "desc" : $("#" + $scope.remark.id).widget().getValue(),
                        "picture": $scope.detail.param.picture,
                        "templateId": $scope.detail.param.templateId,
                        "templateBody": $.base64.encode(JSON.stringify(templateBodyStr), true),
                        "parameters" : generateParameters()
                    };
                    var options = {
                        "user": user,
                        "params" : {
                            "apply": {
                                "serviceOfferingId": serviceId,
                                "params": JSON.stringify(paramsJson),
                                "tenancy": $("#" + $scope.base.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc(time)
                            },
                            "comments" : comments
                        }
                    };

                    var deferred = orderServiceIns.createOrder(options);
                    deferred.then(function (data) {
                        if (data && data.orderId) {
                            tipMessage.sspAlert(data.orderId, function(){
                                $state.go("ssp.approvalAppApply", {
                                    "orderId" : data.orderId,
                                    "action" : "view",
                                    "serviceId" : serviceId
                                });
                            });
                        }

                        //创建成功跳转至订单页面
                        $state.go("ssp.order.apply");
                    });
                },
                "editApp" : function() {
                    var comments = $("#" + $scope.remark.id).widget().getValue();
                    var time = $("#" + $scope.base.expireTime.id).widget().getDateTime();

                    var templateBodyStr = updateTemplateBody();
                    var cloudInfraId = null;
                    if ($scope.detail.param.lock.locationLock === '1') {
                        cloudInfraId = $("#" + $scope.base.location.id).widget().getSelectedId();
                    } else if ($scope.detail.param.lock.locationLock === '0') {
                        cloudInfraId = $scope.detail.param.cloudInfraId;
                    } else {
                        cloudInfraId = "";
                    }

                    var vpcId = "";
                    if ($scope.detail.param.lock.vpcLock === '1') {
                        vpcId = $("#" + $scope.base.vpc.id).widget().getSelectedId();
                    } else if ($scope.detail.param.lock.vpcLock === '0') {
                        vpcId = $scope.detail.param.vpcId;
                    } else {
                        vpcId = "";
                    }
                    var lock = $scope.detail.param.lock;
                    if (lock.networkLock === '1') {
                        $scope.params.appData.templateNet = $scope.templateNet;
                    }
                    if (lock.commonParamsLock === '1') {
                        $scope.params.appData.commonParams = $scope.commonParams;
                    }
                    if (lock.vmLock === '1') {
                        $scope.params.appData.confAppVmTemplates = $scope.confAppVmTemplates;
                    }
                    if (lock.appLock === '1') {
                        $scope.params.appData.confAppSoftPacks = $scope.confAppSoftPacks;
                        $scope.params.appData.confAppShells = $scope.confAppShells;
                    }
                    if (lock.vlbLock === '1') {
                        $scope.params.appData.confVlbVmTemplates = $scope.confVlbVmTemplates;
                    }

                    var paramsJson = {
                        "appData" : $.base64.encode(JSON.stringify($scope.params.appData), true),
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId,
                        "appName" :  $("#" + $scope.base.name.id).widget().getValue() + $scope.appTempName,
                        "desc" : $("#" + $scope.remark.id).widget().getValue(),
                        "picture": $scope.detail.param.picture,
                        "templateId": $scope.detail.param.templateId,
                        "templateBody": $.base64.encode(JSON.stringify(templateBodyStr), true)
                    };

                    var options = {
                        "user" : user,
                        "id" : orderId,
                        "params" : {
                            "params" : JSON.stringify(paramsJson),
                            "tenancy" : $("#" + $scope.base.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc(time),
                            "comments" : comments
                        }
                    };
                    var deferred = orderServiceIns.modifyOrder(options);
                    deferred.then(function (data) {
                        $state.go("ssp.order.apply");
                    });
                }

            };
            //根据创建用户流程中选择的配置,更新服务模板体
            function updateTemplateBody() {
                //更新resources部分,包括vmTemplate,Network
                var appTempBody = JSON.parse($.base64.decode($scope.detail.param.templateBody, true));
                var resources = appTempBody.Resources;
                var tmpResource = null;
                var tmpNic = null;
                _.each(resources, function (item, index) {
                    tmpResource = resources[index];
                    if (!tmpResource) {
                        return;
                    }
                    if (tmpResource.Type === "GM::Network" && $scope.detail.param.lock.networkLock === '1') {
                        updateNetwork(index, tmpResource);
                        return;
                    }
                    if (tmpResource.Type === "GM::VmTemplate") {
                        if ($scope.detail.param.lock.vmLock === '1') {
                            updateVmTemplate(index, tmpResource);
                        }

                        if (tmpResource.Properties && tmpResource.Properties.Softwares && tmpResource.Properties.Softwares.length && (tmpResource.Properties.Softwares.length > 0) && $scope.detail.param.lock.appLock === '1') {
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
                        if ($scope.detail.param.lock.vlbLock === '1') {
                            updateVlbNic(tmpResource.Properties.Nics, $scope.tmp.ameIdVlbNetMap[index].nicIndex, $scope.tmp.ameIdVlbNetMap[index].associateVlbId);
                        }
                    }
                });
                return appTempBody;
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

            //根据订单详情，初始化页面基本信息
            function initBaseByOrderDetail() {
                var param = $scope.orderDetail.param || {};
                // 名称
                $scope.base.name.value = param.appName ? param.appName.substr(0,param.appName.lastIndexOf($scope.appTempName)) : "app001";

                $scope.remark.value = $scope.orderDetail.comments;

                // 到期时间
                if ($scope.orderDetail.tenancy) {
                    if ($scope.orderDetail.tenancy === "0") {
                        $scope.base.expireTime.disable = true;
                        $scope.base.neverExpire.checked = true;
                    } else {
                        var dateWidget = $("#" + $scope.base.expireTime.id).widget();
                        if (dateWidget) {
                            var localTime = timeCommonService.utc2Local($scope.orderDetail.tenancy);
                            var dateTime = localTime.split(" ");
                            dateWidget.option("defaultTime", dateTime[1]);
                            dateWidget.option("defaultDate", dateTime[0]);
                        }
                    }
                }
            }

            function getVPCList(cloudInfraId, change) {
                if (!cloudInfraId) {
                    return;
                }
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfraId
                };
                var deferred = appCommonServiceIns.queryVpcList(options);
                deferred.then(function (data) {
                    if (!data || !data.vpcs) {
                        return;
                    }

                    if (data.vpcs.length <= 0) {
                        $("#applyApp-chooseVpc").widget().opChecked();
                        $scope.params.selVpcId = null;
                        $scope.base.vpc.values = [];
                        var templateTable = $scope.templateNet.data;
                        var updateVpcNetData = [];
                        _.each(templateTable, function (item, index) {
                            item.vpcName = "";
                            item.networkId = null;
                            item.networkName = null;
                            item.networkValues = [];
                            updateVpcNetData.push(item);
                        });
                        $scope.templateNet.data = updateVpcNetData;
                        _.each($scope.confVlbVmTemplates.data, function(item, index){
                            $scope.confVlbVmTemplates.data[index].associateVlbId = "";
                            $scope.confVlbVmTemplates.data[index].associateVlb = "";
                        });
                        rebuildVlbTable(false);
                        return;
                    }

                    //适配下拉框
                    var availableVpcs = [];
                    var tmpVpc = null;
                    var selectVPC = null;
                    _.each(data.vpcs, function (item, index) {
                        tmpVpc = {
                            "selectId": item.vpcID,
                            "label": item.name
                        };
                        if (action === "edit") {
                            if ($scope.orderDetail.param.vpcId === tmpVpc.selectId) {
                                tmpVpc.checked = true;
                                selectVPC = tmpVpc;
                            } else {
                                tmpVpc.checked = false;
                            }
                        } else {
                            if ($scope.detail.param.vpcId === tmpVpc.selectId) {
                                tmpVpc.checked = true;
                                selectVPC = tmpVpc;
                            } else {
                                tmpVpc.checked = false;
                            }
                        }
                        $scope.azId = item.availableZone[0].id;
                        availableVpcs.push(tmpVpc);
                    });
                    if (!selectVPC) {
                        availableVpcs[0].checked = true;
                        $scope.vpc = availableVpcs[0];
                        getAzIdByVpcId(availableVpcs[0].selectId);
                    } else {
                        $scope.vpc = selectVPC;
                    }
                    $scope.base.vpc.values = availableVpcs;

                    if (networkClose === true && change) {
                        networkFlag = false;
                    } else{
                        $scope.operate.queryAvailableNetworkByVpcId($scope.vpc.selectId);
                    }

                    _.each($scope.confVlbVmTemplates.data, function(item, index){
                        $scope.confVlbVmTemplates.data[index].associateVlbId = "";
                        $scope.confVlbVmTemplates.data[index].associateVlb = "";
                    });
                    rebuildVlbTable(false);
                });
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

            function validateParamConfig(isSoftware) {
                if (isSoftware) {
                    var tmpSoftData = null;
                    for (var i = 0; i < $scope.confAppSoftPacks.data.length; i++) {
                        tmpSoftData = $scope.confAppSoftPacks.data[i].softwareData;
                        if (!tmpSoftData) {
                            tipMessage.alert("error", i18n.app_app_create_info_softNoCfg_msg);
                            return false;
                        }
                        if (!isParamSet(tmpSoftData.installParams)) {
                            tipMessage.alert("error", i18n.app_app_create_info_softNoCfg_msg);
                            return false;
                        }
                        if (!isParamSet(tmpSoftData.unInstallParams)) {
                            tipMessage.alert("error", i18n.app_app_create_info_softNoCfg_msg);
                            return false;
                        }
                        if (!isParamSet(tmpSoftData.startParams)) {
                            tipMessage.alert("error", i18n.app_app_create_info_softNoCfg_msg);
                            return false;
                        }
                        if (!isParamSet(tmpSoftData.stopParams)) {
                            tipMessage.alert("error", i18n.app_app_create_info_softNoCfg_msg);
                            return false;
                        }
                    }
                    return true;
                }

                var tmpShellData = null;
                for (var k = 0; k < $scope.confAppShells.data.length; k++) {
                    tmpShellData = $scope.confAppShells.data[k].shellData;
                    if (!tmpShellData) {
                        tipMessage.alert("error", i18n.app_app_create_info_ScriptNoCfg_msg);
                        return false;
                    }
                    if (!isParamSet(tmpShellData.installParams)) {
                        tipMessage.alert("error", i18n.app_app_create_info_ScriptNoCfg_msg);
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

            function rebuildVlbTable(isApply) {
                var newVlbTable = [];
                _.each($scope.confVlbVmTemplates.data, function (item, index) {
                    newVlbTable.push(item);
                });
                if (isApply) {
                    $scope.$apply(function () {
                        $scope.confVlbVmTemplates.data = newVlbTable;
                    });
                } else {
                    $scope.confVlbVmTemplates.data = newVlbTable;
                }
            }

            function parseAppTemplateFm(jsonObj) {
                //公共参数
                if (jsonObj.Parameters) {
                    var commonParameters = jsonObj.Parameters;
                    var commonParamsData = [];
                    var tmpCommonParams = null;
                    var pName;
                    var detailParams = [];
                    //如果是修改服务，参数详情要从查询出的数据中找
                    if (action === "edit") {
                        detailParams = $scope.orderDetail.param.parameters;
                    }
                    var i = 0;
                    _.each(commonParameters, function (item, index) {
                        if (commonParameters.hasOwnProperty(index) && item) {
                            tmpCommonParams = {};
                            tmpCommonParams.name = index;
                            tmpCommonParams.value = action === "edit" ? detailParams[i].value : item.Default;
                            tmpCommonParams.type = item.Type;
                            tmpCommonParams.description = item.Description;
                            tmpCommonParams.needInput = checkIsNeedInput(item.Default);
                            commonParamsData.push(tmpCommonParams);
                            i ++;
                        }
                    });
                    $scope.commonParams.data = commonParamsData;
                }

                //模板网络 VM模板
                var networks = [];
                var vmTemplates = [];
                var softwares = [];
                var shells = [];
                var vlbNets = [];
                var vmNameMap = {};
                var vmNicsMap = {};
                var vmTempInstanceMap = {};
                var ameIdVlbNetMap = {};
                //注:ameIdResourceMap里的key-value中的value存的是表格数据的"引用",用来最终往JSON体里更新数据
                var ameIdResourceMap = {};
                var tmpVmNicsArray = null;
                var o =0, p = 0, q=0, r=0, s = 0;
                if (jsonObj.Resources) {
                    var resources = jsonObj.Resources;
                    var tmpResource = null;
                    _.each(resources, function (item, index) {
                        if (!item) {
                            return;
                        }
                        if ("GM::Network" === item.Type) {
                            if (action === "edit") {
                                tmpResource = $scope.params.appData.templateNet.data[o];
                            } else {
                                tmpResource = {};
                                tmpResource.name = item.Properties && item.Properties.Name;
                                tmpResource.description = item.Properties && item.Properties.Description;
                                tmpResource.networkId = null;
                                tmpResource.ameId = index;
                            }

                            networks.push(tmpResource);
                            ameIdResourceMap[index] = tmpResource;
                            o ++;
                        }
                        if ("GM::VmTemplate" === item.Type) {
                            if (!item.Properties) {
                                return;
                            }
                            if (action === "edit") {
                                tmpResource = $scope.params.appData.confAppVmTemplates.data[p];
                            } else {
                                tmpResource = {};
                                tmpResource.name = item.Properties.Name;
                                tmpResource.templateId = item.Properties.VmTemplateID;
                                tmpResource.vmTemplateName = item.Properties.VmTempateName;
                                tmpResource.vmOsType = item.Properties.OSType;
                                tmpResource.vmOsVersion = item.Properties.OSVersion;
                                tmpResource.specCpu = item.Properties.CPU;
                                tmpResource.specRam = item.Properties.Memory;
                                tmpResource.specDisk = item.Properties.Volumes;
                            }

                            vmTemplates.push(tmpResource);
                            vmNameMap[index] = item.Properties.Name;
                            ameIdResourceMap[index] = tmpResource;
                            p++;

                            if (item.Properties.Softwares && (item.Properties.Softwares.length > 0)) {
                                var tmpSoftware = null;
                                for (var i = 0; i < item.Properties.Softwares.length; i++) {
                                    if (!item.Properties.Softwares[i]) {
                                        continue;
                                    }
                                    if ("Software" === item.Properties.Softwares[i].Type) {
                                        tmpSoftware = getSoftwareInfo(item.Properties.Softwares[i], item.Properties.Name);
                                        tmpSoftware.vmTemplateAmeId = index;
                                        tmpSoftware.osType = tmpResource.vmOsType;
                                        if (null !== tmpSoftware) {
                                            if (action === "edit") {
                                                tmpSoftware = $scope.params.appData.confAppSoftPacks.data[q];
                                            }
                                            softwares.push(tmpSoftware);
                                            q ++;
                                        }
                                    } else {
                                        tmpSoftware = getShellInfo(item.Properties.Softwares[i], item.Properties.Name);
                                        tmpSoftware.vmTemplateAmeId = index;
                                        tmpSoftware.osType = tmpResource.vmOsType;
                                        if (null !== tmpSoftware) {
                                            if (action === "edit") {
                                                tmpSoftware = $scope.params.appData.confAppShells.data[r];
                                            }
                                            shells.push(tmpSoftware);
                                            r ++;
                                        }
                                    }
                                    ameIdResourceMap[item.Properties.Softwares[i].Id] = tmpSoftware;
                                }
                            }

                            tmpVmNicsArray = [];
                            if (item.Properties.Nics && (item.Properties.Nics.length > 0)) {
                                var tmpVlb = null;
                                for (var j = 0; j < item.Properties.Nics.length; j++) {
                                    tmpVlb = getVlbNetwork(item.Properties.Nics[j], item.Properties.Name);
                                    if (tmpVlb) {
                                        tmpVlb.vmTemplateAmeId = index;
                                        tmpVlb.nicIndex = j;
                                        if (action === "edit") {
                                            tmpVlb = $scope.params.appData.confVlbVmTemplates.data[s];
                                        }
                                        vlbNets.push(tmpVlb);
                                        ameIdVlbNetMap[index] = tmpVlb;
                                        s ++;
                                    }
                                    tmpVmNicsArray.push(tmpVlb ? tmpVlb.nicName : item.Properties.Nics[j].Name);
                                }
                            }
                            vmNicsMap[index] = tmpVmNicsArray;
                        }
                        //缓存虚拟机实例与虚拟机模板的关系,软件包,脚本需要回填
                        if ("GM::Instance" === item.Type) {
                            var instanceAmeId = index;
                            var vmTemplateId = null;
                            var instance = item;
                            if (instance.Properties && instance.Properties.VmTemplateID && instance.Properties.VmTemplateID.Ref && (instance.Properties.VmTemplateID.Ref.length > 0)) {
                                vmTemplateId = instance.Properties.VmTemplateID.Ref[0];
                            }
                            if (instanceAmeId && vmTemplateId) {
                                vmTempInstanceMap[vmTemplateId] = instanceAmeId;
                            }
                        }
                    });

                    $scope.templateNet.data = networks;
                    $scope.tmp.ameIdResourceMap = ameIdResourceMap;
                    $scope.confAppVmTemplates.data = vmTemplates;
                    $scope.confAppSoftPacks.data = softwares;
                    $scope.confAppShells.data = shells;
                    $scope.confVlbVmTemplates.data = vlbNets;
                    $scope.tmp.vmNameMap = vmNameMap;
                    $scope.tmp.vmNicsMap = vmNicsMap;
                    $scope.tmp.vmTempInstanceMap = vmTempInstanceMap;
                    $scope.tmp.ameIdVlbNetMap = ameIdVlbNetMap;

                    //这里要通过锁定赋值
                    var lock = $scope.detail.param.lock;
                    if (action === "apply" && lock.networkLock !== '1' && $scope.params.appData !== null) {
                        $scope.templateNet =  $scope.params.appData.templateNet;
                    }
                    if (action === "apply" && lock.commonParamsLock !== '1' && $scope.params.appData !== null) {
                        $scope.commonParams = $scope.params.appData.commonParams;
                    }
                    if (action === "apply" && lock.vmLock !== '1' && $scope.params.appData !== null) {
                        $scope.confAppVmTemplates = $scope.params.appData.confAppVmTemplates;
                    }
                    if (action === "apply" && lock.appLock !== '1' && $scope.params.appData !== null) {
                        $scope.confAppSoftPacks = $scope.params.appData.confAppSoftPacks;
                        $scope.confAppShells = $scope.params.appData.confAppShells;
                    }
                    if (action === "apply" && lock.vlbLock !== '1' && $scope.params.appData !== null) {
                        $scope.confVlbVmTemplates = $scope.params.appData.confVlbVmTemplates;
                    }
                }
            }

            function checkIsNeedInput(property) {
                if (typeof property === "undefined") {
                    return true;
                } else if ((property === null) || (property === "")) {
                    return true;
                } else {
                    return false;
                }
            }

            function getSoftwareInfo(softwareFromJson, vmName) {
                if (!softwareFromJson) {
                    return null;
                }
                var software = {};
                software.vmTemplateAmeId = null;
                software.name = vmName;
                //softwareName和oriSoftwareName分别用于显示和过滤
                software.softwareName = softwareFromJson.Name;
                software.oriSoftwareName = softwareFromJson.Name;
                software.softwareId = softwareFromJson.PackageID;
                software.osType = softwareFromJson.OSType;
                software.version = softwareFromJson.Version;
                software.ameId = softwareFromJson.Id;
                return software;
            }

            function getShellInfo(shellFromJson, vmName) {
                if (!shellFromJson) {
                    return null;
                }
                var shell = {};
                shell.name = vmName;
                shell.shellName = shellFromJson.Name;
                shell.oriShellName = shellFromJson.Name;
                shell.shellId = null;
                shell.osType = shellFromJson.OSType;
                shell.version = shellFromJson.Version;
                shell.ameId = shellFromJson.Id;
                return shell;
            }

            function getVlbNetwork(nic, vmName) {
                if (!nic) {
                    return null;
                }
                if (!nic.Vlb || (nic.Vlb !== "true")) {
                    return null;
                }
                var vlbNetwork = {};
                vlbNetwork.vmTemplateAmeId = null;
                vlbNetwork.nicIndex = null;
                vlbNetwork.templateId = null;
                vlbNetwork.vpcId = null;
                vlbNetwork.templateName = vmName;
                vlbNetwork.nicName = nic.Name;
                vlbNetwork.orgNetName = null;
                if (nic.NetworkID && nic.NetworkID.Ref && (nic.NetworkID.Ref.length > 0)) {
                    vlbNetwork.orgNetId = nic.NetworkID.Ref[0];
                }
                vlbNetwork.associateVlb = null;
                vlbNetwork.associateVlbId = null;
                return vlbNetwork;
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
                _.each(allSoftwares, function(item, index) {
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

            //保存network标签的数据
            function saveNetwork() {
                var valid = UnifyValid.FormValid($("#sspApplyAppNetworkArea"));
                if (!valid) {
                    return false;
                }

                var selectedNetworks = $scope.network.networkTable.data;
                if (!$scope.network.networkTable.data) {
                    $scope.network.networkTable.data = [];
                }
                if (selectedNetworks.length > 0) {
                    for (var i = 0; i < selectedNetworks.length; i++) {
                        selectedNetworks[i].vpcId = $("#applyAppChooseNetworkVpc" + i).widget().getSelectedId();
                        selectedNetworks[i].vpcName = $("#applyAppChooseNetworkVpc" + i).widget().getSelectedLabel();
                        selectedNetworks[i].networkId = $("#applyAppChooseNetworkNet" + i).widget().getSelectedId();
                        selectedNetworks[i].networkName = $("#applyAppChooseNetworkNet" + i).widget().getSelectedLabel();
                    }
                }
                $scope.params.networks = selectedNetworks;

                //缓存一份,用于快速寻找vlb的网卡与网络的对应关系
                if ($scope.templateNet.data.length > 0) {
                    _.each($scope.templateNet.data, function (item, index) {
                        $scope.configVlbNetworkMap[item.ameId] = item;
                    });
                }
                if ($scope.detail.param.lock.vlbLock === "1") {
                    $scope.operate.initVlbNetworks();
                }
                return true;
            }

            function saveConfigApp() {
                var valid = UnifyValid.FormValid($("#sspApplyAppConfigApp"));
                if (!valid) {
                    return false;
                }

                if ($scope.detail.param.lock.vmLock === "1") {
                    if (!$scope.configApp.vmTable.data) {
                        $scope.configApp.vmTable.data = [];
                    }
                    var selectedVmData = $scope.configApp.vmTable.data;
                    if (selectedVmData.length > 0) {
                        for (var i = 0; i < selectedVmData.length; i++) {
                            selectedVmData[i].templateId = $("#applyApp-configApp-selectTemplate" + i).widget().getSelectedId();
                            selectedVmData[i].templateName = $("#applyApp-configApp-selectTemplate" + i).widget().getSelectedLabel();
                            selectedVmData[i].spec = $("#applyApp-configApp-selectSpecs" + i).widget().getSelectedId();
                            selectedVmData[i].specName = $("#applyApp-configApp-selectSpecs" + i).widget().getSelectedLabel();
                        }
                    }
                    $scope.params.templates = selectedVmData;
                }

                if ($scope.detail.param.lock.appLock === "1") {

                    if (!validateParamConfig(true)) {
                        return false;
                    }
                    if (!validateParamConfig(false)) {
                        return false;
                    }

                    if (!$scope.configApp.softwarePacks.data) {
                        $scope.configApp.softwarePacks.data = [];
                    }
                    var selectedSoftwareDatas = $scope.configApp.softwarePacks.data;
                    if (selectedSoftwareDatas.length > 0) {
                        for (var k = 0; k < selectedSoftwareDatas.length; k++) {
                            selectedSoftwareDatas[k].softwareId = $("#applyApp-configApp-selectSoftPack" + k).widget().getSelectedId();
                            selectedSoftwareDatas[k].softwareName = $("#applyApp-configApp-selectSoftPack" + k).widget().getSelectedLabel();
                        }
                    }
                    $scope.params.softwares = selectedSoftwareDatas;

                    if (!$scope.configApp.shells.data) {
                        $scope.configApp.shells.data = [];
                    }
                    var selectedShells = $scope.configApp.shells.data;
                    if (selectedShells.length > 0) {
                        for (var l = 0; l < selectedShells.length; l++) {
                            selectedShells[l].shellId = $("#applyApp-configApp-selectShell" + l).widget().getSelectedId();
                            selectedShells[l].shellName = $("#applyApp-configApp-selectShell" + l).widget().getSelectedLabel();
                        }
                    }
                    $scope.params.shells = selectedShells;
                }
                return true;
            }

            function saveVlbConfig() {
                var valid = UnifyValid.FormValid($("#sspApplyAppConfigVlb"));
                if (!valid) {
                    return false;
                }
                return true;
            }

            //根据vpc得到azid
            function getAzIdByVpcId(vpcId){
                var retDefer = $.Deferred();
                var options = {
                    "userId": user.id,
                    "cloudInfraId": $("#" + $scope.base.location.id).widget().getSelectedId(),
                    "vdcId":user.vdcId,
                    "vpcId":vpcId
                };
                var deferred = appCommonServiceIns.getVpc(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    $scope.azId = data.availableZone[0].id;
                    retDefer.resolve();
                });
                return retDefer.promise();
            }

            // 初始化页面信息
            function init() {
                var deferred = $scope.operate.queryServiceDetail();
                $.when(deferred).done(function(){
                    var deferred2 = $scope.operate.queryOrderDetail();
                    $.when(deferred2).done(function () {
                        //根据订单详情，初始化基本信息部分
                        initBaseByOrderDetail();
                        $scope.operate.queryServiceTemplateContent();
                        var deferred3 = $scope.operate.queryLocations();
                    });
                });
            }

            init();
        }
    ];

    return ctrl;
});
