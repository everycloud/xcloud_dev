/**
 * 校验规格定义
 */
define([""], function () {

    var regulars = {
        "name":"/^[a-zA-Z0-9_]{1,256}$/",
        "userName" :"/^[A-Za-z0-9]{1,64}$/",
        "pwd" :"/^.{1,64}$/"
    };

    return regulars;

});

