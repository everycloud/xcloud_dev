define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/business/system/services/operatorLogService",
    "app/services/httpService",
    "tiny-directives/FormField"],
    function ($, angular, OperatorLogService, http) {
        "use strict";
        var opDetailCtrl = ['$scope', 'camel', '$q', function ($scope, camel, $q) {
            var $rootScope = $("html").scope();
            var i18n = $scope.i18n = $rootScope.i18n;
            var lang = {
                zh: "zh_CN",
                en: "en_US"
            };
            var operatorLogService = new OperatorLogService($q, camel);
            $scope.opId = "";
            $scope.locale = lang[window.urlParams.lang]

            $scope.values = {};
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
                oplogDetail: (i18n.common_term_detail_label || "操作详情") + ":"
            };

            //获取详细信息
            $scope.getDetail = function () {
                var promise = operatorLogService.operatorLogDetail({
                    userId: $rootScope.user.id,
                    vdcId: "1",
                    id: $scope.values.id,
                    locale: $scope.locale
                });
                promise.then(function (resolvedValue) {
                    $scope.$apply(function () {
                        $.extend($scope.values, resolvedValue);
                    });
                });
            }
        }];
        var app = angular.module("system.operatorLog.detail", ['ng', "wcc"]);
        app.controller("system.operatorLog.detail.ctrl", opDetailCtrl);
        app.service("camel", http);
        return app;
    })
