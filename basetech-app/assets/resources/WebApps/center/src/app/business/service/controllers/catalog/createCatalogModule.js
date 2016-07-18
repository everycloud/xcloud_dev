/**
 * Created by  on 14-2-13.
 */
define([
    'tiny-lib/angular',
    'app/business/service/controllers/catalog/choiseCatalogCtrl',

    "app/services/httpService",
    'app/services/exceptionService',
    "app/business/service/controllers/catalog/createCatalogService",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-directives/Step",
    "tiny-directives/Table",
    "tiny-directives/RadioGroup",
    "tiny-directives/Select",
    "tiny-directives/Radio",
    "tiny-directives/IP"],
    function (angular, choiseCtrl, http,exception, monkey) {
        "use strict";
        var createCatalogNewCtrl = ["$rootScope", "monkey","$scope","exception", function ($rootScope, monkey,$scope,exception) {
            var $state = $("html").injector().get("$state");
            $rootScope.close = function () {
                $state.go("service.serviceManager");
            };
            $rootScope.monkey = monkey;

            //公共数据
            $rootScope.service = {
                "selectedId":"",    //当前选中的模板ID
                "configType":"system",    //tab页签
                "info" : [],
                // 计算磁盘的总大小
                "getDiskTotalSize": function(disks, sizeName) {
                    var total = 0;
                    if (disks && disks.length > 0) {
                        _.each(disks, function (item) {
                            total += parseInt(item[sizeName], 10);
                        })
                    }
                    return total;
                }
             }
            }
        ];
        var summary = function() {
            return {
                templateUrl: 'app/business/service/views/catalog/createCatalogNew.html',
                restrict:"EA",
                scope: false,
                controller:createCatalogNewCtrl
            };
        };

        var createCatalog = angular.module("createCatalogNew", ["ng", "wcc"]);
        createCatalog.controller("choiseCtrl", choiseCtrl);
        createCatalog.directive("myContainer", summary);
        createCatalog.service("camel", http);
        createCatalog.service("monkey", monkey);
        createCatalog.service("exception", exception);
        return createCatalog;
    });
