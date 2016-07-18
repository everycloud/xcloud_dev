/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Message,httpService, validatorService, UnifyValid, Exception) {

        "use strict";
        var createDiskCtrl = ["$scope", "$compile", "validator", "camel", function ($scope, $compile, validator, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var $state = $("html").injector().get("$state");
            var window = $("#createDiskWindow").widget();
            var storeId = window.option("storeId");
            var pciType = "IDE";
            var mediaType;

            //NAS存储支持的配置模式
            var nasPatterns = [
                {
                    "selectId": "0",
                    "label": $scope.i18n.common_term_common_label,
                    "checked": true
                },
                {
                    "selectId": "thin",
                    "label": $scope.i18n.common_term_thinProv_label
                }
            ];
            //非虚拟化存储支持的配置模式
            var sanPatterns = [
                {
                    "selectId": "0",
                    "label": $scope.i18n.common_term_common_label,
                    "checked": true
                }
            ];
            //名称输入框
            $scope.nameTextbox = {
                "label": $scope.i18n.common_term_name_label+":",
                "id": "createDiskNameTextbox",
                "require":false,
                "value": "",
                "validate": "maxSize(64):"+validator.i18nReplace($scope.i18n.common_term_maxLength_valid,{"1":"64"})+
                    ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition3_valid
            };
            //类型下拉框
            $scope.typeSelector = {
                "label": $scope.i18n.common_term_type_label+":",
                "id": "createDiskTypeSelector",
                "width": "150",
                "values": [
                    {
                        "selectId": "normal",
                        "label": $scope.i18n.common_term_common_label,
                        "checked": true
                    },
                    {
                        "selectId": "share",
                        "label": $scope.i18n.common_term_share_label
                    }
                ],
                "change":function(){
                    var result = $("#"+$scope.typeSelector.id).widget().getSelectedId();
                    if(result === "share")
                    {
                        $("#"+$scope.influenceCheckbox.id).widget().option("checked",true);
                        $("#"+$scope.influenceCheckbox.id).widget().option("disable",true);
                        $("#" + $scope.permanenceRadio.id).widget().opChecked("true",true);
                        $("#" + $scope.permanenceRadio.id).widget().opDisabled("true", true);
                        $("#" + $scope.permanenceRadio.id).widget().opDisabled("false", true);
                        $("#" + $scope.patternSelector.id).widget().opChecked("0");
                        $("#" + $scope.patternSelector.id).widget().option("disable", true);
                    }
                    else{
                        $("#"+$scope.influenceCheckbox.id).widget().option("checked",false);
                        $("#"+$scope.influenceCheckbox.id).widget().option("disable",false);
                        $("#" + $scope.patternSelector.id).widget().option("disable", false);
                    }
                }
            };
            //容量输入框
            $scope.sizeTextbox = {
                "label": $scope.i18n.common_term_capacityGB_label+":",
                "require": true,
                "id": "createDiskSizeTextbox",
                "value": "",
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";integer:"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":1,"2":65536})+
                    ";minValue(1);"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":1,"2":65536})+
                    ";maxValue(65536):"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":1,"2":65536})
            };
            //模式下拉框
            $scope.patternSelector = {
                "label": $scope.i18n.common_term_setMode_label+":",
                "id": "createDiskPatternSelector",
                "width": "150",
                "values": [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.common_term_common_label,
                        "checked": true
                    },
                    {
                        "selectId": "thin",
                        "label": $scope.i18n.common_term_thinProv_label
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_lazyZeroed_label
                    }
                ]
            };
            $scope.influenceCheckbox = {
                "id": "createDiskInfluenceCheckbox",
                "label": "",
                "text": $scope.i18n.vm_disk_add_para_snap_option_no_value,
                "change": function () {
                    var result = $("#"+ $scope.influenceCheckbox.id).widget().option("checked");
                    $("#" + $scope.permanenceRadio.id).widget().opDisabled("true", !result);
                    $("#" + $scope.permanenceRadio.id).widget().opDisabled("false", !result);
                    if(!result){
                        $("#" + $scope.permanenceRadio.id).widget().opChecked("true", true);
                    }
                }
            };
            $scope.permanenceRadio = {
                "id": "createDiskPermanenceRadio",
                "layout": "vertical",
                "values": [
                    [
                        {
                            "key": "true",
                            "text": $scope.i18n.org_term_persistent_label,
                            "checked": true,
                            "disable" : true
                        }
                    ],
                    [
                        {
                            "key": "false",
                            "text": $scope.i18n.org_term_nonpersistent_label,
                            "disable" : true
                        }
                    ]
                ],
                "change": function () {

                }
            };
            $scope.mediaSelector = {
                "label": $scope.i18n.common_term_storageMedia_label+":",
                "id": "createDiskmediaSelector",
                "width": "150",
                "disable":true,
                "require":true,
                "values": [
                    {
                        "selectId": "SAN-Any",
                        "label": "Any"
                    },
                    {
                        "selectId": "SAN-SSD",
                        "label": "SAN-SSD"
                    },
                    {
                        "selectId": "SAN-SATA",
                        "label": "SAN-SATA"
                    },
                    {
                        "selectId": "SAN-SAS&FC",
                        "label": "SAN-SAS&FC"
                    }
                ]
            };
            //确定按钮
            $scope.okButton = {
                "id": "createDiskOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    var result = UnifyValid.FormValid($("#createDiskDiv"));
                    if (!result) {
                        return;
                    }
                    var model = {
                        "volumeSize": $("#" + $scope.sizeTextbox.id).widget().getValue(),
                        "mediaType": mediaType,
                        "type": $("#" + $scope.typeSelector.id).widget().getSelectedId(),
                        "persistentDisk": $("#" + $scope.permanenceRadio.id).widget().opChecked("checked"),
                        "indepDisk": Boolean($("#" + $scope.influenceCheckbox.id).widget().option("checked")),
                        "pciType": pciType,
                        "scopeType": "DATASTORE",
                        "scopeObjectId": storeId
                    };
                    var name = $("#" + $scope.nameTextbox.id).widget().getValue();
                    if(name !== ""){
                        model.name = name;
                    }
                    var pattern = $("#" + $scope.patternSelector.id).widget().getSelectedId();
                    if (pattern === "thin") {
                        model.thin = true;
                        model.volType = "0";
                    }
                    else {
                        model.thin = false;
                        model.volType = pattern;
                    }
                    createDisk(model);
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "createDiskCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getStore() {
                var params = {
                    "detail": "0",
                    "scopeType": "DATASTORE",
                    "scopeObjectId": storeId
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var store = data.datastoreInfos[0];
                    var storeType = store.type;
                    if (storeType === "LUN") {
                        pciType = "SCSI";
                        $("#" + $scope.typeSelector.id).widget().opChecked("share");
                        $("#" + $scope.typeSelector.id).widget().option("disable", true);
                        $("#" + $scope.sizeTextbox.id).widget().option("value", store.capacity.totalCapacityGB);
                        $("#" + $scope.sizeTextbox.id).widget().option("disable", true);
                        $("#" + $scope.patternSelector.id).widget().option("disable", true);
                        $("#" + $scope.influenceCheckbox.id).widget().option("checked", true);
                        $("#" + $scope.influenceCheckbox.id).widget().option("disable", true);
                        $("#" + $scope.permanenceRadio.id).widget().opDisabled("true", true);
                        $("#" + $scope.permanenceRadio.id).widget().opDisabled("false", true);
                    }
                    mediaType = store.mediaType;
                    $("#" + $scope.mediaSelector.id).widget().opChecked(mediaType);
                    if (store.type === "NAS" || store.type === "NFS") {
                        $("#" + $scope.patternSelector.id).widget().option("values", nasPatterns);
                    }
                    if (store.type === "san" || store.type === "local") {
                        $("#" + $scope.patternSelector.id).widget().option("values", sanPatterns);
                        $("#" + $scope.influenceCheckbox.id).widget().option("checked", true);
                        $("#" + $scope.influenceCheckbox.id).widget().option("disable", true);
                        $("#" + $scope.permanenceRadio.id).widget().opDisabled("true", true);
                        $("#" + $scope.permanenceRadio.id).widget().opDisabled("false", true);
                    }
                    $("#" + $scope.okButton.id).widget().option("disable", false);
                    $scope.$apply(function(){
                        $scope.freeCapacityGB = store.capacity.freeCapacityGB;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getStore();
            function createDisk(diskInfo) {
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/volumes"},
                    "params": JSON.stringify(diskInfo),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    taskMessage();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function taskMessage() {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.task_view_task_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                msg.destroy();
                                $state.go("system.taskCenter");
                                window.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
        }];

        var createDiskApp = angular.module("createDiskApp", ['framework']);
        createDiskApp.service("camel", httpService);
        createDiskApp.service("validator", validatorService);
        createDiskApp.controller("resources.hypervisor.createDisk.ctrl", createDiskCtrl);
        return createDiskApp;
    }
);
