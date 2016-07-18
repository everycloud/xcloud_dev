/**
 * Created on 14-2-27.
 */
/* global define */
define(['tiny-lib/jquery',
        "tiny-lib/angular",
        "tiny-widgets/Window",
        'app/services/validatorService',
        'tiny-common/UnifyValid',
        'app/services/cloudInfraService',
        'app/services/messageService',
        "app/services/tipMessageService",
        "app/business/ssp/controllers/plugin/app/constants",
        "app/business/ssp/services/plugin/app/appCommonService",
        "app/business/ssp/services/plugin/app/desigerService",
        "app/business/ssp/services/catalog/catalogService",
        'tiny-lib/underscore',
        "fixtures/appFixture"
    ],
    function ($, angular,Window, validatorService, UnifyValid, cloudInfraService, messageService,tipMessageService, constants, appCommonService, desigerService, catalogService, _) {
        "use strict";

        var ctrl = ["$scope", "camel", "$state", "$q", "exception","$stateParams",
            function ($scope, camel, $state, $q, exception,$stateParams ) {
                var validator = new validatorService();
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var messageServiceIns = new messageService();
                var tipMessage = new tipMessageService();
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                var desigerServiceIns = new desigerService(exception, $q, camel);
                var catalogServiceImpl = new catalogService(exception, $q, camel);

                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n;
                var appTemplateId = $stateParams.appTemplateId;
                $scope.params.appTemplateId = appTemplateId;
                $scope.params.templateId = $stateParams.templateId;
                $scope.params.serviceId = $stateParams.serviceId;
                $scope.params.action = $stateParams.action;
                $scope.params.approvalType = $stateParams.approvalType;

                $scope.info = {
                    "name": {
                        "id": "createApp-appName",
                        "label": i18n.common_term_name_label + ":",
                        "width": 200,
                        "require": true,
                        "value": "",
                        "validate": "regularCheck(" + validator.vmNameReg + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") +
                            "regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "56")
                    },
                    directory: {
                        "id": "createDirectory",
                        label: i18n.service_term_catalog_label + ":",
                        "mode": "multiple",
                        "require": true,
                        "width": 200,
                        "validate": "regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_waitChoose_value,
                        values: []
                    },
                    "location": {
                        label: i18n.common_term_section_label + ":",
                        require: true,
                        "id": "createApp-chooseLocation",
                        "width": 200,
                        'validate': 'required:' + i18n.common_term_null_valid,
                        "change": function () {
                            $("#" + $scope.info.vpc.id).widget().opChecked();
                            var resPoolId = $("#" + $scope.info.location.id).widget().getSelectedId();
                            if (!resPoolId) {
                                return;
                            }
                            getVPCList(resPoolId);
                        },
                        "values": [],
                        "disable": "false"
                    },
                    "locationLock": {
                        "label": "",
                        "require": "true",
                        "id": "locationSelect",
                        "spacing": {
                            "width": "50px",
                            "height": "30px"
                        },
                        "values": [{
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label
                        }, {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label,
                            "disable" : $scope.params.approvalType === 'none' ? true : false
                        }, {
                            "key": "0",
                            "text": i18n.user_term_lock_value,
                            "checked": true
                        }],
                        "layout": "horizon",
                        "change": function () {
                            $scope.lock.locationLock = $("#" + $scope.info.locationLock.id).widget().opChecked("checked");
                            $scope.lock.vpcLock = $scope.lock.locationLock;
                            var vLock = $("#" + $scope.info.vpcLock.id).widget();
                            vLock.opChecked($scope.lock.locationLock, true);

                            if ($scope.lock.locationLock === '0') {
                                $scope.info.location.disable = false;
                                vLock.opDisabled("0", false);
                                vLock.opDisabled("1", false);
                                if ($scope.params.approvalType !== "none") {
                                    vLock.opDisabled("2", false);
                                }
                                $scope.info.vpc.disable = false;

                            } else if ($scope.lock.locationLock === '1') {
                                $scope.info.location.disable = true;
                                vLock.opDisabled("0", true);
                                vLock.opDisabled("1", false);
                                if ($scope.params.approvalType !== "none") {
                                    vLock.opDisabled("2", false);
                                }
                                $scope.info.vpc.disable = true;
                            } else {
                                $scope.info.location.disable = true;
                                vLock.opDisabled("0", true);
                                vLock.opDisabled("1", true);
                                vLock.opDisabled("2", true);
                                $scope.info.vpc.disable = true;
                            }
                        }
                    },
                    "vpc": {
                        label: i18n.vpc_term_vpc_label + ":",
                        require: true,
                        "id": "createApp-chooseVpc",
                        "width": 200,
                        'validate': 'required:' + i18n.common_term_null_valid,
                        "values": [],
                        "disable": false
                    },
                    "vpcLock": {
                        "label": "",
                        "require": "true",
                        "id": "vpcSelect",
                        "spacing": {
                            "width": "50px",
                            "height": "30px"
                        },
                        "values": [{
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label
                        }, {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label,
                            "disable" : $scope.params.approvalType === 'none' ? true : false
                        }, {
                            "key": "0",
                            "text": i18n.user_term_lock_value,
                            "checked": true
                        }],
                        "layout": "horizon",
                        "change": function () {
                            $scope.lock.vpcLock = $("#" + $scope.info.vpcLock.id).widget().opChecked("checked");
                            if ($scope.lock.vpcLock === '0') {
                                $scope.info.vpc.disable = false;
                            } else {
                                $scope.info.vpc.disable = true;
                            }
                        }
                    },

                    "logo": {
                        "label": i18n.common_term_icon_label + ":",
                        "require": true,
                        "curLogo": "../theme/default/images/gm/cloudImg.png",
                        "options": ["buff01.jpg", "buff02.jpg", "buff03.jpg", "buff04.jpg", "buff05.jpg", "buff06.jpg", "buff07.jpg", "buff08.jpg", "buff09.jpg"],
                        "showOptions": false,
                        "upload": function () {
                            var importConfigWindow = new Window({
                                "winId": "importConfigWindow",
                                "title": i18n.common_term_uploadLocalPic_button,
                                "minimizable": false,
                                "maximizable": false,
                                "content-type": "url",
                                "content": "../src/app/business/ssp/views/plugin/app/create/uploadImage.html",
                                "height": 300,
                                "width": 530,
                                "buttons": null
                            }).show();
                        }
                    },

                    "description": {
                        "id": "createApp-appDescription",
                        "label": i18n.common_term_desc_label + ":",
                        "require": false,
                        "value": "",
                        "type": "multi",
                        "width": 300,
                        "height": "100",
                        "validate": "regularCheck(" + validator.noConstraintMaxLength + "):" + i18n.sprintf(i18n.common_term_length_valid, "1", "1024")
                    },

                    "preBtn": {
                        "id": "createApp-baseInfo-preBtn",
                        "text": i18n.common_term_back_button,
                        "click": function () {
                            if ($scope.params.action === "modify") {
                                $state.go("ssp.catalog");
                            } else {
                                $state.go("ssp.createApp", {"templateId" : $scope.params.templateId, "approvalType" : $scope.params.approvalType});
                            }
                        }
                    },
                    "nextBtn": {
                        "id": "createApp-baseInfo-nextBtn",
                        "disable": true,
                        "text": i18n.common_term_next_button,
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#createAppBasicInfo"));
                            if (!valid) {
                                return;
                            }
                            $scope.service.show = {
                                "basicInfo": false,
                                "chooseNetwork": true,
                                "configApp": false,
                                "configVlb": false,
                                "baseInfo" : false,
                                "confirmByTemplate": false
                            };

                            $scope.params.cloudInfraId = $("#createApp-chooseLocation").widget().getSelectedId();
                            $scope.params.cloudInfraName = $("#createApp-chooseLocation").widget().getSelectedLabel();
                            $scope.params.selVpcName = $("#createApp-chooseVpc").widget().getSelectedLabel();
                            $scope.params.selVpcId = $("#createApp-chooseVpc").widget().getSelectedId();
                            $("#createByTemplate-app-step").widget().next();
                            $scope.$emit($scope.events.selBaseInfoNext);
                        }
                    },
                    "cancelBtn": {
                        "id": "createApp-baseInfo-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.commonCancel();
                        }
                    }
                };

                function getLocations() {
//                    var resPoolType = ($scope.params.selServiceTemplate.type === 'FusionManager' ? 'fusionmanager' : 'openstack');
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id, "fusionmanager");
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        //修改模式下匹配并选中,如匹配不上则有问题
                        if ($scope.params.cloudInfraId) {
                            _.each(data.cloudInfras, function (item, index) {
                                if ($scope.params.cloudInfraId && ($scope.params.cloudInfraId === item.selectId)) {
                                    item.checked = true;
                                } else {
                                    item.checked = false;
                                }
                            });
                        } else {
                            if (data.cloudInfras.length > 0) {
                                $scope.params.cloudInfraId = data.cloudInfras[0].selectId;
                            }
                        }

                        if (data.cloudInfras) {
                            $scope.info.location.values = data.cloudInfras;
                            if (data.cloudInfras.length > 0) {
                                getVPCList($scope.params.cloudInfraId);
                            }
                        }
                    });
                }

                function getVPCList(cloudInfraId) {
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
                            $("#createApp-chooseVpc").widget().opChecked();
                            $scope.params.selVpcId = null;
                            $scope.info.vpc.values = [];
                        }

                        //适配下拉框
                        var availableVpcs = [];
                        var tmpVpc = null;
                        _.each(data.vpcs, function (item, index) {
                            tmpVpc = {
                                "selectId": item.vpcID,
                                "label": item.name
                            };
                            if ($scope.params.selVpcId) {
                                if ($scope.params.selVpcId === tmpVpc.selectId) {
                                    tmpVpc.checked = true;
                                } else {
                                    tmpVpc.checked = false;
                                }
                            } else {
                                if (index === 0) {
                                    tmpVpc.checked = true;
                                    $scope.params.selVpcId = tmpVpc.selectId;
                                }
                            }
                            availableVpcs.push(tmpVpc);
                        });
                        $scope.info.vpc.values = availableVpcs;
                    });
                }

                function queryServiceTemplateContent() {
                    var options = {
                        "vdcId": user.vdcId,
                        "id": $scope.params.appTemplateId,
                        "userId": user.id
                    };
                    var deferred = desigerServiceIns.queryAppTemplate(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.params.appTemplateName = data.name;
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
                        $scope.params.appTempBody = jsonObj;

                        parseAppTemplateFm(jsonObj);

                        $scope.info.nextBtn.disable = false;

                    });
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

                function parseAppTemplateFm(jsonObj) {
                    //公共参数
                    if (jsonObj.Parameters) {
                        var commonParameters = jsonObj.Parameters;
                        var commonParamsData = [];
                        var tmpCommonParams = null;
                        var pName;
                        var detailParams = [];
                        //如果是修改服务，参数详情要从查询出的数据中找
                        if ($scope.params.action === "modify") {
                            detailParams = $scope.detail.param.parameters;
                        }
                        var i = 0;
                        _.each(commonParameters, function (item, index) {
                            if (commonParameters.hasOwnProperty(index) && item) {
                                tmpCommonParams = {};
                                tmpCommonParams.name = index;
                                tmpCommonParams.value = $scope.params.action === "modify" ? detailParams[i].value : item.Default;
                                tmpCommonParams.type = item.Type;
                                tmpCommonParams.description = item.Description;
                                tmpCommonParams.needInput = checkIsNeedInput(tmpCommonParams.value);
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
                                if ($scope.params.action === "modify") {
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
                                o++;
                            }
                            if ("GM::VmTemplate" === item.Type) {
                                if (!item.Properties) {
                                    return;
                                }
                                if ($scope.params.action === "modify") {
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
                                    tmpResource.ameId = index;
                                }

                                vmTemplates.push(tmpResource);
                                vmNameMap[index] = tmpResource.name;
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
                                                if ($scope.params.action === "modify") {
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
                                                if ($scope.params.action === "modify") {
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
                                            if ($scope.params.action === "modify") {
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

                        if ($scope.confVlbVmTemplates.data.length === 0) {
                            $scope.service.step.values = [ i18n.common_term_location_label, i18n.vm_term_chooseNet_label, i18n.app_term_setAppPara_button, i18n.common_term_basicInfo_label, i18n.common_term_confirmInfo_label];
                        }
                    }
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

                function queryServiceDetail () {
                    if ($scope.params.serviceId === null || $scope.params.serviceId === "") {
                        return ;
                    }
                    var retDefer = $.Deferred();
                    var options = {
                        "user": user,
                        "id": $scope.params.serviceId
                    };
                    var deferred = catalogServiceImpl.queryServiceOffering(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        $scope.detail.serviceDetail = data;
                        $scope.detail.param = JSON.parse(data.params);
                        $scope.params.appData = JSON.parse($.base64.decode($scope.detail.param.appData, true));
                        $scope.params.cloudInfraId = $scope.detail.param.cloudInfraId;
                        $scope.params.selVpcId = $scope.detail.param.vpcId;
                        $scope.params.appTemplateId = $scope.detail.param.templateId;
                        $scope.params.approvalType = $scope.detail.serviceDetail.approveType;
                        $scope.lock.vpcLock = $scope.detail.param.lock.vpcLock;
                        $scope.lock.locationLock = $scope.detail.param.lock.locationLock;

                        retDefer.resolve();
                    });
                    return retDefer.promise();
                }

                function initBasic() {
                    if ($scope.params.action !== "modify") {
                        return;
                    }
                    var lock = $scope.detail.param.lock;
                    var locationLock = lock.locationLock;
                    var vpcLock = lock.vpcLock;

                    $("#" + $scope.info.locationLock.id).widget().opChecked(locationLock, true);
                    $("#" + $scope.info.vpcLock.id).widget().opChecked(vpcLock, true);

                    if ($scope.params.approvalType === "none") {
                        $("#" + $scope.info.locationLock.id).widget().opDisabled("2",true);
                        $("#" + $scope.info.vpcLock.id).widget().opDisabled("2", true);
                    }

                    if (locationLock !== "0") {
                        if (locationLock === "2") {
                            $("#" + $scope.info.vpcLock.id).widget().opDisabled("1", true);
                            $("#" + $scope.info.vpcLock.id).widget().opDisabled("2", true);
                        }

                        $("#" + $scope.info.vpcLock.id).widget().opDisabled("0", true);

                        $scope.info.location.disable = true;
                    }

                    if (vpcLock !== "0") {
                        $scope.info.vpc.disable = true;
                    }
                }

                function initApprovalType() {
                    if (!$scope.params.approvalType) {
                        return;
                    }
                    $scope.params.approvalTypeName = $scope.params.approvalType === "none" ? i18n.service_term_approveNotRequire_label : i18n.service_term_approveByVDCadmin_label;

                }

                function init() {
                    var deferred = queryServiceDetail();
                    $.when(deferred).done(function(){
                        initApprovalType();
                        initBasic();
                        getLocations();
                        queryServiceTemplateContent();
                    });
                }

                init();
            }
        ];
        return ctrl;
    });
