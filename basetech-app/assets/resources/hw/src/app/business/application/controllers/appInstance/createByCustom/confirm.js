/**
 * Created  on 14-3-3.
 */
define(['tiny-lib/jquery', 'tiny-lib/encoder', "tiny-lib/angular", "app/business/application/controllers/constants", "tiny-lib/underscore", "app/business/application/services/appCommonService"],
    function ($, encoder, angular, constants, _, appCommonService) {
        "use strict";

        var ctrl = ["$scope", "camel", "$state", "exception", "$q",
            function ($scope, camel, $state, exception, $q) {
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                var user = $("html").scope().user;
                var i18n = $scope.i18n;

                $scope.hello = "hello bitch!";
                $scope.confirmInfo = {
                    "nameLabel": i18n.common_term_name_label+":",
                    "name": "",
                    "locationLabel": i18n.common_term_section_label+":",
                    "location": "",
                    "descriptionLabel": i18n.common_term_desc_label+":",
                    "description": ""
                };

                $scope.confirmVmTable = {
                    "id": "createByCustomChosenVmTableId",
                    "caption": "vmCaption",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "draggable": true,
                    "columns": [{
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle":i18n.common_term_ID_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmId);
                        }
                    }, {
                        "sTitle": "IP",
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        }
                    }, {
                        "sTitle": i18n.common_term_startupOrder_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.startOrder);
                        }
                    }],
                    "data": [],
                    "columnVisibility": {
                        "activate": "click", //"mouseover"/"click"
                        "aiExclude": [0, 9],
                        "bRestore": true,
                        "fnStateChange": function (index, state) {}
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {}
                };

                $scope.preBtn = {
                    "id": "createAppByCustom-confirm-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = {
                            "baseInfo": false,
                            "associateVM": true,
                            "confirm": false
                        };
                        $("#createByCustom-app-step").widget().pre();
                    }
                };
                $scope.nextBtn = {
                    "id": "createAppByCustom-confirm-nextBtn",
                    "text": "",
                    "click": function () {
                        if ($scope.service.isModify) {
                            modifyApp4Custom();
                        } else {
                            createApp4Custom();
                        }
                    }
                };
                $scope.cancelBtn = {
                    "id": "createAppByCustom-confirm-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                            $state.go("application.manager.instance");
                        } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                            $state.go("application.manager.overview");
                        } else {
                            $state.go("application.manager.template");
                        }
                    }
                };

                function modifyApp4Custom() {
                    var modifiedVmData = {};
                    _.each($scope.params.vmTableData, function (item, index) {
                        modifiedVmData[item.id] = item;
                    });
                    var updateVmArray = [];
                    var deleteVmArray = [];
                    var addVmArray = [];
                    var vmId;
                    for (vmId in modifiedVmData) {
                        if ($scope.params.beforeModVmData[vmId]) {
                            updateVmArray.push(modifiedVmData[vmId]);
                        } else {
                            addVmArray.push(modifiedVmData[vmId]);
                        }
                    }
                    for (vmId in $scope.params.beforeModVmData) {
                        if (!modifiedVmData[vmId]) {
                            deleteVmArray.push($scope.params.beforeModVmData[vmId]);
                        }
                    }

                    var modifyVms = [];
                    var newItem = null;
                    _.each(updateVmArray, function (item, index) {
                        newItem = {
                            "vmInfo": {
                                "instanceId": item.vmId,
                                "rid": item.id,
                                "name": item.name,
                                "description": null,
                                "startOrder": item.startOrder
                            },
                            "operation": "MOD"
                        };
                        modifyVms.push(newItem);
                    });
                    _.each(deleteVmArray, function (item, index) {
                        newItem = {
                            "vmInfo": {
                                "instanceId": item.vmId,
                                "rid": item.id,
                                "name": item.name,
                                "description": null,
                                "startOrder": item.startOrder
                            },
                            "operation": "DELETE"
                        };
                        modifyVms.push(newItem);
                    });
                    _.each(addVmArray, function (item, index) {
                        newItem = {
                            "vmInfo": {
                                "instanceId": item.vmId,
                                "rid": item.id,
                                "name": item.name,
                                "description": null,
                                "startOrder": item.startOrder
                            },
                            "operation": "ADD"
                        };
                        modifyVms.push(newItem);
                    });

                    var options = {
                        "vdcId": user.vdcId,
                        "id": $scope.params.appId,
                        "cloudInfraId": $scope.params.locationId,
                        "userId": user.id,
                        "vpcId": $scope.params.selVpcId,
                        "data": {
                            "appName": $scope.params.name,
                            "appTag": $scope.params.appTag,
                            "desc": $scope.params.description,
                            "picture": "../theme/default/images/gm/appImage/" + $scope.params.curLogo,
                            "vms": modifyVms
                        }
                    };
                    var deferred = appCommonServiceIns.updateAppInstance(options);
                    deferred.then(function (data) {
                        if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                            $state.go("application.manager.instance");
                        } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                            $state.go("application.manager.overview");
                        } else {
                            $state.go("application.manager.template");
                        }
                    });
                }

                function createApp4Custom() {
                    var vmsArray = [];
                    var newVm = null;
                    _.each($scope.params.vmTableData, function (item, index) {
                        newVm = {};
                        newVm.instanceId = item.id;
                        newVm.rid = item.id;
                        newVm.name = item.name;
                        newVm.description = "";
                        newVm.startOrder = item.startOrder;
                        vmsArray.push(newVm);
                    });
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.params.locationId,
                        "appName": $scope.params.name,
                        "appTag": $scope.params.appTag,
                        "desc": $scope.params.description,
                        "picture": "../theme/default/images/gm/appImage/" + $scope.params.curLogo,
                        "vms": vmsArray,
                        "vpcId": $scope.params.selVpcId
                    };
                    var deferred = appCommonServiceIns.createApp4Custom(options);
                    deferred.then(function (data) {
                        if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                            $state.go("application.manager.instance");
                        } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                            $state.go("application.manager.overview");
                        } else {
                            $state.go("application.manager.template");
                        }
                    });
                }

                function init() {
                    //局部更新表格后,要重刷新确认表格
                    var newConfirmTable = [];
                    _.each($scope.params.vmTableData, function (item, index) {
                        newConfirmTable.push(item);
                    });
                    $scope.confirmVmTable.data = newConfirmTable;
                }

                $scope.$on($scope.events.associateNextFromParent, function (event, msg) {
                    init();
                });
            }
        ];

        return ctrl;
    });
