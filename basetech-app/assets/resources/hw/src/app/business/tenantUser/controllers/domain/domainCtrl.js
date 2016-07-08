/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-4-22
 */
/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-common/UnifyValid",
        "tiny-widgets/Window",
        'tiny-widgets/Message',
        "app/business/tenantUser/service/domainService",
        "app/business/tenantUser/service/userCommonService",
        "app/services/messageService",
        "app/services/commonService",
        "language/privilegeKeys",
        "app/business/tenantUser/service/userDomainService",
        "fixtures/userFixture",
        "tiny-directives/Tabs",
        "bootstrap/bootstrap.min"
    ],
    function ($, angular, _, UnifyValid, Window, Message, DomainService, UserCommonService, MessageService, commonService, PrivilegeKeys, userDomainService) {
        "use strict";
        var domainCtrl = ["$scope", "$compile", "$state", "camel", "$q", "exception",
            function ($scope, $compile, $state, camel, $q, exception) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n;
                var userCommonServiceIns = new UserCommonService();
                //脚本操作
                $scope.hasDomainOperateRight = _.contains(user.privilegeList, "111002");
                $scope.serviceInstance = new userDomainService(exception, $q, camel);
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.domainService = new DomainService();
                $scope.domainId = "domainParentId";
                $scope.inThisDomain = true;
                $scope.rootNode = true;
                $scope.domainLegend = i18n.common_term_detailInfo_label;
                $scope.domainDetail = {};
                // tab页签
                $scope.plugins = [{
                    "openState": "userMgr.domain.resourceCluster",
                    "name": i18n.common_term_vm_label
                }, {
                    "openState": "userMgr.domain.user",
                    "name": i18n.common_term_user_label
                }];
                $scope.selectedTab = i18n.common_term_user_label;
                $scope.setSelectedTabItem = function (name) {
                    $scope.selectedTab = name;
                };

                $scope.createUser = {
                    "value": "",
                    "label": i18n.user_term_createUser_button+":",
                    "type": "input",
                    "readonly": true
                };

                $scope.createTime = {
                    "value": "",
                    "display":true,
                    "label": i18n.common_term_createAt_label+":",
                    "type": "input",
                    "readonly": true
                };

                //帮助
                $scope.help = {
                    "helpKey": "drawer_domain",
                    "tips": i18n.common_term_help_label,
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };
                //树
                $scope.domainTree = {
                    id: "domainTreeId",
                    width: "230",
                    height: "600",
                    setting: {
                        view: {
                            selectedMulti: false
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            onClick: function (event, id, node) {
                                $scope.domainId = node.id;
                                $scope.domainName = node.name;
                                $scope.inThisDomain = node.hasPrivelegeOnDomain;
                                if (node.id === "domainParentId") {
                                    $("#" + $scope.addDomain.id).widget().option("disable", false);
                                    $("#" + $scope.deleteDomain.id).widget().option("disable", true);
                                    $scope.$apply(function () {
                                        $scope.rootNode = true;
                                        $scope.domainDetail.description = i18n.common_term_rootDirectory_label;
                                        $scope.name.value = "domain";
                                        $scope.createTime.value = "";
                                        $scope.createTime.display = false;
                                    });
                                } else {
                                    $scope.rootNode = false;
                                    $("#" + $scope.addDomain.id).widget().option("disable", true);
                                    $("#" + $scope.deleteDomain.id).widget().option("disable", false);
                                    $scope.operator.getDomainDetail($scope.domainId);
                                }
                                if ($state.current.name === "userMgr.domain.resourceCluster") {
                                    $("#domainClusterDiv").scope().operator.getVMList();
                                } else if ($state.current.name === "userMgr.domain.user") {
                                    $("#domainUserDiv").scope().operator.queryDomainUser();
                                }

                            }
                        }
                    },
                    values: []
                };

                $scope.name = {
                    "id": "domainNameId",
                    "label": i18n.common_term_name_label+":",
                    "value": ""
                };
                $scope.domainIdLabel = i18n.common_term_ID_label+":";
                $scope.description = {
                    "label": i18n.common_term_desc_label+":",
                    "id": "domainDescId",
                    "type": "multi",
                    "width": "300px",
                    "height": "80px",
                    "modifying": false,
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128}),
                    "value": "",
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

                //添加域
                $scope.addDomain = {
                    "id": "addDomainId",
                    "text": i18n.common_term_add_button,
                    "disable": false,
                    "iconsClass": "",
                    "click": function () {
                        var createWindow = new Window({
                            "winId": "createDomainWindowId",
                            "title": i18n.domain_term_addDomain_button,
                            "content-type": "url",
                            "content": "app/business/tenantUser/views/domain/createDomain.html",
                            "exception": exception,
                            "height": 300,
                            "width": 650,
                            "buttons": [
                                null,
                                null
                            ],
                            "close": function (event) {
                                $scope.operator.initTree();
                            }
                        }).show();
                    }
                };

                //删除域
                $scope.deleteDomain = {
                    "id": "deleteDomainId",
                    "text": i18n.common_term_delete_button,
                    "disable": true,
                    click: function () {
                        var deleteMsg = new Message({
                            "type": "prompt",
                            "title": i18n.common_term_confirm_label,
                            "content": i18n.domain_domain_del_info_confirm_msg,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [{
                                label:i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                'default': true
                            }, {
                                label: i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                'default': false
                            }]
                        });
                        deleteMsg.setButton("okBtn", function () {
                            $scope.operator.deleteDomain(deleteMsg);
                        });
                        deleteMsg.setButton("cancelBtn", function () {
                            deleteMsg.destroy();
                        });
                        deleteMsg.show();
                    }
                };

                //方法
                $scope.operator = {
                    "initTree": function () {
                        var promise = $scope.serviceInstance.queryDomain({
                            "user": user
                        });
                        promise.then(function (response) {
                            var domainList = []; !! response && (domainList = response.domainList);
                            $scope.domainTree.values = $scope.domainService.initTree(domainList, $scope.domainId);
                            if ($scope.domainId) {
                                $scope.operator.getDomainDetail($scope.domainId);
                            }
                        });
                    },
                    "getDomainDetail": function (domainId) {
                        if ("domainParentId" === domainId) {
                            $scope.domainDetail.description = i18n.common_term_rootDirectory_label;
                            $scope.name.value = "domain";
                            $scope.createTime.value = "";
                            $scope.createTime.display = false;
                            return;
                        }
                        var promise = $scope.serviceInstance.detailDomain({
                            "user": user,
                            "domainId": $scope.domainId
                        });
                        promise.then(function (response) {
                            if (!response) {
                                return;
                            }
                            $scope.createTime.display = true;
                            $scope.domainDetail.description = response.domainInfo.domainDesc;
                            $scope.name.value = response.domainInfo.domainName;
                            $scope.createTime.value = commonService.utc2Local(response.domainInfo.createTime);
                        });
                    },
                    "modifyDomainDetail": function (params) {
                        var promise = $scope.serviceInstance.modifyDomain({
                            "user": user,
                            "domainId": $scope.domainId,
                            "params": params
                        });
                        promise.then(function (response) {});
                    },
                    "deleteDomain": function (deleteMsg) {
                        var promise = $scope.serviceInstance.deleteDomain({
                            "user": user,
                            "domainId": $scope.domainId
                        });
                        promise.then(function (response) {
                            $scope.domainId = "domainParentId";
                            deleteMsg.destroy();
                            $scope.operator.initTree();
                            $("#domainUserDiv").scope().operator.queryDomainUser();
                        });
                    }
                };
                $scope.$on("$viewContentLoaded", function () {
                    //初始化树
                    $scope.operator.initTree();
                });

            }
        ];

        return domainCtrl;
    });
