/*global define*/
define([
    'tiny-lib/jquery',
    "tiny-lib/jquery.base64",
    "tiny-lib/angular",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    'app/services/cloudInfraService',
    'app/services/messageService',
    "app/business/application/controllers/constants",
    'app/business/application/services/appCommonService',
    'app/business/application/services/desiger/desigerService',
    'tiny-lib/underscore',
    "fixtures/appFixture"
], function ($, $jBase, angular, validatorService, UnifyValid, cloudInfraService, messageService, constants, appCommonService, desigerService, _) {
    "use strict";

    var ctrl = ["$scope", "camel", "$state", "$q", "exception",
        function ($scope, camel, $state, $q, exception) {
            var validator = new validatorService();
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var messageServiceIns = new messageService();
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var desigerServiceIns = new desigerService(exception, $q, camel);
            var user = $scope.user;
            var i18n = $scope.i18n;
            $scope.info = {
                "name": {
                    "id": "createApp-appName",
                    "label": i18n.common_term_name_label + ":",
                    "width": "214",
                    "require": true,
                    "value": "",
                    "validate": "regularCheck(" + validator.appNameReg + "):" + i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256") + ";"
                },

                "location": {
                    label: i18n.common_term_section_label + ":",
                    require: true,
                    "id": "createApp-chooseLocation",
                    "width": "149",
                    'validate': "required:" + i18n.common_term_null_valid + ";",
                    "change": function () {
                        $("#" + $scope.info.vpc.id).widget().opChecked();
                        var resPoolId = $("#" + $scope.info.location.id).widget().getSelectedId();
                        if (!resPoolId) {
                            return;
                        }
                        getVPCList(resPoolId);
                    },
                    "values": []
                },

                "vpc": {
                    label: "VPC:",
                    require: true,
                    "id": "createApp-chooseVpc",
                    "width": "149",
                    'validate': "required:" + i18n.common_term_null_valid + ";",
                    "values": []
                },

                "logo": {
                    "label": i18n.common_term_icon_label + ":",
                    "require": true,
                    "curLogo": "../theme/default/images/appLogo/buff1.jpg",
                    "options": ["buff01.jpg", "buff02.jpg", "buff03.jpg", "buff04.jpg", "buff05.jpg", "buff06.jpg", "buff07.jpg", "buff08.jpg", "buff09.jpg"],
                    "showOptions": false,
                    "change": function () {
                        $("#customAppLogoOptionId").toggle();
                    },
                    "changeLogo": function (logo) {
                        if (logo) {
                            $scope.params.curLogo = logo;
                            $("#customAppLogoOptionId").hide();
                        }
                    },
                    "init": function () {
                        var logoOptions = [];
                        for (var index = 1; index <= 10; index++) {
                            logoOptions.push("../theme/default/images/appLogo/buff" + index + ".jpg");
                        }
                        $scope.info.logo.options = logoOptions;
                    }
                },

                "tag": {
                    "id": "createApp-appTag",
                    "label": i18n.cloud_term_tag_label + ":",
                    "width": "214",
                    "require": false,
                    "value": "",
                    "validate": "maxSize(64):" + i18n.sprintf(i18n.common_term_length_valid, "0", "64") + ";"
                },

                "description": {
                    "id": "createApp-appDescription",
                    "label": i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": "206",
                    "height": "100",
                    "validate": "regularCheck(" + validator.noConstraintMaxLength + "):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                },

                "preBtn": {
                    "id": "createApp-baseInfo-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = {
                            "chooseTemplate": true,
                            "basicInfo": false,
                            "chooseNetwork": false,
                            "configApp": false,
                            "confirmByTemplate": false
                        };
                        $("#createByTemplate-app-step").widget().pre();
                    }
                },
                "nextBtn": {
                    "id": "createApp-baseInfo-nextBtn",
                    "disable": true,
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createAppBaseInfo"));
                        if (!valid) {
                            return;
                        }

                        $scope.params.appName = $.trim($("#createApp-appName").widget().getValue());
                        $scope.params.appTag = $.trim($("#createApp-appTag").widget().getValue());
                        $scope.params.description = $("#createApp-appDescription").widget().getValue();
                        $scope.params.logo = "";
                        $scope.params.cloudInfraId = $("#createApp-chooseLocation").widget().getSelectedId();
                        $scope.params.selVpcName = $("#createApp-chooseVpc").widget().getSelectedLabel();
                        $scope.params.selVpcId = $("#createApp-chooseVpc").widget().getSelectedId();

                        _.each($scope.info.vpc.values,function(item){
                            if(item.selectId === $scope.params.selVpcId){
                                $scope.params.azid = item.azid;
                            }
                        });

                        validateAppName();
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
                var resPoolType = ($scope.params.selServiceTemplate.type === 'FusionManager' ? 'fusionmanager' : 'openstack');
                var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id, resPoolType);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }

                    if (data.cloudInfras) {
                        $scope.info.location.values = data.cloudInfras;
                        if (data.cloudInfras.length > 0) {
                            getVPCList(data.cloudInfras[0].selectId);
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
                    "cloudInfraId": cloudInfraId,
                    "start": 0
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
                            "label": item.name,
                            "azid":item.availableZone[0].id || ""
                        };
                        if ($scope.params.selVpcId) {
                            if ($scope.params.selVpcId === tmpVpc.selectId) {
                                tmpVpc.checked = true;
                                $scope.params.azid = tmpVpc.azid;
                            } else {
                                tmpVpc.checked = false;
                            }
                        } else {
                            if (index === 0) {
                                tmpVpc.checked = true;
                                $scope.params.selVpcId = tmpVpc.selectId;
                                $scope.params.azid = tmpVpc.azid;
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
                    "id": $scope.params.selServiceTemplate.id,
                    "userId": user.id
                };
                var deferred = desigerServiceIns.queryAppTemplate(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    var jsonBody = $.base64.decode(data.body || "", true);
                    if (!jsonBody || "" === jsonBody) {
                        messageServiceIns.errorMsgBox("10004", i18n.common_term_innerError_label);
                        return;
                    }
                    var jsonObj = null;
                    try {
                        jsonObj = JSON.parse(jsonBody);
                    } catch (e) {
                        messageServiceIns.errorMsgBox("10004", i18n.common_term_innerError_label);
                        return;
                    }

                    if ($scope.params.selServiceTemplate.type === 'FusionManager') {
                        parseAppTemplateFm(jsonObj);
                    }

                    if ((typeof data.picture === "undefined") || (null === data.picture) || ("" === data.picture)) {
                        $scope.params.curLogo = $scope.info.logo.options[0];
                    } else {
                        $scope.params.curLogo = data.picture;
                    }
                    $scope.info.nextBtn.disable = false;
                    $scope.params.appTempBody = jsonObj;
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
                    _.each(commonParameters, function (item, index) {
                        if (commonParameters.hasOwnProperty(index) && item) {
                            tmpCommonParams = {};
                            tmpCommonParams.name = index;
                            tmpCommonParams.value = item.Default;
                            tmpCommonParams.type = item.Type;
                            tmpCommonParams.description = item.Description;
                            tmpCommonParams.needInput = checkIsNeedInput(item.Default);
                            commonParamsData.push(tmpCommonParams);
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
                if (jsonObj.Resources) {
                    var resources = jsonObj.Resources;
                    var tmpResource = null;
                    _.each(resources, function (item, index) {
                        if (!item) {
                            return;
                        }
                        if ("GM::Network" === item.Type) {
                            tmpResource = {};
                            tmpResource.name = item.Properties && item.Properties.Name;
                            tmpResource.description = item.Properties && item.Properties.Description;
                            tmpResource.networkId = null;
                            tmpResource.ameId = index;
                            networks.push(tmpResource);
                            ameIdResourceMap[index] = tmpResource;
                        }
                        if ("GM::VmTemplate" === item.Type) {
                            if (!item.Properties) {
                                return;
                            }
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
                            vmTemplates.push(tmpResource);
                            vmNameMap[index] = item.Properties.Name;
                            ameIdResourceMap[index] = tmpResource;

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
                                            softwares.push(tmpSoftware);
                                        }
                                    } else {
                                        tmpSoftware = getShellInfo(item.Properties.Softwares[i], item.Properties.Name);
                                        tmpSoftware.vmTemplateAmeId = index;
                                        tmpSoftware.osType = tmpResource.vmOsType;
                                        if (null !== tmpSoftware) {
                                            shells.push(tmpSoftware);
                                        }
                                    }
                                    tmpSoftware.ameId = item.Properties.Softwares[i].Id;
                                    ameIdResourceMap[item.Properties.Softwares[i].Id] = tmpSoftware;
                                }
                            }

                            tmpVmNicsArray = [];
                            if (item.Properties.Nics && (item.Properties.Nics.length > 0)) {
                                var tmpVlb = null;
                                for (var j = 0; j < item.Properties.Nics.length; j++) {
                                    tmpVlb = getVlbNetwork(item.Properties.Nics[j], item.Properties.Name);
                                    if (tmpVlb) {
                                        //一个虚拟机模板只可能关联一个vlb
                                        tmpVlb.vmTemplateAmeId = index;
                                        tmpVlb.nicIndex = j;
                                        vlbNets.push(tmpVlb);
                                        ameIdVlbNetMap[index] = tmpVlb;
                                    }
                                    tmpVmNicsArray.push(item.Properties.Nics[j].Name);
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

            function validateAppName() {
                var options = {
                    "user": user,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "searchName": $scope.params.appName,
                    "start": 0,
                    "vpcId": $scope.params.selVpcId
                };
                var deferred = appCommonServiceIns.queryAppList(options);
                deferred.then(function (data) {
                    if (!data || !data.appInstances || (data.appInstances.length === 0)) {
                        $scope.service.show = {
                            "chooseTemplate": false,
                            "basicInfo": false,
                            "chooseNetwork": true,
                            "configApp": false,
                            "confirmByTemplate": false
                        };
                        $("#createByTemplate-app-step").widget().next();
                        return;
                    }
                    var appLen = data.appInstances.length;
                    for (var i = 0; i < appLen; i++) {
                        if (!data.appInstances[i]) {
                            continue;
                        }
                        if ($scope.params.appName === data.appInstances[i].appName) {
                            messageServiceIns.errorMsgBox("10004", i18n.app_term_appNameRepeat_valid);
                            return;
                        }
                    }
                    $scope.service.show = {
                        "chooseTemplate": false,
                        "basicInfo": false,
                        "chooseNetwork": true,
                        "configApp": false,
                        "confirmByTemplate": false
                    };
                    $("#createByTemplate-app-step").widget().next();
                });
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

            $("#createByTemplateContentId").click(function (e) {
                var target = e.target;
                if (!target) {
                    return false;
                }
                if (!$(target).hasClass("customHide")) {
                    $("#customAppLogoOptionId").hide();
                }
            });

            function selAppTempNextFromParent(event, msg) {
                getLocations();
                queryServiceTemplateContent();
            }

            selAppTempNextFromParent();
        }
    ];
    return ctrl;
});
