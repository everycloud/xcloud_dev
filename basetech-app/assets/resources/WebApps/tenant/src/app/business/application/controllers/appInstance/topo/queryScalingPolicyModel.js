define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "tiny-lib/underscore",
    "tiny-directives/FormField",
    "tiny-directives/Button",
    "tiny-directives/Textbox",
    "tiny-directives/Select",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup'
], function (sprintf, $, angular, ngSanitize, keyIDI18n, _) {
    "use strict";
    var ctrl = ["$scope",
        function ($scope) {
            var policyJSON = $("#queryScalingPolicy").widget().option("policyJSON");
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

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
                "metrics": []
            };

            $scope.metricTypes = {
                "values": [{
                    "selectId": "CPU",
                    "label": i18n.perform_term_CPUusageRate_label
                }, {
                    "selectId": "MEMORY",
                    "label":i18n.perform_term_memUsageRate_label
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
                }]
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
                }]
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
                    id: "scalingpolicy-name",
                    width: "140px"
                },
                "description": {
                    label: i18n.common_term_desc_label+":",
                    require: false,
                    id: "scalingpolicy-description",
                    width: "140px",
                    type: "mult"
                },
                "statisticsPeriod": {
                    label: i18n.user_policy_set_para_periodMinu_label+":",
                    id: "scalingpolicy-statisticsPeriod",
                    width: "140px"
                },
                "collectionTimes": {
                    label: i18n.common_term_seriality_label+":",
                    require: true,
                    id: "scalingpolicy-collectionTimes",
                    width: "140px"
                },
                "actionType": {
                    label: i18n.common_term_actionType_label+":",
                    id: "scalingpolicy-actionType",
                    require: true,
                    width: "140px",
                    'disable': true,
                    "values": [{
                        "selectId": "SCALEOUT",
                        "label": i18n.common_term_expanding_button,
                        "checked": true
                    }, {
                        "selectId": "SCALEIN",
                        "label": i18n.common_term_capacityReduction_button
                    }]
                },
                "scaleOut": {
                    "id": "scalingpolicy-scaleOut",
                    "layout": "horizon",
                    "values": [{
                        "key": "SCALEOUT",
                        "text": i18n.common_term_default_label,
                        checked: true,
                        "disable": true
                    }, {
                        "key": "POWER",
                        "text": i18n.common_term_startup_button,
                        "disable": true
                    }, {
                        "key": "AWAKE",
                        "text": i18n.common_term_awaken_button,
                        "disable": true
                    }, {
                        "key": "CREATE",
                        "text": i18n.common_term_create_button,
                        "disable": true
                    }]
                },
                "scaleIn": {
                    "id": "scalingpolicy-scaleIn",
                    "layout": "horizon",
                    disabled: true,
                    "values": [{
                        "key": "SCALEIN",
                        "text": i18n.common_term_default_label,
                        checked: true,
                        "disable": true
                    }, {
                        "key": "HALT",
                        "text": i18n.common_term_close_button,
                        "disable": true
                    }, {
                        "key": "SLEEP",
                        "text": i18n.common_term_hibernate_button,
                        "disable": true
                    }, {
                        "key": "REMOVE",
                        "text":i18n.common_term_delete_button,
                        "disable": true
                    }]
                },
                "coolTime": {
                    label: i18n.app_term_coolingTimeMinu_label+":",
                    require: true,
                    id: "scalingpolicy-coolDown",
                    width: "140px"
                },
                "step": {
                    label: i18n.app_policy_add_para_step_label+":",
                    require: true,
                    id: "scalingpolicy-step",
                    width: "140px"
                }
            };

            $scope.setValues = function () {
                if (!policyJSON) {
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
                        "cell": (item.metricType === "CPU" || item.metricType === "MEMORY") ? "%" : "KB/s"
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
        }
    ];

    var scalingPolicy = angular.module("queryScalingPolicy", ["ng", "wcc", "ngSanitize"]);
    scalingPolicy.controller("ctrl", ctrl);

    return scalingPolicy;
});
