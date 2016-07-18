/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Select",
    "tiny-widgets/Window",
	"tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Select, Window,Message, UnifyValid, Exception) {
        "use strict";

        var addAzCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "validator",
            function ($scope, $compile, $state, $stateParams, camel, validator) {
                var exceptionService = new Exception();
                var user = $("html").scope().user;
                $scope.stepUrl = {
                    "step1": "../src/app/business/resources/views/rpool/zone/zoneResources/availableZone/addAzBasicInfo.html",
                    "step2": "../src/app/business/resources/views/rpool/zone/zoneResources/availableZone/addAzClusterConfig.html",
                    "step3": "../src/app/business/resources/views/rpool/zone/zoneResources/availableZone/addAzConfirm.html"
                };
                $scope.currentStep = "basicInfo";
                $scope.addStep = {
                    "id": "addAvailableZoneStep",
                    "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.virtual_term_clusterSet_button, $scope.i18n.common_term_confirmInfo_label],
                    "width": "500",
                    "jumpable": false
                };
                var zoneId = $stateParams.zoneId;

                var selectedCluster = [];
                var model = {
                    "availableZone": {
                        "zoneId": zoneId,
                        "resources": {

                        }
                    }
                };

                //虚拟化环境信息页面
                //名称输入框
                $scope.nameTextbox = {
                    "label": $scope.i18n.common_term_name_label+":",
                    "require": true,
                    "id": "addAzNameTextbox",
                    "value": "",
                    "validate": "required:"+$scope.i18n.common_term_null_valid+
                        ";maxSize(128):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"})+
                        ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition2_valid
                };
                //描述输入框
                $scope.descTextbox = {
                    "label": $scope.i18n.common_term_desc_label+":",
                    "require": false,
                    "id": "addAzDescTextbox",
                    "value": "",
                    "height": "50px",
                    "type": "multi",
                    "validate": "maxSize(1024):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"1024"})
                };
                //添加标签按钮
                $scope.addTagButton = {
                    "id": "addTagButton",
                    "text": $scope.i18n.common_term_add_button,
                    "click": function () {
						if(!isCanAdd()){
							return;
						}
						var mData = {
							"name":"addLabel"
						};
						$("#" + $scope.tagTable.id).widget().addTableRows(mData);
                    }
                };

                //标签列表
                $scope.tagTable = {
                    "id": "azTagTable",
                    "data": [],
                    "enablePagination": false,
                    "columnsDraggable": true,
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
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_operation_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
						$(nRow).attr("tagName","addLabel");
						$(nRow).attr("tagValue","addLabel");
						var optColumn = '';
						if (aData.name === 'addLabel') {
							var slt2 = new Select({
								"id": "valueSelect_" + iDataIndex,
								"width": "200px",
								"values": [],
								"change":function(){
									$(nRow).attr("tagValue",slt2.getSelectedId());
								}
							});

							var slt1 = new Select({
								"id": "nameSelect_" + iDataIndex,
								"width": "200px",
								"values": getTagsSelectNameData()
							});
							slt1.on("change", function () {
								slt2.option("values", getTagsSelectValueData(slt1.getSelectedId()));
								$(nRow).attr("tagName",slt1.getSelectedId());
							});
							$('td:eq(0)', nRow).html(slt1.getDom());

							//标签值下拉框
							$('td:eq(1)', nRow).html(slt2.getDom());

							optColumn = "<a href='javascript:void(0)' ng-click='deleteSave()'>" + $scope.i18n.common_term_delete_button + "</a>";
						}
						var optLink = $compile($(optColumn));
						var optScope = $scope.$new();
						optScope.deleteSave = function () {
							$("#" + $scope.tagTable.id).widget().deleteTableRow(nRow,null,true);
						};
						var optNode = optLink(optScope);
						$("td:eq(2)", nRow).html(optNode);
					}
                };

				function isCanAdd(){
					//如果已经没有可添加的标签则不能添加
					if(!hasLabel()){
						var options = {
							type: "prompt",
							content: $scope.i18n.virtual_cluster_addTag_info_allTagAdded_msg || "所有标签均已添加，无其他可用标签。",
							height: "60px",
							width: "300px"
						};
						var msg = new Message(options);
						msg.show();
						return false;
					}
					var tableData =  $("#" + $scope.tagTable.id).widget().getTableData();
					if(tableData.length === 0){
						return true;
					}
					var tagObj = $("tr[tagname][tagvalue]",$("#" + $scope.tagTable.id).widget().getDom());
					for(var i=0;i<tagObj.length;i++){
						var value = $(tagObj[i]).attr("tagvalue");
						var name = $(tagObj[i]).attr("tagname");
						if (name === "addLabel" || value === "addLabel") {
							return false;
						}
					}
					return true;
				}

				function getNewTag(){
					var dd = [];
					var tagObj = $("tr[tagname][tagvalue]",$("#" + $scope.tagTable.id).widget().getDom());
					for(var i=0;i<tagObj.length;i++){
						var value = $(tagObj[i]).attr("tagvalue");
						var name = $(tagObj[i]).attr("tagname");
						if (name === "addLabel" || value === "addLabel") {
							continue;
						}
						dd.push({"name": name, "value": value});
					}
					return dd;
				}
				//此标签是否已添加过
				function isTagNameAdded(label){
					var tagObj = $("tr[tagname][tagvalue]",$("#" + $scope.tagTable.id).widget().getDom());
					for(var i=0;i<tagObj.length;i++){
						var name = $(tagObj[i]).attr("tagname");
						if (name === label) {
							return true;
						}
					}
					return false;
				}
				//是哦否还有课添加的标签
				function hasLabel(){
					var flag = false;
					for(var i=0;i<$scope.TAG_KEYS.length;i++){
						var l = $scope.TAG_KEYS[i].label;
						if(isTagNameAdded(l)){
							continue;
						}
						flag = true;
					}
					return flag;
				}

                //下一步按钮
                $scope.infoNextButton = {
                    "id": "addInfoNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#addAzInfoDiv"));
                        if (!result) {
                            return;
                        }
                        model.availableZone.name = $("#" + $scope.nameTextbox.id).widget().getValue();
                        $scope.name = model.availableZone.name;
                        model.availableZone.description = $("#" + $scope.descTextbox.id).widget().getValue();
                        $scope.desc = model.availableZone.description;
                        $("#" + $scope.addStep.id).widget().next();
                        $scope.currentStep = "clusterConfig";
                    }
                };
                //取消按钮
                $scope.infoCancelButton = {
                    "id": "addInfoCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };

                //集群配置页面
                //添加集群按钮
                $scope.addClusterButton = {
                    "id": "addClusterButton",
                    "text": $scope.i18n.resource_term_addCluster_button,
                    "click": function () {
                        addClusterWindow();
                    }
                };
                //集群列表
                $scope.clusterTable = {
                    "id": "clusterTable",
                    "data": null,
                    "enablePagination": false,
                    "columnsDraggable": true,
                    "columns": [
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_type_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.type);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_domain_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.domain);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.hypervisorName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_operation_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        // 操作列
                        var optColumn = "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>";
                        var optLink = $compile($(optColumn));
                        var optScope = $scope.$new();
                        optScope.delete = function () {
                            selectedCluster.splice(iDataIndex, 1);
                            $("#" + $scope.clusterTable.id).widget().option("data", selectedCluster);
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(5)", nRow).html(optNode);
                    }
                };
                //上一步按钮
                $scope.clusterPreButton = {
                    "id": "clusterPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().pre();
                        $scope.currentStep = "basicInfo";
                    }
                };
                //下一步按钮
                $scope.clusterNextButton = {
                    "id": "clusterNextButton",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().next();
                        $scope.currentStep = "confirm";

						var tagData = getNewTag();
						$scope.confirmTagTable.data = tagData;
                        $scope.confirmClusterTable.data = selectedCluster;
                    }
                };

                //取消按钮
                $scope.clusterCancelButton = {
                    "id": "clusterCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };
                function addClusterWindow() {
                    var newWindow = new Window({
                        "winId": "addClusterWindow",
                        "title": $scope.i18n.resource_term_addCluster_button,
                        "zoneId": zoneId,
                        "selectedCluster": selectedCluster,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/rpool/zone/zoneResources/availableZone/addCluster.html",
                        "height": 500,
                        "width": 750,
                        "close": function () {
                            $("#" + $scope.clusterTable.id).widget().option("data", selectedCluster);
                        }
                    });
                    newWindow.show();
                }

                //确认页面
                $scope.confirmLabel = {
                    "name": $scope.i18n.common_term_name_label+":",
                    "desc": $scope.i18n.common_term_desc_label+":",
                    "tag": $scope.i18n.cloud_term_tag_label+":",
                    "cluster": $scope.i18n.virtual_term_clusters_label+":"
                };
                //标签列表
                $scope.confirmTagTable = {
                    "id": "confirmTagTable",
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
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {

                    }
                };
                //集群表格
                $scope.confirmClusterTable = {
                    "id": "confirmClusterTable",
                    "data": null,
                    "enablePagination": false,
                    "columnsDraggable": true,
                    "columns": [
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_type_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.type);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_domain_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.domain);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.hypervisorName);
                            },
                            "bSortable": false
                        }
                    ]
                };
                //上一步按钮
                $scope.confirmPreButton = {
                    "id": "confirmPreButton",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().pre();
                        $scope.currentStep = "clusterConfig";
                    }
                };
                //添加按钮
                $scope.confirmAddButton = {
                    "id": "confirmAddButton",
                    "text": $scope.i18n.common_term_add_button,
                    "click": function () {
                        addAz();
                    }
                };
                //取消按钮
                $scope.confirmCancelButton = {
                    "id": "confirmCancelButton",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goBack();
                    }
                };
                function addAz() {
                    var resourceCluster = [];
                    for (var i = 0; i < selectedCluster.length; i++) {
                        resourceCluster.push(selectedCluster[i].id);
                    }
                    model.availableZone.resources.resourceCluster = resourceCluster;
					model.availableZone.tags = getNewTag();
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/availablezones"},
                        "params": JSON.stringify(model),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        goBack();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

				function initTag(){
						getAllTagsGroup();
				}

				function getAllTagsGroup() {
					var defe = camel.get({
						"url": "/goku/rest/v1.5/irm/1/tag-groups",
						"userId": user.id
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
				}

				function getTagsSelectNameData() {
					var arr = [];
					for(var i=0;i<$scope.TAG_KEYS.length;i++){
						var l = $scope.TAG_KEYS[i].label;
						if(isTagNameAdded(l)){
							continue;
						}
						arr.push($scope.TAG_KEYS[i]);
					}
					return arr;
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
				//是否存在为
				function isExistUnSave() {
					var tableData = $("#azTagTable").widget();
					var data = tableData.option("data");
					var vs = [];
					if (data) {
						for (var i = 0; i < data.length; i++) {
							if (data[i].isTempSave) {
								return true;
							}
						}
					}
					return false;
				}
                function goBack(){
                    $state.go("resources.zoneResources.availableZone", {id: zoneId,name:$stateParams.zoneName});
                }
				initTag();
            }];
        return addAzCtrl;
    }
);