/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-4-20
 */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/encoder",
    "tiny-lib/angular-sanitize.min",
    "app/services/httpService",
    "app/services/exceptionService",
    'app/services/messageService',
    "app/services/userService",
    "app/services/tipMessageService",
    "tiny-widgets/Message",
    "upload/jquery-form",
    "sprintf",
    "tiny-directives/FileUpload"], function ($, angular, $encoder, ngSanitize, http, ExceptionService, message, userService, tipMessage, Message, jqueryForm, sprintf) {
    "use strict";
    var iconUploadCtrl = ['$scope', 'camel', '$window', "userService", "message", function ($scope, camel, $window, userService, message) {
        var $windowDom = $("#uploadImgWindow");
        var exception = new ExceptionService();
        if ($windowDom && $windowDom.length) {
            var $windowWidget = $windowDom.widget();
            var i18n = $scope.i18n = $windowWidget.option("i18n");
            var uploadSuccess = $windowWidget.option("callback");
            var user = $("html").scope().user;

            //上传组件配置信息
            $scope.iconUpload = {
                fileObjName: "iconUploadName",
                type: ".jpg;.gif;.png",
                maxSize: 20 * 1024,//20KB
                url: "/goku/rest/v1.5/" + $.encoder.encodeForURL(user.vdcId) + "/service-icons",
                complete: function (event, resp) {

                },
                "select": function (event, file) {
                    $("#iconUploadId form").ajaxForm($scope.iconUpload.options);
                },
                selectError: function (event, file, errorMsg) {
                    var content = {
                        INVALID_FILE_TYPE: i18n.common_term_fileFormatJPGGIFPNG_valid || "文件类型不符合要求，请选择.jpg;.gif;.png文件。",
                        EXCEED_FILE_SIZE: sprintf.sprintf(i18n.common_term_fileMaxWithValue_valid, $scope.iconUpload.maxSize / 1024 + "KB")
                    };
                    new Message({
                        type: 'error',
                        width: '360px',
                        height: '200px',
                        title: i18n.alarm_term_warning_label,
                        content: content[errorMsg] || i18n.common_term_unknownError_label || "未知错误"
                    }).show();
                },
                options: {
                    complete: function (response, status) {
                        var $iconUploadEl = $("#iconUploadId");
                        //隐藏上传组件状态
                        $iconUploadEl.find(".tiny-file-single-detail-line").hide();

                        var $fileNameInput = $iconUploadEl.find(".tiny-file-input");
                        var fileName = $fileNameInput.val();
                        $fileNameInput.val("").css("backgroundColor", "#fff");
                        var resp = response && response.responseText;
                        if (status === 'success') {
                            try {
                                resp = JSON.parse(resp);
                                if (resp && resp.serviceicon) {
                                    uploadSuccess(resp.serviceicon);
                                    $windowWidget.destroy();
                                } else {
                                    exception.doException(resp);
                                }
                            } catch (e) {
                                new tipMessage().alert(i18n.alarm_term_warning_label, i18n.common_term_unknownError_label || "未知错误");
                            }
                        }
                        else {
                            try {
                                resp = JSON.parse(resp);
                                exception.doException(resp);
                            } catch (e) {
                                new tipMessage().alert("error", i18n.common_term_uploadFail_value);
                            }
                        }
                    }
                }
            };
            //页面操作
            $scope.operater = {
            };
        } else {
            var i18n = $scope.i18n = $("html").scope().i18n;
        }
    }];
    var iconUploadModule = angular.module("iconUploadModule", ['ng', 'wcc', 'ngSanitize']);
    iconUploadModule.controller("iconUploadCtrl", iconUploadCtrl);

    iconUploadModule.service("camel", http);
    iconUploadModule.service("exception", ExceptionService);
    iconUploadModule.service("message", message);
    iconUploadModule.service("userService", userService);
    return iconUploadModule;
});

