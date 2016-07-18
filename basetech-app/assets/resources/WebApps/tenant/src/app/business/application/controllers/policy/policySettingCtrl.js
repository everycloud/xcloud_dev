/* global define */
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    'app/services/cloudInfraService'
], function ($, angular, cloudInfraService) {
    "use strict";

    var policySettingsCtrl = ["$scope", "$state", "$q", "camel", "storage",
        function ($scope, $state, $q, camel, storage) {
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var user = $scope.user;
            var i18n = $scope.i18n;
            $scope.currentCloudInfraId = null;

            $scope.help = {
                "helpKey": "drawer_app_policy",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.plugins = [
                {
                    "openState": "application.manager.policy.plan",
                    "name": i18n.app_term_schedule_label
                },
                {
                    "openState": "application.manager.policy.log",
                    "name": i18n.app_term_policyLog_label
                }
            ];

            //地域下拉框
            $scope.planVDCSel = {
                "id": "planVDCSel",
                "width": "135",
                "label": i18n.common_term_section_label+":   ",
                "values": [],
                "change": function () {
                    $scope.currentCloudInfraId = $("#planVDCSel").widget().getSelectedId();
                    storage.add("cloudInfraId", $scope.currentCloudInfraId);
                }
            };

            //查询当前租户可见的地域列表
            $scope.getLocations = function () {
                var promise = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                promise.then(function (data) {
                    if (!data) {
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        var curr = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras);
                        $scope.currentCloudInfraId = curr.selectId;
                        $scope.planVDCSel.values = data.cloudInfras;
                    }
                });
                return promise;
            };

            //获取初始化信息
            $scope.$on("$viewContentLoaded", function () {
                $scope.getLocations();
            });

            $scope.$watch("currentCloudInfraId", function (newV, oldV) {
                if (!newV) {
                    return;
                }
                $scope.$broadcast("changeCloudInfraEvent", newV);
            });
        }
    ];

    return policySettingsCtrl;
});
