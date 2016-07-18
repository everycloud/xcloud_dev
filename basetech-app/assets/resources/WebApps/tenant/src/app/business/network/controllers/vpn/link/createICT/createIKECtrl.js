define([
    "tiny-lib/jquery",
    "tiny-lib/underscore",
    'app/services/validatorService',
    'tiny-common/UnifyValid'],
    function ($, _, validatorService, UnifyValid) {
	"use strict";
	var ctrl = ["$scope", function ($scope) {
			var i18n = $scope.i18n;
			var user = $scope.user;
			var isIT = user.cloudType === "IT";
			$scope.canChangeSharePwd = !$scope.service.isModifyMode;
			$scope.info = {
				ikePwdChangeBox : {
					"label" : "",
					"id" : "ikePwdBoxId",
					"text" : i18n.common_term_update_button + i18n.vpn_term_IKEsharePsw_label,
					"checked" : false,
					"change" : function () {
						$scope.canChangeSharePwd = $("#ikePwdBoxId").widget().option("checked")
					}
				},
				sharepwd : {
					"id" : "create-link-ike-sharepwd",
					"type" : "password",
					label : i18n.vpn_term_IKEsharePsw_label + ":",
					value : "",
					"extendFunction" : ["sharePwdRegularCheck"],
					validate : "required:" + i18n.common_term_null_valid + ";sharePwdRegularCheck():" + i18n.common_term_compositionSpecial3_valid + i18n.sprintf(i18n.common_term_length_valid, 8, 127)
				},
				certainpwd : {
					"label" : i18n.common_term_PswConfirm_label + ":",
					"id" : "create-link-ike-certainpwd",
					"type" : "password",
					value : "",
					"extendFunction" : ["pwdEqualValid"],
					validate : "required:" + i18n.common_term_null_valid + ";pwdEqualValid(create-link-ike-sharepwd):" + i18n.common_term_pswDifferent_valid + ";"
				},
				preBtn : {
					"id" : "create-vpn-link-ike-pre",
					"text" : i18n.common_term_back_button,
					"click" : function () {
						$scope.service.show = "remote";
						$("#" + $scope.service.step.id).widget().pre()
					}
				},
				cancelBtn : {
					"id" : "create-vpn-link-ike-cancel",
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
					nextBtn : {
						"id" : "create-vpn-link-ike-next",
						"text" : i18n.common_term_next_button,
						"click" : function () {
							var valid = UnifyValid.FormValid($("#createVpnLinkIKEDiv"));
							if (!valid) {
								return
							}
							if ($scope.service.isModifyMode) {
								if ($scope.canChangeSharePwd) {
									$scope.service.ikeSharedKey = $("#create-link-ike-sharepwd").widget().getValue();
									$scope.service.oldIkeSharedKey = "";
								} else {
									$scope.service.ikeSharedKey = "";
									$scope.service.oldIkeSharedKey = ""
								}
							} else {
								$scope.service.ikeSharedKey = $("#create-link-ike-sharepwd").widget().getValue()
							}
							$scope.service.show = "confirm";
							$("#" + $scope.service.step.id).widget().next()
						}
					}
				})
			} else {
				_.extend($scope.info, {
					nextBtn : {
						"id" : "create-vpn-link-ike-next",
						"text" : i18n.common_term_next_button,
						"click" : function () {
							var valid = UnifyValid.FormValid($("#createVpnLinkIKEDiv"));
							if (!valid) {
								return
							}
							if ($scope.service.isModifyMode) {
								if ($scope.canChangeSharePwd) {
									$scope.service.ikeSharedKey = $("#create-link-ike-sharepwd").widget().getValue();
								    $scope.service.oldIkeSharedKey = "";
								} else {
									$scope.service.ikeSharedKey = "";
									$scope.service.oldIkeSharedKey = ""
								}
							} else {
								$scope.service.ikeSharedKey = $("#create-link-ike-sharepwd").widget().getValue()
							}
							var ikepolicy = $scope.service.ikepolicy;
							ikepolicy.encryption = $("#ike-policy-encryption_algorithm").widget().getSelectedId();
							ikepolicy.pfsGroup = $("#ike-policy-pfs").widget().getSelectedId();
							ikepolicy.ikeVersion = $("#ike-policy-ike_version").widget().opChecked("checked");
							ikepolicy.lifeTime = $("#ike-policy-lifetime").widget().getValue();
							var ipsecpolicy = $scope.service.ipsecpolicy;
							ipsecpolicy.transformProtocol = $("#ipsec-policy-transform_protocol").widget().opChecked("checked");
							ipsecpolicy.encryption = $("#ipsec-policy-encryption_algorithm").widget().getSelectedId();
							ipsecpolicy.pfsGroup = $("#ipsec-policy-pfs").widget().getSelectedId();
							ipsecpolicy.lifeTime = $("#ipsec-policy-lifetime").widget().getValue();
							$scope.service.show = "confirm";
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
			$scope.ikepolicy = {
				"auth_algorithm" : {
					label : i18n.common_term_authenticArithmetic_label + ":",
					id : "ike-policy-auth_algorithm"
				},
				"encryption_algorithm" : {
					label : i18n.device_term_encryptArithmetic_label+":",
					id : "ike-policy-encryption_algorithm",
					value : getEncryptionAlgorithmByType("ike")
				},
				"pfs" : {
					label : i18n.common_term_perfectForwardSecrecy_label + ":",
					id : "ike-policy-pfs",
					value : getpfsByType("ike")
				},
				"ike_version" : {
					label : i18n.common_term_version_label+":",
					id : "ike-policy-ike_version",
					"layout" : "horizon",
					"value" : getIkeVerion()
				},
				"lifetime" : {
					label : i18n.common_term_lifecycleS_label + ":",
					id : "ike-policy-lifetime"
				}
			};
			$scope.ipsecpolicy = {
				"transform_protocol" : {
					label : i18n.common_term_transmissionProtocol_label + ":",
					id : "ipsec-policy-transform_protocol",
					"layout" : "horizon",
					value : getTransformProtocol()
				},
				"auth_algorithm" : {
					label : i18n.common_term_authenticArithmetic_label + ":",
					id : "ipsec-policy-auth_algorithm"
				},
				"encryption_algorithm" : {
					label : i18n.device_term_encryptArithmetic_label+":",
					id : "ipsec-policy-encryption_algorithm",
					value : getEncryptionAlgorithmByType("ipsec")
				},
				"pfs" : {
					label : i18n.common_term_perfectForwardSecrecy_label + ":",
					id : "ipsec-policy-pfs",
					value : getpfsByType("ipsec")
				},
				"lifetime" : {
					label : i18n.common_term_lifecycleS_label + ":",
					id : "ipsec-policy-lifetime"
				}
			};
			function getIkeVerion() {
				var ikeVersion = null;
				if (!$scope.service.ikepolicy) {
					ikeVersion = "v1"
				} else {
					ikeVersion = $scope.service.ikepolicy.ikeVersion
				}
				return [{
						"key" : "v1",
						"text" : "v1",
						"checked" : ikeVersion === "v1"
					}, {
						"key" : "v2",
						"text" : "v2",
						"checked" : ikeVersion === "v2"
					}
				]
			}
			function getTransformProtocol() {
				var transformProtocol = null;
				if (!$scope.service.ipsecpolicy) {
					transformProtocol = "esp"
				} else {
					transformProtocol = $scope.service.ipsecpolicy.transformProtocol
				}
				return [{
						"key" : "esp",
						"text" : "esp",
						"checked" : transformProtocol === "esp"
					}, {
						"key" : "ah",
						"text" : "ah",
						"checked" : transformProtocol === "ah"
					}, {
						"key" : "ah-esp",
						"text" : "ah-esp",
						"checked" : transformProtocol === "ah-esp"
					}
				]
			}
			function getEncryptionAlgorithmByType(type) {
				var encryptionAlgorithm = null;
				if (!$scope.service.ikepolicy) {
					encryptionAlgorithm = "aes-128"
				} else {
					if (type === "ike") {
						encryptionAlgorithm = $scope.service.ikepolicy.encryption
					} else {
						encryptionAlgorithm = $scope.service.ipsecpolicy.encryption
					}
				}
				return [{
						"selectId" : "3des",
						"label" : "3des",
						"checked" : encryptionAlgorithm === "3des"
					}, {
						"selectId" : "aes-128",
						"label" : "aes-128",
						"checked" : encryptionAlgorithm === "aes-128"
					}, {
						"selectId" : "aes-192",
						"label" : "aes-192",
						"checked" : encryptionAlgorithm === "aes-192"
					}, {
						"selectId" : "aes-256",
						"label" : "aes-256",
						"checked" : encryptionAlgorithm === "aes-256"
					}
				]
			}
			function getpfsByType(type) {
				var pfs = null;
				if (!$scope.service.ikepolicy) {
					pfs = "group5"
				} else {
					if (type === "ike") {
						pfs = $scope.service.ikepolicy.pfsGroup
					} else {
						pfs = $scope.service.ipsecpolicy.pfsGroup
					}
				}
				return [{
						"selectId" : "group2",
						"label" : "group2",
						"checked" : pfs === "group2"
					}, {
						"selectId" : "group5",
						"label" : "group5",
						"checked" : pfs === "group5"
					}, {
						"selectId" : "group14",
						"label" : "group14",
						"checked" : pfs === "group14"
					}
				]
			}
			$scope.$watch("service.ikepolicy", function (newV, oldV) {
				$scope.ikepolicy.encryption_algorithm.value = getEncryptionAlgorithmByType("ike");
				$scope.ikepolicy.pfs.value = getpfsByType("ike");
				$scope.ikepolicy.ike_version.value = getIkeVerion()
			});
			$scope.$watch("service.ipsecpolicy", function (newV, oldV) {
				$scope.ipsecpolicy.encryption_algorithm.value = getEncryptionAlgorithmByType("ipsec");
				$scope.ipsecpolicy.pfs.value = getpfsByType("ipsec");
				$scope.ipsecpolicy.transform_protocol.value = getTransformProtocol()
			});
            UnifyValid.sharePwdRegularCheck = function () {
                var inputValue = $(this).val();
                if (!inputValue) {
                    return false
                }
                //长度范围是[8,127]
                if (inputValue.length > 127 || inputValue.length < 8) {
                    return false
                }
                //必须包含大写英文字母，小写英文字母、数字中的两种
                var reg1 = /.*[A-Z]+.*/;
                var reg2 = /.*[a-z]+.*/;
                var reg3 = /.*[0-9]+.*/;
                if (!reg1.test(inputValue) && !reg2.test(inputValue)) {
                    return false;
                }
                if (!reg1.test(inputValue) && !reg3.test(inputValue)) {
                    return false;
                }
                if (!reg2.test(inputValue) && !reg3.test(inputValue)) {
                    return false;
                }

                //必须包含除‘, ", \, ?外的特殊字符(注：不支持单引号‘，双引号“，斜杠\，问号？)
                var specialCharacter1 = /[\ \`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\\\|\[\{\}\]\;\:\,\<\.\>\/]+/;
                var specialCharacter2 = /[\\\'\"\?]+/;
                if(!specialCharacter1.test(inputValue) || specialCharacter2.test(inputValue)){
                    return false;
                }
                return true
            };
			UnifyValid.pwdEqualValid = function (dom2) {
				if ($(this).val() === $("#" + dom2).widget().getValue()) {
					return true
				} else {
					return false
				}
			}
		}
	];
	return ctrl
});
