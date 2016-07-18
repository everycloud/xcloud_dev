/**
 * Created  on 14-4-15.
 */
define(['tiny-lib/jquery',
        "tiny-lib/jquery.base64",
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        'app/services/validatorService',
        'tiny-widgets/Window',
        'tiny-widgets/Message',
        'tiny-common/UnifyValid',
        'app/business/application/services/appCommonService',
        "bootstrap/bootstrap.min"
    ],
    function ($, $jBase, angular,sprintf, ngSanitize, keyIDI18n, http, validator, Window, Message, UnifyValid, appCommonService) {
        "use strict";
        var createTemplateCtrl = ["$rootScope", "$scope", "$compile", "camel", "$q", "appUtilService",
            function ($rootScope, $scope, $compile, camel, $q, appUtilService) {
                var $state = $("html").injector().get("$state");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                //获取参数
                var param = $("#app-templateList-createTemplate-winId").widget().option("param");
                var opt = $("#app-templateList-createTemplate-winId").widget().option("opt");
                var isCreate = (opt === "create");
                var appId = $("#app-templateList-createTemplate-winId").widget().option("appId");
                var exception = $("#app-templateList-createTemplate-winId").widget().option("exception");
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                $scope.fromFlag = $("#app-templateList-createTemplate-winId").widget().option("fromFlag") || "";

                $scope.templateName = {
                    "id": "templateName",
                    "label": i18n.common_term_name_label+":",
                    "width": "180",
                    "value": "",
                    "extendFunction": ["checkTemplateName"],
                    "require": true,
                    "tips": i18n.common_term_composition9_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256"),
                    "validate": "required:"+i18n.common_term_null_valid+";maxSize(256):" + i18n.sprintf(i18n.common_term_length_valid, "1", "256") + ";checkTemplateName(true):" + i18n.common_term_composition9_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256")
                };

                $scope.templateIcon = {
                    "id": "templateIcon",
                    label: i18n.common_term_icon_label+":",
                    require: true,
                    "width": "240",
                    "show": false,
                    "icon": "../theme/default/images/gm/appImage/buff01.jpg",
                    "imgs": [],
                    "click": function () {
                        $scope.templateIcon.show = !$scope.templateIcon.show;
                    },
                    "init": function () {
                        var img = function (index) {
                            var src = "../theme/default/images/gm/appImage/buff0" + index + ".jpg";
                            return {
                                "src": src,
                                "click": function () {
                                    $scope.templateIcon.icon = src;
                                }
                            };
                        };
                        var imgs = [];
                        for (var index = 1; index < 10; index++) {
                            imgs.push(img(index));
                        }
                        $scope.templateIcon.imgs = imgs;
                    }
                };
                //初始化可选图片信息
                $scope.templateIcon.init();
                $scope.templateDesc = {
                    "id": "templateDescp",
                    "label": i18n.common_term_desc_label+":",
                    "require": false,
                    "type": "multi",
                    "width": "350",
                    "height": "60",
                    "tips": i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                };

                $scope.templateModule = {
                    "id": "templateModule",
                    "label": i18n.template_term_appExample_label + ":",
                    "require": false,
                    "width": "180",
                    "values": [{
                        "selectId": "1",
                        "label": "WordPressBlog",
                        "checked": true
                    }, {
                        "selectId": "2",
                        "label": "WordPressBlog2"
                    }]
                };

                $scope.templateContent = {
                    "id": "templateContent",
                    "label": i18n.template_term_content_label+":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": "800",
                    "height": "400",
                    "readonly": false
                };

                var replaceSpecificSymbol = function(value) {
                    var result = value.replace(/\\t/g, "\\\\t");
                    result = result.replace(/\\f/g, "\\\\f");
                    result = result.replace(/\\b/g, "\\\\b");
                    result = result.replace(/\\n/g, "\\\\n");
                    result = result.replace(/\\r/g, "\\\\r");

                    return result;
                };

                $scope.okBtn = {
                    "id": "app-templates-createtemplate-create",
                    "text": i18n.common_term_save_label,
                    "tooltip": "",
                    "click": function () {
                        var validName = UnifyValid.FormValid($("#templateName"));
                        var des = UnifyValid.FormValid($("#templateDescp"));

                        if (!validName || !des) {
                            return;
                        }
                        var img = $scope.templateIcon.icon;
                        var image = img.substring(img.lastIndexOf("/") + 1);
                        var user = $("html").scope().user;
                        var name = $("#templateName").widget().getValue();
                        var desc = $("#templateDescp").widget().getValue();
                        var picture = $scope.templateIcon.icon;
                        var resPoolType = user.cloudType === "ICT" ? "OpenStack" : "FusionManager";
                        var templateBody = $("#templateContent").widget().getValue();
                        var param = null;
                        if (opt === "create") {
                            param = {
                                "name": $("#templateName").widget().getValue(),
                                "desc": $("#templateDescp").widget().getValue(),
                                "picture": image,
                                "resPoolType": resPoolType,
                                "body": $.base64.encode(templateBody, true)
                            };
                        } else {
                            param = {
                                "name": $("#templateName").widget().getValue(),
                                "desc": $("#templateDescp").widget().getValue(),
                                "picture": image,
                                "body": $.base64.encode(templateBody, true)
                            };
                        }

                        var deferred = createOrModifyApp(param);
                        deferred.then(function (data) {
                            if ($scope.fromFlag !== "2") {
                                $("#app-templateList-createTemplate-winId").widget().destroy();
                                $state.go("application.manager.template");
                            } else {
                                $("#app-templateList-createTemplate-winId").widget().destroy();
                            }
                        }, function (data) {
                            if (!exception.isException(data)) {
                                exception.doFaultPopUp();
                                return;
                            }
                            exception.doException(data);
                            if ($scope.fromFlag !== "2") {
                                $state.go("application.manager.template");
                            } else {
                                $("#app-templateList-createTemplate-winId").widget().destroy();
                            }
                        });
                    }
                };

                $scope.checkBtn = {
                    "id": "app-templates-createTemplate-check",
                    "text": i18n.app_term_checkout_button,
                    "tooltip": "",
                    "click": function () {
                        var user = $("html").scope().user;
                        var resPoolType = user.cloudType === "ICT" ? "OpenStack" : "FusionManager";
                        var templateBody = $("#templateContent").widget().getValue();

                        var options = {
                            "user": user,
                            "templateBody": $.base64.encode(templateBody, true),
                            "resPoolType": resPoolType
                        };
                        var deferred = appCommonServiceIns.validateAppTemplate(options);
                        deferred.then(function (data) {
                            showMessage(i18n.app_template_term_checkout_info_pass_msg);
                        }, function (data) {
                            showMessage(i18n.app_template_term_checkout_info_fail_msg);
                        });
                    }
                };

                $scope.closeBtn = {
                    "id": "app-templates-templateContent-close",
                    "text": i18n.common_term_shut_button,
                    "tooltip": "",
                    "click": function () {
                        if ($scope.fromFlag !== "2") {
                            $("#app-templateList-createTemplate-winId").widget().destroy();
                            $state.go("application.manager.template");
                        } else {
                            $("#app-templateList-createTemplate-winId").widget().destroy();
                        }
                    }
                };

                function showMessage(str) {
                    var msgOptions = {
                        "type": "confirm", //prompt,confirm,warn,error
                        "title": i18n.alarm_term_warning_label,
                        "content": str,
                        "width": "300",
                        "height": "200"
                    };
                    var msgBox = new Message(msgOptions);
                    var buttons = [{
                        label: i18n.common_term_ok_button,
                        accessKey: 'Y',
                        "default": true, //默认焦点
                        majorBtn : true,
                        handler: function (event) { //点击回调函数
                            msgBox.destroy();
                        }
                    }, {
                        label: i18n.common_term_cancle_button,
                        accessKey: 'N',
                        "default": false,
                        handler: function (event) {
                            msgBox.destroy();
                        }
                    }];
                    msgBox.option("buttons", buttons);
                    msgBox.show();
                }

                //创建或修改应用模板
                function createOrModifyApp(param) {
                    var user = $("html").scope().user;
                    var deferred = null;
                    var options = null;
                    if (opt === "create") {
                        options = {
                            "user": user,
                            "param": param
                        };
                        deferred = appCommonServiceIns.createAppTemplate(options);
                    }
                    if (opt === "modify") {
                        options = {
                            "user": user,
                            "id": appId,
                            "param": param
                        };
                        deferred = appCommonServiceIns.updateAppTemplate(options);
                    }
                    return deferred;
                }

                $scope.CustomJsonFormat = function(txt){
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

                //修改模板时显示参数的值
                function init(){
                    if ("modify" === opt) {
                        $scope.templateName.value = param.name;
                        $scope.templateDesc.value = param.desc;
                        $scope.templateIcon.icon = "../theme/default/images/gm/appImage/" + param.picture;
                        $scope.templateContent.value = $.base64.decode(param.body || "", true);
                    }
                }

                //验证模板名称
                UnifyValid.checkTemplateName = function (param) {
                    var value = $(this).val();
                    var templateNameReg = /^[0-9a-zA-Z \_\-]{1,256}$/;
                    return templateNameReg.test(value);
                };

                init();
            }
        ];

        var createTemplateModule = angular.module("app.templates.createTemplate", ['framework',"ngSanitize"]);
        createTemplateModule.controller("app.templates.createTemplate.ctrl", createTemplateCtrl);
        createTemplateModule.service("camel", http);
        createTemplateModule.service("ecs.vm.detail.disks.validator", validator);

        return createTemplateModule;
    }
);
