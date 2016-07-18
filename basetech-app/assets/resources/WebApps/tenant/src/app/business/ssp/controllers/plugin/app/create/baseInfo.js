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
        "app/business/ssp/controllers/plugin/app/constants",
        "app/business/ssp/services/plugin/app/appCommonService",
        "app/business/ssp/services/plugin/app/desigerService",
        "app/business/ssp/services/catalog/catalogService",
        "app/business/ssp/services/catalog/createService",
        'tiny-lib/underscore',
        "fixtures/appFixture"
    ],
    function ($, angular,Window, validatorService, UnifyValid, cloudInfraService, messageService, constants, appCommonService, desigerService, catalogService,createService, _) {
        "use strict";

        var ctrl = ["$scope", "camel", "$state", "$q", "exception","$stateParams",
            function ($scope, camel, $state, $q, exception,$stateParams ) {
                var validator = new validatorService();
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var messageServiceIns = new messageService();
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                var desigerServiceIns = new desigerService(exception, $q, camel);
                var catalogServiceImpl = new catalogService(exception, $q, camel);
                var createServiceIns = new createService(exception, $q, camel);

                $scope.service.icon = null;

                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n;
                var appTemplateId = $stateParams.appTemplateId;

                $scope.info = {
                    "name": {
                        "id": "createApp-appName",
                        "label": i18n.common_term_name_label + ":",
                        "width": 200,
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
                            if ($scope.confVlbVmTemplates.data.length > 0) {
                                $scope.service.show = {
                                    "basicInfo": false,
                                    "chooseNetwork": false,
                                    "configApp": false,
                                    "configVlb" : true,
                                    "baseInfo" : false,
                                    "confirmByTemplate": false
                                };
                            } else {
                                $scope.service.show = {
                                    "basicInfo": false,
                                    "chooseNetwork": false,
                                    "configApp": true,
                                    "configVlb" : false,
                                    "baseInfo" : false,
                                    "confirmByTemplate": false
                                };
                            }

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
                            $scope.service.show = {
                                "chooseTemplate": false,
                                "basicInfo": false,
                                "chooseNetwork": false,
                                "configApp": false,
                                "baseInfo" : false,
                                "confirmByTemplate": true
                            };

                            $scope.params.appName = $("#createApp-appName").widget().getValue();
                            $scope.params.description = $("#createApp-appDescription").widget().getValue();
                            $scope.params.curLogo = $scope.info.logo.curLogo;
                            $scope.params.catalogs = $("#createDirectory").widget().getSelectedLabel();
//                            $scope.params.iconId =
                            $scope.$emit($scope.events.selConfirm);
                            $("#createByTemplate-app-step").widget().next();
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
                        if (!data) {
                            return false;
                        }
                        if (data.catalogs && data.catalogs.length > 0) {
                            _.each(data.catalogs, function (item) {
                                _.extend(item, {
                                    "selectId": item.id,
                                    "label": item.name
                                });

                                if ($scope.params.action === "modify") {
                                    var catalogs = $scope.detail.serviceDetail.catalogs;
                                    _.each(catalogs, function(catalogId){
                                        if (item.id === catalogId) {
                                            _.extend(item, {"checked" : true});
                                        }
                                    });
                                }
                            });

                            $scope.info.directory.values = data.catalogs;
                        }

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
                    queryCatalogs();
                    if ($scope.params.action === "modify") {
                        queryIcons($scope.detail.serviceDetail.serviceImageUrl);
                    } else {
                        queryIcons("");
                    }

                    if ($scope.params.action === "modify") {
                        $scope.params.appName= $scope.detail.serviceDetail.name;
                        $scope.info.name.value = $scope.detail.serviceDetail.name;
                        $scope.info.description.value = $scope.detail.serviceDetail.description;
                        $scope.params.description = $scope.detail.serviceDetail.description;
                    }
                }

                $scope.$on($scope.events.selVlbParamNextFromParent, function (event, msg) {
                    init();
                });
            }
        ];
        return ctrl;
    });
