/**
 * Created on 14-2-27.
 */
define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/application/controllers/constants",
    'app/business/application/services/appCommonService'
], function ($, encoder, angular, _, constants, appCommonService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$state", "$compile", "exception", "$q",
        function ($scope, camel, $state, $compile, exception, $q) {
            var user = $("html").scope().user;
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
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
                        "sWidth": "30%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    }, {
                        "sTitle": i18n.common_term_paraValue_label,
                        "sWidth": "25%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.selectId);
                        }
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
                        if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                            $state.go("application.manager.instance");
                        } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                            $state.go("application.manager.overview");
                        } else {
                            $state.go("application.manager.template");
                        }
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
                    "vpcLabel": "VPC:",
                    "descriptionLabel": i18n.common_term_desc_label+":"
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
                    tmpParam = {};
                    tmpParam.name = item.name;
                    tmpParam.value = item.selectId;
                    tmpParam.type = item.type;
                    tmpParam.desc = item.description;
                    tmpParam.rule = item.allowedPattern;
                    parameters.push(tmpParam);
                });

                var creatorParam = {};
                creatorParam.name = "Creator";
                creatorParam.value = user.id;
                creatorParam.type = "String";
                parameters.push(creatorParam);
                var pictureParam = {};
                pictureParam.name = "Picture";
                pictureParam.value = "../theme/default/images/gm/appImage/" + $scope.params.curLogo;
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
                var options = {
                    "user": user,
                    "vpcId": $scope.params.selVpcId,
                    "id": $scope.params.appId,
                    "cloudInfraId": $scope.params.selResPoolId,
                    "appName": $scope.params.appName,
                    "timeout": $scope.params.timeout,
                    "desc": $scope.params.selDescription,
                    "picture": "../theme/default/images/gm/appImage/" + $scope.params.curLogo,
                    "templateBody": $.base64.encode(appTempBodyStr, true),
                    "parameters": parametersHead
                };

                var deferred = appCommonServiceIns.updateApp(options);
                deferred.then(function (data) {
                    $state.go("application.manager.instance");
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

                var options = {
                    "user": user,
                    "cloudInfraId": $scope.params.selResPoolId,
                    "vpcId": $scope.params.selVpcId,
                    "appName": $scope.params.appName,
                    "timeout": $scope.params.timeout,
                    "desc": $scope.params.selDescription,
                    "picture": "../theme/default/images/gm/appImage/" + $scope.params.curLogo,
                    "templateId": $scope.params.selServiceTemplate.id,
                    "body": $.base64.encode(appTempBodyStr, true),
                    "parameters": parametersHead
                };
                var deferred = appCommonServiceIns.createAppByOpenstack(options);
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
            });
        }
    ];
    return ctrl;
});
