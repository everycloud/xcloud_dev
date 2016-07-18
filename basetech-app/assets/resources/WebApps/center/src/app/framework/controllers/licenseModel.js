/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-4-20
 */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    "upload/jquery-form",
    "tiny-lib/angular-sanitize.min",
    "app/services/httpService",
    "app/services/exceptionService",
    'app/services/messageService',
    "app/services/userService",
    "tiny-widgets/Message",
    "language/system-exception",
    "sprintf",
    "tiny-directives/FileUpload"], function ($, angular, jqueryForm, ngSanitize, http, exceptionService, message, userService, Message, SysException, sprintf) {
    "use strict";
    var licenseStepsCtrl = ['$scope', 'camel', '$window', "userService", "exception", "message", "$timeout", function ($scope, camel, $window, userService, exception, message, $timeout) {
        var $windowDom = $("#licenseExpiredWindow");
        if ($windowDom && $windowDom.length) {
            var params = $windowDom.widget().option("params");
            var i18n = $scope.i18n = params.i18n;
            var language = window.urlParams.lang === "en" ? "en_US" : "zh_CN";
            var defaultTip = {
                "zh_CN": "License文件失效",
                "en_US": "Your License is invalid"
            };
            var tipSuffix = {
                "zh_CN": "。请重新申请有效的License并加载。",
                "en_US": ".please load an effective License. "
            };
            var invalidateReasonObj = JSON.parse(params.invalidateReason);
            $scope.tip = invalidateReasonObj[language] || defaultTip[language];
            $scope.licenseExpired = true;

            //上传组件配置信息
            $scope.licenseUpload = {
                fileObjName: "licenseUploadName",
                id:"licenseUploadId",
                type: ".dat",
                maxSize: 50 * 1024,//50KB
                url: "/goku/rest/v1.5/license/file",
                complete: function (event, resp) {

                },
                selectError: function (event, file, errorMsg) {
                    var content = {
                        INVALID_FILE_TYPE: i18n.common_term_fileFormatBat_valid || "文件类型不符合要求，请选择.bat文件",
                        EXCEED_FILE_SIZE: sprintf.sprintf(i18n.common_term_fileMaxWithValue_valid, $scope.licenseUpload.maxSize / 1024 + "KB")
                    };
                    new Message({
                        type: 'error',
                        width: '360px',
                        height: '200px',
                        title: i18n.alarm_term_warning_label,
                        content: content[errorMsg] || i18n.common_term_unknownError_label || "未知错误"
                    }).show();
                }
            };
            $scope.init = function()
            {
                var options = {
                    "complete":function(response , status)
                    {
                        try{
                            var $licenseUploadEl = $("#" + $scope.licenseUpload.id);
                            //隐藏上传组件状态
                            $licenseUploadEl.find(".tiny-file-single-detail-line").hide();

                            var $fileNameInput = $licenseUploadEl.find(".tiny-file-input");
                            var fileName = $fileNameInput.val();
                            $fileNameInput.val("").css("backgroundColor", "#fff");
                            $licenseUploadEl.widget().empty();
                            //流程完整，返回预期数据
                            var resp = JSON.parse(response.responseText);
                            var licenseResp = resp && resp.licenseImportResp;
                            if (licenseResp) {
                                if (licenseResp.lessThanUsingResource) {
                                    var content = {
                                        "zh_CN": "加载的Lincense资源数目小于系统中已经使用的资源数目",
                                        "en_US": "The number of resources allowed in the uploaded license file is less than that of in-use resources."
                                    };
                                    new Message({
                                        type: 'error',
                                        width: '360px',
                                        height: '200px',
                                        title: i18n.common_term_tip_label || '提示',
                                        content: content[language]
                                    }).show();
                                } else if (licenseResp.resourceReduce) {
                                    $scope.operater.updateLicense(fileName);
                                } else {
                                    message.okMsgBox(i18n.common_term_uploadSucceed_value);
                                    //刷新本页面，关闭window
                                    $window.location.reload();
                                }
                            } else {
                                var code = resp.code;
                                var desc = SysException[code].desc;
                                message.errorMsgBox(code, desc);
                            }
                        }catch(e){
                            resp = {
                                status: 500,
                                responseText: response.responseText
                            };
                            exception.doException(resp);
                        }
                    }
                };

                $timeout(function () {
                    $("#" + $scope.licenseUpload.id + " form").ajaxForm(options);
                }, 1000);
            };

            //页面操作
            $scope.operater = {
                //获取license esn
                getLicenseESN: function () {
                    var promise = userService.queryLicenseESN(params.id, params.tokenId);
                    promise.then(function (data) {
                        $scope.licenseESN = data.esn;
                    });
                },
                //update or add license
                updateLicense: function (name) {
                    var promise = userService.updateLicense({
                        "userId": params.id,
                        "csrfToken": params.tokenId,
                        "data": {
                            confirmImport: "FORCEIMPORT",
                            licenseName: name
                        }
                    });
                    promise.then(function (data) {
                        message.okMsgBox(i18n.common_term_uploadSucceed_value);
                        //刷新本页面，关闭window
                        $window.location.reload();
                    });
                }
            };
            $scope.operater.getLicenseESN();
            $scope.init();
        } else {
            var i18n = $scope.i18n = $("html").scope().i18n;
        }
    }];
    var licenseModule = angular.module("licenseStepsModule", ['ng', 'wcc', 'ngSanitize']);
    licenseModule.controller("licenseStepsCtrl", licenseStepsCtrl);


    licenseModule.service("camel", http);
    licenseModule.service("exception", exceptionService);
    licenseModule.service("message", message);
    licenseModule.service("userService", userService);
    return licenseModule;
});

