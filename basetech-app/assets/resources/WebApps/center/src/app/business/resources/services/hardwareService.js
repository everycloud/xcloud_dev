define(["jquery", "tiny-lib/angular", "app/services/httpService", "language/keyID"], function ($, angular, httpService, i18n) {
    "use strict";

    var statusKey = {
        "1": i18n.common_term_natural_value,
        "2": i18n.common_term_abnormal_value,
        "3": i18n.common_term_unknown_value
    }
    var allocateStatusKey = {
        "Allocated": i18n.common_term_used_value || "已分配",
        "UnAllocated": i18n.common_term_noAssign_value || "未分配"
    }

    var usbStatuses = {
        Working: i18n.common_term_running_value,
        Ready: i18n.common_term_ready_value,
        Unavailable: i18n.common_term_unavailable_value
    };

    function getStatus(status) {
        return statusKey[status] || statusKey["3"];
    };
    function getAllocateStatus(allocateStatus) {
        return allocateStatusKey[allocateStatus];
    };

    function getUsbGridViewData(data) {
        for (var i = 0; i < data.usbs.length; i++) {
            data.usbs[i].allocateStatusStr = getAllocateStatus(data.usbs[i].allocateStatus);
            data.usbs[i].statusStr = usbStatuses[data.usbs[i].status] || data.usbs[i].status;
        }
        return data;
    };

    function getString(item) {
        if (item) {
            return item.metricValue;
        }

        return "";
    };

    function convertNum(item) {
        if (!item) {
            return "";
        }
        if (item == "") {
            return "";
        }
        var num = new Number(item);
        return num.toFixed(2);
    };

    var service = {
        "getHostUsbInfos": function (hostId, user, callback) {
            var http = new httpService();
            var deferred = http.get({
                "url": "/goku/rest/v1.5/irm/1/hosts/" + hostId + "/usbs",
                "params": "",
                "userId": user.id
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                value.data = getUsbGridViewData(data);
                callback && callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback && callback(value);
            });
        },
        "getHostHardwareInfos": function (hostId, propertys, user, callback) {
            var http = new httpService();
            var deferred = http.post({
                "url": "/goku/rest/v1.5/irm/server/metric-data",
                "params": JSON.stringify({ "serverId": hostId,
                    "metricIdList": propertys}),
                "timeout": 60000,
                "userId": user.id
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                value.data = data;
                callback && callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback && callback(value);
            });
        },
        "getBiosInfos": function (data) {
            var biosInfo = {};
            biosInfo.hostMemTotalsize = convertNum(getString(data.metricInfo["host.mem.totalsize"]) / 1024);
            biosInfo.hostCpuTotalfreq = getString(data.metricInfo["host.cpu.totalfreq"]);

            biosInfo.diskTotal = getString(data.metricInfo["host.disk.totalsize"]);
            biosInfo.logicDiskTotal = getString(data.metricInfo["host.logicdisk.totalsize"]) / 1024;
            biosInfo.logicDiskTotal = convertNum(biosInfo.logicDiskTotal);
            if (biosInfo.hostCpuTotalfreq) {
                var num = new Number(biosInfo.hostCpuTotalfreq);
                biosInfo.hostCpuTotalfreq = num.toFixed(2);
            }
            biosInfo.vendor = getString(data.metricInfo["bios_vendor"]);
            biosInfo.version = getString(data.metricInfo["bios_version"]);
            biosInfo.releaseDate = getString(data.metricInfo["bios_release_date"]);
            biosInfo.mbManufacturer = getString(data.metricInfo["board_mfg"]);
            biosInfo.mbModel = getString(data.metricInfo["board_prod"]);
            biosInfo.mbVersion = getString(data.metricInfo["board_version"]);
            biosInfo.mbSn = getString(data.metricInfo["board_serial"]);
            biosInfo.serverManufacturer = getString(data.metricInfo["product_mfg"]);
            biosInfo.serverModel = getString(data.metricInfo["product_name"]);
            biosInfo.serverVersion = getString(data.metricInfo["product_version"]);
            biosInfo.serverSn = getString(data.metricInfo["product_serial"]);
            return biosInfo;
        },
        "getPowerInfos": function (data) {
            var powerInfos = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["power" + i + ".id"] == undefined) {
                    break;
                }
                var powerInfo = {};
                powerInfo.id = getString(data.metricInfo["power" + i + ".id"]);
                powerInfo.power = getString(data.metricInfo["power" + i + ".power"]);
                powerInfo.status = getStatus(getString(data.metricInfo["power" + i + ".status"]));
                powerInfos.push(powerInfo);
                i = i + 1;
            }
            return powerInfos;
        },
        "getFanInfos": function (data) {
            var fanInfos = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["fan" + i + ".id"] == undefined) {
                    break;
                }
                var fanInfo = {};
                fanInfo.id = getString(data.metricInfo["fan" + i + ".id"]);
                fanInfo.speed = getString(data.metricInfo["fan" + i + ".speed"]);
                fanInfo.speed = ( fanInfo.speed == "-1" ? "-" : fanInfo.speed);
                fanInfo.status = getStatus(getString(data.metricInfo["fan" + i + ".status"]));
                fanInfos.push(fanInfo);
                i = i + 1;
            }
            return fanInfos;
        },
        "getCpuInfos": function (data) {
            var cpuInfos = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["cpu" + i + ".seq"] == undefined) {
                    break;
                }
                var cpuInfo = {};
                cpuInfo.sn = getString(data.metricInfo["cpu" + i + ".seq"]);
                cpuInfo.model = getString(data.metricInfo["cpu" + i + ".version"]);
                cpuInfo.frequency = getString(data.metricInfo["cpu" + i + ".max_speed"]);
                cpuInfo.cores = getString(data.metricInfo["cpu" + i + ".core_count"]);
                cpuInfo.threads = getString(data.metricInfo["cpu" + i + ".thread_count"]);
                cpuInfo.status = getString(data.metricInfo["cpu" + i + ".status"]);
                cpuInfo.status = (cpuInfo.status == "" ? "-" : cpuInfo.status);
                cpuInfo.temperature = getString(data.metricInfo["cpu" + i + ".temperature"]);
                cpuInfo.temperature = (cpuInfo.temperature == "" ? "-" : cpuInfo.temperature);
                cpuInfo.serials = getString(data.metricInfo["cpu" + i + ".family"]);
                cpuInfo.manufacturer = getString(data.metricInfo["cpu" + i + ".manufacturer"]);
                cpuInfos.push(cpuInfo);
                i = i + 1;
            }
            return cpuInfos;
        },
        "getMemoryInfos": function (data) {
            var memoryInfos = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["mem" + i + ".locator"] == undefined) {
                    break;
                }
                var memoryInfo = {};
                memoryInfo.location = getString(data.metricInfo["mem" + i + ".locator"]);
                memoryInfo.type = getString(data.metricInfo["mem" + i + ".type"]);
                memoryInfo.type = ( memoryInfo.type == "" ? "-" : memoryInfo.type);
                memoryInfo.capacity = getString(data.metricInfo["mem" + i + ".size"]);
                memoryInfo.manufacturer = getString(data.metricInfo["mem" + i + ".manufacturer"]);
                memoryInfo.status = getString(data.metricInfo["mem" + i + ".status"]);
                memoryInfo.status = ( memoryInfo.status == "" ? "-" : memoryInfo.status);
                memoryInfos.push(memoryInfo);
                i = i + 1;
            }
            return memoryInfos;
        },
        "getNetCardInfos": function (data) {
            var netCardInfos = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["nic" + i + ".id"] == undefined) {
                    break;
                }
                var netCardInfo = {};
                netCardInfo.id = getString(data.metricInfo["nic" + i + ".id"]);
                netCardInfo.model = getString(data.metricInfo["nic" + i + ".type"]);
                netCardInfos.push(netCardInfo);
                i = i + 1;
            }
            return netCardInfos;
        },
        "getDiskInfos": function (data) {
            var diskInfos = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["disk" + i + ".name"] == undefined) {
                    break;
                }
                var diskInfo = {};
                diskInfo.name = getString(data.metricInfo["disk" + i + ".name"]);
                diskInfo.size = getString(data.metricInfo["disk" + i + ".size"]);
                diskInfos.push(diskInfo);
                i = i + 1;
            }
            return diskInfos;
        },
        "getPhyDiskInfos": function (data) {
            var phyDiskTable = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["harddisk" + i + ".slotnum"] == undefined) {
                    break;
                }
                var phyDiskInfo = {};
                phyDiskInfo.slotnum = getString(data.metricInfo["harddisk" + i + ".slotnum"]);
                phyDiskInfo.manufacturer = getString(data.metricInfo["harddisk" + i + ".manufacturer"]);
                phyDiskInfo.type = getString(data.metricInfo["harddisk" + i + ".type"]);
                phyDiskInfo.sn = getString(data.metricInfo["harddisk" + i + ".sn"]);
                phyDiskInfo.capacity = getString(data.metricInfo["harddisk" + i + ".capacity"]);
                phyDiskTable.push(phyDiskInfo);
                i = i + 1;
            }
            phyDiskTable.totalQuality = 0;
            if(data.metricInfo["host.harddisk.info.count"] && data.metricInfo["host.harddisk.info.count"].metricValue){
                phyDiskTable.totalQuality = data.metricInfo["host.harddisk.info.count"].metricValue;
            }
            return phyDiskTable;
        },
        "getLogicDiskfos": function (data) {
            var logicDiskInfos = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["logicdisk" + i + ".name"] == undefined) {
                    break;
                }
                var logicDiskInfo = {};
                logicDiskInfo.name = getString(data.metricInfo["logicdisk" + i + ".name"]);
                logicDiskInfo.size = getString(data.metricInfo["logicdisk" + i + ".size"]);
                logicDiskInfo.size = convertNum(logicDiskInfo.size);
                logicDiskInfo.used = getString(data.metricInfo["logicdisk" + i + ".used"]);
                logicDiskInfo.used = convertNum(logicDiskInfo.used);
                logicDiskInfo.usage = getString(data.metricInfo["logicdisk" + i + ".usage"]);
                logicDiskInfo.usage = logicDiskInfo.usage + "%";
                logicDiskInfo.mounted_dir = getString(data.metricInfo["logicdisk" + i + ".mounted_dir"]);
                logicDiskInfos.push(logicDiskInfo);
                i = i + 1;
            }
            return logicDiskInfos;
        },
        "getNetPortInfos": function (data) {
            var netPortInfos = [];
            var i = 1;
            while (true) {
                if (data.metricInfo["eth" + i + ".name"] == undefined) {
                    break;
                }
                var netPortInfo = {};
                netPortInfo.name = getString(data.metricInfo["eth" + i + ".name"]);
                netPortInfo.spec = getString(data.metricInfo["eth" + i + ".speed"]);
                netPortInfo.duplexMode = getString(data.metricInfo["eth" + i + ".workmode"]);
                netPortInfo.mac = getString(data.metricInfo["eth" + i + ".mac"]);
                if (data.metricInfo["eth" + i + ".pkg_send"]) {
                    netPortInfo.pkg_send = data.metricInfo["eth" + i + ".pkg_send"].metricValue;
                }
                if (data.metricInfo["eth" + i + ".pkg_rcv"]) {
                    netPortInfo.pkg_rcv = data.metricInfo["eth" + i + ".pkg_rcv"].metricValue;
                }
                if (data.metricInfo["eth" + i + ".byte_in"]) {
                    netPortInfo.byte_in = data.metricInfo["eth" + i + ".byte_in"].metricValue;
                }
                if (data.metricInfo["eth" + i + ".byte_out"]) {
                    netPortInfo.byte_out = data.metricInfo["eth" + i + ".byte_out"].metricValue;
                }
                if (data.metricInfo["eth" + i + ".status"]) {
                    netPortInfo.status = data.metricInfo["eth" + i + ".status"].metricValue;
                }
                if (data.metricInfo["eth" + i + ".rxDropPkt"]) {
                    netPortInfo.rxDropPkt = data.metricInfo["eth" + i + ".rxDropPkt"].metricValue;
                }
                if (data.metricInfo["eth" + i + ".txDropPkt"]) {
                    netPortInfo.txDropPkt = data.metricInfo["eth" + i + ".txDropPkt"].metricValue;
                }

                netPortInfos.push(netPortInfo);
                i = i + 1;
            }
            return netPortInfos;
        }

    };
    return service;
});
