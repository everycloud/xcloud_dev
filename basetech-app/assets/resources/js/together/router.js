/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2014 Webapplayers.com
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");
    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "/view/dashboard/dashboard.html",
            data: { pageTitle: 'dashboard' }
        })
        .state('apps', {
            url: "/apps",
            templateUrl: "/view/apps/app_overview.html",
            data: { pageTitle: '应用' }
        })
        .state('hostpool', {
            url: "/hostpool",
            templateUrl: "/view/hostpool/hostpool_manage.html",
            data: { pageTitle: 'host管理' }
        })
}
angular
    .module('together')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
