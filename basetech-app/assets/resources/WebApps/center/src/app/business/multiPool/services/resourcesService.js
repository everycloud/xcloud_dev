define(function () {
    var service = function () {
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