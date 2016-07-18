/**
 * 档案service
 */
define(["fixtures/systemFixture"], function () {
    "use strict";

    var Service = function (exception, $q, camel) {
        this.exception = exception;
        this.$q = $q;
        this.camel = camel;
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
            if (!exception.isException(jqXHR)) {
                deferred.resolve(null);
                return;
            }
            exception.doException(jqXHR, null);
        });

        return deferred.promise;
    }
    //查询保存备份文件的FTP服务器信息
    Service.prototype.getFTP = function (userId) {
        return this.http("get", {
            url: "/goku/rest/v1.5/system-backup/ftp",
            userId: userId
        });
    };
    //添加保存备份文件的FTP服务器信息
    Service.prototype.saveFTP = function (userId, params) {
        return this.http("post", {
            url: "/goku/rest/v1.5/system-backup/ftp",
            userId: userId,
            params: params
        });
    };
    //查询支持备份操作的部件信息
    Service.prototype.getComponents = function (userId) {
        return this.http("get", {
            url: "/goku/rest/v1.5/system-backup/components",
            userId: userId
        });
    };
    //查询部件备份状态
    Service.prototype.getComponentDetail = function (userId, id) {
        return this.http("get", {
            url: {
                s: "/goku/rest/v1.5/system-backup/components/{id}",
                o: {
                    id: id
                }
            },
            userId: userId,
            monitor: false
        });
    };
    //开始备份
    Service.prototype.backupComponents = function (userId, id) {
        return this.http("post", {
            url: {
                s: "/goku/rest/v1.5/system-backup/components/{id}",
                o: {
                    id: id
                }
            },
            userId: userId
        });
    };

    //虚拟服务器相关
    Service.prototype.vmOperator = function (options) {
        return this.http(options.method || "get", {
            url: {
                s: "/goku/rest/v1.5/system/{tenant_id}/third-party-servers{search}",
                o: {
                    tenant_id: options.orgId,
                    search: options.search || ""
                }
            },
            userId: options.userId,
            params: options.params
        });
    };

    Service.$injector = ["exception", "$q", "camel"];
    return Service;
});