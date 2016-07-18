/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-widgets/Select",
    "tiny-common/UnifyValid",
    "app/services/exceptionService",
        "app/business/resources/services/cluster/clusterService",
    "fixtures/hypervisorFixture"],
    function ($, angular, Layout, Window, Message, Select, UnifyValid, Exception, clusterService) {
        "use strict";

        var setScheduleCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var i18n = $scope.i18n || {};
            var window = $("#setScheduleWindow").widget();
            var clusterId = window.option("clusterId");

            $scope.label = {
                manual: i18n.virtual_cluster_schedul_para_autoLevel_mean_manual_label||"系统仅根据资源使用情况在“资源调度”界面给出建议，用户可根据系统建议选择执行调度任务。",
                auto: i18n.virtual_cluster_schedul_para_autoLevel_mean_auto_label||"虚拟机会自动迁移达到资源利用最优化。",
                limen_1: i18n.virtual_cluster_schedul_para_threshold_mean_conservative_label||"不干预集群内各主机间明显的资源利用率差别",
                limen_2: i18n.virtual_cluster_schedul_para_threshold_mean_medium_label||"改善集群内各主机间明显的资源利用率差别",
                limen_3: i18n.virtual_cluster_schedul_para_threshold_mean_radical_label||"改善集群内各主机间细微的资源利用率差别"
            };
            //开启计算资源调度复选框
            $scope.openCheckbox = {
                id: "openScheduleCheckbox",
                "label": "",
                text: i18n.common_term_turnOnComputeSchedul_button||"开启计算资源调度",
                "checked": false,
                "change": function () {
                    $scope.drsSwitch = $("#" + $scope.openCheckbox.id).widget().option("checked");
                    $("#" + $scope.automateRadio.id).widget().opDisabled("1", !$scope.drsSwitch);
                    $("#" + $scope.automateRadio.id).widget().opDisabled("3", !$scope.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("1", !$scope.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("5", !$scope.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("9", !$scope.drsSwitch);
                }
            };
            //自动化级别单选组
            $scope.automateRadio = {
                "id": "automateRadio",
                "label": (i18n.common_term_autoLevel_label||"自动化级别")+":",
                "values": [
                    {
                        "key": "1",
                        "text": i18n.common_term_manual_label||"手动",
                        "checked": true,
                        "disable": true
                    },
                    {
                        "key": "3",
                        "text": i18n.common_term_auto_label||"自动",
                        "checked": false,
                        "disable": true
                    }
                ],
                "layout": "vertical",
                "spacing": {
                    "height": "65px"
                },
                "change": function () {
                }
            };
            //衡量因素单选组
            $scope.limenRadio = {
                "id": "limenRadio",
                "label": (i18n.resource_term_MigrateThreshold_label||"迁移阀值")+":",
                "values": [
                    {
                        "key": "1",
                        "text": i18n.common_term_conservative_label||"保守",
                        "disable": true
                    },
                    {
                        "key": "5",
                        "text": i18n.common_term_medium_label||"中等",
                        "disable": true
                    },
                    {
                        "key": "9",
                        "text": i18n.common_term_radical_label||"激进",
                        "disable": true
                    }
                ],
                "layout": "vertical",
                "change": function () {

                }
            };

            //确定按钮
            $scope.okButton = {
                "id": "setScheduleOkButton",
                "text":  $scope.i18n.common_term_ok_button,
                "click": function () {
                    setSchedule();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "setScheduleCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getSchedule() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs", o: {id: clusterId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var drsParams = data.drsParams || {};
                    $("#" + $scope.openCheckbox.id).widget().option("checked", drsParams.drsSwitch);

                    $("#" + $scope.automateRadio.id).widget().opChecked("" + drsParams.drsLevel, true);
                    $("#" + $scope.automateRadio.id).widget().opDisabled("1", !drsParams.drsSwitch);
                    $("#" + $scope.automateRadio.id).widget().opDisabled("3", !drsParams.drsSwitch);

                    $("#" + $scope.limenRadio.id).widget().opChecked("" + drsParams.drsLimen, true);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("1", !drsParams.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("5", !drsParams.drsSwitch);
                    $("#" + $scope.limenRadio.id).widget().opDisabled("9", !drsParams.drsSwitch);
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function setSchedule() {
                var params = {
                    drsSwitch: $("#" + $scope.openCheckbox.id).widget().option("checked"),
                    drsLevel: $("#" + $scope.automateRadio.id).widget().opChecked("checked"),
                    drsLimen: $("#" + $scope.limenRadio.id).widget().opChecked("checked")
                };
                var deferred = camel.put({
                    "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs", o: {id: clusterId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getSchedule();
        }];

        var setScheduleApp = angular.module("vmwareSetScheduleApp", ['framework']);
        setScheduleApp.controller("resources.clusterInfo.vmwareSetSchedule.ctrl", setScheduleCtrl);
        return setScheduleApp;
    }
);
