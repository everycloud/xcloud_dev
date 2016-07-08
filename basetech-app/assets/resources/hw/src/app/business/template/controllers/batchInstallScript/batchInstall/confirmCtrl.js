/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/template/services/templateService"
], function ($, angular, _, templateService) {
    "use strict";
    var ctrl = ["$rootScope", "$scope", "monkey", "$compile", "camel", "$stateParams", "$q",
        function ($rootScope, $scope, monkey, $compile, camel, $stateParams, $q) {
            var i18n = $scope.i18n;
            $scope.scriptDetail = $scope.param;
            var templateServiceIns = new templateService($("#scriptList").scope.exception, $q, camel);
            var user = $("html").scope().user;
            $scope.info = {
                name: {
                    "id": "install-script-name",
                    label: i18n.common_term_name_label + ":"
                },
                OSType: {
                    label: "适应操作系统:",
                    "id": "install-script-OSType"
                },
                desc: {
                    label: i18n.common_term_desc_label + ":",
                    "id": "install-script-desc"
                },
                version: {
                    label: i18n.common_term_version_label + ":",
                    "id": "install-script-version"
                },
                installCmd: {
                    label: i18n.common_term_runCmd_label + ":",
                    "id": "install-script-installCmd"
                },
                preBtn: {
                    "id": "create-script-step3-pre",
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
                    "id": "create-script-step3-cancel",
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
                            "installParameters": []
                        };

                        _.each($scope.param.installCommand, function (item) {
                            model.installParameters.push({
                                "key": item.name,
                                "value": item.value
                            });
                        });

                        var deferred = templateServiceIns.installScripts({
                            "user": user,
                            "id": $scope.id,
                            "cloudInfraId": $scope.cloudInfraId,
                            "vmIds": $scope.param.vmIds,
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
                }],
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
