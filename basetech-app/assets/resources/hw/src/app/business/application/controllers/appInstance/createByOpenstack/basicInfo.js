/**
 * Created on 14-2-27.
 */
define([
    'tiny-lib/jquery',
    "tiny-lib/jquery.base64",
    "tiny-lib/angular",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    'app/services/cloudInfraService',
    'app/services/messageService',
    'tiny-lib/underscore',
    "app/business/application/controllers/constants",
    'app/business/application/services/desiger/desigerService',
    "app/business/application/services/appCommonService",
    "fixtures/appFixture"
], function ($, $jBase, angular, validatorService, UnifyValid, cloudInfraService, messageService, _, constants, desigerService, appCommonService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$state", "$q", "exception",
        function ($scope, camel, $state, $q, exception) {
            var validator = new validatorService();
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var messageServiceIns = new messageService();
            var user = $("html").scope().user;
            var i18n = $("html").scope().i18n;
            var desigerServiceIns = new desigerService(exception, $q, camel);
            var appCommonServiceIns = new appCommonService(exception, $q, camel);

            $scope.info = {
                "name": {
                    "id": "createApp-appName",
                    "label": i18n.common_term_name_label+":",
                    "width": "214",
                    "require": true,
                    "value": "",
                    "tooltip": i18n.common_term_composition6_valid  + i18n.sprintf(i18n.common_term_maxLength_valid, "255"),
                    "validate": "regularCheck(" + validator.appNameForOpenstack + "):" + i18n.common_term_composition6_valid  + ";" +
                        "maxSize(255):" + i18n.sprintf(i18n.common_term_range_valid, "1", "255") + ";"
                },

                "location": {
                    label: i18n.common_term_section_label+":",
                    require: true,
                    "id": "createApp-chooseLocation",
                    "width": "149",
                    'validate': "required:"+i18n.common_term_null_valid+";",
                    "disable": true,
                    "change": function () {
                        $("#" + $scope.info.vpc.id).widget().opChecked();
                        var resPoolId = $("#createApp-chooseLocation").widget().getSelectedId();
                        if (!resPoolId) {
                            return;
                        }
                        getVPCList(resPoolId);
                    },
                    "values": []
                },

                "vpc": {
                    label: i18n.vpc_term_vpc_label+":",
                    require: true,
                    "id": "createApp-chooseVpc",
                    "width": "149",
                    'validate':  "required:"+i18n.common_term_null_valid+";",
                    "values": [],
                    "change": function () {
                        $scope.params.selVpcId = $("#createApp-chooseVpc").widget().getSelectedId();
                    }
                },

                "timeout": {
                    "id": "createApp-timeout",
                    "label": i18n.common_term_timeoutmin_label+":",
                    "width": "214",
                    "require": true,
                    "value": "60",
                    "validate": "required:"+i18n.common_term_null_valid+";integer:"+i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "2147483647")+";maxValue(2147483647):"+i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "2147483647")+";minValue(1):"+i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "2147483647")+";"
                },

                "logo": {
                    "label": i18n.common_term_icon_label+":",
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

                "description": {
                    "id": "createApp-appDescription",
                    "label": i18n.common_term_desc_label+":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": "206",
                    "height": "100",
                    "validate": "maxSize(1024):"+i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                },

                "preBtn": {
                    "id": "createApp-baseInfo-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = {
                            "chooseTemplate": true,
                            "basicInfo": false,
                            "configParam": false,
                            "confirmByTemplate": false
                        };
                        $("#createByOpenstack-app-step").widget().pre();
                    }
                },
                "nextBtn": {
                    "id": "createApp-baseInfo-nextBtn",
                    "disable": false,
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createAppBaseInfo"));
                        if (!valid) {
                            return;
                        }
                        $scope.service.show = {
                            "chooseTemplate": false,
                            "basicInfo": false,
                            "configParam": true,
                            "confirmByTemplate": false
                        };

                        $scope.params.appName = $("#createApp-appName").widget().getValue();
                        $scope.params.timeout = $("#createApp-timeout").widget().getValue();
                        $scope.params.selVpcId = $("#createApp-chooseVpc").widget().getSelectedId();
                        $scope.params.selVpcName = $("#createApp-chooseVpc").widget().getSelectedLabel();
                        $scope.params.selResPoolId = $("#createApp-chooseLocation").widget().getSelectedId();
                        $scope.params.selResPoolName = $("#createApp-chooseLocation").widget().getSelectedLabel();
                        $scope.params.selDescription = $("#createApp-appDescription").widget().getValue();
                        $scope.$emit($scope.events.selBaseInfoNext);
                        $("#createByOpenstack-app-step").widget().next();
                    }
                },
                "cancelBtn": {
                    "id": "createApp-baseInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                            $state.go("application.manager.instance");
                        } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                            $state.go("application.manager.overview");
                        } else {
                            $state.go("application.manager.template");
                        }
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

                    if (!data.cloudInfras) {
                        return;
                    }

                    //修改模式下匹配并选中,如匹配不上则有问题
                    if ($scope.params.isModify) {
                        _.each(data.cloudInfras, function (item, index) {
                            if ($scope.params.selResPoolId && ($scope.params.selResPoolId === item.selectId)) {
                                item.checked = true;
                            } else {
                                item.checked = false;
                            }
                        });
                    } else {
                        if (data.cloudInfras.length > 0) {
                            $scope.params.selResPoolId = data.cloudInfras[0].selectId;
                        }
                    }
                    $scope.info.location.values = data.cloudInfras;
                    if ($scope.params.selResPoolId) {
                        getVPCList($scope.params.selResPoolId);
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
                    "start": 0,
                    "limit": 100
                };
                var deferred = appCommonServiceIns.queryVpcList(options);
                deferred.then(function (data) {
                    if (!data || !data.vpcs) {
                        return;
                    }

                    //清空下拉已选的
                    if (data.vpcs.length <= 0) {
                        $("#createApp-chooseVpc").widget().opChecked();
                        $scope.params.selVpcId = null;
                        $scope.info.vpc.values = [];
                    }

                    //适配下拉框 考虑创建流程,修改,回退再下一步等场景
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
                $scope.info.nextBtn.disable = false;
                var options = {
                    "vdcId": user.vdcId,
                    "id": $scope.params.selServiceTemplate.id,
                    "userId": user.id
                };
                var deferred = desigerServiceIns.queryAppTemplate(options);
                deferred.then(function (data) {
                    $scope.info.location.disable = false;

                    if (!data) {
                        return;
                    }

                    var jsonBody = $.base64.decode(data.body || "", true);
                    if (!jsonBody || "" === jsonBody) {
                        messageServiceIns.errorMsgBox("10004",i18n.common_term_innerError_label);
                        return;
                    }

                    var jsonObj = null;
                    try {
                        jsonObj = JSON.parse(jsonBody);
                    } catch (e) {
                        messageServiceIns.errorMsgBox("10004",i18n.common_term_innerError_label);
                        return;
                    }
                    $scope.params.appTempBodyObj = jsonObj;

                    if (!data.picture || (data.picture === "")) {
                        data.picture = "buff01.jpg";
                    }
                    parseAppTemplate(jsonObj);
                    $scope.params.curLogo = data.picture;
                    $scope.info.nextBtn.disable = false;
                    $scope.params.appTempBody = jsonObj;
                });
            }

            function parseAppTemplate(jsonObj) {
                //公共参数
                var parameterMap = {};
                $scope.params.selDescription = jsonObj.Description;
                var parameters = jsonObj.Parameters;
                var resources = jsonObj.Resources;
                if (!resources) {
                    messageServiceIns.errorMsgBox("10004", i18n.common_term_innerError_label);
                    return;
                }

                //首先依次解析出资源中关于AZ,网络,Image,InstanceType   以MAP形式存 key/value都对应名称
                var azs = {};
                var networks = {};
                var images = {};
                var instanceTypes = {};
                var loadBalancers = {};
                var securityGroups = {};
                var vpcs = [];
                var tmpResource = null;
                _.each(resources, function (item, index) {
                    tmpResource = resources[index];
                    if (!tmpResource) {
                        return;
                    }
                    //NetworkInterface节点
                    if ("AWS::EC2::NetworkInterface" === tmpResource.Type) {
                        if (tmpResource.Properties && tmpResource.Properties.SubnetId && tmpResource.Properties.SubnetId.Ref && (tmpResource.Properties.SubnetId.Ref !== "")) {
                            networks[tmpResource.Properties.SubnetId.Ref] = tmpResource.Properties.SubnetId.Ref;
                        }
                        return;
                    }

                    //Instance节点
                    if ("AWS::EC2::Instance" === tmpResource.Type) {
                        if (!tmpResource.Properties) {
                            return;
                        }
                        if (tmpResource.Properties.AvailabilityZone && tmpResource.Properties.AvailabilityZone.Ref && (tmpResource.Properties.AvailabilityZone.Ref !== "")) {
                            azs[tmpResource.Properties.AvailabilityZone.Ref] = tmpResource.Properties.AvailabilityZone.Ref;
                        }
                        if (tmpResource.Properties.ImageId && tmpResource.Properties.ImageId.Ref && (tmpResource.Properties.ImageId.Ref !== "")) {
                            images[tmpResource.Properties.ImageId.Ref] = tmpResource.Properties.ImageId.Ref;
                        }
                        if (tmpResource.Properties.InstanceType && tmpResource.Properties.InstanceType.Ref && (tmpResource.Properties.InstanceType.Ref !== "")) {
                            instanceTypes[tmpResource.Properties.InstanceType.Ref] = tmpResource.Properties.InstanceType.Ref;
                        }
                        if (tmpResource.Properties.NetworkInterfaces && tmpResource.Properties.NetworkInterfaces.length && (tmpResource.Properties.NetworkInterfaces.length > 0)) {
                            _.each(tmpResource.Properties.NetworkInterfaces, function (item, index) {
                                if (item && item.NetworkInterfaceId && item.NetworkInterfaceId.Ref && (item.NetworkInterfaceId.Ref !== "")) {
                                    networks[item.NetworkInterfaceId.Ref] = item.NetworkInterfaceId.Ref;
                                }
                            });
                        }
                        return;
                    }

                    //Instance节点
                    if ("AWS::AutoScaling::LaunchConfiguration" === tmpResource.Type) {
                        if (!tmpResource.Properties) {
                            return;
                        }
                        if (tmpResource.Properties.ImageId && tmpResource.Properties.ImageId.Ref && (tmpResource.Properties.ImageId.Ref !== "")) {
                            images[tmpResource.Properties.ImageId.Ref] = tmpResource.Properties.ImageId.Ref;
                        }
                        if (tmpResource.Properties.InstanceType && tmpResource.Properties.InstanceType.Ref && (tmpResource.Properties.InstanceType.Ref !== "")) {
                            instanceTypes[tmpResource.Properties.InstanceType.Ref] = tmpResource.Properties.InstanceType.Ref;
                        }
                        if (tmpResource.Properties.SecurityGroups && tmpResource.Properties.SecurityGroups.Ref && (tmpResource.Properties.SecurityGroups.Ref !== "")) {
                            securityGroups[tmpResource.Properties.SecurityGroups.Ref] = tmpResource.Properties.SecurityGroups.Ref;
                        }
                        return;
                    }

                    //AutoScalingGroup节点
                    if ("AWS::AutoScaling::AutoScalingGroup" === tmpResource.Type) {
                        if (!tmpResource.Properties) {
                            return;
                        }
                        if (tmpResource.Properties.AvailabilityZones && tmpResource.Properties.AvailabilityZones.length && (tmpResource.Properties.AvailabilityZones.length > 0)) {
                            _.each(tmpResource.Properties.AvailabilityZones, function (item, index) {
                                if (item && item.Ref && (item.Ref !== "")) {
                                    azs[item.Ref] = item.Ref;
                                }
                            });
                        }
                        if (tmpResource.Properties.VPCZoneIdentifier && tmpResource.Properties.VPCZoneIdentifier.length && (tmpResource.Properties.VPCZoneIdentifier.length > 0)) {
                            _.each(tmpResource.Properties.VPCZoneIdentifier, function (item, index) {
                                if (item && item.Ref && (item.Ref !== "")) {
                                    networks[item.Ref] = item.Ref;
                                }
                            });
                        }
                    }

                    //LoadBalancer节点
                    if ("OS::Neutron::LoadBalancer" === tmpResource.Type) {
                        if (tmpResource.Properties && tmpResource.Properties.pool_id && tmpResource.Properties.pool_id.Ref && (tmpResource.Properties.pool_id.Ref !== "")) {
                            loadBalancers[tmpResource.Properties.pool_id.Ref] = tmpResource.Properties.pool_id.Ref;
                        }
                        return;
                    }
                });

                //逐个将公共变量组合到table的data中 分为几下必种类型az/network/image/instanceType/unknown
                var tmpTableData = [];
                if (!parameters) {
                    return;
                }
                var tmpParameter = null;
                var tmpData = null;
                _.each(parameters, function (item, index) {
                    tmpParameter = parameters[index];
                    if (!tmpParameter) {
                        return;
                    }
                    tmpData = {
                        "rType": null,
                        "type": tmpParameter.Type,
                        "name": index,
                        "default": tmpParameter.Default,
                        "NoEcho": (tmpParameter.NoEcho === "true" ? true : false),
                        "description": tmpParameter.Description,
                        "allowedPattern": tmpParameter.AllowedPattern,
                        "constraintDescription": tmpParameter.ConstraintDescription
                    };
                    //修改模式以应用查回来的默认值为准
                    if ($scope.params.isModify) {
                        if ($scope.params.parameters[index] && ($scope.params.parameters[index] !== "")) {
                            tmpData["default"] = $scope.params.parameters[index];
                        }
                    }
                    if(tmpData.NoEcho && $scope.params.isModify){
                        tmpData.selectId = "";
                    }else{
                        tmpData.selectId = tmpData["default"];
                    }

                    if (azs[index]) {
                        tmpData.rType = "az";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    if (networks[index]) {
                        tmpData.rType = "network";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    if (images[index]) {
                        tmpData.rType = "image";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    if (instanceTypes[index]) {
                        tmpData.rType = "instanceType";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    if (loadBalancers[index]) {
                        tmpData.rType = "loadBalancer";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    if (securityGroups[index]) {
                        tmpData.rType = "securityGroup";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    tmpData.rType = "unknown";
                    tmpTableData.push(tmpData);
                });

                $scope.commonParams.allData = tmpTableData;
            }

            $scope.$on($scope.events.selAppTempNextFromParent, function (event, msg) {
                getLocations();
                queryServiceTemplateContent();
            });

            $("#createByTemplateContentId").click(function (e) {
                var target = e.target;
                if (!target) {
                    return false;
                }

                if (!$(target).hasClass("customHide")) {
                    $("#customAppLogoOptionId").hide();
                }
            });
        }
    ];
    return ctrl;
});
