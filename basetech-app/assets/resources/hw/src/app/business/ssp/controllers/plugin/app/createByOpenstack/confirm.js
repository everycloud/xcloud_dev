/**
 * Created on 14-2-27.
 */
define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/application/controllers/constants",
    "app/business/ssp/services/catalog/catalogService"
], function ($, encoder, angular, _, constants, catalogService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$state", "$compile", "exception", "$q",
        function ($scope, camel, $state, $compile, exception, $q) {
            var user = $("html").scope().user;
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var i18n = $scope.i18n;
            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.info = {
                "locationLock": {
                    "label": "",
                    "require": "true",
                    "disable" : true,
                    "id": "locationConfirm",
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
                    "layout": "horizon"
                },
                "vpcLock": {
                    "label": "",
                    "require": "true",
                    "disable" : true,
                    "id": "vpcConfirm",
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
                    "layout": "horizon"
                },
                "confirmCommonParams": {
                    "id": "create-app-confirmCommonParams",
                    "enablePagination": true,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "displayLength": 10,
                    "totalRecords": 0,
                    "lengthMenu": [10, 20, 30],
                    "columnsVisibility": {
                        "activate": "click", //"mouseover"/"click"
                        "aiExclude": [0],
                        "bRestore": false,
                        "fnStateChange": function (index, state) {}
                    },

                    "columns": [{
                        "sTitle": i18n.common_term_paraName_label,
                        "sWidth": "17%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_paraDesc_label,
                        "sWidth": "22%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    }, {
                        "sTitle": i18n.common_term_paraValue_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.selectId);
                        }
                    },{
                        "sTitle": i18n.service_term_inputType_label,
                        "sWidth": "15%",
                        "dData": ""
                    }, {
                        "sTitle": i18n.common_term_resourceName_label,
                        "sWidth": "20%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.value);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var paramInputBox;
                        if (!aData.NoEcho) {
                            paramInputBox = "<div><div style='margin-top: 8px;margin-bottom: 8px;'><tiny-textbox id='id' value='value' validate='validate' change='change()' width='200' blur='blur()' disable='true' readonly='true'></tiny-textbox></div></div>";
                        } else {
                            paramInputBox = "<div><div style='margin-top: 8px;margin-bottom: 8px;'><tiny-textbox id='id' value='value' type='type' validate='validate' change='change()' width='200' blur='blur()' disable='true' readonly='true'></tiny-textbox></div></div>";
                        }
                        var paramInputLink = $compile(paramInputBox);
                        var paramInputScope = $scope.$new();
                        paramInputScope.id = "createAppInputConfirmCommonParams" + iDataIndex;
                        paramInputScope.value = aData.selectId;
                        paramInputScope.validate = "required:" + i18n.common_term_null_valid + ";";
                        if (aData.NoEcho) {
                            paramInputScope.type = "password";
                        }
                        paramInputScope.change = function () {
                            var paramValue = $("#createAppInputConfirmCommonParams" + iDataIndex).widget().getValue();
                            $scope.commonParams.data[iDataIndex].selectId = paramValue;
                            $scope.commonParams.data[iDataIndex].value = "";
                        };
                        paramInputScope.blur = function () {};
                        var paramInputNode = paramInputLink(paramInputScope);
                        $("td:eq(2)", nRow).html(paramInputNode);

                        var inputType = "<tiny-select id='selectId' disable='selectDisable' default-selectid='defaultType' values='values' width='150' change='selectChange()'></select>";
                        var inputTypeLink = $compile(inputType);
                        var inputTypeScope = $scope.$new();
                        inputTypeScope.defaultType = aData.inputType ? aData.inputType : "0";
                        inputTypeScope.selectId = "createAppInputType" + iDataIndex;
                        inputTypeScope.selectDisable = true;
                        inputTypeScope.values = aData.selectValues ? aData.selectValues : [
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
                                "label": i18n.user_term_lock_value,
                                "checked": true
                            }
                        ];
                        inputTypeScope.selectChange = function () {

                        };
                        var inputTypeNode = inputTypeLink(inputTypeScope);
                        $("td:eq(3)", nRow).html(inputTypeNode);
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
                    "id": "createApp-baseInfo-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = {
                            "chooseTemplate": false,
                            "basicInfo": false,
                            "configParam": true,
                            "confirmByTemplate": false
                        };
                        $("#createByOpenstack-app-step").widget().pre();
                    }
                },
                "nextBtn": {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": i18n.common_term_create_button,
                    "click": function () {
                        if ($scope.params.isModify) {
                            updateApp();
                        } else {
                            createApp();
                        }
                    }
                },
                "cancelBtn": {
                    "id": "createApp-baseInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("ssp.catalog");
                    }
                },
                "logo": {
                    "label": i18n.common_term_icon_label + ":",
                    "require": false,
                    "curLogo": "buff01.jpg"
                },
                "confirmInfo": {
                    "labelWidth": "85",
                    "serviceTemplateLabel": i18n.template_term_app_label + ":",
                    "nameLabel": i18n.common_term_name_label+":",
                    "resPoolLabel": i18n.common_term_section_label+":",
                    "vpcLabel": i18n.vpc_term_vpc_label + ":",
                    "descriptionLabel": i18n.common_term_desc_label+":",
                    "directory" : i18n.service_term_catalog_label + ":"
                }
            };

            //回退操作后,确认页面需要感知并刷新
            $scope.$on($scope.events.selVlbParamNextFromParent, function (event, msg) {
                var confirmTemplateNet = [];
                _.each($scope.templateNet.data, function (item, index) {
                    confirmTemplateNet.push(item);
                });
                var confirmConfAppVmTemplates = [];
                _.each($scope.confAppVmTemplates.data, function (item, index) {
                    confirmConfAppVmTemplates.push(item);
                });
                $scope.templateNet.data = confirmTemplateNet;
                $scope.confAppVmTemplates.data = confirmConfAppVmTemplates;
            });

            function generateParameters() {
                var parameters = [];
                var tmpParam = null;
                _.each($scope.commonParams.allData, function (item, index) {
                    //只有不是灰化的textbox才用值
                    if (!item.dvalue) {
                        tmpParam = {};
                        tmpParam.name = item.name;
                        tmpParam.value = item.selectId;
                        tmpParam.type = item.type;
                        tmpParam.desc = item.description;
                        tmpParam.rule = item.allowedPattern;
                        parameters.push(tmpParam);
                    }
                });

                var creatorParam = {};
                creatorParam.name = "Creator";
                creatorParam.value = user.id;
                creatorParam.type = "String";
                parameters.push(creatorParam);
                var pictureParam = {};
                pictureParam.name = "Picture";
                pictureParam.value = $scope.params.curLogo;
                pictureParam.type = "String";
                parameters.push(pictureParam);
                return parameters;
            }

            function updateApp() {
                var parametersHead = generateParameters();
                $scope.params.appTempBodyObj.Description = $scope.params.selDescription;
                if (!$scope.params.appTempBodyObj.Parameters) {
                    $scope.params.appTempBodyObj.Parameters = {};
                }
                var parameters = $scope.params.appTempBodyObj.Parameters;
                parameters.Creator = {
                    "Description": "User to create such stack",
                    "Default": user.id,
                    "Type": "String"
                };
                parameters.Picture = {
                    "Description": "Stack picture displayed",
                    "Default": $scope.params.curLogo,
                    "Type": "String"
                };
                var appTempBodyStr = JSON.stringify($scope.params.appTempBodyObj);

                var appData = {
                    "commonParams" : $scope.commonParams
                };

                var paramsJson = {
                    "cloudInfraId": $scope.lock.locationLock === "0" ? $scope.params.selResPoolId : "",
                    "vpcId": $scope.lock.vpcLock === "0" ? $scope.params.selVpcId : "",
                    "picture": $scope.params.curLogo,
                    "templateId": $scope.detail.param.templateId,
                    "lock" : $scope.lock,
                    "appData" : $.base64.encode(JSON.stringify(appData), true),
                    "appType" : "ict",
                    "templateBody": $scope.detail.param.templateBody,
                    "parameters" : parametersHead
                };

                var options = {
                    "user": user,
                    "serviceId" : $scope.params.serviceId,
                    "params" : {
                        "name": $scope.params.appName,
                        "iconId" : $scope.params.iconId,
                        "description": $scope.params.selDescription,
                        "approveType" : $scope.params.approvalType,
                        "catalogs" : $("#createDirectory").widget().getSelectedId(),
                        "params" : JSON.stringify(paramsJson)
                    }
                };

                var deferred = catalogServiceIns.modifyService(options);
                deferred.then(function (data) {
                    $state.go("ssp.catalog");
                });
            }

            function createApp() {
                var parametersHead = generateParameters();

                //更新描述等
                $scope.params.appTempBodyObj.Description = $scope.params.selDescription;
                if (!$scope.params.appTempBodyObj.Parameters) {
                    $scope.params.appTempBodyObj.Parameters = {};
                }
                var parameters = $scope.params.appTempBodyObj.Parameters;
                parameters.Creator = {
                    "Description": "User to create such stack",
                    "Default": user.id,
                    "Type": "String"
                };
                parameters.Picture = {
                    "Description": "Stack picture displayed",
                    "Default": $scope.params.curLogo,
                    "Type": "String"
                };
                var appTempBodyStr = JSON.stringify($scope.params.appTempBodyObj);

                var appData = {
                    "commonParams" : $scope.commonParams
                };

                var paramsJson = {
                    "cloudInfraId": $scope.lock.locationLock === "0" ? $scope.params.selResPoolId : "",
                    "vpcId": $scope.lock.vpcLock === "0" ? $scope.params.selVpcId : "",
                    "picture": $scope.params.curLogo,
                    "templateId": $scope.params.appTemplateId,
                    "lock" : $scope.lock,
                    "appData" : $.base64.encode(JSON.stringify(appData), true),
                    "appType" : "ict",
                    "templateBody": $.base64.encode(appTempBodyStr,true),
                    "parameters" : parametersHead
                };

                var options = {
                    "user": user,
                    "params" : {
                        "serviceTemplateId"  : $scope.params.templateId,
                        "name": $scope.params.appName,
                        "iconId" : $scope.params.iconId,
                        "description": $scope.params.selDescription,
                        "approveType" : $scope.params.approvalType,
                        "catalogs" : $("#createDirectory").widget().getSelectedId(),
                        "params" : JSON.stringify(paramsJson)
                    }
                };

                var deferred = catalogServiceIns.createService(options);
                deferred.then(function (data) {
                    $state.go("ssp.catalog");
                });
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
                        $scope.commonParams.confirmData = pageParamTableData;
                    });
                } else {
                    $scope.commonParams.confirmData = pageParamTableData;
                }
            }

            $scope.$on($scope.events.selParamNextFromParent, function (event, msg) {
                $scope.info.nextBtn.text = ($scope.params.isModify ? i18n.user_term_modify_button : i18n.common_term_create_button);
                rePaginationTable(false);
                $scope.info.confirmCommonParams.totalRecords = $scope.commonParams.allData.length;

                var locationLock = $("#" + $scope.info.locationLock.id).widget();
                var vpcLock = $("#" + $scope.info.vpcLock.id).widget();

                locationLock.opChecked($scope.lock.locationLock, true);
                vpcLock.opChecked($scope.lock.vpcLock, true);

                locationLock.opDisabled("0", true);
                locationLock.opDisabled("1", true);
                locationLock.opDisabled("2", true);
                vpcLock.opDisabled("0", true);
                vpcLock.opDisabled("1", true);
                vpcLock.opDisabled("2", true);
            });
        }
    ];
    return ctrl;
});
