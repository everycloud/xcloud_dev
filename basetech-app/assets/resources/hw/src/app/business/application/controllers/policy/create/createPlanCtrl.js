/* global define */
define([
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "ui-router/angular-ui-router",
    'app/business/application/services/appCommonService',
    "tiny-directives/Textbox",
    "tiny-directives/Step",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-directives/Step",
    "tiny-directives/Table",
    "tiny-directives/RadioGroup",
    "tiny-directives/Select",
    "fixtures/policyConfigFixture"
], function ($, angular, router, appCommonService) {
    "use strict";

    var ctrl = ["$scope", "$stateParams", "$state", "$q", "camel", "exception",
        function ($scope, $stateParams, $state, $q, camel, exception) {
            $scope.serviceIns = new appCommonService(exception, $q, camel);
            var user = $scope.user;
            var i18n = $scope.i18n;
            //对于修改场景需要查完详情才能下一步
            $scope.params = {
                "userId": user.id,
                "vdcId": user.vdcId,
                "cloudInfraId": $stateParams.cloudInfraId,
                "id": $stateParams.id,
                "action": $stateParams.action,
                "initFinished": false
            };
            if ($scope.params.action === "modify") {
                $scope.params.initFinished = false;
            } else {
                $scope.params.initFinished = true;
            }

            //不能向data中再添加任何变量，因为它直接传为参数传递到后台
            $scope.data = {
                "name": "",
                "description": "",
                "triggerType": "ONCE", //默认定时触发
                "periodType": null,
                "policies": [],
                "dateAndTimeList": []
            };
            //只为在修改场景首次加载时对周期的判断处理
            $scope.dateAndTimeListModifyFirst = [];

            // 定时触发的触发日期（本地时间）
            $scope.triggerDate = {
                "localDate": ""
            };

            $scope.close = function () {
                $state.go("application.manager.policy.plan");
            };

            $scope.service = {
                "step": {
                    "id": "create-plan-step",
                    "values": [i18n.common_term_basicInfo_label, i18n.app_term_associateIntraPolicy_button, i18n.common_term_confirmInfo_label],
                    "width": 592,
                    "jumpable": false
                },
                "show": "basic"
            };

            //查询计划任务详情,用于修改场景
            $scope.queryScheduleTask = function () {
                var promise = $scope.serviceIns.queryScheduleTask({
                    "vdcId": $scope.params.vdcId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "id": $scope.params.id
                });
                promise.then(function (data) {
                    if (!data || !data.scheduleTask) {
                        return;
                    }
                    $scope.data.name = data.scheduleTask.name;
                    $scope.data.description = data.scheduleTask.description;
                    $scope.data.triggerType = data.scheduleTask.triggerType;
                    $scope.data.periodType = data.scheduleTask.periodType;
                    $scope.data.policies = data.scheduleTask.policies;
                    $scope.data.dateAndTimeList = data.scheduleTask.dateAndTimeList;
                    $scope.dateAndTimeListModifyFirst = data.scheduleTask.dateAndTimeList;
                    $scope.params.initFinished = true;
                    $scope.$emit("triggerPlanModifyInit");
                });
            };

            $scope.init = function () {
                if ($scope.params.action === "modify") {
                    $scope.queryScheduleTask();
                }
            };
            $scope.init();

            $scope.$on("triggerPlanModifyInit", function () {
                $scope.$broadcast("triggerPlanModifyInitBasic");
            });
            $scope.$on("triggerPolicyPageLoadEvent", function () {
                $scope.$broadcast("initLoadPolicyEvent");
            });
            $scope.$on("triggerConfirmPageLoadEvent", function () {
                $scope.$broadcast("initLoadConfirmEvent");
            });
        }
    ];

    return ctrl;
});
