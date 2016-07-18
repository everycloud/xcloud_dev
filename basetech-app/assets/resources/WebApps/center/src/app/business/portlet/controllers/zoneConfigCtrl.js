define(['jquery',
    'tiny-lib/angular'],
    function ($, angular) {
        "use strict";

        var zoneConfigCtrl = ["$scope", function ($scope) {
            $scope.i18n = $("html").scope().i18n;
            $scope.zoneGroup = {
                "id":"zoneGroupId",
                "spacing":{"width" : "50px", "height" : "20px"},
                "values":[]
            };

            $scope.saveBtn = {
                id: "zoneConfigSaveBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label,
                tip: "",
                save: function () {
                    var zoneIdList = $("#"+$scope.zoneGroup.id).widget().opChecked("checked");
                    var scope = $("#portlet-resource-zone").scope();
                    scope.operator.queryStatistics(zoneIdList);
                    $("#zoneConfigWinID").widget().destroy();
                }
            };

            $scope.cancelBtn = {
                id: "zoneConfigCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $("#zoneConfigWinID").widget().destroy();
                }
            };

            /**
             * 初始化操作
             */
            $scope.init = function() {
                var params = $("#zoneConfigWinID").widget().option("params");
                var values = [];
                for (var index in params) {
                    values.push({
                        "key":params[index].id,
                        "text":params[index].name,
                        "checked":params[index].show
                    });
                }

                $scope.zoneGroup.values = values;
            };

            $scope.init();
        }];

        // 创建App
        var deps = [];
        var zoneConfigApp = angular.module("portlet.resource.zoneConfig", deps);
        zoneConfigApp.controller("portlet.resource.zoneConfig.ctrl", zoneConfigCtrl);

        return zoneConfigApp;
    });
