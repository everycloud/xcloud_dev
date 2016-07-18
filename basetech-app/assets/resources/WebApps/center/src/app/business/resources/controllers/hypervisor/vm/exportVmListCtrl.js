/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"], function ($, angular, validatorService, UnifyValid, httpService, Exception) {
    "use strict";
    var exportCtrl = ["$scope", "validator", "camel", function ($scope, validator, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var window = $("#exportVmListWindow").widget();
        var params = window.option("params");
        var maxPage = Math.ceil(params.totalRecords / params.limit);
        maxPage = maxPage?maxPage:1;
        //起始页
        $scope.startTextbox = {
            "id": "startPageTextbox",
            "label": $scope.i18n.vm_term_startPage_label+":",
            "require": true,
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + maxPage + "):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxPage})
        };
        //结束页
        $scope.endTextbox = {
            "id": "endPageTextbox",
            "label": $scope.i18n.vm_term_endPage_label+":",
            "require": true,
            "extendFunction": ["pageCompare", "lengthCheck"],
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + maxPage + "):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";pageCompare:" +$scope.i18n.vm_vm_export_info_endPage_valid+
                ";lengthCheck:"+$scope.i18n.vm_vm_export_info_total_valid
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
                var length = (endValue - startValue + 1) *  params.limit;
                return length <= 1000;
            }
            return true;
        };
        //确定按钮
        $scope.okButton = {
            "id": "exportVmListOkButton",
            "text": $scope.i18n.common_term_ok_button,
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
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        /*
         * 导出虚拟机列表
         */
        function exportVMList() {
            var locale = $scope.i18n.locale === "zh" ? "zh_CN" : "en_US";
            var startText = $("#" + $scope.startTextbox.id).widget().getValue();
            var endText = $("#" + $scope.endTextbox.id).widget().getValue();
            var start = parseInt(startText,10);
            var end = parseInt(endText,10);
            var body = {
                "exportVm": {
                    filterIsTemplate: false,
                    filterHypervisorId: -1,
                    queryVmInsystem: false,
                    "filterStatus": params.searchInfo.status?params.searchInfo.status[0]:null,
                    "start": start,
                    "end":end,
                    "limit": params.limit
                }
            };
            body.exportVm[params.searchInfo.condition] = params.searchInfo.value;
            if (params.clusterId) {
                body.exportVm.clusterId = params.clusterId;
            }
            else if (params.storeId) {
                body.exportVm.datastoreID = params.storeId;
                body.exportVm.filterClusterIds = params.clusterIds;
            }
            else if (params.hostId) {
                body.exportVm.hostId = params.hostId;
            }
            else if(params.hyperName){
                body.exportVm.hypervisorId = params.hyperId;
            }
            else {
                body.exportVm.queryVmInsystem = true;
                body.exportVm.detail = 1;
            }
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/reports/resource-reports/action?locale={locale}", o: {locale: locale}},
                "params": JSON.stringify(body),
                "userId": user.id,
                "timeout": 600000
            });
            deferred.success(function (data) {
                if (data.exportFilePath) {
                    $scope.reportUrl = "/goku/rest/v1.5/file/" + encodeURIComponent(data.exportFilePath) + "?type=export" + "&t=" + Math.random();
                    $("#downloadVmListIframe").attr("src", $.encoder.encodeForHTML($scope.reportUrl));
                }
                window.destroy();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
    }];

    var exportModule = angular.module("resources.vm.exportVmList", ["ng"]);
    exportModule.service("validator", validatorService);
    exportModule.service("camel", httpService);
    exportModule.controller("resources.vm.exportVmList.ctrl", exportCtrl);
    return exportModule;
});