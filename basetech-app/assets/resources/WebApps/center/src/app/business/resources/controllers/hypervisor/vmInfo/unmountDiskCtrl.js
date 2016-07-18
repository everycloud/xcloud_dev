/**
 * 文件名：deleteDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-disk--删除磁盘的control
 * 修改时间：14-4-20
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    "tiny-widgets/Message",
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'app/services/httpService',
    'app/services/exceptionService',
    'tiny-directives/Checkbox'
],
    function ($, angular,sprintf, Message, ngSanitize, keyIDI18n, http, Exception) {
        "use strict";
        var unmountDiskCtrl = ["$scope", "$compile", "$q", "camel",
            function ($scope, $compile, $q, camel) {
                var exceptionService = new Exception();
                // 公共参数和服务实例
                var winParam = $("#hypervisiorVmUnmountDiskWinId").widget().option("winParam") || {};
                var vmId = winParam.vmId || {};
                var volumnId = winParam.volumnId || {};
                var $rootScope = $("html").scope();
                var $state = $("html").injector().get("$state");
                var user = $rootScope.user;
                var i18n = $scope.i18n = $rootScope.i18n;

                $scope.formatDisk = {
                    "id": "VmInfoUnmountFormatDisk",
                    "text": i18n.common_term_formatDisk_button,
                    "checked":false,
                    "change":function () {

                    }
                };
                $scope.okBtn = {
                    "id": "UnmountFormatDiskOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var options = {
                            "unmount": {
                                "vmID": vmId,
                                "volumnID":volumnId
                            }
                        };
                        $("#hypervisiorVmUnmountDiskWinId").widget().destroy();
                        unmountDisk(options);
                    }
                };

                $scope.cancelBtn = {
                    "id": "UnmountFormatDiskCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#hypervisiorVmUnmountDiskWinId").widget().destroy();
                    }
                };

                function unmountDisk(options) {
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/volumes/action"},
                        "params": JSON.stringify(options),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        taskMessage();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                };

                function taskMessage() {
                    var options = {
                        type: "confirm",
                        content:$scope.i18n.task_view_task_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn : true,
                                handler: function (event) {
                                    msg.destroy();
                                    $("#hypervisiorVmUnmountDiskWinId").widget().destroy();
                                    $state.go("system.taskCenter");
                                }
                            },
                            {
                                label:  $scope.i18n.common_term_cancle_button,
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                    $("#hypervisiorVmUnmountDiskWinId").widget().destroy();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                }
            }
        ];

        var unmountDiskModule = angular.module("resource.hypervisor.disk.unmount.ctrl", ['ng', 'wcc', 'ngSanitize']);
        unmountDiskModule.controller("resource.hypervisor.disk.unmount.ctrl", unmountDiskCtrl);
        unmountDiskModule.service("camel", http);

        return unmountDiskModule;
    }
);
