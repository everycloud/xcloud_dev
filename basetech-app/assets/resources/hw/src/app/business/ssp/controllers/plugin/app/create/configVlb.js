/**
 * Created on 14-2-27.
 */
/* global define */
define(['tiny-lib/jquery',
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        'tiny-common/UnifyValid',
        "app/business/ssp/controllers/plugin/app/constants",
        "fixtures/appFixture"
    ],
    function ($, angular, _, Window, UnifyValid, constants) {
        "use strict";

        var ctrl = ["$scope", "camel", "$compile", "$state", "exception",
            function ($scope, camel, $compile, $state, exception) {
                var i18n = $("html").scope().i18n;
                $scope.templateTable4Vlb = {
                    "id": "create-app-templateTable4Vlb",
                    "enablePagination": false,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": i18n.template_term_vm_label,
                        "sWidth": "20px",
                        "bSortable": false,
                        "bSearchable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.templateName);
                        }
                    }, {
                        "sTitle": i18n.common_term_NICname_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.nicName);
                        }
                    }, {
                        "sTitle": i18n.org_term_VDCnet_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.orgNetName);
                        }
                    }, {
                        "sTitle": i18n.app_term_associateVLB_button,
                        "sWidth": "20%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.associateVlb);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": "opt"
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var associateVlbBox = "<div><tiny-textbox id='id' value='value' validate='validate' readonly='true'></tiny-textbox></div>";
                        var associateLink = $compile(associateVlbBox);
                        var associateScope = $scope.$new();
                        associateScope.id = "createAppChooseVlbBox" + iDataIndex;
                        associateScope.value = aData.associateVlb;
                        associateScope.validate = "required:" + i18n.common_term_null_valid;
                        var associateNode = associateLink(associateScope);
                        $("td:eq(3)", nRow).html(associateNode);

                        var vlbBtn = "<div><tiny-button id='id' text='text' tooltip='text' click='click(vmTemplateId)' disabled=''></tiny-button></div>";
                        var vlbLink = $compile(vlbBtn);
                        var vlbScope = $scope.$new();
                        vlbScope.id = "createAppChooseVlbBtn" + iDataIndex;
                        vlbScope.text = i18n.common_term_choose_label;
                        vlbScope.vmTemplateId = aData.templateId;
                        vlbScope.click = function (vmTemplateId) {
                            var options = {
                                "winId": "createAppChooseVlbSel1",
                                "selVlbData": $scope.confVlbVmTemplates.data[iDataIndex],
                                "vpcId": $scope.params.selVpcId,
                                "cloudInfraId": $scope.params.cloudInfraId,
                                "title": i18n.app_term_chooseVLB_label,
                                "width": "520px",
                                "height": "400px",
                                "modal": true,
                                "content-type": "url",
                                "content": "app/business/ssp/views/plugin/app/create/chooseVlb.html",
                                "buttons": null,
                                "close": function (event) {
                                    rebuildVlbTable(true);
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var vlbNode = vlbLink(vlbScope);
                        $("td:eq(4)", nRow).html(vlbNode);
                    }
                };

                $scope.info = {
                    "vlbLock": {
                        "label": "",
                        "require": "true",
                        "id": "vlbSelect",
                        "spacing": {
                            "width": "50px",
                            "height": "30px"
                        },
                        "values": [{
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label
                        }, {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label
                        }, {
                            "key": "0",
                            "text": i18n.user_term_lock_value,
                            "checked": true
                        }],
                        "layout": "horizon",
                        "change": function () {
                            $scope.lock.vlbLock = $("#" + $scope.info.vlbLock.id).widget().opChecked("checked");
                        }
                    }
                };

                $scope.preBtn = {
                    "id": "createApp-configApp-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = {
                            "chooseTemplate": false,
                            "basicInfo": false,
                            "chooseNetwork": false,
                            "configApp": true,
                            "configVlb": false,
                            "confirmByTemplate": false
                        };
                        $("#createByTemplate-app-step").widget().pre();
                    }
                };
                $scope.nextBtn = {
                    "id": "createApp-configApp-nextBtn",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createAppConfigVlb"));
                        if (!valid) {
                            return;
                        }

                        $scope.service.show = {
                            "chooseTemplate": false,
                            "basicInfo": false,
                            "chooseNetwork": false,
                            "configApp": false,
                            "configVlb": false,
                            "baseInfo" : true,
                            "confirmByTemplate": false
                        };
                        $("#createByTemplate-app-step").widget().next();
                        $scope.$emit($scope.events.selVlbParamNext);
                    }
                };
                $scope.cancelBtn = {
                    "id": "createApp-configApp-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.commonCancel();
                    }
                };

                function rebuildVlbTable(isApply) {
                    var newVlbTable = [];
                    _.each($scope.confVlbVmTemplates.data, function (item, index) {
                        newVlbTable.push(item);
                    });
                    if (isApply) {
                        $scope.$apply(function () {
                            $scope.confVlbVmTemplates.data = newVlbTable;
                        });
                    } else {
                        $scope.confVlbVmTemplates.data = newVlbTable;
                    }
                }

                function initVlbNetworks() {
                    if ($scope.confVlbVmTemplates.data.length <= 0) {
                        return;
                    }
                    var tmpConfVlb = null;
                    var newConfVlbVmTemplates = [];
                    for (var i = 0; i < $scope.confVlbVmTemplates.data.length; i++) {
                        tmpConfVlb = $scope.confVlbVmTemplates.data[i];
                        if ($scope.configVlbNetworkMap[tmpConfVlb.orgNetId]) {
                            tmpConfVlb.orgNetName = $scope.configVlbNetworkMap[tmpConfVlb.orgNetId].networkName;
                        }
                        newConfVlbVmTemplates.push(tmpConfVlb);
                    }
                    $scope.confVlbVmTemplates.data = newConfVlbVmTemplates;
                }

                function initLock() {
                    if ($scope.params.action === "modify") {
                        $scope.lock.vlbLock = $scope.lock.networkLock === $scope.detail.param.lock.networkLock ? $scope.detail.param.lock.vlbLock : $scope.lock.networkLock;
                    } else {
                        $scope.lock.vlbLock = $scope.lock.networkLock;
                    }

                    var vLock = $("#" + $scope.info.vlbLock.id).widget();
                    vLock.opChecked($scope.lock.vlbLock, true);

                    if ($scope.lock.networkLock !== "0") {
                        vLock.opDisabled("0", true);
                        if ($scope.lock.networkLock === "2") {
                            vLock.opDisabled("1", true);
                            vLock.opDisabled("2", true);
                        }
                    } else {
                        vLock.opDisabled("0", false);
                        vLock.opDisabled("1", false);
                        vLock.opDisabled("2", false);
                    }

                    if ($scope.params.approvalType === "none") {
                        vLock.opDisabled("2", true);
                    }
                }
                $scope.$on($scope.events.selAppParamNextFromParent, function (event, msg) {
                    initVlbNetworks();
                    initLock();
                });
            }
        ];
        return ctrl;
    });
