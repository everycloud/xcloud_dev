/*global define*/
define(["tiny-lib/angular",
    "tiny-lib/jquery",
    'tiny-common/UnifyValid'
], function (angular, $, UnifyValid) {
    "use strict";

    var basicCtrl = ["$scope",
        function ($scope) {
            var i18n = $scope.i18n;
            $scope.info = {
                name: {
                    "id": "create-link-info-name",
                    label: i18n.common_term_name_label + ":",
                    "require": true,
                    "validate": "regularCheck(" + "/^[a-zA-Z0-9_]{1,8}$/" + "):" + i18n.common_term_composition1_valid + i18n .sprintf(i18n.common_term_length_valid, 1, 8)
                },
                type: {
                    "label": i18n.vpn_term_vpnType_label + ":",
                    "id": "create-link-info-type",
                    "require": true
                },
                radiogroup: {
                    id: "vpnTypeRadioGroup",
                    name: "radiogroup",
                    IPSec: "IPSec VPN",
                    IPSecImage: "../theme/default/images/vpn-type-Ipsec.png",
                    L2TP: "L2TP VPN",
                    L2TPImage: "../theme/default/images/vpn-type-L2tp.png"
                },
                description: {
                    label: i18n.common_term_desc_label + ":",
                    "id": "create-link-Info-description",
                    "type": "multi",
                    "width": "400",
                    "value": "",
                    "height": "60",
                    "validate": "maxSize(1024):" + i18n .sprintf(i18n.common_term_length_valid, 0, 1024)
                },
                opt: {
                    label: ""
                },
                nextBtn: {
                    "id": "create-link-info-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {

                        var valid = UnifyValid.FormValid($("#create-basic-form"));
                        if (!valid) {
                            return;
                        }

                        $scope.service.vpnTypeUI = ("1" === $scope.service.vpnType + "" ? "l2TP" : "IPSec");

                        if ("1" === $scope.service.vpnType + "") {
                            $scope.service.show = "ikeUserNet";
                            $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpn_term_setTunnelInfo_button, i18n.vpn_term_connectUser_label, i18n.common_term_confirmInfo_label];
                        } else {
                            $scope.$emit($scope.events.ipSecBasicNext);
                            $scope.service.show = "remote";
                            $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpn_term_setTunnelInfo_button, i18n.vpn_term_setLinkNegotiation_button, i18n.common_term_confirmInfo_label];
                        }

                        $scope.service.name = $("#create-link-info-name").widget().getValue();
                        $scope.service.description = $("#create-link-Info-description").widget().getValue();

                        $("#" + $scope.service.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-link-info-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

            $scope.click = function (che) {
                $scope.service.vpnType = che + "";
            };
        }
    ];
    return basicCtrl;
});
