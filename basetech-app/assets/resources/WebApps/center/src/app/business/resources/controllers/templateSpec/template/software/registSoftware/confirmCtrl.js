define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    "app/business/resources/controllers/constants"],
    function ($, angular, UnifyValid, constants) {
        "use strict";

        var confirmCtrl = ["$scope", "$state", "$stateParams", function ($scope, $state, $stateParams) {

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: false,
                "id": "confirmName"
            };

            $scope.softwareName = {
                label: $scope.i18n.template_term_softwareFile_label+":",
                require: false,
                "id": "confirmFileName"
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "id": "confirmPicture"
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: false,
                "id": "confirmOSType"
            };

            $scope.packageType = {
                label: $scope.i18n.common_term_softwareType_label+":",
                require: false,
                "id": "confirmPackageType"
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: false,
                "id": "confirmVersion"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "confirmDescription"
            };

            $scope.attachment = {
                label: $scope.i18n.common_term_attachment_label+":",
                require: false,
                "id": "confirmAttachment"
            };

            $scope.path = {
                label: $scope.i18n.common_term_fileTargetPath_label+":",
                require: false,
                "id": "confirmPath"
            };

            $scope.installCmd = {
                label: $scope.i18n.common_term_installCmd_label+":",
                require: false,
                "id": "confirmInstall",
                "value":""
            };
            $scope.uninstallCmd = {
                label: $scope.i18n.common_term_uninstallCmd_label+":",
                require: false,
                "id":"confirmUninstall",
                "value":""
            };
            $scope.startCmd = {
                label: $scope.i18n.common_term_startupCmd_label+":",
                require: false,
                "id": "confirmStart",
                "value":""
            };
            $scope.stopCmd = {
                label: $scope.i18n.common_term_StopCmd_label+":",
                require: false,
                "id": "confirmStop",
                "value":""
            };

            $scope.backBtn = {
                id: "confirmBackBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_back_button,
                tip: "",
                back: function () {
                    $scope.service.show = "commandConfig";
                    $("#"+$scope.service.step.id).widget().pre();
                }
            };

            $scope.nextBtn = {
                id: "confirmNextBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    // 触发事件
                    $scope.$emit($scope.registSoftwareEvents.confirmed, $scope.model);
                    return;
                }
            };

            $scope.saveBtn = {
                id: "confirmSaveBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label,
                tip: "",
                save: function () {
                    $scope.$emit($scope.registSoftwareEvents.confirmed, $scope.model);
                    $("#"+$scope.saveBtn.id).widget().option("disable",true);
                    $("#"+$scope.backBtn.id).widget().option("disable",true);
                }
            };

            $scope.cancelBtn = {
                id: "confirmCancelBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go($scope.service.from, {});
                }
            };

            $scope.action = "create";

            /**
             * 初始化操作
             */
            $scope.init = function () {
                $scope.action = $stateParams.action;

                // 事件处理
                $scope.$on($scope.registSoftwareEvents.toConfirmFromParent, function (event, msg) {
                    $scope.installCmd.value = $scope.service.model.installCommand;
                    $scope.uninstallCmd.value = $scope.service.model.unInstallCommand;
                    $scope.startCmd.value = $scope.service.model.startCommand;
                    $scope.stopCmd.value = $scope.service.model.stopCommand;
                });
            };

            $scope.init();
        }];

        return confirmCtrl;
    });

