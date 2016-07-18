/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-3-6
 */
define(["app/services/competitionConfig"],function (Competition) {
    "use strict";
    var service = function () {
        // 将接口返回的az构造成选择框和下拉框的形式
        this.constructAZ = function (az, idPrefix) {
            var resAz = {};
            resAz.id = az.id;
            resAz.checkboxId = idPrefix + "Checkbox_" + az.id;
            resAz.checked = false;
            resAz.name = az.name;
            resAz.desc = az.desc;
            return resAz;
        };
        this.constructAZList = function (azList, idPrefix) {
            var resList = [];
            for (var index in azList) {
                resList.push(this.constructAZ(azList[index], idPrefix));
            }
            return resList;
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
            for (var index in user.roleList) {
                var role = {
                    "selectId": user.roleList[index].id,
                    "label": user.roleList[index].name,
                    "checked": false
                };
                resUser.values.push(role);
            }
            resUser.defaultLabel = "请选择角色";
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
            if (!item || !itemList) {
                return false;
            }
            for (var index in itemList) {
                if (itemList[index].id === item.id) {
                    return true;
                }
            }
            return false;
        };

        this.getResourceUseInfo = function (allQuota, quotaInfo, quotaUsage) {
            if (!quotaUsage) {
                return [];
            }
            var quotaList = [];
            for (var index in quotaUsage) {
                if (Competition.isBaseOnVmware && (quotaUsage[index].quotaName === "EIP" || quotaUsage[index].quotaName === "SEG")){
                    continue;
                }
                var quotaName = quotaUsage[index].quotaName;
                var value = quotaUsage[index].value;
                var quota = {};
                quota.quotaName = quotaName;
                quota.used = value;
                if (allQuota) {
                    quota.total = "-";
                    quota.usedRatio = "-";
                    quota.free = "-";
                }
                else {
                    var limit = quotaInfo[index].limit;
                    quota.total = limit;
                    var usedRatio = (100 * value / limit).toFixed(2);
                    quota.usedRatio = usedRatio + "%";
                    quota.free = limit - value;
                }
                quotaList.push(quota);
            }
            return quotaList;
        };
    };
    return service;

});
