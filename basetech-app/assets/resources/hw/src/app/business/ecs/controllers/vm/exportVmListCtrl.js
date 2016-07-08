/*global define*/
define(['jquery',
    "sprintf",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "tiny-lib/angular",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/ecs/services/vm/queryVmService"], function ($, sprintf, ngSanitize, keyIDI18n, angular, validatorService, UnifyValid, httpService, Exception, queryVmService) {
    "use strict";
    var exportCtrl = ["$scope", "validator", "camel","$q", function ($scope, validator, camel, $q) {
        var exceptionService = new Exception();
        var queryVmServiceIns = new queryVmService(exceptionService, $q, camel);
        var user = $("html").scope().user;
        keyIDI18n.sprintf = sprintf.sprintf;
        $scope.i18n = keyIDI18n;
        var i18n = $scope.i18n;
        var window = $("#exportVmsListWindow").widget();
        var condition = window.option("condition");
        var status = window.option("status");
        var maxPage =  Math.ceil(window.option("totalRecords") / window.option("limit"));
        maxPage = maxPage?maxPage:1;

        //起始页
        $scope.startTextbox = {
            "id": "startPageTextbox",
            "label": i18n.vm_term_startPage_label + ":",
            "require": true,
            "validate": "required:" + i18n.common_term_null_valid +
                ";integer:" + i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + maxPage + "):" + validator.i18nReplace(i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";minValue(1):" + validator.i18nReplace(i18n.common_term_range_valid, {"1": 1, "2": maxPage})
        };
        //结束页
        $scope.endTextbox = {
            "id": "endPageTextbox",
            "label": i18n.vm_term_endPage_label + ":",
            "require": true,
            "extendFunction": ["pageCompare", "lengthCheck"],
            "validate": "required:" + i18n.common_term_null_valid +
                ";integer:" + i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + maxPage + "):" + validator.i18nReplace(i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";minValue(1):" + validator.i18nReplace(i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";pageCompare:" + i18n.vm_vm_export_info_endPage_valid +
                ";lengthCheck:" + i18n.vm_vm_export_info_total_valid
        };
        UnifyValid.pageCompare = function () {
            var startPage = $("#" + $scope.startTextbox.id).widget().getValue();
            var endPage = $("#" + $scope.endTextbox.id).widget().getValue();
            if (startPage && endPage) {
                var startValue = parseInt(startPage, 10);
                var endValue = parseInt(endPage, 10);
                return endValue >= startValue;
            }
            return true;
        };
        UnifyValid.lengthCheck = function () {
            var startPage = $("#" + $scope.startTextbox.id).widget().getValue();
            var endPage = $("#" + $scope.endTextbox.id).widget().getValue();
            if (startPage && endPage) {
                var startValue = parseInt(startPage, 10);
                var endValue = parseInt(endPage, 10);
                var length = (endValue - startValue + 1) *  window.option("limit");
                return length <= 1000;
            }
            return true;
        };
        //确定按钮
        $scope.okButton = {
            "id": "exportVmListOkButton",
            "text": i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#exportVmListDiv"));
                if (!result) {
                    return;
                }
                exportVMList();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "exportVmListCancelButton",
            "text": i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        /*
         * 导出虚拟机列表
         * */
        function exportVMList() {
            var locale = window.option("locale");
            var startText = $("#" + $scope.startTextbox.id).widget().getValue();
            var endText = $("#" + $scope.endTextbox.id).widget().getValue();
            var start = parseInt(startText,10);
            var end = parseInt(endText,10);
            var options = {
                "user": user,
                "cloudInfraId": window.option("cloudInfraId"),
                "locale": locale,
                "params": {
                    "start": start,
                    "end":end,
                    "limit": window.option("limit"),
                    "status":status,
                    "condition":condition
                },
                "vpcId": window.option("vpcId")
            };
            var deferred = queryVmServiceIns.exportVms2Excel(options);
            deferred.then(function (data) {
                if (data.exportFilePath) {
                    var exportUrl = "/goku/rest/v1.5/file/" + data.exportFilePath + "?type=export";
                    $("#ecsVmsExport").attr("src", exportUrl);
                }
                $("#exportVmsListWindow").widget().destroy();
            });
        }
    }];

    var exportModule = angular.module("ecs.vm.exportVmList", ["ng", "wcc", "ngSanitize"]);
    exportModule.service("validator", validatorService);
    exportModule.service("camel", httpService);
    exportModule.controller("ecs.vm.exportVmList.ctrl", exportCtrl);
    return exportModule;
});