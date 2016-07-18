define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants"],
    function ($, angular, UnifyValid, Message, constants) {
        "use strict";

        var distributeConfirmCtrl = ["$scope", "$state", "$stateParams", "camel", "$timeout", "exception", function ($scope, $state, $stateParams, camel, $timeout, exception) {

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: false,
                "id": "distributeConfirmName"
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "id": "distributeConfirmPicture"
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: false,
                "id": "distributeConfirmOSType"
            };

            $scope.packageType = {
                label: $scope.i18n.common_term_softwareType_label+":",
                require: false,
                "id": "distributeConfirmPackageType"
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: false,
                "id": "distributeConfirmVersion"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "distributeConfirmDescription"
            };

            $scope.path = {
                label: $scope.i18n.common_term_fileTargetPath_label+":",
                require: false,
                "id": "distributeConfirmPath"
            };

            $scope.installCmd = {
                label: $scope.i18n.common_term_installCmdPara_label+":",
                require: false,
                "id": "distributeConfirmInstallCmd"
            };
            $scope.uninstallCmd = {
                label: $scope.i18n.common_term_uninstallCmdPara_label+":",
                require: false,
                "id": "distributeConfirmUninstallCmd"
            };
            $scope.startCmd = {
                label: $scope.i18n.common_term_startupCmdPara_label+":",
                require: false,
                "id": "distributeConfirmStartCmd"
            };
            $scope.stopCmd = {
                label: $scope.i18n.common_term_StopCmdPara_label+":",
                require: false,
                "id": "distributeConfirmStopCmd"
            };

            $scope.vmSelectConfirmTable = {
                label: $scope.i18n.template_term_chooseVM_label+":",
                require: false,
                caption: "",
                data: [],
                id: "vmSelectConfirmTableId",
                columnsDraggable: false,
                enablePagination: false,
                lengthChange: false,
                enableFilter: true,
                hideTotalRecords: true,
                showDetails: false,
                columns: [
                    {
                        "sTitle": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_vmName_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_IP_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_host_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.hostName);
                        },
                        "bSortable": false
                    }
                ],
                renderRow: function (row, dataItem, index) {
                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(2)", row).addTitle();
                    $("td:eq(3)", row).addTitle();
                    $("td:eq(4)", row).addTitle();

                    $("td:eq(2)", row).html($scope.service.vmStatus[dataItem.status]);
                }
            };

            $scope.preBtn = {
                id: "distirbuteConfirmPreBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_back_button,
                tip: "",
                pre: function () {
                    $scope.service.show = "selectVm";
                    $("#"+$scope.service.step.id).widget().pre();
                }
            };

            $scope.distributeBtn = {
                id: "distirbuteConfirmOKBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label,
                tip: "",
                distribute: function () {
                    $scope.operator.distribute();
                }
            };

            $scope.cancelBtn = {
                id: "distirbuteConfirmCancelBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go("resources.templateSpec.software", {});
                }
            };

            // 监控事件
            $scope.$on($scope.distributionEvents.vmSelectedFromParent, function (event, msg) {
                $("#"+$scope.vmSelectConfirmTable.id).widget().option("data", $scope.service.vmList);
            });

            $scope.operator = {
                "distribute":function () {
                    var model = {
                        "installParameters":[],
                        "unInstallParameters":[],
                        "startParameters":[],
                        "stopParameters":[],
                        "vmIds":[]
                    };

                    for (var index in $scope.service.vmList) {
                        model.vmIds.push($scope.service.vmList[index].id);
                    }

                    for (var index in $scope.service.model.installParams) {
                        var param = $scope.service.model.installParams[index];
                        model.installParameters.push({"key":param["name"], "value":param["value"]});
                    }
                    for (var index in $scope.service.model.unInstallParams) {
                        var param = $scope.service.model.unInstallParams[index];
                        model.unInstallParameters.push({"key":param["name"], "value":param["value"]});
                    }
                    for (var index in $scope.service.model.startParams) {
                        var param = $scope.service.model.startParams[index];
                        model.startParameters.push({"key":param["name"], "value":param["value"]});
                    }
                    for (var index in $scope.service.model.stopParams) {
                        var param = $scope.service.model.stopParams[index];
                        model.stopParameters.push({"key":param["name"], "value":param["value"]});
                    }

                    var deferred = camel.post({
                        "url": {"s": constants.rest.SOFTWARE_DISTRIBUTE.url, "o": {"tenant_id": 1, "softwareid": $stateParams.id}},
                        "params": JSON.stringify(model),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
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
                                default: true,//默认焦点
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
                                    $state.go("resources.templateSpec.software", {});
                                    msgBox.destroy();
                                }
                            }
                        ];
                        msgBox.option("buttons", buttons);
                        msgBox.show();
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };
        }];

        return distributeConfirmCtrl;
    });

