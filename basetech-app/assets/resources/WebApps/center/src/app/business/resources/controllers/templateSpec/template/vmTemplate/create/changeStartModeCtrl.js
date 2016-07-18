define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    "tiny-widgets/Message",
    "app/business/resources/controllers/constants",
    "app/services/exceptionService",
    "app/services/httpService"],
    function ($, angular, unifyValid, Message, constants, exceptionService, httpService) {
        "use strict";

        var changeStartModeCtrl = ["$scope", "exception", "camel", function ($scope, exception, camel)
        {
            $scope.windowID = "changeStartModeWinID";
            $scope.paramsInfo = {
                "curStartMode": $("#" + $scope.windowID).widget().option("startMode"),
                "vmtId": $("#" + $scope.windowID).widget().option("vmtId")
            };

            $scope.startMode = {
                "id": "createVmtStartMode",
                "width": "200",
                "spacing":{"width" : "50px", "height" : "20px"},
                "layout":"vertical", // horizon vertical
                "values": [
                    {
                        "key": "disk",
                        "text": $scope.i18n.template_term_startFromHarddisk_label,
                        "tooltip": "",
                        "checked": $scope.paramsInfo.curStartMode == 'disk',
                        "disabled": false
                    },
                    {
                        "key": "cdrom",
                        "text": $scope.i18n.template_term_startFromCD_label,
                        "tooltip": "",
                        "checked": $scope.paramsInfo.curStartMode == 'cdrom',
                        "disabled": false
                    },
                    {
                        "key": "pxe",
                        "text": $scope.i18n.template_term_startFromNet_label,
                        "tooltip": "",
                        "checked": $scope.paramsInfo.curStartMode == 'pxe',
                        "disabled": false
                    }
                ]
            };


            $scope.okBtn = {
                "label": "",
                "id": "modifyOkBtn",
                "text": $scope.i18n.common_term_ok_button,
                "tooltip": "",
                "click": function () {

                    $scope.operator.modiyfBootModel($("#"+$scope.startMode.id).widget().opChecked("checked"));

                    $("#" + $scope.windowID).widget().destroy();
                }
            };

            $scope.cancelBtn = {
                "id": "modifyCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $("#" + $scope.windowID).widget().destroy();
                }
            };

            /**
             * 操作定义
             *
             * @type {{}}
             */
            $scope.operator = {
                "modiyfBootModel":function (model) {

                    var idList = $scope.paramsInfo.vmtId.split(";");
                    var id = $scope.paramsInfo.vmID;
                    if (idList.length >= 3) {
                        id = idList[2]+"$"+idList[1];
                    }

                    var deferred = camel.put({
                        "url": {"s":constants.rest.VM_TEMPLATE_MODIFY_BOOTOPTION.url,"o":{"tenant_id":1, "id":id}},
                        "params": JSON.stringify({"spec": {"attribute": {"bootOption": model}}}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // model
                        var scope = $("#createVmtInstallSoftware").scope();
                        scope.updateStartMode(model);
                    });
                    deferred.fail(function (data) {
                        if (!exception.isException(data)){
                            exception.doFaultPopUp();
                            return;
                        }
                        exception.doException(data);
                    });
                }
            };

        }];

        // 创建App
        var deps = [];
        var changeStartModeApp = angular.module("resources.vmTemplate.changeStartMode", deps);
        changeStartModeApp.controller("resources.vmTemplate.changeStartMode.ctrl", changeStartModeCtrl);
        changeStartModeApp.service("exception", exceptionService);
        changeStartModeApp.service("camel", httpService);

        return changeStartModeApp;
    });
