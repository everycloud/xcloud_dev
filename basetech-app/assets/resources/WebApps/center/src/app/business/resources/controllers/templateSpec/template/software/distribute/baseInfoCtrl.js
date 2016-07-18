define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants",
    'app/services/exceptionService'],
    function ($, angular, UnifyValid, Message, constants, Exception) {
        "use strict";

        var distributeBaseInfoCtrl = ["$scope", "$state", "$stateParams", "camel", function ($scope, $state, $stateParams, camel) {

            var exceptionService = new Exception();

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: false,
                "id": "distributeBaseInfoName"
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "id": "distributeBaseInfoPicture"
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: false,
                "id": "distributeBaseInfoOSType"
            };

            $scope.packageType = {
                label: $scope.i18n.common_term_softwareType_label+":",
                require: false,
                "id": "distributeBaseInfoPackageType"
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: false,
                "id": "distributeBaseInfoVersion"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "distributeBaseInfoDescription"
            };

            $scope.path = {
                label: $scope.i18n.common_term_fileTargetPath_label+":",
                require: false,
                "id": "distributeBaseInfoPath"
            };

            $scope.installCmd = {
                label: $scope.i18n.common_term_installCmdPara_label+":",
                require: false,
                "id": "distributeBaseInfoInstallCmd",
                "maxLength":256
            };
            $scope.uninstallCmd = {
                label: $scope.i18n.common_term_uninstallCmdPara_label+":",
                require: false,
                "id": "distributeBaseInfoUninstallCmd",
                "maxLength":256
            };
            $scope.startCmd = {
                label: $scope.i18n.common_term_startupCmdPara_label+":",
                require: false,
                "id": "distributeBaseInfoStartCmd",
                "maxLength":256
            };
            $scope.stopCmd = {
                label: $scope.i18n.common_term_StopCmdPara_label+":",
                require: false,
                "id": "distributeBaseInfoStopCmd",
                "maxLength":256
            };

            $scope.nextBtn = {
                id: "distributeBaseInfoNextBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    // 校验信息
                    var valid = UnifyValid.FormValid($("#distributeSoftwareBaseInfo"));
                    if (!valid || $("#distributeSoftwareBaseInfo .ng-invalid").length > 0) {
                        return;
                    }

                    // 触发事件
                    $scope.$emit($scope.distributionEvents.baseInfoChanged, $scope.model);
                    $scope.service.show = "selectVm";
                    $("#" + $scope.service.step.id).widget().next();
                }
            };

            $scope.cancelBtn = {
                id: "distributeBaseInfoCancelBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go("resources.templateSpec.software", {});
                }
            };

            var parseCommandParams = function (command) {

                command = command ? command : "";
                var paramList = [];

                var cmdParams = command.match(/(?!\{)[^\{\}]+(?=\})/g);
                if(!cmdParams){
                    return paramList;
                }

                for (var i = 0; i < cmdParams.length; i++) {
                    cmdParams[i] = cmdParams[i] + "";
                    var item = {"name": $.trim(cmdParams[i]), "value": null };
                    if(/=/.test(cmdParams[i])) {
                        var temp = cmdParams[i].split(/=/);
                        item["name"] = $.trim(temp[0]);
                        //处理多等号的情況
                        item["value"] = $.trim(cmdParams[i].substring(cmdParams[i].indexOf("=")+1));
                    }

                    paramList.push(item);
                }

                return paramList;
            };

            $scope.checkParam = function (value) {
                if (!value || value == "") {
                    return $scope.i18n.sprintf($scope.i18n.common_term_length_valid,1,256);
                }

                if (value.length > 256) {
                    return $scope.i18n.sprintf($scope.i18n.common_term_length_valid,1,256);
                }

                return true;
            };

            $scope.init = function () {
                // 查询软件包信息
                var deferred = camel.get({
                    "url": {"s": constants.rest.SOFTWARE_DETAIL.url, "o": {"tenant_id": 1, "softwareid": $stateParams.id}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function() {
                        if (data) {
                            data.installCommand = (data.installCommand && data.installCommand != "") ? $.base64.decode(data.installCommand, true) : data.installCommand;
                            data.unInstallCommand = (data.unInstallCommand && data.unInstallCommand != "") ? $.base64.decode(data.unInstallCommand, true) : data.unInstallCommand;
                            data.startCommand = (data.startCommand && data.startCommand != "") ? $.base64.decode(data.startCommand, true) : data.startCommand;
                            data.stopCommand = (data.stopCommand && data.stopCommand != "") ? $.base64.decode(data.stopCommand, true) : data.stopCommand;
                        }

                        $scope.service.model = data;

                        // 解析命令参数
                        $scope.service.model.installParams = parseCommandParams(data.installCommand);
                        $scope.service.model.unInstallParams = parseCommandParams(data.unInstallCommand);
                        $scope.service.model.startParams = parseCommandParams(data.startCommand);
                        $scope.service.model.stopParams = parseCommandParams(data.stopCommand);
                    });
                });
                deferred.fail(function(data) {
                    exceptionService.doException(data);
                });
            };

            $scope.init();
        }];

        return distributeBaseInfoCtrl;
    });

