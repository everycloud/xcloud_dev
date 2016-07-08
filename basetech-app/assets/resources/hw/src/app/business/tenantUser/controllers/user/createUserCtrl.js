define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "app/services/httpService",
        "tiny-widgets/Checkbox",
        "tiny-widgets/Message",
        "tiny-common/UnifyValid",
        "app/services/validatorService",
        "app/services/exceptionService",
        "app/business/tenantUser/service/userDomainService",
        "app/services/competitionConfig",
        "language/keyID",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/RadioGroup",
        "tiny-directives/IP",
        "tiny-directives/DateTime",
        "fixtures/tenantUserFixture"
    ],
    function (sprintf, $, angular, ngSanitize,http, Checkbox, Message, UnifyValid, validatorService, exceptionService, userDomainService,Competition, KeyID, _) {
        "use strict";
        var createUserCtrl = ['$scope', "$q", 'camel', "exception",
            function ($scope, $q, camel, exception) {
                //公共服务实例
                var serviceInstance = new userDomainService(exception, $q, camel);
                var user = $("html").scope().user;
                KeyID.sprintf = sprintf.sprintf;
                $scope.i18n = KeyID;
                var i18n = $scope.i18n;

                $scope.openstack = (user.cloudType === "ICT");
                var validator = new validatorService();

                var mustContainTip = $scope.i18n.common_term_compositionInclude4_valid || "至少包含大写英文字母、小写英文字母和数字中的两种字符。";
                UnifyValid.pwdCheck = function (ids) {
                    if ($scope.openstack) {
                        return true;
                    }
                    var idList = ids[0].split(",");
                    var pwd = $("#" + idList[0]).widget().getValue();

                    if (!validator.checkMustContain(pwd)) {
                        return mustContainTip;
                    }
                    return true;
                };

                //选择的角色列表
                var selelctRoleList = [];
                $scope.name = {
                    "id": "createUserNameId",
                    "label": i18n.common_term_userName_label+":",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "tips": i18n.common_term_composition1_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "20"),
                    "validate": "required:" + i18n.common_term_null_valid + ";maxSize(20):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 20}) + ";regularCheck(" +
                        validator.userNameRe + "):" + i18n.common_term_composition1_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "20") + ";"
                };
                $scope.thirdPartyUser = false;
                $scope.thirdPartyUserCheckbox = {
                    "id": "thirdPartyUserCheckboxId",
                    "checked": false,
                    "display": false,
                    "text": i18n.user_user_add_para_type_option_ad_value,
                    "change": function () {
                        var checked = $("#" + $scope.thirdPartyUserCheckbox.id).widget().option("checked");
                        if (checked) {
                            $("#" + $scope.password.id).widget().option("disable", true);
                            $("#" + $scope.confirmPassword.id).widget().option("disable", true);
                        } else {
                            $("#" + $scope.password.id).widget().option("disable", false);
                            $("#" + $scope.confirmPassword.id).widget().option("disable", false);
                        }
                        $scope.thirdPartyUser = checked;
                    }
                };
                $scope.password = {
                    "id": "createUserPwdId",
                    "label": i18n.common_term_psw_label + ":",
                    "require": true,
                    "value": "",
                    "type": "password",
                    "disabled": false,
                    "tips": $scope.openstack? "": i18n.common_term_compositionInclude4_valid,
                    "extendFunction": ["pwdCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";pwdCheck(createUserPwdId,createUserNameId)"

                };
                $scope.confirmPassword = {
                    "id": "createUserConfirmPwdId",
                    "label": i18n.common_term_PswConfirm_label+":",
                    "require": true,
                    "value": "",
                    "type": "password",
                    "disabled": false,
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "required:" + i18n.common_term_null_valid + ";infoPwdEqual:" + i18n.common_term_pswDifferent_valid + ";"
                };
                UnifyValid.infoPwdEqual = function () {
                    if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.confirmPassword.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };

                $scope.phone = {
                    "id": "createUserPhoneId",
                    "label": i18n.common_term_phoneNo_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "extendFunction": ["phoneCheck"],
                    "validate": "phoneCheck(createUserPhoneId):" + $scope.i18n.common_term_compositionUserPhone_valid+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:20}),
                    "readonly": false
                };

                UnifyValid.phoneCheck = function (id) {
                    var phone = $("#" + id).widget().getValue();
                    if (!phone || /^[\\+]?[0-9]{1,20}$/.test(phone)) {
                        return true;
                    }
                    return false;
                };

                $scope.email = {
                    "id": "createUserEmailId",
                    "label": i18n.common_term_email_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "extendFunction": ["emailCheck"],
                    "validate": "emailCheck(createUserEmailId):" + $scope.i18n.common_term_format_valid +
                        ";maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128}),
                    "readonly": false
                };

                UnifyValid.emailCheck = function (id) {
                    var email = $("#" + id).widget().getValue();
                    if (!email || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(email)) {
                        return true;
                    }
                    return false;
                };

                $scope.description = {
                    "id": "createUserDescId",
                    "label": i18n.common_term_desc_label +  ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 400,
                    "height": 60,
                    "readonly": false,
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128})
                };
                $scope.selectRoleLabel = i18n.user_term_chooseRole_msg;
                $scope.roleModel = {
                    "id": "selectRoleTblId",
                    "require": true,
                    "label": i18n.common_term_role_label+":",
                    "pagination": false,
                    "datas": [],
                    "columns": [{
                        "sTitle": "",
                        "mData": "check",
                        "sWidth": "40px",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_role_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.roleName);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": "ID",
                        "mData": "id",
                        "bSortable": false,
                        "bVisible": false
                    }],
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
                                if ($("#" + options.id).widget().option("checked")) {
                                    selelctRoleList.push(dataitem.id);
                                    var tableChecked = true;
                                    for (var i = 0; i < $(tableId).widget().options.data.length; i++) {
                                        if ($("#roleListCheckbox_" + i).widget().option("checked") === false) {
                                            tableChecked = false;
                                            break;
                                        }
                                    }
                                    $(headCheckboxId).widget().option("checked", tableChecked);
                                    $("#showRoleTableTip").css("display", "none");
                                } else {
                                    for (var j = 0; j < selelctRoleList.length; j++) {
                                        if (selelctRoleList[j] === dataitem.id) {
                                            selelctRoleList.splice(j, 1);
                                            break;
                                        }
                                    }
                                    $(headCheckboxId).widget().option("checked", false);
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', row).html(checkbox.getDom());
                    }
                };
                $scope.accessControlDisplay = false;
                $scope.accessControl = {
                    "id": "accessControlId",
                    "label": "",
                    "checked": false,
                    "height": 28,
                    "text": i18n.user_user_add_para_limit_label,
                    "change": function () {
                        var checked = $("#" + $scope.accessControl.id).widget().option("checked");
                        $scope.accessControlDisplay = checked;
                    }
                };
                $scope.labelModel = {
                    "dateLabel": i18n.common_term_date_label+":",
                    "timeLabel": i18n.common_term_time_label+":"
                };
                $scope.startDate = {
                    "id": "startDateId",
                    "type": "date",
                    "dateFormat": "yy-mm-dd"
                };
                $scope.endDate = {
                    "id": "endDateId",
                    "type": "date",
                    "dateFormat": "yy-mm-dd"
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
                $scope.ipDisplayType = "NO_LIMIT";
                $scope.labelWidth = 70;
                $scope.ipAddressRadioGroup = {
                    "id": "ipAddressRadioGroupId",
                    "label": i18n.common_term_IP_label +":",
                    "values": [{
                        "key": "NO_LIMIT",
                        "text": i18n.common_term_notLimit_value,
                        "checked": true
                    }, {
                        "key": "IP_ADDRESS",
                        "text": i18n.common_term_IP_label,
                        "checked": false
                    }, {
                        "key": "IP_ADDRESS_SEG",
                        "text": i18n.common_term_IPsegment_label,
                        "checked": false
                    }, {
                        "key": "SUBNET",
                        "text": i18n.common_term_Subnet_label,
                        "checked": false
                    }],
                    "change": function () {
                        $scope.ipDisplayType = $("#" + $scope.ipAddressRadioGroup.id).widget().opChecked("checked");
                    }
                };
                $scope.ipAddress = {
                    "id": "ipAddressId",
                    "label": i18n.common_term_IP_label+":",
                    "require": true,
                    "value": ""
                };
                $scope.startIpAddress = {
                    "id": "startIpAddressId",
                    "label": i18n.common_term_initiativeIP_label+":",
                    "require": true,
                    "value": ""
                };
                $scope.endIpAddress = {
                    "id": "endIpAddressId",
                    "label": i18n.common_term_endIP_label+":",
                    "require": true,
                    "value": ""
                };
                $scope.subnetIpAddress = {
                    "id": "subnetIpAddressId",
                    "label": i18n.common_term_IP_label+":",
                    "require": true,
                    "value": ""
                };
                $scope.subnetMask = {
                    "id": "subnetMaskId",
                    "label": i18n.common_term_SubnetMask_label+":",
                    "require": true,
                    "value": ""
                };
                //获取角色列表
                function getSelectedRoles() {
                    var roleIds = [];
                    var roles = $scope.roleModel.datas;
                    if (roles === undefined || roles === null) {
                        return roleIds;
                    }

                    var roleList = $scope.roleModel.datas;
                    if (roleList === undefined || roleList === null) {
                        return roleIds;
                    }

                    for (var i = 0; i < roleList.length; i++) {
                        if ($("#roleListCheckbox_" + i).widget().option("checked")) {
                            roleIds.push(roleList[i].id);
                        }
                    }
                    return roleIds;
                }

                //获取创建用户参数
                function getParams() {
                    var password = "";
                    var confirmPassword = "";
                    var userType = "LDAP_USER";
                    if (!$scope.thirdPartyUser) {
                        userType = "NATIVE_USER";
                        password = $("#createUserPwdId").widget().getValue();
                        confirmPassword = $("#createUserConfirmPwdId").widget().getValue();
                    }
                    var roleIds = getSelectedRoles();
                    var createUser = {
                        "name": $("#createUserNameId").widget().getValue(),
                        "password": password,
                        "userType": userType,
                        "roleIds": roleIds,
                        "email": $("#createUserEmailId").widget().getValue(),
                        "phoneNumber": $("#createUserPhoneId").widget().getValue(),
                        "description": $("#createUserDescId").widget().getValue()
                    };
                    //访问时间和IP
                    var accessCtrl = $scope.accessControlDisplay;
                    var startDate = "";
                    var endDate = "";
                    var startTime = "";
                    var endTime = "";
                    var ipAddressType = "NO_LIMIT";
                    var ipRange = "";
                    if (accessCtrl) {
                        ipAddressType = $scope.ipDisplayType;
                        startDate = $("#startDateId").widget().getDateTime("1");
                        endDate = $("#endDateId").widget().getDateTime("1");
                        startTime = $("#startTimeId").widget().getDateTime("1");
                        endTime = $("#endTimeId").widget().getDateTime("1");
                        if (ipAddressType === "NO_LIMIT") {
                            ipRange = "";
                        } else if (ipAddressType === "IP_ADDRESS") {
                            ipRange = $("#ipAddressId").widget().getValue();
                        } else if (ipAddressType === "IP_ADDRESS_SEG") {
                            ipRange = $("#startIpAddressId").widget().getValue() + "-" + $("#endIpAddressId").widget().getValue();
                        } else if (ipAddressType === "SUBNET") {
                            ipRange = $("#subnetIpAddressId").widget().getValue() + "-" + $("#subnetMaskId").widget().getValue();
                        }
                        var controlInfo = {
                            "startDate": startDate,
                            "endDate": endDate,
                            "startTime": startTime,
                            "endTime": endTime,
                            "ipConfigType": ipAddressType,
                            "ipRange": ipRange
                        };
                        createUser.controlInfo = controlInfo;
                    }
                    return createUser;
                }

                $scope.createBtn = {
                    "id": "createUserCreateBtnId",
                    "text": i18n.common_term_create_button,
                    "click": function () {
                        var userName = UnifyValid.FormValid($("#createUserNameId"));
                        var pwd = UnifyValid.FormValid($("#createUserPwdId"));
                        var repwd = UnifyValid.FormValid($("#createUserConfirmPwdId"));
                        var isChecked = selectChecked();
                        if (!userName || !pwd || !repwd || !isChecked) {
                            return;
                        }
                        var params = getParams();
                        if (params === null) {
                            return;
                        }
                        $scope.command.createUser(params);
                    }
                };
                $scope.cancelBtn = {
                    "id": "createUserCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createUserWindowId").widget().destroy();
                    }
                };

                //判断是否有选择角色复选框
                function selectChecked() {
                    var isSelectChecked = false;
                    for (var i = 0; i < $("#selectRoleTblId").widget().options.data.length; i++) {
                        if ($("#roleListCheckbox_" + i).widget().option("checked") === false) {
                            isSelectChecked = false;
                            $("#showRoleTableTip").css("display", "block");
                            $("#showRoleTableTip").css("color", "red");
                        } else {
                            isSelectChecked = true;
                            $("#showRoleTableTip").css("display", "none");
                            break;
                        }
                    }
                    return isSelectChecked;
                }
                if ($scope.openstack) {
                    $scope.thirdPartyUserCheckbox.display = false;
                    $("#showAccessControl").css("display", "none");
                } else {
                    $scope.thirdPartyUserCheckbox.display = true;
                    $("#showAccessControl").css("display", "block");
                }
                //Ajax命令
                $scope.command = {
                    //查询角色列表
                    "getRoleList": function () {
                        var options = {
                            "type": "SERVICE_ROLE",
                            "userId": user.id,
                            "vdcId": user.vdcId
                        };
                        var deferred = serviceInstance.queryRoleList(options);
                        deferred.then(function (data) {
                            if (!data && data.length === 0) {
                                return;
                            }
                            var roleList = [];
                            var roleListRes = data.roleList;
                            _.each(roleListRes, function (item) {
                                if(Competition.isBaseOnVmware && item.name === "user"){
                                    //openstack接入vmware场景，去除user角色
                                    return;
                                }
                                var desc = item.description;
                                if (item.defaultRole) {
                                    desc = i18n[item.description] || item.description;
                                }
                                roleList.push({
                                    "check": "",
                                    "id": item.id,
                                    "roleName": item.name,
                                    "description": desc
                                });
                            });
                            $scope.roleModel.datas = roleList;
                        });
                    },
                    //创建用户
                    "createUser": function (params) {
                        var options = {
                            "params": params,
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var deferred = serviceInstance.createUser(options);
                        deferred.then(function (data) {
                            $("#createUserWindowId").widget().destroy();
                        });
                    }
                };

                $scope.command.getRoleList();
            }
        ];
        var app = angular.module("userMgr.user.create", ['ng', "wcc"]);
        app.controller("userMgr.user.create.ctrl", createUserCtrl);
        app.service("camel", http);
        app.service("exception", exceptionService);
        return app;
    });
