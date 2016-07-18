define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    'app/services/exceptionService','fixtures/templateFixture'],
    function ($, angular, Window, Message, constants, Exception) {
        "use strict";

        var vmSpecListCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            var exceptionService = new Exception();

            $scope.privilege = $("html").scope().user.privilege;

            $scope.searchModel = {
                name:"",
                start: "0",
                limit: "10"
            };

            // 存储当前点击展开的详情
            $scope.currentItem = undefined;

            var addOperatorDom = function (dataItem, row) {
                var optTemplates = "<div>" +
                    "<a href='javascript:void(0)' ng-click='modify()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_modify_button+"</a>" +
                    "<a href='javascript:void(0)'ng-click='deleteSpec()' style='width:auto'>"+$scope.i18n.common_term_delete_button+"</a>" +
                    "</div>";

                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.modify = function () {
                    var modifyWin = createWindow("modify", dataItem.flavorId);
                    modifyWin.show();
                };
                scope.deleteSpec = function () {
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
                                $scope.operator.delete(dataItem.flavorId);
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
                $("td:eq(6)", row).html(optDom);
            };

            var createWindow = function (action, specID) {
                var options = {
                    "winId": "createVmSpecWinID",
                    "content-type": "url",
                    "content": "./app/business/resources/views/templateSpec/spec/vmSpec/create/createVmSpec.html",
                    "height": 500,
                    "width": 850,
                    "resizable": true,
                    "maximizable":false,
                    "minimizable": false,
                    "buttons": null,
                    "close": function (event) {
                        $scope.operator.query();
                    }
                };

                options.action = action;
                if (action === 'create') {
                    options.title = $scope.i18n.spec_term_createVMspec_button || "创建虚拟机规格";
                } else {
                    options.title = $scope.i18n.spec_term_modifyVM_button || "修改虚拟机规格";
                    options.specID = specID;
                }

                return new Window(options);
            };

            $scope.vmSpecTable = {
                caption: "",
                data: [],
                id: "vmSpecTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: true,
                columns: [
                    {
                        "sTitle": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "3%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label || "名称",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "ID",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.flavorId);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_cpuNum_label || "CPU内核数",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.cpuCount);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_memoryMB_label || "内存(MB)",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.memSize);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_disk_label || "磁盘",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.disksInfo);
                        },
                        "bSortable":false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label || "操作",
                        "bVisible":$scope.privilege.role_role_add_option_vmSpecHandle_value,
                        "bSortable": false,
                        "sWidth": "13%"
                    }
                ],
                callback: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vmSpecTable.curPage.pageIndex = eveObj.currentPage;
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vmSpecTable.curPage.pageIndex = eveObj.currentPage;
                    $scope.vmSpecTable.displayLength = eveObj.displayLength;
                },
                renderRow: function (row, dataitem, index) {
                    $("td:eq(0)", row).bind("click", function () {
                        $scope.currentItem = dataitem;
                    });

                    // 调整disks信息
                    var diskInfo = "";
                    var disks = dataitem.disks;
                    for (var disk in disks) {
                        diskInfo += disks[disk].diskSize + "GB";
                        diskInfo += ";";
                    }
                    $("td:eq(5)", row).html(diskInfo);

                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(2)", row).addTitle();
                    $("td:eq(5)", row).addTitle();

                    // 添加操作
                    if ($scope.privilege.role_role_add_option_vmSpecHandle_value) {
                        addOperatorDom(dataitem, row);
                    }
                }
            };

            $scope.refresh = {
                id: "vmSpecRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button || "刷新",
                tip: "",
                click: function () {
                    $scope.searchModel.start = 0;
                    $scope.vmSpecTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.name = $("#"+$scope.searchBox.id).widget().getValue();
                    $scope.operator.query();
                }
            };

            $scope.create = {
                id: "vmSpecCreate_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_create_button || "创建",
                tip: "",
                create: function () {
                    "use strict";
                    var createWin = createWindow("create", undefined);
                    createWin.show();
                }
            };

            $scope.searchBox = {
                "id": "searchBox",
                "placeholder": $scope.i18n.spec_term_findVMspecName_prom || "请输入虚拟机规格名称",
                "type":"round", 
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                    // 预留功能
                },
                "search": function (searchString) {
                    $scope.searchModel.start = 0;
                    $scope.vmSpecTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.name = searchString;
                    $scope.operator.query();
                }
            };

            $scope.operator = {
                "query": function () {
                    var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                    $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                    var deferred = camel.get({
                        "url": {"s": constants.rest.VM_SPEC_QUERY.url, "o": {"tenant_id": 1}},
                        "params": $scope.searchModel,
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.vmFlavors === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            // 详情配置
                            for (var index in data.vmFlavors) {
                                data.vmFlavors[index].detail = {
                                    contentType: "url", 
                                    content: "app/business/resources/views/templateSpec/spec/vmSpec/vmSpecDetail.html"
                                };

                                data.vmFlavors[index].disksInfo = JSON.stringify(data.vmFlavors[index].disks);
                            }

                            // 获取数据
                            $scope.vmSpecTable.data = data.vmFlavors;
                            $scope.vmSpecTable.totalRecords = data.total;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                    $scope.searchModel.start = start;
                },
                "delete": function (id) {

                    var deferred = camel.delete({
                        "url": {"s": constants.rest.VM_SPEC_DELETE.url, "o": {"tenant_id": 1,"id": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.searchModel.start = 0;
                        $scope.vmSpecTable.curPage = {"pageIndex": 1};
                        // 刷新页面
                        $scope.operator.query();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
            };

            // 打开时请求数据
            $scope.operator.query();
        }];

        return vmSpecListCtrl;
    });
