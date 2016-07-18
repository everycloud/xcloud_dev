/**
 * MessageBox的公共服务
 */
define(["tiny-lib/jquery", "tiny-lib/encoder", "tiny-widgets/Message", "language/keyID"], function ($, $encoder, Message, i18n) {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function () {
        this.errorMsgBox = function (code, desc, cause, solution) {
            var content = [
                (i18n.common_term_errorCode_label || "异常码") + ":" + $.encoder.encodeForHTML(code),
                (i18n.common_term_errorDescrip_label || "异常描述") + ":" + $.encoder.encodeForHTML(desc)
            ];
            var options = {
                "type": "error",
                "content": content.join("<br/>"),
                "width": "360px"
            };
            var msg = new Message(options);
            msg.show();
        };

        this.okMsgBox = function (message) {
            var options = {
                "type": "prompt",
                "content": message,
                "width": "360px",
                "height": "200px"
            };

            var msg = new Message(options);
            msg.show();
        };

        this.failMsgBox = function (message, type, callback) {
            var options = {
                "type": type || "error",
                "content": message,
                "width": "360px",
                "height": "200px",
                "buttons": [
                    {
                        "label": i18n.common_term_ok_button || "确定",
                        "focused": false,
                        "handler": function () {
                            msg.destroy();
                            if (typeof callback === "function") {
                                callback();
                            }
                        }
                    }
                ]
            };

            var msg = new Message(options);
            msg.on("close", function () {
                if (typeof callback === "function") {
                    callback();
                }
            });
            msg.show();
        };

        this.warnMsgBox = function (options) {
            var configs = {
                "type": "warn",
                "content": options.content,
                "width": "360px",
                "height": "200px",
                "buttons": [
                    {
                        "label": i18n.common_term_ok_button || "确定",
                        "focused": false,
                        "handler": function () {
                            msg.destroy();
                            if (typeof options.callback === "function") {
                                options.callback();
                            }
                        }
                    },
                    {
                        "label":  i18n.common_term_cancle_button || '取消',
                        "focused": true,
                        "handler": function () {
                            msg.destroy();
                        }
                    }
                ]
            };
            var msg = new Message(configs);
            msg.show();
        };
        this.promptErrorMsgBox = function (message, height, width) {
            var msg = new Message({
                "type": "error",
                "content": message || "",
                "height": height || "150px",
                "width": width || "350px",
                "buttons": [
                    {
                        label: i18n.common_term_ok_button || "确定",
                        accessKey: '2',
                        "key": "okBtn",
                        majorBtn : true,
                        "default": true
                    },
                    {
                        label: i18n.common_term_cancle_button || '取消',
                        accessKey: '3',
                        "key": "cancelBtn",
                        "default": false
                    }
                ]
            });
            msg.setButton("okBtn", function () {
                msg.destroy();
            });
            msg.setButton("cancelBtn", function () {
                msg.destroy();
            });
            msg.show();
        };

        this.confirmMsgBox = function (options) {
            var configs = {
                "type": "confirm",
                "content": options.content,
                "width": options.width || "330px",
                "height": options.height || "120px",
                "buttons": [
                    {
                        "label": i18n.common_term_ok_button || "确定",
                        "focused": false,
                        "handler": function () {
                            msg.destroy();
                            if (typeof options.callback === "function") {
                                options.callback();
                            }
                        }
                    },
                    {
                        "label": i18n.common_term_cancle_button || '取消',
                        "focused": true,
                        "handler": function () {
                            msg.destroy();
                            if (typeof options.cancel === "function") {
                                options.cancel();
                            }
                        }
                    }
                ]
            };
            var msg = new Message(configs);
            msg.show();
        };
    };

    return service;
});