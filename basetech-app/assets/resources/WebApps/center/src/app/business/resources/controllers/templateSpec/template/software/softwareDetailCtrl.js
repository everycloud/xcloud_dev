define(["tiny-lib/angular",
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    'app/services/exceptionService'],
    function (angular, httpService, constants, exceptionService) {
        "use strict";

        var softwareDetailCtrl = ["$scope", "camel", "exception", function ($scope, camel, exception) {

            $scope.detail = {
                'name':"",
                'id':""
            };

            $scope.file = {
                label: $scope.i18n.template_term_softwareFile_label+":",
                require: false,
                "value":""
            };
            $scope.attachment = {
                label: $scope.i18n.common_term_attachment_label+":",
                require: false,
                "value":[]
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "value":""
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "value":""
            };

            $scope.fileSize = {
                label: $scope.i18n.common_term_sizeMB_label+":",
                require: false,
                "value":""
            };

            $scope.path = {
                label: $scope.i18n.common_term_path_label+":",
                require: false,
                "value":""
            };

            $scope.installCmd = {
                label: $scope.i18n.common_term_installCmd_label+":",
                require: false,
                "value":""
            };
            $scope.unInstallCmd = {
                label: $scope.i18n.common_term_uninstallCmd_label+":",
                require: false,
                "value":""
            };
            $scope.startCmd = {
                label: $scope.i18n.common_term_startupCmd_label+":",
                require: false,
                "value":""
            };
            $scope.stopCmd = {
                label: $scope.i18n.common_term_StopCmd_label+":",
                require: false,
                "value":""
            };

            /**
             * 初始化数据
             */
            $scope.queryDetail = function (id) {
                var deferred = camel.get({
                    "url": {"s": constants.rest.SOFTWARE_DETAIL.url, "o": {"tenant_id": 1, "softwareid": id}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function(){
                        $scope.detail.id = data.id;
                        $scope.detail.name = data.name;
                        $scope.file.value = data.mainFilePath == undefined ? "" :data.mainFilePath.substring(data.mainFilePath.lastIndexOf("/")+1, data.mainFilePath.length);
                        var attachmentPaths = [];
                        for (var index in data.attachmentPaths) {
                            var fileName = data.attachmentPaths[index].fileName;
                            attachmentPaths.push(fileName);
                        }
                        $scope.attachment.value = attachmentPaths;
                        $scope.path.value = data.destinationPath;
                        $scope.description.value = data.description;
                        $scope.picture.value = data.picture;
                        $scope.fileSize.value = data.fileSize;
                        $scope.installCmd.value = (data.installCommand && data.installCommand != "") ? $.base64.decode(data.installCommand, true) : data.installCommand;
                        $scope.unInstallCmd.value = (data.unInstallCommand && data.unInstallCommand != "") ? $.base64.decode(data.unInstallCommand, true) : data.unInstallCommand;
                        $scope.startCmd.value = (data.startCommand && data.startCommand != "") ? $.base64.decode(data.startCommand, true) : data.startCommand;
                        $scope.stopCmd.value = (data.stopCommand && data.stopCommand != "") ? $.base64.decode(data.stopCommand, true) : data.stopCommand;
                    });
                });
                deferred.fail(function (data) {
                    exception.doException(data, null);
                });
            };
        }];

        var dependency = [];

        var softwareModule = angular.module("template.software.softwareDetail", []);

        softwareModule.controller("template.software.softwareDetail.ctrl", softwareDetailCtrl);
        softwareModule.service("camel", httpService);
        softwareModule.service("exception", exceptionService);

        return softwareModule;
    });

