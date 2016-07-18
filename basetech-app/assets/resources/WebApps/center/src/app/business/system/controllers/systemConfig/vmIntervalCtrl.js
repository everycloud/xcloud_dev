define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/systemFixture"],

    function ($, angular, Message, ExceptionService) {
        "use strict";
        var vmIntervalCtrl = ["$scope", "$compile", "$state", "camel", "$rootScope", function ($scope, $compile, $state, camel, $rootScope) {

            $scope.privilege = $("html").scope().user.privilege;

            $scope.vmIntervalItems = {
                "id": 10,
                "name": "",
                "label": ($scope.i18n.sys_term_intervalStartStop_label || "虚拟机启动间隔") + ":",
                "require": true,
                "values": [
                    {
                        "id": "1",
                        "name": "1"+ $scope.i18n.common_term_minutes_label
                    },
                    {
                        "id": "5",
                        "name": "5"+ $scope.i18n.common_term_minutes_label
                    },
                    {
                        "id": "10",
                        "name": "10"+ $scope.i18n.common_term_minutes_label
                    },
                    {
                        "id": "15",
                        "name": "15"+ $scope.i18n.common_term_minutes_label
                    },
                    {
                        "id": "30",
                        "name": "30"+ $scope.i18n.common_term_minutes_label
                    }
                ]
            };

            var options = {
                type: "prompt",
                title:  $scope.i18n.alarm_term_warning_label || "提示",
                content: $scope.i18n.common_term_operationSucceed_msg || "操作成功!",
                height: "20px",
                width: '300px',
                "buttons": [
                    {
                        "key": "btnOk",
                        label: $scope.i18n.common_term_confirm_label || "确认",
                        default: true
                    }
                ]
            };

            $scope.saveBtn = {
                "id": "vmIntervalSave",
                "text":  $scope.i18n.common_term_save_label || "保存",
                "disabled": false,
                "save": function () {
                    $scope.operator.saveVmInterval($scope.vmIntervalItems.id);
                }
            };
            $scope.operator = {
                init: function (time) {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/ame/apps/vm-interval",
                        "monitor": true,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.vmIntervalItems.id = response.interval;
                        $scope.$digest();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                saveVmInterval: function (time) {
                    var deferred = camel.put({
                        "url": "/goku/rest/v1.5/ame/apps/vm-interval",
                        "monitor": true,
                        "params": JSON.stringify({"interval": time}),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var msg = new Message(options);
                        msg.setButton("btnOk", function () {
                            msg.destroy();
                        });
                        msg.show();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };
            
            $scope.operator.init();
        }];
        return vmIntervalCtrl;
    }
);
