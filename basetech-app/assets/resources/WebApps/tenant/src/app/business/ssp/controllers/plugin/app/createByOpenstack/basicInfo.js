/**
 * Created on 14-2-27.
 */
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    'app/services/cloudInfraService',
    'app/services/messageService',
    'tiny-lib/underscore',
    "app/business/ssp/controllers/plugin/app/constants",
    "app/business/ssp/services/plugin/app/desigerService",
    "app/business/ssp/services/plugin/app/appCommonService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/catalog/createService",
    "fixtures/appFixture"
], function ($, angular,Window, validatorService, UnifyValid, cloudInfraService, messageService, _, constants, desigerService, appCommonService,catalogService,createService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$state", "$q", "exception","$stateParams",
        function ($scope, camel, $state, $q, exception, $stateParams) {
            var validator = new validatorService();
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var messageServiceIns = new messageService();
            var user = $("html").scope().user;
            var i18n = $("html").scope().i18n;
            var desigerServiceIns = new desigerService(exception, $q, camel);
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var catalogServiceImpl = new catalogService(exception, $q, camel);
            var createServiceIns = new createService(exception, $q, camel);

            var appTemplateId = $stateParams.appTemplateId;
            $scope.params.appTemplateId = appTemplateId;
            $scope.params.templateId = $stateParams.templateId;
            $scope.params.serviceId = $stateParams.serviceId;
            $scope.action = $stateParams.action;
            $scope.params.approvalType = $stateParams.approvalType;

            $scope.info = {
                "name": {
                    "id": "createApp-appName",
                    "label": i18n.common_term_name_label+":",
                    "width": "214",
                    "require": true,
                    "value": "",
                    "validate": "regularCheck(" + validator.name + "):" + i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                },
                directory: {
                    "id": "createDirectory",
                    label: i18n.service_term_catalog_label + ":",
                    "mode": "multiple",
                    "require": false,
                    "width": 200,
                    values: []
                },
                "logo": {
                    "label": i18n.common_term_icon_label,
                    "require": true,
                    "curLogo": "",
                    "switchIcon": function (icon) {
                        $scope.params.iconId = icon.id;
                        $scope.info.logo.curLogo = icon.imageUrl;
                    },
                    "deleteIcon": function (icon, index) {
                        deleteIcon(icon.id, index);
                    },
                    "toggle": function ($event) {
                        $event.stopPropagation();
                        $(".dropdown-menu").toggle();
                    },
                    "upload": function () {
                        var uploadImgWindow = new Window({
                            "winId": "uploadImgWindow",
                            "title": i18n.common_term_uploadLocalPic_button,
                            "minimizable": false,
                            "maximizable": false,
                            "content-type": "url",
                            "i18n": $scope.i18n,
                            "callback": function (icon) {
                                $scope.$apply(function () {
                                    $scope.params.iconId = icon.id;
                                    $scope.info.logo.curLogo = icon.imageUrl;
                                    $scope.icons.unshift(icon);
                                });
                            },
                            "content": "../src/app/business/ssp/views/catalog/iconUpload.html",
                            "height": 300,
                            "width": 530,
                            "buttons": null
                        }).show();
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
                    "validate": "maxSize(1024):"+i18n.common_term_length_valid+"。"
                },

                "preBtn": {
                    "id": "createApp-baseInfo-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        if ($scope.action === "modify") {
                            $state.go("ssp.catalog");
                        } else {
                            $state.go("ssp.createApp", {"templateId" : $scope.params.templateId, "approvalType" : $scope.params.approvalType});
                        }
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
                            "basicInfo": false,
                            "configParam": true,
                            "confirmByTemplate": false
                        };

                        $scope.params.appName = $("#createApp-appName").widget().getValue();
                        $scope.params.curLogo = $scope.info.logo.curLogo;
                        $scope.params.catalogs = $("#createDirectory").widget().getSelectedLabel();

                        $scope.params.selDescription = $("#createApp-appDescription").widget().getValue();
                        $scope.$emit($scope.events.selBaseInfoNext);
                        $("#createByOpenstack-app-step").widget().next();
                    }
                },
                "cancelBtn": {
                    "id": "createApp-baseInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("ssp.catalog");
                    }
                }
            };

            function deleteIcon(iconId, index) {
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId,
                    "iconId": iconId
                };
                var deferred = createServiceIns.deleteIcon(options);
                deferred.then(function (data) {
                    $scope.icons.splice(index, 1);
                    if ($scope.icons.length) {
                        $scope.info.logo.switchIcon($scope.icons[0]);
                    }
                });
            }


            function queryServiceTemplateContent() {
                $scope.info.nextBtn.disable = false;
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
                        messageServiceIns.errorMsgBox("10004",i18n.common_term_innerError_label);
                        return;
                    }

                    var jsonObj = null;
                    try {
                        jsonObj = JSON.parse($.base64.decode(jsonBody, true));
                    } catch (e) {
                        messageServiceIns.errorMsgBox("10004",i18n.common_term_innerError_label);
                        return;
                    }
                    $scope.params.appTempBodyObj = jsonObj;

                    parseAppTemplate(jsonObj);

                    $scope.info.nextBtn.disable = false;
                    $scope.params.appTempBody = jsonObj;
                });
            }

            function parseAppTemplate(jsonObj) {
                //公共参数
                var parameterMap = {};
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
                    tmpData.selectId = tmpData["default"];

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
                    tmpData.rType = "unknown";
                    tmpTableData.push(tmpData);
                });

                $scope.commonParams.allData = tmpTableData;
                if ($scope.action === "modify") {
                    $scope.commonParams.allData = $scope.params.appData.commonParams.allData;
                }
            }

            $(document).bind("click.upload", function ($event) {
                $event.stopPropagation();
                var $target = $($event.target);
                if (!$target.hasClass("dropdown-menu") && !$target.parents(".dropdown-menu").length) {
                    $(".dropdown-menu").hide();
                }
            });
            $scope.$on('$destroy', function () {
                $(document).unbind("click.upload");
            });

            function queryCatalogs() {
                var options = {
                    "user": user
                };
                var deferred = catalogServiceImpl.queryCatalogs(options);
                deferred.then(function (data) {
                    if (!data || !data.catalogs) {
                        return false;
                    }
                    _.each(data.catalogs, function (item) {
                        _.extend(item, {
                            "selectId": item.id,
                            "label": item.name
                        });

                        if ($scope.action === "modify") {
                            var catalogs = $scope.detail.serviceDetail.catalogs;
                            _.each(catalogs, function(catalogId){
                                if (item.id === catalogId) {
                                    _.extend(item, {"checked" : true});
                                }
                            });
                        }
                    });

                    $scope.info.directory.values = data.catalogs;

                    $scope.info.nextBtn.disable = false;
                });
            }

            function queryServiceDetail () {
                if ($scope.action !== "modify") {

                    return {};
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
                    $scope.params.selResPoolId = $scope.detail.param.cloudInfraId;
                    $scope.params.selVpcId = $scope.detail.param.vpcId;
                    $scope.params.appTemplateId = $scope.detail.param.templateId;
                    $scope.params.approvalType = $scope.detail.serviceDetail.approveType;

                    retDefer.resolve();
                });
                return retDefer.promise();
            }

            function queryIcons(serviceImageUrl) {
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId
                };
                var deferred = createServiceIns.queryIcons(options);
                deferred.then(function (data) {
                    data = data || {serviceiconlist: []};
                    var list = data.serviceiconlist;
                    $scope.icons = list;
                    if (list.length) {
                        var icon = list[0];
                        if (serviceImageUrl) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                if (list[i].imageUrl === serviceImageUrl) {
                                    icon = list[i];
                                    break;
                                }
                            }
                        }
                        $scope.info.logo.curLogo = icon.imageUrl;
                        $scope.params.iconId = icon.id;
                    }
                });
            }

            function init() {
                var deferred = queryServiceDetail();
                $.when(deferred).done(function(){
                    queryCatalogs();
                    queryServiceTemplateContent();

                    if ($scope.action === "modify") {
                        $scope.info.name.value = $scope.detail.serviceDetail.name;
                        $scope.params.appName = $scope.detail.serviceDetail.name;
                        $scope.params.isModify = true;
                        $scope.info.description.value = $scope.detail.serviceDetail.description;
                        queryIcons($scope.detail.serviceDetail.serviceImageUrl);
                    } else {
                        queryIcons("");
                    }
                });
            }

            init();

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
