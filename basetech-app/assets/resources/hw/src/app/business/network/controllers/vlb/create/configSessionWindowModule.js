/* global define*/
define([
    'tiny-lib/angular',
    "tiny-lib/jquery",
    "app/services/httpService",
    'tiny-common/UnifyValid',
    "language/keyID",
    'app/services/validatorService',
    "tiny-directives/Textbox",
    "tiny-directives/Button"
],
    function (angular, $, http, UnifyValid, i18n, validatorService) {
        "use strict";
        var ctrl = ["$scope",
            function ($scope) {

                // 父窗口传递的添加对象
                var monitor = $("#configSessionWindow").widget().option("param").parmMonitor;
                var selectValues = [];
                if ("TCP" === monitor.protocol) {
                    selectValues = [
                        {
                            "selectId": "3",
                            "label": "SOURCE_ADDRES",
                            "checked": "3" === monitor.sessionMode
                        }
                    ];
                } else {
                    selectValues = [
                        {
                            "selectId": "1",
                            "label": i18n.lb_term_stuffCookie_label,
                            "checked": "1" === monitor.sessionMode
                        },
                        {
                            "selectId": "2",
                            "label": "PASSIVE_COOKIE",
                            "checked": "2" === monitor.sessionMode
                        },
                        {
                            "selectId": "3",
                            "label": "SOURCE_ADDRES",
                            "checked": "3" === monitor.sessionMode
                        },
                        {
                            "selectId": "4",
                            "label": "HEADER",
                            "checked": "4" === monitor.sessionMode
                        }
                    ];
                }

                $scope.close = function () {
                    $("#configSessionWindow").widget().destroy();
                };

                $scope.showCookieName = false;
                $scope.showHeaderName = false;

                if ("2" === monitor.sessionMode + "") {
                    $scope.showCookieName = true;
                }
                if ("4" === monitor.sessionMode + "") {
                    $scope.showHeaderName = true;
                }
                $scope.info = {
                    sessionMode: {
                        "id": "create-vlb-configsession-window-sessionmode",
                        label: i18n.common_term_protocol_label + ":",
                        "width": "220",
                        require: true,
                        value: selectValues,
                        "change": function () {
                            var selectId = $("#create-vlb-configsession-window-sessionmode").widget().getSelectedId();
                            $scope.showCookieName = ("2" === selectId + "");
                            $scope.showHeaderName = ("4" === selectId + "");
                        }
                    },
                    timeout: {
                        label: i18n.device_term_timeouts_label + ":",
                        "tooltip": i18n.lb_listen_add_para_timeout_mean_tip,
                        "id": "create-vlb-configsession-window-timeout",
                        "width": "220",
                        require: true,
                        value: monitor.timeout,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "65535") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_range_valid, "1", "65535")
                    },
                    cookieName: {
                        label: i18n.lb_term_cookieName_label + ":",
                        "id": "create-vlb-configsession-window-cookieName",
                        "width": "220",
                        require: true,
                        value: monitor.cookieName,
                        "validate": "required:" + i18n.common_term_null_valid
                    },
                    headerName: {
                        label: i18n.lb_term_headerName_label + ":",
                        "id": "create-vlb-configsession-window-headerName",
                        "width": "220",
                        require: true,
                        value: monitor.headerName,
                        "validate": "required:" + i18n.common_term_null_valid
                    },
                    okBtn: {
                        "id": "create-vlb-configsession-window-ok",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#config-session-window"));
                            if (!valid) {
                                return;
                            }
                            monitor.sessionMode = $("#create-vlb-configsession-window-sessionmode").widget().getSelectedId();
                            if ("2" === monitor.sessionMode + "") {
                                monitor.cookieName = $("#create-vlb-configsession-window-cookieName").widget().getValue();
                            }
                            if ("4" === monitor.sessionMode + "") {
                                monitor.headerName = $("#create-vlb-configsession-window-headerName").widget().getValue();
                            }
                            monitor.timeout = $("#create-vlb-configsession-window-timeout").widget().getValue();
                            monitor.opt = "";
                            $scope.close();
                            $scope.$destroy();
                        }
                    },
                    cancelBtn: {
                        "id": "create-vlb-configsession-window-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };
            }
        ];

        var dependency = [
            "ng", "wcc"
        ];
        var configSessionWindow = angular.module("configSessionWindow", dependency);
        configSessionWindow.controller("configSessionCtrl", ctrl);
        configSessionWindow.service("camel", http);
        return configSessionWindow;
    });
