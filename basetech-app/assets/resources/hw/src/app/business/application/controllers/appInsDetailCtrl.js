define(["tiny-lib/angular",
    'tiny-widgets/Tabs',
    'fixtures/appDetailFixture'],
    function (angular, Tabs) {
        "use strict";

        var appDetailCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {
        	
        	$scope.params = {
        			appId:$stateParams.appId
        	}
        	
        	 var detailLayout = new Layout({
                 "id": "appDetailLayout"
             });
             $scope.$on("$stateChangeSuccess", function () {
                 detailLayout.opActive($("a[ui-sref='" + $state.$current.name + "']"));
             })
        	
        	$scope.appDetailLabels = {
        			"app_detail_crumbs_apps" : "应用管理",
        			"app_detail_tabs_resource" : "资源列表",
        			"app_detail_tabs_param" : "参数设置",
        			"app_detail_tabs_event" : "事件",
        			"app_detail_tabs_alarm" : "告警",
        			"app_detail_tabs_log" : "运行日志",
        			"app_detail_tabs_monitor" : "监控",
        			"app_detail_tabs_scale" : "弹性伸缩",
        			
        	};

            $scope.plugins = [
                {
                    "openState": "apps.detail.resources",
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
            
            fuction getAppDetail(){
            	app = {
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
    	            	
    	            };
            	$scope.appInfo = app;
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
            getAppDetail();
        }];

        return appDetailCtrl;
    });
