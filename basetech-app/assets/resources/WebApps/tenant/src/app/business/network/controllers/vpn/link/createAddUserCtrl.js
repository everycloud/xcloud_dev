/*global define*/
define([
    "tiny-lib/angular",
    "tiny-lib/jquery",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid'
], function (angular, $, _, UnifyValid) {
    "use strict";

    var ctrl = ["$scope",
        function ($scope) {
            var i18n = $scope.i18n;
            $scope.info = {
                addBtn: {
                    "id": "create-vpn-link-ike-pre",
                    "text": i18n.common_term_add_button,
                    "disable": false,
                    "label": i18n.vpn_term_connectUserList_label + ":",
                    "validateUsername": "required:" + i18n.common_term_null_valid + ";regularCheck(" + /^[a-zA-Z0-9_]{1,16}$/ + "):" + i18n.common_term_composition1_valid + i18n .sprintf(i18n.common_term_length_valid, 1, 16),
                    "validatePwd": "required:" + i18n.common_term_null_valid + ";userPwdValidate():" + i18n.common_term_compositionSpecial1_valid + i18n .sprintf(i18n.common_term_length_valid, 8, 16),
                    "validateConfirmpwd": "required:" + i18n.common_term_null_valid + ";pwdConfirmValid():" + i18n.common_term_pswDifferent_valid + ";",
                    "extendFunction": ["pwdConfirmValid"],
                    "userExtendFunction": ["userPwdValidate"],
                    "click": function () {
                        if ($scope.service.users.length >= 10) {
                            return;
                        }
                        $scope.service.users.push({
                            "userName": "",
                            "userNameId": "userNameId" + $scope.service.totalUserNum,
                            "pwd": "",
                            "oldPwdId": "oldPwdId" + $scope.service.totalUserNum,
                            "pwdId": "pwdId" + $scope.service.totalUserNum,
                            "pwdConfirmId": "pwdConfirmId" + $scope.service.totalUserNum,
                            "repwd": "",
                            "texttype": "password",
                            "pwdChangeBoxId": "pwdChangeBoxId" + $scope.service.totalUserNum,
                            "pwdChangeBoxText": i18n.vpn_connect_add_para_modifyPsw_label,
                            "isDefault": false,
                            "canChangeUserPwd": true
                        });
                        $scope.service.totalUserNum += 1;
                        // 按钮灰化
                        if ($scope.service.users.length >= 10) {
                            $scope.info.addBtn.disable = true;
                        }
                    }
                },
                preBtn: {
                    "id": "create-vpn-link-ike-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "ikeUserNet";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-vpn-link-ike-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createVpnLinkAddUserDiv"), undefined);
                        if (!valid) {
                            return;
                        }
                        $scope.service.l2tpInfo.vpnUsers = [];
                        var users = [];
                        for (var i = 0; i < $scope.service.totalUserNum; i++) {
                            if ($("#userNameId" + i) && $("#userNameId" + i).widget() && $("#pwdId" + i) && $("#pwdId" + i).widget()) {
                                if ($scope.service.isModifyMode) {
                                    users.push({
                                        "userName": $("#userNameId" + i).widget().getValue(),
                                        "texttype": "password",
                                        "pwd": $("#pwdId" + i).widget().getValue(),
                                        "userNameId": "userNameId" + i,
                                        "pwdId": "pwdId" + i,
                                        "pwdConfirmId": "pwdConfirmId" + i,
                                        "isDefault": isDefaultUser("userNameId" + i)
                                    });
                                    $scope.service.l2tpInfo.vpnUsers.push({
                                        "name": $("#userNameId" + i).widget().getValue(),
                                        "password": $("#pwdId" + i).widget().getValue()
                                    });
                                } else {
                                    users.push({
                                        "userName": $("#userNameId" + i).widget().getValue(),
                                        "texttype": "password",
                                        "pwd": $("#pwdId" + i).widget().getValue(),
                                        "userNameId": "userNameId" + i,
                                        "pwdId": "pwdId" + i,
                                        "pwdConfirmId": "pwdConfirmId" + i,
                                        "isDefault": $scope.service.users[i].isDefault
                                    });
                                    $scope.service.l2tpInfo.vpnUsers.push({
                                        "name": $("#userNameId" + i).widget().getValue(),
                                        "password": $("#pwdId" + i).widget().getValue()
                                    });
                                }
                            }
                        }
                        $scope.service.users = users;

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

            // 用户的删除
            $scope["delete"] = function (delIndex) {
                $scope.service.users = _.reject($scope.service.users, function (item, index) {
                    return index === delIndex;
                });

                // 按钮灰化
                if ($scope.service.users.length < 10) {
                    $scope.info.addBtn.disable = false;
                }
            };

            $scope.pwdChangeBoxChange = function (delIndex) {
                $scope.service.users[delIndex].canChangeUserPwd = !$scope.service.users[delIndex].canChangeUserPwd;
            };

            function isDefaultUser(userNameId) {
                var ret = false;
                _.each($scope.service.users, function (user) {
                    if (user.userNameId === userNameId) {
                        ret = user.isDefault || false;
                    }
                });
                return ret;
            }

            // 校验密码是否一致
            UnifyValid.pwdConfirmValid = function () {
                // 根据节点序列获取 已经设置的密码
                var parentId = $(this).parent().attr("id");
                if (!parentId || parentId.length <= 0) {
                    return false;
                }
                if ($(this).val() === $("#pwdId" + parentId.substr(-1)).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            // 必须包含字母、数字、除？外的特殊字符，长度范围是8~16。
            UnifyValid.userPwdValidate = function () {
                // 根据节点序列获取 已经设置的密码
                var inputValue = $(this).val();
                if (!inputValue) {
                    return false;
                }
                if(inputValue.length > 16 || inputValue.length < 8){
                    return false;
                }

                var letterReg = /[a-zA-Z]/;
                var numReg = /[0-9]/;
                var specialLetterReg = /[!@#$%*()_+^&}{'":;.=<>\\]/;
                var questionMarkReg = /[?]/;

                if(letterReg.test(inputValue) && specialLetterReg.test(inputValue) && numReg.test(inputValue) && !questionMarkReg.test(inputValue)){
                    return true;
                }

                return false;
            };
        }
    ];
    return ctrl;
});
