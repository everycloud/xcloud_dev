define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    "app/services/mask",
    'tiny-common/UnifyValid',
    'upload/FileUpload',
    "bootstrapui/ui-bootstrap-tpls",
    "tiny-widgets/Message",
    'app/services/exceptionService'],
    function ($, angular, httpService, constants, mask, UnifyValid, FileUpload,ui, Message, exceptionService) {
        "use strict";

        var scriptInfoCtrl = ["$scope", "camel","$interval", "exception", function ($scope, camel, $interval, exception) {

            UnifyValid.checkName = function () {
                var value = $(this).val();
                if(!/^[\w\s\._\-\(\)\[\]\#\u4E00-\u9FA5]{1,256}$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            UnifyValid.checkVersion = function () {
                var value = $(this).val();
                value = jQuery.trim(value);
                if(!/^[A-Za-z0-9]+[\w\.\_\-]*$/.test(value)||value.length>64)
                {
                    return false;
                }

                return true;
            };

            UnifyValid.checkScriptPath = function () {
                var value = $(this).val();

                var osType = $("#"+$scope.osType.id).widget().getSelectedId();
                if (osType == "Linux") {
                    //系统是linux,以/开头后边以数字大小写英文及下划线
                    if (/^[\/]{1}([\w\=]|[\w\=][\/])*$/.test(value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                if (osType == "Windows") {
                    //系统是Windows,以盘符(例如: c:)大小写英文开头+:+\ 后边以数字大小写英文及下划线
                    if (/^[A-Za-z]{1}[:]{1}[\\]{1}([\w\=\s]|[\w\=\s][\\])*$/.test(value)) {
                        var paths = value.split('\\');
                        var path = "";
                        for (var i = 1; i < paths.length; i++) {
                            path = paths[i];
                            if (path && (path[0] == " " || path[path.length - 1] == " ")) {
                                return false;
                            }
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                return true;
            };

            UnifyValid.pwdConfirm = function () {
                if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.checkLoadTimeOut = 0;
            $scope.checkUploadTimeOut = 0;

            $scope.model = {
                "action":"",
                "id":"",
                "name": "",
                "scriptName": "",
                "filePath":"",
                "mainFilePath":"",
                "osType": "",
                "picture": "../theme/default/images/softwarePackage/icon_software_1.png",
                "version": "",
                "description": "",

                "destinationPath": "",
                "installCommand": ""
            };

            $scope.service = {
                progress: 0,
                ftpAppletLoaded:false,
                jreChecked:true
            };

            $scope.promise = undefined;
            $scope.clearTimer = function () {
                try{
                    $interval.cancel($scope.promise);
                }
                catch(e) {
                    // do nothing
                }
            };

            // 扩展UnifyValid
            UnifyValid.checkScriptCmd = function () {
                var value = $(this).val();

                // 统计左右大括号个数
                var leftNum = 0; // 左括号个数
                var rightNum = 0; // 右括号个数
                for(var index = 0; index < value.length; index++)
                {
                    if(value[index] == '{')
                    {
                        leftNum++;
                    }
                    else if(value[index] == '}')
                    {
                        rightNum++;
                    }

                    // ‘{’个数或‘}’个数大于10时，不满足条件约束
                    if(leftNum > 10 || rightNum > 10)
                    {
                        return false;
                    }
                }

                // ‘{’和‘}’个数不相等，说明存在不匹配的括号，不满足约束
                if(leftNum != rightNum)
                {
                    return false;
                }
                // ‘{’和‘}’个数为0的时，满足条件约束
                if(leftNum == 0 && rightNum == 0)
                {
                    return true;
                }

                // value中存在“{”，“}“，并且个数相等时，执行下面检测
                // 检测是否满足不嵌套，且成对出现的约束
                if(!/^([^{}]*\{[^{}]+\}[^{}]*)*$|^[^{}]*$/.test(value))
                {
                    return false;
                }

                return true;
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "registScriptName",
                "extendFunction" : ["checkName"],
                "tooltip": $scope.i18n.common_term_composition6_valid+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256),
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkName():"+$scope.i18n.common_term_composition6_valid+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256),
                "width": "260",
                disabled: $scope.type != 'add'
            };

            $scope.scriptName = {
                label: $scope.i18n.template_term_scriptFile_label+":",
                require: true,
                "id": "registScriptFileName",
                "value": "",
                "readonly":true,
                "width": "260",
                "validate": "maxSize(256):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256)+";required:"+$scope.i18n.common_term_null_valid,
                "select":function() {
                    var fileName = undefined;
                    try {
                        fileName = FileUpload.openFtpSelectWindow("main");
                    }
                    catch (e) {
                    }

                    $scope.model.scriptName = fileName;
                }
            };

            $scope.password = {
                label: $scope.i18n.common_term_psw_label+":",
                require: true,
                "id": "ftsAuthenticPwd",
                "validate":"required:"+$scope.i18n.common_term_null_valid,
                "width": "260",
                "type":"password",
                "value":""
            };

            $scope.passwordConfirm = {
                label: $scope.i18n.common_term_PswConfirm_label+":",
                require: true,
                "id": "ftsAuthenticPwdConfirm",
                "extendFunction": ["pwdConfirm"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";pwdConfirm:"+$scope.i18n.common_term_pswDifferent_valid+";",
                "width": "260",
                "type":"password",
                "value":""
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "id": "registScriptPicture",
                "width": "260",
                "show":false,
                "imgs":[],
                "click":function(){
                    $scope.picture.show = !$scope.picture.show;
                },
                "init": function () {
                    var img = function (index) {
                        var src = "../theme/default/images/softwarePackage/icon_software_" + index + ".png";
                        return {
                            "src": src,
                            "click": function () {
                                $scope.model.picture = src;
                            }
                        }
                    };
                    var imgs = [];
                    for (var index = 1; index <= 10; index++)
                    {
                        imgs.push(img(index));
                    }
                    $scope.picture.imgs = imgs;
                }
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: true,
                "id": "registScriptOSType",
                "width": "260",
                "values": [
                    {
                        "selectId": "Linux",
                        "label": "Linux",
                        "checked": true
                    },
                    {
                        "selectId": "Windows",
                        "label": "Windows"
                    }
                ]
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: true,
                "id": "registScriptVersion",
                "value": "",
                "width": "260",
                "extendFunction" : ["checkVersion"],
                "validate": "required:"+$scope.i18n.common_term_null_valid+";checkVersion():"+$scope.i18n.common_term_composition4_valid+$scope.i18n.common_term_startWithEnOrNum_valid+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64)+";"
            };

            $scope.path = {
                label: $scope.i18n.common_term_fileTargetPath_label+":",
                require: true,
                "id": "registScriptPath",
                "value": "",
                "width": "260",
                "extendFunction" : ["checkScriptPath"],
                "validate": "required:"+$scope.i18n.common_term_null_valid+";maxSize(256):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256)+";checkScriptPath():"+$scope.i18n.common_term_formatpath_valid+";"
            };

            $scope.command = {
                label: $scope.i18n.common_term_runCmd_label+":",
                require: true,
                "extendFunction" : ["checkScriptCmd"],
                "id": "registScriptCommand",
                "value": "",
                "width": "260",
                "validate": "required:"+$scope.i18n.common_term_null_valid+";maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)+";checkScriptCmd():"+$scope.i18n.template_software_add_info_cmd_label
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "registScriptDescription",
                "value": "",
                "type": "multi",
                "width": "450",
                "height": "80",
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.saveBtn = {
                id: "addScriptSaveBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label,
                tip: "",
                save: function () {
                    var valid = UnifyValid.FormValid($("#registScriptInfo"));
                    if (!valid) {
                        return;
                    }

                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.model.osType = $("#" + $scope.osType.id).widget().getSelectedLabel();
                    $scope.model.version = $("#" + $scope.version.id).widget().getValue();
                    $scope.model.destinationPath = $("#" + $scope.path.id).widget().getValue();
                    $scope.model.installCommand = $("#" + $scope.command.id).widget().getValue();
                    $scope.model.description = $("#" + $scope.description.id).widget().getValue();

                    if ($scope.model.action === 'add') {
                        if (FileUpload.getTotalFileSize() > 1024*1024*1) {
                            var options = {
                                "type": "error",
                                "content": $scope.i18n.sprintf($scope.i18n.common_term_fileMaxWithValue_valid, "1M"),
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }
                        $("#"+$scope.saveBtn.id).widget().option("disable", true);
                        $scope.operator.create();
                    } else {
                        $scope.operator.modify();
                    }
                }
            };

            $scope.cancelBtn = {
                id: "addScriptCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $scope.clearTimer();
                    $("#addScriptWinID").widget().destroy();
                }
            };

            $scope.operator = {
                "initForModify": function () {
                    var deferred = camel.get({
                        "url": {"s":constants.rest.SCRIPT_DETAIL.url,"o":{"tenant_id":1,"scriptid":$scope.model.id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            $scope.model.id = data.id;
                            $scope.model.name = data.name;
                            $scope.model.osType = data.osType;
                            $scope.model.picture = data.picture;
                            $scope.model.version = data.version;
                            $scope.model.destinationPath = data.destinationPath;
                            $scope.model.installCommand = (data.installCommand && data.installCommand != "") ? $.base64.decode(data.installCommand, true) : data.installCommand;
                            $scope.model.description = data.description;

                            $("#" + $scope.name.id).widget().option("value", $scope.model.name);
                            $("#" + $scope.osType.id).widget().opChecked($scope.model.osType);
                            $("#" + $scope.version.id).widget().option("value", $scope.model.version);
                            $("#" + $scope.path.id).widget().option("value", $scope.model.destinationPath);
                            $("#" + $scope.command.id).widget().option("value", $scope.model.installCommand);
                            $("#" + $scope.description.id).widget().option("value", $scope.model.description);
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "create": function () {
                    // 获取ftp信息
                    var deferred = camel.get({
                        "url": {"s": constants.rest.VSFTP_INFO.url, "o": {"vdc_id":1, "type": "FTP"}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor":false
                    });
                    deferred.success(function (data) {
                        if (data && data.machineAccountInfo) {
                            // 1.上传文件
                            $scope.model.mainFilePath = "/" + $scope.model.filePath + "/" + $scope.model.scriptName;
                            FileUpload.uploadFile("/" + $scope.model.filePath, data.machineAccountInfo.userName, $("#" + $scope.password.id).widget().getValue());
                            mask.show();
                            // 进度由回调搞定
                        }
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "modify": function () {
                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.model.scriptName = $("#" + $scope.scriptName.id).widget().getValue();
                    $scope.model.osType =  $("#" + $scope.osType.id).widget().getSelectedId();
                    $scope.model.version = $("#" + $scope.version.id).widget().getValue();
                    $scope.model.destinationPath = $("#" + $scope.path.id).widget().getValue();
                    $scope.model.installCommand = $.base64.encode($("#" + $scope.command.id).widget().getValue(), true);
                    $scope.model.description = $("#" + $scope.description.id).widget().getValue();

                    var deferred = camel.put({
                        "url": {"s": constants.rest.SCRIPT_MODIFY.url, "o": {"tenant_id": 1, "scriptid": $scope.model.id}},
                        "params": JSON.stringify($scope.model),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            $("#addScriptWinID").widget().destroy();
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });

                    $scope.clearTimer();
                }
            };

            $scope.loadedCallBack = function(status) {
                if (status) {
                    $scope.clearTimer();
                    $scope.service.ftpAppletLoaded = true;
                    $scope.$digest();
                } else {
                    $scope.clearTimer();
                    exception.doException({"status":"400","responseText":'{"code":"5100003"}'}, null);
                }
            };
            $scope.uploadCallBack = function(status) {
                if (status == 0) {
                    return;
                } else if (status == 1) {
                    $scope.clearTimer();
                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.model.osType =  $("#" + $scope.osType.id).widget().getSelectedId();
                    $scope.model.version = $("#" + $scope.version.id).widget().getValue();
                    $scope.model.destinationPath = $("#" + $scope.path.id).widget().getValue();
                    $scope.model.installCommand = $.base64.encode($("#" + $scope.command.id).widget().getValue(), true);
                    $scope.model.description = $("#" + $scope.description.id).widget().getValue();

                    var deferred = camel.post({
                        "url": {"s":constants.rest.SCRIPT_CREATE.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify($scope.model),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor":false
                    });
                    deferred.complete(function(xmlHttpRequest, TS){
                        if (xmlHttpRequest.status != "200") {
                            exception.doException(xmlHttpRequest, null);
                        } else {
                            $("#addScriptWinID").widget().destroy();
                        }

                        mask.hide();
                    });

                } else {
                    mask.hide();
                    $scope.clearTimer();
                    exception.doException({"status": "400", "responseText": '{"code":"' + status + '"}'}, null);
                }
            };
            $scope.progressCallBack = function(status) {
                //
            };

            $scope.init = function() {
                $scope.picture.init();

                var action = $("#addScriptWinID").widget().option("action");
                $scope.model.action = action;
                if (action == 'add') {
                    $scope.model.filePath = new Date().getTime();
                    $scope.scriptName.disabled = false;
                    $scope.name.disabled = false;
                    $scope.name.require = true;

                    FileUpload.init($scope.loadedCallBack,$scope.uploadCallBack, $scope.progressCallBack);

                    if(!FileUpload.checkJreVersion()) {
                        $scope.service.jreChecked = false;
                        return;
                    }

                    // 加载Applet
                    FileUpload.loadFtpApplet(constants.config.SERVICE);

                    // 超时保护
                    $scope.promise = $interval(function() {
                        if ($scope.checkLoadTimeOut > 90) {
                            $scope.clearTimer();
                            exception.doException({"status":"400","responseText":'{"code":"5100003"}'}, null);
                        }

                        if (!$scope.service.ftpAppletLoaded) {
                            $scope.checkLoadTimeOut++;
                        }
                    }, 1000);
                } else {
                    $scope.scriptName.disabled = true;
                    $scope.name.disabled = true;
                    $scope.name.require = false;

                    //
                    $scope.model.id = $("#addScriptWinID").widget().option("scriptID");
                    $scope.operator.initForModify();
                }
            };

            // 清理定时器
            $scope.$on('$destroy', function () {
                $scope.clearTimer();
            });

            $scope.init();
        }];

        var deps = ["ui.bootstrap"];
        var addScriptApp = angular.module("resources.template.addScript", deps);
        addScriptApp.controller("resources.template.addScript.ctrl", scriptInfoCtrl);
        addScriptApp.service("camel", httpService);
        addScriptApp.service("exception", exceptionService);

        return addScriptApp;
    });
