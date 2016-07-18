/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "app/business/template/services/templateService"
], function ($, angular, templateService) {
    "use strict";
    var ctrl = ["$scope", "monkey", "$compile", "camel", "$stateParams", "$q",
        function ($scope, monkey, $compile, camel, $stateParams, $q) {
            var i18n = $scope.i18n;
            var action = $stateParams.action;
            var exception = $("#createScript").scope.exception;
            var templateServiceIns = new templateService(exception, $q, camel);
            $scope.action = action;
            $scope.info = {
                name: {
                    "id": "create-script-name",
                    label: i18n.common_term_name_label + ":",
                    "width": "214",
                    require: true,
                    value: ""
                },
                picture: {
                    "id": "create-script-img",
                    label: i18n.common_term_icon_label + ":",
                    value: ""
                },
                OSType: {
                    label: i18n.template_term_suitOS_label + ":",
                    require: true,
                    "id": "create-script-OSType",
                    "dftLabel": "Linux",
                    "width": "214",
                    "values": [{
                        "selectId": "0",
                        "label": "Linux"
                    }, {
                        "selectId": "1",
                        "label": "Windows"
                    }],
                    "change": function () {}
                },
                desc: {
                    label: i18n.common_term_desc_label + ":",
                    require: false,
                    "id": "create-script-desc",
                    "value": "",
                    "type": "multi",
                    "width": "420",
                    "height": "60"
                },
                scriptFile: {
                    label: i18n.template_term_scriptFile_label + ":",
                    require: true,
                    "width": "214",
                    "id": "create-script-file",
                    "value": ""
                },
                version: {
                    label: i18n.common_term_version_label + ":",
                    require: true,
                    "width": "214",
                    "id": "create-script-file",
                    "value": ""
                },
                filePath: {
                    label: i18n.common_term_fileTargetPath_label + ":",
                    require: true,
                    "width": "420",
                    "id": "create-script-filePath",
                    "value": ""
                },
                command: {
                    label: i18n.common_term_runCmd_label + ":",
                    require: true,
                    "id": "create-script-command",
                    "value": "",
                    "type": "multi",
                    "width": "420",
                    "height": "60"
                },
                preBtn: {
                    "id": "create-script-step3-pre",
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
                    "id": "create-script-step3-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        // 触发事件
                        $scope.$emit($scope.addScriptEvents.confirmed, $scope.service);
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
                        var params = JSON.stringify({
                            "name": $scope.service.name,
                            "osType": $scope.service.OSType,
                            "picture": $scope.service.icon,
                            "description": $scope.service.desc,
                            "mainFilePath": $scope.service.mainFilePath,
                            "range": "1",
                            "version": $scope.service.version,
                            "installCommand": $.base64.encode($scope.service.command, true),
                            "destinationPath": $scope.service.filePath
                        });
                        var user = $("html").scope().user;
                        var modifyOptions = {
                            "user": user,
                            "id": $stateParams.id,
                            "cloudInfraId": $stateParams.cloudInfraId,
                            "params": params
                        };
                        var promise = templateServiceIns.updateScript(modifyOptions);
                        promise.then(function (data) {
                            $scope.close();
                        });

                    }
                }
            };

            //关闭当前窗口
            $scope.destroy = function () {
                $scope.close();
            };
        }
    ];
    return ctrl;
});
