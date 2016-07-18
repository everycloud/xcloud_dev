/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-3-6
 */
define(['jquery'],function ($) {
    "use strict";
    var service = function () {
        this.treeConfig = {
            width: "200",
            height: "245",
            setting: {
                view: {
                    selectedMulti: false //true时，按住ctrl可多选
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
                    enable: true,
                    nocheckInherit: false,
                    chkDisabledInherit: false,
                    radioType: "level"
                },
                callback: {
                    onCheck: function (event, id, node) {
                        if(id === "leftTreeId" && node.checked){
                            var tree = $("#" + id).widget().getZTreeObj();
                            if(node && node.relatedPrivilegeIds && node.relatedPrivilegeIds.length > 0){
                                var relatedPrivilegeIds = node.relatedPrivilegeIds;
                                for(var index in relatedPrivilegeIds){
                                    var treeNode = tree.getNodeByParam("id", relatedPrivilegeIds[index]);
                                    if(treeNode){
                                        tree.checkNode(treeNode, true, true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        this.initTree = function (roleList, keyID) {
            var treeData = [{
                "id": "0",
                "pId": null,
                "name": keyID.user_term_authorizationList_label,
                "open": true,
                "relatedPrivilegeIds":[]
            }];

            if (!roleList) {
                return treeData;
            }

            for (var index in roleList) {
                if (!roleList[index]) {
                    continue;
                }
                var key = roleList[index].name;
                var name = keyID[key];
                var node = {
                    "id": roleList[index].id,
                    "pId": roleList[index].parentId,
                    "name": name || key,
                    "relatedPrivilegeIds": roleList[index].relatedPrivilegeIds
                };
                treeData.push(node);
            }
            return treeData;
        };

        // 从leftNodes中移除existTree
        this.moveExistPrivileges = function (nodesList, existTree) {
            var leftNodes = nodesList;
            // 获取已存在的节点
            var treeNodes = existTree.getNodes();
            if (undefined == treeNodes) {
                return;
            }
            var selectedNodes = existTree.transformToArray(treeNodes);
            if (selectedNodes == []) {
                return;
            }

            // 删除权限节点
            var nodesNumber = selectedNodes.length;
            for (var index = nodesNumber - 1; index >= 0; index--) {
                var selectedNode = selectedNodes[index];
                if (selectedNode.id === "0") {
                    continue;
                }

                // 查看这个节点是否存在
                var nodeIndex = -1;
                for (var i = leftNodes.length - 1; i >= 0; i--) {
                    if (leftNodes[i].id == selectedNode.id) {
                        nodeIndex = i;
                        break;
                    }
                }
                if (nodeIndex < 0) {
                    continue;
                }

                // 判断这个节点是否有子节点
                var hasChild = false;
                for (var i = leftNodes.length - 1; i >= 0; i--) {
                    if (leftNodes[i].parentId == selectedNode.id) {
                        hasChild = true;
                        break;
                    }
                }
                if (hasChild) {
                    continue;
                }
                leftNodes.splice(nodeIndex, 1);
            }
            return leftNodes;
        };

        this.movePrivilegeNodes = function (sourceTree, destinationTree) {
            // 获取已勾选的节点
            var selectedNodes = sourceTree.getCheckedNodes();
            if (selectedNodes == []) {
                return;
            }

            var destNodes = destinationTree.getNodes();
            var defaultParentNode;
            if (destNodes == null || destNodes == []) {
                defaultParentNode = null;
            } else {
                defaultParentNode = destNodes[0];
            }
            var addToCurrentPosition = function (pNode, node, tree) {
                tree.addNodes(pNode, node);
                var start = new Date().getTime();
                var sibling = tree.getNodesByFilter(function (node) {
                    return node.pId == pNode.id;
                }, false, pNode);
                var self = tree.getNodeByParam("id", node.id, pNode);
                var selfId = self.id;
                //只有一个时不需要移动
                if (sibling && sibling.length > 1) {
                    //不需要跟自己比较-->sibling.length - 1
                    //id是有序的，找到第一个大于自身id的节点，查到该节点的前面
                    for (var i = 0, len = sibling.length - 1; i < len; i++) {
                        if (+selfId < +sibling[i].id) {
                            break;
                        }
                    }
                    selfId !== sibling[i].id && tree.moveNode(sibling[i], self, "prev");
                }
                destinationTree.updateNode(self, true);
            };

            // 添加权限节点
            var nodesNumber = selectedNodes.length;
            for (var index = 0; index < nodesNumber; index++) {
                var selectNode = selectedNodes[index];
                var node = {
                    id: selectNode.id,
                    pId: selectNode.pId,
                    name: selectNode.name,
                    open: selectNode.open,
                    relatedPrivilegeIds: selectNode.relatedPrivilegeIds
                };
                // 权限列表不进行移动
                if (node.id === "0") {
                    continue;
                }
                // 在目的树上找该节点，如果找不到则添加上去
                if (destinationTree.getNodeByParam("id", node.id, null) == null) {

                    // 从目的树获取父节点
                    var destParentNode = destinationTree.getNodeByParam("id", node.pId, null);
                    addToCurrentPosition(destParentNode, node, destinationTree);
                }
            }

            // 目的树对应节点展开/收起 先操作父节点
            for (var index = 0; index < nodesNumber; index++) {
                var selectedNode = selectedNodes[index];
                var id = selectedNode.id;
                if (id === "0") {
                    continue;
                }
                var destNode = destinationTree.getNodeByParam("id", id, null);
                destinationTree.expandNode(destNode, selectedNode.open);
            }

            // 删除源树权限节点，先删除子节点
            for (var index = nodesNumber - 1; index >= 0; index--) {
                var selectedNode = selectedNodes[index];
                var id = selectedNode.id;
                if (id === "0") {
                    continue;
                }
                var sourceNode = sourceTree.getNodeByParam("id", id, null);
                !sourceNode.isParent && sourceTree.removeNode(sourceNode, false);
            }
        }

        // 获取权限列表，不返回id为filterId的权限
        this.getPrivilegeList = function (tree, filterId) {
            if (null == tree || undefined == tree) {
                return [];
            }
            var allNodes = tree.getNodes();
            if (allNodes == []) {
                return [];
            }

            var res = [];
            var allNodesArray = tree.transformToArray(allNodes);
            for (var index in allNodesArray) {
                if (allNodesArray[index].id == filterId) {
                    continue;
                }
                res.push(allNodesArray[index].id);
            }
            return res;
        };

        this.transferRoleType = function (roleType,keyID) {
            if (!roleType) {
                return "";
            }
            if (roleType === "SYSTEM_ROLE") {
                return keyID.role_term_sysMgrRole_value;
            }  {
                return keyID.role_term_serviceMgrRole_value;
            }
        };
    };
    return service;

})
