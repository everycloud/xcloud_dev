/* global define */
define(["tiny-lib/angular"], function (angular) {
    "use strict";
    var service = function () {
        this.basic = {
            "url": "../src/app/business/template/views/script/create/basic.html"
        };
        this.commandConfig = {
            "url": "../src/app/business/template/views/script/create/commandConfig.html"
        };
        this.confirm = {
            "url": "../src/app/business/template/views/script/create/confirm.html"
        };
        this.uploadFile = {
            "url": "../src/app/business/template/views/script/create/uploadFile.html"
        };

        this.show = {
            "basic": true,
            "commandConfig": false,
            "confirm": false,
            "uploadFile": false
        };

        /**
         * 公共数据
         */
        this.name = "";
        this.description = "";
        this.type = "basic";
    };

    return service;
});
