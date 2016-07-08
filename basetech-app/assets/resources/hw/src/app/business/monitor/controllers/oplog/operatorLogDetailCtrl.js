define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/exceptionService",
    "app/business/monitor/services/operatorLogService",
    "app/services/httpService",
    "tiny-directives/FormField"],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, exceptionService, OperatorLogService, http) {
        "use strict";
        var opDetailCtrl = ['$scope', 'camel', '$q',"exception", function ($scope, camel, $q, exception) {
            var user = $("html").scope().user;
            var urlParams = $("html").scope().urlParams;
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            var operatorLogService = new OperatorLogService(exception, $q, camel);
            $scope.locale = urlParams.lang === "zh" ? "zh_CN" : "en_US";
            $scope.itemValues = {
               "operationName": ""
            };
            $scope.labels = {
                //操作名称
                operationName: i18n.common_term_operationName_label + ":",
                //部件名称
                componentInfoName: i18n.common_term_assemblyName_label + ":",
                //部件类型",
                componentInfoType: i18n.common_term_assemblyType_label + ":",
                //级别
                levelText: i18n.common_term_level_label + ":",
                //操作结果
                resultText: i18n.common_term_operationResult_label + ":",
                //操作用户
                userInfoName: i18n.common_term_operationBy_label + ":",
                //用户IP
                userInfoIp: i18n.common_term_userIP_label + ":",
                //操作时间
                startTime: i18n.common_term_operationDate_label + ":",
                //失败原因
                failureCause: i18n.common_term_failCause_label + "：　　",
                //操作详情
                oplogDetail: (i18n.common_term_detail_label) + ":"
            };

            //获取详细信息
            $scope.getDetail = function () {
                var promise = operatorLogService.operatorLogDetail({
                    userId: user.id,
                    vdcId: user.vdcId,
                    id: $scope.itemValues.id,
                    locale: $scope.locale
                });
                promise.then(function (resolvedValue) {
                    if (!resolvedValue) {
                        return;
                    }
                    var newItemValues = {
                        "operationName": $scope.itemValues.operationName,
                        "levelText": $scope.itemValues.levelText,
                        "componentInfo": {
                            "name": $scope.itemValues.componentInfo.name,
                            "type": $scope.itemValues.componentInfo.type
                        },
                        "userInfo": {
                            "name": $scope.itemValues.userInfo.name,
                            "ip": $scope.itemValues.userInfo.ip
                        },
                        "startTime": $scope.itemValues.startTime,
                        "resultText": $scope.itemValues.resultText,
                        "result": $scope.itemValues.result
                    };
                    newItemValues.failCause = resolvedValue.failCause;
                    newItemValues.oplogDetail = resolvedValue.oplogDetail;
                    $scope.itemValues = newItemValues;
                });
            };
        }];
        var app = angular.module("system.operatorLog.detail", ['ng', "wcc", "ngSanitize"]);
        app.controller("system.operatorLog.detail.ctrl", opDetailCtrl);
        app.service("camel", http);
        app.service("exception", exceptionService);
        return app;
    });

