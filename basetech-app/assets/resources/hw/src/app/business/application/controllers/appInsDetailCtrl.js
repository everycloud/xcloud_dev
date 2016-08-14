define(["tiny-lib/underscore",
        "tiny-lib/angular",
    'tiny-widgets/Tabs'],
    function (_, angular, Tabs) {
        "use strict";

        var appDetailCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {
        	
        	$scope.params = {
        			appId:$stateParams.appId
        	}
        	
        	
        	$scope.appDetailLabels = {
        			"app_detail_crumbs_apps" : "应用管理",
        			"app_detail_labels_created_time": "创建时间：",
        			"app_detail_labels_template": "使用的模板：",
        			"app_detail_labels_description": "描述：",
        			"app_detail_labels_status": "状态：",
        			"app_detail_btn_stop" : " 停止",
        			"app_detail_btn_start" : "启动",
        			"app_detail_btn_update_template" : "更新模板",
        			"app_detail_btn_upgrade" : "升级应用",
        			"app_detail_btn_rollback" : "回滚应用",
        			"app_detail_btn_delete" : "删除应用",
        			"app_detail_btn_more" : "更多",
        			"app_detail_tabs_resource" : "资源列表",
        			"app_detail_tabs_param" : "参数设置",
        			"app_detail_tabs_event" : "事件",
        			"app_detail_tabs_alarm" : "告警",
        			"app_detail_tabs_log" : "运行日志",
        			"app_detail_tabs_monitor" : "监控",
        			"app_detail_tabs_scale" : "弹性伸缩",
        			
        	};
        	
        	$scope.moreBtn = {
                     "id": "",
                     "text": $scope.appDetailLabels.app_detail_btn_more,
                     "type": "button"
                };

            $scope.plugins = [
                {
                    "openState": "apps.detail.topo",
                    "name": $scope.appDetailLabels.app_detail_tabs_resource,
                    "show":true
                },
                {
                    "openState": "apps.detail.param",
                    "name": $scope.appDetailLabels.app_detail_tabs_param,
                    "show":true
                },
                {
                    "openState": "app.detail.event",
                    "name": $scope.appDetailLabels.app_detail_tabs_event,
                    "show":true
                },
                {
                    "openState": "app.detail.alarm",
                    "name": $scope.appDetailLabels.app_detail_tabs_alarm,
                    "show":true
                },
                {
                    "openState": "app.detail.log",
                    "name": $scope.appDetailLabels.app_detail_tabs_log,
                    "show":true
                },
                {
                    "openState": "app.detail.monitor",
                    "name": $scope.appDetailLabels.app_detail_tabs_monitor,
                    "show":true
                },
                {
                    "openState": "app.detail.scale",
                    "name": $scope.appDetailLabels.app_detail_tabs_scale,
                    "show":true
                }
                
            ];
            
            function getAppDetail(){
            	var app = {
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
    	            	"description": "这是一个测试的应用",
    	            	"picture": "/resources/hw/theme/default/images/gm/appImage/buff01.jpg",
    	            	"content": getContentByStatus(),
    	            	
    	            };
            	
            	/*_.extend(app, {
                    "content": getContentByStatus(),
            	});*/
            	
            	$scope.appInfo = app;/*
            	_.each($scope.plugins, function(item){
            		var param =  "{appId: " + app.id + "}";
            		item.openState += param;
            			});*/
            	
            	console.log("plugins is ", $scope.plugins);
            }
            
            /**
            function getAppDetail() {
                var jax = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/servers/{serverId}", o: {serverId: $scope.params.hostId}},
                    "userId": $("html").scope().user.id
                });
                jax.done(function (response) {
                    $scope.$apply(function () {
                        if (response && response.servers && response.servers[0]) {
                            var hh = response.servers[0];


                            if (isEmpty(hh.product)) {
                                hh.product = "-";
                            }
                            if (isEmpty(hh.runtimeState) || hh.runtimeState == 0) {
                                hh.status = "-";
                            } else {
                                hh.status = $scope.i18n[SERVER_RUN_STATUS[hh.runtimeState]];
                            }
                            if (isEmpty(hh.resourceState) || hh.resourceState == 0) {
                                hh.resourceStatus = "-";
                            } else {
                                hh.resourceStatus = $scope.i18n[RESOURCE_STATUS[hh.resourceState]];
                            }
                            if (isEmpty(hh.osIp)) {
                                hh.osIp = "-";
                            }
                            if (isEmpty(hh.bmcIp)) {
                                hh.bmcIp = "-";
                            }
                            if(isEmpty(hh.description)){
                                hh.description = "-";
                            }


                            $scope.hostInfo = hh;
                        }
                    });
                });
                jax.fail(function (data) {
                });
            };
            **/
            
            var allMoreBtnContents = {
                    "updateTemplate": {
                        title: "<div class='msg-info'><img src='/resources/hw/theme/default/images/gm/appImage/ssp_common_mod.png'><span class='customMoreItemMargin'>" + $scope.appDetailLabels.app_detail_btn_update_template + "</span></div>",
                        click: function (evt, item, widgetThis) {
                           
                        }
                    },
                    "upgrade": {
                        title: "<div class='msg-info'><img src='/resources/hw/theme/default/images/gm/appImage/ssp_common_mod.png'><span class='customMoreItemMargin'>" + $scope.appDetailLabels.app_detail_btn_upgrade + "</span></div>",
                        click: function (evt, item, widgetThis) {
                           
                        }
                    },
                    "rollback": {
                        title: "<div class='msg-info'><img src='/resources/hw/theme/default/images/gm/appImage/ssp_common_mod.png'><span class='customMoreItemMargin'>" + $scope.appDetailLabels.app_detail_btn_rollback + "</span></div>",
                        click: function (evt, item, widgetThis) {
                           
                        }
                    },
                    "delete": {
                        title: "<div class='msg-info'><img src='/resources/hw/theme/default/images/gm/appImage/ssp_delete.png'><span class='customMoreItemMargin'>" + $scope.appDetailLabels.app_detail_btn_delete + "</span></div>",
                        click: function (evt, item, widgetThis) {
                           
                        }
                    },
                };
            
            //注:这里的tiny-moreBut的内容动态的刷新,无权限时滤掉,状态不允许时灰掉
            function getContentByStatus() {
                var curAppContent = [];
                curAppContent.push(allMoreBtnContents.updateTemplate);
                curAppContent.push(allMoreBtnContents.upgrade);
                curAppContent.push(allMoreBtnContents.rollback);
                curAppContent.push(allMoreBtnContents.delete);
                return curAppContent;
            }
            
            
            getAppDetail();
        }];

        return appDetailCtrl;
    });
