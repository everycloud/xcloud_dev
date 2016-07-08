define([
    'tiny-lib/angular',
    'tiny-lib/jquery',
    'tiny-lib/underscore',
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/messageService",
    'app/services/exceptionService',
    "app/business/network/services/vlb/vlbService",
    "language/keyID",
    "tiny-directives/Textbox",
    "tiny-directives/Button"
],
    function (angular, $, _, http, UnifyValid, validatorService, messageService, exception, vlbService, i18n) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {
                var messageServiceIns = new messageService();
                var vlbServiceInst = new vlbService(exception, $q, camel);
                var user = $("html").scope().user || {};

                // 父窗口传递的添加对象
                var createWinDom = $("#operateMonitorWindow");
                var winWidget = createWinDom.widget();
                var scopeCtrl = winWidget.option("scope");
                var mode = winWidget.option("mode");
                var isAdd = mode === "add";
                var monitor = {};
                var index = 0;
                //ICT场景下，当会话保持类型为app_cookie时，需要输入cookie_name
                var isAppCookie = true;
                if (!isAdd) {
                    var rowData = winWidget.option("rowData");
                    monitor = rowData.modMonitor;
                    index = rowData.rowIndex;
                    isAppCookie = monitor.sessionPersistenceType === "APP_COOKIE";
                }
                var usedBackPorts = winWidget.option("usedBackPorts");
                var usedServicePorts = winWidget.option("usedServicePorts");
                var servicePortValidatorStr = "servicePortValidate():" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535");

                $scope.isIT = user.cloudType === "IT";
                //ICT场景下，当会话保持类型为app_cookie时，需要输入cookie_name
                $scope.isAppCookie = isAppCookie;

                $scope.info = {
                    protocol: {
                        "id": "create-vlb-addmonitor-window-protocol",
                        label: i18n.common_term_protocol_label + ":",
                        "width": "220",
                        require: true,
                        value: getAvailableProtocolByScene(isAdd, monitor),
                        "change": function () {
                            if ($scope.isIT) {
                                //IT 场景下，前端协议和后端协议要一致
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
                            } else {
                                var monitorProtocol = $("#create-vlb-addmonitor-window-protocol").widget().getSelectedId();
                                var values = getsessionPersistenceTypeValuesByProtocol(monitorProtocol);
                                $("#" + $scope.info.sessionPersistenceType.id).widget().option("values", values);
                                var type = $("#create-vlb-addmonitor-window-sessionPersistenceType").widget().getSelectedId();
                                $scope.isAppCookie = type === "APP_COOKIE";

                            }
                        }
                    },
                    servicePort: {
                        label: i18n.lb_term_pairIP_label + ":",
                        "id": "create-vlb-addmonitor-window-servicePort",
                        "width": "214",
                        require: true,
                        value: monitor.extendPort,
                        "extendFunction": ["servicePortValidate"],
                        "validate": servicePortValidatorStr
                    },
                    backendProtocol: {
                        label: i18n.lb_term_backendProtocol_label + ":",
                        "id": "create-vlb-addmonitor-window-backendProtocol",
                        "width": "220",
                        require: true,
                        "change": function () {
                            if ($scope.isIT) {
                                //IT 场景下，前端协议和后端协议要一致
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
                            }
                        },
                        value: getAvailableProtocolByScene(isAdd, monitor)
                    },
                    backendPort: {
                        label: i18n.lb_term_backendPort_label + ":",
                        "id": "create-vlb-addmonitor-window-backendPort",
                        "width": "214",
                        require: true,
                        value: monitor.backendPort,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535") + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535")
                    },
                    okBtn: {
                        "id": "create-vlb-addmonitor-window-ok",
                        "text": i18n.common_term_ok_button,
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#create-Monitor-window"));
                            if (!valid) {
                                return;
                            }
                            //协议
                            var protocol = $("#create-vlb-addmonitor-window-protocol").widget().getSelectedId();
                            // 对外服务端口
                            var extendPort = $("#create-vlb-addmonitor-window-servicePort").widget().getValue();
                                //会议保持类型
                                var sessionPersistenceType = $("#create-vlb-addmonitor-window-sessionPersistenceType").widget().getSelectedId();
                                //cookie名称
                                var cookieName = $("#create-vlb-configCertificate-window-cookieName").widget().getValue();

                                monitor.sessionPersistenceType = sessionPersistenceType;
                                monitor.cookieName = cookieName;
                            monitor.protocol = protocol;
                            monitor.extendPort = extendPort;
                            monitor.opt = "";
                            scopeCtrl.$emit("add-mod-monitor-success-event", isAdd, monitor, index);
                            $scope.close();
                            $scope.$destroy();
                        }
                    },
                    cancelBtn: {
                        "id": "create-vlb-addmonitor-window-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    },
                    sessionPersistenceType: {
                        "id": "create-vlb-addmonitor-window-sessionPersistenceType",
                        "label": i18n.lb_term_stickySessionType_label + ":",
                        "width": "220",
                        "require": true,
                        "value": getsessionPersistenceTypeByScene($scope.isIT, isAdd, monitor),
                        "change": function () {
                            var type = $("#create-vlb-addmonitor-window-sessionPersistenceType").widget().getSelectedId();
                            $scope.isAppCookie = type === "APP_COOKIE";
                        }
                    },
                    cookieName: {
                        "label": i18n.lb_term_cookieName_label + ":",
                        "id": "create-vlb-configCertificate-window-cookieName",
                        "width": "214",
                        "require": true,
                        "value": monitor.cookieName
                    }

                };
                $scope.close = function () {
                    createWinDom.widget().destroy();
                };
                function getAvailableProtocolByScene(isAdd, monitor) {
                    return [
                        {
                            "selectId": "HTTP",
                            "label": "HTTP",
                            "checked": isAdd ? true : "HTTP" === monitor.protocol
                        },
                        {
                            "selectId": "HTTPS",
                            "label": "HTTPS",
                            "checked": isAdd ? false : "HTTPS" === monitor.protocol
                        },
                        {
                            "selectId": "TCP",
                            "label": "TCP",
                            "checked": isAdd ? false : "TCP" === monitor.protocol
                        }
                    ];
                }

                function getsessionPersistenceTypeByScene(isIT, isAdd, monitor) {
                    if (isIT) {
                        return [];
                    } else {
                        return [
                            {
                                "selectId": "APP_COOKIE",
                                "label": "APP_COOKIE",
                                "checked": isAdd ? true : "APP_COOKIE" === monitor.sessionPersistenceType
                            },
                            {
                                "selectId": "HTTP_COOKIE",
                                "label": "HTTP_COOKIE",
                                "checked": isAdd ? false : "HTTP_COOKIE" === monitor.sessionPersistenceType
                            },
                            {
                                "selectId": "SOURCE_IP",
                                "label": "SOURCE_IP",
                                "checked": isAdd ? false : "SOURCE_IP" === monitor.sessionPersistenceType
                            }
                        ];

                    }
                }

                function getsessionPersistenceTypeValuesByProtocol(monitorProtocol) {
                    if (monitorProtocol === 'HTTP'|| monitorProtocol === 'HTTPS') {
                        return [
                            {
                                "selectId": "APP_COOKIE",
                                "label": "APP_COOKIE",
                                "checked": true
                            },
                            {
                                "selectId": "HTTP_COOKIE",
                                "label": "HTTP_COOKIE",
                                "checked": false
                            },
                            {
                                "selectId": "SOURCE_IP",
                                "label": "SOURCE_IP",
                                "checked": false
                            }
                        ];
                    } else {
                        return [
                            {
                                "selectId": "SOURCE_IP",
                                "label": "SOURCE_IP",
                                "checked": true
                            }
                        ];
                    }

                }

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
                    if (intInput <= 0 || intInput > 65535) {
                        return false;
                    }
                    return true;
                };
            }
        ];

        var dependency = ["ng", "wcc"];
        var createMonitorWindow = angular.module("createMonitorWindow", dependency);
        createMonitorWindow.controller("createCtrl", ctrl);
        createMonitorWindow.service("camel", http);
        createMonitorWindow.service("exception", exception);

        return createMonitorWindow;
    });
