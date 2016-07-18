define([
    'jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/services/commonService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/exceptionService",
    "app/services/competitionConfig",
    "language/keyID",
    'tiny-widgets/Message',
    "tiny-widgets/Checkbox",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/RadioGroup"
],
    function ($, angular, http, commonService, UnifyValid, ValidatorService, ExceptionService,Competition, keyID, Message, Checkbox) {
        "use strict";
        var createUserCtrl = ['$scope', 'camel', 'validator',
            function ($scope, camel, validator) {
                var colon = ":";
                var user = $("html").scope().user;
                $scope.openstack = user.cloudType === "OPENSTACK";
                $scope.roleTypeValue = $("#createUserWindowId").widget().option("roleType");
                $scope.orgId = $("#createUserWindowId").widget().option("orgId");
                $scope.connectCharacter = "--";
                $scope.pwdPolicy = undefined;

                var mustContainTip = $scope.i18n.common_term_compositionInclude4_valid || "至少包含大写英文字母、小写英文字母和数字中的两种字符。";
                var containSCTip = $scope.i18n.common_term_specialCharacter_valid;
                var containUNTip = $scope.i18n.user_term_excludeUsername_valid;
                var pwdLengthTip = $scope.i18n.common_term_length_valid;
                UnifyValid.pwdCheck = function (ids) {
                    if (!$scope.pwdPolicy || $scope.openstack) {
                        return true;
                    }
                    var idList = ids[0].split(",");
                    var pwd = $("#" + idList[0]).widget().getValue();
                    var userName = $("#" + idList[1]).widget().getValue() || "";
                    var minLength = $scope.pwdPolicy.minPasswordLength;
                    var maxLength = $scope.pwdPolicy.maxPasswordLength;
                    var containSC = $scope.pwdPolicy.requireSymbols;
                    var containUN = $scope.pwdPolicy.allowUserName;

                    if (!validator.checkMustContain(pwd)) {
                        return mustContainTip;
                    }

                    if (!validator.checkPasswordLength(pwd, minLength, maxLength)) {
                        return $scope.i18n.sprintf(pwdLengthTip, {1: minLength, 2: maxLength});
                    }

                    // 必须包含特殊字符
                    if (containSC) {
                        if (!validator.checkContainSpecialCharacter(pwd)) {
                            return containSCTip;
                        }
                    }

                    // 不允许包含正序或逆序用户名
                    if (!containUN) {
                        if (validator.checkContainUserName(pwd, userName)) {
                            return containUNTip;
                        }
                    }

                    return true;
                };

                UnifyValid.ipCheck = function (id) {
                    var ip = $("#" + id).widget().getValue();
                    return validator.ipValidator(ip);
                };
                UnifyValid.maskCheck = function (maskId) {
                    var mask = $("#" + maskId).widget().getValue();
                    if (!mask || mask === "") {
                        return false;
                    }
                    return validator.maskValidator(mask);
                };
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

                // 创建用户-基本信息
                $scope.name = {
                    "id": "createUserNameId",
                    "label": $scope.i18n.common_term_userName_label + colon,
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false,
                    "tooltip": $scope.i18n.common_term_composition1_valid + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 20}),
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(20):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 20}) + ";regularCheck(" + validator.userNameRe + "):" +
                        $scope.i18n.common_term_composition1_valid
                };
                $scope.thirdPartyUser = false;
                $scope.thirdPartyUserCheckbox = {
                    "id": "thirdPartyUserCheckboxId",
                    "checked": false,
                    "text": $scope.i18n.user_user_add_para_type_option_ad_value,
                    "change": function () {
                        var checked = $("#" + $scope.thirdPartyUserCheckbox.id).widget().option("checked");
                        $scope.thirdPartyUser = checked;
                    }
                };
                $scope.password = {
                    "id": "createUserPwdId",
                    "label": $scope.i18n.common_term_psw_label + colon,
                    "require": true,
                    "value": "",
                    "type": "password",
                    "disabled": false,
                    "readonly": false,
                    "tooltip": $scope.openstack ? "" : $scope.i18n.common_term_compositionUserPsw_valid,
                    "extendFunction": ["pwdCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";pwdCheck(createUserPwdId,createUserNameId)"
                };
                $scope.confirmPassword = {
                    "id": "createUserConfirmPwdId",
                    "label": $scope.i18n.common_term_PswConfirm_label + colon,
                    "require": true,
                    "value": "",
                    "type": "password",
                    "readonly": false,
                    "disable": true,
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid + ";"
                };
                UnifyValid.infoPwdEqual = function () {
                    if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.confirmPassword.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.roleType = {
                    "id": "roleTypeId",
                    "label": $scope.i18n.role_term_roleType_label + colon,
                    "display": $("html").scope().isServiceCenter && !$scope.orgId,
                    "value": $scope.roleTypeValue,
                    "require": true,
                    "values": [
                        {
                            "key": "SYSTEM_ROLE",
                            "text": $scope.i18n.role_term_sysMgrRole_value,
                            "checked": "SYSTEM_ROLE" == $scope.roleTypeValue
                        },
                        {
                            "key": "SERVICE_ROLE",
                            "text": $scope.i18n.role_term_serviceMgrRole_value,
                            "checked": "SYSTEM_ROLE" != $scope.roleTypeValue
                        }
                    ],
                    "change": function () {
                        $scope.roleType.value = $("#" + $scope.roleType.id).widget().opChecked("checked");
                        $scope.operator.initRoleList();
                    },
                    "layout": "vertical"
                };
                $scope.phone = {
                    "id": "createUserPhoneId",
                    "label": $scope.i18n.common_term_phoneNo_label + colon,
                    "value": "",
                    "require": false,
                    "type": "input",
                    "extendFunction": ["phoneCheck"],
                    "validate": "phoneCheck(createUserPhoneId):" + $scope.i18n.common_term_compositionUserPhone_valid + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 20}),
                    "readonly": false
                };
                $scope.email = {
                    "id": "createUserEmailId",
                    "label": $scope.i18n.common_term_email_label + colon,
                    "value": "",
                    "require": false,
                    "type": "input",
                    "extendFunction": ["emailCheck"],
                    "validate": "emailCheck(createUserEmailId):" + $scope.i18n.common_term_format_valid +
                        ";maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128}),
                    "readonly": false
                };
                $scope.description = {
                    "id": "createUserDescId",
                    "label": $scope.i18n.common_term_desc_label + colon,
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 400,
                    "height": 60,
                    "readonly": false,
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128})
                };
                $scope.roleModel = {
                    "id": "selectRoleTblId",
                    "label": $scope.i18n.common_term_role_label + colon,
                    "datas": [],
                    "height": 100,
                    "columns": [
                        {
                            "sTitle": "",
                            "mData": "check",
                            "sWidth": "40px",
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_role_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "sWidth": "30%",
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        }
                    ],
                    "pagination": false,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": false,
                    "curPage": {
                        "pageIndex": 1
                    },
                    "requestConfig": {
                        "enableRefresh": true,
                        "refreshInterval": 6000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false,

                    "renderRow": function (row, dataitem, index) {
                        $("td:eq(1)", row).addTitle();
                        $("td:eq(2)", row).addTitle();
                        //复选框
                        var options = {
                            "id": "roleListCheckbox_" + index,
                            "checked": false,
                            "change": function () {
                                var tableId = "#" + $scope.roleModel.id;
                                var headCheckboxId = "#roleTableHeadCheckbox";
                                // 设置此行的选定状态
                                row.check = $("#" + options.id).widget().option("checked");

                                // 设置复选框的选定状态
                                if (row.check) {
                                    var tableChecked = true;
                                    for (var i = 0; i < $(tableId).widget().options.data.length; i++) {
                                        if ($("#roleListCheckbox_" + i).widget().option("checked") == false) {
                                            tableChecked = false;
                                            break;
                                        }
                                    }
                                    $(headCheckboxId).widget().option("checked", tableChecked);
                                } else {
                                    $(headCheckboxId).widget().option("checked", false);
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', row).html(checkbox.getDom());
                    },

                    "callback": function (evtObj) {
                    }
                };
                $scope.accessControlDisplay = false;
                $scope.accessControl = {
                    "id": "accessControlId",
                    "label": "",
                    "checked": false,
                    "height": 28,
                    "text": $scope.i18n.user_user_add_para_limit_label,
                    "change": function () {
                        var checked = $("#" + $scope.accessControl.id).widget().option("checked");
                        $scope.accessControlDisplay = checked;
                    }
                };
                $scope.labelModel = {
                    "dateLabel": $scope.i18n.common_term_date_label + colon,
                    "timeLabel": $scope.i18n.common_term_time_label + colon
                };
                $scope.startDate = {
                    "id": "startDateId",
                    "type": "date",
                    "dateFormat": "yy-mm-dd",
                    "defaultDate": "",
                    "onClose": function (date) {
                        $("#" + $scope.endDate.id).widget().option("minDate", date);
                    }
                };
                $scope.endDate = {
                    "id": "endDateId",
                    "type": "date",
                    "dateFormat": "yy-mm-dd",
                    "onClose": function (date) {
                        $("#" + $scope.startDate.id).widget().option("maxDate", date);
                    }
                };
                $scope.startTime = {
                    "id": "startTimeId",
                    "type": "time",
                    "timeFormat": "hh:mm:ss",
                    "defaultTime": "00:00:00"
                };
                $scope.endTime = {
                    "id": "endTimeId",
                    "type": "time",
                    "timeFormat": "hh:mm:ss",
                    "defaultTime": "23:59:59"
                };

                // 控制显示的ip地址类型
                $scope.ipDisplayType = "";
                $scope.labelWidth = 60;
                $scope.ipAddressRadioGroup = {
                    "id": "ipAddressRadioGroupId",
                    "label": $scope.i18n.common_term_IP_label + colon,
                    "values": [
                        {
                            "key": 1,
                            "text": $scope.i18n.common_term_notLimit_value,
                            "checked": true
                        },
                        {
                            "key": 2,
                            "text": $scope.i18n.common_term_IP_label,
                            "checked": false
                        },
                        {
                            "key": 3,
                            "text": $scope.i18n.common_term_IPsegment_label,
                            "checked": false
                        },
                        {
                            "key": 4,
                            "text": $scope.i18n.common_term_Subnet_label,
                            "checked": false
                        }
                    ],
                    "change": function () {
                        var checked = $("#" + $scope.ipAddressRadioGroup.id).widget().opChecked("checked");
                        if (2 == checked) {
                            $scope.ipDisplayType = "ipAddressDisplay";
                        } else if (3 == checked) {
                            $scope.ipDisplayType = "ipAddressGroupDisplay";
                        } else if (4 == checked) {
                            $scope.ipDisplayType = "subnetDisplay";
                        } else {
                            $scope.ipDisplayType = "";
                        }
                    }
                };

                $scope.ipAddress = {
                    "id": "ipAddressId",
                    "label": $scope.i18n.common_term_IP_label + colon,
                    "require": true,
                    "value": "",
                    "extendFunction": ["ipCheck"],
                    "validate": "ipCheck(ipAddressId):" + $scope.i18n.common_term_formatIP_valid + ";"
                };
                $scope.startIpAddress = {
                    "id": "startIpAddressId",
                    "label": $scope.i18n.common_term_initiativeIP_label + colon,
                    "require": true,
                    "value": "",
                    "extendFunction": ["ipCheck"],
                    "validate": "ipCheck(startIpAddressId):" + $scope.i18n.common_term_formatIP_valid + ";"
                };
                $scope.endIpAddress = {
                    "id": "endIpAddressId",
                    "label": $scope.i18n.common_term_endIP_label + colon,
                    "require": true,
                    "value": "",
                    "extendFunction": ["ipCheck"],
                    "validate": "ipCheck(endIpAddressId):" + $scope.i18n.common_term_formatIP_valid + ";"
                };
                $scope.subnetIpAddress = {
                    "id": "subnetIpAddressId",
                    "label": $scope.i18n.common_term_IP_label + colon,
                    "require": true,
                    "value": "",
                    "extendFunction": ["ipCheck"],
                    "validate": "ipCheck(subnetIpAddressId):" + $scope.i18n.common_term_formatIP_valid + ";"
                };
                $scope.subnetMask = {
                    "id": "subnetMaskId",
                    "label": $scope.i18n.common_term_SubnetMask_label + colon,
                    "require": true,
                    "value": "",
                    "extendFunction": ["maskCheck"],
                    "validate": "maskCheck(subnetMaskId):" + $scope.i18n.common_term_formatSubnetMask_valid + ";"
                };

                $scope.getUserType = function () {
                    if ($scope.thirdPartyUser) {
                        return "LDAP_USER";
                    } else {
                        return "NATIVE_USER";
                    }
                };
                $scope.createBtn = {
                    "id": "createUserCreateBtnId",
                    "text": $scope.i18n.common_term_create_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#createUserDiv"));
                        if (!result) {
                            return;
                        }
                        var roleIds = $scope.operator.getSelectedRoles();
                        if (!roleIds || roleIds.length === 0) {
                            $scope.operator.errorMsg();
                            return;
                        }
                        var userType = $scope.getUserType();
                        var createUser = {
                            "name": $("#createUserNameId").widget().getValue(),
                            "password": $("#createUserPwdId").widget().getValue(),
                            "userType": userType,
                            "email": $("#createUserEmailId").widget().getValue(),
                            "description": $("#createUserDescId").widget().getValue(),
                            "roleIds": roleIds
                        };
                        if ($scope.orgId) {
                            createUser.vdcId = $scope.orgId;
                        }
                        if (!$scope.openstack) {
                            createUser.phoneNumber = $("#createUserPhoneId").widget().getValue();
                        }

                        if ($scope.accessControlDisplay) {
                            var controlInfo = {};
                            controlInfo.startDate = $("#" + $scope.startDate.id).widget().getDateTime();
                            controlInfo.endDate = $("#" + $scope.endDate.id).widget().getDateTime();
                            controlInfo.startTime = $("#" + $scope.startTime.id).widget().getDateTime();
                            controlInfo.endTime = $("#" + $scope.endTime.id).widget().getDateTime();
                            if (controlInfo.startDate == controlInfo.endDate && !timeValidate(controlInfo.startTime, controlInfo.endTime)) {
                                $scope.operator.errorMsg($scope.i18n.user_user_add_para_time_valid || "结束时间应晚于或等于开始时间。");
                                return;
                            }
                            controlInfo.startTime = formatTime(controlInfo.startTime);
                            controlInfo.endTime = formatTime(controlInfo.endTime);
                            var ipConfigType = "NO_LIMIT";
                            var ipRange = "";
                            if ($scope.ipDisplayType === "ipAddressDisplay") {
                                ipConfigType = "IP_ADDRESS";
                                ipRange = $("#" + $scope.ipAddress.id).widget().getValue();
                            } else if ($scope.ipDisplayType === "ipAddressGroupDisplay") {
                                ipConfigType = "IP_ADDRESS_SEG";
                                var startIP = $("#" + $scope.startIpAddress.id).widget().getValue();
                                var endIP = $("#" + $scope.endIpAddress.id).widget().getValue();
                                if (validator.ipCompare(startIP, endIP)) {
                                    ipRange = startIP + "-" + endIP;
                                } else {
                                    $scope.operator.errorMsg($scope.i18n.common_term_endGreaterEqualStartIP_valid || "结束IP地址必须大于等于开始IP地址。");
                                    return;
                                }
                            } else if ($scope.ipDisplayType === "subnetDisplay") {
                                ipConfigType = "SUBNET";
                                ipRange = $("#" + $scope.subnetIpAddress.id).widget().getValue() + "-" +
                                    $("#" + $scope.subnetMask.id).widget().getValue();
                            }
                            controlInfo.ipConfigType = ipConfigType;
                            controlInfo.ipRange = ipRange;

                            createUser.controlInfo = controlInfo;
                        }

                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/users",
                                o: {
                                    "tenant_id": "1"
                                }
                            },
                            "params": JSON.stringify(createUser),
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $("#createUserWindowId").widget().destroy();
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
                    "id": "createUserCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createUserWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "initRoleList": function () {
                        var roleType = $scope.roleType.value;
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles?type={roleType}",
                                o: {
                                    "tenant_id": 1,
                                    "roleType": roleType
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                response = response || {total: 0, roleList: []};
                                var datas = [];
                                var roleListRes = response.roleList;
                                for (var index in roleListRes) {
                                    if(Competition.isBaseOnVmware && roleListRes[index].name === "user"){
                                        //openstack接入vmware场景，去除user角色
                                        continue;
                                    }
                                    var description = roleListRes[index].description;
                                    if (roleListRes[index].defaultRole) {
                                        description = keyID[roleListRes[index].description] || roleListRes[index].description;
                                    }
                                    var role = {
                                        "id": roleListRes[index].id,
                                        "name": roleListRes[index].name,
                                        "description": description,
                                        "check": ""
                                    };
                                    if ($("html").scope().isServiceCenter && roleType == "SERVICE_ROLE" && !$scope.orgId) {
                                        if (roleListRes[index].name == "vdcServiceManager" && roleListRes[index].defaultRole) {
                                            datas.push(role);
                                        }
                                    }
                                    else {
                                        datas.push(role);
                                    }
                                }

                                $("#roleTableHeadCheckbox").widget().option("checked", false);
                                $scope.roleModel.datas = datas;
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                $scope.roleModel.datas = [];
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "getSelectedRoles": function () {
                        var roleIds = [];
                        var roles = $scope.roleModel.datas;
                        if (!roles) {
                            return roleIds;
                        }

                        var roleList = $scope.roleModel.datas;
                        if (!roleList) {
                            return roleIds;
                        }

                        for (var i = 0; i < roleList.length; i++) {
                            if ($("#roleListCheckbox_" + i).widget().option("checked")) {
                                roleIds.push(roleList[i].id);
                            }
                        }
                        return roleIds;
                    },
                    "errorMsg": function (message) {
                        var msg = new Message({
                            "type": "error",
                            "title": $scope.i18n.user_term_chooseRole_label,
                            "content": message || $scope.i18n.user_term_chooseRole_label,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    accessKey: '2',
                                    "key": "okBtn",
                                    majorBtn: true,
                                    default: true
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    accessKey: '3',
                                    "key": "cancelBtn",
                                    default: false
                                }
                            ]
                        });
                        msg.setButton("okBtn", function () {
                            msg.destroy();
                        });
                        msg.setButton("cancelBtn", function () {
                            msg.destroy();
                        });
                        msg.show();
                    },
                    "getPasswordPolicy": function () {
                        var deferred = camel.get({
                            url: "/goku/rest/v1.5/system/password-policy",
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (response && response.pwdPolicy) {
                                    $scope.pwdPolicy = response.pwdPolicy;
                                }
                            });
                        });
                    }
                };
                function timeValidate(startTime, endTime) {
                    if (startTime && endTime) {
                        var startTimeHMS = startTime && startTime.split(":");
                        var endTimeHMS = endTime && endTime.split(":");
                        if (startTimeHMS.length === 3 && endTimeHMS.length === 3) {
                            var start = parseInt(startTimeHMS[2]) + parseInt(startTimeHMS[1]) * 60 + parseInt(startTimeHMS[0]) * 3600;
                            var end = parseInt(endTimeHMS[2]) + parseInt(endTimeHMS[1]) * 60 + parseInt(endTimeHMS[0]) * 3600;
                            return start <= end;
                        }
                        return false;
                    }
                    return true;
                }

                function formatTime(time) {
                    if (time) {
                        var timeHMS = time && time.split(":");
                        for (var i = 0; i < 3; i++) {
                            timeHMS[i] = timeHMS[i] || "0";
                            timeHMS[i] = parseInt(timeHMS[i]) < 10 ? "0" + parseInt(timeHMS[i]) : timeHMS[i];
                        }
                        return timeHMS.join(":");
                    }
                    return "";
                }

                // 获取密码策略
                if(!$scope.openstack){
                    $scope.operator.getPasswordPolicy();
                }

                // 初始化角色列表
                $scope.operator.initRoleList();
            }
        ];
        var app = angular.module("userMgr.user.create", ['ng', "wcc"]);
        app.controller("userMgr.user.create.ctrl", createUserCtrl);
        app.service("camel", http);
        app.service("validator", ValidatorService);
        return app;
    });
