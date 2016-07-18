define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants",
    "app/services/exceptionService"],
    function ($, angular, httpService, UnifyValid, Message, constants, ExceptionService) {
        "use strict";

        var flavorExtraCtrl = ["$scope", "camel", function ($scope, camel) {

            var exceptionService = new ExceptionService();

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

                    for (var indexTemp in $scope.deletedKeys) {
                        if (options.key == $scope.deletedKeys[indexTemp]) {
                            $scope.deletedKeys.splice(indexTemp, 1);
                            break;
                        }
                    }

                    $scope.resourceTagsTable.data.push(options);
                },
                "deleteTag": function (index) {
                    var hasKey = false;
                    for (var indexTemp in $scope.deletedKeys) {
                        if ($scope.resourceTagsTable.data[index].key == $scope.deletedKeys[indexTemp]) {
                            hasKey = true;
                            break;
                        }
                    }

                    var toDeleteKey = $scope.resourceTagsTable.data[index].key;
                    if (!hasKey && toDeleteKey) {
                        $scope.deletedKeys.push(toDeleteKey);
                    }

                    $scope.resourceTagsTable.data.splice(index, 1);
                }
            };

            $scope.saveBtn = {
                "label": "",
                "require":false,
                "id": "createSlaExtraSave",
                "text": $scope.i18n.common_term_ok_button || "确定",
                "tooltip": "",
                "click": function () {
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
                        sla[tags[index].key] = tags[index].value;

                        var deleteIndex = $.inArray(tags[index].key, $scope.deletedKeys);
                        if (deleteIndex != -1) {
                            $scope.deletedKeys.splice(deleteIndex, 1);
                        }
                    }

                    $scope.operator.action("delete");
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

            $scope.slaSelect = {
                "id": "createSlaExtraSlaInfo",
                "width": "150",
                "values": [],
                "slas": [],
                "change":function(index) {
                    var selectId = $("#"+index).widget().getSelectedId();
                    var selectSla = {};
                    for (var indexSla in $scope.slaSelect.slas) {
                        if ($scope.slaSelect.slas[indexSla].selectId == selectId) {
                            selectSla = $scope.slaSelect.slas[indexSla];
                            break;
                        }
                    }
                    $scope.resourceTagsTable.data[index] = {"key":selectSla.key, "value":selectSla.value};

                    for (var indexTemp in $scope.deletedKeys) {
                        if (selectId == $scope.deletedKeys[indexTemp]) {
                            $scope.deletedKeys.splice(indexTemp, 1);
                            break;
                        }
                    }
                }
            };

            /**
             * 被删除的Keys
             * @type {Array}
             */
            $scope.deletedKeys = [];

            /**
             * 添加sla列表信息
             * @param metadata
             */
            var addSlaList = function (id, metadata) {
                if (!metadata) {
                    return;
                }

                var values = [];
                var slas = [];

                for (var index in metadata) {
                    if (index != "availability_zone") {
                        values.push({
                            "selectId": id+index,
                            "label": index + ";" + metadata[index]
                        });
                        slas.push({
                            "selectId": id+index,
                            "key": index,
                            "value": metadata[index]
                        });
                    }
                }

                $.merge($scope.slaSelect.values, values);
                $.merge($scope.slaSelect.slas, slas);
            };


            /**
             * 操作定义
             *
             * @type {{query: Function, delete: Function, action: Function}}
             */
            $scope.operator = {
                "create": function () {
                    var sla = {};
                    var tags = $scope.resourceTagsTable.data;
                    for (var index in tags) {
                        sla[tags[index].key] = tags[index].value;
                    }

                    var slaExtra = {};
                    slaExtra["extra_specs"] =  sla;

                    var deferred = camel.post({
                        "url": {"s": constants.rest.START_SOURCE_CREATE.url, "o": {"service_id": $("#createSlaExtraWinID").widget().option("serviceID"),"id": $("#createSlaExtraWinID").widget().option("flavorID"), "tenant_id": $scope.projectId}},
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
                        exceptionService.doException(data, null);
                    });
                },
                "query": function () {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.START_SOURCE_QUERY_ALL.url, "o": {"service_id": $("#createSlaExtraWinID").widget().option("serviceID"), "tenant_id": $scope.projectId, "id":$("#createSlaExtraWinID").widget().option("flavorID")}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data["extra_specs"] === undefined) {
                            return;
                        }

                        $scope.$apply(function() {
                            var key = "huawei:extBootType";
                            var extra = data["extra_specs"];
                            for (var index in extra) {
                                if (index != key) {
                                    $scope.resourceTagsTable.addTag({"key":index, "value":extra[index]});
                                }
                            }
                        });
                    });
                },
                "delete":function () {
                    for (var keyId in $scope.deletedKeys) {
                        var deferred = camel.delete({
                            "url": {
                                s: "/goku/rest/v1.5/openstack/{service_id}/v2/{tenant_id}/flavors/{flavor_id}/os-extra_specs/{key_id}",
                                o: {"service_id": $("#createSlaExtraWinID").widget().option("serviceID"),"flavor_id": $("#createSlaExtraWinID").widget().option("flavorID"), "tenant_id": $scope.projectId, "key_id":$scope.deletedKeys[keyId]}
                            },
                            "userId": $("html").scope().user && $("html").scope().user.id,
                            "token": $scope.token
                        });
                        deferred.fail(function (data) {
                            exceptionService.doException(data, null);
                        });
                    }
                },
                "queryAggregates": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-aggregates",
                            o: {"redirect_address_id": $("#createSlaExtraWinID").widget().option("serviceID"), "tenant_id": $scope.projectId}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "token": $scope.token
                    });
                    deferred.done(function (data) {
                        $scope.$apply(function () {
                            if (data && data.aggregates) {
                                for(var index in data.aggregates) {
                                    addSlaList(data.aggregates[index].id, data.aggregates[index].metadata);
                                }
                            }
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data, null);
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
                        } else if(type == "queryAggregates") {
                            $scope.operator.queryAggregates();
                        } else if (type == "delete") {
                            $scope.operator.delete();
                        } else {
                            // do nothing
                        }
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data, null);
                    });
                }
            };

            $scope.init = function () {
                $scope.operator.action("queryAggregates");
                $scope.operator.action("query");
            };

            /**
             * 初始化操作
             */
            $scope.init();
        }];

        var dependency = [];

        var flavorDetailModule = angular.module("template.flavor.sla", []);

        flavorDetailModule.controller("template.flavor.sla.ctrl", flavorExtraCtrl);
        flavorDetailModule.service("camel", httpService);

        return flavorDetailModule;
    });

