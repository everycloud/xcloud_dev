/**
 * Created on 14-2-27.
 */
define(['tiny-lib/jquery', 'tiny-lib/encoder', "tiny-lib/angular", "tiny-lib/underscore", 'tiny-common/UnifyValid', 'tiny-widgets/Window', "app/services/messageService", "app/business/application/controllers/constants", "fixtures/appFixture", "fixtures/network/vpcFixture"],
    function ($, encoder, angular, _, UnifyValid, Window, messageService, constants) {
        "use strict";

        var ctrl = ["$scope", "camel", "$compile", "$state", "exception",
            function ($scope, camel, $compile, $state, exception) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n;
                var messageServiceIns = new messageService();

                var TYPE_TITLE_MAP = {
                    "az": "AvailableZone",
                    "network": "Subnet",
                    "image": "Image",
                    "instanceType": "Flavor",
                "loadBalancer":"VLB",
                "securityGroup":"SecurityGroup"
                };

                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.info = {
                    "commonParams": {
                        "id": "create-app-commonParams",
                        "enablePagination": true,
                        "draggable": true,
                        "paginationStyle": "full_numbers",
                        "displayLength": 10,
                        "totalRecords": 0,
                        "columnsDraggable":true,
                        "lengthMenu": [10, 20, 30],
                        "columnsVisibility": {
                            "activate": "click", //"mouseover"/"click"
                            "aiExclude": [0],
                            "bRestore": false,
                            "fnStateChange": function (index, state) {}
                        },

                        "columns": [{
                            "sTitle": i18n.common_term_paraName_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            }
                        }, {
                            "sTitle":i18n.common_term_limitRule_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.allowedPattern);
                            }
                        }, {
                            "sTitle":i18n.common_term_limitDesc_label,
                            "sWidth": "15%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.constraintDescription);
                            }
                        }, {
                            "sTitle":i18n.common_term_paraDesc_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            }
                        }, {
                            "sTitle": i18n.common_term_paraValue_label,
                            "sWidth": "37%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.selectId);
                            }
                        }, {
                            "sTitle": i18n.common_term_resourceName_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.value);
                            }
                        }, {
                            "sTitle":i18n.common_term_setPara_label,
                            "sWidth": "8%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            }
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            $("td:eq(0)", nRow).addTitle();
                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            $("td:eq(3)", nRow).addTitle();
                            $("td:eq(5)", nRow).addTitle();

                            var paramInputBox;
                            if (!aData.NoEcho) {
                                paramInputBox = "<div><tiny-textbox id='id' value='value' validate='validate' change='change()' width='200' blur='blur()'></tiny-textbox></div>";
                            } else {
                                paramInputBox = "<div><tiny-textbox id='id' value='value' type='type' validate='validate' change='change()' width='200' blur='blur()'></tiny-textbox></div>";
                            }
                            var paramInputLink = $compile(paramInputBox);
                            var paramInputScope = $scope.$new();
                            paramInputScope.id = "createAppInputCommonParams" + iDataIndex;
                            paramInputScope.value = aData.selectId;
                            if (aData.allowedPattern && (aData.allowedPattern !== "")) {
                                paramInputScope.validate = "required:"+i18n.common_term_null_valid+";" + generateCheckRules(aData);
                            } else {
                                paramInputScope.validate = "required:"+i18n.common_term_null_valid+";";
                            }
                            if (aData.NoEcho) {
                                paramInputScope.type = "password";
                            }
                            paramInputScope.change = function () {
                                var paramValue = $("#createAppInputCommonParams" + iDataIndex).widget().getValue();
                                $scope.commonParams.data[iDataIndex].selectId = paramValue;
                                $scope.commonParams.data[iDataIndex].value = "";
                                rebuildTableWithoutApply();
                            };
                            paramInputScope.blur = function () {};
                            var paramInputNode = paramInputLink(paramInputScope);
                            $("td:eq(4)", nRow).html(paramInputNode);

                            //注:此处行间样式为归避"列表中的tiny-button的样式问题"
                            var paramSelect;
                            if ((aData.rType === "az") || (aData.rType === "network") || (aData.rType === "image")
                                || (aData.rType === "instanceType")|| (aData.rType === "loadBalancer") || (aData.rType === "securityGroup")) {
                                paramSelect = "<div><div style='margin-top: 8px;margin-bottom: 8px;'><tiny-button id='btnId' text='btnText' click='btnClick(vmTemplateId)' disabled=''></tiny-button></div></div>";
                            } else {
                                paramSelect = "<div style='height: 43px;'></div>";
                            }
                            var paramSelectLink = $compile(paramSelect);
                            var paramSelectScope = $scope.$new();
                            paramSelectScope.btnId = "createAppInputCommonParamsBtn" + iDataIndex;
                            paramSelectScope.btnText = i18n.common_term_choose_label;
                            paramSelectScope.btnClick = function () {
                                var rType = aData.rType;
                                var options = {
                                    "winId": "createByOpenstack_configParamWin",
                                    "resourceType": rType,
                                    "resPoolId": $scope.params.selResPoolId,
                                    "vpcId": $scope.params.selVpcId,
                                    "vpcName": $scope.params.selVpcName,
                                    "curParamTableData": $scope.commonParams.data[iDataIndex],
                                    "title": i18n.common_term_choose_label,
                                    "width": "900px",
                                    "height": "600px",
                                    "content-type": "url",
                                    "content": null,
                                    "buttons": null,
                                    "close": function (event) {
                                        rebuildTable();
                                    }
                                };
                                options.title = getTitleByResourceType(aData.rType);
                                //仅对于以下四种资源可以选择,不识别的只能输入
                                if ("az" === rType) {
                                    options.content = "app/business/application/views/appInstance/createByOpenstack/selAvailableZone.html";
                                } else if ("network" === rType) {
                                    options.content = "app/business/application/views/appInstance/createByOpenstack/selNetwork.html";
                                } else if ("image" === rType) {
                                    options.content = "app/business/application/views/appInstance/createByOpenstack/selImage.html";
                                } else if ("instanceType" === rType) {
                                    options.content = "app/business/application/views/appInstance/createByOpenstack/selInstanceType.html";
                                } else if ("loadBalancer" === rType) {
                                    options.content = "app/business/application/views/appInstance/createByOpenstack/selLoadBalancer.html";
                                } else if ("securityGroup" === rType) {
                                    options.content = "app/business/application/views/appInstance/createByOpenstack/selSecurityGroup.html";
                                } else {
                                    options.content = null;
                                }
                                if (options.content !== null) {
                                    var win = new Window(options);
                                    win.show();
                                }
                            };
                            var paramSelectNode = paramSelectLink(paramSelectScope);
                            $("td:eq(6)", nRow).html(paramSelectNode);
                        },
                        "callback": function (evtObj) {
                            page.currentPage = evtObj.currentPage;
                            page.displayLength = evtObj.displayLength;
                            rePaginationTable(true);
                        },
                        "changeSelect": function (evtObj) {
                            page.currentPage = evtObj.currentPage;
                            page.displayLength = evtObj.displayLength;
                            rePaginationTable(true);
                        }
                    },

                    "preBtn": {
                        "id": "createApp-chooseNetwork-preBtn",
                        "text": i18n.common_term_back_button,
                        "click": function () {
                            $scope.service.show = {
                                "chooseTemplate": false,
                                "basicInfo": true,
                                "configParam": false,
                                "confirmByTemplate": false
                            };
                            $("#createByOpenstack-app-step").widget().pre();
                        }
                    },
                    "nextBtn": {
                        "id": "createApp-chooseNetwork-nextBtn",
                        "text": i18n.common_term_next_button,
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#createAppNetwork"));
                            if (!valid) {
                                return;
                            }

                            //校验所有分页的params均是否已填
                            if (!checkAllCommonParam()) {
                                messageServiceIns.errorMsgBox("10004", i18n.app_app_create_info_publicVariableNoCfg_msg);
                                return;
                            }

                            $scope.service.show = {
                                "chooseTemplate": false,
                                "basicInfo": false,
                                "configParam": false,
                                "confirmByTemplate": true
                            };

                            $("#createByOpenstack-app-step").widget().next();
                            $scope.$emit($scope.events.selParamNext);
                        }
                    },
                    "cancelBtn": {
                        "id": "createApp-chooseNetwork-cancel",
                        "text":i18n.common_term_cancle_button,
                        "click": function () {
                            if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                                $state.go("application.manager.instance");
                            } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                                $state.go("application.manager.overview");
                            } else {
                                $state.go("application.manager.template");
                            }
                        }
                    }
                };

                function generateCheckRules(rowData) {
                    var allowedPattern = rowData.allowedPattern;
                    var constraintDesc = rowData.constraintDescription || "";
                    return "regularCheck(/" + allowedPattern + "/):" + constraintDesc + ";";
                }

                function checkAllCommonParam() {
                    if ($scope.commonParams.allData.length <= 0) {
                        return true;
                    }

                    var tmp = null;
                    for (var i = 0; i < $scope.commonParams.allData.length; i++) {
                        if (!$scope.commonParams.allData[i] || !$scope.commonParams.allData[i].selectId) {
                            return false;
                        }
                        tmp = $scope.commonParams.allData[i].selectId;
                        tmp = $.trim(tmp);
                        if (!tmp || ("" === tmp)) {
                            return false;
                        }
                    }
                    return true;
                }

                //isApply是否主动apply
                function rePaginationTable(isApply) {
                    var allEndIndex = $scope.commonParams.allData.length;
                    if (allEndIndex <= 0) {
                        return;
                    }
                    var start = page.getStart();
                    var end = start + page.displayLength;
                    end = (end <= allEndIndex ? end : allEndIndex);
                    var pageParamTableData = $scope.commonParams.allData.slice(start, end);
                    if (isApply) {
                        $scope.$apply(function () {
                            $scope.commonParams.data = pageParamTableData;
                        });
                    } else {
                        $scope.commonParams.data = pageParamTableData;
                    }
                }

                //重新组合data触发表格刷新
                function rebuildTable() {
                    var newParamTable = [];
                    _.each($scope.commonParams.data, function (item, index) {
                        newParamTable.push(item);
                    });
                    $scope.$apply(function () {
                        $scope.commonParams.data = newParamTable;
                    });
                }

                function rebuildTableWithoutApply() {
                    var newParamTable = [];
                    _.each($scope.commonParams.data, function (item, index) {
                        newParamTable.push(item);
                    });
                    $scope.commonParams.data = newParamTable;
                }

                function getTitleByResourceType(type) {
                    if (!type) {
                        return i18n.common_term_choose_label;
                    }
                    if (TYPE_TITLE_MAP[type]) {
                        return i18n.common_term_choose_label + TYPE_TITLE_MAP[type];
                    }
                    return i18n.common_term_choose_label;
                }

                $scope.$on($scope.events.selBaseInfoNextFromParent, function (event, msg) {
                    rePaginationTable(false);
                    $scope.info.commonParams.totalRecords = $scope.commonParams.allData.length;
                });
            }
        ];
        return ctrl;
    });
