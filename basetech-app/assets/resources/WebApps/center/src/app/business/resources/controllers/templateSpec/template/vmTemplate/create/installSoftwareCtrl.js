define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'tiny-widgets/Window',
    "app/business/resources/controllers/constants",
    "tiny-widgets/Message"],
    function ($, angular, UnifyValid, Window, constants, Message) {
        "use strict";

        var installCtrl = ["$scope", "$stateParams", "$state", "camel", "$q","exception", function ($scope, $stateParams, $state, camel, $q,exception) {

            // 扩展UnifyValid
            UnifyValid.checkISOPath = function () {
                var value = $(this).val();

                value = jQuery.trim(value);

                var regular = /^(((\\){2}(([1-9]|[1-9]\d|(10|11)\d|12[0-6]|12[8-9]|1[3-9]\d|2[0-1]\d|22[0-3])(\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3})){0,1})((((\\){1})([A-Za-z0-9\._\s-]{1,})){1,})((\\){1})([A-Za-z0-9\._\s-]{1,})((\.iso)|(\.ISO)|(\.Iso)|(\.iSo)|(\.isO)|(\.ISo)|(\.IsO)|(\.iSO)){1}$/;
                var result = regular.test(value);
                if(result)
                {
                    if(value.substr(0,2) == "\\\\")
                    {
                        if(value.length > 100)
                        {
                            return false;
                        }
                    }
                    else
                    {
                        if(value.length > 83)
                        {
                            return false;
                        }
                    }
                }

                return result;
            };
            UnifyValid.checkISOPathVmware = function () {
                var value = $(this).val();

                value = jQuery.trim(value);

                var regular = /^(((\\){2}(([1-9]|[1-9]\d|(10|11)\d|12[0-6]|12[8-9]|1[3-9]\d|2[0-1]\d|22[0-3])(\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3})){0,1})((((\\){1})([A-Za-z0-9\._\s-]{1,})){1,})((\\){1})([A-Za-z0-9\._\s-]{1,})((\.iso)|(\.ISO)|(\.Iso)|(\.iSo)|(\.isO)|(\.ISo)|(\.IsO)|(\.iSO)){1}$/;
                var result = regular.test(value);
                if (result) {
                    if (value.length > 100) {
                        return false;
                    }
                }

                return result;
            };

            // 数据
            $scope.model = {
                "step":"installSoftware",
                "startMode":"-",
                "startModeKey":"-",
                "mountMode":"share"
            };

            $scope.startModeMap = {
                "disk":$scope.i18n.template_term_startFromHarddisk_label,
                "cdrom":$scope.i18n.template_term_startFromCD_label,
                "pxe":$scope.i18n.template_term_startFromNet_label
            };

            // 初始参数
            $scope.param = {
                "vmtId": $stateParams.vmtId,
                "startStep": $stateParams.startStep
            };

            $scope.updateStartMode = function (model) {
                $scope.$apply(function(){
                    $scope.model.startModeKey = model || "-";
                    $scope.model.startMode = $scope.startModeMap[model];
                });
            };

            var changeStartMode = function () {
                var options = {
                    "winId": "changeStartModeWinID",
                    "startMode": $scope.model.startModeKey,
                    "vmtId": $scope.service.model.id,
                    "title": $scope.i18n.vm_term_modifyStartMode_button,
                    "content-type": "url",
                    "content": "app/business/resources/views/templateSpec/template/vmTemplate/create/changeStartMode.html",
                    "height": 220,
                    "width": 320,
                    "resizable": true,
                    "maximizable":false,
                    "minimizable": false,
                    "buttons": null,
                    "close": function (event) {
                    }
                };

                return new Window(options);
            };

            var selectISO = function () {
                var options = {
                    "winId": "selectISOWinID",
                    "title": $scope.i18n.template_term_chooseISO_label || "选择ISO",
                    "content-type": "url",
                    "content": "app/business/resources/views/templateSpec/template/vmTemplate/create/selectISO.html",
                    "height": 400,
                    "width": 750,
                    "resizable": true,
                    "maximizable":false,
                    "minimizable": false,
                    "buttons": null,
                    "close": function (event) {
                    }
                };

                return new Window(options);
            };

            $scope.selectedISO = {};

            $scope.updateIsoInfo = function(isoInfo) {
                if (isoInfo === undefined) {
                    return;
                }

                // 刷新选择的iso
                $scope.selectedISO = isoInfo;
            };

            // 操作定义
            $scope.windowOperator = {
                "changeStartMode":function(){
                    var window = changeStartMode();
                    window.show();
                },
                "selectISO":function(){
                    var window = selectISO();
                    window.show();
                }
            };

            // 挂载方式
            $scope.installMountConfig = {
                label: ($scope.i18n.vm_term_mountMode_button || "挂载方式") + ":",
                require: true,
                "id": "installMountConfig",
                "spacing": {"width" : "50px", "height" : "20px"},
                "values":[
                    {
                        "key" : "local",
                        "text" : $scope.i18n.common_term_local_label || "本地",
                        "checked" : false
                    },
                    {
                        "key" : "share",
                        "text" : $scope.i18n.common_term_share_label,
                        "checked" : true
                    }],
                "layout":"horizon", 
                "change":function() {
                    $scope.model.mountMode = $("#"+$scope.installMountConfig.id).widget().opChecked("checked");
                    if ($scope.model.mountMode == 'local') {
                        $scope.mountBtn.disabled = true;
                        $scope.umountBtn.disabled = true;
                    } else {
                        $scope.mountBtn.disabled = false;
                        $scope.umountBtn.disabled = false;
                    }
                }
            };

            // 本地共享
            $scope.localUrl = {
                label: $scope.i18n.common_term_path_label + ":",
                require: true,
                "id": "installSoftwareLocalUrl",
                "validate":"maxSize(256):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256)+";required:"+$scope.i18n.common_term_null_valid,
                "value":"",
                "width": "200"
            };

            // ISO共享
            $scope.selectIsoBtn = {
                id: "installSoftwareSelectIso",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.template_term_chooseISO_label || "选择ISO",
                tip: "",
                selectISO: function () {
                    $scope.windowOperator.selectISO();
                }
            };

            $scope.isoName = {
                label: $scope.i18n.template_term_isoFile_label + ":",
                require: false,
                "id": "installSoftwareIsoName",
                "width": "200",
                "value": "SUSE11 sp1 64bit.iso",
                "focused": true
            };

            $scope.name = {
                label: $scope.i18n.common_term_userName_label+":",
                require: true,
                "id": "installSoftwareName",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";maxSize(256):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256)+";",
                "width": "200",
                "value":""
            };
            $scope.password = {
                label: $scope.i18n.common_term_psw_label+":",
                require: true,
                "id": "installSoftwarePassword",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";maxSize(256):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256)+";",
                "value":"",
                "type":"password",
                "width": "200"
            };
            $scope.shareUrl = {
                label: $scope.i18n.common_term_path_label+":",
                require: true,
                "extendFunction" : ["checkISOPath"],
                "id": "installSoftwareShareUrl",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkISOPath:"+$scope.i18n.common_term_formatpath_valid,
                "value":"",
                "width": "200"
            };

            $scope.shareUrlVmware = {
                label: $scope.i18n.common_term_path_label+":",
                require: true,
                "extendFunction" : ["checkISOPathVmware"],
                "id": "installSoftwareShareUrlVmware",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkISOPathVmware:"+$scope.i18n.common_term_formatpath_valid,
                "value":"",
                "width": "200"
            };

            $scope.mountBtn = {
                id: "installSoftwareMountID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_mount_button,
                tip: "",
                mount: function () {
                    if ($scope.service.model.hypervisorType === 'FusionCompute') {
                        var valid = UnifyValid.FormValid($("#mountISOInfo"));
                        if (!valid) {
                            return;
                        }
                    }
                    if ($scope.service.model.hypervisorType === 'VMware') {
                        var valid = UnifyValid.FormValid($("#mountISOInfoVmware"));
                        if (!valid) {
                            return;
                        }
                    }

                    $scope.operator.attachISO();
                }
            };
            $scope.umountBtn = {
                id: "installSoftwareUmountID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_detach_button,
                tip: "",
                umount: function () {
                    $scope.operator.dettachISO();
                }
            };
            $scope.vncBtn = {
                id: "installSoftwareVncID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.vm_term_vnc_button,
                tip: "",
                vncLogin: function () {
                    var idList = $scope.service.model.id.split(";");
                    var id = $scope.service.model.id;
                    if (idList.length >= 3) {
                        id = idList[2]+"$"+idList[1];
                    }

                    var winParam = {
                        "vmId":id
                    };
                    var newWindow = new Window({
                        "winId": "ecsVmLoginSelectWinId",
                        "title":$scope.i18n.vm_vm_vncLogin_desc_label || "请选择VNC登录方式",
                        "winParam":winParam,
                        "content-type": "url",
                        "content": "app/business/vnc/vmLoginSelect.html",
                        "resizable": true,
                        "maximizable":false,
                        "minimizable": false,
                        "buttons": null,
                        "height": $scope.i18n.locale === "en" ? 300 : 270,
                        "width": 510,
                        "close": function () {
                        }
                    });
                    newWindow.show();
                }
            };

            $scope.successBtn = {
                id: "installSoftwareOKID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label,
                tip: "",
                success: function () {
                    $("#"+$scope.successBtn.id).widget().option("disable",true);
                    // 调用转换接口
                    var deferred = camel.post({
                        url: {"s":constants.rest.VM_TEMPLATE_CONVERT_TO_VMT.url,"o":{"tenant_id":1, "id":$scope.service.model.id}},
                        "params": JSON.stringify({"convertToVMTemplate": {"vmId": $scope.service.model.id}}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });

                    deferred.complete(function(xmlHttpRequest, TS){
                        if (xmlHttpRequest.status != "200" && xmlHttpRequest.status != "204") {
                            $("#"+$scope.successBtn.id).widget().option("disable",false);
                            exception.doException(xmlHttpRequest, null);
                        } else {
                            var options = {
                                "type": "confirm",
                                "title":$scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.task_view_task_info_confirm_msg,
                                "width": "360px",
                                "height": "200px"
                            };

                            var msgBox = new Message(options);
                            var buttons = [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    accessKey: 'Y',
                                    majorBtn : true,
                                    default: true,
                                    handler: function (event) {
                                        var $state = $("html").injector().get("$state");
                                        $state.go("system.taskCenter", {});
                                        msgBox.destroy();
                                    }
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    accessKey: 'N',
                                    default: false,
                                    handler: function (event) {
                                        var $state = $("html").injector().get("$state");
                                        $state.go("resources.templateSpec.vmTemplateResources.vmTemplate", {});
                                        msgBox.destroy();
                                    }
                                }
                            ];
                            msgBox.option("buttons", buttons);
                            msgBox.show();
                        }
                    });
                }
            };

            $scope.cancelBtn = {
                id: "installSoftwareCancelID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_close_button,
                tip: "",
                cancel: function () {
                    $state.go("resources.templateSpec.vmTemplateResources.vmTemplate", {});
                }
            };

            $scope.operator = {
                "queryVmtDetail":function() {

                    var deferred = camel.get({
                        "url": {"s": constants.rest.VM_TEMPLATE_DETAIL.url, "o": {"tenant_id": 1, "id": $scope.service.model.id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (response) {
                        if (!response || !response.clusterInfo) {
                            return;
                        }
                        $scope.$apply(function(){

                            $scope.model.startModeKey = response && response.bootOption || "-";
                            $scope.model.startMode = $scope.startModeMap[$scope.model.startModeKey];
                            var hyperID = response.clusterInfo.virtualEnvId;
                            $scope.operator.queryHyper(hyperID);
                        });

                        $("#"+$scope.service.step.id).widget().last();
                    });
                    deferred.fail(function (response) {
                        $("#"+$scope.service.step.id).widget().last();
                        exception.doException(response, null);
                    });
                },
                "queryHyper":function(id) {

                    var deferred = camel.get({
                        "url": {"s": constants.rest.VMT_HYPERVISOR_DETAIL.url, "o": {"tenant_id": 1, "id": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (response) {
                        if (!response || !response.hypervisor) {
                            return;
                        }
                        $scope.$apply(function(){
                            $scope.service.model.hypervisorType = response.hypervisor.type;
                        });
                    });
                },
                "attachISO":function() {

                    var attachParams = {
                        "attachIso": {
                            "vmId": "",
                            "devicePath": "",
                            "username": "",
                            "password": "",
                            "protocol": ""
                        }
                    };

                    var idList = $scope.service.model.id.split(";");
                    var id = $scope.service.model.id;
                    if (idList.length >= 3) {
                        id = idList[2]+"$"+idList[1];
                    }
                    attachParams.attachIso.vmId = id;

                    // 设置挂载光驱参数
                    if ($scope.service.model.hypervisorType === 'FusionCompute') {
                        if ($scope.model.mountMode === "share") {
                            var path = $("#" + $scope.shareUrl.id).widget().getValue();
                            var devicePath = path && path.replace(/\\/g, '/');
                            attachParams.attachIso.devicePath = devicePath;
                            attachParams.attachIso.username = $("#" + $scope.name.id).widget().getValue();
                            attachParams.attachIso.password = $("#" + $scope.password.id).widget().getValue();
                            attachParams.attachIso.protocol = "cifs";

                        } else if ($scope.model.mountMode === "local") {
                            attachParams.attachIso.devicePath = $("#" + $scope.localUrl.id).widget().getValue();
                            attachParams.attachIso.protocol = "sff";
                        } else {
                            // iso 挂载
                            attachParams.attachIso.devicePath = "//" + constants.config.SERVICE + "/ame/packages/" + $scope.selectedISO.filePath;
                            attachParams.attachIso.sambaAttach = true;
                            attachParams.attachIso.protocol = "cifs";
                        }
                    }

                    if ($scope.service.model.hypervisorType === 'VMware') {
                        var path = $("#" + $scope.shareUrlVmware.id).widget().getValue();
                        var devicePath = path && path.replace(/\\/g, '/');
                        attachParams.attachIso.devicePath = devicePath;
                        attachParams.attachIso.protocol = "nfs";
                    }

                    $("#"+$scope.mountBtn.id).widget().option("disable",true);
                    $("#"+$scope.umountBtn.id).widget().option("disable",true);

                    var deferred = camel.post({
                        "url": {"s": constants.rest.VM_TEMPLATE_ATTACHISO.url, "o": {"tenant_id": 1, "id": id}},
                        "params":JSON.stringify(attachParams),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.complete(function(xmlHttpRequest, TS){
                        $("#"+$scope.mountBtn.id).widget().option("disable",false);
                        $("#"+$scope.umountBtn.id).widget().option("disable",false);
                        if (xmlHttpRequest.status != "200") {
                            exception.doException(xmlHttpRequest, null);
                        } else {
                            var options = {
                                "type": "confirm",
                                "title":$scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.task_view_task_info_confirm_msg,
                                "width": "360px",
                                "height": "200px"
                            };

                            var msgBox = new Message(options);
                            var buttons = [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    accessKey: 'Y',
                                    majorBtn : true,
                                    default: true,
                                    handler: function (event) {
                                        $state.go("system.taskCenter", {});
                                        msgBox.destroy();
                                    }
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    accessKey: 'N',
                                    default: false,
                                    handler: function (event) {
                                        msgBox.destroy();
                                    }
                                }
                            ];
                            msgBox.option("buttons", buttons);
                            msgBox.show();
                        }
                    });
                },
                "dettachISO":function() {
                    var idList = $scope.service.model.id.split(";");
                    var id = $scope.service.model.id;
                    if (idList.length >= 3) {
                        id = idList[2]+"$"+idList[1];
                    }

                    var deferred = camel.post({
                        "url": {"s": constants.rest.VM_TEMPLATE_DETTACHISO.url, "o": {"tenant_id": 1, "id": id}},
                        "params":JSON.stringify({"dettachIso":{"vmId":id}}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.complete(function(xmlHttpRequest, TS){
                        if (xmlHttpRequest.status != "200") {
                            exception.doException(xmlHttpRequest, null);
                        } else {
                            var options = {
                                "type": "confirm",
                                "title":$scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.task_view_task_info_confirm_msg,
                                "width": "360px",
                                "height": "200px"
                            };

                            var msgBox = new Message(options);
                            var buttons = [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    accessKey: 'Y',
                                    majorBtn : true,
                                    default: true,
                                    handler: function (event) {
                                        $state.go("system.taskCenter", {});
                                        msgBox.destroy();
                                    }
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    accessKey: 'N',
                                    default: false,
                                    handler: function (event) {
                                        msgBox.destroy();
                                    }
                                }
                            ];
                            msgBox.option("buttons", buttons);
                            msgBox.show();
                        }
                    });
                },
                "reboot":function() {
                    var idList = $scope.service.model.id.split(";");
                    var id = $scope.service.model.id;
                    if (idList.length >= 3) {
                        id = idList[2]+"$"+idList[1];
                    }

                    var deferred = camel.post({
                        "url": {"s": constants.rest.VMT_VM_ACTION.url, "o": {"tenant_id": 1, "id": id}},
                        "params":JSON.stringify({"operate":{
                            "type":"reboot",
                            "vmIds":[id]
                        }}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $("#"+$scope.mountBtn.id).widget().option("disable",false);
                        $("#"+$scope.umountBtn.id).widget().option("disable",false);
                    });
                }
            };

            $scope.init = function () {
                var vmtId = $scope.param.vmtId;
                var startStep = $scope.param.startStep;

                if (startStep === "baseInfo") {
                    // 事件处理
                    $scope.$on($scope.createVmtEvents.createVmtSuccessFromParent, function (event, msg) {
                        // 获取虚拟化环境信息
                        $scope.operator.queryVmtDetail();
                    });
                } else {
                    $scope.service.model.id = vmtId;
                    // 初始化虚拟机模板数据
                    // 根据后台接口，如果可以直接传递虚拟化环境信息，则不需要查询虚拟机信息
                    // 否则需要查询虚拟机的虚拟化环境信息
                    $scope.operator.queryVmtDetail();
                }

                // 修改页面呈现
            };

            // 初始化操作
            $scope.init();

            // 清理定时器
            $scope.$on('$destroy', function () {
                // 预留
            });
        }];

        return installCtrl;
    });
