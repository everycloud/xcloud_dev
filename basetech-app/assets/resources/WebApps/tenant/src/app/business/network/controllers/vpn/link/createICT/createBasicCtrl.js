define([
    "tiny-lib/angular",
    "tiny-lib/jquery",
    'tiny-common/UnifyValid',
    "tiny-lib/underscore"],
    function (angular, $, UnifyValid, _) {
	"use strict";
	var basicCtrl = ["$scope", function ($scope) {
			var i18n = $scope.i18n;
			var user = $scope.user;
			var isIT = user.cloudType === "IT";
			$scope.isIT = isIT;
			$scope.info = {
				name : {
					"id" : "create-link-info-name",
					label : i18n.common_term_name_label + ":",
					"require" : true,
					"validate" : "regularCheck(" + "/^[a-zA-Z0-9_]{1,8}$/" + "):" + i18n.common_term_composition1_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 8)
				},
				type : {
					"label" : i18n.vpn_term_vpnType_label + ":",
					"id" : "create-link-info-type",
					IPSec : "IPSec VPN",
					IPSecImage : "../theme/default/images/vpn-type-Ipsec.png",
					L2TP : "L2TP VPN",
					L2TPImage : "../theme/default/images/vpn-type-L2tp.png",
					"require" : true
				},
				description : {
					label : i18n.common_term_desc_label + ":",
					"id" : "create-link-Info-description",
					"type" : "multi",
					"width" : "400",
					"value" : "",
					"height" : "60",
					"validate" : "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, 0, 1024)
				},
				cancelBtn : {
					"id" : "create-link-info-cancel",
					"text" : i18n.common_term_cancle_button,
					"click" : function () {
						setTimeout(function () {
							window.history.back()
						}, 0)
					}
				}
			};
			if (isIT) {
				_.extend($scope.info, {
					radiogroup : {
						id : "vpnTypeRadioGroup",
						name : "radiogroup"
					},
					nextBtn : {
						"id" : "create-link-info-next",
						"text" : i18n.common_term_next_button,
						"click" : function () {
							var valid = UnifyValid.FormValid($("#create-basic-form"));
							if (!valid) {
								return
							}
							$scope.service.vpnTypeUI = ("1" === $scope.service.vpnType + "" ? "l2TP" : "IPSec");
							if ("1" === $scope.service.vpnType + "") {
								$scope.service.show = "ikeUserNet";
								$scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpn_term_setTunnelInfo_button, i18n.vpn_term_connectUser_label, i18n.common_term_confirmInfo_label]
							} else {
								$scope.$emit($scope.events.ipSecBasicNext);
								$scope.service.show = "remote";
								$scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpn_term_setTunnelInfo_button, i18n.vpn_term_setLinkNegotiation_button, i18n.common_term_confirmInfo_label]
							}
							$scope.service.name = $("#create-link-info-name").widget().getValue();
							$scope.service.description = $("#create-link-Info-description").widget().getValue();
							$("#" + $scope.service.step.id).widget().next()
						}
					}
				});
				$scope.click = function (che) {
					$scope.service.vpnType = che + ""
				}
			} else {
				_.extend($scope.info, {
					nextBtn : {
						"id" : "create-link-info-next",
						"text" : i18n.common_term_next_button,
						"click" : function () {
							var valid = UnifyValid.FormValid($("#create-basic-form"));
							if (!valid) {
								return
							}
							$scope.service.name = $("#create-link-info-name").widget().getValue();
							$scope.service.description = $("#create-link-Info-description").widget().getValue();
							$scope.service.dpd_action = $("#create-link-dpd-action").widget().getSelectedId();
							$scope.service.dpd_interval = $("#create-link-dpd-interval").widget().getValue();
							$scope.service.dpd_timeout = $("#create-link-dpd-timeout").widget().getValue();
							$scope.$emit($scope.events.ipSecBasicNext);
							$scope.service.show = "remote";
							$("#" + $scope.service.step.id).widget().next()
						}
					}
				})
			}
			$scope.advanceicon = "../theme/default/images/colspand.png";
			$scope.advanceshow = false;
			$scope.click = function () {
				var isShow = $scope.advanceshow;
				isShow = !isShow;
				if (isShow) {
					$scope.advanceicon = "../theme/default/images/expand.png"
				} else {
					$scope.advanceicon = "../theme/default/images/colspand.png"
				}
				$scope.advanceshow = isShow
			};
			$scope.dpd = {
				"action" : {
					"id" : "create-link-dpd-action",
					"label" : i18n.common_term_DPDaction_label + ":",
					"width" : "150px",
					"require" : false,
					"value" : [{
							"selectId" : "hold",
							"label" : "hold",
							"checked" : $scope.service.dpd_action === "hold"
						}, {
							"selectId" : "clear",
							"label" : "clear",
							"checked" : $scope.service.dpd_action === "clear"
						}, {
							"selectId" : "restart",
							"label" : "restart",
							"checked" : $scope.service.dpd_action === "restart"
						}, {
							"selectId" : "disabled",
							"label" : "disabled",
							"checked" : $scope.service.dpd_action === "disabled"
						}, {
							"selectId" : "restart-by-peer",
							"label" : "restart-by-peer",
							"checked" : $scope.service.dpd_action === "restart-by-peer"
						}
					]
				},
				"interval" : {
					"id" : "create-link-dpd-interval",
					"label" : i18n.vpn_term_DPDretransmitDistance_label + ":",
					"require" : false,
					"value" : "30"
				},
				"timeout" : {
					"id" : "create-link-dpd-timeout",
					"label" : i18n.vpn_term_DPDtimeout_label + ":",
					"require" : false,
					"value" : "120"
				}
			}
		}
	];
	return basicCtrl
});
