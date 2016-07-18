/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-26

 */
define(['tiny-lib/angular',
    "tiny-widgets/Message",
    "app/services/messageService",
    "app/services/httpService",
    "app/services/exceptionService",
    'app/business/resources/services/device/adaptation/adaptationService',
    "upload/jquery-form"
],
    function (angular, Message, MessageService, http, ExceptionService, AdaptationService, jqueryForm) {
        "use strict";
        var installAdptPkgCtrl = ['$scope', '$q', 'camel','$timeout', function ($scope, $q, camel, $timeout) {
            var timer;
            var $rootScope = $("html").scope();
            var user = $rootScope.user;
            var i18n = $scope.i18n = $rootScope.i18n;
            var exceptionService = new ExceptionService();
            var adaptationService = new AdaptationService($q, camel);
            var statusConfig = adaptationService.getProgressStatus();
            var statusText = {};
            for (var p in statusConfig) {
                var item = statusConfig[p];
                statusText[item.val] = item.text;
            }
            var messageConfig = {
                type: 'error',
                width: '360px',
                height: '200px',
                title: i18n.common_term_tip_label || '提示',
                content: i18n.common_term_unknownError_label || "未知错误"
            };

            $scope.tip = i18n.device_adap_install_info_auto_msg || "上传后系统将自动安装适配包";
            $scope.progressText = "";
            var clearProgressText = function () {
                //清空状态
                $scope.$apply(function () {
                    $scope.progressText = "";
                });
            };

            $scope.uploadModel = {
                "id": "adaptatorUploadId",
                "fileObjName": "adaptatorUploadName",
                "action": "/goku/rest/v1.5/irm/adaptors",
                "maxSize": 30 * 1024 * 1024,//30MB,
                "fileType": ".zip",
                select: function () {
                    clearProgressText();
                    clearTimeout(timer);
                },
                selectError: function (event, file, errorMsg) {
                    var contents = {
                        "INVALID_FILE_TYPE": "文件类型不符合要求，请选择.zip文件",
                        "EXCEED_FILE_SIZE": i18n.sprintf(i18n.common_term_fileMaxWithValue_valid, $scope.uploadModel.maxSize / (1024*1024) + "MB")
                    };
                    var content = contents[errorMsg];
                    new Message($.extend({}, messageConfig, {content: content})).show();
                },
                afterSubmit: function () {
                    $("#" + $scope.uploadModel.id).find(".tiny-file-bytes-uploaded,.tiny-file-upload-cancel").hide();
                },
                complete: function (event, responseText) {
                    //兼容IE9
                }
            };
            $scope.init = function()
            {
                var options = {
                    "complete":function(response , status)
                    {
                        var $uploadEl = $("#" + $scope.uploadModel.id);

                        //上传组件状态
                        $uploadEl.find(".tiny-file-single-detail-line").hide();
                        $uploadEl.find(".tiny-file-input")
                            .val("").
                            css("backgroundColor", "#fff");
                        $uploadEl.widget().empty();
                        try {
                            var resp = JSON.parse(response.responseText);
                            var code = resp && resp.code;
                            if (code == 0) {
                                $scope.operator.getProgress(resp, "updateStatus");
                            } else {
                                resp = {
                                    status: "500",
                                    responseText: response.responseText
                                };
                                exceptionService.doException(resp);
                            }
                        } catch (e) {
                            new Message($.extend({}, messageConfig)).show();
                        }
                    }
                };

                $timeout(function () {
                    $("#" + $scope.uploadModel.id + " form").ajaxForm(options);
                }, 1000);
            };
            $scope.operator = {
                getProgress: function (resp, updateStatus) {
                    var name = resp && resp.id;
                    var progress = "" + (resp && resp.progress);
                    if (name && !_.contains([
                        statusConfig.PROGRESS_INSTALL_OK.val,
                        statusConfig.PROGRESS_UPLOAD_FAIL.val,
                        statusConfig.PROGRESS_UNZIP_FAIL.val,
                        statusConfig.PROGRESS_CHECK_FAIL.val,
                        statusConfig.PROGRESS_INSTALL_FAIL.val
                    ], progress)) {
                        var promise = adaptationService.adaptatorInstallProgress(name, user.id);
                        promise.then(function (resolvedValue) {
                            $scope.operator.getProgress(resolvedValue);
                        });
                    }
                    if (updateStatus) {
                        $scope.$apply(function () {
                            $scope.progressText = statusText[progress];
                        });
                    } else {
                        $scope.progressText = statusText[progress];
                    }
                }
            };
            $scope.init();
        }];

        var dependency = ['ng', 'wcc'];
        var installAdptPkgModule = angular.module("installAdptPkgModule", dependency);
        installAdptPkgModule.controller("installAdptPkgCtrl", installAdptPkgCtrl);
        installAdptPkgModule.service("camel", http);

        return installAdptPkgModule;
    });


