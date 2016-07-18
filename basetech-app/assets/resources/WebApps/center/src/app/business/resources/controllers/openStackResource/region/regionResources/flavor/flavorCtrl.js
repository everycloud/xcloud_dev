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

        var flavorListCtrl = ["$scope", "$compile", "camel","$stateParams", function ($scope, $compile, camel, $stateParams) {

            var addOperatorDom = function (dataItem, row) {

                var submenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                    "<li><a href='javascript:void(0)'ng-click='addExtra()'>"+$scope.i18n.device_term_setStartMode_button+"</a></li>" +
                    "<li><a href='javascript:void(0)'ng-click='addSlaExtra()'>"+($scope.i18n.cloud_term_manageTag_button || "管理标签")+"</a></li>" +
                    '</ul>' +
                    '</span>';

                var optTemplates = "<a href='javascript:void(0)'ng-click='delete()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_delete_button+"</a>" + submenus;


                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.addExtra = function () {
                    createExtraWindow(dataItem.id);
                };
                scope.addSlaExtra = function() {
                    createSlaExtraWindow(dataItem.id);
                };
                scope.delete = function () {
                    var msgOptions = {
                        "type":"confirm", 
                        "title":$scope.i18n.common_term_confirm_label || "确认",
                        "content":$scope.i18n.spec_vm_del_info_confirm_msg || "确实要删除该虚拟机规格吗？",
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
                                $scope.operator.action("delete", dataItem.id);
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
                $("td:eq(8)", row).html(optDom);
                optDom.filter('.dropdown').dropdown();
            };

            var createWindow = function () {
                var options = {
                    "winId": "createFlavorWinID",
                    "serviceID": $scope.serviceID,
                    "serviceUrl": $scope.serviceUrl,
                    "title":$scope.i18n.spec_term_createVMspec_button || "创建虚拟机规格",
                    "content-type": "url",
                    "content": "./app/business/resources/views/openStackResource/region/regionResources/flavor/createFlavor.html",
                    "height": 400,
                    "width": 580,
                    "resizable": true,
                    "maximizable": false,
                    "minimizable": false,
                    "buttons": null,
                    "close": function (event) {
                        $scope.operator.action("query");
                    }
                };

                var win = new Window(options);
                win.show();
            };

            var createExtraWindow = function (id) {
                var options = {
                    "winId": "createFlavorExtraWinID",
                    "serviceID": $scope.serviceID,
                    "flavorID": id,
                    "title":$scope.i18n.device_term_setStartMode_button || "设置启动方式",
                    "content-type": "url",
                    "content": "./app/business/resources/views/openStackResource/region/regionResources/flavor/createFlavorExtra.html",
                    "height": 200,
                    "width": 400,
                    "resizable": true,
                    "maximizable": false,
                    "minimizable": false,
                    "buttons": null,
                    "close": function (event) {
                        $scope.operator.action("query");
                    }
                };

                var win = new Window(options);
                win.show();
            };

            var createSlaExtraWindow = function (id) {
                var options = {
                    "winId": "createSlaExtraWinID",
                    "serviceID": $scope.serviceID,
                    "flavorID": id,
                    "title":$scope.i18n.cloud_term_manageTag_button || "管理标签",
                    "content-type": "url",
                    "content": "./app/business/resources/views/openStackResource/region/regionResources/flavor/createSlaExtra.html",
                    "height": 450,
                    "width": 650,
                    "resizable": true,
                    "maximizable": false,
                    "minimizable": false,
                    "buttons": null,
                    "close": function (event) {
                        $scope.operator.action("query");
                    }
                };

                var win = new Window(options);
                win.show();
            };

            $scope.serviceID = undefined;

            $scope.serviceUrl = undefined;

            $scope.token = undefined;

            $scope.flavorTable = {
                caption: "",
                data: [],
                id: "flavorTableId",
                columnsDraggable: true,
                enablePagination: false, //此属性设置表格是否分页
                enableFilter: false, // 此属性设置表格是否具有过滤功能.
                hideTotalRecords: true,
                showDetails: true,
                columns: [
                    {
                        "sTitle": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "40px"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label || "名称",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": "ID",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "vCpu",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.vcpus);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_memoryMB_label || "内存(MB)",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.ram);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_rootDiskGB_label || "根磁盘(GB)",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.disk);
                        },
                        "bSortable":false
                    },
                    {
                        "sTitle": $scope.i18n.template_term_tempDiskGB_label || "临时磁盘(GB)",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data["OS-FLV-EXT-DATA:ephemeral"]);
                        },
                        "bSortable":false
                    },
                    {
                        "sTitle": $scope.i18n.spec_term_exchangeDiskMB_label || "交换盘空间(MB)",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.swap);
                        },
                        "bSortable":false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label || "操作",
                        "bSortable": false
                    }
                ],
                renderRow: function (row, dataitem, index) {

                    $("td:eq(0)", row).bind("click", function () {
                        $scope.currentItem = dataitem;
                    });

                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(2)", row).addTitle();

                    // 添加操作
                    addOperatorDom(dataitem, row);
                }
            };

            $scope.currentItem = undefined;

            $scope.refresh = {
                id: "flavorRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button || "刷新",
                tip: "",
                click: function () {
                    $scope.operator.action("query");
                }
            };

            $scope.create = {
                id: "flavorCreate_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_create_button || "创建",
                tip: "",
                create: function () {
                    "use strict";
                    createWindow();
                }
            };



            $scope.showNoDeleteMessage = function(){
                var msgOptions = {
                    "type":"warn",
                    "title":$scope.i18n.common_term_confirm_label || "确认",
                    "content":$scope.i18n.template_vm_del_info_used_msg ||"该虚拟机规格已用于虚拟机的创建，不允许删除！",
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
                        handler: function (event) {
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



            $scope.operator = {
                "query": function () {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.FLAVOR_QUERY.url, "o": {"service_id": $scope.serviceID, "tenant_id": $scope.projectId}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.flavors === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            // 获取数据
                            for (var index in data.flavors) {
                                data.flavors[index].detail = {
                                    contentType: "url",
                                    content: "app/business/resources/views/openStackResource/region/regionResources/flavor/flavorDetail.html"
                                };
                            }
                            $scope.flavorTable.data = data.flavors;
                        });
                    });
                },
                "delete": function (id) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.VM_SPEC_CHECKDELETE.url + "?all_tenants={all_tenants}&limit={limit}&flavor={flavor}",
                            "o": {"all_tenants": 1, "limit": 1, "flavor": id, "service_id": $scope.serviceID, "tenant_id": $scope.projectId}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        if (data && data.servers && data.servers.length > 0) {
                            //该规格已经被用来创建虚拟机，不允许删除
                            $scope.showNoDeleteMessage();
                            return;
                        }
                        else {
                            //虚拟机规格没有用来创虚拟机，允许删除
                            var deferredDelete = camel.delete({
                                "url": {"s": constants.rest.FLAVOR_DELETE.url, "o": {"service_id": $scope.serviceID, "id": id, "tenant_id": $scope.projectId}},
                                "userId": $("html").scope().user && $("html").scope().user.id,
                                "beforeSend": function (request) {
                                    request.setRequestHeader("X-Auth-Token", $scope.token);
                                }
                            });
                            deferredDelete.success(function (data) {
                                // 刷新页面
                                $scope.operator.query();
                            });
                            deferredDelete.fail(function (data) {
                                exceptionService.doException(data, ameException);
                            });

                        }
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data, ameException);
                    });
                },
                "action":function (type, id) {
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
                        } else if (type == "delete") {
                            $scope.operator.delete(id);
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
                var deferred = camel.get({
                    "url": {"s": constants.rest.ENDPOINT_QUERY.url},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    if (data === undefined || data.endpoint === undefined) {
                        return;
                    }

                    for (var index in data.endpoint) {
                        var regionName = data.endpoint[index].regionName;
                        if (data.endpoint[index].regionName == $stateParams.region
                            && data.endpoint[index].serviceName == "nova") {
                            $scope.serviceID = data.endpoint[index].id;
                            $scope.serviceUrl = data.endpoint[index].serviceUrl;
                            break;
                        }
                    }

                    // 打开时请求数据
                    if ($scope.serviceID != undefined) {
                        $scope.operator.action("query");
                    }
                });
            };

            $scope.init();
        }];

        return flavorListCtrl;
    });
