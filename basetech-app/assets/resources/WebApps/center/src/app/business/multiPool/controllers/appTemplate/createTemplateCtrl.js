/**
 * Created  on 14-4-15.
 */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'app/services/httpService',
    'app/services/validatorService',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'tiny-common/UnifyValid',
    "./designer/framework/DesignerValid",
    "bootstrap/bootstrap.min"],
    function($, angular, http, validator, Window,Message,UnifyValid, DesignerValid){
        // 注:此处为了兼容C10模板属性重复之类的bug,不使用strict模式
        var createTemplateCtrl = ["$rootScope","$scope", "$compile", "camel", function($rootScope,$scope, $compile, camel){
            var $state = $("html").injector().get("$state");
            //获取参数
            var param = $("#app-templateList-createTemplate-winId").widget().option("param");
            var opt = $("#app-templateList-createTemplate-winId").widget().option("opt");
            var appId = $("#app-templateList-createTemplate-winId").widget().option("appId");
            var exception = $("#app-templateList-createTemplate-winId").widget().option("exception");
            $scope.fromFlag = $("#app-templateList-createTemplate-winId").widget().option("fromFlag") || "";

            UnifyValid.checkAppTempateName = function () {
                var element = this;
                var value = element.val();
                if ((!/^[\u4e00-\u9fa5A-Za-z0-9-_ ]*$/.test(value)) || value.length < 1 || value.length > 256) {
                    return false;
                }
                return true;
            };

            $scope.name ={
                "id": "name",
                "label": $scope.i18n.common_term_name_label + ":",
                "width":"180",
                "value":"",
                "require": true,
                "extendFunction": ["checkAppTempateName"],
                "tips": $scope.i18n.common_term_composition7_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256),
                "validate": "checkAppTempateName():"+$scope.i18n.common_term_composition7_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256)
            };

            $scope.templateIcon ={
                "id": "templateIcon",
                label: $scope.i18n.common_term_icon_label + ":",
                require: true,
                "width": "240",
                "show":false,
                "icon":"../theme/default/images/gm/appImage/buff01.jpg",
                "imgs":[],
                "click":function(){
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
                        }
                    };
                    var imgs = [];
                    for (var index = 1; index < 10; index++)
                    {
                        imgs.push(img(index));
                    }
                    $scope.templateIcon.imgs = imgs;
                }
            };

            //初始化可选图片信息
            $scope.templateIcon.init();
            $scope.description ={
                "id": "description",
                "label": $scope.i18n.common_term_desc_label+":",
                "require": false,
                "type": "multi",
                "width":"350",
                "height":"60",
                    "tips": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024),
                    "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.templateModule ={
                "id": "templateModule",
                "label": $scope.i18n.template_term_appExample_label+":",
                "require": false,
                "width":"180",
                "values": [
                    {
                        "selectId": "1",
                        "label": "WordPressBlog",
                        "checked": true
                    },
                    {
                        "selectId": "2",
                        "label": "WordPressBlog2"
                    }]
            };

            $scope.templateContent = {
                "id": "templateContent",
                "label": $scope.i18n.template_term_content_label + ":",
                "require": false,
                "value": "",
                "type": "multi",
                "width": "800",
                "height": "400",
                "readonly":false
            };

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
            if("modify" == opt){
                $scope.name.value = param.name;
                $scope.description.value = param.desc;
                $scope.templateIcon.icon  = "../theme/default/images/gm/appImage/"+param.picture;
                $scope.templateContent.value = param.body;
            }

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
                "text": $scope.i18n.common_term_save_label || "保存",
                "tooltip": "",
                "click": function () {

                       var img = $scope.templateIcon.icon;
                       var image = img.substring(img.lastIndexOf("/")+1);
                       var user = $("html").scope().user;
                       var name = $("#name").widget().getValue();
                       var desc = $("#description").widget().getValue();
                       var picture =  $scope.templateIcon.icon;
                       var resPoolType = user.cloudType === "OPENSTACK"?"OpenStack":"FusionManager";
                       var body = $("#templateContent").widget().getValue();
                        var param = null;
                        if(opt == "create"){
                            param ={
                                "name":$("#name").widget().getValue(),
                                "desc":$("#description").widget().getValue(),
                                "picture": image,
                                "resPoolType":resPoolType,
                                "body":$.base64.encode(body, true)
                            };
                        }else{
                            param ={
                                "name":$("#name").widget().getValue(),
                                "desc":$("#description").widget().getValue(),
                                "picture": image,
                                "body":$.base64.encode(body, true)
                            };
                        }

                        var deferred = createOrModifyApp(param);
                        deferred.success(function(data){
                            if ($scope.fromFlag != "2"){
                                $("#app-templateList-createTemplate-winId").widget().destroy();
                            }
                            else {
                                $("#app-templateList-createTemplate-winId").widget().destroy();
                            }
                        });
                        deferred.fail(function(data){
                            if (!exception.isException(data)){
                                exception.doFaultPopUp();
                                return;
                            }
                            exception.doException(data);
                            if ($scope.fromFlag != "2"){
                            }
                            else {
                                $("#app-templateList-createTemplate-winId").widget().destroy();
                            }

                        });
                }
            };


            $scope.checkBtn = {
                "id": "app-templates-createTemplate-check",
                "text": $scope.i18n.app_term_checkout_button || "校验模板内容",
                "tooltip": "",
                "click": function () {
                    var user = $("html").scope().user;
                    var resPoolType = user.cloudType === "OPENSTACK"?"OpenStack":"FusionManager";
                    var body = $.base64.encode($("#templateContent").widget().getValue(), true);
                   var deferred = camel.post({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/validation",
                            "o": {tenant_id: "all"}
                        },
                        "params": JSON.stringify({
                                "templateBody":body,
                                "resPoolType":resPoolType
                        }),
                        "userId":user.id
                    });
                    deferred.success(function(data){
                        showMessage($scope.i18n.app_template_term_checkout_info_pass_msg || "校验模板内容成功");
                    });
                    deferred.fail(function(data){
                        showMessage($scope.i18n.app_template_term_checkout_info_fail_msg || "校验模板内容不通过");
                    });
                }
            };

            $scope.closeBtn = {
                "id": "app-templates-templateContent-close",
                "text": $scope.i18n.common_term_close_button || "关闭",
                "tooltip": "",
                "click": function () {
                    if ($scope.fromFlag != "2"){
                        $("#app-templateList-createTemplate-winId").widget().destroy();
                    }
                    else {
                        $("#app-templateList-createTemplate-winId").widget().destroy();
                    }
                }
            };

            function showMessage(str){
                var msgOptions = {
                    "type":"confirm",
                    "title":$scope.i18n.common_term_tip_label || "提示",
                    "content":str,
                    "width":"300",
                    "height":"200"
                };
                var msgBox = new Message(msgOptions);
                var buttons = [
                    {
                        label:$scope.i18n.common_term_ok_button|| '确定',
                        accessKey: 'Y',
                        majorBtn : true,
                        "default": true,//默认焦点
                        handler: function (event) {//点击回调函数
                            msgBox.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button || '取消',
                        accessKey: 'N',
                        "default": false,
                        handler: function (event) {
                            msgBox.destroy();
                        }
                    }
                ];
                msgBox.option("buttons",buttons);
                msgBox.show();
            }

            //创建或修改应用模板
            function createOrModifyApp(param){
                var user = $("html").scope().user;
                var deferred = null;
                if(opt === "create"){
                    deferred = camel.post({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/apptemplates",
                            "o": {tenant_id: "all"}
                        },
                        "params": JSON.stringify(param),
                        "userId":user.id
                    });

                }
                if(opt === "modify"){
                    deferred = camel.put({
                        "url":{
                            "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}",
                            "o":{"tenant_id":"all","id":appId}
                       },
                       "params":JSON.stringify(param),
                       "userId":user.id
                  });
                }
                return deferred;
            }

            var str = "{\"name\":\"afaf\",\"TemplateFormatVersion\":\"1.0\",\"Description\":\"\",\"Parameters\":{},\"Resources\":{\"AME_id_2114151\":{\"Name\":\"DefaultNetwork_1\",\"Type\":\"GM::Network\",\"Graph\":{\"ParentID\":\"1\",\"Position\":{\"X\":\"300\",\"Y\":\"90\"},\"Size\":{\"W\":\"150\",\"H\":\"40\"}},\"Properties\":{\"Name\":\"DefaultNetwork_1\",\"Description\":\"System default network resource\",\"NetworkID\":\"\",\"NetworkID\":\"\"}},\"AME_id_2114184\":{\"Name\":\"template_no_os_2\",\"Type\":\"GM::VmTemplate\",\"Graph\":{\"ParentID\":\"1\",\"Position\":{\"X\":\"270\",\"Y\":\"190\"},\"Size\":{\"W\":\"170\",\"H\":\"70\"}},\"Properties\":{\"VmTemplateID\":\"33;urn:sites:453E0846:vms:i-00000025;4629700416936869889\",\"VmTempateName\":\"template_no_os\",\"Name\":\"template_no_os_2\",\"Description\":\"\",\"ComputerName\":\"\",\"CPU\":\"1\",\"Memory\":\"512\",\"OSType\":\"Linux\",\"OSVersion\":\"Novell SUSE Linux Enterprise Server 11 SP1 32bit\",\"UpdateMode\":\"auto\",\"BlockHeatTranfer\":\"unSupport\",\"Nics\":[{\"Name\":\"DefaultNic\",\"NetworkID\": { \"Ref\":[\"AME_id_2114151\",\"NetworkID\"] },\"SystemDefault\":\"true\",\"Vlb\":\"false\"}],\"Volumes\":[{\"Name\":\"i-00000025-xvda\",\"Size\":\"3\",\"AllocType\":\"thick\",\"AffectBySnapshot\":\"false\",\"MediaType\":\"SAN-Any\",\"SystemDefault\":\"true\"},{\"Name\":\"123\",\"Size\":\"10\",\"AllocType\":\"thin\",\"AffectBySnapshot\":\"false\",\"MediaType\":\"SAN-Any\",\"SystemDefault\":\"true\"}],\"Softwares\":[],\"PostCommands\":[],\"ReleaseCommands\":[],\"StartCommands\":[],\"StopCommands\":[]}},\"AME_id_2119405115\":{\"Name\":\"template_no_os_2\",\"Type\":\"GM::Instance\",\"Graph\":{},\"Properties\":{\"Name\":\"template_no_os_2\",\"VmTemplateID\":{\"Ref\":[\"AME_id_2114184\",\"PhysicalID\"]},\"Description\":\"\"}}},\"Outputs\":{},\"Connections\":[{\"Id\":\"AME_id_211411021\",\"Type\":\"RealLine\",\"From\":\"AME_id_2114184\",\"To\":\"AME_id_2114151\"}]}";

            //验证模板名称
            UnifyValid.checkTemplateName = function (param) {
                var value = $(this).val();
                var templateNameReg =/^[0-9a-zA-Z \_\-]{0,256}$/;
                return templateNameReg.test(value) ;
            };
        }];

        var createTemplateModule = angular.module("app.templates.createTemplate", ['framework']);
        createTemplateModule.controller("app.templates.createTemplate.ctrl", createTemplateCtrl);
        createTemplateModule.service("camel", http);
        createTemplateModule.service("ecs.vm.detail.disks.validator", validator);

        return createTemplateModule;
    }
);