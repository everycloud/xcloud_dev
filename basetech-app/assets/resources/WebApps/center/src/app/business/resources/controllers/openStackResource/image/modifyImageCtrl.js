define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "bootstrapui/ui-bootstrap-tpls",
    'app/services/exceptionService'],
    function ($, angular, httpService, UnifyValid, constants, ui, ExceptionService) {
        "use strict";

        var modifyImageCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            var exceptionService = new ExceptionService();

            // 扩展UnifyValid
            UnifyValid.checkImageName = function () {
                var value = $(this).val();
                if(!/^[\w\s\._\-\(\)\[\]\#\u4E00-\u9FA5]{1,256}$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            $scope.model = {
                "name":""
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label || "名称" + ":",
                require: true,
                "id": "modifyImageName",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";maxSize(255):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 255),
                "width": "200",
                "value":""
            };

            // hw-disk-bus
            $scope.diskBus = {
                label: $scope.i18n.resource_term_imageDiskDeviceType_button+":",
                require: true,
                "id": "modifyImageDiskBus",
                "validate":"required:"+$scope.i18n.common_term_null_valid,
                "width": "200",
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
                    // 预留功能
                }
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label + ":",
                require: false,
                "id": "description",
                "value": "",
                "type": "multi",
                "width": "300",
                "height": "80",
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: true,
                "validate":"required:"+$scope.i18n.common_term_null_valid,
                "id": "createLogicVmtOSType",
                "width": "200",
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
                "validate":"required:"+$scope.i18n.common_term_null_valid,
                "id": "createLogicVmtVersion",
                "width": "200",
                "height":"200",
                "values": [],
                "change":function(){
                }
            };

            $scope.saveBtn = {
                id: "modifyImageSaveBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_save_label || "保存",
                tip: "",
                save: function () {
                    var valid = UnifyValid.FormValid($("#modifyImageInfo"));
                    if (!valid) {
                        return;
                    }

                    $scope.operator.action("modify");
                }
            };

            $scope.cancelBtn = {
                id: "modifyImageCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button || "取消",
                tip: "",
                cancel: function () {
                    $("#modifyImageWinID").widget().destroy();
                }
            };

            $scope.buttonGroup = {
                label: "",
                require: false
            };

            /**
             * 版本配置
             * @type {{windows: string, Linux: string, change: Function}}
             */
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
                        } else if (index == 0 && osType) {
                            version.checked = true;
                        } else {
                            //do nothing
                        }

                        versions.push(version);
                    }

                    return versions;
                }
            };

            $scope.operator = {
                "modify":function() {
                    var params = [];
                    params.push({ "op": "replace", "path": "/name", "value":  $("#" + $scope.name.id).widget().getValue() });
                    params.push({"op": "replace", "path": "/os_type", "value": $("#"+$scope.osType.id).widget().getSelectedId()});
                    params.push({"op": "replace", "path": "/os_version", "value": $("#"+$scope.version.id).widget().getSelectedId()});
                    params.push({"op": "replace", "path": "/describe", "value": $("#" + $scope.description.id).widget().getValue()});
                    params.push({"op": "replace", "path": "/hw_disk_bus", "value": $("#" + $scope.diskBus.id).widget().getSelectedId() });
                    var deferred = camel.put({
                        "url": {"s": constants.rest.IMAGE_MODIFY.url, "o": {"id": $("#modifyImageWinID").widget().option("imageID")}},
                        "params": JSON.stringify(params),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                            request.setRequestHeader("X-Endpoint", $("#modifyImageWinID").widget().option("serviceUrl"));
                        }
                    });
                    deferred.success(function (data) {
                        $("#modifyImageWinID").widget().destroy();
                    });

                    deferred.fail(function(data) {
                        exceptionService.doException(data, null);
                    });
                },
                "queryDetail":function () {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.IMAGE_DETAIL.url, "o": {"service_id": $("#modifyImageWinID").widget().option("serviceID"), "id": $("#modifyImageWinID").widget().option("imageID")}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        if (data === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.model.name = data.name;
                            $("#" + $scope.name.id).widget().option("value", $scope.model.name);
                            $("#" + $scope.description.id).widget().option("value", data.describe);
                            $("#" + $scope.diskBus.id).widget().opChecked(data["hw_disk_bus"]);
                            $("#" + $scope.osType.id).widget().opChecked(data["os_type"]);
                            $("#" + $scope.version.id).widget().opChecked(data["os_version"]);

                            $scope.version.values = $scope.versionConfig.getVersionInfo(data["os_type"], data["os_version"]);
                        });
                    });
                },
                "action":function (type) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.TOKEN_QUERY.url},
                        "params": {"user-id": $("html").scope().user && $("html").scope().user.id},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined) {
                            return;
                        }

                        $scope.token = data.id;

                        $scope.projectId = data.projectId;

                        if (type == "queryDetail") {
                            $scope.operator.queryDetail();
                        } else if (type == "modify") {
                            $scope.operator.modify();
                        } else {
                            // do nothing
                        }
                    });
                }
            };

            /**
             * 页面初始化操作
             */
            $scope.init = function(){
                $scope.operator.action("queryDetail");
            };

            $scope.init();
        }];

        // 创建App
        var deps = ["ui.bootstrap"];
        var modifyImageApp = angular.module("resources.openStackResource.modifyImage", deps);
        modifyImageApp.controller("resources.openStackResource.modifyImage.ctrl", modifyImageCtrl);
        modifyImageApp.service("camel", httpService);

        return modifyImageApp;
    });

