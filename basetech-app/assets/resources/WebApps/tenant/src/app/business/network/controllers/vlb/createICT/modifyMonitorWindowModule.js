/* global define*/
define([
        'tiny-lib/angular',
        'tiny-lib/jquery',
        "bootstrapui/ui-bootstrap-tpls",
        'tiny-lib/underscore',
        "app/services/httpService",
        'tiny-common/UnifyValid',
        "language/keyID",
        'app/services/validatorService',
        "tiny-directives/Textbox",
        "tiny-directives/Button"
    ],
    function (angular, $, uibootstrap, _, http, UnifyValid, i18n, validatorService) {
        "use strict";
        var ctrl = ["$scope",
            function ($scope) {
                var modifyWinDom = $("#modifyMonitorWindow");
                // 待修改对象
                var monitor = modifyWinDom.widget().option("rowData").modMonitor;
                var LBPerformance = modifyWinDom.widget().option("rowData").LBPerformance;

                // 软件和硬件LB的前端端口校验不一样
                var servicePortValidatorStr = (LBPerformance === "low" ? "servicePortValidate():" + i18n.lb_term_discovering_valid + "" : "servicePortValidate():" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535"));

                $scope.close = function () {
                    $("#modifyMonitorWindow").widget().destroy();
                };
                $scope.info = {
                    protocol: {
                        "id": "modify-vlb-addmonitor-window-protocol",
                        label: i18n.common_term_protocol_label + ":",
                        "tooltip": i18n.lb_listen_add_para_protocol_mean_tip,
                        "width": "220",
                        require: true,
                        "change": function () {
                            var selectId = $("#modify-vlb-addmonitor-window-protocol").widget().getSelectedId();
                            var backProtocols = [];
                            _.each($scope.info.backendProtocol.value, function (backProtocol) {
                                backProtocol.checked = "";
                                if (selectId + "" === backProtocol.selectId + "") {
                                    backProtocol.checked = true;
                                }
                                backProtocols.push(backProtocol);
                            });
                            $scope.info.backendProtocol.value = backProtocols;
                        },
                        value: [{
                            "selectId": "HTTP",
                            "label": "HTTP",
                            "checked": "HTTP" === monitor.protocol
                        }, {
                            "selectId": "HTTPS",
                            "label": "HTTPS",
                            "checked": "HTTPS" === monitor.protocol
                        }, {
                            "selectId": "TCP",
                            "label": "TCP",
                            "checked": "TCP" === monitor.protocol
                        }]
                    },
                    servicePort: {
                        label: i18n.lb_term_pairIP_label + ":",
                        "tooltip": i18n.lb_listen_add_para_externalServicePort_mean_tip,
                        "id": "modify-vlb-addmonitor-window-servicePort",
                        "width": "214",
                        require: true,
                        value: monitor.extendPort,
                        "extendFunction": ["servicePortValidate"],
                        "validate": servicePortValidatorStr
                    },
                    backendProtocol: {
                        label: i18n.lb_term_backendProtocol_label + ":",
                        "id": "modify-vlb-addmonitor-window-backendProtocol",
                        "tooltip":i18n.lb_listen_add_para_backendProtocol_mean_tip,
                        "width": "220",
                        require: true,
                        "change": function () {
                            var selectId = $("#modify-vlb-addmonitor-window-backendProtocol").widget().getSelectedId();
                            var protocols = [];
                            for (var backProtocol in $scope.info.protocol.value) {
                                if ($scope.info.protocol.value.hasOwnProperty(backProtocol)) {
                                    $scope.info.protocol.value[backProtocol].checked = "";
                                    if (selectId + "" === $scope.info.protocol.value[backProtocol].selectId + "") {
                                        $scope.info.protocol.value[backProtocol].checked = true;
                                    }
                                    protocols.push($scope.info.protocol.value[backProtocol]);
                                }
                            }
                            $scope.info.protocol.value = protocols;
                        },
                        value: [{
                            "selectId": "HTTP",
                            "label": "HTTP",
                            "checked": "HTTP" === monitor.protocol
                        }, {
                            "selectId": "HTTPS",
                            "label": "HTTPS",
                            "checked": "HTTPS" === monitor.protocol
                        }, {
                            "selectId": "TCP",
                            "label": "TCP",
                            "checked": "TCP" === monitor.protocol
                        }]
                    },
                    backendPort: {
                        label: i18n.lb_term_backendPort_label + ":",
                        "tooltip": i18n.lb_listen_add_para_backendPort_mean_tip,
                        "id": "modify-vlb-addmonitor-window-backendPort",
                        "width": "214",
                        require: true,
                        value: monitor.backendPort,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535")
                    },
                    okBtn: {
                        "id": "modify-vlb-addmonitor-window-ok",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#modify-Monitor-window"));
                            if (!valid) {
                                return;
                            }
                            monitor.protocol = $("#modify-vlb-addmonitor-window-protocol").widget().getSelectedId();
                            monitor.extendPort = $("#modify-vlb-addmonitor-window-servicePort").widget().getValue();
                            monitor.backendProtocol = $("#modify-vlb-addmonitor-window-backendProtocol").widget().getSelectedId();
                            monitor.backendPort = $("#modify-vlb-addmonitor-window-backendPort").widget().getValue();
                            monitor.opt = "";
                            $scope.close();
                            $scope.$destroy();
                        }
                    },
                    cancelBtn: {
                        "id": "modify-vlb-addmonitor-window-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };

                // 输入值为1～65535的正整数。其中22,111,7910-7950除外。
                UnifyValid.servicePortValidate = function () {
                    var input = $("#modify-vlb-addmonitor-window-servicePort").widget().getValue();

                    // 校验空
                    if ($.trim(input) === "") {
                        return false;
                    }
                    // 校验整数
                    var f = parseFloat(input);
                    if (isNaN(f) || f.toString() !== input || Math.round(f) !== f) {
                        return false;
                    }

                    // 校验范围
                    var intInput = parseInt(input, 10);
                    if (LBPerformance === "high") {
                        if (intInput <= 0 || intInput > 65535) {
                            return false;
                        }
                    } else {
                        if (intInput <= 0 || intInput > 65535 || intInput === 22 || intInput === 111 || (intInput >= 7910 && intInput <= 7950)) {
                            return false;
                        }
                    }

                    return true;
                };
            }
        ];

        var dependency = [
            "ng", "wcc", "ui.bootstrap"
        ];
        var modifyMonitorWindow = angular.module("modifyMonitorWindow", dependency);
        modifyMonitorWindow.controller("modifyCtrl", ctrl);
        modifyMonitorWindow.service("camel", http);
        return modifyMonitorWindow;
    });
