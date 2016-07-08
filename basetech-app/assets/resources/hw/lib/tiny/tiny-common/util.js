define(["tiny-lib/jquery", "tiny-lib/underscore", "tiny-lib/angular", "tiny-lib/Class"], function($, _, angluar, Class) {

    function isTrue(value) {
        return (value === true || value === "true");
    }

    function isFalse(value) {
        return (value === false || value === "false");
    }

    function getBoolean(value, def) {
        return (isTrue(value) || isFalse(value)) ? isTrue(value) : def;
    }

    function isEmptyString(str) {
        return (str !== undefined && ('' + str).replace(/ /g, "").length === 0);
    }

    return {
        "isTrue" : isTrue,
        "isFalse" : isFalse,
        "getBoolean" : getBoolean,
        "isEmptyString" : isEmptyString
    }
});
