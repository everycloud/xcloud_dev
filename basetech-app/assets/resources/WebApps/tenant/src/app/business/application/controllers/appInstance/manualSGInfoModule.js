/**
 * Created on 2014/5/20.
 */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'app/services/httpService',
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/exceptionService",
    "app/business/application/services/appCommonService",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function ($, angular, http, UnifyValid, validater, exceptien, appCommonService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "camel", "exception", "validator",
        function ($scope, $compile, $q, camel, exception, validator) {
            var param = $("#sgnode-manualsg-window").widget().option("param");
            param = param || {};
            var cloudInfra = param.cloudInfra || {};
            var disk = param.disk || {};
            var user = $("html").scope().user;
            var i18n = $("html").scope().i18n;
            var serviceIns = new appCommonService(exception, $q, camel);

            $scope.values = {};
            $scope.actionTypeScalingOut = true;
            $scope.actionType = {
                label: i18n.common_term_actionType_label+":",
                id: "sgnode-scalingpolicy-actionType",
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
                    var selectedId = $("#sgnode-scalingpolicy-actionType").widget().getSelectedId();
                    if (selectedId === "SCALEOUT") {
                        $scope.actionTypeScalingOut = true;
                    } else {
                        $scope.actionTypeScalingOut = false;
                    }
                }
            };
            $scope.scaleOut = {
                "id": "sgnode-scalingpolicy-scaleOut",
                "layout": "horizon",
                "values": [{
                    "key": "SCALEOUT",
                    "text": i18n.common_term_default_label,
                    "checked": true
                }, {
                    "key": "POWER",
                    "text": i18n.common_term_startup_button
                }, {
                    "key": "AWAKE",
                    "text": i18n.common_term_awaken_button
                }, {
                    "key": "CREATE",
                    "text": i18n.common_term_create_button
                }],
                "change": function () {
                    var actionType = $("#sgnode-scalingpolicy-scaleOut").widget().opChecked("checked");
                    $scope.values.actionType = actionType;
                }
            };
            $scope.scaleIn = {
                "id": "sgnode-scalingpolicy-scaleIn",
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
                    "text": i18n.common_term_hibernate_button
                }, {
                    "key": "REMOVE",
                    "text": i18n.common_term_delete_button
                }],
                "change": function () {
                    var actionType = $("#scalingpolicy-scaleIn").widget().opChecked("checked");
                    $scope.values.actionType = actionType;
                }
            };
            $scope.step = {
                id: "sgnode-scalingpolicy-step",
                label: i18n.app_policy_add_para_step_label+":",
                width: "140px",
                require: true,
                "tooltip": "",
                "extendFunction": ["step"],
                "validate": ""
            };

            $scope.okBtn = {
                "id": "app-instance-manual-ok",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    if (!UnifyValid.FormValid($("#app-instance-manualsginfo-mod"))) {
                        return;
                    }
                    var options = {

                    };
                    var deferred = serviceIns.modifyDisk(options);
                    deferred.then(function (data) {
                        $("#sgnode-manualsg-window").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "app-instance-manual-cancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#sgnode-manualsg-window").widget().destroy();
                }
            };
        }
    ];

    var module = angular.module("manualSGInfo", ["ng"]);
    module.controller("manualSGInfo", ctrl);
    module.service("camel", http);
    module.service("validator", validater);
    module.service("exception", exceptien);

    return module;
});
