define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/exceptionService",
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    'tiny-widgets/Message',
    "tiny-directives/Searchbox",
    "fixtures/availableZoneFixture"
], function ($, angular, ExceptionService, Layout, Window, Message) {
    "use strict";
    var poolCtrl = ["$scope", "$compile", "$state", "camel", "$interval", function ($scope, $compile, $state, camel, $interval) {
        var user = $("html").scope().user;
        $scope.openstack = user.cloudType === "OPENSTACK";
        var hasOperateRight = user.privilege.role_role_add_option_cloudPoolHandle_value;
        var exceptionService = new ExceptionService();
        $scope.searchModel = {
            name: "",
            type: "",
            connectStatus: "",
            serviceStatus: "",
            start: "",
            limit: ""
        };
        var openStackWin = {
            "winId": "openStackWinId",
            "title": $scope.i18n.cloud_term_openstackImport_button,
            "width": 600,
            "height": 400,
            "content-type": "url",
            "content": "app/business/multiPool/views/fusionCasecade/openStackAccess.html",

            "buttons": [  null,
                null
            ],
            "close": function (event) {
                $scope.operator.query();
            }
        };

        $scope.fusionSphereBtn = {
            "id": "fusionSphereBtnId",
            "text": $scope.i18n.cloud_term_importFSP_button,
            "display": hasOperateRight,
            "fusion": function () {
                $state.go("service.cascade");
            }
        };

        $scope.openStackBtn = {
            "id": "openStackBtnId",
            "text": $scope.i18n.cloud_term_openstackImport_button,
            "display": hasOperateRight,
            "openStack": function () {
                var openWin = new Window(openStackWin);
                openWin.show();
            }
        };

        var allTypeValue = [
            {
                "selectId": "all",
                "label": $scope.i18n.common_term_allType_label,
                "checked": true
            },
            {
                "selectId": "fusionmanager",
                "label": "FusionManager"
            },
            {
                "selectId": "openstack",
                "label": "OpenStack"
            }
        ];

        $scope.allType = {
            "id": "allTypeId",
            "width": 150,
            "values": allTypeValue,
            "change": function () {
                $scope.searchModel.type = $("#" + $scope.allType.id).widget().getSelectedId();
                $scope.operator.query();
            }
        };

        // 连接状态转换
        var connectStatusMap = {
            "connected": $scope.i18n.common_term_natural_value,
            "disconnected": $scope.i18n.common_term_abnormal_value,
            "connecting": $scope.i18n.common_term_linking_value,
            "connected_failed": $scope.i18n.common_term_linkFail_value
        };
        var allConnectSelect = function () {
            var allConnectValue = [
                {"selectId": "all", "label": $scope.i18n.common_term_allLinkStatus_label, "checked": true},
                {"selectId": "connected", "label": $scope.i18n.common_term_natural_value},
                {"selectId": "connecting", "label": $scope.i18n.common_term_linking_value},
                {"selectId": "connected_failed", "label": $scope.i18n.common_term_linkFail_value},
                {"selectId": "disconnected", "label": $scope.i18n.common_term_abnormal_value}
            ];
            return allConnectValue;
        };
        $scope.allConnet = {
            "id": "allConnectId",
            "width": 150,
            "values": allConnectSelect(),
            "change": function () {
                $scope.searchModel.connectStatus = $("#" + $scope.allConnet.id).widget().getSelectedId();
                $scope.operator.query();
            }
        };

        // 服务状态转换
        var serviceStatusMap = {
            "normal": $scope.i18n.common_term_onuse_value,
            "abnormal": $scope.i18n.common_term_abnormal_value,
            "pause": $scope.i18n.common_term_pauseUse_value
        };

        var updateStatusMap = {
            "synchronizing": $scope.i18n.common_term_updating_value,
            "synchronized": $scope.i18n.common_term_updatComplete_value,
            "none": $scope.i18n.common_term_noUpdate_value,
            "failed": $scope.i18n.common_term_updatFail_value
        };
        var allStateSelect = function () {
            var allStateValue = [
                {"selectId": "all", "label": $scope.i18n.common_term_allUseStatus_label, "checked": true},
                {"selectId": "normal", "label": $scope.i18n.common_term_onuse_value},
                {"selectId": "pause", "label": $scope.i18n.common_term_pauseUse_value},
                {"selectId": "abnormal", "label": $scope.i18n.common_term_abnormal_value}
            ];
            return allStateValue;
        };

        $scope.allState = {
            "id": "allStateId",
            "width": 150,
            "values": allStateSelect(),
            "change": function () {
                $scope.searchModel.serviceStatus = $("#" + $scope.allState.id).widget().getSelectedId();
                $scope.operator.query();
            }
        };
        $scope.searchBox = {
            "id": "searchBoxId",
            "placeholder": $scope.i18n.common_term_findName_prom,
            "width": "250",
            "suggest-size": 10,
            "maxLength": 64,
            "suggest": function (content) {
            },
            "search": function (searchString) {
                $scope.searchModel.name = searchString;
                $scope.searchModel.connectStatus = $("#" + $scope.allConnet.id).widget().getSelectedId();
                $scope.searchModel.serviceStatus = $("#" + $scope.allState.id).widget().getSelectedId();
                $scope.operator.query();
            }
        };

        $scope.refresh = {
            id: "refreshId",
            disabled: false,
            iconsClass: "",
            tip: "",
            click: function () {
                $scope.searchModel.name = $("#" + $scope.searchBox.id).widget().getValue();
                $scope.operator.query();
            }
        };

        // 根据场景设置用户列表显示列
        var fusionSphereList = [
            {
                "sTitle": $scope.i18n.common_term_name_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.name);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_ID_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.id);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_section_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.region);
                },
                "bSortable": false
            },
            {
                "sTitle": "IP",
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.ip);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_type_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.typeStr);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_version_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.versionStr);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_linkStatus_value,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.connectStatusStr);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_usageStatus_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.serviceStatusStr);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_operation_label,
                "mData": "operation",
                "bSortable": false
            }
        ];

        var openStackList = [
            {
                "sTitle": $scope.i18n.common_term_name_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.name);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_ID_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.id);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_section_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.region);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_type_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.typeStr);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_version_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.versionStr);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_linkStatus_value,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.connectStatusStr);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_usageStatus_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.serviceStatusStr);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_updatStatus_label,
                "mData": function(data){
                    return $.encoder.encodeForHTML(data.syncStatus);
                },
                "bSortable": false
            },
            {
                "sTitle": $scope.i18n.common_term_operation_label,
                "mData": "operation",
                "bSortable": false
            }
        ];
        var columns = [];
        var exclude = [];
        var fusionSphereExclude = [0,8];
        var openStackExclude = [0,8];

        if ($scope.openstack) {
            columns = openStackList;
            exclude = openStackExclude;
        }
        else {
            columns = fusionSphereList;
            exclude = fusionSphereExclude;
        }

        $scope.resourcePool = {
            "id": "resourcePoolId",
            "data": [],
            "columns": columns,
            "pagination": true,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "lengthMenu": [10, 20, 50],
            "displayLength": 10,
            "visibility": {
                "activate": "click",
                "aiExclude": exclude,
                "bRestore": false
            },

            "enableFilter": false,
            "curPage": {"pageIndex": 1},
            "requestConfig": {"enableRefresh": true, "refreshInterval": 6000, "httpMethod": "GET", "url": "", "data": "", "sAjaxDataProp": "mData"},
            "totalRecords": 0,
            "hideTotalRecords": false,
            "showDetails": false,

            "renderRow": function (row, dataitem, index) {
                $(row).attr("orgId", $.encoder.encodeForHTMLAttribute(dataitem.id));
                $(row).attr("lineNum", index);
                //详情链接
                var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                var scope = $scope.$new(false);
                scope.name = dataitem.name;
                scope.infraId = dataitem.id;
                scope.type = dataitem.type;
                scope.detail = function () {
                    $state.go("service.poolInfo.summary", {"name": scope.name, "infraId": scope.infraId, "from": $state.current.name, "type": scope.type});
                };
                var node = link(scope);
                $("td[tdname='0']", row).html(node);

				if(!$scope.openstack && dataitem.connectStatus === "connected_failed"){
					//连接失败详情
					var faillink = $compile($("<a href='javascript:void(0)' ng-click='failedDetail()'>{{i18n.common_term_linkFail_value}}</a>"));
					var failscope = $scope.$new(false);
					failscope.failedDetail = function () {
						failedWindow(dataitem);
					};
					var failnode = faillink(failscope);
					$("td[tdname='6']", row).html(failnode);
				}

                // 操作栏
                var submenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                    '<li><a tabindex="-1" ng-click="recoveryUse()" ng-if="isPause">' + $scope.i18n.common_term_desterilize_button + '</a>' +
                    '<p class="link_disable" style="margin-left: 14px" ng-if="!isPause">' + $scope.i18n.common_term_desterilize_button + '</p></li>' +
                    '<li><a tabindex="-1" ng-click="pauseUse()"  ng-if="isNormal">' + $scope.i18n.common_term_pauseUse_button + '</a>' +
                    '<p class="link_disable" style="margin-left: 14px" ng-if="!isNormal">' + $scope.i18n.common_term_pauseUse_button + '</p></li>' +
                    '<li><a tabindex="-1" ng-if="isFusionSphere" ng-click="edit()">' + $scope.i18n.common_term_modify_button + '</a></li>' +
                    '<li><a tabindex="-1"ng-if="isOpenstack" ng-click="updateCloudPool()">' + $scope.i18n.common_term_update_button + '</a></li>' +
                    '</ul>' +
                    '</span>';

                var opt = "<div ng-show='hasOperateRight'><a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>" +
                    "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>" + submenus + "</div>";
                var optLink = $compile($(opt));
                var optScope = $scope.$new(false);
                optScope.isOpenstack = false;
                if( user.cloudType == "OPENSTACK"){
                    optScope.isOpenstack = true;
                }

                optScope.id = dataitem.id;
                optScope.name = dataitem.name;
                optScope.isPause = dataitem.serviceStatus === "pause";
                optScope.isNormal = dataitem.serviceStatus === "normal";
                optScope.isFusionSphere = dataitem.type === "fusionmanager";
                optScope.hasOperateRight = hasOperateRight;
                optScope.delete = function () {
                    var deleteMsg = new Message({
                        "type": "confirm",
                        "title": $scope.i18n.common_term_confirm_label,
                        "content": $scope.i18n.cloud_pool_del_info_confirm_msg,
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    deleteMsg.setButton("okBtn", function () {
                        $scope.operator.delete(dataitem.id);
                        deleteMsg.destroy();
                    });
                    deleteMsg.setButton("cancelBtn", function () {
                        deleteMsg.destroy();
                    });
                    deleteMsg.show();
                };

                optScope.recoveryUse = function () {
                    var msg = new Message({
                        "type": "confirm",
                        "content": $scope.i18n.vm_pool_desterilize_info_confirm_msg,
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    msg.setButton("okBtn", function () {
                        msg.destroy();
                        $scope.operator.operatorCloudInfras(dataitem.id, "activate", msg);
                    });
                    msg.setButton("cancelBtn", function () {
                        msg.destroy();
                    });
                    msg.show();
                };

                optScope.pauseUse = function () {
                    var msg = new Message({
                        "type": "confirm",
                        "content": $scope.i18n.vm_pool_pauseUse_info_confirm_msg,
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    msg.setButton("okBtn", function () {
                        msg.destroy();
                        $scope.operator.operatorCloudInfras(dataitem.id, "inactivate", msg);
                    });
                    msg.setButton("cancelBtn", function () {
                        msg.destroy();
                    });
                    msg.show();
                };

                optScope.edit = function () {
                    var modifyMsg = new Message({
                        "type": "confirm",
                        "content": $scope.i18n.cloud_pool_modifyConnectPara_info_confirm_msg,
                        "height": window.urlParams.lang === "zh" ? "150px" : "240px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    modifyMsg.setButton("okBtn", function () {
                        $scope.operator.modifyMsg(dataitem.id, dataitem.type);
                        modifyMsg.destroy();
                    });
                    modifyMsg.setButton("cancelBtn", function () {
                        modifyMsg.destroy();
                    });
                    modifyMsg.show();

                };

                optScope.updateCloudPool = function () {
                    $scope.operator.operatorCloudInfras(dataitem.id, "synchronize");
                };

                var optNode = optLink(optScope);
                if ($scope.openstack) {
                    $("td[tdname='8']", row).html(optNode);
                } else {
                    $("td[tdname='8']", row).html(optNode);
                }
                optNode.find('.dropdown').dropdown();
            },

            "callback": function (evtObj) {
                $scope.resourcePool.curPage.pageIndex = evtObj.currentPage;
                $scope.resourcePool.displayLength = evtObj.displayLength;
                $scope.operator.query();
            },
            "changeSelect": function (evtObj) {
                $scope.resourcePool.curPage.pageIndex = evtObj.currentPage;
                $scope.resourcePool.displayLength = evtObj.displayLength;
                $scope.operator.query();
            }
        };

        function updateMessage() {
            var options = {
                type: "confirm",
                content: $scope.i18n.task_view_task_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            $state.go("system.taskCenter");
                            msg.destroy();
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
        }
		function failedWindow(aData) {
			var newWindow = new Window({
				"winId": "failedDetailWindow",
				"title": $scope.i18n.common_term_linkFail_value,
				"connectorErrorCode": aData.connectorErrorCode,
				"content-type": "url",
                "maximizable":false,
                "minimizable":false,
				"buttons": null,
				"content": "app/business/multiPool/views/fusionCasecade/failedDetail.html",
				"height": window.urlParams.lang === "zh" ? "200px" : "200px",
				"width": window.urlParams.lang === "zh" ? "350px" : "370px"
			});
			newWindow.show();
		}

        $scope.operator = {
            "delete": function (cloudInfrasId) {
                var deferred = camel["delete"]({
                    "url": {
                        "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras/{id}",
                        "o": {
                            "tenant_id": "1",
                            "id": cloudInfrasId
                        }
                    },
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {
                        $scope.operator.query();
                    });
                });
                deferred.fail(function (data) {
                    $scope.$apply(function () {
                        exceptionService.doException(data);
                    });
                });
            },
            "operatorCloudInfras": function (cloudInfrasId, action) {
                var params = {};
                if (action === "activate") {
                    params.activate = action;
                } else if (action === "inactivate") {
                    params.inactivate = action;
                } else if (action === "synchronize") {
                    params.synchronize = action;
                } else {
                    // do nothing
                }

                var deferred = camel.post({
                    "url": {
                        "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras/{id}/action",
                        "o": {
                            "tenant_id": "1",
                            "id": cloudInfrasId
                        }
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (response) {
                    $scope.$apply(function () {
                        $scope.operator.query();
                    });


                });

                deferred.fail(function (data) {
                    $scope.$apply(function () {
                        exceptionService.doException(data);
                    });
                });
            },




            "query": function (monitor, autoRequest) {
                var url = "/goku/rest/v1.5/1/cloud-infras?";
                url = url + "start=" + ($scope.resourcePool.curPage.pageIndex - 1) * $scope.resourcePool.displayLength;
                url = url + "&limit=" + $scope.resourcePool.displayLength;
                var name = $scope.searchModel.name;
                if (name !== "") {
                    url = url + "&name=" + name;
                }
                var type = $scope.searchModel.type;
                if (type !=="" && type !== "all") {
                    url = url + "&type=" + type;
                }
                var connectStatus = $scope.searchModel.connectStatus;
                if (connectStatus !== "" && connectStatus !== "all") {
                    url = url + "&connect-status=" + connectStatus;
                }
                var serviceStatus = $scope.searchModel.serviceStatus;
                if (serviceStatus !== "" && serviceStatus !== "all") {
                    url = url + "&service-status=" + serviceStatus;
                }
                var deferred = camel.get({
                    "url": url,
                    "params": {
                    },
                    "userId": user.id,
                    "monitor": monitor,
                    "autoRequest": autoRequest
                });

                deferred.success(function (response) {
                    $scope.$apply(function () {
                        var data = [];
                        var poolResourceRes = response.cloudInfras;
                        for (var item in poolResourceRes) {
                            poolResourceRes[item].operation = "";
                            poolResourceRes[item].typeStr = $scope.operator.transferType(poolResourceRes[item].type);
                            poolResourceRes[item].versionStr = $scope.operator.transferVersion(poolResourceRes[item].type, poolResourceRes[item].version);
                            poolResourceRes[item].connectStatusStr = connectStatusMap[poolResourceRes[item].connectStatus];
                            poolResourceRes[item].serviceStatusStr = serviceStatusMap[poolResourceRes[item].serviceStatus];
                            poolResourceRes[item].syncStatus = updateStatusMap[poolResourceRes[item].syncStatus];


                            data.push(poolResourceRes[item]);
                        }
                        $scope.resourcePool.data = data;
                        $scope.resourcePool.totalRecords = response.total;
                    });
                });
            },
            "transferType": function (type) {
                if ("fusionmanager" === type) {
                    return "FusionManager";
                }
                else if ("openstack" === type) {
                    return "OpenStack";
                }
                else {
                    return type;
                }
            },
            "transferVersion": function (type, version) {
                if ("fusionmanager" === type && version === "1.5.0") {
                    return "V100R005C00";
                }
                else if ("openstack" === type && version === "havana") {
                    return "Havana";
                }
                else {
                    return version;
                }
            },
            "modifyMsg": function (id, type) {
                var modifyInfraWindow = new Window({
                    "winId": "modifyInfraWindowId",
                    "infraId": id,
                    "infraType": type,
                    "title": $scope.i18n.common_term_modify_button || "修改",
                    "content-type": "url",
                    "content": "app/business/multiPool/views/fusionCasecade/modifyCloudInfra.html",
                    "height": 600,
                    "width": 800,
                    "maximizable":false,
                    "minimizable":false,
                    "buttons": [
                        null,
                        null
                    ],
                    "close": function (event) {
                        $scope.operator.query();
                    }
                }).show();
            }
        };

        $scope.promise = undefined;
        /**
         * 清除定时器
         */
        $scope.clearTimer = function () {
            try {
                $interval.cancel($scope.promise);
            }
            catch (e) {
            }
        };

        /**
         * 初始化操作
         */
        $scope.init = function () {
            $scope.promise = $interval(function () {
                $scope.operator.query(false, true);
            }, 10000);
        };

        // 初始化查询
        $scope.operator.query();

        //定时器初始化
        $scope.init();

        // 清理定时器
        $scope.$on('$destroy', function () {
            $scope.clearTimer();
        });
    }];
    return poolCtrl;
});
