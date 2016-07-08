define([
    "tiny-lib/angular",
    "tiny-lib/jquery",
    "app/business/network/services/networkService"],
    function (angular, $, networkService) {
	"use strict";
	var ctrl = ["$scope", "$compile", "$state", "$q", "camel", "exception", function ($scope, $compile, $state, $q, camel, exception) {
			var i18n = $scope.i18n;
			var user = $scope.user;
			var isIT = user.cloudType === "IT";
			$scope.isIT = isIT;
			var networkServiceIns = new networkService(exception, $q, camel);
			$scope.info = {
				"name" : {
					"label" : i18n.common_term_name_label + ":"
				},
				"type" : {
					"label" : i18n.common_term_type_label + ":"
				},
				"desc" : {
					"label" : i18n.common_term_desc_label + ":"
				},
				"dnAlgorithm" : {
					"label" : i18n.vpn_term_DH_label + ":"
				},
				"lifeTime" : {
					"label" : i18n.vpn_term_consultationPeriodS_label + ":"
				},
				"gateway" : {
					"label" : i18n.vpn_term_remoteGatewayIP_label + ":"
				},
				"network" : {
					"label" : i18n.vpn_term_remoteNetSubnetMask_label + ":"
				},
				"subnetAddr" : {
					"label" : i18n.common_term_Subnet_label + ":"
				},
				"subnetMask" : {
					"label" : i18n.common_term_SubnetMask_label + ":"
				},
				preBtn : {
					"id" : "create-link-info-pre",
					"text" : i18n.common_term_back_button,
					"click" : function () {
						if ("1" === $scope.service.vpnType + "") {
							$scope.service.show = "addUser"
						} else {
							$scope.service.show = "ike"
						}
						$("#" + $scope.service.step.id).widget().pre()
					}
				},
				createBtn : {
					"id" : "create-link-info-create",
					"text" : $scope.service.isModifyMode ? i18n.common_term_modify_button : i18n.common_term_create_button,
					"click" : function () {
						var params = {
							"vpnType" : $scope.service.vpnType,
							"name" : $scope.service.name,
							"description" : $scope.service.description,
							"ikeSharedKey" : $scope.service.ikeSharedKey
						};
						if (isIT) {
							if ($scope.service.vpnType + "" === '0') {
								params.pfsGroup = $scope.service.pfsGroup;
								params.lifeTime = $scope.service.lifeTime;
								params.networkIDs = $scope.service.networkIDs;
								params.customerGw = $scope.service.customerGw
							}
							if ($scope.service.vpnType + "" === '1') {
								params.l2tpInfo = $scope.service.l2tpInfo
							}
						} else {
							params.routeId = $scope.service.routerId;
							params.networkIDs = $scope.service.networkIDs;
							params.customerGw = $scope.service.customerGw;
							params.ikePolicy = $scope.service.ikepolicy;
							params.ipsecPolicy = $scope.service.ipsecpolicy
						}
						var options = {
							"vdcId" : $scope.user.vdcId,
							"cloudInfraId" : $scope.service.cloudInfraId,
							"vpcId" : $scope.service.vpcId,
							"userId" : $scope.user.id,
							"params" : params
						};
						if ($scope.service.isModifyMode) {
							options.id = $scope.service.id;
							var deffered = networkServiceIns.updateVpnConnection(options);
							deffered.then(function () {
								$state.go("network.vpcmanager.vpnlink")
							})
						} else {
							var deffered1 = networkServiceIns.createVpnConnection(options);
							deffered1.then(function () {
								$state.go("network.vpcmanager.vpnlink")
							})
						}
					}
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
			$scope.ikepolicy = {
				"auth_algorithm" : {
					label : i18n.common_term_authenticArithmetic_label + ":"
				},
				"encryption_algorithm" : {
					label : i18n.device_term_encryptArithmetic_label+":"
				},
				"pfs" : {
					label : i18n.common_term_perfectForwardSecrecy_label + ":"
				},
				"ike_version" : {
					label : i18n.common_term_version_label+":"
				},
				"lifetime" : {
					label : i18n.common_term_lifecycleS_label + ":"
				}
			};
			$scope.ipsecpolicy = {
				"transform_protocol" : {
					label : i18n.common_term_transmissionProtocol_label + ":"
				},
				"auth_algorithm" : {
					label : i18n.common_term_authenticArithmetic_label + ":"
				},
				"encryption_algorithm" : {
					label : i18n.device_term_encryptArithmetic_label + ":"
				},
				"pfs" : {
					label : i18n.common_term_perfectForwardSecrecy_label + ":"
				},
				"lifetime" : {
					label : i18n.common_term_lifecycleS_label + ":"
				}
			};
			$scope.dpd = {
				"action" : {
					"label" : i18n.common_term_DPDaction_label + ":"
				},
				"interval" : {
					"label" : i18n.vpn_term_DPDretransmitDistance_label + ":"
				},
				"timeout" : {
					"label" : i18n.vpn_term_DPDtimeout_label + ":"
				}
			}
		}
	];
	return ctrl
});
