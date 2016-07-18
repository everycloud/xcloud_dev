define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants",
    "app/business/resources/services/exceptionService",
    "language/ssp-exception"],
    function ($, angular, httpService, UnifyValid, Message, constants, exceptionService, ameException) {
        "use strict";

        var flavorExtraCtrl = ["$scope", "camel", function ($scope, camel) {

            $scope.resourceTagsTable = {
                "label": "",
                "data":[],
                "id": "createFlavoeAddTagBtn",
                "text": $scope.i18n.common_term_add_button || "添加",
                "addTag": function (tagInfo) {
                    var options = {
                        "key": tagInfo === undefined ? "" : tagInfo.key,
                        "value":tagInfo === undefined ? "" : tagInfo.value
                    };

                    $scope.resourceTagsTable.data.push(options);
                }
            };

            $scope.saveBtn = {
                "label": "",
                "require":false,
                "id": "createSlaExtraSave",
                "text": $scope.i18n.common_term_ok_button || "确定",
                "tooltip": "",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#createAggregateSLA"));
                    if (!valid) {
                        return;
                    }

                    var sla = {};
                    var tags = $scope.resourceTagsTable.data;
                    for (var index in tags) {
                        if (sla.hasOwnProperty(tags[index].key)) {
                            var options = {
                                "type": "error",
                                "content": $scope.i18n.cloud_tag_add_info_sameName_valid || "标签名称不唯一。",
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }
                        if (tags[index].key == "availability_zone") {
                            var options = {
                                "type": "error",
                                "content": $scope.i18n.cloud_tag_add_info_nameIsAZ_valid || "标签名称不能为“availability_zone”。",
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }
                        sla[tags[index].key] = tags[index].value;
                    }

                    $scope.operator.action("create");
                }
            };

            $scope.cancelBtn = {
                "id": "createSlaExtraCancel",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "tooltip": "",
                "click": function () {
                    $("#createSlaExtraWinID").widget().destroy();
                }
            };

            $scope.avValue = "";


            /**
             * 操作定义
             *
             * @type {{query: Function, delete: Function, action: Function}}
             */
            $scope.operator = {
                "create": function () {
                    if (!$scope.resourceTagsTable.data || $scope.resourceTagsTable.data.length == 0) {
                        return;
                    }

                    var sla = {
                        "availability_zone":$scope.avValue
                    };
                    var tags = $scope.resourceTagsTable.data;
                    for (var index in tags) {
                        sla[tags[index].key] = tags[index].value;
                    }

                    var slaExtra = {
                        "set_metadata":
                        {
                            "metadata":sla
                        }
                    };

                    var deferred = camel.post({
                        "url": {"s": "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-aggregates/{aggregate_id}/action",
                            o: {"redirect_address_id": $("#createSlaExtraWinID").widget().option("serviceID"), "tenant_id": $scope.projectId,"aggregate_id":$("#createSlaExtraWinID").widget().option("aggregateId")}},
                        "params":JSON.stringify(slaExtra),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        $("#createSlaExtraWinID").widget().destroy();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data, ameException);
                    });
                },
                "query": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-aggregates/{aggregate_id}",
                            o: {"redirect_address_id": $("#createSlaExtraWinID").widget().option("serviceID"), "tenant_id": $scope.projectId,"aggregate_id":$("#createSlaExtraWinID").widget().option("aggregateId")}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "token": $scope.token
                    });
                    deferred.done(function (data) {
                        $scope.$apply(function () {
                            if (data && data.aggregate) {
                                var metadata = data.aggregate.metadata;
                                for (var index in metadata) {
                                    if (index == "availability_zone") {
                                        $scope.avValue = metadata[index];
                                    } else {
                                        $scope.resourceTagsTable.addTag({"key": index, "value": metadata[index]});
                                    }
                                }
                            }
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
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
                        } else if(type == "query") {
                            $scope.operator.query();
                        } else {
                            // do nothing
                        }
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data, ameException);
                    });
                }
            };

            $scope.init = function () {
                $scope.operator.action("query");
            };

            /**
             * 初始化操作
             */
            $scope.init();
        }];

        var dependency = [];

        var flavorDetailModule = angular.module("template.aggregate.sla", []);

        flavorDetailModule.controller("template.aggregate.sla.ctrl", flavorExtraCtrl);
        flavorDetailModule.service("camel", httpService);

        return flavorDetailModule;
    });

