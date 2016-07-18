/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/orgService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "fixtures/userFixture"
],
    function ($, angular, httpService, OrgService, ExceptionService, MessageService, commonService) {
        "use strict";
        var azManageCtrl = ["$scope", "camel",
            function ($scope, camel) {
                var user = $("html").scope().user;
                $scope.id = $("#azManageWindowId").widget().option("orgId");
                $scope.orgService = new OrgService();
                $scope.orgAzInfo = {
                    labelwidth: window.urlParams.lang === "zh" ? "80px" : "145px"
                };
                $scope.azSelectModel = {
                    "azSelectLabel": $scope.i18n.vpc_term_chooseCloudPool_label + ":",
                    "canSelectAzLabel": $scope.i18n.common_term_waitChoose_value,
                    "azSelectedLabel": $scope.i18n.common_term_choosed_value
                };
                $scope.leftAzSearchBox = {
                    "id": "leftAzSearchBoxId",
                    "placeholder": "",
                    "width": "150px",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        $scope.operator.initCanSelectCloudInfras(searchString);
                    }
                };
                $scope.rightAzSearchBox = {
                    "id": "rightAzSearchBoxId",
                    "placeholder": "",
                    "width": "150",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                    }
                };
                $scope.canSelectAz = {
                    "height": "28px",
                    "azList": []
                };
                $scope.selectedAz = {
                    "height": "28px",
                    width: "100px",
                    azList: []
                };

                $scope.selectAzLeftBtn = {
                    "click": function () {
                        var azList = $scope.canSelectAz.azList;
                        var len = azList.length;
                        for (var index = len - 1; index >= 0; index--) {
                            if ($("#" + azList[index].id).widget().option("checked")) {
                                if (!$scope.orgService.isExist(azList[index], $scope.selectedAz.azList)) {
                                    $scope.selectedAz.azList.push(azList[index]);
                                }
                                azList.splice(index, 1);
                            }
                        }
                    }
                };
                $scope.selectAzRightBtn = {
                    "click": function () {
                        var azList = $scope.selectedAz.azList;
                        var len = azList.length;
                        for (var index = len - 1; index >= 0; index--) {
                            if ($("#" + azList[index].id).widget().option("checked")) {
                                if (!$scope.orgService.isExist(azList[index], $scope.canSelectAz.azList)) {
                                    $scope.canSelectAz.azList.push(azList[index]);
                                }
                                azList.splice(index, 1);
                            }
                        }
                    }
                };
                $scope.modifyBtn = {
                    "id": "azManageBtnId",
                    "disable": false,
                    "text": $scope.i18n.common_term_save_label || "保存",
                    "click": function () {
                        $scope.operator.addOrgToCloudInfras();
                    }
                };
                $scope.cancelBtn = {
                    "id": "azManageCancelBtn",
                    "text": $scope.i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $("#azManageWindowId").widget().destroy();
                    }
                };
                $scope.operator = {
                    "initCanSelectCloudInfras": function (azName) {
                        var params = {
                            "start": 0,
                            "connect-status": "connected",
                            "service-status": "normal"
                        };
                        name && (params.name = name);
                        var deferred = camel.get({
                            "url": {
                                "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras",
                                "o": {"tenant_id": user.vdcId}
                            },
                            "params": params,
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {

                                var cloudInfras = (response && response.cloudInfras) || [];
                                var list = [];
                                for (var i = 0, len = cloudInfras.length; i < len; i++) {
                                    var item = cloudInfras[i];
                                    var checkItem = {
                                        "id": item.id,
                                        "name": item.name,
                                        "desc": item.description || ""
                                    };
                                    if ($scope.orgService.isExist(checkItem, $scope.selectedAz.azList)) {
                                        continue;
                                    }
                                    list.push(checkItem);
                                }
                                $scope.canSelectAz.azList = $scope.orgService.constructAZList(list, "left");
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });

                    },
                    "initAZList": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}/cloud-infras",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                response = response || {azInfos: []};
                                var azInfos = response.azInfos || [];
                                var azInfosList = [];
                                for (var i = 0, len = azInfos.length; i < len; i++) {
                                    azInfosList.push({
                                        id: azInfos[i].cloudInfraId,
                                        name: azInfos[i].cloudInfraName
                                    });
                                }
                                $scope.selectedAz.azList = $scope.orgService.constructAZList(azInfosList, "right");

                                // 初始化可选AZ列表
                                $scope.operator.initCanSelectCloudInfras();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },

                    "addOrgToCloudInfras": function () {
                        var range = $scope.selectedAz.azList || [];
                        if(!range.length)
                        {
                            $("#azManageWindowId").widget().destroy();
                            return;
                        }
                        var azBaseInfos = [];
                        for (var i = 0, len = range.length; i < len; i++) {
                            var item = range[i];
                            item && item.id && azBaseInfos.push({azId: "", cloudInfraId: item.id});
                        }

                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}/cloud-infras",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": JSON.stringify({azBaseInfos: azBaseInfos}),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $("#azManageWindowId").widget().destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };

                $scope.operator.initAZList();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.cloudInfrasManage", dependency);
        app.controller("userMgr.org.cloudInfrasManage.ctrl", azManageCtrl);
        app.service("camel", httpService);
        return app;
    });
