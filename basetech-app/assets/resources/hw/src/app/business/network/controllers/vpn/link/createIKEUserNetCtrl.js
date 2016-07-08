/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/underscore",
    'app/services/validatorService',
    'tiny-common/UnifyValid'
], function ($, _, validatorService, UnifyValid) {
    "use strict";

    var ctrl = ["$scope", "camel", "$compile",
        function ($scope, camel, $compile) {
            var i18n = $scope.i18n;
            var validator = new validatorService();

            if ($scope.service.isModifyMode) {
                $scope.canChangeSharePwd = false;
                $scope.canChangeWayPwd = false;
            } else {
                $scope.canChangeSharePwd = true;
                $scope.canChangeWayPwd = true;
            }

            $scope.info = {
                ikePwdChangeBox: {
                    "label": "",
                    "id": "ikePwdChangeBoxId",
                    "text": i18n.common_term_update_button + i18n.vpn_term_IKEsharePsw_label,
                    "checked": false,
                    "change": function () {
                        $scope.canChangeSharePwd = $('#ikePwdChangeBoxId').widget().option("checked");
                    }
                },
                sharepwd: {
                    "id": "create-link-userIke-sharepwd",
                    "type": "password",
                    label: i18n.vpn_term_IKEsharePsw_label + ":",
                    value: "",
                    "extendFunction": ["sharePwdRegularCheck"],
                    validate: "required:" + i18n.common_term_null_valid + ";sharePwdRegularCheck():" + i18n.common_term_compositionSpecial3_valid + i18n .sprintf(i18n.common_term_length_valid, 8, 127)
                },
                certainpwd: {
                    "label": i18n.common_term_PswConfirm_label + ":",
                    "id": "create-link-userIke-certainpwd",
                    "type": "password",
                    value: "",
                    "extendFunction": ["pwdEqualValid"],
                    validate: "required:" + i18n.common_term_null_valid + ";pwdEqualValid(create-link-userIke-sharepwd):" + i18n.common_term_pswDifferent_valid
                },
                subnetIP: {
                    "id": "create-link-userIke-subnetIP",
                    "label": i18n.common_term_Subnet_label + ":",
                    "value": "",
                    "extendFunction": ["isIPv4Check"],
                    validate: "required:" + i18n.common_term_null_valid + ";isIPv4Check(create-link-userIke-subnetIP):" + i18n.common_term_formatIP_valid,
                    "type": "ipv4"
                },
                mark: {
                    "id": "create-link-userIke-mark",
                    "label": i18n.common_term_SubnetMask_label + ":",
                    "value": "",
                    "extendFunction": ["maskCheck"],
                    validate: "required:" + i18n.common_term_null_valid + ";maskCheck(create-link-userIke-mark):" + i18n.common_term_formatSubnetIPandMask_valid,
                    "type": "ipv4"
                },
                wayPwdChangeBox: {
                    "label": "",
                    "id": "ikeWayPwdChangeBoxId",
                    "text": i18n.common_term_update_button + i18n.vpn_term_tunnelEncryptPsw_label,
                    "checked": false,
                    "change": function () {
                        $scope.canChangeWayPwd = $('#ikeWayPwdChangeBoxId').widget().option("checked");
                    }
                },
                encryption: {
                    "id": "create-link-userIke-encryption",
                    "type": "password",
                    "extendFunction": ["encryptionValidator"],
                    validate: "required:" + i18n.common_term_null_valid + ";encryptionValidator():" + i18n.common_term_compositionInclude5_valid + i18n .sprintf(i18n.common_term_length_valid, 8, 16),
                    label: i18n.vpn_term_tunnelEncryptPsw_label + ":",
                    value: ""
                },
                sureEncryption: {
                    "label": i18n.vpn_term_tunnelEncryptPswConfirm_label + ":",
                    "id": "create-link-userIke-sureEncryption",
                    validate: "required:" + i18n.common_term_null_valid + ";pwdEqualValid(create-link-userIke-encryption):" + i18n.common_term_pswDifferent_valid,
                    "extendFunction": ["pwdEqualValid"],
                    "type": "password",
                    value: ""
                },
                preBtn: {
                    "id": "create-vpn-link-local-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "basic";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-vpn-link-local-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#create-vpn-usernet-form"));
                        if (!valid) {
                            return;
                        }
                        $scope.service.l2tpInfo.subnetAddr = $("#create-link-userIke-subnetIP").widget().getValue();
                        $scope.service.l2tpInfo.subnetMask = $("#create-link-userIke-mark").widget().getValue();
                        $scope.service.l2tpInfo.tunnelKey = $("#create-link-userIke-encryption").widget().getValue();
                        $scope.service.ikeSharedKey = $("#create-link-userIke-sharepwd").widget().getValue();

                        // 修改场景 并且已经勾选了修改
                        if ($scope.service.isModifyMode) {
                            if ($scope.canChangeSharePwd) {
                                $scope.service.ikeSharedKey = $("#create-link-userIke-sharepwd").widget().getValue();
                            } else {
                                $scope.service.ikeSharedKey = "";
                            }

                            if ($scope.canChangeWayPwd) {
                                $scope.service.l2tpInfo.tunnelKey = $("#create-link-userIke-encryption").widget().getValue();
                            } else {
                                $scope.service.l2tpInfo.tunnelKey = "";
                            }
                        }

                        $scope.service.show = "addUser";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-vpn-link-local-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };
            //校验IPv4是否合法
            UnifyValid.isIPv4Check = function (domId) {
                var ipValue = $("#" + domId).widget().getValue();
                return validator.ipValidator(ipValue);
            };

            //掩码校验
            function maskCheck(mask){
                var exp = /^255\.255\.254\.0|255\.255\.255\.(240|224|192|128|0)$/;
                var reg = mask.match(exp);
                return reg ? true : false;
            };

            //校验ip与掩码是否匹配
            UnifyValid.maskCheck = function () {
                var subnet = $("#create-link-userIke-subnetIP").widget().getValue(); //子网IP
                var mask = $("#create-link-userIke-mark").widget().getValue(); //子网掩码
                if (validator.ipValidator(mask)) {
                    if (maskCheck(mask)) {
                        return validator.maskAndSubnetValidator(mask, subnet);
                    }
                    return false;
                }
                return false;
            };

            // 校验密码是否一致
            UnifyValid.pwdEqualValid = function (dom2) {
                if ($(this).val() === $("#" + dom2).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            // 密码长度1-127字节，由字母字符、数字、除‘, ", \, ?外的特殊字符(注：不支持单引号‘，双引号“，斜杠\，问号？)组成。
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
            //必须包含以下四类字符中的三类：大写字母、小写字母、数字、除？外的特殊字符。8到16位
            UnifyValid.encryptionValidator = function () {
                var inputValue = $(this).val();
                if(!inputValue){
                    return false;
                }
                // 8到16位
                if(inputValue.length > 16 || inputValue.length < 8){
                    return false;
                }

                var lowercaseReg = /[a-z]/;
                var uppercaseReg = /[A-Z]/;
                var numReg = /[0-9]/;
                var specialLetterReg = /[!@#$%*()_+^&}{'":;.=<>\\]/;
                var questionMarkReg = /[?]/;

                if(lowercaseReg.test(inputValue) && uppercaseReg.test(inputValue) && numReg.test(inputValue) && !questionMarkReg.test(inputValue)){
                    return true;
                }
                if(lowercaseReg.test(inputValue) && uppercaseReg.test(inputValue) && specialLetterReg.test(inputValue) && !questionMarkReg.test(inputValue)){
                    return true;
                }
                if(lowercaseReg.test(inputValue) && specialLetterReg.test(inputValue) && numReg.test(inputValue) && !questionMarkReg.test(inputValue)){
                    return true;
                }
                if(specialLetterReg.test(inputValue) && uppercaseReg.test(inputValue) && numReg.test(inputValue) && !questionMarkReg.test(inputValue)){
                    return true;
                }
                return false;
            };
        }
    ];
    return ctrl;
});
