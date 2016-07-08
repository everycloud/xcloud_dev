/**
 * Created on 14-3-3.
 */
define(["tiny-lib/angular"], function (angular) {
    "use strict";

    var service = function () {
        this.basicInfo = {
            "url": "../src/app/business/application/views/appInstance/createByCustom/basicInfo.html"
        };
        this.associateVM = {
            "url": "../src/app/business/application/views/appInstance/createByCustom/associateVM.html"
        };
        this.confirm = {
            "url": "../src/app/business/application/views/appInstance/createByCustom/confirm.html"
        };

        this.show = {
            "basicInfo": true,
            "associateVM": false,
            "confirm": false
        };
        this.name = "";
        this.description = "";
        this.type = "basic";
    };

    return service;
});
