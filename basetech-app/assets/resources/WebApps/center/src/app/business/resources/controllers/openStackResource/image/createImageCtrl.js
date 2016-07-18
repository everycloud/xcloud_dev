define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/mask",
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants",
    'app/services/exceptionService',
    "bootstrapui/ui-bootstrap-tpls",
    "upload/jquery-form"],
    function ($, angular, httpService, UnifyValid, mask, Message, constants, Exception, ui, jqueryForm) {
        "use strict";

        var createImageCtrl = ["$scope", "$compile", "camel","$timeout","$interval", function ($scope, $compile, camel, $timeout, $interval) {

            var exceptionService = new Exception();

            UnifyValid.checkImageName = function () {
                var value = $(this).val();
                if(!/^[\w\s\._\-\(\)\[\]\#\u4E00-\u9FA5]{1,255}$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            $scope.model = {
                "name" : "",
                "tags" : [],
                "container_format" : "bare",
                "disk_format" : "iso",
                "visibility" : "public",
                "min_ram" : "",
                "min_disk" : ""
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "createImageName",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";maxSize(255):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 255),
                "width": "260",
                "value":""
            };

            $scope.source = {
                label: $scope.i18n.common_term_diskFormat_label+":",
                require: true,
                "id": "createVmtType",
                "width": "260",
                "values": [
                    {
                        "selectId": "raw",
                        "label": "raw",
                        "checked": true
                    },
                    {
                        "selectId": "qcow2",
                        "label": "qcow2"
                    },
                    {
                        "selectId": "iso",
                        "label": "iso"
                    }
                ],
                "change":function() {
                }
            };

            $scope.diskBus = {
                label: $scope.i18n.resource_term_imageDiskDeviceType_button+":",
                require: true,
                "id": "modifyImageDiskBus",
                "width": "260",
                "height":"100",
                "values": [
                    {
                        "selectId": "virtio",
                        "label": "virtio",
                        "checked": true
                    },
                    {
                        "selectId": "scsi",
                        "label": "scsi"
                    },
                    {
                        "selectId": "ide",
                        "label": "ide"
                    }
                ],
                "change":function() {
                }
            };

            $scope.file = {
                label: $scope.i18n.common_term_imageFile_label + ":",
                require: true,
                "id": "createImageFile",
                "idSingle" : "createImagefileSingle",
                "fileObjName":"imageName",
                "action" : "",
                "fileType":".qcow2;.ami;.aki;.ari;.iso;.vhd;.vmdk;.raw;.uec;.vdi;.vhdx;.ovf;.img;",
                "maxSize":6*1024*1024*1024,
                "selectError":function(event,file,errorMsg) {
                    var content = $scope.i18n.common_term_fileFormatError_valid || "文件格式不正确。";
                    if (errorMsg == "INVALID_FILE_TYPE") {
                        content = $scope.i18n.common_term_fileTypeNotMatch_valid || "文件类型不匹配。";
                    } else if(errorMsg == "EXCEED_FILE_SIZE") {
                        content = $scope.i18n.sprintf($scope.i18n.common_term_fileMaxWithValue_valid,"6G");
                    } else {
                        //do nothing
                    }

                    var options = {
                        "type": "error",
                        "content": content,
                        "width": "360px",
                        "height": "200px"
                    };
                    var msg = new Message(options);
                    msg.show();

                    $("#"+$scope.file.idSingle).widget().empty();
                },
                "method":"post",
                "enableDetail" : false,   //不显示文件上传状态等信息
                "showSubmitBtn" : false,  //后无提交按钮标题
                "title" :"",              //前无标题
                "width": 260,
                "beforeSubmit":function(event, file) {
                    mask.show();
                    $("#createImagefileSingle").widget().addFormData({
                        "token": $scope.token,
                        "endpoint": $scope.serviceUrl,
                        "name": $("#" + $scope.name.id).widget().getValue(),
                        "disk_format": $("#" + $scope.source.id).widget().getSelectedId(),
                        "container_format": "bare",
                        "visibility": "public",
                        "min_ram": parseInt($("#" + $scope.minRam.id).widget().getValue(), 10),
                        "min_disk": parseInt($("#" + $scope.minDisk.id).widget().getValue(), 10),
                        "describe": $("#" + $scope.description.id).widget().getValue(),
                        "hw_disk_bus": $("#" + $scope.diskBus.id).widget().getSelectedId() == "empty" ? "":$("#" + $scope.diskBus.id).widget().getSelectedId(),
                        "os_type":$("#"+$scope.osType.id).widget().getSelectedId(),
                        "os_version": $("#"+$scope.version.id).widget().getSelectedId()
                    });
                },
                "select" : function(event, file) {
                },
                //文件上传完成后返回信息
                "complete" : function(event, responseText) {
                    mask.hide();

                    $("#createImageWinID").widget().destroy();
                }
            };

            $scope.minRam = {
                label: $scope.i18n.common_term_memMinMB_label+":",
                require: true,
                "id": "minDisk",
                "value": "",
                "width": "260",
                "validate": "required:"+$scope.i18n.common_term_null_valid+";integer():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{"1":"0","2":"2147483647"})+";minValue(0):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{"1":"0","2":"2147483647"})+";maxValue(2147483647):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{"1":"0","2":"2147483647"})+";"
            };

            $scope.minDisk = {
                label: $scope.i18n.common_term_diskMinGB_label + ":",
                require: true,
                "id": "maxDisk",
                "value": "",
                "width": "260",
                "validate": "required:"+$scope.i18n.common_term_null_valid+";integer():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{"1":"0","2":"2147483647"})+";minValue(0):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{"1":"0","2":"2147483647"})+";maxValue(2147483647):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{"1":"0","2":"2147483647"})+";"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "description",
                "value": "",
                "type": "multi",
                "width": "450",
                "height": "80",
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: true,
                "id": "createLogicVmtOSType",
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
                ],
                "change":function(){
                    var osType = $("#"+$scope.osType.id).widget().getSelectedId();
                    $scope.version.values = $scope.versionConfig.getVersionInfo(osType);
                }
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: true,
                "id": "createLogicVmtVersion",
                "width": "260",
                "height":"200",
                "values": [],
                "change":function(){
                }
            };

            $scope.saveBtn = {
                id: "createImageSaveBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_save_label || "保存",
                tip: "",
                save: function () {
                    var valid = UnifyValid.FormValid($("#createImageInfo"));
                    if (!valid) {
                        return;
                    }

                    $scope.operator.action("create");
                }
            };

            $scope.cancelBtn = {
                id: "createImageCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button || "取消",
                tip: "",
                cancel: function () {
                    $scope.clearTimer();
                    $("#createImageWinID").widget().destroy();
                }
            };

            $scope.buttonGroup = {
                label: "",
                require: false
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

            $scope.operator = {
                "action":function (type) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.TOKEN_QUERY.url},
                        "params": {"user-id": $("html").scope().user && $("html").scope().user.id},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor":false
                    });
                    deferred.success(function (data) {
                        if (data === undefined) {
                            return;
                        }

                        $scope.token = data.id;

                        $scope.projectId = data.projectId;

                        if (type == "create") {
                            $scope.operator.create();
                        } else if (type == "uploadInit") {
                            $scope.operator.uploadInit();
                        } else {
                            // do nothing
                        }
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data, null);
                    });
                },
                "create":function() {

                    $("#createImagefileSingle form").attr("action", "/goku/rest/v1.5/sr/images");

                    $("#" + $scope.file.idSingle).widget().submit();

                    // 启动心跳
                    $scope.promise = $interval(function() {
                        $scope.operator.heartbeat();
                    }, 60000);
                },
                "heartbeat": function () {
                    camel.get({
                        "url": {"s": constants.rest.REST_HEART_BEAT.url},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor": false
                    });
                },
                "uploadInit": function() {
                    var options = {
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-HW-Cloud-Auth-Token", $("html").scope().user && $("html").scope().user.tokenId || "");
                            request.setRequestHeader("X-Auth-User-ID", $("html").scope().user && $("html").scope().user.id || "");
                        },
                        "beforeSubmit": showRequest,  //提交前的回调函数
                        "success": function(responseText, statusText) { //提交后的回调函数
                            $("#createImageWinID").widget().destroy();
                        },
                        "error":function(data) {
                            exceptionService.doException(data, null);
                        },
                        "complete":function (xmlHttpRequest, ts) {
                            $scope.clearTimer();
                            mask.hide();
                        }
                    };

                    function showRequest(formData, jqForm, options){
                        return true;  //只要不返回false，表单都会提交,在这里可以对表单元素进行验证
                    }

                    $("#"+$scope.file.idSingle + " form").ajaxForm(options);

                }
            };

            $scope.versionConfig = {
                "Linux": "CentOS 5.7 32bit;CentOS 5.7 64bit;CentOS 5.8 32bit;CentOS 5.8 64bit;CentOS 6.2 32bit;CentOS 6.2 64bit;CentOS 6.3 32bit;CentOS 6.3 64bit;DOPRA Linux V200R003C07SPC200 32bit;DOPRA Linux V200R003C07SPC200 64bit;EulerLinux V100R001C00 64bit;Novell SuSE Linux Enterprise Server 11 SP1 32bit;Novell SuSE Linux Enterprise Server 11 SP1 64bit;Novell SuSE Linux Enterprise Server 11 SP2 32bit;Novell SuSE Linux Enterprise Server 11 SP2 64bit;Novell SuSE Linux Enterprise Server 11 SP3 32bit;Novell SuSE Linux Enterprise Server 11 SP3 64bit;Red Hat Enterprise Linux 5.5 32bit;Red Hat Enterprise Linux 5.5 64bit;Red Hat Enterprise Linux 5.6 32bit;Red Hat Enterprise Linux 5.6 64bit;Red Hat Enterprise Linux 5.7 32bit;Red Hat Enterprise Linux 5.7 64bit;Red Hat Enterprise Linux 5.8 32bit;Red Hat Enterprise Linux 5.8 64bit;Red Hat Enterprise Linux 5.9 32bit;Red Hat Enterprise Linux 5.9 64bit;Red Hat Enterprise Linux 6.0 32bit;Red Hat Enterprise Linux 6.0 64bit;Red Hat Enterprise Linux 6.1 32bit;Red Hat Enterprise Linux 6.1 64bit;Red Hat Enterprise Linux 6.2 32bit;Red Hat Enterprise Linux 6.2 64bit;Red Hat Enterprise Linux 6.3 32bit;Red Hat Enterprise Linux 6.3 64bit;Red Hat Enterprise Linux 6.4 32bit;Red Hat Enterprise Linux 6.4 64bit;RTOS V100R002C00 64bit",
                "windows": "Windows Server 2008 DataCenter R2 SP1 64bit;Windows Server 2008 Enterprise R2 SP1 64bit;Windows Server 2008 Enterprise R2 64bit;Windows Server 2012 64bit",
                "getVersionInfo": function (osType, osVersion) {
                    var versionList = [];
                    if (osType === 'Windows') {
                        versionList = $scope.versionConfig.windows.split(";");
                    } else {
                        versionList = $scope.versionConfig.Linux.split(";");
                    }

                    var versions = [];
                    for (var index in versionList) {
                        var key = versionList[index];
                        var version = {
                            "selectId":key,
                            "label":key
                        };

                        if (osVersion) {
                            if (osVersion == key) {
                                version.checked = true;
                            }
                        } else if (index == 0) {
                            version.checked = true;
                        } else {
                            //do nothing
                        }

                        versions.push(version);
                    }

                    return versions;
                }
            };

            // 清理定时器
            $scope.$on('$destroy', function () {
                $scope.clearTimer();
            });

            $scope.init = function(){
                $scope.serviceID = $("#createImageWinID").widget().option("serviceID");
                $scope.serviceUrl = $("#createImageWinID").widget().option("serviceUrl");
                $scope.version.values = $scope.versionConfig.getVersionInfo("Linux");

                $scope.operator.action("uploadInit");
            };

            $scope.init();
        }];

        var deps = ["ui.bootstrap"];
        var createImageApp = angular.module("resources.openStackResource.createImage", deps);
        createImageApp.controller("resources.openStackResource.createImage.ctrl", createImageCtrl);
        createImageApp.service("camel", httpService);

        return createImageApp;
    });

