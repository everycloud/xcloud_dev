/* global define */
define([
        'tiny-lib/jquery',
        "tiny-lib/jquery.base64",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        "app/services/httpService",
        "app/services/messageService",
        "app/business/template/services/templateService",
        "fixtures/tenantTemplateFixture"
    ],
    function ($, $jBase, angular, _, Window, http, messageService, templateService) {
        "use strict";

        var packageDetailCtrl = ["$scope", "camel", "$q",
            function ($scope, camel, $q) {
                var i18n = $scope.i18n;
                var exception = $(".package-detail").scope.exception;
                var templateServiceIns = new templateService(exception, $q, camel);
                $scope.packageDetail = {};
                $scope.fileSize = {
                    label: i18n.common_term_sizeMB_label+":",
                    require: false,
                    "value":""
                };
                $scope.picture = {
                    "label": i18n.common_term_icon_label + ":"
                };
                $scope.fileName = {
                    "label": i18n.template_term_softwareFile_label + ":",
                    "textBoxId": "packageFileNameId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.fileName.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#packageFileNameId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.packageDetail.file = $("#packageFileNameId").widget().getValue();
                        $scope.fileName.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.packageDetail.file = $("#packageFileNameId").widget().getValue();
                                $scope.fileName.modifying = false;
                            });
                        }
                    }
                };

                $scope.annexName = {
                    "label": "附件文件:",
                    "textBoxId": "packageAnnexNameId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.annexName.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#packageAnnexNameId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.packageDetail.file = $("#packageAnnexNameId").widget().getValue();
                        $scope.annexName.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.packageDetail.file = $("#packageAnnexNameId").widget().getValue();
                                $scope.annexName.modifying = false;
                            });
                        }
                    }
                };

                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "textBoxId": "packageDescriptionId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.description.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#packageAnnexNameId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.packageDetail.description = $("#packageDescriptionId").widget().getValue();
                        $scope.description.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.packageDetail.description = $("#packageDescriptionId").widget().getValue();
                                $scope.description.modifying = false;
                            });
                        }
                    }
                };

                $scope.path = {
                    "label": i18n.common_term_fileTargetPath_label + ":",
                    "textBoxId": "packagePathId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.path.modifying = true;
                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#packagePathId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.packageDetail.path = $("#packagePathId").widget().getValue();
                        $scope.path.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.packageDetail.path = $("#packagePathId").widget().getValue();
                                $scope.path.modifying = false;
                            });
                        }
                    }
                };

                $scope.version = {
                    "label": i18n.common_term_version_label + ":"
                };
                $scope.installCommand = {
                    "label": i18n.common_term_installCmd_label + ":",
                    "textBoxId": "packageInstallCommandId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.installCommand.modifying = true;
                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#packageInstallCommandId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.packageDetail.installCommand = $("#packageInstallCommandId").widget().getValue();
                        $scope.installCommand.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.packageDetail.installCommand = $("#packageInstallCommandId").widget().getValue();
                                $scope.installCommand.modifying = false;
                            });
                        }
                    }
                };

                $scope.unInstallCommand = {
                    "label": i18n.common_term_uninstallCmd_label + ":",
                    "textBoxId": "packageUnInstallCommandId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.unInstallCommand.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#packageUnInstallCommandId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.packageDetail.unInstallCommand = $("#packageUnInstallCommandId").widget().getValue();
                        $scope.unInstallCommand.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.packageDetail.unInstallCommand = $("#packageUnInstallCommandId").widget().getValue();
                                $scope.unInstallCommand.modifying = false;
                            });
                        }
                    }
                };

                $scope.startCommand = {
                    "label": i18n.common_term_startupCmd_label + ":",
                    "textBoxId": "packageStartCommandId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.startCommand.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#packageStartCommandId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.packageDetail.startCommand = $("#packageStartCommandId").widget().getValue();
                        $scope.startCommand.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.packageDetail.startCommand = $("#packageStartCommandId").widget().getValue();
                                $scope.startCommand.modifying = false;
                            });
                        }
                    }
                };

                $scope.stopCommand = {
                    "label": i18n.common_term_StopCmd_label + ":",
                    "textBoxId": "packageStopCommandId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.stopCommand.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#packageStopCommandId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.packageDetail.stopCommand = $("#packageStopCommandId").widget().getValue();
                        $scope.stopCommand.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.packageDetail.stopCommand = $("#packageStopCommandId").widget().getValue();
                                $scope.stopCommand.modifying = false;
                            });
                        }
                    }
                };

                //查询软件包详情
                $scope.queryDetail = function (softwareId, cloudInfraId) {
                    var user = $("html").scope().user;
                    var options = {
                        "user": user,
                        "softwareid": softwareId,
                        "cloudInfraId": cloudInfraId
                    };
                    var promise = templateServiceIns.querySoftwarePackageById(options);
                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var installCommand = data.installCommand;
                        data.installCommand = $.base64.decode(installCommand || "", true);
                        var unInstallCommand = data.unInstallCommand;
                        data.unInstallCommand = $.base64.decode(unInstallCommand || "", true);
                        var startCommand = data.startCommand;
                        data.startCommand = $.base64.decode(startCommand || "", true);
                        var stopCommand = data.stopCommand;
                        data.stopCommand = $.base64.decode(stopCommand || "", true);
                        $scope.packageDetail = data;
                        var attachmentPaths = [];

                        _.each(data.attachmentPaths, function (item) {
                            attachmentPaths.push(item.fileName);
                        });
                        $scope.packageDetail.attachmentPaths = attachmentPaths;
                    });
                };
            }
        ];

        var packageDetailModel = angular.module("template.package.detail", ["ng", "wcc"]);
        packageDetailModel.controller("template.package.detail.ctrl", packageDetailCtrl);
        packageDetailModel.service("camel", http);

        return packageDetailModel;
    });
