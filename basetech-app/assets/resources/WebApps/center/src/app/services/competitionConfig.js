/*比拼配置，是一个map,key为比拼特性,value为是否开启*/
/*global define*/
define([], function () {
    "use strict";
    var CONFIG = {
        /* openstack接入VMware,页面上许多功能要屏蔽 */
        "isBaseOnVmware": false,
        /* 存储IO控制，磁盘IO份额，磁盘资源回收 */
        "storageIoControl": false,
        /*ICT下SDN场景，是否开启vpn、acls服务*/
        /*请勿改写下面字段的格式，重要！*/
        "isSDN":false

    };
    return CONFIG;
});