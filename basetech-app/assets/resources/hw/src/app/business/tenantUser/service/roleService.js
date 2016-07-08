/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-3-6
 */
define(["tiny-lib/underscore","language/keyID"], function (_, i18n) {
    "use strict";
    var service = function () {
        this.initTree = function (roleList, privilegeKeys) {
            var treeData = [{
                "id": "0",
                "pId": null,
                "name": i18n.user_term_authorizationList_label,
                "open": true,
                "relatedPrivilegeIds":[]
            }];
            if (roleList === undefined || roleList === null) {
                return treeData;
            }
            _.each(roleList, function (item) {
                var key = item.name;
                var name = privilegeKeys[key];
                var node = {
                    "id": item.id,
                    "pId": item.parentId,
                    "name": name || key,
                    "relatedPrivilegeIds": item.relatedPrivilegeIds
                };
                treeData.push(node);
            });
            return treeData;
        };

        // 从leftNodes中移除existTree
        this.moveExistPrivileges = function (nodesList, existTree) {
            var leftNodes = nodesList;
            // 获取已存在的节点
            var treeNodes = existTree.getNodes();
            if (undefined === treeNodes) {
                return;
            }
            var selectedNodes = existTree.transformToArray(treeNodes);
            if (selectedNodes === []) {
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
                    if (leftNodes[i].id === selectedNode.id) {
                        nodeIndex = i;
                        break;
                    }
                }
                if (nodeIndex < 0) {
                    continue;
                }

                // 判断这个节点是否有子节点
                var hasChild = false;
                for (var j = leftNodes.length - 1; j >= 0; j--) {
                    if (leftNodes[j].parentId === selectedNode.id) {
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
            if (selectedNodes === []) {
                return;
            }

            var destNodes = destinationTree.getNodes();
            var defaultParentNode;
            if (destNodes === null || destNodes === []) {
                defaultParentNode = null;
            } else {
                defaultParentNode = destNodes[0];
            }

            // 添加权限节点
            for (var index in selectedNodes) {
                var node = {
                    id: selectedNodes[index].id,
                    pId: selectedNodes[index].pId,
                    name: selectedNodes[index].name,
                    "relatedPrivilegeIds": selectedNodes[index].relatedPrivilegeIds
                };
                // 权限列表不进行移动
                if (node.id === "0") {
                    continue;
                }
                // 在目的树上找该节点，如果找不到则添加上去
                if (destinationTree.getNodeByParam("id", node.id, null) === null) {
                    //从源树获取父节点id
                    var sourceParentNode = sourceTree.getNodeByParam("id", node.pId, null);
                    if (sourceParentNode === null || sourceParentNode === []) {
                        destinationTree.addNodes(defaultParentNode, node);
                        continue;
                    }

                    // 从目的树获取父节点
                    var destParentNode = destinationTree.getNodeByParam("id", sourceParentNode.id, null);
                    if (destParentNode === null || sourceParentNode === []) {
                        destinationTree.addNodes(defaultParentNode, node);
                    } else {
                        destinationTree.addNodes(destParentNode, node);
                    }
                }
            }

            // 删除权限节点
            var nodesNumber = selectedNodes.length;
            for (var delIndex = nodesNumber - 1; delIndex >= 0; delIndex--) {
                var selectedNode = selectedNodes[delIndex];
                if (selectedNode.id === "0") {
                    continue;
                }
                var delNode = sourceTree.getNodeByParam("id", selectedNode.id, null);
                if (delNode.isParent) {
                    continue;
                } else {
                    sourceTree.removeNode(delNode, false);
                }
            }
        };

        // 获取权限列表，不返回id为filterId的权限
        this.getPrivilegeList = function (tree, filterId) {
            if (null === tree || undefined === tree) {
                return [];
            }
            var allNodes = tree.getNodes();
            if (allNodes === []) {
                return [];
            }

            var res = [];
            var allNodesArray = tree.transformToArray(allNodes);
            _.each(allNodesArray, function (item) {
                if (item.id === filterId) {
                    return;
                }
                res.push(item.id);
            });
            return res;
        };

        this.transferRoleType = function (roleType) {
            if (roleType === undefined || roleType === "") {
                return "";
            }
            if (roleType === "SYSTEM_ROLE") {
                return i18n.role_term_sysMgrRole_value;
            } else if (roleType === "SERVICE_ROLE") {
                return i18n.role_term_serviceMgrRole_value;
            } else {
                return "";
            }
        };
    };
    return service;
});
