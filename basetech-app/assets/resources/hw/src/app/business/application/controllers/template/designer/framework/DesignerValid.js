define([
    "sprintf",
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "language/keyID",
    "tiny-common/UnifyValid"
], function (sprintf, $, angular, keyIDI18n, UnifyValid) {
    "use strict";
    keyIDI18n.sprintf = sprintf.sprintf;
    var i18n = keyIDI18n;
    UnifyValid.validateInfo = {
        "name": i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64"),
        "templateName": i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256"),
        "description": i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
        "required": i18n.common_term_null_valid,
        "minimumSize": i18n.template_app_add_para_minflex_valid,
        "desiredCapacity": i18n.template_app_add_para_minflex_valid,
        "maximumSize": i18n.template_app_add_para_maxflex_valid,
        "collectionTimes": i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "30"),
        "coolTime": i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "30"),
        "step": i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "10"),
        "configP": i18n.sprintf(i18n.common_term_range_valid, "1", "100"),
        "configK": i18n.sprintf(i18n.common_term_range_valid, "1", "1000000"),
        "getName": function () {
            return "name:" + this.name;
        },
        "getRequiredName": function () {
            return "required:" + this.required + ";name:" + this.name + ":"; //分号分隔
        },
        "getTemplateName": function () {
            return "name:" + this.templateName;
        },
        "getRequiredTemplateName": function () {
            return "required:" + this.required + ";templateName:" + this.templateName + ":"; //分号分隔
        },
        "getDescription": function () {
            return "description:" + this.description + ":";
        },
        "getMinimumSize": function () {
            return "required:" + this.required + ";minimumSize:" + this.minimumSize + ":"; //分号分隔
        },
        "getDesiredCapacity": function () {
            return "required:" + this.required + ";desiredCapacity:" + this.desiredCapacity + ":"; //分号分隔
        },
        "getMaximumSize": function () {
            return "required:" + this.required + ";maximumSize:" + this.maximumSize + ":"; //分号分隔
        },
        "getCollectionTimes": function () {
            return "required:" + this.required + ";collectionTimes:" + this.collectionTimes + ":"; //分号分隔
        },
        "getCoolTime": function () {
            return "required:" + this.required + ";coolTime:" + this.coolTime + ":"; //分号分隔
        },
        "getStep": function () {
            return "required:" + this.required + ";step:" + this.step + ":"; //分号分隔
        },
        "getConfigP": function () {
            return "required:" + this.required + ";configP:" + this.configP + ":"; //分号分隔
        },
        "getConfigK": function () {
            return "required:" + this.required + ";configK:" + this.configK + ":"; //分号分隔
        }
    };

    UnifyValid.name = function () {
        var element = this;
        var value = element.val();
        if ((!/^[\u4e00-\u9fa5A-Za-z0-9-_ ]*$/.test(value)) || value.length < 1 || value.length > 64) {
            return false;
        }
        return true;
    };

    UnifyValid.templateName = function () {
        var element = this;
        var value = element.val();
        if ((!/^[\u4e00-\u9fa5A-Za-z0-9-_ ]*$/.test(value)) || value.length < 1 || value.length > 256) {
            return false;
        }
        return true;
    };

    UnifyValid.description = function () {
        var element = this;
        var value = element.val();
        if (!/^[\s\S]{0,1024}$/.test(value)) {
            return false;
        }
        return true;
    };

    UnifyValid.step = function () {
        var element = this;
        var value = element.val();
        var intValue = parseInt(value);
        if ((!/^([0-9]\d*)$/.test(value)) || intValue < 1 || intValue > 10) {
            return false;
        }
        return true;
    };

    UnifyValid.minimumSize = function () {
        var element = this;
        var value = element.val();
        if (!/^[1-9]\d*$/.test(value)) {
            return false;
        }
        var minimumSizeValue = parseInt(value);
        if (minimumSizeValue > 200) {
            return false;
        }
        var maximumSize = $("#scalinggroup-max").widget().getValue();
        var maximumSizeValue = parseInt(maximumSize);
        if (minimumSizeValue <= maximumSizeValue) {
            return true;
        }
        return false;
    };

    UnifyValid.maximumSize = function () {
        var element = this;
        var value = element.val();
        if (!/^[1-9]\d*$/.test(value)) {
            return false;
        }
        var maximumSizeValue = parseInt(value);
        if (maximumSizeValue > 200) {
            return false;
        }
        var minimumSize = $("#scalinggroup-min").widget().getValue();
        var minimumSizeValue = parseInt(minimumSize);
        var desireValue = $("#scalinggroup-desiredCapacity").widget().getValue();
        if (minimumSizeValue <= maximumSizeValue && maximumSizeValue >= desireValue) {
            return true;
        }
        return false;
    };
    UnifyValid.desiredCapacity = function () {
        var element = this;
        var value = element.val();
        if (!/^[1-9]\d*$/.test(value)) {
            return false;
        }
        var desireValue = parseInt(value);
        var maxValue = $("#scalinggroup-max").widget().getValue();
        if (desireValue > maxValue) {
            return false;
        }
        return true;
    };

    UnifyValid.coolTime = function () {
        var element = this;
        var value = element.val();
        var intValue = parseInt(value);
        if ((!/^([0-9]\d*)$/.test(value)) || intValue < 0 || intValue > 30) {
            return false;
        }
        return true;
    };

    UnifyValid.collectionTimes = function () {
        var element = this;
        var value = element.val();
        var intValue = parseInt(value);
        if ((!/^([0-9]\d*)$/.test(value)) || intValue < 1 || intValue > 30) {
            return false;
        }
        return true;
    };

    UnifyValid.configP = function () {
        var element = this;
        var value = element.val();
        var intValue = parseInt(value);
        if ((!/^([0-9]\d*)$/.test(value)) || intValue < 1 || intValue > 100) {
            return false;
        }
        return true;
    };

    UnifyValid.configK = function () {
        var element = this;
        var value = element.val();
        var intValue = parseInt(value);
        if ((!/^([0-9]\d*)$/.test(value)) || intValue < 1 || intValue > 1000000) {
            return false;
        }
        return true;
    };
    return UnifyValid;
});