/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-lib/encoder",
    "tiny-lib/jquery.base64",
    "app/services/userService",
    "tiny-widgets/Window",
    "app/business/help/configure",
    "tiny-directives/Select"
], function ($, $encoder, $jBase, UserService, Window, configure) {
    "use strict";
    var serviceMenusCtr = ["$scope", "$state", "camel", "$window", "$q", "exception", "storage",
        function ($scope, $state, camel, $window, $q, exception, storage) {
            var i18n = $scope.i18n;
            //管理侧组织id
            var MANAGE_ORG_ID = "1";
            var userService = new UserService(exception, $q, camel);
            //ict场景下，一个用户只属于一个VDC，不能切换。
            $scope.vdcNmaeICT = $.encoder.encodeForHTML($scope.user.vdcName);
            // 产品logo路径
            $scope.isSC = ($scope.deployMode === "serviceCenter");
            $scope.companyLogo = $scope.isSC ? "../theme/default/images/product_logo02.png" : "../theme/default/images/product_logo.png";

            var commonWindowOptions = {
                "minimizable": false,
                "maximizable": false,
                "content-type": "url",
                "buttons": null
            };
            var lang = window.urlParams.lang || "zh";
            var userSetting = {
                title: "<div class='menu-item-btn'>" + i18n.common_term_customSet_label + "</div>",
                id: "framework-menus-user-setting",
                click: function () {
                    new Window($.extend({}, commonWindowOptions, {
                        "winId": "userSettingWindowId",
                        "title": i18n.common_term_customSet_label,
                        "content": "../src/app/framework/views/userSetting.html",
                        "height": 500,
                        "width": 800
                    })).show();
                }
            };

            var modifyPwd = {
                title: "<div class='menu-item-btn'>" + i18n.common_term_modifyPsw_button + "</div>",
                id: "framework-menus-user-modifyPwd",
                click: function () {
                    new Window($.extend({}, commonWindowOptions, {
                        "winId": "modifyPwdWindowId",
                        "title": i18n.common_term_modifyPsw_button,
                        "content": "../src/app/framework/views/modifyPassword.html",
                        "height": 250,
                        "width": 500
                    })).show();
                }
            };

            var logOut = {
                "title": "<div class='menu-item-btn'>" + i18n.common_term_cancellation_button + "</div>",
                "id": "framework-menus-user-destroy",
                "click": function () {
                    storage.flush();
                    var host = $window.location.hostname;
                    $window.location = "https://" + host + "/SSOSvr/logout";
                }
            };

            var otherContent = [
                {
                    title: "<span>" + ($scope.i18n.common_term_onlinehelp_label || "联机帮助") + "</span>",
                    click: function () {
                        var url = configure.getHelp("system_FusionManager_help", $scope.user.cloudType, lang);

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
            if(!$scope.isServiceCenter){
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
                    }]);
            }

            $scope.info = {
                "user": {
                    "id": "framework-menus-user",
                    "text": "<span class='menu-item-btn'>" + $.encoder.encodeForHTML($scope.user.name) + "</span>",
                    "content": [userSetting, modifyPwd, logOut]
                },
                "vdc": {
                    "id": "framework-menus-vdc",
                    "text": "<span class='menu-item-btn' title='" + $.encoder.encodeForHTMLAttribute($scope.user.vdcName) + "'>" + $.encoder.encodeForHTML($scope.user.vdcName) + "</span>",
                    "content": []
                },
                "other": {
                    id: "framework-menus-user",
                    text: "<img src='../theme/default/images/gm/question.png'>",
                    "content": otherContent
                }
            };
            //最大vdc直接显示数量
            var MAX_ORG = 9;
            var moreContentItem = function (vdcList) {
                return {
                    title: "<div class='menu-item-btn'>" + i18n.common_term_more_button + "</div>",
                    id: "framework-menus-user-more",
                    click: function () {
                        new Window({
                            "winId": "switchVdcWindowId",
                            "title": i18n.sys_term_switchVDC_button,
                            "params": {
                                vdcList: vdcList,
                                switchVdcById: function (vdcId) {
                                    $scope.operator.switchVdc(vdcId);
                                }
                            },
                            "minimizable": false,
                            "maximizable": false,
                            "content-type": "url",
                            "content": "../src/app/framework/views/switchOrg.html",
                            "height": 250,
                            "width": 500,
                            "buttons": null
                        }).show();
                    }
                };
            };
            $scope.operator = {
                getVdcList: function () {
                    if ($scope.user.vdcId === '-1') {
                        // SC自助申请VDC时，没有vdcId时，不用查vdc列表
                        return;
                    }

                    var promise = userService.queryVdcs($scope.user.id);
                    promise.then(function (resolvedValue) {
                        if (resolvedValue && resolvedValue.vdcList) {
                            var vdcList = [];
                            // 过滤掉系统侧默认的vdc 不允许管理员回切
                            _.each(resolvedValue.vdcList, function (item) {
                                if (MANAGE_ORG_ID !== item.id) {
                                    vdcList.push(item);
                                }
                            });

                            var len = vdcList.length;
                            var newContent = [];
                            var showMore = false;
                            if (len > MAX_ORG) {
                                showMore = true;
                                len = MAX_ORG;
                            }
                            var vdcId = null;
                            var clickFn = function (event, $target, WidgetClass) {
                                var vdcId = $.encoder.canonicalize($target.find(".menu-item-btn").data("vdcid") + "");

                                // 个人设定  修改密码 index的偏移量为2
                                $scope.operator.switchVdc(vdcId);
                            };
                            for (var i = 0; i < len; i++) {
                                vdcId = vdcList[i].id;
                                if (vdcId !== $scope.user.vdcId) {
                                    newContent.push({
                                        "title": "<div class='menu-item-btn' data-vdcid='" + $.encoder.encodeForHTMLAttribute(vdcList[i].id) + "' title='" + $.encoder.encodeForHTMLAttribute(vdcList[i].name) + "'>" + $.encoder.encodeForHTML(vdcList[i].name) + "</div>",
                                        "id": "framework-menus-user-" + $.encoder.encodeForHTMLAttribute(vdcList[i].id),
                                        "vdcId": vdcId,
                                        "click": clickFn
                                    });
                                }
                            }
                            /*jshint -W030 */
                            showMore && newContent.push(moreContentItem(vdcList));
                            $scope.info.vdc.content = newContent;
                        }
                    });
                },
                switchVdc: function (vdcId) {
                    var promise = userService.switchVdcs($scope.user.id, vdcId);
                    promise.then(function (resolvedValue) {
                        if (vdcId !== MANAGE_ORG_ID) {
                            window.location.assign("/tenant/src/index.html");
                            return;
                        }
                        if ($scope.deployMode === "allInOne") {
                            window.location.assign("/center/src/index.html");
                        } else if ($scope.deployMode === "top") {
                            window.location.assign("/cloudmanager/src/index.html");
                        } else if ($scope.deployMode === "serviceCenter") {
                            window.location.assign("/cloudmanager/src/index.html");
                        } else {
                            return;
                        }
                    });
                }
            };
            $scope.operator.getVdcList();
        }
    ];

    return serviceMenusCtr;
});
