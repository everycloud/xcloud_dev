/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/validatorService",
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-common/UnifyValid"],
    function ($, angular,validatorService, httpService, Exception, UnifyValid) {
        "use strict";
        var addMacSegmentCtrl = ["$scope", "camel", "validator",
            function ($scope, camel, validator) {
                var exceptionService = new Exception();
                UnifyValid.macValidate = function (macId) {
                    var mac = $("#" + macId).widget().getValue();
                    if (mac.match(new RegExp(validator.macRe))) {
                        return "";
                    }
                    else {
                        return $scope.i18n.common_term_formatMAC_valid;
                    }
                };
                var user = $("html").scope().user;
                $scope.i18n = $("html").scope().i18n;
                var window = $("#addMacSegmentWindow").widget();
                var action = window.option("action");
                var eid = window.option("eid");
                var macSegments = window.option("macSegments") || [];
                var index = window.option("index");
                //起始MAC输入框
                $scope.startMacTextbox = {
                    "id": "startMacTextbox",
                    "label": $scope.i18n.common_term_initiativeMAC_label+":",
                    "require": true,
                    "extendFunction": ["macValidate"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+
                        ";macValidate(startMacTextbox);"
                };
                //结束MAC输入框
                $scope.endMacTextbox = {
                    "id": "endMacTextbox",
                    "label": $scope.i18n.common_term_endMAC_label+":",
                    "require": true,
                    "extendFunction": ["macValidate"],
                    "validate": "required:"+$scope.i18n.common_term_null_valid+
                        ";macValidate(endMacTextbox):"+$scope.i18n.common_term_formatMAC_valid
                };
                //确定按钮
                $scope.okButton = {
                    "id": "addMacSegmentOkButton",
                    "text": $scope.i18n.common_term_ok_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#addMacSegmentDiv"));
                        if (!result) {
                            return;
                        }
                        if (action === "edit") {
                            editMacSegment();
                        }
                        else {
                            addMacSegment();
                        }
                    }
                };
                //取消按钮
                $scope.cancelButton = {
                    "id": "addMacSegmentCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        window.destroy();
                    }
                };
                function addMacSegment() {
                    var segment = {
                        "begin": $("#" + $scope.startMacTextbox.id).widget().getValue(),
                        "end": $("#" + $scope.endMacTextbox.id).widget().getValue()
                    };
                    macSegments.push(segment);
                    var params = {
                        "macSegments": macSegments
                    };
                    var deferred = camel.put({
                        "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/macSegment", o: {id: eid}},
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        window.destroy();
                    });
                    deferred.fail(function (response) {
                        exceptionService.doException(response);
                    });
                }
                function editMacSegment() {
                    macSegments[index].begin = $("#" + $scope.startMacTextbox.id).widget().getValue();
                    macSegments[index].end = $("#" + $scope.endMacTextbox.id).widget().getValue();
                    var params = {
                        "macSegments": macSegments
                    };
                    var deferred = camel.put({
                        "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/macSegment", o: {id: eid}},
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        window.destroy();
                    });
                    deferred.fail(function (response) {
                        exceptionService.doException(response);
                    });
                }
                if (action === "edit") {
                    $scope.startMacTextbox.value = macSegments[index].begin;
                    $scope.endMacTextbox.value = macSegments[index].end;
                }
            }];

        var addMacSegmentModule = angular.module("resources.hypervisor.addMacSegment", ["ng"]);
        addMacSegmentModule.service("validator", validatorService);
        addMacSegmentModule.service("camel", httpService);
        addMacSegmentModule.controller("resources.hypervisor.addMacSegment.ctrl", addMacSegmentCtrl);
        return addMacSegmentModule;
    });