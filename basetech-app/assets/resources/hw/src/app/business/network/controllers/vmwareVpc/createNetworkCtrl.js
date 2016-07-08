/*global define*/
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        "app/services/httpService",
        "app/services/validatorService",
        "app/services/exceptionService",
        'tiny-common/UnifyValid',
        "app/business/network/services/networkService"
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, httpService, validatorService, exceptionService, unifyValid, networkService) {
        "use strict";
        var createNetworkCtrl = ["$scope", "camel", "$q", "validator", "exception",
            function ($scope, camel, $q, validator, exception) {
                var user = $("html").scope().user;
                var window = $("#createNetworkWindow").widget();
                var vpcId = window.option("vpcId");
                var vdcId = window.option("vdcId");
                var infraId = window.option("infraId");
                $scope.serviceInstance = new networkService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.nameTextbox = {
                    label: i18n.common_term_name_label + ":",
                    require: true,
                    "id": "zoneName",
                    "validate": "required:" + i18n.common_term_null_valid + ";maxSize(128):" + i18n.sprintf(i18n.common_term_length_valid, "1", "128") + ";regularCheck(" + validator.ChineseRe + "):" + i18n.common_term_composition2_valid,
                    "width": "200"
                };
                $scope.vlanTextbox = {
                    label: "VLAN:",
                    require: true,
                    "id": "zoneLocation",
                    "width": "200",
                    "validate": "required:" + i18n.common_term_null_valid + ";integer;"
                };

                $scope.subnetAddrBox = {
                    label: i18n.common_term_SubnetIP_label + ":",
                    require: true,
                    "id": "subnetAddrBox",
                    "width": "200",
                    "validate": "required:" + i18n.common_term_null_valid
                };

                $scope.subnetPrefixBox = {
                    label: i18n.common_term_SubnetMask_label + ":",
                    require: true,
                    "id": "subnetPrefixBox",
                    "width": "200",
                    "validate": "required:" + i18n.common_term_null_valid
                };

                $scope.gatewayBox = {
                    label: i18n.common_term_gateway_label + ":",
                    require: true,
                    "id": "gatewayBox",
                    "width": "200",
                    "validate": "required:" + i18n.common_term_null_valid
                };
                $scope.createBtn = {
                    "label": "",
                    "id": "createNetworkSave",
                    "text": i18n.common_term_create_button,
                    "tooltip": "",
                    "click": function () {
                        var valid = unifyValid.FormValid($("#createNetworkDiv"), undefined);
                        if (!valid) {
                            return;
                        }
                        var model = {
                            osNetworkForCreate: {
                                "name": $("#" + $scope.nameTextbox.id).widget().getValue(),
                                "vlan": $("#" + $scope.vlanTextbox.id).widget().getValue(),
                                "ipv4Subnet": {
                                    "subnetAddr": $("#" + $scope.subnetAddrBox.id).widget().getValue(),
                                    "subnetPrefix": $("#" + $scope.subnetPrefixBox.id).widget().getValue(),
                                    "gateway": $("#" + $scope.gatewayBox.id).widget().getValue()
                                }
                            }
                        };
                        createNetwork(model);
                    }
                };

                $scope.cancelBtn = {
                    "id": "createNetworkCancel",
                    "text": i18n.common_term_cancle_button,
                    "tooltip": "",
                    "click": function () {
                        closeWindow();
                    }
                };

                function closeWindow() {
                    $("#createNetworkWindow").widget().destroy();
                }

                function createNetwork(model) {
                    var options = {
                        vdcId: user.vdcId,
                        vpcId: vpcId,
                        cloudInfraId: infraId,
                        "userId": user.id,
                        params: model
                    };
                    var promise = $scope.serviceInstance.createNovaNetwork(options);
                    promise.then(function (data) {
                        closeWindow();
                    });
                }
            }
        ];

        var createNetworkApp = angular.module("createVmwareNetworkApp", ["ng", "wcc", "ngSanitize"]);
        createNetworkApp.service("camel", httpService);
        createNetworkApp.service("validator", validatorService);
        createNetworkApp.service("exception", exceptionService);
        createNetworkApp.controller("network.vmwareVpc.network.createCtrl", createNetworkCtrl);
        return createNetworkApp;
    });
