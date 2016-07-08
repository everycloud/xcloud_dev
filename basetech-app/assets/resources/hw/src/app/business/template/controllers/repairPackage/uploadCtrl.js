/* global define */
define(['jquery',
        'tiny-lib/angular',
        'tiny-widgets/Message',
        'tiny-common/UnifyValid'
    ],
    function ($, angular, Message, UnifyValid) {
        "use strict";

        var uploadCtrl = ["$scope", "$state", "$stateParams",
            function ($scope, $state, $stateParams) {
                var i18n = $scope.i18n;
                // 上传状态
                $scope.uploadStatus = "uploading";

                $scope.errorCode = 0;
                $scope.errorMsg = "";

                $scope.okBtn = {
                    id: "uploadSuccessID",
                    disabled: false,
                    iconsClass: "",
                    text: i18n.common_term_complete_label,
                    tip: "",
                    success: function () {
                        $scope.service.forceInterrupt = true;
                        $state.go("ecs.commonPackageList", {});
                    }
                };

                $scope.cancelBtn = {
                    id: "uploadCancelID",
                    disabled: false,
                    iconsClass: "",
                    text: i18n.common_term_cancle_button,
                    tip: "",
                    cancel: function () {
                        $state.go("ecs.commonPackageList", {});
                    }
                };

                $scope.init = function () {
                    // 事件处理
                    $scope.$on($scope.repairSoftwareEvents.updateProgress, function (event, msg) {
                        var progress = parseInt(msg, 10);
                        if (progress === 100) {
                            $scope.$apply(function () {
                                $scope.uploadStatus = "success";
                            });
                        } else if (progress > 100 || progress < 0) {
                            $scope.$apply(function () {
                                $scope.uploadStatus = "failed";
                                $scope.errorCode = progress;
                                // $scope.errorMsg = ameException && ameException[progress] && ameException[progress].desc || "系统异常";
                            });
                        }
                    });
                };

                /**
                 * 初始化操作
                 */
                $scope.init();
            }
        ];

        return uploadCtrl;
    });
