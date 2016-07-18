define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    'app/services/exceptionService',
    "fixtures/dataCenterFixture"],
    function ($, angular, Window, Message, constants, Exception) {
        "use strict";

        var imageListCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            var exceptionService = new Exception();

            var addOperatorDom = function (dataItem, row) {
                var submenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                    '<li><a href="javascript:void(0)" ng-if="data.fileStatus=='+"'empty'"+' && data.status =='+"'active'"+' && data.status !='+"'processing'"+'" ng-click="export()">'+$scope.i18n.common_term_sync_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="data.fileStatus!='+"'empty'"+' || data.status !='+"'active'"+' || data.status =='+"'processing'"+'">'+$scope.i18n.common_term_sync_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-if="data.fileStatus=='+"'success'"+'" ng-click="downLoad()">'+$scope.i18n.common_term_download_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="data.fileStatus!='+"'success'"+'">'+$scope.i18n.common_term_download_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-if="data.fileStatus=='+"'success'"+'" ng-click="clear()">'+$scope.i18n.common_term_clear_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="data.fileStatus!='+"'success'"+'">'+$scope.i18n.common_term_clear_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-click="delete()">'+$scope.i18n.common_term_delete_button+'</a></li>' +
                    '</ul>' +
                    '</span>';

                var optTemplates = "<a href='javascript:void(0)' ng-click='modify()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_modify_button+"</a>" + submenus + "</div>";

                var scope = $scope.$new(false);
                scope.data = dataItem;
                if (dataItem["file_name"] == undefined
                    || dataItem["file_name"] == ""
                    || dataItem["file_name"][0] == "*") {
                    scope.data.fileStatus = "empty";
                } else if (dataItem["file_name"][0] == "#") {
                    scope.data.fileStatus = "processing";
                } else if (dataItem["file_name"] != "false") {
                    scope.data.fileStatus = "success";
                } else {
                    scope.data.fileStatus = "failed";
                }
                scope.modify = function () {
                    modifyWindow(dataItem.id);
                };
                scope.export = function () {
                    $scope.operator.export(dataItem.id, dataItem["file_name"]);
                };
                scope.downLoad = function () {
                    $scope.operator.downLoad(dataItem.id, dataItem["file_name"]);
                };
                scope.clear = function () {
                    $scope.operator.clear(dataItem.id, dataItem["file_name"]);
                };
                scope.delete = function () {
                    var msgOptions = {
                        "type":"confirm", 
                        "title":$scope.i18n.common_term_confirm_label,
                        "content":$scope.i18n.resource_image_delImage_info_confirm_msg || "确实要删除该镜像吗？",
                        "width":"300",
                        "height":"200"
                    };

                    if (dataItem.status == "saving") {
                        msgOptions.content = $scope.i18n.resource_image_del_info_confirm_msg;
                    }

                    var msgBox = new Message(msgOptions);

                    var buttons = [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            accessKey: 'Y',
                            majorBtn : true,
                            default: true,
                            handler: function (event) {
                                $scope.operator.action("delete", dataItem.id, dataItem["file_name"]);
                                msgBox.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
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
                $("td:eq(7)", row).html(optDom);
                optDom.filter('.dropdown').dropdown();
            };

            var createWindow = function () {
                var options = {
                    "winId": "createImageWinID",
                    "serviceID": $scope.serviceID,
                    "serviceUrl": $scope.serviceUrl,
                    "token": $scope.token,
                    "title":$scope.i18n.resource_term_createImage_button,
                    "content-type": "url",
                    "content": "./app/business/resources/views/openStackResource/image/createImage.html",
                    "height": 550,
                    "width": 700,
                    "resizable": true,
                    "maximizable": false,
                    "minimizable": false,
                    "buttons": null,
                    "beforeClose":function() {
                        try {
                            var scope = $("#create-image-window").scope();
                            scope.clearTimer();
                        } catch(e) {
                        }

                    },
                    "close": function (event) {
                        $scope.operator.action("query");
                    }
                };

                var win = new Window(options);

                win.show();
            };

            var modifyWindow = function (id) {
                var options = {
                    "winId": "modifyImageWinID",
                    "imageID": id,
                    "title":$scope.i18n.resource_term_modifyImage_button,
                    "serviceID": $scope.serviceID,
                    "serviceUrl": $scope.serviceUrl,
                    "token": $scope.token,
                    "content-type": "url",
                    "content": "./app/business/resources/views/openStackResource/image/modifyImage.html",
                    "height": 400,
                    "width": 600,
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

            $scope.token = undefined;

            $scope.currentItem = undefined;

            $scope.imageTable = {
                caption: "",
                data: [],
                id: "imageTableId",
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
                        "sWidth": "30"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,//设置第一列的标题
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "ID",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_diskFormat_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.disk_format);
                        },
                        "bSortable":false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_diskMinGB_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.min_disk);
                        },
                        "bSortable":false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_memMinMB_label || "最小内存(MB)",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.min_ram);
                        },
                        "bSortable":false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label || "操作",
                        "bSortable": false,
                        "sWidth": "15%"
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

            //查询信息
            var searchInfo = {
                "markers": [],
                "limit": 10
            };

            //向前翻页
            $scope.prePage = function () {
                if(!$scope.hasPrePage){
                    return;
                }
                searchInfo.markers.pop();
                if(searchInfo.markers.length == 0){
                    $scope.hasPrePage = false;
                }
                $scope.operator.action("query");
            };

            //向后翻页
            $scope.nextPage = function () {
                if(!$scope.hasNextPage){
                    return;
                }
                searchInfo.markers.push($scope.imageTable.data[searchInfo.limit -1].id);
                $scope.hasPrePage = true;
                $scope.operator.action("query");
            };

            //页尺寸选择框
            $scope.sizeSelector = {
                "id": "searchSizeSelector",
                "width": "80",
                "values": [
                    {
                        "selectId": "10",
                        "label": "10",
                        "checked": true
                    },
                    {
                        "selectId": "20",
                        "label": "20"
                    },
                    {
                        "selectId": "50",
                        "label": "50"
                    }
                ],
                "change":function(){
                    searchInfo.limit = $("#" + $scope.sizeSelector.id).widget().getSelectedId();
                    searchInfo.markers = [];
                    $scope.hasPrePage = false;
                    $scope.operator.action("query");
                }
            };


            $scope.refresh = {
                id: "imageRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button || "刷新",
                tip: "",
                click: function () {
                    $scope.operator.action("query");
                }
            };

            $scope.create = {
                id: "imageCreate_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_register_button || "注册",
                tip: "",
                create: function () {
                    "use strict";
                    createWindow();
                }
            };

            $scope.searchGlance = {
                "id": "searchGlance",
                "width": "150",
                "values": [],
                "change": function () {
                    var serviceName = $("#searchGlance").widget().getSelectedId();
                    for (var index in $scope.glanceServices) {
                        if ($scope.glanceServices[index].regionName == serviceName) {
                            $scope.serviceID = $scope.glanceServices[index].id;
                            $scope.serviceUrl = $scope.glanceServices[index].serviceUrl;
                            break;
                        }
                    }

                    $scope.operator.action("query");
                }
            };

            $scope.freeCapacity = "";

            $scope.operator = {
                "query": function () {
                    // 查询磁盘空间
                    $scope.operator.queryDisk();

                    // 配置翻页条件
                    var params = {
                        "limit": searchInfo.limit
                    };

                    if(searchInfo.markers.length > 0){
                        params.marker = searchInfo.markers[searchInfo.markers.length - 1];
                    }

                    var deferred = camel.get({
                        "url": {"s": constants.rest.IMAGE_QUERY.url, "o": {"service_id": $scope.serviceID}},
                        "params":params,
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.images === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            if(data.images.length < searchInfo.limit || !data.next){
                                $scope.hasNextPage = false;
                            }
                            else{
                                $scope.hasNextPage = true;
                            }

                            // 详情配置
                            for (var index in data.images) {
                                data.images[index].detail = {
                                    contentType: "url", 
                                    content: "app/business/resources/views/openStackResource/image/imageDetail.html"
                                };
                            }

                            // 获取数据
                            $scope.imageTable.data = data.images;
                        });
                    });
                },
                "delete": function (id, fileName) {
                    var deferredDelete = camel.delete({
                        "url": {"s": constants.rest.IMAGE_DELETE.url, "o": {"service_id": $scope.serviceID, "id": id}},
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
                        exceptionService.doException(data, null);
                    });
                },
                "export":function (id, fileName) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.IMAGE_EXPORT.url, "o": {"id": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                            request.setRequestHeader("X-Endpoint", $scope.serviceUrl);
                            request.setRequestHeader("X-File-Name", fileName);
                        }
                    });
                    deferred.success(function (data) {
                        $scope.operator.query();
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data, null);
                    });
                },
                "downLoad":function (id, fileName) {
                    $("#image-down").attr("src", "/goku/rest/v1.5/file/" + encodeURIComponent(fileName) + "?type=export");
                    $scope.operator.clear(id, fileName);
                },
                "clear":function (id, fileName) {
                    var deferred = camel.delete({
                        "url": {"s": constants.rest.IMAGE_CLEAR.url, "o": {"id": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                            request.setRequestHeader("X-Endpoint", $scope.serviceUrl);
                            request.setRequestHeader("X-File-Name", fileName);
                        }
                    });
                    deferred.success(function (data) {
                        $scope.operator.query();
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data, null);
                    });
                },
                "action":function (type, id, fileName) {
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
                            $scope.operator.delete(id, fileName);
                        } else {
                            // do nothing
                        }
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data, null);
                    });
                },
                "queryDisk":function () {

                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/sr/repository",
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });

                    deferred.success(function (data) {
                        $scope.$apply(function() {
                            $scope.freeCapacity = data;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data, null);
                    });
                }
            };

            // glance服务
            $scope.glanceServices = [];

            $scope.init = function () {

                // 查询服务ID
                var deferred = camel.get({
                    "url": {"s": constants.rest.ENDPOINT_QUERY.url},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    if (data === undefined || data.endpoint === undefined) {
                        return;
                    }

                    // 获取所有glance服务
                    for (var index in data.endpoint) {
                        if (data.endpoint[index] && data.endpoint[index].serviceName == "glance") {
                            $scope.glanceServices.push(data.endpoint[index]);
                        }
                    }

                    // 构造glance服务下拉框
                    var glanceList = [];
                    for (var index in $scope.glanceServices) {
                        glanceList.push({
                            "selectId": $scope.glanceServices[index].regionName,
                            "label": $scope.glanceServices[index].regionName,
                            "checked" : index == 0
                        });

                        if (index == 0) {
                            $scope.serviceID = $scope.glanceServices[index].id;
                            $scope.serviceUrl = $scope.glanceServices[index].serviceUrl;
                        }
                    }
                    $scope.$apply(function () {
                        $scope.searchGlance.values = glanceList;
                    });

                    if ($scope.serviceID != undefined) {
                        // 查询token
                        $scope.operator.action("query");
                    }
                });
            };

            // 初始化操作
            $scope.init();
        }];

        return imageListCtrl;
    });
