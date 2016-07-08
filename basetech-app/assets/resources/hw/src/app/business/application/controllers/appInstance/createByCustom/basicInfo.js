/**
 * Created on 14-3-3.
 */
define(['tiny-lib/jquery',
        "tiny-lib/angular",
        'app/services/validatorService',
        "app/business/application/controllers/constants",
        "tiny-common/UnifyValid",
        "app/services/cloudInfraService",
        "app/business/application/services/appCommonService",
        "tiny-lib/underscore",
        'fixtures/appFixture'
    ],
    function ($, angular, validatorService, constants, UnifyValid, cloudInfraService, appCommonService, _) {
        "use strict";

        var ctrl = ["$scope", "camel", "$state", "$stateParams", "$q", "exception",
            function ($scope, camel, $state, $stateParams, $q, exception) {
                $scope.params.fromFlag = $stateParams.fromFlag;
                $scope.params.appId = $stateParams.appId;
                $scope.service.isModify = ($scope.params.appId && ($scope.params.appId !== ""));
                $scope.params.cloudInfraId = $stateParams.cloudInfraId;
                $scope.params.selVpcId = $stateParams.selVpcId;

                var validator = new validatorService();
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n;

                $scope.info = {
                    name: {
                        label: i18n.common_term_name_label+":",
                        "width": "150",
                        require: true,
                        "id": "customAppName",
                        "validate": "regularCheck(" + validator.appNameReg + "):" + i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256") + ";"
                    },
                    "logo": {
                        "label": i18n.common_term_icon_label+":",
                        "require": false,
                        "curLogo": "buff01.jpg",
                        "options": ["buff01.jpg", "buff02.jpg", "buff03.jpg", "buff04.jpg", "buff05.jpg", "buff06.jpg", "buff07.jpg", "buff08.jpg", "buff09.jpg"],
                        "showOptions": false,
                        "change": function () {
                            $scope.info.logo.showOptions = !$scope.info.logo.showOptions;
                            $("#customAppLogoOptionId2").toggle();
                        },
                        "changeLogo": function (logo) {
                            if (logo) {
                                $scope.params.curLogo = logo;
                                $("#customAppLogoOptionId2").hide();
                            }
                        }
                    },
                    location: {
                        label: i18n.common_term_section_label+":",
                        require: true,
                        "id": "customAppLocation",
                        "width": "150",
                        "validate": "required:"+i18n.common_term_null_valid+";",
                        "values": [],
                        "change": function () {
                            $("#" + $scope.info.vpc.id).widget().opChecked();
                            var resPoolId = $("#" + $scope.info.location.id).widget().getSelectedId();
                            if (!resPoolId) {
                                return;
                            }
                            getVPCList(resPoolId);
                        }
                    },
                    "vpc": {
                        label: "VPC:",
                        require: true,
                        "id": "customApp-chooseVpc",
                        "width": "149",
                        'validate': "required:"+i18n.common_term_null_valid+";",
                        "values": [],
                        "change": function () {
                            $scope.params.selVpcId = $("#customApp-chooseVpc").widget().getSelectedId();
                        }
                    },
                    "tag": {
                        "id": "customAppTag",
                        "label": i18n.cloud_term_tag_label + ":",
                        "width": "214",
                        "require": false,
                        "value": "",
                        "validate": "maxSize(64):" + i18n.sprintf(i18n.common_term_length_valid, "0", "64") + ";"
                    },
                    description: {
                        label: i18n.common_term_desc_label+":",
                        require: false,
                        "id": "customAppDescription",
                        "value": "",
                        "type": "multi",
                        "width": "225",
                        "height": "100",
                        "validate": "maxSize(1024):"+i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                    },
                    nextBtn: {
                        "label": "",
                        "require": false,
                        "id": "customAppNext",
                        "text": i18n.common_term_next_button,
                        "tooltip": "",
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#customAppBaseInfo"));
                            if (!valid) {
                                return;
                            }
                            $scope.service.show = {
                                "baseInfo": false,
                                "associateVM": true,
                                "confirm": false
                            };

                            $scope.params.name = $("#customAppName").widget().getValue();
                            $scope.params.appTag = $("#customAppTag").widget().getValue();
                            $scope.params.location = $("#customAppLocation").widget().getSelectedLabel();
                            $scope.params.locationId = $("#customAppLocation").widget().getSelectedId();
                            $scope.params.description = $("#customAppDescription").widget().getValue();
                            $scope.params.selVpcId = $("#customApp-chooseVpc").widget().getSelectedId();
                            $("#createByCustom-app-step").widget().next();
                        }
                    },
                    cancelBtn: {
                        "id": "customAppCancel",
                        "text": i18n.common_term_cancle_button,
                        "tooltip": "",
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
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        if (!data.cloudInfras) {
                            return;
                        }

                        if ($scope.service.isModify) {
                            _.each(data.cloudInfras, function (item, index) {
                                if ($scope.params.locationId === item.selectId) {
                                    item.checked = true;
                                } else {
                                    item.checked = false;
                                }
                            });
                            $scope.info.location.values = data.cloudInfras;
                            getVPCList($scope.params.locationId);
                        } else {
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
                        "start": 0,
                        "limit": 100
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

                function queryAppBasicInfo() {
                    var options = {
                        "user": user,
                        "id": $scope.params.appId,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "vpcId": $scope.params.selVpcId
                    };
                    var deferred = appCommonServiceIns.queryAppBasicInfoResource(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        $scope.params.name = data.appName;
                        $scope.params.appTag = data.appTag;
                        var logoes = data.picture.split("/") || {};
                        $scope.params.curLogo = logoes[logoes.length - 1] || "";
                        $scope.params.locationId = $scope.params.cloudInfraId;
                        $scope.params.selVpcId = data.vpcId;
                        $scope.params.description = data.desc;
                        if (data.vms) {
                            var appVmTableData = [];
                            var tmpVaTableData = null;
                            _.each(data.vms, function (item, index) {
                                tmpVaTableData = {};
                                tmpVaTableData.name = item.name;
                                tmpVaTableData.vmId = item.instanceId;
                                tmpVaTableData.id = item.rid;
                                tmpVaTableData.ip = item.ip;
                                tmpVaTableData.vpc = item.vpc;
                                tmpVaTableData.startOrder = item.startOrder;
                                tmpVaTableData.opt = "";
                                appVmTableData.push(tmpVaTableData);
                                $scope.params.beforeModVmData[item.rid] = tmpVaTableData;
                            });
                            $scope.params.vmTableData = appVmTableData;
                        }
                        getLocations();
                    });
                }

                $("#createByTemplateContentId2").click(function (e) {
                    var target = e.target;
                    if (!target) {
                        return false;
                    }

                    if (!$(target).hasClass("customHide")) {
                        $("#customAppLogoOptionId2").hide();
                    }
                });

                if (!$scope.service.isModify) {
                    getLocations();
                } else {
                    queryAppBasicInfo();
                }
            }
        ];

        return ctrl;
    });
