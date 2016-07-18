define([
    'jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/services/exceptionService",
    'tiny-common/UnifyValid',
    "app/services/validatorService",
    "language/keyID",
    "app/services/messageService",
    "app/framework/directive/directiveFM",
    "tiny-directives/Textbox",
    "tiny-widgets/Window",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "fixtures/userFixture"],
    function ($, angular, http, ExceptionService, UnifyValid, ValidatorService, keyID, MessageService, fm) {
        var userSettingCtrl = ["$scope", "$compile", 'camel', "validator", function ($scope, $compile, camel, validator) {
            var user = $("html").scope().user;
            // 管理侧是否是ICT场景 cloudType为OPENSTACK，租户侧cloudType为ICT
            $scope.openstack = (user.cloudType === "OPENSTACK" || user.cloudType === "ICT" ? true : false);
            var colon = ":";
            UnifyValid.emailCheck = function (id) {
                var email = $("#" + id).widget().getValue();
                if (!email || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(email)) {
                    return true;
                }
                return false;
            };
            UnifyValid.phoneCheck = function (id) {
                var phone = $("#" + id).widget().getValue();
                if (!phone || /^[\\+]?[0-9]{1,20}$/.test(phone)) {
                    return true;
                }
                return false;
            };
            $scope.name = {
                "id": "userSettingNameId",
                "label": $scope.i18n.common_term_userName_label + colon,
                "require": true,
                "value": "",
                "type": "input",
                "readonly": true
            };
            $scope.phone = {
                "id": "userSettingPhoneId",
                "label": $scope.i18n.common_term_phoneNo_label + colon,
                "value": "",
                "require": false,
                "type": "input",
                "extendFunction": ["phoneCheck"],
                "validate": "phoneCheck(userSettingPhoneId):" + $scope.i18n.common_term_compositionUserPhone_valid+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:20}),
                "readonly": false
            };
            $scope.email = {
                "id": "userSettingEmailId",
                "label": $scope.i18n.common_term_email_label + colon,
                "value": "",
                "require": false,
                "type": "input",
                "extendFunction": ["emailCheck"],
                "validate": "emailCheck(userSettingEmailId):" + $scope.i18n.common_term_format_valid +
                    ";maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128}),
                "readonly": false
            };
            $scope.roleModel = {
                "id": "selectRoleTblId",
                "label": $scope.i18n.common_term_role_label + colon,
                "enable-pagination": false,
                "datas": [],
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_role_label,
                        "mData": "roleName",
                        "sWidth": "30%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": "description",
                        "bSortable": false
                    },
                    {
                        "sTitle": "ID",
                        "mData": "id",
                        "bSortable": false,
                        "bVisible": false
                    }
                ],
                "renderRow": function (row, dataitem, index) {
                    $("td:eq(0)", row).addTitle();
                    $("td:eq(1)", row).addTitle();
                },

                "callback": function (evtObj) {
                }
            };

            //设置用户基本信息
            var setBasicUserInfo = function (data) {
                if (!data) {
                    return;
                }
                var userInfo = data.userInfo;
                if (!userInfo) {
                    return;
                }

                $scope.name.value = userInfo.name;
                $("#userSettingPhoneId").widget().option("value", userInfo.phoneNumber);
                $("#userSettingEmailId").widget().option("value", userInfo.email);

                var userRoleInfoList = data.roleList;
                if (!userRoleInfoList) {
                    return;
                }

                var tmpId = "";
                var roleList = [];
                for (var index in userRoleInfoList) {
                    tmpId = userRoleInfoList[index].id;
                    var desc = userRoleInfoList[index].description;
                    if (userRoleInfoList[index].defaultRole) {
                        desc = keyID[userRoleInfoList[index].description] || userRoleInfoList[index].description;
                    }
                    roleList.push({
                            "id": tmpId,
                            "roleName": userRoleInfoList[index].name,
                            "description": desc
                        }
                    );
                }
                $scope.roleModel.datas = roleList;
            };

            //获取用户数据
            var getUserDetail = function () {
                var deferred = camel.get({
                    "url": {
                        "s": "/goku/rest/v1.5/{vdc_id}/users/{userId}",
                        "o": {
                            "vdc_id": user.vdcId,
                            "userId": user.id
                        }
                    },
                    "userId": user.id
                });
                deferred.success(function (response) {
                    $scope.$apply(function () {
                        //设置基础信息
                        setBasicUserInfo(response);
                    });
                });
                deferred.fail(function (data) {
                    $scope.$apply(function () {
                        new ExceptionService().doException(data);
                    });
                });
            };
            getUserDetail();

            //获取修改用户参数
            function getParams() {
                var userSetting = {
                    "email": $("#userSettingEmailId").widget().getValue()
                };
                if(!$scope.openstack){
                    userSetting.phoneNumber = $("#userSettingPhoneId").widget().getValue();
                }
                var params = JSON.stringify(userSetting);
                return params;
            }

            $scope.modifyBtn = {
                "id": "userSettingModifyBtnId",
                "text": $scope.i18n.user_term_modify_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#userSettingDiv"));
                    if (!result) {
                        return;
                    }
                    var params = getParams();
                    var deferred = camel.put({
                        "url": {
                            "s": "/goku/rest/v1.5/users/{id}/selfInfo",
                            "o": {
                                "id": user.id
                            }
                        },
                        "params": getParams(),
                        "userId": user.id
                    });

                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $("#userSettingWindowId").widget().destroy();
                            new MessageService().okMsgBox($scope.i18n.common_term_operationSucceed_msg);
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(response);
                        });
                    });
                }
            };
            $scope.cancelBtn = {
                "id": "userSettingCancelBtnId",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#userSettingWindowId").widget().destroy();
                }
            };
        }];
        var userSettingModule = angular.module("userMgr.user.modifySelf", ["ng", "wcc", fm.name]);
        userSettingModule.controller("userMgr.user.modifySelf.ctrl", userSettingCtrl);
        userSettingModule.service("camel", http);
        userSettingModule.service("validator", ValidatorService);
        return userSettingModule;
    });