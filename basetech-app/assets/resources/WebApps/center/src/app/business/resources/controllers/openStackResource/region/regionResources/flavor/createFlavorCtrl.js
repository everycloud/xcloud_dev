define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "bootstrapui/ui-bootstrap-tpls",
    "app/services/exceptionService",
    "language/ssp-exception"],
    function ($, angular, httpService, UnifyValid, constants, ui, ExceptionService) {
        "use strict";

        var createFlavorCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            var exceptionService = new ExceptionService();

            // 扩展UnifyValid
            UnifyValid.checkFlavorName = function () {
                var value = $(this).val();
                if(!/^[a-zA-Z0-9\._\-]{1,255}$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };
            // 扩展UnifyValid
            UnifyValid.checkFlavorID = function () {
                var value = $(this).val();
                if(!/^[a-zA-Z0-9\._\-]{0,255}$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            UnifyValid.checkInteger = function () {
                var value = $(this).val();
                if (!value) {
                    return true;
                }

                if(!(/^[1-9][0-9]*$/.test(value) || value == "0") || parseInt(value, 10) > 2147483647 || parseInt(value, 10) < 0) {
                    return false;
                }

                return true;
            };

            $scope.model = {
                "id":"",
                "name":"",
                "vcpus":"",
                "ram":"",
                "disk":"",
                "OS-FLV-EXT-DATA:ephemeral":"",
                "swap":""
            };

            $scope.flavorId = {
                label: "ID:",
                require: false,
                "id": "createFlavorID",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 255) + $scope.i18n.common_term_composition4_valid,
                "extendFunction" : ["checkFlavorID"],
                "validate":"checkFlavorID():"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 255) + $scope.i18n.common_term_composition4_valid,
                "width": "200",
                "value":""
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "createFlavorName",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 255) + $scope.i18n.common_term_composition4_valid,
                "extendFunction" : ["checkFlavorName"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkFlavorName():"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 255) + $scope.i18n.common_term_composition4_valid,
                "width": "200",
                "value":""
            };

            $scope.vCpus = {
                label: "vCpus:",
                require: true,
                "id": "createFlavorVCpus",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";integer():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";maxValue(2147483647):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";",
                "width": "200",
                "value": ""
            };

            $scope.memroy = {
                label: $scope.i18n.common_term_memoryMB_label + ":",
                require: true,
                "id": "createFlavorMemory",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";integer():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";maxValue(2147483647):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";",
                "width": "200",
                "value":""
            };

            $scope.rootDisk = {
                label: $scope.i18n.common_term_rootDiskGB_label + ":",
                require: true,
                "id": "createFlavorRootDisk",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";integer():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";maxValue(2147483647):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,2147483647)+";",
                "width": "200",
                "value":""
            };

            $scope.ephemeralDisk = {
                label: $scope.i18n.template_term_tempDiskGB_label + ":",
                require: false,
                "id": "ephemeralDisk",
                "value": "",
                "width": "200",
                "extendFunction" : ["checkInteger"],
                "validate": "checkInteger():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{"1":"0","2":2147483647})
            };

            $scope.swapDisk = {
                label: $scope.i18n.spec_term_exchangeDiskMB_label + ":",
                require: false,
                "id": "swapDisk",
                "value": "",
                "width": "200",
                "extendFunction" : ["checkInteger"],
                "validate": "checkInteger():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{"1":"0","2":2147483647})
            };

            $scope.startType = {
                label: $scope.i18n.common_term_startupSource_label+":",
                require: true,
                "id": "createStartType",
                "width": "200",
                "values": [
                    {
                        "selectId": "LocalDisk",
                        "label": $scope.i18n.template_term_startFromImage_label || "从镜像启动",
                        "checked": true
                    },
                    {
                        "selectId": "Volume",
                        "label": $scope.i18n.template_term_startFromCloudHarddisk_label || "从云硬盘启动(创建一个新的云硬盘)"
                    }
                ],
                "change": function () {
                }
            };

            $scope.resizeWindow = function (type) {
                var sizes = {
                    "en":{
                        "up":"500px",
                        "down":"324px"
                    },
                    "zh":{
                        "up":"400px",
                        "down":"324px"
                    }
                };
                $("#createFlavorWinID").find(".ui-dialog-content").css("height",sizes[$scope.i18n.locale][type]);
            };

            $scope.saveBtn = {
                id: "createFlavorSaveBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_create_button || "创建",
                tip: "",
                save: function () {
                    var valid = UnifyValid.FormValid($("#createFlavorInfo"));
                    if (!valid) {
                        return;
                    }

                    $scope.model.id = $("#" + $scope.flavorId.id).widget().getValue();
                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.model.vcpus = $("#" + $scope.vCpus.id).widget().getValue();
                    $scope.model.ram = $("#" + $scope.memroy.id).widget().getValue();
                    $scope.model.disk = $("#" + $scope.rootDisk.id).widget().getValue();
                    $scope.model["OS-FLV-EXT-DATA:ephemeral"] = $("#" + $scope.ephemeralDisk.id).widget().getValue();
                    $scope.model["huawei:extBootType"] = $("#" + $scope.startType.id).widget().getSelectedId();
                    $scope.model.swap = $("#" + $scope.swapDisk.id).widget().getValue();
                    $scope.operator.action("create");
                }
            };

            $scope.cancelBtn = {
                id: "createFlavorCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button || "取消",
                tip: "",
                cancel: function () {
                    $("#createFlavorWinID").widget().destroy();
                }
            };

            $scope.buttonGroup = {
                label: "",
                require: false
            };

            $scope.operator = {
                "create":function() {
                    var deferred = camel.post({
                        "url": {"s": constants.rest.FLAVOR_CREATE.url, "o": {"vdc_id":1, "tenant_id": $scope.projectId}},
                        "params": JSON.stringify({"flavor":$scope.model,"endpoint":$("#createFlavorWinID").widget().option("serviceUrl")}),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        $("#createFlavorWinID").widget().destroy();
                    });

                    deferred.fail(function(data) {
                        exceptionService.doException(data);
                    });
                },
                "createExtra":function (id) {
                    camel.post({
                        "url": {"s": constants.rest.START_SOURCE_CREATE.url, "o": {"service_id": $("#createFlavorWinID").widget().option("serviceID"),"id": id, "tenant_id": $scope.projectId}},
                        "params":JSON.stringify({
                            "extra_specs": {
                                "huawei:extBootType": "LocalDisk"
                            }
                        }),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
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

                        if (type == "create") {
                            $scope.operator.create();
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
                // 预留
            };

            $scope.init();
        }];

        var deps = ["ui.bootstrap"];
        var createFlavorApp = angular.module("resources.openStackResource.flavor", deps);
        createFlavorApp.controller("resources.openStackResource.flavor.ctrl", createFlavorCtrl);
        createFlavorApp.service("camel", httpService);

        return createFlavorApp;
    });

