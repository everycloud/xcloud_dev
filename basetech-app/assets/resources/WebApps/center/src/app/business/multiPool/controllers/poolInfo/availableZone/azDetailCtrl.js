/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Select",
    "tiny-widgets/Lineplot",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"],
    function ($,angular, Select, Lineplot,validatorService, UnifyValid, httpService, Exception) {
        "use strict";

        var azDetailCtrl = ["$scope", "$compile", "camel","validator", function ($scope, $compile, camel,validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.locale = $("html").scope().locale;
            $scope.i18n = $("html").scope().i18n;

            $scope.unit = $scope.i18n.common_term_entry_label;
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
                    $scope.nameItem.value = $("#"+$scope.detailId).find(".nameItem").find(".tiny-textbox").widget().getValue();
                    $scope.nameItem.modifying = false;
                    editAz();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        var result = UnifyValid.FormValid($("#"+$scope.detailId).find(".nameItem"));
                        if (!result) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.nameItem.value = $("#"+$scope.detailId).find(".nameItem").find(".tiny-textbox").widget().getValue();
                            $scope.nameItem.modifying = false;
                            editAz();
                        });
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
                            editAz();
                        });
                    }
                }
            };

            $scope.getAz = function (azId, infraId, detailId, poolType) {
                $scope.azId = azId;
                $scope.infraId = infraId;
                $scope.detailId = detailId;
                $scope.poolType = poolType;
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/1/available-zones/{id}?cloud-infra={infraId}",
                        o: {id: $scope.azId, infraId: $scope.infraId}
                    },
                    userId: user.id,
					"timeout": 120000
                });
                deferred.success(function (data) {
                    var az = data.availableZone;
                    $scope.$apply(function () {
                        if (az) {
                            $scope.nameItem.value = az.name;
                            $scope.descItem.value = az.description;
                            $scope.azId = az.id;

                            if (az.tags && az.tags) {
                                var tagss = [];
                                if (az.tags.common) {
                                    for (var i = 0; i < az.tags.common.length; i++) {
                                        az.tags.common[i].tagType = $scope.i18n.cloud_term_tagTypeAZ_value;
                                        tagss.push(az.tags.common[i]);
                                    }
                                }
                                if (az.tags.datastore) {
                                    for (var i = 0; i < az.tags.datastore.length; i++) {
                                        az.tags.datastore[i].tagType = $scope.i18n.cloud_term_tagTypeStorage_value;
                                        tagss.push(az.tags.datastore[i]);
                                    }
                                }
                                $scope.azDetailTagTable.data = tagss;
                            }
                            $scope.azVMNum = '--';
                            $scope.azVolumeNum = '--';
                            if (az.resources) {
                                for (var i = 0; i < az.resources.length; i++) {
                                    if (az.resources[i].resourceType === 'VM') {
                                        $scope.azVMNum = az.resources[i].total;
                                    }
                                    if (az.resources[i].resourceType === 'Volume') {
                                        $scope.azVolumeNum = az.resources[i].total;
                                    }
                                }

                            }

                        }
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
            function editAz() {
                var params = {
                    "name": $scope.nameItem.value,
                    "description": $scope.descItem.value
                };
                var deferred = camel.put({
                    "url": {
                        s: "/goku/rest/v1.5/1/available-zones/{id}?cloud-infra={infraId}",
                        o: {id: $scope.azId, infraId: $scope.infraId}
                    },
                    "params": JSON.stringify(params),
                    userId: user.id
                });
                deferred.success(function (data) {
                    var preDom = $("#" + $scope.detailId).parent().parent().parent().prev();
                    $("td:eq(1)", preDom).html($.encoder.encodeForHTML($scope.nameItem.value));
                    $("td:eq(4)", preDom).html($.encoder.encodeForHTML($scope.descItem.value));
                });
                deferred.fail(function (data) {
                    var preDom = $("#" + $scope.detailId).parent().parent().parent().prev();
                    $scope.$apply(function(){
                        $scope.nameItem.value = $("td:eq(1)", preDom).html();
                        $scope.descItem.value = $("td:eq(4)", preDom).html();
                    });
                    exceptionService.doException(data);
                });
            }
            //标签列表
            $scope.azDetailTagTable = {
                "id": "azDetailTagTableId",
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
					$('td:eq(0)', nRow).addTitle();
					$('td:eq(1)', nRow).addTitle();
                }
            };
        }];

        var dependency = ["ng", "wcc"];
        var zoneDetailModule = angular.module("multiPool.az.azDetail", dependency);
        zoneDetailModule.service("validator", validatorService);
        zoneDetailModule.service("camel", httpService);
        zoneDetailModule.controller("multiPool.az.azDetail.ctrl", azDetailCtrl);
        return zoneDetailModule;
    });


