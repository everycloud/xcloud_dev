define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/business/resources/services/exceptionService",
    "language/sr-rpool-exception",
    "fixtures/dataCenterFixture"],
    function ($, angular, Window, Message, constants, exceptionService, ameException) {
        "use strict";

        var regionListCtrl = ["$scope", "$compile", "camel", "$state", function ($scope, $compile, camel, $state) {

            $scope.privilege = $("html").scope().user.privilege;

            var addOperatorDom = function (dataItem, row) {

                var optTemplates = "<a href='javascript:void(0)' ng-click='delete()' style='width:auto'>"+$scope.i18n.resource_term_disassociate_button+"</a>";

                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.delete = function () {
                    var msgOptions = {
                        "type":"confirm", 
                        "title":$scope.i18n.common_term_confirm_label || "确认",
                        "content":$scope.i18n.resource_open_disassociate_info_confirm_msg || "确实要解关联该openStack实例？",
                        "width":"300",
                        "height":"200"
                    };

                    var msgBox = new Message(msgOptions);

                    var buttons = [
                        {
                            label: $scope.i18n.common_term_ok_button || '确定',
                            accessKey: 'Y',
                            majorBtn : true,
                            default: true,//默认焦点
                            handler: function (event) {//点击回调函数
                                $scope.operator.delete(dataItem.name);
                                msgBox.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button || '取消',
                            accessKey: 'N',
                            default: false,
                            handler: function (event) {
                                msgBox.destroy();
                            }
                        }
                    ];

                    msgBox.option("buttons",buttons);

                    msgBox.show();
                };

                var optDom = $compile($(optTemplates))(scope);
                $("td:eq(2)", row).html(optDom);

                // 初始化详情
                var name = "<a href='javascript:void(0)' ng-click='goToDetail()'>"+$.encoder.encodeForHTML(dataItem.name)+"</a>";
                var nameLink = $compile(name);
                var nameScope = $scope.$new();
                nameScope.name = dataItem.name;
                nameScope.goToDetail = function () {
                    $state.go("resources.regionResources.summary", {"region": dataItem.name});
                };
                var nameNode = nameLink(nameScope);
                $("td:eq(0)", row).html(nameNode);
            };


            $scope.token = undefined;

            $scope.projectId = undefined;

            $scope.regionTable = {
                caption: "",
                data: [],
                id: "regionTableId",
                columnsDraggable: true,
                enablePagination: false, //此属性设置表格是否分页
                enableFilter: false, // 此属性设置表格是否具有过滤功能.
                hideTotalRecords: true,
                showDetails: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label || "名称",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "34%"
                    },
                    {
                        "sTitle": $scope.i18n.service_term_service_label || "服务",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.endPointsStr);
                        },
                        "bSortable": false,
                        "sWidth": "34%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label || "操作",
                        "bVisible":$scope.privilege.resource_term_openStack_handle_value,
                        "bSortable":false,
                        "sWidth": "34%"
                    }
                ],
                renderRow: function (row, dataitem, index) {

                    // 增加tip属性
                    $("td:eq(0)", row).addTitle();
                    $("td:eq(1)", row).addTitle();

                    // 添加操作
                    addOperatorDom(dataitem, row);
                }
            };

            $scope.associate = {
                id: "regionAssociate_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_associate_button || "关联",
                tip: "",
                associate: function () {
                    var options = {
                        "winId": "regionAssociateWinID",
                        "title":$scope.i18n.resource_term_associateOpenstack_button || "关联OpenStack实例",
                        "content-type": "url",
                        "content": "./app/business/resources/views/openStackResource/region/regionAssociate.html",
                        "height": 560,
                        "width": 750,
                        "resizable": true,
                        "maximizable":false,
                        "minimizable": false,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operator.action("query");
                        }
                    };

                    var win = new Window(options);
                    win.show();
                }
            };

            $scope.refresh = {
                id: "regionRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button || "刷新",
                tip: "",
                click: function () {
                    $scope.operator.action("query");
                }
            };

            $scope.operator = {
                "query": function () {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.ENDPOINT_QUERY.url},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.endpoint === undefined) {
                            return;
                        }

                        // 合并数据
                        var regionsMap = {};
                        for (var index in data.endpoint) {
                            var regionName = data.endpoint[index].regionName;
                            if (regionsMap.hasOwnProperty(regionName)) {
                                regionsMap[regionName].push(data.endpoint[index]);
                            } else {
                                regionsMap[regionName] = [data.endpoint[index]];
                            }
                        }

                        var regionsList = [];
                        for (var index in regionsMap) {
                            var serviceList = "";
                            var regionServices = regionsMap[index];
                            for (var serviceIndex in regionServices) {
                                serviceList += regionServices[serviceIndex].serviceName + ";";
                            }
                            regionsList.push({"name": index, "endPoints": regionsMap[index], "endPointsStr": serviceList});
                        }

                        // 更新表格数据
                        $scope.$apply(function () {
                            $scope.regionTable.data = regionsList;
                        });
                    });
                },
                "delete":function (name) {
                    var deferred = camel.put({
                        "url": {"s": constants.rest.ENDPOINT_MODIFY.url},
                        "params": JSON.stringify({"regions":[{"name":name,"status":"UNMANAGED"}]}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.operator.action("query");
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data, ameException);
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

                        if (type == "query") {
                            $scope.operator.query();
                        } else {
                            // do nothing
                        }
                    });
                }
            };

            $scope.init = function() {
                $scope.operator.action("query");
            };

            $scope.init();
        }];

        return regionListCtrl;
    });
