/**
 * defined a global ajax communication service
 */
define(['tiny-lib/jquery', "tiny-lib/angular", "app/services/mask", "app/services/tipMessageService", "language/keyID"], function ($, angular, mask, TipMessageService, i18n) {
    "use strict";
    var TIMEOUT = 15000;
    var tipMessageService = new TipMessageService();

    var subRegRex = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;
    var sub = function (s, o) {
        return ((s.replace) ? s.replace(subRegRex, function (match, key) {
            return (!angular.isUndefined(o[key])) ? o[key] : match;
        }) : s);
    };

    var checkInvalidRequest = function (data) {
        //注意：该错误码为登陆失败，需要跳转到登陆首页
        if (typeof data === "string") {
            try {
                var jsonObj = JSON.parse(data);
                if (jsonObj.code === "0003005010") {
                    top.location.href = jsonObj.message;
                }
                return true;
            }
            catch (e) {
            }
        }
        return false;
    };

    var safeCSRFConfig = function (request, csrfToken) {
        if (csrfToken) {
            request.setRequestHeader("X-HW-Cloud-Auth-Token", csrfToken);
            return;
        }
        if (!request) {
            return;
        }
        var scope = $("html").scope();
        if (!scope) {
            return;
        }
        var user = scope.user;
        if (!user) {
            return;
        }
        request.setRequestHeader("X-HW-Cloud-Auth-Token", user.tokenId || "");
    };

    var service = function () {
        this.get = function (config) {
            var getDeferred = $.ajax({
                "type": "GET",
                "timeout": config.timeout || TIMEOUT,
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "beforeSend": function (request) {
                    config.beforeSend && config.beforeSend(request);
                    if (config.monitor === undefined || config.monitor) {
                        mask.show();
                    }
                    if (!!config.userId) {
                        request.setRequestHeader("X-Auth-User-ID", config.userId);
                    }
                    if (!!config.vpcId) {
                        request.setRequestHeader("X-VPC-ID", config.vpcId);
                    }
                    if (!!config.token) {
                        request.setRequestHeader("X-Auth-Token", config.token);
                    }
                    if (!!config.autoRequest) {
                        request.setRequestHeader("Auto-Request", config.autoRequest);
                    }
                    //安全tokenId
                    safeCSRFConfig(request, config.csrfToken);
                },
                "success": function (data) {
                    //注意：该错误码为登陆失败，需要跳转到登陆首页
                    checkInvalidRequest(data);
                },
                "complete": function (XMLHttpRequest, status) {
                    if (config.monitor === undefined || config.monitor) {
                        mask.hide();
                    }
                },
                error: function (xhr, status) {
                    if (checkInvalidRequest(xhr.responseText)) {
                        return;
                    }

                    if (config.monitor === undefined || config.monitor) {
                        if (status === "timeout") {
                            tipMessageService.alert("error", i18n.common_term_requestTimesout_label || "请求超时");
                        }
                    }
                }
            });
            return getDeferred;
        };

        this.post = function (config) {
            var postDeferred = $.ajax({
                "type": "POST",
                "timeout": config.timeout || TIMEOUT,
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "beforeSend": function (request) {
                    config.beforeSend && config.beforeSend(request);
                    if (config.monitor === undefined || config.monitor) {
                        mask.show();
                    }
                    if (!!config.userId) {
                        request.setRequestHeader("X-Auth-User-ID", config.userId);
                    }
                    if (!!config.vpcId) {
                        request.setRequestHeader("X-VPC-ID", config.vpcId);
                    }
                    if (!!config.token) {
                        request.setRequestHeader("X-Auth-Token", config.token);
                    }
                    if (!!config.autoRequest) {
                        request.setRequestHeader("Auto-Request", config.autoRequest);
                    }
                    //安全tokenId
                    safeCSRFConfig(request, config.csrfToken);
                },
                "success": function (data) {
                    //注意：该错误码为登陆失败，需要跳转到登陆首页
                    checkInvalidRequest(data);
                },
                "complete": function () {
                    if (config.monitor === undefined || config.monitor) {
                        mask.hide();
                    }
                },
                error: function (xhr, status) {
                    if (checkInvalidRequest(xhr.responseText)) {
                        return;
                    }

                    if (config.monitor === undefined || config.monitor) {
                        if (status === "timeout") {
                            tipMessageService.alert("error", i18n.common_term_requestTimesout_label || "请求超时");
                        }
                    }
                }
            });
            return postDeferred;
        };

        this["delete"] = function (config) {
            var deleteDeferred = $.ajax({
                "type": "DELETE",
                "timeout": config.timeout || TIMEOUT,
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "beforeSend": function (request) {
                    config.beforeSend && config.beforeSend(request);
                    if (config.monitor === undefined || config.monitor) {
                        mask.show();
                    }
                    if (!!config.userId) {
                        request.setRequestHeader("X-Auth-User-ID", config.userId);
                    }
                    if (!!config.vpcId) {
                        request.setRequestHeader("X-VPC-ID", config.vpcId);
                    }
                    if (!!config.token) {
                        request.setRequestHeader("X-Auth-Token", config.token);
                    }
                    //安全tokenId
                    safeCSRFConfig(request, config.csrfToken);
                },
                "success": function (data) {
                    //注意：该错误码为登陆失败，需要跳转到登陆首页
                    checkInvalidRequest(data);
                },
                "complete": function () {
                    if (config.monitor === undefined || config.monitor) {
                        mask.hide();
                    }
                },
                error: function (xhr, status) {
                    if (checkInvalidRequest(xhr.responseText)) {
                        return;
                    }

                    if (config.monitor === undefined || config.monitor) {
                        if (status === "timeout") {
                            tipMessageService.alert("error", i18n.common_term_requestTimesout_label || "请求超时");
                        }
                    }
                }
            });
            return deleteDeferred;
        };
        this.put = function (config) {
            var putDeferred = $.ajax({
                "type": "PUT",
                "timeout": config.timeout || TIMEOUT,
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "beforeSend": function (request) {
                    config.beforeSend && config.beforeSend(request);
                    if (config.monitor === undefined || config.monitor) {
                        mask.show();
                    }
                    if (!!config.userId) {
                        request.setRequestHeader("X-Auth-User-ID", config.userId);
                    }
                    if (!!config.vpcId) {
                        request.setRequestHeader("X-VPC-ID", config.vpcId);
                    }
                    if (!!config.token) {
                        request.setRequestHeader("X-Auth-Token", config.token);
                    }
                    //安全tokenId
                    safeCSRFConfig(request, config.csrfToken);
                },
                "success": function (data) {
                    //注意：该错误码为登陆失败，需要跳转到登陆首页
                    checkInvalidRequest(data);
                },
                "complete": function () {
                    if (config.monitor === undefined || config.monitor) {
                        mask.hide();
                    }
                },
                error: function (xhr, status) {
                    if (checkInvalidRequest(xhr.responseText)) {
                        return;
                    }

                    if (config.monitor === undefined || config.monitor) {
                        if (status === "timeout") {
                            tipMessageService.alert("error", i18n.common_term_requestTimesout_label || "请求超时");
                        }
                    }
                }
            });
            return putDeferred;
        };

        this.patch = function (config) {
            var patchDeferred = $.ajax({
                "type": "PATCH",
                "timeout": config.timeout || TIMEOUT,
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "traditional": true,
                "beforeSend": function (request) {
                    config.beforeSend && config.beforeSend(request);
                    if (config.monitor === undefined || config.monitor) {
                        mask.show();
                    }
                    if (!!config.userId) {
                        request.setRequestHeader("X-Auth-User-ID", config.userId);
                    }
                    if (!!config.vpcId) {
                        request.setRequestHeader("X-VPC-ID", config.vpcId);
                    }
                    if (!!config.token) {
                        request.setRequestHeader("X-Auth-Token", config.token);
                    }
                    //安全tokenId
                    safeCSRFConfig(request, config.csrfToken);
                },
                "success": function (data) {
                    //注意：该错误码为登陆失败，需要跳转到登陆首页
                    checkInvalidRequest(data);
                },
                "complete": function () {
                    if (config.monitor === undefined || config.monitor) {
                        mask.hide();
                    }
                },
                error: function (xhr, status) {
                    if (checkInvalidRequest(xhr.responseText)) {
                        return;
                    }

                    if (config.monitor === undefined || config.monitor) {
                        if (status === "timeout") {
                            tipMessageService.alert("error", i18n.common_term_requestTimesout_label || "请求超时");
                        }
                    }
                }
            });
            return patchDeferred;
        };
        this.checkInvalidRequest = checkInvalidRequest;

    };

    if ("localhost" != document.domain)
    {
        var http = new service();
        setInterval(function(){
            function user() {
                var s = $("html").scope();
                if (s){
                    return s.user
                }
                return {};
            }
            
            var ret = http.get({
                "url": "/goku/rest/heartbeat",
                "userId": user().id,
                "monitor": false,
                "autoRequest": true
            });
        }, 20000);
    }
            
    return service;
});