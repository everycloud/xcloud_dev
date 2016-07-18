/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Message",
    'app/services/validatorService',
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"],
    function ($, angular,Message,validatorService,UnifyValid,httpService, Exception) {
        "use strict";

        var setLimitCtrl = ["$scope", "$compile","camel","$state", function ($scope, $compile,camel,$state) {
            var exceptionService = new Exception();
            var $state = $("html").injector().get("$state");
            var window = $("#setDiskLimitWindow").widget();
            var winParams = window.option("WIN_PARAMS");

            var volumnId = winParams.volumnId;
            var vmId =  winParams.vmId;
            var clusterId =  winParams.clusterId;

            var user = $("html").scope().user;
            $scope.i18n =  $("html").scope().i18n;

            var validator = new validatorService();
            UnifyValid.checkByteSize = function () {
                var value = $(this).val();
                if(!isNumber(value)){
                    return false;
                }
                value = parseInt(value);
                if(value == 0){
                    return true;
                }
                return (value >= 8 && value <= 9007199254740991);
            };
            UnifyValid.checkRequestSize = function () {
                var value = $(this).val();
                if(!isNumber(value)){
                    return false;
                }
                value = parseInt(value);
                if(value == 0){
                    return true;
                }
                return (value >= 16 && value <= 4294967295);
            };
            function isNumber(str) {
                if (!str) {
                    return false;
                }
                return /^\d+(\.\d+)?$/.test(str);
            }
            //最大读出字节数
            $scope.readKBTextbox = {
                "label": $scope.i18n.perform_term_readByteMaxKBs_label+":",
                "id": "max_disk_read_kb_textbox",
                "value": winParams.maxReadBytes,
                "require":true,
                "extendFunction": ["checkByteSize"],
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeIntegerAndZero_valid,8,9007199254740991),
                "validate": "checkByteSize():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeIntegerAndZero_valid,8,9007199254740991)
            };
            //最大写入字节数
            $scope.writeKBTextbox = {
                "label": $scope.i18n.perform_term_writeByteMaxKBs_label+":",
                "id": "max_disk_write_kb_textbox",
                "value": winParams.maxWriteBytes,
                "require":true,
                "extendFunction": ["checkByteSize"],
                "tooltip":$scope.i18n.sprintf($scope.i18n.common_term_rangeIntegerAndZero_valid,8,9007199254740991),
                "validate": "checkByteSize():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeIntegerAndZero_valid,8,9007199254740991)
            };
            //最大每秒读请求个数
            $scope.readRequestTextbox = {
                "label": $scope.i18n.perform_term_readRequestMaxPerS_label+":",
                "id": "max_disk_read_request_textbox",
                "value": winParams.maxReadRequest,
                "require":true,
                "extendFunction": ["checkRequestSize"],
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeIntegerAndZero_valid,16,4294967295),
                "validate": "checkRequestSize():"+ $scope.i18n.sprintf($scope.i18n.common_term_rangeIntegerAndZero_valid,16,4294967295)
            };
            //最大每秒写请求个数
            $scope.writeRequestTextbox = {
                "label": $scope.i18n.perform_term_writeRequestMaxPerS_label+":",
                "id": "max_disk_write_request_textbox",
                "value": winParams.maxWriteRequest,
                "require":true,
                "extendFunction": ["checkRequestSize"],
                "tooltip":  $scope.i18n.sprintf($scope.i18n.common_term_rangeIntegerAndZero_valid,16,4294967295),
                "validate": "checkRequestSize():"+ $scope.i18n.sprintf($scope.i18n.common_term_rangeIntegerAndZero_valid,16,4294967295)
            };
            //确定钮
            $scope.okButton = {
                "id": "set_disk_limit_ok_button",
                "text":$scope.i18n.common_term_ok_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#setDiskLimitDiv"));
                    if (!result) {
                        return;
                    }
                    save();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "set_disk_limit_cancel_button",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#setDiskLimitWindow").widget().destroy();
                }
            };
            function getLimit() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: vmId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var vmInfo = data && data.vmInfo;
                    var disks = vmInfo.vmConfig.disks || [];
                    for(var i=0;i<disks.length;i++){
                        if(disks[i].volumeId === volumnId){
                            $scope.$apply(function () {
                                $scope.readKBTextbox.value = disks[i].maxReadBytes;
                                $scope.writeKBTextbox.value = disks[i].maxWriteBytes;
                                $scope.readRequestTextbox.value = disks[i].maxReadRequest;
                                $scope.writeRequestTextbox.value = disks[i].maxWriteRequest;
                            });
                            break;
                        }
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function save() {
                var result = UnifyValid.FormValid($("#setDiskLimitDiv"));
                if (!result) {
                    return;
                }
                var params = {
                    "modifyIO": {
                        "maxReadBytes": $("#max_disk_read_kb_textbox").widget().getValue(),
                        "maxWriteBytes": $("#max_disk_write_kb_textbox").widget().getValue(),
                        "maxReadRequest":$("#max_disk_read_request_textbox").widget().getValue(),
                        "maxWriteRequest":$("#max_disk_write_request_textbox").widget().getValue(),
                        "vmId":vmId
                    }
                };
                var deferred = camel.post({
                    "url":{s: "/goku/rest/v1.5/irm/1/volumes/{id}/action",o:{'id':volumnId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    taskMessage();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function taskMessage() {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.task_view_task_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                msg.destroy();
                                $state.go("system.taskCenter");
                                window.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                                $("#setDiskLimitWindow").widget().destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
            if(!winParams.maxReadBytes){
                getLimit();
            }
        }];

        var setLimitApp = angular.module("setDiskLimitApp", ['framework']);
        setLimitApp.controller("resources.hypervisor.setDiskLimit.ctrl", setLimitCtrl);
        setLimitApp.service("camel", httpService);
        return setLimitApp;
    });
