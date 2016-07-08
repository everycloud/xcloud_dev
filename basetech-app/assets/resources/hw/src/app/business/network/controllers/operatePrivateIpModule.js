/**
 * Created on 14-2-26.
 */
/*global define*/
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/messageService",
    'app/services/exceptionService',
    "app/business/network/services/networkService",
    'tiny-directives/RadioGroup',
    'tiny-directives/IP',
    "tiny-directives/Textbox",
    "tiny-directives/Button"
],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, UnifyValid, validatorService, messageService, exception, networkService) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {

                $scope.networkServiceInst = new networkService(exception, $q, camel);
                var validator = new validatorService();

                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                // 父窗口传递的添加对象
                var param = $("#operatePrivateIpWindow").widget().option("param");
                $scope.mode = param.mode;

                $scope.close = function () {
                    $("#operatePrivateIpWindow").widget().destroy();
                };
                $scope.info = {
                    choice: {
                        label: i18n.common_term_mode_label + ":",
                        require: true,
                        "id": "privateIpChoiceId",
                        values: [
                            {
                                "key": "AUTO",
                                "text": i18n.vpc_net_addPrivateIP_para_notSpecifyIP_label,
                                "checked": true
                            },
                            {
                                "key": "MANUAL",
                                "text": i18n.vm_term_designationIP_label,
                                "checked": false
                            }
                        ],
                        "change": function () {
                            var choice = $("#privateIpChoiceId").widget().opChecked("checked");
                            if (choice === 'AUTO') {
                                $scope.info.IP.display = false;
                            } else {
                                $scope.info.IP.display = true;
                            }
                        }
                    },
                    IP: {
                        label: "IP:",
                        "id": "privateIpWindowIP",
                        "width": "214",
                        require: true,
                        type: "ipv4",
                        value: param.privateIP,
                        "display": false,
                        "extendFunction": ["isIPv4Check"],
                        "validate": "required:" + i18n.common_term_null_valid + ";isIPv4Check(privateIpWindowIP):" + i18n.common_term_formatIP_valid
                    },
                    description: {
                        "label": i18n.common_term_desc_label + ":",
                        "require": false,
                        "id": "privateIpWindowDesc",
                        "value": param.description,
                        "type": "multi",
                        "width": "250",
                        "height": "56",
                        "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_length_valid, 0, 1024)
                    },
                    okBtn: {
                        "id": "privateIpWindowIPokBtn",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#operate-private-ip-window"));
                            if (!valid) {
                                return;
                            }
                            param.isOKBttnClick = true;
                            var choice = $("#privateIpChoiceId").widget().opChecked("checked");
                            if ($scope.mode === "add") {
                                if (choice === "AUTO") {
                                    param.description = $("#privateIpWindowDesc").widget().getValue();
                                    param.privateIP = "";
                                    var promise = $scope.networkServiceInst.applyPrivateIP(param);
                                    promise.then(function () {
                                        $scope.close();
                                        $scope.$destroy();
                                    });
                                }
                                // 如果是手动时，首先释放掉已经申请的IP，再调用更新接口并且带上输入的ip
                                else {
                                    param.description = $("#privateIpWindowDesc").widget().getValue();
                                    param.privateIP = $("#privateIpWindowIP").widget().getValue();
                                    var promise2 = $scope.networkServiceInst.applyPrivateIP(param);
                                    promise2.then(function () {
                                        $scope.close();
                                        $scope.$destroy();
                                    });
                                }
                            }
                            else{
                                param.description = $("#privateIpWindowDesc").widget().getValue();
                                var modPromise = $scope.networkServiceInst.updatePrivateIP(param);
                                modPromise.then(function () {
                                    $scope.close();
                                    $scope.$destroy();
                                });
                            }
                        }
                    },
                    cancelBtn: {
                        "id": "privateIpWindowIPCancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };

                //校验IPv4是否合法
                UnifyValid.isIPv4Check = function (domId) {
                    var ipValue = $("#" + domId).widget().getValue();
                    if ($.trim(ipValue) === "") {
                        return true;
                    }
                    return validator.ipValidator(ipValue);
                };
            }
        ];

        var dependency = [
            'ng', 'wcc', "ngSanitize"
        ];
        var operatePrivateIpWindow = angular.module("operatePrivateIpWindow", dependency);
        operatePrivateIpWindow.controller("operatePrivateIpWindowCtrl", ctrl);
        operatePrivateIpWindow.service("camel", http);
        operatePrivateIpWindow.service("exception", exception);

        return operatePrivateIpWindow;
    });
