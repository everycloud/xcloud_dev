define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "tiny-lib/underscore",
    "app/business/application/controllers/template/designer/framework/DesignerValid",
    "app/business/application/services/appCommonService",
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-directives/FormField",
    "tiny-directives/Button",
    "tiny-directives/Textbox",
    "tiny-directives/Select",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup'
], function (sprintf, $, angular, ngSanitize, keyIDI18n, _, UnifyValid, service, http, exception) {
    "use strict";
    var ctrl = ["$scope", "$q", "camel", "exception",
        function ($scope, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            $scope.serviceSrv = new service(exception, $q, camel);
            $scope.mode = $("#addScalingPolicy").widget().option("mode");
            $scope.params = $("#addScalingPolicy").widget().option("params");
            var scalingPolicy = $("#addScalingPolicy").widget().option("scalingGroup");
            var policyJSON = $("#addScalingPolicy").widget().option("policyJSON");
            $scope.actionTypeScalingOut = true;

            $scope.values = {
                "policyName": "",
                "policyDesc": "",
                "actionType": "SCALEOUT", //SCALEOUT or SCALEIN, AWAKE
                "cooldown": 0, //0~30
                "adjustmentType": "ABS", // ABS,PER
                "adjustStep": 1, //1~10
                "statisticsPeriod": 5,
                "times": 1,
                "metrics": [{
                    "metricType": "CPU", //CPU,MEMORY,NETIN,NETOUT,DISKIN,DISKOUT
                    "statisticType": "AVERAGE", //AVERAGE,MAXIMUM,MINIMUM,SUM
                    "comparisonOperator": "GE", //GE,LE
                    "metricThreshold": 1,
                    "cell": "%",

                    "tooltip": UnifyValid.validateInfo.configP,
                    "extendFunction": ["configP"],
                    "validate": UnifyValid.validateInfo.getConfigP(),

                    "Ktooltip": UnifyValid.validateInfo.configK,
                    "KextendFunction": ["configK"],
                    "Kvalidate": UnifyValid.validateInfo.getConfigK()
                }]
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
                    "label":i18n.common_term_diskReadSpeed_label
                }, {
                    "selectId": "NETIN",
                    "label":i18n.common_term_netInRate_label
                }, {
                    "selectId": "NETOUT",
                    "label": i18n.common_term_netOutRate_label
                }],
                "change": function (index) {
                    var type = $("#metricTypes" + index).widget().getSelectedId();
                    $scope.values.metrics[index].metricType = type;
                    if (type === "CPU" || type === "MEMORY") {
                        $scope.values.metrics[index].cell = "%";
                    } else {
                        $scope.values.metrics[index].cell = "KB/s";
                    }
                }
            };
            $scope.statisticTypes = [{
                "selectId": "AVERAGE",
                "label": i18n.common_term_AvgValue_label,
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
                    $scope.values.metrics[index].comparisonOperator = type;
                }
            };
            $scope.enableIcon = {
                addIcon: "../theme/default/images/design-add.png",
                modifyIcon: "../theme/default/images/design-modify.png",
                deleteIcon: "../theme/default/images/design-delete.png"
            };

            $scope.scalingpolicy = {
                "name": {
                    label: i18n.common_term_name_label+":",
                    require: true,
                    "tooltip": i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256"),
                    "extendFunction": ["checkName"],
                    "validate": "required: "+i18n.common_term_null_valid+";checkName(true):" + i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256") + ";",
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
                        $scope.values.statisticsPeriod = selectedId;
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
                        $scope.values.actionType = selectedId;
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
                        "text": i18n.common_term_default_label,
                        checked: true
                    }, {
                        "key": "POWER",
                        "text":i18n.common_term_startup_button
                    }, {
                        "key": "AWAKE",
                        "text": i18n.common_term_awaken_button
                    }, {
                        "key": "CREATE",
                        "text": i18n.common_term_create_button
                    }],
                    "change": function () {
                        var actionType = $("#scalingpolicy-scaleOut").widget().opChecked("checked");
                        $scope.values.actionType = actionType;
                    }
                },
                "scaleIn": {
                    "id": "scalingpolicy-scaleIn",
                    "layout": "horizon",
                    "values": [{
                        "key": "SCALEIN",
                        "text": i18n.common_term_default_label,
                        checked: true
                    }, {
                        "key": "HALT",
                        "text": i18n.common_term_close_button
                    }, {
                        "key": "SLEEP",
                        "text": i18n.common_term_hibernate_button
                    }, {
                        "key": "REMOVE",
                        "text": i18n.common_term_delete_button
                    }],
                    "change": function () {
                        var actionType = $("#scalingpolicy-scaleIn").widget().opChecked("checked");
                        $scope.values.actionType = actionType;
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

            $scope.addMetricCondition = function () {
                if ($scope.values.metrics.length >= 6) {
                    return;
                }
                var configurations = [];
                _.each($scope.values.metrics, function (item, index) {
                    configurations.push(item);
                });
                var newItem = {
                    "id": "configuration-" + (configurations.length - 1),
                    "metricType": "CPU",
                    "statisticType": "AVERAGE",
                    "comparisonOperator": "GE",
                    "metricThreshold": "1",
                    "cell": "%",

                    "tooltip": UnifyValid.validateInfo.configP,
                    "extendFunction": ["configP"],
                    "validate": UnifyValid.validateInfo.getConfigP(),

                    "Ktooltip": UnifyValid.validateInfo.configK,
                    "KextendFunction": ["configK"],
                    "Kvalidate": UnifyValid.validateInfo.getConfigK()
                };
                configurations.push(newItem);
                $scope.values.metrics = configurations;
            };
            $scope.deleteMetricCondition = function (index) {
                if ($scope.values.metrics.length <= 1) {
                    return;
                }
                var configurations = _.filter($scope.values.metrics, function (item, idx) {
                    return idx !== index;
                });
                $scope.values.metrics = configurations;
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
                    $scope.values.policyName = name;
                    $scope.values.policyDesc = description;
                    $scope.values.times = collectionTimes;
                    $scope.values.cooldown = coolDown;
                    $scope.values.adjustStep = step;

                    var metrics = [];
                    _.each($scope.values.metrics, function (item, index) {
                        metrics.push({
                            "metricType": item.metricType,
                            "statisticType": item.statisticType,
                            "comparisonOperator": item.comparisonOperator,
                            "metricThreshold": $("#metricValue" + index).widget().getValue()
                        });
                    });
                    var options = {
                        "vdcId": $scope.params.vdcId,
                        "sgId": scalingPolicy.scalingGroupInfo.groupId,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "userId": $scope.params.userId,
                        "vpcId": $scope.params.vpcId,
                        "data": {
                            "policyName": name,
                            "policyDesc": description,
                            "statisticsPeriod": $scope.values.statisticsPeriod,
                            "actionType": $scope.values.actionType,
                            "adjustmentType": "ABS",
                            "metrics": metrics,
                            "times": collectionTimes,
                            "adjustStep": step,
                            "coolDown": coolDown
                        }
                    };
                    if ($scope.mode === "create") {
                        var promise0 = $scope.serviceSrv.addPolicy(options);
                        promise0.then(function (data) {
                            $("#addScalingPolicy").widget().destroy();
                            $("#appTopoDetailDiv").scope().$emit("addPolicySuccessEvent");
                        });
                    }
                    if ($scope.mode === "modify") {
                        _.extend(options, {
                            "policyId": policyJSON.policyId
                        });
                        var promise1 = $scope.serviceSrv.modifyPolicy(options);
                        promise1.then(function (data) {
                            $("#addScalingPolicy").widget().destroy();
                            $("#appTopoDetailDiv").scope().$emit("addPolicySuccessEvent");
                        });
                    }
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
                _.each($scope.values.metrics, function (item, index) {
                    result = result && UnifyValid.FormValid($("#metricValue" + index));
                });
                return result;
            };

            $scope.setValues = function () {
                if ($scope.mode === "create" || !policyJSON) {
                    return;
                }
                var policyJSONUI = policyJSON.item;
                $scope.values = {
                    "policyName": policyJSONUI.policyInfo.policyName,
                    "policyDesc": policyJSONUI.policyInfo.description,
                    "times": policyJSONUI.policyInfo.statisticsTimes,
                    "statisticsPeriod": policyJSONUI.policyInfo.statisticsInterval,
                    "actionType": policyJSONUI.policyInfo.actionType,
                    "cooldown": policyJSONUI.policyInfo.cooldown,
                    "adjustmentType": policyJSONUI.policyInfo.adjustmentType,
                    "adjustStep": policyJSONUI.policyInfo.adjustStep
                };
                var Configurations = [];
                _.each(policyJSONUI.metricInfos, function (item, index) {
                    Configurations.push({
                        "metricType": item.metricType,
                        "statisticType": item.statisticType,
                        "comparisonOperator": item.comparisonOperator,
                        "metricThreshold": item.metricThreshold,
                        "cell": (item.metricType === "CPU" || item.metricType === "MEMORY") ? "%" : "KB/s",

                        "tooltip": UnifyValid.validateInfo.configP,
                        "extendFunction": ["configP"],
                        "validate": UnifyValid.validateInfo.getConfigP(),

                        "Ktooltip": UnifyValid.validateInfo.configK,
                        "KextendFunction": ["configK"],
                        "Kvalidate": UnifyValid.validateInfo.getConfigK()
                    });
                });
                $scope.values.metrics = Configurations;

                var actionType = policyJSONUI.policyInfo.actionType;
                $scope.setActionTypeValues(actionType);
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
            $scope.setValues();

            //验证组建策略名称
            UnifyValid.checkName = function (param) {
                var value = $(this).val();
                var planNameReg = /^[\u4E00-\u9FA50-9a-zA-Z \.\_\-\[\]\(\)\#]{0,256}$/;
                return planNameReg.test(value);
            };

        }
    ];
    var scalingPolicy = angular.module("scalingPolicy", ["ng", "wcc", "ngSanitize"]);
    scalingPolicy.controller("ctrl", ctrl);
    scalingPolicy.service("camel", http);
    scalingPolicy.service("exception", exception);

    return scalingPolicy;
});
