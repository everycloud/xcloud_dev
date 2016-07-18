define([
    "app/services/userService",
    "app/framework/services/alarmStat",
    "app/services/exceptionService",
    "tiny-widgets/Window",
    "app/business/help/configure"], function (UserService, alarm, ExceptionService, Window, configure) {

    "use strict";
    var serviceMenusCtr = ["$scope", "$state", "camel", "$window", "$q", "$rootScope", function ($scope, $state, camel, $window, $q, $rootScope) {
        $scope.isIt = $rootScope.user.cloudType !== "OPENSTACK";
        $scope.isIct = $rootScope.user.cloudType === "OPENSTACK";
        var isLocal = $rootScope.deployMode === "local";

        var exception = new ExceptionService();
        var userService = new UserService(exception, $q, camel);

        var deviceArchiveRight = $rootScope.user.privilege.sys_term_archives_label;

        var commonWindowOptions = {
            "minimizable": false,
            "maximizable": false,
            "content-type": "url",
            "buttons": null
        };

        var userSetting = {
            title: "<div class='menu-item-btn'>" + $scope.i18n.common_term_customSet_label + "</div>",
            id: "framework-menus-user-setting",
            click: function () {
                new Window($.extend({}, commonWindowOptions, {
                    "winId": "userSettingWindowId",
                    "title": $scope.i18n.common_term_customSet_label,
                    "content": "../src/app/framework/views/userSetting.html",
                    "height": 500,
                    "width": 800
                })).show();
            }
        };

        var modifyPwd = {
            title: "<div class='menu-item-btn'>" + $scope.i18n.common_term_modifyPsw_button + "</div>",
            id: "framework-menus-user-modifyPwd",
            click: function () {
                var resetPwdWindow = new Window($.extend({}, commonWindowOptions, {
                    "winId": "modifyPwdWindowId",
                    "title": $scope.i18n.common_term_modifyPsw_button,
                    "content": "../src/app/framework/views/modifyPassword.html",
                    "height": 250,
                    "width": 500
                })).show();
            }
        };
        var logOutText = $scope.i18n.common_term_cancellation_button || "注销";
        var logOut = {
            title: "<div class='menu-item-btn'>" + logOutText + "</div>",
            id: "framework-menus-user-destroy",
            click: function () {
                var host = $window.location.hostname;
                $window.location = "https://" + host + "/SSOSvr/logout";
            }
        };


        alarm($scope, $state, camel);

        var deviceArchiveText = $scope.i18n.sys_term_archives_label || "设备档案";
        $scope.deviceArchive = function () {
            new Window($.extend({}, commonWindowOptions, {
                "winId": "deviceArchiveWindow",
                "title": deviceArchiveText,
                "content": "../src/app/framework/views/deviceArchives.html",
                "height": 300,
                "width": 400
            })).show();
        };

        var aboutText = ($scope.isServiceCenter ? $scope.i18n.common_term_aboutServiceCenter_button : $scope.i18n.common_term_about_button) || "关于";
        $scope.about = function () {
            new Window($.extend({}, commonWindowOptions, {
                "winId": "aboutWindow",
                "title": aboutText,
                "content": "../src/app/framework/views/about.html",
                "height": 300,
                "width": 600
            })).show();
        };

        var lang = window.urlParams.lang || "zh";
        var content = [];
        if (!$scope.isIt && ($scope.user.name === "cloud_admin")) {
            content = [userSetting, logOut];
        }
        else {
            content = [userSetting, modifyPwd, logOut];
        }
        var otherContent = [
            {
                title: "<span>" + ($scope.i18n.common_term_onlinehelp_label || "联机帮助") + "</span>",
                click: function () {
                    var url = configure.getHelp("system_FusionManager_help", $scope.isIt ? "IT" : "ICT", lang);

                    window.open(url);
                }
            },
            {
                title: "<span>" + ($scope.i18n.common_term_docCenter_label || "文档中心") + "</span>",
                click: function () {
                    var page = {
                        zh: "FusionCloud_2013/index.html",
                        en: "FusionCloud_2013_en/index.html"
                    };
                    var url = "http://enterprise.huawei.com/topic/" + page[lang];
                    if ($scope.isServiceCenter) {
                        url = "http://support.huawei.com/enterprise/productsupport?idAbsPath=7919749|7941808|9856619|21270651&pid=21270651&lang=" + lang;
                    }
                    window.open(url);
                }
            }
        ];
        if (!$scope.isServiceCenter) {
            otherContent = otherContent.concat([
                {
                    title: "<span>" + ($scope.i18n.common_term_videoSite_label || "视频教程") + "</span>",
                    click: function () {
                        var url = "http://i.youku.com/u/UMTIwMTI1NDQ0OA";
                        window.open(url);
                    }

                },
                {
                    title: "<span>" + ($scope.i18n.common_term_forum_label || "交流论坛") + "</span>",
                    click: function () {
                        var page = {
                            zh: "list_1069,1079.html",
                            en: "list_1595,4289.html"
                        };
                        var url = "http://support.huawei.com/ecommunity/bbs/" + page[lang];
                        window.open(url);
                    }
                }
            ]);
        }
        otherContent = otherContent.concat([
            {
                title: "<span></span>",
                border: true
            },
            {
                title: "<div class='menu-item-btn'>" + aboutText + "</div>",
                id: "framework-menus-about",
                click: function () {
                    $scope.about();
                }
            }
        ]);

        if (deviceArchiveRight) {
            otherContent.splice(otherContent.length - 1, 0, {
                title: "<div class='menu-item-btn'>" + deviceArchiveText + "</div>",
                id: "framework-menus-device-archive",
                click: function () {
                    $scope.deviceArchive();
                }
            });
        }
        $scope.info = {
            user: {
                id: "framework-menus-user",
                text: "<span class='menu-item-btn'>" + $scope.user.name + "</span>",
                content: content
            },
            other: {
                id: "framework-menus-user",
                text: "<img src='../theme/default/images/gm/question.png'>",
                "content": otherContent
            }
        };
    }];

    return serviceMenusCtr;
});