/**
 * @author
 * @date 0214-05-15
 * for host interface
 */
define(["app/services/exceptionService", "fixtures/systemFixture"], function (ExceptionService) {
    var Service = function ($q, camel) {
        this.$q = $q;
        this.camel = camel;
        this.exception = new ExceptionService();
    };
    Service.prototype.http = function (method, options) {
        var exception = this.exception;
        var deferred = this.$q.defer();
        deferred.notify("");
        var deferred1 = this.camel[method](options);
        deferred1.success(function (data, textStatus, jqXHR) {
            deferred.resolve(data);
        });
        deferred1.fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof options.monitor === "undefined" || options.monitor) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            } else {
                deferred.reject();
            }
        });

        return deferred.promise;
    };
    //获取vdi列表
    Service.prototype.vdiList = function (userId, params, monitor) {
        return this.http("get", {
            url: "/goku/rest/v1.5/irm/vdis",
            params: params,
            userId: userId,
            monitor: monitor
        });
    };

    //接入vdi
    Service.prototype.addVdi = function (userId, params) {
        return this.http("post", {
            url: "/goku/rest/v1.5/irm/vdis",
            userId: userId,
            params: params
        });
    };
    //修改接入参数
    Service.prototype.editVdi = function (options) {
        return this.http("put", {
            url: {
                s: "/goku/rest/v1.5/irm/vdis/{id}",
                o: {
                    id: options.id
                }
            },
            params: options.params,
            userId: options.userId
        });
    };

    //删除Vdi
    Service.prototype.delVdi = function (options) {
        return this.http("delete", {
            url: {
                s: "/goku/rest/v1.5/irm/vdis/{id}",
                o: {
                    id: options.id
                }
            },
            userId: options.userId
        });
    };

    //获取可选域
    Service.prototype.getDomains = function (options) {
        return this.http("get", {
            url: {
                s: "/goku/rest/v1.5/{tenant_id}/domains",
                o: {
                    "tenant_id": options.orgId
                }
            },
            userId: options.userId
        });
    };


    //获取可选域
    Service.prototype.getConnectStatusConfig = function () {
        return {
            "connected": "连接成功",
            "connected_failed": "连接失败",
            "connecting": "连接中"
        };
    };

    return Service;
});