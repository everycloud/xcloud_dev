/**
 * 下载service
 */
define(function () {
    "use strict";

    var service = function () {
        this.download = function (options) {
            options = options || {};
            var name = options.name;
            var type = options.type || "export";
            if (name) {
                var url = "/goku/rest/v1.5/file/" + encodeURIComponent(name) + "?type=" + type + "&t=" + Math.random();
                if (!window.downloadIFrame) {
                    window.downloadIFrame = document.createElement("iframe");
                    window.downloadIFrame.style.display = "none";
                    document.body.appendChild(window.downloadIFrame);
                }
                window.downloadIFrame.src = url;
            } else {
                throw "file name is required";
            }
        };
    };
    return service;
});