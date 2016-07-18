/*global define*/
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    'tiny-widgets/Message',
    'tiny-common/UnifyValid',
    "language/ame-rpool-exception",
    "language/ui-common-exception"
], function ($, angular, Message, UnifyValid, ameException, uiException) {
    "use strict";

    var ctrl = ["$scope", "monkey", "camel",
        function ($scope, monkey, camel) {
            var i18n = $scope.i18n;
            // 上传状态
            $scope.uploadStatus = "uploading";
            $scope.errorCode = 0;
            $scope.errorMsg = "";

            $scope.info = {
                progress: {
                    "label": i18n.common_term_uploading_value + ":",
                    "require": false,
                    "width": "600",
                    "label-position": "center"
                },
                preBtn: {
                    "id": "create-script-step4-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        monkey.show = {
                            "basic": false,
                            "commandConfig": false,
                            "confirm": true,
                            "uploadFile": false
                        };
                        $("#" + $scope.step.id).widget().pre();
                    }
                },
                okBtn: {
                    "id": "create-script-step4-ok",
                    "display": false,
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var $state = $("html").injector().get("$state");
                        $state.go("ecs.commonScriptList");
                    }
                },
                cancelBtn: {
                    "id": "create-script-step4-cancel",
                    "display": false,
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        var msgOptions = {
                            "type": "confirm", 
                            "title": i18n.common_term_confirm_label,
                            "content": i18n.template_script_cancleUpload_info_confirm_msg,
                            "width": "300",
                            "height": "200"
                        };

                        var msgBox = new Message(msgOptions);
                        var buttons = [{
                            label: i18n.common_term_ok_button,
                            accessKey: 'Y',
                            'default': true, //默认焦点
                            handler: function (event) { //点击回调函数
                                setTimeout(function () {
                                    window.history.back();
                                }, 0);
                                msgBox.destroy();
                                $scope.close();
                            }
                        }, {
                            label: i18n.common_term_cancle_button,
                            accessKey: 'N',
                            'default': false,
                            handler: function (event) {
                                msgBox.destroy();
                            }
                        }];
                        msgBox.option("buttons", buttons);
                        msgBox.show();
                    }
                }
            };

            // 事件处理
            $scope.$on($scope.addScriptEvents.updateProgress, function (event, msg) {
                var progress = parseInt(msg, 10);
                if (progress === 100) {
                    $scope.uploadStatus = "success";
                } else if (progress > 100 || progress < 0) {
                    $scope.uploadStatus = "failed";
                    $scope.errorCode = progress;
                    $scope.errorMsg = ameException && ameException[progress] && ameException[progress].desc ||  uiException && uiException[progress] && uiException[progress].desc || $scope.i18n.common_term_sysAbnormal_label;
                }
            });
        }
    ];
    return ctrl;
});
