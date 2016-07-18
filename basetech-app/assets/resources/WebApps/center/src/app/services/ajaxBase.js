define([
    "tiny-lib/jquery",
    "app/services/httpService",
    "app/services/messageService",
    "app/services/exceptionService",
    "tiny-widgets/Message",
    "can/util/fixture/fixture"], function ($, httpSrv, MessageService, Exc, Message, fixture) {
    "use strict";

    var http = new httpSrv();
    var Exception = {};

    function extend(obj) {
        var k = null;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                Exception[k] = obj[k];
            }
        }
    }

    require(["language/ame-rpool-exception"], function (Exc) {
        extend(Exc);
    });
    require(["language/iam-exception"], function (Exc) {
        extend(Exc);
    });
    require(["language/irm-rpool-exception"], function (Exc) {
        extend(Exc);
    });
    require(["language/sr-rpool-exception"], function (Exc) {
        extend(Exc);
    });
    require(["language/ssp-exception"], function (Exc) {
        extend(Exc);
    });
    require(["language/ssp-rpool-exception"], function (Exc) {
        extend(Exc);
    });
    require(["language/system-exception"], function (Exc) {
        extend(Exc);
    });

    function user() {
        return $("html").scope().user;
    }
    
    function i18n() {
        return $("html").scope().i18n || {};
    }

    var innerPara = {};

    function finish(ret, onOK, onErr, err) {
        ret.success(function (data) {
            if (typeof onOK === "function") {
                onOK(data);
            }
        });

        ret.fail(function (xhr) {
            try {
                var alertBox = false;
                if (alertBox) {
                    var rsp = {};
                    try {
                        rsp = JSON.parse(xhr.responseText);
                    } catch (e) {
                    }
                    var code = rsp.code;
                    var desc = rsp.message || "内部错误";
                    if (code) {
                        var tmp = Exception[code];
                        if (tmp) {
                            desc = tmp.desc;
                        }
                    }
                    else {
                        code = "100004";
                    }

                    if (!err ? true : err) {
                        new MessageService().errorMsgBox(code, desc);
                    }
                } else {
                    if (!err ? true : err) {
                        new Exc().doException(xhr);
                    }
                }
                if ('function' === typeof onErr) {
                    onErr(xhr);
                }

            } catch (e) {
            }
        });
    }

    function send(type, url, urlPara, para, mask) {
        var func = http[type];
        if (!func) {
            return;
        }
        var o = {
            "url": {
                s: url,
                o: urlPara
            },
            "userId": user().id
        };

        var t = typeof mask;
        var k = null;
        if ('object' === t) {
            for (k in mask) {
                if (mask.hasOwnProperty(k)) {
                    o[k] = mask[k];
                }
            }
        } else {
            o.monitor = null === mask ? true : mask;
        }

        if ("get" === type) {
            o.params = para;
        } else {
            if (para) {
                o.params = JSON.stringify(para);
            }
        }

        return func(o);
    }

    function confirm(title, desp, func) {
        var msg = new Message({
            "type": "confirm",
            "modal": true,
            "title": title,
            "content": desp,
            "height": "150px",
            "width": "350px",
            "buttons": [
                {
                    "label": i18n().common_term_yes_button||'确定',
                    "accessKey": '2',
                    "key": "okBtn",
                    majorBtn : true,
                    "default": false,
                    handler: function () {
                        func();
                        msg.destroy();
                    }
                },
                {
                    "label": i18n().common_term_no_label||'取消',
                    "accessKey": '3',
                    "key": "cancelBtn",
                    "default": true,
                    "handler": function () {
                        msg.destroy();
                    }
                }
            ]
        });

        msg.show();
    }

    var service = {
        "getVal": function (key) {
            return key ? innerPara[key] : innerPara;
        },

        "setVal": function (key, val) {
            if (!key) {
                return;
            }
            innerPara[key] = val;
        },

        "user": user,
        "ict": function () {
            return ("OPENSTACK" === user().cloudType) || ("ICT" === user().cloudType);
        },
        "send": send,
        "finish": finish,
        "confirm": confirm,
        "fixture": fixture
    };

    return service;
});