define(["tiny-lib/jquery"], function ($) {
    "use strict";
    function MaskItem() {
        this.background = $('<div>').css({
            "z-index": 10000000000,
            "background": "#aaaaaa url(../theme/default/images/message_cover.png) 50% 50% repeat-x",
            "opacity": ".30",
            "filter": "Alpha(Opacity=30)",
            "position": "fixed",
            "top": 0,
            "left": 0,
            "width": "100%",
            "height": "100%"
        });
        this.loading = $('<div>').css({
            "z-index": 10000000000,
            "margin": "auto",
            "text-align": "center",
            "position": "fixed",
            "width": "100%",
            "height": "100%",
            "top": 0,
            "background-image": "url(../theme/default/images/backgroud-loading.gif)",
            "background-repeat": "no-repeat",
            "background-position": "50%"
        });
    }

    MaskItem.prototype.show = function () {
        $("body").append(this.background);
        $("body").append(this.loading);
    };

    MaskItem.prototype.hide = function () {
        this.background.remove();
        this.loading.remove();
    };
    window.maskItem = new MaskItem();

    var Mask = {
        "show": function () {
            window.maskItem.show();
        },
        "hide": function () {
            window.maskItem.hide();
        }
    };
    return Mask;
});