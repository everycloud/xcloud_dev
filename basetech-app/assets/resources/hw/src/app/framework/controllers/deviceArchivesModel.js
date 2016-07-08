/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-5-7
 */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/archivesService",
    "app/services/downloadService",
    "app/framework/directive/directiveFM"], function ($, angular, http, ExceptionService, ArchivesService, DownloadService, fm) {
        "use strict";
        var archivesCtrl = ['$scope', 'camel', '$q', '$rootScope', function ($scope, camel, $q, $rootScope) {
            var deviceArchiveWindow = $("#deviceArchiveWindow").widget();
            var exception = new ExceptionService();
            var archivesService = new ArchivesService(exception, $q, camel);
            var downloadService = new DownloadService();
            var $rootScope = $("html").scope();
            var userId = $rootScope.user.id;
            var i18n = $scope.i18n = $rootScope.i18n;

            var downloadArchives = function (name) {
                downloadService.download({
                    name: name,
                    type: "export"
                });
            };
            var createArchives = function (type) {
                var promise = archivesService.getArchive(userId, {
                    type: type
                });

                promise.then(function (resolvedValue) {
                    if (resolvedValue && resolvedValue.deviceArchiveName) {
                        downloadArchives(resolvedValue.deviceArchiveName);
                        deviceArchiveWindow.destroy();
                    }
                });
            };

            $scope.archives = {
                label: (i18n.common_term_softwareArchives_label || "软件档案") + ":",
                btn: {
                    id: "getArchivesBtnId",
                    text: i18n.sys_term_getSoftArchives_button || "获取软件档案",
                    focused: true,
                    click: function () {
                        createArchives("software");
                    }
                }
            };
        }];
        var deviceArchivesModule = angular.module("deviceArchivesModule", ['ng', 'wcc', fm.name]);
        deviceArchivesModule.controller("archivesCtrl", archivesCtrl);

        deviceArchivesModule.service("camel", http);
        return deviceArchivesModule;
    }
);

