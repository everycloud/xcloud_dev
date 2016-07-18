define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/business/tenantUser/service/userDomainService",
        "app/services/competitionConfig",
        "tiny-common/UnifyValid",
        "app/services/validatorService",
        "tiny-widgets/Checkbox",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Textbox",
        "tiny-widgets/Window",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/RadioGroup",
        "tiny-directives/IP",
        "tiny-directives/DateTime",
        "fixtures/tenantUserFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exceptionService, userDomainService, Competition, UnifyValid, validatorService, Checkbox, _) {
        "use strict";
        var modifyUserCtrl = ["$scope", "$q", "camel", "exception",
            function ($scope, $q, camel, exception) {
                //公共服务实例
                var serviceInstance = new userDomainService(exception, $q, camel);
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                var userId = $("#modifyUserWindowId").widget().option("userId");
                var selelctRoleList = [];
                var userRoleInfoList = [];
                $scope.openstack = (user.cloudType === "ICT");
                var validator = new validatorService();
                $scope.name = {
                    "id": "modifyUserNameId",
                    "label": i18n.common_term_userName_label + ":",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": true
                };

                $scope.phone = {
                    "id": "modifyUserPhoneId",
                    "label": i18n.common_term_phoneNo_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": false,
                    "extendFunction": ["phoneCheck"],
                    "validate": "phoneCheck(modifyUserPhoneId):" + $scope.i18n.common_term_compositionUserPhone_valid+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:20})
                };

                UnifyValid.phoneCheck = function (id) {
                    var phone = $("#" + id).widget().getValue();
                    if (!phone || /^[\\+]?[0-9]{1,20}$/.test(phone)) {
                        return true;
                    }
                    return false;
                };

                $scope.email = {
                    "id": "modifyUserEmailId",
                    "label": i18n.common_term_email_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "extendFunction": ["emailCheck"],
                    "validate": "emailCheck(modifyUserEmailId):" + $scope.i18n.common_term_format_valid +
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
                    "id": "modifyUserDescId",
                    "label": i18n.common_term_desc_label +  ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 400,
                    "height": 60,
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128}),
                    "readonly": false
                };
                $scope.roleModel = {
                    "id": "selectRoleTblId",
                    "require": true,
                    "label": i18n.common_term_role_label+":",
                    "enable-pagination": false,
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
                            "checked": dataitem.check,
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

                //设置用户基本信息
                var setBasicUserInfo = function (response) {
                    if (response === null) {
                        return;
                    }
                    userRoleInfoList = response.roleList;
                    //当前用户已经拥有的角色，默认选中
                    if (response.roleList && response.roleList.length > 0) {
                        _.each(response.roleList, function (item) {
                            selelctRoleList.push(item.id);
                        });
                    }
                    $scope.name.value = response.userInfo.name;
                    $("#modifyUserPhoneId").widget().option("value", response.userInfo.phoneNumber);
                    $("#modifyUserEmailId").widget().option("value", response.userInfo.email);
                    $("#modifyUserDescId").widget().option("value", response.userInfo.description);

                    //访问控制
                    if (response.controlInfo === null ||
                        (response.controlInfo.startDate === null &&
                            response.controlInfo.endDate === null &&
                            response.controlInfo.startTime === null &&
                            response.controlInfo.endTime === null &&
                            response.controlInfo.ipConfigType === null &&
                            response.controlInfo.ipRange === null)) {
                        return;
                    }
                    $scope.accessControlDisplay = true;
                    $("#accessControlId").widget().option("checked", true);

                    var startDate = response.controlInfo.startDate;
                    if (startDate) {
                        $("#startDateId").widget().option("defaultDate", response.controlInfo.startDate);
                    }
                    var endDate = response.controlInfo.endDate;
                    if (endDate) {
                        $("#endDateId").widget().option("defaultDate", response.controlInfo.endDate);
                    }
                    $("#startTimeId").widget().option("defaultTime", response.controlInfo.startTime || "");
                    $("#endTimeId").widget().option("defaultTime", response.controlInfo.endTime || "");

                    // 设置ip
                    var ipConfigType = response.controlInfo.ipConfigType;
                    if (ipConfigType === null) {
                        return;
                    }
                    $scope.ipDisplayType = ipConfigType;
                    $("#" + $scope.ipAddressRadioGroup.id).widget().opChecked(ipConfigType, true);
                    var ipRange = response.controlInfo.ipRange;
                    var ipArray = "";
                    if (ipConfigType === "IP_ADDRESS") {
                        $("#" + $scope.ipAddress.id).widget().option("value", ipRange);
                    } else if (ipConfigType === "IP_ADDRESS_SEG") {
                        ipArray = ipRange.split("-");
                        $("#" + $scope.startIpAddress.id).widget().option("value", ipArray[0] || "");
                        $("#" + $scope.endIpAddress.id).widget().option("value", ipArray[1] || "");
                    } else if (ipConfigType === "SUBNET") {
                        ipArray = ipRange.split("-");
                        $("#" + $scope.subnetIpAddress.id).widget().option("value", ipArray[0] || "");
                        $("#" + $scope.subnetMask.id).widget().option("value", ipArray[1] || "");
                    }
                };

                //获取创建用户参数
                function getParams() {
                    var modifyUser = {
                        "phoneNumber": $("#modifyUserPhoneId").widget().getValue(),
                        "email": $("#modifyUserEmailId").widget().getValue(),
                        "description": $("#modifyUserDescId").widget().getValue(),
                        "roleIds": selelctRoleList
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
                        ipAddressType = $("#" + $scope.ipAddressRadioGroup.id).widget().opChecked("checked");
                        startDate = $("#startDateId").widget().getDateTime();
                        endDate = $("#endDateId").widget().getDateTime();
                        startTime = $("#startTimeId").widget().getDateTime();
                        endTime = $("#endTimeId").widget().getDateTime();
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
                        modifyUser.controlInfo = controlInfo;
                    }
                    return modifyUser;
                }
                $scope.modifyBtn = {
                    "id": "modifyUserModifyBtnId",
                    "text": i18n.common_term_modify_button,
                    "click": function () {
                        var params = getParams();
                        $scope.command.modifyUser(params);
                    }
                };
                $scope.cancelBtn = {
                    "id": "modifyUserCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyUserWindowId").widget().destroy();
                    }
                };
                if ($scope.openstack) {
                    $("#showModifyAccess").css("display", "none");
                } else {
                    $("#showModifyAccess").css("display", "block");
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
                            var tmpCheck = false;
                            var tmpId = "";
                            _.each(data.roleList, function (item) {
                                if(Competition.isBaseOnVmware && item.name === "user"){
                                    //openstack接入vmware场景，去除user角色
                                    return;
                                }
                                tmpCheck = false;
                                tmpId = item.id;
                                for (var j in userRoleInfoList) {
                                    if (tmpId === userRoleInfoList[j].id) {
                                        tmpCheck = true;
                                        break;
                                    }
                                }
                                var desc = item.description;
                                if (item.defaultRole) {
                                    desc = i18n[item.description] || item.description;
                                }
                                roleList.push({
                                    "check": tmpCheck,
                                    "id": tmpId,
                                    "roleName": item.name,
                                    "description": desc
                                });
                            });
                            $scope.roleModel.datas = roleList;
                        });
                    },
                    //获取用户详情
                    "getUserDetail": function () {
                        var options = {
                            "id": userId,
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var deferred = serviceInstance.queryUserDetail(options);
                        deferred.then(function (response) {
                            //设置基础信息
                            setBasicUserInfo(response);
                            $scope.command.getRoleList();
                        });
                    },
                    //修改用户
                    "modifyUser": function (params) {
                        var options = {
                            "params": params,
                            "id": userId,
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var deferred = serviceInstance.modifyUser(options);
                        deferred.then(function (response) {
                            $("#modifyUserWindowId").widget().destroy();
                        });
                    }
                };
                $scope.command.getUserDetail();
            }
        ];
        var modifyUserModule = angular.module("userMgr.user.modify", ["ng", "wcc", "ngSanitize"]);
        modifyUserModule.controller("userMgr.user.modify.ctrl", modifyUserCtrl);
        modifyUserModule.service("camel", http);
        modifyUserModule.service("exception", exceptionService);
        return modifyUserModule;
    });
