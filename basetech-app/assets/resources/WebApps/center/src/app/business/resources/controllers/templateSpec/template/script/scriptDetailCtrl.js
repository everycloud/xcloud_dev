define(['jquery',
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    'app/services/exceptionService'],
    function ($, angular, httpService, constants, exceptionService) {
        "use strict";

        var scriptDetailCtrl = ["$scope", "camel", "exception", function ($scope, camel, exception) {

            $scope.detail = {
                'name':"",
                'id':""
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "value":""
            };

            $scope.path = {
                label: $scope.i18n.common_term_fileTargetPath_label+":",
                require: false,
                "value":""
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: false,
                "value":""
            };

            $scope.command = {
                label: $scope.i18n.common_term_runCmd_label+":",
                require: false,
                "value":""
            };
            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "value":""
            };

            /**
             * 查询详情信息
             * @param id
             */
            $scope.queryDetail = function (id) {

                var deferred = camel.get({
                    "url": {"s":constants.rest.SCRIPT_DETAIL.url,"o":{"tenant_id":1,"scriptid":id}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    if (data == undefined) {
                        return;
                    }
                    $scope.$apply(function(){
                        $scope.detail.name = data.name;
                        $scope.detail.id = data.id;
                        $scope.picture.value = data.picture;
                        $scope.path.value = data.destinationPath;
                        $scope.command.value = (data.installCommand && data.installCommand != "") ? $.base64.decode(data.installCommand, true) : data.installCommand;
                        $scope.description.value = data.description;
                        $scope.version.value = data.version;
                    });
                });
                deferred.fail(function (data) {
                    exception.doException(data, null);
                });
            };
        }];

        var dependency = [];

        var scriptDetailModule = angular.module("template.script.detail", []);

        scriptDetailModule.controller("template.script.detail.ctrl", scriptDetailCtrl);
        scriptDetailModule.service("camel", httpService);
        scriptDetailModule.service("exception", exceptionService);

        return scriptDetailModule;
    });

