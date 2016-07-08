define([
    "tiny-lib/jquery",
    "tiny-lib/underscore",
    "app/business/network/services/networkService",
    "app/business/network/services/router/routerService",
    "tiny-directives/Step"],
    function ($, _, networkService, routerService) {
	"use strict";
	var createLinkVpnCtrl = ["$rootScope", "$scope", "$compile", "$stateParams", "$q", "camel", "exception", function ($rootScope, $scope, $compile, $stateParams, $q, camel, exception) {
			var i18n = $scope.i18n;
			var networkServiceIns = new networkService(exception, $q, camel);
			var routerServiceIns = new routerService(exception, $q, camel);
			var user = $("html").scope().user;
                var isModify = $stateParams.opt === "modify";
			$scope.service = {
				"step" : {
					"id" : "create-linkvpn-step",
					"values" : [i18n.common_term_basicInfo_label, i18n.vpn_term_setTunnelInfo_button, 
					i18n.vpn_term_setLinkNegotiation_button, i18n.common_term_confirmInfo_label],
					"width" : 592,
					"jumpable" : false
				},
				"show" : "basic",
				"user" : $rootScope.user,
				"cloudInfraId" : $stateParams.cloudInfra,
				"azId" : $stateParams.azId,
				"vpcId" : $stateParams.vpcId,
                    "isModifyMode": isModify,
				"type" : $stateParams.type,
				"id" : $stateParams.id ? $stateParams.id : "",
				"name" : "",
				"description" : "",
				"dpd_action" : "hold",
				"dpd_interval" : "30",
				"dpd_timeout" : "120",
				"vpnType" : $stateParams.type === "1" ? "1" : "0",
				"vpnTypeUI" : "",
				"routerId" : null,
				"l2tpInfo" : {
					"subnetAddr" : "",
					"subnetMask" : "",
					"oldTunnelKey" : "",
					"tunnelKey" : "",
					"vpnUsers" : []
				},
				"ikeSharedKey" : "",
				"oldIkeSharedKey" : "",
				"customerGw" : {
					"ipAddr" : "",
					"customerSubnets" : [{
							"subnetAddr" : "",
							"subnetMask" : "",
							"subnetAddrId" : "subnetAddr0",
							"subnetMaskId" : "subnetMask0"
						}
					]
				},
				"networkIDs" : [],
				"selectedNets" : [],
				"pfsGroup" : "DH2",
				"lifeTime" : "3600",
				"ikepolicy" : getIKEPolicy(),
				"ipsecpolicy" : getIPSecPolicy(),
				"totalSubnetNum" : 1,
				"users" : [{
						"userName" : "",
						"pwd" : "",
						"oldPwd" : "",
						"repwd" : "",
						"userNameId" : "userNameId0",
						"pwdId" : "pwdId0",
						"oldPwdId" : "oldPwdId0",
						"pwdConfirmId" : "pwdConfirmId0",
						"texttype" : "password",
						"pwdChangeBoxId" : "pwdChangeBoxId0",
						"pwdChangeBoxText" : i18n.vpn_connect_add_para_modifyPsw_label,
						"canChangeUserPwd" : true
					}
				],
				"totalUserNum" : 1
			};
			$scope.events = {
				"ipSecBasicNext" : "ipSecBasicNex",
				"ipSecBasicNextFromParent" : "ipSecBasicNexFromParent"
			};
			$scope.$on($scope.events.ipSecBasicNext, function (event, msg) {
				$scope.$broadcast($scope.events.ipSecBasicNextFromParent, msg)
			});
			if (!$scope.service.isModifyMode) {
				var params = {
					"cloudInfraId" : $scope.service.cloudInfraId,
					"vpcId" : $scope.service.vpcId,
					"azId" : $scope.service.azId,
					"vdcId" : user.vdcId,
					"userId" : user.id
				};
				var deferred = routerServiceIns.queryRouter(params);
				deferred.then(function (data) {
					if (!data || !data.routers || data.routers.length <= 0) {
						return
					}
					if (data.routers[0].routerType === 2) {
						$scope.service.type = 0
					}
				})
			}
			if ($scope.service.isModifyMode) {
				var options = {
					"cloudInfraId" : $scope.service.cloudInfraId,
					"vpcId" : $scope.service.vpcId,
					"vdcId" : user.vdcId,
					"id" : $scope.service.id,
					"userId" : user.id
				};
				var deferred2 = networkServiceIns.querySingleVpnConnection(options);
				deferred2.then(function (data) {
                    if (!data) {
                        return;
                    }
                    var vpnLinkDetail = data;
                    $scope.service.name = vpnLinkDetail.name;
                    $scope.service.description = vpnLinkDetail.description;
                    $scope.service.vpnType = vpnLinkDetail.vpnType;
                    $scope.service.l2tpInfo = vpnLinkDetail.l2tpInfo;
                    if ($scope.service.l2tpInfo && $scope.service.l2tpInfo.vpnUsers) {
                        var users = $scope.service.l2tpInfo.vpnUsers;
                        for (var i = 0; i < users.length; i++) {
                            users[i].userName = users[i].name;
                            _.extend(users[i], {
                                "userNameId": "userNameId" + i,
                                "pwdId": "pwdId" + i,
                                "oldPwdId": "oldPwdId" + i,
                                "pwdConfirmId": "pwdConfirmId" + i,
                                "texttype": "password",
                                "isDefault": true,
                                "pwdChangeBoxId": "pwdChangeBoxId" + i,
                                "pwdChangeBoxText": i18n.vpn_connect_add_para_modifyPsw_label,
                                "canChangeUserPwd": false
                            });
                        }
                        $scope.service.totalUserNum = users.length;
                        $scope.service.users = users
                    }
                    $scope.service.customerGw = vpnLinkDetail.customerGw;
                    if ($scope.service.customerGw && $scope.service.customerGw.customerSubnets) {
                        var subnets = $scope.service.customerGw.customerSubnets;
                        for (var k = 0; k < subnets.length; k++) {
                            _.extend(subnets[k], {
                                "subnetAddrId": "subnetAddr" + k,
                                "subnetMaskId": "subnetMask" + k
                            });
                        }
                        $scope.service.totalSubnetNum = subnets.length
                    }
                    $scope.service.networkIDs = vpnLinkDetail.networkIDs;
                    $scope.service.pfsGroup = vpnLinkDetail.pfsGroup;
                    $scope.service.lifeTime = vpnLinkDetail.lifeTime;
                    $scope.service.routerId = vpnLinkDetail.routeId;
                    $scope.service.ikepolicy = getIKEPolicy(vpnLinkDetail.ikePublicInfo);
                    $scope.service.ipsecpolicy = getIPSecPolicy(vpnLinkDetail.ipsecPolicy)

                });
			}
			function getIKEPolicy(ikePublicInfo) {
				var defaultIKEPolicy = {
					authentication : "sha1",
					encryption : "aes-128",
					pfsGroup : "group5",
					ikeVersion : "v1",
					lifeTime : "3600"
				};
				if (isModify) {
					defaultIKEPolicy = ikePublicInfo
				}
				return defaultIKEPolicy
			}
			function getIPSecPolicy(IPSecPolicy) {
				var defaultIPSecPolicy = {
					transformProtocol : "esp",
					authentication : "sha1",
					encryption : "aes-128",
					pfsGroup : "group5",
					lifeTime : "3600"
				};
				if (isModify) {
					defaultIPSecPolicy = IPSecPolicy
				}
				return defaultIPSecPolicy
                }
            }
        ];

        return createLinkVpnCtrl;
});
