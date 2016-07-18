/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-2-14

 */
define(['tiny-lib/angular',
    "tiny-widgets/Message",
    "app/services/tipMessageService",
    "app/services/httpService",
    "app/business/resources/controllers/device/constants",
    "app/services/messageService",
    "app/services/exceptionService",
    "upload/jquery-form"
],
    function (angulart, Message, tipMessage, httpService, deviceConstants, MessageService, ExceptionService, jqueryForm) {
        "use strict";
        var importConfigCtrl = ['$scope', 'camel', '$sce', "$timeout", function ($scope, camel, $sce, $timeout) {
            $scope.i18n = $("html").scope().i18n;
            $scope.user = $("html").scope().user;
            $scope.device_fire_importFWresourceCfg_desc_label = $sce.trustAsHtml($scope.i18n.device_fire_importFWresourceCfg_desc_label);
            $scope.uploadModel = {
                "id": "importConfigId",
                "fileObjName": "importConfigName",
                "multi": false,
                "action": "/goku/rest/v1.5/irm/phyfwcfgfiles",
                "enableDetail": false,
                "fileType": ".xml",
                "minSize": "1",
                "maxSize": "131584",
                "selectError": function (event, file, errorMsg) {
                    $("#importConfigId").widget().empty();
                    var content = $scope.i18n.common_term_unknownError_label;
                    switch (errorMsg) {
                        case "INVALID_FILE_TYPE" :
                            content = $scope.i18n.common_term_fileFormatXml_valid;
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
            $scope.download = function () {
                var deferred = camel.get({
                    "url": "/goku/rest/v1.5/irm/phy-firewall/config-file",
                    "userId": $scope.user.id
                });
                deferred.done(function (response) {
                    saveFile(response.file);
                });
                deferred.fail(function (response) {
                    new ExceptionService().doException(response);
                });
            };

            var saveFile = function (fileName) {
                var url = "/goku/rest/v1.5/file/" + $.encoder.encodeForURL(fileName) + "?type=export";
                $("#downloadDiv").attr("src", url);
            };

            $scope.init = function () {
                var options = {
                    "complete": function (response, status) {
                        $("#importConfigId").widget().empty();
                        if (status == 'success') {
                            new MessageService().okMsgBox($scope.i18n.device_fire_importFWresourceCfg_info_succeed_msg);
                        }
                        else {
                            if (null == response.responseText) {
                                new tipMessage().alert("error", $scope.i18n.device_fire_importFWresourceCfg_info_fail_msg);
                            }
                            else {
                                new ExceptionService().doException(response);
                            }
                        }
                    }
                };

                $timeout(function () {
                    $("#" + $scope.uploadModel.id + " form").ajaxForm(options);
                }, 1000);
            };

            $scope.init();
        }];
        var dependency = ['ng', 'wcc'];
        var importConfigModule = angular.module("importConfigModule", dependency);
        importConfigModule.controller("importConfigCtrl", importConfigCtrl);
        importConfigModule.service("camel", httpService);
        return importConfigModule;
    });

