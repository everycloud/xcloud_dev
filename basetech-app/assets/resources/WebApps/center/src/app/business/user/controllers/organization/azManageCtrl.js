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
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/userFixture"
    ],
    function ($, angular, httpService, OrgService, ExceptionService, MessageService) {
        "use strict";
        var azManageCtrl = ["$scope", "camel",
            function ($scope, camel) {
                var user = $("html").scope().user;
                $scope.id = $("#azManageWindowId").widget().option("orgId");
                $scope.orgService = new OrgService();
                $scope.orgAzInfo ={
                    labelwidth: window.urlParams.lang === "zh" ? "80px" : "145px"
                };
                $scope.azSelectModel = {
                    "azSelectLabel": $scope.i18n.org_term_chooseAZ_label + ":",
                    "canSelectAzLabel": $scope.i18n.common_term_waitChoose_value,
                    "azSelectedLabel": $scope.i18n.common_term_choosed_value,
                    "noAzTips": $scope.i18n.org_vdc_add_info_noAZ_label || "当前系统中无可用分区"
                };
                $scope.leftAzSearchBox = {
                    "id": "leftAzSearchBoxId",
                    "placeholder": "",
                    "width": "150px",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchString) {
                        $scope.operator.initCanSelectAZ(searchString);
                    }
                };
                $scope.rightAzSearchBox = {
                    "id": "rightAzSearchBoxId",
                    "placeholder": "",
                    "width": "150",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchString) {}
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
                        $scope.operator.addOrgToAz();
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
                    "initCanSelectAZ": function (name) {
                        var params = {
                            "start": 0,
                            "manage-status": "occupied",
                            "service-status": "normal",
                            "detail":false
                        };
                        name && (params.name = name);
                        var deferred = camel.get({
                            "url": {
                                "s": "/goku/rest/v1.5/{tenant_id}/available-zones",
                                "o": {"tenant_id": user.vdcId}
                            },
                            "params": params,
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (response == null || response == undefined) {
                                    return;
                                }
                                var azList = [];
                                var azListRes = response.availableZones;

                                for (var item in azListRes) {
                                    azListRes[item].id = azListRes[item].id + "_" + azListRes[item].cloudInfraId;
                                    azListRes[item].name = azListRes[item].name + "(" + azListRes[item].cloudInfraName + ")";

                                    if ($scope.orgService.isExist(azListRes[item], $scope.selectedAz.azList)) {
                                        continue;
                                    }
                                    azList.push({
                                        "id": azListRes[item].id,
                                        "name": azListRes[item].name,
                                        "desc": azListRes[item].description || ""
                                    });
                                }
                                $scope.canSelectAz.azList = $scope.orgService.constructAZList(azList, "left");
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
                                if (response == null || response == undefined) {
                                    return;
                                }

                                // 初始化右侧AZ列表
                                var azList = [];
                                var azListRes = response.azInfos;
                                for (var item in azListRes) {
                                    // 将az Id 名称和资源池id 名称拼接起来
                                    azListRes[item].azId = azListRes[item].azId + "_" + azListRes[item].cloudInfraId;
                                    azListRes[item].azName = azListRes[item].azName + "(" + azListRes[item].cloudInfraName + ")";

                                    azList.push({
                                        "id": azListRes[item].azId,
                                        "name": azListRes[item].azName,
                                        "desc": azListRes[item].azDesc || ""
                                    });
                                }
                                $scope.selectedAz.azList = $scope.orgService.constructAZList(azList, "right");

                                // 初始化可选AZ列表
                                $scope.operator.initCanSelectAZ();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },

                    "addOrgToAz": function () {
                        var params = {};
                        var azBaseInfos = [];
                        var azList = $scope.selectedAz.azList;
                        if (azList == null || azList == undefined) {
                            azList = [];
                        }
                        for (var index in azList) {
                            var ids = azList[index].id.split("_");
                            azBaseInfos.push({
                                "azId": ids[0],
                                "cloudInfraId": ids[1]
                            });
                        }
                        params.azBaseInfos = azBaseInfos;

                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}/cloud-infras",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": JSON.stringify(params),
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
        var app = angular.module("userMgr.org.azManage", dependency);
        app.controller("userMgr.org.azManage.ctrl", azManageCtrl);
        app.service("camel", httpService);
        return app;
    });
