/**
 * 文件名：extendInstanceCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ssp--服务延期的control
 * 修改时间：14-7-27
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/services/exceptionService",
        'app/services/commonService',
        "app/business/ssp/services/order/orderService"
], function ($, angular, sprintf, ngSanitize, keyIDI18n, http, UnifyValid, validator, exception, commonService, orderService) {
    "use strict";

    var extendInstanceCtrl = ["$scope", "$compile", "$q", "camel", "exception", "validator", function ($scope, $compile, $q, camel, exception, validator) {
        keyIDI18n.sprintf = sprintf.sprintf;
        $scope.i18n = keyIDI18n;
        var i18n = $scope.i18n;

        var winParam = $("#sspExtendInstanceWinId").widget().option("winParam") || {};
        var user = $("html").scope().user;
        var orderServiceIns = new orderService(exception, $q, camel);

        // 默认时间和最小时间，显示当前到期时间
        var expireTime = winParam.expireTime || "";
        var dateTime = expireTime.split(" ");
        var date = "";
        var time = "";
        if (dateTime.length > 1) {
            date = dateTime[0];
            time = dateTime[1];
        }

        $scope.expireTime = {
            "label": i18n.common_term_overdueTime_label + ":",
            "id": "serviceApplyDiskExpireTime",
            "width": "178",
            "require": true,
            "disable": false,
            "type": "datetime",
            "minDate": winParam.expireTime,
            "defaultDate": date,
            "defaultTime": time,
            "dateFormat": "yy-mm-dd",
            "timeFormat": "hh:mm:ss"
        };

        $scope.neverExpire= {
            "id": "serviceApplyDiskNeverExpire",
            "checked": false,
            "text": i18n.common_term_neverExpires_label,
            "change": function () {
                $scope.expireTime.disable = $("#" + $scope.neverExpire.id).widget().option("checked");
            }
        };

        $scope.remark= {
            "label": i18n.common_term_remark_label + ":",
            "id": "sspApplyDiskRemark",
            "value": "",
            "type": "multi",
            "width": "260",
            "height": "100",
            "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
        };

        $scope.okBtn = {
            "id": "sspExtendInstanceOK",
            "text": i18n.common_term_ok_button,
            "click": function () {
                if (!UnifyValid.FormValid($("#" + $scope.remark.id))) {
                    return;
                }

                var options = {
                    "user": user,
                    "params": {
                        "extend": {
                            "serviceInstanceId": winParam.instanceId,
                            "extendTime": $("#" + $scope.neverExpire.id).widget().option("checked") ? "0" : commonService.local2Utc($("#" + $scope.expireTime.id).widget().getDateTime())
                        },
                        "comments": $("#" + $scope.remark.id).widget().getValue()
                    }
                };
                var deferred = orderServiceIns.createOrder(options);
                deferred.then(function (data) {
                    winParam.needRefresh = true;
                    $("#sspExtendInstanceWinId").widget().destroy();
                });
            }
        };

        $scope.cancelBtn = {
            "id": "sspExtendInstanceCancel",
            "text": i18n.common_term_cancle_button,
            "click": function () {
                $("#sspExtendInstanceWinId").widget().destroy();
            }
        };


    }];

    var extendInstanceModule = angular.module("ssp.extend.instance", ['ng', "wcc", "ngSanitize"]);
    extendInstanceModule.controller("ssp.extend.instance.ctrl", extendInstanceCtrl);
    extendInstanceModule.service("camel", http);
    extendInstanceModule.service("validator", validator);
    extendInstanceModule.service("exception", exception);

    return extendInstanceModule;
});
