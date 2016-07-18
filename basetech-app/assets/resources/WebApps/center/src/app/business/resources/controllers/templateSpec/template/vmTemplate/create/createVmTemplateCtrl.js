define(["jquery",
    "tiny-lib/angular"],
    function ($, angular) {
        "use strict";

        var createVmTemplateCtrl = ["$scope", "$compile", "$state", "$stateParams", function ($scope, $compile, $state, $stateParams) {
            $scope.service = {
                step: {
                    "id": "vmTemplateCreateStep",
                    "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.template_term_vmSpec_label, $scope.i18n.template_term_createVMtemplate_button, $scope.i18n.common_term_installSoft_label],
                    "width": 450,
                    "jumpable": false
                },

                vmtId: $stateParams.vmtId,

                show: $stateParams.startStep == undefined ? "baseInfo":$stateParams.startStep,

                model: {
                    "name": "",
                    "description": "",
                    "clusterId": "",
                    "clusterInfo": {},
                    "osOption": {},
                    "cpuInfo":{},
                    "memoryInfo":{},
                    "diskdetail":{},
                    "picture": "../theme/default/images/vmTemplate/icon_vmtemplate_1.png",
                    "haFlag": "",
                    "updateMode": "",
                    "blockHeatTranfer": "",
                    "type": "",
                    "hostID": "",
                    "syncTimeWithHost": "",
                    "storeRid": "",
                    "hypervisorID": "",
                    "hypervisorType": "",
                    "creatorId": $("html").scope().user && $("html").scope().user.id
                }
            };

            $scope.buttonGroup = {
                label: "",
                require: false
            };

            // 事件定义
            $scope.createVmtEvents = {
                "baseInfoChanged":"baseInfoChanged",
                "baseInfoChangedFromParent":"baseInfoChangedFromParent",
                "createRequestDone":"createRequestDone",
                "createRequestDoneFromParent":"createRequestDoneFromParent",
                "createVmtSuccess":"createVmtSuccess",
                "createVmtSuccessFromParent":"createVmtSuccessFromParent"
            };

            // 事件转发
            $scope.$on($scope.createVmtEvents.baseInfoChanged, function (event, msg) {
                $scope.$broadcast($scope.createVmtEvents.baseInfoChangedFromParent, msg);
            });

            $scope.$on($scope.createVmtEvents.createVmtSuccess, function (event, msg) {
                $scope.$broadcast($scope.createVmtEvents.createVmtSuccessFromParent, msg);
            });

            $scope.$on($scope.createVmtEvents.createRequestDone, function (event, msg) {
                $scope.$broadcast($scope.createVmtEvents.createRequestDoneFromParent, msg);
            });
        }];

        return createVmTemplateCtrl;
    });
