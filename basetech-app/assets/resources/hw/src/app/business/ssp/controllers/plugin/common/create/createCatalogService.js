/* global define */
define(["tiny-lib/angular"], function (angular) {
    "use strict";
    var service = function () {
        this.catalogBasic = {
            "url": "../src/app/business/ssp/views/plugin/common/create/choiseCatalog.html"
        };
        this.basicInfo = {
            "url": "../src/app/business/ssp/views/plugin/common/create/createCataloBasic.html"
        };

        this.show = {
            "catalogBasic": true,
            "basicInfo": false
        };
    };

    return service;
});
