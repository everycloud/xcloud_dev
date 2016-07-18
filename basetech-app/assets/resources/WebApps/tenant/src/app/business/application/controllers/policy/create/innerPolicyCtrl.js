define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    'app/business/application/services/appCommonService',
    "app/services/messageService",
    "tiny-lib/underscore",
    "fixtures/appFixture"
], function ($, $encoder, angular, Window, Checkbox, appCommonService, MessageService, _) {
    "use strict";
    var ctrl = ["$scope", "$compile", "camel", "exception",
        function ($scope, $compile, camel, exception) {
            var encoder = $.encoder;
            var messageService = new MessageService();
            var i18n =$scope.i18n;

            $scope.$watch("data.policies", function (newValue, oldValue) {
                if ($scope.data.policies.length > 0) {
                    $scope.info.nextBtn.disable = false;
                } else {
                    $scope.info.nextBtn.disable = true;
                }
            });

            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            $scope.info = {
                bindTable: {
                    "id": "create-plan-bindTable",
                    "enablePagination": false,
                    "paginationStyle": "full_numbers",
                    "displayLength": 10,
                    "totalRecords": 0,
                    "lengthMenu": [10, 20, 30],
                    "draggable": true,
                    "columns": [{
                        "sTitle": "", //设置第一列的标题
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "10%"
                    }, {
                        "sTitle": i18n.app_term_policyName_label,
                        "sWidth": "15%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.policyName);
                        }
                    }, {
                        "sTitle": i18n.app_term_flexGroup_label,
                        "sWidth": "15%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.groupName);
                        }
                    }, {
                        "sTitle":i18n.app_term_app_label,
                        "sWidth": "15%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.appName);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "sWidth": "20%",
                        "bSortable": false
                    }],
                    "data": [],
                    "callback": function (evtObj) {
                        var displayLength = $("#create-plan-bindTable").widget().option("display-length");
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.queryPolicies();
                    },
                    "changeSelect": function (evtObj) {
                        var displayLength = $("#create-plan-bindTable").widget().option("display-length");
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.queryPolicies();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var opScope = $scope.$new();
                        //复选框
                        var selBox = "<div><tiny-checkbox id='checkBoxId' checked='checked' change='change()'></tiny-checkbox></div>";
                        var selBoxLink = $compile(selBox);
                        opScope.checkBoxId = "poLstCheckboxId" + iDataIndex;
                        opScope.checked = aData.checked;
                        opScope.change = function () {
                            var checked = $("#" + opScope.checkBoxId).widget().option("checked");
                            var selecteds = [];
                            _.each($scope.data.policies, function (item) {
                                selecteds.push(item);
                            });
                            if (checked) {
                                var selectedPolicyOperation = $("#" + "poLstSelId" + iDataIndex).widget().getSelectedId();
                                var policyData = $scope.getPolicyData(aData);
                                policyData.policyOperation = selectedPolicyOperation;
                                selecteds.push(policyData);
                            } else {
                                selecteds = _.reject(selecteds, function (item) {
                                    return item.policyId === aData.policyId;
                                });
                            }
                            $scope.data.policies = selecteds;
                            if($scope.info.bindTable.data.length == $scope.data.policies.length) {
                                tblHeadCheckbox.option("checked", true);
                            }
                            else {
                                tblHeadCheckbox.option("checked", false);
                            }
                        };
                        var selBoxNode = selBoxLink(opScope);
                        $("td:eq(0)", nRow).append(selBoxNode);

                        //下拉框
                        var opScopeSelect = $scope.$new();
                        var optSel = "<div><tiny-select text='' id='selectId' values='optValues' change='selectChange()' default-selectid='defaultSelectId'></tiny-select></div>";
                        var optSelLink = $compile(optSel);
                        opScopeSelect.selectId = "poLstSelId" + iDataIndex;
                        if ((null === aData.policyOperation) || (undefined === aData.policyOperation)) {
                            opScopeSelect.defaultSelectId = "";
                        } else {
                            opScopeSelect.defaultSelectId = aData.policyOperation;
                        }
                        opScopeSelect.optValues = [{
                            "selectId": "START",
                            "label": i18n.common_term_enable_button
                        }, {
                            "selectId": "STOP",
                            "label": i18n.common_term_close_button
                        }];
                        opScopeSelect.selectChange = function () {
                            var policyOperation = $("#" + opScopeSelect.selectId).widget().getSelectedId();
                            _.each($scope.data.policies, function (item, index) {
                                if (item.policyId === aData.policyId) {
                                    item.policyOperation = policyOperation;
                                }
                            });
                        };
                        var optSelNode = optSelLink(opScopeSelect);
                        $("td:eq(4)", nRow).append(optSelNode);
                    }
                },
                preBtn: {
                    "id": "create-plan-step3-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "basic";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-plan-step3-next",
                    "text": i18n.common_term_next_button,
                    "disable": true,
                    "click": function () {
                        var invalidExist = false;
                        _.each($scope.data.policies, function (item, index) {
                            if (!item.policyOperation || (item.policyOperation === "")) {
                                invalidExist = true;
                            }
                        });
                        if (invalidExist) {
                            messageService.errorMsgBox(i18n.common_term_setError_value, i18n.app_policy_addTask_info_policyNoSetAction_msg);
                            return;
                        }
                        $scope.service.show = "confirm";
                        $("#" + $scope.service.step.id).widget().next();
                        $scope.$emit("triggerConfirmPageLoadEvent");
                    }
                },
                cancelBtn: {
                    "id": "create-plan-step3-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            //生成一个checkbox放在表头处
            var tblHeadCheckbox = new Checkbox({
                "id": "poTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    var policies = [];
                    var policiesTemp = $scope.info.bindTable.data;
                    var isChecked = $("#poTableHeadCheckbox").widget().option("checked");
                    for (var i = 0; i < policiesTemp.length; i++) {
                        $("#poLstCheckboxId" + i).widget().option("checked", isChecked);
                        if (isChecked) {
                            var selectedPolicyOperation = $("#" + "poLstSelId" + i).widget().getSelectedId();
                            var policyData = $scope.getPolicyData(policiesTemp[i]);
                            policyData.policyOperation = selectedPolicyOperation;
                            policies.push(policyData);
                        }
                    }
                    $scope.$apply(function () {
                        if (isChecked) {
                            $scope.data.policies = policies;

                        } else {
                            $scope.data.policies = [];
                        }
                    });
                }
            });


            //查询组内策略列表
            $scope.queryPolicies = function () {
                var deferred = $scope.serviceIns.queryPoliciesAjax({
                    "vdcId": $scope.params.vdcId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId
                });
                deferred.success(function (data, textStatus, jqXHR) {
                    var policies = data.policies || [];
                    $scope.$apply(function() {
                        _.each(policies, function (item, index) {
                            var policy = _.find($scope.data.policies, function (itemA, index) {
                                return item.policyId === itemA.policyId;
                            });
                            if (policy) {
                                item.checked = true;
                                item.policyOperation = policy.policyOperation;
                            }
                        });
                        $scope.info.bindTable.data = policies;
                        $scope.info.bindTable.totalRecords = policies.length;
                        $scope.info.bindTable.displayLength = page.displayLength;
                        $("#create-plan-bindTable").widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                        //刷新已选中的策略　场景：当前选中的策略已被删除，此时确认页也要刷表
                        $scope.refreshSelectedData(policies);
                    });

                    //将checkbox放在表头处，在这里放是因为上面设置totalRecords或cur-page后，会将表头的checkbox清掉
                    if(policies.length == $scope.data.policies.length) {
                        tblHeadCheckbox.option("checked", true);
                    }
                    else {
                        tblHeadCheckbox.option("checked", false);
                    }
                    $('#create-plan-bindTable th:eq(0)').html(tblHeadCheckbox.getDom());
                });
                deferred.fail(function (jqXHR, textStatus, errorThrown) {
                    if (!exception.isException(jqXHR)) {
                        deferred.resolve(null);
                        return;
                    }
                    exception.doException(jqXHR, null);
                });
            };

            $scope.refreshSelectedData = function (policies) {
                if (!policies) {
                    policies = [];
                }
                var errorMsg = "";
                var newSelectedData = [];
                _.each($scope.data.policies, function (item, index) {
                    var policy = _.find(policies, function (itemA, indexA) {
                        return item.policyId === itemA.policyId;
                    });
                    if (policy) {
                        newSelectedData.push(item);
                    } else {
                        errorMsg += item.policyName;
                        errorMsg += ",";
                    }
                });
                if (errorMsg !== "") {
                    $scope.data.policies = newSelectedData;
                    var lastSeperator = errorMsg.lastIndexOf(",");
                    if (lastSeperator >= 0) {
                        errorMsg = errorMsg.substring(0, lastSeperator);
                    }
                    $("#create-plan-innerPolicy-tips").html(i18n.common_term_policy_label + encoder.encodeForHTML(errorMsg) + i18n.app_policy_addTask_info_nullPolicy_msg);
                } else {
                    $("#create-plan-innerPolicy-tips").html("");
                }
            };

            $scope.getPolicyData = function (policy) {
                return {
                    appId: policy.appId,
                    appName: policy.appName,
                    groupId: policy.groupId,
                    groupName: policy.groupName,
                    policyId: policy.policyId,
                    policyName: policy.policyName,
                    policyOperation: policy.policyOperation
                };
            };

            $scope.$on("initLoadPolicyEvent", function () {
                $scope.queryPolicies();
            });
        }
    ];
    return ctrl;
});
