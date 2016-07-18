define(["tiny-lib/angular", "tiny-lib/jquery"], function (angular, $) {
    "use strict";
    var expandClassName = "dropdownexpand";
    var collapseClassName = "dropdowncollapse";

    function troglleCollapse($dom) {
        $dom.find("." + expandClassName).removeClass(expandClassName).addClass(collapseClassName);
    }

    function Help($sce, $http) {
        var container = null;
        var parent = null;
        var left = null;
        var init = function (id) {
            if (typeof id === 'string') {
                container = $("#" + id);
            } else {
                container = $(id);
            }

            if (container.length === 0) {
                return;
            }

            parent = container.closest("div[ui-view]");
            left = parent.offset().left + parent.width() - 22;
            var height = $("#service-content").css("height");
            container.css({
                height: height,
                border: "1px solid #e0e0e0",
                "width": "0",
                "z-index": 2,
                "background-color": "#fafafa",
                "position": "absolute",
                "left": left,
                "top": $("#main_menu_div").height() + "px",
                "overflow-y": "auto",
                "padding": "10px 10px 10px 10px"
            });
            return container;
        };

        var update = function (htmlUrl) {
            var deferred = null;
            var url = $sce.getTrustedResourceUrl(htmlUrl);
            if (angular.isDefined(url)) {
                deferred = $http.get(url, {cache: true}).then(function (response) {
                    var matchEL = $("<div>");
                    matchEL.html(response.data).find("script").remove();
                    matchEL.find("link").remove();
                    matchEL.find("meta").remove();
                    var helpContent = container.find(".help-content");
                    helpContent.html(matchEL);
                    troglleCollapse(helpContent);
                });
            }
            return deferred;
        };

        this.show = function (id, htmlUrl) {
            init(id);
            update(htmlUrl);
            container.css("display", "block");
            container.animate({
                opacity: 1,
                "width": "+=400",
                left: "-=400"
            }, 400);
        };

        this.hide = function (id) {
            init(id);
            container.animate({
                opacity: 0,
                "width": "-=400"
            }, 400, function () {
                container.css("display", "none");
            });
        };
    }

    Help.$injector = ["$sce", "$http"];
    return Help;
});