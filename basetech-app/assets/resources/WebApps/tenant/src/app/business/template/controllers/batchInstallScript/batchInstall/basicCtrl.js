/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    'upload/FileUpload',
    'tiny-widgets/Message'
], function ($, angular, UnifyValid, validatorService, FileUpload, Message) {
    "use strict";

    var ctrl = ["$scope", "monkey", "camel", "$stateParams",
        function ($scope, monkey, camel, $stateParams) {
            var i18n = $scope.i18n;
            $scope.info = {
                name: {
                    "id": "install-script-name",
                    label: i18n.common_term_name_label + ":"
                },
                OSType: {
                    label: $scope.i18n.template_term_suitOS_label+":",
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
                nextBtn: {
                    "id": "install-script-step1-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        // 校验信息
                        var valid = UnifyValid.FormValid($("#batchInstallScriptBaseInfo"));
                        if (!valid || $("#batchInstallScriptBaseInfo .ng-invalid").length > 0) {
                            return;
                        }
                        monkey.show = {
                            "basic": false,
                            "addVM": true,
                            "confirm": false
                        };
                        $("#" + $scope.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "install-script-step1-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            $scope.checkParam = function (value) {
                if (!value || value === "") {
                    return $scope.i18n.sprintf($scope.i18n.common_term_length_valid,1,256);
                }

                if (value.length > 256) {
                    return $scope.i18n.sprintf($scope.i18n.common_term_length_valid,1,256);
                }

                return true;
            };

            /**
             * 解析软件包参数
             * @param command
             * @returns {Array}
             */
            var parseCommandParams = function (command) {

                command = command ? command : "";
                var paramList = [];

                var cmdParams = command.match(/(?!\{)[^\{\}]+(?=\})/g);
                if (!cmdParams) {
                    return paramList;
                }

                for (var i = 0; i < cmdParams.length; i++) {
                    cmdParams[i] = cmdParams[i] + "";
                    var item = {
                        "name": $.trim(cmdParams[i]),
                        "value": null
                    };
                    if (/=/.test(cmdParams[i])) {
                        var temp = cmdParams[i].split(/=/);
                        item.name = $.trim(temp[0]);
                        //处理多等号的情況
                        item.value = $.trim(cmdParams[i].substring(cmdParams[i].indexOf("=") + 1));
                    }

                    paramList.push(item);
                }

                return paramList;
            };


            //初始化数据
            $scope.init = function () {
                // 解析命令参数
                $scope.param.installCommand = parseCommandParams($scope.param.installCommand);

                $scope.scriptDetail = $scope.param;
                $scope.installCommand = $stateParams.installCommand;
            };
            $scope.init();
        }
    ];
    return ctrl;
});
