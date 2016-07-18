define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/validatorService",
    "app/services/exceptionService",
    "tiny-common/UnifyValid",
    "fixtures/dataCenterFixture"
], function ($, angular, httpService, validatorService, ExceptionService,UnifyValid) {
    "use strict";

    var modifyVolumeCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", function ($scope, $compile, $state, $stateParams, camel) {
        var user = $("html").scope().user;
        var exceptionService = new ExceptionService();

        var window = $("#modifyVolumeWindow").widget();
        $scope.serviceID = window.option("serviceId");
        $scope.diskId = window.option("diskId");
        $scope.diskName = window.option("diskName");
        $scope.projectId = undefined;
        $scope.token = undefined;

        var colon =":";
        var i18n = $scope.i18n || {};
        UnifyValid.diskNameValid = function () {
            var input = $("#" + $scope.name.id).widget().getValue();
            if ($.trim(input) === "") {
                return true;
            }
            var nameReg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,64}[ ]*$/;
            return nameReg.test(input);
        };

        $scope.name = {
            "label": i18n.common_term_name_label + colon,
            "id": "modifyVolumeName",
            "width": "200",
            "value": $scope.diskName,
            "extendFunction": ["diskNameValid"],
            "validate": "diskNameValid():" + i18n.common_term_composition3_valid +
                i18n.sprintf(i18n.common_term_maxLength_valid,{1:64})
        };

        //确定按钮
        $scope.okButton = {
            "id": "modifyDiskOkButton",
            "text": i18n.common_term_ok_button || "确定",
            "disable": false,
            "click": function () {
                var result = UnifyValid.FormValid($("#modifyDiskDiv"));
                if (!result) {
                    return;
                }
                $scope.operator.modifyVolume();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "modifyDiskCancelButton",
            "text": i18n.common_term_cancle_button || "取消",
            "click": function () {
                window.destroy();
            }
        };

        $scope.operator = {
            "modify": function () {
                var volumeInfo = {
                    "name" : $.trim($("#modifyVolumeName").widget().getValue()) || {}
                };
                var deferred = camel.put({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/volumes/{volume_id}",
                        o: {"redirect_address_id": $scope.serviceID, "tenant_id": $scope.projectId,"volume_id":$scope.diskId}},
                    "params": JSON.stringify({"volume":volumeInfo}),
                    "userId": user.id,
                    "token": $scope.token
                });
                deferred.done(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },
            "modifyVolume": function () {
                var deferred = camel.get({
                    "url": {"s": "/goku/rest/v1.5/token"},
                    "params": {"user-id": user.id},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if (data === undefined) {
                        return;
                    }
                    $scope.token = data.id;
                    $scope.projectId = data.projectId;
                    $scope.operator.modify();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        };
    }];

    var app = angular.module("vdcMgr.vdc.volumes.modify", ['framework']);
    app.service("camel", httpService);
    app.service("validator", validatorService);
    app.controller("vdcMgr.vdc.volumes.modify.ctrl", modifyVolumeCtrl);
    return app;
});