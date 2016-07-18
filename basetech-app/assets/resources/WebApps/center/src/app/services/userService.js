/**
 * 框架service
 */
define(["app/services/rightConfig",
    "language/keyID",
    "fixtures/frameworkFixture"], function (RIGHT_CONFIG, i18n) {
    "use strict";

    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        /**
         * 判断License是否过期
         */
        this.checkLicense = function (userId, csrfToken) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: "/goku/rest/v1.5/license/action",
                userId: userId,
                csrfToken: csrfToken,
                params: JSON.stringify({
                    "validationRequest": {}
                })
            });
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
        };

        /**
         * 查询ESN
         */
        this.queryLicenseESN = function (userId, token) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: "/goku/rest/v1.5/esn",
                userId: userId,
                csrfToken: token
            });
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
        };

        this.licenseVersion = {
            NoEditionInfo: "",
            FundationEdition: i18n.sys_term_editionFundation_label || "基础版",
            StandardEdition: i18n.sys_term_editionStandard_label || "标准版",
            AdvancedEdition: i18n.sys_term_editionAdvanced_label || "高级版",
            EliteEdition: i18n.sys_term_editionElite_label || "精英版",
            PlatinumEdition: i18n.sys_term_editionPlatinum_label || "铂金版",
            OperationEdition: i18n.sys_term_editionOperation_label || "运营版",
            DiamondEdition: i18n.sys_term_editionDiamond_label || "钻石版"
        };

        /**
         * 查询license
         */
        this.queryLicense = function (userId) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: "/goku/rest/v1.5/license",
                userId: userId
            });
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
        };

        this.updateLicense = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: "/goku/rest/v1.5/license",
                userId: options.userId,
                csrfToken: options.csrfToken,
                params: JSON.stringify(options.data)
            });
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
        };

        /**
         * option  "all" 用于管理侧，"vdc"用于租户侧
         * 查询当前用户信息
         * 使用SSO登陆后，跳转到框架页面，框架将发起该请求，http请求中的sessionId从后台session中获取{userName, userId, vdcId}信息。如果失败将由servlet重定向到SSO登陆页面。
         */
        this.queryCurrentUser = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    "s": "/goku/rest/fancy/v1.5/{vdc_id}/users",
                    "o": {
                        "vdc_id": option || "vdc"
                    }
                }
            });
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
        };

        //查询当前用户对应组织内的权限列表
        this.queryPrivilegeListByVdcId = function (userId, vdcId, csrfToken) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: "/goku/rest/v1.5/privileges",
                params: {
                    "vdcId": vdcId
                },
                userId: userId,
                csrfToken: csrfToken
            });
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
        };

        //查询用户所属组织列表
        this.queryVdcs = function (userId, monitor) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/users/{userId}/vdcs",
                    o: {
                        "userId": userId
                    }
                },
                monitor: monitor
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                deferred.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                // 登陆时获取组织列表失败，不要抛异常
                deferred.reject();
            });

            return deferred.promise;
        };

        //切换用户VDC
        this.switchVdcs = function (userId, vdcId) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                url: {
                    s: "/goku/rest/v1.5/users/{userId}/vdcs/{vdcId}",
                    o: {
                        userId: userId,
                        vdcId: vdcId
                    }
                },
                userId: userId
            });
            deferred1.success(function (data) {
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
        };

        //注销用户
        this.logout = function () {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": "/irm/rest/v1.5/logout"
            });
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
        };

        //查询部署场景
        this.queryDeployMode = this.systemInfo = function (userId, csrfToken) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": "/goku/rest/v1.5/system-info",
                userId: userId,
                csrfToken: csrfToken
            });
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
        };
        /*
         * function
         * 生成用户权限集合（object），权限label为键值，用于权限判断，增强可读性
         * @params Array<String> privilegeList
         * @return Object{string:boolean}
         * @date 2014-5-27
         * @author
         * */
        this.userRights = function (privilegeList) {
            var privilege = {};
            if (privilegeList && privilegeList.length) {
                var symbol = ";";
                var privilegeString = symbol + privilegeList.join(symbol) + symbol;
                var p = null;
                var privilegeId = null;
                for (p in RIGHT_CONFIG) {
                    if (RIGHT_CONFIG.hasOwnProperty(p)) {
                        privilegeId = RIGHT_CONFIG[p].id;
                        privilege[p] = privilegeString.indexOf(symbol + privilegeId + symbol) > -1;
                    }
                }
            }
            return privilege;
        };

        //查询FTP 机器帐户密码
        this.queryMachineAccount = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdcId}/machine-account",
                    o: {
                        "vdcId": options.vdcId
                    }
                },
                "params": {
                    "type": options.type
                },
                "userId": options.userId
            });
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
        };
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});