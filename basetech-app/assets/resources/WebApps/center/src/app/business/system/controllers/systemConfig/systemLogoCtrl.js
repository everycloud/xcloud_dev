/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-2-24
 */
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/tipMessageService",
    "tiny-widgets/Message",
    "upload/jquery-form",
    "app/services/exceptionService",
    "fixtures/systemFixture"],
    function ($, angular, tipMessage, Message, jqueryForm, ExceptionService) {
        "use strict";
        var systemLogoCtrl = ["$scope", "$compile", "$state", "camel", "$timeout", "$rootScope", function ($scope, $compile, $state, camel, $timeout, $rootScope) {

                $scope.smallModifyDisplay = true;
                $scope.bigModifyDisplay = true;
                $scope.modifySmall = function () {
                    $scope.smallModifyDisplay = false;
                };
                $scope.modifyBig = function () {
                    $scope.bigModifyDisplay = false;
                };

                $scope.recoveryBtn = {
                    "text": $scope.i18n.common_term_restoreDefaultSet_button || "恢复默认设置",
                    "recovery": function (type) {
                        var msg = new Message(options);
                        msg.setButton("cancelBtn", function () {
                            msg.destroy();
                        });
                        msg.setButton("okBtn", function () {
                            msg.destroy();
                            $scope.operate.recoveryLogo(type);
                        })
                        msg.show();
                    }
                };
                var options = {
                    type: "confirm",
                    title: $scope.i18n.common_term_confirm_label || '确认',
                    content: $scope.i18n.sys_logo_restoreDefaultSet_info_confirm_msg || "确实要恢复为默认LOGO?",
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button || '确定',
                            accessKey: '2',
                            "key": 'okBtn',
                            default: true,
                            majorBtn: true
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button || '取消',
                            accessKey: '3',
                            "key": 'cancelBtn',
                            default: false
                        }
                    ]
                };

                $scope.uploadBrowserLogo = {
                    "id": "uploadBrowserLogoId",
                    "fileObjName": "uploadBrowserLogoName",
                    "multi": false,
                    "action": "/goku/rest/v1.5/system/logo?type=favicon_image",
                    "enableDetail": false,
                    "fileType": ".ico",
                    "minSize": "1",
                    "maxSize": "131584",
                    "selectError": function (event, file, errorMsg) {
                        $("#uploadBrowserLogoId").widget().empty();
                        var content = $scope.i18n.common_term_unknownError_label;
                        switch (errorMsg) {
                            case "INVALID_FILE_TYPE" :
                                content = $scope.i18n.common_term_fileFormatICO_valid;
                                break;
                            case "EXCEED_FILE_SIZE" :
                                content = $scope.i18n.common_term_fileSizeLarge_valid;
                                break;
                            case  "SMALL_FILE_SIZE" :
                                content = $scope.i18n.common_term_fileSizeSmall_valid;
                                break;
                        }
                        new Message({
                            type: 'error',
                            width: '360px',
                            height: '200px',
                            title: $scope.i18n.common_term_tip_label,
                            content: content
                        }).show();
                    },
                    "complete": function (event, responseText) {
                        //
                    }
                };
                $scope.uploadSystemLogo = {
                    "id": "uploadSystemLogoId",
                    "fileObjName": "uploadSystemLogoName",
                    "multi": false,
                    "action": "/goku/rest/v1.5/system/logo?type=product_image",
                    "enableDetail": false,
                    "fileType": ".png",
                    "minSize": "1",
                    "maxSize": "131584",
                    "selectError": function (event, file, errorMsg) {
                        $("#uploadSystemLogoId").widget().empty();
                        var content = $scope.i18n.common_term_unknownError_label;
                        switch (errorMsg) {
                            case "INVALID_FILE_TYPE" :
                                content = $scope.i18n.common_term_fileFormatPNG_valid;
                                break;
                            case "EXCEED_FILE_SIZE" :
                                content = $scope.i18n.common_term_fileSizeLarge_valid;
                                break;
                            case  "SMALL_FILE_SIZE" :
                                content = $scope.i18n.common_term_fileSizeSmall_valid;
                                break;
                        }
                        new Message({
                            type: 'error',
                            width: '360px',
                            height: '200px',
                            title: $scope.i18n.common_term_tip_label,
                            content: content
                        }).show();
                    },
                    "complete": function (event, responseText) {
                        //
                    }
                };

                $scope.operate = {
                    recoveryLogo: function (type) {
                        var restoreConfig = "/goku/rest/v1.5/system/logo/recovery?type={type}";
                        var deferred = camel.post({
                            "url": {s: restoreConfig, o: {"type": type}},
                            "type": "POST",
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (type == "favicon_image") {
                                    $scope.smallModifyDisplay = true;
                                    var origHtml = $("#broserLogoDiv").html();
                                    $("#broserLogoDiv").html(origHtml);
                                }
                                else {
                                    $scope.bigModifyDisplay = true;
                                    var origHtml = $("#systemLogoDiv").html();
                                    $("#systemLogoDiv").html(origHtml);
                                }

                            })
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });

                    },
                    init: function () {
                        var browserOptions = {
                            "complete": function (response, status) {
                                $("#uploadBrowserLogoId").widget().empty();
                                if (response.status != '204') {
                                    if (null == response.responseText) {
                                        new tipMessage().alert("error", $scope.i18n.common_term_innerError_label);
                                    }
                                    else {
                                        new ExceptionService().doException(response);
                                    }
                                }
                                else {
                                    var origHtml = $("#broserLogoDiv").html();
                                    $("#broserLogoDiv").html(origHtml);
                                }
                            }
                        };

                        $timeout(function () {
                            $("#" + $scope.uploadBrowserLogo.id + " form").ajaxForm(browserOptions);
                        }, 1000);

                        var systemOptions = {
                            "complete": function (response, status) {
                                $("#uploadSystemLogoId").widget().empty();
                                if (response.status != '204') {
                                    if (null == response.responseText) {
                                        new tipMessage().alert("error", $scope.i18n.common_term_innerError_label);
                                    }
                                    else {
                                        new ExceptionService().doException(response);
                                    }
                                }
                                else {
                                    var origHtml = $("#systemLogoDiv").html();
                                    $("#systemLogoDiv").html(origHtml);
                                }
                            }
                        };

                        $timeout(function () {
                            $("#" + $scope.uploadSystemLogo.id + " form").ajaxForm(systemOptions);
                        }, 1000);
                    }
                }
                $scope.operate.init();
            }
            ]
            ;
        return systemLogoCtrl;
    });