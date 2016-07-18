/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Select",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-common/UnifyValid",
    "fixtures/availableZoneFixture",
    "fixtures/labelFixture"],
    function ($, angular, Select, Window,Message,httpService,Exception ,UnifyValid) {
        "use strict";

        var manageTagCtrl = ["$scope", "$compile", "$state", "camel", "validator", function ($scope, $compile, $state, camel, validator) {
            var exceptionService = new Exception();
            var userId = $("html").scope().user.id;
            $scope.i18n = $("html").scope().i18n;
            var wind = $("#manageTagWindow").widget();
            var azId = wind.option("azId");
            var infraId = wind.option("infraId");

            //添加标签按钮
            $scope.addTagButton = {
                "id": "addTagButton",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    $scope.tagTable.data.push({"name": "addLabel"});
                    $("#" + $scope.tagTable.id).widget().option("data", $scope.tagTable.data);
                }
            };
            //标签列表
            $scope.tagTable = {
                "id": "azTagTable",
                "data": [],
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
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.operator);
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    var optColumn = '';
                    if (aData.name === 'addLabel') {
                        var slt2 = new Select({
                            "id": "valueSelect_" + iDataIndex,
                            "width": "200px",
                            "values": []
                        });

                        var slt1 = new Select({
                            "id": "nameSelect_" + iDataIndex,
                            "width": "200px",
                            "values": getTagsSelectNameData()
                        });
                        slt1.on("change", function () {
                            slt2.option("values", getTagsSelectValueData(slt1.getSelectedId()));
                        });
                        $('td:eq(0)', nRow).html(slt1.getDom());

                        //标签值下拉框
                        $('td:eq(1)', nRow).html(slt2.getDom());

                        optColumn = "<a href='javascript:void(0)' ng-click='save()'>"+$scope.i18n.common_term_save_label+
                            "</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' ng-click='deleteSave()'>"+$scope.i18n.common_term_delete_button+"</a>";
                    } else {
                        optColumn = "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>";
                    }
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.deleteSave = function () {
                        $scope.tagTable.data.splice(iDataIndex, 1);
                        $("#" + $scope.tagTable.id).widget().option("data", $scope.tagTable.data);
                    };
                    optScope.save = function () {
                        $scope.saveLabel(slt1.getSelectedId(), slt2.getSelectedId());
                    };
                    optScope.edit = function () {

                    };
                    optScope.delete = function () {
                        var options = {
                            type: "warn",
                            content: $scope.i18n.cloud_tag_del_info_confirm_msg,
                            height: "150px",
                            width: "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    handler: function (event) {
                                        msg.destroy();
                                        $scope.deleteTagLabel(aData.name, aData.value);
                                    }
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    default: false,
                                    handler: function (event) {
                                        msg.destroy();
                                    }
                                }
                            ]
                        };
                        var msg = new Message(options);
                        msg.show();
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(2)", nRow).html(optNode);
                }
            };

            function getTagsSelectNameData() {
                return $scope.TAG_KEYS;
            }

            function getTagsSelectValueData(currName) {
                if ($scope.TAG_KEYS && $scope.TAG_KEYS.length > 0) {
                    for (var i = 0; i < $scope.TAG_VALUE_RESP.length; i++) {
                        var name = $scope.TAG_VALUE_RESP[i].name;
                        if (name === currName) {
                            var arr = [];
                            for (var k = 0; k < $scope.TAG_VALUE_RESP[i].values.length; k++) {
                                arr.push(getSelectTagKeyItem($scope.TAG_VALUE_RESP[i].values[k]));
                            }
                            return arr;
                        }
                    }
                }
            }

            $scope.TAG_KEYS = [];
            $scope.TAG_VALUE_RESP = [];
            function initTagSelectData(tagGroups) {
                var tagArrs = tagGroups;
                var tagKeys = [];
                for (var item in tagArrs) {
                    if (tagArrs[item].values) {
                        var tagValues = [];
                        for (var i = 0; i < tagArrs[item].values.length; i++) {
                            tagValues.push(tagArrs[item].values[i]);
                        }
                    }
                    tagKeys.push(getSelectTagKeyItem(tagArrs[item].name));
                }
                $scope.TAG_KEYS = tagKeys;
            }

            function getSelectTagKeyItem(tagKey) {
                var tags = {};
                tags.label = tagKey;
                tags.selectId = tagKey;
                return tags;
            }

            $scope.getTagsGroup = function () {
                getTagsByAZ();
                getAllTagsGroup();
            };

            function getTagsByAZ() {
                var defe = camel.get({
                    "url": {s: "/goku/rest/v1.5/all/available-zones/{id}?cloud-infra={cloud-infra}", o: {"id": azId, "cloud-infra": infraId}},
                    "userId": userId
                });
                defe.done(function (response) {
                    $scope.$apply(function () {
                        $scope.tagTable.data = [];
                        if (response && response.availableZone && response.availableZone.tags && response.availableZone.tags) {
                            var tagss = [];
                            if (response.availableZone.tags.common) {
                                for (var i = 0; i < response.availableZone.tags.common.length; i++) {
                                    tagss.push(response.availableZone.tags.common[i]);
                                }
                            }
                            if (response.availableZone.tags.datastore) {
                                for (var i = 0; i < response.availableZone.tags.datastore.length; i++) {
                                    tagss.push(response.availableZone.tags.datastore[i])
                                }
                            }
                            $scope.tagTable.data = tagss;
                        }
                    });
                });
                defe.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getAllTagsGroup() {
                var defe = camel.get({
                    "url": "/goku/rest/v1.5/all/tag-groups",
                    "userId": userId
                });
                defe.done(function (response) {
                    $scope.$apply(function () {
                        if (response && response.tagGroups) {
                            $scope.TAG_VALUE_RESP = response.tagGroups;
                            //初始化标签名称下来框
                            initTagSelectData(response.tagGroups);
                        }
                    });
                });
                defe.fail(function (data) {
                });
            }

            $scope.deleteTagLabel = function(name, value) {
                var params = {
                    "unTag": {
                        "name": name,
                        "value": value,
                        "resources": {
                            "availableZone": [{"id" : azId, "cloudInfraId": infraId}]
                        }
                    }
                };
                var defe = camel.post({
                    "url": "/goku/rest/v1.5/all/tags/action",
                    "params": JSON.stringify(params),
                    "userId": userId
                });
                defe.done(function () {
                    getTagsByAZ();
                });
                defe.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
            $scope.saveLabel = function(name, value) {
                var params = {
                    "tag": {
                        "name": name,
                        "value": value,
                        "resources": {
                            "availableZone": [{"id" : azId, "cloudInfraId": infraId}]
                        }
                    }
                };
                var defe = camel.post({
                    "url": "/goku/rest/v1.5/all/tags/action",
                    "params": JSON.stringify(params),
                    "userId": userId
                });
                defe.done(function () {
                    getTagsByAZ();
                });
                defe.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
        }];

        var manageTagApp = angular.module("manageTagApp", ['framework']);
        manageTagApp.service("camel", httpService);
        manageTagApp.controller("multiPool.availableZone.manageTag.ctrl", manageTagCtrl);
        return manageTagApp;
    }
);