define([
    'jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/services/exceptionService",
    'tiny-common/UnifyValid',
    "app/services/validatorService",
    "language/keyID",
    'tiny-widgets/Message',
    "tiny-widgets/Checkbox",
    "tiny-directives/Textbox",
    "tiny-widgets/Window",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/RadioGroup",
    "tiny-directives/IP",
    "tiny-directives/DateTime"
],
    function ($, angular, http, ExceptionService, UnifyValid, ValidatorService, keyID, Message, Checkbox) {
        "use strict";
        var modifyUserCtrl = ["$scope", "$compile", 'camel', "validator",
            function ($scope, $compile, camel, validator) {
                var colon = ":";
                var user = $("html").scope().user;
                $scope.userId = $("#modifyUserWindowId").widget().option("userId");
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.connectCharacter = "--";
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
                $scope.name = {
                    "id": "modifyUserNameId",
                    "label": $scope.i18n.common_term_userName_label + colon,
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": true
                };
                $scope.phone = {
                    "id": "modifyUserPhoneId",
                    "label": $scope.i18n.common_term_phoneNo_label + colon,
                    "value": "",
                    "require": false,
                    "type": "input",
                    "extendFunction": ["phoneCheck"],
                    "validate": "phoneCheck(modifyUserPhoneId):" + $scope.i18n.common_term_compositionUserPhone_valid + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 20}),
                    "readonly": false
                };
                $scope.email = {
                    "id": "modifyUserEmailId",
                    "label": $scope.i18n.common_term_email_label + colon,
                    "value": "",
                    "require": false,
                    "type": "input",
                    "extendFunction": ["emailCheck"],
                    "validate": "emailCheck(modifyUserEmailId):" + $scope.i18n.common_term_format_valid +
                        ";maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128}),
                    "readonly": false
                };
                $scope.description = {
                    "id": "modifyUserDescId",
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
                    "enablePagination": false,
                    "datas": [],
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
                                return $.encoder.encodeForHTML(data.roleName);
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
                        },
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.id);
                            },
                            "bSortable": false,
                            "bVisible": false
                        }
                    ],
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
                    "defaultDate": "",
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
                $scope.ipDisplayType = "NO_LIMIT";
                $scope.labelWidth = 60;
                $scope.ipAddressRadioGroup = {
                    "id": "ipAddressRadioGroupId",
                    "label": $scope.i18n.common_term_IP_label + colon,
                    "values": [
                        {
                            "key": "NO_LIMIT",
                            "text": $scope.i18n.common_term_notLimit_value,
                            "checked": true
                        },
                        {
                            "key": "IP_ADDRESS",
                            "text": $scope.i18n.common_term_IP_label,
                            "checked": false
                        },
                        {
                            "key": "IP_ADDRESS_SEG",
                            "text": $scope.i18n.common_term_IPsegment_label,
                            "checked": false
                        },
                        {
                            "key": "SUBNET",
                            "text": $scope.i18n.common_term_Subnet_label,
                            "checked": false
                        }
                    ],
                    "change": function () {
                        $scope.ipDisplayType = $("#" + $scope.ipAddressRadioGroup.id).widget().opChecked("checked");
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

                //获取所有角色
                var getRoleList = function () {
                    var roleList = [];
                    var deferred = camel.get({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/roles?type={roleType}",
                            "o": {
                                "tenant_id": "1",
                                "roleType": "SYSTEM_ROLE"
                            }
                        },
                        "userId": user.id
                    });
                    deferred.done(function (data) {
                        if (!data && data.length === 0) {
                            return;
                        }
                        var tmpCheck = false;
                        var tmpId = "";
                        for (var index in data.roleList) {
                            tmpCheck = false;
                            tmpId = data.roleList[index].id;
                            for (var j in $scope.userRoleInfoList) {
                                if (tmpId === $scope.userRoleInfoList[j].id) {
                                    tmpCheck = true;
                                    break;
                                }
                            }
                            var description = data.roleList[index].description;
                            if (data.roleList[index].defaultRole) {
                                description = keyID[data.roleList[index].description] || data.roleList[index].description;
                            }
                            roleList.push({
                                "check": tmpCheck,
                                "id": tmpId,
                                "roleName": data.roleList[index].name,
                                "description": description
                            });
                        }
                        $scope.$apply(function () {
                            $scope.roleModel.datas = roleList;
                        });
                    });
                    deferred.fail(function (data) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(data);
                        });
                    });
                };
                //设置用户基本信息
                var setBasicUserInfo = function (response) {
                    if (!response) {
                        return;
                    }
                    $scope.userRoleInfoList = response.roleList;
                    $scope.name.value = response.userInfo.name;
                    $("#modifyUserPhoneId").widget().option("value", response.userInfo.phoneNumber);
                    $("#modifyUserEmailId").widget().option("value", response.userInfo.email);
                    $("#modifyUserDescId").widget().option("value", response.userInfo.description);

                    //访问控制
                    var controlInfo = response.controlInfo;
                    if (controlInfo == null ||
                        (controlInfo.startDate == null && controlInfo.endDate == null && controlInfo.startTime == null && controlInfo.endTime == null && controlInfo.ipConfigType == null && controlInfo.ipRange == null)) {
                        return;
                    }
                    $scope.accessControlDisplay = true;
                    $("#accessControlId").widget().option("checked", true);

                    if (controlInfo.startDate) {
                        $("#startDateId").widget().option("defaultDate", controlInfo.startDate);
                        $("#" + $scope.endDate.id).widget().option("minDate", controlInfo.startDate);
                    }
                    if (controlInfo.endDate) {
                        $("#endDateId").widget().option("defaultDate", controlInfo.endDate);
                        $("#" + $scope.startDate.id).widget().option("maxDate", controlInfo.endDate);
                    }
                    $("#startTimeId").widget().option("defaultTime", controlInfo.startTime || "");
                    $("#endTimeId").widget().option("defaultTime", controlInfo.endTime || "");

                    // 设置ip
                    var ipConfigType = controlInfo.ipConfigType;
                    if (ipConfigType == null) {
                        return;
                    }
                    $scope.ipDisplayType = ipConfigType;
                    $("#" + $scope.ipAddressRadioGroup.id).widget().opChecked(ipConfigType, true);
                    var ipRange = controlInfo.ipRange;
                    if (ipConfigType === "IP_ADDRESS") {
                        $("#" + $scope.ipAddress.id).widget().option("value", ipRange);
                    } else if (ipConfigType === "IP_ADDRESS_SEG") {
                        var ipArray = ipRange.split("-");
                        $("#" + $scope.startIpAddress.id).widget().option("value", ipArray[0] || "");
                        $("#" + $scope.endIpAddress.id).widget().option("value", ipArray[1] || "");
                    } else if (ipConfigType === "SUBNET") {
                        var ipArray = ipRange.split("-");
                        $("#" + $scope.subnetIpAddress.id).widget().option("value", ipArray[0] || "");
                        $("#" + $scope.subnetMask.id).widget().option("value", ipArray[1] || "");
                    }
                };

                //用户当前获得角色
                $scope.userRoleInfoList = [];
                //获取用户数据
                var getUserDetail = function () {
                    var deferred = camel.get({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/users/{userId}",
                            "o": {
                                "tenant_id": "1",
                                "userId": $scope.userId
                            }
                        },
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            //设置基础信息
                            setBasicUserInfo(response);
                            getRoleList();
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
                    var modifyUser = {
                        "email": $("#modifyUserEmailId").widget().getValue(),
                        "description": $("#modifyUserDescId").widget().getValue()
                    };

                    if (!$scope.openstack) {
                        modifyUser.phoneNumber = $("#modifyUserPhoneId").widget().getValue();
                    }

                    var roleIds = getSelectedRoles();
                    modifyUser.roleIds = roleIds;

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
                        if (!timeValidate(startTime, endTime)) {
                            errorMsg($scope.i18n.user_user_add_para_time_valid || "结束时间应晚于或等于开始时间。");
                            return null;
                        }
                        startTime = formatTime(startTime);
                        endTime = formatTime(endTime);
                        if (ipAddressType === "NO_LIMIT") {
                            ipRange = "";
                        } else if (ipAddressType === "IP_ADDRESS") {
                            ipRange = $("#ipAddressId").widget().getValue();
                        } else if (ipAddressType === "IP_ADDRESS_SEG") {
                            var startIP = $("#" + $scope.startIpAddress.id).widget().getValue();
                            var endIP = $("#" + $scope.endIpAddress.id).widget().getValue();
                            if (validator.ipCompare(startIP, endIP)) {
                                ipRange = startIP + "-" + endIP;
                            } else {
                                errorMsg($scope.i18n.common_term_endGreaterEqualStartIP_valid || "结束IP地址必须大于等于开始IP地址。");
                                return null;
                            }
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
                    var params = JSON.stringify(modifyUser);
                    return params;
                }

                $scope.modifyBtn = {
                    "id": "modifyUserModifyBtnId",
                    "text": $scope.i18n.user_term_modify_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#modifyUser"));
                        if (!result) {
                            return;
                        }
                        var roleIds = getSelectedRoles();
                        var params = getParams();
                        if (params) {
                            var deferred = camel.put({
                                "url": {
                                    "s": "/goku/rest/v1.5/{tenant_id}/users/{id}",
                                    "o": {
                                        "tenant_id": "1",
                                        "id": $scope.userId
                                    }
                                },
                                "params": params,
                                "userId": user.id
                            });

                            deferred.done(function (response) {
                                $scope.$apply(function () {
                                    $("#modifyUserWindowId").widget().destroy();
                                });
                            });
                            deferred.fail(function (response) {
                                $scope.$apply(function () {
                                    new ExceptionService().doException(response);
                                });
                            });
                        }
                    }
                };
                $scope.cancelBtn = {
                    "id": "modifyUserCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyUserWindowId").widget().destroy();
                    }
                };

                var getSelectedRoles = function () {
                    var roleIds = [];
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

                function errorMsg(message) {
                    var msg = new Message({
                        "type": "error",
                        "title": $scope.i18n.common_term_tip_label || "提示",
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
                }

            }
        ];
        var modifyUserModule = angular.module("userMgr.user.modify", ["ng", "wcc"]);
        modifyUserModule.controller("userMgr.user.modify.ctrl", modifyUserCtrl);
        modifyUserModule.service("camel", http);
        modifyUserModule.service("validator", ValidatorService);
        return modifyUserModule;
    });
