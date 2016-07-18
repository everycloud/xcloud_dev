/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-26
 */
/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    'tiny-widgets/Message',
    "app/business/user/service/domainService",
    "app/services/exceptionService",
    "app/services/commonService",
    "fixtures/userFixture",
    "tiny-directives/Tabs",
    "bootstrap/bootstrap.min"
],
    function ($, angular, UnifyValid, Window, Message, DomainService, ExceptionService, CommonService) {
        "use strict";
        var domainCtrl = ["$scope", "$compile", "$state", "camel",
                function ($scope, $compile, $state, camel) {
                    var user = $("html").scope().user;
                    var i18n = $scope.i18n;
                    //有坑中英文对照相反
                    $scope.hasDomainOperateRight = user.privilege.role_role_add_option_domainHandle_value;
                    $scope.openstack = user.cloudType === "OPENSTACK";
                    $scope.domainService = new DomainService();
                    $scope.domainId = "domainParentId";
                    $scope.domainName = "domain";
                    $scope.inThisDomain = true;

                    // tab页签
                    $scope.plugins = [
                        {
                            "openState": "userMgr.domain.user",
                            "name": i18n.common_term_users_label || "用户"
                        },
                        {
                            "openState": "userMgr.domain.resourceCluster",
                            "name": i18n.virtual_term_cluster_label || "资源集群"
                        }
                    ];
                    $scope.selectedTab = i18n.common_term_users_label || "用户";
                    $scope.setSelectedTabItem = function (name) {
                        $scope.selectedTab = name;
                    };

                    $scope.domainTree = {
                        id: "domainTreeId",
                        width: "290",
                        setting: {
                            view: {
                                selectedMulti: false
                            },
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },
                            check: {
                                autoCheckTrigger: false,
                                chkboxType: {
                                    "Y": "ps",
                                    "N": "ps"
                                },
                                chkStyle: "checkbox",
                                enable: false,
                                nocheckInherit: false,
                                chkDisabledInherit: false,
                                radioType: "level"
                            },
                            callback: {
                                onClick: function (event, id, node) {
                                    $scope.domainId = node.id;
                                    $scope.domainName = node.name;
                                    $scope.inThisDomain = node.hasPrivelegeOnDomain;
                                    if (node.id === "domainParentId") {
                                        $("#" + $scope.deleteDomain.id).widget().option("disable", true);
                                        $scope.$apply(function () {
                                            $scope.domainDetail.description = i18n.common_term_rootDirectory_label || "根目录";
                                            $scope.name.value = "domain";
                                            $scope.createTime.value = "";
                                        });
                                    } else {
                                        $("#" + $scope.deleteDomain.id).widget().option("disable", false);
                                        $scope.operator.getDomainDetail($scope.domainId);
                                    }
                                    if ($state.current.name === "userMgr.domain.resourceCluster") {
                                        $("#domainClusterDiv").scope().operator.getCluster();
                                    } else if ($state.current.name === "userMgr.domain.user") {
                                        $("#domainUserDiv").scope().operator.queryDomainUser();
                                    }
                                }
                            }
                        },
                        values: []
                    };

                    $scope.addDomain = {
                        "id": "addDomainId",
                        "text": i18n.common_term_add_button || "添加",
                        "disable": false,
                        "iconsClass": "",
                        "click": function () {
                            var createWindow = new Window({
                                "winId": "createDomainWindowId",
                                "title": i18n.domain_term_addDomain_button || "添加域",
                                "content-type": "url",
                                "content": "app/business/user/views/domain/createDomain.html",
                                "height": 300,
                                "width": 650,
                                "maximizable":false,
                                "minimizable":false,
                                "buttons": null,
                                "close": function (event) {
                                    $scope.operator.initTree();
                                }
                            }).show();
                        }
                    };
                    $scope.deleteDomain = {
                        "id": "deleteDomainId",
                        "text": i18n.common_term_delete_button || "删除",
                        "disable": true,
                        click: function () {
                            var deleteMsg = new Message({
                                "type": "confirm",
                                "title": i18n.common_term_confirm_label || "确认",
                                "content": i18n.domain_domain_del_info_confirm_msg || "确实要删除该分域吗？",
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: i18n.common_term_ok_button || '确定',
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn : true,
                                        default: true
                                    },
                                    {
                                        label: i18n.common_term_cancle_button || '取消',
                                        accessKey: '3',
                                        "key": "cancelBtn",
                                        default: false
                                    }
                                ]
                            });
                            deleteMsg.setButton("okBtn", function () {
                                deleteMsg.destroy();
                                $scope.operator.deleteDomain();
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy();
                            });
                            deleteMsg.show();
                        }
                    };
                    $scope.refresh = {
                        "id": "refreshDomainId",
                        "text": i18n.common_term_fresh_button || "刷新",
                        click: function () {
                            $scope.operator.initTree();
                        }
                    };
                    $scope.domainLegend = i18n.common_term_detailInfo_label || "详细信息";
                    $scope.domainDetail = {};
                    $scope.name = {
                        "id": "domainNameId",
                        "label": (i18n.common_term_name_label || "名称") + ":",
                        "value": ""
                    };
                    $scope.domainIdField = {
                        "id": "domainId",
                        "label":  "ID:",
                        "value": ""
                    };
                    $scope.description = {
                        "label": (i18n.common_term_desc_label || "描述") + ":",
                        "id": "domainDescId",
                        "type": "multi",
                        "width": "300px",
                        "height": "80px",
                        "modifying": false,
                        "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128}),
                        "clickModify": function () {
                            $scope.description.modifying = true;
                            //延时一会，否则获取不到焦点
                            setTimeout(function () {
                                $("#domainDescId input").focus();
                            }, 50);
                        },
                        "blur": function () {
                            var result = UnifyValid.FormValid($("#domainDescId"));
                            if (!result) {
                                return;
                            }
                            $scope.domainDetail.description = $("#domainDescId").widget().getValue();
                            $scope.description.modifying = false;
                            $scope.operator.modifyDomainDetail({
                                "domainDesc": $scope.domainDetail.description
                            });
                        },
                        "keypressfn": function (event) {
                            if (event.keyCode === 13) {
                                var result = UnifyValid.FormValid($("#domainDescId"));
                                if (!result) {
                                    return;
                                }
                                $scope.$apply(function () {
                                    $scope.domainDetail.description = $("#domainDescId").widget().getValue();
                                    $scope.description.modifying = false;
                                    $scope.operator.modifyDomainDetail({
                                        "domainDesc": $scope.domainDetail.description
                                    });
                                });
                            }
                        }
                    };
                    $scope.createTime = {
                        "value": "",
                        "label": (i18n.common_term_createAt_label || "创建时间") + ":",
                        "type": "input",
                        "readonly": true
                    };
                    $scope.operator = {
                        "initTree": function () {
                            var deferred = camel.get({
                                "url": {
                                    s: "/goku/rest/v1.5/{tenant_id}/domains",
                                    o: {
                                        "tenant_id": 1
                                    }
                                },
                                "params": {},
                                "userId": user.id
                            });
                            deferred.done(function (response) {
                                $scope.$apply(function () {
                                    var domainList = [];
                                    if (response) {
                                        domainList = response.domainList;
                                    }
                                    $scope.domainTree.values = $scope.domainService.initTree(domainList, $scope.domainId);
                                    if ($scope.domainId) {
                                        $scope.operator.getDomainDetail($scope.domainId);
                                    }
                                });
                            });
                            deferred.fail(function (response) {
                                $scope.$apply(function () {
                                    new ExceptionService().doException(response);
                                });
                            });
                        },
                        "getDomainDetail": function (domainId) {
                            if ("domainParentId" === domainId) {
                                $scope.domainDetail.description = i18n.common_term_rootDirectory_label || "根目录";
                                $scope.name.value = "domain";
                                $scope.createTime.value = "";
                                return;
                            }
                            var deferred = camel.get({
                                "url": {
                                    s: "/goku/rest/v1.5/{tenant_id}/domains/{id}",
                                    o: {
                                        "tenant_id": "1",
                                        "id": $scope.domainId
                                    }
                                },
                                "params": JSON.stringify(),
                                "userId": user.id
                            });
                            deferred.done(function (response) {
                                $scope.$apply(function () {
                                    if (response && response.domainInfo) {
                                        var domainInfo = response.domainInfo;
                                        $scope.domainDetail.description = domainInfo.domainDesc;
                                        $scope.name.value = domainInfo.domainName;
                                        $scope.domainIdField.value = domainInfo.domainId;
                                        $scope.createTime.value = domainInfo.createTime ? CommonService.utc2Local(domainInfo.createTime) : "";
                                    }
                                });
                            });
                            deferred.fail(function (response) {
                                $scope.$apply(function () {
                                    new ExceptionService().doException(response);
                                });
                            });
                        },
                        "modifyDomainDetail": function (params) {
                            var deferred = camel.put({
                                "url": {
                                    s: "/goku/rest/v1.5/{tenant_id}/domains/{id}",
                                    o: {
                                        "tenant_id": "1",
                                        "id": $scope.domainId
                                    }
                                },
                                "params": JSON.stringify(params),
                                "userId": user.id
                            });
                            deferred.done(function (response) {
                            });
                            deferred.fail(function (response) {
                                $scope.$apply(function () {
                                    new ExceptionService().doException(response);
                                });
                            });
                        },
                        "deleteDomain": function () {
                            var deferred = camel["delete"]({
                                "url": {
                                    s: "/goku/rest/v1.5/{tenant_id}/domains/{id}",
                                    o: {
                                        "tenant_id": "1",
                                        "id": $scope.domainId
                                    }
                                },
                                "params": {},
                                "userId": user.id
                            });
                            deferred.done(function (response) {
                                $scope.$apply(function () {
                                    $scope.domainId = "domainParentId";
                                    $scope.operator.initTree();
                                    $("#domainUserDiv").scope().operator.queryDomainUser();
                                });
                            });
                            deferred.fail(function (response) {
                                $scope.$apply(function () {
                                    new ExceptionService().doException(response);
                                });
                            });
                        }
                    };

                    $scope.operator.initTree();
                }
            ]
            ;

        return domainCtrl;
    })
;
