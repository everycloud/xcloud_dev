/* global define */
define(["tiny-lib/angular"], function (angular) {
    "use strict";
    var service = function () {
        this.basic = {
            "url": "../src/app/business/template/views/batchInstallPackage/batchInstall/basic.html"
        };
        this.addVM = {
            "url": "../src/app/business/template/views/batchInstallPackage/batchInstall/addVM.html"
        };
        this.confirm = {
            "url": "../src/app/business/template/views/batchInstallPackage/batchInstall/confirm.html"
        };

        this.show = {
            "basic": true,
            "commandConfig": false,
            "confirm": false
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
