/*global define*/
define(["tiny-lib/jquery",
    'app/services/validatorService',
    'tiny-common/UnifyValid'
], function ($, validatorService, UnifyValid) {
    "use strict";

    var ctrl = ["$scope",
        function ($scope) {
            var i18n = $scope.i18n;
            $scope.canChangeSharePwd = !$scope.service.isModifyMode;
            $scope.info = {
                ikePwdChangeBox: {
                    "label": "",
                    "id": "ikePwdBoxId",
                    "text": i18n.common_term_update_button + i18n.vpn_term_IKEsharePsw_label,
                    "checked": false,
                    "change": function () {
                        $scope.canChangeSharePwd = $('#ikePwdBoxId').widget().option("checked");
                    }
                },
                sharepwd: {
                    "id": "create-link-ike-sharepwd",
                    "type": "password",
                    label: i18n.vpn_term_IKEsharePsw_label + ":",
                    value: "",
                    "extendFunction": ["sharePwdRegularCheck"],
                    validate: "required:" + i18n.common_term_null_valid + ";sharePwdRegularCheck():" + i18n.common_term_compositionSpecial3_valid + i18n .sprintf(i18n.common_term_length_valid, 8, 127)
                },
                certainpwd: {
                    "label": i18n.common_term_PswConfirm_label + ":",
                    "id": "create-link-ike-certainpwd",
                    "type": "password",
                    value: "",
                    "extendFunction": ["pwdEqualValid"],
                    validate: "required:" + i18n.common_term_null_valid + ";pwdEqualValid(create-link-ike-sharepwd):" + i18n.common_term_pswDifferent_valid + ";"
                },
                preBtn: {
                    "id": "create-vpn-link-ike-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "remote";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-vpn-link-ike-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {

                        var valid = UnifyValid.FormValid($("#createVpnLinkIKEDiv"));
                        if (!valid) {
                            return;
                        }

                        // 修改场景
                        if ($scope.service.isModifyMode) {
                            //并且勾选了修改密码
                            if ($scope.canChangeSharePwd) {
                                $scope.service.ikeSharedKey = $("#create-link-ike-sharepwd").widget().getValue();
                            } else {
                                $scope.service.ikeSharedKey = "";
                                $scope.service.oldIkeSharedKey = "";
                            }
                        }
                        // 创建场景
                        else {
                            $scope.service.ikeSharedKey = $("#create-link-ike-sharepwd").widget().getValue();
                        }

                        $scope.service.show = "confirm";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-vpn-link-ike-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
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
        }
    ];
    return ctrl;
});
