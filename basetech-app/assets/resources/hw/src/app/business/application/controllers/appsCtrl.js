define(['tiny-lib/angular',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "bootstrap/bootstrap.min",
    "fixtures/appFixture"
],
    function (angular, Window, Message, bootstrap, appFixture) {
        "use strict";
        var appsCtrl = ['$scope', '$compile', '$state', '$rootScope', '$stateParams', 
                        function ($scope, $compile, $state, $rootScope, $stateParams) {
        	
        	$scope.appLabels = {
                    "app_title": "应用列表",
                    "app_title_explan": "显示所有创建的应用。<br/>单击应用名称，可以查看应用的详细信息。",
                    "app_btn_create_app":"创建应用",
                    "app_btn_create_group":"创建分组",
                    "app_label_total": "应用总数：",
                    "app_label_running": "运行中：",
                    "app_label_stopped": "已停止：",
                    "app_filter_zone_all": "所有云环境",
                    "app_filter_status_all": "所有状态",
                    "app_filter_status_running": "运行",
                    "app_filter_status_stopped": "停止",
                    "app_filter_status_absent": "异常",
                    "app_searchbox": "请输入应用名称",
                    "app_table_name": "应用名称",
                    "app_table_id": "应用ID",
                    "app_table_group_name": "应用分组",
                    "app_table_template_name": "模板名称",
                    "app_table_zone_name": "云环境",
                    "app_table_status": "运行状态",
                    "app_table_created_time": "创建时间",
                    "app_table_operation": "操作",
                    "app_table_restore_btn": "恢复默认设置",
                    "app_table_operation_more": "更多",
                    "app_table_operation_start": "启动",
                    "app_table_operation_stop": "停止",
                    "app_table_operation_delete": "删除",
                    "app_table_operation_upgrade": "升级",
                    "app_table_operation_rollback": "回滚",
                    "app_table_operation_update_template": "更新模板",
                    "app_table_operation_modify_basicinfo": "更新基本信息",
                    "app_dialog_confirm_title": "确认",
                    "app_dialog_confirm_delete": "请确认是否删除",
                    "app_dialog_confirm_btn_confirm": "确认",
                    "app_dialog_confirm_btn_cancel": "取消",
                    
                };
        	$scope.right = {"hasAppOperateRight" : true}
        	
                //创建按钮
                $scope.addAppModel = {
                    "id": "addApp",
                    "text": $scope.appLabels.app_btn_create_app,
                    "focused": false,
                    "click": function () {
                        $state.go("applications.addApp");
                    }
                }
        	
	        	//创建按钮
	            $scope.addGroupModel = {
	                "id": "addGroup",
	                "text": $scope.appLabels.app_btn_create_group,
	                "focused": false,
	                "click": function () {
	                    $state.go("applications.addGroup");
	                }
	            }
                
                //刷新
                $scope.refreshModel = {
                    "id": "appRefresh",
                    "click": function () {
                        $scope.operate.queryAppsData();
                    }
                }

                //搜索模型
                $scope.searchModel = {
                    "name": "",
                    "id" : "",
                    "groupId": "",
                    "zoneId": "",
                    "templateId": "",
                    "status": "",
                    "start": 1,
                    "limit": 10
                };

                //资源分区搜索框
                $scope.zoneFilter = {
                    "id": "zoneFilter",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "all",
                            "label": $scope.appLabels.app_filter_zone_all,
                            "checked": true
                        }
                    ],
                    "change": function () {
                        var zoneSelectId = $("#zoneFilter").widget().getSelectedId();
                        if ("all" == zoneSelectId) {
                            $scope.searchModel.zoneId = "";
                        }
                        else {
                            $scope.searchModel.zoneId = zoneSelectId
                        }
                        $scope.operate.queryHostsData();
                    }
                };

                //运行状态1:Normal 2:Shutdown 3:Error(Unknown) 4:Absent。,
                $scope.statusFilter = {
                    "id": "statusFilter",
                    "width": "120",
                    "values": [
                        {
                            "selectId": "all",
                            "label": $scope.appLabels.app_filter_status_all,
                            "checked": true
                        },
                        {
                            "selectId": "1",
                            "label":$scope.appLabels.app_filter_status_running
                        },
                        {
                            "selectId": "2",
                            "label": $scope.appLabels.app_filter_status_stopped
                        },
                        {
                            "selectId": "3",
                            "label": $scope.appLabels.app_filter_status_absent
                        }
                    ],
                    "change": function () {
                        var statusSelectId = $("#statusFilter").widget().getSelectedId();
                        if ("all" == statusSelectId) {
                            $scope.searchModel.status = "";
                        }
                        else {
                            $scope.searchModel.status = statusSelectId
                        }
                        $scope.operate.queryAppsData();
                    }
                };

                //搜索框
                $scope.searchBox = {
                    "id": "appSearchBox",
                    "placeholder": $scope.appLabels.app_search,
                    "type": "round", // round,square,long
                    "width": "200",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.name = searchString;
                        $scope.operate.queryHostsData();
                    }
                };

                //应用列表
                var appTableColumns = [
                    {
                        "sTitle": $scope.appLabels.app_table_name,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "10%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.appLabels.app_table_id,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "sWidth": "10%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.appLabels.app_table_group_name,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.groupName);
                        },
                        "sWidth": "10%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.appLabels.app_table_template_name,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.templateName);
                        },
                        "sWidth": "10%",
                        "bSortable": true},    
                    {
                        "sTitle": $scope.appLabels.app_table_zone_name,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.zoneName);
                        },
                        "sWidth": "10%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.appLabels.app_table_status,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "sWidth": "10%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.appLabels.app_table_created_time,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createdTime);
                        },
                        "sWidth": "20%",
                        "bSortable": true},
                    {
                        "sTitle": $scope.appLabels.app_table_operation,
                        "mData": "",
                        "sWidth": "20%",
                        "bSortable": false}
                ];

                $scope.appTableModel = {
                    "id": "appTable",
                    "data": [],
                    "columns": appTableColumns,
                    "enablePagination": true,
                    "paginationStyle": "full-numbers",
                    "lengthChange": true,
                    "lengthMenu": [10, 20, 50],
                    "displayLength": 10,
                    "curPage": {"pageIndex": 1},
                    "requestConfig": {
                        "enableRefresh": false,
                        "refreshInterval": 60000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "columnsDraggable": true,
                    "columnsVisibility": {
                        "activate": "click",
                        "aiExclude": [0] ,
                        "bRestore": true,
                        "sRestore": $scope.appLabels.app_table_operation,
                        "buttonText": "",
                        "fnStateChange": function (index, checked) {
                        }
                    },
                    "columnSorting": [
                        [1, 'asc']
                    ],
                    "show-details": false,
                    "callback": function (evtObj) {
                        $scope.searchModel.start = evtObj.currentPage;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operate.queryAppsData();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.start = evtObj.currentPage;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.appTableModel.displayLength = evtObj.displayLength;
                        $scope.operate.queryAppsData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //App名称加上跳转链接
                        var appName = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                        var appNameLink = $compile(appName);
                        var appNameScope = $scope.$new();
                        appNameScope.name = $.encoder.encodeForHTML(aData.name);
                        appNameScope.goToDetail = function () {
                            $state.go("resources.appDetail.summary", { "appId": aData.appId});

                        }
                        var appNameNode = appNameLink(appNameScope);
                        $("td:eq(0)", nRow).html(appNameNode);
                        
                        
                        //还有遗留状态判断没有做，比如应用状态如果是启动状态，那么就把启动按钮灰化。
                        if ($scope.right.hasAppOperateRight) {
                            var submenus = '<span class="dropdown" style="position: static">' +
                                '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.appLabels.app_table_operation_more + '<b class="caret"></b></a>' +
                                '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                                '<li><a tabindex="-1" ng-click="start()">' + $scope.appLabels.app_table_operation_start + '</a></li>' +
                                '<li><a tabindex="-1" ng-click="stop()">' + $scope.appLabels.app_table_operation_stop + '</a></li>' +
                                '<li><a tabindex="-1" ng-click="upgrade()">' + $scope.appLabels.app_table_operation_upgrade + '</a></li>' +
                                '<li><a tabindex="-1" ng-click="rollback()">' + $scope.appLabels.app_table_operation_rollback + '</a></li>' +
                                //'<li class="divider-line"></li>' +
                                '<li><a tabindex="-1" ng-click="updateTemplate()">' + $scope.appLabels.app_table_operation_update_template + '</a></li>' +
                                '<li><a tabindex="-1" ng-click="modifyBasicInfo()">' + $scope.appLabels.app_table_operation_modify_basicinfo + '</a></li>' +
                                '</ul>' +
                                '</span>';
                            var operateTemplates = "<div><a class='margin-right-beautifier' href='javascript:void(0)' ng-click='delete()'>" + $scope.appLabels.app_table_operation_delete + "</a>&nbsp" +
                                submenus + "</div>";
                            var operateTmp = $compile($(operateTemplates));
                            var operateScope = $scope.$new(false);
                            
                            //修改基本信息按钮执行函数
                            operateScope.modifyBasicInfo = function () {
                                var modifyBasicInfo = new Window({
                                    "winId": "modifyBasicInfoWin",
                                    "title": $scope.appLabels.app_table_operation_modify_basicinfo,
                                    "minimizable": false,
                                    "maximizable": false,
                                    "content-type": "url",
                                    "content": "resources/hw/src/app/business/application/views/modifyAppBasicInfo.html",
                                    "params": aData,
                                    "height": 300,
                                    "width": 400,
                                    "buttons": null,
                                    "close": function () {
                                        $scope.operate.queryAppsData();
                                    }
                                }).show();
                            };
                            
                          //删除应用按钮执行函数
                            operateScope.delete = function () {
                                var delAppMsg = new Message({
                                    "type": "warn",
                                    "title": $scope.appLabels.app_dialog_confirm_title,
                                    "content": $scope.appLabels.app_dialog_confirm_delete,
                                    "height": "220px",
                                    "width": "400px",
                                    "buttons": [
                                        {
                                            label: $scope.appLabels.app_dialog_confirm_btn_confirm,
                                            accessKey: '2',
                                            "key": "okBtn",
                                            majorBtn: true,
                                            default: true
                                        },
                                        {
                                            label: $scope.appLabels.app_dialog_confirm_btn_cancel,
                                            accessKey: '3',
                                            "key": "cancelBtn",
                                            default: false
                                        }
                                    ]
                                });
                                delAppMsg.setButton("okBtn", function () {
                                    $scope.operate.deleteApp(aData.id);
                                    delAppMsg.destroy();

                                });
                                delHostMsg.setButton("cancelBtn", function () {
                                    delAppMsg.destroy()
                                });
                                delAppMsg.show();
                            };
                            
                            //启动应用
                            operateScope.start = function () {
                                
                                $scope.operate.startApp(aData.id);
                            };
                            
                          //停止应用按钮执行函数
                            operateScope.stop = function () {
                                var stopAppMsg = new Message({
                                    "type": "warn",
                                    "title": $scope.appLabels.app_dialog_confirm_title,
                                    "content": $scope.appLabels.app_dialog_confirm_stop,
                                    "height": "220px",
                                    "width": "400px",
                                    "buttons": [
                                        {
                                            label: $scope.appLabels.app_dialog_confirm_btn_confirm,
                                            accessKey: '2',
                                            "key": "okBtn",
                                            majorBtn: true,
                                            default: true
                                        },
                                        {
                                            label: $scope.appLabels.app_dialog_confirm_btn_cancel,
                                            accessKey: '3',
                                            "key": "cancelBtn",
                                            default: false
                                        }
                                    ]
                                });
                                stopAppMsg.setButton("okBtn", function () {
                                    $scope.operate.stopApp(aData.id);
                                    stopAppMsg.destroy();

                                });
                                stopHostMsg.setButton("cancelBtn", function () {
                                    stopAppMsg.destroy()
                                });
                                stopAppMsg.show();
                            };
                            
                            //升级应用
                            operateScope.upgrade = function () {
                                
                                $scope.operate.upgradeApp(aData.id);
                            };
                            
                            //回滚应用
                            operateScope.rollback = function () {
                                
                                $scope.operate.rollbackApp(aData.id);
                            };
                            
                            //更新模板
                            operateScope.updateTemplate = function () {
                                
                                $scope.operate.updateTemplate(aData.id);
                            };
                            
                            var optNode = operateTmp(operateScope);
                            $("td:last", nRow).html(optNode);
                            optNode.find('.dropdown').dropdown();
                        }
                    }
                };

                //操作
                $scope.operate = {
                    "getZones": function () {
                        var queryConfig = constants.rest.ZONE_QUERY;
                        var deferred = camel.get({
                            url: {s: queryConfig.url, o: {"tenant_id": "1"}},
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            var zones = response.zones;
                            for (var index in zones) {
                                $scope.zoneModel[zones[index].id] = zones[index].name;
                                var availableZone = {
                                    "selectId": zones[index].id,
                                    "label": zones[index].name
                                };
                                $scope.zoneFilter.values.push(availableZone);
                            }
                            $("#" + $scope.zoneFilter.id).widget().option("values", $scope.zoneFilter.values);
                        });
                    },
                    //查询服务器
                    queryAppsData: function () {
                    	var response = {
                    	        code: 0,
                    	        total:1,
                    	        apps: [
                    	            {
                    	            	"id":"111111111",
                    	            	"name":"testApp",
                    	            	"group":"生产应用",
                    	            	"groupId":"2222",
                    	            	"zoneId":"1",
                    	            	"zoneName":"阿里云",
                    	            	"templateId":"3333333",
                    	            	"templateName":"wordpress应用模板",
                    	            	"status":"运行",
                    	            	"createdTime":"2016-07-24 11:11:11",
                    	            	
                    	            }
                    	        ]};
                    	console.log("11111------", response.apps, response.total);
                    	
                    	console.log("before set appTableModel-------");
                        $scope.appTableModel.data = response.apps;
                        $scope.appTableModel.totalRecords = response.total;
                        console.log("2222-------", $scope.appTableModel);
                        /*
                    	 $scope.$apply(function () {
                    		 console.log("before set appTableModel-------");
                             $scope.appTableModel.data = response.apps;
                             $scope.appTableModel.totalRecords = response.total;
                             console.log("2222-------", $scope.appTableModel);
                         });*/
                    	/**
                        var queryConfig = deviceConstants.rest.HOST_QUERY
                        var deferred = camel.get({
                                "url": {s: queryConfig.url, o: {"start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "sort_key": "", "sort_dir": "", "zoneId": $scope.searchModel.zoneId, "runStatus": $scope.searchModel.runStatus, "resourceStatus": $scope.searchModel.resourceStatus, "name": $scope.searchModel.name, "type": $scope.searchModel.type}},
                                "type": queryConfig.type,
                                "userId": $rootScope.user.id
                            }
                        )
                        deferred.done(function (response) {
                            for (var index in response.servers) {
                                response.servers[index].runStatus = $scope.i18n[deviceConstants.config.HOST_RUN_STATUS[response.servers[index].runtimeState]];
                                response.servers[index].resourceStatus = $scope.i18n[deviceConstants.config.HOST_RESOURCE_STATUS[response.servers[index].resourceState]];
                            }
                            $scope.$apply(function () {
                                $scope.hostTableModel.data = response.servers;
                                $scope.hostTableModel.totalRecords = response.total;
                            });
                        });
                        **/
                    },
                    //主机操作，包括上电下电重启
                    hostAction: function (params) {
                        var actionConfig = deviceConstants.rest.HOST_ACTION;
                        var deferred = camel.post({
                            "url": {s: actionConfig.url, o: {"id": params.serverId, "action": params.action}},
                            "type": actionConfig.type,
                            "params": JSON.stringify({"powerMode": params.powerMode}),
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (data) {
                            $scope.operate.queryHostsData();
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                };

                //初始化数据
                $scope.operate.queryAppsData();
                //$scope.operate.getZones();

            }]
            ;
        return appsCtrl;
    })
;

