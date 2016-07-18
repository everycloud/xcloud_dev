/*global define*/
define([
        'jquery',
        'tiny-lib/angular',
        "app/services/httpService",
        "app/services/exceptionService",
        "app/services/commonService",
        "language/keyID",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField"
    ],
    function ($, angular, http, ExceptionService, commonService, keyID) {
        "use strict";
        var userDetailCtrl = ['$scope', 'camel',
            function ($scope, camel) {
                var colon = ":";
                var user = $("html").scope().user;
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.userId = "";
                $scope.name = {
                    "id": "userDetailUserNameId",
                    "label": $scope.i18n.common_term_userName_label + colon,
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": true
                };
                $scope.password = {
                    "id": "userDetailPwdId",
                    "label": $scope.i18n.common_term_psw_label + colon,
                    "require": true,
                    "value": "",
                    "type": "password",
                    "readonly": true
                };
                $scope.confirmPassword = {
                    "id": "userDetailConfirmPwdId",
                    "label": $scope.i18n.common_term_PswConfirm_label + colon,
                    "require": true,
                    "value": "",
                    "type": "password",
                    "readonly": true
                };
                $scope.phone = {
                    "id": "userDetailPhoneId",
                    "label": $scope.i18n.common_term_phoneNo_label + colon,
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.email = {
                    "id": "userDetailEmailId",
                    "label": $scope.i18n.common_term_email_label + colon,
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.createTime = {
                    "id": "userDetailCreateTimeId",
                    "label": $scope.i18n.common_term_createAt_label + colon,
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.accessDate = {
                    "id": "userDetailAccessDateId",
                    "label": $scope.i18n.user_user_add_para_accessDate_label + colon,
                    "value": "--",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.accessTime = {
                    "id": "userDetailAccessTimeId",
                    "label": $scope.i18n.user_user_add_para_accessTime_label + colon,
                    "value": "00:00:00--23:59:59",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.ipAddress = {
                    "id": "userDetailAccessIPId",
                    "label": $scope.i18n.user_user_add_para_accessIP_label + colon,
                    "value": "",
                    "require": false,
                    "type": "input",
                    "readonly": true
                };
                $scope.description = {
                    "id": "userDetailDescriptionId",
                    "label": $scope.i18n.common_term_desc_label + colon,
                    "require": false,
                    "value": "",
                    "type": "input",
                    "readonly": true
                };

                $scope.roleModel = {
                    "id": "roleListId",
                    "caption": null,
                    "datas": [],
                    "columns": [{
                        "sTitle": $scope.i18n.common_term_role_label,
                        "mData": function(data){
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "30%",
                        "bSearchable": false,
                        "bSortable": false
                    }, {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function(data){
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "sWidth": "70%",
                        "bSearchable": false,
                        "bSortable": false
                    }],
                    "pagination": false,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": true,
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
                        if (data.controlInfo.startDate) {
                            $scope.accessDate.value = (data.controlInfo.startDate) + "--";
                            if (data.controlInfo.endDate) {
                                $scope.accessDate.value += data.controlInfo.endDate;
                            } else {
                                $scope.accessDate.value += "2099-12-31";
                            }
                        }
                        $scope.accessTime.value = (data.controlInfo.startTime || "") + "--" + (data.controlInfo.endTime || "");
                        $scope.ipAddress.value = data.controlInfo.ipRange || $scope.i18n.common_term_notLimit_value;
                    }
                    if (data.roleList !== null) {
                        var roleListRes = data.roleList;
                        for (var item in roleListRes) {
                            if (roleListRes[item].defaultRole) {
                                roleListRes[item].description = keyID[roleListRes[item].description] || roleListRes[item].description;
                            }
                        }
                        $scope.roleModel.datas = roleListRes;
                    }
                }

                //获取用户详细信息
                $scope.operator = {
                    "getUserDetail": function () {
                        var defered = camel.get({
                            "url": {
                                "s": "/goku/rest/v1.5/{tenant_id}/users/{userId}",
                                "o": {
                                    "tenant_id": "1",
                                    "userId": $scope.userId
                                }
                            },
                            "userId": user.id
                        });
                        defered.success(function (response) {
                            $scope.$apply(function () {
                                setUserInfo(response);
                            });
                        });
                        defered.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };
            }
        ];
        var app = angular.module("userMgr.user.detail", ['ng', "wcc"]);
        app.controller("userMgr.user.detail.ctrl", userDetailCtrl);
        app.service("camel", http);
        return app;
    });
