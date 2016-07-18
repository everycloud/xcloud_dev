define(function () {
    /**
     * 用于处理名称，按照序号逐个生成名称序列 命名规则：XXXXXX_number
     * undo/redo的时候，也要使用，所以把它修改为公共方法
     */
    var GenenalNameUtil = {
        // 保存当前序号
        "num": 0,
        // 反解析的时候，更新存在名称的最大序号
        "updateMaxSerial": function () {
            this.num++;
        },

        // 编辑模板时，对拖入画布的资源生成一个名称
        "genSerialName": function (name) {
            this.num++;
            // 判断名字是否会超长，如果超长，自动截到最大长度64
            if ((name + "_" + this.num).length > 64) {
                name = name.substr(0, 64 - (this.num + "_").length);
            }
            return name + "_" + this.num;
        },
        "displayResourceName": function (name, type) {
            if (type === "VmTemplate") {
                if (name && name.length > 10) {
                    name = this.convertNameLength(name, 60);
                }
            } else {
                if (name && name.length > 8) {
                    name = this.convertNameLength(name, 48);
                }
            }
            return name.replace(/\s/g, "&nbsp;");
        },
        //对资源名称过长进行转换
        "convertNameLength": function (name, limit) {
            // 名称最大长度 一个中文等于6，一个小写字符等于3，一个大写字符等于4，一个空格等于2，其它默认等于3
            if (!name) {
                return "";
            }
            var length = 0;
            var displayName = "";
            var tempName = "";
            var lengthName = limit - 9;
            for (i = 0; i < name.length; i++) {
                if (length >= limit) {
                    displayName = tempName + "...";
                    break;
                }
                if (length > lengthName && tempName === "") {
                    tempName = displayName;
                }
                // 中文
                if (/^[\u4E00-\u9FA5]$/.test(name.substring(i, i + 1))) {
                    displayName += name.substring(i, i + 1);
                    length += 6;
                    continue;
                    // 空格
                } else if (name.substring(i, i + 1) == " ") {
                    displayName += "&nbsp;";
                    length += 2;
                    // 小写字母
                } else if (/^[a-z]$/.test(name.substring(i, i + 1))) {
                    displayName += name.substring(i, i + 1);
                    length += 3;
                    // 大写字符
                } else if (/^[A-Z]$/.test(name[i])) {
                    displayName += name.substring(i, i + 1);
                    length += 4;
                    // 其它字符
                } else {
                    displayName += name.substring(i, i + 1);
                    length += 3;
                }
            }
            return displayName;
        }
    };
    return GenenalNameUtil;
});