define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "tiny-widgets/Message",
    'app/services/exceptionService'],
    function ($, angular, httpService, UnifyValid, constants, Message, exceptionService) {
        "use strict";

        var discoverCtrl = ["$scope", "$compile", "camel", "exception", function ($scope, $compile, camel, exception) {

            $scope.hypervisorID = undefined;

            $scope.hypervisor = {
                label: $scope.i18n.virtual_term_hypervisor_label+":",
                require: true,
                "id": "discoverHypervisor",
                "width": "200",
                "height": "300",
                "values": [],
                "change": function () {
                    $scope.hypervisorID = $("#" + $scope.hypervisor.id).widget().getSelectedId();
                }
            };

            $scope.discoverBtn = {
                id: "discoverBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_discover_button,
                tip: "",
                discover: function () {
                    $scope.operator.discover();
                }
            };

            $scope.cancelBtn = {
                id: "discoverCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $("#discoverWinID").widget().destroy();
                }
            };

            $scope.buttonGroup = {
                label: "",
                require: false
            };

            $scope.operator = {
                "init":function(){
                    var params = {
                        "list": {
                            "hypervisorName": "",
                            "hypervisorType": null,
                            "hypervisorVersion": "",
                            "hypervisorIp": "",
                            "hypervisorPort": "",
                            "hypervisorConnectStatus": "",
                            "start": 0,
                            "limit": 100
                        }
                    };
                    var deferred = camel.post({
                        url: {"s":constants.rest.VMT_HYPERVISOR_QUERY.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify(params),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            var hypervisors = [];
                            if(data && data.list && data.list.hypervisors) {
                                hypervisors = data.list.hypervisors;
                            }
                            var hypervisorList = [];
                            for (var index in hypervisors) {
                                var hyper = {};
                                hyper.selectId = hypervisors[index].id;
                                hyper.label = hypervisors[index].name;
                                if (index == 0) {
                                    hyper.checked = true;
                                    $scope.hypervisorID = hypervisors[index].id;
                                }

                                hypervisorList.push(hyper);
                            }

                            $scope.hypervisor.values = hypervisorList;
                        });
                    });
                },
                "discover":function(){
                    if ($scope.hypervisorID === undefined || $scope.hypervisorID === "") {
                        return;
                    }
                    var deferred = camel.post({
                        url: {"s":constants.rest.VM_TEMPLATE_DISCOVER.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify({"hypervisorId":$scope.hypervisorID}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $("#discoverWinID").widget().destroy();
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

            $scope.operator.init();

        }];

        var deps = [];
        var discoverApp = angular.module("resources.template.discover", deps);
        discoverApp.controller("resources.template.discover.ctrl", discoverCtrl);
        discoverApp.service("camel", httpService);
        discoverApp.service("exception", exceptionService);

        return discoverApp;
    });

