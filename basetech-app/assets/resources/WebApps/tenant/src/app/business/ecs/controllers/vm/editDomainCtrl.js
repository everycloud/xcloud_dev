/**
 * 文件名：modifyDomainCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-vm-设置标签的control
 * 修改时间：14-4-24
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'tiny-lib/underscore',
        'tiny-common/UnifyValid',
        'app/services/httpService',
        'app/services/exceptionService',
        'app/business/ecs/services/vm/updateVmService',
        'app/business/ecs/services/vm/vmDomainService',
        'tiny-directives/RadioGroup'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, _, UnifyValid, http, exceptionService, updateVmService, vmDomainService) {
        "use strict";
        var modifyDomainCtrl = ["$q", "$scope", "$compile", "camel", "exception",
            function ($q, $scope, $compile, camel, exception) {
                var winParam = $("#ecsVmsDetailDomainWinId").widget().option("winParam");
                winParam = winParam || {};
                var user = $("html").scope().user || {};
                var updateVmServiceIns = new updateVmService(exception, $q, camel);
                var vmDomainServiceIns = new vmDomainService(exception, $q, camel);
                var vpcId = "-1";
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.oldDomainId = winParam.domainId;
                $scope.curDomainId = winParam.domainId;

                $scope.tree = {
                    "id": "ecsVmsDetailDomainTree",
                    "width": "330px",
                    "height": "160px",
                    "setting": {
                        view: {
                            selectedMulti: false //true时，按住ctrl可多选
                        },
                        data: {
                            simpleData: {
                                enable: true,
                                idKey: "id",
                                pIdKey: "pId",
                                rootPId: "rootId"
                            }
                        },
                        callback: {
                            onClick: function (event, id, node) {
                                var tempId;
                                if ($scope.curDomainId === node.id) {
                                    var zTree = $("#" + $scope.tree.id).widget().getZTreeObj();
                                    zTree.cancelSelectedNode();
                                    tempId = "";
                                } else {
                                    tempId = node.id;
                                }

                                $scope.$apply(function () {
                                    $scope.curDomainId = tempId;
                                });
                            },
                            beforeClick: function (treeId, treeNode, clickFlag) {
                                // 根节点不可点击
                                return treeNode.id !== "rootId";
                            }
                        }
                    },
                    "values": []
                };

                $scope.okBtn = {
                    "id": "ecsVmSetTagOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var options = {
                            "user": user,
                            "cloudInfraId": winParam.cloudInfraId,
                            "vpcId": vpcId,
                            "domain": {
                                "vmIds": [winParam.vmId],
                                "inDomainId": $scope.curDomainId,
                                "outDomainId": $scope.oldDomainId
                            }
                        };
                        var defer = updateVmServiceIns.modifyVmBatch(options);
                        defer.then(function () {
                            if (!$scope.curDomainId) {
                                winParam.refreshType = "refreshParent";
                            } else {
                                winParam.refreshType = "refreshSelf";
                            }
                            $("#ecsVmsDetailDomainWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmSetTagCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmsDetailDomainWinId").widget().destroy();
                    }
                };

                $scope.operate = {
                    "queryDomainList": function () {
                        var deferred = vmDomainServiceIns.queryDomains({
                            "user": user,
                            "params": {
                                "user-id": user.id
                            }
                        });
                        deferred.then(function (data) {
                            var treeData = [{
                                "id": "rootId",
                                "pId": null,
                                "name": "domain",
                                "isParent": true,
                                "open": true
                            }];

                            if (data && data.domainList) {
                                var node;
                                _.each(data.domainList, function (item) {
                                    node = {
                                        "id": item.domainId,
                                        "pId": "rootId",
                                        "name": item.domainName,
                                        "icon": "../theme/default/images/gm/domain.png"
                                    };
                                    if (node.id === $scope.curDomainId) {
                                        node.selected = true;
                                    }
                                    treeData.push(node);
                                });
                            }
                            $scope.tree.values = treeData;
                        });
                    }
                };

                function init() {
                    $scope.operate.queryDomainList();
                }

                // 初始化
                init();
            }
        ];

        var modifyDomainModule = angular.module("ecs.vm.modify.domain", ['ng', 'wcc',"ngSanitize"]);
        modifyDomainModule.controller("ecs.vm.modify.domain.ctrl", modifyDomainCtrl);
        modifyDomainModule.service("camel", http);
        modifyDomainModule.service("exception", exceptionService);
        return modifyDomainModule;
    }
);
