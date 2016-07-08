define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询域
        this.queryDomain = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/domains",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id
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

        //创建域
        this.createDomain = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/domains",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": JSON.stringify({
                    "domainName": options.domainName,
                    "domainDesc": options.domainDesc
                }),
                "userId": options.user.id
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

        //删除域
        this.deleteDomain = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/domains/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.domainId
                    }
                },
                "userId": options.user.id
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

        //域详情
        this.detailDomain = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/domains/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.domainId
                    }
                },
                "userId": options.user.id
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

        //修改域
        this.modifyDomain = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/domains/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.domainId
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id
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

        //查询域下的用户列表
        this.queryDomainUser = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                "url": {
                    s: options.url,
                    o: {
                        "id": options.domainId
                    }
                },
                "params": {},
                "userId": options.user.id
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

        //删除域下用户
        this.deleteDomainUser = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/domains/{id}/users/{user_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "id": options.domainId,
                        "user_id": options.userId
                    }
                },
                "userId": options.user.id
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

        //获取用户权限
        this.getUserPrivilege = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/privileges?user-id={user_id}&domain-privilege=true",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "user_id": options.userId
                    }
                },
                "params": {},
                "userId": options.user.id
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

        //修改域下的用户权限
        this.modifyUserPrivilege = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/domains/{id}/users/{user_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.domainId,
                        "user_id": options.userId
                    }
                },
                "params": JSON.stringify({
                    "privilegeList": options.privilegeList
                }),
                "userId": options.user.id
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

        //查询可添加域用户
        this.queryCanAddDomianUser = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/fancy/v1.5/{vdc_id}/domains/{id}/users",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
                    }
                },
                "params":options.params,
                "userId": options.user.id
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

        //初始化可选择的用户
        this.initCanSelectMember = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/users/list",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": JSON.stringify(options.listUser),
                "userId": options.user.id
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

        //过滤用户
        this.filterDomainUser = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/domains/{id}/users",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.domainId
                    }
                },
                "params": {
                    "start": 0,
                    "limit": 1000
                },
                "userId": options.user.id
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

        //设置用户权限
        this.setUserPrivilege = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/privileges?user-id={user_id}&domain-privilege=true",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "user_id": options.id
                    }
                },
                "params": {},
                "userId": options.user.id
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

        //添加用户到域
        this.addMember = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/domains/{id}/users",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.domainId
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id
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
        // 查询域下的虚拟机
        this.queryVmList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id":options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id
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

        //操作虚拟机（添加 移除）
        this.operateVM = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {///goku/rest/v1.5/{vdc_id}/vms?cloud-infra={cloud-infra}
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id":options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "domain": options.domain
                }),
                "userId": options.user.id
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
        //查询用户列表
        this.queryUserlist = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/users/list",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": JSON.stringify({
                    "start": options.start,
                    "limit": options.limit,
                    "userName": options.userName,
                    "userType": options.userType,
                    "onLineStatus": options.onLineStatus
                }),
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
        //查询用户详情
        this.queryUserDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/users/{userId}",
                    o: {
                        "vdc_id": options.vdcId,
                        "userId": options.id
                    }
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
        //创建用户
        this.createUser = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/users",
                    "o": {
                        "vdc_id": options.vdcId
                    }
                },
                "params": JSON.stringify(options.params),
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
        //修改用户
        this.modifyUser = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/users/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id
                    }
                },
                "params": JSON.stringify(options.params),
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
        //删除用户
        this.deleteUser = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/users/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id
                    }
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
        //修改用户锁定状态
        this.sendLockStatus = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/users/{id}/lock-status",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id
                    }
                },
                "params": JSON.stringify({
                    "locked": options.locked
                }),
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
        //查询角色列表
        this.queryRoleList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/roles?type={type}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "type": options.type
                    }
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
        //重置用户密码
        this.resetPwd = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/users/{id}/password?action={value}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "value": options.value
                    }
                },
                "params": JSON.stringify(options.params),
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
        //角色查询
        this.queryRoles = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": options.url,
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
        //角色创建
        this.createRole = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/roles",
                    "o": {
                        "vdc_id": options.vdcId
                    }
                },
                "params": JSON.stringify({
                    "name": options.name,
                    "privilegeList": options.privilegeList,
                    "type": options.type,
                    "description": options.description
                }),
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
        //角色修改
        this.modifyRole = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/roles/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id
                    }
                },
                "params": JSON.stringify({
                    "privilegeList": options.privilegeList,
                    "description": options.description
                }),
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
        //查询权限集合
        this.queryPrivilege = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/roles/{roletype}/privileges",
                    "o": {
                        "vdc_id": options.vdcId,
                        "roletype": options.roletype
                    }
                },
                "params": {},
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
        //角色删除
        this.deleteRole = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/roles/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id
                    }
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
        //查询角色详情
        this.queryRoleDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/roles/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id
                    }
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
