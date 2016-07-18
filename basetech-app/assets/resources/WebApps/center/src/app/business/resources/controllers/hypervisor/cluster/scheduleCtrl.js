/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Tabs",
    "tiny-widgets/Window",
    "app/services/exceptionService","fixtures/hypervisorFixture"
], function ($, angular,Tabs,Window, Exception) {
    "use strict";

    var scheduleCtrl = ["$scope", "$stateParams", "$state","$compile", "camel", function ($scope, $stateParams,$state, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_clusterHandle_value;
        $scope.clusterName = $stateParams.clusterName;
        var clusterId = $stateParams.clusterId;
        var hyperId = $stateParams.hyperId;
        $scope.help = {
            show : false
        };
        var levels = {
            1: $scope.i18n.common_term_manual_label || "手动",
            3: $scope.i18n.common_term_auto_label || "自动"
        };
        var factors = {
            1: "CPU",
            2: $scope.i18n.common_term_memory_label || "内存",
            3: $scope.i18n.common_term_CPUandMemory_label || "CPU和内存"
        };
        var balances = {
            0: $scope.i18n.common_term_notBalance_value || "已失衡",
            1: $scope.i18n.common_term_onBalance_value || "已平衡",
            2: $scope.i18n.common_term_other_label || "其他"
        };
        var limens ={
            1: $scope.i18n.common_term_conservative_label || "保守",
            5: $scope.i18n.common_term_medium_label || "中等",
            9: $scope.i18n.common_term_radical_label || "激进"
        };
        //页签
        $scope.plugins = [{
            "openState": "resources.clusterInfo.schedule.suggest",
            "name": $scope.i18n.common_term_advice_label || "建议"
        },{
            "openState": "resources.clusterInfo.schedule.history",
            "name":  $scope.i18n.common_term_history_label || "历史"
        }];

        $scope.setScheduleButton = {
            "id": "setScheduleButtonId",
            "text":  $scope.i18n.virtual_term_setSchedule_button || "设置计算资源调度",
            "click": function () {
                var options = {
                    "winId": "setScheduleWindow",
                    "title": $scope.i18n.virtual_term_setSchedule_button || "设置计算资源调度",
                    "clusterId":clusterId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/cluster/setSchedule.html",
                    "height": 700,
                    "width":1024,
                    "close":function(){
                        getData();
                    }
                };
                if($scope.hyperType === "VMware"){
                    options.content = "app/business/resources/views/hypervisor/cluster/vmwareSetSchedule.html";
                    options.height = 500;
                    options.width = 900;
                }
                var newWindow = new Window(options);
                newWindow.show();
            }
        };
        function getHypervisor() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id:  hyperId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                $scope.hyperType = data.hypervisor.type;
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function getData() {
            var deferred = camel.get({
                "url": {s:"/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs",o:{id:clusterId}},
                "params": null,
                "userId":user.id
            });
            deferred.success(function (data) {
                var drsParams = data.drsParams || {};
                $scope.$apply(function () {
                    $scope.drsLevel = levels[drsParams.drsLevel] || drsParams.drsLevel;
                    $scope.factor = factors[drsParams.factor] || drsParams.factor;
                    $scope.drsBalance = balances[drsParams.drsBalance] || drsParams.drsBalance;
                    $scope.drsLimen = limens[drsParams.drsLimen] || drsParams.drsLimen;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        getData();
        getHypervisor();
    }];
    return scheduleCtrl;
});
