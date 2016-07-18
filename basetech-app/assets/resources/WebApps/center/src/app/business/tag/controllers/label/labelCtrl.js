define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/labelFixture"
], function ($, angular, Window, Message, Exception) {
    "use strict";

    var labelCtrl = ["$scope", "$compile", "camel", "$rootScope",
        function ($scope, $compile, camel, $rootScope) {
			$scope.hasTagManageOperateRight = $rootScope.user.privilege.role_role_add_option_tagHandle_value;

            var userId = $("html").scope().user.id;
            var exceptionService = new Exception();
            $scope.deployMode = $("html").scope().deployMode;
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
                    $scope.operate.init();
                }
            };

            //搜索模型
            $scope.searchModel = {
                "name": "",
                "curpage": 1,
                "start": 0,
                "limit": 10
            };

            $scope.addLabelModel = {
                "id": "addLabelModelId",
                "text": $scope.i18n.common_term_create_button,
                "click": function () {
                    addLabelWin.tagName = null;
                    addLabelWin.tagValues = null;
                    addLabelWin.title = $scope.i18n.common_term_create_button;
                    var openWin = new Window(addLabelWin);
                    openWin.show();
                }
            };
            var labelTableColumns = [{
                "sTitle": "",
                "sWidth": "10px",
				"mData": function (data) {
					return $.encoder.encodeForHTML(data.detail);
				},
                "bSearchable": false,
                "bSortable": false
            }, {
                "sTitle": $scope.i18n.cloud_term_tagName_label,
				"mData": function (data) {
					return $.encoder.encodeForHTML(data.name);
				},
                "sWidth": "30px",
                "bSortable": true
            }, {
                "sTitle": $scope.i18n.cloud_term_tagValue_label,
				"mData": function (data) {
					return $.encoder.encodeForHTML(data.values);
				},
                "sWidth": "40px",
                "bSortable": false
            }, {
                "sTitle": $scope.i18n.resource_term_AZ_label,
				"mData": function (data) {
					return $.encoder.encodeForHTML(data.az);
				},
                "sWidth": "20px",
                "bSortable": false
            }, {
                "sTitle": $scope.i18n.common_term_operation_label,
				"mData": function (data) {
					return $.encoder.encodeForHTML(data.operation);
				},
                "sWidth": "20px",
                "bSortable": false
            }];
            $scope.labelTableModel = {
                "id": "labelTable",
                "data": [],
                "columns": labelTableColumns,
                "paginationStyle": "full_numbers",
                "enablePagination": true,
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "hideTotalRecords": false,
                "columnsDraggable": true,
				"curPage": {
				},
                "columnSorting": [
                    [1, 'asc'],
                    [2, 'asc'],
                    [3, 'asc']
                ],
                "showDetails": true,
                "callback": function (pageInfo) {
                    $scope.searchModel.curpage = pageInfo.currentPage;
                    $scope.searchModel.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    $scope.operate.init();
                },
                "changeSelect": function (pageInfo) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.curpage = 1;
                    $scope.searchModel.limit = pageInfo.displayLength;
                    $scope.operate.init();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    //列表的下钻详情处理
                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);

                    $(nRow).attr("lineNum", $.encoder.encodeForHTML(iDataIndex));
                    $(nRow).attr("tagName", $.encoder.encodeForHTML(aData.name));

                    //AZ详情链接
                    var link = $compile("<a href='javascript:void(0)' ng-click='detail()'>" + $.encoder.encodeForHTML(aData.az) + "</a>");
                    var scope = $scope.$new(false);
                    scope.detail = function () {
                        var newWindow = new Window({
                            "winId": "azListWin",
                            "title": $scope.i18n.resource_term_Azs_label,
                            "tagName": aData.name,
                            "tagValues": aData.values,
                            "content-type": "url",
                            "buttons": null,
                            "content": "app/business/tag/views/label/azList.html",
                            "height": 400,
                            "width": 650
                        });
                        newWindow.show();
                    };
                    var node = link(scope);
                    $("td:eq(3)", nRow).html(node);

					if(aData.name.indexOf("FusionManager_") != -1){
						return;
					}

                    var optColumn = "<div>" ;
                    if ($scope.deployMode != 'local') {
                        optColumn += "<a href='javascript:void(0)' ng-click='delete()' ng-if='hasTagManageOperateRight'>"+$scope.i18n.common_term_delete_button+"</a>";
                    }
                    optColumn += "</div>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
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
                                    $scope.operate.deleteLabel(aData.name);
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
                    $("td:eq(4)", nRow).html(optNode);
                }
            };
            //搜索框
            $scope.searchBox = {
                "id": "labelSearchBox",
                "placeholder": $scope.i18n.cloud_term_findTag_prom,
                "type": "round", // round,square,long
                "width": "200",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {},
                "search": function (searchString) {
                    $scope.searchModel.name = '';
                    $scope.searchModel.name = searchString;
                    $scope.searchModel.start = 0;
                    $scope.searchModel.curpage = 1;
                    $scope.operate.init();
                }
            };

            //操作
            $scope.operate = {
                "deleteLabel": function (name) {
                    var defe = camel.delete({
                        "url": {
                            s: "/goku/rest/v1.5/all/tag-groups?name={name}",
                            o: {
                                "name": name
                            }
                        },
                        "userId": userId
                    });
                    defe.done(function (response) {
                        $scope.operate.init();
                    });
                    defe.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "init": function () {
                    var defe = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/all/tag-groups?start={start}&limit={limit}&name={name}",
                            o: {
                                "start": $scope.searchModel.start,
                                "limit": $scope.searchModel.limit,
                                "name": $scope.searchModel.name
                            }
                        },
                        "userId": userId
                    });
                    defe.done(function (response) {
                        $scope.$apply(function () {
                            $scope.labelTableModel.data = [];
                            if (response && response.tagGroups) {
                                var data = [];
                                var tagArrs = response.tagGroups
                                for (var item in tagArrs) {
                                    tagArrs[item].detail = {
                                        contentType: "url",
                                        content: "app/business/tag/views/label/labelDetail.html"
                                    };
                                    if (tagArrs[item].resources && tagArrs[item].resources.availableZone) {
                                        tagArrs[item].az = tagArrs[item].resources.availableZone.length;
                                    }
                                    tagArrs[item].values = tagArrs[item].values.join(";");
                                    data.push(tagArrs[item]);
                                }
                                $scope.labelTableModel.data = data;
                                $scope.labelTableModel.totalRecords = response.total;
                            }
                        });
                        if ($("#" + $scope.labelTableModel.id).widget()) {
                            $("#" + $scope.labelTableModel.id).widget().option("total-records", response.total);
                            $("#" + $scope.labelTableModel.id).widget().option("cur-page", {
                                "pageIndex": $scope.searchModel.curpage
                            });
                            $("#" + $scope.labelTableModel.id).widget().option("display-length", $scope.searchModel.limit);
                        }
                    });
                    defe.fail(function (data) {});
                }
            };
            $scope.operate.init();
        }
    ];
    return labelCtrl;
});
