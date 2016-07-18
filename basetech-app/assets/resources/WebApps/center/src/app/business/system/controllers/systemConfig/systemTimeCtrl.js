define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/systemFixture"],

    function ($, angular, Message, ExceptionService) {
        "use strict";
        var systemTimeCtrl = ["$scope", "$compile", "$state", "camel", "$rootScope", function ($scope, $compile, $state, camel, $rootScope) {
            $scope.hasTimeoutOperateRight = $rootScope.user.privilege.role_role_add_option_timeoutHandle_value;
            $scope.systemTimeItems = {
                "id": 600,
                "name": "",
                "label": ($scope.i18n.sys_term_timeoutTime_label + ":") || "系统超时时间:",
                "require": true,
                "values": [
                    {
                        "id": "300",
                        "name": "5" + " " + $scope.i18n.common_term_minutesWithDigit_label
                    },
                    {
                        "id": "600",
                        "name": "10" + " " + $scope.i18n.common_term_minutesWithDigit_label
                    },
                    {
                        "id": "900",
                        "name": "15" + " " + $scope.i18n.common_term_minutesWithDigit_label
                    },
                    {
                        "id": "1800",
                        "name": "30" + " " + $scope.i18n.common_term_minutesWithDigit_label
                    },
                    {
                        "id": "3600",
                        "name": "1" + " " + $scope.i18n.common_term_hourWithDigit_label
                    },
                    {
                        "id": "7200",
                        "name": "2" + " " + $scope.i18n.common_term_hoursWithDigit_label
                    },
                    {
                        "id": "10800",
                        "name": "3" + " " + $scope.i18n.common_term_hoursWithDigit_label
                    },
                    {
                        "id": "86400",
                        "name": "1" + " " + $scope.i18n.common_term_dayWithDigit_button
                    },
                    {
                        "id": "172800",
                        "name": "2" + " " + $scope.i18n.common_term_daysWithDigit_button
                    }
                ]
            };

            var options = {
                type: "prompt",
                title: $scope.i18n.alarm_term_warning_label || "提示",
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
            }

            $scope.saveBtn = {
                "id": "sysTimeSave",
                "text": $scope.i18n.common_term_save_label || "保存",
                "disabled": false,
                "save": function () {
                    $scope.operator.saveTimeout($scope.systemTimeItems.id);
                }
            };
            $scope.operator = {
                init: function (time) {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/system/session",
                        "monitor": true,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.systemTimeItems.id = response.validateTime;
                        $scope.$digest();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                saveTimeout: function (time) {
                    var deferred = camel.put({
                        "url": "/goku/rest/v1.5/system/session",
                        "monitor": true,
                        "params": JSON.stringify({"validateTime": time}),
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
            }
            $scope.operator.init();
        }];
        return systemTimeCtrl;
    }
);
