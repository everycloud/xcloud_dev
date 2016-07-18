define(['jquery',
	'tiny-lib/angular',
	"tiny-widgets/Message",
	"app/services/httpService",
	"app/services/exceptionService"],
	function ($, angular, Message, httpService, Exception) {
		"use strict";
		var enableMaintenCtrl = ["$scope", "$compile", "validator", "camel", "$stateParams", function ($scope, $compile, validator, camel, $stateParams) {
			var exceptionService = new Exception();
			var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
			var $state = $("html").injector().get("$state");
			var window = $("#enableMaintenWindow").widget();
			var hostId = window.option("hostId");
            var hyperId = $stateParams.hyperId;
            var storeId = $stateParams.storeId;

			$scope.migrateAllVmsCheckBox = {
                "show":false,
				"id": "migrateAllVmsCheckBoxId",
				"text": $scope.i18n.virtual_host_turnMaintenance_info_migrate_msg,
				"change": function () {
				}
			}
            if(storeId)
            {
                getStore();
            }
            if(hyperId)
            {
                getHypervisor();
            }
			//确定按钮
			$scope.okButton = {
				"id": "createDiskOkButton",
				"text": $scope.i18n.common_term_ok_button,
				"disable": true,
				"click": function () {
					$scope.operate.opertorHost();
				}
			};
			//取消按钮
			$scope.cancelButton = {
				"id": "createDiskCancelButton",
				"text": $scope.i18n.common_term_cancle_button,
				"click": function () {
					window.destroy();
				}
			};
            function getHypervisor() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id:  hyperId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if(data && data.hypervisor.type)
                    {
                        if("FUSIONCOMPUTE" === data.hypervisor.type.toUpperCase())
                        {
                            $scope.migrateAllVmsCheckBox.show = true;
                            $scope.$digest();
                        }
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getStore() {
                var params = {
                    "detail": "0",
                    "scopeType": "DATASTORE",
                    "scopeObjectId": storeId
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                    "params": JSON.stringify(params),
                    "userId":user.id
                });
                deferred.success(function (data) {
                    if(data)
                    {
                        var store = data.datastoreInfos[0];
                        if(store && store.hypervisorType)
                        {
                            if("FUSIONCOMPUTE" === store.hypervisorType.toUpperCase())
                            {
                                $scope.migrateAllVmsCheckBox.show = true;
                                $scope.$digest();
                            }
                        }
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };
			$scope.operate = {
				"opertorHost": function () {
					var params = {};
					params.operType = "enablemainten";
					var isEnable = $("#migrateAllVmsCheckBoxId").widget().option("checked");
					if (isEnable) {
						params.migrateAllVms = true;
					}
					params = JSON.stringify(params);
					var deferred = camel.post({
						"url": {s: "/goku/rest/v1.5/irm/1/hosts/{id}/action", o: {id: hostId}},
						"params": params,
						"userId": user.id
					});
					deferred.done(function (data) {
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
										msg.destroy();
										$("#enableMaintenWindow").widget().destroy();
										$state.go("system.taskCenter");
									}
								},
								{
									label: $scope.i18n.common_term_cancle_button,
									default: false,
									handler: function (event) {
										msg.destroy();
										$("#enableMaintenWindow").widget().destroy();
									}
								}
							]
						}
						var msg = new Message(options);
						msg.show();

					});
					deferred.fail(function (data) {
						exceptionService.doException(data);
					});
				}
			};

		}];

		var enableMaintenApp = angular.module("enableMaintenApp", ['framework']);
		enableMaintenApp.service("camel", httpService);
		enableMaintenApp.controller("resources.hypervisor.host.enableMainten.ctrl", enableMaintenCtrl);
		return enableMaintenApp;
	}
);
