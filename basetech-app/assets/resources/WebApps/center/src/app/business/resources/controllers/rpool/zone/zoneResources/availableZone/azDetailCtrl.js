/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Select",
    "tiny-widgets/Lineplot",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"],
    function ($,angular, Select, Lineplot, validatorService, UnifyValid, httpService, Exception) {
        "use strict";

        var azDetailCtrl = ["$scope", "$compile", "camel", "validator", function ($scope, $compile, camel, validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.operable = user.privilege["role_role_add_option_AZHandle_value.601002"];
            //名称
            $scope.nameItem = {
                "label": $scope.i18n.common_term_name_label+":",
                "value": "",
                "id": "azDetailNameItem",
                "modifying": false,
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(128):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"})+
                    ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition2_valid,
                "clickModify": function () {
                    $scope.nameItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#"+$scope.detailId).find(".nameItem").find("input").focus();
                    }, 50);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#"+$scope.detailId).find(".nameItem"));
                    if (!result) {
                        return;
                    }
                    $scope.nameItem.value =$("#"+$scope.detailId).find(".nameItem").find(".tiny-textbox").widget().getValue();
                    $scope.nameItem.modifying = false;
                    editAz();
                },
                "keypressfn": function (event) {
                    var result = UnifyValid.FormValid($("#"+$scope.detailId).find(".nameItem"));
                    if (!result) {
                        return;
                    }
                    if (event.keyCode === 13) {
                        $scope.$apply(function () {
                            $scope.nameItem.value = $("#"+$scope.detailId).find(".nameItem").find(".tiny-textbox").widget().getValue();
                            $scope.nameItem.modifying = false;
                        });
                        editAz();
                    }
                }
            };
            //描述
            $scope.descItem = {
                "label": $scope.i18n.common_term_desc_label+":",
                "id": "azDetailDescItem",
                "modifying": false,
                "type": "multi",
                "height":"50",
                "validate": "maxSize(1024):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"1024"}),
                "clickModify": function () {
                    $scope.descItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#"+$scope.detailId).find(".descItem").find("input").focus();
                    }, 100);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#"+$scope.detailId).find(".descItem"));
                    if (!result) {
                        return;
                    }
                    $scope.descItem.value = $("#"+$scope.detailId).find(".descItem").find(".tiny-textbox").widget().getValue();
                    $scope.descItem.modifying = false;
                    editAz();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        var result = UnifyValid.FormValid($("#"+$scope.detailId).find(".descItem"));
                        if (!result) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.descItem.value = $("#"+$scope.detailId).find(".descItem").find(".tiny-textbox").widget().getValue();
                            $scope.descItem.modifying = false;
                        });
                        editAz();
                    }
                }
            };

            $scope.getAz = function (azId, detailId) {
                $scope.azId = azId;
                $scope.detailId = detailId;
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/irm/1/availablezones/{id}",
                        o: {id: $scope.azId}
                    },
                    userId: user.id
                });
                deferred.success(function (data) {
                    var az = data.availableZone || {};
                    var resourceTags = az.resourceTags || {};
                    var dataStoreTags = resourceTags.datastore || [];
                    var tags = [];
                    for (var i = 0; i < dataStoreTags.length; i++) {
                        dataStoreTags[i].tagType = $scope.i18n.cloud_term_tagTypeStorage_value;
                        tags.push(dataStoreTags[i]);
                    }
                    if (az.tags) {
                        for (var i = 0; i < az.tags.length; i++) {
                            az.tags[i].tagType = $scope.i18n.cloud_term_tagTypeAZ_value;
                            tags.push(az.tags[i]);
                        }
                    }
                    $scope.$apply(function () {
                        $scope.nameItem.value = az.name;
                        $scope.descItem.value = az.description;
                        $scope.azId = az.id;
                        $scope.azDetailTagsTable.data = tags;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
            function editAz() {
                var params = {
                    "name": $scope.nameItem.value || "",
                    "description": $scope.descItem.value || ""
                };
                var deferred = camel.put({
                    "url": {
                        s: "/goku/rest/v1.5/irm/1/availablezones/{id}",
                        o: {id: $scope.azId}
                    },
                    "params": JSON.stringify(params),
                    userId: user.id
                });
                deferred.success(function (data) {
                    var preDom = $("#" + $scope.detailId).parent().parent().parent().prev();
                    $("td:eq(1)", preDom).html($.encoder.encodeForHTML($scope.nameItem.value));
                });
                deferred.fail(function (data) {
                    var preDom = $("#" + $scope.detailId).parent().parent().parent().prev();
                    $scope.$apply(function () {
                        $scope.nameItem.value = $("td:eq(1)", preDom).html();
                    });
                    exceptionService.doException(data);
                });
            }
            //标签列表
            $scope.azDetailTagsTable = {
                "id": "azazDetailTagsTable",
                "data": null,
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": $scope.i18n.cloud_term_tagName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.cloud_term_tagValue_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.value);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.cloud_term_tagType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.tagType);
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                }
            };
        }];

        var dependency = ["ng", "wcc"];
        var zoneDetailModule = angular.module("rpool.zone.zoneResources.azDetail", dependency);
        zoneDetailModule.service("camel", httpService);
        zoneDetailModule.service("validator", validatorService);
        zoneDetailModule.controller("rpool.zone.zoneResources.azDetail.ctrl", azDetailCtrl);
        return zoneDetailModule;
    });


