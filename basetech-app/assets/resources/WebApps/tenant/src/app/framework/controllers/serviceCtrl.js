/**
 * 框架Controller， 设置服务菜单的视图控制逻辑
 */
define(["tiny-lib/jquery", "language/keyID", "tiny-lib/angular", "tiny-lib/underscore", "fixtures/frameworkFixture"], function ($, i18n, angular, _, frameworkFixture) {
    "use strict";
    var getVdcById = function (vdclist, vdcid) {
        var item = _.where(vdclist, {
            "vdcId": vdcid
        });
        if (item && item.length > 0) {
            return item[0];
        }
        return null;
    };

    var sortVdcById = function (vdclist, vdcid) {
        var templist = _.filter(vdclist, function (item, index) {
            return item.vdcId !== vdcid;
        });
        return templist;
    };

    function dynamicHeight() {
        var footer = $("#service-footer");
        var mainMenu = $("#main_menu_div");
        var content = $("#service-content");

        footer.html('<footer class="footer"><div class="container"><p class="credit">' + i18n.common_term_HWright_label + '</p></div></footer>');
        var menusHeight = parseInt(mainMenu.css("height"), 10) + parseInt(mainMenu.css("margin-top"), 10) + parseInt(mainMenu.css("margin-bottom"), 10);

        var footHeight = parseInt(footer.css("height"), 10) + parseInt(footer.css("margin-top"), 10) + parseInt(footer.css("margin-bottom"), 10);

        content.css("min-height", (window.screen.availHeight - menusHeight * 2 - footHeight - 3));
        footer.css("top", document.getElementById("service-content").scrollHeight);
    }

    var serviceCtr = ["$rootScope", "$state", "$q", "camel", "$stateParams", "servicesPlugin",
        function ($rootScope, $state, $q, camel, $stateParams, servicesPlugin) {
            $rootScope.user = {};
            $rootScope.$watch("user.vdcId", function (newValue, oldValue) {
                //排序，将默认显示的组织放第一项
                if (!$rootScope.user) {
                    return;
                }
                $rootScope.vdcans = sortVdcById($rootScope.user.vdclist, $rootScope.user.vdcId);
                $rootScope.defaultVdcan = getVdcById($rootScope.user.vdclist, $rootScope.user.vdcId);
            });

            $rootScope.changeVdc = function (index) {
                $rootScope.defaultVdcan = $rootScope.user.vdclist[index];
            };

            var menus = {
                url: "app/framework/views/serviceMenus.html"
            };
            $rootScope.menus = menus;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.plugins = servicesPlugin.plugins;

            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams) {
                    camel.get({
                        "url": {
                            "s": "/goku/rest/heartbeat"
                        },
                        "userId": $("html").scope().user.id,
                        "monitor": false
                    });
                });

            //动态设置中间层的高度
            $rootScope.$on("$viewContentLoaded", function () {
                dynamicHeight();
            });
            angular.element(window).bind("resize", dynamicHeight);
            angular.element("#service-content").bind("scroll", dynamicHeight);


        }
    ];

    return serviceCtr;
});
