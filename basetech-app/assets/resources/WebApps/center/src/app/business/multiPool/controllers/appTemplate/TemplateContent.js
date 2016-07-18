define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'app/services/httpService',
        'app/services/validatorService',
        'tiny-widgets/Window',
        'app/business/multiPool/services/desiger/desigerService',
        "tiny-lib/underscore"
    ],
    function ($, angular, http, validator, Window, desigerService, _) {
        "use strict";
        var copyTemplateCtrl = ["$scope", "$compile", "camel", "exception", "$q",
            function ($scope, $compile, camel, exception, $q) {
            var user = $("html").scope().user;
            var isOpenstack = (user.cloudType === "OPENSTACK" ? true : false);
            var $state = $("html").injector().get("$state");
            $scope.id = $("#app-templateList-templateContent-winId").widget().option("templateId");
            $scope.templateContent = {
                "id": "app-templates-templateContent-input",
                "label": $scope.i18n.template_term_content_label + ":",
                "require": false,
                "value": "",
                "type": "multi",
                "width": "800",
                "height": "600",
                "readonly":true
            };

            $scope.closeBtn = {
                "id": "app-templates-templateContent-close",
                "text": $scope.i18n.common_term_close_button || "关闭",
                "tooltip": "",
                "click": function () {
                    $("#app-templateList-templateContent-winId").widget().destroy();
                    $state.go("serviceMgr.appTemplate");
                }
            };

                $scope.CustomJsonFormat = function (txt) {
                    var stepBack4 = "    ";
                    if (/^\s*$/.test(txt)) {
                        return txt;
                    }
                    var data = null;
                    try {
                        data = JSON.parse(txt);
                    } catch (e) {
                        return txt;
                    }

                    if (null === data || !data.Resources) {
                        return data;
                    }
                    // 如果是脚本需要屏蔽六个参数:UninstallCommands StartCommands StopCommands UninstallParams StartParams StopParams
                    _.each(data.Resources, function (resource) {
                        if (resource && resource.Properties && resource.Properties.Softwares) {
                            var softwares = resource.Properties.Softwares;
                            _.each(softwares, function (software) {
                                if (software && software.Type === "Script") {
                                    delete software.UninstallCommands;
                                    delete software.UninstallParams;
                                    delete software.StartCommands;
                                    delete software.StartParams;
                                    delete software.StopCommands;
                                    delete software.StopParams;
                                }
                            });
                        }
                    });

                    // 转义中间的双引号
                    var replaceQuotation = function(value) {
                        if (/^\s*$/.test(value)) {
                            return value && value.replace(/\n/g,"").replace(/\r/g,"");
                        }

                        return value.replace(/\"/g, "\\\"").replace(/\n/g,"").replace(/\r/g,"");
                    };

                    var draw = [];
                    var table = '\n';
                    var notify = function (key, value, isLast, backward, fromObj) {
                        var tab = '';
                        var i;
                        var j;
                        var k;
                        var len;
                        for (i = 0; i < backward; i++) {
                            tab += stepBack4;
                        }
                        ++backward;

                        if (value && (value.constructor === Array)) {
                            draw.push(tab + (fromObj ? ('"' + key + '":') : '') + '[' + table);
                            for (j = 0; j < value.length; j++) {
                                notify(j, value[j], (j === (value.length - 1)), backward, false);
                            }
                            draw.push(tab + ']' + (isLast ? table : (',' + table)));
                        } else if (value && (typeof value === 'object')) {
                            draw.push(tab + (fromObj ? ('"' + key + '":') : '') + '{' + table);
                            len = 0;
                            k = 0;
                            _.each(value, function (item, index) {
                                ++len;
                            });
                            _.each(value, function (item, index) {
                                notify(index, value[index], (++k === len), backward, true);
                            });
                            draw.push(tab + '}' + (isLast ? table : (',' + table)));
                        } else {
                            if (typeof value === 'string') {
                                value = replaceQuotation(value);
                                value = '"' + value + '"';
                            }
                            draw.push(tab + (fromObj ? ('"' + key + '":') : '') + value + (isLast ? table : (',' + table)));
                        }
                    };

                    notify('', data, true, 0, false);
                    return draw.join("");
                };

            function queryServiceTemplateContent(id){
                if (!id){
                    return;
                }
                var deferred = camel.get({
                    "url": {
                        "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}/contents",
                        "o": {
                            "tenant_id": "all",
                            "id": id
                        }
                    },
                    "userId": user.id,
                    "params": {}
                });

                deferred.success(function(data){
                    if (!data){
                        return;
                    }
                    //空消息体不能在界面上显示为null
                    if (!data.body || (data.body == "")){
                        $scope.templateContent.value = "";
                        return;
                    }
                    $scope.$apply(function(){
                        if (data && data.body && (data.body != "")) {
                            data.body = $.base64.decode(data.body, true);
                        }

                        if (isOpenstack) {
                            $scope.templateContent.value = data.body;
                        } else {
                            $scope.templateContent.value = $scope.CustomJsonFormat(data.body);
                        }
                    });
                });
                deferred.fail(function(data){
                    if (!exception.isException(data)){
                        exception.doFaultPopUp();
                        return;
                    }
                    exception.doException(data);
                });
            }

            queryServiceTemplateContent($scope.id);
        }];

        var copyTemplateModule = angular.module("app.templates.templateContent", ['framework']);
        copyTemplateModule.controller("app.templates.templateContent.ctrl", copyTemplateCtrl);
        copyTemplateModule.service("camel", http);
        copyTemplateModule.service("ecs.vm.detail.disks.validator", validator);

        return copyTemplateModule;
    }
);