/**
 * 框架Controller， 设置服务菜单的视图控制逻辑
 */
define(["language/keyID","fixtures/frameworkFixture"], function (i18n, frameworkFixture) {
    "use strict";

    var serviceCtr = ["$rootScope", "$state", "$q", "camel", "$stateParams",  "servicesPlugin",
        function ($rootScope, $state, $q, camel, $stateParams, servicesPlugin) {
            $rootScope.user = null;
            var menus = {
                url: "app/framework/views/serviceMenus.html"
            };
            $rootScope.menus = menus;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.getPlugins = servicesPlugin.getPlugins;

            //动态设置中间层的高度
            $rootScope.$on("$viewContentLoaded", function () {
                dynamicHeight();
            });
            angular.element(window).bind("resize", dynamicHeight);
            angular.element("#service-content").bind("scroll", dynamicHeight);
            function dynamicHeight() {
                $("#service-footer").html('<footer class="footer"><div class="container"><p class="credit">'+i18n.common_term_HWright_label+'</p></div></footer>');
                var menusHeight = parseInt($("#main_menu_div").css("height"))
                    + parseInt($("#main_menu_div").css("margin-top"))
                    + parseInt($("#main_menu_div").css("margin-bottom"));

                var footHeight = parseInt($("#service-footer").css("height"))
                    + parseInt($("#service-footer").css("margin-top"))
                    + parseInt($("#service-footer").css("margin-bottom"));

                $("#service-content").css("min-height", (window.screen.availHeight - menusHeight * 2 - footHeight - 3));
                $("#service-footer").css("top", document.getElementById("service-content").scrollHeight);
            };
            function dynamicHeight1() {
                var $pageFooter = $("#service-footer");
                $pageFooter.html('<footer class="footer"><div class="container"><p class="credit">'+i18n.common_term_HWright_label+'</p></div></footer>');

                var viewHeight = $(window).height();
                var MIN_HEIGHT = 500;
                viewHeight < MIN_HEIGHT && (viewHeight = MIN_HEIGHT);
                var contentMinHeight = viewHeight - $("#main_menu_div").outerHeight() - $pageFooter.outerHeight();

                $("#service-content").css("min-height", contentMinHeight);
                $pageFooter.css("top", document.getElementById("service-content").scrollHeight);
            };
        }];

    return serviceCtr;
});