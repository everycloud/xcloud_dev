define(["jquery",
    "tiny-lib/angular",
    "app/business/resources/controllers/constants",
    'tiny-widgets/Message',
    "app/business/resources/services/exceptionService",
    "language/ame-rpool-exception"],
    function ($, angular, constants, Message, exceptionService, ameException) {
        "use strict";

        var distributionCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$interval","$timeout",
            function ($scope, $compile, $state, $stateParams, camel, $interval, $timeout) {

                $scope.service = {
                    step: {
                        "id": "vmTemplateCreateStep",
                        "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.template_term_chooseVM_label, $scope.i18n.common_term_basicInfo_label],
                        "width": 450,
                        "jumpable": false
                    },

                    vmStatus :{
                        running: $scope.i18n.common_term_running_value,
                        stopped: $scope.i18n.common_term_stoped_value,
                        hibernated: $scope.i18n.common_term_hibernated_value,
                        creating: $scope.i18n.common_term_creating_value,
                        create_failed: $scope.i18n.common_term_createFail_value,
                        create_success: $scope.i18n.common_term_createSucceed_value,
                        starting: $scope.i18n.common_term_startuping_value,
                        stopping: $scope.i18n.common_term_stoping_value,
                        migrating: $scope.i18n.common_term_migrating_value,
                        shutting_down: $scope.i18n.common_term_deleting_value,
                        fault_resuming: $scope.i18n.common_term_trouble_label,
                        hibernating: $scope.i18n.common_term_hibernating_value,
                        rebooting: $scope.i18n.common_term_restarting_value,
                        pause: $scope.i18n.common_term_pause_value,
                        recycling: $scope.i18n.common_term_reclaiming_value,
                        unknown: $scope.i18n.common_term_unknown_value
                    },

                    show: "baseInfo",

                    vmList:[],

                    model: {}
                };

                $scope.buttonGroup = {
                    label: "",
                    require: false
                };

                /**
                 * 事件定义
                 */
                $scope.distributionEvents = {
                    "baseInfoChanged": "baseInfoChanged",
                    "vmSelected": "vmSelected",
                    "vmSelectedFromParent": "vmSelectedFromParent",
                    "baseInfoChangedFromParent": "baseInfoChangedFromParent"
                };

                // 事件转发
                $scope.$on($scope.distributionEvents.baseInfoChanged, function (event, msg) {
                    $scope.$broadcast($scope.distributionEvents.baseInfoChangedFromParent, msg);
                });
                $scope.$on($scope.distributionEvents.vmSelected, function (event, msg) {
                    $scope.$broadcast($scope.distributionEvents.vmSelectedFromParent, msg);
                });

                /**
                 * 初始化操作
                 */
                $scope.init = function () {
                    // 查询软件包基本信息
                };

                $scope.init();
            }];

        return distributionCtrl;
    });
