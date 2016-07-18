define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    'app/services/cloudInfraService',
    'tiny-widgets/Window',
    "app/services/messageService",
    "app/business/ssp/controllers/plugin/app/constants",
    "app/business/ssp/services/plugin/app/appCommonService",
    "fixtures/appFixture", "fixtures/network/vpcFixture"],
    function ($, encoder, angular, _, UnifyValid, cloudInfraService, Window, messageService, constants, appCommonService) {
        "use strict";

        var ctrl = ["$scope", "camel", "$compile", "$state", "$q" , "exception",
            function ($scope, camel, $compile, $state, $q, exception) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n;
                var messageServiceIns = new messageService();
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var appCommonServiceIns = new appCommonService(exception, $q, camel);

                var TYPE_TITLE_MAP = {
                    "az": "AvailableZone",
                    "network": "Subnet",
                    "image": "Image",
                    "instanceType": "Flavor"
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
                    "location": {
                        label: i18n.common_term_section_label + ":",
                        require: true,
                        "id": "createApp-chooseLocation",
                        "width": "149",
                        'validate': "required:" + i18n.common_term_null_valid + ";",
                        "change": function () {
                            $("#" + $scope.info.vpc.id).widget().opChecked();
                            var resPoolId = $("#createApp-chooseLocation").widget().getSelectedId();
                            if (!resPoolId) {
                                return;
                            }
                            _.each($scope.commonParams.allData, function (item, index) {
                                var type = item.rType;
                                if (type === "instanceType" || type === "image" || type === "network" || type === "az") {
                                    $scope.commonParams.allData[index].selectId = "";
                                    $scope.commonParams.allData[index].value = "";
                                }
                            });
                            rePaginationTable(false);
                            getVPCList(resPoolId);
                        },
                        "values": []
                    },
                    "locationLock": {
                        "label": "",
                        "require": "true",
                        "id": "locationSelect",
                        "spacing": {
                            "width": "50px",
                            "height": "30px"
                        },
                        "values": [
                            {
                                "key": "1",
                                "text": i18n.service_term_inputWhenApply_label
                            },
                            {
                                "key": "2",
                                "text": i18n.service_term_inputWhenApprove_label
                            },
                            {
                                "key": "0",
                                "text": i18n.user_term_lock_value,
                                "checked": true
                            }
                        ],
                        "layout": "horizon",
                        "change": function () {
                            $scope.lock.locationLock = $("#" + $scope.info.locationLock.id).widget().opChecked("checked");
                            $scope.lock.vpcLock = $scope.lock.locationLock;
                            var vLock = $("#" + $scope.info.vpcLock.id).widget();
                            vLock.opChecked($scope.lock.locationLock, true);

                            if ($scope.lock.locationLock === '0') {
                                $scope.info.location.disable = false;
                                vLock.opDisabled("0", false);
                                vLock.opDisabled("1", false);
                                if ($scope.params.approvalType !== 'none') {
                                    vLock.opDisabled("2", false);
                                }
                                $scope.info.vpc.disable = false;

                            } else {
                                $scope.info.location.disable = true;
                                vLock.opDisabled("0", true);
                                if ($scope.lock.locationLock === '2') {
                                    vLock.opDisabled("1", true);
                                    vLock.opDisabled("2", true);
                                }
                                $scope.info.vpc.disable = true;
                            }

                            _.each($scope.commonParams.allData, function (item, index) {
                                if ($scope.lock.locationLock === "1") {
                                    item.btnDisable = true;
                                    item.selectDisable = true;
                                    item.dvalue = true;
                                    item.inputType = "1";
                                } else if ($scope.lock.locationLock === "0") {
                                    item.btnDisable = false;
                                    item.selectDisable = false;
                                    item.dvalue = false;
                                    item.inputType = "0";
                                } else if ($scope.lock.locationLock === "2") {
                                    item.btnDisable = true;
                                    item.selectDisable = true;
                                    item.dvalue = true;
                                    item.inputType = "2";
                                }
                            });

                            rePaginationTable(false);
                        }
                    },

                    "vpc": {
                        label: i18n.vpc_term_vpc_label + ":",
                        require: true,
                        "id": "createApp-chooseVpc",
                        "width": "149",
                        'validate': "required:" + i18n.common_term_null_valid + ";",
                        "values": [],
                        "change": function () {
                            var vpcId = $("#createApp-chooseVpc").widget().getSelectedId();
                            if (!vpcId) {
                                return;
                            }
                            _.each($scope.commonParams.allData, function (item, index) {
                                var type = item.rType;
                                if (type === "network") {
                                    $scope.commonParams.allData[index].selectId = "";
                                    $scope.commonParams.allData[index].value = "";
                                }
                            });
                            rePaginationTable(false);
                        }
                    },
                    "vpcLock": {
                        "label": "",
                        "require": "true",
                        "id": "vpcSelect",
                        "spacing": {
                            "width": "50px",
                            "height": "30px"
                        },
                        "values": [
                            {
                                "key": "1",
                                "text": i18n.service_term_inputWhenApply_label
                            },
                            {
                                "key": "2",
                                "text": i18n.service_term_inputWhenApprove_label
                            },
                            {
                                "key": "0",
                                "text": i18n.user_term_lock_value,
                                "checked": true
                            }
                        ],
                        "layout": "horizon",
                        "change": function () {
                            $scope.lock.vpcLock = $("#" + $scope.info.vpcLock.id).widget().opChecked("checked");
                            if ($scope.lock.vpcLock === '0') {
                                $scope.info.vpc.disable = false;
                            } else {
                                $scope.info.vpc.disable = true;
                            }

                            _.each($scope.commonParams.allData, function (item, index) {
                                if (item.rType === "network" && $scope.lock.vpcLock === "1") {
                                    item.btnDisable = true;
                                    item.selectDisable = true;
                                    item.dvalue = true;
                                    item.inputType = "1";
                                } else if (item.rType === "network" && $scope.lock.vpcLock === "0") {
                                    item.btnDisable = false;
                                    item.selectDisable = false;
                                    item.dvalue = false;
                                    item.inputType = "0";
                                } else if (item.rType === "network" && $scope.lock.vpcLock === "2") {
                                    item.btnDisable = true;
                                    item.selectDisable = true;
                                    item.dvalue = true;
                                    item.inputType = "2";
                                }

                            });

                            rePaginationTable(false);
                        }
                    },
                    "commonParams": {
                        "id": "create-app-commonParams",
                        "enablePagination": true,
                        "draggable": true,
                        "paginationStyle": "full_numbers",
                        "displayLength": 10,
                        "totalRecords": 0,
                        "lengthMenu": [10, 20, 30],
                        "columnsVisibility": {
                            "activate": "click", 
                            "aiExclude": [0],
                            "bRestore": false,
                            "fnStateChange": function (index, state) {
                            }
                        },

                        "columns": [
                            {
                                "sTitle": i18n.common_term_paraName_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.name);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_limitRule_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.allowedPattern);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_limitDesc_label,
                                "sWidth": "15%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.constraintDescription);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_paraDesc_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.description);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_paraValue_label,
                                "sWidth": "27%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.selectId);
                                }
                            },
                            {
                                "sTitle": i18n.service_term_inputType_label,
                                "sWidth": "10%",
                                "dData": ""
                            },
                            {
                                "sTitle": i18n.common_term_resourceName_label,
                                "sWidth": "10%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.value);
                                }
                            },
                            {
                                "sTitle": i18n.common_term_setPara_label,
                                "sWidth": "8%",
                                "bSortable": false,
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.description);
                                }
                            }
                        ],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            $("td:eq(0)", nRow).addTitle();
                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            $("td:eq(3)", nRow).addTitle();
                            $("td:eq(5)", nRow).addTitle();

                            var paramInputBox;
                            if (!aData.NoEcho) {
                                paramInputBox = "<div><tiny-textbox id='id' value='value' disable='disable'  validate='validate' change='change()' width='100' blur='blur()'></tiny-textbox></div>";
                            } else {
                                paramInputBox = "<div><tiny-textbox id='id' value='value' disable='disable' type='type' validate='validate' change='change()' width='100' blur='blur()'></tiny-textbox></div>";
                            }
                            var paramInputLink = $compile(paramInputBox);
                            var paramInputScope = $scope.$new();
                            paramInputScope.id = "createAppInputCommonParams" + iDataIndex;
                            paramInputScope.value = aData.selectId;
                            paramInputScope.disable = aData.dvalue;
                            if (aData.allowedPattern && (aData.allowedPattern !== "")) {
                                paramInputScope.validate = "required:" + i18n.common_term_null_valid + ";" + generateCheckRules(aData);
                            } else {
                                paramInputScope.validate = "required:" + i18n.common_term_null_valid + ";";
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
                            paramInputScope.blur = function () {
                            };
                            var paramInputNode = paramInputLink(paramInputScope);
                            $("td:eq(4)", nRow).html(paramInputNode);

                            var inputTypeStr = "<tiny-select id='selectId' disable='selectDisable' default-selectid='defaultType' values='values' width='100' change='selectChange()'></select>";
                            var inputTypeLink = $compile(inputTypeStr);
                            var inputTypeScope = $scope.$new();
                            inputTypeScope.selectId = "createAppInputType" + iDataIndex;
                            inputTypeScope.selectDisable = (aData.selectDisable !== null || aData.selectDisable !== undefined) ? aData.selectDisable : false;
                            inputTypeScope.defaultType = aData.inputType ? aData.inputType : "0";
                            $scope.commonParams.data[iDataIndex].inputType = aData.inputType ? aData.inputType : "0";
                            var approvalSelect = $scope.params.approvalType !== "none" ? [
                                {
                                    "selectId": "1",
                                    "label": i18n.service_term_inputWhenApply_label
                                },
                                {
                                    "selectId": "2",
                                    "label": i18n.service_term_inputWhenApprove_label
                                },
                                {
                                    "selectId": "0",
                                    "label": i18n.user_term_lock_value
                                }
                            ] : [
                                {
                                    "selectId": "1",
                                    "label": i18n.service_term_inputWhenApply_label
                                },
                                {
                                    "selectId": "0",
                                    "label": i18n.user_term_lock_value
                                }
                            ];
                            inputTypeScope.values = aData.selectValues ? aData.selectValues : $scope.commonParams.data[iDataIndex].selectValues = approvalSelect;
                            inputTypeScope.selectChange = function () {
                                var checkLabel = $("#createAppInputType" + iDataIndex).widget().getSelectedId();
                                $scope.commonParams.data[iDataIndex].inputType = checkLabel;
                                if (checkLabel === "0") {
                                    $scope.commonParams.data[iDataIndex].dvalue = false;
                                    $scope.commonParams.data[iDataIndex].btnDisable = false;
                                } else if (checkLabel === "1") {
                                    $scope.commonParams.data[iDataIndex].dvalue = true;
                                    $scope.commonParams.data[iDataIndex].btnDisable = true;
                                } else {
                                    $scope.commonParams.data[iDataIndex].dvalue = true;
                                    $scope.commonParams.data[iDataIndex].btnDisable = true;
                                }
                                $scope.commonParams.data[iDataIndex].inputType = checkLabel;

                                rebuildTableWithoutApply();
                            };
                            var inputTypeNode = inputTypeLink(inputTypeScope);
                            $("td:eq(5)", nRow).html(inputTypeNode);

                            //注:此处行间样式为归避"列表中的tiny-button的样式问题"
                            var paramSelect;
                            if ((aData.rType === "az") || (aData.rType === "network") || (aData.rType === "image") || (aData.rType === "instanceType")) {
                                paramSelect = "<div><div style='margin-top: 8px;margin-bottom: 8px;'><tiny-button id='btnId' text='btnText' click='btnClick(vmTemplateId)' disable='btnDisable'></tiny-button></div></div>";
                            } else {
                                paramSelect = "<div style='height: 43px;'></div>";
                            }
                            var paramSelectLink = $compile(paramSelect);
                            var paramSelectScope = $scope.$new();
                            paramSelectScope.btnId = "createAppInputCommonParamsBtn" + iDataIndex;
                            paramSelectScope.btnText = i18n.common_term_choose_label;
                            paramSelectScope.btnDisable = aData.btnDisable;
                            paramSelectScope.btnClick = function () {
                                var rType = aData.rType;

                                var cloudInfraId = $("#" + $scope.info.location.id).widget().getSelectedId();
                                if (cloudInfraId === null || cloudInfraId === "" || cloudInfraId === undefined) {
                                    return;
                                }
                                var vpcId = $("#" + $scope.info.vpc.id).widget().getSelectedId();
                                var vpcName = $("#" + $scope.info.vpc.id).widget().getSelectedLabel();
                                if (vpcId === null || vpcId === "" || vpcId === undefined) {
                                    return;
                                }

                                var options = {
                                    "winId": "createByOpenstack_configParamWin",
                                    "resourceType": rType,
                                    "resPoolId": cloudInfraId,
                                    "vpcId": vpcId,
                                    "vpcName": vpcName,
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
                                    options.content = "app/business/ssp/views/plugin/app/createByOpenstack/selAvailableZone.html";
                                } else if ("network" === rType) {
                                    options.content = "app/business/ssp/views/plugin/app/createByOpenstack/selNetwork.html";
                                } else if ("image" === rType) {
                                    options.content = "app/business/ssp/views/plugin/app/createByOpenstack/selImage.html";
                                } else if ("instanceType" === rType) {
                                    options.content = "app/business/ssp/views/plugin/app/createByOpenstack/selInstanceType.html";
                                } else {
                                    options.content = null;
                                }
                                if (options.content !== null) {
                                    var win = new Window(options);
                                    win.show();
                                }
                            };
                            var paramSelectNode = paramSelectLink(paramSelectScope);
                            $("td:eq(7)", nRow).html(paramSelectNode);
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
                            $scope.params.selVpcId = $("#createApp-chooseVpc").widget().getSelectedId();
                            $scope.params.selVpcName = $("#createApp-chooseVpc").widget().getSelectedLabel();
                            $scope.params.selResPoolId = $("#createApp-chooseLocation").widget().getSelectedId();
                            $scope.params.selResPoolName = $("#createApp-chooseLocation").widget().getSelectedLabel();
                            //校验所有分页的params均是否已填
                            if (!checkAllCommonParam()) {
                                messageServiceIns.errorMsgBox("10004", i18n.app_app_create_info_publicVariableNoCfg_msg);
                                return;
                            }

                            _.each($scope.commonParams.allData, function (item, index) {
                                if (item.inputType !== "0") {
                                    $scope.commonParams.allData[index].selectId = "";
                                    $scope.commonParams.allData[index].value = "";
                                }
                            });

                            $scope.service.show = {
                                "chooseTemplate": false,
                                "basicInfo": false,
                                "configParam": false,
                                "confirmByTemplate": true
                            };

                            //触发确认页面的更新
                            var confirmParams = [];
                            _.each($scope.commonParams.data, function (item, index) {
                                confirmParams.push(item);
                            });
                            $scope.commonParams.data = confirmParams;

                            $("#createByOpenstack-app-step").widget().next();
                            $scope.$emit($scope.events.selParamNext);
                        }
                    },
                    "cancelBtn": {
                        "id": "createApp-chooseNetwork-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $state.go("ssp.catalog");
                        }
                    }
                };

                function getLocations() {
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id, "openstack");
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        if (!data.cloudInfras) {
                            return;
                        }

                        //修改模式下匹配并选中,如匹配不上则有问题
                        if ($scope.params.isModify) {
                            _.each(data.cloudInfras, function (item, index) {
                                if ($scope.params.selResPoolId && ($scope.params.selResPoolId === item.selectId)) {
                                    item.checked = true;
                                } else {
                                    item.checked = false;
                                }
                            });
                        } else {
                            if (data.cloudInfras.length > 0) {
                                $scope.params.selResPoolId = data.cloudInfras[0].selectId;
                            }
                        }

                        $scope.info.location.values = data.cloudInfras;
                        if ($scope.params.selResPoolId) {
                            getVPCList($scope.params.selResPoolId);
                        }
                    });
                }

                function getVPCList(cloudInfraId) {
                    if (!cloudInfraId) {
                        return;
                    }

                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfraId
                    };
                    var deferred = appCommonServiceIns.queryVpcList(options);
                    deferred.then(function (data) {
                        if (!data || !data.vpcs) {
                            return;
                        }

                        //清空下拉已选的
                        if (data.vpcs.length <= 0) {
                            $("#createApp-chooseVpc").widget().opChecked();
                            $scope.params.selVpcId = null;
                            $scope.info.vpc.values = [];
                        }

                        //适配下拉框 考虑创建流程,修改,回退再下一步等场景
                        var availableVpcs = [];
                        var tmpVpc = null;
                        _.each(data.vpcs, function (item, index) {
                            tmpVpc = {
                                "selectId": item.vpcID,
                                "label": item.name
                            };
                            if ($scope.params.selVpcId) {
                                if ($scope.params.selVpcId === tmpVpc.selectId) {
                                    tmpVpc.checked = true;
                                } else {
                                    tmpVpc.checked = false;
                                }
                            } else {
                                if (index === 0) {
                                    tmpVpc.checked = true;
                                    $scope.params.selVpcId = tmpVpc.selectId;
                                }
                            }
                            availableVpcs.push(tmpVpc);
                        });
                        $scope.info.vpc.values = availableVpcs;
                    });
                }

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
                        //锁定的情况下不用校验
                        if ($scope.commonParams.allData[i].dvalue === true) {
                            continue;
                        }
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

                function init () {
                    if ($scope.params.isModify) {
                        var lock = $scope.detail.param.lock;
                        var locationLock = lock.locationLock;
                        var vpcLock = lock.vpcLock;

                        $("#" + $scope.info.locationLock.id).widget().opChecked(locationLock, true);
                        $("#" + $scope.info.vpcLock.id).widget().opChecked(vpcLock, true);
                        if (locationLock !== "0") {
                            $("#" + $scope.info.vpcLock.id).widget().opDisabled("1", true);
                            $("#" + $scope.info.vpcLock.id).widget().opDisabled("2", true);
                            $("#" + $scope.info.vpcLock.id).widget().opDisabled("0", true);

                            $scope.info.location.disable = true;
                        }

                        if (vpcLock !== "0") {
                            $scope.info.vpc.disable = true;
                        }
                    }
                    if ($scope.params.approvalType === 'none') {
                        $("#" + $scope.info.locationLock.id).widget().opDisabled("2", true);
                        $("#" + $scope.info.vpcLock.id).widget().opDisabled("2", true);
                    }

                    $scope.params.approvalTypeName = $scope.params.approvalType === "none" ? i18n.service_term_approveNotRequire_label : i18n.service_term_approveByVDCadmin_label;
                }

                $scope.$on($scope.events.selBaseInfoNextFromParent, function (event, msg) {
                    rePaginationTable(false);
                    $scope.info.commonParams.totalRecords = $scope.commonParams.allData.length;
                    getLocations();
                    init();
                });
            }
        ];
        return ctrl;
    });
