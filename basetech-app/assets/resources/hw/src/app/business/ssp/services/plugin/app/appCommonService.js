/* global define */
define(["language/keyID"], function (keyIDI18n) {
    "use strict";
    var i18n = keyIDI18n;
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        this.queryVpcList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs",
                    "o": {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "timeout": 30000,
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "start": options.start,
                    "limit": options.limit
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

        this.queryServiceTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apptemplates",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "visible": options.visible,
                    "status": options.status,
                    "name": options.name,
                    "limit": options.limit,
                    "start": options.start
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

        this.queryAvailableShell = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scripts",
                    "o": {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "limit": options.limit,
                    "start": options.start
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

        this.queryAvailableVlbTemp = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "vpcid": options.vpcId,
                    "limit": options.limit,
                    "start": options.start
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

        this.queryAvailableVmTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vmtemplates",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "status": options.status,
                    "limit": options.limit,
                    "start": options.start,
                    "azid": options.azid
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

        // 查询虚拟机规格
        this.queryVmFlavors = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vm-flavors",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "limit": options.limit,
                    "start": options.start
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

        this.generateSpec = function (curFlavor) {
            //分别存放概要规格(如:4U|2G|60G)和详细规格(2CPU;2G内存)
            var specArray = [];
            if (!curFlavor) {
                return specArray;
            }
            var overviewSpec = "";
            var detailSpec = "";
            if (curFlavor.cpuCount) {
                overviewSpec += curFlavor.cpuCount;
                overviewSpec += " | ";
                detailSpec += "CPU: ";
                detailSpec += (curFlavor.cpuCount + "vCPU; ");
            }
            if (curFlavor.memSize) {
                overviewSpec += curFlavor.memSize;
                overviewSpec += "M | ";
                detailSpec += i18n.common_term_memory_label + ": ";
                detailSpec += (curFlavor.memSize + "MB; ");
            }
            if (curFlavor.disks) {
                var diskSize = 0;
                var diskDetail = "";
                for (var i = 0; i < curFlavor.disks.length; i++) {
                    if (curFlavor.disks[i]) {
                        diskSize += curFlavor.disks[i].diskSize;
                        diskDetail += (i18n.common_term_disk_label + curFlavor.disks[i].index + ": ");
                        diskDetail += (curFlavor.disks[i].diskSize + "GB; ");
                    }
                }
                diskSize += "G";
                overviewSpec += diskSize;
                detailSpec += diskDetail;
            }
            var lastSeperatorIndex = detailSpec.lastIndexOf(";");
            if (lastSeperatorIndex >= 0) {
                detailSpec = detailSpec.substring(0, lastSeperatorIndex);
            }
            specArray["overviewSpec"] = overviewSpec;
            specArray["detailSpec"] = detailSpec;
            return specArray;
        };

        this.queryAvailableSoftPacks = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/softwares",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "limit": options.limit,
                    "start": options.start
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

        this.queryOsTypeMappings = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apptemplates/ostypes",
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

        this.getVpc = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{id}",
                    o: {
                        "vdc_id": option.vdcId,
                        "id": option.vpcId
                    }
                },
                "userId": option.userId,
                "params": {
                    "cloud-infras": option.cloudInfraId
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
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});
