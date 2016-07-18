/* global define */
define([
        'tiny-lib/jquery',
        "tiny-lib/jquery.base64",
        "tiny-lib/angular",
        "tiny-widgets/Window",
        "app/services/httpService",
        "app/business/template/services/templateService",
        "fixtures/tenantTemplateFixture"
    ],
    function ($, $jBase, angular, Window, http, templateService) {
        "use strict";

        var scriptDetailCtrl = ["$scope", "camel", "$q",
            function ($scope, camel, $q) {
                var i18n = $scope.i18n;
                var exception = $(".script-detail").scope.exception;
                var templateServiceIns = new templateService(exception, $q, camel);
                $scope.scriptDetail = {};
                $scope.picture = {
                    "label": i18n.common_term_icon_label + ":"
                };

                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "textBoxId": "scriptDescriptionNameId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.description.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#scriptDescriptionNameId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.scriptDetail.description = $("#scriptDescriptionNameId").widget().getValue();
                        $scope.description.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.scriptDetail.description = $("#scriptDescriptionNameId").widget().getValue();
                                $scope.description.modifying = false;
                            });
                        }
                    }
                };

                $scope.version = {
                    "label": i18n.common_term_version_label + ":"
                };

                $scope.path = {
                    "label": i18n.common_term_fileTargetPath_label + ":",
                    "textBoxId": "scriptPathNameId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.path.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#scriptPathNameId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.scriptDetail.path = $("#scriptPathNameId").widget().getValue();
                        $scope.path.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.scriptDetail.path = $("#scriptPathNameId").widget().getValue();
                                $scope.path.modifying = false;
                            });
                        }
                    }
                };

                $scope.command = {
                    "label": i18n.common_term_runCmd_label + ":",
                    "textBoxId": "scriptCommandNameId",
                    "modifying": false,
                    "clickModify": function () {
                        $scope.command.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#scriptCommandNameId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        $scope.scriptDetail.command = $("#scriptCommandNameId").widget().getValue();
                        $scope.command.modifying = false;
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.$apply(function () {
                                $scope.scriptDetail.command = $("#scriptCommandNameId").widget().getValue();
                                $scope.command.modifying = false;
                            });
                        }
                    }
                };

                //查询脚本详情
                $scope.queryDetail = function (scriptId, cloudInfraId) {
                    var user = $("html").scope().user;
                    var options = {
                        "user": user,
                        "scriptId": scriptId,
                        "cloudInfraId": cloudInfraId
                    };
                    var promise = templateServiceIns.queryScriptById(options);
                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var installCommand = data.installCommand;
                        data.installCommand = $.base64.decode(installCommand || "", true);
                        $scope.scriptDetail = data;
                    });
                };
            }
        ];

        var scriptDetailModel = angular.module("template.script.detail", ["ng", "wcc"]);
        scriptDetailModel.controller("template.script.detail.ctrl", scriptDetailCtrl);
        scriptDetailModel.service("camel", http);

        return scriptDetailModel;
    });
