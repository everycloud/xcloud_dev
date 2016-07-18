/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/services/messageService",
    "app/business/template/services/templateService"
], function ($, angular, _, messageService, templateService) {
    "use strict";
    var ctrl = ["$scope", "monkey", "$compile", "camel", "$stateParams", "$q",
        function ($scope, monkey, $compile, camel, $stateParams, $q) {
            var i18n = $scope.i18n;
            var action = $stateParams.action;
            var exception = $("#createPackage").scope.exception;
            var templateServiceIns = new templateService(exception, $q, camel);
            $scope.action = action;
            $scope.info = {
                name: {
                    label: i18n.common_term_name_label + ":"
                },
                picture: {
                    "id": "create-script-img",
                    label: i18n.common_term_icon_label + ":",
                    value: ""
                },
                OSType: {
                    label: i18n.template_term_suitOS_label + ":"
                },
                softwareType: {
                    label: i18n.common_term_softwareType_label + ":"
                },
                desc: {
                    label: i18n.common_term_desc_label + ":"
                },
                packageFile: {
                    label: i18n.template_term_softwareFile_label + ":"
                },
                version: {
                    label: i18n.common_term_version_label + ":"
                },
                filePath: {
                    label: i18n.common_term_fileTargetPath_label + ":"
                },
                installCmd: {
                    label: i18n.common_term_installCmd_label + ":"
                },
                unInstallCmd: {
                    label: i18n.common_term_uninstallCmd_label + ":"
                },
                startCmd: {
                    label: i18n.common_term_startupCmd_label + ":"
                },
                stopCmd: {
                    label: i18n.common_term_StopCmd_label + ":"
                },
                attachmentFile: {
                    label: i18n.common_term_attachment_label + ":"
                },
                preBtn: {
                    "id": "create-package-step3-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        monkey.show = {
                            "basic": false,
                            "commandConfig": true,
                            "confirm": false,
                            "uploadFile": false
                        };
                        $("#" + $scope.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-package-step3-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        // 触发事件
                        $scope.$emit($scope.addPackageEvents.confirmed, $scope.service);
                        monkey.show = {
                            "basic": false,
                            "commandConfig": false,
                            "confirm": false,
                            "uploadFile": true
                        };
                        $("#" + $scope.step.id).widget().next();
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
                        if (!isEmpty($scope.service.attachmentMap)) {
                            // 触发事件
                            $scope.$emit($scope.addPackageEvents.confirmed, $scope.service);
                            return;
                        }
                        var params = JSON.stringify({
                            "name": $scope.service.name,
                            "osType": $scope.service.OSType,
                            "fileType": $scope.service.softwareType,
                            "description": $scope.service.desc,
                            "mainFilePath": $scope.service.mainFilePath,
                            "version": $scope.service.version,
                            "range": $scope.service.range,
                            "picture": $scope.service.icon,
                            "installCommand": $.base64.encode($scope.service.installCmd, true),
                            "unInstallCommand": $.base64.encode($scope.service.unInstallCmd, true),
                            "startCommand": $.base64.encode($scope.service.startCmd, true),
                            "stopCommand": $.base64.encode($scope.service.stopCmd, true),
                            "destinationPath": $scope.service.filePath,
                            "addedFilePaths": $scope.service.addedFilePaths,
                            "removedFilePaths": $scope.service.removedFilePaths
                        });
                        var user = $("html").scope().user;
                        var options = {
                            "user": user,
                            "cloudInfraId": $stateParams.cloudInfraId,
                            "id": $stateParams.id,
                            "params": params
                        };
                        var promise = templateServiceIns.updateSoftPackage(options);
                        promise.then(function (data) {
                            $scope.close();
                        });
                    }
                }
            };

            /*
             * 检测对象是否是空对象(不包含任何可读属性)。
             * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)。
             */
            function isEmpty(obj) {
                var retValue = true;
                _.each(obj, function (item) {
                    retValue = false;
                });
                return retValue;
            }

            //关闭当前窗口
            $scope.destroy = function () {
                $scope.close();
            };


        }
    ];
    return ctrl;
});
