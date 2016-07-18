/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-4-15
 */
define(function () {
    var service = function () {
        this.initTree = function (domainList, selectedDomainId) {
            var ROOT_NODE_ID = "domainParentId";
            var treeData = [
                {
                    "id": ROOT_NODE_ID,
                    "pId": null,
                    "name": "domain",
                    "open": true,
                    "isParent": true,
                    "selected": ROOT_NODE_ID == selectedDomainId,
                    "hasPrivelegeOnDomain" : true
                }
            ]

            if (!domainList) {
                return treeData;
            }

            for (var index in domainList) {
                var domain = domainList[index];
                if (domain) {
                    treeData.push({
                        "id": domain.domainId,
                        "pId": ROOT_NODE_ID,
                        "name": domain.domainName,
                        "icon": "../theme/default/images/gm/domain.png",
                        "selected": domain.domainId == selectedDomainId,
                        "hasPrivelegeOnDomain" : domain.hasPrivelegeOnDomain
                    });
                }
            }
            return treeData;
        };

        // 将接口返回的用户构造成选择框和下拉框的形式
        this.constructUser = function (user, idPrefix) {
            var resUser = {};
            resUser.id = user.id;
            resUser.checkboxId = idPrefix + "Checkbox_" + user.id;
            resUser.selectId = idPrefix + "Select_" + user.id;
            resUser.name = user.name;
            resUser.checked = false;
            resUser.values = [];
            resUser.defaultLabel = "请选择权限";
            return resUser;
        };
        this.constructUserList = function (userList, idPrefix) {
            var resList = [];
            for (var index in userList) {
                resList.push(this.constructUser(userList[index], idPrefix));
            }
            return resList;
        };
        // 判断一个元素是否已经存在列表中
        this.isExist = function (item, itemList) {
            var exist = false;
            if (null == item || undefined == item || null == itemList || undefined == itemList) {
                return false;
            }
            for (var index in itemList) {
                if (itemList[index].id == item.id) {
                    return true;
                }
            }
            return false;
        };
    };
    return service;

})
