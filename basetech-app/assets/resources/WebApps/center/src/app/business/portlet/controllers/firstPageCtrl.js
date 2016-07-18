define(["tiny-lib/jquery",
    "tiny-lib/underscore",
    "tiny-lib/angular",
    "app/business/portlet/controllers/servicePageCtrl",
    "app/business/portlet/controllers/resourcePageCtrl",
    "app/business/portlet/controllers/ictResourcePageCtrl",
    "fixtures/userFixture"],
    function ($, _, angular, servicePageCtrl, resourcePageCtrl, ictResourcePageCtrl) {
        "use strict";
        var firstPageCtrl = ["$scope", "$compile", "$state", "camel", "$rootScope", function ($scope, $compile, $state, camel, $rootScope) {
            var deployMode = $scope.deployMode;
            var user = $scope.user;
            var openstack = $scope.openstack = user.cloudType === "OPENSTACK";
            var privilege = user.privilege;
            var right = $scope.right = {
                "resourceStatistic": privilege["resource_term_resourceStatistic_label"],
                "vmStatic": privilege["common_term_check_button"],
                "device": privilege["role_role_add_option_deviceView_value"],
                "zone": privilege["role_role_add_option_zoneView_value"],
                "cloudInfras": privilege["role_role_add_option_cloudPoolView_value"],
                "approval": privilege["role_role_add_option_orderApproval_value"],
                "vdc": privilege["org_term_organization_label"]
            };
            var currentTab = "";

            $scope.tabs = {
                service: {
                    show: 'local' != deployMode && (right.resourceStatistic || right.cloudInfras || right.vdc || (right.approval && $scope.isServiceCenter)),
                    active: 'local' != deployMode
                },
                resource: {
                    show: (!openstack && 'top' != deployMode) && (right.resourceStatistic || right.zone || right.vmStatic || right.device),
                    active: 'local' == deployMode
                },
                ictResource: {
                    show: openstack && 'top' != deployMode,
                    active: 'local' == deployMode
                }
            };
            /*
             * @param：tab:需要点亮的tab
             * @return:是否设置成功
             * */
            $scope.setCurrentTab = function (tab) {
                var tabs = [];
                for (var p in $scope.tabs) {
                    $scope.tabs[p].show && tabs.push(p);
                }
                if (tabs && tabs.length) {
                    if (!_.contains(tabs, tab)) {
                        for (var i = 0, len = tabs.length; i < len; i++) {
                            var item = tabs[i];
                            if ($scope.tabs[item].show) {
                                $scope.tabs[item].active = true;
                                currentTab = item;
                                break;
                            }
                        }
                        return false;
                    } else {
                        for (var i = 0, len = tabs.length; i < len; i++) {
                            var item = tabs[i];
                            item == tab && (currentTab = tab);
                            $scope.tabs[item].active = item == tab;
                        }
                        return true;
                    }
                } else {

                }
                return false;
            };

            function goResource() {
                if (openstack && $scope.setCurrentTab("ictResource")) {
                    $state.go("home.ictResource");
                } else if (!openstack && $scope.setCurrentTab("resource")) {
                    $state.go("home.resource");
                }
            }

            function goTab(current) {
                if ("service" == current) {
                    $scope.setCurrentTab("service") && $state.go("home.service");
                } else {
                    goResource();
                }
            }

            $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                //start为home且不是local 或者
                if ("home" == $state.current.name) {
                    var current = $scope.tabs.service.active ? "service" : "resource";
                    goTab(current);
                } else {
                    var pre = "home.";
                    var tab = $state.current.name.substr(pre.length);
                    //若没有设置为期望的tab（权限，部署方式导致该tab不可设），则跳转的找到的第一个可用tab
                    !$scope.setCurrentTab(tab) && currentTab && $state.go(pre + currentTab);
                }
            });
        }];

        var dependency = [
            servicePageCtrl.name,
            resourcePageCtrl.name,
            ictResourcePageCtrl.name
        ];

        var firstPageModule = angular.module("firstPage", dependency);
        firstPageModule.controller("firstPage.ctrl", firstPageCtrl);
        return firstPageModule;
    });