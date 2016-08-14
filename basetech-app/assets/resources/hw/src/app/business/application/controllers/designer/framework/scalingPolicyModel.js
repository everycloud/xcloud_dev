define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "./DesignerValid",
        "tiny-directives/FormField",
        "tiny-directives/Button",
        "tiny-directives/Textbox",
        "tiny-directives/Select",
        'tiny-directives/Radio',
        'tiny-directives/RadioGroup'
    ],
    function ($, angular, _, UnifyValid) {
        "use strict";
        var ctrl = ["$scope",
            function ($scope) {
                var i18n = $("html").scope().i18n;
                $scope.i18n = i18n;
                $scope.mode = $("#addScalingPolicy").widget().option("mode");
                $scope.actionTypeScalingOut = true;
                $scope.values = {
                    "name": "",
                    "description": "",
                    "metricCondition": {
                        "StatisticsPeriod": "5",
                        "CollectionTimes": "1", //1~30
                        "Configurations": [{
                            "id": "configuration-1",
                            "MetricType": "CPU",
                            "StatisticType": "AVERAGE",
                            "CompareOperator": "GE",
                            "MetricValue": "1",
                            "cell": "%",

                            "tooltip": UnifyValid.validateInfo.configP,
                            "extendFunction": ["configP"],
                            "validate": UnifyValid.validateInfo.getConfigP(),

                            "Ktooltip": UnifyValid.validateInfo.configK,
                            "KextendFunction": ["configK"],
                            "Kvalidate": UnifyValid.validateInfo.getConfigK()
                        }]
                    },
                    "action": {
                        "ActionType": "SCALEOUT", //SCALEOUT or SCALEIN, AWAKE
                        "CoolDown": "0", //0~30
                        "AdjustStep": {
                            "StepType": "ABS",
                            "StepValue": "1" //1~10
                        }
                    }
                };
                $scope.metricTypes = {
                    "values": [{
                        "selectId": "CPU",
                        "label": i18n.perform_term_CPUusageRate_label
                    }, {
                        "selectId": "MEMORY",
                        "label": i18n.perform_term_memUsageRate_label
                    }, {
                        "selectId": "DISKIN",
                        "label": i18n.common_term_diskWriteSpeed_label
                    }, {
                        "selectId": "DISKOUT",
                        "label": i18n.common_term_diskReadSpeed_label
                    }, {
                        "selectId": "NETIN",
                        "label": i18n.common_term_netInRate_label
                    }, {
                        "selectId": "NETOUT",
                        "label": i18n.common_term_netOutRate_label
                    }],
                    "change": function (index) {
                        var type = $("#metricTypes" + index).widget().getSelectedId();
                        $scope.values.metricCondition.Configurations[index].MetricType = type;
                        if (type === "CPU" || type === "MEMORY") {
                            $scope.values.metricCondition.Configurations[index].cell = "%";
                        } else {
                            $scope.values.metricCondition.Configurations[index].cell = "KB/s";
                        }
                    }
                };
                $scope.statisticTypes = [{
                    "selectId": "AVERAGE",
                    "label":i18n.common_term_AvgValue_label,
                    "checked": true
                }];
                $scope.compareOperators = {
                    "values": [{
                        "selectId": "GE",
                        "label": ">="
                    }, {
                        "selectId": "LE",
                        "label": "<="
                    }],
                    "change": function (index) {
                        var type = $("#compareOperators" + index).widget().getSelectedId();
                        $scope.values.metricCondition.Configurations[index].CompareOperator = type;
                    }
                };
                $scope.enableIcon = {
                    addIcon: "../theme/default/images/design-add.png",
                    modifyIcon: "../theme/default/images/design-modify.png",
                    deleteIcon: "../theme/default/images/design-delete.png"
                };

                $scope.addMetricCondition = function () {
                    if ($scope.values.metricCondition.Configurations.length >= 6) {
                        return;
                    }
                    var configurations = [];
                    _.each($scope.values.metricCondition.Configurations, function (item, index) {
                        item.id = "configuration-" + index;
                        item.cell = "%";
                        configurations.push(item);
                    });
                    var newItem = {
                        "id": "configuration-" + (configurations.length - 1),
                        "MetricType": "CPU",
                        "StatisticType": "AVERAGE",
                        "CompareOperator": "GE",
                        "MetricValue": "1",
                        "cell": "%",

                        "tooltip": UnifyValid.validateInfo.configP,
                        "extendFunction": ["configP"],
                        "validate": UnifyValid.validateInfo.getConfigP(),

                        "Ktooltip": UnifyValid.validateInfo.configK,
                        "KextendFunction": ["configK"],
                        "Kvalidate": UnifyValid.validateInfo.getConfigK()
                    };
                    configurations.push(newItem);
                    $scope.values.metricCondition.Configurations = configurations;
                };
                $scope.deleteMetricCondition = function (index) {
                    if (index === 0) {
                        return;
                    }
                    var configurations = _.filter($scope.values.metricCondition.Configurations, function (item, idx) {
                        return idx !== index;
                    });
                    $scope.values.metricCondition.Configurations = configurations;
                };


                $scope.scalingpolicy = {
                    "name": {
                        label: i18n.common_term_name_label+":",
                        require: true,
                        "tooltip": UnifyValid.validateInfo.name,
                        "extendFunction": ["name"],
                        "validate": UnifyValid.validateInfo.getRequiredName(),
                        id: "scalingpolicy-name",
                        width: "140px"
                    },
                    "description": {
                        label: i18n.common_term_desc_label+":",
                        require: false,
                        "tooltip": UnifyValid.validateInfo.description,
                        "extendFunction": ["description"],
                        "validate": UnifyValid.validateInfo.getDescription(),
                        id: "scalingpolicy-description",
                        width: "140px",
                        type: "mult"
                    },
                    "statisticsPeriod": {
                        label: i18n.user_policy_set_para_periodMinu_label+":",
                        id: "scalingpolicy-statisticsPeriod",
                        width: "140px",
                        "values": [{
                            "selectId": "5",
                            "label": "5",
                            "checked": true
                        }, {
                            "selectId": "10",
                            "label": "10"
                        }, {
                            "selectId": "15",
                            "label": "15"
                        }, {
                            "selectId": "20",
                            "label": "20"
                        }],
                        "change": function () {
                            var selectedId = $("#scalingpolicy-statisticsPeriod").widget().getSelectedId();
                            $scope.values.metricCondition.StatisticsPeriod = selectedId;
                        }
                    },
                    "collectionTimes": {
                        label: i18n.common_term_seriality_label+":",
                        require: true,
                        "tooltip": UnifyValid.validateInfo.collectionTimes,
                        "extendFunction": ["collectionTimes"],
                        "validate": UnifyValid.validateInfo.getCollectionTimes(),
                        id: "scalingpolicy-collectionTimes",
                        width: "140px"
                    },
                    "actionType": {
                        label: i18n.common_term_actionType_label+":",
                        id: "scalingpolicy-actionType",
                        require: true,
                        width: "140px",
                        "values": [{
                            "selectId": "SCALEOUT",
                            "label": i18n.common_term_expanding_button,
                            "checked": true
                        }, {
                            "selectId": "SCALEIN",
                            "label": i18n.common_term_capacityReduction_button
                        }],
                        "change": function () {
                            var selectedId = $("#scalingpolicy-actionType").widget().getSelectedId();
                            $scope.values.action.ActionType = selectedId;
                            if (selectedId === "SCALEOUT") {
                                $scope.actionTypeScalingOut = true;
                            } else {
                                $scope.actionTypeScalingOut = false;
                            }
                        }
                    },
                    "scaleOut": {
                        "id": "scalingpolicy-scaleOut",
                        "layout": "horizon",
                        "values": [{
                            "key": "SCALEOUT",
                            "text":i18n.common_term_default_label,
                            "checked": true
                        }, {
                            "key": "POWER",
                            "text": i18n.common_term_startup_button
                        }, {
                            "key": "AWAKE",
                            "text":i18n.common_term_awaken_button
                        }, {
                            "key": "CREATE",
                            "text":i18n.common_term_create_button
                        }],
                        "change": function () {
                            var actionType = $("#scalingpolicy-scaleOut").widget().opChecked("checked");
                            $scope.values.action.ActionType = actionType;
                        }
                    },
                    "scaleIn": {
                        "id": "scalingpolicy-scaleIn",
                        "layout": "horizon",
                        "values": [{
                            "key": "SCALEIN",
                            "text": i18n.common_term_default_label,
                            "checked": true
                        }, {
                            "key": "HALT",
                            "text": i18n.common_term_close_button
                        }, {
                            "key": "SLEEP",
                            "text":i18n.common_term_hibernate_button
                        }, {
                            "key": "REMOVE",
                            "text":i18n.common_term_delete_button
                        }],
                        "change": function () {
                            var actionType = $("#scalingpolicy-scaleIn").widget().opChecked("checked");
                            $scope.values.action.ActionType = actionType;
                        }
                    },
                    "coolTime": {
                        label: i18n.app_term_coolingTimeMinu_label+":",
                        require: true,
                        "tooltip": UnifyValid.validateInfo.coolTime,
                        "extendFunction": ["coolTime"],
                        "validate": UnifyValid.validateInfo.getCoolTime(),
                        id: "scalingpolicy-coolDown",
                        width: "140px"
                    },
                    "step": {
                        label: i18n.app_policy_add_para_step_label+":",
                        require: true,
                        "tooltip": UnifyValid.validateInfo.step,
                        "extendFunction": ["step"],
                        "validate": UnifyValid.validateInfo.getStep(),
                        id: "scalingpolicy-step",
                        width: "140px"
                    }
                };

                $scope.okBtn = {
                    "id": "scalinggroup-ok",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var tName = UnifyValid.FormValid($("#scalingpolicy-name"));
                        var tDes = UnifyValid.FormValid($("#scalingpolicy-description"));
                        var tcolTime = UnifyValid.FormValid($("#scalingpolicy-collectionTimes"));
                        var tcoolDwn = UnifyValid.FormValid($("#scalingpolicy-coolDown"));
                        var tstep = UnifyValid.FormValid($("#scalingpolicy-step"));
                        var tconfigs = $scope.validConfigs();
                        if (!tName || !tDes || !tcolTime || !tcoolDwn || !tstep || !tconfigs) {
                            return;
                        }

                        var name = $("#scalingpolicy-name").widget().getValue();
                        var description = $("#scalingpolicy-description").widget().getValue();
                        var collectionTimes = $("#scalingpolicy-collectionTimes").widget().getValue();
                        var coolDown = $("#scalingpolicy-coolDown").widget().getValue();
                        var step = $("#scalingpolicy-step").widget().getValue();
                        $scope.values.name = name;
                        $scope.values.description = description;
                        $scope.values.metricCondition.CollectionTimes = collectionTimes;
                        $scope.values.action.CoolDown = coolDown;
                        $scope.values.action.AdjustStep.StepValue = step;

                        var scope = $("#addScalingPolicy").widget().option("scope");
                        scope.addScalingPolicy($scope.mode, $scope.values.id, $scope.getScalingPolicy());
                        $("#addScalingPolicy").widget().destroy();
                    }
                };
                $scope.cancelBtn = {
                    "id": "scalinggroup-cancelBtn",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#addScalingPolicy").widget().destroy();
                    }
                };
                $scope.getScalingPolicy = function () {
                    var scalingPolicy = {
                        "name": $scope.values.name,
                        "description": $scope.values.description,
                        "metricCondition": {
                            "StatisticsPeriod": $scope.values.metricCondition.StatisticsPeriod,
                            "CollectionTimes": $scope.values.metricCondition.CollectionTimes,
                            "Configurations": []
                        },
                        "action": {
                            "ActionType": $scope.values.action.ActionType,
                            "CoolDown": $scope.values.action.CoolDown,
                            "AdjustStep": {
                                "StepType": "ABS",
                                "StepValue": $scope.values.action.AdjustStep.StepValue
                            }
                        }
                    };
                    _.each($scope.values.metricCondition.Configurations, function (item, index) {
                        scalingPolicy.metricCondition.Configurations.push({
                            "MetricType": item.MetricType,
                            "StatisticType": item.StatisticType,
                            "CompareOperator": item.CompareOperator,
                            "MetricValue": $("#metricValue" + index).widget().getValue()
                        });
                    });
                    return scalingPolicy;
                };

                $scope.validConfigs = function () {
                    var result = true;
                    _.each($scope.values.metricCondition.Configurations, function (item, index) {
                        result = result && UnifyValid.FormValid($("#metricValue" + index));
                    });
                    return result;
                };

                $scope.setActionTypeValues = function (actionType) {
                    if (actionType === "SCALEOUT" || actionType === "POWER" || actionType === "AWAKE" || actionType === "CREATE") {
                        _.each($scope.scalingpolicy.actionType.values, function (item, index) {

                            if (item.selectId === "SCALEOUT") {
                                item.checked = true;
                            } else {
                                item.checked = false;
                            }

                        });
                        _.each($scope.scalingpolicy.scaleOut.values, function (itemA, index) {
                            if (itemA.key === actionType) {
                                itemA.checked = true;
                            } else {
                                itemA.checked = false;
                            }
                        });
                        $scope.actionTypeScalingOut = true;
                        return;
                    }
                    _.each($scope.scalingpolicy.actionType.values, function (item, index) {
                        if (item.selectId === "SCALEIN") {
                            item.checked = true;
                        } else {
                            item.checked = false;
                        }
                    });
                    _.each($scope.scalingpolicy.scaleIn.values, function (itemA, index) {
                        if (itemA.key === actionType) {
                            itemA.checked = true;
                        } else {
                            itemA.checked = false;
                        }
                    });
                    $scope.actionTypeScalingOut = false;
                };

                $scope.setValues = function () {
                    var scalingPolicy = $("#addScalingPolicy").widget().option("scalingGroup");
                    if ($scope.mode === "create" || !scalingPolicy) {
                        return;
                    }
                    $scope.values = {
                        "name": scalingPolicy.name,
                        "description": scalingPolicy.description,
                        "metricCondition": {
                            "StatisticsPeriod": scalingPolicy.metricCondition.StatisticsPeriod,
                            "CollectionTimes": scalingPolicy.metricCondition.CollectionTimes,
                            "Configurations": []
                        },
                        "action": {
                            "ActionType": scalingPolicy.action.ActionType,
                            "CoolDown": scalingPolicy.action.CoolDown,
                            "AdjustStep": {
                                "StepType": scalingPolicy.action.AdjustStep.StepType,
                                "StepValue": scalingPolicy.action.AdjustStep.StepValue
                            }
                        }
                    };
                    var Configurations = [];
                    _.each(scalingPolicy.metricCondition.Configurations, function (item, index) {
                        Configurations.push({
                            "MetricType": item.MetricType,
                            "StatisticType": item.StatisticType,
                            "CompareOperator": item.CompareOperator,
                            "MetricValue": item.MetricValue,
                            "cell": (item.MetricType === "CPU" || item.MetricType === "MEMORY") ? "%" : "KB/s",

                            "tooltip": UnifyValid.validateInfo.configP,
                            "extendFunction": ["configP"],
                            "validate": UnifyValid.validateInfo.getConfigP(),

                            "Ktooltip": UnifyValid.validateInfo.configK,
                            "KextendFunction": ["configK"],
                            "Kvalidate": UnifyValid.validateInfo.getConfigK()
                        });
                    });
                    $scope.values.metricCondition.Configurations = Configurations;
                    $scope.values.id = scalingPolicy.id;

                    var actionType = scalingPolicy.action.ActionType;
                    $scope.setActionTypeValues(actionType);
                };

                $scope.setValues();
            }
        ];
        var scalingPolicy = angular.module("designerScalingGroupModel", ["ng", "wcc"]);
        scalingPolicy.controller("ctrl", ctrl);

        return scalingPolicy;
    });
