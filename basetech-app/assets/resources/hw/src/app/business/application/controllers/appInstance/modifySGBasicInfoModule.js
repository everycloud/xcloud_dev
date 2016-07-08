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
            var params = $("#sgnode-modify-window").widget().option("params");
            var nodeJSON = $("#sgnode-modify-window").widget().option("nodeJSON");

            var i18n = $("html").scope().i18n;
            params = params || {};
            nodeJSON = nodeJSON || {};
            $scope.serviceSrv = new appCommonService(exception, $q, camel);

            $scope.modifyScalingGroup = function (data) {
                var promise = $scope.serviceSrv.modifyScalingGroup({
                    "vdcId": params.vdcId,
                    "sgId": nodeJSON.scalingGroupInfo.groupId,
                    "cloudInfraId": params.cloudInfraId,
                    "userId": params.userId,
                    "vpcId": params.vpcId,
                    "data": data
                });
                return promise;
            };

            $scope.name = {
                "label": i18n.common_term_name_label+":",
                "id": "app-instance-sgbasicinfo-name",
                "width": "200",
                "value": nodeJSON.scalingGroupInfo.groupName,
                "require": true
            };
            $scope.minVMS = {
                "label": i18n.app_term_vmMinNum_label+":",
                "id": "app-instance-sgbasicinfo-minvms",
                "width": "200",
                "value": nodeJSON.scalingGroupInfo.minSize,
                "require": true
            };
            $scope.maxVMS = {
                "label": i18n.app_term_vmMaxNum_label+":",
                "id": "app-instance-sgbasicinfo-maxvms",
                "width": "200",
                "value": nodeJSON.scalingGroupInfo.maxSize,
                "require": true
            };
            $scope.coolTime = {
                "label": i18n.app_term_coolingTimeMinu_label+":",
                "id": "app-instance-sgbasicinfo-cooltime",
                "width": "200",
                "value": nodeJSON.scalingGroupInfo.coolDown,
                "require": true
            };
            $scope.desc = {
                "label": i18n.common_term_desc_label+":",
                "id": "app-instance-sgbasicinfo-desc",
                "value": nodeJSON.scalingGroupInfo.groupDesc,
                "type": "multi",
                "width": "220",
                "height": "80"
            };

            $scope.okBtn = {
                "id": "app-instance-sgbasicinfo-ok",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    if (!UnifyValid.FormValid($("#app-instance-sgbasicinfo-mod"))) {
                        return;
                    }
                    var params = {
                        "groupName": $("#" + $scope.name.id).widget().getValue(),
                        "groupDesc": $("#" + $scope.desc.id).widget().getValue(),
                        "coolDown": $("#" + $scope.coolTime.id).widget().getValue(),
                        "maxSize": $("#" + $scope.maxVMS.id).widget().getValue(),
                        "minSize": $("#" + $scope.minVMS.id).widget().getValue()
                    };
                    var promise = $scope.modifyScalingGroup(params);
                    promise.then(function (data) {
                        nodeJSON.scalingGroupInfo.groupName = params.groupName;
                        nodeJSON.scalingGroupInfo.groupDesc = params.groupDesc;
                        nodeJSON.scalingGroupInfo.coolDown = params.coolDown;
                        nodeJSON.scalingGroupInfo.maxSize = params.maxSize;
                        nodeJSON.scalingGroupInfo.minSize = params.minSize;
                        $("#sgnode-modify-window").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "app-instance-sgbasicinfo-cancel",
                "text":i18n.common_term_cancle_button,
                "click": function () {
                    $("#sgnode-modify-window").widget().destroy();
                }
            };
        }
    ];

    var module = angular.module("modifySGBasicInfo", ["ng"]);
    module.controller("sgBasicInfo", ctrl);
    module.service("camel", http);
    module.service("validator", validater);
    module.service("exception", exceptien);

    return module;
});
