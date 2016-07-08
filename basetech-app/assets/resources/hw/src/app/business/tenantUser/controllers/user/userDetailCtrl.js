define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/business/tenantUser/service/userDomainService",
        "app/services/commonService",
        "tiny-lib/encoder",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/tenantUserFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exceptionService, userDomainService, commonService) {
        "use strict";
        var userDetailCtrl = ['$scope', "$q", 'camel', "exception",
            function ($scope, $q, camel, exception) {
                //公共服务实例
                var serviceInstance = new userDomainService(exception, $q, camel);
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;

                $scope.openstack = (user.cloudType === "ICT");
                $scope.name = {
                    "id": "userDetailUserNameId",
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": true
                };
                $scope.phone = {
                    "id": "userDetailPhoneId",
                    "label": $scope.i18n.common_term_phoneNo_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.email = {
                    "id": "userDetailEmailId",
                    "label": $scope.i18n.common_term_email_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.createTime = {
                    "id": "userDetailCreateTimeId",
                    "label": $scope.i18n.common_term_createAt_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.accessDate = {
                    "id": "userDetailAccessDateId",
                    "label": $scope.i18n.user_user_add_para_accessDate_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.accessTime = {
                    "id": "userDetailAccessTimeId",
                    "label": $scope.i18n.user_user_add_para_accessTime_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.ipAddress = {
                    "id": "userDetailAccessIPId",
                    "label": $scope.i18n.user_user_add_para_accessIP_label + ":",
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.description = {
                    "id": "userDetailDescriptionId",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "input",
                    "readonly": true
                };
                $scope.roleModel = {
                    "id": "roleListId",
                    "pagination": false,
                    "datas": [],
                    "columns": [{
                        "sTitle": $scope.i18n.common_term_role_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "30%"
                    }, {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "sWidth": "70%"
                    }],
                    "renderRow": function (row, dataitem, index) {
                        $("td:eq(0)", row).addTitle();
                        $("td:eq(1)", row).addTitle();
                    }
                };
                //设置用户信息
                function setUserInfo(data) {
                    if (data.userInfo !== null) {
                        $scope.name.value = data.userInfo.name;
                        $scope.phone.value = data.userInfo.phoneNumber;
                        $scope.email.value = data.userInfo.email;
                        $scope.createTime.value = commonService.utc2Local(data.userInfo.createTime);
                        $scope.description.value = data.userInfo.description;
                    }
                    if (data.controlInfo !== null) {
                        $scope.accessDate.value = $scope.getFormateDate("date", data.controlInfo.startDate, data.controlInfo.endDate);
                        $scope.accessTime.value = $scope.getFormateDate("time", data.controlInfo.startTime, data.controlInfo.endTime);
                        if (data.controlInfo.ipConfigType === "NO_LIMIT") {
                            $scope.ipAddress.value = $scope.i18n.common_term_notLimit_value;
                        } else {
                            $scope.ipAddress.value = data.controlInfo.ipRange;
                        }
                    }
                    if (data.roleList !== null) {
                        var roleListRes = data.roleList;
                        for (var item in roleListRes) {
                            if (roleListRes[item].defaultRole) {
                                roleListRes[item].description = $scope.i18n[roleListRes[item].description] || roleListRes[item].description;
                            }
                        }
                        $scope.roleModel.datas = roleListRes;
                    }
                }
                //获取用户详细信息
                $scope.getUserDetail = function (userId) {
                    var options = {
                        "id": userId,
                        "vdcId": user.vdcId,
                        "userId": user.id
                    };
                    var deferred = serviceInstance.queryUserDetail(options);
                    deferred.then(function (response) {
                        setUserInfo(response);
                    });
                };
                $scope.getFormateDate = function (type, start, end) {
                    if (!start && !end) {
                        return "--";
                    }
                    if (type === "date") {
                        if (!end) {
                            return start + "--2099-12-31";
                        } else {
                            return start + "--" + end;
                        }
                    }
                    if (type === "time") {
                        if (!end) {
                            return  $scope.i18n.common_term_startTime_label+ ":" + start;
                        }
                        if (!start) {
                            return  $scope.i18n.common_term_endTime_label + ":" + end;
                        } else {
                            return start + "--" + end;
                        }
                    }
                };
            }
        ];

        var app = angular.module("userMgr.user.detail", ['ng', "wcc", "ngSanitize"]);
        app.controller("userMgr.user.detail.ctrl", userDetailCtrl);
        app.service("camel", http);
        app.service("exception", exceptionService);
        return app;
    });
