/**
 * Created on 2014/4/11.
 */
/*global define*/
define(["language/keyID", "fixtures/network/network/networkListFixture"], function (i18n) {
    "use strict";
    var service = function (exception, $q, camel) {

        /**
         * READY, DELETING, PENDING, FAIL, UPDATING, UPDATEFAIL; ICT  contains DOWN
         * @param code
         * @returns {string}
         */
         this.getStatus = function(code) {
            var str = "";
            switch (code) {
                case "READY":
                    str = i18n.common_term_ready_value;
                    break;
                case "DELETING":
                    str = i18n.common_term_deleting_value;
                    break;
                case "PENDING":
                    str = i18n.common_term_processing_value;
                    break;
                case "FAIL":
                    str = i18n.common_term_fail_label;
                    break;
                case "UPDATING":
                    str = i18n.common_term_updating_value;
                    break;
                case "UPDATEFAIL":
                    str = i18n.common_term_updatFail_value;
                    break;
                case "DOWN":
                    str = "Down";
                    break;
                default:
                    str = i18n.common_term_unknown_value;
                    break;
            }
            return str;
        };

        this.getNetTypeByCode = function (code) {
            var netTypeStr = "";
            switch (code) {
                case 1:
                    netTypeStr = i18n.vpc_term_directConnectNet_label;
                    break;
                case 2:
                    netTypeStr = i18n.vpc_term_innerNet_label;
                    break;
                case 3:
                    netTypeStr = i18n.vpc_term_routerNet_label;
                    break;
                default:
                    break;
            }
            return netTypeStr;
        };

        this.getAllocateWay = function (code) {
            var allocateWay = "";
            switch (code) {
                case 0:
                    allocateWay = i18n.resource_term_externalDHCP_label;
                    break;
                case 1:
                    allocateWay = i18n.common_term_innerDHCP_label;
                    break;
                case 2:
                    allocateWay = i18n.common_term_manual_label;
                    break;
                case 3:
                    allocateWay = i18n.vpc_term_staticInjection_label;
                    break;
                case 4:
                    allocateWay = i18n.resource_exter_add_para_allocationIP_mean_noStatusAuto_label;
                    break;
                default:
                    break;
            }
            return allocateWay;
        };

        // 根据后台ipv4 ipv6 子网信息页面展现子网
        this.genUiSubnet = function (ipv4Subnet, ipv6Subnet) {
            var uisubnet = "";
            if (ipv4Subnet && ipv4Subnet.subnetAddr && ipv4Subnet.subnetPrefix) {
                uisubnet = "IPv4: " + ipv4Subnet.subnetAddr + "/" + ipv4Subnet.subnetPrefix;
            }
            if (ipv6Subnet && ipv6Subnet.subnetAddr && ipv6Subnet.subnetPrefix) {
                if (uisubnet.length > 0) {
                    uisubnet += ";";
                }
                uisubnet += "IPv6: " + ipv6Subnet.subnetAddr + "/" + ipv6Subnet.subnetPrefix;
            }
            return uisubnet;
        };

        /**
         * 0:分配中; 1:分配成功; 2:分配失败; 3:回收中; 4:回收失败; 5:重新分配中;
         * @param code
         * @returns {string}
         */
        this.getPrivateIpUIStatus = function (code) {
            var str = "";
            switch (code) {
                case "PENDING":
                    str = i18n.common_term_assigning_value;
                    break;
                case "READY":
                    str = i18n.common_term_assignSucceed_value;
                    break;
                case "FAIL":
                    str = i18n.common_term_assignFail_value;
                    break;
                case "DELETING":
                    str = i18n.common_term_reclaiming_value;
                    break;
                case "RELEASE_FAIL":
                    str = i18n.common_term_reclaimFail_value;
                    break;
                case "REALLOCATING":
                    str = i18n.common_term_reassigning_value;
                    break;
                default:
                    str = i18n.common_term_unknown_value;
                    break;
            }
            return str;
        };

        this.getExternalNetworkStatus = function (code) {
            var str = "";
            switch (code) {
                case "READY":
                    str = i18n.common_term_ready_value;
                    break;
                case "DELETING":
                    str = i18n.common_term_deleting_value;
                    break;
                case "FAIL":
                    str = i18n.common_term_fail_label;
                    break;
                case "UPDATING":
                    str = i18n.common_term_updating_value;
                    break;
                case "PENDING":
                    str = i18n.common_term_processing_value;
                    break;
                case "UPDATEFAIL":
                    str = i18n.common_term_updatFail_value;
                    break;
                default:
                    str = i18n.common_term_unknown_value;
                    break;
            }
            return str;
        };

        this.getExternalNetworkType = function (code) {
            var str = "";
            switch (code) {
                case 1:
                    str = "VLAN";
                    break;
                case 2:
                    str = i18n.resource_term_SubnetCommonVLAN_label;
                    break;
                case 3:
                    str = i18n.resource_term_SubnetSuperVLAN_label;
                    break;
            }
            return str;
        };

        this.queryVPCTopo = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/topos/vpcs/{id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.vpcId
                    }
                },
                "timeout": 60000,
                "userId": options.userId,
                "params": {
                    "cloud-infras": options.cloudInfraId
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

        // 查询对应vpc下的网络
        this.queryNetworks = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks",
                    o: {
                        "vdc_id": param.vdcId,
                        "vpcid": param.vpcId
                    }
                },
                "userId": param.userId,
                "params": {
                    "cloud-infras": param.cloudInfraId,
                    "start": param.start,
                    "limit": param.limit,
                    "status": param.status
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

        // 查询对应vpc下的外部网络
        this.queryOutNetworks = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/available-external-networks",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "userId": options.userId,
                "params": {
                    "vpcid": options.vpcId,
                    "az-id": options.azId,
                    "start": options.start,
                    "limit": options.limit,
                    "cloud-infras": options.cloudInfraId,
                    "usedbyrouter": options.usedbyrouter || false,
                    "usedbyvxlanrouter": options.usedbyvxlanrouter || false,
                    "name": options.name || null,
                    "isAssociated": options.isAssociated || false
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

        // 查询单个外部网络
        this.queryOutNetworkDetail = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/available-external-networks/{networkId}",
                    o: {
                        "vdc_id": options.vdcId,
                        "networkId": options.networkId
                    }
                },
                "userId": options.userId,
                "params": {
                    "vpcid": options.vpcId,
                    "az-id": options.azId,
                    "start": options.start,
                    "limit": options.limit,
                    "cloud-infras": options.cloudInfraId,
                    "usedbyrouter": options.usedbyrouter || false,
                    "usedbyvxlanrouter": options.usedbyvxlanrouter || false,
                    "isAssociated": options.isAssociated || false
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

        //查询网络详细信息
        this.queryNetworkDetail = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{networkID}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "vpcid": param.vpcId,
                        "networkID": param.networkID,
                        "cloud_infras_id": param.cloudInfraId
                    }
                },
                "userId": param.userId
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

        //创建网络接口
        this.createNetwork = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": option.vdcId,
                        "cloud_infras_id": option.cloudInfraId,
                        "vpcid": option.vpcId
                    }
                },
                "timeout": 30000,
                "userId": option.userId,
                "params": JSON.stringify(option.params)
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

        //查询vlan池
        this.queryVlanPools = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vlanpools/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": option.vdcId,
                        "cloud_infras_id": option.cloudInfraId
                    }
                },
                "userId": option.userId,
                "params": JSON.stringify({
                    "queryNetworkVlanPoolReq": option.params
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

        //网络关联去关联路由
        this.operateRouter = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{id}/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": option.vdc_id,
                        "vpcid": option.vpcid,
                        "id": option.id,
                        "cloud_infras_id": option.cloud_infras_id
                    }
                },
                "params": JSON.stringify(option.params),
                "userId": option.userId
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

        //修改网络接口
        this.updateNetwork = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{networkID}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "networkID": param.networkID,
                        "cloud_infras_id": param.cloudInfraId,
                        "vpcid": param.vpcId
                    }
                },
                "userId": param.userId,
                "params": JSON.stringify({
                    "name": param.name,
                    "description": param.description || null,
                    "subnet": param.subnet,
                    "ipv6subnet": param.ipv6subnet
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

        // 开启SNAT
        this.openSnat = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/snats?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "vpcid": param.vpcId,
                        "cloud_infras_id": param.cloudInfraId
                    }
                },
                "userId": param.userId,
                "params": JSON.stringify({
                    "networkID": param.networkID,
                    "publicIP":param.publicIP
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
        // 关闭SNAT
        this.closeSnat = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/snats/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "vpcid": param.vpcId,
                        "id": param.id,
                        "cloud_infras_id": param.cloudInfraId
                    }
                },
                "userId": param.userId,
                "params": {}
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

        //查询私有IP
        this.queryPrivateIP = function (param) {
            var deferred = $q.defer();
            deferred.notify("");

            var deferred1;
            if (!param.routable) {
                deferred1 = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips?cloud-infras={cloud_infras_id}",
                        o: {
                            "vdc_id": param.vdcId,
                            "vpcid": param.vpcId,
                            "cloud_infras_id": param.cloudInfraId
                        }
                    },
                    "userId": param.userId,
                    "params": {
                        "networkid": param.networkID,
                        "privateIP": param.privateIP,
                        "allocateType": param.allocateType, // MANUAL:手动; AUTO:自动
                        "start": param.start,
                        "limit": param.limit
                    }
                });
            } else {
                deferred1 = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips?cloud-infras={cloud_infras_id}&routable={routable}",
                        o: {
                            "vdc_id": param.vdcId,
                            "vpcid": param.vpcId,
                            "cloud_infras_id": param.cloudInfraId,
                            "routable": param.routable
                        }
                    },
                    "userId": param.userId,
                    "params": {
                        "networkid": param.networkID,
                        "privateIP": param.privateIP,
                        "allocateType": param.allocateType, // MANUAL:手动; AUTO:自动
                        "start": param.start,
                        "limit": param.limit
                    }
                });
            }
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

        //释放私有IP
        this.releasePrivateIP = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infras_id": param.cloudInfraId,
                        "vpcid": param.vpcId,
                        "id": param.id
                    }
                },
                "userId": param.userId
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

        //申请私有IP
        this.applyPrivateIP = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infras_id": param.cloudInfraId,
                        "vpcid": param.vpcId
                    }
                },
                "userId": param.userId,
                "params": JSON.stringify({
                    "networkID": param.networkID,
                    "privateIP": param.privateIP,
                    "description": param.description
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

        //更新私有IP
        this.updatePrivateIP = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infras_id": param.cloudInfraId,
                        "vpcid": param.vpcId
                    }
                },
                "userId": param.userId,
                "params": JSON.stringify({
                    "networkID": param.networkID,
                    "privateIP": param.privateIP,
                    "description": param.description
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

        this.queryNATPConfig = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/dnats/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
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

        //查询VM详情
        this.queryVmDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}?cloud-infra={cloud-infra}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.vmId,
                        "cloud-infra": options.cloudInfraId,
                        "vpc_id": options.vpcId
                    }
                },
                "userId": options.user.id,
                "vpcId": options.vpcId
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

        //查询VPC配额
        this.queryVpcQuota = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{id}/statistics",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.vpcId
                    }
                },
                "userId": options.userId,
                "params": {
                    "cloud-infras": options.cloudInfraId
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

        //查询VDC配额
        this.queryVdcQuota = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/vdcs/{id}/quotas/usage",
                    o: {
                        "id": options.vdcId
                    }
                },
                "timeout": 60000,
                "userId": options.userId,
                "params": {}
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

        //修改VPC配额
        this.modfiyVpcQuota = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify(options.vpcSpec)
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

        //查询VPC授权
        this.queryVpcAuth = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpc-authentications",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "userId": options.userId,
                "params": options.params
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

        //创建VPC 授权
        this.createVpcAuth = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpc-authentications?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify({
                    "vpcID": options.vpcId
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

        //删除VPC 授权
        this.deleteVpcAuth = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpc-authentications/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "cloud_infras_id": options.cloudInfraId,
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

        this.queryVmByVpc = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra": options.cloudInfraId,
                        "vpc_id": options.vpcId
                    }
                },
                "params": JSON.stringify({
                    "list": {
                        "condition": options.searchString,
                        "vpcId": options.vpcId,
                        "start": options.start,
                        "limit": options.displayLength,
                        "networkType": options.networkType
                    }
                }),
                "vpcId": options.vpcId,
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

        this.createDnat = function (options) {
            var params = {
                "vmID": options.vmID,
                "nicID": options.nicID,
                "privateIP": options.privateIP,
                "networkID": options.networkID,
                "privatePort": options.privatePort,
                "publicPort": options.publicPort,
                "protocol": options.protocol,
                "publicIP": options.publicIP
            };
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/dnats?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infras_id": options.cloudInfraId,
                        "vpcid": options.vpcId
                    }
                },
                "params": JSON.stringify(params),
                "vpcId": options.vpcId,
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

        this.queryPrivateIps = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/privateips/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "query": {
                        "vpcID": options.vpcId,
                        "start": options.start,
                        "limit": options.displayLength
                    }
                }),
                "vpcId": options.vpcId,
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

        //修复IP
        this.fixNetworkAutoIps = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infras_id": param.cloudInfraId,
                        "vpcid": param.vpcId
                    }
                },
                "userId": param.userId,
                "params": JSON.stringify({
                    "fix": {
                        "networkID": param.networkID
                    }
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

        //查询网络关联的虚拟机
        this.queryNetworkVms = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud-infra}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud-infra": param.cloudInfraId,
                        "vpc_id": param.vpcId
                    }
                },
                "params": JSON.stringify({
                    "list": {
                        "start": param.start,
                        "limit": param.limit,
                        "networkId": param.networkID
                    }
                }),
                "vpcId": param.vpcId,
                "userId": param.userId,
				"timeout": 300000
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

        this.queryDNAT = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/dnats?cloud-infras={cloud_infras_id}&start={start}&limit={limit}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId,
                        "start": options.start,
                        "limit": options.limit
                    }
                },
                "params": {},
                "vpcId": options.vpcId,
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

        this.queryDNATDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpc/{vpcid}/dnets/detail?cloud-infras={cloud_infras_id}",
                    "o": {}
                },
                "params": {},
                "vpcId": options.vpcId,
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

        this.releaseDnat = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/dnats/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "id": options.dnatId,
                        "cloud_infras_id": options.cloudInfraId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {},
                "vpcId": options.vpcId,
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

        //查询VPC下VPN链接
        this.queryVpnConnection = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-connections",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId
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

        //查询VPC下单个VPN链接
        this.querySingleVpnConnection = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-connections/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.id
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId
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

        //删除VPN链接
        this.deleteVpnConnection = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-connections/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.vpnConnectionID,
                        "cloud_infras_id": options.cloudInfraId
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

        //删除网络
        this.deleteNetwork = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.networkId,
                        "cloud_infras_id": options.cloudInfraId
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

        //创建VPN链接
        this.createVpnConnection = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-connections?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
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
        //修改VPN链接
        this.updateVpnConnection = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-connections/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.id,
                        "cloud_infras_id": options.cloudInfraId
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
        //查询aspf
        this.queryAspfRegular = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/aspf",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId
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
        //修改aspf
        this.modifyAspfRegular = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/aspf?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
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
        //接入vmwar虚拟化平台的ICT场景，查询nova network
        this.queryNovaNetwork = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/os-networks?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
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
        //删除nova network
        this.deleteNovaNetwork = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.delete({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/os-networks/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId,
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
        //创建nova network
        this.createNovaNetwork = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/os-networks?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
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

        //查询网络统计信息
        this.queryNetworkStatistics = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/capacity-statistics/networks",
                    "o": {
                        "vdc_id": options.vdcId
                    }
                },
                "params": {"cloud-infras": options.cloudInfraId},
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

        //查询vpc模板规格
        this.queryVpcspectemplates = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcspectemplates/0",
                    "o": {
                        "vdc_id": options.vdcId
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
