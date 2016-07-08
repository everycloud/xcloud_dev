/*global define*/
define([
    'sprintf',
    'tiny-lib/jquery',
    'tiny-lib/angular',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/network/services/vpn/gateway/gatewayService",
    "app/business/network/services/eip/eipService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "tiny-lib/underscore",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-lib/underscore",
    "fixtures/network/vpn/gateway/gatewayFixture",
    "fixtures/network/eip/elasticipFixture"
],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exception, gatewayService, eipService, UnifyValid, validatorService, _) {
        "use strict";
        var createCtrl = ["$scope", "$q", "camel", "exception",
            function ($scope, $q, camel, exception) {
                //资源状态处于未绑定的弹性IP
                var ELASTICIP_RESOURCE_STATUS_UNBIND = "UNBIND";
                var validatorServiceIns = new validatorService();
                // 公共服务实例
                var gatewayServiceIns = new gatewayService(exception, $q, camel);
                var eipServiceIns = new eipService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var tips = i18n.sprintf(i18n.common_term_rangeInteger_valid, 480, 86400);
                var dpdIntervaltips = i18n.sprintf(i18n.common_term_rangeInteger_valid, 2, 60);
                var dpdTimeOuttips = i18n.sprintf(i18n.common_term_rangeInteger_valid, 10, 3600);
                //获取参数
                $scope.params = $("#createGatewayWindowId").widget().option("params");
                $scope.name = {
                    "id": "vpnCreateGatewayNameInputId",
                    label: i18n.common_term_name_label + ":",
                    "tip": "",
                    "width": 280,
                    require: true,
                    validate: "required:" + i18n.common_term_null_valid + ";regularCheck(" + validatorServiceIns.name + "):" + i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") + ";"
                };
                $scope.description = {
                    "id": "vpnCreateGatewayDescriptionInputId",
                    "label": i18n.common_term_desc_label + ":",
                    "value": "",
                    "type": "multi",
                    "width": 280,
                    "height": 40,
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                };
                $scope.elasticIpSelect = {
                    "id": "vpnCreateGatewayElasticIpSelectId",
                    "label": i18n.eip_term_eip_label + ":",
                    "require": true,
                    "values": [],
                    "width": "280",
                    "height": "200"
                };
                $scope.info = {
                    "dnAlgorithm": {
                        "id": "ike-dnAlgorithm-select",
                        "label": i18n.vpn_term_DH_label + ":",
                        "width": "220",
                        "require": true,
                        "values": [
                            {
                                "selectId": "DH2",
                                "label": "DH2",
                                "checked": true
                            },
                            {
                                "selectId": "DH5",
                                "label": "DH5",
                                "checked": false
                            }
                        ]
                    },
                    "authentication": {
                        "label": i18n.common_term_authenticationMode_label + ":",
                        "id": "ike-authentication-select",
                        "value": i18n.vpn_term_IKEsharePsw_label
                    },
                    "certifAlgorithm": {
                        "id": "ike-certifAlgorithm-select",
                        "espid": "esp-certifAlgorithm-select",
                        "label": i18n.common_term_authenticArithmetic_label + ":",
                        "require": true,
                        "values": [
                            {
                                "selectId": "SHA",
                                "label": "SHA",
                                "checked": true
                            },
                            {
                                "selectId": "MD5",
                                "label": "MD5",
                                "checked": false
                            }
                        ]
                    },
                    "encryptAlgorithm": {
                        "id": "ike-encryptAlgorithm-select",
                        "espid": "esp-encryptAlgorithm-select",
                        "label": i18n.device_term_encryptArithmetic_label + ":",
                        "require": true,
                        "values": [
                            {
                                "selectId": "3DES",
                                "label": "3DES",
                                "checked": false
                            },
                            {
                                "selectId": "AES-128",
                                "label": "AES-128",
                                "checked": true
                            }
                        ]
                    },
                    lifeTime: {
                        "id": "ike-lifeTime-textbox",
                        "label": i18n.vpn_term_consultationPeriodS_label + ":",
                        "validate": "integer:" + tips + ";minValue(480):" + tips + ";maxValue(86400):" + tips,
                        "value": "86400"
                    },
                    "dpdInterval": {
                        "id": "dpd-dpdInterval-textbox",
                        "label": i18n.vpn_term_DPDretransmitDistance_label + ":",
                        "validate": "integer:" + dpdIntervaltips + ";minValue(2):" + dpdIntervaltips + ";maxValue(60):" + dpdIntervaltips,
                        "value": "30"
                    },
                    "dpdTimeOut": {
                        "id": "dpd-dpdTimeOut-textbox",
                        "label": i18n.vpn_term_DPDtimeout_label + ":",
                        "validate": "integer:" + dpdTimeOuttips + ";minValue(10):" + dpdTimeOuttips + ";maxValue(3600):" + dpdTimeOuttips,
                        "value": "120"
                    }
                };

                // 硬件路由的DH算法和加密算法差异化
                if ($scope.params.isHardwareRouter) {
                    $scope.info.dnAlgorithm.values = [
                        {
                            "selectId": "DH1",
                            "label": "DH1",
                            "checked": true
                        },
                        {
                            "selectId": "DH2",
                            "label": "DH2",
                            "checked": false
                        },
                        {
                            "selectId": "DH5",
                            "label": "DH5",
                            "checked": false
                        }
                    ];

                    $scope.info.encryptAlgorithm.values = [
                        {
                            "selectId": "DES",
                            "label": "DES",
                            "checked": false
                        },
                        {
                            "selectId": "3DES",
                            "label": "3DES",
                            "checked": false
                        },
                        {
                            "selectId": "AES-128",
                            "label": "AES-128",
                            "checked": false
                        },
                        {
                            "selectId": "AES-192",
                            "label": "AES-192",
                            "checked": false
                        },
                        {
                            "selectId": "AES-256",
                            "label": "AES-256",
                            "checked": true
                        }
                    ];
                }

                $scope.createBtn = {
                    "id": "vpnCreateGatewayOkBtnId",
                    "text": i18n.common_term_create_button + "",
                    "click": function () {
                        $scope.command.createVPNGateway();
                    }
                };

                $scope.cancelBtn = {
                    "id": "vpnCreateGatewayCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createGatewayWindowId").widget().destroy();
                    }
                };
                $scope.command = {
                    "createVPNGateway": function () {
                        var valid = UnifyValid.FormValid($("#create-gateway-window"));
                        if (!valid) {
                            return;
                        }
                        var elasticIp = $("#" + $scope.elasticIpSelect.id).widget().getSelectedLabel();
                        if (!elasticIp) {
                            return;
                        }
                        var name = $("#" + $scope.name.id).widget().getValue();
                        var description = $("#" + $scope.description.id).widget().getValue();
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "ipAddr": elasticIp,
                            "name": name,
                            "description": description,
                            "ikePublicInfo": {
                                "pfsGroup": $("#ike-dnAlgorithm-select").widget().getSelectedLabel(),
                                "authentication": $("#ike-certifAlgorithm-select").widget().getSelectedLabel(),
                                "encryption": $("#ike-encryptAlgorithm-select").widget().getSelectedLabel(),
                                "authMethod": 0,
                                "lifeTime": $("#ike-lifeTime-textbox").widget().getValue()
                            },
                            "espPublicInfo": {
                                "authentication": $("#esp-certifAlgorithm-select").widget().getSelectedLabel(),
                                "encryption": $("#esp-encryptAlgorithm-select").widget().getSelectedLabel()
                            },
                            "dpdInfo": {
                                "dpdInterval":$("#dpd-dpdInterval-textbox").widget().getValue(),
                                "dpdTimeOut":$("#dpd-dpdTimeOut-textbox").widget().getValue()
                            }
                        };
                        var deferred = gatewayServiceIns.createVPNGateway(options);
                        deferred.then(function (data) {
                            $("#createGatewayWindowId").widget().destroy();
                            $("#vpcmanager-vpn-gateway").scope().$emit("createdGatewaySuccessEvent");
                        });
                    },
                    "queryElasticIP": function () {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId
                        };
                        var deferred = eipServiceIns.queryElasticIPAll(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            var elasticIPRes = data.elasticIPs;
                            var elasticIPArray = [];
                            _.each(elasticIPRes, function (item, index) {
                                if (item.resourceStatus === ELASTICIP_RESOURCE_STATUS_UNBIND) {
                                    elasticIPArray.push({
                                        "selectId": item.id,
                                        "label": item.ip,
                                        "checked": (index === 0)
                                    });
                                }
                            });
                            $scope.elasticIpSelect.values = elasticIPArray;
                        });
                    }
                };
                $scope.command.queryElasticIP();
            }
        ];
        var module = angular.module("createGatewayModule", ["ng", "wcc", "ngSanitize"]);
        module.controller("createGatewayCtrl", createCtrl);
        module.service("camel", http);
        module.service("exception", exception);
        return module;
    });
