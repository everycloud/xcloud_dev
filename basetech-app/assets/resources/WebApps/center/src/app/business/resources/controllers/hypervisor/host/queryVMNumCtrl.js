/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService",
	"fixtures/hypervisorFixture"], function ($,angular, Message, httpService, Exception) {
    "use strict";
    var queryVMNumCtrl = ["$scope", "camel", function ($scope,camel) {
        var exceptionService = new Exception();
        var window = $("#queryVMNumWindow").widget();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var hostId = window.option("hostId");

		$scope.label = {
			"runningVMnum": $scope.i18n.perform_term_runningVMnum_label + ":",
			"troubleVMnum": $scope.i18n.perform_term_troubleVMnum_label + ":"
		};
		$scope.info = {
			"runningVMnum": "",
			"troubleVMnum": ""
		};
        //取消按钮
        $scope.cancelButton = {
            "id": "queryVMNumCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function queryVMNum(stateList,type) {
			var params = {
				"queryInSystem": false,
				"hostId": hostId
			}
			var deferred = camel.post({
				"url": {s: "/goku/rest/v1.5/irm/{tenant_id}/vms/statistics", o: {"tenant_id": "1"}},
				"userId": user.id,
				"timeout": 30000,
				"params": JSON.stringify(params)
			});
			deferred.done(function (response) {
				$scope.$apply(function () {
					if(response){
						$scope.info.runningVMnum =  response.runningQuantity;
						$scope.info.troubleVMnum = response.faultQuantity;
					}
				});

			});
        }
        queryVMNum();
    }];

    var antiVirusModule = angular.module("resources.host.queryVMNum", ["ng"]);
    antiVirusModule.service("camel", httpService);
    antiVirusModule.controller("resources.host.queryVMNum.ctrl", queryVMNumCtrl);
    return antiVirusModule;
});