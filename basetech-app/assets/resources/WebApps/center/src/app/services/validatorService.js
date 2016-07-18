/**
 * 提供表单校验的服务
 */
define(["tiny-lib/angular"], function (angular) {
    "use strict";
    //Register a service constructor, which will be invoked with new to create the service instance
    function Validator() {
        this.nameRe = "/^[a-zA-Z0-9_]{1,128}$/";
        this.ChineseRe = "/^[\\u4e00-\\u9fa5a-zA-Z0-9-_]*$/";
        this.macRe = "^[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}$";
        this.appNameReg = "/^[\u4e00-\u9fa5a-zA-Z0-9-_ \\(\\)\\[\\]\\#\\.]{1,256}$/";
        this.appNameForOpenstack = "/^[\u4e00-\u9fa5a-zA-Z0-9-_ \\(\\)\\[\\]\\#\\.]{1,255}$/";
        this.vmNameReg = "/^[ ]*[A-Za-z0-9-_ \u4e00-\u9fa5]{1,64}[ ]*$/";
        this.vmNameCreateReg = "/^[ ]*[A-Za-z0-9-_ \u4e00-\u9fa5]{1,56}[ ]*$/";
        this.vmNameCharReg = "/^[ ]*[A-Za-z0-9-_ \u4e00-\u9fa5]*[ ]*$/";
        this.serviceName = "/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,64}$/";
        this.vmNameOrEmptyReg = "/^[ ]*[A-Za-z0-9-_ \u4e00-\u9fa5]{0,64}[ ]*$/";
        this.computerNameReg = "/^[ ]*[A-Za-z0-9-_]{1,13}[ ]*$/";
        this.computerNameCharReg = "/^[A-Za-z0-9-]*$/";
        this.diskNameReg = "/^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,64}[ ]*$/";
        this.notAllSpaceReg = "/^.*[^ ].*$/";
        this.snapshotName = "/^[\u4e00-\u9fa5a-zA-Z\\-_0-9][\u4e00-\u9fa5a-zA-Z\\-_0-9 ]{0,63}$/";
        this.notAllNumReg = "/^[0-9]*$/";
        this.descriptionReg = "/^[ ]*[\\S\\s]{0,1024}[ ]*$/";
        this.diskSnapshotDescReg = "/^[ ]*[\\S\\s]{0,64}[ ]*$/";
        this.vmTagReg = "/^[ ]*[\u4e00-\u9fa5A-Za-z0-9-_ \\(\\)\\[\\]\\#\\.\\+\\*=,]{0,256}[ ]*$/";

        this.orgNameRe = "/^[\\u4e00-\\u9fa5a-zA-Z_0-9]{1,20}$/";
        this.vdcNameReg = "/^[\\u4e00-\\u9fa5a-zA-Z_0-9]{1,64}$/";
        this.appName4Ict = "/^[a-zA-Z]+[a-zA-Z0-9_.-]*$/";
        this.roleNameRe = "/^[a-zA-Z0-9_]{1,20}$/";
        this.userNameRe = "/^[a-zA-Z0-9_]{1,20}$/";
        this.maxLength = "/^[A-Za-z0-9-_ \u4e00-\u9fa5]{0,1024}$/";

        this.noConstraintMaxLength = "/^.{0,1024}$/";

        this.cloudInfraNameRe = "/^[\\u4e00-\\u9fa5a-zA-Z_0-9]{1,128}$/";
        this.cloudRegionNameRe = "/^[\\u4e00-\\u9fa5a-zA-Z_0-9]{1,128}$/";
        this.templatesName = "/^[0-9a-zA-Z \\_\\-]{0,64}$/";
        this.tempName = "/^[\u4e00-\u9fa5A-Za-z0-9-_ ]*$/";

        //校验字段支持的字符范围的正则表达式（数字、字母、下划线、中文）
        this.vpcName="/^[\\u4e00-\\u9fa5a-zA-Z_0-9]{1,16}$/";
        this.name = "/^[\\u4e00-\\u9fa5a-zA-Z_0-9]{1,64}$/";
        this.deviceName = "/^[\\u4e00-\\u9fa5a-zA-Z_0-9]{0,256}$/";
        this.deviceName4Host = "/^[\\u4e00-\\u9fa5a-zA-Z_0-9\\-]{0,256}$/";
        //域名校验正则表达式
        this.domainName = "(^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[-a-zA-Z0-9]{1,63})*(\.[-a-zA-Z0-9]{0,62}[a-zA-Z0-9])$)|(^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$)|(^[a-zA-Z0-9]$)";
        //上行端口校验正则表达式
        this.upLinkPort = "((^([0-9])+/([0-9])+/([0-9])+(,(([0-9])+/([0-9])+/([0-9])+))*$)|(^$))";
        //ipv6正则表达式
        this.ipv6Reg = "^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$";

        //CIFS 共享目录正则表达式
        this.cifsDirReg = /^((\\\\(([1-9]|[1-9]\d|(10|11)\d|12[0-6]|12[8-9]|1[3-9]\d|2[0-1]\d|22[0-3])(\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3})){1})((((\\){1})([a-zA-Z0-9-_ .]{1,})){1,})$/
        this.nfsDirReg = /^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}:\/[\S.]+$/
    }

    var subRegRex = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;
    /**
     * 用于替换国际化配置文件中的花括号
     */
    Validator.prototype.i18nReplace = function (s, o) {
        return ((s.replace) ? s.replace(subRegRex, function (match, key) {
            return (!angular.isUndefined(o[key])) ? o[key] : match;
        }) : s);
    };
    //掩码是否合法
    Validator.prototype.maskValidator = function (ip) {
        try {
            var data = ip.split(".");
            if (data[0] == "" || data[1] == "" || data[2] == "" || data[3] == "") {
                return false;
            }

            data[0] = parseInt(data[0]);
            data[1] = parseInt(data[1]);
            data[2] = parseInt(data[2]);
            data[3] = parseInt(data[3]);
            if (data[0] == 0 && data[1] == 0 && data[2] == 0 && data[3] == 0) {
                return false;
            }
            if (data[3] > 248) {
                return false;
            }
            var ip_binary = (data[0] + 256).toString(2).substring(1)
                + (data[1] + 256).toString(2).substring(1)
                + (data[2] + 256).toString(2).substring(1)
                + (data[3] + 256).toString(2).substring(1);

            if (-1 != ip_binary.indexOf("01")) {
                return false;
            }
            else {
                return true;
            }
        } catch (e) {
            return false;
        }
    };
    //掩码与子网IP的与是否等于子网IP
    Validator.prototype.maskAndSubnetValidator = function (mask, ip) {
        try {
            var maskData = mask.split(".");
            var ipData = ip.split(".");
            if ((parseInt(ipData[0]) & parseInt(maskData[0])) == parseInt(ipData[0])
                && (parseInt(ipData[1]) & parseInt(maskData[1])) == parseInt(ipData[1])
                && (parseInt(ipData[2]) & parseInt(maskData[2])) == parseInt(ipData[2])
                && (parseInt(ipData[3]) & parseInt(maskData[3])) == parseInt(ipData[3])) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    };
    //IP是否在子网内
    Validator.prototype.subnetValidator = function (ip, mask, subnet) {
        try {
            if (ip == subnet) {
                return false;
            }
            var ipData = ip.split(".");
            var maskData = mask.split(".");
            var subnetData = subnet.split(".");
            if ((parseInt(ipData[0]) & parseInt(maskData[0])) == parseInt(subnetData[0])
                && (parseInt(ipData[1]) & parseInt(maskData[1])) == parseInt(subnetData[1])
                && (parseInt(ipData[2]) & parseInt(maskData[2])) == parseInt(subnetData[2])
                && (parseInt(ipData[3]) & parseInt(maskData[3])) == parseInt(subnetData[3])) {
                return true;
            }
            else {
                return false;
            }
        } catch (e) {
            return false;
        }
    };
    //ipv6是否合法
    Validator.prototype.ipv6Check = function (ip) {
        if (!ip) {
            return false;
        }
        if (ip.indexOf(".") >= 0) {
            return false;
        }
        var ipv6Reg = new RegExp(this.ipv6Reg);
        return ipv6Reg.test(ip);
    };
    //ip是否合法
    Validator.prototype.ipValidator = function (ip) {
        try {
            var data = ip.split(".");
            if (data.length == 4) {
                for (var i = 0; i < 4; i++) {
                    if (data[i] === "" || data[i] !== "" + parseInt(data[i])) {
                        return false;
                    }
                }
                var ip1 = parseInt(data[0]);
                if (ip1 === 127) {
                    return false;
                } else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    };
    //ip格式是否正确
    Validator.prototype.ipFormatCheck = function (ip) {
        try {
            var data = ip.split(".");
            if (data.length == 4) {
                for (var i = 0; i < 4; i++) {
                    if (data[i] === "" || data[i] !== "" + parseInt(data[i])) {
                        return false;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    };
    //ip是否不以127开头
    Validator.prototype.ipNotStartWith127 = function (ip) {
        try {
            var data = ip.split(".");
            if (data.length == 4) {
                var ip1 = parseInt(data[0]);
                if (ip1 === 127) {
                    return false;
                }
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    };
    //ip范围检查
    Validator.prototype.ipRangeCheck = function (startIp, endIp, inputIp) {
        if (!startIp || !endIp || !inputIp) {
            return false;
        }
        var startIps = startIp.split(".");
        var endIps = endIp.split(".");
        var inputIps = inputIp.split(".");

        if (startIps.length != 4 || endIps.length != 4 || inputIps.length != 4) {
            return false;
        }
        var i = 0;
        var startIpValue = 0;
        var endIpValue = 0;
        var inputIpValue = 0;
        for (i = 0; i < 4; i = i + 1) {
            startIpValue = startIpValue * 256 + parseInt(startIps[i], 10);
            endIpValue = endIpValue * 256 + parseInt(endIps[i], 10);
            inputIpValue = inputIpValue * 256 + parseInt(inputIps[i], 10);
        }
        return inputIpValue >= startIpValue && inputIpValue <= endIpValue;
    };
    //获取IP值
    Validator.prototype.getIpValue = function (inputIp) {
        if (!inputIp) {
            return 0;
        }
        var inputIps = inputIp.split(".");
        if (inputIps.length != 4) {
            return false;
        }
        var inputIpValue = 0;
        for (var i = 0; i < 4; i++) {
            inputIpValue = inputIpValue * 256 + parseInt(inputIps[i], 10);
        }
        return inputIpValue;
    };
    //ip比较
    Validator.prototype.ipCompare = function (startIp, endIp) {
        if (!startIp || !endIp) {
            return false;
        }
        var startIps = startIp.split(".");
        var endIps = endIp.split(".");
        if (startIps.length != 4 || endIps.length != 4) {
            return false;
        }
        var i = 0;
        var startIpValue = 0;
        var endIpValue = 0;
        for (i = 0; i < 4; i = i + 1) {
            startIpValue = startIpValue * 256 + parseInt(startIps[i], 10);
            endIpValue = endIpValue * 256 + parseInt(endIps[i], 10);
        }
        return startIpValue <= endIpValue;
    };

    //IPv6是否合法
    Validator.prototype.ipv6Validator = function (ip) {
        if (!ip) {
            return false;
        }
        var data = ip.split(":");
        return data.length == 8;
    };

    //校验密码必须包含大小写字符数字中的至少两种
    Validator.prototype.checkMustContain = function (pwd) {
        try {
            var reg1 = /.*[A-Z]+.*/;
            var reg2 = /.*[a-z]+.*/;
            var reg3 = /.*[0-9]+.*/;
            if (!reg1.test(pwd) && !reg2.test(pwd)) {
                return false;
            }
            if (!reg1.test(pwd) && !reg3.test(pwd)) {
                return false;
            }
            if (!reg2.test(pwd) && !reg3.test(pwd)) {
                return false;
            }
        }
        catch (e) {
            return false;
        }
        return true;
    };

    //校验密码长度是否满足字符个数要求
    Validator.prototype.checkPasswordLength = function (pwd, minLength, maxLength) {
        try {
            if (pwd.length < minLength || pwd.length > maxLength) {
                return false;
            }
        }
        catch (e) {
            return false;
        }
        return true;
    };

    //校验密码是否包含特殊字符
    Validator.prototype.checkContainSpecialCharacter = function (pwd) {
        return /[\ \`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\\\|\[\{\}\]\;\:\'\"\,\<\.\>\/\?]+/.test(pwd);
    };

    //校验密码是否包含正序或逆序用户名
    Validator.prototype.checkContainUserName = function (pwd, userName) {
        try {
            if (!userName) {
                return false;
            }
            var revertUserName = userName.split("").reverse().join("");
            if (pwd.indexOf(userName) >= 0 || pwd.indexOf(revertUserName) >= 0) {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    };


    return Validator;
});