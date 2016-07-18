define(["tiny-lib/angular"], function (angular) {
    "use strict";
    var service = function() {
        this.catalogBasic = {
            "url": "../src/app/business/service/views/catalog/choiseCatalog.html",
            "chooseInfo":[]
        }
        this.show ={
            "catalogBasic":true
        };

    };

    return service;
});
