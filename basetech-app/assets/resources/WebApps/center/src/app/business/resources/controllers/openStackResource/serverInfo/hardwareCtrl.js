/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/business/resources/services/exceptionService",
    "language/irm-rpool-exception"
], function ($, angular, UnifyValid, Window, Message, exceptionService, irmException) {
    "use strict";

    var hardwareCtrl = ["$scope", "$stateParams", "$state", "$compile", "camel", function ($scope, $stateParams, $state, $compile, camel) {
        var user = $("html").scope().user;
        $scope.opActive();
        $scope.vmName = $stateParams.vmName;
        $scope.vmId = $stateParams.vmId;

        var hardwareList = [
            {
                "hardware": $scope.i18n.common_term_spec_label,
                "summary": "",
                "id": "flavor"
            },
            {
                "hardware": $scope.i18n.common_term_disk_label,
                "summary": $scope.i18n.common_term_entry_label,
                "id": "disk"
            },
            {
                "hardware": $scope.i18n.common_term_NIC_label,
                "summary": $scope.i18n.common_term_entry_label,
                "id": "nic"
            }
        ];
        //硬件列表
        $scope.hardwareTable = {
            "id": "vmInfoHardwareTable",
            "data": hardwareList,
            "enablePagination": false,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_hardware_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hardware);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $(nRow).click(function () {
                    $state.go("vdcMgr.serverInfo.hardware." + aData.id);
                });
                if ($state.$current.name === 'vdcMgr.serverInfo.hardware.' + aData.id) {
                    $(nRow).addClass("clickTrColor");
                }
            }
        };
    }];
    return hardwareCtrl;
});
