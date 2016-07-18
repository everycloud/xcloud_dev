define(['jquery',
    'tiny-lib/angular',
    'tiny-widgets/Message',
    'tiny-common/UnifyValid',
    "language/ame-rpool-exception",
    "language/ui-common-exception"],
    function ($, angular, Message, UnifyValid, ameException, uiException) {
        "use strict";

        var uploadCtrl = ["$scope", "$state", "$stateParams", function ($scope, $state, $stateParams) {

            // 上传状态
            $scope.uploadStatus = "uploading";

            $scope.errorCode = 0;
            $scope.errorMsg = "";

            $scope.okBtn = {
                id: "uploadSuccessID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label,
                tip: "",
                success: function () {
                    $scope.service.forceInterrupt = true;
                    $state.go($scope.service.from, {});
                }
            };

            $scope.cancelBtn = {
                id: "uploadCancelID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go($scope.service.from, {});
                }
            };

            $scope.init = function () {
                var action = $stateParams.action;
                if (action === 'create') {
                    // 事件处理
                    $scope.$on($scope.registSoftwareEvents.updateProgress, function (event, msg) {
                        var progress = parseInt(msg, 10);
                        if (progress == 100) {
                            $scope.$apply(function () {
                                $scope.uploadStatus = "success";
                            });
                        }
                        else if (progress > 100 || progress < 0) {
                            $scope.$apply(function () {
                                $scope.uploadStatus = "failed";
                                $scope.errorCode = progress;
                                $scope.errorMsg = ameException && ameException[progress] && ameException[progress].desc ||  uiException && uiException[progress] && uiException[progress].desc || $scope.i18n.common_term_sysAbnormal_label;
                            });
                        }
                        else {
                            // do nothing
                        }
                    });
                    return;
                }
            };

            $scope.init();
        }];

        return uploadCtrl;
    });

