/**
 * Created on 14-1-25.
 */
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    "app/business/application/services/appCommonService",
], function ($, angular, layout, AppCommonService) {
    "use strict";

    var navigateCtrl = ["$scope", "$state", "camel", "appCommonData", "$stateParams","exception", "$q",
        function ($scope, $state, camel, appCommonData, $stateParams, exception, $q) {
            if (!appCommonData.vpcId) {
                appCommonData.vpcId = $stateParams.vpcId;
            }
            if (!appCommonData.cloudInfraId) {
                appCommonData.cloudInfraId = $stateParams.cloudInfraId;
            }
            if (!appCommonData.appId) {
                appCommonData.appId = $stateParams.appId;
            }
            if (!appCommonData.appName) {
                appCommonData.appName = $stateParams.appName;
            }

            var user = $("html").scope().user;
            var i18n = $scope.i18n;
            var appCommonService = new AppCommonService(exception, $q, camel);
            $scope.isIT = (user.cloudType === "IT");

            $scope.id = "appInstance-navigate-layout";
            var lay = new layout({
                "id": $scope.id,
                "subheight": 108
            });
            $scope.$on("$stateChangeSuccess", function () {
                if ($state.includes('application.navigate.monitor')) {
                    lay.opActive($("a[ui-sref='application.navigate.monitor']").last());
                } else {
                    var cur = $("#"+$scope.id + " .tiny-layout-west").find("a[ui-sref='" + $state.$current.name + "']").last();
                    if (cur.length > 0) {
                        lay.opActive(cur);
                    }
                }

                if($scope.isIT) {
                    $scope.queryAppOverview();
                }
            });
            //应用的健康状态
            $scope.healthStatusUI = "";
            $scope.appHealth = "";
            //查询应用实例信息
            $scope.queryAppOverview = function () {
                var promise = appCommonService.queryAppOverviewResource({
                    "vdcId": user.vdcId,
                    "appId": appCommonData.appId,
                    "cloudInfraId": appCommonData.cloudInfraId,
                    "userId": user.id,
                    "vpcId": appCommonData.vpcId
                });
                promise.then(function (data) {
                    var healthStatus = data.healthStatus;
                    var healthStatusUI = i18n.common_term_unknown_value;
                    if(healthStatus === "alarm") {
                        healthStatusUI = i18n.common_term_notHealth_value;
                        $scope.appHealth = "unhealth-status";
                    }
                    else if(healthStatus === "normal") {
                        healthStatusUI = i18n.common_term_health_value;
                        $scope.appHealth = "health-status";
                    }
                    else if(healthStatus === "--") {
                        healthStatusUI = i18n.common_term_unknown_value;
                        $scope.appHealth = "unknown-status";
                    }
                    else {
                        healthStatusUI = i18n.common_term_unknown_value;
                        $scope.appHealth = "unknown-status";
                    }
                    $scope.healthStatusUI = healthStatusUI;
                });
            };
        }
    ];
    return navigateCtrl;
});
