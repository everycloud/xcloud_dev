define(["can/util/fixture/fixture"], function (fixture) {
    var networkList = {"networks": [
        {"networkID": "30000000041", "vpcId": "4792750811720056836", "azID": "4616189618054758401", "vdcID": "34", "userID": null, "name": "FMIN_I01", "description": null, "vlan": 73, "totalBoundNics": 0, "ipv4Subnet": {"ipAllocatePolicy": 3, "subnetAddr": "173.7.33.0", "subnetPrefix": "255.255.255.0", "gateway": "173.7.33.1", "availableIPRanges": [
            {"startIP": "173.7.33.5", "endIP": "173.7.33.254"}
        ], "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 250, "usedAddrNum": 0}, "ipv6Subnet": null, "routed": false, "directNetwork": false, "exNetworkId": null, "status": "READY", "portSetting": {"inTrafficShapingPolicyFlag": true, "inTrafficShapingPolicy": {"averageBandwidth": 4000, "peakBandwidth": 4000, "burstSize": 4000}, "outTrafficShapingPolicyFlag": true, "outTrafficShapingPolicy": {"averageBandwidth": 4000, "peakBandwidth": 4000, "burstSize": 4000, "priority": 4}, "arpPacketSuppression": null, "ipPacketSuppression": null, "dhcpIsolationFlag": false, "ipMacBindFlag": false}, "snat": null, "vpcName": "unsharedVPC_B01", "shareVpc": false, "azName": "shenzhen_AZ01"},
        {"networkID": "30000000040", "vpcId": "4792750811720056838", "azID": "4616189618054758401", "vdcID": "1", "userID": null, "name": "FMRN_R01", "description": null, "vlan": 76, "totalBoundNics": 0, "ipv4Subnet": {"ipAllocatePolicy": 3, "subnetAddr": "176.7.6.0", "subnetPrefix": "255.255.255.0", "gateway": "176.7.6.1", "availableIPRanges": [
            {"startIP": "176.7.6.5", "endIP": "176.7.6.254"}
        ], "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 250, "usedAddrNum": 0}, "ipv6Subnet": null, "routed": true, "directNetwork": false, "exNetworkId": null, "status": "READY", "portSetting": {"inTrafficShapingPolicyFlag": false, "inTrafficShapingPolicy": null, "outTrafficShapingPolicyFlag": false, "outTrafficShapingPolicy": null, "arpPacketSuppression": 0, "ipPacketSuppression": 0, "dhcpIsolationFlag": false, "ipMacBindFlag": true}, "snat": null, "vpcName": "sharedVPC_A06", "shareVpc": true, "azName": "shenzhen_AZ01"},
        {"networkID": "30000000039", "vpcId": "4792750811720056837", "azID": "4616189618054758401", "vdcID": "34", "userID": null, "name": "FMRN_R02", "description": null, "vlan": 75, "totalBoundNics": 1, "ipv4Subnet": {"ipAllocatePolicy": 3, "subnetAddr": "175.77.55.0", "subnetPrefix": "255.255.255.0", "gateway": "175.77.55.1", "availableIPRanges": [
            {"startIP": "175.77.55.5", "endIP": "175.77.55.254"}
        ], "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 250, "usedAddrNum": 3}, "ipv6Subnet": null, "routed": true, "directNetwork": false, "exNetworkId": null, "status": "READY", "portSetting": {"inTrafficShapingPolicyFlag": true, "inTrafficShapingPolicy": {"averageBandwidth": 4000, "peakBandwidth": 4000, "burstSize": 4000}, "outTrafficShapingPolicyFlag": true, "outTrafficShapingPolicy": {"averageBandwidth": 4000, "peakBandwidth": 4000, "burstSize": 4000, "priority": 4}, "arpPacketSuppression": null, "ipPacketSuppression": null, "dhcpIsolationFlag": false, "ipMacBindFlag": false}, "snat": null, "vpcName": "unsharedVPC_B01", "shareVpc": false, "azName": "shenzhen_AZ01"},
        {"networkID": "30000000038", "vpcId": "4792750811720056832", "azID": "4616189618054758401", "vdcID": "1", "userID": null, "name": "FMRN_R03", "description": null, "vlan": 74, "totalBoundNics": 0, "ipv4Subnet": {"ipAllocatePolicy": 3, "subnetAddr": "174.77.44.0", "subnetPrefix": "255.255.255.0", "gateway": "174.77.44.1", "availableIPRanges": [
            {"startIP": "174.77.44.5", "endIP": "174.77.44.254"}
        ], "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 250, "usedAddrNum": 0}, "ipv6Subnet": null, "routed": true, "directNetwork": false, "exNetworkId": null, "status": "READY", "portSetting": {"inTrafficShapingPolicyFlag": false, "inTrafficShapingPolicy": null, "outTrafficShapingPolicyFlag": false, "outTrafficShapingPolicy": null, "arpPacketSuppression": 0, "ipPacketSuppression": 0, "dhcpIsolationFlag": false, "ipMacBindFlag": true}, "snat": null, "vpcName": "sharedVPC_A02", "shareVpc": true, "azName": "shenzhen_AZ01"},
        {"networkID": "30000000035", "vpcId": "4792750811720056833", "azID": "4616189618054758401", "vdcID": "36", "userID": null, "name": "FMRN_R04", "description": null, "vlan": 72, "totalBoundNics": 1, "ipv4Subnet": {"ipAllocatePolicy": 1, "subnetAddr": "124.111.222.0", "subnetPrefix": "255.255.255.0", "gateway": "124.111.222.1", "availableIPRanges": [
            {"startIP": "124.111.222.5", "endIP": "124.111.222.254"}
        ], "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 250, "usedAddrNum": 3}, "ipv6Subnet": null, "routed": true, "directNetwork": false, "exNetworkId": null, "status": "READY", "portSetting": {"inTrafficShapingPolicyFlag": true, "inTrafficShapingPolicy": {"averageBandwidth": 4000, "peakBandwidth": 4000, "burstSize": 4000}, "outTrafficShapingPolicyFlag": true, "outTrafficShapingPolicy": {"averageBandwidth": 4000, "peakBandwidth": 4000, "burstSize": 4000, "priority": 4}, "arpPacketSuppression": null, "ipPacketSuppression": null, "dhcpIsolationFlag": false, "ipMacBindFlag": false}, "snat": {"snatID": "4800837202776948737", "vpcID": "4792750811720056833", "publicIP": "172.16.70.11", "networkID": "30000000035", "networkName": "routenet", "status": "READY"}, "vpcName": "unsharedVPC_B01", "shareVpc": false, "azName": "shenzhen_AZ01"},
        {"networkID": "30000000034", "vpcId": "4792750811720056832", "azID": "4616189618054758401", "vdcID": "1", "userID": null, "name": "FMRN_R05", "description": null, "vlan": 71, "totalBoundNics": 0, "ipv4Subnet": {"ipAllocatePolicy": 3, "subnetAddr": "124.112.121.0", "subnetPrefix": "255.255.255.0", "gateway": "124.112.121.1", "availableIPRanges": [
            {"startIP": "124.112.121.5", "endIP": "124.112.121.254"}
        ], "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 250, "usedAddrNum": 0}, "ipv6Subnet": null, "routed": true, "directNetwork": false, "exNetworkId": null, "status": "READY", "portSetting": {"inTrafficShapingPolicyFlag": true, "inTrafficShapingPolicy": {"averageBandwidth": 111, "peakBandwidth": 222, "burstSize": 222}, "outTrafficShapingPolicyFlag": true, "outTrafficShapingPolicy": {"averageBandwidth": 111, "peakBandwidth": 222, "burstSize": 322, "priority": 4}, "arpPacketSuppression": 0, "ipPacketSuppression": 0, "dhcpIsolationFlag": true, "ipMacBindFlag": true}, "snat": null, "vpcName": "sharedVPC_A02", "shareVpc": true, "azName": "shenzhen_AZ01"},
        {"networkID": "30000000033", "vpcId": "4792750811720056832", "azID": "4616189618054758401", "vdcID": "1", "userID": null, "name": "FMDN_D01", "description": null, "vlan": 77, "totalBoundNics": 0, "ipv4Subnet": {"ipAllocatePolicy": 3, "subnetAddr": "172.16.67.0", "subnetPrefix": "255.255.255.0", "gateway": "172.16.67.254", "availableIPRanges": [
            {"startIP": "172.16.67.1", "endIP": "172.16.67.253"}
        ], "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 253, "usedAddrNum": 4}, "ipv6Subnet": null, "routed": false, "directNetwork": true, "exNetworkId": "20000000000", "status": "READY", "portSetting": {"inTrafficShapingPolicyFlag": false, "inTrafficShapingPolicy": null, "outTrafficShapingPolicyFlag": false, "outTrafficShapingPolicy": null, "arpPacketSuppression": 0, "ipPacketSuppression": 0, "dhcpIsolationFlag": false, "ipMacBindFlag": false}, "snat": null, "vpcName": "sharedVPC_A02", "shareVpc": true, "azName": "shenzhen_AZ01"}
    ], "total": 7};

    fixture({
        // VPCResource
        "GET /goku/rest/v1.5/irm/1/vpcs?start={s}&limit={l}": function (original, response) {
            var d =
            {"vpcs": [
                {"vpcID": "4792750811720056851", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A01", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200, "maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056850", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A02", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056849", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A03", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056848", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A04", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056847", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A05", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056846", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A06", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056841", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A07", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056840", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A08", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056839", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A09", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056837", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "2", "name": "unsharedVPC_B01", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": false}
            ], "total": 10}
            response(200, "success", d, {});
        },

        //getVPC
        "GET /goku/rest/v1.5/irm/{vdc_id}/vpcs?start={start}&limit={limit}&shared=true&availablezone={availablezone}": function (original, response) {
            var d =
            {"vpcs": [
                {"vpcID": "4792750811720056851", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A02", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056850", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A02", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056849", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A02", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056848", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A02", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056847", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A02", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056846", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A06", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056841", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A02", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200,"maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056840", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A02", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200, "maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true},
                {"vpcID": "4792750811720056839", "azIDsMapNames": {"4616189618054758401": "shenzhen_AZ01"}, "tenantID": "1", "name": "sharedVPC_A05", "description": null, "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200, "maxRoutedNetworkNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}, "shared": true}
            ], "total": 9}
            response(200, "success", d, {});
        },

        //getZone
        "GET /goku/rest/v1.5/irm/1/zones": function (original, response) {
            var d =
            {"zones": [

                {"name": "ZONE_SHENZHEN", "region": "ZONE_SHENZHEN", "description": null, "networkMode": "FIREWALL_ONLY", "id": "4616189618054758402", "createTime": 1411494908830, "lastModifiedTime": 1411494908830}
            ]};

            response(200, "success", d, {});
        },

        //getAZ
        "POST /goku/rest/v1.5/irm/1/availablezones/list": function (original, response) {
            var d =
            {"availableZones": [
                {"name": "shenzhen_AZ01", "region": null, "description": null, "resources": {"volume": ["4683743612465315875", "4683743612465315876", "4683743612465315877", "4683743612465315878"], "virtualMachine": ["4629700416936869889$urn:sites:357606CA:vms:i-0000010F", "4629700416936869889$urn:sites:357606CA:vms:i-0000010D", "4629700416936869889$urn:sites:357606CA:vms:i-00000110", "4629700416936869889$urn:sites:357606CA:vms:i-0000010E"], "resourceCluster": ["4629700416936869889$urn:sites:357606CA:clusters:10"]}, "numResourcesCluster": 2, "numVM": 4, "numVolume": 4, "tags": null, "zoneId": "4616189618054758401", "id": "4616189618054758401", "serviceStatus": null, "createTime": 1411444135375, "lastModifiedTime": 1411444135375, "lastPausedTime": null, "resourceTags": {"datastore": [
                    {"name": "FusionManager_MediaType", "value": "SAN-Any"}
                ]}}
            ], "total": 1};


            response(200, "success", d, {});
        },

        //create
        "POST /goku/rest/v1.5/irm/1/vpcs": function (original, response) {
            var d =
            {"vpcID": "4792750811720056869"}
            response(200, "success", d, {});
        },

        //remove
        "DELETE /goku/rest/v1.5/irm/1/vpcs/{id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //modifycapacity-statistics/resource-networks
        "PUT /goku/rest/v1.5/irm/1/vpcs/{id}": function (original, response) {
            response(200, "success", {}, {});
        },

        // 网络 OrgNetworkResource
        //queryNet
        "GET /goku/rest/v1.5/irm/{vdc_id}/vpcs/{vpcid}/networks?start={start}&limit={limit}": function (original, response) {
            var d =networkList;

            response(200, "success", d, {});
        },
        "DELETE /goku/rest/v1.5/irm/{vdc_id}/vpcs/{vpcid}/networks/{id}": function (original, response) {
            var d ={};
            response(200, "success", d, {});
        },

        //开启sant
        "GET /goku/rest/v1.5/irm/1/snats":function (original, response) {
            var d=
            {"snatID":"4800837202776948740","taskID":"4724276009111650475"}
            response(200, "success", d, {});
        },
        "POST /goku/rest/v1.5/irm/1/snats":function (original, response) {
            var d = {};
            response(200, "success", d, {});
        },



        //createNet
        "POST /goku/rest/v1.5/irm/{vdc_id}/networks": function (original, response) {
            var d =
            {"networkID": "30000000029"}
            response(200, "success", d, {});
        },

        //removeNet
        "DELETE /goku/rest/v1.5/irm/{vdc_id}/networks/{id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //modifyNet
        "PUT /goku/rest/v1.5/irm/{vdc_id}/vpcs/{vpc_id}/networks/{id}": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/networks/{id}?start={start}&limit={limit}": function (original, response) {
            var id= fixture.getId(original);
            var res = {};
            for (var index in networkList.networks) {
                var network = networkList.networks[index];
                if (network.networkID === id) {
                    res = network;
                    break;
                }
            }
            response(200, "success", res, {})
        },

        // QueryAvailableExNetworkReq
        //getExtNet
        "POST /goku/rest/v1.5/irm/external-networks/action": function (original, response) {
            var d =
            {"queryAvailabeExNetworkResp": {"externalNetworks": [
                {"exnetworkID": "20000000000", "name": "asde", "description": null, "externalNetworkType": 2, "dvses": [
                    {"dvsID": "1", "name": "FCDVS_SZA01", "description": null, "clusterNames": [], "hypervisorName": "test", "hypervisorType": "fusioncompute"}
                ], "vlans": [123], "totalBoundNics": 0, "protocolType": "IPv4", "ipv4Subnet": {"ipAllocatePolicy": 0, "subnetAddr": "192.168.60.0", "subnetPrefix": "255.255.255.0", "gateway": "192.168.60.1", "availableIPRanges": [
                    {"startIP": "192.168.60.3", "endIP": "192.168.60.254"}
                ], "dhcpOption": {"dhcpServerIP1": "192.168.60.10", "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 252, "usedAddrNum": 0}, "ipv6Subnet": null, "portSetting": {"inTrafficShapingPolicyFlag": true, "inTrafficShapingPolicy": {"averageBandwidth": 100, "peakBandwidth": 200, "burstSize": 300}, "outTrafficShapingPolicyFlag": true, "outTrafficShapingPolicy": {"averageBandwidth": 100, "peakBandwidth": 200, "burstSize": 300, "priority": 4}, "arpPacketSuppression": 100, "ipPacketSuppression": 100, "dhcpIsolationFlag": false, "ipMacBindFlag": false}, "connectToInternetFlag": false, "status": "READY"},
                {"exnetworkID": "20000000033", "name": "exnet_subnet", "description": null, "externalNetworkType": 2, "dvses": [
                    {"dvsID": "1", "name": "FCDVS_SZA01", "description": null, "clusterNames": [], "hypervisorName": "test", "hypervisorType": "fusioncompute"}
                ], "vlans": [1900], "totalBoundNics": 0, "protocolType": "DualStack", "ipv4Subnet": {"ipAllocatePolicy": 3, "subnetAddr": "192.168.3.0", "subnetPrefix": "255.255.255.0", "gateway": "192.168.3.1", "availableIPRanges": [
                    {"startIP": "192.168.3.100", "endIP": "192.168.3.120"}
                ], "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 21, "usedAddrNum": 0}, "ipv6Subnet": {"ipAllocatePolicy": 3, "subnetAddr": "2001:2016::", "subnetPrefix": "64", "gateway": "2001:2016::1", "availableIPRanges": null, "dhcpOption": {"dhcpServerIP1": null, "dhcpServerIP2": null, "domainName": null, "primaryDNS": null, "secondaryDNS": null, "primaryWINS": null, "secondaryWINS": null}, "totalAddrNum": 2147483647, "usedAddrNum": 0}, "portSetting": {"inTrafficShapingPolicyFlag": false, "inTrafficShapingPolicy": null, "outTrafficShapingPolicyFlag": false, "outTrafficShapingPolicy": null, "arpPacketSuppression": 0, "ipPacketSuppression": 0, "dhcpIsolationFlag": false, "ipMacBindFlag": false}, "connectToInternetFlag": false, "status": "READY"},
                {"exnetworkID": "20000000034", "name": "test", "description": null, "externalNetworkType": 1, "dvses": [
                    {"dvsID": "1", "name": "FCDVS_SZA01", "description": null, "clusterNames": [], "hypervisorName": "test", "hypervisorType": "fusioncompute"}
                ], "vlans": [1902], "totalBoundNics": 0, "protocolType": null, "ipv4Subnet": null, "ipv6Subnet": null, "portSetting": {"inTrafficShapingPolicyFlag": false, "inTrafficShapingPolicy": null, "outTrafficShapingPolicyFlag": false, "outTrafficShapingPolicy": null, "arpPacketSuppression": 0, "ipPacketSuppression": 0, "dhcpIsolationFlag": false, "ipMacBindFlag": false}, "connectToInternetFlag": false, "status": "READY"}
            ], "total": 3}}
            response(200, "success", d, {});
        },

        // RouterResource
        //getRouter
        "GET /goku/rest/v1.5/irm/{vdc_id}/vpcs/{vpcid}/routers": function (original, response) {
            var d;
            d = {"routers": [
                {"routerID": "2569841", "name": "routers_B01", "userID": "5", "vpcID": "36548650811654132398", "vpcName": "sharedVPC_A06", "azID": "6698183214053658269", "azName": "shenzhen_AZ01", "routerType": 1, "status": "READY", "supportVxlanFlag": false, "enableSnat": false, "shareVpc": true, "externalNetworkID": "0"},
                {"routerID": "2316985", "name": "routers_B03", "userID": "11", "vpcID": "55562750811720056836", "vpcName": "unsharedVPC_B01", "azID": "5326189618054758401", "azName": "shenzhen_AZ01", "routerType": 1, "status": "READY", "supportVxlanFlag": false, "enableSnat": false, "shareVpc": false, "externalNetworkID": "0"},
                {"routerID": "2536981", "name": "routers_B29", "userID": "5", "vpcID": "34589690811720056833", "vpcName": "unsharedVPC_B01", "azID": "4616125988054758125", "azName": "shenzhen_AZ01", "routerType": 1, "status": "READY", "supportVxlanFlag": false, "enableSnat": false, "shareVpc": false, "externalNetworkID": "0"},
                {"routerID": "1489652", "name": "routers_B15", "userID": "11", "vpcID": "25693265811720056837", "vpcName": "unsharedVPC_B01", "azID": "3116182518053658369", "azName": "shenzhen_AZ01", "routerType": 2, "status": "READY", "supportVxlanFlag": false, "enableSnat": false, "shareVpc": false, "externalNetworkID": "20000000000"},
                {"routerID": "2589612", "name": "routers_B20", "userID": "3", "vpcID": "23659850811720056838", "vpcName": "sharedVPC_A06", "azID": "4398789618022268115", "azName": "shenzhen_AZ01", "routerType": 1, "status": "READY", "supportVxlanFlag": false, "enableSnat": false, "shareVpc": true, "externalNetworkID": "0"}
            ], "total": 5};

            response(200, "success", d, {});
        },

        //createRouter
        "POST /goku/rest/v1.5/irm/{vdc_id}/vpcs/{vpcid}/routers": function (original, response) {
            var d =
            {"routerID": "1000000000000000013"}
            response(200, "success", d, {});
        },

        //removeRouter
        "DELETE /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/routers/{id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //modifyRouter
        "PUT /goku/rest/v1.5/irm/{vdc_id}/routers/{router}": function (original, response) {
            response(200, "success", {}, {});
        },

        //getVLAN
        "POST /goku/rest/v1.5/irm/{vdc_id}/vlanpools/action": function (original, response) {
            var d =
            {"associateVlanPool2DVSResp": null, "queryVlanPoolResp": {"vlanpools": [
                {"id": "6", "name": "asdf", "usage": null, "vxLanFlag": false, "startID": 300, "endID": 300, "zoneID": "null", "description": null, "dvses": null},
                {"id": "2", "name": "vlanpool222d", "usage": null, "vxLanFlag": false, "startID": 1901, "endID": 1901, "zoneID": "null", "description": null, "dvses": null},
                {"id": "2", "name": "vlanpool222d", "usage": null, "vxLanFlag": false, "startID": 1903, "endID": 1945, "zoneID": "null", "description": null, "dvses": null},
                {"id": "2", "name": "vlanpool222d", "usage": null, "vxLanFlag": false, "startID": 1947, "endID": 2000, "zoneID": "null", "description": null, "dvses": null}
            ], "total": 4}}
            response(200, "success", d, {});
        },

        // ipBW

        //query
        "GET /goku/rest/v1.5/ipbwtemplates?start={s}&limit={l}": function (original, response) {
            var d;
            d = {"ipbwTemplates": [
                {"ipBwTemplateId": "4616189618054758405", "name": "IP_BW_1411358010281", "maxRxBandwidth": 50, "maxTxBandwidth": 50},
                {"ipBwTemplateId": "4616189618054758401", "name": "IP_BW_1410771415252", "maxRxBandwidth": 500, "maxTxBandwidth": 500}
            ], "total": 2};

            response(200, "success", d, {});
        },

        //create
        "POST /goku/rest/v1.5/ipbwtemplates": function (original, response) {
            var d =
            {"ipBWTemplateID": "4616189618054758418"}
            response(200, "success", d, {});
        },
        "GET /goku/rest/v1.5/irm/1/vpc-authentications?start=0&limit=10&vpc-name=&vpc-id=": function (original, response) {
            var d;
            d = {"vpcAuthList": [
                {"vpcID": "4792750811720056884", "vpcName": "FM_SVA01", "id": "ac90f738-25fe-410f-b0a2-065eff7b21d7", "vdcID": "2"},
                {"vpcID": "4792750811720056881", "vpcName": "sharedVPC_A02", "id": "082943b1-1f9d-416b-a2e6-45f4ca2f4d6a", "vdcID": "2"},
                {"vpcID": "4792750811720056871", "vpcName": "sharedVPC_A06", "id": "71f9d2df-6a14-44b5-8909-749cb55b2434", "vdcID": "2"}
            ], "total": 3};
            response(200, "success", d, {});
        },


        //remove
        "DELETE /goku/rest/v1.5/ipbwtemplates/{id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //modify
        "PUT /goku/rest/v1.5/ipbwtemplates/{id}": function (original, response) {
            response(200, "success", {}, {});
        },

        "GET /goku/rest/": function () {
        },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/dnats?start={start}&limit={limit}" :
            function (original, response)
            {
                var d =
                {"dnats":[{"dnatID":"1","vmID":"4629700416936869889$urn:sites:405507C6:vms:i-000000BA","vmName":"softVM100","nicID":"4629700416936869889$urn:sites:405507C6:vms:i-000000BA:nics:0","nicName":"eth0","privateIp":"192.168.100.100","privatePort":200,"publicIp":"192.168.170.9","publicPort":2000,"startTime":"2014-05-26 11:03:11","endTime":null,"status":'READY',"protocol":"TCP","vpcID":"4792750811720057108","vpcName":"softVPC2"},{"dnatID":"3","vmID":"4629700416936869889$urn:sites:405507C6:vms:i-000000B9","vmName":"hardVM222","nicID":"4629700416936869889$urn:sites:405507C6:vms:i-000000B9:nics:0","nicName":"eth0","privateIp":"192.168.222.222","privatePort":1,"publicIp":"192.168.31.12","publicPort":2000,"startTime":"2014-05-26 16:26:23","endTime":null,"status":'READY',"protocol":"TCP","vpcID":"4792750811720057110","vpcName":"hardVPC"}],"total":2}
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/elasticips?start={start}&limit={limit}" :
            function (original, response)
            {
                var d;
                d = {"elasticIPs": [
                    {"id": "1000000000000000002", "ip": "172.16.70.12", "userID": "20", "vpcID": "4792750811720056836", "usedType": "NO_USE", "vmID": "0", "vmName": null, "nicID": "0", "nicName": null, "privateIP": null, "operateStatus": "NO_OP", "resourceStatus": "UNBIND", "publicIPPoolId": 1000000000000000000, "publicIPPoolName": "publicippool", "externalNetworkId": 0, "externalNetworkName": null, "maxRxBandwidth": 1000, "maxTxBandwidth": 1000, "bandwidthStatus": "SUCCESS", "totalAclRule": 0, "applyTime": "2014-09-24 09:09:17.48", "vpcName": "hardVPC", "shareVpc": false},
                    {"id": "1000000000000000018", "ip": "172.16.67.3", "userID": "20", "vpcID": "4792750811720056837", "usedType": "NO_USE", "vmID": "0", "vmName": null, "nicID": "0", "nicName": null, "privateIP": null, "operateStatus": "NO_OP", "resourceStatus": "UNBIND", "publicIPPoolId": 0, "publicIPPoolName": null, "externalNetworkId": 20000000000, "externalNetworkName": "exterStatic", "maxRxBandwidth": 0, "maxTxBandwidth": 0, "bandwidthStatus": "SUCCESS", "totalAclRule": 0, "applyTime": "2014-09-24 09:00:05.844", "vpcName": "softVPC", "shareVpc": false},
                    {"id": "1000000000000000005", "ip": "172.16.70.15", "userID": "3", "vpcID": "4792750811720056838", "usedType": "VPN", "vmID": "0", "vmName": null, "nicID": "0", "nicName": null, "privateIP": null, "operateStatus": "BIND_SUCCESS", "resourceStatus": "BIND", "publicIPPoolId": 1000000000000000000, "publicIPPoolName": "publicippool", "externalNetworkId": 0, "externalNetworkName": null, "maxRxBandwidth": 200, "maxTxBandwidth": 200, "bandwidthStatus": "SUCCESS", "totalAclRule": 0, "applyTime": "2014-09-24 00:53:52.704", "vpcName": "xiaomeiShare", "shareVpc": true},
                    {"id": "1000000000000000016", "ip": "172.16.67.2", "userID": "11", "vpcID": "4792750811720056837", "usedType": "NO_USE", "vmID": "0", "vmName": null, "nicID": "0", "nicName": null, "privateIP": null, "operateStatus": "NO_OP", "resourceStatus": "UNBIND", "publicIPPoolId": 0, "publicIPPoolName": null, "externalNetworkId": 20000000000, "externalNetworkName": "exterStatic", "maxRxBandwidth": 0, "maxTxBandwidth": 0, "bandwidthStatus": "SUCCESS", "totalAclRule": 0, "applyTime": "2014-09-24 00:07:47.368", "vpcName": "softVPC", "shareVpc": false},
                    {"id": "1000000000000000004", "ip": "172.16.70.14", "userID": "5", "vpcID": "4792750811720056833", "usedType": "VPN", "vmID": "0", "vmName": null, "nicID": "0", "nicName": null, "privateIP": null, "operateStatus": "BIND_SUCCESS", "resourceStatus": "BIND", "publicIPPoolId": 1000000000000000000, "publicIPPoolName": "publicippool", "externalNetworkId": 0, "externalNetworkName": null, "maxRxBandwidth": 50, "maxTxBandwidth": 50, "bandwidthStatus": "SUCCESS", "totalAclRule": 1, "applyTime": "2014-09-24 00:05:11.469", "vpcName": "vpchard", "shareVpc": false},
                    {"id": "1000000000000000003", "ip": "172.16.70.13", "userID": "5", "vpcID": "4792750811720056833", "usedType": "NO_USE", "vmID": "0", "vmName": null, "nicID": "0", "nicName": null, "privateIP": null, "operateStatus": "UNBIND_SUCCESS", "resourceStatus": "UNBIND", "publicIPPoolId": 1000000000000000000, "publicIPPoolName": "publicippool", "externalNetworkId": 0, "externalNetworkName": null, "maxRxBandwidth": 1000, "maxTxBandwidth": 1000, "bandwidthStatus": "SUCCESS", "totalAclRule": 0, "applyTime": "2014-09-24 00:05:08.307", "vpcName": "vpchard", "shareVpc": false},
                    {"id": "1000000000000000000", "ip": "172.16.70.10", "userID": "3", "vpcID": "4792750811720056832", "usedType": "VPN", "vmID": "0", "vmName": null, "nicID": "0", "nicName": null, "privateIP": null, "operateStatus": "BIND_SUCCESS", "resourceStatus": "BIND", "publicIPPoolId": 1000000000000000000, "publicIPPoolName": "publicippool", "externalNetworkId": 0, "externalNetworkName": null, "maxRxBandwidth": 200, "maxTxBandwidth": 200, "bandwidthStatus": "SUCCESS", "totalAclRule": 0, "applyTime": "2014-09-24 00:04:22.873", "vpcName": "share", "shareVpc": true}
                ], "total": 7};

                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/firewall-acls?&start={start}&limit={limit}" :
            function (original, response)
            {
                var d;
                d = {"acls": [
                    {"aclID": "4742290407621132292", "aclType": 2, "vpcID": "4792750811720056833", "vpcName": "vpchard", "totalRules": 1, "shareVpc": false},
                    {"aclID": "4742290407621132293", "aclType": 1, "vpcID": "4792750811720056833", "vpcName": "vpchard", "totalRules": 1, "shareVpc": false}
                ], "total": 10};
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/firewall-rules?start={start}&limit={limit}&direction={direction}&ruletype={ruletype}" :
            function (original, response)
            {
                var d =
                {"firewallRules":[{"firewallRuleID":"1000000000000000036","ruleType":1,"innerZone":null,"outerZone":null,"ruleID":44,"protocol":"TCP","direction":2,"ipAddr":"192.168.11.0","ipPrefix":"255.255.255.0","startPort":34,"endPort":43,"icmpType":null,"icmpCode":null,"action":"permit","eipAddr":null,"networkID":"30000000046","networkName":"hardRoute222","status":0,"vpcID":"4792750811720057110","vpcName":"hardVPC"}],"total":1}
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-gateway" :
            function (original, response)
            {
                var d =
                {"vpngws":[{"basicInfo":{"vpcId":"4792750811720056832","vpcName":"share","vpnGwId":"4","name":"vpnGw","ipAddr":"172.16.70.10","description":null,"shareVpc":true},"dpdInfo":{"dpdInterval":30,"dpdTimeOut":120},"ikePublicInfo":{"pfsGroup":"DH2","lifeTime":86400,"authMethod":0,"authentication":"SHA","encryption":"3DES"},"espPublicInfo":{"authentication":"SHA","encryption":"AES-128"}},{"basicInfo":{"vpcId":"4792750811720056838","vpcName":"xiaomeiShare","vpnGwId":"6","name":"xiaomeiVPNGw","ipAddr":"172.16.70.15","description":null,"shareVpc":true},"dpdInfo":{"dpdInterval":30,"dpdTimeOut":120},"ikePublicInfo":{"pfsGroup":"DH2","lifeTime":86400,"authMethod":0,"authentication":"SHA","encryption":"3DES"},"espPublicInfo":{"authentication":"SHA","encryption":"AES-128"}},{"basicInfo":{"vpcId":"4792750811720056833","vpcName":"vpchard","vpnGwId":"7","name":"1111","ipAddr":"172.16.70.14","description":null,"shareVpc":false},"dpdInfo":{"dpdInterval":30,"dpdTimeOut":120},"ikePublicInfo":{"pfsGroup":"DH1","lifeTime":86400,"authMethod":0,"authentication":"SHA","encryption":"AES-256"},"espPublicInfo":{"authentication":"SHA","encryption":"AES-256"}}]}
                response(200, "success", d, {});
            },
        "DELETE /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-gateway/{id}?sharedVpc={sharedVpc}" :
            function (original, response)
            {
                var d={};
                response(200, "success", d, {});
            },
        "POST /goku/rest/v1.5/irm/{tenant_id}/vpn-gateway" :
            function (original, response)
            {
                var d={};
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections" :
            function (original, response)
            {
                var d = {"vpnConnections": [
                    {"vpcId": "4792750811720056835", "vpcName": "vpc", "vpnConnectionID": "5", "vpnType": 0, "name": "fds", "description": null, "customerGw": {"name": null, "ipAddr": "192.168.1.1", "description": null, "routeInfo": null, "customerSubnets": [
                        {"subnetAddr": "192.168.1.0", "subnetMask": "255.255.255.0"}
                    ]}, "l2tpInfo": null, "localIPAddr": "192.168.1.32", "networkIDs": ["30000000036"], "ikeSharedKey": null, "ikePublicInfo": {"pfsGroup": "DH2", "lifeTime": 86400, "authMethod": 0, "authentication": "SHA", "encryption": "3DES"}, "pfsGroup": "DH2", "lifeTime": 3600, "espPublicInfo": {"authentication": "SHA", "encryption": "3DES"}, "dpdInfo": {"dpdInterval": 30, "dpdIntervalStr": "30", "dpdTimeOut": 120, "dpdTimeOutStr": "120"}, "status": 'FAIL', "createTime": 1404721443782, "lastModifiedTime": 1404721443782, "userId": "15","shareVpc":false},
                    {"vpcId": "4792750811720056835", "vpcName": "vpc", "vpnConnectionID": "2", "vpnType": 0, "name": "sds", "description": null, "customerGw": {"name": null, "ipAddr": "192.168.111.1", "description": null, "routeInfo": null, "customerSubnets": [
                        {"subnetAddr": "192.168.111.0", "subnetMask": "255.255.255.0"}
                    ]}, "l2tpInfo": null, "localIPAddr": "192.168.1.32", "networkIDs": ["30000000036"], "ikeSharedKey": null, "ikePublicInfo": {"pfsGroup": "DH2", "lifeTime": 86400, "authMethod": 0, "authentication": "SHA", "encryption": "3DES"}, "pfsGroup": "DH2", "lifeTime": 3600, "espPublicInfo": {"authentication": "SHA", "encryption": "3DES"}, "dpdInfo": {"dpdInterval": 30, "dpdIntervalStr": "30", "dpdTimeOut": 120, "dpdTimeOutStr": "120"}, "status": 'READY', "createTime": 1404464806469, "lastModifiedTime": 1404464806469, "userId": "8","shareVpc":false},
                    {"vpcId": "4792750811720056835", "vpcName": "vpc", "vpnConnectionID": "1", "vpnType": 0, "name": "124", "description": null, "customerGw": {"name": null, "ipAddr": "192.168.120.11", "description": null, "routeInfo": null, "customerSubnets": [
                        {"subnetAddr": "192.168.111.0", "subnetMask": "255.255.255.0"}
                    ]}, "l2tpInfo": null, "localIPAddr": "192.168.1.32", "networkIDs": ["30000000036"], "ikeSharedKey": null, "ikePublicInfo": {"pfsGroup": "DH2", "lifeTime": 86400, "authMethod": 0, "authentication": "SHA", "encryption": "3DES"}, "pfsGroup": "DH2", "lifeTime": 3600, "espPublicInfo": {"authentication": "SHA", "encryption": "3DES"}, "dpdInfo": {"dpdInterval": 30, "dpdIntervalStr": "30", "dpdTimeOut": 120, "dpdTimeOutStr": "120"}, "status": 'READY', "createTime": 1404460969375, "lastModifiedTime": 1404460969375, "userId": "3","shareVpc":true},
                    {"vpcId": "4792750811720056841", "vpcName": "fdsfa", "vpnConnectionID": "4", "vpnType": 1, "name": "L2TP", "description": null, "customerGw": {"name": null, "ipAddr": null, "description": null, "routeInfo": null, "customerSubnets": null}, "l2tpInfo": {"subnetAddr": "192.168.3.0", "subnetMask": "255.255.255.0", "tunnelKey": null, "oldTunnelKey": null, "vpnUsers": [
                        {"name": "admin", "password": null, "oldPassword": null}
                    ]}, "localIPAddr": "192.168.1.35", "networkIDs": null, "ikeSharedKey": null, "ikePublicInfo": {"pfsGroup": "DH2", "lifeTime": 86400, "authMethod": 0, "authentication": "SHA", "encryption": "3DES"}, "pfsGroup": "DH2", "lifeTime": 3600, "espPublicInfo": {"authentication": "SHA", "encryption": "3DES"}, "dpdInfo": null, "status": 'READY', "createTime": 1404721115535, "lastModifiedTime": 1404721115535, "userId": "15","shareVpc":true}
                ], "total": 4};
                response(200, "success", d, {});
            },
        "DELETE /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections/{id}?userid={userid}" :
            function (original, response)
            {
                var d={};
                response(200, "success", d, {});
            },
        "POST /goku/rest/v1.5/irm/{tenant_id}/vpn-connections" :
            function (original, response)
            {
                var d={};
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections/{id}" :
            function (original, response)
            {
                var d =
                {"vpcId":"4792750811720056841","vpcName":"fdsfa","vpnConnectionID":"4","vpnType":1,"name":"L2TP","description":null,"customerGw":{"name":null,"ipAddr":null,"description":null,"routeInfo":null,"customerSubnets":null},"l2tpInfo":{"subnetAddr":"192.168.3.0","subnetMask":"255.255.255.0","tunnelKey":null,"oldTunnelKey":null,"vpnUsers":[{"name":"admin","password":null,"oldPassword":null}]},"localIPAddr":"192.168.1.35","networkIDs":null,"ikeSharedKey":null,"ikePublicInfo":{"pfsGroup":"DH2","lifeTime":86400,"authMethod":0,"authentication":"SHA","encryption":"3DES"},"pfsGroup":"DH2","lifeTime":3600,"espPublicInfo":{"authentication":"SHA","encryption":"3DES"},"dpdInfo":null,"status":0,"createTime":1404721115535,"lastModifiedTime":1404721115535,"userId":"15"};
                response(200, "success", d, {});
            },
        "POST /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections/{id}?userid={userid}" :
            function (original, response)
            {
                var d={};
                response(200, "success", d, {});
            },
        "PUT /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections/{id}" :
            function (original, response)
            {
                var d={};
                response(200, "success", d, {});
            },
        "DELETE /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections/{id}?userid={userid}" :
            function (original, response)
            {
                var d={};
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/capacity-statistics/resource-networks" :
            function (original, response)
            {
                var d =
                {"networkStatistics":{"internalNetworkTotalNum":1,"directConnectedNetworkTotalNum":1,"routingNetworkTotalNum":2},"publicIpStatistics":{"vpnUsePublicIPTotalNum":1,"vmUsePublicIPTotalNum":1,"hLBUsePublicIPTotalNum":0,"sLBUsePublicIPTotalNum":1,"privateIpUsePublicIPTotalNum":2,"snatUsePublicIPTotalNum":1,"dnatUsePublicIPTotalNum":1,"noUsedPublicIPTotalNum":5},"vpnStatistics":{"vpnConnectionTotalNum":1},"vpcStatistics":{"sharedVpcTotalNum":2,"noSharedVpcTotalNum":4},"aclStatistics":{"interDomainAclTotalNum":3,"interAclTotalNum":3},"routerStatistics":{"hardRouterTotalNum":0,"softRouterTotalNum":3},"securityGroupStatistics":{"defaultSGTotalNum":3,"userSGTotalNum":3}}
                response(200, "success", d, {});
            },
        // getSecRule
        "GET /goku/rest/v1.5/irm/cloudObject-rules?start={s}&limit={l}" :
            function (original, response)
            {
                var d =
                {"cloudObjectSGRuleInfos":[{"id":"1000000000000000003","status":"READY","ruleName":"r2","dstCloudObjectType":"AZ","dstCloudObjectId":"4616189618054758401","dstCloudObjectName":"az","srcCloudObjectType":"IPRANGE","srcCloudObjectId":null,"srcCloudObjectName":null,"ipProtocol":"Any","ipRange":"192.168.1.3-192.168.1.4","fromPort":-1,"toPort":-1,"action":1,"priority":1},{"id":"1000000000000000002","status":"READY","ruleName":"r1","dstCloudObjectType":"CLUSTER","dstCloudObjectId":"4625196817309499393","dstCloudObjectName":"ManagementCluster","srcCloudObjectType":"IPRANGE","srcCloudObjectId":null,"srcCloudObjectName":null,"ipProtocol":"Any","ipRange":"192.168.1.1-192.168.1.2","fromPort":-1,"toPort":-1,"action":1,"priority":2}],"total":2}
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroups?start={start}&limit={limit}" :
            function (original, response)
            {
                var d;
                d = {"sgs": [
                    {"sgID": "1000000000000000004", "name": "ggg", "description": "kkk", "vpcID": "4792750811720056837", "intraTrafficAllow": 0, "sgMemberCount": 0, "sgRuleCount": 0, "canAccessSGs": null, "vpcName": "softVPC", "shareVpc": false},
                    {"sgID": "1000000000000000003", "name": "testSG", "description": null, "vpcID": "4792750811720056837", "intraTrafficAllow": 1, "sgMemberCount": 0, "sgRuleCount": 2, "canAccessSGs": null, "vpcName": "softVPC", "shareVpc": false},
                    {"sgID": "1000000000000000002", "name": "sg2", "description": "sdszc", "vpcID": "4792750811720056833", "intraTrafficAllow": 0, "sgMemberCount": 0, "sgRuleCount": 1, "canAccessSGs": null, "vpcName": "vpchard", "shareVpc": false},
                    {"sgID": "1000000000000000001", "name": "sg", "description": null, "vpcID": "4792750811720056833", "intraTrafficAllow": 1, "sgMemberCount": 0, "sgRuleCount": 2, "canAccessSGs": null, "vpcName": "vpchard", "shareVpc": false}
                ], "total": 4};
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroup-rules?securitygroupid={securitygroupid}&start={start}&limit={limit}" :
            function (original, response)
            {
                var d =
                {"rules":[{"ruleID":"1","ipProtocol":"TCP","ipRange":"192.168.1.1-192.168.1.2","allowedSGID":"0","fromPort":1,"toPort":2,"status":"READY","action":0,"priority":0,"allowedMac":null,"allowedNicId":"0","direction":0}],"total":1}
                response(200, "success", d, {});
            },
        "POST /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroups/action" :
            function (original, response)
            {
                var d =
                {"querySGMemberResp":{"vms":[{"vmID":"4629700416936869889$urn:sites:405507C6:vms:i-000000B9","vmName":"hardVM222","vnics":[{"nicID":"4629700416936869889$urn:sites:405507C6:vms:i-000000B9:nics:0","ip":"192.168.222.222","status":"READY"}]}],"total":1},"addVM2SGResp":null,"removeVMFromSGResp":null}
                response(200, "success", d, {});
            },
        "GET /goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/aspf" :
            function (original, response)
            {
                var d =
                {"aspfInfos":[{"vpcID":"4792750811720056832","vpcName":"share","status":0,"dns":false,"ftp":false,"ils":false,"msn":false,"qq":false,"h323":false,"netbios":false,"sip":false,"mgcp":false,"mms":false,"rtsp":false,"pptp":false,"sqlnet":false,"shareVpc":true},{"vpcID":"4792750811720056836","vpcName":"hardVPC","status":0,"dns":false,"ftp":false,"ils":false,"msn":false,"qq":false,"h323":false,"netbios":false,"sip":false,"mgcp":false,"mms":false,"rtsp":false,"pptp":false,"sqlnet":false,"shareVpc":false},{"vpcID":"4792750811720056833","vpcName":"vpchard","status":0,"dns":true,"ftp":true,"ils":true,"msn":false,"qq":false,"h323":false,"netbios":true,"sip":false,"mgcp":false,"mms":true,"rtsp":false,"pptp":false,"sqlnet":false,"shareVpc":false},{"vpcID":"4792750811720056838","vpcName":"xiaomeiShare","status":0,"dns":false,"ftp":false,"ils":false,"msn":false,"qq":false,"h323":false,"netbios":false,"sip":false,"mgcp":false,"mms":false,"rtsp":false,"pptp":false,"sqlnet":false,"shareVpc":true}]}
                response(200, "success", d, {});
            }
    });

    return fixture;
});
