define(['jquery',
        'tiny-lib/angular',
        "tiny-widgets/Select",
        "tiny-widgets/Window",
        "tiny-widgets/Message",
        "app/services/httpService",
        "app/services/exceptionService",
        "tiny-common/UnifyValid",
        "fixtures/availableZoneFixture",
        "fixtures/labelFixture"
    ],
    function ($, angular, Select, Window, Message, httpService, Exception, UnifyValid) {
        "use strict";

        var manageTagCtrl = ["$scope", "$compile", "$state", "camel", "validator",
            function ($scope, $compile, $state, camel, validator) {
                var userId = $("html").scope().user.id;
				$scope.i18n = $("html").scope().i18n;
                var exceptionService = new Exception();
                var wind = $("#localManageTagWindow").widget();
                var azId = wind.option("azId");
                var clusterId = wind.option("clusterId");
                //来源类型 AZ,CLUSTER
                var resourceType = wind.option("resourceType");

                //添加标签按钮
                $scope.addTagButton = {
                    "id": "addTagButton",
                    "text": $scope.i18n.common_term_add_button || "添加",
                    "click": function () {
						if (!isExistUnSave()) {
							$scope.tagTable.data.push({
								"name": "addLabel"
							});
							$("#" + $scope.tagTable.id).widget().option("data", $scope.tagTable.data);
						}
                    }
                };
                //标签列表
                $scope.tagTable = {
                    "id": "azTagTable",
                    "data": [],
                    "enablePagination": false,
                    "columns": [{
                        "sTitle": $scope.i18n.cloud_term_tagName_label || "标签名称",
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.name);
						},
                        "bSortable": false
                    }, {
                        "sTitle": $scope.i18n.cloud_term_tagValue_label || "标签值",
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.value);
						},
                        "bSortable": false
                    }, {
                        "sTitle": $scope.i18n.common_term_operation_label || "操作",
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.operator);
						},
                        "bSortable": false
                    }],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(0)', nRow).addTitle();
                        $('td:eq(1)', nRow).addTitle();
                        var optColumn = '';
                        if (aData.name == 'addLabel') {
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

                            optColumn = "<a href='javascript:void(0)' ng-click='save()'>"+$scope.i18n.common_term_save_label+"</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' ng-click='deleteSave()'>"+$scope.i18n.common_term_delete_button+"</a>";
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
                                content: $scope.i18n.common_term_delConfirm_msg || "确实要删除?",
                                height: "150px",
                                width: "350px",
                                "buttons": [{
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    handler: function (event) {
                                        msg.destroy();
                                        $scope.deleteTagLabel(aData.name, aData.value);
                                    }
                                }, {
                                    label: $scope.i18n.common_term_cancle_button,
                                    default: false,
                                    handler: function (event) {
                                        msg.destroy();
                                    }
                                }]
                            }
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
                    var doneTags = getTaged();
                    for (var item in tagArrs) {
                        //过滤掉已添加过的标签
                        if (!isExist(doneTags, tagArrs[item].name)) {
                            tagKeys.push(getSelectTagKeyItem(tagArrs[item].name));
                        }
                    }
                    $scope.TAG_KEYS = tagKeys;
                }

                function isExist(doneTags, tagKey) {
                    for (var k = 0; k < doneTags.length; k++) {
                        if (doneTags[k].name == tagKey) {
                            return true;
                        }
                    }
                    return false;
                }
                //是否存在为
                function isExistUnSave() {
					if(!hasLabel()){
						var options = {
							type: "prompt",
							content: $scope.i18n.virtual_cluster_addTag_info_allTagAdded_msg || "所有标签均已添加，无其他可用标签。",
							height: "60px",
							width: "300px"
						};
						var msg = new Message(options);
						msg.show();
						return true;
					}
                    var tableData = $("#azTagTable").widget();
                    var data = tableData.option("data");
                    var vs = [];
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].name == "addLabel") {
                                return true;
                            }
                        }
                    }
                    return false;
                };
				//是否还有课添加的标签
				function hasLabel(){
					return $scope.TAG_KEYS.length != 0;
				}

                //获取此资源已打过的标签
                function getTaged() {
                    var tableData = $("#azTagTable").widget();
                    var data = tableData.option("data");
                    var vs = [];
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].name != "addLabel") {
                                vs.push(data[i]);
                            }
                        }
                    }
                    return vs;
                }

                function getSelectTagKeyItem(tagKey) {
                    var tags = {};
                    tags.label = tagKey;
                    tags.selectId = tagKey
                    return tags;
                }

                $scope.getTagsGroup = function () {
                    getTags(function () {
                        getAllTagsGroup();
                    });

                };

                function getTags(callback) {
                    if (resourceType == 'AZ') {
                        getTagsByAZ(callback);
                    } else if (resourceType == 'Cluster') {
                        getTagsByCluster(callback);
                    }
                }

                function getTagsByCluster(callback) {
                    var defe = camel.get({
                        "url": {
                            s: '/goku/rest/v1.5/irm/1/resourceclusters/{id}',
                            o: {
                                id: clusterId
                            }
                        },
                        "userId": userId
                    });
                    defe.done(function (response) {
                        $scope.$apply(function () {
                            $scope.tagTable.data = [];
                            if (response && response.resourceCluster && response.resourceCluster.tags) {
                                $scope.tagTable.data = response.resourceCluster.tags;
                            }
                        });
                        callback();
                    });
                    defe.fail(function (data) {
                        callback();
                    });
                };

                function getTagsByAZ(callback) {
                    var params = {
                            ids: [azId],
                            "detail": false
                    };
                    var defe = camel.post({
                        "url": "/goku/rest/v1.5/irm/1/availablezones/list",
                        "params": JSON.stringify(params),
                        "userId": userId
                    });
                    defe.done(function (response) {
                        $scope.$apply(function () {
                            $scope.tagTable.data = [];
                            if (response && response.availableZones) {
                                var aZone = response.availableZones[0];
                                var respTags = aZone.tags;
                                var tagss = [];
                                if (respTags) {
                                    for (var i = 0; i < respTags.length; i++) {
                                        tagss.push(respTags[i]);
                                    }
                                }
                                $scope.tagTable.data = tagss;
                            }
                        });
                        callback();
                    });
                    defe.fail(function (data) {
                        callback();
                    });
                }

                function getAllTagsGroup() {
                    var defe = camel.get({
                        "url": "/goku/rest/v1.5/irm/1/tag-groups",
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
                    defe.fail(function (data) {});
                };

                $scope.deleteTagLabel = function (name, value) {
                    var params = {
                        "unTag": {
                            "name": name,
                            "value": value,
                            "resources": {}
                        }
                    };
                    if (resourceType == 'AZ') {
                        params.unTag.resources.availableZone = [azId];
                    } else if (resourceType == 'Cluster') {
                        params.unTag.resources.resourceCluster = [clusterId];
                    }
                    var defe = camel.post({
                        "url": "/goku/rest/v1.5/irm/all/tags/action",
                        "params": JSON.stringify(params),
                        "userId": userId
                    });
                    defe.done(function () {
                        $scope.getTagsGroup();
                    });
                    defe.fail(function (data) {
                        exceptionService.doException(data);
                    });
                };
                $scope.saveLabel = function (name, value) {
					if(name == null || value == null){
						return;
					}
                    var params = {
                        "tag": {
                            "name": name,
                            "value": value,
                            "resources": {}
                        }
                    };
                    if (resourceType == 'AZ') {
                        params.tag.resources.availableZone = [azId];
                    } else if (resourceType == 'Cluster') {
                        params.tag.resources.resourceCluster = [clusterId];
                    }
                    var defe = camel.post({
                        "url": "/goku/rest/v1.5/irm/all/tags/action",
                        "params": JSON.stringify(params),
                        "userId": userId
                    });
                    defe.done(function () {
                        $scope.getTagsGroup();
                    });
                    defe.fail(function (data) {
                        exceptionService.doException(data);
                    });
                };

            }
        ];

        var manageTagApp = angular.module("localManageTagApp", ['framework']);
        manageTagApp.service("camel", httpService);
        manageTagApp.controller("local.manageTag.ctrl", manageTagCtrl);
        return manageTagApp;
    }
);
