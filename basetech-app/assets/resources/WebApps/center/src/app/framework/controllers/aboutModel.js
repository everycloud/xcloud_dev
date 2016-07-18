/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-5-7
 */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/userService"], function ($, angular, ngSanitize, http, ExceptionService, UserService) {
        "use strict";
        var aboutCtrl = ['$scope', 'camel', '$q', function ($scope, camel, $q) {
            var aboutWindow = $("#aboutWindow").widget();
            var exception = new ExceptionService();
            var userService = new UserService(exception, $q, camel);
            var licenseVersion = userService.licenseVersion;
            var $rootScope = $("html").scope();
            var userId = $rootScope.user.id;
            var i18n = $scope.i18n = $rootScope.i18n;
            $scope.isIt = $rootScope.user.cloudType !== "OPENSTACK";
            $scope.isIct = $rootScope.user.cloudType === "OPENSTACK";
            var getVersion = function () {
                var promise = userService.systemInfo(userId);
                promise.then(function (resolvedValue) {
                    if (resolvedValue) {
                        $scope.version = resolvedValue.version;
                        $scope.name = resolvedValue.name;
                    }
                });
            };
            var getLicenseVersion = function () {
                var promise = userService.queryLicense(userId);
                promise.then(function (response) {
                    var version = response && response.licenseInfo && response.licenseInfo.salesVersionInfo;
                    $scope.licenseVersionText = version && licenseVersion[version];
                });
            };

            if($rootScope.isServiceCenter){
                $scope.logo = "../theme/default/images/product_name_SC1.png";
            }
            else if($scope.isIct){
                $scope.logo = "../theme/default/images/product_name_ict_about.png";
            }
            else{
                $scope.logo = "../theme/default/images/product_name_it_about.png";
            }

            $scope.deployMode = $rootScope.deployMode;
            $scope.versionLabel = (i18n.common_term_version_label || "版本") + ":";
            $scope.copyright = [
                i18n.common_term_HWright_label || "版权所有 &copy; 华为技术有限公司 2008-2014。 保留一切权利。",
                i18n.common_term_rightWarning_label || "警告：本软件受著作权法和国际版权条约保护。未经授权擅自复制或者分发程序的全部或任何部分，将承担一切由此导致的民事或刑事责任。"
            ];

            $scope.website = {
                text: "http://www.huawei.com",
                url: "http://www.huawei.com",
                target: "blank"
            };
            getVersion();
            //需license权限
            $rootScope.user.privilege.role_role_add_option_licenseView_value && getLicenseVersion();
        }];
        var aboutModule = angular.module("aboutModule", ['ng', 'wcc', 'ngSanitize']);
        aboutModule.controller("aboutCtrl", aboutCtrl);

        aboutModule.service("camel", http);
        return aboutModule;
    }
);

