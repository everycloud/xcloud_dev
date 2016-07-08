/* global define*/
define([
        "sprintf",
        'tiny-lib/jquery',
        'tiny-lib/angular',
        'bootstrapui/ui-bootstrap-tpls',
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        'tiny-lib/underscore',
        "app/services/httpService",
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/services/messageService",
        'app/services/exceptionService',
        "app/business/network/services/vlb/vlbService",
        "tiny-directives/Textbox",
        "tiny-directives/Button"
    ],
    function (sprintf, $, angular, uibootstrap, ngSanitize, keyIDI18n, _, http, UnifyValid, validatorService, messageService, exception, vlbService) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {

                $scope.vlbServiceInst = new vlbService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                var user = $("html").scope().user || {};

                var messageServiceIns = new messageService();

                // 列表页面添加监听器https时需要传递证书
                $scope.showCheckCer = false;
                $scope.showHealthCheck = false;
                $scope.showCheckPath = true; // tcp证书不需要显示检测路径

                // 父窗口传递的添加对象
                var createWinDom = $("#createMonitorWindow");
                var monitor = createWinDom.widget().option("monitorData");
                var usedBackPorts = createWinDom.widget().option("usedBackPorts");
                var usedServicePorts = createWinDom.widget().option("usedServicePorts");
                var LBPerformance = createWinDom.widget().option("LBPerformance"); // 取值: high,low 对应硬件和软件

                // 列表汇总添加监听器，并且类型为硬件的时候需要配置健康检查参数
                if (createWinDom.widget().option("addFromList") && LBPerformance && LBPerformance === "high") {
                    $scope.showHealthCheck = true;
                }

                // 软件和硬件LB的前端端口校验不一样
                var servicePortValidatorStr = (LBPerformance === "low" ? "servicePortValidate():" + i18n.lb_term_discovering_valid + "" : "servicePortValidate():" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535"));

                $scope.close = function () {
                    createWinDom.widget().destroy();
                };
                $scope.info = {
                    protocol: {
                        "id": "create-vlb-addmonitor-window-protocol",
                        label: i18n.common_term_protocol_label + ":",
                        "tooltip": i18n.lb_listen_add_para_protocol_mean_tip,
                        "width": "220",
                        require: true,
                        "change": function () {

                            // 列表页面添加监听器https时需要传递证书
                            $scope.showCheckCer = false;
                            $scope.showCheckPath = true; // tcp证书不需要显示检测路径

                            var selectId = $("#create-vlb-addmonitor-window-protocol").widget().getSelectedId();
                            var backProtocols = [];
                            _.each($scope.info.backendProtocol.value, function (backProtocol) {
                                backProtocol.checked = "";
                                if (selectId + "" === backProtocol.selectId + "") {
                                    backProtocol.checked = true;
                                }
                                backProtocols.push(backProtocol);
                            });
                            $scope.info.backendProtocol.value = backProtocols;

                            // 如果是列表中跳转 添加监听器并且协议为HTTPS时需要配置证书
                            if (createWinDom.widget().option("addFromList") && selectId === "HTTPS") {
                                $scope.showCheckCer = true;
                            }
                            // 如果是列表中跳转 添加监听器并且协议为HTTPS时需要配置证书
                            if (createWinDom.widget().option("addFromList") && selectId === "TCP") {
                                $scope.showCheckPath = false;
                            }
                        },
                        value: [{
                            "selectId": "HTTP",
                            "label": "HTTP",
                            "checked": true
                        }, {
                            "selectId": "HTTPS",
                            "label": "HTTPS"
                        }, {
                            "selectId": "TCP",
                            "label": "TCP"
                        }]
                    },
                    servicePort: {
                        label: i18n.lb_term_pairIP_label + ":",
                        "tooltip": i18n.lb_listen_add_para_externalServicePort_mean_tip,
                        "id": "create-vlb-addmonitor-window-servicePort",
                        "width": "214",
                        require: true,
                        value: "",
                        "extendFunction": ["servicePortValidate"],
                        "validate": servicePortValidatorStr
                    },
                    backendProtocol: {
                        label: i18n.lb_term_backendProtocol_label + ":",
                        "id": "create-vlb-addmonitor-window-backendProtocol",
                        "tooltip":i18n.lb_listen_add_para_backendProtocol_mean_tip,
                        "width": "220",
                        require: true,
                        "change": function () {

                            // 列表页面添加监听器https时需要传递证书
                            $scope.showCheckCer = false;
                            $scope.showCheckPath = true; // tcp证书不需要显示检测路径

                            var selectId = $("#create-vlb-addmonitor-window-backendProtocol").widget().getSelectedId();
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

                            // 如果是列表中跳转 添加监听器并且协议为HTTPS时需要配置证书
                            if (createWinDom.widget().option("addFromList") && selectId === "HTTPS") {
                                $scope.showCheckCer = true;
                            }
                            // 如果是列表中跳转 添加监听器并且协议为tcp时需要不需要配置检测路径
                            if (createWinDom.widget().option("addFromList") && selectId === "TCP") {
                                $scope.showCheckPath = false;
                            }
                        },
                        value: [{
                            "selectId": "HTTP",
                            "label": "HTTP",
                            "checked": true
                        }, {
                            "selectId": "HTTPS",
                            "label": "HTTPS"
                        }, {
                            "selectId": "TCP",
                            "label": "TCP"
                        }]
                    },
                    backendPort: {
                        label: i18n.lb_term_backendPort_label + ":",
                        "tooltip": i18n.lb_listen_add_para_backendPort_mean_tip,
                        "id": "create-vlb-addmonitor-window-backendPort",
                        "width": "214",
                        require: true,
                        value: "",
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535")
                    },
                    name: {
                        label: i18n.common_term_certificateName_value + ":",
                        "id": "create-vlb-configCertificate-window-name",
                        "width": "214",
                        require: true,
                        value: monitor.certificateName,
                        "validate": "minSize(1):" + i18n.common_term_null_valid
                    },
                    checkPath: {
                        label: i18n.common_term_checkPath_label + ":",
                        "tooltip": i18n.lb_listen_add_para_checkPath_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-checkPath",
                        "width": "214",
                        require: true,
                        value: monitor.checkPath,
                        "validate": "required:" + i18n.common_term_null_valid + ";regularCheck(" + /^\/.*$/ + "):" + i18n.common_term_startWithSlash_valid
                    },
                    timeout: {
                        label: i18n.device_term_timeouts_label + ":",
                        "tooltip": i18n.lb_listen_add_para_timeout_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-timeout",
                        "width": "214",
                        require: true,
                        value: monitor.responseTime,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";minValue(5):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";maxValue(30):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30")
                    },
                    checkInterval: {
                        label: i18n.common_term_checkCycleS_label + ":",
                        "tooltip": i18n.lb_listen_add_para_checkCycleS_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-checkInterval",
                        "width": "214",
                        require: true,
                        value: monitor.checkInterval,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";minValue(5):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";maxValue(30):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30")
                    },
                    healthyThreshold: {
                        label: i18n.lb_term_healthThreshold_label + ":",
                        "tooltip": i18n.lb_listen_add_para_healthThreshold_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-healthyThreshold",
                        "width": "214",
                        require: true,
                        value: monitor.healthyThreshold,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";maxValue(10):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10")
                    },
                    unhealthyThreshold: {
                        label: i18n.lb_term_notHealthThreshold_label + ":",
                        "tooltip": i18n.lb_listen_add_para_notHealthThreshold_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-unhealthyThreshold",
                        "width": "214",
                        require: true,
                        value: monitor.unhealthyThreshold,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";maxValue(10):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10")

                    },
                    privateKey: {
                        label: i18n.common_term_privateKey_label + ":",
                        "id": "create-vlb-configCertificate-window-privateKey",
                        "width": "214",
                        require: true,
                        value: monitor.privateKey,
                        "type": "multi",
                        "height": 80,
                        "validate": "minSize(1):" + i18n.sprintf(i18n.common_term_length_valid, "1", "4384") + ";maxSize(4384):" + i18n.sprintf(i18n.common_term_length_valid, "1", "4384")
                    },
                    publicKey: {
                        label: i18n.common_term_publicKey_label + ":",
                        "id": "create-vlb-configCertificate-window-publicKey",
                        "width": "214",
                        require: true,
                        value: monitor.publicKey,
                        "type": "multi",
                        "height": 80,
                        "validate": "minSize(1):" + i18n.sprintf(i18n.common_term_length_valid, "1", "4384") + ";maxSize(4384):" + i18n.sprintf(i18n.common_term_length_valid, "1", "4384")
                    },
                    password: {
                        label: i18n.common_term_psw_label + ":",
                        "id": "create-vlb-configCertificate-window-password",
                        "width": "214",
                        value: ""
                    },
                    okBtn: {
                        "id": "create-vlb-addmonitor-window-ok",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#create-Monitor-window"));
                            if (!valid) {
                                return;
                            }

                            // 前端端口校验
                            var extendPort = $("#create-vlb-addmonitor-window-servicePort").widget().getValue();
                            if (_.contains(usedServicePorts, extendPort)) {
                                messageServiceIns.failMsgBox(i18n .sprintf(i18n.lb_term_portUsed_valid, extendPort));
                                return;
                            }
                            // 后端端口重复性校验
                            var backendPort = $("#create-vlb-addmonitor-window-backendPort").widget().getValue();
                            if (_.contains(usedBackPorts, backendPort)) {
                                messageServiceIns.failMsgBox(i18n .sprintf(i18n.lb_term_portUsed_valid, backendPort));
                                return;
                            }

                            // 列表入口 调用添加listener接口
                            if (createWinDom.widget().option("addFromList")) {
                                var protocol = $("#create-vlb-addmonitor-window-protocol").widget().getSelectedId();
                                var newListeners = [{
                                    "protocol": protocol,
                                    "port": extendPort,
                                    "backPort": backendPort,
                                    "conConnectionNum": -1,
                                    "maxThroughput": -1
                                }];
                                if ("HTTPS" === protocol) {
                                    _.each(newListeners, function (item) {
                                        _.extend(item, {
                                            "certificateName": $("#create-vlb-configCertificate-window-name").widget().getValue(),
                                            "privateKey": $("#create-vlb-configCertificate-window-privateKey").widget().getValue(),
                                            "publicKeyCertificate": $("#create-vlb-configCertificate-window-publicKey").widget().getValue(),
                                            "passWord": $("#create-vlb-configCertificate-window-password").widget().getValue()
                                        });
                                    });
                                }

                                // 列表汇总添加监听器，并且类型为硬件的时候需要配置健康检查参数
                                if ($scope.showHealthCheck) {
                                    newListeners[0].healthCheckInfo = [{
                                        "checkPort": backendPort,
                                        "path": $("#create-vlb-configHealthCheck-window-checkPath").widget().getValue() || "",
                                        "responseTime": $("#create-vlb-configHealthCheck-window-timeout").widget().getValue(),
                                        "checkInterval": $("#create-vlb-configHealthCheck-window-checkInterval").widget().getValue(),
                                        "healthCheckType": protocol,
                                        "unhealthyThreshold": $("#create-vlb-configHealthCheck-window-unhealthyThreshold").widget().getValue(),
                                        "healthyThreshold": $("#create-vlb-configHealthCheck-window-healthyThreshold").widget().getValue()
                                    }];
                                }
                                var deferred = $scope.vlbServiceInst.createListener({
                                    "vdc_id": user.vdcId,
                                    "userId": user.id,
                                    "cloudInfraId": createWinDom.widget().option("cloudInfraId"),
                                    "lbID": createWinDom.widget().option("lbID"),
                                    "params": {
                                        "listeners": newListeners
                                    }
                                });
                                deferred.then(function (data) {

                                });
                                $scope.close();
                                $scope.$destroy();
                            } else {
                                monitor.protocol = $("#create-vlb-addmonitor-window-protocol").widget().getSelectedId();
                                monitor.extendPort = extendPort;
                                monitor.backendProtocol = $("#create-vlb-addmonitor-window-backendProtocol").widget().getSelectedId();
                                monitor.backendPort = backendPort;
                                monitor.opt = "";
                                $scope.close();
                                $scope.$destroy();
                            }

                        }
                    },
                    cancelBtn: {
                        "id": "create-vlb-addmonitor-window-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };

                // 输入值为1～65535的正整数。其中22,111,7910-7950除外。
                UnifyValid.servicePortValidate = function () {
                    var input = $("#create-vlb-addmonitor-window-servicePort").widget().getValue();

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
            "ng", "wcc", 'ui.bootstrap'
        ];
        var createMonitorWindow = angular.module("createMonitorWindow", dependency);
        createMonitorWindow.controller("createCtrl", ctrl);
        createMonitorWindow.service("camel", http);
        createMonitorWindow.service("exception", exception);

        return createMonitorWindow;
    });
