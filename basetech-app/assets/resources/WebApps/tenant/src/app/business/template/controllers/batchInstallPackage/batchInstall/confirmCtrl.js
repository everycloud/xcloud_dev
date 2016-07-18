/* global define */
define([
    "jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/services/messageService",
    "app/business/template/services/templateService"
], function ($, angular, _, messageService, templateService) {
    "use strict";
    var ctrl = ["$rootScope", "$scope", "monkey", "$compile", "camel", "$stateParams", "$q",
        function ($rootScope, $scope, monkey, $compile, camel, $stateParams, $q) {

            $scope.packageDetail = $scope.param;
            var templateServiceIns = new templateService($("#packageList").scope.exception, $q, camel);
            var user = $("html").scope().user;
            var i18n = $scope.i18n;
            $scope.info = {
                name: {
                    "id": "install-package-name",
                    label: i18n.common_term_name_label + ":"
                },
                OSType: {
                    label: i18n.template_term_suitOS_label + ":",
                    "id": "install-package-OSType"
                },
                softwareType: {
                    label: i18n.common_term_softwareType_label + ":",
                    "id": "install-package-softwareType"
                },
                desc: {
                    label: i18n.common_term_desc_label + ":",
                    "id": "install-package-desc"
                },
                version: {
                    label: i18n.common_term_version_label + ":",
                    "id": "install-package-version"
                },
                installCmd: {
                    label: i18n.common_term_installCmd_label + ":",
                    "id": "install-package-installCmd"
                },
                unInstallCmd: {
                    label: i18n.common_term_uninstallCmd_label + ":",
                    "id": "install-package-unInstallCmd"
                },
                startCmd: {
                    label: i18n.common_term_startupCmd_label + ":",
                    "id": "install-package-startCmd"
                },
                stopCmd: {
                    label: i18n.common_term_StopCmd_label + ":",
                    "id": "install-package-stopCmd"
                },
                preBtn: {
                    "id": "create-package-step3-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        monkey.show = {
                            "basic": false,
                            "addVM": true,
                            "confirm": false
                        };
                        $scope.vmTableList.data = [];
                        $("#" + $scope.step.id).widget().pre();
                    }
                },
                cancelBtn: {
                    "id": "create-package-step3-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                },
                saveBtn: {
                    id: "confirmSaveBtnID",
                    disabled: false,
                    iconsClass: "",
                    text: i18n.common_term_complete_label,
                    tip: "",
                    "click": function () {
                        var model = {
                            "installParameters": [],
                            "unInstallParameters": [],
                            "startParameters": [],
                            "stopParameters": []
                        };

                        _.each($scope.param.installCommand, function (item) {
                            model.installParameters.push({
                                "key": item.name,
                                "value": item.value
                            });
                        });

                        _.each($scope.param.unInstallCommand, function (item) {
                            model.unInstallParameters.push({
                                "key": item.name,
                                "value": item.value
                            });
                        });

                        _.each($scope.param.startCommand, function (item) {
                            model.startParameters.push({
                                "key": item.name,
                                "value": item.value
                            });
                        });

                        _.each($scope.param.stopCommand, function (item) {
                            model.stopParameters.push({
                                "key": item.name,
                                "value": item.value
                            });
                        });

                        var deferred = templateServiceIns.installPackages({
                            "user": user,
                            "id": $scope.id,
                            "cloudInfraId": $scope.cloudInfraId,
                            "vmIds": $scope.param.vmIds,
                            "stopParameters": model.stopParameters,
                            "startParameters": model.startParameters,
                            "unInstallParameters": model.unInstallParameters,
                            "installParameters": model.installParameters
                        });
                        deferred.then(function (data) {
                            $scope.close();
                        });

                    }
                }
            };

            $scope.vmTableList = {
                "id": "alarm-list-table",
                "enablePagination":false,
                "columns": [{
                        "sTitle": i18n.vm_term_vmName_label,
                        "mData": "name",
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.template_term_belongsToApp_label,
                        "mData": "appName",
                        "sWidth": "10%",
                        "bSortable": true
                    }, {
                        "sTitle": i18n.vpc_term_vpcName_label,
                        "mData": "vpcId",
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_vmID_label,
                        "mData": "id",
                        "sWidth": "10%",
                        "bSortable": false
                    }
                ],
                "data": null
            };

            //初始化虚拟机列表数据
            $rootScope.showSelVM = function () {
                $scope.vmTableList.data = $scope.vms;
            };

        }
    ];
    return ctrl;
});
