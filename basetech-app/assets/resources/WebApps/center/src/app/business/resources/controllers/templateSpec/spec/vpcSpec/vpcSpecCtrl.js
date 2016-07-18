/**
 * vpc规格管理
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    'app/services/exceptionService',
    'app/services/competitionConfig',
    'fixtures/templateDefineFixture'],
    function ($, angular, Window, Message, constants, Exception, competitionConfig) {
        "use strict";

        var vpcSpecListCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            var exceptionService = new Exception();
            //SFR场景
            $scope.vmwareICT = competitionConfig.isBaseOnVmware;

            $scope.user = $("html").scope().user;
            $scope.privilege = $scope.user.privilege;
            $scope.openstack = ($scope.user.cloudType === "OPENSTACK" ? true : false);

            /**
             * 初始化虚拟机规格Table操作列
             *
             * @param dataItem
             * @param row
             */
            var addOperatorDom = function (dataItem, row) {
                var optTemplates = "<div>" +
                    "<a href='javascript:void(0)' ng-click='modify()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_modify_button+"</a>" +
                    "</div>";

                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.modify = function () {
                    var win = createWindow("modify", dataItem.vpcSpecTemplateID);
                    win.show();
                };
                scope.delete = function () {
                    var msgOptions = {
                        "type":"confirm", //prompt,confirm,warn,error
                        "title":$scope.i18n.common_term_confirm_label || "确认",
                        "content":$scope.i18n.spec_vpc_del_info_confirm_msg || "确实要删除该VPC规格吗？",
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
                                $scope.operator.delete(dataItem.vpcSpecTemplateID);
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
                if ($scope.openstack) {
                    if($scope.vmwareICT){
                        $("td:eq(4)", row).html(optDom);
                    }else{
                        $("td:eq(5)", row).html(optDom);
                    }
                } else {
                    $("td:eq(7)", row).html(optDom);
                }
            };

            /**
             * 虚拟机规格(创建、修改)
             *
             * @param action
             * @param specID
             */
            var createWindow = function (action, specID) {
                var options = {
                    "winId": "createVpcSpecWinID",
                    "content-type": "url",
                    "content": "./app/business/resources/views/templateSpec/spec/vpcSpec/create/createVpcSpec.html",
                    "height": 550,
                    "width": 850,
                    "resizable": true,
                    "maximizable": false,
                    "buttons": null,
                    "close": function (event) {
                        $scope.operator.query();
                    }
                };

                options.action = action;
                if (action === 'create') {
                    options.title =  ($scope.i18n.spec_term_createVPC_button || "创建VPC规格");
                } else {
                    options.title = ($scope.i18n.spec_term_modifyVPC_button || "修改VPC规格");
                    options.specID = specID;
                }

                return new Window(options);
            };

            var itColumns = [
                {
                    "sTitle": "",
                    "bSearchable": false,
                    "bSortable": false,
                    "sWidth": "30"
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label || "名称",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.vpcSpecTemplateID);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.spec_term_directNetMaxNum_label || "最大直连网络数",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.maxDirectNetworkNum);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.spec_term_routerNetMaxNum_label || "最大路由网络数",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.maxRoutedNetworkNum);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.spec_term_innerNetMaxNum_label || "最大内部网络数",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.maxInternalNetworkNum);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.spec_term_eipMaxNum_label || "最大弹性IP数",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.maxPublicIpNum);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label || "操作",
                    "bVisible":$scope.privilege.role_role_add_option_vpcSpecHandle_value,
                    "bSortable": false
                }
            ];

            var ictColumns = [
                {
                    "sTitle": "",
                    "bSearchable": false,
                    "bSortable": false,
                    "sWidth": "30"
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label || "名称",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.vpcSpecTemplateID);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.spec_term_routerOrInnerNetMaxNum_label || "最大路由/内部网络数",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.maxRoutedNetworkNum);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.spec_term_eipMaxNum_label || "最大弹性IP数",

                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.maxPublicIpNum);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label || "操作",
                    "bVisible":$scope.privilege.role_role_add_option_vpcSpecHandle_value,
                    "bSortable": false
                }
            ];
            var ictVmColumns = [
                {
                    "sTitle": "",
                    "bSearchable": false,
                    "bSortable": false,
                    "sWidth": "30"
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label || "名称",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.vpcSpecTemplateID);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.spec_term_routerOrInnerNetMaxNum_label || "最大路由/内部网络数",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.maxRoutedNetworkNum);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label || "操作",
                    "bVisible":$scope.privilege.role_role_add_option_vpcSpecHandle_value,
                    "bSortable": false
                }
            ];

            /**
             * 虚拟机规格表格
             */
            $scope.vpcSpecTable = {
                caption: "",
                data: [],
                id: "vpcSpecTableId",
                columnsDraggable: true,
                enablePagination: false,
                paginationStyle: "full_numbers",
                lengthChange: true,
                enableFilter: false,
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
                        "sTitle": $scope.i18n.common_term_name_label || "名称",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.spec_term_directNetMaxNum_label || "最大直连网络数",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.maxDirectNetworkNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.spec_term_routerNetMaxNum_label || "最大路由网络数",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.maxRoutedNetworkNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.spec_term_innerNetMaxNum_label || "最大内部网络数",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.maxInternalNetworkNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.spec_term_eipMaxNum_label || "最大弹性IP数",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.maxPublicIpNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label || "操作",
                        "bVisible":$scope.privilege.role_role_add_option_vpcSpecHandle_value,
                        "bSortable": false
                    }
                ],
                renderRow: function (row, dataitem, index) {
                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);
                    $("td:eq(0)", row).bind("click", function () {
                        $scope.currentItem = dataitem;
                    });

                    // 添加操作
                    if ($scope.privilege.role_role_add_option_vpcSpecHandle_value) {
                        addOperatorDom(dataitem, row);
                    }
                }
            };

            $scope.currentItem = undefined;

            /**
             * 操作按钮
             */
            $scope.refresh = {
                id: "vpcSpecRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button || "刷新",
                tip: "",
                click: function () {
                    $scope.operator.query();
                }
            };

            /**
             * 创建按钮
             */
            $scope.create = {
                id: "vpcSpecCreate_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_create_button || "创建",
                tip: "",
                create: function () {
                    "use strict";
                    var win = createWindow("create", undefined);
                    win.show();
                }
            };

            /**
             * 操作方法定义
             */
            $scope.operator = {
                "query": function () {

                    var deferred = camel.get({
                        "url": {"s": constants.rest.VPC_SPEC_QUERY.url, "o": {"tenant_id": 1}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.vpcSpecTemplates === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            // 详情配置
                            for (var index in data.vpcSpecTemplates) {
                                data.vpcSpecTemplates[index].detail = {
                                    contentType: "url", // simple & url
                                    content: "app/business/resources/views/templateSpec/spec/vpcSpec/vpcSpecDetail.html"
                                };

                                data.vpcSpecTemplates[index].disksInfo = JSON.stringify(data.vpcSpecTemplates[index].disks);
                            }

                            // 获取数据
                            $scope.vpcSpecTable.data = data.vpcSpecTemplates;
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "delete": function (id) {

                    var deferred = camel.delete({
                        "url": {"s": constants.rest.VPC_SPEC_DELETE.url, "o": {"tenant_id": 1,"id": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.done(function (data) {
                        // 刷新页面
                        $scope.operator.query();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
            };

            /**
             * 初始化操作
             */
            $scope.init = function () {
                if($scope.openstack){
                    if($scope.vmwareICT){
                        $scope.vpcSpecTable.columns=ictVmColumns;
                    }else{
                        $scope.vpcSpecTable.columns = ictColumns;
                    }
                }else {
                    $scope.vpcSpecTable.columns = itColumns;
                }

                // 打开时请求数据
                $scope.operator.query();
            };

            $scope.init();
        }];

        return vpcSpecListCtrl;
    });
