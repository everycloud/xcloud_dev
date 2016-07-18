define([
        'jquery',
        'tiny-lib/angular',
        "app/services/httpService",
        "app/services/exceptionService",
        "tiny-widgets/Window",
		"tiny-widgets/Message",
        "fixtures/labelFixture"
    ],
    function ($, angular, http, Exception, Window,Message) {
        "use strict";
        var labelDetailCtrl = ['$scope', 'camel', '$compile',
			function ($scope, camel, $compile) {
				var exceptionService = new Exception();
				$scope.hasTagManageOperateRight = $("html").scope().user.privilege.role_role_add_option_tagHandle_value;
                var userId = $("html").scope().user.id;
                $scope.i18n = $("html").scope().i18n;
				var currentTagName = null;
				var addLabelWin = {
					"winId": "addLabelWin",
					"width": 650,
					"height": 350,
					"content-type": "url",
					"content": "app/business/tag/views/label/addLabel.html",
					"buttons": [null,
						null
					],
					"close": function (event) {
						$scope.getTags(currentTagName);
					}
				};

                var labelTableColumns = [{
                    "sTitle": $scope.i18n.cloud_term_tagName_label,
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.name);
					},
                    "sWidth": "35%",
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.cloud_term_tagValue_label,
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.value);
					},
                    "sWidth": "35%",
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.resource_term_AZ_label,
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.az);
					},
                    "sWidth": "15%",
                    "bSortable": false
                }, {
					"sTitle": $scope.i18n.common_term_operation_label,
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.name);
					},
					"sWidth": "15%",
					"bSortable": false
				}];
                $scope.labelDetailModel = {
                    "id": "labelDetailTable",
                    "data": [],
                    "columns": labelTableColumns,
                    "enablePagination": false,
                    "requestConfig": {
                        "enableRefresh": false,
                        "refreshInterval": 60000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(0)', nRow).addTitle();
                        $('td:eq(1)', nRow).addTitle();
                        //AZ详情链接
                        var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{azNum}}</a>"));
                        var scope = $scope.$new(false);
                        scope.azNum = aData.az;
                        scope.detail = function () {
                            var newWindow = new Window({
                                "winId": "azListWin",
                                "title": $scope.i18n.resource_term_Azs_label,
                                "tagName": aData.name,
                                "tagValues": aData.value,
                                "content-type": "url",
                                "buttons": null,
                                "content": "app/business/tag/views/label/azList.html",
                                "height": 400,
                                "width": 650
                            });
                            newWindow.show();
                        };
                        var node = link(scope);
                        $("td:eq(2)", nRow).html(node);

                        var optColumn = "<div>";
                        if(aData.name.indexOf("FusionManager_") == -1){
                            optColumn = "<a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto' ng-if='hasTagManageOperateRight'>"
                                + $scope.i18n.common_term_modify_button + "</a>";
                            optColumn += "<a href='javascript:void(0)' ng-click='delete()' ng-if='hasTagManageOperateRight'>"+$scope.i18n.common_term_delete_button+"</a>";
                        }
                        optColumn += "</div>";

						var optLink = $compile($(optColumn));
						var optScope = $scope.$new(false);
						optScope.edit = function () {
							addLabelWin.tagName = $.encoder.encodeForHTML(aData.name);
							addLabelWin.tagValues = $.encoder.encodeForHTML(aData.value);
							addLabelWin.title = $scope.i18n.common_term_modify_button;
							var openWin = new Window(addLabelWin);
							openWin.show();
						};
						optScope.delete = function () {
							var options = {
								type: "confirm",
								content: $scope.i18n.cloud_tag_del_info_confirm_msg,
								height: "150px",
								width: "350px",
								"buttons": [{
									label: $scope.i18n.common_term_ok_button,
									default: true,
									handler: function (event) {
										msg.destroy();
										deleteLabel(aData.name,aData.value);
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
						}
						var optNode = optLink(optScope);
						$("td:eq(3)", nRow).html(optNode);
                    }
                };

				function deleteLabel(name,value) {
					var defe = camel.delete({
						"url": {
							s: "/goku/rest/v1.5/all/tag-groups?name={name}&value={value}",
							o: {
								"name": name,
								"value": value
							}
						},
						"userId": userId
					});
					defe.done(function (response) {
						$scope.getTags(name);
					});
					defe.fail(function (data) {
						exceptionService.doException(data);
					});
				};

                //操作
                $scope.getTags = function (tagName) {
					currentTagName = tagName;
                    var defe = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/all/tags?name={name}",
                            o: {
                                "name": tagName
                            }
                        },
                        "userId": userId
                    });
                    defe.done(function (response) {
                        $scope.$apply(function () {
                            if (response && response.tags) {
                                var data = [];
                                var tagArrs = response.tags
                                for (var item in tagArrs) {
                                    if (tagArrs[item].resources && tagArrs[item].resources.availableZone) {
                                        tagArrs[item].az = tagArrs[item].resources.availableZone.length;
                                    }
                                    data.push(tagArrs[item]);
                                }
                                $scope.labelDetailModel.data = data;
                            }
                        });
                    });
                    defe.fail(function (response) {});
                };

            }
        ];
        var dependency = ['ng', 'wcc'];
        var addLabelModule = angular.module("service.label.labelDetail", dependency);
        addLabelModule.controller("service.label.labelDetail.ctrl", labelDetailCtrl);
        addLabelModule.service("camel", http);
        return addLabelModule;
    })
